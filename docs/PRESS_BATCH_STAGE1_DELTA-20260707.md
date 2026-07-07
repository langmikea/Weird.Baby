# PRESS_BATCH_INGEST-20260707 — Stage 1 Delta (CURATION GATE — Mike rules)
**Session:** 2026-07-07 · Ops: Claude (Cowork) · read-only — NO MV writes, no repo code touched.
**Roster ruling (Mike, this session):** run the found 15. Harvest model: ALL quotes from ALL sources; speaker tagged as a vocab axis (proposal at V3).
**Sources verified this session:** live MV scratch copy (integrity ok, 297 artifacts), live tag_vocabulary.json v2.0, era-buckets.json v0.3, all 15 URLs fetched fresh. Full article texts + candidate quotes: `press_batch_url_dossier-20260707.md` (Cowork outputs, carried alongside this delta).

## A. Ground-truth corrections to the brief (verified against live DB)

1. **13 of the 15 are ALREADY IN MV** as `MV-20260617-001..013` — created 2026-06-17T15:35:29, status=vault, kind=NULL, url_only, stale pre-migration tags, extracted_text = short quote only (40–106 chars). The 6/17 session's "press never ran" referred to the pipeline; the raw records landed. **Stage 2 is therefore NORMALIZE + COMPLETE (13) + FRESH INGEST (2: PA Musician, NEPAudio) — not a 15-row insert.** No duplicates will be created.
2. The brief's "16-URL list" doesn't exist in any tree; canonical roster per Mike = these 15.
3. `source:press` (14 uses), `topic:roots`, `topic:release`, all people/venue slugs from the 6/17 batch are already REGISTERED in the reconciled registry — they entered pre-gate but survived the reconcile. Formal blessing at V5.

## B. Link-rot check (all 15, fetched 2026-07-07)

14 LIVE at canonical URLs, no paywalls, no redirects, no deaths. 1 UNCONFIRMED: the YouTube fan-crash video (`3ZemGTc1h3k`, MV-20260617-003) — fetcher gets a JS shell, oEmbed empty. **Ask: Mike confirms in a browser** (30 seconds) → rules its link_status.

## C. Per-artifact curation table (rule each row: Kind / tag deltas / release)

Default release = **vault** per brief; "→" marks proposed changes to the existing record. Era: NO hand era tags — era derives from dates at export (post-rewire). All keep band/album/song/topic tags as ingested unless noted.

| # | ID | Outlet · date | Proposed kind | Deltas proposed |
|---|---|---|---|---|
| 1 | MV-20260617-001 | Blue Harvest Beat · 2014-08-14 | **interview** | link_status→live; date confidence→extracted (page meta confirms) |
| 2 | MV-20260617-002 | Chasing Destino · 2018-04-25 | **interview** | same |
| 3 | MV-20260617-003 | YouTube fan-crash · 2018-07-09 | **candid** (as tagged) | link_status per Mike's browser check |
| 4 | MV-20260617-004 | LancasterOnline · 2019-10-10 | **press** (V1) | link_status→live; confidence→extracted; byline Kevin Stairiker |
| 5 | MV-20260617-005 | Whiskey Riff · 2023-04-25 | **press** (V1) | same; byline Hill Douglas |
| 6 | MV-20260617-006 | MuzicNotez · 2024-01-22 | **interview** | same; byline "MuzicNotez Crew" |
| 7 | MV-20260617-007 | Shore Fire announce · 2025-08-01 | **press** (V1) | same; label press release, no byline |
| 8 | MV-20260617-008 | Jambands · 2025-08-01 | **press** (V1) | same; byline Hana Gustafson |
| 9 | MV-20260617-009 | Isthmus · 2025 (undated listing) | **press** (V1) | link_status→live; post_date stays estimated 2025-09-12 |
| 10 | MV-20260617-010 | Shore Fire release-day · 2025-10-17 | **press** (V1) | link_status→live; confidence→extracted |
| 11 | MV-20260617-011 | Americana Highways · 2025-10-21 | **interview** | same; byline Brian D'Ambrosio |
| 12 | MV-20260617-012 | D'Ambrosio Substack · **2025-10-16** | **interview** | **post_date 2025-10-21→2025-10-16** (Substack is the ORIGINAL, ran 5 days before AH); link_status→live |
| 13 | MV-20260617-013 | The Country Note · 2025-11-24 | **interview** | **post_date 2025-11-25→2025-11-24** (page header; meta is a TZ artifact); byline Michelle Osterhoudt |
| 14 | **NEW** → MV-HR-20260707-005 | PA Musician Mag · 2019-09-05 | **press** (V1) | fresh ingest: band:medusas_disco, source:press, topic:touring; byline Michele Kelly; column mention, NO band quotes |
| 15 | **NEW** → MV-HR-20260707-006 | NEPAudio · 2019-10-20 | **press** (V1, review-type — see V6) | fresh ingest: band:medusas_disco, album:orphic_grimoire, source:press, topic:release; byline Sarah Kate Gittleman |

Era note (flagging, not asking): by date the MD-era items land in HR-album-anchored buckets (2014→The Band Years ✓; 2018→Going Solo; 2019→Life Inside a Wheel). Date-anchored by design; `era_override` via referenced_dates available per-artifact if any placement reads wrong on the wall.

## D. Vocabulary gate (each addition named — rule Y/N individually)

- **V1 — ADD `press` to the artifacts.kind CHECK.** Table rebuild, exact pattern proven by the `fact` rebuild (cf17d5c). Covers rows 4,5,7,8,9,10,14,15. Registry gets kind_column value `press` (display label Mike's call — "Press"?).
- **V2 — ACTIVATE reserved kind `interview`.** Registry flips `reserved:true` → live label ("Interview"). First inhabitants: rows 1,2,6,11,12,13. (No DDL — value already legal in CHECK.)
- **V3 — NEW axis `speaker` (Mike's harvest ruling).** Proposal: tag namespace `speaker:<person_slug>`, single-valued, applied to `fact` artifacts (quotes); values SHARE the person-slug registry with `people:` (one person vocabulary, two axes). Recipe cards then select on it directly ("Nick Root card", "reviewers on Arkansas"). Tier 3 (curation axis, not a browse facet) until FactScroller ships.
- **V4 — NEW person slugs** (needed as `speaker:` values for reviewer quotes; named individually): `harrison_giza`, `kevin_stairiker`, `hill_douglas`, `hana_gustafson`, `brian_dambrosio`, `michelle_osterhoudt`, `michele_kelly`, `sarah_kate_gittleman`, `muzicnotez_crew` (collective byline — or leave those quotes speakerless, Mike's call).
- **V5 — BLESS the pre-gate 6/17 entries:** `topic:roots`, `topic:release`, `source:press`, venue slugs (`chameleon_club`, `xl_live`), people slugs from the batch. Already live + registered; this makes them ruled-on-the-record.
- **V6 — Review handling:** NEPAudio (15) and parts of Blue Harvest Beat are REVIEWS. Recommend: kind=`press` covers them (one new CHECK value, not two); review character carried by existing `content_kind:press` + reviewer-quote facts. Alternative: separate `review` kind value. Recommend the former.

## E. Carried to Stage 3 (wording-gate watch items, not Stage 1 asks)

- Producer/engineer conflict: Shore Fire/Jambands/Isthmus say producer Anders Osborne + engineer David Kalmusky; D'Ambrosio says "producer David Kalmuskey" (sic). No fact asserts a producer credit without naming its source.
- Tracklist conflict: Aug 1 announce = 13 tracks (incl. "Sugercoat (Bonus Track)", sic); Oct 17 release-day = 12. Facts avoid asserting a track count.
- Source-side misspellings preserved as-printed only inside verbatim quotes; never in fact wording ("Medusa Disco", "Madusa's Disco", headline "It's").

## F. Stage 2 shape (post-gate preview, for scope agreement)

One host-side script (Mike-run, paste-back verified): (a) kind CHECK rebuild +press [V1]; (b) registry updates [V2–V5 as ruled]; (c) 13 UPDATE statements per table C rulings; (d) 2 INSERTs (rows 14–15); (e) verification block — counts, tag==column parity, integrity_check, registry sync. Then commit gate.

*End of delta. Awaiting: Stage 0 paste-back (backup script already delivered) + per-row rulings on C + Y/N per V1–V6.*
