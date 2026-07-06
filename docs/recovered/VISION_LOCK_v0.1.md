# Weird.Baby Museum — Vision Lock

**Version:** 0.1
**Date:** 2026-04-21
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

**Read order:** §1 to know what survives. §2–§5 to review changes.
§6 to answer the questions Mike has to answer before UX can proceed.

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

**Proposed clarification (v0.1 scope):** Cross-surface persistence *within
a single exhibit* is the v1 target (e.g., navigate from `/hr`'s shelf
into a Panel 3 artifact card, playback continues). Cross-exhibit
persistence (start playback on `/hr`, navigate to `/cb`, HR keeps
playing) is a v1 stretch goal because it conflicts with the
"entering an exhibit starts something playing" rule (the vision says
both). Cross-exhibit behavior needs an explicit rule. Default proposal:
entering a new exhibit offers the visitor a choice (continue current
playback or start this exhibit's opening track) rather than silently
overriding. Going to `/` (lobby) or `/shop` does NOT stop playback.

**Dependency:** G5 (audio delivery) in the portfolio report. Until
MP3s are reachable, "persistent player" in v1 means "persistent
YouTube player," with all the limitations that implies (see T-05).

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

**Open question:** Mike, how do you want the badge to look/behave on
surfacing? → §6 Q-03.

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

**Proposed clarification of trigger:** The `mmm` hotkey is current
behavior. It is not secret (discoverable in source). That's fine for
pre-announcement; revisit before launch if Mike wants a more real gate.
→ §6 Q-06.

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

**Proposed addition:** v1 scope is two artists (HR and CB). The lobby
shows both with equal weight. A "featured" artist concept (one of the
two gets a rotating front-and-center slot in the lobby) is an
editorial choice Mike makes, not an automated one. Post-v1: the
question of "when does an exhibit come down or recede" is explicitly
deferred. Vision should say: *exhibits don't retire on a schedule;
they retire when Mike decides they do.* → §6 Q-01.

### G-07 — What the gift shop actually is

**Vision silence on:** Gift shop's role and voice. Portfolio: `/shop`
is live with roster + featured artist + friends wall + lobby exit.

**Proposed addition:** The gift shop is the museum's exit-by-design —
a visitor finishes here, not transits through. It sells (eventually)
Mike's own legal merch first; artist merch is an external link to the
artist's own store (Abundance Principle — we're not taking a cut).
Voice: Papa Weird.Baby, same as the rest of the museum. Weebie is
present here (it's a W.B.-branded surface). The "friends wall" is a
curated set of other artists/creators the museum wants you to know
about — it is not an algorithmic related-artists system. UX spec will
describe the visitor flow through this surface.

### G-08 — The Time Capsule concept

**Vision silence:** Mike's memory notes include a "Time Capsule video
message" concept per featured artist — existential, not promotional.
VISION.md does not mention it. Portfolio does not mention it.

**Proposed addition:** Time Capsule is a curatorial ambition, not v1
content. Vision should include it as a forward-looking exhibit type
(the most honored branch on an artist's spine — a single video or
written message the artist leaves for visitors to find decades from
now). For v1, Time Capsule is either (a) a planned slot in the HR
spine that is currently empty with a curatorial note, or (b) entirely
deferred to post-v1. → §6 Q-02.

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

**Proposed resolution:** Defer and re-ask. The "viral-ready surface"
is an ambition without a concrete shape. Candidates include: a
shareable moment in an exhibit (a time-coded lyric + fact card), a
fan-contribution-driven surface, or a time-gated Founding Visitor
badge display. Without knowing which, UX can't plan for it.
→ §6 Q-04.

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

**Proposed resolution (accept v1 limitation, describe future):**
- **v1:** persistent player is YouTube-only, persists across routes
  within an exhibit, does NOT cross exhibits (see C-03).
- **v1.5:** MP3 delivery via R2 (closes G5). Player becomes
  source-agnostic. Cross-exhibit persistence becomes viable.
- **v2:** full fidelity per VISION.md.

UX spec v0.1 should describe v1 behavior as the ground truth and
annotate where v1.5 will extend it. Mike's product call: is the UX
spec for v1, v1.5, or both? → §6 Q-05.

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

**Proposed resolution (fix the codebase, explicit in UX spec):** The
pre-discography era is a *spine node* distinct from an album. It is
displayed differently (a single tile titled "Before Hunter Root" or
similar, expanding into sub-entries for Seeds and Medusa's Disco),
lives at position 0 on the spine, and is selectable like an album.
This requires Portfolio G6 (pre-solo spine entries). UX spec will
describe this tile and its expansion behavior.

**Alternative to keep in pocket:** pre-discography becomes a *fourth
panel* (a "backstory" panel always present regardless of which album
is in focus). This is simpler but loses the spine metaphor's
coherence. Recommend the spine-node approach.
→ §6 Q-07.

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

With reasons. Mike can pull any of these back into v1 by rejecting
the deferral in §6, but the current proposal is to keep v1 scope
tight.

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

## §6 — Open questions for Mike

Short. Batched. Answer these and §1–§5 locks for UX work to begin.

**Q-01. Multi-artist lobby weight.** When v1 ships with HR and CB,
does the lobby show them as equal peers, or is one of them
"featured" (front-and-center) while the other is "on view" (a
secondary slot)?
- (a) Equal peers, no featured slot.
- (b) Featured slot, curated by Mike, rotates when he decides.
- (c) Featured slot, but it's whichever exhibit was most recently
  updated.

**Q-02. Time Capsule in v1.** Is the Time Capsule concept (G-08)
in v1 scope as an *empty, curatorially-noted slot* on the HR spine
("a message will live here someday"), or fully deferred?
- (a) Empty slot in v1, visible as a "coming" state.
- (b) Fully deferred, no trace in v1.

**Q-03. Founding Visitor badge surfacing.** When a Founding Visitor
contribution surfaces in the lobby or on an exhibit, how loud is
the badge?
- (a) Quiet — a single glyph / date next to the entry.
- (b) Visible — a labeled tag ("Founding Visitor · 2026-04-22")
  set apart from regular entries.
- (c) Loud — featured differently (color, position, extra card
  real estate).

**Q-04. "Viral-ready surface."** T-01. Which of these is it, or
none of the above?
- (a) A shareable card from any exhibit (visitor pulls a moment,
  gets a share-optimized image + link).
- (b) The Founding Visitor earn page (one-time, timestamped,
  shareable receipt).
- (c) A specific Panel 3 artifact (a poster, a lyric, something
  pre-chosen as the "share this" surface).
- (d) Other (describe).
- (e) Kill the concept; no dedicated viral surface in v1.

**Q-05. UX spec horizon.** Is UX spec v0.1 for:
- (a) v1 only (YouTube-only, session cookies, current capabilities).
- (b) v1 as ground truth with v1.5 (MP3 delivery) annotated as
  "extends to X here."
- (c) Full vision (v2), with v1 limitations explicitly noted where
  they bite.

Recommended: (b). Gives a target without pretending the audio
pipeline is done.

**Q-06. Admin gate.** Keep the `mmm` hotkey as the `/admin` trigger
for v1, or replace with a real auth gate before any announcement?
- (a) Keep `mmm` for v1; revisit at announce.
- (b) Replace now; needs to be non-discoverable before the site
  gets traffic.

**Q-07. Pre-discography shape.** T-07. How does Seeds / Medusa's
Disco / RWTH sit on the HR spine?
- (a) Single "Before Hunter Root" tile at position 0, expanding
  into sub-entries for the pre-solo projects. One row on the
  shelf, one tile.
- (b) Three separate spine tiles (Seeds, Medusa's Disco, RWTH)
  at positions 0, 1, 2, before the solo albums.
- (c) A fourth panel ("backstory") always present, independent of
  the spine.

**Q-08. Cross-exhibit playback.** C-03. When a visitor with active
HR playback navigates to `/cb`:
- (a) Playback continues (HR keeps playing while CB loads).
- (b) Playback pauses; visitor can resume via the persistent
  player controls.
- (c) Playback is replaced by CB's opening track (the exhibit
  always wins in its own room).
- (d) Visitor is offered a choice.

---

## Next steps

On Mike's acceptance of §1–§5 (with or without edits) and his answers
to §6, this document becomes VISION_LOCK_v0.2 (editorial rev) or
v1.0 (final), and UX spec v0.1 begins. Until then, the UX spec cannot
be written without improvising curatorial decisions.

*End of VISION_LOCK_v0.1. No existing project files modified.*
