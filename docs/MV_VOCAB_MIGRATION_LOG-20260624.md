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

**Gate:** _verification green; awaiting Mike's explicit "pass"_

---

## STAGE 1 — Registry flag corrections

_Not started. Blocked on Stage 0 pass._

## STAGE 2 — usage_count rebuild + slug reconciliation

_Not started._

## STAGE 3 — source collapse + allowed-set (fresh disagreement measurement to be recorded here)

_Not started._

## STAGE 4 — bands -> band rename

_Not started._

## STAGE 5 / 5b — SKIPPED per locked F5/F4 (logged as separate backlog item)

## STAGE 6 — Regenerate downstream surfaces

_Not started._

## STAGE 8 — Final re-export + client verification

_Not started._
