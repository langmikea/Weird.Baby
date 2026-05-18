import sqlite3, json, sys

DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"

con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
cur = con.cursor()

total = 0
tagged = 0
bare = []          # (id, tag) for any tag with no colon
malformed = []
ns_dist = {}
all_tags = 0

for (aid, tags_json) in cur.execute("SELECT id, tags FROM artifacts ORDER BY id"):
    total += 1
    try:
        tags = json.loads(tags_json) if tags_json else []
    except Exception as e:
        malformed.append((aid, f"JSON error: {e}"))
        continue
    if tags:
        tagged += 1
    for t in tags:
        if not isinstance(t, str):
            malformed.append((aid, f"non-string: {t!r}"))
            continue
        all_tags += 1
        if ":" not in t:
            bare.append((aid, t))
        else:
            ns = t.split(":", 1)[0]
            ns_dist[ns] = ns_dist.get(ns, 0) + 1
con.close()

print(f"Artifacts total            : {total}")
print(f"Artifacts with >=1 tag     : {tagged}")
print(f"Total tag entries          : {all_tags}")
print()
print(f"BARE SLUGS REMAINING       : {len(bare)}")
for aid, t in bare:
    print(f"  BARE: {aid}: {t!r}")
print()
print(f"MALFORMED ENTRIES          : {len(malformed)}")
for aid, m in malformed:
    print(f"  {aid}: {m}")
print()
print("Namespace distribution across all tags:")
for ns in sorted(ns_dist):
    print(f"  {ns:12s}: {ns_dist[ns]}")
print()

if bare or malformed:
    print("RESULT: CRITERION 1 NOT SATISFIED - bare or malformed tags remain.")
    sys.exit(1)
else:
    print("RESULT: CRITERION 1 SATISFIED - every tag is namespaced, no malformed entries.")
