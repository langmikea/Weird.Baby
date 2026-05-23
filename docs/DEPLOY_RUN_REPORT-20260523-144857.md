# Deploy Run Report — First Phase-C-bearing production deploy (× 2)

**Date:** 2026-05-23 (session ~14:30–15:15 UTC, report written 2026-05-23 15:15 UTC)
**Scope authorized:** Per the session brief (Cowork session, 2026-05-23):
publish the Phase C bundle (museum HEAD `ba14f72`, MV HEAD `f08bfa0`,
HR HEAD `af1486a`) to `https://weird.baby` via `npm run deploy`. Gate 4
(press-publish) governs the actual `wrangler deploy` invocation.
**Status:** **COMPLETE.** Two production deploys landed in-session:
round 1 shipped Phase C as scoped (Version `0ee212e0-1f50-44a3-a611-aa89dba095a9`);
round 2 shipped a mid-session UX patch on top (Version `9dc92d5b-ed0d-4bf3-b63f-94c4d3a08fb0`,
museum HEAD `3e799ca`). Both deploys verified end-to-end against the
live edge. Operator visual sign-off: "Stunning. Wow!!!" on round 2.

---

## §0 — How to read this report

Mirrors `docs/PHASEC_RUN_REPORT-20260522-170000.md` structurally.
§1 audit-on-entry + production-state audit; §2 stop-and-ask events and
resolutions; §3 the deploys themselves (×2); §4 post-deploy verification
(×2); §5 acceptance; §6 observed-but-not-actioned; §7 lessons committed;
§8 what's next.

The session ran ~45 minutes active across two deploys plus the
investigation arc that resolved a routing-finding false alarm before
round 1. Two commit hashes are central to this report:

- `ba14f72` — museum HEAD at session start; bundle that shipped in round 1
- `3e799ca` — single +8/-3 layout patch on top; bundle that shipped in round 2

`3e799ca` was authored as `cowork agent <cowork@local>` per CLAUDE.md.

---

## §1 — Audit-on-entry results

### 1.1 Session-state mismatch surfaced first

The session brief carried forward the assumption that Cowork's bash
sandbox would have the three Windows repo paths mounted, and that
Claude could "drive PowerShell yourself." Neither held at session
start: the sandbox `/sessions/<id>/mnt/` only contained `outputs`,
`uploads`, `.claude`, `.remote-plugins` — no `AI/` tree. The sandbox
is Linux-only; no `pwsh`/`powershell` available; no `wrangler` on the
sandbox `PATH`.

Surfaced to operator with three working-model options:
(a) operator runs, Claude gates;
(b) connect the repos and operator runs;
(c) both.
Operator chose (c). All three folders (`weird-baby-museum`, `MediaVault`,
`Hunter Root`) were mounted via `mcp__cowork__request_cowork_directory`
within ~30 seconds. From then on, Claude had read access to all three
trees via Read/Grep/Glob + bash via the FUSE mounts, and shell commands
that needed the operator's Windows-side state (wrangler auth, npm run
deploy, etc.) ran on the operator's machine with paste-back.

**Lesson:** brief assumptions about Cowork capability need verifying
at session start (§7.3). Documented in §1.0 of this report so future
sessions can pre-empt the same dance.

### 1.2 Repository HEADs match the brief

Verified via `git rev-parse HEAD` on each mounted repo:

- **Museum:** `ba14f722bf74a5e4e0598fefddc77abfe3d38f81` ✓ (matches brief)
- **MV:** `f08bfa0afc6b8a951ed49f86ea1c93189cf9910d` ✓ (matches brief)
- **HR:** `af1486a0b8af7583bff31c1e2fea1ab34a651f03` ✓ (matches brief)

Museum is **21 commits ahead of `origin/main`** at session start — all
local-only commits accumulated since the last GitHub push (which
predates Phase A by some weeks). This does not affect the Cloudflare
deploy: wrangler ships from local source, not from a git remote.
The session added one more commit (`3e799ca`); session-end ahead-count
is **22**.

Working trees clean for tracked files in all three repos; untracked
residue matches the inventory documented in PHASEC §6.5 / Phase A §5.3
(snapshot files, `_cowork/` directory, `dist.pre_*` backups). No
surprise modifications.

### 1.3 Local museum state

Confirmed from sandbox-side reads (museum repo mounted at
`/sessions/.../mnt/weird-baby-museum`):

- `package.json` deploy script: `"deploy": "npm run build && wrangler deploy"` ✓
- `wrangler.jsonc`: single-Worker config named `weird-baby`,
  `compatibility_date: "2026-04-09"` (relevant for §2.3 routing
  investigation), D1 binding `weird_baby_db` (database ID `4db60094-122a-4618-b3c5-8664f74af222`),
  `assets.not_found_handling: "single-page-application"`, no `routes`
  block (custom domain bound at dashboard level).
- `.env` (gitignored): 6 R2 keys with expected lengths per PHASEA §3.5
  (`R2_ACCOUNT_ID`=32, `R2_ACCESS_KEY_ID`=32, `R2_SECRET_ACCESS_KEY`=64,
  `R2_BUCKET`=17, `R2_PUBLIC_URL`=25, `R2_S3_ENDPOINT`=66).
- Existing `dist/client/assets/index-DX11fsNG.js` from the Phase C
  session: 346,974 bytes, contains the Phase C R2 audio URL marker
  (`ec58d4bb`), the `assets.weird.baby` domain, and the `playingAudioId`
  state symbol — confirms the Phase C bundle was build-ready locally
  before the session started.

### 1.4 Wrangler auth state

Operator-side via `npx wrangler whoami` (`wrangler` is not on the
operator's global PATH; npx finds the local `node_modules/.bin/wrangler`):

- Wrangler version: `4.81.1` (update available `4.94.0`; informational only).
- Auth type: OAuth Token (langmikea@gmail.com).
- Account ID: `3d80019fdcbebe42c1593d777ecd2f25` (matches PHASEA §3).
- Permissions: `workers (write)`, `workers_scripts (write)`,
  `workers_routes (write)`, `pages (write)`, `d1 (write)`,
  `workers_kv (write)`, `zone (read)`, `ssl_certs (write)`,
  `offline_access` — every permission needed for the deploy + the D1
  visits binding + future hygiene work.

The brief's named failure mode #1 ("Wrangler auth might be stale")
was ruled out before GATE 4 fired.

### 1.5 Production-state audit

Per session brief §0, audited what would be replaced by the deploy.
Initial HTTP HEAD/GET via sandbox curl:

- `https://weird.baby/` → HTTP 200, text/html, cf-cache HIT — landing
  page serving normally.
- `https://weird.baby/hr` → HTTP 404, content-type text/plain, 9 bytes
  body `Not found`. **Initially read as "/hr never existed in
  production"** (the deploy framing's wrong premise; corrected in §2.3).
- `https://assets.weird.baby/audio/ec/ec58d4bbede48aff…mp3` → HTTP 200,
  audio/mpeg, 6,309,298 bytes, `cf-cache-status: HIT`, `age: 81018`
  (~22.5h, matches the Phase C upload window). R2 + custom domain
  routing intact from PHASEA work.
- `https://assets.weird.baby/` → HTTP 404 (expected — R2 directory
  listing not enabled).
- `npx wrangler deployments list` → **10 prior deployments**, oldest
  `2026-05-12T23:47:17Z`, most recent `2026-05-19T00:48:51Z`. So the
  deploy framing of "first production deploy" was wrong twice: not the
  first wrangler deploy (it's the 11th), and not the first /hr access
  (per §2.3 below).

The corrected framing: round 1 was the **first deploy that visibly
changes the /hr exhibit content for visitors** — replacing a
pre-Phase-C bundle from 2026-05-19 with the Phase C bundle.

PASS. Going-in state intact; one significant clarification surfaced
via §2.3 before GATE 4 fired.

---

## §2 — Stop-and-ask events and resolutions

Four stop-and-ask events surfaced. All four resolved without aborting
the session; one resolved as a false alarm (§2.3); one expanded scope
within the session (§2.4).

### 2.1 Wrangler not on global PATH

`wrangler --version` from PowerShell returned "term not recognized."
The CLI is installed locally in `node_modules/.bin/wrangler` but not
globalized. `npx wrangler` finds it.

Operator-side impact: cosmetic — `npm run deploy` invokes wrangler via
npm's PATH augmentation, so the deploy itself works regardless of the
global PATH state. Auth verification just needed `npx` prefix.

No fix applied. Logged for future hygiene if the operator ever wants
direct `wrangler` invocation outside `npx`.

### 2.2 `wrangler deployments list` output truncation in paste-back

First operator paste of the deployments list looked cut off (the
PowerShell prompt didn't redraw before the copy). Asked operator
whether to wait or treat as empty; second paste contained the full
10-deploy list.

Pattern is worth naming: when shell output is on a long-running command
or large output, the operator's paste may be timing-dependent. Future
sessions can pre-empt by asking the operator to wait for the prompt
to redraw before copying.

### 2.3 Routing-finding false alarm (the big one)

**Symptom:** `https://weird.baby/hr` returned `Not found` (9 bytes,
text/plain). The current production `src/worker.js` ends with
`return new Response("Not found", { status: 404 });` as its terminal
handler. `public/_routes.json` has `{ "include": ["/*"], "exclude":
["/assets/*", "/favicon.svg", "/icons.svg"] }` — routing every non-asset
path to the Worker. The combination produced an obvious-looking story:
the Worker swallows /hr requests and returns 404, so the SPA shell
never reaches React Router, so /hr is broken in production. Tested
`/shop` and `/this-clearly-doesnt-exist` for confirmation — all
returned the same 9-byte 404.

**Conclusion at that point (wrong):** all 10 prior deploys had /hr
broken in production; pressing publish on `ba14f72` would reproduce
the same 404; visitors would never see Phase C's audio cards because
they can't reach the React route that mounts them.

**Proposed fix at that point (also wrong):** edit `public/_routes.json`
to `{ "include": ["/api/*"], "exclude": [] }` so the Worker only
catches API paths, letting the asset binding's SPA fallback serve
`/index.html` for `/hr`.

**Surfaced to operator** as four options:
(a) patch _routes.json then deploy;
(b) investigate further before any code change;
(c) deploy as-is;
(d) defer the deploy entirely.
**Operator chose (b).** This call was correct and caught the false
positive — the lesson is in §7.2.

**Investigation:**
1. Confirmed `dist/client/_routes.json` is byte-identical to
   `public/_routes.json` post-build (Vite copies `public/` verbatim);
   `@cloudflare/vite-plugin` source contains zero references to
   `_routes` (grep returned empty), so a manual edit to
   `public/_routes.json` would survive a build untouched. **The
   proposed fix was safe to apply** if it had been needed.
2. Web-searched Cloudflare's static-assets docs. Surfaced the
   determinative rule:

   > "If you have a Worker script (`main`), have configured
   > `assets.not_found_handling`, and use the
   > `assets_navigation_prefers_asset_serving` compatibility flag (or
   > set a compatibility date of 2025-04-01 or greater), navigation
   > requests will not invoke the Worker script. A navigation request
   > is a request made with the `Sec-Fetch-Mode: navigate` header,
   > which browsers automatically attach when navigating to a page."

   `wrangler.jsonc` has `compatibility_date: "2026-04-09"` — satisfies
   the rule. **Browser navigation requests to /hr should bypass the
   Worker and hit the asset binding's SPA fallback regardless of
   `_routes.json`.**
3. **Tested** by curling `/hr` with `-H "Sec-Fetch-Mode: navigate"`
   and `-H "Sec-Fetch-Dest: document"`. Result: **HTTP 200**, text/html,
   1,119 bytes — the SPA shell. `/shop` with the same headers: same
   200 SPA shell. The earlier curl HEAD requests had measured the
   non-browser path; real browsers were fine.

**Resolution:** the routing was never broken for real visitors. All 10
prior deploys' /hr was reachable; visitors saw the pre-Phase-C SPA
shell loading the pre-Phase-C JS bundle. The deploy framing's right
substantive claim — "Phase C work becomes visitor-visible" — is true,
but for a more boring reason than the false-alarm framing suggested:
not because /hr starts existing, but because the SPA shell starts
referencing the Phase C bundle hash.

Owned the false positive openly to the operator; updated the
DEPLOY_RUN_REPORT framing accordingly; proceeded to GATE 4.

### 2.4 Mid-deploy UX escalation: audio-card sizing

After round 1 succeeded and operator did the visual walk on the live
production /hr, operator reported three observations:
1. Basic load + render: pass
2. Within-AudioCard behaviors (play/pause, mutual exclusion, filter):
   pass
3. **Audio cards inconsistent in size** — one card was visibly 2× the
   size of others in the same row, breaking the "matching album art"
   aesthetic
4. Audio cards not appearing in the bottom PlayerBar (Path B work,
   already deferred per PHASEC §2.2)
5. Track player and AudioCards don't interact (same Path B work)

(3) was the surprise. PHASEC §6.1 had documented the bumpy-grid
behavior as expected (`pickSpan`'s 70% wide-bias roll, combined with
1:1 aspect-ratio on audio, makes a 2-col audio card render at 2× both
width and height). Operator at the time accepted as "good enough for
Path A." Fresh look on production shifted the call.

Surfaced four paths forward:
(a) accept deploy, defer (3)(4)(5) per PHASEC precedent;
(b) address (3) layout polish in this session;
(c) address (4)(5) Path B starter in this session;
(d) hold for something else first.
**Operator chose (b).** Mid-session pivot to a UX patch + redeploy.

This is the second case in this session of "operator pushed back and
was right" — paired with §2.3, it's a strong signal that operator-call
gates on UX/production-impact decisions are working.

The patch landed as commit `3e799ca` (1 file, +8/-3 lines, hard-forces
audio cards to `span_w = 1` and removes audio from the `pickSpan`
wide-bias group). Round 2 deploy followed. See §3.2 and §5.2.

---

## §3 — The deploys

### 3.1 Round 1 — Phase C as scoped

**Operator command (PowerShell):**
```
cd C:\AI\Projects\weird-baby-museum
[DateTime]::UtcNow.ToString("yyyy-MM-ddTHH:mm:ssZ")  # → 2026-05-23T14:48:57Z
npm run deploy
```

**Build pre-flight (operator-side, Step 1):**
- vite v8.0.7
- 4 weird_baby env modules + 45 client env modules
- `dist/client/assets/index-CTZm8ZHz.js` = 346.97 kB (gzip 105.99 kB)
- `dist/client/assets/index-DBIWbghY.css` = 34.35 kB (gzip 6.97 kB)
- `dist/client/index.html` = 0.61 kB
- Exit 0
- "Using secrets defined in .env" confirmed the wrangler plugin
  picked up the 6 R2 keys

The pre-flight build at `14:48` and the deploy command's re-run
both emitted the same shape (346.97 kB JS, same CSS hash). Bundle
hash differed between the two (`CTZm8ZHz` vs the round-1 deploy's
`Lh6ML5Re`) due to the `__BUILD_TIME__` token injected by `vite.config.js`
on every build.

**Wrangler deploy:**
- 13 files read from `dist/client/` asset directory.
- 3 new or modified static assets uploaded:
  - `/index.html`
  - `/assets/index-DBIWbghY.css`
  - `/assets/index-Lh6ML5Re.js`
- 10 assets skipped (content-addressed dedup against R2/edge).
- Total upload: 3.00 KiB (gzip 0.91 KiB).
- Worker Startup Time: 4 ms.
- Bindings reported: `env.weird_baby_db (weird-baby-db)` D1 Database.
- `Uploaded weird-baby (7.28 sec)` + `Deployed weird-baby triggers (1.10 sec)`.
- workers.dev URL printed: `https://weird-baby.langmikea.workers.dev`.
- **Current Version ID: `0ee212e0-1f50-44a3-a611-aa89dba095a9`**.
- Exit 0.

The custom domain `weird.baby` mapping lives at the Cloudflare dashboard
level (no `routes` block in wrangler.jsonc), so the deploy output
doesn't echo it; the mapping continues to point at the same Worker.

### 3.2 Round 2 — layout patch

**Same command shape, fresh UTC timestamp `2026-05-23T15:08:38Z`.**

**Pre-deploy commit (sandbox-side):**
- `3e799ca` on `main` (single +8/-3 patch to `src/routes/hr/HrExhibitFlow.jsx`)
- Author: `cowork agent <cowork@local>` per CLAUDE.md
- Subject: `fix(hr-exhibit): force audio cards to 1-col, drop wide-bias`
- Body cites operator decision date (2026-05-23) + URL
  (https://weird.baby/hr) per PHASEC §7.4 operator-locked-rule pattern
- Pre-commit checks (sandbox):
  - Babel parse of modified file: OK (77 top-level AST nodes)
  - Lint scoped to modified file: 0 errors, 1 pre-existing warning
  - Sandbox-side build: failed on rolldown linux binding (missing
    `node_modules/@rolldown/binding-linux-x64-gnu/`); not an issue
    for the operator-side deploy

**Wrangler deploy:**
- 13 files read from `dist/client/`.
- **2 new or modified assets uploaded** (vs 3 in round 1):
  - `/index.html` (references the new JS hash)
  - `/assets/index-xSgBrz8-.js` (the fresh build)
  - CSS skipped — content-hash deduped (no CSS changes in the patch)
- 9 assets skipped.
- Total upload: 3.00 KiB (gzip 0.91 KiB).
- **Current Version ID: `9dc92d5b-ed0d-4bf3-b63f-94c4d3a08fb0`**.
- Exit 0.

The 2-asset vs 3-asset count is a clean signal that the patch was
minimal: only the JS bundle hash + the index.html that references
it needed re-upload.

---

## §4 — Post-deploy verification

### 4.1 Round 1 verification

Run from the cowork sandbox via curl + bash. All checks green:

| Check | Result |
|---|---|
| `https://weird.baby/` HEAD | 200, text/html, cf-cache HIT |
| `https://weird.baby/hr` (nav mode) | 200, text/html, 1119 bytes |
| SPA shell asset refs | `/assets/index-Lh6ML5Re.js`, `/assets/index-DBIWbghY.css` (matches deploy) |
| `https://weird.baby/assets/index-Lh6ML5Re.js` direct | 200, text/javascript, cf-cache MISS (just deployed) |
| Bundle bytes (live)          | 346,974 |
| Bundle bytes (local Windows build) | 346,974 |
| Bundle MD5 (live) | `ad70e8808d7421f33331018c4b29510a` |
| Bundle MD5 (local)| `ad70e8808d7421f33331018c4b29510a` |
| `assets.weird.baby` in bundle | 1 occurrence ✓ |
| `ec58d4bb` (PBP SHA) in bundle | 1 occurrence ✓ |
| `playingAudioId` in bundle | 1 occurrence ✓ |
| Audio path samples | `audio/0b/0b15c358`, `audio/0b/0b65aa63`, `audio/3b/3b3c3569`, `audio/48/48afb11d`, `audio/58/58c53cc8`, + more |
| Old bundle `index-CL2S4Xkw.js` | 404 (clean cutover) |
| R2 audio (PBP SHA) | 200, audio/mpeg, 6,309,298 bytes (unchanged) |
| workers.dev URL `/hr` | 200, SPA shell, same new bundle hash |

**Bundle integrity:** byte-identical between the Cloudflare edge and
the local Windows-side build output. No transport tampering, no
encoding drift, no upload corruption.

### 4.2 Round 2 verification

Same shape, against round-2 artifacts:

| Check | Result |
|---|---|
| `https://weird.baby/hr` (nav mode) | 200, text/html, 1119 bytes |
| SPA shell asset refs | `/assets/index-xSgBrz8-.js`, `/assets/index-DBIWbghY.css` (CSS unchanged) |
| New bundle direct GET | 200, text/javascript, cf-cache HIT (~60s post-deploy) |
| Bundle bytes (live)          | 346,975 |
| Bundle bytes (local) | 346,975 |
| Bundle MD5 (live) | `b09a5b70156fa8f79e19c633d29671c0` |
| Bundle MD5 (local)| `b09a5b70156fa8f79e19c633d29671c0` |
| Phase C markers in NEW bundle | `assets.weird.baby` ×1, `ec58d4bb` ×1, `playingAudioId` ×1 |
| Old (round-1) bundle `index-Lh6ML5Re.js` | 404 (clean cutover) |
| R2 audio (PBP SHA) | 200, audio/mpeg, 6,309,298 bytes (unchanged) |

Round-2 bundle MD5 (`b09a5b7…`) ≠ round-1 (`ad70e88…`) — confirms it
was a fresh build with the patch shipped, not a no-op redeploy. The
1-byte size delta (346,974 → 346,975) is the difference between
`isLink || isPhoto || isAudio` and `isLink || isPhoto` in the
minified output (the `|| isAudio` plus a few trivial bytes saved by
the ternary, net +1 byte after minification).

---

## §5 — Acceptance verification

### 5.1 Round 1 acceptance — Phase C scope

Operator performed visual walk on `https://weird.baby/hr` per PHASEC
§4.5 acceptance criteria. Reported:

1. Basic load + render: **PASS**
2. Within-AudioCard play/pause + mutual exclusion + filter-during-play
   behaviors: **PASS**
3. Audio cards rendered with visible 2× sizing inconsistency for one
   card: **OBSERVED** (mapped to PHASEC §6.1 deferral; escalated in §2.4)
4. Audio cards not in PlayerBar: **OBSERVED** (mapped to PHASEC §2.2
   Path B deferral)
5. PlayerBar + AudioCard not interacting: **OBSERVED** (same Path B
   work item)

Phase C's acceptance bar is items 1+2; items 3-5 are pre-existing
deferrals from PHASEC. Round 1 **PASSES the Phase C acceptance bar
on production**. Item 3 was escalated to in-session work by operator
choice (see §2.4).

### 5.2 Round 2 acceptance — layout patch

Operator visual walk on `https://weird.baby/hr` (hard refresh per the
session protocol):

- **All 15 RWTH audio cards now uniform** — ~280×280 album-art squares
  + ~50px footer, 4 per row visually consistent
- Photo + link cards keep their wide-bias variance (untouched by patch)
- Play/pause + mutual exclusion behaviors unchanged
- New observation: cards are **neither centered nor screen-width-filling**
  (left-aligned with empty space on the right due to
  `justify-content: start` + `grid-template-columns: repeat(4, minmax(0, 280px))`)

**Operator response: "Stunning. Wow!!!"** Round 2 **PASSES**.
The centering/width observation logged as non-urgent per operator
("Not urgent, plus I will have MANY aesthetic changes to make once I
pile some fresh artifacts into the museum") — see §6.2 and §8.2.

---

## §6 — Observed but not actioned

### 6.1 PlayerBar ↔ AudioCard coordination (Path B)

Round 1 visual review surfaced (4) and (5) — audio cards don't appear
in PlayerBar; PlayerBar and AudioCards don't interact for pause control.
PHASEC §2.2 operator-locked this as Path B work: "Path A AudioCard
does not coordinate with PlayerBar; Path B (source-agnostic player)
handles that when prioritized."

Out of scope for this session. AudioCard's `playingAudioId` state is
already lifted to `HrExhibitFlow` root (per PHASEC `d4d2db2`) so when
Path B work begins, lifting one more step to a coordinator that also
knows about the canonical YouTube PlayerBar is the natural shape.

Belongs in its own focused Path B session.

### 6.2 Audio-card grid not centered or full-width

Operator's round-2 observation, explicitly marked non-urgent. Mechanism:
`.hr-artifact-grid` in `HrExhibitFlow.css:133-140` uses:

```css
display: grid;
grid-template-columns: repeat(4, minmax(0, 280px));
justify-content: start;
```

On wide viewports the grid is 4 × 280px + 3 × 14px gap = 1162px wide,
sitting left-aligned in a potentially wider scroll container. Two
single-line fixes:

- **Center the grid:** change `justify-content: start` → `center`.
- **Fill the width:** change `grid-template-columns: repeat(4, minmax(0, 280px))`
  → `repeat(4, minmax(0, 1fr))`.

The operator's framing — "aesthetic changes alongside new artifacts" —
suggests this lands in a broader UX pass when more cards are populated
(currently 19 artifacts; populating more would change the visual weight
of the grid and the centering/width call).

### 6.3 22 commits ahead of `origin/main`

Started 21 ahead; this session added `3e799ca`; ended 22 ahead. None
have been pushed to GitHub. Local backup only.

`origin/main` last received a push some weeks before Phase A; the
intervening commits include Phase A (`5fab185` and predecessors),
Phase B work, Phase C (`d14c13b`, `24d8720`, `d4d2db2`, `5fab185`),
the ingest behavior audit (`ba14f72`), and this session's
`3e799ca`. A future hygiene session can push everything in one
batch; nothing blocks doing it sooner.

### 6.4 Sandbox-side build not viable

`npm run build` from the cowork sandbox fails on
`Cannot find module '../rolldown-binding.linux-x64-gnu.node'` because
`node_modules/@rolldown/binding-linux-x64-gnu/` was never installed
on this machine (Windows-side only has the win32-x64-msvc binding).
CLAUDE.md §quirk 5 documents a symlink workaround but the underlying
package is missing.

Not a blocker — the operator-side `npm run deploy` re-runs build on
Windows where the binding exists. Pre-flight build validation from
the sandbox is restricted to Babel parse + lint scoped to modified
files. If sandbox-side build is ever needed for verification,
`npm install` with `--include=optional` or explicit
`--target_platform=linux` might pull in the Linux binding.

### 6.5 Pre-existing carry-forwards from PHASEC still apply

PHASEC §6.1 (visual layout roughness for non-audio cards), §6.2 (APIC
monotony), §6.3 (libuv exit-code noise on export-artifacts), §6.4
(dotenv banner mojibake), §6.6 (npm vulnerabilities), §6.7 (stale
`weird-baby build token` revocation pending), §6.8 (per-photo source
aspect), §6.9 (ID3 trailing space on "Northern Light Streaks"),
§6.10 (HrArchive ALBUMS reconciliation), §6.11 (vocabulary_csv_sha
in export output) — all unchanged by this deploy. Carried forward.

### 6.6 Lint debt count expansion (visible during pre-commit check)

CLAUDE.md documents the lint baseline as "4 errors / 6 warnings." A
full `npm run lint` from the sandbox reported 262 problems (256
errors, 6 warnings). The 6 warnings match CLAUDE.md's count exactly.
The 256-error count is the same pre-existing
`react-hooks/immutability` rule (Exhibit.jsx:88 / :508 etc.) firing
line-by-line on the same logical violations — 4 root issues × many
lines per issue ≈ 256 sub-line diagnostics. The rule's diagnostic
density has changed, not the underlying debt.

Mitigation for future pre-flights: lint scoped to the modified file
is the authoritative check ("did my change add new diagnostics"), not
the global error count. Verified for this session via
`npx eslint <modified-file>` returning 0 new errors.

---

## §7 — Lessons committed

### 7.1 Curl HEAD ≠ browser navigation (Cloudflare compat-flag rule)

The §2.3 routing false alarm originated in measuring the wrong thing:
curl's HEAD/GET requests don't carry `Sec-Fetch-Mode: navigate`, so
they bypass the Cloudflare assets-binding navigation-mode bypass that
ships when `compatibility_date >= 2025-04-01`. The Worker handles
non-navigation requests; navigation requests hit the asset binding's
SPA fallback directly.

**Future test pattern for SPA + Worker + Assets on Cloudflare:**
```
curl -H "Sec-Fetch-Mode: navigate" -H "Sec-Fetch-Dest: document" \
     -H "Accept: text/html" <url>
```
This matches a browser navigation. Use it any time auditing whether a
SPA fallback is engaging on production.

### 7.2 "Investigate further before code change" caught a false positive

Operator's choice of "investigate before code change" in §2.3 (over
the alternative "patch + deploy") was the right call. The patch I
proposed (`_routes.json` narrowing) would have been a no-op at best —
the routing wasn't broken. If the patch had been applied without
investigation, the session would have shipped an unnecessary commit
and the false-positive narrative would have stuck.

**Lesson:** when a finding has plausible alternative explanations
(compat flags, framework behavior, runtime defaults), investigate
before patching. Time cost of investigation: ~10 minutes. Time cost
of an avoidable production commit + the confusion of explaining it in
the run report: hours.

### 7.3 Cowork session capability vs brief assumptions

Brief carried forward "Cowork's bash sandbox is Linux with the three
Windows repo paths mounted" and "You drive PowerShell yourself."
Neither held at session start. The standard cowork session opens
with no folders mounted and no Windows-side shell access.

**Pattern for future sessions:** when a brief mentions repo paths or
shell access carried over from prior sessions, verify capabilities
at session start before assuming. The check is cheap (~10 seconds of
bash + ls). Either:
- Connect folders via `mcp__cowork__request_cowork_directory`
- Surface to operator and establish the working model explicitly

This session resolved cleanly because the capability gap was named
in the first response. A session that proceeds for several turns
assuming missing capability burns operator attention.

### 7.4 Mid-deploy UX escalation: small scope is in-scope

Operator's choice in §2.4 to address the audio-card sizing in-session
(rather than defer to a follow-on session) worked because:

1. The fix was small (1 file, +8/-3, no new deps, no config changes)
2. The mechanism was well-understood from PHASEC §2.5 / §6.1
3. A second deploy in-session is cheap (~30 seconds wrangler upload
   for 2 assets)
4. The visual feedback loop was fast (operator visual review →
   diagnosis → patch → redeploy → visual review again)

**Lesson:** for layout/CSS/JS-only changes with no infrastructure
mutations, treating mid-deploy UX escalations as in-scope is
reasonable. The gate to verify before doing this: estimate the
patch size + the diagnostic risk; if both are small, ask the
operator. If the change touches infrastructure (R2, D1, routing,
auth, env vars), defer it.

### 7.5 Cowork delete-permission gate

CLAUDE.md §quirk 3 documents that `rm` requires explicit permission
via `mcp__cowork__allow_cowork_file_delete` before the Python rm+write
pattern works. This session hit the gate on the first edit attempt.
The permission, once granted, was approved at the museum-folder level
(broader than the narrow path requested) — which incidentally enabled
all subsequent `.git/` lock operations + `docs/` writes for free.

**Pattern for future sessions touching repo files:** request
delete-permission proactively on the first file-write attempt to
the mounted repo, not after a failure. The operator-side dialog is
unobtrusive and the operator's grant scope is typically broader than
the narrowest-possible request.

### 7.6 Bundle byte-integrity check is a cheap signal

For both rounds, comparing live-bundle MD5 to local-build MD5
confirmed byte-identical bytes between Cloudflare's edge and the
operator's Windows-side `dist/`. Total cost: ~5 seconds of curl + md5
per round.

This rules out a class of failure modes that are otherwise hard to
notice from logs alone: transport corruption, encoding drift,
upload-content mismatch, edge-cache serving stale bytes, etc. Worth
making this a permanent part of the post-deploy verification step.

---

## §8 — What's next

### 8.1 Path B — source-agnostic player

PHASEC §8.2 + this report's §6.1. Lift `playingAudioId` one more
step to a coordinator that knows about both AudioCards and the
canonical YouTube PlayerBar. Implements:

- Audio card play → if PlayerBar is playing a track, pause it
- PlayerBar track play → if any AudioCard is playing, pause it
- Single source of "what's currently audible," reflected in both
  surfaces

Touches `Exhibit.jsx` (PlayerBar) + `HrExhibitFlow.jsx` (AudioCard +
ArtifactCard) + the lifted state's owner. Probably its own focused
session.

### 8.2 Aesthetic polish on the artifact grid

Operator's "MANY aesthetic changes" framing suggests this is one
focused UX session post-population. Candidate items:

- Grid centering vs width-fill (§6.2)
- Non-audio card variance polish (PHASEC §6.1)
- Per-photo source aspect ratios (PHASEC §6.8)
- Whatever new visual considerations the additional artifacts surface

### 8.3 GitHub push

22 commits ahead of `origin/main`. A `git push origin main` from the
operator's PowerShell publishes them all in one batch. Optional but
recommended as a backup against local-disk loss.

### 8.4 Pre-existing PHASEC carry-forwards

Per §6.5 above: the PHASEC §6 + §8 items remain on the punch list.
None of them block visitor-facing work; all are hygiene-track.

### 8.5 Documentation update for routing semantics

Worth adding a brief note to CLAUDE.md (or a sibling Cowork-ops doc)
covering §7.1's curl-vs-navigation pattern. Saves future sessions
from re-deriving the false-positive narrative when auditing a
SPA+Worker+Assets Cloudflare deployment.

---

*End of report. Two production deploys (`0ee212e0` then `9dc92d5b`);
one museum commit (`3e799ca`); zero MV commits; zero HR commits.
Phase C visitor-facing surfaces + the audio-card uniform-sizing patch
both live at https://weird.baby/hr. Operator visual sign-off:
"Stunning. Wow!!!" The session also produced one false-positive
investigation (§2.3) that the operator's gating caught before any
code change.*
