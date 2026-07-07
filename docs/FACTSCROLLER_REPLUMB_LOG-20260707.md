# FactScroller Re-Plumb + First Recipe Cards — RUN LOG

**Brief:** `FACTSCROLLER_REPLUMB_BRIEF-20260707.md` · **Authority:** FACTSCROLLER_SPEC_v1.0.md > PUV_FACT_MODEL_SPEC.md > brief.
**Run date:** 2026-07-07 · **Executor:** Ops (Claude, Cowork) · **Host execution + gates:** Mike
**Standing rules:** Stage 0 MV backup before any MV write · host-side MV writes + commits · commit gate per stage · delegation split (verification delegated, UX-visible/wording gates Mike's) · volume-before-polish (polish temptations FLAGGED, never applied) · scroller look/motion untouched · facts never render as standalone wall tiles — structurally enforced.

Orientation verified this session (read-only): WBM HEAD `018314f` (brief committed), MV HEAD `9c95833` — both match the press-batch close. Mount DB copy verified current by counts (392 artifacts / 97 facts, all vault) matching the press-batch log's recorded post-state; all queries below read a /tmp copy (virtiofs hazard, OPERATIONS §8).

---

## STAGE 1 — Ground-truth + design delta (read-only)

Sources read this session: FACTSCROLLER_SPEC_v1.0, PUV_FACT_MODEL_SPEC, FACT_KIND_PUV_PILOT_LOG (Flag B), PRESS_BATCH_INGEST_LOG, `Exhibit.jsx` (FactScroller :79–157, buildFactQueue :59, mount :1044, root contract :580), `hr_facts.js` (51 seeds), `hunter-root.js` + `hunter-root-spine.js` (spine contract), `tools/export-artifacts.mjs` (full), `era-buckets.json`, `HrExhibitFlow.jsx` card dispatch (:2400–2444), live-tree git logs both repos, MV DB (/tmp copy).

### Current scroller (parity reference — UNTOUCHED look/motion)
`FactScroller` in `Exhibit.jsx`: 2-line block, `fs-*` classes, enter-up/down animation, 7.5 s cycle, ‹ › history nav, accent rule. Data: `artist.facts` = static `FACTS` from `hr_facts.js` ({id, albumId, trackId, type, weight, lines[2]}); `buildFactQueue` filters by spine album id + exact track TITLE, intro-boosted weighted sort, seen-set dampening. WB exhibit passes `facts: []` (safe empty).

### Vault fact ground truth (97 facts, all `status='vault'`)
Tag coverage: `band:` 97 · `exhibit:hunter_root` 97 · `source:` 97 · `speaker:` 93 · `topic:` 86 · `album:` 30 (arkansas 7, crooked_home 15, orphic_grimoire 6, run_with_the_hunt 2) · `song:` 14 (7 songs) · `era:` 3 (legacy slugs: `rwth`×2, `early_days`×1) · `people:` 19 (nick_root 16) · `venue:` 2. Two-line surface = `description_short`/`description_long` (line 2 often the attribution). Containers precedent: kind NULL, media_type `other`, source `local`, notes JSON `{card_kind, ...}`.

### Delta

**(a) Export path for facts — separate facts payload.** New `FACTS_SQL` (kind='fact', released, non-archived, exhibit-badged) → `src/data/exhibits/<name>.facts.json` `{metadata, facts:[{id, lines[2], tags(grouped, era KEPT — no date-baking; facts are scroller data, not deck tiles)}]}`, written for every exhibit (empty ok). Wall payload untouched in shape. **Structural fact-tile enforcement, two independent locks:** (1) `PER_EXHIBIT_SQL` + `CHILDREN_SQL` gain `AND (a.kind IS NULL OR a.kind <> 'fact')` — a fact can NEVER tile the wall regardless of status; (2) facts live in a file the deck never imports. Verification asserts zero fact ids in `hunter_root.json` post-flip.

**(b) Release-status call — RECOMMEND: flip the 97 facts to `released` (host script, Stage-0 backup first).** Rationale: released = reaches-visitors is MV's lifecycle meaning; facts now DO reach visitors (via scrollers). Vault keeps meaning "held from visitors" — the per-fact curation lever survives for future facts. The Flag-B vault hold was explicitly "until display UI exists" — this brief builds that UI. Tradeoffs flagged: 97-row DB write (backup + host run, one transaction, `released_at` set) vs. the alternative (export-from-vault channel): zero DB write but permanently forks vault semantics (vault-but-visible) and removes the per-fact hold lever for all future facts. Exporter guard (a-lock 1) must COMMIT BEFORE the flip runs — enforced by stage order.

**(c) Recipe-card artifact shape.** Container-family conventions: kind NULL, `media_type='other'`, `status='released'`, `source_platform='local'` + `source:local` tag, notes JSON `{"card_kind":"recipe","recipe":{"all":[...],"any":[...],"not":[...]}}`, tag `card_kind:recipe` (**NEW vocab value — Mike-gated; registers at first use, usage 2, F7-clean**) + `exhibit:hunter_root` + facet tags (filter obedience is automatic — matchFilter reads tags). Exporter passes through: `record.card_kind='recipe'` + `record.recipe`; era-derivation exemption extended to `recipe` (era-less by design, same class as album/gallery containers — spec precedent "containers era-less"). Pilot definitions (recipes; titles/blurbs = Mike's words at Stage 2 gate):
- **Nick Root** — `{all:["people:nick_root"]}` → **16 facts**. Healthy pool.
- **Arkansas reviews** — strict reviewer-quotes `{all:["album:arkansas","source:press"], not:["speaker:hunter_root"]}` → **2 facts only** (THIN — flagged). Broadened option `{all:["album:arkansas"]}` → 7 (includes Hunter's own Arkansas quotes). Mike picks at the wording gate.

**(d) Climb + weight at the scroller.** Spine gains additive fields (`album.tag` = MV album slug, `track.song` = song slug) — contract consumers unaffected. Selector (shared module `src/lib/fact-select.js`, used by scroller + living cards): tiers T1 `song:<slug>` → T2 `album:<tag>` → T3 `era:` alias of the album's era bucket (legacy fact era slugs bridged by a small static alias map — only 3 era facts exist; tier is structural, pays off with volume) → T4 all exhibit facts. First-meet on the track; a tier exhausts, the climb continues, unsignaled; T4 guarantees the fountain never dries. **Weight = selection frequency:** per-session shown-count per fact id; within a tier pick lowest-shown first with random jitter; full-pool recycle resets nothing (counts persist for the session) so rarely-shown facts keep priority. No stored weight field (closes the pilot's deferred weight signal with no schema). Render path (JSX/CSS/timing/nav) byte-identical — look/motion untouched.

**(e) hr_facts.js fate — RECOMMEND: retire from the live path NOW; salvage separately.** Parity: the vault's 97 are press/interview quotes + 4 pilots; ~45 of the 51 seeds have NO vault counterpart (album intros, track color, view-count claims). BUT the static set carries content Mike has since corrected or flagged: `dandelions-intro-002` + `skipping-album-001` state Nick died 2020 (source-backed truth: 2021-04-15); 3 seeds carry hr_facts' own BACKLOG unverified-claim flags. Keeping the file live keeps wrong facts live. Retire = remove the import (`hunter-root.js` reads the facts payload instead); file stays in-tree, unimported, header note pointing here. Salvage of unique seeds = separate mini-collection brief (Mike picks which seeds get vaulted with breadcrumb markers — the sourceless-marker closed set lands there too). Consequence flagged honestly: until salvage, most tracks have no T1 fact and climb straight to album/artist quotes — volume-before-polish accepts this.

### FLAGS
- **FLAG D — id_sequence stale.** `id_sequence('20260707') = 4`, but press-batch inserts pinned ids 005..099 without advancing it. Next allocated id would COLLIDE (005/006 exist). Recipe-card insert script pins ids explicitly (`MV-HR-20260707-100/101`) AND corrects `id_sequence` to 101 in the same transaction.
- **FLAG E — new CSS for living cards.** The living-card scrolling region needs NEW rules in `HrExhibitFlow.css` (container sizing inside the card shell), reusing the existing `fs-*` animation/typography verbatim. New-feature UI, not polish; ZERO changes to existing scroller rules. Any temptation beyond that gets flagged per standing rule.
- **FLAG F — polish temptations noticed and NOT applied:** attribution line 2 could be styled distinctly; scroller font could scale in living cards; era alias map invites an era re-tag pass. All parked (volume before polish).

**Gate: delta review — PASS** (Mike, 2026-07-07). Rulings: (b) release-flip APPROVED; Arkansas recipe = BROAD (all `album:arkansas`, 7 today, incl. Hunter's own words + derived facts); `card_kind:recipe` blessed (Ops); recipe wording verbatim (Stage 2). BACKLOG (low/low): a strict critics-only Arkansas variant as a future recipe card.

---

## STAGE 2 — Export + data (host-side MV writes) — _in prep; blocked on Mike's gates_

Prepared this session (nothing executed; all MV writes are Mike's, host-side):

- **Exporter edits landed in the tree** (`tools/export-artifacts.mjs`, host-side file tools): lock 1 (`kind <> 'fact'` in `PER_EXHIBIT_SQL` + `CHILDREN_SQL`), `FACTS_SQL` + `buildFactRecord` + per-exhibit `<name>.facts.json` write (unconditional, empty ok — static imports never 404), recipe passthrough (`card_kind:recipe` + validated `recipe` from notes JSON; malformed recipe ships without the field — fail visible), era exemption extended to `recipe`, summary lines gain fact counts. Syntax preflight (`node --check`) rides the Stage 2 host script — bash-mount parsing of freshly host-edited files is unreliable (OPERATIONS §8 read-lag).
- **`tools/factscroller_stage0_backup.ps1`** — backup + verify (expectations pinned to press-batch close: 392/97-vault/23/230; prints id_sequence staleness for the record).
- **`tools/factscroller_stage2_release_facts.ps1`** — the (b) flip: pinned to live sha `72BF738A…` (mount copy, count-verified; pin re-checked host-side, abort on mismatch), one transaction, 97 rows vault→released + `released_at`, post-asserts (97/0/308/392/0) with rollback, integrity check, exporter syntax preflight.
- **Recipe-card insert script NOT yet written** — waits on Mike's wording gate (zero-placeholder rule). Will pin ids `MV-HR-20260707-100/101`, repair `id_sequence` 20260707 → 101 (Flag D), register `card_kind:recipe` at true usage 2, one transaction.

### Recipe cards (wording gate PASS — Mike's words verbatim)

Both mirror the album-container tag shape (kind NULL, media_type `other`, source `local`, `content_kind:other`) + `card_kind:recipe` + scope facets so the card is filter-obedient the intuitive way; recipe query lives in notes JSON.

- **`MV-HR-20260707-100` — "Nick Root"** · blurb: *"The older brother. The reason there's a guitar in these hands at all."* · recipe `{all:["people:nick_root"]}` → 16 facts · tags: exhibit/card_kind:recipe/source:local/band:hunter_root/people:nick_root/topic:family/content_kind:other.
- **`MV-HR-20260707-101` — "Arkansas"** · blurb: *"What the critics said about Arkansas — and a few words from the man himself."* · recipe `{all:["album:arkansas"]}` (BROAD) → 7 facts · tags: exhibit/card_kind:recipe/source:local/band:hunter_root/album:arkansas/content_kind:other.

Card titles ("Nick Root"/"Arkansas") = the headings above Mike's blurbs — assume-and-stated (visible at Stage 3 eyeball).

**UX-visible consequence, assume-and-stated:** `card_kind` is a live tier-3 filter dimension (Album/Gallery pills already render); a **Recipe** pill now joins it. Consistent with existing behavior; makes living cards filterable as such. On the record for Mike's Stage 3 eyeball.

### Registry math (invariant preserved, verified in sandbox)
New slug `card_kind:recipe` @ usage 2; increments exhibit+2/source:local+2/band:hunter_root+2/content_kind:other+2/people:nick_root+1/topic:family+1/album:arkansas+1. Registry 230→231, 0 mismatch, 0 zero-usage. source tag==column stays balanced (both cards source_platform `local` + `source:local` tag). Confirmed against live-tree registry (0/230 at entry).

### Scripts ready (all Mike-run, host-side; nothing executed this session)
1. `tools/factscroller_stage0_backup.ps1` — backup + verify.
2. `tools/factscroller_stage2_release_facts.ps1` — the (b) flip (sha-pinned `72BF738A…`, txn, 97 vault→released, asserts 97/0/308/392/0, rollback, exporter `node --check` preflight).
3. `tools/factscroller_stage2_recipe_cards.ps1` — the 2 inserts + registry + **Flag D id_sequence repair 4→101**. Content-preconditioned (no sha pin — the flip's `released_at` timestamps make the DB sha non-deterministic; guards on released=308/facts=97/no-dup/registry-0-mismatch instead); one txn; post-asserts 394/2-2/231/0/0/101/parity; rollback on any miss; SELECT-back of both cards.
4. `tools/factscroller_stage2_export_verify.ps1` — READ-ONLY, after `npm run export-artifacts`: wall=49, ZERO fact ids on wall, 2 recipe cards with baked recipes + era-less, facts payload=97, Nick pool 16 / Arkansas pool 7, era tags survive on facts.

Exporter edits already in the tree (committed with this stage): syntax-checked (`node --check` OK), fact-record + recipe-validation logic dry-run-verified in sandbox.

**Run order (Mike, host-side):** stop MV server → `stage0_backup` → `stage2_release_facts` → `stage2_recipe_cards` → commit exporter+scripts+log (explicit paths) → start MV server → `npm run export-artifacts` → `stage2_export_verify` → commit data payloads (`hunter_root.json` + `hunter_root.facts.json` + `vocabulary.json`) → paste-backs here → Stage 2 commit gate. Then Stage 3 (client) is unblocked — the facts payload now exists for the static import.

### Paste-backs (2026-07-07, host-side, Mike-run — all clean)

- **Stage 0 backup:** `mediavault_pre-factscroller-20260707T202907Z.sqlite`; SRC==DST sha `72BF738A…`; pin match TRUE. Verify: integrity ok, 392 artifacts, 97 facts all vault, status 1/1/211/179, vocab 23, registry 230, card_kind album 9/gallery 1 (no recipe), id_sequence 20260707 = 4 (stale, as expected). MV `9c95833` clean, WBM `018314f` + expected untracked.
- **Release-flip:** pin `72BF738A…` match; exporter `node --check` OK. FLIP_OK — facts released 97 / still-vault 0 / released total 308 / artifacts 392 / missing released_at 0; integrity ok; sample `-001` released @ 20:29:46. Post sha `0C8E80D9…`.
- **Recipe inserts:** RECIPE_INSERT_OK — artifacts 394, card_kind:recipe 2/2 released, registry 231 / 0 zero-usage / 0 mismatch, **id_sequence 20260707 = 101 (Flag D repaired)**, source tag==column 394/394, integrity ok. Both cards SELECT-back verbatim (titles, blurbs, tags, recipes as specified). Post sha `6C8BCD49…`.

**Remaining Stage 2 (Mike):** commit exporter+scripts+log → MV up → `npm run export-artifacts` → `stage2_export_verify` → commit data payloads → Stage 2 commit gate.

**Stage 2 CLOSED (2026-07-07):**
- Exporter/scripts/log/selector committed `abebfa7` (`018314f..abebfa7`, pushed).
- Export clean: `hunter_root.json` 49 artifacts, `hunter_root.facts.json` 97 facts, `vocabulary.json` 23 rows; 0 underivable; 0 no-badge.
- Verify: one real fix landed — the "zero facts on wall" test originally guessed by id-range and false-flagged `-005`/`-006` (ingested PRESS artifacts, legitimately on the wall). Corrected to the exact invariant: **wall ∩ facts-payload ids = ∅** (verified empty). Plus UTF-8 on the embedded Python's `open()` (Windows cp1252 crash on the em-dash blurb). **18/18 OK**, exit 0.
- Data payloads committed `e5648e6` (`abebfa7..e5648e6`, pushed); tree clean. **Stage 2 commit gate: PASS.**

### Stage 3 pre-draft (started while Stage 2 export runs — see Stage 3 section)

## STAGE 3 — Client re-plumb — _pre-draft started (module only); full wiring holds for the Stage 2 export + Mike's eyeball_

**Pre-drafted this session (new file, non-executing, unit-proven):** `src/lib/fact-select.js` — the shared selector serving BOTH consumers (player scroller via climb; living recipe cards via `{all,any,not}`). Pure, framework-free, no React. Closes the pilot's deferred **weight signal with zero schema** (weight = per-session shown-count).

- `factHasTag` / `matchRecipe` / `climbTier` (song 3 → album 2 → era 1 → exhibit 0, −1 off-exhibit) / `climbCandidates` / `recipeCandidates` / `pickWeighted` (score = tier·100 − shown·10 + jitter, bands never cross) / `makeFactCycler` (`next`/`setContext`/`poolSize`; avoids back-to-back repeats; `setContext` re-points the climb on track change WITHOUT resetting shown-counts so weight = session frequency).
- Tests: `/tmp/fs_test.mjs` (sandbox, deterministic RNG) — **27/27 pass**: tag match incl. malformed; recipe all/any/not + empty-matches-nothing (a malformed/absent recipe scrolls nothing, never the whole vault); climb tiers; first-meet is the track fact; fountain never returns null; climbs to album then artist floor; never surfaces off-exhibit facts; no immediate repeat; recipe pool balances (Nick-style pool ~50/50); single-fact thin pool keeps returning it; empty pool → null; `setContext` preserves weight.

**WIRED this session (host files, surgical anchored edits — compile-verified, awaiting Mike's build + eyeball):**
- `src/data/artists/hunter-root-spine.js` — spine albums gain `tag` (MV album slug, T2), tracks gain `song` (song slug, T1). Additive; existing consumers unaffected.
- `src/data/artists/hunter-root.js` — `facts` now = the facts payload (`hunter_root.facts.json`); static `hr_facts.js` import REMOVED (delta e — retired from live path, file stays in-tree unimported). Added `exhibitSlug:"hunter_root"` + `eraAlias:{rwth:["rwth","early_days"]}`.
- `src/routes/exhibit/Exhibit.jsx` — `import { makeFactCycler }`; `FactScroller` internals swapped to the cycler (climb ctx from now-playing track); **render path byte-identical** (fs-* JSX/CSS/.55s/7.5s/nav all unchanged); mount passes `albumTag`/`songSlug`/`eraSlugs`/`exhibit`. Dead `buildFactQueue` removed.
- `src/routes/hr/HrExhibitFlow.jsx` — facts-payload import + `RECIPE_FACTS`; `RecipeCard` component (cycler + fs-* body); `isRecipe` predicate + className + dispatch branch before the placeholder fallback. Filter obedience is automatic (matchFilter reads the card's own tags — no change).
- `src/routes/hr/HrExhibitFlow.css` — one layout-only rule `.hr-card-recipe .hr-card-recipe-vis` (Flag E, minimal): padded centered scroll box; reuses `fs-*` motion/type VERBATIM.

**Compile verification (mount-lag defeated per OPERATIONS §8).** A sandbox `vite build` was unreliable — the bash mount served a stale/truncated view of the freshly-edited `HrExhibitFlow.jsx` (reported 186,911 B / 4082 lines ending mid-token; the authoritative Read-tool view is complete + clean through L4158, and the committed HEAD blob is 4075 lines ending `}`). Verified instead by RECONSTRUCTION: git-HEAD baselines + the exact anchored edits, esbuild-bundled with `packages:'external'` → **ESBUILD_OK, 0 warnings** (all local source compiles, imports resolve, JSX balanced). Host RecipeCard spot-checked intact via Read tool. Selector unit tests remain 27/27.

**Still HOLDS for Mike (host-side — authoritative build reads real files, not the mount):**
- `npm run build` host-side (the real compile gate) → local preview.
- **Mike's eyeball gate:** play a track → scroller cycles real vault facts (first-meet on track, climbs); filter the wall → both recipe cards alive and filter-obedient; look unchanged from the version he likes.
- **On the record for the eyeball (assume-and-stated, easy to change):** (1) recipe-card body reuses the player scroller's 1.34rem gold type verbatim — may read large in a small wall card (Flag F polish, parked); (2) a **Recipe** pill now appears under the Card Kind filter group.

_Superseded pre-draft note (kept for history):_
- `Exhibit.jsx` — `FactScroller` reads the facts payload via `makeFactCycler` climb ctx keyed to now-playing track; render path (JSX/CSS/`fs-*`/7.5 s/‹ › nav) BYTE-IDENTICAL. Facts payload threads in as `artist.facts` (from `hunter_root.facts.json`); `hunter-root.js` swaps the static `hr_facts.js` import for the payload (delta e: retire static set from the live path). A tiny album→era-slug alias map (only 3 era facts) feeds `ctx.eraSlugs`.
- `HrExhibitFlow.jsx` — `isRecipe` branch in the card dispatch (`card_kind:recipe` + `record.recipe`): renders the existing card shell with a scrolling body driven by `makeFactCycler({facts, recipe})`, filter-obedient via the card's own tags (matchFilter already handles it — no change). **FLAG E:** NEW `.hr-card` scrolling-region CSS in `HrExhibitFlow.css`, reusing `fs-*` animation/type verbatim; zero edits to existing scroller rules.
- Big-file hazard (OPERATIONS §8): `HrExhibitFlow.jsx` (~162 KB) + `Exhibit.jsx` (~43 KB) edits are surgical/anchored, host-verified — no Cowork read-modify-write on the large files.

**Mike's eyeball gate (Stage 3):** play a track → scroller cycles real vault facts; filter the wall → both recipe cards alive; look unchanged from the version he likes.

### Stage 3 EYEBALL round 1 (2026-07-07) — "Pretty good!!!!" + polish pass

Mike's feedback + rulings, and what changed. Root cause of most of it: the vault facts are long-form press quotes (line 1 avg 100 / max 182 chars) but the scroller was built for two short seed lines → overflow clipped the closing quote ("missing end quotes"), variable heights drove the masonry reflow "flash."

Gate answers: **player scroller = fix overflow only, keep bounce** · **display model = quote in the big box, breadcrumb (source) in the small box, "nothing more"** (drops the competing editorial blurb).

Shipped (all client, host files; compile-verified via git-HEAD reconstruction + esbuild, 0 warnings; `splitFact` unit-tested 8/8):
- **`splitFact` (src/lib/fact-select.js)** — separates quote from the trailing "— Speaker, Source, Year" credit line. 64/97 facts carry that credit → small box; 33 are 2-line derived facts → whole fact in the big box, credit box empty ("not more").
- **Player scroller** — quote in the viewport (bounce UNCHANGED per ruling), breadcrumb demoted to the footer small/light/italic; long quotes fit via a bottom fade-mask instead of a hard clip. (Breadcrumb-in-footer applied here too — assume-and-stated from Mike's general "accreditation smaller/less-dark/italic" note; easy to revert if he meant cards only.)
- **Recipe cards** — FIXED body height (150px) so cycling never resizes the card → no more masonry reflow flash; small eyebrow names the recipe, big box = quote (fade-masked), small foot = breadcrumb; **soft cross-fade in/out** (not the bounce — Mike asked softer here); **desynced** via a random 0.5–3.1s start offset so cards don't flip in lockstep; editorial blurb DROPPED.
- "A lot of cards don't scroll" = by design (only the 2 recipe cards are living; the other 47 are static tiles) — confirmed, not a bug.

Assume-and-stated for the next eyeball: recipe cards keep a small eyebrow (the recipe name) for identity; player scroller also got the breadcrumb footer.

### Stage 3 EYEBALL round 2 (2026-07-07) — two fixes, then APPROVED

- **"Can't scroll to the bottom of the page."** Diagnosed live in Mike's preview via Claude-in-Chrome: the fixed player bar is 68px, but `.hr-panel-scroll` had only 20px bottom padding — the last wall row hid behind the bar. The 2 recipe cards are the tallest cards AND sort last (ids -100/-101), so they exposed the standing DECK-SCROLL-OCCLUSION. Fix: panel bottom padding → 5.5rem desktop / 5rem mobile (clears the 68px bar; live-tested — last card then sits fully above the bar). Eases the standing occlusion issue too.
- **Credit to the RHS.** Breadcrumb right-aligned in both surfaces (`fs-crumb` margin-left:auto + right; `rc-crumb` right).
- Both CSS-only. **Mike: "Nice! Approved. Proceed." — Stage 3 EYEBALL GATE: PASS.**

## STAGE 4 — Deploy + close — DONE

- Stage 3 committed `af42808` (`e5648e6..af42808`, pushed; 8 files, +303/−49).
- Build clean (51 modules); `npx wrangler deploy` → **Version `b89cfb91`** (`b89cfb91-3eb6-46fe-8629-f760d806d747`), wrangler 4.81.1.
- **Ops live verification (Claude-in-Chrome on https://weird.baby/hr):** deployed bundle = `index-Ddp_xBq3.js` (matches build); 2 recipe cards render (eyebrows "Nick Root"/"Arkansas"); cards cycle REAL vault facts (e.g. Nick "Two weeks before he died…" + credit "— Hunter Root, Americana Highways, 2025"; Arkansas "The main reason it's titled this…" + "— Hunter Root, Whiskey Riff, 2023"); credits right-aligned; panel bottom padding 88px live; wall scrolls to the bottom with clearance below the last row (screenshot on session record). No fact tiles on the wall (structural lock holds — Stage 2 verify).
- Mike live walk: _to confirm on weird.baby (already approved on preview)._

**SHIPPED.** All four stages executed and gated; every DB write host-side by Mike; scroller look/motion preserved per ruling (player = bounce + overflow fit only; recipe cards = new soft-fade surface); facts reach visitors ONLY via scrollers/recipe cards, enforced structurally at the export SQL. 

Deferred / on the record: fact COLLECTION beyond the 97 (more recipe cards, more facts) · `hr_facts.js` unique-seed salvage brief · strict critics-only Arkansas recipe variant (BACKLOG, low/low) · breadcrumb icon (spec §6 extra credit) · font/motion polish pass once volume grows · OneDrive re-mirror of `mediavault_pre-factscroller-20260707T202907Z.sqlite`.
