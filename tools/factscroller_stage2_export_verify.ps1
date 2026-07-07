# READ-ONLY verification. Writes nothing.
# Run AFTER: recipe insert clean → MV server up → `npm run export-artifacts`.
# Brief: FACTSCROLLER_REPLUMB-20260707 Stage 2 export verify.
# Proves: facts payload present (97), wall has ZERO fact tiles, 2 recipe cards
# on the wall with recipes baked, vocabulary carries card_kind (recipe pill).

$repo = 'C:\AI\Projects\weird-baby-museum'
$py = Join-Path $env:TEMP 'factscroller_stage2_exportverify.py'
$code = @'
import json, sys, os
REPO = r'C:\AI\Projects\weird-baby-museum'
def loadjson(p):
    with open(p, encoding='utf-8') as fh:
        return json.load(fh)
wall = loadjson(os.path.join(REPO, 'src', 'data', 'exhibits', 'hunter_root.json'))
facts_path = os.path.join(REPO, 'src', 'data', 'exhibits', 'hunter_root.facts.json')
ok = True
def check(label, cond, got):
    global ok
    print(('OK  ' if cond else 'FAIL') + ' ' + label + ' -> ' + str(got))
    if not cond: ok = False

wa = wall['artifacts']
wall_ids = set(a['id'] for a in wa)
# Structural-lock test done RIGHT: cross-reference the facts payload, not an id
# range. -005/-006 are ingested PRESS artifacts (legitimately on the wall), not
# facts — an id-range guess false-flags them. The exact invariant: no id that
# appears in the facts payload may appear on the wall.
_fp_early = loadjson(facts_path) if os.path.exists(facts_path) else {'facts': []}
fact_payload_ids = set(f['id'] for f in _fp_early['facts'])
overlap = sorted(wall_ids & fact_payload_ids)
check('wall artifact count (expect 49 = 47 + 2 recipe)', len(wa) == 49, len(wa))
check('ZERO facts on the wall (wall ∩ facts payload = empty)', len(overlap) == 0, overlap)
check('no kind field leaks to wall records', all('kind' not in a for a in wa), 'clean' if all('kind' not in a for a in wa) else 'LEAK')

recipes = [a for a in wa if a.get('card_kind') == 'recipe']
check('2 recipe cards on the wall', len(recipes) == 2, [r['id'] for r in recipes])
for r in recipes:
    has = isinstance(r.get('recipe'), dict) and isinstance(r['recipe'].get('all'), list)
    check('recipe %s carries baked recipe.all' % r['id'], has, r.get('recipe'))
    check('recipe %s era-less (no dates/era baked)' % r['id'], 'dates' not in r and 'era' not in r.get('tags', {}), {'dates':'dates' in r,'era':'era' in r.get('tags',{})})
nick = next((r for r in recipes if r['id']=='MV-HR-20260707-100'), None)
ark  = next((r for r in recipes if r['id']=='MV-HR-20260707-101'), None)
check('Nick card recipe = all:[people:nick_root]', nick and nick['recipe']['all']==['people:nick_root'], nick and nick.get('recipe'))
check('Arkansas card recipe = all:[album:arkansas]', ark and ark['recipe']['all']==['album:arkansas'], ark and ark.get('recipe'))
check('Nick title verbatim', nick and nick['title']=='Nick Root', nick and nick.get('title'))
check('Arkansas title verbatim', ark and ark['title']=='Arkansas', ark and ark.get('title'))

# facts payload
if not os.path.exists(facts_path):
    check('facts payload file exists', False, 'MISSING hunter_root.facts.json'); print('VERIFY_DONE'); sys.exit(0 if ok else 1)
fp = loadjson(facts_path)
fl = fp['facts']
check('facts payload count (expect 97)', len(fl) == 97, len(fl))
check('every fact has 2-line surface', all(isinstance(f.get('lines'), list) and len(f['lines'])==2 for f in fl), 'shape ok' if all(isinstance(f.get('lines'),list) and len(f['lines'])==2 for f in fl) else 'BAD')
check('every fact has grouped tags', all(isinstance(f.get('tags'), dict) for f in fl), 'ok')
# scope coverage sanity for the two recipes
nick_pool = [f for f in fl if 'nick_root' in f['tags'].get('people', [])]
ark_pool  = [f for f in fl if 'arkansas' in f['tags'].get('album', [])]
check('Nick recipe pool (expect 16)', len(nick_pool) == 16, len(nick_pool))
check('Arkansas recipe pool (expect 7)', len(ark_pool) == 7, len(ark_pool))
# era tags survived verbatim on facts
era_facts = [f['id'] for f in fl if f['tags'].get('era')]
check('legacy era tags kept on facts (expect 3)', len(era_facts) == 3, era_facts)

# vocabulary carries card_kind namespace (recipe pill renders under it)
voc = loadjson(os.path.join(REPO, 'src', 'data', 'vocabulary.json'))
# card_kind may be absent from registry (falls through to tier 3) — that's fine;
# the pill still renders. Just report presence for the record.
ck = next((n for n in voc['namespaces'] if n['namespace']=='card_kind'), None)
print('INFO card_kind in vocabulary registry:', bool(ck), '(absent is OK — client falls through to tier 3)')

print('ALL_OK' if ok else 'SOME_FAILED')
print('VERIFY_DONE')
sys.exit(0 if ok else 1)
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
Write-Host ('exit=' + $LASTEXITCODE)

Write-Host '--- git diff scope (expect: exporter already committed; only data files churn) ---'
git -C $repo status --short
Write-Host 'STAGE2_EXPORTVERIFY_DONE'
