# Status taxonomy research

**Date:** 2026-05-10
**Question:** What prior decision exists about MediaVault artifact "status" / "released" / "ready" semantics?
**Scope:** Read-only research across `weird-baby-museum` and `MediaVault`.

## Findings

1. **The 2026-04-19 decisions document — the load-bearing decision record.**
   - Path: `MediaVault\_cowork\DECISIONS_2026-04-19_pill_states_and_friends.md`
   - Date: 2026-04-19. Header explicitly self-marks as authoritative: "Permanent reference. Before any code work touches these areas, read this first. Before SPEC is updated, read this first. If a future decision seems to contradict one of these, that's a discussion, not a silent override."
   - The lifecycle taxonomy itself is implicit/derivative in this doc — its four numbered decisions are about pill states, slug uniqueness, `is_proposed`, and `archived_at`. The status-enum cleanup is downstream of decision §4 (quoted next).
   - Quote (§4 "What this means"): "Archive is a post-save vault operation, not an inbox state. The inbox still has three fates: SCRAP / SAVE / RELEASE."
   - Quote (§4 "Schema impact"): "Add `archived_at TEXT NULL` to `artifacts`. … Add the default view filter on vault queries. Add the archive/unarchive UI entry point in the vault."

2. **The 2026-04-20 SPEC reconciliation — the place the status enum is explicitly fixed.**
   - Path: `MediaVault\_cowork\SPEC_RECONCILIATION_SUMMARY.md`
   - Date: 2026-04-20.
   - Quote (`SPEC.md` edits, §4): "**§4 Lifecycle Status** — removed `archived` from the status enum; added a clarifying sentence that the inbox has three fates (SCRAP / SAVE / RELEASE) and archive is a post-save vault operation; removed the `vault ↔ archived` transitions from the table since they no longer describe status changes."
   - Quote (§10 row): "Lifecycle — status values now `inbox | vault | released | deleted`; explicit note that archive is orthogonal via `archived_at`."
   - Quote (Surprises §1): "The `archived` status value was redundant with the `archived_at` column. Before reconciliation, SPEC's artifacts table had both `status ∈ {..., archived, ...}` AND an `archived_at TEXT` column…. The decisions doc §4 clearly treats archive as a column-level flag (`archived_at IS NOT NULL`) independent of status… I removed `archived` from the status enum in SPEC so the two models stop fighting."

3. **SPEC.md §4 — canonical definition of `released` (post-reconciliation).**
   - Path: `MediaVault\SPEC.md`, lines 189–220.
   - Quote (§4 table): "| `inbox` | New arrival, not yet reviewed. Default on creation. | | `vault` | Reviewed, tagged, and saved. The default 'home' for a kept artifact. | | `released` | Explicitly marked as a finished, fully-realized item. (Highlighted with a ★ badge in the vault grid.) |"
   - Quote (transitions, lines 202–207): "`inbox` → `vault` — operator clicks **Save** in the Inbox editor. `inbox` → (removed) — operator clicks **Scrap**; the record is deleted. `inbox` → `released` — operator clicks **Save & Release** (one step: save to vault, then mark released). `vault` ↔ `released` — toggle from the Vault detail panel."
   - Quote (§4.1, line 211): "Archive is **saved-but-hidden**. Always reversible."

4. **PROJECT.md core mental model (post-reconciliation).**
   - Path: `MediaVault\PROJECT.md`, lines 28–31.
   - Quote: "An artifact has: A **lifecycle status** — `inbox` → `vault` → `released` (or `deleted`). Archive is orthogonal: a nullable `archived_at` timestamp, not a status value."
   - Quote (header note, lines 8–14): "Reconciled 2026-04-20 against `_cowork/DECISIONS_2026-04-19_pill_states_and_friends.md` alongside SPEC.md. … `archived_at` as the canonical saved-but-hidden flag."

5. **WORKFLOW.md "The lifecycle" (post-reconciliation).**
   - Path: `MediaVault\WORKFLOW.md`, lines 28–41.
   - Quote: "Every artifact lives in exactly one status: `inbox  →  vault  →  released`. `inbox` — new arrival, not reviewed yet. `vault` — reviewed, tagged, kept. `released` — explicitly marked as a finished item (★ badge). Any vault or released row can also be **archived** — a separate flag (`archived_at` timestamp) that hides the row from default views until you toggle 'Show archived' on the filter bar. Archive is reversible with one click."

6. **Default vault filter and badge legend (recurring, post-reconciliation).**
   - Path: `MediaVault\SPEC.md`.
   - Quote (§8.1, line 362): "**MediaVault** (Vault) | Browsable vault. … Default filter: `status IN (vault, released)` AND `archived_at IS NULL`, children hidden. A toggle reveals archived rows."
   - Quote (§8.3 Badges, lines 379–382): "★ `released` / 📁 `vaulted` / ↗ `referenced` / 🔗 `url_only`."
   - Quote (§14 Hard Rules, line 456 row): "Lifecycle | Explicit `status` column with values (`inbox`, `vault`, `released`, `deleted`). `released` is separate from `vault`. Archive is orthogonal — a nullable `archived_at` timestamp on the row."
   - Quote (§14, "Why" col, line 456): "Every other status scheme conflated 'in vault' with 'featured'. Separating them makes the release act meaningful."

7. **The original v0.4 design — origin of the four-state lifecycle (pre-reconciliation, included for traceability).**
   - Path: `MediaVault\MEDIAVAULT_V04_DESIGN.md`.
   - Date: v0.4 refactor shipped 2026-04-17 (per `STATE.md` "WHERE WE ARE").
   - Quote (line 18): "A **lifecycle status** — `inbox` → `vault` → `released` → `archived`. Operational."
   - Quote (line 45 table row): "Release flag | Separate boolean | Part of the `status` lifecycle (`released` is one of four statuses)."
   - Quote (line 316): "`★ RELEASE` = save with `status='released'` in one click. Equivalent to `✓ SAVE TO VAULT` + immediate release."
   - Note: this document still treats `archived` as a status. Superseded by the 2026-04-19 decision and the 2026-04-20 reconciliation; flagged in `SPEC_RECONCILIATION_SUMMARY.md` "Files reviewed but NOT edited" as a v0.4 historical doc.

8. **STATE.md decisions block — confirms the same canonical decision.**
   - Path: `MediaVault\STATE.md`, lines 79–94.
   - Quote: "DECISIONS — 2026-04-19. Following REVIEW_v06.md and four intent-ambiguity resolutions: … `archived_at`. Saved-but-hidden. Always reversible. Real column on artifacts. … Full reasoning: `_cowork/DECISIONS_2026-04-19_pill_states_and_friends.md`. SPEC reconciled same day."

9. **Known drift: schema CHECK constraint vs. runtime enum vs. SPEC. Acknowledged, deferred to v0.7 punchlist.**
   - Path: `MediaVault\_cowork\REVIEW_v06.md`, lines 126–135.
   - Quote: "Actual schema: `CHECK(status IN ('inbox','vault','released','archived'))`. `core/imgserver_extensions.py:81`: `STATUS_ENUM = {"vault", "released", "archived", "deleted"}`. Contains `deleted` (DB would reject it), omits `inbox` (DB would accept it). `handle_artifact_register` validates against this set at line 260 and rejects any client that sends `status='inbox'` through that endpoint. `SPEC.md:206` schema comment says `inbox|vault|released|archived|deleted` — same 5 values the enum advertises. Code, schema, and spec all give different answers to 'what can status be?'"
   - Quote (`core/imgserver_extensions.py:81`): "STATUS_ENUM = {'vault', 'released', 'archived', 'deleted'}".
   - Consistency: this drift is real and acknowledged. The 2026-04-20 reconciliation locks the *spec-level* answer (`inbox | vault | released | deleted`); the schema CHECK constraint and the Python `STATUS_ENUM` have not yet been moved. `STATE.md` line 94 names the v0.7 punchlist as the place this drift is supposed to land.

10. **The word "ready" is not a lifecycle status anywhere in either repo.**
    - Searched both repos for `\bready\b` (case-insensitive). Hits all fall into three buckets:
      - Cowork-prep readiness reports: "READY FOR COWORK", "NOT READY — N error(s)" (operational state of a session, not an artifact attribute).
      - Free-text status lines: `MEDIAVAULT_V04_DESIGN.md:6` "Status: Design locked. Ready for execution."
      - Verb usage: `COWORK_BRIEF.md:381` "add files → inbox → review + tag + save → vault → release when ready" — operator-readiness, not a status value.
    - There is no `ready` status, no `is_ready` column, no `READY` enum value, and no doc that treats "ready" as part of the artifact taxonomy. The operator gate is spelled `released` (with the ★ badge) and the UI verb is "Save & Release."

11. **YT ingest schema (museum side) — per-artifact release semantics.**
    - Path: `weird-baby-museum\tools\youtube-ingest-schema.md`, line 153.
    - Date: 2026-05-08 (`Status: Design v1.1 (2026-05-08)`).
    - Quote: "Releasing a YT-adjacent artifact (★) follows the standard MV lifecycle. Releasing the parent does not auto-release children — that's an operator decision per artifact."
    - Note: implicitly affirms the lifecycle taxonomy (the ★ symbol and the word "Releasing" both reach back into MV's spec). Does not write any rule about which statuses are exported to the museum.

12. **YT ingest from museum (MV-side companion).**
    - Path: `MediaVault\_cowork\YT_INGEST_FROM_MUSEUM.md`, line 67.
    - Date: 2026-05-08 (`Status: 2026-05-08`).
    - Quote: "Save to Vault as usual. The lifecycle (`vault → released → archived`) is unchanged."
    - Consistency: this doc reverts to the v0.4-era three-arrow phrasing including `archived` as a state. It is the MV-side companion to the museum's YT-ingest schema and is about *museum → MV* intake, not MV → museum export. The phrasing predates the SPEC's post-reconciliation status table appearing here, so it reads as informal shorthand rather than a competing decision.

13. **VISION_LOCK_v0.3.md G-01 — the export architecture is named, the filter rule is not.**
    - Path: `weird-baby-museum\docs\canonical\VISION_LOCK_v0.3.md`, §3 G-01, lines 326–345.
    - Date: 2026-04-21, locked 2026-04-27.
    - Quote: "MediaVault is the museum's *curation and staging* surface. Artifacts are acquired, tagged, and vetted in MediaVault before they enter the public museum. The public museum never renders directly from MediaVault — it renders from a Cloudflare-native delivery layer (R2 + D1) populated from MediaVault on a deliberate export step. This preserves Mike's veto: nothing is visible until he decides it is. MediaVault is backstage; weird.baby is front-of-house."
    - Note: establishes the deliberate-export gate. Does not write a status filter or otherwise specify which artifacts cross the threshold.

14. **Phase-0 Deep Dive audit — explicit acknowledgment that the export filter is unwritten.**
    - Path: `weird-baby-museum\docs\DEEP_DIVE_PHASE0_AUDIT.md`, "Constraints / unknowns I couldn't resolve from the code alone".
    - Date: 2026-05-10 (today).
    - Quote: "**HR scoping rule for an MV export.** SPEC.md §2.1 / §2.2 describe a `bands:hunter_root` pill convention; museum-side data uses an `era` slug … so a build-time export of 'all HR artifacts' needs a defined filter — likely `tags @> 'bands:hunter_root'` — but I did not find a written decision picking that exact slug or category. Spec author should confirm the scoping query."
    - Quote (same section, `is_proposed` drift): "A build-time export consumer needs a rule: include proposed tags, exclude them, or treat them as approved. I did not find a written decision."
    - Note: the Phase-0 audit (yours, today) is itself the strongest contemporaneous evidence that the museum-export filter — including any "released-only" rule — is not in writing.

## Synthesis

A written decision exists about the lifecycle taxonomy itself. It is dated 2026-04-19 (decisions doc) and 2026-04-20 (SPEC/PROJECT/WORKFLOW reconciliation). The decision is consistent across all current-intent documents:

- Status enum: `inbox | vault | released | deleted`. Archive is *not* a status — it is a separate `archived_at TEXT NULL` column. The default vault view surfaces `status IN (vault, released) AND archived_at IS NULL`.
- `released` means: "Explicitly marked as a finished, fully-realized item." It is highlighted with a ★ badge. The operator promotes an artifact to `released` either via the inbox's `Save & Release` (one-step) or via the Vault detail panel's `vault ↔ released` toggle.
- "Ready" is *not* a lifecycle term. It appears only in operational/free-text usage. The operator gate is "released."

Implementation drift is real and acknowledged: the schema CHECK constraint is `('inbox','vault','released','archived')`, the runtime `STATUS_ENUM` is `{vault, released, archived, deleted}`, and the spec-canonical answer is `inbox | vault | released | deleted`. `REVIEW_v06.md` flags this; `STATE.md` defers it to the (not-yet-written) v0.7 punchlist. Inconsistency is between code and spec, not between two pieces of spec — the spec converges.

## What this means for "what gets exported to the museum"

No written decision establishes a status-based filter for what reaches the public museum. The architectural model is settled (VISION_LOCK G-01: deliberate export step from MV → R2 + D1, never a runtime read), but no document writes "only `released` artifacts are exported" or any equivalent. The Phase-0 audit dated today (2026-05-10) explicitly confirms this gap and asks the spec author to settle it.

The closest implicit material:

- SPEC.md §4 frames `released` as "Explicitly marked as a finished, fully-realized item" with a ★ badge — language that reads naturally as "promoted by Mike to museum-ready." But that interpretation is not written down.
- SPEC.md §8.1 names `status IN (vault, released) AND archived_at IS NULL` as the default *internal* vault view — i.e., what Mike sees when browsing MV's own UI. This is not framed as an export filter.
- The museum-side `youtube-ingest-schema.md` invokes the ★ release symbol in its operator-flow section but stays inside MV's lifecycle and does not extend it to a museum-export rule.

If Mike's recollection is "we settled what `released` means," that is correct — see Findings 2–6. If the recollection is "we settled that only `released` artifacts reach the museum," that is *not* settled in writing as of 2026-05-10. The Deep Dive spec author would need to make that call explicitly.

## Raw materials if no decision exists

For the museum-export filter question specifically, a fresh decision could draw on:

- **The status definition** in `SPEC.md` §4 (Finding 3) — gives `released` a meaning that already implies operator-promoted.
- **The default vault filter** `status IN (vault, released) AND archived_at IS NULL` in `SPEC.md` §8.1 — describes what counts as "live" inside MV.
- **The badge legend** in `SPEC.md` §8.3 — `★ released` is already the user-facing "this is a finished thing" symbol.
- **The architectural gate** from `VISION_LOCK_v0.3.md` G-01 — "deliberate export step", "Mike's veto, nothing is visible until he decides it is."
- **The per-artifact release framing** from `weird-baby-museum\tools\youtube-ingest-schema.md` §8 (Finding 11) — operator decision per artifact, parent does not auto-release children.
- **The drift acknowledgement** in `_cowork\REVIEW_v06.md` lines 126–129 (Finding 9) — any export rule expressed against `status` should be aware of which exact set of values it can rely on; the v0.7 punchlist is the place to lock that down before a downstream consumer depends on it.
- **The Phase-0 audit's own constraint section** in `DEEP_DIVE_PHASE0_AUDIT.md` (Finding 14) — both the HR scoping rule and the `is_proposed` rule are flagged as unwritten and adjacent to the export-filter question.

The shape of a fresh decision would naturally land as a §4-adjacent paragraph in `SPEC.md` (or as a new G-01 sub-rule in `VISION_LOCK`), with a concrete filter expression — e.g., `status = 'released' AND archived_at IS NULL AND tags @> '<scope-slug>'` — and an explicit statement of how `archived_at` interacts with `released` for export purposes (an artifact previously released and then archived: does it leave the museum, or does it remain because it was already shown? The current docs don't address this either way).
