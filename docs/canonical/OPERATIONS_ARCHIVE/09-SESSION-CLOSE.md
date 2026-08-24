> Cut from `docs/canonical/OPERATIONS.md` §9 Session-close ritual, at HEAD `2f94fd7`.

# §9 SESSION-CLOSE RITUAL — THE EXPANSION UNDER STEP 0

**THE STEPS THEMSELVES STAY IN THE GROUND STATE.** A session must be able to
run the close from the file it already has open, so §9 keeps its heading, its
[MIKE] line, the gate chain of step 0 and steps 1 through 4. What is here is
the REASONING under step 0 — why the numbers gate is unconditional, why the lap
has two halves, and what `surfacing` is for — which is read when a session wants
to know why a gate exists rather than when it is running one.

**The hazard narrative that had accreted in the same step is NOT here.** It went
to `08-KNOWN-HAZARDS-II.md`, because a prune procedure and a NUL-byte defect
class are hazards and belong with hazards. That misfiling is what let the
NUL-byte class be filed twice.

---

   **[2026-08-13] THE NUMBERS GATE, AND WHY IT IS UNCONDITIONAL.** `npm run
   docs:numbers` measures every standing value published in THIS file and in
   `CLAUDE.md` — the lint baseline, the asset table's row count, the ledger's,
   the manual's page count — and refuses on a mismatch, naming the document, the
   line and both numbers. It exists because **six stale published numbers were
   found on 2026-08-13 and it was the third time**, and because the failure is
   worse than "out of date": a baseline is only useful as a comparison, so
   publishing the wrong one does not weaken the tripwire, **it inverts it.**
   IT RUNS ON EVERY PACKET FOR THE REASON DOCTRINE 18's GATE DOES: a number goes
   stale when somebody changes the thing it counts, and "did I change something a
   document publishes a count of" is exactly the question a session answers
   wrongly. On its first honest run it found a SEVENTH — the ledger's `when`
   field published as null on 152 rows against a real 166.
   **IT NEVER READS A ROUND LOG.** `STATE.md` is excluded whole and this file has
   no round log; in `CLAUDE.md` the gate stops at `## Recent session log`. A
   recorded measurement is history and rewriting it would falsify the record that
   makes the tripwire legible. See the header of `tools/numbers-gate.mjs`.

   **[N5 2026-08-06] AND THE LAP HAS BOTH HALVES AGAIN — `npm run lap`.** M97
   recorded four consecutive rounds in which the 390px half did not run, because
   the operator's window will not go below 1228 CSS px and Chrome refuses
   `window.resizeTo`. **The window's size was never the museum's viewport.** A
   403px same-origin iframe gives a document whose `innerWidth` is 390 exactly,
   and same-origin means the driver takes real measurements instead of reading
   pixels off a screenshot. The harness is committed at `tools/lap/harness.html`;
   `npm run lap` copies it into `public/` for the run and `npm run lap:clean`
   takes it out, because anything left in `public/` is in `dist/client` and one
   deploy would publish it (see §0 DEPLOY — THE ONLY ACCOUNT).
   **`npm run lap:clean` before the seal is part of the ritual, not an
   afterthought.** A packet that added visitor-facing
   content adds its register rows in the same commit **[MIKE]**; a packet that
   added or changed a media file re-runs `npm run assets:scan` in the same
   commit **[MIKE]**.

   **[v56/R7] AND THEN READ `npm run surfacing`, which is NOT a gate.** It
   cannot fail — an unshown thing is inventory, not a defect. It is here because
   **the packet is the only clock this repository has**, and the number it prints
   is the one Mike asked for a mechanism to be able to say: *what has this wing
   built and never shown anybody.* The proposed cadence is ONE SURFACING PER
   PACKET, and **the shelf must not grow two packets running** — one round of
   building ahead is stock, two is a habit. A round that moves it runs
   `npm run surfacing -- --log` so the next round's number means something.
