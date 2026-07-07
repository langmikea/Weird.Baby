# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite   (Stage 3: source collapse, transactional)
#   $env:TEMP\mv_stage3_write.py                       (throwaway worker)
# PREREQ: MV server NOT running. PowerShell 7.
# Stage 3 per brief (locked F6): rule URL-host > source_platform column > source: tag;
# add bandcamp (already live); map web->other; keep press/local; distrokid already dropped (Stage 2).
# Fresh disagreement measurement (2026-07-07): 14. Assume-and-stated: the 19 url-less/
# column-less/tag-less local-drop|cowork artifacts resolve to 'local'.
# Pinned to the dry run; aborts with NO changes on any drift.

$py = Join-Path $env:TEMP 'mv_stage3_write.py'
$code = @'
import sqlite3, json, collections, sys
from urllib.parse import urlparse

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
HOST_MAP = {'youtube.com':'youtube','www.youtube.com':'youtube','youtu.be':'youtube','m.youtube.com':'youtube',
            'bandcamp.com':'bandcamp','facebook.com':'facebook','www.facebook.com':'facebook','m.facebook.com':'facebook','fb.com':'facebook','fb.watch':'facebook',
            'reverbnation.com':'reverbnation','www.reverbnation.com':'reverbnation',
            'instagram.com':'instagram','www.instagram.com':'instagram','tiktok.com':'tiktok','www.tiktok.com':'tiktok'}
MAP = {'web':'other'}
LOCAL19 = {'MV-HR-20260405-029','MV-20260419-003','MV-20260419-004','MV-20260529-001','MV-HR-20260531-001',
           'MV-HR-ALBUM-arkansas','MV-HR-ALBUM-crooked_home','MV-HR-ALBUM-wheel','MV-HR-ALBUM-dandelions',
           'MV-HR-ALBUM-skipping','MV-HR-ALBUM-cracked','MV-HR-20260611-001','MV-HR-20260611-002',
           'MV-HR-20260611-003','MV-HR-20260611-004','MV-HR-20260611-005','MV-HR-20260611-006',
           'MV-HR-ALBUM-phone_recordings','MV-HR-ALBUM-rarities'}
EXPECT_FINAL = {'youtube':105,'bandcamp':79,'reverbnation':42,'local':31,'facebook':16,'press':12,'other':7,'instagram':1}

def host_of(url):
    if not url: return None
    try: h = urlparse(url).netloc.lower()
    except Exception: return None
    if h in HOST_MAP: return HOST_MAP[h]
    if h.endswith('.bandcamp.com'): return 'bandcamp'
    if h.endswith('.reverbnation.com'): return 'reverbnation'
    return None

con = sqlite3.connect(DB)
cur = con.cursor()
def fail(msg):
    con.rollback(); con.close()
    print('PRECONDITION FAILED - NO CHANGES WRITTEN:', msg)
    sys.exit(1)

rows = cur.execute("SELECT id, source_url, source_platform, tags FROM artifacts").fetchall()
if len(rows) != 293: fail('artifacts != 293')
resolved = {}; dis = 0; unresolved = set(); yt_before = set()
for aid, url, col, tags_j in rows:
    tags = json.loads(tags_j) if tags_j else []
    stags = [t.split(':',1)[1] for t in tags if t.startswith('source:')]
    if len(stags) > 1: fail('multiple source tags on %s' % aid)
    tag = stags[0] if stags else None
    if col == 'youtube': yt_before.add(aid)
    colm = MAP.get(col, col); tagm = MAP.get(tag, tag)
    h = host_of(url)
    if tag is not None and col is not None and tagm != colm: dis += 1
    v = h or colm or tagm
    if v is None: unresolved.add(aid); v = 'local'
    resolved[aid] = v
if dis != 14: fail('fresh disagreement count %d != 14 (dry-run pin)' % dis)
if unresolved != LOCAL19: fail('unresolved set drifted: %r' % sorted(unresolved.symmetric_difference(LOCAL19)))
if collections.Counter(resolved.values()) != collections.Counter(EXPECT_FINAL): fail('final distribution drifted: %r' % collections.Counter(resolved.values()))
changed_cols = [aid for aid, url, col, t in rows if (col or None) != resolved[aid]]
if sorted(changed_cols) != sorted(LOCAL19): fail('column changes beyond the 19 NULL fills: %r' % changed_cols)

# --- transactional write ---
tag_updates = 0
for aid, url, col, tags_j in rows:
    tags = json.loads(tags_j) if tags_j else []
    newtags = sorted([t for t in tags if not t.startswith('source:')] + ['source:' + resolved[aid]])
    if newtags != sorted(tags):
        cur.execute("UPDATE artifacts SET tags=? WHERE id=?", (json.dumps(newtags), aid))
        tag_updates += 1
cur.executemany("UPDATE artifacts SET source_platform='local' WHERE id=?", [(a,) for a in sorted(LOCAL19)])
# registry sync for source:* slugs (Stage-2 invariant maintained)
pay = collections.Counter()
for (t,) in cur.execute("SELECT tags FROM artifacts WHERE tags IS NOT NULL"):
    for v in json.loads(t):
        if isinstance(v, str): pay[v] += 1
reg = dict(cur.execute("SELECT slug, usage_count FROM tags WHERE slug LIKE 'source:%'"))
import datetime
now = datetime.datetime.now(datetime.timezone.utc).strftime('%Y-%m-%d %H:%M:%S')
sadds = sorted(s for s in pay if s.startswith('source:') and s not in reg)
sdrops = sorted(s for s in reg if pay.get(s, 0) == 0)
sfix = sorted((s, pay[s]) for s in reg if pay.get(s, 0) not in (0, reg[s]))
cur.executemany("DELETE FROM tags WHERE slug=?", [(s,) for s in sdrops])
cur.executemany("INSERT INTO tags(slug, display_name, usage_count, created_at) VALUES (?,NULL,?,?)", [(s, pay[s], now) for s in sadds])
cur.executemany("UPDATE tags SET usage_count=? WHERE slug=?", [(c, s) for s, c in sfix])
con.commit()
print('tag payload updates:', tag_updates, '(expect 68 = 49 rewrites + 19 local adds)')
print('registry source adds:', sadds)
print('registry source drops:', sdrops)
print('registry source fixes:', sfix)

# --- post-commit verification ---
final_col = collections.Counter(); final_tag = collections.Counter(); agree = 0; one_tag = 0
for aid, col, t in cur.execute("SELECT id, source_platform, tags FROM artifacts"):
    tags = [x.split(':',1)[1] for x in json.loads(t) if x.startswith('source:')]
    final_col[col] += 1; one_tag += (len(tags) == 1)
    if tags: final_tag[tags[0]] += 1
    agree += (len(tags) == 1 and tags[0] == col)
print('every artifact exactly 1 source tag (expect 293):', one_tag)
print('tag==column agreement (expect 293):', agree)
print('final column distribution:', dict(final_col.most_common()))
print('final tag distribution:', dict(final_tag.most_common()))
yt_after = cur.execute("SELECT COUNT(*) FROM artifacts WHERE source_platform='youtube'").fetchone()[0]
loc19 = cur.execute("SELECT COUNT(*) FROM artifacts WHERE source_platform='local' AND id IN (%s)" % ','.join('?' * len(LOCAL19)), sorted(LOCAL19)).fetchone()[0]
print('youtube column count after (expect 105):', yt_after)
print('the 19 fills all local (expect 19):', loc19)
reg2 = dict(cur.execute("SELECT slug, usage_count FROM tags"))
pay2 = collections.Counter()
for (t,) in cur.execute("SELECT tags FROM artifacts WHERE tags IS NOT NULL"):
    for v in json.loads(t):
        if isinstance(v, str): pay2[v] += 1
print('whole-registry mismatches (expect 0):', sum(1 for s in reg2 if pay2.get(s, 0) != reg2[s]))
print('unregistered payload slugs (expect 0):', sum(1 for s in pay2 if s not in reg2))
print('zero-usage rows (expect 0):', sum(1 for s in reg2 if reg2[s] == 0))
print('artifacts (expect 293):', cur.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0])
print('integrity_check:', cur.execute("PRAGMA integrity_check").fetchone()[0])
con.close()
print('STAGE3_WRITE_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
Write-Host 'STAGE3A_SCRIPT_DONE'
