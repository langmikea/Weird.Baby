# THE BACKLOG — ranked

Mike's ranking of 2026-08-16, reconciled against the register. **This page is
the order; [OPEN ACTIONS](OPEN_ACTIONS.md) is still the full record.** Where an
item has a row, it links to it. Where it does not, it says **no row** — and that
is not an oversight to fix by opening one: several of these are work with an
owner and no question attached, which is exactly what a register row is not for.

---

## NOW — a Record needs it

| # | what | where |
|---|---|---|
| 0 | **THE PORTAL FAQ CARRIES A KNOWN FALSE LINE, AND IT IS MIKE'S TO REWRITE.** The answer to *Is the mainframe on the Portal?* reads *"Not yet. Two channels are engraved for it on the feed drum and neither of them carries it."* **There is no feed drum.** The 2026-08-21 rebuild replaced it with the FEED bank readout and the two `MGK-NIAC` engravings went with the barrel. He amended this same clause earlier the same day (`arms` → `carries`) and the rebuild made it false again hours later. **He ruled 2026-08-22: the engravings do NOT come back, and the sentence is his to rewrite later.** It shipped public with the Portal, knowingly. **A later round must not quietly rewrite it — it is his voice, and a paraphrase in his class is indistinguishable from his words a week later.** | no row · the ledger says so on `portal.feed.niac.1` and `.2` |

## NEXT AFTER A REPAIR — the writing surface moves

| # | what | where |
|---|---|---|
| A | ~~**[MIKE, 2026-08-25 — RULING A] THE DAY EDITOR BECOMES WHERE HE WRITES, AND EXCEL STOPS BEING THE SURFACE.**~~ **BUILT 2026-08-26.** `docs/dictation-20260807/day.html` takes keystrokes: edit any line, add a section on demand, insert a row, delete a row — his four asks, in the section recipe he specified. Save POSTs to a loopback endpoint that writes **his words** (`record-draft.json`) and **his marks** (`readiness.json`) in one request; **it never writes the Record**, which stays `npm run record:land -- --write` and is Mike's. `npm run day:serve` is the server — **`npm run mock` cannot accept a save and the page says so.** `npm run record:workbook` is the rescue path, unchanged. **Proved by `npm run day:proof`**, which shows each property LOSING something first. **What is still open is [C-day2](OPEN_ACTIONS_CLOSED.md), closed 2026-08-26:** four of the five entries cannot be landed because guard 6 protects their standing reasoning. | [C-day2](OPEN_ACTIONS_CLOSED.md), closed 2026-08-26 |

## TUESDAY — committed

| # | what | where |
|---|---|---|
| 1 | **The scroller-facts review.** 98 quotes at or over fifteen words, 23 artist-page/source pairs quoted more than once. **The real question is volume rather than any single line:** Hunter Root's page alone carries 67 quotes from ten publications. The list is on this desk. | [Q-a](OPEN_ACTIONS.md#q-a) |
| 2 | **The Short Story and The Long Story.** **Two empty rooms a visitor can walk into** — the FAQ already sends them to both. | [S-f](OPEN_ACTIONS.md#s-f) |

## NEXT — the bottleneck

| # | what | where |
|---|---|---|
| 3 | **Social: accounts, handles, three schedules, content.** Robots **3×/week**, Music **fortnightly**, the house **silent**. **Everything else on this page improves a museum nobody has found.** | [M60](OPEN_ACTIONS.md#m60) |

## THEN — in this order

| # | what | where |
|---|---|---|
| 4 | The shop | [M13](OPEN_ACTIONS.md#m13) · [M21](OPEN_ACTIONS.md#m21) · [S-n](OPEN_ACTIONS.md#s-n) |
| 5 | The media intake pipeline | no row |
| 6 | Ops Desk prune **+ the WYSIWYG REC editor** | no row |
| 7 | The light table — clutter out, no audio, collapsible manual, thumbnails too faint to read the form | [Q-e](OPEN_ACTIONS.md#q-e) |
| 8 | Coalition's reply | [S-g](OPEN_ACTIONS.md#s-g) |
| 9 | **The manual, built from the program itself** — screenshots and composites. ***"You can make SO MUCH of this!!!"*** **FLAGGED: the most fun item on this page, which is why it will eat a week.** | [Q-d](OPEN_ACTIONS.md#q-d) |

## PARKED — no date

| what | where |
|---|---|
| The PiP scroller | no row |
| Film A and Film B | no row |
| The egg audit **+ the quality box** | [M32](OPEN_ACTIONS.md#m32) · [C40](OPEN_ACTIONS.md#c40) |
| Gmail | no row |
| **The Portal switch puzzle** — Mike **and** Ops, together. M33 and the FEED ch-4 contradiction are folded into it. | [PZ-a](OPEN_ACTIONS.md#pz-a) |

## IN PASSING — one word each, whenever

| what | where |
|---|---|
| `mailto:` on `Papa@Weird.Baby` | no row |
| ~~`Born \| Born July 3, 1963` repeats its label~~ — **cut 2026-08-17 on an Ops ruling; it reads `July 3, 1963` now. One word to put it back.** | [Q-c](OPEN_ACTIONS.md#q-c) |
| **Macungie PA** on the name line — measured, costs no extra line at 1280px or 390px. Mike's call. | [Q-c](OPEN_ACTIONS.md#q-c) |
| Phone wrapping at 390px — **permitted by desktop-leads**, so this is a preference and not a fault | [S-j](OPEN_ACTIONS.md#s-j) |
| The `Back in 94'` tee and the Hat | [S-n](OPEN_ACTIONS.md#s-n) |
| Twelve Hunter Root releases with no years and no links | [S-p](OPEN_ACTIONS.md#s-p) |
| The Coalition gift-shop tile has no picture | [S-g](OPEN_ACTIONS.md#s-g) |
| 13 orphan asset rows — 8 judged, 5 unjudged | [M9](OPEN_ACTIONS.md#m9) |
| **The /wb achievement photographs do not open.** Four object photographs sit static on the About the Artist card; they should open full size the way a Record attachment does. **The reader already exists and is deliberately NOT shared:** it lives in `RobotsExhibitFlow.jsx`, whose own note says *"the engine dispatches a door and knows nothing about what opens"* — and /wal declares the same collage and gets different behaviour on purpose. Reuse means **hoisting a component with reel paging, zoom and worked-out Escape ordering into the shared engine**; building a second reader is refused. **About a round**, and it touches every wing that draws a plate. | no row |


---

## DEFERRED WITH A TRIGGER — not killed

**SEO — revisit at roughly 30 Records.** [Q-f](OPEN_ACTIONS.md#q-f)

The ruling splits it, and the split is the point. **The robots fiction will not
rank and chasing it is wasted** — nobody searches for a machine that does not
exist. **But *"Papa Weird.Baby"*, *"Weird.Baby Foundation"* and the album should
own their own names**, so a person who HEARS the name and types it lands here.
That half is cheap and permanent. **Ops dismissed the whole of SEO and was too
broad.**

## CLOSED IN THIS PASS

Seven items: the approve tool · the deploy card · the nine-variant short ·
**M33** and the FEED ch-4 contradiction (folded into PZ-a) · **S-i** (already
closed — confirmed, not re-closed) · **S-l** · any surviving 314-rule remnants
(searched: none).

**The reasons are written up once, in `docs/OPEN_ACTIONS_CLOSED.md`, and that
file is deliberately NOT linked from here and NOT on the desk** — Doctrine 24:
the test is not whether a dead thing is archived, it is whether you meet it
again. It is there for a future round, not for you.

**Four of the seven had no row in the register at all**, and are recorded there
anyway — an item with no row is the one a later round re-raises as if it were
new.

---

## THE QUEUE — filed 2026-08-21

**FIFTEEN ITEMS OPS WAS CARRYING IN CONVERSATION, WHICH IS THE LEAK MIKE TOLD
OPS TO CLOSE.** A queue held in a chat exists until the chat closes. Everything
below is here with what is known about it, so the next round reads it instead of
being told it.

**THIS SECTION IS NOT RANKED AGAINST MIKE'S 08-16 ORDER ABOVE.** It is the
carried queue, listed; where he has ruled an item's urgency the ruling is on the
row.

---

### 1 · THE LIVE-SITE CLEAN-UP — one pass, many small things

**Mike's own list from walking the live site.** It is one item because it is one
pass, and it is first because every part of it is visible to a visitor today.

| where | what |
|---|---|
| **/robots · Record 003** | the two attachment titles |
| **the Lobby** | the directory at 2x |
| **the guest book** | the line, and a **3s** cycle |
| **AFFILIATION** | the answer has lost its third sentence |
| **/foundation** | the blank **Short Story**; the retitled foundation question; the four-line *giving away* answer; the three-paragraph *what happens when you stop*; the centred foot's line spacing |
| **sitewide** | the title bar's left and right, sized between too-small and the centre |
| **/wb · About the Artist** | **Mike's full rewrite, all five tiles** |

**The About the Artist rewrite is his text and has not been supplied yet.**
Everything else on this row is a fix, not a decision.

### 2 · THE ARTIST — the album, an Influences track, and the cover

- **rename the album** from *About the Artist*
- **add an Influences track**
- **regenerate `public/images/wb/about-cover.png`** — and **only** that file:

```
npm run covers:house -- --only about-cover.png
```

**MIKE HAS RULED THE COVER IN AS SOON AS FEASIBLE.** The generator exists and is
the same one the four wing covers came off; the 2026-08-10 ruling that retired it
for those four paths does not reach a new cover it is asked to make.

> **[2026-08-26] THIS BULLET USED TO READ "regenerate the cover from
> `tools/make_house_covers.py`", AND IT AIMED AT A LOOP THAT WRITES SIX FILES.**
> One of the six is `public/images/wb/vol1-cover.png`, which has held **Mike's
> own vinyl master** since 2026-08-12 — so a round that did exactly what this
> row said, with his own *as soon as feasible* on it, would have destroyed his
> art while reporting six successful writes. **The row now names its target and
> carries the command that hits only that target.**
>
> **`--only` did not exist when this bullet was written, which is half of why
> the bullet was shaped that way** — there was no way to regenerate one cover.
> It exists now. A bare `npm run covers:house` **refuses and writes nothing**
> (`tools/cover_fences.py`), so the failure mode this row had is closed from
> both ends: the row names the file, and the tool would not have obeyed the old
> row anyway.
>
> **The rename is the harder half and it is not the cover.** The album's name
> lives in `src/data/artists/weird-baby.js`; the cover only carries whatever
> that name becomes, so the render is the LAST step of this item, not the
> first. And its strapline is `WEIRD.BABY MUSIC` — **a string that exists
> nowhere else in the museum**, authored only inside a picture — so a
> regeneration is also the moment that string could quietly take or refuse the
> backslash. **Mike ruled that string PROVISIONALLY on 2026-08-26: it stays as
> it is** — *"For now at least. I will not know until I start looking at the
> entire site."* The register row is [A-c](OPEN_ACTIONS.md#a-c), and it is open.
> A round that regenerates this cover before he has walked the site must carry
> `WEIRD.BABY MUSIC` unchanged and must not read his provisional word as a
> settled one.

**Pairs with item 15** — his own concert photographs are what the Influences
track is for.

### 3 · `ANT` / `CAB` IN THE MANUAL — Appendix G, two rows

**RULED BY MIKE 2026-08-21, INCLUDING WHICH IS WHICH: `ANT` IS TELEVISION — the
aerial pulls it out of the air — and `CAB` IS HARDWIRED AND CARRIES THE MGK
UNITS.** Ops had inferred the opposite; the canon entry is corrected
([06-PORTAL §9.3](canon/06-PORTAL.md#ant-cab)).

**Two rows in Appendix G, expanded and nothing more.** The appendix already
carries 21 rows, two of which do not expand at all, so a row that says the words
and stops is that appendix behaving normally — which is what an egg wants.
**Section IV is refused**: its job is to explain what a control does.

**COST:** `tools/manual_structure_build.py` in the robots repo, a re-render, and
a check against the published page count (**63**). It belongs to the round that
next writes the manual. Pointer waiting at
[07-MANUAL §5b](canon/07-MANUAL.md#ant-cab-pending).

### 4 · AN "UP TO" TRACK FOR /wb

Three lines, his:

```
Debuted Weird.Baby /Music
Started Weird.Baby /Foundation
Launched Weird.Baby /Robots
```

### 5 · `TERMINAL.EXE` AND `PORTAL_2v16.CFG` AS RECORD 004 ATTACHMENTS

Both open the Portal, as if arriving through the album. **Scoped and not built.**
`RecordEntry` already has `section.doors[]` with `kind:"tv"`, which dispatches
the Portal with a preset and refuses honestly via `door.held`. What is missing:
a `door` field on a `docs` row (one branch), and a destination for the **album**
rather than the twin. **Recommended: `/robots?panel=<bankId>`** over writing the
panel's `sessionStorage` from the Record — a Record writing another surface's
store is the two-answers hazard.

**Both must open the same thing.** Giving them different destinations would
invent a difference the museum cannot produce.

### 6 · TEST BENCH — the six-digit base-4 code

**4⁶ = 4096** — a code to be **given**, not guessed, and the number only holds if
the museum gives nothing away: no counter, no partial match, no *wrong code*.

**The keypad exists.** The twin's own screen already carries `1 2 3 4 X` inside
the picture (`#monlayout .chy`, measured). Entry is not a mode — pressing 1–4 in
sequence is what changing channel already looks like.

**Refusal is silent:** TEST BENCH arms and opens the ordinary portal until the
sequence is right. That is deliberately the opposite of the panel's
never-decline-silently rule, and the difference is that the rule governs
**controls**; this is an **egg**.

**MIKE HAS RULED THE SEQUENCING CONSTRAINT:** *"They are meant to require a code.
I do not want to give them both at the same time."* The lock and the key arrive
apart. **Which comes first is Ops' to sequence; what it opens is not invented.**

### 7 · THE PANEL REBUILD — held mid-flight

The mock is at `docs/panel-rebuild-20260821/panel.html`, served by
`npm run mock`. Three passes done; **nothing is in `src/`.**

**THE STEPPER DEFECT IS DIAGNOSED AND FIXED (2026-08-21).** It was never the
handler. **It steps** — measured: PATCHED → COLD START → FIRST RUN → LAST STATE,
both handlers bound, the up arrow going back. **What did not change is the only
thing the eye was on:** every bank in the volume is `NIAC/VIIIp`, so the big lit
top line was identical in all five states and the only thing moving was an 11px
dim sub-line. A readout whose prominent half never changes reports nothing.
**The state line is lit now** — same colour, one size down instead of three.
That was the unpaid half of fixing the readout overflow: splitting
`NIAC/VIIIp · TEST BENCH` onto two lines stopped the clipping; leaving the
second line a whisper is what made the split look broken.

Also carried: the museum's `--engrave` token is under AA on this chassis, so the
rebuilt panel wants its own ramp.

### 8 · THE THREE WRONG BANK-STATE RECIPE IDS

Measured against the twin's live recipe table:

| bank state | wants | points at today | what that does |
|---|---|---|---|
| COLD START | `{power:"on", level:0}` | `boot-playback` | a Sandbox replay of an **established** machine |
| FIRST RUN | `{power:"on", level:1}` | `off-first-boot` | `power:"off"` — **it never boots** |
| LAST STATE | `{power:"on", level:2}` | `last-state` | **not a recipe at all** — opens plain |

**There is no `level: 1` recipe** (measured: the filter returns empty), and the
real cold start already exists unexposed as `clean-boot` — **verified by loading
it: the boot plays.** The fix is three repointings and one new row in
`twin.html`. **None of the three may carry `resume`**, or a second latch in the
same session lands on a static menu.

**Mike's levels are 0-indexed in the recipe:** his Level 1 / 2 / 3 are
`level: 0 / 1 / 2`.

### 9 · THE ARC — `docs/ARC.md`

Twelve week headlines plus W01–W04 in outline. **Weeks 6, 7 and 8 have no
headline**, and hardware going on hold means week 2 onward is stale. Mike
defines the arc and writes into it.

### 10 · THE CANON GATE

A gate that fails when a contested or Ops-register term reaches a visitor-facing
string. **Ruled in, not started.**

### 11 · A THUMBS UP / DOWN ON THE INFO BOOTH

**Mike's framing: "the call to action is Decide."**

### 12 · THE BLOG — low priority

Mike's own ranking.

### 13 · THE LONG STORY

The room exists and is empty; the FAQ already sends visitors to it.
**Pairs with the Foundation's blank Short Story in item 1.**

### 14 · TOP BILLING FOR WEIRD.BABY SOLO WHEN LEAVING MIKE'S SITES

As /wal artists already get.

### 15 · MIKE'S OWN CONCERT PHOTOGRAPHS

For the Influences track. **His images; not supplied yet.** Pairs with item 2.

---

## WHAT THIS PAGE IS NOT

**It is not the register.** `OPEN_ACTIONS.md` carries **181 rows**, of which
**172 are OPEN and 136 are owned by Mike** — most of them one-word rulings,
records and notes rather than work with a date. **This page ranks the WORK.** A
row that is not named here has not been closed, dropped or demoted; it is
waiting in the register, where it has always been.

Rebuild this page with `npm run desk`.
