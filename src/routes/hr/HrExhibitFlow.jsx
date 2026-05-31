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
//   - O7: localStorage key is `wb-hr-deck-height` (HR-namespaced).
//   - O8: preset snapshots capture player state for display only — APPLY
//     does not restore player state in v1. Comment block at makePresetSnapshot.
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
const ARTIFACTS = Array.isArray(EXHIBIT?.artifacts) ? EXHIBIT.artifacts : [];
const { HR_DIMENSIONS, HR_GROUP_LABELS, displayFor } = buildDimensions(ARTIFACTS);

// ─── COLOR / FONT TOKENS ────────────────────────────────────────────────────
// Phase 4b: retargeted from the deck's v28 warm-amber palette to the
// canonical museum palette in src/styles/museum-tokens.css. These constants
// mirror the --hr-* CSS variables so every S.* inline-style builder picks up
// the new look automatically.
const INK = "#080808";
const INK_SOFT = "#0d0d0d";
const INK_CARD = "#0a0a0a";          // solid hex, not rgba (Q3 flattened)
const INK_CARD_HI = "#0e0e0e";       // solid hex, not rgba
const BORDER = "#1a1a1a";
const BORDER_HI = "#252525";
const GOLD = "#b8974a";
const GOLD_HI = "#b8974a";  // iterate-1: dropped from cream #d4c49a to canonical gold per WEIRD.BABY-match call
const GOLD_LO = "#b8974a";  // iterate-2: dropped from #a89770 to canonical gold so dim-tier borders / labels match the single-gold tone
const GOLD_MUTE = "#555";
const DIM = "#b8974a";       // iterate-1: dropped from cream #d4c49a to canonical gold per WEIRD.BABY-match call
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
const STORAGE_KEY = "wb-hr-deck-height"; // O7 — matches wb-hr-split / wb-hr-cfh
const HOVER_DELAY_OPEN = 60;
const HOVER_DELAY_CLOSE = 450;

// ─── TABS — six entries; Journal sits last among functional tabs ────────────
// Stage 3 placement: Journal sits AFTER the v28_3 functional tabs in their
// v28_3 order (Artist · Formats · Deep Tracks · Presets), then ✕. This is
// the "default to last" call from the visitor-consequence brief — v28_3
// doesn't include Journal, so there's no more-natural insertion point to
// surface; Journal becomes the right-most non-close tab. Was position 4
// (between Deep Tracks and Presets) in Stage 2; moved to position 5 here.
const TABS = [
  { key: "artist",  label: "Artist",      kind: "tier",    tier: 1, width: 120 },
  { key: "media",   label: "Formats",     kind: "tier",    tier: 2, width: 130 },
  { key: "deep",    label: "Deep Tracks", kind: "tier",    tier: 3, width: 120 },
  { key: "presets", label: "Presets",     kind: "special", special: "presets", width: 110 },
  { key: "journal", label: "Journal",     kind: "special", special: "journal", width: 110 },
];

// ─── FACTORY PRESETS — adapted to HR's dimensions ───────────────────────────
const FACTORY_PRESETS = [
  {
    key: "surprise", label: "Surprise me", desc: "a handful at random",
    apply: () => {
      const ids = ARTIFACTS.map(c => c.id).sort(() => Math.random() - 0.5).slice(0, 3);
      return { __randomIds: new Set(ids) };
    },
  },
  {
    key: "press", label: "Press clippings", desc: "what the world said",
    apply: () => ({ src: new Set(["press"]) }),
  },
  {
    key: "stage", label: "Live captures", desc: "captured on stage",
    apply: () => ({ src: new Set(["stage"]) }),
  },
  {
    key: "deephist", label: "Years past", desc: "the older catalog",
    apply: () => ({ era: new Set(["seeds", "medusas"]) }),
  },
  {
    key: "videos", label: "Video evidence", desc: "music videos & clips",
    apply: () => ({ type: new Set(["video"]) }),
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
// builders that take props (active state, widths, open state, deckPx, etc.)
// stay here as inline JS objects.
const S = {
  // panelPos: positions the artifact-grid pane above the deck. deckPx changes
  // as the deck peeks / opens / resizes.
  panelPos: (deckPx) => ({
    position: "absolute", left: 0, right: 0, top: 0, bottom: deckPx + "px",
  }),

  // deck: bottom-anchored. height swings between TAB_PEEK / TAB_STRIP_H /
  // resizable open height.
  deck: (deckPx) => ({
    /* `position: fixed` so the deck pins to the viewport bottom
       regardless of the section's scroll-snap-align: center. With
       `absolute` it followed the section, which is centered in the
       viewport with a 32px gap above and below — that gap pushed the
       tabs 32px above viewport bottom. */
    position: "fixed", left: 0, right: 0,
    height: deckPx + "px",
    background: "transparent",
    zIndex: 10,
    pointerEvents: "none",
    /* `bottom` is set by .hr-deck in HrExhibitFlow.css so it can be
       conditional on whether the player bar is in the DOM (60 when
       playing, 0 when not).
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
      fontWeight: active ? 800 : 500,
      color: textColor,
      background: active ? INK_SOFT : INK,
      border: `1px solid ${borderColor}`, borderBottom: "none",
      borderTopLeftRadius: "6px", borderTopRightRadius: "6px",
      height: TAB_STRIP_H + "px",
      width: width + "px", minWidth: width + "px",
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: "6px",
      transition: "border-color 0.12s, color 0.12s, font-weight 0.12s, background 0.12s",
      padding: "0 6px", boxSizing: "border-box",
      flexShrink: 0, marginRight: "2px",
      whiteSpace: "nowrap", overflow: "visible", textOverflow: "ellipsis",
    };
  },

  // resizeHandle: ns-resize affordance at top of deckBody.
  resizeHandle: (hovered) => ({
    position: "absolute", top: "-4px",
    left: 0, right: 0, height: "8px",
    cursor: "ns-resize", zIndex: 14,
    background: hovered
      ? `linear-gradient(to bottom, transparent 0%, ${GOLD_LO} 45%, ${GOLD_LO} 55%, transparent 100%)`
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
    color: active ? GOLD_HI : (zero ? BORDER_HI : (noneSelected ? GOLD_HI : "#6a5520")),
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
    color: active ? GOLD_HI : (zero ? BORDER_HI : (noneSelected ? GOLD_HI : "#6a5520")),
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

// O8 — preset snapshot: capture playingTrack + spinePosition for display
// only. APPLY does not restore player state in v1; it restores selected /
// shuffle / loop only. Deferred to a follow-up phase.
function makePresetSnapshot({ selected, shuffle, loop, playingTrack, spinePosition }) {
  return {
    selected: cloneSelected(selected),
    shuffle: !!shuffle,
    loop: !!loop,
    playingTrack: playingTrack ? { ...playingTrack } : null,
    spinePosition: spinePosition ?? null,
    savedAt: Date.now(),
  };
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

// Track an element's live content-box width via ResizeObserver. Used by
// FbEmbedCard to drive the --fb-w scale variable for the FB iframe (see the
// FB embed sizing block in HrExhibitFlow.css). Returns [ref, width]; width is
// 0 until the first observation, so callers gate the CSS var on a truthy value
// and the CSS carries a sane default. State is set only from the RO callback,
// never synchronously in the effect body, so it doesn't trip
// react-hooks/set-state-in-effect.
function useElementWidth() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return undefined;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const w = Math.round(e.contentRect.width);
        if (w) setWidth(w);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, width];
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
function fbPluginSrc(plugin, href, showText) {
  return `https://www.facebook.com/plugins/${plugin}?href=${encodeURIComponent(href)}`
    + `&show_text=${showText ? "true" : "false"}&width=500`;
}
function fbEmbedFor(url) {
  if (!url || typeof url !== "string") return null;
  const vMatch = url.match(/[?&]v=(\d+)/) || url.match(/\/videos\/(\d+)/);
  const reelMatch = url.match(/\/reel\/(\d+)/);
  if (vMatch) {
    const href = `https://www.facebook.com/watch/?v=${vMatch[1]}`;
    return { kind: "video", src: fbPluginSrc("video.php", href, false) };
  }
  if (reelMatch) {
    const href = `https://www.facebook.com/reel/${reelMatch[1]}/`;
    return { kind: "reel", src: fbPluginSrc("video.php", href, false) };
  }
  if (/\/posts\//.test(url) || /\/permalink\//.test(url) || /story\.php/.test(url)) {
    return { kind: "post", src: fbPluginSrc("post.php", url, true) };
  }
  return null;
}

function FbEmbedCard({ card }) {
  const embed = fbEmbedFor(card.source_url);
  // --fb-w carries the tile's live width so the CSS can scale FB's fixed
  // 500px-wide plugin canvas to fill the column at any span/viewport (see the
  // FB embed sizing block in HrExhibitFlow.css).
  const [visRef, visW] = useElementWidth();
  return (
    <>
      <div
        className="hr-card-video-vis"
        ref={visRef}
        style={visW ? { "--fb-w": visW } : undefined}
      >
        {embed && (
          <iframe
            className="hr-fbembed-frame"
            src={embed.src}
            title={card.title || "Facebook embed"}
            loading="lazy"
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
        )}
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title hr-card-title-sm">{card.title || "(untitled)"}</div>
        {card.post_date && <div className="hr-card-meta">{card.post_date}</div>}
        <a
          className="hr-card-fb-open"
          href={card.source_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open on Facebook ↗
        </a>
        <ContentKindBadge card={card} />
      </div>
    </>
  );
}

function ArtifactCard({ card, playingAudioId, setPlayingAudioId, onOpenGallery, onOpenAlbum }) {
  const fbEmbed = card.source_platform === "facebook" ? fbEmbedFor(card.source_url) : null;
  const isFbEmbed = !!fbEmbed;
  const isLink = !isFbEmbed && card.media_type === "link" && !!card.source_url;
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
  const { span_w: rolledSpan } = pickSpan(card.id || "", isLink || isPhoto || isGallery || isAlbum || isFbVideo);
  const span_w = isAudio || (isFbEmbed && !isFbVideo) ? 1 : rolledSpan;
  const baseStyle = {
    ...spanStyle(span_w),
    border: `1px solid ${BORDER}`,
    background: INK_CARD,
  };
  const className = ["hr-card", "card-fade-in",
    isFbEmbed ? "hr-card-fbembed" : null,
    isLink ? "hr-card-link" : null,
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
    return (
      <a
        className={className}
        style={baseStyle}
        href={card.primary_url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <PhotoCard card={card} />
      </a>
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
function P3Panel({ matched, totalCount, playingAudioId, setPlayingAudioId, onOpenGallery, onOpenAlbum }) {
  // Phase C: filterKey is intentionally NOT included in audio cards' react
  // keys. The operator-locked rule (2026-05-22) requires that filter
  // changes never touch playback state. Including filterKey here would
  // remount every card on any pill toggle, killing any playing audio.
  // The card.id alone is stable across filter reflows.
  const filterKey = useMemo(() => matched.map(c => c.id).join(","), [matched]);
  return (
    <>
      <div className="hr-page-header">
        <div className="hr-eyebrow">Weird.Baby · Hunter Root · {ARTIFACTS.length} artifacts</div>
        <h1 className="hr-page-title">the artifact deck</h1>
        {/* Stage 3 (v28_3 deck shape, full column complement): page sub
            describes the deck a fan actually walks into — five base tabs
            from v28_3 plus Journal appended as HR's sixth tab. Era pill
            column carries the locked Hunter Root vocabulary in proper
            case. Album and Song pills mirror the spine (un-clickable
            until artifacts get tagged); People / Venue / Format / Media /
            Provenance / Odds render as empty columns until pre-launch
            tagging fills them in. */}
        <p className="hr-page-sub">
          Tabs: Artist · Formats · Deep Tracks · Presets · Journal · ✕.
          Search lives inside Deep Tracks. Shuffle and Loop appear in Presets
          as pill switches alongside the user slots; for now they capture
          state for display only and do not act on the player.
        </p>
      </div>
      <div className="hr-panel-head">
        <span className="hr-panel-head-label">
          artifacts <span className="hr-panel-head-muted"> · the material evidence</span>
        </span>
        <span className="hr-panel-count">
          <span className="hr-panel-count-big">{matched.length}</span>
          <span className="hr-panel-count-total"> of {totalCount}</span>
        </span>
      </div>
      <div className="hr-artifact-grid">
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
// O9: shuffle / loop pills toggle local state but no-op against the player.
// Real player wiring is a follow-up phase. The state still flows into
// preset snapshots so the data shape is forward-compatible.
function PresetsContent({
  userPresets, setUserPresets, selected, setSelected,
  shuffle, setShuffle, loop, setLoop,
  playingTrack, spinePosition,
}) {
  const [lastFactoryApplied, setLastFactoryApplied] = useState(null);

  const applyFactoryPreset = (preset) => {
    const next = preset.apply();
    const cleared = {};
    HR_DIMENSIONS.forEach(({ key }) => { cleared[key] = new Set(); });
    if (next.__randomIds) {
      setSelected({ ...cleared, __randomIds: next.__randomIds });
    } else {
      for (const [k, v] of Object.entries(next)) cleared[k] = v;
      setSelected(cleared);
    }
    setLastFactoryApplied(preset.key);
  };

  const slotIsFilled = (slot) => !!userPresets[slot];
  const saveHere = (slot) => {
    const snap = makePresetSnapshot({ selected, shuffle, loop, playingTrack, spinePosition });
    setUserPresets(prev => ({ ...prev, [slot]: snap }));
  };
  // O8 — APPLY restores selected / shuffle / loop only. Player state
  // (playingTrack, spinePosition) is captured in snapshots for display
  // but not restored; that's a follow-up phase.
  const applySlot = (slot) => {
    const p = userPresets[slot];
    if (!p) return;
    if (p.selected) {
      setSelected(cloneSelected(p.selected));
      setShuffle(!!p.shuffle);
      setLoop(!!p.loop);
    } else {
      setSelected(cloneSelected(p));
    }
  };
  const clearSlot = (slot) => {
    setUserPresets(prev => ({ ...prev, [slot]: null }));
  };

  return (
    <div className="wb-scroll hr-content-body">
      <div className="hr-presets-section-label">presets</div>
      <div className="hr-presets-top-row">
        <div className="hr-presets-slots-col">
          {["P1", "P2", "P3"].map(slot => {
            const has = slotIsFilled(slot);
            const p = userPresets[slot];
            return (
              <div key={slot} style={S.presetSlotRow(has)}>
                <span className="hr-preset-slot-label">{slot}</span>
                <span style={S.presetSummary(!has)} title={has ? presetSummaryText(p) : undefined}>
                  {has ? presetSummaryText(p) : "empty"}
                </span>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(has, true)}
                  onClick={has ? () => applySlot(slot) : undefined}
                  aria-disabled={!has}
                >apply</button>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(has, false)}
                  onClick={has ? () => clearSlot(slot) : undefined}
                  aria-disabled={!has}
                >clear slot</button>
                <button
                  className="preset-row-btn"
                  style={S.presetRowBtn(true, true)}
                  onClick={() => saveHere(slot)}
                  title={has ? "overwrite this slot with current state" : "save current state to this slot"}
                >save here</button>
              </div>
            );
          })}
        </div>
        <div className="hr-presets-player-col">
          <div className="hr-presets-player-label">player</div>
          {/* O9 — shuffle / loop are state-only stubs in v1. They do not
              affect playback. Captured into preset snapshots so the data
              shape is forward-compatible when the real wiring lands. */}
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
            onClick={() => applyFactoryPreset(p)}
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
    fact1: "Opening Crooked Home with a year as a title — that's a statement. You know right away this one is going to cost him something.",
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
  // dependency on `filtered.length` (not `filtered`) is also intentional —
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
            >‹</button>
            <span className="hr-jnl-counter">
              {(feedIdx % feedOrder.length) + 1} / {feedOrder.length}
            </span>
            <button
              className="hr-jnl-btn"
              onClick={() => setFeedIdx(prev => (prev + 1) % feedOrder.length)}
            >›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── AUDIT STRIP — O12: dev-only ────────────────────────────────────────────
function _mkSel(groups) {
  const out = {};
  HR_DIMENSIONS.forEach(({ key }) => { out[key] = new Set(); });
  for (const [k, vs] of Object.entries(groups)) out[k] = new Set(Array.isArray(vs) ? vs : [vs]);
  return out;
}
function _runMatch(sel) { return ARTIFACTS.filter(i => matchFilter(i, sel)).length; }

// Audit assertions are written generically against the v5 tag-shape — they
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
  // 1. all off → full catalog
  const t1 = _runMatch(_mkSel({}));
  tests.push({ id: 1, name: "all off → full catalog", expected: N, actual: t1, pass: t1 === N });
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
        hr audit · {allPass ? "ALL PASS" : "FAIL"} · {tests.filter(t => t.pass).length}/{tests.length} · catalog={catalogSize} {open ? "▾" : "▸"}
      </div>
      {open && (
        <div style={{ marginTop: "6px", fontSize: "10.5px", lineHeight: 1.5 }}>
          {tests.map(t => (
            <div key={t.id} style={{ color: t.pass ? "#cde1bd" : "#f3c2c2" }}>
              {t.pass ? "✓" : "✗"} #{t.id} {t.name}
              <span style={{ opacity: 0.75, marginLeft: "6px" }}>exp={t.expected} got={t.actual}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── ROOT — HrExhibitFlow component, exported for Exhibit.jsx line 908 ──────
export default function HrExhibitFlow({ activeAlbumId }) {
  // activeAlbumId is accepted for prop compatibility with Exhibit.jsx but
  // is not consumed by the deck in v1. Future tabs / filters may key off
  // it (e.g., to seed era from album).
  void activeAlbumId;
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
  // grid reflows. Closed via ✕ / backdrop / Escape (see GalleryOverlay).
  const [openGallery, setOpenGallery] = useState(null);
  // RWTH parity: album overlay. Holds the open album container card (or null),
  // lifted to the root so the modal layers above the deck and survives reflows.
  const [openAlbum, setOpenAlbum] = useState(null);
  // MOTHBALLED for v1 per STATE.md; do not render. Revives post-launch.
  // setKalState is wired into clear() so the dormant state stays in sync;
  // kalState is intentionally not read in v1.
  const [_kalState, setKalState] = useState(KAL_STATE_DEFAULT);
  const [shuffle, setShuffle] = useState(false);
  const [loop, setLoop] = useState(false);
  // O8 — captured for snapshot display only; not currently sourced.
  const [playingTrack] = useState(null);
  const [spinePosition] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [hoverPeek, setHoverPeek] = useState(false);
  const [deckHeight, setDeckHeight] = useState(() => {
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
  const [userPresets, setUserPresets] = useState({ P1: null, P2: null, P3: null });
  const [searchFocusSignal, setSearchFocusSignal] = useState(0);
  // Per UX_CONTROLS_SPEC v0.4 §5.5: auto-focus the Deep Tracks search input on
  // first open of the tab per session only. Subsequent opens do not steal focus.
  const searchAutoFocusedRef = useRef(false);
  const hoverTimerRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY, String(deckHeight));
      }
    } catch { /* ignore */ }
  }, [deckHeight]);

  // Tag filters narrow the catalog. Kaleidoscope recipe is dormant in v1.
  const tagFiltered = useMemo(
    () => ARTIFACTS.filter(c => matchFilter(c, selected)),
    [selected]
  );
  const finalMatched = tagFiltered;

  const toggle = (group, tag) => {
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
    setSelected(makeEntrySelection());
    setKalState(KAL_STATE_DEFAULT);
    setShuffle(false);
    setLoop(false);
    setQuery("");
  };

  // Per-tab clear: scope the reset to just the dimensions/state that the
  // given tab owns. Tier tabs (artist/media/deep) clear their tier's
  // dimension keys; deep also clears the search query. Presets clears
  // shuffle/loop. Journal has nothing to clear.
  const clearTab = (tabKey) => {
    const tab = TABS.find(t => t.key === tabKey);
    if (!tab) return;
    if (tab.kind === "tier") {
      setSelected(prev => {
        const next = {};
        for (const d of HR_DIMENSIONS) next[d.key] = new Set(prev[d.key] ?? []);
        for (const d of HR_DIMENSIONS) if (d.tier === tab.tier) next[d.key] = new Set();
        return next;
      });
      if (tab.key === "deep") setQuery("");
    } else if (tab.special === "presets") {
      setShuffle(false);
      setLoop(false);
    }
  };

  // Does this tab have anything to clear right now?
  const tabHasSelection = (tab) => {
    if (tab.kind === "tier") {
      const dimsInTab = HR_DIMENSIONS.filter(d => d.tier === tab.tier);
      const anyDim = dimsInTab.some(d => (selected[d.key] instanceof Set) && selected[d.key].size > 0);
      if (tab.key === "deep") return anyDim || query.length > 0;
      return anyDim;
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
      const vh = window.innerHeight;
      setDeckHeight(prev => Math.max(DECK_MIN_H, Math.min(prev, vh * DECK_MAX_FRAC)));
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
  let deckPx;
  if (open) deckPx = deckHeight;
  else if (hoverPeek) deckPx = TAB_STRIP_H;
  else deckPx = TAB_PEEK;

  const handleTabClick = (tabKey) => {
    if (tabKey === "close") { setActiveTab(null); setHoverPeek(false); return; }
    if (activeTab === tabKey) { setActiveTab(null); setHoverPeek(false); return; }
    setActiveTab(tabKey);
    setHoverPeek(false);
    if (tabKey === "deep" && !searchAutoFocusedRef.current) {
      setSearchFocusSignal(s => s + 1);
      searchAutoFocusedRef.current = true;
    }
  };

  const startResize = useCallback((e) => {
    e.preventDefault(); e.stopPropagation();
    setResizing(true);
    const startY = e.clientY, startH = deckHeight, vh = window.innerHeight;
    const onMove = (me) => {
      const dy = me.clientY - startY;
      let next = startH - dy;
      next = Math.max(DECK_MIN_H, Math.min(next, vh * DECK_MAX_FRAC));
      setDeckHeight(next);
    };
    const onUp = () => {
      setResizing(false);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [deckHeight]);

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
      {/* MOBILE FALLBACK — pill columns render inline above the grid on
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

      {/* DECK HOST — sized so the deck can sit at its bottom via sticky
          positioning. The grid scrolls inside hr-section-deck-host. */}
      <div className="hr-section-deck-host">
        <div className={"animated " + (resizing ? "resizing " : (!open && hoverPeek ? "quick " : ""))}
             style={{ ...S.panelPos(deckPx), position: "absolute" }}
             onClick={panelClickHandler}>
          <div className="wb-scroll hr-panel-scroll">
            <P3Panel
              matched={finalMatched}
              totalCount={ARTIFACTS.length}
              playingAudioId={playingAudioId}
              setPlayingAudioId={setPlayingAudioId}
              onOpenGallery={setOpenGallery}
              onOpenAlbum={setOpenAlbum}
            />
          </div>
        </div>

        <div className={"hr-deck " + animClass} style={S.deck(deckPx)} onClick={(e) => e.stopPropagation()}>
          <div
            className="hr-tab-strip"
            onMouseEnter={() => { if (!open) { cancelHoverTimer(); scheduleHoverOpen(); } }}
            onMouseLeave={() => { if (!open) scheduleHoverClose(); }}
          >
            {TABS.map(t => {
              const isActive = activeTab === t.key;
              const isClose = t.kind === "close";
              return (
                <div
                  key={t.key}
                  className={isActive ? "" : "tab-hoverable"}
                  style={S.tab(isActive, open, t.width, isClose)}
                  onClick={(e) => { e.stopPropagation(); handleTabClick(t.key); }}
                  role="button"
                  title={t.label}
                >
                  <span>{t.label}</span>
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
                      >✕</span>
                    );
                  })()}
                  {isActive && open && (
                    <span aria-hidden style={{
                      position: "absolute", left: -1, right: -1, bottom: -1,
                      height: 1, background: INK_SOFT, pointerEvents: "none",
                    }} />
                  )}
                </div>
              );
            })}
          </div>

          {open && currentTab && (
            <div className="hr-deck-body">
              <div
                style={S.resizeHandle(resizeHover || resizing)}
                onMouseDown={startResize}
                onMouseEnter={() => setResizeHover(true)}
                onMouseLeave={() => setResizeHover(false)}
              />
              {currentTab.kind === "tier" && (() => {
                const dims = HR_DIMENSIONS.filter(d => d.tier === currentTab.tier);
                if (currentTab.key === "deep") {
                  return (
                    <DeepTracksContent
                      dims={dims} selected={selected} toggle={toggle}
                      query={query} setQuery={setQuery}
                      focusSignal={searchFocusSignal}
                    />
                  );
                }
                return (
                  <TierContent
                    dims={dims} selected={selected} toggle={toggle}
                  />
                );
              })()}
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
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* O12 — AuditStrip removed: was a dev-only fixed-bottom-right pill at
          z-index 9999 that occluded the player bar's right-side controls.
          The AuditStrip function is kept above for easy revival. */}
    </section>
  );
}
