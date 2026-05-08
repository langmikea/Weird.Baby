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
import { HR_DIMENSIONS, HR_GROUP_LABELS, displayFor } from "./hr_dimensions.js";
import { HR_CARDS } from "./hr_cards.js";
import { HR_JOURNAL_PROMPTS } from "../../data/hr_journal_prompts.js";

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
const TAB_PEEK = 14;
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
      const ids = HR_CARDS.map(c => c.id).sort(() => Math.random() - 0.5).slice(0, 3);
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

  // tab: per-tab chrome. Active = bright + bold + INK_SOFT fill. Inactive =
  // GOLD_LO border + DIM text. isClose = small ✕ tab.
  tab: (active, deckOpen, width, isClose) => {
    const borderColor = active ? GOLD_HI : GOLD_LO;
    const textColor   = active ? GOLD_HI : DIM;
    return {
      cursor: "pointer", fontFamily: sansBody,
      fontSize: isClose ? "14px" : "10.5px",
      letterSpacing: isClose ? "0" : "0.12em",
      textTransform: isClose ? "none" : "uppercase",
      fontWeight: active ? 700 : 500,
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
      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
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

  // pill: per-pill chrome inside group columns. active / zero / pillWidth.
  pill: (active, zero, pillWidth) => ({
    fontFamily: sansBody, fontSize: "11.5px", fontWeight: 500,
    letterSpacing: "0.02em", padding: "0 10px",
    height: "26px", lineHeight: "24px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    gap: "8px",
    width: pillWidth ? `${pillWidth}px` : "auto",
    minWidth: pillWidth ? `${pillWidth}px` : "auto",
    boxSizing: "border-box", borderRadius: 0,
    border: `1px solid ${active ? GOLD : (zero ? "transparent" : BORDER)}`,
    background: active ? INK_SOFT : "transparent",
    color: active ? GOLD_HI : (zero ? BORDER_HI : DIM),
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

  pillCount: (active, zero) => ({
    fontSize: "10px", fontWeight: 500,
    color: active ? GOLD : (zero ? GOLD_MUTE : GOLD_LO),
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
const spanStyle = (w, h) => {
  const hMap = { sm: 22, md: 30, lg: 38, xl: 44 };
  return { gridColumn: `span ${w}`, gridRow: `span ${hMap[h] || 30}` };
};

// ─── FILTER LOGIC — ported from v28 prototype ───────────────────────────────
// LOCKED rule (docs/FILTER_LOGIC_DECISION.md): within-group OR, across-group
// AND, empty-group-silent. Adapted to operate on HR_DIMENSIONS.
function itemHasTag(item, group, tag) {
  if (group === "year") return String(item.year) === tag;
  const dim = HR_DIMENSIONS.find(d => d.key === group);
  if (dim?.kind === "multi") return Array.isArray(item[group]) && item[group].includes(tag);
  return item[group] === tag;
}

function matchFilter(item, selected) {
  if (selected.__randomIds) return selected.__randomIds.has(item.id);
  for (const { key, kind } of HR_DIMENSIONS) {
    const sel = selected[key];
    if (!sel || sel.size === 0) continue;
    let carries = false;
    if (key === "year") {
      carries = sel.has(String(item.year));
    } else if (kind === "multi") {
      carries = Array.isArray(item[key]) && item[key].some(v => sel.has(v));
    } else {
      carries = item[key] != null && sel.has(item[key]);
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
    const maxCount = HR_CARDS.length;
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
function PillButton({ label, count, active, zero, pillWidth, onClick }) {
  return (
    <button
      style={S.pill(active, zero, pillWidth)}
      onClick={() => !zero && onClick()}
      disabled={zero}
      aria-pressed={active}
      title={label}
    >
      <span className="hr-pill-label">{label}</span>
      <span style={S.pillCount(active, zero)}>{count}</span>
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

// ─── CARD COMPONENTS — ported from v28, classes wired through CSS ───────────
function PhotoCard({ card }) {
  return (
    <>
      <div className="hr-card-photo-vis">
        <div className="hr-card-photo-frame" />
        <span className="hr-card-photo-label">photo</span>
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title}</div>
        <div className="hr-card-meta">{card.meta}</div>
        {card.credit && <div className="hr-card-credit">— {card.credit}</div>}
      </div>
    </>
  );
}

function ArtCard({ card }) {
  return (
    <>
      <div className="hr-card-art-vis">
        <div className="hr-card-art-circle" />
      </div>
      <div className="hr-card-foot hr-card-foot-dashed">
        <div className="hr-card-title">{card.title}</div>
        {card.credit && <div className="hr-card-credit">— <strong>{card.credit}</strong></div>}
        {card.meta && <div className="hr-card-meta">{card.meta}</div>}
      </div>
    </>
  );
}

function VideoCard({ card }) {
  return (
    <>
      <div className="hr-card-video-vis">
        {card.isLive && <div className="hr-card-video-live">live</div>}
        <div className="hr-card-video-play">
          <div className="hr-card-video-play-tri" />
        </div>
        {card.duration && <div className="hr-card-video-dur">{card.duration}</div>}
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title}</div>
        {card.meta && <div className="hr-card-meta">{card.meta}</div>}
        {card.isCover && card.credit && <div className="hr-card-credit">— {card.credit}</div>}
      </div>
    </>
  );
}

function PressCard({ card }) {
  return (
    <div className="hr-card-press">
      <div className="hr-card-press-source">{card.source}</div>
      <div className="hr-card-press-pull">
        <span className="hr-card-press-quote">“ </span>
        {card.pull}
        <span className="hr-card-press-quote"> ”</span>
      </div>
      <div className="hr-card-press-sub">{card.sub}</div>
    </div>
  );
}

function EssayCard({ card }) {
  return (
    <div className="hr-card-essay">
      <div className="hr-card-essay-kind">{card.kind}</div>
      <div className="hr-card-essay-title">{card.title}</div>
      <div className="hr-card-essay-lede">{card.lede}</div>
      {card.credit && <div className="hr-card-credit">— {card.credit}</div>}
    </div>
  );
}

function SessionCard({ card }) {
  return (
    <>
      <div className="hr-card-session-vis">
        <div className="hr-card-session-rect" />
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title hr-card-title-sm">{card.title}</div>
        <div className="hr-card-meta">{card.meta}</div>
      </div>
    </>
  );
}

function ArtifactCard({ card }) {
  const isPress = card.render === "press";
  const isEssay = card.render === "essay";
  // Phase 1.5c: voice cards (HR_EXIT_FLOW) get a distinct visual treatment;
  // cards with an externalUrl become clickable and open in a new tab.
  const isVoice = card.contentClass === "voice";
  const isLink = !!card.externalUrl;
  const baseStyle = {
    ...spanStyle(card.span_w, card.span_h),
    ...(isPress ? { borderLeft: `2px solid ${GOLD_LO}`, background: "transparent" } : {}),
    ...(isEssay ? { background: INK_CARD_HI } : {}),
    border: isPress ? undefined : `1px solid ${BORDER}`,
    background: isPress ? "transparent" : (isEssay ? INK_CARD_HI : INK_CARD),
  };
  const className = [
    "hr-card",
    "card-fade-in",
    isVoice ? "hr-card-voice" : null,
    isLink ? "hr-card-link" : null,
  ].filter(Boolean).join(" ");
  let inner;
  switch (card.render) {
    case "photo": inner = <PhotoCard card={card} />; break;
    case "art": inner = <ArtCard card={card} />; break;
    case "video": inner = <VideoCard card={card} />; break;
    case "press": inner = <PressCard card={card} />; break;
    case "essay": inner = <EssayCard card={card} />; break;
    case "session": inner = <SessionCard card={card} />; break;
    default: inner = null;
  }
  const badge = isVoice
    ? <span className="hr-card-voice-badge">curator&rsquo;s note</span>
    : null;
  const chevron = isLink
    ? <span className="hr-card-link-arrow" aria-hidden="true">↗</span>
    : null;
  if (isLink) {
    return (
      <a
        className={className}
        style={baseStyle}
        href={card.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {inner}
        {badge}
        {chevron}
      </a>
    );
  }
  return (
    <div className={className} style={baseStyle}>
      {inner}
      {badge}
    </div>
  );
}

// ─── PAGE / GRID — ported from v28 ──────────────────────────────────────────
function P3Panel({ matched, totalCount }) {
  const filterKey = useMemo(() => matched.map(c => c.id).join(","), [matched]);
  return (
    <>
      <div className="hr-page-header">
        <div className="hr-eyebrow">Weird.Baby · Hunter Root · {HR_CARDS.length} artifacts</div>
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
        {matched.map(card => <ArtifactCard key={`${filterKey}-${card.id}`} card={card} />)}
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
            items={HR_CARDS} selected={selected} toggle={toggle}
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
                const count = countForPill(HR_CARDS, selected, group, tag);
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
                items={HR_CARDS} selected={selected} toggle={toggle}
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
function _runMatch(sel) { return HR_CARDS.filter(i => matchFilter(i, sel)).length; }

function buildAuditResults() {
  const N = HR_CARDS.length;
  const tests = [];
  // 1. all off → full catalog
  const t1 = _runMatch(_mkSel({}));
  tests.push({ id: 1, name: "all off → full catalog", expected: N, actual: t1, pass: t1 === N });
  // 2. era: solo alone → carries solo
  const expected2 = HR_CARDS.filter(i => i.era === "solo").length;
  const t2 = _runMatch(_mkSel({ era: "solo" }));
  tests.push({ id: 2, name: "era: solo alone", expected: expected2, actual: t2, pass: t2 === expected2 });
  // 3. era within-group OR (medusas + solo)
  const expected3 = HR_CARDS.filter(i => i.era === "medusas" || i.era === "solo").length;
  const t3 = _runMatch(_mkSel({ era: ["medusas", "solo"] }));
  tests.push({ id: 3, name: "era: medusas OR solo", expected: expected3, actual: t3, pass: t3 === expected3 });
  // 4. across-group AND (era=medusas AND src=archive)
  const expected4 = HR_CARDS.filter(i => i.era === "medusas" && i.src === "archive").length;
  const t4 = _runMatch(_mkSel({ era: "medusas", src: "archive" }));
  tests.push({ id: 4, name: "era=medusas AND src=archive", expected: expected4, actual: t4, pass: t4 === expected4 });
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
    () => HR_CARDS.filter(c => matchFilter(c, selected)),
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

  const clear = () => {
    setSelected(makeEntrySelection());
    setKalState(KAL_STATE_DEFAULT);
    setShuffle(false);
    setLoop(false);
    setQuery("");
  };

  const anyTagSelected = selected.__randomIds
    || Object.values(selected).some(s => s instanceof Set && s.size > 0);
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
    if (tabKey === "deep") setSearchFocusSignal(s => s + 1);
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
      {/* MOBILE FALLBACK — pill columns render inline above the grid on
          narrow viewports. CSS hides this on desktop and hides the deck
          on mobile. */}
      <div className="hr-mobile-pills">
        {HR_DIMENSIONS.map(dim => (
          <PillGroupColumn
            key={dim.key} group={dim.key} values={dim.values}
            items={HR_CARDS} selected={selected} toggle={toggle}
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
            <P3Panel matched={finalMatched} totalCount={HR_CARDS.length} />
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
                </div>
              );
            })}
            {anySelected && (open || hoverPeek) && (
              <button
                className="hr-strip-clear-btn"
                onClick={(e) => { e.stopPropagation(); clear(); }}
                title="clear all tags, shuffle, and loop"
              >clear all</button>
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
