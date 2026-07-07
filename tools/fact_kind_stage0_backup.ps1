# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\backups\mediavault_pre-fact-kind-<UTC>.sqlite   (the backup)
#   $env:TEMP\fact_kind_stage0_verify.py                                          (throwaway verifier)
# All other operations read-only. PowerShell 7, run from any cwd.
# PREREQ: MV server (imgserver) NOT running during this script.
# Brief: FACT_KIND_PUV_PILOT-20260707 Stage 0.

$src = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$wal = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-wal'
$shm = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-shm'
Write-Host ('SRC exists: ' + (Test-Path -LiteralPath $src))
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath $wal))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath $shm))

$ts  = (Get-Date).ToUniversalTime().ToString('yyyyMMddTHHmmssZ')
$dst = 'C:\AI\Platform\MediaVault\core\backups\mediavault_pre-fact-kind-' + $ts + '.sqlite'
Copy-Item -LiteralPath $src -Destination $dst
Write-Host ('BACKUP PATH: ' + $dst)
Write-Host ('SRC bytes: ' + (Get-Item -LiteralPath $src).Length)
Write-Host ('DST bytes: ' + (Get-Item -LiteralPath $dst).Length)
Write-Host ('SRC sha256: ' + (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash)
Write-Host ('DST sha256: ' + (Get-FileHash -LiteralPath $dst -Algorithm SHA256).Hash)

$py = Join-Path $env:TEMP 'fact_kind_stage0_verify.py'
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
print('band occurrences (expect 288):', ns.get('band', 0))
print('bands occurrences (expect 0):', ns.get('bands', 0))
print('fact occurrences (expect 0):', ns.get('fact', 0))
print('vocabulary rows (expect 22):', cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0])
print('tags-registry slugs (print, no pin):', cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0])
print('kind column filled (expect 146):', cur.execute('SELECT COUNT(*) FROM artifacts WHERE kind IS NOT NULL').fetchone()[0])
row = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'").fetchone()
ddl = row[0]
i = ddl.lower().find('kind')
print('--- artifacts DDL, kind region (for Stage 1 delta) ---')
print(ddl[max(0, i - 40): i + 260])
print('--- full artifacts DDL length:', len(ddl), 'chars ---')
kinds = cur.execute('SELECT kind, COUNT(*) FROM artifacts GROUP BY kind ORDER BY 2 DESC').fetchall()
print('kind value distribution:', kinds)
con.close()
print('VERIFY_DONE')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
Write-Host '--- VERIFY BACKUP (read-only open of the BACKUP file) ---'
python $py $dst

Write-Host '--- GIT SNAPSHOT (read-only; no commit this stage per brief) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[MediaVault log -1]'
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host '[weird-baby-museum log -1]'
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE0_SCRIPT_DONE'
