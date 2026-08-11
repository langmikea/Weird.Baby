// src/data/faq-face.js — EVERY WING'S FAQ IS BUILT BY ONE FUNCTION.
//
// ═══ [F1 2026-08-06] THE FORMAT HAS NOW BEEN RULED THREE TIMES ══════════════
// MIKE, and the emphasis is his: **"THE ROBOTS FAQ USES THE INFORMATION BOOTH'S
// LAYOUT AND FORMAT, EXACTLY. Today it has a different title format, extra text
// above the table, and a footer that does not belong. STRIP ALL OF IT. The
// booth's shape is: a short credo block, the word 'Questions', the question
// list, a sign-off line with the address, and the exit. Nothing else. Conform
// every wing FAQ to it — this is the third time the format has been ruled."**
//
// THE THIRD TIME IS THE FINDING, NOT THE INSTRUCTION. R7 conformed the
// ACCORDION across four faces and stopped there, because an accordion was what
// that round was asked for. It left every FAQ face free to declare a `blurb`, a
// `lines` register, a `still` and a `footer`, and the robots front desk had all
// four. A format enforced by a round is a format that lasts until the next
// round; the reason it has been ruled three times is that it has never once
// been a MECHANISM.
//
// SO IT IS A FACTORY, AND THE FIELDS ARE NOT OPTIONAL — THEY ARE ABSENT.
// A wing hands over its subtitle and its questions and gets a face back. There
// is no argument for a blurb, so a wing cannot add one by declaring it; there is
// no argument for a footer, so no wing can sign off in its own words. The next
// session that wants to put a paragraph above a question list has to edit this
// file, in front of this note, which is exactly the friction the last two
// rulings did not have. Same move N3 made with `DocList` and D1 with
// `house-copy.js`: the shared thing becomes one object rather than a convention.
//
// ═══ WHAT MAPS ONTO WHAT ════════════════════════════════════════════════════
//   the booth                        a wing's FAQ face
//   ───────────────────────────────  ─────────────────────────────────────────
//   MuseumBar (brand / room / exit)  the exhibit's own bar and its exit
//   the credo block                  the face head — `FAQ` over the wing's name
//   the word "Questions"             `FAQ_HEAD`, printed by `FaqEntries`
//   the question list                the same accordion, element for element
//   [D 2026-08-11] the sign-off line is STRUCK, sitewide, on Mike's ruling.
//   An FAQ closes on its last question now.
//   "Back to the lobby"              NOT REPEATED, and that is a judgement:
//
// THE SECOND EXIT IS THE ONE THING THAT IS NOT CARRIED ACROSS. The booth's
// closing link exists because a sheet is a long scroll and its own note says so
// — "for a visitor who has read to the bottom and does not want to travel back
// up to the bar." An exhibit face is not that shape: it sits in a framed panel
// beside a tracklist, with the wing's bar and its exit on screen the whole time.
// Printing a second way out there would be M3's own complaint — two ways out of
// a room — reinstated on four faces at once. The exit is present; it is simply
// already present.
//
// AND THE HEAD IS THE HOUSE'S ONE FRAME. `title` is the literal word FAQ on
// every wing, which is what "a different title format" was about: the robots
// front desk said "Frequently asked" while three other faces said "FAQ", so a
// visitor moving between them met two objects with the same job and different
// names. `subtitle` is the wing, which is the only thing that legitimately
// differs between them.

/* The booth's own word for the list, printed above it in every wing. */
export const FAQ_HEAD = "Questions";

/**
 * @param subtitle  the wing, in the house's own caps — e.g. "WEIRD.BABY ROBOTS"
 * @param entries   [{ title, line | lines, note?, link? }]
 * @param opts      { head: false } to print no "Questions" heading
 */
/* ═══ [F1 2026-08-11] THE HEADING IS OPTIONAL NOW, AND ONLY ROBOTS DROPS IT ═══
   MIKE'S RULING, given under a section headed THE ROBOTS FAQ: remove the
   heading "Questions". It is one shared word printed by `FaqEntries` on five
   surfaces — the booth and four wings — so removing it at the source would
   have reached all five, and the ruling names one.
   SO IT IS A FACE FLAG RATHER THAN A DELETION. `faqHead` defaults to TRUE,
   which is every existing caller unchanged and byte-identical; robots passes
   `{ head: false }`. The flag lives on the face because the face is what the
   renderer already reads, and it goes through this factory because this file
   is what stops a face declaring fields nobody prints.
   THE OTHER FOUR STILL PRINT IT. That is the ruling's stated scope and not an
   oversight — R7's "conform every wing FAQ to the booth's format" is now true
   of four faces out of five, which is a divergence worth Mike's word before it
   is either spread or reversed. */
export function faqFace(subtitle, entries, opts) {
  return {
    kind: "text",
    title: "FAQ",
    subtitle,
    entries,
    entriesMode: "faq",
    faqHead: !(opts && opts.head === false),
  };
}
