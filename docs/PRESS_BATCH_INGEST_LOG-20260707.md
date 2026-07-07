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
- Commit gate: pending (script delivered — MV: tag_vocabulary.json; museum: delta + log + stage2 tool).
