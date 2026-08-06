import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { cloudflare } from "@cloudflare/vite-plugin";
import { stripVaultAudio } from "./src/data/exhibits/vault-audio.js";

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

/* [H1 2026-08-06] THE HELD WING'S CHUNKS GO IN THEIR OWN DIRECTORY.
   Mike ruled `/hr` private — online for him and for Ops, behind a password on
   the admin page. `App.jsx` lazy-loads the wing so its code and its data leave
   the public bundle; this puts the resulting chunks under `assets/held/`, which
   is the one path `src/worker.js` refuses to serve without the cookie.

   A DIRECTORY RATHER THAN A NAME PREFIX, deliberately: Workers Assets routing
   rules (`run_worker_first` in wrangler.jsonc) take a trailing splat, and
   `/assets/held/*` is a rule nobody has to reason about. A `held-` prefix would
   work by the same syntax and would be one character away from not.

   A CHUNK GOES BEHIND THE DOOR ONLY IF EVERY MODULE IN IT IS EITHER THE WING'S
   MATERIAL OR A COMPANION. A chunk holding one held module and one publicly
   reachable one must NOT go behind the door — a public route would then need a
   file the public cannot fetch, and the museum would be broken for everybody.

   THE COMPANIONS ARE NAMED RATHER THAN INFERRED, AND THE DISTINCTION IS THE
   POINT. `HELD_PATHS` is Hunter Root's material and the code that only exists
   to show it. `HELD_COMPANIONS` is the museum's own generic machinery that
   nothing but this wing happens to import today — an overlay hook, the tag
   registry, the era buckets, the vault-audio rule. They ride along; they are
   not his. If a public route ever imports one, rolldown lifts it into a shared
   chunk on its own and the held chunk simply gets smaller — no build breaks and
   nothing leaks, which is why the two lists are separate.

   AND THE ARRANGEMENT IS ASSERTED, NOT ASSUMED. `heldChunkGuard` below fails
   the build if any held module lands outside `assets/held/`. A naming rule that
   silently stops matching is the failure mode this whole mechanism was built
   against — R5 shipped 153 mp3 URLs that way. */
const HELD_PATHS = [
  "/src/routes/hr/",
  "/src/data/artists/hunter-root",
  "/src/data/exhibits/hunter-root-served.js",
  "/src/data/exhibits/hunter_root.json",
  "/src/data/hr_journal_prompts.js",
];
const HELD_COMPANIONS = [
  "/src/lib/use-overlay.js",
  "/src/data/vocabulary.json",
  "/src/data/era-buckets.json",
  "/src/data/exhibits/vault-audio.js",
];
const norm = (id) => String(id).replace(/\\/g, "/");
const isHeldModule = (id) => HELD_PATHS.some(h => norm(id).includes(h));
const isCompanion = (id) => HELD_COMPANIONS.some(h => norm(id).includes(h));
const chunkModules = (chunk) => {
  const mods = Object.keys(chunk.modules || {});
  return mods.length ? mods : (chunk.moduleIds || []);
};
const heldChunk = (chunk) => {
  const ids = chunkModules(chunk);
  return ids.length > 0
    && ids.some(isHeldModule)
    && ids.every(id => isHeldModule(id) || isCompanion(id));
};

const heldChunkGuard = {
  name: "held-chunk-guard",
  generateBundle(_opts, bundle) {
    const escaped = [];
    for (const [fileName, out] of Object.entries(bundle)) {
      if (out.type !== "chunk") continue;
      if (norm(fileName).startsWith("assets/held/")) continue;
      for (const id of chunkModules(out)) {
        if (isHeldModule(id)) escaped.push(`${norm(id)}  ->  ${fileName}`);
      }
    }
    if (escaped.length) {
      this.error(
        "HELD WING LEAK — " + escaped.length + " module(s) of the held wing landed "
        + "in a chunk the public can fetch. Read the [H1] header in vite.config.js.\n  "
        + escaped.join("\n  ")
      );
    }
  },
};

export default defineConfig({
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  plugins: [hrVaultAudio, heldChunkGuard, react(), cloudflare()],
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: (chunk) =>
          heldChunk(chunk) ? "assets/held/[name]-[hash].js" : "assets/[name]-[hash].js",
        manualChunks: (id) => {
          if (id.includes('LyricMap')) return 'lyricmap';
        }
      }
    }
  }
})
