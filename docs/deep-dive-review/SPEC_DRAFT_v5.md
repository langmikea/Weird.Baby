Tag-Based Artifact Discovery — Specification
Date: 2026-05-11
Status: Draft v5 for independent design review
Supersedes: SPEC_DRAFT_v4.md (retracted)
Built from:
END_TO_END_MAP.md (21cf558) — what the code currently does
The v4 adversarial design review (this session) — what v4 got wrong
This document is the third pass at specifying the museum's tag-based artifact discovery feature. v3 inverted the dependency between MV and the museum. v4 corrected the inversion but failed to honor "all tags are equal" — it kept the vocabulary CSV gatekeeping which tags become pill columns. v5 corrects that and introduces the Exhibitor's Badge model to generalize beyond single-artist scope.
The headline shifts from v4 to v5:
All tags are strictly equal. Every namespace the operator uses in MV becomes a pill column on the museum. The vocabulary CSV is ordering and labeling guidance only, never an authority over what gets displayed.
The Exhibitor's Badge replaces the hardcoded scope:hunter_root filter. An artifact carries one or more badge tags naming which exhibits it appears in. The HR exhibit shows artifacts with the HR badge. Future exhibits filter by their own badges. A single artifact can appear in multiple exhibits.
Loud failures everywhere. The system fails noisily — never silently. Each known failure mode has an enforcement mechanism.
1. What the feature is
The museum's exhibits display released MV artifacts. Each artifact carries a flat array of tags. Each exhibit decides which artifacts it shows via the Exhibitor's Badge. Within an exhibit, the deck offers pill columns — one per tag namespace present in the displayed artifacts — and a search input. The visitor clicks pills (or types in the search) to narrow what they see.
That is the whole feature.
Five-step operator workflow
Operator prepares an artifact in MediaVault. Adds a source (YouTube, etc.). Attaches tags from any namespace. Includes at least one Exhibitor's Badge tag if the artifact is meant to appear in an exhibit.
Operator releases the artifact in MediaVault. Status becomes released.
Operator runs an export from their laptop. The export pulls released artifacts from MV and writes them to a JSON file in the museum repo.
Operator commits the JSON, builds the museum, deploys.
Visitor opens an exhibit. The exhibit shows artifacts carrying its badge. Visitor filters by tag pills. The displayed set narrows.
What the visitor sees
A grid of artifact tiles within the exhibit they're visiting. Each tile shows what the artifact is — title, date, source link, possibly an embedded preview. Above the grid, pill columns generated from whatever tag namespaces are present across the displayed artifacts. Visitor clicks pills; matching artifacts surface, non-matching artifacts vanish.
2. The Exhibitor's Badge
The badge is a tag, just like every other tag. Same shape (<namespace>:<value>), same storage (artifacts.tags), same handling.
Convention: the namespace is exhibit. Values name specific exhibits. For the HR exhibit, the badge is exhibit:hunter_root. For a future retrospective exhibit, exhibit:retrospective. For a visual album exhibit, exhibit:visual_albums.
A single artifact can carry multiple badges:
tags: ["author:hunter_root", "platform:youtube", "content_kind:official",
       "exhibit:hunter_root", "exhibit:retrospective",
       "mood:snarky", "motif:pink-hats"]
This artifact appears in both the HR exhibit and the retrospective exhibit. Same artifact, different presentation context.
The HR exhibit's filter is one clause: tags contains 'exhibit:hunter_root'. No platform restriction, no scope restriction, no content-kind restriction. If an artifact has the badge, it's in the exhibit. The exhibit's deck decides how to render whatever shows up.
This generalizes to N exhibits: each exhibit's filter is one clause naming its badge. No code duplication, no special cases.
3. Architectural decisions
Decisions that survive from v4
Each survives because it's grounded in source material (the map) or in operator-direct statements this session. Provenance retained.
DecisionValueProvenanceVocabulary file locationdocs/deep-dive-vocabulary.csv[locked: operator-direct] (5.1 in v3 spec, confirmed under v4)Vocabulary derived JSON locationsrc/data/deep-dive-vocabulary.json[locked: operator-direct] (Q-4 in v3, confirmed under v4)Export mechanismOperator-run CLI on operator's laptop. Reads MV's /db endpoint. Writes a JSON file in the museum repo.[locked: operator-direct] (D4 in v3, confirmed under v4)MV reachability principleBuild-time reads from the museum repo are fine. Build-time reads from MV are forbidden.[locked: Ops] (build-coupling reconciliation in v3, operator did not object)Card-identity migration (c14267e) is harmlessStays in git history. Files it modified will be deleted; the commit's value to this feature is zero.[verified: PRIORITY4C and end-to-end map]
Decisions that change from v4
Conceptv4 hadv5 hasProvenanceSource of pill columnsVocabulary CSV declares which namespaces become pill columns; other namespaces are "filter-only metadata"Every namespace present in displayed artifacts becomes a pill column. The CSV is ordering/labeling guidance only.[locked: operator-direct] — "All tags are equal!"Export filterHardcoded scope:hunter_root + youtube + parent + releasedPer-exhibit filter: tags contains 'exhibit:<exhibit_name>' + released + not archived. Platform, parent-shape, and scope are not gates.[locked: operator-direct] — Exhibitor's Badge model§3.2 vs Q-1 contradictionBoth present in v4Resolved: MV reads the vocabulary CSV for curation suggestions (Q-1 option (a)). §3.2 contradiction removed.[locked: operator-direct] — settled in v3 conversations, re-confirmed via session correctionsmatchFilter framingCalled "generalized" — implied trivialCalled what it is: a structural rewrite of the data shape the filter operates on. Phase v5-4 estimates accordingly.[locked: Ops] — Mike confirmed acknowledgment of the rewriteDay-one render contentUnaddressedMuseum opens when ready. No transient broken state to manage; bulk ingest happens before launch.[locked: operator-direct] — "Museum opens when Museum is ready to open."
Decisions still open
QuestionOptionsRecommendationQ-1 — Vocabulary CSV consumed by MV at curation time(a) Yes, MV reads the CSV; (b) No, manual sync via tags table; (c) One-time sync script(a). The cross-repo binding from Phase 4 is the right shape; v3 had this right.Q-2 — Title vs. description field shape in export(a) Single description; (b) Both description_short and description_long; (c) title + description separated(c). Standard separation.Q-3 — Render dispatch for non-link media typesFilter to media_type='link' only at v1, or render dispatch on all media typesExport everything; museum render dispatch on media_type returns a placeholder for non-link until renderers exist.Q-4 — Thumbnail derivation strategyParse parent's source_url and synthesize YouTube CDN URL, or join to child artifact's thumbnail_pathParse parent's source_url. The child artifact's thumbnail_path is MV-local, unreachable from the museum.
All four are [locked: Ops] recommendations pending operator confirmation. Phase prompts will surface them at implementation time.
4. Architecture
4.1 Storage
MV-side:
artifacts.tags is a JSON array of <namespace>:<value> strings. Same as today.
No namespace is special at the storage layer. The Exhibitor's Badge (exhibit:<name>) is one tag among many.
Standard MV curation surface (the existing pill wall, refined per Q-1) writes all tag namespaces uniformly.
Museum-side:
docs/deep-dive-vocabulary.csv — vocabulary, hand-edited. Provides ordering/labeling guidance only.
src/data/deep-dive-vocabulary.json — derived, prebuild-generated.
src/data/exhibits/<exhibit_name>.json — per-exhibit artifact records. Generated by export, one file per exhibit.
4.2 Data flow — operator curation
Operator pastes a YouTube URL (or uses yt-ingest.mjs).
Standard MV pill curation. Operator clicks pills across all namespaces. Operator selects at least one Exhibitor's Badge for the artifact.
Operator clicks Release. Status becomes released.
MV's pill wall surfaces vocabulary-CSV tags as suggestions (Q-1 option (a)). Operator doesn't need to type freeform tags for the vocabulary — they appear as clickable pills. Operator-added freeform tags persist normally.
4.3 Data flow — export
npm run export-artifacts (renamed from export-deep-tags).
The script:
Reads the vocabulary JSON to learn group ordering for the museum's render.
Fetches GET http://127.0.0.1:51822/db from MV. If MV is unreachable, exits with a loud error and does not write any output file. (See §6 — operational discipline.)
Loads the SQLite blob into better-sqlite3.
Discovers exhibits dynamically. Queries all distinct exhibit:<name> tag values across released, non-archived artifacts. One output file per exhibit found.
For each exhibit found, runs:
sql   SELECT a.id, a.source_url, a.source_platform, a.media_type,
          a.tags, a.description_short, a.description_long,
          a.post_date, a.post_date_confidence,
          a.released_at, a.thumbnail_path,
          a.parent_artifact_id
   FROM artifacts a
   WHERE a.status = 'released'
     AND a.archived_at IS NULL
     AND a.parent_artifact_id IS NULL
     AND EXISTS (
       SELECT 1 FROM json_each(a.tags)
       WHERE json_each.value = 'exhibit:<exhibit_name>'
     );
Note: no source_platform filter. The export takes any released artifact with the exhibit badge. The museum render dispatches on media_type per Q-3.
For each row:
Parses tags JSON array.
Groups tags by namespace into arrays. Example: ["mood:snarky", "mood:wistful", "motif:pink-hats"] becomes {mood: ["snarky", "wistful"], motif: ["pink-hats"]}.
Builds the artifact record per Q-2 (title, description fields) and Q-4 (thumbnail).
Writes src/data/exhibits/<exhibit_name>.json:
json   {
     "metadata": {
       "exhibit": "hunter_root",
       "exported_at": "2026-05-11T...",
       "filter": "released, not archived, badged for this exhibit",
       "vocabulary_csv_sha": "<12-char sha>"
     },
     "artifacts": [
       {
         "id": "MV-20260510-001",
         "source_url": "https://www.youtube.com/watch?v=7Lttb_59EYw",
         "source_platform": "youtube",
         "media_type": "link",
         "title": "Reverend",
         "description": "Hunter Root - Reverend (official music video)",
         "post_date": "2023-03-30",
         "released_at": "2026-05-11T...",
         "thumbnail_url": "https://i.ytimg.com/vi/7Lttb_59EYw/maxresdefault.jpg",
         "tags": {
           "exhibit": ["hunter_root"],
           "author": ["hunter_root"],
           "platform": ["youtube"],
           "content_kind": ["official"],
           "mood": ["snarky"],
           "motif": ["pink-hats"]
         }
       }
     ]
   }
4.4 Data flow — museum render
Vite imports the exhibit's JSON at build time (src/data/exhibits/hunter_root.json for the HR exhibit).
Prebuild regenerates the vocabulary JSON from the CSV.
The exhibit's deck computes its pill columns dynamically from the union of namespaces present across all displayed artifacts. Every namespace becomes a pill column. The vocabulary JSON provides ordering and human-readable labels for the namespaces it knows about. Unknown namespaces (artifact has vibes:hauntological, vocabulary doesn't list vibes) get a column with auto-generated ordering and label-from-namespace-key.
The deck renders the artifacts array. Each tile shows title, date, source link, thumbnail per media_type.
The filter (matchFilter, rewritten — see §4.5 below) matches selected pills against card.tags[namespace] arrays.
The search input typeahead operates over all pill labels across all columns.
4.5 The matchFilter rewrite
The current matchFilter reads fields directly on the card object (card.era, card.mood). v5's artifact records have tags nested as tags.era, tags.mood. matchFilter has to be rewritten to traverse the nested shape.
This is not a generalization. It's a structural rewrite of how filter state evaluates against artifacts. Phase v5-4 scopes accordingly.
4.6 What's deleted
Museum repo:
src/data/hr_artifacts.js, src/data/hr_archive.js, src/data/hr_exit_flow.js — fake test content
src/routes/hr/hr_cards.js — adapter file
src/data/deep-tags.json — replaced by src/data/exhibits/<exhibit_name>.json
attachDeepTags function
MV-side:
Phase 4's Deep Dive tab (d52e3ef) — the card_id input, the special save handler, the deep:* namespace handling
handle_artifact_deep_dive_save endpoint
_validate_card_id, _parse_notes_array, _normalize_deep_pair helpers
The deep:* rows in MV's tags table — replaced by standard vocabulary management (per Q-1, MV reads the CSV at curation time and surfaces those tags through the standard pill wall)
MV-side retained:
handle_deep_dive_vocabulary endpoint — repurposed/renamed as the vocabulary-suggestion source for MV's standard pill wall
Everything else in MV is unchanged
5. Implementation paths
The map identified the current code as inverted. v5 specifies the correct architecture. Two paths to v5-compliant code, plus a third for completeness.
Path A — Burn It Down
Revert the feature commits and rebuild from a clean slate.
Museum reverts: 649f006 (v4 spec, keep), 21cf558 (map, keep), 53394ff (playbook, keep), caf1b01 (gitattributes, keep), 8872ec0 (export fix, revert), 860ee05 (Phase 3 export, revert), bb2c343 (Phase 1 wiring, revert)
MV reverts: d52e3ef (Phase 4, revert)
Keep: c14267e card-identity migration (irrelevant but harmless); all docs in docs/deep-dive-review/; .gitattributes; prebuild-install patch; playbook updates
Audit trail: sharp before/after. Code that's there is v5-compliant.
Path B — Unfuck It
Edit forward through commits that supersede prior work.
Museum commits: rip hr_cards.js and the three card files; rewire hr_dimensions.js to discover from data; rewrite matchFilter for new artifact shape; rewrite the export for badge-discovery and per-exhibit output
MV commit: rip Phase 4's Deep Dive tab and handler; repurpose the vocabulary endpoint per Q-1
Renames: deep-tags.json → exhibits/<name>.json; export-deep-tags → export-artifacts
Audit trail: evolutionary. Each commit explains its transition.
Path C — Live with the inversion
Accept current code, fix only the loudest divergences (missing archived_at IS NULL, the most user-affecting bugs), let v5-style architecture emerge incrementally only when there's a specific reason.
The map identifies real but currently visitor-invisible problems. Path C bets the museum doesn't ship until Mike's bulk ingest is well underway, at which point the v5-correct architecture is the natural choice anyway. Code stays in its current shape until then.
Operator decision needed: which path?
Each path produces the same end state. The choice is about audit-trail style and cognitive load on future readers.
My recommendation, given the operator has stated "Museum opens when Museum is ready to open" — Path B. The evolutionary record matches the actual journey. Path A throws away commits that are partly correct only to recreate similar code. Path C is honest but defers work the operator has already decided needs doing.
6. Operational discipline — loud failures
The system has known failure modes. Each gets a loud-failure mechanism.
6.1 MV unreachable at export time
Failure mode: Export script tries GET /db, connection refused or timeout.
Loud behavior: Script writes nothing to disk. Exits non-zero with an explicit error: "Could not reach MediaVault at http://127.0.0.1:51822. Is MV running? (Start it via launch_mediavault.bat in C:\AI\Platform\MediaVault\)" — already present in the current export script.
Additional loudness for v5: If the export was in mid-write when MV becomes unreachable (extremely unlikely; the script fetches once and operates on the in-memory blob), the script must not leave any partial output file. Implement: write to a temp path, fsync, then atomic-rename to final path. If the rename doesn't happen, last-committed output stays.
6.2 Empty vocabulary CSV
Failure mode: The CSV has only the header row, no tags. Prebuild generates a JSON with empty groupOrder. The museum could render with no labeling guidance — a degraded but not catastrophic state.
Loud behavior: The prebuild script emits a build-time warning: "Vocabulary CSV at docs/deep-dive-vocabulary.csv has no tag entries. Pill columns will use auto-generated labels and ordering." Build proceeds.
The build-time warning is sufficient because v5's deck discovers pill columns from data namespaces, not from the vocabulary. An empty CSV degrades only the label/order quality.
6.3 Artifact with no tags
Failure mode: An artifact released with tags = []. Per the export's SQL filter (uses EXISTS-with-json_each on the badge), an artifact with no tags is excluded from the export by definition — the EXISTS clause fails when there's nothing to match.
Loud behavior: During export, the script counts "released artifacts without any exhibit badge" and reports the count in the summary output. Example: "Exported 47 artifacts to hunter_root.json. 3 released artifacts skipped (no exhibit badge). Run with --verbose for ids."
The operator can investigate the skipped artifacts. They're probably released-but-not-yet-fully-curated.
6.4 Operator forgets to export before deploying
Failure mode: Operator releases a new artifact in MV, runs npm run build without running npm run export-artifacts first. Museum builds with stale hr-artifacts.json.
Loud behavior: The build script gets a prebuild hook that runs the export automatically — or, if running export at build-time is too coupled (per the principle "build-time reads from MV are forbidden"), the build script does a freshness check: read src/data/exhibits/*.json's exported_at field, compare to a "minimum freshness" the operator can set. If older than the threshold, emit a build-time warning.
Recommendation: emit a warning, don't block the build. The operator may legitimately want to deploy an older snapshot. The warning is enough.
6.5 Export script crashes mid-way
Failure mode: SQL error, schema mismatch (MV's archived_at column doesn't exist — already seen), or any other crash.
Loud behavior: Script exits non-zero with the stack trace and writes nothing. The atomic-rename pattern (§6.1) means partial writes never reach the final path.
6.6 The exhibit badge typo
Failure mode: Operator types exhibit:huner_root (typo). Artifact gets the bad badge. Export's exhibit-discovery sees huner_root as a new exhibit, generates src/data/exhibits/huner_root.json (a single-artifact file), the museum's exhibit routing has no entry for huner_root, the artifact never reaches any visitor surface.
Loud behavior: During export, the script validates discovered exhibit names against a list of known exhibits maintained somewhere in the museum repo (or via a CLI flag like --exhibits hunter_root,retrospective). Unknown exhibits produce a warning: "Found exhibit 'huner_root' with 1 artifact(s). This exhibit is not in the known-exhibits list. Did you mean 'hunter_root'?"
7. Implementation phases
Phase numbering restarts from v5.
Phase v5-1 — Path execution
Per the operator's path choice (A, B, or C). Reverts or forward-commits per §5.
Phase v5-2 — Vocabulary remains as ordering guidance
The CSV and prebuild stay. Whether to rename "deep-dive-vocabulary" to something more general (tag-vocabulary, vocabulary, etc.) is a small follow-up — the file path is mentioned in v4-locked decisions and can be retained for git-history continuity.
Phase v5-3 — Export rewrite
tools/export-artifacts.mjs. Per §4.3.
Live test: operator releases a real artifact with exhibit:hunter_root and several other tags. Runs export. Verifies output JSON contains that artifact with correctly grouped tags. Verifies the script exits cleanly when MV is unreachable.
Phase v5-4 — Museum deck rewrite
HrExhibitFlow.jsx consumes src/data/exhibits/hunter_root.json directly. hr_dimensions.js builds dimensions dynamically from artifact tag namespaces. matchFilter rewritten for the new artifact shape. Delete authored card files.
This is the largest single piece of code work in the path. The matchFilter rewrite alone is meaningful — not the one-liner v4 implied.
Phase v5-5 — MV cleanup
Strip Phase 4's Deep Dive tab. Per Q-1, the standard pill wall surfaces vocabulary-CSV tags as suggestions. The endpoint is retained but the special UI tab and save handler are removed.
Phase v5-6 — Live end-to-end test
Operator workflow per §1's five steps against the real Reverend artifact (MV-20260510-001). Add exhibit:hunter_root badge + several mood/motif tags. Release. Export. Verify the museum displays it with the correct filter pills.
Phase v5-7 — Bulk ingest
Operator-paced. Per §1 step 1-3 for each artifact in scope.
8. What this spec does NOT do
It does not pick between Path A, B, or C. Operator chooses.
It does not specify code-level implementation. Phase prompts do.
It does not address other artists in detail. The Exhibitor's Badge model handles them generically; specific exhibits are configured when their badges are first introduced.
It does not address visitor-facing playback or asset delivery beyond direct YouTube links. Separate work.
Appendix A — How v5 differs from v4
All tags are strictly equal. Pill columns are discovered from data namespaces, not declared by the vocabulary CSV.
The Exhibitor's Badge replaces the hardcoded scope:hunter_root filter. Generalizes to multiple exhibits and future artists.
§3.2 and Q-1 no longer contradict each other. MV reads the CSV (Q-1 option (a)) — settled, not pending.
matchFilter is correctly framed as a structural rewrite, not a "generalization."
Decisions that survive retain provenance tags. No silent inheritance.
"Operational discipline — loud failures" is a new section naming the four known silent-failure modes and assigning a loud-behavior mechanism to each.
Path C is named as a third implementation path, even if not recommended. The framing is operator's choice, not Ops's foregone conclusion.
Appendix B — Source-material utilization map
SourceUsed in v5HowEND_TO_END_MAP.md (21cf558)§3, §4, §5Ground-truth code-vs-intent reference.SPEC_DRAFT_v4.md (649f006)§3 "Decisions that survive"Decisions that survive v4's reviewer scrutiny carry forward. Provenance retained.v4 adversarial design review (this session)§3 "Decisions that change", §4, §5, §6Every change v5 makes corrects a specific finding from the review.PRIORITY4_VERIFICATION.md§4.3 SQL filterConfirms parent_artifact_id IS NULL is the right parent scoping. The source_platform = 'youtube' clause is removed; render dispatches on media_type instead.PRIORITY4B_CARD_RENDERING.md§4.4 render dispatchConfirms current cards don't preview content; v5's render dispatches on media_type.Operator corrections (this session)§1, §2, §3, §6"All tags are equal!" → §1 + §3 decision pivots. "Exhibitor's Badge" → §2. "Loud failures!" → §6. "Museum opens when ready" → no day-one empty-deck mitigation needed.
End of Tag-Based Artifact Discovery Specification v5.
