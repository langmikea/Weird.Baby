#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
rwth_album_mvwrite.py - RWTH album-container MV writes (Path 2, host-side, gated).

CONTEXT: All 15 Run With The Hunt tracks ALREADY EXIST in MV (the scope doc's
"13" was stale). NO INGEST is performed. This script only re-releases /
re-parents existing rows and creates one album-container artifact.

WHAT THIS DOES (one batched MV-write session, per CLAUDE.md quirk #10):
  1. Snapshots the live MV DB to core/backups/ (only with --apply).
  2. Releases Whiskey to the Sun (MV-HR-20260417-025): vault -> released.
  3. Re-releases the cover MV-20260419-003 (vault -> released) so it stays in
     the R2 sync manifest, and parents it under the album container.
  4. Creates the album container artifact (card_kind:album, exhibit:hunter_root)
     with notes.cover_artifact_id + notes.track_order (15-track RN order).
  5. Re-parents all 15 tracks under the container. NOTE: Park Bench Pigeons
     (MV-HR-20260416-014) is currently the audio child of archived-page
     MV-HR-20260416-011; this DETACHES it from that page and attaches it to
     the album. The page card -011 itself is untouched (stays released).

ALL tag writes go through MV's single coordinated writer
(core.artifact_tags.write_artifact_tags) per DATA_ARCHITECTURE_SPEC section 4.5.
The new container row is INSERTed WITHOUT the tags column (defaults to '[]'),
then tags are set via the writer - so this script is no second tag writer.

HARD GATES (operator responsibility):
  * MediaVault MUST be closed/stopped before --apply (no process on the DB).
  * Review this script and the --dry-run output before --apply.

USAGE:
  python rwth_album_mvwrite.py            # dry-run (default): prints plan, writes nothing
  python rwth_album_mvwrite.py --apply    # snapshots, then mutates (MV CLOSED)

After --apply: reopen MV -> npm run export-artifacts (verify counts) ->
node tools/sync-assets-to-r2.mjs -> npm run build -> npm run deploy ->
live-verify -> host-side commit.
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

COVER_ID = "MV-20260419-003"
ALBUM_TITLE = "Run With The Hunt"
WHISKEY_ID = "MV-HR-20260417-025"      # vault -> release
PBP_ID = "MV-HR-20260416-014"          # page-child -> re-parent to album

CONTAINER_TAGS = ["album:run_with_the_hunt", "bands:hunter_root", "card_kind:album",
                  "content_kind:other", "exhibit:hunter_root"]

# 15-track running order from the ReverbNation /songs page (operator directive),
# mapped to the EXISTING MV ids (no ingest). (title, id) pairs; title is checked
# against the row's description_short (suffix-insensitive) as a safety assertion.
ORDER = [
    ("Brain Cell",                   "MV-HR-20260417-001"),
    ("Time Flow Zero",               "MV-HR-20260417-021"),
    ("Straightlaced",                "MV-HR-20260417-017"),
    ("Whiskey to the Sun",           "MV-HR-20260417-025"),  # released by this script
    ("Eyes are Oceans",              "MV-HR-20260417-007"),
    ("Trees and Everything",         "MV-HR-20260417-023"),
    ("Doors with Keys",              "MV-HR-20260417-005"),
    ("Northern Light Streaks",       "MV-HR-20260417-011"),
    ("Park Bench Pigeons",           "MV-HR-20260416-014"),  # re-parented from -011
    ("Freezer Burnt",                "MV-HR-20260417-009"),
    ("Playing Music with Our Bones", "MV-HR-20260417-013"),
    ("Same Page",                    "MV-HR-20260417-015"),
    ("Song",                         "MV-HR-20260421-001"),
    ("Dead Man",                     "MV-HR-20260417-003"),
    ("Think My Mind",                "MV-HR-20260417-019"),
]


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")


def norm(s):
    if not s:
        return ""
    s = s.strip()
    for sep in (" — audio recording", " – audio recording", " - audio recording"):
        if s.lower().endswith(sep.lower()):
            s = s[: -len(sep)]
            break
    return s.strip().lower()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--db", default=DEFAULT_DB)
    ap.add_argument("--core", default=DEFAULT_CORE)
    ap.add_argument("--apply", action="store_true", help="perform writes (default: dry-run)")
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
    print(f"=== RWTH album MV writes [{mode}] ===\nDB: {args.db}")

    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    # Idempotency guard.
    existing = conn.execute(
        "SELECT id FROM artifacts WHERE tags LIKE '%card_kind:album%' "
        "AND tags LIKE '%album:run_with_the_hunt%'").fetchall()
    if existing:
        print(f"[abort] album container already exists: {[r['id'] for r in existing]} - nothing to do.")
        conn.close()
        return

    # Verify all 15 ids exist + titles match (catch a stale id mapping).
    track_order = [tid for _, tid in ORDER]
    problems = []
    for title, tid in ORDER:
        r = conn.execute("SELECT id, description_short, status, media_type, parent_artifact_id "
                         "FROM artifacts WHERE id=?", (tid,)).fetchone()
        if not r:
            problems.append(f"{tid} MISSING")
        elif r["media_type"] != "audio":
            problems.append(f"{tid} not audio ({r['media_type']})")
        elif norm(r["description_short"]) != norm(title):
            problems.append(f"{tid} title mismatch: expected '{title}', got '{r['description_short']}'")
    cov = conn.execute("SELECT id, status, media_type FROM artifacts WHERE id=?", (COVER_ID,)).fetchone()
    if not cov:
        problems.append(f"cover {COVER_ID} MISSING")
    if problems:
        conn.close()
        sys.exit("[abort] verification failed:\n  " + "\n  ".join(problems))

    # Assign container id under MV-HR-<today>-NNN (next free).
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"MV-HR-{today}-"
    used = [r["id"] for r in conn.execute("SELECT id FROM artifacts WHERE id LIKE ?", (prefix + "%",))]
    nmax = 0
    for u in used:
        try:
            nmax = max(nmax, int(u.rsplit("-", 1)[1]))
        except Exception:
            pass
    container_id = f"{prefix}{nmax + 1:03d}"

    # Plan output.
    w = conn.execute("SELECT status FROM artifacts WHERE id=?", (WHISKEY_ID,)).fetchone()["status"]
    pbp = conn.execute("SELECT parent_artifact_id FROM artifacts WHERE id=?", (PBP_ID,)).fetchone()
    print(f"\n[plan] release Whiskey {WHISKEY_ID}: {w} -> released")
    print(f"[plan] re-parent Park Bench Pigeons {PBP_ID}: parent {pbp['parent_artifact_id']} -> {container_id}")
    print(f"[plan] re-release cover {COVER_ID}: {cov['status']} -> released, parent -> {container_id}")
    print(f"[plan] create album container {container_id} (card_kind:album, title='{ALBUM_TITLE}')")
    print("[plan] track_order (15):")
    for i, (title, tid) in enumerate(ORDER, 1):
        print(f"   {i:2d}. {tid}  {title}")
    print(f"[plan] re-parent all 15 tracks -> {container_id}")

    if not args.apply:
        print("\n[dry-run] no writes performed. Re-run with --apply (MV CLOSED) to execute.")
        conn.close()
        return

    # Snapshot.
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bdir = os.path.join(os.path.dirname(args.db), "backups")
    os.makedirs(bdir, exist_ok=True)
    snap = os.path.join(bdir, f"bak_pre_rwth_album_{ts}__mediavault.sqlite")
    conn.close()
    shutil.copy2(args.db, snap)
    print(f"\n[snapshot] {snap}")
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    iso = now_iso()

    # Release Whiskey.
    conn.execute("UPDATE artifacts SET status='released', released_at=?, released_by='mike', "
                 "updated_at=? WHERE id=? AND status!='released'", (iso, iso, WHISKEY_ID))

    # Re-release cover + parent to container.
    conn.execute("UPDATE artifacts SET status='released', released_at=?, released_by='mike', "
                 "parent_artifact_id=?, updated_at=? WHERE id=?", (iso, container_id, iso, COVER_ID))

    # Create album container (tags via writer; notes JSON).
    notes = json.dumps({
        "card_kind": "album", "container": True, "cover_artifact_id": COVER_ID,
        "title": ALBUM_TITLE, "track_order": track_order,
        "created_by": "cowork_rwth_album",
        "created_utc": ts,
    }, ensure_ascii=False)
    conn.execute(
        "INSERT INTO artifacts (id, ingest_source, ingest_date, storage_mode, media_type, "
        "post_date_confidence, capture_date, status, released_at, released_by, "
        "description_short, notes, created_at, updated_at) "
        "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (container_id, "cowork", iso[:10], "vaulted", "other", "unknown", iso[:10],
         "released", iso, "mike", ALBUM_TITLE, notes, iso, iso))
    for slug in CONTAINER_TAGS:
        try:
            upsert_tag(conn, slug)
        except Exception:
            pass
    write_artifact_tags(conn, container_id, CONTAINER_TAGS)

    # Re-parent all 15 tracks.
    for tid in track_order:
        conn.execute("UPDATE artifacts SET parent_artifact_id=?, updated_at=? WHERE id=?",
                     (container_id, iso, tid))

    conn.commit()

    # Verify.
    print("\n=== verify ===")
    nchild = conn.execute("SELECT COUNT(*) FROM artifacts WHERE parent_artifact_id=?",
                          (container_id,)).fetchone()[0]
    print(f"children of {container_id}: {nchild} (expected 16 = 15 tracks + cover)")
    c = conn.execute("SELECT status, tags FROM artifacts WHERE id=?", (container_id,)).fetchone()
    print(f"container: status={c['status']} tags={c['tags']}")
    for label, _id in (("whiskey", WHISKEY_ID), ("cover", COVER_ID), ("pbp", PBP_ID)):
        r = conn.execute("SELECT status, parent_artifact_id FROM artifacts WHERE id=?", (_id,)).fetchone()
        print(f"{label} {_id}: status={r['status']} parent={r['parent_artifact_id']}")
    conn.close()
    print("\n[done] MV writes committed. Next: export-artifacts (check counts), "
          "sync-assets-to-r2, build, deploy, live-verify, host-side commit.")


if __name__ == "__main__":
    main()
