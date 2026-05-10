// ─── HR_CARDS — the artifact grid input for the HR deck ─────────────────────
// Phase 1.5b. Adapts HR's existing data shapes to the prototype's card shape.
//
// SCOPE NOTE (deviation from a strict reading of Step 2):
//   The merge brief says "HR's artifacts live in hr_artifacts.js." A strict
//   reading would feed only HR_ARTIFACTS (10 items) into the grid. With the
//   <3-distinct-values rule that limits the deck to two filter dimensions
//   and a near-empty grid. This module instead pulls from all three HR
//   "card-like" data files (HR_ARTIFACTS + HR_ARCHIVE + HR_EXIT_FLOW)
//   so the grid and the filters have something to work with. See
//   PHASE_1_5B_REPORT.md, "Open issues" for the deviation note. If Mike
//   wants strict-only, narrow `HR_CARDS` to `HR_ARTIFACTS.map(...)`.
//
// CARD SHAPE EXPECTED BY THE PROTOTYPE'S CARDS:
//   id          — unique
//   render      — "photo" | "art" | "video" | "press" | "essay" | "session"
//   title       — string
//   meta        — string | null
//   credit      — string | null
//   source      — string | null  (PressCard only)
//   pull        — string | null  (PressCard only — the quote)
//   sub         — string | null  (PressCard only — under-quote line)
//   kind        — string | null  (EssayCard only — "essay · fan analysis" etc.)
//   lede        — string | null  (EssayCard only)
//   span_w, span_h — grid spans
//
// Plus the kept HR_DIMENSIONS fields used by matchFilter:
//   era, year (string), type, src
//
// Phase 1.5c additions:
//   contentClass — "evidence" | "voice"
//                  Drives visual differentiation in the grid. "evidence" is
//                  things that exist in the world (artifacts + archive items);
//                  "voice" is curatorial commentary (HR_EXIT_FLOW).
//   externalUrl  — string | null
//                  If present and non-null the card becomes clickable and
//                  opens the URL in a new tab. Sourced from `postUrl` on
//                  HR_ARCHIVE entries. Phase 1.5d: also falls back to a
//                  constructed `https://www.youtube.com/watch?v=${ytId}`
//                  URL when `ytId` is present on HR_ARTIFACTS / HR_ARCHIVE
//                  entries and no other URL field is set. HR_EXIT_FLOW
//                  entries remain null by design (voice cards, non-clickable).
// ─────────────────────────────────────────────────────────────────────────────

import { HR_ARTIFACTS } from "../../data/hr_artifacts.js";
import { HR_ARCHIVE } from "../../data/hr_archive.js";
import { HR_EXIT_FLOW } from "../../data/hr_exit_flow.js";

// ─── DEEP DIVE — per-card tag attachment ───────────────────────────────────
// Phase 1 wiring per docs/deep-dive-review/SPEC_DRAFT_v3.md §3.5.
// DEEP_VOCAB is the prebuild artifact (groupOrder drives which fields we
// attach to every card). DEEP_TAGS holds per-card tag arrays, keyed by
// the explicit card.id established by the c14267e migration. Phase 1
// ships DEEP_TAGS.cards = {} — the export CLI in Phase 3 populates it
// from MediaVault. Cards with no entry get empty arrays for every group,
// which the deck's existing multi-column filter treats as "no tags here"
// (a non-match for any selected pill in that column).
import DEEP_VOCAB from "../../data/deep-dive-vocabulary.json";
import DEEP_TAGS from "../../data/deep-tags.json";

const VOCAB_GROUPS = DEEP_VOCAB.groupOrder;

function attachDeepTags(base) {
  const deepEntry = (DEEP_TAGS.cards && DEEP_TAGS.cards[base.id]) || {};
  for (const group of VOCAB_GROUPS) {
    base[group] = deepEntry[group] || [];
  }
  return base;
}

// ─── span helpers ───────────────────────────────────────────────────────────
// HR data has no span hints. Pick a stable default that mirrors the
// prototype's "mostly small, occasional larger" feel. Deterministic so
// the grid layout doesn't reflow between renders.
function pickSpan(seedStr) {
  let h = 2166136261;
  for (let i = 0; i < seedStr.length; i++) {
    h ^= seedStr.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const r = ((h >>> 0) % 1000) / 1000;
  // 70% sm, 25% md, 5% lg — fewer big cards than the prototype since HR's
  // catalog is smaller and large cards eat real estate fast.
  const span_w = r < 0.8 ? 1 : 2;
  const span_h = r < 0.7 ? "sm" : r < 0.95 ? "md" : "lg";
  return { span_w, span_h };
}

function yearOf(date) {
  return typeof date === "string" ? date.slice(0, 4) : "";
}

// ─── HR_ARTIFACTS adapter (named in the brief) ──────────────────────────────
// Type → render mapping, per brief's "reasonable mapping":
//   poster → ArtCard
//   setlist → EssayCard
//   photo → PhotoCard
//   fan-art → ArtCard
//   handwritten → EssayCard
//   video → VideoCard
//   ticket → PressCard
const ARTIFACT_TYPE_TO_RENDER = {
  poster: "art",
  setlist: "essay",
  photo: "photo",
  "fan-art": "art",
  handwritten: "essay",
  video: "video",
  ticket: "press",
};

export function hrArtifactToCardShape(artifact) {
  const id = artifact.id;
  const render = ARTIFACT_TYPE_TO_RENDER[artifact.type] || "session";
  const year = yearOf(artifact.date);
  const span = pickSpan(id);

  // Phase 1.5c: HR_ARTIFACTS entries carry no direct URL fields
  // (`postUrl` / `url` / `link` / `href` are absent on every entry).
  // Phase 1.5d: when `ytId` is present, resolve it to the canonical
  // YouTube watch URL — reconstructing a URL from a stored video ID is
  // standard resolution, not URL invention.
  const externalUrl =
    artifact.postUrl || artifact.url || artifact.link || artifact.href ||
    (artifact.ytId ? `https://www.youtube.com/watch?v=${artifact.ytId}` : null);

  const base = {
    id, render,
    title: artifact.fact1 || "",
    meta: artifact.date,
    credit: artifact.credit || null,
    source: null, pull: null, sub: null, kind: null, lede: null,
    era: artifact.era,
    year,
    type: artifact.type,
    src: artifact.src,
    contentClass: "evidence",
    externalUrl,
    ...span,
  };
  attachDeepTags(base);

  // PressCard expects source / pull / sub. EssayCard expects kind / lede / title.
  if (render === "press") {
    return {
      ...base,
      source: `${artifact.src || "archive"} · ${year}`,
      pull: artifact.fact2 || artifact.fact1 || "",
      sub: artifact.fact1 ? `on ${(artifact.fact1.split("—")[0] || "").trim() || artifact.type}` : null,
      title: artifact.fact1 || "",
    };
  }
  if (render === "essay") {
    return {
      ...base,
      kind: `${artifact.type} · ${artifact.era}`,
      title: artifact.fact1 || "",
      lede: artifact.fact2 || "",
    };
  }
  return base;
}

// ─── HR_ARCHIVE adapter (broadening to fill the grid) ───────────────────────
// HR_ARCHIVE types:
//   historical → PhotoCard (timeline / documentary feel)
//   interview  → PressCard (quoted journalism)
//   rarity     → SessionCard (uncommon catalog items)
const ARCHIVE_TYPE_TO_RENDER = {
  historical: "photo",
  interview: "press",
  rarity: "session",
};

export function hrArchiveItemToCardShape(item) {
  const id = item.id;
  const render = ARCHIVE_TYPE_TO_RENDER[item.type] || "session";
  const year = yearOf(item.date);
  const span = pickSpan(id);

  // Phase 1.5c: HR_ARCHIVE entries may carry `postUrl` (a few do today).
  // No other URL-shaped fields are present.
  // Phase 1.5d: when `ytId` is present, resolve it to the canonical
  // YouTube watch URL — reconstructing a URL from a stored video ID is
  // standard resolution, not URL invention.
  const externalUrl =
    item.postUrl || item.url || item.link || item.href ||
    (item.ytId ? `https://www.youtube.com/watch?v=${item.ytId}` : null);

  const base = {
    id, render,
    title: item.fact1 || "",
    meta: item.date,
    credit: item.credit || null,
    source: null, pull: null, sub: null, kind: null, lede: null,
    era: item.era,
    year,
    type: item.type,
    src: item.src,
    contentClass: "evidence",
    externalUrl,
    ...span,
  };
  attachDeepTags(base);

  if (render === "press") {
    return {
      ...base,
      source: `${item.src || "press"} · ${year}`,
      pull: item.fact2 || item.fact1 || "",
      sub: item.fact1 ? `on ${(item.fact1.split("—")[0] || "").trim() || item.type}` : null,
    };
  }
  return base;
}

// ─── HR_EXIT_FLOW adapter (broadening to fill the grid) ─────────────────────
// HR_EXIT_FLOW types:
//   quick     → ArtCard (small visual, punchy)
//   deep      → EssayCard (long form curatorial reads)
//   highlight → SessionCard (curatorial highlight cards)
const EXIT_TYPE_TO_RENDER = {
  quick: "art",
  deep: "essay",
  highlight: "session",
};

export function hrExitFlowItemToCardShape(item) {
  const id = item.id;
  const render = EXIT_TYPE_TO_RENDER[item.type] || "session";
  const year = yearOf(item.date);
  const span = pickSpan(id);

  const base = {
    id, render,
    title: item.fact1 || "",
    meta: item.date,
    credit: null,
    source: null, pull: null, sub: null, kind: null, lede: null,
    era: item.era,
    year,
    type: item.type,
    src: item.src,
    // Phase 1.5c: exit-flow entries are curatorial commentary ("voice"),
    // not artifacts pointing outside the museum. They have no URLs by
    // design.
    contentClass: "voice",
    externalUrl: null,
    ...span,
  };
  attachDeepTags(base);

  if (render === "essay") {
    return {
      ...base,
      kind: `${item.type} · ${item.era}`,
      title: item.fact1 || "",
      lede: item.fact2 || "",
    };
  }
  return base;
}

// ─── HR_CARDS — the input to the deck's filter logic ────────────────────────
export const HR_CARDS = [
  ...HR_ARTIFACTS.map(hrArtifactToCardShape),
  ...HR_ARCHIVE.map(hrArchiveItemToCardShape),
  ...HR_EXIT_FLOW.map(hrExitFlowItemToCardShape),
];
