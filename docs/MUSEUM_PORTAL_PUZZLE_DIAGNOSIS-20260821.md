# THE PORTAL PUZZLE — DIAGNOSIS, NOT A FIX
2026-08-21 · reported before touching anything, as the packet asked

## THE HEADLINE

**Neither reported defect reproduces on the artifact weird.baby is serving.**
Under routing `1101` the machine lands on **channel 3**, measured on the page,
four routings deep. The television player builds, the source is alive, and the
SOURCE dial is not a silent gate. **Nothing was changed this round** — a fix
here would break a mechanism that measures correct.

Two things I could not measure, stated as such rather than assumed, are at the
foot: whether the picture MOVES for a person, and what Mike actually latched.

---

## 1. THE TREE

| repo | branch | head | working tree |
|---|---|---|---|
| weird-baby-museum | `main` | `a5a2d38` Record 005 | 2 untracked: `docs/MUSEUM_DIAGNOSTICS_REPORT-20260821.md`, `tools/canon-gate.mjs` |
| weird-baby-robots | — | `cb09e88` The QC form, the handwriting marks, the digit cuts | **clean** |

**THE ROBOTS ORPHANS CLOSED THEMSELVES.** The 08-21 QC_101 round flagged
`marks/` and `portal/` as untracked in weird-baby-robots, which made twelve
asset-table rows orphans by construction. `git status --short` is now empty and
`cb09e88` is the commit that took them. That flag can come down.

## 2. THE LIVE SITE IS THIS COMMIT — PROVED, NOT ASSUMED

The suspicion worth killing first was that Mike ran an older deploy. He did not.

- `https://weird.baby/robots` loads `/assets/index-Dke1CfUr.js`.
- A local `npm run build:launch` of the current tree emits `index-BZmEFocH.js`,
  **the same 307,223 bytes**, and the two files differ at **one place only** —
  character 207,084, the `/admin` page's build stamp
  (`2026-08-21T18:54:45.415Z` live vs my `19:58:32.189Z`).
- The two chunks that matter are **hash-identical**, which is content identity:
  `assets/tokens-D8JH1Pu4.js` (the panel component) and
  `assets/held/portal-BR6R-VQ9.js` (the Portal's data).

**So the deployed panel and the deployed antenna data are byte-for-byte the code
below.** The site was deployed at **14:54 ET today**, after `a5a2d38`.

Read out of the shipped `tokens-D8JH1Pu4.js` — the resolver as it ships:

```js
function K(e,t,n){let r=e||{};return t&&Array.isArray(t.governs)&&r.ch!=null
&&t.governs.indexOf(r.ch)>=0?((t.routings||[])[n]||``).charAt(t.governs.indexOf(r.ch))
===`1`?`television`:r.arms?`machine`:`test`:r.arms?`machine`:`none`}
```

`charAt(governs.indexOf(ch))` — bit *i* belongs to channel `governs[i]`, left to
right, `[1,2,3,4]`. The DIP renders from the same expression
(`(d.governs||[]).map((e,t)=> bit=M.charAt(t), ch=e)`), so the lamp a visitor
reads and the channel the resolver picks **come off the same index**. They cannot
disagree; there is no second declaration to drift.

The shipped data, read out of `held/portal-BR6R-VQ9.js`:

```
antenna:{label:`ANTENNA`,governs:[1,2,3,4],routings:[`1110`,`1011`,`1101`,`0111`],
dark:`0000`,television:{ytId:`aA5oKoCRjWw`,seconds:1743,title:`Television`}, …}
```

## 3. THE FOUR READINGS — MEASURED ON THE PAGE

The packet asked for `0111`, `1011`, `1110` beside `1101` to settle direction and
rule out an off-by-one. All four, driven through the panel's own controls (roll
the drum, step the DIP, press the latch) and read off the panel's own readout and
the event the latch dispatches. **Development stage, current `main`, the same
source the shipped chunks were built from.**

| DIP | ch 1 | ch 2 | ch 3 | ch 4 |
|---|---|---|---|---|
| `1110` | television | television | television | **SIGNAL PRESENT** |
| `1011` | television | test signal | television | television |
| `1101` | television | television | **SIGNAL PRESENT** | television |
| `0111` | test signal | television | television | television |

**The zero and the channel line up in all four.** The machine is on 3 under
`1101` and nowhere else; the two dead NIAC channels fall to the test signal when
the zero lands on them, which is the declared behaviour (`arms:false` → `test`).
There is no reversal and no off-by-one to fix.

**AND THE LATCH AGREES WITH THE LAMP.** Every television cell dispatched
`kind:"television"` with `ytId aA5oKoCRjWw` and a wall-clock second; `1101 ch3`
dispatched the machine's own payload (`preset: standard` → the twin); the two
test cells dispatched `kind:"test"`. The readout is not narrating a different
decision from the one the door acts on.

## 4. TELEVISION — THE FOUR QUESTIONS, ANSWERED IN ORDER

**Did the player build? ONE IFRAME, and it is the right one.** Latching `1101`
channel 1:

```
host   www.youtube-nocookie.com
allow  accelerometer; autoplay; clipboard-write; encrypted-media; …
title  Assorted 1960s TV Commercials
vars   autoplay=1  controls=0  disablekb=1  rel=0  playsinline=1  enablejsapi=1
size   1690 × 810
```

The `allow` attribute is there, which is the thing the hand-written iframe could
not have and the reason the hook won the ruling.

**Does the resolver reach the television branch?** Yes — on every cell carrying a
1, in all four routings. It does not fall through to the test signal.

**IS SOURCE THE GATE? NO, AND IT COULD NOT HAVE BEEN.** Measured at SEEDED, all
four channels:

```
ch1..ch4 | dial=SEEDED | DIP=0000 | NOT ARMED
         | "no seeded feed on file — the lamps read the seed,
            and there is nothing to read"
```

At SEEDED **the DIP itself goes `0000`** — the panel cannot show `1101` in that
state — and the latch refuses in words. So the state Mike describes (a DIP
reading `1101`) is a LIVE state by construction, and there is no silent decline
here to fix. The dial does its half and says so.

**Is `aA5oKoCRjWw` still embeddable?** Yes. A bare player built against the id
from a real origin fired **`onReady`, no `onError`**, and returned
`title "Assorted 1960s TV Commercials"`, `video_id aA5oKoCRjWw`,
`getDuration() 1744`. Given last week's dead source, this was checked with the
error event rather than with a rendered frame.

*Measurement worth keeping:* the player reports **1744s** where the data declares
`seconds: 1743`. The phase spacing is 581.0s against 581.3s — a third of a second
across a 29-minute reel. Not a defect; noted so a later round does not read it as
one.

## 5. WHAT I COULD NOT MEASURE, AND WHY IT IS THE HALF THAT MATTERS

**This automation host keeps every tab at `document.visibilityState: "hidden"`.**
Chrome does not start video in a tab it is not showing. Measured, after a latch:

```
player state −1 (UNSTARTED)  ·  currentTime 611  ·  muted true  ·  .tv-tap present
```

The muted-fallback path in `Television.jsx` **fired correctly** — `setMuted(true)`
ran and the sound catcher appeared — and the picture still did not start, because
the tab is hidden. The fallback's timer also runs at background throttle
(~1000ms, not 350ms), so it lands at ~5s rather than 1.75s; a first reading at
3 seconds says "the fallback never ran" and is wrong. I nearly filed that.

**So: I can prove the set is BUILT and TUNED and I cannot prove it MOVES.** That
is exactly the link Mike is reporting on, and no probe on this host can close it.

## 6. THE BOOT — FILED

**The boot COMPLETED**, which answers the previous session's open question: the
ceremony does reach the level-specific section, and the 89-second stall was the
harness, not the twin. Filed as an `OPERATIONS.md` §8 row rather than left in a
round log, because a stalled harness and a stalled ceremony are indistinguishable
from the outside and the only oracle is a person in a foreground tab.

## 7. TWO SMALLER FINDINGS

**The Portal needs `/admin` once per SESSION, not once per browser.** `heldOpen()`
in `src/lib/held.js` reads a **sessionStorage** flag; the thirty-day cookie only
satisfies the worker. On live, with the cookie present and `/api/held` answering
`{open:true, served:true, stage:"launch"}`, `/robots` still drew **one album with
the arrow disabled** until the session flag was set. Working as designed — noted
because "the Portal is missing" and "this is a new tab" look identical.

**sessionStorage is refused for `http://` origins in the Chrome profile Ops
drives.** `SecurityError: Access is denied for this document`. The museum wraps
every accessor and degrades honestly, so nothing broke — but it means the panel's
remembered state cannot be exercised from here, and it is why the launch bundle
could not be driven through a local static server.

## 8. WHAT IS WAITING ON MIKE

Three questions. The first is the one that decides the round.

1. **When MGK-VIIIp came up, what was engraved on the drum face you had rolled
   to — the number and the name together?** The number and the name are cut into
   the same brass face and come from one record, so `MGK-VIIIp` cannot appear
   beside a `1`. If the face read **3 MGK-VIIIp**, the drum and the routing are
   both right and what moved is somewhere else entirely. If it read **1 MGK-NIAC**
   and the machine still opened, the fault is in the latch and I know where.
2. **On the channels that should have carried television, what filled the frame —
   black, a YouTube poster with a red play button, or the machine?** A poster is
   the browser refusing autoplay. Black is the player never building. The machine
   is the latch taking the wrong door. Three different faults, one screen apart.
3. **Was SOURCE on LIVE, and had the page been reloaded since the 14:54 deploy?**

---
---

# ROUND 2 — DRIVEN ON THE DEPLOYED SITE, NOT A LOCAL BUILD

The first pass was measured on a dev server built from the same source. This one
was driven on **weird.baby itself**, on the panel Mike uses, with the `/api/held`
door already open in the profile Ops drives (`{open:true, served:true,
stage:"launch"}` — the cookie was already in the browser; no key was entered, and
the session view-flag `wb-held-open` was set so the router would ask for the
chunk the server already grants).

## THE CHUNK IS THE DEPLOYED CHUNK — SHA256, NOT A HASH-NAME INFERENCE

```
https://weird.baby/assets/tokens-D8JH1Pu4.js   133,206 bytes
sha256 78076D8B4AE2E0B7C50866638107F5132C295424F4E82085A39995D6C6108B5C
local dist/client/assets/tokens-D8JH1Pu4.js     133,206 bytes
sha256 78076D8B4AE2E0B7C50866638107F5132C295424F4E82085A39995D6C6108B5C
IDENTICAL
```

## THE PANEL ON THE LIVE SITE IS THE OLD PANEL

Read out of the live DOM, not from a mock:

```
drum faces  1MGK-NIAC 2MGK-NIAC 3MGK-VIIIp 4MGK-VIIIp (zoom)
            5COLD START 6FIRST RUN 7LAST STATE 8TEST BENCH   (eight)
switches    AUTO MAINT · AT PROMPT                            (both bats)
badge       ABEAL                                             (the stamp)
antenna     .ip-ant present, cells 1 2 3 4
```

**The ANTENNA bay is rendered by `Exhibit.jsx`'s `InstrumentPanel`, inside the
same `.ip-deck` as that drum, those switches and that badge.** It is not a
separate object and there is no second panel in the tree. The rebuild
(`docs/panel-rebuild-20260821/panel.html`) is a standalone static file whose DIP
defaults to `1111`, carries **no resolver at all**, and is imported by nothing.
**The television resolver was not built against the rebuild's shape**, and the
puzzle does not depend on the rebuild shipping.

## ALL SIXTEEN CELLS, ON THE LIVE SITE

Driven through the panel's own controls; readout read off `.ip-readout`; the
"opens" column is the payload the latch actually dispatched.

```
1110 ch1 -> TV      / television          1101 ch1 -> TV      / television
1110 ch2 -> TV      / television          1101 ch2 -> TV      / television
1110 ch3 -> TV      / television          1101 ch3 -> SIGNAL  / twin.html
1110 ch4 -> SIGNAL  / CLOSE_UP.png        1101 ch4 -> TV      / television
1011 ch1 -> TV      / television          0111 ch1 -> TEST    / test
1011 ch2 -> TEST    / test                0111 ch2 -> TV      / television
1011 ch3 -> TV      / television          0111 ch3 -> TV      / television
1011 ch4 -> TV      / television          0111 ch4 -> TV      / television
```

**Sixteen of sixteen correct.** And the discriminator that settles the second
report: **exactly ONE cell in the whole panel yields `SIGNAL PRESENT.` together
with `twin.html`, and it is `1101 / channel 3`.** Channel 4's machine cell opens
a `.png`, not the twin; every other governed cell opens television or the drawn
test signal. The reported combination identifies the drum position on its own.

## TELEVISION OPENS ON THE LIVE SITE

`1101`, glass reading `1 | MGK-NIAC`, latched:

```
.tv-root present            iframes: 1
host  www.youtube-nocookie.com   path /embed/
allow accelerometer; autoplay; clipboard-write; …
title "Assorted 1960s TV Commercials"
document.documentElement.innerHTML.includes('youtube-nocookie') === true
```

**Still unmeasured, and still the one link that matters: whether the picture
MOVES.** The tab is hidden on this host and Chrome will not start video in a tab
it is not painting. Built, tuned and cued is proved; playing is not.

## THE GLASS AND THE CODE AGREE — PHOTOGRAPHED, AFTER SETTLING

Both readings taken with the drum fully at rest and no click for >1.2s:

| DIP | glass (zoomed screenshot) | readout | latch opens |
|---|---|---|---|
| `1101` | `3 \| MGK-VIIIp` | SIGNAL PRESENT. | `twin.html` |
| `1101` | `1 \| MGK-NIAC` | TELEVISION ON THIS CHANNEL. | youtube-nocookie |

### AND THE PROBE THAT SAID OTHERWISE WAS WRONG — THE TRAP IS WORTH KEEPING

A `getBoundingClientRect()` heuristic for "which face is at the front of the
barrel" reported an **off-by-one between the glass and the code**, twice, with
two different offsets (+1 and −2) at two drum positions — and returned
*identical geometry* at both, which is what gave it away. A second probe read
`getComputedStyle(...).transform` **mid-transition** (the drum has
`transform .42s cubic-bezier(...)`) and reported a `matrix3d` for 45° while the
style attribute held the target 90°, which read as *the drum moved on its own
with no input*. Neither was real.

**THE RULE: `getAttribute('style')` is the TARGET, `getComputedStyle` is the
INTERPOLATED VALUE, and on an animated element they disagree for 420ms.** Every
state measurement in the tables above used the style attribute and is sound;
every visual claim was re-taken after the transition finished. **The readout and
the dispatch are React state and are correct immediately — only the picture
lags**, which is exactly why a screenshot taken during the roll can contradict a
correct panel.

## BUG 1 — THE COLLISION, CONFIRMED ON THE GLASS

Read out of the twin's own DOM (same origin, so the iframe is readable) while
the panel sat at `1101 / channel 3`:

```
#monlayout > .chy  ->  "1" (class "chy chydown")   "2"  "3"  "4"   "X" (chy-x)
```

`chydown` is the pressed/current state. **The twin says 1 while the panel says
3.** Source, `tools/viiip_twin.html` `Mon_Controls_In()`:

```js
b.setAttribute("onclick","devLayout("+i+")");
b.title = (i===1) ? "feed 1 - the family shot"
                  : "feed "+i+" - no signal (test pattern + hum)";
```

**They are not channels. They are the monitor's four device LAYOUTS, of which
exactly one carries a picture** — and the fifth position is the way out (`X`,
Mike's S4 ruling, 2026-07-30).

**AND THE COLLISION IS THE WORD, NOT ONLY THE NUMBER.** Three surfaces already
say *feed*:

| surface | word | numbering | what "3" means |
|---|---|---|---|
| QC_101, Record 004, published | `ANTENNA FEED ASSIGNMENT` · `BROADCASTS ON ... FEED NO. 3` | — | the machine's assignment |
| the Portal panel drum | legend **`FEED`** | 1–8 | `3 \| MGK-VIIIp` ✔ |
| the twin's own strip | `feed n` in every button title | 1–4 | a dead layout |

So the puzzle's payoff — *get the zero onto FEED 3* — is contradicted by the
machine itself at the moment of reward, in the same noun, one screen later.
**The glass wins, because the glass is what a person looks at.**

