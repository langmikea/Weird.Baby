# READ-ONLY script - Stage 5 export + client sanity verification (post-export).
# Writes only $env:TEMP\fact_kind_stage5_verify.py (throwaway). No DB write, no repo write.
# PREREQ: run AFTER `npm run export-artifacts` completed (MV server up for the export),
#   with the MV server STOPPED again before this script.
# Brief: FACT_KIND_PUV_PILOT-20260707 Stage 5, as modified by Flag B option (b):
#   facts are vault-status -> expectation INVERTS: facts ABSENT from export, content idempotent.
# PowerShell 7, run from any cwd (git diff section runs -C the repo).

$py = Join-Path $env:TEMP 'fact_kind_stage5_verify.py'
$code = @'
import sqlite3, json, sys

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
HR = r'C:\AI\Projects\weird-baby-museum\src\data\exhibits\hunter_root.json'
CV = r'C:\AI\Projects\weird-baby-museum\src\data\vocabulary.json'
FAIL = []
def check(name, ok, detail=''):
    print(('OK  ' if ok else 'FAIL') + ' - ' + name + ((' :: ' + str(detail)) if detail else ''))
    ok or FAIL.append(name)

con = sqlite3.connect('file:' + DB.replace('\\','/') + '?mode=ro', uri=True)
cur = con.cursor()
check('DB: 297 artifacts / 4 facts / integrity ok',
      cur.execute('SELECT COUNT(*) FROM artifacts').fetchone()[0] == 297 and
      cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact'").fetchone()[0] == 4 and
      cur.execute('PRAGMA integrity_check').fetchone()[0] == 'ok')
check('DB: all 4 facts still vault (never released)',
      cur.execute("SELECT COUNT(*) FROM artifacts WHERE kind='fact' AND status='vault'").fetchone()[0] == 4)

raw = open(HR, encoding='utf-8').read()
j = json.loads(raw)
arts = j.get('artifacts', [])
check('hunter_root.json: 33 artifacts (unchanged)', len(arts) == 33, len(arts))
check('hunter_root.json: zero MV-HR-20260707 ids (facts absent)', 'MV-HR-20260707' not in raw)
ids = {a.get('id') for a in arts}
check('hunter_root.json: no fact-kind leakage in any record', all('fact' != a.get('kind') for a in arts) and '"kind"' not in raw)
check('hunter_root.json: export ran fresh (exported_at postdates Stage-3 02:44:31Z)',
      j.get('metadata', {}).get('exported_at', '') > '2026-07-07T02:44:31.407Z',
      j.get('metadata', {}).get('exported_at'))

cv = json.load(open(CV, encoding='utf-8'))
check('vocabulary.json: 22 rows (vocabulary table untouched by pilot)',
      cv['metadata']['row_count'] == 22 and len(cv['namespaces']) == 22)
check('vocabulary.json: fresh exported_at', cv['metadata']['exported_at'] > '2026-07-07T02:44:31.407Z', cv['metadata']['exported_at'])
con.close()
print('STAGE5_VERIFY ' + ('CLEAN' if not FAIL else 'FAILURES: %r' % FAIL))
sys.exit(0 if not FAIL else 2)
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
if ($LASTEXITCODE -ne 0) { throw 'ABORT: Stage 5 verification failed. See FAIL lines above. STOP per brief (client-facing anomaly); escalate.' }

Write-Host '--- CONTENT-IDEMPOTENCE PROOF (git diff, expect ONLY exported_at lines) ---'
git -C 'C:\AI\Projects\weird-baby-museum' --no-pager diff --unified=0 -- src/data/exhibits/hunter_root.json src/data/vocabulary.json
Write-Host '--- diff stat ---'
git -C 'C:\AI\Projects\weird-baby-museum' --no-pager diff --stat -- src/data/exhibits/hunter_root.json src/data/vocabulary.json
Write-Host '--- GIT SNAPSHOT (read-only) ---'
Write-Host '[weird-baby-museum status --short]'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
Write-Host 'STAGE5_SCRIPT_DONE'
