# Adversarial Design Review — DATA_ARCHITECTURE_SPEC v0.1

**Reviewer role:** Independent adversarial critique. Not the author. Not on the author's team. Tasked to find every flaw, weakness, and unstated assumption.

**Spec under review:** `DATA_ARCHITECTURE_SPEC_v0.1.md` (2026-05-13).

**Requirements documents read (as authoritative reference, not as evidence the spec is right):**
- `docs/canonical/UX_LIFECYCLE_SPEC_v0.5.md`
- `docs/canonical/DATA_WORKFLOW_SPEC_v0.2.md`
- `docs/CANONICAL_VOCABULARY.md`

**Severity tags used below:** `critical` (architecture fails or produces wrong answers), `serious` (architecture works only with painful workarounds or unstated discipline), `minor` (cosmetic, low-priority, or easy to address).

---

## §0 — Reviewer's overall position

The spec **partially holds up.** The three-table model is internally consistent and does demonstrate F=ma at the data layer for the easy cases. But the spec confuses "no schema-level special cases" with "no special cases" — it has aggressively pushed all the special-case logic into render code and operator-tool code, and then claims credit for not having any. That accounting is wrong.

More damaging: at least one example query in §5.5 is **flatly incorrect** (it produces inflated, stale pill-count numbers under the most common visitor scenario), the UNIQUE constraint that supposedly prevents duplicate associations **does not work** in the most common case (role=NULL), the recursive-tree claim in §3.3 is **not supported by the queries the spec actually provides**, and at least three operator-relevant questions about hard-delete behavior on vocabulary are simply **not addressed**. These are not stylistic complaints; they are correctness defects.

The spec is salvageable. It needs targeted revisions before lock — not a redesign. The bones are sound. The defense of those bones is overconfident.

---

## §1 — Schema critique

### 1.1 — `vocabulary.kind` is freeform — `serious`

Spec claim (§3.2): *"The CHECK constraint on `kind` does NOT enumerate allowed values — it accepts any string. Validation that a `kind` makes sense is application logic, not database constraint."*

This is presented as F=ma elegance. It is in fact a code smell that hides three distinct problems.

**Failure mode A — typos create silent parallel universes.** An operator (or a buggy automation script, or a Cowork session) inserts a vocabulary entry with `kind='namepsace'` instead of `'namespace'`. The render query `WHERE kind = 'namespace'` silently misses it. The pill column never appears. Nothing throws. Nothing logs. The operator notices weeks later — "why is my new category not showing up?" — and has to hand-diff the vocabulary table.

**Failure mode B — case sensitivity.** SQLite TEXT comparison is binary by default. `'namespace'`, `'Namespace'`, and `'NAMESPACE'` are three different kinds. No `COLLATE NOCASE` is specified on the column or the indexes. If the operator UI ever lowercase-normalizes inconsistently, the system fragments.

**Failure mode C — the CHECK-free claim is hollow.** The spec says the *database* doesn't validate `kind`. Fine. But the *render code does*, and the *operator-tool code does*, and the seed data assumes specific kind values. The validation hasn't been eliminated — it's been moved to a layer the spec disclaims responsibility for. That's not F=ma; that's relocation.

**Reproducer.** Operator inserts:
```sql
INSERT INTO vocabulary (id, kind, slug, display_name, parent_id)
  VALUES ('vocab_mood_subtle', 'Value', 'subtle', 'Subtle', 'vocab_mood');
```
The capital `V` in `'Value'` (vs. the documented `'value'`) means this row will never appear in the pill query in §5.5. The operator sees "Mood" in the pill UI but Subtle is missing from it. The schema accepts the row. The application "validates" in render — by silently filtering it out.

**Defensible alternative.** Either (a) add a CHECK constraint listing the seeded `kind` values plus a documented extension mechanism (the operator runs an explicit DDL when introducing a new kind — a real act, not a side effect of typing in a JSON form), or (b) keep `kind` freeform but require a `vocabulary_kinds` reference table that constrains it via FK. Option (b) preserves runtime extensibility while preventing typos. The current spec does neither.

### 1.2 — `entity.data` JSON is the special case in disguise — `serious`

Spec claim (§2.3): *"This is the one place where 'kinds differ.'"* Acknowledged as a compromise.

Acknowledgment is not absolution. Three concrete consequences:

**Invariants you cannot enforce.** "Every artifact must have a source_url." "Every preset's filter JSON must include a `tags` key." "Every note must have a body." None of these can be enforced via SQL CHECK constraint on a JSON column portably across SQLite versions in a way that survives schema diffing tools. They live as application invariants. **An entity created without its required `data` fields is a valid row that breaks render.**

**Indexable searches that need explicit per-field expression indexes.** The spec mitigation (§2.3) says "searchable/filterable fields don't live in `data`." That mitigation **fails for content-search** (visitor types "reverend" into a search box, expecting body-text matches), **fails for range queries on numeric fields stored in JSON** (duration > 600 seconds), and **fails any time the operator decides a previously-non-searchable field needs to become searchable**. Each such promotion requires a schema change (CREATE INDEX on a JSON expression). The spec doesn't list these expression indexes. They're invisible architectural debt.

**Internal references inside `data` JSON are uncascaded.** A preset's `data.filter` references vocabulary IDs (e.g., `vocab_mood_snarky`). If that vocabulary entry is hard-deleted, FK CASCADE doesn't reach into JSON. The preset now references a phantom — the filter resolves to "no rows" silently. The spec acknowledges sovereign tag sets and hard-delete cascade for the `association` table; it does not address the same problem inside `data`. **Presets and any other data-internal vocabulary references are silently corruptible.**

### 1.3 — `vocabulary.parent_id` claims arbitrary depth; queries don't deliver it — `critical`

Spec claim (§3.3): *"Trees of arbitrary depth are supported. A future 'sub-category' feature (e.g., Mood:Subtle:Defiant) is just three levels deep with `parent_id` chains. The schema doesn't change."*

The schema supports arbitrary depth — true, mechanically. But the spec's example queries do not.

**Look at §5.5's Tier 1 pill query.** The `parent_id IN (SELECT id FROM vocabulary WHERE ... parent_id = 'vocab_tier_1')` clause descends *exactly one level*: tier → namespace, then JOIN to value. If the operator implements the Mood:Subtle:Defiant case the spec advertises, this query no longer finds the leaf "Defiant" pills. To fetch all values in a multi-level tree, the spec needs `WITH RECURSIVE` CTEs. None are shown.

**The "schema doesn't change" claim is misleading because the queries change.** Going from one-level-deep to N-deep is a structural rewrite of every render query, not a free trip. The architectural claim of "future flexibility" depends on query rewrites the spec hasn't drafted.

**Pathological shapes the schema does not prevent:**
- **Cycles.** `parent_id = self.id`, or A → B → A. SQLite FK self-reference allows this. The spec has no cycle prevention. Recursive CTEs without a depth bound on a cyclic graph hang the database.
- **Mixed kinds at intermediate levels.** A `value` whose parent is also a `value` instead of a `namespace`. Schema allows; renderer breaks.
- **Wrong kind at root.** A `tier` whose parent_id is not NULL. Schema allows; renderer breaks.

Each of these is a CHECK constraint or trigger the schema doesn't have. The "F=ma at the data layer" framing is what makes this a feature, not a bug, in the author's view. From an adversarial position: the schema is permissive enough that data corruption requires only a misclick.

### 1.4 — `association.role` UNIQUE constraint does not prevent duplicates — `critical`

Spec claim (§4.1, indexes): *"`UNIQUE(entity_id, vocabulary_id, role)` — prevents duplicate identical associations"*

This is **wrong for the most common case.** SQLite's UNIQUE constraint treats NULLs as distinct: two rows with `(ent_001, vocab_mood_snarky, NULL)` and `(ent_001, vocab_mood_snarky, NULL)` are both legal. They satisfy the UNIQUE constraint because NULL ≠ NULL.

**Reproducer.**
```sql
CREATE TABLE association (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  vocabulary_id TEXT NOT NULL,
  role TEXT NULL,
  UNIQUE(entity_id, vocabulary_id, role)
);
INSERT INTO association VALUES ('a1', 'ent_001', 'vocab_mood_snarky', NULL);
INSERT INTO association VALUES ('a2', 'ent_001', 'vocab_mood_snarky', NULL);
-- both succeed. The pill column shows "snarky (2 hits)" for one entity.
```

Per §4.3, *"Most associations don't need a role; the relationship 'entity has tag' is self-explanatory."* That means **the most common case is exactly the case the constraint fails to cover.** Hit counts (the §5.5 second query) get inflated. Pill-row deduplication has to happen in render code.

**Fix is mechanical:** either declare `role TEXT NOT NULL DEFAULT ''` and use empty-string-as-default, or add a separate partial UNIQUE index `WHERE role IS NULL` plus the existing one. Neither is a schema-architecture issue, but the spec confidently asserts a property it does not have.

### 1.5 — ID format inconsistency and preset-URL guessability — `serious`

Spec lists three ID formats:
- `vocab_<seed-slug>` for vocabulary
- `ent_<ulid>` for entity
- `assoc_<ulid>` for association

**Inconsistency:** the format `vocab_<seed-slug>` is described for *seed* entries. What is the format for operator-created vocabulary at runtime? Spec doesn't say. If it's also slug-based, then `slug` is no longer freely renamable — renaming a slug after creation would orphan the ID prefix from the slug. If it's ULID-based for non-seed entries, then half the vocabulary table has slug-based IDs and the other half has opaque IDs — with no CHECK or convention enforcing which.

**Preset URL guessability (§5.7):** *"The short_id is a stable per-preset identifier — either the entity's `id` directly, or a hash of it."*

ULIDs include a 48-bit timestamp prefix. Two presets created within the same millisecond share a prefix; their ULIDs differ only in the random suffix. **Sequential preset IDs are partially predictable.** This is not authentication-relevant (the museum is anonymous-first), but it leaks creation ordering. A crawler with one valid preset URL can sweep adjacent IDs to discover other recently-created presets — including drafts the operator hasn't yet shared.

The spec's own UX text (`UX_LIFECYCLE_SPEC §4.5`) calls preset URLs *"cryptic but stable short IDs (e.g., weird.baby/p/k7x9q2m)"*. `k7x9q2m` is 7 characters, suggestive of a hashed/randomized short code. The architecture spec then weakens this to "either the entity's `id` directly, or a hash of it" — which contradicts the UX promise. **Pick one.** "Or a hash of it" is the right choice; the entity ID directly is wrong.

### 1.6 — FK ON DELETE behavior is asserted in prose, not declared in schema — `serious`

Spec §7: *"FK CASCADE deletes all `association` rows pointing to it."* Spec §4.4: *"When an entity is hard-deleted (§7), the `association` rows are deleted via FK CASCADE."*

But the schema definitions in §2.1 and §4.1 declare `FK → entity.id` and `FK → vocabulary.id` **without specifying ON DELETE behavior**. SQLite default is `ON DELETE NO ACTION`. **The spec's assertion in §7 contradicts what the schema as written would do.**

This is fixable in one line per FK, but it isn't a one-line fix conceptually because the spec then needs to address: **what happens when a vocabulary entry is hard-deleted?** §3.5 covers retirement. §7 covers entity hard-delete. **Vocabulary hard-delete is unaddressed.** Two consistent answers exist:

- (a) FK on `association.vocabulary_id` is `ON DELETE CASCADE` → hard-deleting a vocabulary entry silently removes all associations to it, **violating the sovereign tag set principle** (§3.5, §4.4) for any vocabulary hard-delete.
- (b) FK is `ON DELETE RESTRICT` → vocabulary cannot be hard-deleted while any association exists, requiring an explicit "purge associations first" operator workflow that the spec doesn't describe.

Either answer is defensible. Picking neither is not.

### 1.7 — `kind_id` referencing a vocabulary entry of `kind='entity_kind'` is unenforced — `minor`

Spec §2.1: *"`kind_id` ... References a vocabulary entry of `kind='entity_kind'`."*

The schema declares only `FK → vocabulary.id`. Nothing prevents `entity.kind_id = 'vocab_mood_snarky'` (which is `kind='value'`, not `'entity_kind'`). Trigger or CHECK constraint via subquery would fix this; spec specifies neither.

Low severity because the operator UI is the realistic source of writes and would presumably constrain the choice — but a Cowork session running raw SQL bypasses that.

---

## §2 — Query plan critique

Assumed scale per the brief: 10K entities, 50K associations, 200 vocabulary entries.

### 2.1 — §5.5 first query: the Mood:Snarky filter — `serious`

```sql
SELECT e.* FROM entity e
WHERE e.kind_id = 'vocab_kind_artifact'
  AND e.deleted_at IS NULL
  AND e.born_on <= datetime('now')
  AND (e.retirement_at IS NULL OR e.retirement_at > datetime('now'))
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id = 'vocab_exhibit_hunter_root')
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id = 'vocab_mood_snarky');
```

**SQLite's planner without `ANALYZE`** picks a join order from rule-based heuristics. With WAL mode and modest data, this query is fast — but the spec's confidence (*"Indexed. Fast."*) overstates the guarantee.

**The `(deleted_at)` partial index `WHERE deleted_at IS NULL` is unusable for filtering on `IS NULL`.** A partial index that *includes* the rows where `deleted_at IS NULL` will match a query with `WHERE deleted_at IS NULL` — *if* the query planner recognizes that the partial-index predicate exactly matches the query predicate. SQLite supports this (since 3.8.0), but only when the partial-index expression is a syntactic match. `WHERE deleted_at IS NULL` is the right form. Likely fine. Not a bug — but listing this as a *separate filter index* on top of `(kind_id, born_on)` and the association indexes means the planner has to choose, and partial-index selection tends to lose to composite indexes that cover more predicates.

**The `(retirement_at)` partial index is misdesigned.** It indexes `WHERE retirement_at IS NOT NULL` — useful for the daily retirement-sweep, useless for the visitor-facing filter `(retirement_at IS NULL OR retirement_at > now())`. The visitor query needs an index that covers both NULL and future dates. The spec lists the wrong partial index for the visitor case.

**The two `IN (SELECT ...)` semi-joins escalate badly.** With three Tier-1 pill selections active, the query has three semi-joins. SQLite doesn't always rewrite `IN (subquery)` to a JOIN; with bad statistics it can do nested-loop scans. Recommended form: `EXISTS (SELECT 1 FROM association WHERE entity_id = e.id AND vocabulary_id = ?)`, which gives the planner an explicit correlated lookup. Spec uses the slower form.

**Missing index.** The query benefits from `(entity_id, vocabulary_id)` for the outer-side correlated lookup, but the spec's listed indexes have `(vocabulary_id, entity_id)` for the inner subquery side. The composite index direction matters; both directions help different access paths, but only `(vocabulary_id, entity_id)` is listed for the IN-subquery shape used in the example.

### 2.2 — §5.5 second query: hit counts are flatly wrong — `critical`

```sql
SELECT v.id, v.display_name, COUNT(*) as hits
FROM vocabulary v
JOIN association a ON a.vocabulary_id = v.id
WHERE v.kind = 'value'
  AND v.parent_id IN (SELECT id FROM vocabulary WHERE kind = 'namespace' AND parent_id = 'vocab_tier_1' AND retired_at IS NULL)
GROUP BY v.id, v.display_name
ORDER BY v.sort_order, v.display_name;
```

**This counts every association in the entire database**, regardless of whether the associated entity is deleted, retired, in the current exhibit, or in the visitor's current filter set. Per `UX_LIFECYCLE_SPEC §4` and the deck UX, pill counts must reflect the **currently visible artifact set** — that's what the *"hit count"* in `CANONICAL_VOCABULARY` "Tier 3 by hit count" refers to.

**Reproducer.** The operator soft-deletes 200 artifacts that were tagged `mood:snarky`. The pill count next to "Snarky" still shows the old number plus all the soft-deleted hits, because the query has no filter on `entity.deleted_at`. The visitor sees "Snarky (47)" but clicking "Snarky" returns 12 results. Trust in the UI breaks.

This isn't "the spec hasn't shown the realistic query yet." This is the spec presenting a query as a demonstration that the architecture works — and the demonstration is wrong. The realistic query needs a JOIN to `entity` filtered on the visitor-facing predicates plus exhibit membership. That's:

```sql
SELECT v.id, v.display_name, COUNT(DISTINCT a.entity_id) AS hits
FROM vocabulary v
JOIN association a ON a.vocabulary_id = v.id
JOIN entity e ON e.id = a.entity_id
WHERE v.kind = 'value'
  AND v.parent_id IN (SELECT id FROM vocabulary WHERE kind = 'namespace' AND parent_id = 'vocab_tier_1' AND retired_at IS NULL)
  AND e.deleted_at IS NULL
  AND e.born_on <= datetime('now')
  AND (e.retirement_at IS NULL OR e.retirement_at > datetime('now'))
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id = 'vocab_exhibit_hunter_root')
  -- AND any other active pill filters, joined per filter
GROUP BY v.id, v.display_name
ORDER BY v.sort_order, v.display_name;
```

This is a 4-table aggregate with N additional semi-joins where N is the number of currently-active filter pills. **Per page render.** No materialization, no caching strategy, no acknowledgment that this is the actual workload.

### 2.3 — Tier 3 dynamic ordering is unaddressed — `serious`

`CANONICAL_VOCABULARY` requires Tier 3 namespaces ordered by hit count. To compute this:

```
For each namespace in Tier 3:
  count(distinct entities visible) where entity has at least one association
  to any value-vocabulary entry under that namespace.
```

This is a 4-table join with two layers of group-by, computed per render. The spec doesn't show this query at all. With 50K associations and 50 Tier-3 namespaces, this is real cost.

**Mitigation the spec doesn't propose:** materialized view (SQLite triggers maintaining a `pill_hit_count` table), or a denormalized per-render cache invalidated on entity/association write. Either is a schema/architecture concern that should be decided before lock.

### 2.4 — Multi-pill filtering compounds — `serious`

A visitor selects three pills across three tiers. The query becomes:

```sql
SELECT e.* FROM entity e
WHERE [base filters]
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id = 'pill_1')
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id = 'pill_2')
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id = 'pill_3');
```

Three semi-joins. With `(vocabulary_id, entity_id)` index on association, each subquery is a sub-millisecond index range scan returning maybe 200-500 entity_ids. SQLite materializes each subquery result and intersects. Acceptable at this scale.

**But:** within-namespace OR semantics (per `UX_CONTROLS_SPEC` — selecting "Snarky" and "Defiant" within Mood means Snarky OR Defiant) require yet another structure. Spec doesn't show this query either. The within-OR / across-AND pattern needs:

```sql
  AND e.id IN (SELECT entity_id FROM association WHERE vocabulary_id IN ('vocab_mood_snarky','vocab_mood_defiant'))
```

— which is fine but produces *over*-counts when an entity has both Snarky and Defiant. Pill counts derived from this need DISTINCT. The spec hasn't shown the realistic visitor query at all, only a single-pill demonstration.

---

## §3 — F=ma claim audit

The spec acknowledges one special case (§9.5, the exhibit namespace strip). Here are the others.

### 3.1 — `entity.data` JSON polymorphism is the special case, just relocated — `critical`

§2.3 is honest: *"This is the one place where 'kinds differ.'"* But the spec then describes this as a "compromise" rather than as the violation it is.

**Where the special-case logic lives:** render code MUST know that `kind=artifact` has `data.source_url`, `data.media_type`, `data.thumbnail_url`; that `kind=preset` has `data.filter`, `data.sort`, `data.narrative`; that `kind=note` has `data.body`, `data.attribution`. Add a new kind, you must teach the render layer what to do with its `data` shape. **That's a code change.** §2.2 claims *"No code change. This is the F=ma proof for 'definitions are data.'"* False. Adding a new kind is a code change in the render layer. The data layer accepts the row; nobody can render it.

The spec needs to either own this honestly ("F=ma at the data layer; rendering remains code") or solve it (e.g., per-kind render-config also stored as data, with a generic field-renderer that reads layout from the kind's vocabulary entry's `data` JSON). The current spec asserts the strong claim but delivers only the weak one.

### 3.2 — `kind` and `role` taxonomies are enforced by code, not data — `serious`

§3.2: *"The `kind` field itself is data. The CHECK constraint on `kind` does NOT enumerate allowed values."*
§4.3: *"The `role` column is freeform text. The schema doesn't validate it."*

Both fields' permitted values are determined by the render code and operator UI. The schema's permissiveness is a design choice that *enables* extensibility; it does not by itself *deliver* it. The render layer's enumeration of valid `kind`s and `role`s is a hidden code dependency. **Adding a new `kind` or `role` requires code changes wherever those fields are switched on.**

This is the same accounting error as §3.1. F=ma at the data layer is a real property of this schema. F=ma across the system is not.

### 3.3 — Lifecycle stages PUBLISH and LIVE are indistinguishable in the data — `serious`

§5.4 lists eight stages. From the data side:

| Stage | Predicate over data |
|---|---|
| ACQUIRE | no row exists |
| INTAKE | row exists, born_on IS NULL |
| CURATE | row exists, born_on IS NULL or > now() |
| PUBLISH | born_on <= now() |
| LIVE | born_on <= now() AND deleted_at IS NULL AND (retirement_at IS NULL OR retirement_at > now()) |
| REVISE | indistinguishable from CURATE |
| RETIRE | retirement_at <= now() |
| DELETE | deleted_at IS NOT NULL |

**PUBLISH and LIVE collapse to the same predicate** in any meaningful query (no one queries for "published but not live" — that requires that the entity is published *and* not deleted *and* not retired, which is exactly LIVE). The eight-stage lifecycle is six-stage in the data, and the spec doesn't acknowledge this.

**CURATE and REVISE are also indistinguishable** in this schema. Both manifest as `updated_at` advancing. The distinction (CURATE = first-time, REVISE = post-publication edit) requires either a state machine the schema doesn't model, or an inferred predicate (REVISE = updated_at > born_on), but the spec doesn't say which.

If the operator's curation surface needs to render CURATE differently from REVISE — and it almost certainly does, given `UX_LIFECYCLE_SPEC §2` describes them as separate stages with different UX — the schema as written cannot answer "is this artifact in CURATE or REVISE?" without inference.

### 3.4 — Tier 1/2 fixed-membership is socially enforced, not architecturally enforced — `serious`

Tier 1 has a locked list of five namespaces (year, album, song, venue, people). Tier 2 has a locked list of two (source, type). Tier 3 is dynamic.

**What stops the operator from inserting a sixth namespace into Tier 1?** Nothing in the schema. `INSERT INTO vocabulary (kind, slug, parent_id) VALUES ('namespace', 'instrument', 'vocab_tier_1')` succeeds. The render layer presumably handles it (a sixth Tier 1 column appears), but the canonical-vocabulary lock is violated and nothing detected it.

This is an F=ma property the operator may *want* (they can change Tier 1 membership at runtime!), but it conflicts with `CANONICAL_VOCABULARY.md`'s explicit statement *"Tier 1 — ARTIST (locked membership)."* The spec doesn't address this conflict. Either:

- (a) Tier 1/2 are truly locked, in which case the schema needs a CHECK or trigger preventing additions/removals to Tier 1/2 (and the operator UI should hide that affordance).
- (b) Tier 1/2 are operator-editable, in which case `CANONICAL_VOCABULARY.md`'s "locked membership" language is wrong and should be revised.

The spec quietly chooses (b) by omission.

### 3.5 — Vocabulary retirement vs. entity retirement: cosmetic uniformity — `minor`

§3.5 (vocabulary retirement) and §6 (entity soft-delete) both describe "preserve associations." They look uniform. They behave differently:

- Vocabulary retirement: the associated entities are **still visible** in queries; only the vocabulary entry is filtered from new pill suggestions.
- Entity soft-delete: the entity is **invisible** to all visitor queries.

The spec presents both as "association rows preserved," which conflates two very different visibility outcomes. Cosmetic unification of the schema column names (`retired_at`, `deleted_at`) hides this. The spec should say plainly that retirement of a vocabulary entry does *not* hide associated entities from visitors, only from new tagging.

---

## §4 — Future-flexibility audit

Three operator wishes the spec cannot support cleanly:

### 4.1 — Wish: edit-history per artifact — `requires schema change`

*"I want to see who edited this artifact, when, and what changed. Last 50 edits, queryable by date."*

**Why `data` JSON fails.** Edit history is many-to-one with entity, so it would live as a JSON array growing per edit. Querying "all edits last week across the museum" requires JSON-array scanning across all entity rows. No index.

**Why associations don't help.** Each edit is not a relationship to a vocabulary entry — it's a structured event with timestamp, actor, change description. No vocabulary entry corresponds.

**What's required.** A new `entity_edit` (or `audit_log`) table. Real schema change. Real migration. **Not "just data."**

The spec's silence on edit history is consistent with `DATA_WORKFLOW_SPEC §2.2` ("Edit-in-place. No versioning. No edit history.") — but that's a deliberate decision, not a flexibility property. If the operator changes their mind in 6 months, the F=ma promise of "operator-extensible" doesn't extend here.

### 4.2 — Wish: typed entity-to-entity relationships with metadata — `requires schema change or option-α from §9.1`

*"This artifact is a remix of that artifact, made in 2024, derivative-weight 0.7."*

Today, the association schema requires `vocabulary_id`, not `target_entity_id`. The spec presents two routes (§9.1):

- **(α)** Add `target_entity_id` column, polymorphic with `vocabulary_id`. **This is exactly the special case F=ma forbids** — the same column referencing two different tables based on `role`. The spec offers it as an option without flagging this contradiction.
- **(β)** Create a vocabulary entry per attachable entity. For an artifact-remix relationship, every artifact that can be remixed needs a mirror vocabulary entry. **Vocabulary table now has 1+ rows per entity** that can be the target of a relationship. Vocabulary semantics get muddied: a "vocabulary entry" stops being a label and starts being a proxy ID.

Neither is clean. Both are presented as "operator's call" without acknowledging that one violates F=ma directly and the other violates the conceptual cleanness of the vocabulary table. **The spec needs to pick a side or admit that entity-to-entity relationships are an unsolved problem.**

The temporal direction (A → B vs. B → A) and the weighting (0.7) compound the problem. The weight goes in `data` JSON (unindexed). The direction is implicit in which entity is `entity_id` vs. the target — but then "find all derivatives of A" and "find all sources of A" are asymmetric query patterns. Spec doesn't address.

### 4.3 — Wish: full-text search over body content — `requires schema change`

*"Find all notes whose body mentions 'reverend'. Find all preset narratives mentioning 'live'."*

**Why the spec's mitigation fails.** §2.3 says searchable fields live as tags. Body content of a note doesn't get tagged; it's free text. There is no tag for every word.

**Why `data` JSON LIKE fails.** `WHERE data->>'body' LIKE '%reverend%'` is a full table scan. With 10K entities and a substring search, that's 10K JSON parses per query.

**What's required.** SQLite FTS5 virtual table on `entity.data->>'body'` (or a trigger-maintained shadow). Real schema addition. **Not "just data."** And it has to be added per JSON field; no global "search all text fields" affordance.

The spec doesn't mention FTS5 or any search story. For a museum that includes notes (visitor body text) and preset narratives (operator body text), this is a real visitor capability the architecture has no answer for.

---

## §5 — Operational concerns

### 5.1 — Concurrent writes and lost updates — `serious`

SQLite serializes writes through database-level write lock (or table-level in WAL mode). Single-operator MV is fine. The spec implies operator + automation (export pipeline, ingest, future webhooks). Three concrete problems:

**Lock contention with long-running operator transactions.** An operator opens an entity for editing, the editor holds a transaction open while the operator types. Background automation tries to write — blocked until the operator commits. SQLite's default behavior is "fail with SQLITE_BUSY after timeout." Spec doesn't address transaction scope or busy-timeout policy.

**No optimistic concurrency.** No `version` column. Operator opens entity at version T0. Background automation updates the entity's `data` at T0+5s. Operator saves at T0+30s, overwriting silently. The "lost update" problem. The spec's edit-in-place model (`DATA_WORKFLOW_SPEC §2.2`) is at odds with safe concurrent editing.

**Spec disclaim "operational" but the schema decision is operational.** Adding a `version` column or `etag` is a schema concern that has to be settled before lock. Disclaiming operations doesn't make this go away.

### 5.2 — Backup and restore are non-portable — `serious`

The spec doesn't address: how do you back up *one entity* (e.g., one preset) in a restorable form?

The entity row alone is meaningless. To restore it, you need:
- The entity's `data` JSON (contains it)
- All `association` rows for the entity
- All `vocabulary` entries those associations reference
- Recursively, all parent vocabulary entries up to tier roots
- The full vocabulary tree path for any vocabulary IDs referenced inside the entity's `data` JSON (e.g., a preset's filter state)

**To restore "this preset" into another database**, all those vocabulary entries must exist at the destination *with the same IDs*. If the destination has a different ID for the same display name (e.g., its `vocab_mood_snarky` is `vocab_xyz123` instead), the restored preset references a phantom.

**Implication:** there is no portable preset format. There is no "share preset" outside the museum's own database. Backups of partial state are not restorable; only full-database backups are. The spec doesn't say this; the architecture forces it.

### 5.3 — Schema evolution: data side easy, application side hidden — `minor`

Adding a column to `entity`: ALTER TABLE works. Existing rows get NULL/default. Easy.

Adding a fourth table: schema migration script. Standard.

But: the spec's "no code change to add a kind" claim implies that schema evolution is rare. In reality:

- Renaming a `kind` value (e.g., `'namespace'` → `'category'`): requires UPDATE across vocabulary, plus render code updates everywhere `'namespace'` is hardcoded. The freeform `kind` makes the data update easy and the code update no easier than a constrained kind.
- Promoting a `data` JSON field to a real column (e.g., `source_url` becomes its own column for indexing): per-row data migration, render code updates, query updates. Real migration project.
- Splitting `entity` into two tables (e.g., `artifact` and `non_artifact`): if F=ma is ever abandoned, the unified-table choice maximizes splitting cost.

**The migration story is asymmetric:** easy for additive change, hard for any restructuring. Spec doesn't acknowledge this asymmetry.

### 5.4 — Orphaned associations and dangling JSON references — `serious`

**Orphan associations from FK CASCADE failure.** If FK enforcement is off (`PRAGMA foreign_keys = OFF`, the default in some SQLite library configurations), DELETE on entity leaves orphan associations. Spec doesn't mention `PRAGMA foreign_keys = ON` requirement at connection time. **This is a footgun.**

**Dangling vocabulary IDs inside `entity.data` JSON.** Already noted in §1.2 of this critique. A preset's filter references `vocab_mood_snarky`. Vocabulary entry hard-deleted (or, depending on FK rules, not even hard-deleted — see §1.6). Preset's filter silently broken. No cascade reaches into JSON. No periodic cleanup specified.

**Recovery path.** None specified. The spec needs at minimum:
- A documented "must enable foreign_keys pragma" at connection
- A periodic integrity-check script (`SELECT * FROM association WHERE entity_id NOT IN (SELECT id FROM entity)` and the equivalent for vocabulary_id)
- An accounting of which JSON fields can carry vocabulary references and a strategy for keeping them consistent

### 5.5 — The eight-stage lifecycle has no atomicity guarantees — `minor`

CURATE → PUBLISH transition is "born_on becomes <= now()." This isn't a transition the system performs; it's a moment time passes. If the operator sets `born_on = '2026-05-13 14:00:00'` and the museum render queries at 14:00:00.001, the entity is live. There's no "pre-publish hook" — no opportunity to validate that data is complete, exhibit badges are set, vocabulary references resolve, before the entity becomes visitor-visible.

Spec is consistent with `UX_LIFECYCLE_SPEC §2` ("PUBLISH and RETIRE are data, not actions"). But "data, not actions" trades determinism for simplicity. The spec doesn't acknowledge the trade.

---

## §6 — Summary of required changes before lock

### Critical (must fix)

1. **§5.5 second query is wrong.** Pill hit counts must filter by visible entities. Replace the example with the realistic 4-table aggregate, or explicitly note that the example is a starting point that requires expansion.
2. **`UNIQUE(entity_id, vocabulary_id, role)` does not prevent role=NULL duplicates.** Either change `role` to `NOT NULL DEFAULT ''` or add a partial UNIQUE index `WHERE role IS NULL`.
3. **§3.3 "arbitrary depth" claim is unsupported by §5.5 queries.** Either deliver recursive CTEs or restrict the architectural promise to one-level-deep.
4. **`entity.data` JSON polymorphism is a special case.** Either own the relocation honestly ("F=ma at the data layer; rendering remains code") or propose a render-config-as-data mechanism.
5. **FK ON DELETE behavior must be declared in schema, not asserted in prose.** Specify CASCADE vs. RESTRICT for both `association.entity_id` and `association.vocabulary_id`. Address what happens on vocabulary hard-delete.

### Serious (should fix before lock)

6. **`vocabulary.kind` typo/case-sensitivity protection.** Either CHECK constraint or FK to a `vocabulary_kinds` reference table.
7. **`(retirement_at)` partial index targets the wrong workload.** Listed predicate `WHERE retirement_at IS NOT NULL` doesn't cover the visitor query `(retirement_at IS NULL OR retirement_at > now())`.
8. **Tier 3 dynamic ordering query is undocumented.** Show the realistic 4-table-aggregate per-render cost, propose materialization or accept the cost.
9. **CURATE vs. REVISE distinction is not in the schema.** Either add explicit state, document the inference rule, or admit they collapse in this model.
10. **Tier 1/2 "locked membership" is not enforced.** Either add CHECK/trigger preventing Tier 1/2 mutation, or revise `CANONICAL_VOCABULARY.md` to drop the "locked" language.
11. **Concurrent-write story is missing.** Add `version`/`etag` column or document the lost-update behavior.
12. **Preset URL should be a hash, not the entity's ULID directly.** §5.7's "either/or" should commit to "hash" to match the UX promise of "cryptic but stable."
13. **Backup/restore portability of partial state is not addressed.** At minimum, document that only full-database backups are restorable.
14. **`PRAGMA foreign_keys = ON` requirement at connection time must be specified.** Otherwise FK CASCADE/RESTRICT claims throughout §6/§7 don't apply.
15. **Dangling vocabulary references inside `entity.data` JSON have no cleanup story.** Address.
16. **Multi-pill within-OR / across-AND query shapes are not shown.** Demonstrate that the architecture supports them at scale.

### Minor (acceptable as-is or low-priority)

17. **PUBLISH and LIVE collapse in the data.** Acknowledge in §5.4 to avoid future readers expecting six-vs-eight stage consistency.
18. **Vocabulary retirement vs. entity soft-delete cosmetic uniformity.** Clarify the visibility difference in prose.
19. **`kind_id` referencing the wrong vocabulary kind is unenforced.** Add a CHECK via subquery or a trigger.
20. **ID format inconsistency (slug-based for seeds, undefined for runtime entries).** Specify the runtime format.
21. **Schema evolution asymmetry.** Mention that additive changes are easy and structural changes are not.

### Acceptable but worth noting

22. **§9.5 exhibit-namespace render-strip** is honestly admitted as a special case. Fine. Accept.
23. **The three-table backbone is sound.** F=ma at the data layer is real. The critique above is about the spec overclaiming, not about the schema being wrong.

---

## §7 — Reviewer's confidence

**High confidence** in:
- §1.4 (UNIQUE NULL bug — verifiable in any SQLite shell)
- §1.6 (FK ON DELETE not declared in schema — textual reading)
- §2.2 (hit-count query is wrong — semantic certainty given `CANONICAL_VOCABULARY` requirements)
- §3.3 (PUBLISH/LIVE collapse, CURATE/REVISE collapse — purely structural)
- §4 (operator wishes — each requires real schema work; verifiable by attempting the queries)
- §5.4 orphan/dangling problems — these are well-known SQLite footguns

**Medium confidence** in:
- §1.3 (recursive-tree query gap) — high confidence the spec doesn't show the recursive CTEs; medium confidence the operator will actually want >1 level depth in practice
- §2.1 (planner behavior under realistic load) — without `ANALYZE` and benchmark data, I'm extrapolating from SQLite's documented behavior rather than measuring
- §1.5 (preset URL guessability) — depends on whether preset URLs are ever crawled; museum is anonymous-first so the threat model is narrow

**Lower confidence** in:
- §3.4 (Tier 1/2 lock interpretation) — `CANONICAL_VOCABULARY` says "locked membership" but I can't tell whether the operator intends this as "schema-locked" or "social-norm-locked"
- §5.5 (atomicity) — minor, may not matter

**What would resolve uncertainty:**
- A run of the §5.5 queries against a 10K-entity sample with `EXPLAIN QUERY PLAN` would settle §2.1 definitively.
- An operator statement about Tier 1/2 mutability would settle §3.4 and §1.1's CHECK-vs-FK choice.
- An operator statement about whether visitor preset URLs need to be unguessable would settle §1.5.
- An operator statement about whether backup/restore of partial state is a requirement would promote §5.2 from serious to either critical or minor.

---

*End of critique.*
