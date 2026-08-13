#!/usr/bin/env node
/* ===========================================================================
   THE ARTIFACT TRACKER — he browses a catalogue and assigns.
   ===========================================================================

   [J4 2026-08-12] MIKE'S RULING ON THE SHAPE: *"HE BROWSES A CATALOGUE AND
   ASSIGNS"* — catalogue-first, not day-first. So the catalogue is the left
   column and it is the whole left column; the five days are a narrow rail on
   the right that the catalogue is dragged into.

   [J4b 2026-08-12] SECOND PASS, AND THE FIRST ONE WAS SCOPED WRONG.
   Mike: *"I want 001 to open the Robots wing, I try to select it and it forbids
   me."* He asked for artifacts AND STORY LINKAGES and only the first half was
   built, so a Record entry's other job — ANNOUNCING things — had no address on
   the page at all. There are two catalogues now: PICTURES and STORY EVENTS.

   ── WHAT A RECORD ENTRY CAN ACTUALLY CAUSE ─────────────────────────────────
   Established by reading, not assumed. Five mechanisms, and only ONE of them
   fires by itself:

   1  THE WING OPENS.  src/lib/wing-open.js:
        ROBOTS_OPEN = !launched() || recordEntriesForToday(RECORD_ENTRIES) > 0
      The wing opens because the Record HAS A VISIBLE ENTRY — not by a date and
      not by a declaration. Consumed by App.jsx (the /robots and /robots/record
      routes) and WbHome.jsx (the wing's card on the front page). **THIS IS
      ALREADY TRUE AND NEEDS NOTHING**, which is why the page marks it FIRES BY
      ITSELF rather than offering it as work.
   2  A PICTURE PUBLISHES.  An entry's `assets` array is the delivery list
      (reveal/delivery.mjs). This is the half that already existed.
   3  A PICTURE APPEARS AT THE ENTRY'S HOOK.  `still` + `stillCaption`, through
      placed(). Record 013 was the only user and 013 is deleted, so the import
      is currently gone from robots-record.js and comes back by itself when a
      lander emits a placed() call.
   4  AN ATTACHMENT APPEARS AT THE FOOT.  `wire`, `plates`, `docs` (A1/R4).
      These are payloads Mike WRITES, not things he picks off a shelf, so they
      are reported and not catalogued.
   5  THE ENTRY BECOMES VISIBLE AT ALL.  `date`, through record-clock.mjs.

   ── AND THE LEDGER'S OWN STORY FIELD FIRES NOTHING, WHICH IS THE FINDING ───
   `when` is *"the story day or week a row becomes REVEALED"* and it is null on
   all 166 rows. It is ALSO STRIPPED OUT of the bundle: PUBLIC_FIELDS in
   reveal/public-view.mjs is ["id","build","state","shown"], so `when` never
   reaches the glass and no renderer could read it if it were set. Setting a
   story date therefore records an intention and CAUSES NOTHING.

   What does reach the glass is `state`, and the honest reading of it is
   narrower than it looks: `stateOf()`/`isRevealed()` are exported from
   src/lib/reveal.js and **nothing in src/ calls either of them.** The only
   ledger field with a live consumer is `build`, through isLive() →
   foundation-state.js → the Foundation register's LIVE / NOT BUILT column.

   SO A STORY EVENT IS A DECLARATION A PERSON MUST MAKE, and the page says so
   on every tile rather than implying a switch exists. Revealing a held thing
   is: flip `state` in reveal/ledger-declare.mjs → npm run reveal:build →
   deploy. Three steps, none automatic.

   ── THE FIVE ARTIFACT STATES ───────────────────────────────────────────────
     READY        museum repo, governed /robots/… address, file on disk.
     NO FILE      museum row, governed address, file NOT on disk — this is
                  deliveryFaults() check 4, which surfaces on the day, silently.
     NEEDS A COPY robots repo only. Must be copied in and declared.
     REBUILDING   uncommitted in the robots repo working tree right now.
     SIGNAGE      never deliverable by an entry. Drawn and refused, because a
                  picture missing with no explanation reads as an oversight.

   ── THE THREE STORY-EVENT STATES ───────────────────────────────────────────
     FIRES BY ITSELF   the mechanism is already wired and needs no declaration.
                       Exactly one: the wing opening.
     NEEDS DECLARING   the thing EXISTS (ledger build LIVE or PARTIAL) and is
                       held. A person flips state, rebuilds, deploys.
     NOT BUILT         the thing does not exist (NOT_BUILT or STUB). Announcing
                       it would promise what the museum does not have.
   RETIRED ROWS ARE NOT OFFERED AT ALL — Doctrine 24: once he has ruled a thing
   gone he does not meet it again, tracker included. Twelve rows, absent by
   rule rather than by filter, and this comment is where that is recorded.

   WHAT IT CANNOT KNOW: how long any of the work takes (the ledger's `prod`
   field — needed/printed/photographed/placed — is null on all 166 rows), and
   whether Mike approves a picture (`verdict` and `bucket` are his, null on all
   253 rows, never written or guessed here).

   ── THE WRITE-BACK ─────────────────────────────────────────────────────────
   localStorage on every click (a REFUSAL RAISES A RED BANNER rather than
   losing the afternoon quietly) + an always-present copyable block holding the
   day-by-day list, the NOT-READY list and the exact `assets` arrays keyed by
   record number. NO CLIPBOARD API: the text is selected and he presses Ctrl+C,
   because navigator.clipboard does not work for him and execCommand's return
   value says the command was ENABLED, not that the clipboard changed.
   THE STORAGE KEY IS UNCHANGED FROM THE FIRST PASS ON PURPOSE — story-event
   ids are new strings in the same {day: [ids]} shape, so his existing
   assignments load forward and nothing he already clicked is lost.
   =========================================================================== */

import fs from "node:fs";
import path from "node:path";
import url from "node:url";
import { execFileSync } from "node:child_process";

import { esc, page, OPS_CSS } from "./shell.mjs";
import { thumbnails, diskHref } from "./lighttable.mjs";
import { entries as recordEntries, summaries } from "../../reveal/record-entries.mjs";
import { SIGNAGE, delivered } from "../../reveal/delivery.mjs";
import { GOVERNED_PREFIX } from "../../reveal/placement.mjs";
import { recordDay } from "../../src/data/artists/record-epoch.js";

const HERE = path.dirname(url.fileURLToPath(import.meta.url));
const REPO = path.resolve(HERE, "..", "..");
const ROBOTS_REPO = path.resolve(REPO, "..", "weird-baby-robots");
const OUT = path.join(REPO, "docs", "dictation-20260807", "assign.html");
const TABLE = path.join(REPO, "provenance", "asset-table.json");
const LEDGER = path.join(REPO, "reveal", "ledger.json");

const FRESH = process.argv.includes("--fresh");
const DAYS = 5;

/* THE ORDER READY-FIRST. Mike: *"Sort unavailable items DOWN and dim them.
   What is ready sorts first."* Lower rank sorts earlier. */
const RANK = {
  "READY": 0, "FIRES BY ITSELF": 0,
  "NEEDS DECLARING": 1,
  "NEEDS A COPY": 2,
  "REBUILDING": 3,
  "NO FILE": 4, "NOT BUILT": 4,
  "SIGNAGE": 5,
};
const USABLE = new Set(["READY", "FIRES BY ITSELF", "NEEDS DECLARING"]);

/* ═══ THE ROBOTS WORKING TREE, RIGHT NOW ═══════════════════════════════════
   REBUILDING cannot come from a table — it is a property of the working tree
   at this minute. READ-ONLY against that repo: one status call, nothing
   written, nothing staged. A failure costs the state and the page says so. */
function robotsDirty() {
  try {
    const out = execFileSync("git", ["-C", ROBOTS_REPO, "status", "--porcelain"],
      { encoding: "utf8", timeout: 20000 });
    return { ok: true,
      set: new Set(out.split("\n").map(l => l.slice(3).trim()).filter(Boolean)) };
  } catch (e) {
    return { ok: false, set: new Set(), why: e.message };
  }
}

/* ═══ THE PICTURE GROUPS ═══════════════════════════════════════════════════ */
const GROUPS = [
  { key: "photos", label: "Machine photographs",
    what: "Pictures of the two machines, in the museum and ready to publish.",
    test: e => e.repo === "museum" && /^public\/(held\/)?robots\/reference\//.test(e.path) },
  { key: "art", label: "Covers and artwork",
    what: "The wing's own artwork.",
    test: e => e.repo === "museum" && /^public\/(held\/)?robots\/art\//.test(e.path) },
  { key: "manual", label: "Manual pages — the 1965 operating manual",
    what: "The MGK-VIIIp operating and maintenance manual, page by page. Click the magnifier to read one.",
    test: e => e.repo === "museum" && /^public\/held\/robots\/manual\/page-/.test(e.path) },
  { key: "tuning", label: "Manual — tuning plates",
    what: "The tuning section of the same manual.",
    test: e => e.repo === "museum" && /^public\/held\/robots\/manual\/tuning\//.test(e.path) },
  { key: "plates", label: "Plates",
    what: "Dated plates as received.",
    test: e => e.repo === "museum" && /^public\/held\/robots\/plates\//.test(e.path) },
  { key: "recordings", label: "Recordings off the build cards",
    what: "58 audio files from three build cards. Not pictures — nothing to look at.",
    test: e => e.repo === "museum" && /^public\/held\/robots\/audio\/build\//.test(e.path) },
  { key: "sound", label: "Sound the house holds",
    what: "Recordings the wing holds. An entry delivers sound the same way it delivers a picture.",
    test: e => e.repo === "museum" && /^public\/held\/robots\/audio\/(?!build\/)/.test(e.path) },
  { key: "twin", label: "The twin — program assets",
    what: "Assets belonging to the portal program rather than to a machine.",
    test: e => e.repo === "museum" && /^public\/held\/robots\/twin\//.test(e.path) },
  { key: "elsewhere", label: "Still only in the robots repo",
    what: "These have not been brought into the museum yet, so nothing can publish them today.",
    test: e => e.repo === "robots" },
];


/* ═══ THE STORY-EVENT GROUPS ═══════════════════════════════════════════════
   Grouped by what the thing IS, because that is how he would look for one.
   `cls: "tool"` rows are Ops' own instruments and are LAST and labelled as
   such — they are in the ledger, so hiding them would be Ops deciding for
   him, but they are not things the wing announces to a visitor. */
const EVENT_GROUPS = [
  { key: "rooms", label: "Rooms and surfaces the museum is holding",
    what: "Built, and deliberately unreachable today.",
    cls: new Set(["surface"]) },
  { key: "instr", label: "The Portal's instruments",
    what: "Panels and switches that exist behind the stage door.",
    cls: new Set(["machine"]) },
  { key: "eggs", label: "Eggs",
    what: "Hidden things that exist and nobody can trip yet.",
    cls: new Set(["egg"]) },
  { key: "sounds", label: "Sounds the house holds",
    what: "Recordings that exist and are held.",
    cls: new Set(["sound"]) },
  { key: "papers", label: "Documents and physical objects",
    what: "Paper and things, held.",
    cls: new Set(["document", "artifact", "prop"]) },
  { key: "apps", label: "Programs and games",
    what: "Application rows the twin holds.",
    cls: new Set(["app", "game"]) },
  { key: "shop", label: "Commerce",
    what: "Channels and shop rows.",
    cls: new Set(["commerce"]) },
  { key: "ops", label: "Ops instruments — in the ledger, not visitor-facing",
    what: "The museum's own tools. Almost certainly not what you want a Record to announce.",
    cls: new Set(["tool"]) },
];

/* ═══ RULED OUT, IN WRITING ═══════════════════════════════
   A file Mike has ruled out does not appear here at all. Doctrine 24: once he
   has ruled a thing gone he does not meet it again, and a tracker is one of the
   places a killed thing comes back. The list is SHORT and each row carries his
   reason, the same shape as SIGNAGE in reveal/delivery.mjs — because the
   alternative is a silent filter, and a picture missing from a catalogue with
   no explanation is indistinguishable from a bug.
   The museum copy and its asset-table row are already deleted. This entry
   exists because the SOURCE still lives in the robots repo, which this packet
   was told not to touch, so without it the file would come straight back into
   the catalogue as robots-repo material. */
const RULED_OUT = {
  "MGK-TWIN_MONITOR_SCREEN_BEZEL.png":
    "Mike, 2026-08-13: the Portal CRT's bezel, used in CONSTRUCTING the original " +
    "portal. Not UX as a standalone, and he is making the overlays himself.",
};

/* ═══ SUPERSESSION — A THING IN THE MUSEUM HIDES ITS OWN SOURCE ═══════
   Copying 133 files in gave every one of them TWO rows: the museum copy that
   can be published and the robots original that cannot. Both would have drawn
   a tile, and he would have been choosing between a thing and itself — with
   the useless one sorted first on some groups. So a robots row is dropped when
   the museum already has it, and "already has it" is TWO precise tests rather
   than one loose one:

     1  SAME BYTES. sha256 match against a museum governed row. Covers the 74
        files that were copied unchanged.
     2  THE MANUAL PAGES, BY PAGE NUMBER. These deliberately DO NOT match by
        hash: the museum holds the 240 dpi render and the robots tree still
        holds 300 dpi, which is the whole point of Mike's ruling. Matching them
        by basename alone would be wrong for the build cards, where 001.wav
        exists in three different directories, so this test is narrowed to the
        manual page path and the page number inside it.

   Anything left over is genuinely only in the robots repo and still shows. */
function supersededBy(museumRows) {
  const shas = new Set(museumRows.filter(r => !r.missing).map(r => r.sha256));
  const manualPages = new Set(museumRows
    .map(r => (r.path.match(/^public\/held\/robots\/manual\/page-(\d+)\.png$/) || [])[1])
    .filter(Boolean));
  return e => {
    if (shas.has(e.sha256)) return "the museum already holds these bytes";
    const m = e.path.match(/manual\/structure\/pages\/page-(\d+)\.png$/);
    if (m && manualPages.has(m[1])) return "the museum holds this page at 240 dpi";
    return null;
  };
}

/* ═══ THE PICTURE CATALOGUE ════════════════════════════════════════════════ */
function buildRows() {
  const table = JSON.parse(fs.readFileSync(TABLE, "utf8")).entries;
  const dirty = robotsDirty();
  const signage = new Set(Object.keys(SIGNAGE).map(k => GOVERNED_PREFIX + k));
  const isSuperseded = supersededBy(table.filter(r => r.repo === "museum"
    && /^public\/(held\/)?robots\//.test(r.path)));
  const dropped = { ruled: 0, superseded: 0 };
  const out = [];

  for (const g of GROUPS) {
    for (const e of table.filter(g.test)) {
      const base = e.path.split("/").pop();
      if (Object.prototype.hasOwnProperty.call(RULED_OUT, base)) { dropped.ruled++; continue; }
      if (e.repo === "robots" && isSuperseded(e)) { dropped.superseded++; continue; }
      /* A museum-side governed file has two addresses and the data declares
         only the PUBLIC one (§8's two-addresses hazard); the held prefix is
         stripped so what is printed and what an entry would name match. A
         robots-repo file has no public address yet and inventing one would be
         exactly the drift this generator exists to avoid. */
      const pub = e.repo === "museum"
        ? "/" + e.path.replace(/^public\/held\//, "").replace(/^public\//, "")
        : null;

      let state, why;
      if (pub && signage.has(pub)) {
        state = "SIGNAGE"; why = "signage — no entry can deliver it";
      } else if (e.repo === "museum" && e.missing) {
        state = "NO FILE"; why = "the file is not on the disk";
      } else if (e.repo === "museum") {
        state = "READY"; why = "";
      } else if (dirty.set.has(e.path)) {
        state = "REBUILDING"; why = "being rebuilt right now — uncommitted";
      } else if (e.missing) {
        state = "NO FILE"; why = "the file is not on the disk";
      } else {
        state = "NEEDS A COPY"; why = "must be copied into the museum first";
      }

      out.push({
        type: "art", id: pub || (e.repo + ":" + e.path),
        uid: e.uid, group: g.key, repo: e.repo, path: e.path, pub, state, why,
        kind: e.kind, format: e.format, bytes: e.bytes, w: e.w, h: e.h,
        quality: e.quality, name: e.path.split("/").pop(),
        href: diskHref(e),
      });
    }
  }
  return { rows: out, dirty, dropped };
}

/* ═══ THE STORY-EVENT CATALOGUE ════════════════════════════════════════════ */
function buildEvents() {
  const rows = JSON.parse(fs.readFileSync(LEDGER, "utf8")).rows || [];
  const out = [];


  /* RETIRED is absent by rule (Doctrine 24), so only HELD is walked. */
  for (const r of rows.filter(x => x.state === "HELD")) {
    const exists = r.build === "LIVE" || r.build === "PARTIAL";
    const g = EVENT_GROUPS.find(x => x.cls && x.cls.has(r.cls));
    out.push({
      type: "evt", id: "event:" + r.id, group: g ? g.key : "papers",
      state: exists ? "NEEDS DECLARING" : "NOT BUILT",
      /* [J5] THE WHY IS WHAT IT IS, NOT WHAT OPS WOULD DO ABOUT IT. This read
         "exists and is held - flip state, rebuild, deploy" on all 24, which put
         a three-command Ops procedure on 24 tiles of Mike's surface. The state
         is his business; the procedure is not. It is behind the Ops toggle. */
      why: exists ? "exists, and is being held" : "not built — nothing to reveal",
      label: r.name || r.id,
      detail: "Ledger row " + r.id + " · build " + r.build + " · class " + r.cls
        + (r.where ? " · " + r.where : "")
        + (exists ? " — to reveal: flip state in reveal/ledger-declare.mjs, npm run reveal:build, deploy" : ""),
    });
  }
  return out;
}

/* ═══ WHAT A DAY CAUSES BY ITSELF ═════════════════════════════════
   [J5 2026-08-13] MIKE: fires-by-itself tiles move BELOW what he needs, and
   the firing shows ON THE DAY'S CARD instead. He is right, and the tile was the
   wrong shape for it twice over: it sat FIRST, in the position for the thing he
   most needs, and it asked him to SELECT a fact. A fact is not a choice, and a
   catalogue is a list of choices.
   So it is not in the catalogue at all now. It is printed on the day it
   happens, as something that WILL happen, with nothing to click. */
const STANDING = {
  1: ["The Robots wing opens. The wing is hidden until the Record has an entry, "
    + "so posting 001 opens it. Nothing to arrange, nothing to select."],
};

/* ═══ THE FIVE DAYS ════════════════════════════════════════════════════════
   Numbers, dates and headlines are READ. An entry with no headline prints as
   having none — 004 and 005 have none because Mike wrote none. */
function buildDays() {
  const sums = summaries();
  const live = recordEntries();
  const WD = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const out = [];
  for (let n = 1; n <= DAYS; n++) {
    const date = recordDay(n);
    const s = sums.find(x => x.no === n) || {};
    const e = live.find(x => x.no === n) || {};
    out.push({ no: n, date,
      weekday: WD[new Date(date + "T12:00:00Z").getUTCDay()],
      title: s.title || null, already: (e.assets || []).slice(),
      standing: STANDING[n] || [] });
  }
  return out;
}

/* ═══ CSS ══════════════════════════════════════════════════════════════════
   No backtick may appear anywhere below: this is inside a template literal
   and a backtick would close it. That cost two minutes twice on the first
   pass, so it is written down rather than remembered. */
const CSS = OPS_CSS + `
.as-wrap{display:grid;grid-template-columns:minmax(0,1fr) 340px;gap:22px;align-items:start}
@media (max-width:1100px){.as-wrap{grid-template-columns:1fr}}

.as-top{position:sticky;top:0;z-index:30;background:var(--paper,#17150f)}
.as-bar{border-bottom:1px solid var(--rule,#3a3529);padding:9px 0 6px}
.as-bar button{font-family:inherit;font-size:12px;padding:5px 11px;cursor:pointer;margin:0 2px 3px 0;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}
.as-bar button[aria-pressed=true]{background:var(--gold,#b8974a);border-color:var(--gold,#b8974a);color:#17150f}
.as-bar button.as-right{float:right;opacity:.6;font-size:11px}
.as-bar button.as-right:hover{opacity:1}

/* THE SHELF LINE (C2). One line, above the work, saying the size of the shelf
   before he starts. It is a COUNT, not a briefing — Doctrine 25 bans prose
   above the work and this is the number the work is about. */
.as-shelf{font-size:12.5px;padding:6px 0 8px;border-bottom:1px solid var(--rule,#3a3529);line-height:1.5}
.as-shelf b{color:var(--gold,#b8974a)}
.as-shelf .dim{opacity:.66}

#as-banner{display:none;background:#5c1618;border:1px solid #a33;color:#ffd9d9;
  padding:10px 13px;margin:0 0 6px;font-size:13px;line-height:1.45}
#as-banner.as-on{display:block}

h2.as-grp{font-size:14px;letter-spacing:.06em;text-transform:uppercase;margin:26px 0 3px}
p.as-grpwhat{font-size:12.5px;opacity:.74;margin:0 0 11px;max-width:74ch;line-height:1.5}
.as-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(138px,1fr));gap:11px}
/* A STORY-EVENT TILE IS ALL WORDS AND NO PICTURE, so it wants the opposite of
   what a thumbnail grid wants. At the picture width these came out 149px wide —
   about twenty characters a line for a two-sentence tile. Nothing was CLIPPED
   (measured: 0 of 64 tiles overflowed) so this is legibility, not truncation. */
.as-grid.as-wide{grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}

figure.as-tile{margin:0;border:1px solid var(--rule,#3a3529);border-radius:2px;overflow:hidden;
  background:#0f0e0a;position:relative;cursor:pointer}
figure.as-tile:hover{border-color:var(--gold,#b8974a)}
figure.as-tile.as-on{border-color:var(--gold,#b8974a);box-shadow:inset 0 0 0 2px var(--gold,#b8974a)}

/* THE THUMBNAIL IS CONTAIN, NOT COVER (B2). It was cover on the first pass,
   which crops — and on a 2550x3300 manual page the crop removes the head of
   the page, which is where the type he is looking for is. A letterboxed
   thumbnail wastes pixels; a cropped one HIDES THE THING BEING CHOSEN. */
figure.as-tile img{display:block;width:100%;height:132px;object-fit:contain;background:#07070a}
figure.as-tile .as-nop{display:flex;align-items:center;justify-content:center;height:132px;
  font-size:11px;opacity:.5;text-align:center;padding:6px}
figcaption{padding:6px 7px 7px;font-size:10.5px;line-height:1.35;word-break:break-word}
figcaption .as-nm{display:block;opacity:.92}
figcaption .as-q{display:block;opacity:.55;margin-top:2px}
/* [J5] OPS INFORMATION IS REACHABLE, NOT PRESENT. Everything Ops needs and Mike
   does not is .as-ops and is display:none until he asks for it. One control, one
   class, nothing removed from the page's data — his rule is about what competes
   for a glance, not about hiding facts from him. */
.as-ops{display:none !important}
body.as-showops .as-ops{display:block !important}
/* a warning DOES earn its place: weak or wrong changes what he would do */
figcaption .as-warn{display:block;margin-top:3px;color:#ff9b9b}
/* what the day causes by itself - a fact on the card, with nothing to click */
.as-day .as-fires{font-size:10.5px;line-height:1.45;margin:6px 0 0;padding:5px 7px;
  background:#17240f;border-left:2px solid #6a8a4a;color:#cfe0b8}
/* THE WHY, VISIBLE WITHOUT CLICKING (C3) */
figcaption .as-why{display:block;margin-top:3px;color:#e0b84a;opacity:.95}

.as-st{position:absolute;top:0;left:0;right:0;font-size:9.5px;letter-spacing:.07em;
  padding:3px 5px;text-transform:uppercase;font-weight:700}
.as-st.as-READY{background:#1d4423;color:#c8f0cf}
.as-st.as-FIRES{background:#1d4423;color:#c8f0cf}
.as-st.as-DECLARE{background:#2c4436;color:#cfe8d6}
.as-st.as-NOFILE{background:#5c1618;color:#ffd9d9}
.as-st.as-COPY{background:#4a3a12;color:#f2dfa8}
.as-st.as-REBUILDING{background:#123a4a;color:#c3e8f5}
.as-st.as-NOTBUILT{background:#3a2222;color:#e0b9b9}
.as-st.as-SIGNAGE{background:#2b2b2b;color:#bdbdbd}

/* DIM, NOT GONE (C1). Mike: *"if they vanish he will assign something and
   wonder why it never appeared."* */
figure.as-tile.as-dim{opacity:.42}
figure.as-tile.as-dim:hover{opacity:.85;border-color:#8a7a4a}

.as-asg{position:absolute;bottom:0;right:0;background:var(--gold,#b8974a);color:#17150f;
  font-size:10px;font-weight:700;padding:2px 6px}
/* the magnifier. Its own control, because CLICK MEANS ASSIGN and a page where
   the primary verb also opens a lightbox has two primary verbs. */
.as-zoom{position:absolute;top:20px;right:0;background:rgba(10,10,8,.82);color:#e8e2d2;
  border:0;border-left:1px solid var(--rule,#3a3529);border-bottom:1px solid var(--rule,#3a3529);
  font-family:inherit;font-size:13px;line-height:1;padding:5px 7px;cursor:zoom-in}
.as-zoom:hover{background:var(--gold,#b8974a);color:#17150f}

figure.as-evt{min-height:96px}
figure.as-evt .as-lbl{padding:26px 8px 8px;font-size:11.5px;line-height:1.4}
figure.as-evt .as-det{font-size:10px;opacity:.6;margin-top:5px;line-height:1.4}

.as-rail{position:sticky;top:96px}
.as-day{border:1px solid var(--rule,#3a3529);border-radius:2px;margin:0 0 9px;padding:9px 10px}
.as-day.as-sel{border-color:var(--gold,#b8974a);background:#1d1a12}
.as-day h3{margin:0 0 2px;font-size:12.5px;letter-spacing:.04em}
.as-day .as-dt{font-size:11px;opacity:.66}
.as-day .as-ttl{font-size:11.5px;opacity:.8;margin:3px 0 0;line-height:1.4}
.as-day .as-none{font-size:11px;opacity:.5;font-style:italic}
.as-day ul{list-style:none;margin:7px 0 0;padding:0}
.as-day li{font-size:10.5px;line-height:1.4;padding:3px 0;border-top:1px solid #2a2620;
  display:flex;gap:6px;align-items:baseline}
.as-day li .as-x{cursor:pointer;opacity:.6;flex:0 0 auto}
.as-day li .as-x:hover{opacity:1;color:#e88}
.as-day li span.as-p{word-break:break-word;flex:1 1 auto}
.as-day li .as-w{color:#e0b84a}
.as-pick{font-size:11px;opacity:.7;margin:0 0 9px;line-height:1.45}

#as-out{margin:26px 0 0;border-top:1px solid var(--rule,#3a3529);padding-top:16px}
/* [J5] THE PASTE STARTS CLOSED. 190px of monospace JSON was permanently on the
   page under the catalogue - Ops' half of the transaction, shaped like Ops. He
   needs it ONCE, at the end. The button that opens it is always visible, so
   nothing is hidden; only the 190px of text is. */
#as-outbody{display:none}
#as-out.as-open #as-outbody{display:block}
#as-out textarea{width:100%;min-height:190px;font-family:ui-monospace,Consolas,monospace;
  font-size:11.5px;line-height:1.5;background:#0f0e0a;color:#d8d2c2;
  border:1px solid var(--rule,#3a3529);padding:10px;border-radius:2px}
#as-out .msg{font-size:12px;margin:7px 0 0;min-height:1.4em}
#as-out button{font-family:inherit;font-size:12px;padding:6px 13px;cursor:pointer;margin:9px 9px 0 0;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}

/* ═══ THE VIEWER (B1) — big enough to read 2550x3300 type ═════════════════
   It loads the REAL FILE off disk by relative path, not a bigger data URI, so
   the page stays 300KB and "read the type" means the actual pixels. Two sizes:
   FIT the window, and 100% with the overlay scrolling. */
#as-view{display:none;position:fixed;inset:0;z-index:200;background:rgba(6,6,5,.97)}
#as-view.as-on{display:flex;flex-direction:column}
#as-vbar{flex:0 0 auto;display:flex;gap:9px;align-items:center;flex-wrap:wrap;
  padding:8px 12px;border-bottom:1px solid var(--rule,#3a3529);background:#12110d}
#as-vbar button{font-family:inherit;font-size:12px;padding:5px 11px;cursor:pointer;
  background:transparent;border:1px solid var(--rule,#3a3529);color:inherit;border-radius:2px}
#as-vbar button.go{border-color:var(--gold,#b8974a);color:var(--gold,#b8974a)}
#as-vbar button.go:hover{background:var(--gold,#b8974a);color:#17150f}
#as-vname{font-size:12.5px}
#as-vmeta{font-size:11.5px;opacity:.66}
#as-vwrap{flex:1 1 auto;overflow:auto;display:flex;align-items:flex-start;justify-content:center;padding:12px}
#as-vimg{display:block;background:#fff;max-width:none}
/* IT FITS THE WIDTH, NOT THE WINDOW, AND THAT IS THE WHOLE OF B1. Fitting the
   WINDOW drew a 2550x3300 manual page at 511px wide — 20% — measured, and at
   20% the type is a grey texture. A manual page is TALL: the only axis worth
   spending is the horizontal one, and the vertical is what a scrollbar is for.
   Fit-width draws the same page at ~1500px (59%) and the type reads. It is
   also correct for a landscape photograph, which simply fills the width and
   ends early, so there is one default rather than two. */
#as-vwrap.fit #as-vimg{max-width:100%;height:auto;background:transparent}
#as-vfail{color:#ffd9d9;font-size:13px;padding:20px;max-width:70ch;line-height:1.5}
`;

/* ═══ TILES ════════════════════════════════════════════════════════════════ */
const ST_CLS = {
  "READY": "READY", "FIRES BY ITSELF": "FIRES", "NEEDS DECLARING": "DECLARE",
  "NO FILE": "NOFILE", "NEEDS A COPY": "COPY", "REBUILDING": "REBUILDING",
  "NOT BUILT": "NOTBUILT", "SIGNAGE": "SIGNAGE",
};

function tile(r, th) {
  const dim = USABLE.has(r.state) ? "" : " as-dim";
  const img = th
    ? `<img src="${th}" alt="" loading="lazy">`
    : `<span class="as-nop">no thumbnail<br><small>${esc(r.format || r.kind || "")}</small></span>`;
  /* [J5] OPS' QUALITY READ IS NOT ON THE TILE UNLESS IT IS A WARNING.
     It used to print on all 164: "Ops reads it: usable" on the good ones and
     "nobody has looked" on 133 others. Neither helps him choose — the first is
     Ops agreeing with the obvious and the second is Ops admitting it has no
     opinion, which is Ops talking about Ops. Only `weak` and `wrong` change
     what he would do, so only those two print. The rest is behind the toggle. */
  const warn = (r.quality === "weak" || r.quality === "wrong")
    ? `Ops reads it: ${esc(r.quality)}` : "";
  const q = r.quality ? `Ops reads it: ${esc(r.quality)}` : "nobody has looked";
  /* the magnifier only where there is a picture to look at */
  const zoom = (r.kind === "image")
    ? `<button class="as-zoom" type="button" data-zoom="${esc(r.id)}" title="look at it full size">&#9906;</button>`
    : "";
  return `<figure class="as-tile${dim}" data-id="${esc(r.id)}" data-state="${esc(r.state)}"
   data-kind="art" data-src="${esc(r.href || "")}" data-nm="${esc(r.name)}"
   data-meta="${esc([r.w && r.h ? r.w + "x" + r.h : "", r.format, q].filter(Boolean).join(" · "))}">
  <span class="as-st as-${ST_CLS[r.state]}">${esc(r.state)}</span>${zoom}${img}
  <figcaption><span class="as-nm">${esc(r.name)}</span>${
    warn ? `<span class="as-warn">${warn}</span>` : ""}${
    r.why ? `<span class="as-why">${esc(r.why)}</span>` : ""}<span class="as-q as-ops">${q}</span></figcaption>
</figure>`;
}

function evtTile(r) {
  const dim = USABLE.has(r.state) ? "" : " as-dim";
  return `<figure class="as-tile as-evt${dim}" data-id="${esc(r.id)}" data-state="${esc(r.state)}"
   data-kind="evt" data-nm="${esc(r.label)}">
  <span class="as-st as-${ST_CLS[r.state]}">${esc(r.state)}</span>
  <figcaption class="as-lbl"><span class="as-nm">${esc(r.label)}</span>${
    r.why ? `<span class="as-why">${esc(r.why)}</span>` : ""}
    <span class="as-det as-ops">${esc(r.detail)}</span></figcaption>
</figure>`;
}

/* ═══ BUILD ════════════════════════════════════════════════════════════════ */
const { rows, dirty, dropped } = buildRows();
const events = buildEvents();
const days = buildDays();
const del = delivered();
const { thumbs, hits, made, failed } = await thumbnails(rows, {
  fresh: FRESH, log: m => console.log(m),
});

const byRank = (a, b) => (RANK[a.state] - RANK[b.state]) || a.id.localeCompare(b.id);
const outSet = new Set(Object.keys(del || {}));

const groupHtml = GROUPS.map(g => {
  const rs = rows.filter(r => r.group === g.key).sort(byRank);
  if (!rs.length) return "";
  const ready = rs.filter(r => USABLE.has(r.state)).length;
  const isOut = rs.filter(r => r.pub && outSet.has(r.pub)).length;
  /* [J5] "already out" IS ZERO ON EVERY GROUP and prints only when it stops
     being zero. A column of zeros is a fact about the museum that changes
     nothing he would do today, and it was one of four numbers competing for
     the same glance. The two that matter are how many there are and how many
     he can use. */
  return `<h2 class="as-grp">${esc(g.label)}</h2>
<p class="as-grpwhat">${esc(g.what)}<br>
  <b>${rs.length}</b> here${isOut ? ` &middot; <b>${isOut}</b> already out` : ""} &middot;
  <b>${ready}</b> you can use today.</p>
<div class="as-grid" data-g="${esc(g.key)}">
${rs.map(r => tile(r, thumbs.get(r.uid))).join("\n")}
</div>`;
}).join("\n");

const evtHtml = EVENT_GROUPS.map(g => {
  const rs = events.filter(r => r.group === g.key).sort(byRank);
  if (!rs.length) return "";
  const ready = rs.filter(r => USABLE.has(r.state)).length;
  return `<h2 class="as-grp">${esc(g.label)}</h2>
<p class="as-grpwhat">${esc(g.what)}<br>
  <b>${rs.length}</b> here &middot; <b>${ready}</b> you can use today.</p>
<div class="as-grid as-wide" data-g="evt-${esc(g.key)}">
${rs.map(evtTile).join("\n")}
</div>`;
}).join("\n");

const dayHtml = days.map(d => `<div class="as-day" data-no="${d.no}">
  <h3>RECORD ${String(d.no).padStart(3, "0")}</h3>
  <div class="as-dt">${esc(d.weekday)} ${esc(d.date)}</div>
  ${d.title ? `<p class="as-ttl">${esc(d.title)}</p>`
            : `<p class="as-ttl as-none">no headline written</p>`}
  ${d.standing.map(t => `<p class="as-fires">${esc(t)}</p>`).join("")}
  <ul data-list="${d.no}"></ul>
</div>`).join("\n");

const nReadyArt = rows.filter(r => USABLE.has(r.state)).length;
const nReadyEvt = events.filter(r => USABLE.has(r.state)).length;

const body = `
<div class="as-top">
<div class="as-bar">
  <button data-f="usable" aria-pressed="true">what I can use</button>
  <button data-f="all">everything</button>
  <button data-f="art">pictures</button>
  <button data-f="evt">story events</button>
  <button data-f="mine">assigned</button>
  <button type="button" id="as-opsbtn" class="as-right">Ops detail</button>
</div>
<div class="as-shelf">
  <b>${nReadyArt}</b> pictures ready &middot;
  <b>${nReadyEvt}</b> story events you can use &middot;
  <span class="dim">${rows.length - nReadyArt + events.length - nReadyEvt} more need work first, sorted below and dimmed</span>
  &middot; <span id="as-cnt" class="dim"></span>
</div>
<div id="as-banner"></div>
</div>

<div class="as-wrap">
  <div>
    ${groupHtml}
    ${evtHtml}
    <div id="as-out">
      <button type="button" id="as-open">When you are done — the text to hand to Ops</button>
      <div id="as-outbody">
        <textarea id="as-ta" readonly spellcheck="false"></textarea>
        <div class="msg" id="as-msg"></div>
        <button type="button" id="as-sel">Select it all for Ctrl+C</button>
        <button type="button" id="as-dl">Save it as a file</button>
        <button type="button" id="as-clr">Clear every assignment</button>
      </div>
    </div>
  </div>
  <div class="as-rail">
    <p class="as-pick">Click a day, then click things. Click an assigned thing again, or the &times; in the day, to take it back off. The magnifier on a picture opens it big enough to read.</p>
    ${dayHtml}
  </div>
</div>

<div id="as-view">
  <div id="as-vbar">
    <button type="button" id="as-vx">&times; close</button>
    <button type="button" id="as-vprev">&lsaquo; prev</button>
    <button type="button" id="as-vnext">next &rsaquo;</button>
    <button type="button" id="as-vfit">100%</button>
    <button type="button" id="as-vgo" class="go">assign to Record 001</button>
    <span id="as-vname"></span><span id="as-vmeta"></span>
  </div>
  <div id="as-vwrap" class="fit"><img id="as-vimg" alt=""><div id="as-vfail" hidden></div></div>
</div>

<script>
"use strict";
var KEY = "wb.assign.week1.v1";
var STATE = {};
var SEL = 1;
var VIEW = null;

function banner(t){var b=document.getElementById("as-banner");b.innerHTML=t;b.className=t?"as-on":"";}
var STORAGE_OK = true;
function save(){
  if(!STORAGE_OK) return;
  try{ localStorage.setItem(KEY, JSON.stringify(STATE)); }
  catch(e){
    STORAGE_OK = false;
    banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Your assignments are still on the screen and still in the box at the bottom, but they will be gone if you close this tab. Press <b>Select it all for Ctrl+C</b> and paste it somewhere before you close it.");
  }
}
function load(){
  try{ var raw = localStorage.getItem(KEY); if(raw) STATE = JSON.parse(raw) || {}; }
  catch(e){
    STORAGE_OK = false;
    banner("<b>THIS BROWSER WILL NOT LET THE PAGE REMEMBER ANYTHING.</b> Nothing was lost \\u2014 there was nothing saved to read. Copy the box at the bottom before you close the tab.");
  }
}

function dayOf(id){ for(var k in STATE){ if(STATE[k].indexOf(id) >= 0) return Number(k); } return 0; }
function figFor(id){ return document.querySelector('figure.as-tile[data-id="' + cssq(id) + '"]'); }
function cssq(s){ return String(s).replace(/["\\\\]/g, "\\\\$&"); }

/* THE WHOLE POINT OF THE SECOND PASS: a story event assigns exactly like a
   picture. There is no separate code path, because a day holds THINGS. */
function toggle(fig){
  var st = fig.getAttribute("data-state"), id = fig.getAttribute("data-id");
  var nm = fig.getAttribute("data-nm");
  if(st === "SIGNAGE"){
    banner("<b>" + nm + " is signage.</b> It is the museum's own wordmark on its own sleeve \\u2014 nothing arrived and nothing was opened, so no Record entry can deliver it. It is in the catalogue so the count is honest, not so it can be assigned.");
    return;
  }
  var was = dayOf(id);
  if(was){ STATE[was] = STATE[was].filter(function(x){ return x !== id; }); }
  if(was !== SEL){
    STATE[SEL] = STATE[SEL] || [];
    STATE[SEL].push(id);
    if(st === "NO FILE"){
      banner("<b>Assigned, and the file is not on the disk.</b> " + nm + " has a row in the asset table but no file behind it. Record " + SEL + " would promise a picture the museum does not have. Somebody has to find it before that day.");
    } else if(st === "REBUILDING"){
      banner("<b>Assigned, and this file is being rebuilt right now.</b> Its bytes are uncommitted in the robots repo, so what you are looking at is not necessarily what will ship.");
    } else if(st === "NEEDS A COPY"){
      banner("<b>Assigned, and it needs one step first.</b> It lives in the robots repo only. Somebody must copy it into the museum and declare it before Record " + SEL + " can publish it.");
    } else if(st === "NEEDS DECLARING"){
      banner("<b>Assigned. This one is a DECLARATION, not a delivery.</b> " + nm + " exists and is being held. Nothing happens by writing the entry: somebody flips its state in reveal/ledger-declare.mjs, runs npm run reveal:build, and deploys. Three steps, none of them automatic.");
    } else if(st === "NOT BUILT"){
      banner("<b>Assigned, and this does not exist yet.</b> " + nm + " is NOT_BUILT in the ledger \\u2014 there is nothing to reveal, so announcing it would promise a thing the museum does not have.");
    } else if(st === "FIRES BY ITSELF"){
      banner("<b>Noted \\u2014 and this one needs nothing from anybody.</b> The wing opens because the Record has a visible entry (ROBOTS_OPEN, src/lib/wing-open.js). It is already true and it will happen on day one whether or not it is written down here.");
    } else { banner(""); }
  } else { banner(""); }
  save(); paint();
}

function paint(){
  var n = 0;
  document.querySelectorAll("figure.as-tile").forEach(function(f){
    var d = dayOf(f.getAttribute("data-id"));
    f.classList.toggle("as-on", !!d);
    var tag = f.querySelector(".as-asg");
    if(d){
      if(!tag){ tag = document.createElement("span"); tag.className = "as-asg"; f.appendChild(tag); }
      tag.textContent = "DAY " + d;
    } else if(tag){ tag.remove(); }
    if(d) n++;
  });

  document.querySelectorAll(".as-day").forEach(function(el){
    var no = Number(el.getAttribute("data-no"));
    el.classList.toggle("as-sel", no === SEL);
    var ul = el.querySelector("ul"); ul.innerHTML = "";
    (STATE[no] || []).forEach(function(id){
      var fig = figFor(id);
      var st = fig ? fig.getAttribute("data-state") : "";
      var nm = fig ? fig.getAttribute("data-nm") : id;
      var li = document.createElement("li");
      var warn = (st && st !== "READY" && st !== "FIRES BY ITSELF") ? '<span class="as-w">' + st + '</span> ' : "";
      li.innerHTML = '<span class="as-x" data-off="' + id.replace(/"/g,"&quot;") + '">&times;</span>'
        + '<span class="as-p">' + warn + nm + "</span>";
      ul.appendChild(li);
    });
    if(!(STATE[no] || []).length){
      var li0 = document.createElement("li");
      li0.innerHTML = '<span class="as-p as-none">nothing assigned</span>';
      ul.appendChild(li0);
    }
  });

  document.getElementById("as-cnt").textContent = n + " assigned";
  var go = document.getElementById("as-vgo");
  if(go) go.textContent = "assign to Record 00" + SEL;
  writeOut();
}

/* THE PASTE carries the WARNINGS, because a decision travelling without the
   fact that would change it is not a decision. Story events are listed apart
   from the assets array: an event is NOT an asset and putting one in that
   array would hand Ops a delivery list with a non-path in it. */
function writeOut(){
  var L = [];
  L.push("WEEK ONE \\u2014 ASSIGNED BY DAY");
  L.push("written " + new Date().toISOString().slice(0,16).replace("T"," "));
  L.push("");
  var need = [];
  DAYS.forEach(function(d){
    var got = STATE[d.no] || [];
    L.push("RECORD " + ("00" + d.no).slice(-3) + "  " + d.weekday + " " + d.date
           + (d.title ? "  \\u2014 " + d.title.split("\\n")[0] : ""));
    if(!got.length){ L.push("    (nothing assigned)"); }
    got.forEach(function(id){
      var fig = figFor(id), st = fig ? fig.getAttribute("data-state") : "?";
      var isEvt = id.indexOf("event:") === 0;
      var nm = fig ? fig.getAttribute("data-nm") : id;
      L.push("    " + (isEvt ? "[STORY] " + nm + "  (" + id + ")" : id)
             + ((st === "READY" || st === "FIRES BY ITSELF") ? "" : "     << " + st));
      if(st !== "READY" && st !== "FIRES BY ITSELF")
        need.push(("00"+d.no).slice(-3) + "  " + st + "  " + (isEvt ? nm : id));
    });
    L.push("");
  });
  if(need.length){
    L.push("NOT READY \\u2014 every one of these needs work before its day:");
    need.forEach(function(x){ L.push("    " + x); });
    L.push("");
  }
  L.push("--- for Ops: the assets arrays, keyed by record number ---");
  L.push("(pictures only. story events are listed above and are NOT assets.)");
  var o = {};
  DAYS.forEach(function(d){
    o[d.no] = (STATE[d.no] || []).filter(function(x){ return x.indexOf("event:") !== 0; });
  });
  L.push(JSON.stringify(o, null, 1));
  var ev = {};
  DAYS.forEach(function(d){
    var e = (STATE[d.no] || []).filter(function(x){ return x.indexOf("event:") === 0; });
    if(e.length) ev[d.no] = e;
  });
  if(Object.keys(ev).length){
    L.push("");
    L.push("--- story events, by record number ---");
    L.push(JSON.stringify(ev, null, 1));
  }
  document.getElementById("as-ta").value = L.join("\\n");
}

/* ═══ THE VIEWER ═════════════════════════════════════════════════════════ */
function shownTiles(){
  return [].filter.call(document.querySelectorAll('figure.as-tile[data-kind="art"]'),
    function(f){ return f.style.display !== "none" && f.getAttribute("data-src"); });
}
function openView(id){
  var list = shownTiles(), i = -1;
  for(var k=0;k<list.length;k++) if(list[k].getAttribute("data-id") === id) i = k;
  if(i < 0){ var f = figFor(id); if(!f) return; list = [f]; i = 0; }
  VIEW = { list: list, i: i };
  drawView();
  document.getElementById("as-view").className = "as-on";
}
function drawView(){
  var f = VIEW.list[VIEW.i];
  var img = document.getElementById("as-vimg"), fail = document.getElementById("as-vfail");
  document.getElementById("as-vname").textContent = f.getAttribute("data-nm");
  document.getElementById("as-vmeta").textContent =
    (f.getAttribute("data-meta") || "") + " · " + f.getAttribute("data-state")
    + " · " + (VIEW.i+1) + " of " + VIEW.list.length;
  fail.hidden = true; img.hidden = false;
  /* IT SAYS SO WHEN IT CANNOT LOAD. A viewer that silently shows a 240px
     re-encode while claiming to show the original is the quiet kind of wrong. */
  img.onerror = function(){
    img.hidden = true; fail.hidden = false;
    fail.textContent = "This file could not be loaded from " + f.getAttribute("data-src")
      + " — which is what a row marked NO FILE means. There is nothing to look at.";
  };
  img.src = f.getAttribute("data-src");
}
function closeView(){ document.getElementById("as-view").className = ""; VIEW = null; }
function step(d){ if(!VIEW) return; VIEW.i = (VIEW.i + d + VIEW.list.length) % VIEW.list.length; drawView(); }

/* ═══ FILTERS ════════════════════════════════════════════════════════════ */
function filter(f){
  document.querySelectorAll(".as-bar button[data-f]").forEach(function(b){
    b.setAttribute("aria-pressed", b.getAttribute("data-f") === f ? "true" : "false");
  });
  var USE = { "READY":1, "FIRES BY ITSELF":1, "NEEDS DECLARING":1 };
  document.querySelectorAll("figure.as-tile").forEach(function(fig){
    var st = fig.getAttribute("data-state"), kd = fig.getAttribute("data-kind");
    var show = f === "all" ? true
             : f === "usable" ? !!USE[st]
             : f === "art" ? kd === "art"
             : f === "evt" ? kd === "evt"
             : f === "mine" ? !!dayOf(fig.getAttribute("data-id"))
             : st === f;
    fig.style.display = show ? "" : "none";
  });
  document.querySelectorAll(".as-grid").forEach(function(g){
    var any = [].some.call(g.querySelectorAll("figure.as-tile"),
      function(x){ return x.style.display !== "none"; });
    g.style.display = any ? "" : "none";
    var p = g.previousElementSibling, h = p && p.previousElementSibling;
    if(p) p.style.display = any ? "" : "none";
    if(h && h.tagName === "H2") h.style.display = any ? "" : "none";
  });
}

/* WIRING. Not behind requestAnimationFrame — rAF does not fire in a tab that
   is not being painted, and a page that draws but wires nothing is a defect
   with no error anywhere. */
load();
paint();
filter("usable");

document.addEventListener("click", function(ev){
  var t = ev.target;
  var z = t.closest && t.closest("[data-zoom]");
  if(z){ ev.stopPropagation(); openView(z.getAttribute("data-zoom")); return; }
  var off = t.closest && t.closest("[data-off]");
  if(off){
    var id = off.getAttribute("data-off");
    for(var k in STATE){ STATE[k] = STATE[k].filter(function(x){ return x !== id; }); }
    banner(""); save(); paint(); return;
  }
  if(t.closest && t.closest("#as-view")) return;
  var fig = t.closest && t.closest("figure.as-tile");
  if(fig){ toggle(fig); return; }
  var day = t.closest && t.closest(".as-day");
  if(day){ SEL = Number(day.getAttribute("data-no")); banner(""); paint(); return; }
  var fb = t.closest && t.closest(".as-bar button[data-f]");
  if(fb){ filter(fb.getAttribute("data-f")); return; }
});

document.getElementById("as-vx").addEventListener("click", closeView);
document.getElementById("as-vprev").addEventListener("click", function(){ step(-1); });
document.getElementById("as-vnext").addEventListener("click", function(){ step(1); });
document.getElementById("as-vfit").addEventListener("click", function(){
  var w = document.getElementById("as-vwrap");
  var fit = w.classList.toggle("fit");
  this.textContent = fit ? "100%" : "fit the width";
});
/* HE DECIDES WHILE READING, SO THE ASSIGN CONTROL IS IN THE VIEWER TOO. */
document.getElementById("as-vgo").addEventListener("click", function(){
  if(!VIEW) return;
  toggle(VIEW.list[VIEW.i]);
  drawView();
});
document.addEventListener("keydown", function(e){
  if(!VIEW) return;
  if(e.key === "Escape") closeView();
  else if(e.key === "ArrowLeft") step(-1);
  else if(e.key === "ArrowRight") step(1);
});

document.getElementById("as-opsbtn").addEventListener("click", function(){
  var on = document.body.classList.toggle("as-showops");
  this.setAttribute("aria-pressed", on ? "true" : "false");
});
document.getElementById("as-open").addEventListener("click", function(){
  var box = document.getElementById("as-out");
  var on = box.classList.toggle("as-open");
  this.textContent = on ? "hide the text" : "When you are done — the text to hand to Ops";
  if(on) box.scrollIntoView({block:"nearest"});
});
document.getElementById("as-sel").addEventListener("click", function(){
  var ta = document.getElementById("as-ta");
  ta.focus(); ta.select();
  document.getElementById("as-msg").textContent =
    "Selected — press Ctrl+C now. " + ta.value.length + " characters.";
});
document.getElementById("as-dl").addEventListener("click", function(){
  var ta = document.getElementById("as-ta");
  var b = new Blob([ta.value], { type: "text/plain" });
  var a = document.createElement("a");
  a.href = URL.createObjectURL(b);
  a.download = "week-one-assignments.txt";
  document.body.appendChild(a); a.click(); a.remove();
  document.getElementById("as-msg").textContent =
    "Saved as week-one-assignments.txt — look in your Downloads folder.";
});
document.getElementById("as-clr").addEventListener("click", function(){
  STATE = {}; banner(""); save(); paint();
  document.getElementById("as-msg").textContent = "Every assignment cleared.";
});
</script>
`;

const inject = `<script>var DAYS = ${JSON.stringify(days.map(d =>
  ({ no: d.no, date: d.date, weekday: d.weekday, title: d.title })))};</script>`;

fs.writeFileSync(OUT, page({
  title: "Week one — the artifacts",
  css: CSS, body: inject + body, favi: "🗓",
}));

const st = c => rows.filter(r => r.state === c).length;
const est = c => events.filter(r => r.state === c).length;
console.log(`\nwrote ${path.relative(REPO, OUT)}`);
console.log(`  PICTURES ${rows.length}: READY ${st("READY")} · NEEDS A COPY ${st("NEEDS A COPY")}`
  + ` · REBUILDING ${st("REBUILDING")} · NO FILE ${st("NO FILE")} · SIGNAGE ${st("SIGNAGE")}`);
console.log(`  STORY EVENTS ${events.length}: FIRES BY ITSELF ${est("FIRES BY ITSELF")}`
  + ` · NEEDS DECLARING ${est("NEEDS DECLARING")} · NOT BUILT ${est("NOT BUILT")}`);
console.log(`  THE SHELF: ${nReadyArt} pictures + ${nReadyEvt} story events usable today`);
console.log(`  not offered: ${dropped.ruled} ruled out by Mike, ${dropped.superseded} superseded by a museum copy`);
console.log(`  thumbnails: ${hits} cached, ${made} made, ${failed} could not be read`);
console.log(`  delivered by the Record today: ${Object.keys(del || {}).length}`);
if (!dirty.ok) console.log(`  NOTE: could not read the robots working tree (${dirty.why}) — nothing marked REBUILDING`);
console.log(`\nopen it by double-clicking:  docs\\dictation-20260807\\assign.html`);
