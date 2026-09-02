# MV Vocabulary Migration — RUN LOG

**Brief:** `MV_VOCAB_MIGRATION_BRIEF-20260624.md` · **Authority:** `MV_VOCAB_RECONCILE_PLAN-20260624.md` Part E (10 forks LOCKED)
**Run date:** 2026-07-06 · **Executor:** Ops (Claude, Cowork) · **Host execution + gates:** Mike
**Pattern:** ALL DB writes host-side pwsh (virtiofs cannot do SQLite journaled writes); paste-back verified; commit gate per stage; explicit "pass" from Mike required at every gate.

Stage sequence per brief: 0, 1, 2, 3, 4, (5/5b SKIP per F5/F4), 6, 8. No table rebuild. No `fact` add.

---

## STAGE 0 — Backup (MANDATORY FIRST)

- Script: `tools/mv_vocab_stage0_backup.ps1` (written this session; Mike runs host-side, MV server stopped).
- Writes: `core/backups/mediavault_pre-vocab-reconcile-v2-<UTC>.sqlite` (+ throwaway verifier in %TEMP%). `core/backups/` is gitignored by policy; durable home = OneDrive mirror.
- Verification to capture from paste-back: backup path; SRC/DST byte + sha256 match; `PRAGMA integrity_check` = ok on the BACKUP opened read-only; artifacts count vs 293; namespace occurrence counts vs 2026-06-24 plan baseline; git status/log both repos.

**Paste-back (2026-07-07T01:05Z, verified):**

- Backup: `core/backups/mediavault_pre-vocab-reconcile-v2-20260707T010514Z.sqlite`
- SRC/DST both 1,953,792 bytes; sha256 both `AB33E23ACC93DB4AC90759D74E8923B4911B05117D499F1EE011BD3C6A385C68`; no WAL/SHM present.
- Backup read-only open: `integrity_check=ok`; `artifacts=293`; kind column 146 filled.
- Namespace occurrences ALL match the 2026-06-24 plan baseline exactly: exhibit 293, bands 288, source 239, content_kind 175, attributes 121, artifact_kind 55, event 32, lineup 27, format 24, card_kind 10, presentation 1. (Non-ledgered namespaces also present: album 246, type 187, song 186, scope 180, author 179, year 178, era 49, topic 35, people 23, release_type 3, venue 2.)
- DB is byte-identical in intent to the 2026-06-24 snapshot state — plan figures remain live truth.
- Git at gate: MV clean at `e042b18`; WBM at `30ecba1` with 2 expected untracked files (this log + stage0 script) — committed at this stage's commit gate.

**Commit gate:** `4eced72` pushed to origin/main (`30ecba1..4eced72`); `status --short` clean post-commit.

**Gate:** **PASS** (Ops verification verdict, 2026-07-07; Mike delegated the pass call to the verifier — "You say pass, not me!"). Mike retains execution control: every subsequent write runs host-side by him.

---

## STAGE 1 — Registry flag corrections

Ground-truth reads (this session, read-only): `vocabulary` = 19 rows; tier-3 sort_orders occupied 1–6 → `event`/`lineup`/`attributes` assigned tier 3, sort 7/8/9 (TAXONOMY_v1: event/lineup = promoted Tier-3 axes, attributes = Tier-3 flat bag). `presentation` payload = exactly 1: `presentation:link` on `MV-HR-20260405-004` → folds to `attributes:link` (locked F8); `presentation` gets NO vocabulary row. `exhibit` retired_at `2026-05-19T01:06:41.000Z` → cleared. `updated_at` deliberately untouched on the folded artifact. `tags`-registry slug sync (attributes:link registration, counts) deliberately deferred to Stage 2 per brief.

- Scripts: `tools/mv_vocab_stage1a_registry.ps1` (DB write, server stopped; precondition-guarded, aborts clean) + `tools/mv_vocab_stage1b_endpoint.ps1` (read-only /api/tags check, server running).

**Paste-back (2026-07-07, verified):**

- 1a: all preconditions held; post-commit vocabulary shows `event`(3,7) `lineup`(3,8) `attributes`(3,9) registered, `exhibit` retired_at=NULL, `unsorted`/`platform` still retired (correct per F5). `presentation:` payloads 0; `attributes:link` payloads 1; MV-HR-20260405-004 now 13 tags with fold applied, all other tags byte-identical incl. `lineup:solo` + both `event:` values. artifacts=293; integrity_check=ok. MV git clean at `e042b18` (DB untracked).
- 1b (server running): `/api/tags` shows exhibit `namespace_retired_at: None` (tier 99 = server-side NULL coalesce; exhibit's tier was NULL pre-retirement, brief ordered flag-clear only); event/lineup/attributes present tier 3; presentation ABSENT.

**Gate: PASS** (Ops verdict per delegated pass-call).

## STAGE 2 — usage_count rebuild + slug reconciliation

Stage 1 commit gate first: `e685cff` pushed (`4eced72..e685cff`), status clean.

Dry-run (read-only, 2026-07-07, post-Stage-1 state confirmed fresh through mount): registry 247 slugs vs 210 distinct payload slugs; 180 already correct. Diff: **16 adds** (used-but-unregistered: attributes:link, card_kind:gallery, content_kind:announcement/music/performance, era:breakthrough/rwth, format:photo/text/video/web, source:other, topic:gear/recording/songwriting/touring), **53 drops** (all zero-usage: 48 decomposed `unsorted:*`, 5 TAXONOMY_v1 album stubs, source:distrokid — F7 pre-empts that piece of F6), **14 count fixes** (incl. bands:hunter_root 283→284, exhibit:hunter_root 292→293, content_kind:studio 78→79 — the exact D-g drift). Post: 247−53+16 = 210, closes exactly.

- Script: `tools/mv_vocab_stage2_registry_rebuild.ps1` — recomputes from payloads at run time, pinned to 16/53/14; aborts clean on drift. Adds use registry convention (display_name NULL, created_at 'YYYY-MM-DD HH:MM:SS' UTC).

**Paste-back (2026-07-07, verified):** applied exactly the dry-run diff — 53 drops / 16 adds / 14 fixes, lists byte-matching the dry run. Closure: registry 210 slugs; count mismatches 0; unregistered payload slugs 0; zero-usage rows 0; artifacts 293; integrity_check ok. MV git clean at `e042b18`. (Harmless `utcnow` DeprecationWarning in worker; no effect.)

**Gate: PASS.**

## STAGE 3 — source collapse + allowed-set (F6)

Stage 2 commit gate first: `be2a857` pushed (`e685cff..be2a857`), status clean.

**FRESH tag-vs-column disagreement measurement (2026-07-07, read-only; supersedes stale 23/6 and 3/0): 14.** Breakdown: 12 = the 2026-06-17 press batch (`source:web` tag vs `press` column, no URL — column wins, per F6 keep-press); 2 = URL-host overrides stray tags (MV-HR-20260405-008 tiktok-tag→facebook, MV-HR-20260405-014 instagram-tag→facebook).

Resolution simulation under locked rule (URL-host > column > tag): provenance URL 124 / column 150 / tag 0; **zero non-NULL column changes** — the column already obeys the rule. 19 artifacts have no URL-host, NULL column, no tag — all local-drop/cowork vaulted assets (8 ALBUM containers, phone-recording batch, local drops): **assume-and-stated → `local`** (the F6-kept value that accurately describes them; fills the NULL column). Final distribution (sum 293): youtube 105, bandcamp 79, reverbnation 42, local 31, facebook 16, press 12, other 7, instagram 1. YouTube column set unchanged (105; 48 of them released → thumbnail synthesis unaffected). Tag rewrites: 49 + 19 = 68 artifacts end with exactly one `source:` tag agreeing with the column. Registry sync in-script (new slugs source:facebook/press/local; source:web + source:tiktok drop to 0 → dropped; counts fixed).

- Scripts: `tools/mv_vocab_stage3a_source.ps1` (DB write, server stopped; pinned to 14 disagreements + the exact 19-id local set + exact final distribution, aborts clean on drift) + `tools/mv_vocab_stage3b_export_verify.ps1` (server running: re-export, then HEAD-vs-new diff proving the youtube source_platform set unchanged).

**Paste-back (2026-07-07, verified):**

- 3a: 68/68 tag updates; registry adds source:facebook/local/press, drops source:tiktok/web, fixes instagram→1 (stray tag on -014 became facebook per URL-host; remaining 1 = the instagram-column artifact), other→7, youtube→105. Post: 293/293 one-tag + tag==column agreement; column and tag distributions identical (youtube 105, bandcamp 79, reverbnation 42, local 31, facebook 16, press 12, other 7, instagram 1); 19 fills all local; whole-registry 0/0/0; artifacts 293; integrity ok.
- 3b: export clean (33 artifacts, 199,425 bytes; vocabulary 22 rows = 19 + Stage-1's event/lineup/attributes). source_platform diffs = exactly the 10 released local-fills (None→local). **Anomaly chased before verdict:** verifier reported youtube set "unchanged (0 ids)" — vacuous, because youtube artifacts surface as track renditions (ytId), never as (id,source_platform) records; identical structure in HEAD. Real youtube surface verified directly: i.ytimg.com thumbnail set md5-identical HEAD vs new; ytId count 47=47 **host-side** (a sandbox-mount read said 46 — mount read-lag hazard confirmed live; host is truth, per OPERATIONS §8).

**Gate: PASS.**

## STAGE 4 — bands -> band rename (D-d)

Stage 3 commit gate first: `8a5457b` pushed (`be2a857..8a5457b`), status clean.

Coupling ground-truth (this session): `export-artifacts.mjs` contains ZERO literal `bands` — it groups tags by namespace generically, so the export needs no code change. Client dimensions/pills are DYNAMIC (`buildDimensions` from artifact namespaces; HrExhibitFlow.jsx:63-67) — the pill column renames itself on re-export. The only hardcoded functional read: `BOARD_TOTAL_KEYS` (HrExhibitFlow.jsx:201). `hunter-root-spine.js`: no bands reads. MV-side: `attention_rules.py` `CATEGORY_BANDS="bands"` is a dead backward-compat alias (defined, imported nowhere) — no edit. Comment at HrExhibitFlow.jsx:249 is historical narrative — left as history.

- Client edit (host-side file tools, surgical): `BOARD_TOTAL_KEYS` "bands"→"band" + the two current-state comments (199, 535); rename annotated in-line.
- Scripts: `tools/mv_vocab_stage4a_band_rename.ps1` (DB write, server stopped; pinned to 284+4=288 payloads, vocabulary bands=(1,6,None), registry {284,4}; renames vocabulary row bands→band/Band keeping tier/sort; renames 2 registry slugs; lineup:band untouchable and asserted 12 before AND after) + `tools/mv_vocab_stage4b_export_verify.ps1` (server running: re-export; verifies 0 "bands" keys / 0 bands: strings in hunter_root.json, band namespace present in vocabulary.json, bands absent).
- Filter-board render check ("board renders band") lands in Stage 8's client smoke test, per plan.

**Paste-back (2026-07-07, verified):**

- 4a: 288 occurrences replaced across 288 artifacts (no artifact carried both band tags); 0 `bands:` remaining; band:hunter_root 284 / band:medusas_disco 4; lineup:band 12 before and after; vocabulary `('band','Band',1,6,None)`, no bands row; whole-registry 0/0/0; artifacts 293; integrity ok.
- 4b: export clean (33 artifacts, 199,282 bytes; vocabulary 22 rows). hunter_root.json: 0 `"bands"` keys, 141 `"band"` keys, 0 `bands:` strings (`band:hunter_root strings: 0` is correct — export emits namespace-grouped keys, not raw ns:value strings; old file identical in this respect). vocabulary.json: band present, bands absent. Documented-harmless UV_HANDLE_CLOSING assertion appeared post-completion, as OPERATIONS §8 predicts. Diff shape: hunter_root.json 284 lines churned (the rename), vocabulary.json 6, HrExhibitFlow.jsx 7 (BOARD_TOTAL_KEYS + comments).

**Gate: PASS.**

## STAGE 5 / 5b — SKIPPED per locked F5/F4 (logged as separate backlog item)

## STAGE 6 — Regenerate downstream surfaces (F2, F3, D-j, D-k)

Stage 4 commit gate first: `072c577` pushed (`8a5457b..072c577`), status clean. Stages 5/5b SKIPPED per locked F5/F4 (artifact_kind/format routing logged as backlog; content_kind/card_kind kept).

File regenerations (host-side file tools, this session; mount freshness probed — band 288 visible before generating from DB):

- **Surface A `core/tag_vocabulary.json`:** fully regenerated from the reconciled DB (v2.0). False "source of truth" claim replaced with explicit NON-AUTHORITATIVE banner (F3: demoted, not wired into ingest). Underscores throughout (F2). Dead `content_type` category gone (D-b). All 20 live namespaces with tier/sort/values mirroring vocabulary+tags tables; `kind_column` block kept (mirrors the CHECK; notes fact = later workstream per F10); id_format/thumbnail operational blocks kept unchanged.
- **Surface B `docs/taxonomy/TAXONOMY_v1.md`:** rewritten as-built. Membership lists corrected to live (band incl. medusas_disco; album 11 values, stubs noted dropped; song 78; year 2017–2025; people 11; venue 2; era/topic noted). `source` section records the APPLIED collapse + corrected allowed set (bandcamp/press in, distrokid/tiktok/web out) + the fresh 14/0 measurement superseding 23/6 and 3/0. `type` dedupe marked TARGET (audio+mp3 both still live). Retired-namespaces section corrected: actually retired = unsorted + platform only; content_kind(175)/card_kind(10, unregistered by design)/artifact_kind(55)/format(24) marked NOT retired with v1 routing as TARGET (F5); exhibit un-retire recorded (F9).
- **Surface D `src/data/vocabulary.json`:** already regenerated by the Stage 4b export from the reconciled DB (22 rows); no DB changes since — final regeneration confirmation lands in Stage 8's export.

- Script: `tools/mv_vocab_stage6_verify.ps1` (READ-ONLY) — four-surface agreement: A namespaces/values == DB live registry exactly; D rows == all 22 vocabulary rows with agreeing retired flags; 0 hyphenated registry values; B anchor checks; card_kind expected as the one payload namespace unregistered in `vocabulary` (by design this pass).

**Paste-back (2026-07-07, verified):** DB 22 rows / 20 live; 21 namespaces with registry values (20 live + card_kind; the 2 retired rows hold none); 0 hyphens. A ≡ DB live exactly (no namespace or value-set deltas). D ≡ all 22 rows, retired flags agree. All 7 B anchor checks OK. card_kind flagged exactly as designed. Git snapshot: MV shows the 2 regenerated surfaces modified; WBM shows log + verify script.

**Gate: PASS.** Commit gate spans BOTH repos (first MV-repo commit of the run).

## STAGE 8 — Final re-export + client verification

Stage 6 commit gates first: MV `15e5bda` (`e042b18..15e5bda`), WBM `a7b8d62` (`072c577..a7b8d62`), both clean.

Plan: (8a) final export — DB unchanged since Stage 4's export, so the two data files must come back byte-identical (idempotence check) — then clean production build (`Remove-Item dist` first, standing rule). (8b) Mike's client smoke test on the local preview: filter board renders **Band** column (band facet), album/gallery containers, content-variant badge, source facet incl. the new local/press/facebook values, no console errors. (8c) on Mike's live-behavior confirmation: deploy (wrangler 4.81.1) + final commit.

- Script: `tools/mv_vocab_stage8a_final_export_build.ps1`.

**Paste-back 8a (2026-07-07, verified):** export clean (33 artifacts / 199,282 bytes / 22 vocab rows — byte counts identical to Stage 4b). Idempotence check showed a 1-line diff per data file — **chased, not waved through:** both diffs are line 4 `"exported_at"` (the exporter stamps run time). Content-level idempotence holds; the "expect NO diff" phrasing in the script was miscalibrated against a self-stamping exporter. Clean build: 48 modules, no errors, fresh dist (27 files). Refreshed-timestamp files ride the final commit.

**8b (Mike's client smoke test, local preview — verified via screenshots):** filter board renders **Band** column (Hunter Root, 32 — one exported artifact carries no band tag, same as pre-migration); album containers render (Arkansas tracklist); content-variant badge live ("Silver Lining OFFICIAL"); source facet shows reconciled values incl. new `local`(10), counts sum to 33. **"Only one band" finding chased:** all 4 `band:medusas_disco` artifacts are unreleased vault items (the 2026-06-17 press batch) — never exported; pre-migration export's `bands` key also carried only hunter_root values, so live behavior is IDENTICAL, not a regression. Medusa's Disco appears automatically when its artifacts release. Press absent from source facet for the same reason.

**8c (deploy + live walk):** wrangler 4.81.1 confirmed; deployed the exact smoke-tested dist; Version `ffcf7fbd-1b59-4198-ad17-b912fe62ab1f`; 2 assets updated (index.html + index-CP2I3FS8.js). Mike's incognito walk on weird.baby/hr: wall renders, filter board + Band column + reconciled source facet live; only visible blemish = DECKBUG-FBBLOCKS (pre-existing known issue, unrelated). (`deployments list` tail showed a stale 2026-06-12 record — truncated-list display quirk; deploy output + incognito walk are the authoritative proof.)

**Gate: PASS — MIGRATION COMPLETE.** Stages 0–4, 6, 8 executed; 5/5b skipped per locked F4/F5; no table rebuild; no `fact` add. All ten fork resolutions honored as locked. Backup retained at `core/backups/mediavault_pre-vocab-reconcile-v2-20260707T010514Z.sqlite`.
