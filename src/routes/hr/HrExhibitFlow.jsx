// ─── HR EXHIBIT FLOW — v28_3 deck shape, populated with Hunter Root content ─
// This component renders, as an inline section below the live exhibit's main
// row, an artifact grid above a 6-tab deck. Tab order Artist | Formats |
// Deep Tracks | Presets | Journal | ✕. v28_3's "simplification pass"
// trimmed the prototype's deck to five tabs by retiring Journal; HR keeps
// Journal as an artist-specific extension AFTER the v28_3 functional tabs
// (default-to-last placement, per the Stage 3 visitor-consequence call).
//
// Stage 2 changes (this commit):
//   - Era pill column carries the locked Hunter Root vocabulary in proper
//     case: Run With The Hunt · SEEDS · Medusa's Disco · Hunter Root.
//   - All pill columns render in proper case; the v28 port's CSS lowercase
//     rule has been removed from the pill style and the width-measurement
//     helper.
//   - Slug-to-display resolution lives in hr_dimensions.js (HR_LABELS +
//     displayFor). Slugs are derived from pill labels via slugify(); legacy
//     storage slugs ("medusas" → Medusa's Disco; "solo" → Hunter Root) are
//     paired with their canonical labels so historical data continues to
//     filter without a rewrite.
//
// Phase 1.5 lineage (carried forward unchanged):
//
// Architecture notes:
//   - O4 = (B): inline section. Exhibit.jsx is not edited. The deck sits at
//     the section's bottom via position: sticky; bottom: 0. The grid above
//     scrolls inside the section.
//   - O6 = hybrid: static styles live in HrExhibitFlow.css. Parameterized
//     S.* builders that take props remain as inline JS objects in this file.
//   - O7: localStorage key is `wb-hr-deck-width` (HR-namespaced).
//   - O8: preset snapshots capture player state for display only — APPLY
//     does not restore player state in v1. Comment block at makePresetSnapshot.
//     User slots P1–P3 persist to localStorage (`wb-hr-presets`, controls
//     §9.5 v1); Set fields round-trip via serialize/load helpers there.
//   - O9: Shuffle / Loop pills toggle local state but no-op against the
//     player. Comment block at PresetsContent.
//   - O11: @media(max-width: 720px) hides the deck and falls back to inline
//     stacked pill columns above the artifact grid (HrExhibitFlow.css).
//   - O12: AuditStrip rendered only in import.meta.env.DEV.
//   - O15: GROUP_LABELS reused verbatim from the prototype.
//   - Mothballed Kaleidoscope code: ported, never rendered. Comments mark
//     each block.
// ─────────────────────────────────────────────────────────────────────────────

import {
  useState, useMemo, useLayoutEffect, useEffect, useRef, useCallback,
} from "react";
import { createPortal } from "react-dom";
import "./HrExhibitFlow.css";
import { buildDimensions } from "./hr_dimensions.js";
import EXHIBIT from "../../data/exhibits/hunter_root.json";
import { HR_JOURNAL_PROMPTS } from "../../data/hr_journal_prompts.js";

// ─── EXHIBIT INPUT — artifacts and derived dimensions ──────────────────────
// Phase v5-3+v5-4 (per docs/archive/SPEC_DRAFT_v5.md §4 and
// SPEC_DRAFT_v5_2.md §3). The exhibit's artifact records are exported from
// MediaVault by `npm run export-artifacts` into src/data/exhibits/<name>.json
// and imported here statically — Vite bundles the JSON at build time. No
// build-time read from MV; the operator commits the JSON.
//
// ARTIFACTS replaces the pre-v5 HR_CARDS array. Every reference below that
// used to read HR_CARDS now reads ARTIFACTS.
//
// HR_DIMENSIONS / HR_GROUP_LABELS / displayFor are derived dynamically from
// the union of tag namespaces across ARTIFACTS — `exhibit:` is filtered out
// at the dimension-discovery step (it's a routing tag, not a content tag, per
// v5.2 §3). Adding a new namespace in MV automatically grows the pill columns
// on the next export+build; no museum-side code change required.
const RAW_ARTIFACTS = Array.isArray(EXHIBIT?.artifacts) ? EXHIBIT.artifacts : [];
// ─── Facebook filter facet (2026-05-31) ─────────────────────────────────────
// The 16 source_platform:"facebook" artifacts carry no `source:` tag, unlike
// YouTube / ReverbNation / etc. whose MV export emits source:["youtube"] /
// source:["reverbnation"]. Because every pill column is discovered from
// artifact.tags namespaces (buildDimensions) and matchFilter reads
// item.tags[ns], the FB artifacts never appeared in the tier-2 "Source" column
// (Formats tab) and so were unfilterable — even though YouTube et al. are.
//
// Fix, keyed on source_platform === "facebook" (per kickoff): APPEND a
// "facebook" value to the source tag for every FB-platform artifact at load, so
// all 16 join the SAME Source column as YouTube under one new "Facebook" pill —
// consistent with the existing facet pattern, no new column.
//
// Append, not replace: 13 of the 16 carry no source tag, but 3 cross-posted
// clips (MV-HR-…-008/011/014) already carry other source values
// (distrokid/tiktok/instagram = their content origin). Preserving those keeps
// their existing pills intact while still surfacing them under Facebook — the
// source namespace is multi-value, so an artifact can sit under several source
// pills. This is what makes the Facebook pill match exactly all 16 FB embeds
// while leaving every other pill's membership unchanged.
//
// Front-end only: hunter_root.json is regenerated from MV and stays
// authoritative; this derivation never writes back. Idempotent — skips an
// artifact that already lists "facebook". A shallow clone (+ fresh source array)
// avoids mutating the imported JSON.
const ARTIFACTS = RAW_ARTIFACTS.map(a => {
  if (a && a.source_platform === "facebook") {
    const existing = Array.isArray(a.tags?.source) ? a.tags.source : [];
    if (!existing.includes("facebook")) {
      return { ...a, tags: { ...(a.tags || {}), source: [...existing, "facebook"] } };
    }
  }
  return a;
});
const { HR_DIMENSIONS, HR_GROUP_LABELS, displayFor } = buildDimensions(ARTIFACTS);

// ─── COLOR / FONT TOKENS ────────────────────────────────────────────────────
// Phase 4b: retargeted from the deck's v28 warm-amber palette to the
// canonical museum palette in src/styles/museum-tokens.css. These constants
// mirror the --hr-* CSS variables so every S.* inline-style builder picks up
// the new look automatically.
const INK = "#ece9e0";
const INK_SOFT = "#e2ded3";
const INK_CARD = "#faf8f3";          // solid hex, not rgba (Q3 flattened)
const INK_CARD_HI = "#ffffff";       // solid hex, not rgba
const BORDER = "#c6c2b7";
const BORDER_HI = "#a9a59a";
// 2026-06-07 B&W rework PASS 2 (Mike: light "photo album page"): the ink
// ladder flips to paper stock, the accent constants go photo-black — names
// kept (plumbing), read GOLD as "accent". Single-tone pattern preserved.
const GOLD = "#211f1c";
const GOLD_HI = "#000000";  // synced to --hr-gold-hi (deepest tier)
const GOLD_LO = "#57544d";  // synced to --hr-gold-lo (dim tier)
const GOLD_MUTE = "#9b978d";
const DIM = "#3b3933";       // synced to --hr-dim (body)
// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
// Kaleidoscope LED palette — re-tuned to v17's museum gold, not v3's neon.
// (Used inline by the mothballed VuMeter, which is never rendered.)
const LED_OFF = "#1f1a0e";
const LED_GREEN = "#8a9a4a";
const LED_YELLOW = "#c8a050";
const LED_RED = "#c86040";
// Reference these to silence no-unused-vars while keeping them on hand for
// the post-launch Kaleidoscope revival.
void [LED_OFF, LED_GREEN, LED_YELLOW, LED_RED];

// Stage 3: deck typography matches v28_3 (Fraunces + Geist), scoped to the
// .hr-section subtree via CSS variable override in HrExhibitFlow.css. These
// JS constants drive inline-styled card text (PhotoCard / VideoCard /
// PressCard / EssayCard / SessionCard / ArtCard titles + meta) and the
// pill-width measurement helper, all of which paint inside .hr-section so
// staying inside the same font pair keeps the deck visually coherent.
// Fallback chain ends at system serif / sans so the deck remains legible
// even if the Google Fonts request fails.
// eslint-disable-next-line no-unused-vars -- preserved for future serif-display use; see comment block above
const serifDisplay = "'Fraunces', Georgia, serif";
const sansBody = "'Geist', system-ui, -apple-system, sans-serif";

// ─── DECK CONSTANTS — preserved from v28, STORAGE_KEY HR-namespaced ─────────
const TAB_PEEK = 30;  // === full strip; previously 14 (1/3 peek) but labels were clipped
const TAB_STRIP_H = 30;
const DECK_MIN_H = 200;
const DECK_MAX_FRAC = 0.75;
const DECK_DEFAULT_H_SHARED = 480;
const STORAGE_KEY = "wb-hr-deck-width"; // O7 — matches wb-hr-split / wb-hr-cfh
// Preset persistence (UX_CONTROLS_SPEC v0.4 §9.5: v1 = localStorage,
// exhibit-scoped, no login). HR-namespaced per O7 convention, so the key is
// exhibit-scoped by construction. Lifecycle §4.5's MV-artifact promotion is
// a later phase; this key/format is the v1 store it would migrate from.
const PRESETS_STORAGE_KEY = "wb-hr-presets";
// Persisted-snapshot format version. Bump when the saved shape changes so
// loadUserPresets can migrate. v1 nulls player-state on load (lifecycle §4.5
// promotion will read this). See PRESET_COMPARE_PASS.
const PRESET_SCHEMA_VERSION = 1;
const HOVER_DELAY_OPEN = 60;
const HOVER_DELAY_CLOSE = 450;

// §5 #3 idle auto-return (Option A, Mike 2026-06-07): with a Show peek up,
// a jukebox SONG CHANGE while the visitor has been idle this long returns
// the wall to the Active View on its own (automatic Now Playing, spec §3).
// Spec §3 originally said "advances to a new album", but the play queue is
// album-scoped and never leaves the album by itself — trigger locked to
// song change + idle instead. Timing is a feel value; tune here.
const IDLE_RETURN_MS = 8000;

// ─── TABS — six entries; Journal sits last among functional tabs ────────────
// Stage 3 placement: Journal sits AFTER the v28_3 functional tabs in their
// v28_3 order (Artist · Formats · Deep Tracks · Presets), then ✕. This is
// the "default to last" call from the visitor-consequence brief — v28_3
// doesn't include Journal, so there's no more-natural insertion point to
// surface; Journal becomes the right-most non-close tab. Was position 4
// (between Deep Tracks and Presets) in Stage 2; moved to position 5 here.
const TABS = [
  // TABS-OUT Stage A (2026-06-15): the three tier-depth tabs (Artist / Source /
  // Deep Tracks) collapse into ONE always-grouped Board surface -- all five
  // TOTAL facets visible at once, no depth-tabs. Authority:
  // docs/filter-instrument-reference.html renderBoard() + the TABS-OUT brief 5.
  // matchFilter, PillGroupColumn and PresetsContent are untouched; only the
  // layout shell changes. Stage B adds the Detail (partials) zone; Stage D
  // folds Presets into the v7_1 Threads strip.
  { key: "board",   label: "Filters",  kind: "special", special: "board",   width: 56 },
  { key: "presets", label: "Presets",  kind: "special", special: "presets", width: 110 },
  { key: "journal", label: "Journal",  kind: "special", special: "journal", width: 110 },
];

// --- TABS-OUT board model (Stage A) -----------------------------------------
// The Basic surface renders the five TOTAL facets in this fixed order
// (renderBoard order, brief 3): Kind, Topic, Era, Project/Band, Format --
// mapped to live tag namespaces. Grouping is by TOTAL vs PARTIAL, NOT by
// vocabulary tier (the live tiers are mismatched: content_kind=3, format=2,
// era/topic/bands=1; tier-grouping would scatter these five across three
// columns). Facets absent from the live data are skipped at render time.
const BOARD_TOTAL_KEYS = ["content_kind", "topic", "era", "bands", "format"];
// Container cards (album x9 + gallery x1) carry content_kind:"other" and are
// exempt from Kind (discovery-metadata-spec.md 4). "other" is never a
// visitor-facing Kind pill, so it is dropped from the Kind column's values
// (8 discovered -> 7 real kinds).
const KIND_SUPPRESSED_VALUES = new Set(["other"]);
// Resolved once at module load (HR_DIMENSIONS is module-constant). Each entry
// is { key, values }; the Kind column drops "other"; columns with no live
// values are omitted so empty namespaces never reserve a header.
const BOARD_COLUMNS = (() => {
  const byKey = {};
  HR_DIMENSIONS.forEach(d => { byKey[d.key] = d; });
  return BOARD_TOTAL_KEYS
    .map(key => byKey[key])
    .filter(Boolean)
    .map(dim => ({
      key: dim.key,
      values: dim.key === "content_kind"
        ? dim.values.filter(v => !KIND_SUPPRESSED_VALUES.has(v))
        : dim.values,
    }))
    .filter(col => col.values.length > 0);
})();

// v7_1 pop-over (2026-06-15): the Detail (partials) zone. The reference's ADV
// surface is album · song · venue · source · people; HR's live data carries
// album/source/people only (song + venue are untagged → null-exempt, skipped
// per brief §3). Resolved like BOARD_COLUMNS: live dim values, absent facets
// omitted. "other" is NOT suppressed on source (only Kind drops it).
const DETAIL_PARTIAL_KEYS = ["album", "source", "people"];
const DETAIL_COLUMNS = (() => {
  const byKey = {};
  HR_DIMENSIONS.forEach(d => { byKey[d.key] = d; });
  return DETAIL_PARTIAL_KEYS
    .map(key => byKey[key])
    .filter(Boolean)
    .map(dim => ({ key: dim.key, values: dim.values }))
    .filter(col => col.values.length > 0);
})();
// Format-medium glyphs, lifted from the v7_1 reference's format facet. Live
// format values are photo/text/video/web; audio (♪) is mapped for parity but
// not present in the current export.
const HRFI_FORMAT_ICONS = { photo: "◧", video: "▷", audio: "♪", text: "¶", web: "◍" };

// ─── FACTORY PRESETS — adapted to HR's dimensions ───────────────────────────
// 2026-06-07 repair (verified live on weird.baby/hr): the v28-ported recipes
// filtered on namespaces this exhibit's export does not carry (src/era/type
// with values press/stage/seeds/video). matchFilter only reads the discovered
// HR_DIMENSIONS (album/people/bands/source/content_kind/card_kind), so four
// of five presets committed an empty filter — silent no-ops on desktop and
// mobile (gold highlight, wall unchanged). Repaired where the catalog
// supports the intent: "Years past" → the Medusa's Disco chapter via album
// tags (the recipe's era:medusas intent). Removed the three with no
// filterable equivalent — press/stage/video content is not tagged in the v5
// export (only in `unsorted`, which buildDimensions excludes). Re-add by
// recipe only when the export carries the tags.
const FACTORY_PRESETS = [
  {
    key: "surprise", label: "Surprise me", desc: "a handful at random",
    apply: () => {
      const ids = ARTIFACTS.map(c => c.id).sort(() => Math.random() - 0.5).slice(0, 3);
      return { __randomIds: new Set(ids) };
    },
  },
  {
    key: "deephist", label: "Years past", desc: "the older catalog",
    apply: () => ({ album: new Set(["medusas_disco"]) }),
  },
];

// Entry preset (v23): all tags OFF. Empty-group-silent rule means every
// group is silent at rest, so the full catalog is visible.
function makeEntrySelection() {
  const out = {};
  HR_DIMENSIONS.forEach(({ key }) => { out[key] = new Set(); });
  return out;
}

// ─── KALEIDOSCOPE — MOTHBALLED for v1 per STATE.md; do not render ───────────
// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
// State, recipe, and config preserved so the next Kaleidoscope session
// can reuse the API.
const KAL_STATE_DEFAULT = {
  depth: 0.5, breadth: 0.5, jitter: 0,
};
const KAL_KNOBS = [
  { id: "depth",   label: "Depth" },
  { id: "breadth", label: "Breadth" },
  { id: "jitter",  label: "Jitter" },
];

// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
function pseudoRandom(id, salt) {
  let h = 2166136261;
  const s = `${id}|${salt}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 10000) / 10000;
}

// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
// eslint-disable-next-line no-unused-vars
function runKaleidoscopeRecipe(kalState, items) {
  const SURFACE_TYPES = ["post", "photo", "review"];
  const DEEP_TYPES    = ["analysis", "interview", "art", "cover", "update"];
  const dOff = (kalState.depth   - 0.5) * 2;
  const bOff = (kalState.breadth - 0.5) * 2;
  return items.filter(item => {
    if (dOff < 0 && DEEP_TYPES.includes(item.type)) {
      if (pseudoRandom(item.id, "d_deep") < Math.abs(dOff) * 0.85) return false;
    } else if (dOff > 0 && SURFACE_TYPES.includes(item.type)) {
      if (pseudoRandom(item.id, "d_surf") < dOff * 0.85) return false;
    }
    if (bOff < 0 && item.media !== "audio" && item.media !== "video") {
      if (pseudoRandom(item.id, "b_nonmusic") < Math.abs(bOff) * 0.9) return false;
    }
    return true;
  }).filter(item => {
    if (kalState.jitter <= 0) return true;
    return pseudoRandom(item.id, "r") > kalState.jitter * 0.7;
  });
}

// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
// eslint-disable-next-line no-unused-vars
function kalIsDefault(k) {
  return k.depth === 0.5 && k.breadth === 0.5 && k.jitter === 0;
}

// ─── PARAMETERIZED STYLES — kept inline per O6 (hybrid CSS strategy) ────────
// Static styles live in HrExhibitFlow.css (.hr-* classes). Parameterized
// builders that take props (active state, widths, open state, deckW, etc.)
// stay here as inline JS objects.
const S = {
  // panelPos: positions the artifact-grid pane above the deck. deckW changes
  // as the deck peeks / opens / resizes.
  panelPos: (deckW) => ({
    position: "absolute", right: 0, top: 0, bottom: 0, left: deckW + "px",
  }),

  // deck: bottom-anchored. height swings between TAB_PEEK / TAB_STRIP_H /
  // resizable open height.
  deck: (deckW) => ({
    /* `position: fixed` so the deck pins to the viewport bottom
       regardless of the section's scroll-snap-align: center. With
       `absolute` it followed the section, which is centered in the
       viewport with a 32px gap above and below — that gap pushed the
       tabs 32px above viewport bottom. */
    position: "relative",
    width: "100%",
    background: "transparent",
    zIndex: 10,
    pointerEvents: "none",
    /* `left` (rail dock) + `bottom` are set by .hr-deck in HrExhibitFlow.css;
       `bottom` stays conditional on whether the player bar is in the DOM (60
       when playing, 0 when not).
       Clip the tab strip's bottom-overhang at the deck's bottom edge.
       The strip is 42px tall but the closed-idle deck is only 14px
       (TAB_PEEK), so 28px hangs below. Without overflow:hidden the
       hangover is visible in any gap between deck and viewport (or
       deck and player bar). Original layout relied on the viewport
       edge for this clip; explicit clip is more robust. */
    overflow: "hidden",
  }),

  // tab: per-tab chrome. Active = bright + bold + INK_SOFT fill, no
  // bottom rule under tab (cover element below merges with deck-body).
  // Inactive = GOLD_LO border + dim text. isClose = small ✕ tab.
  tab: (active, deckOpen, width, isClose) => {
    const borderColor = active ? GOLD_HI : GOLD_LO;
    const textColor   = active ? GOLD_HI : DIM;
    return {
      position: "relative",  // anchor for the active-tab bottom-cover
      cursor: "pointer", fontFamily: sansBody,
      fontSize: isClose ? "14px" : "10.5px",
      letterSpacing: isClose ? "0" : "0.12em",
      textTransform: isClose ? "none" : "uppercase",
      fontWeight: active ? 900 : 500,
      color: textColor,
      background: active ? INK_SOFT : INK,
      border: `1px solid ${borderColor}`, borderLeft: "none",
      borderTopRightRadius: "6px", borderBottomRightRadius: "6px",
      writingMode: "vertical-rl", textOrientation: "mixed",
      width: "auto", minWidth: TAB_STRIP_H + "px", height: "auto",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "6px",
      transition: "border-color 0.12s, color 0.12s, font-weight 0.12s, background 0.12s",
      padding: "6px 0", boxSizing: "border-box",
      ...(isClose ? { flexShrink: 0 } : { flex: "1 1 0", flexShrink: 1 }), marginBottom: "2px",
      whiteSpace: "nowrap", overflow: "visible", textOverflow: "ellipsis",
    };
  },

  // resizeHandle: ew-resize affordance at right edge of the rail body.
  resizeHandle: (hovered) => ({
    position: "absolute", right: "-4px",
    top: 0, bottom: 0, width: "8px",
    cursor: "ew-resize", zIndex: 14,
    background: hovered
      ? `linear-gradient(to right, transparent 0%, ${GOLD_LO} 45%, ${GOLD_LO} 55%, transparent 100%)`
      : "transparent",
    transition: "background 0.15s",
  }),

  // pill: per-pill chrome inside group columns. active / zero / pillWidth /
  // noneSelected (true when the pill's column has zero selections, which
  // is functionally "all-selected" — no filter active. Display: gold text
  // like active, but no border box.)
  pill: (active, zero, pillWidth, noneSelected) => ({
    fontFamily: sansBody, fontSize: "11.5px", fontWeight: 500,
    letterSpacing: "0.02em", padding: "0 10px",
    height: "26px", lineHeight: "24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "8px",
    width: pillWidth ? `${pillWidth}px` : "auto",
    minWidth: pillWidth ? `${pillWidth}px` : "auto",
    boxSizing: "border-box", borderRadius: 0,
    border: `1px solid ${active ? GOLD : (zero ? "transparent" : (noneSelected ? "transparent" : BORDER))}`,
    background: active ? INK_SOFT : "transparent",
    color: active ? GOLD_HI : (zero ? BORDER_HI : (noneSelected ? GOLD_HI : "#6e6e6e")),
    opacity: zero ? 0.2 : 1,
    pointerEvents: zero ? "none" : "auto",
    cursor: zero ? "default" : "pointer",
    transition: "border-color 0.12s, color 0.12s, background 0.12s, opacity 0.12s",
    /* Stage 2 (v28_3): pill labels render in the canonical proper-case
       strings supplied by HR_LABELS — locked Era vocabulary requires it,
       and Mike's call extends "proper case" across every pill column for
       typographic consistency. The CSS lowercase rule that lived here in
       the v28 port has been removed. */
    userSelect: "none",
  }),

  pillCount: (active, zero, noneSelected) => ({
    fontSize: "10px", fontWeight: 500,
    // Match the label color exactly so number and word read as one tone.
    color: active ? GOLD_HI : (zero ? BORDER_HI : (noneSelected ? GOLD_HI : "#6e6e6e")),
    fontVariantNumeric: "tabular-nums",
  }),

  // presetsPill: "shuffle" / "loop" pill switches.
  presetsPill: (on) => ({
    fontFamily: sansBody, fontSize: "11.5px", fontWeight: 500,
    letterSpacing: "0.02em", padding: "0 12px",
    height: "28px", lineHeight: "26px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "10px",
    boxSizing: "border-box", borderRadius: 0,
    border: `1px solid ${on ? GOLD : BORDER}`,
    background: on ? INK_SOFT : "transparent",
    color: on ? GOLD_HI : DIM,
    cursor: "pointer", userSelect: "none",
    /* Stage 2 (v28_3): proper-case across every pill, including the
       Shuffle / Loop player switches in the Presets tab. */
    transition: "border-color 0.12s, color 0.12s, background 0.12s",
    minWidth: "110px",
  }),
  presetsPillState: (on) => ({
    fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase",
    color: on ? GOLD : GOLD_LO, fontWeight: 500, fontVariantNumeric: "tabular-nums",
  }),

  // presetSlotRow: filled/empty grid layout for P1/P2/P3 slots.
  presetSlotRow: (hasContent) => ({
    display: "grid",
    gridTemplateColumns: "56px 1fr auto auto auto",
    gap: "10px", alignItems: "center", padding: "10px 12px",
    border: `1px solid ${hasContent ? BORDER_HI : BORDER}`,
    background: "transparent", transition: "border-color 0.15s",
  }),
  presetSummary: (empty) => ({
    fontSize: "11.5px", color: empty ? GOLD_MUTE : DIM,
    fontStyle: empty ? "italic" : "normal", letterSpacing: "0.02em",
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", minWidth: 0,
  }),
  presetRowBtn: (enabled, primary) => ({
    background: "transparent",
    border: `1px solid ${enabled ? (primary ? GOLD_LO : BORDER_HI) : BORDER}`,
    color: enabled ? (primary ? GOLD : DIM) : GOLD_MUTE,
    fontFamily: sansBody, fontSize: "10px", letterSpacing: "0.2em",
    textTransform: "uppercase", fontWeight: 500, padding: "5px 10px",
    cursor: enabled ? "pointer" : "default",
    transition: "color 0.15s, border-color 0.15s",
    whiteSpace: "nowrap", flexShrink: 0,
  }),
  presetCard: (active) => ({
    padding: "12px 14px",
    border: `1px solid ${active ? GOLD : BORDER}`,
    background: active ? INK_SOFT : "transparent",
    cursor: "pointer", transition: "all 0.14s",
    display: "flex", flexDirection: "column", gap: "3px",
  }),
  tabCount: (active) => ({
    fontSize: "9px", color: active ? GOLD_HI : GOLD_LO,
    fontVariantNumeric: "tabular-nums", fontWeight: 500, marginLeft: "2px",
  }),
};

// spanStyle — converts span_w / span_h hints into grid placement.
// Phase C (per operator-locked aspect rule 2026-05-22): cards have
// per-media-type aspect ratios locked in CSS. JS only controls how many
// columns a card spans; height comes from aspect-ratio * computed width.
// The old span_h (sm/md/lg/xl row-count mapping) is retired.
const spanStyle = (w) => {
  return { gridColumn: `span ${w}` };
};

// ─── FILTER LOGIC — v5.1 Patch 3 rewrite ────────────────────────────────────
// LOCKED rule (docs/FILTER_LOGIC_DECISION.md, unchanged): within-group OR,
// across-group AND, empty-group-silent.
//
// What changed under v5: matchFilter used to read fields directly on the card
// object (`item.era`, `item.mood`, `String(item.year)`). v5 artifact records
// carry tags nested under `item.tags[namespace]` as string arrays —
// `item.tags.era = ["solo"]`, `item.tags.mood = ["snarky", "wistful"]`. Every
// dimension is functionally `kind: "multi"` now (a single tag value just
// lives in a one-element array), so the matcher is uniform across columns.
//
// `year` no longer has a special path: if year-based filtering is wanted,
// the operator emits `year:<value>` tags from MV and they discover into a
// pill column like any other namespace.
function itemHasTag(item, group, tag) {
  const arr = item?.tags?.[group];
  return Array.isArray(arr) && arr.includes(tag);
}

function matchFilter(item, selected) {
  if (selected.__randomIds) return selected.__randomIds.has(item.id);
  for (const { key } of HR_DIMENSIONS) {
    const sel = selected[key];
    if (!(sel instanceof Set) || sel.size === 0) continue;
    const arr = item?.tags?.[key];
    if (!Array.isArray(arr)) return false;
    let carries = false;
    for (const v of arr) {
      if (sel.has(v)) { carries = true; break; }
    }
    if (!carries) return false;
  }
  return true;
}

function countForPill(items, selected, group, tag) {
  if (selected.__randomIds) return items.filter(i => itemHasTag(i, group, tag)).length;
  const probe = cloneSelected(selected);
  probe[group] = new Set([tag]);
  return items.filter(i => matchFilter(i, probe)).length;
}

function cloneSelected(sel) {
  const out = {};
  for (const k of Object.keys(sel)) {
    if (k === "__randomIds") out.__randomIds = new Set(sel.__randomIds);
    else out[k] = new Set(sel[k] ?? []);
  }
  return out;
}

// Helper preserved for parity with the v28 prototype API; not currently
// consumed (anyTagSelected in HrExhibitFlow inlines an equivalent check).
// eslint-disable-next-line no-unused-vars
function selectedIsEmpty(sel) {
  if (sel.__randomIds && sel.__randomIds.size > 0) return false;
  for (const { key } of HR_DIMENSIONS) if (sel[key]?.size > 0) return false;
  return true;
}

function presetSummaryText(p) {
  if (!p) return "empty";
  if (p.__randomIds) return `${p.__randomIds.size} random artifacts`;
  const parts = [];
  // Stage 2: preset summaries render the canonical proper-case label per
  // (group, slug) so what the visitor saved reads back the way they saw
  // it onstage. Falls through displayFor to the hyphens-to-spaces default
  // for any unknown group.
  if (p.selected) {
    for (const { key } of HR_DIMENSIONS) {
      if (p.selected[key]?.size) {
        parts.push(`${HR_GROUP_LABELS[key] || key}: ${[...p.selected[key]].map(s => displayFor(key, s)).join(", ")}`);
      }
    }
  } else {
    for (const { key } of HR_DIMENSIONS) {
      if (p[key]?.size) {
        parts.push(`${HR_GROUP_LABELS[key] || key}: ${[...p[key]].map(s => displayFor(key, s)).join(", ")}`);
      }
    }
  }
  const flags = [];
  if (p.shuffle) flags.push("shuffle");
  if (p.loop) flags.push("loop");
  const body = parts.join("  /  ") || "no tags";
  return flags.length ? `${body}  ·  ${flags.join(" + ")}` : body;
}

// §5 #4 naming (Option A, Mike 2026-06-07): slots carry a visitor-editable
// name, AUTOPOPULATED at save so naming never demands input. Default derives
// from the snapshot's most distinctive content: the first selected tag's
// display label (+N when more), "N random artifacts" for a surprise capture,
// "everything" for a no-filter capture.
function defaultPresetName(snap) {
  const sel = snap?.selected;
  if (sel?.__randomIds) return `${sel.__randomIds.size} random artifacts`;
  const parts = [];
  if (sel) {
    for (const { key } of HR_DIMENSIONS) {
      if (sel[key]?.size) for (const s of sel[key]) parts.push(displayFor(key, s));
    }
  }
  if (!parts.length) return "everything";
  return parts.length === 1 ? parts[0] : `${parts[0]} +${parts.length - 1}`;
}

// Preset snapshot (UX_PRESETS_SPEC s8.2): playingTrack and spinePosition are
// the REAL player state, crossed from Exhibit.jsx as props. playingTrack is
// { albumId, trackId, variantId } (stable ids); spinePosition is the focused
// album's stable id.
function makePresetSnapshot({ selected, shuffle, loop, playingTrack, spinePosition }) {
  return {
    selected: cloneSelected(selected),
    shuffle: !!shuffle,
    loop: !!loop,
    playingTrack: playingTrack ? { ...playingTrack } : null,
    // O8/SPINE: store focused album by STABLE id, never by derived-spine index
    // (the index ordering changed when SPINE was retired). Sourced live from
    // the activeAlbumId prop on the Exhibit.jsx seam.
    focusedAlbumId: spinePosition?.albumId ?? (typeof spinePosition === "string" ? spinePosition : null),
    schemaVersion: PRESET_SCHEMA_VERSION,
    savedAt: Date.now(),
  };
}

// ─── PRESET PERSISTENCE — localStorage round-trip (controls §9.5 v1) ─────────
// Snapshots hold Sets (selected[group], optional __randomIds), which JSON
// drops silently — so serialization converts Sets ⇄ arrays explicitly.
// Hydration is defensive: any slot that doesn't parse back to the expected
// shape loads as empty rather than crashing the deck. Note the SPINE caveat:
// persisted playingTrack/spinePosition predate the derived spine and are
// display-only (O8); APPLY never reads them in v1.
function serializeSelected(sel) {
  if (!sel || typeof sel !== "object") return null;
  const out = {};
  for (const k of Object.keys(sel)) {
    out[k] = sel[k] instanceof Set ? [...sel[k]] : [];
  }
  return out;
}

function deserializeSelected(raw) {
  if (!raw || typeof raw !== "object") return null;
  const out = {};
  for (const k of Object.keys(raw)) {
    out[k] = new Set(Array.isArray(raw[k]) ? raw[k] : []);
  }
  return out;
}

// Single-snapshot wire shape — shared by localStorage persistence and the
// §0 share payload (POST /api/presets), so a shared preset is byte-for-byte
// the same thing a saved slot is.
function serializeSnapshot(p) {
  return {
    selected: serializeSelected(p.selected),
    name: typeof p.name === "string" ? p.name : null, // §5 #4
    shuffle: !!p.shuffle,
    loop: !!p.loop,
    playingTrack: p.playingTrack ?? null,
    focusedAlbumId: p.focusedAlbumId ?? null,
    schemaVersion: p.schemaVersion ?? PRESET_SCHEMA_VERSION,
    savedAt: p.savedAt ?? null,
  };
}

// Defensive single-snapshot hydration — mirrors the loadUserPresets slot
// rules (malformed → null rather than crash; focusedAlbumId honored only on
// schemaVersion >= 1 records). Used for incoming shared presets.
function deserializeSnapshot(raw) {
  if (!raw || typeof raw !== "object") return null;
  const selected = deserializeSelected(raw.selected);
  if (!selected) return null;
  return {
    selected,
    name: typeof raw.name === "string" ? raw.name : null,
    shuffle: !!raw.shuffle,
    loop: !!raw.loop,
    playingTrack:
      raw.playingTrack && typeof raw.playingTrack === "object" ? raw.playingTrack : null,
    focusedAlbumId:
      raw.schemaVersion >= 1 && typeof raw.focusedAlbumId === "string" ? raw.focusedAlbumId : null,
    schemaVersion: PRESET_SCHEMA_VERSION,
    savedAt: typeof raw.savedAt === "number" ? raw.savedAt : null,
  };
}

function serializeUserPresets(presets) {
  const out = {};
  for (const slot of ["P1", "P2", "P3"]) {
    const p = presets?.[slot];
    out[slot] = p ? serializeSnapshot(p) : null;
  }
  return out;
}

function loadUserPresets() {
  const empty = { P1: null, P2: null, P3: null };
  try {
    if (typeof localStorage === "undefined") return empty;
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return empty;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return empty;
    const out = { ...empty };
    for (const slot of ["P1", "P2", "P3"]) {
      const p = parsed[slot];
      if (!p || typeof p !== "object") continue;
      const selected = deserializeSelected(p.selected);
      if (!selected) continue; // malformed slot → load as empty
      out[slot] = {
        selected,
        // §5 #4: pre-naming records hydrate with name null; the UI falls
        // back to the filter summary until the visitor edits or re-saves.
        name: typeof p.name === "string" ? p.name : null,
        shuffle: !!p.shuffle,
        loop: !!p.loop,
        playingTrack:
          p.playingTrack && typeof p.playingTrack === "object" ? p.playingTrack : null,
        // Pre-version records (shipped before schemaVersion existed) carried a
        // spinePosition index into the now-dead spine ordering. Upgrade-on-load:
        // drop the stale index, null the id-based field. Self-heals the format.
        focusedAlbumId:
          p.schemaVersion >= 1 && typeof p.focusedAlbumId === "string" ? p.focusedAlbumId : null,
        schemaVersion: PRESET_SCHEMA_VERSION,
        savedAt: typeof p.savedAt === "number" ? p.savedAt : null,
      };
    }
    return out;
  } catch {
    return empty;
  }
}

// Stage 2 (v28_3): the v28 port's local prettyTag(tag) helper has been
// retired. All pill rendering and the Deep Tracks search now route through
// displayFor(group, slug) imported from hr_dimensions.js, so the locked Era
// vocabulary and the proper-case labels in HR_LABELS reach the screen
// unaltered. displayFor falls back to a hyphens-to-spaces transform for
// any slug that isn't in the labels table — same shape the old prettyTag
// produced — so unmapped values still render readably.

function measureWidestLabel(labels) {
  if (typeof window === "undefined") return 100;
  const span = document.createElement("span");
  Object.assign(span.style, {
    position: "absolute", visibility: "hidden", whiteSpace: "nowrap",
    fontFamily: sansBody, fontSize: "11.5px", fontWeight: "500",
    letterSpacing: "0.02em",
    /* Stage 2: pill labels render proper-case; the measurement string
       must be sized in the same casing the pill will actually display
       so widths line up with reality. textTransform removed. */
  });
  document.body.appendChild(span);
  let max = 0;
  labels.forEach(l => {
    span.textContent = l;
    const w = span.getBoundingClientRect().width;
    if (w > max) max = w;
  });
  document.body.removeChild(span);
  return Math.ceil(max);
}

// Stage 3: pill width is per-column, not global. Each PillGroupColumn
// measures its OWN widest label and sizes its pills to fit. Stage 2 used
// a single global width across every dimension, which worked while every
// column's longest label was short (Era's "Run With The Hunt" was the
// outlier at ~17 chars). With the v28_3 column complement restored, the
// Album column carries "They Finally Cracked Me" / "Mimicking the Sun
// Like Dandelions" / "Skipping Stones That Sink Before They're Thrown"
// — pushing the global measurement to ~400px and bloating Era / Year /
// Type pills along with it. Per-column scoping keeps each column tight
// to its own vocabulary; long-labeled columns get wide pills, short-
// labeled columns stay narrow, and they don't poison each other.
function useColumnPillWidth(group, values) {
  const [width, setWidth] = useState(120);
  // setState-in-effect is intentional: measureWidestLabel needs a mounted
  // DOM (it appends a hidden span). Runs whenever the column's values
  // change (rare — only on dimension restructure or HMR).
  useLayoutEffect(() => {
    if (!values || values.length === 0) {
      // Empty-vocab column (people / venue / format / media / provenance /
      // odds today). No pills to size; leave the width at the floor so the
      // empty column doesn't reserve hundreds of pixels of layout space.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setWidth(0);
      return;
    }
    const maxCount = ARTIFACTS.length;
    const labels = values.map(v => `${displayFor(group, v)}   ${maxCount}`);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setWidth(measureWidestLabel(labels) + 20 + 8 + 6);
  }, [group, values]);
  return width;
}

// ─── PILL COMPONENTS — ported from v28, label-resolution updated for v28_3 ──
// Stage 2 (v28_3): the `label` prop is the already-resolved display string
// (proper-case, locked vocab applied). Callers pass displayFor(group, slug)
// rather than the raw slug. The button's title attribute and visible text
// both use the same resolved label, so the locked vocabulary reaches the
// screen unaltered and tooltips read the same as the pill face.
function PillButton({ label, count, active, zero, pillWidth, noneSelected, onClick }) {
  return (
    <button
      style={S.pill(active, zero, pillWidth, noneSelected)}
      onClick={() => !zero && onClick()}
      disabled={zero}
      aria-pressed={active}
      title={label}
    >
      <span className="hr-pill-label">{label}</span>
      <span style={S.pillCount(active, zero, noneSelected)}>{count}</span>
    </button>
  );
}

function PillGroupColumn({ group, values, items, selected, toggle }) {
  // Stage 3: each column owns its own pill width. See useColumnPillWidth
  // for why this isn't global anymore. Empty-vocab columns get width=0
  // so they don't reserve layout space — only the header renders.
  const columnPillWidth = useColumnPillWidth(group, values);
  const counts = useMemo(() => {
    const map = {};
    values.forEach(v => { map[v] = countForPill(items, selected, group, v); });
    return map;
  }, [values, items, selected, group]);
  // No selections in this column == "all selected" (no filter applied).
  // Pills then render in the selected color (GOLD_HI) with no border box.
  const noneSelected = !(selected[group] instanceof Set) || selected[group].size === 0;
  return (
    <div className="hr-group-column">
      <span className="hr-group-column-label">{HR_GROUP_LABELS[group] || group}</span>
      {values.map(v => {
        const active = selected[group]?.has(v) ?? false;
        const zero = !active && counts[v] === 0;
        return (
          <PillButton
            key={v}
            label={displayFor(group, v)}
            count={counts[v]}
            active={active}
            zero={zero}
            pillWidth={columnPillWidth}
            noneSelected={noneSelected}
            onClick={() => toggle(group, v)}
          />
        );
      })}
    </div>
  );
}

// ─── KALEIDOSCOPE — MOTHBALLED for v1; never rendered ───────────────────────
// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
// Knob, PillSwitch, VuMeter, KaleidoscopeContent — preserved API for revival.
// eslint-disable-next-line no-unused-vars
function Knob({ id, label, value, onChange }) {
  const wrapRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const deg = value * 270 - 135;
  const readoutVal = Math.round(value * 100);
  const onMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX, startY = e.clientY, startVal = value;
    setDragging(true);
    const onMove = (ev) => {
      const dx = (ev.clientX - startX) / 150;
      const dy = (startY - ev.clientY) / 150;
      const next = Math.max(0, Math.min(1, startVal + dx + dy));
      onChange(next);
    };
    const onUp = () => {
      setDragging(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };
  return (
    <div className="hr-kal-block">
      <div ref={wrapRef} className={"knob-wrap" + (dragging ? " dragging" : "")}
           onMouseDown={onMouseDown}
           role="slider" aria-label={label} aria-valuenow={readoutVal}>
        <div className="hr-kal-knob">
          <div className="hr-kal-knob-indicator" style={{ transform: `translateX(-50%) rotate(${deg}deg)` }} />
        </div>
        <div className="hr-kal-knob-readout">{readoutVal}</div>
      </div>
      <div className="hr-kal-block-label">{label}</div>
    </div>
  );
}

// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
// eslint-disable-next-line no-unused-vars
function PillSwitch({ id, label, value, onChange }) {
  return (
    <div className="hr-kal-block">
      <div
        className={"hr-kal-switch" + (value ? " on" : "")}
        onClick={() => onChange(!value)}
        role="switch" aria-checked={value} aria-label={label}
      >
        <div className={"hr-kal-switch-knob" + (value ? " on" : "")} />
      </div>
      <div className="hr-kal-block-label">{label}</div>
    </div>
  );
}

// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
function VuMeter({ percent }) {
  const [current, setCurrent] = useState(percent);
  const [peak, setPeak] = useState(0);
  /* eslint-disable react-hooks/purity -- VuMeter is MOTHBALLED for v1; never
     rendered. The performance.now() call in the ref initializer would trip
     react-hooks/purity if mounted. Disabled until post-launch revival. */
  const stateRef = useRef({
    current: percent, target: percent, peak: 0, peakHold: 0,
    lastFrame: typeof performance !== "undefined" ? performance.now() : 0,
  });
  /* eslint-enable react-hooks/purity */

  useEffect(() => {
    const st = stateRef.current;
    const jump = percent - st.target;
    if (Math.abs(jump) > 2) {
      const popMag = Math.min(Math.abs(jump) * 0.4, 8);
      st.current = Math.min(100, percent + (jump > 0 ? popMag : 0));
    } else {
      st.current = percent;
    }
    st.target = percent;
    const currentSeg = Math.round((st.current / 100) * 12);
    if (currentSeg > st.peak) { st.peak = currentSeg; st.peakHold = 800; }
    setCurrent(st.current);
    setPeak(st.peak);
  }, [percent]);

  useEffect(() => {
    let rafId;
    const tick = (now) => {
      const st = stateRef.current;
      const dt = now - st.lastFrame;
      st.lastFrame = now;
      let changed = false;
      if (Math.abs(st.current - st.target) > 0.1) {
        const delta = st.target - st.current;
        st.current += delta * Math.min(1, dt / 120);
        changed = true;
      }
      if (st.peakHold > 0) {
        st.peakHold -= dt;
      } else if (st.peak > 0) {
        st.peak -= dt / 400;
        if (st.peak < 0) st.peak = 0;
        changed = true;
      }
      if (changed) { setCurrent(st.current); setPeak(st.peak); }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const litCount = Math.round((current / 100) * 12);
  const peakSeg = Math.floor(peak);
  const segs = [];
  for (let i = 0; i < 12; i++) {
    let bg = LED_OFF;
    let shadow = "none";
    const isLit = i < litCount;
    const isPeak = !isLit && peakSeg > litCount && i === peakSeg - 1 && peak > 0;
    if (isLit) {
      if (i < 1)       { bg = LED_RED;    shadow = "0 0 5px rgba(200, 96, 64, 0.6)"; }
      else if (i < 4)  { bg = LED_YELLOW; shadow = "0 0 4px rgba(200, 160, 80, 0.55)"; }
      else             { bg = LED_GREEN;  shadow = "0 0 4px rgba(138, 154, 74, 0.5)"; }
    } else if (isPeak) {
      bg = "#d8c890"; shadow = "0 0 4px rgba(216, 200, 144, 0.6)";
    }
    segs.push(<div key={i} className="hr-vu-seg" style={{ background: bg, boxShadow: shadow }} />);
  }
  return (
    <div className="hr-vu-outer">
      <div className="hr-vu-column">{segs}</div>
    </div>
  );
}

// MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
function KaleidoscopeContent({ kalState, setKalState, remainingPercent, remainingCount, totalCount }) {
  const setKnob = (id) => (v) => setKalState(prev => ({ ...prev, [id]: v }));
  return (
    <div className="hr-content-body wb-scroll">
      <div className="hr-kal-wrap">
        <div className="hr-kal-console">
          <div className="hr-kal-knob-row">
            {KAL_KNOBS.map(cfg => (
              <Knob key={cfg.id} id={cfg.id} label={cfg.label}
                    value={kalState[cfg.id]} onChange={setKnob(cfg.id)} />
            ))}
          </div>
          <div className="hr-vu-cluster">
            <VuMeter percent={remainingPercent} />
            <div className="hr-vu-readout-stack">
              <div className="hr-vu-readout-number">{remainingCount}<span> / {totalCount}</span></div>
              <div className="hr-vu-readout-label">artifact<br/>remaining</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CARD RENDERING — Q-3 dispatch on media_type ───────────────────────────
// Phase v5-3+v5-4 (per docs/deep-dive-review/SPEC_DRAFT_v5_2.md). Replaces
// the pre-v5 render-type fan-out (PhotoCard / ArtCard / VideoCard / PressCard
// / EssayCard / SessionCard) which keyed off authored `render` fields like
// "photo" / "essay" / "session". v5 artifacts carry MV's `media_type` —
// `link | photo | video | audio | text | mixed | other` — and the deck
// dispatches on that.
//
// Per Q-3 resolution: every released, badged artifact gets exported and
// reaches this dispatch. Renderers: `media_type === 'link'` (LinkCard,
// thumbnail + external open) and `media_type === 'photo'` (PhotoCard,
// thumbnail + full-res open; wired 2026-05-21 by Phase B of Asset Delivery).
// Other
// media types render a placeholder tile showing title and the media_type
// label. New renderers fold in as needed without re-architecting the deck.

// Deterministic span hint per artifact id so the grid layout doesn't reflow
// between renders or between filter passes. 70% sm / 25% md / 5% lg, with
// link cards biased slightly wider (2 columns) so thumbnails read.
// Phase C: returns only the column-span (1 or 2). With CSS aspect-ratio
// locked per media type, scaling to 2 cols also scales the card
// proportionally taller. Per the operator-locked B rule (2026-05-22):
// "A, plus a couple of switches you can set randomly" — same shape per
// type, varying sizes via column-span.
function pickSpan(seedStr, biasWide) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const r = ((h >>> 0) % 1000) / 1000;
  const span_w = biasWide ? (r < 0.7 ? 2 : 1) : (r < 0.8 ? 1 : 2);
  return { span_w };
}

// ─── content_kind variant block (2026-05-30) ────────────────────────────────
// content_kind is MV's media-variant taxonomy, defined in
// DATA_ARCHITECTURE_SPEC_v2.1-target.md §3.5 ("media variant
// (official/live/lyrics/cover)"). The export (tools/export-artifacts.mjs)
// groups the namespaced `content_kind:<v>` tags under card.tags.content_kind.
// Only the four spec-allowed values render a block; any other value (e.g. a
// stray `content_kind:other` carried by a source artifact) is ignored so the
// deck never surfaces an off-spec label. A card with no spec-valid
// content_kind renders no block at all — the pre-existing card shape is
// untouched, so cards without the tag are byte-identical to before.
const CONTENT_KIND_LABELS = {
  official: "Official",
  live: "Live",
  lyrics: "Lyrics",
  cover: "Cover",
};
function contentKindOf(card) {
  const vals = card && card.tags && Array.isArray(card.tags.content_kind)
    ? card.tags.content_kind
    : [];
  for (const v of vals) {
    if (Object.prototype.hasOwnProperty.call(CONTENT_KIND_LABELS, v)) return v;
  }
  return null;
}
function ContentKindBadge({ card }) {
  const kind = contentKindOf(card);
  if (!kind) return null;
  return (
    <span className={"hr-content-kind hr-content-kind-" + kind} data-content-kind={kind}>
      {CONTENT_KIND_LABELS[kind]}
    </span>
  );
}

function LinkCard({ card }) {
  // YouTube cards render here (media_type:"link", source_platform:"youtube").
  // Resolve maxresdefault → hqdefault so videos without a maxres render still
  // show a thumbnail (see useResolvedThumb).
  const thumb = useResolvedThumb(card.thumbnail_url);
  const visStyle = thumb
    ? {
        backgroundImage: `url(${thumb})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : null;
  return (
    <>
      <div className="hr-card-video-vis" style={visStyle ?? undefined}>
        <div className="hr-card-video-play">
          <div className="hr-card-video-play-tri" />
        </div>
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

function PhotoCard({ card }) {
  // Photo media type — wired by Phase B of Asset Delivery (2026-05-21).
  // Renders the 400x400 thumbnail from R2 as a background image; the
  // wrapping <a> in ArtifactCard opens the full-resolution primary_url.
  const visStyle = card.thumbnail_url
    ? {
        backgroundImage: `url(${card.thumbnail_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : null;
  return (
    <>
      <div className="hr-card-video-vis" style={visStyle ?? undefined} />
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

function AudioCard({ card, isPlaying, onPlayPause }) {
  // Phase C of Audio Delivery (per docs/AUDIO_DELIVERY_SCOPING_BRIEF-20260522-013207.md §9.2):
  //   - Custom play/pause button matching the deck's visual language
  //     (GOLD/INK/BORDER tokens), no native <audio controls>.
  //   - Hidden <audio> element behind a ref; preload="none" so 15 audio
  //     primaries aren't all fetched on mount.
  //   - Thumbnail (per §9.1: ID3 APIC per-track) as background image on
  //     the card's visual area, identical placement to PhotoCard.
  //   - One-card-at-a-time playback coordinated via lifted state
  //     (playingAudioId) in HrExhibitFlow per §3.6.
  //   - Filter changes do NOT touch playback state (operator-locked rule
  //     2026-05-22, restating §2.5 posture).
  //   - aria-label per state for screen readers.
  //   - Native <button> handles Enter/Space activation and focus.
  const audioRef = useRef(null);
  const title = card.title || "(untitled)";

  // Drive the <audio> element from the lifted isPlaying prop. The element
  // is unmounted-safe — the cleanup pauses on tear-down (filter eviction
  // would never happen per the locked rule, but defensive in case the
  // card itself unmounts on route change or full grid rerender).
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (isPlaying) {
      const p = el.play();
      // play() returns a Promise in modern browsers; rejection happens on
      // autoplay-policy denial or src-not-yet-loaded races. We surface a
      // console.warn (dev only) and let the parent's isPlaying stay true.
      if (p && typeof p.catch === "function") {
        p.catch(err => {
          if (import.meta.env.DEV) {
            console.warn(`AudioCard ${card.id}: play() rejected`, err);
          }
        });
      }
    } else {
      el.pause();
    }
  }, [isPlaying, card.id]);

  // Auto-clear playing state when the track reaches its end. The native
  // 'ended' event fires once; we tell the parent to deselect, which
  // matches the v1 limitation in §9.2 (no scrubbing, no looping).
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => { if (isPlaying) onPlayPause(); };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [isPlaying, onPlayPause]);

  const visStyle = card.thumbnail_url
    ? {
        backgroundImage: `url(${card.thumbnail_url})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : null;

  // Button positioned over the thumbnail. Visual language matches the
  // deck's pill/tab system: GOLD on near-black, 1px BORDER ring, square
  // edges (radius 0). Pause glyph is a pair of vertical bars; play glyph
  // is a right-pointing triangle. SVG over textual icons so font loading
  // can't shift the affordance.
  const btnStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: INK_SOFT,
    border: `1px solid ${isPlaying ? GOLD : GOLD_LO}`,
    color: GOLD,
    cursor: "pointer",
    borderRadius: 0,
    padding: 0,
    transition: "border-color 0.12s, background 0.12s",
    fontFamily: sansBody,
  };

  const ariaLabel = isPlaying ? `Pause ${title}` : `Play ${title}`;

  return (
    <>
      <div className="hr-card-video-vis" style={visStyle ?? undefined}>
        <button
          type="button"
          style={btnStyle}
          onClick={onPlayPause}
          aria-label={ariaLabel}
          aria-pressed={isPlaying}
        >
          {isPlaying ? (
            // Pause glyph: two vertical bars
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <rect x="4"  y="3" width="4" height="14" fill="currentColor" />
              <rect x="12" y="3" width="4" height="14" fill="currentColor" />
            </svg>
          ) : (
            // Play glyph: right-pointing triangle
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <polygon points="5,3 5,17 17,10" fill="currentColor" />
            </svg>
          )}
        </button>
        <audio ref={audioRef} src={card.primary_url} preload="none" />
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{title}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

function PlaceholderCard({ card }) {
  // Non-link media types — render a minimal tile. The media_type label
  // signals to the operator that a renderer is pending.
  return (
    <>
      <div className="hr-card-session-vis">
        <div className="hr-card-session-rect" />
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title hr-card-title-sm">{card.title || "(untitled)"}</div>
        <div className="hr-card-meta">{card.media_type || "(unknown)"}</div>
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

// ─── Broken-preview fallback (defensive rendering, 2026-05-30) ──────────────
// Assets can fail by path (404) OR by format (the HEIC incident: a URL the
// browser can't decode). Both a CSS background-image and a bare <img> degrade
// to silent blankness — no signal to the viewer or the operator. These helpers
// turn a missing or failed preview into a visible, titled placeholder in the
// deck's INK/GOLD language. Display-only: no DB / sync / export change.

// Probe an image URL out-of-band so a background-image (which has no onError)
// can still detect load failure. Returns true once the URL has failed to load.
// Keyed on src so it re-probes if src changes. State is set only from the async
// load/error callbacks, never synchronously in the effect body, so this doesn't
// trip react-hooks/set-state-in-effect. The browser dedupes the probe fetch
// against the real background-image request, so there's no double download.
function useImageFailed(src) {
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!src) return undefined;
    let alive = true;
    const probe = new Image();
    probe.onload = () => { if (alive) setFailed(false); };
    probe.onerror = () => { if (alive) setFailed(true); };
    probe.src = src;
    return () => { alive = false; };
  }, [src]);
  return failed;
}

// Resolve a YouTube thumbnail URL, falling back maxresdefault → hqdefault.
// YouTube only generates maxresdefault.jpg for uploads at ≥720p; lower-res
// uploads have no maxres render, while hqdefault.jpg (480×360) exists for any
// public video. The MV export hard-codes maxresdefault, so two real, public
// HR videos (Fa5GKxEgf7c + uaFHDfuohxc — confirmed live via oEmbed 2026-05-31)
// were rendering thumbnail-less. The fix lives in the card path, robust for
// any future maxres-less video and independent of the upstream export.
//
// Detection subtlety: a missing thumbnail resolution does NOT 404. YouTube
// returns a 120×90 gray placeholder with HTTP 200, so onload/onerror can't
// tell a real maxres (1280×720) from a missing one — we must inspect the
// decoded width. ≤320px wide ⇒ the placeholder ⇒ fall back to hqdefault.
// Non-ytimg and already-hqdefault URLs pass through untouched (no probe).
const YT_MAXRES_RE = /^(https?:\/\/i\.ytimg\.com\/vi\/[^/]+\/)maxresdefault(\.jpg.*)?$/i;
const YT_PLACEHOLDER_MAX_W = 320;
function useResolvedThumb(url) {
  const m = typeof url === "string" ? YT_MAXRES_RE.exec(url) : null;
  const fallback = m ? `${m[1]}hqdefault${m[2] || ""}` : null;
  const [useFallback, setUseFallback] = useState(false);
  // Out-of-band probe. State is set only from async load/error callbacks,
  // never synchronously in the effect body, so this doesn't trip
  // react-hooks/set-state-in-effect (same posture as useImageFailed).
  useEffect(() => {
    if (!fallback) return undefined;
    let alive = true;
    const probe = new Image();
    probe.onload = () => {
      if (alive && probe.naturalWidth > 0 && probe.naturalWidth <= YT_PLACEHOLDER_MAX_W) {
        setUseFallback(true);
      }
    };
    probe.onerror = () => { if (alive) setUseFallback(true); };
    probe.src = url;
    return () => { alive = false; };
  }, [url, fallback]);
  return useFallback && fallback ? fallback : url;
}

// Track an element's live content-box width. Used by FbEmbedCard to drive the
// inline width-fill scale for the FB iframe (see the FB embed sizing block in
// HrExhibitFlow.css) and by the FacebookOverlay stage. Returns [ref, width];
// width is 0 only until the first POST-LAYOUT measurement.
//
// Reliability fix (RC-A, 2026-06-01 card-shape audit): the previous version
// set width only from a ResizeObserver whose initial callback, in the deck's
// mount sequence, could arrive with a 0-width contentRect and then never fire
// again — stranding width at 0, so every gated Facebook iframe never mounted
// (16 blank boxes). Now a requestAnimationFrame fires the first measure AFTER
// layout (reading getBoundingClientRect / offsetWidth directly), and a
// ResizeObserver keeps it live on later resizes. setState happens only inside
// the rAF / RO callbacks (never synchronously in the effect body), so this
// stays clear of react-hooks/set-state-in-effect; the functional-update guard
// makes a repeat measure of an unchanged width a no-op, so it can't loop.
function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width) || el.offsetWidth || 0;
      if (w) setWidth(prev => (prev === w ? prev : w));
    };
    const raf = requestAnimationFrame(measure);
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    return () => { cancelAnimationFrame(raf); if (ro) ro.disconnect(); };
  }, []);
  return [ref, width];
}

// ─── Masonry row-span (RC-C fix, 2026-06-01) ────────────────────────────────
// The artifact grid is a masonry: each card spans exactly its own content
// height so cards pack with no row-stretch and no gutters (see the
// .hr-artifact-grid block in HrExhibitFlow.css — 1px implicit row tracks,
// align-items:start). This hook measures each card's natural (content) height
// and sets grid-row-end = span (height + GAP), so the card reserves exactly its
// height plus the 14px vertical gap.
//
// Why this fixes the FB-post clip/void: a post self-sizes ASYNCHRONOUSLY — FB
// reports its content height via postMessage well after first paint (postedH in
// FbEmbedCard), and the embed's iframe is position:absolute (out of flow) inside
// an overflow:hidden vis box, so the iframe's own growth never reaches the card's
// measured height directly — the card only grows when React writes the new vis
// height in response to that postMessage. The span must therefore react to the
// embed's reported height, not guess it ahead of time. We re-measure on EVERY
// plausible trigger and coalesce them into one post-layout pass:
//
//   1. per-card ResizeObserver — any card whose measured box changes;
//   2. the FB postMessage height event itself — authoritative + async, and the
//      reliable signal even if the RO coalesces/drops a notification under the
//      mount-time burst (all FB cards get their width + start posting heights in
//      the same few frames — exactly when "ResizeObserver loop … undelivered
//      notifications" strands a card with its earlier, too-short span, which is
//      the overlap this fixes);
//   3. nested iframe / <img> load (capture phase — load doesn't bubble) — FB
//      iframes, YouTube thumbnails, gallery/album/photo images that size late;
//   4. window resize — column width changes => every card's height changes;
//   5. a few settle sweeps — FB embeds resize multiple times as their own
//      images/fonts load, sometimes with no further event we can hook on the
//      final one; the delayed passes guarantee the last height is captured.
//
// No reflow loop: align-items:start means writing grid-row-end never changes a
// card's own border-box height, and we write a span only when it actually
// changes — so a re-measure can never grow the thing we just measured. rAF
// coalescing reads getBoundingClientRect AFTER the browser settles the reflow a
// trigger caused, never a stale (pre-growth) height. useLayoutEffect runs the
// first pass pre-paint, so the CSS default span never flashes. Re-runs whenever
// the matched set changes (cards added/removed by filtering).
const MASONRY_ROW_GAP = 14; // px — matches column-gap; baked into each span
// Settle watcher (RC-D fix, 2026-06-01): the old approach re-measured at four
// FIXED delays (120/400/900/1800 ms) and otherwise leaned on the per-card
// ResizeObserver. That captured a NON-FINAL height for FB embeds: FB posts a
// height, the card grows, then FB collapses to its settled height (images/video
// thumbnails load) AFTER 1800 ms — and under the 16-iframe mount burst the RO
// coalesces/drops notifications ("ResizeObserver loop … undelivered
// notifications"), so no trigger fires on that late change. The stranded span
// was usually TOO TALL (FB shrank after the last sweep → trailing void inside
// the cell → grid-auto-flow:dense can't backfill an occupied-but-empty cell →
// jaggies); for the occasional card that grew late it was TOO SHORT (→ clip,
// e.g. the column-3 half-line crop). Fix: poll until the layout is QUIESCENT
// instead of guessing when FB is done. We re-measure every POLL_MS; any pass
// that changes a span re-arms the window; once spans hold steady for
// STABLE_PASSES consecutive polls we stop. A late event (postMessage / RO /
// load / resize) re-arms the watcher. Bounded by MAX_MS from mount so an
// animated / never-settling embed can't poll forever. Cheap: a few rect reads
// per pass, only during the initial settle, then idle.
const MASONRY_SETTLE_POLL_MS = 150;     // re-measure cadence while settling
const MASONRY_SETTLE_STABLE_PASSES = 3; // consecutive no-change polls => settled
const MASONRY_SETTLE_MAX_MS = 15000;    // absolute cap on the settle watch
function useMasonryRowSpan(dep) {
  const gridRef = useRef(null);
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return undefined;
    // Write a card's span ONLY when it changes — avoids needless style writes
    // and any chance of feeding the ResizeObserver. Returns the rendered height.
    const applyOne = (card) => {
      const h = Math.ceil(card.getBoundingClientRect().height);
      if (h <= 0) return false;
      const next = `span ${h + MASONRY_ROW_GAP}`;
      if (card.style.gridRowEnd !== next) { card.style.gridRowEnd = next; return true; }
      return false;
    };
    // Returns whether ANY card's span changed this pass (drives quiescence).
    const applyAll = () => {
      let changed = false;
      for (const card of grid.children) { if (applyOne(card)) changed = true; }
      return changed;
    };
    // Quiescence settle watcher: poll until spans stop changing, then stop.
    // Re-armed by every late trigger so FB's post-1800ms settle is always caught.
    let pollId = 0;
    let stablePasses = 0;
    const clock = () => (typeof performance !== "undefined" ? performance.now() : Date.now());
    const startedAt = clock();
    const tick = () => {
      pollId = 0;
      if (applyAll()) stablePasses = 0; else stablePasses++;
      // FB posts settle on their own async schedule and the decisive late
      // change can fire NO trigger we observe (RO coalesced in the 16-iframe
      // mount burst, FB's cross-origin internal 'load' never reaching our
      // capture listener, or a silent reflow with no postMessage). Geometry
      // polling is the only event-independent catch, so while a post embed is
      // present we keep sampling to MAX_MS regardless of the stable-pass count
      // (fixes the column-3 half-line crop: a stale-short span lets the opaque
      // INK_CARD neighbor below over-paint the post's last line). Read-mostly
      // and bounded; applyOne writes only on change so this can't loop.
      const keepForFbPost = !!grid.querySelector('[data-fbkind="post"]');
      if ((keepForFbPost || stablePasses < MASONRY_SETTLE_STABLE_PASSES) && clock() - startedAt < MASONRY_SETTLE_MAX_MS) {
        pollId = setTimeout(tick, MASONRY_SETTLE_POLL_MS);
      }
    };
    const armSettle = () => {
      stablePasses = 0; // a fresh trigger means we are not settled yet
      if (!pollId && clock() - startedAt < MASONRY_SETTLE_MAX_MS) {
        pollId = setTimeout(tick, MASONRY_SETTLE_POLL_MS);
      }
    };
    // Coalesce every event burst into ONE rAF-batched, post-layout pass, and
    // (re)arm the settle watcher so a late / silent FB resize is still captured.
    let rafId = 0;
    const schedule = () => {
      armSettle();
      if (rafId) return;
      rafId = requestAnimationFrame(() => { rafId = 0; if (applyAll()) stablePasses = 0; });
    };
    // First pass synchronously (pre-paint, no default-span flash), then a rAF
    // pass to catch the embeds' width-driven first render; schedule() also arms
    // the settle watch that polls to the true final (settled) height.
    applyAll();
    schedule();
    // 1) per-card ResizeObserver
    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(schedule);
      for (const card of grid.children) ro.observe(card);
    }
    // 2) FB embed height event — react to the reported height directly.
    const onMessage = (e) => {
      let host = "";
      try { host = new URL(e.origin).hostname; } catch { return; }
      if (host !== "facebook.com" && host !== "www.facebook.com" && !host.endsWith(".facebook.com")) return;
      let d = e.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch { return; } }
      if (!d || typeof d !== "object") return;
      const h = Number(d.height ?? d.frameHeight ?? (d.data && d.data.height) ?? (d.params && d.params.height));
      if (Number.isFinite(h) && h > 40) schedule();
    };
    window.addEventListener("message", onMessage);
    // 3) nested iframe / image loads (capture phase — load doesn't bubble)
    grid.addEventListener("load", schedule, true);
    // 4) window resize
    window.addEventListener("resize", schedule);
    // 5) settle watch — armed by the initial schedule() above and re-armed by
    //    every trigger; replaces the old fixed-delay sweep list.
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (pollId) clearTimeout(pollId);
      if (ro) ro.disconnect();
      window.removeEventListener("message", onMessage);
      grid.removeEventListener("load", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [dep]);
  return gridRef;
}

// "Broken image" mark in currentColor: a framed thumbnail with a diagonal
// strike. Inline SVG so font/icon loading can't shift or hide the affordance.
function BrokenImageGlyph({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="3" y="4.5" width="18" height="15" />
      <path d="M3 15l5-5 4 4 3-3 6 6" />
      <line x1="4" y1="4" x2="20" y2="20" />
    </svg>
  );
}

// Muted placeholder tile. variant controls sizing/affordance density:
//   'card'  — gallery deck tile (fills .hr-card-video-vis), title + note
//   'large' — lightbox stage, title + note
//   'thumb' — lightbox strip, compact glyph + index
function MediaPlaceholder({ title, variant = "card", index }) {
  if (variant === "thumb") {
    return (
      <span className="hr-media-ph-thumb" aria-hidden="true">
        <BrokenImageGlyph size={16} />
        {index != null && <em>{index}</em>}
      </span>
    );
  }
  return (
    <div
      className={"hr-media-ph hr-media-ph-" + variant}
      role="img"
      aria-label={(title ? title + " — " : "") + "image unavailable"}
    >
      <BrokenImageGlyph size={variant === "large" ? 34 : 26} />
      <span className="hr-media-ph-title">{title || "(untitled)"}</span>
      <span className="hr-media-ph-note">image unavailable</span>
    </div>
  );
}

// Lightbox large image with onError fallback. A real <img> (criterion 2), so
// it uses native onError; on null/empty src or a load failure it renders the
// shared placeholder instead of a broken-image glyph. The caller keys this on
// src (<FallbackImg key={big} .../>) so navigating to another photo remounts
// it and resets the error flag — no setState-in-effect needed.
function FallbackImg({ src, alt, title, className }) {
  const [errored, setErrored] = useState(false);
  if (!src || errored) {
    return <MediaPlaceholder title={title} variant="large" />;
  }
  return (
    <img className={className} src={src} alt={alt} onError={() => setErrored(true)} />
  );
}

// Lightbox thumb-strip cell. background-image (no onError), so failure is
// detected via the useImageFailed probe; falls back to the compact placeholder.
function GalleryThumb({ item, index, active, onSelect }) {
  const failed = useImageFailed(item.thumbnail_url);
  const showThumb = !!item.thumbnail_url && !failed;
  return (
    <button
      className={"hr-gallery-ov-thumb" + (active ? " is-active" : "")}
      onClick={onSelect}
      aria-label={`Photo ${index + 1}`}
      aria-current={active ? "true" : undefined}
      style={showThumb ? { backgroundImage: `url(${item.thumbnail_url})` } : undefined}
    >
      {!showThumb && <MediaPlaceholder variant="thumb" index={index + 1} />}
    </button>
  );
}

// ─── Gallery container card (Phase 3) ───────────────────────────────────────
// Deck tile for a card_kind:gallery container. Shows the cover thumbnail (or a
// titled placeholder when the cover is missing or fails to load) plus a
// stacked-frames badge with the photo count. Rendered as a <button> by
// ArtifactCard so clicking opens the in-page lightbox rather than navigating away.
function GalleryCard({ card }) {
  const gallery = Array.isArray(card.gallery) ? card.gallery : [];
  const cover = card.thumbnail_url
    || (gallery.find(g => g.id === card.cover_artifact_id) || {}).thumbnail_url
    || (gallery[0] || {}).thumbnail_url
    || null;
  const count = gallery.length;
  // Show the cover while it's present and hasn't failed (incl. the brief
  // 'loading' window, so working images never flash a placeholder). Drop to
  // the titled placeholder only when there's no cover or the probe errored.
  const failed = useImageFailed(cover);
  const showCover = !!cover && !failed;
  const visStyle = showCover
    ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }
    : null;
  return (
    <>
      <div className="hr-card-video-vis" style={visStyle ?? undefined}>
        {!showCover && <MediaPlaceholder title={card.title} variant="card" />}
        <span className="hr-gallery-card-badge" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 16 16">
            <rect x="3.5" y="1.5" width="10" height="10" fill="none" stroke="currentColor" />
            <rect x="1.5" y="4.5" width="10" height="10" fill="none" stroke="currentColor" />
          </svg>
          {count}
        </span>
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

// ─── Gallery lightbox overlay (Phase 3) ─────────────────────────────────────
// Full-viewport overlay matching the deck's INK/GOLD/BORDER language. Large
// active image (falls back to a titled placeholder when an asset isn't synced
// yet), prev/next arrows, a thumbnail strip, a caption, and close affordances:
// ✕ button, backdrop click, and Escape. Arrow keys step the active photo. The
// open card is held at the HrExhibitFlow root so this renders above the deck.
function GalleryOverlay({ card, onClose }) {
  const items = Array.isArray(card && card.gallery) ? card.gallery : [];
  const n = items.length;
  const startIdx = Math.max(0, items.findIndex(g => g.id === (card && card.cover_artifact_id)));
  const [idx, setIdx] = useState(startIdx === -1 ? 0 : startIdx);
  const go = useCallback((d) => { if (n) setIdx(i => (i + d + n) % n); }, [n]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, go]);

  // Lock body scroll while the overlay is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!n) return null;
  const cur = items[idx];
  const big = cur.primary_url || cur.thumbnail_url || null;
  return (
    <div className="hr-gallery-ov" role="dialog" aria-modal="true"
         aria-label={card.title || "gallery"} onClick={onClose}>
      <button className="hr-gallery-ov-close" onClick={onClose} aria-label="Close gallery">✕</button>
      <div className="hr-gallery-ov-stage" onClick={(e) => e.stopPropagation()}>
        <button className="hr-gallery-ov-nav" onClick={() => go(-1)} aria-label="Previous photo">‹</button>
        <div className="hr-gallery-ov-figure">
          <FallbackImg
            key={big || "ph"}
            className="hr-gallery-ov-img"
            src={big}
            alt={cur.title || ""}
            title={cur.title}
          />
        </div>
        <button className="hr-gallery-ov-nav" onClick={() => go(1)} aria-label="Next photo">›</button>
      </div>
      <div className="hr-gallery-ov-cap" onClick={(e) => e.stopPropagation()}>
        <div className="hr-gallery-ov-cap-title">{cur.title || "(untitled)"}</div>
        <div className="hr-gallery-ov-cap-meta">
          {idx + 1} / {n}{cur.post_date ? " · " + cur.post_date : ""}
        </div>
      </div>
      <div className="hr-gallery-ov-strip" onClick={(e) => e.stopPropagation()}>
        {items.map((g, i) => (
          <GalleryThumb
            key={g.id}
            item={g}
            index={i}
            active={i === idx}
            onSelect={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Album container (RWTH parity, 2026-05-30) ──────────────────────────────
// The audio analogue of the gallery container. The deck tile (AlbumCard) shows
// the album cover + a track-count badge and opens AlbumOverlay — an ordered,
// numbered tracklist with sequential mp3 playback and auto-advance. Reuses the
// same HTML5 <audio> approach as AudioCard (no new player subsystem); the
// overlay owns ONE <audio> element and steps to the next track on 'ended'.
// Cover + tracks come from the export's card_kind:"album" record
// (cover_artifact_id + ordered tracks[] each with track_no).
function stripAudioSuffix(title) {
  // RWTH titles arrive as "Brain Cell — audio recording"; strip the trailing
  // "audio recording" qualifier for tracklist display only. MV title untouched.
  if (typeof title !== "string") return "";
  return title.replace(/\s*[—–-]\s*audio recording\s*$/i, "").trim() || title.trim();
}

function albumCover(card, tracks) {
  return card.thumbnail_url
    || (tracks.find(t => t.id === card.cover_artifact_id) || {}).thumbnail_url
    || (tracks[0] || {}).thumbnail_url
    || null;
}

function AlbumCard({ card }) {
  const tracks = Array.isArray(card.tracks) ? card.tracks : [];
  const cover = albumCover(card, tracks);
  const count = tracks.length;
  const failed = useImageFailed(cover);
  const showCover = !!cover && !failed;
  const visStyle = showCover
    ? { backgroundImage: `url(${cover})`, backgroundSize: "cover", backgroundPosition: "center" }
    : null;
  return (
    <>
      <div className="hr-card-video-vis" style={visStyle ?? undefined}>
        {!showCover && <MediaPlaceholder title={card.title} variant="card" />}
        <span className="hr-album-card-badge" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" />
            <circle cx="8" cy="8" r="1.6" fill="currentColor" />
          </svg>
          {count}
        </span>
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title || "(untitled)"}</div>
        <div className="hr-card-meta">{count} track{count === 1 ? "" : "s"}</div>
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

function AlbumOverlay({ card, onClose }) {
  const tracks = Array.isArray(card && card.tracks) ? card.tracks : [];
  const n = tracks.length;
  const audioRef = useRef(null);
  const [curIdx, setCurIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const cover = albumCover(card, tracks);

  const toggle = useCallback((i) => {
    setCurIdx(prev => {
      if (prev === i) { setPlaying(pl => !pl); return prev; }
      setPlaying(true);
      return i;
    });
  }, []);

  // Drive the single <audio> from curIdx/playing.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    if (curIdx < 0) { el.pause(); return; }
    if (playing) {
      const pr = el.play();
      if (pr && typeof pr.catch === "function") {
        pr.catch(err => { if (import.meta.env.DEV) console.warn("AlbumOverlay play() rejected", err); });
      }
    } else {
      el.pause();
    }
  }, [curIdx, playing]);

  // Auto-advance to the next track on end; stop after the last.
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onEnded = () => {
      setCurIdx(i => {
        const nxt = i + 1;
        if (nxt < n) { setPlaying(true); return nxt; }
        setPlaying(false);
        return -1;
      });
    };
    el.addEventListener("ended", onEnded);
    return () => el.removeEventListener("ended", onEnded);
  }, [n]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!n) return null;
  const cur = curIdx >= 0 ? tracks[curIdx] : null;
  return (
    <div className="hr-album-ov" role="dialog" aria-modal="true"
         aria-label={card.title || "album"} onClick={onClose}>
      <button className="hr-album-ov-close" onClick={onClose} aria-label="Close album">✕</button>
      <div className="hr-album-ov-stage" onClick={(e) => e.stopPropagation()}>
        <div className="hr-album-ov-cover">
          <FallbackImg
            className="hr-album-ov-cover-img"
            src={cover}
            alt={card.title || ""}
            title={card.title}
          />
          <div className="hr-album-ov-cap">
            <div className="hr-album-ov-cap-title">{card.title || "(untitled)"}</div>
            <div className="hr-album-ov-cap-meta">{n} track{n === 1 ? "" : "s"}</div>
          </div>
        </div>
        <ol className="hr-album-ov-list">
          {tracks.map((t, i) => {
            const isCur = i === curIdx;
            const isPlayingThis = isCur && playing;
            const disabled = !t.primary_url;
            return (
              <li key={t.id} className={"hr-album-ov-row" + (isCur ? " is-current" : "")}>
                <button
                  type="button"
                  className="hr-album-ov-trackbtn"
                  onClick={() => toggle(i)}
                  disabled={disabled}
                  aria-label={(isPlayingThis ? "Pause " : "Play ") + stripAudioSuffix(t.title)}
                  aria-pressed={isPlayingThis}
                >
                  <span className="hr-album-ov-num" aria-hidden="true">
                    {isPlayingThis ? (
                      <svg width="12" height="12" viewBox="0 0 20 20"><rect x="4" y="3" width="4" height="14" fill="currentColor" /><rect x="12" y="3" width="4" height="14" fill="currentColor" /></svg>
                    ) : isCur ? (
                      <svg width="12" height="12" viewBox="0 0 20 20"><polygon points="5,3 5,17 17,10" fill="currentColor" /></svg>
                    ) : (
                      i + 1
                    )}
                  </span>
                  <span className="hr-album-ov-tt">{stripAudioSuffix(t.title) || "(untitled)"}</span>
                  {disabled && <span className="hr-album-ov-na">unavailable</span>}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
      <audio ref={audioRef} src={cur ? cur.primary_url : undefined} preload="none" />
    </div>
  );
}

// ─── YouTube lightbox (universal-lightbox build 1, 2026-05-31) ──────────────
// Clicking a YouTube artifact card opens this in-site overlay with an embedded
// youtube-nocookie.com/embed player instead of navigating to a new browser tab.
// Reuses the GalleryOverlay/AlbumOverlay shell contract verbatim: full-viewport
// role="dialog", ✕ / backdrop / Escape close, body-scroll lock, and an open
// state held at the HrExhibitFlow root ({openYouTube && …}). That conditional
// render is also the player teardown — closing unmounts the iframe so the audio
// stops (scoping doc §4.5 teardown discipline; no hidden-but-playing iframe).
//
// Comment ceiling (scoping doc §3.1 / §6.1): the embedded player is player-only.
// There is NO supported parameter/API to render the YouTube comment thread
// inside an embed — comments live only on the watch page. The "Watch on YouTube
// ↗" link is therefore kept as the always-present escape hatch (comments + the
// refused-embed fallback, since a cross-origin iframe gives no readable
// load/error signal for an age-gated or embed-disabled video).
const YT_ID_RE = /(?:[?&]v=|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{6,})/;
function youtubeIdFromUrl(url) {
  if (typeof url !== "string") return null;
  const m = YT_ID_RE.exec(url);
  return m ? m[1] : null;
}

function YouTubeOverlay({ card, onClose }) {
  const vid = youtubeIdFromUrl(card && card.source_url);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while the overlay is open (mirrors GalleryOverlay).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const title = card.title || "video";
  // youtube-nocookie reduces initial tracking (scoping doc §3.1). autoplay=1 is
  // honored because the open is a user click (the gesture). rel=0 limits the
  // related-video shelf; modestbranding trims the chrome.
  const embedSrc = vid
    ? `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1&rel=0&modestbranding=1`
    : null;

  return (
    <div className="hr-yt-ov" role="dialog" aria-modal="true"
         aria-label={title} onClick={onClose}>
      <button className="hr-yt-ov-close" onClick={onClose} aria-label="Close video">✕</button>
      <div className="hr-yt-ov-stage" onClick={(e) => e.stopPropagation()}>
        <div className="hr-yt-ov-frame">
          {embedSrc ? (
            <iframe
              className="hr-yt-ov-iframe"
              src={embedSrc}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <MediaPlaceholder title={card.title} variant="large" />
          )}
        </div>
        <div className="hr-yt-ov-cap">
          <div className="hr-yt-ov-cap-title">{card.title || "(untitled)"}</div>
          <div className="hr-yt-ov-cap-meta">
            {card.post_date ? card.post_date + " · " : ""}
            <a className="hr-yt-ov-link" href={card.source_url}
               target="_blank" rel="noopener noreferrer">
              Watch on YouTube ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── FB social-plugin embed (2026-05-31) ────────────────────────
// Renders Facebook videos / reels / posts inline via the plugins/video.php and
// plugins/post.php IFRAME endpoints. These need NO app token and NO FB JS SDK
// (the bare iframe is the social-plugin path; xfbml/SDK and the graph oEmbed
// API both require an app_id / app-access-token — out of scope, no credentials).
// Honors UX_SPEC §C.5.2 (Social Archive: "Facebook embed loads inline") and
// VISION_LOCK G-12 (historical FB artifacts may be embedded). Front-end only;
// no MV / export change.
//
// Live-verify caveat: FB iframes only render PUBLIC content, and logged-out
// visitors may see a login wall or blank frame. A cross-origin iframe exposes
// no load/error signal, so failure can't be auto-detected — every embed always
// carries an "Open on Facebook ↗" escape hatch in the foot (the same graceful
// degradation posture as the broken-preview fallback, 2026-05-30).
function fbPluginSrc(plugin, href, showText, width = 500) {
  return `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(href)}`
    + `&show_text=${showText ? "true" : "false"}&width=${Math.round(width)}`;
}
// All FB artifacts embed via plugins/post.php (video/reel/post); a video is also
// a post and post.php self-sizes + reports height via postMessage. Returns the
// ORIGINAL url as href; per-card src is built at the tile width in FbEmbedCard.
function fbEmbedFor(url) {
  if (!url || typeof url !== "string") return null;
  const isVideo = /[?&]v=\d+/.test(url) || /\/videos\/\d+/.test(url);
  const isReel = /\/reel\/\d+/.test(url);
  const isPost = /\/posts\//.test(url) || /\/permalink\//.test(url) || /story\.php/.test(url);
  if (!isVideo && !isReel && !isPost) return null;
  const kind = isVideo ? "video" : isReel ? "reel" : "post";
  return { kind, href: url };
}

// Read an embed's intrinsic pixel dimensions from the artifact record when the
// export provides them. Returns { w, h } (positive, finite) or null. Tolerant of
// string or numeric fields and of either media_* or embed_* naming, so it lights
// up whichever the MV/export side eventually emits.
function fbEmbedDims(card) {
  const w = Number(card.media_width ?? card.embed_width);
  const h = Number(card.media_height ?? card.embed_height);
  if (Number.isFinite(w) && Number.isFinite(h) && w > 0 && h > 0) {
    return { w, h };
  }
  return null;
}

// Generous per-kind FALLBACK frame heights (px, pre-scale) for when FB has not
// posted a measured height. Erring tall letterboxes; never crops.
// Video/reel have a real fixed aspect, so their fallbacks are modest. POSTS have
// no fixed aspect — caption length varies — so a 720 fallback clipped the last
// text line / engagement bar on longer posts (clipping fix 2026-06-01). The
// post.php postMessage height (handled below) sizes a post to its actual content
// when FB reports it; until/unless it does, this taller fallback letterboxes a
// long post instead of cropping it.
const FB_FALLBACK_H = { video: 620, reel: 1040, post: 1100 };

function FbEmbedCard({ card }) {
  const embed = fbEmbedFor(card.source_url);
  const kind = embed ? embed.kind : "post";
  const [visRef, visW] = useElementWidth();
  const frameRef = useRef(null);
  const [postedH, setPostedH] = useState(0);
  useEffect(() => {
    function onMessage(e) {
      let host = "";
      try { host = new URL(e.origin).hostname; } catch { return; }
      if (host !== "facebook.com" && host !== "www.facebook.com" && !host.endsWith(".facebook.com")) return;
      const win = frameRef.current && frameRef.current.contentWindow;
      if (win && e.source && e.source !== win) return;
      let d = e.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch { return; } }
      if (!d || typeof d !== "object") return;
      const h = Number(
        d.height ?? d.frameHeight ?? (d.data && d.data.height) ?? (d.params && d.params.height)
      );
      if (Number.isFinite(h) && h > 40) setPostedH(Math.ceil(h));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  // Width-fill (Option 3): request post.php at ~tile width (clamped to FB 350-750,
  // 10px-quantized to keep the src stable), then scale only the residual so the
  // frame fills the tile exactly (no white gutters). Box height = scaled frame
  // height, so the frame never overflows -> never cropped (short content letterboxes).
  const dims = fbEmbedDims(card);
  const tileW = visW || 0;
  const reqW = Math.min(750, Math.max(350, Math.round(tileW / 10) * 10 || 350));
  const scale = tileW > 0 ? tileW / reqW : 1;
  // POSTS — get out of the embed's way (2026-06-01). A post has no fixed aspect,
  // and post.php self-sizes its own content; the only correct height is the one
  // FB reports via postMessage (postedH). Use it verbatim so the frame is exactly
  // as tall as its content — no bottom clip, no black gap. We impose no height of
  // our own. Until/unless a height arrives, show a modest graceful loading box
  // (placeholder + foot affordances visible), NOT the old ~1100px void that both
  // clipped at FB's internal cutoff and left dead space below. (Operator floor:
  // prefer the embed's native self-sizing over our custom sizing.)
  const isPost = kind === "post";
  // Frame px at reqW; displayed height ≈ this × scale (~360–400px at a 1-col
  // tile). The postMessage height replaces it the moment FB reports, growing the
  // box to the exact content.
  const POST_LOADING_H = 480;
  // VIDEO / REEL — genuinely fixed-aspect media; left on their existing per-kind
  // fallback (and export dims when present). Untouched by the posts fix.
  const fallbackH = Math.round((FB_FALLBACK_H[kind] || FB_FALLBACK_H.post) * (500 / reqW));
  const effH = dims
    ? Math.round((reqW * dims.h) / dims.w)
    : isPost
      ? (postedH || POST_LOADING_H)
      : (postedH || fallbackH);
  const src = embed ? fbPluginSrc("post.php", embed.href, true, reqW) : null;
  const visStyle = {};
  if (dims) {
    visStyle.aspectRatio = `${dims.w} / ${dims.h}`;
  } else if (tileW > 0) {
    visStyle.height = `${Math.round(scale * effH)}px`;
  }
  const frameStyle = {
    width: `${reqW}px`,
    height: `${effH}px`,
    transform: `scale(${scale})`,
    transformOrigin: "top left",
  };
  return (
    <>
      <div
        className="hr-card-video-vis"
        ref={visRef}
        style={Object.keys(visStyle).length ? visStyle : undefined}
      >
        {/* RC-A no-blank fallback (2026-06-01): a titled placeholder sits
            BEHIND the iframe, so a slow / refused / not-yet-measured embed
            shows a styled tile instead of a blank white box. The opaque FB
            embed paints over it once it loads. FB cards carry no thumbnail
            (primary_url / thumbnail_url are null in the export), so this is
            the title-only variant of the shared MediaPlaceholder. */}
        <MediaPlaceholder title={card.title} variant="card" />
        {embed && tileW > 0 && (
          <iframe
            ref={frameRef}
            className="hr-fbembed-frame"
            src={src}
            style={frameStyle}
            title={card.title || "Facebook embed"}
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        )}
      </div>
      {/* No foot on FB cards (redundant-foot removal, 2026-06-01). The
          post.php embed (show_text=true) renders the caption + date and
          provides its own interaction (Share, and the post links through to
          Facebook), so the "⤢ Expand" control and the "Open on Facebook ↗"
          link were redundant clutter and are removed — along with the
          content-kind chip, per operator direction. Dropping the foot also
          removes the black foot region that read as a void below the white
          embed and lets the card height settle to exactly the embed height
          (masonry measures the card box; with the foot gone, box = embed).
          The in-site FB lightbox is retired with the Expand control
          (FacebookOverlay is mothballed below — see its eslint-disable). */}
    </>
  );
}

// ─── Facebook lightbox (universal-lightbox build 2, 2026-06-01) ─────────────
// Clicking the expand affordance on a Facebook artifact card opens this in-site
// overlay with a LARGE, readable plugins/post.php embed — the same embed
// mechanism FbEmbedCard uses inline in the grid, but rendered at a comfortable
// reading width (FB's 750px plugin max) with a vertical scroll region so a tall
// post/video is fully readable in-site. The grid tile stays the compact inline
// embed; this is purely additive (scoping doc §4.3 Option B / build-2 kickoff).
//
// Reuses the GalleryOverlay/AlbumOverlay/YouTubeOverlay shell contract verbatim:
// full-viewport role="dialog", ✕ / backdrop / Escape close, body-scroll lock,
// and an open state held at the HrExhibitFlow root ({openFacebook && …}). That
// conditional render is also the player teardown — closing unmounts the iframe
// so any playing FB video's audio stops (scoping doc §4.5).
//
// Comment ceiling (scoping doc §3.2 / §6.1): the post plugin renders the post
// (text + media) but NOT the comment thread or live engagement — no token-free
// FB plugin does. The "Open on Facebook ↗" link is kept as the always-present
// escape hatch (comments + the logged-out / refused-embed fallback, since a
// cross-origin iframe gives no readable load/error signal).
//
// Logged-out caveat (scoping doc §3.2 / §6.2): FB renders public content
// differently for a logged-out visitor than for the operator's logged-in
// browser, so live-verify must be done in an incognito window.
//
// MOTHBALLED (2026-06-01): the FB card foot — the only entry point — was
// removed (operator: the embed already provides Share + link-through, the
// footer was redundant clutter). This component is intentionally not rendered;
// it is preserved for revival (restore an entry affordance + open state + the
// {openFacebook && …} render at the root). Kept out of the dead-code lint via
// the disable below.
// eslint-disable-next-line no-unused-vars
function FacebookOverlay({ card, onClose }) {
  const embed = fbEmbedFor(card && card.source_url);
  const kind = embed ? embed.kind : "post";
  const [stageRef, stageW] = useElementWidth();
  const frameRef = useRef(null);
  const [postedH, setPostedH] = useState(0);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while the overlay is open (mirrors YouTubeOverlay).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // post.php reports its rendered height via postMessage; mirror FbEmbedCard's
  // origin-checked listener so the frame grows to the full post height.
  useEffect(() => {
    function onMessage(e) {
      let host = "";
      try { host = new URL(e.origin).hostname; } catch { return; }
      if (host !== "facebook.com" && host !== "www.facebook.com" && !host.endsWith(".facebook.com")) return;
      const win = frameRef.current && frameRef.current.contentWindow;
      if (win && e.source && e.source !== win) return;
      let d = e.data;
      if (typeof d === "string") { try { d = JSON.parse(d); } catch { return; } }
      if (!d || typeof d !== "object") return;
      const h = Number(
        d.height ?? d.frameHeight ?? (d.data && d.data.height) ?? (d.params && d.params.height)
      );
      if (Number.isFinite(h) && h > 40) setPostedH(Math.ceil(h));
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  // Request post.php at the stage width (clamped to FB's 350–750 plugin range,
  // 10px-quantized to keep the src stable across re-renders) so the embed
  // renders crisp at a large, readable size — no residual scaling needed, since
  // we control the stage width directly. Height comes from postMessage; a
  // generous per-kind fallback letterboxes (never crops) until FB reports.
  const reqW = Math.min(750, Math.max(350, Math.round((stageW || 500) / 10) * 10));
  const fallbackH = Math.round((FB_FALLBACK_H[kind] || FB_FALLBACK_H.post) * (500 / reqW));
  const frameH = postedH || fallbackH;
  const src = embed ? fbPluginSrc("post.php", embed.href, true, reqW) : null;
  const title = card.title || "Facebook post";

  return (
    <div className="hr-fb-ov" role="dialog" aria-modal="true"
         aria-label={title} onClick={onClose}>
      <button className="hr-fb-ov-close" onClick={onClose} aria-label="Close post">✕</button>
      <div className="hr-fb-ov-stage" ref={stageRef} onClick={(e) => e.stopPropagation()}>
        <div className="hr-fb-ov-scroll">
          <div className="hr-fb-ov-frame" style={{ height: `${frameH}px` }}>
            {src ? (
              <iframe
                ref={frameRef}
                className="hr-fb-ov-iframe"
                src={src}
                style={{ width: `${reqW}px`, height: `${frameH}px` }}
                title={title}
                scrolling="no"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <MediaPlaceholder title={card.title} variant="large" />
            )}
          </div>
        </div>
        <div className="hr-fb-ov-cap">
          <div className="hr-fb-ov-cap-title">{card.title || "(untitled)"}</div>
          <div className="hr-fb-ov-cap-meta">
            {card.post_date ? card.post_date + " · " : ""}
            <a className="hr-fb-ov-link" href={card.source_url}
               target="_blank" rel="noopener noreferrer">
              Open on Facebook ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Photo lightbox (universal-lightbox build 4, Instagram, 2026-06-01) ──────
// The single Instagram card (MV-HR-20260405-037) is a self-hosted photo —
// primary_url PNG on assets.weird.baby + the post caption in description — so
// the in-site experience is our own image at full resolution + the caption:
// full fidelity, NO embed, NO token, NO third-party dependency (scoping doc
// §3.3). Reuses the GalleryOverlay/YouTubeOverlay/FacebookOverlay shell contract
// verbatim: full-viewport role="dialog", ✕ / backdrop / Escape close, body-
// scroll lock, and an open state held at the HrExhibitFlow root
// ({openPhoto && …}). The image degrades to the shared MediaPlaceholder via
// FallbackImg if the asset 404s (broken-preview posture, 2026-05-30).
//
// Comment ceiling (scoping doc §3.3 / §6.1): even a live IG embed shows only the
// post + caption, never the comment thread — and here the asset is self-hosted,
// so we don't embed at all. The "Open on Instagram ↗" link is kept as the
// always-present escape hatch (comments + the canonical post).
//
// Forward-compat (scoping doc §3.3 / §3.9): any future self-hosted photo card
// lightboxes identically; the escape-hatch label derives from source_platform,
// and the caption falls back to title when description is absent.
function PhotoOverlay({ card, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Lock body scroll while the overlay is open (mirrors YouTubeOverlay).
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  const big = (card && card.primary_url) || (card && card.thumbnail_url) || null;
  const title = card.title || "photo";
  // The IG card's title is a machine-truncation of the caption, so the full
  // caption (description) is the substance; fall back to title if absent.
  const captionText = (card && card.description) || card.title || "";
  const platform = card && card.source_platform;
  const platformLabel = platform
    ? platform.charAt(0).toUpperCase() + platform.slice(1)
    : "source";

  return (
    <div className="hr-photo-ov" role="dialog" aria-modal="true"
         aria-label={title} onClick={onClose}>
      <button className="hr-photo-ov-close" onClick={onClose} aria-label="Close photo">✕</button>
      <div className="hr-photo-ov-stage" onClick={(e) => e.stopPropagation()}>
        <div className="hr-photo-ov-figure">
          <FallbackImg
            key={big || "ph"}
            className="hr-photo-ov-img"
            src={big}
            alt={card.title || ""}
            title={card.title}
          />
        </div>
        <div className="hr-photo-ov-cap">
          {captionText ? <div className="hr-photo-ov-cap-body">{captionText}</div> : null}
          <div className="hr-photo-ov-cap-meta">
            {card.post_date ? card.post_date + " · " : ""}
            <a className="hr-photo-ov-link" href={card.source_url}
               target="_blank" rel="noopener noreferrer">
              Open on {platformLabel} ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtifactCard({ card, playingAudioId, setPlayingAudioId, onOpenGallery, onOpenAlbum, onOpenYouTube, onOpenPhoto }) {
  const fbEmbed = card.source_platform === "facebook" ? fbEmbedFor(card.source_url) : null;
  const presLink = Array.isArray(card.tags?.presentation) && card.tags.presentation.includes("link");
  const isFbEmbed = !!fbEmbed && !presLink;
  // Universal-lightbox build 1: YouTube cards open the in-site player overlay
  // instead of a new tab. Split off from the generic isLink so ONLY YouTube
  // changes — reverbnation / other link cards keep the <a target="_blank">
  // behavior untouched (scope discipline). A YouTube card whose URL has no
  // parseable video id falls through to isLink → new-tab, a safe fallback.
  const ytId = card.source_platform === "youtube" ? youtubeIdFromUrl(card.source_url) : null;
  const isYouTube = !isFbEmbed && !!ytId;
  const isLink = !isFbEmbed && !isYouTube && (card.media_type === "link" || presLink) && !!card.source_url;
  const isPhoto = !isFbEmbed && card.media_type === "photo" && !!card.primary_url;
  // Phase C of Audio Delivery (per brief §3.5 / §9.3): media_type='audio'
  // dispatches to AudioCard. Predicate keys on the single-token check
  // (LinkCard / PhotoCard pattern) thanks to the MV-side normalization
  // from 'mixed' to 'audio' executed in Phase C step 1.
  const isAudio = !isFbEmbed && card.media_type === "audio" && !!card.primary_url;
  // Phase 3: gallery container. media_type is 'other', so without this it would
  // fall through to PlaceholderCard. Detected via the export's card_kind field.
  const isGallery = card.card_kind === "gallery" && Array.isArray(card.gallery);
  // RWTH parity: album container. media_type is 'other'; detected via the
  // export's card_kind:"album" + tracks[]. Opens AlbumOverlay like gallery.
  const isAlbum = card.card_kind === "album" && Array.isArray(card.tracks);
  // pickSpan bias: link / photo lean wide so the thumbnails read at a
  // comfortable size. Audio is hard-forced to 1-col below per operator
  // decision 2026-05-23 (visual review during first production deploy at
  // https://weird.baby/hr): audio cards are uniform album-art squares;
  // pickSpan's wide-bias variant produced 2x-tall cards that broke the
  // "matching album art" aesthetic from the 2026-05-22 operator-lock.
  const isFbVideo = isFbEmbed && fbEmbed.kind === "video";
  const { span_w: rolledSpan } = pickSpan(card.id || "", isLink || isYouTube || isPhoto || isGallery || isAlbum || isFbVideo);
  // All Facebook cards forced to 1-col / narrow per operator decision 2026-06-01
  // (incognito visual review on weird.baby/hr): FB post & video embeds have a
  // portrait-ish natural shape and distort when stretched to a 2-col (wide)
  // span; narrow renders like a proper FB post. Overrides the FNV-hash rolled
  // span for FB only (source_platform === "facebook"); all other card types
  // keep their operator-locked varied spans. Supersedes the earlier rule that
  // forced only non-video FB embeds (isFbEmbed && !isFbVideo) to 1-col.
  const span_w = card.source_platform === "facebook" || isAudio || isAlbum ? 1 : rolledSpan;
  const baseStyle = {
    ...spanStyle(span_w),
    border: `1px solid ${BORDER}`,
    background: INK_CARD,
  };
  const className = ["hr-card", "card-fade-in",
    isFbEmbed ? "hr-card-fbembed" : null,
    isLink ? "hr-card-link" : null,
    isYouTube ? "hr-card-link hr-card-youtube" : null,
    isPhoto ? "hr-card-photo" : null,
    isAudio ? "hr-card-audio" : null,
    isGallery ? "hr-card-gallery" : null,
    isAlbum ? "hr-card-album" : null]
    .filter(Boolean).join(" ");
  if (isFbEmbed) {
    return (
      <div className={className} style={baseStyle} data-fbkind={fbEmbed.kind}>
        <FbEmbedCard card={card} />
      </div>
    );
  }
  if (isYouTube) {
    // In-site player: render the same LinkCard tile (thumbnail + play triangle)
    // but as a <button> that opens YouTubeOverlay at the root, rather than an
    // <a target="_blank">. No "↗" external-arrow — it no longer leaves the site;
    // the play triangle signals in-site playback. The "Watch on YouTube ↗"
    // escape hatch lives inside the overlay.
    return (
      <button
        type="button"
        className={className}
        style={{ ...baseStyle, cursor: "pointer", textAlign: "left", font: "inherit", color: "inherit", padding: 0 }}
        onClick={() => onOpenYouTube && onOpenYouTube(card)}
        aria-label={`Play video: ${card.title || "untitled"}`}
      >
        <LinkCard card={card} />
      </button>
    );
  }
  if (isLink) {
    return (
      <a
        className={className}
        style={baseStyle}
        href={card.source_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <LinkCard card={card} />
        <span className="hr-card-link-arrow" aria-hidden="true">↗</span>
      </a>
    );
  }
  if (isPhoto) {
    // Universal-lightbox build 4: the self-hosted photo (the single Instagram
    // card today) opens the in-site PhotoOverlay instead of a new tab. Render
    // the same PhotoCard tile, but as a <button> that opens the overlay at the
    // root — mirroring isYouTube/isGallery/isAlbum. The "Open on Instagram ↗"
    // escape hatch lives inside the overlay (scoping doc §3.3). A future photo
    // without a hosted primary_url never reaches here (isPhoto requires it).
    return (
      <button
        type="button"
        className={className}
        style={{ ...baseStyle, cursor: "pointer", textAlign: "left", font: "inherit", color: "inherit", padding: 0 }}
        onClick={() => onOpenPhoto && onOpenPhoto(card)}
        aria-label={`Open photo: ${card.title || "untitled"}`}
      >
        <PhotoCard card={card} />
      </button>
    );
  }
  if (isAudio) {
    // AudioCard is NOT wrapped in <a> — playback happens in-place,
    // not via navigation. One-card-at-a-time playback: the parent
    // (P3Panel -> HrExhibitFlow root) holds playingAudioId. Tapping
    // play on card B while card A is playing pauses card A by
    // changing playingAudioId; A's isPlaying becomes false and its
    // useEffect calls audioRef.pause(). Per the operator-locked
    // rule (2026-05-22): filter changes do NOT touch player state.
    const isPlayingThis = playingAudioId === card.id;
    const onPlayPause = () => {
      setPlayingAudioId(isPlayingThis ? null : card.id);
    };
    return (
      <div className={className} style={baseStyle}>
        <AudioCard
          card={card}
          isPlaying={isPlayingThis}
          onPlayPause={onPlayPause}
        />
      </div>
    );
  }
  if (isGallery) {
    return (
      <button
        type="button"
        className={className}
        style={{ ...baseStyle, cursor: "pointer", textAlign: "left", font: "inherit", color: "inherit", padding: 0 }}
        onClick={() => onOpenGallery && onOpenGallery(card)}
        aria-label={`Open gallery: ${card.title || "untitled"} — ${card.gallery.length} photos`}
      >
        <GalleryCard card={card} />
      </button>
    );
  }
  if (isAlbum) {
    return (
      <button
        type="button"
        className={className}
        style={{ ...baseStyle, cursor: "pointer", textAlign: "left", font: "inherit", color: "inherit", padding: 0 }}
        onClick={() => onOpenAlbum && onOpenAlbum(card)}
        aria-label={`Open album: ${card.title || "untitled"} — ${card.tracks.length} tracks`}
      >
        <AlbumCard card={card} />
      </button>
    );
  }
  return (
    <div className={className} style={baseStyle}>
      <PlaceholderCard card={card} />
    </div>
  );
}

// ─── PAGE / GRID — ported from v28 ──────────────────────────────────────────
function P3Panel({ matched, totalCount, playingAudioId, setPlayingAudioId, onOpenGallery, onOpenAlbum, onOpenYouTube, onOpenPhoto }) {
  // Phase C: filterKey is intentionally NOT included in audio cards' react
  // keys. The operator-locked rule (2026-05-22) requires that filter
  // changes never touch playback state. Including filterKey here would
  // remount every card on any pill toggle, killing any playing audio.
  // The card.id alone is stable across filter reflows.
  const filterKey = useMemo(() => matched.map(c => c.id).join(","), [matched]);
  // Masonry: re-pack row-spans whenever the matched set changes (RC-C fix).
  const gridRef = useMasonryRowSpan(filterKey);
  return (
    <>
      {/* 2026-06-07 Mike: page header (eyebrow / "the artifact deck" title /
          tab-explainer sub) and the "artifacts · the material evidence"
          panel-head REMOVED — the wall speaks for itself. The explainer was
          also stale (shuffle/loop have acted on the player since O9 wired).
          totalCount prop retained at the call seam for any future count UI. */}
      <div className="hr-artifact-grid" ref={gridRef}>
        {matched.map(card => {
          // Audio cards key on id ONLY (stable across filter reflows) so
          // they don't remount and interrupt playback. Non-audio cards
          // keep the Phase B filterKey-card.id composite key.
          const k = card.media_type === "audio"
            ? card.id
            : `${filterKey}-${card.id}`;
          return (
            <ArtifactCard
              key={k}
              card={card}
              playingAudioId={playingAudioId}
              setPlayingAudioId={setPlayingAudioId}
              onOpenGallery={onOpenGallery}
              onOpenAlbum={onOpenAlbum}
              onOpenYouTube={onOpenYouTube}
              onOpenPhoto={onOpenPhoto}
            />
          );
        })}
      </div>
    </>
  );
}

function ScrollFadeContainer({ children }) {
  return (
    <div className="hr-scroll-fade-wrap">
      <div className="wb-scroll hr-content-body">{children}</div>
    </div>
  );
}

// ─── TAB CONTENT COMPONENTS — ported from v28, plus JournalContent ──────────
// Stage 3: pillWidth no longer threads through here. PillGroupColumn owns
// its own per-column measurement via useColumnPillWidth.
// TABS-OUT Stage A: tier render replaced by BoardContent; TierContent kept for
// revival (auto-ignored by no-unused-vars varsIgnorePattern ^[A-Z_]).
function TierContent({ dims, selected, toggle }) {
  return (
    <ScrollFadeContainer>
      <div className="hr-groups-row">
        {dims.map(dim => (
          <PillGroupColumn
            key={dim.key} group={dim.key} values={dim.values}
            items={ARTIFACTS} selected={selected} toggle={toggle}
          />
        ))}
      </div>
    </ScrollFadeContainer>
  );
}

// TABS-OUT Stage A: the Basic surface. Renders the five TOTAL facets at once,
// each via the untouched PillGroupColumn, in renderBoard order (Kind, Topic,
// Era, Project/Band, Format). Columns are resolved in BOARD_COLUMNS (module
// load): Kind drops the container-only "other" value (metadata-spec 4) and
// empty facets are omitted. Reuses TierContent's .hr-groups-row layout; the
// v7_1 visual skin lands in Stage C.
function BoardContent({ selected, toggle }) {
  return (
    <ScrollFadeContainer>
      <div className="hr-groups-row">
        {BOARD_COLUMNS.map(col => (
          <PillGroupColumn
            key={col.key} group={col.key} values={col.values}
            items={ARTIFACTS} selected={selected} toggle={toggle}
          />
        ))}
      </div>
    </ScrollFadeContainer>
  );
}

// ─── v7_1 FILTER INSTRUMENT POP-OVER (2026-06-15) ───────────────────────────
// The visual-first deliverable: a filter ICON opens this centered overlay,
// painted in the v7_1 reference look (docs/filter-instrument-reference.html)
// and populated with the LIVE HR facets. Presentation layer ONLY — it reads
// `selected` and writes through the same `toggle(group, value)` + `countForPill`
// the deck already uses, so the proven matchFilter plumbing is untouched
// (brief §4: "Do NOT touch matchFilter semantics"). Selection is live (the wall
// updates as chips toggle); "apply" just closes, "cancel" reverts to the
// snapshot captured when the overlay opened. It never touches player state: the
// only writes are toggle / clear / applyFactoryPreset, all of which leave
// playback alone (operator-locked rule). Basic board = the five TOTAL facets
// (BOARD_COLUMNS, "other" dropped from Kind); Detail zone = the live partials
// (DETAIL_COLUMNS: album/source/people; song+venue null-exempt, skipped).
function FilterInstrumentOverlay({
  selected, setSelected, toggle,
  factoryPresets, applyFactoryPreset,
  matchedCount, totalCount, onClose,
}) {
  const [hideZero, setHideZero] = useState(false);
  const [advOpen, setAdvOpen] = useState(
    () => DETAIL_PARTIAL_KEYS.some(k => selected[k] instanceof Set && selected[k].size > 0)
  );
  // Snapshot the selection on open so Cancel can revert (dismissable, non-
  // destructive). Captured once, on first render.
  const snapshotRef = useRef(null);
  if (snapshotRef.current === null) snapshotRef.current = cloneSelected(selected);

  // Escape closes — parity with the other root overlays (Gallery/YouTube/…).
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const activeTokens = [];
  HR_DIMENSIONS.forEach(({ key }) => {
    if (selected[key] instanceof Set) selected[key].forEach(v => activeTokens.push([key, v]));
  });
  const anySel = activeTokens.length > 0;

  const clearAll = () => {
    const cleared = {};
    HR_DIMENSIONS.forEach(({ key }) => { cleared[key] = new Set(); });
    setSelected(cleared);
  };
  const clearGroup = (group) => {
    setSelected(prev => {
      const next = {};
      for (const { key } of HR_DIMENSIONS) next[key] = new Set(prev[key] ?? []);
      next[group] = new Set();
      return next;
    });
  };
  const cancel = () => { setSelected(cloneSelected(snapshotRef.current)); onClose(); };

  const renderFacet = (col, isFormat) => {
    const sel = selected[col.key] instanceof Set ? selected[col.key] : new Set();
    const n = sel.size;
    const scroll = col.values.length > 8;
    return (
      <div key={col.key} className={"hrfi-facet" + (isFormat ? " hrfi-format" : "")}>
        <div className="hrfi-facet-head">
          <span className="hrfi-ttl">{HR_GROUP_LABELS[col.key] || col.key}</span>
          <span
            className={"hrfi-state" + (n ? " hrfi-on" : "")}
            onClick={n ? () => clearGroup(col.key) : undefined}
          >{n ? `${n} · clear` : "all"}</span>
        </div>
        <div className={"hrfi-chips" + (scroll ? " hrfi-scroll" : "")}>
          {col.values.map(v => {
            const isSel = sel.has(v);
            const ct = countForPill(ARTIFACTS, selected, col.key, v);
            const zero = !isSel && ct === 0;
            const icon = isFormat ? HRFI_FORMAT_ICONS[v] : null;
            return (
              <button
                key={v}
                className={"hrfi-chip" + (isSel ? " hrfi-sel" : "") + (zero ? " hrfi-zero" : "") + (zero && hideZero ? " hrfi-hidden" : "")}
                onClick={() => toggle(col.key, v)}
              >
                {icon ? <span className="hrfi-ic">{icon}</span> : null}
                <span className="hrfi-lab">{displayFor(col.key, v)}</span>
                <span className="hrfi-ct">{ct}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="hrfi-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Filter the Hunter Root collection"
    >
      <div className="hrfi-root" onClick={(e) => e.stopPropagation()}>
        <div className="hrfi-head">
          <h2>Hunter&nbsp;Root · Filter</h2>
          <span className="hrfi-sub">{anySel ? `${matchedCount} of ${totalCount} in view` : `all ${totalCount} artifacts`}</span>
          <button className="hrfi-x" aria-label="Close filter" onClick={onClose}>✕</button>
        </div>

        <div className="hrfi-activebar">
          <span className="hrfi-lead">In view</span>
          {!anySel && <span className="hrfi-none">everything — nothing filtered yet</span>}
          {activeTokens.map(([k, v]) => (
            <span key={k + "/" + v} className={"hrfi-tk" + (DETAIL_PARTIAL_KEYS.includes(k) ? " hrfi-adv" : "")}>
              {displayFor(k, v)}
              <span className="hrfi-rm" onClick={() => toggle(k, v)}>✕</span>
            </span>
          ))}
          <span className="hrfi-grow" />
          <button className="hrfi-clr" disabled={!anySel} onClick={clearAll}>↺ clear all</button>
        </div>

        {factoryPresets.length > 0 && (
          <div className="hrfi-threadbar">
            <span className="hrfi-tlead">Threads</span>
            {factoryPresets.map(p => (
              <button key={p.key} className="hrfi-thread" onClick={() => applyFactoryPreset(p)}>{p.label}</button>
            ))}
          </div>
        )}

        <div className="hrfi-opts">
          <label className="hrfi-togg">
            <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} /> hide empty
          </label>
        </div>

        <div className="hrfi-surface">
          {BOARD_COLUMNS.map(col => renderFacet(col, col.key === "format"))}
        </div>

        {DETAIL_COLUMNS.length > 0 && (
          <div className="hrfi-detail-wrap">
            <div className={"hrfi-adv-banner" + (advOpen ? " hrfi-open" : "")} onClick={() => setAdvOpen(o => !o)}>
              <div>
                <div className="hrfi-t">Detail Filtering</div>
                <div className="hrfi-d">{DETAIL_COLUMNS.map(c => (HR_GROUP_LABELS[c.key] || c.key).toLowerCase()).join(" · ")} — narrow to one specific item</div>
              </div>
              <span className="hrfi-chev">▾</span>
            </div>
            {advOpen && (
              <div className="hrfi-adv-zone hrfi-open">
                <div className="hrfi-surface">
                  {DETAIL_COLUMNS.map(col => renderFacet(col, false))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="hrfi-foot">
          <div className="hrfi-tally"><b>{matchedCount}</b> artifacts <span className="hrfi-of">/ {totalCount}</span></div>
          <span className="hrfi-grow" />
          <button className="hrfi-btn hrfi-ghost" onClick={cancel}>cancel</button>
          <button className="hrfi-btn hrfi-prime" onClick={onClose}>apply</button>
        </div>
      </div>
    </div>
  );
}

// TABS-OUT Stage A: Deep Tracks search retired with the tier tabs; DeepTracksContent
// kept for revival (auto-ignored by no-unused-vars varsIgnorePattern ^[A-Z_]).
function DeepTracksContent({ dims, selected, toggle, query, setQuery, focusSignal }) {
  const inputRef = useRef(null);
  useEffect(() => { if (focusSignal) inputRef.current?.focus(); }, [focusSignal]);

  const q = query.trim().toLowerCase();
  // Stage 2: search matches against the canonical display label per
  // (group, slug). Typing "hunter root" finds the Hunter Root era pill
  // even though the legacy slug is "solo". Cross-artist thematic words
  // ("breakthrough," "mature") that aren't in HR's locked vocab simply
  // produce zero hits — the corral surfaces "no tags match" — which is
  // the spec's free-text-search-not-pills routing in practice.
  const hits = useMemo(() => {
    if (!q) return [];
    const out = [];
    HR_DIMENSIONS.forEach(dim => {
      dim.values.forEach(v => {
        if (displayFor(dim.key, v).toLowerCase().includes(q)) {
          out.push({ group: dim.key, tag: v });
        }
      });
    });
    return out;
  }, [q]);

  const hasQuery = q.length > 0;

  return (
    <ScrollFadeContainer>
      <div className="hr-deep-stack">
        <div className="hr-search-wrap">
          <div className="hr-search-input-holder">
            <input
              ref={inputRef}
              className="searchbar"
              type="text"
              placeholder="search for any tag across all tiers"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>
          {hasQuery && (
            <div className="pillscroll hr-corral">
              {hits.length === 0 ? (
                <span className="hr-corral-empty">no tags match "{query}"</span>
              ) : hits.map(({ group, tag }, i) => {
                const active = selected[group]?.has(tag) ?? false;
                const count = countForPill(ARTIFACTS, selected, group, tag);
                const zero = !active && count === 0;
                return (
                  <PillButton
                    key={`${group}-${tag}-${i}`}
                    label={displayFor(group, tag)} count={count}
                    active={active} zero={zero}
                    pillWidth={null}
                    onClick={() => toggle(group, tag)}
                  />
                );
              })}
            </div>
          )}
        </div>
        {dims.length > 0 && (
          <div className="hr-groups-row">
            {dims.map(dim => (
              <PillGroupColumn
                key={dim.key} group={dim.key} values={dim.values}
                items={ARTIFACTS} selected={selected} toggle={toggle}
              />
            ))}
          </div>
        )}
      </div>
    </ScrollFadeContainer>
  );
}

// ─── PRESETS — ported from v28 ──────────────────────────────────────────────
// O9 (wired 2026-06-07): shuffle / loop pills drive the real player — state
// is owned by Exhibit.jsx and crosses the seam as props (controls spec §9.2:
// Shuffle randomizes the next-up queue; Loop replays the current selection
// on end). Snapshot capture unchanged.
function PresetsContent({
  userPresets, setUserPresets, selected, setSelected,
  shuffle, setShuffle, loop, setLoop,
  playingTrack, spinePosition,
  onRestorePlayer, peekSelected, setPeekSelected,
  applyFactoryPreset,
}) {
  // §8.1 — applyFactoryPreset itself is hoisted to the root (shared with the
  // mobile presets surface); only the applied-card highlight state stays
  // local to the desktop tab. Desktop passes its setter into the hoisted fn.
  const [lastFactoryApplied, setLastFactoryApplied] = useState(null);

  const slotIsFilled = (slot) => !!userPresets[slot];
  const saveHere = (slot) => {
    const snap = makePresetSnapshot({ selected, shuffle, loop, playingTrack, spinePosition });
    snap.name = defaultPresetName(snap); // §5 #4: autopopulated, edit optional
    setUserPresets(prev => ({ ...prev, [slot]: snap }));
  };
  const renameSlot = (slot, name) => {
    setUserPresets(prev => prev[slot] ? { ...prev, [slot]: { ...prev[slot], name } } : prev);
  };
  // §0 Share: publish the slot's snapshot (same wire shape as persistence)
  // and put weird.baby/p/<id> on the clipboard. Clipboard denial degrades to
  // showing the link inline so it can be copied by hand.
  const [shareNote, setShareNote] = useState({});
  const noteTimerRef = useRef({});
  const flashNote = (slot, text, ms) => {
    setShareNote(s => ({ ...s, [slot]: text }));
    clearTimeout(noteTimerRef.current[slot]);
    noteTimerRef.current[slot] = setTimeout(
      () => setShareNote(s => ({ ...s, [slot]: null })), ms
    );
  };
  const shareSlot = async (slot) => {
    const p = userPresets[slot];
    if (!p) return;
    try {
      const r = await fetch("/api/presets", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: serializeSnapshot(p) }),
      });
      const j = await r.json();
      if (!r.ok || !j.id) throw new Error(j.error || "share failed");
      const link = `${window.location.origin}/p/${j.id}`;
      try {
        await navigator.clipboard.writeText(link);
        flashNote(slot, "link copied", 6000);
      } catch {
        flashNote(slot, link, 15000); // clipboard blocked → show it
      }
    } catch {
      flashNote(slot, "share failed", 4000);
    }
  };
  // Play (UX_PRESETS_SPEC s3): commits a saved preset -- deck AND jukebox
  // become the Active View. The only verb allowed to interrupt active
  // playback (controls s8.4). Player state restores by STABLE ids, resolved
  // to current spine indices at apply-time inside Exhibit.jsx
  // (onRestorePlayer); a snapshot saved while idle leaves playback alone.
  const playSlot = (slot) => {
    const p = userPresets[slot];
    if (!p) return;
    setPeekSelected(null);
    if (p.selected) {
      setSelected(cloneSelected(p.selected));
      setShuffle(!!p.shuffle);
      setLoop(!!p.loop);
    } else {
      setSelected(cloneSelected(p));
    }
    if (onRestorePlayer && (p.playingTrack || p.focusedAlbumId)) {
      onRestorePlayer({
        focusedAlbumId: p.focusedAlbumId ?? null,
        playingTrack: p.playingTrack ?? null,
      });
    }
  };
  // Show (s3): deck-only peek. Nothing commits; the jukebox keeps playing.
  const showSlot = (slot) => {
    const p = userPresets[slot];
    if (!p?.selected) return;
    setPeekSelected(cloneSelected(p.selected));
  };
  // Reset (s3, replaces "clear slot"): empties a user slot.
  const clearSlot = (slot) => {
    setUserPresets(prev => ({ ...prev, [slot]: null }));
  };

  return (
    <div className="wb-scroll hr-content-body">
      <div className="hr-presets-section-label">presets</div>
      {/* Now Playing (s3): visible only during a Show peek; returns the wall
          to the Active View. The jukebox was never touched by the peek. */}
      {peekSelected !== null && (
        <div
          role="button"
          onClick={() => setPeekSelected(null)}
          title="return the wall to the Active View"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            margin: "0 0 10px", padding: "5px 10px", width: "fit-content",
            border: "1px dashed " + GOLD_HI, borderRadius: 4,
            color: GOLD_HI, fontSize: 11, letterSpacing: "0.04em",
            cursor: "pointer", userSelect: "none",
          }}
        >
          <span style={{ opacity: 0.8 }}>showing a preset (deck only)</span>
          <span style={{ fontWeight: 600 }}>now playing &#x21a9;</span>
        </div>
      )}
      <div className="hr-presets-top-row">
        <div className="hr-presets-slots-col">
          {["P1", "P2", "P3"].map(slot => {
            const has = slotIsFilled(slot);
            const p = userPresets[slot];
            return (
              <div key={slot} style={S.presetSlotRow(has)}>
                <span className="hr-preset-slot-label">{slot}</span>
                {has ? (
                  // §5 #4 (Option A): inline-editable name, autopopulated at
                  // save — the visitor never has to type. Full filter summary
                  // stays available as the tooltip.
                  <input
                    className="hr-preset-name-input"
                    value={p.name ?? presetSummaryText(p)}
                    title={presetSummaryText(p)}
                    onChange={(e) => renameSlot(slot, e.target.value)}
                    aria-label={`name for preset ${slot}`}
                    maxLength={48}
                  />
                ) : (
                  <span style={S.presetSummary(true)}>empty</span>
                )}
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(has, true)}
                  onClick={has ? () => playSlot(slot) : undefined}
                  aria-disabled={!has}
                  title={has ? "commit this preset: deck + jukebox become the Active View" : undefined}
                >play</button>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(has, true)}
                  onClick={has ? () => showSlot(slot) : undefined}
                  aria-disabled={!has}
                  title={has ? "peek at this preset's wall without committing; the jukebox keeps playing" : undefined}
                >show</button>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(has, false)}
                  onClick={has ? () => clearSlot(slot) : undefined}
                  aria-disabled={!has}
                >reset</button>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(true, true)}
                  onClick={() => saveHere(slot)}
                  title={has ? "overwrite this slot with current state" : "save current state to this slot"}
                >save</button>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(has, true)}
                  onClick={has ? () => shareSlot(slot) : undefined}
                  aria-disabled={!has}
                  title={has ? "publish this preset and copy its weird.baby/p/ link" : undefined}
                >share</button>
                {shareNote[slot] && (
                  <span className="hr-preset-share-note">{shareNote[slot]}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className="hr-presets-player-col">
          <div className="hr-presets-player-label">player</div>
          {/* O9 (wired 2026-06-07) — shuffle / loop are live player controls:
              shuffle randomizes the next-up queue, loop replays the current
              selection on end (controls spec §9.2). Still captured into
              preset snapshots, same data shape. */}
          <div
            style={S.presetsPill(shuffle)}
            onClick={() => setShuffle(s => !s)}
            role="switch" aria-checked={shuffle}
          >
            <span>shuffle</span>
            <span style={S.presetsPillState(shuffle)}>{shuffle ? "on" : "off"}</span>
          </div>
          <div
            style={S.presetsPill(loop)}
            onClick={() => setLoop(l => !l)}
            role="switch" aria-checked={loop}
          >
            <span>loop</span>
            <span style={S.presetsPillState(loop)}>{loop ? "on" : "off"}</span>
          </div>
        </div>
      </div>

      <div className="hr-presets-section-label">factory</div>
      <div className="hr-factory-grid">
        {FACTORY_PRESETS.map(p => (
          <div
            key={p.key}
            style={S.presetCard(lastFactoryApplied === p.key)}
            onClick={() => applyFactoryPreset(p, setLastFactoryApplied)}
          >
            <span className="hr-preset-label">{p.label}</span>
            <span className="hr-preset-desc">{p.desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── JOURNAL — ported from quarantined HrExhibitFlow.jsx, fitted to deck body
// O5: Journal renders as the body of a tab between Deep Tracks and Presets.
// Layout adapts to the deck body's flexible height (default 480px, resizable).
// Vertical scroll inside the tab body when entries overflow.
const SEED_ENTRIES = [
  { id: 1, date: "2025-11-02", handle: "velvetcassette", ctx: "'Town Rat Heathen'", era: "solo",
    fact1: "I heard this in a coffee shop in Philly and made the barista tell me what was playing. Went home and listened to the whole catalog that night.",
    up: 7, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 2, date: "2025-12-14", handle: "rootsfan_pa", ctx: "Live at Tellus360", era: "solo",
    fact1: "Third time seeing him live. The room was maybe 40 people and it felt like he was playing for each one individually.",
    up: 5, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 3, date: "2026-01-08", handle: "lampshade_kid", ctx: "'Homestead'", era: "solo",
    fact1: "My partner and I listened to this driving through Lancaster County last fall. Now we can't hear it without seeing those fields.",
    up: 9, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 5, date: "2025-09-18", handle: "quiethighway", ctx: "'Reverend'", era: "solo",
    fact1: "The video for Reverend is the most cinematic thing I've seen from an independent artist. I keep showing it to people who don't believe me when I say this guy is unsigned.",
    up: 8, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 6, date: "2025-10-03", handle: "nick_would_know", ctx: "'My Brother's Bones'", era: "solo",
    fact1: "I lost my brother two years ago. This song found me at exactly the right time. I don't have words for what it did.",
    up: 11, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 7, date: "2026-01-22", handle: "porchlight_kid", ctx: "'Silver Lining'", era: "solo",
    fact1: "The reprise at the end of Arkansas hits different after you've been through the whole album. It earns it.",
    up: 6, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 8, date: "2025-06-15", handle: "analog_ears", ctx: "'Nothin' Wrong'", era: "solo",
    fact1: "Played this for my therapist. She asked me to play it again. That's all I need to say about it.",
    up: 10, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 9, date: "2026-03-01", handle: "crookedhome25", ctx: "'94'", era: "solo",
    fact1: "Opening Crooked Home with a year as a title ΓÇö that's a statement. You know right away this one is going to cost him something.",
    up: 5, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 10, date: "2025-07-20", handle: "violet_lemke_fan", ctx: "Violet Lemke cover", era: "solo",
    fact1: "Found Hunter Root through Violet Lemke's cover. Then I found the original and it ruined me. Now I listen to both.",
    up: 7, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 4, date: "2026-02-20", handle: "medusa_og", ctx: "Medusa's Disco", era: "medusas",
    fact1: "I was at the last Medusa's Disco show. Nobody knew it was the last one until it was. Different energy when you find out later.",
    up: 6, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 11, date: "2025-08-05", handle: "chameleon_regular", ctx: "Chameleon Club", era: "medusas",
    fact1: "Used to see Medusa's Disco at the Chameleon all the time. I didn't realize what I was watching until it was already over.",
    up: 4, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 12, date: "2026-03-10", handle: "sleepwalking_md", ctx: "Medusa's Disco", era: "medusas",
    fact1: "The energy at those early shows was something else. Nobody was on their phone. Everyone was just there.",
    up: 5, dn: 0, voted: null, mine: false, undoTimer: null },
  { id: 13, date: "2025-12-28", handle: "firstlight", ctx: "Pre-Hunter Root", era: "seeds",
    fact1: "I knew him before the name. Different songs, same thing in his voice. You could always hear it.",
    up: 3, dn: 0, voted: null, mine: false, undoTimer: null },
];

function JournalContent({ prompts, eraFilter }) {
  const [entries, setEntries]     = useState(SEED_ENTRIES);
  const [handle, setHandle]       = useState("");
  const [text, setText]           = useState("");
  const [promptIdx, setPromptIdx] = useState(0);
  const [feedIdx, setFeedIdx]     = useState(0);
  const promptTimerRef = useRef(null);
  const feedTimerRef   = useRef(null);
  const hoverRef       = useRef(false);
  const nextIdRef      = useRef(100);

  const filtered = useMemo(
    () => entries.filter(e => !eraFilter || eraFilter.size === 0 || eraFilter.has(e.era)),
    [entries, eraFilter]
  );

  // setState-in-effect is intentional here: the weighted order depends on
  // Math.random() (we shuffle), so useMemo would re-roll on every render.
  // We compute once whenever filtered.length / eraFilter changes. The
  // dependency on `filtered.length` (not `filtered`) is also intentional ΓÇö
  // we don't want to rebuild when an entry's vote count flips.
  const [weighted, setWeighted] = useState([]);
  useEffect(() => {
    const pool = [];
    filtered.forEach((e, i) => {
      const w = Math.max(1, e.up * 2 - e.dn + 1);
      for (let j = 0; j < w; j++) pool.push(i);
    });
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const seen = new Set();
    const next = pool.filter(idx => {
      if (seen.has(idx)) return false;
      seen.add(idx);
      return true;
    });
    setWeighted(next);
    setFeedIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, eraFilter]);

  useEffect(() => {
    clearInterval(promptTimerRef.current);
    promptTimerRef.current = setInterval(() => {
      setPromptIdx(prev => (prev + 1) % prompts.length);
    }, 9500);
    return () => clearInterval(promptTimerRef.current);
  }, [prompts.length]);

  useEffect(() => {
    clearInterval(feedTimerRef.current);
    feedTimerRef.current = setInterval(() => {
      if (!hoverRef.current && weighted.length > 0) {
        setFeedIdx(prev => (prev + 1) % weighted.length);
      }
    }, 8500);
    return () => clearInterval(feedTimerRef.current);
  }, [weighted]);

  function submitEntry() {
    if (!text.trim()) return;
    const h = handle.trim() || "anonymous";
    const newEntry = {
      id: nextIdRef.current++, date: new Date().toISOString().slice(0, 10),
      handle: h, ctx: null, era: "solo",
      fact1: text.trim(), up: 0, dn: 0, voted: null, mine: true, undoTimer: 10,
    };
    setEntries(prev => [newEntry, ...prev]);
    setText("");
    const countdownId = setInterval(() => {
      setEntries(prev => prev.map(e => {
        if (e.id !== newEntry.id || e.undoTimer === null) return e;
        return e.undoTimer <= 1 ? { ...e, undoTimer: null } : { ...e, undoTimer: e.undoTimer - 1 };
      }));
    }, 1000);
    setTimeout(() => clearInterval(countdownId), 11000);
  }

  function undoEntry(id) { setEntries(prev => prev.filter(e => e.id !== id)); }
  function deleteEntry(id) {
    if (typeof window !== "undefined" && !window.confirm("Delete this entry?")) return;
    setEntries(prev => prev.filter(e => e.id !== id));
  }

  function vote(id, dir) {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e;
      if (e.voted === dir) {
        return {
          ...e, voted: null,
          up: dir === "up" ? e.up - 1 : e.up,
          dn: dir === "dn" ? e.dn - 1 : e.dn,
        };
      }
      const prevUp = e.voted === "up" ? e.up - 1 : e.up;
      const prevDn = e.voted === "dn" ? e.dn - 1 : e.dn;
      const newUp = dir === "up" ? prevUp + 1 : prevUp;
      const newDn = dir === "dn" ? prevDn + 1 : prevDn;
      return { ...e, voted: dir, up: newUp, dn: newDn };
    }));
  }

  const prompt = prompts[promptIdx % prompts.length];
  const feedOrder = weighted;
  const feedEntry = feedOrder.length > 0
    ? filtered[feedOrder[feedIdx % feedOrder.length]]
    : null;

  return (
    <div
      className="wb-scroll hr-content-body hr-journal-body"
      onMouseEnter={() => { hoverRef.current = true; }}
      onMouseLeave={() => { hoverRef.current = false; }}
    >
      <div className="hr-jnl-prompt">
        {prompt?.line1}<br />{prompt?.line2}
      </div>

      <div className="hr-jnl-compose">
        <input
          className="hr-jnl-handle"
          type="text" placeholder="your handle"
          value={handle}
          onChange={e => setHandle(e.target.value)}
          maxLength={24}
        />
        <textarea
          className="hr-jnl-text"
          placeholder="Leave your mark..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
        />
        <button className="hr-jnl-submit" onClick={submitEntry}>Leave it</button>
      </div>

      <div className="hr-jnl-feed">
        {entries.filter(e => e.undoTimer !== null).map(e => (
          <div key={e.id} className="hr-jnl-entry hr-jnl-entry-new">
            <div className="hr-jnl-entry-head">
              <span className="hr-jnl-entry-who">{e.handle}</span>
              <span className="hr-jnl-entry-when">{e.date}</span>
            </div>
            <div className="hr-jnl-entry-body">{e.fact1}</div>
            <button className="hr-jnl-undo" onClick={() => undoEntry(e.id)}>Undo ({e.undoTimer}s)</button>
          </div>
        ))}

        {feedEntry && feedEntry.undoTimer === null && (
          <div className="hr-jnl-entry">
            <div className="hr-jnl-entry-head">
              <span className="hr-jnl-entry-who">{feedEntry.handle}</span>
              {feedEntry.ctx && <span className="hr-jnl-entry-ctx">{feedEntry.ctx}</span>}
              <span className="hr-jnl-entry-when">{feedEntry.date}</span>
            </div>
            <div className="hr-jnl-entry-body">{feedEntry.fact1}</div>
            <div className="hr-jnl-entry-actions">
              <button
                className={`hr-jnl-vote${feedEntry.voted === "up" ? " hr-jnl-vote-on" : ""}`}
                onClick={() => vote(feedEntry.id, "up")}
              >&#9650; {feedEntry.up}</button>
              <button
                className={`hr-jnl-vote${feedEntry.voted === "dn" ? " hr-jnl-vote-on" : ""}`}
                onClick={() => vote(feedEntry.id, "dn")}
              >&#9660; {feedEntry.dn}</button>
              {feedEntry.mine && (
                <button className="hr-jnl-delete" onClick={() => deleteEntry(feedEntry.id)}>delete</button>
              )}
            </div>
          </div>
        )}

        {feedOrder.length > 1 && (
          <div className="hr-jnl-feed-nav">
            <button
              className="hr-jnl-btn"
              onClick={() => setFeedIdx(prev => (prev - 1 + feedOrder.length) % feedOrder.length)}
            >{"‹"}</button>
            <span className="hr-jnl-counter">
              {(feedIdx % feedOrder.length) + 1} / {feedOrder.length}
            </span>
            <button
              className="hr-jnl-btn"
              onClick={() => setFeedIdx(prev => (prev + 1) % feedOrder.length)}
            >{"›"}</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ΓöÇΓöÇΓöÇ AUDIT STRIP ΓÇö O12: dev-only ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
function _mkSel(groups) {
  const out = {};
  HR_DIMENSIONS.forEach(({ key }) => { out[key] = new Set(); });
  for (const [k, vs] of Object.entries(groups)) out[k] = new Set(Array.isArray(vs) ? vs : [vs]);
  return out;
}
function _runMatch(sel) { return ARTIFACTS.filter(i => matchFilter(i, sel)).length; }

// Audit assertions are written generically against the v5 tag-shape ΓÇö they
// use `tags[group]?.includes(slug)` so they're correct against any artifact
// set without hardcoding HR-specific namespaces. AuditStrip remains dev-only
// and is not rendered; the function is preserved for revival.
function _itemCarries(item, group, slug) {
  const arr = item?.tags?.[group];
  return Array.isArray(arr) && arr.includes(slug);
}

function buildAuditResults() {
  const N = ARTIFACTS.length;
  const tests = [];
  // 1. all off ΓåÆ full catalog
  const t1 = _runMatch(_mkSel({}));
  tests.push({ id: 1, name: "all off ΓåÆ full catalog", expected: N, actual: t1, pass: t1 === N });
  // Tests 2-4 sample the first discovered dimension; if no dimensions exist
  // (e.g., before the first export populates the exhibit JSON), the sample
  // tests are reported as trivially passing.
  const firstDim = HR_DIMENSIONS[0];
  const sampleSlug = firstDim?.values?.[0] ?? null;
  const sampleSlug2 = firstDim?.values?.[1] ?? null;
  if (firstDim && sampleSlug) {
    const expected2 = ARTIFACTS.filter(i => _itemCarries(i, firstDim.key, sampleSlug)).length;
    const t2 = _runMatch(_mkSel({ [firstDim.key]: sampleSlug }));
    tests.push({ id: 2, name: `${firstDim.key}: ${sampleSlug} alone`, expected: expected2, actual: t2, pass: t2 === expected2 });
    if (sampleSlug2) {
      const expected3 = ARTIFACTS.filter(i => _itemCarries(i, firstDim.key, sampleSlug) || _itemCarries(i, firstDim.key, sampleSlug2)).length;
      const t3 = _runMatch(_mkSel({ [firstDim.key]: [sampleSlug, sampleSlug2] }));
      tests.push({ id: 3, name: `${firstDim.key}: within-group OR`, expected: expected3, actual: t3, pass: t3 === expected3 });
    }
  }
  const allPass = tests.every(t => t.pass);
  return { tests, allPass, catalogSize: N };
}

function AuditStrip() {
  const [open, setOpen] = useState(false);
  const result = useMemo(() => buildAuditResults(), []);
  const { tests, allPass, catalogSize } = result;
  const barBg = allPass ? "rgba(40, 64, 36, 0.92)" : "rgba(72, 28, 28, 0.92)";
  const barFg = allPass ? "#b9d8a6" : "#e9b0b0";
  return (
    <div
      className="hr-audit-strip"
      style={{
        position: "fixed", right: "12px", bottom: "12px", zIndex: 9999,
        fontFamily: sansBody, fontSize: "11px", letterSpacing: "0.04em",
        color: barFg, background: barBg,
        border: "1px solid " + (allPass ? "#4a6a3e" : "#7a3a3a"),
        borderRadius: "4px", padding: "6px 10px", maxWidth: "360px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
        cursor: "pointer", userSelect: "none",
      }}
      onClick={() => setOpen(o => !o)}
      title="HR phase 1.5b sanity audit"
    >
      <div style={{ fontWeight: 600, textTransform: "uppercase" }}>
        hr audit ┬╖ {allPass ? "ALL PASS" : "FAIL"} ┬╖ {tests.filter(t => t.pass).length}/{tests.length} ┬╖ catalog={catalogSize} {open ? "Γû╛" : "Γû╕"}
      </div>
      {open && (
        <div style={{ marginTop: "6px", fontSize: "10.5px", lineHeight: 1.5 }}>
          {tests.map(t => (
            <div key={t.id} style={{ color: t.pass ? "#cde1bd" : "#f3c2c2" }}>
              {t.pass ? "Γ£ô" : "Γ£ù"} #{t.id} {t.name}
              <span style={{ opacity: 0.75, marginLeft: "6px" }}>exp={t.expected} got={t.actual}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ΓöÇΓöÇΓöÇ ROOT ΓÇö HrExhibitFlow component, exported for Exhibit.jsx line 908 ΓöÇΓöÇΓöÇΓöÇΓöÇΓöÇ
export default function HrExhibitFlow({
  activeAlbumId, playingTrack = null, onRestorePlayer,
  // O9 (wired 2026-06-07): shuffle / loop are owned by the player in
  // Exhibit.jsx and cross the seam as props — same prop-widening mechanism
  // as playingTrack / onRestorePlayer (presets spec §9). Defaults keep the
  // component safe if mounted without a player host.
  shuffle = false, setShuffle = () => {},
  loop = false, setLoop = () => {},
}) {
  // Preset capture (UX_PRESETS_SPEC s8.2/s9): real player state crosses the
  // Exhibit.jsx seam as props. activeAlbumId is the focused album's STABLE id
  // (recorded as focusedAlbumId in snapshots); playingTrack is
  // { albumId, trackId, variantId } in stable ids, or null when idle.
  // eslint-disable-next-line no-unused-vars -- TABS-OUT Stage A: deep-search query retired with the tier tabs; setQuery still referenced by preserved clear()
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => makeEntrySelection());
  // Phase C: one-card-at-a-time audio playback. Lifted here so that
  // tapping play on card B while card A is playing pauses card A (each
  // AudioCard reads isPlaying = playingAudioId === card.id). Per the
  // operator-locked rule (2026-05-22), filter changes do NOT touch this
  // state; no useEffect resets it on selected/tagFiltered shifts.
  const [playingAudioId, setPlayingAudioId] = useState(null);
  // Phase 3: gallery lightbox. Holds the open gallery container card (or null).
  // Lifted to the root so the overlay layers above the deck/grid and survives
  // grid reflows. Closed via Γ£ò / backdrop / Escape (see GalleryOverlay).
  const [openGallery, setOpenGallery] = useState(null);
  // RWTH parity: album overlay. Holds the open album container card (or null),
  // lifted to the root so the modal layers above the deck and survives reflows.
  const [openAlbum, setOpenAlbum] = useState(null);
  // Universal-lightbox build 1: YouTube player overlay. Holds the open YouTube
  // card (or null), lifted to the root so the modal layers above the deck and
  // survives grid reflows. {openYouTube && ΓÇª} also tears down the iframe player
  // on close (Γ£ò / backdrop / Escape) so audio stops.
  const [openYouTube, setOpenYouTube] = useState(null);
  // Universal-lightbox build 2: Facebook post/video overlay. Holds the open FB
  // card (or null), lifted to the root so the modal layers above the deck and
  // survives grid reflows. {openFacebook && ΓÇª} also tears down the post.php
  // iframe on close (Γ£ò / backdrop / Escape) so any playing FB video stops.
  const [openFacebook, setOpenFacebook] = useState(null);
  // Universal-lightbox build 4: photo overlay (the single Instagram card today).
  // Holds the open photo card (or null), lifted to the root so the modal layers
  // above the deck and survives grid reflows. {openPhoto && ΓÇª} unmounts the
  // overlay on close (Γ£ò / backdrop / Escape); the self-hosted image needs no
  // player teardown (no iframe/audio), unlike YouTube/Facebook.
  const [openPhoto, setOpenPhoto] = useState(null);
  // v7_1 pop-over (2026-06-15): the filter ICON in the deck strip opens this
  // overlay (FilterInstrumentOverlay) above the static museum. Held at the root
  // so it layers over the deck/grid like the other lightboxes. Filter changes
  // route through the existing `toggle`/`setSelected`, so playback is never
  // touched (operator-locked rule).
  const [filterOpen, setFilterOpen] = useState(false);
  // BAR-DOCK (2026-06-16): Filter + Presets triggers relocated from the deck
  // tab-strip into the always-on player bar. The bar is a generic sibling
  // (PlayerBar / .pb in Exhibit.jsx), so HR injects its controls through a
  // portal into the bar's #hr-bar-slot. barSlot holds that mount node once it
  // exists; presetsBarOpen drives the bar-launched Presets pop-over. All logic
  // (setFilterOpen, applyFactoryPreset, PresetsContent) is reused unchanged —
  // this is a trigger relocation, not an engine change.
  const [barSlot, setBarSlot] = useState(null);
  const [presetsBarOpen, setPresetsBarOpen] = useState(false);
  useEffect(() => {
    // PlayerBar is always mounted (Exhibit renders it as a sibling), so the
    // slot exists after first paint. Re-query is cheap and guards remounts.
    const el = document.getElementById("hr-bar-slot");
    if (el) setBarSlot(el);
  }, []);
  // MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
  // setKalState is wired into clear() so the dormant state stays in sync;
  // kalState is intentionally not read in v1.
  const [_kalState, setKalState] = useState(KAL_STATE_DEFAULT);
  const spinePosition = activeAlbumId ?? null;
  // Show / Now Playing (UX_PRESETS_SPEC s3): a Show peek swaps the DECK's
  // filter input only -- the jukebox keeps playing untouched (controls s8.4,
  // 'Show is consequence-free'). peekSelected holds the peeked preset's
  // selection, or null when the wall shows the Active View. Any committed
  // filter interaction (toggle / clear) dismisses the peek first.
  const [peekSelected, setPeekSelected] = useState(null);

  // §5 #3 idle auto-return (Option A): while a Show peek is up, a song
  // change with the visitor idle ≥ IDLE_RETURN_MS clears the peek —
  // automatic Now Playing. "Touch" = any pointer or key input anywhere on
  // the page (capture phase). Song identity = albumId/trackId (a variant
  // advance within the same song does not count as a song change).
  const lastTouchRef = useRef(Date.now());
  useEffect(() => {
    const touch = () => { lastTouchRef.current = Date.now(); };
    window.addEventListener("pointerdown", touch, true);
    window.addEventListener("keydown", touch, true);
    return () => {
      window.removeEventListener("pointerdown", touch, true);
      window.removeEventListener("keydown", touch, true);
    };
  }, []);
  // §0 sharing + §5 #5 Lobby-first: a /p/<id> visit parked its snapshot in
  // sessionStorage; apply it ONCE on arrival with the Play verb's semantics
  // (§3: deck + jukebox become the Active View). Consumed on read so
  // back-navigation doesn't re-apply. Note: player restore happens outside
  // a user gesture — if the browser blocks autoplay, the track loads ready
  // to play rather than playing; the deck state applies regardless.
  useEffect(() => {
    let raw = null;
    try {
      raw = sessionStorage.getItem("wb_pending_preset");
      if (raw) sessionStorage.removeItem("wb_pending_preset");
    } catch { /* storage unavailable → nothing to apply */ }
    if (!raw) return;
    let p = null;
    try { p = deserializeSnapshot(JSON.parse(raw)); } catch { /* malformed → ignore */ }
    if (!p) return;
    setSelected(cloneSelected(p.selected));
    setShuffle(!!p.shuffle);
    setLoop(!!p.loop);
    if (onRestorePlayer && (p.playingTrack || p.focusedAlbumId)) {
      onRestorePlayer({
        focusedAlbumId: p.focusedAlbumId ?? null,
        playingTrack: p.playingTrack ?? null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prevSongKeyRef = useRef(null);
  useEffect(() => {
    const key = playingTrack ? `${playingTrack.albumId}/${playingTrack.trackId}` : null;
    const prev = prevSongKeyRef.current;
    prevSongKeyRef.current = key;
    if (peekSelected === null) return;
    if (!key || !prev || key === prev) return;            // only a real song-to-song change
    if (Date.now() - lastTouchRef.current < IDLE_RETURN_MS) return; // visitor not idle
    setPeekSelected(null); // automatic Now Playing (spec §3)
  }, [playingTrack, peekSelected]);

  // §8.1 — hoisted from PresetsContent so the desktop deck tab and the
  // mobile presets surface share one apply path. At apply time a factory
  // preset is normalized to the same field shape Save emits
  // (makePresetSnapshot), with the player fields explicitly neutral:
  // factory presets are deck curations, not captured moments — there is
  // no track to restore. playingTrack: null is the same "leave playback
  // alone" signal Save already emits when nothing is playing; mobile Play
  // reads it identically (§8.4: the jukebox plays on). We never fabricate
  // a track id. The highlight setter is an optional arg defaulting to a
  // no-op: desktop passes its applied-card setter; mobile omits it (no
  // applied highlight on mobile).
  const applyFactoryPreset = (preset, setHighlight = () => {}) => {
    setPeekSelected(null); // factory apply is a commit; leave any Show peek
    const next = preset.apply();
    const cleared = {};
    HR_DIMENSIONS.forEach(({ key }) => { cleared[key] = new Set(); });
    const normalized = {
      selected: next.__randomIds
        ? { ...cleared, __randomIds: next.__randomIds }
        : Object.assign(cleared, next),
      shuffle: false,
      loop: false,
      playingTrack: null,   // nothing playing to restore — jukebox plays on
      focusedAlbumId: null, // no captured spine focus
    };
    // Only the deck commits. playingTrack / focusedAlbumId are both null,
    // so the playSlot restore gate (p.playingTrack || p.focusedAlbumId)
    // would never fire — same as applying a snapshot saved while idle.
    setSelected(normalized.selected);
    setHighlight(preset.key);
  };
  const [activeTab, setActiveTab] = useState(null);
  const [hoverPeek, setHoverPeek] = useState(false);
  const [deckWidth, setDeckWidth] = useState(() => {
    try {
      const raw = typeof localStorage !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const n = parseInt(raw, 10);
        if (!isNaN(n) && n >= DECK_MIN_H) return n;
      }
    } catch { /* ignore */ }
    return DECK_DEFAULT_H_SHARED;
  });
  const [resizing, setResizing] = useState(false);
  const [resizeHover, setResizeHover] = useState(false);
  // Controls §9.5 v1: user preset slots persist in localStorage (exhibit-
  // scoped key). Hydrate once on mount; write-through on every change below.
  const [userPresets, setUserPresets] = useState(() => loadUserPresets());
  // eslint-disable-next-line no-unused-vars -- TABS-OUT Stage A: Deep Tracks auto-focus retired with the tier tabs; preserved for revival
  const [searchFocusSignal, setSearchFocusSignal] = useState(0);
  // Per UX_CONTROLS_SPEC v0.4 ┬º5.5: auto-focus the Deep Tracks search input on
  // first open of the tab per session only. Subsequent opens do not steal focus.
  // eslint-disable-next-line no-unused-vars -- TABS-OUT Stage A: Deep Tracks auto-focus retired with the tier tabs; preserved for revival
  const searchAutoFocusedRef = useRef(false);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, String(deckWidth));
      }
    } catch { /* ignore */ }
  }, [deckWidth]);

  // Write-through preset persistence (controls §9.5 v1). Mirrors the
  // deck-height pattern above: best-effort, silent on quota/privacy errors.
  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          PRESETS_STORAGE_KEY,
          JSON.stringify(serializeUserPresets(userPresets))
        );
      }
    } catch { /* ignore */ }
  }, [userPresets]);

  // Tag filters narrow the catalog. Kaleidoscope recipe is dormant in v1.
  const tagFiltered = useMemo(
    () => ARTIFACTS.filter(c => matchFilter(c, peekSelected ?? selected)),
    [selected, peekSelected]
  );
  const finalMatched = tagFiltered;

  const toggle = (group, tag) => {
    setPeekSelected(null); // touching committed filters returns to the Active View
    setSelected(prev => {
      const next = {};
      for (const { key } of HR_DIMENSIONS) next[key] = new Set(prev[key] ?? []);
      if (next[group].has(tag)) next[group].delete(tag);
      else next[group].add(tag);
      return next;
    });
  };

  // eslint-disable-next-line no-unused-vars -- preserved for future revival of the original clear-all behavior
  const clear = () => {
    setPeekSelected(null);
    setSelected(makeEntrySelection());
    setKalState(KAL_STATE_DEFAULT);
    setShuffle(false);
    setLoop(false);
    setQuery("");
  };

  // Per-tab clear: scope the reset to just the dimensions/state that the given
  // tab owns. TABS-OUT Stage A: the Board tab clears every TOTAL facet it shows
  // (the five renderBoard columns). Presets clears shuffle/loop. Journal has
  // nothing to clear.
  const clearTab = (tabKey) => {
    const tab = TABS.find(t => t.key === tabKey);
    if (!tab) return;
    setPeekSelected(null);
    if (tab.special === "board") {
      setSelected(prev => {
        const next = {};
        for (const d of HR_DIMENSIONS) next[d.key] = new Set(prev[d.key] ?? []);
        for (const key of BOARD_TOTAL_KEYS) next[key] = new Set();
        return next;
      });
    } else if (tab.special === "presets") {
      setShuffle(false);
      setLoop(false);
    }
  };

  // Does this tab have anything to clear right now?
  const tabHasSelection = (tab) => {
    if (tab.special === "board") {
      return BOARD_TOTAL_KEYS.some(key => (selected[key] instanceof Set) && selected[key].size > 0);
    }
    if (tab.special === "presets") return shuffle || loop;
    return false;
  };

  const anyTagSelected = selected.__randomIds
    || Object.values(selected).some(s => s instanceof Set && s.size > 0);
  // eslint-disable-next-line no-unused-vars -- preserved for future revival of the strip-level clear-all button
  const anySelected = anyTagSelected || shuffle || loop;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && (activeTab || hoverPeek)) {
        setActiveTab(null); setHoverPeek(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeTab, hoverPeek]);

  useEffect(() => {
    const onResize = () => {
      const vw = window.innerWidth;
      setDeckWidth(prev => Math.max(DECK_MIN_H, Math.min(prev, vw * DECK_MAX_FRAC)));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scheduleHoverOpen = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => { setHoverPeek(true); }, HOVER_DELAY_OPEN);
  };
  const scheduleHoverClose = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => { setHoverPeek(false); }, HOVER_DELAY_CLOSE);
  };
  const cancelHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const open = activeTab !== null && activeTab !== "close";
  let deckW;
  if (open) deckW = deckWidth;
  else if (hoverPeek) deckW = TAB_STRIP_H;
  else deckW = TAB_PEEK;

  const handleTabClick = (tabKey) => {
    if (tabKey === "close") { setActiveTab(null); setHoverPeek(false); return; }
    if (activeTab === tabKey) { setActiveTab(null); setHoverPeek(false); return; }
    setActiveTab(tabKey);
    setHoverPeek(false);
  };

  const startResize = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setResizing(true);
    const startX = e.clientX, startW = deckWidth, vw = window.innerWidth;
    const onMove = (me) => {
      const dx = me.clientX - startX;
      let next = startW + dx;
      next = Math.max(DECK_MIN_H, Math.min(next, vw * DECK_MAX_FRAC));
      setDeckWidth(next);
    };
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [deckWidth]);

  const animClass = "animated" + (resizing ? " resizing" : (!open && hoverPeek ? " quick" : ""));
  const panelClickHandler = () => {
    if (open || hoverPeek) {
      setActiveTab(null); setHoverPeek(false); cancelHoverTimer();
    }
  };
  const currentTab = activeTab && activeTab !== "close"
    ? TABS.find(t => t.key === activeTab)
    : null;

  // Mobile fallback flag (O11). The CSS hides the deck and re-flows pill
  // columns inline above the grid below 720px. We render the pill columns
  // unconditionally; visibility is controlled by the .hr-mobile-pills /
  // .hr-section-deck-host CSS rules so the React tree stays stable.
  return (
    <section className="hr-section">
      {openGallery && (
        <GalleryOverlay card={openGallery} onClose={() => setOpenGallery(null)} />
      )}
      {openAlbum && (
        <AlbumOverlay card={openAlbum} onClose={() => setOpenAlbum(null)} />
      )}
      {openYouTube && (
        <YouTubeOverlay card={openYouTube} onClose={() => setOpenYouTube(null)} />
      )}
      {openFacebook && (
        <FacebookOverlay card={openFacebook} onClose={() => setOpenFacebook(null)} />
      )}
      {openPhoto && (
        <PhotoOverlay card={openPhoto} onClose={() => setOpenPhoto(null)} />
      )}
      {filterOpen && (
        <FilterInstrumentOverlay
          selected={selected}
          setSelected={setSelected}
          toggle={toggle}
          factoryPresets={FACTORY_PRESETS}
          applyFactoryPreset={applyFactoryPreset}
          matchedCount={finalMatched.length}
          totalCount={ARTIFACTS.length}
          onClose={() => setFilterOpen(false)}
        />
      )}
      {/* BAR-DOCK (2026-06-16) — Filter + Presets triggers, relocated from the
          deck tab-strip into the always-on player bar. Portaled into the bar's
          generic #hr-bar-slot (PlayerBar lives in Exhibit.jsx, a sibling of
          this flow). Filter opens the unchanged FilterInstrumentOverlay; Presets
          opens a bar-anchored pop-over hosting the existing PresetsContent with
          the same props as the (now-removed) deck-tab instance. No engine
          change; matchFilter/applyFactoryPreset untouched. The pop-over is a
          child of the fixed bar's stacking context, so it opens ABOVE the bar
          and above the deck (the root FilterInstrumentOverlay at z-index 1200
          still layers over both). */}
      {barSlot && createPortal(
        <>
          <div className="hr-bar-trigs">
            <button
              type="button"
              className={"hr-bar-trig" + (filterOpen ? " is-on" : "")}
              title="Filters"
              aria-label="Open filters"
              aria-pressed={filterOpen}
              onClick={() => { setPresetsBarOpen(false); setFilterOpen(true); }}
            >
              <span className="hr-bar-trig-ico" aria-hidden="true">
                <svg viewBox="0 0 16 16">
                  <path d="M1 2.5h14l-5.4 6.2v4.4l-3.2 1.6V8.7z" fill="currentColor" />
                </svg>
              </span>
              <span className="hr-bar-trig-lbl">Filters</span>
            </button>
            <button
              type="button"
              className={"hr-bar-trig" + (presetsBarOpen ? " is-on" : "")}
              title="Presets"
              aria-label="Open presets"
              aria-haspopup="dialog"
              aria-expanded={presetsBarOpen}
              onClick={() => setPresetsBarOpen(o => !o)}
            >
              <span className="hr-bar-trig-ico" aria-hidden="true">
                <svg viewBox="0 0 16 16" fill="none">
                  <line x1="2" y1="4.5" x2="14" y2="4.5" stroke="currentColor" strokeWidth="1.3" />
                  <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.3" />
                  <line x1="2" y1="11.5" x2="14" y2="11.5" stroke="currentColor" strokeWidth="1.3" />
                  <circle cx="5.5" cy="4.5" r="1.7" fill="currentColor" />
                  <circle cx="10.5" cy="8" r="1.7" fill="currentColor" />
                  <circle cx="6.5" cy="11.5" r="1.7" fill="currentColor" />
                </svg>
              </span>
              <span className="hr-bar-trig-lbl">Presets</span>
            </button>
          </div>
          {presetsBarOpen && (
            <>
              <div
                className="hr-bar-pop-scrim"
                aria-hidden="true"
                onClick={() => setPresetsBarOpen(false)}
              />
              <div className="hr-bar-pop" role="dialog" aria-label="Presets">
                <div className="hr-bar-pop-head">
                  <span>presets</span>
                  <button
                    type="button"
                    className="hr-bar-pop-x"
                    aria-label="Close presets"
                    onClick={() => setPresetsBarOpen(false)}
                  >✕</button>
                </div>
                <div className="hr-bar-pop-body">
                  <PresetsContent
                    userPresets={userPresets} setUserPresets={setUserPresets}
                    selected={selected} setSelected={setSelected}
                    shuffle={shuffle} setShuffle={setShuffle}
                    loop={loop} setLoop={setLoop}
                    playingTrack={playingTrack} spinePosition={spinePosition}
                    onRestorePlayer={onRestorePlayer}
                    peekSelected={peekSelected} setPeekSelected={setPeekSelected}
                    applyFactoryPreset={applyFactoryPreset}
                  />
                </div>
              </div>
            </>
          )}
        </>,
        barSlot
      )}
      {/* MOBILE PRESETS (§8.1) — factory presets as a tappable pill stack
          above the inline pill columns. Deck curations only: a tap commits
          deck filters via the hoisted applyFactoryPreset (which dismisses
          any Show peek through the existing peekSelected path) and leaves
          the jukebox alone. No Save, no Reset, no applied-card highlight on
          mobile (the highlight setter is omitted → no-op). Hidden on
          desktop via CSS. */}
      <div className="hr-mobile-presets">
        {FACTORY_PRESETS.map(p => (
          <div
            key={p.key}
            className="hr-mobile-preset-pill"
            role="button"
            onClick={() => applyFactoryPreset(p)}
          >
            <span className="hr-preset-label">{p.label}</span>
            <span className="hr-preset-desc">{p.desc}</span>
          </div>
        ))}
      </div>
      {/* MOBILE FALLBACK ΓÇö pill columns render inline above the grid on
          narrow viewports. CSS hides this on desktop and hides the deck
          on mobile. */}
      <div className="hr-mobile-pills">
        {HR_DIMENSIONS.map(dim => (
          <PillGroupColumn
            key={dim.key} group={dim.key} values={dim.values}
            items={ARTIFACTS} selected={selected} toggle={toggle}
          />
        ))}
      </div>

      {/* DECK HOST ΓÇö sized so the deck can sit at its bottom via sticky
          positioning. The grid scrolls inside hr-section-deck-host. */}
      <div className="hr-section-deck-host">
        <div className={"animated " + (resizing ? "resizing " : (!open && hoverPeek ? "quick " : ""))}
             style={{ ...S.panelPos(deckW), position: "absolute" }}
             onClick={panelClickHandler}>
          <div className="wb-scroll hr-panel-scroll">
            <P3Panel
              matched={finalMatched}
              totalCount={ARTIFACTS.length}
              playingAudioId={playingAudioId}
              setPlayingAudioId={setPlayingAudioId}
              onOpenGallery={setOpenGallery}
              onOpenAlbum={setOpenAlbum}
              onOpenYouTube={setOpenYouTube}
              onOpenFacebook={setOpenFacebook}
              onOpenPhoto={setOpenPhoto}
            />
          </div>
        </div>

        <div className={"hr-deck " + animClass} style={S.deck(deckW)} onClick={(e) => e.stopPropagation()}>
          <div
            className="hr-tab-strip"
            onMouseEnter={() => { if (!open) { cancelHoverTimer(); scheduleHoverOpen(); } }}
            onMouseLeave={() => { if (!open) scheduleHoverClose(); }}
          >
            {/* BAR-DOCK (2026-06-16): the Filter ICON (special:"board") and the
                Presets tab (special:"presets") are no longer rendered here —
                both triggers now live in the player bar (see barControls portal
                at the root). Journal keeps its existing exclusion/behaviour. */}
            {TABS.filter(t => t.key !== "journal" && t.special !== "board" && t.special !== "presets").map(t => {
              // v7_1 pop-over: the board tab is now a filter ICON that opens the
              // FilterInstrumentOverlay instead of expanding the deck body. It
              // reads "active" while the overlay is open so the icon stays lit.
              const isBoardTrigger = t.special === "board";
              const isActive = isBoardTrigger ? filterOpen : activeTab === t.key;
              const isClose = t.kind === "close";
              return (
                <div
                  key={t.key}
                  className={isActive ? "" : "tab-hoverable"}
                  style={S.tab(isActive, open, t.width, isClose)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isBoardTrigger) setFilterOpen(true);
                    else handleTabClick(t.key);
                  }}
                  role="button"
                  title={isBoardTrigger ? "Filters" : t.label}
                >
                  <span>
                    {isBoardTrigger ? (
                      <span className="hrfi-trigger-ico" aria-label="Open filters">
                        <svg viewBox="0 0 16 16" aria-hidden="true">
                          <path d="M1 2.5h14l-5.4 6.2v4.4l-3.2 1.6V8.7z" fill="currentColor" />
                        </svg>
                      </span>
                    ) : t.label}
                  </span>
                  {(() => {
                    const has = tabHasSelection(t);
                    return (
                      <span
                        role={has ? "button" : undefined}
                        title={has ? `clear ${t.label.toLowerCase()} selections` : undefined}
                        onClick={has ? (e) => { e.stopPropagation(); clearTab(t.key); } : undefined}
                        style={{
                          position: "absolute", top: 2, right: 4,
                          fontSize: 12, lineHeight: 1, padding: "0 4px",
                          cursor: has ? "pointer" : "default",
                          color: GOLD_HI,
                          opacity: has ? 0.85 : 0.18,
                          transition: "opacity 0.12s",
                        }}
                        onMouseEnter={has ? (e) => { e.currentTarget.style.opacity = "1"; } : undefined}
                        onMouseLeave={has ? (e) => { e.currentTarget.style.opacity = "0.85"; } : undefined}
                      >{"✕"}</span>
                    );
                  })()}
                  {isActive && open && (
                    <span aria-hidden style={{
                      position: "absolute", top: -1, bottom: -1, right: -1,
                      width: 1, background: INK_SOFT, pointerEvents: "none",
                    }} />
                  )}
                </div>
              );
            })}
            {open && (
              <div
                role="button"
                aria-label="Hide panel"
                title="Hide panel"
                className="tab-hoverable"
                onClick={(e) => { e.stopPropagation(); setActiveTab(null); setHoverPeek(false); cancelHoverTimer(); }}
                style={S.tab(false, open, 34, true)}
              >
                <span aria-hidden="true">◂</span>
              </div>
            )}
          </div>

          {open && currentTab && (
            <div className="hr-deck-body">
              <div
                style={S.resizeHandle(resizeHover || resizing)}
                onMouseDown={startResize}
                onMouseEnter={() => setResizeHover(true)}
                onMouseLeave={() => setResizeHover(false)}
              />
              {currentTab.kind === "special" && currentTab.special === "board" && (
                <BoardContent selected={selected} toggle={toggle} />
              )}
              {currentTab.kind === "special" && currentTab.special === "journal" && (
                <JournalContent prompts={HR_JOURNAL_PROMPTS} eraFilter={null} />
              )}
              {currentTab.kind === "special" && currentTab.special === "presets" && (
                <PresetsContent
                  userPresets={userPresets} setUserPresets={setUserPresets}
                  selected={selected} setSelected={setSelected}
                  shuffle={shuffle} setShuffle={setShuffle}
                  loop={loop} setLoop={setLoop}
                  playingTrack={playingTrack} spinePosition={spinePosition}
                  onRestorePlayer={onRestorePlayer}
                  peekSelected={peekSelected} setPeekSelected={setPeekSelected}
                  applyFactoryPreset={applyFactoryPreset}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* O12 ΓÇö AuditStrip removed: was a dev-only fixed-bottom-right pill at
          z-index 9999 that occluded the player bar's right-side controls.
          The AuditStrip function is kept above for easy revival. */}
    </section>
  );
}