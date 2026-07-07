// FACTSCROLLER_REPLUMB-20260707 (delta e): the player scroller now reads the
// vaulted-then-released `fact` artifacts via the export's facts payload. The
// static hr_facts.js seed set is RETIRED FROM THE LIVE PATH — it stays in the
// tree (unimported) because it carried stale/unverified content (e.g. Nick's
// death year as 2020; the vault's source-backed truth is 2021-04-15). Unique
// seeds, if any are worth keeping, get vaulted with breadcrumbs in a separate
// salvage brief.
import HrExhibitFlow from "../../routes/hr/HrExhibitFlow.jsx";
import EXHIBIT from "../exhibits/hunter_root.json";
import FACTS_PAYLOAD from "../exhibits/hunter_root.facts.json";
import { buildSpineFromArtifacts } from "./hunter-root-spine.js";

const FACTS = Array.isArray(FACTS_PAYLOAD?.facts) ? FACTS_PAYLOAD.facts : [];

// Presentation config — coverflow order, short album ids (hr_facts albumIds
// key off these), and display years. Years live here because the foundation's
// per-track year tags are video years, not album years. Art/accent are NOT
// configured here: albums without foundation art render the player's
// placeholder gradient (the retired bandcamp art stays retired).
const ALBUMS = [
  { id: "rwth",       tag: "run_with_the_hunt" },
  { id: "phone",      tag: "phone_recordings_ep",                      year: 2017 },
  { id: "cracked",    tag: "they_finally_cracked_me",                  year: 2018 },
  { id: "wheel",      tag: "life_inside_a_wheel",                      year: 2019 },
  { id: "dandelions", tag: "mimicking_the_sun_like_dandelions",        year: 2020 },
  { id: "skipping",   tag: "skipping_stones_that_sink_before_theyre_thrown", year: 2021 },
  { id: "arkansas",   tag: "arkansas",                                 year: 2023 },
  { id: "crooked",    tag: "crooked_home",                             year: 2025 },
  { id: "rarities",   tag: "rarities" },
];

const spine = buildSpineFromArtifacts(EXHIBIT, ALBUMS);

export const hunterRoot = {
  id: "hr",
  name: "Hunter Root",
  exhibitSlug: "hunter_root",
  // FACTSCROLLER_REPLUMB-20260707: the scroller's era tier (T3) bridges the
  // facts' LEGACY era slugs to a spine album id. Only 3 era-tagged facts exist
  // (era:rwth ×2 carry album:run_with_the_hunt and match at album tier anyway;
  // era:early_days ×1 has no album tag, so it needs this bridge to be reachable
  // above the artist floor when the rwth album plays). Vestigial by design;
  // grows if more era-only facts land. Album ids without an entry get [].
  eraAlias: { rwth: ["rwth", "early_days"] },
  spine,
  facts: FACTS,
  defaultActiveIndex: Math.max(0, spine.findIndex(a => a.id === "arkansas")),
  splitKey: "wb-hr-split",
  cfKey: "wb-hr-cfh",
  visitPath: "/hr",
  shopExitParam: "hr",
  exhibitFlow: HrExhibitFlow,
};
