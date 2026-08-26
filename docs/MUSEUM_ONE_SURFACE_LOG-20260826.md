# ONE SURFACE — the Portal's controls, on all four channels
2026-08-26 · built and verified on the served page · nothing committed, nothing deployed

## WHAT NEEDS MIKE

**Nothing blocks it.** Gates: lint **9 / 7 — a NEW baseline, moved by a real
removal** (see §7) · build green · launch build green · provenance **PASS**
(15 rows added, 1 pruned) · `reveal:check` **PASS** · `parity:gate` **PASS** ·
`instory:gate` **PASS** · `docs:numbers:gate` **PASS** (4 published values
corrected) · `reveal:day` nothing to move · `assets:orphans` **13, unchanged**.

**One thing is filed rather than fixed, on his ruling:** `monFeed` has been
pinned at 1 inside the museum since 2026-08-21. `docs/OPEN_ACTIONS.md` **W-a**.

---

## 1 · THE SURVEY WAS WRONG ABOUT THE ONE NUMBER IT LED WITH

Ops reported the control quadrant **full** and it is **59.0% full**. The
sentence quoted — *"leaves 1.24cqw on every side"* — is the **P2 polish note of
2026-07-29, which P2b superseded hours later** when the boxes were cut
16.90 → 14.8cqw and the group narrowed 35.3 → 31.1cqw. The live figure is stated
eleven lines below it at `twin.html:903` and Ops read past it.

```
PANEL   37.77 x 28.57 cqw   (1133 x 857 px on the 3000-wide canvas)
GROUP   31.10 x 20.46 cqw     -> 59.0% of the panel by area
SLACK   3.33 cqw a side horizontally (100 px) · 4.05 cqw vertically (122 px)
```

Mike's screenshot was the correction. **A struck number in a comment reads
exactly like a live one**, which is the general form of this and is why the
replacement paragraph in `PortalScreen.jsx` states both figures and names which
superseded which.

## 2 · ONE STRIP ON THE GLASS, ALL FOUR CHANNELS

**MIKE: CH3's surface is the target for all four channels. CH3 is the
reference, not a special case.**

The 2x2 follows the digit strip out of `twin.html` **by the same structural
argument, not a second one**: the overlay draws the kinds as mutually exclusive
branches, so a control living in the twin can appear on one channel of four.
`Framed()` now removes `#monctl` exactly as it already removed `#monlayout`.

| | where it lives |
|---|---|
| bezel · channel strip · **2x2** · note | the museum, over all four kinds |
| the four handlers | `twin.html`, untouched, still the machine's only inputs |
| a press | `wb-portal-machine-control` → the overlay → `postMessage {wb:"portal-control", id}` |
| the power lamp | `postMessage {wb:"portal-power", on}` from `Mon_Power_Sync`'s existing 200ms chokepoint, **only on a change** |

**TWO IMPLEMENTATIONS ON DISK IS FORCED, NOT CHOSEN.** `twin.html` is
single-file, no-network by a standing constraint and must work with no museum,
so neither can import the other. What they share is arithmetic — five numbers,
mirrored as `CHY_M`. **Verified on the page at a 900px frame, every value
landing on the twin's own derivation:**

```
--chy-w 14.8cqw -> 133.20  measured 133.20      2x2 button
--chy-h  6.0cqw ->  54.00  measured  54.00
--dig-h 5.26cqw ->  47.34  measured  47.34 x 47.34   (square)
strip and 2x2 both 279.90 wide, both at x 661.8   -> THE TWO ROWS SHARE ONE EDGE
strip.y - ctl.y = 136.80 = 15.2cqw  (stack-h 13.5 + grp-gap 1.7)
ctl.y = 398.60 = 55.359% of 720
```

**THE SEVEN DRESS DIFFERENCES ARE CARRIED, AND NONE WAS COSMETIC** — the
three-layer chyron halo (white on that quadrant measures ~1.6:1, and these
controls now sit over television, a monoscope card, a photograph and the
machine, of which one was measured), the hairline ring, the `.chytxt` span,
hover neutralised, no focus ring, `overflow`/`box-sizing`, and `--knock`.

## 3 · SCROLL KEEPS ITS ONE MEANING, AND THE IGNORING IS THE RULING

**MIKE, after review:** *"scroll only does what it was originally designed to
do, and in all other instances is ignored."*

Channels do **not** move to SCROLL, so the fault `MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md`
§3 names — one control, two meanings — **is not created.** `devRotary` stays
MGK-VIIIp's rotary dial.

**A control that reaches nothing on three channels of four reads like a `TODO`
and is not one.** The reasoning is written at the site that does the ignoring —
the `wb-portal-machine-control` listener — so a later round meets it before
wiring anything up. Measured: SCROLL, POWER and SHAKE pressed on television
**throw nothing and change nothing**; POWER stays unlatched.

## 4 · BOTH TEARS, AND WHY THE SECOND DOES NOT COST THE FIRST

**MIKE: "A: rare on its own, plus on demand."**

Ops' own objection was the right one — *"a tear that happens often is a
texture"* — and the answer is that **they are two objects doing two jobs.** The
scripted tear is EVIDENCE and only works because nobody asked for it; the
commanded tear proves the control does something. **A press cannot make an
unbidden event less unbidden**, so the rarity that carries the meaning is
untouched by any number of presses.

**The clocks are separate and neither feeds the other.** A press does not
advance the script's index, reset its timer, or consume a step. Presses walk the
same four-step vocabulary through their own index, so the two kinds of rip are
indistinguishable in shape — which is the point — and both stay deterministic
under the glitch-realism law. The guard is a token, not a boolean, because two
rips overlapping is the ordinary case.

**MIKE ON THE REASON: *"No reason, no explanation. Maybe someday we will learn
why."*** **The absence of a reason is recorded at the tear itself as
deliberate.** Doctrine 12 forbids the alternative and an invented reason is
worse than none; the note exists so the next round does not supply one.

**AND THE SLIP REACHED ONLY ONE KIND OF PICTURE.** It sat on the `<iframe>`, so
on television and the test signal the rip drew with nothing moving under it — a
bar laid on a still. It is on a wrapper inside the feed rect now. Measured:
CLICK on channel 3 gives `translateX(7px)`, on television `translateX(-4px)`,
both clearing to `none`.

## 5 · CH4 IS AN `<img>`

The art was never the problem. Measured: the plate is **3000 x 2400** — the
bezel's own canvas — and registers with it, showing a frame ring of **0px at
nine of eleven rows** sampled across the opening (the two others are the camera
body in the picture).

It was in an `<iframe>` because the machine branch was the ternary's `else` and
CH3 — a document — shares it. **`object-fit` does not apply to an iframe**, so
`PortalScreen.css`'s `object-fit:cover` had been inert since the day it was
written and what drew was the browser's own image viewer.

**The channel declares it** — `picture: true`, data in the same shape as `bezel`
and `note` — and the overlay picks an element. Nothing downstream learns what a
channel is. Measured on the page: `IMG`, `natural 3000x2400`, box `900x720`
filling the feed rect exactly, **and no `?user=1&preset=standard`** — a preset is
a contract with a document and addresses nothing on a PNG.

## 6 · THE KNOCKOUT — AND IT IS MEASURED, NOT ASSERTED

T4 (2026-07-29) and S2 (2026-07-30) both ruled this and neither reached the
Portal strip when it was built on 2026-08-21. Mike saw it in one shot.

The browser was asked to paint the shipped `--knock` onto a canvas and the
pixels read back:

```
corner            rgba(255,255,255,255)      the slug is opaque white
centre            rgba(  0,  0,  0,  0)      the numeral is a HOLE
transparent       3,149 of 40,000 px  = 7.87% of the slug
mid-column runs   3                          the three strokes of a "3"
```

**If it were ink the centre would read `[0,0,0,255]` and the transparent count
would be zero.** The scrim sits at `.34` — not `.62`, which measured 84.6
against 234.6 and read as ink again, and not lower, because a literal hole onto
a 183 quadrant inside a 255 slug is about 1.9:1 and illegible.

`--dig-weight-on` is struck with the ink that read it; the one-weight-heavier
rule is enforced where the glyph is now drawn, at `CHY_M.dwt`.

## 7 · THE LINT BASELINE MOVED, AND THE FIRST ATTEMPT MOVED IT THE WRONG WAY

**9 / 8 → 9 / 7.** `TEAR_SCRIPT` and `TEAR_MS` were declared in the render body,
so they were a fresh array every render and the effect walking them could not
honestly list them as dependencies.

**THE FIRST CUT SILENCED THAT WITH AN `eslint-disable-next-line`, WHICH MOVED
THE NUMBER WHILE CHANGING NOTHING** — the tripwire-disabling failure CLAUDE.md's
own A1 note describes, arriving from the other direction. It was undone. They
are constants and are at module scope; the deps are satisfiable and no rule is
disabled anywhere in this packet.

`docs:numbers:gate` then caught **four** published values this packet moved —
the baseline in `CLAUDE.md` and `OPERATIONS.md` §9, and `OPEN_ACTIONS`' row
counts in `BACKLOG.md` (140 → 141, 135 → 136). All corrected in the documents,
none in a round log.

## 8 · WHAT WAS NOT DONE, AND IT IS FOUR THINGS

**Mode B**, **the bezel 4:3 crop**, **the ADM-3A style** and **CH3's visible
resize** — Mike's ruling, each its own job and three of them looks.

Two are worth carrying because they are already measured:

- **Television is letterboxed inside the opening.** The player's iframe is
  2540 x 2036 canvas px and the reel is 16:9, so it draws 2540 x 1428.75 with
  **303.6 px of black top and bottom — 14.9% of the opening each.** That is the
  4:3 job.
- **CH3's resize is a two-stage layout gated on a network image probe.** The
  document lays out at `max-width:min(96vw,880px)` and only in `probe.onload`
  does `Framed_Fit()` inject `width:100%`.

## 9 · THE FLAG

**`monFeed` HAS BEEN PINNED AT 1 INSIDE THE MUSEUM SINCE 2026-08-21.**
`Feed_Select` has three call sites and framed only one is reachable, so the
per-feed weather collapses to profile 1 for the whole visit.
`MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §2 predicted it in the row marked
**WATCH IT** — *"Not dead — CHANGED, and it must not change silently."*

**It changed silently for five days**, and the reason nothing caught it is that
the prediction lived in a scoping document no gate reads. Recorded at the site
in `Mon_Controls_In` and open as `W-a`. **Not fixed, on Mike's ruling.**

## 10 · HOW IT WAS VERIFIED, AND WHAT COULD NOT BE

Served at `http://localhost:5173/robots` and walked: album 2 → **`01 Launch the
Portal`** → switch 3 to CAB → LATCH → channel 1 **television, and no note at all**
→ `3` → the twin, `framed=true`, **`#monctl` false and `#monlayout` false**, note
`SIGNAL PRESENT.` → switch 4 to CAB → `4` → the `<img>`.

All four controls proved to reach the machine by instrumenting the twin's own
handlers from the parent: `devShutter, devRotary, devPower, devShake`. POWER's
mirror proved by toggling: **false → true → false**.

**A PIXEL SCREENSHOT COULD NOT BE TAKEN.** The Browser pane does not composite
in this session, which is the same family as §8's `requestAnimationFrame` and
lazy-image rows: the page runs, it does not paint. **So the one genuinely visual
claim was proved by reading painted pixels instead** — §6 — which is a stronger
oracle for that claim than a screenshot would have been, and a weaker one for
everything about how the surface *looks*. **Mike is the first eye on the look.**
