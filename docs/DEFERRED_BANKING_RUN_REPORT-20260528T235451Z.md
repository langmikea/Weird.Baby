# Deferred banking run report — 2026-05-28

Session purpose: close out the deferred items from the release-flow arc that `ac12795` couldn't bank because the release-flow session's run report wasn't located. Documentation-only; CLAUDE.md edit; no code change.

## 1. Source material

**Pre-state**
- CLAUDE.md: 33,773 bytes, 414 lines.
- HEAD on CLAUDE.md = `ac12795` (latest CLAUDE.md edit). Confirmed via `git log --oneline -5 CLAUDE.md`.
- Line endings: LF (verified via `xxd` of header bytes).

**Release-flow run report sweep**
- Checked `/home/claude/`, museum repo root, `docs/`, `/tmp/`.
- Latest existing run reports in `docs/`: `OPERATIONAL_HYGIENE_RUN_REPORT-20260525T192539Z.md` (matches `af8e761`), `EXHIBIT_BACKFILL_DEPLOY_RUN_REPORT-20260525-103322.md`.
- **No release-flow report found.** Item 5's premise — the report never landed in a locatable place — confirmed. §DEFERRED_ITEMS from this session's kickoff served as authoritative source per chat-record reconstruction.

**Boundary check**
- 33,773 bytes pre-edit → projected ~36 KB post-edit. Well past §7.3 ~16 KB boundary. Anchor-based Python patches mandatory.

## 2. CLAUDE.md additions (final text as committed)

Three insert sites, four logical changes (one site contains three sections).

### 2.1 §10 strengthening (one-sentence append)

Appended after existing sentence `T3 session captured a 54 → 45 drop with no upstream change in scope.`:

> Two clarifications: re-derive the before-count from the prior `hunter_root.json` on disk — never trust a carried-forward count, which goes stale across sessions. And a legitimate down-regen (intended cleanup, retag, unrelease) still warrants an explicit acknowledgement at surfacing time; silence is the bug, not the shrink itself.

Folds Item 3's two missing clauses into existing §10. No new section.

### 2.2 §2 first-sighting note (insert above `### 3.`)

> **First-sighting note**: rule and first confirmed sighting coincided. During the same hygiene-commit session (`af8e761`) that banked this rule, sandbox `git status --short` flagged `hunter_root.json` as a 1,929-line phantom delete while host `git status --short` returned clean.

Item 6. Correctly placed in hygiene §2 (phantom-delete rule), not §8 (FUSE-cache-staleness) as the kickoff said — confirmed at GATE 1.

### 2.3 §11, §12, §13 (insert above `## Things that are explicitly off-limits`)

Three new numbered subsections in "Cowork environment quirks (operational hygiene)":

- **§11. Sandbox cannot reach MV HTTP server** (Item 1) — `127.0.0.1` is sandbox-local; `host.docker.internal` DNS-fails; gateway times out. Hard rule: any flow that calls MV's HTTP server runs on host PowerShell, with MV launched first via `launch_mediavault.bat`. `export-artifacts` is the canonical case.
- **§12. Virtiofs maps NTFS-illegal characters to PUA glyphs** (Item 2) — NTFS-illegal chars (`: \ * ? " < > |`) map to U+F0xx PUA glyphs on the Windows side; PowerShell parses the displayed glyph back as the original illegal char and fails. Hard rule: address by substring wildcard, never literal name. First sighting: stray `C:\AI\Platform\MediaVault/`-named directory in museum repo, resolved via wildcard.
- **§13. Run reports land on disk before the session's final commit** (Item 5, meta-rule) — every cowork session writes its report on disk before the commit; report path goes into next session's kickoff `§LOCKED_CONTEXT`. Why: backfilling means the artifact is missing from the moment the commit lands. The release-flow gap is the precise gap this rule addresses — which is why this session has to exist.

## 3. Write method

Single Python heredoc via `mcp__workspace__bash`. Three `data.replace(anchor, ...)` calls, each gated by `assert data.count(anchor) == 1` before mutation.

Three anchors (all verified unique pre-write):
1. `T3 session captured a 54 → 45 drop with no upstream change in scope.` (§10 append)
2. `### 3. Virtiofs COMMIT failure on SQLite writes (M1 §7.2 expanded)` (§2 append)
3. `## Things that are explicitly off-limits` (§11–§13 insert)

Per-patch byte deltas:
- P1 (§10): +334 bytes
- P2 (§2): +280 bytes
- P3 (§11–§13): +2,465 bytes
- Total: +3,079 bytes

Write: `os.remove(path)` + `open(path, 'wb').write(data)`. Re-read verify confirmed `len(verify) == new_size` (36,852 bytes).

**Post-write verification** (past 16 KB boundary):
- `wc -lc`: 442 lines, 36,852 bytes ✓
- `tail -3`: clean file end ("Don't let this file grow past ~600 lines…") ✓
- `grep ^### 1[123].`: §11/§12/§13 headers at lines 318/324/336 ✓
- `grep "Two clarifications"`: §10 strengthen at line 314 ✓
- `grep "First-sighting note"`: §2 append at line 259 ✓
- `grep "^## Things that are explicitly off-limits"`: header preserved at line 344 ✓

No tail truncation. All four logical changes present.

## 4. Item-by-item disposition

| Item | Disposition |
|---|---|
| 1. Sandbox cannot reach MV HTTP | Shipped as §11. |
| 2. Virtiofs PUA-glyph filenames | Shipped as §12. |
| 3. Silent down-regen guard | **Folded into existing §10** as one-sentence strengthening (option A2 at GATE 1). §10 already had the core rule; Item 3 added two missing clauses (carryforward-staleness + down-regens warrant explicit ack). No new section. |
| 4. Second quirk (scaffolding) | **Dropped.** No clean second quirk identifiable from chat record; Mike confirmed at GATE 1 "'two quirks' was my own loose phrasing in the carryforward, not a verified count." |
| 5. Run reports land on disk before commit | Shipped as §13. **This run report is the first compliance with the rule it banks** — landed on disk at `docs/DEFERRED_BANKING_RUN_REPORT-20260528T235451Z.md` before the commit. |
| 6. §8 phantom-delete first-sighting evidence | Shipped as appended note. Correctly placed in hygiene §2 (phantom-delete rule), not §8 (cache-staleness) as the kickoff said. Mike confirmed at GATE 1 "§2 is right; I miscounted from memory." |

## 5. Commit SHA

_Mike fills in after host-side commit._

`<NEW_SHA>` =

## 6. New museum HEAD

_Mike fills in._

Pre-commit: `ac12795`
Post-commit: `<NEW_SHA>`

## 7. Anything notable

- **Path drift on the report location**: kickoff specified `/home/claude/DEFERRED_BANKING_RUN_REPORT-<UTCstamp>.md`. That path doesn't exist in this sandbox (HOME is `/sessions/gifted-gracious-ptolemy/`, ephemeral). Landed instead at the museum's `docs/` per existing convention (`OPERATIONAL_HYGIENE_RUN_REPORT-…` precedent). Findable, persistent, matches what next session's audit-on-entry will look for.
- **The §13 rule is self-instantiating**: this run report had to land on disk before the commit precisely because §13 says so, and §13 exists because the release-flow run report didn't. First and best test of the rule is the one that creates it.
- **All three §7.3 anchor-patches passed first-try** with strict `count == 1` gates. No anchor collisions, no CRLF surprises (file was LF on disk, confirmed at preflight).
- **`mcp__cowork__allow_cowork_file_delete` granted at narrow scope** (CLAUDE.md path), per hygiene §4 — confirmed per-session, granted on first use.
- **No git operations from sandbox.** Commit text prepared; Mike runs from PowerShell per hygiene §2 hard rule.
- **Commit scope question for Mike**: past run reports were committed alongside their CLAUDE.md changes (`af8e761` shipped its report). Pre-approved commit message says "CLAUDE.md only." Mike's call whether to (a) include this report in the commit and tweak the message, or (b) ship CLAUDE.md only as approved and let the report sit untracked / separate followup.
- Carryforward: T3-DONE, full CLAUDE.md refresh DONE, deferred banking now CLEARED. Pending list otherwise unchanged from kickoff.
