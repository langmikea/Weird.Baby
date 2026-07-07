# READ-ONLY script - verifies Stage 3 surface agreement after the export runs.
# Writes only $env:TEMP\fact_kind_stage3_verify.py (throwaway). No DB write, no repo write.
# PREREQ: run AFTER (1) tag_vocabulary.json kind_column edit (Cowork, host-side file tools),
#   (2) MV server running + `npm run export-artifacts` completed in weird-baby-museum.
# Brief: FACT_KIND_PUV_PILOT-20260707 Stage 3. PowerShell 7, run from any cwd.

$py = Join-Path $env:TEMP 'fact_kind_stage3_verify.py'
$code = @'
import sqlite3, json, sys, collections

DB   = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
TV   = r'C:\AI\Platform\MediaVault\core\tag_vocabulary.json'
CV   = r'C:\AI\Projects\weird-baby-museum\src\data\vocabulary.json'
HR   = r'C:\AI\Projects\weird-baby-museum\src\data\exhibits\hunter_root.json'
FAIL = []
def check(name, ok, detail=''):
    print(('OK  ' if ok else 'FAIL') + ' - ' + name + ((' :: ' + str(detail)) if detail else ''))
    ok or FAIL.append(name)

con = sqlite3.connect('file:' + DB.replace('\\','/') + '?mode=ro', uri=True)
cur = con.cursor()
ddl = cur.execute("SELECT sql FROM sqlite_master WHERE name='artifacts'").fetchone()[0]
import re
m = re.search(r"CHECK\(kind IN \(([^)]*)\)\)", ddl)
db_kinds = [v.strip().strip("'") for v in m.group(1).split(',')]
check('DB CHECK carries fact (8 values)', db_kinds == ['performance','release','announcement','studio','candid','interview','fan','fact'], db_kinds)
check('DB: zero kind=fact rows yet (pilot inserts are Stage 4)', cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0] == 0)
check('DB: vocabulary table untouched (22 rows)', cur.execute('SELECT COUNT(*) FROM vocabulary').fetchone()[0] == 22)
check('DB: tags registry untouched (211 slugs, no kind:* slug)',
      cur.execute('SELECT COUNT(*) FROM tags').fetchone()[0] == 211 and
      cur.execute("SELECT COUNT(*) FROM tags WHERE slug LIKE 'kind:%'").fetchone()[0] == 0)
check('DB: artifacts still 293 / integrity ok',
      cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0] == 293 and
      cur.execute('PRAGMA integrity_check').fetchone()[0] == 'ok')

tv = json.load(open(TV, encoding='utf-8'))
kc = tv['kind_column']
check('tag_vocabulary.json parses; kind_column.values == DB CHECK order', kc['values'] == db_kinds, kc['values'])
check('kind_column.value_meta has all 8 incl fact', sorted(kc['value_meta']) == sorted(db_kinds))
reg = collections.defaultdict(set)
for (slug,) in cur.execute('SELECT slug FROM tags'):
    ns, _, val = slug.partition(':')
    reg[ns].add(val)
tv_ns = {k: set(v['values']) for k, v in tv['namespaces'].items()}
live_reg = {k: v for k, v in reg.items() if k != 'card_kind'}
check('namespaces == DB tags registry exactly (card_kind unregistered by design)',
      tv_ns == live_reg,
      {'only_in_file': sorted(set(tv_ns) - set(live_reg)), 'only_in_db': sorted(set(live_reg) - set(tv_ns)),
       'value_deltas': sorted(k for k in set(tv_ns) & set(live_reg) if tv_ns[k] != live_reg[k])})
vrows = {ns: (t, s, r) for ns, t, s, r in cur.execute('SELECT namespace, tier, sort_order, retired_at FROM vocabulary')}
tiers_ok = all(ns in vrows and tv['namespaces'][ns].get('tier') == vrows[ns][0] and tv['namespaces'][ns].get('sort') == vrows[ns][1] for ns in tv['namespaces'])
check('namespace tier/sort mirror vocabulary table', tiers_ok)

cv = json.load(open(CV, encoding='utf-8'))
rows = cv['namespaces']
check('client vocabulary.json: 22 rows, namespaces == vocabulary table',
      cv['metadata']['row_count'] == 22 and len(rows) == 22 and {r['namespace'] for r in rows} == set(vrows),
      (cv['metadata']['row_count'], len(rows)))
check('client vocabulary.json regenerated THIS stage (exported_at newer than Stage-8a 01:40:59Z)',
      cv['metadata']['exported_at'] > '2026-07-07T01:40:59.148Z', cv['metadata']['exported_at'])
hr = open(HR, encoding='utf-8').read()
check('hunter_root.json: no fact records (vault-only pilot not yet inserted; kind never exported)', '"fact"' not in hr)
j = json.loads(hr)
check('hunter_root.json artifact count unchanged (33)', len(j.get('artifacts', [])) == 33, len(j.get('artifacts', [])))
con.close()
print('STAGE3_VERIFY ' + ('CLEAN' if not FAIL else 'FAILURES: %r' % FAIL))
sys.exit(0 if not FAIL else 2)
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
if ($LASTEXITCODE -ne 0) { throw 'ABORT: Stage 3 verification failed. See FAIL lines above. Escalate; do not commit.' }

Write-Host '--- GIT SNAPSHOT (read-only) ---'
Write-Host '[MediaVault status --short]'
git -C 'C:\AI\Platform\MediaVault' status --short
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE3_SCRIPT_DONE'
