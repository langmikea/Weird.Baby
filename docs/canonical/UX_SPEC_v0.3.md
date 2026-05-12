# Weird.Baby Museum — UX Specification

**Version:** 0.4
**Date:** 2026-04-22; 2026-05-12 (v0.4 promotion pass)
**Author:** Cowork Claude (Phase 2 of vision-lock → UX-spec sequence)
**Ground truth:** `C:\AI\VISION_LOCK_v0.3.md` (locked). All architectural
rules, voice conventions, and deferrals in that document are assumed as
fact in this spec. Where this spec needs to reference a specific rule,
it cites by number (e.g., "§1 #14") pointing back to the vision lock.

**v0.3 changes from v0.2 (Mike's second review pass):**
- **Carsie Blanton: infrastructure-ready, implementation deferred.**
  §C (general exhibit pattern) is reframed as the primary
  specification — the infrastructure must accept N artists without
  code changes. §D (HR) is the first instantiation. §E (CB) is
  "prepared but not implemented in v1."
- **Lobby's All Exhibits panel: carousel of museum posters.** The
  v0.2 "list" language is replaced with a carousel of
  museum-authored posters (one per exhibit; museum-voiced and
  Weebie-branded, distinct from artist-provided album art). Detailed
  poster design deferred to a separate preplanning session.
- **Filter pills spec stripped out.** The v0.2 handwaved "additive
  or subtractive era pills" was an under-thought mix of two
  filtering philosophies. Removed from §C.5.2 and §C.5.3. Replaced
  with a placeholder §C.5.0 introducing the control-surface question
  and deferring the detailed spec to a future document
  (`UX_PRESETS_SPEC`, forthcoming). The era vocabulary
  (seeds/medusas/rwth/solo) remains as a data-layer concern.
- **New §C.5.0 — "The visitor shapes the museum."** Articulates the
  principle that visitor control is load-bearing — the exhibit is
  not a digital magazine. Names the presets-and-sharing concept as
  the eventual unlock. Mechanism TBD in the preplanning session.

**v0.4 changes from v0.3 (2026-05-12 compare pass):**
- **§N — Observed behaviors promoted from code.** New section.
  Records exhibit-room and site-shell behaviors implemented in
  `src/routes/exhibit/Exhibit.jsx` and `src/routes/hr/HrExhibitFlow.jsx`
  that were not previously named in §§A–M. Includes a deferral
  subsection for the Journal panel full lifecycle, pending operator
  decision on placement (§C panel section, or a new dedicated
  section). Existing §§A–M are preserved unchanged.

**Horizon (per vision lock §6 Q-05 (b)):** v1 is primary. v1.5
additions (source-agnostic player, MP3 delivery via R2) are annotated
inline with **"v1.5:"** tags where a surface's behavior extends. v2
is out of scope for this spec.

**Aphantasia convention:** This spec describes *behavior*, not
*appearance*. Where a visual element is mentioned, its behavior is
what's specified — what it does, when it changes, what state changes
trigger it. Colors, typography, exact dimensions, and motion easings
are downstream of this document.

**What this spec does NOT cover:**
- Implementation (no React components by name, no routes by file path,
  no hooks, no CSS)
- Data schema (D1 tables, column names, MediaVault artifacts)
- Visual design beyond what UX requires
- Business rules outside the visitor experience (admin auth policy,
  merch fulfillment, contract details)

**Reading order:**
- §A anchors the whole spec (sitemap + room topology)
- §H describes the site shell (what's always present)
- §B, §C, §D, §E, §F describe each room
- §G is a stub for v1 (no account-holder surfaces)
- §I–§M cover cross-cutting concerns

---

## §A — Sitemap (visitor-facing)

### A.1 — Topology

The museum is a closed system of three room-types connected by
directional edges. No side entrances; no way to arrive at an exhibit
or the Gift Shop without transiting the Lobby first (vision lock §1
#12). No sound crosses any edge (§1 #14).

```
                     [ ENTRY FROM OUTSIDE ]
                              |
                              v
                         +---------+
              (redirect) |  LOBBY  |
         <---------------|         |
         | (Featured)    +---------+
         | (Chooser)          |
         | (Gift Shop)        |
         v                    v
  +---------------+    +-------------+
  |    EXHIBIT    |    |  GIFT SHOP  |---> (external artist store)
  |   (one of N)  |--->|             |
  |               |    |             |---> (external W.B. merch, v1.5+)
  +---------------+    +-------------+
                              |
                              v
                        [ back to LOBBY ]
```

### A.2 — Routes

| Route | Room | Notes |
|---|---|---|
| `/` | Lobby | The only legitimate entry point. |
| `/hr` | Exhibit — Hunter Root | Direct URL redirects to `/` first, then routes through. **First and only v1 exhibit.** |
| `/shop` | Gift Shop | Same redirect behavior. |
| `/admin` | Curator surface | Not a visitor surface. Triggered by typing `mmm` on any page. Out of scope for this spec except where it affects visitor-visible state (see §B.4 Featured Exhibit curation). |
| `/cb`, `/hr/archive`, `/hr/workshop/lyric-map` | Dormant routes | **Not v1 visitor surfaces** (v0.3 decisions). The underlying files remain in the repo but are not linked from any visitor-accessible UI. `/cb` is prepared for future activation (§E); the others are killed (§D.4, §D.5). Direct-URL access to any of these paths behaves the same as any other non-Lobby URL: redirect to `/`. |

All non-`/` routes accessed directly from outside (bookmark, shared
link, search engine) redirect to `/` with the *intended* destination
captured in session state, then the Lobby offers the visitor a clear
path to that destination — **only if the destination is a v1
visitor surface** (`/hr` or `/shop`). Direct URLs to dormant routes
redirect to `/` with no intent-preservation. See §L.1 for the
redirect handling pattern.

### A.3 — Room Edges (every legitimate transition)

| From | To | How | Player behavior |
|---|---|---|---|
| Outside | Lobby | URL, link, bookmark | N/A (no prior playback) |
| Lobby | Featured Exhibit | Click/tap in Featured panel | Exhibit starts in quiet-ready (§C.3) |
| Lobby | Exhibit (specific) | Click/tap in All Exhibits chooser | Same |
| Lobby | Gift Shop | Click/tap Gift Shop exit | Bell on entry (§F.2) |
| Exhibit | Gift Shop | Click/tap "exit" element | Exhibit player fades; bell plays |
| Lobby | External (any) | Not possible in v1 — Lobby has no outbound | — |
| Gift Shop | Lobby | Click/tap back-to-lobby | Bell stops (if still sounding) |
| Gift Shop | External artist store | Click/tap artist merch link | Player state N/A (leaving museum) |
| Any room | Outside | Tab close, URL change, browser back beyond entry | Playback ends |

**No edge exists from one exhibit to another.** In v1 there is only
one exhibit (HR), so this rule is latent. When future exhibits are
added (CB and beyond), a visitor crossing between them walks
Exhibit A → Gift Shop → Lobby → Exhibit B. Each crossing fades any
active playback. This is the §1 #11 + #14 rule made concrete.

### A.4 — What is NOT a room

- The **guest book** is not a room — it is a panel that appears on
  multiple surfaces. See §H.4.
- The **admin surface** is not a visitor room.
- The **Lyric Map** (at `/hr/workshop/lyric-map`) is not a v1 visitor
  surface at all. Per the museum's curatorial posture ("not every
  piece of info — curated"), the Lyric Map is not part of the
  visitor experience. The route file may remain in the repo as
  curator/archival material, but no visitor path reaches it.
- The **`/hr/archive` discography view** is not a v1 visitor surface.
  The file `HrArchive.jsx` remains in the repo but is not linked
  from any visitor UI. The P2 Social Archive panel *inside* the HR
  exhibit is the only archive visitors see. Same rationale: curated
  over comprehensive.

---

## §H — Site Shell

The site shell is what is present on every visitor surface. It is
minimal by design (Fountain Principle: the shell does not compete with
the room for attention).

### H.1 — Always-present elements

| Element | Location | Behavior |
|---|---|---|
| Weebie favicon | Browser tab | Static. The silent mascot. |
| `WEIRD.BABY` top-bar word | Top-left of viewport | Always visible on every visitor surface. Tap/click behavior is room-dependent — see §H.2. |
| Room indicator | Top-bar center | Short text: "Hunter Root" (the v1 exhibit; future exhibits show their artist name), "Gift Shop". On the Lobby, the center can be blank or can show Weebie. Not clickable. |
| `GIFT SHOP` top-bar word | Top-right of viewport | Present on every room except the Gift Shop itself. Tap/click goes to the Gift Shop. See §H.2. |
| Persistent player bar | Bottom of viewport, only when an exhibit player is active | Shows current track, play/pause, scrub (v1.5+). Fades with the player on any exit (§1 #14). Not present in the Lobby or Gift Shop. |

The shell does NOT contain:
- A persistent navigation menu. There is no hamburger, no top-nav bar
  of rooms. Rooms are reached by exiting the current room, not by
  teleporting between them.
- A persistent search. Search is not a v1 feature (see §M).
- Cookie banners or consent overlays beyond what is strictly required
  by law for the visitor's jurisdiction (see §L.2).
- Footer links other than a single "© Weird.Baby, 2026" line on the
  Lobby only. Exhibits and Gift Shop have no footer.

### H.2 — The top-bar words (exit affordances)

The two top-bar words are the exhibit's exit affordances. Per vision
lock §1 #11, an exhibit has one exit: the Gift Shop. Both words
honor that rule.

| Current room | `WEIRD.BABY` (top-left) | `GIFT SHOP` (top-right) |
|---|---|---|
| Lobby | No-op (or quiet Weebie acknowledgment — already home) | Tap → Gift Shop (one of the three Lobby exits, §1 #12) |
| Exhibit | **Tap → Gift Shop.** No confirmation. Player fades (§C.3.4). Bell plays on Gift Shop arrival (§F.2). | **Tap → Gift Shop.** Identical behavior. |
| Gift Shop | Tap → Lobby. Bell does not re-trigger on Lobby entry (bell is a Gift Shop arrival cue only). | Not present (already in the Gift Shop). |

**Design intent (Mike's call):** Both top-bar words route to the
Gift Shop from inside an exhibit. The visitor has two visible,
always-available exit affordances that behave the same way — the
word `GIFT SHOP` is self-labeled, and `WEIRD.BABY` (the museum's
name) honors the rule that the only way out of an exhibit is through
the Gift Shop. A visitor who wants to "go home" to the museum's
entrance is implicitly going via the Gift Shop because that's the
sanctioned path.

**No confirmation dialog.** The exit is deliberate — the visitor
tapped an exit word. Confirming would add friction without value.
If the visitor taps by accident, they can walk back through the
Gift Shop's "back to Lobby" element and into whichever exhibit they
came from.

**v1.5:** if telemetry reveals that visitors routinely tap
`WEIRD.BABY` expecting to reach the Lobby directly (rather than via
the Gift Shop), reconsider. v1 commits to the simpler rule.

### H.3 — The persistent player bar

Present only when exhibit playback is active. Reads like a mini-player
docked to the bottom of the viewport. Contents:

| Element | Behavior |
|---|---|
| Now playing | Track title + artist. Reflects the current source (YouTube video or, v1.5+, MP3). |
| Play/pause | Toggles playback. Tap from muted-autoplay state (§C.3.3) unmutes. |
| Scrub bar | Shows progress. Tap-to-seek in v1.5. v1 shows progress read-only (YouTube iframe limitation). |
| Expand | Tap/click expands to a full-height player view within the exhibit — shows the video (for YouTube tracks), album art (for MP3s, v1.5+), and track list. |

The player bar does NOT appear:
- In the Lobby (Lobby is not an exhibit; nothing is playing)
- In the Gift Shop (the bell is a one-shot cue, not persistent
  playback; see §F.2)
- During the fade-out transition — the bar fades with the audio

### H.4 — The guest book

The guest book is not a room, a page, or a single surface. It is a
*panel pattern* that appears in multiple places with context-aware
prompts.

**Where the guest book appears:**
- Lobby (general museum guest book — "first time?" or "welcome back")
- Inside exhibits, one per context (see §C.6)
- At specific spine positions (per track, per era, per album — §C.6.2)

**What the guest book is NOT:**
- A separate `/guestbook` route. There is no such route.
- A single global thread. It is many contextual threads that share
  infrastructure (per vision lock C-05: shell is architecture, not
  UI).

Full behavior spec in §C.6 (exhibit context) and §B.5 (Lobby context).

### H.5 — The admin shortcut

Typing `mmm` on any visitor-facing surface opens `/admin` in-place.
This is curator-only behavior. It does not affect visitor UX except:
- A visitor who inadvertently types `mmm` (unlikely) sees the admin
  surface. This is acceptable pre-announcement per vision lock §6
  Q-06(a).
- Before public announcement, Mike replaces this with a real auth
  gate (deferred).

The admin surface does not follow the Fountain Principle. It is a
firehose of signal for the curator. Not described further in this
spec.

---

## §B — Lobby (WbHome)

The Lobby is the museum's front door. It is the only legitimate
entrance (§1 #12). It is a room, not a relay — visitors can stop
here, look around, and leave without entering any exhibit.

### B.1 — Purpose and posture

| Dimension | Lobby's stance |
|---|---|
| Voice | Papa Weird.Baby — curatorial, warm, quiet confidence |
| Pace | Unhurried. The Lobby does not push. |
| Goal | Receive the visitor. Orient them. Give them three clear ways into the museum. Offer a guest book. |
| Not goal | Promote any specific exhibit. Convert. Upsell. Measure engagement. |
| Fountain vs firehose | Fountain (§K.1) — three deliberate choices, not a feed |

### B.2 — Panels (v1)

The Lobby is structured as a set of panels, not a single dense page.
On desktop, panels lay out in a spatial arrangement that reads
roughly top-to-bottom with the Featured Exhibit given the most
presence. On mobile, panels stack vertically in the same order.

| # | Panel | Presence | Role |
|---|---|---|---|
| 1 | Welcome | Top, always visible | The museum's greeting. Papa's voice. One line, not a paragraph. First-time vs returning variant (§L.3). |
| 2 | Featured Exhibit | High presence | The one exhibit Mike has curated as featured. Acts as an exit into that exhibit. |
| 3 | All Exhibits | Medium presence | Chooser — list of exhibits including the featured one. Tap/click a row, enter that exhibit. |
| 4 | Guest Book | Medium presence | Lobby-level guest book. Entry prompt + latest featured entries. |
| 5 | Gift Shop | Low presence | The third exit. A single element that says "Gift Shop" and acts as the exit. |

**Panels the Lobby does NOT have in v1** (but can grow, per §1 #15):
- Information desk (deferred — no content defined)
- Concierge (deferred)
- Museum news / What's New (deferred — conflicts with "museum is not
  a feed" posture)

### B.3 — The Welcome panel

Contents:
- Weebie, visible.
- One curatorial line. Papa's voice. Examples (Mike can replace):
  - First-ever visit (this session cookie is brand new): "welcome.
    take your time."
  - Returning (session cookie matches prior visit): "welcome back.
    anything new since you left." — note, lowercase, no period on
    *take*, no period on *back*; Papa's voice is deliberately quiet
    and not typographically loud. The UX spec does not lock the
    exact phrasing; it locks the *pattern* (one short line, lower-
    case start, quiet).
  - Founding Visitor eligibility window is open: the welcome line
    is unchanged. The Founding Visitor affordance lives in the
    Guest Book panel (§B.5), not the Welcome panel, because the
    Founding Visitor status attaches to a *signed* contribution,
    not to presence.

No other content. No subtitle. No CTA. The Welcome panel is the
museum exhaling.

**Mobile:** identical, just stacked.

### B.4 — The Featured Exhibit panel

This panel showcases the one exhibit Mike has curated into the
featured slot (vision lock G-06).

| Element | v1 behavior |
|---|---|
| Cover image | The featured exhibit's primary visual anchor. On desktop, large. On mobile, full-width. |
| Exhibit name | The artist's name, prominent. |
| Curatorial line | One line, Papa's voice, specific to this artist (e.g., "A solo career that grew out of loss."). Changes when Mike changes the featured slot, not algorithmically. |
| Exit-to-exhibit affordance | Tap/click anywhere in the panel → exhibit entry sequence (§C.1). |

**Curation mechanism:** Mike flips the featured exhibit via `/admin`.
No timer, no automation. When Mike flips it, the Lobby reflects the
new featured exhibit on the next load.

**What this panel does NOT show:**
- Track preview players. No audio plays in the Lobby (§1 #14).
- Stats ("X tracks, Y albums"). The Lobby does not quantify.
- Recent activity ("new this week"). The Lobby is not a feed.

### B.5 — The All Exhibits panel

A carousel of museum posters. One poster per featured exhibit.

| Element | v1 behavior |
|---|---|
| Poster per exhibit | Museum-authored poster (see below). Each poster acts as an entry point to that exhibit. |
| Carousel interaction | Same visual grammar as the HR exhibit's shelf — horizontal, browsable. The active poster is centered and has most presence; adjacent posters are visible but quieter. |
| Tap/click active poster | Enters that exhibit (same as a Featured Exhibit panel tap). |
| Tap/click a non-centered poster | Centers it first (one interaction). Second tap enters. |
| Featured exhibit's poster | Included in the carousel, not excluded — visitors who arrive at the Lobby see the featured exhibit twice (once in the Featured panel, once in this carousel). A quiet indicator marks it as "currently featured" in the carousel view. |
| Sort order | Curator-controlled. Default: order the artists were added to the museum. Mike can reorder via `/admin`. |

**What a "museum poster" is:**

A museum poster is museum-authored content, distinct from anything
the artist provides. It is to the Lobby's All Exhibits carousel what
album art is to the HR exhibit's shelf — the visual anchor for each
tile — but governed by different rules:

| Dimension | Museum poster | Album art |
|---|---|---|
| Author | The museum (Mike as curator, Papa's voice) | The artist |
| Aesthetic | Unified across the museum — every poster reads as "Weird.Baby Museum presents…" | Varies per artist, per album — each artist's own visual identity |
| Copy | Museum-voiced (Papa) — a curatorial statement about why this exhibit exists | Artist-determined |
| Weebie | Present as a mark (small, corner, always the same treatment across posters) | Not present |
| Changes | Rare. A poster represents an exhibit; exhibits don't retire on a schedule (vision lock G-06). | Per-album, fixed once released |

**Detailed poster design is deferred.** v0.3 names the concept but
does not specify exact layout, copy patterns, or aesthetic rules. A
separate preplanning session will produce the museum poster
specification. Until then, HR's poster can be a placeholder that
carries the principle.

**v1 with HR only:** The carousel has one poster (HR). Functionally
this means the carousel is visible but not browsable — it presents
the single poster centered. This is fine as a starting state; when
CB and future exhibits are added, the carousel becomes meaningfully
browsable.

**The carousel is NOT:**
- A feed or recently-updated list.
- Sorted by "most recent activity" or any dynamic signal.
- A search result.
- A paginated gallery (every exhibit fits in one carousel; when the
  museum has too many exhibits for one carousel, that's a future
  scope question).

**Desktop vs mobile:** same carousel grammar; on mobile the posters
are full-width with swipe, on desktop the posters are smaller with
visible adjacent posters and click-or-drag navigation.

### B.6 — The Guest Book panel (Lobby context)

The Lobby's guest book is the museum's general book. Not
exhibit-specific.

| Element | v1 behavior |
|---|---|
| Prompt | Papa's voice, context-aware. Default: "sign the guest book." First-time: "you're early. leave your name." (this is the Founding Visitor prompt — see C-09) |
| Entry field | Name + message. No email, no account. Session-scoped identity. |
| Submit | Writes the contribution with Lobby-context metadata (§C-06 in vision lock). |
| Featured entries | 0–3 editorially-featured contributions visible inline. Mike features them via `/admin` (vision lock T-09). If no entries are featured, the panel shows only the prompt (quiet state). |
| Founding Visitor badge | Contributions signed during the eligibility window carry a visible labeled tag (vision lock C-09, Q-03). The tag persists forever. |

**Submission behavior:**
- Submit is never irreversible from the visitor's side in the first
  5 seconds — there is a quiet "undo" affordance (tap to retract)
  that disappears after 5 seconds.
- After submit, the panel shows the visitor their entry inline with
  a quiet acknowledgment. If it's a Founding Visitor entry, the
  badge appears on the confirmation.
- No email capture, no "thanks!" modal, no share dialog.

**Context capture** (vision lock C-06): Lobby contributions capture
`{room: "lobby", session_id, timestamp_utc}`. They do not capture
exhibit-level context because the visitor is not in an exhibit.

### B.7 — The Gift Shop exit panel

Small. Low presence. One element that says "Gift Shop" and acts as
the exit to `/shop`.

**Why it's on the Lobby:** the Gift Shop is one of the Lobby's three
exits (§1 #12). A visitor might want to browse merch without entering
an exhibit first.

**What happens on tap:** Lobby → Gift Shop transition. Bell plays on
entry (§F.2). No playback is ending because nothing was playing.

**Placement rationale:** Low presence because it is the *least*
interesting exit for a first-time visitor. The museum exists for the
exhibits; the Gift Shop exists for the Abundance Principle. But
returning visitors or visitors with a specific merch goal have a
direct path.

### B.8 — Ambient behaviors (Lobby)

| Behavior | Description |
|---|---|
| Welcome line variation | On every Lobby load, the Welcome line can cycle through a small curated set (Papa's voice, 3–5 variants). Reduces staleness on return. |
| Featured entries rotation | If 3+ entries are editorially featured, the Lobby rotates which one is at the top on each visit (deterministic per-session; not random mid-session). |
| Guest book prompt variation | The prompt text varies: "sign the guest book." / "say hello." / "you're welcome to leave a note." — curator-set list. Rotates on load, stable within a session. |

No auto-playing media. No auto-scroll. No auto-refresh. The Lobby
breathes but does not move on its own.

### B.9 — First-time vs returning visitor

v1 distinguishes these states by session cookie only (vision lock
T-02, T-03). No accounts.

| State | Welcome | Guest book prompt | Founding Visitor affordance |
|---|---|---|---|
| Brand new session | "welcome." | "you're early. leave your name." | Present if within eligibility window (vision lock C-09) |
| Returning this session | Unchanged from first visit | Unchanged | Unchanged |
| Returning from earlier session | "welcome back." | "say hello again." or similar | Tag appears on prior contribution if any; no new tag available (one-time per browser session cookie) |
| Returning after eligibility closed | "welcome back." | Regular prompt | No affordance (window closed) |

**Edge case — cookie cleared:** treated as brand new. Acceptable
limitation in v1. Post-v1 accounts resolve this.

### B.10 — v1.5 additions

- Guest book entries can include a song reference (tap to select a
  track from any exhibit, gets embedded as a quote). Requires the
  source-agnostic player (G5 closed) to surface track IDs for
  selection.
- The Welcome line can include a quiet callback: "welcome back. you
  last heard ['Arkansas' — Hunter Root, 2023]." — the tracks-heard
  list is session-scoped in v1; v1.5 persists across sessions per
  browser.

### B.11 — What the Lobby is NOT (Fountain audit)

| Anti-pattern | Why not |
|---|---|
| A feed of "latest additions" | Museum is not a feed. Abundance ≠ firehose. |
| A search bar | No v1 need. Two exhibits. |
| Social proof ("X visitors today") | Violates quiet posture. |
| A newsletter signup | No newsletter in v1. |
| An about page link | The museum's "about" is the museum. If a visitor needs an explanation, the Lobby's Welcome line is it. |
| Links to social media | The museum has no social media presence of its own (§1 #13: museum exits only via artist stores). Each artist's own socials are reachable from their exhibit's context, not from the Lobby shell. |

---

## §C — Exhibit Room (general pattern)

This section describes what every exhibit has in common. §D and §E
describe artist-specific additions/differences — where §D (HR) is
the first full instantiation and §E (CB) is prepared but not
implemented in v1.

An exhibit is a complete space dedicated to one featured artist. It
is not a page. A visitor can spend a long time in an exhibit and
not exhaust it.

### C.0 — Infrastructure primacy

**This section is the primary UX specification.** The exhibit pattern
described in §C is what's being built in v1, not the HR-specific
exhibit. HR happens to be the first instantiation because HR's
content is ready and curated; the infrastructure must be *generic
enough* that adding artist #2 (CB), #3, #4, #N is a content task,
not a code task.

**What "infrastructure-ready" means in v1:**

- The shared exhibit component (currently `src/routes/exhibit/`)
  takes an artist config and renders the pattern. No per-artist
  forks of core behavior.
- Panel data files follow a consistent schema per panel type
  (discography, facts, archive cards, artifacts, exit-flow, journal
  prompts). Same schema across artists.
- Era vocabulary is per-artist. HR's eras are
  `seeds / medusas / rwth / solo`. CB's eras are TBD by the
  curator. Adding an era is a data-file edit, not a code edit.
- Spine tile shape accepts any artist's discography. Pre-solo
  identities (like HR's RWTH or Seeds) are spine tiles of the same
  shape, not a special case.
- Default active spine position is a per-artist curator decision
  expressed in the config.

**What this means for the build order:**

1. Generalize the exhibit component so that HR is one of N possible
   exhibits, not a bespoke HR implementation.
2. Implement v1 to spec for HR content.
3. CB is a content-only addition when its content is ready. No code
   work.

**What this means for §D and §E:**

§D describes HR — the first instantiation — at full v1 fidelity. §E
describes CB's *preparation* state: data files exist, route exists,
but CB is not a visitor-reachable exhibit in v1. When CB is ready to
launch, it slots into the already-built pattern.

### C.1 — Exhibit entry

**Where the visitor comes from:** Always the Lobby (§1 #12). Either
via Featured Exhibit panel or via the All Exhibits chooser.

**What happens on entry:**
1. Lobby fades (brief — ~500ms).
2. Exhibit loads. The exhibit's "opening behavior" runs.
3. The persistent player bar appears at the bottom of the viewport
   in *quiet-ready* state (see C.3) — not auto-playing.
4. The Shelf (§C.2) is presented in its full state.
5. The visitor's focus lands on the shelf; facts begin surfacing in
   the Fact Scroller panel (§C.5.1).

**Opening behavior specifics:**
- The track that's "ready to play" on exhibit entry is the first
  track of the exhibit's default active spine position.
- For HR in v1, per vision lock T-07, the default active position
  is *Arkansas* (index 7 in the 9-tile spine).
- For future exhibits (CB and beyond), the default is similarly the
  artist's flagship album — a curator decision expressed in the
  artist config (§C.0).
- Autoplay does NOT happen on entry. The player is ready-but-muted;
  the visitor taps to begin (vision lock C-04).

**v1.5:** The exhibit can remember the visitor's last position in
this exhibit (from session cookie) and default to it instead of the
curator default, if the visitor is returning within the same session.

### C.2 — The Shelf (spine, top level)

The Shelf is the artist's discography in chronological order, always
visible at the top of the exhibit.

**Per vision lock C-02, the spine has three breath-states:**

| State | When active | Behavior |
|---|---|---|
| Full | Visitor is at the "top" of the exhibit (just entered, or tapped the exhibit-home element) | All spine tiles visible, the active tile has most presence |
| Compact | Visitor has scrolled into panels or opened an artifact | Horizontal ribbon at the top of the viewport, still shows all tiles, the active one is highlighted |
| Minimal | Visitor is in a focused state (reading a long card, watching a video full-width, writing a journal entry) | Single breadcrumb-like indicator: "[Exhibit] · [Era] · [Album] · [Track if playing]" |

**Transitions between states:** motion-based, behavior-tied. The
spine never disappears (§1 rule implied by vision).

**Shelf interactions:**

| Action | Behavior |
|---|---|
| Tap/click a spine tile | That tile becomes active. Panels (§C.5) re-populate for the new album. The Fact Scroller queues new facts. Player enters quiet-ready state with that album's opening track. Does NOT auto-play. |
| Scroll horizontally on the Shelf (desktop) | Moves through the spine tiles. No auto-center; visitor drives. |
| Swipe on the Shelf (mobile) | Same. |
| Tap/click the active tile | Opens the album's Tracklist panel in focus (§C.3). |

**What the spine does not do:**
- Auto-advance. No "next album" button. Visitor selects.
- Filter. The spine is always the full discography. Filtering is a
  panel concern (§C.5).
- Hide non-canonical content behind a toggle. The spine includes
  everything that's on it (for HR, see §D.2 pre-solo tiles).

### C.3 — The Player

**Player state machine:**

| State | Description | Trigger in |
|---|---|---|
| quiet-ready | Player is configured with a track but not playing. UI bar is present but muted-silent. | Exhibit entry, spine tile change, track change, re-entry from outside |
| playing | Audio is active, UI reflects progress | Visitor taps play/unmute |
| paused | Audio suspended at current position | Visitor taps pause |
| fading | Audio is ramping down over ~1.5s, UI is fading with it | Any exit from the exhibit (§1 #14) |
| gone | Player is not present in the DOM | Outside the exhibit (in Lobby, Gift Shop, etc.) |

**C.3.1 — Player scope:** Within the exhibit only. Persists across
every internal surface (shelf, panels, archive, artifacts, journal).
Fades on any exit (§1 #14). Never carries across rooms.

**C.3.2 — Player sources (v1):** YouTube iframe only. Every track
with a `ytId` can play. Tracks without a YouTube video show a
"no video available" state in the tracklist (§C.4) and are not
playable in v1.

**C.3.3 — Muted-autoplay pattern:** On first visit to any exhibit in
a session, the player loads muted. The player bar shows a "tap to
hear" affordance. First tap anywhere on the player bar or on a track
unmutes and starts playback. Subsequent tracks in the same session
do not require re-unmuting.

**C.3.4 — Player controls (v1):**
- Play/pause
- Expand (opens the video full-panel)
- Track title (non-interactive display)

**Controls NOT present in v1:**
- Scrub/seek (YouTube iframe doesn't expose; v1.5 MP3s will)
- Volume slider (browser/device volume only)
- Next/previous track (playlist-level; tracklist panel handles)
- Loop/shuffle (not v1)

**C.3.5 — v1.5 additions:**
- Source-agnostic player — a track can have MP3 sources (via R2) or
  YouTube sources; player picks based on availability and
  visitor preference (if any).
- Seek/scrub bar becomes interactive.
- Track queueing (vision lock §2.1 "tracklist queue overhaul") — a
  single click queues a track; a double-click plays now.

### C.4 — The Tracklist panel

Present within the exhibit, showing the active album's tracks.

| Element | v1 behavior |
|---|---|
| Track row | Title, duration (if known), video-count indicator |
| Playable state | Rows with `ytId` are tappable; rows without show a quiet non-interactive state |
| Active track | The currently-playing or quiet-ready track is highlighted |
| Track menu (desktop hover / mobile long-press) | Opens track-level context: "play from here", "show this track's panel 3 artifacts" (if any), "sign guest book for this track" |

**C.4.1 — Queue behavior (v1):** Click a track → starts playing that
track immediately. Ends the current track's playback. Simple.

**C.4.2 — v1.5 queue overhaul (per BACKLOG TIER 1):** Single click
queues a track for after the current one. Double-click plays now.
Video is always visible regardless of whether it's playing or
queued. This is a UX refinement, not a new capability.

### C.5 — The Panels (branches off the spine)

Per vision lock, the exhibit has panels that act as lenses on the
active spine position. The panels share a grammar across exhibits.

Panel inventory (v1):

| # | Name | Role |
|---|---|---|
| P1 | Fact Scroller | Surfaces curated facts about the artist, active album, active track. Ambient. |
| P2 | Social Archive | Historical social posts, interviews, rarities tied to the era. |
| P3 | Artifacts | Posters, setlists, photos, handwritten pieces, fan art tied to the era. |
| P4 | Exit Flow / Journal | A sticky journal column where visitors write and reflect; also the artist's "next" / coming content. |

The panels are lenses, not rooms. A visitor moves between them by
scrolling (desktop) or swiping between tabs (mobile). The spine
ribbon stays visible as a breadcrumb through all panels.

### C.5.0 — The visitor shapes the museum

**Principle:** The exhibit is not a digital magazine. Without visitor
control and interaction, it becomes one — beautifully laid out,
lean-back, passive consumption of whatever the curator has arranged.
That is not what Weird.Baby is. Visitor agency is load-bearing.

The vision lock's language supports this explicitly: *"When you
demonstrate interest… the screen reorganizes quietly around that
interest. More of what you care about surfaces. The way back is
always visible. The museum follows your lead."* (Vision lock C-08
source material.) This only works if the visitor has levers to
pull.

**What this means architecturally:**

- Panel content surfaces according to the active spine position
  (album → era), which *is* a form of visitor control exercised via
  the shelf. This is the baseline.
- Beyond the shelf, the visitor should be able to narrow or
  reorganize what's on a panel. Era-level browsing, type-level
  browsing, source-level browsing — the exact control surfaces
  are TBD.
- The visitor should be able to *save* a configuration of the
  museum — which spine position, which filters, which panel state —
  and the museum should remember it.
- The visitor should be able to *share* a saved configuration as a
  URL or short code, so the recipient lands in the museum exactly
  as the sender curated it. This is the Abundance Principle applied
  to the visitor — the visitor becomes a micro-curator, amplifying
  what the museum has given them.

**The presets-and-sharing architecture is deferred to a separate
preplanning session** and will be specified in a forthcoming
`UX_PRESETS_SPEC`. The outstanding questions for that session
(recorded here so they're not forgotten):

1. Named presets (visitor titles them, shareable) vs automatic
   presets (museum saves on exit, resumable) — or both?
2. Museum-wide snapshot vs exhibit-scoped preset?
3. Shared presets and the lobby-only-entrance rule: does a shared
   preset URL land the visitor at the Lobby first (with a "someone
   sent you this" indicator) or directly at the preset-configured
   state? (Default assumption: Lobby-first, same as any other
   direct URL — §L.1.)
4. Preset persistence: does a preset outlast the session cookie's
   48h expiry? If yes, how is it reached — a URL?
5. Preset as a contribution (vision lock C-05 "contribution shell"):
   is a preset just another row in the polymorphic contributions
   table, with its own surface pattern?

**What v1 provides in the absence of preset architecture:**

- The shelf/spine as the primary control surface. Visitor choice
  of album/era is expressed here.
- The tracklist as the secondary control surface. Visitor choice
  of track is expressed here.
- Session-scoped "remember this fact" bookmarks in P1 (§C.5.1) —
  already spec'd; low-stakes personal dots.
- Session-scoped context capture on contributions (vision lock
  C-06) — the visitor's configuration at contribution time is
  already captured; shared contributions could become shared
  presets post-v1 through the same infrastructure.

**What v1 does NOT provide (pending the preplanning session):**

- Era filter pills on panels. Earlier draft (v0.2) specified these
  as "additive or subtractive"; the spec was under-thought. Pulled
  in v0.3 pending proper design.
- Type filter pills on panels. Same reason.
- Explicit save-preset or share-preset affordances.
- Resume-where-I-left-off beyond session cookie defaults.

The era vocabulary (`seeds / medusas / rwth / solo` for HR; per-artist
for others) is preserved as a **data-layer** concern. Facts, archive
cards, and artifacts carry era tags and the fact selector (§C.5.1)
weights on era. What v1 does not do is surface era as a
visitor-operable filter UI — that's the preplanning item.

### C.5.1 — Fact Scroller (P1)

| Aspect | Behavior |
|---|---|
| Entry at top of panel | A single fact card appears. Two lines of text. |
| Ambient cycling | Facts cycle at ~8-second intervals when the visitor is not interacting. Visitor interaction (scrolling, tapping) pauses cycling for ~20s. |
| Selection logic | Facts matching the active album/track/era weight higher. Facts already seen this session weight down. Random tiebreak. (See vision lock §2 Gap B for era-awareness details; v1 adds era to the selector per T-08.) |
| Card contents | Two lines of text. Optional small source indicator (link icon if the fact has a source URL; no preview, just a link to tap). |
| Interaction | Tap the card → opens the fact in a slightly larger view with its source link and a "remember this fact" affordance that bookmarks it to the current session. |

**Ambient detail (aphantasia-friendly description):** cards replace
with a cross-fade — the outgoing card reduces opacity to zero over
~800ms while the incoming card rises from zero opacity over the same
interval. No motion across the screen. No flips, slides, or spins.
The viewport stays still.

### C.5.2 — Social Archive (P2)

Rich cards, not doors (vision lock item #5). Each card is a
standalone thing the visitor can absorb without clicking through.

| Card type | Behavior |
|---|---|
| Facebook embed | Uses the FB embed SDK. Loads inline. Visitor can read the post without leaving the museum. |
| Press clip | Title, publication, date, pull quote. Tap → expands to show a longer excerpt. Never the full article (that's an external link if needed). |
| Historical post | A curator-written description of a moment in the artist's history. Visual anchor (an image or a header), description text, date. |
| Interview | Same rich-card treatment. If video, plays inline; does not take over the viewport unless expanded. |

**Filtering:** See §C.5.0. Filter pills are deferred to the preset
preplanning session. In v1, the cards surfaced in P2 are those
relevant to the active spine position (album/era); when the visitor
moves the spine to a different position, the card set changes
accordingly. Cross-era browsing of P2 content is out of scope for
v1 until the control surface is designed.

**Per vision lock T-06:** If an exhibit's P2 content is shallow, the
panel is still present; cards dwell longer in the ambient cycle
(§C.5.4 cross-panel rhythm). The panel does not get hidden for being
thin.

### C.5.3 — Artifacts (P3)

Per `PANEL3_ARTIFACTS_SPEC_v0.1.md` — this section abstracts the
existing spec to UX terms.

| Card type | v1 behavior |
|---|---|
| Poster | Image, event name, date, venue. Tap → expands to full-width. |
| Setlist | Transcribed setlist from a specific show. Date, venue, song list. Each song line is tappable, goes to that track in the tracklist if matching. |
| Photo | Single image, caption, date. Expand to full-viewport view with caption overlay. |
| Fan art | Creator credit prominent (Abundance Principle). Image, creator name (tappable → external link to creator's own space, via the Gift Shop pattern in spirit — but this is in-exhibit so it's a direct external link with a "you are leaving" indicator). |
| Handwritten | Image of handwriting, transcription below, context. |
| Video | Thumbnail + duration. Tap plays inline within the card (does not take over the main player). |
| Ticket | Image, event, date. |

**Filtering:** See §C.5.0. Era pills and type pills are deferred to
the preset preplanning session. In v1, the cards surfaced in P3 are
those relevant to the active spine position; type-level narrowing
is out of scope until the control surface is designed. The existing
Panel 3 spec (`PANEL3_ARTIFACTS_SPEC_v0.1.md`) described a
subtractive filter pattern; that pattern remains a candidate for
how P3 behaves post-preplanning, not a v1 commitment.

**Credit convention (Abundance Principle):** Fan contributions — fan
art, fan recordings, contributed photos — show the creator's name
prominently. The creator's external link (if they provided one) is a
tap target on the card. The museum amplifies the contributor.

### C.5.4 — Exit Flow / Journal (P4)

P4 is a composite panel: the exhibit's journal (visitor-facing guest
book at the exhibit level) lives here alongside "what's next" content.

| Element | Behavior |
|---|---|
| Journal column | Sticky on the right on desktop; separate tab on mobile. Prompts are context-aware (see §C.6). Latest featured journal entries visible below the prompt. |
| Quick/deep/highlight cards | Per existing `hr_exit_flow.js` schema: types are `quick`, `deep`, `highlight`. Each is a card in the main P4 scroll. Quick = a short reflection prompt. Deep = a long-form piece. Highlight = something the curator wants visible. |
| Coming soon / next | If the artist has next content (an announced album, a tour), this surfaces here. Curator-controlled. |

**v1:** P4 works with the existing schema. For future exhibits with
thinner content, the panel is still present — cards dwell longer;
the panel is not hidden for being thin (vision lock T-06).

### C.5.5 — Cross-panel ambient rhythm

Panels do not all move at once. The ambient cycle is staggered:

| Panel | Cycle interval (v1) |
|---|---|
| P1 Fact Scroller | 8 seconds |
| P2 Social Archive | Does not ambient-cycle. Static until visitor interacts. |
| P3 Artifacts | Does not ambient-cycle. |
| P4 Journal | Does not ambient-cycle. |

Only P1 has ambient motion. This is deliberate: the Fountain Principle
says "a little water moves; most water is still." P2/P3/P4 are read
at the visitor's pace. P1 is the museum's heartbeat.

### C.6 — Context capture and guest book granularity

Per vision lock C-06: every contribution captures context at write
time. Inside the exhibit, that context includes which panel was in
focus, which album/track was active, which fact was visible, etc.

**Granularity (v1, per C-10):**

| Context scope | Where the contribution attaches |
|---|---|
| Exhibit-level | P4 journal (visible throughout the exhibit) |
| Album-level | Derived from context: a contribution written while Album X is active is tagged to Album X and surfaces when that album is re-entered. |
| Track-level | Same: write while Track Y is playing, contribution tags to Track Y. |
| Panel-level | Contributions can be filtered by which panel the visitor was in when they wrote. Rarely surfaced to the visitor; mostly an internal editorial dimension. |

**Per-show granularity is NOT in v1** (vision lock §5 D-01). Shows
are not spine nodes in v1. A contribution about a specific show
lives at the album-level (if the show is tied to an album's release
or era) or the track-level (if the contribution is about a
particular performance).

### C.7 — Exit from an exhibit

Per vision lock §1 #11, the exhibit has one exit: the Gift Shop.

**How the visitor exits:**
The two top-bar words — `WEIRD.BABY` (top-left) and `GIFT SHOP`
(top-right) — are the exit affordances. Both route to the Gift
Shop. Both are always visible, on every internal surface of the
exhibit, per §H.1. See §H.2 for the specific tap behavior.

There is no additional exit element. Earlier v0.1 draft proposed a
bottom-right element and an end-of-panel element; both were dropped
in v0.2. The two top-bar words are sufficient: always visible,
self-labeled, unambiguous.

**What does NOT count as an exit element:**
- The browser back button — honored but not encouraged. Fades
  playback as an exit does (vision lock §1 #14).
- Typing the URL to another room — same, honored, fades playback.

**Exit behavior on tap:**
1. Visitor taps a top-bar exit word.
2. Playback fades (~1.5s, §C.3.4 fading state).
3. Exhibit content fades with the audio.
4. Gift Shop loads, bell plays on entry (§F.2).

There is no "are you sure?" on the exit tap. The exit is
deliberate; the visitor chose it.

### C.8 — Fountain audit (Exhibit general)

The exhibit is the museum's deepest surface. It can afford to
surface more than the Lobby. But it still follows the Fountain
Principle.

| Pattern | Fountain or firehose? | Why |
|---|---|---|
| Shelf (spine) | Fountain | Fixed shape, finite tiles, present at all times |
| Tracklist | Fountain | One album's tracks, bounded |
| P1 Fact Scroller ambient | Fountain | One card at a time, cycles at a stately pace |
| P2 Social Archive | Fountain | Visitor-paced scroll, no infinite-load |
| P3 Artifacts | Fountain | Same |
| P4 Journal | Fountain | Written by visitors but curator-featured; no firehose stream |
| Cross-album navigation | Fountain | Visitor chooses via spine; no "recommended next" pushing |

No part of the exhibit is a firehose. The closest is P1's cycle, and
8-second intervals are deliberately unhurried.

---

## §D — Exhibit: Hunter Root specifics

Additions and overrides to the general pattern (§C) for the HR
exhibit.

### D.1 — Exhibit posture

| Dimension | HR's stance |
|---|---|
| Voice overlay | Papa Weird.Baby + HR's own public-facing tone (gentle, earnest) read from the content Mike curates |
| Pace | Deliberate. HR rewards time. |
| Visitor goal (implied) | Fall deeper into the discography and the person behind it |

### D.2 — Spine tiles (per vision lock T-07, Q-07 (b))

Nine spine tiles, left to right:

| Position | Tile | Era tag | Notes |
|---|---|---|---|
| 0 | Seeds | seeds | Pre-discography. Content authoring pending (vision lock G6, §5 D-10 for content). |
| 1 | Medusa's Disco | medusas | Pre-discography second identity. Best-of tracks. |
| 2 | Run With The Hunt (RWTH) | rwth | Pre-discography solo identity. 14 archive folders preserved; MP3 delivery is v1.5 dependent (§C.3.2). In v1, RWTH tiles are present on the shelf but track playback is limited to whatever YouTube has. |
| 3 | They Finally Cracked Me | solo | 2018, 11 tracks |
| 4 | Life Inside A Wheel | solo | 2019, 13 tracks |
| 5 | Mimicking the Sun Like Dandelions | solo | 2020, 11 tracks |
| 6 | Skipping Stones That Sink Before They're Thrown | solo | 2021, 10 tracks |
| 7 | Arkansas | solo | 2023, 12 tracks — **default active on entry** |
| 8 | Crooked Home | solo | 2025, 14 tracks |

**Tile rendering consistency:** all 9 tiles follow the same shape
(cover art, year, title, accent color, active-state highlight).
Pre-solo tiles need cover art chosen (Seeds, MD) — curator task per
vision lock T-07.

**RWTH specifics (v1 limitation):**
- The RWTH spine tile is present on the shelf from day one of v1.
- Tracks shown in the tracklist come from the archived catalog.
- Tracks without YouTube IDs show as non-playable (per §C.4). In v1,
  most RWTH tracks fall into this bucket.
- When v1.5 lands (R2 audio pipeline, G5), the MP3 sources surface
  and those tracks become playable.
- UX behavior on a non-playable track: the row is dimmed slightly,
  shows a quiet "coming" indicator. Tapping it expands the track's
  details (if there are any artifacts tied to it in P3) but does
  not attempt playback.

**v1.5:** RWTH tracks with MP3 sources become source-agnostic
playable via the persistent player. The source indicator in the
player bar distinguishes YouTube vs MP3 (e.g., a subtle glyph).

### D.3 — Fact queue (HR-specific rules)

Per vision lock T-08, the era vocabulary is `seeds / medusas / rwth
/ solo`. HR's P1 Fact Scroller uses all four.

**Fact selector weighting (v1, extends §C.5.1):**
- Facts matching the active album/track score higher (existing
  behavior).
- Facts matching the active era (when no album is matched, or in
  addition to album match) score higher (new in v1 per G7).
- Facts with type `intro` always score top; used as the "opening
  fact" when the exhibit is first entered.
- Facts seen this session score down.

**Content authoring (curator task, not UX):** The `hr_facts.js` file
needs validation (per Mike's memory — several facts unverified). UX
spec does not specify which facts; it specifies that the selector
surfaces them under the rules above.

### D.4 — `/hr/archive` (retired in v0.2)

Killed as a v1 visitor surface per Mike's review. Rationale:
Weird.Baby's curatorial posture is "curated, not comprehensive."
A standalone discography-grid-with-expandable-tracklists surface
duplicates the job of the spine + Tracklist panel that the exhibit
already provides, and frames the museum as a reference source
rather than a curated walk.

The file `src/routes/hr/HrArchive.jsx` remains in the repo (no
delete pass required for v1). It is simply not linked from any
visitor-accessible UI:

- No `/hr/archive` link in the exhibit's top bar.
- No `/hr/archive` link in P2 or elsewhere.
- Direct URL access redirects to `/` per §A.2.

The P2 Social Archive panel inside the HR exhibit is the archive
visitors see. That panel is curated and editorially ordered, driven
by the active spine position, and honors the Fountain Principle.
(Control surfaces for panel narrowing are deferred to the presets
preplanning session — §C.5.0.)

**Post-v1:** If a deeper chronological browsing experience ever
becomes desirable, it should be spec'd fresh against the vision
lock's curatorial principles — not revived from the v0 file.

### D.5 — Lyric Map (retired in v0.2)

Killed as a v1 visitor surface per Mike's review. The Lyric Map
file at `src/routes/hr/workshop/LyricMap.jsx` remains in the repo
but is not a v1 surface:

- Not linked from the HR exhibit.
- Not linked from the Lobby.
- Not linked from the Gift Shop.
- Direct URL access redirects to `/` per §A.2.

Rationale: the Lyric Map is a multi-artist research tool (HR + Bob
Dylan + Tom Petty per portfolio). As a visitor surface it creates
an identity conflict — non-HR content inside an HR exhibit path
breaks the "this exhibit is HR's space" principle. As a standalone
museum surface it would be a fourth room-type, which vision lock
§1 #15 explicitly rules out.

**Post-v1:** The Lyric Map could become a curator-side research
tool (not a visitor surface) or be re-imagined as exhibit-specific
per-artist (lyrics for HR inside HR, lyrics for CB inside CB). Both
are out of scope for v1.

### D.6 — HR-specific P2/P3/P4 content

Existing files: `hr_archive.js`, `hr_artifacts.js`, `hr_exit_flow.js`,
`hr_journal_prompts.js`. All UX-active per the general pattern in §C.

**Known content gaps (for Mike's curator backlog, not UX):**
- Facts validation pass (hr_facts.js)
- Pre-solo tile content authoring (Seeds, MD, RWTH)
- P3 artifacts for pre-solo eras

UX spec does not constrain the content, only how it renders.

---

## §E — Exhibit: Carsie Blanton specifics (prepared, not implemented in v1)

**v1 scope (per v0.3 review):** The CB exhibit is **not a visitor-
reachable surface in v1.** The `/cb` route is dormant (same treatment
as `/hr/archive` and `/hr/workshop/lyric-map` — §A.2). No Lobby
carousel poster for CB in v1; the All Exhibits carousel contains
only HR until CB is ready.

**What CB's "prepared" state means:**

- Data files exist in the repo (`cb_discography.js`, `cb_facts.js`,
  `cb_archive.js`, `cb_artifacts.js`, `cb_exit_flow.js`,
  `cb_journal_prompts.js`) but are not wired into a v1 visitor
  surface.
- The exhibit component (per §C.0) is generalized to accept CB as
  one of N artists — the infrastructure is proven out on HR and
  is ready to receive CB as a content-only addition.
- When CB is ready to launch, bringing her live is a curator task:
  (a) author a museum poster for her, (b) curate Papa's voice
  overlay on her panels, (c) activate the `/cb` route, (d) add CB's
  poster to the Lobby carousel. No code work.

### E.1 — Why CB is deferred

Two reasons:

1. **Content depth.** Portfolio reports confirm CB data is shallower
   than HR's. Launching CB at thin content-depth would violate
   "every surface satisfying in itself" (§1 #5). Better to land her
   exhibit at the same depth as HR's.
2. **Focus on infrastructure.** v1's critical path is landing the
   generalized exhibit pattern (§C.0) using HR as the first
   instantiation. Any effort on CB in v1 is effort not spent on
   proving the infrastructure.

### E.2 — What must be ready for CB's eventual launch

This is the handoff checklist for when CB is ready. UX-level items
only (content items are a curator backlog, not UX):

| Item | UX implication |
|---|---|
| CB's museum poster | The Lobby carousel gains its second poster. Same museum-authored design grammar as HR's poster (§B.5). |
| CB's default active spine position | Curator decision expressed in the artist config. Recommendation: her flagship or most-recent album. |
| CB's era vocabulary | Per-artist. CB's eras are TBD by the curator and may not match HR's `seeds / medusas / rwth / solo`. The exhibit infrastructure accepts any era set. |
| CB's cover art | All `art:` fields currently null. Fallback rendering (typography + accent) should be sufficient if Bandcamp-style cover images are never supplied. |
| CB's voice overlay | Papa + CB's own public tone — a content-authoring task, not a UX spec task. |

### E.3 — CB's open content questions (not UX)

Flagged so the content-authoring pass can resolve before CB goes
live:

- Album boundary questions (Down in the Streets, Body of Work, Not
  Old Not New)
- Third track of the 2013 EP
- Cover art for all albums
- CB's era vocabulary (which eras? how do they map to her catalog?)
- Curator line and museum poster copy for CB

### E.4 — When CB becomes live

The transition from "prepared" to "live" is a single curator action
that requires no UX spec changes:

1. Activate `/cb` route (remove from dormant list).
2. Add CB's museum poster to the Lobby's All Exhibits carousel.
3. Optionally: promote CB to the Featured Exhibit slot (Mike's
   call).
4. Deploy.

From that deploy onward, CB's exhibit behaves per §C (general
pattern). Every rule in §C applies without modification — that's
the whole point of §C.0.

---

## §F — Gift Shop

Per vision lock §1 #11, #13, #14 and G-07. The Gift Shop is a merch
room and the museum's only true exit.

### F.1 — Posture and voice

| Dimension | Gift Shop's stance |
|---|---|
| Voice | Papa Weird.Baby — same as the Lobby, maybe slightly warmer (the visitor is about to leave or cross over) |
| Mascot | Weebie visible (W.B.-branded surface per vision lock C-11) |
| Goal | Present merch options cleanly. Let the visitor exit to an artist's store if that's their path. Let them return to the Lobby. |
| Not goal | Cross-sell between exhibits. Push subscriptions. Collect email. |
| Fountain vs firehose | Fountain — a small bounded set of options |

### F.2 — Entry behavior (including bell)

Per vision lock §6 Q-09 answer (Mike: "bell like the spec said"):

| Entry source | Behavior |
|---|---|
| From an exhibit | Exhibit playback fades out (~1.5s, §C.3.4). Gift Shop loads. **Bell plays on arrival** — a one-shot audio cue, the "shop-bell.mp3" the current `/shop` code stubs. Duration ~1–2s. Single fire, no loop. |
| From the Lobby | Gift Shop loads. Bell plays. |
| Direct URL (redirected to Lobby first) | Lobby loads. Visitor still needs to click through to Gift Shop. Bell plays on that click-through. |

**Bell semantics:**
- One-shot cue. Does not loop.
- Room tone after the bell is silent.
- If the visitor re-enters the Gift Shop within the same session
  (exits to Lobby, comes back), the bell plays again. It is an
  arrival cue, not a one-time-per-session thing.
- Bell does NOT play if the visitor opens the Gift Shop and
  immediately closes the tab or navigates out (some browsers gate
  autoplay even for short cues; the "tap to hear" pattern from §C.3.3
  applies — if audio is gated, the bell is silent and no fallback
  UI is needed).

**Rationale:** The bell makes the Gift Shop feel like a threshold,
not just another page. Ties to the physical-space metaphor. Per
aphantasia convention: this is a *behavior* (short cue on entry),
not a "vibe" — the museum rings a bell because you walked in.

**v1.5:** The bell file needs to actually exist at
`/sounds/shop-bell.mp3` — currently referenced but missing (portfolio
§2.1). This is a content/deploy task, not a UX change.

### F.3 — Contents (v1 panels)

| Panel | Presence | v1 state |
|---|---|---|
| Welcome (Gift Shop variant) | Top | Papa's voice, one line: e.g., "the gift shop. look around." |
| W.B. Merch | Primary | Merch slots for Mike's own legal content. In v1, mostly marked "coming soon" — no cart, no purchase in v1 (vision lock §5 D-04). Each slot shows the item concept with a "coming" state. |
| Artist Stores | Primary | One card per featured artist. Each card: artist name, a short curator line ("buy direct from HR"), and a single outbound link to the artist's own store. |
| Back to Lobby | Low presence | A small element at the bottom. Tap → back to Lobby. |

Panels the Gift Shop does NOT have:
- Friends wall (deleted per Mike's direction)
- Roster of exhibits (that's the Lobby's job per vision lock G-06)
- Subscription / email signup
- "Recommended for you" merch

### F.4 — Artist Store exits (the museum's only outbound)

Per vision lock §1 #13: the Gift Shop is the only place the museum
links outbound, and only to the featured artists' own stores.

**Per-artist card behavior:**

| Element | v1 behavior |
|---|---|
| Artist name | Prominent |
| Curator line | One line from Papa: "buy from HR direct." / "support CB." — text is curator-authored per artist |
| Outbound link | One primary outbound link per card: the artist's own store URL. For HR: `hunterroot.com`. For CB: her Bandcamp or direct store. |
| "You're leaving" affordance | Tap/click opens an interstitial: "you're about to leave Weird.Baby for [artist]'s own store. continue?" with two choices: "yes, take me to [artist's domain]" and "no, stay". |

**Why the interstitial:** The museum has exactly one way out, and
crossing that boundary is worth acknowledging. The interstitial
also makes the Abundance Principle visible to the visitor — the
museum is deliberately sending you *to* the artist, not
aggregating them.

**Interstitial is NOT:**
- A dark pattern (no countdown, no "are you sure you want to leave",
  no friction beyond one confirmation)
- A tracking moment (no "x people have clicked through this week")
- A pre-leave ad ("before you go, check out...")

**v1.5:** The W.B. merch cards become real purchasable items when
Mike's own catalog is ready. Stripe integration + cart. Until then,
"coming soon" is the honest state.

### F.5 — Return to Lobby

Single element at the bottom of the Gift Shop. Tap → Lobby.

No interstitial (the visitor is staying in the museum). No bell on
Lobby re-entry (the bell is specifically a Gift Shop arrival cue;
the Lobby is always silent).

### F.6 — Ambient behavior (Gift Shop)

| Behavior | Description |
|---|---|
| Welcome line rotation | Same pattern as Lobby — a small set of Papa-voiced lines. "the gift shop." / "look around." / "take your time." |
| Merch slots | Static. v1 content is minimal; no ambient motion. |
| Artist store cards | Static. |

No P1-style fact scroller in the Gift Shop. Fact scrollers belong to
exhibits; the Gift Shop is shell.

### F.7 — Fountain audit (Gift Shop)

The Gift Shop is a quiet room. It has one job in v1 (present artist
store exits), two eventual jobs in v1.5+ (the same, plus W.B. merch
purchase). It resists becoming a landing page.

| Anti-pattern | Why not |
|---|---|
| Featured product carousel | V1 has minimal merch; no carousel needed. Even in v1.5, resist. |
| "Customers also bought" | Museum isn't a store with cross-sell mechanics |
| Urgency signals ("only 3 left!") | Breaks the museum posture |
| Social share ("share Weird.Baby!") | Museum isn't a thing you share; it's a thing you find |

---

## §G — Account-holder Surfaces (v1 stub)

Per vision lock §5 D-03, accounts are deferred to post-v1. v1 uses
session cookies only (vision lock T-02, T-03).

**What this means for UX in v1:**
- No login / signup surfaces.
- No "your profile" / "your contributions" / "your history" pages.
- No account-scoped badges (Founding Visitor is
  contribution-scoped, not account-scoped, per vision lock C-09).
- No email capture.
- No notification settings.

**What the session cookie enables (without an account):**
- "Since last visit" state on Lobby guest book prompt (T-03).
- "Remember this fact" bookmarks in P1 (§C.5.1) — session-scoped.
- Muted-autoplay remembers visitor's unmute across tracks in the
  same session (§C.3.3).
- Default exhibit on re-entry (v1.5) picks up where the visitor left
  off, per browser session.

**v1.5:** Source-agnostic playback history persists across sessions
on the same browser. Still no account.

**Post-v1 (vision lock §5 D-03):** Lightweight accounts via Clerk.
"Claim your anon contribution" flow. Out of scope for this spec.

---

## §I — Ambient Behaviors (cross-surface)

What moves on its own, what reveals over time, what the museum does
when the visitor is not actively interacting. Cross-surface view.

### I.1 — The museum's heartbeat

The museum breathes but does not move restlessly. The aphantasia
convention applies: everything that moves has a stated behavior and a
stated reason.

| Surface | Ambient behavior | Frequency | Trigger |
|---|---|---|---|
| Lobby — Welcome line | Cycles through curated variants | Per load, stable within a session | Curator-set list |
| Lobby — Featured entries | Rotates which featured entry is at top (if 3+) | Per load, deterministic per session | Session hash |
| Lobby — Guest book prompt | Cycles through variants | Per load | Curator-set list |
| Exhibit — P1 Fact Scroller | Cross-fades facts | Every 8 seconds | Timer, pauses on interaction |
| Exhibit — P1 after interaction | Pauses cycling | 20 seconds | Any tap/scroll |
| Exhibit — Shelf breath state | Transitions between full/compact/minimal | Visitor-driven (scroll or panel entry) | Position-based |
| Exhibit — Player state | Transitions between quiet-ready/playing/paused/fading/gone | Visitor-driven + exit events | Events |
| Gift Shop — Welcome line | Cycles through variants | Per load | Curator-set list |
| Gift Shop — Bell | One-shot audio cue | Per entry | Room-entry event |

**Nothing else moves ambiently.** P2/P3/P4 panels are static until
the visitor interacts. No auto-scroll, no ticker tape, no
carousel-on-a-timer.

### I.2 — What reveals over time

Some content surfaces gradually rather than being present all at
once. Per vision lock: "The museum follows your lead. It never
takes over."

| Reveal | When | How |
|---|---|---|
| New featured entries | When Mike features them via `/admin` | Appears on next load; no "new!" banner |
| New spine tiles | When Mike adds an album or era | Appears on next load |
| New exhibits | When Mike publishes a new exhibit | Appears in Lobby's All Exhibits and in Gift Shop's Artist Stores |
| Founding Visitor badges on prior contributions | Permanent once earned; visible always | No reveal animation; the badge is always-on |

**Reveals do NOT include:**
- "You have 3 new facts since last visit" — no count, no new indicator
- "Trending now" — museum doesn't trend
- Push/email notifications — no email capture

### I.3 — Cross-session state (what the cookie remembers)

| State | Scope | Persistence |
|---|---|---|
| Session ID | Single session | Lifetime of session cookie (48h proposed; browser-session default acceptable) |
| Visitor name (from guest book) | Single session | Session cookie; offered as default name on next contribution in same session |
| Unmute state | Single session | Session cookie; reset per new session |
| Last exhibit visited | Single session (v1); cross-session (v1.5) | Cookie |
| Remembered facts (P1 bookmarks) | Single session (v1); cross-session (v1.5) | Cookie |
| Last seen timestamp | Single session | Cookie; drives "welcome back" copy |
| Founding Visitor status | Permanent (attached to contribution row) | D1 column on contribution |

### I.4 — The Fountain Principle applied cross-surface

Per vision lock — the museum surfaces information as a fountain
(a small volume visible at any moment, continuously cycling) rather
than a firehose (all content visible at once).

**Fountain implementation across surfaces:**

| Fountain mechanism | Where applied |
|---|---|
| Ambient cycling with visitor-pause | P1 Fact Scroller |
| Curator-featured selection with rotation | Lobby featured entries, welcome lines |
| One-at-a-time focus | Exhibit entry (one default active tile, one default track) |
| Bounded set (not a feed) | All Exhibits chooser (finite list), Gift Shop (finite merch + finite artist stores) |

**Firehose anti-patterns explicitly rejected:**
- Infinite scroll
- "Trending" or "popular" sorts
- Algorithmic recommendations ("because you liked...")
- Activity feeds ("5 new contributions today")
- Notification badges on UI elements
- Red-dot unread indicators

---

## §J — Interaction Catalog

Every discrete action a visitor can take in v1 and what happens.
Organized by room. Deliberately exhaustive so the implementer has a
checklist.

### J.1 — Lobby interactions

| Action | Result |
|---|---|
| Load `/` | Lobby renders; session cookie checked; first-time or returning copy chosen |
| Tap `WEIRD.BABY` (top-left) | Micro-acknowledgment; no navigation (already home) |
| Tap `GIFT SHOP` (top-right) | Lobby fades → Gift Shop loads; bell plays (§F.2) |
| Tap Featured Exhibit panel | Lobby fades → that exhibit loads (§C.1) |
| Tap a row in All Exhibits | Same; that specific exhibit loads |
| Tap Gift Shop exit panel element | Same as the top-right `GIFT SHOP` tap — Lobby fades → Gift Shop loads; bell plays |
| Tap guest book prompt (before signing) | Focus lands in the entry field |
| Type in the entry field | Characters appear |
| Tap Submit on guest book | Contribution written; inline acknowledgment; undo available for 5s |
| Tap Undo within 5s of submit | Contribution retracted; returns to pre-submit state |
| Tap a featured guest book entry | Expands inline to show full entry; tap again to collapse |
| Type `mmm` | `/admin` opens in-place (curator-only easter egg — §K.5) |
| Browser back | No history in this direction; the browser's own behavior (previous site) |
| Close tab | Session cookie persists; no cleanup needed |

### J.2 — Exhibit interactions (general; applies to HR and CB)

| Action | Result |
|---|---|
| Enter exhibit (from Lobby) | Exhibit loads; player in quiet-ready with default track; P1 starts cycling |
| Tap `WEIRD.BABY` (top-left) | Exhibit fades → Gift Shop loads; bell plays. No confirmation (§H.2). |
| Tap `GIFT SHOP` (top-right) | Identical behavior — exhibit fades → Gift Shop loads; bell plays. |
| Tap a spine tile | That tile becomes active; panels re-populate; player re-primes with that album's opening track; does NOT auto-play |
| Scroll the shelf (desktop) | Shelf moves horizontally; no auto-center |
| Swipe the shelf (mobile) | Same |
| Tap the active tile | Tracklist opens as the focused panel |
| Tap a track in the tracklist (playable) | Player transitions to playing with that track; unmute if needed (first tap of session) |
| Tap a track (non-playable, no ytId) | Track row expands to show whatever details exist (P3 artifacts, etc.); no playback attempt |
| Tap play/pause on player bar | Toggles playback |
| Tap expand on player bar | Full-height player view opens; video visible (YouTube); album art (v1.5 MP3); tap to collapse |
| Scroll into panels (below the shelf) | Shelf transitions to compact state; panels scroll into view |
| Tap a P1 fact card | Fact expands slightly; source link + "remember this" affordance visible |
| Tap "remember this" on a fact | Fact saved to session bookmarks (v1 scope: visible somewhere in session; no dedicated bookmarks view in v1) |
| Tap a P2 card (FB embed) | Embed interaction per FB SDK; stays inline |
| Tap a P2 press clip | Card expands in place to show longer excerpt |
| Tap era pill in P2 or P3 | Pill toggles; cards filter |
| Tap a P3 artifact (photo) | Expands to full-viewport view; tap elsewhere to dismiss |
| Tap a P3 artifact (video) | Plays inline in the card; does not take over main player |
| Tap a fan art creator link | "You're leaving" interstitial → external link (same pattern as §F.4 artist store exits) |
| Tap P4 journal prompt | Focus lands in entry field; context snapshot captured (C-06) |
| Submit a journal entry | Written with full context; inline acknowledgment; 5s undo |
| Tap a featured journal entry | Expands; tap to collapse |
| Browser back (out of exhibit) | Honored; playback fades as an exit would |
| Type `mmm` | Admin overlay (easter egg — §K.5) |
| Close tab | Playback stops; session cookie persists |

### J.3 — Gift Shop interactions

| Action | Result |
|---|---|
| Arrive (any path) | Gift Shop loads; bell plays |
| Tap `WEIRD.BABY` (top-left) | Goes to Lobby; no bell re-trigger |
| Tap a W.B. merch slot (v1) | Shows the "coming soon" detail; no purchase |
| Tap an artist store card | Interstitial: "you're about to leave..."; confirm → external link opens |
| Tap interstitial "no, stay" | Interstitial dismisses; still in Gift Shop |
| Tap interstitial "yes" | External URL loads (new tab recommended for UX continuity, but curator-settable) |
| Tap back-to-Lobby panel element | Same as top-left tap — Gift Shop fades; Lobby loads |
| Type `mmm` | Admin overlay (easter egg — §K.5) |
| Close tab | No cleanup |

### J.4 — Global interactions (any room)

| Action | Result |
|---|---|
| Resize window | Layout reflows responsively; no state change |
| Network loss | Current surface stays rendered; any pending submit queues with a "reconnecting" quiet indicator (retry on reconnect) |
| Slow connection | Content loads progressively; never a blocking spinner on the full viewport (per vision: every surface satisfying in itself — means something useful renders first) |
| Keyboard Escape | Dismisses any open expanded view (fact, artifact, interstitial) |
| Keyboard Tab | Focus cycles through interactive elements in reading order |
| Keyboard Enter on a focused element | Same as tap |

### J.5 — What is deliberately NOT interactive

| Non-interaction | Rationale |
|---|---|
| Hover preview of exhibit from Lobby (desktop) | Visitor should enter the exhibit; no peek |
| Right-click context menu enhancement | Use browser default |
| Drag-and-drop anywhere | No drag-reorder, no drag-upload in v1 |
| Pinch-zoom on images | Use browser default (accessibility) |
| Keyboard shortcuts beyond tab/escape/enter | Only `mmm` (admin); no `Shift+?` help overlay in v1 |

---

## §K — Fountain Principle Audit (per surface)

Per vision lock and Mike's repeated direction: the museum is a
fountain, not a firehose. This section audits every surface against
that principle and justifies.

### K.1 — Lobby

**Fountain.** Five bounded panels. Welcome is one line. Featured
Exhibit is one exhibit. All Exhibits is a finite list (2 in v1,
bounded forever by the number of exhibits Mike has curated). Guest
book shows 0–3 featured entries, not a feed. Gift Shop exit is one
element.

**Ambient motion:** Welcome line cycles per load. Featured entries
rotate. Nothing streams.

**Firehose risk:** Low. Potential creep: a "recent activity" panel
would turn the Lobby into a feed. Explicitly rejected in §B.11.

### K.2 — Exhibit (all exhibits)

**Fountain at the room level.** The exhibit is spacious — multiple
panels with real content — but no panel is a firehose.

**Per-panel audit:**

| Panel | Fountain verdict | Notes |
|---|---|---|
| Shelf | Fountain | Finite tiles (9 for HR, 11 for CB); always visible; doesn't grow on visit |
| Tracklist | Fountain | One album's tracks |
| P1 Fact Scroller | Fountain | One card at a time, 8s cycle |
| P2 Social Archive | Fountain | Visitor-paced scroll, finite cards, filters not a search |
| P3 Artifacts | Fountain | Same |
| P4 Journal | Fountain | Featured entries + prompt; no full-history feed |

**Ambient motion:** P1 cycles. Shelf breath-states transition on
visitor action. Nothing else.

**Firehose risk:** Medium. The exhibit is where the museum feels
richest; it's tempting to add "related tracks" or "other visitors
are reading" panels. Each addition must pass the Fountain audit.

### K.3 — Gift Shop

**Fountain.** Small set of panels, each with a bounded content set.
One bell on arrival. No carousel, no cross-sell.

**Firehose risk:** Low. Main creep risk is adding "featured products"
rotations when W.B. merch ships in v1.5. Recommendation: resist.

### K.4 — Cross-surface

**Fountain preserved across rooms:**
- No notification system.
- No global activity ticker.
- No cross-room search.
- No "what's new across the museum" page.

The museum has no aggregation layer above the rooms. A visitor
enters one room at a time.

### K.5 — When the Fountain Principle bends

One place where the principle is deliberately stretched but not
broken: the `/admin` surface. Firehose by design — for the curator,
not the visitor. Fountain Principle does not apply.

**v0.2 clarification on `/admin`:** the `mmm` hotkey trigger is kept
as an easter egg. The commitment is that it stays an easter egg
through v1:

- Not promoted in any visitor-facing copy.
- Not documented in any visitor-reachable help text.
- Not discoverable through the visitor UI (no `?` icon, no keyboard
  hint overlay).
- Acceptable that a curious visitor who reads the source code can
  find it — that's the nature of an easter egg and does not break
  the commitment.

If the `mmm` shortcut ever starts surfacing in visitor
conversation, support channels, or analytics-visible URL patterns,
Mike's commitment is to replace with a real auth gate before any
public announcement (per vision lock §6 Q-06 answer).

**v0.1 referenced a second bend — the Archive view.** That view was
killed in v0.2 (§D.4). No second bend now exists. The museum has
one firehose surface (`/admin`) and it is not visitor-facing.

---

## §L — Edge Cases

What happens when things go wrong, or when the visitor's state
doesn't match the happy path.

### L.1 — Direct-URL redirect to Lobby

Per vision lock §1 #12, direct URLs to non-Lobby routes redirect to
`/` first.

**Mechanism:**
1. Visitor loads e.g. `/hr` directly.
2. Worker responds with a redirect to `/`.
3. The original intent (`/hr`) is captured in session state or URL
   parameter (e.g., `/?intent=hr`).
4. Lobby loads with the standard Welcome panel.
5. The All Exhibits panel shows a quiet indicator on the matching
   exhibit's row: "↓ you were looking for this one".
6. The visitor taps through normally. Their arrival at the exhibit
   is the intended one.

**Why the quiet indicator instead of an auto-redirect:** auto-
redirecting after a beat would surface the intent but violate the
"everyone enters via the Lobby" principle. The visitor is properly
received at the Lobby; the intent just makes their next click
obvious.

**For a direct URL to `/shop`:** same pattern; the Gift Shop exit
in the Lobby is highlighted.

**For dormant routes (`/hr/archive`, `/hr/workshop/lyric-map`, any
deep exhibit sub-path):** redirect to `/` with no intent-preservation.
These routes are not v1 visitor surfaces (§A.2, §D.4, §D.5); a
visitor who somehow arrives at their URL simply lands at the Lobby
without any extra indicator. The museum does not confirm or
acknowledge the dormant URL.

### L.2 — Empty states

| Surface | Empty state |
|---|---|
| Lobby guest book, no featured entries | Prompt only, no "no entries yet" message |
| All Exhibits carousel with 0 live exhibits | Not possible in v1 (HR is live). If the All Exhibits carousel ever has zero live exhibits: the Lobby quietly shows a single "more exhibits coming" curator line instead of the carousel. |
| Exhibit P1 with no facts matching the active context | The last-shown fact dwells; no "no facts available" state. Worst case, a single `intro` fact cycles. |
| Exhibit P2 / P3 with no matching cards at the active spine position | A small quiet line at the top of the panel: "nothing here yet." Does not block visitor from moving to other spine positions. |
| Gift Shop with no artist store links | Not possible in v1 (HR has a direct store). If an artist's store link is missing, the artist's card shows the curator line and a quiet "direct store coming" state. |

Empty states never apologize, never promote alternatives, never ask
the visitor to refresh.

### L.3 — First-ever visitor state

Per vision lock C-09 and §B.9. The Lobby detects a brand-new session
(no prior cookie) and surfaces the Founding Visitor prompt in the
guest book panel.

**Specifics:**
- Welcome line: "welcome." (not "welcome back.")
- Guest book prompt: "you're early. leave your name."
- Founding Visitor eligibility window is currently open (pre-
  announcement). A contribution signed during this window is
  stamped with `founding_visitor: true` and shows the labeled tag
  (C-09, Q-03).

**If the eligibility window closes mid-session:** any contributions
already signed retain the tag. New contributions in the same
session do not get the tag.

### L.4 — Stale-session states

**Returning visitor after >48h (session cookie expired):** treated
as a brand-new session. Welcome is "welcome." The `last_seen_at`
logic doesn't fire because there's nothing to compare against.
Acceptable in v1.

**Returning visitor with partial cookie corruption:** the session
cookie has a known schema; missing fields fall back to defaults.
E.g., if `unmute_state` is missing, the player loads muted (the
safe default).

### L.5 — Slow-connection states

Per vision (§5 every surface satisfying in itself) — never a blocking
spinner on the full viewport.

| Surface | Slow-connection behavior |
|---|---|
| Lobby | Welcome + Featured Exhibit panel render first; All Exhibits and Guest Book progressively enhance |
| Exhibit | Shelf renders first (from local JSON); Tracklist next; Player loads in parallel (YouTube iframe); P1–P4 progressively |
| Gift Shop | Welcome + Artist Stores render first; bell plays when audio decodes (may be briefly delayed on very slow connections) |

**Broken YouTube iframe:** per portfolio, if a track's video is
taken down, `buildPlayQueue` skips it silently. UX behavior: the
track row in the tracklist still appears but with the non-playable
indicator (§C.4). If a visitor taps it, the expanded detail shows
whatever else exists (P3 artifacts) without attempting playback.

### L.6 — Error states

| Error | Behavior |
|---|---|
| Network loss during read | Current surface stays rendered; no error message. Any in-flight load shows a quiet retry indicator. |
| Network loss during submit (guest book, journal) | Submit queues; "will send when you're back online" quiet indicator; retries on reconnect |
| D1 write failure | Same pattern as network loss; the submit is treated as pending until confirmed |
| External link unreachable (Bandcamp, artist store) | The interstitial "you're leaving" still fires; the browser handles the unreachable target with its own error (not the museum's concern) |
| FB embed failure | Card falls back to the curator's `fact1` / description text; the embed is a progressive enhancement |

### L.7 — Accessibility

Per vision lock G-11: the museum commits to behavior-first design
because of Mike's aphantasia. This generalizes to accessibility.

**v1 accessibility commitments:**
- All interactive elements are keyboard-reachable (Tab) and
  keyboard-activatable (Enter / Space as appropriate).
- All images have alt text. P3 artifacts (photos, posters) include
  descriptive alt text; fan art includes the creator's name.
- The P1 ambient cycling pauses when `prefers-reduced-motion` is set
  by the visitor's OS.
- The Gift Shop bell is accompanied by a visible arrival state (the
  welcome line animates in) so visitors who can't hear the bell
  aren't deprived of the arrival cue.
- Color contrast on text meets WCAG AA minimums (downstream visual
  design concern).
- Screen-reader landmarks: each room has one `<main>`; panels are
  `<section>` with labels; the persistent player is `<nav>` or a
  labeled `<aside>`.

**v1.5:**
- Captions on the artist's video content (where available) — this
  is a content-authoring commitment.
- Keyboard shortcuts for the player (space to play/pause) with a
  visible list (not just `Shift+?`) if the shortcut set grows.

### L.8 — Visitor using the museum without JavaScript

v1 is a React SPA. No-JS fallback is limited:
- The Lobby renders static HTML fallback with the Welcome line, the
  list of exhibits (as links), and a "the museum works better with
  JavaScript enabled" line. No guest book without JS.
- Exhibits do not render a no-JS fallback (too much dynamic
  behavior).

Acceptable in v1. Museum visitors are overwhelmingly likely to have
JS. This is not a public-library-terminal scenario.

---

## §M — Explicit Non-Goals

Things v1 deliberately does NOT do. This list is long because
clarity about what's out of scope is how the Fountain Principle
holds up over time.

### M.1 — Content and feed non-goals

- No activity feed ("latest additions across the museum").
- No trending / popular / most-read surfaces.
- No algorithmic recommendations.
- No "people who liked X also liked Y".
- No read-progress tracking beyond session-scoped bookmarks.
- No newsletter signup. No email capture anywhere.
- No push notifications.
- No social share buttons (Twitter/X, Facebook, etc.). The museum is
  found, not spread.

### M.2 — Identity and account non-goals

- No user accounts (vision lock §5 D-03).
- No login / signup.
- No profile pages.
- No friends / followers.
- No DMs or messaging.
- No OAuth integration.

### M.3 — Commerce non-goals (v1)

- No cart, no checkout.
- No payment processing.
- No W.B. merch purchases in v1 (v1.5+).
- No affiliate links. Artist store links are editorial, not
  affiliate.
- No ad units. No sponsored content.
- No paywalled content.

### M.4 — Discovery non-goals

- No search bar in v1.
- No tag cloud / tag index.
- No artist browser by genre, year, region.
- No "shuffle play" or "random exhibit".
- No "what's new since [date]" dedicated surface.

### M.5 — Social non-goals

- No friends wall in the Gift Shop (deleted per Mike's direction).
- No "fans also enjoy" between artists.
- No cross-exhibit promotion anywhere.
- No public visitor profiles of who signed the guest book.
- No reactions on contributions beyond curator-featuring.

### M.6 — Performance / engineering non-goals

- No analytics beyond what Cloudflare Workers surface by default.
- No third-party JS trackers.
- No heatmaps / session recording.
- No A/B testing framework.

### M.7 — Format non-goals

- No native mobile app. Browser-only (PWA-capable, but not a
  dedicated app in v1).
- No desktop app.
- No browser extension.
- No Discord bot, Slack integration, etc.

### M.8 — Content-format non-goals (v1)

- No live-streamed content embedded in the museum.
- No podcast player integration.
- No TikTok / Instagram Reel embeds (vision lock §5 D-09).
- No user-uploaded audio or video (fan contribution uploads are
  post-v1 when accounts exist).

### M.9 — Interaction non-goals

- No drag-and-drop organization.
- No inline editing of museum content (visitor or curator side;
  curator uses `/admin`).
- No comment threads on contributions. A contribution is atomic; it
  surfaces or doesn't. No reply mechanism.
- No voting, upvoting, hearting.

### M.10 — Moderation non-goals (v1)

- No visitor-facing flagging UI. All moderation happens curator-side
  (vision lock T-10).
- No automated content filtering. Contributions render as-written
  until the curator intervenes.
- No visible strikethrough on removed content. Hidden contributions
  simply don't appear.

---

## End matter

### Spec horizon

- **v1** — what this document specifies as primary.
- **v1.5** — MP3 delivery via R2 (closes Portfolio Gap G5). The
  player becomes source-agnostic; the tracklist queue refinement
  lands; returning-visitor continuity extends beyond the session
  cookie; some accessibility additions (captions, expanded keyboard
  shortcuts). Annotated inline throughout the spec with **v1.5:**
  tags.
- **v2** — stems, accounts, fan playlists, lyric-map persistence,
  store/cart, Time Capsule surfacing, per-show spine nodes. Out of
  scope for this spec.

### Open questions for Mike (Phase 2)

Nothing that requires an answer before implementation can begin.
The following are notes where a curator decision will refine the
UX — but each has a defensible default that v1 can ship on.

**Q-UX-01.** Default active spine tile on CB entry. Recommendation:
a flagship album in the middle-to-recent part of her catalog.
Mike's call; v1 ships with whatever is currently set in
`cb_discography.js`.

**Q-UX-02.** Curatorial lines per artist in the Gift Shop artist
store cards. Recommendation: one line per artist in Papa's voice.
Content task.

**Q-UX-03.** Welcome line variants for Lobby and Gift Shop.
Recommendation: 3–5 lines each, Papa's voice. Content task.

**Q-UX-04.** Interstitial copy for artist-store exits. Recommendation:
keep it one-line, Papa's voice, one confirm + one cancel. Content
task.

None of these block implementation. All have sensible defaults this
spec has provided placeholder language for.

### Cross-references

| Reference | Where |
|---|---|
| Vision Lock | `C:\AI\VISION_LOCK_v0.3.md` — the source of truth for all principles cited by number |
| Portfolio state | `C:\AI\WEIRDBABY_PORTFOLIO_STATE_v0.1.md` — known existing code and data files |
| Gap report | `C:\AI\Projects\weird-baby-update\docs\MUSEUM_CODEBASE_GAPS_v0.1.md` — intent vs reality |
| Panel 3 spec (existing) | `C:\AI\Projects\weird-baby-update\docs\PANEL3_ARTIFACTS_SPEC_v0.1.md` — matches §C.5.3 |
| Fan playlists spec (deferred) | `C:\AI\Projects\weird-baby-update\docs\FEATURE_fan_playlists.md` — v2 scope |

### Implementation handoff note

This spec intentionally does not name React components, routes, D1
tables, CSS classes, or file paths. It describes what the visitor
experiences and under what rules. The implementation spec is a
downstream document that translates this into the repo's existing
scaffolding.

**Recommended next step after UX lock:** an *Implementation Spec*
that maps §A through §M onto specific components, routes, schema
changes, and build steps in `weird-baby-update/`. That document
will name things like "lift player state to a Context at
App.jsx level" and "add `founding_visitor` column to
contributions table" — naming this spec couldn't and shouldn't.

## §N — Observed behaviors promoted from code (2026-05-12)

This section records behaviors implemented in the museum's exhibit
surfaces (plus one site-shell entry) that were not previously named
in §§A–M. They are promoted to spec status here so future work has
authority. Each subsection cites the implementing code file and the
existing §-section it most relates to.

### §N.1 — Player-bar lift adjusts deck position (relates to §C, §H) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (`PlayerBar`),
`src/routes/hr/HrExhibitFlow.jsx` (deck base offset).

The persistent player (§H) renders only when audio is playing. When
the player bar is in the DOM, the bottom-pinned controls deck lifts
by the player bar's height so the deck's surfaces are not occluded.
When audio stops, the player bar leaves the DOM and the deck returns
to its base position. The bottom-of-viewport stack collapses
gracefully to current sound state.

### §N.2 — Tracklist variant selection is mutually exclusive (relates to §C) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (tracklist row variant
controls); `src/data/artists/hunter-root.js` (variant taxonomy:
Official / Live / Lyrics / Cover).

Each tracklist row may carry multiple variant videos. The tracklist
UI exposes them as variant pills beside the track title. Selection
grammar:

- At most one variant active per track at any time. Variants are
  mutually exclusive within the row.
- Clicking an inactive variant makes it active and deselects any
  previously-active variant on that row.
- Clicking an already-active variant deselects it, returning the
  row to the no-variant-selected state.

This is radio semantics (one-of-N with the option of zero), not
checkbox semantics. It is the canonical tracklist variant grammar
for the museum.

### §N.3 — Skip-back two-press behavior (relates to §C, §H) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (player controls).

The persistent player's skip-back affordance has two distinct
behaviors depending on press cadence:

- First press within ~3 seconds of playback start: restart the
  current track from position zero.
- Second press (within ~3 seconds of the first): advance to the
  previous track in the queue.

This matches the consumer-media skip-back grammar visitors already
know. It is the canonical skip-back behavior for the persistent
player.

### §N.4 — Exhibit room accepts an artist config (relates to §C) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (`artist` prop).

§C describes the exhibit room as a general pattern parameterized by
the specific artist. The implementation has been generalized: the
exhibit-room component accepts an artist config object (canonical
spine, tracks, variants, accent, per-artist defaults). New exhibits
instantiate the room with a new artist config; they do not
duplicate the room.

This satisfies §C's assertion that "the infrastructure must accept
N artists without code changes" (v0.3 reframing note). Carsie
Blanton's deferred §E status remains consistent: when CB ships, it
ships as a new artist config consumed by the existing room.

### §N.5 — Coverflow accepts drag, swipe, and keyboard input (relates to §C) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (coverflow event handlers).

The album coverflow (the shelf described in §C) responds to:

- Mouse drag — horizontal drag moves between tiles.
- Touch swipe — horizontal swipe moves between tiles.
- Arrow keys (Left / Right) — move between tiles.
- Enter — activate (select) the currently-focused tile.

All three input modalities are part of the canonical shelf grammar.
Keyboard support is not optional.

### §N.6 — Per-artist UI-state persistence (relates to §C, §D) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (`usePersist` hook).

The exhibit room persists certain per-visitor UI choices to
localStorage, keyed by artist. Current persisted state:

- Vertical split position between the coverflow and the panels
  below it.
- Coverflow height.

Per-artist keying means a visitor's split-and-height preferences for
Hunter Root do not propagate to Carsie Blanton or to any future
artist. This is consistent with §D and §E being parallel
instantiations of §C — visitor preferences should not leak across
rooms. (Dock height persistence is specified separately in
UX_CONTROLS_SPEC §4.8; this section concerns the room's own splits.)

### §N.7 — Audio-only browse overlay (relates to §C, §H) **[promoted]**

Source: `src/routes/exhibit/Exhibit.jsx` (audio-only overlay).

The persistent player keeps a track playing while the visitor
browses to a **different album** within the same exhibit. When the
on-screen album is not the album whose track is playing, an
audio-only overlay is rendered over the on-screen content,
signalling that what the visitor sees is loosely coupled to what
they hear.

This is the visitor-facing surface for the §H rule that the
persistent player crosses album-internal boundaries but does not
cross room edges.

### §N.8 — Admin shortcut: rolling-character key buffer (relates to §H) **[promoted]**

Source: site-shell global key handler (consumed inside the exhibit
surface in current code).

§H mentions an admin shortcut as part of the site shell. Promoted
specifics:

- A 3-character rolling buffer is captured at the document level
  (global key handler).
- When the buffer matches `mmm`, the admin route is triggered.
- The buffer rolls — any three consecutive matching keystrokes
  qualify. No modifier required.

This is the canonical admin-entry pattern for v1. It is
intentionally low-discoverability — the operator's contract is
that this is a private affordance, not a visitor-facing surface.

### §N.9 — Behaviors deferred to operator decision **[awaiting operator]**

The 2026-05-12 compare pass identified one further class of
observed behavior that is not promoted into canonical text here:

**Journal panel full lifecycle.** The Journal panel implements:
compose → 10s undo window → commit → vote → delete-mine, with a
weighted shuffle over the entry pool, a prompt rotation on a ~9.5s
cadence, and a feed rotation on a ~8.5s cadence (paused on hover).
Source: `src/routes/hr/HrExhibitFlow.jsx`, with prompt content in
`src/data/hr_journal_prompts.js`. Candidate canonical locations:
§C (panel mechanics — Panel 4 / Exit Flow / Journal) or a new
dedicated section. Placement is operator's call; flagged in the
2026-05-12 closure report.

---

*End of UX_SPEC_v0.1. No existing project files modified. Ground
truth: VISION_LOCK_v0.3.md.*
