# Tagging/Filtering Model — Locate Report (READ-ONLY)

**Generated:** 2026-06-13
**Repo:** `C:\AI\Projects\weird-baby-museum` (canonical)
**HEAD:** `955fc99` (`backlog: log off-site backup (6/17+) and route-status table`)
**Branch:** `main`, fully in sync with `origin/main` (HEAD is pushed; no ahead/behind)
**Mode:** read-only. Nothing edited, staged, committed, or pushed. This report is the only file written.

---

## Verdict

**EXISTS-PARTIAL.**

A new **filtering** model is written and committed: `docs/discovery-filter-ux-spec.md` ("THE STACKS"). A matching new **tagging / metadata data-model** — the part that would actually *replace* the current model and tell you how artifacts get **retagged** — is **not written**. It exists only as deferred hand-off/reconciliation notes. Nothing found says to **scratch** the existing model, and nothing specifies a retag procedure tied to the new filter model.

---

## What was searched

- Tracked-file sweep of `docs/`, `docs/deep-dive-review/`, `docs/canonical/`, `docs/taxonomy/`, `docs/archive/`, and repo root.
- `docs/CANONICAL_VOCABULARY.md` (vocabulary authority) and `docs/deep-dive-review/SPEC_DRAFT_v5_2.md` (active discovery-spec head).
- Git log `e1c2a20..HEAD` and `1d8c58f..HEAD`, plus an all-branch `git log --grep` for `tag|filter|discover|vocab|retag|taxonom|reconcil`.
- Content grep across all tracked `.md`/`.html` for replacement-model language: `scratch | reinvent | replace the (current|existing|old) | supersede | from scratch | greenfield | new (tagging|filter|discovery|taxonomy) model`, plus `retag | migrat`.
- Filename search for any `*discover*` / "Discovery metadata" / "Artifact Discovery & Filtering" companion doc.
- Working-tree (uncommitted) diff inspection.

---

## What was found

### 1. `docs/discovery-filter-ux-spec.md` — "THE STACKS" discovery-filter UX spec  ← the real find
- **Git truth:** TRACKED. Introduced and last touched in **`e1c2a20`** (the orientation commit). **Committed and pushed** (ancestor of `origin/main`); sits 3 commits behind HEAD. Clean (not dirty).
- **What it defines:** a new *filtering* model — status "v1.0, UX nailed in prototype, ready to design into the system." Two-tier facet model (Basic/perusal vs. Detail/hunt); a **total-vs-partial facet engine** where partial facets *scope* rather than *filter* (off-facet artifacts are exempted, not amputated); **Kind and Format deliberately split** into two separate required facets; **Threads** (saved filter-sets, merging the old "presets" idea); commit-on-OK static-deck interaction.
- **Does it scratch the existing model?** **No.** It contains no scratch/replace/migration language at all. It rejects specific *prior prototype* ideas (the progressive "spine," the "untagged" catch-all chip) but does not retire the current tagging model.
- **Does it specify retagging?** **No.** Its §9 ("Metadata implications — hand-off to the data model") only *lists requirements* a future data-model spec "must add/confirm": `facet_type: total|partial` on every facet; Kind and Format as separate required tags; null is meaningful on partial facets; Importance stays a hidden curator field; Threads stored as saved filter-sets. No mapping, no migration, no per-artifact procedure.
- **Dangling companion:** its header cites a companion "Museum Artifact Discovery & Filtering (metadata model + UX)" doc. **That metadata-model doc does not exist in the repo** — no `*discover*` file other than this UX spec; the only other hits are passing *mentions* in SPEC_DRAFT files, `END_TO_END_MAP.md`, and the orientation note.

### 2. `docs/taxonomy/` — MediaVault Taxonomy v1 (a *different* thing; not the replacement)
- **Files / git truth:** `TAXONOMY_v1.md` (last `3b5a51c`), `RETAG_PLAN.md` (last `b1a1c4e`), plus `NORMALIZATION_MAP.md`, `COVERAGE_PROOF.md`. All TRACKED, committed, pushed (2026-06-09).
- **What it is:** a *targeted promotion* of the live MediaVault SQLite namespaces — Identity→Tier-1, classification→Tier-2, a few promoted Tier-3 axes, flat `attributes` bag for the rest. `RETAG_PLAN.md` is a real retag procedure (`tools/retag_v1.ps1`, Mike runs it on the host) over 185 artifacts.
- **Why it is NOT the answer:** it is **additive, not a scratch-and-replace** — `new_tags = (unsorted:<v> → MAP[<v>]) UNION (all other current tags)`; it explicitly preserves existing tags and even *defers* cross-namespace collapses. It promotes/cleans the existing MV vocabulary; it does not re-invent the tagging+filtering model and is unconnected to THE STACKS facet engine. (Mentioned here so it isn't mistaken for the replacement.)

### 3. `docs/deep-dive-review/SPEC_DRAFT_v5_2.md` — current discovery-spec head (model of record)
- **Git truth:** TRACKED. Active, non-archived head of the "Tag-Based Artifact Discovery" spec line (v2–v5.1 archived). Committed at HEAD-side, **but the working copy is currently DIRTY** — see caveat below.
- **Relevant content:** committed §"Deferred — discovery data-model reconciliation (logged 2026-06-13)" (added in **`11e0450`**): *"Before any discovery data-model work, reconcile `discovery-filter-ux-spec.md` §9: `facet_type: total|partial` on every facet; split Kind from Format into two required tags."* This is a **deferral pointer**, not a model.

---

## Working-tree caveat (uncommitted, not trusted)

`git status` shows the tree is mid-edit:
- `docs/deep-dive-review/SPEC_DRAFT_v5_2.md` — **DIRTY and truncated**: the uncommitted version chops the §9 deferred note down to a half-line (`### Deferred — discovery data-m`) and drops the file's end marker. This looks like an in-progress/botched edit, not a finished change. **Report uses the committed (`955fc99`) version, not this damaged working copy.**
- `STATE.md` — DIRTY (canonical-docs section being trimmed; a child-spec pointer removed).
- `BACKLOG.md` — DIRTY.
- `museum-orientation-e1c2a20.md` — untracked (the prior orientation pass output).

None of this changes the verdict; flagged for truth-ranking honesty (live tree is mid-edit here, so committed state is the reliable record).

---

## Cross-check vs. the model of record (SPEC_DRAFT_v5_2 + CANONICAL_VOCABULARY)

**The found filter spec is consistent with the logged §9 reconciliation note — it does not supersede the model of record.**

- The SPEC_DRAFT_v5_2 deferred note explicitly points *at* `discovery-filter-ux-spec.md §9` and marks reconciliation as **not-yet-done** ("Before any discovery data-model work, reconcile…"). The two documents agree: the filter spec hands requirements *to* the data model; the data-model spec defers picking them up.
- **Reconciliation is genuinely pending, not applied.** `CANONICAL_VOCABULARY.md` (the vocabulary authority) has **no `facet_type` / total-vs-partial concept**, and its Tier-1 facets are `year / album / song / venue / people` — it does **not** carry the filter spec's `Kind` vs `Format` split. So the new facet schema has not been merged into the authority.
- Net: `SPEC_DRAFT_v5_2.md` + `CANONICAL_VOCABULARY.md` **remain the model of record.** THE STACKS is a committed, approved-direction *filtering* spec staged as next work; the *tagging/metadata* model it requires has not been written, reconciled, or applied, and no document instructs scratching the current model or retagging artifacts to the new one.

---

## One-line verdict

**EXISTS-PARTIAL** — the new *filtering* model (THE STACKS, `docs/discovery-filter-ux-spec.md`, committed `e1c2a20`, pushed) is written; the new/replacement *tagging* data-model that would scratch the current model and specify retagging is **not** written — only deferred reconciliation notes point at it.
