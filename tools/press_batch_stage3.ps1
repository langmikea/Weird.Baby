# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite      (LIVE DB: +93 fact artifacts, +19 speaker registry rows, pilot-001 breadcrumb append, registry recount)
#   C:\AI\Platform\MediaVault\core\tag_vocabulary.json    (speaker values filled; .pre-stage3 backup written beside it)
#   $env:TEMP\press_batch_stage3.py                       (throwaway worker)
# READS: C:\AI\Projects\weird-baby-museum\tools\press_batch_stage3_facts.json (the gated payload)
# PREREQ: MV server NOT running. Stage 2 verified state on disk.
# Brief: PRESS_BATCH_INGEST-20260707 Stage 3. Wording gate PASS (Mike, all 93 as worded).
# SAFETY: pinned to the exact post-Stage-2 DB state (sha256). One transaction; every insert
#   verified in-transaction; ANY mismatch rolls back. Stop condition: mismatch = STOP, escalate.

$db  = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$pin = '48D6492AE6413ABF06FDD9F10B49FCE7AF5CD59C268C08CF356FF99F8C5E6B48'
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath ($db + '-shm')))
$h = (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash
Write-Host ('LIVE DB sha256: ' + $h)
Write-Host ('PINNED  sha256: ' + $pin)
if ($h -ne $pin) { throw 'ABORT: live DB does not match the verified post-Stage-2 state. Nothing was written.' }

$py = Join-Path $env:TEMP 'press_batch_stage3.py'
$code = @'
import sqlite3, sys, json, collections
from datetime import datetime

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
PAYLOAD = r'C:\AI\Projects\weird-baby-museum\tools\press_batch_stage3_facts.json'
STAMP = datetime.now().strftime('%Y-%m-%dT%H:%M:%S')

def bail(msg):
    print('ABORT:', msg)
    sys.exit(2)

d = json.load(open(PAYLOAD, encoding='utf8'))
facts = d['facts']
spreg = d['speaker_registry']
srcs = d['sources']
pilot = d['pilot_note_append']
if len(facts) != 93: bail('payload facts != 93')
if len(spreg) != 19: bail('payload speaker registry != 19')
used = set(f['speaker'] for f in facts)
if used != set(spreg): bail('speaker usage != registry map (F7 violation)')

con = sqlite3.connect(DB)
con.isolation_level = None
cur = con.cursor()
cur.execute('PRAGMA foreign_keys=OFF')

# ---------- pre-checks ----------
if cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0] != 299: bail('artifact count != 299')
if cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0] != 4: bail('fact count != 4')
if cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0] != 211: bail('registry rows != 211')
if cur.execute("SELECT COUNT(*) FROM vocabulary WHERE namespace='speaker'").fetchone()[0] != 1: bail('speaker namespace missing')
for f in facts:
    if cur.execute('SELECT COUNT(*) FROM artifacts WHERE id=?', (f['id'],)).fetchone()[0] != 0: bail('id exists: ' + f['id'])
reg = set(r[0] for r in cur.execute('SELECT slug FROM tags'))
for slug in spreg:
    if 'speaker:' + slug in reg: bail('speaker slug already registered: ' + slug)
needed = set()
for f in facts:
    needed.update(f['tags'])
needed.update(['exhibit:hunter_root', 'source:press'])
missing = sorted(t for t in needed if t not in reg)
if missing: bail('payload uses unregistered non-speaker tags: %r' % missing)
old_notes = cur.execute('SELECT notes FROM artifacts WHERE id=?', (pilot['id'],)).fetchone()
if not old_notes or not old_notes[0] or not old_notes[0].endswith('Wording: Mike.'): bail('pilot 001 notes not in expected pre-state')
print('pre-checks: OK (299 rows, 4 facts, registry 211, payload clean)')

COLS = ['id','source_url','source_platform','ingest_source','ingest_date',
        'storage_mode','local_asset_path','thumbnail_path','link_status',
        'parent_artifact_id','media_type','post_date','post_date_confidence',
        'capture_date','status','released_at','released_by','description_short',
        'description_long','extracted_text','tags','confidence_flags','notes',
        'created_at','updated_at','archived_at','kind','referenced_dates']
collist = ', '.join(COLS)

# ---------- single transaction ----------
try:
    cur.execute('BEGIN IMMEDIATE')
    for slug, disp in sorted(spreg.items()):
        cur.execute('INSERT INTO tags (slug, display_name, usage_count, created_at) VALUES (?,?,0,?)',
                    ('speaker:' + slug, disp, STAMP))
    for f in facts:
        s = srcs[f['src']]
        tags = sorted(f['tags'] + ['exhibit:hunter_root', 'source:press', 'speaker:' + f['speaker']])
        notes = ('PUV fact (PRESS_BATCH_INGEST-20260707 Stage 3; wording gate PASS, Mike; cand %s). Breadcrumb: %s'
                 % (f['cand'], s['note']))
        if f.get('xnote'):
            notes += ' ' + f['xnote']
        cur.execute('INSERT INTO artifacts (%s) VALUES (%s)' % (collist, ','.join(['?']*28)), (
            f['id'], s['url'], 'press', 'cowork', '2026-07-07',
            'url_only', None, None, None,
            None, 'text', None, None,
            None, 'vault', None, None, f['short'],
            f['long'], None, json.dumps(tags), None, notes,
            STAMP, STAMP, None, 'fact', None))
    cur.execute('UPDATE artifacts SET notes = notes || ?, updated_at = ? WHERE id = ?',
                (pilot['append'], STAMP, pilot['id']))
    if cur.rowcount != 1: raise RuntimeError('pilot note append rowcount != 1')
    # registry recount (full, no deltas)
    counts = collections.Counter()
    for (t,) in cur.execute('SELECT tags FROM artifacts WHERE tags IS NOT NULL'):
        for slug in json.loads(t):
            counts[slug] += 1
    regmap = {r[0]: r[1] for r in cur.execute('SELECT slug, usage_count FROM tags')}
    unregistered = sorted(set(counts) - set(regmap))
    if unregistered: raise RuntimeError('unregistered slugs in use: %r' % unregistered)
    changed = 0
    for slug, old in regmap.items():
        new = counts.get(slug, 0)
        if new == 0: raise RuntimeError('registry slug at zero usage: ' + slug)
        if new != old:
            cur.execute('UPDATE tags SET usage_count=? WHERE slug=?', (new, slug))
            changed += 1
    print('registry recount: %d slugs updated, 0 unregistered, 0 zero-usage' % changed)
    # in-transaction verification
    if cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0] != 392: raise RuntimeError('final count != 392')
    if cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0] != 97: raise RuntimeError('fact count != 97')
    sdist = dict(cur.execute('SELECT status, COUNT(*) FROM artifacts GROUP BY status').fetchall())
    if sdist != {'archived': 1, 'inbox': 1, 'released': 211, 'vault': 179}: raise RuntimeError('status dist wrong: %r' % sdist)
    if cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0] != 230: raise RuntimeError('registry rows != 230')
    cur.execute('COMMIT')
except Exception as e:
    cur.execute('ROLLBACK')
    print('ROLLED BACK - DB untouched.')
    bail(repr(e))
print('transaction: OK (93 facts inserted, 19 speaker slugs registered, pilot 001 breadcrumb strengthened)')

# ---------- post checks ----------
fk = cur.execute('PRAGMA foreign_key_check').fetchall()
print('foreign_key_check violations:', len(fk), '(expect 0)')
if fk: bail('FK violations: %r' % (fk[:5],))
ic = cur.execute('PRAGMA integrity_check').fetchone()[0]
print('integrity_check:', ic)
if ic != 'ok': bail('integrity_check failed')
probe = cur.execute("SELECT COUNT(*) FROM artifacts a WHERE (SELECT COUNT(*) FROM json_each(a.tags) WHERE value LIKE 'source:%') = 1 AND EXISTS (SELECT 1 FROM json_each(a.tags) WHERE value = 'source:' || a.source_platform)").fetchone()[0]
print('source tag==column agreement:', probe, '(expect 392)')
if probe != 392: bail('source invariant broken')
band = cur.execute("SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE value LIKE 'band:%'").fetchone()[0]
print('band tag occurrences:', band, '(expect 388)')
if band != 388: bail('band count drifted')
voc = cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0]
print('vocabulary rows:', voc, '(expect 23)')
if voc != 23: bail('vocabulary rows drifted')
spk = cur.execute("SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE value LIKE 'speaker:%'").fetchone()[0]
print('speaker tag occurrences:', spk, '(expect 93)')
if spk != 93: bail('speaker occurrences wrong')
vaultfacts = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='vault'").fetchone()[0]
print('vault-status facts:', vaultfacts, '(expect 97 — ALL facts hidden)')
if vaultfacts != 97: bail('a fact is not vault-status')
print('--- samples ---')
for r in cur.execute("SELECT id, description_short, description_long FROM artifacts WHERE id IN ('MV-HR-20260707-007','MV-HR-20260707-056','MV-HR-20260707-099')"):
    print(r)
print('pilot 001 notes tail:', cur.execute("SELECT substr(notes,-120) FROM artifacts WHERE id='MV-HR-20260707-001'").fetchone()[0])
con.close()
print('STAGE3_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
if ($LASTEXITCODE -ne 0) { throw 'ABORT: worker exited non-zero. See output above. STOP and escalate per brief stop-condition.' }

# ---------- tag_vocabulary.json: fill speaker values (reference snapshot; DB canonical) ----------
$tvPath = 'C:\AI\Platform\MediaVault\core\tag_vocabulary.json'
Copy-Item -LiteralPath $tvPath -Destination ($tvPath + '.pre-stage3-20260707')
$tv = Get-Content -LiteralPath $tvPath -Raw
$vals = '"alex_aument", "americana_highways", "blue_harvest_beat", "harrison_giza", "hill_douglas", "hunter_root", "isthmus", "justin_wohlfeil", "lancaster_online", "michele_kelly", "michelle_osterhoudt", "nepaudio", "pa_musician", "sarah_kate_gittleman", "shore_fire_media", "the_country_note", "tyler", "whiskey_riff", "wynton_huddle"'
$tv = $tv -replace '"values": \[\], "note": "added 2026-07-07 \(PRESS_BATCH Stage 1 V3', ('"values": [' + $vals + '], "note": "added 2026-07-07 (PRESS_BATCH Stage 1 V3')
$tv = $tv -replace 'values register at first use \(Stage 3\), hence empty here despite F7\.', 'values registered at first use (Stage 3, 2026-07-07: 19 slugs, persons and outlets).'
Set-Content -LiteralPath $tvPath -Value $tv -Encoding utf8NoBOM
python -c "import json;d=json.load(open(r'C:\AI\Platform\MediaVault\core\tag_vocabulary.json',encoding='utf8'));v=d['namespaces']['speaker']['values'];print('JSON_VALID, speaker values:',len(v))"
if ($LASTEXITCODE -ne 0) { throw 'ABORT: tag_vocabulary.json invalid after edit. Restore from .pre-stage3-20260707 backup and escalate.' }

Write-Host '--- POST-STAGE3 FILE STATE ---'
Write-Host ('LIVE DB sha256 now: ' + (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash)
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host '--- GIT SNAPSHOT (read-only; commit gate follows verification) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE3_SCRIPT_DONE'
