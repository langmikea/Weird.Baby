<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# HANDOFF — 2026-08-31, the manual rounds

Session-scoped. Process and standing facts are not here — they are in
`docs/canonical/OPERATIONS.md`, `STATE.md`, and for the manual specifically in
`robots:docs/MANUAL_WRITING_BOOT.md`, which gained a **§0** today that governs
everything else in it.

---

## MIKE'S RULINGS TODAY — read these before writing a word

**1 · THE ENCABULATOR IS RETIRED. THE MANUAL IS PLAIN INSTRUCTION PROSE.**
His words: it describes meaningless technical specifications, and this manual
gives meaningful instructions, and the two are not the same job. **Write a
plain, direct instruction manual. Use the lore as factual material. No voice,
no period pastiche, no register exercise. Plain enough that a person following
it can do the thing.** It is `MANUAL_WRITING_BOOT.md` §0. **The reader is
addressed as "you."** Paragraph 9-1 is the only paragraph in the document
written this way; it is the sample he approved the direction from.

**2 · THE DOCUMENT IS AN ABEAL INTERNAL PRELIMINARY ENGINEERING COPY OF A
MANUAL THAT NEVER SHIPPED.** This is the ruling that licenses the rest. It is
why the register may be mixed, why the imperfections belong, why positions
stand reserved with placeholders on the page, and why it does not have to read
like a finished consumer document. **It is not a published manual and must not
be smoothed into one.**

**3 · SERVICE IS "any authorized ABEAL Service Center near you."** That is the
phrase. Section XI and Appendix H are written to it.

**4 · A HANDWRITTEN NOTE READING `GOLD dealers only!!!` GOES BESIDE THE SERVICE
ADDRESS — AND IT WAITS ON MIKE WITH A PEN AND A CAMERA.** It cannot be
assembled from the existing pen cuts: **the pen has no alphabet.** The marks in
`robots/mgk-viiip/manual/marks/` are strikes and scribbles, not letterforms.
Do not attempt to synthesise it and do not letter it in a font. It is a
photograph of his handwriting or it is nothing.

**5 · THE TROUBLE CHART CARRIES ONLY REAL FAULTS.** Table 9-1 went from eleven
rows to five. Six described the instrument working correctly, and a trouble
chart that lists correct behaviour sends a reader hunting a fault that is not
there. **This generalises: no chart, table or list in this manual may carry a
row whose subject is the machine behaving as designed.**

---

## THE STATE

**Robots `68b4b75` · museum `3cddf36`.** Both level with their remotes, both
working trees clean but for six untracked scratch render dirs in robots.

**What landed today, in order:** Sections IV, VIII and IX written; the
diagnostic monitor's windows named only where the manual had already named one;
Table 9-2 corrected off the twin's superseded `CHECK OWNERS MANUAL` onto
`SEE MANUAL`, which is what the instrument prints; the `[PAPA]` maintenance-card
slot in `HEALTH.ino` answered, so the firmware's three card strings are now the
manual's; 8-9 written for a reader arriving from `SEE MANUAL` on the glass,
which closes **D-10**, the only hole the machine itself was built to point at;
Appendix F given F-1 and the case convention; the power control / power switch
divergence recorded rather than resolved; the trouble chart cut to five rows and
its depth closed on the last of them; **9-1 rewritten plain**; all six viewers
rebuilt; six findings registered as R12–R16 and C44.

**The protected set is untouched and was read fresh at every packet.** 63
leaves, 1 marked page, digest
`dc38450e1036a4231de86f34526d2252593d2cdc47909830611ed3ce1bee96ee`, PDF mtime
still 19 August. `structure/pages/` has 0 lines in `git status` all day.

**THE 75-AGAINST-63 GAP, AND IT WIDENED TODAY.** The document lays out at
**74 sheets**; `structure/pages/` holds **63 rendered leaves**. It was 67 at the
start of the day, went to 75 as three sections were written, and came back to 74
when Table 9-1's depth closed. **The gap is not a defect and it must not be
closed casually.** `manualPages()` reads the highest `NN` off `pages/`, the
museum's `docs:numbers` gate publishes 63 off it, and four `MANUAL_PAGE()`
literals name leaves by number. The moment `pages/` is regenerated the gate goes
red on a claim that was true that minute and those four literals silently begin
naming different leaves, with nothing in either repository refusing them.
**`main()` is never called. See the boot file §1 and §2.**

---

## NEXT — and the order is the point

**1 · THE REGISTER PASS COMES BEFORE ANY NEW POSITION.** Sections IV, V, VI and
VIII and Appendix B are written in the voice Mike could not follow. That is
**54 of the 55 written positions**; only 9-1 is in the new register. Rewriting
them is not tidying — it is the difference between a document he can use and one
he cannot. **Do not start Section I.** `docs/FINDING-manual-survey-20260831.md`
§6 exists specifically to stop a reader of §1 doing exactly that.

**2 · ONE PARAGRAPH AT A TIME UNTIL HE SAYS THE REGISTER IS RIGHT.** 9-1 is the
sample and the direction is approved; the register is not settled. A whole
section rewritten to a voice he has not signed off is the same mistake at scale.

**3 · THEN S1's REMAINING HALF, WHICH UNBLOCKS TEN POSITIONS.** Answering it
releases them; the survey names which.

**4 · THE SURVEY IS INCOMPLETE AND SAYS SO.** Its §0 records that the sixteen
seed clusters were produced in a packet the writing session could not read and
are deliberately not reconstructed. **If that analysis exists in another window,
paste it under that heading.** Everything else in the file is measured off the
generator and re-takeable.

---

## TWO THINGS THAT WILL BITE

**A PLATE GOES STALE THREE WAYS AND ONLY ONE CHANGES A FILENAME** — its section
grows, its section merely moves, or its own text changes. The middle one is the
surprise: `render_page` seeds its random stream from the page number, so a
section that moves re-renders differently even when not one word of it changed.
Appendix B was stale by eleven sheets today and nothing caught it. The viewer
generator now refuses a plate directory that does not match the layout, which
catches two of the three and is blind to the third. Register
[R14](OPEN_ACTIONS.md#r14).

**THE MOCK VIEWERS ARE GENERATED, NOT HAND-EDITED.** One script builds all six
pages, re-renders only the plate directories that do not match the current
layout, and dumps each sheet's selectable text from the same page ops the plate
renders from. Editing a mock page by hand puts the text and the picture on
different sources, which is the drift the design exists to prevent.
