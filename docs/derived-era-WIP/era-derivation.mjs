// ─── era-derivation.mjs ─────────────────────────────────────────────────────
// Derived-Era v0.2 · Steps 4 + 5 (export core). Authority:
// docs/derived-era-spec_v0.2.md §3.1, §3.4, §4.1, §5, §6.
//
// Pure, dependency-free helpers the export imports. Two jobs:
//   1. loadEraConfig() — read the broadened reference-date registry.
//   2. deriveDates()   — for ONE leaf row, build the weighted, year-normalized
//                        date-set:  [{ year, weight, role, source }, ...]
//      Each reference gets an INFERRED centrality weight from content signals
//      (§5); curated overrides from the `referenced_dates` column replace the
//      inferred value (§3.4). NO era label is computed here — era is derived
//      client-side at read (§4.2, src/routes/hr/hr_era.js).
//
// CALIBRATION IS LOAD-BEARING (§5). The continuous slider only glides if the
// weights are well-SPREAD across the range. Every knob below is a tunable
// constant — tune CENTRALITY against the live histogram (tools/era-pretest.mjs),
// do not pin to two or three values. The weight is built additively from
// independent content signals (role, headline position, mention frequency,
// subject-vs-aside, own-album subject, text richness, crowding) so distinct
// references land on distinct real-valued weights.
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync } from "node:fs";

// ─── Tunable centrality model (§5) ──────────────────────────────────────────
export const CENTRALITY = {
  publishWeight: 2.0,     // fixed heavy anchor (heaviest possible); role=publish
  refMin: 0.20,           // floor for any surviving reference
  refMax: 1.92,           // ceiling for references (stays below publishWeight)

  // base weight by reference role — albums/songs anchor harder than tour chatter
  roleBase: {
    album_ref:  0.55,
    song_ref:   0.53,
    event_ref:  0.40,
    tour_ref:   0.45,
    person_ref: 0.40,
  },

  headlineBoost: 0.45,    // the reference is named in the title / short desc
  freqStep:      0.15,    // per additional body mention …
  freqCap:       0.45,    // … capped so a spammy word can't dominate
  subjectBonus:  0.22,    // content_kind marks the piece AS the work (not an aside)
  ownAlbumBonus: 0.22,    // a track referencing the album it lives in (subject)
  crowdPenalty:  0.12,    // per extra same-role reference (attention spread thin)
  richStep:      0.20,    // text-richness: a more-documented reference is more
  richCap:       0.90,    // central than a bare stub (log-scaled on body length)
  richDivisor:   40,      // chars per richness unit (inside the log)
};

// content_kind values where the artifact IS the work itself — the reference is
// the subject, not a passing mention. Drives subjectBonus.
const PRIMARY_KINDS = new Set([
  "official", "live", "lyrics", "cover", "music", "performance", "studio", "release",
]);

// ─── Registry loader ────────────────────────────────────────────────────────
export function loadEraConfig(path) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    throw new Error(`era-config: could not read/parse ${path}: ${err.message}`);
  }
  const norm = (obj) => {
    const out = Object.create(null);
    for (const [slug, v] of Object.entries(obj || {})) {
      const year = (v && typeof v === "object") ? v.year : v;
      if (typeof year === "number" && Number.isFinite(year)) out[slug] = year;
    }
    return out;
  };
  return {
    album:  norm(parsed.albums),
    event:  norm(parsed.events),
    song:   norm(parsed.songs),
    tour:   norm(parsed.tours),
    person: norm(parsed.people),
  };
}

// ─── one reference's inferred centrality weight (§5) ────────────────────────
function inferWeight(role, slug, { title, body, primaryKind, ownAlbum, sameRoleCount }) {
  const C = CENTRALITY;
  const firstWord = slug.replace(/_/g, " ").trim().split(/\s+/)[0] || slug;
  const inHeadline = firstWord.length > 1 && title.includes(firstWord);
  let mentions = 0;
  if (firstWord.length > 1) {
    let idx = body.indexOf(firstWord);
    while (idx !== -1) { mentions++; idx = body.indexOf(firstWord, idx + firstWord.length); }
  }
  // text richness: log-scaled on the piece's body length (more documentation
  // about a reference -> more central). Principled spread signal, not a constant.
  const richness = Math.min(C.richCap, C.richStep * Math.log2(1 + body.length / C.richDivisor));

  let w = (C.roleBase[role] ?? 0.45);
  if (inHeadline) w += C.headlineBoost;
  w += Math.min(C.freqCap, C.freqStep * Math.max(0, mentions - (inHeadline ? 1 : 0)));
  if (primaryKind) w += C.subjectBonus;
  if (ownAlbum)    w += C.ownAlbumBonus;
  w += richness;
  w -= C.crowdPenalty * Math.max(0, sameRoleCount - 1);
  return Math.round(Math.max(C.refMin, Math.min(C.refMax, w)) * 100) / 100;
}

function yearOf(dateStr) {
  if (typeof dateStr !== "string" || dateStr.length < 4) return null;
  const y = parseInt(dateStr.slice(0, 4), 10);
  return Number.isFinite(y) ? y : null;
}

function parseRefDatesColumn(referenced_dates) {
  if (typeof referenced_dates !== "string" || !referenced_dates) return null;
  try {
    const o = JSON.parse(referenced_dates);
    return (o && typeof o === "object" && !Array.isArray(o)) ? o : null;
  } catch { return null; }
}

// ─── deriveDates — the per-leaf weighted date-set (§4.1) ─────────────────────
// row:           the MV artifact row (id, post_date, description_*, extracted_text,
//                referenced_dates, …). NOTE: released_at is the museum-release
//                timestamp and is INTENTIONALLY NOT a date input (§6).
// tagsByNamespace: { album:[...], event:[...], song:[...], ... } already grouped.
// eraConfig:     output of loadEraConfig().
// opts.isChildAlbum: the album slug of the container this row lives in (or null).
//
// Returns { dates, warnings } where dates = [{year,weight,role,source}] sorted
// by weight desc. A leaf with no derivable date yields dates:[] and a warning.
export function deriveDates(row, tagsByNamespace, eraConfig, opts = {}) {
  const warnings = [];
  const dates = [];

  const title = String(row.description_short ?? "").toLowerCase();
  const body = [row.description_short, row.description_long, row.extracted_text]
    .filter(Boolean).join(" ").toLowerCase();

  const primaryKind = Array.isArray(tagsByNamespace.content_kind)
    && tagsByNamespace.content_kind.some(k => PRIMARY_KINDS.has(k));

  const override = parseRefDatesColumn(row.referenced_dates);
  const weightOverrides = (override && override.weights && typeof override.weights === "object")
    ? override.weights : null;

  // 1. publish anchor (heavy) from post_date
  const pubYear = yearOf(row.post_date);
  if (pubYear !== null) {
    const curated = weightOverrides && typeof weightOverrides.publish === "number";
    dates.push({
      year: pubYear,
      weight: curated ? weightOverrides.publish : CENTRALITY.publishWeight,
      role: "publish",
      source: curated ? "curated" : "inferred",
    });
  }

  // 2. every dated aspect the content references (album/song/event/tour/person)
  const REF_ROLES = [
    ["album", "album_ref"],
    ["song", "song_ref"],
    ["event", "event_ref"],
    ["tour", "tour_ref"],
    ["people", "person_ref"],
  ];
  for (const [ns, role] of REF_ROLES) {
    const vals = Array.isArray(tagsByNamespace[ns]) ? tagsByNamespace[ns] : [];
    const lookup = ns === "people" ? eraConfig.person : eraConfig[ns];
    const sameRoleCount = vals.length;
    for (const slug of vals) {
      let year = lookup ? lookup[slug] : undefined;
      // songs inherit their co-tagged album's year when not individually dated
      if (year === undefined && role === "song_ref") {
        const albums = Array.isArray(tagsByNamespace.album) ? tagsByNamespace.album : [];
        for (const a of albums) {
          if (eraConfig.album[a] !== undefined) { year = eraConfig.album[a]; break; }
        }
      }
      if (year === undefined || year === null) continue;  // undated aspect: skip

      const ovKey = `${ns}:${slug}`;
      const curated = weightOverrides && typeof weightOverrides[ovKey] === "number";
      const ownAlbum = ns === "album" && opts.isChildAlbum === slug;
      const weight = curated
        ? weightOverrides[ovKey]
        : inferWeight(role, slug, { title, body, primaryKind, ownAlbum, sameRoleCount });
      dates.push({ year, weight, role, source: curated ? "curated" : "inferred" });
    }
  }

  // collapse duplicate (year,role) keeping the heaviest, then sort by weight desc
  const best = new Map();
  for (const d of dates) {
    const k = `${d.year}|${d.role}`;
    if (!best.has(k) || d.weight > best.get(k).weight) best.set(k, d);
  }
  const out = [...best.values()].sort((a, b) =>
    b.weight - a.weight || a.year - b.year || a.role.localeCompare(b.role));

  if (out.length === 0) warnings.push(row.id);  // underivable leaf (§6)
  return { dates: out, warnings };
}
