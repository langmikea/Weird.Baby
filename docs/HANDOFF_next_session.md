# HANDOFF — for the next Code session

Rewritten 2026-08-17 at the close of COPY + THE RECORD LAYOUT. Everything below
§0b is from MIKE'S LIVE-SITE WALKTHROUGH earlier the same day and still stands.
Session-scoped context only; process and standing facts live in
`docs/canonical/OPERATIONS.md` and `CLAUDE.md`, not here.

**READ `docs/MUSEUM_RULINGS-20260817.md` BEFORE YOU RE-OPEN ANYTHING.** Seven of
Mike's decisions of this day in one place:

1. **The Record layout is variant `b`** — a and a+b rejected after a rendered
   comparison, and deleted rather than left dormant.
2. **Hashtags are NO on museum pages.** They belong in social posts. It is a
   ruling about a SURFACE, not about hashtags.
3. **SEO deferred to ~30 Records, and the split is the point** — the robots
   fiction will not rank and chasing it is wasted; but *Papa Weird.Baby*, *the
   Weird.Baby Foundation* and *the album* should own their own names.
4. **The spam note struck in all three places** (and a fourth that was dormant —
   *dormant is not gone*), with `findmikeymike.com` kept in the ledger comment
   only.
5. **The four artifact photographs are museum-owned, class `MIKE`** — no gift
   shop, and no Ops-written captions.
6. **The link-preview copy**, now on all three description tags.
7. **`/share-card.png` is the share image and the file is not to be altered** —
   a flag against its lettering is recorded and is Mike's to redraw.

**HIS CAPTIONS ARRIVED AND ARE ON THE TILES** (his words, verbatim), which is
the one thing in that list that moved after it was written: rule 5 says Ops
writes none, and these are his.

A ruling is not an open action, so none of them is in the register; where one
left a remainder, the remainder is linked from that file.

**Then `docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md`, then
`docs/MUSEUM_WALKTHROUGH_LOG-20260817.md`.** The walkthrough log's first six
sections are still the things a round that skips them gets wrong. The previous
day's log, `docs/MUSEUM_REMOTE_CONTROL_LOG-20260816.md`, is still current for
everything it describes.

---

## 0b — THE COPY ROUND, 2026-08-17 (LATER THE SAME DAY)

**BATCH 1 IS DONE AND MIKE COMMITTED IT MID-SESSION AS `0ee5d40`.** Nine copy
changes across `robots.js`, `weird-baby.js`, `house-copy.js`, `foundation.js`,
`worth-a-listen.js` and `MuseumBar.css`, plus 14 pruned / 11 added register rows.
All gates green, every changed page loaded on the built bundle.

**THIS IS THE THIRD TIME IN TWO DAYS THAT A HANDOFF SENTENCE ABOUT THE TREE WENT
FALSE WHILE IT WAS BEING WRITTEN** — it said "uncommitted", and it was true when
typed. §1's own warning is the standing answer and it is not a joke: **run
`git log --oneline -3` and `git status --short` before trusting any line here.**

**BATCH 2 IS RULED AND SHIPPED — MIKE CHOSE `b`.** The report is indented onto
the headline's vertical by one declaration in `Exhibit.css` reading
`--rec-textcol`, the token the headline's own grid already reads, so the two
cannot drift. Out by **0** at 1280, 390 and 1920. `a` and `a+b` are **deleted**
from `variants.css`; `docs/record-layout-variants/` is **kept as the record of
the comparison** and nothing in it is loaded by the museum. Row `Q-g` closed and
left the register (Doctrine 24); its reasoning is in `OPEN_ACTIONS_CLOSED.md`.

**A SECOND PACKET RAN THE SAME DAY AND EVERYTHING IN IT IS ALSO UNCOMMITTED** —
the spam note's two remaining statements plus **a third the sweep found**
(`aboutNote`'s last sentence, dormant, struck on his ruling that *dormant is not
gone*); the `Born` label stutter cut on an **Ops** ruling he can revert with one
word; and **four of his own photographs placed on the About-the-Artist tiles**,
the first museum-owned object photographs on an artist card. §0c below is what
that packet leaves for you.

**FOUR THINGS FROM THE FIRST ROUND THAT WILL BITE THE NEXT ONE:**

1. **`resize_window` DOES NOTHING ON THIS HOST.** `innerHeight` stayed 810
   whatever was asked for, so a sticky band can never be scrolled to its pinned
   position by shrinking the window. Measure inside a **same-origin iframe on
   the museum's own origin**, sized until `documentElement.clientWidth` IS the
   target — the same correction `tools/lap/harness.html` makes, for the same
   reason, and it needs nothing copied into `public/`.
2. **THE HIT PROBE HAS TWO WAYS TO LIE AND BOTH WERE HIT.** `hit.contains(control)`
   makes every point pass (any ancestor contains the control), and sampling the
   PLATE's box answers a different question from sampling the CONTROL's box. The
   test is `hit === control || control.contains(hit)`, across the **control's**
   whole box, and nothing else.
3. **A CUSTOM PROPERTY IS RESOLVED ON THE ELEMENT THAT DECLARES IT.**
   `--rec-textcol` is `calc(var(--rec-rail) + 18px)` on `.vp-face`, so
   redefining `--rec-rail` further down the tree does not change it. This cost
   one wrong render and is written up in the variants file.
4. **THE EXTENSION REFUSES `file://`.** To look at a page under `docs/`, copy it
   into `dist/client/` (gitignored, wiped by the next build), restart wrangler,
   and **delete the copy afterwards** — `lap:clean`'s habit applied to a
   different folder.

**AND ONE MECHANISM JOINS §3's LIST:** `siteNote` in `worth-a-listen.js` has no
declarer left — Mike struck the one that existed. Its builder line survives.

---

## 0c — THE SECOND PACKET, 2026-08-17 (SAME DAY)

**THREE THINGS IT LEAVES BEHIND, IN THE ORDER THEY WILL MATTER.**

1. **THE FOUR PHOTOGRAPHS ARE THE FIRST MUSEUM-OWNED OBJECT PICTURES ON AN
   ARTIST CARD, AND THE PATTERN THAT CARRIES THEM ALREADY EXISTED.** The `c`
   field in `provenance/assets.json` is the line between the house's and the
   artists': `/images/wal/*` are **VERIFIED** against a citation because they
   are theirs; these four and the robots reference photographs are **MIKE**, on
   the sentence *"the museum's own photographs of its own …"*. **No new class
   was invented and none is needed for the next one.** They live in
   `public/images/wb/` — not `held/`, which is the STAGE hold and is scoped to
   `GOVERNED_PREFIX` = `/robots/`.
2. **`profile` CARDS TAKE AN OPTIONAL `img` NOW** (`Exhibit.jsx` +
   `.vp-prof-plate` in `Exhibit.css`) — the `.vp-fe-plate` mechanism on the
   other card shape, same field name, same gate. **`profile` is declared by
   exactly one face in the museum**, so the blast radius is one card; a lap of
   /wal, /robots, /foundation and /booth counted 0 plates and 0 console errors.
   **The plate has NO `aspect-ratio` and that is deliberate** — read the CSS
   note before adding one; a 4/3 frame was tried first and would have cropped
   44% off the two portrait objects.
3. **THE SPAM NOTE IS GONE FROM ALL THREE PLACES AND ONE OF THEM WAS DORMANT.**
   Mike's ruling — *dormant is not gone* — is the part to carry: a string that
   is one restored render away from the glass is a string on the glass with a
   delay. `findmikeymike.com` and `injected spam` are **absent from the built
   bundle**; the `[R-a]` ledger comment saying why the door is shut is untouched
   and is where that record belongs.

**AND `assets:gate` EXITS 1 — IT ALWAYS HAS.** 0 of 39 presented assets carry
Mike's verdict, favicons and /wal covers included. It is not in the packet gate
list, for the reason `facts:gate` is not (Q-b). The four photographs join the 35
already waiting: register row **M22**.

---

## 0d — THE SHARE CARD, 2026-08-17

**THE LINK HAD NO PICTURE AND THE FILE WAS NEVER MISSING.** Measured on the LIVE
host, not read from source: `og:image` was served as **`/share-card.png`** — a
root-relative path. **Open Graph requires an absolute URL**, and Facebook,
iMessage and Slack drop a relative one rather than resolving it. Two characters.

Fixed in `index.html`: both image tags absolute, plus **`og:url`** (without it a
scraper keys its cache on whatever URL it was handed, so one site can cache twice
under two identities) and **`og:image:width` / `:height` / `:type`**, measured
from the file in the launch bundle so a platform can lay the card out before it
fetches the image.

**THE IMAGE IS RULED: `/share-card.png`, and the file is not to be altered.**
1200×630 exactly, 28 KB, **verified present in `dist/client` after
`npm run build:launch`**, so it is not one of the 144 held files. The options and
their real dimensions are in the round log.
**A FLAG IS RECORDED AGAINST IT AND IS NOT OPS' TO FIX:** the card's own
lettering reads *NO ADS · NO AFFILIATE LINKS · NO CUT*, the OLD description —
**the new copy invites and the picture argues.** Mike owns the artwork and will
redraw it. **Do not alter the image.**
**AND ALL THREE DESCRIPTION TAGS ARE ONE STRING NOW** — `og:`, `twitter:` and
the search-result `name="description"`, on his ruling. They share ONE register
row, because the provenance key is file+text; if that row ever splits into two,
the strings have drifted.

**FACEBOOK CACHES PREVIEWS HARD.** Mike is not posting for two days, so this
wants to be right before the first fetch. If it is ever wrong after a share, the
Sharing Debugger's *Scrape Again* is the only way to clear it.

---

## 0 — READ THESE SIX BEFORE TOUCHING ANYTHING

Each is a full section in the round log. This is the index, not the content.

1. **TWO REDUCTIONS, TAKEN KNOWINGLY — NEITHER IS A CLEANUP.** `SOURCES` is
   struck from all four /wal artists (**this reverses the 2026-08-11 ruling that
   put it there**), and `USE_RIGHTS` is deleted, so **the house no longer states
   what may be done with its own photographs**. Both are Mike's, both made after
   looking at the page. **Do not "restore" either as a tidy-up.** `aboutNote` is
   kept in the data; only the printing of it is struck. Row `S-m`, filed
   RECORDED rather than OPEN because it asks him nothing.
2. **THE QUOTE RULE HE DREW:** *a quote a visitor cannot go and check is
   decoration.* **"From the museum's own vault" is the house citing itself,
   which is not a citation.**
3. **TWO COPYRIGHT LIMITS ARE NOW ENFORCED ON /wal**, and both had been
   breached: **one quote per source**, and **every quote under fifteen words.**
   Both are fixed. **Do not reintroduce either.** These are limits, not taste.
4. **`W-b` IS CLOSED AND THE REASON IS NOT THE ONE THE ROW GAVE.**
   `Papa@Weird.Baby` has been ruled since 15 August, purpose-placed in the booth
   FAQ. **/wb's FAQ track is held because its second question is empty, NOT
   because the address is struck. DO NOT UN-HIDE IT ON THE STRENGTH OF THE
   ADDRESS EXISTING.**
5. **TWO TRACKS ARE HELD UNCONDITIONALLY** — /foundation's **The Blog** and
   /wb's **FAQ**. **`HIDDEN_AT_LAUNCH` is the STAGE hold and is the wrong
   instrument for both:** a member of that set renders in DEVELOPMENT and
   vanishes at launch, and these are held from Mike too. Each wing has its own
   `HELD_TRACKS` set, filtered unconditionally; each track returns by taking one
   id out of one set, and the track objects are kept whole.
6. **THE TITLE-PLATE DEFECT.** `pointer-events` on a plate with **no click
   handler** was swallowing the scroll-to-top control. One property, the same
   shape as the P1 apron fix four hundred lines down the same file. Measured
   with `elementsFromPoint`, not guessed.

---

## 1 — WHERE THE TREE IS

```
HEAD            1b92276   "Walkthrough 08-17: booth standard across FAQs,
                           pull-quote sweep, fact grid, viewer fixes"
origin/main     1b92276   NOTHING IS UNPUSHED · WORKING TREE CLEAN
```

**EVERYTHING FROM 16 AND 17 AUGUST IS SHIPPED.** `df33eca` carried the
REMOTE-CONTROL and LAUNCH rounds; `1b92276` carries this walkthrough, its round
log included.

**THIS BLOCK HAS BEEN WRONG TWICE IN ONE DAY AND BOTH CORRECTIONS ARE LEFT
VISIBLE, BECAUSE THE PATTERN IS THE POINT AND NOT THE TYPO.** It first said
`70fb390` — true when the day started, false by the time it was written, because
Mike committed mid-session. It then said `df33eca` with thirteen files
uncommitted — true when measured, false within the minute, because he committed
again while the report was being written.

**A GIT STATE IS THE FASTEST-STALING NUMBER IN THIS REPOSITORY**, and a handoff
is the worst place to publish one: the file is read hours or days later, by
somebody with no way to tell which minute it describes. It is published anyway
because the alternative — not saying where the tree is — is worse. **So: run
`git log --oneline -3` and `git status --short` before you trust these five
lines.** They are a starting point, not a fact.

**MIKE COMMITS, PUSHES AND DEPLOYS. Code never does.**

---

## 2 — OPEN, WAITING ON MIKE

| row | what | what he must supply |
|---|---|---|
| `S-f` | The Short Story · The Long Story · The Blog are empty | his words. **Nothing in the repo to reuse** — the search is in the 08-16 log; the one near-miss is `C:\AI\VISION.md`, which is about the museum and not the giving |
| `S-g` | the Coalition gift-shop tile has no picture | a file, or his word to fetch theirs |
| `S-j` | 13 of the booth's 18 answer lines wrap at 390px | a decision — phone lines wrap, or the phone gets its own shorter lines. **Not a rewording he can win** |
| `S-l` | one double space in Record 001's deck | one word, or nothing |
| `S-n` | `Back in 94' — tee` and `Hat` have no home | the gift shop, or gone |
| `S-p` | Hunter Root's record list is 4 of 16 | the twelve with years and links, or nothing — **the Bandcamp door is already a complete answer** |
| `PZ-a` | the Portal switch puzzle has no mechanism | **Mike + Ops together**, not needed before the doors open |

---

## 3 — MECHANISMS BUILT AND CURRENTLY EXERCISED BY NOTHING

Stated so nobody reads their presence as use, and so nobody deletes them as dead
code:

| thing | where | why it is kept |
|---|---|---|
| `inlineDoor` · `.vp-faq-inline-link` · the `inline` field | `Exhibit.jsx`, `Exhibit.css`, `faq-face.js`, `foundation.js` | built for the donate answer, which Mike struck the next day saying it *"needs more work than I can afford today"* — not that it is wrong. **Zero callers.** Read the note above `inlineDoor` before adding a second. |
| `door.coalition` | `reveal/ledger-declare.mjs` | `NOT_BUILT / HELD`. **The museum currently publishes no route to giving**, deliberately, and the ledger says so out loud. |
| `wbFriendsHeld` | `wb_roster.js` | the Coalition gift-shop tile, held 08-16. Tree-shaken out of the bundle entirely. |
| `records.noteLink` | `Exhibit.jsx` | the Bandcamp door — three callers, all in `worth-a-listen.js`. Not dead; listed so it is not mistaken for a general link affordance. |
| `siteNote` → `lines: ["NOTE     " + …]` | `worth-a-listen.js` | Mikey Mike was its only declarer and Mike struck it on 2026-08-17 (*"Only the visitor-facing block goes"*). **Zero declarers.** The `[R-a]` ledger comment above it — why findmikeymike.com stays unlinked — is the record that survived and is untouched. |

---

## 4 — TWO PLACES OPS' OWN COMMENTS WERE WRONG AND WERE CORRECTED IN PLACE

Both are worth knowing because the same mistake is cheap to repeat:

- **`robots-record.js`'s preamble** was still instructing rounds not to tidy
  three Record 001 typos that his V3 workbook had already replaced. **A list of
  examples that outlives its examples is a tripwire pointing at empty ground.**
- **`weird-baby.js`'s note** claimed `tombstone` draws above `profile` in the
  renderer. It does not — it drew below, which put his biography under his
  achievements. **The page contradicted the comment inside a minute.** The
  renderer order was fixed instead: `profile` now draws below `tombstone`, which
  is safe because **`profile` is declared by exactly one face in the museum.**

---

## 5 — THE PREVIEW

```
npm run build && npx wrangler dev     ->  http://127.0.0.1:8787
```

**`wrangler dev` caches its asset manifest at startup** (§8 hazard): a rebuild
under a running server 404s the whole site with no error anywhere. Build first,
then start, then look. **Kill it before deploying.**

Routes touched this round and verified on the built bundle: `/foundation`,
`/wal`, `/wb`, `/booth`, `/shop`, `/robots/record`.

---

## 6 — BACKUPS IN `C:\AI\_week01\`

```
_backup_Exhibit_before-reorder-20260817.jsx
_backup_NEW_RECORD_MAKER_V3_before-coincident-20260816.xlsx
_backup_NEW_RECORD_MAKER_V3_before-colC-20260816.xlsx
_backup_robots-record_before-coincident-20260816.js
_backup_robots-record_before-colC-20260816.js
_backup_robots-record_before-attach-20260816.js
_backup_foundation_before-phase3-20260816.js
_backup_weird-baby_before-W-a-20260816.js
```

**Gates at close:** lint **9 / 8 = baseline** · build green · provenance
**PASS** · `reveal:check` **PASS** · `parity` **PASS** · `instory` **PASS** ·
`docs:numbers` **PASS** · `reveal:day` nothing to move.

**Closed 2026-08-17:** `F-a` · `S-e` · `S-i` · `S-o` · `W-b`.
**Opened:** `S-m` (a record) · `S-n` · `S-p`.

---

## 7 — THE WORKING TREE, AS THIS ROUND LEFT IT

**[2026-08-17] MIKE COMMITTED TWICE MID-SESSION. `0ee5d40` carries packet one
(the copy round); `7371d43` carries packet two (Record layout b, the spam note,
the Born stutter, the four photographs). Packet three — the share card — was
uncommitted when this line was typed:**

```
 M index.html                    the og:/twitter: block, absolute URLs, og:url, dimensions
 M provenance/register.json      3 pruned, 6 added
 M docs/HANDOFF_next_session.md  this file
 M docs/MUSEUM_COPY_AND_RECORD_LAYOUT_LOG-20260817.md
?? docs/MUSEUM_RULINGS-20260817.md
```

**THAT IS THREE HANDOFF SENTENCES ABOUT THE TREE IN ONE DAY THAT WENT FALSE
WHILE THEY WERE BEING WRITTEN.** §1's rule is the only reliable one: **run
`git log --oneline -3` and `git status --short` and believe those.** The
paragraph below about `1b92276` describes the walkthrough commit, not the tree.

**AT THE WALKTHROUGH'S CLOSE THE TREE WAS CLEAN.** All of it is in `1b92276`. What that commit contains,
recorded because the diff is the shape of the round rather than a file list:

```
13 files changed, 880 insertions(+), 1200 deletions(-)

docs/HANDOFF_next_session.md          src/data/artists/worth-a-listen.js
docs/OPEN_ACTIONS.md                  src/data/house-copy.js
docs/OPEN_ACTIONS_CLOSED.md           src/routes/InfoBooth.jsx
docs/MUSEUM_WALKTHROUGH_LOG-20260817.md (new)
provenance/register.json              src/routes/exhibit/Exhibit.css
reveal/ledger-declare.mjs             src/routes/exhibit/Exhibit.jsx
reveal/ledger.json
src/data/artists/foundation.js
src/data/artists/weird-baby.js
```

**A NET REDUCTION OF 320 LINES**, which is what a walkthrough that struck two
constants, three decks, five pull-quote cards, two questions and two register
rows should look like. **A round whose diff grows while its instruction is a
list of KILLs has misread the instruction.**

**ONE LINE OF THIS COMMIT IS ALREADY KNOWN TO BE WRONG:** §1 and §7 above were
committed inside it naming `df33eca` and an uncommitted tree, and were corrected
afterwards. If `git status` is dirty when you read this, that correction is what
it is.
