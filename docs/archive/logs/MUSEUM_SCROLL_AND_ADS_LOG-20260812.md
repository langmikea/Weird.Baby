# THE SCROLL, DIAGNOSED — AND THE AD CALL
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `d966f8b`. Site live in LAUNCH stage.

---

## A — THE SCROLL

### A1 — Mike's mechanism is CONFIRMED. The "stuck" half is NOT reproduced.

Measured on `/foundation`, launch build, four viewport widths:

| real content height | `scrollHeight` | `innerHeight` |
|---|---|---|
| **888.8px** (fractional) | **889** (rounded) | **889** |

The fractional-layout-height vs integer-`scrollHeight` disagreement he identified
is real and reproducible. On a page with tens of pixels of travel, a sub-pixel
disagreement is a visible fraction of the whole range. **His arithmetic holds.**

**WHAT I COULD NOT REPRODUCE: the page failing to return to 0.** Every
`scrollTo(0,0)` reached 0, on every route, at every width. The reason is a
limitation of the rig and is stated rather than worked around: **an iframe's
layout viewport rounds to whole pixels** (`innerHeight` came back `889`, never
`888.888`), so the fractional-zoom condition cannot exist inside the lap
harness — and browser zoom cannot be set from the driver. The stuck state needs
Mike's own window at 90%.

### A2 — `scrollSnapType: "y"` is a RED HERRING

Nothing overrides it and the browser does not drop it. **`proximity` is the
initial strictness in the `scroll-snap-type` grammar**, so Chrome omits it from
the computed value exactly as it omits any initial component. `y` and
`y proximity` are the same declaration. Recorded so nobody chases it again.

### A3 — `overflow-x: clip` on `html`

`Exhibit.css:22`, `html,body{…overflow-x:clip}`. It is there to stop horizontal
overflow producing a scrollbar; `clip` rather than `hidden` because `hidden` on
one axis forces the other to `auto` and would have made the document a
programmatic scroll container, while `clip` is allowed to sit beside
`overflow-y: visible` — which is exactly why the probe printed `clip visible`.

**It does not contribute to the fractional height.** Height is not an axis it
touches, and the fractional value (888.8) appeared identically at every width
including those where nothing overflowed horizontally.

### A4 — what changed, and what was rejected

**Removed: `scroll-snap-type:y proximity` from `html`.** Measured this round on
the launch build, every public route, four widths: **zero elements with
`scroll-snap-align`.** `MuseumBar.css` said the same in August ("measured:
zero"). It made the DOCUMENT a snap container with nothing to snap to — an inert
mechanism that still asks for a snap re-evaluation after every layout change.
`/hr` carries its own rule beside its own targets and is untouched.

**Added: `overflow-anchor:none` on `html`.** This is the finding that fits every
part of the report. Chrome's scroll anchoring (computed `auto` on both `html`
and `body` — measured) holds visible content still when something above changes
size, **by moving the scroll position and resisting the return**. The late change
is real and is on exactly the pages named: `/foundation` builds a YouTube player
iframe after mount **with no videos on the page** (§B), and the web fonts swap
after first paint. On a long page that is a few per cent of travel; on 31px of
travel it is the whole thing — which is why per-page fixes failed and why it
only shows on short pages.

**Cost, stated:** turning anchoring off means a late image ABOVE the viewport can
shift content under a reader on a long page. Taken deliberately — a page that
cannot reach its own top is the worse failure, and the wall images sit in
fixed-size tiles.

**Rejected:** `scroll-behavior:smooth` (nothing implicates it, and it is what
makes the transport read as motion); touching `min-height:100vh` (the phantom
overflow it would cause did not appear — `max` measured **0**, so there is
nothing to fix there); and any per-page rule, which is the thing Mike ruled out.

**NOT VERIFIED AGAINST THE SYMPTOM**, and that is the honest status. This is the
best-fitting cause changed at the cause; the proof is Mike at 90% on the page
that was stuck.

---

## B — THE AD CALL

### B1 — found it

**`src/routes/exhibit/Exhibit.jsx:505`**

```js
// Eagerly construct the player on mount (fixes mobile first-click playback).
useEffect(() => { ensureApi(() => initPlayer()); }, []);
```

Unconditional on mount. `ensureApi` injects `https://www.youtube.com/iframe_api`,
and `initPlayer` constructs a `YT.Player` **with no videoId**. That builds a real
`youtube.com/embed/` iframe, and YouTube's own player script inside it calls
`googleads.g.doubleclick.net/pagead/id`. Cross-origin, which is why it appears in
the stack as "inside an embed's own script" and never in the top document's
resource entries.

**`/foundation` has `videos: []` on every track.** It builds a video player for
a wing that has no video.

### B2 — every third-party request at LAUNCH, measured

| route | third-party hosts | YT API | iframes |
|---|---|---|---|
| `/` | fonts.googleapis.com · fonts.gstatic.com | no | 0 |
| `/booth` | fonts.googleapis.com · fonts.gstatic.com | no | 0 |
| **`/foundation`** | + **www.youtube.com** | **yes** | **1** |
| **`/wal`** | + **www.youtube.com** | **yes** | **1** |
| **`/wb`** | + **www.youtube.com** | **yes** | **1** |
| `/shop` | fonts.googleapis.com · fonts.gstatic.com | no | 0 |
| `/robots` | fonts.googleapis.com · fonts.gstatic.com | no | 0 |

No Facebook host on any launch route. No cookies set on a plain visit (checked
`/` and `/foundation`: no `Set-Cookie`).

### B3 — the Booth's answer, clause by clause

It is a careful answer and most of it is true. **Two clauses are not.**

| clause | true? |
|---|---|
| "This site sets none [cookies]. Not one, not even ours." | **TRUE** — measured, no `Set-Cookie` on a plain visit |
| "The typefaces are served by Google" | **TRUE** — every route |
| "The rooms **with music in them** load YouTube's player when the room loads, before you press anything" | **FALSE NOW** — `/foundation` has no music and loads it |
| "one exhibit carries posts embedded from Facebook" | **NOT AT LAUNCH** — the Facebook embed is in `HrExhibitFlow.jsx`, i.e. `/hr`, which is password-held. Nothing at launch fetches Facebook |
| "Google, YouTube and Facebook … are the whole of the outside" | **TRUE**, and over-inclusive by one |
| "no analytics, no advertising and no tracking pixel anywhere in this site" | **THE ONE AT RISK** — see below |

**The last clause is the one Mike has to rule on.** The museum's own code carries
no ad tag, no analytics and no pixel — that part is exactly true. But a page it
serves loads an embed that calls Google's ad-identity endpoint, and a visitor's
ad blocker attributes that to weird.baby. *"There is no advertising anywhere in
this site"* is defensible about authorship and arguable about effect. The answer
already promises **"if that ever stops being true, this answer changes first."**

### B4 — options, and their costs. NOT CHOSEN.

| option | cost |
|---|---|
| **1. Build the player only when a track has a video.** One condition at `Exhibit.jsx:505`. | Kills the call on `/foundation` and `/wb`, and removes A's layout-shift trigger. Does **not** help `/wal`, which has videos. Loses the mobile first-click fix the comment names — the first tap may not play |
| **2. Build the player on first interaction, everywhere.** | Kills the call on every route until a visitor presses play. Same mobile first-click regression, on all routes |
| **3. `youtube-nocookie.com`.** | One-line src change. Reduces cookie-setting; **does not stop the doubleclick call**, which is what the blocker sees. Cosmetic against this symptom |
| **4. Self-host or link out instead of embedding.** | Ends all YouTube contact. Costs the in-page player, which is most of the exhibit surface |
| **5. Change nothing; change the Booth's wording.** | Honest and cheap. The museum then says out loud that its embeds reach Google's ad infrastructure — which is a statement about what the museum does, and his to write |

**Options 1 and 5 are compatible and together are the smallest honest fix.** The
"rooms with music" clause needs correcting under every option except 4.

---

## GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build · launch build | green · green |
| provenance:gate | **PASS** — 0 undeclared, 0 stale (no visitor-facing string changed) |
| reveal:check · parity · instory | PASS · PASS · PASS |
| reveal:day | nothing to move |

One file changed: `src/routes/exhibit/Exhibit.css`.

---

## WHAT I COULD NOT DETERMINE

- **That the fix works.** The stuck state cannot be reproduced in the lap rig
  (integer iframe viewports) and browser zoom cannot be driven from here.
- Whether the ad call also fires on `/wal` and `/wb` in Mike's browser — it will,
  by the same path, but I did not see the blocker's own log.

## WHAT NEEDS MIKE

1. **Load `/foundation` at 90% and try the top.** If it still sticks, the cause is
   not anchoring and the next candidate is the fractional max itself.
2. **B4 — which option**, and the wording. Two Booth clauses are wrong today
   regardless of which he picks: "rooms with music" and the Facebook sentence.
