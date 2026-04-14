import { FACTS } from "../../routes/hr/hr_facts.js";
import HrExhibitFlow from "../../routes/hr/HrExhibitFlow.jsx";

const BASE = "https://f4.bcbits.com/img/";

const SPINE = [
  {
    id: "cracked", title: "They Finally Cracked Me", year: 2018,
    art: BASE + "a2891638134_10.jpg", accent: "#9a6a3a",
    tracks: [
      { title: "Cheap Wine", videos: [] },
      { title: "Straitlaced", videos: [{ ytId: "Olv9qIVoBgQ", label: "Live", type: "live" }] },
      { title: "So Sick", videos: [] },
      { title: "Identity", videos: [] },
      { title: "Hook Or The Worm", videos: [] },
      { title: "Television Head", videos: [] },
      { title: "Let The Rhythm", videos: [] },
      { title: "Silly Situation", videos: [] },
      { title: "Moving With The Storm", videos: [] },
      { title: "Soul Sucker", videos: [] },
      { title: "The Shade", videos: [] },
    ],
  },
  {
    id: "wheel", title: "Life Inside A Wheel", year: 2019,
    art: BASE + "a4132956547_10.jpg", accent: "#4a8a4a",
    tracks: [
      { title: "Same Page", videos: [] },
      { title: "Talker With A Broken Jaw", videos: [] },
      { title: "People Are Programs", videos: [{ ytId: "Pic6JU8ZiUY", label: "Official Music Video", type: "official" }] },
      { title: "Killer To Killer", videos: [] },
      { title: "Brain Cell", videos: [] },
      { title: "Fix My Head", videos: [] },
      { title: "Free To Roam The Cage", videos: [] },
      { title: "With Great Pleasure", videos: [] },
      { title: "The Water", videos: [] },
      { title: "Music On My Mind", videos: [] },
      { title: "What I Felt", videos: [] },
      { title: "Greek Fire", videos: [] },
      { title: "Shapeshifter", videos: [{ ytId: "XdiGZUWlU0Y", label: "Official Audio", type: "official" }] },
    ],
  },
  {
    id: "dandelions", title: "Mimicking the Sun Like Dandelions", year: 2020,
    art: BASE + "a3722397196_10.jpg", accent: "#3a7a9a",
    tracks: [
      { title: "Lampshade", videos: [
        { ytId: "JA1p8WSQRQQ", label: "Official Lyric Video", type: "official" },
        { ytId: "EjdXxigzBp8", label: "Live in Studio", type: "live" },
      ]},
      { title: "Favorite Friend", videos: [{ ytId: "L7-1T7F7_R0", label: "Official Music Video", type: "official" }] },
      { title: "Little Red Riding Hood", videos: [{ ytId: "BOQHN-O4DDc", label: "Live @ MCHS", type: "live" }] },
      { title: "Homestead", videos: [
        { ytId: "4HIfc5MLu6k", label: "Official Music Video", type: "official" },
        { ytId: "unkiAVuItLE", label: "Live in Studio", type: "live", credit: "Covert Concert Series" },
      ]},
      { title: "Undertow", videos: [] },
      { title: "Family Tree", videos: [{ ytId: "d0TXF6iXFRQ", label: "Live in Studio", type: "live" }] },
      { title: "Tongue In Cheek", videos: [] },
      { title: "Norma Jean", videos: [] },
      { title: "Impossible Itch", videos: [] },
      { title: "Upper Hand", videos: [] },
      { title: "Wildfire", videos: [{ ytId: "KRhiwkMfU9c", label: "Official Visualizer", type: "official" }] },
    ],
  },
  {
    id: "skipping", title: "Skipping Stones That Sink Before They're Thrown", year: 2021,
    art: BASE + "a3350417837_10.jpg", accent: "#8a3a8a",
    tracks: [
      { title: "Don't Blame The Breeze", videos: [{ ytId: "KMJVLWr34Rc", label: "Official Art Video", type: "official" }] },
      { title: "Nothin' Wrong", videos: [{ ytId: "Wv0_mujJUQU", label: "Official Music Video", type: "official" }] },
      { title: "Cusp Of The Mend", videos: [{ ytId: "ZJipWxlqIvc", label: "Official Art Video", type: "official" }] },
      { title: "Cocoon", videos: [] },
      { title: "Patience In The Dark", videos: [] },
      { title: "Just For Kicks", videos: [] },
      { title: "Echo Calls Her Name", videos: [] },
      { title: "The Shade", videos: [] },
      { title: "Shake It Off Of Me", videos: [] },
      { title: "Soul Sucker", videos: [] },
    ],
  },
  {
    id: "arkansas", title: "Arkansas", year: 2023,
    art: BASE + "a0235251082_10.jpg", accent: "#ba5a2a",
    tracks: [
      { title: "Silver Lining", videos: [{ ytId: "uaFHDfuohxc", label: "Official Video", type: "official" }] },
      { title: "Quicksand Sinking", videos: [
        { ytId: "QFpJf0RDsXc", label: "Official Music Video", type: "official" },
        { ytId: "13IUBFvIkls", label: "Official Lyric Video", type: "official" },
      ]},
      { title: "Town Rat Heathen", videos: [
        { ytId: "n2m8sP17E-c", label: "Official Music Video", type: "official" },
        { ytId: "omU0Xt3yB-o", label: "Live @Rok10productions", type: "live" },
        { ytId: "T0cdoRZ5LXg", label: "Early Version", type: "live" },
      ]},
      { title: "Reverend", videos: [{ ytId: "7Lttb_59EYw", label: "Official Music Video", type: "official" }] },
      { title: "Grain Of Rice", videos: [{ ytId: "_w0wz5o9dWU", label: "Live in Studio", type: "live" }] },
      { title: "Can't Outshine The Truth", videos: [{ ytId: "z1K0HWTDrL8", label: "Live @Rok10productions", type: "live" }] },
      { title: "California Sober", videos: [{ ytId: "04UlgUA9Uo0", label: "Live @Rok10productions", type: "live" }] },
      { title: "Good On Paper", videos: [] },
      { title: "Few Steps Back", videos: [{ ytId: "Fa5GKxEgf7c", label: "Live / The Couch Sessions", type: "live" }] },
      { title: "Run From The Devil", videos: [] },
      { title: "Silver Lining (Reprise)", videos: [] },
    ],
  },
  {
    id: "crooked", title: "Crooked Home", year: 2025,
    art: BASE + "a3836001044_10.jpg", accent: "#3a5aaa",
    tracks: [
      { title: "'94", videos: [
        { ytId: "vPW49GU38Ng", label: "Official Music Video", type: "official" },
        { ytId: "zQ2o__P67kc", label: "Acoustic Clip", type: "clip" },
      ]},
      { title: "Low", videos: [
        { ytId: "WRjngwtGGFk", label: "Official Visualizer", type: "official" },
        { ytId: "OczqgjWafds", label: "Live Clip", type: "live" },
      ]},
      { title: "String Up a Necklace", videos: [{ ytId: "pJSOjyrRIRs", label: "Official Visualizer", type: "official" }] },
      { title: "Hand in the Fire", videos: [{ ytId: "PPzNfNOMUHE", label: "Official Visualizer", type: "official" }] },
      { title: "Flash in the Pan", videos: [
        { ytId: "03NAxazLuhY", label: "Official Visualizer", type: "official" },
        { ytId: "fRFh-W92Vn4", label: "Live Clip", type: "live" },
      ]},
      { title: "Friendly Fire", videos: [
        { ytId: "YlU1CBJkJ5w", label: "Official Music Video", type: "official" },
        { ytId: "TLtIAsdi6k8", label: "Official Lyric Video", type: "official" },
      ]},
      { title: "The Devil is the Culprit", videos: [{ ytId: "M9HlNdBm2gw", label: "Official Visualizer", type: "official" }] },
      { title: "If the Body is a Temple", videos: [{ ytId: "-2aU97nuzYE", label: "Official Visualizer", type: "official" }] },
      { title: "The Keeper", videos: [{ ytId: "bXZo69DNSrM", label: "Official Visualizer", type: "official" }] },
      { title: "Out of my Hands", videos: [{ ytId: "QDqNREtunWE", label: "Official Visualizer", type: "official" }] },
      { title: "Bad Sign", videos: [{ ytId: "mmR0SLtDSdo", label: "Official Visualizer", type: "official" }] },
      { title: "My Brother's Bones", videos: [{ ytId: "wi5G_Zn74gc", label: "Official Music Video", type: "official" }] },
      { title: "Cookin' in the Bathroom", videos: [
        { ytId: "HLdiK-6WTwM", label: "Official Music Video", type: "official" },
        { ytId: "NJYYmXnAN0s", label: "Live Acoustic", type: "live" },
        { ytId: "vF1D0tYjEws", label: "Cover", type: "cover", credit: "Violet Lempke" },
      ]},
      { title: "A Pot Song", videos: [
        { ytId: "4GYQha_i8ow", label: "Official Clip", type: "official" },
        { ytId: "2Lm8noK3hQI", label: "Official Audio", type: "official" },
        { ytId: "IWKwLD-_Q4g", label: "Cover", type: "cover", credit: "Cheech & Chong" },
      ]},
    ],
  },
];

export const hunterRoot = {
  id: "hr",
  name: "Hunter Root",
  spine: SPINE,
  facts: FACTS,
  defaultActiveIndex: 4,
  splitKey: "wb-hr-split",
  cfKey: "wb-hr-cfh",
  visitPath: "/hr",
  shopExitParam: "hr",
  exhibitFlow: HrExhibitFlow,
};
