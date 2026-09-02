# SHIPPING THE REBUILD + LIFTING THE BEZEL — THE COST, MEASURED
2026-08-21 · reported before building, as the packet asked · **nothing shipped**

## THE ONE THING THAT STOPS BOTH

**The rebuild takes channel selection OFF the panel, and the replacement does not
exist yet.**

The mock's own comment says it plainly: *"FEED picks which bank is patched and
which state it is in; **it no longer picks a channel**."* Its five banks carry no
`ch` field at all. Mike's model agrees — *the drum says what mode to start the
device in, nothing else; the drum and the channels are UNRELATED.*

But today `resolveChannel(drum, ANT, antIdx)` **reads `drum.ch`**. The drum IS
how a channel is chosen. And the four screen buttons do **not** select channels —
`grep` for `portal-channel` in `twin.html` returns nothing; the only message the
twin ever posts is `{wb:"portal-close"}`. The buttons call
`devLayout(n) → Feed_Select(n)`, the twin's own internal views.

**So shipping the rebuild on its own leaves the Portal with no way to choose a
channel at all.** The two defects are one change, and the wiring is the half the
packet asked me to cost first. That is why nothing shipped.

---

## BLOCKER — FOUR OF THE FIVE BANKS ARE BROKEN, AND ONE LEAKS THE WORKSHOP

The mock declares all five banks `arms:true`. Measured against
`PORTAL_RECIPES` in `twin.html` — this is read out of the file, not inherited
from the handoff:

| bank on the rebuilt FEED | recipe it would launch | what actually happens |
|---|---|---|
| `PATCHED` | `"standard" {resume:true, power:"on", level:2}` | **correct** |
| `COLD START` | `"boot-playback" {…, replay:true}` | a **sandbox replay**, not a cold boot |
| `FIRST RUN` | `"off-first-boot" {power:"off", level:0}` | **powered off — black** |
| `LAST STATE` | *no recipe of that id exists* | `chip("warn","unknown id … ignored; the portal opens plain")` — **black** |
| `TEST BENCH` | `"test-bench" {…, dev:true}` → `setUserMode(false)` | **the DEV WORKSHOP, shown to visitors** |

Today all four of those drum positions carry `arms:false` and refuse, so none of
this is reachable. **The rebuild arms them.** `TEST BENCH` is the serious one: it
is marked *DEV-ONLY BY DEFAULT* in its own comment and the rebuild would put it
one press from the glass on weird.baby.

`clean-boot {power:"on", level:0}` exists and is unexposed — the known target for
COLD START. **And `level:1` contains `Boot_Offer()`, which stops and asks the
visitor a question**: a bank that waits for an answer is a different object from
one that plays, and that wants Mike's eye before it ships.

**This is not a reason to hold the rebuild — it is a reason to point the five
banks at recipes that work, in the same change.** The repointing is known; it is
four lines. What it needs is a ruling on `TEST BENCH`: **drop it from the volume,
or keep it and accept the workshop is public.**

---

## DEFECT 2 — WHAT LIFTING THE BEZEL AND THE STRIP ACTUALLY COSTS

**Where they live now.** `Mon_Controls_In()` in `twin.html` builds `#monctl` and
`#monlayout` inside `#unitstage`. The bezel is not a border — it is a **measured
PNG with rounded-corner transparency and a curved inner opening**, fitted over
the family art to a recorded mean absolute error against `monitor_base`, with the
art cropped by *"the bezel's curved inner edge"*. It is one of the most carefully
measured objects in the twin.

**The other two branches are museum React components** — `TestSignal.jsx` and
`Television.jsx` — with no bezel and no strip.

**THE CHEAP PART:** the asset does not have to move or be duplicated. The bezel
PNG is served from `/held/robots/…`, so the museum can reference the same file.
One asset, not two. The strip is markup and CSS and is small.

**THE EXPENSIVE PART, AND IT IS A MEASUREMENT NOT A REFACTOR:** the opening was
cut for **the machine's own picture**. Television is a 16:9 YouTube player and the
test card is drawn to its own geometry. **Fitting those two into an opening
measured against the family art is a new fit, at both widths, and it is the kind
of thing this week has twice proved cannot be reasoned about — only measured.**
Three candidate behaviours, and they look different:

- the picture **fills** the opening and is cropped by the curve (what the family
  art does today),
- the picture **fits inside** the opening and the machine shows through around it,
- the opening is **re-cut** for 16:9 and the family art is re-fitted to match.

**The second cost:** the twin must stop drawing its own bezel and strip when it is
framed by the museum, or there will be two. The precedent exists and is one `if` —
`Portal_Close()` already branches on `window.parent !== window`. Standalone the
twin keeps both, which is what protects it.

**The third cost, and it is the real one:** once the strip is the Portal's, its
buttons must reach the resolver. Shape and reasoning are in
`docs/MUSEUM_PORTAL_CHANNEL_SELECTOR-20260821.md` §1 — the twin posts
`{wb:"portal-channel", ch:n}`, the flow re-broadcasts, **the panel answers with
the same `wb-robots-open-twin` payload it already builds**, so there is exactly
one resolver and the seam stays a seam. Under the rebuild the panel no longer has
a drum channel to answer *from*, so the channel becomes state the panel holds on
the strip's behalf. **That is the piece that does not exist in any file today.**

---

## WHAT THE LATCH MEANS AFTER THE REBUILD — UNSPECIFIED

Today the latch opens **what the drum's channel carries**. After the rebuild the
drum carries no channel, so the latch *launches the device in a mode* — and then
something has to decide **which of the four channels is showing when the overlay
opens**. The packet does not say. Options: channel 1 always; the last channel this
visit; the lowest channel set to CAB; or nothing until the visitor presses a
button. They are visibly different objects and it is a UX call.

---

## THE DECISIONS, SHORTEST FIRST

1. **`TEST BENCH` — drop it, or ship the workshop?** Blocker.
2. **Which channel is showing when the latch fires?**
3. **How does a 16:9 picture sit in the bezel's opening** — fill and crop, fit
   inside, or re-cut?
4. Confirm the other three banks repoint to `clean-boot` / `{power:"on",level:1}`
   / `idling-updated`, and whether `level:1` stopping to ask a question is wanted.

With 1–3 answered the build is mechanical and both defects close in one change:
the panel rebuild, the DIP as four independent bits, the strip and bezel lifted to
the overlay, and one message added to a contract that already runs both ways.

## THE TREE

| repo | head | working tree |
|---|---|---|
| weird-baby-museum | `a5a2d38` | 2 modified (`docs/canon/06-PORTAL.md`, `docs/canonical/OPERATIONS.md`), 4 untracked, **all under `docs/` or `tools/`** |
| weird-baby-robots | `cb09e88` | clean |

**Nothing in `src/` has changed this session, and nothing in the robots repo.**
