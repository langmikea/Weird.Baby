# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite   (INSERT 2 recipe-card artifacts; 1 registry INSERT; 7 registry UPDATEs; 1 id_sequence UPDATE)
#   $env:TEMP\factscroller_stage2_recipes.py           (throwaway worker)
# All other operations read-only. PowerShell 7, run from any cwd.
# PREREQ 1: MV server (imgserver) NOT running.
# PREREQ 2: factscroller_stage2_release_facts.ps1 ran clean (facts released=97, released total=308).
# PREREQ 3: Mike wording gate PASS (2026-07-07): titles/blurbs + card_kind:recipe blessed + Arkansas BROAD.
# Brief: FACTSCROLLER_REPLUMB-20260707 Stage 2 (DB write 2 of 2).
# Guard rails: content preconditions (no sha pin — the flip made the DB sha
# non-deterministic via released_at timestamps); one transaction; verify-or-
# rollback on every count; any RECIPE_ABORT line = nothing written.

$src = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
$wal = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-wal'
$shm = 'C:\AI\Platform\MediaVault\core\mediavault.sqlite-shm'
Write-Host ('WAL present (must be False): ' + (Test-Path -LiteralPath $wal))
Write-Host ('SHM present (must be False): ' + (Test-Path -LiteralPath $shm))
Write-Host ('PRE sha256 (record-only, non-deterministic post-flip): ' + (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash)

$py = Join-Path $env:TEMP 'factscroller_stage2_recipes.py'
$code = @'
import sqlite3, sys, json, datetime
P = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
con = sqlite3.connect(P)
cur = con.cursor()

def occ_counter():
    from collections import Counter
    o = Counter()
    for (t,) in cur.execute('SELECT tags FROM artifacts'):
        for v in json.loads(t): o[v] += 1
    return o

# ── Preconditions (content-based; ties this run to the release-flip) ──────────
tot   = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
fr    = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='released'").fetchone()[0]
fv    = cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='vault'").fetchone()[0]
rel   = cur.execute("SELECT COUNT(*) FROM artifacts WHERE status='released'").fetchone()[0]
dup   = cur.execute("SELECT COUNT(*) FROM artifacts WHERE id IN ('MV-HR-20260707-100','MV-HR-20260707-101')").fetchone()[0]
haveR = cur.execute("SELECT COUNT(*) FROM tags WHERE slug='card_kind:recipe'").fetchone()[0]
seq   = cur.execute("SELECT last_seq FROM id_sequence WHERE date_str='20260707'").fetchone()
seqv  = seq[0] if seq else None
nslug = cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0]
o0 = occ_counter()
mism0 = sum(1 for slug, uc in cur.execute('SELECT slug, usage_count FROM tags') if o0.get(slug, 0) != uc)
if tot != 392: print('RECIPE_ABORT: artifacts', tot, '!= 392'); sys.exit(1)
if fr != 97 or fv != 0: print('RECIPE_ABORT: facts not fully released', fr, fv, '(run the flip first)'); sys.exit(1)
if rel != 308: print('RECIPE_ABORT: released', rel, '!= 308 (flip not applied)'); sys.exit(1)
if dup != 0: print('RECIPE_ABORT: -100/-101 already present', dup); sys.exit(1)
if haveR != 0: print('RECIPE_ABORT: card_kind:recipe already registered'); sys.exit(1)
if seqv != 4: print('RECIPE_ABORT: id_sequence 20260707 =', seqv, '!= 4 (Flag D unexpected)'); sys.exit(1)
if nslug != 230: print('RECIPE_ABORT: registry', nslug, '!= 230'); sys.exit(1)
if mism0 != 0: print('RECIPE_ABORT: registry has', mism0, 'usage mismatches at entry'); sys.exit(1)

now  = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%dT%H:%M:%S')
utc  = datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%SZ')
day  = '2026-07-07'

nick_tags = sorted(['exhibit:hunter_root','card_kind:recipe','source:local','band:hunter_root','people:nick_root','topic:family','content_kind:other'])
ark_tags  = sorted(['exhibit:hunter_root','card_kind:recipe','source:local','band:hunter_root','album:arkansas','content_kind:other'])

nick_notes = json.dumps({'card_kind':'recipe','container':True,
    'recipe':{'all':['people:nick_root'],'any':[],'not':[]},
    'title':'Nick Root','created_by':'factscroller_replumb','created_utc':utc})
ark_notes = json.dumps({'card_kind':'recipe','container':True,
    'recipe':{'all':['album:arkansas'],'any':[],'not':[]},
    'title':'Arkansas','created_by':'factscroller_replumb','created_utc':utc})

# id, source_url, source_platform, ingest_source, ingest_date, storage_mode,
# media_type, post_date_confidence, capture_date, status, released_at, released_by,
# description_short, description_long, tags, notes, created_at, updated_at, kind
rows = [
  ('MV-HR-20260707-100', None, 'local', 'cowork', day, 'vaulted', 'other', 'unknown', day,
   'released', now, 'mike',
   'Nick Root', "The older brother. The reason there's a guitar in these hands at all.",
   json.dumps(nick_tags), nick_notes, now, now, None),
  ('MV-HR-20260707-101', None, 'local', 'cowork', day, 'vaulted', 'other', 'unknown', day,
   'released', now, 'mike',
   'Arkansas', 'What the critics said about Arkansas — and a few words from the man himself.',
   json.dumps(ark_tags), ark_notes, now, now, None),
]

try:
    cur.execute('BEGIN')
    cur.executemany('''INSERT INTO artifacts
      (id, source_url, source_platform, ingest_source, ingest_date, storage_mode,
       media_type, post_date_confidence, capture_date, status, released_at, released_by,
       description_short, description_long, tags, notes, created_at, updated_at, kind)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)''', rows)

    # Registry: new slug at true usage 2; increments for every reused slug.
    cur.execute("INSERT INTO tags (slug, display_name, usage_count, created_at) VALUES ('card_kind:recipe', NULL, 2, ?)", (now,))
    for slug, inc in [('exhibit:hunter_root',2),('source:local',2),('band:hunter_root',2),
                      ('content_kind:other',2),('people:nick_root',1),('topic:family',1),('album:arkansas',1)]:
        cur.execute('UPDATE tags SET usage_count = usage_count + ? WHERE slug = ?', (inc, slug))

    # Flag D repair: id_sequence caught up to the highest allocated seq.
    cur.execute("UPDATE id_sequence SET last_seq = 101 WHERE date_str = '20260707'")

    # ── In-transaction asserts ────────────────────────────────────────────────
    tot2 = cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0]
    rec  = cur.execute("SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE json_each.value='card_kind:recipe'").fetchone()[0]
    recR = cur.execute("SELECT COUNT(*) FROM artifacts a, json_each(a.tags) WHERE json_each.value='card_kind:recipe' AND a.status='released'").fetchone()[0]
    nsl  = cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0]
    zero = cur.execute('SELECT COUNT(*) FROM tags WHERE usage_count = 0').fetchone()[0]
    seq2 = cur.execute("SELECT last_seq FROM id_sequence WHERE date_str='20260707'").fetchone()[0]
    o1 = occ_counter()
    mism1 = sum(1 for slug, uc in cur.execute('SELECT slug, usage_count FROM tags') if o1.get(slug, 0) != uc)
    # source tag==column parity
    spc = 0
    for (sp, t) in cur.execute('SELECT source_platform, tags FROM artifacts'):
        tt = json.loads(t)
        want = 'source:%s' % sp if sp else None
        if want and want in tt: spc += 1
    src_col = cur.execute('SELECT COUNT(*) FROM artifacts WHERE source_platform IS NOT NULL').fetchone()[0]
    if tot2 != 394: raise RuntimeError('artifacts %d != 394' % tot2)
    if rec != 2 or recR != 2: raise RuntimeError('recipe cards %d/%d != 2/2' % (rec, recR))
    if nsl != 231: raise RuntimeError('registry %d != 231' % nsl)
    if zero != 0: raise RuntimeError('zero-usage slugs %d != 0' % zero)
    if mism1 != 0: raise RuntimeError('registry usage mismatches %d != 0' % mism1)
    if seq2 != 101: raise RuntimeError('id_sequence %d != 101' % seq2)
    if spc != src_col: raise RuntimeError('source tag==column %d != %d' % (spc, src_col))
    con.commit()
except Exception as e:
    con.rollback()
    print('RECIPE_ABORT: rolled back -', e); sys.exit(1)

print('artifacts (expect 394):', tot2)
print('card_kind:recipe cards released (expect 2/2):', recR, '/', rec)
print('registry slugs (expect 231):', nsl, '| zero-usage (expect 0):', zero, '| mismatches (expect 0):', mism1)
print('id_sequence 20260707 (expect 101):', seq2)
print('source tag==column (expect equal):', spc, '==', src_col)
print('integrity_check:', cur.execute('PRAGMA integrity_check').fetchone()[0])
for rid in ('MV-HR-20260707-100','MV-HR-20260707-101'):
    r = cur.execute('SELECT id, status, description_short, description_long, tags, notes FROM artifacts WHERE id=?', (rid,)).fetchone()
    print('---', r[0], '|', r[1], '|', r[2])
    print('   blurb:', r[3])
    print('   tags :', r[4])
    print('   recipe:', json.loads(r[5])['recipe'])
con.close()
print('RECIPE_INSERT_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py

Write-Host ('POST sha256: ' + (Get-FileHash -LiteralPath $src -Algorithm SHA256).Hash)
Write-Host '--- GIT SNAPSHOT (DB untracked by policy; commit gate rides the Stage 2 close) ---'
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE2_RECIPE_SCRIPT_DONE'
