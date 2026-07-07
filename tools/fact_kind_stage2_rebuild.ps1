# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite    (THE LIVE DB — artifacts table rebuild: kind CHECK gains 'fact')
#   $env:TEMP\fact_kind_stage2_rebuild.py               (throwaway worker)
# PREREQ: MV server (imgserver) NOT running. Stage 0 backup verified
#   (core/backups/mediavault_pre-fact-kind-20260707T020813Z.sqlite).
# Brief: FACT_KIND_PUV_PILOT-20260707 Stage 2. PowerShell 7, run from any cwd.
# SAFETY: pinned to the exact Stage-0 DB state (sha256). All parity checks run
#   BEFORE the old table is dropped, inside one transaction; ANY mismatch rolls
#   back and the DB is untouched. Stop condition per brief: any integrity-check
#   mismatch = STOP, escalate, do not re-run.

$db  = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$pin = '2848EBE829DBC8CA398B23EC5A50A32AC81267EBE8D2F62715FE87310224BCA9'
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath ($db + '-shm')))
$h = (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash
Write-Host ('LIVE DB sha256: ' + $h)
Write-Host ('PINNED  sha256: ' + $pin)
if ($h -ne $pin) { throw 'ABORT: live DB does not match the Stage-0 verified state. Re-run Stage 0 backup + verification first. Nothing was written.' }

$py = Join-Path $env:TEMP 'fact_kind_stage2_rebuild.py'
$code = @'
import sqlite3, sys

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
OLD_SET = "'performance','release','announcement','studio','candid','interview','fan'"
NEW_SET = OLD_SET + ",'fact'"
COLS = ['id','source_url','source_platform','ingest_source','ingest_date',
        'storage_mode','local_asset_path','thumbnail_path','link_status',
        'parent_artifact_id','media_type','post_date','post_date_confidence',
        'capture_date','status','released_at','released_by','description_short',
        'description_long','extracted_text','tags','confidence_flags','notes',
        'created_at','updated_at','archived_at','kind','referenced_dates']
INDEXES = [
 'CREATE INDEX idx_artifacts_status       ON artifacts(status)',
 'CREATE INDEX idx_artifacts_storage_mode ON artifacts(storage_mode)',
 'CREATE INDEX idx_artifacts_post_date    ON artifacts(post_date)',
 'CREATE INDEX idx_artifacts_ingest_date  ON artifacts(ingest_date)',
 'CREATE INDEX idx_artifacts_parent       ON artifacts(parent_artifact_id)',
 'CREATE INDEX idx_artifacts_source_url   ON artifacts(source_url)',
]
KIND_DIST = {None: 147, 'release': 107, 'performance': 23, 'candid': 9,
             'announcement': 6, 'studio': 1}

def bail(msg):
    print('ABORT:', msg)
    sys.exit(2)

con = sqlite3.connect(DB)
con.isolation_level = None
cur = con.cursor()
cur.execute('PRAGMA foreign_keys=OFF')

old_ddl = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'").fetchone()[0]
if old_ddl.count(OLD_SET) != 1: bail('expected kind CHECK set not found exactly once in current DDL')
if "'fact'" in old_ddl: bail("'fact' already present in current DDL - nothing to do; escalate")
if old_ddl.count('CREATE TABLE "artifacts"') != 1: bail('unexpected CREATE TABLE header')
live_cols = [r[1] for r in cur.execute('PRAGMA table_info(artifacts)')]
if live_cols != COLS: bail('live column list differs from pinned 28: %r' % (live_cols,))
n0 = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
if n0 != 293: bail('artifacts count %d != 293' % n0)

new_ddl = old_ddl.replace('CREATE TABLE "artifacts"', 'CREATE TABLE "artifacts_new"', 1).replace(OLD_SET, NEW_SET, 1)
collist = ', '.join(COLS)

try:
    cur.execute('BEGIN IMMEDIATE')
    cur.execute(new_ddl)
    cur.execute('INSERT INTO artifacts_new (%s) SELECT %s FROM artifacts' % (collist, collist))
    n1 = cur.execute('SELECT COUNT(*) FROM artifacts_new').fetchone()[0]
    print('rows copied:', n1, '(expect 293)')
    if n1 != 293: raise RuntimeError('copy row count %d != 293' % n1)
    d1 = cur.execute('SELECT COUNT(*) FROM (SELECT %s FROM artifacts EXCEPT SELECT %s FROM artifacts_new)' % (collist, collist)).fetchone()[0]
    d2 = cur.execute('SELECT COUNT(*) FROM (SELECT %s FROM artifacts_new EXCEPT SELECT %s FROM artifacts)' % (collist, collist)).fetchone()[0]
    print('EXCEPT old-not-in-new:', d1, '| new-not-in-old:', d2, '(both expect 0)')
    if d1 != 0 or d2 != 0: raise RuntimeError('row-content parity failed: %d / %d' % (d1, d2))
    cur.execute('DROP TABLE artifacts')
    cur.execute('ALTER TABLE artifacts_new RENAME TO artifacts')
    for ddl in INDEXES:
        cur.execute(ddl)
    cur.execute('COMMIT')
except Exception as e:
    cur.execute('ROLLBACK')
    print('ROLLED BACK - DB untouched.')
    bail(repr(e))

fk = cur.execute('PRAGMA foreign_key_check').fetchall()
print('foreign_key_check violations:', len(fk), '(expect 0)')
if fk: bail('FK violations after swap: %r' % (fk[:5],))
ic = cur.execute('PRAGMA integrity_check').fetchone()[0]
print('integrity_check:', ic)
if ic != 'ok': bail('integrity_check failed')

ddl2 = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'").fetchone()[0]
print('new DDL contains fact-CHECK exactly once:', ddl2.count(NEW_SET) == 1)
if ddl2.count(NEW_SET) != 1: bail('new CHECK set not present exactly once post-swap')
cols2 = [r[1] for r in cur.execute('PRAGMA table_info(artifacts)')]
print('column list identical:', cols2 == COLS)
if cols2 != COLS: bail('column list changed post-swap')
idx = sorted(r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='artifacts' AND sql IS NOT NULL"))
print('named indexes:', idx)
if len(idx) != 6: bail('expected 6 named indexes, got %d' % len(idx))
dist = dict(cur.execute('SELECT kind, COUNT(*) FROM artifacts GROUP BY kind').fetchall())
print('kind distribution:', dist, '(expect %r)' % KIND_DIST)
if dist != KIND_DIST: bail('kind distribution drifted')
probe = cur.execute("SELECT COUNT(*) FROM artifacts a WHERE (SELECT COUNT(*) FROM json_each(a.tags) WHERE value LIKE 'source:%') = 1 AND EXISTS (SELECT 1 FROM json_each(a.tags) WHERE value = 'source:' || a.source_platform)").fetchone()[0]
print('source tag==column agreement:', probe, '(expect 293)')
if probe != 293: bail('source invariant broken')
band = cur.execute("SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE value LIKE 'band:%'").fetchone()[0]
print('band tag occurrences:', band, '(expect 288)')
if band != 288: bail('band count drifted')
voc = cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0]
print('vocabulary rows:', voc, '(expect 22)')
if voc != 22: bail('vocabulary rows drifted')
con.close()
print('REBUILD_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
if ($LASTEXITCODE -ne 0) { throw 'ABORT: rebuild worker exited non-zero. See output above. If the transaction rolled back, the DB is untouched; STOP and escalate per brief stop-condition.' }

Write-Host '--- POST-REBUILD FILE STATE ---'
Write-Host ('LIVE DB sha256 now: ' + (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash)
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host '--- GIT SNAPSHOT (read-only; commit gate follows verification) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE2_SCRIPT_DONE'
