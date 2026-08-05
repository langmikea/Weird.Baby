# CLAUDE.md session log — MAY 2026 (archived)

Archived from `CLAUDE.md` on 2026-08-04 (v51), under that file's own rule:
*"Don't let this file grow past ~600 lines. If it does, archive older session
log entries to `docs/`."* It had reached 643.

Nothing was edited on the way out. These are the entries from 2026-05-06 to
2026-05-15 inclusive, verbatim. The live log in `CLAUDE.md` keeps everything
from 2026-05-30 forward — the lint-baseline entry, which is still load-bearing,
and every v46+ round.

---

### 2026-05-15 → tier reconciliation + navigation expansion
- `7f9843d` fix(deep-dive): trimmed `TIER_BY_NAMESPACE` in `hr_dimensions.js` to the canonical seven (`year/album/song/venue/people` at Tier 1; `source/type` at Tier 2). MV-residue namespaces fall to dynamic Tier 3 via the `?? 3` fallback. `CANONICAL_VOCABULARY.md` line 86 follow-up resolved.
- `386f69e` docs: NAVIGATION.md — added "Current state and what's next" section.

### 2026-05-14 → navigation + architecture critique (`5a89835`)
- Landed `NAVIGATION.md`, a Phase 2b architecture critique, and vocab migration scripts.

### 2026-05-13 → B-1 plan locked (`5558fb2`)
- B-1 implementation plan committed; seven operator decisions locked.

### 2026-05-12 → architectural recovery (`b1a632c`)
- `docs/CANONICAL_VOCABULARY.md` locked from v28_3 prototype; UX/data lifecycle specs and Q-5 follow-up note landed. Flags drift between `b29f9fe`'s `TIER_BY_NAMESPACE` heuristic and the new canonical doc (reconciled 2026-05-15 in `7f9843d`).

### 2026-05-11 → MV-driven artifacts + v4/v5 spec arc (PR #16, `b29f9fe`)
- `21cf558` docs: end-to-end workflow map (ground truth before architectural pivot).
- `649f006` docs: `SPEC_DRAFT_v4.md` — corrected architecture, supersedes v3.
- `669c7e7` docs: `SPEC_DRAFT_v5.md` — strict tag equality, Exhibitor's Badge, loud failures.
- `79159e3` docs: `SPEC_DRAFT_v5_1.md` — patch addressing v5 design review findings.
- `08299ee` docs: `SPEC_DRAFT_v5_2.md` — Q-1, Q-5, Q-6 resolved; Path B selected.
- `b29f9fe` feat(deep-dive): phase v5-3+v5-4 — MV-driven artifacts replace authored card data. Added `TIER_BY_NAMESPACE` heuristic with seven MV-residue namespaces (reconciled to canonical 2026-05-15 in `7f9843d`).

### 2026-05-10 → deep dive phases 1 + 3, export CLI, playbook updates
- `1ca62ac` tools: yt-ingest CLI for YouTube → MediaVault pipeline (PR #9).
- `a858a32` docs: deep dive phase 0 audit + status taxonomy research.
- `3c16a30` docs: stage deep dive review materials (PR #10).
- `c14267e` cards: add stable `id` field to all source entries (PR #11).
- `5f1bdee` docs: deep dive verification reports (4, 4B, 4C).
- `c059141` docs: deep dive spec v3 and v2 review report (PR #12).
- `bb2c343` feat(deep-dive): phase 1 foundation — vocabulary, prebuild, columns, adapter wiring (PR #13).
- `860ee05` feat(deep-dive): phase 3 export CLI — MV to museum bridge (PR #14). Added `tools/export-deep-tags.mjs`; later renamed to `tools/export-artifacts.mjs` with `npm run export-artifacts`.
- `8872ec0` fix(export-deep-tags): drop `archived_at` clause; add `prebuild-install` dev dep.
- `caf1b01` chore: add `.gitattributes` enforcing LF; renormalize existing files.
- `53394ff` docs(claude.md): playbook updates from Phase 3 session findings (PR #15).

### 2026-05-09 → FUSE git-init quirk + yt schema close (PR #8, `a208ebd`)
- Captured FUSE git-init defect in CLAUDE.md cowork-sandbox quirks. Closed yt-ingest schema's `local_asset_path` question.

### 2026-05-08 → yt-ingest design (PR #7, `5702e47`)
- YouTube ingest design + schema landed; CLI deferred to PR #9.

### 2026-05-08 → exhibit UX round 2 (PR #5, squash `218fe96`)
- TAB_PEEK 14 → 30 (full label visible)
- Active tab fontWeight 700 → 800; 1px INK_SOFT cover masks deck-body border under active tab
- `noneSelected` prop threaded through pills; "all selected" semantics for empty columns
- `pillCount` color now matches `pill` label in every state
- Per-tab `✕` always rendered (dim when no clearable selection, bright when clearable)

### 2026-05-08 → exhibit UX tweaks 1 (PR #4, squash `b352ccc`)
- Tab strip 42 → 30, font kept
- Tracklist variants now radio (one per track)
- Tracklist unselected `#4a4a4a` → `#7a7a7a`; deck pill unselected `#b8974a` → `#6a5520`
- Per-tab `✕` introduced; strip-level "clear all" removed
- `position: fixed` on deck (vs absolute-in-section) — pins to viewport bottom regardless of section centering
- Conditional 60px lift via `body:has(.pb)`
- AuditStrip render-call removed (function preserved)
- Album art scales with `cfH` panel height

### 2026-05-07 → lint cleanup (PR #3, squash `348c93f`)
- HrArchive duplicate `borderBottom` removed
- Exhibit `selectAlbum` declaration moved above the useEffect that uses it
- HrExhibitFlow `serifDisplay` annotated as preserved-unused
- Exhibit `usePersist` empty catch documented
- `__BUILD_TIME__` declared as a global in `eslint.config.js`

### 2026-05-06 → tracks and variants populated (PR #2, squash `e4ea01b`)
- Variant taxonomy locked: Official / Live / Lyrics / Cover; clips removed
- Lyric videos re-tagged from `type: "official"` to `type: "lyrics"` on Lampshade, Quicksand Sinking, Friendly Fire
- Clips dropped from spine: '94 Acoustic Clip, Low Live Clip, Flash in the Pan Live Clip, A Pot Song Official Clip
- HrArchive `ALBUMS` reconciled: Skipping Stones last track corrected (Run From The Devil → Soul Sucker), Crooked Home appended Cookin' in the Bathroom and A Pot Song
- HrArchive `SINGLES` deduped (kept Chase The Dragon only)
