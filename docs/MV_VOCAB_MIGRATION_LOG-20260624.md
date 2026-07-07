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

## STAGE 3 — source collapse + allowed-set (fresh disagreement measurement to be recorded here)

_Not started._

## STAGE 4 — bands -> band rename

_Not started._

## STAGE 5 / 5b — SKIPPED per locked F5/F4 (logged as separate backlog item)

## STAGE 6 — Regenerate downstream surfaces

_Not started._

## STAGE 8 — Final re-export + client verification

_Not started._
