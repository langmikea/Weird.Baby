/* ═══ [H1 2026-08-06] THE HELD WING'S DOOR ═══════════════════════════════════
   MIKE'S RULING: `/hr` is not public. It stays online and reachable by him and
   by Ops, behind A PASSWORD entered on the ADMIN PAGE.

   THE RULE IS ENFORCED HERE AND NOT IN THE BROWSER, AND THAT IS THE WHOLE
   POINT — it is R5's lesson applied to a second object. R5 filtered Hunter
   Root's vault audio at runtime and the build still shipped 153 of his mp3
   URLs in plain text: a filter that stops the RENDER still publishes the
   MATERIAL. A password checked in React would do exactly that with the whole
   wing — the catalogue, the deck, the artifacts, all of it sitting in a public
   JavaScript bundle behind a boolean anyone can flip in a console.

   So the wing is a DYNAMIC CHUNK (App.jsx lazy-loads it, vite.config.js parks
   its chunks under /assets/held/) and this worker refuses to serve that
   directory without the cookie. A visitor who forges the browser-side flag
   gets a chunk that 404s; App.jsx's boundary then renders the Lobby, which is
   what every unmatched address in this museum renders.

   THREE THINGS A FUTURE SESSION MUST HOLD.

   (1) IT FAILS CLOSED AND IT FAILS LOUDLY. `env.HR_KEY` is a wrangler secret
       and there is no default. With the secret unset NOBODY can open the wing,
       including Mike, and /api/held says so in as many words rather than
       returning a bare 401 that reads as a wrong password. Set it once per
       environment: `npx wrangler secret put HR_KEY`.

   (2) THE COOKIE IS NOT THE PASSWORD. It is sha256("wb-held-v1:" + key), so
       the secret itself never travels back to the browser and never sits in
       a cookie jar. HttpOnly, so no script on any page can read it; Secure and
       SameSite=Lax, so it does not ride a cross-site request.

   (3) `run_worker_first` IN wrangler.jsonc IS LOAD-BEARING. Workers Assets
       serves a matching static file BEFORE invoking this worker. Without
       `"/assets/held/*"` in that list the gate is never asked and the chunk is
       public. If that line goes, this file stops working silently.

   ═══ [H1 2026-08-06, THE PORTAL HOLD] A CODE DOOR IS ONLY HALF A DOOR ════════
   Holding the Portal needed something the Hunter Root wing did not: a code
   directory catches BUILT chunks, and the Portal's material is not all built —
   the twin is a 620 KB hand-written HTML file and the album's cover and poster
   are PNGs, all of them served straight off the asset store at addresses a
   visitor can type. A code-only door leaves the pictures on the street. So each
   door is a PAIR: a directory under `assets/` for chunks and one in the public
   tree for files.

   ═══ [V1 2026-08-06] AND THE PAIRS ARE NAMED FOR THEIR REASONS, NOT FOR THEIR
   MECHANISM — WHICH IS THE WHOLE OF WHY THE STAGE SWITCH IS SAFE ═════════════
   Mike reversed the pull-back for development: *"show everything that is
   placed, until asked to filter."* The moment a switch exists that opens a
   door, it matters enormously WHICH door, because this file was guarding two
   completely different things behind one name:

     LOCKED_DIRS   THE PERMISSION HOLD. `/hr`. The museum does not have Hunter
                   Root's permission (R5), and a permission hold does not expire
                   when a museum opens — it expires when the permission arrives.
                   **Refused without the cookie in EVERY stage.** No flag, no
                   env var and no build reaches it.
     STAGE_DIRS    THE STAGE HOLD. The Portal and the machines' own photographs,
                   held until launch (H1/H2). Open in DEVELOPMENT; refused
                   without the cookie at LAUNCH.

   Had these stayed one list, the one word that lets Mike see his own building
   would also have republished ninety-three of Hunter Root's tracks and a
   hundred and seven vault image URLs. All four prefixes must be in
   `run_worker_first` or the worker is never asked; `reveal:check`'s
   reachability pass reads THIS FILE and that one and faults if either loses an
   entry, which is the only reason the arrangement cannot rot silently.

   `__WB_STAGE__` IS INJECTED BY vite (`define` in vite.config.js), so it is a
   literal in the built worker rather than a runtime lookup — there is no
   environment variable on the deployed Worker that can move it, and the only
   way to change stage is to build again. */
import { todayInRecordTz, assetWithheld, RECORD_TZ } from "../reveal/record-clock.mjs";

const HELD_COOKIE = "wb_held";
export const LOCKED_DIRS = ["/assets/locked/", "/locked/"];
export const STAGE_DIRS = ["/assets/held/", "/held/"];
const HELD_MAX_AGE = 60 * 60 * 24 * 30;
/* ONE PASSAGE, ONE DECLARATION (Doctrine 17), applied to this round's own new
   code. The admin page carried an identical copy of this sentence for its
   not-configured state; the copy is deleted and the page prints what the
   worker sends, because the worker is the only thing that knows. */
const NO_KEY_NOTE = "No key is set on this deployment. Run: npx wrangler secret put HR_KEY";

/* ═══ [CH5 2026-08-12] THE RECORD'S CLOCK — A THIRD DOOR, FOR A THIRD REASON ══
   MIKE: Record n goes out on Day n; the site reads the clock at REQUEST time and
   serves the Records up to today; a short admin code shows him everything.

   IT IS A THIRD DOOR AND IT MUST STAY ONE. `/assets/locked/` is PERMISSION and
   `/assets/held/` is STAGE, and §8 is explicit that a new reason gets a new door
   rather than a seat at an existing one. "Let Mike preview unpublished Record
   days" is neither of those reasons: folding it into `wb_held` would mean the
   one code that shows him next Friday's entry also unlocks Hunter Root's wing,
   which is the exact silent widening the two-door arrangement exists to stop.
   So: its own secret (`RECORD_KEY`), its own cookie (`wb_record`), its own note.

   THE SECRET IS NOT GUESSABLE AND IS NOT ON THE GLASS. It is a wrangler secret
   with no default — the same fail-closed shape as `HR_KEY` — so an unconfigured
   deployment previews nothing rather than everything, and nothing in `src/`
   renders it, names it, or hints that the door is there. */
const RECORD_COOKIE = "wb_record";
const NO_RECORD_KEY_NOTE =
  "No record key is set on this deployment. Run: npx wrangler secret put RECORD_KEY";

async function sha256Hex(s) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

const heldToken = (key) => sha256Hex("wb-held-v1:" + key);

function readCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  for (const part of raw.split(";")) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === name) return part.slice(eq + 1).trim();
  }
  return null;
}

async function heldOpen(request, env) {
  if (!env.HR_KEY) return false;
  const got = readCookie(request, HELD_COOKIE);
  if (!got) return false;
  /* compared as digests, both fixed-length hex, so the comparison leaks
     nothing about the secret's length or prefix. */
  return got === await heldToken(env.HR_KEY);
}

const recordToken = (key) => sha256Hex("wb-record-v1:" + key);

/** true when this request carries Mike's Record-preview code */
async function previewOpen(request, env) {
  if (!env.RECORD_KEY) return false;
  const got = readCookie(request, RECORD_COOKIE);
  if (!got) return false;
  return got === await recordToken(env.RECORD_KEY);
}

/* ── THE INJECTION ──────────────────────────────────────────────────────────
   The page needs the SERVER's date before its first line runs, or the Record
   would draw with the browser's clock and then correct itself — a flash of the
   future is still showing the future.
   SO IT IS A `<script>` IN THE HEAD, WRITTEN BY HTMLRewriter, and not an API the
   page fetches: a fetch is a round trip, a loading state, and a window in which
   the wrong thing is on the glass. The bundle is unchanged by this — it reads
   two globals that the document happens to define.
   IT ONLY EVER TOUCHES HTML. Assets stream through untouched. */
/* ── [CH6 2026-08-12] THE SHARE CARDS MAY NOT PROMISE A HIDDEN WING ─────────
   Two of the three descriptions in `index.html` name the MGK robots, and until
   Record 001 announces the wing that sentence is false to anybody who shares
   the link. `twitter:description` already says the true thing in both states
   and is REUSED verbatim rather than a third sentence being written — the
   museum has one honest description of itself and does not need two.
   IT IS A HOLD, NOT AN EDIT: `index.html` still ships Mike's wording, and the
   day the wing arrives the worker stops touching it. */
const CARD_WHILE_SHUT =
  "A museum of weird things worth keeping. No ads, no affiliate links, "
  + "no cut of anything you buy from an artist.";

function injectClock(response, today, previewing, wingOpen) {
  const type = response.headers.get("Content-Type") || "";
  if (!type.includes("text/html")) return response;
  const payload =
    `window.__WB_TODAY__=${JSON.stringify(today)};` +
    `window.__WB_RECORD_ALL__=${previewing ? "true" : "false"};`;
  let r = new HTMLRewriter()
    .on("head", {
      element(el) { el.prepend(`<script>${payload}</script>`, { html: true }); },
    });
  if (!wingOpen) {
    r = r
      .on('meta[name="description"]', {
        element(el) { el.setAttribute("content", CARD_WHILE_SHUT); },
      })
      .on('meta[property="og:description"]', {
        element(el) { el.setAttribute("content", CARD_WHILE_SHUT); },
      });
  }
  return r.transform(response);
}

/** has Record 001 announced the wing? — the worker's half of wing-open.js */
function wingOpenOn(today) {
  if (__WB_STAGE__ !== "launch") return true;
  return !!__WB_RECORD_FIRST_DAY__ && today >= __WB_RECORD_FIRST_DAY__;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* [CH5] the museum's own day, computed once per request. Everything below
       that reasons about the Record reads this and never `new Date()` again. */
    const recordToday = todayInRecordTz();

    // CORS headers
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    /* THE SHUT DIRECTORIES. Answered before anything else so that no later
       branch can accidentally fall through to ASSETS with a wing in it.
       A refusal is a plain 404, not a 403: a 403 confirms there is something
       there to be forbidden.
       [V1] THE PERMISSION DOOR IS TESTED FIRST AND ITS BRANCH DOES NOT MENTION
       THE STAGE. Written in this order on purpose: a future edit that widens
       the stage condition cannot widen it onto `/hr`, because control never
       reaches the stage branch with a locked path in hand. */
    if (LOCKED_DIRS.some(d => url.pathname.startsWith(d))) {
      if (!await heldOpen(request, env)) {
        return new Response("Not found", { status: 404 });
      }
      return env.ASSETS.fetch(request);
    }
    if (STAGE_DIRS.some(d => url.pathname.startsWith(d))) {
      if (__WB_STAGE__ === "launch" && !await heldOpen(request, env)) {
        return new Response("Not found", { status: 404 });
      }
      return env.ASSETS.fetch(request);
    }

    /* ═══ [CH5 2026-08-12 · A3] A FUTURE RECORD'S FILES ARE REFUSED TOO ══════
       An entry that names a photograph publishes it on the entry's own day —
       but the FILE ships with the deploy, days early, and was fetchable by
       anyone who guessed the path. Same clock, same rule.
       IT SITS AFTER THE TWO DOORS ON PURPOSE. A path that is both governed and
       behind a shut directory has already been answered above; this branch only
       ever sees paths a visitor is otherwise allowed to have.
       THE SCHEDULE IS BAKED AT BUILD TIME (`__WB_RECORD_ASSETS__`, vite.config)
       from the Record's own `assets` arrays. It is EMPTY today — Record 013 was
       the only entry that ever named a picture and it was deleted — so this
       branch is built and unexercised, which is stated rather than discovered. */
    if (assetWithheld(__WB_RECORD_ASSETS__, url.pathname, recordToday)
        && !await previewOpen(request, env)) {
      return new Response("Not found", { status: 404 });
    }

    /* POST /api/held {key} — the admin page's door. */
    if (url.pathname === "/api/held" && request.method === "POST") {
      const json = (body, status, extra) => new Response(JSON.stringify(body), {
        status, headers: { ...cors, "Content-Type": "application/json", ...(extra || {}) },
      });
      if (!env.HR_KEY) return json({ error: NO_KEY_NOTE }, 503);
      let supplied = "";
      try { supplied = String((await request.json())?.key || ""); }
      catch { return json({ error: "Bad request" }, 400); }
      if (!supplied || await sha256Hex(supplied) !== await sha256Hex(env.HR_KEY)) {
        return json({ error: "Wrong key" }, 401);
      }
      const cookie = `${HELD_COOKIE}=${await heldToken(env.HR_KEY)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${HELD_MAX_AGE}`;
      return json({ ok: true }, 200, { "Set-Cookie": cookie });
    }

    /* GET /api/held — does this browser already hold the door open? Lets the
       admin page show the wing's buttons live rather than asking again every
       visit. It reports a boolean and never the key. */
    if (url.pathname === "/api/held" && request.method === "GET") {
      return new Response(JSON.stringify({
        open: await heldOpen(request, env),
        configured: !!env.HR_KEY,
        note: env.HR_KEY ? null : NO_KEY_NOTE,
        /* [V1 2026-08-06] THE STAGE IS REPORTED BY THE THING THAT ENFORCES IT.
           Mike asked for the two states to be UNAMBIGUOUS, and the honest place
           to answer that is the server: a page can only say what it was
           compiled believing, while this branch is the same literal the refusal
           above reads. `/admin` prints it. Nothing on a public surface does —
           what stage a museum is at is a fact about the work (Doctrine 11). */
        stage: __WB_STAGE__,
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    // POST /api/visits — log a page visit
    if (url.pathname === "/api/visits" && request.method === "POST") {
      try {
        const { page, referrer } = await request.json();
        await env.weird_baby_db.prepare(
          "INSERT INTO visits (page, referrer, visited_at) VALUES (?, ?, datetime('now'))"
        ).bind(page || "/", referrer || "").run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // GET /api/guestbook — fetch all entries
    if (url.pathname === "/api/guestbook" && request.method === "GET") {
      try {
        const { results } = await env.weird_baby_db.prepare(
          "SELECT * FROM guestbook ORDER BY signed_at DESC LIMIT 100"
        ).all();
        return new Response(JSON.stringify(results), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // POST /api/guestbook — sign the guest book
    if (url.pathname === "/api/guestbook" && request.method === "POST") {
      try {
        const { name, note } = await request.json();
        if (!name || !name.trim()) {
          return new Response(JSON.stringify({ error: "Name required" }), { status: 400, headers: cors });
        }
        await env.weird_baby_db.prepare(
          "INSERT INTO guestbook (name, note, badge, signed_at) VALUES (?, ?, 'Founding Visitor', datetime('now'))"
        /* [L1 2026-08-06] THE BUDGETS ARE ENFORCED HERE TOO, and this is the
           half that actually holds: `maxLength` in WbHome.jsx is an instruction
           to a text box and anybody can POST past it. The two numbers are the
           same numbers and their derivation is written down once, at
           `NOTE_MAX` / `NAME_MAX` in src/routes/WbHome.jsx — they are the
           narrowest display's own capacity, and a row longer than that is a row
           the lobby cannot draw without clipping. Truncating here rather than
           refusing keeps a signature rather than losing one. */
        ).bind(name.trim().slice(0, 32), (note || "").trim().slice(0, 88)).run();
        return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // GET /api/admin — admin dashboard data
    if (url.pathname === "/api/admin" && request.method === "GET") {
      try {
        const [entries, visitCount, recentVisits, pageBreakdown] = await Promise.all([
          env.weird_baby_db.prepare("SELECT * FROM guestbook ORDER BY signed_at DESC").all(),
          env.weird_baby_db.prepare("SELECT COUNT(*) as count FROM visits").first(),
          env.weird_baby_db.prepare("SELECT * FROM visits ORDER BY visited_at DESC LIMIT 20").all(),
          env.weird_baby_db.prepare("SELECT page, COUNT(*) as count FROM visits GROUP BY page ORDER BY count DESC").all(),
        ]);
        return new Response(JSON.stringify({
          guestbook: entries.results,
          totalVisits: visitCount.count,
          recentVisits: recentVisits.results,
          pageBreakdown: pageBreakdown.results,
        }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // ── Preset sharing (UX_PRESETS_SPEC §0: weird.baby/p/<shortid>) ─────────
    // POST /api/presets {payload:<snapshot>} → {id}. Payload stored opaque,
    // size-capped, shape-checked just enough to refuse junk.
    if (url.pathname === "/api/presets" && request.method === "POST") {
      try {
        const body = await request.text();
        if (body.length > 8192) {
          return new Response(JSON.stringify({ error: "too large" }), { status: 413, headers: cors });
        }
        const snap = JSON.parse(body)?.payload;
        if (!snap || typeof snap !== "object" || typeof snap.selected !== "object") {
          return new Response(JSON.stringify({ error: "bad payload" }), { status: 400, headers: cors });
        }
        // Cryptic-but-stable short id (§0): 8 crypto-random base36 chars.
        const bytes = new Uint8Array(8);
        crypto.getRandomValues(bytes);
        const id = [...bytes].map(b => (b % 36).toString(36)).join("");
        await env.weird_baby_db.prepare(
          "INSERT INTO presets (short_id, payload, created_at) VALUES (?, ?, datetime('now'))"
        ).bind(id, JSON.stringify(snap)).run();
        return new Response(JSON.stringify({ ok: true, id }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    // GET /api/presets/<id> — resolve a shared preset to its snapshot
    if (url.pathname.startsWith("/api/presets/") && request.method === "GET") {
      try {
        const id = url.pathname.slice("/api/presets/".length);
        if (!/^[a-z0-9]{4,16}$/.test(id)) {
          return new Response(JSON.stringify({ error: "bad id" }), { status: 400, headers: cors });
        }
        const row = await env.weird_baby_db.prepare(
          "SELECT payload FROM presets WHERE short_id = ?"
        ).bind(id).first();
        if (!row) {
          return new Response(JSON.stringify({ error: "not found" }), { status: 404, headers: cors });
        }
        return new Response(JSON.stringify({ ok: true, payload: JSON.parse(row.payload) }), { headers: { ...cors, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: cors });
      }
    }

    /* ═══ [CH5 · A4] THE RECORD PREVIEW DOOR ════════════════════════════════
       POST /api/record {key}  — hand in the code, get the cookie.
       GET  /api/record        — what day is it, and am I previewing?
       The GET is the diagnostic `/api/held` already set the pattern for: the
       one thing that knows is the worker, so the worker is what says it. It
       reveals the DATE and whether this browser is previewing — never the key,
       and never the list of what is still withheld. */
    if (url.pathname === "/api/record" && request.method === "POST") {
      const json = (body, status, extra) => new Response(JSON.stringify(body), {
        status, headers: { ...cors, "Content-Type": "application/json", ...(extra || {}) },
      });
      if (!env.RECORD_KEY) return json({ error: NO_RECORD_KEY_NOTE }, 503);
      let supplied = null;
      try { supplied = (await request.json()).key; } catch { /* falls through */ }
      if (!supplied || await sha256Hex(supplied) !== await sha256Hex(env.RECORD_KEY)) {
        return json({ error: "No." }, 403);
      }
      const cookie = `${RECORD_COOKIE}=${await recordToken(env.RECORD_KEY)}`
        + `; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${HELD_MAX_AGE}`;
      return json({ ok: true, today: recordToday }, 200, { "Set-Cookie": cookie });
    }
    if (url.pathname === "/api/record" && request.method === "GET") {
      return new Response(JSON.stringify({
        today: recordToday,
        tz: RECORD_TZ,
        previewing: await previewOpen(request, env),
        configured: !!env.RECORD_KEY,
        note: env.RECORD_KEY ? null : NO_RECORD_KEY_NOTE,
      }), { headers: { ...cors, "Content-Type": "application/json" } });
    }

    if (url.pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }
    /* [CH5] every HTML response leaves with the museum's day written into it */
    return injectClock(
      await env.ASSETS.fetch(request), recordToday,
      await previewOpen(request, env), wingOpenOn(recordToday));
  }
};
