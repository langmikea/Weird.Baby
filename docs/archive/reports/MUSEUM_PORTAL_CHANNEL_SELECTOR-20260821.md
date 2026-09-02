# THE CHANNEL SELECTOR — SCOPING. REPORTED, NOT BUILT.
2026-08-21 · the last structural piece of the Portal

**THE RULING:** the screen's four buttons select channels 1–4; what draws is
whatever that channel resolves to, **through the resolver the panel already
uses**. Mike: *"Channels are selected on the portal screen, along with shake,
power, etc."*

**ONE THING DECIDES THE BUILD AND IT IS NOT ON THE LIST OF FIVE.** The strip
lives inside `twin.html`; the museum's overlay draws the twin, the television
and the test signal as **three mutually exclusive branches**. Leaving the machine
**unmounts the document the buttons are in**. A selector that lives only in the
twin can go to television once and can never come back. §0.

---

## 0 · THE BLOCKER — THE SELECTOR CANNOT LIVE ONLY IN THE TWIN

`RobotsExhibitFlow.jsx`, the overlay render, is a three-way ternary:

```jsx
{twin && twin.kind === "test"       ? <div style={S.iframe}><TestSignal …/></div>
 : twin && twin.kind === "television" ? <div style={S.iframe}><Television key={…} …/></div>
 :                                      <iframe src={twin.src} …/>}
```

The `<iframe>` and `<Television>` are **siblings in a ternary**, so React unmounts
one to mount the other. Today that is correct and deliberate — *ONE OUTPUT. A
TELEVISION IS NOT A TRACKLIST* — and `Television.jsx` leans on it: its unmount
`destroy()`s the player so two sets can never play at once.

**The consequence for this build:** press `1` while watching the machine and the
twin — and its strip — cease to exist. `TestSignal` and `Television` have no
strip of their own. **The visitor lands on television with no way to choose a
channel**, and the only way back is Escape and the panel.

**Three shapes. This is the decision; Ops does not pick it.**

| | shape | what it costs |
|---|---|---|
| **A** | **The strip becomes the OVERLAY's control**, drawn by the museum over all three kinds. | The honest one, and it still satisfies the ruling: the overlay *is* the portal screen. Costs a second strip that must match the twin's bezel exactly, or drift. The twin keeps its own strip **standalone only**. |
| **B** | **Keep the twin mounted always**, hidden behind television/test. | No second strip, no drift, and the machine genuinely *waits* (§5). Costs the ONE OUTPUT guarantee — a live twin behind a live television is two things running; the twin's hum would have to be silenced on the way out, by hand, and nothing would enforce it. |
| **C** | **One-way trip.** Leaving channel 3 ends channel selection until the panel is used again. | Nothing to build beyond the message. But it makes three of the four buttons a trapdoor, which is not what "select which channel you watch" means. |

**Ops' reading, offered not taken: A.** It is the only one where the control
exists wherever the ruling says it exists, and B trades a structural guarantee
for a saved component.

---

## 1 · HOW A BUTTON INSIDE THE IFRAME REACHES THE RESOLVER

**THE CONTRACT TODAY IS TWO WORDS AND IT ALREADY RUNS BOTH WAYS.**

- **museum → twin:** the query string, at load. `?user=1`, `?preset=<id>`,
  `?day=<n>`. Chosen over postMessage because *"a query string survives the
  iframe boundary, a reload inside the overlay, and being copied into a link."*
- **twin → museum:** `postMessage({wb:"portal-close"})` from `Portal_Close()`,
  received by `onMsg` in `RobotsExhibitFlow.jsx`. Origin unchecked **and the
  reason is written down**: the twin is same-origin by construction
  (`/held/robots/twin.html`).

**SO THE THIRD WORD IS `{wb:"portal-channel", ch:n}` AND THE LISTENER ALREADY
EXISTS.** It is one branch in a function that is already there. This is the
cheap half.

**THE EXPENSIVE HALF IS THAT THE FLOW CANNOT RESOLVE A CHANNEL.** The resolver's
inputs — `drum`, `ANT`, `antIdx`, `dial`, `swOn` — are **local React state inside
`InstrumentPanel` in `Exhibit.jsx`**. `RobotsExhibitFlow` deliberately knows
nothing: the panel hands it a fully-resolved payload and *"the engine still
learns nothing about what any of them are."*

| | shape | verdict |
|---|---|---|
| **(a)** | **The flow re-broadcasts; the panel answers.** `postMessage` → the flow dispatches a window event (`wb-robots-select-channel`, `{ch}`) → the panel listens, rolls its drum to that channel, and dispatches the **same `wb-robots-open-twin` payload it already builds**. | **Recommended.** One resolver, untouched. The seam stays a seam. Arming stays one rule in one place. And the drum FOLLOWS, so the panel and the screen cannot disagree — which is the failure the last round was spent on. The panel stays mounted behind the overlay (measured: `.ip-latch` still boxes while the twin is open), so it can hear. |
| **(b)** | Lift the antenna/drum state out of the panel so the flow can resolve. | **Argue against.** It breaks the doctrine at the head of `InstrumentPanel` — *arming is ONE RULE IN ONE PLACE* — and buys nothing (a) does not. |

**ONE CONSEQUENCE OF (a) WORTH MIKE'S EYE:** picking a channel on the screen
**moves the drum behind the overlay**. That is the right default — two
instruments that disagree about which channel you are on is the exact fault we
just chased — but it does mean the screen can drive the panel, which is a new
direction of travel for that seam.

**AND A CHANNEL THAT WILL NOT ARM MUST SAY SO ON THE SCREEN.** The panel refuses
in words (`.ip-refusal`) and the visitor cannot see the panel while the overlay
is up. A silent dead button is the silent decline the doctrine forbids.

---

## 2 · WHAT HAPPENS TO `devLayout` — NOTHING IS DEAD, AND NOTHING SHOULD BE DELETED

`devLayout(n)` is a one-line alias: `function devLayout(n){ Feed_Select(n); }`.
`Feed_Select` does **five** real things, and they do not all have the same fate:

| what it does | fate |
|---|---|
| `monFeed = n`, `chydown` on the pressed button (*inverse video = ON AIR*) | **KEEP.** Whatever drives the strip still has to light the right button. |
| **n===1 → the family shot** (`.monimg` shown, `#feedtest` hidden, hum OFF) | **KEEP — it is the machine's own picture.** Channel 3 *is* the machine, and this is what its monitor shows. |
| **n>1 → the drawn no-signal card + `body.nosignal` + hum ON** | **KEEP, but it stops being reachable in the museum.** A dead channel now resolves to the museum's `TestSignal.jsx`. This becomes the **standalone** path. |
| **`FEED_PROFILE` weather** — per-feed quality `q`, wobble, drift, glitch rate, seeded once per session (`FEED_WEATHER_KEY`), profiles for feeds **1–5** | **WATCH IT.** `monFeed` is read by the glitch system at two other sites. If the buttons stop calling `Feed_Select`, `monFeed` pins at 1 for ever and the weather quietly collapses to one profile. Not dead — **changed**, and it must not change silently. |
| `Dev_Ack("FEED n", …)` acknowledgement line | Dev surface; follows whatever calls it. |

**THE TWO TEST SIGNALS ARE DELIBERATE AND STAY THAT WAY.** `TestSignal.jsx`
re-implements the card and the hum rather than reusing the twin's, and its header
says why: **the twin IS MGK-VIIIp**, so its card is *the machine's own monitor*,
and *an iframe has no user activation, so its AudioContext would start suspended
and the hum simply would not sound*. The constants are read off `Hum_Start()` and
carry a do-not-tune-here note. **A round that "de-duplicates" these has
misunderstood both.**

---

## 3 · STANDALONE — THE TWIN MUST STILL WORK WITH NO MUSEUM

**THE PRECEDENT IS `X` AND IT IS THE RIGHT ONE:**

```js
if (window.parent && window.parent !== window) { postMessage(…); return; }
chip("ok","[X] close is for the portal frame - standalone there is nothing to close");
```

**Detect the parent; if there is none, say so rather than pretending.**

**THE HONEST ANSWER: standalone there are no channels.** There is no antenna, no
routing, no television and no panel — a channel is a thing the Portal has, and
standalone the Portal is not there.

| | shape | verdict |
|---|---|---|
| **(i)** | Standalone the buttons keep calling `Feed_Select` (views); in the museum they post a channel. | Works, and it is one `if`. **But it gives ONE control TWO meanings depending on context** — the same class of thing that made a `1` read as a channel this week. If shape **A** is taken this is moot: the twin's strip is simply not shown inside the museum, and the two strips never have to mean two things at once. |
| **(ii)** | The buttons are inert standalone, with a chip, exactly like `X`. | Loses the family shot and the no-signal card as reachable objects standalone, which §2 says are real. **Argue against.** |

**With shape A, (i) stops being a compromise and becomes the design:** the twin's
own strip is the machine's bezel and means views; the overlay's strip means
channels; they are never both on screen.

---

## 4 · `X` — WHAT IT DOES, AND WHAT IT SHOULD DO

**TODAY:** `Portal_Close()` posts `{wb:"portal-close"}`; the museum's `closeTwin()`
tears the overlay down and the panel is behind it. Standalone it chips. It is
**the only close affordance** — the museum-side button was retired by Mike's S4
ruling — plus Escape.

**RECOMMENDATION: UNCHANGED.** `X` means *leave the Portal*, not *leave this
channel*, and closing already lands the visitor on the instrument that chooses
channels.

**TWO THINGS TO SAY OUT LOUD:**

1. **`X` sits in the same strip as the channels**, so once 1–4 are channels it
   will read as *the fifth position — off*. On a 1965 television that is
   **right**, and it is how S4 already framed it: *"the fifth position becomes
   the way OUT."* Worth Mike confirming rather than inheriting.
2. **Under shape A, `X` must move to the overlay strip with the others**, or the
   way out disappears the moment you leave the machine — the same trap as §0,
   applied to the exit. **Escape would still work, and would be the only thing
   that did.**

---

## 5 · CHANNEL 3 → CHANNEL 1 → CHANNEL 3: WHAT IT COSTS

**MIKE ALREADY ANSWERED THIS, IN JULY, FOR THE OVERLAY-CLOSE CASE — AND CHANNEL
SWITCHING IS THE SAME CASE.** `PORTAL_RECIPES`:

```js
"standard": { resume:true, power:"on", level:2 },
```

> *"RESUME IF THIS VISIT ALREADY HAS A MACHINE … when it takes, the machine is
> brought up **WITHOUT the boot ceremony** — it did not stop being a machine when
> the overlay closed, and making it perform its own install again on the way back
> would be the lie, not the shortcut."*

**SO: THE DOCUMENT REBOOTS. THE MACHINE DOES NOT.**

- The iframe unmounts, so `twin.html` is **torn down and re-fetched** on return.
- On load, `resume:true` reads `wbr_portal_session` (sessionStorage: `powered`,
  `booted`, written by `osTick` — *by the machine simply running*). Mark present
  → `unitPowered = true`, **straight to the menu, no ceremony**.
- **Survives** (all sessionStorage, all same-origin): the visit mark, the feed
  weather seed, the portal size.
- **Does not survive:** everything in-page — which menu you were in, scroll
  position, any run in flight. **It comes back powered and booted, but not where
  you left it.**

**THE DEGRADATION PATH THAT MUST BE NAMED.** `Visit_Mark_Read()` is wrapped in
try/catch and returns `null` when storage is refused — and storage **is** refused
in some real browsers (measured this week on a plain `http://` origin in the
profile Ops drives: `SecurityError: Access is denied for this document`). With no
mark, the recipe falls to *"no mark this visit — the returning machine"* and
**the full ceremony runs on every single channel change.** That is precisely the
object Mike said would be a different object.

**WHICH MAKES §0 SHAPE B WORTH MORE THAN IT LOOKS.** A twin that is never
unmounted does not reboot at all, for anyone, storage or no storage — it genuinely
*waits*. The price is the ONE OUTPUT guarantee, and that price is real: nothing
would enforce silence on a live machine sitting behind a live television.

**Ops' reading, offered not taken:** take **A**, and accept the document reload,
because `resume` already makes the *machine* wait and that was the thing Mike
was protecting. If the reload turns out to be visible — a flash, a re-layout, a
lost menu — **B is the fallback and the reason to reach for it is measurable, not
theoretical.**

---

## WHAT IS WAITING ON MIKE

1. **§0 — A, B or C.** Everything else follows from it.
2. **§4.1** — is `X` the fifth position, *off*?
3. Confirmation that **picking a channel on the screen moves the drum** (§1).

Nothing here is built. No file in `src/` or in the robots repo was changed.
