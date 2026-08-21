# THE ANTENNA SELECTOR — built, 2026-08-21

**NOTHING IS WAITING. Both questions below were put to Mike in the round and he
ruled both; the second half of this file is what was built on his rulings.**

**§1 AND THE `televisionSrc` ROWS IN §3 ARE THE STATE BEFORE THOSE RULINGS AND
ARE KEPT AS THE RECORD, NOT AS A DESCRIPTION OF THE TREE.** They are what Ops
measured and reported before he answered; the tree now matches
**THE TWO RULINGS** at the foot of this file. Read that first if you want to know
what the code does.

---

## 1 · WHAT WAS PUT TO MIKE (superseded — see THE TWO RULINGS below)

### (a) TELEVISION DOES NOT AUTOPLAY, AND THE POSTER IS WORSE THAN EITHER FIX

Measured on the page: the latch opens the channel and YouTube draws **its own
poster, the video's title, the channel name and a red play button**. The frame is
correct — `start=1115` on a 1743 s reel, mid-broadcast — it is simply paused.
Browsers refuse unmuted autoplay without engagement with the origin.

**`autoplay=1&mute=1` DOES play**, proved in the same probe.

**But Mike's ruling A says, in its own words: "No autoplay flag, no muted start,
no play-then-pause — every one of those makes sound or motion for a frame."**
That ruling is about a video the visitor did NOT ask for. The latch is an
explicit request, so it may not bind here — **but Ops will not decide that.**

| option | what a visitor gets | cost |
|---|---|---|
| **as built** — autoplay, not muted | a YouTube poster, title, channel name, red play button; television after one press | the least 1965 thing in the wing sits on the Portal's glass |
| **`mute=1`** | 1960s television running the moment the channel opens | silent television — **and the DEAD channel would then be the only one with sound**, which is backwards |
| IFrame API + `unMute()` | autoplay muted, sound on first interaction | parameterises the hook /hr and /wal play every song through, in an antenna round |

**Ops recommends nothing here.** It is voice and it is his.

### (b) THE PORTAL FAQ NOW CONTRADICTS THE PANEL — ONE CLAUSE, NOT EDITED

> *"Is the mainframe on the Portal?" — "Not yet. Two channels are engraved for it
> on the feed drum and **neither of them arms**."*

**Channels 1 and 2 arm now.** They carry television or a test signal, and neither
is MGK-NIAC, so the answer's SUBSTANCE is untouched — only the mechanism it
reaches for. It is his sentence, so it is flagged and not rewritten. The minimal
repair is the clause: *"…and neither of them carries it."*

**Nothing ships wrong to a visitor: the Portal is HELD and nobody has read it.**

---

## 2 · THE TWO "REPORT BEFORE WIRING" ITEMS

### CHANNEL 4 — the priority ruling holds, confirmed against `portal.js`

Channel 4 is `{ id: "idling-updated", ch: 4, label: "MGK-VIIIp (zoom)",
arms: true, src: ".../MGK-TWIN_MONITOR_CLOSE_UP.png", frameTitle: … }`. Under
the priority, `arms: true` is read as *a machine is assigned to this channel* and
the per-position `src` is what that machine's signal opens. **Routed `1` it is
television; routed `0` it is the close-up. No drum position moved, no id moved,
no legend was recut.** Verified on the page at both routings.

### THE TWIN'S FIVE FEEDS AND THE PANEL'S EIGHT CHANNELS — THEY DO NOT MAP, AND THEY DO NOT NEED TO

**Plainly: there is no correspondence and inventing one would assert something
false.**

- The twin's strip is **FEED 1–5**, its own monitor selector: FEED 1 is the
  family shot, FEED 2–5 are no-signal. The panel's drum is **channel 1–8**, the
  antenna's. **FEED 4 is the chronic underperformer; channel 4 is the VIIIp
  close-up.** Same word, same digits, different objects, one inside the other.
- **The panel never needed a per-channel map.** It needed ONE state — *this
  channel is carrying nothing* — not four.
- **And the twin cannot supply that state honestly, because the twin IS
  MGK-VIIIp.** Its no-signal card is the machine's own monitor showing nothing on
  one of ITS feeds. Opening it to say *there is no unit on this channel* would
  put the machine on a channel the routing has just established it is not on —
  the one claim the whole puzzle turns on.

**Two smaller reasons, either of which would have cost a round:** the twin
accepts `preset`, `day` and `user` and has **no feed parameter**, so it could not
be told which feed to open on without editing a held 10,800-line document; and an
iframe is a separate document with **no user activation of its own**, so its
AudioContext would start suspended and the hum would simply not play.

**So the card is drawn by the museum and the hum is the twin's, to the
parameter** — 60 Hz sine, 120 Hz transformer bite, wobble 0.09 Hz / 0.010, drift
0.13 Hz / 0.55 Hz, read straight off `Hum_Start()`. Nothing was invented; the
sound is the machine's own bed, and a byproduct of a machine being on is exactly
right for a channel that works and has nothing on it. Drawn here, **the latch
press IS the gesture**, so the context resumes.

---

## 3 · WHAT WAS BUILT

| | |
|---|---|
| `src/data/artists/portal.js` | the `antenna` block — routings, governed channels, the television source, the readouts — and `store: "wb-portal-panel"`. **Held chunk; verified the YouTube id ships only in `assets/held/portal-*.js`.** |
| `src/routes/exhibit/Exhibit.jsx` | `resolveChannel()`, `televisionStart()`, `televisionPhase()`, `panelLoad/Save()`, the antenna bay, the arming rule, the readout, the three-payload latch |
| `src/routes/exhibit/Exhibit.css` | `.ip-ant*` — four cells cut into the panel |
| `src/routes/robots/TestSignal.jsx` + `.css` | the drawn monoscope and the hum |
| `src/routes/robots/RobotsExhibitFlow.jsx` | the overlay learns two payloads: `kind:"test"` (drawn) and `kind:"television"` (an id and a second) |
| `src/routes/exhibit/use-yt-player.js` | the one player hook, extracted and parameterised (second packet) |
| `src/routes/robots/Television.jsx` + `.css` | the set, and the sound catcher (second packet) |
| `provenance/register.json` | 17 rows |

**The engine stayed ignorant.** `InstrumentPanel` is imported by five wings and
one face declares a panel; a wing that declares no `antenna` draws none, exactly
as `p.ch != null` already worked for the channel numbers. The overlay is handed a
kind and an address and still knows nothing about portals or television.

---

## 4 · VERIFIED ON THE PAGE, NOT BY A GATE

**The puzzle, on channel 3 — the whole point of the round:**

| routing | channel 3 says |
|---|---|
| `1110` | TELEVISION ON THIS CHANNEL. |
| `1011` | TELEVISION ON THIS CHANNEL. |
| **`1101`** | **SIGNAL PRESENT.** |
| `0111` | TELEVISION ON THIS CHANNEL. |

**And the rest of the matrix:**

- ch1 @ `1101` → TELEVISION · ch4 @ `0111` → TELEVISION · ch4 @ `1110` → the
  close-up.
- **ch2 @ `1011` → `TEST SIGNAL. NO UNIT ON THIS CHANNEL.`**, FEED ARMED.
- **ch5–8 unchanged** — NOT ARMED, *"This feed is not available."*
- **SEEDED → the routing reads `0000`, NOT ARMED**, and the dial prints its own
  refusal. LIVE restores it. That is Mike's *"no signal on any channel"* with no
  new control.
- **The latch opens all three:** the twin, the set on
  `www.youtube-nocookie.com`, and the drawn card.
- **Escape closes a drawn channel** and the panel keeps its state.
- **Persistence: a full page reload restored drum 3, routing `1011` and both
  switches** from `sessionStorage`. All of it or none.

**THE PHASES ARE EXACTLY A THIRD APART, MEASURED.** Under `1011` the live
channels are 1, 3 and 4; the three `start` values read **1161 → 1742 → +583
across the wrap**, i.e. **581 s and 1162 s** against `1743/3 = 581`.

---

## 5 · THE RISK, ANSWERED — AND THE DISTINCTION IS VISIBLE

Mike asked for this verified on the page. It is:

- **A channel routed `0`** draws the monoscope — grid, circle, resolution wedge,
  greyscale ramp, centre cross, a scan texture and a rolling band — and hums.
- **A dead source** draws YouTube's own **"Video unavailable"** plate: a grey
  card, a warning glyph, a *Watch on YouTube* link, and silence.

**They are not confusable.** Photographed side by side in one page under
identical parameters.

**WHAT IS STILL TRUE: the museum cannot detect it from inside.** No gate can
see an embed refusal. The mitigation is that the failure is now *visible to a
visitor as a failure* instead of hiding inside a state that is supposed to look
empty.

---

## 6 · THE MEASUREMENT MIKE ASKED FOR — AND OPS' OWN PREDICTION WAS WRONG

The report before this round said a fifth bay would make *"the whole instrument
get smaller at every frame size."* **Measured, it does not shrink at either
width.**

| | natural height | frame height | **scale** | deck rows |
|---|---:|---:|---:|---:|
| desktop 1706px, with antenna | 547 | 594 | **1.0000** | 2 |
| desktop 1706px, antenna hidden | 569 | 616 | **1.0000** | 3 |
| 390px, with antenna | 567 | 592 | **1.0000** | 4 |
| 390px, antenna hidden | 483 | 508 | **1.0000** | 4 |

**Nothing is scaled and nothing is cropped.** The latch sits at 906–942 with the
frame bottom at 997, so it is whole at 390px with 55px to spare.

**THE COST IS 84px OF HEIGHT AT 390px AND NOTHING AT DESKTOP** — where the fourth
bay joins the existing row and the deck actually packs into two rows instead of
three. That reading is counter-intuitive, so it was taken three times (with,
without, restored) and restored identically.

**Why the prediction was wrong:** `fit` only bites when the panel is taller than
its frame, and in this layout the frame's available height tracks the content. It
never engages. **Legibility is unchanged at both widths** — no type got smaller,
because nothing got smaller.

*Method: `resize_window` does nothing on this host, so 390px was measured in a
same-origin iframe widened until `innerWidth === 390` exactly (394px of frame).*

---

## 7 · THE DEVIATION, NAMED

**`useYTPlayer` IS NOT REUSED.** The instruction said to reuse it; television is a
plain `<iframe>` on the nocookie host instead.

**What the instruction protects is honoured exactly:** the embed is
`youtube-nocookie.com`, and the `www.youtube.com` API-script split is not touched
**because no API script is loaded at all**. This path is strictly *less* than the
hook — one iframe on the stricter host, no `iframe_api` request, no
`googleads.g.doubleclick.net` call from the API.

**Why not the hook:** it is bound to the player bar's shape — fixed `playerVars`
with `controls: 1` and `autoplay: 0`, an `onEnded` contract, one container ref —
so reusing it means parameterising the hook /hr and /wal play every song through,
in a round about an antenna.

**What it gives up:** `seekTo` precision (`start` is integer seconds, ±1 s,
invisible at this scale) and programmatic control — which is exactly what
option (c) in §1(a) would need if Mike wants unmute-on-interaction.

---

## 8 · THE SOURCE FINDING, RE-PROVED — AND THE PROBE LIED ONCE ON THE WAY

`vBAcEqq7T4Q` was re-tested under the **exact television parameters**, against
`aA5oKoCRjWw` in the same page, same origin, same everything:

- **A → "Video unavailable."**
- **B → playing**, muted autoplay, captions running.

**The finding stands.** It is filed in `OPERATIONS.md` §8 as its own hazard row
beside the 20 Aug one, because the cause is different and the signature is
identical: **a video can be unembeddable with every public signal reading
healthy, and it is not always an age gate.**

**AND ONE THING WORTH MORE THAN THE FINDING:** swapping the dead id into the
museum's own overlay drew a **poster and a play button** — for about a second,
before the refusal resolved. A screenshot taken in that window says the video is
fine. **A rendered oracle still has to be read after it has settled**, and that
nearly reversed a correct finding. In `OPERATIONS.md` §8 with the rest.

*Also recorded so nobody re-runs it: the bare embed URL in a top-level tab
returns `Error 153`, which is a missing-origin artefact and is evidence of
nothing.*

---

## 9 · GATES

| gate | |
|---|---|
| `npm run lint` | **9 / 8 — baseline, zero new** |
| `npm run build` · `build:launch` | green · green |
| `npm run provenance:gate` | **PASS** — 15 new rows |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** |
| `npm run docs:numbers` | **PASS** |
| `npm run reveal:day` | nothing to move |
| `npm run assets:orphans` | **13 — unchanged (M9)** |
| held-chunk check | **the YouTube id ships only in `assets/held/portal-*.js`**; no public chunk names a held path |

---

## 10 · BREADCRUMBS

| fact | filed |
|---|---|
| the mechanic, the routings, the priority | `docs/canon/06-PORTAL.md` **§9** |
| channels 1 and 2 now arm; the FAQ clause | **§9.1**, with the flag in a blockquote |
| the test signal, and why not the twin's | **§9.2** |
| the twin's 5 feeds ≠ the panel's 8 channels | **§9.2** |
| a video can be unembeddable with healthy signals | `OPERATIONS.md` **§8**, new row |
| a rendered oracle must be read after it settles | same row |
| the antenna in the concordance | `docs/canon/INDEX.md` |

---
---

# THE TWO RULINGS — applied the same day

**Both are built and verified. Nothing is waiting.**

## R1 · TELEVISION PLAYS — option C, the hook parameterised

**MIKE:** *"They turned the TV on. Whatever channel it is on is playing.
It's 1965!"* and *"Same/data… Small invest, pays back HUGE. That is why the thing
is even there to be reparameterized."*

**WHAT MOVED:** `useYTPlayer` now takes `playerVars`, spread OVER its existing
five, and gained four verbs — `playVideoAt`, `setMuted`, `play`, `destroy`.
`routes/robots/Television.jsx` drives the set through it.

**IT ALSO LEFT `Exhibit.jsx`, AND THE LINTER NAMED THE REASON.** Exporting a hook
from a file that default-exports a component costs
`react-refresh/only-export-components` — one new error, and the baseline is only
a tripwire while it is exact. The rule's own advice is the fix: it is
`src/routes/exhibit/use-yt-player.js` now, unchanged in body, with two callers.
**Baseline back to 9/8.**

### THE FINDING THAT JUSTIFIES THE WHOLE RULING

**A HAND-WRITTEN IFRAME CANNOT AUTOPLAY.** The first build was a plain
`<iframe>` on the nocookie host with `autoplay=1` in the query, and it drew a
**poster and a play button**. The reason is the `allow` attribute: autoplay is a
Permissions-Policy feature and must be DELEGATED to a cross-origin frame. A
hand-written iframe has no `allow`; the API writes its own with
`allow="…autoplay…"` — read off the live element to confirm.

**So "reuse the hook" was not the tidier choice. It was the working one.**
Filed as Ruling 23.

### WHAT THE PAGE ACTUALLY DOES — reported rather than specified

| step | result |
|---|---|
| real click on LATCH, channel routed to television | the set opens full-frame, **joined mid-broadcast** (`currentTime` 342, then 47, then 1563 across runs — never 0) |
| unmuted autoplay | **refused on this host**, even with a genuine latch click that landed on `.ip-latch-face` |
| the fallback | picture starts **muted and playing** — verified by screenshot, captions running, no poster, no play button |
| one real click on the picture | **sound on.** `.tv-tap` caught it, the catcher removed itself, the player reported `muted: false` |

**SO: SOME VISITORS GET SOUND ON THE LATCH AND SOME GET IT ON THE NEXT TOUCH.**
That is Chrome's media-engagement policy for the origin, which the museum does
not control and cannot read. **What the museum guarantees is that the picture is
always MOVING** — never a poster — and that one touch is always enough.
**The dead channel is never the only one with sound**: the test signal's hum and
the set's audio are both one touch away at worst, and the set is the one that
starts first.

### AND ONE DEFECT THE PROOF FOUND, WHICH NO GATE COULD

The first unmute path listened on `window` for `pointerdown`. **It could never
fire** — the set fills the overlay, so every click lands inside a cross-origin
iframe and raises nothing in the parent document. The code read correctly and was
unreachable. **Found by clicking on the picture and watching nothing happen.**
The catcher is a node the museum owns now, present only while the sound is off,
swallowing exactly one click — which costs nothing under `controls: 0`.
`OPERATIONS.md` §8 carries the general rule.

## R2 · THE FAQ CLAUSE

*"…and neither of them **carries it**."* Mike's sentence, Mike's approval, filed
**MIKE** in the register with the old row replaced in place. `carries` is also
the truer word: arming is a fact about the latch, and the answer is about what
comes out.

## VERIFY — Mike's list, in his order

| check | result |
|---|---|
| latch a television channel: it plays, mid-broadcast | **YES** — full-frame, moving, captions, joined mid-reel |
| …with sound | **on the second touch on this host.** See above; reported as observed, not as specified |
| roll to another television channel: the first stops | **YES** — zero iframes remain after close; exactly one `.tv-root` and one iframe after the next latch |
| roll to the routed-0 channel: television stops, monoscope and hum | **YES** — ch2 @ `1011` → `TEST SIGNAL. NO UNIT ON THIS CHANNEL.`, card + band + scan drawn |
| roll to channel 3 at `1101`: the machine | **YES** — `/held/robots/twin.html`, `preset=standard` |
| channel 4 @ `1110` (the zero, with a machine assigned) | **SIGNAL PRESENT** → the close-up photograph, not the test card — the priority working |
| /wal still plays every song | **YES** — player built `controls=1, autoplay=0` on the nocookie host exactly as before; focus still **CUES** (state 5, ruling A intact); playback verified by screenshot, video running |
| /hr | **NOT OPENED — it is password-held and Ops does not handle credentials.** It is the SAME call site: `useYTPlayer` is called in exactly two places in the building, and `Exhibit.jsx`'s single call passes no `playerVars`, so /hr and /wal are one code path. /wal is that path, verified live. |
| the three phases | **581 s and 1162 s** against 1743/3 = 581 |

## GATES (second sweep)

lint **9/8 = baseline** · build green · **launch build green** · provenance
**PASS** (2 rows: the new FAQ clause filed MIKE, one accessible-name fallback) ·
`reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate` **PASS** ·
`docs:numbers` **PASS** · `reveal:day` nothing to move · `assets:orphans` **13,
unchanged** · **the YouTube id still ships only in `assets/held/portal-*.js`**.
