# HANDOFF — for the next Code session

Written 2026-08-16 at the close of the LAUNCH ROUND. Session-scoped context only;
process and standing facts live in `docs/canonical/OPERATIONS.md` and `CLAUDE.md`.

**Read the round log first: `docs/MUSEUM_REMOTE_CONTROL_LOG-20260816.md`.** It
runs §1–§6 and covers this whole day.

---

## 0 — THE STATE MIKE LEFT IT IN

Everything below was handed over **uncommitted, for him to commit, push and
deploy in one go, and then walk the LIVE site and approve there.** If the tree is
clean when you read this, he did it.

**FOUR THINGS THIS DAY ESTABLISHED THAT BIND LATER WORK:**

1. **THE DONATE DOOR IS THE ONLY OUTBOUND LINK TO GIVING IN THE MUSEUM** —
   inline in one sentence of one `/foundation` FAQ answer. His ruling: *"DO NOT
   introduce a general external-link affordance. This is one link in one answer,
   not a new pattern."* `inlineDoor` in `Exhibit.jsx` and the `.vp-faq-inline-link`
   class exist for that one anchor. Ledger row `door.coalition`.
2. **A HIDING RULING IS NOT DONE UNTIL A LEDGER ROW MOVES** — his words, and it
   caught two doors that had shipped with no ledger row at all
   (`shop.friends`, `door.coalition`). Ledger 166 → 168.
3. **THE THREE FAMOUS RECORD 001 TYPOS ARE GONE** and `robots-record.js`'s own
   preamble was still telling rounds not to tidy them. Corrected in place, with
   the measurement. A list of examples that outlives its examples is a tripwire
   pointing at empty ground.
4. **THE /booth STANDARD** — one face, hierarchy in weight and size, answer
   indented under its question, `white-space: pre-line` everywhere a writer's
   newline should draw. `sheet.css` and `.vp-faq-*` both carry it.

---

## 1 — WHERE THE TREE IS

```
HEAD            70fb390   "WAL directory, gift shop friend tiles, museum FAQ,
                           nocookie embeds, self-hosted fonts, lobby countdown"
origin/main     70fb390   NOTHING IS UNPUSHED
```

**UNCOMMITTED, and all of it is this session's:**

```
 M docs/HANDOFF_next_session.md          M src/data/wb_roster.js
 M docs/MUSEUM_SITE_CHANGES_LOG-…        M src/routes/InfoBooth.jsx
 M docs/OPEN_ACTIONS.md                  M src/routes/exhibit/Exhibit.css
 M docs/OPEN_ACTIONS_CLOSED.md           M src/routes/exhibit/Exhibit.jsx
 M docs/dictation-20260807/record-draft   M src/routes/shop/GiftShop.css
 M provenance/register.json              M src/routes/shop/GiftShop.jsx
 M reveal/record-entries.mjs             M src/styles/sheet.css
 M src/data/artists/foundation.js        M tools/dictation/emit-record-entries.mjs
 M src/data/artists/robots-record.js     M tools/dictation/workbook_to_draft.py
 M src/data/artists/weird-baby.js
?? docs/MUSEUM_REMOTE_CONTROL_LOG-20260816.md
```

**Two of those are the 2026-08-16 morning session's and were already uncommitted
when this round started:** `docs/MUSEUM_SITE_CHANGES_LOG-20260815.md` and the
bulk of `provenance/register.json`. Everything else is this round's.

**MIKE COMMITS AND DEPLOYS. Code never pushes and never deploys.** Note that
`70fb390` was committed AND deployed by him at 00:33 — the live site runs it, so
the countdown, the FAQ rewrite with `Papa@Weird.Baby`, nocookie embeds and
self-hosted fonts are all live on weird.baby.

---

## 2 — WHAT THIS SESSION DID THAT IS STILL UNCOMMITTED

**RECORDS 001–005 ARE MIKE'S WEEK-1 WRITING, LANDED FROM HIS OWN WORKBOOK.**
Source `NEW_RECORD_MAKER_V3.xlsx` (sha256 `2D59586B…`). Round-trip verified
**56 fields, 0 mismatches**. His marker prefixes (`>` `?` `!` `<`) are carried
verbatim — **they are undefined by his ruling and must never be stripped,
interpreted or rendered differently.**

**THE READER SPEAKS TWO SHEET SHAPES NOW** (`tools/dictation/workbook_to_draft.py`):
the generated `Day N - Record 00N` and Mike's hand-built `REC W.D`. Neither is a
fallback for the other — the two name patterns cannot both match a tab. Four
guards on the new shape, each proved by breaking it (header shift, tab/row-1
disagreement, wrong date, headline emptied). **Column C is his private notes and
cannot reach an entry**: the REC path's only cell accessor hard-codes column 2,
and 13 column-C strings were measured absent from the output.

**TWO COMMENT BLOCKS MOVED INTO THE PREAMBLE** (Records 001 and 003).
`record:land --write` refuses to regenerate an entry carrying comments; the
preamble is the part a landing preserves. Nothing was edited — if you land again
and it refuses on a new entry, do the same thing.

---

## 3 — THE ATTACHMENT MECHANISM: BUILT, MOUNTED, ZERO CODE NEEDED

**The earlier Ops call that "nothing declares attachments" was true of the DATA
and false of the CODE.** Do not re-scope this from scratch.

- `src/routes/exhibit/RecordAttachments.jsx` — the renderer (A1/A2 2026-08-08).
- `attachmentsOf()` in `src/lib/record-model.js` — flattens the field kinds.
- `RecordEntry.jsx:633` — **already mounts it** at the foot of every opened entry.

**THREE FIELD KINDS ALREADY EXIST:**

| field | is | shape |
|---|---|---|
| `wire` | a transmission | `["line", "line", …]` — text, no image |
| `plates` | photographs | `[{img, label, date}]` |
| `docs` | documents | `[{title, source, date, pages, scan, plates, extract, note}]` |

**A `docs` ENTRY WITH NO IMAGE IS A DESIGNED STATE**, not a gap: no `scan` and
no `plates` gives a glyph and the row prints *not here yet*. A plate can be
listed before it has been photographed and gain its image later **with no change
to the entry's shape**.

**No entry declares any of the three today** (`grep -c "wire:\|plates:\|docs:"`
→ 0).

**held/ AND THE LAUNCH BUNDLE NEED NO DESIGN.** `ASSET_LIKE` in
`reveal/record-entries.mjs` treats any rooted file-path string in an entry as
that entry's asset, generically. `reveal:day --place` moves it out of
`public/held/` on the entry's day, and `delivery.mjs` fails the build in both
directions. The 144 held files are held **because no entry delivers them**.

---

## 4 — TWO RULINGS. DO NOT BUILD EITHER.

1. **NO EXTERNAL LINK AFFORDANCE ON THE RECORD.** It would be the first outbound
   door and collides with his no-envelope-furniture ruling. `RecordAttachments`
   has no `<a>`, no `href`, no `url`, and must not gain one. Use a `docs` entry
   with no image; the *not here yet* state is already designed.
2. **NO MEDIAVAULT ID RESOLVER.** Not needed. **Paths for now.** `MV-YYYYMMDD-NNN`
   connects to nothing in the Record chain and an id→path resolver is a build
   nobody has asked for yet.

---

## 5 — WEDNESDAY 19 AUGUST NEEDS `docs` ENTRIES ON RECORD 003

Record 003 lands Wednesday and its story releases **manual plates**. Attachments
are **not** post-launch — he releases artifacts during week one.

**The smallest thing that works, and it is zero code:**

1. Add `docs: [...]` to Record 003's entry — one object per plate (`title`,
   `source`, `date`, and `scan` only where a photograph exists).
2. For any image: put it under `public/held/robots/…`, add its
   `provenance/assets.json` row, run `npm run assets:scan`.
3. On the 19th: `npm run reveal:day -- --place`, the standing gates, then Mike
   deploys.

**Plates with no photograph skip step 2 entirely.**

**ONE THING TO KNOW BEFORE YOU WRITE THEM:** his workbook has an **ATTACHMENTS
section** — a bold label in column B — which lands as an ordinary text section
with `> n/a` under it. That is NOT the attachment mechanism. Add `docs` and the
entry will draw **both** his text section headed ATTACHMENTS and the real
Attachments block beneath the writing. **Raise that with him before landing
Wednesday**; the likely answer is that his ATTACHMENTS section becomes the
`docs` field rather than sitting beside it, but that is his call, not Ops'.

His two artwork notes for 003 are in **column C** of REC 1.3 rows 35–36 —
*{manual pages referencing The CEO and The Informer}* and *{raw data examples.
Mix in eggs}* — moved there this session so they never ship and never trip the
brace guard.

---

## 6 — OPEN, WAITING ON MIKE

| row | what |
|---|---|
| `W-a` | `/wb`'s About the Artist copy — his words |
| `W-b` | `How to contact?` on `/wb` — superseded in the booth, still open there |
| `F-a` | the booth's new FAQ wording vs `/wal`'s `AFFILIATION`/`USE_RIGHTS` and `/wb`'s `KEEPER` — **leave those three alone**, reconciling is his writing |
| `PZ-a` | the Portal switch puzzle has no working mechanism — **Mike + Ops together**, not needed before the doors open |

---

## 7 — THE PREVIEW

```
npm run preview            →  http://127.0.0.1:8787/robots/record
```

That is `npm run build && wrangler dev`. **The development build is what shows
every Record with no key** — the live site is a LAUNCH build and `RECORD_KEY` is
not configured on it (`GET /api/record` → `configured:false`), so the admin
preview door does not work against production.

**Verified on the glass this session:** all five index rows carry a headline and
a deck, **zero bare rows, every row exactly 94px** — R3's same-height rule
satisfied, which the old 84px/157px pair never was. 004 and 005 open with four
sections each and no empty bodies.

---

## 8 — BACKUPS THIS SESSION LEFT IN `C:\AI\_week01\`

```
_backup_robots-record_before-land-20260816.js      before the morning landing
_backup_robots-record_before-v3-land.js           before the V3 landing
_backup_NEW_RECORD_MAKER_V3_before-edit-20260816.xlsx
_backup_workbook_to_draft_before-v3.py
_backup_register_before-land.json
```

**Gates at close:** lint **9 / 8 = baseline** · build green · provenance
**PASS** (37 MIKE rows added, 25 stale pruned) · `reveal:check` **PASS** ·
`parity` **PASS** · `instory` **PASS** · `docs:numbers` **PASS**.
