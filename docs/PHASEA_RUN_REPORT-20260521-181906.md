# Phase A Run Report — Asset Delivery, operator setup

**Date:** 2026-05-21 (run timestamp 18:19:06 UTC)
**Scope authorized:** §6 Phase A items 1-4 per
`docs/ASSET_DELIVERY_SCOPING_BRIEF-20260521-114500.md`.
Hard boundary at Phase A; Phase B (`tools/sync-assets-to-r2.mjs`
implementation and the actual sync run) explicitly out of scope for
this session.
**Status:** **COMPLETE.** All four Phase A items landed. R2 is
activated on the operator's Cloudflare account, bucket
`weird-baby-assets` exists with `assets.weird.baby` bound and TLS
1.2 minimum, scoped R2 API credentials are staged in
`C:\AI\Projects\weird-baby-museum\.env` (gitignored), and the three
NULL-media_type artifacts (MV-20260419-001 / -002 / -004) have
sync/no-sync decisions recorded (all three: sync, `media_type =
'photo'`, write deferred to Phase B's audit-on-entry per brief §4.1).

---

## §0 — How to read this report

Mirrors the format of `docs/PHASE2A_RUN_REPORT-20260520-162150.md`.
§1 audit-on-entry results, §2 stop-and-ask events and resolutions,
§3 the three Cloudflare-side configuration changes (this work is
Ops-side, not code-side; §3 is configuration mutations, not commits),
§4 verification per the brief's §6 Phase A acceptance criteria,
§5 observed-but-not-actioned items, §6 what's next (Phase B).

The Phase A operator runbook referenced
`PHASE25_RUN_REPORT-20260520-234155.md` as the format mirror;
no such file exists in the Museum repo. The closest extant report is
`PHASE2A_RUN_REPORT-20260520-162150.md` (newest by
`LastWriteTime`); operator confirmed this as the substitute mirror.
See §5.1.

Citations: Cloudflare-side artifacts (bucket, domain binding, API
token) are identified by the public IDs visible in the dashboard.
Account ID `3d80019fdcbebe42c1593d777ecd2f25` is treated as public
(it appears in the unauthenticated S3 endpoint URL and is not a
secret). The R2 access key ID and secret access key generated in
mutation 3 are NEVER named in this report by their values; they live
only in `C:\AI\Projects\weird-baby-museum\.env` (gitignored).

---

## §1 — Audit-on-entry results

The runbook required verifying four items before starting Phase A.
All four passed; one observed-but-non-blocking divergence (the
runbook's Claude-in-Chrome tool assumption) was surfaced and
resolved (see §2.1).

### 1.1 Asset inventory matches scoping brief §1

Direct query of `C:\AI\Platform\MediaVault\core\mediavault.sqlite`,
restricted to `status='released'`:

| storage_mode | media_type | n | with_path | with_thumb |
|---|---|---|---|---|
| referenced | mixed | 15 | 15 | 0 |
| url_only | link | 1 | 0 | 0 |
| vaulted | (NULL) | 3 | 3 | 0 |

19 released artifacts, 18 with `local_asset_path`, 0 with
`thumbnail_path`. **MATCH** to brief §1 exactly. Delivery scope
(referenced/mixed + vaulted) = 18 artifacts; `url_only/link`
artifact (MV-20260518-001, the YouTube parent) renders via URL
synthesis per brief §1 and needs no delivery work.

### 1.2 Repository HEADs match prior-session state

- MV (`C:\AI\Platform\MediaVault`): `git rev-parse HEAD` →
  `0a9e953887e54633019ed86b75b7772c9d9b73ab`. PASS.
- Museum (`C:\AI\Projects\weird-baby-museum`): `git rev-parse HEAD` →
  `0e545a425a28b0375d9b11181306f545411ec45b`. PASS.
- Working trees: no modifications to tracked files in either repo;
  untracked backups and scratch files only. Documented in §5.3.

### 1.3 Claude in Chrome tool availability

**Diverged from runbook expectation, non-blocking.** The runbook
expected Claude-in-Chrome tools (`tabs_context_mcp`, `navigate`,
`computer`, `find`) for browser-driving the Cloudflare dashboard.
This session ran in the standard Claude.ai web chat without those
tools. Surfaced and resolved by switching to a
screenshot-and-paste-back workflow with operator executing every
click. Operator declined Wrangler-CLI alternative and Cowork option
in favor of continuing with screenshots. See §2.1.

### 1.4 `.gitignore` coverage for `.env`

Per `Get-Content ... | Select-String -Pattern "\.env"`:
`.env*` matched at `.gitignore:30` with allowlist
`!.env.example`. PASS — safe to stage credentials at §6 Phase A
step 3 without further plumbing.

---

## §2 — Stop-and-ask events and resolutions

Four stop-and-ask events surfaced during this session. All four
resolved without aborting Phase A.

### 2.1 Tool environment divergence (§1.3 above)

Surfaced at session start when the runbook's
`view` of the brief path failed due to the wrong environment.
Operator asked how to proceed; resolved on the operator's
instructions: `PowerShell command \rightarrow operator runs \rightarrow Claude
reads output`. Browser side: screenshot-and-paste, operator clicks.
This is documented as the working mode for the session.

### 2.2 R2 activation gate (mutation 0)

R2 was not enabled on the Cloudflare account at session start.
Clicking `R2 Object Storage` in the sidebar surfaced an activation
page (`Add R2 subscription to my account`) with pricing terms
(.00 Total Due Now; free tier of 10 GB storage, 1M Class A ops/mo,
10M Class B ops/mo; overage at .015/GB, .50/M Class A,
.36/M Class B; card ending 2864 on file; auto-renews until
canceled).

Surfaced as billing-relevant. Operator approved after review.
Subscription added. This is an unscoped prereq to §6 Phase A item 2
that the runbook did not anticipate; recording it here so any future
audit traces the activation moment.

### 2.3 Pre-existing User API token (`weird-baby build token`)

At mutation 3, the R2 API Tokens page surfaced an existing User API
token: `weird-baby build token`, issued `Apr 8, 2026`, permission
`Admin Read & Write`, applied to `All buckets`, status `Active`.
This token was not in the runbook's prior-session state and not
anticipated by the brief.

Investigation: no `.env*` file anywhere under `C:\AI\`;
`Get-ChildItem C:\AI\ -Recurse -File ... Select-String` for
`weird-baby build token | weird_baby_build_token |
CLOUDFLARE_API_TOKEN | CF_API_TOKEN | R2_ACCESS_KEY | R2_SECRET`
returned only hits inside `C:\AI\_stale\.../node_modules/wrangler/`
(wrangler CLI source code, not credentials); search for
`visitor | visit_log | visitlog | guestbook` under the Museum repo
returned hits only in `dist*/` compiled output, none in source;
no `wrangler.toml` at Museum root.

Conclusion: most likely a forgotten exploratory token; no evidence
of active use on this machine. Operator chose **leave-old / create-new**
(reversible — old token can be revoked in a later session once
confirmed nothing breaks).

### 2.4 Runbook reference to missing run report

The runbook directed: *"write a Phase A run report (mirroring the
format of `weird-baby-museum/docs/PHASE25_RUN_REPORT-20260520-234155.md`)"*.
That file does not exist in the Museum repo (verified by recursive
`Get-ChildItem ... -Filter "*RUN_REPORT*"`). Likely a transcription
error in the runbook ("PHASE25" \leftarrow "PHASE2A", "234155" \leftarrow "162150").
Operator confirmed substituting the most recent run report
(`PHASE2A_RUN_REPORT-20260520-162150.md`) as the format mirror.
See §5.1.

---

## §3 — Configuration changes

Three mutations on Cloudflare, plus the operator-handoff credential
generation. No code commits — Phase A is operator setup. Phase B
will produce code commits.

### 3.1 Mutation 0 — R2 subscription added

Cloudflare account `Langmikea@gmail.com` (Account ID
`3d80019fdcbebe42c1593d777ecd2f25`). R2 Object Storage activated;
free tier with card ending 2864 on file as overage backstop.
Expected monthly bill: .00 at the project's usage profile (18
hand-curated assets, well inside free tier).

### 3.2 Mutation 1 — Bucket `weird-baby-assets` created

| Setting | Value |
|---|---|
| Bucket name | `weird-baby-assets` |
| Location | Automatic \rightarrow Eastern North America (ENAM) |
| Default storage class | Standard |
| Public access (at creation) | Disabled (mutation 2 changes this) |
| Default lifecycle rule | "Default Multipart Abort", abort after 7 days, Enabled (Cloudflare default) |

S3 API endpoint:
`https://3d80019fdcbebe42c1593d777ecd2f25.r2.cloudflarestorage.com/weird-baby-assets`

Operator §5.2 decision: `weird-baby-assets`.

### 3.3 Mutation 2 — Custom domain `assets.weird.baby` bound, TLS hardened

DNS record auto-created in the `weird.baby` Cloudflare zone:
`CNAME assets \rightarrow weird-baby-assets` (R2 edge routing target). Bucket
public read enabled through the custom domain. TLS cert provisioning
initiated by Cloudflare; minimum TLS version subsequently raised from
the Cloudflare-default `1.0` to `1.2` via the domain row's
`Configure options` menu.

| Setting | Value |
|---|---|
| Custom domain | `assets.weird.baby` |
| Public URL | `https://assets.weird.baby` |
| Minimum TLS | 1.2 |
| Access | Enabled |
| Status at session end | Initializing / transitional after TLS edit; expected to reach Active within minutes |

Operator §5.3 decision: `assets.weird.baby`. Operator §5.4
decision: bucket-public-read via custom domain.

### 3.4 Mutation 3 — Account API token `wbm-asset-sync` created

Account API token (not User API token, per Cloudflare's recommended
production-grade choice for service authentication). The
secret-reveal screen was handled per the operator-hard-line: Claude
did not view, screenshot, or describe the secret access key. Operator
copied the access key ID and secret access key directly to
`.env`.

| Setting | Value |
|---|---|
| Token name | `wbm-asset-sync` |
| Type | Account API token |
| Permission | Object Read & Write |
| Bucket scope | `weird-baby-assets` only (not all-buckets) |
| TTL | 1 year |
| Client IP filter | none (default — any IP) |

### 3.5 `.env` staged at Museum repo root

`C:\AI\Projects\weird-baby-museum\.env` created with six keys.
Structure verified post-write (without revealing values) — every
key present with non-zero value length:

| Key | Value length | Comment |
|---|---|---|
| `R2_ACCOUNT_ID` | 32 | Cloudflare account ID (32-char hex; not a secret) |
| `R2_ACCESS_KEY_ID` | 32 | R2 access key ID (32-char hex; rotateable) |
| `R2_SECRET_ACCESS_KEY` | 64 | R2 secret access key (64-char hex; SECRET) |
| `R2_BUCKET` | 17 | `weird-baby-assets` |
| `R2_PUBLIC_URL` | 25 | `https://assets.weird.baby` |
| `R2_S3_ENDPOINT` | 65 | S3-compat endpoint URL |

Gitignore verification: `git check-ignore -v .env` returned
`.gitignore:30:.env*.env`. Confirmed ignored.

### 3.6 NULL-media_type artifact decisions

Live query of MV at `C:\AI\Platform\MediaVault\core\mediavault.sqlite`
(`.mode line`, all relevant columns):

| Artifact | File | description_short | Decision | media_type to assign |
|---|---|---|---|---|
| MV-20260419-001 | `.heic` | Hunter Root performing acoustic solo set in Harrisburg, Pennsylvania | Sync | `photo` |
| MV-20260419-002 | `.png` | Facebook reel featuring puppet character created by ElmThree Productions | Sync | `photo` |
| MV-20260419-004 | `.jpg` | (empty: no description_short, description_long, notes, confidence_flags) | Sync | `photo` |

All three included in Phase B's sync. Brief §1 footnote (operator
managing 001 and 004 personally) is superseded by these live
decisions. Brief §7 (Out of scope) is correspondingly **narrowed**:
the operator-managed-artifacts exception in §7 no longer applies;
all 18 delivery-scope artifacts are in-scope for Phase B.

**Phase A records the decisions. Phase B executes them.** Per brief
§4.1, `media_type` values must be set on the three artifacts
before sync runs. The actual UPDATE statements against
`mediavault.sqlite` are deferred to Phase B's audit-on-entry,
with rule 7's pre-flight verify-count + backup + abort-on-mismatch
discipline applied. No write to MV's SQLite occurred in this
session.

---

## §4 — Acceptance verification

Brief §6 Phase A acceptance criteria, each verified.

### 4.1 §5 operator decisions all answered

PASS. Recorded in §3 and summarized:

| § | Decision | Answer |
|---|---|---|
| 5.1 | Cloudflare account / billing | Existing account (Langmikea@gmail.com), card ending 2864, R2 free tier |
| 5.2 | Bucket name | `weird-baby-assets` |
| 5.3 | Custom domain | `assets.weird.baby` |
| 5.4 | Public access semantics | Bucket-public-read via custom domain |
| 5.5 | R2 credentials location | `C:\AI\Projects\weird-baby-museum\.env` (gitignored) |
| 5.6 | NULL-media_type artifacts | All three: sync, `media_type='photo'` (see §3.6) |

### 4.2 R2 account, bucket, custom domain configured

PASS. Mutations 0-2 above. `weird-baby-assets` exists; bound to
`assets.weird.baby` with TLS 1.2 minimum.

### 4.3 R2 credentials generated and staged in `.env`

PASS. Mutation 3 + §3.5. Token `wbm-asset-sync` scoped to Object
Read & Write on `weird-baby-assets` only, 1-year TTL. `.env`
contains all six required keys, all with non-zero values, file
gitignored.

### 4.4 NULL-media_type artifact decisions recorded

PASS. §3.6 enumerates all three artifacts, their live-DB state at
audit time, and per-artifact decisions. Decisions stored in this
run report and ready for Phase B's audit-on-entry to consume.

### 4.5 Pre-write backups of `mediavault.sqlite`

NOT TAKEN — no MV-SQLite writes occurred in this session. Phase B's
audit-on-entry will take the backup before executing the
media_type UPDATEs per rule 7.

---

## §5 — Observed but not actioned

Six items surfaced during this session that are not part of Phase A's
authorized scope, or are deferred to a follow-on session.

### 5.1 Runbook reference to missing format mirror

The runbook directs the report to *"mirror the format of
`PHASE25_RUN_REPORT-20260520-234155.md`"*. No such file exists in
the Museum repo (or anywhere under `C:\AI\Projects\weird-baby-museum\`).
Best guess: transcription error in the runbook ("PHASE25" \leftarrow
"PHASE2A", "234155" \leftarrow "162150"). Substituted
`PHASE2A_RUN_REPORT-20260520-162150.md` per operator confirmation.

Action for the operator: consider updating the runbook to either
point at the actual most-recent run report or fix the typo. Not
fixed in this session because the runbook isn't a tracked Museum
artifact.

### 5.2 Pre-existing `weird-baby build token` (User API token, Admin Read & Write, All buckets)

Issued `Apr 8, 2026`. No on-disk credentials anywhere under
`C:\AI\`; no source-level references; no active deploys observed
to depend on it. Most likely an exploratory token left unrevoked.

Operator chose leave-old / create-new for this session. The old
token remains active. **Recommended follow-on:** in a future session,
once Phase B is settled and the new `wbm-asset-sync` token is
verified working, revoke `weird-baby build token`. Specific
revocation flow: R2 \rightarrow API Tokens page \rightarrow User API Tokens table
\rightarrow `...` menu next to the row \rightarrow `Delete`.

### 5.3 Untracked files in MV and Museum working trees at session start

Both repos clean for tracked-file modifications. Untracked files:

- **MV:** `NAVIGATION.md.pre-*`, `SPEC.md.pre-*` snapshots (5 of
  these), `_cowork/v10_add_vocabulary_table.py`,
  `_cowork/v11_cleanup_legacy_tag_patterns.py`,
  `core/__deltest`, `core/__deltest-journal`, `core/__isotest`,
  `core/__test_sibling`, `core/backups/` directory,
  `core/bak_pre_migrate-vocabulary-pass1_*.sqlite` (3 of these),
  `core/bak_pre_migrate-vocabulary-pass2_*.sqlite` (1),
  `tools/check_single_tag_writer.py.pre-harden-*` (2).
- **Museum:** `.phase1_retired_files/` directory,
  `DECISION_BRIEF_target_data_architecture.md.pre-*` (3),
  `NAVIGATION.md.pre-*` (4),
  `dist.pre_p14_final_2/`, `dist.pre_phase1_2/`,
  `docs/CRITERION8_DEFERRAL_NOTE-20260519-211529.md.pre-c8close-*`.

All are disciplined-edit snapshots or test/scratch residue, not
work in progress. Not in Phase A's scope to clean up. Logged for
future `.gitignore` policy / quarantine sweep.

### 5.4 No `wrangler.toml` at Museum repo root

Museum deploys to Cloudflare Workers but has no top-level
`wrangler.toml`. The Workers config (and the bucket reference, if
it ends up in the deploy graph) is presumably under a subdirectory or
in `wrangler.jsonc`. Not blocking Phase B (the sync script
`tools/sync-assets-to-r2.mjs` reads from `.env` directly via the
S3-compat API, not via wrangler).

### 5.5 CORS policy not configured on the bucket

`weird-baby-assets` has no CORS policy at session end. The Phase B
sync script will upload via the S3-compat endpoint (server-to-server,
not browser); the museum site will fetch images via `<img src>`
(no preflight). CORS is not blocking for either flow.

A CORS policy would be required if any future feature does
`fetch()` against `assets.weird.baby` from a browser. Not in
Phase A scope; flagged here for future work-item triage.

### 5.6 Brief §7 "operator-managed artifacts" exception narrowed

The brief's §7 said operator might choose to keep `MV-20260419-001`
and `MV-20260419-004` out of sync scope. Per the §3.6 decisions,
operator chose to include both. Brief §7 of the scoping document is
effectively narrowed by this report; Phase B should treat all 18
delivery-scope artifacts as in-scope.

---

## §6 — What's next

### 6.1 Phase B implementation (fresh Claude session)

The scoping brief's Phase B sequence (§6) is unchanged, with the
following Phase-A-driven prefix added:

1. **Audit-on-entry**, including:
   - Verify the 18-artifact delivery scope still holds (single MV
     SQLite query, matching the format in §1.1 here).
   - Verify Phase A setup: `weird-baby-assets` bucket exists and is
     reachable; `assets.weird.baby` resolves and serves the bucket;
     `.env` contains all six keys; `.env` is gitignored.
   - Verify the three NULL-media_type artifacts are still NULL
     (i.e. no other process set `media_type` in the interim).
2. **Apply the §3.6 media_type decisions** to MV's
   `mediavault.sqlite`: take a pre-write backup, UPDATE
   MV-20260419-001 / -002 / -004 with `media_type = 'photo'`,
   verify count == 3 changes, abort-on-mismatch per rule 7.
3. **Write `tools/sync-assets-to-r2.mjs`** per brief §3.2.
4. Continue with brief §6 Phase B items 3-9.

### 6.2 Token cleanup (§5.2)

After Phase B is settled and `wbm-asset-sync` is observed working
end-to-end, revoke the pre-existing `weird-baby build token` per
§5.2 to remove the dormant Admin-Read-Write-All-Buckets credential
from the account.

### 6.3 CORS, runbook update, working-tree cleanup (§5.4, §5.1, §5.3)

Out of scope for Phase A and Phase B as currently specified;
candidates for future Phase 0 / hygiene punchlist items.

---

*End of report. Zero commits in MV; zero commits in Museum (this
report is the only Museum commit). MV's `mediavault.sqlite` is
unmodified. Cloudflare-side: R2 activated, bucket created, custom
domain bound with TLS 1.2, scoped API token created and credentials
staged in `.env`. Phase B awaits.*
