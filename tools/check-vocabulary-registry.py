# Criterion 4 verification check (v2.1-target 12.4).
# Confirms every namespace in live artifacts.tags has a vocabulary row.
# Exits non-zero on any gap.
import sqlite3, json, sys

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
c = sqlite3.connect(DB)

live = set()
for (tags,) in c.execute('SELECT tags FROM artifacts'):
    for t in json.loads(tags or '[]'):
        live.add(t.split(':',1)[0])

registry = {r[0] for r in c.execute('SELECT namespace FROM vocabulary')}
c.close()

missing = sorted(live - registry)
shown = ', '.join(missing) if missing else 'none'
print('live namespaces:      ', len(live))
print('registry rows:        ', len(registry))
print('missing from registry:', shown)

if missing:
    print('FAIL: namespaces in live tags have no registry row.')
    sys.exit(1)
print('PASS: every live namespace has a registry row.')
sys.exit(0)
