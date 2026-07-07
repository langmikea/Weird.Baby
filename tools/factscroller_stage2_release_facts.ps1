# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite      (UPDATE: 97 kind='fact' rows vault -> released)
#   $env:TEMP\factscroller_stage2_flip.py                 (throwaway worker)
# All other operations read-only. PowerShell 7, run from any cwd.
# PREREQ 1: MV server (imgserver) NOT running.
# PREREQ 2: tools/factscroller_stage0_backup.ps1 ran clean this session (backup exists).
# PREREQ 3: Mike's pass on delta item (b) — the release-status call.
# Brief: FACTSCROLLER_REPLUMB-20260707 Stage 2 (DB write 1 of 2; recipe-card
# insert is a separate script, gated on Mike's wording).
# Guard rails: pinned pre-sha; one transaction; verify-or-rollback on every
# count; any FLIP_ABORT line = nothing written.

$src = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$wal = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-wal'
$shm = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-shm'
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath $wal))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath $shm))
$preHash = (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash
Write-Host ('PRE sha256: ' + $preHash)
Write-Host ('PIN MATCH (must be True or ABORT - do not proceed on False): ' + ($preHash -eq '72BF738AD43EE967893180362829B08E6F6D81499F58F20BDD130E055172807F'))

Write-Host '--- node syntax preflight on the edited exporter (must print EXPORTER_SYNTAX_OK) ---'
node --check 'C:\AI\Projects\weird-baby-museum\tools\export-artifacts.mjs'
Write-Host ('EXPORTER_SYNTAX_OK exit=' + $LASTEXITCODE)

$py = Join-Path $env:TEMP 'factscroller_stage2_flip.py'
$code = @'
import sqlite3, sys, datetime
P = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
PIN = '72BF738AD43EE967893180362829B08E6F6D81499F58F20BDD130E055172807F'
import hashlib
h = hashlib.sha256(open(P, 'rb').read()).hexdigest().upper()
if h != PIN:
    print('FLIP_ABORT: live sha', h, '!= pin', PIN); sys.exit(1)
con = sqlite3.connect(P)
cur = con.cursor()
pre_facts_vault = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='vault'").fetchone()[0]
pre_released    = cur.execute("SELECT COUNT(*) FROM artifacts WHERE status='released'").fetchone()[0]
pre_total       = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
if pre_facts_vault != 97 or pre_released != 211 or pre_total != 392:
    print('FLIP_ABORT: preconditions', pre_facts_vault, pre_released, pre_total, 'expected 97/211/392'); sys.exit(1)
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
try:
    cur.execute('BEGIN')
    cur.execute("UPDATE artifacts SET status='released', released_at=? WHERE kind='fact' AND status='vault'", (now,))
    changed = cur.rowcount
    if changed != 97:
        raise RuntimeError('rowcount %d != 97' % changed)
    fr = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='released'").fetchone()[0]
    fv = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='vault'").fetchone()[0]
    rel = cur.execute("SELECT COUNT(*) FROM artifacts WHERE status='released'").fetchone()[0]
    tot = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
    ra  = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND (released_at IS NULL OR released_at='')").fetchone()[0]
    if (fr, fv, rel, tot, ra) != (97, 0, 308, 392, 0):
        raise RuntimeError('post-asserts %r != (97, 0, 308, 392, 0)' % [(fr, fv, rel, tot, ra)])
    con.commit()
except Exception as e:
    con.rollback()
    print('FLIP_ABORT: rolled back -', e); sys.exit(1)
print('facts released (expect 97):', fr)
print('facts still vault (expect 0):', fv)
print('released total (expect 308):', rel)
print('artifacts total (expect 392):', tot)
print('facts missing released_at (expect 0):', ra)
print('integrity_check:', cur.execute('PRAGMA integrity_check').fetchone()[0])
print('sample flipped row:', cur.execute("SELECT id, status, released_at FROM artifacts WHERE id='MV-HR-20260707-001'").fetchone())
con.close()
print('FLIP_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py

Write-Host ('POST sha256: ' + (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash)
Write-Host '--- GIT SNAPSHOT (DB untracked by policy; commit gate rides the full Stage 2 close) ---'
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE2_FLIP_SCRIPT_DONE'
