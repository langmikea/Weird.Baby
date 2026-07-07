# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite      (LIVE DB: kind CHECK rebuild +press; 13 updates; 2 inserts; speaker namespace; registry counts)
#   C:\AI\Platform\MediaVault\core\tag_vocabulary.json    (regenerated reference snapshot)
#   $env:TEMP\press_batch_stage2.py                       (throwaway worker)
# PREREQ: MV server (imgserver) NOT running. Stage 0 backup verified
#   (core/backups/mediavault_pre-press-batch-20260707T180632Z.sqlite).
# Brief: PRESS_BATCH_INGEST-20260707 Stage 2, per Stage 1 delta rulings (all approved).
# SAFETY: pinned to the exact Stage-0 DB state (sha256). Rebuild parity checks run
#   BEFORE the old table is dropped; every update/insert verified in-transaction;
#   ANY mismatch rolls back that transaction. Stop condition: any integrity
#   mismatch = STOP, escalate, do not re-run.

$db  = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$pin = 'CA49A556CD08306775DFFDAB969621AD6D33A7303F25A7D7804A97FBD2066B40'
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath ($db + '-shm')))
$h = (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash
Write-Host ('LIVE DB sha256: ' + $h)
Write-Host ('PINNED  sha256: ' + $pin)
if ($h -ne $pin) { throw 'ABORT: live DB does not match the Stage-0 verified state. Nothing was written.' }

$py = Join-Path $env:TEMP 'press_batch_stage2.py'
$code = @'
import sqlite3, sys, json, collections
from datetime import datetime

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
OLD_SET = "'performance','release','announcement','studio','candid','interview','fan','fact'"
NEW_SET = OLD_SET + ",'press'"
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
KIND_PRE  = {None: 147, 'release': 107, 'performance': 23, 'candid': 9,
             'announcement': 6, 'studio': 1, 'fact': 4}
KIND_POST = {None: 134, 'release': 107, 'performance': 23, 'candid': 10,
             'announcement': 6, 'studio': 1, 'fact': 4, 'interview': 6, 'press': 8}
STATUS_POST = {'archived': 1, 'inbox': 1, 'released': 211, 'vault': 86}
STAMP = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

# Stage 1 rulings, per artifact: (kind, link_status, post_date_or_None, conf_or_None, release?)
RULINGS = {
 'MV-20260617-001': ('interview','live',None,'extracted',True),
 'MV-20260617-002': ('interview','live',None,'extracted',True),
 'MV-20260617-003': ('candid','dead',None,None,False),   # video private (Mike browser check); stays vault
 'MV-20260617-004': ('press','live',None,'extracted',True),
 'MV-20260617-005': ('press','live',None,'extracted',True),
 'MV-20260617-006': ('interview','live',None,'extracted',True),
 'MV-20260617-007': ('press','live',None,'extracted',True),
 'MV-20260617-008': ('press','live',None,'extracted',True),
 'MV-20260617-009': ('press','live',None,None,True),      # undated listing; date stays estimated
 'MV-20260617-010': ('press','live',None,'extracted',True),
 'MV-20260617-011': ('interview','live',None,'extracted',True),
 'MV-20260617-012': ('interview','live','2025-10-16','extracted',True),  # Substack = original publication
 'MV-20260617-013': ('interview','live','2025-11-24','extracted',True),  # page header date; meta was TZ artifact
}

NEW_ROWS = [
 dict(id='MV-HR-20260707-005',
  source_url='https://pamusician.net/hitting-the-road-september-2019/',
  post_date='2019-09-05',
  description_short='Hitting the Road - September 2019 (PA Musician Magazine)',
  description_long=("Michele Kelly's touring column, September 2019 issue: Medusa's Disco close the "
   "Peace of Mind concert series at Rt. 61 Roadhouse, Sunbury - the night after opening for Godsmack "
   "at Musikfest, Allentown. Lineup listed with Justin Wohlfeil on bass; 'Book Upon My Shelf' single "
   "(8/14/19, first in 3 years) noted; Orphic Grimoire release party at XL Live Oct 11 announced. "
   "No direct band quotes in the piece."),
  extracted_text=None,
  tags=["band:medusas_disco","content_kind:press","exhibit:hunter_root","source:press","topic:touring"]),
 dict(id='MV-HR-20260707-006',
  source_url='https://nepaudio.wordpress.com/2019/10/20/orphic-grimoire/',
  post_date='2019-10-20',
  description_short="'Orphic Grimoire' perpetuates the hurricane of Medusa's Disco: An Album Review (NEPAudio)",
  description_long=("Track-by-track album review by Sarah Kate Gittleman (NEPAudio, 2019-10-20). Notes "
   "Orphic Grimoire as the band's fourth studio release, recorded/mixed/produced entirely by Medusa's "
   "Disco; lineup Huddle/Root/Aument/Wohlfeil; highlights 'Belly Ache' (with YAM YAM's Jason Mescia on "
   "sax) and closer 'Sizzle Into Oblivion' as the fan favorite."),
  extracted_text='"Medusa\'s Disco\'s songwriting is a quality that sets them apart from other bands." - Sarah Kate Gittleman, NEPAudio',
  tags=["album:orphic_grimoire","band:medusas_disco","content_kind:press","exhibit:hunter_root","source:press","topic:release"]),
]

def bail(msg):
    print('ABORT:', msg)
    sys.exit(2)

con = sqlite3.connect(DB)
con.isolation_level = None
cur = con.cursor()
cur.execute('PRAGMA foreign_keys=OFF')

# ---------- Phase A: pre-checks ----------
old_ddl = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'").fetchone()[0]
if old_ddl.count(OLD_SET) != 1: bail('expected kind CHECK set not found exactly once in current DDL')
if "'press'" in old_ddl: bail("'press' already present in current DDL - nothing to do; escalate")
live_cols = [r[1] for r in cur.execute('PRAGMA table_info(artifacts)')]
if live_cols != COLS: bail('live column list differs from pinned 28: %r' % (live_cols,))
n0 = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
if n0 != 297: bail('artifacts count %d != 297' % n0)
dist0 = dict(cur.execute('SELECT kind, COUNT(*) FROM artifacts GROUP BY kind').fetchall())
if dist0 != KIND_PRE: bail('pre kind distribution drifted: %r' % dist0)
pb = cur.execute("SELECT COUNT(*) FROM artifacts WHERE id LIKE 'MV-20260617%' AND kind IS NULL AND status='vault'").fetchone()[0]
if pb != 13: bail('expected 13 vaulted kind-NULL press rows, got %d' % pb)
for nid in ('MV-HR-20260707-005','MV-HR-20260707-006'):
    if cur.execute('SELECT COUNT(*) FROM artifacts WHERE id=?', (nid,)).fetchone()[0] != 0: bail('id already exists: ' + nid)
voc0 = cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0]
if voc0 != 22: bail('vocabulary rows %d != 22' % voc0)
if cur.execute("SELECT COUNT(*) FROM vocabulary WHERE namespace='speaker'").fetchone()[0] != 0: bail('speaker namespace already exists')
reg0 = cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0]
if reg0 != 211: bail('tags registry rows %d != 211' % reg0)
print('Phase A pre-checks: OK (297 rows, 13 press rows vaulted/kind-NULL, vocab 22, registry 211)')

# ---------- Phase B: kind CHECK rebuild +press (single transaction, parity before drop) ----------
new_ddl = old_ddl.replace('CREATE TABLE "artifacts"', 'CREATE TABLE "artifacts_new"', 1).replace(OLD_SET, NEW_SET, 1)
collist = ', '.join(COLS)
try:
    cur.execute('BEGIN IMMEDIATE')
    cur.execute(new_ddl)
    cur.execute('INSERT INTO artifacts_new (%s) SELECT %s FROM artifacts' % (collist, collist))
    n1 = cur.execute('SELECT COUNT(*) FROM artifacts_new').fetchone()[0]
    print('rows copied:', n1, '(expect 297)')
    if n1 != 297: raise RuntimeError('copy row count %d != 297' % n1)
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
    print('ROLLED BACK (rebuild) - DB untouched.')
    bail(repr(e))
print('Phase B rebuild: OK')

# ---------- Phase C: updates + inserts + speaker namespace + registry (single transaction) ----------
try:
    cur.execute('BEGIN IMMEDIATE')
    cur.execute("INSERT INTO vocabulary (namespace, display_name, tier, sort_order, retired_at) VALUES ('speaker','Speaker',3,10,NULL)")
    for aid, (kind, link, pdate, conf, rel) in RULINGS.items():
        cur.execute('UPDATE artifacts SET kind=?, link_status=?, updated_at=? WHERE id=?', (kind, link, STAMP, aid))
        if cur.rowcount != 1: raise RuntimeError('update rowcount != 1 for ' + aid)
        if pdate:
            cur.execute('UPDATE artifacts SET post_date=? WHERE id=?', (pdate, aid))
        if conf:
            cur.execute('UPDATE artifacts SET post_date_confidence=? WHERE id=?', (conf, aid))
        if rel:
            cur.execute("UPDATE artifacts SET status='released', released_at=?, released_by='mike' WHERE id=?", (STAMP, aid))
    for row in NEW_ROWS:
        cur.execute('INSERT INTO artifacts (%s) VALUES (%s)' % (collist, ','.join(['?']*28)), (
            row['id'], row['source_url'], 'press', 'url-entry', '2026-07-07',
            'url_only', None, None, 'live',
            None, 'text', row['post_date'], 'extracted',
            '2026-07-07', 'released', STAMP, 'mike', row['description_short'],
            row['description_long'], row['extracted_text'], json.dumps(row['tags']), None, None,
            STAMP, STAMP, None, 'press', None))
    # registry recompute from artifacts (full recount, no deltas)
    counts = collections.Counter()
    for (t,) in cur.execute('SELECT tags FROM artifacts WHERE tags IS NOT NULL'):
        for s in json.loads(t):
            counts[s] += 1
    reg = {r[0]: r[1] for r in cur.execute('SELECT slug, usage_count FROM tags')}
    unregistered = sorted(set(counts) - set(reg))
    if unregistered: raise RuntimeError('unregistered slugs in use: %r' % unregistered)
    changed = 0
    for slug, old in reg.items():
        new = counts.get(slug, 0)
        if new == 0: raise RuntimeError('registry slug fell to zero usage: ' + slug)
        if new != old:
            cur.execute('UPDATE tags SET usage_count=? WHERE slug=?', (new, slug))
            changed += 1
    print('registry recount: %d slugs updated, 0 unregistered, 0 zero-usage' % changed)
    # in-transaction verification
    if cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0] != 299: raise RuntimeError('final count != 299')
    dist = dict(cur.execute('SELECT kind, COUNT(*) FROM artifacts GROUP BY kind').fetchall())
    if dist != KIND_POST: raise RuntimeError('final kind distribution wrong: %r' % dist)
    sdist = dict(cur.execute('SELECT status, COUNT(*) FROM artifacts GROUP BY status').fetchall())
    if sdist != STATUS_POST: raise RuntimeError('final status distribution wrong: %r' % sdist)
    cur.execute('COMMIT')
except Exception as e:
    cur.execute('ROLLBACK')
    print('ROLLED BACK (updates/inserts) - rebuild from Phase B remains committed; content unchanged.')
    bail(repr(e))
print('Phase C updates/inserts: OK')

# ---------- Phase D: post checks ----------
fk = cur.execute('PRAGMA foreign_key_check').fetchall()
print('foreign_key_check violations:', len(fk), '(expect 0)')
if fk: bail('FK violations: %r' % (fk[:5],))
ic = cur.execute('PRAGMA integrity_check').fetchone()[0]
print('integrity_check:', ic)
if ic != 'ok': bail('integrity_check failed')
ddl2 = cur.execute("SELECT sql FROM sqlite_master WHERE type='table' AND name='artifacts'").fetchone()[0]
print('new DDL contains press-CHECK exactly once:', ddl2.count(NEW_SET) == 1)
if ddl2.count(NEW_SET) != 1: bail('new CHECK set not present exactly once')
idx = sorted(r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='index' AND tbl_name='artifacts' AND sql IS NOT NULL"))
if len(idx) != 6: bail('expected 6 named indexes, got %d' % len(idx))
probe = cur.execute("SELECT COUNT(*) FROM artifacts a WHERE (SELECT COUNT(*) FROM json_each(a.tags) WHERE value LIKE 'source:%') = 1 AND EXISTS (SELECT 1 FROM json_each(a.tags) WHERE value = 'source:' || a.source_platform)").fetchone()[0]
print('source tag==column agreement:', probe, '(expect 299)')
if probe != 299: bail('source invariant broken')
band = cur.execute("SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE value LIKE 'band:%'").fetchone()[0]
print('band tag occurrences:', band, '(expect 295)')
if band != 295: bail('band count drifted')
voc = cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0]
print('vocabulary rows:', voc, '(expect 23, incl. speaker)')
if voc != 23: bail('vocabulary rows wrong')
print('--- released press/interview sample ---')
for r in cur.execute("SELECT id, kind, status, link_status, post_date, post_date_confidence FROM artifacts WHERE id LIKE 'MV-20260617%' OR id IN ('MV-HR-20260707-005','MV-HR-20260707-006') ORDER BY id"):
    print(r)
con.close()
print('STAGE2_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
if ($LASTEXITCODE -ne 0) { throw 'ABORT: worker exited non-zero. See output above. STOP and escalate per brief stop-condition.' }

# ---------- tag_vocabulary.json regeneration (reference snapshot; DB is canonical) ----------
$tvPath = 'C:\AI\Platform\MediaVault\core\tag_vocabulary.json'
$tv = Get-Content -LiteralPath $tvPath -Raw
$tv = $tv -replace '"generated": "2026-07-07"', '"generated": "2026-07-07"'
Copy-Item -LiteralPath $tvPath -Destination ($tvPath + '.pre-press-batch-20260707')
$tv = $tv -replace '"generated_from": "[^"]*"', '"generated_from": "mediavault.sqlite post press-batch Stage 2 (PRESS_BATCH_INGEST-20260707; 299 artifacts, 211 registry slugs, speaker namespace added)"'
$tv = $tv -replace '\["performance", "release", "announcement", "studio", "candid", "interview", "fan", "fact"\]', '["performance", "release", "announcement", "studio", "candid", "interview", "fan", "fact", "press"]'
$tv = $tv -replace '"interview":    \{ "label": "\(reserved\)", "reserved": true \},', '"interview":    { "label": "Interview", "note": "activated 2026-07-07 (PRESS_BATCH Stage 1 V2); first inhabitants MV-20260617 batch" },'
$tv = $tv -replace '"fan":          \{ "label": "\(reserved\)", "reserved": true \},', '"fan":          { "label": "(reserved)", "reserved": true },
      "press":        { "label": "Press", "note": "added 2026-07-07 (PRESS_BATCH Stage 1 V1, table rebuild); covers press features AND reviews per V6" },'
$tv = $tv -replace '("exhibit":\s*\{[^\}]*\})', '$1,
    "speaker":      { "label": "Speaker",      "tier": 3, "sort": 10, "values": [], "note": "added 2026-07-07 (PRESS_BATCH Stage 1 V3, amended): quote-speaker axis for fact artifacts; values are person AND outlet slugs (person slugs shared with people:); values register at first use (Stage 3), hence empty here despite F7." }'
Set-Content -LiteralPath $tvPath -Value $tv -Encoding utf8NoBOM
Write-Host ('tag_vocabulary.json rewritten; backup at ' + $tvPath + '.pre-press-batch-20260707')
Write-Host ('speaker line present: ' + (Select-String -LiteralPath $tvPath -Pattern '"speaker"' -Quiet))
Write-Host ('press kind present:   ' + (Select-String -LiteralPath $tvPath -Pattern '"press":        \{ "label": "Press"' -Quiet))

Write-Host '--- POST-STAGE2 FILE STATE ---'
Write-Host ('LIVE DB sha256 now: ' + (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash)
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host '--- GIT SNAPSHOT (read-only; commit gate follows verification) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE2_SCRIPT_DONE'
