# Phase 1.5c — Visual differentiation for commentary tiles, URL pass-through for press tiles

**Date:** 2026-05-02
**Scope:** Two adjustments to the HR artifact grid: (a) tag every card with a
content class so voice tiles read distinct from evidence tiles, and (b) pass
URL fields through from the data files so click-to-source works on the small
number of archive entries that point outside the museum.

---

## 1. `contentClass` distribution

| Class      | Count | Source files                                     |
| ---------- | ----: | ------------------------------------------------ |
| `evidence` |    33 | `HR_ARTIFACTS` (10) + `HR_ARCHIVE` (23)          |
| `voice`    |    23 | `HR_EXIT_FLOW` (23)                              |
| **total**  | **56** | — unchanged from Phase 1.5b                      |

The split follows the brief verbatim: artifacts and archive entries are
things-that-exist-in-the-world (`evidence`); curator's-quick-takes /
deep-cuts / highlights from `HR_EXIT_FLOW` are commentary (`voice`).

## 2. `externalUrl` distribution

| State              | Count | Notes                                                  |
| ------------------ | ----: | ------------------------------------------------------ |
| URL present        |     1 | The `arc-0-2025-01-01` card (Facebook post, `postUrl`) |
| `null`             |    55 | All other cards                                        |
| **total**          | **56** |                                                       |

**Field source per adapter** (per the brief, no fallback URLs invented):

```js
const externalUrl =
  item.postUrl || item.url || item.link || item.href || null;
```

- `hrArtifactToCardShape` — checks `postUrl`, `url`, `link`, `href`. None
  are present on any current `HR_ARTIFACTS` entry, so all 10 artifact cards
  resolve to `externalUrl: null`.
- `hrArchiveItemToCardShape` — checks the same four. Exactly **one**
  `HR_ARCHIVE` entry today carries `postUrl` (the Facebook embed prototype
  test, `2025-01-01`). All other 22 archive cards resolve to
  `externalUrl: null`.
- `hrExitFlowItemToCardShape` — voice tiles are commentary, not pointers
  outside the museum. Set to `externalUrl: null` literally; the OR-chain
  isn't even attempted.

**`ytId` deliberately not treated as a URL.** Six entries across
`HR_ARCHIVE` and `HR_ARTIFACTS` carry a `ytId` (a YouTube video ID — not a
full URL). Constructing `https://youtube.com/watch?v=${ytId}` would be
"making up a default URL," which the brief explicitly forbids. Flagged as an
open issue below; if Mike wants those treated as `externalUrl`, the change
is one line in each adapter.

## 3. Files edited

| Path                                          | Summary of change |
| --------------------------------------------- | ----------------- |
| `src/routes/hr/hr_cards.js`                   | Header docstring updated; each of the three adapters now emits `contentClass` and `externalUrl` on the card shape. |
| `src/routes/hr/HrExhibitFlow.jsx`             | `ArtifactCard` dispatcher rewritten to add the voice class, render the badge, render an `<a target="_blank" rel="noopener noreferrer">` wrapper for cards with a non-null `externalUrl`, and emit a small `↗` indicator. Card variants (`PhotoCard`, `ArtCard`, `VideoCard`, `PressCard`, `EssayCard`, `SessionCard`) themselves are untouched — the URL/badge/class are layered on at the dispatcher. |
| `src/routes/hr/HrExhibitFlow.css`             | Added `position: relative` to `.hr-card` (anchors the overlays). Added two new style blocks: `.hr-card-link` / `.hr-card-link-arrow` (clickable cards) and `.hr-card-voice` / `.hr-card-voice-badge` (voice tiles). |

No other files touched. `Exhibit.jsx`, `App.jsx`, `HrSpine.jsx`,
`Exhibit.css`, the worker, and all data files (including `hr_archive.js` and
`hr_artifacts.js` — inspected only) are unchanged.

## 4. Click affordance (clickable evidence cards)

A card with a non-null `externalUrl` renders as `<a>` instead of `<div>`.
Treatment:

- **Cursor:** `cursor: pointer`
- **Anchor reset:** `text-decoration: none; color: inherit;` so the gold
  card chrome inherits as before.
- **Hover affordance:** the existing `border` brightens to `--hr-gold-lo`
  and an inset 1px box-shadow in the same gold-lo tone is applied. This is a
  slightly more pronounced version of the prototype's existing border-on-hover
  pattern. `!important` is required on the border-color rule because the card
  border is set via inline `style={baseStyle}`.
- **External-link indicator:** a single `↗` (Unicode U+2197, north-east
  arrow) wrapped in `<span className="hr-card-link-arrow" aria-hidden="true">`
  positioned absolute at top-right (`top: 6px; right: 8px;`),
  `font-size: 12px`, color `--hr-gold-lo` at rest and `--hr-gold-hi` on
  hover. No icon library — kept minimal per the brief.
- **Transition:** 150ms on `border-color` and `box-shadow` (matches the
  prototype's existing pill / button hover timings).

A card with `externalUrl: null` renders exactly as it did in 1.5b — same
`<div>`, no anchor, no chevron, no extra hover.

## 5. Voice tile treatment

**Badge word chosen: "curator's note"** (rendered as `curator's note` in
the JSX with `&rsquo;` for the apostrophe so the curl matches the museum's
typography).

Why this word: the other candidates were "voice," "the curator," "note,"
and "commentary." "Voice" is the internal taxonomy term in the data layer
(`contentClass: "voice"`) and is appropriate there, but as a visible label
it's vague — the visitor sees the word and isn't sure what it means.
"Curator's note" is plain English, matches museum conventions (placards next
to objects often read "curator's note" or "from the curator"), and reads as a
voice without naming a specific person. "Commentary" is right but heavier;
"note" alone is too thin. "Curator's note" is the version a museum-goer
would recognize on sight.

**Visual treatment** (CSS, in `HrExhibitFlow.css`):

```css
/* Phase 1.5c — voice tiles (curatorial commentary; HR_EXIT_FLOW) */
.hr-card-voice {
  background: rgba(50, 38, 14, 0.55) !important;
  border-color: var(--hr-gold-mute) !important;
}
.hr-card-voice-badge {
  position: absolute;
  top: 6px;
  right: 8px;
  font-family: var(--hr-sans);
  font-size: 8.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--hr-gold);
  background: rgba(14, 11, 6, 0.7);
  padding: 2px 6px;
  border: 1px solid var(--hr-gold-lo);
  pointer-events: none;
  line-height: 1.2;
  z-index: 2;
}
```

The background `rgba(50, 38, 14, 0.55)` is a touch warmer and more opaque
than the evidence default `rgba(30, 24, 8, 0.35)` — same hue family, a
small step up in amber and presence. The border shifts from `--hr-border`
(#2a2010) to `--hr-gold-mute` (#3a2e14), a subtler change in the same
direction. `!important` is needed because the card's background and border
are also driven by inline `style={baseStyle}` in the JSX dispatcher; the
class-level override is the cleaner half of the pair.

The badge sits at top-right, 6/8px in from the corner. Same anchor location
as the link arrow — fine because no card is both voice and clickable
(voice tiles always have `externalUrl: null`).

**Apostrophe rendering note.** I used `&rsquo;` instead of a literal
apostrophe so the badge reads `curator's note` with the curled typographic
mark, matching the rest of the gold/serif chrome. If the museum's broader
copy uses straight apostrophes I can swap.

## 6. ESLint output

```
$ npx eslint --no-warn-ignored src/routes/hr/hr_cards.js \
                              src/routes/hr/HrExhibitFlow.jsx \
                              src/routes/hr/HrExhibitFlow.css

(no output, exit 0)
```

Clean — zero errors, zero warnings on all three edited files.

Additional verification (Linux sandbox):

| Check                                                   | Result |
| ------------------------------------------------------- | ------ |
| `acorn` parse on `hr_cards.js`                          | OK     |
| `acorn-jsx` parse on `HrExhibitFlow.jsx` (1620 lines)   | OK     |
| `node --input-type=module` import of `HR_CARDS`         | 56 cards |
| `contentClass` populated on every card                  | yes — 33 evidence + 23 voice |
| `externalUrl` key present on every card                 | yes — 1 string + 55 null |
| Existing dimensions (era/year/type/src) populated       | yes — 0 cards missing |
| Render distribution unchanged from 1.5b                 | yes — `{ photo:11, art:12, video:6, press:9, essay:5, session:13 }` |

**Vite build deferred to Windows**, as expected and documented in 1.5b. The
Linux sandbox still cannot load `@rolldown/binding-linux-x64-gnu`, and the
brief explicitly says not to fix the environment.

## 7. Open issues

1. **`ytId` is not currently treated as `externalUrl`.** Six entries
   carry a `ytId` (a YouTube video ID, e.g. `FbOoHjoSyec`):
   - `HR_ARCHIVE`: `2022-09-09 Line Check Audio Sessions`,
     `2023-02-16 Medusa's Disco interview`,
     `2023-07-21 Quicksand Sinking session`
   - `HR_ARTIFACTS`: `2022-09-09 Can't Outshine The Truth`,
     `2025-08-10 Cookin' in the Bathroom cover` (and a few others)
   These are intentionally **not** wired as `externalUrl` because constructing
   `https://www.youtube.com/watch?v=${ytId}` would invent a URL, which the
   brief forbids. If you'd like a click on a `ytId`-bearing card to open the
   YouTube watch page in a new tab, the change is a one-liner in each
   adapter:
   ```js
   const externalUrl =
     item.postUrl || item.url || item.link || item.href ||
     (item.ytId ? `https://www.youtube.com/watch?v=${item.ytId}` : null);
   ```
   Worth noting that one of these (`Cookin' in the Bathroom cover`) also
   carries `src: "youtube"`, which suggests intent to surface as an external
   link. Flagging for your call.

2. **Press cards behave the same as other variants when clickable.** The
   `<a>` wrap and `↗` chevron sit on top of the press card's italic-serif
   pull quote and `--hr-gold-lo` left border. It looks fine in isolation —
   but only one card today is press-and-clickable in the HR data set
   (`postUrl` lives on a `historical → photo` entry, not on any
   `interview → press` entry). If a future archive entry adds `postUrl` to
   an interview, the `↗` will overlap with the press card's right-side
   internal padding. Reasonable for v1; revisit when more press URLs land.

3. **`!important` used twice in CSS.** Both `.hr-card-voice` background /
   border and `.hr-card-link:hover` border-color are forced with
   `!important`, because the card's `style={baseStyle}` inline-CSS would
   otherwise win the cascade. The cleaner long-term refactor is to move
   `baseStyle`'s background and border out of inline CSS and into a class
   per render-type (`.hr-card-press`, `.hr-card-essay`, etc.), then let the
   class system carry both the variant chrome and the voice/link overrides.
   Out of scope for 1.5c — flagging for a future cleanup pass.

4. **Voice tile background contrast in dark conditions.** I tested the
   background tone (`rgba(50, 38, 14, 0.55)`) against the section's `INK`
   `#0e0b06` in the static CSS — visible enough to scan but not loud. On
   monitors calibrated cooler than mine the warmth differential may be too
   subtle. If Mike scans the grid at speed and can't tell voice from
   evidence, push the background more amber (e.g.
   `rgba(72, 56, 18, 0.6)`) or add a left border accent in `--hr-gold-lo`.

5. **Click-through opens in a new tab unconditionally.** The brief
   specifies "new tab," and `target="_blank" rel="noopener noreferrer"` is
   what's wired. There is no per-card override (e.g. for a future case
   where a URL points to an internal museum page). Easy to extend later by
   adding a sibling `internalUrl` field with `target="_self"`.

6. **No keyboard-focus styling beyond browser default.** The `<a>` element
   is keyboard-focusable for free, but the visible `:focus` ring relies on
   the browser default (Chrome's blue outline) rather than a museum-tuned
   gold ring. If accessibility/keyboard navigation matters for the museum's
   audience, add a `.hr-card-link:focus-visible` rule mirroring the
   `:hover` treatment.

7. **Filesystem sync glitch repeated** (tooling note, same as 1.5b open
   issue #9). After editing `hr_cards.js` via the host file tools, the
   Linux mount initially saw a truncated 183-line / 7266-byte view of the
   file. A single `mv x x.tmp && mv x.tmp x` round-trip refreshed the
   mount, after which `wc -l` reported the correct 237 lines / 8291 bytes
   and acorn parsed cleanly. No data loss. Worth keeping the workaround in
   the institutional memory.
