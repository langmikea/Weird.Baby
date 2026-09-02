# TEMPLATE ADVERSARIAL REVIEW

**Ordered by:** Mike (B7, THE BINGE + TEMPLATE ROUND, 2026-08-02). Ops owns.
**Brief, verbatim:** *"The site has been deviating/expanding template use round
after round. Conduct a COMPLETE ADVERSARIAL review — every surface, every
component: where does it follow the template, where has it drifted, where has a
one-off been invented that a template already covers, where is a template being
stretched past its purpose. Findings + severity + recommended conformance. FIX
the mechanical drift; LIST the judgment calls. Adversarial means look for what's
wrong, not what's fine."*

**Method.** Every finding below is measured or grepped against the live working
tree, not recalled. Where a claim is about what a visitor SEES, it was verified
in Chrome against the dev server and the numbers are quoted. Counts are
reproducible from the commands named in each finding.

**Scope.** All eleven visitor-facing surfaces (`/`, `/hr`, `/wb`, `/wal`,
`/robots`, `/booth`, `/shop`, plus the four HR sub-routes), the shared engine
(`Exhibit.jsx` / `Exhibit.css`), the four wing flows, and the token layer.
`WbAdmin` is operator-only and is scored separately.

**Prior art.** `docs/SITE_TEMPLATE_AUDIT-20260729.md` (robots repo) produced the
JS token mirror (`src/styles/tokens.js`). This review does not repeat it; it
checks whether its contract held (it did — see H1) and looks at everything else.

---

## 0. Verdict

The museum has **real templates and no mechanism to enforce them.** Every
template in the register (§4) exists as a habit plus a comment, and habits decay
at the seams — specifically when a renderer is carried into a wing whose frame
differs, and when a new room is built beside an old one rather than out of it.

Two patterns produced almost every finding:

1. **A renderer crosses into a wing with a different frame and nobody re-checks
   the frame.** The collage moved from flat WAL into staged robots and lost
   three plates off the bottom (D3). The B&W photo law was written per-component
   and the tenth component escaped it (D6).
2. **A room is built BESIDE the template instead of OUT of it.** The title bar
   exists three times (R2). Six overlays share a shape and no code (R3). Four
   surfaces re-type the palette by hand (R1).

Pattern 2 is the expensive one and it is not fixed by this round. **151
hard-coded colours sit on visitor-facing surfaces, 96 of them byte-for-byte
identical to a token that already exists** — and the single most-used control in
the building is painting a colour the museum retired in 2025 (J1).

| | Count |
|---|---|
| Drift **FIXED** this round | 8 (7 + the R2 fork) |
| Conformance **RECOMMENDED** (mechanical, not done — needs its own round) | 6 (one partially closed) |
| **JUDGMENT CALLS** listed for Mike | 4 |
| Templates verified **HOLDING** | 5 |

**Severity scale.** `S1` visitor loses content or the page misleads · `S2`
visible inconsistency a visitor could notice · `S3` invisible today, will
produce an S1/S2 on the next change · `S4` hygiene.

---

## 1. FIXED THIS ROUND

### D1 · S2 · The input-field pairing had two mechanics for one job
**Surface:** `/` guest book. **Template:** the input field (§4.9).
The book's two fields are the same species and looked like two components. The
note asked its question INSIDE itself (placeholder, DM Serif, 0.84rem); the name
asked its question in a 0.6rem mono ALL-CAPS caption stacked above a borderless
0.95rem line inside a box of its own. Two mechanics, two faces, two sizes — and
the heavier furniture sat on the field that asks LESS.
**Fixed:** one `.wb-field` class is now the template, both fields wear it, and
Mike's composition (note full width; name + Sign as equal halves on the line
below) is built. Halves verified byte-equal at 369.667px each, same line, same
41.264px height. Supersedes P13's caption, which argued its case well and lost
to consistency across the pair.
**Note:** the deck's journal composer (`.hr-jnl-handle` / `.hr-jnl-text`) already
conformed, in its own wing's register. The template is the MECHANIC; the type is
the room's. The lobby was the sole deviation.

### D2 · S2 · The post-it tilt was a formula that could only ever return one number
**Surface:** all three card decks on every WAL artist card. **Template:** the
tilt vocabulary (§4.5).
`style={{ "--tilt": `${((ci * 5) % 5) - 2}deg` }}` — a multiple of five is never
anything but zero modulo five, so **every card in every deck was pinned at
exactly −2°**. The wall it was imitating uses a stride coprime with its modulus
(`(i*7)%9` walks 0,7,5,3,1,8,6,4,2 before repeating).
**Fixed:** the decks adopt the collage's own numbers. Verified on Hunter Root's
card: three distinct angles across six cards where there had been one.

### D3 · S1 · A wall was carried into a staged wing and lost three plates
**Surface:** `/robots` → MGK-VIIIp → The Plates. **Template:** the Stage's block
model (§4.3). **This is Mike's B5.**
P23 pointed the WAL collage renderer at the museum's own plates — correctly —
but WAL is `faceFlow:"flat"` and robots is `stage:true`, and the stage packs
indivisible blocks into fixed columns. Measured on the live page: the wall is
**1134px into a 758px column — 376px, three plates, clipped under
`overflow:hidden` with no scrollbar to reach them.** The footer, the only block
left over, then took a page to itself: 17px of type on an empty sheet, which is
the "page 2 renders BLANK" in Mike's screenshot. One cause, both symptoms.
**Fixed:** `data-stage-full` — a wall takes a PAGE, at the page's width. The
same nine plates auto-fill five across in 1203px and land in two rows, 423px into
a 758px sheet, **0px clipped**. Splitting by tile was rejected and the reasoning
is in the code: it is what the component's own error message recommends, and it
turns the wall into a strip of half-empty rows.

### D4 · S2 · The face footer's prop had been neutered since it was written
**Surface:** every staged face. **Template:** the Stage's page furniture.
`footer={face.footer ? null : null}` — a ternary whose two branches are the same
value. `Stage` has always rendered a footer slot (`"<footer> · Page 1 of 2"`) and
has never once been fed. Meanwhile the face's footer rendered as a body BLOCK,
and being the last block it is the one that gets stranded (see D3).
**Fixed:** the footer rides the transport on staged wings, stays a block on flat
ones (which have no transport). Verified: *"Nine plates · Weird.Baby Robots ·
Page 1 of 2"*.

### D5 · S2 · An outbound-tab pattern applied to the museum's own assets
**Surface:** `/robots` plate wall. **Template:** the link seam (§4.8). **Mike's
B6.**
The wing opened plates with `window.open(href,"_blank")`. The old comment argues
Mike's case against itself: it reasoned that opening a plate "should not throw
away the exhibit the visitor is standing in", then threw them into a browser tab
showing a bare 4.9MB PNG on white — no caption, no next plate, no way back but
the tab strip. The new-tab rule is correct for WAL, whose tiles point at
YouTube; these are ours, on our origin.
**Fixed:** an in-place reader (§4.10), which is also B8's microfiche container.
Verified: opens on the room, pages 1→9 and wraps, arrow keys, Escape, true 1:1
magnify with pan (2048×1536 shown at 2048×1536), zero new tabs.

### D6 · S2 · The photo law was written per component, so the tenth component escaped it
**Surface:** `/robots`. **Template:** the site-wide photo law. **Mike's B4.**
`grayscale(1) contrast(1.03)` was written on `.vp-face-still` and `.vp-poster
img` individually. `.vp-collage-tile img` — added later, in a different round —
inherited a renderer whose grayscale lived somewhere else, and arrived in
colour. That is the failure mode of a law expressed as a list of components.
**Fixed:** one rule scoped to the WING (`.ex-root[data-exhibit="robots"]`), so a
surface added next month is monochrome by construction. Files on disk untouched
— the law applies where a plate is shown, not where it is stored.

### D7 · S1 · The full-page fix reproduced the original defect at phone width
**Surface:** `/robots` plates at 387px. Found by measurement during the lap,
before shipping.
On a phone the sheet is 223px (carousel, tracklist and transport have already
spent the screen) and nine plates at two-across are 823px: **six of nine plates
clipped** — D3 again, at a width nobody had looked at.
**Fixed:** a full block that overruns is divided into as many full pages as it
needs, and the division is measured off the grid's real ROW geometry rather than
assumed. The obvious arithmetic was tried first and is wrong: height ÷ page says
three tiles a page, and three tiles across a two-column grid is TWO rows. Now:
5 wall pages of 2/2/2/2/1, **all nine reachable, worst overflow 0px, 54px
headroom.** Desktop is unchanged and the path is inert there by construction
(one chunk, one page, the identical layout).

---

## 2. RECOMMENDED CONFORMANCE — mechanical, NOT done this round

These are drift, not judgment. They are listed rather than fixed because each
touches surfaces outside this round's brief and one of them (R1) is a
several-hundred-line sweep that deserves its own gated round. **None is
cosmetic; every one is a future S1/S2 waiting for the next change.**

### R1 · S3 · Four visitor-facing surfaces use ZERO design tokens
`src/styles/museum-tokens.css` is called the canonical source of truth. It is
imported by exactly two stylesheets. The rest re-type the palette:

| Surface | `var(--wb-*)` | hard-coded hex | of those, byte-identical to an existing token |
|---|---|---|---|
| `Exhibit.css` | 182 | 160 | — |
| `HrExhibitFlow.css` | 216 | 94 | — |
| `GiftShop.css` | **0** | 45 | 41 (91%) |
| `WbHome.jsx` | **0** | 43 | 33 (76%) |
| `InfoBooth.jsx` | **0** | 25 | 22 (88%) |
| `WbAdmin.jsx` | **0** | 38 | 0 (0%) — see J4 |

**96 of 151 hard-coded colours on those four surfaces are byte-for-byte a
`--wb-*` value that already exists.** `GiftShop.css`'s own header cites
"museum-tokens" while using none of them. The consequence is not theoretical: a
palette change today updates half the building and silently forks the other
half.
**Conformance:** mechanical substitution of the 96 exact matches; the ~55
remainder are either new tokens or genuine one-offs and want a decision each.
Reproduce: the table is generated by the script in the run log.

### R2 · S3 · The title bar is implemented three times
The room convention — brand left / room name centre / exit right — exists as
`.ex-nav-*` (Exhibit.css), `.gift-shop__nav-*` (GiftShop.css, whose comment says
"Mirrors Exhibit.css .ex-nav … re-pinned to paper tones") and `.booth-nav-*`
(InfoBooth.jsx, inline). Three class families, three stylesheets, same bar.
**It had already forked.** The exhibit's wordmark reads
`font-family: var(--wb-brand, 'Fredoka', sans-serif)`; the shop's and the
booth's read `font-family: 'Fredoka', sans-serif` — the literal. `--wb-brand` is
a LIVE trial (STATE: "Brand wordmark trial (Fredoka, nav only)"). The day Mike
moved the trial forward, the exhibit would have changed and the shop and the
booth would not — and a brand trial that only applies to a third of the rooms
cannot be judged.
**PARTIALLY FIXED this round.** The fork is closed: both wordmarks now read
`var(--wb-brand, …)`. This was taken as mechanical drift rather than a judgment
call — a literal standing where a token already exists, in an active trial —
and it is three lines. Verified first that the token is reachable: the
stylesheets bundle into one document and `--wb-brand` / `--wb-gold` resolve
identically on `/`, `/shop` and `/booth`. **That verification also makes R1
fully actionable** — nothing is blocking those four surfaces from the ramp
except the typing.
**Remaining conformance:** one `<MuseumBar>` taking brand / room / exit. Three
copies of the same bar is still three copies; only the fork was closed.

### R3 · S3 · Six overlay components, six Escape handlers, no primitive
`GalleryOverlay`, `AlbumOverlay`, `YouTubeOverlay`, `FacebookOverlay`,
`PhotoOverlay`, `FilterInstrumentOverlay` (all HrExhibitFlow), plus the robots
twin and the new reader. Eight full-screen overlays; the six HR ones carry six
copies of `const onKey = (e) => { if (e.key === "Escape") onClose(); }`.
The shared behaviour is real and identical (fixed inset, z-index, Escape,
explicit close). The template exists in practice and was never extracted, so
each new overlay re-derives it — and the eighth (the reader) had to reason from
scratch about which overlay Escape should close, because nothing owned that.
**Conformance:** an `<Overlay>` primitive owning ground, z-order, Escape and
focus. Non-trivial (six call sites in a 195KB file); worth its own round.

### R4 · S4 · Six Google-font `@import`s across five files
`Exhibit.css` (×2), `HrExhibitFlow.css`, `GiftShop.css`, `InfoBooth.jsx`,
`WbHome.jsx`, `WbAdmin.jsx`. Each is a separate render-blocking request and each
is a separate list that can drift from the others. The font stack is already a
token trio (`--wb-serif/-sans/-mono`).
**Conformance:** one import in `museum-tokens.css`; delete five.

### R5 · S4 · Two stylesheet mechanisms for the same job
`InfoBooth.jsx`, `WbHome.jsx` and `WbAdmin.jsx` embed complete stylesheets in
inline `<style>{\`…\`}</style>` blocks; every other surface uses a `.css` file.
The inline form cannot use the token file (which is why R1 lands where it does),
re-declares the global reset each time, and is a template-literal — a stray
backtick in a CSS comment is a build break, which it was, once, this round.
**Conformance:** `WbHome.css`, `InfoBooth.css`, `WbAdmin.css`.

### R6 · S4 · Dead event: `wb-robots-twin-closed`
Dispatched by `RobotsExhibitFlow.closeTwin()`; **no listener exists anywhere in
the tree.** Its purpose (the Portal track's live twin standing down) went with
G1's retirement of the live face. Harmless, and it cost a real minute this round
working out whether Escape could safely fire it.
**Conformance:** delete the dispatch, or restore a listener. Left in place this
round because behaviour does not change without a stated reason and its removal
is not this brief. Its spurious firing IS fixed — Escape now closes only what is
open.

---

## 3. JUDGMENT CALLS — Mike's, listed not decided

### J1 · The retired 2025 gold is still painting, on the most-used control
**30 live occurrences of `#b8974a`** across five files. This is the pre-2026
gold-on-dark accent; the museum's `--wb-gold` has been `#211f1c` (photo black)
since the B&W rework. `RobotsExhibitFlow` has a comment removing exactly this
colour as a stale trap — and it survives everywhere else.
**It is visible right now.** Verified on `/hr` with a track playing: nine
elements compute to `rgb(184,151,74)`, including **`.pb-ctrl` — the player bar's
play, volume and CC buttons** — and `.pb-sub`, the variant line under the track
title. Screenshot in the run log: three gold discs on an otherwise monochrome
bar.
Other sites: `.tl-active` border (the selected row, desktop and the ≤720px
rule), `.vp-record-door:hover` (the RECORDS doors on every WAL artist card),
`NpBars` (the now-playing bars, ×4), the `official` variant tag, and
`album.accent` default.
**Why this is Mike's and not mechanical:** it is a palette decision on the
building's most-used control. It reads as either (a) leftover the B&W rework
missed, or (b) a deliberate surviving accent — the one warm thing in a grey
room. Ops will not guess. **If (a): one substitution to `--wb-gold-*`, ~30
sites. If (b): it needs a token (`--wb-accent`) so it stops being a literal in
five files.** Either answer is better than the current state, which is a
retired colour surviving by inertia.

### J2 · The B&W law and the live twin
B4 says the robots wing is B&W "without exception (the plates included)". The
plates are done. **The Portal's twin is not**, and deliberately: it is an iframe
of the machine's own running screen (green phosphor `#9fdcb8`, amber `#8a6a2a`),
and the wing's own standing rule is *"photos are paper; video is television"*. A
photograph of a monochrome machine is a photograph; a CRT is not. Grayscaling it
would also mean reaching into a separate application.
**Ops reading: the law governs photographs; the twin is the machine.** Stated
rather than decided silently — one line in `Exhibit.css` closes it either way.

### J3 · A WAL exit that names no owner bills nobody
`?from=wal` with no `&owner=` leaves the top slot empty (verified). Mike's B1
ruling — house on top for "the no-exhibit-exit cases" — cannot apply here without
breaking Clause 3 of the billing law, which says W.B appears only when the
exhibit was W.B's own, and which is the clause Mike reported broken. So the empty
slot is the only reading consistent with the law.
It should also be unreachable — the wing always sends `owner=`. **Listed because
a stale link in the wild would land on a shop with nobody billed**, which is the
look B1 rejected. A fallback (first artist? the wing's first album?) is Mike's
call.

### J4 · WbAdmin is on a different palette entirely
38 hard-coded colours, **0 of which match any token** — it is still fully on the
pre-2026 dark scheme (`#050505`, `#b8974a`, `#2a2218`). Every other surface was
converted.
It is **operator-only** (`mmm` key sequence, no visitor route), so this is
deliberate-or-forgotten and costs a visitor nothing. Excluded from R1's
conformance recommendation on that basis. Mike's call whether the operator's
room joins the museum.

---

## 4. THE TEMPLATE REGISTER

Drift cannot be measured without a named baseline. This is what the templates
ARE, as built. Where the register and the code disagree, the code was read.

| # | Template | Canonical home | Status |
|---|---|---|---|
| 4.1 | **The title bar** — brand / room / exit | `.ex-nav-*`, Exhibit.css:449 | forked ×3 (R2) |
| 4.2 | **The face** — data, never a component: `kind`, `title`, `blurb`, `lines`, `entries`, `tombstone`, `records`, `decks`, `trail`, `collage`, `reel`, `panel`, `footer` | `Exhibit.jsx` face body | **holds** (H2) |
| 4.3 | **The frame** — `stage:true` (paged, no scroll) vs `faceFlow:"flat"` (document scrolls). Blocks are indivisible; `data-stage-split` breaks a list by row; `data-stage-full` gives a wall the page | `Stage` / `StageChildren` / `FaceFlow` | repaired (D3, D7) |
| 4.4 | **The museum card** — tombstone (factual register) + interpretive label, as separate blocks so they page | `.vp-tomb` / `.vp-card-label` | **holds** |
| 4.5 | **The tilt vocabulary** — `(i*7)%9 − 4`, deterministic, coprime stride | `.vp-collage-tile`, now `.vp-qcard` | repaired (D2) |
| 4.6 | **The trail** — Name + FUNCTION + one clause of scent, as rows | `.vp-trail` | **holds** |
| 4.7 | **The wall** — `auto-fill minmax(200px,1fr)`, tilt, shadow, tap-to-open, caption strip | `.vp-collage` | repaired (D3) |
| 4.8 | **The link seam** — a face declares a door; the ENGINE dispatches `artist.linkEvent` and knows nothing; the WING decides what opens | `openLink` + per-wing flow | **holds** (H3) |
| 4.9 | **The input field** — bordered box on the room's paper, question INSIDE as placeholder, one face and size across the group, border darkens on focus | `.wb-field` (new) · `.hr-jnl-*` conforms | established (D1) |
| 4.10 | **The reader** — in-place full-bleed overlay for our own imagery: rail with caption + frame count + transport + magnify + close; Escape; 1:1 with pan | `RobotsExhibitFlow` (new) | new this round |
| 4.11 | **The overlay** | *no canonical home* | ×8, unextracted (R3) |
| 4.12 | **The palette** — `museum-tokens.css` is truth; `tokens.js` is its hand-kept pair for inline styles only | `src/styles/` | **holds** where adopted (H1); adopted on 2 of 6 surfaces (R1) |
| 4.13 | **The billing law** — owner top; rest by date joined, earliest first, ties alphabetical; house only on its own wings or its own front door | `GiftShop.billing()` | **holds** (H4) |
| 4.14 | **The tracklist** — number/title plays; variant is a type-anchored select that always drops | `TrackList`, Exhibit.jsx:404 | **holds** |

---

## 5. WHAT HOLDS — verified, not assumed

Adversarial does not mean pretending nothing works. Each of these was tested for
failure and did not fail; they are recorded because each is hand-maintained and
its silent breakage would be expensive.

- **H1 · The token mirror contract.** `tokens.js` claims value-for-value equality
  with `museum-tokens.css` and has no build-time link. Checked programmatically:
  **16 CSS tokens, 16 JS pairs, 0 mismatches, 0 unpaired.** The contract has held
  since 2026-07-29.
- **H2 · Face-as-data.** No wing has smuggled a component into the face contract.
  `/hr` and `/wb` declare no faces at all and still cannot notice that faces,
  stages, reels or evidence classes exist. Verified: both routes render
  unchanged after every edit in this round.
- **H3 · The link seam.** Widening the door's detail (`openLink(href, extra)`) to
  carry a plate set changed nothing in WAL, which reads `href` and ignores the
  rest. The engine still knows nothing about readers or twins.
- **H4 · The billing law.** All seven exit cases re-run against the real roster
  after B1: owner correct in 6/6 owned cases, W.B present in exactly the 3 cases
  the law names, order earliest-first with alphabetical ties, in every case.
- **H5 · The no-scroll law.** Zero inner scroll traps on the staged wing at
  desktop and at 387px; the reader's pan-when-magnified is the instrument
  working, not a page swallowing content, and is the one deliberate exception.

---

## 6. RECOMMENDED SEQUENCE

1. **J1 first** — it is one question to Mike and it is painting on every page.
2. **R2's three-line fix** (point all wordmarks at `--wb-brand`) — closes a live
   fork in an active trial for almost nothing.
3. **R1** as its own gated round: the 96 exact matches mechanically, the ~55
   remainder as decisions. R4 and R5 fall out of it naturally, because the inline
   `<style>` blocks are what make the tokens unreachable.
4. **R3** last — the largest, and the least visible until the ninth overlay.

---

*Verified against the live tree and the running app, 2026-08-02. Gates at time
of writing: lint 11 errors / 9 warnings (HEAD baseline 11/10; one dead directive
removed, zero new findings — finding sets compared byte-for-byte), vite build
green, console clean.*
