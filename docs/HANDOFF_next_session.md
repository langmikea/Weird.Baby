# HANDOFF — for the next Code session

Written 2026-08-17 at the close of MIKE'S LIVE-SITE WALKTHROUGH.
Session-scoped context only; process and standing facts live in
`docs/canonical/OPERATIONS.md` and `CLAUDE.md`, not here.

**Read the round log first: `docs/MUSEUM_WALKTHROUGH_LOG-20260817.md`.** Its
first six sections are written specifically for you and are the things a round
that skips them gets wrong. The previous day's log,
`docs/MUSEUM_REMOTE_CONTROL_LOG-20260816.md`, is still current for everything it
describes.

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
HEAD            df33eca   "Booth standard, foundation rewrite, donate passage,
                           about the artist, record fixes"
origin/main     df33eca   NOTHING IS UNPUSHED
```

**`df33eca` IS THE 2026-08-16 WORK AND HE SHIPPED IT MID-WAY THROUGH THE
WALKTHROUGH** — the whole REMOTE-CONTROL round plus the LAUNCH round, committed
and pushed by him while this session was running. **This handoff first said HEAD
was `70fb390`, which was true when the day started and false by the time it was
written; corrected on measurement rather than left to be discovered.**

**WHAT IS UNCOMMITTED IS THE WALKTHROUGH ALONE** — 13 modified files and this
round's log, listed in §7. **MIKE COMMITS, PUSHES AND DEPLOYS. Code never
does.** If the tree is clean when you read this, he did it.

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

```
 M docs/HANDOFF_next_session.md          M src/data/artists/worth-a-listen.js
 M docs/OPEN_ACTIONS.md                  M src/data/house-copy.js
 M docs/OPEN_ACTIONS_CLOSED.md           M src/routes/InfoBooth.jsx
 M provenance/register.json              M src/routes/exhibit/Exhibit.css
 M reveal/ledger-declare.mjs             M src/routes/exhibit/Exhibit.jsx
 M reveal/ledger.json
 M src/data/artists/foundation.js
 M src/data/artists/weird-baby.js
?? docs/MUSEUM_WALKTHROUGH_LOG-20260817.md
```

**13 modified, 1 untracked** (the log needs `git add`), **880 insertions /
1200 deletions** — a net reduction, which is what a walkthrough that struck two
constants, three decks, four pull-quote cards and two register rows should look
like.
