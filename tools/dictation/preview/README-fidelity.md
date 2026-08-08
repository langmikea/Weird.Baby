# THE LIVE PREVIEW — what is exact, what is a copy, and how it was measured

**Built 2026-08-08 (D4–D6). Read this before describing what the preview
proves.** The frame's own header points here, and the reason is Mike's ruling:

> *"THE REQUIREMENT IS FIDELITY — the same type, the same scale, the same
> measure, the same wrapping, the same section rendering the live site uses.
> **A preview that approximates is worse than none, because he will trust
> it.** If true fidelity means rendering the actual component, do that rather
> than reimplementing its look."*

A page that claims fidelity has to say what it does not have. This is that list.

---

## 1. What is literally the shipped thing

| | how |
|---|---|
| the opened entry | `src/routes/exhibit/RecordEntry.jsx`, imported |
| the index row | `src/routes/exhibit/RecordIndexRow.jsx`, imported |
| the dateline, stamp, week number, payload counts | `src/lib/record-model.js`, imported by both |
| every stylesheet | `src/index.css` + `src/routes/exhibit/Exhibit.css` (which `@import`s `src/styles/museum-tokens.css`), built by vite from those files |
| the fonts | the identical Google Fonts `<link>` from the museum's `index.html` |

There is **no second implementation** of the row, the sections, the door
markers, the orphan-door rule or the type. A change to any of it changes the
preview at the next `npm run dictation`, and if a component stops importing, the
build fails and no page is written.

**`RecordIndexRow.jsx` exists because of this.** The row was JSX inlined in a
`.map()` five levels deep in `Exhibit.jsx`; a preview could copy it or omit it,
and a copy drifts silently into a preview Mike has been told to trust. Nothing
about the row changed in the move.

---

## 2. What is a copy, and is therefore the thing to re-measure

**The ancestor chain in `frame.html`** — the eleven elements the wing puts
between `<body>` and an entry, plus two inline styles (`.ex-main-inner`'s default
22/78 split and `.ex-root`'s `--fit-area-max`). It was **read off the live page,
not guessed**, and it is the only part that can drift out of agreement without
anything failing.

Mounting the real exhibit instead would mean a router, a spine, the YouTube API
and a coverflow to draw one paragraph.

---

## 3. The measurement, 2026-08-08

Both surfaces in the **same browser window** (`innerWidth` 1228), the museum as
a top-level document at `/robots` on the built bundle under `wrangler dev`, and
the preview as the worksheet's full-window iframe. Same window, so the same
`vw` — which is the whole point.

| | live `/robots` | preview | |
|---|---|---|---|
| `100vw` | 1213.8px | 1213.8px | ✔ |
| `documentElement.clientWidth` | 1216 | 1216 | ✔ |
| `.vp-flat` width (the measure everything sits in) | 838.66px | 838.66px | ✔ |
| body font-size | 15.4031px | 15.4031px | ✔ |
| body line-height | 24.9531px | 24.9531px | ✔ |
| body letter-spacing | 0.0770156px | 0.0770156px | ✔ |
| body `max-width` (68ch) | 678.656px | 678.656px | ✔ |
| headline font-size / `max-width` (26ch) | 20.0241 / 261.332px | 20.0241 / 261.332px | ✔ |
| section label font-size | 13.0927px | 13.0927px | ✔ |
| dateline font-size | 11.4304px | 11.4304px | ✔ |
| families | Fraunces · Syne · DM Serif Display · Courier Prime | identical | ✔ |

**Static check, same day:** all **117** `.vp-rec-*` selectors in `Exhibit.css`
are present in the built `preview.css`. (18 of 633 selectors overall differ only
in how the minifier writes them — `::before` → `:before`, merged attribute
groups, keyframe stops.)

---

## 4. THE ONE THING THAT WAS WRONG, AND IT IS WHY THE FRAME IS FULL-SCREEN

The first cut stacked a bar above the frame and an editor below it. The frame
came out **368px tall**, and the museum's ramp is

```
--face-fs: calc(clamp(1.02rem, min(1.35vw, 4.4cqh), 1.28rem) * .94)
```

— `min(1.35vw, **4.4cqh**)`. It reads the viewport's **height** as well as its
width. At 368px, `4.4cqh` fell to 16.192px, below `1.35vw`'s 16.386px, the clamp
dropped to its 1.02rem floor, and the preview drew its body at **15.3408px
against the live page's 15.4031px.**

Four tenths of one per cent. Invisible, wrong, and exactly the failure Mike
named. **The frame is now the whole window and the two strips float over it** —
he loses a band of the preview to the editor and can scroll it; he does not lose
the type.

**The general rule this leaves behind: anything that reduces the preview
iframe's width OR its height changes the type.** Nothing may be added around it.

---

## 5. What the preview does NOT know, stated plainly

- **How his prose becomes sections.** A line on its own in CAPITALS starts a
  section and is its label — the format he already dictated Record 001 in. It is
  a stated convention, printed on the worksheet, not a guess. Text before any
  label becomes a section with no label, which the component renders as plain
  paragraphs.
- **The record number.** `no` is authored (M19) and Ops does not mint one, so
  the preview passes none and the mark rail draws empty — the component's own
  honest state, and what Record 013 shows today.
- **The date IS known**, and that is D1's payoff: `RECORD_EPOCH` is read out of
  the Record itself and every outline day derives from it, checked against the
  outline's own `MON…FRI`. The generator **fails** if they disagree.
- **`tomb`, `still`, `wire`, `plates`, `docs`.** No slot asks for them, so the
  preview never draws them. A long-form entry cannot draw the last three at all
  today — open row `S-c`.
- **The walk, the unread mark and the month bands.** All are properties of a
  LIST; the preview holds one entry. `RecordEntry` hides its nav below two
  entries by its own rule, which is what a reader of a one-entry volume sees.
