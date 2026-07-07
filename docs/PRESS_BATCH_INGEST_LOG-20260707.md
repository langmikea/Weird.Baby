# PRESS_BATCH_INGEST-20260707 — Run Log
Brief: docs/PRESS_BATCH_INGEST_BRIEF-20260707.md · Ops: Claude (Cowork) · MV writes host-side only (Mike-run scripts, paste-back verified).

## Session rulings on the record (Mike, 2026-07-07)
- Roster: the brief's "16-URL list" does not exist in any tree (per-session finding). Mike ruled: **run the found 15** = 13 already-ingested MV-20260617-001..013 + PA Musician 2019-09-05 + NEPAudio 2019-10-20.
- Harvest model: **all quotes from all sources**; speaker tagged as a vocab axis (proposal = Stage 1 delta V3).

## Stage 0 — Backup: PASS (verification gate, delegated; called by Ops 2026-07-07)
- Mike ran the backup script host-side, pwsh 7.6.1. Paste-back on record in session.
- No -wal/-shm present at copy time (DB quiescent).
- `core/backups/mediavault_pre-press-batch-20260707T180632Z.sqlite`, 1,953,792 bytes.
- SRC sha256 == DST sha256 == `CA49A556CD08306775DFFDAB969621AD6D33A7303F25A7D7804A97FBD2066B40` (host) == independent sandbox re-hash of the backup file (match confirmed).
- Readability proven on a scratch copy: `pragma integrity_check` = ok; 297 artifacts; 13 MV-20260617-* press rows; 4 fact rows — matches live head.
- Standing note: backups are gitignored; durable home = OneDrive mirror (point-in-time — re-mirror when convenient).

## Stage 1 — Ground-truth + curation delta: DELIVERED, AWAITING MIKE'S GATE
- Read-only pass complete 2026-07-07. Full delta: `docs/PRESS_BATCH_STAGE1_DELTA-20260707.md`.
- Headline findings: 13/15 already in MV (6/17 session; vault, kind=NULL, stale tags, quote-only extracted_text) → Stage 2 re-scoped to NORMALIZE+COMPLETE(13) + INSERT(2). Link-rot: 14/15 LIVE, YouTube video unconfirmed (JS shell; Mike browser-check asked). Substack post_date correction (2025-10-16, original publication, before Americana Highways). Vocab gate items V1–V6 (add kind `press`, activate `interview`, new `speaker` axis + person slugs, bless pre-gate 6/17 values, review handling).
- Quote dossier (full texts + candidate quotes, Stage 3 input): Cowork outputs `press_batch_url_dossier-20260707.md` — kept OUT of the repo by copyright rule (no wholesale reproduction).
- GATE: **PASS** (Mike, 2026-07-07). Rulings on the record:
  - Table C: all 15 approved as proposed, incl. both post_date corrections + 2 fresh ingests.
  - Release: **RELEASE all 15** (overrides vault default) — EXCEPT row 3.
  - Row 3 (MV-20260617-003): Mike's browser check → "Video unavailable — this video is private." link_status=dead; artifact stays VAULTED (record preserves that the interview existed; metadata-only card = future call).
  - V1 Y (kind `press`, label "Press") · V2 Y (activate `interview`, label "Interview") · V3 Y **amended: speaker values include OUTLETS as well as persons** (unattributed article facts quotable, publication is the speaker; MuzicNotez Crew resolves as the outlet) · V4 Y (all person slugs) · V5 Y (blessed) · V6 Y (reviews are `press`).
  - Stage 2 shape agreed; CHECK rebuild must follow the fact-rebuild pattern exactly (backup-pinned, single transaction, two-way parity before drop, cf17d5c mold).

## Stage 2 — Script delivered, awaiting host run
- `tools/press_batch_stage2.ps1` (Cowork-drafted 2026-07-07). Pinned to Stage-0 sha256 `CA49A556…`. Phases: A pre-checks (297 rows, 13 vaulted kind-NULL press rows, vocab 22, registry 211) → B kind CHECK rebuild +press (mold: parity before drop, one transaction) → C one transaction: speaker namespace insert, 13 ruled updates, 2 inserts (MV-HR-20260707-005/006), full registry recount → D post checks (integrity, fk, source parity 299, band 295, kind/status distributions, sample print) → tag_vocabulary.json regeneration (pre-edit backup written alongside).
- Expected post-state: 299 artifacts; kind dist None 134 / release 107 / performance 23 / candid 10 / announcement 6 / studio 1 / fact 4 / interview 6 / press 8; status released 211 / vault 86 / inbox 1 / archived 1; vocabulary 23 namespaces; registry 211 slugs, 0 unregistered, 0 zero-usage.
- GATE (verification, delegated): **PASS** (Ops, 2026-07-07). Host run clean: STAGE2_OK / STAGE2_SCRIPT_DONE, zero aborts. Paste-back on record. Independent verify against fresh mount copy (sha256 `48D6492A…` matches host post-hash): integrity ok; 299 artifacts; kind dist exact (press 8, interview 6, candid 10, None 134); status exact (released 211, vault 86); speaker namespace row present; both inserts correct; Substack date correction landed (2025-10-16).
- Post-run DB sha256: `48D6492AE6413ABF06FDD9F10B49FCE7AF5CD59C268C08CF356FF99F8C5E6B48` (new pin for any later stage).
- HAZARD RECONFIRMED (OPERATIONS §8 read-lag): bash mount served tag_vocabulary.json truncated at 3,369 bytes/15 lines after the host edit; host-side file tools show the full correct 66-line file (speaker line 31, kind values +press, interview activated, press label). Initial "broken JSON" read through the mount was FALSE ALARM — mount lag, not corruption. JSON validity machine-check rides the commit script.
- Commit gate: **PASS** 2026-07-07. MV `86c10f6` (tag_vocabulary.json; JSON_VALID printed) — **push outstanding** (origin = github.com/langmikea/mediavault). Museum `9347de9` committed AND pushed, origin/main confirmed. Both status --short clean.

## Stage 3 — Fact extraction: wording gate PASS, insert script delivered
- Candidates: `docs/PRESS_BATCH_STAGE3_CANDIDATES-20260707.md` — 93 facts (all quotes from all 15 sources + derived facts; Jambands/Substack duplicates folded as corroborating breadcrumbs).
- WORDING GATE: **PASS** (Mike, 2026-07-07): all 93 approved as worded, zero line edits. Rulings: (1) Nick [HEAVY]/[PROF] items pass as worded; (2) speaker roster approved; (3) LYRIC convention = speaker:hunter_root, song in scope tags; (4) C46 one home (SF announce) + three corroborating breadcrumbs; (5) pilot MV-HR-20260707-001 breadcrumb strengthened with the now-source-backed death date (Root via Whiskey Riff: 2021-04-15, age 27), wording unchanged.
- Payload: `tools/press_batch_stage3_facts.json` — 93 facts MV-HR-20260707-007..099, one speaker each; 19 speaker slugs (10 persons incl. michele_kelly per V4, 9 outlets per V3 amendment), every slug used ≥1 (F7-clean). Validated: parse OK, ids unique, no missing fields, speaker usage == registry map.
- Script: `tools/press_batch_stage3.ps1` — pinned to post-Stage-2 sha256 `48D6492A…`; one transaction (19 registry inserts at first use → 93 artifact inserts, ALL vault-status → pilot-001 notes append → full registry recount → in-txn checks), rollback on any mismatch; post-checks incl. vault-facts 97/97; tag_vocabulary.json speaker values filled with in-script JSON validity check (lesson from the Stage 2 mount false alarm: validity now proven host-side in the same run).
- Expected post-state: 392 artifacts; facts 97 (all vault); released 211 unchanged; registry 230, 0/0; source parity 392; band 388; speaker occurrences 93.
- GATE (verification, delegated): **PASS** (Ops, 2026-07-07). Host run clean: STAGE3_OK / JSON_VALID (19 speaker values) / STAGE3_SCRIPT_DONE, zero aborts; paste-back on record. Independent verify against fresh mount copy (sha256 `72BF738A…` matches host post-hash): integrity ok; 392 artifacts; 97/97 facts vault-status; released 211 UNCHANGED (no fact reaches visitors); registry 230 (0 unregistered / 0 zero-usage); speaker occurrences 93 (top: hunter_root 43, wynton_huddle 10, shore_fire_media 8); C46 three-breadcrumb ruling and pilot-001 append verified in the rows.
- Post-run DB sha256: `72BF738AD43EE967893180362829B08E6F6D81499F58F20BDD130E055172807F` (pin for Stage 4 if it writes).
- Commit gate: **PASS** — MV `9c95833` committed AND pushed (origin confirmed; Stage 2 push debt cleared same gate); museum `b158c8f` committed AND pushed, origin confirmed. Both trees clean.

## Stage 4 — Export + deploy + close: PASS
- Export (host, MV server up): 47 artifacts (33 + 14 released press/interview), 263,070 B; 0 underivable leaves; weighted date-sets baked; vocabulary registry 23 rows (+speaker). Spot gates in paste-back all correct: released rows present, vaulted video absent, facts absent, no speaker tags in export.
- Ops deep verify (host-side reads): all 14 released ids present exactly once in hunter_root.json; record shape correct (grouped tags, dates baked, e.g. `-005` = 2019/publish/weight 2); vocabulary.json carries speaker namespace (client board unaffected — facet keys hardcoded).
- Commit `eb8ec09` (explicit paths) + push, origin confirmed. Build clean (vite 8.0.7). **Deploy `2b1a853b-c0b7-42c4-982b-56f08db57003`** (wrangler 4.81.1).
- Live verification: weird.baby/hr HTTP 200; shipped bundle (hash-matched `index-DXRMLY3e.js`) contains `MV-HR-20260707-005`, contains NO fact ids and NO vaulted-video id — zero vault leakage. Mike incognito walk: press cards render on the wall (screenshot on session record).
- GATE: PASS. STATE.md ledger updated (SHIPPED block, LIVE deploy, NEXT queue: press batch DONE, FactScroller re-plumb unblocked).

## Session-close
- Ledger + this log close ride the final commit. Standing reminder: OneDrive re-mirror of the MV backup + repo mirror are point-in-time and now stale-by-one-session.
- STOP-CONDITION AUDIT: zero unapproved vocab values (every addition named + Mike-gated: press, interview activation, speaker axis, 19 speaker slugs); zero integrity mismatches (every stage integrity_check=ok, two pinned rebuild/insert runs, zero rollbacks); every fact defensible (verbatim quotes + breadcrumbs to in-vault sources; wording gate PASS all-93).
