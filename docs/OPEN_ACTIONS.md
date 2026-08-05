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

Most of these are one word. They are pulled out of the tables below, not
duplicated by them.

**Number 1 is the only one that gets worse by waiting** — it is two pairs of
live alternatives, and until one of each is struck the museum ships both.

| # | The question | Row |
|---|---|---|
| 1 | **Which booth hook, and which guest book?** Both pairs are BUILT and both are live — `/booth` vs `/booth?hook=sign`, `/` vs `/?book=scroll`. Look at four pages, strike two. | [M23](#m23) |
| 2 | **Thirty-one and a half, or thirty-one point four?** Two houses print two counts of the same machines. | [M1](#m1) |
| 3 | **Three plates on the MGK-VIIIp wall show something their captions do not describe.** Two are compositing assets. | [M7](#m7) |
| 4 | **The one plate showing the machine saying something shows it backwards** — and the whole photograph is flipped, so the fix is one horizontal flip. | [M2](#m2) |
| 5 | **The portrait introducing Hunter Root is a selfie in a vehicle, wearing another band's name.** | [M3](#m3) |
| 6 | **The Manual's plate is a render where its own ruling requires a photograph.** | [M4](#m4) |
| 7 | **Two dead files carry 154 strings, three of them self-flagged unverified about a real musician.** Delete, or keep and say why. | [M5](#m5) |
| 8 | **Four files in `public/` are referenced by nothing** — 2.8 MB shipped to the edge, one of them a corrupt PNG. | [M9](#m9) |
| 9 | **43 shipped assets have never had your verdict.** `npm run assets:checklist` prints the inspection. | [M22](#m22) |
| 10 | **One wall says its nine plates are "before power" and one of them is captioned as the firmware running.** | [M25](#m25) |

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
| <a id="m6"></a>**M6** | ~~THE MORGUE or IMAGE ARCHIVE.~~ **CLOSED — Mike struck THE MORGUE.** Both walls now read IMAGE ARCHIVE and the subtitle carries the unit alone. The individual photographs are still called plates. | Mike's A3 brief · v49; ruled N1 · v50 | DONE | Mike | 2026-08-04 |
| <a id="m7"></a>**M7** | **Three of the nine MGK-VIIIp plates do not show what their captions say.** `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` (*"The bezel around the glass"*) is a CRT frame graphic with a blank white screen area. `monitor_base.png` (*"The base it stands on"*) is the family-shot composite dropped inside that frame — no base in it. `unit_new_base.png` (*"The unit on its new base"*) is the same pair on white with both screens masked out — a compositing intermediate. The wall's tombstone says *"Nine, all held by this museum"*. | v49/A7 | OPEN | Mike | 2026-08-04 |
| <a id="m8"></a>**M8** | **`mgk-viii-cover.jpg` cannot be straightened by rotation.** Measured: the machine's own aperture is −1.75° on its top edge and +2.48° on its bottom; the grille bars measure −2.69° to +5.40° depending on sampling height. It is keystoned, not tilted, and it has a mains adapter and a wooden floor in frame. It wants a photograph. | Mike's A8 brief · v49 | OPEN | Mike | 2026-08-04 |
| <a id="m9"></a>**M9** | **Four files sit in `public/` referenced by nothing** — `/images/wb-merch/hunter-root.png` (1.7 MB, orphaned when F7b removed his banner), `/images/wb/vol1_cover_v0.png` (superseded; also a JPEG named `.png`), `/WeirdBaby_PhotoID_backup.png` (**truncated — a corrupt PNG at a public URL**), and **new this round** `/robots/reference/mgk-viii/parts_drawer.jpg` (317 KB, orphaned when N1 removed The Parts — a real photograph the museum owns, so Ops did not delete it and did not re-home it onto a wall whose tombstone counts its plates). Delete, or keep and say why. | v49/A5 · v50/N1 | OPEN | Mike | 2026-08-04 |
| **M10** | **`/foundation` Q7's narrowing.** The one edit E1 made to copy Mike had already approved. One string to revert if he wants the flat *No* back. | v43/E5 | OPEN | Mike | 2026-08-03 |
| **M11** | **The four unpublished invoice figures** — domain, robot supplies, manufacturing, the extras. The invoice is built to take them. | v43/E1 | OPEN | Mike | 2026-08-03 |
| **M12** | **`THE_CHARTER.md` is still DRAFT v0.3, "not published."** | v43/E5 | OPEN | Mike | 2026-08-03 |
| **M13** | **The Billionaire's Credo is unwritten.** Q10 carries a `[PAPA]` and the scrubber drops it. | v43/E5 | OPEN | Mike | 2026-08-03 |
| **M14** | **`--wb-gold-mute` and `--wb-gold-lo` are half a stop apart.** F0's finding; a palette call, and palette calls are Mike's. | v40/F0 · v43/E5 | OPEN | Mike | 2026-08-03 |
| **M15** | ~~`/robots` Welcome still says "three cartons".~~ **CLOSED BY DELETION, which is the only way Doctrine 12 allows.** The Welcome blurb now reads "a delivery of them arrived on a dock" — no count, and no substitute count, because nobody supplied one. | v47 exposure #9; closed N4 · v50 | DONE | Ops | 2026-08-04 |
| **M16** | **Two songs have almost no song-tier facts.** Jesse Welles' *"That Can't Be Right"* has **zero** (all three it had were our research narrative); *"There's A Hole"* has one, and the file's own note says one fact reads as a stuck scroller. Nothing was invented to fill either. | v46/C4 | OPEN | Mike | 2026-08-04 |
| **M17** | **The `/hr` journal is dead machinery.** The tab is unreachable and `submitEntry` writes to component state only — an entry would not survive a reload. Build it or retire it. | v46/C4 | OPEN | Mike | 2026-08-04 |
| **M18** | **Twenty-seven questions on Record 013**, one gap apiece, none blocking. Highest value is D1, *why wasn't it hacked*. | `docs/RECORD_013_QUESTIONS-20260804.md` · v47/H6 | OPEN | Mike | 2026-08-04 |
| **M19** | **What a record NUMBER means.** Are the numbers the full 436-record numbering, or a numbering of this volume? A volume where some entries have numbers and some do not is the visible symptom of the undecided question, and it is on the page. | v45/R5 #1 | OPEN | Mike | 2026-08-04 |
| **M20** | **The three Printful sticker variants still carry the old low-res master.** The in-shop image is fine; this is the print file. Blocks nothing. | STATE gift-shop pipeline | OPEN | Mike | 2026-06-23 |
| **M21** | **Thirty-six `[PAPA]` markers sit in content files awaiting his words** — robots 17, Worth A Listen 6, `/foundation` 7, `/booth` 6. Net +1 this round: DOC CONTROL added two (the manual's wording, and whether an original is ever published) and Contact's deleted REACH row took one away. All are scrubbed at the render seam, so none is visible; each is a sentence he has not written. | standing, `src/lib/visitor-prose.js` | OPEN | Mike | ongoing |
| <a id="m22"></a>**M22** | **43 shipped assets carry no verdict from Mike** (44 last round; `parts_drawer.jpg` left the shipped set with The Parts). `npm run assets:checklist -- --room <slug>` prints the inspection list for one room; `npm run assets:gate` fails while any presented asset is unpassed. | v49/A5+A6 | OPEN | Mike | 2026-08-04 |
| <a id="m23"></a>**M23** | **TWO PAIRS OF LIVE ALTERNATIVES ARE WAITING TO BE HALVED, and they are the only things in this register that get WORSE by sitting.** The booth's hook: `/booth` (a ticket made of paper — guilloche, perforation, punch hole, ADMIT ONE · NO CHARGE · ALWAYS) against `/booth?hook=sign` (an enamel INFORMATION plate). The lobby's guest book: `/` (the seven-row list you scroll yourself) against `/?book=scroll` (the same rows drifting on their own, pausing on hover). **The loser of each is DELETED the day you choose** — the lobby's retired `?subtitle=` is this house's own record of what happens when a shown-then-asked device outlives the asking. | Mike's N5 + N6 brief · v50 | OPEN | Mike | 2026-08-04 |
| <a id="m24"></a>**M24** | **"The Firmware" was renamed on BOTH faces that carried it**, not one — MGK-VIII's (a board, an envelope, four output chains) and MGK-VIIIp's artifact slot (two source trees). Leaving either would have kept the retired name on the glass, so both now read TECHNICAL SPECIFICATIONS and their subtitles do the telling-apart. If only one was meant, it is one string back. | v50/N1 | OPEN | Mike | 2026-08-04 |
| <a id="m25"></a>**M25** | **One wall contradicts itself about power, and it took the reveal-arc pass to see it.** The MGK-VIIIp Image Archive tombstone says its nine plates are *"As received — before cleaning, before power"*; one of those nine is captioned *"The front glass, lit"* and the Technical Specifications face calls the same file *"the firmware, running"*. A tenth, the cover plate, carries a composited BIOS beat and says so. Either the tombstone's claim is narrower than nine, or the lit plate is not "as received". | v50/N8 | OPEN | Mike | 2026-08-04 |
| <a id="m26"></a>**M26** | **The Foundation's name now differs between the board and the door** — the directory reads *Weird.Baby Foundation* (N1 dropped the article there) and the room's own title bar and heading still read *The Foundation* / *The Weird.Baby Foundation*. That is defensible (a board is a list, a door carries the full name) and it was NOT extended beyond the instruction, which named the directory. One word either way. | v50/N1 | OPEN | Mike | 2026-08-04 |
| <a id="m27"></a>**M27** | **The DONATED BY column is built and every cell is an absence, which is the true state and not a gap.** Three rows read *Nobody yet* (nothing has come in through a channel that is NOT BUILT), two read *Not a gift* (the shop and the music are earned, not given). **ANONYMOUS is declared, styled and documented and appears nowhere** — writing it into a cell to show the column works would have invented a contribution. The first real gift is one field. | Mike's N7 brief · v50 | OPEN | Mike | 2026-08-04 |
| <a id="m28"></a>**M28** | **The reveal arc is populated on 6 assets of 251 and unset on the rest, by instruction.** `arrived` on the four MGK-VIIIp plates the wall's own tombstone attests as received; `online` on the two that show the machine running. Every other row is `null`, which the table's legend states is UNSET and not a stage. Extending it is a judgement per asset, and the MGK-VIII set needs M25 answered first. | Mike's N8 ruling · v50 | OPEN | Mike + Ops | 2026-08-04 |

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
| **C16** | **The image archive's two siblings are defined and not built — and they now carry the plain names too:** VIDEO ARCHIVE and AUDIO ARCHIVE, the same component with different data (THE REEL / THE TAPE LIBRARY retired with THE MORGUE). Neither has content: every `videos:` array in the robots wing is empty and the wing has no audio. `/wb` has six tracks and no archive face, which is where an audio archive would land first. **Mike's N2 instruction was "build only what has content", so nothing was scaffolded.** | v49/A3 · v50/N2 | RULED-AWAITING-BUILD | Code | 2026-08-04 |
| **C29** | **The stowed shelf is built and only one wall in the museum has more than one spread.** MGK-VIII stacks MARCH 2021 (open, 5 plates) over FEBRUARY 2013 (stowed, 3 plates); the MGK-VIIIp wall is one unheaded spread and renders the DOM it always did. The mechanism is therefore exercised on exactly one surface, which is a container proved on one case again — the same shape as C1's pagination and C7's doors. | v50/N2 | OPEN | Code | 2026-08-04 |
| **C30** | **The archive's unit noun is declarable and only the robots wing declares it.** `face.archiveUnit` gives the stowed-shelf count its word; the default is "image(s)". A video or audio archive will want its own, and nothing yet forces the question. | v50/N2 | OPEN | Code | 2026-08-04 |
| **C31** | **DOC CONTROL announces no mechanism, and three of its four rows describe things a visitor cannot reach.** The manuals are unimaged, the originals are unpublished, the firmware trees are named but not readable from the glass. That is honest and it is also a page of holdings statements with no object behind any of them except the stamp card. If the reel ever fills (P2), this face is where the door belongs. | v50/N3 | OPEN | Code | 2026-08-04 |
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

## 5. CLOSED THIS ROUND (v50 THE OVERNIGHT, 2026-08-04)

| ID | What it was | How it closed |
|---|---|---|
| **N1** | **The renames and the removals.** | **DONE** — THE MORGUE struck for **IMAGE ARCHIVE** on both walls (closes M6); **The Firmware → TECHNICAL SPECIFICATIONS** on both faces that carried the name (see M24); **The Parts REMOVED** whole, which orphaned a photograph (see M9) and took three observations off the wing, named in the round log rather than dropped quietly; the directory's one article dropped (**Weird.Baby Foundation**, see M26) and the **Information Booth moved to the bottom of the board** with the exhibit order under it unchanged. |
| **N2** | **The image archive's structure and its siblings.** | **DONE** — A4 built "latest spread at top" and printed every spread at full height; this round built the other half of Mike's sentence. **The newest spread is open paper and everything older is stowed** in a native `<details>` whose closed line carries its own date AND its own count (`FEBRUARY 2013 · 3 plates`), so nothing is discovered by opening it that was not already stated by it — which is the test the NO-HIDDEN-INFORMATION law actually applies. Measured: closed **21px**, open **258px**. First spread and unheaded walls are never stowed, so the VIIIp wall is byte-identical. Siblings named VIDEO ARCHIVE / AUDIO ARCHIVE and **not scaffolded** (C16). |
| **N3** | **DOC CONTROL, and the manual's story out loud.** | **DONE** — a fourth front-desk face: manuals, originals, files, with Mike's canon printed as its own entry (came in pieces, presumably to avoid detection; no complete contents, no index, not every page, therefore not every answer; assembled from preliminary, final, marked-up and one stamped APPROVED). Its hook is a **rubber-stamp card made only of words already on the face**. Nothing on it describes this repository — the incompleteness is stated as a fact about the OBJECT, which is what makes it shippable and, per Mike, the cover. |
| **N4** | **Welcome and Contact, burned down.** | **DONE** — Welcome's proposed reason to exist is **ORIENTATION**, the job nothing was doing: its register block stops being a business card and becomes a contents list of the wing, and a new WHERE TO START row says which door is which. The invented count came out (closes M15). Contact is **the address and three things worth writing about**, one line each: the ranking, the persuasion and the four-line argument for its own slowness are gone, and the card that said ONE / ADDRESS / READ BY ONE PERSON without containing the address now contains the address. |
| **N5** | **The booth's ticket — both directions.** | **DONE, awaiting M23** — the "no ticket required" contradiction is gone and both candidates are LIVE for Mike to compare on the glass: a ticket **made of paper** (guilloche security tint, diagonal hatch, real perforation with torn notches, a punched hole lit from above, ticket stock rather than the ramp's ink) at `/booth`, and an **enamel INFORMATION plate** (keyline inset from the edge, four bolt heads) at `/booth?hook=sign`. Neither adds a claim. |
| **N5b** | **"Are you tracking me?", written against the code.** | **DONE, and it found the old answer wrong.** The previous answer said the visits row was *"the whole of it"* — and `index.html` ships a Google Fonts `<link>` plus two preconnects, so every visitor's browser calls Google before the page paints. That third party is now the loudest clause in the answer. Every other clause is falsifiable from one file: no auth anywhere in `worker.js`, no `Set-Cookie` and no `document.cookie` in the tree, three columns in the visits row, exactly-what-you-typed in the guest book, sessionStorage/localStorage never transmitted. The claim is deliberately scoped to *what this site records*. |
| **N6** | **The scrolling guest book.** | **DONE, awaiting M23** — the obvious reading was already built (`.wb-entries` has been a scrollable seven-row window since the book was made), so the variant is the book scrolling ITSELF. Two copies, a 50% travel, **measured seamless: travel at cycle end 270px against a 270px half**. Pauses on hover and focus-within; `prefers-reduced-motion` falls back to the static list rather than to a slower one; below five signatures it renders the static list because there is nothing to scroll past. |
| **N7** | **The Foundation's DONATED BY column.** | **DONE** — four declared values because a donor column whose empty cells all print one dash cannot tell "nobody has given yet" from "this was never a gift". ANONYMOUS is first-class and **appears nowhere**, which is M27 and is the point rather than the gap. |
| **N8** | **The reveal arc.** | **DONE** — `revealArc` (arrived / understood / partial / online / unset) is the asset table's **fifth judged field**, carried by a scan and never written by one, with its own legend. Populated on 6 rows the wing's own tombstones and captions attest; 245 left unset by instruction (M28). |
| **—** | **The asset table counted a path named in a COMMENT as a reference**, so any orphan was invisible for as long as anybody had written its name down. | **DONE** — caught by committing it: N1 removed The Parts and wrote a comment naming the newly-orphaned file, and the next scan reported that file as still shipped, cited by the very file that had stopped using it. `usedBy` now matches against source with comments stripped by a character scanner that keeps string literals (a regex cannot: `//` and `/*` both live inside strings all over this tree). Shipped 44 → 43; unreferenced 3 → 4. |
| **—** | **`--scan` could never add a new header key**, because it spread the file's own header over the tool's. | **DONE** — `HEADER` now wins for its own keys, so the legend is documentation with a source instead of a hand-edited field in a generated artifact. |
| **—** | **The enamel sign's subtitle was a verbatim echo of the credo 120px below it.** | **DONE** — found by looking at the built page, not the source. It now names the museum, which is the ticket's own kicker and does not repeat the line under it. |

---

## 5b. CLOSED IN v49 (2026-08-04)

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
