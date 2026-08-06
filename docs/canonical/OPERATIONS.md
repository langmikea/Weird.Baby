# OPERATIONS — Weird.Baby Museum (cross-session operating manual)

**Authority:** This file governs HOW any agent/session works on this project.
`STATE.md` governs WHAT exists. `docs/canonical/` governs design intent.
On conflict about process, this file wins. On conflict about facts of the
tree, the live working tree wins — always.

**Read this file FIRST in every session, before STATE.md, before any handoff.**

**Last verified against live tree:** 2026-08-06 (THE PRE-COMMENTARY ROUND —
eight instructions, all eight landed, and **the verification of the headline one
caught an outage that would have taken the whole back end down silently.**
`/hr` IS PRIVATE AND IT IS ENFORCED AT THE SERVER (H1): the wing is a dynamic
chunk parked under `assets/held/`, `src/worker.js` refuses that directory
without a cookie, and the cookie is minted only by a password on `/admin`
against `env.HR_KEY`, a wrangler secret with **no default**. **IT IS NOT A REACT
PASSWORD, AND THE REASON IS R5 ONE ROUND OLD** — a filter that stops the render
still ships the material, and a browser-side gate would have left the catalogue,
the deck and **107 vault image URLs** sitting in a public bundle behind a boolean
anybody can flip. Measured: public JS 724.8 KB → **536.6 KB**, held 189.1 KB,
vault image URLs in the public bundle **107 → 0**. **THE OUTAGE IS THE MOST
USEFUL THING IN THE ROUND:** gating the directory needs `run_worker_first` in
`wrangler.jsonc`, and **declaring that list changes the default for everything
not in it** — with only the held directory named, `/api/admin`, `/api/guestbook`,
`/api/visits` and `/api/presets` all stopped reaching the worker and were
answered by the asset store, which under `not_found_handling:
single-page-application` returned **index.html with a 200** to every one. Nothing
errors; the site just stops having a back end. Caught by running the gate against
`wrangler dev` on the built bundle rather than reasoning about it. **THE FORGED
FLAG WAS PROVED BY BREAKING IT ON PURPOSE** — held directory moved aside,
wrangler restarted, `/hr` loaded with the session flag set: it rendered the
Lobby, which is what an unmatched address renders, so the forger and the typo
land in the same place. **`robots.txt` IS DELIBERATELY NOT WRITTEN**, and that is
the opposite of what the instruction sounds like: a `Disallow: /hr` line is a
public list of what you are hiding and would be the only place on the site naming
the address. **THE PERMISSION AUDIT (H2) FOUND THE ITEM NOBODY HAD NAMED** — the
49 artifacts carry his own post text VERBATIM as museum data, which an embed
licence does not cover and which **survived every remedy so far**, going behind
the door only because it shares a file with the deck (M80). It also found the
sentence that stops *"/hr is private"* being read as *"his material is off the
site"*: **all 97 vault facts ship publicly in `/wal`'s chunk and two of his
images are served from the museum's own origin** (M81, M82). **There are no
lyrics anywhere in this repository**, and the 33 YouTube renditions are the one
item whose basis can be checked rather than asserted. Audit:
`docs/HR_PERMISSION_AUDIT-20260806.md`. **DOCTRINE 17 WAS APPLIED TO THIS
ROUND'S OWN NEW CODE**, twice, within the hour it was written. Round log:
`docs/MUSEUM_PRE_COMMENTARY_LOG-20260806.md`).
Previously 2026-08-06 (THE PORCH RULINGS — six
rulings, one research map, one register pass. **THE ONE HE CALLED CRITICAL AND
LIVE WAS AIMED AT THE WRONG PAGE, AND CORRECTING HIS PREMISE MADE THE PROBLEM
FORTY-SIX TIMES BIGGER.** R5 ruled that the museum does not have Hunter Root's
permission and must stop serving his material — naming *"his two songs"* on
`/wal`, which turned out to be **YouTube embeds of his own channel and always
had been** (oEmbed on both ids returns `youtube.com/@hunterrootmusic`, checked
rather than assumed). The verification he asked for found **`/hr` serving
ninety-three**: every track carries an `assets.weird.baby` mp3 rendition and
sixty also sit on the album containers as `primary_url` for the deck's own
`<audio>` element. **THE RULE IS WRITTEN ONCE AND ENFORCED TWICE, AND THE SECOND
TIME IS THE POINT** — `src/data/exhibits/vault-audio.js` holds `stripVaultAudio`
(pure, importless, idempotent, matching the vault's audio PATH not a file
extension); the RUNTIME caller is `hunter-root-served.js`, the only thing either
consumer imports now, and the BUILD caller is the `hr-vault-audio` plugin in
`vite.config.js` at `enforce: "pre"`. **The build pass exists because the first
attempt was not good enough and the bundle said so:** a runtime filter stops the
REQUESTS and still ships the ADDRESSES, and the first build carried 153 vault mp3
URLs in plain text. Now zero, and 22 KB smaller. **The cost is 60 of 93 tracks
with nothing playable** — Run With The Hunt and the Phone Recordings EP entirely
— drawn through `.tl-novid` and the overlay's *unavailable*, **both of which
already existed; no render path was invented.** What `/hr` should look like
without its audio is a design call and is **M71**, not Ops'. **R4 STRUCK THE
HOLDINGS SENTENCE AT SEVEN SITES** and Hunter Root's card now has **no
biography**, because both its paragraphs WERE the announcement (M72) — the second
time that slot has failed the same way, the first being when it described this
website. **ONE DELETION WAS DRAFTED, REVERSED, AND THE REVERSAL IS THE MORE
USEFUL FINDING:** striking the song cards' `Accession` rows for symmetry would
have broken the only on-glass provenance anchor two other passages on that same
card point at — **a citation is not a decoration**, Doctrine 11 ships accession
numbers, and the row went back with *Published by* and *Verified* added beside it.
**R2's blurbs were both DELETED rather than reconciled**, and `/booth` and
`/foundation` were checked rather than assumed — neither has an FAQ intro blurb;
a heading is not a blurb. **R6 RULED M37 = A (disclose)**, which makes the booth's
answer the whole of the remedy and therefore its accuracy the whole of the
remedy — re-measured, **and the Facebook half was wrong for the third time in the
museum's own favour**: the plugin frames are `loading="lazy"`, so `/hr` on arrival
requests Facebook **zero** times and sixteen only once they scroll into view.
`C34` closes ruled-against. **R7's number is thirteen**: Bandcamp adds 13 tracks
over YouTube for Hunter Root and **47 of his 93 are reachable through nothing**,
while Carsie Blanton (16 releases) and Jesse Welles (7 albums) are whole
catalogues the wing shows two songs of. Round log:
`docs/MUSEUM_PORCH_RULINGS_LOG-20260806.md`. Research:
`docs/AD_FREE_PLAYBACK_RESEARCH-20260806.md`).
Previously 2026-08-06 (CLEAR THE DECK — nine
instructions, all nine landed, and the biggest of them was found by looking for
something else. **THE SAME PASSAGE NO LONGER LIVES IN TWO ROOMS AND THE MAP IS
NOT A GREP:** it was built from `tools/provenance-sweep.mjs`'s own extractor, so
the population is exactly the population `provenance:gate` polices. Three exact
cross-file duplicates are hoisted — the keeper's answer into
`src/data/house-copy.js`, and the manual reader's FORMAT/NAV lines, the empty
reel's note and the shop answer into module constants in `robots.js`, all four
typed twice because parity is absolute and `npm run parity` polices the menu
ITEMS and cannot see the words inside them. **FOUR DIVERGED PAIRS ARE REPORTED
RATHER THAN MERGED** (M66–M69), which is what his instruction says to do with a
divergence. **THE FOUNDATION IS A WING** (M62, option A): `face.account`,
`face.register` and `face.ledger` are three new object kinds mounted on the
presence of a field exactly the way `InstrumentPanel` is,
`src/routes/exhibit/FoundationObjects.jsx` is **the sheet's own markup and the
sheet's own stylesheet MOVED rather than rewritten** — the cheapest guarantee
available that nothing was lost — the reveal-ledger wiring crossed untouched, and
`src/routes/Foundation.jsx` is deleted. **THE LAP CAUGHT THREE THINGS NO GATE
COULD:** the billionaires question printing with silence under it (the face
model's entry filter is an OR where the sheet's was an AND, so an answer held
whole came back as a published question with nothing beneath it, on the one page
whose subject is honesty), a player bar on a wing with nothing to play, and the
objects drawing above their own heading. **`/hr/archive` WAS CARRYING A WHOLE
SECOND CATALOGUE** — six containers against the vault's nine, two whole records
missing, four songs filed under the wrong record — and it is DELETED rather than
corrected, because a corrected mirror is a mirror that will drift again; the page
reads the spine now. **AND W1's OWN FIX CARRIED THE DEFECT IT WAS CURING:** 93 is
a count of TRACK ROWS and was printed as a count of SONGS, the same unit swap as
*78 songs*, one round later, by the round that named the class. The manual
**stays OFFLINE** (M61, RULED — HELD). The machine covers **spill out of the
oval**, and the two treatments are the SOURCE's doing rather than the effort's —
the VIIIp gets a real silhouette, the mainframe rides over the ring as a plate
because its frame was cut at the cabinet's own bounding box and three mattes each
damaged the object. The billed gift-shop tile **owns the top row, centred, at one
column's width**, measured 445×298 across all five. The viewer is at
`--face-zoom: .94`, **floors included**. Round log:
`docs/MUSEUM_CLEAR_THE_DECK_LOG-20260806.md`).
Previously 2026-08-05 (THE REMOTE-CONTROL ROUND
eleven instructions, **ten built and one handed back because it is blocked by
Mike's own ruling from the round before**. **PARITY IS ABSOLUTE AND THE PREVIOUS
ROUND'S OPS RULING IS REVERSED IN THE OPEN:** a holdings gap no longer resolves a
menu divergence, `menu-parity.mjs` fails on any difference, and the `JUSTIFIED`
table, its `kind` column and **the ledger read that faulted the day a named
holding arrived** are deleted — mourned in the file's own header with its commit
named, because under an absolute rule there is nothing left for it to guard. It
is **a PACKET GATE now**: it used to report a judgement and now reports a fact.
The mainframe gained **The Manual** and **FAQ**, and **THE STUB LAW IS OVERRIDDEN
FOR THOSE TWO ROWS AND ONLY THOSE TWO** on his reason — *a row is a promise only
when nothing is coming, and these are coming*. Doctrine 12 is untouched inside
them. **THE PORTAL IS ITS OWN ALBUM** (second in the deck), **THE NAME IS DELETED
IN TOTAL** (M59), and the Record sits above the FAQ — which moved the wing's
landing face from the FAQ to the Record, measured on the built bundle and
recorded as **M65** rather than absorbed. **THE ROBOTS FAQ IS MIKE'S, WORD FOR
WORD**, seven questions shipping and one printing nothing because it is marked in
both its title and its answer (M57). **THE FIRST PHOTOGRAPH OF THE MAINFRAME
WHOLE** was 58 seconds into a video this repository has been citing for two days;
what was ever withheld was the ROBOT, and the robot is out of every frame in this
wing. **THE RECORD'S NAVIGATION IS BUILT AND RENDERS NOTHING** on a one-record
volume, and so does the old ‹ NEWER / OLDER › walk, which had been drawing two
disabled halves and a count reading "1 of 1" since M5. **EVERY VIEW SETTING IS
SESSION-SCOPED IN EVERY WING** — it had been built for /wal alone since
2026-08-02 — and the booth's privacy answer changed first. **ADDING ONE FACE TO
/wb DROPPED THE MUSEUM'S LAST PAGER OUT OF IT.** The Foundation's invoice is a
**LEDGER**, its register takes back its own name, *"held, ever"* is gone and the
TONE RULING is recorded as standing; its albums and tracklist are **M62**. The
manual is **M61**. Round log: `docs/MUSEUM_REMOTE_CONTROL_LOG-20260805.md`).
Previously 2026-08-05 (MIKE'S READING PASS — ROUND ONE
— he read the Lobby and the Gift Shop and **every finding was real**. **THE
LOBBY WAS THE LAST PLACE IN THE BUILDING CALLING IT "The Museum"** — the sweep he
asked for found the share tags, the booth's credo and the Foundation's invoice
all already saying *Weird.Baby Museum*, so one string changed and it does NOT
reverse M-ID (that ruling struck names that fenced the museum to a class of
artist; a house name narrows nothing). **THE WATERMARK IS `Weird.Baby`**, which
also answers the morning rip's own M10 — closed CANNOT REPRODUCE on 2026-08-03
for want of a room, and Mike reading the Lobby gave it one. **EVERY GIFT SHOP
TILE IS ONE SIZE**, measured 445×298 and 338×386 across all four billing
branches: the billing law is not repealed, it is re-expressed as ORDER, because
it says who LEADS and never said who is BIG. **AND EVERY ARTIST TILE NOW OPENS
THE ARTIST'S OWN FRONT DOOR** — Hunter Root's fell through to Bandcamp while his
own site opens on *Official Merch Store*, Jesse Welles' went to the merch VENDOR,
and **Mikey Mike's opened a video feed**; `weekendatmikeys.com` was read directly
first and R-a's refusal of findmikeymike.com stands untouched (M54). **M50 IS
CLOSED AND ONE OF ITS OWN CLAIMS WAS WRONG:** the six figure sites are rebuilt
from a re-derived count (9 containers · 93 rows · 78 slugs), two release years
were being printed off `era-buckets.json`'s bucket START years and are corrected
from the vault and his own Bandcamp — **but "half of Crooked Home is about his
brother" IS in the vault**, `MV-HR-20260707-068`, in his own words, and stays.
The poke is the gate on every future egg (M1) and two rooms are ledgered and
unbuilt (M55, M56). Round log:
`docs/MUSEUM_READING_PASS_ROUND_ONE_LOG-20260805.md`). Previously 2026-08-05 (THE WAL POSTER EDIT — a
delete-only round on `/wal`'s ABOUT OUR CURRENT ARTISTS face, with one sentence
rebuilt from the vault. **Three true passages struck on Mike's ruling** that they
explain what the room already does or congratulate the house on its own process:
the curation label, the standard line and the bill's foot. **No render path was
touched** — `bill.standard` and `bill.foot` are still conditional and their CSS
still stands; the fields are simply not declared. **The one strike that costs
something is the per-act "Open the room" chip, which carried P6's ruling that
what is not readable must be written — striking it reverses P6 on this one
object and a coarse pointer now has no cue** (M51; doors verified live, all four
panels are still `<button>`). **HUNTER ROOT'S LINE WAS REBUILT FROM THE VAULT AND
EVERY FIGURE IN THE OLD ONE WAS WRONG:** *78 songs* counts only track rows
carrying a `song:` slug and drops the whole of Run With The Hunt (the vault holds
**93 tracks**); *nine records* counts CONTAINERS, of which **seven are records**,
one is an EP by its own title and one is a set by its own title; *whole
catalogue* is contradicted 400 lines up in the same file. **And Run With The Hunt
is a RECORD, not a band** — its ReverbNation page reads like a band's and
`era-buckets.json` files it under *The Band Years*, but vault fact
`MV-HR-20260707-004` settles it. Three findings left standing rather than
silently patched, per the surgical instruction: the same wrong figures on his own
card (**M50**), the blurb's *"none of them is ours"* now sitting above the panel
that says the museum holds his records (**M52**), and **a `[PAPA]` marker's
second sentence rendering as the last line on the poster** (**M53**) — the
scrubber cuts by sentence on purpose, so the question is the sentence, not the
scrubber. Round log: `docs/MUSEUM_WAL_POSTER_EDIT_LOG-20260805.md`). Previously
2026-08-05 (THE PARITY RULING + TRIM — **two rulings, one behaviour, one idea banked, and a defect that turned out to be four.** **PARITY IS THE DEFAULT AND A HOLDINGS GAP RESOLVES A FLAG RATHER THAN OVERRIDING IT** — Mike's ruling on M47, built as a `kind` on every justification plus the thing R2 could not do: a holdings gap must name the LEDGER ROW that would exist if the museum held the material, so `parity:gate` **faults the day it is built** and "it clears itself" stops being a promise. **THE MANUAL'S PLATE IS STRUCK**: a page reading TEXT NOT SUPPLIED was the museum admitting it had not written the manual wearing a fiction as cover, and either the plate shows a page actually written or there is no plate — M45 and M4 both close, and the face is better without it. **THE GUEST BOOK SCROLLS BY HAND** — drag with arrows as its keyboard half, the wheel refused with a reason, `↑` stopping at the first signature because a guest book has a beginning, and "resumes after a rest" implemented as ONE DEPENDENCY rather than a second clock, which is exactly what Q1 was. **THE POKE is ledgered, graded A+++++ and built not at all.** And C39's two NUL bytes were **six bytes in four files, one of them `keyOf` — the function that hashes every visitor-facing string in the museum**; the fix is proved to change nothing by the gate still passing. Round log: `docs/MUSEUM_PARITY_RULING_AND_TRIM_LOG-20260805.md`). Previously 2026-08-05 (v56 THE ROBOTS SIMPLIFICATION — a cross-repo round that **deleted more surface than it built**: three front-desk faces, six robot plates, a whole spread, two typographic cards and a shot from each of two video cuts, against four instruments, four cabinet plates and two eggs nobody can see. **`MANUAL_PAGES = 24` is gone rather than repointed** — Mike's standing rule is that the manual is as long as the manual needs to be and page count is a consequence of content, so the count is read off the source tree and T-A closes; a SHRINKING manual now faults rows already written past the end, which was invisible. **NIAC IS THE MAINFRAME**, and the finding is that its album named the mainframe in every sentence and photographed the ROBOT in every frame — V2's obfuscation ruling was working perfectly on the wrong object. The robot is now `egg.niac.operator`: LIVE, HELD, printed nowhere. **The Record moved to the wing's own front desk and got an address**, which is the first thing in this museum that can be deep-linked to a track. **The Portal's drum is numbered 1…8 and the reason is written once, in the ledger, and on no page.** Two new instruments: `npm run parity` (the two machines carry the same menu or somebody says why, in writing) and `npm run surfacing` (what is held and never shown, by wing, logged so it becomes a trend). Round log: `docs/MUSEUM_ROBOTS_SIMPLIFICATION_LOG-20260805.md`). Previously 2026-08-05 (v55 RECORD MACHINERY — a drafting-lane round that touched **nothing in `src/`** and built the vessels the Record's first two weeks will land in. The ledger is cut **one row per Record ENTRY** and the rows are **derived out of the Record rather than typed against it**, by a reader deliberately split so that the half the ledger builds from can see entry numbers and asset paths and **no words at all**; the constraint the audit only stated — the ledger must never become a second copy of the Record — is now enforced three ways and **all three were broken on purpose to prove they fire**. `doc.record` is the volume only, and an unnumbered entry fails the build rather than being handed an id. The audit §8b **cue cards are built** — `npm run reveal:cards`, 49 of them, one per held thing, one blank each — and the deck is 49 rather than 143 because asking what day a REVEALED thing came out invites an invention. **The manual is a supply line now**, on Mike's ruling that it arrived in pieces: a page vessel carrying its own production arc and the Record entry that called for it, **built, empty, and proved without inventing a page**. The stale ancestor in the robots repo is marked superseded and kept for the thing it is still the source of. And the fifth reveal class is put to Mike as **one question** with a second case nobody had noticed — `route.hr` is held permanently by his own ruling and its cue card asks what day it comes out. Round log: `docs/MUSEUM_RECORD_MACHINERY_LOG-20260805.md`). Previously 2026-08-05 (v54 THE FOUNDATION COPY — Mike answered `/foundation`'s questions himself and the round was almost all subtraction: fourteen questions become twelve and **eleven render**, because the billionaires answer is now marked in every sentence and the scrubber drops it whole — the first answer in the building to take that path to the end. Two questions deleted, one of them at a named cost (the four gifts of service lost their only list). **Two real households he supplied for the invoice did NOT ship** — consent to be named on a public page is not the museum's to assume — while his RULE about earmarked money and his MECHANISM for a cost carried by somebody else both did. Two link slots ship as named doors stamped NOT BUILT off the reveal ledger, with no `<a>` at all. The lobby board indents *Other Music Worth a Listen*, measured at 16px of slack. Round log: `docs/MUSEUM_FOUNDATION_COPY_LOG-20260805.md`). Previously 2026-08-05 (v53 THE BOOTH EDIT + THE MISSING LAP — the browser lap v52 sealed without has now run over eleven routes at desktop and 390px, and it found that `/hr` requests `www.facebook.com` sixteen times across seventeen iframes on arrival and that `/robots`, `/wal` and `/wb` request `www.youtube.com` three times each, none of it clicked; the booth's privacy answer is rewritten around the machine remembering a visitor when the museum does not, and its outbound clause — on its THIRD version, the first two both false — now names Google, YouTube and Facebook; two forced FAQ questions deleted under the Law of Subtraction and two more answers re-led). Previously 2026-08-05 (v52 THE REVEAL LEDGER — the guest book stops going blank and steps one name at a time; the MGK-VIII album is MGK-NIAC everywhere it is a LABEL and unchanged everywhere it is a FACT; `reveal/ledger.json` catalogues 151 revealable things across both repos and `/foundation` is the first surface reading it; C32 closed — the asset table is keyed by a uid a rename cannot touch, and a judged row whose file vanishes is now reported rather than dropped). Previously 2026-08-04 (v51 M23 RULED + THE ALBUM ROUND — both of M23's pairs are struck and both losers deleted, so `?hook=` and `?book=` no longer exist; the guest book steps; the two machine albums wear covers built on the ROBOTS template; the album band's title is centred and shorter; the face type ramp's top three steps came down; the 31½ card and the count with it, which emptied the provenance register's INVENTION class)

---

## 1. Roles & the carry model

- **Mike** owns all UX-facing / UX-impactful calls, runs ALL host-side
  execution (pwsh, git push, deploy), and **carries** material between the
  three surfaces below. Nothing moves between surfaces unless Mike moves it.
- **Claude (any surface)** owns Ops: scoping, briefs, verification,
  drafting. Claude never pushes, never deploys, never decides UX.
- Questions to Mike: one at a time, only when genuinely load-bearing and
  undecidable; phrased in UX-impactful terms, concise bullets, plain
  syntax. Otherwise assume-and-state.

## 2. The three surfaces — capabilities matrix

| Surface | Repo reach | Can write repo | Push/deploy creds | Role |
|---|---|---|---|---|
| **Chat Claude** (claude.ai) | NONE. No filesystem access to `C:\AI`. Has: Google Drive connector, Chrome browser, web, chat uploads. | No | No | Scoping, briefs, doctrine, reading conduit drops |
| **Cowork** (desktop app) | Full, via per-session folder mount Mike approves | Yes (sandbox) | **No** | Repo reads, big-file edits, multi-file scoping, reports |
| **Host pwsh** (Mike) | Full, native | Yes | **YES — the only durable path** | Push, deploy, MV launch, anything load-bearing |

Facts every session must hold without rediscovering them:
- Chat Claude NEVER has a "Cowork tool." Cowork is a separate app Mike
  runs. Chat Claude writes Cowork **briefs**; Mike carries them.
- Cowork folder mounts and delete permissions are **per-session**.
- There is no CI. Deploy is manual: `npm run build && npx wrangler deploy`,
  host-side only.
- Cowork outputs land in
  `%APPDATA%\Claude\local-agent-mode-sessions\<session>\...\outputs` —
  Mike carries them out (chat upload or the Drive conduit, §3).

## 3. Conduit protocols (how material moves)

**Chat → Cowork:** Chat Claude writes a self-contained brief (one task,
explicit read-only/write scope, explicit output filename). Mike pastes it
into Cowork.

**Cowork → Chat:** Cowork writes its output file; Mike either uploads it
to the chat directly or drops it in the Drive conduit (below). Either is
fine; Drive is preferred for code files (chat Claude reads them via the
Drive connector, octet-stream/base64 for `.jsx` etc.).

**Host → Chat:** Mike runs a script chat Claude wrote and pastes output
back. Keep host paste-backs small (single files, short reports); anything
big or multi-file goes through Cowork instead (Doctrine #3).

**The Drive conduit — `G:\My Drive\_conduit\`:**
- A dedicated folder. Everything in it is a **transfer payload**, not a
  reference copy.
- Every file dropped into `_conduit` MUST start with a freshness stamp
  header: `<!-- CONDUIT: HEAD <short-sha> · <ISO timestamp> -->` (or a
  `#` comment line for non-markdown). Writer adds it; reader checks it.
- **Staleness rule:** if the stamp's HEAD doesn't match current
  `origin/main`, or the file has no stamp, treat it as STALE — usable as
  a hint, never as scoping ground truth. (Drive has served stale/retired
  trees before; loose files in Drive root from past sessions are stale by
  default.)
- `_conduit` is disposable. Clear it freely.

## 4. Script rules (anything Mike runs host-side)

1. **No placeholders, ever.** Every path, every value concrete. If a
   value is unknown, the script's first job is to discover and print it.
2. **Flat statements.** No load-bearing work inside `if/else` in scripts
   pasted line-by-line — the `else` orphans in the console and silently
   skips. Use explicit verify-or-abort lines.
3. **Read-only by default.** Scripts that write say so in their first
   comment line and name every path they touch.
4. PowerShell 7; single-line or `@'...'@` heredoc; UTF8 **no BOM**.
5. After any write script: print verification (byte counts, `git status`,
   tail of file) so the paste-back proves the result.

## 5. Verified file map (as of 2026-06-09)

The HR exhibit page is **two stacked components**. Mount chain:
`HrSpine → Exhibit → HrExhibitFlow` (seam: `<ExhibitFlow>` at
`Exhibit.jsx:992`, prop-widening per UX_PRESETS_SPEC §9).

| Concern | Lives in |
|---|---|
| Nav, coverflow carousel, **left tracklist panel**, **right player/PUV region**, bottom player bar | `src/routes/exhibit/Exhibit.jsx` (~43KB) + `Exhibit.css` |
| Tracklist rows, variant tag buttons (`TAG_SLOTS`, radio-per-track `handleTagClick`) | `Exhibit.jsx` (TrackList :404) + `Exhibit.css:83–105` |
| Pop-Up-Video box = `FactScroller` (def :79, mounted :978), `‹ ›` nav :155–156 | `Exhibit.jsx`; facts data: `src/routes/hr/hr_facts.js` (seed content — fill is a separate task) |
| Player ownership (YT/audio, shuffle/loop state) | `Exhibit.jsx` |
| **Artifact deck/grid + controls dock** (tabs, P3Panel :2446, typed cards, presets/journal tab bodies) | `src/routes/hr/HrExhibitFlow.jsx` (~162KB) + `HrExhibitFlow.css`. **Dock is a LEFT RAIL** (relayout 2026-06-09): vertical tab strip on the left edge, peek-on-hover, `ew-resize` drag on the rail's right edge, width persisted `wb-hr-deck-width`; rail lifts above the full-width player bar via `body:has(.pb) .hr-deck{bottom:60px}`. Axis geometry split JS (`S.deck`/`S.panelPos`/`S.tab`/`S.resizeHandle`) + CSS (`.hr-deck`/`.hr-tab-strip`/`.hr-deck-body`). |
| **The album band (`.ex-album-banner`) and the face type ramp** | `src/routes/exhibit/Exhibit.css`. **[A2/A3/A4 2026-08-04]** The band is a **`1fr auto 1fr` grid**, so the album's name is centred BY CONSTRUCTION and lands under the active cover (845=845 at 1706px, 185=185 at 386px); `--ex-banner-h` is `9px + 1.1 × --ex-banner-type` (was 17px) and every sticky offset derives from it. **`.ex-album-banner-aux` must NOT carry `min-width:0`** — a `1fr` track is `minmax(auto,1fr)` and refuses to shrink below its item's min-content, which is the only thing stopping a transport painting across the name; with `min-width:0` it measured overflow to x=−31 over a title at x=86. At **≤720px the ONE wing with a transport (`.ex-banner-console`, /wal) drops to two columns**, name left — equal side tracks make a transport of width w cost the centre 2w and nothing is narrow enough at 386px. The face ramp's three steps ABOVE body are now lead 1.09 / head 1.19 / display 1.30 (were 1.14 / 1.32 / 1.56); micro, small and `--face-fs` are untouched, because the small end's rem floors are P7's answer to unreadable small type and the dial takes the small type with it. |
| Canonical palette/typography tokens | `src/styles/museum-tokens.css`. **F0 2026-08-03:** `--wb-gold-mute` re-pinned to `#5f5c53` (the old `#9b978d` failed AA on all five paper grounds); new `--wb-hairline` holds the old value for the drag rules that chose faintness deliberately. JS pair is `src/styles/tokens.js` — change one, change the other, same edit. |
| **Information Booth** (`/booth`) and **The Weird.Baby Foundation** (`/foundation`) | **[D7 2026-08-06] THE FOUNDATION IS NO LONGER A SHEET AND `src/routes/Foundation.jsx` IS DELETED — READ THIS BEFORE ANYTHING BELOW IT.** M62 ruled, option A: the room is an exhibit WING with three albums (Ledger · FAQ · Contribute) and a tracklist, mounted at `src/routes/foundation/FoundationSpine.jsx`, its data and the whole account of the port in `src/data/artists/foundation.js`. **THE THREE BESPOKE OBJECTS ARE FACE-MODEL OBJECT KINDS NOW** — `face.account`, `face.register`, `face.ledger` — mounted on the presence of a field exactly the way `InstrumentPanel` is, so `Exhibit.jsx` learns no wing-specific content. `src/routes/exhibit/FoundationObjects.jsx` is **the sheet’s own markup, moved and not rewritten**, and it still reads `src/routes/Foundation.css`; `src/lib/foundation-state.js` holds `stateOfRow` because BOTH the objects and the viewer need it (the viewer draws the same stamp beside a marked door on an answer) and a components file may not export a function. **R5’s reveal-ledger wiring crossed untouched:** flipping `channel.qr` to LIVE still changes this wing and no other file. **FOUR THINGS A FUTURE SESSION MUST HOLD.** (1) **`playerBar: false` and `shopEntryHidden: true` are both the port being faithful, not new rulings** — the sheet had no transport and no shop link, and a commercial door in the title bar of the money room fails the first of the TONE RULING’s four tests. (2) **The bar reads `The Foundation` and the faces read the full name**, which is the sheet’s own choice and also the difference between fitting and not (C36 measured the longest bar name with six pixels of slack at 390px). (3) **THE ENTRY FILTER IS STRICTER THAN IT WAS AND THE FOUNDATION IS WHY.** `scrubFace` keeps an entry whose TITLE survives its own line — /robots’ FAQ depends on it (M57) — and the sheet required BOTH. Porting onto the looser rule published *“What do you think about billionaires?”* WITH NOTHING UNDER IT. An entry that HAD a body and lost all of it is now dropped whole; a title-only entry, which never declared one, is untouched. (4) **The FAQ is an entry list and the accordion is gone** — a consequence of the order he gave, and by M1’s no-hidden-information law the stronger form. `/booth` still has its accordion and is untouched. Register M70. Previously: **[REMOTE CONTROL P10 2026-08-05] THE INVOICE IS A LEDGER, THE LEDGER IS THE REGISTER, AND THE TONE RULING IS STANDING.** Mike: *"the INVOICE TITLE IS WRONG — that object is a LEDGER, name it so"*, and he is right about the OBJECT: an invoice is a DEMAND and this document demands nothing — its total is $0.00 by construction, and its own small print already said *"so the ledger is honest and public"*. So `.fnd-inv-mark` reads **Ledger**, the incoming table takes back its own name (**The register**, which is what `fnd-reg` has called it since E1), and **two prose pointers that named the wrong object were repointed** — *"That door is on the ledger above"* (it is on the register) and *"the invoice above is the whole of it"* (it is the ledger). **The class names and the `INVOICE` constant deliberately stay `inv`**, on exactly the reasoning that kept `id: "mgk-viii"` after that album was renamed: they are keys and nothing prints them. ***"held, ever"* IS DELETED** — the three rows under the figure already say what is owned, kept and passed on. **THE TONE RULING IS AT THE HEAD OF THE FILE AND GOVERNS THE WHOLE WING:** *"This is NOT asking people to dig deep and give a little. It is looking for the LIKE-MINDED — people who would prefer not to hoard more wealth. All are welcome, but this is not Oprah asking her fans to donate while she is rich herself."* Four tests are written with it (does it ask · does it flatter the giver · does it argue the house's NEED · would it read differently if the reader were richer than the house) and **the audit says the copy already passes** — recorded because a ruling that changed nothing on its first day gets assumed decorative. **THE ALBUMS AND TRACKLIST ARE NOT BUILT (M62)**: this room is not a `face` wing, it carries three bespoke objects the face model has no equivalent for — the $0.00 ACCOUNT CARD, the two-sided REGISTER whose LIVE / NOT BUILT column reads live off `reveal/ledger.json`, and the LEDGER — and a straight port deletes all three. Previously: **[v54 2026-08-05] `/foundation` HOLDS TWELVE QUESTIONS AND RENDERS ELEVEN — the gap is the point.** Mike answered this room's questions himself (F1–F6); before this round every answer on it was ASSEMBLED from things he had said elsewhere. Three structural facts a future session must hold: **(1) An answer's `a` may be a STRING OR AN ARRAY of paragraphs**, normalised at the render seam — the array exists because he wrote *"How do I get some of that?"* as two beats with the Pro-Tip on its own, and flattening it would edit his line breaks. Only this room does it; `/booth` still renders a single `<p>`. **(2) The billionaires answer is MARKED IN EVERY SENTENCE and therefore prints NOTHING** — `visitorProse` empties it and `kept` drops the whole entry. It is the first answer in the building to take that path all the way down, so *"the FAQ has N entries"* and *"a visitor sees N questions"* are now different numbers and a count taken off `FAQ.length` is wrong. His three ideas (the Illionaires coinage, the size-of-the-pile line, the more-pie line) are preserved verbatim in the data; the PLACEMENT is open at M41. **(3) Two answers carry a `link: {text, reveal}` that renders as a named door plus the register's NOT BUILT stamp and NO `<a>` ELEMENT** — the addresses were marked and never supplied (M39), and a dead anchor is the dead control Doctrine 11's corollary forbids. The stamp reads `reveal/ledger.json`, so building `channel.qr` or `channel.supplies` flips it without touching this file. **Two questions were deleted (F2): *"So who is actually paying for all this?"* cost nothing (the posture is signed under the invoice) and *"Who pays you?"* cost the page the charter's four-gifts-of-service list — M42, named rather than absorbed. DO NOT restore either without his word; the legal-work clause inside the second has already been removed, restored and removed again across v41/v42/v54.** **TWO REAL HOUSEHOLDS HE SUPPLIED FOR THE INVOICE ARE NOT IN THIS REPOSITORY AT ALL** — not in `src/`, not in the round log — pending their consent (M38); the RULE and the MECHANISM shipped without them. Previously: **[v53 2026-08-05] THE BOOTH'S FAQ IS NINE QUESTIONS, NOT ELEVEN** — *"What are the rooms?"* and *"There is a gift shop. What is it?"* are DELETED under the Law of Subtraction (the directory names the rooms and the shop is one of its rows), and the shop answer's `[PAPA]` went with the paragraph rather than being re-homed. *"Are you tracking me?"* is rewritten around **the machine remembering you and the museum not**, and it is the one answer on this page whose claims cannot all be checked from a file: its outbound clause is measured in a browser (see the third-party table below §5) and **has been wrong twice**. Change any embed anywhere in the museum and this answer changes first. **[M23a/M23b 2026-08-04] BOTH PAIRS ARE STRUCK AND BOTH LOSERS ARE DELETED — DO NOT LOOK FOR `?hook=` OR `?book=`, THEY DO NOT EXIST.** The booth lost BOTH candidates and has no hook object at all (`BoothTicket`, `BoothSign` and ~180 lines of `InfoBooth.css` are gone) — Mike: *"THE TITLE IS THE GRAB"*, and the exception that permits it is recorded in STATE.md under the Visual Hook Law. The lobby keeps the SCROLLING guest book only (`GuestBook` in `WbHome.jsx`), rebuilt as a **stepped** advance: three rows visible, a page at a time, `cubic-bezier(.34,1.3,.64,1)` bounce, 5.0s rest, wrap by arithmetic on `transitionend`. **[P3 2026-08-05] AND A VISITOR CAN NOW DRIVE IT — DRAG, with ARROW KEYS as the keyboard half of the same control, and THE WHEEL REFUSED.** Four things a future session must hold before touching it. **(1) The wheel refusal is a decision, not a gap:** the book is 92px of a page people scroll past, so a wheel handler there takes the wheel from the PAGE. The vertical TOUCH gesture IS taken (`touch-action: pan-x pinch-zoom`) and that is different — `.wb-entries`, the plain fallback, is a real scroll box and already takes it natively, so this makes the moving book behave like the still one. **Pinch-zoom is named explicitly and must never be dropped for the `pan-x` shorthand.** **(2) `↑` STOPS AT THE FIRST SIGNATURE and does not wrap backwards** — forward wrapping is invisible, backward wrapping would be a claim about the collection; a guest book has a beginning. **(3) "Resumes after a rest" is ONE DEPENDENCY, not a second timer:** every manual input bumps `nudge`, which is in the rest effect's dependency list and is read nowhere — the effect tears down and re-arms, so the book waits a full `REST_MS` from the last thing the visitor did. **A second clock is exactly what Q1 was**, and the hover pause is a separate, unchanged rule. **(4) HOVER-PAUSE IS GUARDED ON `pointerType === "mouse"`.** A touch synthesises mouse enter/leave on most mobile browsers, so the old `onMouseEnter` would have frozen the book under the finger that had just dragged it — do not "simplify" that guard away. The row height is read off `--gb-row` at drag time and is **never mirrored in the component**; Q1's clamp is unchanged and is applied to the drag before it renders, which is why a second author of the offset costs the two guarantees nothing. `GuestBookPlain` still exists and **nothing selects it** — it is the fallback for `prefers-reduced-motion` and for a book under `SCROLL_MIN` signatures. `src/routes/InfoBooth.jsx` + `InfoBooth.css`; `src/routes/Foundation.jsx` + `Foundation.css` (`.fnd-` prefix, `data-room="foundation"`). **THE SHARED FURNITURE IS `src/styles/sheet.css` (`.sheet-*`) AND BOTH ROOMS IMPORT IT** — root, card, credo, rule, questions, contact, way back. Edits there land on BOTH rooms; that is the point of the file. Each route's own sheet keeps only its page ground and its own objects: the booth's ADMIT ONE ticket (`.booth-ticket*`), the Foundation's account card + register + zero-cost invoice (`.fnd-*`). Before E4 (2026-08-03) all of it lived in `InfoBooth.css`, which /foundation imported — furniture for two rooms named for one, carried as a want in three logs. **Unrelated name collision, do not conflate:** the `--wb-booth-*` tokens in `museum-tokens.css` are the PROJECTION BOOTH (the dark scope used by the player bar and `/admin`), nothing to do with `/booth`. **THE ROOM HAS BEEN RENAMED ONCE AND RENAMED BACK — read this before touching it.** C2 (v41 `ecf33c5`) renamed everything to "Where the Money Goes" at `/money`; **R1 (v42) reverted it whole** on Mike's ruling that C2 read "keep me out of the space where I need legal today" as a naming instruction when it was a workload instruction. **BOTH names have been live URLs, so there is a redirect and it currently runs `/money` → `/foundation`** (`App.jsx`). A third rename must re-point that redirect, not just add another. `/foundation` outside a historical comment is CORRECT; `/money` outside the redirect line or a historical comment is a miss. |
| **The Gift Shop** (`/shop`) | `src/routes/shop/GiftShop.jsx` + `GiftShop.css`; roster data `src/data/wb_roster.js` (the house) and `worthAListenArtists` (the guests). **[D4 2026-08-06] THE BILLED TILE OWNS THE TOP ROW, CENTRED, AT EXACTLY ONE COLUMN’S WIDTH — AND THAT IS THE THIRD SETTING OF ONE LAW, WHICH FINALLY SEPARATES ITS TWO HALVES.** P11/B1/J3 said who LEADS. S1 said nobody is BIG. What was left over is that leading looked like nothing: the billed tile was the first cell of a two-up grid, which on a five-tile page is indistinguishable from alphabetical order. **THE COLUMN COUNT IS EXPLICIT NOW (`--gs-cols`) AND THAT IS THE WHOLE MECHANISM** — `repeat(auto-fit, minmax(min(420px,100%),1fr))` is unimprovable until you have to ask it HOW WIDE ONE COLUMN IS, and centring a tile at one column’s width is that question. `.gift-shop__billed` spans the row and takes one column back: `width: calc((100% - (cols - 1) * gap) / cols)`, **which is 100% at one column**, so the rule needs no mobile branch. **THE BREAKPOINT IS NOT A NEW DECISION:** 910px of viewport is 862px of content, which is two 420px floors plus the gap — exactly where `auto-fit` was already switching. Measured on the built bundle: **five tiles, 445×298 every one**, the billed tile centred to half a pixel; at one column all five are 912 wide. The billing law still decides ORDER and only order: all three clauses run in `billing()`, `data-billing` still reports which branch answered, and on the `wal-set` branch nobody carries the class. Previously: **[S1/S2 2026-08-05] FOUR THINGS A FUTURE SESSION MUST HOLD.** **(1) THE BILLING LAW DECIDES ORDER AND THE STYLESHEET DECIDES SIZE, AND NEITHER MAY DO THE OTHER'S JOB.** Mike: *"ALL GIFT SHOP TILES THE SAME SIZE, including Weird.Baby's own."* All three clauses of P11/B1/J3 still run in `billing()` and `data-billing` still reports which branch answered — what top billing lost is SIZE. There is now ONE section and ONE grid; the billed entry is simply the first cell. Measured on the built bundle: 445×298 at desktop and 338×386 at 386px, identical across `owner`, house-on-direct-arrival, `wal-set` and named-WAL-owner. **(2) `.featured-artist--half` AND `.featured-artist__cta` ARE DELETED AND `.wal-banners__grid` IS `.gift-shop__grid`** — the modifier every instance carried was not a modifier, the CTA rule had zero callers, and the grid holds the house too. **(3) `shopExit` ON AN ARTIST ENTRY IS THE TILE'S ADDRESS AND IS READ FIRST**, ahead of the old `shop.url` → `listen.url` → `site` fallback, which stays for anyone with no declared exit. Reordering that fallback fixes nothing: Mikey Mike's `site` IS his video channel. **The four addresses are Mike's and each was opened and read 2026-08-05** — notes sit on each `shopExit`. **(4) THE TILE DOES NOT CLAIM A STORE.** It reads *"Visit X — opens in a new tab"*, because `weekendatmikeys.com` has no shop behind it while the other three front doors do. The dead-tile fallback says *no address on file* and is unreachable today. **Do not "restore" findmikeymike.com** — R-a refused it 2026-08-02 for an injected link farm and that refusal is untouched; `weekendatmikeys.com` is a different address, verified separately (M54). |
| **THE HOUSE'S STANDING PASSAGES** (Doctrine 17) | `src/data/house-copy.js`. **[D1 2026-08-06] A passage that belongs to the HOUSE rather than to a room is declared HERE and every room IMPORTS it.** Mike: *"the same content exists in multiple rooms with no link between the copies, so fixing one never fixes the other… he edited the contact answer once and it survived elsewhere; that is the defect, not his memory."* Holds `KEEPER` (the booth's *Who keeps this place?*, printed on /wb's ABOUT THE ARTIST register since P9) and `CONTACT` (his D2 wording). **EVERY STRING IN IT IS A PLAIN LITERAL, DELIBERATELY** — `provenance:gate` sweeps `src/` for string literals, so hoisting keeps a passage inside the boundary and simply collapses N register rows into one; a passage assembled by interpolation would fall OFF the boundary silently, which is a worse defect than the duplication it would cure. **WHAT DOES NOT GO IN IT:** anything a room says about ITSELF or about an artist. Two rooms saying similar things about different objects are two passages that rhyme, and folding them would invent a house position out of a coincidence of wording — the mistake the provenance register's RESTATED class already paid for once. ~~**ONE KNOWN COPY IS DELIBERATELY NOT WIRED IN:** the robots front desk's bare-address contact answer, because that face is Mike's word for word (P3) — reported as M66 instead.~~ **[R1 2026-08-06] HE RULED IT AND IT IS WIRED IN.** *"Both rooms use my verbatim contact answer. No follow-on sentences."* `robots.js` imports `CONTACT`; the bare address is gone; **there is no longer any known unlinked copy of a passage in this file**, and the header paragraph that named the exception is rewritten rather than left standing. It was one import, which is what M66 said it would be. |
| **THE HELD WING — `/hr` BEHIND A PASSWORD** (H1, 2026-08-06) | `src/worker.js` (the lock) · `wrangler.jsonc` `assets.run_worker_first` (the routing that makes the lock reachable) · `vite.config.js` `HELD_PATHS` + `heldChunkGuard` (which chunks go behind it) · `src/App.jsx` (the two lazy routes) · `src/routes/HeldWing.jsx` + `src/lib/held.js` (the browser half) · `src/routes/WbAdmin.jsx` `HeldDoor` (the door and its explanation). **MIKE'S RULING: he does not want `/hr` public; he does want it online and reachable by him and by Ops, behind a PASSWORD entered on the ADMIN PAGE.** **FIVE THINGS A FUTURE SESSION MUST HOLD.** **(1) THE LOCK IS THE WORKER AND NOTHING ELSE IS.** `HeldWing.jsx` and `held.js` only decide whether the router bothers to ASK for the wing's chunks; the `sessionStorage` flag is plain and forgeable ON PURPOSE, because forging it buys a chunk the server refuses and a render of the Lobby. **Do not “harden” the browser half — anything that looks like security there is theatre, and a change belongs in the worker.** **(2) `run_worker_first` IS LOAD-BEARING IN BOTH DIRECTIONS.** Without `"/assets/held/*"` the worker is never asked and the wing is public again, silently. Without `"/api/*"` **every API route dies** — declaring the list at all makes everything else asset-first, and the SPA fallback answers `/api/anything` with index.html and a 200. That is not hypothetical; it happened in this round's test. **(3) IT FAILS CLOSED AND FAILS LOUDLY.** `env.HR_KEY` has no default anywhere; unset, `/api/held` returns 503 with the words `npx wrangler secret put HR_KEY`, which is a deliberately different sentence from *Wrong key* and is declared ONCE, in the worker, with `/admin` printing what the worker sends (Doctrine 17). **The cookie is `sha256("wb-held-v1:" + key)`, HttpOnly, Secure, SameSite=Lax, 30 days — the secret never travels back to the browser.** **(4) `heldChunkGuard` FAILS THE BUILD IF A HELD MODULE LANDS IN A PUBLIC CHUNK**, because a naming rule that silently stops matching is exactly the failure R5 paid 153 mp3 URLs for. `HELD_PATHS` is his material; `HELD_COMPANIONS` is the museum's own generic machinery that only this wing happens to import — **keep the two lists separate**, because a companion becoming publicly reachable must shrink the held chunk rather than break the build. **(5) `/hr` RENDERS THE LOBBY, NOT A LOGIN.** A password box at a public URL announces that a room is there; the catch-all's own behaviour does not. There is deliberately no `robots.txt`: a `Disallow` line is a public list of what you are hiding. **WHAT IT DOES NOT DO:** the chunk's ADDRESS is visible in the public bundle (the address is not the material), and **`/wal` still shows two of his songs, his artist card and all 97 vault facts** — `docs/HR_PERMISSION_AUDIT-20260806.md` §5. Register: M79–M85. |
| **THE VAULT-AUDIO BOUNDARY** (R5, ruled 2026-08-06) | `src/data/exhibits/vault-audio.js` → `stripVaultAudio`, called by `src/data/exhibits/hunter-root-served.js` (runtime) and by the `hr-vault-audio` plugin in `vite.config.js` (build, `enforce: "pre"`). **MIKE'S RULING: the museum does not have Hunter Root's permission, so the vault keeps the material and the site stops serving it.** **THREE THINGS A FUTURE SESSION MUST HOLD.** **(1) THE RAW EXPORT HAS NO OTHER READER IN `src/`.** `hunter-root-catalogue.js` and `HrExhibitFlow.jsx` both import `hunter-root-served.js`; importing `hunter_root.json` directly is the defect this file exists to prevent, and there is nothing that will tell you if you do. **(2) TWO PASSES IS NOT A DUPLICATION AND REMOVING EITHER IS A REGRESSION.** The runtime pass covers the dev server and any future consumer; the BUILD pass exists because a runtime filter stops the REQUESTS and still ships the ADDRESSES — the first build after the filter went in carried **153 vault mp3 URLs in plain readable text**, which is the site publishing exactly what it had stopped handing out. Both call the same function, which is pure and idempotent precisely so both can stand. **(3) IT MATCHES THE PATH, NOT THE EXTENSION** (`assets.weird.baby/audio/`), so a future export in a different container is caught, and a link to somebody else's audio never is. **WHAT IT DELIBERATELY DOES NOT TOUCH:** the track ROWS (93 stay on `/hr` and `/hr/archive` — the museum still holds them, and a catalogue is a holdings listing), the 33 YouTube renditions, and **the vault's IMAGES**, which are 18 requests on a full `/hr` pass and are the same permission question stated as `OPEN_ACTIONS.md` **M73** rather than absorbed. Downstream, 60 tracks draw `.tl-novid` and the deck overlay's *unavailable* — **both pre-existing states; no render path was written for this** — and what the page should look like instead is **M71**. |
| **HUNTER ROOT'S CATALOGUE** | `src/data/artists/hunter-root-catalogue.js` → `HR_ALBUMS` (the presentation config, moved unchanged out of `hunter-root.js`), `HR_SPINE`, `HR_KIND`, and the derived `HR_RECORDS` / `HR_EXTRAS` / `HR_TRACKS`. **[D3c 2026-08-06] IT EXISTS BECAUSE `/hr/archive` WAS A THIRD COPY OF THIS CATALOGUE AND NOBODY HAD LOOKED AT IT.** `HrArchive.jsx` held a hand-typed ALBUMS array — described in `CLAUDE.md` as "a title-only mirror of the spine" and kept in step by nothing — printing **six containers against the vault's nine** (Run With The Hunt and the Phone Recordings EP were not on the page), SINGLES & RARITIES as a one-title "Singles" strip, four of its seven tracks filed under three other records, two They Finally Cracked Me titles that are not on it, and a header reading *"6 albums · 71 songs · 2018 – 2025"*. **It is DELETED, not corrected** — it drifted through six museum-wide figure sweeps unnoticed because nothing links a copy to its source. **`HR_KIND` is the one thing declared rather than derived:** seven containers are records, one is an EP and one is a set BY THEIR OWN TITLES, and that reading is a judgement about two titles written down once instead of re-made by every surface. Parsing it out of the title string would be a guess dressed as a derivation. |
| **Routing table** | `src/App.jsx`. Order to know: the two named rooms, the `/money` → `/foundation` redirect, `/p/:id` preset landing, then **`path="*"` → `<WbHome />` (E2 2026-08-03)**. **[v51] NO QUERY PARAMETER SELECTS A VARIANT ANYWHERE IN THE BUILDING.** `?subtitle=`, `?hook=` and `?book=` have all now been retired the same way — shown, asked about, ruled on, deleted — and `useSearchParams` is imported by neither `WbHome.jsx` nor `InfoBooth.jsx` any more. A round that wants to show Mike two of something builds them, gets the ruling, and deletes the loser in the same arc. **[CS 2026-08-04] THREE `/hr/*` ROUTES ARE GONE and their components deleted:** `/hr/media` and `/hr/fan-wall` were one-line "— coming soon." pages; `/hr/home` was a stock interior photo (`public/museum.jpg`, also deleted) with its room labels PAINTED INTO THE IMAGE, advertising four rooms that never existed. All three now land on the Lobby via the catch-all. **`/hr` (the real exhibit) and `/hr/archive` are untouched and still reachable by URL only.** The catch-all RENDERS the Lobby at the unmatched address rather than navigating to `/` — Mike's ruling, "no dead end, no blank shell, no apology". Before it existed an unmatched path rendered the shell and nothing in it, and `wrangler.jsonc` sets `not_found_handling: "single-page-application"`, so Cloudflare hands EVERY unknown path to the router. |
| **WORTH A LISTEN's house poster — THE BILL** (`/wal`, first album, first track) | Data: `HOUSE_ALBUM.tracks[0].face` in `src/data/artists/worth-a-listen.js`. Render: the `face.bill` block in `src/routes/exhibit/Exhibit.jsx`. Styles: `.vp-bill*` in `Exhibit.css`. **The four acts are BUILT FROM `ARTISTS` by `billActs()`** — name, album id and picture are read off the same entries the coverflow is built from, so the poster cannot advertise an artist the room does not contain; only `what`, `why` and `hue` are authored, and `hue` is declared in the data as a design choice rather than a fact about anybody. **[THE WAL POSTER EDIT 2026-08-05] Four strings were struck on Mike's ruling and three things a future session must hold. (1) `bill.standard` and `bill.foot` ARE STILL SUPPORTED** — the render is conditional and the CSS stands; the fields are undeclared, not removed, so a later face may declare either. **(2) `.vp-bill-go` IS GONE and that reverses P6 on this object** — the per-act "Open the room" chip was the panels' only WRITTEN affordance, and a panel is now a door signalled by hover and cursor alone (M51). Do not restore it without Mike's word; the strike was explicit. **(3) THE `papa` FIELD'S UNMARKED SENTENCES PRINT.** `visitorProse` cuts by SENTENCE, by design and documented in `src/lib/visitor-prose.js` — so this face's `[PAPA]` note ships its second sentence as the last line on the poster (M53). **A `papa` string is not a comment: write the whole note inside one marked sentence, or expect the rest on the glass.** Hunter Root's `why` is the one line on this face rebuilt from the vault rather than from its predecessor — the count and its method are the citation on its register row, and the same figures are still wrong on his artist card (M50). |
| JS token mirrors for inline `S.*` styles | `HrExhibitFlow.jsx:104–132`. Drift RESOLVED at `36b2182` — JS constants match the `--hr-*` CSS ramp; still a hand-maintained literal mirror (token edits do NOT auto-propagate to inline `S.*` styles). |
| Pass-2 aesthetic blocks | `Exhibit.css:13–27` grain (`.ex-root::after`); `HrExhibitFlow.css:1821+` (lightbox dark re-pin :1836, badges :1853, cards :1826); player-bar dark re-pin `Exhibit.css:152` |
| Logo image (Lobby ONLY; exhibit uses text wordmark) | `public/WeirdBaby_PhotoID.png`, placed `WbHome.jsx:115` |
| Brand wordmark trial (Fredoka, nav only) | token `--wb-brand`; applied `Exhibit.css:36` |
| Mothballed Kaleidoscope (never mounted) | `HrExhibitFlow.jsx` :812/:852/:868/:947 + `.hr-kal-*` CSS |
| **The Record's long-form ENTRY** (headline / dateline / lead / sections with inline door icons / tombstone) | `src/routes/exhibit/RecordEntry.jsx` + the `[RC]` block at the end of `Exhibit.css`. **Mounted from `Exhibit.jsx`'s opened-record branch, and the switch is the DATA: an entry declaring `sections` renders it, an entry that does not renders exactly what it rendered before.** The index, open/close, `wire`/`plates`/`docs` payloads and the ‹ NEWER / OLDER › walk stay in `Exhibit.jsx`. Dateline arithmetic (`entryWeekday`/`entryWeek`/`entryDateline`) is in `src/lib/record-model.js`; `Week n` needs a `recordEpoch` on the face and a `date` on the entry, and **as of v47 the Record declares NEITHER** — Mike ruled the dates invented, so the dateline prints `Record 013` alone and the model's undated path is the live path, not a fallback. **The Record holds exactly ONE entry** (v47/H2): the other ten were fiction and were deleted, and the face has no `blurb`, `still`, `stillCaption`, `lines` or `footer` — it is a heading and its entries, by ruling. Open gaps are questions for Mike in `docs/RECORD_013_QUESTIONS-20260804.md`, never filled in the data (Doctrine 12). **Three near-identical class prefixes live in `Exhibit.css` and mean different objects: `.vp-record-*` is an artist's chart/awards BOARD, `.vp-rec-*` is The Record, `.vp-rec-door` is a door inside a record entry.** |
| **Provenance boundary + gate** (Doctrine 13) | `tools/provenance-sweep.mjs`; declarations in `provenance/register.json` (strings) and `provenance/assets.json` (images). `npm run provenance` reports, `npm run provenance:gate` exits 1. `provenance/README.md` is the model AND the honest hole-list. `provenance/backfill-20260804.mjs` is the audit record of the first classification and **must not be re-run** — its rules would silently absorb new content. |
| **THE REVEAL LEDGER** (v52, re-cut v55) | `reveal/ledger-declare.mjs` → `reveal/ledger.json`, **152 rows, one per REVEALABLE THING** across both repos: what it is, `build` (LIVE/PARTIAL/STUB/NOT_BUILT — what is true today), `reach` (how a visitor gets to it, null if they cannot), `state` (HELD/REVEALED/RETIRED), `when` (the story day — **null on every row, by Doctrine 12**), `deps`, the ruled `revealArc`, and `shown` (a visitor can READ THE LABEL of something not built — the difference between a gap and a debt). **`build` and `state` are two axes; conflating them is the first mistake anyone will make.** `npm run reveal` / `reveal:audit` / `reveal:cards` / `reveal:check` / `reveal:build`. **NOT A RIVAL TO THE ASSET TABLE** — that is one row per FILE and stays the authority on files; this restates no byte count, dimension, quality read or verdict, and they meet at `assets: [uid]`. **The reader is `src/lib/reveal.js` and it returns STATE, never WORDS** — `provenance:gate` sweeps only `src/` and `index.html`, so a ledger row supplying printed letters would take them off the provenance boundary. **One consumer is wired: `/foundation`'s LIVE / NOT BUILT column.** Model + honest hole-list: `reveal/README.md`. Audit: `docs/REVEAL_LEDGER_AUDIT.md`. <br>**[v55 2026-08-05] FOUR THINGS A FUTURE SESSION MUST HOLD BEFORE TOUCHING IT.** **(1) THE RECORD IS CUT ONE ROW PER ENTRY AND THE ROWS ARE DERIVED, NOT TYPED.** `reveal/record-entries.mjs` parses the Record out of `src/data/artists/robots.js` (acorn + acorn-jsx — that file imports JSX and node can never import it) and is **split in two on purpose:** `entries()` returns entry numbers and asset paths **and nothing else**, and it is the only half the ledger builds from, so a headline has no route into the table; `prose()` returns every sentence and **builds nothing** — it exists so the check can police the rule. **THE LEDGER MUST NEVER BECOME A SECOND COPY OF THE RECORD (audit §8a), and that is enforced three ways, not asserted once:** the generator cannot see the words · `reveal/schema.mjs` refuses the Record’s FIELD names on any row · `reveal:check` refuses its SENTENCES (six consecutive words of Record prose, or any whole Record line of four words or more, in `name`/`note`/`reach`/`where`/`deps`). A fourth check requires the rows and the entries to be the same set in both directions, which is what finally makes *never edit `ledger.json` by hand* enforced rather than requested. **`doc.record` survives and is now THE VOLUME ONLY** — M18’s twenty-seven questions moved onto `record.013`; M19 (what a record NUMBER means) is a volume property and stayed. **An entry the Record has not numbered FAILS THE BUILD** rather than being given an id, because minting one is Ops answering M19 with a guess. **(2) `reveal/schema.mjs` HOLDS THE ONE VALIDATOR AND BOTH CALLERS RUN IT.** Before v55 the declaration checked five rules as it wrote and `reveal:check` checked four afterwards, and neither list was a superset of the other — a rule was enforced at whichever moment the author happened to run. **(3) `prod` IS NOT `arc`.** `prod` (needed · printed · photographed · placed) is the MANUAL-PAGE vessel’s field and no other row’s: `arc` is how the house REVEALS a thing it has, `prod` is whether the house HAS it, and `build` is DERIVED from `prod` so a page cannot claim a state the world is not in. The vessel (`manualPageRow()`) is Mike’s ruling that the manual **arrived in pieces** — the museum needs only the pages the story reaches for, called for by a `record.NNN` entry — and it is **built, empty by instruction (M44), and proved by `reveal:check` building specimens at all four stages and asserting every refusal, so no page is invented to test the container.** **(4) `npm run reveal:cards` IS AN OPS INSTRUMENT AND MUST NEVER BECOME A ROUTE** — the audit §8b cue cards, same shape and same reasoning as `assets:checklist`. Its default deck is **the 49 HELD undated rows, deliberately not all 143 undated rows**: 93 of those are already REVEALED and nobody wrote down the day they came out, so a card asking for it invites an invention. <br>**[T1 2026-08-05] THE FOUR TRANSFER CLASSES — `reveal/transfers.mjs`, and every row now carries `transfer` + `transferWeek`.** Mike's insight is the foundation and it is load-bearing: *the first Record must produce the first images of NIAC and VIIIp, WHICH MEANS THOSE IMAGES ARRIVED IN THE EMAIL BLAST* — so the blast is cover for everything else the site already shows, and **94 rows stop needing 94 explanations.** **BLAST** 102 (Fri–Sun pre-launch, week 0; deliberately MORE than was published, so a later reveal of built material needs no new arrival — 94 on the glass, 8 held back) · **PACKAGE** 9 (weeks 3–7, four Fridays, physical; they earn their photographs) · **UNLOCK** 13 (in hand from week 0, could not be opened) · **TRANSMISSION** 6 (months 2–3) · **22 EXEMPT, IN WRITING, each with a reason.** **THE RULE — an asset may only be SHOWN after it has been TRANSFERRED, and every asset belongs to exactly one class — is THREE CHECKS called from `validate()` so both callers run it** (the same one-validator doctrine as v55): every row is placed or exempted in writing and **a fall-through FAILS THE BUILD** · a row with no named arrival week may not be `REVEALED`, **and neither may an exempt row**, so exemption cannot become the way round it · nothing is shown before it lands. `transferGuardFaults()` proves each refusal refuses, with **literal expectations rather than values read back out of the table under test.** **THE ARC FIXES TWO ARRIVAL WEEKS, NOT FOUR:** BLAST week 0 (stated) and UNLOCK week 0 (derived by necessity — a thing already in hand is in hand because the blast brought it). PACKAGE and TRANSMISSION carry **no week**: weeks 3–7 is FIVE Fridays against FOUR packages and which goes empty is not in the arc (Doctrine 12). **`when` is STILL null on all 152 rows** — the arc supplies ARRIVALS, not REVEALS, and they are different fields. **TWO TENSIONS, BOTH THE MODEL WORKING:** the MANUAL spans classes 1 and 2 (volume BLAST, pages PACKAGE) because **nobody ever had the whole manual in one piece**; the PORTAL is class 1 by necessity, so **it arrived complete and mostly dead** — five drum positions and the seeded dial are UNLOCK, engraved where a visitor reads them and inert. **AND ONE LIVE BREAKAGE:** `reveal:check` had been DEAD since robots `4cd78ac` retired all 24 manual renders under a path museum v55 had wired in three hours earlier — it did not report a fault, it **died on a stack trace**. Now reported as one named fault (*a gate that crashes is not a gate*) and **NOT auto-repointed**, because page 7 of the new 61-page structure issue is not page 7 of the 24-page manual and **the canon on the glass is 24**. That reconciliation is Mike's — `docs/OPEN_ACTIONS.md` **T-A**, and the gate is RED until it is ruled. Timeline Mike reads: `docs/ASSET_TIMELINE.md`. <br>**[v56 2026-08-05] 152 → 156 ROWS, AND FOUR THINGS THAT ARE NOT OBVIOUS FROM THE DIFF.** **(1) `face.viiip.record` IS NOW `face.wbr.record`** — the only id this table has ever renamed, done because the Record moved albums and nothing outside `reveal/` reads it. **(2) TWO EGGS ARE THE ONLY WRITTEN FORM OF THEIR OWN CONTENT.** `egg.channels` holds the reason the Portal's drum is numbered from 3 for the VIIIp, and `egg.niac.operator` holds *"NIAC is so complicated they needed a robot to operate it"* — **neither is printed on any page, in either repository, and this file is where they live.** Both are `shown: false`, which is the whole difference between an egg and a debt. **(3) `MANUAL_PAGES` IS GONE FROM `schema.mjs`** — the count is derived from the robots repo's own directory listing, so re-running that generator at any length cannot break the gate again, and `validate()` now faults a `doc.manual.page.NN` row naming a page the document no longer has. **(4) `doc.manual.page.*` IS THE TABLE'S ONE PATTERN-ASSIGNED TRANSFER CLASS** (`transfers.mjs` `PATTERNS`), because vessel-built ids cannot be typed into a literal list before they exist — with a fault if a pattern ever also matches a row placed by hand. `record.NNN` is deliberately NOT patterned: which transfer a week's material rode in on is a judgement per entry. |
| **The open-action register** (Doctrine 14) | `docs/OPEN_ACTIONS.md` — every open item in both repos, one place, updated by every round in the commit it seals. |
| **MENU PARITY** (v56/R2, ruled P1, **RE-RULED AND REVERSED, REMOTE CONTROL P1**) | `tools/menu-parity.mjs` → `npm run parity` / `parity:gate`. **[REMOTE CONTROL P1 2026-08-05] PARITY IS ABSOLUTE. MIKE OVERRULES THE OPS RULING BELOW AND THE REVERSAL IS RECORDED RATHER THAN ABSORBED.** *"NIAC and VIIIp carry THE SAME MENU ITEMS, no more, no less. The three gaps are TEMPORARY HOLDINGS, not design — NIAC will run on the Portal on channels 1/2 and it will have a manual. So NIAC's rows exist and say plainly what is not there yet."* **A DIVERGENCE IS A FAILURE AND NO WRITTEN REASON RESOLVES ONE** — the `JUSTIFIED` table, the HOLDINGS · PROPERTY · DESIGN `kind` column, the stale-justification check and the `reveal/ledger.json` read that faulted the day a named holding arrived are **all deleted**. That ledger read was the best mechanism in the old file and it is **mourned in the new header with its commit named (`eccb0b0`)**, because under an absolute rule it has nothing left to guard and whoever ever softens parity again needs to know it existed. A **duplicate-title** check was added: two rows called FAQ on one album against one on the other is a divergence set arithmetic cannot see. **THE STUB LAW IS OVERRIDDEN FOR THE MAINFRAME'S MANUAL AND FAQ ROWS AND FOR NOTHING ELSE**, with his reason written where the rows are — *a row is a promise only when nothing is coming, and these are coming*. **DOCTRINE 12 IS NOT SUSPENDED INSIDE THEM:** the manual row states what is NOT held and invents no section list, no date and no page count. **IT IS A PACKET GATE NOW** and that change of status IS the ruling — it used to report a JUDGEMENT (should these two carry the same doors?) and now reports a FACT with one right answer, which is what lint and build report. It still does not parse the front desk, and it does not parse THE PORTAL, which is a door rather than a machine. Today: **4 shared · 0 divergences**, proved by breaking it on a file copy (2 faults → restored → 0). Previously: **[P1 2026-08-05] THE RULING, AND IT IS WHAT THE TOOL NOW ENFORCES: parity is the DEFAULT, a divergence is a YELLOW FLAG, and a flag justified in writing by a HOLDINGS GAP is RESOLVED rather than overridden — NIAC's menu shows what NIAC has.** Mike's reasoning is THE STUB LAW's own: forcing parity would print a NIAC manual face with no manual, a portal face with no feed and three questions nobody asked — rows that lead nowhere. So a holdings gap is not a reason to bend the rule, it is the rule's answer; a design preference is not, and keeps standing in the light. **Every justification carries a `kind` — HOLDINGS · PROPERTY · DESIGN — and the third is why the other two mean anything.** Nothing uses `DESIGN` today and it is declared anyway: without it the first divergence that IS somebody's preference has two boxes and both say RESOLVED. **A HOLDINGS GAP MUST NAME `holding`: the ledger row that would exist AND BE BUILT if the museum held the material.** The check reads `reveal/ledger.json` — a row that is absent and a row that is present-but-`NOT_BUILT` are the same fact here — and **faults the day the holdings arrive**, which is what turns *"the flag clears itself"* from a sentence into a mechanism. Today: `doc.manual.niac` (not a row at all — the absence is the proof), `portal.feed.niac.1`/`.2` (rows, NOT_BUILT), `face.niac.faq`. **Four failure directions now, all broken on purpose: undeclared divergence · stale justification · unclassed or mis-shaped kind · holdings arrived.** Result: **2 shared · 4 divergences — 4 RESOLVED · 0 standing flags · 0 undeclared.** Previously: **MIKE'S RULE: the MGK-NIAC and the MGK-VIIIp carry the SAME MENU ITEMS BY DEFAULT — no more, no less; any difference is a YELLOW FLAG that must be justified IN WRITING.** It reads both albums out of `robots.js` with the acorn + acorn-jsx pair and fails on a divergence nobody has written a reason for — **and on a reason for a divergence that no longer exists**, because a justification table checked in one direction rots into a list of excuses with a real divergence hiding inside it. **Today 2 shared · 4 declared · 0 undeclared**, and three of the four are HOLDINGS GAPS rather than design (no NIAC manual, no NIAC portal feed, no NIAC questions of its own) — which is the same sentence three ways and is register row M47. **IT IS NOT A PACKET GATE and must not become one**, on exactly `assets:gate`'s reasoning (Doctrine 15): it reports a JUDGEMENT about whether two exhibits should carry the same doors, and a judgement as a build blocker turns every honest asymmetry into a commit that will not land. It does not parse the front desk — that album is the house's own, not a machine. |
| **THE RECORD'S NAVIGATION + SESSION DEFAULTS** (REMOTE CONTROL P4/P5) | `RecordJump` in `src/routes/exhibit/Exhibit.jsx` (module scope, above `openedAt`) + `src/lib/record-read.js` + the `[P4]` block in `Exhibit.css`. **FOUR THINGS A FUTURE SESSION MUST HOLD.** **(1) IT RENDERS NOTHING TODAY AND THAT IS THE LAW WORKING, NOT A BUG.** The Record holds ONE entry; three buttons pointing at the record you are already reading are three dead controls, so the bar gates at `list.length > 1` — **and so does the in-record ‹ NEWER / OLDER › walk, which had been drawing two permanently disabled halves and a count reading "1 of 1" since M5.** The KEYBOARD is not gated: Escape closes whatever the volume holds. **(2) THE COVERFLOW YIELDS `←` `→` TO AN OPEN RECORD**, expressed as a guard in the carousel's own handler rather than as a listener race — two `document` listeners in one phase cannot be ordered. **The cost is real: with a record open the arrows will not walk the carousel.** **(3) UNREAD MEANS THE OLDEST RECORD NOT YET OPENED**, not the newest unseen one, because a Record is followed forwards; it is keyed on the entry's own NUMBER and never on its index, since the list reads newest-first and an index points at a different entry the day one is inserted. **(4) `key={open}` REMOUNTS ON EVERY WALK ON PURPOSE** — an animation on a live element does not re-run, and the scroll-into-view is a mount effect that only fires when the head is NOT already comfortably on screen. The whole animation lives inside `prefers-reduced-motion: no-preference`, so reduced motion is the ABSENCE of the rules and nothing can be left at opacity 0. <br>**[P5] EVERY VIEW SETTING IS `sessionStorage` IN EVERY WING** — splits, carousel and viewer heights, /hr's deck width, and **the `bodyKey` READ that decides whether the visitor has already chosen a height**, which was still looking in the old store and would have re-fitted over a drag from five minutes earlier. F3's session scope had been handed only to wings declaring `fitOnEntry` (/wal) since 2026-08-02, so three wings out of four were restoring a dragged split across months and machines — F3's own stated failure, left true. `useArrival` now covers `/hr/archive` and `/admin`, the two routes that never called it. **TWO THINGS STAY IN `localStorage` AND THE BOOTH'S PRIVACY ANSWER NAMES BOTH:** /hr's preset slots and the Record's read register — **a SETTING expires with the visit, a thing the VISITOR MADE does not.** `usePersist`'s local branch now has no live caller and is kept anyway, because a helper that can only do one of the two makes the other look like an oversight. |
| **THE SURFACING REPORT** (v56/R7) | `tools/surfacing.mjs` → `npm run surfacing` (`--log`, `--wing`). **MIKE'S GAP: every exhibit needs a RHYTHM OF SURFACING, plus periodic SHORTS, because assets get built and sit and nothing asks what has not been shown.** The diagnosis was sharper than the ask — `reveal:audit`, `assets:scan` and `reveal:cards` all already knew, and **none of them was ASKED**. So it computes NOTHING NEW: it re-cuts `reveal/ledger.json` and `provenance/asset-table.json` **BY WING**, which is the only cut a person can act on. **The cadence is Ops' proposal and is stated as one: ONE SURFACING PER PACKET, and the shelf must not grow two packets running.** It runs beside lint and build because **the packet is the only clock this repo has** — there is no CI and deploys are manual, so a cron nobody runs would claim a rhythm it does not have. `--log` appends one dated line to `docs/SURFACING_LOG.md`, which is what makes the number a TREND rather than a reading. **IT IS NOT A GATE** — an unshown thing is inventory, not a defect, and `--gate` does not exist on purpose. **IT REFUSES TO COUNT SHORTS AND REFUSES TO PRINT A ZERO FOR THEM:** a short is a CUT, the storyboard doctrine and the cutting live in the robots repo, and a zero here would read as *none were made* when it means *this tool cannot see*. That is register row M46. |
| **The asset table + approval gate** (Doctrine 15) | `tools/asset-table.mjs` → `provenance/asset-table.json`. 251 media files across the museum and robots repos with what each is, what depends on it, an Ops quality read, **Mike's verdict, unset by default**, and **[N8 2026-08-04] `revealArc`** — `arrived / understood / partial / online / null`, Mike's canon for how a thing is revealed, where `null` means UNSET and is NOT a stage (populated on 6 rows, unset on 245). `npm run assets` / `assets:scan` / `assets:checklist` / `assets:gate`. The scan rewrites only measured fields and **never** touches the five judged ones (`what` / `quality` / `qualityNote` / `verdict` / `revealArc`). **[C32 CLOSED v52] IT IS NO LONGER KEYED BY PATH.** Every row carries a **`uid` minted once and never rewritten** — that is the row's NAME, and `id` (repo:path) is demoted to an ADDRESS — plus a **`sha256`** re-measured each scan. Matching goes address → content → nothing: a prior row and a new file sharing a hash inside one repo are the same file MOVED and the judgement travels automatically. Where a rename ALSO re-rendered the file (the ordinary case, because the name is usually IN the picture) **no keying can infer it, so the scan REFUSES TO GUESS and reports the judged row under its own banner**; `npm run assets:rename -- <old> <new>` is the explicit human declaration, and `assets:orphans` lists them. **The silence was the defect; the hash only makes it rarer.** The first run caught v51/A7's own stranded `jesse-welles-plate.jpg` alongside this round's cover rename. **`usedBy` MATCHES AGAINST SOURCE WITH COMMENTS STRIPPED** (N8) — before that a path merely NAMED in a comment counted as a reference, so any orphan was invisible for as long as anybody had written its name down. NOT a packet gate — see Doctrine 15. |
| **The archive (IMAGE ARCHIVE)** | `ArchiveWall` + `archiveSpreads` + `SpreadHead` + `SpreadTiles` in `Exhibit.jsx` (module scope, just below `FaceFlow`); `.vp-spread-head` / `.vp-spread-stow` in `Exhibit.css` beside `.vp-collage`. A face declaring `spreads:[{head,no,tiles}]` stacks in headed albums sorted by record number descending; a face declaring only `collage` emits the DOM it always did. **[N2 2026-08-04] THE FIRST SPREAD IS OPEN AND EVERY LATER HEADED SPREAD IS STOWED** in a native `<details>` whose closed line carries its own head, its record number if any, and its COUNT — which is why it does not trip the no-hidden-information law. An unheaded spread is never stowed. `face.archiveUnit = {one,many}` names the count's noun (default `image/images`; the robots wing says `plate/plates`). Both walls are in `robots.js` (`mgk-viii` and `mgk-viiip`, track id `plates`). **[v56/R4] THE MGK-NIAC WALL IS NO LONGER ONE OF THE SPREAD-STACKING CASES, AND THAT MATTERS TO WHOEVER TOUCHES THIS COMPONENT NEXT.** Mike's canon made the mainframe the subject and the camera-body robot an easter egg, so six robot plates and a bench shot came off the wall and **the FEBRUARY 2013 spread went with them** — it was three plates of the figure. The wall is four cabinet plates in one unheaded `collage` now. **THAT WAS THE ONLY WALL IN THE MUSEUM WITH MORE THAN ONE SPREAD, so `SpreadHead` / `.vp-spread-stow` and the whole stowed-shelf mechanism have ZERO live callers** — do not read the code's presence as evidence it is exercised (register C29). **THE ROOM WAS CALLED THE MORGUE FOR ONE ROUND** (v49/A3 printed both candidate names so Mike could strike one) — he struck it at v50/N1, and `morgue` outside a historical comment is now a miss. Its two siblings, VIDEO ARCHIVE and AUDIO ARCHIVE, are named in `robots.js`'s header and deliberately NOT built. |
| Exhibit data export | `src/data/exhibits/hunter_root.json` via `npm run export-artifacts` |
| Spine adapter (stable ids) | `src/data/artists/hunter-root-spine.js` |
| Taxonomy v1 canon (June 9) | `docs/taxonomy/` — TAXONOMY_v1, NORMALIZATION_MAP, COVERAGE_PROOF, RETAG_PLAN |
| Retag tooling | `tools/retag_v1.ps1`, `tools/coverage_check.py` |

**[v53 2026-08-05] THE THIRD PARTIES THIS SITE TOUCHES, MEASURED RATHER THAN
GREPPED.** Read off `performance.getEntriesByType('resource')` in every room
after a nine-second settle, with **nothing clicked**:

| room | third-party hosts requested on load |
|---|---|
| `/` · `/booth` · `/shop` · `/foundation` · `/hr/archive` | `fonts.googleapis.com` + `fonts.gstatic.com` |
| `/robots` · `/wal` · `/wb` | + `www.youtube.com` ×3 |
| `/hr` | + `www.youtube.com` ×3 **+ `www.facebook.com` ×16, in 17 iframes** (also `assets.weird.baby` ×11, which is the house's own host) |

**[H1 2026-08-06] AND THE `/hr` ROW IS NO LONGER A ROW ABOUT VISITORS.** The wing is behind a password, so its Google/YouTube/Facebook requests are now made only by Mike and by Ops. **Nothing a member of the public loads in this museum touches `www.facebook.com` at all** — the sixteen plugin frames are the only Facebook in the building. **The booth's privacy answer therefore OVER-discloses for the first time**, claiming a leak the museum no longer has; it was NOT edited, because it is Mike's answer and R6 ruled its posture one round ago. That is register **M79** and it is one clause when he rules.

**[R6 2026-08-06] THE `/hr` ROW IS CORRECTED AND THE CORRECTION IS THE THIRD TIME
THIS ONE CLAUSE HAS BEEN WRONG IN THE MUSEUM'S OWN FAVOUR.** Re-measured on the
BUILT BUNDLE: `/hr` **on arrival**, nine-second settle, nothing clicked and
nothing scrolled, requests Google Fonts, `www.youtube.com` ×3 and
**`www.facebook.com` ZERO**. The plugin frames carry `loading="lazy"`
(`HrExhibitFlow.jsx:2240`) and sit below the fold; **scrolled to the bottom** it
is `www.facebook.com` ×16 and 17 iframes, exactly the figures above — v53 took
its reading with the deck already open, which is why it read as arrival.
`assets.weird.baby` is ×11 on arrival and **×18 on a full pass**. The booth's
answer now says WHEN rather than implying on-load, and **M37 is RULED: option A,
disclose** (see below).

YouTube arrives from `Exhibit.jsx:333` (`iframe_api` injected on mount, not on
play); Facebook from `HrExhibitFlow.jsx:2110`'s `facebook.com/plugins/` URL
behind the `hr-card-fbembed` cards. **`/booth`'s privacy answer states all
three, and a change to any of them changes that answer first** — the answer's
outbound clause has now been wrong twice and re-written three times, and the
reason is structural: **a grep of `src/` finds the STRING; only loading the page
finds the REQUEST.** `provenance:gate` cannot see this class of claim at all
(see `provenance/README.md` §4). ~~The open ruling is `OPEN_ACTIONS.md` M37.~~
**[R6 2026-08-06] M37 IS RULED — A, DISCLOSE.** Mike: *"disclosed, not deferred,
not click-to-load."* The booth's answer IS the remedy, which is why the table
above is now a packet-relevant fact rather than a curiosity: **change any embed
anywhere in the museum and that answer changes first.** `C34` (click-to-load) is
closed ruled-against; `C12` (the blank FB blocks) stays open and now matters more,
because the embeds are not going away.

**Sibling repos:** MediaVault `C:\AI\Platform\MediaVault` (source of truth;
launch `launch_mediavault.bat` → http://127.0.0.1:51822/db — must be running
before export). Hunter Root archive `C:\AI\Projects\Hunter Root`.

**Release path:** MV release → `npm run export-artifacts` → stage EXPLICIT
paths (never `git add -A`) → commit → push → `npm run build && npx wrangler
deploy` → verify live (incognito for anything platform-embedded).

## 6. Orientation protocol (every fresh session)

**Read order:** (1) this file → (2) `STATE.md` → (3) newest
`docs/HANDOFF_*.md` if present → (4) `git log --oneline -15` +
`git status -s`.

**Truth ranking when they disagree:**
`live tree > git log > STATE.md > handoffs > any chat memory/summary`.
Handoffs rot in days; git log is the progress record. A handoff's
"recommended next step" is a suggestion stamped at write time, not a
standing order.

**Files that do NOT exist (do not look for, do not invent):**
`BUILD_LOCK.txt` — no build-lock mechanism exists. (`C:\AI\START_HERE.md` is now REAL: the cross-project bootstrap, canonical at `docs/canonical/START_HERE.md`, added 2026-06-09.)
(These were hallucinated by a past session and propagated through two
handoffs. If a future session adds a real lock mechanism, it updates this
line.)

**Do not re-investigate closed items.** Check STATE.md "Decisions /
closed" first (e.g., the COL3 FB clip — read
`docs/FINDING-fb-post-clip.md` before touching it).

## 7. Working Doctrine (process rules — paid for by real failures)

Mirrors STATE.md → Working Doctrine; this copy is canonical for process.

1. **Verify before scoping.** Read the actual file in the live working
   tree before reasoning about it. Never scope against memory, Drive
   copies, or assumption.
2. **Don't guess — look it up.** A claim about the codebase not backed by
   a file just read is a guess and must not be acted on.
3. **Default to Cowork for repo work** — repo reads, big-file edits
   (`HrExhibitFlow.jsx`, `Exhibit.jsx`), multi-file scoping. Host pwsh
   paste-back only for small reads; it burns Mike's time and buffer.
4. **Drive the live UI by accessibility ref, not pixel coordinates**
   (tiny dock targets + peek-to-open animation make pixel clicks miss
   silently).
5. **No load-bearing if/else in pasted scripts** (§4.2).
6. **Durability:** committed AND pushed AND (UI) deployed. Scratch files,
   sandbox files, and local commits are not durable.
7. **A behavior does not change unless there is a stated reason.**
8. **Prefer native/platform mechanics over custom logic.**
9. **Verify before commit; commit after every verified step** — never
   batch a day's work uncommitted. Platform embeds verified incognito.
10. **Understand the problem before acting.** Diagnose, then fix; don't
    chase the latest screenshot.
11. **THE LAW OF THE VISIBLE LINE (Mike, 2026-08-04 — STANDING, site-wide).**
    **If a line describes the work rather than doing the work, it does not
    ship.**

    The test is the line's SUBJECT, not its tone or its truth. Every line
    removed under this law was accurate; that is what made it survive.

    **A visible line FAILS if its subject is the making of this museum:** the
    drafting, the research, the revision history, what a round did, the form a
    page takes and why, the typography, the renderers, the plan for content not
    yet written, or any person building it named on the glass. Also fails: an
    internal decision code (`(C3)`, `held — storyline first`), an operator
    marker outside the scrubber's reach, and a draft-state stamp (`· v1`) on a
    visitor-facing label.

    **A visible line PASSES if its subject is the collection:** the objects,
    the artists, the events in the record, the institution's standing terms —
    **including honest statements of what is not held.** "No plate on file" is
    a holdings fact and ships. "Nobody has photographed this yet" is a
    production fact and does not. Same absence, different subject.

    Two adjacent traps, both paid for on 2026-08-04:
    - **Provenance is not meta.** A sources line, a citation, an accession
      number, "read at its source" — a museum prints those. What fails is the
      NARRATIVE of the checking ("the first research pass refused it for want
      of proof") and the JUSTIFICATION OF A DESIGN CHOICE ("so they are set as
      plain type", "the withholding is authored").
    - **Mechanism state is not meta.** The Foundation's LIVE / NOT BUILT
      column and "not through this page yet" are Mike's own standing rule that
      nothing may claim a mechanism that isn't built. That is a fact about the
      museum as an institution, not about the website's backlog.

    **The corollary Mike gave with it: empty and honest beats populated and
    false.** A placeholder, a sample, a demo entry, a dead control, a door to a
    room that does not exist, or an annotated wireframe at a live address is
    removed rather than left standing. If one must stay, the Ops reason is
    stated out loud — silence is not an option. What removal EXPOSES gets
    reported, not papered over.

12. **OPS DOES NOT INVENT CONTENT (Mike, 2026-08-04 — STANDING, site-wide).**

    **Where a fact is missing, Ops ASKS. Ops never fills the gap with
    plausible detail.**

    This binds every wing, every surface, every round, and it binds the
    drafting lane hardest — a lane whose job is to write is the lane most able
    to write something that reads true and is not. The existing rules against
    invented provenance, invented captions and invented sources are a SUBSET
    of this one; this is the general form.

    **What counts as invention.** Not only a false claim. Any specific the
    operator did not supply and the record does not hold: a date, a count, a
    time of day, a measurement, a material, a room, a colour, a name, a
    quotation, an ordering, a consequence, a person's reaction. Detail that is
    *consistent* with what is known is still invention if nobody supplied it —
    plausibility is the failure mode, not the defence. A round that produced
    sixty entries where one was supplied produced fifty-nine inventions
    however well they fit.

    **The one-question format**, which is what makes asking cheap enough to
    always be the choice:
    - WHAT IS KNOWN — the fact already in hand, stated back.
    - WHAT IS MISSING — the single gap, named precisely.
    - WHY IT MATTERS — what cannot be written, or what would be wrong, until
      it is answered.

    One gap per question. Questions go in a list Mike can answer one at a
    time, at his pace, in any order — not a paragraph he has to unpick, and
    never a blocking gate that stops the rest of the work.

    **What Ops does with the gap in the meantime.** It ships the surface
    WITHOUT it. A section that cannot survive without invention is CUT and
    named as cut; a field that cannot be filled honestly is DELETED rather
    than approximated; an entry with four known facts prints four facts and
    stops. The question list is the deliverable that replaces the invention —
    it is never printed on the glass, because a question to the operator is
    meta by Doctrine 11 and fails the visible-line test.

    Paid for by the Record: ten dated log entries, a 436-record source line, a
    register block and a header photograph's caption, all invented, all
    surviving four rounds of review because each was plausible. Mike had to
    hunt for the one real record in a pile of fictional ones — and the pile
    had been reported before and survived the report.

    **MECHANIZED 2026-08-04 (v48), and doctrines 11 and 12 are still both
    required.** See #13.

13. **EVERY VISIBLE STRING CARRIES ITS ORIGIN (v48, 2026-08-04 — STANDING).**

    Doctrines 11 and 12 are rules, and a rule only catches what a reader thinks
    to look at. "436 records, kept since January 2024" PASSED Doctrine 11 —
    its subject is the collection, not the making of the museum — and was
    invented. The structural cause was never any one string: **a string could
    enter the codebase and nothing at the boundary asked where it came from.**

    **The boundary now asks.** `npm run provenance:gate` enumerates every
    visitor-facing string in `src/` and `index.html` and fails if any is not
    declared in `provenance/register.json` with an origin class — MIKE ·
    VERIFIED · DERIVED · HOUSE · RESTATED, plus a capped INVENTION holding pen
    for what has no origin and awaits Mike. A row is keyed by a hash of the
    string, **so editing a declared line invalidates its own declaration** and
    fails the gate until it is re-declared.

    **It runs on every packet, beside lint and build.** A packet that adds
    content adds register rows in the same commit.

    **WHAT IT DOES NOT DO, and this must be repeated wherever it is described:
    it cannot verify that a declaration is TRUE.** Nothing can. It makes the
    claim reviewable in one file; it does not make it correct. It also cannot
    read text inside an image (that is `assets.json` plus a human looking),
    cannot detect a correctly-cited number going stale, and **does not replace
    Doctrine 11** — a perfectly-sourced line whose subject is the making of the
    museum still passes it cleanly.

    Full model, the exclusion rules, and the honest hole-list:
    `provenance/README.md` §4. Round log:
    `docs/MUSEUM_PROVENANCE_LOG-20260804.md`.

    **OPS RULING, 2026-08-04 (A10): THE `RESTATED` CLASS STAYS.** Mike's four
    classes are ORIGINS; 282 rows are Ops connective prose that originates
    nothing, and calling those MIKE would be false while calling them INVENTION
    would bury the three real findings under 282 non-findings. **It is kept
    because it has teeth, not because it is convenient:** a `RESTATED` row's `r`
    must RESOLVE, and it may not point at its own file — which is exactly the
    shape *"436 records, kept since January 2024"* would have taken, the failure
    the whole boundary was built against. It caught its own author on the day it
    was written: twelve rows citing `InfoBooth.jsx` as the thing `InfoBooth.jsx`
    restates were rejected. A class that rejects its author's own rows on the
    first run is doing work.

14. **THE OPEN-ACTION REGISTER IS MAINTAINED BY EVERY ROUND (Mike,
    2026-08-04 — STANDING).**

    **`docs/OPEN_ACTIONS.md` is the ONE place Mike looks for what is open**, and
    every round updates it in the commit it seals. A round that closes an item
    flips its status; a round that exposes one adds a row. Rows carry: what it
    is in one line · where it came from · status (OPEN / IN PROGRESS /
    RULED-AWAITING-BUILD / DONE) · owner (Mike / Ops / Code) · the date raised.

    **The failure it exists to end:** findings were being reported honestly and
    then buried. Every round since v40 has written a *"what this exposes"* or
    *"carry-forward"* section, faithfully, into a round log nobody re-opens —
    and the operator's own words for the state of it were *"Mike has no way to
    see what is already reported."* Reporting is not the same as recording. The
    round log stays the narrative; **the register is the ledger.**

    It is not a priority order and it does not say what to do next. Everything
    in it is open; sequencing is Mike's.

15. **THE RECORD APPROVAL GATE (Mike, 2026-08-04 — STANDING).**

    **Final sign-off on a Record is Mike personally inspecting EVERY thing
    presented in it. Ops ensures nothing escapes that inspection.**

    Wired to `provenance/asset-table.json`'s `verdict` field, which is **unset
    by default and is never written by Ops**:

    - `npm run assets:checklist -- --room <slug>` prints the inspection — every
      presented asset, what it is, its dimensions, Ops' quality read, and which
      file shows it.
    - `npm run assets:gate -- --room <slug>` exits 1 while any presented asset
      lacks a `pass`. A scope that matches nothing also fails, because a gate
      that matched nothing has not passed.

    **IT IS NOT A PACKET GATE AND MUST NOT BECOME ONE.** lint, build and
    `provenance:gate` run on every commit because they check things Ops can fix.
    This one checks whether MIKE HAS LOOKED, and putting it in the packet would
    block every commit on an inspection nobody has been asked for — the exact
    opposite of Mike's own condition, that **he must not have to perfect assets
    in advance.** Slots move, things change, some assets are never needed. The
    gate is run against one Record when that Record is being signed off.

    **What it cannot do:** it records that a verdict was given, not that the
    inspection was careful. And `provenance/assets.json` is keyed on the PATH,
    so an approved picture can be replaced under its own verdict and nothing
    fails. Both holes are stated in `provenance/README.md` §4.

16. **THE LAW OF SUBTRACTION (Mike, 2026-08-04 — STANDING, site-wide).**

    > **If it does not help, it hurts. If it does not need to be there, it needs
    > to not be there.**

    Given while striking the `/robots` tally card, with his reason attached:
    *"it speaks out loud about something not meant to be spoken out loud and
    dilutes the experience."*

    **IT IS NOT DOCTRINE 11 RESTATED, and the case that produced it is the
    proof.** Doctrine 11 tests a line's SUBJECT — does it describe the making of
    the museum rather than the collection. "Thirty-one and a half" is a fact
    about the collection. It passed the visible-line test on every reading, it
    was true, it was the wing's best line, and setting it at 132pt still made the
    loudest object on the front desk out of the one number whose entire value is
    that it is never explained. **Nothing was wrong with it except that it did
    not need to be there.** Doctrine 11 could not have caught it; this one is
    written so the next one gets caught.

    **The test is necessity, and the burden sits on KEEPING.** Ask of any object,
    control, count, caption, badge or line: what is lost if it goes? If the
    answer is "nothing a reader would miss", it goes. A thing that is merely
    harmless is not passing — harmless costs attention, and attention is the only
    currency a free museum takes.

    **Where it lands hardest:** a device built to show the operator a choice
    (see §5's routing row — three query-parameter variants have now been
    retired), a second object saying what the first already said, and any
    typographic set-piece whose size is doing work its content cannot carry.

    **Its neighbours.** Doctrine 11's corollary is *empty and honest beats
    populated and false*; this is the harder version — **empty beats
    unnecessary, even when the unnecessary thing is true.** Where 11 and 12 say
    do not INVENT, this says do not KEEP.

    **What it does not license.** It is a reason to delete, never a reason to
    delete QUIETLY. Everything struck under it is named in the round log and,
    if it leaves a gap, given a row in `docs/OPEN_ACTIONS.md` — the FAQ face lost
    its only picture to this law on the day it was written, and that is register
    M29 rather than a silence.

    Mirrored in `STATE.md` as THE LAW OF SUBTRACTION.

17. **ONE PASSAGE, ONE DECLARATION (Mike, 2026-08-06 — STANDING, site-wide).**

    > **If the same passage is in two rooms, one of them is the source and the
    > other one references it.**

    Given as the first and most structural of the CLEAR THE DECK instructions,
    with his reason attached: *"the same content exists in multiple rooms with no
    link between the copies, so fixing one never fixes the other and neither Mike
    nor Ops can tell from a screenshot which copy he is looking at. He edited the
    contact answer once and it survived elsewhere; that is the defect, not his
    memory."*

    **THE LAST SENTENCE IS THE DOCTRINE.** A duplicated passage does not fail on
    the day it is written — both copies are true then. It fails on the day
    somebody edits one, and the failure lands on the person who edited it, as a
    doubt about whether they remembered to. **The defect is not the drift; it is
    that the tree gives an editor no way to tell.**

    **WHAT COUNTS.** A sentence about the HOUSE that more than one room has to
    say — the keeper, the address, the standing terms — and any content one
    surface derives from another (a catalogue, a count, a menu). What does NOT
    count: a room's account of itself, an artist's own material, and repeated
    source citations, which are one citation per fact rather than one passage in
    many places.

    **HOW.** An import, not a copy. `src/data/house-copy.js` for cross-room
    passages; a module constant for twins inside one file;
    **derivation where the second copy is a mirror of data** — that is the
    stronger form, because it deletes the copy instead of linking it.

    **TWO CONSTRAINTS THAT ARE NOT OPTIONAL.**
    - **The hoisted string stays a plain literal.** `provenance:gate` sweeps for
      string literals, so a hoist keeps the passage inside the boundary and
      collapses N register rows into one. A passage assembled by interpolation
      falls OFF the boundary in silence, which is a worse defect than the
      duplication it was curing.
    - **Where two copies have DIVERGED, they are REPORTED and not merged.**
      Choosing between two live wordings is a decision about what the museum
      says, and that is Mike's. Four such pairs were found on the day the
      doctrine was given and all four are register rows.

    Paid for by a hand-typed mirror of Hunter Root's whole catalogue at
    `/hr/archive`, which survived six museum-wide figure sweeps — two whole
    records missing, four songs filed under the wrong record, every figure on the
    page a count of the mirror — because a sweep looks for FIGURES and this was a
    second COPY. It was deleted rather than corrected: **a corrected mirror is a
    mirror that will drift again.**


## 8. Known hazards (environment quirks)

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
- **`wrangler dev` holds `dist/weird_baby/.wrangler` open**, so `npm run build` fails with `EPERM … dist\weird_baby\.wrangler` while it is running. Stop the dev server (and any leftover `workerd` processes) before rebuilding. It also **caches its asset manifest at startup**, so a file added or removed under `dist/client` mid-run is not seen until it restarts — which is what makes an honest break-it-on-purpose test need a restart to be real.
- `export-artifacts.mjs` prints a harmless `UV_HANDLE_CLOSING` assertion
  AFTER finishing — ignore.
- Drive root contains loose stale code copies from past sessions — stale
  by default (§3 staleness rule).

## 9. Session-close ritual

0. **Gates, in this order:** `npm run lint` (baseline **11 errors / 9
   warnings**, zero new) → `npm run build` (green) → **`npm run
   provenance:gate` (exit 0)** → **`npm run reveal:check` (exit 0) if the
   ledger changed** → **[v56] `npm run parity:gate` (exit 0) if either machine
   album changed** → the lap. A packet that added visitor-facing
   content adds its register rows in the same commit; a packet that added or
   changed a media file re-runs `npm run assets:scan` in the same commit.

   **[v56/R7] AND THEN READ `npm run surfacing`, which is NOT a gate.** It
   cannot fail — an unshown thing is inventory, not a defect. It is here because
   **the packet is the only clock this repository has**, and the number it prints
   is the one Mike asked for a mechanism to be able to say: *what has this wing
   built and never shown anybody.* The proposed cadence is ONE SURFACING PER
   PACKET, and **the shelf must not grow two packets running** — one round of
   building ahead is stock, two is a habit. A round that moves it runs
   `npm run surfacing -- --log` so the next round's number means something.

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
1. Commit + push everything durable (explicit paths).
1a. **Update `docs/OPEN_ACTIONS.md`** (Doctrine 14) — statuses flipped for what
   closed, rows added for what this round exposed. Same commit.
2. If facts in THIS FILE or STATE.md changed (file map, hazards,
   protocols, closed decisions) — update them in the same session, same
   commit discipline. An orientation doc more than a few days behind
   git log is a defect.
3. Write/refresh `docs/HANDOFF_next_session.md` only for session-scoped
   context (what's mid-flight, open UX questions). Process and facts do
   NOT go in handoffs — they go here or in STATE.md.
4. Optionally drop refreshed OPERATIONS.md + STATE.md into
   `G:\My Drive\_conduit\` (with stamps) so chat sessions can self-orient
   without a paste.


## Delivery & Commit Gates (RCCA 2026-07-06 — stranded-Downloads incident)

Root cause: delivery and commit steps completing silently, unverified. Proven
losses: MV_VOCAB_MIGRATION_BRIEF-20260624 (stranded in Downloads 12 days),
MV_VOCAB_RECONCILE_PLAN-20260624 (believed committed 6/24; was untracked until
2026-07-06), weird_baby_combined.docx (stranded 75 days).

1. LANDING GATE — a chat deliverable does not exist until it is at its target
   path in the tree. Downloads is transit, never storage. Prefer heredoc
   direct-write to target path over browser download. Any file that does
   transit Downloads is copied to the tree and committed in the same session.
2. COMMIT GATE — no commit is "done" until `git status --short` is re-run and
   the new hash is confirmed in `git log`. Narrating a commit is not a commit.
3. SESSION-CLOSE CHECK — before any session ends: `git status --short` is
   empty, or every remaining line is explained and accepted.
4. DB dumps (`backups/`) are gitignored by policy. Durable home: OneDrive
   mirror, not git history.
