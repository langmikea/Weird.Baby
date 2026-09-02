# Phase 4b — Reconcile the deck's palette and typography to the carousel

**Status:** implementation complete. ESLint clean. No commits, no deploy.
**Locked decisions from 4a:** Q1 fonts replaced; Q2 casing preserved (lowercase pills, uppercase tabs); Q3 card surface flattened to solid hex; Q4 voice cards pop via section-ink change only; Q5 token file at `src/styles/museum-tokens.css` with `--hr-` prefix retained; Q6 carousel untouched; Q7 inline alpha string left alone.

---

## 1. `src/styles/museum-tokens.css` — final values

```css
/* Museum tokens — canonical palette + typography for Weird.Baby. */
:root {
  /* Surfaces — cool near-blacks, neutral, matching the carousel */
  --hr-ink: #080808;
  --hr-ink-soft: #0d0d0d;       /* active row tint */
  --hr-ink-card: #0a0a0a;       /* default card surface — solid, not rgba */
  --hr-ink-card-hi: #0e0e0e;    /* essay / elevated card surface */

  /* Borders — neutral cool gray */
  --hr-border: #1a1a1a;
  --hr-border-hi: #252525;

  /* Accent — single gold, with deck-only ramp variants */
  --hr-gold: #b8974a;           /* canonical museum gold */
  --hr-gold-hi: #d4c49a;        /* hover / brighter — uses carousel's mid-cream */
  --hr-gold-lo: #a89770;        /* dim / labels */
  --hr-gold-mute: #555;         /* disabled gold */

  /* Body / mid text */
  --hr-dim: #d4c49a;            /* mid-strength text — warm cream */

  /* Typography — loaded webfaces (imported by src/routes/exhibit/Exhibit.css) */
  --hr-serif: 'DM Serif Display', Georgia, serif;
  --hr-sans: 'Syne', system-ui, -apple-system, sans-serif;
  --hr-mono: 'Courier Prime', 'Courier New', monospace;
}
```

Cross-checked against `Exhibit.css`. Every value is a real carousel hex from the 4a inventory: `#080808` (`html,body`), `#0d0d0d` (`.tl-active`), `#0a0a0a` (`.vp-area`), `#0e0e0e` (`.pb-queue`/`.fs-btn`), `#1a1a1a`/`#252525` (cool gray border family), `#b8974a` (museum gold accent), `#d4c49a` (warm cream mid-text), `#a89770` (`.cf-ph-year`), `#555` (mute gray). `--hr-mono` added as a token alias for the journal subzone's existing inline font stack — not consumed yet, future work can DRY it.

---

## 2. Font import path taken

**No new `@import` added** to `museum-tokens.css`. The carousel's `Exhibit.css` line 1 already imports DM Serif Display + Syne + Courier Prime via Google Fonts. Render chain confirmed: `App` → `/hr` route → `HrSpine` → `Exhibit` (imports `Exhibit.css`) → `<HrExhibitFlow />` rendered as `artist.exhibitFlow` in the same render pass (Exhibit.jsx line 908). HrExhibitFlow has no other mount point — the only artist that wires it in is `hunterRoot`, which is the same artist HrSpine renders.

So the Google Fonts `@import` resolves at the same module-load moment as the deck's first paint. Adding a duplicate `@import` would trigger a redundant network roundtrip and risk a CORS / FOUT race with the carousel's existing import. Skipped.

If this assumption breaks (e.g., a future route mounts `HrExhibitFlow` outside the Exhibit chain), the fallback is one extra line at the top of `museum-tokens.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;800&family=Courier+Prime:wght@400&display=swap');
```

---

## 3. Files edited

| File | Summary |
|---|---|
| `src/styles/museum-tokens.css` | **New file.** 47 lines. `:root` block defining 11 palette + 3 typography variables (Q5). |
| `src/routes/hr/HrExhibitFlow.css` | Removed the 14-line local `--hr-*` override block on `.hr-section`. Added `@import './../../styles/museum-tokens.css';` at module top. Variables now resolve from `:root`. No other selectors touched. |
| `src/routes/hr/HrExhibitFlow.jsx` | Rewrote 11 color constants + 2 font stack constants (lines 35–66) to match canonical museum values. No JSX, no S.* builders, no measurement code touched. |

---

## 4. JS constant rewrite — final values

```js
const INK = "#080808";
const INK_SOFT = "#0d0d0d";
const INK_CARD = "#0a0a0a";          // solid hex, not rgba (Q3 flattened)
const INK_CARD_HI = "#0e0e0e";       // solid hex, not rgba
const BORDER = "#1a1a1a";
const BORDER_HI = "#252525";
const GOLD = "#b8974a";
const GOLD_HI = "#d4c49a";
const GOLD_LO = "#a89770";
const GOLD_MUTE = "#555";
const DIM = "#d4c49a";
const serifDisplay = "'DM Serif Display', Georgia, serif";  // mothballed; eslint-disabled
const sansBody     = "'Syne', system-ui, -apple-system, sans-serif";
```

Mirrors `museum-tokens.css` one-to-one. Every `S.*` inline-style builder (`tab`, `pill`, `pillCount`, `presetsPill`, `presetsPillState`, `presetSlotRow`, `presetSummary`, `presetRowBtn`, `presetCard`, `tabCount`, `resizeHandle`) consumes these constants, so the tab strip / pills / preset chrome / voice badge / press card border / resize handle gradient all pick up the new palette automatically without further JSX edits.

---

## 5. Voice card semantic check (Step 6 / Q4)

**Override path is via CSS class, not inline JSX.** `.hr-card-voice` in `HrExhibitFlow.css` (lines 176–179) sets:

```css
.hr-card-voice {
  background: rgba(50, 38, 14, 0.55) !important;
  border-color: var(--hr-gold-mute) !important;
}
```

The `!important` flag overrides the inline `background: INK_CARD` from `ArtifactCard`'s `baseStyle` builder. Even though `INK_CARD` is now `#0a0a0a` (solid neutral), voice cards keep their warm `rgba(50, 38, 14, 0.55)` background.

**No JSX edits required.** The voice card's "pop" is achieved by changing only the section ink (`--hr-ink: #080808`, was `#0e0b06`) — the warm rgba reads more dramatically against the cooler background, by design. The badge text, badge position, and rgba value are unchanged.

One nuance worth noting for the visual sweep: `.hr-card-voice-badge` and `.hr-card-video-live` both have hardcoded `background: rgba(14, 11, 6, 0.7)` / `rgba(14, 11, 6, 0.8)` overlays — those still reference the OLD warm `--hr-ink: #0e0b06` value as the rgba base. They're not in the variable system and weren't part of the Q5 token extraction. They render as small chips on top of voice/video cards and the rgba opacity is high enough that the rgb mismatch reads as "slightly warmer micro-chip" rather than wrong, but flagging in §8.

---

## 6. ESLint result

```
$ npx eslint src/routes/hr/HrExhibitFlow.jsx src/routes/hr/HrExhibitFlow.css src/styles/museum-tokens.css

src/routes/hr/HrExhibitFlow.css
  0:0  warning  File ignored because no matching configuration was supplied

src/styles/museum-tokens.css
  0:0  warning  File ignored because no matching configuration was supplied

✖ 2 problems (0 errors, 2 warnings)
```

Zero errors on the JSX (the gate). Two CSS warnings are expected — ESLint isn't configured for `.css` files in this project.

(Vite build was not run on the Linux sandbox per the rolldown native binding mismatch note. Mike to validate on Windows.)

---

## 7. Visual sweep checklist for Windows verification

Walk through each state and confirm the deck adopts the carousel's cool-neutral mood with gold accent. Anywhere it still looks warm/amber, flag for follow-up.

- [ ] **Deck closed (peek)** — 14px tab-peek strip showing only top edges. Border color should read cool-gray (`#a89770` golden border on the ~14px peek), no warm-brown.
- [ ] **Deck hovered** — 42px tab strip visible. Hover any tab — border + text should brighten to warm-cream (`#d4c49a`), not bright yellow-gold (`#e8c070`).
- [ ] **Tab "Artist" open** — group columns + lowercase pills. Pills should be cool-neutral when inactive, gold-bordered when active. Active pill text = warm cream `#d4c49a`. Lowercase casing preserved.
- [ ] **Tab "Formats" open** — same as Artist.
- [ ] **Tab "Deep Tracks" open** — group columns + searchbar at top. Searchbar input border = cool gray `#1a1a1a`; focused = `#a89770` gold-lo. Placeholder = mute `#555`.
- [ ] **Tab "Journal" open** — journal subzone. Should look unchanged: `#080808` bg, `#0e0e0e` buttons, Courier Prime body. (These hardcoded carousel-matching values were left alone per spec.)
- [ ] **Tab "Presets" open** — preset slot rows + factory grid + shuffle/loop pills. Slot row borders should be cool-gray; preset card active state = gold border + `#0d0d0d` fill.
- [ ] **Voice cards in grid** — warm `rgba(50, 38, 14, 0.55)` background **survives** against the new `#080808` section ink. The "curator's note" badge text reads in gold. The card should pop more than it did before — that's intentional (Q4).
- [ ] **Press cards in grid** — 2px gold-lo (`#a89770`) left border still visible. Card background transparent, picking up section ink.
- [ ] **Essay cards in grid** — flat solid `#0e0e0e` background (no longer translucent rgba). Should read crisper against section bg.
- [ ] **Photo / Art / Video / Session cards** — internal gradient visuals (lines 232–298 of HrExhibitFlow.css) still hardcode warm browns (`#2d2513`, `#1a140a`, `#3a2e14` etc.). These are card-internal mood pieces, untouched per spec. Confirm they don't clash badly against the new cool section ink.
- [ ] **Hover transitions** — pill hover, tab hover, preset card hover, voice/press card hover. Border-color and text-color should ramp through the new gold values smoothly. Transition timing unchanged (.12s/.15s).
- [ ] **Resize handle** — drag the deck's top edge. Hovered handle should show a gold-lo (`#a89770`) horizontal gradient, was `#7a6230`.
- [ ] **Pill auto-width** — at the resize/measurement step, Syne's metrics will produce slightly different widths than system-sans. Confirm pills still fit columns and don't horizontally overflow. If they do, flag for a font-size pass; do not retune in 4b.
- [ ] **Page title + card titles** — italic, now in DM Serif Display (was Georgia fallback). Should read as a deliberate display face, narrower than Georgia's italic.
- [ ] **Eyebrow / panel-head / pill / tab text** — now in Syne (was system sans). Distinctly geometric, all-caps tabs/eyebrows should read sharper.
- [ ] **AuditStrip (dev only)** — green/red pass/fail signaling unchanged; outside the museum palette.

---

## 8. Open issues / surprises

1. **`.hr-card-voice-badge` and `.hr-card-video-live` rgba bases are stale.** Both use `rgba(14, 11, 6, 0.x)` as a chip background, hardcoding the OLD warm ink value (`#0e0b06`). They're small overlays at high opacity, so the warmth-mismatch reads as a deliberate vignette rather than a bug — but if Mike wants strict palette purity these should be `rgba(8, 8, 8, 0.x)` to match the new `--hr-ink`. Out of 4b scope (Q6 limits this phase to retargeting), flagging for a future pass. Same applies to `.hr-kal-knob-readout` (`rgba(14, 11, 6, 0.92)`, mothballed per STATE.md — won't render in v1).

2. **`.hr-card-photo-vis`, `.hr-card-art-vis`, `.hr-card-video-vis`, `.hr-card-session-vis` gradients hardcode warm browns** (`#2d2513`, `#1a140a`, `#3a2e14`, `#4a3818`, `rgba(200, 160, 80, 0.08)`). These are intentional card-internal "mood plates" rather than deck chrome — left alone per the brief's "don't retune voice/press card values" constraint, but they will now read as warm vignettes inside otherwise cool cards. Visual sweep item §7 calls this out.

3. **`.hr-deck-body` `border-top: 1px solid var(--hr-gold-lo);`** — the top border of the open deck panel now resolves to `#a89770` (was `#7a6230`). Brighter, more visible. Could be desirable (clarifies the deck/grid boundary) or could over-call attention. Flag for visual sweep.

4. **`.knob-wrap`, `.hr-kal-knob`, `.hr-kal-switch*`, `.hr-vu-*`** all consume the `--hr-*` variables — they will now render in the cool palette too. **They are mothballed in v1** (never rendered per STATE.md), so no visible impact, but if/when Kaleidoscope revives the gradient `radial-gradient(circle at 35% 30%, #2a2110, #14100a)` in `.hr-kal-knob` and `background: #120e07` in `.hr-kal-switch` will look out of place against cool surroundings. Flagging for the post-launch revival pass.

5. **Pill auto-width measurement (`measureWidestLabel`, line 411–428)** was not modified. The function uses `getComputedStyle` on a measurement node it appends to the DOM with `font-family: sansBody`. After the swap, `sansBody` resolves to `'Syne', system-ui, …`. If the user's browser has Syne loaded (carousel's @import covers this), the measured widths will be Syne's — which is wider than Geist/system at the same px size. **Pills may render up to ~10–15% wider than before.** The function adapts dynamically, but the column layout assumes a max ~110-pill-width. Visual sweep item: confirm no pill column overflow at common viewport widths.

6. **Tooling note (no action needed):** the bash sandbox's view of files written via the host file tools appeared to lag during this work. ESLint pass above was run after a sync round-trip and reflects the actual file content. If Mike sees a parse error from local lint at line 1612, run `git diff src/routes/hr/HrExhibitFlow.jsx` first to confirm the file ends with `</section>` close — the trailing 13 lines of JSX (PresetsContent props through the function close) should all be present. Final state on disk is verified at 1624 lines.

7. **`--hr-mono` token was added to `museum-tokens.css`** even though no selector consumes it yet. The journal subzone (`.hr-jnl-handle`, `.hr-jnl-text`, `.hr-jnl-entry-*`, `.hr-jnl-btn`, etc.) hardcodes `'Courier Prime', 'Courier New', monospace` ten places. Future DRY pass can swap them to `var(--hr-mono)` — out of 4b scope.

8. **No layout shift detected from the constant rewrite by inspection** — every `S.*` builder uses the constants for color/border/background/font-family but not for sizing. Border widths (`1px`/`2px`), padding, line-height, and font-size are all untouched literals. The only width-sensitive consumer is the runtime pill-width measurement (issue 5).
