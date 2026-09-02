# TWO BEZELS, THE STILL CONTROLS, AND THE UNIT THAT KEPT REBOOTING — 2026-08-27 (sixth packet)

**Built from `8d32319` on the same day's uncommitted work. Nothing committed,
nothing pushed, nothing deployed.** Three findings, all measured before anything
was changed.

---

## 1 · THE UNIT REBOOTED ON EVERY CHANNEL CHANGE — CAUSE, THEN FIX

**MIKE: "Changing channels should not cause a VIIIp reboot. These are to be
different camera views of the same live unit."** And on whether that reaches the
television channels: **"running regardless of how you spent your time."**

### THE DEFECT, MEASURED FOUR TIMES BEFORE IT WAS TOUCHED

Stamping the twin's `window` with a random value and reading
`performance.timeOrigin` back on each switch:

| | timeOrigin | stamp | uptime |
|---|---|---|---|
| opened on CH3 | …716505 | `xnnmyc` | 3.6s |
| → CH4 | …**720121** | `000jes` | **3.6s** |
| → back to CH3 | …**723741** | `a9ewxt` | **3.6s** |
| → back from television | …**730378** | `1th65m` | **3.6s** |

**A new origin, a new stamp and an uptime of 3.6 seconds every time.** The
document was new on every switch. The unit was rebooting each time he looked
away.

### TWO CAUSES, BOTH IN ONE LINE OF JSX

The twin was the last branch of the same ternary as television and the test
card, with `src={twin.src}`:

1. **CH3 → CH4 changed the `src`** — channel 4 carried `&view=closeup`, and a
   changed address is a document load.
2. **CH3 → television UNMOUNTED the element** — the ternary swapped it for
   `<Television>`, so coming back built a new one.

### THE FIX — AND IT REMOVES THE REBOOT RATHER THAN HIDING IT

**THE FRAME LEFT THE TERNARY.** Once a machine channel has been opened the
element stays in the tree for the rest of the visit, and the other kinds render
**over** it. `.ps-machine--behind` drops it to `z-index:-1`; the branch that used
to hold it now ends in `null`.

**IT IS COVERED, NOT `display:none`, AND THAT IS THE LOAD-BEARING CHOICE.** The
machine's clocks are `setInterval` — `osTick` at 50ms, `refreshChrome` at 200ms,
the feed glitch at 760ms — and a frame that leaves the render tree is a frame a
browser is free to stop servicing. **`display:none` would have been the version
that looks fixed while the unit quietly stops**, which is the shape CH3's resize
was "fixed" in once before and came back. Stated here because it is the
temptation, not because it was taken.

**THE VIEW BECAME A MESSAGE.** `?view=` was an ADDRESS and therefore a reload;
`{wb:"portal-view", view}` is a word to a running machine. `twin.html` answers it
by swapping one `img.src` and toggling one class — **the camera moved, the
emulator was not touched.** `?view=` still sets the OPENING view and a twin
opened directly is exactly what it was.

**A PRESET CHANGE STILL RELOADS, AND THAT IS CORRECT.** The `src` is a function
of the preset alone. A bank is a START MODE — `PATCHED`, `COLD START`,
`FIRST RUN` — and those recipes exist to boot the machine differently. Changing
the camera must not reboot it; changing how it starts must.

### VERIFIED — ONE UNIT, FIVE CHANNEL CHANGES

| | stamp | uptime | plate | covered |
|---|---|---|---|---|
| opened on CH3 | `mtsfly` | 3.6s | family shot | no |
| → CH4 | **`mtsfly`** | **6.1s** | close-up | no |
| → back to CH3 | **`mtsfly`** | **8.6s** | family shot | no |
| → television | **`mtsfly`** | **11.1s** | family shot | **yes** |
| → CH4 from television | **`mtsfly`** | **13.6s** | close-up | no |

**One stamp, and the uptime climbs monotonically.** It has been running the whole
time and they were looking elsewhere.

---

## 2 · TWO BEZELS — HIS PLATE ALREADY HAS THE FRAME IN IT

**MIKE: "CH4 is showing two bezels."**

### THE CAUSE, MEASURED ON THE TWO FILES

Sampling both images at mid-height, **where `MGK-TWIN_MONITOR_SCREEN_BEZEL.png`
is opaque the close-up's pixels are identical to it**:

```
x      0     50    100   150   200  …  2800  2850  2900  2950
plate  31    32    41    33    18   …  26    60    65    20
bezel  31    32    41    33    18   …  26    60    65    20
```

and the alpha runs match to the pixel — opaque `1..224`, the opening, opaque
`2769..2989`. **His close-up plate is the museum's bezel with the picture
composited into the opening, in one file, registered at 1:1.**

**SO THE 4:3 ENLARGEMENT PUT TWO FRAMES ON THE GLASS.** `place:"canvas"` scales
the picture to 3200 wide at x −100 — **1.0667×** — while `.ps-bezel` stays at
1.0. His copy of the frame and the museum's stopped coinciding, and both edges
showed. Compositing the two exactly as the page does and walking inward from the
opening's edge finds it: dark (19, 23) at the museum's frame, then a **bright
band at 172–248** where his frame sits, then the picture at 11–12.

**Nothing was wrong with either object. They were drawn at two scales.**

### THE FIX

`exact: true` on the channel-4 row → the plate is drawn on the canvas rect
untouched, so its built-in frame lands exactly under the museum's and the two
read as one.

**THE PORTAL'S BEZEL IS NOT SUPPRESSED**, and it did not need to be: the
standing rule that the frame belongs to the Portal is untouched, and his copy
simply stops being visible because it is exactly where the museum's is.

**THE 4:3 RULING IS NOT REVERSED.** It exists for a picture that has no opinion
about the canvas — television, the test card, the family shot — and every one of
those still gets it. **A plate cut on the bezel's own canvas is not FITTED to
the opening, it is REGISTERED with it**, and enlarging a registered picture is
the one operation that can only break it.

**VERIFIED SERVED:** CH4's feed box is **100.00% of the frame at 0.00% offset**;
CH3's is **106.67% at −3.33%**, unchanged.

---

## 3 · THE CONTROLS STOOD STILL — AND IT IS HIS OWN T7 DEFECT, ONE LAYER OUT

**MIKE: CH3/CH4 controls are not responding to screen jitters.**

**HE RULED THIS ONCE ALREADY.** T7, 2026-07-29: *"the stutter glitch moves
everything EXCEPT the control panel — the control panel must move WITH the
glitch (the controls are part of the feed; only the bezel is the real world)."*

**THE FIX THEN WAS STRUCTURAL AND IT STILL HOLDS INSIDE THE TWIN:** `#feedgroup`
was made to hold the picture, both glass apertures, the chyron and the snow
plane, so every glitch moves one element and nothing can be left behind.

**THEN THE CHYRON LEFT THIS DOCUMENT.** On 2026-08-26 the bezel and the buttons
became the museum's — his own ruling — and the controls became siblings of the
moving group again, **one layer further out than where T7 fixed it.** The same
defect, reintroduced by a migration, which is why it reads as new and is not.

### THE FIX, IN T7's OWN SHAPE

**The museum cannot see inside the frame, so the machine reports its own
displacement.** `{wb:"portal-jit", dx, dy}` on every sync bump, vertical-hold
roll and machine jitter, and `0,0` when the group settles — posted only on a
change, like `portal-power` beside it. **This adds no second transform**: it
reports the one T7 already made structural.

Two sources compose into one offset — the twin's glitch and the museum's own
tear slip — and both control groups take it. **The buttons carry no transform at
all** (the barrel is a filter, for exactly that reason), so this is the only
transform in the chain.

### VERIFIED, BOTH SOURCES, AND THE BEZEL HELD STILL

| | picture | `.ps-ctl` | `.ps-strip` | **`.ps-bezel`** |
|---|---|---|---|---|
| at rest | none | none | none | none |
| twin's glitch (forced) | — | **translate(1px, 0px)** | **translate(1px, 0px)** | — |
| museum's tear (CLICK) | `translateX(7px)` | **translate(7px, 0px)** | **translate(7px, 0px)** | **none** |
| after | none | none | none | none |

**The bezel does not move, inline or computed.** That is the other half of T7 and
the PORTAL REVELATION in one line.

**AND THE HIT AREAS TRAVEL WITH THEM**, because it is a `transform`: the controls
stay under the finger while they shake, which is what being part of the feed
means.

---

## 4 · GATES

| gate | result |
|---|---|
| `npm run lint` | **9 errors / 7 warnings — baseline, zero new** |
| `npm run build` · `build:launch` | green · green |
| `npm run provenance:gate` | **PASS** — 1 added (`portal-view`), 1 pruned |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers:gate` | **PASS** |
| `npm run reveal:day` | nothing to move |

---

## 5 · WHAT IS OPEN AFTER THIS

- **`MF-a`** — his close-up composite has an unfilled lower-right panel and
  unread embossed lettering. **Now more visible than before**, because the plate
  is drawn 1:1 rather than enlarged 6.67%.
- **`MD-c`** · **`MD-d`** · **`MD-b`** · **`MD-a`** · **`MC-c`** · **`ME-b`** —
  unchanged.
- **NEW `MG-a`** — the machine is now mounted for the whole visit and merely
  covered while another channel shows. **That is one live emulator running
  behind a television**, which is correct to the fiction and is a cost nobody
  has measured: `osTick` runs at 50ms whether or not anyone is looking.
