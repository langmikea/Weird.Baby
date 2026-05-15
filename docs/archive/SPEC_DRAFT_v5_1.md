Tag-Based Artifact Discovery — Specification, Patch v5.1
Date: 2026-05-11 Status: Focused patch to SPEC_DRAFT_v5.md (`669c7e7`) Purpose: Address concrete findings from the v5 adversarial design review without rewriting the spec.
v5 remains the architectural base. This document is a targeted patch — read alongside v5, not instead of it. Where v5.1 conflicts with v5, v5.1 supersedes.
1. Why this patch exists
The v5 adversarial design review found that v5's two structural corrections (strict tag equality, Exhibitor's Badge) landed correctly. The remaining issues are smaller-class: one decision-elevation that should be walked back, one vestigial code path, two framing corrections, one mis-framed implementation path, four coverage gaps that need surfacing, and several operational under-specifications that the spec should either resolve or honestly defer.
v5.1 addresses these in place. The spec author does not invite another round of architecture review — v5's architecture survives. v5.1 is operational and editorial cleanup.
2. Patches
Patch 1 — Walk back Q-1's elevation
v5 §3 "Decisions that change from v4," row 3 claimed: "§3.2 vs Q-1 contradiction ... Resolved: MV reads the vocabulary CSV for curation suggestions (Q-1 option (a))." Provenance: `[locked: operator-direct] — settled in v3 conversations, re-confirmed via session corrections`.
v5.1: This elevation was not endorsed by the operator in this session. Walk back to v4's posture.

* Remove this row from the "Decisions that change" table.
* Q-1 remains in the "Decisions still open" list as `[locked: Ops] recommendation pending operator confirmation`.
* §3.2's claim that "MV doesn't read the vocabulary CSV at curation time" is removed; the §3.2 prose should read neutrally about Q-1's outcome until the operator confirms.
The Ops author retracts the inference that absence-of-objection equals confirmation.
Patch 2 — Remove vestigial export-side vocabulary read
v5 §4.3 step 1 says the export "Reads the vocabulary JSON to learn group ordering for the museum's render." The subsequent algorithm doesn't use the result; ordering is a museum-render concern.
v5.1: Strike step 1 from §4.3 entirely. The export does not read the vocabulary JSON. Renumber steps 2-7 as 1-6.
Patch 3 — Tense correction in §4.3 and §4.4
v5 §4.3 step 4 describes dynamic exhibit discovery in present tense, blurring new code with existing code. v5 §4.4 step 3 describes dynamic dimension discovery in present tense, same issue.
v5.1: Both sections are new construction, not descriptions of current behavior. Reframe explicitly:

* §4.3's exhibit-discovery loop is new code in Phase v5-3. The current export hardcodes `WHERE json_each.value = 'scope:hunter_root'`; Phase v5-3 replaces this with discovery and per-exhibit iteration.
* §4.4's dimension discovery from artifact tag namespaces is new code in Phase v5-4. The current code builds `HR_DIMENSIONS` from the vocabulary JSON's `groupOrder`; Phase v5-4 replaces this with data-driven discovery.
§4.5 (matchFilter) was already honestly framed. §4.3 and §4.4 should match its tone.
Patch 4 — Surface multi-badge as Q-5
A new open question, joining Q-1 through Q-4:
Q-5 — Multi-badge artifact UI consequences.
An artifact carrying multiple exhibit badges (e.g., `exhibit:hunter_root` and `exhibit:retrospective`) appears in both exhibits' JSON files. In each exhibit's deck, the artifact's `tags.exhibit` array contains both values. Under strict tag equality (§4.4), the "Exhibit" pill column in the retrospective deck shows pills for both `hunter_root` and `retrospective`. A visitor in retrospective can click `hunter_root` and filter retrospective to artifacts that are also in hunter_root.
This is mechanically correct under strict tag equality. The visitor-facing consequence is:

* (a) Acceptable. Strict equality is what the operator asked for. Multi-badge artifacts produce cross-pollination pills as a natural consequence. Document and move on.
* (b) Filter the `exhibit` namespace from each exhibit's render. The "Exhibit" column doesn't appear inside an exhibit; only inside a hypothetical "all exhibits" view. Loses one consequence of strict equality at the deck layer.
* (c) Filter each artifact's `tags.exhibit` array to the current exhibit's value only, before writing to the JSON. The artifact in `retrospective.json` carries `tags.exhibit: ["retrospective"]` only. Visitor never sees `hunter_root` as a pill. Cleanest from the visitor's perspective; introduces per-exhibit tag filtering at the export layer.
Recommendation: (a). Strict equality is strict equality. The visitor seeing an "Exhibit" pill column with one value (in single-badge exhibits) or multiple values (in cross-badged exhibits) is the honest surface of the underlying tag structure. Documents what's true.
`[locked: Ops]` recommendation pending operator confirmation.
Patch 5 — Surface phase-transition broken-main risk as Q-6
A new open question:
Q-6 — Phase-transition broken `main` states.
v5's Phase v5-3 (export rewrite) and Phase v5-4 (deck rewrite) land as separate commits. Between them, the new export writes `src/data/exhibits/<name>.json` while the deck still imports `src/data/deep-tags.json` and `hr_cards.js`. The deck imports files the export no longer writes. `main` would ship broken between commits.
This is the kind of "transient broken state" v5 §5 named as a path-execution risk but didn't address.
Three handling options:

* (a) Combine v5-3 and v5-4 into one commit. Larger diff, but `main` is never broken.
* (b) Keep them separate. After v5-3 lands, defer push to origin until v5-4 also lands locally; push both together. `main` on origin is never broken; local `main` between commits is.
* (c) v5-3 keeps writing both old and new outputs (`deep-tags.json` and `exhibits/<name>.json`); v5-4 deletes the old. Each commit individually leaves `main` working.
Recommendation: (a). The combined commit is reviewable; the line count isn't prohibitive; `main` is never broken. The other paths add ceremony.
`[locked: Ops]` recommendation pending operator confirmation.
Patch 6 — Fix Path C framing
v5 §5 closing line says: "Each path produces the same end state. The choice is about audit-trail style and cognitive load on future readers."
v5.1: This is true for Paths A and B. It is false for Path C. Path C explicitly does not converge to v5; it accepts the current inverted architecture indefinitely.
Replace the §5 closing paragraph with:
Paths A and B produce the same v5-compliant end state. Path C does not — it accepts the current architecture as-is and lets v5-style emerge only when there's a specific reason. Path C is a real third option, but it is a choice of substance (target architecture) not of style (audit trail). The operator's choice between A and B is about audit-trail style. The operator's choice between (A or B) and C is about whether v5 is the target architecture at all.
The recommendation for Path B over A stands. The framing that excluded Path C as a substance choice was wrong.
Patch 7 — Rename §6.3's failure mode
v5 §6.3 is titled "Artifact with no tags" but the failure mode is broader: an artifact released without an exhibit badge. Empty tags is one sub-case; non-empty-but-no-badge is another. Both are excluded by the export's EXISTS clause on `exhibit:<name>`.
v5.1: Rename to "Released artifact with no exhibit badge." The text should note both sub-cases (truly empty tag array, and tag array without an `exhibit:*` entry).
Patch 8 — Schema-mismatch diagnostic in §6.5
v5 §6.5 folds MV-side schema mismatch (missing `archived_at` column) into generic crash handling. This loses a known-historical-issue diagnostic.
v5.1: Split §6.5 into:

* §6.5a — Generic export crashes. Stack trace + non-zero exit + atomic-rename. As v5.
* §6.5b — MV schema older than expected. Specific error message when SQL fails with "no such column: archived_at": "Your MediaVault schema does not have the `archived_at` column. This column is referenced by the export's filter. Run `db_migrate.py` in the MV repo, or contact ops to remove the clause from the export script."
The Phase v5-3 prompt should include this specific diagnostic.
Patch 9 — Operational under-specifications acknowledged
v5 §6.4 and §6.6 use "somewhere" language for the freshness threshold and known-exhibits list locations. These are operational details deferred to phase prompts but presented as fully designed.
v5.1: Add an honest acknowledgment to §6:
§6 names loud-failure mechanisms. Where v5/v5.1 says "somewhere" or "a value the operator can set," these are operational details the relevant Phase prompt will specify. The mechanism is committed; the configuration location is not. Phase v5-3 (export) specifies the known-exhibits list location and the freshness threshold storage.
Patch 10 — Cover the four coverage gaps
The v5 review surfaced four coverage gaps the spec didn't address. Each gets a brief treatment:
Gap A — New exhibit bootstrap before any badged artifact. Operator adds an exhibit route in the museum repo (e.g., `src/routes/retrospective/`) before any artifact is badged. The route's `import` of `src/data/exhibits/retrospective.json` fails with "Cannot find module."
Handling: Phase v5-3's export script writes an empty `exhibits/<name>.json` for every entry in the known-exhibits list, regardless of whether any artifact carries that badge yet. Empty file shape: `{"metadata": {...}, "artifacts": []}`. The new-exhibit bootstrap requires adding the exhibit to the known-exhibits list (per Patch 9) and re-running the export. The museum then builds against the empty file.
Gap B — Last-artifact-removed cleanup. An exhibit's last badged artifact gets archived or unreleased. The next export produces zero artifacts for that exhibit.
Handling: v5.1 specifies: the export rewrites the exhibit's JSON file with `artifacts: []` rather than removing it. Stale files don't persist. The museum builds against an empty list; the exhibit's deck renders zero tiles. (This is fine — the operator added the exhibit to the known-exhibits list intentionally.)
Gap C — Mid-execution phase-transition broken main. Surfaced as Q-6 (Patch 5).
Gap D — MV-side tag migration during cutover. Existing artifacts carry `scope:hunter_root`. v5 introduces `exhibit:hunter_root`. The relationship between `scope:` and `exhibit:` is left to the operator. Concretely:

* `scope:hunter_root` was about authorship/relevance — "this artifact is about Hunter Root."
* `exhibit:hunter_root` is about presentation venue — "this artifact appears in the HR exhibit."
These are conceptually different. A future artifact might be `scope:hunter_root` (it's about Hunter Root) but not `exhibit:hunter_root` (it doesn't appear in the HR exhibit for some reason). Or `exhibit:hunter_root` without `scope:hunter_root` (a curated piece included in the HR exhibit that isn't about Hunter Root themselves — say, a piece by a collaborator).
Handling: v5.1 specifies: `scope:` and `exhibit:` are independent namespaces. The Phase v5-5 (MV cleanup) prompt should not migrate `scope:` to `exhibit:`. The operator, in Phase v5-6 (live test) or Phase v5-7 (bulk ingest), explicitly adds `exhibit:hunter_root` to artifacts that should appear in the HR exhibit. Most HR artifacts will eventually have both; the spec doesn't enforce this.
3. What v5.1 does NOT do

* It does not rewrite v5. v5 remains the architectural base.
* It does not introduce a new design review cycle. The remaining issues are operational; phase prompts handle them.
* It does not change Path A, B, or C definitions. Patch 6 only corrects framing.
* It does not lock Q-5 or Q-6. Both are open questions for the operator to settle.
4. Decisions still open after v5.1
Six open questions now. Q-1 through Q-4 from v5, plus Q-5 (multi-badge UI) and Q-6 (phase-transition broken main) added by v5.1.
The operator settles these before or during Phase v5-3 and Phase v5-4 as appropriate.
5. Acknowledgments
The v5 adversarial design review (this session) identified every issue this patch addresses. The pattern of "Ops resolutions being elevated to operator decisions" — repeatedly caught by adversarial review across v3, v4, and now v5 — has been the load-bearing failure mode of the spec-author process for this feature. v5.1 walks back the one such elevation that slipped into v5 (Q-1), and the spec author commits to not re-elevating it in v6 or in phase prompts without the operator's explicit confirmation.
End of SPEC_DRAFT_v5_1.md.
