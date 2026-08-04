# OPERATIONS — Weird.Baby Museum (cross-session operating manual)

**Authority:** This file governs HOW any agent/session works on this project.
`STATE.md` governs WHAT exists. `docs/canonical/` governs design intent.
On conflict about process, this file wins. On conflict about facts of the
tree, the live working tree wins — always.

**Read this file FIRST in every session, before STATE.md, before any handoff.**

**Last verified against live tree:** 2026-08-04 (v48 MECHANIZE PROVENANCE — Doctrine gained #13 EVERY VISIBLE STRING CARRIES ITS ORIGIN; `npm run provenance:gate` joins lint and build on every packet; 2,528 strings and 33 images classified)

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
| Canonical palette/typography tokens | `src/styles/museum-tokens.css`. **F0 2026-08-03:** `--wb-gold-mute` re-pinned to `#5f5c53` (the old `#9b978d` failed AA on all five paper grounds); new `--wb-hairline` holds the old value for the drag rules that chose faintness deliberately. JS pair is `src/styles/tokens.js` — change one, change the other, same edit. |
| **Information Booth** (`/booth`) and **The Weird.Baby Foundation** (`/foundation`) | `src/routes/InfoBooth.jsx` + `InfoBooth.css`; `src/routes/Foundation.jsx` + `Foundation.css` (`.fnd-` prefix, `data-room="foundation"`). **THE SHARED FURNITURE IS `src/styles/sheet.css` (`.sheet-*`) AND BOTH ROOMS IMPORT IT** — root, card, credo, rule, questions, contact, way back. Edits there land on BOTH rooms; that is the point of the file. Each route's own sheet keeps only its page ground and its own objects: the booth's ADMIT ONE ticket (`.booth-ticket*`), the Foundation's account card + register + zero-cost invoice (`.fnd-*`). Before E4 (2026-08-03) all of it lived in `InfoBooth.css`, which /foundation imported — furniture for two rooms named for one, carried as a want in three logs. **Unrelated name collision, do not conflate:** the `--wb-booth-*` tokens in `museum-tokens.css` are the PROJECTION BOOTH (the dark scope used by the player bar and `/admin`), nothing to do with `/booth`. **THE ROOM HAS BEEN RENAMED ONCE AND RENAMED BACK — read this before touching it.** C2 (v41 `ecf33c5`) renamed everything to "Where the Money Goes" at `/money`; **R1 (v42) reverted it whole** on Mike's ruling that C2 read "keep me out of the space where I need legal today" as a naming instruction when it was a workload instruction. **BOTH names have been live URLs, so there is a redirect and it currently runs `/money` → `/foundation`** (`App.jsx`). A third rename must re-point that redirect, not just add another. `/foundation` outside a historical comment is CORRECT; `/money` outside the redirect line or a historical comment is a miss. |
| **Routing table** | `src/App.jsx`. Order to know: the two named rooms, the `/money` → `/foundation` redirect, `/p/:id` preset landing, then **`path="*"` → `<WbHome />` (E2 2026-08-03)**. **[CS 2026-08-04] THREE `/hr/*` ROUTES ARE GONE and their components deleted:** `/hr/media` and `/hr/fan-wall` were one-line "— coming soon." pages; `/hr/home` was a stock interior photo (`public/museum.jpg`, also deleted) with its room labels PAINTED INTO THE IMAGE, advertising four rooms that never existed. All three now land on the Lobby via the catch-all. **`/hr` (the real exhibit) and `/hr/archive` are untouched and still reachable by URL only.** The catch-all RENDERS the Lobby at the unmatched address rather than navigating to `/` — Mike's ruling, "no dead end, no blank shell, no apology". Before it existed an unmatched path rendered the shell and nothing in it, and `wrangler.jsonc` sets `not_found_handling: "single-page-application"`, so Cloudflare hands EVERY unknown path to the router. |
| JS token mirrors for inline `S.*` styles | `HrExhibitFlow.jsx:104–132`. Drift RESOLVED at `36b2182` — JS constants match the `--hr-*` CSS ramp; still a hand-maintained literal mirror (token edits do NOT auto-propagate to inline `S.*` styles). |
| Pass-2 aesthetic blocks | `Exhibit.css:13–27` grain (`.ex-root::after`); `HrExhibitFlow.css:1821+` (lightbox dark re-pin :1836, badges :1853, cards :1826); player-bar dark re-pin `Exhibit.css:152` |
| Logo image (Lobby ONLY; exhibit uses text wordmark) | `public/WeirdBaby_PhotoID.png`, placed `WbHome.jsx:115` |
| Brand wordmark trial (Fredoka, nav only) | token `--wb-brand`; applied `Exhibit.css:36` |
| Mothballed Kaleidoscope (never mounted) | `HrExhibitFlow.jsx` :812/:852/:868/:947 + `.hr-kal-*` CSS |
| **The Record's long-form ENTRY** (headline / dateline / lead / sections with inline door icons / tombstone) | `src/routes/exhibit/RecordEntry.jsx` + the `[RC]` block at the end of `Exhibit.css`. **Mounted from `Exhibit.jsx`'s opened-record branch, and the switch is the DATA: an entry declaring `sections` renders it, an entry that does not renders exactly what it rendered before.** The index, open/close, `wire`/`plates`/`docs` payloads and the ‹ NEWER / OLDER › walk stay in `Exhibit.jsx`. Dateline arithmetic (`entryWeekday`/`entryWeek`/`entryDateline`) is in `src/lib/record-model.js`; `Week n` needs a `recordEpoch` on the face and a `date` on the entry, and **as of v47 the Record declares NEITHER** — Mike ruled the dates invented, so the dateline prints `Record 013` alone and the model's undated path is the live path, not a fallback. **The Record holds exactly ONE entry** (v47/H2): the other ten were fiction and were deleted, and the face has no `blurb`, `still`, `stillCaption`, `lines` or `footer` — it is a heading and its entries, by ruling. Open gaps are questions for Mike in `docs/RECORD_013_QUESTIONS-20260804.md`, never filled in the data (Doctrine 12). **Three near-identical class prefixes live in `Exhibit.css` and mean different objects: `.vp-record-*` is an artist's chart/awards BOARD, `.vp-rec-*` is The Record, `.vp-rec-door` is a door inside a record entry.** |
| **Provenance boundary + gate** (Doctrine 13) | `tools/provenance-sweep.mjs`; declarations in `provenance/register.json` (strings) and `provenance/assets.json` (images). `npm run provenance` reports, `npm run provenance:gate` exits 1. `provenance/README.md` is the model AND the honest hole-list. `provenance/backfill-20260804.mjs` is the audit record of the first classification and **must not be re-run** — its rules would silently absorb new content. |
| Exhibit data export | `src/data/exhibits/hunter_root.json` via `npm run export-artifacts` |
| Spine adapter (stable ids) | `src/data/artists/hunter-root-spine.js` |
| Taxonomy v1 canon (June 9) | `docs/taxonomy/` — TAXONOMY_v1, NORMALIZATION_MAP, COVERAGE_PROOF, RETAG_PLAN |
| Retag tooling | `tools/retag_v1.ps1`, `tools/coverage_check.py` |

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

0. **Gates, in this order:** `npm run lint` (baseline, zero new) → `npm run
   build` (green) → **`npm run provenance:gate` (exit 0)** → the lap. A packet
   that added visitor-facing content adds its register rows in the same commit.
1. Commit + push everything durable (explicit paths).
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
