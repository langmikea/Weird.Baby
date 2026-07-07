# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\backups\mediavault_pre-factscroller-<UTC>.sqlite   (the backup)
#   $env:TEMP\factscroller_stage0_verify.py                                          (throwaway verifier)
# All other operations read-only. PowerShell 7, run from any cwd.
# PREREQ: MV server (imgserver) NOT running during this script.
# Brief: FACTSCROLLER_REPLUMB-20260707 Stage 0 (mandatory before the Stage 2 MV writes).

$src = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$wal = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-wal'
$shm = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-shm'
Write-Host ('SRC exists: ' + (Test-Path -LiteralPath $src))
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath $wal))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath $shm))

$ts  = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$dst = 'C:\AI\Platform\MediaVault\core\backups\mediavault_pre-factscroller-' + $ts + '.sqlite'
Copy-Item -LiteralPath $src -Destination $dst
Write-Host ('BACKUP PATH: ' + $dst)
Write-Host ('SRC bytes: ' + (Get-Item -LiteralPath $src).Length)
Write-Host ('DST bytes: ' + (Get-Item -LiteralPath $dst).Length)
$srcHash = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash
$dstHash = (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash
Write-Host ('SRC sha256: ' + $srcHash)
Write-Host ('DST sha256: ' + $dstHash)
Write-Host ('SHA MATCH SRC==DST (must be True): ' + ($srcHash -eq $dstHash))
Write-Host ('SHA MATCH vs Ops session pin 72BF738A... (expect True; if False the Cowork mount copy was stale - Ops re-verifies before Stage 2): ' + ($srcHash -eq '72BF738AD43EE967893180362829B08E6F6D81499F58F20BDD130E055172807F'))

$py = Join-Path $env:TEMP 'factscroller_stage0_verify.py'
$code = @'
import sqlite3, sys, json, collections
p = sys.argv[1]
con = sqlite3.connect('file:' + p.replace('\\', '/') + '?mode=ro', uri=True)
cur = con.cursor()
print('integrity_check:', cur.execute('PRAGMA integrity_check').fetchone()[0])
print('artifacts (expect 392):', cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0])
print('facts (expect 97):', cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0])
print('fact statuses (expect all vault, 97):', cur.execute("SELECT status, COUNT(*) FROM artifacts WHERE kind='fact' GROUP BY status").fetchall())
print('status distribution (expect archived 1 / inbox 1 / released 211 / vault 179):',
      cur.execute('SELECT status, COUNT(*) FROM artifacts GROUP BY status ORDER BY status').fetchall())
print('kind distribution:', cur.execute('SELECT kind, COUNT(*) FROM artifacts GROUP BY kind ORDER BY 2 DESC').fetchall())
print('vocabulary rows (expect 23):', cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0])
print('tags-registry slugs (expect 230):', cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0])
print('card_kind slugs (expect album 9, gallery 1, NO recipe yet):',
      cur.execute("SELECT slug, usage_count FROM tags WHERE slug LIKE 'card_kind:%' ORDER BY slug").fetchall())
print('id_sequence 20260707 (expect 4 - STALE, Flag D; Stage 2 insert script repairs it):',
      cur.execute("SELECT last_seq FROM id_sequence WHERE date_str='20260707'").fetchall())
con.close()
print('VERIFY_DONE')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
Write-Host '--- VERIFY BACKUP (read-only open of the BACKUP file) ---'
python $py $dst

Write-Host '--- GIT SNAPSHOT (read-only; no commit this stage) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[MediaVault log -1]'
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host '[weird-baby-museum log -1]'
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE0_SCRIPT_DONE'
