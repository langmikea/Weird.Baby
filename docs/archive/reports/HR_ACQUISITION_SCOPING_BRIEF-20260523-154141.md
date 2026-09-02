# Hunter Root Acquisition — Scoping Brief

**Date:** 2026-05-23 (session ~15:25–?? UTC)
**Trigger:** Phase C closed; the ingest behavior audit
(`docs/INGEST_BEHAVIOR_AUDIT-20260522-182616.md`) named the *inbox-side*
automation roadmap and got M1–C4 sequenced; the C3 helper landed
on MV (`f08bfa0 feat(c3-ingest): HEIC transcoding policy + helper`)
ahead of this scoping pass. The remaining open question is the
*acquisition-side* shape: what goes **into** intake. Operator
framing (verbatim, 2026-05-23): *"I want an efficient and effective
tool and workflow that searches the web for HR related info, captures
the artifacts, presents them to me in MV, automatically heavily tagged,
sorted, etc. I look them over, adjust if necessary, and release as
warranted. This will eventually need to cover YT, Insta, Tik-Tok, FB,
Reels, www, etc., as much as is feasible. For targets that are not
searchable, (and maybe for other reasons also) we will need processes
where Mike is augmented as much as feasible. For now, split the list
between the two and focus on YT automation first."*
**Scope:** Scoping only. No code changes, no DB writes, no museum-side
commits except this brief. Read-only audit across the three repos.
The deliverable is this document.
**Status:** SCOPING COMPLETE. §1–§4 + §6–§8 LOCKED off live data.
§5's three operator decisions resolved in-session per GATE 5 (one at
a time); resolutions recorded in §9. Implementation green-lit.

---

## §0 — How to read this brief

Mirrors `docs/INGEST_BEHAVIOR_AUDIT-20260522-182616.md` structurally
and adapts to the acquisition task per Mike's 2026-05-23 framing. §1
inventories the existing HR toolchain + MV intake surface + tag
vocabulary as it actually stands today (not as documented elsewhere —
read off live code + live SQLite). §2 maps acquisition shape per source,
with YouTube in full detail and the other sources shaped to inform §3.
§3 splits sources into Auto / Mike-augmented / Deferred — the operative
expression of Mike's "as much as is feasible." §4 locks the tagging
specification: which tags fire mechanically, which need operator policy,
which need per-artifact judgment. §5 surfaces operator decisions one at
a time. §6 sequences the work using the §5.1/§5.2/§5.3 bucket pattern
from the ingest audit. §7 names what is explicitly out of scope. §8
records what was read. §9 fills as Mike resolves §5; empty at write
time.

What's locked vs what's a Mike decision:

- **LOCKED by Mike's framing:** Inbox review gate stays. Heavy tagging
  on receipt. Multi-source eventually. YT first. "Split between auto
  and augmented" — the §3 deliverable.
- **LOCKED by prior spec** (`tools/youtube-ingest-schema.md` v1.1,
  2026-05-08; status enum update 2026-05-21): YT artifact-cluster shape
  (parent + children with `parent_artifact_id`); pill namespaces
  (`platform:`, `scope:`, `author:`, `content_kind:`, `artifact_kind:`);
  storage modes per artifact type; folder layout under
  `archive/youtube/<channel_slug>/<video_id>/`; MV registration via
  `/api/artifact-register`. Per PHASEC §7.5 (re-read postures rule),
  this is NOT re-litigated as a §5 question — it's recorded in §2.1
  as the existing operator-locked shape.
- **LOCKED by ingest audit §5.4 sequencing:** M1–C4 ingest-side
  automation. The acquisition layer is a **client** of the M1–C4
  output, not a replacement. C3 has landed; the rest of the ingest
  audit's roadmap proceeds in its own track. This brief does not
  re-sequence ingest work.
- **RESOLVED in §9 (2026-05-23):** §5.1 YT discovery = channel-walk
  only. §5.2 cadence = on-demand only. §5.3 fan content = in-scope
  with credit (new `credit:` namespace approval folds into the
  implementation session). All three resolutions are forward-
  compatible — if v2 wants search-walks or recurring cadence, the
  underlying scripts already support those shapes.

Format-mirror note: §0 (this), §1 inventory, §2 per-source map, §3
split, §4 tagging, §5 ops decisions (one at a time), §6 bucketed
sequencing, §7 OOS, §8 verification, §9 resolved decisions. §5's
question count is small (three) because most of the design surface
was settled in `youtube-ingest-schema.md` already — the audit
re-confirms rather than re-asks.

---

## §1 — Current state inventory

### 1.1 HR's existing capture toolchain

HR has **three distinct capture-related code paths**, not one. The
session brief framed HR as "YT archive + capture script" (singular);
the inventory below corrects to plural.

| Path | Script | Role | Live evidence |
|---|---|---|---|
| **YT per-video archiver** | `tools/yt_archive_capture.py` (38 KB) | Captures ONE video at a time: thumbnail, transcript, optional page-save. Emits `yt_archive/v1` manifest. Registers parent + children via MV's `POST /api/artifact-register`. | 5 runs logged 2026-05-10 → 2026-05-21. 2 video folders on disk: `7Lttb_59EYw` (Reverend), `vPW49GU38Ng` ('94, dry-run). |
| **YT channel discovery** | `yt_research/yt_crawler.py` (2.6 KB) | Pulls the entire uploads playlist of `@hunterrootmusic` via YouTube Data API v3 + per-video view counts. Outputs `yt_research/channel_videos.json`. | Last run yielded 208 videos. Top video: "Town Rat Heathen (Official Music Video)" — 4,506,869 views. |
| **YT fan search-walk** | `yt_research/yt_crawler.py` (same script, different invocation OR adjacent code path that produced `fan_yt.json`) | Search-walks for HR-adjacent content uploaded by OTHER channels. JSON entries carry a `query` field naming the search term. | 175 results in `fan_yt.json` (40 KB). Top result is unrelated KPop content matching "Hunter Root cover" — false positives present at scale. |

The brief framing's "capture script" maps cleanly to
`yt_archive_capture.py`. The discovery layer is a sibling, not part of
the same script. Architectural implication for §3: discovery and
capture are separable. Discovery makes URL lists; capture consumes URL
lists. Either layer can be automated independently.

Two adjacent code paths exist but are NOT acquisition:

- `fb_poster/poster.py` (25 KB) — Selenium-based **outbound** poster
  for Hunter Root's Homestead FB group. Posts on M/W/F cadence per
  `HR_SYSTEM.md` §4. Not capture. BACKLOG.md P2-01 names "Poster +
  Scheduler" with "artifact saved automatically on send" as a future
  goal — if that lands, fb_poster becomes a one-way capture source
  for the system's own posts. Out of scope for v1 acquisition.
- `tools/tools/` (a nested directory of ~24 phase-2-era files —
  PowerShell scrapers, IG fetcher stubs, link-browser HTML, vision
  reports). Per `STATE.md`, this is "legacy ... PowerShell + Python
  + HTML scan reports" intentionally tracked but not on the active
  path. Treated as historical context only; the IG-touching pieces
  inform §2.2 below but are not currently runnable.

One museum-side wrapper is the operator entry point:

- `weird-baby-museum/tools/yt-ingest.mjs` (13.6 KB) — CLI wrapper that
  validates `--album` / `--track` / `--type` against
  `src/data/artists/hunter-root.js` SPINE before shelling out to
  `yt_archive_capture.py`. Variant taxonomy locked at
  `{official, live, lyrics, cover}` (CLAUDE.md, May 2026).
  Appends one line per run to `docs/ingest-log.md`.
  This wrapper is the user-facing tool today. Any acquisition automation
  needs to either invoke it, bypass it, or extend it.

### 1.2 HR's `archive/` directory inventory

`archive/` is gitignored per `STATE.md`. Size at audit: ~112 MB total.
Breakdown by source root:

```
archive/
├── reverbnation/          (112 MB — the bulk; Phase C source set)
│   ├── _sessions/         (raw capture sessions, RN-side)
│   ├── hunterroot2/       (one of three RN artist identities)
│   ├── medusasdisco/      (pre-2018 identity, ~14 artifacts in MV)
│   └── runwiththehunt/    (RWTH album, 15 albums on disk + _artist/)
└── youtube/               (32 KB — 2 video folders so far)
    └── hunter-root/
        ├── 7Lttb_59EYw/   (Reverend; manifest + transcripts/ + capture.log)
        └── vPW49GU38Ng/   ('94 dry-run; manifest + capture.log)
```

File-type histogram across the reverbnation tree:

| Ext | Count | Note |
|---|---|---|
| `.json` | 43 | per-album `metadata.json`, `mediavault_manifest.json`, `rn_archive_context.json` |
| `.md` | 22 | per-album `ARCHIVE.md` |
| `.mv_registered` | 19 | sentinel: this artifact registered to MV (with mv_id) |
| `.mp3` | 16 | audio files (15 RWTH + 1 MD PBP) |
| `.jpg` | 7 | cover_art images |
| `.mv_uploaded` | 5 | sentinel: bytes uploaded to R2 |
| `.html` | 5 | page_save snapshots |
| `.ps1` | 2 | per-album `download_audio.ps1` |
| `.txt` | 2 | per-album `lyrics.txt` |

Per-album shape (sample: `runwiththehunt/park-bench-pigeons_12495875/`):
```
ARCHIVE.md
download_audio.ps1
lyrics.txt
metadata.json
mediavault_manifest.json
rn_archive_context.json
.mv_registered     (sentinel)
.mv_uploaded       (sentinel)
audio/             (the .mp3)
cover_art/         (the .jpg)
page_save/         (the .html)
```

For the YT tree:
```
hunter-root/
├── 7Lttb_59EYw/
│   ├── mediavault_manifest.json     (yt_archive/v1 — parent + 2 children minted)
│   ├── capture.log                  (4 successful runs logged)
│   └── transcripts/7Lttb_59EYw.txt  (36 segments, 768 chars, auto_captions)
└── vPW49GU38Ng/
    ├── mediavault_manifest.json
    ├── capture.log
    └── transcripts/
```

Drift surfaced: of HR's 208 discovered YT videos (per
`channel_videos.json`), exactly 1 has been ingested to released-status
in MV (`scope:hunter_root` exhibit corpus). The other 207 are known
URLs not yet captured. **This is the ground-truth gap that v1 of the YT
automation closes.**

### 1.3 MV's intake surface (post-ingest-audit, post-C3 commit)

MV HEAD `f08bfa0`. Three intake paths per the ingest audit §1.2; HR
acquisition uses Path B exclusively today.

**Path B — `POST /api/artifact-register`** is the operative surface for
this brief. `yt_archive_capture.py` is a client of Path B. Any future
IG / TT / FB / web acquisition tool is also a Path B client by default.
Reasons (per ingest audit §1.4):

- Accepts a fully-typed artifact (caller knows `media_type`, `tags`,
  `storage_mode`, `parent_artifact_id`).
- Validates strictly (§3.1 grammar, status enum `{vault, released,
  archived}` per Phase 0.1 of the source-of-truth refactor).
- No inbox queue row — the artifact lands directly in `artifacts` with
  default `status='vault'` unless caller passes `released`.
- Single coordinated tag writer (`artifact_tags.py`).
- Used by 48 of 88 live artifacts today (the dominant intake source).

**`_infer_media_type` automatic mapping** (`imgserver_extensions.py:215`):
already covers `.mp3 → audio`, `.jpg → photo`, `.html → link`, `.txt
→ text`, etc. Whatever an acquisition layer dumps with `local_asset_path`
gets a media_type for free.

**M1 status:** *not yet landed* per the ingest audit §5.1. Path A's
`queue_item` still omits media_type. Irrelevant to Path B-based
acquisition (Path B already infers); relevant only if a future
acquisition tool drops files into `intake/drop/` instead of POSTing.

**C3 status: LANDED** (commit `f08bfa0 feat(c3-ingest): HEIC
transcoding policy + helper`). HEIC transcoding policy is now
configurable at ingest. Not directly load-bearing for HR acquisition
(no HEIC in HR sources) but confirms the ingest roadmap is moving and
the acquisition layer is downstream of in-flight ingest work.

**Tag write surface:** `write_artifact_tags()` (single coordinated
writer per §4.5.1 of the audit). Tags arrive in the `/api/artifact-register`
POST body's `tags` array; the handler validates each against §3.1
strict grammar (`namespace:value`, both non-empty, namespace
`[a-z0-9_]+`, value `[a-z0-9_-]+`, exactly one colon) and writes them
atomically with the artifact row. Bare slugs are rejected 400.

**Parent linkage:** `parent_artifact_id` is a body field on
`/api/artifact-register`. The caller (the orchestrator script)
captures the parent's minted `MV-YYYYMMDD-NNN` from the POST response
and threads it into each child's POST. No MV-side patch needed for
sibling clustering — `yt_archive_capture.py` already does this
correctly.

### 1.4 MV's tag vocabulary for HR

Read live from `mediavault.sqlite` at `f08bfa0`. The `vocabulary` table
holds 14 namespace registrations:

| Namespace | Display | Tier | Sort | Retired |
|---|---|---|---|---|
| `year` | Year | 1 | 1 | — |
| `album` | Album | 1 | 2 | — |
| `song` | Song | 1 | 3 | — |
| `venue` | Venue | 1 | 4 | — |
| `people` | People | 1 | 5 | — |
| `source` | Source | 2 | 1 | — |
| `type` | Type | 2 | 2 | — |
| `exhibit` | Exhibit | — | — | **2026-05-19** |
| `unsorted` | Unsorted | 3 | 1 | **2026-05-19** |
| `author` | Author | 3 | 2 | **2026-05-19** |
| `platform` | Platform | 3 | 3 | **2026-05-19** |
| `scope` | Scope | 3 | 4 | **2026-05-19** |
| `artifact_kind` | Artifact Kind | 3 | 5 | **2026-05-19** |
| `content_kind` | Content Kind | 3 | 6 | **2026-05-19** |

**Drift surfaced: half the vocabulary is retired post-Phase-0.1
refactor.** The retirements are dated 2026-05-19 — five days *after*
`youtube-ingest-schema.md` v1.1 (2026-05-08) was authored and three
days *after* the first 3 YT artifacts were registered (2026-05-18).
The retired namespaces include EXACTLY the ones the YT ingest schema
specifies: `platform`, `scope`, `author`, `content_kind`, `artifact_kind`.
The MV-side validation still accepts these tags (the 3 live YT
artifacts carry them) because `validate_artifact_tags` keys on the §3.1
grammar, not on vocabulary registration. But the vocabulary registry
no longer surfaces these as recommended pill namespaces.

This is **architectural drift between the YT ingest schema and the
current MV vocabulary**. The audit does not resolve it — that's an
MV-side decision (revive the namespaces, or replace them with
year/album/song/people/source/type-tier ones). Surfaced here so the
implementation session knows the gap exists. Not a §5 question because
it's not a UX-impactful binary; it's an Ops/data-shape question that
attaches to the M-track ingest work.

**Tag instance distribution** (live artifacts, 470 total tag instances
across 88 artifacts):

```
unsorted: 186 instances, 47 distinct values
  notable(23), live_show(20), gear(16), solo(15), personal(13),
  band(13), common(9), new_music(7), artist_page(6), song_page(6), ...
people: 81 instances — hunter_root(80), nick_root(1)
type: 62 — audio(30), mp3(30), poster(1), video(1)
source: 47 — reverbnation(42), distrokid(2), tiktok(2), instagram(1)
album: 44 — run_with_the_hunt(35), medusas_disco(7), arkansas(2)
exhibit: 19 — hunter_root(19) only
era: 15 — rwth(15) only
author: 3 — hunter_root(3)
platform: 3 — youtube(3)
scope: 3 — hunter_root(3)
year: 2 — 2023(2)
song: 2 — reverend(2)
artifact_kind: 2 — thumbnail(1), transcript(1)
content_kind: 1 — official(1)
```

Two findings load-bearing for §4:

1. **`source:` already has multi-source breadth** (reverbnation,
   distrokid, tiktok, instagram). Multi-source acquisition is
   *historically attested* in the catalog — just at a low cadence. The
   v1 acquisition layer scales this up, it doesn't introduce it.
2. **`unsorted:` (186 instances, 47 distinct values) is the largest
   namespace and it's retired.** Several of the values (`live_show`,
   `gear`, `notable`, `new_music`, `artist_page`, `song_page`) read as
   meaningful semantic content that wants a real namespace. The
   acquisition layer should NOT keep filling `unsorted:`. New auto-tags
   pick a non-retired tier-1 or tier-2 namespace, or propose a new one
   (operator approves before the rule lands).

### 1.5 Repository HEADs at audit time

- **Museum:** `76d49c3` (`docs: deploy run report 2026-05-23, Phase C × 2 deploys`) — matches brief expectation. Working tree clean for tracked files; 22 commits ahead of `origin/main`.
- **MV:** `f08bfa0` (`feat(c3-ingest): HEIC transcoding policy + helper`) — one commit past the ingest audit's `0a9e953`. C3 from the audit's §5.2 roadmap has landed.
- **HR:** `af1486a` (`docs: yt_archive_capture.py — update STATUS_ENUM reference to post-Phase-0.1 MV state`) — matches brief expectation.
- **Production:** `https://weird.baby/hr` returns HTTP 200 with `Sec-Fetch-Mode: navigate` headers (1119-byte SPA shell, cf-cache HIT). PASS.

PASS overall. Going-in state intact; the C3 commit is informative and
documented above.

---

## §2 — Per-source acquisition map

### 2.1 YouTube — full detail

#### 2.1.1 What YT exposes publicly

YouTube exposes four meaningfully distinct surfaces:

1. **Watch page** (`https://www.youtube.com/watch?v=<video_id>`) —
   public HTML. Carries `ytInitialPlayerResponse` JSON-in-script
   (title, channel id, channel name, upload date, description, duration,
   view count, like count if public, available formats). Anonymous
   GET works.
2. **Thumbnail CDN** (`https://i.ytimg.com/vi/<video_id>/{maxres,hq,mq,sd}default.jpg`) —
   anonymous, no auth, JPEG bytes. `maxresdefault.jpg` is the
   highest-quality available (1280×720); `hqdefault.jpg` always exists
   as fallback. Same SHA across re-fetches makes content-addressed
   storage work cleanly.
3. **Channel page** (`https://www.youtube.com/@<handle>`,
   `/channel/<channel_id>`, `/c/<vanity>/videos`) — public HTML +
   `ytInitialData` JSON-in-script. Lists uploads in reverse-chronological
   order, paginated via continuation tokens. The current crawler
   bypasses this surface by going through the Data API instead.
4. **YouTube Data API v3** (REST, `googleapis.com/youtube/v3/...`) —
   keyed access. The crawler uses key `AIzaSyD...JdcP4` (visible
   plaintext in `yt_research/yt_crawler.py:5` — a hygiene item; the
   key is operator-side and not load-bearing for security since YT
   API keys can be referrer-restricted and quota-limited). Free tier:
   10,000 quota units/day; a `search.list` call costs 100 units, a
   `playlistItems.list` costs 1 unit, a `videos.list` for stats costs
   1 unit per ≤50 ids. Channel-walk over 208 videos costs ~10 units
   (paginate uploads playlist + batched stats).

Mike's prior crawler (`yt_research/yt_crawler.py`) demonstrates path
1+3 are sufficient for *discovery* — no auth, no scraping headaches
modulo quota. `yt_archive_capture.py` demonstrates path 1+2 are
sufficient for *per-video capture* (it scrapes the watch page HTML
for metadata + fetches the maxres thumbnail directly).

#### 2.1.2 What requires auth / Mike-in-the-loop

For pure discovery + metadata: nothing. For transcript fetching:
`youtube-transcript-api` (pip package, anonymous) handles auto-captions
+ community captions when they're public. The capture log shows
transcript fetch succeeds for `7Lttb_59EYw` (36 segments, 768 chars,
auto_captions, en).

For private / age-gated / region-locked videos: not in scope. HR's
catalog is exhibit-public; nothing to capture from behind a gate.

For comments / engagement signals: requires API. Not in scope for v1.
P4-02 ("Fan Voice / Comment Word Analysis") in HR's BACKLOG.md is the
natural home; deferred.

#### 2.1.3 Artifact shape (LOCKED by `tools/youtube-ingest-schema.md` v1.1)

Per `youtube-ingest-schema.md` §3 (2026-05-08, operator-locked posture):
each video produces a cluster of artifacts, registered in order:

| # | Type | Storage mode | media_type | Pills (LOCKED) | Bytes? |
|---|---|---|---|---|---|
| 1 | `youtube_video_page` (parent) | `url_only` | `link` | `platform:youtube`, `scope:hunter_root`, `author:hunter_root`, `content_kind:<variant>` | description in `extracted_text` |
| 2 | `youtube_thumbnail` | `vaulted` | `photo` | `platform:youtube`, `scope:hunter_root`, `author:hunter_root`, `artifact_kind:thumbnail` | JPEG bytes under `intake/drop/yt-staging/<vid>/thumb.jpg` |
| 3 | `youtube_transcript` | `url_only` | `text` | `platform:youtube`, `scope:hunter_root`, `author:hunter_root`, `artifact_kind:transcript` | transcript in `extracted_text` |
| 4 | `youtube_page_save` (optional) | `vaulted` | `link` | `platform:youtube`, `scope:hunter_root`, `author:hunter_root`, `artifact_kind:page_save` | full HTML under `intake/drop/yt-staging/<vid>/page.html` |
| 5 | `youtube_channel_card` (per-channel, not per-video) | `url_only` | `link` | `platform:youtube`, `scope:hunter_root`, `author:hunter_root`, `artifact_kind:channel_card` | channel description in `extracted_text` |

`content_kind:` for the parent is one of `{official, live, lyrics, cover}`
(museum-side variant taxonomy, locked May 2026). The CLI wrapper
validates this against SPINE before invoking the capture script.

Per PHASEC §7.5 (re-read postures rule), this cluster shape is NOT
re-litigated as a §5 question. The schema is the operator-locked rule.

#### 2.1.4 ToS / legal posture

YouTube's ToS permits anonymous viewing of public content. The Data
API key is legitimate (Mike's own key). Thumbnail bytes are served
from a public CDN with no auth. Watch-page scraping is grey-area at
scale — YouTube periodically tightens, but Mike's archiver runs at a
hand-typed cadence (5 captures in 11 days), nowhere near rate-limit
territory. Transcript fetching via `youtube-transcript-api` parses the
same public payload the YT web player uses.

**Posture**: anonymous, low-cadence, public-content-only. No auth
escalation, no logged-in scraping. If volumes ever require it (they
won't at HR's scale), the Data API has free tier headroom.

#### 2.1.5 Surface-by-surface acquisition decision

| Acquisition need | Surface used today | Status |
|---|---|---|
| Channel-wide video list | Data API v3 via `yt_crawler.py` | Works. 208 videos discovered. |
| Per-video metadata | Watch-page HTML scrape via `yt_archive_capture.py` | Works. |
| Thumbnail bytes | `i.ytimg.com/.../maxresdefault.jpg` | Works. 56,471 bytes for `7Lttb_59EYw`. |
| Transcript text | `youtube-transcript-api` | Works when installed. Capture log #1 shows pip-install reminder when missing. |
| Page-save HTML | Direct GET on watch URL | Code exists; gated by `--page-save` flag. |
| Channel card | Not yet implemented | Per `youtube-ingest-schema.md` §3 — channel-scope, one row per channel. v1 would register `UCB4vVgc_wXYr8l2Pbw6WwsQ` for Hunter Root once. |
| Fan-uploaded discovery | `yt_research/fan_yt.json` (175 results from a search-walk) | Data exists. Whether to ingest is §5.3. |

#### 2.1.6 Bulk-capture flow (proposed v1 shape)

The end-state Mike's framing implies:

```
[discovery]              [filter]               [capture]
yt_crawler.py             →  208 videos       →  yt_archive_capture.py
→ channel_videos.json         (minus already-     (per video, per the
                               ingested per          existing CLI
                               docs/ingest-          interface, with
                               log.md)               album + track
                                                     + variant from
                                                     SPINE)
```

Three implementation shapes available:

- **A. Wrapper script** (`tools/yt-ingest-batch.mjs` or
  `tools/yt-bulk.py`): reads `channel_videos.json`, cross-references
  `docs/ingest-log.md`, prompts operator for {album, track, variant}
  per uncaptured video. Mike-augmented — semi-automated, operator
  picks the taxonomy per video.
- **B. SPINE-driven**: reads `src/data/artists/hunter-root.js` SPINE
  for each album's tracks → each track's `videos[]` array →
  cross-references against `channel_videos.json` by `ytId`. Anywhere
  SPINE has a `ytId` not yet in `docs/ingest-log.md`, invoke
  `yt-ingest.mjs` with the SPINE-derived flags. Fully automatic for
  SPINE-known videos. Operator-augmented for unknowns.
- **C. Hybrid**: SPINE-driven for what SPINE knows, operator-augmented
  for the rest. Most likely the right shape — it leverages the existing
  variant taxonomy work without leaving unknowns stranded.

Implementation Claude picks one once §5 settles. Shape C is the
audit's prediction.

### 2.2 Instagram

#### 2.2.1 What IG exposes publicly

IG's public surface has degraded materially over the past 18 months:

- **Profile page** (`https://www.instagram.com/<handle>/`) — public
  HTML but heavily client-rendered. The pre-rendered HTML contains
  `<meta property="og:*">` tags (og:title, og:description,
  og:image — usable for a profile card) but the actual post list is
  JS-loaded.
- **Post permalink** (`https://www.instagram.com/p/<shortcode>/`) —
  public HTML for public accounts; `<meta>` tags include og:image
  (the post's primary image), og:title (caption first line),
  og:description (caption). Caption + image accessible anonymously
  via og scrape. Multi-image carousels: only the first image's og
  is reliable.
- **Reels permalink** (`https://www.instagram.com/reel/<shortcode>/`) —
  same shape as posts; the og:video extension carries the MP4 URL
  (which itself is short-lived signed).
- **Stories** — not public. Out of scope.
- **Anti-bot posture**: aggressive. IG blocks IPs that look like
  scrapers and serves login-walls to non-browser user-agents at
  scale. Hand-typed cadence works; automated polling does not.

Hunter Root's IG: `@hunterrootofficial` (50K followers per
HR_SYSTEM.md §13). Mike's: `@papa_weird.baby`.

#### 2.2.2 What requires auth / Mike-in-the-loop

For *any* automated IG poll at non-trivial cadence: a logged-in
session with Selenium / Playwright. HR has the infrastructure
adjacent: `fb_poster/chrome_profile/` (~278 MB ignored Selenium state
for FB). An IG-side analog would need its own Chrome profile,
authenticated to Mike's `@papa_weird.baby` (the moderator account,
not Hunter's).

For *one-at-a-time* operator-triggered capture: a browser extension
or bookmarklet that fires on the page Mike is viewing. The MV
ecosystem already has the "WB Capture" Chrome extension (per ingest
audit §1.5 — Path C) which dumps `mv-capture-<timestamp>.json` into
`Downloads/` and gets picked up by `ingest_engine.py scan`. An IG-side
addition to this extension would be the lowest-friction approach.

**Posture for v1**: Mike-augmented via Chrome extension. Mike browses
to a post he wants captured; one click; the extension dumps a capture
JSON; MV picks it up via Path C. Most of the infrastructure exists;
the extension's IG selectors need authoring.

#### 2.2.3 Artifact shape

For a post: parent `instagram_post` (link, `url_only`, source_url +
caption text in extracted_text, post_date from `<meta property="article:published_time">`),
optional child `instagram_post_image` (photo, `vaulted`, og:image
bytes downloaded). For a multi-image carousel: one parent + N children;
the children would need DOM scraping the carousel slides (the
extension's job) — og scrape gets only #1.

For a Reel: parent `instagram_reel` (link, `url_only`, caption +
permalink), optional `instagram_reel_video` (video, `vaulted` or
`url_only` if the og:video URL is preserved — though signed URLs
expire, so `vaulted` is the right call for preservation).

For a Story (out of scope today): would be ephemeral; storage_mode
`vaulted` mandatory.

#### 2.2.4 Existing tooling that informs §3

- `tools/tools/fetch_picuki.py` (~890 bytes) — a Phase 2-era stub that
  fetched HR's profile via picuki.com (an IG mirror). Picuki has since
  added anti-bot measures of its own; this script is bit-rotted.
- `docs/HOMESTEAD_INSTAGRAM_SPEC_v0.2.md` (13 KB) — an OUTBOUND IG
  spec for a weekly Reel video produced by Mike to drive traffic to
  the FB fan group. Not capture. Useful only as evidence that Mike
  has thought about HR's IG presence; not load-bearing for §2.2.

### 2.3 TikTok

#### 2.3.1 What TT exposes publicly

- **Profile page** (`https://www.tiktok.com/@<handle>`) — public HTML
  with `<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__">` carrying a
  large JSON blob including the most recent videos. Anonymous GET works.
- **Video permalink** (`https://www.tiktok.com/@<handle>/video/<id>`) —
  public HTML; the universal-data script carries video metadata
  (caption, music, duration, stats); og:video URL is signed and
  short-lived.
- **Anti-bot posture**: aggressive but currently less aggressive than
  IG. TT's signed URLs expire faster (~hours).

Hunter Root TT: `@hunterrootmusic` per the watch-page descriptions
of his official videos. Live data has 2 TT artifacts already
(`source:tiktok` ×2) but only 1 IG (`source:instagram` ×1), so the
historical capture rate is comparable across platforms.

#### 2.3.2 What requires auth / Mike-in-the-loop

For automated polling at any cadence: real auth. TikTok aggressively
fingerprints. No safe automated path for v1.

For one-at-a-time browser-extension capture: the same shape as IG
works. Anonymous fetch on Mike's already-loaded page; selector
authoring per TT's current DOM.

Video downloads: `yt-dlp` handles TikTok URLs anonymously today.
Whether to bundle this with the extension or call it server-side from
`ingest_engine.py` is an implementation-time decision.

#### 2.3.3 Artifact shape

Parent `tiktok_video_page` (link, `url_only`, caption in
extracted_text), optional `tiktok_video` (video, `vaulted` via yt-dlp
fetch), optional `tiktok_audio` (audio, `vaulted` — TT pulls music
samples that may be standalone-interesting). Variant taxonomy:
overlap with `content_kind:` from YT's vocabulary (`official` / `live`
/ `lyrics` / `cover`) — but TT's grain is shorter than YT's, so
`official` typically doesn't apply; `live` might (live-streamed snippets),
`cover` definitely does (fan covers are TT's home turf).

### 2.4 Facebook + FB Reels

#### 2.4.1 What FB exposes publicly

FB's public surface depends on the visibility setting:

- **Public group post** (HR's Homestead group:
  `https://www.facebook.com/groups/1093712869379957/permalink/<post_id>/`) —
  visible without auth only if the group is set to public. Per
  PROJECT.md, Homestead is currently a 114-member group; visibility
  is operator-set on FB's side. If public-only-content, anonymous
  scrape may work.
- **Public page post** (`facebook.com/<page>/posts/<id>`) — public.
  Per HR_SYSTEM.md §13: Hunter Root's official FB is at
  `facebook.com/hunterrootmusic`. Anonymous GET works for that page's
  public posts.
- **Reels** (`facebook.com/reel/<reel_id>`) — public for FB Reels;
  same scraping surface as the video posts.
- **Anti-bot posture**: very aggressive. FB serves login-walls to
  most non-browser user agents after a small number of requests.
  Selenium with a logged-in profile is the only reliable path.

Live evidence in MV: 1 artifact carries `source:facebook` via the
extension-capture path. The other FB pieces in the catalog appear to
have come in via WB Capture (Path C from the ingest audit).

#### 2.4.2 What requires auth / Mike-in-the-loop

For anything beyond og-scrape of fully public pages: real auth. HR
already has the auth infrastructure for the OUTBOUND side
(`fb_poster/chrome_profile/`). Re-using that Chrome profile for
INBOUND capture is feasible but risks Mike's session — the FB sync
might get flagged if the same profile is both auto-posting and
auto-scraping at scale.

Cleaner: the same WB Capture Chrome extension Mike uses on his own
browsing covers FB posts one at a time. Path C is already wired to
FB-specific selectors per the FB-bridge flow in MV (SPEC §11). The
existing extension capture infrastructure handles FB; the acquisition
layer extends Path C selectors, not the auth surface.

#### 2.4.3 Artifact shape

Parent `facebook_post` (link, `url_only`, caption in extracted_text,
post_date from FB's data attributes). Children depend on what the post
contains: `facebook_post_image` (photo, vaulted), `facebook_post_video`
(video, vaulted). For Reels: `facebook_reel_page` parent +
`facebook_reel_video` child.

The FB-bridge flow (per SPEC §11) is currently the ONLY path Mike
uses for FB inbound; the brief surfaces no need to change that.

### 2.5 Open web (Bandcamp, music blogs, Songkick, generic search)

#### 2.5.1 What the open web exposes publicly

The open web is the easiest acquisition surface — pages are anonymous
by default, og-meta tags are widespread, and HR-relevant destinations
are small in number:

- **Bandcamp** (`hunterrootmusic.bandcamp.com` per Hunter's YT video
  descriptions) — public discography pages, per-track pages, full
  album pages. `<meta>` tags rich (album title, artist, release date,
  track count). MP3 download URLs are pay-walled but the page metadata
  is free.
- **Music blogs** (varies) — anyone covering Hunter Root in a write-up
  or review. Discovery is the hard part; per-page capture is trivial
  once a URL is known.
- **Songkick / Bandsintown** — tour data. Hunter Root has live shows;
  these aggregators expose them publicly with og-meta.
- **Generic search hits** — "Hunter Root" mentioned in fan blogs,
  Reddit (already pre-captured in `fan_reddit.json`, 40 KB), forum
  posts, etc.

#### 2.5.2 What requires auth

None for og-scrape of these surfaces. Bandcamp's download is paywalled
but the metadata page is free.

#### 2.5.3 Artifact shape

Generic `web_page` (link, `url_only`, og:title → description_short,
og:description → description_long, og:image → optional `web_page_image`
child). For Bandcamp specifically: `bandcamp_release` /
`bandcamp_track` could carry richer fields (track count, release date,
streaming embed URL).

This is the broadest source category by far. v1 likely treats it as a
single generic "operator pastes a URL into a form, MV captures it"
flow — same shape as the existing extension-capture / link-register
pattern.

### 2.6 Other sources surfaced from HR's existing tooling

#### 2.6.1 ReverbNation (legacy)

The 15 RWTH MP3s + 7 MD audio artifacts in MV came from RN. The
`tools/rn_archive_extract.py` script in MV's `_cowork/` was the
producer of the filename grammar the ingest audit surfaced (§2.6
of the ingest audit). RN itself is fading as a platform; HR may not
have new content there. Treat as **legacy completed source** — the
acquisition layer doesn't need to re-touch it.

#### 2.6.2 Reddit (pre-captured fan data)

`yt_research/fan_reddit.json` (40 KB) — pre-captured fan discussion
threads. Inverted: Reddit posts that mention "Hunter Root" or similar.
Discovery is via Reddit's public API (anonymous, json suffix on
URLs). Capture is per-thread og-scrape.

Treated as a §2.5 sub-shape; not separately bucketed in §3.

#### 2.6.3 Other platforms the live data hints at

`source:distrokid` ×2 in the live tag corpus suggests HR has at least
2 artifacts from DistroKid (Hunter's distributor). Future flow if
DistroKid exposes anything beyond release metadata (it largely doesn't
— it's a B2B distributor).

`source:spotify` is conspicuously absent. Spotify's open web app
exposes track pages with public og-meta; could be a future source.

---

## §3 — Automation vs Mike-augmentation split

Per Mike's framing ("split the list between the two and focus on YT
automation first"), each source from §2 is assigned to one of three
buckets. The "why" for each is one sentence — feasibility is the
ranking criterion.

| Source | Bucket | Why |
|---|---|---|
| **§2.1 YouTube** | **AUTO** (channel-walk); MIKE-AUGMENTED for variant assignment when SPINE doesn't know | The Data API + public watch-page + thumbnail CDN are anonymous; capture is proven; the only judgment per video is `{album, track, variant}` and SPINE answers that for known videos. |
| **§2.2 Instagram** | MIKE-AUGMENTED | IG's anti-bot makes any automated poll fragile; Mike already has the Chrome-extension Path C surface; one-click capture during his normal browsing is the lowest-friction shape. |
| **§2.3 TikTok** | MIKE-AUGMENTED | Same anti-bot story as IG with shorter signed-URL windows; same one-click extension pattern. |
| **§2.4 Facebook + FB Reels** | MIKE-AUGMENTED | FB's anti-bot is the most aggressive; Mike already runs Selenium for outbound posting and the existing FB-bridge / Path C captures are the right surface. |
| **§2.5 Open web (Bandcamp / blogs / Songkick)** | MIKE-AUGMENTED with AUTO fast-path for known destinations | Public og-scrape is trivially anonymous, but discovery of unknown content is judgment-heavy; auto-fast-path for "operator pastes URL" + Mike-augmented for "find what's out there." |
| **§2.6.1 ReverbNation** | DEFERRED (legacy complete) | Source set already in MV; no fresh content expected. |
| **§2.6.2 Reddit** | MIKE-AUGMENTED | Anonymous JSON API works, but signal/noise filtering needs operator judgment. |
| Discovery of unknown HR-adjacent content | DEFERRED | Pure search-walk noise (per `fan_yt.json` — top result is unrelated KPop content) is too noisy to auto-ingest; v1 either tightens search queries (§5.1) or defers. |
| Cross-source semantic dedup | DEFERRED | M3 (content-hash dedup) handles byte-identical files; semantic-equivalence ("this YT video IS this Bandcamp track") is its own scoping problem. |
| Active monitoring / alerts on new HR content | DEFERRED | Cadence question is §5.2; alerting is a v2+ feature. |

**The §3 deliverable in one line:** YT → auto-first with operator
fallback for unknowns; IG/TT/FB → extension-capture Mike-augmented;
open web → operator-paste + auto-scrape; everything else deferred.

---

## §4 — Tagging and curation specification

Mike's framing: *"automatically heavily tagged, sorted, etc. I look
them over, adjust if necessary, and release as warranted."* This
section locks what "heavily tagged" means for HR specifically. The
acquisition layer SUGGESTS; the operator RELEASES.

### 4.1 Per-source tag rules (mechanical)

For every captured artifact, the acquisition tool applies tags
deterministically from the source:

| Source | Auto-applied tags |
|---|---|
| YouTube | `source:youtube`, `exhibit:hunter_root`*, `people:hunter_root`*, plus the cluster's locked pills per `youtube-ingest-schema.md` (`platform:youtube`, `scope:hunter_root`, `author:hunter_root`, `content_kind:<variant>` on parent, `artifact_kind:<kind>` on children). |
| Instagram | `source:instagram`, `exhibit:hunter_root`*, `people:hunter_root`* |
| TikTok | `source:tiktok`, `exhibit:hunter_root`*, `people:hunter_root`* |
| Facebook | `source:facebook`, `exhibit:hunter_root`*, `people:hunter_root`* |
| Bandcamp | `source:bandcamp`, `exhibit:hunter_root`*, `people:hunter_root`* |
| Reddit (fan) | `source:reddit`, `exhibit:hunter_root`*, plus per-content per §4.2 |
| Open web | `source:web`, the exhibit + people tags conditional on operator confirm |

\* `exhibit:hunter_root` is **proposed** at ingest, **applied on
release**. Per the ingest audit's C1 rule pattern + Mike's framing
("look them over, ADJUST if necessary, and release"), exhibit-routing
is the gate before the artifact reaches the museum. Acquisition does
NOT auto-release. Configurable rule lives in `core/ingest_rules.py`
(per ingest audit §5.2 C1).

\* `people:hunter_root` is applied on receipt — every artifact captured
*because we were looking for Hunter Root* is *about* Hunter Root by
construction. Reversible if a capture turns out to be a false positive
(operator removes the tag in the inbox).

**Drift surfaced (per §1.4):** the YT cluster's pill set
(`platform:youtube`, `scope:hunter_root`, `author:hunter_root`,
`content_kind:*`, `artifact_kind:*`) uses **five retired-2026-05-19
namespaces**. The acquisition layer applies them as-is per the
`youtube-ingest-schema.md` v1.1 contract. Whether MV's vocabulary
gets re-aligned (revive these namespaces, or migrate the YT schema
to use tier-1/2 namespaces) is an MV-side decision attached to the
ingest audit's roadmap, not this brief.

### 4.2 Per-content-type tag rules (mechanical)

Independent of source, content extracted at capture time generates
tags:

| Content cue | Auto-applied tags |
|---|---|
| YT watch page upload year | `year:<YYYY>` (already populated for the 1 live YT artifact: `year:2023`) |
| YT video title pattern `"<Artist> - <Title> (<Variant>)"` | `song:<slugified_title>` (already attempted: `song:reverend` for `7Lttb_59EYw`) |
| YT video on a recognized SPINE album | `album:<spine_album_id>` (e.g. `album:arkansas` for Reverend) |
| YT description contains `"live at"` / venue name | `venue:<slugified_name>` PROPOSED to operator (low confidence; operator-confirms) |
| Audio file with ID3 album tag | `album:<slugified>` (per ingest audit M2; not yet landed) |
| Photo with EXIF date | `year:<YYYY>` |
| Caption text contains a tracked SPINE track title | `song:<slug>` PROPOSED |
| Caption text contains a tracked SPINE album id | `album:<slug>` PROPOSED |
| Capture has a transcript | (no extra tag — `artifact_kind:transcript` per cluster already) |
| Cover by an attributed third party (cue: `--credit` flag) | `credit:<name_slug>` PROPOSED (NEW namespace — not currently in vocabulary; operator confirms before this becomes a rule) |
| Live recording cue (caption / variant / venue) | `format:live` PROPOSED (NEW namespace candidate; or fold into `content_kind:live`) |

**Three new-namespace candidates the audit surfaces** (these are
NOT §5 questions — they're proposals for the implementation session
to refine):

1. `credit:<name_slug>` — cover-artist credit per museum's locked-May-2026
   variant taxonomy when `content_kind:cover`.
2. `format:live` — live recording marker that crosses YT (a `live`
   variant), TT (live snippet), FB (live stream), audio (live-take MP3).
3. `era:<slug>` — already exists (`era:rwth` ×15 from Phase C).
   Per ingest audit C2 rule pattern. The acquisition layer proposes
   `era:` from SPINE-derived album.

**Avoid `unsorted:` namespace** in any new auto-tagging — it's retired.
If a tag would naturally fall there, propose instead a new tier-3
namespace via operator approval (the "operator-locked rule" pattern).

### 4.3 The "exhibit-worthy" gate

O2 from the ingest audit: *"Is this artifact exhibit-worthy? Not every
HR archive item belongs in the museum."* Mike's framing reaffirms:
*"I look them over, adjust if necessary, and release as warranted."*

**Posture: the acquisition layer SUGGESTS exhibit candidacy; the
operator RELEASES.** Operationally:

- Acquisition POSTs each artifact with `status='vault'` (not `released`)
  and `exhibit:hunter_root` *in the proposed tags but not yet committed
  to release*. The C1 rule from the ingest audit (`intake/drop/<HR-shape>`
  → `exhibit:hunter_root`) auto-applies the tag; release is a separate
  operator click.
- The MV inbox + vault grid surface the captured artifacts for review.
  The operator's job is to look at each, adjust tags if needed (per
  §4.1 + §4.2 proposals), and click Save & Release (or Scrap).
- A future C5 rule (per ingest audit §5.2) could auto-release subsets
  with high-confidence criteria (e.g. `source:youtube AND content_kind:official
  AND album:* matches SPINE`). Not v1.

The acquisition layer's contribution to making this fast: well-seeded
inbox rows. Description short pre-filled from og:title or watch-page
title; description long pre-filled from og:description or description
text; tags pre-filled from §4.1 + §4.2 rules; parent/child linkage
pre-set. Mike opens an artifact, scans 3-5 fields, decides Save &
Release or Scrap. The acquisition layer makes the *review* fast, not
the *acquisition* fast — the latter doesn't need Mike present.

### 4.4 Dedup keys per source

| Source | Dedup key | Notes |
|---|---|---|
| YouTube | `yt_video_id` (11-char canonical id) | Already keyed by `tools/yt-ingest.mjs`'s SPINE-cross-reference; `docs/ingest-log.md` carries the history. |
| Instagram | post shortcode (`/p/<shortcode>/`) or reel shortcode (`/reel/<shortcode>/`) | Append `instagram_shortcode` to manifest schema. |
| TikTok | video id from URL (`/video/<id>`) | Append `tiktok_video_id`. |
| Facebook | post permalink id | More fragile (FB rotates URLs); fall back to canonical_url hash if needed. |
| Bandcamp | track/album URL (canonical) | Bandcamp URLs are stable. |
| Reddit | thread permalink (`/r/<sub>/comments/<id>/`) | Stable. |
| Open web | canonical URL | sha256 of canonical URL as the dedup key. |
| Byte-identical files across sources | SHA-256 of file bytes | M3 from ingest audit (not yet landed) handles this layer; per-source dedup keys + M3 are independent gates. |

Per-source dedup keys are stored in the `mediavault_manifest.json` so
re-running the acquisition tool is idempotent (the script checks the
manifest's `mv_id` field per artifact; non-null = skip — same pattern
`yt_archive_capture.py` already uses).

---

## §5 — Operator decisions

Three real binary choices the audit cannot answer. Surfaced ONE AT A
TIME per GATE 5; folded into §9 as Mike resolves.

Implementation cannot proceed past these. The audit checked each
question against `youtube-ingest-schema.md`, `HR_SYSTEM.md`,
`PROJECT.md`, `BACKLOG.md`, the ingest audit, and the deploy run
report; none of these locks the answer.

### 5.1 — YT discovery surface

Mike's existing `yt_research/` carries evidence of BOTH discovery
modes:
- Channel-walk: 208 videos in `channel_videos.json`, sorted by views.
- Search-walk: 175 results in `fan_yt.json` (each carrying a `query`
  field that hints what was searched).

The v1 YT acquisition layer needs one of:

- **Option A: Channel-walk only.** Discovery is bounded by Hunter
  Root's channel uploads (`@hunterrootmusic`). 208 known videos; new
  uploads appear at Hunter's pace. Fan content is ignored at the
  discovery layer.
- **Option B: Channel-walk + search-walks.** Discovery includes
  `q="Hunter Root cover"` / `q="Hunter Root live"` / etc. The
  `fan_yt.json` shape suggests this work has been prototyped. Fan-
  uploaded content gets discovered automatically (orthogonal to §5.3,
  which is about whether to ingest it).

If B: what queries? Pure HR name? HR name + venue list (e.g. `"Hunter
Root" Lancaster` / `"Hunter Root" Brooklyn`)? HR name + collaborator
names (Spencer Martin, Acid Palms, etc., per the Reverend video
description)?

### 5.2 — Discovery cadence

Three shapes:

- **One-shot.** Mike runs the acquisition tool once per session;
  it backfills uncaptured videos against the current discovery set.
  No scheduler.
- **Recurring (cron / scheduled-task).** A scheduled job re-runs
  the crawler weekly / daily / etc. New uploads land in the MV
  inbox between Mike's sessions.
- **On-demand (operator-triggered).** Mike pastes a URL or types a
  command; the tool runs that single capture immediately.

These are NOT mutually exclusive; a v1 might support on-demand +
one-shot bulk + defer recurring to v2. The question is what v1
SHIPS. The cadence picks the engine's surface (CLI vs daemon vs
scheduled task).

### 5.3 — Fan-uploaded content

`fan_yt.json` has 175 results. The top result is `kpop demon hunters
cosplay` — false positive. Many results below it are likely legitimate
covers, reaction videos, live captures of HR shows uploaded by
attendees, etc.

UX-impactful question: **does the museum surface fan content?**

- **Option A: In-scope.** Fan content is part of HR's exhibit. Covers
  (`content_kind:cover`, `--credit <name>`) get released alongside
  official videos. The museum's variant taxonomy already supports
  `cover` (locked May 2026, per CLAUDE.md) and BACKLOG.md P3-03
  ("Cover Artists program — Dedicated space for fan covers — curated,
  credited") is the post-v1 framing. Fan-content-in-scope makes
  acquisition harder (search-walk noise, credit-handling complexity,
  rights questions) but unlocks a museum surface that's already named
  in HR's backlog.
- **Option B: Out-of-scope for v1.** Fan content is acquired but
  stays in `status='vault'` indefinitely; the museum surfaces only
  HR-authored content (`author:hunter_root`). Fan content arrives
  for future review when a Cover Artists section is built. Simpler;
  defers the cover-credit + rights work; museum stays tightly curated.
- **Option C: Case-by-case operator gate.** Fan content gets ingested
  with `status='vault'` + a proposed flag (`exhibit:hunter_root` not
  applied at acquisition); operator reviews per-fan-content and
  decides release-or-archive case-by-case. Most flexible; highest
  operator-time cost.

This question crosses HR's hard rules: §10 ("Hands off Hunter and Ed
— work with publicly documented content only") permits ingest of
fan content (it's public). §11 ("Links only — no direct photo posts
without explicit permission") permits link-only fan content. Rights-
clearance is the unresolved layer.

---

## §6 — Sequencing

Mirrors the ingest audit's three-bucket pattern.

### 6.1 Mechanical (no operator judgment — engine implements)

- **A1. YT bulk channel-walk acquisition.** Cross-reference
  `yt_research/channel_videos.json` against `docs/ingest-log.md`;
  invoke `yt-ingest.mjs` per uncaptured video. Uses SPINE for
  variant assignment where SPINE knows; surfaces unknowns to operator
  (this part is augmented — see A2).
- **A2. YT-from-SPINE auto-capture.** For each SPINE entry's
  `videos[]` array that has a `ytId` not yet in `docs/ingest-log.md`,
  auto-invoke the capture. SPINE knows the album / track / variant /
  credit. Zero operator input per video for SPINE-known.
- **A3. Generic web og-scrape on operator-pasted URL.** Single-page
  flow: operator pastes URL → tool fetches → og-meta extracted →
  Path B POST → vault. Lowest-friction open-web acquisition.
- **A4. yt-dlp-based child capture for TT/IG/FB video bytes** (when
  the extension capture surfaces a video URL). Mechanical given the
  URL.
- **A5. Manifest-based idempotency** across all source types. Per
  `yt_archive_capture.py`'s pattern: each captured artifact has an
  `mv_id` field in its manifest; re-runs skip non-null entries.

### 6.2 Configurable (operator sets policy once, engine applies)

- **B1. Per-source auto-tag rules** (§4.1 table). Lives in
  `core/ingest_rules.py` (or museum-side equivalent), one short
  table. Operator-revised when a new namespace is added.
- **B2. SPINE-derived tag propagation rules** (§4.2). The capture
  consults SPINE for title/album mapping; the rule is "if SPINE has
  this `ytId`, apply its album+track tags." Configurable in the
  sense that SPINE itself is the config.
- **B3. The §5.1 discovery surface choice** (whatever Mike picks).
  Configures `yt_crawler.py`'s invocation set.
- **B4. The §5.2 cadence choice.** Schedules the discovery run, or
  doesn't.
- **B5. The §5.3 fan-content policy.** Determines whether
  fan-discovered URLs go to ingest, get held in a queue, or get
  dropped.
- **B6. New-namespace approvals** (`credit:`, `format:`, etc.). The
  operator-locked-rule pattern: each new namespace gets a one-line
  rule citation in code comments + a SPEC.md or vocabulary update.
- **B7. Blocklist** (URLs / handles known to false-positive — e.g.
  the `kpop demon hunters cosplay` shape). Configures the
  discovery filter.

### 6.3 Operator-only (per-artifact human call)

- **O1. Release gate.** Same as ingest audit O2 + §4.3 above.
  Acquisition produces well-seeded inbox rows; release stays
  operator-driven.
- **O2. Description short / long final authoring.** Acquisition
  pre-fills from og / watch-page; operator polishes.
- **O3. Sensitive-content review** (identifiable minors,
  ongoing-legal content). Per UX_SPEC v0.3 §H "default-private,
  release explicitly."
- **O4. Per-fan-content judgment** (only if §5.3 = Option C).
  Case-by-case.
- **O5. Variant assignment for non-SPINE YT videos.** When the
  acquisition layer encounters a `ytId` not in SPINE,
  operator picks `{album, track, variant}` per the existing
  `yt-ingest.mjs` CLI surface.
- **O6. Credit assignment for `content_kind:cover`** content (only
  in scope if §5.3 = A). Operator names the cover artist.

### 6.4 Sequencing order

Smallest end-to-end loop first. The first work item is:

1. **YT bulk channel-walk acquisition v1** (mechanical A1 + A2,
   configurable B1 + B2 + B3, operator-only O1 + O5). Scope: capture
   the ~200 uncaptured videos from `channel_videos.json` against the
   current SPINE. Fan content out (defer to §5.3 resolution). Cadence
   on-demand only (defer recurring to §5.2 resolution). New namespaces
   not minted (use only existing tier-1/2 + the YT cluster's locked
   pills + the ingest audit's C1/C2 rules). This is the smallest
   coherent loop: discovery → filter → capture → inbox → operator
   review → release. Lands the entire HR YT channel in the museum
   inbox over ~one focused session for the operator (probably an
   afternoon of triage given ~200 videos).
2. **YT non-SPINE video handling.** Operator-augmented path for
   `ytId`s not in SPINE. Optional in v1 (could defer); recommended
   in v1 because SPINE coverage is partial.
3. **Open-web operator-paste fast-path (A3).** Lowest-friction
   extension to the second-easiest source category. Lands trivially
   on top of Path B + `_infer_media_type`.
4. **IG / TT / FB extension-capture extensions.** Selector authoring
   for the WB Capture Chrome extension. Per-source.
5. **§5.2's cadence decision implementation** (recurring scheduled
   task) if Mike answers anything other than "on-demand only."
6. **§5.3's fan-content decision implementation** if Mike answers
   anything other than B (out-of-scope for v1).
7. **New-namespace approval flow** (B6) for `credit:` / `format:` /
   etc., as they become needed by 5/6.
8. **Recurring monitoring / alerts** — deferred.

Each item is a focused, scoped work item — none requires a
multi-session program.

The order leverages what already works: YT capture is proven (5 logged
runs); `yt-ingest.mjs` is the wrapper; SPINE is the validation
source. The first work item is mostly *gluing the discovery layer to
the capture layer* — ~200 lines of orchestration code.

---

## §7 — Out of scope

- **Discovery cadence implementation** beyond what §5.2 settles.
- **Recurring search-walks** if §5.1 = Option A.
- **Fan-content release path** if §5.3 = Option B.
- **The non-YT sources' implementation** (this brief scopes them in
  §2/§3; per §6.4 they sequence after the YT first-work-item).
- **Cross-source semantic dedup.** M3 handles bytes; semantic-
  equivalence ("this YT video is the same content as this Bandcamp
  track") is its own scoping problem.
- **Rights clearance / DMCA posture** for fan content. HR_SYSTEM.md
  §10–§11 frame the hard rules; per-artifact rights decisions remain
  operator-only.
- **Active monitoring / alerts on new HR content.** Cadence question
  (§5.2) is upstream of this; alerts would layer on top.
- **MV vocabulary re-alignment** (the platform/scope/author/
  artifact_kind/content_kind retirement vs YT ingest schema mismatch
  — §1.4). MV-side decision attached to the ingest audit roadmap.
- **The ingest audit's M-track / C-track work** (M1–M8, C1–C5,
  O1–O5). Sequenced separately; the acquisition layer is a *client*
  of that work, not a re-shaping of it.
- **`fb_poster/` outbound flow.** This brief is about INBOUND
  acquisition only. The BACKLOG.md P2-01 "artifact saved automatically
  on send" idea — that's a separate work item.
- **`HrArchive.jsx` reconciliation** (carried forward from PHASEB
  §6.2, ingest audit §1.4). Dormant for v1.
- **Per-photo source aspect** (PHASEC §6.8). Cosmetic carry-forward.
- **`HOMESTEAD_INSTAGRAM_SPEC_v0.2.md`** — that's an OUTBOUND IG
  video spec, not an INBOUND IG capture spec. Not load-bearing for
  this brief.
- **Spotify, DistroKid, and other platforms the live data hints at**
  but Hunter doesn't actively use as primary distribution. Defer
  until evidence of fresh content there.
- **`tools/tools/` legacy file revival.** Phase-2-era scattered
  research, intentionally tracked but not on the active path.
- **Bit-rot cleanup on the legacy IG / picuki-based scripts.** Not
  blocking; not in this brief's scope.

---

## §8 — Verification (this brief)

**Read end-to-end:**

- `docs/INGEST_BEHAVIOR_AUDIT-20260522-182616.md` — format mirror.
  Read §0 (how to read), overall structure, §5 buckets, §5.4
  sequencing, §5.5 approval pattern.
- `docs/DEPLOY_RUN_REPORT-20260523-144857.md` — current run state.
  §8 next-session surface confirms no carry-forwards affect this
  scoping pass.
- `docs/PHASEC_RUN_REPORT-20260522-170000.md` — §7.4 operator-locked
  rule pattern, §7.5 re-read postures rule.
- `docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md` — shape
  reference: §1 inventory shape, §2 LOCKED technical decisions,
  §5 operator questions, §9 RESOLVED decisions inline.
- `tools/youtube-ingest-schema.md` (museum) — v1.1, 2026-05-08.
  Locked rule for YT artifact cluster shape; cited in §2.1.3 and
  §0 of this brief.
- `tools/yt-ingest.mjs` (museum) — CLI wrapper; SPINE validation;
  invokes the HR-side Python capture.
- `Hunter Root/STATE.md`, `PROJECT.md`, `HR_SYSTEM.md`, `BACKLOG.md`
  — operator framing, hard rules, prior backlog.
- `Hunter Root/tools/yt_archive_capture.py` — head 100 lines (file
  is 38 KB); docstring + USAGE + ARTIFACTS REGISTERED + STATUS
  DECISION block. Ingest audit §1.4 already documents the
  registration flow line-by-line; not re-read line-by-line here.
- `Hunter Root/yt_research/yt_crawler.py` — full read (85 lines).
- Sample `mediavault_manifest.json` for `7Lttb_59EYw` — full read.
- `capture.log` for `7Lttb_59EYw` — full read (5 runs over 11 days).
- `Hunter Root/docs/HOMESTEAD_INSTAGRAM_SPEC_v0.2.md` — first 120
  lines; confirmed it's OUTBOUND-only and not load-bearing.

**Skimmed / structurally inspected:**

- `Hunter Root/archive/` — file-type histogram + sample directory
  walks. Total ~112 MB, 92 files across reverbnation tree, 6 files
  across youtube tree.
- `Hunter Root/tools/tools/` — directory listing only. ~24 phase-2
  files, intentionally tracked but legacy.
- `Hunter Root/yt_research/channel_videos.json` — top-level shape +
  first item (208 entries; `{ytId, title, published, views}`).
- `Hunter Root/yt_research/fan_yt.json` — top-level shape + first
  item (175 entries; adds `channel`, `query`).
- Museum `docs/ingest-log.md` — full read (5 ingest runs to date).
- Sample `ARCHIVE.md` for `brain-cell_14767555` (RN tree) — for
  the per-album shape pattern.

**Queried (read-only) against `core/mediavault.sqlite` at MV HEAD
`f08bfa0`:**

- Full `vocabulary` table: 14 rows; 6 active tier-1/2 namespaces
  + 6 retired-2026-05-19 + 2 tier-1 (year/album/song unretired) +
  exhibit (retired but used). The retirement-date drift is the §1.4
  finding.
- Tag instances per-namespace via `json_each` over `artifacts.tags`:
  470 total instances across 14 namespaces. Distribution in §1.4.
- HR exhibit corpus: 19 released artifacts (15 audio + 3 photo + 1
  link); source breakdown reverbnation(15) / youtube(1) / local(1)
  / facebook(1) / null(1).
- `artifacts` table schema (26 columns).
- `source_platform` distinct value count across the whole DB.

**Tested:**

- `https://weird.baby/hr` HTTP HEAD with `Sec-Fetch-Mode: navigate`
  headers per PHASEC §7.1 lesson. Result: 200 OK, 1119-byte SPA
  shell, cf-cache HIT. PASS.

**Not tested in sandbox:**

- Live YT acquisition (any actual `yt_archive_capture.py` invocation).
  Out of scope (this is a scoping session, not implementation).
- Any IG / TT / FB DOM scrape. Source descriptions in §2 are from
  public-knowledge + the live tag data (`source:tiktok` ×2,
  `source:instagram` ×1, `source:facebook` ×1) plus the IG SPEC
  for context.

**Surfaces (surprises the brief reflects):**

- **HR is plural, not singular.** The brief framed "capture script"
  (singular); the inventory found three meaningfully distinct
  scripts (`yt_archive_capture.py`, `yt_crawler.py`, `fb_poster/poster.py`)
  plus the museum-side wrapper (`yt-ingest.mjs`). Reshaped §1.1.
- **YT acquisition is operational, not theoretical.** Five logged
  runs; 3 live MV artifacts. The brief's "focus on YT automation
  first" is therefore a bulk-extension of an already-working
  per-video flow, not a from-scratch build.
- **`channel_videos.json` has 208 videos discovered; 1 released.**
  The ground-truth gap is ~200 uncaptured HR-authored videos. v1's
  first work item closes most of it.
- **The YT ingest schema's pill namespaces are retired in MV's
  vocabulary as of 2026-05-19.** Architectural drift surfaced for
  Ops; not §5-blocking.
- **`unsorted:` namespace has 186 instances with 47 distinct values,
  and it's retired.** The new acquisition layer must not fill it;
  instead, it should propose new tier-3 namespaces (operator-approved)
  when a tag wants to be created.
- **The fb_poster system is OUTBOUND, not capture.** Brief framing's
  "FB, Reels" mention is INBOUND ingest of HR-related FB content,
  not the existing outbound system. Clarified throughout §2.4.
- **The IG SPEC is OUTBOUND-only.** A weekly Reel video Mike produces
  for HR's IG, not an IG capture spec. Discovered and dismissed as
  not relevant to acquisition.
- **Mike is NOT Hunter.** HR_SYSTEM.md §3 + §14 hard rules.
  Acquisition must respect: public content only; hands off Hunter
  and Ed; links-only by default; medusasdisco.com never linked.
  Threaded into §4.

---

## §9 — Operator decisions resolved

Resolved in-session 2026-05-23 per GATE 5 (one at a time). Recorded
here so the implementation session consumes the brief as a single
source of truth.

### §9.1 — YT discovery surface (resolves §5.1)

**DECISION (2026-05-23): Channel-walk only.**

The v1 YT acquisition layer uses `yt_research/yt_crawler.py`'s
channel-walk against `@hunterrootmusic` only. The 208 videos in the
current `channel_videos.json` are the discovery universe. Search-walks
(`fan_yt.json`-shape work) are NOT run as part of v1 discovery.

Implementation consequences:
- `yt-bulk` orchestrator iterates `channel_videos.json` entries,
  cross-referenced against `docs/ingest-log.md`, no other discovery
  source.
- No "Hunter Root cover" / venue / collaborator queries.
- `fan_yt.json` (the existing 175-result file) is retained on disk
  as historical research data but is not consumed by the acquisition
  layer.
- §5.3 (fan content) is NOT automatically moot — fan content can
  still arrive via the WB Capture Chrome extension (Mike on a fan
  page → one-click capture) or via the §6.4 open-web operator-paste
  fast-path. §5.3 governs what happens to those captures when they
  arrive, regardless of YT-discovery scope.

If a future v2 wants search-walks, `yt_crawler.py` already supports
the shape (per `fan_yt.json`'s `query` field evidence). The
discovery surface is forward-compatible; only the v1 invocation set
is narrow.

### §9.2 — Discovery cadence (resolves §5.2)

**DECISION (2026-05-23): On-demand only.**

The v1 YT acquisition layer is operator-triggered. No scheduler. No
recurring cron / Windows scheduled-task. Mike runs the orchestrator
when he wants captures to land.

Implementation consequences:
- Single CLI / wrapper entry point. No background daemon.
- The orchestrator runs to completion against the current
  `channel_videos.json` (which `yt_crawler.py` re-emits on each
  invocation per its own logic) and exits.
- New Hunter uploads land in MV's inbox when Mike runs the tool,
  not before. The capture rate matches Mike's session cadence.
- §6.4's first work item ("YT bulk channel-walk acquisition v1") is
  unchanged in shape; the cadence decision only narrows the surface
  to the one-shot/operator-triggered flow. No scheduler code to
  write.

If a future v2 wants recurring discovery, the Schedule skill / Windows
Task Scheduler / cron can wrap the existing CLI without changing its
shape. The decision is reversible.

### §9.3 — Fan content (resolves §5.3)

**DECISION (2026-05-23): In-scope with credit.**

Fan-uploaded content (covers, fan live captures, reaction videos
attributed to non-HR creators) is in-scope for v1 acquisition. It
enters MV via the same Path B as official content, with one
additional tag: `credit:<creator_slug>` derived from the existing
`--credit` flag on `yt_archive_capture.py`'s CLI.

UX framing (operator 2026-05-23): the museum surfaces credited fan
content alongside Hunter-authored content. BACKLOG.md P3-03's "Cover
Artists program — dedicated space" remains a future surface work item;
v1 does NOT block on having a dedicated section. In the interim, fan
content with `content_kind:cover` renders through the existing
LinkCard dispatch (media_type='link') in `HrExhibitFlow.jsx` — same
shape as the existing 1 YT link card.

Ops follow-on items (implementation session):
- **New namespace approval: `credit:<slug>`.** Add to `vocabulary`
  table (tier 3, sort order TBD). One-row insert. Operator-locked-rule
  citation in `core/ingest_rules.py` + a CHANGELOG entry. This unblocks
  the `--credit` flag end-to-end (today the flag exists in the CLI but
  the tag would land in `unsorted:` or be silently dropped depending
  on how the existing flow handles unknown namespaces).
- **Acquisition tooling:** the orchestrator script's per-video prompt
  (for non-SPINE videos) asks for `--credit "<name>"` whenever
  `--type cover`. Same flow today; minor extension to remember the
  most recent credit.
- **Museum-side render check:** verify that a fan-cover artifact
  (registered with `content_kind:cover` + `media_type:link`) renders
  cleanly through LinkCard in HrExhibitFlow. Expected: yes, no
  changes needed.
- **Future visual differentiation** (e.g. cover cards get a different
  badge / color) is deferred to a focused UX session per the operator's
  prior framing about aesthetic changes alongside fresh artifacts
  (DEPLOY §6.2 / §8.2).

Net effect: the v1 first work item (§6.4 step 1, "YT bulk channel-walk
acquisition v1") remains channel-walk-only per §9.1 — meaning fan
content arrives via extension-capture or operator-paste, not via YT
search-walks. When it arrives, it gets the full release path with
credit. The Cover Artists dedicated section can land later without
re-curating any artifact captured under this rule (the
`credit:` + `content_kind:cover` tags are forward-compatible).

---

*End of scoping brief. Implementation green-lit. First work item per
§6.4: YT bulk channel-walk acquisition v1 — SPINE-driven for known
videos, operator-augmented for unknowns, on-demand cadence (§9.2),
channel-walk only (§9.1). Fan content acquired through any path
(extension-capture, operator-paste) lands with `credit:<slug>` +
`content_kind:cover` per §9.3; the `credit:` namespace approval is
an Ops prerequisite for the implementation session. Capture is
proven; orchestration is the remaining engineering shape.*
