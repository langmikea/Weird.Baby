# THE 4:3 CROP, AND THE RESIZE THAT NEEDED NO COVER
2026-08-26 · second packet of the day · built and verified served · nothing committed, nothing deployed

## WHAT NEEDS MIKE

**ONE THING, AND IT IS A LOOK.** The crop is built and the resize is gone; the
question is whether the crop took the reference you meant. **§1.3 says what the
other two would have looked like, and the page is the place to judge it.**

**AND ONE THING YOU DO NOT HAVE TO DECIDE AFTER ALL:** *"some cover"* turned out
to be unnecessary rather than undecided. See §2.

Gates: lint **9 / 7 = baseline** · build green · launch build green ·
provenance **PASS** · `reveal:check` · `parity:gate` · `instory:gate` ·
`docs:numbers:gate` **PASS** · `reveal:day` nothing to move · `assets:orphans`
**13, unchanged** · `lap:clean` done.

---

## 1 · THE 4:3 CROP

### 1.1 · What decided the reading

**MIKE: *"ENLARGE the screen BEHIND THE BEZEL to crop the screen to just the
center 4:3 area."***

**THE APERTURE CANNOT BE MADE 4:3, AND THAT IS THE WHOLE OF WHY THE OTHER
READING IS OUT.** The opening measures **2532 x 2003 = 1.264**. It is
barrel-curved art on a plate whose replacement he shelved this morning, so no
amount of code makes the visible hole 1.333. **The 4:3 area is therefore a fact
about the PICTURE**, and the sentence means what it says: enlarge what is behind
until the hole is framing the middle of it.

### 1.2 · The three candidates collapse to one rule

The survey offered three, up to 75px of height apart. **They were three answers
to "which rectangle is the screen", and each placement already knows its own
answer** — so the rule is written once and each kind supplies its rectangle:

```
canvas placement (the machine, the photograph)   3000 x 2400  ->  3200 x 2400   at x -100
feed placement   (television, the test card)     2540 x 2036  ->  2714.67 x 2036 at x 139.67
```

Both are **the centre 4:3 that COVERS the rect**, never one inscribed in it —
inscribing would letterbox, which shrinks the picture to fit a shape and is the
opposite of ENLARGE. The existing `object-fit: cover` then does the rest.

**Verified on the served page, in canvas units:**

| | box | ratio | hole covered |
|---|---|---|---|
| ch3 the twin | `-100, 0, 3200 x 2400` | 1.3333 | x ✔ y ✔ |
| ch4 the photograph | `-100, 0, 3200 x 2400` | 1.3333 | x ✔ y ✔ |
| television / test | `139.6, 194, 2714.6 x 2036` | 1.3333 | x ✔ y ✔ |

The art enlarges by **x 16/15 = 1.0667, exact**, and loses 75px of the original
top and bottom to the opening.

### 1.3 · Which one was NOT taken, and what it would have looked like

**THE MEASURED OPENING (2532 x 1899) IS DELIBERATELY NOT USED**, and the
overscan is the reason. The feed rect is *taller than the hole on purpose* — 0
hole pixels fall outside it — so the curved inner edge crops the picture and no
page ground can leak in. Cropping to the hole's own bounding box would put the
picture's edge exactly on the hole's edge and hand that guarantee back **to buy
13px of height.**

For Mike, in the only terms that matter — how much bigger the picture gets:

| reference | enlargement | what he would see |
|---|---|---|
| **the canvas — BUILT** | **x1.0667** | the most enlargement of the three; 75px off the top and bottom of the plate |
| the declared feed rect | x1.0688 | **0.2% larger than what shipped** — indistinguishable by eye |
| the measured opening | x1.0548 | ~1.1% smaller than what shipped; also the only one that risks a ground leak |

**All three are within 1.2% of each other.** The survey's "up to 75px" was a
difference in *source* pixels on a 2400-tall plate, which is 3%, and once it is
expressed as enlargement it is under one and a half percent. **If the built one
looks wrong, none of the other two will fix it** — the reading is wrong rather
than the reference, and that is worth knowing before a second round is spent.

### 1.4 · What it does to television — MEASURED, AND IT IS A SEPARATE JOB

```
                box (canvas units)   video      bar each side   % of the opening
before          2540 x 2036          1428.8     303.6           15.2% each · 30.3% total
after the crop  2714.6 x 2036        1527.0     254.5           12.7% each · 25.4% total
```

**The crop takes a sixth off the black and does not close it.** The reason is
the same defect that put channel 4 in an iframe: **`object-fit` is inert on an
iframe**, so widening the box only changes how YouTube letterboxes *inside* it,
and it never makes the video cover.

**Closing it is a different mechanism** — sizing the player to the box's HEIGHT
and letting its width overflow (2036 x 16/9 = **3619.6** wide, cropping 452.5 a
side) with the box clipping it. That is a change to how `Television` is placed,
not to the crop, and it is **not built.**

---

## 2 · CH3'S RESIZE — REPORTED B, BUILT NEITHER

### 2.1 · B, reported before building, as instructed

**SHAPE B is: keep the twin mounted always, hidden behind television and the
test signal.** From `MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §0 and §5:

- **What it buys:** the document never unmounts, so it never reloads, **for
  anyone, storage or no storage** — the machine genuinely waits.
- **What it costs:** *"the ONE OUTPUT guarantee — a live twin behind a live
  television is two things running; the twin's hum would have to be silenced on
  the way out, by hand, and nothing would enforce it."*

**AND IT WOULD NOT HAVE FIXED WHAT MIKE SAW.** B is about *returning* to channel
3. The resize happens on the **first** open too, when there is nothing mounted
to keep. B would have paid the ONE OUTPUT guarantee and left the defect standing
on the very first press.

### 2.2 · The cause, measured rather than reasoned

`Framed_Fit()` was called from **`probe.onload`** — the far side of a network
fetch for the base photograph. So the document laid out twice.

**Measured in the live overlay** by removing the injected `#framedfit` rule from
a framed twin and reading the stage back, then restoring it:

```
without #framedfit    828 x 662  at x 36      <- what the document has until the fetch lands
with    #framedfit    900 x 720  at x 0
```

**An 8.7% growth and a 36px shift**, at whatever moment the network chose. On
this localhost the base plate resolved at **73.5ms**; on a cold connection it is
whatever it is, and that is the point — the jump was scheduled by the network.

### 2.3 · The fix removes it rather than hiding it

**`Framed_Fit()` now runs in `setup()`, before `Unit_LoadPhotos()`.** Nothing in
it needs the probe: it adds `body.framed` and injects CSS for `#unitstage`,
`#portalbar` and the page furniture, and `Framed()` is a synchronous window
test. It sat in `onload` only because that is where `monbase` is added, which is
a different fact about a different thing. **`setup()` runs from an inline script
at the end of the body**, so it lands before the browser paints the stage once.

**IT ALSO FIXES A CASE NOBODY HAD LOOKED AT.** When the base plate is missing
the probe never loads, so framed styling never ran at all and
`Portal_Base_Missing`'s NO SIGNAL card drew in the small centred stage. It draws
full width now.

**The call in `probe.onload` stays** and is a no-op on its second visit (it
early-returns on `#framedfit` existing), because standalone it is still the
thing that does nothing and removing it would make the ladder's two entries
disagree about who is responsible.

### 2.4 · "Some cover" — whose word it is, and why it is moot

**IT WOULD HAVE BEEN HIS.** A cover is a thing a visitor looks at — a held
black, a card, a station ident — and that is UX, not mechanism. Ops would have
had to ask.

**IT IS MOOT BECAUSE THERE IS NO LONGER A RESIZE TO COVER.** What remains is a
LOAD — black, then the picture — which is what every channel does and what a
television does. **The Law of Subtraction answers the rest:** a cover over a
transition that no longer happens is a thing that does not need to be there.

**If he still wants one, it is a fresh ask about a load rather than a resize**,
and it is his to describe.

---

## 3 · HOW IT WAS VERIFIED, AND THE ONE THING THAT COULD NOT BE

Served at **`http://localhost:5173/robots`** and walked: album 2 →
`01 Launch the Portal` → switches 3 and 4 to CAB (`1100`) → LATCH → television
→ `4` → `3` → `1`. Every box read back in canvas units and checked against the
measured hole on both axes.

**FIRST-PAINT TIMING COULD NOT BE MEASURED, AND THE PROBE SAID SO RATHER THAN
GUESSING.** The Browser pane does not composite in this session, so
`setInterval` throttles hard — a 25ms sampler returned **5 samples across
4,682ms** — and `performance.getEntriesByType('paint')` inside the twin returns
**an empty array**. §8's family exactly: the page runs, it does not paint.

**So the two layout states were measured by construction instead** (§2.2),
which is a stronger oracle for *what the two layouts are* and no oracle at all
for *how long the wrong one is on screen*. The ordering that removes it is a
synchronous statement in `setup()` and is read from source. **Mike is the first
eye on whether the jump is gone.**
