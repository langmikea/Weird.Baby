# Deep Dive — Design review staging area
This folder co-locates the four documents involved in an upcoming adversarial design review of the Deep Dive feature spec.
## The four documents
1. **Phase 0 audit** — `../DEEP_DIVE_PHASE0_AUDIT.md` (committed 2026-05-10 at `a858a32`)
   Read-only audit of existing search and data-flow infrastructure across the museum and MediaVault. The spec is supposed to be grounded in this.
2. **Status taxonomy research** — `../STATUS_TAXONOMY_RESEARCH.md` (committed 2026-05-10 at `a858a32`)
   Read-only research into prior decisions about MediaVault artifact lifecycle (`inbox | vault | released | deleted` plus orthogonal `archived_at`). The spec's export-filter decision (D7) references this.
3. **Decision history** — `DECISION_HISTORY.md`
   Transcript-derived record of the eight locked decisions, their rationale, and the moment of decision for each. Distinguishes operator-made decisions from operator-confirmed-recommendations from Ops-author-derivations. The reviewer needs this to test whether the spec extrapolated.
4. **Spec draft v2** — `SPEC_DRAFT_v2.md`
   The document under review. Written after the v1 draft was found to drift from the audit findings; rewritten to cite source material explicitly. The reviewer's job is to test whether v2 has fully corrected the drift or whether the same pattern persists in subtler form.
## Why this folder exists
The design review is performed in a fresh chat, with no access to repos or tools. Co-locating the four documents at a stable GitHub URL (`https://github.com/langmikea/Weird.Baby/tree/main/docs/deep-dive-review`) ensures the reviewer is reading exactly the material the spec author intended.
## What this folder is NOT
- Not the final spec. The reviewed-and-revised spec will land at `docs/DEEP_DIVE_SPEC.md` after the review.
- Not a Cowork artifact. Cowork staged the files; Cowork did not author them.
- Not under active edit. Once committed, these files are reference material. If the review surfaces drift, the *spec* (and only the spec) is rewritten — the audit, research, and decision history are historical.
