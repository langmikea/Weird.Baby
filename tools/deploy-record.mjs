#!/usr/bin/env node
/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
/* tools/deploy-record.mjs — WRITES docs/DEPLOYED.md. The only path it touches.
   [2026-08-24]
   ---------------------------------------------------------------------------
   WHAT IT ENDS: on 2026-08-24 nothing in this repository could answer *what is
   live*. There were no tags, no deploy log, an empty `.wrangler/`, and STATE.md
   said nothing. Establishing it took a probe of production and a bracket read
   off which fields `/api/record` was MISSING — a method that works once and
   should never be needed twice.

   ═══ IT RUNS AS PART OF THE DEPLOY, NOT AFTER SOMEBODY REMEMBERS ════════════
   It is the last link of both deploy chains, joined by `&&`, so it runs if and
   only if `wrangler deploy` exited 0. There is no step for a person to skip and
   no note telling anybody to run it. **A record that depends on being
   remembered is not a record; it is a habit, and the night it matters is the
   night it is skipped.**

   ═══ AND IT IS STILL NOT ENOUGH ON ITS OWN, WHICH IS WHY THERE ARE TWO ══════
   This file writes into the tree AFTER the upload, so what it writes is an
   UNCOMMITTED change that a person then has to commit. That is a real gap and
   it is not closable from here. It is closed on the other side: the commit sha
   is compiled into the worker (`__WB_COMMIT__`) and `/api/held` reports it to a
   key-holder. **The wire is the authority; this file is the convenience.** When
   the two disagree, the wire is right and this file was not committed.

   ═══ WHAT IT CANNOT SEE ════════════════════════════════════════════════════
   Anything that reaches `wrangler deploy` directly writes no record, exactly as
   it passes no guard. That is not a hole this file opens — §0 already forbids
   that form and deliberately does not print it — but a reader of
   `docs/DEPLOYED.md` must know that a MISSING row does not prove nothing
   shipped. Ask the wire.

   ═══ `dirty` IS LOAD-BEARING ═══════════════════════════════════════════════
   Mike deploys from the working tree. A commit sha recorded against a tree with
   uncommitted changes describes something that has never existed in history, so
   the row carries the flag and the paths. The same reasoning as the conduit's
   freshness stamp: a stamp that can be true of two different things is not one.

   Run as part of `npm run deploy` / `npm run deploy:launch`. */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DEVELOPMENT, LAUNCH } from "../reveal/stage.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WORKER = path.join(REPO, "dist", "weird_baby", "index.js");
const OUT = path.join(REPO, "docs", "DEPLOYED.md");
const REL = "docs/DEPLOYED.md";

const want = process.argv.includes("--launch") ? LAUNCH : DEVELOPMENT;

const git = (cmd, fallback) => {
  try { return execSync(cmd, { cwd: REPO, encoding: "utf8" }).trim(); }
  catch { return fallback; }
};
/* `--porcelain` COLUMNS ARE SIGNIFICANT AND `trim()` EATS THEM. Status is two
   characters then a space, and an unstaged modification's first column is a
   SPACE — so trimming the whole output shifts line one left by one and
   `slice(3)` then takes a character off the path. It printed `ackage.json` for
   `package.json` on the first run of this file. Trailing whitespace only. */
const gitLines = (cmd) => {
  try {
    return execSync(cmd, { cwd: REPO, encoding: "utf8" })
      .replace(/\s+$/, "").split("\n").filter(Boolean);
  } catch { return []; }
};

/* THE STAGE IS READ OFF THE ARTIFACT, not off the flag — the same rule
   `deploy-guard.mjs` follows and for the same reason: this records what
   SHIPPED, and the flag is what somebody asked for. They have disagreed. */
let builtStage = "unknown";
let fingerprint = "unknown";
if (fs.existsSync(WORKER)) {
  const src = fs.readFileSync(WORKER, "utf8");
  const hasLaunch = /["']launch["']/.test(src);
  const hasDev = /["']development["']/.test(src);
  builtStage = hasLaunch && !hasDev ? LAUNCH : hasDev && !hasLaunch ? DEVELOPMENT : "ambiguous";
  fingerprint = crypto.createHash("sha256").update(src).digest("hex").slice(0, 16);
}

const sha = git("git rev-parse --short HEAD", "unknown");
const shaLong = git("git rev-parse HEAD", "unknown");
const subject = git("git log -1 --format=%s", "(unknown)");
const porcelainLines = gitLines("git status --porcelain");
const dirty = porcelainLines.length > 0;
const dirtyPaths = porcelainLines.map(l => l.slice(3)).filter(Boolean);
const when = new Date().toISOString();

const HEADER = [
  "<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->",
  "",
  "# DEPLOYED — what is live at weird.baby",
  "",
  "Written by `tools/deploy-record.mjs`, which is the last link of both deploy",
  "chains and runs only when `wrangler deploy` exits 0. **Do not edit by hand.**",
  "",
  "**THE WIRE IS THE AUTHORITY, NOT THIS FILE.** This is written after the upload",
  "and has to be committed by a person, so it can lag. The commit sha is also",
  "compiled into the worker and `/api/held` reports it to a key-holder — when the",
  "two disagree, production is right and this file was not committed.",
  "",
  "**A MISSING ROW DOES NOT PROVE NOTHING SHIPPED.** Anything reaching `wrangler",
  "deploy` directly writes no row, exactly as it passes no guard (§0 forbids that",
  "form). Ask the wire.",
  "",
];

const now = [
  "## Live now",
  "",
  "| field | value |",
  "|---|---|",
  `| commit | \`${sha}\`${dirty ? " **— DIRTY TREE**" : ""} |`,
  `| full sha | \`${shaLong}\` |`,
  `| subject | ${subject} |`,
  `| stage | **${builtStage}** |`,
  `| deployed at | ${when} |`,
  `| worker sha256 | \`${fingerprint}\` (first 16) |`,
  `| tree clean | ${dirty ? "**NO** — " + dirtyPaths.length + " path(s): `" + dirtyPaths.join("`, `") + "`" : "yes"} |`,
  "",
];

/* APPEND-ONLY. The history is read to answer "when did that change", so a run
   never rewrites a past row — it re-renders the header and the Live-now block
   and puts the previous Live-now on top of the log beneath. */
let history = [];
if (fs.existsSync(OUT)) {
  const prev = fs.readFileSync(OUT, "utf8");
  const at = prev.indexOf("## History");
  if (at >= 0) history = prev.slice(at).split(/\r?\n/).slice(1).filter(l => l.startsWith("| `"));
}
const row = `| \`${sha}\`${dirty ? " (dirty)" : ""} | ${builtStage} | ${when} | \`${fingerprint}\` | ${subject} |`;

const out = [
  ...HEADER,
  ...now,
  "## History",
  "",
  "| commit | stage | deployed at | worker sha256 | subject |",
  "|---|---|---|---|---|",
  row,
  ...history,
  "",
].join("\n");

fs.writeFileSync(OUT, out);
console.log(`  deploy recorded — ${REL}: ${sha}${dirty ? " (DIRTY)" : ""} · ${builtStage} · ${when}`);
if (dirty) {
  console.log("  NOTE: the tree was dirty at deploy time. The sha alone does not");
  console.log("        describe what shipped; the row names the paths.");
}
if (builtStage !== want) {
  console.log(`  NOTE: recorded stage (${builtStage}) is not the stage asked for (${want}).`);
}
