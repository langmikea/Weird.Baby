import sqlite3, json, re, sys

DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
MAP = r"C:\AI\Projects\weird-baby-museum\docs\SLUG_NAMESPACE_MAP.md"

# Parse the map: rows look like | `slug` | `namespace` | tab |
mapped = {}
row_re = re.compile(r"^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|")
with open(MAP, encoding="utf-8") as f:
    for line in f:
        m = row_re.match(line)
        if m:
            mapped[m.group(1)] = m.group(2)

con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
cur = con.cursor()

# Distinct slugs actually present in artifacts.tags
live = {}
total_artifacts = 0
tagged_artifacts = 0
already_namespaced = []
malformed = []
for (aid, tags_json) in cur.execute("SELECT id, tags FROM artifacts"):
    total_artifacts += 1
    try:
        tags = json.loads(tags_json) if tags_json else []
    except Exception:
        malformed.append((aid, repr(tags_json)))
        continue
    if tags:
        tagged_artifacts += 1
    for t in tags:
        if not isinstance(t, str):
            malformed.append((aid, repr(t)))
            continue
        if ":" in t:
            already_namespaced.append((aid, t))
        live[t] = live.get(t, 0) + 1
con.close()

live_slugs = set(live.keys())
mapped_slugs = set(mapped.keys())

print(f"Artifacts total: {total_artifacts}")
print(f"Artifacts with >=1 tag: {tagged_artifacts}")
print(f"Distinct values in artifacts.tags: {len(live_slugs)}")
print(f"Distinct slugs in map: {len(mapped_slugs)}")
print()

uncovered = sorted(live_slugs - mapped_slugs)
print(f"LIVE SLUGS NOT IN MAP ({len(uncovered)}):")
for s in uncovered:
    print(f"  MISSING: {s!r}  (used {live[s]}x)")
print()

unused = sorted(mapped_slugs - live_slugs)
print(f"MAP SLUGS NOT IN LIVE DATA ({len(unused)}):")
for s in unused:
    print(f"  unused : {s!r}")
print()

print(f"ALREADY-NAMESPACED TAGS IN LIVE DATA ({len(already_namespaced)}):")
for aid, t in already_namespaced:
    print(f"  {aid}: {t!r}")
print()

print(f"MALFORMED TAG ENTRIES ({len(malformed)}):")
for aid, t in malformed:
    print(f"  {aid}: {t}")
print()

ns_counts = {}
for ns in mapped.values():
    ns_counts[ns] = ns_counts.get(ns, 0) + 1
print("Target namespace distribution (from map):")
for ns in sorted(ns_counts):
    print(f"  {ns}: {ns_counts[ns]} slug(s)")
print()

if uncovered or malformed:
    print("RESULT: NOT READY - map does not cover live data, or malformed tags exist.")
    sys.exit(1)
else:
    print("RESULT: Map covers 100% of live slugs. Entry gate verified.")
