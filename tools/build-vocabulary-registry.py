# Criterion 4 named build step (v2.1-target 5.4, 12.4).
# Regenerates the vocabulary table: DROP + CREATE + re-seed.
# Tier 1/2 come from CANONICAL_VOCABULARY.md (locked lists).
# Tier 3 namespaces are auto-discovered from live artifacts.tags and
# marked retired (DEEP DIVE launches empty - operator curates later).
import sqlite3, json, sys
from datetime import datetime, timezone

DB = r'C:\AI\Platform\MediaVault\core\mediavault.sqlite'
NOW = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%S.000Z')

# Locked tiers - transcribed from CANONICAL_VOCABULARY.md, not from data.
TIER1 = ['year', 'album', 'song', 'venue', 'people']
TIER2 = ['source', 'type']
DISPLAY = {
    'year':'Year','album':'Album','song':'Song','venue':'Venue','people':'People',
    'source':'Source','type':'Type','exhibit':'Exhibit',
}

def display_for(ns):
    return DISPLAY.get(ns, ns.replace('_',' ').title())

c = sqlite3.connect(DB)

# Discover namespaces actually present in live tags.
live = {}
for (tags,) in c.execute('SELECT tags FROM artifacts'):
    for t in json.loads(tags or '[]'):
        ns = t.split(':',1)[0]
        live[ns] = live.get(ns,0)+1

canon = set(TIER1+TIER2)
rows = []  # (namespace, display_name, tier, sort_order, retired_at)

for i,ns in enumerate(TIER1,1):
    rows.append((ns, display_for(ns), 1, i, None))
for i,ns in enumerate(TIER2,1):
    rows.append((ns, display_for(ns), 2, i, None))

# Tier 3: every live namespace not in canon, not 'exhibit'. Retired.
tier3 = sorted((ns for ns in live if ns not in canon and ns != 'exhibit'),
               key=lambda n:(-live[n], n))
for i,ns in enumerate(tier3,1):
    rows.append((ns, display_for(ns), 3, i, NOW))

# exhibit: routing tag (3.3). Row exists for the 12.4 check; tier NULL; retired.
if 'exhibit' in live:
    rows.append(('exhibit', 'Exhibit', None, None, NOW))

c.execute('DROP TABLE IF EXISTS vocabulary')
c.execute('''CREATE TABLE vocabulary (
    namespace    TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    tier         INTEGER,
    sort_order   INTEGER,
    retired_at   TEXT
)''')
c.executemany('INSERT INTO vocabulary VALUES (?,?,?,?,?)', rows)
c.commit()

print(f'vocabulary regenerated: {len(rows)} rows')
for r in c.execute('SELECT * FROM vocabulary ORDER BY tier IS NULL, tier, sort_order'):
    print('  ', r)
c.close()
