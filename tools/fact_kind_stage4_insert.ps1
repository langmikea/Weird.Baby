# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite   (INSERT 4 fact artifacts + id_sequence row + tags usage_count sync)
#   $env:TEMP\fact_kind_stage4_insert.py               (throwaway worker)
# PREREQ: MV server NOT running. Stages 0-3 PASS. Wording approved by Mike (gate closed 2026-07-07).
# Brief: FACT_KIND_PUV_PILOT-20260707 Stage 4. PowerShell 7, run from any cwd.
# SAFETY: pinned to the post-Stage-2 DB sha256 (Stage 3 wrote no DB). One transaction;
#   all verification inside before COMMIT; ANY mismatch rolls back untouched.

$db  = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$pin = 'F983A84014BD31626BDC8B3733DA1DEE533172C080B75D5032E3808B87BA2E7F'
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath ($db + '-wal')))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath ($db + '-shm')))
$h = (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash
Write-Host ('LIVE DB sha256: ' + $h)
Write-Host ('PINNED  sha256: ' + $pin)
if ($h -ne $pin) { throw 'ABORT: live DB does not match the post-Stage-2 verified state. Escalate. Nothing was written.' }

$py = Join-Path $env:TEMP 'fact_kind_stage4_insert.py'
$code = @'
import sqlite3, json, sys, collections, datetime

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
NOW = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
TODAY = '2026-07-07'

FACTS = [
 dict(id='MV-HR-20260707-001',
      short="Nick Root was Hunter's older brother.",
      long_="He was gone at 27, taken by cancer.",
      url='https://americanahighways.org/2025/10/21/interview-hunter-root-turning-grief-into-grace-on-crooked-home/',
      platform='press',
      tags=["band:hunter_root","exhibit:hunter_root","people:nick_root","source:press","topic:family"],
      notes="PUV fact (pilot, FACT_KIND_PUV_PILOT-20260707). Breadcrumb: Americana Highways interview, in-vault MV-20260617-011. Corroboration in-vault: FB tribute MV-HR-20260405-013 (age 27); Isthmus MV-20260617-009. Death-year DELIBERATELY OMITTED - unverified, per Mike 2026-07-07. Wording: Mike."),
 dict(id='MV-HR-20260707-002',
      short='The first of the solo records was Run With The Hunt.',
      long_='Jam, grunge, and acoustic rock out of Manheim, PA.',
      url='https://www.reverbnation.com/runwiththehunt',
      platform='reverbnation',
      tags=["album:run_with_the_hunt","band:hunter_root","era:rwth","exhibit:hunter_root","source:reverbnation","topic:roots"],
      notes="PUV fact (pilot, FACT_KIND_PUV_PILOT-20260707). Breadcrumb: RWTH ReverbNation page, in-vault MV-HR-20260416-009. Brief premise 'RWTH is a confirmed band' CORRECTED by Mike at the wording gate: first solo record. Wording: Mike."),
 dict(id='MV-HR-20260707-003',
      short='Hunter was a founding member of SEEDS.',
      long_="Which became Medusa's Disco due to trademarks.",
      url='https://blueharvestbeat.wordpress.com/2014/08/14/kurt-cobain-lancaster-and-cold-pizza-my-interview-with-medusas-disco/',
      platform='press',
      tags=["band:hunter_root","band:medusas_disco","era:early_days","exhibit:hunter_root","source:press","topic:roots"],
      notes="PUV fact (pilot, FACT_KIND_PUV_PILOT-20260707). Breadcrumb: Blue Harvest Beat 2014 interview, in-vault MV-20260617-001 (documents SEEDS -> Medusa's Disco rename). Trademark reason: operator knowledge (Mike, 2026-07-07). Wording: Mike."),
 dict(id='MV-HR-20260707-004',
      short="Run With The Hunt was Hunter's first solo record.",
      long_='A transitional piece to his modern solo career.',
      url='https://www.reverbnation.com/runwiththehunt',
      platform='reverbnation',
      tags=["album:run_with_the_hunt","band:hunter_root","era:rwth","exhibit:hunter_root","source:reverbnation"],
      notes="PUV fact (pilot, FACT_KIND_PUV_PILOT-20260707). Breadcrumb: RWTH ReverbNation page, in-vault MV-HR-20260416-009. 'Transitional' characterization: operator knowledge (Mike). Wording: Mike."),
]

EXPECTED_DELTA = {'album:run_with_the_hunt': 2, 'band:hunter_root': 4, 'band:medusas_disco': 1,
                  'era:early_days': 1, 'era:rwth': 2, 'exhibit:hunter_root': 4, 'people:nick_root': 1,
                  'source:press': 2, 'source:reverbnation': 2, 'topic:family': 1, 'topic:roots': 2}

def bail(msg):
    print('ABORT:', msg)
    sys.exit(2)

con = sqlite3.connect(DB)
con.isolation_level = None
cur = con.cursor()

ddl = cur.execute("SELECT sql FROM sqlite_master WHERE name='artifacts'").fetchone()[0]
if "'fact'" not in ddl: bail('kind CHECK lacks fact - Stage 2 state not present')
if cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0] != 293: bail('artifacts != 293 pre-insert')
if cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0] != 0: bail('kind=fact rows already exist')
if cur.execute("SELECT COUNT(*) FROM artifacts WHERE id LIKE 'MV-HR-20260707-%'").fetchone()[0] != 0: bail('target ids already exist')
if cur.execute("SELECT COUNT(*) FROM id_sequence WHERE date_str='20260707'").fetchone()[0] != 0: bail('id_sequence 20260707 already exists')
missing = [s for f in FACTS for s in f['tags'] if cur.execute('SELECT COUNT(*) FROM tags WHERE slug=?', (s,)).fetchone()[0] == 0]
if missing: bail('tag slugs not in registry (vocabulary change = stop condition): %r' % missing)

pre_reg = dict(cur.execute('SELECT slug, usage_count FROM tags').fetchall())

try:
    cur.execute('BEGIN IMMEDIATE')
    for f in FACTS:
        cur.execute("""INSERT INTO artifacts
            (id, source_url, source_platform, ingest_source, ingest_date, storage_mode,
             local_asset_path, thumbnail_path, link_status, parent_artifact_id, media_type,
             post_date, post_date_confidence, capture_date, status, released_at, released_by,
             description_short, description_long, extracted_text, tags, confidence_flags,
             notes, created_at, updated_at, archived_at, kind, referenced_dates)
            VALUES (?,?,?,?,?,?,NULL,NULL,NULL,NULL,'text',NULL,NULL,NULL,'vault',NULL,NULL,?,?,NULL,?,NULL,?,?,?,NULL,'fact',NULL)""",
            (f['id'], f['url'], f['platform'], 'cowork', TODAY, 'url_only',
             f['short'], f['long_'], json.dumps(f['tags']), f['notes'], NOW, NOW))
    cur.execute("INSERT INTO id_sequence (date_str, last_seq) VALUES ('20260707', 4)")

    payload = collections.Counter()
    for (t,) in cur.execute('SELECT tags FROM artifacts'):
        for v in json.loads(t):
            payload[v] += 1
    delta = {}
    for slug in set(payload) | set(pre_reg):
        d = payload.get(slug, 0) - pre_reg.get(slug, 0)
        if d: delta[slug] = d
    print('registry delta computed:', dict(sorted(delta.items())))
    if delta != EXPECTED_DELTA: raise RuntimeError('registry delta != pinned expectation')
    if set(payload) - set(pre_reg): raise RuntimeError('new slugs appeared - stop condition')
    for slug, d in delta.items():
        cur.execute('UPDATE tags SET usage_count = usage_count + ? WHERE slug=?', (d, slug))

    n = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
    nf = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0]
    print('artifacts:', n, '(expect 297) | kind=fact:', nf, '(expect 4)')
    if n != 297 or nf != 4: raise RuntimeError('post-insert counts wrong')
    mism = cur.execute("SELECT COUNT(*) FROM tags t WHERE t.usage_count != (SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE value = t.slug)").fetchone()[0]
    zero = cur.execute('SELECT COUNT(*) FROM tags WHERE usage_count = 0').fetchone()[0]
    nreg = cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0]
    print('registry: slugs', nreg, '(expect 211) | count mismatches', mism, '| zero-usage', zero, '(both expect 0)')
    if nreg != 211 or mism != 0 or zero != 0: raise RuntimeError('registry closure failed')
    agree = cur.execute("SELECT COUNT(*) FROM artifacts a WHERE (SELECT COUNT(*) FROM json_each(a.tags) WHERE value LIKE 'source:%') = 1 AND EXISTS (SELECT 1 FROM json_each(a.tags) WHERE value = 'source:' || a.source_platform)").fetchone()[0]
    print('source tag==column agreement:', agree, '(expect 297)')
    if agree != 297: raise RuntimeError('source invariant broken')
    cur.execute('COMMIT')
except Exception as e:
    cur.execute('ROLLBACK')
    print('ROLLED BACK - DB untouched.')
    bail(repr(e))

print('integrity_check:', cur.execute('PRAGMA integrity_check').fetchone()[0])
print('--- FACTS AS QUERYABLE (SELECT-back) ---')
for r in cur.execute("SELECT id, kind, status, media_type, source_platform, description_short, description_long FROM artifacts WHERE kind='fact' ORDER BY id"):
    print(r)
print('--- breadcrumbs ---')
for r in cur.execute("SELECT id, source_url FROM artifacts WHERE kind='fact' ORDER BY id"):
    print(r)
con.close()
print('STAGE4_INSERT_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
if ($LASTEXITCODE -ne 0) { throw 'ABORT: Stage 4 insert failed or rolled back. See output above. Escalate; do not re-run.' }

Write-Host '--- POST-INSERT FILE STATE ---'
Write-Host ('LIVE DB sha256 now: ' + (Get-FileHash -LiteralPath $db -Algorithm SHA256).Hash)
Write-Host '--- GIT SNAPSHOT (read-only) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE4_SCRIPT_DONE'
