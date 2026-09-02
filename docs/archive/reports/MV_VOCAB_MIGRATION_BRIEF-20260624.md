# COWORK BRIEF — MV Vocabulary Migration (EXECUTES — staged, host-coordinated)

**Status:** READY TO RUN. Execute deliberately, ONE STAGE AT A TIME, with Mike
confirming each stage gate before the next. This is NOT a read-only job — it
changes live MV data and re-exports to the client.

**Authority:** Resolutions are LOCKED per `MV_VOCAB_RECONCILE_PLAN-20260624.md`
Part E (all 10 forks resolved 2026-06-24, below). Head = **live DB** (F1).

## Locked fork resolutions (do not re-litigate)
- F0: this plan is the build-prep authority.
- F1: canonical head = live `mediavault.sqlite`. TAXONOMY_v1 = design direction;
  `tag_vocabulary.json` + client `vocabulary.json` regenerated from DB.
- F2: underscore canonical (no data change; regenerate Surface A).
- F3: demote `tag_vocabulary.json` (orphaned); regenerate from DB; drop its
  "source of truth" claim. Do NOT wire into ingest this pass.
- F4: KEEP `content_kind` and `card_kind` as-is. Correct the doc only. No rename.
- F5: retire NONE this pass except confirming already-done `unsorted`/`platform`.
  KEEP `content_kind`/`card_kind` (export/client blockers). artifact_kind + format
  retirement is DEFERRED to a later backlog item — do NOT route/retire them now.
- F6: `source` — ADD `bandcamp`; map `web`->`other`; KEEP `press` and `local`
  as distinct; DROP zero-usage `distrokid`; RE-MEASURE tag-vs-column fresh.
- F7: drop zero-usage registry stubs; rebuild `usage_count` from payloads.
- F8: inspect the 1 `presentation` artifact; fold into `attributes`.
- F9: un-retire `exhibit` (clear retired_at).
- F10: `fact` joins the `kind` COLUMN — but that is Stage 7, a SEPARATE later
  workstream, NOT part of this migration. This brief does NOT add `fact` and does
  NOT rebuild the artifacts table.

## Scope of THIS brief: Stages 0-6 and 8 only. NO table rebuild. NO fact add.

**Reach:** confirm `C:\AI\Platform\MediaVault` + `C:\AI\Projects\weird-baby-museum`
readable. Connect `C:\AI` if needed.

**Standing rules:**
- MV writes are HOST-COORDINATED. The Cowork FUSE mount has corrupted SQLite and
  large files before (per OPERATIONS hazards). For any DB write, use the safe
  pattern: operate on a `/tmp` work-copy, verify, then the HOST performs the
  in-place swap — do NOT let the mount do in-place SQLite commits. If Cowork
  cannot guarantee a safe host-side swap, STOP and hand the exact SQL to Mike to
  run host-side.
- After EVERY stage: print verification (counts, integrity_check) and WAIT for
  Mike's go before the next stage.
- Re-export rule: any stage changing a client-read namespace is not complete
  until `export-artifacts.mjs` re-runs and `src/data/exhibits/hunter_root.json`
  + `src/data/vocabulary.json` regenerate and verify.

---

## STAGE 0 — Backup (MANDATORY FIRST)
- Copy `core/mediavault.sqlite` -> `core/backups/mediavault_pre-vocab-reconcile-v2-<UTC>.sqlite`.
- Record baseline: `artifacts`=293; the namespace-occurrence counts from the plan Part B.
- VERIFY: backup opens read-only; `PRAGMA integrity_check`=ok; counts match.
- GATE: confirm backup exists + integrity ok before any write. WAIT.

## STAGE 1 — Registry flag corrections (no payload change)
- Un-retire `exhibit` (clear retired_at). Register `event`/`lineup`/`attributes`
  in `vocabulary` with proper tier/sort. Resolve `presentation` (F8: inspect the
  1 artifact, fold to `attributes`).
- VERIFY: `SELECT namespace,tier,retired_at FROM vocabulary` shows expected;
  imgserver vocab endpoint shows `exhibit` not retired + new namespaces present.
- GATE. WAIT.

## STAGE 2 — Registry usage_count rebuild + slug reconciliation (F7)
- Recompute every `tags.usage_count` from live `artifacts.tags`. Add
  used-but-unregistered slugs. Drop zero-usage stubs.
- VERIFY: each `usage_count` == json_each recount; no payload value lacks a slug.
- GATE. WAIT.

## STAGE 3 — source collapse + allowed-set correction (F6)  [EXPORT-COUPLED]
- RE-MEASURE tag-vs-column disagreement fresh; record it (supersedes stale 23/6, 3/0).
- Apply deterministic rule URL-host > source_platform column > source: tag to set
  one canonical source per artifact. Add `bandcamp`. Map `web`->`other`. Keep
  `press`,`local`. Drop `distrokid`.
- VERIFY: every artifact one resolved source; counts reconcile; RE-EXPORT; confirm
  `source_platform` in hunter_root.json unchanged for YouTube thumbnail synthesis.
- GATE. WAIT.

## STAGE 4 — bands -> band rename (D-d)  [EXPORT + CLIENT-COUPLED]
- Rewrite payload `bands:*`->`band:*` (288). Add `band` namespace; retire/rename
  `bands` row; update `tags` slugs. DO NOT touch the `lineup` value `band`.
- VERIFY: 0 `bands:` payloads; 288 `band:`; `lineup:band` intact; RE-EXPORT;
  update client BOARD_TOTAL_KEYS / tags.bands reads; filter board renders `band`.
- GATE. WAIT.  (This is the biggest single data change — verify carefully.)

## STAGE 5 — (DEFERRED per F5: artifact_kind/format retirement NOT done this pass)
- SKIP. Logged as separate backlog item. Do nothing here.

## STAGE 5b — (SKIP per F4: content_kind/card_kind kept as-is)
- SKIP.

## STAGE 6 — Regenerate downstream surfaces (F2, F3, D-k)
- Regenerate `core/tag_vocabulary.json` from reconciled DB (underscores, drop dead
  `content_type`, remove false source-of-truth claim). Re-export client
  `src/data/vocabulary.json`. Rewrite `TAXONOMY_v1.md` to DESCRIBE the reconciled
  DB: correct the `source` allowed-set (add bandcamp etc.), and correct the
  "Retired namespaces" list to reflect what is ACTUALLY retired (unsorted,
  platform) vs merely targeted (content_kind, card_kind, artifact_kind, format
  remain LIVE).
- VERIFY: all four surfaces agree on namespace membership + value format.
- GATE. WAIT.

## STAGE 8 — Final re-export + client verification
- Final `export-artifacts.mjs` run; regenerate client `vocabulary.json`;
  smoke-test client: filter board, album/gallery containers, content-variant
  badge, source facet, band facet.
- VERIFY: client renders all reconciled namespaces; no console errors; review
  snapshot diff.
- GATE: Mike confirms live behavior unchanged where intended; commit + push +
  deploy is HOST-side, Mike's.

---

## Output
- A run-log file `MV_VOCAB_MIGRATION_LOG-20260624.md` capturing: backup path,
  before/after counts per stage, the fresh source disagreement measurement, every
  SQL/edit applied, and verification output per stage.
- All DB writes via the safe host-coordinated pattern. N
  o `fact` Kind. No table rebuild. Those are the next, separate workstream.

**This migration changes live data and the deployed client. Run it as its own
focused session, stage-gated, backup confirmed first.**
