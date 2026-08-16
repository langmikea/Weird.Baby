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
     prod    [R3] THE PRODUCTION ARC — needed · printed · photographed · placed.
             The MANUAL-PAGE VESSEL'S FIELD and no other row's; `null`
             everywhere else. It is NOT `arc`: `arc` is how the house REVEALS a
             thing it has, this is whether the house HAS it. `build` derives
             from it, so a page cannot be written into a state the world is not
             in. Vessel and rules: reveal/schema.mjs.
     calledBy[R3] the `record.NNN` rows whose entries ask for this thing. It is
             the supply line Mike ruled for the manual — pages come one at a
             time, as the story reaches for them — and it is validated against
             real rows, so nothing can be called for by an entry that does not
             exist.
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
import { validate, manualPageRow, manualPages, MANUAL_SRC_DIR } from "./schema.mjs";
import { applyTransfers, TRANSFERS } from "./transfers.mjs";
import { entries as recordEntries, RECORD_SOURCE } from "./record-entries.mjs";

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
    prod: extra.prod ?? null,
    calledBy: extra.calledBy || [],
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
/* [H1/H2 2026-08-06] THE NAME LOST TWO OF ITS THREE NOUNS AND THAT IS THE
   ROUND, STATED IN ONE ROW. The Portal is held from launch and left this wing's
   public deck; the archives are still built and are empty until the Record
   delivers a photograph. What a visitor reaches at /robots today is the front
   desk, the Record and two catalogued machines. */
R("route.robots", "The Robots wing — the front desk, the Record, and two machines whose pictures the Record has not delivered yet.",
  "surface", "/robots", "LIVE", "linked from the directory", "REVEALED");
R("route.wal", "Worth A Listen — four artists the house wants heard.",
  "surface", "/wal", "LIVE", "linked from the directory", "REVEALED");
R("route.wb", "Weird.Baby Music — the house's own record.",
  "surface", "/wb", "LIVE", "linked from the directory", "REVEALED",
  { assets: ["/images/wb/vol1-cover.png"] });   /* [A3 2026-08-06] the sleeve was
     rebuilt on the robots template and the old file is deleted; the ledger meets
     the asset table at `assets: [uid]`, so a repointed FILE is a repointed row. */
R("route.hr", "The Hunter Root reference wing — 8 albums, 93 tracks, the deepest thing in the museum about any artist.",
  "surface", "/hr", "PARTIAL", null, "HELD",
  { note: "HELD PERMANENTLY BY RULING (ASSET_REVEAL_CHECKLIST §E). [H1 2026-08-06] THE REACH IS NULL NOW AND IT WAS STALE FOR A ROUND: it read 'by URL only — deliberately unlisted', which was true until the previous round put the wing behind a password on /admin and made /hr render the Lobby. A visitor cannot get here. The reachability check is what noticed. PARTIAL because the deck's journal tab is dead machinery (M17) and the page is one exhibit plus an unlinked discography." });
R("route.hr.archive", "The Hunter Root discography — the archive route.",
  "surface", "/hr/archive", "LIVE", null, "HELD",
  { note: "[H1 2026-08-06] Reach nulled with route.hr and for the same reason — both routes are wrapped in <HeldWing> and both chunks are refused by the worker." });
/* ═══ [H1 2026-08-06] /admin IS NOT HELD, AND THE CHECK IS WHAT SETTLED IT ══
   It carried `state: "HELD"` with `reach: "by URL only"` — a row saying in one
   breath that a visitor cannot get there and how they do. Under Mike's rule
   ("a held thing must be UNREACHABLE BY A VISITOR") only one of those can
   stand, and it is not the state: `/admin` is a real page at a real address
   that anybody who types it opens in full, and it has to stay that way, because
   it is the door the held wings are opened THROUGH.
   SO IT IS REVEALED AND `shown` STAYS FALSE, which is the distinction the two
   axes exist for: REVEALED is "a visitor can reach it", `shown` is "the museum
   points at it". Nothing on any page names this address. It is the one row in
   the table whose state changed without anything on the glass changing, and it
   is recorded rather than absorbed — OPEN_ACTIONS P-c, in case Mike wants the
   dashboard itself put behind the same password the wings are. */
R("route.admin", "The admin dashboard — visits, the guest book, page breakdown.",
  "surface", "/admin", "PARTIAL", "by URL only — nothing links to it", "REVEALED",
  { deps: ["C33 — exclude the house's own hits, a return-visitor signal, a week of logbook"],
    note: "Not linked from anywhere. The return-visitor signal is constrained by /booth's privacy answer. [H1] It also carries the held wings' door." });
R("route.preset", "Preset landing — a shared exhibit state, by short id.",
  "surface", "/p/:id", "LIVE", "only by a link somebody was given", "REVEALED");
R("route.catchall", "The catch-all — every unmatched address renders the Lobby where it stands.",
  "surface", "src/App.jsx path=\"*\"", "LIVE", "by mistyping anything", "REVEALED");
R("route.money", "The /money redirect — the Foundation's retired address.",
  "surface", "/money", "LIVE", "an old link", "REVEALED",
  { note: "Both names have been live URLs. A third rename re-points this, it does not add another." });

/* ═══ [F1/F2 2026-08-05] TWO ROOMS MIKE NAMED, AND NOTHING IS BUILT ═════════
   His instruction was the whole scope: "LEDGER (build nothing, record as
   future work)". So they are rows and they are not pages — no route, no
   component, no stub, and `shown: false` on both, because a room a visitor can
   read the name of and not enter is a debt rather than a plan.

   THEY GO IN THIS TABLE AND IN `docs/OPEN_ACTIONS.md`, which is the same pair
   the poke got at P4 and for the same division of labour: the register is
   where Mike looks for what is open, and the ledger is what makes an unbuilt
   thing COUNTABLE — `npm run surfacing` reads this file, so a room that sits
   here unbuilt for months shows up in the number instead of in nobody's
   memory. Neither row invents a word of their content: what is written below
   is what he said and the deps are what is missing.                          */
R("room.curtain", "BEHIND THE CURTAIN — where Mike says the real thing, out of character.",
  "surface", "not built — no route, no component", "NOT_BUILT",
  null, "HELD",
  { deps: ["Mike's word on where it lives and what it looks like",
           "the first thing he actually wants to say in it"],
    note: "MIKE, F1: a place where he tells the real truth about things — why he really builds robots, or anything else that is not in character. HIS OWN CONSTRAINT AND IT IS THE HARDEST PART OF THE SPEC: \"NOT a clearing house — a room used only when it is needed.\" A room with a standing appetite for content fills itself with filler, which is the failure mode this museum has already paid for once in the Record's ten invented entries. So it cannot be built and then fed; the first entry has to exist before the room does. THE ONE THING IT COLLIDES WITH IS DOCTRINE 11, and the collision is only apparent: a line whose subject is the MAKING of the museum fails the visible-line test, and \"why I really build robots\" is a line about the man and the machines, not about the drafting of a website. The distinction is thin enough that it is worth naming here rather than discovering it mid-write." });
R("room.slow", "WHEN THINGS GET SLOW — old photographs of Mike, from birth onward.",
  "surface", "not built — no route, no component", "NOT_BUILT",
  null, "HELD",
  { deps: ["Mike's selection from the source folder — nothing is taken from it by Ops",
           "his ruling on where they hang and whether they are captioned"],
    note: "MIKE, F2: post old photos of himself, from birth onward, funny stuff — the room to open when there is nothing new. THE SOURCE FOLDER IS RECORDED AND WAS NOT TOUCHED THIS ROUND, by instruction: C:\\Users\\macun\\OneDrive\\OneDrive MAJEL_01 (Archived Photos)\\ARCHIVED - Digital Negatives\\Sets (NOT GUARANTEED TO BE BACKED UP ELSEWHERE)\\Karen Mike Ken\\Mike and Mo. Two things a future round must hold before it opens that folder. THE FOLDER'S OWN NAME SAYS IT IS NOT GUARANTEED TO BE BACKED UP ANYWHERE ELSE — so the first act on it is a copy, never a move, and never an edit in place. AND IT IS A FAMILY SET, not a Mike set: the path names two other people, so which frames may be published is his call and nobody else's, the same consent rule that kept two real households off /foundation's invoice (M38)." });

/* ═════════ 2. THE ROBOTS WING'S FACES — derived from src/data/artists/robots.js */
/* [H1 2026-08-06] `where` IS OVERRIDABLE NOW, because a face left the file this
   helper hard-coded. Every robots face lives in `robots.js` except the Portal's,
   which is held and therefore lives in its own module — and the reachability
   check reads this field to decide whether a built, held row is actually behind
   a door, so a helper that answers "robots.js" for all of them would have made
   that check answer the wrong question quietly. */
/* ═══ [CH6 2026-08-12] THE WHOLE WING IS HELD UNTIL RECORD 001 ══════════════
   MIKE: hide all of /robots at launch — the machines, the FAQ, the Record,
   everything. It does not exist to a visitor until 001 announces it.

   EVERY FACE BELOW IS THEREFORE HELD AT LAUNCH, AND THIS HELPER APPLIES IT
   RATHER THAN EIGHT ROWS BEING RETYPED. The rows keep their own `build` — what
   is BUILT has not changed, only whether a visitor can reach it — and `reach`
   goes null, which is what `reveal:check`'s first check demands of a held row.

   THIS IS THE DRIFT JOB 4 IS ABOUT, CAUGHT ON THE WAY IN. The Ledger, Contribute
   and the machines were each found by Mike on the live site because a ruling
   changed the museum and nothing changed the ledger. Hiding the wing without
   moving these rows would have made the ledger wrong in exactly that way, in the
   same round that catalogues the failure.

   THE DEVELOPMENT CAVEAT, STATED: in DEVELOPMENT every one of these renders and
   is reachable. The ledger describes the LAUNCH state on purpose — that is the
   V1 ruling ("make the gate check the LAUNCH state rather than the current
   view") and the reason the reachability pass can mean anything at all.

   ═══ AND THE GATE REFUSED THE OBVIOUS FIX, WHICH IS THE FINDING ═══════════
   Flipping these eight to HELD was written, run, and REFUSED by `reveal:check`
   check 5 (THE CARRIER). Its words, on four rows at once:

     record.002: built, HELD, and carried by `src/data/artists/robots-record.js`
     — which is NOT in `HELD_PATHS` (vite.config.js), so its code and every
     string in it ship in a chunk the public fetches. A boolean in a public
     module stops the render and publishes the material anyway.

   IT IS RIGHT AND THE ROWS ARE LEFT AS THEY WERE. `face.wbr.record` is what the
   `record.NNN` rows inherit their state from, so flipping the face flipped all
   five entries to HELD — and the gate immediately said what CH5-a already says
   in `src/lib/record-clock.js`: the Record's entries are in a PUBLIC chunk. The
   wing is hidden from the page and its text is still in the bundle.
   MARKING THEM HELD WOULD HAVE MADE THE LEDGER CLAIM A CONCEALMENT THAT DOES
   NOT EXIST — which is the same class of error as leaving them REVEALED, in the
   opposite direction, and the more dangerous one because it reads as safe.
   SO THE LEDGER STAYS HONEST-BUT-STALE, and the staleness is the open row: it
   is fixed by moving `robots.js` + `robots-record.js` into `HELD_PATHS` so the
   wing is genuinely absent, not by editing a state field. Open `CH6-a`. */
const FACE = (id, name, build, state, extra) => {
  const { where, ...rest } = extra || {};
  return R("face." + id, name, "surface", where || "src/data/artists/robots.js", build,
    state === "REVEALED" ? "a track on /robots" : null, state, rest);
};
/* [R3 2026-08-05] THE FRONT DESK IS ONE FACE. Welcome, DOC CONTROL and Contact
   are struck on Mike's instruction and their rows are RETIRED in §13 — a face
   that is gone does not stay LIVE here because the ledger is easier to leave
   alone than to correct. What survived each of them is folded into the FAQ,
   which is why that row's note is now the longest on this table. */
FACE("wbr.faq", "FAQ — the robots wing's whole front desk: what this is, the machines, the paper, and how to reach us.", "LIVE", "REVEALED",
  { note: "[H2 2026-08-06] PULLED BACK — no Record entry delivers this picture, so the face no longer shows one and the file is behind the door under public/held/. M29 REOPENS BY CONSEQUENCE — the face that had no picture has none again (OPEN_ACTIONS H-a). [R3] Absorbed Welcome, DOC CONTROL and Contact — eleven questions where there were four faces. M29 CLOSES: it inherited Welcome's family shot along with Welcome's job as the wing's landing, so the face that had no picture has one, and no object was invented for the slot. C31 closes with DOC CONTROL." });
FACE("wbr.record", "THE RECORD — the journal of the reverse-discovery, and it is about all things robots.", "PARTIAL", "REVEALED",
  { deps: ["M18 — twenty-seven open questions on entry 013"],
    note: "[B2 2026-08-07] M19 IS ANSWERED AND OFF THIS ROW'S DEPS. Mike ruled that THE REAL RECORD STARTS AT 001 when he dictates it, which settles what a record number means: the numbers are THIS VOLUME'S OWN and they begin at 001, not the 436-record numbering that was deleted at v47. The volume therefore holds ZERO entries of its own sequence today — the one entry on the glass is the PROTOTYPE (record.013 below) and is not in it. THE FACE STAYS PARTIAL AND REVEALED for exactly that reason: it renders, it is reachable, and the sequence it is a container for has not started. [R1] MOVED HERE FROM THE MGK-VIIIp ALBUM on Mike's ruling that it applies to all things robots, not just the VIIIp — and this row was `face.viiip.record` until then. It is the ONE id this table has ever renamed; nothing outside reveal/ reads it, and leaving it on a wing it no longer sits in would have been the ledger keeping a filing decision the museum reversed. Reachable at its own address, /robots/record, because the lobby directory now carries a line for it indented under Weird.Baby Robots. Holds exactly ONE entry; the container's pagination (C1), doors (C7) and epoch (C8) are built and unexercised." });
FACE("niac.name", "THE NAME — built as MGK-NIAC, sold as MGK-VIII.", "LIVE", "REVEALED",
  { arc: "understood",
    note: "[H2 2026-08-06] PULLED BACK — no Record entry delivers this picture, so the face no longer shows one and the file is behind the door under public/held/. [Q3] The album took the first name on 2026-08-05; this face is where the two names are reconciled. [R4] Its still was the robot's head at the lens and is now the cabinet's lit column — the mainframe is the subject." });
FACE("niac.plates", "IMAGE ARCHIVE (MGK-NIAC) — four details of a cabinet never shown whole.", "LIVE", "REVEALED",
  { note: "[H2 2026-08-06] THE WALL IS EMPTY AND THE WALL IS STILL BUILT. Four plates came off it under THE PULL-BACK RULE and the face carries `archiveEmpty` instead — the groupings, the unit noun and the reader are untouched, and a Record entry that delivers a plate puts it back with no code. [R4] EIGHT PLATES TO FOUR. Six were the robot and one was a bench shot with its feet in it; all seven are off the wall and none is deleted from disk (M9). Three came the other way out of the robots repo's own culled 2021 set — the core, the output row, the meltdown. It also lost the February 2013 spread and with it the museum's ONLY stowed shelf, so N2's <details> mechanism is now exercised nowhere — C29." });
FACE("niac.firmware", "TECHNICAL SPECIFICATIONS (MGK-NIAC) — what the machine is running.", "LIVE", "REVEALED",
  { note: "[H2 2026-08-06] PULLED BACK — no Record entry delivers this picture, so the face no longer shows one and the file is behind the door under public/held/. [R4] Its still was a breadboard on a bench and is now the cabinet's own bar bank, which is both the mainframe and the literal subject of the face's 1 × 64 entry. [K1 2026-08-07] The breadboard plate `matrix_lit.jpg` was orphaned by that swap and carried as M9 for three rounds; Mike killed it with the other ten and M9's robot half closes with them." });
FACE("viiip.plates", "IMAGE ARCHIVE (MGK-VIIIp) — nine plates, as received.", "LIVE", "REVEALED",
  { note: "[H2 2026-08-06] THE WALL IS EMPTY AND THE WALL IS STILL BUILT — nine plates off under THE PULL-BACK RULE, `archiveEmpty` in their place. M7 and M25 are both moot while nothing is on the wall and both come back with the plates. One of the nine, the power switch round the back, IS delivered by Record 013 and is on that entry." });
FACE("viiip.manual", "THE MANUAL — the 1965 operating and maintenance manual.", "PARTIAL", "REVEALED",
  { deps: ["doc.manual.plates"],
    note: "[P2] THE FACE HAS NO PICTURE, BY RULING. Its one image was a render of a page reading TEXT NOT SUPPLIED, and Mike ruled that the museum admitting it had not written the manual does not get to wear a fiction as cover: either a plate shows a page actually written, or there is no plate. M45 and M4 both close here — M4 by there being no plate left to be a render. `plates: []` is unchanged and still waits on B8's photographs (P2 in the art register)." });
FACE("viiip.firmware", "TECHNICAL SPECIFICATIONS (MGK-VIIIp) — the machine's own mind, on file.", "LIVE", "REVEALED",
  { arc: "online",
    note: "[H2 2026-08-06] PULLED BACK — no Record entry delivers this picture, so the face no longer shows one and the file is behind the door under public/held/. M2: that plate is mirror-reversed, and the whole photograph is flipped." });
/* ═══ [H1 2026-08-06] THE PORTAL IS HELD FROM LAUNCH ════════════════════════
   MIKE: "THE PORTAL IS HELD FROM LAUNCH but development continues... a held
   thing must be UNREACHABLE BY A VISITOR and the gate must FAIL if that stops
   being true. Development access stays — same posture as /hr, reached through
   admin."
   THREE ROWS ARE HELD RATHER THAN ONE, because the album, its instrument and
   its door are three things and only the middle one had a row. Their `where` is
   `src/data/artists/portal.js` — a module `vite.config.js` parks under
   `assets/held/` and `src/worker.js` refuses — and the reachability check reads
   BOTH of those lists back, so this hold cannot be undone by an edit that
   forgets a ledger row. The `arc` comes off all three: an arc is how the house
   REVEALS a thing, and nothing here is being revealed today. */
R("portal.album", "THE PORTAL — the album: the door, the feed controller, and the questions about it.",
  "surface", "src/data/artists/portal.js", "LIVE", null, "HELD",
  { deps: ["Mike's ruling on when the Portal opens"],
    /* [2026-08-10] THE POSTER MOVED TO `viiip-v2.png` AND THIS ROW MOVED WITH
       IT. `portal.js`'s `viewerPoster` is the only reason this row ever named
       the plate; when the call site was versioned the row went one round saying
       the album's asset was a file the album no longer draws. The cover stays —
       it is Mikey's hand-authored sleeve and this album is what draws it. */
    assets: ["/held/robots/art/portal-cover.png", "/held/robots/art/viiip-v2.png"],
    note: "Held from launch. The album is a dynamic import Robots.jsx asks for only behind the password on /admin; the deck closes up to four albums without it, and the splice index is PORTAL_AT so the position Mike gave it survives the hold." });
R("portal.door", "THE PORTAL — the first track, and the way in.",
  "surface", "src/data/artists/portal.js", "LIVE", null, "HELD",
  { deps: ["Mike's ruling on when the Portal opens"],
    note: "[H3c] Mike named three tracks and did not say what stands behind the first. A row called PORTAL that opens nothing is a dead control, so it is the door — the portal as it stands, no feed selected. Named as Ops' judgement at OPEN_ACTIONS P-b." });
FACE("viiip.portal", "THE PORTAL — the feed-control panel: drum, two bat switches, a rotary dial, a latch.", "LIVE", "HELD",
  { where: "src/data/artists/portal.js",
    note: "The panel is the immersion's first step; the latch opens the twin. [H1 2026-08-06] HELD — it left robots.js with the album." });
FACE("viiip.faq", "FAQ — questions about the machine.", "LIVE", "REVEALED");

/* ═════════ 3. THE PORTAL'S OWN CONTROLS — availability that already varies ═
   [R6 2026-08-05] THE DRUM IS NUMBERED NOW. Mike's instruction: MGK-NIAC takes
   channels 1 and 2, MGK-VIIIp moves to 3 and 4, and THE REASON IS THE EGG AND
   MUST NOT BE EXPLAINED ON THE GLASS. The reason is recorded once, in
   `egg.channels` below, which is the only place in either repository it is
   written down. Nothing in `src/` says it. */
for (const n of [1, 2]) {
  R(`portal.feed.niac.${n}`, `FEED · CHANNEL ${n} — MGK-NIAC, engraved on the drum and inert.`,
    "machine", "src/data/artists/portal.js panel.drum", "NOT_BUILT", null, "HELD",
    { deps: ["a NIAC feed — the mainframe does not run on the Portal yet"], shown: true,
      note: "[R5] Mike's canon is that the mainframe runs on the Portal SOMEDAY. These two channels are that someday, engraved where a visitor reads them and dark — the same instrument M33 describes, pointed at the other machine. They carry the machine's name and NO feed title: naming a state the mainframe has never been in would be inventing the thing the arc is for." });
}
R("portal.feed.standard", "FEED · CHANNEL 3 · STANDARD — the unit as it stands, at the opening prompt.",
  "machine", "src/data/artists/portal.js panel.drum", "LIVE", null, "HELD",
  { note: "[R6] The one feed that arms, and it is channel 3. [H1] Held with the album — the drum it is engraved on is behind the door." });
/* [P5 2026-08-06] THREE ENGRAVINGS CHANGED AND THESE NAMES CHANGE WITH THEM.
   Mike struck "IDLING, UPD", "BOOT PLAYBK" and "OFF · 1ST BOOT" — one of them
   wrapped on the drum and none of the three was in either permitted register
   (deliberately obfuscated, or dressed in period garb); they were the `slug`s
   below, truncated until they fitted. THE SLUG IS THE ROW'S IDENTITY AND DID
   NOT MOVE, which is the whole reason a relabelling is safe here: `id`,
   channel, lever and dependency are untouched, and it is only the word cut into
   the brass that is different. A ledger row's `name` restates the glass, so a
   ledger that kept the old engravings would be the "fixing one never fixes the
   other" defect Doctrine 17 is named for, one file out. */
for (const [slug, ch, label, why] of [
  ["idling-updated", 4, "STANDBY", "no feed on file"],
  ["boot-playback", 5, "COLD START", "no feed on file"],
  ["off-first-boot", 6, "FIRST RUN", "no feed on file"],
  ["last-state", 7, "LAST STATE", "awaiting a privacy ruling — LAST STATE resumes across visits"],
  ["test-bench", 8, "TEST BENCH", "workshop entry; no public feed"],
]) {
  R("portal.feed." + slug, `FEED · CHANNEL ${ch} · ${label} — engraved on the drum and inert.`,
    "machine", "src/data/artists/portal.js panel.drum", "NOT_BUILT", null, "HELD",
    { deps: [why], shown: true,
      note: "The panel says only 'This feed is not available.' — the internal reason came off the glass at v46/C1. [R6] Renumbered; the position, the id and the lever are unchanged. [P5] Re-engraved; the id and the lever are unchanged again." });
}
R("portal.switch.maint", "AUTO MAINT — the C1 fortnight as an instrument. Thrown up, the latch goes dark.",
  "machine", "src/data/artists/portal.js panel.switches", "LIVE", null, "HELD");
R("portal.switch.prompt", "AT PROMPT — the entry state as an instrument.",
  "machine", "src/data/artists/portal.js panel.switches", "LIVE", null, "HELD");
R("portal.dial.live", "SOURCE · LIVE — the dial position that arms.",
  "machine", "src/data/artists/portal.js panel.dial", "LIVE", null, "HELD");
R("portal.dial.seeded", "SOURCE · SEEDED — a seeded feed the lamps would read.",
  "machine", "src/data/artists/portal.js panel.dial", "NOT_BUILT", null, "HELD",
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
  "machine", TWIN, "LIVE", null, "HELD",
  { note: "Stub rows are stripped from the menus in the shipped walk, so a visitor never reaches this screen. [H1 2026-08-06] THE REACH WAS 'dev only: Show stubs puts the stub rows back', WHICH IS NOT A REACH — `reach` is how a VISITOR gets somewhere, and a developer flag is the opposite of one. It was the row's own note wearing the wrong field, and the reachability check is what told the two apart." });

/* ═════════ 7. THE DOCUMENTS ══════════════════════════════════════════════ */
/* [G1 2026-08-05] NO PAGE COUNT IN THE NAME, AND THE COUNT IN THE NOTE IS READ
   OFF THE DOCUMENT. Both used to say 24 and both were wrong from the moment the
   typewriter pass rebuilt the manual — an identity claim ("the 24-page manual")
   goes stale silently, which is the whole of what T-A cost. Mike's standing
   rule is that the manual is as long as the manual needs to be and the count is
   a consequence of content, so the row states the object and derives the
   length. The stale structure figures (22 sections, 5 [ART REQUIRED] frames,
   9 [PAPA] slots) belonged to a generator that no longer exists and are NOT
   replaced with the new generator's figures: those live in the robots repo,
   they move whenever it re-runs, and a second copy here would rot the same way
   the first one did. */
R("doc.manual", "The Manual — the 1965 operating & maintenance manual, ABEAL / a division of ScrapCo.",
  "document", "weird-baby-robots/robots/mgk-viiip/manual", "LIVE",
  "a track on /robots", "REVEALED",
  { note: `The live source is the STRUCTURE ISSUE — structure and arrangement only, text not supplied — at ${MANUAL_SRC_DIR}, ${manualPages()} pages as this was built. The count is derived, never declared.` });
R("doc.manual.plates", "The Manual's microfiche plates — the photographed pages.",
  "document", "src/data/artists/robots.js face.plates", "NOT_BUILT", null, "HELD",
  { deps: ["Mike's camera — P2; ≥2400px long edge, whole page including margins, reel order = reading order"],
    shown: true, note: "[R3] DOC CONTROL is struck, so The Manual's own face is now the only place they are named — the promise is unchanged in force and narrower in reach. THE SET-LEVEL PROMISE LIVES HERE and nowhere else — the individual page rows below are not `shown`, because the museum makes one promise about plates and it is this one." });

/* ═════════ 7b. THE MANUAL'S PAGES — THE VESSEL, EMPTY [R3 2026-08-05] ══════
   MIKE'S RULING, and it changes what this is FOR: the manual ARRIVED IN PIECES,
   so the museum needs only the specific pages the story reaches for — printed,
   marked, photographed, one at a time, as Record entries call for them.

   THAT IS A SUPPLY LINE, NOT A SCANNING PROJECT, and the difference is the
   whole design. `doc.manual.plates` above is one row for the WHOLE SET and can
   only ever read NOT_BUILT until all of it is done; every page but one would
   read exactly the same as none. A page that carries its own production stage,
   and names the entry that asked for it, can be finished on its own.
   [G1 2026-08-05] That sentence used to say "a set of 24" and "twenty-three
   photographed pages and one missing". Both numbers came from a document that
   no longer exists; the set-level row's argument never depended on its size.

   THE VESSEL IS `manualPageRow()` IN reveal/schema.mjs. It refuses a page the
   manual does not have, derives `build` from the production stage so a row
   cannot claim a state the world is not in, and validates `calledBy` against
   real `record.NNN` rows so nothing can be called for by an entry that does not
   exist.

   NOTHING IS POPULATED, BY INSTRUCTION: the story has not asked for a page yet,
   and a page row written before an entry calls for it would be Ops deciding
   which page the story reaches for. When one is called for, it is one line:

       MANUAL_PAGE(7, { prod: "needed", calledBy: ["record.001"] })

   THE VESSEL IS PROVED WITHOUT SHIPPING A ROW. `npm run reveal:check` builds a
   specimen at each of the four stages, runs it through the same validator this
   file uses, and asserts the derived build/state/reach — then throws it away.
   An untested container is the shape of C7 (the Record's inline doors, built
   at v45, still exercised by nothing); this one is exercised on the day it is
   written and no visitor is shown a page to achieve it. */
const MANUAL_PAGE = (page, opts) => {
  const { id, name, cls, where, build, reach, state, extra } = manualPageRow(page, opts);
  R(id, name, cls, where, build, reach, state, extra);
};
/* (no calls — see above) */
/* [R1 2026-08-05] THIS ROW IS NOW THE VOLUME, AND ONLY THE VOLUME. The entries
   have their own rows below it. The split is not tidiness: M18's twenty-seven
   questions are questions about ENTRY 013 and travel with it, while M19 — what
   a record NUMBER means — is a property of the volume and stays here. Before
   the split both hung off one row and neither could be answered against
   anything smaller than "the Record". */
R("doc.record", "The Record — the volume: the weekly journal of the reverse-discovery.",
  "document", "src/routes/exhibit/RecordEntry.jsx", "PARTIAL", "a track on /robots", "REVEALED",
  { deps: [],
    note: "[B2 2026-08-07] M19 CLOSES ON THIS ROW, WHICH IS WHERE IT WAS ALWAYS FILED. Mike: THE REAL RECORD STARTS AT 001 when he dictates it — so a record number is a number in THIS VOLUME'S OWN sequence, beginning at 001, and it is not the 436-record numbering v47 deleted for having been invented. The volume's sequence has not started: the single entry on the glass is a PROTOTYPE that took a number out of a numbering it does not belong to, and clearing it out of the way is B2. STILL PARTIAL, and now for a sharper reason than 'it holds one entry' — it holds one entry that is not in its own sequence. The volume, not its entries: one `record.NNN` row per entry, derived from the data." });

/* ═════════ 7a. THE RECORD'S ENTRIES — ONE ROW EACH [R1 2026-08-05] ═════════
   AUDIT §8a: at sixty entries the Record becomes the museum's largest consumer
   of assets and every entry will want to name its own. So the granularity moves
   from one `doc.record` row to one row per entry. The schema does not change,
   the join does not change, and the C32-safe key does not change — only how
   finely the table is cut.

   THE ROWS ARE DERIVED, NOT TYPED, and that is the enforcement of §8a's
   constraint rather than a convenience. `record-entries.mjs` hands this loop
   ENTRY NUMBERS AND ASSET PATHS and nothing else — it physically cannot pass a
   headline, a dateline or a section — so a Record entry's words have no route
   into this file. Sixty entries produce sixty rows with no edit here, and none
   of them can carry a sentence of the Record.

   WHAT IS AUTHORED is the half a parser cannot know: the schedule, the
   dependencies, the reveal arc. That is `RECORD_ENTRY` below, keyed by number,
   and it is empty of everything nobody has supplied.

   REACH AND STATE ARE INHERITED FROM THE FACE, not hard-coded: an entry is
   reachable exactly when the surface holding it is. Hold the face and every
   entry goes held with it, in one place. */
/* ═══ [CH4 2026-08-12] 013's EXTRAS BLOCK IS DELETED WITH THE ENTRY ═════════
   MIKE: "013 is ALL CRAP PLACEHOLDER TRASH." Gone, not rewritten — so B2's
   choice between retiring it and marking it as the prototype is settled a third
   way and this block has nothing left to describe. `record.013` leaves the
   ledger by itself, because the rows below are DERIVED from `recordEntries()`
   and the entry is no longer there to derive one from.
   THE ARITHMETIC B2 USED TO KEEP IT WAS RIGHT AND IS NOW SPENT, WHICH IS THE
   ONE THING WORTH CARRYING FORWARD. It argued that retiring 013 would leave
   `RecordEntry.jsx`, the index budgets and the per-entry derivation exercised by
   nothing — and Records 001-005 landed since, so all three are still exercised
   and that half of the cost never came due. The half that DID come due is the
   pull-back rule: 013 was the only entry that ever named a picture, so
   `delivered()` is the empty set and the rule now has no positive case anywhere
   in the museum. That is stated in this round's log and is not repaired here,
   because repairing it means an entry delivering a picture, which is Mike's to
   write and not Ops' to invent. */
const RECORD_ENTRY = {};
{
  /* [R1 2026-08-05] the Record's face moved albums and this id moved with it */
  const face = ROWS.find(r => r.id === "face.wbr.record");
  const revealed = face && face.state === "REVEALED";
  for (const e of recordEntries()) {
    if (e.no == null) {
      /* An unnumbered entry cannot be given an id here. Minting one would be
         Ops answering M19 — what a record number means — with a guess, on the
         one surface that has already cost this museum ten invented entries. */
      console.error(
        "A Record entry carries no `no`. The ledger cannot mint an id for it:\n" +
        "  that is M19 (what a record NUMBER means), and it is Mike's to answer.");
      process.exit(1);
    }
    const nnn = String(e.no).padStart(3, "0");
    const a = RECORD_ENTRY[e.no] || {};
    R("record." + nnn, `Record ${nnn} — one entry in The Record.`,
      "document", `${RECORD_SOURCE} face.entries`,
      a.build || "LIVE",
      revealed ? "inside THE RECORD, on /robots" : null,
      revealed ? "REVEALED" : "HELD",
      { when: a.when ?? null, deps: a.deps || [], arc: a.arc ?? null,
        assets: e.assets, calledBy: a.calledBy || [], note: a.note || "" });
  }
}
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
  "document", "src/data/artists/foundation.js", "NOT_BUILT", null, "HELD", { deps: ["M13 — Mike's words"] });

/* ═════════ 8. THE ARTIFACTS AND THE PHYSICAL WORLD ═══════════════════════ */
R("phys.units", "The physical MGK units — the actual machines, in a room.",
  "prop", "the physical world", "LIVE", "photographs on /robots", "REVEALED",
  { arc: "arrived" });
R("phys.niac.whole", "A photograph of the MGK-NIAC CABINET, whole.",
  "prop", "the physical world", "NOT_BUILT", null, "HELD",
  { deps: ["Mike's camera — P4"],
    note: "[R4] THE OBJECT THIS ROW WANTS CHANGED WITH THE CANON. It used to mean the whole FIGURE, and the figure is now the egg (`egg.niac.operator`) and is deliberately unphotographed on the glass. What is missing is a frame of the CABINET whole — every plate the museum holds is inside the cage bars or cropped to the core. M30 CLOSES: the cover no longer wears the same photograph as the face below it, and it no longer wears the robot at all." });
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
  "artifact", "the physical world", "LIVE", null, "HELD",
  { deps: ["[PAPA] — whether an original is ever published"],
    note: "[H1 2026-08-06] THE REACH READ 'stated in the wing's FAQ; not shown' AND BEING MENTIONED IS NOT BEING REACHABLE. It is a stack of paper in a room; no visitor is getting to it by any route the museum could write down, and the FAQ saying the museum has it is the museum saying what it holds — which is a holdings fact and ships (Doctrine 11), not a way in." });

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

/* ═══ [R6 2026-08-05] THE CHANNEL EGG — PLANTED, AND WRITTEN DOWN ONLY HERE ══
   THIS ROW IS THE EGG'S ONLY WRITTEN FORM IN EITHER REPOSITORY, on Mike's
   instruction that the reason must not be explained on the glass. `build` is
   LIVE and `state` is REVEALED because the NUMBERS are on the drum today and a
   visitor can read them — an egg is REVEALED when it is placed, not when it is
   understood, and there is nothing further to build. `shown` is false: what a
   visitor can see is a numbered drum, and no label anywhere promises a meaning
   behind it. That is the whole difference between an egg and a debt. */
R("egg.channels", "The Portal's channel numbering — the mainframe on 1 and 2, the portable starting at 3.",
  "egg", "src/data/artists/portal.js panel.drum", "LIVE",
  null, "HELD",
  { note: "[H1 2026-08-06] THE EGG WENT BACK IN THE DRAWER WITH THE DRUM IT IS CUT INTO. It had been SPENT — planted where a visitor rolls a selector and finds numbers — and holding the Portal un-spends it, which is a thing worth noticing about eggs: one planted on a held surface is not planted at all. THE EGG, IN FULL, AND IT IS WRITTEN NOWHERE ELSE: a 1970s home device fed a television through an RF modulator and you tuned the SET to channel 3 or 4. The MGK-VIIIp is the portable, the consumer object, the one you take home — so it starts at 3, exactly where a machine like that has always started. And the numbering carries a second thing for free: NIAC holds 1 and 2 because NIAC came first, which is the true development order. Neither fact is stated on any face, in any caption, or in any label; the drum is engraved with numbers and nothing else. Explaining it on the glass would spend it in the same commit that planted it." });

/* ═══ [R4 2026-08-05] THE ROBOT — CANON, HELD, AND OFF EVERY FRAME ══════════
   MIKE: "NIAC is so complicated THEY NEEDED A ROBOT TO OPERATE IT. The robot —
   camera-body head, brass tee shoulders, conduit limbs — is a HUGE EASTER EGG
   and is not the subject. The robot stays out of frame until deliberately
   spent."
   THE MUSEUM HELD SEVEN PHOTOGRAPHS OF IT ON A PUBLIC WALL until this round,
   captioned by part, on the album named for the machine it operates — so this
   row is not a plan, it is a retraction that had to be built. `build` is LIVE
   because the material exists and is good; `state` is HELD because it is off
   the glass; `shown` is FALSE because nothing anywhere hints at it, which is
   the difference between an egg and a promise. */
R("egg.niac.operator", "The robot that operates the mainframe — the reason NIAC needs one at all.",
  "egg", "the physical world; three plates in weird-baby-robots/robots/mgk-viii/plates/2021-03-19", "LIVE",
  null, "HELD",
  { deps: ["Mike's ruling on when it is spent", "a photograph, if the egg is ever to be spent on the glass"],
    note: "[K1 2026-08-07] THE MUSEUM'S SEVEN PLATES ARE DELETED AND THIS ROW IS WHAT THAT COST, WRITTEN DOWN. Mike ruled the eleven held photographs killed — *\"none are very good, and if that view is ever needed it gets reshot\"* — and seven of them were this egg's only material in this repository (head at the lens, head three-quarters, chest and shoulders, lower limbs, unfinished torso, feet on a plinth, a slot mock-up). They are off disk and out of both provenance files. **THE EGG SURVIVES AND ITS MATERIAL IS NOW THREE PLATES, ALL OF THEM UPSTREAM AND ALL OF THEM REGENERABLE**: `MAGIC8-2021-P01-the-eye.jpg`, `P02-the-shoulder.jpg` and `P04-the-hand-on-control.jpg` in the robots repo's culled 2021 set — the eye, the shoulder, the hand on the control — cut from `IMG_1526.MOV` under that repo's OBFUSCATION_LAW, with the crop rectangles recorded so any of them can be rebuilt from the source video. `build` stays LIVE because the material still exists; what changed is that it exists in ONE repository instead of two, and none of it is here. Spending it is still one data block and no code, and now it is also one file copy." });

/* ═══ [N9 2026-08-06] THE PRESET AS AN EGG SURFACE — MIKE'S OWN CONSEQUENCE ══
   He gave the archive's groupings as a curation instruction and then named the
   thing they are ALSO good for, in the same breath: *"presets are a good way to
   hide an egg, to reveal one, and to make certain things spell something out
   when they come together."* His instruction was to LEDGER that consequence,
   not to build against it, and the two halves of that are why this row exists
   and why it is `NOT_BUILT`.

   THE THREE MECHANISMS ARE DIFFERENT AND THE THIRD IS THE ONE NOTHING ELSE IN
   THIS TABLE CAN DO.
     HIDE     a photograph that belongs to no named grouping is on the wall only
              under the coarse everything, which is the preset a casual visitor
              never presses. It is held in plain sight by being filed last.
     REVEAL   a grouping that APPEARS — one more button than there was last
              month — is a reveal that costs no page, no route and no words. The
              wall is the same wall; the drawer is new.
     SPELL    and this is the one worth holding: a grouping's MEMBERS, read in
              its own order, can carry something none of them carries alone. An
              acrostic down the captions. A sequence of lit panels that reads as
              digits. A set whose count is the answer to something asked
              elsewhere. The order is authored, so the order can mean.

   WHY IT IS NOT BUILT AND MUST NOT BE BUILT QUIETLY. Every one of the three
   spends a photograph, an ordering or a caption, and all three of those are
   Mike's — Doctrine 12 puts the CONTENT of an egg with him even where the
   MECHANISM is Ops'. What this round shipped is the mechanism, empty: seven
   groupings across two walls, every one of them an honest cut with no second
   reading in it. `shown: false` because nothing on any page hints that a
   grouping could be anything other than a grouping, which is the whole
   difference between an egg and a debt. */
R("egg.presets", "The archive's groupings as an egg surface — hide, reveal, or spell something out in the order.",
  "egg", "src/data/artists/robots.js face.presets", "NOT_BUILT",
  null, "HELD",
  { deps: ["Mike's photographs, orderings or captions — the content is his"],
    note: "THE MECHANISM SHIPPED AND THE EGG DID NOT, and the row exists so the second half is not lost with the round log. N9 built `face.presets` on both machine archives (Exhibit.jsx `ArchivePresets`): a named, ordered subset of a wall, with its own count on its own button. Nothing about it is egg-specific and that is the point — a grouping that hides, reveals or spells is the SAME data shape as the four honest ones now shipping, so planting one costs a data block and no code, and nobody can tell from the machinery which kind is present. Mike's own words for the consequence: presets are a good way to hide an egg, to reveal one, and to make certain things spell something out when they come together." });

/* ═══ [P4 2026-08-05] THE POKE — RAISED, GRADED, AND DELIBERATELY NOT BUILT ══
   MIKE: "pixel-perfect tap on the Weird.Baby logo's EYE and he BLINKS, as if
   poked. Three pokes in a row and he wears SAFETY GLASSES for the rest of the
   session."

   OPS GRADE: A+++++ , and the grade is written down with its reasons rather
   than as a compliment, because the reasons are the specification.
     · IT IS FOUND BY DOING SOMETHING NOBODY IS TOLD TO DO. No label, no
       cursor change, no hint — the only route in is a visitor idly poking a
       face on a screen, which is a thing people do to faces on screens.
     · IT COSTS NOTHING ON THE GLASS. Zero words, zero controls, zero pixels of
       new furniture. Under the Law of Subtraction that is the strongest
       position an addition can occupy: nothing is lost if a visitor never
       finds it, and nothing was spent to leave it there.
     · THE ESCALATION IS THE PART NO OTHER EGG IN THIS TABLE HAS. Every one of
       the other twelve is a single state — you trip it or you do not. This one
       ANSWERS BACK on the third try, so the reward is for persistence rather
       than for luck, and the second reward is a JOKE ABOUT THE FIRST that is
       only legible to the person who caused it.
     · IT IS ON THE ONE OBJECT EVERY VISITOR MEETS. The mark is on the front
       page and nowhere else in the building, so the egg is reachable by
       everybody and advertised to nobody.

   WHAT IT WAITS ON, AND NEITHER HALF IS CODE: the blink and the safety glasses
   are ART — a closed-eye state of the mark and a glasses state — and this
   museum does not invent its own images (M9's whole standing argument). The
   mechanism after that is a hit region, a counter and a session flag.
   ONE CONSTRAINT ALREADY CHECKED, so nobody discovers it late: "for the rest of
   the session" means browser storage, and `/booth`'s privacy answer already
   covers exactly that shape — the machine remembers you, the museum does not,
   settings survive, no cookie travels. Building this does not change that
   answer. Building it with a server round-trip would, and that is the version
   not to build.
   `shown` IS FALSE and must stay false: the moment any surface hints at it, it
   stops being an egg and becomes a debt.

   [M1 2026-08-05] AND MIKE HAS SET A PRECONDITION ON WHAT COMES AFTER IT:
   "do not bother with a next-level egg until this one at least catches on."
   Recorded here because it is a rule about this table and not about this row —
   THE POKE IS THE GATE ON EVERY FUTURE EGG, and anyone reading the A+++++ as
   an invitation to design its sequel has read it backwards. Two things follow
   that are worth stating rather than inferring.
   FIRST, IT IS A CONDITION ON A THING THAT DOES NOT EXIST YET, so it cannot be
   met by building the poke — it is met by the poke being FOUND, by somebody
   who was not told. SECOND, AND THIS IS THE PART WITH A COST: the museum has
   no way to know that today. `/admin` counts visits and the guest book; no
   egg in this table reports being tripped, and `egg.replay` — the one a
   visitor can already trip — has never been instrumented either. So "catches
   on" is currently unmeasurable, and the honest reading is that the next egg
   waits on Mike saying so rather than on a number. Naming that is not a
   proposal to build analytics; /booth's privacy answer is the reason it would
   be a bigger decision than it looks. */
R("egg.lobby.poke", "The poke — a pixel-perfect tap on the eye of the Weird.Baby mark, and he blinks. Three in a row and he puts on safety glasses.",
  "egg", "not built — the mark is placed in src/routes/WbHome.jsx", "NOT_BUILT",
  null, "HELD",
  { deps: ["the blink art — a closed-eye state of the mark", "the safety-glasses art",
           "a hit region on the eye, a three-count, and a session flag"],
    note: "RAISED BY MIKE AND GRADED A+++++ (P4, 2026-08-05), and deliberately not built in the round that raised it — the reasons are in the block above this row and they are the specification. The two art states are Mike's; the mechanism is small and comes after them. [M1 2026-08-05] IT IS ALSO THE GATE ON EVERY FUTURE EGG — Mike: do not bother with a next-level egg until this one at least catches on. Nothing in this museum reports an egg being tripped, so that condition is met by his word and not by a number. C40." });

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
  /* [CH4 2026-08-12] the house artist's plate is `null` because Mike deleted
     `hunter-root-plate.jpg`. Same shape Mikey Mike has carried all along. */
  ["hunter-root", "Hunter Root", null],
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
/* [2026-08-16b] THE FRIEND TILE — HELD, AND IT HAD NO ROW AT ALL UNTIL TODAY.
   The quarter-size friend tile shipped on 2026-08-15 carrying Coalition for the
   Homeless, and nothing in this ledger knew it existed — so it could not have
   been reported as live, and it could not have been reported as held either.
   Mike hid it on 2026-08-16 ("looks like shit": a name and a door in a box, no
   picture, beside four tiles that are all picture). `wbFriends` is now an empty
   array and `GiftShop.jsx` draws no section; the ENTRY is kept whole and
   addressed in `wb_roster.js` as `wbFriendsHeld`, and the tile type, its grid,
   its preview well and the "last in whatever content is already defined" rule
   are all untouched. It comes back when there is a picture — S-g. */
/* [2026-08-16c] THE ONE OUTBOUND DOOR IN THE BUILDING, DECLARED. Mike ruled the
   donate passage in: *"This is the ONLY place on the site that links to
   giving."* A single external anchor, inside one sentence of one FAQ answer —
   no footer, no tile, no page ending. It is in the ledger for the same reason
   `shop.friends` is: **a door that nothing records is a door nobody can
   report.** The 2026-08-14 door it replaces never had a row, which is how it
   could be struck and re-cut twice in one day with the table saying nothing.
   REVEALED with a reach, because it is on the glass and a visitor can use it. */
/* [2026-08-17] AND IT IS HELD AGAIN, ONE DAY LATER, ON HIS RULING. He struck the
   answer that carried it — "Needs more work than I can afford today" — with the
   consequence stated to him in the same instruction, so this is a CHOICE and not
   the accident S-i reported. The row stays rather than being deleted, which is
   the point of having declared it: **the museum currently publishes no route to
   giving, and the table says so out loud.** LIVE + no reach + HELD is the shape
   THE GATE CORRECTED THE FIRST ATTEMPT AND WAS RIGHT. It was written LIVE +
   HELD, carried by `src/data/artists/foundation.js`, and `reachability.mjs`
   refused it: a built-and-held row in a PUBLIC module ships its strings anyway,
   because a boolean stops the render and not the bundle. **That rule does not
   describe this case and the fix is to stop claiming LIVE.** The answer is
   DELETED from the module, not gated — nothing of it is in any chunk — so what
   is not built is the DOOR. What survives is a renderer with no caller, and a
   renderer is a container rather than a door. NOT_BUILT is the honest word and
   is exactly what the rule exempts: "a NOT_BUILT thing is unreachable because
   there is nothing to reach." */
R("door.coalition", "The donate door — the only outbound link to giving in the museum.",
  "commerce", "—", "NOT_BUILT", null, "HELD",
  { deps: ["the donate answer, which Mike struck on 2026-08-17 pending more work"],
    shown: true,
    note: "Inline in Mike's own sentence (`inlineDoor`, Exhibit.jsx), not a link "
        + "affordance — he ruled against building one. `inlineDoor`, "
        + "`.vp-faq-inline-link` and the `inline` field are kept and have zero "
        + "callers while this is held." });
R("shop.friends", "The friend tile — Coalition for the Homeless in the gift shop.",
  "commerce", "src/data/wb_roster.js wbFriends", "NOT_BUILT", null, "HELD",
  { deps: ["a preview image for the tile — Mike, S-g"], shown: true,
    note: "Built and hidden, not unbuilt: the tile type, the quarter-size grid, "
        + "the preview well and the ordering rule all exist and are exercised by "
        + "nothing while the list is empty. Reveal is one entry moved back into "
        + "`wbFriends` plus an image path." });

/* ═════════ 13. RETIRED — struck, and named so nobody rebuilds them ════════ */
const RET = (id, name, when) =>
  R("retired." + id, name, "surface", "—", "NOT_BUILT", null, "RETIRED", { note: when });
RET("hr.home", "/hr/home — a stock interior photo with four room names painted into the JPEG.", "deleted v46/C3");
RET("hr.fanwall", "/hr/fan-wall — thirteen fabricated fan testimonials.", "deleted v46/C3");
RET("hr.media", "/hr/media — one line reading '— coming soon.'", "deleted v46/C3");
RET("robots.parts", "THE PARTS — a whole face on the MGK-NIAC album.", "deleted v50/N1; orphaned parts_drawer.jpg, which Mike killed at K1 2026-08-07 — M9 closes");
/* [R3 2026-08-05] THE THREE FRONT-DESK FACES. Struck on Mike's instruction to
   simplify the robots homepage; what survived each is folded into the FAQ, and
   what was deleted outright is named in robots.js above the FAQ rather than
   left to be discovered. */
RET("robots.welcome", "WELCOME — the wing's orientation face, and /robots' landing.",
  "struck v56/R3; its lead, contents register, WHERE TO START, purveyor posture, method, WHY WE BOTHER and family shot all folded into the FAQ");
RET("robots.doc-control", "DOC CONTROL — the manuals, the originals, the files, and its APPROVED stamp card.",
  "struck v56/R3; Mike's came-in-pieces canon and the originals-are-held statement folded into the FAQ, both with their [PAPA] markers intact. Closes C31 by deletion");
RET("robots.contact", "CONTACT — the address and three reasons to write, and its address card.",
  "struck v56/R3; the address and all three subjects folded into one FAQ answer");
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
  "src/data/artists/foundation.js LEDGER", "LIVE", "the shop", "REVEALED");
R("channel.music", "Giving channel — the house's own music.", "commerce",
  "src/data/artists/foundation.js LEDGER", "LIVE", "/wb", "REVEALED");
R("channel.qr", "Giving channel — given in Weird.Baby's name, by a code you scan.", "commerce",
  "src/data/artists/foundation.js LEDGER", "NOT_BUILT", null, "HELD",
  { deps: ["a payment mechanism nobody has built"], shown: true,
    note: "This row will read LIVE on the day that is real, and not one day before." });
R("channel.supplies", "Giving channel — a registry of supplies.", "commerce",
  "src/data/artists/foundation.js LEDGER", "NOT_BUILT", null, "HELD",
  { deps: ["a public list of what the museum actually needs"], shown: true });
R("channel.services", "Giving channel — a registry of services.", "commerce",
  "src/data/artists/foundation.js LEDGER", "NOT_BUILT", null, "HELD",
  { deps: ["the same list, for work rather than goods"], shown: true });

/* ═════════ WRITE ═════════════════════════════════════════════════════════
   THE VALIDATION IS `reveal/schema.mjs`'s, not this file's. Until R1 the rules
   lived in two places — five checked here as the file wrote, four checked by
   `reveal:check` afterwards, and the two lists were neither identical nor a
   superset of each other. They are one function now and both callers run it.

   [T1 2026-08-05] THE TRANSFER CLASS IS STAMPED ON HERE, NOT AUTHORED PER ROW.
   `reveal/transfers.mjs` holds the four classes, the assignment and the written
   exemptions in ONE PLACE, so the timeline can be READ as a timeline instead of
   being reassembled out of 152 scattered fields. It runs BEFORE validation
   because `validate()` enforces its rule, and AFTER the Record's derived rows
   exist because they are subject to that rule like everything else. */
applyTransfers(ROWS);
const faults = validate(ROWS);
if (faults.length) {
  console.error(`THE DECLARATION IS INVALID — ${faults.length} fault(s):`);
  faults.forEach(f => console.error("  " + f));
  process.exit(1);
}
if (unresolved.length) {
  console.error("ASSET REFS NOT IN THE ASSET TABLE:", [...new Set(unresolved)]);
  process.exit(1);
}

const out = {
  _: "THE REVEAL LEDGER. One row per revealable thing across both repos: what it is, where it lives, what is TRUE TODAY about the build, whether a visitor can reach it, whether it should be reachable yet, when the story lets it out, and what has to happen first. Authored in reveal/ledger-declare.mjs — edit there, never here.",
  _states: "state: HELD (built or part-built and deliberately not reachable) · REVEALED (a visitor can get to it today) · RETIRED (was here, struck, named so nobody rebuilds it). NOT the same axis as `build`.",
  _build: "build: LIVE · PARTIAL · STUB · NOT_BUILT — what is true today, never what is planned.",
  _when: "when: the story day or week a row becomes REVEALED. NULL ON EVERY ROW, by Doctrine 12 — Mike has supplied the arc (twelve weeks; month 1 the arrival, month 2 the turn, month 3 the reckoning) but no reveal dates, and this file does not invent them. NOT the same field as `transferWeek`: that is when the material ARRIVED, this is when a visitor gets it.",
  _transfer: "transfer: [T1] WHICH OF THE FOUR TRANSFERS BROUGHT THE MATERIAL INTO THE HOUSE — BLAST (Friday–Sunday pre-launch; everything the site already shows, and deliberately more) · PACKAGE (weeks 3–7, physical, four Fridays; earns its photographs) · UNLOCK (in hand from the start, could not be opened; no arrival needed) · TRANSMISSION (months 2–3, because they never stopped). THE RULE: an asset may only be SHOWN after it has been TRANSFERRED, and every row belongs to exactly one class or is exempted IN WRITING with a reason. Null here means exempted, and an exempt row may not be REVEALED. Classes, assignment, exemptions and the three checks: reveal/transfers.mjs. The timeline Mike reads: docs/ASSET_TIMELINE.md.",
  _transferWeek: "transferWeek: the week the material ARRIVED. 0 for BLAST (stated: pre-launch) and 0 for UNLOCK (derived by necessity — an unlock is of a thing already in hand, and it is in hand because the blast brought it). NULL for PACKAGE and TRANSMISSION, because the arc gives windows (weeks 3–7 on four Fridays; weeks 5–12) and names no week inside them — five weeks and four packages, and which one goes empty nobody has said. A null here means EXACTLY ONE THING: no named arrival, therefore not showable.",
  _arc: "arc: THE REVEAL ARC (Mike, 2026-08-04) — arrived · understood · partial · online · null. Same field, same values, as provenance/asset-table.json. `null` is UNSET and is not a stage.",
  _shown: "shown: true where a VISITOR CAN SEE THE LABEL of something that is not built — an engraved drum position that will not arm, a register row printed NOT BUILT, a document a face names and does not hold. It separates a PROMISE from a private gap. The twin's stub rows are NOT shown, because THE STUB LAW strips them from the menus.",
  _assets: "assets: asset-table `uid`s, resolved from public refs at build time. The uid survives a rename; the path does not — see C32.",
  _prod: "prod: [R3] THE PRODUCTION ARC — needed · printed · photographed · placed. The manual-page vessel's field and no other row's; null everywhere else. NOT the same field as `arc`: `arc` is how the house REVEALS a thing it has, `prod` is whether the house HAS it. `build` is DERIVED from it, so a page cannot claim a state the world is not in.",
  _calledBy: "calledBy: [R3] the `record.NNN` rows whose entries ask for this thing — Mike's ruling that the manual arrived in pieces, so the museum needs only the pages the story reaches for. Validated against real rows: nothing can be called for by an entry that does not exist.",
  _record: "record.NNN: [R1] one row per Record ENTRY, DERIVED from src/data/artists/robots.js rather than typed. The reader hands this table entry numbers and asset paths and nothing else, so a Record entry's headline, dateline or sections have no route into the ledger. THE LEDGER MUST NEVER BECOME A SECOND COPY OF THE RECORD (audit §8a) — `reveal:check` fails if any row here holds six consecutive words of the Record's own prose.",
  _join: "provenance/asset-table.json is one row per FILE and stays the authority on files. This is one row per REVEALABLE THING. Neither restates the other; they meet at `assets`.",
  generated: "node reveal/ledger-declare.mjs --write",
  rows: ROWS,
};

/* ═══ [D4 2026-08-09] THE SECOND UNGUARDED DECLARER, AND IT IS THE SHAPE §8
   NAMED AND LEFT ═══════════════════════════════════════════════════════════
   M99 was `provenance/assets-declare.mjs` drifting from the file it writes: a
   generator regenerates its output WHOLE from an array in its own source, so a
   row added to the JSON by hand is a row the next `--write` deletes without a
   word. It was five rows when A3 found it and FORTY-FIVE by the time H2 built
   the refusal into the writer.

   OPERATIONS §8 recorded, in the same breath, that "the same shape still applies
   to any other `*-declare.mjs` in `provenance/` and to `reveal/ledger-declare.mjs`,
   neither of which has a guard." This is that guard, and it is the same guard —
   deliberately the same shape, so the two cannot drift in their own turn.

   THE DRIFT IS ZERO TODAY AND THAT IS THE ARGUMENT FOR ADDING IT NOW, NOT
   AGAINST. A guard written while the drift is zero cannot be wrong about what to
   keep; one written after 45 rows have accumulated has to decide which file is
   the source first, which is what H-b cost. Measured before this was written: a
   `--write` reproduced `ledger.json` byte for byte.

   IT MATCHES ON `id` because that is this table's name for a row, the thing
   every other file joins to, and the only field a hand edit cannot help but
   carry. */
if (process.argv.includes("--write")) {
  const at = path.join(REPO, "reveal", "ledger.json");
  if (fs.existsSync(at)) {
    const live = JSON.parse(fs.readFileSync(at, "utf8")).rows || [];
    const declared = new Set(ROWS.map(r => r.id));
    const lost = live.map(r => r.id).filter(id => !declared.has(id));

    /* ═══ [CH4 2026-08-12] `--drop-deleted`, THE SAME SHAPE THE ASSET DECLARER
       GOT AND FOR THE SAME REASON ═══════════════════════════════════════════
       Mike deleted Record 013. `record.NNN` rows are DERIVED from the Record's
       own entries, so the row left by itself — correctly — and this guard read
       that as drift and refused the regeneration.
       THE DIFFERENCE IS CHECKABLE HERE TOO, and the check is the derivation
       itself: a `record.NNN` row is legitimately gone exactly when the Record no
       longer holds entry NNN. Anything else in `lost` — a surface, a document, a
       sound, an egg — is real drift and still refuses, because nothing derives
       those and a missing one means the declarer changed under the file.
       SO THIS IS NOT A `--force` EITHER. It cannot drop a row whose entry is
       still in the Record, and it cannot drop a row that is not a record row at
       all. It prints what it dropped, for the reason the sibling does. */
    const RECORD_ROW = /^record\.(\d{3})$/;
    const liveEntryNos = new Set(recordEntries().map(e => String(e.no).padStart(3, "0")));
    const droppable = (id) => {
      const m = RECORD_ROW.exec(id);
      return !!m && !liveEntryNos.has(m[1]);
    };
    const dropping = process.argv.includes("--drop-deleted");
    const stillDrift = dropping ? lost.filter(id => !droppable(id)) : lost;

    if (stillDrift.length) {
      console.error(
        "\nREFUSED — writing would delete " + stillDrift.length + " row(s) that exist in" +
        "\nreveal/ledger.json and are NOT declared in this file. That is M99's shape," +
        "\nand it is what this guard exists for: the declarer has drifted from the file" +
        "\nit writes, so a --write is a silent deletion rather than a regeneration.\n\n" +
        stillDrift.map(id => "  " + id).join("\n") +
        (dropping
          ? "\n\n--drop-deleted was passed and does NOT cover these. It drops only" +
            "\n`record.NNN` rows whose entry is gone from the Record; every id above is" +
            "\neither still derivable or is not a record row at all."
          : "\n\nEither declare them here, or decide ledger.json is the source and retire" +
            "\nthis generator. Do not delete the guard. If a RECORD ENTRY was deleted," +
            "\nthe flag for that is --drop-deleted."));
      process.exit(1);
    }
    if (dropping && lost.length) {
      console.log("--drop-deleted — " + lost.length + " row(s) dropped, entry gone from the Record:");
      for (const id of lost) console.log("  " + id);
    }
  }
  fs.writeFileSync(at, JSON.stringify(out, null, 1) + "\n");
  console.log("wrote reveal/ledger.json");
}
const by = f => ROWS.reduce((m, r) => (m[r[f] ?? "—"] = (m[r[f] ?? "—"] || 0) + 1, m), {});
console.log(`${ROWS.length} rows`);
console.log("  by state ", JSON.stringify(by("state")));
console.log("  by build ", JSON.stringify(by("build")));
console.log("  by class ", JSON.stringify(by("cls")));
console.log("  by transfer", JSON.stringify(by("transfer")));
for (const c of Object.keys(TRANSFERS)) {
  const n = ROWS.filter(r => r.transfer === c).length;
  console.log(`    ${TRANSFERS[c].n}. ${c.padEnd(12)} ${String(n).padStart(3)}  ${TRANSFERS[c].name}`);
}
console.log(`    exempt, in writing ${String(ROWS.filter(r => !r.transfer).length).padStart(3)}`);
console.log(`  with a story date: ${ROWS.filter(r => r.when).length}`);
console.log(`  with dependencies: ${ROWS.filter(r => r.deps.length).length}`);
console.log(`  joined to assets : ${ROWS.filter(r => r.assets.length).length}`);
