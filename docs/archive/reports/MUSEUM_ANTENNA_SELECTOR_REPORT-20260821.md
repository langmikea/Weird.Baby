# THE ANTENNA SELECTOR — the report before building, 2026-08-21

**Nothing is built. This is the read.**

---

## THREE THINGS NEED MIKE BEFORE A LINE IS WRITTEN

### 1. ONE OF THE TWO SEED VIDEOS CANNOT BE EMBEDDED. It is not age restriction.

| | `vBAcEqq7T4Q` | `aA5oKoCRjWw` |
|---|---|---|
| title | *Channeling 1960 to 1963 TV* | *Assorted 1960s TV Commercials* |
| channel | FredFlix | A/V Geeks 16mm Films |
| length | 3603 s (60:03) | 1743 s (29:03) |
| oEmbed | OK | OK |
| `playabilityStatus.status` | **OK** | **OK** |
| `playableInEmbed` | **true** | **true** |
| `isFamilySafe` | **true** | **true** |
| `ytRating` / `contentRating` | absent | absent |
| **in a real iframe, nocookie** | **"This video is unavailable"** | **PLAYS** |
| **in a real iframe, youtube.com** | **"Video unavailable"** | not tested |

**Every public signal on A is identical to B's and every one of them is wrong** —
the exact trap the 20 Aug /wal round wrote up. **The only oracle is a rendered
iframe**, so one was built: a local page on `http://127.0.0.1`, three real
iframes, screenshot. B autoplayed at t=60 with captions running. A refused on
**both** hosts.

**It is not an age gate.** An age gate says *"Sign in to confirm your age."*
This says *unavailable*, on both hosts, from a real origin, while B works from
the same page — so it is not a referrer problem, not a localhost problem and not
a nocookie-only problem. It is a refusal specific to that video. **Cause not
diagnosed; the fact is enough to act on.** *(Opening the bare embed URL in a top
tab gives `Error 153` instead, which is a missing-origin artefact and is not
evidence either way — recorded so nobody re-runs that probe and misreads it.)*

**→ Mike: the antenna needs a second source. A is dead.**

### 2. CHANNEL 4 AND THE SOLVED ROUTING COLLIDE

Confirmed against `portal.js` — the drum is eight positions and channels 5–8 are
exactly the refusals the brief says they are:

| ch | id | engraved | arms today | opens |
|---:|---|---|---|---|
| 1 | `niac-1` | MGK-NIAC | no | — *"This feed is not available."* |
| 2 | `niac-2` | MGK-NIAC | no | — |
| 3 | `standard` | **MGK-VIIIp** | **yes** | the twin |
| 4 | `idling-updated` | **MGK-VIIIp (zoom)** | **yes** | the close-up photograph |
| 5 | `boot-playback` | COLD START | no | — |
| 6 | `off-first-boot` | FIRST RUN | no | — |
| 7 | `last-state` | LAST STATE | no | — |
| 8 | `test-bench` | TEST BENCH | no | — |

**Two channels arm, not one, and both are the VIIIp.** The solved routing is
`1101` — zero on 3 — which makes **channel 4 carry television**. The close-up of
the machine then has television playing over it, in the solved state, which is
the exact fault the puzzle exists to avoid one channel over.

QC_101 says `BROADCASTS ON ... FEED NO. 3`, and it is right — but the drum
currently has the VIIIp on two channels and the antenna has only one zero.
**Ops has no ruling to reach for here.** Four ways out, none of them Ops':

- the close-up moves onto channel 3, beside the twin;
- the close-up leaves the drum (it is a photograph, not a feed — the drum's own
  rule since R6 is that a position is an engraved name);
- channel 4 keeps the photograph and the antenna governs 1, 2, 3 only — which
  costs one of the four routings;
- the solved state genuinely puts television over the close-up and that is
  accepted as its price.

### 3. DOES THE ANTENNA GATE THE TWIN?

Today channel 3 arms and the latch opens the twin, unconditionally. If routing
joins arming, **the Portal's one working door goes behind a four-state puzzle
whose answer is printed on an attachment inside Record 004.** That is the
feature, and it is also the largest single behaviour change since launch. It
wants Mike's word before it is built, not after.

---

## THE SIX QUESTIONS

### 1 · WHERE IT LIVES

**Two files, and the split already exists.**

- **`src/routes/exhibit/Exhibit.jsx` → `InstrumentPanel` (line 1557).** The
  renderer. It draws a drum, bat switches, a rotary dial and a latch and knows
  nothing about portals or MGK. It is imported by **five wings** — hr,
  wb, robots, wal, foundation — and mounted on the presence of a field:
  `{face.panel ? <InstrumentPanel decl={face.panel} /> : …}`.
- **`src/data/artists/portal.js` → `face.panel`.** The only face in the museum
  that declares a panel. Every legend, position and arming rule is here.

**WHAT MOVES:** `InstrumentPanel` learns one more control type — a stepping
button with a routing readout — and the arming expression. Nothing else in
`Exhibit.jsx` moves.

**WHAT DOES NOT:** no other wing can notice. The existing precedent is exact —
`{p.ch != null && <span className="ip-drum-ch">{p.ch}</span>}`, added for the
channel numbers, renders nothing for a position that declares no `ch`. A wing
that declares no `antenna` block draws no antenna.

**AND THE MATERIAL STAYS HELD.** The routings, the channel→source map and the
YouTube ids go in `portal.js`, which is chunked under `assets/held/` and refused
by the worker without the cookie. `Exhibit.jsx` receives them at runtime through
`decl`; it never imports the file, and `heldChunkGuard` fails the build if that
ever changes. This is the same seam the twin's address already rides.

**ONE MEASURED COST.** The panel is **scaled to fit, never cropped** — a fifth
control bay makes the natural height taller, so `fit` drops and **the whole
instrument gets smaller at every frame size**, latch included. That is not a
reason not to build it; it is a number to take before and after.

### 2 · HALF OUT OF SYNC

**Mechanism.** One wall clock, no state:

```
start(ch) = floor(Date.now()/1000 + phase[ch]) mod duration[source[ch]]
```

Two channels sharing a source get phases `0` and `duration/2`. The channel is
loaded at `?start=N`, or seeked with the API. Nothing is stored, nothing has to
stay in step, and two visitors on two machines see the same frame — which is
what makes it a broadcast rather than a playlist.

**FAILURE MODES, WORST FIRST:**

1. **THE JOIN LANDS NEAR THE END.** A 1743 s source joined at t=1740 runs out in
   three seconds and YouTube draws its own end screen — related videos, on the
   Portal's glass. **This is the one that will actually happen**, roughly 1 % of
   loads per channel per minute of tolerance. `loop=1&playlist=<id>` is the
   standard single-video loop and is the fix; it must be built in from the
   start, not added after it is seen.
2. **SEEKING.** The visitor can scrub, and once scrubbed that channel is off the
   clock until it is reloaded. `controls=0&disablekb=1` removes the affordance
   and is also period-correct — a 1965 television has no scrub bar.
3. **AUTOPLAY POLICY.** The latch is a user gesture so the first channel plays;
   later changes inherit activation in the same tab. **iOS Safari is stricter**
   and may require muted playback, which is a different object — television with
   no sound.
4. **DURATION IS DECLARED, NOT FETCHED.** If a source is re-uploaded or trimmed
   the modulo is wrong and every phase drifts, silently, with nothing reporting
   it. It wants a gate or a comment naming the number's source.
5. **PAUSE** drifts from the clock. Re-joining on the next channel change is the
   correct behaviour and needs no code — worth stating so a later round does not
   "fix" it.
6. **±1 s** from integer `start`. Invisible.

**REUSE, NOT A SECOND PLAYER.** `Exhibit.jsx` already has `useYTPlayer` /
`ensureApi` with `host: "https://www.youtube-nocookie.com"`, and the dedupe
guard matches `/iframe_api` by path rather than host, so a second player reuses
the one script. **The nocookie host is already the standing ruling** (2026-08-15,
Mike) and the booth FAQ's promise rests on it. The API script itself comes from
`www.youtube.com` because `youtube-nocookie.com/iframe_api` returns **503** —
that split is already written down and must not be "corrected".

### 3 · THE ARMING RULE

Today, one expression, one place — `Exhibit.jsx:1663`:

```js
armed = !!drum.arms && !!dial.arms && swBad === -1
```

with the refusal chosen most-specific-first: switch → drum → dial.

**IT SHOULD JOIN THE RULE, NOT SIT BESIDE IT** — and the reason is the doctrine
already written above that line: *"ARMING IS ONE RULE, EVALUATED IN ONE PLACE…
a control that declines silently is the same defect as a menu that hides what it
is not offering."* A routing that changed what the latch opened without changing
what the panel says would be exactly that silent decline.

**THE COST IS REAL AND SHOULD BE NAMED NOW:** `arms` stops being a static
boolean in the data and becomes derived from `(position, routing)`, and `why`
has to become routing-dependent with it — a channel routed to television refuses
for a different reason than a channel with no unit on it. That is the teaching
surface: **the refusal line under the latch is where a visitor learns the
antenna exists at all.**

**THE DIAL ALREADY DOES ITS HALF.** `SOURCE · LIVE / SEEDED` is declared with
`seeded.arms: false` and the refusal *"no seeded feed on file — the lamps read
the seed, and there is nothing to read."* Mike is right that it is the correct
distinction and it needs no new control.

### 4 · PERSISTENCE

**Nothing on this panel persists today.** `drumIdx`, `dialIdx` and `swOn` are
plain `useState` and reset every time the face unmounts.

**The two precedents are both inside `twin.html`, which is a different document
with its own storage:**

- `wbr_bias` → **localStorage.** Bias settings, saved deliberately by the visitor.
- `wbr_portal_weather` → **sessionStorage**, with its reason written down: *"a
  reload inside the session keeps the same weather and a new tab gets a new day.
  localStorage would have frozen one day forever."*

**RECOMMENDATION: persist the whole panel or none of it.** A routing that
survives while the drum resets leaves a visitor holding a solved antenna and a
drum back on channel 3 — two halves of one instrument disagreeing about whether
anything happened.

**AND IT COSTS THE PUZZLE, ONCE.** Persisted, the antenna is solved forever on
that machine; a returning visitor never meets it again. sessionStorage keeps it
per-visit, which matches the weather's own reasoning. **This is a UX call, not
an Ops one.** The mechanical cost either way is about ten lines.

**One hazard from §7 applies:** the museum and the twin are two documents with
two stores. If the antenna's routing is ever also read inside the twin, it will
be asked in two places and answered twice.

### 5 · THE DEAD CHANNEL — AND IT IS ALREADY BUILT

**This is the best news in the report.** `twin.html` already draws exactly the
object the question asks for, and has since July:

```
FEED 1     the family shot. The only feed with a picture behind it.
FEED 2-5   no signal. A 60s TV test pattern and a low hum.
```

It is not a plan. On disk today: a `body.portal.nosignal` state with a
**no-signal card**, and `Hum_Start()` / `Hum_Blip()` / `Hum_Swell()` /
`Hum_Strain()` — **60 Hz mains hum, built in Web Audio**, with *"a transmission
rides the hum"* and *"the machine leans in"* already written. The twin also
carries per-feed **signal quality as weather** — a seeded daily draw, held for
the session, glitches as the weather expressing itself.

**So "listening" has a picture and a sound and neither has to be invented.**

**THE COLLISION TO SETTLE FIRST:** the twin numbers **five** feeds, 1–5, and the
panel numbers **eight** channels, 1–8, and they are not the same numbers.
Channel 4 on the drum is the VIIIp close-up; FEED 4 in the twin is the chronic
underperformer. **Two vocabularies with the same word and the same digits, one
inside the other.** Any wiring of the panel's routing into the twin's feed strip
has to resolve that or it will read as a bug forever.

### 6 · THE LARGEST RISK

**THE FEATURE'S FAILURE MODE IS INVISIBLE BY CONSTRUCTION.**

A channel routed `0` is *supposed* to show no picture. A channel whose video has
died shows no picture. **They look identical**, and this round has already proved
the museum cannot tell them apart from inside: every machine-readable signal on
`vBAcEqq7T4Q` says healthy, and it is not. So:

- a source that dies next month degrades the puzzle silently;
- nothing in `reveal:check`, `provenance:gate` or any other gate can see it;
- **the only oracle is a person opening the page and looking**, which is the
  20 Aug lesson arriving in a second room.

**Second, and compounding it:** the antenna puts the Portal's one working door
behind a puzzle, and the museum has no way to observe whether anyone solves it.
There is no analytics, by design. If the routing is wrong for a visitor, what
they experience is *the Portal is broken* — which is indistinguishable, from
their side, from the Portal being held.

**WHAT WOULD REDUCE IT, if Mike wants it reduced:**

- a gate that fetches both video ids and fails on anything but `status: OK` —
  **worth saying plainly that this would NOT have caught A**, so it is a check
  against deletion and privatisation only, not against this failure;
- a dated line in `docs/canon/06-PORTAL.md` recording that the sources want a
  human look on a schedule;
- the refusal line under the latch carrying enough that a visitor on the wrong
  routing knows the instrument is working and they are not finished.
