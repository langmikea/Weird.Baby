# MUSEUM v40 — THE FOUNDATION ROUND

**2026-08-03 · autonomous single-agent Code-lane round on Mike's remote-control
brief · F0–F4 · PUSH + DEPLOY ARE MIKE'S**

Frames: `docs/foundation-round-20260803/`
Audit deliverable: `docs/VISUAL_HOOK_AUDIT-20260803.md`

Gates: **lint 11 err / 9 warn** (= HEAD baseline, zero new) · `vite build` green ·
desktop **1706×900** + genuine **390×740** same-origin iframe lap · every claim
below re-verified against the LIVE BUILT bundle (`vite build` → `wrangler dev`),
never against source.

---

## F0 — THE PALETTE, WHICH MIKE PUT IN SCOPE THIS ROUND

V1 carried this forward by name and asked for exactly this direction. It was
given, and the finding was worse than the carry-forward said.

**`--wb-gold-mute` failed AA on every paper ground the museum has**, not just
one:

```
#9b978d on  --wb-bg #d9d5ca ..... 1.99:1   --wb-ink-card ... 2.75:1
            --wb-ink-soft ....... 2.17:1   --wb-ink-card-hi  2.91:1
            --wb-ink ............ 2.40:1
```

And it is not decoration: it paints the lobby's DIRECTORY label, the guest
book's dates, the tracklist's numbers and variant dropdown, the booth's small
print, the Deep Dive deck's register. The museum's small mono — the type a
visitor squints at hardest.

**Re-pinned to `#5f5c53` — 4.56 → 6.68:1 across the five grounds.** It is the
QUIETEST value that clears AA, and that is a measurement rather than a taste.

**The finding under the finding:** `#5f5c53` lands within half a stop of
`--wb-gold-lo` (5.15:1), which looks like the ramp collapsing and is really a
fact about the ground. **On a mat board this light, the whole band that is both
quieter than `lo` and still legible is about half a stop wide.** There is no
legible mute two stops down because the paper does not leave room for one.
Naming that is better than picking a number that pretends otherwise.

**NOT V1's `#6a6659`.** That value was measured against the CARD ground
(5.41:1 there) and is **3.92:1 on the mat** — under AA exactly where this token
is used most. Same defect, one ground over.

### F0b — `--wb-hairline`, because the token was doing two jobs

M0a chose `#9b978d` for the drag handles' 1px lines **deliberately**, and wrote
down why: "the grip is the thing that reads, not the line", grip at 5.15:1 and
line an order of magnitude quieter. Darkening the TEXT token to 4.56:1 would
have pulled the line to within half a stop of its own grip and silently
reversed a measured decision from a round that is not this one.

A hairline is not text and does not owe 4.5:1. It gets its own name and the old
value, byte-for-byte. `.cf-dh-line`, `.bd-dh-line`, `.vr-dh-line` now read it;
**not one hairline pixel moved.** `--wb-paper-hairline` joins the escape ramp
for the same reason every other alias is there.

`src/styles/tokens.js` re-synced in the same edit — that file is the CSS's PAIR,
not its derivative, and a mirror that lags is worse than no mirror.

### F0c — the walker found four more, and F2 had just promoted one of them

A text-node contrast walker was run over every room and every face on the built
page. It found, and this round fixed:

| Where | Was | Now | Note |
|---|---|---|---|
| `.wb-dir-entry` ×6 + arrows | `#6f6b62` **4.37:1** | token, **5.50:1** | the DIRECTORY, on the front door |
| `.wb-footer` "weird.baby" | `#b0aca1` **1.55:1** | token, **4.56:1** | the worst number on the site, and it is the museum's own name |
| `.wb-mark` "WB" | `--wb-border-hi` **1.68:1** at 6.7px | token | the roundel's 1px RING is deliberately unchanged — furniture, same call as the hairline |
| `.vp-bill-what` ×4 | the acts' hues, **1.55–1.91:1** | `--wb-gold-lo`, **7.12:1** | see below |
| `.vp-face-sub` | `#8a857a` **3.46:1** | token | V1's carry-forward, closed |

**`.vp-bill-what` is the one that matters, and F2 is why.** The four `hue`
values are POSTER colours — a pink, a green, an amber, a sand. As 12.2px
uppercase mono on print stock they measure 1.55–1.91:1. Until this round they
sat on the wing's SECOND page; **F2 moved the bill to position one, so a
reordering turned an old blemish into a landing defect.** The accent keeps both
its graphic jobs (the panel's 3px foot rule, the hover border) and loses the one
it was never good at. Not a palette change: the data declares `hue` as "a DESIGN
choice … not a fact about anybody", and none of the four values moved.

**`.vp-face-sub` closed at the BASE, not by reach.** V1 fixed it inside the WAL
card only and named the reason it stopped: two of those rules also serve the
PORTAL, ground `#0b0b0a`, "where a darkened grey would be the same defect
inverted". Confirmed still 3.46:1 on /robots this round. The literal was a
**dark-ground value sitting in a ground-agnostic rule** — so the base rule now
names the ROLE (`--wb-gold-mute`), which every dark scope already re-pins for
itself, and the portal keeps `#8a857a` in one explicit selector. Verified by
probe: portal-scoped `.vp-face-sub` computes `rgb(138,133,122)` exactly.

**Re-audit: ZERO failures** on `/`, `/booth`, `/foundation`, `/shop`, all five
WAL albums × every face, both robots albums × every face, desktop and 390px.

*(Tool honesty: the walker flags `.cf-year` at 1.42:1 on `/hr` and `/wb`. It is
a FALSE POSITIVE — the walker cannot see `.cf-overlay`'s gradient or the double
text-shadow W6 QA added for exactly this. Verified in the CSS, not a
regression.)*

---

## F1 — THE VISUAL HOOK LAW

Recorded in STATE.md as standing doctrine. Full audit of every face and page:
`docs/VISUAL_HOOK_AUDIT-20260803.md`.

**Seven surfaces gained a hook and NOT ONE NEW ASSET WAS SOURCED** — every
picture used was already in the build, so no rights question was opened.

- **`/booth` — THE TICKET.** The purest failure of the law in the building: a
  thousand words and nothing to look at, in the room Mike calls AWESOME. So the
  hook is made of the page's own sentence — "No tickets, no tiers, no ads" is
  printed six lines below it, and the museum's one unbreakable rule is free
  admission, so **the object at the top of the page is an admission ticket that
  says there is nothing to admit.** Inverted ink ground (the one value inversion
  on the sheet), torn stub with notches painted in the card's own colour,
  1.1° tilt that stands down at 680px on a measured reason (a rotated box is
  wider than its box; 4px each side buys a scrollbar to pay for a charm nobody
  can see at that size). `aria-hidden` — the prose says all of it in sentences.
- **`About the Artist` ×2, WHICH MIKE NAMED SPECIFICALLY.** Two of four artists
  declared a `plate` and two did not. Mikey Mike gets the file the provenance
  log already describes as "his own chosen public face" — an actual portrait.
  Hunter Root gets the ’94 sleeve from our own catalogue, and **that one is a
  named trade**: same picture as his coverflow cover, weaker than a portrait,
  much stronger than four paragraphs, one string when a portrait exists.
- **`About the Songs` ×4 — the wing's worst offender.** A full page of
  interpretive labels with no image anywhere, sitting one row below a tracklist
  of songs that all HAVE a picture. The picture was never missing; it was never
  asked for. New optional `entries[].img` renders as `.vp-fe-plate` — a PRINT
  (hairline, real shadow, no rounding), not a thumbnail. **Optional, so nothing
  else moved**: every entry list in the building that declares no `img` renders
  byte-identical markup.
- **`/robots` Welcome — the machine wing's front door.** The wing whose whole
  subject is a physical object was introducing itself in prose, with the object
  one track away. The family shot is the only photograph in the reference set
  showing the machines as a GROUP, and "three cartons of them arrived on a
  dock" is the lead sentence — that sentence, as a picture.
- **`The deal`** takes the house's own printed card as its head plate — words in
  a different format, which the law explicitly allows.

**Five surfaces remain text-only, all in the robots wing, none of them a
landing, all ART-pending rather than code-pending.** Ranked in the audit. The
strongest is **The Record**: it is an evidence log, `evidence:` is already a
field on every entry, and `.vp-fe-plate` — built this round — already renders a
picture per entry. It needs photographs, not code.

---

## F2 — TRACK ORDER + NAMING

**THE BILL GOES FIRST.** `defaultActiveIndex: 0` lands on the house album and
opens its first track, so whatever sits there is the museum's answer to a
stranger off the street. It was ~280 words of house prose — the visual hook
law's exact failure case. The bill is the opposite of that **and it already
existed**: four artists, four covers, in the artists' own colour, each a door.
Reordering is the whole fix; nothing new is drawn.

And the order still reads as an argument: page one is WHO IS HERE, page two is
THE DEAL. A stranger meets the acts and then reads the terms — the order a
poster and a ticket come in, and the reverse of the order a museum's instinct
puts them in.

### "Welcome" is killed. The name is **"The deal"**.

**Mike's complaint is right and R5a's own argument predicts it.** R5a picked
"Welcome" for being *addressed to* the visitor rather than a heading on a
definition — the right axis, the wrong end of it. A greeting is addressed to you
and tells you nothing. It was the one row in the list whose title a skimmer
could read and still not know whether to press; every other row here says what
is behind it.

**Why "The deal" earns the row:**

1. **It is Mike's own phrase, already published in this building.** The
   Information Booth answers "Who keeps this place?" with *"That's the deal, and
   it never changes."* Banked in `BACKLOG.md`'s booth intake, 2026-07-06, and
   live at `/booth`. Carried across, not invented.
2. **The page IS an arrangement and nothing else** — free, every door leads out,
   nothing to sign up for, we keep a page name and a timestamp. "The deal" is
   what that page is, in two words.
3. **It is the exact opposite of ceremony.** A deal is terms, plainly stated.
   The complaint is answered rather than re-dressed.
4. **The joke lands the right way round:** the deal is that there is no deal.

**Not marked `[PAPA]`** — the words are already his and already published, and a
marker would hide the row's name from every visitor until he ruled on a phrase
he wrote. It is one string in one place if he wants another.

---

## F3 — THE WEIRD.BABY FOUNDATION

New route `/foundation`, new directory entry, **12 questions**, built on the
Information Booth's template because Mike named it as the proven pattern.

**THE TEMPLATE IS USED LITERALLY.** `Foundation.jsx` imports `InfoBooth.css` and
wears its class names for the sheet, credo, rule, questions, contact and way
back. The strongest form of "use the booth as the template" is to use the same
RULES — a second stylesheet in `fnd-` prefixes would be identical the day it was
written and would have drifted by the next round, which is the fork R2 found in
the title bar (three copies of one bar) and B7 found in the palette.
`Foundation.css` holds only what is new: the room's ground, and the ledger.

**NOTHING HERE IS NEW DOCTRINE.** Four sources, all in the tree, all read this
session, all cited in the file header:

- `docs/canonical/THE_CHARTER.md` — What Weird.Baby Is; The Purpose; the six
  clauses of The Law; The Coffers; The Beneficiaries; Succession; Dissolution;
  the Illionaires line.
- `docs/canonical/CHARTER_RAW_LEDS-20260707.md` — sponsors, the FULL METER,
  "help arrives as the THING", the WeeBee door verbatim.
- `../weird-baby-robots/STATE.md` §R3 (2026-08-02) — the business-model doctrine
  ("unmistakable up front, no digging"; "no part of W.B materially benefits"),
  the two drafted money answers, the Billionaire's Credo.
- `src/routes/InfoBooth.jsx` — so the two rooms cannot contradict each other.

**THE ONE THING THE ARCHIVE DOES NOT SAY IS THE ROOM'S NAME, AND THE PAGE SAYS
SO FIRST.** The charter never uses the word "foundation" and it refuses what the
word normally means: a foundation has an endowment, and clause 4 of the Law is
that money never stops here. A visitor reading "Foundation" in a museum
directory will arrive expecting a fund. **That tension is the first answer on
the page** — saying "there is no fund" in the room called the Foundation is the
strongest version of the doctrine this house has, and burying it would be
exactly the "digging" the R3 doctrine forbids. The name is Mike's and stands.

**`[PAPA]` MARKS A POSITION, NEVER A FACT.** `THE_CHARTER.md` reads *"DRAFT v0.3
— awaiting Papa's full review. Not published."* So the page is built to the
marker discipline rather than to a publication decision: six answers carry a
marked sentence and the scrubber drops it at the render seam. **Verified live:
zero `[PAPA]` on the page, zero bracketed leaks of any kind, and every scrubbed
answer ends on a whole sentence.** What survives is settled Law plus what this
museum already publishes at `/booth`.

Marked, and therefore not printed: whether Weird.Baby is ever incorporated; the
named beneficiary organisations; the live costs, numbers and sponsors; what the
shop's own shelf earns; **and the Billionaire's Credo** — which the 2026-08-02
launch-readiness pass explicitly flagged as "the most charming thing in the
doctrine and the easiest to misread as a boast in cold text … it wants Mike's
voice, or absence." It is left as absence, exactly as that pass recommended.

**The hook is the number.** The charter's proof is structural — *"there is no
account to fill. There has never been one. There never will be."* — and a
structural proof rendered as a paragraph is a claim, while the same proof
rendered as a LEDGER with a zero on it is an object a visitor reads in one
second and remembers on the way out. `$0.00 / held, ever`, over OWNED / KEPT BY
THE KEEPER / PASSED ON. **Every figure is a clause of the Law, not a statistic**,
so nothing on it can go out of date — which is why it is a ledger and not a
dashboard.

**Directory placement.** Beside the Information Booth, not with the exhibits.
M8 fixed that board by making the names say what kind of thing each entry is and
the ORDER say the same — ours, ours, theirs, then the desk. The Foundation is
not an exhibit; it cannot join the first three without breaking M8's reading.
Booth first, because a stranger asks *what* before they ask *why*. The shop
keeps the end of the board.

---

## F4 — THE CAROUSEL EDGE

**Mike was describing a `return null`, not a layout problem.** The render culled
`Math.abs(off) > 3` and the WAL spine is FIVE albums; the wing lands at
`active=0`, which puts Mikey Mike at `off=4`. He was not faint at the edge and
not cut in half — **he was not in the document.** Every wing whose spine passes
five albums has the same hole at both ends.

**And the fourth ring was a dead end by construction.** The old ramp's tail was
a bare `return` for every offset past 2, so `off=3`, `4` and `5` shared one
slot — raising the cull alone would have stacked three covers on one spot. The
cull was covering for the ramp.

**The ramp now runs six deep and closes up as it goes.** x-deltas were
240 / 210 / 170 and continue 120 / 85 — a settling series, so the far covers
deck up against the edge the way a rack of records does instead of marching off
the page.

**MEASURED ON THE BUILT PAGE, AT THE SIZE THE ROOM ACTUALLY OPENS AT** — F3's
`fitOnEntry` computes the carousel height on arrival and overrides the persisted
one, so the honest number is the fit's, not the stored default. In a true
**1706×900** viewport the fit sets `cfH=160`, and at full-left scroll the five
covers land at **64 / 166 / 254 / 319 / 363 px from centre against 839px of
half-width**. The fifth album — the one Mike could not see — is **FULLY ON
SCREEN with room to spare**. That is his *"better if repositioning solves it
outright"*, solved outright rather than hazed over.

*(An earlier draft of this note asserted a cfH=300 / scale=1 arithmetic. That
was a hypothetical, not the arrival state; it was measured and replaced before
seal. Ground check: state what was verified this session.)*

**THE HAZE IS THE INSURANCE**, for the sizes the fit does not choose. It is a
`mask-image`, not a gradient overlay, and the reason is the ground: an overlay
must know what colour to fade to, and this carousel stands on `--wb-bg` in three
wings and inside a wing that re-pins `--wb-bg` for its viewer column. A mask
fades to whatever is behind it and cannot be wrong about the ground — and it
sidesteps the transparent-fades-through-black artefact entirely, because there
is no colour in a mask, only alpha.

**The covers got their own box, and the one reason is the mask.** A mask applies
to every descendant, including the `‹ ›` arrows at `left:8px` / `right:8px` —
masking `.cf-wrap` would have hazed away the controls. So `.cf-rack` carries the
mask and the arrows stay outside it. `perspective` MOVED WITH THEM: it applies
to an element's DIRECT children only, so leaving it on `.cf-wrap` would have
flattened the whole carousel the moment the covers became grandchildren.

**One regression, caught on glass and named rather than quietly fixed.** Every
`.cf-album` is `position:absolute` with no `left`/`top`, so it sits at its
STATIC position — and the static position of an abspos child of a flex container
is set by that container's `justify-content`. `.cf-wrap` said `center`; a plain
block wrapper does not, and on the first render the entire carousel collapsed
into the top-left corner. The wrapper has to BE a centring flex container or the
transforms have nothing to be centred on. **This is why the lap is a gate and
not a formality** — the measurement JSON said "5 albums rendered" and was right,
and the screenshot said the room was broken.

**390px, measured:** the fit gives a smaller rack; the active cover runs
125→253 in a wrap of 8→369.9, and Carsie sits at 271→355 — **inside the haze
band (335.9→369.9), so she dissolves at her right edge**, which is Mike's *"a
slight FADE on the last visible item indicating more beyond the haze"*,
literally. Haze is 34px a side there rather than 78: two 78px margins on a 374px
phone would spend 42% of the carousel on fade and start eating the ACTIVE cover,
which is the one thing the edge treatment must never touch.

**Reachability verified by driving the control, not by reading the code:** at
390px the `›` arrow walks Worth A Listen → Carsie → Hunter Root → Jesse → Mikey
Mike and then correctly disables. Every album reachable, desktop and phone.

---

## GATES

| Gate | Result |
|---|---|
| `npm run lint` | **11 err / 9 warn** — identical to HEAD baseline, zero new |
| `vite build` | green |
| Desktop lap | 1706×900, live built bundle via `wrangler dev` |
| 390px lap | genuine 390×740 same-origin iframe; `/`, `/booth`, `/foundation`, `/shop`, `/wal` (5 albums × every face), `/robots` (2 albums × every face), `/hr`, `/wb` |
| Horizontal scroll @390 | **zero page-level** on every route (378 ≤ 390) |
| Contrast re-audit | **zero failures**, desktop and 390px |
| `[PAPA]` leaks | **zero**, and every scrubbed answer ends on a whole sentence |
| Robots pagers | **zero** — M1's invariant preserved |
| Repo hygiene | no lap harness written to the repo; the 390px frame was an injected same-origin iframe, so nothing had to be removed before seal |

---

## CARRY-FORWARD, NAMED NOT FIXED

1. **Five text-only faces**, all in the robots wing, all ART-pending. Ranked in
   the audit; The Record is the strongest and its renderer now exists.
2. **A portrait of Hunter Root.** His card opens on his record sleeve because
   the vault has no portrait. One string.
3. **`InfoBooth.css` is now furniture for two rooms while still named for one.**
   Renaming it means touching the room Mike calls AWESOME to change nothing a
   visitor can see — not this round's trade. Named as a want.
4. **The Foundation's own name.** Built and defended on the page, but "The
   Weird.Baby Foundation" carries a legal expectation the charter deliberately
   refuses. Mike's call to keep, rename, or let the first answer carry it.
5. **`THE_CHARTER.md` is still DRAFT v0.3, "not published."** The room is built
   to the marker discipline so nothing unruled can print — but whether it ships
   at all is a deploy decision, and deploys are Mike's.
6. **`--wb-gold-mute` and `--wb-gold-lo` are now half a stop apart** on the mat.
   That is the ground's fault, not the ramp's, and it is stated rather than
   papered over. If the mat ever lightens, the band widens and the mute can move
   back down.
