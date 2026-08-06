// FACTSCROLLER_REPLUMB-20260707 (delta e): the player scroller now reads the
// vaulted-then-released `fact` artifacts via the export's facts payload. The
// static hr_facts.js seed set is RETIRED FROM THE LIVE PATH — it stays in the
// tree (unimported) because it carried stale/unverified content (e.g. Nick's
// death year as 2020; the vault's source-backed truth is 2021-04-15). Unique
// seeds, if any are worth keeping, get vaulted with breadcrumbs in a separate
// salvage brief.
import HrExhibitFlow from "../../routes/hr/HrExhibitFlow.jsx";
import FACTS_PAYLOAD from "../exhibits/hunter_root.facts.json";
// [D1/D3c 2026-08-06] THE ALBUM CONFIG AND THE BUILT SPINE MOVED OUT, UNCHANGED,
// so a second surface can READ them instead of retyping them. /hr/archive was
// carrying a hand-typed mirror of this catalogue that had drifted two whole
// records and four misfiled songs away from the vault; it reads HR_SPINE now.
// The config rows are byte-identical to the ones that stood here — see the
// header of hunter-root-catalogue.js for the full account of what the mirror
// was printing.
import { HR_SPINE } from "./hunter-root-catalogue.js";

const FACTS = Array.isArray(FACTS_PAYLOAD?.facts) ? FACTS_PAYLOAD.facts : [];

const spine = HR_SPINE;

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
