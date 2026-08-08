# =============================================================================
# THE DESKTOP SHORTCUT FOR THE OPS DESK. [S1 2026-08-07, THE NIGHT DESK]
# -----------------------------------------------------------------------------
# MIKE: "one .lnk on his desktop pointing at it. Name it plainly. Verify the
# shortcut works from a clean double-click."
#
#     powershell -ExecutionPolicy Bypass -File tools\ops-desk-shortcut.ps1
#
# IT IS IDEMPOTENT. Running it again overwrites the same .lnk with the same
# target, so it is safe to re-run after moving the repo or after Windows loses
# the icon. It creates nothing else and deletes nothing.
#
# WHY A .lnk TO AN .html AND NOT A .url OR A BATCH FILE:
#   · a .url is an internet shortcut and Windows hands file:// ones to the
#     default browser inconsistently across builds;
#   · a .bat flashes a console window every time it is used;
#   · a .lnk to the file itself opens in the default browser, keeps the folder
#     icon, and survives a browser change without being edited.
#
# THE TARGET IS RESOLVED FROM THIS SCRIPT'S OWN LOCATION, not typed. A shortcut
# holding a hard-coded path is a shortcut that breaks silently the day the repo
# moves, and a launcher that opens nothing is worse than no launcher at all --
# the same reasoning as the desk refusing to draw a link to a file that is not
# on disk.
# =============================================================================

$ErrorActionPreference = 'Stop'

$repo   = Split-Path -Parent $PSScriptRoot
$target = Join-Path $repo 'docs\OPS_DESK.html'

if (-not (Test-Path -LiteralPath $target)) {
    Write-Error "docs\OPS_DESK.html is not on disk. Run ``npm run desk`` first, then re-run this."
}

$desktop = [Environment]::GetFolderPath('Desktop')
$link    = Join-Path $desktop 'Weird.Baby Ops.lnk'

$shell = New-Object -ComObject WScript.Shell
$sc = $shell.CreateShortcut($link)
$sc.TargetPath       = $target
$sc.WorkingDirectory = (Join-Path $repo 'docs')
$sc.Description      = 'Weird.Baby - the Ops desk. Every instrument, one page.'
# shell32.dll #14 is the generic globe/browser-document icon. Named rather than
# left to the file association, so the icon does not change when the default
# browser does.
$sc.IconLocation     = "$env:SystemRoot\System32\shell32.dll,14"
$sc.Save()

# VERIFY, rather than announce. A shortcut that was "created" and does not
# resolve is exactly the failure this line exists to catch.
$check = $shell.CreateShortcut($link)
if (-not (Test-Path -LiteralPath $check.TargetPath)) {
    Write-Error "The shortcut was written but its target does not resolve: $($check.TargetPath)"
}

Write-Host "OK  $link"
Write-Host "    -> $($check.TargetPath)"
Write-Host "    double-click it; it opens in your default browser."
