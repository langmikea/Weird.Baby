<#
.SYNOPSIS
  retag_v1.ps1 - MediaVault taxonomy v1 retag (host-side, gated, server-mediated writes).

.DESCRIPTION
  Promotes every live `unsorted:*` tag to its v1 destination namespace per
  docs/taxonomy/NORMALIZATION_MAP.md, for ALL 185 artifacts (including archived).

  SOURCE RULE (read):  the live tag set is read ONLY from the running MediaVault
                       server at $Server via GET /db (the raw committed SQLite,
                       same bytes the server writes). No Drive/JSON export is ever read.
  WRITE RULE:          the ONLY writer is POST /api/artifact-update on the server.
                       This script never opens the SQLite file for writing and never
                       bypasses the server's single coordinated tag writer (artifact_tags
                       §4.5). Cowork authored this script but writes NO live data; Mike runs it.
  PERSISTENCE:         this script lives in the repo (tools/), its run reports land in _cowork/.

  TRANSFORM (per artifact):
    new_tags = (current tags with every `unsorted:<v>` replaced by MAP[<v>], the
               `unsorted:*` tag itself dropped) UNION (all other current tags).
    - Merge-pairs in the map (e.g. instagram_hacked + hacked_account ->
      attributes:account_hacked) collapse naturally via the set union.
    - `type:` is MULTI-VALUE: subtypes are kept alongside parents and NOTHING is
      cross-deduped (this script deliberately does NOT apply the map §3
      type:audio+type:mp3 collapse; that is a separate Tier-2 concern).
    - Every output tag must be namespaced `namespace:value` (ns [a-z0-9_]+,
      value [a-z0-9_-]+, exactly one colon) or the endpoint returns 400. Any
      artifact whose computed set would contain a bare/invalid slug is SKIPPED+flagged,
      never POSTed.
    - Any `unsorted:*` value not present in the map -> SKIP+flag (no silent drop).

  CROSS-POST GUARD: an artifact carrying 2+ distinct `source:*` tags is NOT
    auto-resolved. It is printed, SKIPPED, and collected into the
    "needs Mike's eyeball" list. (008 keep-tiktok / 011 drop-both were decided
    in a prior pass and are now single-source; treat any new multi-source as pause-and-flag.)

  ALREADY-CORRECT DETECTION: if an artifact's computed set already equals its live
    set (sorted/unique), it is a no-op and skipped. The 6 previously-retagged
    artifacts fall out here automatically (or, under -Apply with no batch limit and
    -Force, would re-POST idempotently to a 0-diff no-op).

.PARAMETER Server      MediaVault base URL. Default http://127.0.0.1:51822
.PARAMETER MapPath     NORMALIZATION_MAP.md path. Default: <repo>/docs/taxonomy/NORMALIZATION_MAP.md
.PARAMETER ReportDir   Where run reports are written. Default: <repo>/_cowork
.PARAMETER PythonExe   Python interpreter used ONLY to read the GET /db SQLite bytes
                       into JSON (MediaVault already requires Python). Auto-detected.
.PARAMETER DryRun      Print every old->new diff, POST nothing. This is the DEFAULT
                       whenever -Apply is absent.
.PARAMETER Apply       Perform writes via POST /api/artifact-update.
.PARAMETER Batch       With -Apply: write only the next N pending changes, then stop (the gate).
                       0 (default) = write all remaining pending changes.

.EXAMPLE
  pwsh -File tools/retag_v1.ps1                 # dry-run: full old->new diff, no writes
  pwsh -File tools/retag_v1.ps1 -Apply -Batch 5  # write only the next 5, re-read each, stop
  pwsh -File tools/retag_v1.ps1 -Apply           # write the rest, halt on any error/mismatch
#>
[CmdletBinding()]
param(
    [string]$Server    = 'http://127.0.0.1:51822',
    [string]$MapPath,
    [string]$ReportDir,
    [string]$PythonExe,
    [switch]$DryRun,
    [switch]$Apply,
    [int]$Batch = 0
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

# ---- paths ----------------------------------------------------------------
$RepoRoot = Split-Path -Parent $PSScriptRoot
if (-not $MapPath)   { $MapPath   = Join-Path $RepoRoot 'docs/taxonomy/NORMALIZATION_MAP.md' }
if (-not $ReportDir) { $ReportDir = Join-Path $RepoRoot '_cowork' }
$Server = $Server.TrimEnd('/')

# ---- §3.1 tag form --------------------------------------------------------
$NsRe  = '^[a-z0-9_]+$'
$ValRe = '^[a-z0-9_-]+$'
function Test-TagForm([string]$t) {
    if ($t -notmatch ':') { return $false }
    $i = $t.IndexOf(':')
    $ns = $t.Substring(0, $i)
    $val = $t.Substring($i + 1)
    if ($ns -eq '' -or $val -eq '') { return $false }
    if ($val.Contains(':'))         { return $false }
    if ($ns  -notmatch $NsRe)       { return $false }
    if ($val -notmatch $ValRe)      { return $false }
    return $true
}

# ---- python locator (only used to turn GET /db bytes into JSON) -----------
function Resolve-Python {
    $cands = @()
    if ($PythonExe) {
        $cands += [pscustomobject]@{ Exe = $PythonExe; Args = @() }
    }
    $cands += [pscustomobject]@{ Exe = 'python';  Args = @() }
    $cands += [pscustomobject]@{ Exe = 'python3'; Args = @() }
    $cands += [pscustomobject]@{ Exe = 'py';      Args = @('-3') }
    foreach ($c in $cands) {
        try {
            & $c.Exe @($c.Args) --version *> $null
            if ($LASTEXITCODE -eq 0) { return $c }
        } catch { }
    }
    throw "No Python interpreter found (tried python, python3, py -3). Pass -PythonExe. " +
          "MediaVault already requires Python; this script uses it only to read the GET /db SQLite into JSON."
}
$script:Py = Resolve-Python

$DumpPy = @'
import sqlite3, json, sys
db = sys.argv[1]
con = sqlite3.connect("file:%s?mode=ro" % db, uri=True)
rows = con.execute("SELECT id, status, source_url, tags FROM artifacts ORDER BY id").fetchall()
out = []
for rid, status, surl, tags in rows:
    try:
        tl = json.loads(tags or "[]")
    except Exception:
        tl = []
    out.append({"id": rid, "status": status, "source_url": surl or "", "tags": tl})
sys.stdout.write(json.dumps(out))
'@

# Read the live artifact set from the RUNNING SERVER via GET /db.
function Get-LiveArtifacts {
    $tmp = Join-Path ([System.IO.Path]::GetTempPath()) ("mv_live_{0}.sqlite" -f ([guid]::NewGuid().ToString('N')))
    try {
        Invoke-WebRequest -Uri "$Server/db" -OutFile $tmp -UseBasicParsing | Out-Null
        $json = $DumpPy | & $script:Py.Exe @($script:Py.Args) - $tmp
        if ($LASTEXITCODE -ne 0) { throw "python /db read failed (exit $LASTEXITCODE)" }
        $raw = ($json -join "")
        return ,(@($raw | ConvertFrom-Json))
    } finally {
        Remove-Item $tmp -ErrorAction SilentlyContinue
    }
}

# ---- load the normalization map -------------------------------------------
function Get-NormalizationMap([string]$path) {
    if (-not (Test-Path $path)) { throw "normalization map not found: $path" }
    $map = @{}
    $rowRe = '^\|\s*`unsorted:([^`]+)`\s*\|\s*`([^`]+)`\s*\|'
    foreach ($line in Get-Content -LiteralPath $path) {
        $m = [regex]::Match($line, $rowRe)
        if ($m.Success) {
            $src  = $m.Groups[1].Value.Trim()
            $dest = $m.Groups[2].Value.Trim()
            $map[$src] = $dest
        }
    }
    if ($map.Count -eq 0) { throw "parsed 0 rows from map (parser/format drift?): $path" }
    return $map
}

# ---- compute intended set for one artifact --------------------------------
# Returns a PSCustomObject: Id, Status, Old[], New[], Added[], Removed[],
#   Action in {noop, change, skip-xpost, skip-flag}, Reason
function Get-Intended($a, $map) {
    $cur = @($a.tags)
    $sources = @($cur | Where-Object { $_ -like 'source:*' } | Sort-Object -Unique)

    $oldSorted = @($cur | Sort-Object -Unique)

    # cross-post guard: 2+ distinct source: tags -> pause-and-flag
    if ($sources.Count -gt 1) {
        return [pscustomobject]@{
            Id=$a.id; Status=$a.status; Old=$oldSorted; New=$oldSorted;
            Added=@(); Removed=@(); Action='skip-xpost';
            Reason=("multiple source tags: " + ($sources -join ', '))
        }
    }

    $new = New-Object System.Collections.Generic.HashSet[string]
    foreach ($t in $cur) {
        if ($t -like 'unsorted:*') {
            $v = $t.Substring('unsorted:'.Length)
            if ($map.ContainsKey($v)) {
                [void]$new.Add($map[$v])
            } else {
                return [pscustomobject]@{
                    Id=$a.id; Status=$a.status; Old=$oldSorted; New=$oldSorted;
                    Added=@(); Removed=@(); Action='skip-flag';
                    Reason=("unmapped unsorted value: " + $t)
                }
            }
        } else {
            [void]$new.Add($t)
        }
    }

    $newArr = @($new) | Sort-Object -Unique
    $bad = @($newArr | Where-Object { -not (Test-TagForm $_) })
    if ($bad.Count -gt 0) {
        return [pscustomobject]@{
            Id=$a.id; Status=$a.status; Old=$oldSorted; New=$oldSorted;
            Added=@(); Removed=@(); Action='skip-flag';
            Reason=("would emit invalid/bare slug(s): " + ($bad -join ', '))
        }
    }

    $added   = @($newArr | Where-Object { $oldSorted -notcontains $_ })
    $removed = @($oldSorted | Where-Object { $newArr -notcontains $_ })
    $action  = if ($added.Count -eq 0 -and $removed.Count -eq 0) { 'noop' } else { 'change' }

    return [pscustomobject]@{
        Id=$a.id; Status=$a.status; Old=$oldSorted; New=$newArr;
        Added=$added; Removed=$removed; Action=$action; Reason=''
    }
}

# ---- POST one write -------------------------------------------------------
function Invoke-ArtifactUpdate([string]$id, [string[]]$tags) {
    # Manual JSON so a single-element tags array always serializes as a JSON array
    # (Windows PowerShell ConvertTo-Json collapses 1-element arrays). Tags are
    # already validated to [a-z0-9_:-], so no escaping is required.
    $tagsJson = '[' + (($tags | ForEach-Object { '"' + $_ + '"' }) -join ',') + ']'
    $body = '{"id":"' + $id + '","fields":{"tags":' + $tagsJson + '}}'
    try {
        return Invoke-RestMethod -Uri "$Server/api/artifact-update" -Method Post `
                                 -ContentType 'application/json' -Body $body
    } catch {
        $msg = $_.Exception.Message
        $resp = $_.Exception.Response
        if ($resp) {
            try {
                $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
                $msg = $sr.ReadToEnd()
            } catch { }
        }
        throw "POST /api/artifact-update failed for ${id}: $msg"
    }
}

# ===========================================================================
# MAIN
# ===========================================================================
$mode = if ($Apply) { if ($Batch -gt 0) { "APPLY (batch $Batch)" } else { "APPLY (all remaining)" } } else { 'DRY-RUN' }
Write-Host "=== MediaVault retag v1 [$mode] ===" -ForegroundColor Cyan
Write-Host "Server : $Server"
Write-Host "Map    : $MapPath"

# preflight: server must be up (it is both the read source and the only writer)
try {
    $ping = Invoke-RestMethod -Uri "$Server/ping" -Method Get -TimeoutSec 10
    if (-not $ping.ok) { throw "ping returned not-ok" }
} catch {
    throw "MediaVault server not reachable at $Server (GET /ping). Start it, then retry. ($($_.Exception.Message))"
}

$map      = Get-NormalizationMap $MapPath
$live     = Get-LiveArtifacts
Write-Host ("Live artifacts read from /db: {0}" -f $live.Count)
if ($live.Count -ne 185) {
    Write-Warning ("expected 185 artifacts, server returned {0} - continuing, but review." -f $live.Count)
}

# plan every artifact
$plan = foreach ($a in $live) { Get-Intended $a $map }

$changes  = @($plan | Where-Object { $_.Action -eq 'change' })
$noops    = @($plan | Where-Object { $_.Action -eq 'noop' })
$xposts   = @($plan | Where-Object { $_.Action -eq 'skip-xpost' })
$flags    = @($plan | Where-Object { $_.Action -eq 'skip-flag' })

# archived + duplicate-family surfacing (informational, for possible future deletion)
$archived = @($live | Where-Object { $_.status -eq 'archived' } | ForEach-Object { $_.id })
$dupGroups = $live | Where-Object { $_.source_url } | Group-Object source_url | Where-Object { $_.Count -gt 1 }

Write-Host ""
Write-Host ("Plan: {0} change, {1} no-op (already-correct), {2} cross-post skip, {3} flagged skip" -f `
            $changes.Count, $noops.Count, $xposts.Count, $flags.Count) -ForegroundColor Yellow
Write-Host ""

# full old->new diff (always printed)
foreach ($p in ($changes | Sort-Object Id)) {
    Write-Host ("CHANGE  {0}  [{1}]" -f $p.Id, $p.Status) -ForegroundColor Green
    Write-Host ("   old: {0}" -f ($p.Old -join ', '))
    Write-Host ("   new: {0}" -f ($p.New -join ', '))
    Write-Host ("   +{0}  -{1}" -f ($p.Added -join ','), ($p.Removed -join ','))
}
foreach ($p in ($xposts | Sort-Object Id)) {
    Write-Host ("SKIP(xpost) {0} -> {1}" -f $p.Id, $p.Reason) -ForegroundColor Magenta
}
foreach ($p in ($flags | Sort-Object Id)) {
    Write-Host ("SKIP(flag)  {0} -> {1}" -f $p.Id, $p.Reason) -ForegroundColor Red
}

# ---- write phase ----------------------------------------------------------
$written = New-Object System.Collections.Generic.List[object]
$halted  = $null
if ($Apply) {
    $queue = @($changes | Sort-Object Id)
    $limit = if ($Batch -gt 0) { [Math]::Min($Batch, $queue.Count) } else { $queue.Count }
    Write-Host ""
    Write-Host ("Writing {0} of {1} pending change(s)..." -f $limit, $queue.Count) -ForegroundColor Cyan

    for ($i = 0; $i -lt $limit; $i++) {
        $p = $queue[$i]
        try {
            $resp = Invoke-ArtifactUpdate $p.Id $p.New
            if (-not $resp.ok) { throw "server returned ok=false for $($p.Id)" }

            # re-read THIS artifact from the live server and confirm it matches intended.
            # NOTE: Get-LiveArtifacts returns ONE object (the whole 185-row array, comma-wrapped
            # via `,(@(...))`). Capture it to a variable FIRST so the pipeline enumerates rows.
            # Piping the function output straight into Where-Object passes the entire array
            # through as a single pipeline item; `$_.id` then member-enumerates to all 185 ids,
            # which `-eq $p.Id` still matches (truthy), so `$after` became the whole 185-row
            # array and `$after.tags` the whole-DB tag vocabulary -> false post-write halt.
            $all   = Get-LiveArtifacts
            $after = @($all | Where-Object { $_.id -eq $p.Id })
            if ($after.Count -ne 1) { throw "re-read: expected 1 row for $($p.Id), got $($after.Count)" }
            $liveNow = @($after[0].tags | Sort-Object -Unique)
            $intended = @($p.New | Sort-Object -Unique)
            if (($liveNow -join '|') -ne ($intended -join '|')) {
                throw ("post-write mismatch for {0}`n   intended: {1}`n   live:     {2}" -f `
                       $p.Id, ($intended -join ', '), ($liveNow -join ', '))
            }
            $written.Add([pscustomobject]@{
                Id=$p.Id; Added=@($resp.added); Removed=@($resp.removed); Old=$p.Old; New=$p.New })
            Write-Host ("  OK  {0}  +{1}  -{2}" -f $p.Id, (@($resp.added) -join ','), (@($resp.removed) -join ',')) -ForegroundColor Green
        } catch {
            $halted = $_.Exception.Message
            Write-Host ("  HALT at {0}: {1}" -f $p.Id, $halted) -ForegroundColor Red
            break
        }
    }

    $remaining = $queue.Count - $written.Count
    Write-Host ""
    if ($halted) {
        Write-Host ("HALTED. {0} written, {1} pending change(s) remain." -f $written.Count, $remaining) -ForegroundColor Red
    } elseif ($Batch -gt 0 -and $remaining -gt 0) {
        Write-Host ("Batch done. {0} written, {1} pending change(s) remain. Re-run -Apply -Batch N to continue." -f `
                    $written.Count, $remaining) -ForegroundColor Yellow
    } else {
        Write-Host ("Apply complete. {0} written, {1} pending change(s) remain." -f $written.Count, $remaining) -ForegroundColor Green
    }
} else {
    Write-Host ""
    Write-Host "DRY-RUN: nothing written. Review the diff above, then run -Apply -Batch 5." -ForegroundColor Yellow
}

# ---- run report to _cowork/ ----------------------------------------------
if (-not (Test-Path $ReportDir)) { New-Item -ItemType Directory -Path $ReportDir -Force | Out-Null }
$stamp = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$reportPath = Join-Path $ReportDir ("RETAG_RUN_REPORT-$stamp.md")

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine("# Retag v1 run report - $stamp")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("- **Mode:** $mode")
[void]$sb.AppendLine("- **Server:** $Server")
[void]$sb.AppendLine("- **Map:** $MapPath")
[void]$sb.AppendLine("- **Live artifacts:** $($live.Count)")
[void]$sb.AppendLine("- **Plan:** $($changes.Count) change, $($noops.Count) no-op, $($xposts.Count) cross-post skip, $($flags.Count) flagged skip")
if ($Apply) { [void]$sb.AppendLine("- **Written this run:** $($written.Count)" + $(if ($halted) { " (HALTED: $halted)" } else { "" })) }
[void]$sb.AppendLine("")
[void]$sb.AppendLine("## Per-artifact old -> new (changes)")
[void]$sb.AppendLine("")
foreach ($p in ($changes | Sort-Object Id)) {
    [void]$sb.AppendLine("### $($p.Id)  [$($p.Status)]")
    [void]$sb.AppendLine("- old: ``$($p.Old -join ', ')``")
    [void]$sb.AppendLine("- new: ``$($p.New -join ', ')``")
    [void]$sb.AppendLine("- +[$($p.Added -join ', ')]  -[$($p.Removed -join ', ')]")
    $wrote = $written | Where-Object { $_.Id -eq $p.Id }
    if ($wrote) { [void]$sb.AppendLine("- **WRITTEN** (server +[$($wrote.Added -join ', ')]  -[$($wrote.Removed -join ', ')])") }
    [void]$sb.AppendLine("")
}
[void]$sb.AppendLine("## Skipped / flagged - needs Mike's eyeball")
[void]$sb.AppendLine("")
if ($xposts.Count -eq 0 -and $flags.Count -eq 0) {
    [void]$sb.AppendLine("_None. No multi-source cross-post conflicts and no unmapped/invalid slugs._")
} else {
    foreach ($p in ($xposts | Sort-Object Id)) { [void]$sb.AppendLine("- **cross-post** $($p.Id): $($p.Reason)") }
    foreach ($p in ($flags  | Sort-Object Id)) { [void]$sb.AppendLine("- **flag** $($p.Id): $($p.Reason)") }
}
[void]$sb.AppendLine("")
[void]$sb.AppendLine("## Archived / duplicate families (informational - possible future deletion)")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("Archived rows: " + $(if ($archived.Count) { '`' + ($archived -join ', ') + '`' } else { '_none_' }))
[void]$sb.AppendLine("")
[void]$sb.AppendLine("Shared source_url groups (>1 artifact - candidate duplicates):")
if (-not $dupGroups) {
    [void]$sb.AppendLine("- _none_")
} else {
    foreach ($g in $dupGroups) {
        $ids = @($g.Group | ForEach-Object { $_.id }) -join ', '
        [void]$sb.AppendLine("- $($g.Count)x ``$($g.Name)`` -> $ids")
    }
}
[void]$sb.AppendLine("")
[void]$sb.AppendLine("## Final tally")
[void]$sb.AppendLine("")
$retagged = if ($Apply) { $written.Count } else { 0 }
$skipFlag = $xposts.Count + $flags.Count
[void]$sb.AppendLine("**$retagged retagged this run, $skipFlag skipped/flagged, count still $($live.Count).**")
if (-not $Apply) { [void]$sb.AppendLine("`n(DRY-RUN: $($changes.Count) changes pending; 0 written.)") }

Set-Content -LiteralPath $reportPath -Value $sb.ToString() -Encoding UTF8
Write-Host ""
Write-Host "Report written: $reportPath" -ForegroundColor Cyan

if ($halted) { exit 1 }
