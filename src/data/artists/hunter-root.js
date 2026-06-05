import { FACTS } from "../../routes/hr/hr_facts.js";
import HrExhibitFlow from "../../routes/hr/HrExhibitFlow.jsx";
import EXHIBIT from "../exhibits/hunter_root.json";
import { buildSpineFromArtifacts } from "./hunter-root-spine.js";

// Presentation config — coverflow order, short album ids (hr_facts albumIds
// key off these), and display years. Years live here because the foundation's
// per-track year tags are video years, not album years. Art/accent are NOT
// configured here: albums without foundation art render the player's
// placeholder gradient (the retired bandcamp art stays retired).
const ALBUMS = [
  { id: "rwth",       tag: "run_with_the_hunt" },
  { id: "cracked",    tag: "they_finally_cracked_me",                  year: 2018 },
  { id: "wheel",      tag: "life_inside_a_wheel",                      year: 2019 },
  { id: "dandelions", tag: "mimicking_the_sun_like_dandelions",        year: 2020 },
  { id: "skipping",   tag: "skipping_stones_that_sink_before_theyre_thrown", year: 2021 },
  { id: "arkansas",   tag: "arkansas",                                 year: 2023 },
  { id: "crooked",    tag: "crooked_home",                             year: 2025 },
];

const spine = buildSpineFromArtifacts(EXHIBIT, ALBUMS);

export const hunterRoot = {
  id: "hr",
  name: "Hunter Root",
  spine,
  facts: FACTS,
  defaultActiveIndex: Math.max(0, spine.findIndex(a => a.id === "arkansas")),
  splitKey: "wb-hr-split",
  cfKey: "wb-hr-cfh",
  visitPath: "/hr",
  shopExitParam: "hr",
  exhibitFlow: HrExhibitFlow,
};
