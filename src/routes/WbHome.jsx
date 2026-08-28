// src/routes/WbHome.jsx — the LOBBY (/).
//
// [L3 2026-08-02] THE TOKEN CONFORMANCE ROUND. B7/R1 counted 43 hard-coded
// colours on this surface and ZERO reads of the design tokens; 33 of the 43
// were byte-for-byte a `--wb-*` that already existed. Those 33 now read the
// token. The other ten have no token and are listed in the round log with what
// they are and what they should probably become — Ops does not invent palette.
//
// WHY THE INLINE `<style>` BLOCK STILL WORKS: custom properties live on :root
// and Vite bundles every stylesheet into one document, so `var(--wb-*)`
// resolves here even though this file cannot `@import` anything. That is
// verified, not assumed — but it is also bundling luck rather than a declared
// dependency, which is R5's point and R5's job (see the round log).
import { useState, useEffect, useLayoutEffect, useRef } from "react";
/* [C 2026-08-13] `Link` goes with the Record door in the open wording — the
   lobby's only <Link> was inside that sentence. Removed rather than left
   imported: an unused import is a lint error in this repo's baseline. */
import { useNavigate } from "react-router-dom";
import "./WbHome.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";
/* [CH6 2026-08-12] has the Robots wing arrived? — src/lib/wing-open.js */
import { ROBOTS_OPEN } from "../lib/wing-open.js";
/* [2026-08-16] the countdown's clock — the server's instant, and the moment the
   doors open, both from the museum's own declarations. */
import { museumNow, SERVER_NOW } from "../lib/record-clock.js";
import { recordVisibleAt } from "../../reveal/record-clock.mjs";
import { RECORD_EPOCH } from "../data/artists/record-epoch.js";

/* ═══ [2026-08-16] THE COUNTDOWN TO THE DOORS ═══════════════════════════════
   MIKE: "a visible countdown to the opening of Weird.Baby… Big and obvious.
   This is the thing a visitor should see first. It carries the 'you found
   something' feeling that the current copy states in words."

   THE TARGET IS DERIVED, NOT TYPED: `RECORD_EPOCH` (2026-09-07) resolved to an
   instant in `RECORD_TZ` (America/New_York) = 2026-09-07T04:00:00Z. His ruling,
   after reversing an earlier local-to-the-visitor reading: *"The museum's own
   clock, matching the doors."* A launch slip still moves one field.
   [2026-08-24] AND IT MOVED — Ruling C put day one on 31 August, this comment's
   two dates are the only thing in this file that had to follow, and the counter
   re-armed itself. It had already run to zero on the old epoch and returned
   `null`; it now has days on it again, which is the correct reading of a museum
   whose doors open on a Monday still ahead of it.
   [2026-08-28] AND IT MOVED AGAIN — Ruling D put day one on **Monday
   7 September**. The same two dates in the paragraph above followed and nothing
   else in this file did. It does not re-arm this time, because it was never at
   zero: it goes from days to more days. **THE READOUT WAS CHECKED FOR THE
   TWO-DIGIT CASE** — `cell()` pads with `padStart(2, "0")` and does not clamp,
   so a ten-day reading prints `10 DAYS` and no cell needs widening. A three-day
   gap and a ten-day gap render in the same four cells.

   ═══ [2026-08-24 · SECOND CORRECTION, AND IT IS THE LOAD-BEARING ONE] THE
       TARGET IS `recordVisibleAt`, NOT `dayStartInRecordTz` ═══════════════════
   THE TWO ANSWER DIFFERENT QUESTIONS AND THIS COUNTER WAS ASKING THE WRONG ONE.
   `dayStartInRecordTz(day)` is MIDNIGHT on that day; `recordVisibleAt(day)` is
   17:00 on it — the instant `todayInRecordTz` starts returning `day`, which is
   the instant `wingOpenOn` opens the wing and Record 001 appears. Against day
   one those are **seventeen hours apart**.
   WHAT IT MEANT, MEASURED: the counter reached zero at 00:00 on 31 August and
   REMOVED ITSELF, while the wing stayed shut until 17:00 — so for seventeen
   hours the lobby would have shown neither a countdown nor a Record, on the
   museum's opening day. It is the failure `reveal/record-clock.mjs`'s own header
   warns about from the other direction: a visitor watches the counter reach zero
   and finds the museum shut.
   `dayStartInRecordTz` IS NOT MOVED AND MUST NOT BE. Its round log records that
   it was left alone deliberately: it answers *when does the calendar day begin*,
   Record 001's text calls that moment "12:00 am Monday morning", and moving the
   function would retcon his words. **Two questions, two functions** — which is
   why `recordVisibleAt` exists. This is its second caller; `src/worker.js`
   (f2dc391) was the first, and it had gone unused since 2026-08-16.
   Nothing below this block changed.

   THE TICK IS THE SERVER'S CLOCK, NOT THE VISITOR'S. `museumNow()` counts from
   the instant the worker injected, advanced by `performance.now()` — a
   MONOTONIC elapsed-milliseconds counter, which is why changing the device
   clock does not move this counter.

   AT ZERO IT REMOVES ITSELF — his ruling. `null` is returned, the component
   unmounts, and the copy beneath stands with nothing stale on the glass and no
   new copy needed. It does this LIVE, in a tab left open across midnight: the
   interval is still running and the render that crosses zero is the render that
   returns null.

   ONE SECOND, NOT ONE FRAME. `setInterval` at 1000ms is what a
   seconds-resolution readout needs; `requestAnimationFrame` would tick 60x for
   one visible change and, per §8's hazard, does not fire at all in a background
   tab — which is exactly the tab this has to be correct in. */
const DOORS_OPEN_AT = recordVisibleAt(RECORD_EPOCH);

function remainingAt(ms) {
  const left = DOORS_OPEN_AT - ms;
  if (left <= 0) return null;
  const s = Math.floor(left / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
}

function Countdown() {
  const [left, setLeft] = useState(() => remainingAt(museumNow()));

  useEffect(() => {
    if (!left) return undefined;              /* already open — never arm */
    const tick = () => setLeft(remainingAt(museumNow()));
    const id = setInterval(tick, 1000);
    /* [2026-08-16] A HIDDEN TAB'S INTERVAL IS THROTTLED, SO THE FIRST THING A
       RETURNING VISITOR SEES MUST BE RECOMPUTED RATHER THAN WAITED FOR.
       MEASURED, NOT ASSUMED: with the tab backgrounded, a 2000ms probe fired at
       95, 97, 99, 101, 103, 105 and then jumped to 121 — Chrome had cut it to
       roughly once a minute. The countdown's own interval is throttled the same
       way, so a tab left open and come back to could show a reading up to a
       minute stale before the next tick corrected it.
       THE COUNTER ITSELF WAS NEVER WRONG — it recomputes from
       `museumNow()` every tick rather than decrementing, so a throttled tick
       skips values instead of drifting, and the crossing to zero still happened
       on time in a hidden tab (verified). What this fixes is the WINDOW between
       a visitor looking and the next throttled tick arriving.
       `visibilitychange` fires the moment the tab is shown, so the recompute
       lands before the first paint the visitor sees. */
    const onShow = () => { if (!document.hidden) tick(); };
    document.addEventListener("visibilitychange", onShow);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, [left === null]);                        // eslint-disable-line react-hooks/exhaustive-deps

  if (!left) return null;                     /* AT ZERO IT REMOVES ITSELF */

  const cell = (n, label) => (
    <div className="wb-cd-cell" key={label}>
      <div className="wb-cd-n">{String(n).padStart(2, "0")}</div>
      <div className="wb-cd-l">{label}</div>
    </div>
  );

  return (
    /* `aria-live="off"` DELIBERATELY: a screen reader announcing a changing
       number once a second is unusable. The countdown is decorative-adjacent —
       the sentence beneath it carries the same fact in words, which is the
       accessible reading of this block and was already on the page. */
    <div className="wb-countdown" role="timer" aria-live="off"
         aria-label="Time until the museum opens">
      <div className="wb-cd-row">
        {cell(left.days, "days")}
        {cell(left.hours, "hours")}
        {cell(left.minutes, "minutes")}
        {cell(left.seconds, "seconds")}
      </div>
      {SERVER_NOW === null && (
        /* Nothing injected a server instant — `npm run dev`, or a worker that
           did not run. The counter falls back to the device clock and says so
           to Ops rather than pretending; there is no visitor-facing string
           here, and this branch cannot render in a served page. */
        <div className="wb-cd-dev" data-dev-clock="1" />
      )}
    </div>
  );
}

/* [M-ID 2026-08-03] MIKE HAS ANSWERED, AND THE ANSWER RETIRES THE QUESTION.
   F7c rendered four candidates behind `/?subtitle=2..4` and said "MIKE PICKS —
   nothing here is final until he does". He picked, and he picked none of them:
   "it is THE MUSEUM. No singer-songwriter qualifier, nothing narrowing —
   all-encompassing."
   Every candidate named a CLASS OF ARTIST, and every one of them was a fence.
   The building already holds a machine wing and a wing of other people's
   records; "a singer-songwriter museum" was untrue the day the robots opened
   and would have to be re-argued at every new wing. A name that has to shrink
   to stay accurate is the wrong name.
   The candidate list and the `?subtitle=` preview go with it. A shown-then-
   asked device that outlives the asking becomes four dead strings and a query
   parameter nobody will ever type again — and, worse, a live URL that still
   renders a retired identity. */
/* [L1 2026-08-05] AND IT NOW CARRIES THE HOUSE NAME. MIKE, reading the lobby:
   "'The Museum' becomes 'WEIRD.BABY MUSEUM' — it must match the Robots / Music
   / Foundation branding."
   THIS DOES NOT REVERSE M-ID ABOVE, and a future session must not read it as a
   reversal. M-ID struck four candidates that each named a CLASS OF ARTIST and
   so fenced the building in; the ruling was that the name may not narrow. A
   house name narrows nothing — it says WHOSE museum this is, which is the one
   fact every other line on the board already carries and this one did not.
   Read the directory four inches below it: WEIRD.BABY ROBOTS · WEIRD.BABY
   MUSIC · WEIRD.BABY FOUNDATION. The line under the wordmark was the only
   place in the building still calling it something else — a sweep of `src/`
   and `index.html` found the share tags, the booth's credo and the
   Foundation's invoice already saying "Weird.Baby Museum", so this string was
   the last holdout rather than one of many.
   IT IS WRITTEN IN TITLE CASE AND RENDERS IN CAPS. `.wb-subtitle` carries
   `text-transform: uppercase`, so the glass says WEIRD.BABY MUSEUM the way
   Mike wrote it, while the source matches the casing every other house name in
   the data is stored in. Do not "fix" it to a capitalised literal. */
const SUBTITLE = "Weird.Baby Museum";

/* ═══ [M23b 2026-08-04] THE GUEST BOOK MOVES, AND IT MOVES IN STEPS ═════════
   MIKE, ruling on the pair N6 built for him to choose between: "the SCROLLING
   version wins — delete the static list and the ?book= param. Then change its
   behaviour: THREE ENTRIES VISIBLE, and it BOUNCES to the next stop, PAUSES,
   bounces to the next stop, pauses — a stepped advance with rests, not a
   continuous drift. Tune the pause long enough to read three entries."

   SO THE VARIABLE THAT WAS BEING COMPARED IS GONE and a different one is set.
   N6's version drifted: a linear translate running forever, which means every
   row is in motion at every moment and a reader is always chasing. A STEPPED
   advance inverts that — the book is STILL almost all of the time, and the
   motion is a transition between two states of rest rather than the state
   itself. What a visitor reads is a held page, not a moving list.

   THE STOP IS ONE SIGNATURE [Q2 2026-08-05]. MIKE: "step by ONE NAME per
   bounce, not a whole page. Everything else about the rhythm is good — keep the
   bounce and the rest, just change the stride." So `STEP` is 1 and `REST_MS` is
   untouched. The previous round argued for a page-sized stop on the grounds
   that a rest should present three signatures nobody has seen; the ruling
   replaces that reading, and the argument is not restated here because it is no
   longer the behaviour. A one-row stride makes the book a ledger being read
   down rather than a slideshow of pages, and every row gets three rests in the
   window instead of one.

   THE BOUNCE IS THE EASING. `cubic-bezier(.34,1.3,.64,1)` overshoots its target
   and settles back, which is what "bounces to the next stop" describes and what
   a physical board of hinged rows does. It is one property, in the stylesheet,
   named where the transition is declared.

   ═══ [Q1 2026-08-05] IT WENT BLANK, AND HERE IS WHY ════════════════════════
   MIKE saw the live book empty out. The cause is not the arithmetic — the
   arithmetic was right for every list length it could reach. The cause is that
   THE ADVANCE AND THE WRAP RAN ON TWO DIFFERENT CLOCKS AND ONLY ONE OF THEM
   STOPS WHEN THE PAGE STOPS BEING LOOKED AT.

   The advance was a `setTimeout`. The wrap was a `transitionend`. In a hidden
   tab a browser throttles timers but SUSPENDS RENDERING — so the timeouts kept
   firing and adding to the offset, while no frames were produced, so no
   transition ever completed and no `transitionend` ever arrived to subtract one
   copy back off. Leave the lobby open in a background tab for ten minutes and
   the offset walks hundreds of rows past the end of a twelve-row track. Every
   visible row index is then past the last row that exists, and what a reader
   comes back to is an empty box. It recovers only at one net copy per step,
   which is minutes of blank.

   ═══ THE FIX IS TWO GUARANTEES THAT DO NOT DEPEND ON ANY EVENT ARRIVING ════
   A scheduling bug fixed by better scheduling is a scheduling bug with a longer
   fuse. Both of these are properties of the RENDER, so they hold even if every
   timer misfires and every event is dropped:

   1. THE OFFSET IS CLAMPED WHERE IT IS USED. `offset` is `pos` clamped to
      [0, n]. No accumulated state can move the track further than one whole
      copy, whatever the timers did while nobody was watching.
   2. THE TRACK IS LONG ENOUGH FOR THAT CLAMP BY CONSTRUCTION. `COPIES` is
      derived from the numbers rather than fixed at two: the lowest row the
      window can ever show is `n + VISIBLE - 1`, so the track needs
      `1 + ceil(VISIBLE / n)` copies. At n >= 3 that is the two copies this
      already had; at n = 2 it is three and at n = 1 it is four. THE BOOK
      THEREFORE CANNOT SHOW A BLANK ROW AT ANY LIST LENGTH — including lengths
      shorter than the window, which `SCROLL_MIN` happens to exclude today and
      which a future change to `SCROLL_MIN` must not be able to break.

   With those two in place the scheduling only has to be RIGHT, not SAFE, and it
   is fixed too: the book pauses while `document.hidden` (the platform's own
   signal, Doctrine 8 — and a book nobody is looking at should not be advancing
   anyway, which is the same reason it stops under the cursor), and the wrap has
   a timeout backstop beside the `transitionend` so a dropped event costs one
   frame instead of stranding the track. Both paths run the same idempotent
   wrap; running it twice does nothing.

   IT STOPS WHEN A READER ARRIVES. Hover and focus-within suspend the timer, so
   a name that catches somebody's eye stays put. A moving list nobody can stop
   is the failure mode of every ticker ever built, and a stepped one is not
   exempt.

   ═══ [P3 2026-08-05] AND A VISITOR CAN DRIVE IT ════════════════════════════
   MIKE: "THE GUEST LIST SCROLLS BY HAND. Keep the stepped bounce and the rests,
   but let a visitor drive it manually — drag, wheel, or arrows; pick what fits
   the register and say why. Manual input pauses the auto-advance and it resumes
   after a rest."

   DRAG, AND ARROWS BECAUSE DRAG ALONE IS UNREACHABLE. Not two features — one
   gesture and its keyboard equivalent, which is what any draggable owes.

   WHY DRAG IS THE ONE THAT FITS THE REGISTER. This book is already described,
   in this file, as a hinged board of paper rows, and its whole ruling is that
   it is a LEDGER BEING READ DOWN. Paper is moved by pushing it. The gesture is
   the same on a mouse, a finger and a pen because Pointer Events make it the
   same, and — the part that matters to the ruling — IT LANDS ON A ROW. The
   track follows the hand exactly (transition off, so there is no easing between
   a finger and the thing it is holding), and on release it settles to the
   NEAREST SIGNATURE with the same 520ms bounce the timer uses. The stepped
   register is not replaced by free scrolling; it is the thing the hand is
   allowed to aim.

   WHY NOT THE WHEEL, and this is a refusal rather than an omission. The book is
   three rows — about 92px — of a page people scroll past. A wheel handler there
   takes the wheel from the PAGE, and every visitor scrolling the lobby would
   drag their pointer across a strip that hijacks it. Scroll-jacking to fix a
   list nobody complained about is a cure worse than the disease, and `/booth`'s
   whole posture is that this place does not do things to you that you did not
   ask for. The vertical touch gesture IS taken (`touch-action: pan-x
   pinch-zoom`) and that is deliberate and different: a scrollable list inside a
   page takes the vertical drag NATIVELY — the plain fallback list already does,
   because it is a real scroll box — so the moving book behaves like the still
   one rather than like an exception. Pinch-zoom is never blocked.

   ARROW KEYS ARE THE SAME QUANTITY AS THE TIMER. One press is `STEP`, which is
   one signature, so a keyboard reader and the clock are moving the same object
   in the same unit. ↓ walks forward and wraps; ↑ walks back and STOPS AT THE
   FIRST SIGNATURE, because a guest book has a beginning and running off the top
   of it would be a claim about the collection that is not true. The box takes
   focus (`tabIndex`) and is labelled by the "Guest Book" heading already above
   it — no new string, and nothing on the glass announces the control, because a
   list that moves is its own invitation.

   "RESUMES AFTER A REST" IS ONE DEPENDENCY, NOT A SECOND TIMER. Every manual
   input bumps `nudge`, `nudge` is a dependency of the rest effect, and a
   dependency changing restarts the effect — so the book waits one full `REST_MS`
   from the last thing a visitor did. There is no new clock to fall out of step
   with the old one, which is exactly the failure Q1 was.
   THE HOVER PAUSE IS UNCHANGED AND IS A DIFFERENT RULE: a reader standing on
   the book with a mouse, or focused on it with a keyboard, stops it for as long
   as they are there. So on a desktop the rest visibly restarts once the pointer
   leaves; on a touch screen it restarts the moment the finger lifts. Hover is
   now read from `pointerenter`/`pointerleave` GUARDED ON `pointerType ===
   "mouse"` — mouse events are synthesised after a touch on most mobile
   browsers, and the old `onMouseEnter` would have frozen the book under a
   finger that had just dragged it.

   THE CLAMP DID NOT MOVE. A hand puts the track exactly where the timers could
   — `[0, n]`, the same expression, applied to the drag before it is rendered.
   Nothing about GUARANTEE 1 or GUARANTEE 2 is weakened by adding a second
   author of the offset, which is the whole reason those two were written as
   properties of the render rather than of the scheduling.

   AND IT DOES NOT MOVE FOR EVERYONE. `prefers-reduced-motion: reduce` renders
   the plain list — the platform's own signal (Doctrine 8), answered with
   "don't" rather than "slower". THE PLAIN LIST IS NOT THE DELETED VERSION
   COMING BACK: what Mike struck was the static book as a SHIPPED ALTERNATIVE
   and the `?book=` switch that offered it. A fallback for a reader who has
   asked their operating system for no animation, and for a book too short to
   have a second page, is the winner degrading — not the loser surviving. There
   is no address that serves it by choice. */
const SCROLL_MIN = 5;
const VISIBLE = 3;          /* rows in the window; `--gb-visible` mirrors it */
const STEP = 1;             /* [Q2] one signature per bounce */
const REST_MS = 5000;       /* long enough to read three signatures */
/* [Q1] the stylesheet owns the move; this is a MIRROR of its duration, used
   only to size the wrap's backstop. A drift between the two costs slack on a
   fallback path, never correctness — the clamp is what guarantees correctness. */
const MOVE_MS = 520;
const WRAP_SLACK_MS = 260;

/* ── [L1 2026-08-06] THE TWO BUDGETS, AND HOW THEY WERE ARRIVED AT ──────────
   Both are measured against the NARROWEST display the lobby supports, because
   that is the one that decides — a limit set at desktop is a limit that clips
   on a phone, which is the defect these numbers exist to end.
   At a 390px viewport `.wb-right` pads to 334 and the row pads to 310. The
   note gets that whole width on its own two lines there (see the ≤680px rule in
   WbHome.css), and Courier Prime at 0.72rem advances 6.907px, so a line holds
   44 characters and the block holds 88.
   THE NAME'S LIMIT IS PART OF THE SAME ARITHMETIC and was the thing nobody had
   checked: at 390px the name shares line one with the date, the longest date
   this formatter produces is "Sep 30, 2026" at 71px, and 60 characters of Syne
   at 0.78rem is roughly 420px inside a 310px row. 32 is what fits with the date
   beside it. Existing signatures are well inside both.
   ENFORCED IN TWO PLACES ON PURPOSE — `maxLength` here and a `slice` in
   src/worker.js — because an attribute is a courtesy to the browser and the
   database is where a row actually becomes permanent. */
const NOTE_MAX = 88;
const NAME_MAX = 32;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ═══ [L1 2026-08-06] THE ROW IS TWO LINES AND THE NOTE MAY FILL BOTH ════════
   MIKE: "THE PEOPLE ENTRIES are character-limited to fit the display — give
   them BOTH LINES to fill, enforced at entry rather than truncated after.
   Currently top-justified and cut at the wrap."

   IT IS THE SAME MECHANISM R3 BUILT FOR THE RECORD'S INDEX ONE ROUND AGO, and
   it is worth naming as such because it is now the house's answer to this whole
   class of problem: DELETE THE TRUNCATION so a too-long string cannot lie, and
   REFUSE THE STRING AT THE INPUT so there is never a too-long one. Take either
   half away and "it fits" is a promise again. What was here was the opposite
   arrangement — `white-space:nowrap` plus `text-overflow:ellipsis` plus a 280
   character limit, so a visitor could type 280 characters into a box that
   displays about 88 of them and nothing anywhere said so.

   `title` GOES WITH THE ELLIPSIS. It carried the full note on hover, which was
   the honest patch on a lossy row; there is nothing hidden to reveal now, and a
   tooltip that duplicates the text under it is the thing Doctrine 16 asks about.
   It was also the half a touch device could not use.

   THE ROWS STAY UNIFORM BY CONSTRUCTION, which is what P12 measured the box in
   rows for and what the stepped scroller translates by. Two lines is a
   composition rather than a consequence: the note is a two-line block whatever
   it holds, and `--gb-row` is read live off the stylesheet by both the CSS cap
   and the drag, so the narrow-width row can be a different height without a
   second author of the number. */
/* ═══ [C 2026-08-13] THE SIGNATURES ARE NUMBERED ═════════════════════════════
   MIKE: "Number the entries in the scroller. Mini egg."

   IT IS THE POSITION IN THE BOOK, NOT THE DATABASE ID. The live book runs
   1, 2, 5, 6, 7, 8 — two rows were removed at some point — so printing `id`
   would number six signatures up to eight and invite the question of who 3 and
   4 were. The book holds six signatures and the sixth person to sign is 6.
   THE LIST ARRIVES NEWEST FIRST (the worker orders by `signed_at` descending),
   so the number counts UP the page: `total - i`. Papa Weird.Baby signed first
   and is 1, at the bottom, which is where a guest book's first name is.

   IT IS A MINI EGG AND IS BUILT LIKE ONE — a number, in the date's own quiet
   monospace, in its own column so it cannot move the name. Nothing announces
   it, nothing counts to a hundred here, and the row is otherwise the row it
   already was. What happens at 31 and at 100 is Mike's, and is deliberately
   not built. */
function GuestRow({ e, n }) {
  return (
    <div className="wb-entry">
      {/* [W 2026-08-14] "Guest book numbers to two digits, slid left into the
          whitespace." Two digits is `01`, not `1` — a column of 1,2,3 beside
          01,02,03 is the same column with a ragged left edge, and the book is
          going to run past nine within the week. Padded here rather than in
          CSS because it is the STRING that is two digits; the sliding-left half
          is the row's own left padding, in WbHome.css. Past 99 this prints
          three characters and the column is 2ch, so the hundredth signature
          borrows one character of the 12px gap beside it — measured, invisible,
          and the alternative is a third column of air on every row for two
          years. */}
      <span className="wb-entry-num">{String(n).padStart(2, "0")}</span>
      <span className="wb-entry-name">{e.name}</span>
      <span className="wb-entry-note">{e.note}</span>
      <span className="wb-entry-date">{formatDate(e.signed_at)}</span>
    </div>
  );
}

/* ═══ [G1 2026-08-06] THE ROW IS AS TALL AS THE TALLEST SIGNATURE, MEASURED ═══
   MIKE: **"THE GUESTBOOK ROWS ARE TOO TALL. I would accept a few pixels; this is
   far more. Can the wrap be kept at the OLD height? If not, BY HOW MUCH are the
   current entries missing a no-wrap fit today — state the number. Then fix to
   the tightest honest option."**

   THE TWO ANSWERS, MEASURED ON THE BUILT BUNDLE AT 1920px:
     · CAN THE WRAP BE KEPT AT THE OLD 30px? NO. A genuinely two-line row is
       37.11px composed — 5px of padding, two 15.552px line boxes, a 1px rule —
       so 30px is 7.11px short of one.
     · BY HOW MUCH ARE THE CURRENT ENTRIES MISSING A NO-WRAP FIT? **They are not.
       The longest signature in the book — James E, 89 characters — sets in
       614.77px inside a 677.77px column. It clears one line by 63.00px**, about
       nine characters. Not one of the six wraps at desktop.
   SO THE QUESTION DOES NOT BIND, AND THE 52px ROW IS RESERVING A SECOND LINE
   NOTHING IS USING. A one-line row composes at 21.55px. That is 30.45px of air
   per signature and 91px across the three-row window, which is the thing he is
   looking at.

   WHY NOT JUST SET A SMALLER NUMBER. Because the second line is not wrong, it is
   unused — L1's ruling stands, and a visitor may still type 88 characters and
   fill it. A hand-set 38px would be right today and would be a hand-set number
   again the moment the type ramp or the budget moves, which is how this file got
   a 52 and a 74 in it.

   SO THE NUMBER IS READ OFF THE BOOK. Every row takes the height of the TALLEST
   row in the book: today that is one line, so the rows are 22px — tighter than
   the 30px he remembers — and the day somebody writes a long one every row
   becomes 38px together. P12's arithmetic is untouched and is the reason this
   can change at all: rows stay uniform BY CONSTRUCTION, so the cap is still a
   whole multiple of `--gb-row` and the stepped scroller still translates in it.
   `rowPx()` reads the property off the element, so the drag follows for free.

   IT IS D1's MECHANISM, SECOND USE. The /wb contents column is measured the same
   way and for the same reason — a row's granted height is not its natural one —
   and the same three rules apply: release, read back, restore inside a layout
   effect so nothing unmeasured is ever painted.

   THE STYLESHEET'S 52 AND 74 STAY, AS THE CEILING. They are the no-JS value and
   the value before the first measurement, and both are ABOVE the worst case
   (37.11 and 67.66), so the book never clips on the way to being right.

   AND MEASURING THE STACKED CASE FOUND L1's OWN BUDGET DERIVED WRONG. Its note
   says 88 characters is "44 characters a line and the block holds 88" — two
   lines at a 310px row. Composed offscreen at 310px, **88 characters take
   THREE**, for every word length tried and for the real 89-character note: text
   wraps at word boundaries, not at column 44. The row is 67.66px, the hard-coded
   74 covers it, and nothing has ever clipped — the number was right by luck
   rather than by the arithmetic that produced it. Measured, it is right by
   construction. (M97 stands: the window would not go below 1228 CSS px, so the
   stacked figures are composed offscreen at the same 310px row rather than read
   off a 390px viewport.) */
/* THE EFFECT OWNS THE PROPERTY OUTRIGHT — IT IS NOT REACT STATE, AND THE FIRST
   CUT MADE IT STATE AND WAS WRONG IN A WAY WORTH RECORDING. Written as
   `useState` + a `style` prop, the measurement wrote `--gb-row` through React
   and then the NEXT measurement released it with `removeProperty`, which wipes
   React's own inline value; the re-measure produced the same number, `setState`
   bailed out on an unchanged value, React never re-rendered, and the property
   stayed gone. The book silently fell back to the stylesheet's 52px ceiling —
   correct-looking, never clipping, and doing nothing. It survived a build and a
   page load and was caught by reading `element.style` on the glass.
   THE RULE IT LEAVES BEHIND: a DOM property that an effect RELEASES cannot also
   be owned by React. One writer. */
function useRowHeight(deps) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (!ref.current) return undefined;
    let live = true;

    const measure = () => {
      const el = ref.current;
      if (!live || !el) return;
      /* ═══ [C 2026-08-13] THE NAME'S COLUMN IS RESERVED, AND IT IS READ OFF
             THE BOOK — THE SAME MECHANISM, ONE COLUMN OVER ══════════════════
         MIKE: "Comments stacked straight, not jagged. Reserve column width for
         the name."

         WHY THEY WERE JAGGED: every `.wb-entry` is its OWN grid, so column 1 is
         `auto` against ONE name. Measured on the live lobby at 1706px, the
         notes began at six different x positions —
             Mo 944 · Tommy 972 · James E 980 · Sammy B 986 ·
             Papa Weird.Baby 1037 · Larry Leibensperger 1054
         — a 110px stagger down a six-row book.

         THE NAME COLUMN IS NOW ONE NUMBER FOR THE WHOLE BOOK: the widest name
         in it, measured. That is G1's own answer to the row height (read the
         number off the book rather than hand-set one) applied to the axis it
         did not cover, and it survives the type ramp and the next long name for
         the same reason.

         RELEASED AND READ IN THE SAME BREATH AS THE HEIGHT, because they are
         one layout: releasing the width changes the note column, which changes
         how a note wraps, which changes the tallest row. Measuring them in two
         passes would measure the height against a width that is about to move.

         SUBGRID WOULD ALSO DO THIS AND IS NOT USED: `.wb-entries` is not the
         rows' grid parent in the stepped scroller (the loop wraps them), so a
         subgrid here would work in the plain list and quietly stop working in
         the one Mike is looking at. */
      /* ═══ [W 2026-08-14] AND THE NUMBER IT READS IS `min-content`, WHICH IS
             MIKE'S SOLUTION AND IS BETTER THAN THE ONE IT REPLACES ══════════
         MIKE: "name column sized to the longest contiguous run of letters, not
         the longest full name, then wrap. Mike's solution, and it makes
         wrapping automatic."

         C's version released the column to `auto` and read the widest WHOLE
         name — `Larry Leibensperger`, 131px — and spent all of it on every row
         of a book whose other five names are half that. His rule spends only
         what cannot be avoided: the column is as wide as the longest
         UNBREAKABLE piece, and anything longer wraps.

         `min-content` IS THAT RULE, COMPUTED BY THE THING THAT ACTUALLY BREAKS
         LINES. Releasing the column to `min-content` and reading a name back
         gives the width of its longest unbreakable run, because that is what
         min-content means. Tokenising the string here with a regex would be a
         second opinion about where text may break — and it would be wrong about
         `Weird.Baby`, hyphens, and every non-Latin script the book will
         eventually meet.
         IT ONLY WORKS BECAUSE THE NAME MAY WRAP. `.wb-entry-name` loses
         `white-space:nowrap` in the stylesheet in the same change; with nowrap
         still on, min-content is the whole name again and this reads exactly
         what `auto` read. The two halves are one change. */
      el.style.setProperty("--gb-row", "auto");
      el.style.setProperty("--gb-name", "min-content");
      let widest = 0;
      for (const nm of el.querySelectorAll(".wb-entry-name")) {
        widest = Math.max(widest, nm.getBoundingClientRect().width);
      }
      /* a reading of zero hands the column back to `auto` — the measurement
         failing must cost alignment, never a name. Same direction as the
         height's fallback below. */
      if (widest > 0) el.style.setProperty("--gb-name", Math.ceil(widest) + "px");
      else el.style.removeProperty("--gb-name");
      /* RELEASE — `--gb-row: auto` makes `.wb-entry`'s `height` auto, so each
         row reports what it actually needs. The cap's `calc()` goes invalid and
         `max-height` falls back to none for the same instant, which is why this
         is a LAYOUT effect: nothing between release and reading is painted. */
      let tallest = 0;
      for (const r of el.querySelectorAll(".wb-entry")) {
        tallest = Math.max(tallest, r.getBoundingClientRect().height);
      }
      /* +1 FOR THE RULE, AND IT IS A CEILING RATHER THAN A CALCULATION. A row's
         1px bottom border is inside its box, except on `:last-child`, which
         drops it — so if the tallest row happens to be the last one the reading
         is 1px short. Adding it unconditionally costs at most one pixel of slack
         on a book whose tallest row is not last, and the safe direction here is
         the one that cannot clip a signature.
         A reading of zero hands the row back to the stylesheet's ceiling rather
         than collapsing the book: the measurement failing must cost slack, never
         a signature. */
      if (tallest > 0) el.style.setProperty("--gb-row", Math.ceil(tallest) + 1 + "px");
      else el.style.removeProperty("--gb-row");
    };

    measure();
    /* the type is a web font, and a row measured before it lands is a row
       measured in the fallback's metrics. `fonts.ready` is the platform's own
       signal (Doctrine 8). */
    if (document.fonts?.ready) document.fonts.ready.then(measure).catch(() => {});
    /* the note column is `1fr`, so its width — and therefore its line count —
       is a function of the window. */
    window.addEventListener("resize", measure);
    return () => { live = false; window.removeEventListener("resize", measure); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

/* The plain window — the fallback described above, and nothing selects it. */
function GuestBookPlain({ entries }) {
  const ref = useRowHeight([entries]);
  return (
    <div className="wb-entries" ref={ref}>
      {entries.map((e, i) => <GuestRow e={e} n={entries.length - i} key={i} />)}
    </div>
  );
}

/* the platform's own signal, read live rather than once: a reader can change
   the setting without reloading the lobby, and the book should notice. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return reduced;
}

/* [Q1] the other platform signal this book was ignoring. A hidden tab throttles
   timers and stops producing frames, which is exactly the asymmetry that emptied
   the book; it is also, on its own terms, the right answer — a book nobody is
   looking at has no reason to be advancing. */
function usePageVisible() {
  const [shown, setShown] = useState(true);
  useEffect(() => {
    const read = () => setShown(!document.hidden);
    read();
    document.addEventListener("visibilitychange", read);
    return () => document.removeEventListener("visibilitychange", read);
  }, []);
  return shown;
}

function GuestBook({ entries }) {
  const n = entries.length;
  const reduced = useReducedMotion();
  const shown = usePageVisible();
  /* `pos` is in ROWS and may stand one whole copy past the top; `snap` turns the
     transition off for the single frame that carries the wrap. */
  const [pos, setPos] = useState(0);
  const [snap, setSnap] = useState(false);
  const [held, setHeld] = useState(false);
  /* [P3] `drag` is where a HAND is holding the book — fractional rows, and null
     whenever nobody is touching it. `nudge` counts manual inputs and exists
     only to be a dependency: bumping it restarts the rest below. */
  const [drag, setDrag] = useState(null);
  const [nudge, setNudge] = useState(0);
  /* [G1 2026-08-06] the measured row height — see `useRowHeight`. `boxRef` is
     the hook's ref now rather than a second one: `rowPx()` below reads
     `--gb-row` off this same element, so the drag inherits the measurement with
     no second author of the number, which is what P3's note insists on. */
  const boxRef = useRowHeight([entries]);
  const grip = useRef(null);
  /* `n > VISIBLE` is belt to `SCROLL_MIN`'s braces: a window that already holds
     the whole book has nothing to travel, and the floor is a tuning number that
     somebody will move one day. */
  const running = n >= SCROLL_MIN && n > VISIBLE && !reduced;

  /* GUARANTEE 2 — the track is long enough for the clamp below, at any n. */
  const copies = n > 0 ? 1 + Math.ceil(VISIBLE / n) : 1;
  /* GUARANTEE 1 — nothing that happened while the page was not being rendered
     can move the track past one whole copy. This is the line that makes a blank
     row unreachable; everything else only makes it unlikely.
     [P3] A HAND IS THE SECOND AUTHOR OF THIS NUMBER and gets the same clamp,
     applied in `onHand` before the drag is ever rendered. */
  const base = Math.min(Math.max(pos, 0), n);
  /* fixed rather than raw: a fractional offset goes into `calc()`, and a number
     that reaches exponent notation on its way there is a transform that does
     not parse. Three places is a twentieth of a pixel at this row height. */
  const shift = (drag == null ? base : drag).toFixed(3);

  /* the rest, then the step. It does not run while a reader is on the book,
     while a hand is holding it, while the page is hidden, or while the track is
     standing on the seam waiting to wrap.
     [P3] `nudge` is in the dependency list and is read nowhere: a manual input
     bumps it, the effect tears down and re-arms, and the book waits one full
     REST_MS from the last thing the visitor did. That is "it resumes after a
     rest" expressed as a dependency rather than as a second clock — and Q1 is
     the reason a second clock was not an option. */
  useEffect(() => {
    if (!running || held || drag != null || !shown || pos >= n) return;
    const t = setTimeout(() => { setSnap(false); setPos(p => p + STEP); },
      REST_MS);
    return () => clearTimeout(t);
  }, [running, held, drag, shown, pos, n, nudge]);

  /* the wrap's backstop. `transitionend` is the primary and this is what makes
     a dropped one cost a frame instead of the whole book. It runs even while
     `held`, because the seam's pixels are identical to the top's — wrapping
     under a reader's cursor is invisible, and NOT wrapping is the bug. */
  useEffect(() => {
    if (!running || pos < n) return;
    const t = setTimeout(() => { setSnap(true); setPos(0); },
      MOVE_MS + WRAP_SLACK_MS);
    return () => clearTimeout(t);
  }, [running, pos, n]);

  /* the wrap. Once the move has finished, a track standing on the duplicate of
     the first row returns to the first row — same pixels, no transition, so the
     swap cannot be seen. Idempotent: after it, `pos < n`. */
  function onSettled(e) {
    /* only the track's own transform — `transitionend` bubbles, and a row that
       ever grows a transition would otherwise fire the wrap mid-step. */
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (pos >= n) { setSnap(true); setPos(0); }
  }

  /* [P3] THE ROW HEIGHT IS READ OFF THE STYLESHEET, never mirrored here. The
     transform is written in `--gb-row` units, so a drag measured in the same
     unit tracks the hand exactly BY CONSTRUCTION; a constant in this file would
     be a second source for the one quantity both halves depend on, and it would
     be wrong the first time the row's type size changes. Zero means the unit
     could not be read, and then there is no drag — the book does not guess its
     own row height. */
  function rowPx() {
    if (!boxRef.current) return 0;
    const v = parseFloat(getComputedStyle(boxRef.current).getPropertyValue("--gb-row"));
    return Number.isFinite(v) && v > 0 ? v : 0;
  }

  function onGrab(e) {
    if (!running || e.button > 0) return;
    const px = rowPx();
    if (!px) return;
    grip.current = { id: e.pointerId, y: e.clientY, from: base, raw: base, px, moved: false };
    /* capture, so a hand that leaves the 92px box still owns the gesture */
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* not capturable */ }
    setDrag(base);
  }
  function onHand(e) {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    /* up is forward — the paper goes the way the hand goes */
    const rows = (g.y - e.clientY) / g.px;
    if (Math.abs(rows) > 0.1) g.moved = true;
    /* GUARANTEE 1, same expression, applied to the hand */
    g.raw = Math.min(Math.max(g.from + rows, 0), n);
    setDrag(g.raw);
  }
  function onLetGo(e) {
    const g = grip.current;
    if (!g || g.id !== e.pointerId) return;
    grip.current = null;
    setDrag(null);
    /* the transition comes back in the same render the target changes in, so
       the release IS the bounce — the settle to the nearest signature uses the
       one easing the timer uses, which is what "keep the stepped bounce" means
       when a hand is doing the stepping. Landing on `n` hands the seam to the
       wrap machinery that was already there. */
    setSnap(false);
    setPos(Math.min(Math.max(Math.round(g.raw), 0), n));
    if (g.moved) setNudge(k => k + 1);
  }
  function onArrow(e) {
    if (!running) return;
    const by = e.key === "ArrowDown" ? STEP : e.key === "ArrowUp" ? -STEP : 0;
    if (!by) return;
    e.preventDefault();
    setSnap(false);
    setPos(Math.min(Math.max(base + by, 0), n));
    setNudge(k => k + 1);
  }
  /* hover pauses for a MOUSE and only a mouse: a touch synthesises enter/leave
     on most mobile browsers, and a book frozen under the finger that just
     dragged it is the bug that would have shipped with the old handlers. */
  function onHover(e, on) { if (e.pointerType === "mouse") setHeld(on); }

  if (!running) return <GuestBookPlain entries={entries} />;

  return (
    <div className="wb-entries wb-entries-scroll" ref={boxRef}
      tabIndex={0} role="group" aria-labelledby="wb-book-label"
      onPointerEnter={e => onHover(e, true)} onPointerLeave={e => onHover(e, false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
      onKeyDown={onArrow}
      onPointerDown={onGrab} onPointerMove={onHand}
      onPointerUp={onLetGo} onPointerCancel={onLetGo}>
      <div className="wb-scroll-track"
        style={{ transform: `translateY(calc(var(--gb-row) * -${shift}))`,
                 transition: (snap || drag != null) ? "none" : undefined }}
        onTransitionEnd={onSettled}>
        {/* the same signatures, as many times as the arithmetic asks for —
            announcing the museum's guest book twice would be a defect dressed
            as an animation, so every copy after the first is hidden. */}
        {Array.from({ length: copies }, (_, c) => (
          <div className="wb-scroll-half" key={c}
            aria-hidden={c > 0 ? "true" : undefined}>
            {/* [C 2026-08-13] every copy carries the SAME numbers, because a
                copy is the same six signatures going past again — a loop that
                counted 7, 8, 9 on the second pass would be inventing people. */}
            {entries.map((e, i) => <GuestRow e={e} n={entries.length - i} key={i} />)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WbHome() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("lobby");
  /* [M2 2026-08-03] MIKE: "THE HOMEPAGE ALWAYS starts clean at the top, every
     time — that's our space and we keep it neat." `always`, where every other
     room in the museum resets only on the first visit of a session. */
  useArrival("lobby", { always: true });
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "/", referrer: document.referrer || "" }),
    }).catch(() => {});
    fetch("/api/guestbook")
      .then(r => r.json())
      .then(data => { setEntries(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (!name.trim()) return;
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), note: note.trim() }),
    });
    if (res.ok) {
      const updated = await fetch("/api/guestbook").then(r => r.json());
      setEntries(Array.isArray(updated) ? updated : []);
      setSubmitted(true);
    }
  }

  return (
    <>

      <div className={`wb-root ${visible ? "visible" : ""}`}>
        <div className="wb-left">
          <img src="/WeirdBaby_PhotoID.png" alt="Weird.Baby" className="wb-logo" />
          <div className="wb-subtitle">{SUBTITLE}</div>
          {/* [2026-08-11] THE TAGLINE IS GONE. MIKE'S RULING, and it was the
              second not-open-yet claim on the screen: a blinking
              "SOMETHING IS BEING BUILT HERE" under the wordmark, about 200px
              from the new note's "The museum is open." A room cannot be open
              on the right and under construction on the left. Named once here
              and in docs/MUSEUM_LOBBY_OPENS_LOG-20260811.md; `.wb-tagline` and
              its `blink` keyframes went with it — they had no other user. */}
          <nav className="wb-directory" aria-label="Museum directory">
            <div className="wb-dir-label">Directory</div>
            {/* Hunter Root delisted 2026-07-07 (Mike's direction); /hr live
                but unlinked.
                [W9 2026-08-02 amendment] The route stays live and unlisted,
                but NOTHING points at it any more: the WAL wing's pointers to
                /hr were removed per Mike (the HR museum concept was never
                approved and is history). Hunter Root is a WORTH A LISTEN
                artist served from our own vault; his door out is his own
                site. /hr remains reachable only by URL, as an archive. */}
            {/* ═══ [2026-08-26] A CONTRADICTION THIS ROUND FOUND AND DID NOT
                RESOLVE — READ IT BEFORE TRUSTING THE PARAGRAPH BELOW ════════
                M8's note says the four names it set are **Mike's verbatim**.
                `provenance/register.json` classes the same four strings
                **HOUSE** — functional chrome, which requires no origin at all.
                Only `Weird.Baby Foundation` was ever classed MIKE, and it
                carries his N1 quote.

                BOTH CLAIMS ARE IN THIS TREE AND THEY CANNOT BOTH BE RIGHT.
                `provenance/README.md §4.1` names the hole that lets it stand:
                *"It cannot verify that a declaration is true… MIKE on a row is
                a claim by whoever wrote the row."* HOUSE needs no source, so
                the same hole runs the other way and a row of his sits in it
                unremarked.

                IT IS LEFT OPEN ON PURPOSE. Today's ruling is Mike's beyond
                doubt — he wrote the shape himself — so the four rows below are
                declared MIKE from here on, and the question of what their
                PREDECESSORS were is a separate one that only he can answer.
                Ops did not answer it by overwriting the evidence.

                [M8 2026-08-03] THE DIRECTORY NAMES THE EXHIBITS PROPERLY.
                Mike's list, as M8 recorded it: Weird.Baby Robots · Weird.Baby
                Music · Other Music Worth a Listen · Information Booth. **The
                first three of those strings are retired as of 2026-08-26** and
                are named here once, which is where a retired string is named.
                WHAT THE OLD NAMES WERE DOING WRONG. "Robots" and "Weird.Baby"
                were ROUTE names wearing a directory's clothes: a stranger
                reading the board could not tell that the first two are the
                house's OWN work and the third is other people's, which is the
                single most useful fact a museum directory can carry. "Worth A
                Listen" named the standard and not the contents. And a lobby
                board with an entry called "Weird.Baby" directly under a
                Weird.Baby wordmark reads as "the site", not "a room in it".
                The order is Mike's order and it says the same thing the names
                do — ours, ours, theirs, then the desk. The shop keeps the end
                of the board: it is not an exhibit and was not in his list.
                A directory entry is still one line and one route (WAL's own
                note below); only the words changed. */}
            {/* Robots live link — §D2 ruling 2026-07-23 (coming-soon retires).
                STAGED: reaches the public site only when Mike deploys (D7). */}
            {/* [CH6 2026-08-12] THE ROW GOES WITH THE WING. Until Record 001
                announces it, `/robots` renders this Lobby — so a directory line
                pointing at it would be a control that appears to do something
                and returns the visitor to the page they are standing on. That
                is the dead control Doctrine 11's corollary forbids, and it is
                worse than absence because it looks like a room. */}
            {/* ═══ [2026-08-26] THE BACKSLASH — MIKE'S RULING, AND IT IS HIS
                WORDS THAT CHANGED, NOT OPS' STYLING OF THEM ═════════════════
                MIKE, verbatim, on how the museum refers to itself:

                  "Lobby Directory (and everywhere) - this is how to refer to
                   Weird.Baby:
                     Weird.Baby
                     Weird.Baby \Robots
                     Weird.Baby \Music
                     Weird.Baby \Foundation
                     etc.
                     \Robots
                     \Music
                     \Foundation
                     etc."

                RULED THE SAME DAY, on a census that found EIGHT forms of the
                Robots wing's name in use at once and four of six rooms where
                the board and the door disagreed:
                  1. THE FULL FORM IS `Weird.Baby \Wing`; THE SHORT FORM IS
                     `\Wing`. Both are his.
                  2. THE TITLE BARS CARRY THE SHORT FORM — `\ROBOTS`, `\MUSIC`,
                     `\FOUNDATION`, `\WORTH A LISTEN`.
                  3. /wal TAKES THE HOUSE NAME LIKE EVERY OTHER WING:
                     **"Weird.Baby \Worth a Listen"**, and the lowercase `a` is
                     his — it is the casing `house-copy.js`'s AFFILIATION
                     already carries in his own sentence.

                ═══ [2026-08-27] AND POINT 3 IS REVERSED. THE BOARD TAKES THE
                SHORT FORM ON ALL FOUR ROWS — MIKE'S RULING ═══════════════════
                **"RENAME 'Weird.Baby \Worth a Listen' to '\Worth a Listen'. In
                the directory, all of the '\' should line up vertically."** And
                the reasoning, which is the substance and not the instruction:
                **"\Worth a Listen is parallel to \Music in this context."**

                **THIS IS A REVERSAL, NOT A CORRECTION.** `f366d37` carried out
                his ruling of 2026-08-26 exactly as he gave it — *"/wal TAKES
                THE HOUSE NAME… Every wing takes it"* — and the board read
                `Weird.Baby \Worth a Listen` because he said so. He has now
                ruled the other way for the board, and both rulings are his.
                Nothing here is Ops improving on either.

                **THE FULL FORM IS NOT RETIRED.** Point 1 stands whole: the two
                forms are still `Weird.Baby \Wing` and `\Wing`, both his. What
                moved is which form THIS SURFACE takes.

                **THE HOUSE IS NAMED ONCE, ABOVE — AND THAT IS WHAT ALIGNS THE
                BACKSLASHES.** The wordmark sits at the head of this column
                (`.wb-logo`, `alt="Weird.Baby"`), so repeating `Weird.Baby` down
                four consecutive rows under it named the house five times on one
                screen. With it named once, the four rows are the same kind of
                thing starting in the same place — which is what puts the four
                backslashes on one vertical, with no rule doing it. **The
                alignment is a consequence of the naming, not a layout applied
                on top of it**; F7's indent is gone for the same reason, and its
                block below says so.

                M8's ARGUMENT SURVIVES AND IS WHY THIS IS NOT A LOSS. His board
                had to let a stranger tell whose work each room holds, and the
                ORDER is what carries that — ours, ours, theirs, then the desk.
                The order is untouched. What the board no longer does is repeat
                the house's name to say it, which the wordmark above already
                said. Verified on disk rather than in the editor, per §8:
                exactly one backslash in each of the four labels.

                THE SHOP AND THE DESK ARE NOT TOUCHED, AND THAT IS AN OPS
                READING OF "every wing", FLAGGED FOR HIS WORD. His own M8 list
                is the evidence: *"Weird.Baby Robots · Weird.Baby Music · Other
                Music Worth a Listen · Information Booth"* — the booth is in his
                list and takes no house name, and the shop was never in it
                ("it is not an exhibit and was not in his list"). The Foundation
                is a WING (D7/M62); the shop is a shop and the booth is the
                desk. One word from him puts either into the shape.

                N1'S RULING IS UNTOUCHED AND IS WHY THIS LINE HAS NO ARTICLE.
                *"Directory loses 'The'"* — no board row gains one back. */}
            {ROBOTS_OPEN && (
              <button className="wb-dir-entry" onClick={() => navigate("/robots")}>
                <span>\Robots</span><span className="wb-dir-arrow">→</span>
              </button>
            )}
            {/* [L1 2026-08-06] THE RECORD IS OFF THE BOARD. MIKE: it is clutter
                here; visitors find it in Robots.
                WHAT THE ROW WAS, so nobody rebuilds it by accident. R1 gave it
                directory-level billing on the argument that the Record is the
                one thing in the wing that keeps happening and a board listing
                rooms only would never say so. That argument is not refuted —
                it is outweighed, by his own reading of the board: it was the
                only line here that was not a room, and a lobby directory that
                lists one wing's contents invites the next four.
                THE ADDRESS SURVIVES. `/robots/record` is still a route
                (App.jsx) and still opens the wing with the Record selected —
                the door is not bricked up, it is off the board. */}
            <button className="wb-dir-entry" onClick={() => navigate("/wb")}>
              <span>\Music</span><span className="wb-dir-arrow">→</span>
            </button>
            {/* [WAL 2026-08-02] listed exactly like the others: same button,
                same arrow, same navigate call. A new exhibit is one entry here
                and one route, which is the whole point of the machinery being
                shared.
                [F7 2026-08-05] MIKE: INDENT THIS ONE. It is the only entry on
                the board that begins with the word "Other", and the word is
                doing work the flush-left list was flattening: the first two
                lines are the house's own, this one is everybody else's, and M8
                built the ORDER to say that while leaving the two kinds sitting
                on the same margin. An indent is the plainest way a board says
                "and also these" — it makes the relationship visible at a glance
                instead of asking a stranger to infer it from a word.
                THE ARROW STAYS ON THE RIGHT EDGE and only the label moves, so
                the column of arrows down the board is unbroken. Indenting the
                whole button would have taken its rule and its arrow with it and
                read as a broken row rather than a nested one. */}
            {/* ═══ [2026-08-26] AND THE INDENT'S STATED REASON IS NOW GONE.
                FLAGGED, NOT FIXED ══════════════════════════════════════════
                F7's argument for `wb-dir-entry-sub` was that this was **"the
                only entry on the board that begins with the word 'Other'"**,
                and that the indent made visible what M8's ORDER was saying —
                *"the first two lines are the house's own, this one is
                everybody else's."*

                MIKE'S 08-26 RULING TOOK THE WORD "Other" OFF THE BOARD. The
                distinction the indent was drawing stopped being one the board
                draws anywhere else — and the room it points at still holds
                other people's records, which is the fact F7 wanted visible.

                THE INDENT STAYED, FLAGGED, BECAUSE HE HAD RULED THE NAME AND
                NOT THE LAYOUT, and Ops does not take a visible decision of his
                off the glass on an inference.

                ═══ [2026-08-27] AND HE HAS NOW RULED THE LAYOUT ══════════════
                **"In the directory, all of the '\' should line up
                vertically."** A row indented by 14px does not line up with the
                three that are not, so `wb-dir-entry-sub` is gone from this
                button and its rule is gone from `WbHome.css`, where the reason
                is written out.

                **THE FLAG CLOSED ON AN ANSWER, WHICH IS THE ONLY WAY A FLAG OF
                THIS KIND MAY CLOSE.** A later round finding an old flag and
                deciding it had waited long enough would be the inference this
                one refused to make.

                **AND HIS REASONING IS WHY THE INDENT IS NOT REPLACED BY A
                SMALLER ONE.** *"\Worth a Listen is parallel to \Music in this
                context."* Parallel is the whole instruction: the four rows are
                one kind of thing, so they start in one place. F7's argument was
                that this row is a DIFFERENT kind of thing and should say so by
                sitting apart; that argument is not refuted, it is overruled.
                M8's ORDER still carries it — ours, ours, theirs, then the desk
                — and the order is untouched. */}
            <button className="wb-dir-entry" onClick={() => navigate("/wal")}>
              <span>\Worth a Listen</span><span className="wb-dir-arrow">&rarr;</span>
            </button>
            {/* [N1 2026-08-04] THE BOOTH LEAVES THIS POSITION — see the note at
                the foot of the board, where it now stands. */}
            {/* [F3 2026-08-03] THE WEIRD.BABY FOUNDATION — Mike's new section.
                WHY IT SITS HERE AND NOT WITH THE EXHIBITS. M8 fixed this board
                by making the names say what kind of thing each entry is, and
                the ORDER carry the same information: ours, ours, theirs, then
                the desk, then the shop. The Foundation is not an exhibit —
                there is nothing in it to look at that was collected — so it
                cannot join the first three without breaking the reading M8
                built. It belongs beside the Information Booth, because they are
                the two rooms where the house explains itself: the booth answers
                what this place IS, the Foundation answers what it is FOR and
                where the money goes. Booth first, since a stranger asks what
                before they ask why.
                The shop keeps the end of the board, as M8 left it.
                [R1 2026-08-03] THIS LINE READ "Where the Money Goes" FOR ONE
                COMMIT and is restored. C2 rewrote it on a reading of Mike's
                words that he has since ruled an over-read — he asked not to
                incur legal work, not to be given a different room. The name he
                wrote is the name on the board.
                [N1 2026-08-04] AND IT LOSES ITS ARTICLE. Mike: "Directory loses
                'The': Weird.Baby Robots, Weird.Baby Music, Weird.Baby
                Foundation." Two of the three already read that way — this was
                the only line on the board carrying an article, and it read as
                the odd one out precisely because M8's other names do not.
                THE ROOM'S OWN NAME IS UNTOUCHED. The instruction was about the
                DIRECTORY, and the Foundation's page, its title bar and its
                heading still say what they said. A board is a list of where
                things are; the door still carries the full name. */}
            <button className="wb-dir-entry" onClick={() => navigate("/foundation")}>
              <span>\Foundation</span><span className="wb-dir-arrow">→</span>
            </button>
            <button className="wb-dir-entry" onClick={() => navigate("/shop")}>
              <span>Gift Shop</span><span className="wb-dir-arrow">→</span>
            </button>
            {/* [N1 2026-08-04] THE INFORMATION BOOTH TAKES THE BOTTOM OF THE
                BOARD. MIKE: "INFO BOOTH MOVES TO THE BOTTOM of the directory so
                it stands out."
                IT WAS FOURTH OF SIX — the position M8 gave it, reading "ours,
                ours, theirs, then the desk", with the Foundation and the shop
                after it. That reading was sound and it had a cost: the one
                entry on the board that answers "what IS this place?" sat in the
                middle of a list, wearing the same weight as the rooms either
                side of it, where a stranger scanning a directory reads the ends.
                LAST IS THE OTHER END, and on a board this short the last line is
                as exposed as the first — with the difference that the first
                belongs to the house's own work, which is what a visitor came
                for. The desk is where they go when the rooms did not answer it.
                THE EXHIBIT ORDER IS UNCHANGED under it: ours, ours, theirs,
                then the Foundation, then the shop. Only the desk moved. */}
            <button className="wb-dir-entry" onClick={() => navigate("/booth")}>
              <span>Information Booth</span><span className="wb-dir-arrow">→</span>
            </button>
          </nav>
        </div>

        <div className="wb-right">
          {/* ═══ [2026-08-11] THE LOBBY OPENS, AND THE NOTE IS THE PROMISE ═══
              MIKE'S RULING, his two sentences: *"The museum is open. A new
              Record every day for ninety days."*

              WHAT WENT, VERBATIM, because a deleted line is named once and the
              round log is where: *"We're not open yet. / But you found us — /
              which means something. / The people who sign the guest book now /
              will be remembered differently / than the ones who come later."*

              IT IS NOT A REWORDING, IT IS A DIFFERENT PROMISE. The old note
              paid the visitor for arriving early and had nothing to offer them
              for coming back; a museum that is open owes them a reason to
              return instead, and the ninety days is that reason. The guest book
              beneath is untouched — it was never the thing that made the room
              worth arriving at.

              [2026-08-11, RULED] THE SENTENCE IS THE DOOR. A3/A4 reported that
              nothing on this board pointed at the Record and that the cheapest
              honest fix was one word, not a new object. Mike ruled exactly
              that: *"the cheapest honest fix. No banner, no button, no board
              row reversed. One word, one link."*
              IT DOES NOT REVERSE L1. L1 struck a DIRECTORY ROW under Weird.Baby
              Robots ("it is clutter here") and the directory is untouched — six
              rooms, same six. What changed is that a promise which already
              names a thing now opens it. The link is styled as prose, not as a
              call to action, for the same reason: a button here would be the
              object L1 refused wearing a different coat. */}
          {/* ═══ [CH6 2026-08-12] THE SWAP IS ITSELF A SCRIPTED EVENT ════════
              MIKE: the lobby reverts to the early-visitor wording until 001,
              then becomes "The museum is open. A new Record every day for
              ninety days." Both halves are his; only which one is on the glass
              moves, and it moves with the wing rather than on a date of its own
              (`ROBOTS_OPEN`, src/lib/wing-open.js).
              THE EARLY WORDING IS RESTORED VERBATIM FROM `1e45ae2^`, not
              retyped from the round log's summary of it — the log recorded that
              the sentence was replaced and quoted only its first line, and a
              paraphrase of Mike's own words back onto his own lobby is the
              failure the verbatim rule exists to stop.
              AND THE OPEN WORDING'S LINK IS THE REASON THIS IS CONDITIONAL AT
              ALL: it points at `/robots/record`, which renders the Lobby until
              001. Announcing a daily Record and linking to the page the visitor
              is already on would be the museum contradicting itself twice in
              one sentence. */}
          {/* ═══ [C 2026-08-13] THE OPEN WORDING IS MIKE'S NEW SENTENCE ═══════
              MIKE: "NOW copy: approved, no change. LAUNCH copy swaps Sunday
              night: 'Welcome. The first 100 people who sign the guest book will
              be remembered differently than the ones who come later.'"
              The not-open-yet half below is untouched to the character, which is
              what "approved, no change" means.

              WHAT LEAVES WITH THE OLD SENTENCE, NAMED ONCE: "The museum is
              open. A new Record every day for ninety days.", and the `/robots/
              record` link inside it — the only prose door to the Record on this
              board. CH6's note says that link is why the wording was made
              conditional at all. It is no longer why: the wording is still
              conditional because Mike wrote two different sentences for the two
              sides of Sunday night, which is a better reason than a broken
              link was.
              `wb-note-link` is now used by nothing on this page. It is left in
              the stylesheet rather than swept, because the room is re-walked
              Sunday and a class deleted in the same hour as the sentence that
              used it is two changes to unpick if he wants the door back.

              THE THRESHOLD IS UNCHANGED. `ROBOTS_OPEN` is the wing's own switch
              (src/lib/wing-open.js), derived from the Record and read by the
              worker at request time, and Sunday night is when it turns. Nothing
              here counts to 100 — "the first 100" is a promise in his copy, and
              what happens AT 100 is his own TBD, deliberately not built. */}
          {/* [2026-08-16] THE COUNTDOWN SITS ABOVE THE NOTE, and it is rendered
              unconditionally rather than inside the `ROBOTS_OPEN` branch. That
              is the point: `ROBOTS_OPEN` is a module-load const, so in a tab
              left open across midnight it still reads false — and the countdown
              must remove itself on the museum's clock, not on that const. The
              component decides for itself and returns null once the doors are
              open, so an already-open museum renders exactly what it rendered
              before this existed. */}
          <Countdown />
          {ROBOTS_OPEN ? (
            <p className="wb-note">
              Welcome.<br /><br />
              The first 100 people who sign the guest book<br />
              will be remembered differently<br />
              than the ones who come later.
            </p>
          ) : (
            <p className="wb-note">
              We&apos;re not open yet.<br />
              But you found us —<br />
              which means <em>something.</em><br /><br />
              The people who sign the guest book now<br />
              will be remembered differently<br />
              than the ones who come later.
            </p>
          )}
          <div className="wb-rule" />
          <div className="wb-book-head">
            {/* [P3] the id is the moving book's accessible name — it is
                labelled by the heading a sighted reader is already using, so
                the control needs no string of its own. */}
            <span className="wb-book-label" id="wb-book-label">Guest Book</span>
            {!loading && entries.length > 0 && (
              <span className="wb-book-count">
                {entries.length} {entries.length === 1 ? "signature" : "signatures"}
              </span>
            )}
          </div>

          {!submitted ? (
            <>
              {/* [B2 2026-08-02] THE BOOK ASKS TWO QUESTIONS THE SAME WAY.
                  Mike's composition: the note at full width, then the name and
                  the button beneath it on ONE line, each half. P13's caption
                  above the name field is superseded — the reasoning is on
                  `.wb-field` in the sheet above.
                  "SIGN", not "Sign the Guest Book". At half width the long
                  label wrapped to two lines and the row lost its balance, and
                  the short one is not a loss: it sits beside the field it acts
                  on, under a heading that already says Guest Book. Tight,
                  intuitive, low-demand — which is the whole brief. */}
              <div className="wb-form">
                {/* [P13] "(optional)" IS GONE. Mike's call, and it was doing
                    harm: the only two fields on the page were labelled "answer
                    this" and "you don't have to", which is an invitation to
                    skip the half that makes the book worth reading. Nothing
                    enforces it either way — a blank note has always been
                    accepted. */}
                <textarea className="wb-field wb-field-note"
                  placeholder="what brought you here?" value={note}
                  onChange={e => setNote(e.target.value)} maxLength={NOTE_MAX} />
                <div className="wb-form-row">
                  <input className="wb-field" placeholder="what should we call you?"
                    value={name} onChange={e => setName(e.target.value)}
                    maxLength={NAME_MAX} />
                  <button className="wb-submit" onClick={handleSubmit}>Sign</button>
                </div>
              </div>
            </>
          ) : (
            /* [2026-08-11] "Welcome, Founding Visitor." IS STRUCK, and it is
                the third and last not-open-yet claim on this page. It paid a
                visitor for arriving BEFORE the doors opened; the doors are
                open, so it is now either untrue or it makes every visitor for
                ninety days a founder, which is the same as making none of them
                one. Named once, here and in the round log.
                WHAT REPLACED IT IS NOTHING, and that is the decision rather
                than an omission. "You're in the book." is the whole of what
                just happened and is the whole of what a confirmation owes.
                The obvious alternative — a second sentence giving them a
                reason to come back — is a NEW sentence for a lobby whose two
                sentences are Mike's own, and the reason to come back is
                already 200px above it with a door in it now. Ops does not
                invent his voice to fill a gap subtraction opened. */
            <div className="wb-confirmed">You're in the book.</div>
          )}

          {/* [M23b] one book — see the note above `SCROLL_MIN`. */}
          {!loading && entries.length > 0 && <GuestBook entries={entries} />}
        </div>

        {/* [L2 2026-08-05] THE WATERMARK. MIKE: "THE WATERMARK text becomes
            'Weird.Baby'." This corner stamp — the floating WB monogram and the
            wordmark beside it, bottom-right, 0.56rem, gold-mute — is the only
            object in either room he read that answers to the word. M10
            (2026-08-03) was closed CANNOT REPRODUCE for want of a room; it has
            a room now.
            IT WAS SET IN LOWERCASE, which is a third spelling of the house
            name in a building that already spells it two ways for two reasons:
            WEIRD.BABY in caps wherever the signage shouts, Weird.Baby in title
            case wherever it is spoken. `weird.baby` is neither — it is the
            DOMAIN, and a domain is what you type, not what a museum stamps in
            the corner of its own paper.
            THE MONOGRAM IS LEFT ALONE deliberately. Mike named the TEXT; the
            WB in the circle is the mark. It has said the same thing as the
            wordmark since the day it was drawn, so the pairing is not new and
            striking it was not asked for. */}
        <div className="wb-footer">
          <span className="wb-mark">WB</span>
          <span>Weird.Baby</span>
        </div>
      </div>
    </>
  );
}
