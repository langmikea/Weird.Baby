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
import { useNavigate } from "react-router-dom";
import "./WbHome.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";

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
function GuestRow({ e }) {
  return (
    <div className="wb-entry">
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
      /* RELEASE — `--gb-row: auto` makes `.wb-entry`'s `height` auto, so each
         row reports what it actually needs. The cap's `calc()` goes invalid and
         `max-height` falls back to none for the same instant, which is why this
         is a LAYOUT effect: nothing between release and reading is painted. */
      el.style.setProperty("--gb-row", "auto");
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
      {entries.map((e, i) => <GuestRow e={e} key={i} />)}
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
            {entries.map((e, i) => <GuestRow e={e} key={i} />)}
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
          <div className="wb-tagline">something is being built here</div>
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
            {/* [M8 2026-08-03] THE DIRECTORY NAMES THE EXHIBITS PROPERLY.
                Mike's list, verbatim: Weird.Baby Robots · Weird.Baby Music ·
                Other Music Worth a Listen · Information Booth.
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
            <button className="wb-dir-entry" onClick={() => navigate("/robots")}>
              <span>Weird.Baby Robots</span><span className="wb-dir-arrow">→</span>
            </button>
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
              <span>Weird.Baby Music</span><span className="wb-dir-arrow">→</span>
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
            <button className="wb-dir-entry wb-dir-entry-sub" onClick={() => navigate("/wal")}>
              <span>Other Music Worth a Listen</span><span className="wb-dir-arrow">&rarr;</span>
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
              <span>Weird.Baby Foundation</span><span className="wb-dir-arrow">→</span>
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
          <p className="wb-note">
            We're not open yet.<br />
            But you found us —<br />
            which means <em>something.</em><br /><br />
            The people who sign the guest book now<br />
            will be remembered differently<br />
            than the ones who come later.
          </p>
          {/* [walk-five] "You are early. That is noted." killed — redundant
              with the note above (the book already says what early means). */}
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
            <div className="wb-confirmed">You're in the book. Welcome, Founding Visitor.</div>
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
