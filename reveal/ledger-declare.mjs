#!/usr/bin/env node
/* ===========================================================================
   THE REVEAL LEDGER — the authored source. Writes reveal/ledger.json.
   ---------------------------------------------------------------------------
   MIKE (R1/R2, 2026-08-05): "walk BOTH repos and catalogue EVERY asset and
   feature in the production … then THE TABLE, as DATA not code — one source
   holding every row plus the scheduling the story needs: reveal state, the
   story day or week it becomes available, dependencies, the REVEAL ARC field
   already ruled, and notes. Nothing in a page hard-codes availability;
   surfaces read the table."

   WHY THIS FILE AND NOT THE JSON. Same pattern as provenance/assets-declare.mjs:
   the JSON is the artifact a page reads, this is the thing a person edits. A row
   here is four lines; the same row in JSON is fourteen, and a table nobody wants
   to open stops being maintained the week after it is built.

   ═══ HOW IT RELATES TO THE ASSET TABLE, WHICH IS NOT A RIVAL ════════════════
   `provenance/asset-table.json` is ONE ROW PER FILE and answers: what is this
   file, what depends on it, is it any good, has Mike passed it. It stays the
   authority on files and this ledger never restates a byte count, a dimension,
   a quality read or a verdict.

   THIS is ONE ROW PER REVEALABLE THING and answers: can a visitor get to it,
   should they be able to yet, and what has to happen first. Most rows here are
   not files at all — a function, an app, a menu row, a state, a decision.

   THEY JOIN THROUGH `assets: [uid]`, and the join is only survivable because of
   [C32] in the same round: the asset table used to be keyed by PATH, so a rename
   would have silently pointed every reference here at nothing. `uid` is minted
   once and never rewritten. `resolve()` below turns a public ref into a uid at
   build time and FAILS if the file is not in the asset table — so a ledger row
   cannot quietly reference a picture the museum does not hold.

   ═══ THE FIELDS ════════════════════════════════════════════════════════════
     id      stable slug. Never reused, never renamed — pages key off it.
     name    one line: what it is.
     cls     document · machine · app · game · surface · artifact · egg · prop
             · sound · commerce · tool
     where   repo-relative path, or a route, or the physical world.
     build   LIVE · PARTIAL · STUB · NOT_BUILT — what is TRUE TODAY.
     reach   how a visitor reaches it today, in one phrase. null = they cannot.
     state   HELD · REVEALED · RETIRED. Reveal state, which is NOT `build`:
             a thing can be finished and held, and a thing can be reachable and
             half-built. REVEALED means a visitor can get to it now.
     when    the story day or week it becomes available. NULL ON EVERY ROW
             TODAY, and that is Doctrine 12, not an oversight: nobody has
             supplied a schedule, so nothing here invents one. The field exists
             so the day Mike gives one it is a field and not a rebuild.
     deps    what has to happen first — another row's id, a unit's arrival, a
             photograph, a password, a ruling. Free text where it is not an id.
     arc     THE REVEAL ARC, Mike's ruling of 2026-08-04, already carried on
             the asset table: arrived · understood · partial · online · null.
             `null` is UNSET and is not a stage.
     shown   TRUE when a VISITOR CAN SEE THE LABEL of a thing that is not
             built — an engraved drum position that will not arm, a register row
             printed NOT BUILT, a document a face names and does not hold. It is
             what separates a PROMISE from a private gap, and it is a judgement
             per row rather than something the fields above can derive: the
             twin's stub rows are NOT_BUILT and NOT shown, because THE STUB LAW
             strips them from the menus — "a row that leads to 'not built' is
             not a destination, it is a promise, and the menu is not the place to
             keep promises."
     assets  public refs, resolved to asset-table uids at build time.
     note    anything a reader needs and the fields above cannot hold.

   ═══ WHAT IT CANNOT DO, stated here so nobody has to discover it ═══════════
   It cannot verify that `build` is true — that is a person looking, the same
   hole `provenance/README.md` §4 states about every judged field. It records
   what Ops read off the code on the day of the walk. `reach` is the field most
   likely to rot, because a route change makes it wrong without touching it.
   And a row that is missing entirely is invisible: this is a catalogue, and a
   catalogue's failure mode is silence, not error.

     node reveal/ledger-declare.mjs --write
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..");
const TABLE = path.join(REPO, "provenance", "asset-table.json");

const table = JSON.parse(fs.readFileSync(TABLE, "utf8"));
const byRef = new Map(table.entries.filter(e => e.ref).map(e => [e.ref, e]));
const byPath = new Map(table.entries.map(e => [e.repo + ":" + e.path, e]));

let unresolved = [];
function resolve(refs) {
  return (refs || []).map(r => {
    const e = byRef.get(r) || byPath.get(r);
    if (!e) { unresolved.push(r); return null; }
    return e.uid;
  }).filter(Boolean);
}

const ROWS = [];
/* R(id, name, cls, where, build, reach, state, extra) */
function R(id, name, cls, where, build, reach, state, extra = {}) {
  ROWS.push({
    id, name, cls, where, build, reach, state,
    when: extra.when ?? null,
    deps: extra.deps || [],
    arc: extra.arc ?? null,
    shown: extra.shown === true,
    assets: resolve(extra.assets),
    note: extra.note || "",
  });
}

/* ═════════ 1. MUSEUM SURFACES — the routes, from src/App.jsx ══════════════ */
R("route.lobby", "The Lobby — the museum's front page and the guest book.",
  "surface", "/", "LIVE", "the front door", "REVEALED",
  { assets: ["/WeirdBaby_PhotoID.png"] });
R("route.booth", "The Information Booth — what this place is, in its own words.",
  "surface", "/booth", "LIVE", "linked from the directory", "REVEALED",
  { note: "Carries no image by ruling — M23a, the Visual Hook Law's first recorded exception." });
R("route.foundation", "The Weird.Baby Foundation — where the money goes.",
  "surface", "/foundation", "LIVE", "linked from the directory", "REVEALED",
  { note: "Its LIVE / NOT BUILT column is the first surface wired to this ledger — see reveal.channel.*." });
R("route.shop", "The Gift Shop — the house's own shelf plus each artist's own store.",
  "surface", "/shop", "LIVE", "linked from the directory", "REVEALED",
  { assets: ["/images/wb-merch/sticker.png"] });
R("route.robots", "The Robots wing — the machines, their archive and the Portal.",
  "surface", "/robots", "LIVE", "linked from the directory", "REVEALED");
R("route.wal", "Worth A Listen — four artists the house wants heard.",
  "surface", "/wal", "LIVE", "linked from the directory", "REVEALED");
R("route.wb", "Weird.Baby Music — the house's own record.",
  "surface", "/wb", "LIVE", "linked from the directory", "REVEALED",
  { assets: ["/images/wb/vol1_cover_v1.png"] });
R("route.hr", "The Hunter Root reference wing — 8 albums, 93 tracks, the deepest thing in the museum about any artist.",
  "surface", "/hr", "PARTIAL", "by URL only — deliberately unlisted", "HELD",
  { note: "HELD PERMANENTLY BY RULING (ASSET_REVEAL_CHECKLIST §E): reachable, never listed. PARTIAL because the deck's journal tab is dead machinery (M17) and the page is one exhibit plus an unlinked discography." });
R("route.hr.archive", "The Hunter Root discography — the archive route.",
  "surface", "/hr/archive", "LIVE", "by URL only — nothing links to it", "HELD");
R("route.admin", "The admin dashboard — visits, the guest book, page breakdown.",
  "surface", "/admin", "PARTIAL", "by URL only", "HELD",
  { deps: ["C33 — exclude the house's own hits, a return-visitor signal, a week of logbook"],
    note: "Not linked from anywhere. The return-visitor signal is constrained by /booth's privacy answer." });
R("route.preset", "Preset landing — a shared exhibit state, by short id.",
  "surface", "/p/:id", "LIVE", "only by a link somebody was given", "REVEALED");
R("route.catchall", "The catch-all — every unmatched address renders the Lobby where it stands.",
  "surface", "src/App.jsx path=\"*\"", "LIVE", "by mistyping anything", "REVEALED");
R("route.money", "The /money redirect — the Foundation's retired address.",
  "surface", "/money", "LIVE", "an old link", "REVEALED",
  { note: "Both names have been live URLs. A third rename re-points this, it does not add another." });

/* ═════════ 2. THE ROBOTS WING'S FACES — derived from src/data/artists/robots.js */
const FACE = (id, name, build, state, extra) =>
  R("face." + id, name, "surface", "src/data/artists/robots.js", build,
    state === "REVEALED" ? "a track on /robots" : null, state, extra);
FACE("wbr.about", "Welcome — the wing's orientation: what it holds and where to start.", "LIVE", "REVEALED");
FACE("wbr.faq", "FAQ — questions about Weird.Baby.", "LIVE", "REVEALED",
  { note: "Ships with no picture since the 31½ card was struck — M29." });
FACE("wbr.doc-control", "DOC CONTROL — the manuals, the originals, the files.", "LIVE", "REVEALED",
  { deps: ["doc.manual.plates"], note: "Three of its four rows describe things a visitor cannot reach — C31." });
FACE("wbr.contact", "Contact — the address and three reasons to write.", "LIVE", "REVEALED");
FACE("niac.name", "THE NAME — built as MGK-NIAC, sold as MGK-VIII.", "LIVE", "REVEALED",
  { assets: ["/robots/reference/mgk-viii/head_lens.jpg"], arc: "understood",
    note: "[Q3] The album took the first name on 2026-08-05; this face is where the two names are reconciled." });
FACE("niac.plates", "IMAGE ARCHIVE (MGK-NIAC) — eight details of a machine never shown whole, in two spreads.", "LIVE", "REVEALED",
  { arc: "arrived", note: "The newest spread is open paper; older spreads stow in a <details> that states its own count." });
FACE("niac.firmware", "TECHNICAL SPECIFICATIONS (MGK-NIAC) — what the machine is running.", "LIVE", "REVEALED",
  { assets: ["/robots/reference/mgk-viii/matrix_lit.jpg"] });
FACE("viiip.plates", "IMAGE ARCHIVE (MGK-VIIIp) — nine plates, as received.", "LIVE", "REVEALED",
  { arc: "arrived", note: "M7: three of the nine do not show what their captions say. M25: the tombstone says 'before power' and one plate is captioned as the firmware running." });
FACE("viiip.record", "THE RECORD — the weekly journal of the reverse-discovery.", "PARTIAL", "REVEALED",
  { deps: ["M18 — twenty-seven open questions", "M19 — what a record number means"],
    note: "Holds exactly ONE entry. The other ten were fiction and were deleted at v47. The container's pagination (C1), doors (C7) and epoch (C8) are built and unexercised." });
FACE("viiip.manual", "THE MANUAL — the 24-page 1965 operating and maintenance manual.", "PARTIAL", "REVEALED",
  { deps: ["doc.manual.plates"], assets: ["/robots/manual/working-copy-p1.png"],
    note: "`plates: []`. Its one image is a render where B8's own ruling requires a photograph of the print — M4." });
FACE("viiip.firmware", "TECHNICAL SPECIFICATIONS (MGK-VIIIp) — the machine's own mind, on file.", "LIVE", "REVEALED",
  { assets: ["/robots/reference/photos/front_screen.png"], arc: "online",
    note: "M2: that plate is mirror-reversed, and the whole photograph is flipped." });
FACE("viiip.portal", "THE PORTAL — the feed-control panel: drum, two bat switches, a rotary dial, a latch.", "LIVE", "REVEALED",
  { arc: "online", note: "The panel is the immersion's first step; the latch opens the twin." });
FACE("viiip.faq", "FAQ — questions about the machine.", "LIVE", "REVEALED");

/* ═════════ 3. THE PORTAL'S OWN CONTROLS — availability that already varies ═ */
R("portal.feed.standard", "FEED · STANDARD — the unit as it stands, at the opening prompt.",
  "machine", "src/data/artists/robots.js panel.drum", "LIVE", "roll the drum, throw the latch", "REVEALED",
  { arc: "online" });
for (const [slug, label, why] of [
  ["idling-updated", "IDLING, UPD", "no feed on file"],
  ["boot-playback", "BOOT PLAYBK", "no feed on file"],
  ["off-first-boot", "OFF · 1ST BOOT", "no feed on file"],
  ["last-state", "LAST STATE", "awaiting a privacy ruling — LAST STATE resumes across visits"],
  ["test-bench", "TEST BENCH", "workshop entry; no public feed"],
]) {
  R("portal.feed." + slug, `FEED · ${label} — engraved on the drum and inert.`,
    "machine", "src/data/artists/robots.js panel.drum", "NOT_BUILT", null, "HELD",
    { deps: [why], shown: true,
      note: "The panel says only 'This feed is not available.' — the internal reason came off the glass at v46/C1." });
}
R("portal.switch.maint", "AUTO MAINT — the C1 fortnight as an instrument. Thrown up, the latch goes dark.",
  "machine", "src/data/artists/robots.js panel.switches", "LIVE", "the panel", "REVEALED");
R("portal.switch.prompt", "AT PROMPT — the entry state as an instrument.",
  "machine", "src/data/artists/robots.js panel.switches", "LIVE", "the panel", "REVEALED");
R("portal.dial.live", "SOURCE · LIVE — the dial position that arms.",
  "machine", "src/data/artists/robots.js panel.dial", "LIVE", "the panel", "REVEALED");
R("portal.dial.seeded", "SOURCE · SEEDED — a seeded feed the lamps would read.",
  "machine", "src/data/artists/robots.js panel.dial", "NOT_BUILT", null, "HELD",
  { deps: ["a seeded feed on file"], shown: true });

/* ═════════ 4. THE TWIN — apps, from the DISPATCHER (Run_EXE), not the CSVs ══
   MIKE: "the DISPATCHER is truth — the CSVs have lied twice." Every row below
   is read off `Run_EXE`'s switch in tools/viiip_twin.html. A row is a STUB
   exactly when selecting it starts SCAFFOLD_PROC, which is the same predicate
   the twin's own STUB_ROWS table mirrors. The scaffold CSV called Fortune,
   Horoscope and the Advice family scaffold after all three were built. */
const TWIN = "weird-baby-robots/tools/viiip_twin.html";
const APP = (id, name, build, extra = {}) =>
  R("twin.app." + id, name, "app", TWIN, build,
    build === "STUB" ? null : "inside the twin, behind the Portal's latch",
    build === "STUB" ? "HELD" : "REVEALED", extra);

APP("answers", "ASK MGK — the answer engine. The thing the machine is for.", "LIVE", { arc: "online" });
APP("polarity", "Polarity — how positive or negative the machine is willing to be.", "LIVE");
APP("clarity", "Clarity — how plainly it will say it, down to Offensive.", "LIVE");
APP("messages", "The inbox — voice, text and system messages, list → open → read.", "PARTIAL",
  { deps: ["message wording is parked ([PAPA])"],
    note: "Delivery is built; eleven rows carry WORDS PARKED. One row is a tombstone for a message Mike killed." });
APP("probabilities", "Probabilities — Coin Flip, Pick a number, Pick a card, Roll Dice, Lottery Numbers.", "LIVE");
APP("detectors", "Detectors — Bullshit, Stud, Trustworthy, Attractiveness. One needle, four verdict tables.", "LIVE",
  { note: "The Bullshit Detector is the only feature that makes the microphone real." });
APP("advice.panel", "Advice rows 0–2 — Everyday, Career Chooser, Career Advice.", "LIVE");
APP("advice.rest", "Advice rows 3–7 — Office Nickname, Water Cooler, Partners, Friends & Family, Inlaws and Outlaws.", "STUB",
  { deps: ["a vulgar-mode ruling against the Clarity registers (Office Nickname)", "content nobody has authored (the rest)"],
    note: "Stripped from the menu by THE STUB LAW — a row that leads to 'not built' is a promise, and the menu is not where promises are kept." });
APP("appp", "The app-pattern engine — Excuses and Lines.", "LIVE");
APP("radio", "Radio [−07].", "LIVE");
APP("eliza", "Eliza [PSYCH −02].", "LIVE");
APP("brain", "Brain [PSYCH −02].", "LIVE");
APP("ink", "Ink blot [PSYCH −02].", "LIVE");
APP("tap", "Phone Tap [−07].", "LIVE");
APP("maint", "Maintenance — the care ritual.", "LIVE");
APP("calc", "Calculator — and the 80085/07734 egg class is the reason it exists.", "LIVE",
  { deps: ["egg.calculator"] });
APP("note", "Notepad.", "LIVE");
APP("fortune", "Fortune — 40 fortunes across 5 registers.", "LIVE");
APP("horoscope", "Horoscope — sign chosen by menu every use, sticky to last used.", "LIVE",
  { deps: ["egg.name"] });
APP("predictions.rest", "Predictions rows 2+ — beyond Fortune and Horoscope.", "STUB", { deps: ["content"] });
APP("bs", "The BS process [B4].", "LIVE");
APP("voice", "Voice — eleven slots; one line sets the current one.", "PARTIAL",
  { note: "The twin sets a slot; the firmware hardcodes 8 and per-engine voices override it (spec s3)." });
APP("user.name", "Preferences › User › Name — the user station: name and birthdate, spelled on a letter ring.", "LIVE",
  { note: "THE ABSENT-NAME LAW: with no name on file every user-reference surface says <NO USER NAME>." });
APP("user.security", "Preferences › User › Security — passcodes exist and are checked nowhere.", "STUB",
  { deps: ["a ruling on what a passcode gates"],
    note: "READ/RUN passcodes ride all 175 menu rows and are checked nowhere." });
APP("codes", "Codes — Code Runner, BIST, Userdata, Checksum. All four scaffold.", "STUB",
  { deps: ["content and a design ruling"],
    note: "The faux-assembly scroller Code Runner would surface already exists and runs in SYSTEM_MONITOR." });
APP("mgkmodel", "MGK Model — Classic, Large, Audio. Three output personalities.", "STUB",
  { deps: ["a design ruling on what the three modes ARE"] });

/* ═════════ 5. THE TWIN'S GAMES — twelve, all with a Game_Init branch ═══════ */
for (const [slug, name] of [
  ["tilt-drive", "Tilt Drive"], ["gobble", "Gobble"],
  ["avoidsteroids", "AvoidSteroids — revived from 346 commented-out lines"],
  ["snowglobe", "Snow Globe — the one game redirected to the FLUIDIC display"],
  ["tictactoe", "Tic Tac Toe — the panel-dance seed"],
  ["slots", "Slots"], ["craps", "Craps"], ["blackjack", "Blackjack"],
  ["roulette", "Roulette"], ["mailrun", "Mail Run"], ["sniper", "Sniper [−07]"],
  ["stopnum", "Stop On A Number"],
]) {
  R("twin.game." + slug, name, "game", TWIN, "LIVE",
    "the GAMES menu inside the twin", "REVEALED",
    { note: slug === "snowglobe" ? "Reads as a first cut — drift/settle, snow density and shake response all want work (robots R7)."
      : slug === "stopnum" ? "Its config page uses the old bracket-hint grammar rather than PanelG — the walk-seven gap stands."
      : "" });
}
R("twin.games.unit", "The games on the ACTUAL UNIT.", "game", "MGK-VIIIp firmware", "NOT_BUILT", null, "HELD",
  { note: "TWIN DELTA, marked in the dispatcher: the firmware has no handler, so clicking a game does nothing on the machine today." });

/* ═════════ 6. THE TWIN'S OWN SURFACES ════════════════════════════════════ */
R("twin.boot", "The boot sequence — chatter, modem screech, the monitor windows.",
  "machine", TWIN, "LIVE", "power the twin on", "REVEALED", { arc: "online" });
R("twin.monitor", "SYSTEM MONITOR — the top screen, and the faux-assembly scroller.",
  "machine", TWIN, "LIVE", "the top screen", "REVEALED");
R("twin.parcels", "The parcels — in-machine deliveries that unlock menu rows.",
  "machine", TWIN, "LIVE", "arrive over time, unannounced", "REVEALED",
  { note: "Discovery is already how this works." });
R("twin.userrecord", "The user record / house register — the privacy doctrine as a machine surface, 5 pages, amend and purge.",
  "machine", TWIN, "LIVE", "inside the twin", "REVEALED",
  { deps: ["[PAPA] legends"] });
R("twin.scaffold", "The honest scaffold screen — says what a row WILL be and admits it is a stub.",
  "machine", TWIN, "LIVE", "dev only: 'Show stubs' puts the stub rows back", "HELD",
  { note: "Stub rows are stripped from the menus in the shipped walk, so a visitor never reaches this screen." });

/* ═════════ 7. THE DOCUMENTS ══════════════════════════════════════════════ */
R("doc.manual", "The Manual — 24-page 1965 operating & maintenance manual, ABEAL / a division of ScrapCo.",
  "document", "weird-baby-robots/robots/mgk-viiip/manual", "LIVE",
  "a track on /robots", "REVEALED",
  { note: "PDF plus 24 rasters from one source; 22 sections, 5 [ART REQUIRED] frames, 9 [PAPA] slots." });
R("doc.manual.plates", "The Manual's microfiche plates — the photographed pages.",
  "document", "src/data/artists/robots.js face.plates", "NOT_BUILT", null, "HELD",
  { deps: ["Mike's camera — P2; ≥2400px long edge, whole page including margins, reel order = reading order"],
    shown: true, note: "DOC CONTROL and The Manual's own face both name them." });
R("doc.record", "The Record — the weekly journal of the reverse-discovery.",
  "document", "src/routes/exhibit/RecordEntry.jsx", "PARTIAL", "a track on /robots", "REVEALED",
  { deps: ["M18", "M19"], note: "ONE entry. The 436-record count that used to sit here was invented and is gone." });
R("doc.record.evidence", "The Record's evidence, photographed. `.vp-fe-plate` is built and empty.",
  "document", "src/routes/exhibit/RecordEntry.jsx", "NOT_BUILT", null, "HELD",
  { deps: ["Mike's camera — P1"] });
R("doc.firmware", "The firmware — two source trees, checked in.",
  "document", "weird-baby-robots/robots/mgk-viiip/sources", "LIVE",
  "named on a face; not readable from the glass", "REVEALED",
  { note: "Honestly v1: names and form only. No reading of the source is on file." });
R("doc.ads", "One Page Ads — period advertising plates.", "document", "—", "NOT_BUILT", null, "HELD",
  { deps: ["art", "the viewer standard's plate idiom"] });
R("doc.factlist", "Fact List — a dynamic peephole, one fact at a time, no library.",
  "document", "—", "NOT_BUILT", null, "HELD",
  { deps: ["the Stage's peephole kind"], note: "Its whole character is DISCOVERED." });
R("doc.summary", "Summary — the current state of the whole story, one page.",
  "document", "—", "NOT_BUILT", null, "HELD", { deps: ["the arc existing at all"] });
R("doc.charter", "THE_CHARTER.md — still DRAFT v0.3, not published.",
  "document", "docs/", "PARTIAL", null, "HELD", { deps: ["M12 — Mike"] });
R("doc.credo", "The Billionaire's Credo — unwritten; /foundation Q10 carries a [PAPA] and the scrubber drops it.",
  "document", "src/routes/Foundation.jsx", "NOT_BUILT", null, "HELD", { deps: ["M13 — Mike's words"] });

/* ═════════ 8. THE ARTIFACTS AND THE PHYSICAL WORLD ═══════════════════════ */
R("phys.units", "The physical MGK units — the actual machines, in a room.",
  "prop", "the physical world", "LIVE", "photographs on /robots", "REVEALED",
  { arc: "arrived" });
R("phys.niac.whole", "A photograph of the MGK-NIAC WHOLE.",
  "prop", "the physical world", "NOT_BUILT", null, "HELD",
  { deps: ["Mike's camera — P4"],
    note: "The museum holds none. Its own archive is titled DETAILS ONLY and its tombstone says the frame is withheld, which is why the album's cover wears a detail (M30)." });
R("phys.cases", "The cases and the case objects — chips, cards, the things in the boxes.",
  "artifact", "the physical world", "NOT_BUILT", null, "HELD",
  { deps: ["photography", "which are real and which are referenced"] });
R("phys.nickels", "The buffalo nickels — canon, physically present, deliberately unphotographed.",
  "artifact", "the physical world", "NOT_BUILT", null, "HELD",
  { deps: ["a reveal class that does not exist yet"],
    note: "MIKE: 'Maybe the nickels are hidden inside of the thing so they're not even photographed.' The four reveal classes do not cover this — a fifth, SEALED, is PROPOSED AND NOT ADOPTED, and naming it is Mike's." });
R("phys.time", "Time (the magazine) — the period artifact.",
  "artifact", "the physical world", "NOT_BUILT", null, "HELD",
  { deps: ["a rights check before any scan is published"] });
R("phys.manual.original", "The original printed manuals — held, not published.",
  "artifact", "the physical world", "LIVE", "stated on DOC CONTROL; not shown", "HELD",
  { deps: ["[PAPA] — whether an original is ever published"] });

/* ═════════ 9. THE EGGS ═══════════════════════════════════════════════════ */
R("egg.replay", "The sandbox replay — the install, step by step, as an egg-hosting surface.",
  "egg", TWIN, "LIVE", null, "HELD",
  { deps: ["a reason to tempt someone with it"], note: "Wired; currently an unexposed recipe." });
R("egg.passcode", "The passcode kicker — reserved egg real estate in the boot chatter.",
  "egg", TWIN, "STUB", null, "HELD",
  { deps: ["Mike writing the egg"], note: "EGG-SLOT marks exist in Boot3_Chatter. No eggs invented." });
R("egg.name", "The name egg — with a name and birthdate on file the Horoscope menu grows a row wearing the user's name.",
  "egg", TWIN, "LIVE", "give the machine a name and a birthdate", "REVEALED",
  { note: "The reading itself NEVER carries the name — it is written to a sign, not to a person." });
R("egg.calculator", "The calculator egg class — 80085 / 07734.",
  "egg", TWIN, "LIVE", "type it", "REVEALED");
R("egg.cloud-alert", "The ALERT — the assistant accidentally reveals it is listening and reporting back. Ledger #9.",
  "egg", TWIN, "PARTIAL", null, "HELD",
  { deps: ["ask_count_20", "message wording ([PAPA])"],
    note: "Delivery is built and triggers on the twentieth question. Under the 50Kft fiction this stops being an accident and becomes evidence the uplink is live." });
R("egg.passcodes-msg", "PASS CODES — a recording of unknown origin reading 0000, 69, 80085. The in-fiction path to learning a passcode.",
  "egg", TWIN, "PARTIAL", null, "HELD", { deps: ["ask_count_40", "the audio asset is unconfirmed"] });
R("egg.morse", "STILL LISTENING — a system message the machine keys in Morse.",
  "egg", TWIN, "PARTIAL", null, "HELD", { deps: ["ask_count_60"] });
R("egg.renamed-games", "The AI renamed the games. Ledger #10, in-fiction load-bearing.",
  "egg", TWIN, "LIVE", "notice the names", "REVEALED");
R("egg.matchbook", "The matchbook carrying Mike's own surname LANG, with an offer to write a number into the back of it.",
  "egg", "the physical world", "NOT_BUILT", null, "HELD",
  { deps: ["what number", "whether the museum plants its own artifacts in its own props — Mike's call"],
    note: "RAISED, UNRULED (PROPS_LEDGER-20260804)." });
R("egg.frozen", "The frozen state — paused to frozen; the fluidic heaters weren't running; −31.4 °F.",
  "egg", "written, unused", "NOT_BUILT", null, "HELD",
  { deps: ["a storyline first"], note: "WRITTEN, DELIBERATELY UNUSED (C2)." });
R("egg.laststate", "LAST STATE — resume across visits.", "egg", TWIN, "NOT_BUILT", null, "HELD",
  { deps: ["portal.feed.last-state", "a privacy ruling from Mike"] });

/* ═════════ 10. THE SOUNDS — from SOUND_AUDIT-20260726, every trigger fired ═ */
for (const [slug, name, sites] of [
  ["select", "Select", 23], ["scroll", "Scroll", 12], ["connected", "Connected", 12],
  ["powermaury", "PowerMaury", 11], ["connectionsuccess", "ConnectionSuccess", 11],
  ["beepsandboops", "BeepsAndBoops", 6], ["whitenoise", "WhiteNoise", 5],
]) {
  R("sound." + slug, `${name} — through the throat, ${sites} call sites.`,
    "sound", TWIN, "LIVE", "the twin, powered on", "REVEALED");
}
R("sound.datatransfer", "DataTransfer — the modem screech. Mapped, fires correctly, and NOTHING CALLS IT.",
  "sound", TWIN, "PARTIAL", null, "HELD",
  { deps: ["a ruling on where a data-transfer sound belongs"],
    note: "Zero call sites. The screech reaches the glass only through Boot3_Chatter's direct FX_modem call." });
R("sound.slosh", "Slosh 0–4 — the five liquid variants of the fluidic suspension.",
  "sound", TWIN, "PARTIAL", "one variant, at the answers handoff", "REVEALED",
  { deps: ["a ruling on when each of the other four plays — shake? bubble merge? reveal? settle?"],
    note: "Mike wrote PlaySlosh in the original firmware and it was never transliterated into the twin at all; the suspension was silent from the day the twin was built until 2026-07-26." });
for (const [slug, name] of [
  ["dial90", "Dial_Handshake / FX_dial90 — the 90s dial"],
  ["modem", "Boot3_Chatter / FX_modem — the download screech"],
  ["reveal", "NIAC_Die_Reveal / FX_reveal — thunk and settle"],
  ["cards", "Card_Ceremony — the riffles"],
  ["glitch", "Glitch_Tick — the glitch layer"],
  ["snowglobe", "SG_step — the snow globe's song"],
]) {
  R("sound.direct." + slug, name + ". Bypasses the throat by design.",
    "sound", TWIN, "LIVE", "the twin, powered on", "REVEALED");
}
R("sound.electrical-short", "WB_electrical-short v1/v2 — the house's own recorded effect.",
  "sound", "weird-baby-robots/assets/audio", "LIVE", null, "HELD",
  { note: "On file in the robots repo; nothing on the museum's glass plays it." });

/* ═════════ 11. THE MUSIC WING ════════════════════════════════════════════ */
for (const [slug, name, plate] of [
  ["carsie-blanton", "Carsie Blanton", "/images/wal/carsie-blanton-poster.png"],
  ["hunter-root", "Hunter Root", "/images/wal/hunter-root-plate.jpg"],
  ["jesse-welles", "Jesse Welles", "/images/wal/jesse-welles-plate.webp"],
  ["mikey-mike", "Mikey Mike", null],
]) {
  R("wal." + slug, `${name} on Worth A Listen — two songs, About the Songs, About the Artist, What they are up to.`,
    "surface", "src/data/artists/worth-a-listen.js", "LIVE", "a wing on /wal", "REVEALED",
    { assets: plate ? [plate] : [],
      note: slug === "hunter-root" ? "M3: the portrait is a phone selfie in a vehicle wearing another band's name."
        : slug === "jesse-welles" ? "M16: 'That Can't Be Right' has ZERO song facts — all three it had were our own research narrative and were struck."
        : "" });
}
R("wal.artifacts", "WAL artifacts, below the line — deliberately empty.",
  "surface", "src/data/artists/worth-a-listen.js", "NOT_BUILT", null, "HELD",
  { deps: ["an artist earning one"], shown: true,
    note: "INTENTIONALLY ABSENT and the absence is on the page. The /hr blocker, not recreated." });
R("wal.banners", "The double-height banner per WAL artist, in the gift shop.",
  "commerce", "src/data/wb_roster.js", "PARTIAL", "the shop", "REVEALED",
  { deps: ["Mike's art"], note: "Typographic placeholders, flagged for art." });

/* ═════════ 12. COMMERCE ══════════════════════════════════════════════════ */
R("shop.sticker", "The house's own shelf item — a sticker.",
  "commerce", "src/data/wb_merch.js", "LIVE", "the shop", "REVEALED",
  { assets: ["/images/wb-merch/sticker.png"],
    note: "M20: the three Printful variants still carry the old low-res print master. The in-shop image is fine." });
R("shop.shirts", "Shirts and hats.", "commerce", "—", "NOT_BUILT", null, "HELD",
  { deps: ["C19 — Mike"] });
R("shop.domain", "shop.weird.baby — the custom domain.", "commerce", "—", "NOT_BUILT", null, "HELD",
  { deps: ["Big Cartel Platinum — C20"] });
R("shop.mikes", "Mike's own gift shop.", "commerce", "—", "NOT_BUILT", null, "HELD",
  { deps: ["Mike bringing source — C18"] });

/* ═════════ 13. RETIRED — struck, and named so nobody rebuilds them ════════ */
const RET = (id, name, when) =>
  R("retired." + id, name, "surface", "—", "NOT_BUILT", null, "RETIRED", { note: when });
RET("hr.home", "/hr/home — a stock interior photo with four room names painted into the JPEG.", "deleted v46/C3");
RET("hr.fanwall", "/hr/fan-wall — thirteen fabricated fan testimonials.", "deleted v46/C3");
RET("hr.media", "/hr/media — one line reading '— coming soon.'", "deleted v46/C3");
RET("robots.parts", "THE PARTS — a whole face on the MGK-NIAC album.", "deleted v50/N1; orphaned parts_drawer.jpg — M9");
RET("robots.tally", "The 31½ tally card, its caption, and the FAQ's 'How many are there?'", "struck v51/A5 under THE LAW OF SUBTRACTION; emptied the provenance register's INVENTION class");
RET("booth.hook", "The booth's ADMIT ONE ticket and its enamel INFORMATION plate — both candidates.", "struck v51/M23a — 'THE TITLE IS THE GRAB'");
RET("lobby.book.static", "The static guest book and the ?book= switch.", "struck v51/M23b");
RET("record.fictions", "Ten dated Record entries, a 436-record source line and a register block.", "deleted v47/H2 — all invented, all survived four rounds of review");
RET("query.variants", "?subtitle=, ?hook= and ?book= — three query parameters that each served a variant.", "all three retired; no query parameter selects a variant anywhere in the building");

/* ═════════ 14. THE HOUSE'S OWN INSTRUMENTS ═══════════════════════════════ */
R("tool.provenance", "The provenance boundary and gate — every visitor-facing string carries its origin.",
  "tool", "tools/provenance-sweep.mjs", "LIVE", null, "HELD",
  { note: "Runs on every packet beside lint and build. INVENTION is 0 and its ceiling is ratcheted to 0." });
R("tool.assettable", "The asset table — 253 media files with what each is, what depends on it, a quality read, Mike's verdict and the reveal arc.",
  "tool", "tools/asset-table.mjs", "LIVE", null, "HELD",
  { note: "[C32 2026-08-05] re-keyed: `uid` is minted once, `sha256` resolves a pure rename, and a judged row whose file is gone is now reported rather than dropped." });
R("tool.reveal", "This ledger.", "tool", "reveal/ledger-declare.mjs", "PARTIAL", null, "HELD",
  { deps: ["Mike's story schedule — every `when` is null"],
    note: "One consumer is wired (the Foundation's state column). Everything else still hard-codes its own availability." });
R("tool.openactions", "The open-action register — every open item in both repos, one place.",
  "tool", "docs/OPEN_ACTIONS.md", "LIVE", null, "HELD");

/* ═════════ 15. THE ROWS THE FOUNDATION READS — R5's proof ════════════════ */
R("channel.shop", "Giving channel — the gift shop.", "commerce",
  "src/routes/Foundation.jsx LEDGER", "LIVE", "the shop", "REVEALED");
R("channel.music", "Giving channel — the house's own music.", "commerce",
  "src/routes/Foundation.jsx LEDGER", "LIVE", "/wb", "REVEALED");
R("channel.qr", "Giving channel — given in Weird.Baby's name, by a code you scan.", "commerce",
  "src/routes/Foundation.jsx LEDGER", "NOT_BUILT", null, "HELD",
  { deps: ["a payment mechanism nobody has built"], shown: true,
    note: "This row will read LIVE on the day that is real, and not one day before." });
R("channel.supplies", "Giving channel — a registry of supplies.", "commerce",
  "src/routes/Foundation.jsx LEDGER", "NOT_BUILT", null, "HELD",
  { deps: ["a public list of what the museum actually needs"], shown: true });
R("channel.services", "Giving channel — a registry of services.", "commerce",
  "src/routes/Foundation.jsx LEDGER", "NOT_BUILT", null, "HELD",
  { deps: ["the same list, for work rather than goods"], shown: true });

/* ═════════ WRITE ═════════════════════════════════════════════════════════ */
const seen = new Set();
for (const r of ROWS) {
  if (seen.has(r.id)) { console.error("DUPLICATE id:", r.id); process.exit(1); }
  seen.add(r.id);
  if (!["LIVE", "PARTIAL", "STUB", "NOT_BUILT"].includes(r.build)) {
    console.error("bad build on", r.id, r.build); process.exit(1);
  }
  if (!["HELD", "REVEALED", "RETIRED"].includes(r.state)) {
    console.error("bad state on", r.id, r.state); process.exit(1);
  }
  if (r.state === "REVEALED" && !r.reach) {
    console.error("REVEALED with no reach:", r.id); process.exit(1);
  }
  if (r.state === "HELD" && r.reach && r.build === "NOT_BUILT") {
    console.error("HELD + NOT_BUILT cannot have a reach:", r.id); process.exit(1);
  }
}
if (unresolved.length) {
  console.error("ASSET REFS NOT IN THE ASSET TABLE:", [...new Set(unresolved)]);
  process.exit(1);
}

const out = {
  _: "THE REVEAL LEDGER. One row per revealable thing across both repos: what it is, where it lives, what is TRUE TODAY about the build, whether a visitor can reach it, whether it should be reachable yet, when the story lets it out, and what has to happen first. Authored in reveal/ledger-declare.mjs — edit there, never here.",
  _states: "state: HELD (built or part-built and deliberately not reachable) · REVEALED (a visitor can get to it today) · RETIRED (was here, struck, named so nobody rebuilds it). NOT the same axis as `build`.",
  _build: "build: LIVE · PARTIAL · STUB · NOT_BUILT — what is true today, never what is planned.",
  _when: "when: the story day or week a row becomes available. NULL ON EVERY ROW, by Doctrine 12 — nobody has supplied a schedule and this file does not invent one.",
  _arc: "arc: THE REVEAL ARC (Mike, 2026-08-04) — arrived · understood · partial · online · null. Same field, same values, as provenance/asset-table.json. `null` is UNSET and is not a stage.",
  _shown: "shown: true where a VISITOR CAN SEE THE LABEL of something that is not built — an engraved drum position that will not arm, a register row printed NOT BUILT, a document a face names and does not hold. It separates a PROMISE from a private gap. The twin's stub rows are NOT shown, because THE STUB LAW strips them from the menus.",
  _assets: "assets: asset-table `uid`s, resolved from public refs at build time. The uid survives a rename; the path does not — see C32.",
  _join: "provenance/asset-table.json is one row per FILE and stays the authority on files. This is one row per REVEALABLE THING. Neither restates the other; they meet at `assets`.",
  generated: "node reveal/ledger-declare.mjs --write",
  rows: ROWS,
};

if (process.argv.includes("--write")) {
  fs.writeFileSync(path.join(REPO, "reveal", "ledger.json"),
    JSON.stringify(out, null, 1) + "\n");
  console.log("wrote reveal/ledger.json");
}
const by = f => ROWS.reduce((m, r) => (m[r[f] ?? "—"] = (m[r[f] ?? "—"] || 0) + 1, m), {});
console.log(`${ROWS.length} rows`);
console.log("  by state ", JSON.stringify(by("state")));
console.log("  by build ", JSON.stringify(by("build")));
console.log("  by class ", JSON.stringify(by("cls")));
console.log(`  with a story date: ${ROWS.filter(r => r.when).length}`);
console.log(`  with dependencies: ${ROWS.filter(r => r.deps.length).length}`);
console.log(`  joined to assets : ${ROWS.filter(r => r.assets.length).length}`);
