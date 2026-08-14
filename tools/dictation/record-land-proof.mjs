#!/usr/bin/env node
/* ===========================================================================
   npm run record:proof — prove the lander carries Mike's reasoning. [2026-08-13]
   ---------------------------------------------------------------------------
   Two batteries, run against the REAL record file. Every write is reverted and
   the reversion is proved by sha256.

     THE CARRY   a no-op landing is byte-identical · a NEW record lands beside
                 the commented ones with nothing lost · a CHANGE to a commented
                 entry is refused by name · a change to an UNcommented one lands.
     THE GUARDS  all eight fire on the case each was built for, and none of them
                 writes anything while refusing.

   IT EXISTS BECAUSE SATURDAY DEPENDS ON IT. Mike writes five Records and the
   lander splices them into a file that is 61% standing reasoning by character.
   A proof that ran once is worth less than one that can be re-run before the
   day and after any change to the emitter.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { draftEntries } from "../../reveal/record-entries.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
process.chdir(REPO);

const TARGET = "src/data/artists/robots-record.js";
const TMP = "_record-proof-draft.json";
const EMIT = "tools/dictation/emit-record-entries.mjs";
const sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");

const orig = fs.readFileSync(TARGET);
const origSha = sha(TARGET);
const restore = () => fs.writeFileSync(TARGET, orig);
const commentsOf = t => (t.match(/\/\*[\s\S]*?\*\//g) || []);
const ORIG_COMMENTS = commentsOf(orig.toString("utf8"));

const land = (args) => {
  try {
    return { code: 0, out: execFileSync("node", [EMIT, ...args],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1e8 }) };
  } catch (e) { return { code: e.status, out: (e.stdout || "") + (e.stderr || "") }; }
};

/* a draft derived FROM the tree — the shape the editor saves. Dates are filled
   in because `draftEntries` cannot resolve `recordDay(n)` against a source that
   is not `record-epoch.js`, and a draft with null dates reads as a change. */
function makeDraft(mutate) {
  const d = draftEntries(fs.readFileSync(TARGET, "utf8"));
  const entries = JSON.parse(JSON.stringify(d.entries));
  const day = (n) => {
    const t = new Date((d.epoch || "2026-08-17") + "T00:00:00Z");
    t.setUTCDate(t.getUTCDate() + (n - 1));
    return t.toISOString().slice(0, 10);
  };
  for (const e of entries) e.date = day(e.no);
  const lib = { key: "wb.record.2026-08-09",
    saved: new Date(Date.now() + 3600e3).toISOString(), epoch: d.epoch, entries };
  if (mutate) mutate(lib);
  fs.writeFileSync(TMP, JSON.stringify(lib, null, 1));
  return lib;
}

let failures = 0;
const say = (ok, msg) => { if (!ok) failures++; console.log(`  ${ok ? "ok  " : "FAIL"}  ${msg}`); };

/* ══════════════════ BATTERY ONE — THE CARRY ══════════════════ */
console.log("THE CARRY");
console.log(`  ${TARGET}  ${orig.length} bytes, ${ORIG_COMMENTS.length} comment block(s)`);
console.log("");

/* 1 — a no-op landing must be byte-identical */
makeDraft(null);
let r = land(["--draft", TMP, "--write"]);
say(sha(TARGET) === origSha,
  `a no-op landing is BYTE-IDENTICAL  (exit ${r.code}, sha ${sha(TARGET).slice(0, 16)}…)`);
restore();

/* 2 — a NEW record lands and loses nothing */
makeDraft(lib => lib.entries.push({
  no: 6, date: "2026-08-22", title: "A REHEARSAL ENTRY",
  line: "One line, written by the proof.",
  sections: [{ label: "EXECUTIVE SUMMARY", body: ["Nothing here is real."] }],
}));
r = land(["--draft", TMP, "--write"]);
{
  const t = fs.readFileSync(TARGET, "utf8");
  const lost = ORIG_COMMENTS.filter(c => !t.includes(c));
  const stripped = t.replace(/\n {12}\{ no: 6,[\s\S]*?\n {12}\},\n/, "\n");
  say(lost.length === 0 && /no:\s*6,/.test(t),
    `a NEW record 006 lands; ${ORIG_COMMENTS.length} comment block(s) survive, ${lost.length} lost`);
  say(stripped === orig.toString("utf8"),
    "with 006 removed the file is identical to the original — only the new entry moved");
}
restore();

/* 3 — a CHANGE to a commented entry is refused by name */
makeDraft(lib => {
  const e = lib.entries.find(x => x.no === 1);
  e.sections[0].body[0] += " CHANGED BY THE PROOF";
});
r = land(["--draft", TMP, "--write"]);
say(r.code === 1 && /an entry whose text CHANGED carries/.test(r.out) && /Record 001/.test(r.out)
  && sha(TARGET) === origSha,
  "a CHANGE to a commented entry is REFUSED, names Record 001, writes nothing");
restore();

/* 4 — a change to an UNcommented entry lands, losing nothing */
makeDraft(lib => {
  const e = lib.entries.find(x => x.no === 5);
  e.sections[0].body[0] = "Weird.Baby uptime: 100%, no anomalies, proof edit";
});
r = land(["--draft", TMP, "--write"]);
{
  const t = fs.readFileSync(TARGET, "utf8");
  say(t.includes("proof edit") && ORIG_COMMENTS.filter(c => !t.includes(c)).length === 0,
    "a change to an UNcommented entry (005) lands and loses no comments");
}
restore();

/* ══════════════════ BATTERY TWO — THE GUARDS ══════════════════ */
console.log("");
console.log("THE GUARDS");
console.log("");

const guard = (n, name, args, mutate, wants) => {
  makeDraft(mutate);
  /* the baseline is taken AFTER the mutation: guard 2's case corrupts the
     TARGET itself, and "clean" means the guard left the file as it found it */
  const baseline = sha(TARGET);
  const res = land(args);
  const fired = wants.test(res.out);
  const clean = sha(TARGET) === baseline;
  say(fired && clean, `guard ${String(n).padEnd(4)} ${name.padEnd(44)} exit ${res.code}`);
  restore();
};

guard(1, "`--no` is a preview filter", ["--draft", TMP, "--no", "1", "--write"], null,
  /preview filter/);
guard(2, "the preamble must be found", ["--draft", TMP, "--write"],
  () => fs.writeFileSync(TARGET, orig.toString("utf8")
    .replace("export const RECORD_ENTRIES = [", "export const NOT_IT = [")),
  /no `export const RECORD_ENTRIES|RECORD_ENTRIES array this reader can find/);
guard(3, "no record may vanish", ["--draft", TMP, "--write"],
  lib => { lib.entries = lib.entries.filter(e => e.no !== 3); },
  /does not carry record\(s\) 3/);
guard(6, "it may not eat the reasoning", ["--draft", TMP, "--write"],
  lib => { lib.entries.find(e => e.no === 1).title = "EATEN"; },
  /CHANGED carries|would delete \d+ characters of/);
guard(8, "a stale draft may not land", ["--draft", TMP, "--write"],
  lib => { lib.saved = "2020-01-01T00:00:00.000Z"; },
  /OLDER than the Record/);
guard("8a", "a draft may not resurrect a retired record", ["--draft", TMP, "--write"],
  lib => { lib.entries.push({ no: 13, title: "back from the dead", sections: [] }); },
  /RESURRECT record\(s\) 013/);
guard("8b", "a draft with no `saved` is refused", ["--draft", TMP, "--write"],
  lib => { delete lib.saved; },
  /no `saved` timestamp/);
guard(0, "curly-brace notes are refused", ["--draft", TMP, "--write"],
  lib => { lib.entries.find(e => e.no === 2).title = "A {note to Ops} in a title"; },
  /note\(s\) to Ops are still in this draft/);

/* ══════════════════ RESTORE ══════════════════ */
fs.rmSync(TMP, { force: true });
restore();
console.log("");
console.log(`  ${TARGET} sha256 ${sha(TARGET)}`);
console.log(`  identical to where it started: ${sha(TARGET) === origSha}`);
console.log("");
if (failures) { console.log(`${failures} CHECK(S) FAILED.`); process.exit(1); }
console.log("ALL CHECKS PASSED — the lander carries the reasoning and every guard holds.");
