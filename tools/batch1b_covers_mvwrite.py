#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
batch1b_covers_mvwrite.py - Album-cover ingest MV writes (host-side, gated;
pattern: rwth_album_mvwrite.py / batch1_renditions_mvwrite.py).

CONTEXT: Operator-approved Batch 1b. Six album containers have
cover_artifact_id=null and render placeholder gradients. Source art acquired
from hunterrootmusic.bandcamp.com (authoritative), staged at
C:\\AI\\Projects\\Hunter Root\\art_covers\\. Recipe mirrors the existing RWTH
cover row MV-20260419-003 exactly (local-drop, vaulted, catalogs path,
album/bands/exhibit tags, parented to container).

WHAT THIS DOES (one batched MV-write session):
  1. Snapshots the live MV DB (only with --apply).
  2. Copies each cover JPEG into
     C:\\AI\\Platform\\MediaVault\\catalogs\\vaulted\\<YYYY>\\<MM>\\<new_id>.jpg
  3. INSERTs 6 photo artifacts (status=released, parent=container) and tags
     them via MV's single coordinated writer.
  4. UPDATEs each container's notes JSON: cover_artifact_id = the new id
     (preserving all other notes keys, e.g. track_order).

HARD GATES:
  * MediaVault MUST be closed/stopped before --apply.
  * Review --dry-run output first.

USAGE:
  python batch1b_covers_mvwrite.py            # dry-run
  python batch1b_covers_mvwrite.py --apply    # snapshot, copy files, mutate

After --apply: reopen MV -> npm run export-artifacts ->
node tools/sync-assets-to-r2.mjs (REQUIRED: new vaulted binaries) ->
npm run export-artifacts AGAIN (embeds the fresh R2 urls; verify each album
container now has thumbnail_url) -> npm run build -> npm run deploy ->
live-verify (carousel art) -> host-side commit of the regenerated exports.
"""

import argparse
import json
import os
import shutil
import sqlite3
import sys
from datetime import datetime, timezone

DEFAULT_DB   = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
DEFAULT_CORE = r"C:\AI\Platform\MediaVault\core"
ART_DIR      = r"C:\AI\Projects\Hunter Root\art_covers"
VAULT_ROOT   = r"C:\AI\Platform\MediaVault\catalogs\vaulted"

# (cover filename, container_id, album_tag, album title for description)
COVERS = [
    ("cover_arkansas.jpg", "MV-HR-ALBUM-arkansas", "arkansas", "Arkansas"),
    ("cover_crooked_home.jpg", "MV-HR-ALBUM-crooked_home", "crooked_home", "Crooked Home"),
    ("cover_life_inside_a_wheel.jpg", "MV-HR-ALBUM-wheel", "life_inside_a_wheel", "Life Inside A Wheel"),
    ("cover_mimicking_the_sun_like_dandelions.jpg", "MV-HR-ALBUM-dandelions",
     "mimicking_the_sun_like_dandelions", "Mimicking the Sun Like Dandelions"),
    ("cover_skipping_stones.jpg", "MV-HR-ALBUM-skipping",
     "skipping_stones_that_sink_before_theyre_thrown",
     "Skipping Stones That Sink Before They're Thrown"),
    ("cover_they_finally_cracked_me.jpg", "MV-HR-ALBUM-cracked",
     "they_finally_cracked_me", "They Finally Cracked Me"),
]


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=DEFAULT_DB)
    ap.add_argument("--core", default=DEFAULT_CORE)
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()

    if not os.path.exists(args.db):
        sys.exit(f"DB not found: {args.db}")

    sys.path.insert(0, args.core)
    sys.path.insert(0, os.path.dirname(args.core))
    try:
        from artifact_tags import write_artifact_tags  # type: ignore
    except Exception:
        from core.artifact_tags import write_artifact_tags  # type: ignore
    try:
        from ingest_engine import upsert_tag  # type: ignore
    except Exception:
        from core.ingest_engine import upsert_tag  # type: ignore

    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"=== Batch 1b album-cover MV writes [{mode}] ===\nDB: {args.db}")

    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row
    problems = []
    plans = []

    # NOTE: container ids above are best-guess for wheel/skipping — the
    # preflight below resolves the REAL container id by album tag and
    # overrides, so a wrong guess is self-correcting, not fatal.
    for (fname, guess_cid, album_tag, title) in COVERS:
        src = os.path.join(ART_DIR, fname)
        if not os.path.exists(src):
            problems.append(f"source art missing: {src}")
            continue
        with open(src, "rb") as f:
            magic = f.read(3)
        if magic != b"\xff\xd8\xff":
            problems.append(f"{fname} is not a JPEG (magic={magic!r})")

        rows = conn.execute(
            "SELECT id, status, notes, tags FROM artifacts "
            "WHERE tags LIKE '%card_kind:album%' AND tags LIKE ?",
            (f"%album:{album_tag}%",)).fetchall()
        if len(rows) != 1:
            problems.append(f"album tag {album_tag}: expected exactly 1 container, "
                            f"found {[r['id'] for r in rows]}")
            continue
        c = rows[0]
        cid = c["id"]
        if c["status"] != "released":
            problems.append(f"container {cid} not released")
        try:
            notes = json.loads(c["notes"]) if c["notes"] else {}
            if not isinstance(notes, dict):
                raise ValueError("notes not a dict")
        except Exception as e:
            problems.append(f"container {cid} notes unparseable: {e}")
            continue
        if notes.get("cover_artifact_id"):
            problems.append(f"container {cid} already has cover_artifact_id="
                            f"{notes['cover_artifact_id']}")
        plans.append((fname, cid, album_tag, title, notes))

    if problems:
        conn.close()
        sys.exit("[abort] preflight failed:\n  " + "\n  ".join(problems))

    # Mint ids MV-HR-<today>-NNN.
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"MV-HR-{today}-"
    used = [r["id"] for r in conn.execute("SELECT id FROM artifacts WHERE id LIKE ?",
                                          (prefix + "%",))]
    nmax = 0
    for u in used:
        try:
            nmax = max(nmax, int(u.rsplit("-", 1)[1]))
        except Exception:
            pass
    minted = [f"{prefix}{nmax + 1 + i:03d}" for i in range(len(plans))]

    vault_dir = os.path.join(VAULT_ROOT, today[:4], today[4:6])
    print(f"\n[plan] vault dir: {vault_dir}")
    for mid, (fname, cid, album_tag, title, notes) in zip(minted, plans):
        dest = os.path.join(vault_dir, f"{mid}.jpg")
        if os.path.exists(dest):
            problems.append(f"destination already exists: {dest}")
        tags = [f"album:{album_tag}", "bands:hunter_root", "exhibit:hunter_root"]
        print(f"   {mid}  container={cid}")
        print(f"      src={fname}  dest={dest}")
        print(f"      desc={title} - album cover  tags={tags}")
        print(f"      container notes keys now: {sorted(notes.keys())} "
              f"-> + cover_artifact_id={mid}")
    if problems:
        conn.close()
        sys.exit("[abort] destination check failed:\n  " + "\n  ".join(problems))

    if not args.apply:
        conn.close()
        print("\n[dry-run] no writes performed. Re-run with --apply (MV CLOSED).")
        return

    # Snapshot.
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bdir = os.path.join(os.path.dirname(args.db), "backups")
    os.makedirs(bdir, exist_ok=True)
    snap = os.path.join(bdir, f"bak_pre_batch1b_covers_{ts}__mediavault.sqlite")
    conn.close()
    shutil.copy2(args.db, snap)
    print(f"\n[snapshot] {snap}")
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    os.makedirs(vault_dir, exist_ok=True)
    iso = now_iso()

    for mid, (fname, cid, album_tag, title, notes) in zip(minted, plans):
        src = os.path.join(ART_DIR, fname)
        dest = os.path.join(vault_dir, f"{mid}.jpg")
        shutil.copy2(src, dest)

        conn.execute(
            "INSERT INTO artifacts (id, ingest_source, ingest_date, storage_mode, "
            "local_asset_path, media_type, post_date_confidence, status, "
            "released_at, released_by, description_short, parent_artifact_id, "
            "created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (mid, "local-drop", iso[:10], "vaulted", dest, "photo", "manual",
             "released", iso, "mike", f"{title} - album cover", cid, iso, iso))
        tags = [f"album:{album_tag}", "bands:hunter_root", "exhibit:hunter_root"]
        for t in tags:
            try:
                upsert_tag(conn, t)
            except Exception:
                pass
        write_artifact_tags(conn, mid, tags)

        notes["cover_artifact_id"] = mid
        conn.execute("UPDATE artifacts SET notes=?, updated_at=? WHERE id=?",
                     (json.dumps(notes, ensure_ascii=False), iso, cid))

    conn.commit()

    print("\n=== verify ===")
    for mid, (fname, cid, album_tag, title, notes) in zip(minted, plans):
        r = conn.execute("SELECT status, parent_artifact_id, local_asset_path "
                         "FROM artifacts WHERE id=?", (mid,)).fetchone()
        n = json.loads(conn.execute("SELECT notes FROM artifacts WHERE id=?",
                                    (cid,)).fetchone()["notes"])
        ok_file = os.path.exists(r["local_asset_path"])
        print(f"{mid}: status={r['status']} parent={r['parent_artifact_id']} "
              f"file={ok_file} container.cover_artifact_id={n.get('cover_artifact_id')}")
    conn.close()
    print("\n[done] Next: reopen MV -> npm run export-artifacts -> "
          "node tools/sync-assets-to-r2.mjs -> npm run export-artifacts "
          "(verify album thumbnail_url non-null) -> npm run build -> "
          "npm run deploy -> live-verify -> commit.")


if __name__ == "__main__":
    main()
