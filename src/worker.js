/* ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. */
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
import { todayInRecordTz, recordVisibleAt, assetWithheld, RECORD_TZ } from "../reveal/record-clock.mjs";

const HELD_COOKIE = "wb_held";
export const LOCKED_DIRS = ["/assets/locked/", "/locked/"];
export const STAGE_DIRS = ["/assets/held/", "/held/"];
const HELD_MAX_AGE = 60 * 60 * 24 * 30;
/* ONE PASSAGE, ONE DECLARATION (Doctrine 17), applied to this round's own new
   code. The admin page carried an identical copy of this sentence for its
   not-configured state; the copy is deleted and the page prints what the
   worker sends, because the worker is the only thing that knows. */
const NO_KEY_NOTE = "No key is set on this deployment. Run: npx wrangler secret put HR_KEY";

/* ═══ [2026-08-20] THE DOOR REPORTS PRESENCE, NOT JUST PERMISSION ═══════════
   MIKE: **"A door reporting 'open' with nothing behind it is why nobody caught
   this for a week. The endpoint said true and every file 404'd into the SPA
   fallback. Make it verifiable, not declarative."**

   WHAT WENT WRONG, IN ONE LINE: `heldOpen()` answers *may this browser have the
   held tree*, and for a week nothing anywhere answered *is the held tree here*.
   The launch bundle had dropped all 144 files and `/api/held` went on saying
   `open:true`.

   ═══ WHY THE PROBE IS AN IMAGE AND NOT `twin.html` ═════════════════════════
   `not_found_handling` is `single-page-application`, so a MISS returns
   `index.html` with **200 text/html** — a status check cannot tell a hit from a
   miss, and neither can a content-type check on an HTML file, because the
   fallback IS HTML. An IMAGE discriminates absolutely: a real hit is
   `image/png`, and the fallback can only ever be `text/html`.

   ═══ IT NAMES THE FILE IT TESTED, AND THAT IS THE HONEST PART ══════════════
   One probe cannot prove 144 files are present. So the answer carries `probe`
   — the exact path checked — and claims nothing beyond it. A reader can repeat
   it. **This is a smoke test that says which room it walked into**, not an
   inventory.
   IF THAT FILE IS EVER RENAMED the probe reports `served:false` on a deployment
   that is fine. That is the loud failure direction and it is the right one: a
   false alarm is investigated, and the fault this replaces was a false ALL-CLEAR
   that nobody investigated for a week.

   ═══ IT IS ONLY ANSWERED TO A BROWSER THAT HOLDS THE DOOR OPEN ═════════════
   Whether held material is on this deployment is a fact about the WORK
   (Doctrine 11), so it is `null` to everybody else. The key-holder is the only
   party the answer is for, and the only one who can act on it. */
const HELD_PROBE = "/held/robots/art/portal-cover.png";

/** is the held tree actually ON this deployment? null when the door is shut. */
async function heldServed(request, env) {
  try {
    const probe = new URL(HELD_PROBE, new URL(request.url).origin);
    const res = await env.ASSETS.fetch(new Request(probe, { method: "GET" }));
    if (!res.ok) return false;
    /* the SPA fallback can only be HTML; a real hit can only be the image */
    return (res.headers.get("Content-Type") || "").toLowerCase().startsWith("image/");
  } catch {
    /* a probe that could not run has not proved presence, and must not claim it */
    return false;
  }
}

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

/* ═══ [2026-08-24] THE CACHE KEY DOES NOT INCLUDE THE COOKIE ═══════════════════
   TWO COOKIES DECIDE WHAT A VISITOR GETS — `wb_held` at the two doors above,
   `wb_record` at the Record's clock below — AND UNTIL TODAY NOTHING MARKED
   THOSE RESPONSES UNCACHEABLE. Cloudflare's default cache key is the URL. It
   does not include the `Cookie` header. PNG, WEBP, WAV, MP3 and JS are
   cacheable by default and HTML is not, so the exposure was widest on exactly
   the material the doors exist to hold: one URL, two bodies, one key.

   SO EVERY EXIT WHOSE BODY DEPENDS ON A COOKIE LEAVES WITH
   `Cache-Control: private, no-store`, AND IT IS MARKED AT THE SITE — BOTH
   HALVES OF EVERY DOOR. **THE 200 IS THE HALF THAT LEAKS.** A refusal cached
   under a cookie-blind key is a nuisance; a GRANT cached under one is the held
   material on the street. The first cut of this list named only the refusals
   and would have looked complete while holding nothing. Four branches, six
   exits, and the three that matter are the ones that return a body.

   WHY NOT `Vary: Cookie`, WHICH IS THE PRECISE DECLARATION. Because Cloudflare
   documents that it ignores `Vary` on anything but `Accept-Encoding`.
   `Vary: Cookie` would be a true sentence that no cache in this path acts on;
   `no-store` is the enforceable one. Ops ruled it 2026-08-24 and the reason is
   written down HERE so the next session does not re-open it as an oversight.

   IT CANNOT GO IN `_headers`. That file governs the ASSET layer and never
   reaches a response this worker generates — and there is no `_headers` in
   this tree at all, so there is nothing to amend even where it would apply.

   > **[FLAG 2026-08-24 · flagged, not fixed] NO GATE IN THIS TREE READS A
   > RESPONSE HEADER.** `reveal:check` reads the door prefixes out of this file
   > and `wrangler.jsonc` and nothing further; no other gate looks at a header
   > at all. If a future edit drops one of these marks, NOTHING REPORTS IT —
   > the same silence that let the gap stand in the first place. */
const NO_STORE = "private, no-store";

/** re-stamp a response this worker decided from a cookie. A response handed
    back by `env.ASSETS.fetch` has IMMUTABLE headers, so it is rebuilt rather
    than mutated — `new Response(body, response)` carries status and headers
    across, and the rebuilt copy's headers are writable. */
function noStore(response) {
  const marked = new Response(response.body, response);
  marked.headers.set("Cache-Control", NO_STORE);
  return marked;
}

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

/* ═══ [2026-08-27 · C-asof1] THE DATE WINS, AND THIS LINE IS THE WHOLE RULE ══
   OPS RULED IT: *"Preview and `?as-of=` answer the same question, and letting
   the door override the clock shows a day that never existed."*

   WHAT IT WAS. `wb_record` defeats the Record's date filter outright — every
   entry, whatever its date. Driving needs `wb_record` to MINT, so every driven
   session began holding the thing that cancelled it: the driven day moved the
   countdown and the share cards and nothing else. The only way to see one day
   was open the door, drive, then CLOSE the door and keep driving — a sequence
   that worked, was written down nowhere, and is the defect stating itself.

   WHAT IT IS NOW. **While the clock is driven, the preview override is
   SUSPENDED.** Not revoked — suspended, for exactly as long as a day is being
   driven. Clear the drive and the door is open again with nothing to re-enter.
     · not driven + door open  -> every entry          (unchanged)
     · DRIVEN   + door open    -> the driven day alone  (this is the change)
     · driven   + door shut    -> the driven day alone  (unchanged)

   THE KEY CHECK IS NOT TOUCHED AND DID NOT NEED TO BE. Minting still requires
   `wb_record` — the date parameter has no secret of its own and borrows the
   Record key's proof-of-holder for the one moment of minting. What changes is
   what the cookie DOES once held, never who may hold it. The three-step
   sequence collapses to two on its own: open the door, drive, look.

   ONE DECLARATION, THREE READERS (Doctrine 17) — the asset door, `/api/record`
   and the injection all ask THIS function rather than each testing the cookie
   and the clock for themselves. A second copy of `previewing && !driven` is
   exactly how one of the three drifts and shows a day that never existed. */
const showEveryRecord = (previewing, clock) => previewing && !clock.driven;

/* ═══ [2026-08-24] THE DATE PARAMETER — A FOURTH DOOR, AND IT MOVES THE CLOCK ══
   MIKE/OPS: drive the museum to ANY day and see what it shows on that day.
   [2026-08-27 · RULING A] IT WAS BACKWARDS-ONLY FOR THREE DAYS, from f2dc391 to
   this commit. What changed, why, and what the old rule said is in ANY
   DIRECTION, AND NO CEILING below — read it before restoring anything.

   ═══ IT MOVES THE CLOCK AND NEVER THE STORY ════════════════════════════════
   THIS IS THE WHOLE DESIGN AND EVERY OTHER PROPERTY FALLS OUT OF IT. The
   parameter changes ONE THING: what day this worker thinks it is. It does not
   filter entries, does not choose assets, does not open or shut a wing, and
   owns no list of what any day contained. Every existing rule then runs
   UNCHANGED against a different day and reveals exactly what it would have
   revealed then — `assetWithheld` holds the same files it would have held,
   `wingOpenOn` answers the same way, the page's own filter draws the same
   entries. Nothing new consults a clock; ONE EXISTING CLOCK READ GETS A
   DIFFERENT ANSWER.
   SO THERE IS NO SCHEDULE FILE, NO DATE MAP AND NO LIST, and if a later round
   finds itself wanting one, the thing it is building is not this feature. A
   table of what each day showed is a SECOND SOURCE OF TRUTH about the past,
   and it would drift from the Record the first time an entry was edited.

   ═══ ONE READ, ONE OVERRIDE — AND NOTHING COUNTS THE CALL SITES ════════════
   `todayInRecordTz()` IS CALLED EXACTLY ONCE IN THIS FILE, in the default
   export below, and its result is `realToday`. The driven day is chosen from it
   there and handed down as `clock.today`; nothing downstream reads a clock or
   knows that one exists. A SECOND CALL WOULD SPLIT THE MUSEUM IN HALF — part of
   a page answering the driven day and part the real one — and it would do so
   silently, on a path nobody looks at.
   > **[FLAG 2026-08-24 · flagged, not fixed] NOTHING IN THIS TREE COUNTS THEM.**
   > No gate greps for a second `todayInRecordTz(` in this file, exactly as no
   > gate reads a response header. The rule holds today because it is written
   > here, and a future edit that adds a second call will be reported by nobody.

   ═══ A COOKIE CARRIES, A QUERY GESTURES ════════════════════════════════════
   `?as-of=` is a one-shot gesture that MINTS `wb_asof`; the cookie is what
   every subsequent request rides on. It has to be a cookie: a query dies on
   subresources, so the page would come back on the driven day while every
   image it names was fetched on the real one — and the asset door would refuse
   exactly the pictures the visit exists to look at.
   ITS OWN COOKIE, NOT A SEAT ON `wb_record`. A new reason gets a new door (§8).
   [2026-08-27] THE REASON THIS SENTENCE USED TO GIVE IS DEAD AND THE RULE IT
   SUPPORTED IS NOT. It said *"`wb_record` shows FUTURE entries; this moves the
   clock BACKWARDS — they are opposite motions"*, and Ruling A pointed them the
   same way. THE DOORS STILL DO NOT MERGE, on the reason that was underneath it
   the whole time: THEY ANSWER DIFFERENT QUESTIONS. `wb_record` is *show me
   everything at once, whatever its date*; `wb_asof` is *show me one day, as
   that day will look*. One defeats the filter, the other moves the clock.
   Merging them would leave no way to ask the second question — which is the one
   Mike made the deploy conditional on.

   ═══ [2026-08-27 · CLOSED SAME DAY] THE OVERLAP — AND THE DATE NOW WINS ════
   IT WAS RAISED HERE AS FLAGGED-NOT-FIXED AND OPS RULED IT WITHIN THE ROUND.
   `wb_record` defeated the date filter outright, and minting requires
   `wb_record`, so every driven session began holding the thing that cancelled
   it — the driven day moved the countdown and the share cards and nothing else.
   The workaround was open the door, drive, then CLOSE the door and keep
   driving; it worked and was written down nowhere.
   **THE RULE IS NOW `showEveryRecord` — see its block above.** While a day is
   being driven the preview override is suspended, so the sequence is open the
   door, drive, look. The workaround is not documented anywhere because it no
   longer exists, which is the outcome to prefer over documenting it.

   ═══ WHAT IS BEHIND THE KEY, AND WHAT IS NOT ═══════════════════════════════
   MINTING is behind the Record key: the requester must already hold `wb_record`
   (Mike ruled A — Ops and Mike only). The minted cookie then carries its OWN
   digest, `sha256("wb-asof-v1:" + RECORD_KEY + ":" + day)`, so reading it back
   costs one hash and does not re-check the other door on every request. A
   forged `wb_asof` drives nothing.
   CLEARING IS NOT BEHIND THE KEY, and it is checked BEFORE anything else is
   validated. The exit cannot sit behind the thing that is broken: a cookie that
   fails every test below must still be removable, and giving up a privilege is
   not a privileged act — the same reasoning `/api/record {close:true}` carries.

   ═══ [2026-08-27 · RULING A] ANY DIRECTION, AND NO CEILING ═════════════════
   MIKE: **a key-holder may drive the clock FORWARD.** This is the switch he
   made the deploy conditional on — *"I want the website updated so I can always
   see what it is I am actually getting"* — and what he is getting is next
   week's Record, which backwards cannot reach.
   WHAT IT REPLACED, WRITTEN DOWN SO A LATER ROUND DOES NOT RESTORE IT. From
   f2dc391 (2026-08-24) until this commit `badDay` refused any `day > realToday`
   with *"Backwards is honoured; forwards is refused, not clamped"*. THE CLAMP
   HALF OF THAT REASONING STANDS and is why nothing is clamped now either: a
   clamp answers a question nobody asked and looks like it worked. What fell is
   the DIRECTION, and it fell on arithmetic — every entry, the wing and all
   seven governed files sit in the future of every day the old rule could reach,
   so the whole backwards range was one state, and that state was *shut*.
   THERE IS NO CEILING AND THERE IS NOT GOING TO BE ONE. Ops ruled it: a bound
   is a number somebody has to maintain, and it is wrong the first time an entry
   moves. **The honest answer is whatever the entries say.** Drive past the last
   entry and the museum shows what it has — every entry drawn, wing open,
   countdown gone, because it has already fired. That is the answer, not an edge
   case, and nothing special-cases it.
   A REFUSAL IS STILL SAID OUT LOUD. Two checks remain — the shape, and whether
   the date is a real calendar day — and the refusal NAMES WHICH ONE FAILED,
   because "as-of refused" on its own sends the reader back to guess.

   ═══ RULING B: A BARE QUERY FROM A STRANGER IS IGNORED ═════════════════════
   **DO NOT "FIX" THIS INTO A REFUSAL.** An earlier draft refused every
   unauthenticated `?as-of=`, on the reading that a supplied date must never be
   dropped silently. Ops corrected it: that rule was written about a DRIVEN
   SESSION dropping a date quietly, and generalising it into a UX consequence
   would hand any stranger a URL that makes the museum answer an error page —
   `weird.baby/?as-of=x`, typed once, shareable. So a requester who presents
   NOTHING gets today's museum with the parameter ignored, exactly as before
   this parameter existed. A requester who presents SOMETHING — a `wb_asof`
   cookie, or a query while holding `wb_record` — gets an explicit refusal,
   because they are the one who can act on it. Never silent to a driver; never
   loud at a passer-by. */
const AS_OF_COOKIE = "wb_asof";
const asOfToken = (key, day) => sha256Hex("wb-asof-v1:" + key + ":" + day);
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
/* SESSION-SCOPED ON PURPOSE — no `Max-Age`, so it dies with the browser window.
   Ops ruled the lifetime "short, and not a number": a constant here is a thing
   a later round tunes, and a driven session should not outlive the sitting in
   which somebody chose to drive. */
const AS_OF_SET = (v) => `${AS_OF_COOKIE}=${v}; Path=/; HttpOnly; Secure; SameSite=Lax`;
const AS_OF_CLEAR = `${AS_OF_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;

/** `2026-02-30` passes the shape and is not a day. Round-tripping is the test. */
function realCalendarDay(day) {
  const t = Date.parse(day + "T00:00:00Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === day;
}

/** which check a candidate day fails, in words, or null when it passes */
/* [2026-08-27 · RULING A] THE THIRD CHECK IS GONE AND `realToday` WITH IT. It
   refused `day > realToday`; a key-holder may now drive forward without a
   ceiling. See ANY DIRECTION, AND NO CEILING above before restoring either. */
function badDay(day) {
  if (!ISO_DAY.test(day)) return "malformed — expected YYYY-MM-DD";
  if (!realCalendarDay(day)) return `not a real calendar day — ${day} does not exist`;
  return null;
}

/* every refusal is marked like every other cookie-decided exit in this file,
   and every one of them names the way out. See THE CACHE KEY at the head. */
function refuseAsOf(status, why) {
  return new Response(
    `as-of refused: ${why}.\nClear it with ?as-of=off\n`,
    { status, headers: { "Content-Type": "text/plain;charset=UTF-8",
                         "Cache-Control": NO_STORE } });
}

/* ═══ [2026-08-24] A DRIVEN SESSION IS READ-ONLY ═══════════════════════════
   The three D1 writes stamp `datetime('now')` — SQLite's clock, which this
   parameter does not reach and must not. So a row written while the museum is
   pretending to be another day would carry the REAL instant against work done
   in a FICTIONAL one, and nothing afterwards could tell it from an honest row:
   not the row, not the table, not a person reading either. A guest book
   signature is the clear case — it is somebody's mark on a day, and a mark
   whose day cannot be trusted is worse than a mark that was never made.
   SO THE WRITE IS REFUSED, NOT STAMPED DIFFERENTLY AND NOT DROPPED. A driven
   session therefore logs no visits at all: the counts for it are ABSENT rather
   than wrong, which is the failure that can be reasoned about later. */
function drivenReadOnly(cors, clock) {
  return new Response(JSON.stringify({
    error: `The museum is being driven to ${clock.today} (the real day is `
         + `${clock.realToday}). Writes are refused while the clock is driven. `
         + "Clear it with ?as-of=off",
    driven: true, today: clock.today, realToday: clock.realToday,
  }), { status: 403, headers: { ...cors, "Content-Type": "application/json",
                                "Cache-Control": NO_STORE } });
}

/** `{}` = not driven · `{day}` = driven · `{cookie}` = mint/clear · `{refusal}` */
async function resolveAsOf(request, env, url) {
  const q = url.searchParams.get("as-of");

  /* CLEAR FIRST, BEFORE ANY VALIDATION — see the note above. */
  if (q === "off") return { cookie: AS_OF_CLEAR };

  if (q !== null) {
    /* THE QUERY MINTS. Ruling B: a requester who proves nothing is ignored,
       and that is checked before the value is judged, so a stranger's typo
       never becomes an error page. */
    if (!env.RECORD_KEY) return {};
    if (!await previewOpen(request, env)) return {};
    const why = badDay(q);
    if (why) return { refusal: refuseAsOf(400, why) };
    return { day: q, cookie: AS_OF_SET(`${q}.${await asOfToken(env.RECORD_KEY, q)}`) };
  }

  /* THE COOKIE CARRIES. Presenting one IS presenting something, so from here
     down every failure is said out loud rather than ignored. */
  const raw = readCookie(request, AS_OF_COOKIE);
  if (!raw) return {};
  const cut = raw.lastIndexOf(".");
  if (cut < 0) return { refusal: refuseAsOf(400, "cookie is malformed") };
  const day = raw.slice(0, cut);
  const why = badDay(day);
  if (why) return { refusal: refuseAsOf(400, why) };
  if (!env.RECORD_KEY) return { refusal: refuseAsOf(503, NO_RECORD_KEY_NOTE) };
  /* THE DIGEST IS THE WHOLE OF THE COOKIE'S AUTHORITY. It binds the DAY to this
     deployment's key, so a driver cannot hand-edit the day in their own jar —
     in either direction, and that is unchanged by Ruling A.
     [2026-08-27] IT IS NOW THE ONLY THING GUARDING THE DAY. The forward check
     that used to stand above it is gone; `badDay` is left here as a cheap shape
     test before the hash, and it can no longer refuse a well-formed date. */
  if (raw.slice(cut + 1) !== await asOfToken(env.RECORD_KEY, day)) {
    return { refusal: refuseAsOf(403, "cookie does not verify against this deployment's key") };
  }
  return { day };
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

function injectClock(response, clock, previewing, wingOpen, governed) {
  const type = response.headers.get("Content-Type") || "";
  if (!type.includes("text/html")) {
    /* [2026-08-24] NOT HTML, SO NOTHING IS INJECTED — AND THE ONLY
       COOKIE-DECIDED CASE LEFT ON THIS LINE IS THE RECORD CLOCK'S 200 HALF.
       A file the Record's schedule governs is a 404 to the public and a 200 to
       a previewer AT THE SAME URL, decided by `wb_record`, and the refusal is
       the only half that branch answers itself — the grant falls through to
       here. The seven governed paths are `.webp`, which is cacheable by
       default. Everything else through this line is the same bytes for
       everybody and keeps the asset layer's `public, max-age=0,
       must-revalidate`, which is correct for it. */
    return governed ? noStore(response) : response;
  }

  /* ═══ [2026-08-24] THE ETag RESIDUAL, AND WHY THE MARK IS UNCONDITIONAL ═════
     THE ASSET LAYER'S ETag HASHES THE STORED FILE, NOT THIS INJECTION. It is
     computed before this worker is ever asked, so it does not move when the
     values below do — and the same layer sends `public, max-age=0,
     must-revalidate`, which is precisely the header that makes a browser STORE
     the body and revalidate on every use.
     SO THE 304 IS THE NORMAL PATH FOR A RETURNING VISITOR, NOT AN EDGE CASE.
     `env.ASSETS.fetch(request)` forwards their `If-None-Match` verbatim, the
     store's ETag has not moved, the layer answers 304 with a null body — and
     the browser renders ITS OWN STORED COPY: a stale `__WB_TODAY__`, a stale
     `__WB_NOW__`, and a `__WB_RECORD_ALL__` frozen at whatever the cookie said
     on the request that last delivered a body. Mike enters the preview code,
     reloads, and the page has not noticed the door moved. The same in reverse
     when he closes it.
     `no-store` CLOSES IT BY CONSTRUCTION: a browser that may not store the
     body cannot send a conditional request about it. There is no second
     mechanism and no cache-busting query to maintain.
     AND THAT IS WHY THE MARK IS NOT CONDITIONAL ON THE COOKIE BEING PRESENT.
     EVERY HTML response carries a `__WB_RECORD_ALL__` decided by `wb_record` —
     `false` is a cookie-decided value too. Marking only a previewer's copy
     would leave the public one cacheable and still stale. */
  const marked = noStore(response);
  /* a 304 has no body to rewrite. Running HTMLRewriter over one was always a
     no-op — the guard above tests Content-Type, which a 304 still carries — so
     it is skipped, and the mark above is now the whole of what happens to it. */
  if (!marked.body) return marked;
  /* [2026-08-16] `__WB_NOW__` IS THE SERVER'S INSTANT, AND IT IS ONE FIELD IN
     THE INJECTION THAT WAS ALREADY HAPPENING. The lobby countdown needs seconds
     and `__WB_TODAY__` is a DAY — `todayInRecordTz` formats the time of day away
     — so the clock the museum already trusts could not answer the question.
     THE ALTERNATIVE WAS `new Date()` IN THE BROWSER, WHICH IS THE SECOND CLOCK
     `src/lib/record-clock.js` EXISTS TO REFUSE, in its own words: *"a browser
     clock belongs to the visitor: it can be wrong by accident or on purpose."*
     A countdown driven by the visitor's clock would disagree with the Record on
     the same page — and would be trivially spoofable into showing the doors
     open early.
     IT IS THE SAME MECHANISM CARRYING ONE MORE VALUE, not a second mechanism:
     same function, same response, same `<script>`, computed on the same request
     as the date beside it. */
  const payload =
    `window.__WB_TODAY__=${JSON.stringify(clock.today)};` +
    `window.__WB_NOW__=${clock.nowMs};` +
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
  /* transformed AFTER the mark, not before: `transform` carries the response's
     headers across, so stamping first is the ordering that cannot lose it. */
  return r.transform(marked);
}

/** has Record 001 announced the wing? — the worker's half of wing-open.js */
function wingOpenOn(today) {
  if (__WB_STAGE__ !== "launch") return true;
  return !!__WB_RECORD_FIRST_DAY__ && today >= __WB_RECORD_FIRST_DAY__;
}

/* ═══ [2026-08-24] THE ENTRY POINT IS TWO HALVES, AND THE SPLIT IS THE POINT ══
   `routes` is the museum and knows nothing about clocks or driving: it is handed
   a `clock` and answers. The default export below is the ONLY thing that reads
   the real day, resolves the override and stamps the cookie — so there is one
   place to look for "what day is it" and one place a `Set-Cookie` can be added,
   instead of a stamp at each of the dozen returns in here. */
const routes = {
  async fetch(request, env, url, clock) {
    /* [CH5] the museum's own day, computed once per request. Everything below
       that reasons about the Record reads this and never `new Date()` again.
       [2026-08-24] IT IS NOW HANDED IN RATHER THAN READ. Same value, same name,
       same meaning to every line below — the difference is that it may have
       been driven, and NOTHING DOWN HERE LEARNS THAT. See THE DATE PARAMETER. */
    const recordToday = clock.today;

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
    /* [2026-08-24] BOTH HALVES ARE MARKED, AND THE SECOND ONE IS WHY.
       This branch answers two different bodies at one URL and the only thing
       that chooses between them is `wb_held`, which is not in the cache key.
       The GRANT serves `/assets/locked/*` — three built JS chunks, 188,356
       bytes — and JS is cacheable by default. See THE CACHE KEY above. */
    if (LOCKED_DIRS.some(d => url.pathname.startsWith(d))) {
      if (!await heldOpen(request, env)) {
        return noStore(new Response("Not found", { status: 404 }));
      }
      return noStore(await env.ASSETS.fetch(request));
    }
    /* [2026-08-24] BOTH HALVES AGAIN, AND HERE THE GRANT IS THE BIG ONE:
       `/held/*` is 137 files and 186,888,028 bytes — png, wav, mp3, jpg — and
       every one of those extensions is cacheable by default. `wb_held` decides
       and the key does not see it.
       THE MARK IS NOT MADE CONDITIONAL ON THE STAGE, though the condition
       above is. At DEVELOPMENT this branch is cookie-blind and serves
       everybody, so nothing here varies — but a stage-dependent header is a
       second thing to reason about at the exact site where getting it wrong
       publishes the wing, and `npm run deploy` (development) is refused
       outright by tools/deploy-guard.mjs, so no development build reaches the
       public and the cost of the plainer rule is a local `wrangler dev`. */
    if (STAGE_DIRS.some(d => url.pathname.startsWith(d))) {
      if (__WB_STAGE__ === "launch" && !await heldOpen(request, env)) {
        return noStore(new Response("Not found", { status: 404 }));
      }
      return noStore(await env.ASSETS.fetch(request));
    }

    /* ═══ [CH5 2026-08-12 · A3] A FUTURE RECORD'S FILES ARE REFUSED TOO ══════
       An entry that names a photograph publishes it on the entry's own day —
       but the FILE ships with the deploy, days early, and was fetchable by
       anyone who guessed the path. Same clock, same rule.
       IT SITS AFTER THE TWO DOORS ON PURPOSE. A path that is both governed and
       behind a shut directory has already been answered above; this branch only
       ever sees paths a visitor is otherwise allowed to have.
       THE SCHEDULE IS BAKED AT BUILD TIME (`__WB_RECORD_ASSETS__`, vite.config)
       from the Record's own `assets` arrays.
       [2026-08-20] IT IS EXERCISED. This note said the schedule was EMPTY and
       the branch "built and unexercised" — true when it was written, and
       FALSE since Record 003 delivered. The built worker now
       carries SEVEN real rows: the five manual scans and the marked copy on
       Record 003's day, and Record 004's `qc-101-a` on the day after. They ship
       at PUBLIC addresses and this branch is what holds them until their day.
       [2026-08-24] TWO CORRECTIONS IN ONE, AND THE SECOND IS THE INTERESTING
       ONE. **Six became seven on 2026-08-21** when Mike back-posted `qc-101-a`
       onto Record 004 — this note went on saying six for three days and nothing
       reported it, because no gate counts these rows. **And the dates are gone
       from this note deliberately**: Ruling C moved `RECORD_EPOCH` to
       2026-08-31 and every one of the seven re-dated with it, so a date quoted
       here would be the third thing in this comment to go stale.
       [2026-08-28] **THAT PREDICTION IS NOW A MEASUREMENT.** Ruling D moved the
       epoch again, to 2026-09-07, and all seven re-dated a second time — four
       days after the sentence above was written. Because no day is named in it,
       nothing in this comment had to move with them. The schedule
       derives; read it from `__WB_RECORD_ASSETS__`, never from prose.
       IT IS ALSO THE LIVE PRECEDENT FOR THE STAGE DOOR, which is why the
       correction is worth more than tidiness: `heldOutOfLaunch` was removed on
       the same day (vite.config.js) on the argument that shipping a file and
       refusing it at the edge is the arrangement this museum already runs. A
       stale comment saying the mechanism had never run would have been the
       first thing to contradict that argument. */
    /* [2026-08-24] THE TEST IS HOISTED SO THE 200 HALF CAN BE MARKED TOO.
       This branch answers the REFUSAL and nothing else — a previewer falls
       through to the last line of this worker, and THAT is where the 200 for a
       governed `.webp` is served. Hoisting the test into a name is the only
       way the far end can know the URL it is about to answer was decided by
       `wb_record`. It changes nothing else: `assetWithheld` is an object
       lookup on a build-time table, and `previewOpen` is still reached only
       when a path is governed, exactly as the short-circuit did before. */
    const governed = assetWithheld(__WB_RECORD_ASSETS__, url.pathname, recordToday);
    /* [2026-08-27 · C-asof1] `showEveryRecord` RATHER THAN `previewOpen`, so a
       driven session's asset door answers the DRIVEN day even with the Record
       door open. `governed` still short-circuits, so the cookie is read only
       when a path is actually on the schedule — unchanged from before. */
    if (governed && !showEveryRecord(await previewOpen(request, env), clock)) {
      return noStore(new Response("Not found", { status: 404 }));
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
      /* [2026-08-24] A CACHED `Set-Cookie` HANDS A STRANGER THE KEY. Nothing
         caches a POST, so this is not live — and that is a property of the
         METHOD, not of this response. A secret is not left resting on a method
         somebody could change in a later round for an unrelated reason. Marked
         on its own condition, which is the same rule §0 states for a hold. */
      return json({ ok: true }, 200,
                  { "Set-Cookie": cookie, "Cache-Control": NO_STORE });
    }

    /* GET /api/held — does this browser already hold the door open? Lets the
       admin page show the wing's buttons live rather than asking again every
       visit. It reports a boolean and never the key. */
    if (url.pathname === "/api/held" && request.method === "GET") {
      const open = await heldOpen(request, env);
      return new Response(JSON.stringify({
        open,
        configured: !!env.HR_KEY,
        note: env.HR_KEY ? null : NO_KEY_NOTE,
        /* [2026-08-20] PRESENCE, MEASURED — see `heldServed` above for why the
           probe is an image, why it names itself, and why it is null to anybody
           without the key. `open && !served` is the exact state that went
           unnoticed for a week: permission granted over an empty store. */
        served: open ? await heldServed(request, env) : null,
        probe: open ? HELD_PROBE : null,
        /* [V1 2026-08-06] THE STAGE IS REPORTED BY THE THING THAT ENFORCES IT.
           Mike asked for the two states to be UNAMBIGUOUS, and the honest place
           to answer that is the server: a page can only say what it was
           compiled believing, while this branch is the same literal the refusal
           above reads. `/admin` prints it. Nothing on a public surface does —
           what stage a museum is at is a fact about the work (Doctrine 11). */
        stage: __WB_STAGE__,
        /* ═══ [2026-08-24] WHAT COMMIT IS THIS? PRODUCTION ANSWERS IT ═══════
           Until today nothing in the repository could say what was deployed —
           establishing it meant probing this site and bracketing the answer
           from which fields `/api/record` was MISSING. `docs/DEPLOYED.md` is
           the tree's record and is written automatically, but it is written
           after the deploy and still needs committing, so it can drift. This
           cannot: it is compiled in (`__WB_COMMIT__`, vite.config.js) and it is
           whatever actually shipped. A `-dirty` suffix means the build was made
           over uncommitted changes and the sha alone does not describe it.
           NULL WITHOUT THE KEY, like `served` and `probe`: what commit a museum
           is running is a fact about the WORK (Doctrine 11). */
        commit: open ? __WB_COMMIT__ : null,
        /* [2026-08-24] `open`, `served` and `probe` above are all decided by
           `wb_held`: this endpoint answers two different bodies at one URL,
           same as the doors it reports on. It is EXTENSIONLESS, so it sits
           outside Cloudflare's default cacheable set today — a smaller mouth,
           not a different fault, and one Cache Everything rule would close the
           gap between them. It also carries `Access-Control-Allow-Origin: *`,
           so a cached copy would be readable cross-origin by anything. */
      }), { headers: { ...cors, "Content-Type": "application/json",
                       "Cache-Control": NO_STORE } });
    }

    // POST /api/visits — log a page visit
    if (url.pathname === "/api/visits" && request.method === "POST") {
      /* [2026-08-24] see A DRIVEN SESSION IS READ-ONLY above. */
      if (clock.driven) return drivenReadOnly(cors, clock);
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
      /* [2026-08-24] a signature is somebody's mark on a DAY; see above. */
      if (clock.driven) return drivenReadOnly(cors, clock);
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
      /* [2026-08-24] see A DRIVEN SESSION IS READ-ONLY above. */
      if (clock.driven) return drivenReadOnly(cors, clock);
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
      let body = {};
      try { body = (await request.json()) || {}; } catch { /* falls through */ }
      /* CLOSING NEEDS NO KEY, AND THAT IS DELIBERATE. Giving up a privilege you
         hold is not a privileged act; requiring the key to close would mean a
         browser could be left previewing by somebody who had mislaid it. It is
         also why this branch is tested BEFORE the not-configured refusal: a
         deployment whose key has since been removed must still be closable. */
      if (body.close === true) {
        const cleared = `${RECORD_COOKIE}=`
          + `; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
        /* [2026-08-24] THE RULING NAMED TWO `Set-Cookie` RESPONSES AND THERE
           ARE THREE. This is the third: it clears rather than mints, so it
           carries no key and is the least dangerous of them — which is exactly
           the argument that leaves one unmarked next to two marked ones and
           makes the sweep look complete. Marked. Flagged to Ops as the one
           addition beyond the ruled list. */
        return json({ ok: true, open: false, today: recordToday }, 200,
                    { "Set-Cookie": cleared, "Cache-Control": NO_STORE });
      }
      if (!env.RECORD_KEY) return json({ error: NO_RECORD_KEY_NOTE }, 503);
      const supplied = body.key;
      if (!supplied || await sha256Hex(supplied) !== await sha256Hex(env.RECORD_KEY)) {
        return json({ error: "No." }, 403);
      }
      const cookie = `${RECORD_COOKIE}=${await recordToken(env.RECORD_KEY)}`
        + `; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${HELD_MAX_AGE}`;
      /* the instant this cookie dies. Knowable HERE and nowhere else: it is
         HttpOnly, so no later request can read its age back out. */
      /* [2026-08-24] the same reason as `/api/held`'s mint above: a cached
         `Set-Cookie` hands a stranger the preview code's token. */
      return json({ ok: true, open: true, today: recordToday,
                    expires: Date.now() + HELD_MAX_AGE * 1000 },
                  200, { "Set-Cookie": cookie, "Cache-Control": NO_STORE });
    }
    /* ═══ [2026-08-20] DOES THIS ENDPOINT CARRY THE SAME LIE? PARTLY. ════════
       MIKE asked the question plainly, so here is the plain answer.

       `previewing:true` grants TWO different things and they fail differently.

       1. SEEING A FUTURE ENTRY'S TEXT — honest, always. The entries are static
          in the bundle (`RECORD_ENTRIES`) and `__WB_RECORD_ALL__` just stops the
          client filtering them. No file has to exist for this to work, so this
          half cannot lie.

       2. FETCHING A FUTURE ENTRY'S ASSET — **can lie, by the identical
          mechanism.** The branch above skips `assetWithheld` for a previewer
          **who is not driving** ([2026-08-27] `showEveryRecord`; a driven
          session's asset door answers the driven day) and falls through to
          `env.ASSETS.fetch`. If the entry names a picture that
          `reveal:day --place` has not yet renamed out of `public/held/`, the
          file is not at the public path the schedule names, the store misses,
          and `not_found_handling` returns the app HTML at 200 — the held door's
          failure exactly.

       SO IT IS THE SAME FAULT WITH A SMALLER MOUTH: `/api/held` had ONE grant
       and it was entirely empty; this has two and only the second can be.

       IT WAS LATENT, AND IT IS NOT ANY MORE. THE MEASUREMENT IS THE POINT.
       On 2026-08-20 this said the schedule held **six** paths, all past, all
       present at their public paths, and *"Future-dated assets: ZERO."* Two
       things have since made every clause of that false, and neither was
       reported by anything:
         · **2026-08-21** — Mike back-posted `qc-101-a` onto Record 004. Six
           became **SEVEN**.
         · **2026-08-24, Ruling C** — `RECORD_EPOCH` moved to 2026-08-31, so all
           seven re-dated into the future. Future-dated assets: **SEVEN.**
         · **2026-08-28, Ruling D** — the epoch moved again, to **2026-09-07**.
           Still seven, still all future-dated, and now further out. The COUNT
           is what this note turns on and the count did not move; the days are
           deliberately not re-typed here, for the reason the schedule comment
           above gives.
       SO THE LATENT CASE IS NOW THE LIVE ONE. Every one of the seven files is
       physically at its public path AND refused by the branch above until its
       new day, which is the mechanism working — but it also means a previewer
       is, for the first time, exactly the person this note says can be lied to.
       The files are present, so the lie does not fire today; it fires the first
       time an entry names a file `reveal:day --place` has not moved out yet.
       Still NOT FIXED, and still deliberately — see below.

       NOT FIXED, AND DELIBERATELY. Mike ruled the probe for `/api/held` and
       asked only for a statement here. The fix is not the same shape either: a
       fixed probe path cannot serve an endpoint whose asset set changes per
       entry, so the honest version walks the FUTURE-DATED half of the schedule
       — today an empty walk, costing nothing, and on the day it is not empty
       the previewer is exactly the person who needs the answer. One ruling. */
    if (url.pathname === "/api/record" && request.method === "GET") {
      return new Response(JSON.stringify({
        today: recordToday,
        tz: RECORD_TZ,
        /* [2026-08-27 · C-asof2] `previewing` STILL MEANS *THIS BROWSER HOLDS
           THE COOKIE*, and it must, because `/admin` draws its open/close
           button from it — a page that read this as "showing everything" would
           offer to open a door that is already open the moment a day is driven.
           WHAT IS SHOWING IS A SECOND QUESTION AND IT GETS A SECOND FIELD. */
        previewing: await previewOpen(request, env),
        /* [2026-08-27 · C-asof1] THE EFFECTIVE ANSWER, from the one declaration
           the asset door and the injection also read. `previewing && !driven`
           is NOT restated here or on any page — see `showEveryRecord`. */
        showingAll: showEveryRecord(await previewOpen(request, env), clock),
        configured: !!env.RECORD_KEY,
        note: env.RECORD_KEY ? null : NO_RECORD_KEY_NOTE,
        /* the LIFETIME, not the deadline. The cookie is HttpOnly and carries no
           age a later request can read, so on any page load after the one that
           minted it this is the whole of what is honestly knowable. */
        maxAgeDays: Math.round(HELD_MAX_AGE / 86400),
        /* ═══ [2026-08-24] A DRIVEN CLOCK IS NEVER SILENT, AND BOTH DAYS OR
           NEITHER. `today` is what the museum is reckoning and `realToday` is
           what the world says; ONE WITHOUT THE OTHER IS THE LIE, because
           `today` alone reads as the truth on any day it has been driven. This
           endpoint is the only place a driven session is legible — nothing on
           the glass says so — which is why all three fields ship together. */
        realToday: clock.realToday,
        driven: clock.driven,
        /* [2026-08-24] `previewing` above is decided by `wb_record`, so this
           is the Record clock's half of the same fault `/api/held` carries:
           two bodies, one URL, a key that does not see the cookie.
           Extensionless, `*` CORS, same reasoning as there. */
      }), { headers: { ...cors, "Content-Type": "application/json",
                       "Cache-Control": NO_STORE } });
    }

    if (url.pathname.startsWith("/api/")) {
      return new Response("Not found", { status: 404 });
    }
    /* [CH5] every HTML response leaves with the museum's day written into it
       [2026-08-24] AND `governed` RIDES ALONG, because this line serves two
       things that need marking for two different reasons: every HTML response
       (cookie-decided `__WB_RECORD_ALL__`, plus the ETag residual) and the 200
       half of the Record clock's door (a `.webp` a previewer may have early).
       `injectClock` is where both are stamped — see the two notes in it. */
    return injectClock(
      await env.ASSETS.fetch(request), clock,
      showEveryRecord(await previewOpen(request, env), clock),
      wingOpenOn(recordToday), governed);
  }
};

/* attach a Set-Cookie to a response the router already decided.
   IT MARKS AS WELL AS APPENDS, AND THAT IS NOT BELT-AND-BRACES. The router's
   marked exits cover every response whose BODY depends on a cookie, but this
   function can land on one whose body does not — `?as-of=` typed onto a plain
   public asset returns an ordinary image, which leaves with `public,
   max-age=0, must-revalidate` and would now carry a `Set-Cookie` holding the
   driving token. A cached Set-Cookie hands a stranger the key, so anything
   this touches is marked here, on its own condition, rather than relying on
   where it happened to land. */
function withSetCookie(response, cookie) {
  const out = new Response(response.body, response);
  out.headers.append("Set-Cookie", cookie);
  out.headers.set("Cache-Control", NO_STORE);
  return out;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    /* ═══ THE ONE READ. There is exactly one `todayInRecordTz(` in this file and
       it is this line. Nothing counts them — see THE DATE PARAMETER above. */
    const realToday = todayInRecordTz();

    const asOf = await resolveAsOf(request, env, url);
    if (asOf.refusal) return asOf.refusal;

    /* THE INSTANT FOLLOWS THE DAY, or the Record is on one day and the lobby
       countdown on another. `recordVisibleAt(day)` is the instant museum-day
       `day` BEGINS — `todayInRecordTz` starts returning `day` at RECORD_HOUR on
       it, and this is that same moment read from the other end. This is its
       first caller; it has been correct and unused since 2026-08-16.
       UNDRIVEN IT STAYS `Date.now()`, so a visitor with no cookie gets the byte
       for byte identical injection they got before this existed. */
    const clock = {
      today: asOf.day || realToday,
      realToday,
      driven: !!asOf.day,
      nowMs: asOf.day ? recordVisibleAt(asOf.day) : Date.now(),
    };

    const response = await routes.fetch(request, env, url, clock);
    /* the mint and the clear are the only two responses that carry it, and both
       are already marked no-store by the exit that produced them. */
    return asOf.cookie ? withSetCookie(response, asOf.cookie) : response;
  }
};
