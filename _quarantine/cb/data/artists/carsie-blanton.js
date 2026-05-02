import { FACTS } from "../../routes/cb/cb_facts.js";
import { SPINE } from "../../routes/cb/cb_discography.js";
import CbExhibitFlow from "../../routes/cb/CbExhibitFlow.jsx";

export const carsieBlanton = {
  id: "cb",
  name: "Carsie Blanton",
  spine: SPINE,
  facts: FACTS,
  defaultActiveIndex: Math.min(9, SPINE.length - 1),
  splitKey: "wb-cb-split",
  cfKey: "wb-cb-cfh",
  visitPath: "/cb",
  shopExitParam: "cb",
  exhibitFlow: CbExhibitFlow,
};
