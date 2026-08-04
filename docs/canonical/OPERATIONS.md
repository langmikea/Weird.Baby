# OPERATIONS — Weird.Baby Museum (cross-session operating manual)

**Authority:** This file governs HOW any agent/session works on this project.
`STATE.md` governs WHAT exists. `docs/canonical/` governs design intent.
On conflict about process, this file wins. On conflict about facts of the
tree, the live working tree wins — always.

**Read this file FIRST in every session, before STATE.md, before any handoff.**

**Last verified against live tree:** 2026-08-03 (v42 THE REVERT — file-map row for `/foundation` re-verified against the live tree)

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
| **Information Booth** (`/booth`) and **The Weird.Baby Foundation** (`/foundation`) | `src/routes/InfoBooth.jsx` + `InfoBooth.css`; `src/routes/Foundation.jsx` + `Foundation.css` (`.fnd-` prefix, `data-room="foundation"`). **`/foundation` imports `InfoBooth.css` and reuses its class names** — booth as literal template (F3 2026-08-03), so `InfoBooth.css` is furniture for two rooms while named for one. Edits to the booth's sheet, credo, rule, question or contact rules land on both. **THE ROOM HAS BEEN RENAMED ONCE AND RENAMED BACK — read this before touching it.** C2 (v41 `ecf33c5`) renamed everything to "Where the Money Goes" at `/money`; **R1 (v42) reverted it whole** on Mike's ruling that C2 read "keep me out of the space where I need legal today" as a naming instruction when it was a workload instruction. **BOTH names have been live URLs, so there is a redirect and it currently runs `/money` → `/foundation`** (`App.jsx`). A third rename must re-point that redirect, not just add another. `/foundation` outside a historical comment is CORRECT; `/money` outside the redirect line or a historical comment is a miss. |
| JS token mirrors for inline `S.*` styles | `HrExhibitFlow.jsx:104–132`. Drift RESOLVED at `36b2182` — JS constants match the `--hr-*` CSS ramp; still a hand-maintained literal mirror (token edits do NOT auto-propagate to inline `S.*` styles). |
| Pass-2 aesthetic blocks | `Exhibit.css:13–27` grain (`.ex-root::after`); `HrExhibitFlow.css:1821+` (lightbox dark re-pin :1836, badges :1853, cards :1826); player-bar dark re-pin `Exhibit.css:152` |
| Logo image (Lobby ONLY; exhibit uses text wordmark) | `public/WeirdBaby_PhotoID.png`, placed `WbHome.jsx:115` |
| Brand wordmark trial (Fredoka, nav only) | token `--wb-brand`; applied `Exhibit.css:36` |
| Mothballed Kaleidoscope (never mounted) | `HrExhibitFlow.jsx` :812/:852/:868/:947 + `.hr-kal-*` CSS |
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
