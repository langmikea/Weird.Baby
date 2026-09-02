<#
.SYNOPSIS
  Unattended wrapper around backup-guestbook.ps1 for Windows Task Scheduler.

.DESCRIPTION
  Runs the read-only guestbook/D1 export (backup-guestbook.ps1) and then commits
  the new files in backups/ to the LOCAL git history. It does NOT push — the
  operator pushes (per repo workflow). Every run is appended to a log file so an
  unattended (scheduled) run leaves an audit trail.

  Read-only with respect to the D1 database: it only invokes the existing export
  script, which uses `wrangler d1 export` / `wrangler d1 execute` (SELECT only).
  It never writes to, deletes from, or alters D1.

  AUTH: requires non-interactive Cloudflare auth. Recommended: a scoped
  CLOUDFLARE_API_TOKEN (permission D1:Read) set as a *user* environment variable
  by the operator. A prior `wrangler login` also works but can expire/revoke
  silently. See backups/README.md > "Automated backups".

.NOTES
  Intended to be launched by Task Scheduler, not by hand (though it is safe to
  run by hand). Exit code 0 on a successful export (commit-nothing is not a
  failure); non-zero if the export itself fails.

  Optional switches:
    -NoCommit   Produce the export files but skip the local git commit.
#>

[CmdletBinding()]
param(
    [switch]$NoCommit,
    [switch]$NoPush
)

$ErrorActionPreference = "Stop"

function Invoke-Git {
    param([Parameter(ValueFromRemainingArguments=$true)][string[]]$GitArgs)
    # Run git, merge stderr into stdout for logging, never throw on stderr.
    $old = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    $out = & git @GitArgs 2>&1
    $code = $LASTEXITCODE
    $ErrorActionPreference = $old
    if ($out) { Add-Content -Path $logFile -Value ($out | Out-String) -Encoding utf8 }
    return $code
}

# Repo root = parent of this script's tools/ directory.
$repoRoot   = Split-Path -Parent $PSScriptRoot
$logDir     = Join-Path $repoRoot "backups"
$logFile    = Join-Path $logDir   "scheduled-run.log"   # *.log is gitignored
$runStamp   = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm:ss") + "Z"

function Write-Log {
    param([string]$Message)
    $line = "[{0}] {1}" -f $runStamp, $Message
    Write-Host $line
    Add-Content -Path $logFile -Value $line -Encoding utf8
}

if (-not (Test-Path $logDir)) { New-Item -ItemType Directory -Path $logDir | Out-Null }

Write-Log "=== scheduled guestbook backup START ==="
Write-Log "Repo: $repoRoot"

# 1) Run the read-only export. Capture its output into the log.
try {
    $exportScript = Join-Path $PSScriptRoot "backup-guestbook.ps1"
    $output = & $exportScript 2>&1 | Out-String
    Add-Content -Path $logFile -Value $output -Encoding utf8
    Write-Log "Export completed OK."
}
catch {
    Write-Log ("EXPORT FAILED: " + $_.Exception.Message)
    Write-Log "=== scheduled guestbook backup END (failure) ==="
    exit 1
}

# 2) Commit the new files locally (no push). Commit-nothing is not an error.
if ($NoCommit) {
    Write-Log "NoCommit set - skipping local commit. Files left in backups/ for manual commit."
    Write-Log "=== scheduled guestbook backup END (ok, no commit) ==="
    exit 0
}

try {
    Set-Location $repoRoot

    # Recover any index lock / partial state that may bleed in from other tooling.
    if (Test-Path .git\index.lock) { Remove-Item .git\index.lock -Force }

    $null = Invoke-Git add -f backups/   # -f: backups/ has been gitignored since 2026-06-02, so a plain add staged nothing and every run since then would have ended "nothing to commit"

    # Anything staged under backups/?
    $staged = Invoke-Git diff --cached --quiet -- backups/
    if ($staged -eq 0) {
        Write-Log "No new backup files to commit (nothing staged). Done."
        Write-Log "=== scheduled guestbook backup END (ok, nothing to commit) ==="
        exit 0
    }

    $commitStamp = (Get-Date).ToUniversalTime().ToString("yyyyMMdd-HHmmss") + "Z"
    $msg = "backup: weird-baby D1 guestbook snapshot $commitStamp (scheduled)"
    $rc = Invoke-Git commit -m $msg
    if ($rc -ne 0) {
        Write-Log "LOCAL COMMIT FAILED (rc=$rc) (files are on disk, commit manually)"
        Write-Log "=== scheduled guestbook backup END (ok export, commit failed) ==="
        exit 0
    }
    Write-Log "Committed locally: $msg"

    if ($NoPush) {
        Write-Log "NoPush set - skipping push. Local commit only."
        Write-Log "=== scheduled guestbook backup END (ok, committed, no push) ==="
        exit 0
    }

    # Push is best-effort: a local commit is already a valid backup. A push
    # failure (no network / creds expired) must NOT fail the run.
    $pc = Invoke-Git push origin main
    if ($pc -eq 0) {
        Write-Log "Pushed to origin/main."
        Write-Log "=== scheduled guestbook backup END (ok, committed + pushed) ==="
    } else {
        Write-Log "PUSH FAILED (rc=$pc) - local commit is intact; push manually. Check creds/network."
        Write-Log "=== scheduled guestbook backup END (ok committed, push failed) ==="
    }
    exit 0
}
catch {
    # The export already succeeded and the files are on disk; a commit hiccup
    # should not mask that. Log it and exit 0 so the backup itself counts.
    Write-Log ("LOCAL COMMIT FAILED (files are on disk, commit manually): " + $_.Exception.Message)
    Write-Log "=== scheduled guestbook backup END (ok export, commit failed) ==="
    exit 0
}
