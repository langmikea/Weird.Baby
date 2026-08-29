> Cut from `docs/canonical/OPERATIONS.md` §8 Known hazards (fourth cut), at HEAD `09efc03`.

# §8 KNOWN HAZARDS — THE FOURTH CUT

**THIS IS A SIBLING OF `08-KNOWN-HAZARDS.md`, `08-KNOWN-HAZARDS-II.md` AND
`08-KNOWN-HAZARDS-III.md`, NOT A REPLACEMENT FOR ANY OF THEM.** §0 rules an
archive a snapshot cut at a named HEAD and never edited to track the ground
state. The first cut was taken at `b3812cc`, the second at `2f94fd7`, the third
at `35f805b`; all three stay exactly as they were. **Four snapshots, each true
of its own moment, none edited to agree with the others.**

**WHAT SAID WHEN, AND IT IS THE MECHANISM WORKING RATHER THAN A TIDY-UP.** The
ceiling did, again. The day of 2026-08-29 landed doctrines 28 and 29, ruling 29,
the SHELL-STOP guard and a new §8 hazard, and took `OPERATIONS.md` to **39,756
bytes — 99.4% of the ceiling, 244 bytes of headroom.** The eight-file deploy
sweep that comes next will raise hazards of its own and there was no room to
write one down. **The cut happens before the work that needs the room, not
after it.**

**WHAT WAS TAKEN: the seven bodied entries raised since the third cut**, dated
2026-08-25 through 2026-08-27, totalling **6,050 bytes**. Their lead lines stay
in §8 and are the index to this file. **Nothing landed on 2026-08-29 was cut** —
doctrines 28 and 29, the `[MIKE]` narrowing line, the SHELL-STOP and the
executable-markdown hazard are hours old and untested by use, and a cut is not
the place to judge them.

**THE ONE BODIED ENTRY STILL IN §8 IS THE 2026-08-29 ONE, AND THAT IS THE CYCLE
RATHER THAN AN EXCEPTION** — §8's preamble says a hazard raised since the last
cut carries its body there until the next cut sweeps it.

---

- **`record:land`'s STALENESS GUARD IS INERT ON THE WORKBOOK PATH — `workbook_to_draft.py` STAMPS `saved` WITH `now()`, SO A WORKBOOK OF ANY AGE PASSES IT, AND WHAT IS HOLDING THE DOOR IS THE COMMENT REFUSAL FIRING FOR AN UNRELATED REASON (2026-08-25).** Body at the site, in that file, beside the stamp.

- **A DATED RUNBOOK IS OUTSIDE `docs:numbers:gate`'s SET, SO ITS VALUES ARE PROSE — AND THE PROSE LOST WITHIN A DAY OF THIS ROW BEING WRITTEN (2026-08-25, FIRED 2026-08-27).** Now `docs/THURSDAY-20260827.md`; rule and value list boxed at its head. Body: `docs/MUSEUM_RUNBOOK_REDATE_LOG-20260827.md` §2.

- **A GENERATED PAGE IS A SNAPSHOT, AND A SAVE FROM A STALE ONE CARRIES A TRUE TIMESTAMP ON OLD WORDS — WHICH IS WHY `record:land`'s GUARD 8 PASSES IT (2026-08-26).** The workbook row above is the same class; this is it on an editing surface, where it is worse because the page is open for hours. Body at the site: `sourceState()` in `tools/dictation/record-serve.mjs`, and `SOURCE_STATE` in `tools/dictation/day.mjs`. **The lesson generalises past these two files: any tool that stamps `saved` at the moment of saving is answering a question nobody asked it.**

- **A BACKSLASH CANNOT BE CHECKED BY READING IT IN ANY LANGUAGE, AND A HEREDOC IS ONE MORE LAYER THAT EATS ONE (2026-08-26).** The wing-names round filed this as a JavaScript fact — *"`\W` is not a recognised escape and the backslash is dropped silently"* — and it is not one: writing `\MUSIC` into a register row through a `python - <<'PY'` heredoc raised `SyntaxWarning: invalid escape sequence '\M'`, because the text typed and the text Python parsed were not the same. **It landed correct by accident** — the survivor was kept literal — which is the worst outcome, since a wrong count would have announced itself and a lucky one does not. **Count the backslashes in the file on disk; never in the source that wrote it.** Body: `docs/MUSEUM_COVER_FENCES_LOG-20260826.md` §6.

- **A GENERATOR'S FENCE PROTECTS THE TOOL IT LIVES IN AND NOTHING ELSE, AND FOUR OF FIVE COVER TOOLS HAD NONE (2026-08-26).** `make_unit_covers.py` carried the hand-authored fence alone from 2026-08-10 — on the retired tool that writes nothing — while `make_house_covers.py`, `make_robots_cover.py`, `make_template_covers.py` and `make_foundation_covers.py` wrote those exact paths unguarded. **The fence's own sentence is the diagnosis read one step out:** *a fence that only lists what a tool happens to write today stops being a fence.* One set now, `tools/cover_fences.py`, keyed on the BASENAME because a governed picture has two addresses. Body: `docs/MUSEUM_COVER_FENCES_LOG-20260826.md` §1.

- **`npm run mock` NEVER READS `req.method`, SO A POST TO IT IS A 404 — AND ON AN http ORIGIN `showSaveFilePicker` EXISTS, SO `record.html`'s FALLBACK THEN OPENS A FOLDER DIALOG AND REPORTS SUCCESS ABOUT A FILE OUTSIDE THE REPO (2026-08-26).** `tools/serve-mock.mjs:76` treats every request as a file GET. The day editor has **no picker at all** for this reason — its only fallback is the text on the screen. **`record.html` still has one and is unfixed**, so serve an editor with `npm run day:serve`, never with the mock.

- **A GREP OF THE WORKING TREE CANNOT SEE LOST WORK, AND REPORTING ITS SILENCE AS ABSENCE HAS NOW MISSED TWICE IN ONE DAY (2026-08-27).** **MIKE, correcting the record: *"You have had them before; you have had CH4 working completely and correctly at one time, just like you had monitor resize."* He was right both times and Ops had reported both as never-existed.** THE MONITOR RESIZE is `Portal_Grip_In()` in `twin.html`, built at `fc4cc80` to his own T3 ask, **still in the file today**, made inert inside the museum by `efc379f` on 2026-08-22 — disabled by a rule with a stated reason, not deleted. CHANNEL 4 arrived at **`8e67b5b`, 2026-08-12** (*"Channel 4 arrives"*) carrying his close-up plate on drum position 4, and **`docs/MUSEUM_CHANNEL_4_LOG-20260812.md` is still in `docs/` and answers the whole question in one section**, including that his marker file was filed as a `spec` with `ref: null` and never wired to anything. **THE COMMON CAUSE IS ONE HABIT: SEARCHING WHAT THE TREE IS RATHER THAN WHAT IT HAS BEEN.** A filename or content grep of HEAD is blind to exactly the four states lost work is in — deleted, renamed, in the OTHER repository, or outside git — which is to say it is blind by construction to the thing it is being asked about. **A silence from `grep` is evidence about HEAD and about nothing else, and must never be written up as *it never existed*.** **WHAT A SEARCH THAT WOULD FIND IT LOOKS LIKE, cheapest first:** **(1) READ THE ROUND LOG OF THE DAY IT LANDED** — `docs/MUSEUM_*_LOG-*.md`, one per round, and the answer to both of today's misses was sitting in `docs/` the whole time. This step costs one `grep -il` over `docs/` and was skipped twice. **(2) `git log --all -S"<content>"`** — the pickaxe, over ALL refs rather than HEAD, and **on the CONTENT rather than the NAME**, because the name is the thing that changes when work is lost. A coordinate, a distinctive number or a phrase beats a filename every time. **(3) `git log --all --diff-filter=D --name-only`** — what was deleted, which no grep of the tree can reach. **(4) THE OTHER REPOSITORY.** This project is TWO repos and `twin.html` lives in one while being referenced from the other; a museum-only search cannot see the robots repo's history and vice versa. **(5) `git fsck --lost-found`** — unreachable commits and blobs, for work lost to a reset or a rebase rather than to a commit. **(6) OFF-GIT DISK** — `_night-*`, `Archive/`, `Salvage/`, `_backups/`, and the OneDrive folders where Mike's own artefacts live. **His marker file for channel 4 is in one of those and the repo copy is byte-identical to it** (sha256 `d9e04fc1394515f6…`, both 556,169 B), which is the shape to expect: the artefact is his, outside git, and the tree holds a renamed copy. **THE CHEAP HALF OF THIS IS STEPS 1 AND 2 AND THEY WOULD HAVE ANSWERED BOTH.**
