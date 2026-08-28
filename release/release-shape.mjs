/* ===========================================================================
   WHAT A RELEASE IS CHECKED AGAINST — one declaration, read by the gate AND by
   anything that later warns. [2026-08-28]
   ---------------------------------------------------------------------------
   THIS FILE IS `reveal/record-shape.mjs` FOR THE OTHER SIDE OF THE LINE, and it
   is that file's shape on purpose: **plain data, no imports, no side effects**,
   so the thing that ENFORCES a rule and the thing that WARNS about it read the
   same line. Its own header states the reason and it applies here unchanged —
   a second copy of a budget is a budget that silently stops agreeing with its
   gate.

   ═══ WHAT A RELEASE IS ═════════════════════════════════════════════════════
   A REEL THAT EXISTS AND IS NOT PART OF THE MUSEUM'S STORY. The Record is
   canon; a release is promotion ABOUT the canon. The line between them is
   one-directional and it is enforced by `tools/release-gate.mjs`, never
   trusted:

     STORY -> RELEASE   ALLOWED. A caption may quote the museum. It is filed
                        RESTATED and carries a pointer at what it restates,
                        which is a claim the gate checks.
     RELEASE -> STORY   FORBIDDEN. No release string, id or platform ref may
                        appear under `src/` or in the built bundle.

   ═══ ONE VIDEO, FOUR SURFACES, FOUR POSTING EVENTS ════════════════════════
   Mike's reels are 9:16, which is what TikTok, Instagram Reels, YouTube Shorts
   and Facebook Reels all want, so ONE video goes to all four UNCUT. A release
   is therefore the VIDEO, and `postings[]` is a list inside it rather than a
   second object — a posting has no existence apart from the video it posts.

   ═══ THE RUN ══════════════════════════════════════════════════════════════
   A single and its reels. Coconuts is a single; E.D. Yahdah is the next one.
   **How Coconuts does informs how E.D. Yahdah is released**, which is the whole
   reason `outcome` exists and the reason a run is a thing at all.
   =========================================================================== */

/* ═══ THE SURFACES — FOUR, AND THE ORDER IS THE POINT ══════════════════════
   [2026-08-28] Mike ruled TikTok in and ruled the ORDER. **This array is
   ordered and the order is load-bearing**, which is the whole reason it is a
   list of objects rather than four strings: a set of names can be reordered by
   anyone tidying an alphabetical list, and nothing would notice.

   **THE ORDER IS DECLARED HERE. THE STRATEGY BEHIND IT IS IN
   `release/README.md`.** A data file is the wrong place to argue a position —
   what belongs here is the fact that the order exists, what each surface IS in
   one line, and enough of the reason that nobody reorders it by accident. The
   case for it, and the warning against treating four surfaces as
   interchangeable, is prose and lives with the prose.

   `is` is the one-line role. `why` is the shortest honest reason. Neither is a
   substitute for the README and both exist so a reader of THIS file cannot
   mistake the order for arbitrary. */
export const SURFACES = [
  { key: "tiktok",
    is: "THE DOOR",
    why: "the only one built to show work to strangers — its algorithm surfaces "
       + "small accounts to new audiences",
    account: { exists: false, handle: null, displayName: null,
      note: "THE ACCOUNT DOES NOT EXIST YET. Mike sets it up. This is a "
          + "PRECONDITION, not a task — nothing here creates it and nothing "
          + "should list it as work." },
    dots: false },

  { key: "instagram",
    is: "THE BRAND",
    why: "where the house looks like itself",
    account: { exists: null, handle: null, displayName: null,
      note: "UNSTATED. Mike has said YouTube and Facebook exist; he has not "
          + "said either way about Instagram, and Ops does not infer it." },
    dots: true },

  { key: "youtube",
    is: "THE ARCHIVE",
    why: "content compounds — a video from two years ago still drives streams",
    account: { exists: true, handle: null, displayName: null,
      note: "The account exists, as Weird.Baby. The HANDLE has never been "
          + "supplied — register M60, open since 2026-08-05." },
    dots: true },

  { key: "facebook",
    is: "LAST",
    why: "it is there because he has an account",
    account: { exists: true, handle: null, displayName: null,
      note: "The account exists, as Weird.Baby. Handle not supplied — M60." },
    dots: true },
];

/** the keys alone, in the ruled order. */
export const SURFACE_KEYS = SURFACES.map(s => s.key);

/** the surface row for a key, or null. */
export function surfaceOf(key) {
  return SURFACES.find(s => s.key === key) || null;
}

/* ═══ THE HANDLE ═══════════════════════════════════════════════════════════
   [2026-08-28] MIKE'S PREFERENCE ORDER, IN HIS ORDER, AND THE CONSTRAINT THAT
   BENDS IT. He wants `Weird.Baby` first. **TikTok does not permit a dot in a
   handle**, so his first preference is unavailable on the surface he ruled
   first — and the resolution is not to drop the dot but to MOVE it:

     THE DOT LIVES IN THE NAME, NOT IN THE HANDLE.

   A handle of `WeirdBaby` or `weirdbaby` with a DISPLAY NAME of `Weird.Baby`
   satisfies his order everywhere it can be satisfied and costs the dot only in
   the one place no platform will carry it.

   **NOTHING IS CHOSEN HERE.** `handle` is null on all four surfaces above: no
   handle has ever been supplied for any platform, which is register M60, open
   since 2026-08-05 — and a handle is not something Ops may invent. This block
   records what he PREFERS and what is POSSIBLE, and the two are not the same
   thing on one of the four. */
export const HANDLE = {
  preferred: ["Weird.Baby", "WeirdBaby", "weirdbaby"],
  constraint: "TikTok does not permit dots in handles.",
  shape: "handle `WeirdBaby` or `weirdbaby`, display name `Weird.Baby`.",
  register: "M60",
};

/* ═══ A POSTING'S STATE ════════════════════════════════════════════════════
   THREE, AND THE MIDDLE ONE IS THE WHOLE REASON THIS IS NOT A BOOLEAN.
   [2026-08-28] Mike: *"THE FIVE COCONUTS VIDEOS ARE UPLOADED AND PRIVATE. Not
   published."* Without `staged` the system cannot tell **nothing exists there**
   from **it exists there and the world cannot see it**, and those are the two
   states the first five rows in this system are actually in. */
export const POSTING_STATES = {
  planned: {
    means: "nothing exists on this surface yet",
    posted: "must be absent",
    outcome: "must be absent",
  },
  staged: {
    means: "the video is on this surface and is NOT public — uploaded, private",
    posted: "must be absent — nothing has gone out",
    outcome: "must be absent — there is nothing to have a number about",
  },
  out: {
    means: "public. The day it went is recorded and never derived",
    posted: "REQUIRED, and it is the day it WENT",
    outcome: "optional, and absent means NOT YET CHECKED",
  },
};

/* ═══ A RELEASE'S PLACE IN ITS RUN ══════════════════════════════════════════
   [2026-08-28] TWO RULINGS, AND THE SECOND IS THE ONE A LATER ROUND WILL WANT
   TO TIDY AWAY.

   `seq`      THE FOUR QUARTERS GO IN ORDER — 1, 2, 3, 4. Mike ruled sequence
              REAL, not cosmetic, so it is a CHECK and not a field: `outOfOrder`
              below refuses a release going public while a lower `seq` in the
              same run has not. A number nothing enforces is a label.

   UNDECIDED  THE FULL REEL HAS NO PLACE YET. His words: *"I don't know. I had
              it, so I included it."* **That is a legitimate state and the
              system holds it rather than forcing a position.** `seq: null`
              says so. **DO NOT GUESS WHERE IT GOES** — it is the sit-down's
              own first question once the quarters have run, and a later round
              that assigns it a number to make a list tidy has answered a
              question Mike explicitly left open. */
export const UNDECIDED = null;

/* ═══ THE CLASSES ══════════════════════════════════════════════════════════
   THE MUSEUM'S OWN, NOT A SECOND DISCIPLINE (Mike's ruling 5). Same five
   letters `provenance/register.json` uses, meaning the same things.

   AND `RESTATED` IS LOAD-BEARING HERE IN A WAY IT IS NOT ANYWHERE ELSE: it is
   what makes the canon gate possible. A caption that quotes the museum has its
   string under `src/` ON PURPOSE, and a gate matching raw strings would fail
   the build on correct work. So the gate matches only what a release declares
   as its OWN — and a RESTATED string is exempt **by carrying a pointer at the
   museum row it came from, which the gate resolves.** Exempt by evidence, not
   by permission. */
export const CLASSES = {
  MIKE: "his own words, verbatim, typos carried",
  VERIFIED: "read off the platform — a number, with the day it was READ",
  DERIVED: "computed from something else in this file",
  HOUSE: "Ops' own sentence, and it must never be read later as his",
  RESTATED: "restates something the museum already says; carries `from` at it",
};

/* ═══ THE HARD RULES ═══════════════════════════════════════════════════════
   Every row names the check that enforces it. A row whose `enforcedBy` says
   "nothing" is a statement about the tree, not a wish — record-shape.mjs's own
   rule, kept. */
export const RULES = [
  { id: "canon-import",
    rule: "No file under `src/` may import from `release/`.",
    why: "`reveal/` is a root directory `src/` imports from FIVE places, JSON "
       + "included. Living outside `src/` proves nothing on its own.",
    enforcedBy: "release:check — canonImports()" },

  { id: "canon-string",
    rule: "No release-originated string may appear as a string literal under "
        + "`src/`. Walked from disk, not from the module graph.",
    why: "The real risk is a caption RETYPED into a Record entry with no import "
       + "at all. `wb-ops-braces` walks from disk for this exact reason: a "
       + "string in a module the bundler tree-shook away is still there.",
    enforcedBy: "release:check — canonStrings()" },

  { id: "restated-resolves",
    rule: "A string filed RESTATED must actually appear at the museum path its "
        + "`from` names.",
    why: "Otherwise RESTATED is a word that turns the gate off. It is an "
       + "exemption by evidence.",
    enforcedBy: "release:check — restatedResolve()" },

  { id: "sequence",
    rule: "A release may not be `out` on any surface while a release with a "
        + "lower `seq` in the same run is not `out` on that surface.",
    why: "Mike, 2026-08-28: the four quarters go in order and 2 cannot precede "
       + "1. Sequence is real, not cosmetic.",
    enforcedBy: "release:check — outOfOrder()" },

  { id: "no-zero",
    rule: "`outcome` is absent until there is something in it. No empty object, "
        + "no empty `readings`, no `null`, no `views: 0` placeholder.",
    why: "Mike: a post without numbers reads as NOT YET CHECKED, never as zero; "
       + "a field nobody fills is worse than no field. `views: 0` therefore "
       + "means a real zero somebody read, which is a different fact.",
    enforcedBy: "release:check — honesty()" },

  { id: "read-date",
    rule: "A reading's `on` is the day the number was READ, never the day it "
        + "was typed in.",
    why: "OPERATIONS §8: any tool that stamps `saved` at the moment of saving "
       + "is answering a question nobody asked it.",
    enforcedBy: "nothing — no gate can tell one date from another. It is "
              + "stated on the field and in release/README.md.",
    silent: true },

  { id: "no-due-date",
    rule: "There is no due date anywhere in this system. `posted` is the day it "
        + "WENT.",
    why: "Mike, 2026-08-28: *We are not going to work backwards.* A calendar "
       + "is the thing this design most wants to grow back into.",
    enforcedBy: "release:check — honesty() refuses a `due` key anywhere" },

  { id: "no-derived-number",
    rule: "Nothing computes a number from two readings. No rate, no total, no "
        + "average, no best-performing, no cross-surface comparison.",
    why: "Mike: *not as a rigid set of specific metrics.* A reading is evidence "
       + "for a conversation, never a score.",
    enforcedBy: "nothing — it is a rule about what may be BUILT, and the day "
              + "something derives one, this row is what it is breaking.",
    silent: true },
];

/* ═══ WHAT IS DELIBERATELY NOT DECLARED ════════════════════════════════════
   NO PER-PLATFORM CAPTION OR TITLE BUDGET. record-shape.mjs carries hard
   numbers because somebody measured them on the museum's own glass. Nobody has
   supplied YouTube's, Instagram's or Facebook's, and Ops inventing three
   numbers that look authoritative is worse than carrying none: Doctrine 22
   exists so a limit is shown where the string is written, and a WRONG limit
   shown there is the same failure wearing a badge.
   **When Mike or the platforms supply them they go here, and the live counter
   and the gate read this one line.** */
export const BUDGETS = {};

/* ── pure helpers, no I/O ─────────────────────────────────────────────────── */

/** every release in a run, in sequence order; UNDECIDED ones last. */
export function inOrder(releases) {
  return [...releases].sort((a, b) => {
    if (a.seq === UNDECIDED && b.seq === UNDECIDED) return 0;
    if (a.seq === UNDECIDED) return 1;
    if (b.seq === UNDECIDED) return -1;
    return a.seq - b.seq;
  });
}

/** the posting for a surface, or null. */
export function postingOn(release, surface) {
  return (release.postings || []).find(p => p.surface === surface) || null;
}

/** has this release gone public on this surface? */
export function isOut(release, surface) {
  const p = postingOn(release, surface);
  return !!p && p.state === "out";
}
