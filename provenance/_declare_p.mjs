#!/usr/bin/env node
/* ===========================================================================
   [P1-P11 2026-08-05] DECLARE THIS ROUND'S NEW STRINGS.
   ---------------------------------------------------------------------------
   A ONE-ROUND SCRIPT, on the pattern `_declare_n.mjs` set: the classification
   of a batch is a JUDGEMENT, and a judgement that exists only as a diff cannot
   be reviewed. It reads `provenance/_undeclared.json` (the gate's own emit) and
   merges a class onto every stub.

   IT IS NOT `backfill-20260804.mjs` AND MUST NOT BECOME IT. That file is the
   audit record of the first classification and is forbidden from re-running,
   because its coarse rules would silently absorb anything new. This one names
   every key EXPLICITLY: a stub with no entry below is a REFUSAL, not a default,
   and a classification matching no stub is also a refusal, so it cannot drift
   in either direction.

   THE GROUPS, and what each one is claiming:
     MIKE_P3      Mike's own FAQ answers, verbatim from the remote-control
                  brief. The two [PAPA]-marked rows are his instruction rather
                  than his copy, and they print nothing.
     PAPA         a [PAPA] marker: Mike's own to-do list, kept in the data on
                  purpose and scrubbed before render.
     HOUSE        the museum's own voice - labels, headings, controls, its own
                  address. Originates nothing and cites nothing.
     KEY          an internal identifier the sweep cannot tell from copy: a
                  storage prefix, a mode name, a scroll behaviour. HOUSE class,
                  separated here only so a reader can see at a glance that
                  these rows are not sentences.
     PLATES       a caption on one of the museum's own photographs of its own
                  objects. VERIFIED against the file it captions.
     COUNT_*      DERIVED: counted off the data structure in the same file.
     BOOTH_KEEPER RESTATED from the Information Booth's own answer.
     VIIIP_FAQ    RESTATED from the portable's FAQ, which asserts it of BOTH
                  units - this round is the first time the mainframe's own face
                  says it.
     CHARTER, PRIVACY  edited strings whose predecessors were already declared;
                  the class and the source travel with the edit.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REG = path.join(HERE, "register.json");
const UND = path.join(HERE, "_undeclared.json");

const P3 =
  "Mike's remote-control brief, P3, 2026-08-05: \"THE ROBOTS FAQ \u2014 replace " +
  "with the FAQ template and Mike's content, verbatim where given.\" Every " +
  "answer on that face is his, word for word, including the two he wrote as " +
  "instructions rather than as copy.";
const PAPA_S =
  "a [PAPA] marker \u2014 Mike's own to-do list, kept in the data on purpose; " +
  "src/lib/visitor-prose.js scrubs it before render";
const PLATES_S =
  "the museum's own photographs of the unit, held in public/robots/reference/ " +
  "\u2014 captions state what the plate shows";
const WKM_S =
  "weekendatmikeys.com, read directly 2026-08-05 before it was linked from " +
  "anywhere in this museum: the site is The Family Ranch, the heading is STEP " +
  "INTO THE WORLD OF MIKEY MIKE, Nashville TN, and its Instagram is " +
  "@findmikeymike \u2014 the handle L1 verified by oEmbed from his own upload.";
const OEMBED_S =
  "YouTube oEmbed on his own upload (L1, 2026-08-02): the channel that posted " +
  "\"Mikey Mike - Doin' Me (Official Video)\" is @findmikeymike. Verified from " +
  "the upload rather than from a search ranking.";
const OMI_S =
  "the portable's own manual, ABEAL 8P-OMI-1, held by this museum and not " +
  "published \u2014 see the wing FAQ's answer on the originals. The mainframe's " +
  "absence is a holdings fact about this collection.";

const G = {
  MIKE_P3:      { c: "MIKE", s: P3 },
  PAPA:         { c: "MIKE", s: PAPA_S },
  HOUSE:        { c: "HOUSE" },
  KEY:          { c: "HOUSE" },
  PLATES:       { c: "VERIFIED", s: PLATES_S },
  WKM:          { c: "VERIFIED", s: WKM_S },
  OEMBED:       { c: "VERIFIED", s: OEMBED_S },
  OMI:          { c: "VERIFIED", s: OMI_S },
  COUNT_NIAC:   { c: "DERIVED",
                  s: "counted off the five tiles in this face's own `collage` array." },
  COUNT_WB:     { c: "DERIVED",
                  s: "counted off the /wb spine in the same file \u2014 one release, " +
                     "six tracks, each carrying a June 2026 recording." },
  NO_PORTRAIT:  { c: "DERIVED",
                  s: "this face declares no `still` and no portrait of this artist " +
                     "exists in public/ \u2014 a holdings fact, checked against the tree." },
  DRUM:         { c: "DERIVED",
                  s: "read off the Portal face's own drum in the same file: two " +
                     "positions carry ch 1 and 2 labelled MGK-NIAC and both declare " +
                     "`arms: false`." },
  BOOTH_KEEPER: { c: "RESTATED", r: ["src/routes/InfoBooth.jsx"] },
  VIIIP_FAQ:    { c: "RESTATED", r: ["23c7dca6e93292f9"] },
  CHARTER:      { c: "RESTATED", r: ["docs/canonical/THE_CHARTER.md"] },
  PRIVACY:      { c: "VERIFIED",
                  s: "re-read clause by clause AND MEASURED IN A BROWSER (B2, " +
                     "2026-08-05); the storage clause re-verified by grep at P5, " +
                     "2026-08-05, when every view setting moved to sessionStorage." },
};

/* One line per stub, carrying the text it classifies, so this file reads as
   the review it is rather than as a list of hashes. */
const DECL = {
  /* robots.js:490            Finish the FAQ, then follow The Record.                        */ "10648bfbff65354d": G.MIKE_P3,
  /* robots.js:505            [PAPA] What is Weird.Baby Robots?                              */ "ab56b4af9ee20ed0": G.MIKE_P3,
  /* robots.js:506            [PAPA] Mike will vibe this; the only seed is “Purveyors of ... */ "dc8c2f128d5cd5f9": G.MIKE_P3,
  /* robots.js:515            Is this stuff real?                                            */ "b4e501fdf4ada350": G.MIKE_P3,
  /* robots.js:516            The hardware is — you can hold it at least, and it is heavi... */ "3c57b3005510f1ad": G.MIKE_P3,
  /* robots.js:522            Does it work?                                                  */ "7b9b451285e32f44": G.MIKE_P3,
  /* robots.js:523            See “Is this stuff real?”                                      */ "bbaaca853461fa85": G.MIKE_P3,
  /* robots.js:536            Monitor the website for availability. Follow us on social m... */ "cb4a77a36753ddcf": G.MIKE_P3,
  /* robots.js:540            Can I try one?                                                 */ "757bf395e5182560": G.MIKE_P3,
  /* robots.js:541            We need to construct a dynamic virtual interface to the MGK... */ "7087dfa9c45b0bde": G.MIKE_P3,
  /* robots.js:547            papa@weird.baby                                                */ "942336b29897a791": G.HOUSE,
  /* robots.js:672            MGK-VIIIp — the glass carrying the machine's own opening beat. */ "823647bdc8372325": G.PLATES,
  /* robots.js:676            Feed Control                                                   */ "e9ed54fd26b22e73": G.HOUSE,
  /* robots.js:735            FEED CONTROL                                                   */ "d619498703d9651b": G.HOUSE,
  /* robots.js:995            MGK-NIAC, the interior in trouble.                             */ "f9199b6488f01197": G.PLATES,
  /* robots.js:1047           Five plates of the mainframe: the machine entire, and four ... */ "82b1a60e4b1560b9": G.PLATES,
  /* robots.js:1053           Five, cropped from four photographs                            */ "e4ff142d49541e7b": G.COUNT_NIAC,
  /* robots.js:1054           One plate carries the whole cabinet; four are cut at the bars  */ "e79995fa33b825b6": G.PLATES,
  /* robots.js:1111           The cabinet, whole — lit core, bar bank, both feet             */ "40832085bb42b22b": G.PLATES,
  /* robots.js:1130           Five plates · Weird.Baby Robots                                */ "c3fc236fd25d32af": G.COUNT_NIAC,
  /* robots.js:1146           [PAPA] — the cabinet is shown whole now and the robot is no... */ "4674611330475925": G.PAPA,
  /* robots.js:1185           No manual for the mainframe is held here. The portable arri... */ "a5ca8ba167108915": G.OMI,
  /* robots.js:1209           MGK-NIAC · THE OWNER'S MANUAL                                  */ "b81d68c8182eafc4": G.HOUSE,
  /* robots.js:1321           A lit column behind the cage bars.                             */ "16a2cdfd3112566f": G.PLATES,
  /* robots.js:1323           The questions that get asked about the cabinet, answered as... */ "bcf9084f23f4262e": G.HOUSE,
  /* robots.js:1327           Yes. Both units power on and run their own firmware.           */ "97d6b5c147f11ff6": G.VIIIP_FAQ,
  /* robots.js:1329           Is the mainframe on the Portal?                                */ "69ae0543f23afe22": G.HOUSE,
  /* robots.js:1330           Not yet. Two channels are engraved for it on the feed drum ... */ "0766627176a8d65f": G.DRUM,
  /* robots.js:1339           MGK-NIAC · FAQ                                                 */ "9a7219bf5e6108e3": G.HOUSE,
  /* weird-baby.js:58         About the Artist                                               */ "d75737a3390e9530": G.HOUSE,
  /* weird-baby.js:62         ABOUT THE ARTIST                                               */ "fc223dc7bcd11653": G.HOUSE,
  /* weird-baby.js:63         WEIRD.BABY                                                     */ "29422d30c2a1dd59": G.HOUSE,
  /* weird-baby.js:65         The house's own music. What this room holds of the artist i... */ "0d260582ccd3fdd6": G.HOUSE,
  /* weird-baby.js:68         RELEASE   The Making of BoWB V1 — 2026                         */ "6a6eaaab2bda17f2": G.COUNT_WB,
  /* weird-baby.js:69         TRACKS    six, recorded June 2026                              */ "e18453aa535b2b5a": G.COUNT_WB,
  /* weird-baby.js:70         PORTRAIT  none on file                                         */ "87f8b9c3a4554e7e": G.NO_PORTRAIT,
  /* weird-baby.js:77         Q                                                              */ "23fd9c178d3198ea": G.HOUSE,
  /* weird-baby.js:77         [PAPA] Who is Weird.Baby?                                      */ "f3f89c26d4fa68f2": G.PAPA,
  /* weird-baby.js:78         [PAPA] the artist's own account of himself, which is Mike's... */ "44d9c1fb6eb95925": G.PAPA,
  /* weird-baby.js:84         WHO                                                            */ "ac9fa43b82e8b85c": G.HOUSE,
  /* weird-baby.js:84         Who keeps this place?                                          */ "919de12afab94795": G.BOOTH_KEEPER,
  /* weird-baby.js:85         One person — Papa Weird.Baby. The job pays nothing, the mus... */ "97c97906d88a8614": G.BOOTH_KEEPER,
  /* weird-baby.js:90         ON FILE                                                        */ "f649c2b8a643918d": G.HOUSE,
  /* weird-baby.js:90         What the museum holds                                          */ "357c58e834cfb90f": G.HOUSE,
  /* weird-baby.js:91         Six recordings, made in June 2026, and one release: The Mak... */ "d655b06a64577512": G.COUNT_WB,
  /* weird-baby.js:95         list                                                           */ "908dfaca4b57182d": G.KEY,
  /* weird-baby.js:96         WEIRD.BABY · ABOUT THE ARTIST                                  */ "f6e60cf26ade15e8": G.HOUSE,
  /* weird-baby.js:204        flat                                                           */ "1145c644dfebffdb": G.KEY,
  /* worth-a-listen.js:1031   weekendatmikeys.com                                            */ "6741ba89f083ffa8": G.WKM,
  /* worth-a-listen.js:1033   His own place — The Family Ranch, out of Nashville. Read di... */ "6d41d040829e1d70": G.WKM,
  /* worth-a-listen.js:1037   Verified from the upload itself rather than from a search r... */ "110a7e67c9842012": G.OEMBED,
  /* record-read.js:25        wb-read-                                                       */ "2bb42f78a2f46f0d": G.KEY,
  /* record-read.js:32        n{}                                                            */ "2f0d025447f0c2ad": G.KEY,
  /* record-read.js:33        d{}                                                            */ "eaf10ac0b3e90990": G.KEY,
  /* record-read.js:34        t{}                                                            */ "29707cdbbe8be48b": G.KEY,
  /* Exhibit.jsx:1997         Move through the record                                        */ "4bacccd062cd1f21": G.HOUSE,
  /* Exhibit.jsx:2000         NEWEST                                                         */ "38146242d8a3e20a": G.HOUSE,
  /* Exhibit.jsx:2003         OLDEST                                                         */ "053ea19b9e7e2bca": G.HOUSE,
  /* Exhibit.jsx:2010         every record has been read                                     */ "296197e85b3d0a4f": G.HOUSE,
  /* Exhibit.jsx:2011         the oldest record you have not opened                          */ "c9b7582c10026b28": G.HOUSE,
  /* Exhibit.jsx:2012         UNREAD                                                         */ "411c41231fda763f": G.HOUSE,
  /* Exhibit.jsx:2015         INDEX                                                          */ "c715260971964697": G.HOUSE,
  /* RecordEntry.jsx:254      auto                                                           */ "03b8aa0f50eaf8c2": G.KEY,
  /* RecordEntry.jsx:254      smooth                                                         */ "2f48ee1c4a8ea708": G.KEY,
  /* RecordEntry.jsx:254      start                                                          */ "bec715fade577a3b": G.KEY,
  /* Foundation.jsx:622       Every cost has a name, a number and a sponsor on the record... */ "2ac851b1b96ef143": G.CHARTER,
  /* Foundation.jsx:660       Not to run the place, and that is the load-bearing part. He... */ "6eb59fd59571a8d8": G.CHARTER,
  /* Foundation.jsx:881       The register                                                   */ "ff2560f7e324f3c4": G.HOUSE,
  /* Foundation.jsx:942       A zero-cost ledger kept by the keeper for the museum           */ "18fa33f87ba3761a": G.HOUSE,
  /* Foundation.jsx:944       Ledger                                                         */ "faf2e3717d4ee8ec": G.HOUSE,
  /* HrArchive.jsx:179        hr-archive                                                     */ "2f5d925f854629a0": G.KEY,
  /* InfoBooth.jsx:194        No — and the better half of the answer is that the machine ... */ "9f770eff55995b65": G.PRIVACY,
};

const reg = JSON.parse(fs.readFileSync(REG, "utf8"));
const und = JSON.parse(fs.readFileSync(UND, "utf8"));
const stubs = und.entries || und;

const missing = Object.keys(stubs).filter((k) => !DECL[k]);
if (missing.length) {
  console.error(`REFUSING: ${missing.length} stub(s) have no explicit classification:`);
  missing.forEach((k) => console.error(`  ${k}  ${stubs[k].f}:${stubs[k].l}  ${JSON.stringify(stubs[k].t).slice(0, 90)}`));
  process.exit(1);
}
const extra = Object.keys(DECL).filter((k) => !stubs[k]);
if (extra.length) {
  console.error(`REFUSING: ${extra.length} classification(s) match no stub - the source moved under this script:`);
  extra.forEach((k) => console.error(`  ${k}`));
  process.exit(1);
}

let n = 0;
for (const [k, stub] of Object.entries(stubs)) {
  const { c: _drop, ...rest } = stub;
  reg.entries[k] = { ...rest, ...DECL[k] };
  n++;
}
fs.writeFileSync(REG, JSON.stringify(reg, null, 1) + "\n");
console.log(`declared ${n} row(s) into provenance/register.json`);
