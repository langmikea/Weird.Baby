#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
batch1c_photo_repoint.py - Repoint 5 released Harrisburg photos to vaulted
JPGs (host-side, gated; pattern: batch1/batch1b scripts).

CONTEXT: The five photos were released via MV's UI (2026-06-11) but their
rows kept storage_mode='referenced' pointing at intake\\drop HEICs that MV's
release flow had moved to intake\\processed. HEIC also can't be delivered to
browsers and the R2 thumbnailer can't decode it on this host. Cowork
converted the originals to quality-90 JPGs named by MV id, staged at
C:\\AI\\Platform\\MediaVault\\intake\\jpg_staging\\.

WHAT THIS DOES:
  1. Snapshots the MV DB (only with --apply).
  2. Copies each staged JPG to catalogs\\vaulted\\2026\\06\\<id>.jpg
  3. UPDATEs each row: storage_mode='vaulted', local_asset_path=<vault path>.
     No tag or status changes - rows are already released and tagged.

HARD GATES: MediaVault CLOSED before --apply; review dry-run first.

USAGE:
  python batch1c_photo_repoint.py            # dry-run
  python batch1c_photo_repoint.py --apply

After --apply: reopen MV -> node tools/sync-assets-to-r2.mjs (uploads JPG
primaries + thumbnails; old HEIC objects in R2 become harmless orphans) ->
npm run export-artifacts -> npm run build -> deploy -> live-verify -> commit.
Optional cleanup after verify: the 5 duplicate HEICs we copied back into
intake\\drop can be deleted (originals remain in intake\\processed).
"""

import argparse
import os
import shutil
import sqlite3
import sys
from datetime import datetime, timezone

DEFAULT_DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
STAGING    = r"C:\AI\Platform\MediaVault\intake\jpg_staging"
VAULT_DIR  = r"C:\AI\Platform\MediaVault\catalogs\vaulted\2026\06"

IDS = ["MV-HR-20260405-019", "MV-HR-20260405-020", "MV-HR-20260405-023",
       "MV-HR-20260405-024", "MV-HR-20260405-025"]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=DEFAULT_DB)
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(args.db):
        sys.exit(f"DB not found: {args.db}")

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"=== Batch 1c photo repoint [{mode}] ===\nDB: {args.db}")

    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row
    problems = []
    plans = []

    for mid in IDS:
        src = os.path.join(STAGING, f"{mid}.jpg")
        dest = os.path.join(VAULT_DIR, f"{mid}.jpg")
        if not os.path.exists(src):
            problems.append(f"staged JPG missing: {src}")
        else:
            with open(src, "rb") as f:
                if f.read(3) != b"\xff\xd8\xff":
                    problems.append(f"{src} is not a JPEG")
        if os.path.exists(dest):
            problems.append(f"vault destination already exists: {dest}")
        r = conn.execute("SELECT status, storage_mode, local_asset_path "
                         "FROM artifacts WHERE id=?", (mid,)).fetchone()
        if not r:
            problems.append(f"{mid} MISSING from MV")
            continue
        if r["status"] != "released":
            problems.append(f"{mid} not released (status={r['status']})")
        if r["storage_mode"] != "referenced":
            problems.append(f"{mid} storage_mode={r['storage_mode']} "
                            f"(expected 'referenced' - already repointed?)")
        plans.append((mid, src, dest, r["local_asset_path"]))

    if problems:
        conn.close()
        sys.exit("[abort] preflight failed:\n  " + "\n  ".join(problems))

    print()
    for mid, src, dest, oldp in plans:
        print(f"[plan] {mid}: referenced -> vaulted")
        print(f"   old path: {oldp}")
        print(f"   new path: {dest}")

    if not args.apply:
        conn.close()
        print("\n[dry-run] no writes performed. Re-run with --apply (MV CLOSED).")
        return

    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bdir = os.path.join(os.path.dirname(args.db), "backups")
    os.makedirs(bdir, exist_ok=True)
    snap = os.path.join(bdir, f"bak_pre_batch1c_repoint_{ts}__mediavault.sqlite")
    conn.close()
    shutil.copy2(args.db, snap)
    print(f"\n[snapshot] {snap}")
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    os.makedirs(VAULT_DIR, exist_ok=True)
    iso = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")
    for mid, src, dest, _ in plans:
        shutil.copy2(src, dest)
        conn.execute("UPDATE artifacts SET storage_mode='vaulted', "
                     "local_asset_path=?, updated_at=? WHERE id=?",
                     (dest, iso, mid))
    conn.commit()

    print("\n=== verify ===")
    for mid, _, dest, _ in plans:
        r = conn.execute("SELECT status, storage_mode, local_asset_path "
                         "FROM artifacts WHERE id=?", (mid,)).fetchone()
        ok = r["storage_mode"] == "vaulted" and os.path.exists(r["local_asset_path"])
        print(f"{mid}: {r['status']} mode={r['storage_mode']} file_exists={ok}")
    conn.close()
    print("\n[done] Next: reopen MV -> node tools/sync-assets-to-r2.mjs -> "
          "npm run export-artifacts -> npm run build -> deploy -> live-verify "
          "-> commit. Optional: delete the 5 duplicate HEICs from intake\\drop.")


if __name__ == "__main__":
    main()
