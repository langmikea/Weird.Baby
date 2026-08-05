# CLAUDE.md session log — MAY 2026 (archived)

Archived from `CLAUDE.md` on 2026-08-04 (v51), under that file's own rule:
*"Don't let this file grow past ~600 lines. If it does, archive older session
log entries to `docs/`."* It had reached 643.

Nothing was edited on the way out. These are the entries from 2026-05-06 to
2026-05-15 inclusive, verbatim. The live log in `CLAUDE.md` keeps everything
from 2026-05-30 forward — the lint-baseline entry, which is still load-bearing,
and every v46+ round.

**Appended 2026-08-05 (v55): v53, v52 and v51, verbatim and newest-first above
v50.** `CLAUDE.md` had reached 711 lines. **Nothing load-bearing left the live
tree with them** — v53's measured third-party table lives in `OPERATIONS.md` §5
and its open ruling is register M37; v52's reveal-ledger model is
`reveal/README.md` and `OPERATIONS.md` §5; v51's two standing laws (Doctrine 16
THE LAW OF SUBTRACTION, and the Visual Hook Law's second recorded exception) are
in `OPERATIONS.md` §7 and `STATE.md`. **Read a rule from where the rule lives,
never from a session note** — which is the reason these can be archived at all.

---

### 2026-08-05 → THE BOOTH EDIT + THE MISSING LAP (v53; B1–B6) — sealed
- **B1** The lap v52 sealed without has run — eleven routes, desktop and 390px.
  **The guest book steps by ONE NAME every 5s and wraps invisibly** (offset
  1→…→9 showing `Ines·Ada·Bram` on the seam →0 with `snap`), **every sample
  exactly three rows, `blanks: 0`**. **MGK-NIAC collides nowhere** — the band is
  centred under its own cover to the pixel at 390px (123 = 123), the new cover
  renders, the tracklist reads `The Name · Image Archive · Technical
  Specificatio…`. **Method limits stated, not hidden:** this Chrome window is
  maximised and bottoms out at a 540px client area, so 390px is a same-origin
  **390×800 iframe rig** and the content width is **373px — tighter than a real
  phone**; and the book will not advance while `document.hidden`, which was
  confirmed FIRST unpatched (40+s at offset 0) before the flag was overridden to
  watch it move.
- **THE LAP'S OWN FINDING, and it is the round's largest:** `/hr` requests
  **`www.facebook.com` ×16 across seventeen iframes on arrival**, and
  `/robots`, `/wal`, `/wb` each request `www.youtube.com` ×3 — **nothing
  clicked**. Read off `performance.getEntriesByType('resource')`. A grep of
  `src/` finds every one of those strings and two rounds of readers still wrote
  *"the only outside party this site touches"*: **only loading the page finds
  the REQUEST.** Ruling is M37; the facade is C34.
- **B2** *"Are you tracking me?"* rewritten to Mike's line — **the machine
  remembers you and we don't** — with the cookie/storage distinction as
  mechanism (a cookie travels to the server every request; browser storage is
  read where it sits; both "no cookies" and "settings persist" are true at
  once). The MGK's record named for what it is, with **zero `fetch` and zero
  `XMLHttpRequest` in the whole twin**, and the purge surface named on the
  glass: **Preferences ▸ User**. **The twin's keys live in the MUSEUM's origin**
  — `wbr_*` read back off `weird.baby`'s own `localStorage`. Ten keys, not nine
  (`Rec_Keys_Session` returns three since FR2); **no count is printed**.
- **B3/B4/B5** Two forced questions deleted (the directory names the rooms, the
  shop is one click) — eleven → nine. *"Can I use what is here?"* re-led on
  **theirs is theirs**. The sweep read nine answers, fixed two — *"Is it really
  free?"* was restating the credo 400px above it; *"What is this place?"* led
  with ours — and **records why the other seven were left**.
- Other lap findings: `/wal`'s title bar is down to **6px** of air at 390 (C36),
  `/admin`'s controls are clipped and unreachable at 390 (C35), `/hr`'s FB cards
  paint as blank blocks (C12, observed on localhost, **not** marked confirmed),
  `/wb` prints "Weird.Baby" twice in its bar (C37), and **M30 is confirmed on
  the glass** for the first time.
- Gates: lint **11/9 = baseline**; build green **72 modules**; provenance
  **PASS** (UNDECLARED 0, INVENTION 0, stale 0 — 4 rows added, 8 pruned, no
  RESTATED chain broken); zero console errors/warnings on eleven routes.
- Round log: `docs/MUSEUM_BOOTH_EDIT_LOG-20260805.md`.

### 2026-08-05 → THE REVEAL LEDGER (v52; Q1–Q3, R1–R6) — sealed
- **Q1** The guest book went blank on the live site, **and the arithmetic was
  never the fault** — it was correct for every length it could reach. The
  advance ran on a `setTimeout` and the wrap on a `transitionend`: **two clocks,
  and only one of them stops when the page stops being rendered.** A hidden tab
  throttles timers and SUSPENDS RENDERING, so the offset kept climbing and
  nothing ever wrapped it back. The fix is **two guarantees that need no event
  to arrive** — the offset is clamped to `[0, n]` where it is used, and the
  copy count is derived (`1 + ceil(VISIBLE/n)`) so the track is always long
  enough for that clamp. Blank is now unreachable at ANY length, proved by
  exhaustive simulation with every event adversarially dropped (old machine:
  blank at tick 4, row 119 of a 12-row track). Also pauses on `document.hidden`
  and the wrap has a timeout backstop.
- **Q2** `STEP` = 1. Bounce, 5.0s rest, 520ms move, hover pause and
  reduced-motion fallback all untouched.
- **Q3** MGK-VIII → **MGK-NIAC** on everything that LABELS the machine; UNCHANGED
  on every sentence where the old name is a **fact of the record** (*"SOLD AS
  MGK-VIII — ABEAL's 1965 rebrand"*), because conforming those would delete the
  fact the rename is derived from. `id: "mgk-viii"` and
  `/robots/reference/mgk-viii/` deliberately NOT renamed — a key and a
  cross-repo directory that print nowhere. It closed a `[PAPA]` the face was
  still printing. One judgement call: the track is now **THE NAME** (M36).
- **R1/R2** `reveal/ledger.json` — **151 rows, one per REVEALABLE THING** across
  both repos. The twin's rows are read off **the DISPATCHER** (`Run_EXE`), never
  the CSVs, on Mike's instruction; the museum's 18 albums / 134 tracks are
  extracted by script. `when` is null on every row (Doctrine 12).
- **R3** **C32 CLOSED** — `uid` (minted once, the row's NAME) + `sha256` (resolves
  a pure move) + **a refusal to guess**: a judged row whose file is gone is now
  reported under its own banner with `--rename` as the human declaration. It
  caught v51/A7's own stranded rename on the first run.
- **R4/R5/R6** `docs/REVEAL_LEDGER_AUDIT.md`, generated not typed. `/foundation`'s
  LIVE/NOT BUILT column reads the ledger — proved by flipping a row and reading
  the change out of the built bundle. **The ledger returns STATE, never WORDS**,
  because `provenance:gate` sweeps only `src/`.
- Gates: lint **11/9 = baseline**; build green **72 modules**; provenance **PASS**
  (INVENTION 0); asset table **253 rows, 0 orphaned judgements**; `reveal:check`
  PASS. **THE BROWSER LAP DID NOT RUN** — the Chrome extension was unavailable
  all session; every rendered string was verified in the BUILT BUNDLE instead,
  which cannot catch layout or overflow. Named as a gap in the round log.
- Round log: `docs/MUSEUM_REVEAL_LEDGER_LOG-20260805.md`.

### 2026-08-04 → M23 RULED + THE ALBUM ROUND (v51; M23a–M23b, A1–A7) — sealed
- **M23a/M23b** Mike ruled on both pairs v50 built, and both rulings went past
  "pick one". The booth loses **BOTH** hook candidates with **no replacement** —
  *"THE TITLE IS THE GRAB"* — and the exception is recorded beside the Visual
  Hook Law: **a page whose own words are the hook needs no image.** The guest
  book keeps the scrolling version and then changes it: **three rows, a stepped
  PAGE advance**, `cubic-bezier(.34,1.3,.64,1)` bounce, 5.0s rest, wrap by
  arithmetic on `transitionend`. `?hook=` and `?book=` are gone — **no query
  parameter selects a variant anywhere in the building any more.**
- **A1** `tools/make_unit_covers.py` — both machine albums on the ROBOTS
  template, constants LIFTED from `make_robots_cover.py` so a re-render cannot
  drift. VIIIp gets the unit whole; **MGK-VIII gets a detail because this museum
  holds no photograph of it whole**, which its own archive says out loud (M30).
- **A2/A3** the album band is a `1fr auto 1fr` grid — name centred under the
  active cover (845=845 at 1706px, 185=185 at 386px), band 39.8 → 31.8px.
  **`.ex-album-banner-aux` must not carry `min-width:0`** or the transport paints
  across the name; measured overflow to x=−31. At ≤720px the one wing with a
  transport falls back to two columns, and the arithmetic for why is in the log.
- **A4** the three ramp steps above body come down (lead 1.14→1.09, head
  1.32→1.19, display 1.56→1.30). Title 27.03 → 24.37. **Zero call sites
  changed** — P7's law intact.
- **A5** the 31½ card struck, and the count with it in all three places; the FAQ's
  *"How many are there?"* removed rather than re-answered. **It emptied the
  provenance register's INVENTION class** (3 → 0, ceiling ratcheted to 0) and
  closed M1 by deletion. Cost, named: the FAQ face now ships with no picture
  (M29). Mike's law recorded as **Doctrine 16, THE LAW OF SUBTRACTION**.
- **A7** C14 (a WebP named `.jpg`) and C15 (unscrubbed collage captions, proved
  live with an injected marker) closed. **C14 exposed C32** — the asset table is
  keyed by path, so a rename drops every judgement on a file in silence.
- Gates: lint **11/9 = baseline**; build green **70 modules**; provenance gate
  **PASS** (0 undeclared, 0 stale, INVENTION 0); asset table **253 rows**;
  desktop + genuine 386px laps over nine routes, zero horizontal scroll.
- Round log: `docs/MUSEUM_ALBUM_ROUND_LOG-20260804.md`.

### 2026-08-04 → THE OVERNIGHT (v50; N1–N9) — sealed
- **N1** THE MORGUE struck — both walls read **IMAGE ARCHIVE** (closes M6); **The
  Firmware → TECHNICAL SPECIFICATIONS on BOTH faces** that carried it (scope call
  flagged as M24; the ARTIFACT keeps its name, only the FACE was renamed);
  **The Parts deleted whole** — which orphaned `parts_drawer.jpg` (M9) and took
  three unrecoverable observations with it, named in the round log; directory
  drops its one article and **the Information Booth moves to the bottom**.
- **N2** The archive's older spreads **stow** in a native `<details>` whose closed
  line carries its own date AND count, so it does not trip the
  no-hidden-information law. First spread and unheaded walls never stow → the
  VIIIp wall is byte-identical. Measured 21px closed / 258px open. Siblings
  renamed **VIDEO ARCHIVE / AUDIO ARCHIVE** and deliberately not built.
- **N3** **DOC CONTROL**, a fourth front-desk face, carrying Mike's manual-in-
  pieces canon out loud. Nothing on it describes this repository.
- **N4** Welcome rebuilt around **orientation** (contents list + a WHERE TO START
  row) and the invented "three cartons" count deleted, not replaced (closes M15).
  Contact stripped to the address plus three one-line reasons to write.
- **N5/N6** **Two surfaces ship two alternatives each until Mike picks (M23):**
  `/booth` vs `/booth?hook=sign`, `/` vs `/?book=scroll`. The loser gets deleted —
  the lobby's retired `?subtitle=` is this repo's own record of why.
- **N5b** *"Are you tracking me?"* rewritten against `worker.js` and `index.html`,
  **and it found the published answer wrong**: the site ships a Google Fonts
  `<link>`, so the old *"that is the whole of it"* was false.
- **N7** Foundation ledger gains **DONATED BY**; ANONYMOUS is first-class and
  **appears nowhere**, because inventing a donor is still inventing (M27).
- **N8** `revealArc` is the asset table's fifth judged field; populated on 6 of
  251 and it surfaced M25 (a wall claiming nine plates are "before power" holds
  one captioned as the firmware running).
- **Two tool defects fixed:** `usedBy` counted a path named in a **comment** as a
  reference (so orphans were invisible once anybody wrote their name down), and
  `--scan` could never add a new header key.
- Gates: lint **11/9 = baseline**; build green **70 modules**; provenance gate
  **PASS** (0 undeclared, 0 stale, INVENTION 3); desktop + genuine 390px laps,
  zero horizontal scroll, zero console errors/warnings across 11 routes.
- Round log: `docs/MUSEUM_OVERNIGHT_LOG-20260804.md`.

### 2026-05-15 → tier reconciliation + navigation expansion
- `7f9843d` fix(deep-dive): trimmed `TIER_BY_NAMESPACE` in `hr_dimensions.js` to the canonical seven (`year/album/song/venue/people` at Tier 1; `source/type` at Tier 2). MV-residue namespaces fall to dynamic Tier 3 via the `?? 3` fallback. `CANONICAL_VOCABULARY.md` line 86 follow-up resolved.
- `386f69e` docs: NAVIGATION.md — added "Current state and what's next" section.

### 2026-05-14 → navigation + architecture critique (`5a89835`)
- Landed `NAVIGATION.md`, a Phase 2b architecture critique, and vocab migration scripts.

### 2026-05-13 → B-1 plan locked (`5558fb2`)
- B-1 implementation plan committed; seven operator decisions locked.

### 2026-05-12 → architectural recovery (`b1a632c`)
- `docs/CANONICAL_VOCABULARY.md` locked from v28_3 prototype; UX/data lifecycle specs and Q-5 follow-up note landed. Flags drift between `b29f9fe`'s `TIER_BY_NAMESPACE` heuristic and the new canonical doc (reconciled 2026-05-15 in `7f9843d`).

### 2026-05-11 → MV-driven artifacts + v4/v5 spec arc (PR #16, `b29f9fe`)
- `21cf558` docs: end-to-end workflow map (ground truth before architectural pivot).
- `649f006` docs: `SPEC_DRAFT_v4.md` — corrected architecture, supersedes v3.
- `669c7e7` docs: `SPEC_DRAFT_v5.md` — strict tag equality, Exhibitor's Badge, loud failures.
- `79159e3` docs: `SPEC_DRAFT_v5_1.md` — patch addressing v5 design review findings.
- `08299ee` docs: `SPEC_DRAFT_v5_2.md` — Q-1, Q-5, Q-6 resolved; Path B selected.
- `b29f9fe` feat(deep-dive): phase v5-3+v5-4 — MV-driven artifacts replace authored card data. Added `TIER_BY_NAMESPACE` heuristic with seven MV-residue namespaces (reconciled to canonical 2026-05-15 in `7f9843d`).

### 2026-05-10 → deep dive phases 1 + 3, export CLI, playbook updates
- `1ca62ac` tools: yt-ingest CLI for YouTube → MediaVault pipeline (PR #9).
- `a858a32` docs: deep dive phase 0 audit + status taxonomy research.
- `3c16a30` docs: stage deep dive review materials (PR #10).
- `c14267e` cards: add stable `id` field to all source entries (PR #11).
- `5f1bdee` docs: deep dive verification reports (4, 4B, 4C).
- `c059141` docs: deep dive spec v3 and v2 review report (PR #12).
- `bb2c343` feat(deep-dive): phase 1 foundation — vocabulary, prebuild, columns, adapter wiring (PR #13).
- `860ee05` feat(deep-dive): phase 3 export CLI — MV to museum bridge (PR #14). Added `tools/export-deep-tags.mjs`; later renamed to `tools/export-artifacts.mjs` with `npm run export-artifacts`.
- `8872ec0` fix(export-deep-tags): drop `archived_at` clause; add `prebuild-install` dev dep.
- `caf1b01` chore: add `.gitattributes` enforcing LF; renormalize existing files.
- `53394ff` docs(claude.md): playbook updates from Phase 3 session findings (PR #15).

### 2026-05-09 → FUSE git-init quirk + yt schema close (PR #8, `a208ebd`)
- Captured FUSE git-init defect in CLAUDE.md cowork-sandbox quirks. Closed yt-ingest schema's `local_asset_path` question.

### 2026-05-08 → yt-ingest design (PR #7, `5702e47`)
- YouTube ingest design + schema landed; CLI deferred to PR #9.

### 2026-05-08 → exhibit UX round 2 (PR #5, squash `218fe96`)
- TAB_PEEK 14 → 30 (full label visible)
- Active tab fontWeight 700 → 800; 1px INK_SOFT cover masks deck-body border under active tab
- `noneSelected` prop threaded through pills; "all selected" semantics for empty columns
- `pillCount` color now matches `pill` label in every state
- Per-tab `✕` always rendered (dim when no clearable selection, bright when clearable)

### 2026-05-08 → exhibit UX tweaks 1 (PR #4, squash `b352ccc`)
- Tab strip 42 → 30, font kept
- Tracklist variants now radio (one per track)
- Tracklist unselected `#4a4a4a` → `#7a7a7a`; deck pill unselected `#b8974a` → `#6a5520`
- Per-tab `✕` introduced; strip-level "clear all" removed
- `position: fixed` on deck (vs absolute-in-section) — pins to viewport bottom regardless of section centering
- Conditional 60px lift via `body:has(.pb)`
- AuditStrip render-call removed (function preserved)
- Album art scales with `cfH` panel height

### 2026-05-07 → lint cleanup (PR #3, squash `348c93f`)
- HrArchive duplicate `borderBottom` removed
- Exhibit `selectAlbum` declaration moved above the useEffect that uses it
- HrExhibitFlow `serifDisplay` annotated as preserved-unused
- Exhibit `usePersist` empty catch documented
- `__BUILD_TIME__` declared as a global in `eslint.config.js`

### 2026-05-06 → tracks and variants populated (PR #2, squash `e4ea01b`)
- Variant taxonomy locked: Official / Live / Lyrics / Cover; clips removed
- Lyric videos re-tagged from `type: "official"` to `type: "lyrics"` on Lampshade, Quicksand Sinking, Friendly Fire
- Clips dropped from spine: '94 Acoustic Clip, Low Live Clip, Flash in the Pan Live Clip, A Pot Song Official Clip
- HrArchive `ALBUMS` reconciled: Skipping Stones last track corrected (Run From The Devil → Soul Sucker), Crooked Home appended Cookin' in the Bathroom and A Pot Song
- HrArchive `SINGLES` deduped (kept Chase The Dragon only)

---

## Appended 2026-08-05 (v52) — the three 2026-05-30 entries

Moved verbatim from `CLAUDE.md` under that file's own ~600-line rule. Nothing was edited; the v52 entry took them past the line.

### 2026-05-30 → lint baseline restored (eslint ignores non-source)
- `eslint.config.js`: added a `globalIgnores` block covering `_cowork/`, `dist`, `dist.pre_*`, `.phase1_retired_files/`, and `*.pre-*`/`*.old_v*`/`*.bak_*` backups. `eslint .` had been sweeping minified vendor backups (`dist.pre_p14_final_2` + `dist.pre_phase1_2` = 117 err each) and `_cowork/` scratch (18 err) — ~252 noise errors burying the real source baseline and making the count useless as a regression tripwire. Now `eslint .` reports `src/` only.
- **Source baseline confirmed unchanged at 4 errors / 6 warnings** (the documented debt): `WbAdmin.jsx:18` (1 err); `Exhibit.jsx:88/191/517` (3 err + 5 warn); `HrExhibitFlow.jsx` (1 warn). Zero new errors introduced — config + doc change only, no `.jsx`/`.css`/data touched. Reconciled the lint-debt table drift: `Exhibit.jsx:508 → :517` (`advanceQueue` decl `577 → 592`).
- Sandbox caveat (cost ~real time, banking it): a cowork-sandbox `eslint .` shows **5 err / 5 warn**, not 4/6 — a phantom `Parsing error` in `HrExhibitFlow.jsx:2157` caused by the FUSE truncation quirk (sandbox view 2156L/92KB vs intact 2291L/98KB; eslint chokes at the cutoff). It also suppresses that file's one real warning. Verified the intact git-HEAD copy lints to **0 err / 1 warn**, so on Windows `npm run lint` reports the true 4/6. Don't "fix" the phantom — it's not in the source.
- `eslint.config.js` + `CLAUDE.md` only. Committed (not pushed).

### 2026-05-30 → content_kind front-end block + -036 triage decision (`9bce017`)
- `HrExhibitFlow.jsx` + `.css`: added a `content_kind` media-variant block (`ContentKindBadge` / `contentKindOf`) to all five artifact-card feet. Renders the spec §3.5 values (official/live/lyrics/cover) as a gold-bordered uppercase chip in the deck's pill language. Off-spec values (e.g. the `content_kind:other` on the Central-PA gallery container) are ignored; cards with no spec-valid content_kind are byte-identical to before. Display-only, code-only — no export/DB change. Built + deployed; verified live on weird.baby/hr: 39 badges (official 25 / live 11 / lyrics 3), gallery + coverflow unregressed.
- Step-zero re-verified the `6c1aec1` broken-preview fallback across all three surfaces (gallery card cover, lightbox large image, thumb strip) via uncommitted bogus-URL edits to `hunter_root.json`; reverted to a clean tree.
- Artifact **-036** (`MV-HR-20260405-036`, `HOMESTEAD_Reboot_Complete.jpg` — a live acoustic shot with a "HOMESTEAD: Reboot complete" overlay): diagnosed as stuck in MV **`inbox`**, not a render bug. It's already export-excluded, so it correctly does not render. Operator opted not to publish it ("image can be deleted"); left in inbox, **no MV write performed**. Optional archive/delete deferred to explicit operator word.
- ⚠️ The **256 errors / 6 warnings** figure noted here was non-source noise — `eslint .` was sweeping `_cowork/`, `dist.pre_*/`, and other backup trees, not real `src/` regressions. This change added **zero** new. **RECONCILED 2026-05-30** (lint-config session, see top session-log entry): `eslint.config.js` now ignores those trees, so the source baseline is back to the documented **4 errors / 6 warnings**.

### 2026-05-30 → broken-preview fallback for gallery/artifact images
- `HrExhibitFlow.jsx` + `.css`: gallery/artifact images with a null/empty `src` or that 404/fail to load now degrade to a styled placeholder (muted INK/GOLD tile, artifact title + "image unavailable") instead of silent blankness — across the gallery card cover and the lightbox large image + thumb strip. Background-image surfaces (no native `onError`) detect failure via an out-of-band `Image()` probe hook (`useImageFailed`); the lightbox `<img>` uses native `onError` (`FallbackImg`, keyed on `src`). Display-only — no DB/sync/export touch. Addresses the HEIC-incident failure mode (assets fail by path OR format with no front-end signal).

---

## Archived 2026-08-05 (v53) — the two oldest live entries, under CLAUDE.md’s own ~600-line rule

### 2026-08-04 → MECHANIZE PROVENANCE (v48; P1–P4) — sealed
- **P1/P2** `tools/provenance-sweep.mjs` + `provenance/` — a hash-keyed register
  of every visitor-facing string, and a gate that fails on any that is
  undeclared. Extraction is AST-based and **default-deny** (sixteen named,
  counted exclusion rules; `--rules` / `--rule-sample` to audit them). CSS
  `content:` and `index.html` meta are swept too. **Editing a declared string
  changes its key and fails the gate** — proved on two live tests.
- **P3** 2,528 strings classified: VERIFIED 1,148 · HOUSE 1,001 · RESTATED 282 ·
  MIKE 75 · DERIVED 19 · **INVENTION 3** · UNDECLARED 0. Plus 33 images
  declared with `textInImage` after looking at every one; 18 carry text.
- **Findings, none fixed** (Doctrine 12: Ops asks) — `docs/PROVENANCE_RULINGS-20260804.md`:
  the `/robots` unit count says **31½** where its source says **31.4**; the
  MGK-VIIIp front-glass plate is **mirror-reversed**; the WAL Hunter Root
  portrait wears another band's name; the Manual's plate is a render;
  `hr_facts.js` (124 strings, 3 self-flagged unverified) and
  `hr_journal_prompts.js` (30) are unreachable.
- Gates: lint 11/9 = baseline; build green 70 modules; provenance gate PASS;
  desktop + genuine 390px laps, zero horizontal scroll, zero console errors.
  **No rendered source changed** — `git diff` was `package.json` only.
- Round log: `docs/MUSEUM_PROVENANCE_LOG-20260804.md`.

### 2026-08-04 → THE CLEAN SLATE ROUND (v46; C1–C4) — not yet committed
- **C1** 27 visible meta-copy strings removed across `robots.js`,
  `worth-a-listen.js`, `worth-a-listen-facts.js`, `Foundation.jsx`. Sharpest:
  the Portal's five drum refusals printed internal decision codes ("held — one
  entry state (C3)", "held — workshop entry, by URL") under the latch; Hunter
  Root's WAL artist card was two paragraphs about this website's renderers; nine
  vault facts were our build narrative served as song facts (one also FALSE
  since W8). No new fact introduced anywhere — every rewrite uses material
  already on its own page.
- **C2** Record 013 rewritten flat per Mike. Same facts/sections/labels/doors/
  order; cadence, quoted failure modes, first-person colour and beat-fragments
  removed.
- **C3** Deleted: `HrHome.jsx` + `public/museum.jpg` (a mockup photo with room
  labels painted in, incl. "BULLITEN"), `HrFanWall.jsx`, `HrMedia.jsx` (both
  "— coming soon."), `SEED_ENTRIES` (13 fabricated fan testimonials, verified
  unreachable), `/hr/archive`'s two dead controls. Routes dropped from `App.jsx`;
  the E2 catch-all lands all of them on the Lobby.
- **C4** Eleven exposed gaps listed in the round log — chiefly that `/hr` is now
  one page plus an unlinked discography, the `/hr` journal is dead machinery
  with no persistence, and Jesse Welles' "That Can't Be Right" has zero song
  facts left. Nothing invented to fill any of it.
- Gates: lint 11/9 = baseline, zero new; build green **70 modules** (was 73);
  21-pattern ban sweep over every rendered route + every album × track = zero
  hits; desktop + genuine 390px laps, zero horizontal scroll anywhere.
- Round log: `docs/MUSEUM_CLEAN_SLATE_LOG-20260804.md`.

---

### 2026-08-05 → THE FOUNDATION COPY (v54; F1–F8) — sealed
- **Mike answered `/foundation`'s questions himself.** Every round before this
  built that room by DIGGING — charter, dictations, booth, robots repo — and
  assembling answers from things he had said elsewhere. The instruction with the
  answers governed everything: **land his phrasing; where he wrote an
  INSTRUCTION rather than copy, honour it and MARK the gap, never fill it.**
  **The round is almost entirely subtraction and marking.**
- **Fourteen questions → twelve in the data → ELEVEN on the glass**, and that
  last gap is new machinery worth knowing: **the billionaires answer is marked in
  EVERY sentence, so `visitorProse` empties it and `kept` drops the whole
  entry.** First answer in the building to take that path to the end — `[PAPA]`
  had only ever eaten single sentences before. `FAQ.length` is no longer the
  number a visitor sees. His three ideas (Illionaires · size of the pile · more
  pie) are preserved verbatim; one Ops sentence (*"Why keep grabbing for
  more?"*) was deliberately NOT carried into the pile he writes from. Placement
  is open (M41); voice is M13.
- **F2's two deletions, and only one was free.** *"So who is actually paying for
  all this?"* cost nothing — the posture is signed under the invoice, and the
  argument that it was worth landing twice is exactly what Doctrine 16 was
  written against. *"Who pays you?"* **cost the page the charter's only list of
  the four gifts of service** (design, code, shelf, legal work) and the only
  sentence saying the job pays nothing. Named as a cost, M42. **The legal-work
  clause inside it has now been removed (v41), restored (v42) and removed again
  (v54) — do not re-run that argument.**
- **F5: the rule shipped, the names did not.** His money rule (*spent promptly on
  that cost, or it goes back; nothing pooled, no slush fund*) is the money
  section's second law; his mechanism (*a cost carried by somebody other than the
  keeper takes its own line, in the name of whoever carried it*) is one sentence
  of invoice small print. **The two real households he supplied are in NO file in
  this repository** — not `src/`, not the round log — pending consent (M38).
  Precedent: CS 2026-08-04 took the operator's OWN name off the glass for less.
- **F6: two doors, no addresses.** *"Can I donate?"* and *"Can I send you
  something?"* (his titles) each carry `link: {text, reveal}` rendering a named
  door + the register's `NOT BUILT` stamp and **no `<a>` element at all** — a
  dead anchor is the dead control Doctrine 11's corollary forbids. State reads
  `reveal/ledger.json`, so building the channel flips the stamp with no edit here.
- **`a` may now be a STRING OR AN ARRAY of paragraphs** (Foundation only), because
  his *"How do I get some of that?"* is two beats with the Pro-Tip on its own and
  flattening it would edit his line breaks.
- **F1's judgement call, flagged as one (M43):** *"Where does it actually go?"*
  was answered *"the ledger, not prose"* — but that register is the INCOMING
  side, so a bare pointer points at the wrong half. The charter's beneficiary
  clause stayed as the pointer's destination; the rest went; the outgoing half is
  declared NOT BUILT. The deleted grant-form argument is not lost — he re-supplied
  it as the Pro-Tip.
- **F7** the lobby board indents *Other Music Worth a Listen* — padding on the
  LABEL, not the button, so the arrow column stays unbroken. **Measured: at a
  373px content column (tighter than a real phone) the box is 256px against 240px
  needed — 16px of slack.** A first draft of that comment asserted numbers written
  before the measurement and wrong in both directions; the lap caught it.
- Gates: lint **11/9 = baseline**; build green **72 modules**; provenance
  **PASS** (UNDECLARED 0, INVENTION 0, stale 0 — 14 rows declared, 14 pruned; two
  RESTATED rows resolve to a register KEY rather than a path); desktop + 373px
  laps, zero horizontal scroll, zero console errors/warnings, zero `[PAPA]` leak.
  **Lap ran on localhost, not `weird.baby`.**
- Round log: `docs/MUSEUM_FOUNDATION_COPY_LOG-20260805.md`. **Seven questions for
  Mike, none blocking.**
