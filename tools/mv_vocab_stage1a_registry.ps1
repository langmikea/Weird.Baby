# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Platform\MediaVault\core\mediavault.sqlite   (Stage 1 registry corrections, transactional)
#   $env:TEMP\mv_stage1_write.py                       (throwaway worker)
# PREREQ: MV server NOT running. PowerShell 7.
# Stage 1 per MV_VOCAB_MIGRATION_BRIEF-20260624: un-retire exhibit; register
# event/lineup/attributes (tier 3, sort 7/8/9); fold presentation:link ->
# attributes:link on MV-HR-20260405-004 (locked F8). Aborts with NO changes
# if any precondition fails. tags-registry sync deliberately left to Stage 2.

$py = Join-Path $env:TEMP 'mv_stage1_write.py'
$code = @'
import sqlite3, json, sys

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
ART = 'MV-HR-20260405-004'
con = sqlite3.connect(DB)
cur = con.cursor()

def fail(msg):
    con.rollback(); con.close()
    print('PRECONDITION FAILED - NO CHANGES WRITTEN:', msg)
    sys.exit(1)

# --- preconditions ---
r = cur.execute("SELECT retired_at FROM vocabulary WHERE namespace='exhibit'").fetchone()
if r is None or r[0] is None: fail('exhibit row missing or already un-retired: %r' % (r,))
n = cur.execute("SELECT COUNT(*) FROM vocabulary WHERE namespace IN ('event','lineup','attributes','presentation')").fetchone()[0]
if n != 0: fail('event/lineup/attributes/presentation already in vocabulary (count=%d)' % n)
rows = cur.execute("SELECT id, tags FROM artifacts WHERE tags LIKE '%presentation:%'").fetchall()
if len(rows) != 1 or rows[0][0] != ART: fail('presentation payload not exactly 1 on %s: %r' % (ART, [x[0] for x in rows]))
tags = json.loads(rows[0][1])
if tags.count('presentation:link') != 1 or sum(1 for t in tags if t.startswith('presentation:')) != 1:
    fail('unexpected presentation values: %r' % tags)
if 'attributes:link' in tags: fail('attributes:link already present on %s' % ART)
if cur.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0] != 293: fail('artifacts != 293')

# --- transactional write ---
cur.execute("UPDATE vocabulary SET retired_at=NULL WHERE namespace='exhibit'")
cur.executemany(
    "INSERT INTO vocabulary(namespace, display_name, tier, sort_order, retired_at) VALUES (?,?,?,?,NULL)",
    [('event', 'Event', 3, 7), ('lineup', 'Lineup', 3, 8), ('attributes', 'Attributes', 3, 9)])
newtags = sorted(['attributes:link' if t == 'presentation:link' else t for t in tags])
cur.execute("UPDATE artifacts SET tags=? WHERE id=?", (json.dumps(newtags), ART))
# updated_at deliberately untouched (minimal change; migration, not an edit event)
con.commit()

# --- post-commit verification ---
print('== vocabulary (namespace, tier, sort, retired_at) ==')
for row in cur.execute("SELECT namespace, tier, sort_order, retired_at FROM vocabulary ORDER BY COALESCE(tier,99), COALESCE(sort_order,99)"):
    print('  %s' % (row,))
print('presentation payload count (expect 0):', cur.execute("SELECT COUNT(*) FROM artifacts WHERE tags LIKE '%presentation:%'").fetchone()[0])
print('attributes:link payload count (expect 1):', cur.execute("SELECT COUNT(*) FROM artifacts WHERE tags LIKE '%attributes:link%'").fetchone()[0])
print('%s tags now: %s' % (ART, cur.execute("SELECT tags FROM artifacts WHERE id=?", (ART,)).fetchone()[0]))
print('artifacts (expect 293):', cur.execute("SELECT COUNT(*) FROM artifacts").fetchone()[0])
print('integrity_check:', cur.execute("PRAGMA integrity_check").fetchone()[0])
con.close()
print('STAGE1_WRITE_OK')
'@
Set-Content -LiteralPath $py -Value $code -Encoding utf8NoBOM
python $py

Write-Host '--- GIT SNAPSHOT (read-only) ---'
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host 'STAGE1A_SCRIPT_DONE'
