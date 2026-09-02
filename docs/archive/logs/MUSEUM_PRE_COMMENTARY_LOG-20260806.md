<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# THE PRE-COMMENTARY ROUND — H1…H8

**2026-08-06. Autonomous, single agent, drafting lane. Mike holds his
page-by-page commentary until this lands, so the goal was: nothing he would find
is already known to us.**

**GATES.** lint **11 errors / 9 warnings = baseline, zero new** · build **green**
· `provenance:gate` **PASS** (0 undeclared · 0 stale · 0 invention) ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** · lap
on the **built bundle** under `wrangler dev`, ten routes plus an unmatched path,
at desktop and 390px: **no horizontal overflow anywhere, no console errors,
no uncaught rejections.** Surfacing **13 · 13 · 15 — unmoved.** This round
surfaced nothing off the shelf and took nothing onto it; said plainly rather
than dressed up.

---

## H1 — `/hr` GOES PRIVATE, AND THE TEST THAT PROVED IT ALSO CAUGHT AN OUTAGE THAT WOULD HAVE TAKEN THE WHOLE BACK END DOWN

**IT IS BUILT AND IT IS ENFORCED AT THE SERVER.** `/hr` and `/hr/archive` are
lazy chunks parked under `assets/held/`; `src/worker.js` refuses that directory
without a cookie; the cookie is minted only by the password on `/admin`; the
password is `env.HR_KEY`, a wrangler secret with **no default**.

**THE REASON IT IS NOT A REACT PASSWORD IS R5, ONE ROUND OLD.** R5's own finding
was that a runtime filter stops the REQUESTS and still ships the ADDRESSES — the
first build after that filter carried 153 vault mp3 URLs in plain text. A
password checked in the browser does exactly that with a whole wing: the
catalogue, the deck, the artifacts and 107 vault image URLs sitting in a public
bundle behind a boolean anyone can flip in a console. **So the same lesson is
applied to the same artist's material a second time, and the mechanism is the
same shape: one rule, enforced where the bytes are.**

**MEASURED ON THE BUILT BUNDLE.**

| | before | after |
|---|---|---|
| public JS | 724.8 KB in one chunk | **536.6 KB** across three |
| held JS | — | **189.1 KB** in `assets/held/` |
| vault **image** URLs in the public bundle | **107** | **0** |
| vault **mp3** URLs anywhere | 0 (R5) | 0 |
| Hunter Root catalogue strings in public chunks | present | **none** |

**THE OUTAGE, AND IT IS THE MOST USEFUL THING IN THIS SECTION.** Gating the
directory needs `run_worker_first` in `wrangler.jsonc`, because Workers Assets
serves a matching static file BEFORE it invokes the Worker. Declaring that list
**changes the default for everything not in it.** With only `"/assets/held/*"`
declared, `/api/admin`, `/api/guestbook`, `/api/visits` and `/api/presets` all
stopped reaching the worker and were answered by the asset store — which, because
`not_found_handling` is `single-page-application`, returned **`index.html` with a
200** to every one of them. Nothing errors. The guest book would have posted into
an HTML page; the admin dashboard would have parsed a document as JSON. **The
site would simply have stopped having a back end, silently, on deploy.**

Caught because the verification ran against `wrangler dev` on the built bundle
rather than against reasoning. `/api/*` is now named explicitly in that list, with
the failure written beside it, and all four endpoints were re-verified answering
as JSON.

**VERIFIED, EACH ONE RUN RATHER THAN REASONED:**

| what | result |
|---|---|
| held chunk, no cookie | **404** |
| held chunk, forged cookie `wb_held=deadbeef` | **404** |
| held chunk, cookie from the right key | **200**, 66,816 bytes |
| `POST /api/held` wrong key | **401** *Wrong key* |
| `POST /api/held` right key | **200**, `Set-Cookie` HttpOnly · Secure · SameSite=Lax · 30d |
| `/hr` in a browser that has not opened the door | **the Lobby.** No password box, no 403, nothing saying a room is there |
| `/hr` with the session flag **forged** and the chunk genuinely removed | **the Lobby** — the error boundary fires; forger and typo land in the same place |
| the four API routes | JSON from the worker, not the asset store |
| `/hr` and `/hr/archive` with the door open | the wing, intact, covers and all |

The forged-flag case was proved by **breaking it on purpose**: the held directory
was moved aside, wrangler restarted so its asset manifest saw the gap, and `/hr`
loaded with the flag set. It rendered the Lobby. Then it was restored and
re-verified at 200.

**WHAT REACHES `/hr`, SWEPT AS INSTRUCTED.** No public route (both addresses
render the Lobby) · no link anywhere in `src/` (the only `/hr` literals outside
the wing are `App.jsx`'s two routes, `/admin`'s two buttons, and comments) · no
share tag (none of the three names him — R1 fixed that on 2026-08-02) · **no
sitemap and no `robots.txt` at all** · the lobby directory lists Robots, The
Record, Weird.Baby Music and Other Music Worth a Listen, and never him.

**AND `robots.txt` IS DELIBERATELY NOT WRITTEN, WHICH IS THE OPPOSITE OF WHAT THE
INSTRUCTION SOUNDS LIKE.** A `Disallow: /hr` line is a **public list of what you
are hiding**, fetched by anyone, and it would be the only place on the site that
names the address. The stronger answer is the one now in place: a crawler that
fetches `/hr` is served the same shell every route gets and renders the Lobby,
and the wing's files 404. There is nothing to index and nothing to point at.

**WHAT IT DOES NOT DO, said plainly.** The chunk's ADDRESS is discoverable in the
public bundle — anyone can see there is an `assets/held/` directory. That is the
address, not the material, and the material is behind the cookie. And **`/wal`
still shows two of his songs, his artist card and all 97 vault facts** — see H2.

**ONE THING MIKE MUST DO OR THE WING IS SHUT TO HIM TOO.** `HR_KEY` has no
default, by design. Before the next deploy:

```
npx wrangler secret put HR_KEY
```

Until then `/api/held` answers **503** with *"No key is set on this deployment"* —
a different sentence from *Wrong key*, on purpose, and the admin page prints
whichever the worker sends.

---

## H2 — THE PERMISSION AUDIT

**Full document: `docs/HR_PERMISSION_AUDIT-20260806.md`.** Twelve items, each with
what it is, where it came from, and the basis. Nothing was fixed or removed to
produce it, per the instruction. Four things worth reading first:

**THE FACT EVERYTHING HANGS OFF IS NOT A JUDGEMENT.** Nothing in this repository
records any permission, licence, agreement, correspondence or release from Hunter
Root or anyone representing him. Every grep hit is the museum saying it does not
have one.

**THE ITEM NOBODY HAD NAMED IS HIS TEXT.** The 49 artifacts carry `title` and
`description` fields that are, for the 22 social ones, **his own post writing
copied verbatim into `hunter_root.json`** and printed on the deck cards. An embed
licence covers the iframe; it does not cover a separate copy of the same words in
another system. **This item survives every remedy applied so far** — R5 took the
audio, H1 took the media, and the text only went behind the door because it
happens to live in the same file. It has never been put to Mike. New row **M80**.

**THREE ANSWERS ARE BETTER THAN EXPECTED.** There are **no lyrics** for Hunter
Root anywhere in this repository — searched the whole tree; the only hits are the
video-variant label and a retired comment about a lyric-map link that pointed at a
route which never existed. The **33 YouTube renditions** are the one item with a
basis that can be *checked* rather than asserted. And the **catalogue is not a
copy** — a holdings listing is a listing.

**AND MAKING `/hr` PRIVATE DID NOT TAKE HIS MATERIAL OFF THE SITE.** All 97 vault
facts ship publicly in `assets/tokens-*.js` because `/wal` imports them
(*"one record, two rooms"*), and `/wal`'s two Hunter Root images are served from
the museum's own origin and are untouched. New rows **M81** and **M82**. A reader
who takes *"/hr is private"* to mean *"his material is off the site"* will be
wrong, and that sentence is in the audit for exactly that reason.

---

## H3 — A `/CB` WING — LEDGERED, BUILT NOT AT ALL

Recorded as **M77**, with Mike's own reason attached, because it changes the value
proposition rather than the feasibility: **Carsie Blanton's own homepage is
already strong, so a museum wing helps her far less than it would have helped
Hunter, whose web presence is poor.**

**AND LOOKING FOR IT FOUND A DEAD CONTROL.** `/admin` carried a `/cb` jump button.
**There has never been a `/cb` route in `App.jsx`** — it fell through the catch-all
onto the Lobby, on the one page whose entire job is to report the true state of
things. It is deleted, and its register row is the first thing this round pruned
from the provenance boundary.

---

## H4 — THE SHARE DESCRIPTIONS — THREE DRAFTS, VERBATIM, NOT SHIPPED

**`index.html` IS UNTOUCHED.** These are drafts for him to correct, per the
instruction.

**THE STALE ONE IS CONFIRMED AS THE SEARCH LINE**, exactly as M68 reported:
*"Exhibiting the MGK robots and Worth A Listen"* names two exhibits; the lobby
board lists three, and the one it drops is **the house's own music wing**.

**THE STRUCTURE OF THE PROPOSAL IS THE ANSWER TO "WHICH DESCRIPTION IS THE
MUSEUM'S": THERE IS ONE, AND THE SHORT FIELD IS ITS OPENING.** Three sentences,
one per service level. The search description is the first two — a **prefix**, not
a second wording. A prefix cannot contradict its own sentence, which is the whole
defect M68 reported, and it means a future edit lands in one place.

> **SENTENCE 1 — the ten-second reader.** Kept exactly as it is. It is the best
> line the current tags have.
>
> **SENTENCE 2 — the "looks legit but what IS this" reader.** The three wings, in
> the lobby board's own words, so the line cannot go stale against the board
> again.
>
> **SENTENCE 3 — the intrigued reader, and the artist reading it.** The business
> model, which is C4's own doctrine for why these tags exist at all.

### DRAFT 1 — `og:description` (179 characters)

```
A museum of weird things worth keeping. Weird.Baby Robots, Weird.Baby Music, and other music worth a listen. No ads, no affiliate links, no cut of anything you buy from an artist.
```

### DRAFT 2 — `twitter:description` (179 characters — identical to Draft 1)

```
A museum of weird things worth keeping. Weird.Baby Robots, Weird.Baby Music, and other music worth a listen. No ads, no affiliate links, no cut of anything you buy from an artist.
```

**Twitter's own limit is 200, so the full sentence fits and there is no reason for
these two to differ.** M68 noted that nothing in the file ever said why the
shortening happened; the answer is that it was not a length decision, and the two
cards are now the same card.

### DRAFT 3 — `meta name="description"` (108 characters)

```
A museum of weird things worth keeping. Weird.Baby Robots, Weird.Baby Music, and other music worth a listen.
```

**Why it stops there:** Google shows roughly 155 characters and truncates the
rest. Adding sentence 3 makes 179 and the money line gets cut mid-clause — a
sentence about taking no cut, chopped at *"no cut of anything you b"*. So it stops
at a full stop, and everything it says is word-for-word the opening of the other
two.

### WHAT WAS DROPPED, AND WHY

* *"The MGK robots"* → **"Weird.Baby Robots"**. `MGK` means nothing to a stranger
  and the board does not use it. The machines keep their names inside the wing.
* *"Worth A Listen"* as a title → **"other music worth a listen"**, the board's
  own line. The capitalised form read as a brand nobody has heard of.
* *"Exhibiting"* — museum-speak, and it is what made the line describe itself
  rather than say anything.

### THE ONE QUESTION ON THESE, AND IT IS NOT A WORDING QUESTION

**The front door says the museum is not open.** The Lobby reads *"SOMETHING IS
BEING BUILT HERE"* and *"We're not open yet. But you found us — which means
something."* All three drafts above describe a museum in the present tense, so an
artist who follows the link meets a confident card and then a not-open-yet page.

Ops did **not** write *"not open yet"* into the drafts, because C4 built these tags
as the handshake before the email and a card that leads with a disclaimer is a
different decision from a card that leads with what the place is. **It is his
call and it is stated rather than absorbed** — register **M83**.

---

## H5 — ART PULLS

**Folder: `C:\AI\_art-pulls\20260806-niac-and-portal\`** — nine files and a
`README.txt` naming the source, the native size and the provenance of every one.
Nothing committed to any repository; nothing moved, renamed or deleted in either
repo to produce it.

**THE MAINFRAME: YOU ASKED FOR SEVERAL FULL-BODY SHOTS AND THERE IS EXACTLY ONE.**
`cabinet_whole.jpg`, 858×1438, both feet, full grille, lit core, red bar bank
mid-pattern, square on, robot out of frame. It is the frame lifted from
`IMG_1526.MOV` at 00:58.0 on 2026-08-05.

**A SECOND ONE CANNOT BE CUT HERE, AND THE REASON IS CONCRETE RATHER THAN A
SHRUG: `IMG_1526.MOV` IS NOT ON THIS MACHINE.** Every `.MOV` and `.MP4` under
`C:\AI` was enumerated; there are four, and they are the three burps clips and a
concert video. So the ceiling on the mainframe is one phone-video frame at
858×1438 — **about a quarter of the width of a 3000px sleeve at 1:1.** If the
cabinet is going to *be* the cover, it wants shooting, and that is a camera
answer rather than a file anybody is withholding.

Four cabinet **details** ship with it (column lit · core helical · output row ·
core meltdown), the wall's own captions attached.

**TWO FILES WERE PULLED AND PUT BACK, and it is worth knowing which.**
`bench_power.jpg` has **two of the figure's legs in frame** — you asked for the
robot out of it. `matrix_lit.jpg` is an LED matrix on a breadboard and is not the
cabinet at all. Both are real photographs the museum owns; neither answers the
ask.

**THE PORTAL IS NOT A PHOTOGRAPH — IT IS COMPOSITED LIVE FROM TWO PLATES, AND
BOTH SHIP AT THEIR OWN NATIVE 3000×2400.** The feed (four quadrants: the VIIIp
across the left pair, its top window upper right, lower right kept clear for the
controls) and the bezel with its opening cut out. A composite of the two is in the
folder as well, and so is **the opening measured** — `x 227 · y 194 · 2540×2036`
on the 3000×2400 frame — so any picture can be placed in the glass without
eyeballing it.

**AND THE TEST PATTERN IS BETTER NEWS THAN A FILE.** It is **drawn in code** by
`Feed_TestCard_Draw()` in `twin.html` — pure geometry, no bitmap anywhere — so it
exists at any resolution and never softens. Open `/robots/twin.html`, click
channel **2** (NO SIGNAL), and set the size dial as large as the screen allows.
Two screen captures of the state ship as references and are labelled as
references.

---

## H6 — THE ALBUM-ART EGG — LEDGERED, GRADED HIGH, BUILT NOT AT ALL

**M78.** An easter egg hidden **in the screen of the unit** inside album art.
Mike's reasoning is the grade: *once a visitor finds one, they will check every
cover forever — and every time the art changes.* That is a mechanism that turns a
static asset into a recurring reason to look, which nothing else in the building
does.

**His constraint is recorded with it and is the harder half: this does not mean
eggs everywhere.** The row says so in his words, because the failure mode of a
good egg is a house that starts hiding things by habit.

Nothing was built and no art was touched. The egg register (`reveal/ledger.json`)
already holds two eggs whose only written form is their own row; this is a third
idea and it is not a row there yet, because a ledger row is a claim that a thing
exists.

---

## H7 — THE GIFT SHOP TITLE BAR IN THE WEIRD.BABY FACE — A TEST

**Live.** `/shop`'s room name renders in `--wb-brand` (Fredoka) at weight 600
instead of Syne 700.

**HOW TO REVERT: delete one block at the end of `src/routes/shop/GiftShop.css`.**
Nothing else in the museum changed and no other file was touched — that is why it
is a rule scoped to `.gift-shop` rather than a prop, an attribute, or an edit to
`MuseumBar`. `.wb-bar` renders inside `<div class="gift-shop">`, so the descendant
selector reaches it on this route and cannot reach it anywhere else. **Verified in
the lap: `/shop` is Fredoka 600; `/booth`, `/foundation`, `/robots`, `/wal` and
`/wb` are all still Syne 700.**

**THE WEIGHT CAME DOWN 700 → 600 AND THAT IS NOT A STYLE CHOICE.** `index.html`
requests Fredoka at 400;500;600 only. A 700 would have the browser **synthesise**
the bold — the exact defect R4 wrote that font list to end — and the test would
have been a real face against a smeared one.

**MEASURED AT 390px, WHERE THE BAR IS TIGHTEST:** "GIFT SHOP" in Fredoka 600 is
**71px** wide against Syne 700's **81px**, with **65px of clearance each side**
instead of 60. The test makes the narrow-width margin better, not worse. No
overflow at any width. Desktop: 19.2px, centred, 440/441px of slack.

---

## H8 — THE REGISTER PASS

**M71 — 47 tracks reachable through nothing. VERIFIED AND DOWNGRADED, NOT
CLOSED.** He asked whether H1 makes it moot. The honest answer is **half**: the
60 dead rows and the 47 unreachable tracks are now seen only by him and by Ops,
so nothing a visitor meets is affected and the urgency is gone. But the question
he was asked — *what should `/hr` LOOK like without its audio* — is a design call
about a page that still exists and that Ops still works from. **It is downgraded
from a public-facing defect to a reference-copy question and the row says so.**
Nothing was silently closed.

**M72 — his card has no biography. DESCRIBED, NOT WRITTEN**, per the instruction.
What belongs in that slot is what the other three artists carry: **three
paragraphs of life and work**, sitting between the register and the shelf, in the
museum's own voice and sourced. Ops holds two sourced facts and will not draft
from two — his Whiskey Riff line (*"I am Pennsylvania raised but I was born in
Fayetteville, Arkansas. My brother and I both."*) and his own Bandcamp bio
(*"Solo artist/musician from Lancaster, PA"*). **Two facts are a tombstone row,
not a biography**, and Doctrine 12 says Ops asks rather than fills. The slot is
conditional in `Exhibit.jsx`, so nothing draws empty today.

**M73 — vault-served pictures. HALF-ANSWERED BY MECHANISM, AND THE HALF THAT
REMAINS IS THE `/wal` HALF.** All 107 vault image URLs are now inside the held
chunk and **zero reach a public visitor** — but that happened because the wing
went private, **not because anybody ruled on images**. The question is alive and
now points at a different object: `/wal` serves two of his images from the
museum's own origin and they are public today. Row updated; new row **M82** for
the `/wal` pair.

**M75 — `/hr/archive` announces the holding. VERIFIED STILL TRUE, AND NOW BEHIND
THE DOOR.** Its header still reads *"7 records, plus an EP and a set of singles
and rarities · 93 tracks on file"* — confirmed on the built bundle this round.
Behind the password it is a catalogue page saying what it is a catalogue of, read
by two people. Downgraded, not closed; the one-word ruling still stands open.

---

## WHAT THIS ROUND EXPOSED — the new rows

| row | what |
|---|---|
| **M77** | A `/CB` wing is possible; Carsie's own homepage is strong, so a wing helps her far less than it would have helped Hunter. Ledgered, unbuilt. |
| **M78** | The album-art egg, in the screen of the unit. Graded high. His constraint recorded: this does not mean eggs everywhere. |
| **M79** | **The booth's privacy answer now over-discloses.** It says one exhibit carries Facebook embeds and that *"Google, YouTube and Facebook each know you turned up"*. With `/hr` held, **no public visitor's browser touches Facebook at all.** Not edited — it is Mike's answer and R6 ruled its disclosure posture six hours ago. Worth noting that every previous error in this one clause was in the museum's own favour; **this is the first one against it.** |
| **M80** | His post text — 49 artifact titles and descriptions copied verbatim into the export. No basis on the record, never put to him. |
| **M81** | All 97 vault facts ship publicly in `/wal`'s chunk regardless of `/hr`. Includes the volume-per-source exposure, whose counterparty is the publications, not him. |
| **M82** | `/wal`'s two Hunter Root images, served from the museum's own origin, still public. |
| **M83** | The share cards describe an open museum; the front door says it is not open. Plus the Gift Shop typeface test, which is his to keep or revert. |
| **M84** | The whole `/hr` wing has moved into `provenance:gate`'s *"unreachable from `src/main.jsx`"* bucket, because the sweep follows static imports and the wing is now a dynamic one. **Nothing is undeclared and the gate passes.** But that bucket now lists **485 strings across nine Hunter Root files**, of which only 154 (`hr_facts.js` 124 and `hr_journal_prompts.js` 30) were there before — those two are M5's genuinely dead files. **A future reader must not read the other 331 as dead**; they are the live wing, behind a door the sweep cannot walk through. |

---

## HOUSEKEEPING

**Doctrine 17 was applied to this round's own new code, twice.** The
no-key-is-set sentence was written into both `worker.js` and `WbAdmin.jsx` in the
first draft — a duplicated passage, one hour old. It is declared once in the
worker and the admin page prints what the worker sends, because the worker is the
only thing that knows. And *"Wrong key"* likewise: the admin's copy is gone and
its remaining fallback is a different sentence for a different case.

**A hand-typed count was written and then removed before it shipped.** The first
draft of the admin paragraph read *"nine containers, ninety-three track rows"*.
That is the defect W1 and D3c both paid for; the page has no reason to carry a
figure and now carries none.

**The prune was run forwards.** One row went stale — `/cb`, the dead button. Its
anchors were checked first (**zero** chains pointed at it), then it was pruned
against a copy, then re-gated. 0 undeclared · 0 stale · 0 invention.

**Scratch left behind: none.** `public/_lap.html` (the 390px harness, gitignored)
was written for the lap and deleted after it.
