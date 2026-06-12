#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
batch2_mvwrite.py - Batch 2 catalog ingest (Bandcamp -> MV), gated, host-side.

CONTRACT: docs/BATCH2_MAPPING-20260612.md. Reads transcode_manifest.json (78
entries) and performs ONE batched MV-write session:
  1. Snapshot live DB to core/backups/ (only with --apply).
  2. Create MV-HR-ALBUM-phone_recordings (+ vaulted cover.png photo child)
     and MV-HR-ALBUM-rarities ("SINGLES & RARITIES", no cover yet).
  3. Insert 78 audio artifacts (vaulted V0 mp3s, content_kind:studio, song
     tags matching existing slugs for attach-tracks, new slugs for new
     tracks). FLAC master path recorded in notes.master_path.
  4. Fix the Sleight of Hand mis-tag (MV-20260523-067: song:shapeshifter ->
     song:sleight_of_hand) and re-parent it to Rarities.
  5. Re-parent Cookin' x3 + A Pot Song video renditions CH -> Rarities
     (album tag rewritten).
  6. Rewrite track_order on all six album containers to full Bandcamp
     running order; Rarities order = chronological.

ALL tag writes via core.artifact_tags.write_artifact_tags (spec 4.5).
HARD GATES: MV CLOSED for --apply. Review dry-run first.
USAGE:
  python tools/batch2_mvwrite.py           # dry-run (MV may stay open; read-only)
  python tools/batch2_mvwrite.py --apply   # snapshot, vault-copy files, mutate
After --apply: reopen MV -> node tools/sync-assets-to-r2.mjs ->
npm run export-artifacts -> build -> deploy -> eyes -> commit.
"""

import argparse, glob, json, os, re, shutil, sqlite3, sys
from datetime import datetime, timezone

DB        = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"
CORE      = r"C:\AI\Platform\MediaVault\core"
VAULT_DIR = r"C:\AI\Platform\MediaVault\catalogs\vaulted\2026\06"
MANIFEST  = r"C:\AI\Platform\MediaVault\intake\bandcamp\_mp3\transcode_manifest.json"
EP_COVER_GLOB = r"C:\AI\Platform\MediaVault\intake\bandcamp\_extracted\Phone Recordings EP\cover.*"

EP_ID       = "MV-HR-ALBUM-phone_recordings"
RARITIES_ID = "MV-HR-ALBUM-rarities"
SLEIGHT_ID  = "MV-20260523-067"
MOVERS = ["MV-20260523-010", "MV-20260523-037", "MV-HR-20260610-008", "MV-20260523-013"]

ALBUMS = {
    "Arkansas":                       ("MV-HR-ALBUM-arkansas",     "arkansas"),
    "Crooked Home":                   ("MV-HR-ALBUM-crooked_home", "crooked_home"),
    "Life Inside A Wheel":            ("MV-HR-ALBUM-wheel",        "life_inside_a_wheel"),
    "Mimicking the Sun Like Dandelions": ("MV-HR-ALBUM-dandelions", "mimicking_the_sun_like_dandelions"),
    "Skipping Stones That Sink Before They're Thrown": ("MV-HR-ALBUM-skipping", "skipping_stones_that_sink_before_theyre_thrown"),
    "They Finally Cracked Me":        ("MV-HR-ALBUM-cracked",      "they_finally_cracked_me"),
    "Phone Recordings EP":            (EP_ID,                      "phone_recordings_ep"),
}
ALBUM_ID_ORDER = ["Arkansas", "Crooked Home", "Life Inside A Wheel",
                  "Mimicking the Sun Like Dandelions",
                  "Skipping Stones That Sink Before They're Thrown",
                  "They Finally Cracked Me", "Phone Recordings EP"]

# (attach, new, total) per contract PER-ALBUM ACTIONS
EXPECTED = {
    "Arkansas": (8, 3, 11), "Crooked Home": (12, 0, 12),
    "Life Inside A Wheel": (1, 11, 12),
    "Mimicking the Sun Like Dandelions": (5, 5, 10),
    "Skipping Stones That Sink Before They're Thrown": (3, 7, 10),
    "They Finally Cracked Me": (1, 10, 11), "Phone Recordings EP": (0, 5, 5),
}

# slug -> contract year, for the 7 purchased singles landing in Rarities
RARITY_SINGLES = {
    "chase_the_dragon": "2024", "cookin_in_the_bathroom": "2024",
    "a_pot_song": "2025", "sleight_of_hand": "2020", "shapeshifter": "2019",
    "weathervane": "2025", "wildfire": "2024",
}
RARITIES_ORDER = ["shapeshifter", "sleight_of_hand", "chase_the_dragon",
                  "cookin_in_the_bathroom", "wildfire", "a_pot_song", "weathervane"]
ROSTER_PENDING = ["highway_man_blues", "charleston_girl", "down_out_law",
                  "cocaine_cocaine", "park_bench_pigeons", "cellophane_snake"]

SLUG_ALIASES = {"straightlaced": "straitlaced"}  # applied only if alias target exists in container

# (album, bandcamp track#) -> (slug, display title). For tracks whose FLAC TITLE
# tag cannot distinguish them (Arkansas 11 is tagged identically to track 1).
TRACK_OVERRIDES = {("Arkansas", 11): ("silver_lining_reprise", "Silver Lining (reprise)")}

CONTAINER_TAGS_EP = ["album:phone_recordings_ep", "bands:hunter_root", "card_kind:album",
                     "content_kind:other", "exhibit:hunter_root"]
CONTAINER_TAGS_RAR = ["album:rarities", "bands:hunter_root", "card_kind:album",
                      "content_kind:other", "exhibit:hunter_root"]


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

def slugify(t):
    s = (t or "").lower()
    for ch in ("\u2019", "\u2018", "'", "`"):
        s = s.replace(ch, "")
    s = re.sub(r"[^a-z0-9]+", "_", s)
    return s.strip("_")

def songset(conn, container_id):
    out = set()
    for r in conn.execute("SELECT tags FROM artifacts WHERE parent_artifact_id=?", (container_id,)):
        try:
            for t in json.loads(r["tags"] or "[]"):
                if t.startswith("song:"):
                    out.add(t[5:])
        except Exception:
            pass
    return out

def year_of(entry):
    d = str(entry.get("date") or "")
    return d[:4] if re.match(r"^\d{4}", d) else ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--apply", action="store_true")
    args = ap.parse_args()
    mode = "APPLY" if args.apply else "DRY-RUN"
    print(f"=== Batch 2 MV write [{mode}] ===\nDB: {DB}")

    # ── Load + validate manifest ────────────────────────────────────────────
    with open(MANIFEST, encoding="utf-8") as f:
        manifest = json.load(f)
    if len(manifest) != 78:
        sys.exit(f"[abort] manifest has {len(manifest)} entries, expected 78")
    missing = [e["mp3"] for e in manifest if not os.path.exists(e["mp3"])]
    missing += [e["src"] for e in manifest if not os.path.exists(e["src"])]
    if missing:
        sys.exit("[abort] missing files:\n  " + "\n  ".join(missing[:10]))

    covers = glob.glob(EP_COVER_GLOB)
    if len(covers) != 1:
        sys.exit(f"[abort] EP cover glob matched {len(covers)} files: {covers}")
    ep_cover_src = covers[0]

    if args.apply:
        conn = sqlite3.connect(DB)
    else:
        conn = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    conn.row_factory = sqlite3.Row

    # ── Idempotency ─────────────────────────────────────────────────────────
    for cid in (EP_ID, RARITIES_ID):
        if conn.execute("SELECT 1 FROM artifacts WHERE id=?", (cid,)).fetchone():
            sys.exit(f"[abort] {cid} already exists - Batch 2 appears applied.")

    # ── Classify manifest entries ───────────────────────────────────────────
    existing_songs = {a: songset(conn, ALBUMS[a][0]) for a in ALBUMS}
    plans = {a: {"attach": [], "new": []} for a in ALBUMS}   # entries + slug
    rarities = {}                                            # slug -> entry
    errors = []
    for e in manifest:
        alb = e.get("album") or e.get("group")
        title = e["title"]
        slug = slugify(title)
        if alb in ALBUMS:
            ov = TRACK_OVERRIDES.get((alb, int(e["track"])))
            if ov:
                slug = ov[0]
                e["title"] = title = ov[1]
            if slug in SLUG_ALIASES and SLUG_ALIASES[slug] in existing_songs[alb]:
                slug = SLUG_ALIASES[slug]
            kind = "attach" if slug in existing_songs[alb] else "new"
            plans[alb][kind].append((int(e["track"]), slug, title, e))
        elif slug in RARITY_SINGLES:
            if slug in rarities:
                errors.append(f"duplicate rarity '{title}'")
            rarities[slug] = e
            if year_of(e) and year_of(e) != RARITY_SINGLES[slug]:
                print(f"[warn] {title}: FLAC year {year_of(e)} != contract {RARITY_SINGLES[slug]} (using contract year)")
        else:
            errors.append(f"unmapped manifest entry: album='{alb}' title='{title}' (slug {slug})")
    if errors:
        sys.exit("[abort] classification failed:\n  " + "\n  ".join(errors))

    # ── Assert contract counts ──────────────────────────────────────────────
    fails = []
    for a, (xa, xn, xt) in EXPECTED.items():
        na, nn = len(plans[a]["attach"]), len(plans[a]["new"])
        if (na, nn, na + nn) != (xa, xn, xt):
            fails.append(f"{a}: got attach={na} new={nn} total={na+nn}, contract says {xa}/{xn}/{xt}")
    if set(rarities) != set(RARITY_SINGLES):
        fails.append(f"rarity singles mismatch: got {sorted(rarities)} expected {sorted(RARITY_SINGLES)}")
    # special slug check
    ark_new = {s for _, s, _, _ in plans["Arkansas"]["new"]}
    if "silver_lining_reprise" not in ark_new:
        fails.append(f"Arkansas new slugs {sorted(ark_new)} missing silver_lining_reprise")
    if fails:
        sys.exit("[abort] contract assertion failed:\n  " + "\n  ".join(fails))

    # ── Verify movers + sleight rows are as scoped ──────────────────────────
    for mid in MOVERS + [SLEIGHT_ID]:
        r = conn.execute("SELECT id, parent_artifact_id, tags FROM artifacts WHERE id=?", (mid,)).fetchone()
        if not r:
            sys.exit(f"[abort] mover {mid} not found")
        expect_parent = "MV-HR-ALBUM-wheel" if mid == SLEIGHT_ID else "MV-HR-ALBUM-crooked_home"
        if r["parent_artifact_id"] != expect_parent:
            sys.exit(f"[abort] {mid} parent={r['parent_artifact_id']}, expected {expect_parent}")

    # ── Allocate ids ────────────────────────────────────────────────────────
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"MV-HR-{today}-"
    nmax = 0
    for (u,) in conn.execute("SELECT id FROM artifacts WHERE id LIKE ?", (prefix + "%",)):
        try:
            nmax = max(nmax, int(u.rsplit("-", 1)[1]))
        except Exception:
            pass
    seq = [nmax]
    def next_id():
        seq[0] += 1
        return f"{prefix}{seq[0]:03d}"

    inserts = []   # (id, entry, slug, container_id, album_tag, kind)
    orders = {}    # album -> slug list (bandcamp order)
    for a in ALBUM_ID_ORDER:
        rows = sorted(plans[a]["attach"] + plans[a]["new"], key=lambda x: x[0])
        orders[a] = [s for _, s, _, _ in rows]
        cid, atag = ALBUMS[a]
        attach_slugs = {s for _, s, _, _ in plans[a]["attach"]}
        for _, slug, title, e in rows:
            inserts.append((next_id(), e, slug, cid, atag,
                            "attach" if slug in attach_slugs else "new"))
    for slug in RARITIES_ORDER:
        e = rarities[slug]
        inserts.append((next_id(), e, slug, RARITIES_ID, "rarities", "rarity"))
    ep_cover_id = next_id()
    ep_cover_ext = os.path.splitext(ep_cover_src)[1].lower()

    # ── Plan output ─────────────────────────────────────────────────────────
    print(f"\n[plan] ids {prefix}{nmax+1:03d} .. {prefix}{seq[0]:03d} "
          f"({len(inserts)} audio + 1 cover)")
    for a in ALBUM_ID_ORDER:
        att, new = plans[a]["attach"], plans[a]["new"]
        print(f"[plan] {a}: attach={len(att)} new={len(new)}"
              + (f"  NEW: {sorted(s for _, s, _, _ in new)}" if new else ""))
        print(f"       order({len(orders[a])}): {orders[a]}")
    print(f"[plan] RARITIES: 7 audio singles, order: {RARITIES_ORDER}")
    print(f"[plan] movers CH->Rarities: {MOVERS}")
    print(f"[plan] sleight fix {SLEIGHT_ID}: song shapeshifter->sleight_of_hand, LIAW->Rarities")
    print(f"[plan] new containers: {EP_ID} (cover {ep_cover_id}{ep_cover_ext}), {RARITIES_ID} (no cover)")
    print(f"[plan] track_order rewrites on 6 existing containers (Bandcamp order)")
    print(f"[plan] vault copies -> {VAULT_DIR}: {len(inserts)} mp3 + 1 cover")

    if not args.apply:
        print("\n[dry-run] no writes performed. Review, then re-run with --apply (MV CLOSED).")
        conn.close()
        return

    # ── Snapshot ────────────────────────────────────────────────────────────
    ts = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    bdir = os.path.join(os.path.dirname(DB), "backups")
    os.makedirs(bdir, exist_ok=True)
    snap = os.path.join(bdir, f"bak_pre_batch2_{ts}__mediavault.sqlite")
    conn.close()
    shutil.copy2(DB, snap)
    print(f"\n[snapshot] {snap}")
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row

    # ── Coordinated tag writer ──────────────────────────────────────────────
    sys.path.insert(0, CORE)
    sys.path.insert(0, os.path.dirname(CORE))
    try:
        from artifact_tags import write_artifact_tags  # type: ignore
    except Exception:
        from core.artifact_tags import write_artifact_tags  # type: ignore
    try:
        from ingest_engine import upsert_tag  # type: ignore
    except Exception:
        from core.ingest_engine import upsert_tag  # type: ignore

    # ── Vault copies ────────────────────────────────────────────────────────
    os.makedirs(VAULT_DIR, exist_ok=True)
    for aid, e, *_ in inserts:
        shutil.copy2(e["mp3"], os.path.join(VAULT_DIR, f"{aid}.mp3"))
    ep_cover_vault = os.path.join(VAULT_DIR, f"{ep_cover_id}{ep_cover_ext}")
    shutil.copy2(ep_cover_src, ep_cover_vault)
    print(f"[vault] copied {len(inserts)} mp3 + cover")

    iso = now_iso()
    all_tags = set()

    def insert_artifact(aid, media, path, desc_s, desc_l, notes_obj, parent):
        conn.execute(
            "INSERT INTO artifacts (id, source_platform, ingest_source, ingest_date, "
            "storage_mode, local_asset_path, parent_artifact_id, media_type, "
            "post_date_confidence, capture_date, status, released_at, released_by, "
            "description_short, description_long, notes, created_at, updated_at) "
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
            (aid, "bandcamp", "bandcamp-purchase", iso[:10], "vaulted", path, parent,
             media, "unknown", iso[:10], "released", iso, "mike",
             desc_s, desc_l, json.dumps(notes_obj, ensure_ascii=False), iso, iso))

    # Containers (insert without tags col; tags via writer)
    ep_notes = {"card_kind": "album", "container": True, "cover_artifact_id": ep_cover_id,
                "title": "Phone Recordings EP", "track_order": orders["Phone Recordings EP"],
                "created_by": "cowork_batch2", "created_utc": ts}
    conn.execute(
        "INSERT INTO artifacts (id, ingest_source, ingest_date, storage_mode, media_type, "
        "post_date_confidence, capture_date, status, released_at, released_by, "
        "description_short, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (EP_ID, "cowork", iso[:10], "vaulted", "other", "unknown", iso[:10],
         "released", iso, "mike", "Phone Recordings EP",
         json.dumps(ep_notes, ensure_ascii=False), iso, iso))
    rar_notes = {"card_kind": "album", "container": True, "cover_artifact_id": None,
                 "title": "SINGLES & RARITIES", "track_order": RARITIES_ORDER,
                 "roster_pending": ROSTER_PENDING,
                 "created_by": "cowork_batch2", "created_utc": ts}
    conn.execute(
        "INSERT INTO artifacts (id, ingest_source, ingest_date, storage_mode, media_type, "
        "post_date_confidence, capture_date, status, released_at, released_by, "
        "description_short, notes, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        (RARITIES_ID, "cowork", iso[:10], "vaulted", "other", "unknown", iso[:10],
         "released", iso, "mike", "SINGLES & RARITIES",
         json.dumps(rar_notes, ensure_ascii=False), iso, iso))
    tag_jobs = [(EP_ID, CONTAINER_TAGS_EP), (RARITIES_ID, CONTAINER_TAGS_RAR)]

    # EP cover photo
    insert_artifact(ep_cover_id, "photo", ep_cover_vault,
                    "Phone Recordings EP - album cover",
                    "Bandcamp purchase cover art (Batch 2)",
                    {"created_by": "cowork_batch2", "created_utc": ts}, EP_ID)
    tag_jobs.append((ep_cover_id, ["album:phone_recordings_ep", "artifact_kind:cover",
                                   "bands:hunter_root", "exhibit:hunter_root",
                                   "scope:hunter_root", "source:bandcamp"]))

    # Audio rows
    for aid, e, slug, cid, atag, kind in inserts:
        y = RARITY_SINGLES[slug] if kind == "rarity" else year_of(e)
        title = e["title"]
        if kind == "rarity":
            dl = "Standalone single - Bandcamp FLAC master, V0 mp3 (Batch 2)"
        else:
            dl = f"{e['album']} - Bandcamp FLAC master, V0 mp3 (Batch 2)"
        notes_obj = {"master_path": e["src"], "duration_s": e.get("duration_s"),
                     "bandcamp_album": e.get("album"), "bandcamp_track": e.get("track"),
                     "created_by": "cowork_batch2", "created_utc": ts}
        insert_artifact(aid, "audio", os.path.join(VAULT_DIR, f"{aid}.mp3"),
                        f"{title} \u2014 audio recording", dl, notes_obj, cid)
        tags = [f"album:{atag}", "author:hunter_root", "bands:hunter_root",
                "content_kind:studio", "exhibit:hunter_root", "scope:hunter_root",
                f"song:{slug}", "source:bandcamp", "type:audio"]
        if y:
            tags.append(f"year:{y}")
        tag_jobs.append((aid, sorted(tags)))

    # Movers: CH videos -> Rarities (album tag rewrite)
    for mid in MOVERS:
        r = conn.execute("SELECT tags FROM artifacts WHERE id=?", (mid,)).fetchone()
        tags = json.loads(r["tags"])
        tags = sorted(("album:rarities" if t == "album:crooked_home" else t) for t in tags)
        conn.execute("UPDATE artifacts SET parent_artifact_id=?, updated_at=? WHERE id=?",
                     (RARITIES_ID, iso, mid))
        tag_jobs.append((mid, tags))

    # Sleight fix
    r = conn.execute("SELECT tags FROM artifacts WHERE id=?", (SLEIGHT_ID,)).fetchone()
    tags = json.loads(r["tags"])
    tags = ["song:sleight_of_hand" if t == "song:shapeshifter" else
            ("album:rarities" if t == "album:life_inside_a_wheel" else t) for t in tags]
    conn.execute("UPDATE artifacts SET parent_artifact_id=?, updated_at=? WHERE id=?",
                 (RARITIES_ID, iso, SLEIGHT_ID))
    tag_jobs.append((SLEIGHT_ID, sorted(tags)))

    # track_order rewrites on the 6 existing containers
    for a in ALBUM_ID_ORDER[:-1]:
        cid = ALBUMS[a][0]
        r = conn.execute("SELECT notes FROM artifacts WHERE id=?", (cid,)).fetchone()
        notes = json.loads(r["notes"])
        notes["track_order"] = orders[a]
        notes["track_order_updated"] = ts
        conn.execute("UPDATE artifacts SET notes=?, updated_at=? WHERE id=?",
                     (json.dumps(notes, ensure_ascii=False), iso, cid))

    # Tags: upsert every slug once, then write per artifact
    for _, tags in tag_jobs:
        all_tags.update(tags)
    for slug in sorted(all_tags):
        try:
            upsert_tag(conn, slug)
        except Exception:
            pass
    for aid, tags in tag_jobs:
        write_artifact_tags(conn, aid, tags)

    conn.commit()

    # ── Verify ──────────────────────────────────────────────────────────────
    print("\n=== verify ===")
    expect_children = {
        "MV-HR-ALBUM-arkansas": 14 + 11, "MV-HR-ALBUM-crooked_home": 18 - 4 + 12,
        "MV-HR-ALBUM-wheel": 3 - 1 + 12, "MV-HR-ALBUM-dandelions": 11 + 10,
        "MV-HR-ALBUM-skipping": 4 + 10, "MV-HR-ALBUM-cracked": 3 + 11,
        EP_ID: 6, RARITIES_ID: 12,
    }
    ok = True
    for cid, want in expect_children.items():
        got = conn.execute("SELECT COUNT(*) FROM artifacts WHERE parent_artifact_id=?", (cid,)).fetchone()[0]
        flag = "OK " if got == want else "!! "
        if got != want:
            ok = False
        print(f"  {flag}{cid}: children={got} (want {want})")
    n_audio = conn.execute("SELECT COUNT(*) FROM artifacts WHERE media_type='audio' AND status='released'").fetchone()[0]
    print(f"  released audio artifacts now: {n_audio}")
    s = conn.execute("SELECT tags, parent_artifact_id FROM artifacts WHERE id=?", (SLEIGHT_ID,)).fetchone()
    print(f"  sleight {SLEIGHT_ID}: parent={s['parent_artifact_id']} song_ok={'song:sleight_of_hand' in s['tags']}")
    conn.close()
    print(f"\n[done] {'all checks OK.' if ok else 'CHECK FAILURES ABOVE - investigate before proceeding.'}")
    print("Next: reopen MV -> node tools/sync-assets-to-r2.mjs -> npm run "
          "export-artifacts -> build -> deploy -> eyes -> commit.")


if __name__ == "__main__":
    main()
