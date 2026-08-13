/* ===========================================================================
   THE RECIPE — the format, declared once. [2026-08-13]
   ---------------------------------------------------------------------------
   THE RECIPE IS THE DELIVERABLE AND THE PREVIEW IS NOT. The bench draws a
   recipe so Mike can judge it; something outside the browser turns a recipe
   into a file he posts. Those two readers must never disagree about what a
   recipe IS, so the shape lives here and both import it — the generator bakes
   these values into the page, and a future compiler reads the same module.
   A constant that cannot be imported because it lives inside a tool is the
   defect (Doctrine 22's ONE DECLARATION, EVERY READER); this is the fix.

   ═══ WHAT A COMPILER NEEDS, AND WHY EACH FIELD IS HERE ══════════════════════
   Every one of these exists because a compile step would otherwise have to
   guess, and a guess is a different video.

     · NOTHING IS IN PIXELS except `canvas`. Positions are fractions of the
       ASSET (0..1) and scale is a multiplier, so the same recipe compiles at
       1080x1920 or at 2160x3840 and the framing is identical. A recipe holding
       pixel offsets would be a recipe for one output size, silently.
     · `asset.sha256` IS CARRIED so a compiler can prove it has the bytes the
       recipe was designed against. The path can move; the hash cannot lie.
     · `asset.uid` IS THE DURABLE KEY — the asset table's own row name, minted
       once and never rewritten (C32). A compiler resolves the file through the
       table rather than trusting a path a round may have changed.
     · `fps` IS EXPLICIT. Frame count is `seconds * fps` and a compiler that
       assumed 30 where the bench drew 24 would produce a different motion.
     · `ease` IS A NAME, NOT A CURVE. Both readers implement the same named set
       below; a bezier written into the data would be a second declaration.
     · `audio` IS RESERVED AND NULL. The bench cannot author sound and does not
       pretend to. It is in v1 ON PURPOSE: a compiler written against a format
       with no audio key has to be revised to accept one, and then two versions
       of the format exist. One null field now costs nothing and prevents that.
   =========================================================================== */

export const RECIPE_VERSION = 1;

/* THE OUTPUT SHAPES. `w`/`h` are the compile target; the bench previews at
   whatever fits and never at these sizes, which is why nothing else in the
   format is in pixels. */
export const SHAPES = [
  { key: "9:16", label: "9:16 · Reel",     w: 1080, h: 1920 },
  { key: "4:5",  label: "4:5 · feed",      w: 1080, h: 1350 },
  { key: "1:1",  label: "1:1 · square",    w: 1080, h: 1080 },
  { key: "16:9", label: "16:9 · landscape", w: 1920, h: 1080 },
];

/* NAMED CURVES. The bench and any compiler must implement exactly these, and
   the source is here so "the same easing" is checkable rather than hoped for. */
export const EASES = [
  { key: "linear",     label: "linear" },
  { key: "inOutCubic", label: "ease in-out" },
  { key: "outCubic",   label: "ease out (settles)" },
  { key: "inCubic",    label: "ease in (departs)" },
  { key: "inOutQuad",  label: "ease in-out, gentle" },
];

export const TRANSITIONS = [
  { key: "cut",   label: "cut" },
  { key: "fade",  label: "fade" },
  { key: "flash", label: "flash" },
  { key: "flashbang", label: "flashbang (pop · hold · dissolve)" },
];

/* ═══ [2026-08-13] THE FLASHBANG, AND IT IS AN EXTENSION — SAY SO ═══════════
   Mike approved a set of numbers by eye: lead-in 600 ms, pop 10 ms to full
   white, hold 350 ms blind, dissolve 3000 ms on curve 6.0 slow-then-fast,
   waver 0.5 gentle and decaying, revealing the logo. Total 3.96 s.

   **THE FORMAT AS IT STOOD COULD NOT HOLD THOSE NUMBERS.** `flash` ramps a
   white cover linearly across `seconds` and has no pop, no hold, no curve and
   no waver. Rendering the approved beat therefore needed the format to grow,
   and it grows HERE rather than inside the compiler — one declaration, every
   reader (Doctrine 22), so the bench, the compiler and any future tool cannot
   disagree about what a flashbang is.

   THE PHASES ARE SEQUENTIAL AND ADDITIVE, which is what makes the total come
   out at Mike's own 3.96 s: lead-in (the previous block's `seconds`) + pop +
   hold + dissolve. The block carrying the flashbang has
   `seconds = pop + hold + dissolve`, and the transition owns all of it.

   `curve` IS THE EXPONENT ON THE REVEAL and 6.0 is slow-then-fast: the white
   cover's alpha is `1 - u^curve`, so at the halfway point of a curve-6
   dissolve the frame is still 98% white and almost all of the reveal happens
   in the last third. `curve: 1` would be a plain linear fade.

   `waver` IS AN AMPLITUDE AND ONLY AN AMPLITUDE — 0..1, where Mike's 0.5 means
   "gentle". **A frequency and a decay law are NOT in his numbers**, so they are
   Ops' and are declared here as constants rather than buried: three cycles
   across the dissolve, amplitude `waver * WAVER_PEAK`, decaying as `(1-u)^2`.
   If he wants it faster or slower those two constants are the dial. */
export const WAVER_CYCLES = 3;      /* oscillations across the dissolve */
export const WAVER_PEAK = 0.06;     /* alpha swing at waver = 1.0 */

export const FLASHBANG_DEFAULT = {
  type: "flashbang",
  pop: 0.010,        /* seconds, to full white */
  hold: 0.350,       /* seconds, blind */
  dissolve: 3.000,   /* seconds, white -> the frame beneath */
  curve: 6.0,        /* exponent; >1 is slow-then-fast */
  waver: 0.5,        /* 0..1 amplitude */
};

/** the frames a flashbang occupies, and what its white cover's alpha is at any
 *  one of them. THE ONE PLACE THIS CURVE IS DEFINED. */
export function flashbangAlpha(fb, tInBlock) {
  const pop = fb.pop ?? 0, hold = fb.hold ?? 0, dis = fb.dissolve ?? 0;
  if (tInBlock < pop) return pop > 0 ? tInBlock / pop : 1;       /* rising to white */
  if (tInBlock < pop + hold) return 1;                            /* blind */
  const u = dis > 0 ? Math.min(1, (tInBlock - pop - hold) / dis) : 1;
  const base = 1 - Math.pow(u, fb.curve ?? 1);
  const w = (fb.waver ?? 0) * WAVER_PEAK
    * Math.sin(2 * Math.PI * WAVER_CYCLES * u) * Math.pow(1 - u, 2);
  return Math.max(0, Math.min(1, base + w));
}

export const FIT = [
  { key: "cover",   label: "fill the frame (crops)" },
  { key: "contain", label: "fit inside (letterbox)" },
];

/* THE DEFAULTS ARE A GENTLE PUSH-IN, and that is a judgement worth stating:
   Mike's note was "the ingredient settings all need tweaked", so a new block
   should already be a move he can watch rather than a still he has to animate.
   1.00 -> 1.12 over 2.5s reads as deliberate at 9:16 without drifting.

   ═══ AND `in` IS A CUT, WHICH THE FIRST BUILD GOT WRONG ═════════════════════
   It defaulted to a 0.2s FADE, and a fade's first frame is by definition fully
   black. The bench opens at frame 0 and Home returns to frame 0, so the tool's
   entire first impression was a black rectangle — measured, not guessed: centre
   luma ran 0 -> 42 -> 126 -> 209 -> 252 across the six fade frames, so the fade
   was perfect and the DEFAULT was the defect. **A tool whose opening frame
   looks broken will be reported as broken**, and it very likely already was.
   A fade is now something he adds; showing the picture is what a new block does. */
export const DEFAULT_BLOCK = {
  seconds: 2.5,
  fit: "cover",
  ease: "inOutCubic",
  from: { x: 0.5, y: 0.5, scale: 1.00, rot: 0 },
  to:   { x: 0.5, y: 0.5, scale: 1.12, rot: 0 },
  in:  { type: "cut", seconds: 0 },
  out: { type: "cut", seconds: 0 },
};

export const DEFAULT_FPS = 30;

export function emptyRecipe(name = "untitled") {
  return {
    version: RECIPE_VERSION,
    name,
    fps: DEFAULT_FPS,
    shape: "9:16",
    audio: null,
    blocks: [],
  };
}

/* THE FILE ON DISK. A library rather than a single recipe — he will make more
   than one short, and a tool that holds exactly one makes him copy files by
   hand to keep the last. */
export function emptyLibrary() {
  return {
    _: "THE SHORTS BENCH — Mike's recipes. Written by docs/shorts/shorts.html "
     + "(the Save button). Read by any compile step. Positions are fractions of "
     + "the asset, never pixels; see tools/shorts-recipe.mjs for the format.",
    version: RECIPE_VERSION,
    saved: null,
    recipes: [],
  };
}
