# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\backups\mediavault_pre-vocab-reconcile-v2-<UTC>.sqlite   (the backup)
#   $env:TEMP\mv_stage0_verify.py                                                          (throwaway verifier)
# All other operations read-only. PowerShell 7, run from any cwd.
# PREREQ: MV server (imgserver) NOT running during this script.

$src = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$wal = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-wal'
$shm = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-shm'
Write-Host ('SRC exists: ' + (Test-Path -LiteralPath $src))
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath $wal))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath $shm))

$ts  = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$dst = 'C:\AI\Platform\MediaVault\core\backups\mediavault_pre-vocab-reconcile-v2-' + $ts + '.sqlite'
Copy-Item -LiteralPath $src -Destination $dst
Write-Host ('BACKUP PATH: ' + $dst)
Write-Host ('SRC bytes: ' + (Get-Item -LiteralPath $src).Length)
Write-Host ('DST bytes: ' + (Get-Item -LiteralPath $dst).Length)
Write-Host ('SRC sha256: ' + (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash)
Write-Host ('DST sha256: ' + (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash)

$py = Join-Path $env:TEMP 'mv_stage0_verify.py'
$code = @'
import sqlite3, sys, json, collections
p = sys.argv[1]
con = sqlite3.connect('file:' + p.replace('\\', '/') + '?mode=ro', uri=True)
cur = con.cursor()
print('integrity_check:', cur.execute('PRAGMA integrity_check').fetchone()[0])
print('artifacts:', cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0])
ns = collections.Counter()
for (t,) in cur.execute('SELECT tags FROM artifacts WHERE tags IS NOT NULL'):
    try:
        arr = json.loads(t)
    except Exception:
        continue
    for v in arr:
        if isinstance(v, str) and ':' in v:
            ns[v.split(':', 1)[0]] += 1
base = {'exhibit': 293, 'bands': 288, 'source': 239, 'content_kind': 175,
        'attributes': 121, 'artifact_kind': 55, 'event': 32, 'lineup': 27,
        'format': 24, 'card_kind': 10, 'presentation': 1}
print('namespace occurrences (actual vs 2026-06-24 plan baseline):')
for k in sorted(set(base) | set(ns)):
    print('  %s: %d (baseline %s)' % (k, ns.get(k, 0), base.get(k, '-')))
print('kind column filled:', cur.execute('SELECT COUNT(*) FROM artifacts WHERE kind IS NOT NULL').fetchone()[0])
con.close()
print('VERIFY_DONE')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
Write-Host '--- VERIFY BACKUP (read-only open of the BACKUP file) ---'
python $py $dst

Write-Host '--- COMMIT GATE SNAPSHOT (read-only) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[MediaVault log -1]'
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host '[weird-baby-museum log -1]'
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE0_SCRIPT_DONE'
