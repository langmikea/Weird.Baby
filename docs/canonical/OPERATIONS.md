# OPERATIONS — Weird.Baby Museum (cross-session operating manual)

**Authority:** This file governs HOW any agent/session works on this project.
`STATE.md` governs WHAT exists. `docs/canonical/` governs design intent.
On conflict about process, this file wins. On conflict about facts of the
tree, the live working tree wins — always.

**Read this file FIRST in every session, before STATE.md, before any handoff.**

**Last verified against live tree:** 2026-08-05 (v55 RECORD MACHINERY — a drafting-lane round that touched **nothing in `src/`** and built the vessels the Record's first two weeks will land in. The ledger is cut **one row per Record ENTRY** and the rows are **derived out of the Record rather than typed against it**, by a reader deliberately split so that the half the ledger builds from can see entry numbers and asset paths and **no words at all**; the constraint the audit only stated — the ledger must never become a second copy of the Record — is now enforced three ways and **all three were broken on purpose to prove they fire**. `doc.record` is the volume only, and an unnumbered entry fails the build rather than being handed an id. The audit §8b **cue cards are built** — `npm run reveal:cards`, 49 of them, one per held thing, one blank each — and the deck is 49 rather than 143 because asking what day a REVEALED thing came out invites an invention. **The manual is a supply line now**, on Mike's ruling that it arrived in pieces: a page vessel carrying its own production arc and the Record entry that called for it, **built, empty, and proved without inventing a page**. The stale ancestor in the robots repo is marked superseded and kept for the thing it is still the source of. And the fifth reveal class is put to Mike as **one question** with a second case nobody had noticed — `route.hr` is held permanently by his own ruling and its cue card asks what day it comes out. Round log: `docs/MUSEUM_RECORD_MACHINERY_LOG-20260805.md`). Previously 2026-08-05 (v54 THE FOUNDATION COPY — Mike answered `/foundation`'s questions himself and the round was almost all subtraction: fourteen questions become twelve and **eleven render**, because the billionaires answer is now marked in every sentence and the scrubber drops it whole — the first answer in the building to take that path to the end. Two questions deleted, one of them at a named cost (the four gifts of service lost their only list). **Two real households he supplied for the invoice did NOT ship** — consent to be named on a public page is not the museum's to assume — while his RULE about earmarked money and his MECHANISM for a cost carried by somebody else both did. Two link slots ship as named doors stamped NOT BUILT off the reveal ledger, with no `<a>` at all. The lobby board indents *Other Music Worth a Listen*, measured at 16px of slack. Round log: `docs/MUSEUM_FOUNDATION_COPY_LOG-20260805.md`). Previously 2026-08-05 (v53 THE BOOTH EDIT + THE MISSING LAP — the browser lap v52 sealed without has now run over eleven routes at desktop and 390px, and it found that `/hr` requests `www.facebook.com` sixteen times across seventeen iframes on arrival and that `/robots`, `/wal` and `/wb` request `www.youtube.com` three times each, none of it clicked; the booth's privacy answer is rewritten around the machine remembering a visitor when the museum does not, and its outbound clause — on its THIRD version, the first two both false — now names Google, YouTube and Facebook; two forced FAQ questions deleted under the Law of Subtraction and two more answers re-led). Previously 2026-08-05 (v52 THE REVEAL LEDGER — the guest book stops going blank and steps one name at a time; the MGK-VIII album is MGK-NIAC everywhere it is a LABEL and unchanged everywhere it is a FACT; `reveal/ledger.json` catalogues 151 revealable things across both repos and `/foundation` is the first surface reading it; C32 closed — the asset table is keyed by a uid a rename cannot touch, and a judged row whose file vanishes is now reported rather than dropped). Previously 2026-08-04 (v51 M23 RULED + THE ALBUM ROUND — both of M23's pairs are struck and both losers deleted, so `?hook=` and `?book=` no longer exist; the guest book steps; the two machine albums wear covers built on the ROBOTS template; the album band's title is centred and shorter; the face type ramp's top three steps came down; the 31½ card and the count with it, which emptied the provenance register's INVENTION class)

---

## 1. Roles & the carry model

- **Mike** owns all UX-facing / UX-impactful calls, runs ALL host-side
  execution (pwsh, git push, deploy), and **carries** material between the
  three surfaces below. Nothing moves between surfaces unless Mike moves it.
- **Claude (any surface)** owns Ops: scoping, briefs, verification,
  drafting. Claude never pushes, never deploys, never decides UX.
- Questions to Mike: one at a time, only when genuinely load-bearing and
  undecidable; phrased in UX-impactful terms, concise bullets, plain
  syntax. Otherwise assume-and-state.

## 2. The three surfaces — capabilities matrix

| Surface | Repo reach | Can write repo | Push/deploy creds | Role |
|---|---|---|---|---|
| **Chat Claude** (claude.ai) | NONE. No filesystem access to `C:\AI`. Has: Google Drive connector, Chrome browser, web, chat uploads. | No | No | Scoping, briefs, doctrine, reading conduit drops |
| **Cowork** (desktop app) | Full, via per-session folder mount Mike approves | Yes (sandbox) | **No** | Repo reads, big-file edits, multi-file scoping, reports |
| **Host pwsh** (Mike) | Full, native | Yes | **YES — the only durable path** | Push, deploy, MV launch, anything load-bearing |

Facts every session must hold without rediscovering them:
- Chat Claude NEVER has a "Cowork tool." Cowork is a separate app Mike
  runs. Chat Claude writes Cowork **briefs**; Mike carries them.
- Cowork folder mounts and delete permissions are **per-session**.
- There is no CI. Deploy is manual: `npm run build && npx wrangler deploy`,
  host-side only.
- Cowork outputs land in
  `%APPDATA%\Claude\local-agent-mode-sessions\<session>\...\outputs` —
  Mike carries them out (chat upload or the Drive conduit, §3).

## 3. Conduit protocols (how material moves)

**Chat → Cowork:** Chat Claude writes a self-contained brief (one task,
explicit read-only/write scope, explicit output filename). Mike pastes it
into Cowork.

**Cowork → Chat:** Cowork writes its output file; Mike either uploads it
to the chat directly or drops it in the Drive conduit (below). Either is
fine; Drive is preferred for code files (chat Claude reads them via the
Drive connector, octet-stream/base64 for `.jsx` etc.).

**Host → Chat:** Mike runs a script chat Claude wrote and pastes output
back. Keep host paste-backs small (single files, short reports); anything
big or multi-file goes through Cowork instead (Doctrine #3).

**The Drive conduit — `G:\My Drive\_conduit\`:**
- A dedicated folder. Everything in it is a **transfer payload**, not a
  reference copy.
- Every file dropped into `_conduit` MUST start with a freshness stamp
  header: `<!-- CONDUIT: HEAD <short-sha> · <ISO timestamp> -->` (or a
  `#` comment line for non-markdown). Writer adds it; reader checks it.
- **Staleness rule:** if the stamp's HEAD doesn't match current
  `origin/main`, or the file has no stamp, treat it as STALE — usable as
  a hint, never as scoping ground truth. (Drive has served stale/retired
  trees before; loose files in Drive root from past sessions are stale by
  default.)
- `_conduit` is disposable. Clear it freely.

## 4. Script rules (anything Mike runs host-side)

1. **No placeholders, ever.** Every path, every value concrete. If a
   value is unknown, the script's first job is to discover and print it.
2. **Flat statements.** No load-bearing work inside `if/else` in scripts
   pasted line-by-line — the `else` orphans in the console and silently
   skips. Use explicit verify-or-abort lines.
3. **Read-only by default.** Scripts that write say so in their first
   comment line and name every path they touch.
4. PowerShell 7; single-line or `@'...'@` heredoc; UTF8 **no BOM**.
5. After any write script: print verification (byte counts, `git status`,
   tail of file) so the paste-back proves the result.

## 5. Verified file map (as of 2026-06-09)

The HR exhibit page is **two stacked components**. Mount chain:
`HrSpine → Exhibit → HrExhibitFlow` (seam: `<ExhibitFlow>` at
`Exhibit.jsx:992`, prop-widening per UX_PRESETS_SPEC §9).

| Concern | Lives in |
|---|---|
| Nav, coverflow carousel, **left tracklist panel**, **right player/PUV region**, bottom player bar | `src/routes/exhibit/Exhibit.jsx` (~43KB) + `Exhibit.css` |
| Tracklist rows, variant tag buttons (`TAG_SLOTS`, radio-per-track `handleTagClick`) | `Exhibit.jsx` (TrackList :404) + `Exhibit.css:83–105` |
| Pop-Up-Video box = `FactScroller` (def :79, mounted :978), `‹ ›` nav :155–156 | `Exhibit.jsx`; facts data: `src/routes/hr/hr_facts.js` (seed content — fill is a separate task) |
| Player ownership (YT/audio, shuffle/loop state) | `Exhibit.jsx` |
| **Artifact deck/grid + controls dock** (tabs, P3Panel :2446, typed cards, presets/journal tab bodies) | `src/routes/hr/HrExhibitFlow.jsx` (~162KB) + `HrExhibitFlow.css`. **Dock is a LEFT RAIL** (relayout 2026-06-09): vertical tab strip on the left edge, peek-on-hover, `ew-resize` drag on the rail's right edge, width persisted `wb-hr-deck-width`; rail lifts above the full-width player bar via `body:has(.pb) .hr-deck{bottom:60px}`. Axis geometry split JS (`S.deck`/`S.panelPos`/`S.tab`/`S.resizeHandle`) + CSS (`.hr-deck`/`.hr-tab-strip`/`.hr-deck-body`). |
| **The album band (`.ex-album-banner`) and the face type ramp** | `src/routes/exhibit/Exhibit.css`. **[A2/A3/A4 2026-08-04]** The band is a **`1fr auto 1fr` grid**, so the album's name is centred BY CONSTRUCTION and lands under the active cover (845=845 at 1706px, 185=185 at 386px); `--ex-banner-h` is `9px + 1.1 × --ex-banner-type` (was 17px) and every sticky offset derives from it. **`.ex-album-banner-aux` must NOT carry `min-width:0`** — a `1fr` track is `minmax(auto,1fr)` and refuses to shrink below its item's min-content, which is the only thing stopping a transport painting across the name; with `min-width:0` it measured overflow to x=−31 over a title at x=86. At **≤720px the ONE wing with a transport (`.ex-banner-console`, /wal) drops to two columns**, name left — equal side tracks make a transport of width w cost the centre 2w and nothing is narrow enough at 386px. The face ramp's three steps ABOVE body are now lead 1.09 / head 1.19 / display 1.30 (were 1.14 / 1.32 / 1.56); micro, small and `--face-fs` are untouched, because the small end's rem floors are P7's answer to unreadable small type and the dial takes the small type with it. |
| Canonical palette/typography tokens | `src/styles/museum-tokens.css`. **F0 2026-08-03:** `--wb-gold-mute` re-pinned to `#5f5c53` (the old `#9b978d` failed AA on all five paper grounds); new `--wb-hairline` holds the old value for the drag rules that chose faintness deliberately. JS pair is `src/styles/tokens.js` — change one, change the other, same edit. |
| **Information Booth** (`/booth`) and **The Weird.Baby Foundation** (`/foundation`) | **[v54 2026-08-05] `/foundation` HOLDS TWELVE QUESTIONS AND RENDERS ELEVEN — the gap is the point.** Mike answered this room's questions himself (F1–F6); before this round every answer on it was ASSEMBLED from things he had said elsewhere. Three structural facts a future session must hold: **(1) An answer's `a` may be a STRING OR AN ARRAY of paragraphs**, normalised at the render seam — the array exists because he wrote *"How do I get some of that?"* as two beats with the Pro-Tip on its own, and flattening it would edit his line breaks. Only this room does it; `/booth` still renders a single `<p>`. **(2) The billionaires answer is MARKED IN EVERY SENTENCE and therefore prints NOTHING** — `visitorProse` empties it and `kept` drops the whole entry. It is the first answer in the building to take that path all the way down, so *"the FAQ has N entries"* and *"a visitor sees N questions"* are now different numbers and a count taken off `FAQ.length` is wrong. His three ideas (the Illionaires coinage, the size-of-the-pile line, the more-pie line) are preserved verbatim in the data; the PLACEMENT is open at M41. **(3) Two answers carry a `link: {text, reveal}` that renders as a named door plus the register's NOT BUILT stamp and NO `<a>` ELEMENT** — the addresses were marked and never supplied (M39), and a dead anchor is the dead control Doctrine 11's corollary forbids. The stamp reads `reveal/ledger.json`, so building `channel.qr` or `channel.supplies` flips it without touching this file. **Two questions were deleted (F2): *"So who is actually paying for all this?"* cost nothing (the posture is signed under the invoice) and *"Who pays you?"* cost the page the charter's four-gifts-of-service list — M42, named rather than absorbed. DO NOT restore either without his word; the legal-work clause inside the second has already been removed, restored and removed again across v41/v42/v54.** **TWO REAL HOUSEHOLDS HE SUPPLIED FOR THE INVOICE ARE NOT IN THIS REPOSITORY AT ALL** — not in `src/`, not in the round log — pending their consent (M38); the RULE and the MECHANISM shipped without them. Previously: **[v53 2026-08-05] THE BOOTH'S FAQ IS NINE QUESTIONS, NOT ELEVEN** — *"What are the rooms?"* and *"There is a gift shop. What is it?"* are DELETED under the Law of Subtraction (the directory names the rooms and the shop is one of its rows), and the shop answer's `[PAPA]` went with the paragraph rather than being re-homed. *"Are you tracking me?"* is rewritten around **the machine remembering you and the museum not**, and it is the one answer on this page whose claims cannot all be checked from a file: its outbound clause is measured in a browser (see the third-party table below §5) and **has been wrong twice**. Change any embed anywhere in the museum and this answer changes first. **[M23a/M23b 2026-08-04] BOTH PAIRS ARE STRUCK AND BOTH LOSERS ARE DELETED — DO NOT LOOK FOR `?hook=` OR `?book=`, THEY DO NOT EXIST.** The booth lost BOTH candidates and has no hook object at all (`BoothTicket`, `BoothSign` and ~180 lines of `InfoBooth.css` are gone) — Mike: *"THE TITLE IS THE GRAB"*, and the exception that permits it is recorded in STATE.md under the Visual Hook Law. The lobby keeps the SCROLLING guest book only (`GuestBook` in `WbHome.jsx`), rebuilt as a **stepped** advance: three rows visible, a page at a time, `cubic-bezier(.34,1.3,.64,1)` bounce, 5.0s rest, wrap by arithmetic on `transitionend`. `GuestBookPlain` still exists and **nothing selects it** — it is the fallback for `prefers-reduced-motion` and for a book under `SCROLL_MIN` signatures. `src/routes/InfoBooth.jsx` + `InfoBooth.css`; `src/routes/Foundation.jsx` + `Foundation.css` (`.fnd-` prefix, `data-room="foundation"`). **THE SHARED FURNITURE IS `src/styles/sheet.css` (`.sheet-*`) AND BOTH ROOMS IMPORT IT** — root, card, credo, rule, questions, contact, way back. Edits there land on BOTH rooms; that is the point of the file. Each route's own sheet keeps only its page ground and its own objects: the booth's ADMIT ONE ticket (`.booth-ticket*`), the Foundation's account card + register + zero-cost invoice (`.fnd-*`). Before E4 (2026-08-03) all of it lived in `InfoBooth.css`, which /foundation imported — furniture for two rooms named for one, carried as a want in three logs. **Unrelated name collision, do not conflate:** the `--wb-booth-*` tokens in `museum-tokens.css` are the PROJECTION BOOTH (the dark scope used by the player bar and `/admin`), nothing to do with `/booth`. **THE ROOM HAS BEEN RENAMED ONCE AND RENAMED BACK — read this before touching it.** C2 (v41 `ecf33c5`) renamed everything to "Where the Money Goes" at `/money`; **R1 (v42) reverted it whole** on Mike's ruling that C2 read "keep me out of the space where I need legal today" as a naming instruction when it was a workload instruction. **BOTH names have been live URLs, so there is a redirect and it currently runs `/money` → `/foundation`** (`App.jsx`). A third rename must re-point that redirect, not just add another. `/foundation` outside a historical comment is CORRECT; `/money` outside the redirect line or a historical comment is a miss. |
| **Routing table** | `src/App.jsx`. Order to know: the two named rooms, the `/money` → `/foundation` redirect, `/p/:id` preset landing, then **`path="*"` → `<WbHome />` (E2 2026-08-03)**. **[v51] NO QUERY PARAMETER SELECTS A VARIANT ANYWHERE IN THE BUILDING.** `?subtitle=`, `?hook=` and `?book=` have all now been retired the same way — shown, asked about, ruled on, deleted — and `useSearchParams` is imported by neither `WbHome.jsx` nor `InfoBooth.jsx` any more. A round that wants to show Mike two of something builds them, gets the ruling, and deletes the loser in the same arc. **[CS 2026-08-04] THREE `/hr/*` ROUTES ARE GONE and their components deleted:** `/hr/media` and `/hr/fan-wall` were one-line "— coming soon." pages; `/hr/home` was a stock interior photo (`public/museum.jpg`, also deleted) with its room labels PAINTED INTO THE IMAGE, advertising four rooms that never existed. All three now land on the Lobby via the catch-all. **`/hr` (the real exhibit) and `/hr/archive` are untouched and still reachable by URL only.** The catch-all RENDERS the Lobby at the unmatched address rather than navigating to `/` — Mike's ruling, "no dead end, no blank shell, no apology". Before it existed an unmatched path rendered the shell and nothing in it, and `wrangler.jsonc` sets `not_found_handling: "single-page-application"`, so Cloudflare hands EVERY unknown path to the router. |
| JS token mirrors for inline `S.*` styles | `HrExhibitFlow.jsx:104–132`. Drift RESOLVED at `36b2182` — JS constants match the `--hr-*` CSS ramp; still a hand-maintained literal mirror (token edits do NOT auto-propagate to inline `S.*` styles). |
| Pass-2 aesthetic blocks | `Exhibit.css:13–27` grain (`.ex-root::after`); `HrExhibitFlow.css:1821+` (lightbox dark re-pin :1836, badges :1853, cards :1826); player-bar dark re-pin `Exhibit.css:152` |
| Logo image (Lobby ONLY; exhibit uses text wordmark) | `public/WeirdBaby_PhotoID.png`, placed `WbHome.jsx:115` |
| Brand wordmark trial (Fredoka, nav only) | token `--wb-brand`; applied `Exhibit.css:36` |
| Mothballed Kaleidoscope (never mounted) | `HrExhibitFlow.jsx` :812/:852/:868/:947 + `.hr-kal-*` CSS |
| **The Record's long-form ENTRY** (headline / dateline / lead / sections with inline door icons / tombstone) | `src/routes/exhibit/RecordEntry.jsx` + the `[RC]` block at the end of `Exhibit.css`. **Mounted from `Exhibit.jsx`'s opened-record branch, and the switch is the DATA: an entry declaring `sections` renders it, an entry that does not renders exactly what it rendered before.** The index, open/close, `wire`/`plates`/`docs` payloads and the ‹ NEWER / OLDER › walk stay in `Exhibit.jsx`. Dateline arithmetic (`entryWeekday`/`entryWeek`/`entryDateline`) is in `src/lib/record-model.js`; `Week n` needs a `recordEpoch` on the face and a `date` on the entry, and **as of v47 the Record declares NEITHER** — Mike ruled the dates invented, so the dateline prints `Record 013` alone and the model's undated path is the live path, not a fallback. **The Record holds exactly ONE entry** (v47/H2): the other ten were fiction and were deleted, and the face has no `blurb`, `still`, `stillCaption`, `lines` or `footer` — it is a heading and its entries, by ruling. Open gaps are questions for Mike in `docs/RECORD_013_QUESTIONS-20260804.md`, never filled in the data (Doctrine 12). **Three near-identical class prefixes live in `Exhibit.css` and mean different objects: `.vp-record-*` is an artist's chart/awards BOARD, `.vp-rec-*` is The Record, `.vp-rec-door` is a door inside a record entry.** |
| **Provenance boundary + gate** (Doctrine 13) | `tools/provenance-sweep.mjs`; declarations in `provenance/register.json` (strings) and `provenance/assets.json` (images). `npm run provenance` reports, `npm run provenance:gate` exits 1. `provenance/README.md` is the model AND the honest hole-list. `provenance/backfill-20260804.mjs` is the audit record of the first classification and **must not be re-run** — its rules would silently absorb new content. |
| **THE REVEAL LEDGER** (v52, re-cut v55) | `reveal/ledger-declare.mjs` → `reveal/ledger.json`, **152 rows, one per REVEALABLE THING** across both repos: what it is, `build` (LIVE/PARTIAL/STUB/NOT_BUILT — what is true today), `reach` (how a visitor gets to it, null if they cannot), `state` (HELD/REVEALED/RETIRED), `when` (the story day — **null on every row, by Doctrine 12**), `deps`, the ruled `revealArc`, and `shown` (a visitor can READ THE LABEL of something not built — the difference between a gap and a debt). **`build` and `state` are two axes; conflating them is the first mistake anyone will make.** `npm run reveal` / `reveal:audit` / `reveal:cards` / `reveal:check` / `reveal:build`. **NOT A RIVAL TO THE ASSET TABLE** — that is one row per FILE and stays the authority on files; this restates no byte count, dimension, quality read or verdict, and they meet at `assets: [uid]`. **The reader is `src/lib/reveal.js` and it returns STATE, never WORDS** — `provenance:gate` sweeps only `src/` and `index.html`, so a ledger row supplying printed letters would take them off the provenance boundary. **One consumer is wired: `/foundation`'s LIVE / NOT BUILT column.** Model + honest hole-list: `reveal/README.md`. Audit: `docs/REVEAL_LEDGER_AUDIT.md`. <br>**[v55 2026-08-05] FOUR THINGS A FUTURE SESSION MUST HOLD BEFORE TOUCHING IT.** **(1) THE RECORD IS CUT ONE ROW PER ENTRY AND THE ROWS ARE DERIVED, NOT TYPED.** `reveal/record-entries.mjs` parses the Record out of `src/data/artists/robots.js` (acorn + acorn-jsx — that file imports JSX and node can never import it) and is **split in two on purpose:** `entries()` returns entry numbers and asset paths **and nothing else**, and it is the only half the ledger builds from, so a headline has no route into the table; `prose()` returns every sentence and **builds nothing** — it exists so the check can police the rule. **THE LEDGER MUST NEVER BECOME A SECOND COPY OF THE RECORD (audit §8a), and that is enforced three ways, not asserted once:** the generator cannot see the words · `reveal/schema.mjs` refuses the Record’s FIELD names on any row · `reveal:check` refuses its SENTENCES (six consecutive words of Record prose, or any whole Record line of four words or more, in `name`/`note`/`reach`/`where`/`deps`). A fourth check requires the rows and the entries to be the same set in both directions, which is what finally makes *never edit `ledger.json` by hand* enforced rather than requested. **`doc.record` survives and is now THE VOLUME ONLY** — M18’s twenty-seven questions moved onto `record.013`; M19 (what a record NUMBER means) is a volume property and stayed. **An entry the Record has not numbered FAILS THE BUILD** rather than being given an id, because minting one is Ops answering M19 with a guess. **(2) `reveal/schema.mjs` HOLDS THE ONE VALIDATOR AND BOTH CALLERS RUN IT.** Before v55 the declaration checked five rules as it wrote and `reveal:check` checked four afterwards, and neither list was a superset of the other — a rule was enforced at whichever moment the author happened to run. **(3) `prod` IS NOT `arc`.** `prod` (needed · printed · photographed · placed) is the MANUAL-PAGE vessel’s field and no other row’s: `arc` is how the house REVEALS a thing it has, `prod` is whether the house HAS it, and `build` is DERIVED from `prod` so a page cannot claim a state the world is not in. The vessel (`manualPageRow()`) is Mike’s ruling that the manual **arrived in pieces** — the museum needs only the pages the story reaches for, called for by a `record.NNN` entry — and it is **built, empty by instruction (M44), and proved by `reveal:check` building specimens at all four stages and asserting every refusal, so no page is invented to test the container.** **(4) `npm run reveal:cards` IS AN OPS INSTRUMENT AND MUST NEVER BECOME A ROUTE** — the audit §8b cue cards, same shape and same reasoning as `assets:checklist`. Its default deck is **the 49 HELD undated rows, deliberately not all 143 undated rows**: 93 of those are already REVEALED and nobody wrote down the day they came out, so a card asking for it invites an invention. |
| **The open-action register** (Doctrine 14) | `docs/OPEN_ACTIONS.md` — every open item in both repos, one place, updated by every round in the commit it seals. |
| **The asset table + approval gate** (Doctrine 15) | `tools/asset-table.mjs` → `provenance/asset-table.json`. 251 media files across the museum and robots repos with what each is, what depends on it, an Ops quality read, **Mike's verdict, unset by default**, and **[N8 2026-08-04] `revealArc`** — `arrived / understood / partial / online / null`, Mike's canon for how a thing is revealed, where `null` means UNSET and is NOT a stage (populated on 6 rows, unset on 245). `npm run assets` / `assets:scan` / `assets:checklist` / `assets:gate`. The scan rewrites only measured fields and **never** touches the five judged ones (`what` / `quality` / `qualityNote` / `verdict` / `revealArc`). **[C32 CLOSED v52] IT IS NO LONGER KEYED BY PATH.** Every row carries a **`uid` minted once and never rewritten** — that is the row's NAME, and `id` (repo:path) is demoted to an ADDRESS — plus a **`sha256`** re-measured each scan. Matching goes address → content → nothing: a prior row and a new file sharing a hash inside one repo are the same file MOVED and the judgement travels automatically. Where a rename ALSO re-rendered the file (the ordinary case, because the name is usually IN the picture) **no keying can infer it, so the scan REFUSES TO GUESS and reports the judged row under its own banner**; `npm run assets:rename -- <old> <new>` is the explicit human declaration, and `assets:orphans` lists them. **The silence was the defect; the hash only makes it rarer.** The first run caught v51/A7's own stranded `jesse-welles-plate.jpg` alongside this round's cover rename. **`usedBy` MATCHES AGAINST SOURCE WITH COMMENTS STRIPPED** (N8) — before that a path merely NAMED in a comment counted as a reference, so any orphan was invisible for as long as anybody had written its name down. NOT a packet gate — see Doctrine 15. |
| **The archive (IMAGE ARCHIVE)** | `ArchiveWall` + `archiveSpreads` + `SpreadHead` + `SpreadTiles` in `Exhibit.jsx` (module scope, just below `FaceFlow`); `.vp-spread-head` / `.vp-spread-stow` in `Exhibit.css` beside `.vp-collage`. A face declaring `spreads:[{head,no,tiles}]` stacks in headed albums sorted by record number descending; a face declaring only `collage` emits the DOM it always did. **[N2 2026-08-04] THE FIRST SPREAD IS OPEN AND EVERY LATER HEADED SPREAD IS STOWED** in a native `<details>` whose closed line carries its own head, its record number if any, and its COUNT — which is why it does not trip the no-hidden-information law. An unheaded spread is never stowed. `face.archiveUnit = {one,many}` names the count's noun (default `image/images`; the robots wing says `plate/plates`). Both walls are in `robots.js` (`mgk-viii` and `mgk-viiip`, track id `plates`). **THE ROOM WAS CALLED THE MORGUE FOR ONE ROUND** (v49/A3 printed both candidate names so Mike could strike one) — he struck it at v50/N1, and `morgue` outside a historical comment is now a miss. Its two siblings, VIDEO ARCHIVE and AUDIO ARCHIVE, are named in `robots.js`'s header and deliberately NOT built. |
| Exhibit data export | `src/data/exhibits/hunter_root.json` via `npm run export-artifacts` |
| Spine adapter (stable ids) | `src/data/artists/hunter-root-spine.js` |
| Taxonomy v1 canon (June 9) | `docs/taxonomy/` — TAXONOMY_v1, NORMALIZATION_MAP, COVERAGE_PROOF, RETAG_PLAN |
| Retag tooling | `tools/retag_v1.ps1`, `tools/coverage_check.py` |

**[v53 2026-08-05] THE THIRD PARTIES THIS SITE TOUCHES, MEASURED RATHER THAN
GREPPED.** Read off `performance.getEntriesByType('resource')` in every room
after a nine-second settle, with **nothing clicked**:

| room | third-party hosts requested on load |
|---|---|
| `/` · `/booth` · `/shop` · `/foundation` · `/hr/archive` | `fonts.googleapis.com` + `fonts.gstatic.com` |
| `/robots` · `/wal` · `/wb` | + `www.youtube.com` ×3 |
| `/hr` | + `www.youtube.com` ×3 **+ `www.facebook.com` ×16, in 17 iframes** (also `assets.weird.baby` ×11, which is the house's own host) |

YouTube arrives from `Exhibit.jsx:333` (`iframe_api` injected on mount, not on
play); Facebook from `HrExhibitFlow.jsx:2110`'s `facebook.com/plugins/` URL
behind the `hr-card-fbembed` cards. **`/booth`'s privacy answer states all
three, and a change to any of them changes that answer first** — the answer's
outbound clause has now been wrong twice and re-written three times, and the
reason is structural: **a grep of `src/` finds the STRING; only loading the page
finds the REQUEST.** `provenance:gate` cannot see this class of claim at all
(see `provenance/README.md` §4). The open ruling is `OPEN_ACTIONS.md` M37.

**Sibling repos:** MediaVault `C:\AI\Platform\MediaVault` (source of truth;
launch `launch_mediavault.bat` → http://127.0.0.1:51822/db — must be running
before export). Hunter Root archive `C:\AI\Projects\Hunter Root`.

**Release path:** MV release → `npm run export-artifacts` → stage EXPLICIT
paths (never `git add -A`) → commit → push → `npm run build && npx wrangler
deploy` → verify live (incognito for anything platform-embedded).

## 6. Orientation protocol (every fresh session)

**Read order:** (1) this file → (2) `STATE.md` → (3) newest
`docs/HANDOFF_*.md` if present → (4) `git log --oneline -15` +
`git status -s`.

**Truth ranking when they disagree:**
`live tree > git log > STATE.md > handoffs > any chat memory/summary`.
Handoffs rot in days; git log is the progress record. A handoff's
"recommended next step" is a suggestion stamped at write time, not a
standing order.

**Files that do NOT exist (do not look for, do not invent):**
`BUILD_LOCK.txt` — no build-lock mechanism exists. (`C:\AI\START_HERE.md` is now REAL: the cross-project bootstrap, canonical at `docs/canonical/START_HERE.md`, added 2026-06-09.)
(These were hallucinated by a past session and propagated through two
handoffs. If a future session adds a real lock mechanism, it updates this
line.)

**Do not re-investigate closed items.** Check STATE.md "Decisions /
closed" first (e.g., the COL3 FB clip — read
`docs/FINDING-fb-post-clip.md` before touching it).

## 7. Working Doctrine (process rules — paid for by real failures)

Mirrors STATE.md → Working Doctrine; this copy is canonical for process.

1. **Verify before scoping.** Read the actual file in the live working
   tree before reasoning about it. Never scope against memory, Drive
   copies, or assumption.
2. **Don't guess — look it up.** A claim about the codebase not backed by
   a file just read is a guess and must not be acted on.
3. **Default to Cowork for repo work** — repo reads, big-file edits
   (`HrExhibitFlow.jsx`, `Exhibit.jsx`), multi-file scoping. Host pwsh
   paste-back only for small reads; it burns Mike's time and buffer.
4. **Drive the live UI by accessibility ref, not pixel coordinates**
   (tiny dock targets + peek-to-open animation make pixel clicks miss
   silently).
5. **No load-bearing if/else in pasted scripts** (§4.2).
6. **Durability:** committed AND pushed AND (UI) deployed. Scratch files,
   sandbox files, and local commits are not durable.
7. **A behavior does not change unless there is a stated reason.**
8. **Prefer native/platform mechanics over custom logic.**
9. **Verify before commit; commit after every verified step** — never
   batch a day's work uncommitted. Platform embeds verified incognito.
10. **Understand the problem before acting.** Diagnose, then fix; don't
    chase the latest screenshot.
11. **THE LAW OF THE VISIBLE LINE (Mike, 2026-08-04 — STANDING, site-wide).**
    **If a line describes the work rather than doing the work, it does not
    ship.**

    The test is the line's SUBJECT, not its tone or its truth. Every line
    removed under this law was accurate; that is what made it survive.

    **A visible line FAILS if its subject is the making of this museum:** the
    drafting, the research, the revision history, what a round did, the form a
    page takes and why, the typography, the renderers, the plan for content not
    yet written, or any person building it named on the glass. Also fails: an
    internal decision code (`(C3)`, `held — storyline first`), an operator
    marker outside the scrubber's reach, and a draft-state stamp (`· v1`) on a
    visitor-facing label.

    **A visible line PASSES if its subject is the collection:** the objects,
    the artists, the events in the record, the institution's standing terms —
    **including honest statements of what is not held.** "No plate on file" is
    a holdings fact and ships. "Nobody has photographed this yet" is a
    production fact and does not. Same absence, different subject.

    Two adjacent traps, both paid for on 2026-08-04:
    - **Provenance is not meta.** A sources line, a citation, an accession
      number, "read at its source" — a museum prints those. What fails is the
      NARRATIVE of the checking ("the first research pass refused it for want
      of proof") and the JUSTIFICATION OF A DESIGN CHOICE ("so they are set as
      plain type", "the withholding is authored").
    - **Mechanism state is not meta.** The Foundation's LIVE / NOT BUILT
      column and "not through this page yet" are Mike's own standing rule that
      nothing may claim a mechanism that isn't built. That is a fact about the
      museum as an institution, not about the website's backlog.

    **The corollary Mike gave with it: empty and honest beats populated and
    false.** A placeholder, a sample, a demo entry, a dead control, a door to a
    room that does not exist, or an annotated wireframe at a live address is
    removed rather than left standing. If one must stay, the Ops reason is
    stated out loud — silence is not an option. What removal EXPOSES gets
    reported, not papered over.

12. **OPS DOES NOT INVENT CONTENT (Mike, 2026-08-04 — STANDING, site-wide).**

    **Where a fact is missing, Ops ASKS. Ops never fills the gap with
    plausible detail.**

    This binds every wing, every surface, every round, and it binds the
    drafting lane hardest — a lane whose job is to write is the lane most able
    to write something that reads true and is not. The existing rules against
    invented provenance, invented captions and invented sources are a SUBSET
    of this one; this is the general form.

    **What counts as invention.** Not only a false claim. Any specific the
    operator did not supply and the record does not hold: a date, a count, a
    time of day, a measurement, a material, a room, a colour, a name, a
    quotation, an ordering, a consequence, a person's reaction. Detail that is
    *consistent* with what is known is still invention if nobody supplied it —
    plausibility is the failure mode, not the defence. A round that produced
    sixty entries where one was supplied produced fifty-nine inventions
    however well they fit.

    **The one-question format**, which is what makes asking cheap enough to
    always be the choice:
    - WHAT IS KNOWN — the fact already in hand, stated back.
    - WHAT IS MISSING — the single gap, named precisely.
    - WHY IT MATTERS — what cannot be written, or what would be wrong, until
      it is answered.

    One gap per question. Questions go in a list Mike can answer one at a
    time, at his pace, in any order — not a paragraph he has to unpick, and
    never a blocking gate that stops the rest of the work.

    **What Ops does with the gap in the meantime.** It ships the surface
    WITHOUT it. A section that cannot survive without invention is CUT and
    named as cut; a field that cannot be filled honestly is DELETED rather
    than approximated; an entry with four known facts prints four facts and
    stops. The question list is the deliverable that replaces the invention —
    it is never printed on the glass, because a question to the operator is
    meta by Doctrine 11 and fails the visible-line test.

    Paid for by the Record: ten dated log entries, a 436-record source line, a
    register block and a header photograph's caption, all invented, all
    surviving four rounds of review because each was plausible. Mike had to
    hunt for the one real record in a pile of fictional ones — and the pile
    had been reported before and survived the report.

    **MECHANIZED 2026-08-04 (v48), and doctrines 11 and 12 are still both
    required.** See #13.

13. **EVERY VISIBLE STRING CARRIES ITS ORIGIN (v48, 2026-08-04 — STANDING).**

    Doctrines 11 and 12 are rules, and a rule only catches what a reader thinks
    to look at. "436 records, kept since January 2024" PASSED Doctrine 11 —
    its subject is the collection, not the making of the museum — and was
    invented. The structural cause was never any one string: **a string could
    enter the codebase and nothing at the boundary asked where it came from.**

    **The boundary now asks.** `npm run provenance:gate` enumerates every
    visitor-facing string in `src/` and `index.html` and fails if any is not
    declared in `provenance/register.json` with an origin class — MIKE ·
    VERIFIED · DERIVED · HOUSE · RESTATED, plus a capped INVENTION holding pen
    for what has no origin and awaits Mike. A row is keyed by a hash of the
    string, **so editing a declared line invalidates its own declaration** and
    fails the gate until it is re-declared.

    **It runs on every packet, beside lint and build.** A packet that adds
    content adds register rows in the same commit.

    **WHAT IT DOES NOT DO, and this must be repeated wherever it is described:
    it cannot verify that a declaration is TRUE.** Nothing can. It makes the
    claim reviewable in one file; it does not make it correct. It also cannot
    read text inside an image (that is `assets.json` plus a human looking),
    cannot detect a correctly-cited number going stale, and **does not replace
    Doctrine 11** — a perfectly-sourced line whose subject is the making of the
    museum still passes it cleanly.

    Full model, the exclusion rules, and the honest hole-list:
    `provenance/README.md` §4. Round log:
    `docs/MUSEUM_PROVENANCE_LOG-20260804.md`.

    **OPS RULING, 2026-08-04 (A10): THE `RESTATED` CLASS STAYS.** Mike's four
    classes are ORIGINS; 282 rows are Ops connective prose that originates
    nothing, and calling those MIKE would be false while calling them INVENTION
    would bury the three real findings under 282 non-findings. **It is kept
    because it has teeth, not because it is convenient:** a `RESTATED` row's `r`
    must RESOLVE, and it may not point at its own file — which is exactly the
    shape *"436 records, kept since January 2024"* would have taken, the failure
    the whole boundary was built against. It caught its own author on the day it
    was written: twelve rows citing `InfoBooth.jsx` as the thing `InfoBooth.jsx`
    restates were rejected. A class that rejects its author's own rows on the
    first run is doing work.

14. **THE OPEN-ACTION REGISTER IS MAINTAINED BY EVERY ROUND (Mike,
    2026-08-04 — STANDING).**

    **`docs/OPEN_ACTIONS.md` is the ONE place Mike looks for what is open**, and
    every round updates it in the commit it seals. A round that closes an item
    flips its status; a round that exposes one adds a row. Rows carry: what it
    is in one line · where it came from · status (OPEN / IN PROGRESS /
    RULED-AWAITING-BUILD / DONE) · owner (Mike / Ops / Code) · the date raised.

    **The failure it exists to end:** findings were being reported honestly and
    then buried. Every round since v40 has written a *"what this exposes"* or
    *"carry-forward"* section, faithfully, into a round log nobody re-opens —
    and the operator's own words for the state of it were *"Mike has no way to
    see what is already reported."* Reporting is not the same as recording. The
    round log stays the narrative; **the register is the ledger.**

    It is not a priority order and it does not say what to do next. Everything
    in it is open; sequencing is Mike's.

15. **THE RECORD APPROVAL GATE (Mike, 2026-08-04 — STANDING).**

    **Final sign-off on a Record is Mike personally inspecting EVERY thing
    presented in it. Ops ensures nothing escapes that inspection.**

    Wired to `provenance/asset-table.json`'s `verdict` field, which is **unset
    by default and is never written by Ops**:

    - `npm run assets:checklist -- --room <slug>` prints the inspection — every
      presented asset, what it is, its dimensions, Ops' quality read, and which
      file shows it.
    - `npm run assets:gate -- --room <slug>` exits 1 while any presented asset
      lacks a `pass`. A scope that matches nothing also fails, because a gate
      that matched nothing has not passed.

    **IT IS NOT A PACKET GATE AND MUST NOT BECOME ONE.** lint, build and
    `provenance:gate` run on every commit because they check things Ops can fix.
    This one checks whether MIKE HAS LOOKED, and putting it in the packet would
    block every commit on an inspection nobody has been asked for — the exact
    opposite of Mike's own condition, that **he must not have to perfect assets
    in advance.** Slots move, things change, some assets are never needed. The
    gate is run against one Record when that Record is being signed off.

    **What it cannot do:** it records that a verdict was given, not that the
    inspection was careful. And `provenance/assets.json` is keyed on the PATH,
    so an approved picture can be replaced under its own verdict and nothing
    fails. Both holes are stated in `provenance/README.md` §4.

16. **THE LAW OF SUBTRACTION (Mike, 2026-08-04 — STANDING, site-wide).**

    > **If it does not help, it hurts. If it does not need to be there, it needs
    > to not be there.**

    Given while striking the `/robots` tally card, with his reason attached:
    *"it speaks out loud about something not meant to be spoken out loud and
    dilutes the experience."*

    **IT IS NOT DOCTRINE 11 RESTATED, and the case that produced it is the
    proof.** Doctrine 11 tests a line's SUBJECT — does it describe the making of
    the museum rather than the collection. "Thirty-one and a half" is a fact
    about the collection. It passed the visible-line test on every reading, it
    was true, it was the wing's best line, and setting it at 132pt still made the
    loudest object on the front desk out of the one number whose entire value is
    that it is never explained. **Nothing was wrong with it except that it did
    not need to be there.** Doctrine 11 could not have caught it; this one is
    written so the next one gets caught.

    **The test is necessity, and the burden sits on KEEPING.** Ask of any object,
    control, count, caption, badge or line: what is lost if it goes? If the
    answer is "nothing a reader would miss", it goes. A thing that is merely
    harmless is not passing — harmless costs attention, and attention is the only
    currency a free museum takes.

    **Where it lands hardest:** a device built to show the operator a choice
    (see §5's routing row — three query-parameter variants have now been
    retired), a second object saying what the first already said, and any
    typographic set-piece whose size is doing work its content cannot carry.

    **Its neighbours.** Doctrine 11's corollary is *empty and honest beats
    populated and false*; this is the harder version — **empty beats
    unnecessary, even when the unnecessary thing is true.** Where 11 and 12 say
    do not INVENT, this says do not KEEP.

    **What it does not license.** It is a reason to delete, never a reason to
    delete QUIETLY. Everything struck under it is named in the round log and,
    if it leaves a gap, given a row in `docs/OPEN_ACTIONS.md` — the FAQ face lost
    its only picture to this law on the day it was written, and that is register
    M29 rather than a silence.

    Mirrored in `STATE.md` as THE LAW OF SUBTRACTION.

## 8. Known hazards (environment quirks)

- **Cowork FUSE/sync truncation.** The sandbox has truncated files on
  disk mid-write (three files once recovered from HEAD). NEVER let a
  Cowork session do read-modify-write on large files; big-file edits are
  surgical and host-side. If a file looks truncated, check HEAD before
  editing.
- **Cowork mount READ-LAG (2026-07-06).** Files edited via Cowork's
  host-side file tools can read back stale/truncated through the bash
  mount INDEFINITELY (App.jsx served 64 of 71 lines 30+ min after edit).
  Host is truth — verify freshly host-edited files with host-side reads
  or /tmp reconstructions, never by parsing them through the mount.
  Sandbox-side writes are consistent in both views immediately. Same
  session: sandbox `git status` orphaned an undeletable `.git/index.lock`
  + phantom staged deletions — the host-side `Remove-Item .git\index.lock;
  git reset --mixed HEAD` prelude cleared both, as documented.
- **Virtiofs:** phantom deletions in `git status` from the sandbox (HR
  commits host-side only, with `Remove-Item .git\index.lock; git reset
  --mixed HEAD` prelude); SQLite COMMIT failures (use `/tmp` work-copy +
  `shutil.copy2`).
- **~16KB post-edit boundary** silently tail-truncates patched files —
  anchor-based patches + `wc -l` + tail verify required past it.
- `export-artifacts.mjs` prints a harmless `UV_HANDLE_CLOSING` assertion
  AFTER finishing — ignore.
- Drive root contains loose stale code copies from past sessions — stale
  by default (§3 staleness rule).

## 9. Session-close ritual

0. **Gates, in this order:** `npm run lint` (baseline **11 errors / 9
   warnings**, zero new) → `npm run build` (green) → **`npm run
   provenance:gate` (exit 0)** → **`npm run reveal:check` (exit 0) if the
   ledger changed** → the lap. A packet that added visitor-facing
   content adds its register rows in the same commit; a packet that added or
   changed a media file re-runs `npm run assets:scan` in the same commit.
1. Commit + push everything durable (explicit paths).
1a. **Update `docs/OPEN_ACTIONS.md`** (Doctrine 14) — statuses flipped for what
   closed, rows added for what this round exposed. Same commit.
2. If facts in THIS FILE or STATE.md changed (file map, hazards,
   protocols, closed decisions) — update them in the same session, same
   commit discipline. An orientation doc more than a few days behind
   git log is a defect.
3. Write/refresh `docs/HANDOFF_next_session.md` only for session-scoped
   context (what's mid-flight, open UX questions). Process and facts do
   NOT go in handoffs — they go here or in STATE.md.
4. Optionally drop refreshed OPERATIONS.md + STATE.md into
   `G:\My Drive\_conduit\` (with stamps) so chat sessions can self-orient
   without a paste.


## Delivery & Commit Gates (RCCA 2026-07-06 — stranded-Downloads incident)

Root cause: delivery and commit steps completing silently, unverified. Proven
losses: MV_VOCAB_MIGRATION_BRIEF-20260624 (stranded in Downloads 12 days),
MV_VOCAB_RECONCILE_PLAN-20260624 (believed committed 6/24; was untracked until
2026-07-06), weird_baby_combined.docx (stranded 75 days).

1. LANDING GATE — a chat deliverable does not exist until it is at its target
   path in the tree. Downloads is transit, never storage. Prefer heredoc
   direct-write to target path over browser download. Any file that does
   transit Downloads is copied to the tree and committed in the same session.
2. COMMIT GATE — no commit is "done" until `git status --short` is re-run and
   the new hash is confirmed in `git log`. Narrating a commit is not a commit.
3. SESSION-CLOSE CHECK — before any session ends: `git status --short` is
   empty, or every remaining line is explained and accepted.
4. DB dumps (`backups/`) are gitignored by policy. Durable home: OneDrive
   mirror, not git history.
