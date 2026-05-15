> **Status:** most recent spec draft; superseded for vocabulary by `docs/CANONICAL_VOCABULARY.md`. v2 through v5_1 are in `docs/archive/`.

# Tag-Based Artifact Discovery — Specification, Patch v5.2

**Date:** 2026-05-11
**Status:** Resolution document for v5.1 open questions Q-1, Q-5, Q-6
**Builds on:** SPEC_DRAFT_v5.md (`669c7e7`), SPEC_DRAFT_v5_1.md (`79159e3`)
**Path selected:** Path B (Unfuck It) per v5 §5

---

> **Canonical vocabulary lives in `docs/CANONICAL_VOCABULARY.md`.**
> That document supersedes any specific tag categories named in this patch
> (or anywhere else in the v3–v5.2 deep-dive-review arc). Where this document
> uses example namespaces like `motif`, `theme`, or `texture`, treat them as
> Ops-author inventions that drifted from the operator's April-2026 locked
> UX structure — read the canonical doc for the authoritative tier-and-group
> vocabulary before tagging artifacts or interpreting examples here.

---

## 1. Why this patch exists

v5.1 surfaced six open questions (Q-1 through Q-6). Three (Q-1, Q-5, Q-6) were resolved in chat with the operator. Three (Q-2, Q-3, Q-4) are deferred to phase prompts. This document captures the resolved three in writing so the audit trail is complete before phase prompts are written.

This document also adds one new architectural finding from the Q-5 resolution: the `exhibit:` namespace is structurally different from content namespaces and gets specific render-layer handling.

---

## 2. Q-1 resolved — MV reads the vocabulary CSV at curation time

**Resolution: option (a).** MV reads `C:\AI\Projects\weird-baby-museum\docs\deep-dive-vocabulary.csv` at curation time to surface tags as suggestions in its standard pill wall.

**Implementation:** Phase 4's existing `handle_deep_dive_vocabulary` endpoint (currently serving the now-deleted Deep Dive tab) is **retained and repurposed**. It becomes the vocabulary-suggestion source for MV's standard pill wall.

**The endpoint is not renamed in this patch**; the rename is a follow-up task at the spec author's discretion. (Existing name preserves git-history continuity; functional behavior is what matters.)

**Phase v5-5 (MV cleanup) preserves this endpoint** while removing the rest of Phase 4's tab UI, save handler, and `card_id` infrastructure.

`[locked: operator-direct]` — operator's session statement: "a"

---

## 3. Q-5 resolved — Multi-badge is a first-class feature

**Resolution: option (a) — strict equality holds for content namespaces.** Multi-badge artifacts surface with their full badge set in every exhibit they appear in. The Hunter/Carsie collaboration use case is the canonical example: a shared show carrying `exhibit:hunter_root` and `exhibit:carsie` appears in both exhibits, full content tags available for filtering in both.

**Additional architectural finding from the Q-5 resolution:** the `exhibit:` namespace is **a routing tag, not a content tag.** It drives which exhibits exist and which artifacts belong in each. It is structurally invisible at the museum's render layer.

**Concretely:**

- Export behavior: unchanged from v5.1. Discover exhibits dynamically from `exhibit:<name>` tag values across all released artifacts. Each artifact gets written to each exhibit's JSON file whose badge it carries.
- Museum render behavior: read `exhibit:` from each artifact's tags to know which exhibits to populate. **Strip the `exhibit` namespace from the artifact's tags before rendering** so it does not appear as a visible pill column.
- Every other namespace becomes a pill column under strict tag equality. Content discovery between exhibits happens via content tags (`author:`, `collaborator:`, `venue:`, etc.), not via the `exhibit:` namespace.

**Visitor experience:** inside the Hunter Root exhibit, a shared Hunter/Carsie performance shows pill columns for content namespaces (mood, theme, motif, texture, author, etc.). The "Author" column shows both `hunter_root` and `carsie` pills. Clicking `carsie` filters to Hunter's collaborations with Carsie. Symmetric in the Carsie exhibit.

The visitor never sees an "Exhibit" pill column. The `exhibit:` namespace serves the museum's routing layer, not its discovery layer.

**Display names from a lookup table.** Per operator direction, human-readable labels come from a database (or CSV) table that maps slugs to display names. Renaming Hunter Root to "The Hunter Root Archive" is a single edit to the lookup, not a code change.

**Implementation detail for Phase v5-4 (deck rewrite):** the dimension-discovery code reads from artifact tag namespaces *minus* `exhibit`. The lookup table for display names is consulted when rendering pill labels and exhibit names. Exact storage shape for the lookup is Phase v5-4's call — could be an addition to the existing vocabulary CSV (`tag,group,notes,display_name`), could be a separate CSV, could be inlined in code for the first pass and refactored later.

`[locked: operator-direct]` — operator's session statements: "This is a feature: An artifact can carry multiple Exhibitor's Badges." and "Do not show the Exhibit Name pills. The Museum uses the pill to determine what exhibits exist."

---

## 4. Q-6 resolved — Phase v5-3 and v5-4 ship as one commit

**Resolution: option (a).** The export rewrite (Phase v5-3) and the deck rewrite (Phase v5-4) are combined into a single commit. Single PR. Single squash-merge. `main` is never broken between commits.

**Implication for the phase plan:** v5's Phase v5-3 and Phase v5-4 are now formally one phase, internally treatable as two work packages but landing as one commit. The combined commit:

- Adds `tools/export-artifacts.mjs` (the rewritten export per v5 §4.3 + v5.1 patches)
- Adds `src/data/exhibits/<exhibit_name>.json` files generated by the export
- Modifies `hr_dimensions.js` to build dimensions dynamically from artifact tag namespaces (minus `exhibit`, per §3 above)
- Rewrites `matchFilter` in `HrExhibitFlow.jsx` to traverse `card.tags[namespace]` arrays
- Deletes `hr_cards.js`, `hr_artifacts.js`, `hr_archive.js`, `hr_exit_flow.js`, `src/data/deep-tags.json`
- Adds the display-names lookup mechanism per §3 (Phase prompt decides exact shape)
- Deletes the `prebuild` step's generation of dimensions from vocabulary (kept only for ordering hints / labels)
- Removes `attachDeepTags` adapter

Phase numbering can stay as v5-3 and v5-4 in the spec for clarity about what's being done; the commit is one.

`[locked: operator-direct]` — operator's session statement: "a"

---

## 5. Q-2, Q-3, Q-4 — deferred to phase prompts

Q-2 (title vs description in export), Q-3 (render dispatch for non-link media types), Q-4 (thumbnail derivation) remain `[locked: Ops]` recommendations. The phase prompts that touch each will surface them for explicit operator confirmation at that time.

---

## 6. Implementation phases — final shape

Path B (Unfuck It) executed in four commits:

**Phase v5-2 — Vocabulary remains as ordering/labeling guidance.** No-op for the actual data; the prebuild step's contract narrows from "drives dimensions" to "provides display names and ordering hints." The CSV file path is retained. (May be empty if §3's display-names mechanism replaces it entirely; Phase v5-4 decides.)

**Phase v5-3+v5-4 (combined) — Export rewrite + deck rewrite + authored-files deletion.** One commit, one PR, one squash-merge. Per §4 above.

**Phase v5-5 — MV cleanup.** Strip Phase 4's Deep Dive tab, save handler, `card_id` input, `_validate_card_id` and related helpers. **Retain `handle_deep_dive_vocabulary` per §2** as the vocabulary-suggestion source for MV's standard pill wall.

**Phase v5-6 — Live end-to-end test.** Operator workflow per v5 §1's five steps. Release the Reverend test artifact with `exhibit:hunter_root` + several other tags. Run export. Verify the museum displays it correctly.

Phase v5-7 (bulk ingest) remains operator-paced and out of the v5.x patch arc.

---

## 7. What v5.2 does NOT do

- It does not change v5's architecture or v5.1's patches.
- It does not resolve Q-2, Q-3, or Q-4 — those remain for phase prompts.
- It does not specify exact code shapes for any phase — that's the phase prompts' job.

---

*End of SPEC_DRAFT_v5_2.md.*