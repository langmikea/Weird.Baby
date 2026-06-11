# Batch 2 Scoping — Discography Reconciliation (2026-06-11)

**Status:** scoping only. Nothing here is approved for build. Supersedes the
narrower "where do singles live" question — tonight's research showed the gap
is bigger: the museum's albums are incomplete against the actual discography.

**Authoritative source found:** hunterrootmusic.bandcamp.com (live, 26
releases, full-res art, canonical tracklists). Secondary: the YT research
corpus (`C:\AI\Projects\Hunter Root\yt_research\`) and the Topic channel
(official audio for most catalog tracks).

## A. Album track gaps (museum vs Bandcamp)

| Album | Museum | Bandcamp | Missing |
|---|---|---|---|
| Arkansas | 8 | 11 | Good On Paper; Run From The Devil (Topic: pUoeq9_lWB8, 315K); Silver Lining (reprise/second listing) |
| Life Inside A Wheel | 2 | 12 | Talker With A Broken Jaw; Killer To Killer; Fix My Head; Free To Roam The Cage; With Great Pleasure; The Water; Music On My Mind; What I Felt; Greek Fire — note Same Page + Brain Cell appear on BOTH LIAW (2019) and RWTH (dedup/cross-listing decision needed) |
| Others | — | — | not yet diffed against Bandcamp; do the same per-album diff during build scoping |

Bandcamp Arkansas running order (for track_order): Silver Lining, Quicksand
Sinking, Town Rat Heathen, Reverend, Grain Of Rice, Can't Outshine The Truth,
California Sober, Good On Paper, Few Steps Back, Run From The Devil, Silver
Lining (11).

LIAW running order: Same Page, Talker With A Broken Jaw, People Are Programs,
Killer To Killer, Brain Cell, Fix My Head, Free To Roam The Cage, With Great
Pleasure, The Water, Music On My Mind, What I Felt, Greek Fire (12).

## B. Non-album releases the museum doesn't model

Confirmed on Bandcamp: Phone Recordings EP; Sleight of Hand (single release —
museum currently shows the track under Life Inside A Wheel); standalone
singles: Chase The Dragon, Wildfire, Weathervane, A Pot Song, '94, Friendly
Fire, My Brother's Bones, Cookin' in the Bathroom, Vampire Song, Silver
Lining, Reverend, Town Rat Heathen, Run From The Devil, Quicksand Sinking…
(several later landed on albums; the singles-as-releases vs tracks-on-albums
modeling is the core UX decision).

Topic uploads in hand (official audio, ytIds known): Run From The Devil
pUoeq9_lWB8 · Chase the Dragon PuGs1q9vF44 · Undertow jVEsgqPolFY · Wildfire
kV__I_klF78 · Patience In The Dark ZBklAZQy7HA · Cocoon yFgXiD7bVes ·
Impossible Itch KNfhOH3BBj8 · The Shade BS6oPVNSlsA · Shake It Off Of Me
ZMMaUZkA4XM · Upper Hand othYWVOgbyg. Channel officials: Chase the Dragon MV
Kcc4bJqWCLE (270K) · Wildfire visualizer KrhiwkMfU9c · Weathervane visualizer
Qtd7INT4AWw · Vampire Song fqxOeVxaIzs · Belly Ache live YZbEY4Z5DBM · A Pot
Song upload 0IgnaUyCCWs · Charleston Girl (Tyler Childers cover) e9gdQ8H6FoQ.

## C. The one UX decision that gates everything (MIKE)

Where do non-album tracks/releases live in the exhibit?
Options sketched, not argued: (1) a "Singles" container per era; (2) model
Bandcamp releases 1:1 (each single = a tiny album card); (3) only albums get
shelves, singles appear solely as renditions where a song later joined an
album; (4) a distinct exhibit surface. Pick one before any Batch 2 build.

## D. Smaller queued decisions

- LIAW/RWTH shared tracks (Same Page, Brain Cell): one artifact in two
  containers isn't supported by the current parent model — needs either
  duplicate rows or a containers-by-tag rework. Decide cheap (duplicate) vs
  right (rework).
- Shorts bucket (~140 channel shorts/promos in triage doc) — still deferred.
- Live-clip curation sweep (~10 fan-corpus clips: Wonder Bar, Acid Palms,
  Nectar's, band versions) — taste call, anytime.
- ytId FbOoHjoSyec now referenced 3x (artifact, archive, rendition) — fold
  into the old dup-card question.

## E. Build pattern (settled, reuse)

Renditions/links: batch1_renditions_mvwrite.py pattern (gated, snapshot,
coordinated tag writer, song-slug join assert). New tracks additionally need:
release/insert audio or link rows, parent to container, extend
notes.track_order (RWTH script shows the order-write pattern). New containers:
RWTH script verbatim. Then export → build → deploy → live-verify → commit,
each its own step.

## F. Assets in hand

Six album covers, 1200×1200, from Bandcamp (chat outputs /covers/, also to be
stored wherever Mike keeps source art): arkansas, crooked_home,
life_inside_a_wheel, mimicking_the_sun_like_dandelions, skipping_stones,
they_finally_cracked_me. TFCM art pixel-verified against its Topic upload.
RWTH cover already in MV (MV-20260419-003).
