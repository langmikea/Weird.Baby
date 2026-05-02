# DECISION_INDEX.md (v0.1)

**Filed:** 2026-04-27 (Phase 4 v0.1 build, system review bite 14)
**Status:** locked
**Status set:** 2026-04-27
**Type:** Curated catalog of decision-bearing docs. Hand-maintained.
**Predecessor design:** `docs/PHASE4_LOCATABLE_DESIGN.md` v0.1.
**Companion files:** `docs/STATUS_SURFACE.md` (parallel sibling — components catalog), `docs/PROCESS_NOTES.md` §"Locating past decisions" (the discipline that consumes this index), `docs/SESSION_INTENT_VOCABULARY.md` (parallel sibling — intents catalog).

---

## What this is

The decision index answers one question: *where is the load-bearing
decision on topic X documented, and is it current.* It exists to
close the C2 gap from `docs/BITE3_TARGET_STATE_DESIGN.md` —
locatable knowledge.

The index is curated, not exhaustive. Per `PHASE4_LOCATABLE_DESIGN.md`
v0.1 §3 Mike-call #1, indexed docs are **decision-bearing**: phase
designs, BITE designs, locks, specs, standing-process, vision.
Session-close briefs, backlogs, implementation files are *not*
indexed. The convention pointer for session-close briefs is filed
under Process / discipline below.

Read order: scan topics; within topic, current-authoritative
listed first, predecessors and superseded entries after. Currency
markers (§"Currency markers" below) are visible at a glance.

**Mode:** active. Maintained per the close-brief reconciliation
pattern.

---

## Currency markers

Four states, asserted by the doc and mirrored here. Per
`PHASE4_LOCATABLE_DESIGN.md` §4:

- **`draft`** — decision-shape exists; not yet Mike-locked.
- **`locked`** — Mike has reviewed; current authoritative state.
- **`superseded`** — a later doc carries the now-current decision; the doc is preserved (history matters); pointer to the successor in the row.
- **`archived`** — quarantined or mothballed; preserved but no longer load-bearing.

Currency in this index mirrors the Status header block in each
indexed doc. Sync at session close, same pattern as
`STATUS_SURFACE.md` reconciliation.

---

## Museum architecture

| Doc | Path | Currency | What this decides | Filed |
|---|---|---|---|---|
| VISION_LOCK_v0.3 | `docs/canonical/VISION_LOCK_v0.3.md` | locked | Constitutional spec — room model, rules | 2026-04-21 |
| VISION | `docs/canonical/VISION.md` | locked | Voice, why, who we're building for | 2026-04-14 |
| COMPONENT_PHILOSOPHY | `docs/COMPONENT_PHILOSOPHY.md` | locked | How everything looks and behaves | 2026-04-10 |
| STRATEGY_weird_baby_infrastructure | `docs/STRATEGY_weird_baby_infrastructure.md` | locked | Infrastructure strategy framing | 2026-04-14 |

---

## Controls surface

| Doc | Path | Currency | What this decides | Filed |
|---|---|---|---|---|
| UX_CONTROLS_SPEC_v0.3 | `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` | locked | Controls surface spec (current) | 2026-04-24 |
| FILTER_LOGIC_DECISION | `docs/FILTER_LOGIC_DECISION.md` | locked | Filter logic — within-OR / across-AND / empty-silent | 2026-04-23 |
| KALEIDOSCOPE_v3_DECISIONS | `docs/KALEIDOSCOPE_v3_DECISIONS.md` | archived | Kaleidoscope decisions — mothballed for v1 | 2026-04-24 |
| WRAP_PROBABILITY_ANALYSIS | `docs/WRAP_PROBABILITY_ANALYSIS.md` | locked | Wrap analysis — supports watch-list #11 deferral | 2026-04-23 |
| FILTER_PROBLEM_BRIEF | `docs/FILTER_PROBLEM_BRIEF.md` | superseded | Predecessor problem framing → `FILTER_LOGIC_DECISION.md` | 2026-04-23 |
| UX_CONTROLS_SPEC_v0.2 | `docs/archive/UX_CONTROLS_SPEC_v0.2.md` | superseded | Predecessor spec → `UX_CONTROLS_SPEC_v0.3` | 2026-04-23 |

---

## Exhibit components

| Doc | Path | Currency | What this decides | Filed |
|---|---|---|---|---|
| FEATURE_fan_playlists | `docs/FEATURE_fan_playlists.md` | locked | Fan playlists feature decisions | 2026-04-14 |
| PANEL3_ARTIFACTS_SPEC_v0.1 | `docs/PANEL3_ARTIFACTS_SPEC_v0.1.md` | draft | P3 Artifacts spec — currency unverified at v43; pre-system-review filing; consider liveness check post-launch | 2026-04-12 |

---

## Data layer

| Doc | Path | Currency | What this decides | Filed |
|---|---|---|---|---|
| MUSEUM_DATA_CONTRACT | `docs/MUSEUM_DATA_CONTRACT.md` | locked | Data contract for artist configs | 2026-04-24 |
| CONTRACT_video_kind_fix | `docs/CONTRACT_video_kind_fix.md` | locked | Video kind contract fix | 2026-04-24 |
| HR_VIDEO_MIGRATION | `docs/HR_VIDEO_MIGRATION.md` | locked | HR video migration plan | 2026-04-24 |
| MV_INTAKE_REQUIREMENTS | `docs/MV_INTAKE_REQUIREMENTS.md` | locked | MediaVault intake requirements | 2026-04-24 |

---

## System review foundation

| Doc | Path | Currency | What this decides | Filed |
|---|---|---|---|---|
| GATE1_ACCEPTANCE_CRITERIA | `docs/GATE1_ACCEPTANCE_CRITERIA.md` | locked | The seven C-criteria | 2026-04-25 |
| BITE2_INVENTORY_DIAGNOSIS | `docs/BITE2_INVENTORY_DIAGNOSIS.md` | locked | System inventory + gap diagnosis | 2026-04-25 |
| BITE3_TARGET_STATE_DESIGN | `docs/BITE3_TARGET_STATE_DESIGN.md` | locked | Target states for the seven criteria | 2026-04-25 |
| BITE4_MIGRATION_PLAN | `docs/BITE4_MIGRATION_PLAN.md` | locked | Phase sequence + dependency graph | 2026-04-25 |
| PHASE1_PREFLIGHT_DESIGN | `docs/PHASE1_PREFLIGHT_DESIGN.md` | locked | Pre-flight v0.1 design | 2026-04-25 |
| PHASE1V02_DESIGN | `docs/PHASE1V02_DESIGN.md` | locked | Pre-flight v0.2 — monitoring mode | 2026-04-26 |
| PHASE2_STATUSSURFACE_DESIGN | `docs/PHASE2_STATUSSURFACE_DESIGN.md` | locked | Status surface design | 2026-04-26 |
| PHASE3_BOOTSTRAP_DESIGN | `docs/PHASE3_BOOTSTRAP_DESIGN.md` | locked | Bootstrap v0.1 design | 2026-04-26 |
| PHASE4_LOCATABLE_DESIGN | `docs/PHASE4_LOCATABLE_DESIGN.md` | locked | This phase — locatable knowledge / decision index design | 2026-04-26 |
| PHASE1V03_DESIGN | `docs/PHASE1V03_DESIGN.md` | locked | Pre-flight DECISION-INDEX section design (v0.3) | 2026-04-27 |
| PHASE1V04_PATCH | `tools/preflight/preflight.py` REFS section | locked | Section-aware skip for documented non-references — patch-only, no design doc per v45 Decision 1 | 2026-04-30 |
| SYSTEM_REVIEW_SCOPE_NOTES_2026-04-25 | `docs/SYSTEM_REVIEW_SCOPE_NOTES_2026-04-25.md` | locked | System review scope framing | 2026-04-25 |
| SYSTEM_REVIEW_COMPLETE | `docs/SYSTEM_REVIEW_COMPLETE.md` | locked | Transition artifact — Built/Deferred/Retired record; system review closes at v46 | 2026-04-30 |

---

## Process / discipline

| Doc | Path | Currency | What this decides | Filed |
|---|---|---|---|---|
| PROCESS_NOTES | `docs/PROCESS_NOTES.md` | locked | Working conventions for Bit-Man sessions | 2026-04-26 |
| SESSION_INTENT_VOCABULARY | `docs/SESSION_INTENT_VOCABULARY.md` | locked | Seven session intents + slice composition rules | 2026-04-25 |
| STATUS_SURFACE | `docs/STATUS_SURFACE.md` | locked | Components catalog (parallel sibling to this index) | 2026-04-26 |
| BIT_MAN_NOTES | `docs/BIT_MAN_NOTES.md` | locked | Operating frame — life goals, tough-love, working substrate | 2026-04-24 |
| BIT_MAN_NOTES_UPDATE_2026-04-25 | `docs/BIT_MAN_NOTES_UPDATE_2026-04-25.md` | locked | Morning-after addendum — bite-size rule, receipts discipline | 2026-04-25 |
| CRUISE_NOTES_2026-05 | `docs/CRUISE_NOTES_2026-05.md` | draft | Pre-trip scaffold for extended thinking-time threads | 2026-04-27 |
| SESSION_CLOSE_v44_post_close_amendment | `docs/SESSION_CLOSE_v44_post_close_amendment.md` | locked | Post-close catches — v(N+1) menu/bootstrap discipline + aphantasia-aware-content discipline | 2026-04-27 |
| DECK_TALK_2026-04-24 | `docs/DECK_TALK_2026-04-24.md` | locked | Relationship-texture frame — kindness as substrate | 2026-04-24 |
| BREACH_LOG | `docs/BREACH_LOG.md` | locked | Breach event log (interim persistence carrier) | 2026-04-25 |
| DECISION_INDEX | `docs/DECISION_INDEX.md` | locked | This doc — catalog of decision-bearing docs | 2026-04-27 |

**Convention pointer — session-close briefs.** Session close briefs
are not indexed per-instance. The active brief is the most recent
`SESSION_CLOSE_v<N>.md` in `docs/`; older briefs move to
`docs/archive/` after rotation. The convention is documented in
`PROCESS_NOTES.md` §"Session close — problem-state briefs."

---

## Backstage

*(no entries in v0.1)*

Known mothballed specs (e.g., HomesteadInstagram from project memory)
are not yet surfaced on disk in this project's `docs/` tree. This is
a filing-gap candidate per `PHASE4_LOCATABLE_DESIGN.md` §6 (Tier-3
finding). Filing the missing specs would surface them here under
this topic.

---

## Out of scope (v0.1)

Per `PHASE4_LOCATABLE_DESIGN.md` §"Out of scope":

- **Mechanizing the index** — v0.1 is hand-curated. Auto-generation
  from doc headers is a v0.2+ candidate.
- **Indexing every doc** — session closes, backlogs, implementation
  files stay out. Re-scoping is a vocabulary-growth question.
- **Auto-currency-detection** — currency is asserted in the doc and
  mirrored here. Filesystem-derived currency (mtime-based, etc.)
  is out of scope.
- **Cross-project indexing** — Weird.Baby Museum docs only.
  MediaVault, Hunter Root, Lancaster Property each have their own
  retrieval patterns.
- **Index integration into per-intent slices** — `SESSION_INTENT_VOCABULARY`
  doesn't include this index in any slice yet. v0.2+ candidate.
- **Searchability tooling** — plain markdown; tier-1 grep handles
  search.
- **`C:\AI\` top-level orphans** — files like `UX_SPEC_v0.3.md`,
  `WEIRDBABY_PORTFOLIO_STATE_v0.1.md`, `SESSION_HANDOFF.md`,
  `NEXT_THREAD_SEED.md`, `SESSION_ARCHIVE_2026-04-22_controls.md`,
  `UX_CONTROLS_SPEC_v0.1.md`, and the 1.2KB `C:\AI\STATE.md` are
  not currently indexed. They live outside the project's docs trees
  and predate the system review pivot. A cleanup pass on
  `C:\AI\` top-level is a separate post-launch bite.

---

## Out of scope: docs that exist but are not decision-bearing

The discovery scan at v43 (Move 2) surfaced the following docs in
`docs/` and `docs/archive/` that are *not* indexed because they are
not decision-bearing per the spec's scope:

- All `SESSION_CLOSE_v<N>.md` files — per convention pointer above.
- `docs/archive/ANALYSIS_playlist_landscape_and_ux.md` — analysis,
  predates locked feature decisions.
- `docs/archive/BOOTSTRAP_v23.md`, `docs/archive/BOOTSTRAP_v24.md` —
  predecessor bootstraps; superseded by Phase 3 bootstrap design.
- `docs/archive/MUSEUM_CODEBASE_GAPS_v0.1.md` — gap analysis,
  predates system review.
- `docs/archive/SESSION_CAPTURE_PANEL2.md`,
  `docs/archive/SESSION_CAPTURE_PANEL2_INTEGRATION.md` — session
  captures, not decisions.
- `docs/archive/SESSION_SUMMARY_2026-04-14.md` — summary, not a
  decision.
- `docs/archive/STATE_CHRONICLE_2026-04.md` — chronicle, not a
  decision.

These docs are preserved on disk; they are findable via search-
fallback Tier 1 (`docs/` grep) or Tier 2 (`docs/archive/` grep).
Their non-inclusion here is by scope, not by oversight.

---

## Maintenance

When a session produces, supersedes, or changes the state of a
decision-bearing doc:

1. The doc's Status header block updates (state and Status-set date).
2. This index's row updates to match.
3. Both updates land at session close, called out in the close brief
   alongside `STATUS_SURFACE` reconciliation.

When a session adds a new decision-bearing doc:

1. New row added to the appropriate topic.
2. If a topic doesn't exist for the new doc, the topic taxonomy
   grows — same close-brief moment as above.

**Index-gap finding:** if a session locates a decision via search-
fallback (grep `docs/` or `docs/archive/`) where the path that
succeeded wasn't this index, file the finding at session close. Add
the missing row in the next index update.

**Filing-gap finding:** if search-fallback Tier 3 (ask Mike) reveals
a decision that was made but never filed on disk, file *that* as a
session-close finding — the gap is in filing, not in the index.
Mike-side recall is unreliable for decision *content*; the discipline
is to surface the gap, not to reconstruct from memory.

---

*End of v0.1.*


<!-- v50 amendment row, appended 2026-05-01. Move to appropriate topic section at edit-time. -->
| MV_TAG_CLEANUP_DESIGN v50 amendment | `docs/MV_TAG_CLEANUP_DESIGN_v50_AMENDMENT.md` | locked | Reframes MV tag cleanup through supplier/customer lens; resolves F6/F9/F10/