# Weird.Baby Museum — Backlog

**Last updated:** 2026-05-02 (post-Phase-2a Cleanup)

This file holds aspirational state — work intended but not yet committed and
deployed. `STATE.md` describes committed-and-deployed reality. When something
in this file lands, move the line out of here.

---

## Tier 1 — Active Build (museum experience, next sessions)

**Tracklist Queue Overhaul.** Rework tracklist interaction in `Exhibit.jsx`:
single click adds to queue (not immediate play); double click plays now then
returns to queue; video stays visible regardless of which album is browsed;
when nothing is playing, show album cover for the focused album (not YT
thumbnail). Requires visible queue UI, double-click handler, interrupt+resume
logic, video-area render changes. Touches the core of `Exhibit.jsx`. Scope
before building.

**Hunter Root Links Enrichment.** Many tracks in `hunter-root.js` have empty
`videos[]` arrays. Research and populate: YouTube videos, official audio,
live performances, covers. The data structure already supports multiple
types per track (official, live, clip, lyrics, cover). Pure content/data
work — no code changes.

---

## Tier 2 — Pre-Launch Required (build before any public mention)

**Phase 2b — Deploy verification.** First deploy of the post-Phase-2a tree.
Run `npx vite build`, then `npx wrangler deploy`. Confirm `/hr` renders the
new HrExhibitFlow correctly in production; confirm guestbook still writes to
D1; confirm the route table change (no more `/cb`, `/hr/workshop`,
`/hr/workshop/lyric-map`, `/hr/merch`) doesn't break any external links.

**Phase 2.5 — Move session-close briefs out of repo.** Per `RESET_PROTOCOL.md`,
session-close briefs and probe bundles do not live in the live museum repo.
The ~30 `docs/SESSION_CLOSE_v*.md` files are grandfathered as frozen
artifacts; they need to move to `C:\AI\_sessions\` (create the directory if
it doesn't exist). Untracked `.bak` files in `docs/` and the `_quarantine/`
directory should also be deleted from the working tree at the same time
(Phase 2a recorded the deletions in the index but couldn't unlink the files
from the working tree due to a sandbox permission issue).

**Founding Visitor Easter Egg.** From `VISION.md`. Timestamped badge for
anyone who visits before public announcement. Needs a D1 schema change.
400+ visits so far are all Mike's own — not urgent yet, but must land
before any external link points to weird.baby.

**Persistent Guest Book Entries (Cloudflare D1).** Currently ephemeral.
Real guest contributions need persistence. Storage target: D1 (decided
April 14 brainstorm — KV is wrong tool, D1 is the answer). Part of the
contribution shell architecture (see `VISION.md`).

**Persistent Vote Counts (Cloudflare D1).** Pairs with guest book
persistence. Votes should survive page reload. Anonymous dedup via
fingerprint (IP+UA hash), server-side — not localStorage. Storage target:
D1.

**Fan Playlists.** Fan-curated playlists embedded in the tracklist drawer,
not a separate page. Fan-submitted, zero friction, no login required,
immediate publish. Hover-to-peek on playlist cards. Selecting a playlist
loads it into the player. Creation flow: `+` button on any track builds a
staging tray; version-aware. Submit with name + your name + blurb. Anonymous
playlists are frozen on submit. Museum also authors playlists in the same
system. Full spec: `docs/FEATURE_fan_playlists.md`.

---

## Tier 3 — Quality of Life (improves the experience, not blocking)

**SM Video/Audio Handoff.** Fade/pause/resume the playing song when a social
media video plays in a panel.

**Real Auth for Entry Ownership/Delete.** Needed once journal entries
persist. Users should own their entries.

**Weighted Journal Selection Tied to Live Vote Data.** Currently
random/weighted by static config. Should reflect actual votes.

**ytId duplicate-card question.** The `ytId` value `FbOoHjoSyec` appears on
both an `HR_ARTIFACTS` entry (`art-8-2022-09-09`) and an `HR_ARCHIVE` entry
(`arc-20-2022-09-09`) — same video referenced twice across two source files.
Phase 1.5d normalized the URL fallback; the deduping question (do we want
two cards pointing at the same video?) is still open.

**Mobile UX polish.** Inline scroll-snap deck + artifact grid haven't been
tested at narrow widths since the Phase 1.5 port. Pass through the
viewports the gift shop covers and confirm tap targets and deck tab strip
behave.

---

## Tier 4 — Polish & Cleanup (batch in one commit anytime)

**UI polish.** Center `HUNTER ROOT` in the nav bar; journal alignment
fine-tuning (closer on P2, slightly off on P3); active album on coverflow
should be larger.

**Content polish.** Artist photos for the gift shop roster (typography
fallback works for now); rewrite the featured blurb in `wb_roster.js`
(post-Phase-1 it's the older "Central PA songwriter" line — Lancaster
revision is in the working tree, not committed); walked-in bell audio
file for the gift shop.

---

## Tier 5 — Future / When Ready

**Museum Merch Pipeline.** Big Cartel + Printful. Gift shop has placeholder
("Museum merch coming soon"). Build when ready to actually sell things.

**Content Archive Preservation.** Hard copies of all linked archive assets
+ Digital Archive Catalog System. Fan group posts, per-item metadata,
preservation flags. Needs scoping session before build.

---

## Outside museum (system-level, tracked elsewhere)

- OneDrive migration for `C:\AI` workspace
- Cancel Square Online subscription (manual action)
- Cancel/disable GoDaddy site builder (manual action)

---

## MediaVault Tag Vocabulary — Targeted Cleanup

Three targeted cleanups specified in `docs/MV_TAG_CLEANUP_DESIGN.md`:
platform category, unused-4 disposition, rarity/scope depth check. Cleanups
1 and 2 are build-bites; Cleanup 3 is a discovery-bite.

---

## Done in Phase 2a (removed from this list)

- Carsie Blanton exhibit + roster + data files (deleted Phase 1)
- LyricMap workshop tool (deleted Phase 1)
- Orphan HR files: HrPanel2, HrPanel3, HrMerch (deleted Phase 1)
- `/hr/merch` redirect (route removed Phase 1)
- v28 deck ported to HrExhibitFlow (Phase 1.5)
- video_kind Normalization Pass (already done in v31, was lingering)
