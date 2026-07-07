# DERIVED_ERA_REWIRE-20260707 — Run Log
Brief: `docs/DERIVED_ERA_REWIRE_BRIEF-20260707.md` · Authority: WIP state > spec v0.2 > pretest report > brief.
Session 1 (Cowork, 2026-07-06/07): Stages 1–2 executed, Stages 3–4 prepared. Ops-Claude; delegation per standing arrangement (verification gates delegated, clean = pass; UX gates Mike's).

---

## Stage 1 — Ground-truth delta · GATE: PASS (delegated, clean)

Every claim below verified THIS session against live MV (host copy → /tmp, integrity ok) and git HEAD blobs (sandbox working-tree reads were untrustworthy — see anomalies).

**(a) Actually done (WIP claims that held):**
- `referenced_dates` column EXISTS on live MV artifacts (297 rows, all NULL). Migration NOT pending. **Do not re-run migrate-referenced-dates.mjs.**
- All 7 parked WIP files byte-identical to HEAD (git hash-object pins recorded in stage3 script).
- **Pretest re-run against TODAY'S live MV: all proofs PASS, identical to the 6/17 oracle** — 187 leaves; correctness proof 37 hand-tagged / 0 mismatches; rwth fold 15/15 → early_days; underivable 0; histogram 389 weights / 70 distinct / 0.77–2.00; depth counts shallow 39/36/20/42/50 · medium 40/40/20/66/50 (29 multi) · deep 40/40/20/67/50 (30 multi). The vocab migration (bands→band, source collapse) and fact pilot (4 vault-status rows, excluded by the released filter) did not disturb derivation inputs.
- 6/17 client revert HELD: HEAD `HrExhibitFlow.jsx` + `export-artifacts.mjs` carry no era/date/slider wiring; `hunter_root.json` bakes legacy `tags.era` (22 of 33 top-level), no `dates`.

**(b) Tree drift since 6/17 that changes the plan:** `buildDimensions` was extracted from `HrExhibitFlow.jsx` into `src/routes/hr/hr_dimensions.js`. The re-wire needs NO edit there — era is discovered from derived `tags.era` like any facet. Era pill ordering stays alphabetical (pre-existing behavior; chronological ordering would be a separate UX call).

**(c) Stage 0 backup: NOT REQUIRED** — no DB write anywhere in this workstream.

**(d) Fixed depth resolves to cutoff 0.5** ("medium"; threshold = 0.5 × publishWeight 2.0), housed as `FIXED_ERA_DEPTH` at the single client call site in `HrExhibitFlow.jsx` — NOT in era-config.json (brief premise corrected: era-config.json is the export-side registry; the client never imports it). Value + home subject to Mike's veto at the Stage 4 gate.

**(e) Files touched:** client: `HrExhibitFlow.jsx` (3 anchored edits), NEW `src/routes/hr/hr_era.js`, NEW `src/data/era-buckets.json`. Export side: `tools/export-artifacts.mjs` (12 anchored edits), NEW `tools/era-derivation.mjs`, `tools/era-pretest.mjs`, `tools/era-export-verify.mjs`, `tools/migrate-referenced-dates.mjs` (reference only), root `era-config.json`. Untouched: `hr_dimensions.js`, `matchFilter`, `Exhibit.jsx`, all CSS (no slider = no styles).

**Anomalies (documented-hazard class, non-blocking):** (1) sandbox FUSE mount served truncated working-tree reads all session (`hunter_root.json` 193,857B unparseable via mount vs 195,905B clean at HEAD; the freshly patched export unreadable through the mount minutes after host-side edit) — OPERATIONS §8 read-lag, host is truth, stage scripts re-verify everything host-side; (2) sandbox `git status` showed phantom noise (`UU ./`, phantom deletions) — host-side `git status` at the top of stage 3 is the true view; (3) DB-wide era: slugs count 52 with rwth=17 (vs 15 in the exported population) — the extras sit in vault/inbox rows outside the export filter; not a divergence.

## Stage 2 — SKIPPED (per Stage 1: no pending data work; column applied; derivation is export-time, inferred weights never stored).

## Stage 3 — PREPARED (Ops), execution + gate pending (Mike)

- `tools/export-artifacts.mjs` patched host-side (12 anchored edits, marker-verified): bakes `dates` per leaf incl. album track heads + gallery items (`era-derivation.mjs`, registry `era-config.json`), STRIPS baked `tags.era`, containers exempt, `era_override` bakes through from `referenced_dates`, underivable warning guard in summary, `derived_era` metadata marker, SQL pulls extended with `extracted_text, referenced_dates`.
- NEW `tools/era-export-verify.mjs`: per-artifact export-vs-oracle comparison (dates equality + era at all 3 depths per id + no baked era + containers exempt + no empty date-sets). Divergence = exit 1 = STOP.
- **Sandbox integration test (full rig: patched export + better-sqlite3 shim + live-MV copy over HTTP): PASS.** 33 artifacts, 0 underivable, era label absent, and all 132 exported leaves matched a fresh pretest oracle EXACTLY (dates + shallow/medium/deep). Deck-level sim at depth 0.5: 23/23 top-level leaves carry era (was 22 baked), 3 multi-era cards, pills {early_days 3, finding_the_sound 4, breakthrough 3, on_the_road 11, recent 5}, the 10 era-less records are exactly the 10 containers.
- **Mike runs:** `pwsh docs/derived-era-WIP/derived_era_stage3.ps1` (from repo root, MV running). It self-verifies (hash pins, truncation sentinels), places the parked files, runs export → pretest proofs → oracle comparison, aborts loudly on any divergence. GATE: paste full output back; commit with the printed explicit-path command after pass.

## Stage 4 — PREPARED (Ops), execution + gate pending (Mike, UNDELEGATED)

- **Mike runs (only after Stage 3 gate):** `pwsh docs/derived-era-WIP/derived_era_stage4.ps1`. Three anchored verify-or-abort edits to `HrExhibitFlow.jsx`: hr_era import; existing module-load map renamed `FB_ARTIFACTS`; new map derives `tags.era = eraForRecord(a, 0.5)` before `buildDimensions`. Expected line delta +23; script refuses to write on any anchor/count mismatch; restore = `git checkout -- src/routes/hr/HrExhibitFlow.jsx`.
- **GATE (Mike's, UX-visible):** local render → /hr → Filters. Era pills populate with real counts, 5 eras, no rwth, multi-era artifacts under each era they touch, nothing regressed. Expected pill counts above. Build note: `hr_era.js` uses `import … with { type: "json" }` — expected fine under Vite 8/Node 22; if the build trips on it, STOP and paste the error back (do not hand-patch).

## Stage 5 — pending: dist clean-remove → build → preview → deploy → verify live → STATE.md (SHIPPED block; remove NEXT #5; flip press-batch gate to UNBLOCKED) → this log closed with paste-backs + hashes → session-close clean.

## Out-of-scope confirmations (stop conditions honored)
- No era slider / variable-depth UI anywhere in the diff.
- No vocabulary change: MV vocabulary/tags tables untouched; exported `vocabulary.json` regenerates with only its timestamp differing; era: slugs stay in MV as curation inputs.
- No DB write; no client-source write from the sandbox (client edits land only via Mike-run scripts; export/verify tooling was written via host-side file tools and is marker+sentinel-verified by the stage script before use).
