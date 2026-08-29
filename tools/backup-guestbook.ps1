<# ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. #>
<#
.SYNOPSIS
  Export the weird-baby D1 database (guestbook + visits) to durable, committed
  backup files under backups/.

.DESCRIPTION
  Runs read-only `wrangler d1 export` / `wrangler d1 execute` against the REMOTE
  D1 instance (binding: weird_baby_db, database: weird-baby-db). Produces three
  timestamped artifacts in backups/:

    weird-baby-db-<ts>.sql   full DB export (schema + all rows, re-importable)
    guestbook-<ts>.sql       guestbook table only (schema + INSERTs)
    guestbook-<ts>.json      guestbook rows as a clean JSON array (human-readable)

  Read-only. Never writes to, deletes from, or alters the D1 database or schema.
  Requires the operator to be authenticated to Cloudflare (wrangler login /
  CLOUDFLARE_API_TOKEN). No credentials are stored by this script.

.NOTES
  Run from the repo root:  .\tools\backup-guestbook.ps1
  If SmartScreen flags the file as downloaded: Unblock-File .\tools\backup-guestbook.ps1
#>

$ErrorActionPreference = "Stop"

# Resolve repo root = parent of this script's tools/ directory, and run there.
$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

$backupsDir = Join-Path $repoRoot "backups"
if (-not (Test-Path $backupsDir)) { New-Item -ItemType Directory -Path $backupsDir | Out-Null }

$ts  = (Get-Date).ToUniversalTime().ToString("yyyyMMdd-HHmmss") + "Z"
$db  = "weird-baby-db"

$fullSql  = Join-Path $backupsDir "weird-baby-db-$ts.sql"
$gbSql    = Join-Path $backupsDir "guestbook-$ts.sql"
$gbJson   = Join-Path $backupsDir "guestbook-$ts.json"

Write-Host "== weird-baby D1 backup  ($ts) ==" -ForegroundColor Cyan
Write-Host "Repo: $repoRoot"
Write-Host ""

# 1) Full database export (schema + data, all tables) — the durable re-importable backup.
Write-Host "[1/3] Full DB export -> $fullSql"
npx wrangler d1 export $db --remote --output $fullSql

# 2) Guestbook-only SQL export (schema + INSERTs for just the guestbook table).
Write-Host "[2/3] Guestbook table export -> $gbSql"
npx wrangler d1 export $db --remote --table guestbook --output $gbSql

# 3) Guestbook rows as a clean JSON array (human-readable, easy to diff/verify).
Write-Host "[3/3] Guestbook JSON -> $gbJson"
$raw = npx wrangler d1 execute $db --remote --command "SELECT * FROM guestbook ORDER BY signed_at" --json | Out-String
$parsed = $raw | ConvertFrom-Json
# wrangler --json returns an array of result objects; rows live under .results
$rows = if ($parsed -is [System.Array]) { $parsed[0].results } else { $parsed.results }
$rows | ConvertTo-Json -Depth 6 | Out-File -FilePath $gbJson -Encoding utf8

$count = @($rows).Count
Write-Host ""
Write-Host "Guestbook entries exported: $count" -ForegroundColor Green
$rows | ForEach-Object { Write-Host ("  - {0}  ({1})" -f $_.name, $_.signed_at) }
Write-Host ""
Write-Host "Files written:" -ForegroundColor Cyan
Write-Host "  $fullSql"
Write-Host "  $gbSql"
Write-Host "  $gbJson"
Write-Host ""
Write-Host "Next: git add backups/ ; git commit ; git push   (see backups/README.md)"
