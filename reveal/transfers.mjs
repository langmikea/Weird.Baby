/* ===========================================================================
   THE FOUR TRANSFER CLASSES — how material got into the house, and the rule
   that a thing may not be SHOWN before it has been TRANSFERRED.
   [T1 2026-08-05]
   ---------------------------------------------------------------------------
   MIKE'S INSIGHT, which is the foundation the whole model is built on and is
   recorded here because everything else follows from it:

     THE FIRST RECORD MUST PRODUCE THE FIRST IMAGES OF NIAC AND VIIIp so the
     site has images to post — WHICH MEANS THOSE IMAGES ARRIVED IN THE EMAIL
     BLAST. That is cover for everything else the site already shows, and it
     opens slots for foreshadowing, for specificity, and for setting scope.

   Read it twice, because it does more work than it looks like it does. The
   museum went live with photographs on it. Photographs are material. Material
   has to have come from somewhere. Once the blast is the answer for the two
   plate archives, it is the answer for every other thing that was on the glass
   at launch — the faces, the twin, the portal, the sounds, the Record's first
   entry — and the site stops needing a separate explanation per object.

   And it pays twice: a blast that carried MORE than was published means every
   later reveal of already-built material needs NO NEW ARRIVAL. Foreshadowing
   becomes free. That is why class 1 is deliberately larger than the set of
   things the site actually showed.

   ═══ THE FOUR CLASSES ═══════════════════════════════════════════════════════
   Ops-designed on Mike's instruction, 2026-08-05. Each row belongs to exactly
   one, or is declared exempt in writing. There is no fifth and no blank.

     1. BLAST         Friday to Sunday, pre-launch. Everything the site already
                      shows arrived here, plus material held and not shown.
     2. PACKAGE       Weeks 3–7, physical. Units, cases, objects, manual
                      pieces. These EARN their photographs — we can only show
                      what we hold.
     3. UNLOCK        Throughout. Things already in hand that could not be
                      opened: zips, folders, pages. No arrival needed, which
                      makes them the most flexible lever in the arc.
     4. TRANSMISSION  Months 2–3, because they never stopped. The back half's
                      knock at the door.

   ═══ THE RULE, AND WHY IT IS THREE CHECKS AND NOT A SENTENCE ═══════════════
   "An asset may only be SHOWN after it has been TRANSFERRED." Made checkable:

     (a) EVERY ROW IS PLACED OR EXEMPTED, IN WRITING. A row in neither table
         is a fault. This is the half that makes the model exhaustive instead
         of decorative — the failure mode of a catalogue is silence, and a
         classification with a default is a classification with a hole.
     (b) NOTHING UNARRIVED IS ON THE GLASS. A row whose material has no
         arrival week (`transferWeek: null` — the packages and the later
         transmissions, whose weeks nobody has named) may not be REVEALED.
         Neither may an EXEMPT row: exemption covers what the fiction does not
         describe, and it must never become the back door round (b).
     (c) NOTHING IS SHOWN BEFORE IT LANDS. Where a row carries both a reveal
         week (`when`) and an arrival week, `when` may not precede it.

   Consequence, and it is the model's whole spine: **every one of the 94 rows a
   visitor can reach today is BLAST**, because the blast is the only transfer
   that had happened when the doors opened.

   ═══ WEEKS: WHAT THE ARC SAYS AND WHAT IT DOES NOT ═════════════════════════
   Mike's arc — twelve weeks; month 1 the arrival; month 2 the turn, where the
   units get understood and stop being the point; month 3 the reckoning; four
   Fridays that carry packages; transmissions that never stop.

   That fixes TWO arrival weeks and no more:

     BLAST  → week 0. Stated: Friday to Sunday, pre-launch.
     UNLOCK → week 0. Derived by necessity, not guessed: an unlock is of a
              thing ALREADY IN HAND, and the only way it is already in hand is
              that it came in the blast. "No arrival needed" is the same
              sentence as "its arrival was week 0." What stays open on an
              unlock is its REVEAL week, which is `when`, which is unset.

   And it fixes NEITHER of the other two:

     PACKAGE      → window weeks 3–7, four Fridays. FIVE weeks, FOUR packages.
                    Which week goes empty is not in the arc, so no package row
                    carries a week. Guessing one would be Doctrine 12.
     TRANSMISSION → window weeks 5–12. "They never stopped" is a rhythm, not a
                    schedule; no transmission row carries a week.

   `transferWeek: null` therefore means EXACTLY ONE THING — the material has no
   named arrival yet — and check (b) is what gives that meaning teeth.

   ═══ WHAT THIS IS NOT ══════════════════════════════════════════════════════
   NOT the four REVEAL classes. Those are ANNOUNCED · HINTED · DISCOVERED ·
   HELD, named in the robots repo's `docs/ASSET_REVEAL_CHECKLIST.md`, and they
   answer HOW A THING IS SHOWN. These answer HOW IT GOT HERE. A single object
   has one of each and they are independent: the Portal is BLAST and ANNOUNCED,
   the buffalo nickels are PACKAGE and arguably never shown at all.

   NOT `arc` and NOT `prod`. `arc` is the reveal arc (arrived · understood ·
   partial · online); `prod` is the manual-page vessel's production arc. This
   is a third axis and it is authored, not derived from either.
   =========================================================================== */

export const CLASSES = ["BLAST", "PACKAGE", "UNLOCK", "TRANSMISSION"];

/* `opens`/`closes` are the arc's window for the class. `week` is the arrival
   week every row in the class carries, or null where the arc names none. */
export const TRANSFERS = {
  BLAST: {
    n: 1, week: 0, opens: 0, closes: 0,
    name: "THE BLAST — Friday to Sunday, pre-launch.",
    holds: "Everything the site already shows, and deliberately more than was published.",
  },
  PACKAGE: {
    n: 2, week: null, opens: 3, closes: 7,
    name: "THE PACKAGES — weeks 3–7, physical, on four Fridays.",
    holds: "Units, cases, objects, manual pieces. They earn their photographs.",
  },
  UNLOCK: {
    n: 3, week: 0, opens: 0, closes: 12,
    name: "THE UNLOCKS — throughout; in hand from the start.",
    holds: "Things already held that could not be opened. No arrival needed.",
  },
  TRANSMISSION: {
    n: 4, week: null, opens: 5, closes: 12,
    name: "THE LATER TRANSMISSIONS — months 2–3, because they never stopped.",
    holds: "The back half's knock at the door.",
  },
};

/* ═══ THE ASSIGNMENT ════════════════════════════════════════════════════════
   One entry per ledger row. Grouped by class so the timeline reads as a
   timeline; the check does not care about the order.                        */

const BLAST = [
  /* ── The routes. The museum went live as a museum: every address that
        answered on day one answered because the material behind it was in the
        blast. `route.hr` and `route.admin` are HELD and are still BLAST — they
        arrived, they are simply not listed, which is the class's second half
        working exactly as intended. */
  "route.lobby", "route.booth", "route.foundation", "route.shop", "route.robots",
  "route.wal", "route.wb", "route.hr", "route.hr.archive", "route.admin",
  "route.preset", "route.catchall", "route.money",

  /* ── The robots wing's faces. THIS IS MIKE'S INSIGHT, LANDED: `face.niac.plates`
        (eight details of the MGK-NIAC) and `face.viiip.plates` (nine plates of
        the VIIIp) are the first images of the two machines, they were on the
        glass at launch, and the blast is where they came from. Every other face
        rides in behind them at no extra cost. */
  "face.wbr.about", "face.wbr.faq", "face.wbr.doc-control", "face.wbr.contact",
  "face.niac.name", "face.niac.plates", "face.niac.firmware",
  "face.viiip.plates", "face.viiip.record", "face.viiip.manual",
  "face.viiip.firmware", "face.viiip.portal", "face.viiip.faq",

  /* ── The Portal, and the tension Mike named. THE PORTAL ARRIVED IN THE BLAST
        AND COULD NOT BE DRIVEN YET — the panel is on the glass from day one,
        and most of its drum will not arm. The four positions that DO work are
        here; the five that do not are UNLOCKs, below. That is the stuck-portal
        maintenance-mode lore expressed as two classes rather than asserted. */
  "portal.feed.standard", "portal.switch.maint", "portal.switch.prompt",
  "portal.dial.live",

  /* ── The twin's working apps. The whole simulator came in the blast. */
  "twin.app.answers", "twin.app.polarity", "twin.app.clarity", "twin.app.messages",
  "twin.app.probabilities", "twin.app.detectors", "twin.app.advice.panel",
  "twin.app.appp", "twin.app.radio", "twin.app.eliza", "twin.app.brain",
  "twin.app.ink", "twin.app.tap", "twin.app.maint", "twin.app.calc",
  "twin.app.note", "twin.app.fortune", "twin.app.horoscope", "twin.app.bs",
  "twin.app.voice", "twin.app.user.name",

  /* ── The twin's games. All twelve play today. */
  "twin.game.tilt-drive", "twin.game.gobble", "twin.game.avoidsteroids",
  "twin.game.snowglobe", "twin.game.tictactoe", "twin.game.slots",
  "twin.game.craps", "twin.game.blackjack", "twin.game.roulette",
  "twin.game.mailrun", "twin.game.sniper", "twin.game.stopnum",

  /* ── The twin's own surfaces. `twin.scaffold` is HELD and BLAST: the honest
        stub screen is built and simply not put in front of anyone. */
  "twin.boot", "twin.monitor", "twin.parcels", "twin.userrecord", "twin.scaffold",

  /* ── The documents that were on the glass. `doc.manual` IS THE FIRST HALF OF
        THE MANUAL TENSION (see MANUAL_SPANS_CLASSES below): the volume is named
        and readable from launch, and the pages that prove it arrive later, in
        packages. `doc.charter` is HELD and BLAST — written, in the tree,
        unpublished. */
  "doc.manual", "doc.record", "record.013", "doc.firmware", "doc.charter",

  /* ── The machines themselves, as a subject. The UNITS are not the transfer —
        their PHOTOGRAPHS are, and those were in the blast. The unit arriving in
        a box is `phys.cases` and `phys.niac.whole`, which are PACKAGEs. */
  "phys.units",

  /* ── The eggs a visitor can already trip. `egg.replay` is HELD and BLAST and
        is the clean edge of the UNLOCK boundary: it is wired, working, and
        deliberately unexposed, so what it waits on is a DECISION TO SHOW, not
        an opening. That is the discriminator between this class and class 3. */
  "egg.name", "egg.calculator", "egg.renamed-games", "egg.replay",

  /* ── The sounds. Every one of them is a file that shipped with the twin.
        `sound.datatransfer` and `sound.electrical-short` are HELD and BLAST for
        the same reason `egg.replay` is: in hand, unspent. */
  "sound.select", "sound.scroll", "sound.connected", "sound.powermaury",
  "sound.connectionsuccess", "sound.beepsandboops", "sound.whitenoise",
  "sound.datatransfer", "sound.slosh", "sound.direct.dial90", "sound.direct.modem",
  "sound.direct.reveal", "sound.direct.cards", "sound.direct.glitch",
  "sound.direct.snowglobe", "sound.electrical-short",

  /* ── Worth A Listen, the shop's one product, and the two live giving
        channels. THESE ARE NOT MGK MATERIAL AND THE FICTION DOES NOT REACH
        THEM — they are BLAST BY NECESSITY under rule (b): they were on the
        glass on day one, and the rule admits no other answer for a thing a
        visitor could already see. Flagged rather than smoothed over; the
        unplaceable half of the same problem is in EXEMPT. */
  "wal.carsie-blanton", "wal.hunter-root", "wal.jesse-welles", "wal.mikey-mike",
  "wal.banners", "shop.sticker", "channel.shop", "channel.music",
];

const PACKAGE = [
  /* ── THE SECOND HALF OF THE MANUAL TENSION, and it is the no-single-copy
        fiction working rather than a contradiction to hide. The volume is
        class 1; its PAGES are class 2, because a photographed page is a
        photograph of a thing somebody is holding. `doc.manual.plates` is the
        promise the glass already makes (`shown: true`) and cannot yet keep. */
  "doc.manual.plates",
  "doc.record.evidence",

  /* ── The physical world. Every one of these is Mike's own instruction for
        the class: "we can only show what we hold." `phys.manual.original` is
        LIVE and HELD — he holds them; what the package earns is the
        photograph, not the object. `phys.nickels` is here and may be revealed
        NEVER, which is the SEALED gap (M35) and not this model's to close. */
  "phys.niac.whole", "phys.cases", "phys.nickels", "phys.time",
  "phys.manual.original",

  /* ── A physical prop, and the games that only exist on a physical unit. */
  "egg.matchbook", "twin.games.unit",
];

const UNLOCK = [
  /* ── THE FIVE DRUM POSITIONS AND THE SEEDED DIAL. The canonical unlock, and
        the reason the class earns its place: they are ENGRAVED WHERE A VISITOR
        READS THEM and they will not arm (`shown: true`, `build: NOT_BUILT`).
        Nothing has to arrive for them. They are in hand, in the panel, shut. */
  "portal.feed.idling-updated", "portal.feed.boot-playback",
  "portal.feed.off-first-boot", "portal.feed.last-state", "portal.feed.test-bench",
  "portal.dial.seeded",

  /* ── The eggs behind a mechanism. Each waits on an OPENING — a passcode, a
        question count, a storyline — not on a delivery. */
  "egg.passcode", "egg.cloud-alert", "egg.passcodes-msg", "egg.morse",
  "egg.frozen", "egg.laststate",

  /* ── A document made from facts the house already has. */
  "doc.factlist",
];

const TRANSMISSION = [
  /* ── The twin's stub rows, and this assignment is CANON rather than a
        judgement: THE STORY ARC (weird-baby-robots/docs/canonical/THE_STORY_ARC.md,
        THE PERSISTENCE CONCEIT) rules that "feature revelation = SIMULATED DATA
        DOWNLOADS … capability ARRIVES as transmission." A row reading DATA NOT
        LOADED is a row waiting on the wire, by the arc's own words. */
  "twin.app.advice.rest", "twin.app.predictions.rest", "twin.app.user.security",
  "twin.app.codes", "twin.app.mgkmodel",

  /* ── Period plates that would have come out of the same servers. */
  "doc.ads",
];

export const ASSIGN = new Map([
  ...BLAST.map(id => [id, "BLAST"]),
  ...PACKAGE.map(id => [id, "PACKAGE"]),
  ...UNLOCK.map(id => [id, "UNLOCK"]),
  ...TRANSMISSION.map(id => [id, "TRANSMISSION"]),
]);

/* ═══ THE EXEMPTIONS ════════════════════════════════════════════════════════
   Not a waste bin. A row here is a row the transfer fiction genuinely does not
   describe, and the reason is written out so the next reader can disagree with
   it. An exempt row MAY NOT BE REVEALED — that is check (b), and it is what
   stops this table from becoming the way round the rule.

   Twenty-two rows, in four kinds, and the second and third kinds are findings
   about the ledger rather than about the arc.                                */
export const EXEMPT = new Map([
  /* (i) WITHDRAWN. A transfer class describes how material arrives to be
         shown. These were struck FROM the glass, and several were never
         material at all — `retired.record.fictions` is eleven invented entries
         deleted at v47. Giving fiction an arrival would dignify it. */
  ...["retired.hr.home", "retired.hr.fanwall", "retired.hr.media",
      "retired.robots.parts", "retired.robots.tally", "retired.booth.hook",
      "retired.lobby.book.static", "retired.record.fictions",
      "retired.query.variants",
  ].map(id => [id, "WITHDRAWN — struck from the glass; a transfer class describes arrival, not removal."]),

  /* (ii) OPS INSTRUMENTS, OUT OF FICTION. The provenance register, the asset
         table, this ledger and the open-actions register are how the museum is
         MADE. They have no in-story arrival because they have no in-story
         existence, and Doctrine 11 keeps them off the glass permanently.
         THE FINDING: they are rows in a catalogue of REVEALABLE THINGS and
         they are not revealable. Reported, not fixed — deciding whether they
         belong in the ledger at all is not this round's call. */
  ...["tool.provenance", "tool.assettable", "tool.reveal", "tool.openactions",
  ].map(id => [id, "OPS INSTRUMENT — out of fiction, never revealable; see the timeline's §6 finding."]),

  /* (iii) NOT MGK MATERIAL. The transfer classes are a fiction about one
          machine line's paperwork arriving. Other artists' work, the house's
          own merchandise and the Foundation's giving channels do not arrive
          from anywhere — the house makes or arranges them. Their live
          counterparts sit in BLAST by necessity (they were on the glass); the
          unbuilt ones have no honest class, and inventing one would extend a
          fiction over material it was never about. */
  ...["wal.artifacts", "shop.shirts", "shop.domain", "shop.mikes",
      "channel.qr", "channel.supplies", "channel.services",
  ].map(id => [id, "NOT MGK MATERIAL — the house makes or arranges it; nothing arrives."]),

  /* (iv) THE HOUSE'S OWN UNWRITTEN WORDS. A summary of the story and the
         Billionaire's Credo are not transferred, found or unlocked. They are
         WRITTEN, by Mike, and no class covers authorship. This is the model's
         honest hole and it is named in the timeline's §6. */
  ...["doc.summary", "doc.credo",
  ].map(id => [id, "AUTHORSHIP — Mike writes it; no transfer class covers a thing that has to be written."]),
]);

/* ═══ APPLYING IT ═══════════════════════════════════════════════════════════ */
export function transferOf(id) {
  return ASSIGN.get(id) ?? null;
}
export function transferWeekOf(id) {
  const c = transferOf(id);
  return c ? TRANSFERS[c].week : null;
}

/** Stamp `transfer` and `transferWeek` onto every row, in place. */
export function applyTransfers(rows) {
  for (const r of rows) {
    r.transfer = transferOf(r.id);
    r.transferWeek = transferWeekOf(r.id);
  }
  return rows;
}

/* ═══ THE CHECKS ════════════════════════════════════════════════════════════
   Called from `validate()` in schema.mjs, so the declaration enforces them as
   it writes and `reveal:check` enforces them afterwards — the one-validator
   doctrine this repo paid for at v55.                                        */
export function transferFaults(rows) {
  const faults = [];
  const ids = new Set(rows.map(r => r.id));

  /* drift guard, both directions: an assignment or an exemption naming a row
     that no longer exists is a silent hole the moment somebody renames a row. */
  for (const id of ASSIGN.keys())
    if (!ids.has(id)) faults.push(`transfers: "${id}" is assigned a transfer class and is not a ledger row.`);
  for (const id of EXEMPT.keys())
    if (!ids.has(id)) faults.push(`transfers: "${id}" is exempted and is not a ledger row.`);

  for (const r of rows) {
    const cls = ASSIGN.get(r.id);
    const exempt = EXEMPT.has(r.id);

    /* (a) placed or exempted, in writing — and never both */
    if (cls && exempt)
      faults.push(`${r.id}: both assigned ${cls} and exempted — a row belongs to exactly one class.`);
    if (!cls && !exempt)
      faults.push(
        `${r.id}: no transfer class and no exemption.\n` +
        "    Every asset belongs to exactly one of BLAST · PACKAGE · UNLOCK · TRANSMISSION,\n" +
        "    or is exempted IN WRITING in reveal/transfers.mjs with a reason. A default would\n" +
        "    be a hole; for a new Record entry, decide which transfer its material rode in on.");

    if (cls && !CLASSES.includes(cls))
      faults.push(`${r.id}: "${cls}" is not one of ${CLASSES.join(" · ")}.`);

    /* (b) nothing unarrived is on the glass */
    if (r.state === "REVEALED") {
      if (exempt)
        faults.push(`${r.id}: REVEALED and exempted — exemption covers what is NOT shown; a visitor can reach this.`);
      else if (cls && TRANSFERS[cls].week == null)
        faults.push(
          `${r.id}: REVEALED, but ${cls} has no named arrival week.\n` +
          "    An asset may only be shown after it has been transferred.");
    }

    /* (c) nothing is shown before it lands */
    const w = cls ? TRANSFERS[cls].week : null;
    if (w != null && typeof r.when === "number" && r.when < w)
      faults.push(`${r.id}: revealed in week ${r.when} but its ${cls} arrival is week ${w}.`);

    /* a week outside its own class's window is a typo, not a schedule */
    if (cls && typeof r.transferWeek === "number") {
      const t = TRANSFERS[cls];
      if (r.transferWeek < t.opens || r.transferWeek > t.closes)
        faults.push(`${r.id}: arrival week ${r.transferWeek} is outside ${cls}'s window ${t.opens}–${t.closes}.`);
    }
  }
  return faults;
}

/* ═══ THE TWO TENSIONS, RECORDED RATHER THAN RESOLVED ═══════════════════════
   Both were named by Mike when he set the round, and both are the model
   working rather than the model failing. They live here as text because a
   future reader will otherwise read them as mistakes and "fix" them.        */
export const MANUAL_SPANS_CLASSES =
  "THE MANUAL SPANS CLASS 1 AND CLASS 2, AND THAT IS THE NO-SINGLE-COPY FICTION " +
  "WORKING. The volume (`doc.manual`) is BLAST — named and readable from launch, " +
  "cover and first contents page inside the first 48 hours. Its pages " +
  "(`doc.manual.plates`, and every `doc.manual.page.NN` the vessel will build) " +
  "are PACKAGE, because a photographed page is a photograph of paper somebody " +
  "is holding. One object, two arrivals, no contradiction: nobody ever had the " +
  "whole manual in one piece. NOTE THE GAP — the vessel is empty by instruction " +
  "(M44), so the class-1 half of the manual has exactly one row to carry it and " +
  "the first-48-hours pages have none.";

export const PORTAL_ARRIVED_STUCK =
  "THE PORTAL ARRIVED IN THE BLAST AND COULD NOT BE DRIVEN YET. It is on the " +
  "glass at launch, so by rule (b) it can only be class 1 — and five of its " +
  "drum positions and one dial position are engraved, readable and inert. Those " +
  "six are UNLOCK: in hand from the start, waiting on an opening rather than a " +
  "delivery. The panel and its dead positions are the same object in two " +
  "classes, which is exactly the stuck-portal maintenance-mode lore.";
