# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite   (Stage 2: tags registry rebuild, transactional)
#   $env:TEMP\mv_stage2_write.py                       (throwaway worker)
# PREREQ: MV server NOT running. PowerShell 7.
# Stage 2 per brief (locked F7): recompute every tags.usage_count from live
# artifacts.tags payloads; register used-but-unregistered slugs; drop
# zero-usage stubs. Pinned to the 2026-07-07 dry-run: expects exactly
# 247 registry slugs -> 16 adds / 53 drops / 14 count fixes -> 210 slugs.
# Aborts with NO changes on any drift from those numbers.

$py = Join-Path $env:TEMP 'mv_stage2_write.py'
$code = @'
import sqlite3, json, collections, sys, datetime

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
reg = dict(cur.execute("SELECT slug, usage_count FROM tags"))
adds  = sorted(s for s in pay if s not in reg)
drops = sorted(s for s in reg if pay.get(s, 0) == 0)
fixes = sorted((s, reg[s], pay[s]) for s in reg if s in pay and reg[s] != pay[s])
if len(reg) != 247: fail('registry slugs %d != 247' % len(reg))
if len(pay) != 210: fail('distinct payload slugs %d != 210' % len(pay))
if (len(adds), len(drops), len(fixes)) != (16, 53, 14):
    fail('diff drifted from dry-run: adds/drops/fixes = %d/%d/%d (expect 16/53/14)' % (len(adds), len(drops), len(fixes)))

now = datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')
cur.executemany("DELETE FROM tags WHERE slug=?", [(s,) for s in drops])
cur.executemany("INSERT INTO tags(slug, display_name, usage_count, created_at) VALUES (?,NULL,?,?)",
                [(s, pay[s], now) for s in adds])
cur.executemany("UPDATE tags SET usage_count=? WHERE slug=?", [(p, s) for s, r, p in fixes])
con.commit()

print('applied: %d drops, %d adds, %d count fixes' % (len(drops), len(adds), len(fixes)))
print('ADDS:');  [print('  +', s, pay[s]) for s in adds]
print('DROPS:'); [print('  -', s) for s in drops]
print('FIXES:'); [print('  ~ %s %d -> %d' % (s, r, p)) for s, r, p in fixes]

# --- post-commit verification ---
reg2 = dict(cur.execute("SELECT slug, usage_count FROM tags"))
mism = [s for s in reg2 if pay.get(s, 0) != reg2[s]]
unreg = [s for s in pay if s not in reg2]
zero = [s for s in reg2 if reg2[s] == 0]
print('registry slugs now (expect 210):', len(reg2))
print('count mismatches (expect 0):', len(mism), mism[:5])
print('unregistered payload slugs (expect 0):', len(unreg), unreg[:5])
print('zero-usage rows remaining (expect 0):', len(zero), zero[:5])
print('artifacts (expect 293):', cur.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0])
print('integrity_check:', cur.execute("PRAGMA integrity_check").fetchone()[0])
con.close()
print('STAGE2_WRITE_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py

Write-Host '--- GIT SNAPSHOT (read-only) ---'
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host 'STAGE2_SCRIPT_DONE'
