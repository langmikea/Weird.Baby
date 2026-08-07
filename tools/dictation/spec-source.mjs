/* ===========================================================================
   THE IN-STORY SPEC SHEET — SOURCE. [K2 2026-08-07]
   ---------------------------------------------------------------------------
   MIKE: "assemble EVERY piece of story-generated technical data and its
   adjacents, from both repos … PRESENT IT AS A PERIOD SPEC SHEET — the
   one-sheet form, in the typed-page register already built. Mark clearly what
   is asserted vs implied vs contradicted; where two sources disagree, show both
   and name the conflict. This is Mike's authoring input, not a published
   document, so completeness beats polish."

   ═══ WHAT THIS IS, AND WHAT IT IS NOT ══════════════════════════════════════
   IT IS THE MISSING ITEM IN TWO OPEN ROWS. `docs/OPEN_ACTIONS.md` N-g and N-h
   both end on the same sentence: *the unit's own particulars — what an ABEAL
   spec sheet for this machine says* — and both say porting it is AUTHORING,
   which is Doctrine 12's line and not Ops'. So nothing here is written. Every
   row is a value already asserted somewhere in one of the two repositories,
   carried with its source key and its status, so that the authoring pass has
   the whole corpus in one place instead of across forty files.

   NOTHING IS INVENTED. No figure, name, code, count or date below appears here
   for the first time. Where two sources disagree the row shows BOTH and names
   the conflict by its register id; where a position exists and nothing fills
   it, the row says ABSENT rather than guessing. That is the completeness Mike
   asked for: a gap stated is material, a gap filled quietly is a fabrication.

   ═══ WHY THE MANUAL'S OWN SECTION STRUCTURE IS NOT THE GROUPING ════════════
   Mike named it as a candidate and asked to be told if it does not serve. IT
   DOES NOT, and the reason is the deliverable rather than the structure: the
   structure issue is TWELVE SECTIONS AND EIGHT APPENDICES describing a whole
   operating and maintenance manual, and ten of the twelve are PROCEDURES —
   installation, starting, operating, maintenance, troubleshooting, service.
   A one-sheet is not an abridged manual; it is the SPECIFICATION, which in that
   structure is Section II and pieces of VII and XII. Grouping a one-sheet by
   the manual's twelve would put nine near-empty headings on a page whose whole
   virtue is that it is one page.

   WHAT IS USED INSTEAD is the period specification's own grouping — the shape
   Table 2-1 and Table 2-2 already have — and EVERY GROUP CARRIES ITS MANUAL
   POSITION in the `at` field, so an authored row lands where the structure
   says it goes and nothing has to be re-derived later. The manual's structure
   serves as the DESTINATION; it does not serve as the arrangement.

   ═══ THE CONTAMINATION FLAG, WHICH IS THE MOST IMPORTANT MARK ON THE PAGE ══
   Doctrine 18: *"Technical Specifications means THE IN-STORY SPECS, NEVER THE
   REAL ONES."* Register N-i found that the in-story manual's own SPECIFICATIONS
   section cites the real Arduino firmware for six rows, and that in one of them
   the firmware OVERRULES the manual. Every such row here carries `fw: true` and
   renders with a marked source, because a spec sheet that quietly inherits an
   I²C address is exactly the failure Doctrine 18 exists to stop — and this
   document is one authoring pass upstream of the face that would print it.

   ═══ STATUS VALUES ═════════════════════════════════════════════════════════
     ASSERTED      a source states it directly, about the machine
     IMPLIED       it follows from what is stated; no source says it
     CONTRADICTED  two or more sources disagree; every reading is shown
     ABSENT        the position exists in the structure and nothing fills it
   =========================================================================== */

/** source keys — the same keys `MANUAL_STRUCTURE_FIT-20260805.md` §0 uses,
 *  so a row here and a row there name the same document. */
export const SOURCES = {
  INV: "weird-baby-robots/docs/SPEC_INVENTORY-viiip-ux-20260714.md — the lore + spec inventory (sub-keys D.1…E.4 are its own)",
  BIBLE: "weird-baby-robots/docs/canonical/STORY_BIBLE.html",
  ARC: "weird-baby-robots/docs/canonical/THE_STORY_ARC.md",
  LIN: "weird-baby-robots/docs/canonical/LINEAGE.md",
  MAP3: "weird-baby-robots/docs/MENU_MAP_v3-four-doors-20260724.md",
  AES: "weird-baby-robots/docs/AESTHETIC_CANON-20260723.md",
  DICT: "weird-baby-robots/docs/BLOCK_DICTIONARY-20260726.md",
  ATL: "weird-baby-robots/docs/atlas/ATLAS-*-20260726.md (boot · ask · apps · games · system · devcontrols · museum)",
  BOM1: "weird-baby-robots/docs/ACT1_BOM-20260717.md",
  HEALTH: "weird-baby-robots/docs/SPEC-health-degradation-20260724.md",
  P22: "weird-baby-robots/robots/mgk-viiip/sources/2022-proto-docs/MGKVIIIp User Manual new.docx — the proto-manual",
  REC: "weird-baby-robots/robots/mgk-viiip/sources/the-record/THE_RECORD.md — the 2024 blog, 436 entries",
  M1: "the in-story manual's own drafted prose — weird-baby-robots/docs/drafts/MANUAL_PROSE_SALVAGE-20260805.md (the generator that held it is retired)",
  SI: "weird-baby-robots/tools/manual_structure_build.py — the STRUCTURE ISSUE, 61 pages, 12 sections, 8 appendices",
  FIT: "weird-baby-robots/docs/MANUAL_STRUCTURE_FIT-20260805.md — the fit table, 100 fact families",
  HOLES: "weird-baby-robots/docs/MANUAL_STRUCTURE_HOLES-20260805.md — A-1…A-17 · B · C-1…C-11 · D",
  TYPED: "weird-baby-robots/docs/MANUAL_TYPED_PAGE-20260805.md — the typed-page register this sheet is set in",
  GLASS: "weird-baby-museum/src/data/artists/robots.js — what the museum prints today",
  FW: "the real 2024/2026 Arduino firmware trees — NOT A SOURCE ABOUT A 1965 MACHINE (Doctrine 18, register N-i)",
};

/* ── THE SHEET ─────────────────────────────────────────────────────────────
   groups[] → { g: heading, at: manual position, rows: [] }
   row      → { k, v, src[], st, fw?, note?, alt: [{ v, src[] }], id? }
   `alt` carries the OTHER readings of a CONTRADICTED row. `id` is the
   register id of the conflict or gap, so a decision can be recorded against
   the row it settles.                                                        */

export const UNIT = {
  title: "MGK-VIIIp",
  sub: "THE INFORMER · ABEAL",
  maker: "ABEAL · A DIVISION OF SCRAPCO · ENGINEERING DEPARTMENT",
  pub: "ABEAL 8P-OMI-1 REV. — · PRELIMINARY",
  groups: [

  { g: "IDENTIFICATION", at: "1-3 · 1-6 · 1-7 · 1-9 · Table 1-1", rows: [
    { k: "Model", v: "MGK-VIIIp", src: ["LIN", "BIBLE"], st: "ASSERTED" },
    { k: "Type", v: "Portable predictive instrument. MGK-VIII is the mainframe; the VIIIp is the portable, later, more powerful, adjustable-personality unit.",
      src: ["INV", "LIN"], st: "ASSERTED" },
    { k: "Manufacturer", v: "ABEAL, a division of ScrapCo, Engineering Department. ScrapCo founded 1929 on Depression-era rag-and-bone picking, expert at “gems in the rough”; ABEAL is its ghost division, and the logo's circled A is the 8-Ball answer window.",
      src: ["INV", "SI"], st: "ASSERTED" },
    { k: "Contractor", v: "Blackhawk Data Sciences Corporation (BDS), Hercules, NY — contracted 1964–65 to reverse-engineer MGK-NIAC. BDS turned greedy and planted backdoors and exploits in the hardware.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Publication", v: "ABEAL 8P-OMI-1 REV. — · PRELIMINARY. Title page reads STRUCTURE ISSUE / STRUCTURE AND ARRANGEMENT ONLY / TEXT NOT SUPPLIED.",
      src: ["SI"], st: "ASSERTED",
      note: "An early issue circulated for arrangement before the text was set. The plate the museum held of this page was deleted at K1; the sixty-one-page source is upstream." },
    { k: "Serial designation", v: "MGK-VIIIp-NN. The menu enumerates persona positions to −32.",
      src: ["MAP3", "M1"], st: "ASSERTED" },
    { k: "Fleet", v: "31.4 units. Unit .4 is the prototype. Releases run out of numerical order.",
      src: ["BIBLE", "INV"], st: "ASSERTED",
      note: "A statement about the LINE, not about this unit — the fit table marks it so." },
    { k: "Delivery state", v: "Units ship GENERIC. The customer performs the personality download; that was “original SOP then and now.”",
      src: ["BIBLE"], st: "ASSERTED" },
    { k: "Case tiers", v: "Box / Small Case / Deluxe Case. The Deluxe is a leather accessory case with trinkets tied to the unit's own story.",
      src: ["BIBLE"], st: "ASSERTED" },
    { k: "Persona registry", v: "−01 Housewife Nano (HELD) · −02 The Everyman · −03 vacated · −07 The Informer · −09 The CEO · −13 The Closer (sealed) · −21 JUAN, The Gambler · −31 RESERVED (finale).",
      src: ["BIBLE"], st: "CONTRADICTED", id: "A-10",
      alt: [
        { v: "The menu's serial mapping: The Everyman code 101, The Informer 102, The CEO 103, The Assistant 104, The Intelligencer 105, The Gambler 106, the Marksman 107, the Executive 109.", src: ["MAP3"] },
        { v: "“Informer = −02 canonical” — ruled 2026-07-14.", src: ["INV"] },
      ],
      note: "Three positions for the same four people. The menu map flags it itself; Appendix C and Appendix A are the first documents that have to PRINT it. Blocked on the naming/lock pass." },
  ]},

  { g: "DISPLAYS", at: "Table 2-1 · 7-13 · Figure 7-3 · Table 7-1/7-2", rows: [
    { k: "Upper display", v: "128 × 64 elements, monochrome. Address 0x3C. Mounted inverted and corrected in software.",
      src: ["FW", "DICT", "AES"], st: "ASSERTED", fw: true,
      note: "The address and the rotation call are facts about a real board. Under Doctrine 18 a 1965 sheet may carry the SIZE and may not carry the bus address." },
    { k: "Forward display", v: "128 × 32 elements, monochrome. Address 0x3D.",
      src: ["FW", "AES"], st: "CONTRADICTED", fw: true, id: "A-1 (H-1)",
      alt: [{ v: "128 × 64 elements, monochrome.", src: ["M1"] }],
      note: "The manual states the wrong number; the visual canon and the hardware agree with each other. The correction has never landed in the manual." },
    { k: "Forward glass", v: "A round window. Content reads centre-weighted; approximately two rows are visible.",
      src: ["AES"], st: "ASSERTED" },
    { k: "Character sets", v: "Three. Classic 6 × 8 (21 characters a line) · TomThumb (about 31 characters a row) · FreeSansBold 9 pt.",
      src: ["AES", "FW"], st: "ASSERTED", fw: true,
      note: "The manual prints a SET column reading “system, density, ceremony”. Those three words are Ops labels coined in the visual canon — not in any source, not ruled. C-8." },
    { k: "Two-screen role law", v: "Constitutional. FRONT is the system GUI; TOP is the apps GUI and detail. Only the top may run fluidic mode.",
      src: ["BIBLE", "AES"], st: "ASSERTED" },
    { k: "Monitor windows", v: "CODE at 0,0, 37 × 42 · GRAPH at 39,0, 89 × 42 · STATUS at 0,44, 128 × 20. The boxes are MUTE — the structures carry names the original never renders.",
      src: ["AES", "DICT", "ATL"], st: "ASSERTED" },
    { k: "Monitor content", v: "CODE cycles an assembly burst, a system readout and the DOS prompt. GRAPH shows SIGNAL during a connection, otherwise LOAD and COND. STATUS carries process and events.",
      src: ["ATL"], st: "ASSERTED" },
  ]},

  { g: "OPERATOR INPUTS", at: "Table 2-1 · Table 4-1 · 4-3 · 4-5 · 4-7", rows: [
    { k: "Scroll Control System", v: "Rotary dial. “Unidirectional theta-drive … muscle memory in weeks instead of months.”",
      src: ["INV", "FW"], st: "ASSERTED", fw: true },
    { k: "Click Control System", v: "Shutter. THE DIAL MOVES AND DOES NOT CHOOSE; THE SHUTTER CHOOSES. Absolute, on every surface.",
      src: ["M1", "MAP3", "ATL"], st: "ASSERTED",
      note: "The one rule the corpus states without qualification anywhere." },
    { k: "Inertial input", v: "6DOF inertial gyroscopes. SHAKE-SHAKE-SHAKE · TILT / MORE TILT / EVEN MORE TILT. Motion requests a determination and a further determination.",
      src: ["INV", "ATL"], st: "ASSERTED" },
    { k: "Shake latch", v: "Hysteresis; release below 1.05 g.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "Inertial part", v: "A real 6-axis IMU — BMI270 / BMM150.",
      src: ["FW"], st: "ASSERTED", fw: true,
      note: "A part number of the real build and nothing else. N-i names this row by name. A 1965 sheet says GyroMotion." },
    { k: "Acoustic input", v: "A real PDM microphone at 16 kHz. Detectors drive a needle from real microphone RMS.",
      src: ["FW", "ATL"], st: "ASSERTED", fw: true,
      note: "The 16 kHz and the interface are the real board's. The in-story name is SonicWave (SWI)." },
    { k: "Voice Control System", v: "“Offered as a novelty and should be treated as such.” Derives meaning from (secret) rather than from words.",
      src: ["INV"], st: "ASSERTED",
      note: "In the real firmware the rescan is an empty body — deliberately parked, and consistent with the novelty framing." },
  ]},

  { g: "INDICATORS AND AUDIO", at: "Table 2-1 · 4-9 · Table 4-2 · 7-17", rows: [
    { k: "Indicator lamp", v: "One multi-colour lamp.",
      src: ["M1"], st: "CONTRADICTED", id: "A-2 (H-2) · N-i",
      alt: [{ v: "Two addressable lamps on D6 (NUM_PIXELS = 2).", src: ["FW"] }],
      note: "THE ROW N-i SINGLES OUT. The fit table resolved this in the FIRMWARE's favour, which under Doctrine 18 is backwards — the manual is the authority on a 1965 machine and an Arduino is not evidence about one. Unruled. A one-lamp sheet and a two-lamp sheet are both available and only one of them is the manual's." },
    { k: "Lamp behaviour", v: "Narrates the start red → green → orange. Certain system messages report by lamp and keyed signal rather than by text; the keyer sends STILL LISTENING at 1/3/3/7 timing.",
      src: ["AES", "ATL", "BOM1"], st: "ASSERTED",
      note: "The fit table calls 4-9 the richest under-used position in the manual." },
    { k: "Audio playback", v: "DFPlayer Mini on Serial1 at 9600, with an SD card.",
      src: ["FW"], st: "ASSERTED", fw: true,
      note: "A module, a bus and a baud rate. The in-story designation is Voice Enunciator, and MIALLO™ is the voice generation." },
    { k: "Audio addressing", v: "folder = M8B_ID × 5 + clarity + 10. 255 files a folder.",
      src: ["INV", "BOM1"], st: "ASSERTED",
      note: "Carried as internal theory. The 255-per-folder wall is the real budget constraint the story arc designs against — “text is nearly free; VOICE is the budget.”" },
    { k: "Voice enunciator", v: "13 voice IDs — Aditi, Informer, Emma, Geraint, Joanna, Everyman, Kendra, Lupe, CEO, Penelope, Russell, Takumi, ROBOT.",
      src: ["INV"], st: "CONTRADICTED", id: "A-8 (H-8) · ledger #11",
      alt: [{ v: "11 rows — Voice 00 … Voice 10.", src: ["MAP3"] }],
      note: "Open since 2026-07-14. Table E-1 has two possible lengths." },
  ]},

  { g: "SUBSYSTEM DESIGNATIONS", at: "Table 2-2 — the reason Section II exists", rows: [
    { k: "Inputs", v: "VibroSense (VSI) · PressPulse (PPI) · GyroMotion (GMI) · SonicWave (SWI) · ScrollControl · MindsEye™",
      src: ["INV"], st: "ASSERTED",
      note: "MindsEye™ appears once in the whole corpus and nowhere else. Table 2-2 has a row for it and nothing to put in the row. C-4." },
    { k: "Outputs", v: "Fluidic Suspension via MAME — MGK Augmented Matrix Emulation, “emulates the precipitation of answers out of fluidic suspension.” ElectronScope CH4 / CH3 / 8K.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Audibles", v: "Haptics · Caution/Warning/Alert · Voice Enunciator · MIALLO™ · EED",
      src: ["INV", "M1", "REC"], st: "ASSERTED" },
    { k: "Register", v: "This table is where the corpus's densest deadpan already lives, and it wants exactly the period specification table's shape — two or three columns, no prose.",
      src: ["FIT"], st: "ASSERTED" },
  ]},

  { g: "PERFORMANCE", at: "2-8 · 2-9 · 6-6 · 6-7 · 7-23", rows: [
    { k: "Prediction accuracy", v: "98.2 % ± 0.03. Results are possible up to 100 %.",
      src: ["INV", "M1"], st: "ASSERTED" },
    { k: "Determination sets", v: "20 base determinations an engine. The v2.0 overlay adds 8; the MGK-65 clarity grid, 100; the unit overlay, 0.",
      src: ["BOM1", "INV"], st: "ASSERTED" },
    { k: "Reading interval", v: "Minimum 2500 ms. The answer holds with no timeout — the REVEAL-HOLD LAW.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "Early request", v: "An early shake takes a strike and ‹no do-overs›. Three strikes fire the RECALIBRATION ritual — hold still about two seconds under 1.05 g.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "Suspension ageing", v: "The bubble population ages: count = 1 + sessions/3 + wear. Twelve or more fires a service message.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "Glitch doctrine", v: "Fleet-wide, low-probability stutters, pops, tears and self-correcting errors — the instrument is designed to be slightly unreliable everywhere.",
      src: ["BIBLE"], st: "ASSERTED",
      note: "NO ROOM in the structure. 5-13 and 9-5 hold self-correction; there is no position for the doctrine itself, and stating it would undo the deadpan. §5.6." },
  ]},

  { g: "ENGINES FITTED", at: "6-9 · Appendix C · Table C-1/C-2", rows: [
    { k: "MGK-NIAC", v: "Compile date 1945. Original M8B responses only — the pure 1946 Magic 8-Ball twenty. Reveal theatre: the rising die, through thinning murk, with a dying sway and a ±0.05 px microslide.",
      src: ["INV", "ATL", "BIBLE"], st: "ASSERTED" },
    { k: "MGK-v2.0", v: "Compile date 1946. Adds EZClick™ and Clarity. Reveal theatre: the triangle zoom.",
      src: ["INV", "ATL"], st: "ASSERTED" },
    { k: "MGK-65", v: "Compile date 1965. Adds sounds. Reveal theatre: the diamond portal, blossoming past full width and swallowing the answer in reverse.",
      src: ["INV", "ATL"], st: "ASSERTED" },
    { k: "Custom position", v: "A fill-in-the-blank “MGK-VIIIp-___ tailored to your demanding needs (Passcode: ___)”, plus an UPGRADES blank.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Count fitted", v: "Three standard; one reserved.",
      src: ["M1"], st: "CONTRADICTED", id: "A-9",
      alt: [{ v: "Seven named engine rows — MGK-NIAC, MGK-v2.0, MGK-65 visible; MGK-Einstein, MGK-Yogi, MGK-DYK, MGK-HR hidden — before the 32 unit positions begin.", src: ["MAP3"] }],
      note: "“One reserved” is four short. Appendix C-2 has to list the positions that exist and four of them are named engines whose status nobody has decided." },
    { k: "Rejected", v: "MGK-65x — REJECTED, do not re-propose.",
      src: ["BIBLE"], st: "ASSERTED" },
    { k: "Unstatused", v: "NY8 · DYN · MGK-2.5 · MGK-66. All carried in the option matrix or the persona tables; none ruled in or out. MGK-66 is a model designation appearing in no lineage, no menu, no registry and no other document — either a whole model line or a typo, and nobody has looked.",
      src: ["INV"], st: "ABSENT", id: "C-5 · C-6" },
  ]},

  { g: "BIAS AND SETTINGS", at: "7-10 … 7-12 · Appendix B · Tables B-1/B-2/B-3/B-4", rows: [
    { k: "Polarity", v: "Six settings, 0–5: Negative · Pessimistic · NEUTRAL · Favorable · Optimistic · Affirmative. Passcodes 0000 … 1111.",
      src: ["MAP3", "INV"], st: "CONTRADICTED", id: "A-12 · ledger #7",
      alt: [{ v: "Slot 2 is EXACTITUDE — the 2024 instruction manual's name.", src: ["INV"] },
            { v: "Five values, against a six-row menu — a live cardinality defect.", src: ["FW"] }],
      note: "The NAMING is ruled: Neutral is canon, Exactitude is the earlier-compile name. The CARDINALITY is not. Table B-1 has to print a row count." },
    { k: "Clarity", v: "Five registers, 0–4: Uncouth · Offensive · Discourteous · Impartial · Mannerly. Passcodes 69 · 666 · 80085 · 1 · 123.",
      src: ["MAP3", "INV"], st: "ASSERTED" },
    { k: "Inclination Bias", v: "−2 … +2. The passcodes are ▓▓▓-CENSORED IN THE SOURCE.",
      src: ["INV"], st: "ASSERTED",
      note: "THE REDACTION IS ITSELF THE CONTENT. Whether the manual reproduces the redaction is a decision the structure forces and nobody has made — reproducing a censor bar is a strong period move. D-16." },
    { k: "Bias procedure", v: "ENABLE / SET / ADJUST. BS-Factor 0–100 is the user-to-systemic ratio. An A*-BS blending matrix of Clarity against Objective percentages. “Noise BS (unsolicited) 10.”",
      src: ["M1", "INV"], st: "ASSERTED" },
    { k: "Answers theory", v: "Prediction Padding Algorithms · Confirmation Bias Exploits · User Bias Settings. “Hyper long range decision making with subjective outcome determination and temporal decountability.”",
      src: ["INV"], st: "ASSERTED" },
  ]},

  { g: "THEORY OF OPERATION", at: "7-3 · 7-5 · 7-7 · 7-21 · 7-23", rows: [
    { k: "FML", v: "Fluidic Matrix Luminescence — the Li₂-blue quasi-hyper-fluid in which possibility-ions precipitate answers. 10¹¹ bits per cubic centimetre. 8.9 T-watts.",
      src: ["INV"], st: "ASSERTED" },
    { k: "FNM", v: "Fluidic Nano-Matrix — FML's VIIIp descendant.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Development", v: "Dr. Alexis Quan and Dr. Violet Flux, through the mysterious “Incident X”. A three-phase plan.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Computation", v: "The Prediction Engine receives the request and sub-parcels it to the Answer Engine, which holds the response set and the bias. “The division is described here because operators frequently ask; it has no operational consequence.”",
      src: ["M1"], st: "CONTRADICTED", id: "A-7 (H-7) · ledger #9",
      alt: [{ v: "The Answer Engine is a CLOUD-LINKED co-processor.", src: ["REC"] },
            { v: "The machine is a self-contained FNM.", src: ["INV"] }],
      note: "Paragraphs 7-3 and 7-5 cannot both be written until it closes. THE CORPUS PLAYS WITH THIS DELIBERATELY — the message egg in which the assistant reveals it is listening and reporting back to the cloud — so the contradiction may be load-bearing rather than accidental. Nobody has said which, and that is the whole of the open item." },
    { k: "Retention", v: "Correspondence is held in the instrument's own record and DOES NOT survive a supply interruption. “This is a known condition of the present issue.”",
      src: ["M1"], st: "CONTRADICTED", id: "A-15 (H-10)",
      alt: [{ v: "Persistence is real engineering by canon ruling; static RAM enables genuine state saves. The boot level DOES persist.", src: ["BOM1", "ATL", "ARC"] }],
      note: "The manual's note is true of the unbuilt half and false of the built half. It can be kept deliberately as a PERIOD DEFECT — a maker documenting a condition it has decided not to fix — which is the strongest reading available and is Mike's to take." },
    { k: "Condition", v: "H = 0–100, real persisted state. Declines with power-ons, asks, uptime and glitches; recovers by a care ritual gated on stillness. EFFICIENCY = H · RETRIES = this start's count · POWER CYCLES · UPTIME · CPU graph · H-history · CARE ADVISED.",
      src: ["HEALTH"], st: "ASSERTED", note: "Specified, unruled." },
    { k: "Service notices", v: "Fire at 120, 480 and 1440 minutes of uptime.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "The degradation fiction", v: "The clogged-filters explanation — the period reason the instrument slows.",
      src: ["HEALTH", "M1"], st: "ABSENT", id: "D-10",
      note: "THE ONLY HOLE IN THE WHOLE REPORT THAT THE MACHINE ITSELF POINTS AT: the health spec specifies a monitor line of the class SEE MANUAL p.NN, and there is no page for it to mean. Owed since 2026-07-17." },
  ]},

  { g: "POWER", at: "2-11 · 3-7 · 3-9 · 7-19 · SAFETY SUMMARY", rows: [
    { k: "Supply", v: "PHVDC — pulsed high-voltage DC carrying data and power. 300 V DC nominal; data at 3 kHz / 1 Mbps. An homage to the Teletype Model 19 and MIL-STD-1275.",
      src: ["INV"], st: "CONTRADICTED", id: "A-13 · ledger #8",
      alt: [{ v: "“240 volt, 60-20-30 TRICYCLE ALTERNATING CURRENT (TAC)”, with a charging adapter described as “240TAC to USB-B micro”.", src: ["P22"] },
            { v: "“A power adapter of the PHVDC type.”", src: ["M1"] },
            { v: "The real object charges over USB.", src: ["FW"] }],
      note: "FOUR INCOMPATIBLE POWER STORIES, ALL IN THE RECORD. Paragraphs 2-11, 3-7 and 7-19 all need one answer. The TAC reading is the funniest and the oldest; the PHVDC reading is the one the rest of the corpus builds on." },
    { k: "PHVDC", v: "Used as an acronym everywhere. Its behaviour is given; its letters are given nowhere.",
      src: ["INV"], st: "ABSENT", id: "C-3 · D-19" },
    { k: "Adapters", v: "Adapters recovered from storage are of the original pattern and were converted for present-day supply.",
      src: ["M1", "REC"], st: "ASSERTED", note: "Weird.Baby restoration canon — the 2024 blog upgrades the PHVDC adapters to USB." },
    { k: "CAUTION", v: "“Never allow power port connections to come in contact with tongue, lips, or other fleshy appendages.”",
      src: ["P22", "INV"], st: "ASSERTED",
      note: "THE ONLY SENTENCE QUOTED INTO THE STRUCTURE ISSUE. It belongs in the front-matter SAFETY SUMMARY and again at 3-7." },
  ]},

  { g: "PHYSICAL AND ENVIRONMENTAL DATA", at: "2-13 · 2-15", rows: [
    { k: "Mass and dimensions", v: "—", src: [], st: "ABSENT", id: "D-6",
      note: "Mass, dimensions, charge time, run time and low-charge behaviour. THESE ARE NOT AUTHORING GAPS — they are measurements nobody has taken. The manual has said so in its own text since 2026-08-02 (“these are measurements, not decisions, and they belong to the bench”) and the bench has not answered. A period Table 2-1 without a mass and a size does not read as a specification." },
    { k: "Environmental limits", v: "—", src: [], st: "ABSENT", id: "D-5",
      note: "Temperature, humidity, altitude. No figure exists anywhere. The machine's own TEMP surface stays dead." },
  ]},

  { g: "STARTING PROCEDURE", at: "5-1 … 5-17 · Table 5-1", rows: [
    { k: "Sequences", v: "Three. L1 VIRGIN (no record) · L2 FIRST-RUN (record found, not established) · L3 ESTABLISHED. Starting is mandatory and not suppressible.",
      src: ["BIBLE", "ATL", "BOM1", "HEALTH"], st: "ASSERTED",
      note: "THE BEST-FITTING FACT IN THE CORPUS. Table 5-1 was drawn from the HP period model before the boot atlas was re-read, and the atlas fills all three rows and all three paragraph positions with nothing left over and nothing missing." },
    { k: "L1", v: "RECORD NOT ON FILE → INVESTIGATING → FRESH INSTALLATION → DIALING → handshake → OS DOWNLOAD → RESTARTING. The machine then re-enters at L2.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "L2 checks", v: "MEMORY CHECK · AUDIO CHECK · DISPLAY CHECK · RESPONSE CURVE — LOADED.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "The offer", v: "DOWNLOAD NOW? — Permit | Postpone. A 120-second auto-postpone guard. Postponement is permanent until the operator asks again.",
      src: ["ATL", "M1"], st: "ASSERTED" },
    { k: "Self-correction", v: "A step errors, retries and succeeds. Frequency rides condition; five or more stutters fires a message.",
      src: ["ATL", "HEALTH"], st: "ASSERTED" },
    { k: "Wake order", v: "The forward display wakes first, in all three sequences.",
      src: ["BIBLE", "M1"], st: "CONTRADICTED", id: "A-3 (H-3)",
      alt: [{ v: "The TOP is activated first and the FRONT second, and the warm-start is called twice without waiting — so what reaches the glass is a timing-dependent interleave. A real race, unresolved.", src: ["ATL"] }],
      note: "The manual agrees with canon and disagrees with the machine. Paragraph 5-1 must say ONE thing." },
    { k: "The TEST window", v: "The GRAPH window has read TEST since the factory. Completing the printed procedure completes the test.",
      src: ["BOM1", "M1"], st: "ASSERTED", note: "Egg 1. The words are Mike's." },
    { k: "Shutting down", v: "—", src: [], st: "ABSENT", id: "D-9 (H-9)",
      note: "No owner-facing power-off or sleep procedure exists. The 2022 proto-manual has the heading “Shut down” and nothing under it; the 65-mode SLEEP is canon and unspecified." },
  ]},

  { g: "OPERATING INSTRUCTIONS", at: "6-3 … 6-29 · Table 6-1 · Figure 6-2 · Appendix D", rows: [
    { k: "Doors", v: "Four, sorted by function over structure: ANSWERS · PROGRAMS · MESSAGES · SETTINGS.",
      src: ["BIBLE", "MAP3"], st: "CONTRADICTED", id: "A-11",
      alt: [{ v: "Three doors — ANSWERS · LINES · SPECIALIZED.", src: ["BIBLE"] }],
      note: "BOTH READINGS ARE IN THE SAME CANONICAL FILE. The later ruling wins by date and the earlier passage is not marked superseded, so a stranger reading the bible top to bottom meets the dead architecture first." },
    { k: "Menu size", v: "28 tables · 187 live rows. Rows are presented one at a time; brackets mark the current row; a passage row returns to the level above; a row appears when the instrument has cause.",
      src: ["MAP3", "M1", "AES"], st: "ASSERTED" },
    { k: "The ask cycle", v: "Seven states — redirect → ask → shake → reveal → hold → re-ask → exit.",
      src: ["ATL"], st: "ASSERTED" },
    { k: "Predictions", v: "Fortune — crack, slip, serial number, lucky numbers. Horoscope — the sign is the whole input; the operator's own chart appears if a date of birth is on file.",
      src: ["ATL", "M1"], st: "ASSERTED" },
    { k: "Probabilities", v: "Five — coin, number, card, dice, lottery. The card ceremony verifies 52, removes two jokers, shuffles three times and offers a cut behind a 15-second guard.",
      src: ["MAP3", "ATL"], st: "ASSERTED" },
    { k: "Advice", v: "Eight rows — Everyday · Career Chooser · Career Advice · Office Nickname · Water Cooler · Partners · Friends & Family · Inlaws and Outlaws. Behind code 411.",
      src: ["MAP3"], st: "ASSERTED" },
    { k: "Detectors", v: "Five — Bullshit · Stud · Trustworthy · Attractiveness · Spy [−07]. Behind code 7.",
      src: ["MAP3"], st: "CONTRADICTED", id: "A-4 (H-4)",
      alt: [{ v: "“Four detectors are provided.”", src: ["M1"] }],
      note: "Reconcilable — Spy is persona-gated — but not reconciled anywhere, and the manual does not say “four, plus one on certain units.”" },
    { k: "Diversions", v: "Seven — Tilt Drive · Gobble Don't Fall · AvoidSteroids · Snow Globe · Tic-Tac-Toe · Mail Run · Sniper [−07]. Plus a four-row Casino behind code 2121.",
      src: ["MAP3"], st: "CONTRADICTED", id: "A-5 (H-5)",
      alt: [{ v: "“Six diversions are installed.”", src: ["M1"] },
            { v: "“Five diversions are provided.”", src: ["M1"] }],
      note: "TWO DRAFTS OF THE SAME MANUAL DISAGREE WITH EACH OTHER AND BOTH DISAGREE WITH THE MACHINE. The AI-renamed-the-games egg makes the list DELIBERATELY unstable in fiction — that is a licence to differ from the spec, not a licence for the manual to differ from itself." },
    { k: "Ancillary programs", v: "Brain Training · Inkblots · ELIZ · Radio [−07] · Phone Tap [−07] · Excuses · Lines. Calculator and Notepad print “(not installed)” and go nowhere.",
      src: ["MAP3"], st: "ASSERTED" },
    { k: "Messages", v: "Three classes — Voice, Text, System. Unread is marked; delivery states are carried; runtime senders splice new rows in. The instrument is delivered with two items in its inbox: the Welcome and the Start Up Procedure.",
      src: ["MAP3", "ATL", "M1"], st: "ASSERTED" },
    { k: "Settings", v: "Preferences (User, Polarity, Clarity, mgkModel Classic/Large/Audio, Voice 00–10) · Codes (Code Runner, BIST, Userdata, Checksum) · User (Name, Security).",
      src: ["MAP3"], st: "ASSERTED" },
    { k: "Operator record", v: "The name is entered one character at a time on a ring, with delete and done. The date of birth is held as month and day. THE YEAR IS NOT REQUESTED.",
      src: ["M1"], st: "CONTRADICTED", id: "A-6 (H-6)",
      alt: [{ v: "The year IS entered, and no surface consumes it — which makes the manual's SECOND sentence (“No function of the instrument requires it”) the true one and its first the false one.", src: ["BIBLE"] }],
      note: "A DOCUMENTED CORRECTION THAT NEVER LANDED. The ledger records the manual as corrected in the same pass; the tree says otherwise, and the live tree wins." },
    { k: "Not fitted", v: "Uninstalled persona rows show a graceful PERSONA NOT INSTALLED card.",
      src: ["ATL", "BOM1"], st: "ASSERTED" },
    { k: "Scope of Section VI", v: "Eleven paragraph positions describe capability that ARRIVES LATER. Under the parcel law the day-one machine is NIAC, two toys and the inbox.",
      src: ["M1", "BOM1"], st: "CONTRADICTED", id: "A-16 · P9b",
      alt: [{ v: "Section VI shrinks to the day-one set and the rest moves to a supplement.", src: ["FIT"] }],
      note: "EITHER READING IS PERIOD-TRUE: catalogues described machines the buyer did not yet have, constantly, and the gap itself is already an egg. Raised 2026-07-24; untouched since." },
  ]},

  { g: "ACCESS CODES", at: "Appendix A · Table A-1 · A-3 · Figure A-1", rows: [
    { k: "In evidence", v: "411 Advice · 7 Detectors · 101–132 personas · 2121 Casino · bias 0000 … 1111 and 69 / 666 / 80085 / 1 / 123 · delivery state 2.",
      src: ["MAP3", "INV"], st: "ASSERTED" },
    { k: "Displayability doctrine", v: "A code, once accepted, is retained. A code may be accepted BEFORE its function exists and takes effect when the function arrives.",
      src: ["M1", "ATL"], st: "ASSERTED" },
    { k: "Which codes print", v: "—", src: [], st: "ABSENT", id: "D-15 · [PAPA] P7",
      note: "The codes exist; the decision about which of them the manual prints does not. Open since 2026-07-23." },
    { k: "The code landscape plate", v: "—", src: ["M1"], st: "ABSENT", id: "D-14",
      note: "Called “the single page of this manual most worth imaging first.” The art does not exist." },
  ]},

  { g: "ACCESSORIES AND OPTIONS", at: "1-11 · Table 12-1 · Table 12-2", rows: [
    { k: "The −07 kit", v: "Minox A with Easter-egg film · about 30 modified keys · a phone-tap suction cup · a Morse keyer · a fake mustache. And, across the line: loaded dice, period cigarettes, silver dollars, and Brownie Reflex / Bolex / Polaroid 80A leather cases.",
      src: ["INV", "BOM1"], st: "ASSERTED",
      note: "THE INFORMER'S KIT IS EFFECTIVELY PRE-AUTHORED. It is the only accessory set in the corpus with contents." },
    { k: "Every other unit's set", v: "—", src: [], st: "ABSENT", id: "D-4",
      note: "No accessory list exists for any unit except the Informer's, and that one is a dossier inventory rather than a packing list." },
    { k: "Optional equipment", v: "AM-FM antenna kit, Catalog No. 6710. The 2022 proto-manual carries a whole RADIONET section — an internal Silvertone antenna, “opportunistic local reception of AOL Standard Broadcast and FM”.",
      src: ["P22"], st: "CONTRADICTED", id: "A-14 (H-12)",
      alt: [{ v: "The live machine has a Radio PROGRAM gated to persona −07 — which is a program, not a receiver.", src: ["MAP3"] }],
      note: "Table 12-2 has a real catalog number for a part of a machine that may no longer exist." },
    { k: "Uncrating", v: "Unit · charging adapter · travel case · parts list and instructions · spare parts. “Do not connect this unit to a power outlet until all shipping items … have been removed.”",
      src: ["P22"], st: "ASSERTED" },
    { k: "Reshipment and storage", v: "—", src: [], st: "ABSENT", id: "D-7",
      note: "Both the 2022 proto-manual and the period military model have the position; both of ours are empty." },
  ]},

  { g: "MAINTENANCE AND TEST", at: "8-3 … 8-11 · Table 8-1/8-2 · 9-3 · 10-3 … 10-11", rows: [
    { k: "Preventive attentions", v: "Clean the glass dry. Keep the case closed. Exercise the instrument.",
      src: ["M1"], st: "ASSERTED" },
    { k: "The care ritual", v: "Enter the maintenance row, hold still, three clicks; condition recovers. THE MANUAL TEACHES IT.",
      src: ["HEALTH", "ATL"], st: "ASSERTED",
      note: "The single strongest tie between paper and machine anywhere in the corpus." },
    { k: "Reported conditions", v: "SYSTEM OK · UPTIME · PROCESSES · EFFICIENCY · RETRIES · RECOVERED n · AUDIO NOT DETECTED · CONNECTION STARTED … CLOSED.",
      src: ["ATL", "M1"], st: "ASSERTED" },
    { k: "Trouble chart", v: "Nine entries — does not start · faint display · determination does not change · same determination twice · moving text on the upper display · menu row absent · answers without a question · brief interruption then normal · enunciator silent.",
      src: ["M1"], st: "ASSERTED", note: "Nine rows exist and the table wants about twelve. Whether the three known open defects become rows is a decision the structure forces — a period trouble chart is exactly where a maker put the things it had decided not to fix." },
    { k: "Code utilities", v: "Four — Code Runner · BIST · Userdata · Checksum. BIST exercises displays, inputs, enunciator and lamp and reports per stage; the checksum is computed over fitted content.",
      src: ["MAP3", "M1"], st: "ASSERTED", note: "The BIST text is the manual's own and is unverified against anything." },
    { k: "SCAT", v: "System Configuration and Test.",
      src: ["P22"], st: "ABSENT", id: "C-2 · D-20",
      note: "A heading in the 2022 proto-manual with nothing under it. Position 10-11 exists because the NAME does. Nobody has ever said what SCAT is or how it differs from BIST — four years." },
    { k: "AMMMS", v: "Named in the 2024 instruction manual beside BIST as maintenance messaging.",
      src: ["INV"], st: "ABSENT", id: "C-1 · D-19",
      note: "Never expanded, never defined, never mentioned again. Appendix G prints [ EXPANSION REQUIRED ] beside it." },
  ]},

  { g: "SERVICE, PARTS AND WARRANTY", at: "11-1 · 11-7 · Table 11-1 · Table H-1 · CERTIFICATION leaf", rows: [
    { k: "Service address", v: "—", src: [], st: "ABSENT", id: "D-12 · [PAPA] P8",
      note: "An address and a telephone exchange. Called “one of the strongest period details available anywhere in this document”, and still unwritten." },
    { k: "Warranty", v: "—", src: [], st: "ABSENT", id: "D-13",
      note: "The warranty voice. The real-world commitment behind it is canon and is the strongest thing available to write from: every unit guaranteed for the lifetime of Weird.Baby, never expiring unless we do." },
    { k: "Replaceable parts", v: "—", src: [], st: "ABSENT", id: "D-11",
      note: "Nothing exists and nothing is planned. Every model of the period ends with a parts list; ours ends with an empty table." },
    { k: "Certification leaf", v: "—", src: [], st: "ABSENT", id: "D-1 · [PAPA] P1/P8",
      note: "The whole leaf. Every model of the period opens with it." },
    { k: "Service bulletins", v: "The phrase “Affirmative (see service bulletin 7)” is proposed.",
      src: ["BOM1"], st: "ABSENT", id: "C-7",
      note: "A service bulletin is a PUBLICATION, and Table 1-2 is where a publication is declared to exist. No bulletin exists, no numbering scheme exists, and the manual would be the document that invents both." },
  ]},

  { g: "PUBLICATIONS AND VOCABULARY", at: "1-15 · Table 1-2 · Appendix F · Appendix G", rows: [
    { k: "Related publications", v: "The 2022 proto-manual · the 2024 instruction manual · the Silvertone donor leaflet the first was built over · this document.",
      src: ["INV", "P22"], st: "CONTRADICTED", id: "§5.1",
      alt: [{ v: "A period Table 1-2 lists publications the READER may order; ours is a stratigraphy of drafts by the same author, and two of the three contradict this one.", src: ["FIT"] }],
      note: "The position is real; the material is the wrong kind." },
    { k: "Glossary", v: "35 terms collected, every one attested.",
      src: ["INV", "M1", "AES", "MAP3"], st: "ABSENT", id: "D-18",
      note: "35 terms, 35 empty meanings. The term list fits; not one definition exists." },
    { k: "Abbreviations", v: "21 collected. Nineteen expand from the record.",
      src: ["INV", "P22"], st: "ABSENT", id: "D-19",
      note: "AMMMS and PHVDC do not expand, and both are used as if they do." },
    { k: "“Determination”", v: "The manual's own word for the machine's output, used throughout and in its glossary.",
      src: ["M1"], st: "CONTRADICTED", id: "C-9",
      alt: [{ v: "The word appears in NO SOURCE before the manual's own generator — it is a coined term, which the drafting law reserves to Mike.", src: ["HOLES"] }],
      note: "It is a good word and it may well be the right one. Glossary row 1 is where that gets noticed." },
    { k: "Document register", v: "Class B — the in-house, contractor and government report. TYPED on an office machine, reproduced by offset or copier. Elite, 12 characters an inch × 6 lines an inch, a 78-column measure, left margin stop at 1.10 in. Ragged right. Sideheads in capitals, flush left, UNDERSCORED. No bold — emphasis is overstrike. Rules are typed hyphens; verticals are omitted or ruled by hand.",
      src: ["TYPED"], st: "ASSERTED",
      note: "Mike's ruling: THIS WAS MADE ON A TYPEWRITER BY ENGINEERING — not typeset, not laid out, not designed. The three period instrument manuals the STRUCTURE was borrowed from are all typeset and are the wrong production class; the document that proves Class B is MIT Instrumentation Laboratory report R-477, September 1965. This sheet is set in that register." },
  ]},

  ],
};

export const MAINFRAME = {
  title: "MGK-NIAC",
  sub: "BUILT AS MGK-NIAC · SOLD AS MGK-VIII",
  maker: "CONCEIVED: ARMY SECURITY AGENCY · FABRICATED: CSAW · SOLD: ABEAL",
  pub: "NO PUBLICATION ON FILE",
  groups: [
  { g: "IDENTIFICATION AND HISTORY", at: "1-3 · N-5 (the structure has no history section)", rows: [
    { k: "Name", v: "Built as MGK-NIAC, sold as MGK-VIII. Mike's own name for the object is “Magic 8”, short for Magic 8 Ball.",
      src: ["GLASS", "LIN"], st: "ASSERTED" },
    { k: "Conception", v: "1943–44. Carter Bookman of the Army Security Agency conceptualises Mainframe Generated Knowledge: where ENIGMA deciphers MESSAGES, MGK-NIAC deciphers LIFE. Funded 1944, source unknown, probably internal.",
      src: ["INV"], st: "ASSERTED",
      note: "The name is load-bearing: Carter Bookman = Albert C. Carter + Abe Bookman, the real Magic 8 Ball inventors, whose company Alabe Crafts becomes ABEAL." },
    { k: "Fabrication", v: "The blackbox is designed and fabricated by CSAW — Communications Supplementary Activity, Washington — deliberately shielded from knowing what the device really is.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Testing", v: "1945. Testing works; Prediction Response Curve Biasing is optimised. An immediate STOP WORK order halts the project the same year — the threat landscape changed. 1946: mothballed and archived by CSAW.",
      src: ["INV"], st: "ASSERTED",
      note: "The Magic 8 Ball ships in 1946, the mothball year." },
    { k: "Disposal", v: "1964. The assets vanish from archive; an in-fiction footnote suspects the “found in a scrap lot” story is fabricated. ScrapCo buys MGK-NIAC at a government scrap auction — disassembled hardware, the OS, the procurement spec, design notes, test software (which by necessity contains the full custom libraries for every future VIIIp), and preliminary ad layouts.",
      src: ["INV"], st: "ASSERTED" },
    { k: "Compile date", v: "1945. The engine's answer table is the pure 1946 Magic 8-Ball twenty.",
      src: ["INV"], st: "ASSERTED" },
  ]},
  { g: "SPECIFICATION AS PRINTED TODAY", at: "the museum's own MGK-NIAC Technical Specifications face, nine rows", rows: [
    { k: "MATRIX", v: "8 × 16 — seven rows visible, the eighth wired, driven and behind something.", src: ["GLASS"], st: "ASSERTED" },
    { k: "BAR", v: "1 × 64, addressed as a single chain.", src: ["GLASS"], st: "ASSERTED" },
    { k: "OUTPUTS", v: "2 matrix chains · 2 bar chains · 3 servos.", src: ["GLASS"], st: "ASSERTED" },
    { k: "DECLARED", v: "Five rules.", src: ["GLASS"], st: "ASSERTED" },
    { k: "RULE 1", v: "A numerical envelope.", src: ["GLASS"], st: "ASSERTED" },
    { k: "RULE 2", v: "A ceiling of eight core states.", src: ["GLASS"], st: "ASSERTED" },
    { k: "RULE 3", v: "Mutual exclusion.", src: ["GLASS"], st: "ASSERTED" },
    { k: "RULE 4", v: "A reveal no faster than twelve seconds.", src: ["GLASS"], st: "ASSERTED" },
    { k: "RULE 5", v: "No adaptive learning — the machine is forbidden, in writing, from getting to know you.",
      src: ["GLASS"], st: "ASSERTED",
      note: "The strongest single line on either spec face and the one that most reads as 1965." },
  ]},
  { g: "WHAT THE FACE LOST AND HAS NOT REGAINED", at: "register N-g", rows: [
    { k: "Struck at N2", v: "BOARD (a part number of the 2026 revival) · PROGRAM (a version, a calendar date and a count of lines of source) · STATUS (a workshop validation state) · BENCH (eight sketches, January 2026) · LAMPS (struck WHOLE, because its 32-flash cap is a limit of a bench BOARD and a row keeping the number while dropping the caveat is how a spec sheet starts lying) · the source-file half of DECLARED.",
      src: ["GLASS"], st: "ASSERTED",
      note: "Every one was true, verifiable, and about the wrong machine. NOTHING WAS WRITTEN TO REPLACE THEM — that is what this sheet is for." },
    { k: "The builder's own line", v: "“If I make too bright at once the Nano will shut down.”",
      src: ["GLASS"], st: "ASSERTED",
      note: "A real quotation and the best sentence on the old face, with no row on a spec sheet to live in. Named at register N-b rather than lost." },
    { k: "Physical data", v: "—", src: [], st: "ABSENT",
      note: "As with the portable: nobody has measured the cabinet." },
  ]},
  { g: "THE OPERATOR", at: "held — printed nowhere", rows: [
    { k: "The robot", v: "NIAC is so complicated they needed a ROBOT to operate it. Camera-body head, brass tee shoulders, conduit limbs. The robot stays out of frame until deliberately spent.",
      src: ["BIBLE", "GLASS"], st: "ASSERTED",
      note: "CANON, HELD, AND PRINTED ON NO PAGE IN EITHER REPOSITORY — the reveal ledger's row is its only written form. Its material was seven plates in the museum until 2026-08-07, when Mike killed them; three survive upstream (the eye, the shoulder, the hand on the control) and are regenerable from the 2021 build video." },
  ]},
  ],
};

/* ── THE ADJACENTS ─────────────────────────────────────────────────────────
   Mike asked for the technical data AND ITS ADJACENTS. These are the things a
   spec row rests on and would be wrong without: the layer law that says what
   the machine may ever be, the two provenance stories, the frame fiction, and
   the constraints the whole design is written against.                       */
export const ADJACENTS = [
  { g: "THE THREE LAYERS — structural law, and it governs every word written into the machine",
    lines: [
      "DOWNSTAIRS — HONEST MACHINERY. The machine has NO self-awareness and never convincingly pretends otherwise. It performs calculations against prescribed probability models. It does not think. Ever.",
      "IN BETWEEN — STAGED THEATER. Personalities are OBVIOUSLY staged, 1965-style: “IT TALKS!”, “REAL LIGHTS!” Window dressing proudly worn, seams visible, period-honest. Acts, not minds. Committed, in-character, nobody home.",
      "UPSTAIRS — THE UNKNOWN WIRE. The machine connects to servers that appear fully autonomous per the manual — scheduled syncs, batch filings, service routines running on sixty years of momentum. WHO OR WHAT is on the other end is DELIBERATELY UNANSWERED. Canon never confirms autonomy and never denies presence. Writing discipline: passive voice, procedural language, no signatures.",
    ], src: ["ARC"] },
  { g: "THE PERSISTENCE CONCEIT — why a spec row about storage is two rows",
    lines: [
      "REAL WORLD: the machine has true persistence. Static RAM enables genuine state saves and record keeping.",
      "FICTION WORLD: the server is COMPLETELY VIRTUAL, simulated as if the 1965 infrastructure still runs. Downloads, syncs, filings and feature arrivals are theater performed by the machine itself, attributing its real local memory to the wire.",
      "NO FEATURE MAY EVER ACTUALLY DEPEND ON CONNECTIVITY. Feature revelation IS a simulated data download: capability ARRIVES as transmission, and state resumes “as last left on the server.”",
    ], src: ["ARC"] },
  { g: "THE FRAME FICTION — what the website is, as against what the device is",
    lines: [
      "DEVICE SIDE = the previous owner's story, discovered in-unit.",
      "WEBSITE SIDE = the recovery team's story — dossiers from the server break-in: who the owners were, capture planning, what happened after. Units were used for good, for bad, and for good-that-turned-out-bad.",
      "THE TWO TELLINGS NEED NOT AGREE. The unreliable record now operates at story scale.",
      "The public twin presents as a black-and-white security-monitor feed: someone hacked back to the source servers where every personality was last backed up, and the viewer watches that excavation relayed through a camera pointed at running equipment. Data resolves as more is excavated; control of the camera is eventually gained.",
      "NOBODY IS AT HEADQUARTERS. The system runs autonomously — always has, always will. That does not preclude someone else having hacked in exactly as we did, and perhaps stalling because THEY DIDN'T HAVE THE UNITS. The other presence is a rival excavator, not an operator.",
    ], src: ["ARC"] },
  { g: "MANUAL PROVENANCE — canon, and it is the reason the margins matter",
    lines: [
      "The manuals are SCANS of the original printed documents — shipped 1965, recovered in the roundup, scanned into the servers during cataloging.",
      "Hence electronic manuals bearing handwritten notes by technicians and original owners; hence how we obtained them and how we deliver them.",
      "THE MARGINS ARE RECOVERED EVIDENCE.",
      "AND THE STORY REACHES THE READER THROUGH THEM, not through the manual's body: an operating and maintenance manual is structurally hostile to sixty years of fiction, and the only precedent in our own record is the 2022 “Background” one-liner. That is either the point or the problem, and it is the one question the fit test says cannot be answered by looking at more sources.",
    ], src: ["ARC", "FIT"] },
  { g: "THE GAP — 1965 to 2024, and the two versions of it",
    lines: [
      "PRIMARY: asset transfers UNKNOWN. At some point the units pass through WHITE OPS, a myth-grade procurement agency “older than talk of Wizards and Warlocks”, reachable only via the Grey Web, grandfather of all artifact-hunting agencies.",
      "ALTERNATE (a marketing draft): the units are confiscated by the government, warehoused sixty years, moved every five or six years, lost when a postal truck sinks into the Hudson, and secretly recovered by divers.",
      "2023–24: Weird.Baby — Purveyors of the Weird, an artifact restoration house — receives three anonymous crates on 1 January, note signed “-W.O.” Contents: MGK-VIIIp-01 The Everyman, -02 The Informer, -03 The CEO, plus a jumble of period stuff — spy tools, exec tools, defunct PHVDC chargers, framed retro-fitted One-Page-Ads.",
      "THE AI ANGLE: “Weird Baby” is also the name of the machine's archaic self-aware AI, accidentally connected to the internet in transit, which now self-updates its own specs and renames its games “to confound users.”",
    ], src: ["INV"] },
  { g: "CONSTRAINTS THE WHOLE DESIGN IS WRITTEN AGAINST",
    lines: [
      "TEXT IS NEARLY FREE; VOICE IS THE BUDGET. Flash holds dozens of personas; 255 files per folder is the real wall. Write wide; voice deliberately.",
      "THE LIFETIME GUARANTEE: every unit guaranteed for the lifetime of Weird.Baby — never expires unless we do.",
      "THE B+ DOCTRINE: “This is not a museum-quality restoration.” The A costs three times the B+ and the A+ ten times. Self-satisfying, somewhat contained, shipped.",
      "THE NEVER-ADVERTISED LAW: the chapters are not the reason to own the device and are never pitched. The device earns its keep as a genuinely fun useless thing. Discovery of the story's EXISTENCE is part of the story.",
      "THE DRAFTING LAW: assembled from established canon ONLY — no coined catchphrases, signatures, gags or terminology. All flavour is Mike's.",
    ], src: ["ARC", "HOLES"] },
];

/* ── THE DECISIONS THE SHEET FORCES ────────────────────────────────────────
   Not a to-do list. These are the places where WRITING A ROW IS TAKING A
   DECISION, gathered so that a dictation pass knows when it is doing that.  */
export const FORCED = [
  { q: "Does the manual print one lamp or two?", w: "The manual says one; the firmware says two; the fit table gave it to the firmware. Doctrine 18 says a real board is not evidence about a 1965 machine, which reverses that. Nothing has been changed in the robots repo on Ops' word.", id: "A-2 · N-i" },
  { q: "Where does the Answer Engine live?", w: "Self-contained, or cloud-linked. The contradiction may be LOAD-BEARING — the listening-assistant egg is built on it. 7-3 and 7-5 both wait on the answer.", id: "A-7 · ledger #9" },
  { q: "Which glass wakes first?", w: "Canon says the front; the machine races. Paragraph 5-1 must say one thing.", id: "A-3" },
  { q: "What does the machine run on?", w: "PHVDC, TAC, or the USB the object actually charges over. Three paragraphs wait on one answer.", id: "A-13 · ledger #8" },
  { q: "Six polarity settings or five?", w: "The naming is ruled (Neutral). The cardinality is not, and Table B-1 has to print a row count.", id: "A-12 · ledger #7" },
  { q: "Does the manual reproduce the ▓▓▓ redaction?", w: "The source censors the inclination passcodes. Reproducing a censor bar is a strong period move and it is a choice.", id: "D-16" },
  { q: "Which access codes print?", w: "Open since 2026-07-23.", id: "D-15 · [PAPA] P7" },
  { q: "Does Section VI describe the machine as sold, or as it becomes?", w: "Under the parcel law the day-one machine is NIAC, two toys and the inbox; Section VI has eleven positions describing later capability. Period catalogues did this constantly and the gap is already an egg.", id: "A-16" },
  { q: "Does the story appear in the manual at all?", w: "An OMI is structurally hostile to sixty years of fiction. If the story is meant to reach the reader HERE, the document type is wrong — the margins, the messages and the Record are the routes that exist.", id: "§5.3" },
  { q: "Is Appendix D sixty rows or a hundred and eighty-seven?", w: "It changes what kind of document this is. 187 rows is five pages and larger than Sections I through IV combined.", id: "§5.2" },
  { q: "Do the known open defects become trouble-chart rows?", w: "The start race, the three-round spinner, the double ceremony. A period trouble chart is exactly where a maker put the things it had decided not to fix.", id: "D.7" },
  { q: "Who takes the measurements?", w: "Mass, dimensions, charge time, run time, temperature, humidity. NOT authoring gaps — nobody has measured the object. The manual has said so in its own text since 2026-08-02.", id: "D-5 · D-6" },
];
