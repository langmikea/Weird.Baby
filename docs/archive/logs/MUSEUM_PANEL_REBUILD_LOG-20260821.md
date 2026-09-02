<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# THE PANEL REBUILD + THE PORTAL'S OWN SCREEN
2026-08-21 · both defects, built as one change

## WHAT NEEDS MIKE

**Nothing blocks the deploy.** Two things are reported rather than decided:

1. **LAST STATE did not get wired, and the packet said to say so rather than
   wire it.** `idling-updated` is `{power:"on", level:2}` with **no `resume`** —
   it opens an *idle* machine, which is PATCHED without the resume. Mike's
   meaning is *"I left the machine running, so when I return resume right where
   I left off."* The only thing that does that is `resume:true`, and it is
   already on `standard`. **The bank ships DISARMED**, beside TEST BENCH. §5.
2. **The twin's portal size dial is inert while framed.** It writes an inline
   width, and a picture the visitor can resize under a frame that cannot resize
   with it never registers. Standalone it is untouched. §4.

Deploy: `npm run deploy:launch`.

---

## THE TREE

| repo | head | working tree |
|---|---|---|
| weird-baby-museum | `a5a2d38` | `src/` 5 files, `public/held/robots/twin.html`, `provenance/register.json`, docs |
| weird-baby-robots | `cb09e88` | `tools/viiip_twin.html` |

**The two twin copies are byte-identical** (`md5 9ef8e94…` before the last patch,
re-checked after each): the museum serves `public/held/robots/twin.html` and the
robots repo holds `tools/viiip_twin.html`. Nothing else in either repo changed.

## THE GATES

lint **9 / 8 = baseline** · build green · **launch build green** · provenance
**PASS** (12 rows added) · `reveal:check` **PASS** · `parity:gate` **PASS** ·
`instory:gate` **PASS** · `docs:numbers` **PASS** · `reveal:day` nothing to
move · `assets:orphans` **13, unchanged (M9)**.

---

## 1 · THE PANEL

Shipped to the drawing: the **ABEAL badge alone**, the **FEED readout with the
steppers outside it**, the **four-slider ANTENNA DIP numbered 1 2 3 4 with no
legend**, SOURCE, LATCH, four screws at four angles, no patch strip, no shadow
bar, labels at **17px**, **DIP default 1111**. Measured on the page: badge
`ABEAL`, legends `FEED / ANTENNA / SOURCE` at `17px`, `NIAC/VIIIp` + `PATCHED`,
DIP `1111` numbered `1234`, **0 bat switches**, `FEED ARMED`.

**THE DRUM'S JOB DID NOT CHANGE; ITS SECOND JOB WENT.** The barrel carried
*which machine state* and *which channel* on one object, and R6's engraved
channel numbers were the second job wearing the first one's clothes. `ch` is off
the bank rows entirely and the four channels moved into the ANTENNA, which
already addressed them by number. **`unit: true` is the old position's `arms`
field MOVED, not invented** — the same four declarations at a new address.

**THE RESOLVER STAYED ONE EXPRESSION IN ONE PLACE:**

```js
function resolveChannel(chRow, bits, i) {
  if (!chRow) return "none";
  if (String(bits || "").charAt(i) === "1") return "television";
  return chRow.unit ? "machine" : "test";
}
```

**Four routings became sixteen states.** The puzzle stops being *step until
1101* and becomes *find the channel the machine is on and switch that one to
CAB*, which is what QC_101 tells a visitor in the installer's hand.

### The five banks, measured

| bank | recipe | armed | verified on the page |
|---|---|---|---|
| PATCHED | `standard` | yes | FEED ARMED, latch live |
| COLD START | `clean-boot` | yes | FEED ARMED, latch live |
| FIRST RUN | `first-run` **(new)** | yes | FEED ARMED, latch live |
| LAST STATE | — | **no** | NOT ARMED, latch disabled |
| TEST BENCH | `test-bench` | **no** | NOT ARMED, latch disabled |

`SEEDED` → NOT ARMED, latch disabled. **The workshop does not ship.**

**`first-run` IS A NEW RECIPE IN `twin.html`:** `{power:"on", level:1}`. **`level:1`
reaches `Boot_Offer()`, which stops and asks the visitor a question, and that is
correct** — MIKE: *"the machine does what the machine was designed to do."*
Nothing routes around it and the comment in the recipe says so, so a later round
cannot "fix" it.

### What was struck, and why it is not a silent decline

The bat switches and the refusal paragraph are gone (Ruling 25: no lock; a patch
panel arms when it is LIVE). The refusal was also the thing that grew the chassis
**454 → 516px on a dial turn**. **Nothing declines silently:** the lamp reads NOT
ARMED and the latch is visibly `disabled` — two reports by the controls that
caused it — and what a *channel* carries is now said on the screen, beside the
buttons, which is where a visitor is looking when it matters.

## 2 · THE PORTAL'S OWN SCREEN

`src/routes/robots/PortalScreen.jsx` + `.css`. The three kinds stay mutually
exclusive — that is what stops a television having two outputs — but the bezel
and the strip are **outside the ternary**.

**Verified on the page, all three:**

| channel state | draws | bezel | strip | note |
|---|---|---|---|---|
| `1101` ch 1 | television, `youtube-nocookie`, 1 iframe | yes | `1* 2 3 4 X` | TELEVISION ON THIS CHANNEL. |
| `1101` ch 3 | the machine, `twin.html` | yes | `1 2 3* 4 X` | SIGNAL PRESENT. |
| `1001` ch 2 | the drawn test card, **0 iframes** | yes | `1 2* 3 4 X` | TEST SIGNAL. NO UNIT ON THIS CHANNEL. |

`X` closes. Escape closes. The latch always opens **channel 1**.

**THE TWIN'S OWN STRIP IS GONE WHEN FRAMED, MEASURED FROM INSIDE THE IFRAME:**
`#monlayout` absent, `#monctl` present with `SCROLL CLICK POWER SHAKE`, **0 bezel
nodes**, `#feedgroup` built, recipe applied. The 2x2 stays because those are the
*machine's* controls and there is no machine to drive while a broadcast is on.
Standalone, `Framed()` is false and the page is exactly what it was.

**NO THIRD WORD WAS ADDED TO THE CONTRACT, AND THAT IS THE LIFT PAYING FOR
ITSELF.** With the strip on the museum's side, both ends of the channel message
are museum components: it is a window event (`wb-portal-select-channel`) and the
iframe is out of the path entirely. `{wb:"portal-close"}` is untouched and still
serves the standalone page. **A word nothing needs does not go into a contract.**

## 3 · THE GEOMETRY IS READ, NOT EYEBALLED

Every number is passed as data (`latch.bezel`) off the twin's own measured asset
notes: the bezel is **3000 x 2400**, its barrel-curved opening encloses
**x 227..2766, y 202..2213**, and the **feed rect is deliberately taller —
y 194..2229** — because the picture overfills the opening and the curved inner
edge crops it. 0 hole pixels fall outside the rect, so nothing can leak into the
picture. MIKE: *"standard 60s CRT."*

**TWO PLACEMENTS, AND GETTING THEM BACKWARDS IS SILENT:** the machine is the
*whole canvas* (`twin.html` draws the family art on the same 3000x2400 canvas the
bezel was cut from) and goes edge to edge; television and the test card are
*pictures* and go on the feed rect. The machine placed on the feed rect would be
a picture of a monitor inside a monitor.

## 4 · THREE DEFECTS THE MEASUREMENTS FOUND, AND ONLY ONE OF THEM WAS VISIBLE

**(a) THE SCREEN CAME BACK 0 x 0, WITH EVERY RULE READING CORRECTLY.** The first
cut let the bezel `<img>` size the frame and hung everything off it — but the
img's `max-width:100%` resolves against `.ps`, whose size would then come from
the img. **Circular, and the browser resolves circular to zero.** The wrap is a
size container now and the frame is sized against it:
`width: min(100cqw, calc(100cqh * var(--arn)))`. Nothing resolves against a
descendant, so there is no loop to collapse.

**(b) THE PICTURE AND THE FRAME WERE DRAWN AT DIFFERENT SCALES — AND ONLY A
SCREENSHOT COULD HAVE FOUND IT.** Every number was right and the twin's art sat
**1104px wide inside a 1200px frame**, black showing between them. `#unitstage`
is capped at `min(96vw,880px)` and then re-written by the twin's **portal size
dial**, which writes an inline width. Framed, the overlay decides how big the
Portal is, so `body.framed` overrides it — `!important`, because it is fighting an
inline style, and named in the source as such. Measured after: stage **1200 x 960
at top 0, ratio 1.250**, exactly the frame. **The dial is untouched standalone.**

**(c) THE NOTE COMPUTED TO 6.8px AT 390.** Everything on this screen is `cqw` so
it scales with the picture — right for the buttons, wrong for a sentence. It
leaves the strip's column at narrow widths and runs the width of the opening:
`max(10px, 2.6cqw)`. Measured at 390: **10.1px, 328px wide, bottom 271 inside an
opening that ends at 288**, page overflow 0. **A container query, not a media
query** — the frame's size is what the type answers to, not the page's.

## 5 · LAST STATE — THE VERIFICATION, IN FULL

Asked for, and the answer is no.

```
"standard":       {resume:true, power:"on", level:2}
"idling-updated": {power:"on", level:2}
```

`idling-updated` **has no `resume`**. It differs from PATCHED by exactly the
resume and nothing else, so pointing LAST STATE at it would open an idle machine
under a legend that promises the visitor's own.

**WHAT CARRIES THAT STATE, AND WHETHER IT SURVIVES.** `PORTAL_SESSION_KEY`
(`wbr_portal_session`) in **sessionStorage**, written by `osTick` — *by the
machine simply running* — and it records **only `powered` and `booted`**. So even
`resume:true` returns a machine **powered and past the ceremony, not where you
left it**: menu position, scroll and any run in flight are not in the mark.
**And it is refused in real browsers** — measured this week, `SecurityError:
Access is denied for this document` on a plain `http://` origin in the profile
Ops drives. `Visit_Mark_Read()` catches and returns null, the recipe falls to
*"no mark this visit — the returning machine"*, and the full ceremony runs.

**A recipe that means "resume where I left off" does not exist yet.** It needs
`resume:true` plus a mark that carries more than two booleans. Not invented here.

## 6 · THE REGISTER TRAP FIRED AGAIN, AND THE GATE CAUGHT IT AGAIN

The 12 new provenance rows went in at the **top level** of `register.json`
instead of under **`.entries`** — invisible to a reader, fatal to the gate. It is
the same trap `CLAUDE.md` records costing a pass on 2026-08-09. Restored from a
copy taken before the write, redone under `.entries`: **2015 → 2027**, top-level
keys back to 5, gate PASS. The 16 findings are 12 rows because a repeated string
in one file shares one key.

Classification: `NIAC/VIIIp`, `FEED` and `X` **MIKE** (his naming, his engraving,
his S4 ruling); `PATCHED`, the close-up's frame title and the six aria-labels
**HOUSE**. `wb-robots-open-twin` is an event name and never drawn.
