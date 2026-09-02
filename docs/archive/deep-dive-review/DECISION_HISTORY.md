# Deep Dive — Decision history
**Date compiled:** 2026-05-10
**Purpose:** Source material for adversarial design review of the Deep Dive spec.
**Compiled from:** the conversation between Mike (operator, UX) and the spec author (Ops) leading up to the spec draft.
This document captures the eight locked decisions, the rationale, and — critically — the **moment of decision** for each. The moment matters because some decisions were operator-made directly, others were operator-confirmed-recommendations, and a few were operator-deferred-to-Ops. The review should distinguish these.
---
## Context: what Mike said at the start
Mike's initial direction:
> 1. Let's confirm the end-to-end process by making these videos accessible to the Museum, and findable by means of deep tags.
>    i) I go grab a "new" Youtube link
>    ii) I paste link into MediaVault
>    iii) MediaVault leads me through curation; all mandatory tags plus suitable Deep Tags.
>    iv) I go to the Museum and locate these videos using deep tags, etc.
>
> 2. After that, I would like our entire YouTube dataset cleaned, ingested, deduped, etc. I do not know if we already did that, or if there are still hundreds of links. Limit to the HR and related content for now.
Mike clarified what "Deep Tags" meant:
> Deep Tags are all of the tags that do not belong in the standard categories. They go in the Deep Dive tab (I have caused name drift and confusion, they are the same).
>
> Pink hats, Oops, Lemonade, Snarky... It is the rich sea of tags that enable the users to explore any part of the museum... Go deep, broad, strategically drill, etc.
Mike then explicitly directed not to march to the target without planning:
> DO NOT LET ME TAKE YOU OFF TRACK!!!
> I told you the DIRECTION to head. I did not direct you to blindly march to the target. Let's get there together. Please define the top level plan and share that with me, then JTTW.
After the Ops author proposed a top-level plan, Mike confirmed: "Yes, you get it. Proceed."
After D5 below was answered, Mike said:
> This is the moment in which we make a tight, testable, effective, efficient, solution (like we recently did!) or do one of those week long spirals into oblivion.
>
> Do it right. That is the only thing that ever impresses me.
This is the operating standard. The review should test the spec against it.
---
## The eight locked decisions
### D1 — Surface
**Question:** What is the relationship between Deep Dive and the existing Deep Tracks search?
**Options offered:**
- (a) Deep Dive is an extension of Deep Tracks search. Same input, just wider scope. Possibly renamed.
- (b) Deep Dive replaces Deep Tracks search.
- (c) Deep Dive is a separate surface alongside Deep Tracks.
**Operator's answer (verbatim):**
> "There should be only one Tab Search Box. It lives in Deep Tracks tab. It searches 'across all tiers' as its hint displays when empty. Deep Dive/Deep Tracks; its is the same thing, name-drift."
**How spec captures it:** D1 = "One search box. Lives in Deep Tracks tab. 'Searches across all tiers.' Deep Dive and Deep Tracks are the same thing — name drift, not two surfaces."
**Moment of decision:** Operator-made directly. Not a recommendation.
---
### D2 — Vocabulary structure
**Question:** Are Deep Dive tags flat, lightly grouped, or deeply hierarchical?
**Options offered:**
- (a) Flat. One bag of tags.
- (b) Grouped, light. Tags carry a category prefix (`mood:`, `theme:`, etc.).
- (c) Grouped, deep. Multiple levels.
**Operator's first answer:** "b" (grouped, light).
**Operator's elaboration after the spec author asked about category list TBD:**
> "Make it 'easy to edit in a table' over 'optimizing around getting it right the first time'. (I select these tags, change their 'group' labels to 'Oops', and they end up joining all of the other Oops..."
**How the Ops author interpreted this:** The elaboration changed the architecture. Mike's principle ("rename a group label and twelve tags follow") rules out: nested storage, slug-prefix encoding (`mood:snarky`), category foreign keys. It points toward: flat storage, group as a free-form column, CSV-shaped, renameable in bulk.
**How spec captures it:** D2 = "Flat. Storage is one row per tag. 'Group' is a property column on the row, not a hierarchy or a controlled enum. Renaming a group label rewrites every tag in that group."
**Moment of decision:** Operator-made via the elaboration. The first answer (b) and the elaboration arguably contradict — (b) was "grouped, light" with category prefixes, the elaboration ruled out prefixes. The spec author resolved this by treating the elaboration as a refinement rather than a contradiction. **Reviewer should test whether this interpretation is sound.**
---
### D3 — Vocabulary control
**Question:** Where do new tags come from?
**Options offered:**
- (a) Operator-invented (free-form only).
- (b) Controlled list only.
- (c) Hybrid — suggested from controlled list, free-form additions allowed, novel ones reviewed and promoted later.
**Operator's answer:** "c"
**How spec captures it:** D3 = "Hybrid. Suggested from a controlled list (the CSV); operator can add free-form during MV curation; novel free-form tags persist as `is_proposed=1` in MV."
**Moment of decision:** Operator-made directly. The "persist as `is_proposed=1`" detail was added by the Ops author based on the audit's finding that this is the existing MV pill mechanism. **Reviewer should test whether the `is_proposed=1` mechanism is the right hook.**
---
### D4 — Cardinality per video
**Question:** How many tags should a typical video carry?
**Options offered:**
- (a) Few (3–7).
- (b) Many (15–50).
- (c) No limit, varies.
**Operator's answer:** "c"
**How spec captures it:** D4 = "Varies. UI handles few or many gracefully."
**Moment of decision:** Operator-made directly.
---
### D5 — Source of tags during ingest
**Question:** Where do Deep Dive tags come from when ingesting a new video — operator only, auto-suggested, or hybrid?
**Options offered:**
- (a) Operator only.
- (b) Auto-suggested from content.
- (c) Operator only for v1, auto-suggest later.
**Operator's first answer:** "c"
**The Ops author then asked a poorly-phrased follow-up about thumbnails (D5 had been about source-of-tags; the Ops author confused it with rendering).** Operator clarified:
> "The SEARCH BOX surfaces matching TAGS. TAG selection filters the deck."
**How spec captures it:** D5 = "Operator-curated for v1. Auto-suggest from transcript/description/`enrich_helper.py` is deferred to a future pass."
**Moment of decision:** Operator-made directly. The Ops author's confusion did not affect D5 itself but did surface an important architectural point — that search results are tags, not videos.
---
### D6 — Search scope
**Question:** Should search match against tags only, or also against fact-text in `hr_facts.js`?
**Options offered:**
- (a) Tags only.
- (b) Tags plus facts.
- (c) Tags only for v1, facts as follow-up.
**Operator's answer:** "Simplify, please."
**How the Ops author interpreted this:** Treating "simplify" as a vote for (a) — the simplest of the three.
**How spec captures it:** D6 = "Tags only (i.e., the existing pill labels). No fact-text search."
**Moment of decision:** Operator-confirmed-recommendation. "Simplify" was an instruction; the Ops author picked (a). **Reviewer should test whether "simplify" should have been picked back to the operator for explicit confirmation.**
---
### D7 — Export filter
**Question:** What filter does the build-time export apply to decide which artifacts reach the museum?
**Context:** Operator recalled a prior decision about artifact "status" / "released" / "ready" semantics. The Ops author commissioned the status taxonomy research (now part of source material) to find it. The research found:
- The lifecycle taxonomy IS settled in writing: `inbox | vault | released | deleted` plus orthogonal `archived_at`.
- The export filter mapping IS NOT settled in writing. The operator's recollection of "we settled what `released` means" was correct; the recollection of "only released reaches the museum" was not in writing.
**Options offered (post-research):**
- (a) Released only.
- (b) Vault + released, archived excluded (matches MV's internal default vault view).
- (c) Released + tag-scope (e.g., `released AND tags @> 'scope:hunter_root'`).
**Ops author's recommendation:** (c) — "(a) plus the obvious safety rail."
**Operator's answer:** "I agree."
**How spec captures it:** D7 = "`status = 'released' AND archived_at IS NULL AND tags @> 'scope:hunter_root'`. Released, not archived, in scope."
**Moment of decision:** Operator-confirmed-recommendation. Operator said "I agree" to the Ops author's recommended (c). **Reviewer should test whether (c) is genuinely operator-aligned or whether the Ops author's framing biased the answer.** Particularly: the `archived_at IS NULL` clause was not in the option (c) text but was added in the spec — although "released, not archived, in scope" was implied throughout the prior conversation.
---
### D8 — Released-then-archived
**Question:** An artifact previously released and then archived: does it leave the museum or stay?
**Options offered:**
- (a) Archive removes from museum (symmetric with MV internal archive = hidden).
- (b) Once released, always exported. Archive only hides from MV's internal view.
- (c) Operator decides per-artifact.
**Ops author's recommendation:** (a).
**Operator's answer:** "I agree."
**How spec captures it:** D8 = "Archive removes the artifact from the museum. Symmetric with MV's internal 'archive = hidden' semantics."
**Moment of decision:** Operator-confirmed-recommendation. Same as D7. **Reviewer should test whether (a) was genuinely operator-aligned.**
---
## Architectural decisions made by the Ops author after the eight
These were not in the original eight but emerged during spec drafting. Each was made by the Ops author with rationale; none were explicitly confirmed by the operator before the spec was drafted. **Reviewer should test these.**
### Vocabulary file location
**Decision:** `weird-baby-museum/docs/deep-dive-vocabulary.csv` — three columns, hand-edited, versioned.
**Made by:** Ops author. Rationale: matches D2's "table-editable" principle. CSV chosen over JSON because Excel can edit it directly.
**Operator confirmation:** None explicit. The operator did not push back on the choice when it appeared in the v1 spec draft.
### Per-video tag storage location and namespace
**Decision:** MV's `artifacts.tags[]` column with a new `deep:` prefix.
**Made by:** Ops author. Rationale: matches the existing pill convention (`scope:`, `platform:`, etc.). The audit confirmed namespaced slugs are the existing pattern.
**Operator confirmation:** None explicit.
### MV → museum transfer mechanism
**Decision:** Build-time export, operator-run CLI, committed JSON. Not a Vite plugin, not a `prebuild` hook.
**Made by:** Ops author, but operator answered D4 (the cheap-vs-expensive question) by picking "the cheap one" which was the operator-CLI option.
**Operator confirmation:** Implicit via D4. The architectural detail (committed JSON, etc.) is Ops-author-derived from the answer.
### Status enum drift cleanup as Phase 2
**Decision:** Insert a Phase 2 between Phase 1 (museum-side) and Phase 3 (export CLI) to align MV's schema CHECK constraint, runtime `STATUS_ENUM`, and SPEC §4.
**Made by:** Ops author. Surfaced as Q-B in the spec for operator confirmation. **NOT YET CONFIRMED.**
---
## Operator's "slow down to go faster" intervention
After the v1 spec draft was produced and reviewed, Mike pointed out that the spec did not use the Phase 0 audit's findings about `DeepTracksContent`:
> "That matches Cowork's Phase-0 audit description of `DeepTracksContent` exactly: 'search is'"
> "Why wasn't Cowork's Phase-0 audit description of `DeepTracksContent` used?
> What else was not used, and what else should we slow down to investigate. That is the reason we did the research to start with."
The Ops author then audited their own spec against the audit findings, found six concrete gaps (search auto-picking-up new columns, five-touch column-add pattern, empty-column rendering, `/api/tags` not considered, several Constraint section items not addressed, status-enum drift surfaced as a current concern), and rewrote the spec as v2.
The current spec under review is v2.
This intervention is documented because it tells the reviewer something important: the spec author has demonstrated a tendency to draft-from-priors rather than draft-from-source. **The review should specifically test whether v2 has fully corrected this or whether the same pattern persists in subtler form.**
---
## What the review should produce
Per the design-review prompt, the reviewer's job is to identify drift, silent assumptions, coverage gaps, picked-vs-made decisions, and internal consistency issues. The reviewer should not propose edits or redesigns.
Areas of particular interest based on this decision history:
- **D2's "elaboration as refinement" interpretation.** Was the operator's first answer (grouped, light with prefixes) genuinely refined by the second message, or were they in tension?
- **D6's "simplify" interpretation.** Did the Ops author pick correctly, or should the operator have been asked to confirm explicitly?
- **D7 and D8's "I agree" responses.** Were these genuine endorsements or compliance? The operator was answering rapidly at that point.
- **The four Ops-author-made architectural decisions.** Are they well-grounded or are they extrapolations?
- **The persistence of the "draft-from-priors" pattern.** Has the v2 rewrite genuinely corrected it, or are there still silent assumptions?
