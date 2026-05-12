# Museum Data Workflow Spec, v0.2 (design-reviewed)

**Date:** 2026-05-12
**Status:** Design review against `UX_LIFECYCLE_SPEC_v0.5.md` complete. Operator review pending.
**Authority:** This spec describes the end-to-end data workflow of museum artifacts. It is a companion to `UX_LIFECYCLE_SPEC_v0.4.md` (the UX-side spec) and extends `MUSEUM_OPS.md` (operator workflow rules). Where the UX spec describes *what visitors and operators experience*, this spec describes *what happens to data* — from acquisition source through MV storage, through transformation, through export, into the museum's renderable form, through retirement, through soft-delete.

**Scope:** Capability-level only. No implementation, no schemas, no APIs. Describes what the system MUST be able to do with data, not how.

---

## §0 — The Principle: F=ma

**Locked, operator-direct.**

Same principle as the UX spec. Data is uniform. Tags drive system behavior. Special cases are forbidden without mutual approval.

Where the UX spec asserts F=ma over surfaces, this spec asserts F=ma over the data those surfaces consume.

---

## §1 — The Eight Data Stages

The data side of every artifact moves through these stages. Stages are observable to the operator and, where relevant, drive system behavior. The stages mirror the UX lifecycle (`UX_LIFECYCLE_SPEC_v0.5.md §2`); this spec describes them from the data side.

**Presets are artifacts** under F=ma (`UX_LIFECYCLE_SPEC §4.5`). They flow through the same eight stages as any other artifact — with one variance: ACQUIRE for a preset is an internal authoring action (operator or visitor creates a preset from a configured view) rather than an external source. INTAKE, CURATE, PUBLISH, LIVE, REVISE, RETIRE, DELETE behave identically to media artifacts. Visitor-created shareable presets enter via a visitor INTAKE surface (separate spec); operator-created presets enter via the curation surface.

**Notes are artifacts** under F=ma (`UX_LIFECYCLE_SPEC §6` closed decisions). They flow through the same eight stages, with the same INTAKE/PUBLISH/LIVE story. Notes carry an attachment relation tag (`attaches-to:<artifact-id>` or similar; schema in architect scope) to reference the artifact they're left on. Visitor notes enter via a visitor INTAKE surface (separate spec).

| Stage | Data-side meaning |
|---|---|
| **ACQUIRE** | A source has been identified. No system data exists yet. |
| **INTAKE** | A new artifact record is created with stable identity. Source-derived data populates where feasible. |
| **CURATE** | The operator edits the artifact in place — tags, descriptions, dates, attribution. |
| **PUBLISH** | The artifact's born-on date is past or present. The system permits it to flow to the museum render layer. |
| **LIVE** | The artifact appears in the museum's exported per-exhibit data files and renders for visitors. |
| **REVISE** | The operator edits a live artifact in place. Changes propagate to subsequent exports. |
| **RETIRE** | The artifact's retirement date is past or present. The system stops including it in exports. The MV record remains. |
| **DELETE** | The operator soft-deletes. The artifact is moved to a separate storage location with sufficient context to evaluate later "is this safe to hard-delete?" |

---

## §2 — Capability Invariants

The data system MUST support every one of these.

1. **Stable identity from INTAKE forward.** Every artifact gets an internal ID at intake. The ID never changes for the life of the artifact.
2. **Edit-in-place.** Operator edits modify the artifact's record directly. No versioning. No supersession. No edit history.
3. **Sovereign tag set.** The artifact's tags belong to the artifact. The system can refuse to surface a tag (e.g., strip `exhibit:` at render) but never removes a tag from the record.
4. **Date-driven lifecycle.** Born-on and retirement dates are data, not action flags. The system reads them; the operator sets them.
5. **Loud failures.** Every failure mode — INTAKE failure, export failure, MV-unreachable — surfaces to the operator with enough detail to act. Silent rejection is forbidden.
6. **Provenance inside the artifact.** Source URL, submission date, fan attribution (when applicable) are artifact fields, not separate records.
7. **Source preservation when feasible.** INTAKE attempts to preserve the full source artifact (download the file, capture the page) when the source permits. Falls back to reference-only otherwise. Not a norm; an opportunistic capability.
8. **Soft-delete is reversible.** Soft-deleted artifacts are relocated, not destroyed. The operator can later evaluate "safe to hard-delete?" with full context.
9. **Operator-explicit release gate.** Code reaches production only when the operator explicitly marks it release-ready. No auto-promotion. See `CLAUDE.md` Release discipline for the authoritative rules.
10. **Vocabulary entries have stable internal IDs.** Renames of slug or display name do not affect the artifacts referencing the entry. (Locked 2026-05-12.)

---

## §3 — Stage-by-stage detail

### §3.1 — ACQUIRE

**Trigger:** Operator decides a source should become an artifact.

**Data state:** Nothing exists yet. ACQUIRE is intent.

**Sources:**
- URL (links to existing public content)
- File (uploaded media — operator-curated, including fan submissions)

**No system action.** ACQUIRE is the operator's mental act of choosing.

### §3.2 — INTAKE

**Trigger:** Operator submits the source via URL paste or file upload.

**Data actions:**
- System assigns a stable internal ID to the new artifact.
- System attempts to populate metadata from the source where feasible: title, post date, thumbnail URL, source platform.
- System attempts source preservation when the source permits (download the file or page content). Best-effort, not required. **"Permits" is interpreted technically — can the bytes be fetched?** Policy decisions about *whether to preserve* a fetchable source are operator decisions, applied per-source.
- Artifact enters MV with a provisional state (per MV's existing taxonomy — likely `inbox` or `vault`).

**Failure mode:** If INTAKE fails partway — URL unreachable, file corrupt, metadata parse fails — the system surfaces the failure to the operator with detail. **No broken record is left behind in MV.** The provisional record is cleanly removed; the operator re-acquires from the source if still wanted. (Locked 2026-05-12.)

### §3.3 — CURATE

**Trigger:** Operator opens an artifact and edits it.

**Editable fields:** All of them. Title, description, dates (post date, born-on, retirement), attribution, source URL, tags. The operator's curation surface (separate spec) presents all artifact data as editable.

**Edit semantics:** In place. The new value replaces the old. No versioning. No edit history. (See `UX_LIFECYCLE_SPEC_v0.4.md §4.4` for the rationale.)

**Durability:** An artifact may sit in CURATE indefinitely. Partial work persists. No auto-advance, no expiration.

**Tagging:** The operator attaches tags using the runtime-editable vocabulary (per `CANONICAL_VOCABULARY.md` and `UX_LIFECYCLE_SPEC_v0.4.md §4.3`).

**Vocabulary management is a visible UX surface** (locked 2026-05-12). The operator can add, rename, reorder, and retire categories and tags through a visible operator surface — not by editing config files, not by tagging an artifact with a never-before-seen namespace and hoping it springs into existence. **The surface lives inside MV** — the same tool the operator uses for artifact curation. No separate app, no separate URL. (Locked 2026-05-12.)

### §3.4 — PUBLISH

**Trigger:** The artifact's born-on date is past or present.

**Data actions:**
- The system permits the artifact to flow to the museum's export layer.
- The artifact appears in the next export run for every exhibit whose badge it carries.

**No operator action required.** PUBLISH is the system's reading of data the operator set during CURATE.

**Failure mode:** None at this stage — PUBLISH is a property, not an action. If the artifact is malformed in a way that breaks export, the failure surfaces during export (§3.5), not here.

### §3.5 — LIVE

**Trigger:** A successful export has run and the museum has rebuilt with the new export data.

**Data state:** The artifact appears in `src/data/exhibits/<exhibit_name>.json` for every exhibit it carries a badge for. The museum's render layer reads from these files.

**Export semantics:**
- Operator-initiated (per existing convention; `npm run export-artifacts`).
- Discovers exhibits dynamically from `exhibit:<name>` tag values across artifacts that pass all three filters: MV status is `released`, MV `archived_at` is null, and `born_on <= now()`.
- Writes one JSON file per exhibit.
- Atomic write (temp file + rename). Partial writes never reach the final path.

**Loud-failure conditions** at export:
- MV unreachable (specific error message naming the cause)
- MV schema mismatch (specific diagnostic naming the missing column or table)
- Crash mid-run (stack trace; no partial output)
- Released artifacts without exhibit badges (counted and reported; not an error, but visible)
- Unknown exhibit names (warned against a known-exhibits list)
- Empty vocabulary (warning, not blocking)

### §3.6 — REVISE

**Trigger:** Operator edits a live artifact.

**Data actions:** Same as CURATE — in place, no versioning. Changes propagate to the next export run.

**Visitor impact:** A revised artifact's old data persists in the deployed museum until the next export + build + deploy cycle completes. The operator decides when to deploy.

### §3.7 — RETIRE

**Trigger:** The artifact's retirement date is past or present.

**Operator UX:** The operator's curation surface presents a "retire" action (button or equivalent) that sets the retirement date to now. The button is the UX; the date is the data. There is one mechanism for retirement; the button is its surface. (Locked 2026-05-12.)

**Data actions:**
- The artifact is excluded from subsequent exports.
- The MV record is unchanged. The artifact's data, tags, and identity all persist.

**Reversibility:** Setting the retirement date to a future date (or empty) returns the artifact to LIVE eligibility on the next export.

**Multi-exhibit:** Retirement applies to the artifact globally. All exhibits stop seeing it on the next export. **To remove an artifact from one exhibit but not others**, the operator edits the exhibit-badge tag set in CURATE/REVISE — removes the exhibit's badge while leaving others. This is not retirement; it is normal tag editing.

### §3.8 — DELETE

**Soft-delete (operator UX action):** The operator chooses to remove an artifact via a "delete" action in the curation surface.

**Data actions:**
- The artifact moves **out of MV entirely** to a separate location. (Locked 2026-05-12.) Not a hidden-flag-in-MV pattern; not a separate-MV-table pattern. Physically external storage.
- Sufficient metadata accompanies the move to allow later evaluation of whether hard-deletion is safe.
- The artifact no longer appears in any MV view or any export.

**Browsing soft-deleted artifacts:** Soft-deleted artifacts are **not visible in MV**. They are out of sight. Restoring requires a separate operator action against the relocated-storage location (not part of the normal curation surface). (Locked 2026-05-12.)

**Hard-delete (no UX action in MV):** The system does not provide an operator UX action for hard-deletion *within MV's curation surface*. Hard-delete happens through a separate tool that **surfaces old soft-deletes and lets the operator confirm destruction per item or batch**. No automatic destruction by age — every hard-delete is operator-confirmed. (Locked 2026-05-12.)

**Failure mode:** If the soft-delete move fails, the artifact stays in its current MV location. No partial state. Loud failure to the operator.

---

## §4 — The export pipeline

The export is the bridge between MV (where curation happens) and the museum (where rendering happens). It is the primary data transformation surface.

### §4.1 — Where the export runs

**Operator's machine, on-demand.** Not in CI. Not at build-time on Cloudflare. Not from a server. The operator runs `npm run export-artifacts` against the operator's running MV instance.

**Why:** MV is loopback-only by design. Build-time reads from MV would require MV to be reachable from CI, which violates MV's deployment model.

### §4.2 — What the export reads

- MV's `/db` endpoint (returns the full SQLite blob)
- The museum repo's vocabulary CSV (currently `docs/deep-dive-vocabulary.csv`) — provides ordering and labeling guidance for the museum's render. (Per `CANONICAL_VOCABULARY.md`, this CSV is legacy; future cleanup may retire it.)

### §4.3 — What the export writes

For each discovered exhibit (each unique `exhibit:<name>` tag value across artifacts where `status = 'released'` AND `archived_at IS NULL` AND `born_on <= now()`):

**Note on "released":** MV's `status = 'released'` is an internal flag indicating the artifact has cleared MV's release gate. Under the date-driven lifecycle, "released" in MV is necessary but not sufficient for LIVE — the artifact also needs `born_on <= now()` to actually appear in exports. The two filters compound. (MV's `status` taxonomy predates the date-driven lifecycle; a future cleanup may rename or remove `released` as the dates carry the same information.)

- One JSON file at `src/data/exhibits/<exhibit_name>.json`
- The file contains an `artifacts` array and a `metadata` block (exhibit name, export timestamp, filter description, vocabulary CSV hash)
- Each artifact record carries: stable ID, source URL, source platform, media type, title, description, post date, released_at, born_on, retirement_at (when set), thumbnail URL, and a `tags` object grouped by namespace.

The `exhibit:` namespace is preserved in the artifact's `tags` object. The museum's render layer strips it before computing pill columns (per `UX_LIFECYCLE_SPEC_v0.4.md §4.7`).

### §4.4 — What the export does NOT do

- Does not filter for `source_platform` (no media-type gating at export — render layer dispatches on `media_type`)
- Does not deduplicate (MV's ID column enforces uniqueness)
- Does not transform tag values (renames happen in MV via the operator's curation surface)
- Does not modify MV data (read-only)
- Does not commit changes to git (operator does this manually after reviewing the diff)

### §4.5 — Atomic write semantics

The export writes to temporary file paths and atomically renames into place on successful completion. If the script crashes mid-write, the last-committed output files remain intact. The museum never sees partial export data.

---

## §5 — Release discipline

This spec does not describe testing environments. Code testing happens in development, before code reaches the museum, by whatever means the developer uses. **There is no separate render target the operator visits.** The operator sees the live museum; that is the only museum surface.

Release discipline is locked in `CLAUDE.md`. See the **Release discipline** section there for the three principles. This spec defers to CLAUDE.md as authority.

(Prior versions of this spec described a "sandbox" parallel render target. That framing was wrong — it confused dev-process plumbing with a UX surface. Removed in v0.2.)

---

## §6 — Open architectural questions (Ops)

*(none currently open — all surfaced Ops architectural questions are now locked)*

### Closed decisions (logged for audit)

- **Failed-INTAKE record disposition** → Cleanly removed. No broken records left in MV. (§3.2, locked 2026-05-12.)
- **Retirement mechanism** → The retirement date is the only mechanism. The UX presents a "retire" action whose effect is to set the date to now. One mechanism, one surface. (§3.7, locked 2026-05-12.)
- **Hard-delete operator authority** → No operator UX. Hard-delete is Ops-only. (§3.8, locked 2026-05-12.)
- **Vocabulary management is a visible UX surface** → Operator manages vocabulary through a visible surface, not by tagging into existence or editing config. (§3.3, locked 2026-05-12.)
- **Presets are artifacts** → Locked under F=ma in `UX_LIFECYCLE_SPEC §4.5`. Data spec follows the same lifecycle. (§1, locked 2026-05-12 by F=ma authority.)
- **Notes are artifacts** → Locked under F=ma in `UX_LIFECYCLE_SPEC §6` closed decisions. Data spec follows the same lifecycle, with attachment via relation tag. (§1, locked 2026-05-12 by F=ma authority.)
- **Source preservation "permits"** → Interpreted technically (can the bytes be fetched?). Policy is operator's per-source. (§3.2, locked 2026-05-12.)
- **Vocabulary entry identity** → Stable internal ID per vocabulary entry. Slug and display name are both operator-editable; artifacts reference the ID. True renames. (§2.10, locked 2026-05-12.)
- **Sandbox-as-render-target removed** → Code testing happens in dev before reaching the museum. No parallel render target exists. CLAUDE.md release discipline is authoritative. Snapshot-as-architectural-concept removed from spec. (§5, locked 2026-05-12.)
- **Soft-delete storage architecture** → Soft-deleted artifacts move **out of MV entirely** to a separate location. Not a hidden flag in MV, not a separate MV table — physically external. (§3.8, locked 2026-05-12.)
- **Hard-delete trigger** → Operator-driven via a tool that surfaces old soft-deletes and lets the operator confirm destruction per item or batch. No automatic destruction by age. (§3.8, locked 2026-05-12.)
- **Vocabulary editing surface location** → Inside MV. The same tool the operator uses for artifact curation also surfaces vocabulary management. No separate app, no separate URL. (§3.3, locked 2026-05-12.)

---

## §7 — What this spec does NOT do

- It does not specify schemas — no tables, no columns, no JSON shapes beyond what `export-artifacts.mjs` already produces.
- It does not specify code — no module boundaries, no APIs.
- It does not pick between architectural options for the open questions in §6.
- It does not address operational concerns — backup strategy, monitoring, alerting.
- It does not specify the operator's curation tool design — separate spec.
- It does not redraw what `MUSEUM_OPS.md`, `UX_LIFECYCLE_SPEC_v0.4.md`, or `CANONICAL_VOCABULARY.md` cover.

---

## §8 — Reading path

For someone new to the museum's data architecture:

1. **Read `MUSEUM_OPS.md`** for operator workflow rules.
2. **Read `UX_LIFECYCLE_SPEC_v0.5.md`** for the UX-side lifecycle.
3. **Read this spec** for the data-side lifecycle.
4. **Read `CANONICAL_VOCABULARY.md`** for vocabulary structure.
5. **Read MV's own `SPEC.md`** for MV-internal mechanics.

After reading all five, you have the complete data + UX specification of the museum.

---

*End of DATA_WORKFLOW_SPEC_v0.2.md.*
