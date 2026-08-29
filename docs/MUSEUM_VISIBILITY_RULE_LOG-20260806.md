<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# THE VISIBILITY RULE + FORMAT CONFORMANCE — round log

**2026-08-06 · V1 · F1 · F2 · G1 · C1 · autonomous, single agent, drafting lane,
sealed with one commit.**

Gates: `npm run lint` **11 errors / 9 warnings = baseline** · `npm run build`
**green** · `npm run provenance:gate` **PASS** (0 undeclared · 0 stale · 0
invention) · `npm run reveal:check` **PASS** · `npm run parity:gate` **PASS, 4
shared · 0 divergences** · `npm run assets:orphans` **0** · lap **on the built
bundle under `wrangler dev`**, in BOTH stages, **desktop only** (M97 again —
`window.innerWidth` reads 1228 and `resizeTo` is refused).

---

## THE ONE-PARAGRAPH VERSION

Five instructions, all five built. **The round's largest finding is that the
launch build was building half the application and saying it had finished.**
`npm run build:launch` came out of the first cut of `tools/stage-build.mjs`
calling vite's node `build()` API; this project has two vite environments and
that API drives only the client, so the client came out in the LAUNCH state —
the twenty-six withheld photographs gone from the bundle — while
`dist/weird_baby/index.js` was left over from the previous DEVELOPMENT build and
both stage doors stood open. A deploy would have published a launched museum
with its doors wired open, and **the only thing on the wire that said so was one
word in `/api/held`.** Caught by checking the wire instead of the console, which
is how H1's `run_worker_first` outage was caught, and it is the same sentence:
**a build that builds half the app looks like a build.**

---

## V1 — THE VISIBILITY RULE

**Mike, reversing his own instruction of the round before and giving the
reason:** *"DURING DEVELOPMENT, SHOW EVERYTHING THAT IS PLACED, until asked to
filter. The pull-back rule is a LAUNCH-STATE rule, not a development-state one.
Mike cannot direct what he cannot see. THE PORTAL COMES BACK IMMEDIATELY."*

### What was NOT touched, and it is most of it

H2's sentence stands word for word — *a picture of the objects does not appear
on any public surface until a Record entry delivers it* — and every mechanism
that enforces it is unchanged. The photographs still sit under `public/held/`.
`reveal/delivery.mjs` still fails a build that puts an undelivered picture at a
public address, in both directions, with one written exception and no
fall-through. The ledger still says HELD. `HELD_PATHS` still parks the Portal's
chunk behind a door.

**What was wrong is that the rule had only ONE state, so the only way to obey it
was to be in it.** A museum that has not opened is not publishing; it is
BUILDING, and the person building it has to be able to see the room. The lobby
says *"We're not open yet"* on its own glass — the launch state was being
enforced against a building that has not launched.

### The stage — `reveal/stage.mjs`

Two words, one declaration, `WB_STAGE`, default **DEVELOPMENT**.

| | |
|---|---|
| **DEVELOPMENT** | everything PLACED renders — the Portal is in the deck, the photographs are on the walls. The held/delivered state is unchanged in the data and in the ledger; it is simply not applied to the view. |
| **LAUNCH** | the pull-back is applied. An undelivered picture has **no address in the bundle at all** — not a hidden one, not a 404ing one, none — and the Portal is behind the password it has been behind since H1. |

An unknown value THROWS rather than falling back: a typo'd `WB_STAGE=lanuch`
silently building development is the failure this whole file is about.

**THE DEFAULT IS A DECISION WITH A COST AND IT IS STATED RATHER THAN LEFT TO BE
FOUND.** While the default is DEVELOPMENT, a deploy publishes the Portal and the
twenty-six photographs to anybody who visits weird.baby. That is the
instruction. It is one word to reverse (`npm run deploy:launch`) and it is not
something a future session may quietly flip by editing a default.

### THE TWO HOLDS ARE TWO DOORS NOW, AND THAT IS THE LOAD-BEARING HALF

`/hr` and the Portal were behind the same prefix. The moment a switch exists
that opens a door it matters enormously WHICH door, because that one list was
guarding two completely different things:

| | prefixes | who opens it |
|---|---|---|
| **THE PERMISSION HOLD** — `/hr`. The museum does not have Hunter Root's permission (R5), and a permission hold does not expire when a museum opens; it expires when the permission arrives. | `/assets/locked/` · `/locked/` | the password, **in every stage**. No flag, no env var and no build reaches it. |
| **THE STAGE HOLD** — the Portal and the machines' photographs, held until launch (H1/H2). | `/assets/held/` · `/held/` | open in DEVELOPMENT; the password at LAUNCH. |

Had these stayed one list, the one word that lets Mike see his own building
would also have republished ninety-three of Hunter Root's tracks and a hundred
and seven vault image URLs. The worker tests the permission door FIRST and its
branch does not mention the stage — written in that order on purpose, so a
future edit that widens the stage condition cannot widen it onto `/hr` — and
**check 9 asserts that the branch is free of `__WB_STAGE__`.**

### The placement rule — one function, five callers

`reveal/placement.mjs` is pure and importless. **The data declares only the
PUBLIC address** — `/robots/reference/photos/front_full.png`, the address the
picture will have the day the Record delivers it — and the resolver computes the
held prefix. That is what keeps `reachability.mjs` check 4 ("a public file
naming a held address") able to mean anything at all: the held prefix is typed
in exactly one file in `src/`, and that file is on the door list.

**AND THE RUNTIME PASS ALONE WAS NOT GOOD ENOUGH, WHICH IS THE THIRD TIME THIS
LESSON HAS BEEN PAID FOR.** `src/lib/placement.js` resolves the address when the
module loads, so at LAUNCH the renderer draws nothing — and the first launch
build still carried the public address of all twenty-six withheld photographs in
plain text, because a string the resolver declines to use is a string the bundle
shipped. R5 shipped 153 mp3 URLs that way; H1 shipped the whole reveal ledger
that way. The `wb-placement` plugin in `vite.config.js` resolves the literals at
`enforce:"pre"` — the same arrangement, and the same reason, as
`stripVaultAudio` and `publicLedger`.

Measured on the built bundle:

| governed literal | DEVELOPMENT | LAUNCH |
|---|---|---|
| the 24 withheld photographs and covers | `/held/robots/…` | **absent** |
| `rear_power_switch.png` (delivered, Record 013) | `/robots/…` | `/robots/…` |
| `wbr-cover-logo.png` (declared signage) | `/robots/…` | `/robots/…` |
| the Portal's own cover + poster | `/held/robots/…`, inside the held chunk | same, inside the held chunk |

### Verified on the wire, in both stages

`wrangler dev` on the built bundle, no cookie:

```
DEVELOPMENT                                              LAUNCH
200  /held/robots/art/portal-cover.png                   404
200  /held/robots/reference/photos/front_full.png        404
200  /held/robots/twin.html                              404
200  /assets/held/portal-<hash>.js                       404
404  /assets/locked/HrSpine-<hash>.js                    404   ← the permission door, both
200  /robots/reference/photos/rear_power_switch.png      200   ← the one delivered picture
200  /robots/art/wbr-cover-logo.png                      200   ← the wing's own sign
200  /api/held · /api/guestbook (JSON)                   200   ← four routing rules, back end alive
```

`/api/held` reports the stage, read off the same literal the refusal reads, and
`/admin` prints it: **SHOWING · Everything placed**. Nothing on a public surface
says it — what stage a museum is at is a fact about the WORK (Doctrine 11).

### THE FINDING: THE LAUNCH BUILD BUILT HALF THE APPLICATION

The first `tools/stage-build.mjs` was four lines: set the variable, `await
build()` from vite's node API. It ran clean and printed a full chunk table.
**`@cloudflare/vite-plugin` registers the worker as a second environment that
only the CLI drives**, so the client was rebuilt in the launch state and the
worker was not. `/api/held` said `development` while the client said launch, and
the doors stood open on a launched museum. It spawns the CLI now.

### And the gate checks the LAUNCH state rather than the current view

Mostly **by construction rather than by a branch**, which is the design and not
an accident: every check in `reachability.mjs` and `delivery.mjs` reads SOURCE
and the TREE, and neither moves when the stage does. What is left is the one
thing that does move, and **check 9 tests it by CALLING the rule with a launch
configuration** — the only way to test a state you are not in, and the reason
the rule is a pure function rather than a branch inside the browser module.

### One thing the ledger now says that needs reading carefully

`npm run surfacing` still lists the Portal as on the back shelf, and the ledger
still says `state: HELD`. **That is correct and it is the LAUNCH posture**, not a
description of what is on screen today. The ledger records what a visitor will
be able to reach when the museum opens; `reveal/stage.mjs` is where the other
half is written down.

---

## F1 — EVERY WING FAQ IS THE BOOTH'S, EXACTLY

**Mike, and it is the third time the format has been ruled:** *"THE ROBOTS FAQ
USES THE INFORMATION BOOTH'S LAYOUT AND FORMAT, EXACTLY. Today it has a
different title format, extra text above the table, and a footer that does not
belong. STRIP ALL OF IT."*

**THE THIRD TIME IS THE FINDING, NOT THE INSTRUCTION.** R7 conformed the
ACCORDION across four faces and stopped there, because an accordion was what
that round was asked for. It left every FAQ face free to declare a `blurb`, a
`lines` register, a `still` and a `footer`, and the robots front desk had all
four. **A format enforced by a round is a format that lasts until the next
round; the reason it has been ruled three times is that it has never once been a
MECHANISM.**

So it is a factory. `src/data/faq-face.js`'s `faqFace(subtitle, entries)` takes a
wing's name and its questions and returns a face. There is no argument for a
blurb, so a wing cannot add one; no argument for a footer, so no wing can sign
off in its own words. The next session that wants a paragraph above a question
list has to edit that file, in front of the note explaining why it cannot.

**What maps onto what:**

| the booth | a wing's FAQ face |
|---|---|
| MuseumBar — brand / room / exit | the exhibit's own bar and its exit |
| the credo block | the face head — `FAQ` over the wing's name |
| the word **Questions** | `FAQ_HEAD`, printed by `FaqEntries` |
| the question list | the same accordion, element for element |
| the sign-off with the address | `SIGN_OFF` + `ADDRESS`, printed by `FaqEntries`, a real `mailto:` |
| *"Back to the lobby"* | **NOT carried across** — see below |

**THE SECOND EXIT IS THE ONE THING NOT CARRIED, AND IT IS A JUDGEMENT.** The
booth's closing link exists because a sheet is a long scroll and its own note
says so. An exhibit face sits in a framed panel beside a tracklist with the
wing's bar and its exit on screen the whole time; printing a second way out
there would be M3's own complaint — two ways out of a room — reinstated on five
faces at once. The exit is present; it is already present.

**Five faces conform**: the robots front desk, both machine FAQs, both
Foundation tracks, and the Portal's own (which matters most — a held album is
the easiest place in the museum for a format to drift, because nobody laps it).
Plus `/wal`'s new one. `/booth` reads `FAQ_HEAD` and `SIGN_OFF` from the same
declaration rather than typing them, which is Doctrine 17 applied the moment a
passage stopped belonging to one room.

**What was struck on the robots front desk, named rather than deleted quietly:**

| | why it goes |
|---|---|
| **the title** — "Frequently asked" | the only FAQ face in the museum not called FAQ. Two objects with one job and two names. |
| **the 1965 blurb** | Welcome's lead, folded in at R3. True, and three sentences of orientation above a list whose first row is *"Where do I start?"*. The wing's arrival story is what THE RECORD is; R3's own note says the FAQ "stops being the place that says everything" and this was the last thing left saying it. |
| **the UNITS / ON FILE / TRADE register** | its three rows are the tracklist beside it, four faces the visitor is looking at, and a posture sentence answered at length two questions down. |
| **the footer** | *"'Restoration house' is not what we are…"* — the house signing off its own answers where the booth signs off with the address. Its [PAPA] clause is preserved in OPEN_ACTIONS. |
| **three face stills** | the family shot, `column_lit.jpg` and the bezel. The booth has no image, and all three are still tiles on the archive walls, which is where they were already doing their second job. |

**What is lost and has nowhere else to go: nothing.** Each is said better by an
object the visitor can already reach.

---

## F2 — "THE DEAL" IS BURNED, AND AN FAQ STANDS WHERE IT WAS

**Mike:** *"WAL: BURN AND DISCARD 'The Deal' — junk. ADD A FAQ, in the booth's
format."*

The face was ~280 words of the house talking about itself, in the one room whose
whole ruling is that the ARTISTS shine and the house is a listener in the row
with everybody else. Four paragraphs, a seven-row tombstone, a still of the
room's own printed card, a quiet door to the booth, and the name — R5a picked
"Welcome" for it and F2 replaced that with "The deal"; **both were arguments
about what to CALL a page whose problem was that it existed.**

**Where each claim survives, checked rather than asserted:**

| claim | where it still is |
|---|---|
| four artists, eight songs | the carousel, and the bill on the track above |
| every door leads out | every door, on every card |
| nothing to sign up for, no account | `/booth` — *"Is it really free?"* |
| a page name and a timestamp | `/booth` — *"Are you tracking me?"* |
| the quotes were read at the source | each artist card's own citations |
| **what the pictures are, and that they come down on request** | **nowhere else** |

**THAT LAST ROW IS A JUDGEMENT AND IT IS FLAGGED AS ONE.** It is the only thing
on the struck face with no other home, and it is an undertaking to four real
people rather than a description of the room. Carrying an undertaking into a
question is the opposite of the thing Mike is striking — the objection is to a
wall of house prose in the artists' room, and a question a visitor actually asks
is not that. The wording is MOVED, not rewritten. One line reverses it.

**Nothing else on the face is new.** The first two answers are the booth's own,
hoisted to `house-copy.js` and printed in both rooms because that is where the
question is asked (R7's rule) and D1's rule is what stops that costing a
divergence. The fourth is the house's standing contact passage.

---

## G1 — THE GUEST BOOK, MEASURED

**Mike:** *"THE GUESTBOOK ROWS ARE TOO TALL. I would accept a few pixels; this is
far more. Can the wrap be kept at the OLD height? If not, BY HOW MUCH are the
current entries missing a no-wrap fit today — state the number. Then fix to the
tightest honest option."*

### The two answers, measured on the built bundle at 1920px

**CAN THE WRAP BE KEPT AT THE OLD 30px? NO.** A genuinely two-line row composes
at **37.11px** — 5px of padding, two 15.552px line boxes, a 1px rule. 30px is
**7.11px short** of one.

**BY HOW MUCH ARE THE CURRENT ENTRIES MISSING A NO-WRAP FIT? THEY ARE NOT.** The
longest signature in the book — **James E, 89 characters** — sets in **614.77px
inside a 677.77px column. It clears one line by 63.00px**, about nine
characters. Read against the live guest book (six signatures), **not one of them
wraps at desktop.**

| signature | chars | column | one line | slack |
|---|---:|---:|---:|---:|
| James E | 89 | 677.77 | 614.77 | **+63.00** |
| Larry Leibensperger | 57 | 603.63 | 393.73 | +209.90 |
| Papa Weird.Baby | 33 | 619.81 | 227.95 | +391.86 |
| Sammy B | 9 | 677.53 | 62.17 | +615.36 |
| Tommy | 8 | 690.85 | 55.27 | +635.59 |
| Mo | 4 | 713.27 | 27.63 | +685.64 |

**So the question does not bind, and the 52px row was reserving a second line
nothing is using.** A one-line row composes at 21.55px. That was **30.45px of
air per signature and 91px across the three-row window**, which is the thing he
is looking at.

### The fix: the row is as tall as the tallest signature in the book

Not a smaller hand-set number. The second line is not wrong, it is unused —
L1's ruling stands and a visitor may still type 88 characters and fill it — and
a hand-set 38px would be a hand-set number again the moment the ramp or the
budget moves, which is how this file got a 52 and a 74 in it.

**Measured: `--gb-row` is 23px today** (52 → 23; the window 158px → 71px). Below
the 30px he remembers. The day somebody writes a long one, every row becomes
38px together.

P12's arithmetic is untouched and is the reason this can change at all: rows
stay uniform BY CONSTRUCTION, so the cap is still a whole multiple of `--gb-row`
and the stepped scroller still translates in it. `rowPx()` reads the property off
the element, so the drag follows for free. It is D1's mechanism, second use —
release, read back, restore inside a layout effect.

**The stylesheet's 52 and 74 stay as the CEILING** — the no-JS value and the
value before the first measurement, both above the composed worst case (37.11
and 67.66), so the book never clips on the way to being right.

### Two findings the measurement produced

**THE FIRST CUT MADE IT REACT STATE AND WAS WRONG IN A WAY WORTH RECORDING.**
Written as `useState` + a `style` prop, the measurement wrote `--gb-row` through
React and the NEXT measurement released it with `removeProperty`, which wipes
React's own inline value; the re-measure produced the same number, `setState`
bailed out on an unchanged value, React never re-rendered, and the property
stayed gone. The book silently fell back to the stylesheet's 52px —
correct-looking, never clipping, and doing nothing. It survived a build and a
page load and was caught by reading `element.style` on the glass. **The rule it
leaves behind: a DOM property that an effect RELEASES cannot also be owned by
React. One writer.**

**AND MEASURING THE STACKED CASE FOUND L1's OWN BUDGET DERIVED WRONG.** Its note
says 88 characters is *"44 characters a line and the block holds 88"* — two
lines at a 310px row. Composed offscreen at 310px, **88 characters take THREE**,
for every word length tried and for the real 89-character note: **text wraps at
word boundaries, not at column 44.** The row is 67.66px, the hard-coded 74
covers it, and nothing has ever clipped — the number was right by luck rather
than by the arithmetic that produced it. Measured, it is right by construction.

---

## C1 — THE CULL

**Mike's standing rule:** *"IF WE ARE NOT USING IT, GET RID OF IT. Anything
held-but-placed stays; anything referenced by nothing goes."*

### THE CULL'S OWN INSTRUMENT WOULD HAVE CONDEMNED TWENTY-SIX PHOTOGRAPHS

Run first, before any deletion, `npm run assets:scan` reported **296
unreferenced files** — including every photograph V1 had just put back on the
walls. `usedBy` is a substring test on the file's `ref`, and a governed picture's
`ref` is `/held/robots/…` while the data now names `/robots/…` **by design**,
because a held address in a public chunk is the leak the whole boundary exists
to stop. The consequence lands on the one instrument whose output is a DELETION
LIST.

**FOUR INSTRUMENTS BROKE ON ONE CAUSE IN ONE ROUND**, and the cause is one
sentence: **a picture has two addresses now, and anything that matches on one of
them is wrong.**

| instrument | what it would have done |
|---|---|
| `usedBy` in `tools/asset-table.mjs` | named 26 photographs as unreferenced, on the round that restored them |
| the disk check in `provenance/assets-declare.mjs` | reported 28 declared pictures as MISSING ON DISK |
| the M99 drift guard in the same file | read 27 held/public twins as 27 losses and refused a safe regeneration |
| `seenAssets` in `tools/provenance-sweep.mjs` | failed the gate on the Portal's two, which a held module correctly names at the held address |

All four now resolve the twin, and all four import `STAGE_PREFIX` rather than
typing it.

### What was actually culled

With the instruments honest, the served tree had **14 unreferenced files**.
Three were deleted; eleven were kept, for reasons on the record.

| deleted | size | why |
|---|---:|---|
| `public/WeirdBaby_PhotoID_backup.png` | 703 KB | **the file is TRUNCATED** — the PNG stream never reaches IEND, already judged `wrong` in the asset table. A broken image at a public URL, referenced by nothing. |
| `public/images/wb-merch/hunter-root.png` | 1.8 MB | Hunter Root's gift-shop banner, referenced by nothing, at a public address — and R5 says the museum does not have permission to serve his material. Doubly right. |
| `public/held/robots/art/mgk-viii-cover.jpg` | 278 KB | the SUPERSEDED MGK-NIAC cover, carrying a name the wing retired on 2026-08-05. M9 kept it on the reading that *"a real photograph is not deleted by a cover change"* — which protects the PLATE it was cut from (`core_helical.jpg`, still on disk and still the album's badge), not the derived cover, which is house artwork the house no longer uses. |

Plus two empty directories left by H2's move (`public/robots/manual`,
`public/robots/reference/mgk-viii`). **2.7 MB.**

### KEPT, AND THIS IS THE PART TO READ

**The ten `public/held/robots/reference/mgk-viii/*.jpg` plates** —
`bench_power`, `chest_grille`, `feet_plinth`, `head_lens`, `head_oblique`,
`limbs_lower`, `matrix_lit`, `parts_drawer`, `slot_mockup`, `torso_unfinished`
(1.2 MB). They are `egg.niac.operator`'s material: LIVE, HELD, printed nowhere by
Mike's own ruling. **And the ledger's claim that they also live in
`weird-baby-robots` is FALSE** — checked file by file; that repo has no copy, so
the museum holds the only ones. Deleting them empties a ledgered egg and
destroys ten original photographs of the museum's own object. Held-but-declared
is the carve-out his rule already has. **Register C-a**, with the false ledger
claim as **C-b**.

**`public/held/robots/manual/structure-issue-p1.png`** (100 KB) — the only
photograph the museum holds of the manual's title page. It was struck from the
face at P1–P5 by a ruling about the FICTION printed on that page
(*TEXT NOT SUPPLIED*), not about the photograph. **Register C-c.**

### The robots repo

**115 images, 0 referenced by nothing.** Method: every image basename tested
against the full text of both repositories. Nothing to cull there.

### And `docs/` is not junk either

61 screenshots across nine round folders, **61 of them cited by a round log**.
The museum's own visual record of its own rounds; nothing culled.

### `npm run assets:cull` — the deliberate counterpart of `--rename`

C32 keeps a judged row whose file has vanished and REPORTS it, which is right for
a LOSS — a verdict is an inspection somebody did. But it means every deliberate
deletion leaves a permanent row in `--orphans`, and **an orphan report that is
never zero is a tripwire nobody reads** — the disease `CLAUDE.md`'s own lint
baseline caught. So there is a command a person types. It refuses a file that is
still on disk.

---

## THE LAP

`wrangler dev` on the built bundle, desktop, both stages.

| what | reading |
|---|---|
| `/robots` deck | **four covers** — the wing sleeve, PORTAL, MGK-NIAC, MGK-VIIIp. The Portal is back. |
| mainframe Image Archive | four groupings, counts 1 · 2 · 2 · 5 |
| portable Image Archive | four groupings, counts 3 · 3 · 3 · 9 |
| broken images, all routes | **0** |
| every FAQ face | head · **QUESTIONS** · the list · *Thank you for coming. papa@weird.baby* · no blurb, no register, no footer, no still |
| `/wal` tracklist | **About the Artists · FAQ**. "The deal" is gone from the building. |
| `/booth` | unchanged in substance; both hoisted answers render; no `[PAPA]` on the glass |
| guest book | `--gb-row: 23px`, box 71px, rows uniform, nothing clipped |
| `/admin` | **SHOWING · Everything placed** |
| routes | `/` `/booth` `/shop` `/foundation` `/wal` `/wb` `/robots` `/hr` `/hr/archive` all 200 |

**M97, fourth round running:** `window.innerWidth` reads 1228 and will not go
below it; `window.resizeTo(390, 900)` is refused silently. The 390px half of the
lap did not run. The stacked guest-book figures in G1 are composed offscreen at
the same 310px row, which is the honest substitute and is said as one.

---

## FILES

**New:** `reveal/stage.mjs` · `reveal/placement.mjs` · `src/lib/placement.js` ·
`src/data/faq-face.js` · `tools/stage-build.mjs`.

**Changed:** `vite.config.js` (the stage define, the two chunk doors, the
`wb-placement` plugin) · `src/worker.js` (two door lists, the stage branch, the
stage in `/api/held`) · `wrangler.jsonc` (four routing rules) ·
`reveal/reachability.mjs` (check 9, both prefix pairs) · `reveal/delivery.mjs`
(`publicPlacements`, derived trees) · `src/data/artists/robots.js` ·
`src/data/artists/portal.js` · `src/data/artists/foundation.js` ·
`src/data/artists/worth-a-listen.js` · `src/data/house-copy.js` ·
`src/routes/InfoBooth.jsx` · `src/routes/robots/Robots.jsx` ·
`src/routes/WbAdmin.jsx` + `.css` · `src/routes/WbHome.jsx` + `.css` ·
`src/routes/exhibit/Exhibit.jsx` + `.css` · `src/lib/held.js` ·
`tools/asset-table.mjs` · `tools/provenance-sweep.mjs` ·
`provenance/assets-declare.mjs` · `eslint.config.js` · `package.json`.

**Deleted:** three images (above), two empty directories.

---

## THE PROVENANCE PASS

91 undeclared strings and 15 undeclared assets after the round's edits.

- **34 rows CARRIED from the pre-H2 register**, byte-identical text in the same
  file — the restored archive captions, whose rows H2 pruned. Recovered from git
  rather than re-classified, on D1's rule: re-deciding an origin is a chance to
  give a sourced line a different origin than it had yesterday.
- **24 declared fresh.** Two of the WbAdmin paragraphs were NOT carried even
  though their class is unchanged: moving the JSX inside a ternary changed their
  indentation and therefore their text, and a carry is only sound when the text
  is byte-identical. Declared VERIFIED against the doors, which this round
  measured.
- **47 stale rows pruned against a copy**, and the gate named the breaks exactly
  — **18 chains, all pointing at the struck "The deal" tombstone**. They resolve
  to two strings: `WORTH A LISTEN` (a face subtitle) and
  `WORTH A LISTEN · WEIRD.BABY` (a footer). **RECLASSED, not repointed**: a
  room's own name printed as chrome is HOUSE, which is what every sibling
  subtitle already is (`THE WEIRD.BABY FOUNDATION`, `WEIRD.BABY ROBOTS`). They
  were RESTATED for a coincidence of adjacency — a room's name pointing at the
  tombstone of a page that happened to sit under it — which is the fifth time
  that shape has been found.
- **H-b IS ANSWERED, and by the round rather than by a preference.** V1 settled
  which of `assets-declare.mjs` and `assets.json` is the source: the DATA
  declares the public address, so the declarer was right and H2's 28 hand-edited
  `/held/…` rows were the drift. Folding them back deleted nothing — the same
  twenty-eight pictures at the other address.

Final: **0 undeclared · 0 stale · 0 invention · 0 undeclared assets.**
