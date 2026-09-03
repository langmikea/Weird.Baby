<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — 2026-09-02

## LIVE
Museum `8f5888d`, stage `launch`, deployed 2026-09-01T15:50:41.318Z
(`docs/DEPLOYED.md`). Every commit since it is docs, tools or package.json;
nothing served has changed. Nothing waits on a deploy.

## NEXT ON THE CLOCK
- **2026-09-07 17:00 America/New_York:** Record 001 posts and the wing opens
  itself. No deploy, no hand. `npm run reveal:day` reads nothing to move.
- **2026-09-09 17:00:** Record 003 posts. The five manual scans are off it and
  scan-31-a is dead; nothing that replaces them is built.
- **Week two (from the 14th):** two lanes, ruled 09-02: the Record (five
  entries, the site posts them) and Mike playing (five short reels, Mike
  posts them). No week-two Records, no calendar yet; the calendar can be built.
- **Sunday 09-06 is clock day** (Mike's rule): nothing is worked on before
  then because of the date. All six pillar briefs are ruled; the rulings and
  what each changes are in `docs/PILLARS_RULINGS-20260902.md`.

## MIKE OWES
- Record 001 edits in the day editor, unlanded and expected; leave
  `docs/dictation-20260807/` alone and do not run `record:land` or `day:proof`.
- The paragraph that replaces the April vision; his words stand meanwhile in
  `docs/canonical/WHAT_WEIRD_BABY_IS.md`.
- After Sunday, in his words: the Foundation room's copy (a posture, no
  pipes; National Coalition), the robots FAQ's buying line (not for sale
  during the story), the About-the-Artist words on `/wb`.

## OPS OWES
- The System, what remains: narrow the provenance gate to Mike's words and
  the scroller (after the 7th); the museum's own 196 KB STATE.md (its laws
  to canon verbatim, rounds to archive); source-file comments quoting old
  numbers (after the 7th). Done 09-02: the robots round documents (53
  archived), the album mirror, the robots STATE.md cut from 608 KB to 11 KB
  (`robots:docs/archive/STATE-FULL-9655fa5.md`, Mike's words re-quoted in
  `STATE-mike-verbatim.md`).
- The arc, Mike 09-02 (`docs/ARC.md` §6): the story explains the device;
  every feature, program, adjustment, manual portion and artifact can be a
  day. Ops owes: once the manual is written, a pass that uses it as the
  publishing guide for the device Records, and a first fill of the ledger's
  `when` column by that rule.
- The reveal choreography is ruled (A, third cut): `reveal/schedule.json`
  is the ruling; after Sunday, fill the ledger's `when` (story week numbers)
  in `reveal/ledger-declare.mjs` from it and rebuild; then brief the ZIP
  browser (a new in-story surface: the Record's ZIP, browsable, entries
  readable on the schedule; no download). The calendar's Record lane
  carries the headlines through week 8.
- The manual: Mike's ruling A (Ops drafts by section). The register test is
  served (`C:\AI\REVIEW-20260902\register-test.html`); his pick is pending.
  The facts sitting is CLOSED (rulings in `docs/PILLARS_RULINGS-20260902.md`,
  "The manual's facts sitting"): the firmware rules for the machine's facts;
  all 26 answered; the seven first-boot questions answered. Writing starts on
  his register pick: Sections IV, VI, VIII and Appendix B rewritten in that
  voice, then the unwritten sections drafted against the rulings, served as
  rendered pages. Masters regenerate after 09-09.
- After Sunday, robots repo: the Everyday takes serial −01 and the Housewife
  Nano moves to −02 (`unit_registry.csv`, the STATE registry, the built
  `units/02` directory); the twin's wake-order race is fixed (two awaits) so
  the front glass wakes first as canon says; the canon catalogue's CONFLICTS
  and HOLES entries touched by the sitting are marked ruled.
- Branch `zip-and-parcels` (pushed) holds the first two modules of the build
  brief (`docs/BUILD-BRIEF-day-gating-and-zip-20260902.md`): `src/lib/schedule.js`
  and `src/lib/twin-keys.js`, unwired, lint clean. Next on it, after Sunday:
  per-row parcel keys in the twin, the query parameter, the ZIP browser route.
  Main carries none of it.
- Sunday, after the Record lands: one edit in `reveal/ledger-declare.mjs` so
  `R()` takes `when` from `reveal/schedule.json` by id when `extra.when` is
  absent; rebuild the ledger; run `reveal:check` (transfers.mjs compares
  `when` against class arrival weeks and may fault; read each fault before
  moving a date). Pass 5 ruling (Mike, 2026-09-02): the desk stays for the Record editor;
  the light table stays; facts, assets and reveal instruments are Ops' to keep
  or drop.
- Guard 6 blocks four of five Record entries from landing; ruled a bug or a rule (Sunday).
- The week-two calendar: two rows, five columns, conversational; buildable now.
- Repoint the Foundation's roster entry and held donate link from the New
  York coalition to the National one (`nationalhomeless.org`; details in
  PILLARS_RULINGS 4bB). Src; after Sunday.
- `C:\AI\mirror_vol1_backup.ps1` mirrors the album folder to OneDrive with a
  manifest (first run 2026-09-02, 45 files, deposit set verified). Re-run after
  any change to the album folder; it is not scheduled.
- Later briefs, one each: the five April laws; the twin behind the door and
  which twin copy is master; the 489 asset verdict fields.
- `docs/ARC.md` prints MON for Record 001 whatever the epoch says (archive row D-a).
- `npm run desk` still renders the retired register.

The review and the one-page view: `C:\AI\REVIEW-20260902` (`pillars.html`).
Quarantine: `C:\AI\_QUARANTINE-20260902`, delete on or after 2026-10-02.
