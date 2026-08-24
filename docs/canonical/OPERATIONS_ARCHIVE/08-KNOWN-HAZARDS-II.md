> Cut from `docs/canonical/OPERATIONS.md` §8 Known hazards (second cut) and the hazard narrative that had accreted in §9, at HEAD `2f94fd7`.

# §8 KNOWN HAZARDS — THE SECOND CUT

**THIS IS A SIBLING OF `08-KNOWN-HAZARDS.md`, NOT A REPLACEMENT FOR IT.** §0
rules an archive a snapshot cut at a named HEAD and never edited to track the
ground state. The first cut was taken at `b3812cc` and holds every hazard body
that existed then; it stays exactly as it was. Everything raised AFTER that cut
carried its body in the ground state instead, which is what took §8 from 4,025
bytes to 9,051 and the file to 96.5% of its ceiling. Those bodies are here.
**Two snapshots, each true of its own moment, neither edited to agree with the
other.** The lead line of every entry below is still in §8, which is the index
that tells a session there is something here to open.

---

## The bodied entries cut out of §8

- **`wrangler dev` holds `dist/weird_baby/.wrangler` open**, so `npm run build` fails with `EPERM … dist\weird_baby\.wrangler` while it is running. Stop the dev server (and any leftover `workerd` processes) before rebuilding. It also **caches its asset manifest at startup**, so a file added or removed under `dist/client` mid-run is not seen until it restarts — which is what makes an honest break-it-on-purpose test need a restart to be real.
  > **[FLAG 2026-08-23 · flagged, not fixed]** This entry's bold closes
  > mid-sentence — at `open**` — so it falls back to its whole first physical
  > line, which in this hazard is the whole hazard. That is why it carries body
  > text where the other entries do not. The `**` is not moved and the source
  > line is not edited.

- **`docs/canonical/START_HERE.md` HAS AN UNVERSIONED TWIN AT `C:\AI\START_HERE.md`, AND NOTHING NOTICES WHEN THEY DRIFT (2026-08-23).** `C:\AI` is a plain directory — there is no `.git` at `C:\AI` or at `C:\` — so the twin has no history, no `git diff`, no `git checkout --` to undo a bad write, and it never appears in any `git status`. It is the copy a fresh session outside this repo actually opens. It held one md5, `1c020bd0`, from 2026-06-09 until `0fa8709`: the governed copy was edited that day and the twin stayed stale until it was copied over. **The twin is COPIED byte-for-byte from the governed file after a push, never hand-edited** — an unversioned file gets no manual write while an identical governed copy exists. No gate, no generator and no `git status` will report the next drift; only someone reading both will.

- **`docs:numbers:gate` TAKES OVER TWO MINUTES BECAUSE IT SHELLS OUT TO `npx eslint .`, AND IT WILL TIME OUT UNDER ANY DEFAULT AGENT CEILING WHICHEVER WAY IT IS INVOKED (2026-08-23, corrected the same day).** Measured: `npm run desk` **1s**, `npm run docs:numbers:gate` **136s**, `node tools/numbers-gate.mjs --gate` **134s**. **npm costs about two seconds, not two minutes.** This entry first blamed npm startup and was disproved by running the thing it described — the expense is `measure.lint`, which runs `npx eslint .` over the whole repo on every gate. Allow 300s and either route completes. **The npm-versus-node distinction survives as reporting honesty, never as a workaround:** "the gate passed" and "the npm script completed" are different sentences, a direct `node` call never exercises the `package.json` wiring, and a renamed or broken script entry would pass unnoticed. **Say which one was run.**

- **THE DESK'S REGISTER CHECK IS ONE-DIRECTIONAL: IT PROVES EVERY LINK POINTS AT A LIVE ROW, AND NOTHING PROVES A ROW IS REACHABLE (2026-08-23).** `npm run desk` collects every `OPEN_ACTIONS.md#id` on each side page and reports any that resolves to no row. It is a real check and the only anchor validation in the tree, but it says nothing in the other direction: **a row nothing links to passes by not being referenced**, which is how `g-a`, `g-b` and `g-c` passed on their first run. A clean anchor report is not evidence that a row is findable — only that no page points at a row that has gone.

- **NO GATE IN THIS TREE READS A RESPONSE HEADER, SO THE WORKER'S CACHE MARKS ARE ENFORCED BY NOTHING (2026-08-24).** The class named below, with the instrument missing altogether: `src/worker.js` marks every cookie-decided exit `private, no-store` (`5acff0e`), and deleting all of them leaves `lint`, `build`, `provenance:gate`, `reveal:check`, `instory:gate`, `parity:gate` and `docs:numbers:gate` every one of them green. **THE REMEDY IS A RUNTIME PROBE, NOT A GREP:** which exits are cookie-decided is a judgement rather than a pattern, so the only honest check boots the worker and asserts the header on the real addresses. **AND THE RAW COUNT IS NOT A GATE INPUT:** 16 `Cache-Control` sites at HEAD, 2 of them inside the `noStore` and `withSetCookie` helper bodies.

- **NOTHING COUNTS `todayInRecordTz` CALL SITES, AND A NAIVE COUNT IS INFLATED BY THE SENTENCE THAT STATES THE RULE (2026-08-24).** `src/worker.js` must keep exactly ONE call (`f2dc391`); a second splits the museum in half — part of a page answering the driven day and part the real one — and does it silently. The rule is a comment and nothing else. **`grep -c "todayInRecordTz(" src/worker.js` RETURNS 4: one call and three prose mentions, TWO OF WHICH ARE THE DOCTRINE TEXT DESCRIBING THE INVARIANT.** A gate reading that number would be inflated by the sentence stating the thing it checks, so a real check strips comments first — the same trap as the header count above, and neither raw number is usable as a gate input.

- **NOTHING READS THE DICTATION PAGES' PUBLISHED NUMBERS, AND THEY WERE WRONG FOR EIGHT DAYS (2026-08-24).** `docs/dictation-20260807/` published 16 pictures behind the stage door against a real 144, and 44 addressable files against 183, from 2026-08-16 until `80c6fb8`. **THEY WERE NOT FALSE WHEN WRITTEN:** `prep.mjs` computed them correctly and nobody regenerated the pages while their inputs moved, so this is DERIVED-ARTIFACT STALENESS and not a false published claim. **THE REMEDY IS REGENERATE-TO-A-TEMP-DIR AND DIFF, AND IT IS NAMED HERE RATHER THAN BUILT:** `prep.mjs` is deterministic — `specsheet.html` and `arc.html` came back byte-identical after twelve days — and no page carries a build stamp, so a byte-diff is exact and needs no measurers. **EXTENDING `docs:numbers:gate` IS THE WRONG JOB:** its model is a `near` phrase in markdown prose against a `measure.*` value, and every count here would need a measurer re-implementing the asset-table × ledger JOIN — the third copy `prep.mjs`'s own header forbids.


---

## The hazard narrative cut out of §9's close ritual

**IT WAS NEVER RITUAL AND THAT IS WHY IT IS HERE.** A prune procedure and a
NUL-byte defect class are hazards; they had accreted inside step 0 of the
session-close ritual, where 4,551 bytes of them sat under a heading whose
subject is a checklist. **The cost was not only size: the NUL-byte class ended
up filed TWICE** — as a lead line in §8 and again with a full body here — because
a hazard written into a ritual section does not meet the hazard it duplicates.
§8's lead line is the home; this is its body, and there is now one of each.

   **[v56] TWO HAZARDS THIS ROUND RE-CONFIRMED, both worth reading before you
   trip them again.** `provenance-sweep --prune` broke **44 RESTATED chains** in
   one run — v52 already recorded that *a rename plus a prune is two safe
   operations that are unsafe in sequence*, and it is now twice. Re-run the gate
   after any prune; the RESTATED class's requirement that a reference RESOLVE is
   the only thing in the whole boundary that notices a deletion. And **never use
   `git checkout --` to undo a deliberate test break on a file that also holds
   uncommitted work** — it reverted this round's own G1 edits along with the
   break. **Sandbox breakage tests by FILE COPY.**

   **[P1–P5 2026-08-05] THE PRUNE HAZARD IS NOW A PROCEDURE, AND IT IS FOUR
   STEPS IN THIS ORDER: CHECK ANCHORS → REPOINT → PRUNE → RE-GATE.** v52 and v56
   both discovered the ordering after the fact; this round checked first and
   found that the single stale row left by deleting one caption was **the anchor
   of 18 RESTATED chains.** Read `r` across `provenance/register.json` for the
   stale key BEFORE pruning; repoint every hit onto a surviving sourced row (and
   refuse to prune if any chain would be left with no reference at all); then
   prune; then run the gate. Deleting one visitor-facing string is enough to
   trip this — it is not a hazard of big edits.

   **[REMOTE CONTROL P1–P11 2026-08-05] AND THE PROCEDURE IS CORRECTED BY ITS
   OWN FAILURE: PRUNE AGAINST A COPY AND LET THE GATE FIND THE BROKEN CHAINS.**
   Step 1 above — read `r` across the register for the stale key BEFORE pruning —
   assumes you can enumerate the stale set, and **you cannot do it by hand**. The
   check written for it folds `"a " + "b"` concatenation but not `\u2014`
   escapes, so it reported 154 rows where the sweep's own count was 61, and an
   over-report is useless for deciding what to repoint. What worked: **copy
   `register.json`, run `--prune`, run the gate.** The gate's own `badRestated`
   check named all eleven broken chains exactly, because IT is the thing that
   defines "resolves"; the copy is what makes it safe, since a broken chain can
   always be read back to the row it used to point at. **It also exposed a
   mis-classification no reading would have found:** five of the eleven were not
   repointed but RECLASSED — they were RESTATED for a COINCIDENCE OF WORDING with
   a face this round replaced, and two of them are Mike's own words.

   **[D1–D9 2026-08-06] AND A PRUNE PLUS A *MOVE* IS THE SAME HAZARD AS A PRUNE
   PLUS A RENAME — THE PROCEDURE HELD, AND THE GATE NAMED ELEVEN CHAINS EXACTLY.**
   The register is keyed on `keyOf(file, text)`, so a string that changes FILE
   goes undeclared and its old row goes stale even though not one character of it
   changed; this round moved 106 such strings. **They were CARRIED, not
   re-classified** — matched on exact text, from the exact file they left —
   because re-deciding 138 origins is 138 chances to give a sourced line a
   different origin than it had yesterday. **A carry is only sound when the text
   is byte-identical, so that is the test:** a string whose old row cannot be
   found under its old file is left undeclared and reported, never handed a row.
   Then, per the procedure above: **prune against a copy and let the gate find
   the breaks.** Nine of the eleven were the WAL poster's acts pointing at a
   `papa` note this round shortened — and they were **repointed onto the
   artist-card rows that actually carry each claim, which is a better chain than
   the one that broke**, because the old anchor merely ASSERTED that the sourcing
   existed. The other two pointed at rows the carry had re-keyed. Result: **0
   undeclared · 0 stale · 0 invention.**

   **AND A DEFECT CLASS WORTH KNOWING BY SIGHT: a LITERAL NUL byte in a source
   file makes every `grep`/`rg` over that file report "binary file matches" and
   nothing else — and the Read tool renders it as a SPACE, so an `Edit` whose
   anchor crosses it fails to match a line you just read.** P5 found six such
   bytes in four `tools/*.mjs`, including `keyOf` in `provenance-sweep.mjs`.
   Write them as the two-character escape `\0`; it is the same value to
   JavaScript and plain text to everything else. **The proof that such a change
   is inert is free: if `keyOf` had shifted by one bit, every register key would
   have changed and `provenance:gate` would have failed on every string in the
   museum. A passing gate after the edit is the test.**
