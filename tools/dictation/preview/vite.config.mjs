/* ===========================================================================
   THE LIVE PREVIEW'S OWN BUILD. [D4 2026-08-08]
   ---------------------------------------------------------------------------
   One entry, IIFE, React bundled in, straight into the dictation folder. It is
   a SECOND vite build rather than a slice of the museum's, and the reason is
   the museum's config: it registers `@cloudflare/vite-plugin`, which turns the
   build into a two-environment build (client + worker) that only the CLI drives
   — OPERATIONS §8's own hazard row. A preview bundle has no worker, no routes
   and no worker environment, and asking that config for one would mean either
   teaching it a third environment or calling an API §8 forbids.

   WHAT IS SHARED IS THE ONLY THING THAT MATTERS: the SOURCE. `entry.jsx`
   imports the shipped components and the shipped stylesheets. Two builds of one
   source cannot disagree about what a Record entry looks like; two copies of
   the markup could, and that is the arrangement this replaces.

   ═══ THE FOUR MUSEUM PLUGINS ARE ABSENT, AND EACH FOR A STATED REASON ═══════
   `hrVaultAudio` and `revealPublic` transform two JSON files this bundle does
   not import. `opsNotesStrip` only fires in the LAUNCH stage and only on
   `[PAPA]` markers, of which the two components carry none. `wbPlacement`
   rewrites governed image literals — a Record entry can carry a `still`, but
   the literal would come from the WORKSHEET at runtime, not from these modules,
   and neither component contains one. **If any of that stops being true the
   preview would draw a picture at an address the museum does not serve**, so
   the check is in the fidelity note beside this file rather than in a comment
   nobody re-reads.

   IT IS RUN BY `npm run dictation`, spawned as a CLI process (§8: anything that
   needs to build spawns `vite build`; never call `build()`).
   =========================================================================== */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import url from "node:url";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..", "..");

export default defineConfig({
  root: REPO,
  configFile: false,
  plugins: [react()],
  logLevel: "warn",
  /* THE ROOT IS THE REPO, SO `publicDir` MUST BE TURNED OFF EXPLICITLY, AND
     THIS IS NOT A TIDINESS LINE. The first run of this build copied the whole
     of `public/` into `docs/…/_preview/` — including `public/held/`, which is
     the stage door: the sixteen withheld photographs of the machines, at a
     SECOND address, inside the repository. That is §8's *a picture has two
     addresses* hazard produced by a build config, and the fact that `docs/` is
     never served is luck rather than a mechanism. The preview needs no assets
     at all; it draws type. */
  publicDir: false,
  /* AND `process.env.NODE_ENV` MUST BE DEFINED HERE, WHICH THE MUSEUM'S OWN
     BUILD NEVER HAS TO DO. React's CJS shim picks its development or production
     copy from that expression at runtime; vite substitutes it for an app build
     and does NOT for a library build, so the first bundle carried BOTH copies
     of React (588 KB) and would have thrown `process is not defined` on the
     first render — a preview that does not draw at all. Caught by reading the
     bundle rather than by opening it. */
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  build: {
    outDir: path.join(REPO, "docs", "dictation-20260807", "_preview"),
    emptyOutDir: true,
    /* No hashes. The frame links these two files by name and the frame is a
       generated static file — a hashed asset would need the generator to read
       the manifest back, which is a moving part for no gain on a local page. */
    lib: {
      entry: path.join(HERE, "entry.jsx"),
      name: "WBPreview",
      formats: ["iife"],
      fileName: () => "preview.js",
    },
    cssCodeSplit: false,
    rollupOptions: { output: { assetFileNames: "preview.[ext]" } },
  },
});
