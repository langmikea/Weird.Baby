import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin";
import * as acorn from "acorn";
import jsxPlugin from "acorn-jsx";
import { stripVaultAudio } from "./src/data/exhibits/vault-audio.js";
import { visitorProse, PAPA_MARK, DEV_MARK } from "./src/lib/visitor-prose.js";
import { publicLedger } from "./reveal/public-view.mjs";
import { readStage } from "./reveal/stage.mjs";
import { publicPlacements } from "./reveal/delivery.mjs";
import { placeRule } from "./reveal/placement.mjs";

/* [V1 2026-08-06] THE STAGE, READ ONCE PER BUILD. `reveal/stage.mjs` is the
   declaration and its header is the ruling; an unknown value throws there
   rather than falling back, so a typo'd flag fails the build instead of
   quietly building the state you thought you had left. */
const STAGE = readStage(process.env);

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
    /* [L5 2026-08-09] the dev marks join the same pass, for the same reason:
       a runtime filter stops the RENDER and still ships the MATERIAL. */
    if (!PAPA_MARK.test(code) && !/\[(MIKE-NOTE|OPS)\]/.test(code)) return null;

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
      if (s !== null && (PAPA_MARK.test(s) || DEV_MARK.test(s))) {
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
     HELD_PATHS     the STAGE hold. The Portal, held from launch (H1). Behind
                    the password at LAUNCH and open in DEVELOPMENT; chunks
                    under `assets/held/`.
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
  "/src/data/artists/portal.js",
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

/* ═══ [L5 2026-08-09] THE DEV MARKS DO NOT SURVIVE A LAUNCH BUILD, AND THIS IS
       THE MECHANISM THAT CANNOT BE REASONED WRONG ══════════════════════════
   MIKE: "THE COLOURED MARKERS MUST BE UNMISSABLE and must never survive to
   launch - development-only, and the launch gate fails if any of it can reach a
   visitor."

   There are already two mechanisms — `RecordEntry.jsx` does not render a marked
   paragraph at launch, and `wb-ops-notes` empties the literal in the source.
   BOTH ARE THINGS SOMEBODY WROTE, and this house has shipped past that exact
   pair four times: a runtime filter that stopped the render and shipped the
   material (R5's 153 vault URLs, H1's ledger, V1's twenty-six addresses, N3's
   35 markers). So the launch build READS ITS OWN OUTPUT and fails on a hit.

   IT IS NOT A SEPARATE GATE ON PURPOSE. A gate somebody has to remember to run
   is a gate that does not run; this is inside the one command that produces the
   thing being checked, so a launch bundle carrying a marker cannot come into
   existence. In DEVELOPMENT it does nothing — the marks are the point there. */
/* a real newline, built rather than escaped: this file has been broken twice by
   a patch script writing a two-character escape as one character (OPERATIONS §8) */
const NL = String.fromCharCode(10);
const devMarkGuard = {
  name: "wb-dev-mark-guard",
  generateBundle(_opts, bundle) {
    if (STAGE !== "launch") return;
    const hits = [];
    for (const [fileName, out] of Object.entries(bundle)) {
      const text = out.type === "chunk" ? out.code
        : typeof out.source === "string" ? out.source : null;
      if (text === null) continue;
      for (const m of text.matchAll(/\[(MIKE-NOTE|OPS)\]/g)) {
        hits.push(`${fileName}  ${m[0]}  …${text.slice(Math.max(0, m.index - 40), m.index + 60).replace(/\s+/g, " ")}…`);
      }
    }
    if (hits.length) {
      this.error(
        "DEVELOPMENT MARKERS IN A LAUNCH BUNDLE — " + hits.length + " hit(s). "
        + "These are Mike's notes to Ops and Ops' answers to him; neither may "
        + "reach a visitor. Read the [L2/L5] headers in src/lib/visitor-prose.js "
        + "and src/routes/exhibit/RecordEntry.jsx." + NL + "  " + hits.join(NL + "  ")
      );
    }
  },
};

export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
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
  },
  plugins: [hrVaultAudio, revealPublic, wbPlacement, opsNotesStrip, heldChunkGuard, devMarkGuard, react(), cloudflare()],
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
