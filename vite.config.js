import { defineConfig } from 'vite'
/* [2026-08-20] `node:fs` and `node:path` LEFT WITH `heldOutOfLaunch`. They were
   imported for that plugin alone — it was the only thing in this file that
   touched the disk — and a grep for either identifier now returns only the two
   import lines. They go with it (Law of Subtraction), rather than sitting here
   as two imports nothing calls. */
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";
import { stripVaultAudio } from "./src/data/exhibits/vault-audio.js";
import { visitorProse, PAPA_MARK, OPS_BRACE } from "./src/lib/visitor-prose.js";
import { publicLedger } from "./reveal/public-view.mjs";
import { readStage } from "./reveal/stage.mjs";
import { publicPlacements } from "./reveal/delivery.mjs";
import { placeRule } from "./reveal/placement.mjs";
import { assetSchedule } from "./reveal/record-clock.mjs";
import { entries as recordEntries, draftEntries as draftRecordEntries } from "./reveal/record-entries.mjs";
/* [2026-08-24] `recordDay` LEFT WITH THE DAY-FROM-NUMBER DERIVATION. Both
   defines that called it now read the entry's own date through `RECORD_DAY_OF`
   below, so a grep for the identifier in this file returns only prose. It goes
   with them (Law of Subtraction), exactly as `node:fs` and `node:path` went
   with `heldOutOfLaunch`. */
import { state as approvalState } from "./reveal/approval.mjs";
import { execSync } from "node:child_process";

/* [V1 2026-08-06] THE STAGE, READ ONCE PER BUILD. `reveal/stage.mjs` is the
   declaration and its header is the ruling; an unknown value throws there
   rather than falling back, so a typo'd flag fails the build instead of
   quietly building the state you thought you had left. */
const STAGE = readStage(process.env);

/* ═══ [2026-08-24] THE COMMIT TRAVELS WITH THE BUNDLE, SO PRODUCTION CAN SAY
       WHAT IT IS ══════════════════════════════════════════════════════════════
   Nothing in this repository could answer *what is deployed*. Establishing it
   on 2026-08-24 meant probing the live site and bracketing the answer from
   which fields `/api/record` was missing — which is not a method anybody should
   need twice. `docs/DEPLOYED.md` is the tree's record and `tools/deploy-record.mjs`
   writes it without being asked — but it is written AFTER the deploy and still
   has to be COMMITTED by a person, so it can drift. THIS cannot: the sha is
   compiled into the worker, and the worker reports it.

   IT IS ANSWERED ONLY TO A KEY-HOLDER, like `served` and `probe` beside it.
   What commit a museum is running is a fact about the WORK (Doctrine 11).

   `-dirty` IS PART OF IT AND IS NOT A DETAIL. Mike deploys from the working
   tree. A sha recorded against a tree with uncommitted changes is a lie of
   exactly the kind the conduit's freshness stamp exists to stop, so a build
   made over uncommitted changes says so and goes on saying so while it is live.

   NO GIT? `unknown`, and the build proceeds. A build that cannot read git is
   not a reason to refuse to build; it is a reason to say the sha is unknown. */
/* ═══ [2026-08-24] THE CALENDAR IS DUMB AND THE ENTRY CARRIES ITS OWN DAY ═════
   MIKE'S RULING — **SED: build for everyday drops, drop on the days you choose.**
   `recordDay(n)` is `epoch + (n − 1)`. It has NO weekend logic, NO holiday
   table, and it never will. **Nothing anywhere skips anything.** Which days get
   a Record is decided by WHICH ENTRIES EXIST, and that is Mike writing or not
   writing.

   SO THE NUMBER IS A LABEL AND THE DATE IS THE AUTHORITY. `no: 6` is the sixth
   Record, not the sixth day. **A GAP IN THE NUMBERS IS NOT A DEFECT AND MUST
   NEVER BE "FIXED"** — a later round that meets 001–005 followed by 008 is
   looking at three days on which nobody wrote, which is the mechanism working.

   THIS MAP IS WHERE THAT STOPPED BEING TRUE OF THE BUILD. Both defines below
   derived the day from `recordDay(e.no)` — the LABEL — while the glass filters
   on the entry's own `date`. They agreed only because every entry was written
   on the day its number happened to name. An entry dated Monday would have had
   its pictures unlock on the day its NUMBER fell on, and the wing gate would
   have read that day too.

   IT NEEDS A JOIN BECAUSE THE TWO HALVES LIVE IN TWO READERS: `entries()`
   returns `no` and `assets`; `draftEntries()` returns `no` and `date`. Joined
   on the number, which is what a label is for. */
const RECORD_DAY_OF = new Map(
  (() => {
    const d = draftRecordEntries();
    const list = d.entries || d;
    return (Array.isArray(list) ? list : Object.values(list))
      .map((e) => [e.no, e.date || null]);
  })());

const COMMIT = (() => {
  try {
    const sha = execSync("git rev-parse --short HEAD", { encoding: "utf8" }).trim();
    const dirty = execSync("git status --porcelain", { encoding: "utf8" }).trim() !== "";
    return dirty ? sha + "-dirty" : sha;
  } catch {
    return "unknown";
  }
})();

/* [R5 2026-08-06] HUNTER ROOT'S VAULT AUDIO DOES NOT ENTER THE BUNDLE.
   Mike: "we do not have his permission… the vault keeps the material; the site
   stops serving it." A runtime filter stops the REQUESTS and still ships the
   ADDRESSES — the first build after that filter went in carried 153 vault mp3
   URLs in plain text, which is the site publishing exactly what it had just
   stopped handing out. This runs `enforce: "pre"`, so it sees the raw JSON
   before Vite's own json plugin turns it into a module, and the URLs are gone
   before anything downstream can see them.
   THE RULE ITSELF IS NOT HERE. It is `stripVaultAudio` in
   src/data/exhibits/vault-audio.js, which the runtime boundary
   (hunter-root-served.js) calls as well — one rule, two callers, per Doctrine
   17. Read that file's header before changing this. */
const hrVaultAudio = {
  name: "hr-vault-audio",
  enforce: "pre",
  transform(code, id) {
    if (!id.replace(/\\/g, "/").endsWith("/src/data/exhibits/hunter_root.json")) return null;
    return { code: JSON.stringify(stripVaultAudio(JSON.parse(code))), map: null };
  },
};

/* [H1 2026-08-06] THE REVEAL LEDGER GOES OUT FOUR FIELDS WIDE.
   `src/lib/reveal.js` imports the whole of `reveal/ledger.json` for one LIVE /
   NOT BUILT column, and the whole of it is the museum's private record of what
   it holds and does not show — including two eggs whose only written form is
   that file. Measured on the built bundle: the Portal's engravings, the twin's
   address 67 times, and both eggs, in a chunk every visitor downloads.
   THE RULE IS NOT HERE. It is `publicLedger` in reveal/public-view.mjs, which
   `reveal:check` also calls — one rule, two callers, the same arrangement (and
   the same reason) as `stripVaultAudio` above. `enforce: "pre"` so it sees the
   raw JSON before vite's own json plugin turns it into a module. */
const revealPublic = {
  name: "reveal-ledger-public",
  enforce: "pre",
  transform(code, id) {
    if (!id.replace(/\\/g, "/").endsWith("/reveal/ledger.json")) return null;
    return { code: JSON.stringify(publicLedger(JSON.parse(code))), map: null };
  },
};

/* ═══ [V1 2026-08-06] THE PLACEMENT RULE, APPLIED AT BUILD ══════════════════
   AND THIS PLUGIN EXISTS BECAUSE THE RUNTIME PASS ALONE WAS NOT GOOD ENOUGH,
   WHICH IS THE THIRD TIME THIS EXACT LESSON HAS BEEN PAID FOR IN THIS FILE.
   `src/lib/placement.js` resolves a governed picture's address when the module
   loads, so at LAUNCH the renderer draws nothing — and the FIRST launch build
   still carried the public address of all twenty-six withheld photographs in
   plain text, because a string the resolver declines to use is a string the
   bundle shipped. R5 shipped 153 mp3 URLs that way; H1 shipped the whole reveal
   ledger that way. A filter that stops the RENDER still publishes the MATERIAL.

   So the literals are resolved HERE, before anything downstream sees them: at
   LAUNCH an undelivered picture's address becomes `null` and its filename is
   not in the bundle at all; in DEVELOPMENT it becomes the stage door's address.
   `placeRule` is idempotent, so the runtime resolver is handed an
   already-resolved value and hands it straight back — one rule, two callers,
   the same arrangement (and the same reason) as `stripVaultAudio`.

   THE ANCHOR IS AN IMAGE EXTENSION, DELIBERATELY. `/robots` is also a ROUTE and
   appears all over the museum as a link; matching only a quoted literal ending
   in an image extension is what keeps this from rewriting a door. */
const PLACEMENT_PUBLIC = publicPlacements();
const GOVERNED_LITERAL = /"(\/robots\/[\w./-]+\.(?:png|jpe?g|webp|gif|svg))"/gi;
const wbPlacement = {
  name: "wb-placement",
  enforce: "pre",
  transform(code, id) {
    const f = String(id).replace(/\\/g, "/");
    if (!/\/src\//.test(f)) return null;
    /* the resolver itself declares no picture and must not be rewritten */
    if (f.endsWith("/src/lib/placement.js")) return null;
    let touched = false;
    const out = code.replace(GOVERNED_LITERAL, (_m, p) => {
      touched = true;
      const r = placeRule(p, { stage: STAGE, publicPaths: PLACEMENT_PUBLIC });
      return r === null ? "null" : JSON.stringify(r);
    });
    return touched ? { code: out, map: null } : null;
  },
};

/* ═══ [N3 2026-08-06] THE OPERATOR'S NOTES LEAVE THE BUNDLE AT LAUNCH ════════
   MIKE: "verify none of them can reach a visitor in the LAUNCH stage."

   THEY COULD, AND THEY HAVE SINCE P5. `visitorProse` cuts the marker sentence
   at the RENDER SEAM, so no visitor has ever READ one — and every one of them
   has been sitting in a JS chunk any visitor can fetch the whole time.
   Measured on the built bundle: **35 markers**, among them the four unpublished
   figures on the Foundation's ledger and the wording of several answers Mike
   has not written yet. This is the fourth time this file has had to say it:
   **a filter that stops the RENDER still ships the MATERIAL.**

   AFTER THE STRIP A LAUNCH BUNDLE CARRIES ONE `[PAPA]`, AND IT IS THE RULE
   ITSELF — `PAPA_MARK`, in `visitor-prose.js`, which cannot remove itself. That
   is the whole of the residue and it is a regex, not a note.

   WHAT THIS PASS CANNOT REACH, said plainly rather than left to be assumed:
   `public/held/robots/twin.html` is a 620 KB standalone machine emulator that
   is not a module, is not built, and prints **76 operator slots on its own
   glass** — `[PAPA - ARIES]`, `[PAPA slot 1 - traffic]` and so on, by its own
   declared content law. It is unreachable at LAUNCH for a different reason (the
   stage door refuses `/held/`) and it is register row **N-k**.

   THE RULE IS NOT HERE. It is `visitorProse` in src/lib/visitor-prose.js, which
   the two render seams call as well — one rule, three callers, the same
   arrangement (and the same reason) as `stripVaultAudio`.

   IT IS AN AST PASS AND NOT A REGEX, FOR ONE REASON THAT DECIDES IT. The data
   files break long passages across concatenated literals for line length, and a
   marker sentence routinely STRADDLES the break:

       "…the outgoing half of that ledger is not built. [PAPA] — the named " +
       "lines Mike supplied are held until he says otherwise."

   Stripping literal-by-literal would apply the sentence rule to half-sentences
   and could take a sentence the runtime keeps, or keep one it takes — which
   would mean **the copy Mike approved in development is not the copy that
   ships**, a worse defect than the one being cured. So the pass folds each `+`
   chain of literals into the one string the runtime actually sees, runs the same
   `visitorProse` over it, and writes back a single literal. What the visitor
   downloads is then byte-for-byte what the visitor would have been shown.

   DEVELOPMENT IS UNTOUCHED: at that stage the notes are the point (N3), and the
   plugin returns null before it parses anything. */
const opsNotesStrip = {
  name: "wb-ops-notes",
  enforce: "pre",
  transform(code, id) {
    if (STAGE !== "launch") return null;
    const f = String(id).replace(/\\/g, "/");
    if (!/\/src\//.test(f) || !/\.(js|jsx)$/.test(f)) return null;
    /* [E2 2026-08-09] THE DEV MARKS ARE GONE FROM THIS PASS. They were folded in
       here for one round; Mike retired the scheme, so the pass is back to the
       one marker it was built for. A brace note is not stripped — it is
       REFUSED, by `opsBraceGuard` below, because a brace in `src/` means Ops
       carried a note into the museum's data by mistake and quietly deleting it
       would hide that mistake. */
    if (!PAPA_MARK.test(code)) return null;

    let ast;
    try {
      ast = acorn.Parser.extend(jsxPlugin()).parse(code, {
        ecmaVersion: "latest", sourceType: "module", locations: false,
      });
    } catch (e) {
      /* A FILE THIS PASS CANNOT PARSE IS A FILE IT CANNOT CLEAN, and a marker
         left in a launch bundle is the whole defect. Fail the build. */
      this.error(`wb-ops-notes could not parse ${f}: ${e.message}`);
      return null;
    }

    /* fold a literal, or a chain of `+`-joined literals, to its string value */
    const fold = (n) => {
      if (n.type === "Literal" && typeof n.value === "string") return n.value;
      if (n.type === "BinaryExpression" && n.operator === "+") {
        const l = fold(n.left), r = fold(n.right);
        return l === null || r === null ? null : l + r;
      }
      return null;
    };

    const edits = [];
    const walk = (n) => {
      if (!n || typeof n !== "object") return;
      if (Array.isArray(n)) { n.forEach(walk); return; }
      if (!n.type) return;
      const s = fold(n);
      if (s !== null && PAPA_MARK.test(s)) {
        edits.push({ start: n.start, end: n.end, text: JSON.stringify(visitorProse(s)) });
        return;                       // do not descend into a node being replaced
      }
      for (const k of Object.keys(n)) {
        if (k === "start" || k === "end" || k === "type" || k === "loc" || k === "range") continue;
        walk(n[k]);
      }
    };
    walk(ast);
    if (!edits.length) return null;

    let out = code;
    for (const e of edits.sort((a, b) => b.start - a.start)) {
      out = out.slice(0, e.start) + e.text + out.slice(e.end);
    }
    return { code: out, map: null };
  },
};

/* [H1 2026-08-06] A SHUT WING'S CHUNKS GO IN THEIR OWN DIRECTORY.
   Mike ruled `/hr` private — online for him and for Ops, behind a password on
   the admin page. `App.jsx` lazy-loads the wing so its code and its data leave
   the public bundle; this puts the resulting chunks in a directory
   `src/worker.js` refuses to serve without the cookie.

   A DIRECTORY RATHER THAN A NAME PREFIX, deliberately: Workers Assets routing
   rules (`run_worker_first` in wrangler.jsonc) take a trailing splat, and
   `/assets/locked/*` is a rule nobody has to reason about. A `locked-` prefix
   would work by the same syntax and would be one character away from not.

   A CHUNK GOES BEHIND A DOOR ONLY IF EVERY MODULE IN IT IS EITHER THAT WING'S
   MATERIAL OR A COMPANION. A chunk holding one shut module and one publicly
   reachable one must NOT go behind the door — a public route would then need a
   file the public cannot fetch, and the museum would be broken for everybody.

   AND THE ARRANGEMENT IS ASSERTED, NOT ASSUMED. `heldChunkGuard` below fails
   the build if any shut module lands outside its own directory. A naming rule
   that silently stops matching is the failure mode this whole mechanism was
   built against — R5 shipped 153 mp3 URLs that way. */
/* ═══ [V1 2026-08-06] TWO DOORS, NAMED FOR THEIR REASONS ════════════════════
   `HELD_PATHS` used to be one list holding two different kinds of thing, and
   the day a switch was built to open it that stopped being survivable. Mike
   asked for the Portal back during development; the Hunter Root wing is held
   for a PERMISSION reason that has nothing to do with what stage the museum is
   at, and a single list would have handed both to the same word.
     LOCKED_PATHS   the PERMISSION hold. `/hr` — the museum does not have his
                    permission (R5). Behind the password in EVERY stage;
                    chunks under `assets/locked/`.
     HELD_PATHS     the STAGE hold. Behind the password at LAUNCH and open
                    in DEVELOPMENT; chunks under `assets/held/`. The Portal
                    was its founding member and left on 2026-08-22 when
                    Mike ruled it public; the two machines remain.
   BOTH LISTS ARE APPLIED IN BOTH STAGES AND THAT IS WHAT MAKES THE GATE HONEST.
   The stage does not change which chunks are parked where — it changes only
   whether `src/worker.js` opens the stage door — so `heldChunkGuard` below and
   every check in `reveal/reachability.mjs` are testing the LAUNCH arrangement
   whichever stage is being built. */
const LOCKED_PATHS = [
  "/src/routes/hr/",
  "/src/data/artists/hunter-root",
  "/src/data/exhibits/hunter-root-served.js",
  "/src/data/exhibits/hunter_root.json",
  "/src/data/hr_journal_prompts.js",
];
const HELD_PATHS = [
  /* === [2026-08-22] THE PORTAL IS OUT OF THIS LIST — MIKE'S RULING =========
     The path that stood here from H1 (2026-08-06) until Record
     005 was the Portal album. **MIKE ruled the Portal PUBLIC**, and Record 005 — live since 21 Aug —
     says so on the glass: *The Portal is accessible via the Robots Exhibit.*
     A line the museum publishes and does not honour is the thing his own
     doctrine forbids: we do not hold back what we say we have.

     IT SUPERSEDES `PORTAL: Hide at launch` (13 Aug) AND IT CROSSES THE 17 AUG
     RULING BELOW, WHICH IS WHY BOTH ARE NAMED HERE RATHER THAN ONE.
     Publishing the Portal puts **MGK-VIIIp's working twin and BOTH units'
     names** on public glass. That is the shape the 17 August ruling was made
     against — *a hold that depends on another thing's hold is not a hold* —
     and the difference is that this time it is intended and ruled. **The units'
     own albums do not come with it:** `robots-units.js` stays in this list,
     nothing imports it, and there is no door to it.
     Full scope and the count of what moved:
     `docs/MUSEUM_PORTAL_PUBLISH_SCOPE-20260821.md`. */
  /* [2026-08-17] THE TWO MACHINES. Mike ruled MGK-NIAC and MGK-VIIIp down the
     night Record 001 opened the wing and both came through the door with it.
     THE FIRST CUT WAS A FILTER IN `robots.js` AND THE LEDGER REFUSED IT — nine
     rows at once, all saying the same thing: a public module stops the render
     and ships every string anyway. The albums are in their own file now, parked
     here, exactly as the Portal is. Full argument at the head of
     `robots-units.js`.
     IT DIFFERS FROM THE PORTAL IN ONE WAY AND IT IS DELIBERATE: nothing imports
     this one. The Portal is spliced back in for Mike at `/admin` because he
     asked to keep developing it; these are **held from Mike too**, his words, so
     there is no door. Parked here anyway, so that the day one is wired back for
     development it is already behind the right one. */
  "/src/data/artists/robots-units.js",
];
/* THE COMPANIONS ARE NAMED RATHER THAN INFERRED — the museum's own generic
   machinery that nothing but a shut wing happens to import today. They ride
   along; they are not the wing's. If a public route ever imports one, rolldown
   lifts it into a shared chunk on its own and the shut chunk simply gets
   smaller — no build breaks and nothing leaks. */
const HELD_COMPANIONS = [
  "/src/lib/use-overlay.js",
  "/src/data/vocabulary.json",
  "/src/data/era-buckets.json",
  "/src/data/exhibits/vault-audio.js",
];
const norm = (id) => String(id).replace(/\\/g, "/");
const isLockedModule = (id) => LOCKED_PATHS.some(h => norm(id).includes(h));
const isStageModule = (id) => HELD_PATHS.some(h => norm(id).includes(h));
const isShutModule = (id) => isLockedModule(id) || isStageModule(id);
const isCompanion = (id) => HELD_COMPANIONS.some(h => norm(id).includes(h));
const chunkModules = (chunk) => {
  const mods = Object.keys(chunk.modules || {});
  return mods.length ? mods : (chunk.moduleIds || []);
};
/* A CHUNK GOES BEHIND A DOOR ONLY IF EVERY MODULE IN IT IS EITHER THAT DOOR'S
   MATERIAL OR A COMPANION — and a chunk mixing the two doors goes behind the
   STRICTER one, because a chunk the public cannot have is worse to leak than
   one they merely cannot have yet. */
const shutDir = (chunk) => {
  const ids = chunkModules(chunk);
  if (!ids.length) return null;
  if (!ids.every(id => isShutModule(id) || isCompanion(id))) return null;
  if (ids.some(isLockedModule)) return "assets/locked/";
  if (ids.some(isStageModule)) return "assets/held/";
  return null;
};

/* ═══ [2026-08-20] J6 IS REVERSED: THE STAGE HOLD SHIPS AGAIN ══════════════
   MIKE: **"Ship the held files and let the worker refuse them. 190 MB per
   deploy is the honest cost of a door that works."**

   WHAT WAS HERE, named once so nobody rebuilds it (Doctrine 24): a
   `closeBundle` plugin, `wb-held-out-of-launch`, which deleted `dist/client/
   held/` on a LAUNCH build — 144 files, 190.0 MB — on J6's reasoning that
   *"it is refused by the worker anyway, so nothing is lost."*

   ═══ WHY IT WAS WRONG, AND IT IS WORTH THE PARAGRAPH ═══════════════════════
   THE STAGE DOOR HAS TWO BRANCHES AND J6 REASONED ABOUT ONE. Its own note said
   *"a visitor never sees a byte of it either way; the cost is entirely at
   deploy."* **True of a visitor. False of the cookie holder** — and the cookie
   holder is the only reason the door exists. Stripping the files left
   `heldOpen()` granting permission to serve material that had never been
   uploaded.

   WHAT THAT LOOKED LIKE ON THE LIVE SITE, measured 2026-08-20 with the door
   OPEN: `/api/held` answered `{configured:true, open:true, stage:"launch"}`,
   and every held path returned **200 text/html** — the SPA fallback
   (`not_found_handling: "single-page-application"`), because a miss in the
   asset store is answered with `index.html`. So the Portal album appeared (a
   CODE chunk, and code chunks ship), its cover did not (an IMAGE, and images
   did not), and throwing the latch fetched `twin.html`, received the
   application, and rendered the Lobby.

   IT HAD NEVER WORKED ON A LAUNCH DEPLOYMENT AND COULD NOT HAVE. `heldOpen()`
   landed 2026-08-06, when every deploy was DEVELOPMENT stage — and in that
   stage the worker never asks for the cookie at all, so the files were served
   to everybody and the door was not the thing serving them. `deploy-guard.mjs`
   made a launch deploy sayable on 2026-08-12. J6 removed the files on
   2026-08-13. **The window in which the door could have worked is one day
   wide, and no launch deploy is recorded inside it.**

   NEITHER ROUND MADE A MISTAKE, WHICH IS THE PART TO REMEMBER. Both did a
   correct thing a day apart and the combination had no owner.

   ═══ WHY SHIPPING THEM LEAKS NOTHING ═══════════════════════════════════════
   `wrangler.jsonc` sets `run_worker_first: ["/*"]`, so **the worker sees every
   request** and no `/held/*` path can reach the asset store without passing
   `heldOpen()`. A request without the cookie gets a plain 404 — which is
   exactly what it already got, by a different route. The precedent is not
   theoretical: `assetWithheld` has been withholding Record 003's six manual
   pages, which SHIP at public addresses, since 2026-08-19.

   ═══ A′ WAS OFFERED AND MIKE REJECTED IT, AND THE REASON IS THE RULE ════════
   Ops proposed shipping only the ~1.3 MB the Portal's chunk actually names.
   **HIS RULING: no** — *"shipping only what the Portal chunk names makes the
   door work for the Portal and silently not for anything else. That is the same
   class of fault as the one we just spent a morning on: a mechanism that
   appears to work and does not."*

   ═══ WHAT J6 GOT RIGHT AND IS NOT LOST ═════════════════════════════════════
   Its account of why a strip cannot break a reveal is TRUE and is kept here,
   because it is a fact about the reveal mechanism rather than about the strip:
   `reveal/day.mjs --place` calls `fs.renameSync(held, public)` BEFORE the
   build, so a delivered picture is already at `public/robots/…` and is bundled
   by the ordinary path. Only things no entry has delivered are still under
   `held/`. Nothing a Record delivers has ever depended on this plugin.

   THE COST IS REAL AND IS ACCEPTED, NOT WAVED AWAY: every `deploy:launch`
   uploads about 190 MB the worker will refuse to anybody without the key.
   That is deploy-time bandwidth, once per deploy, and it buys a door that
   opens. */

const heldChunkGuard = {
  name: "held-chunk-guard",
  generateBundle(_opts, bundle) {
    const escaped = [];
    for (const [fileName, out] of Object.entries(bundle)) {
      if (out.type !== "chunk") continue;
      const f = norm(fileName);
      const behindLocked = f.startsWith("assets/locked/");
      const behindStage = f.startsWith("assets/held/");
      for (const id of chunkModules(out)) {
        if (isLockedModule(id) && !behindLocked) escaped.push(`LOCKED  ${norm(id)}  ->  ${fileName}`);
        else if (isStageModule(id) && !behindStage && !behindLocked) escaped.push(`HELD    ${norm(id)}  ->  ${fileName}`);
      }
    }
    if (escaped.length) {
      this.error(
        "SHUT-WING LEAK — " + escaped.length + " module(s) behind a door landed "
        + "in a chunk the public can fetch. Read the [V1]/[H1] headers in vite.config.js.\n  "
        + escaped.join("\n  ")
      );
    }
  },
};

/* ═══ [E2 2026-08-09] THE LAUNCH GATE FAILS ON ANY BRACE THAT SURVIVES ══════
   MIKE: "Anything inside { } is a note to Ops, not story… They must never reach
   a visitor — the launch gate fails on any brace that survives."

   ═══ IT READS THE SOURCE AND NOT THE BUNDLE, AND THAT IS FORCED ════════════
   The mark it replaces (`[MIKE-NOTE]`) was a string nothing else in a JavaScript
   bundle could produce, so the guard written for it could grep the built chunks
   — the strongest possible check, because it read the artefact itself. A CURLY
   BRACE CANNOT BE CHECKED THAT WAY: compiled JavaScript is made of braces, and a
   grep over `dist/` would match every function body in the museum. So this reads
   what a brace note actually is — a STRING LITERAL under `src/` containing
   `{…}` — off the parsed source, which is the only layer where the question is
   answerable at all.
   WHAT THAT COSTS, STATED: a note that reached a visitor-facing string through
   some path other than a source literal (an interpolation, a JSON import) is not
   seen here. `npm run reveal:check` covers the Record itself on EVERY packet,
   which is the surface his notes are actually written on, and the two together
   are the honest span. Neither is a bundle grep and neither pretends to be.

   ZERO FALSE POSITIVES, MEASURED RATHER THAN HOPED. The day this was written,
   `src/` held **0** string literals containing `{…}` — so there is no exception
   list, and if one is ever genuinely needed that is a reason to change the mark
   rather than to weaken the gate.

   IT WALKS THE TREE FROM DISK IN `buildStart` rather than per-module, so it sees
   a file even when nothing imports it: a note sitting in a module the bundler
   tree-shook away is still a note somebody has to act on. */
/* a real newline, built rather than escaped: this file has been broken twice by
   a patch script writing a two-character escape as one character (OPERATIONS §8) */
const NL = String.fromCharCode(10);
const opsBraceGuard = {
  name: "wb-ops-braces",
  async buildStart() {
    if (STAGE !== "launch") return;
    const fs = await import("node:fs");
    const path = await import("node:path");
    const root = path.join(process.cwd(), "src");
    const files = [];
    (function walk(d) {
      for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, e.name);
        if (e.isDirectory()) walk(p);
        else if (/\.(js|jsx)$/.test(e.name)) files.push(p);
      }
    })(root);

    const hits = [];
    for (const f of files) {
      const code = fs.readFileSync(f, "utf8");
      let ast;
      try {
        ast = acorn.Parser.extend(jsxPlugin()).parse(code, {
          ecmaVersion: "latest", sourceType: "module", locations: true,
        });
      } catch (e) {
        /* a file this pass cannot parse is a file it cannot clear */
        this.error(`wb-ops-braces could not parse ${f}: ${e.message}`);
        return;
      }
      (function visit(n) {
        if (!n || typeof n !== "object") return;
        if (Array.isArray(n)) { n.forEach(visit); return; }
        if (!n.type) return;
        if (n.type === "Literal" && typeof n.value === "string" && OPS_BRACE.test(n.value)) {
          hits.push(`${path.relative(process.cwd(), f)}:${n.loc.start.line}  ${JSON.stringify(n.value).slice(0, 160)}`);
          return;
        }
        for (const k of Object.keys(n)) {
          if (k === "start" || k === "end" || k === "type" || k === "loc" || k === "range") continue;
          visit(n[k]);
        }
      })(ast);
    }
    if (hits.length) {
      this.error(
        "A NOTE TO OPS IS IN THE LAUNCH BUILD — " + hits.length + " string literal(s) "
        + "under src/ contain a curly-brace note. Anything inside { } is Mike writing "
        + "to Ops, never story, and it must not reach a visitor: act on the note and "
        + "take it out of the data. Read OPS_BRACE in src/lib/visitor-prose.js."
        + NL + "  " + hits.join(NL + "  ")
      );
    }
  },
};

export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    /* [2026-08-24] see THE COMMIT TRAVELS WITH THE BUNDLE at the head of this
       file. Note for anyone who reads `reveal/stage.mjs`'s claim that the
       bundle is BYTE IDENTICAL every day: it already was not — `__BUILD_TIME__`
       above has stamped a fresh ISO instant into every build since 2026-08-08
       and `WbAdmin.jsx` prints it. This adds a second per-build value to a
       bundle that was never reproducible, rather than making a reproducible one
       stop being so. */
    __WB_COMMIT__: JSON.stringify(COMMIT),
    /* [V1 2026-08-06] THE STAGE REACHES THREE PLACES AND ALL THREE ARE BUILT
       BY VITE: the worker (whether the stage door opens), `src/lib/stage.js`
       (what /admin reports) and `src/lib/placement.js` (what a governed
       picture's address is). `publicPlacements()` is derived from the Record
       by reveal/delivery.mjs — the POSITIVE half only; the held set is never
       handed to the browser in either stage. */
    __WB_STAGE__: JSON.stringify(STAGE),
    __WB_PLACEMENT__: JSON.stringify({
      stage: STAGE,
      publicPaths: [...publicPlacements()].sort(),
    }),
    /* [CH5 2026-08-12 · A3] THE DATE→FILE SCHEDULE, BAKED FOR THE WORKER.
       `{ "/robots/x.png": "2026-08-19" }` — the day each governed file becomes
       publishable, derived from the Record's own `assets` arrays and each
       entry's own date. The worker refuses a path whose day has not come.
       IT IS THE POSITIVE HALF ONLY, like `publicPlacements` above and for the
       same reason: it names files and the day they open, never the set of what
       is being withheld. It reaches the WORKER, not the browser — the client
       never sees it and has no use for it.
       [2026-08-20] NO LONGER EMPTY. This said `{}` and called the worker's
       branch unexercised, which was true until Record 003 delivered. It bakes
       SEVEN rows — `scan-07-a/b`, `scan-11-a/b`, `scan-31-a` and `marked-01-a`
       on Record 003's day, and `qc-101-a` on Record 004's — and the worker holds
       each of them until that day. Corrected here and at the
       branch that reads it (`src/worker.js`).
       [2026-08-24] IT SAID **SIX** UNTIL TODAY AND HAD BEEN WRONG SINCE
       2026-08-21, when Mike back-posted `qc-101-a` onto Record 004. **Nothing
       counts these rows** — `docs:numbers:gate` measures ledger, register,
       asset-table and entry counts and does not measure this one, so the number
       sat wrong in three comments for three days. **The dates are deliberately
       not quoted any more.** Ruling C moved `RECORD_EPOCH` to 2026-08-31 and
       every row re-dated; a day named in this comment would go stale on the
       next move, which is what happened to the last one. **[2026-08-28] AND THE
       NEXT MOVE CAME FOUR DAYS LATER** — Ruling D, epoch 2026-09-07, every row
       re-dated again, and this comment needed no edit because it names no day.
       The schedule is
       derived from the entries' own `assets` arrays and their own dates — read
       the object, never the prose. */
    __WB_RECORD_ASSETS__: JSON.stringify(
      assetSchedule(recordEntries(), (e) => RECORD_DAY_OF.get(e.no) ?? null)),
    /* [CH6 2026-08-12] THE DAY THE WING ARRIVES, DERIVED AND NOT TYPED.
       The worker needs it for one job only: the share cards name the MGK robots,
       and that sentence is false on a site whose Robots wing does not exist yet
       (1e). It rewrites them while the wing is shut.
       IT IS THE EARLIEST RECORD ENTRY'S OWN DAY — the same derivation
       `src/lib/wing-open.js` uses at the glass, so the two cannot disagree, and
       there is still no second date literal beside `RECORD_EPOCH`. `null` when
       the Record is empty, which reads as "never opened" and holds the cards. */
    __WB_RECORD_FIRST_DAY__: JSON.stringify(
      [...RECORD_DAY_OF.values()].filter(Boolean).sort()[0] ?? null),
    /* ═══ [2026-08-13] MIKE'S SIGNATURES, AND THE REASON THIS IS A `define` ═══
       The approval mark draws the house mark on a page he has personally
       approved. It must NEVER render at launch, and the strongest version of
       "never" available is a constant the bundler can fold: at LAUNCH this is
       the literal `null`, so `ApprovalMark`'s first line becomes
       `if (!null) return null;` and rollup takes the component, its styles and
       this whole map out of the bundle. **There is no runtime flag to forget.**
       Proved against a real launch build by `npm run approval:proof`.
       IT CARRIES ONLY ROUTE → DATE. Not the fingerprints, not the file lists —
       the browser has no use for them and a map of what the museum is made of
       is not something to ship even in development. `state()` recomputes the
       fingerprints at BUILD time, so a page whose signature has dropped is
       simply absent from this object. */
    __WB_APPROVALS__: JSON.stringify(
      STAGE === "launch" ? null
        : Object.fromEntries(approvalState()
            .filter((p) => p.status === "approved")
            .map((p) => [p.route, p.signed.at]))),
  },
  plugins: [hrVaultAudio, revealPublic, wbPlacement, opsNotesStrip, heldChunkGuard, opsBraceGuard, react(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunk) => {
          const dir = shutDir(chunk);
          return dir ? dir + "[name]-[hash].js" : "assets/[name]-[hash].js";
        },
        manualChunks: (id) => {
          if (id.includes('LyricMap')) return 'lyricmap';
        }
      }
    }
  }
})
