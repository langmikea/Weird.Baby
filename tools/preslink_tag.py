import argparse, json, os, shutil, sqlite3, sys
from datetime import datetime, timezone
DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
TARGET = "MV-HR-20260405-004"
TAG = "presentation:link"
ap = argparse.ArgumentParser(); ap.add_argument("--apply", action="store_true")
a = ap.parse_args()
conn = sqlite3.connect(DB); conn.row_factory = sqlite3.Row
r = conn.execute("SELECT status, tags FROM artifacts WHERE id=?", (TARGET,)).fetchone()
if not r: sys.exit(f"[abort] {TARGET} missing")
if r["status"] != "released": sys.exit(f"[abort] {TARGET} not released: {r['status']}")
cur = r["tags"] or "[]"
try:
    tags = json.loads(cur)
    if not isinstance(tags, list): raise ValueError("tags not a list")
except Exception as e:
    sys.exit(f"[abort] tags field is not valid JSON list: {e} | raw={cur!r}")
print(f"[current] {tags}")
if TAG in tags: sys.exit("[abort] tag already present")
tags.append(TAG)
new = json.dumps(tags)
print(f"[plan] tags -> {new}")
if not a.apply:
    print("[dry-run] no writes. --apply with MV CLOSED."); sys.exit(0)
ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
snap = os.path.join(os.path.dirname(DB), "backups", f"bak_pre_preslink_{ts}__mediavault.sqlite")
conn.close(); shutil.copy2(DB, snap); print("[snapshot]", snap)
conn = sqlite3.connect(DB)
iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
conn.execute("UPDATE artifacts SET tags=?, updated_at=? WHERE id=?", (new, iso, TARGET))
conn.commit(); conn.close()
print("[applied]")
