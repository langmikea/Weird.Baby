# READ-ONLY script (writes only $env:TEMP\mv_stage6_verify.py, throwaway).
# PowerShell 7. MV server state irrelevant (direct read-only DB open).
# Stage 6 verification: four surfaces agree on namespace membership + value format.
#   C = live DB (vocabulary + tags)        A = core/tag_vocabulary.json (regenerated)
#   D = client src/data/vocabulary.json    B = TAXONOMY_v1.md (as-built rewrite, anchor checks)

$py = Join-Path $env:TEMP 'mv_stage6_verify.py'
$code = @'
import sqlite3, json, collections, re

DB  = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
A   = r'C:\AI\Platform\MediaVault\core\tag_vocabulary.json'
D   = r'C:\AI\Projects\weird-baby-museum\src\data\vocabulary.json'
B   = r'C:\AI\Platform\MediaVault\docs\taxonomy\TAXONOMY_v1.md'

con = sqlite3.connect('file:' + DB.replace('\\', '/') + '?mode=ro', uri=True)
cur = con.cursor()
db_ns = {r[0]: r[3] for r in cur.execute("SELECT namespace, tier, sort_order, retired_at FROM vocabulary")}
db_live = {n for n, ret in db_ns.items() if ret is None}
db_vals = collections.defaultdict(set)
hyphens = 0
for (slug,) in cur.execute("SELECT slug FROM tags"):
    ns, v = slug.split(':', 1)
    db_vals[ns].add(v)
    hyphens += ('-' in v)
pay_ns = set()
for (t,) in cur.execute("SELECT tags FROM artifacts WHERE tags IS NOT NULL"):
    for x in json.loads(t):
        pay_ns.add(x.split(':', 1)[0])
con.close()

a = json.load(open(A, encoding='utf-8'))
a_ns = set(a['namespaces'].keys())
a_vals = {k: set(v['values']) for k, v in a['namespaces'].items()}

d = json.load(open(D, encoding='utf-8'))
d_rows = d if isinstance(d, list) else d.get('rows', d.get('namespaces', []))
d_ns_all = {r['namespace']: r.get('retired_at') for r in d_rows if isinstance(r, dict) and 'namespace' in r}

print('== C (DB) ==')
print('vocabulary rows:', len(db_ns), '| live (not retired):', len(db_live))
print('registry namespaces with values:', len([n for n in db_vals if db_vals[n]]))
print('hyphenated registry values (expect 0):', hyphens)
print('payload namespaces not in vocabulary table:', sorted(pay_ns - set(db_ns)), '(card_kind expected — unregistered by design this pass)')
print()
print('== A vs C ==')
print('A namespaces == DB live namespaces:', a_ns == db_live, '| A-only:', sorted(a_ns - db_live), '| DB-live-only:', sorted(db_live - a_ns))
mismatch = {n: (sorted(a_vals[n] ^ db_vals.get(n, set()))) for n in a_ns if a_vals[n] != db_vals.get(n, set())}
print('A value-set mismatches vs registry (expect {}):', mismatch or '{}')
print()
print('== D vs C ==')
print('D namespaces == ALL DB vocabulary rows:', set(d_ns_all) == set(db_ns), '| D-only:', sorted(set(d_ns_all) - set(db_ns)), '| DB-only:', sorted(set(db_ns) - set(d_ns_all)))
ret_agree = all((d_ns_all[n] is None) == (db_ns[n] is None) for n in d_ns_all if n in db_ns)
print('retired flags agree D vs C:', ret_agree)
print()
print('== B (TAXONOMY_v1 as-built) anchor checks ==')
b = open(B, encoding='utf-8').read()
checks = [
    ('band as-built values', '`hunter_root` (284), `medusas_disco` (4)' in b),
    ('source allowed set corrected', '`bandcamp`, `facebook`, `instagram`, `local`, `other`' in b),
    ('fresh 14/0 measurement recorded', '14 tag-vs-column\ndisagreements, 0 unresolvable' in b.replace('**','') or '14 tag-vs-column' in b),
    ('exhibit un-retire recorded', 'un-retired 2026-07-07' in b),
    ('actually-retired list = unsorted+platform only', ('`unsorted` — retired 2026-05-19' in b and '`platform` — retired 2026-05-24' in b)),
    ('content_kind/card_kind marked NOT retired', 'NOT retired' in b and 'content_kind` (175' in b),
    ('no stale distrokid in allowed set', 'distrokid`, `tiktok`, `local`' not in b),
]
for name, ok in checks: print('  %s: %s' % (name, 'OK' if ok else 'FAIL'))
print()
print('STAGE6_VERIFY_DONE')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py

Write-Host '--- GIT SNAPSHOT (read-only, both repos) ---'
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE6_SCRIPT_DONE'
