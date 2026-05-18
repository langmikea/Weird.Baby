import sqlite3, json, re, sys, datetime, os

DB  = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
MAP = r"C:\AI\Projects\weird-baby-museum\docs\SLUG_NAMESPACE_MAP.md"
REPORT_DIR = r"C:\AI\Projects\weird-baby-museum\docs"

DRY_RUN = "--apply" not in sys.argv

# --- Load the map (the sole authority) ---
mapped = {}
row_re = re.compile(r"^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|")
with open(MAP, encoding="utf-8") as f:
    for line in f:
        m = row_re.match(line)
        if m:
            mapped[m.group(1)] = m.group(2)
print(f"Map loaded: {len(mapped)} slug->namespace pairs")
print(f"Mode: {'DRY RUN (no write)' if DRY_RUN else 'APPLY (live write)'}")
print()

# --- Open DB (ro for dry run, rw for apply) ---
if DRY_RUN:
    con = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
else:
    con = sqlite3.connect(DB)
cur = con.cursor()

changes = []          # (id, before_list, after_list)
unsorted_values = {}   # value -> count of artifacts
abort_reasons = []

for (aid, tags_json) in cur.execute("SELECT id, tags FROM artifacts ORDER BY id"):
    try:
        tags = json.loads(tags_json) if tags_json else []
    except Exception as e:
        abort_reasons.append(f"{aid}: tags not valid JSON ({e})")
        continue
    if not isinstance(tags, list):
        abort_reasons.append(f"{aid}: tags is not a JSON array")
        continue
    if not tags:
        continue

    new_tags = []
    seen = set()
    for t in tags:
        if not isinstance(t, str):
            abort_reasons.append(f"{aid}: non-string tag {t!r}")
            continue
        if ":" in t:
            # already namespaced - idempotent guard, leave as-is
            nt = t
        else:
            if t not in mapped:
                abort_reasons.append(f"{aid}: slug {t!r} not in map")
                continue
            ns = mapped[t]
            nt = f"{ns}:{t}"
            if ns == "unsorted":
                unsorted_values[t] = unsorted_values.get(t, 0) + 1
        if nt not in seen:
            seen.add(nt)
            new_tags.append(nt)

    if new_tags != tags:
        changes.append((aid, tags, new_tags))

if abort_reasons:
    print(f"ABORT: {len(abort_reasons)} problem(s) found, nothing written:")
    for r in abort_reasons:
        print(f"  {r}")
    con.close()
    sys.exit(1)

print(f"Artifacts to update: {len(changes)}")
print()
print("=== PER-ARTIFACT BEFORE -> AFTER ===")
for aid, before, after in changes:
    print(f"{aid}")
    print(f"  before: {json.dumps(before)}")
    print(f"  after : {json.dumps(after)}")
print()

print(f"=== unsorted: VALUES (migration run report, per v2.1-target 5.5 / 12.1) ===")
print(f"Distinct values landing under unsorted: {len(unsorted_values)}")
for v in sorted(unsorted_values):
    print(f"  unsorted:{v}  ({unsorted_values[v]} artifact(s))")
print()

if DRY_RUN:
    con.close()
    print("DRY RUN complete. No rows written. Re-run with --apply to commit.")
    sys.exit(0)

# --- APPLY path: single transaction ---
try:
    cur.execute("BEGIN")
    for aid, before, after in changes:
        cur.execute("UPDATE artifacts SET tags = ?, updated_at = ? WHERE id = ?",
                    (json.dumps(after), datetime.datetime.now().isoformat(), aid))
    con.commit()
except Exception as e:
    con.rollback()
    con.close()
    print(f"APPLY FAILED, rolled back: {e}")
    sys.exit(1)

# --- Write the run report ---
ts = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
report = os.path.join(REPORT_DIR, f"MIGRATION_RUN_REPORT_criterion1-{ts}.md")
with open(report, "w", encoding="utf-8") as f:
    f.write(f"# Migration Run Report - Criterion 1 (tag namespacing)\n\n")
    f.write(f"**Run:** {datetime.datetime.now().isoformat()}\n")
    f.write(f"**Artifacts updated:** {len(changes)}\n")
    f.write(f"**Authority:** docs/SLUG_NAMESPACE_MAP.md\n\n")
    f.write(f"## unsorted: values (per v2.1-target 5.5 / 12.1)\n\n")
    f.write(f"Distinct values: {len(unsorted_values)}\n\n")
    for v in sorted(unsorted_values):
        f.write(f"- `unsorted:{v}` ({unsorted_values[v]} artifact(s))\n")
    f.write(f"\n## Per-artifact changes\n\n")
    for aid, before, after in changes:
        f.write(f"### {aid}\n")
        f.write(f"- before: `{json.dumps(before)}`\n")
        f.write(f"- after : `{json.dumps(after)}`\n\n")
con.close()
print(f"APPLY complete. {len(changes)} artifacts updated.")
print(f"Run report: {report}")
