#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
batch1_renditions_mvwrite.py - Batch 1 rendition enrichment MV writes
(host-side, gated; pattern cloned from tools/rwth_album_mvwrite.py).

CONTEXT: Operator-approved Batch 1 (2026-06-10). Adds 8 YouTube rendition
artifacts to EXISTING tracks across 4 album containers, and fixes one track
title. NO new tracks, NO track_order changes, NO re-parenting of existing
rows. Every insert joins a track that already exists (asserted in preflight
via the song:<slug> tag on an existing child of the same container).

WHAT THIS DOES (one batched MV-write session):
  1. Snapshots the live MV DB to core/backups/ (only with --apply).
  2. INSERTs 8 new artifacts: media_type='link', source_platform='youtube',
     status='released', parent_artifact_id = the album container. Defaults
     for storage_mode / post_date_confidence / ingest_source are MIRRORED
     from reference row MV-20260523-010 (an existing released YouTube
     rendition), not guessed.
  3. Tags each via MV's single coordinated writer
     (core.artifact_tags.write_artifact_tags) - this script is no second
     tag writer. New tag slugs are upserted first.
  4. UPDATEs description_short on MV-20260523-089 (the They Finally Cracked
     Me live track) from the raw social caption to "Straitlaced (Live)".

THE 8 INSERTS (ytId -> container / song / kind):
  mnLwxpCfqRc -> dandelions / little_red_riding_hood / official  (Topic audio)
  m4C5mxjCUis -> dandelions / family_tree            / official  (Topic audio)
  nyt2GjSMABI -> dandelions / lampshade              / official  (Topic audio)
  FbOoHjoSyec -> arkansas   / cant_outshine_the_truth/ live      (Line Check)
  XXnTxA_GF24 -> arkansas   / quicksand_sinking      / live      (Line Check)
  g5_Wwbpwz_4 -> dandelions / little_red_riding_hood / live      (w/ Todd Haley)
  jSxCptRelM8 -> cracked    / straitlaced            / live      (Cats Meow '18)
  vF1D0tYjEws -> crooked_home / cookin_in_the_bathroom / cover   (Violet Lempke)

KNOWN, OPERATOR-APPROVED UX CONSEQUENCE: the three Dandelions tracks gain an
'official' rendition which sorts first (KIND_RANK), so their track head -
title + thumbnail in the exhibit - switches to the Topic upload.

HARD GATES (operator responsibility):
  * MediaVault MUST be closed/stopped before --apply (no process on the DB).
  * Review this script and the --dry-run output before --apply.

USAGE:
  python batch1_renditions_mvwrite.py            # dry-run (default): prints plan, writes nothing
  python batch1_renditions_mvwrite.py --apply    # snapshots, then mutates (MV CLOSED)

After --apply: reopen MV -> npm run export-artifacts (verify counts; expect
artifacts count +8 in hunter_root.json and the rendition lists to grow) ->
npm run build -> npm run deploy -> live-verify -> host-side commit.
(R2 sync not required: no new vaulted binary assets; harmless if run.)
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

REFERENCE_ROW_ID = "MV-20260523-010"   # existing released YouTube rendition (Cookin' official)
TITLE_FIX_ID     = "MV-20260523-089"   # TFCM live track: caption -> proper title
TITLE_FIX_NEW    = "Straitlaced (Live)"

# (ytId, container_id, album_tag, song_slug, content_kind, author_tag,
#  description_short, post_date, year_tag)
INSERTS = [
    ("mnLwxpCfqRc", "MV-HR-ALBUM-dandelions", "mimicking_the_sun_like_dandelions",
     "little_red_riding_hood", "official", "hunter_root",
     "Little Red Riding Hood (Official Audio)", "2020-07-30", "2020"),
    ("m4C5mxjCUis", "MV-HR-ALBUM-dandelions", "mimicking_the_sun_like_dandelions",
     "family_tree", "official", "hunter_root",
     "Family Tree (Official Audio)", "2020-07-30", "2020"),
    ("nyt2GjSMABI", "MV-HR-ALBUM-dandelions", "mimicking_the_sun_like_dandelions",
     "lampshade", "official", "hunter_root",
     "Lampshade (Official Audio)", "2020-07-30", "2020"),
    ("FbOoHjoSyec", "MV-HR-ALBUM-arkansas", "arkansas",
     "cant_outshine_the_truth", "live", "hunter_root",
     "Can't Outshine The Truth (Line Check Audio Sessions)", "2022-09-09", "2022"),
    ("XXnTxA_GF24", "MV-HR-ALBUM-arkansas", "arkansas",
     "quicksand_sinking", "live", "hunter_root",
     "Quicksand Sinking (Line Check Audio Sessions)", "2023-07-21", "2023"),
    ("g5_Wwbpwz_4", "MV-HR-ALBUM-dandelions", "mimicking_the_sun_like_dandelions",
     "little_red_riding_hood", "live", "hunter_root",
     "Little Red Riding Hood (Live with Todd Haley)", "2018-03-06", "2018"),
    ("jSxCptRelM8", "MV-HR-ALBUM-cracked", "they_finally_cracked_me",
     "straitlaced", "live", "hunter_root",
     "Straitlaced (Live at Cats Meow 2018)", "2018-03-03", "2018"),
    ("vF1D0tYjEws", "MV-HR-ALBUM-crooked_home", "crooked_home",
     "cookin_in_the_bathroom", "cover", "violet_lempke",
     "Cookin' in the Bathroom (Violet Lempke Cover)", "2025-08-10", "2025"),
]

REQUIRED_COLUMNS = {
    "id", "source_url", "source_platform", "media_type", "post_date",
    "post_date_confidence", "status", "released_at", "released_by",
    "description_short", "parent_artifact_id", "storage_mode",
    "ingest_source", "ingest_date", "capture_date", "notes",
    "created_at", "updated_at",
}


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")


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
    print(f"=== Batch 1 rendition MV writes [{mode}] ===\nDB: {args.db}")

    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row
    problems = []

    # --- Preflight 0: schema has every column we INSERT into. -------------
    cols = {r["name"] for r in conn.execute("PRAGMA table_info(artifacts)")}
    missing_cols = REQUIRED_COLUMNS - cols
    if missing_cols:
        problems.append(f"artifacts table missing columns: {sorted(missing_cols)}")

    # --- Preflight 1: reference row exists; mirror its defaults. ----------
    ref = conn.execute(
        "SELECT storage_mode, post_date_confidence, ingest_source, source_platform "
        "FROM artifacts WHERE id=?", (REFERENCE_ROW_ID,)).fetchone()
    if not ref:
        problems.append(f"reference row {REFERENCE_ROW_ID} MISSING")
    elif ref["source_platform"] != "youtube":
        problems.append(f"reference row {REFERENCE_ROW_ID} is not a youtube link "
                        f"(source_platform={ref['source_platform']})")
    else:
        print(f"[ref] mirroring defaults from {REFERENCE_ROW_ID}: "
              f"storage_mode={ref['storage_mode']!r} "
              f"post_date_confidence={ref['post_date_confidence']!r} "
              f"ingest_source={ref['ingest_source']!r}")

    # --- Preflight 2: idempotency - none of the 8 ytIds already in MV. ----
    for (ytid, *_rest) in INSERTS:
        hits = conn.execute(
            "SELECT id, status FROM artifacts WHERE source_url LIKE ?",
            (f"%{ytid}%",)).fetchall()
        if hits:
            problems.append(f"ytId {ytid} already present: "
                            f"{[(h['id'], h['status']) for h in hits]}")

    # --- Preflight 3: each parent container exists, is released, is an album;
    #     and an existing child of it already carries song:<slug> (so we join
    #     an existing track rather than minting a new one). ----------------
    for (ytid, parent, album_tag, slug, kind, author, title, pdate, ytag) in INSERTS:
        c = conn.execute("SELECT status, tags FROM artifacts WHERE id=?", (parent,)).fetchone()
        if not c:
            problems.append(f"container {parent} MISSING (for {ytid})")
            continue
        if c["status"] != "released":
            problems.append(f"container {parent} not released (status={c['status']})")
        if "card_kind:album" not in (c["tags"] or ""):
            problems.append(f"container {parent} lacks card_kind:album tag")
        kin = conn.execute(
            "SELECT COUNT(*) FROM artifacts WHERE parent_artifact_id=? "
            "AND status='released' AND tags LIKE ?",
            (parent, f"%song:{slug}%")).fetchone()[0]
        if kin == 0:
            problems.append(f"no existing released child of {parent} carries song:{slug} "
                            f"(rendition {ytid} would mint a NEW track - not in scope)")

    # --- Preflight 4: title-fix row. ---------------------------------------
    tf = conn.execute("SELECT description_short, status FROM artifacts WHERE id=?",
                      (TITLE_FIX_ID,)).fetchone()
    if not tf:
        problems.append(f"title-fix row {TITLE_FIX_ID} MISSING")
    elif tf["description_short"] == TITLE_FIX_NEW:
        print(f"[note] {TITLE_FIX_ID} title already fixed; UPDATE will be a no-op.")

    if problems:
        conn.close()
        sys.exit("[abort] preflight failed:\n  " + "\n  ".join(problems))

    # --- Mint sequential ids MV-HR-<today>-NNN. ----------------------------
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
    minted = [f"{prefix}{nmax + 1 + i:03d}" for i in range(len(INSERTS))]

    # --- Plan output. -------------------------------------------------------
    print(f"\n[plan] title fix {TITLE_FIX_ID}:")
    print(f"   old: {tf['description_short']!r}")
    print(f"   new: {TITLE_FIX_NEW!r}")
    print(f"\n[plan] {len(INSERTS)} inserts:")
    for mid, (ytid, parent, album_tag, slug, kind, author, title, pdate, ytag) in zip(minted, INSERTS):
        tags = [f"album:{album_tag}", f"author:{author}", "bands:hunter_root",
                f"content_kind:{kind}", "exhibit:hunter_root", "scope:hunter_root",
                f"song:{slug}", "source:youtube", "type:video", f"year:{ytag}"]
        print(f"   {mid}  yt={ytid}  parent={parent}")
        print(f"      title={title!r}  post_date={pdate}")
        print(f"      tags={tags}")

    if not args.apply:
        conn.close()
        print("\n[dry-run] no writes performed. Re-run with --apply (MV CLOSED) to execute.")
        return

    # --- Snapshot. ----------------------------------------------------------
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bdir = os.path.join(os.path.dirname(args.db), "backups")
    os.makedirs(bdir, exist_ok=True)
    snap = os.path.join(bdir, f"bak_pre_batch1_renditions_{ts}__mediavault.sqlite")
    conn.close()
    shutil.copy2(args.db, snap)
    print(f"\n[snapshot] {snap}")
    conn = sqlite3.connect(args.db)
    conn.row_factory = sqlite3.Row

    iso = now_iso()

    # --- Title fix. ----------------------------------------------------------
    conn.execute("UPDATE artifacts SET description_short=?, updated_at=? WHERE id=?",
                 (TITLE_FIX_NEW, iso, TITLE_FIX_ID))

    # --- Inserts (tags column omitted -> defaults '[]'; tags via writer). ----
    all_tag_lists = []
    for mid, (ytid, parent, album_tag, slug, kind, author, title, pdate, ytag) in zip(minted, INSERTS):
        notes = json.dumps({"created_by": "cowork_batch1_renditions", "created_utc": ts,
                            "batch": "batch1-2026-06-10"}, ensure_ascii=False)
        conn.execute(
            "INSERT INTO artifacts (id, ingest_source, ingest_date, storage_mode, media_type, "
            "source_url, source_platform, post_date, post_date_confidence, capture_date, "
            "status, released_at, released_by, description_short, notes, "
            "parent_artifact_id, created_at, updated_at) "
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (mid, ref["ingest_source"], iso[:10], ref["storage_mode"], "link",
             f"https://www.youtube.com/watch?v={ytid}", "youtube", pdate,
             ref["post_date_confidence"], iso[:10],
             "released", iso, "mike", title, notes, parent, iso, iso))
        tags = [f"album:{album_tag}", f"author:{author}", "bands:hunter_root",
                f"content_kind:{kind}", "exhibit:hunter_root", "scope:hunter_root",
                f"song:{slug}", "source:youtube", "type:video", f"year:{ytag}"]
        all_tag_lists.append((mid, tags))
        for t in tags:
            try:
                upsert_tag(conn, t)
            except Exception:
                pass
        write_artifact_tags(conn, mid, tags)

    conn.commit()

    # --- Verify. --------------------------------------------------------------
    print("\n=== verify ===")
    r = conn.execute("SELECT description_short FROM artifacts WHERE id=?",
                     (TITLE_FIX_ID,)).fetchone()
    print(f"title fix {TITLE_FIX_ID}: {r['description_short']!r}")
    for mid, tags in all_tag_lists:
        row = conn.execute("SELECT status, parent_artifact_id, source_url, tags "
                           "FROM artifacts WHERE id=?", (mid,)).fetchone()
        ok = (row and row["status"] == "released"
              and all(t in (row["tags"] or "") for t in (tags[3], tags[6])))
        print(f"{mid}: status={row['status']} parent={row['parent_artifact_id']} "
              f"url=...{row['source_url'][-15:]} kind/song tags present={ok}")
    for parent in sorted({i[1] for i in INSERTS}):
        n = conn.execute("SELECT COUNT(*) FROM artifacts WHERE parent_artifact_id=? "
                         "AND status='released'", (parent,)).fetchone()[0]
        print(f"released children of {parent}: {n}")
    conn.close()
    print("\n[done] MV writes committed. Next: reopen MV -> npm run export-artifacts "
          "(expect +8 artifacts in hunter_root.json) -> npm run build -> "
          "npm run deploy -> live-verify -> host-side commit.")


if __name__ == "__main__":
    main()
