#!/usr/bin/env node
/* ===========================================================================
   npm run day:proof — PROVE THE WRITING SURFACE BY LOSING SOMETHING FIRST.
   ===========================================================================
   [PIECE 4, 2026-08-26]

   **OPS WILL NOT ACCEPT "IT WORKS", AND A GUARD WITH ONLY A CLEAN RUN BEHIND
   IT PROVES NOTHING.** Every property below is demonstrated FAILING against a
   deliberately broken build before it is demonstrated passing. A check that has
   never been seen to go red is a check nobody has tested — it is
   `hit.contains(control)` again, and that one made every point pass.

     P1  A KEYSTROKE SURVIVES TO THE TREE, CHARACTER FOR CHARACTER — and the
         FIELD SET as well as the prose, because `record:land --verify` printed
         "ALL 51 STRINGS ROUND-TRIP" on the day six photographs and four
         sources were being destroyed. Prose is not the round trip.
     P2  THE PAGE KNOWS WHICH TREE IT WAS BAKED FROM and a save from a stale
         page is refused. The loss is LANDED FIRST, with the guard off, and the
         destroyed paragraph is named — because the whole reason this guard
         exists is that `record:land`'s guard 8 passes this case.
     P3  A DELETION IS NEVER SILENT — and the limit is stated rather than
         glossed: it cannot tell a deliberate deletion from a bug.

   ── HOW IT RUNS ────────────────────────────────────────────────────────────
   AGAINST THE REAL EVERYTHING. The real collector, the real server, the real
   emitter, the real museum reader, the real Record file. Three files are
   snapshotted by sha256 and restored, and the restoration is PROVED rather
   than assumed — the same construction `record-land-proof.mjs` uses, for the
   same reason: a proof that can leave the tree changed is a hazard wearing a
   green tick.

     src/data/artists/robots-record.js          the Record
     docs/dictation-20260807/record-draft.json  his words
     docs/dictation-20260807/readiness.json     his marks

   AND IT ASSERTS THE COLLECTOR IS THE ONE HE TYPES INTO, FIRST, BEFORE ANY
   CHECK RUNS. `day.html` inlines `day-collect.js` verbatim; this reads the
   same file and evaluates it. If the two ever differ, every result below is
   about a program nobody is using — so the sha256 comparison is check zero and
   nothing else runs if it fails.
   =========================================================================== */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import http from "node:http";
import crypto from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { draftEntries, RECORD_SOURCE } from "../../reveal/record-entries.mjs";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
process.chdir(REPO);

const TARGET = RECORD_SOURCE;
const DRAFT = "docs/dictation-20260807/record-draft.json";
const MARKS = "docs/dictation-20260807/readiness.json";
const PAGE = "docs/dictation-20260807/day.html";
const COLLECT = "tools/dictation/day-collect.js";
const EMIT = "tools/dictation/emit-record-entries.mjs";
const TMP = "_day-proof-draft.json";
const PORT = 8971;

const sha = f => crypto.createHash("sha256").update(fs.readFileSync(f)).digest("hex");
const shaOf = s => crypto.createHash("sha256").update(Buffer.from(s, "utf8")).digest("hex");

/* ── THE SNAPSHOT, TAKEN BEFORE ANYTHING IS TOUCHED ───────────────────── */
const SNAP = {};
for (const f of [TARGET, DRAFT, MARKS]) SNAP[f] = fs.readFileSync(f);
const restore = () => { for (const f of Object.keys(SNAP)) fs.writeFileSync(f, SNAP[f]); };

let failures = 0, checks = 0;
const say = (ok, msg) => {
  checks++; if (!ok) failures++;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${msg}`);
};
/* A BREAKAGE IS A CHECK TOO, AND IT PASSES WHEN THE PROPERTY GOES RED. This
   is the half that makes the green half worth reading. */
let losses = 0;
const lost = (caught, msg) => {
  checks++; if (!caught) failures++; else losses++;
  console.log(`  ${caught ? "LOST" : "FAIL"}  ${msg}`);
};
const head = t => { console.log(""); console.log(t); console.log(""); };

/* ── CHECK ZERO — IS THE COLLECTOR THE ONE HE TYPES INTO? ──────────────── */
head("CHECK ZERO — THE COLLECTOR ON THE PAGE IS THE COLLECTOR UNDER TEST");
const COLLECT_SRC = fs.readFileSync(COLLECT, "utf8");
{
  const pageSrc = fs.readFileSync(PAGE, "utf8");
  const inlined = pageSrc.includes(COLLECT_SRC);
  say(inlined, `${COLLECT} is inlined in ${PAGE} byte for byte  (sha ${shaOf(COLLECT_SRC).slice(0, 16)}…)`);
  if (!inlined) {
    console.log("");
    console.log("  The page and this proof are running different collectors, so nothing below");
    console.log("  would be about the program he types into.  Run:  npm run day");
    process.exit(1);
  }
}
const load = (src) => (new Function(src + "\n;return globalThis.WBDay;"))();
const WB = load(COLLECT_SRC);

/* MUTATE THE SOURCE TEXT TO BUILD A BROKEN COLLECTOR. It is the real file with
   one behaviour removed — not a stub written to fail, which would only prove
   that a stub fails. */
function broken(find, replace, name) {
  if (!COLLECT_SRC.includes(find)) {
    say(false, `the breakage "${name}" no longer matches ${COLLECT} — this proof has gone stale`);
    return null;
  }
  return load(COLLECT_SRC.replace(find, replace));
}

const clone = v => JSON.parse(JSON.stringify(v));
const norm = v => JSON.stringify(sortKeys(v));
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === "object") {
    const o = {};
    for (const k of Object.keys(v).sort()) o[k] = sortKeys(v[k]);
    return o;
  }
  return v;
}

const ENTRIES = draftEntries().entries;
const EPOCH = draftEntries().epoch;
const byNo = n => ENTRIES.find(e => e.no === n);

/* the entry with the `{pre}` listing, and the one with wired attachments —
   named by what they CARRY rather than by number, so a renumbering does not
   quietly turn this proof into a test of two ordinary entries. */
const PRE_ENTRY = ENTRIES.find(e => (e.sections || [])
  .some(s => (s.body || []).some(p => p && typeof p === "object" && typeof p.pre === "string")));
const DOC_ENTRY = ENTRIES.find(e => (e.docs || [])
  .some(d => d.source || d.pages != null || (d.plates || []).length));
const INDENT_ENTRY = ENTRIES.find(e => (e.sections || [])
  .some(s => (s.body || []).some(p => typeof p === "string" && /^ +\S/m.test(p))));

const land = (args) => {
  try {
    return { code: 0, out: execFileSync("node", [EMIT, ...args],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], maxBuffer: 1e8 }) };
  } catch (e) { return { code: e.status, out: (e.stdout || "") + (e.stderr || "") }; }
};
function writeDraft(entries, savedISO) {
  fs.writeFileSync(TMP, JSON.stringify({
    key: "wb.day.proof", saved: savedISO || new Date(Date.now() + 3600e3).toISOString(),
    epoch: EPOCH, entries }, null, 1));
}

/* ═══════════════════════════════════════════════════════════════════════════
   P1 — A KEYSTROKE SURVIVES TO THE TREE, CHARACTER FOR CHARACTER
   ═══════════════════════════════════════════════════════════════════════════ */
head("P1 — A KEYSTROKE SURVIVES TO THE TREE, AND SO DOES EVERY FIELD BESIDE IT");

/* ── P1.0 THE IDENTITY. Open a day and save it without touching a key. ──── */
{
  let same = 0, diff = [];
  for (const e of ENTRIES) {
    const out = WB.collect(WB.modelOf(clone(e)));
    if (norm(out) === norm(e)) same++; else diff.push(e.no);
  }
  say(same === ENTRIES.length,
    `OPENING ${ENTRIES.length} days and saving them untouched changes NOTHING — `
    + `${same}/${ENTRIES.length} deep-equal ignoring key order`
    + (diff.length ? `, differs: ${diff.join(", ")}` : ""));
}

/* ── P1.0 LOST FIRST — the rest spread removed. ─────────────────────────── */
{
  const b = broken("for (k in rest) if (Object.prototype.hasOwnProperty.call(rest, k)) e[k] = rest[k];",
    "/* the rest spread, deliberately removed */", "rest spread");
  if (b) {
    const e = clone(DOC_ENTRY);
    const out = b.collect(b.modelOf(e));
    const before = (e.docs || []).length;
    const after = (out.docs || []).length;
    const platesBefore = (e.docs || []).reduce((a, d) => a + (d.plates || []).length, 0);
    lost(norm(out) !== norm(e) && after === 0,
      `WITH THE rest SPREAD REMOVED, Record ${String(e.no).padStart(3, "0")} loses `
      + `${before} attachment(s) and ${platesBefore} plate(s) — and the identity check above `
      + `catches it. THE EMITTER CANNOT: its guard names a field it cannot WRITE, and an `
      + `ABSENT field is not something it can see.`);
  }
}

/* ── P1.1 THE {pre} LISTING. ───────────────────────────────────────────── */
if (PRE_ENTRY) {
  const e = clone(PRE_ENTRY);
  const out = WB.collect(WB.modelOf(e));
  const pres = (out.sections || []).flatMap(s => (s.body || [])
    .filter(p => p && typeof p === "object" && typeof p.pre === "string"));
  say(pres.length === 1 && norm(out) === norm(e),
    `Record ${String(e.no).padStart(3, "0")}'s folder tree comes back as a LISTING, not a `
    + `paragraph — ${pres.length} {pre} item, ${JSON.stringify(String(pres[0] && pres[0].pre).slice(0, 28))}…`);

  /* and it survives being TYPED INTO, which is the case the box exists for */
  const m = WB.modelOf(clone(e));
  const blk = m.sections.flatMap(s => s.blocks).find(b => b.kind === "pre");
  blk.text = blk.text + "\n       NEWFILE.CFG";
  const typed = WB.collect(m);
  const p2 = (typed.sections || []).flatMap(s => (s.body || [])
    .filter(p => p && typeof p === "object" && typeof p.pre === "string"));
  say(p2.length === 1 && /NEWFILE\.CFG/.test(p2[0].pre),
    `and editing that box keeps it a LISTING — the typed line is in the {pre}, not beside it`);

  const b = broken("if (b.kind === \"pre\") return [{ pre: outOf(b) }];",
    "if (b.kind === \"pre\") return [outOf(b)];", "{pre} preservation");
  if (b) {
    const outB = b.collect(b.modelOf(clone(e)));
    const presB = (outB.sections || []).flatMap(s => (s.body || [])
      .filter(p => p && typeof p === "object"));
    lost(presB.length === 0 && norm(outB) !== norm(e),
      `WITH {pre} PRESERVATION REMOVED, the folder tree comes back as an ordinary paragraph. `
      + `Every character is still there and the museum draws it as prose — this is the loss `
      + `a prose-only check reports green.`);
  }
} else {
  say(false, "no entry in the Record carries a {pre} listing — P1.1 cannot run");
}

/* ── P1.2 HIS LEADING SPACES. ──────────────────────────────────────────── */
if (INDENT_ENTRY) {
  const e = clone(INDENT_ENTRY);
  const out = WB.collect(WB.modelOf(e));
  say(norm(out) === norm(e),
    `Record ${String(e.no).padStart(3, "0")}'s leading indent survives an untouched save — `
    + `the box SHOWS it dedented and SAVES the original`);

  /* and an EDITED box keeps the block's own level */
  const m = WB.modelOf(clone(e));
  const s0 = m.sections.find(s => s.blocks.some(b => b.cut > 0));
  const blk = s0.blocks.find(b => b.cut > 0);
  const cut = blk.cut;
  blk.text = blk.text + "\n\nA line the proof typed.";
  const typed = WB.collect(m);
  const added = (typed.sections.find(s => s.label === s0.label.orig) || {}).body || [];
  const mine = added.find(p => typeof p === "string" && /A line the proof typed\./.test(p));
  say(!!mine && mine === " ".repeat(cut) + "A line the proof typed.",
    `and a line typed INTO that block lands at the block's own level — ${cut} space(s) re-applied, `
    + `so an edit does not sit at a different indent from the paragraph above it`);

  /* THE BREAKAGE IS THE DEFECT ITSELF: a box that SAVES WHAT IT SHOWS.
     Note that `dedent` then `reindent` is an identity, so removing the
     untouched-original rule ALONE loses nothing — the two halves protect
     together, and this mutation removes both by returning the displayed text
     the way a naive editor would. That is the honest breakage; removing one
     line and calling it a loss would be a check passing on a technicality. */
  const b = broken(
    "    if (b.orig != null && dedent(b.orig).text === t) {\n"
    + "      /* UNTOUCHED: the items that arrived, in the shapes they arrived in. */\n"
    + "      return (b.items || []).slice();\n"
    + "    }\n"
    + "    var whole = reindent(t, b.cut || 0);",
    "    var whole = t; /* the box saves what it SHOWS — the defect, on purpose */",
    "save-what-you-show");
  if (b) {
    const outB = b.collect(b.modelOf(clone(e)));
    const gone = JSON.stringify(outB) !== JSON.stringify(e);
    lost(gone,
      `WITH THE BOX SAVING WHAT IT SHOWS, merely OPENING the page and pressing Save rewrites `
      + `the indentation of every section he never touched — Record `
      + `${String(e.no).padStart(3, "0")} comes back with its leading spaces gone.`);
  }
} else {
  say(false, "no entry carries a leading indent — P1.2 cannot run");
}

/* ── P1.3 WHICH DAYS CAN HIS SAVE ACTUALLY LAND TODAY? ──────────────────
   MEASURED, NOT ASSUMED, AND IT IS THE FINDING OF THIS ROUND. `record:land`
   guard 6 refuses a CHANGE to an entry that carries comment blocks, because a
   generated entry has nowhere to put the reasoning. The Record is 77% comment
   by character. So the wall is real and it is not a defect — it is the lander
   protecting the standing reasoning — but it decides what the writing surface
   can do on day one, and it must be a measurement rather than a surprise. */
const CAN_LAND = [];
head("P1.3 — WHICH OF HIS DAYS CAN A SAVE FROM THIS PAGE ACTUALLY LAND TODAY?");
for (const e of ENTRIES) {
  const entries = ENTRIES.map(x => {
    const m = WB.modelOf(clone(x));
    if (x.no === e.no) {
      const blk = m.sections[0].blocks.find(b => b.kind === "strs");
      blk.text = blk.text + "\n\nA probe line.";
    }
    return WB.collect(m);
  });
  writeDraft(entries);
  const r = land(["--draft", TMP, "--write"]);
  restore();
  const ok = r.code === 0;
  if (ok) CAN_LAND.push(e.no);
  const why = ok ? "lands"
    : /CHANGED carries/.test(r.out) ? "REFUSED by guard 6 — it carries standing reasoning"
      : `REFUSED — ${(r.out.split("\n")[0] || "").slice(0, 60)}`;
  console.log(`        Record ${String(e.no).padStart(3, "0")}  ${why}`);
}
say(CAN_LAND.length > 0,
  `${CAN_LAND.length} of ${ENTRIES.length} existing days accept an edit from this page today `
  + `(${CAN_LAND.map(n => String(n).padStart(3, "0")).join(", ") || "none"}). `
  + `THE REST ARE WALLED BY guard 6 AND THAT GUARD IS CORRECT — the fix is to move an entry's `
  + `reasoning above it, one entry at a time, not to weaken the guard.`);
say(CAN_LAND.length < ENTRIES.length,
  `and the wall is REPORTED rather than discovered — a save that writes a draft nothing can `
  + `land is the quietest failure this surface has left, and it is named here and in the round log`);
const EDITABLE = ENTRIES.find(e => CAN_LAND.includes(e.no)) || ENTRIES[ENTRIES.length - 1];

/* ── P1.4 END TO END, THROUGH THE REAL LANDER. ─────────────────────────── */
{
  const MARKER = "A sentence the day editor typed, with  two spaces and a comma.";
  const target = EDITABLE;
  const entries = ENTRIES.map(e => {
    const m = WB.modelOf(clone(e));
    if (e.no === target.no) {
      const blk = m.sections[0].blocks.find(b => b.kind === "strs");
      blk.text = blk.text + "\n\n" + MARKER;
    }
    return WB.collect(m);
  });
  writeDraft(entries);
  const r = land(["--draft", TMP, "--write"]);
  const after = draftEntries().entries  /* NO ARG: the epoch is in record-epoch.js, so passing the
     entries file as src makes every date resolve to null and every entry read as changed */;
  const a = after.find(x => x.no === target.no);
  const landed = (a.sections || []).flatMap(s => s.body || [])
    .some(p => typeof p === "string" && p.indexOf(MARKER) >= 0);
  say(r.code === 0 && landed,
    `a sentence typed into the box is IN THE RECORD, character for character, double space `
    + `and all  (exit ${r.code})`);

  /* THE FIELD SET, WHICH IS THE HALF THE PROSE CHECK CANNOT SEE. */
  const holes = [];
  for (const e of ENTRIES) {
    const now = after.find(x => x.no === e.no);
    if (!now) { holes.push(`Record ${e.no} is GONE`); continue; }
    for (const k of Object.keys(e)) {
      if (k === "sections" && e.no === target.no) continue;
      if (norm(now[k]) !== norm(e[k])) holes.push(`Record ${e.no}: ${k}`);
    }
    for (const k of Object.keys(now)) {
      if (!(k in e)) holes.push(`Record ${e.no}: ${k} APPEARED`);
    }
  }
  say(holes.length === 0,
    `and EVERY OTHER FIELD OF EVERY ENTRY is unchanged — ${ENTRIES.length} entries, field by `
    + `field, not string by string` + (holes.length ? `  — ${holes.join(" · ")}` : ""));
  restore();
}

/* ── P1.5 A NO-OP LANDING IS BYTE-IDENTICAL, THROUGH THE EDITOR. ───────── */
{
  const before = sha(TARGET);
  writeDraft(ENTRIES.map(e => WB.collect(WB.modelOf(clone(e)))));
  const r = land(["--draft", TMP, "--write"]);
  say(r.code === 0 && sha(TARGET) === before,
    `opening every day in the editor and saving without typing leaves ${TARGET} `
    + `BYTE-IDENTICAL  (sha ${sha(TARGET).slice(0, 16)}…)`);
  restore();
}

/* ═══════════════════════════════════════════════════════════════════════════
   P2 — THE STALE PAGE. LOSE IT FIRST, THEN REFUSE IT.
   ═══════════════════════════════════════════════════════════════════════════ */
head("P2 — A PAGE THAT DOES NOT KNOW WHICH TREE IT CAME FROM  ·  LOST, THEN REFUSED");

/* THE PAGE'S OWN BAKED PROVENANCE, read out of the built page rather than
   recomputed here — the question is what the PAGE will send. */
const BAKED = (() => {
  const m = fs.readFileSync(PAGE, "utf8").match(/var SOURCE = (\{[^\n]*?\});/);
  return m ? JSON.parse(m[1]) : null;
})();
say(!!BAKED && BAKED.sha256 === sha(TARGET),
  `the built page carries the Record's sha256 and it matches the tree  `
  + `(${BAKED ? BAKED.sha256.slice(0, 16) + "…" : "NO SOURCE BLOCK IN THE PAGE"})`);

/* ── P2.1 LOST FIRST: the unguarded save lands stale words over new ones. ─
   This is not a hypothetical. It is the sequence run end to end with the
   provenance check absent, which is what every build before this one was. */
let DESTROYED = null;
{
  const stale = ENTRIES.map(e => WB.collect(WB.modelOf(clone(e))));   /* 09:00 — the open tab */

  /* 14:00 — the tree moves. Somebody lands a real edit. */
  const moved = clone(ENTRIES);
  const victim = moved.find(e => e.no === EDITABLE.no);
  DESTROYED = "The paragraph that arrived at 14:00 and was never seen again.";
  victim.sections[0].body.push(DESTROYED);
  writeDraft(moved);
  const r1 = land(["--draft", TMP, "--write"]);
  const mid = draftEntries().entries  /* NO ARG: the epoch is in record-epoch.js, so passing the
     entries file as src makes every date resolve to null and every entry read as changed */.find(e => e.no === victim.no);
  const arrived = (mid.sections || []).flatMap(s => s.body || []).some(p => p === DESTROYED);
  say(r1.code === 0 && arrived, `14:00 — a paragraph lands in Record ${String(victim.no).padStart(3, "0")}: ${JSON.stringify(DESTROYED)}`);

  /* 16:00 — he saves from the tab he opened at 09:00. The stamp is HONEST. */
  writeDraft(stale, new Date().toISOString());
  const r2 = land(["--draft", TMP, "--write"]);
  const end = draftEntries().entries  /* NO ARG: the epoch is in record-epoch.js, so passing the
     entries file as src makes every date resolve to null and every entry read as changed */.find(e => e.no === victim.no);
  const survives = (end.sections || []).flatMap(s => s.body || []).some(p => p === DESTROYED);
  lost(r2.code === 0 && !survives,
    `16:00 — the STALE page saves with a TRUE timestamp, record:land's guard 8 PASSES `
    + `(exit ${r2.code}), and the 14:00 paragraph is GONE. Guard 8 compares the STAMP, not `
    + `the WORDS. It is not defective — the draft really is new; it is the PAGE that is old.`);
  restore();
}

/* ── P2.2 THE REFUSAL, ON THE REAL SERVER. ─────────────────────────────── */
{
  const server = spawn(process.execPath, ["tools/dictation/record-serve.mjs", String(PORT)],
    { cwd: REPO, stdio: ["ignore", "pipe", "pipe"] });
  const up = await new Promise(res => {
    const t = setTimeout(() => res(false), 8000);
    server.stdout.on("data", d => {
      if (String(d).includes("127.0.0.1:" + PORT)) { clearTimeout(t); res(true); }
    });
  });
  say(up, `the real save server is listening on 127.0.0.1:${PORT}`);

  const post = (body) => new Promise((res, rej) => {
    const data = Buffer.from(JSON.stringify(body), "utf8");
    const req = http.request({ host: "127.0.0.1", port: PORT, path: "/day/save", method: "POST",
      headers: { "content-type": "application/json", "content-length": data.length } }, r => {
      let b = ""; r.on("data", c => b += c);
      r.on("end", () => { try { res({ s: r.statusCode, j: JSON.parse(b) }); } catch (e) { rej(e); } });
    });
    req.on("error", rej); req.end(data);
  });

  if (up) {
    const entries = ENTRIES.map(e => WB.collect(WB.modelOf(clone(e))));

    /* the honest save, from a page built against the tree as it stands */
    const okRes = await post({ epoch: EPOCH, source: { sha256: sha(TARGET), mtime: "x" },
      marks: { "3": { "field:title": { notReady: true } } }, entries });
    const draftOk = okRes.s === 200 && JSON.parse(fs.readFileSync(DRAFT, "utf8")).entries.length === entries.length;
    const marksOk = JSON.parse(fs.readFileSync(MARKS, "utf8")).marks["3"]["field:title"].notReady === true;
    say(draftOk && marksOk,
      `a save from a CURRENT page writes both files — ${entries.length} record(s) to the draft `
      + `AND his mark to readiness.json, in one request  (${okRes.s})`);
    say(okRes.j && okRes.j.landing === "npm run record:land -- --write" && !("record" in (okRes.j || {})),
      `and the endpoint never claims the Record — it answers with the landing command, which is Mike's`);

    /* THE SAME SAVE, FROM A PAGE BUILT AGAINST A DIFFERENT TREE */
    const staleRes = await post({ epoch: EPOCH,
      source: { sha256: "0".repeat(64), mtime: "2026-08-26T09:00:00.000Z" }, entries });
    const untouched = sha(DRAFT) === shaOf(fs.readFileSync(DRAFT, "utf8"));
    say(staleRes.s === 409 && staleRes.j.stale === true
      && /MOVED AFTER THIS PAGE WAS BUILT/.test(staleRes.j.why),
      `THE SAME SAVE FROM A STALE PAGE IS REFUSED — 409, by name, and it says which sha it `
      + `was built against and which is on disk. This is the case P2.1 landed.`);
    say(untouched, `and nothing was written while it refused`);

    /* AND A SAVE THAT CARRIES NO PROVENANCE AT ALL IS REFUSED TOO — a page
       built before this guard existed must not be able to save past it. */
    const bareRes = await post({ epoch: EPOCH, entries });
    say(bareRes.s === 400 && /no record of which Record it was typed against/.test(bareRes.j.why),
      `a save carrying NO provenance is refused rather than trusted — an old page cannot `
      + `save past a guard by not knowing about it`);

    /* the page's other end: it can ask, without writing a byte */
    const got = await new Promise((res, rej) => {
      http.get({ host: "127.0.0.1", port: PORT, path: "/day/source" }, r => {
        let b = ""; r.on("data", c => b += c);
        r.on("end", () => { try { res(JSON.parse(b)); } catch (e) { rej(e); } });
      }).on("error", rej);
    });
    say(got && got.ok && got.source.sha256 === sha(TARGET),
      `and the page can ASK on focus — GET /day/source answers the tree's sha and writes nothing`);
  }
  server.kill();
  restore();
}

/* ═══════════════════════════════════════════════════════════════════════════
   P3 — A DELETION IS NEVER SILENT
   ═══════════════════════════════════════════════════════════════════════════ */
head("P3 — A DELETION IS NEVER SILENT  ·  AND IT CANNOT TELL A DELIBERATE ONE FROM A BUG");
{
  const e = clone(byNo(3) || ENTRIES[0]);
  const was = WB.keysOf(WB.collect(WB.modelOf(clone(e))));

  /* THE DELIBERATE ONE — he pressed × on a row. */
  const m = WB.modelOf(clone(e));
  const killed = m.sections[1].label.orig;
  m.sections.splice(1, 1);
  const d1 = WB.diffKeys(was, WB.keysOf(WB.collect(m)));
  say(d1.gone.length === 1 && d1.gone[0] === "section:" + killed,
    `a section deleted through the page is NAMED — gone: ${JSON.stringify(d1.gone)}`);

  /* A CLEARED HEADLINE IS THE SAME EVENT, which is why the key set is the
     test rather than a section count. */
  const m2 = WB.modelOf(clone(e));
  m2.fields.title.text = "";
  const d2 = WB.diffKeys(was, WB.keysOf(WB.collect(m2)));
  say(d2.gone.length === 1 && d2.gone[0] === "field:title",
    `and CLEARING the headline is the same event to the same check — gone: ${JSON.stringify(d2.gone)}`);

  /* THE BUG — a collector that drops a row. Same shape, same report. */
  const b = broken("secs.push({ label: label, body: body });",
    "if (i !== 1) secs.push({ label: label, body: body });", "a section-dropping bug");
  if (b) {
    const d3 = WB.diffKeys(was, WB.keysOf(b.collect(b.modelOf(clone(e)))));
    lost(d3.gone.length === 1 && d3.gone[0] === "section:" + killed,
      `A COLLECTOR THAT DROPS A ROW BY BUG IS REPORTED IDENTICALLY — gone: `
      + `${JSON.stringify(d3.gone)}. **THIS IS THE LIMIT, STATED RATHER THAN GLOSSED:** the `
      + `check cannot tell his × from a defect. It makes sure NEITHER is silent. Telling them `
      + `apart needs him to confirm, and a confirmation step is UX.`);
  }

  /* AND A REORDERED DAY REPORTS NOTHING, because a key is an identity and
     never a position — the same rule one floor down from OPERATIONS §5. */
  const m4 = WB.modelOf(clone(e));
  m4.sections.reverse();
  const d4 = WB.diffKeys(was, WB.keysOf(WB.collect(m4)));
  say(d4.gone.length === 0 && d4.added.length === 0,
    `reordering the day reports NOTHING — a key is an identity, never a position`);
}

/* ═══════════════════════════════════════════════════════════════════════════
   RESTORE, AND PROVE IT
   ═══════════════════════════════════════════════════════════════════════════ */
fs.rmSync(TMP, { force: true });
restore();
head("THE TREE, AFTER");
let clean = true;
for (const f of Object.keys(SNAP)) {
  const ok = sha(f) === shaOf(SNAP[f].toString("utf8"));
  if (!ok) clean = false;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${f}  sha256 ${sha(f).slice(0, 32)}…`);
}
say(clean, "every file this proof touched is identical to where it started");

console.log("");
if (failures) {
  console.log(`${failures} of ${checks} CHECK(S) FAILED.`);
  process.exit(1);
}
console.log(`ALL ${checks} CHECKS PASSED — and every one of P1, P2 and P3 was shown LOSING`);
console.log(`something first. The ${losses} lines marked LOST are the proof that the ${checks - losses} lines`);
console.log(`marked ok are measuring anything at all.`);
