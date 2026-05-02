# Weird.Baby Museum — Vision Lock

**Version:** 0.3 (locked; correction pass)
**Date:** 2026-04-21
**Status:** locked
**Status set:** 2026-04-27
**Author:** Cowork Claude (Phase 1 of vision-lock → UX-spec sequence)
**Scope:** Reconciles `C:\AI\VISION.md` (r3, 2026-04-14) against
`C:\AI\WEIRDBABY_PORTFOLIO_STATE_v0.1.md` (2026-04-21) and
`C:\AI\Projects\weird-baby-update\docs\MUSEUM_CODEBASE_GAPS_v0.1.md`
(2026-04-21). Output is a locked vision against which UX spec v0.1 can be
written without further improvisation on curatorial or strategic questions.

**Method:** The vision was not redesigned. Every assertion was checked
against portfolio reality; every place the portfolio proves something the
vision is silent about was flagged; every vague/contradictory point was
surfaced. Proposed resolutions are concrete: accept, clarify, add, or
defer. Nothing was resolved on Mike's behalf unless a clear default was
defensible; everything else went to §6.

**v0.3 changes from v0.2:** Corrected a cluster of errors around the
Gift Shop rule. In v0.2 Claude had playback carrying from an exhibit
into the Gift Shop, which contradicted the rule Mike originally gave
("when you leave exhibit, fade out"). v0.3 makes the exit rule
unconditional: no sound carries past any exit. The roster of exhibits
was also misplaced in v0.2 (put in the Gift Shop, following the
current `/shop` code); v0.3 moves it to the Lobby, which is where
visitors choose their exhibit. The Gift Shop becomes a merch-only
room with one true external exit: outbound links to artist stores.
The friends wall (currently in `/shop`) is deleted — not moved.
Specific sections rewritten: §1 #11, §1 #12, new §1 #13; C-03, G-06,
G-07, T-05, §6 Q-08 resolution.

**v0.2 changes from v0.1:** Mike's answers to §6 folded in. Q-08's
answer escalated into a new architectural principle. Everything else
in v0.1 (§1–§5) accepted as written. (See v0.1 for the baseline and
v0.3 for the current corrections.)

**Read order:** §1 for the architectural principles. §2–§5 for
details. §6 for decisions (now a record, not open questions).

---

## §1 — Vision items that survive intact

These are asserted in `VISION.md` and either confirmed by portfolio
evidence or require no reconciliation. Accept as-is; no edits proposed.

1. **The museum is the entity; artists are exhibits.** Confirmed —
   `weird.baby` is live with two artist routes (`/hr`, `/cb`) under a
   single curatorial shell, plus `/shop` and a WbHome-shaped `/`.
2. **Three identity layers — Weebie (mascot, silent), Papa Weird.Baby
   (curatorial voice), Mike Lang (future artist).** No codebase
   contradiction. Papa's voice is consistent with the FB poster's
   "terminal" persona being a separate voice for HR's Homestead (not the
   museum's).
3. **The Abundance Principle / contributor elevation.** Aspirational;
   nothing in the codebase contradicts it. Vision item, not code item.
4. **The spine as the organizing principle; branches as lenses.**
   Architecturally confirmed for the HR solo era: `SPINE` in
   `hunter-root.js`, panels rendered as lenses over it, journal sticky
   alongside. Pattern is sound — it just doesn't yet extend to pre-solo
   content (see §4 T-03).
5. **Rich cards, not doors — every surface satisfying in itself.** Pattern
   matches Panel 2/3/4 today (rich FB embeds, fact scroller, artifact
   cards). Partial execution (some cards render placeholders) is a
   content problem, not a vision problem.
6. **"The click is never required."** The exhibit's current UX honors
   this on desktop. Mobile behaviors are not surveyed but not contradicted.
7. **Correct over fast.** Operating principle. Survives trivially.
8. **Tech foundation — React + Framer Motion + a JSON data spine per
   artist.** Matches repo exactly (`src/data/artists/*.js`).
9. **Build for weird.baby.** Matches reality — one deploy target, no
   plans to migrate.
10. **Guest book as a per-context prompt, always present, never
    intrusive.** Conceptually sound. The polymorphic implementation (§3
    G-01) is the thing that's missing, not the principle.
11. **An Exhibit has one exit: the Gift Shop.** *(Rewritten in v0.3.)*
    Inside an exhibit, every surface (shelf, panels, archive, artifacts,
    journal) is internal to that exhibit. The single sanctioned way to
    leave an exhibit is via the Gift Shop. This is what makes the Gift
    Shop a first-class architectural feature rather than a merch
    afterthought — it is the threshold that wraps every exhibit.
12. **The Lobby is the entrance.** *(Rewritten in v0.3.)* It has three
    exits, all leading into the museum: **Featured Exhibit** (the one
    Mike has put in the featured slot), **All Exhibits** (a chooser —
    visitor picks one exhibit from the list to go to; not a page that
    shows everything at once), and **Gift Shop**. Every visitor enters
    here. Direct URLs to any non-lobby surface redirect to `/` first.
    A visitor who shares an exhibit URL with a friend — the friend
    lands at the lobby and walks to the exhibit from there. The Lobby
    can grow *panels* (information desk, concierge, guest book,
    featured-contribution highlight, etc.) but it cannot grow *rooms*.
    There is exactly one Lobby.
13. **The Museum has no exit except through the Gift Shop.** *(New
    in v0.3.)* The Gift Shop has three exits: back to the Lobby
    (internal), W.B. merch (internal purchase surface), and the
    museum's only true outbound exits — direct links to featured
    artists' own stores. The Abundance Principle lives here: visitors
    leave *to* the artists, not to a generic "share" or "follow us"
    surface. This is the one place the museum ends.
14. **No sound carries past any exit.** *(New in v0.3.)* Playback
    belongs to the exhibit. Crossing any exhibit boundary — into the
    Gift Shop, back to the Lobby, direct-URL jump, back-button, tab
    close, or any other route change — fades the player. The fade is
    unconditional. The Gift Shop has no player inherited from the
    exhibit the visitor just left; if the Gift Shop plays anything at
    all, it does so on its own terms (TBD — see §6 Q-09). This rule
    supersedes everything in C-03, T-05, and Mike's original Q-08
    answer as interpreted in v0.2.
15. **Rooms are fixed; panels can grow.** *(New in v0.3.)* The museum
    has exactly three room-types: Lobby (one), Exhibit (N, one per
    featured artist), Gift Shop (one). Within each room, panels can
    be added, rearranged, or seasonally swapped. New rooms are not
    added casually — doing so would break the one-door-in / one-door-
    out topology. Any proposal for a new room-type is a vision-level
    change that re-opens this document.

---

## §2 — Vision items that need clarification

Each item below is in the vision but underspecified for the purpose of
writing a UX spec. Proposed clarification given. Mike can accept or
rewrite.

### C-01 — "Two-panel lobby (WbHome)"

**In vision:** Implicit. The vision describes an "entry" and the shelf,
but never directly specifies a lobby surface distinct from an exhibit.
The portfolio report and the task brief both treat WbHome as a real,
explicit surface at `/`.

**Proposed clarification:** The lobby is the first surface (`/`) a
visitor sees. It is not an exhibit. It is the museum's front door. It
presents: (a) the roster of current exhibits as a clear, browsable set,
(b) the guest book as a persistent invitation, (c) one curatorial
signal per visit (a featured exhibit, a currently-playing track
elsewhere in the museum, or a fresh contribution surfaced editorially).
The lobby is a surface the visitor can return to repeatedly and find
something different. The "two-panel" framing from the task brief is
one concrete shape; the UX spec will propose the final layout.

**Stake:** The lobby is an exhibit-peer in spine terms — it has its own
panels, its own ambient behavior, its own contribution path. It is not
just a list of links.

### C-02 — "The spine breathes"

**In vision:** "full and present at the top level, a quiet indicator at
the deepest level."

**Proposed clarification:** The spine has three states — *full*,
*compact*, *minimal*. Full is the shelf at the top of an exhibit.
Compact is a horizontal ribbon that persists as the visitor scrolls into
deeper panels — shows album/era in focus and lets the visitor jump. Minimal
is a single breadcrumb-like indicator visible when the visitor is in a
focused state (reading a long archive card, watching a video full-width,
writing a journal entry). The spine is *never absent* from an exhibit
surface. The UX spec will specify exact transitions.

### C-03 — "Persistent player: what is playing keeps playing"

**In vision:** Strong language. "Regardless of where you go next."

**Resolution (v0.3, corrected):** The player belongs to the exhibit.
It persists across every *internal* surface of an exhibit — shelf,
panels, archive cards, artifacts, journal. It fades on *any* exit,
unconditionally:

- **Exit to Gift Shop:** player fades over ~1.5 seconds. The exhibit
  releases. The Gift Shop is museum-shell, not exhibit-interior.
- **Exit to Lobby:** same fade.
- **Direct-URL jump / back button / tab close / any other transition:**
  same fade. The rule is *crossing the exhibit boundary*, not which
  specific boundary.
- **Re-entering the exhibit:** restores the player to a quiet ready
  state (not auto-resume). The visitor taps to hear if they want
  playback again.

The vision's phrase "what is playing keeps playing" refers to
persistence *within* the exhibit, across its internal surfaces. The
vision was always silent on inter-room persistence; Mike's Q-08
answer resolved that silence — no sound carries past an exit (§1
rule #14). Cross-exhibit playback is not a design goal; it is not
architecturally possible under the room model, because the visitor
has to pass through the Gift Shop or Lobby (both of which fade the
player) to reach another exhibit.

**Dependency:** G5 (audio delivery) in the portfolio report. Until
MP3s are reachable, "player" means "YouTube iframe." The fade rule
applies to the iframe identically. See T-05 for scope by version.

### C-04 — "Something begins playing. Not because you asked. Because that's what happens when you open a record."

**In vision:** Autoplay on album selection.

**Proposed clarification:** Autoplay starts *muted* on mobile and on
first-ever visit on desktop (browser policies force this anyway). The
player UI surfaces a prominent "tap to hear" affordance in that case.
On return visits where the visitor has previously played audio in the
session, autoplay is unmuted. This is not a compromise of the vision —
it's the only way the vision's "something begins playing" rule works in
real browsers. UX spec will describe the exact unmute interaction.

### C-05 — "Contribution shell: one content type in the system"

**In vision:** Strong principle — guest book, playlist, future types
all share a shell.

**Proposed clarification:** The shell is the data+render pattern, not a
single UI. The D1 schema has one `contributions` table with a
`kind` discriminator and a `context_snapshot` JSON blob. The render
side has multiple *surfaces* for that same data (a guest book stream,
a playlist tile, a future review card), all pulling from the same
table with different filters and layouts. "One content type" is
architectural, not visual. This is consistent with the vision; the
clarification is for the engineer who reads this next.

### C-06 — "Context capture: silently snapshots the current player state"

**In vision:** Capture song + version + timestamp + playlist.

**Proposed clarification:** The snapshot also captures the visitor's
*location on the spine* at contribution time (which exhibit, which
album, which panel they were reading, what the last ambient cycle
surfaced). The vision's "adjacent music is the most likely referent"
argument applies equally to adjacent text, adjacent facts, adjacent
artifacts. Minimum snapshot fields:
`{exhibit, album_id, track_title, track_version, track_position_sec,
panel_in_focus, ambient_fact_id, timestamp_utc, session_id}`. Fields
may be null when unknown. UX spec will not reference these fields
directly but will assume they exist when describing how contributions
resurface.

### C-07 — "The system tags contributions automatically by context"

**In vision:** "Where the entry was made — which exhibit, which point
on the spine, what was playing — determines whether it surfaces as a
guest book entry, a playlist, or something else."

**Proposed clarification:** Context *tagging* is automatic (derived
from the snapshot in C-06). Context-derived *surface-type classification*
("is this entry a guest book line or a playlist?") is NOT automatic in
v1 — the vision conflates tag-inference with type-inference, and
classifying an unstructured write into a playlist is ML territory. v1
has explicit contribution entry points per surface type (the guest book
form writes a `kind: "guestbook"` row; a playlist builder writes
`kind: "playlist"` rows). The shell is shared, the tagging is
automatic, the *intent* is captured explicitly. Post-v1: reclassification
based on content.

### C-08 — "When you demonstrate interest… the screen reorganizes quietly around that interest."

**In vision:** Adaptive reordering based on dwell/engagement.

**Proposed clarification (v0.1 scope):** v1 implements the *ambient*
version — the fact scroller, artifact queue, and archive cards are
weighted by album/era in focus (already works for facts). The
*visitor-specific* version — "you lingered on live videos, so we're
surfacing more live videos" — requires session-level or account-level
interest tracking and is deferred to post-v1 (see §5 D-02). UX spec
will describe the ambient behavior only.

### C-09 — "Founding Visitor badge"

**In vision:** Timestamped, permanent, pre-announcement, one-time.

**Proposed clarification:**
- **Eligibility window:** opens when the museum is indexed but unannounced
  (today). Closes the moment the first announcement goes out (a
  conscious curatorial act by Mike, not a timer).
- **Trigger:** signing the guest book at the lobby OR at any exhibit
  surface during the eligibility window. A visit alone (no sign) does
  not grant the badge.
- **Permanence:** the badge is attached to a contribution row, not a
  session. Once signed, the row is marked `founding_visitor: true` and
  that entry is always labeled as such wherever it surfaces.
- **Scope:** the badge is a property of the *contribution*, not the
  *contributor*. This sidesteps the "no accounts yet" problem. If the
  visitor later claims a playlist or registers (post-v1), the badge
  follows the claim.
- **Display:** a visually distinct label on the entry, and a "you were
  here first" state on the lobby for the session that earned it.

**Resolution (v0.2, Q-03 answer (b)):** The badge renders as a visible
labeled tag ("Founding Visitor · 2026-04-22") set apart from regular
entries — not loud (featured/color-shifted), not quiet (a single glyph).
Badged contributions appear inline in chronological or editorial order
with other contributions; the label is what makes them distinct. The
badge is always a property of the contribution row, never a lifetime
status shown to the visitor elsewhere.

### C-10 — "Per-show / per-song guest books"

**In vision:** "Every show, every song, every moment on the spine has
a guest book."

**Proposed clarification:** Granularity for v1 is per-track and per-
exhibit-area (panel-scoped). Per-show granularity presumes the spine
has shows as first-class nodes, which it doesn't yet (shows are
documented in archive cards and artifact rows, not as spine positions).
Per-show guest books become real when shows become spine nodes —
deferred to post-v1 (§5 D-01). "Every moment on the spine" is honored
by per-track granularity in v1; per-show is the enhancement.

### C-11 — "Weebie appears on the logo, the favicon, the front door"

**In vision:** Explicit.

**Proposed clarification:** Weebie's surfaces in v1 are: favicon,
lobby header, 404 page, page-transition moments, and (ambient) the
loading state of the persistent player. Weebie does NOT appear inside
exhibits — the exhibit is the artist's room, not the museum's face.
Weebie is the shell; the exhibit is the content. Gift shop gets a
Weebie presence (it's a W.B.-branded surface).

---

## §3 — Vision gaps (things vision doesn't address but must)

Items the portfolio proves are real and load-bearing, on which the
vision is silent. Each proposed as an addition to the vision — Mike
can accept, reject, or defer.

### G-01 — MediaVault's role in the public museum

**Portfolio reality:** MediaVault is the canonical vault for non-YouTube
media (mp3s, photos, scans, lyrics, artifacts). It runs local-only.
Nothing on weird.baby serves a byte from MediaVault today. Every
Vision-critical capability that mentions non-YouTube audio (persistent
player beyond YouTube, RWTH era, stems, context-capture referents) will
need an audio-delivery pipeline the vision does not describe.

**Proposed addition:** MediaVault is the museum's *curation and staging*
surface. Artifacts are acquired, tagged, and vetted in MediaVault before
they enter the public museum. The public museum never renders directly
from MediaVault — it renders from a Cloudflare-native delivery layer
(R2 + D1) populated from MediaVault on a deliberate export step.
This preserves Mike's veto: nothing is visible until he decides it is.
MediaVault is backstage; weird.baby is front-of-house.

**UX spec impact:** None directly. The UX spec will describe what the
visitor sees; the data path is a downstream concern. But the spec can
assume MP3 audio is eventually playable.

### G-02 — The admin surface at /admin

**Portfolio reality:** `/admin` is triggered by typing `mmm`. Shows
build time, git hash, visits, guest book. Real and live.

**Proposed addition:** The admin surface is Mike's dashboard for the
museum as an operating system. It is not a visitor surface. UX spec
treats it as a separate, curator-only surface with its own rules (no
Fountain Principle; it's a firehose by design — the curator wants all
the signal, compressed).

**Resolution (v0.2, Q-06 answer (a)):** Keep the `mmm` hotkey for v1.
Pre-announcement this is sufficient. Mike opens a ticket to replace
with a real auth gate before the museum's first public announcement.
UX spec treats `/admin` as a curator surface and does not attempt to
design visitor-facing behavior around it.

### G-03 — The FB poster's ongoing cadence

**Portfolio reality:** Mon/Wed/Fri manual posting into Hunter Root's
Homestead group. The poster persona is distinct from Papa Weird.Baby.

**Proposed addition:** The FB poster is a satellite — it operates *for*
the museum but outside it. The museum does not display or refer to
posts being scheduled/going out. The FB group is a public feeder that
the museum benefits from but does not govern. Vision's three-identity-
layer model needs a fourth slot: *the operator's external voices*
(FB poster persona, future IG persona, etc.). These are not museum
voices. They point *to* the museum. This matters for UX because it
means no "from our FB page" pull on the museum itself — the museum
does not reference the FB group unless the FB group produced a fan
contribution that is now in the museum.

### G-04 — The Hunter Root archive tree's relationship to MediaVault

**Portfolio reality:** The HR archive (especially RWTH preservation)
is built in the HR project folder, ingested through the RN
preservation pipeline into MediaVault, then reaches the museum only
via hand-copy into `src/data/artists/hunter-root.js` and friends.

**Proposed addition (informational, not visitor-facing):** The content
lifecycle is: *source → HR project folder → MediaVault (curated) →
exported JSON → museum repo → deploy*. UX spec does not need to
describe this, but needs to assume the museum's content is *curated,
not synced*. A visitor doesn't see anything change without a deploy.

### G-05 — Data-drift risk between Carsie Blanton project folder and museum repo

**Portfolio reality:** `cb_discography.js` and `cb_facts.js` exist at
two paths. Copied by hand.

**Proposed addition (informational, not visitor-facing):** Same as
G-04. For UX purposes this is a non-issue. For vision purposes, it
reinforces the "content flows in deliberately, never automatically"
principle. If a future agent proposes a build-time sync, this
principle is the reason to say no.

### G-06 — Multi-artist futures: what does "featured artist" promotion actually mean?

**Vision silence:** `VISION.md` names Hunter Root as the first exhibit
and says "that may expand." Portfolio shows CB is already live; the
strategy doc names Jesse Welles. Vision does not describe what the
museum does when there are 3, 5, 10 artists.

**Proposed addition (v0.3, corrected):** v1 scope is two artists (HR
and CB). The Lobby contains two panels that handle exhibit discovery:

- **Featured Exhibit panel.** Mike curates which one exhibit sits in
  this slot. Gets presence and real estate. Rotation is intentional,
  not automated — neither "whichever was updated most recently" nor
  a timer. Mike flips the featured slot through `/admin`.
- **All Exhibits panel.** A chooser. The visitor sees the list of
  exhibits and picks one. Not a page that shows all exhibits at
  once — a list, then a click, then the visitor is in that exhibit.
  In v1 with two exhibits, the list has HR and CB. With more
  exhibits later, the list grows. The featured exhibit also appears
  in this list (it is not excluded from the full set).

The Gift Shop does **not** show a roster of exhibits. Exhibit choice
lives in the Lobby, where it architecturally belongs. The current
`/shop` code will have its roster and friends wall removed in the
build that implements this vision.

Post-v1: the question of "when does an exhibit come down or recede"
is explicitly deferred. Vision principle: *exhibits don't retire on
a schedule; they retire when Mike decides they do.*

### G-07 — What the Gift Shop actually is

**Vision silence on:** Gift Shop's role and voice. Portfolio: `/shop`
is live with roster + featured artist + friends wall + lobby exit.

**Resolution (v0.3, corrected):** The Gift Shop is a merch surface
and the museum's only real exit. See §1 #11, #13, #14. Functionally:

- **Voice:** Papa Weird.Baby, same as the rest of the museum.
- **Weebie:** present (this is a W.B.-branded surface, not an
  artist-branded one).
- **Contents:**
  - **W.B. merch** — Mike's own legal merch when it exists
    (eventually). In v1 most slots are marked "coming soon." No
    cart in v1 (see §5 D-04).
  - **Artist merch links** — direct outbound links to each featured
    artist's own store. This is the museum's only true outbound
    exit. The Abundance Principle lives here: visitors leave *to*
    the artists.
- **No roster.** Exhibit discovery is a Lobby concern. The Gift Shop
  does not list other exhibits. If a visitor wants a different
  exhibit, they go back to the Lobby.
- **No friends wall.** Deleted. Not moved. The current `/shop`
  implementation includes a friends wall; v1 removes it.
- **Player:** no inherited playback from the exhibit just left. The
  player fades as the visitor crosses into the Gift Shop (§1 #14).
  Whether the Gift Shop has its *own* ambient audio (a shop-bell on
  entry, a W.B.-branded room tone, nothing at all) is an open
  question — see §6 Q-09.
- **Exits:** three, matching §1 #13 — back to Lobby, W.B. merch
  purchase (v1.5+, not v1), outbound to artist stores.

The current `/shop` surface exists but does not match this spec.
The UX spec v0.1 will describe the v1 Gift Shop greenfield and the
codebase catches up in a subsequent build pass.

### G-08 — The Time Capsule concept

**Vision silence:** Mike's memory notes include a "Time Capsule video
message" concept per featured artist — existential, not promotional.
VISION.md does not mention it. Portfolio does not mention it.

**Resolution (v0.2, Q-02 answer (b)):** Fully deferred to post-v1. No
empty slot on the HR spine, no "coming soon" trace, no curatorial
note. Time Capsule is a post-v1 backlog concept — the most honored
branch on an artist's spine eventually (a single video or written
message the artist leaves for visitors to find decades from now),
but it enters the museum only when a real artist records one. v1
does not pretend it exists. §5 D-08 covers the forward placeholder.

### G-09 — Weird.Baby the entity vs. weird.baby the site

**Vision silence:** The vision treats them as identical. In practice
there's a legal/brand entity (Weird.Baby) that will eventually sell
merch, maybe sign distribution deals, maybe issue statements. The
site is the front door, but not the whole entity.

**Proposed addition (v1 scope is trivial):** For v1, they are the same.
A single copyright line in the footer reads "© Weird.Baby, 2026" and
that's the extent of the entity-surfacing on the site. Post-v1,
"about" / "contact" / "press" surfaces will be needed. Defer the
entity-vs-site distinction to v2 (§5 D-05).

### G-10 — Mobile vs. desktop — the vision is desktop-voiced

**Vision silence:** Every interaction described in VISION.md is
desktop-shaped ("swipe, slide," "lingering," "hovering"). Portfolio
doesn't say what the mobile experience is. Most visitors discovering
the museum from an FB post will be on mobile.

**Proposed addition:** The museum is mobile-first in *functionality*
and desktop-best in *depth*. Mobile visitors get the spine as a
vertically-scrollable stack of album tiles, one tap to open, persistent
mini-player at the bottom. Desktop visitors get the coverflow + multi-
column panels. Panel 2/3/4 on mobile are vertically stacked with the
same rich-card pattern. UX spec will specify mobile adaptations per
surface.

### G-11 — The aphantasia design principle

**Vision silence:** Mike is aphantasic. This is in memory but not
VISION.md. It affects design decisions (verbal anchoring over
visual metaphor, explicit state cues over implied motion, consistent
structural cues over atmospheric "vibe").

**Proposed addition:** Operating principle — *describe what things do,
not what they look like.* Every animation must have a purpose stated
in behavior terms. Every state must be readable without relying on
"you'll know it when you see it." This is a vision-level commitment;
it guides both the UX spec and future design work.

### G-12 — The "what counts as the museum" boundary

**Vision silence / tension:** The Homestead FB group, the FB poster,
MediaVault, the artist's own site (hunterroot.com) — are these part
of the museum?

**Proposed addition:** They are *not* the museum. The museum is what
lives at `https://weird.baby` and `https://www.weird.baby`. Everything
else is infrastructure, feeder, or external. When the museum links
*out* to those surfaces, it is linking out — not expanding itself. The
museum does not embed Facebook posts from the Homestead group as if
they were museum content (even though the panel is called "social
archive" and uses FB embeds — those are historical artifacts, not live
FB content). UX spec will honor this boundary.

---

## §4 — Vision tensions with portfolio reality

Where the vision's assertions contradict or outpace what the codebase
supports. Each tension has a proposed resolution: *fix the vision*,
*fix the codebase*, or *defer*.

### T-01 — "One viral-ready surface"

**Tension:** The task brief notes the portfolio report shows nothing
that qualifies. I checked — portfolio report doesn't discuss
"viral-ready" as a term, and `VISION.md` also doesn't use that phrase.
The concept appears to be a stated-but-unwritten ambition.

**Resolution (v0.2, Q-04 answer (e)):** Concept killed. No dedicated
viral surface in v1. No share-optimized card builder, no shareable
receipt page, no pre-chosen viral tile. If something goes viral, it
goes viral as-is — a visitor can share a URL like any other website,
and the lobby-only-entrance rule (§1 #12) means that URL will bring
the friend through the proper front door. This is consistent with
the museum's posture: unannounced, indexed, found by the right
people. Optimizing for spread is a different kind of project. UX
spec has no share-surface section.

### T-02 — "Site-State Playlist" depends on accounts (G9)

**Tension:** Portfolio G9 (lightweight accounts via Clerk) is not
built. The concept of a "site-state playlist" — whatever its exact
meaning — presumes a continuity of visitor identity.

**Proposed resolution (fix the vision):** In v1, the site-state
concept is *session-scoped*, not account-scoped. A visitor who opens
a tab has a session. What they play, where they've been, what they've
contributed in that session is the "state." It persists until the tab
closes or the session cookie expires (48 hours proposed). Post-v1,
accounts extend this to persistent identity.

Result: the vision can talk about "your playlist" / "where you left
off" without an account system. Anonymous session cookies are enough
for v1.

### T-03 — "Since My Last Visit" filter

**Tension:** Same as T-02 — requires continuity.

**Proposed resolution (fix the vision):** v1 scope uses the session
cookie to set `last_seen_at`. "Since last visit" means "since the
last time this browser session touched the museum." Cross-device is
post-v1.

For visitors without cookies (incognito, first-visit), the filter
doesn't render — replaced by a "new here?" ambient welcome.

### T-04 — "Two-panel lobby" vs. the current `/` route

**Tension:** The task brief says the two-panel lobby "replaces
current / route entirely." Portfolio confirms the current `/` is a
functional lobby with guest book + visit count. Some content exists;
the replacement is a UX redesign.

**Proposed resolution (fix the codebase, deliberately):** The current
`/` is a v0 lobby. v1 lobby (the one UX spec will describe) is a full
redesign that carries forward: guest book infrastructure (D1 ops),
visit counting (telemetry), curatorial voice. Nothing about the v1
lobby presumes backward compatibility with v0's layout. The UX spec
should treat the lobby as a greenfield surface.

### T-05 — "Persistent player" is real only for YouTube

**Tension:** VISION says playback persists. Reality (per
MUSEUM_CODEBASE_GAPS §3, §4): only YouTube plays; MP3 delivery
doesn't exist; cross-route persistence doesn't exist within the
current component structure. Portfolio G1 and G5 are large efforts.

**Resolution (v0.3, corrected):**
- **v1:** Player is YouTube-only. Player persists across every
  *internal* surface of an exhibit (shelf, panels, archive, artifacts,
  journal). Player fades on *any* exit — to the Gift Shop, to the
  Lobby, to a direct URL, to the back button. The exhibit is the
  unit of playback; crossing its boundary ends the session. This is
  the §1 #14 rule applied specifically to the YouTube iframe.
- **v1.5:** MP3 delivery via R2 (closes G5). Player becomes
  source-agnostic. The fade-on-exit rule is unchanged — it's
  independent of the audio source.
- **v2:** stems, rich context-capture referents, fan-authored
  playback contexts. Still within-exhibit.

UX spec v0.1 describes v1 behavior as ground truth and annotates
where v1.5 extends it (per Q-05 answer (b)). The fade rule is a v1
architectural decision, not a v1.5 one — it applies to the YouTube-
only player starting today.

### T-06 — "Carsie Blanton as second artist" — content depth is shallow

**Tension:** VISION says exhibit expansion is a goal; CB is live at
`/cb` but the CB exhibit flow's content is shallower than HR's.

**Proposed resolution (fix the codebase, not the vision):** No vision
change. CB's content depth is a content-curation task (Portfolio G13),
not a UX question. UX spec describes the CB exhibit at the same
structural fidelity as the HR exhibit and assumes content will catch
up. UX spec does NOT propose a "we'll hide panels that don't have
content yet" pattern — that's the kind of quiet degradation that
violates the "every surface satisfying in itself" principle. If a
panel is thin, the ambient behavior adjusts (fewer facts cycle slower;
fewer artifacts mean the visible ones dwell longer), but the panel
exists.

### T-07 — Vision assumes Seeds / Medusa's Disco / RWTH are in the spine

**Tension:** Gaps report §8 Gap C: the HR spine has only 6 solo
albums. Pre-solo content has no spine position. Vision's "pre-
discography: origin, where the artist came from" has no code.

**Proposed resolution (v0.2, resolved by Q-07 answer (b)):** Seeds,
Medusa's Disco, and RWTH become three separate spine tiles at
positions 0, 1, 2 before the solo albums. Each tile is shaped like
an album tile (cover art, year, tracklist, accent color) and is
selectable like one. The era vocabulary `seeds / medusas / rwth /
solo` maps 1:1 onto these tiles for panel filtering. The HR spine
becomes 9 positions total.

`defaultActiveIndex` shifts from 4 (arkansas, in the current 6-tile
zero-indexed spine) to 7 (arkansas, in the new 9-tile spine).
Portfolio G6 (pre-solo spine entries) and G7 (RWTH era + fact
targeting) together cover the code work. Content authoring — cover
art choices, tracklist shape for non-Bandcamp sources, accent colors
for pre-solo tiles — is Mike's curatorial call and sits in the
project backlog, not UX.

Rejected alternative: the single "Before Hunter Root" tile with
expand-into-sub-entries. Mike chose the three-tile version because
each of those identities is its own thing and deserves its own tile
weight on the shelf.

### T-08 — Era vocabulary mismatch

**Tension:** Gaps report §8 Gap D — canonical era set is seeds /
medusas / solo. RWTH would need a fourth. "Solo" is ambiguous
(Hunter Root's solo era AND RWTH is a solo identity).

**Proposed resolution (fix the vocabulary):** Four eras: `seeds`,
`medusas`, `rwth`, `solo`. "Solo" specifically means Hunter Root's
Bandcamp-published solo catalog (2018+). "RWTH" is pre-solo under a
different artist identity. This is a content/code decision, not a
vision decision, but the vision should name the eras canonically so
the UX spec can filter-pill them predictably.

### T-09 — "The best entries surface — not algorithmically, editorially"

**Tension:** VISION says editorial curation of guest book entries.
No editorial-surfacing mechanism exists today. D1 has no "featured"
column.

**Proposed resolution (fix the codebase in a way the UX spec
assumes):** Add a `featured: bool` column (or an editorial rank int)
to the contributions table. The admin surface (G-02) gets a
per-entry "feature" toggle. Featured entries surface in the lobby's
"fresh contribution" slot and on the contribution's originating
exhibit surface. UX spec can describe "featured" behavior as real.

### T-10 — Moderation / flag / hide path

**Tension:** VISION describes the best entries surfacing but says
nothing about the worst entries getting hidden. Portfolio G12:
no moderation path exists.

**Proposed resolution (fix the codebase, make it UX-visible):**
Every contribution has an admin-controlled `visibility` state:
`visible` (default), `hidden` (admin-only), `flagged` (visible with
a content warning, edge case). Visitors never see a moderation UI.
UX spec assumes contributions are visible unless the admin has
acted. Post-v1: visitor flagging.

### T-11 — Guest book context is richer than D1 schema

**Tension:** VISION says context capture snapshots player state (see
C-06). Current `guestbook` table in D1 does not carry these fields.
Portfolio G2 is the fix.

**Proposed resolution (fix the codebase):** D1 migration adds the
fields from C-06 to the `contributions` table. No vision change;
the vision already describes this. UX spec assumes contributions
carry their context and can use it (e.g., "you signed while
'Chasing Shadows' was playing; click to return to that moment").

### T-12 — Bandcamp as a hard external dependency

**Tension:** `hunter-root.js` embeds Bandcamp image URLs directly.
CB is waiting on Bandcamp IDs. If Bandcamp changes URLs, the museum
goes visually flat.

**Proposed resolution (fix the codebase, invisible to UX):**
Artist album art is stored in R2 under a canonical key scheme
(`/art/<artist_id>/<album_id>.jpg`). Bandcamp is the *source*, not
the *host*. This is an export step that runs once, not a live
dependency. UX spec does not need to mention this; it's an
infrastructure decision driven by the R2 work in G5/G1.

### T-13 — Persistent player UX vs. browser autoplay policies

**Tension:** Vision's "something begins playing" assumes autoplay
works. Modern browsers block unmuted autoplay on first visit.

**Proposed resolution:** See C-04. Vision is right in principle;
implementation requires a muted-first, unmute-on-first-interaction
pattern. UX spec will describe the "tap to hear" affordance
explicitly.

### T-14 — `MUSEUM_STRUCTURE_SPEC_v0.1.md` is a corrupted 247-byte stub

**Tension:** Gaps report §8 Gap F. Not a vision tension, but worth
surfacing so it doesn't mislead a future agent.

**Proposed resolution (fix the codebase):** Restore from git or
retire the file. Not UX-blocking. Defer to a housekeeping pass.

### T-15 — `STATE.md` and `PROJECT.md` drift flagged in portfolio §3

**Tension:** HR says MediaVault is "blocking" when it's shipped.
CB's `PROJECT.md` says evaluation-pending when exhibit is live.
HR_SYSTEM.md §11 still calls hunterroot.com "the museum."

**Proposed resolution:** Housekeeping. Not UX. Do not block
Phase 2 on this. Add to a post-UX housekeeping pass.

---

## §5 — Items explicitly deferred to post-v1

With reasons. Mike accepted these deferrals without edits in v0.2
review. Any post-v1 work on these items will be a separate vision
pass.

### D-01 — Per-show guest books and shows as spine nodes

**Reason:** The spine currently treats albums as first-class and shows
as artifacts *on* albums. Making shows first-class expands the spine
shape and requires rethinking how the shelf renders (do shows get
their own tiles? their own panel? inline with albums?). This is a
vision-scale question, not a UX question. v1 delivers per-track guest
books; per-show is a v2 enhancement once the spine treatment of shows
is decided.

### D-02 — Visitor-specific adaptive reordering

**Reason:** C-08. Requires per-visitor interest tracking, which
requires accounts or long-session cookies plus a weighting model.
v1 does ambient reordering per album/era in focus; that honors the
vision's intent at a coarser granularity.

### D-03 — Accounts (Clerk integration, claimable contributions)

**Reason:** Portfolio G9. Large surface. v1 uses session cookies.
Post-v1 introduces lightweight accounts and the "claim your anon
contribution" flow.

### D-04 — Store / merch beyond the "exit via gift shop" surface

**Reason:** Portfolio G11. Stripe integration, product catalog, tax,
fulfillment. The v1 gift shop has visible merch slots that link out
(to artist stores, Abundance Principle) or are marked "coming soon"
for Mike's own work. No cart.

### D-05 — Entity-vs-site surfaces (about, contact, press)

**Reason:** G-09. v1's footer is a single line. v2 introduces the
surfaces a real brand entity needs.

### D-06 — Cross-device identity / sync

**Reason:** Presumes accounts. Post-v1.

### D-07 — Fan-submitted lyric observations / annotated lyric map

**Reason:** Portfolio G14. Large; depends on the contribution shell
(G3) being solid first. v1 lyric map is read-only; v1.5 introduces
contribution-aware lyric features.

### D-08 — Stem archive / exclusive artist deliverables

**Reason:** Requires direct artist collaboration (Mike's memory notes
this explicitly). Not a v1 visitor surface. Post-v1 when first
featured artist signs on.

### D-09 — Instagram Reel / cross-platform content

**Reason:** `HOMESTEAD_INSTAGRAM_SPEC_v0.2.md` exists as brainstorm.
Outside the museum's boundary (G-12). Deferred until the museum
itself is stable.

### D-10 — The museum's public announcement

**Reason:** Not deferred in the "don't do it" sense — deferred in
the "this is a curatorial act Mike performs, not a feature in v1."
The Founding Visitor eligibility window closes when this happens.
v1 ships before this happens.

---

## §6 — Decisions (answers to v0.1's open questions)

Recorded for the record. UX spec v0.1 will treat these as settled.

**Q-01. Multi-artist lobby weight → (b) Featured slot, curated by
Mike, rotates when he decides.**

*Implication:* The lobby has a featured slot and an "on view" (secondary)
slot. Mike flips them through the `/admin` surface. The featured slot
gets more real estate and presence; the secondary slot is clearly
accessible but quieter. UX spec will describe both states.

**Q-02. Time Capsule in v1 → (b) Fully deferred, no trace in v1.**

*Implication:* No "coming soon" slot on the HR spine. The Time Capsule
concept moves entirely to the post-v1 backlog. §5 D-08 is expanded to
cover this. UX spec does not mention Time Capsule at all.

**Q-03. Founding Visitor badge surfacing → (b) Visible — a labeled
tag ("Founding Visitor · 2026-04-22") set apart from regular entries.**

*Implication:* Badged contributions get a distinct visual treatment
(label text, slight visual separation) but are not pulled out into a
separate featured zone. They appear inline with other contributions
in chronological or editorial order, carrying their label. The badge
is a property of the contribution row; it is never a lifetime status
shown to the visitor elsewhere.

**Q-04. "Viral-ready surface" → (e) Kill the concept; no dedicated
viral surface in v1.**

*Implication:* T-01 is resolved by deletion. No share-optimized card
builder, no shareable receipt page, no pre-chosen viral surface. If
something goes viral, it goes viral as-is. This is consistent with
"unannounced, indexed, found by the right people" — the museum is
not optimizing for spread in v1. UX spec has no share-surface
section.

**Q-05. UX spec horizon → (b) v1 as ground truth with v1.5 (MP3
delivery) annotated as "extends to X here."**

*Implication:* UX spec describes v1 behavior concretely. Where v1.5
(MP3 delivery, source-agnostic player) changes a surface, UX spec
notes the extension inline with a "v1.5:" tag. Full v2 behaviors
(stems, account-scoped continuity, cross-device sync) are out of
scope for the UX spec.

**Q-06. Admin gate → (a) Keep `mmm` for v1; revisit at announce.**

*Implication:* `/admin` remains triggered by typing `mmm`. UX spec
describes `/admin` briefly (see G-02) as a curator surface not
governed by visitor UX principles. Pre-announcement, this is fine.
Before the first public announcement, Mike opens a ticket to replace
with a real auth gate.

**Q-07. Pre-discography shape → (b) Three separate spine tiles
(Seeds, Medusa's Disco, RWTH) at positions 0, 1, 2, before the solo
albums.**

*Implication:* The HR spine becomes 9 positions: Seeds, Medusa's
Disco, RWTH, Cracked, Wheel, Dandelions, Skipping, Arkansas, Crooked.
Each pre-solo tile is shaped like an album tile (cover art, year,
tracklist shape) but sits on the timeline as its own era. The era
vocabulary `seeds / medusas / rwth / solo` from T-08 maps 1:1 onto
these tiles for panel filtering. `defaultActiveIndex` shifts from 4
(arkansas, zero-indexed in the 6-tile spine) to 7 (arkansas in the
9-tile spine). UX spec will describe tile rendering consistency
across pre-solo and solo tiles. Content authoring for the three
pre-solo tiles is a separate task (Portfolio G6 + G7).

**Q-08. Cross-exhibit playback → Mike's answer (v0.1): "when you leave
exhibit, fade out. (You can only exit through the gift shop...)"**

*v0.3 clarification from Mike during v0.2 review:* Claude misread this
answer in v0.2 as "player carries through the gift shop." Mike's
actual rule is: **no sound carries past any exit.** The gift shop is
the single architectural *route* out of an exhibit, but it is not a
playback-preserving corridor — it is a museum-shell surface, distinct
from the exhibit. Crossing into the Gift Shop fades the player, same
as crossing into the Lobby or anywhere else.

*Implication (v0.3):* Promoted to §1 rule #14 ("No sound carries past
any exit"). Rewrites C-03, T-05, G-07. Player behavior:

- Inside an exhibit: player persists across every internal surface.
- Exit via any route (Gift Shop, Lobby, direct URL, back button,
  tab close): player fades over ~1.5 seconds.
- Re-entering the exhibit: player is in a quiet ready state, not
  auto-resume. Visitor taps to hear again.
- There is no cross-exhibit playback. Going from HR to CB requires
  Lobby → CB (which fades any prior playback at the Lobby
  crossing anyway).

**Q-09. Gift Shop's own ambient audio. *(New in v0.3.)*** The Gift
Shop has no inherited playback. Does it have its own?
- (a) Silent. No audio of any kind.
- (b) A one-shot entry cue (shop bell on arrival; then silent).
- (c) A quiet room-tone loop (W.B.-branded ambient, very low).
- (d) Contextual — plays one W.B. Papa-voiced curatorial clip once,
  on first visit per session (functional; decays to silent).

Claude's default if unanswered: (a), silent. Justifies the §1 #14
rule most cleanly; a shop bell that the existing `/shop` code
gestures at is easy to add later. The shop bell hook is already in
the code (`/sounds/shop-bell.mp3` referenced but missing); (b) is
the lowest-lift upgrade path if Mike wants it.

---

## Next steps

v0.3 corrects the v0.2 errors around the Gift Shop rule. Mike caught
four contradictory passages during v0.2 review. The corrections are:

- §1 items #11–#15 rewritten/added; they now describe the room model
  unambiguously.
- C-03, G-06, G-07, T-05 all rewritten.
- §6 Q-08 resolution rewritten to match Mike's actual v0.1 answer
  (which Claude had misinterpreted).
- New Q-09 added: does the Gift Shop have its own ambient audio?
  Defaulting to "silent" until Mike answers.

This document is **locked** for UX-spec purposes except on Q-09.
Q-09's answer changes one paragraph of §F (Gift Shop) in the UX
spec. UX spec v0.1 can proceed with Q-09's default answer (silent)
and be revised on that one paragraph if Mike chooses differently.

Post-v0.3 edits to this document will be made only if Phase 2
surfaces a genuine vision-level question that the lock doesn't
answer — in which case a v0.4 revision batches those questions
rather than resolving them silently.

*End of VISION_LOCK_v0.3. No existing project files modified.*
