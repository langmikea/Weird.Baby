# OPEN ACTIONS — the standing register

**Built 2026-08-04 (v49/A1) on Mike's instruction: *"the round's spine — Mike has
no way to see what is already reported."* It is the ONE place he looks.**

Every open item across **both repos** — defects, backlog, ledgered ideas,
`[PAPA]` gaps, flagged judgment calls — harvested from `STATE.md` in the museum
and the robots repo, every round log, every audit doc and every ledger.

> ## THE MAINTENANCE RULE (doctrine, recorded 2026-08-04)
>
> **Every future round updates this file in the same commit it seals.** A round
> that closes an item flips its status here; a round that exposes one adds a row
> here. A finding that lives only in a round log is a finding nobody will read
> again — that is the failure this register exists to end. Round logs stay the
> narrative; **this is the ledger.**
>
> Canonical statement: `docs/canonical/OPERATIONS.md` §7, Doctrine 14.

**Status** — `OPEN` (nobody has started) · `IN PROGRESS` · `RULED-AWAITING-BUILD`
(decided, not built) · `DONE`.
**Owner** — `Mike` (his call, or his camera) · `Ops` (scoping, verification,
docs) · `Code` (a build).

**What this register is not:** it is not a priority order and it does not say
what to do next. Everything below is open; the sequencing is Mike's.

---

## 0. THE SHORT LIST — what is waiting on Mike and nothing else

Nine of these are one word. They are pulled out of the tables below, not
duplicated by them.

| # | The question | Row |
|---|---|---|
| 1 | **Is the room THE MORGUE or IMAGE ARCHIVE?** Both are on the glass right now, title and subtitle. Strike one. | [M6](#m6) |
| 2 | **Thirty-one and a half, or thirty-one point four?** Two houses print two counts of the same machines. | [M1](#m1) |
| 3 | **Three plates on the MGK-VIIIp wall show something their captions do not describe.** Two are compositing assets. | [M7](#m7) |
| 4 | **The one plate showing the machine saying something shows it backwards** — and the whole photograph is flipped, so the fix is one horizontal flip. | [M2](#m2) |
| 5 | **The portrait introducing Hunter Root is a selfie in a vehicle, wearing another band's name.** | [M3](#m3) |
| 6 | **The Manual's plate is a render where its own ruling requires a photograph.** | [M4](#m4) |
| 7 | **Two dead files carry 154 strings, three of them self-flagged unverified about a real musician.** Delete, or keep and say why. | [M5](#m5) |
| 8 | **Three files in `public/` are referenced by nothing** — 2.5 MB shipped to the edge, one of them a corrupt PNG. | [M9](#m9) |
| 9 | **44 shipped assets have never had your verdict.** `npm run assets:checklist` prints the inspection. | [M22](#m22) |

---

## 1. RULINGS AND CALLS — Mike's

<a id="m1"></a>

| ID | What it is | Where it came from | Status | Owner | Raised |
|---|---|---|---|---|---|
| **M1** | **The unit count.** `/robots` prints **31½** on the tally card and in the FAQ; the robots repo's own words draft says **31.4**, with a `[PAPA]` reserving the `.4` as the Pi thread. Nobody supplied a half. Either answer is one edit; `31½` also means correcting the robots repo. | `docs/PROVENANCE_RULINGS-20260804.md` R1 · v48 | OPEN | Mike | 2026-08-04 |
| <a id="m2"></a>**M2** | **`front_screen.png` is mirror-reversed** — captioned *"The front glass, lit"*, the one plate showing the machine saying something. **New this round: the WHOLE PHOTOGRAPH is flipped**, not the screen — the lettering behind the unit reads backwards too, so the fix is a horizontal flip of the file rather than a re-shoot. | R2 · v48; whole-image diagnosis v49/A7 | OPEN | Mike | 2026-08-04 |
| <a id="m3"></a>**M3** | **The WAL portrait of Hunter Root.** The shirt reads CHET VINCENT AND THE MUSIC INDUSTRY across the chest. **New this round: it is also a phone selfie taken in a vehicle** — steering wheel, mirror and a parking lot are in frame — doing the job of an artist's introduction portrait. Cropping the shirt out does not fix the second half. | R3 · v48; framing v49/A7 | OPEN | Mike | 2026-08-04 |
| <a id="m4"></a>**M4** | **The Manual's plate is a render.** Clean digital type on white, 21 KB for a 1275×1650 page, where B8's own ruling for that face says the printed page is the source and the *photograph of the print* is the plate. | R4 · v48 | OPEN | Mike | 2026-08-04 |
| <a id="m5"></a>**M5** | **Two unreachable files still carry words.** `hr_facts.js` (124 strings, three self-flagged UNVERIFIED about a real musician) and `hr_journal_prompts.js` (30). One `import` from the glass. Delete, or keep and declare why. | R5 · v48 | OPEN | Mike | 2026-08-04 |
| <a id="m6"></a>**M6** | **THE MORGUE or IMAGE ARCHIVE.** Both are printed — title and subtitle, on both walls — so the choice can be made by looking. Whichever loses is one string per face. | Mike's A3 brief · v49 | OPEN | Mike | 2026-08-04 |
| <a id="m7"></a>**M7** | **Three of the nine MGK-VIIIp plates do not show what their captions say.** `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` (*"The bezel around the glass"*) is a CRT frame graphic with a blank white screen area. `monitor_base.png` (*"The base it stands on"*) is the family-shot composite dropped inside that frame — no base in it. `unit_new_base.png` (*"The unit on its new base"*) is the same pair on white with both screens masked out — a compositing intermediate. The wall's tombstone says *"Nine, all held by this museum"*. | v49/A7 | OPEN | Mike | 2026-08-04 |
| <a id="m8"></a>**M8** | **`mgk-viii-cover.jpg` cannot be straightened by rotation.** Measured: the machine's own aperture is −1.75° on its top edge and +2.48° on its bottom; the grille bars measure −2.69° to +5.40° depending on sampling height. It is keystoned, not tilted, and it has a mains adapter and a wooden floor in frame. It wants a photograph. | Mike's A8 brief · v49 | OPEN | Mike | 2026-08-04 |
| <a id="m9"></a>**M9** | **Three files sit in `public/` referenced by nothing** — `/images/wb-merch/hunter-root.png` (1.7 MB, orphaned when F7b removed his banner), `/images/wb/vol1_cover_v0.png` (superseded; also a JPEG named `.png`), `/WeirdBaby_PhotoID_backup.png` (**truncated — a corrupt PNG at a public URL**). Delete, or keep and say why. | v49/A5 | OPEN | Mike | 2026-08-04 |
| **M10** | **`/foundation` Q7's narrowing.** The one edit E1 made to copy Mike had already approved. One string to revert if he wants the flat *No* back. | v43/E5 | OPEN | Mike | 2026-08-03 |
| **M11** | **The four unpublished invoice figures** — domain, robot supplies, manufacturing, the extras. The invoice is built to take them. | v43/E1 | OPEN | Mike | 2026-08-03 |
| **M12** | **`THE_CHARTER.md` is still DRAFT v0.3, "not published."** | v43/E5 | OPEN | Mike | 2026-08-03 |
| **M13** | **The Billionaire's Credo is unwritten.** Q10 carries a `[PAPA]` and the scrubber drops it. | v43/E5 | OPEN | Mike | 2026-08-03 |
| **M14** | **`--wb-gold-mute` and `--wb-gold-lo` are half a stop apart.** F0's finding; a palette call, and palette calls are Mike's. | v40/F0 · v43/E5 | OPEN | Mike | 2026-08-03 |
| **M15** | **`/robots` Welcome still says "three cartons".** The same count H4 named as invented inside Record 013 is the first sentence a stranger reads on entering the wing. Left standing deliberately; one word settles it. | v47 exposure #9 | OPEN | Mike | 2026-08-04 |
| **M16** | **Two songs have almost no song-tier facts.** Jesse Welles' *"That Can't Be Right"* has **zero** (all three it had were our research narrative); *"There's A Hole"* has one, and the file's own note says one fact reads as a stuck scroller. Nothing was invented to fill either. | v46/C4 | OPEN | Mike | 2026-08-04 |
| **M17** | **The `/hr` journal is dead machinery.** The tab is unreachable and `submitEntry` writes to component state only — an entry would not survive a reload. Build it or retire it. | v46/C4 | OPEN | Mike | 2026-08-04 |
| **M18** | **Twenty-seven questions on Record 013**, one gap apiece, none blocking. Highest value is D1, *why wasn't it hacked*. | `docs/RECORD_013_QUESTIONS-20260804.md` · v47/H6 | OPEN | Mike | 2026-08-04 |
| **M19** | **What a record NUMBER means.** Are the numbers the full 436-record numbering, or a numbering of this volume? A volume where some entries have numbers and some do not is the visible symptom of the undecided question, and it is on the page. | v45/R5 #1 | OPEN | Mike | 2026-08-04 |
| **M20** | **The three Printful sticker variants still carry the old low-res master.** The in-shop image is fine; this is the print file. Blocks nothing. | STATE gift-shop pipeline | OPEN | Mike | 2026-06-23 |
| **M21** | **Thirty-five `[PAPA]` markers sit in content files awaiting his words** — robots 16, Worth A Listen 6, `/foundation` 7, `/booth` 6. All are scrubbed at the render seam, so none is visible; each is a sentence he has not written. | standing, `src/lib/visitor-prose.js` | OPEN | Mike | ongoing |
| <a id="m22"></a>**M22** | **44 shipped assets carry no verdict from Mike.** `npm run assets:checklist -- --room <slug>` prints the inspection list for one room; `npm run assets:gate` fails while any presented asset is unpassed. | v49/A5+A6 | OPEN | Mike | 2026-08-04 |

---

## 2. ART PENDING — needs a camera or an artwork, not code

| ID | What it is | Where it came from | Status | Owner | Raised |
|---|---|---|---|---|---|
| **P1** | **The Record's evidence, photographed.** `.vp-fe-plate` is built and empty. The Record's real answer, and the one the visual-hook audit named. | VISUAL_HOOK_AUDIT · v43/E5 · v45/R5 #8 | OPEN | Mike | 2026-08-03 |
| **P2** | **The Manual's microfiche plates.** `plates: []`, with B8's shoot spec written into the face's own header (≥2400px long edge, whole page including margins, reel order = reading order, `label` + `date` per frame). | v43/E5 | OPEN | Mike | 2026-08-03 |
| **P3** | **`MV-HR-20260405-035`** — a good picture of Hunter Root trapped inside a Facebook screenshot. A second plate if re-captured clean. | v43/E5 | OPEN | Mike | 2026-08-03 |
| **P4** | **A photograph of the MGK-VIII to serve as its cover.** See M8 — the current one is keystoned and cannot be edited straight. | v49/A8 | OPEN | Mike | 2026-08-04 |
| **P5** | **Sixty entries are sixty hooks** against a wing that owns eight photographs. Record 013 met the hook law by borrowing a plate; that does not scale. | v45/R5 #8 · v46/C4 #11 | OPEN | Mike | 2026-08-04 |

---

## 3. CODE — buildable, museum repo

| ID | What it is | Where it came from | Status | Owner | Raised |
|---|---|---|---|---|---|
| **C1** | **Record pagination at scale.** `shouldBand` turns on at ≥14 entries and >1 month; the Record holds one entry, so that machinery has never run. Sixty entries trip it on day one. | v45/R5 #2 | OPEN | Code | 2026-08-04 |
| **C2** | **A timeline thermometer.** *"8 of 11"* is a count, not a position. At sixty entries a reader needs to know where in the run they are standing. | v45/R5 #3 | OPEN | Code | 2026-08-04 |
| **C3** | **Filter and search over the Record's index.** The evidence classes already ride the rows; nothing lets a reader ask for only the corrections. | v45/R5 #4 | OPEN | Code | 2026-08-04 |
| **C4** | **A walk that can skip.** ‹ NEWER / OLDER › is strictly adjacent; the log's spine is its corrections and its evidence, which is not its chronology. | v45/R5 #5 | OPEN | Code | 2026-08-04 |
| **C5** | **Cross-references have no reverse.** The entry being pointed AT does not know it, and it is the one a reader arrives at. | v45/R5 #6 | OPEN | Code | 2026-08-04 |
| **C6** | **The `[[n]]` door-marker syntax is unpoliced.** A marker with no matching door renders nothing and drops the door at the end — the right failure, and it wants a build-time check. | v45/R5 #7 | OPEN | Code | 2026-08-04 |
| **C7** | **The v45 inline-door container is exercised nowhere.** All four doors were anchored to material v47 deleted. Correct machinery, no data. | v47 exposure #3 | OPEN | Code | 2026-08-04 |
| **C8** | **`Exhibit.jsx` threads `epoch={face.recordEpoch}` and the Record declares none.** Correct machinery with no data; it works the moment M19 is answered. | v47 exposure #8 | OPEN | Code | 2026-08-04 |
| **C9** | **The `/robots` contents column is 76% blank paper** since the photo strip came off. Reported, unfilled by ruling. | v47 exposure #6 | OPEN | Code | 2026-08-04 |
| **C10** | **The Record's closed face has no visual hook** — a heading and one row of type. A live conflict with the standing Visual Hook Law, resolved in favour of Mike's H1 ruling. | v47 exposure #2 | OPEN | Code | 2026-08-04 |
| **C11** | **DECK-SCROLL-OCCLUSION** — the player bar hides the deck's bottom. Confirmed reproducing 2026-06-17. Minor, consistent. Piggyback when deck work opens the file. | STATE known issues | OPEN | Code | 2026-06-17 |
| **C12** | **DECKBUG-FBBLOCKS** — an FB embed renders as a black/white block. Reproduction unconfirmed. | STATE known issues | OPEN | Code | — |
| **C13** | **Video-panel YT-thumb fallback** is an unclassed full-bleed `img`. Mostly moot since albums carry art. | STATE known issues | OPEN | Code | — |
| **C14** | **`jesse-welles-plate.jpg` is a WebP named `.jpg`, and it ships.** Browsers sniff so it renders; every tool that trusts the extension reads it wrong. Rename + update the one reference, or leave and record why. | v49/A5 | OPEN | Code | 2026-08-04 |
| **C15** | **Collage tile labels are not scrubbed for `[PAPA]`.** Spread headings now are (v49/A3); the tiles' own `label` and `date` are not, and a marker written into one would print. | v49/A3 | OPEN | Code | 2026-08-04 |
| **C16** | **The morgue's two sibling forms are defined and not built** — a video archive and an audio archive, the same component with different data. Neither has content today: every `videos:` array in the robots wing is empty and the wing has no audio. `/wb` has six tracks and no archive face, which is where an audio archive would land first. | v49/A3 | RULED-AWAITING-BUILD | Code | 2026-08-04 |
| **C17** | **Four pre-existing lint errors** (`WbAdmin.jsx:18`, `Exhibit.jsx:88/191/517`) each need semantic review, not a mechanical fix. | CLAUDE.md lint-debt table | OPEN | Code | pre-May 2026 |
| **C18** | **Gift shop wiring + Mike's own gift shop.** A full-launch gate. Gated on Mike bringing source. | STATE full-launch gates | OPEN | Code + Mike | — |
| **C19** | **Shirts and hats are not built.** The next durable merch work, storefront-agnostic. | STATE gift shop | OPEN | Mike | 2026-06-23 |
| **C20** | **`shop.weird.baby` custom domain** — deferred to launch; needs Big Cartel Platinum. | STOREFRONT DECISION | OPEN | Mike | 2026-06-23 |
| **C21** | **Substantially more content** before traffic is worth driving. The largest lever on the launch gate. | STATE full-launch gates | OPEN | Mike + Ops | — |
| **C22** | **Fact collection beyond the pilot 97**, plus the `hr_facts.js` unique-seed salvage. The largest remaining content lever on the FactScroller. | STATE NEXT #7 | OPEN | Ops | 2026-07-07 |
| **C23** | **Presets §8.1 phase 2** (mobile factory Show, peek-return chip) and the preset-as-artifact model. Not blockers. | `docs/UX_PRESETS_SPEC.md` | OPEN | Code | 2026-06-07 |
| **C24** | **The Kaleidoscope is mothballed** — built, never mounted, revives post-launch by Mike's choice. | STATE mothballed | OPEN | Mike | v28 |
| **C25** | **Brand-aligned aesthetic, the deliberately-untouched remainder:** variant-pill type colours, journal semantic green/red, per-album accents, mothballed palettes. Awaiting Mike's read. | STATE backlog | OPEN | Mike | 2026-06-07 |
| **C26** | **Backups: periodic re-mirror + the quarterly restore drill** (charter 3.4). `mirror_db_backups.ps1` makes the first a one-command step; the drill has never been run. *A backup nobody restored is a rumour.* | STATE backup status | OPEN | Mike | 2026-07-07 |
| **C27** | **Mobile UX, banner-match-nav and cover-pill render** need live narrow-width inspection by a person, not a measurement. | STATE cannot-verify | OPEN | Mike | — |
| **C28** | **All MediaVault-repo items** are unreachable from a museum session and need an MV-side pass. | STATE cannot-verify | OPEN | Ops | — |

---

## 4. THE ROBOTS REPO — `C:\AI\Projects\weird-baby-robots`

| ID | What it is | Where it came from | Status | Owner | Raised |
|---|---|---|---|---|---|
| **R1** | **Contract docs migration** — Numerical Envelope v1.0, Governance, BOM, UX — from OneDrive `MASTER FILES` into `robots/mgk-viii/contracts/`. The LANDING GATE applies. | robots STATE open issues #1 | OPEN | Mike | 2026-07-13 |
| **R2** | **WS0 bench compile + on-unit verify** of the curated VIIIp firmware head (Nano 33 BLE Sense — `Arduino_BMI270_BMM150` + `PDM`). | robots STATE #2 | OPEN | Mike | 2026-07-13 |
| **R3** | **Hash-verify the 11 VIIIp originals** against the MKR manifest. Sizes already match exactly; host-side pwsh. | robots STATE #3 | OPEN | Mike | 2026-07-13 |
| **R4** | **Retire or absorb `C:\AI\Projects\MGK-VIII\`.** Its viewer and libraries need a rule: gitignored here, or left in place. | robots STATE #4 | OPEN | Mike | 2026-07-13 |
| **R5** | **Confirm whether `Weird.Baby_Screen_Leak.MOV` is the Tal Avitzur video.** | robots STATE #5 | OPEN | Mike | 2026-07-13 |
| **R6** | **Twin game text formatting** — GAME OVER / score / front-card placement wants a pass. LOW, non-urgent. | robots STATE #11 | OPEN | Code | 2026-07-15 |
| **R7** | **Snow Globe needs general work** — drift/settle feel, snow density, shake response. Reads as a first cut. LOW. | robots STATE #12 | OPEN | Code | 2026-07-15 |
| **R8** | **PARKED — firmware 32-slot Answers menu vs the 31.4-unit fleet canon.** Revisit at the L3 / WS2 design gate. Do not work. | robots STATE parked | OPEN | Mike | 2026-07-14 |
| **R9** | **PARKED — the −03 character identity tangle** (CEO / Investor / Executive / "Stand Alone"). Revisit at L3. Do not work. | robots STATE parked | OPEN | Mike | 2026-07-14 |
| **R10** | **The RECONCILE list** (§B of `MARKUP_RULINGS+RECONCILE-20260718.md`) awaits Mike's porch-style cards. Accidental source conflicts get reconciled; contradictions are PLACED, never inherited. | robots STATE doctrine | OPEN | Mike | 2026-07-18 |

---

## 5. CLOSED THIS ROUND (v49, 2026-08-04)

| ID | What it was | How it closed |
|---|---|---|
| **A2** | **The tracklist/viewer title bar scrolled off the top.** Reported by Mike and unfixed. Measured on `/robots` at scrollY 500: the band's top was at **−132px**. It had been pinned on `/wal` and only there, because the stickiness was a property of the transport's class rather than of the band. | **DONE** — the pin moves onto `.ex-album-banner` itself, with F2's apron and P1's `pointer-events:none` travelling with it. The flat wing's contents column re-derives its own sticky offset from the band's height so it cannot print underneath it. Verified pinned at `top:52` on `/robots`, `/hr`, `/wal` desktop and at 390px. |
| **A3** | **"THE PLATES" renamed.** | **DONE, pending M6** — both walls read **THE MORGUE** with **IMAGE ARCHIVE** as the plain-language subtitle, so Mike chooses from the glass. The individual photographs are still called plates. |
| **A4** | **Archive structure.** | **DONE** — `ArchiveWall` stacks the collage in headed spreads sorted by record number descending, and the lightbox walks the whole archive in display order. No spread carries a number today because the museum holds none; the order falls to the authored newest-first, and the gap is M19. |
| **A5** | **The asset table.** | **DONE** — `provenance/asset-table.json`, 251 rows across both repos, scanned by `tools/asset-table.mjs`. The scan never overwrites a judgement. |
| **A6** | **The Record Approval Gate.** | **DONE** — doctrine recorded (`OPERATIONS.md` §7 Doctrine 15), wired to the table's `verdict` field via `npm run assets:gate` and `assets:checklist`. |
| **A7** | **Image quality pass.** | **DONE** — every shipped image looked at: 30 usable · 5 weak · 1 placeholder · 5 wrong; 6 audio files honestly marked *not listened to*. Nothing fixed without Mike. |
| **A8** | **The MGK-VIIIp cover becomes just the machine.** | **DONE** — cropped to the unit's measured bounding box, 1536², 8-bit grey (lossless), 2.69 MB → 1.40 MB. It also stopped the deck's `object-fit:cover` decapitating a 3:4 file. The common theme is written into `robots.js`; **the straighten is refused with measurements** — see M8. |
| **A10** | **The RESTATED provenance class stays.** | **DONE** — recorded as an Ops ruling in `OPERATIONS.md` §7 Doctrine 13 and in STATE.md. |
| **—** | **`CLAUDE.md` published a stale lint baseline** (4 errors / 6 warnings) where the live baseline has been **11 / 9** since at least v40. An orientation doc that misstates the tripwire disables the tripwire. | **DONE** — corrected in the same commit. |

---

## 6. HOW THIS FILE WAS BUILT, so the next round can extend it the same way

Harvested, in this order:

1. `STATE.md` (museum) — FULL-LAUNCH GATES, NEXT, KNOWN ISSUES, the gift-shop
   still-open block, BACKUP STATUS, CANNOT-VERIFY, Backlog.
2. `STATE.md` (robots) — Open issues, Parked, Design doctrine.
3. The round logs' own carry-forward sections — v43/E5, v45/R5, v46/C4,
   v47 *"what this round exposes"*, v48/P4.
4. `docs/PROVENANCE_RULINGS-20260804.md` and
   `docs/RECORD_013_QUESTIONS-20260804.md`.
5. `docs/VISUAL_HOOK_AUDIT-20260803.md`.
6. A count of `[PAPA]` markers inside string literals in `src/`.
7. This round's own findings.

**Deliberately not harvested:** the ~130 historical run reports and briefs in
`docs/`. Their open items were either closed by a later round or carried into
`STATE.md`, and sweeping them would fill this register with items nobody can
tell the status of — which is the opposite of what it is for. If something is
missing from this file, add the row; do not add the archive.
