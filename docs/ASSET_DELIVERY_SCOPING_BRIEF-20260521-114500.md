# Asset Delivery — Scoping Brief

**Date:** 2026-05-21
**Trigger:** Operator green-lit §11 B1 (Decision 6C unparked) on 2026-05-21,
following completion of §12 Criterion 8 and the source-of-truth refactor.
**Scope:** Scoping only. No code, no infrastructure setup, no asset migration
in this session. Output is this brief. Implementation is a fresh-Claude
follow-on session.
**Status:** SCOPING COMPLETE; implementation green-lit pending operator
answers to §5 (operator-call section).

---

## §0 — How to read this brief

Mirrors the format of `docs/SOURCE_OF_TRUTH_REFACTOR_SCOPING_BRIEF-20260519-220000.md`.
§1 inventories assets; §2 names the target delivery shape; §3 specifies the
build-step changes needed; §4 plans the migration; §5 enumerates operator
decisions that must be made before implementation starts; §6 sequences the
work; §7 records what is explicitly out of scope.

All technical decisions in §2-§4 are LOCKED by this brief. The fresh-Claude
implementation session executes them mechanically, modulo audit-on-entry
re-verification (a discipline that has paid for itself repeatedly).

§5 operator decisions are NOT locked. Implementation does not start until
those are answered.

---

## §1 — Asset inventory (verified 2026-05-21)

Direct query of `C:\AI\Platform\MediaVault\core\mediavault.sqlite`,
restricted to `status='released'`. 19 artifacts total:

| storage_mode | media_type | n | local_asset_path | thumbnail_path |
|---|---|---|---|---|
| `referenced` | `mixed` | 15 | set | NULL |
| `vaulted` | NULL | 3 | set | NULL |
| `url_only` | `link` | 1 | NULL | NULL |

**Substantive delivery scope = 18 artifacts** (15 referenced + 3 vaulted).
The one `url_only/link` artifact is `MV-20260518-001` (a YouTube parent);
it renders correctly via §8.2's URL synthesis and needs no delivery work.

**Zero artifacts have `thumbnail_path` populated.** This is a real finding,
not a bug. The MV schema has the column; nothing has been writing it. See
§3.3 for how this brief proposes to address it.

**File-system check needed in implementation session (NOT in this scoping
read):** for each artifact with `local_asset_path` set, confirm the file
exists on disk at the recorded path, measure its size, hash its contents.
Total-bytes-to-migrate is unknown at scoping time but should be small
(roughly 18 files; mostly photos and HTML snapshots).

The 3 `vaulted/NULL-media_type` artifacts include two the operator is
managing personally (`MV-20260419-001`, `-004`). Those are noted; the
brief does not assume their treatment.

---

## §2 — Target delivery shape (LOCKED technical decisions)

### 2.1 Object store: Cloudflare R2

Per `VISION_LOCK` and v2.1-target §6.2's recommended direction.
R2 was named explicitly; no alternative is in scope for this brief.
The operator account/billing/bucket setup is in §5 (operator-call).

### 2.2 URL shape: bucket-public read, no signing

LOCKED. Reasoning: every released artifact is by definition public
content (it's on weird.baby). Signed URLs would add complexity (expiry,
re-signing on every build) for no privacy benefit. R2's public-bucket
read access via a custom domain is the simpler, correct shape.

The custom-domain decision (e.g., `assets.weird.baby` vs `cdn.weird.baby`
vs raw `*.r2.dev`) is in §5.

### 2.3 URL persistence: content-addressed, not artifact-id-addressed

LOCKED. Each asset is stored at a path derived from its SHA-256 hash
(e.g., `assets/<sha256-first-2-chars>/<sha256>.<ext>`). Reasons:
- Idempotent: re-uploading the same bytes produces the same URL
- No artifact-id leakage in URLs (MV IDs are not stable contracts)
- Easy deduplication if two artifacts reference the same bytes
- Easy verification: visitor can verify by hashing the response

The downside — URLs are opaque — is acceptable for a curated museum
where visitors don't type URLs.

### 2.4 What lives in R2

For each delivery-scope artifact:
- The primary asset (whatever `local_asset_path` points at)
- A thumbnail derived from the primary asset (see §3.3 for shape)

Both stored at content-addressed paths. The thumbnail's path is
distinct from the primary asset's path even if they happen to be the
same image (which they won't, for thumbnails).

### 2.5 What stays in MV

- `local_asset_path` — remains canonical. The R2 copy is a delivery
  artifact, not source-of-truth. If R2 is ever rebuilt, it rebuilds
  from local files.
- `thumbnail_path` — newly populated, but points at a *local* generated
  thumbnail (see §3.3). The R2 URL is derived at export time, not
  stored in MV. Same principle: R2 is delivery, MV is truth.

### 2.6 Export layer mediates

The Museum's `tools/export-artifacts.mjs` is the only step that knows
about R2 URLs. MV doesn't know R2 exists. The Museum site doesn't
contact MV at build time (§0.5 of v2.1-target). The export script —
operator-run, post-Phase-1.1 — bridges them.

### 2.7 Image tool: `sharp`

LOCKED. `npm install sharp`; called from `tools/sync-assets-to-r2.mjs`
for thumbnail generation. No system dependency, matches the Museum's
existing Node tooling, no surprise "tool not installed" errors on
the operator machine.

---

## §3 — Build-step plumbing (LOCKED)

### 3.1 New MV-side schema field — NONE for this work

No `artifacts` column added by Asset Delivery. R2 URLs are derived,
not stored. Reasoning: derivation rule lives in code; storing the URL
would create a third location to keep in sync (file → MV → R2 URL).
v2.1-target §5.1's "no structural change to `artifacts`" stands for
columns; this work adds neither column nor constraint.

(Honest note: v2.1-target §6.1 specifies a *future* CHECK constraint
on `media_type` as part of the deferred `media_type` normalization
work — recorded in SPEC.md §6.6 by Phase 3 of the source-of-truth
refactor on 2026-05-20. That is a separate work item, not triggered
by Asset Delivery.)

### 3.2 New Museum-side tool: `tools/sync-assets-to-r2.mjs`

Operator-run. Reads MV's `mediavault.sqlite` directly via the local
filesystem (NOT via MV's HTTP loopback — §0.5's no-build-contacts-MV
rule applies to *build*, not to operator-run tools running on the
operator's machine). R2-contacting via authenticated upload.

Inputs:
- MV's `artifacts` table (released, with `local_asset_path`)
- Local file bytes at each `local_asset_path`
- R2 credentials (from operator-set environment variables)

Outputs:
- R2 uploads, idempotent by content-hash
- Updated `tools/sync-assets-to-r2-manifest.json` (committed)
  recording: artifact_id → primary_url, thumbnail_url, last_synced_at

The manifest is committed because it's the artifact-id → URL map
that `export-artifacts.mjs` reads at build time. Build doesn't
re-query R2; it reads the manifest.

### 3.3 Thumbnail generation

For each delivery-scope artifact, derive a thumbnail at sync time:
- If the primary asset is an image (`media_type` ∈ {`photo`, `mixed`}):
  generate a 400x400 thumbnail (ImageMagick or sharp), JPEG quality 85,
  uploaded to R2 alongside primary
- If `text` (HTML snapshot): no thumbnail (renders as text card)
- If `video` (none in current inventory): out of scope this phase
- If `link` (none in delivery-scope inventory): not applicable

Thumbnails are content-addressed by hash of the *generated* thumbnail
bytes, not the source bytes — so changing the thumbnail strategy later
doesn't invalidate primary URLs.

### 3.4 Export script change

`tools/export-artifacts.mjs` gains:
- Read `tools/sync-assets-to-r2-manifest.json`
- For each exhibit artifact, look up `primary_url` and `thumbnail_url`
- Emit them in the per-exhibit JSON's metadata
- Build-time static import (§8.1 of v2.1-target) now has URLs to render

### 3.5 Render dispatch change (Museum)

`src/routes/hr/` (or equivalent) currently renders placeholder tiles
when `thumbnail_url` is empty. After §3.4, real URLs are present;
tile components consume them. This is a render-layer change, not a
schema change — the JSON-import contract gains two optional fields.

---

## §4 — Migration plan

### 4.1 Pre-migration audit

For the 18 delivery-scope artifacts:
- File-system check: every `local_asset_path` resolves to an existing file
- Size check: total bytes (expected <100MB based on count + content type)
- Hash each file's bytes (SHA-256), record in pre-run report
- For the 3 `vaulted/NULL-media_type` artifacts: surface to operator
  for media_type assignment per §5.6 before sync (these will need
  §3.3's thumbnail-strategy dispatch to work)

### 4.2 First sync (one-time)

Run `tools/sync-assets-to-r2.mjs` from clean. For each artifact:
1. Read local bytes
2. Compute SHA-256
3. Check R2 for existing object at `<hash>` path
4. If absent: upload
5. Generate thumbnail per §3.3
6. Upload thumbnail to R2
7. Record both URLs in manifest
8. Mark `last_synced_at` = now

Output a run report at `docs/ASSET_SYNC_RUN_REPORT-<ts>.md` matching
prior run-report formats.

### 4.3 Export refresh

After 4.2: `npm run export-artifacts` writes per-exhibit JSON with
real R2 URLs.

### 4.4 Build (deploy out of scope)

`npm run build` produces a dist/ with R2 URLs that resolve.
Visiting the local build (or any future deploy) shows real assets
instead of placeholder tiles. The deploy itself — pushing the new
dist to weird.baby — is a separate work item; see §7.

### 4.5 Ongoing sync

`tools/sync-assets-to-r2.mjs` is re-runnable; idempotent because
content-addressed. Operator runs it after curating new artifacts;
manifest gets new entries; next export picks them up.

---

## §5 — Operator decisions (NOT locked; implementation blocked on these)

These are the calls only the operator can make. Each must be answered
before the fresh-Claude implementation session starts.

### 5.1 Cloudflare account and billing
Already have a Cloudflare account? Use it, or create dedicated for this
project? R2 has a free tier (10GB storage, 1M Class A ops/mo, 10M
Class B ops/mo) that this project will fit inside for the foreseeable
future. Billing is on operator account regardless.

### 5.2 Bucket name
Suggested: `weird-baby-assets` or `wbm-assets`. Operator's call. The
name appears in R2 dashboard but not in user-facing URLs (custom
domain hides it).

### 5.3 Custom domain
Suggested: `assets.weird.baby`. Requires:
- DNS CNAME from `assets.weird.baby` → R2 public bucket endpoint
- Cloudflare-managed automatically if the apex `weird.baby` is on
  Cloudflare DNS already; manual if not.
Operator's call on subdomain choice.

### 5.4 Public access semantics
Bucket-public-read for the chosen prefix? Or per-object public ACL?
Recommend bucket-public-read on a dedicated bucket — simpler, and
nothing private is going in.

### 5.5 R2 credentials
Need an R2 API token with write access to the bucket. Operator generates
in Cloudflare dashboard; stored locally in
`.env` or similar (gitignored). Used only by `sync-assets-to-r2.mjs`.
The Museum build itself does NOT need R2 credentials — it reads the
manifest, not R2 directly. So credentials are operator-machine only.

### 5.6 The 3 NULL-media_type vaulted artifacts
`MV-20260419-001` (Hunter Root acoustic), `MV-20260419-002` (Cheech
puppet FB reel), `MV-20260419-004` (empty). Operator has been managing
these manually. Should the sync include them? If yes, what `media_type`
should each be assigned before sync runs?

---

## §6 — Sequencing

### Phase A — Operator setup (pre-implementation)
1. §5 decisions all answered
2. R2 account, bucket, custom domain configured
3. R2 credentials generated and placed in operator-side env
4. Operator audits the 3 NULL-media_type artifacts (§5.6)

### Phase B — Implementation (fresh Claude session)
1. **Audit-on-entry** — verify the 18-artifact scope still holds;
   verify operator setup from §A complete
2. Write `tools/sync-assets-to-r2.mjs` per §3.2
3. Test on `--dry-run` first (no R2 uploads), validate manifest shape
4. Run real sync — first 1 artifact, verify, then the remaining 17
5. Update `tools/export-artifacts.mjs` per §3.4
6. Update render dispatch per §3.5
7. Run `npm run build`, verify
8. Commit work in disciplined increments
9. Write run report

### Phase C — Deploy
- Out of scope for the Asset Delivery work item
- Becomes its own work item (the deploy gap noted in NAVIGATION)

---

## §7 — Out of scope

- **Operator-managed artifacts (if operator chooses).** Per §5.6, the
  operator may decide to keep `MV-20260419-001` and `MV-20260419-004`
  out of the sync — they're being managed manually. If so, those two
  IDs are explicitly excluded from §4 migration scope and §3.2's sync
  manifest. (MV-20260419-002 is included by default unless operator
  says otherwise in §5.6.)
- **The deploy step.** Museum is on a 2026-04-15 build. Deploying the
  current working tree to weird.baby is a separate work item.
- **Backfill of `thumbnail_path` in MV's `artifacts` table.** The sync
  manifest is the canonical URL source. If we ever want MV to know
  R2 URLs directly, that's a schema change deferred for now.
- **Video assets.** None in current inventory.
- **Audio assets.** None in current released inventory (the Cheech
  reel is media_type NULL, currently treated as one of the 3 special
  cases).
- **The §6.1 `media_type` normalization** (deferred §12 item, named
  in SPEC.md §6.6 today). Asset sync needs media_type-valid values
  for §5.7 artifacts but doesn't trigger the full normalization.

---

## §8 — Verification (this brief)

- Asset inventory verified against live MV: 19 released artifacts,
  storage_mode/media_type/path distribution as in §1.
- v2.1-target §6.1, §6.2, §11 B1, §12 read and quoted.
- VISION_LOCK reference noted but not read (the recommendation already
  reaches R2; no contradiction expected).
- Operator hard-line preserved: AI handles Ops; operator handles
  UX-facing. All §5 questions explicitly operator-only.

---

*End of scoping brief. Implementation green-lit pending §5 answers
from operator.*
