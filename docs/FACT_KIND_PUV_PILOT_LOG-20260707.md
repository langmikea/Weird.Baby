# `fact` Kind + PUV Pilot — RUN LOG

**Brief:** `FACT_KIND_PUV_PILOT_BRIEF-20260707.md` · **Authority:** PUV_FACT_MODEL_SPEC.md + MV vocab migration run log (deferred items) + kind-governance-spec.md. Spec outranks brief on conflict.
**Run date:** 2026-07-07 · **Executor:** Ops (Claude, Cowork) · **Host execution + gates:** Mike
**Pattern:** ALL DB writes host-side pwsh; paste-back verified; explicit "pass" from Mike at every gate; commit gate every stage (Stage 0: record only, no commit per brief).
**Stop conditions:** any Stage-2 integrity mismatch · any Stage-5 client error · any vocabulary change not named in the brief/deferred list.

Orientation verified this session (read-only): WBM HEAD `2e2e789` (brief committed), MV HEAD `15e5bda` — both match the migration run log's close. Prerequisite (vocabulary reconciliation complete) confirmed against `MV_VOCAB_MIGRATION_LOG-20260624.md`: Stages 0–4, 6, 8 all PASS, deploy `ffcf7fbd`, `fact` add explicitly deferred to this workstream (F10/Stage 7).

---

## STAGE 0 — Backup (MANDATORY FIRST)

- Script: `tools/fact_kind_stage0_backup.ps1` (written this session; Mike runs host-side, MV server stopped).
- Writes: `core/backups/mediavault_pre-fact-kind-<UTC>.sqlite` (+ throwaway verifier in %TEMP%). `core/backups/` gitignored by policy; durable home = OneDrive mirror.
- Verification to capture from paste-back: backup path; SRC/DST byte + sha256 match; `PRAGMA integrity_check` = ok on the BACKUP opened read-only; artifacts=293; band=288/bands=0/fact=0; vocabulary=22 rows; kind column filled=146; current artifacts DDL kind-CHECK region (feeds Stage 1 delta); git status/log both repos.

**Paste-back (2026-07-07T02:08Z, verified):**

- Backup: `core/backups/mediavault_pre-fact-kind-20260707T020813Z.sqlite`
- SRC/DST both 1,953,792 bytes; sha256 both `2848EBE829DBC8CA398B23EC5A50A32AC81267EBE8D2F62715FE87310224BCA9`; no WAL/SHM present.
- Backup read-only open: `integrity_check=ok`; artifacts=293; band 288 / bands 0 / fact 0; vocabulary 22 rows; tags registry 211 slugs (consistent with migration Stage 2 close 210 − 2 drops + 3 adds in Stage 3); kind column filled 146 (release 107, performance 23, candid 9, announcement 6, studio 1, NULL 147).
- Current artifacts DDL kind CHECK captured (feeds Stage 1): `CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan'))` — 7 values, `fact` absent, column nullable (containers exempt per kind-governance-spec §2).
- Git at gate: MV clean at `15e5bda`; WBM at `2e2e789` with 2 expected untracked files (this log + stage0 script). No commit this stage per brief; both files ride a later commit gate.

**Gate: PASS** (Mike, explicit, 2026-07-07). Delegation arrangement stated on the record: read-only/verification gates (0, 1, paste-back checks) — delegated; verifier's pass counts when every expected check is clean, ANY anomaly escalates to Mike. Never delegated: Stage 2 swap go-ahead, Stage 4 fact wording (voice = UX = Mike), rider scope.

---

## STAGE 1 — Authorities delta (read-only)

Sources read this session: PUV_FACT_MODEL_SPEC.md, MV_VOCAB_MIGRATION_BRIEF/LOG-20260624.md, kind-governance-spec.md, live DB (Stage-0 backup, sha256-matched to host paste-back `2848EBE8…` — mount verified current for the DB), `tools/export-artifacts.mjs` (host-side reads), `core/tag_vocabulary.json` (HOST-side reads only — the bash mount serves the STALE pre-Stage-6 copy, 3,369 bytes / Jun 13: READ-LAG hazard reconfirmed live, per OPERATIONS §8).

### 1. Current kind CHECK set (host-verified, Stage 0 paste-back)

`CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan'))` — 7 values, column nullable (containers exempt, kind-governance-spec §2), appended after `archived_at`, `referenced_dates` follows. Filled 146/293 (release 107, performance 23, candid 9, announcement 6, studio 1; NULL 147).

### 2. What the rebuild adds

**`fact` — and nothing else.** F10 (locked): "`fact` joins the `kind` COLUMN — but that is Stage 7, a SEPARATE later workstream." The deferred list names no other CHECK change; content_kind/card_kind kept (F4/F5), artifact_kind/format routing is backlog, harmonica is the rider (own commit, after Stage 3). New set = existing 7 + `'fact'` (8 values). Everything else byte-preserved.

Rebuild mechanics ground-truthed: no triggers, no views; 6 named indexes on artifacts (+ PK autoindex) — DDL captured; only FK is the self-FK `parent_artifact_id REFERENCES artifacts(id) ON DELETE CASCADE`; `ingest_queue.artifact_id` is a plain column, NO FK — no external dependency. 28 columns.

### 3. Fact-artifact shape (spec → live columns)

- **Kind:** `kind='fact'` column; `media_type='text'`; `status='released'` (required — export selects released+badged only); tag `exhibit:hunter_root` (export discovery keys on it).
- **Fact text (two-line surface):** `description_short` = line 1, `description_long` = line 2 — exactly the fields the exporter already emits as `title`/`description`. No new field, no schema change.
- **Breadcrumb:** `source_url` where a URL exists; `source_platform` + matching `source:` tag from the RECONCILED allowed set only (preserves the migration's tag==column invariant); marker values for sourceless facts (`operator-knowledge`/`artist-direct`/`unverified` — spec-named) live in `ingest_source` (ungoverned free field, existing values are ingest-channel strings). `referenced_dates` available for the Nick-Root-2021 date.
- **Scope tags:** existing namespaces only — `band:`/`album:`/`song:`/`era:`/`topic:`. No new namespace.
- **Weight:** NO home in the live schema (no column; kind values are not tags). PROPOSED: defer weight to the FactScroller re-wire workstream (no consumer exists in this brief). Decision at Stage 4 gate.
- **Vote slot:** reserved, unbuilt, nothing to do (spec Deferred).
- **id:** `MV-HR-{YYYYMMDD}-{seq}` per id_format registry + `id_sequence` table.

### 4. FLAGS (anomalies — escalated, not improvised)

- **FLAG A — brief vs registry ground truth.** Brief Stage 3 says "Register `fact` in the vocabulary registry (usage_count 0)". Ground truth: kind values are NOT in the DB `vocabulary` table (no kind namespace row) and NOT in the `tags` registry (zero `kind:*` slugs) — Kind's registry is the `kind_column` block in `tag_vocabulary.json` (which already notes "fact joins this set in the later fact workstream"). Spec-conformant resolution (spec wins): Stage 3 = add `fact` to `kind_column.values` + `value_meta`; DB vocabulary table untouched; regenerated client `vocabulary.json` expected content-identical. No `tags` row is created — a `kind:fact` slug would put a non-tag in the tag registry, diverging from all 7 existing kind values.
- **FLAG B — Stage 5 expectation vs exporter reality.** `PER_EXHIBIT_SQL` does NOT select the `kind` column — the client never sees `kind='fact'`, so "client errors on unknown kind" is structurally impossible. BUT released fact artifacts WILL export as ordinary records → render as placeholder text tiles on the /hr wall and count in filter-board facets. Visible UX consequence; Mike decides at the Stage 4 gate (before any insert): accept tiles for pilot / hold facts at vault (conflicts with brief's "facts present in hunter_root.json") / exporter guard (code change — flagged loudly per brief). Also: Stage 5's "vocabulary carries `fact`" is satisfied by `tag_vocabulary.json` kind_column, not client vocabulary.json.
- **FLAG C (minor) — display label** for `fact` in `value_meta` ("Fact"?) — Mike's word; bundle with Stage 4 gate.

**Gate: PASS** (Mike, with the Stage 2 swap approval). Flag resolutions: **A** — spec-conformant reading accepted (kind_column block IS the registry; no DB registry row). **B — Mike chose option (b): pilot facts stay `status='vault'`, NOT released.** Deliberate deviation from the brief's Stage 5 wording ("facts present in hunter_root.json"), Mike's call at gate, UX authority: no fact tiles on the wall, no facet-count changes. Stage 5 verification INVERTS: export runs clean, facts ABSENT from hunter_root.json (vault never exports — established), export content-idempotent vs pre-insert. **C + weight** — still queued for the Stage 4 gate.

---

## STAGE 2 — Table rebuild: kind CHECK gains `fact` (host-side)

- Script: `tools/fact_kind_stage2_rebuild.ps1` — pinned to Stage-0 sha256; one transaction; all parity checks BEFORE the drop; rollback-on-any-mismatch; post-swap FK/integrity/distribution/invariant checks; stop-condition on any failure.
- **Swap gate: APPROVED by Mike explicitly (undelegated) — "Swap approved — go."**

**Paste-back (2026-07-07, verified):**

- Preconditions: no WAL/SHM; live sha256 == pinned `2848EBE8…`.
- Rebuild: 293 rows copied; two-way EXCEPT parity 0/0 across all 28 columns; swap + 6 indexes recreated; `foreign_key_check` 0; `integrity_check=ok`.
- Post-swap: new DDL carries `CHECK(kind IN (…,'interview','fan','fact'))` exactly once; column list identical (28); named indexes 6/6; kind distribution unchanged (147 NULL / 107 release / 23 performance / 9 candid / 6 announcement / 1 studio); source tag==column 293/293; band 288; vocabulary 22 rows. `REBUILD_OK`.
- Live DB sha256 now `F983A84014BD31626BDC8B3733DA1DEE533172C080B75D5032E3808B87BA2E7F`; no WAL/SHM.
- Git: MV clean (DB untracked by policy); WBM 3 untracked (this log + stage0/stage2 scripts) — ride this stage's commit gate.

**Gate: PASS** (Ops verification verdict per delegated paste-back check — every expected value clean; swap itself was Mike's explicit approval).

**Commit gate:** `cf17d5c` pushed (`2e2e789..cf17d5c`); `status --short` clean post-commit; hash confirmed in log.

---

## STAGE 3 — Register `fact` + regenerate surfaces

Per Flag-A resolution: registration = `core/tag_vocabulary.json` `kind_column` block (the Kind registry); DB vocabulary/tags tables untouched (no kind:* slugs exist for ANY kind value — verified). Edits (Cowork host-side file tools, mount-lag safe): `fact` appended to `kind_column.values` + `value_meta` entry (label "Fact" — assume-and-stated, Mike's word invited at the Stage 4 gate per Flag C) + note updated to record the 2026-07-07 landing; `_meta.generated_from` refreshed (211 registry slugs — was stale at 210).

- Script: `tools/fact_kind_stage3_verify.ps1` (READ-ONLY) — DB CHECK = 8 values with `fact` last; 0 kind=fact rows yet; vocabulary 22 / registry 211 / no kind:* slugs; tag_vocabulary.json ≡ DB (kind_column == CHECK, namespaces == registry, tier/sort mirror); client vocabulary.json 22 rows ≡ vocabulary table; hunter_root.json 33 artifacts, no fact records.
- Sequence: Cowork edit → Mike: MV server up → `npm run export-artifacts` (client vocabulary.json regeneration expected content-identical — vocabulary table unchanged; hunter_root.json timestamp-only churn expected per Stage-8a precedent) → verify script → paste-back → commit gate.

**Paste-back (2026-07-07, verified — third run CLEAN):**

Run history, honest: (run 1) export skipped — MV not launched — AND verifier FAIL that was a **verifier bug, Ops' error**: vocabulary.json is `{metadata, namespaces:[22]}` and the check measured top-level dict keys (2) instead of rows. Fixed; a freshness check added (exported_at must postdate Stage-8a's 01:40:59Z) so the paste-back proves the export ran. (run 2) freshness check correctly caught the export failing again (server closed early — check did its job). (run 3) export clean with MV up: 33 artifacts / **199,282 bytes — byte count identical to Stage-8a, content idempotence as predicted**; vocabulary 22 rows; documented-harmless UV_HANDLE_CLOSING. Verify: 13/13 OK — DB CHECK 8 values with `fact`; 0 kind=fact rows; vocabulary 22 / registry 211 / no kind:* slugs; artifacts 293 / integrity ok; tag_vocabulary.json ≡ DB (kind_column == CHECK order, namespaces == registry exact, tier/sort mirror); client vocabulary.json 22/22, exported_at 2026-07-07T02:44:31Z (fresh); hunter_root.json 33 artifacts, no fact records. `STAGE3_VERIFY CLEAN`.

Git at gate: MV `M core/tag_vocabulary.json`; WBM `M` run log + hunter_root.json + vocabulary.json (timestamp churn per Stage-8a precedent) + `??` stage3 script. All expected, nothing stray.

**Gate: PASS** (Ops verdict per delegated paste-back check — every expected value clean).

**Commit gate (spans both repos):** MV `903d52d` pushed (`15e5bda..903d52d`), WBM `e857cac` pushed (`cf17d5c..e857cac`); both `status --short` clean post-commit; hashes confirmed in logs.

---

## RIDER — `instrument:harmonica` (after Stage 3, own commit)

Ground truth: migration did NOT add it (no `instrument` namespace among 22 vocabulary rows; WBM `f19014e` logged it HELD — operator-list required, zero text evidence). Escalated to Mike (rider scope undelegated) with the registry constraint stated: zero-zero-usage invariant means no slug registers at usage 0 — either (a) Mike names artifacts now (one script: tag + register slug at true count + `instrument` namespace row) or (b) stays HELD. **Decision:** stays HELD (assume-and-stated to Mike with the Stage 4 package, not countermanded; matches `f19014e` recorded state; nothing registers at zero usage).

---

## STAGE 4 — Pilot facts (wording gate: MIKE, undelegated)

**Wording gate CLOSED (2026-07-07, Mike):** four facts (Mike expanded from three — brief allows 3–5), text verbatim his. Two brief premises overturned at the gate, content authority = Mike:

1. **Death-year dropped** — "2021 corrects 2020" premise UNVERIFIED per Mike; no date appears anywhere in Fact 1; `referenced_dates` NULL.
2. **RWTH corrected** — brief said "confirmed band, Manheim PA"; Mike: **first solo record** (transitional). Facts 2/4 carry `album:run_with_the_hunt`.

The facts (ids MV-HR-20260707-001..004): (1) Nick Root — older brother, gone at 27, cancer; breadcrumb Americana Highways (in-vault MV-20260617-011), corroboration noted. (2) RWTH first of the solo records, Manheim PA; breadcrumb ReverbNation (MV-HR-20260416-009). (3) Founding member of SEEDS → Medusa's Disco rename due to trademarks; breadcrumb Blue Harvest 2014 (MV-20260617-001), trademark reason = operator knowledge. (4) RWTH transitional piece to the modern solo career; breadcrumb ReverbNation, characterization = operator knowledge.

All four: `kind='fact'`, `media_type='text'`, **`status='vault'`** (Flag B option b), `storage_mode='url_only'`, `ingest_source='cowork'`, lines = `description_short`/`description_long`, provenance trail in `notes`. Every source is a REAL in-vault artifact URL — no sourceless markers needed for the pilot; marker-set finalization deferred with the FactScroller work. Weight: DEFERRED to FactScroller re-wire (assume-and-stated, not countermanded). Label "Fact" stands. Zero vocabulary changes: all 22 tag payloads use existing slugs (script hard-aborts otherwise).

- Script: `tools/fact_kind_stage4_insert.ps1` — pinned to post-Stage-2 sha256 `F983A840…`; precondition-guarded (ids/sequence/fact-rows absent, all slugs registered); one transaction; pinned 11-slug registry delta; post-asserts 297 artifacts / 4 facts / registry 211-0-0 / source agreement 297; SELECT-back of all four facts as queryable proof; rollback untouched on any mismatch.

**Paste-back (2026-07-07, verified):** preconditions held (sha `F983A840…` matched, no WAL/SHM); registry delta == pinned 11 slugs exactly; artifacts 297 / kind=fact 4; registry 211 slugs, 0 mismatches, 0 zero-usage; source tag==column 297/297; `integrity_check=ok`; all four facts SELECT-back verbatim with breadcrumb URLs. `STAGE4_INSERT_OK`. Live DB sha256 now `CA49A556CD08306775DFFDAB969621AD6D33A7303F25A7D7804A97FBD2066B40`.

**Gate: PASS** (Ops verdict per delegated paste-back check; wording was Mike's, undelegated, closed above).

**Commit gate:** `7edd002` pushed (`e857cac..7edd002`); status clean except the expected untracked stage5 script (rides Stage 5's commit); hash confirmed in log.

---

## STAGE 5 — Export + client sanity (expectation INVERTED per Flag B option b)

Facts are vault-status → they must be ABSENT from the export, and the export must be content-idempotent (only `exported_at` churn). Client-error stop condition is structurally defused twice over: exporter never emits the `kind` column (Stage 1 delta), and no fact reaches the export at all. Content-identical export ⇒ the DEPLOYED client already proves render-unregressed; no rebuild/deploy expected (Stage 6 deploy = no-op unless this stage surprises).

- Script: `tools/fact_kind_stage5_export_verify.ps1` (READ-ONLY) — DB 297/4/integrity ok, 4 facts still vault; hunter_root.json 33 artifacts, zero `MV-HR-20260707` ids, no kind leakage, fresh exported_at; vocabulary.json 22 rows fresh; then git diff proof (expect ONLY exported_at lines in the two data files).

**Paste-back (2026-07-07, verified):** 8/8 OK — DB 297/4/integrity ok, facts all vault; hunter_root.json 33 artifacts, zero MV-HR-20260707 ids, no kind leakage; both exports fresh (03:11:39Z). Content-idempotence PROOF: git diff shows exactly 2 changed lines across both data files — both `exported_at`. `STAGE5_VERIFY CLEAN`. No client error possible and none observed; no build, **no deploy needed** (client artifacts content-unchanged).

**Gate: PASS** (Ops verdict per delegated paste-back check).

**Commit gate:** `3b7923c` pushed (`7edd002..3b7923c`); status clean; hash confirmed in log.

---

## STAGE 6 — Close

- **Deploy: NO-OP, by design** — client artifacts content-unchanged (Stage 5 proof); weird.baby stays at `ffcf7fbd`. Per brief: "deploy only if client artifacts changed" — they did not.
- STATE.md: new SHIPPED block added above the vocab-migration block (this ID, 4 facts, vault status, corrections at gate, deferrals, no-deploy rationale).
- Backup retained: `core/backups/mediavault_pre-fact-kind-20260707T020813Z.sqlite`. STANDING REMINDER: OneDrive mirror is the durable home for DB backups (per Delivery & Commit Gates #4) — carry this one over with the next mirror refresh.
- Deferred, recorded: FactScroller tag-based re-wire + fact display UI (Mike-led) + weight + sourceless-marker set = the next workstream (spec §Execution 4–5); fact COLLECTION brief beyond the pilot also still ahead; harmonica rider HELD.
- DB head state at close: 297 artifacts / 4 facts / kind CHECK 8 values / registry 211-0-0 / integrity ok / sha256 `CA49A556…`.

**PILOT COMPLETE.** Stages 0–5 executed and gated; Stage 6 close rides the final commit below. Every DB write ran host-side by Mike; every gate has an explicit verdict on this record; spec-vs-brief conflicts resolved spec-first (Flag A) or by Mike's authority (Flag B, wording corrections).

**Final commit gate (session close):** _recorded in the commit that carries this line — hash in `git log`._
