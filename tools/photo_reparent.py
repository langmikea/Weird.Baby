import argparse, os, shutil, sqlite3, sys
from datetime import datetime, timezone
DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
GALLERY = "MV-20260529-001"
IDS = ["MV-HR-20260405-019","MV-HR-20260405-020","MV-HR-20260405-023",
       "MV-HR-20260405-024","MV-HR-20260405-025"]
ap = argparse.ArgumentParser(); ap.add_argument("--apply", action="store_true")
a = ap.parse_args()
conn = sqlite3.connect(DB); conn.row_factory = sqlite3.Row
g = conn.execute("SELECT status, tags FROM artifacts WHERE id=?", (GALLERY,)).fetchone()
probs = []
if not g: probs.append("gallery container missing")
elif g["status"] != "released" or "card_kind:gallery" not in (g["tags"] or ""):
    probs.append(f"gallery state unexpected: status={g['status']}")
for i in IDS:
    r = conn.execute("SELECT status, parent_artifact_id FROM artifacts WHERE id=?", (i,)).fetchone()
    if not r: probs.append(f"{i} missing")
    elif r["status"] != "released": probs.append(f"{i} not released")
    elif r["parent_artifact_id"] not in (None, GALLERY): probs.append(f"{i} parented elsewhere: {r['parent_artifact_id']}")
    else: print(f"[plan] {i}: parent {r['parent_artifact_id']} -> {GALLERY}")
if probs: sys.exit("[abort] " + " | ".join(probs))
if not a.apply:
    print("[dry-run] no writes. --apply with MV CLOSED."); sys.exit(0)
ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
snap = os.path.join(os.path.dirname(DB), "backups", f"bak_pre_photo_reparent_{ts}__mediavault.sqlite")
conn.close(); shutil.copy2(DB, snap); print("[snapshot]", snap)
conn = sqlite3.connect(DB); conn.row_factory = sqlite3.Row
iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
for i in IDS:
    conn.execute("UPDATE artifacts SET parent_artifact_id=?, updated_at=? WHERE id=?", (GALLERY, iso, i))
conn.commit()
n = conn.execute("SELECT COUNT(*) FROM artifacts WHERE parent_artifact_id=? AND status='released'", (GALLERY,)).fetchone()[0]
print(f"[verify] released children of {GALLERY}: {n}")
conn.close()
