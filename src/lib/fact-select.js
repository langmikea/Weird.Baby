// ─── fact-select.js — shared fact selector (FACTSCROLLER_REPLUMB-20260707) ────
//
// One selector, two consumers (FACTSCROLLER_SPEC_v1.0 §"The Look & Feel"):
//   1. The player scroller — recipe = the now-playing TRACK, with the climb
//      (song → album → era → artist), so the fountain never dries.
//   2. Living recipe cards — recipe = an explicit { all, any, not } tag query
//      stored in the artifact's notes and baked into the export.
//
// Facts are the vaulted-then-released `fact` artifacts, shape (from the export's
// <exhibit>.facts.json):
//   { id, lines:[string, string], tags:{ namespace: [values] } }
//
// Weight = SELECTION FREQUENCY (spec ruling 5; the PUV pilot's deferred weight
// signal, closed here with NO schema): a per-session shown-count per fact id.
// Within the reachable pool the least-shown facts float to the top, so the
// scroller spreads across the vault instead of looping tightly. Counts persist
// for the life of the cycler (the whole session), so rarely-seen facts keep
// priority even after the pool recycles. There is no stored weight field.
//
// PURE + framework-free on purpose: unit-testable in plain node, no React.
// The render path (JSX/CSS/timing/nav in Exhibit.jsx) is UNTOUCHED — this
// module only decides WHICH fact is next.

// ─── quote / breadcrumb split (display model, 2026-07-07 eyeball) ──────────────
// Mike's ruling at the Stage 3 eyeball: the QUOTE/FACT goes in the big box, the
// BREADCRUMB (source credit) in the small box — "what it needs, not more."
// 64 of 97 facts were authored with the credit as a trailing em-dash line
// ("— Hunter Root, Whiskey Riff, 2023"); the other 33 are two-line derived
// facts with no credit line. splitFact separates them for display:
//   { quote: [line, ...], breadcrumb: "— …" | null }
// The last line is the breadcrumb ONLY when it opens with an em/en/hyphen dash
// AND there is at least one quote line above it. Everything is preserved
// verbatim (Mike's wording is gated) — this only decides which box each line
// lands in. No data/export change.
const ATTR_LINE_RE = /^\s*[—–-]\s+/;
export function splitFact(fact) {
  const lines = Array.isArray(fact && fact.lines)
    ? fact.lines.filter(x => typeof x === "string")
    : [];
  const last = lines.length ? lines[lines.length - 1] : "";
  if (lines.length >= 2 && ATTR_LINE_RE.test(last)) {
    return { quote: lines.slice(0, -1), breadcrumb: last };
  }
  return { quote: lines, breadcrumb: null };
}

// ─── tag matching ─────────────────────────────────────────────────────────────
// A fact "carries" a tag "ns:value" when tags[ns] includes value. Mirrors the
// exporter's grouped-tag shape exactly (split on the first colon).
export function factHasTag(fact, tag) {
  if (!fact || !fact.tags || typeof tag !== "string") return false;
  const i = tag.indexOf(":");
  if (i <= 0) return false;
  const ns = tag.slice(0, i);
  const value = tag.slice(i + 1);
  if (!value) return false;
  const vals = fact.tags[ns];
  return Array.isArray(vals) && vals.includes(value);
}

// ─── recipe match (living cards) ──────────────────────────────────────────────
// recipe = { all:[tag], any:[tag], not:[tag] } (missing arrays treated empty):
//   all  — the fact must carry EVERY listed tag         (AND)
//   any  — if non-empty, the fact must carry AT LEAST ONE (OR)
//   not  — the fact must carry NONE                     (exclude)
// An empty recipe (no all/any/not) matches nothing — a card with a malformed or
// absent recipe renders empty rather than accidentally scrolling the whole vault.
export function matchRecipe(fact, recipe) {
  if (!recipe || typeof recipe !== "object") return false;
  const all = Array.isArray(recipe.all) ? recipe.all : [];
  const any = Array.isArray(recipe.any) ? recipe.any : [];
  const not = Array.isArray(recipe.not) ? recipe.not : [];
  if (!all.length && !any.length && !not.length) return false;
  if (all.length && !all.every(t => factHasTag(fact, t))) return false;
  if (any.length && !any.some(t => factHasTag(fact, t))) return false;
  if (not.length && not.some(t => factHasTag(fact, t))) return false;
  return true;
}

// ─── climb (player scroller) ──────────────────────────────────────────────────
// The reachability tier of a fact given the now-playing context. Higher = more
// specific = shown first ("first-meet on the track", spec ruling 2). The climb
// is UNSIGNALED: a fact that clears any tier is a candidate; tier only biases
// ordering. Returns -1 when the fact is out of the exhibit entirely.
//
// ctx = {
//   song:      slug | null,       // now-playing track's song slug (T3)
//   album:     slug | null,       // now-playing album's MV tag (T2)
//   eraSlugs:  [slug] | null,     // era slugs aliased to the album (T1)
//   exhibit:   slug,              // exhibit badge — the floor that never dries (T0)
// }
//
// Era note: facts carry LEGACY era slugs (e.g. "rwth", "early_days") — only a
// handful exist today. The caller passes the era slug(s) that alias the current
// album (a tiny static map, since the client derives era from date-buckets, not
// from a fact's era tag). The tier is structural and pays off with volume; with
// three era facts it is nearly vestigial, by design.
export function climbTier(fact, ctx) {
  if (!ctx) return -1;
  if (ctx.song && factHasTag(fact, `song:${ctx.song}`)) return 3;
  if (ctx.album && factHasTag(fact, `album:${ctx.album}`)) return 2;
  if (Array.isArray(ctx.eraSlugs) && ctx.eraSlugs.some(e => factHasTag(fact, `era:${e}`))) return 1;
  if (ctx.exhibit && factHasTag(fact, `exhibit:${ctx.exhibit}`)) return 0;
  return -1;
}

// ─── candidate pools ──────────────────────────────────────────────────────────
export function climbCandidates(facts, ctx) {
  const out = [];
  for (const f of facts) {
    const tier = climbTier(f, ctx);
    if (tier >= 0) out.push({ fact: f, tier });
  }
  return out;
}

export function recipeCandidates(facts, recipe) {
  const out = [];
  for (const f of facts) {
    if (matchRecipe(f, recipe)) out.push({ fact: f, tier: 0 });
  }
  return out;
}

// ─── weighted pick ────────────────────────────────────────────────────────────
// Score = tier*100 − shown*10 + jitter(0..9). The bands never cross:
//   tier gap (100) > max shown penalty influence for one step (10) > jitter (9),
// so tier dominates, then least-shown, then a small random tiebreak. Picks the
// single arg-max — deterministic given `rand`, so tests can inject a fixed RNG.
export function pickWeighted(candidates, shownCounts, rand = Math.random) {
  let best = null;
  let bestScore = -Infinity;
  for (const c of candidates) {
    const shown = shownCounts.get(c.fact.id) || 0;
    const score = c.tier * 100 - shown * 10 + rand() * 9;
    if (score > bestScore) { bestScore = score; best = c; }
  }
  return best ? best.fact : null;
}

// ─── the cycler ───────────────────────────────────────────────────────────────
// Stateful, but the state is just the session-scoped shown-count map plus the
// last id (to avoid a back-to-back repeat when the pool has alternatives).
//
// makeFactCycler({ facts, ctx })      → player scroller (climb; ctx swappable)
// makeFactCycler({ facts, recipe })   → living recipe card (static query)
//
// next() returns the next fact (or null if the pool is empty — caller keeps the
// current fact on screen). setContext() re-points the climb when the track
// changes WITHOUT resetting shown-counts, so weight = frequency across the
// whole session (spec ruling 5).
export function makeFactCycler({ facts, ctx = null, recipe = null, rand = Math.random }) {
  const shownCounts = new Map();
  let lastId = null;
  let currentCtx = ctx;

  function candidates() {
    return recipe ? recipeCandidates(facts, recipe) : climbCandidates(facts, currentCtx);
  }

  function next() {
    let pool = candidates();
    if (!pool.length) return null;
    // Avoid an immediate repeat when there's somewhere else to go.
    if (pool.length > 1 && lastId != null) {
      const filtered = pool.filter(c => c.fact.id !== lastId);
      if (filtered.length) pool = filtered;
    }
    const fact = pickWeighted(pool, shownCounts, rand);
    if (fact) {
      shownCounts.set(fact.id, (shownCounts.get(fact.id) || 0) + 1);
      lastId = fact.id;
    }
    return fact;
  }

  function setContext(nextCtx) { currentCtx = nextCtx; }
  function poolSize() { return candidates().length; }

  return { next, setContext, poolSize, _shownCounts: shownCounts };
}
