# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite   (Stage 4: bands -> band, transactional)
#   $env:TEMP\mv_stage4_write.py                       (throwaway worker)
# PREREQ: MV server NOT running. PowerShell 7.
# Stage 4 per brief (D-d): rewrite payload bands:* -> band:* (288); rename
# vocabulary row bands -> band (keeps tier 1, sort 6); rename 2 tags-registry
# slugs. MUST NOT touch the lineup value 'band' (lineup:band, 12 occurrences).
# Aborts with NO changes on any precondition drift.

$py = Join-Path $env:TEMP 'mv_stage4_write.py'
$code = @'
import sqlite3, json, collections, sys

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
con = sqlite3.connect(DB)
cur = con.cursor()
def fail(msg):
    con.rollback(); con.close()
    print('PRECONDITION FAILED - NO CHANGES WRITTEN:', msg)
    sys.exit(1)

if cur.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0] != 293: fail('artifacts != 293')
pay = collections.Counter()
for (t,) in cur.execute("SELECT tags FROM artifacts WHERE tags IS NOT NULL"):
    for v in json.loads(t):
        if isinstance(v, str): pay[v] += 1
if pay.get('bands:hunter_root', 0) != 284: fail('bands:hunter_root != 284')
if pay.get('bands:medusas_disco', 0) != 4: fail('bands:medusas_disco != 4')
if sum(c for s, c in pay.items() if s.startswith('bands:')) != 288: fail('bands: total != 288')
if any(s.startswith('band:') for s in pay): fail('band: payloads already exist')
if pay.get('lineup:band', 0) != 12: fail('lineup:band != 12')
if cur.execute("SELECT COUNT(*) FROM vocabulary WHERE namespace='band'").fetchone()[0] != 0: fail('vocabulary band row exists')
vrow = cur.execute("SELECT tier, sort_order, retired_at FROM vocabulary WHERE namespace='bands'").fetchone()
if vrow != (1, 6, None): fail('vocabulary bands row unexpected: %r' % (vrow,))
reg = dict(cur.execute("SELECT slug, usage_count FROM tags WHERE slug LIKE 'bands:%' OR slug LIKE 'band:%'"))
if reg != {'bands:hunter_root': 284, 'bands:medusas_disco': 4}: fail('registry band(s) slugs unexpected: %r' % reg)

# --- transactional write ---
changed = 0; occ = 0
for aid, t in cur.execute("SELECT id, tags FROM artifacts WHERE tags LIKE '%bands:%'").fetchall():
    tags = json.loads(t)
    new = ['band:' + x.split(':', 1)[1] if x.startswith('bands:') else x for x in tags]
    occ += sum(1 for x in tags if x.startswith('bands:'))
    cur.execute("UPDATE artifacts SET tags=? WHERE id=?", (json.dumps(sorted(new)), aid))
    changed += 1
cur.execute("UPDATE vocabulary SET namespace='band', display_name='Band' WHERE namespace='bands'")
cur.execute("UPDATE tags SET slug='band:hunter_root' WHERE slug='bands:hunter_root'")
cur.execute("UPDATE tags SET slug='band:medusas_disco' WHERE slug='bands:medusas_disco'")
con.commit()
print('artifacts rewritten:', changed, '| bands: occurrences replaced:', occ, '(expect 288)')

# --- post-commit verification ---
pay2 = collections.Counter()
for (t,) in cur.execute("SELECT tags FROM artifacts WHERE tags IS NOT NULL"):
    for v in json.loads(t):
        if isinstance(v, str): pay2[v] += 1
print('bands: payloads remaining (expect 0):', sum(c for s, c in pay2.items() if s.startswith('bands:')))
print('band: payloads (expect 288):', sum(c for s, c in pay2.items() if s.startswith('band:')))
print('  band:hunter_root (expect 284):', pay2.get('band:hunter_root', 0))
print('  band:medusas_disco (expect 4):', pay2.get('band:medusas_disco', 0))
print('lineup:band intact (expect 12):', pay2.get('lineup:band', 0))
print('vocabulary band row:', cur.execute("SELECT namespace, display_name, tier, sort_order, retired_at FROM vocabulary WHERE namespace='band'").fetchone())
print('vocabulary bands rows (expect 0):', cur.execute("SELECT COUNT(*) FROM vocabulary WHERE namespace='bands'").fetchone()[0])
reg2 = dict(cur.execute("SELECT slug, usage_count FROM tags"))
print('whole-registry mismatches (expect 0):', sum(1 for s in reg2 if pay2.get(s, 0) != reg2[s]))
print('unregistered payload slugs (expect 0):', sum(1 for s in pay2 if s not in reg2))
print('zero-usage rows (expect 0):', sum(1 for s in reg2 if reg2[s] == 0))
print('artifacts (expect 293):', cur.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0])
print('integrity_check:', cur.execute("PRAGMA integrity_check").fetchone()[0])
con.close()
print('STAGE4_WRITE_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py
Write-Host 'STAGE4A_SCRIPT_DONE'
