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
//   [D 2026-08-11] the "Questions" heading is STRUCK from all five faces.
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

/**
 * @param subtitle  the wing, in the house's own caps — e.g. "WEIRD.BABY ROBOTS"
 * @param entries   [{ title, line | lines, note?, link?, inline? }]
 *                  `inline: { mark, href }` — [2026-08-16c] ONE ANSWER IN THE
 *                  BUILDING CARRIES ONE, and it is listed here only so it is
 *                  not "discovered" as a free slot. It turns a substring of the
 *                  writer's own sentence into an anchor; it is NOT a link
 *                  affordance and Mike ruled against building one ("This is one
 *                  link in one answer, not a new pattern"). Read the note above
 *                  `inlineDoor` in Exhibit.jsx before a second caller exists.
 * @param closing   optional [paragraph] printed under the last question
 */
/* ═══ [D 2026-08-13] `closing` — AND THIS IS THE EDIT THE NOTE ABOVE ASKED FOR
   ═══════════════════════════════════════════════════════════════════════════
   The header says a wing "cannot sign off in its own words", and that stands:
   what D 2026-08-11 struck was the wing's NAME and the word FAQ set as a
   footer — Ops' furniture, printed under five faces, saying nothing a reader
   came for. This is not that. Mike's Foundation copy ends on two sentences that
   are neither a question nor an answer to one:

       "Weird.Baby is dedicated to preventing the soul-sucker that is
        Homelessness."
       "What's your purpose in life? Wanna pitch in?"

   THE ALTERNATIVES WERE WORSE AND ARE NAMED RATHER THAN GLOSSED. Appending them
   to the last answer files a statement about the whole room under "CAN PEOPLE
   CONTRIBUTE IN WAYS OTHER THAN CASH?". Giving them a question of their own
   invents a heading Mike did not write. Dropping them edits his instruction.
   So the shape follows the content: a closing block, in the flow, never behind
   a disclosure.

   IT IS STILL NOT A FREE SLOT. `closing` takes PARAGRAPHS and nothing else — no
   title, no link, no address — and the friction the header describes is intact:
   the next wing that wants one has to come here and read this. Exactly one
   caller passes it today. */
/* ═══ [D 2026-08-11] THE HEADING IS GONE FROM ALL FIVE, AND SO IS THE FLAG ═══
   MIKE'S RULING: strip "Questions" from every FAQ face, not robots only — the
   under-scoping one packet ago was Ops'. `faqHead` lasted a single round and
   had one position left, so it is deleted rather than pinned false: a switch
   nobody can throw is furniture. `FAQ_HEAD` is retired with it, so the word
   itself no longer exists in the source. The factory is back to the shape it
   had before the flag. */
export function faqFace(subtitle, entries, closing) {
  return {
    kind: "text",
    title: "FAQ",
    subtitle,
    entries,
    entriesMode: "faq",
    /* absent rather than empty on every wing that passes nothing, so a face
       that has no closing block carries no field to reason about. */
    ...(closing && closing.length ? { faqClosing: closing } : {}),
  };
}
