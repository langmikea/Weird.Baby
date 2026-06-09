# RETAG v1 — plan

**Deliverable:** `tools/retag_v1.ps1` (host PowerShell) + this plan. Authored by Cowork; **Cowork writes no live data.** Mike runs the script on the host.

## The three rules this honors

- **Source (read):** the live tag set is read **only from the running MediaVault server** at `http://127.0.0.1:51822` via `GET /db` (the raw committed SQLite — the same bytes the server itself writes). The Drive/JSON export is never read.
- **Write:** the **only** writer is `POST /api/artifact-update`. The script never opens the SQLite file for writing and never bypasses the server's single coordinated tag writer (`core/artifact_tags.write_artifact_tags`, §4.5). Cowork authored the script but POSTs nothing.
- **Persistence:** the script lives in `tools/`; its run reports land in `_cowork/RETAG_RUN_REPORT-<utcstamp>.md`. Not scratch.

## What it does

For each of the **185** artifacts it computes:

```
new_tags = (current tags, with every `unsorted:<v>` replaced by MAP[<v>] and the
            `unsorted:` tag dropped) UNION (all other current tags)
```

The map is parsed live from `docs/taxonomy/NORMALIZATION_MAP.md` (same regex the repo's `coverage_check.py` uses), so the script stays in lockstep with the map — no hard-coded mapping.

### Tag rules
- Every output tag is namespaced `namespace:value` (ns `[a-z0-9_]+`, value `[a-z0-9_-]+`, one colon). The endpoint 400s on bare slugs; the script pre-validates and will **skip+flag** rather than POST anything that would 400.
- `type:` is **multi-value**: subtypes are kept alongside parents, **nothing is cross-deduped.** The script deliberately does **not** apply the map §3 `type:audio`+`type:mp3` collapse — that is a separate Tier-2 concern outside this retag.
- Merge-pairs (e.g. `instagram_hacked` + `hacked_account` → `attributes:account_hacked`; `new_music`/`new_song`; `songwriting`/`songwriting_process`) collapse automatically via the set union.
- Any `unsorted:*` value missing from the map → **skip+flag** (no silent drop).

### Scope
All **185**, including archived (Mike's rule — Cowork does the labor). Inbox/vault/released/archived are all in scope.

### Cross-post guard
An artifact with **2+ distinct `source:*` tags** is **not** auto-resolved — it is printed, **skipped**, and collected into the "needs Mike's eyeball" list. (008 keep-tiktok / 011 drop-both were settled in a prior pass and are now single-source. Any *new* multi-source case pauses.)

### Already-correct detection
If an artifact's computed set already equals its live set, it's a no-op and skipped. The previously-retagged artifacts fall out here automatically.

## Modes

| Invocation | Behavior |
|---|---|
| `pwsh -File tools/retag_v1.ps1` | **DRY-RUN (default).** Prints every artifact's `old → new`, POSTs nothing. |
| `pwsh -File tools/retag_v1.ps1 -Apply -Batch 5` | Writes only the **next 5** pending changes, re-reads each from `/db`, then stops. **The gate.** |
| `pwsh -File tools/retag_v1.ps1 -Apply` | Writes the rest; re-reads each; **halts on any non-200 or any post-write mismatch.** |

Each write: `POST /api/artifact-update {"id":…,"fields":{"tags":[…full new set…]}}` → re-read from the live server → confirm the live set equals intended → log added/removed. The batch walk is idempotent: already-correct artifacts are skipped, so repeated `-Apply -Batch 5` advances through the queue.

## Current live snapshot (read-only, at authoring time)

- **185** artifacts; status: 97 released, 81 vault, 6 inbox, 1 archived.
- **43 will change**, **142 are already-correct no-ops** (no `unsorted:*` tags), **0 flagged**, **0 cross-post conflicts.**
- All 34 distinct live `unsorted:*` values are covered by the 47-row map; **0 unmapped**, **0 bare slugs** anywhere.
- The transform only touches `unsorted:*` tags (everything else is already namespaced), so the change-set is exactly the 43 artifacts still carrying `unsorted:*` tags.

## Notes for Mike's eyeball

- **Known-retagged set:** 004, 008, 011, 015, 016 are present and clean (no-ops). **`MV-HR-20260405-001` does not exist in the live DB** — the brief's sixth id appears to be a gap; nothing to skip there.
- **Map §2 column-vs-tag source disagreements** (008/011/014, and the brief's 23/6 vs live 3/0 discrepancy) are a `source_platform`-column reconciliation — **out of scope** for this tags-only retag. They remain flagged in the map's own §4; this script neither reads nor writes the `source_platform` column.
- **Archived / duplicate family:** the run report surfaces the archived row (`MV-20260510-001`) and shared-`source_url` groups (the May-10 family `7Lttb_59EYw`: `-001` archived + `-003` vault share the watch URL; `-002` is the thumbnail) — noted for **possible future deletion**, not touched here.

## Run order (Mike, on host)

1. Ensure MediaVault is running (the script reads `/db` and writes via `POST`).
2. `pwsh -File tools/retag_v1.ps1` — review the full `old → new` diff + the `_cowork/` report.
3. `pwsh -File tools/retag_v1.ps1 -Apply -Batch 5` — gate the first 5, eyeball the re-read confirmations.
4. `pwsh -File tools/retag_v1.ps1 -Apply` — finish; halts on any error/mismatch.
5. Commit `tools/retag_v1.ps1`, this plan, and the run reports.

> The script uses Python (already required by MediaVault) solely to turn the `GET /db` SQLite bytes into JSON for reading. It performs no writes outside `POST /api/artifact-update`.
