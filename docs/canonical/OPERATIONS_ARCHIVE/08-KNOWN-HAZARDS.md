> Cut from `docs/canonical/OPERATIONS.md` §8 Known hazards, at HEAD `b3812cc`.

## 8. Known hazards (environment quirks)

- **[2026-08-17] `assets:scan` WALKS DISK, AND DISK INCLUDES GITIGNORED TREES.
  A ROW IS COMMITTED; THE FILE MAY NOT BE, AND THEN THE ROW IS BORN AN ORPHAN.**
  Adding four photographs took the table 385 → 409: the four, eight comparison
  pictures, and **twelve files under `docs/shorts/out/`**, which `.gitignore:60`
  excludes whole. Correct on this machine the minute it is written; dangling on
  every clone and every CI checkout — the M9 defect class manufactured on
  purpose, and a later round cannot tell such a row from a real move.
  There is a **`SKIP_PATH`** list in `tools/asset-table.mjs` now, **by path and
  not by name** (the directory is called `out`; skipping every `out/` would hide
  whatever a future round parks in another), and **deliberately not a
  `.gitignore` reader** — parsing that file would silently change this table's
  population every time somebody edits it, and the population is a judged thing.
  **AND THE SKIP ALONE DOES NOT UNDO A BAD SCAN: `--scan` MERGES, IT DOES NOT
  REPLACE.** With the fix in place the twelve already-written rows simply became
  *rows whose file is gone* (13 → 25) and stayed. **Restore `asset-table.json`
  from HEAD and re-scan** — that is the only way back, and it is safe precisely
  because nothing else writes that file.
- **[2026-08-17] A LAZY IMAGE DOES NOT LOAD IN A FRAME THE BROWSER IS NOT
  PAINTING — the same family as the `requestAnimationFrame` row below.** Four
  `loading="lazy"` plates in a same-origin measuring iframe stayed at
  `naturalWidth 0` with a correct `src` through a full scroll of the document,
  and drew 1.8px tall. **Two consequences, and the second is the one that
  reaches a visitor:** a probe will report a picture "broken" that is fine on the
  top-level page (two coverflow covers did exactly this), and a lazy image with
  no reserved box collapses its container until it lands. Measure images on the
  top-level page, or force `loading="eager"` in the probe before believing a
  zero — and do not put `loading="lazy"` on a picture that only exists once the
  visitor is already looking at it.
- **Cowork FUSE/sync truncation.** The sandbox has truncated files on
  disk mid-write (three files once recovered from HEAD). NEVER let a
  Cowork session do read-modify-write on large files; big-file edits are
  surgical and host-side. If a file looks truncated, check HEAD before
  editing.
- **Cowork mount READ-LAG (2026-07-06).** Files edited via Cowork's
  host-side file tools can read back stale/truncated through the bash
  mount INDEFINITELY (App.jsx served 64 of 71 lines 30+ min after edit).
  Host is truth — verify freshly host-edited files with host-side reads
  or /tmp reconstructions, never by parsing them through the mount.
  Sandbox-side writes are consistent in both views immediately. Same
  session: sandbox `git status` orphaned an undeletable `.git/index.lock`
  + phantom staged deletions — the host-side `Remove-Item .git\index.lock;
  git reset --mixed HEAD` prelude cleared both, as documented.
- **Virtiofs:** phantom deletions in `git status` from the sandbox (HR
  commits host-side only, with `Remove-Item .git\index.lock; git reset
  --mixed HEAD` prelude); SQLite COMMIT failures (use `/tmp` work-copy +
  `shutil.copy2`).
- **~16KB post-edit boundary** silently tail-truncates patched files —
  anchor-based patches + `wc -l` + tail verify required past it.
- **`assets.run_worker_first` IS A LIST WITH A DEFAULT ON THE OTHER SIDE OF IT (H1, 2026-08-06).** Declaring it at all makes every path NOT in it asset-first, and with `not_found_handling: "single-page-application"` the asset store answers **every** unmatched path with index.html and a 200 — so a missing `"/api/*"` entry silently deletes the back end without one error anywhere. Verify API routes against `wrangler dev` on the BUILT bundle after any change to that list; a 200 with `content-type: text/html` on `/api/admin` is the symptom.
- **A LITERAL NUL BYTE WRITTEN BY A PATCH SCRIPT — THE CLASS IS THREE ROUNDS OLD AND STILL PRODUCING (H8, 2026-08-06).** P5 found six in four `tools/*.mjs`; this round's own patches put a **seventh** in `tools/asset-table.mjs` and an **eighth** in `Exhibit.css` before the same `grep` caught both. The tell is `grep` reporting *"binary file matches"* and nothing else on a file you just edited. It happens when a heredoc'd patch script writes what it believes is the two-character escape `\0` or `\00a0`. **Write the escape as `\u0000` in JavaScript, and prefer a MEASUREMENT to an inserted glyph in CSS** — an empty field that needs to hold its height wants a `min-height`, not a `content:"\00a0"`. Verify with a byte count, not by reading: the Read tool renders a NUL as a space.
- **`wrangler dev` CACHES ITS ASSET MANIFEST AT STARTUP, AND A REBUILD MID-LAP 404s THE WHOLE SITE (H1, 2026-08-06).** Already recorded one row down as a hazard for break-it-on-purpose tests; it bites the ORDINARY case too. `npm run build` re-hashes every chunk, the running server keeps serving the manifest it started with, and `/robots` returns 404 with no error anywhere. Symptom: the browser shows an error page and `curl` says 404 on a route that worked a minute ago. Fix: `taskkill //F //IM workerd.exe` and restart. **Build first, then start the server, then lap.**
- **A GENERATOR WHOSE OUTPUT HAS BEEN EDITED BY HAND WILL DELETE THE EDIT ON ITS NEXT RUN, SILENTLY (A3, 2026-08-06).** `provenance/assets-declare.mjs --write` regenerates the whole of `assets.json` from one array in that file. Five rows had been added to the JSON directly by later rounds (the Foundation's three covers at D7; two robots rows at P2/P7) and **the next `--write` would have deleted all five without a word**. **[H2 2026-08-06] IT IS A MECHANISM NOW AND THE DRIFT IS FORTY-FIVE ROWS.** The hazard was recorded and left as one — *"nothing runs the diff that finds it; it is ten lines"* — and then this round moved 28 pictures behind the door and declared them in the JSON directly. `assets-declare.mjs --write` **now runs that diff itself and REFUSES**, naming every declaration it would have deleted. **Repairing the drift is a decision about which of the two files is the source and it is Mike's** (OPEN_ACTIONS H-b). The same shape still applies to any other `*-declare.mjs` in `provenance/` and to `reveal/ledger-declare.mjs`, neither of which has a guard. Register M99.
- **A BUILD THAT BUILDS HALF THE APPLICATION LOOKS LIKE A BUILD (V1, 2026-08-06).** This project has TWO vite environments — the client and the Cloudflare worker — and `@cloudflare/vite-plugin` registers the second as a multi-environment builder that **only the CLI drives**. Vite's node `build()` API builds the client, prints a full chunk table and returns happily, leaving `dist/weird_baby/index.js` from whatever built it last. `tools/stage-build.mjs`'s first cut did exactly that: the client came out in the LAUNCH state and the worker kept the previous DEVELOPMENT stage, so both stage doors stood open on a launched museum and **the only symptom on the wire was one word in `/api/held`.** Caught by checking the wire rather than the console, which is also how H1's `run_worker_first` outage was caught. **Anything that needs to rebuild this app spawns `vite build`; never call `build()`.** Verify with `grep -o '"launch"\|"development"' dist/weird_baby/index.js` after any staged build.
- **A GOVERNED PICTURE HAS TWO ADDRESSES, AND ANYTHING THAT MATCHES ON ONE OF THEM IS WRONG (C1, 2026-08-06).** V1 made the pull-back a launch-state rule: a picture of the machines is DECLARED at its public address (`/robots/…`) and its FILE may be parked behind the stage door (`public/held/robots/…`), with `reveal/placement.mjs` mapping one to the other. **Four instruments broke on that in one round** — `usedBy` in `tools/asset-table.mjs` (which would have named twenty-six photographs as unreferenced on the round that restored them, on the one instrument whose output is a DELETION LIST), the disk check and the M99 drift guard in `provenance/assets-declare.mjs`, and `seenAssets` in `tools/provenance-sweep.mjs`. All four import `STAGE_PREFIX` now. **Any new tool that reasons about an image path must resolve the twin**, and the tell is a report that names held material as missing, orphaned or undeclared. **[K-a 2026-08-07] AND IT HAS A QUIETER FORM THAT RESOLVING THE TWIN DOES NOT CATCH: THE TABLE HOLDS BOTH ADDRESSES AS TWO ROWS.** When a picture moved behind the door its public-side row stayed, flagged `missing:true` — so `provenance/asset-table.json` carries the same photograph twice, once live at `/held/robots/…` and once dead at `/robots/…`. `npm run assets:orphans` reports **0** and is right: it counts `missing && isJudged`, and a dead twin inherits no judgement. **A new instrument that filters on `ref` alone therefore over-counts what is available** — the dictation tracker's first cut said eighteen governed pictures were one Record entry away when the true number is sixteen. **The rule for any tool that counts files: skip `missing:true` FIRST, before resolving the twin**, and say in the output that you did.
- **`wrangler dev` holds `dist/weird_baby/.wrangler` open**, so `npm run build` fails with `EPERM … dist\weird_baby\.wrangler` while it is running. Stop the dev server (and any leftover `workerd` processes) before rebuilding. It also **caches its asset manifest at startup**, so a file added or removed under `dist/client` mid-run is not seen until it restarts — which is what makes an honest break-it-on-purpose test need a restart to be real.
- **A CLIPBOARD WRITE IS NOT DONE UNTIL IT HAS BEEN READ BACK (U2, 2026-08-09).** `navigator.clipboard.writeText` REJECTS with *"Document is not focused"* whenever the page does not have focus at the moment of the call, and `document.execCommand("copy")` returns **true when the command was merely ENABLED** — neither says the clipboard changed. A tool that prints *"Copied — N characters"* off either one can be wrong for days without a symptom, because the reader keeps pasting the last write that DID land: identical text, identical timestamp, no error anywhere. **Read it back with `clipboard.readText()` and compare, or do not use the word "copied".** Better still, do not put a person's only copy of their work through the clipboard at all — `showSaveFilePicker` writes a real file and the handle survives in IndexedDB, which is what `tools/dictation/worksheet.mjs` does now.
- **A GENERATED PAGE AND THE LIST ITS SCRIPT WALKS MUST BE PROVED THE SAME SET, NOT ASSUMED (U3, 2026-08-09).** Both come off one generator, so they agree — until a round retires a field from one of them. `assertSlotsMatchPage()` in `tools/dictation/worksheet.mjs` reads the emitted HTML back and refuses the build on any difference in either direction. **The same shape applies to any generator whose output carries a script that enumerates its own fields.**
- **THE PROVENANCE SWEEP'S "UNREACHABLE" BUCKET IS NOT A DEAD-CODE LIST, AND A CLEANUP ROUND COULD DELETE A LIVE WING FROM IT (M84, 2026-08-06 — moved here from the register 2026-08-09 because it is a note, not an action).** `provenance:gate` follows STATIC imports from `src/main.jsx`. H1 made `/hr` a DYNAMIC import, so nine Hunter Root files sit in the sweep's *"unreachable from `src/main.jsx`"* bucket carrying **485 strings** — and only 154 of those are genuinely dead (`hr_facts.js` 124 and `hr_journal_prompts.js` 30, which are M5). **The other 331 are the live exhibit.** Every one is still DECLARED and the gate is PASS. Read the bucket as *"the walk could not reach it"*, never as *"nothing uses it"*.
- **`innerText` RETURNS WHAT CSS DISPLAYS, NOT WHAT IS IN THE DOM (E5, 2026-08-09).** Any tool that reads text back out of a page — a contenteditable editor, a scraper, a lap probe — gets the TRANSFORMED string: `.vp-rec-sect-label` is `text-transform: uppercase`, so a heading typed *Detailed report* came back **DETAILED REPORT**. It is invisible on the glass, because the glass upper-cases it either way, and it would have travelled into `src/data/artists/robots.js` as an edit of Mike's words that nobody made. **Use `textContent`**, and map `<br>` to a newline yourself rather than letting it vanish. The same trap covers `text-transform: lowercase/capitalize`, `::first-letter` and CSS-inserted `content`. Caught only by writing into every field and comparing.
- **`requestAnimationFrame` DOES NOT FIRE IN A TAB THAT IS NOT BEING PAINTED (E5, 2026-08-09).** The Record editor waited on a frame before making its fields editable; loaded in a background frame it drew its entry perfectly and **wired nothing**, with no error anywhere — an uneditable page in exactly the situation nobody tests (open it in a second tab, come back later). Found by the 390px lap, which runs in a frame in a driven tab. **Never put correctness behind rAF; a `setTimeout` is throttled in the background but it still runs.** rAF is for animation, which by definition nobody is watching in a background tab.
- **FOUR WAYS TO PROVE A FEATURE ABSENT THAT IS PRESENT AND RUNNING (2026-08-16).** A packet reported that the museum *"has no playback code"* — `audioUrl` in the data, `new Audio(` absent, no `<audio>` element, no network request, therefore never built. **All four readings were probe failures and every one of them returned a confident false negative.** The player has been in `Exhibit.jsx` the whole time (`useAudioPlayer`, line 714), is called unconditionally, and on the deployed site builds an element pointed at the right mp3 with `paused:false` and `networkState:2`. The four traps, each of which recurs in any front-end investigation:
  **(1) THE WRONG CHUNK.** The site ships four JS files. `index-*.js` holds the DATA; `Exhibit.jsx` and everything in it lands in `tokens-*.js`. A grep over one bundle file is a grep over a quarter of the application — enumerate the chunks first (`performance.getEntriesByType("resource")`, or just `ls dist/client/assets/*.js`) and search all of them.
  **(2) A MINIFIED NO-ARG CONSTRUCTOR HAS NO PARENTHESES.** `new Audio()` ships as `new Audio`. **A search string ending in `(` cannot match it.** Search for the identifier, or for a neighbouring property (`preload`), never for source punctuation that the minifier is free to drop.
  **(3) `document.querySelectorAll("audio")` CANNOT SEE A DETACHED ELEMENT.** `new Audio()` is never appended to the document; it plays perfectly and is not in the DOM. That query returns 0 whether the player exists or not, so **it cannot answer the question it is being asked.** To observe a constructor, wrap it: `const R=Audio; window.made=[]; window.Audio=function(){const a=new R();made.push(a);return a}`.
  **(4) MEDIA LOADS DO NOT RELIABLY ENTER THE RESOURCE TIMING BUFFER.** With the element actively loading, the mp3 was absent from `performance.getEntriesByType("resource")`. **"No network request" measured that way is not evidence of no network request** — read `networkState`, `readyState` and `buffered` off the element itself.
  **AND THE FIFTH IS THE TAB.** `document.hidden === true` defers media loading entirely (`readyState` stays 0 forever), stops synthetic pixel clicks from landing, and — see the row above — kills `requestAnimationFrame`. **Check `document.hidden` before believing any playback, click or animation measurement**, and prove a stall belongs to the environment with a control: a hand-built element on the same URL in the same tab behaving identically is the proof.
- `export-artifacts.mjs` prints a harmless `UV_HANDLE_CLOSING` assertion
  AFTER finishing — ignore.
- Drive root contains loose stale code copies from past sessions — stale
  by default (§3 staleness rule).

### AN INSTRUMENT THAT RETURNS HEALTHY IS NOT EVIDENCE OF HEALTH
### WHEN IT CANNOT SEE THE FAILURE MODE (2026-08-21)

**Two /wal videos showed YouTube's grey unavailable box. Five rounds of probing
found nothing, because every public signal reads OK on an age-restricted
video.** Measured on both, against two working controls on the same pages:
oEmbed **200**, watch-page `playabilityStatus` **OK**, `playableInEmbed`
**true**, `isPrivate`/`isUnlisted` **false**, the nocookie `/embed/` endpoint
**200**, the microformat embed URL **present**, `availableCountries`
**identical** — and **`isFamilySafe: true`**, on an age-restricted video, with
no `ytRating` or `contentRating` field of any kind.

**`playableInEmbed: true` IS NOT A LIE — IT ANSWERS A DIFFERENT QUESTION.** It
records whether the OWNER permits embedding. An age gate is a refusal at PLAY
time, by YouTube, for the viewer. Reading the first as an answer to the second
is what cost the rounds.

**WHAT WOULD HAVE FOUND IT, IN ONE CLICK: open the embed URL in a browser and
look** — `https://www.youtube-nocookie.com/embed/<id>`. The refusal is rendered
inside a cross-origin iframe and exists in no response a script can read, so a
rendered view is the ONLY oracle.

**THE PROCESS RULE, WHICH IS THE PART THAT GENERALISES: when the only oracle is
a rendered view and Ops cannot render, ASK MIKE TO LOOK ON ROUND ONE.** Ops knew
from the first round that embeds do not paint on this host and probed the API
five times anyway, reporting healthy each time. He found it in one glance. The
probes were not wrong; they were answering a question nobody had asked.

**AND IT IS NOT FIXABLE FROM HERE.** The videos are the artists' own and the
restriction is theirs. Open row on what the museum shows instead.

### A VIDEO CAN BE UNEMBEDDABLE WITH EVERY PUBLIC SIGNAL READING HEALTHY,
### AND IT IS NOT ALWAYS AN AGE GATE (2026-08-21)

**THE SECOND INSTANCE IN ONE WEEK, AND IT IS A DIFFERENT CAUSE WITH THE SAME
SIGNATURE**, which is why it gets its own row beside the one above rather than a
sentence inside it. Building the antenna selector, one of Mike's two seed
sources — `vBAcEqq7T4Q`, FredFlix, *Channeling 1960 to 1963 TV* — draws
**"Video unavailable"** in a real iframe on **both** `youtube-nocookie.com` and
`www.youtube.com`, from a real origin, while `aA5oKoCRjWw` plays from the same
page under identical parameters.

**MEASURED SIDE BY SIDE, AND EVERY MACHINE-READABLE SIGNAL IS THE SAME ON THE
TWO:** oEmbed 200 with a real title, watch-page `playabilityStatus.status`
**OK**, `playableInEmbed` **true**, `isFamilySafe` **true**, `isPrivate` and
`isUnlisted` **false**, and **no `ytRating` or `contentRating` field on either**.

**IT IS NOT AN AGE GATE.** An age gate renders *"Sign in to confirm your age."*
This renders *"Video unavailable."* **Cause not diagnosed and not guessed at** —
what is established is that the refusal exists, that it is not the row above's
cause, and that nothing the museum can read predicts it.

**SO THE ORACLE RULE GENERALISES PAST AGE RESTRICTION: THE ONLY WAY TO KNOW A
VIDEO EMBEDS IS TO PUT IT IN A REAL IFRAME, IN A REAL PAGE, ON A REAL ORIGIN,
AND LOOK.** Not oEmbed. Not the watch page. Not the API. **Not the bare embed
URL in a top-level tab either** — that returns `Error 153`, a missing-origin
artefact, on videos that embed perfectly. The probe that works is a local page
with an `<iframe>` in it and a screenshot; that is how both of these were
settled, and it takes two minutes.

**AND THE PROBE ITSELF LIED ONCE ON THE WAY.** Swapping the dead id into the
museum's own overlay drew a POSTER and a play button — for about a second,
before the refusal resolved — and a screenshot taken in that window says the
video is fine. **A rendered oracle still has to be read after it has settled.**

**THE STANDING CONSEQUENCE FOR ANY FUTURE VIDEO SOURCE:** a source is not
adopted until it has been seen playing in an iframe, and a source that stops
working later cannot be detected from inside the museum by any gate. That is an
accepted, named cost — see the antenna round log.

### A CLICK INSIDE A CROSS-ORIGIN IFRAME RAISES NO EVENT IN THE PARENT (2026-08-21)

**IT IS OBVIOUS ONCE STATED AND IT SHIPPED WRONG ANYWAY.** The Portal's
television falls back to a muted picture when the browser refuses sound, and the
first cut listened on `window` for `pointerdown` to turn the sound back on. **The
listener could never fire.** The set fills the overlay, so every click a visitor
makes lands inside a cross-origin iframe, and such a click raises nothing in the
parent document — no `pointerdown`, no `click`, no `focus`. The code read
correctly and was unreachable.

**FOUND BY CLICKING ON THE PICTURE AND WATCHING NOTHING HAPPEN**, which is the
only way it could have been found — no gate can see an unreachable listener, and
it is indistinguishable from a listener that fired and did nothing.

**THE FIX IS A NODE OF OUR OWN OVER THE FRAME**, present only while it is needed.
`.tv-tap` is transparent, `inset: 0`, and swallows exactly one click — which
costs nothing there because the player is built with `controls: 0` and has
nothing under it to press.

**THE GENERAL RULE: any interaction the museum needs from a visitor who is
looking at third-party embedded content has to happen on an element the museum
owns.** Keyboard is the exception — focus can legitimately be in the parent — but
it cannot be the only path.

### OPS CANNOT SEE `file://`, SO EVERY MOCK IS SERVED — `npm run mock` (2026-08-21)

**THE WALL:** the Chrome extension Ops drives refuses `file://` outright —
*"Can't interact with browser-internal or unparseable URLs."* **So a mock written
to disk is INVISIBLE to Ops by construction.** It can be built, described, and
handed to Mike without anyone on this side ever having looked at it.

**IT HAS NOW COST TWO ROUNDS.** On **15 August** the test harness hit the same
wall and the fix was to serve it over HTTP. On **21 August** the rebuilt feed
panel was written to `docs/` and reported to Mike unseen; **he came back with
eight faults, every one of them visible in a screenshot** — four screws at the
same angle, an extra dark bar under the plate, a readout whose longest string
needed 306px of a 151px box, and a knob pointer 107° off the label it was
supposed to aim at.

**THE STANDING RULE: any mock, render or comparison built for Mike to judge is
SERVED OVER HTTP AND ITS URL GOES IN THE REPORT. Ops looks before Mike does. A
rendered artefact with no URL cannot be checked by Ops and must not reach him.**

**THE MECHANISM IS ONE COMMAND, because a rule that depends on remembering costs
a round every time it is forgotten:**

```
npm run mock          → http://127.0.0.1:8899/  (docs/, read-only)
npm run mock -- 8123  → another port
```

`tools/serve-mock.mjs` serves `docs/` and only `docs/`. **It is deliberately not
`public/`:** the lap harness has to live there to be same-origin with the museum,
which is why `npm run lap:clean` exists and why `public/` is one deploy from
being published (see §0 DEPLOY — THE ONLY ACCOUNT). A mock has no such
requirement.

**AND THE SECOND HALF OF THE LESSON IS NOT ABOUT THE EXTENSION.** Three of the
eight faults were things no probe reports: `text-overflow: ellipsis` makes an
element report `scrollWidth === clientWidth` while hiding half its text, so the
readout could not detect its own overflow; a hardcoded pointer angle is valid CSS
that points at nothing; and an extra decorative element is indistinguishable from
a shadow until somebody looks at it. **Serving it is what makes looking possible;
looking is still the step.**

### A STALLED HARNESS AND A STALLED CEREMONY LOOK IDENTICAL — THE ONLY ORACLE
### FOR PLAYBACK IS A PERSON IN A FOREGROUND TAB (2026-08-21)

**THE CASE THAT CLOSED IT.** The 20 August round reported the twin's boot
ceremony stalling at 89 seconds and left it open. **Mike ran it and the boot
COMPLETED.** The ceremony reaches its level-specific section; what stalled was
the harness. This is the `requestAnimationFrame` hazard above wearing a costume:
rAF does not fire in a frame nobody is painting, so the thing under test and the
thing doing the testing fail in exactly the same way and produce the same
reading.

**AND IT IS WIDER THAN rAF — VIDEO IS THE OTHER HALF.** The Chrome the extension
drives keeps every tab at **`document.visibilityState: "hidden"`**, and Chrome
does not start video in a tab it is not showing. Measured on the Portal's
television, after a latch: `player state −1 (UNSTARTED)`, `currentTime` correctly
cued, `muted true`, the sound catcher rendered. **Every link in the chain was
provably built and tuned, and the picture still did not move.** A round reading
that as *television is broken* would be reporting the harness.

**TIMERS ARE THROTTLED IN THE SAME TAB, WHICH BREAKS THE PROBE'S CLOCK TOO.**
`Television.jsx`'s refusal path ticks a 350ms interval and gives up at try 5 —
1.75s. Under background throttling the tick floor is ~1000ms, so it lands at
~5s. **A first reading taken at 3 seconds says the fallback never ran, and is
wrong.** Any probe that waits *n* milliseconds for a timer-driven path on this
host has to budget for the throttle or it will file a phantom defect.

**WHAT IS STILL PROVABLE FROM HERE, AND WHAT IS NOT.** Provable: that the player
BUILT (one iframe, the right host, the `allow` attribute present), that it TUNED
(`getVideoData()` returns the id and title, `getDuration()` returns a length),
and that the source is EMBEDDABLE (`onReady` fires and `onError` does not).
**Not provable: that it MOVES.** Say which of those was measured; never let the
first three stand in for the fourth.

### `getAttribute("style")` IS THE TARGET, `getComputedStyle` IS THE
### INTERPOLATED VALUE, AND FOR 420ms THEY DISAGREE (2026-08-21)

**THE CASE.** The Portal drum carries `transform .42s cubic-bezier(.2,.75,.25,1)`.
Two probes written to answer *which face is the visitor looking at* both lied, in
different directions, and one of them nearly reversed a correct finding:

- A `getBoundingClientRect()` heuristic for "the front face of the 3D barrel"
  reported an **off-by-one between the glass and the resolver** — at **+1** in one
  reading and **−2** in the next. **The tell was that it returned IDENTICAL
  geometry at two different drum positions**, which no real off-by-one can do.
- A probe reading `getComputedStyle(el).transform` caught a `matrix3d` for 45°
  while the style attribute held the target 90°, and reported it as **the drum
  moving on its own with no input**. There was no input and there was no movement:
  it read a transition in flight.

**THE RULE.** On any animated element the style attribute holds where it is
GOING and the computed value holds where it IS. Take state measurements off the
attribute; take visual measurements only after the transition has finished; and
**never rank 3D-transformed siblings by their client rects** — a barrel's front
and back face both sit at the same centre.

**AND THE HALF THAT IS NOT ABOUT CSS.** The panel's readout and the payload its
latch dispatches are React state and are correct on the same tick as the click.
**Only the picture lags.** So a screenshot taken mid-roll shows one channel while
the panel is correctly reasoning about the next one — *the instrument is right
and the photograph of it is wrong*. A round driving a panel faster than its own
animation will manufacture defects that are not there; put the settle in the
probe, not in the report.

### A CIRCULAR SIZE RESOLVES TO ZERO, NOT TO AN ERROR (2026-08-21)

**THE CASE.** The Portal's screen needed to fit an overlay in BOTH axes and keep
a picture's ratio. A box with `aspect-ratio` cannot honour both `max-width` and
`max-height` without distorting, so the first cut let the bezel `<img>` size the
frame and positioned everything against it — the img shrinks to two constraints
and keeps its proportions, which is true and is why it looked right.

**IT CAME BACK 0 x 0.** The img's `max-width:100%` resolves against its parent,
and the parent's size was to come from the img. **The browser does not warn on a
circular size; it resolves it to zero**, and every rule in the file reads
correctly while nothing is on the screen.

**THE FIX AND THE RULE: SIZE AGAINST AN ANCESTOR, NEVER A DESCENDANT.** The wrap
is a `container-type: size` and the frame is
`width: min(100cqw, calc(100cqh * var(--arn)))` with the ratio passed in as data.
**Whenever a measurement comes back 0, suspect a loop before suspecting the
element** — a mis-set value is usually wrong, but a zero is usually circular.

### `!important` IS SOMETIMES THE HONEST ANSWER, AND IT IS THE SECOND HALF OF A
### TWO-OWNER LAYOUT (2026-08-21)

**THE CASE.** The museum draws the Portal's bezel; `twin.html` draws the picture
inside it. Every number in both was correct and **the art sat 1104px wide inside
a 1200px frame** with black showing between. `#unitstage` is capped at
`min(96vw,880px)` and then re-written by the twin's own **portal size dial**,
which writes an INLINE width — a real control, ruled and persisted.

**TWO OWNERS OF ONE DIMENSION IS THE DEFECT; THE OVERRIDE IS THE FIX.** Framed,
the overlay decides how big the Portal is, so the framed stylesheet overrides the
dial with `!important` — it is fighting an inline style, which is the one case
where nothing weaker works — and the source says so at the declaration. The dial
is untouched standalone, where it is the only thing deciding.

**AND NEITHER HALF WAS VISIBLE TO A PROBE.** `getBoundingClientRect` on the frame
read exactly what it should; the mismatch was between two elements nothing
compared. **It took a screenshot.** Ratios and offsets that live in two documents
have to be measured against EACH OTHER or looked at — reading either one alone
proves nothing.

### A COMMENT INSIDE A LIST A REGEX PARSES IS NOT A COMMENT (2026-08-22)

**THE CASE.** `heldModulePrefixes()` in `reveal/reachability.mjs` finds the hold
by regexing every `"..."` out of the `HELD_PATHS` array literal in
`vite.config.js`. Publishing the Portal meant taking its path OUT of that array —
and the comment recording the ruling **quoted the path it was removing**. The
regex read the comment, put the path straight back, and the Portal was still held
by its own epitaph. Two more quoted phrases in the same comment became phantom
prefixes that would have matched nothing and told nobody.

**THE RULE: inside any list a tool parses by regex rather than by AST, a comment
is data.** Write the path in prose, in backticks, or not at all — never in the
delimiter the parser is looking for. The fix here was to de-quote three phrases;
the cost of not noticing was a gate passing while the door stayed shut.

### ON THIS SITE A MISSING IMAGE IS A 200, AND ONLY THE DECODE TELLS THE TRUTH
### (2026-08-22)

**MEASURED ON THE LIVE WORKER:** `/robots/does-not-exist.png` returns
**200 `text/html`, 9,111 bytes** — a missing governed path falls through to the
SPA and gets `index.html`. So does every deleted photograph. **A status check
calls them present.**

**WHAT STILL WORKS, AND IT HAD TO BE MEASURED RATHER THAN ASSUMED:** the twin's
loader ladder depends on `img.onerror`, and an `<img>` handed HTML with a 200
**does** fire it — the decode fails. Verified in the browser on all three deleted
files, against a live one at the same prefix returning `onload` at 3000×2400.

**THE RULE: never probe for a missing asset with a status code here.** Load it
and watch the decode. And when a fallback ladder is the thing under test, test
the ladder, not the transport.

