# 2c — THE /wal BACKLOG, SCOPED

**Read-only. Nothing was built and nothing was written.**
Three changes Mike has ruled; what each one touches.

Route: `src/App.jsx:145` → `src/routes/wal/Wal.jsx` → `Exhibit.jsx` over
`worthAListenExhibit` (`src/data/artists/worth-a-listen.js`, 1,966 lines).

---

## FIRST — WHICH LINE IS WHICH, BECAUSE BOTH RULINGS LAND ON ONE FIELD

There is exactly one role-and-place string per artist, the `what` field:

| line | string | class |
|---|---|---|
| `worth-a-listen.js:1687` | `Songwriter · Philadelphia` | RESTATED |
| `:1698` | `Songwriter · Arkansas` | RESTATED |
| `:1705` | `Songwriter and producer · Los Angeles` | RESTATED |
| `:1779` | `Songwriter · Lancaster, Pennsylvania` | VERIFIED |

`what` renders **twice**, from the same value, in two different places on the
poster (`Exhibit.jsx`):

- **`:4165-4168` — the LINEUP.** `.vp-bill-row` → `.vp-bill-lineup`, four cells
  across the top: `name` then `what`. Nothing else.
- **`:4185-4191` — the CARDS BELOW.** `.vp-bill-acts` → `.vp-bill-act`: picture,
  `name`, `what`, `why`, and Mike's `pick`.

So **ruling 1 ("kill the subtitle line under each artist's name … the cards below
are untouched") is the LINEUP copy**, and **ruling 2 ("the location line becomes
two authored lines") is the CARD copy** — the same field, two render sites, and
his "the cards below are untouched" is what separates them. This reading is the
one the markup supports; see WHAT NEEDS MIKE if it is wrong, because the two
rulings are mutually exclusive on any single site.

---

## RULING 1 — KILL THE SUBTITLE UNDER THE NAME IN THE LINEUP

**One JSX conditional and one CSS line. No data changes. No register changes.**

| file | line | change |
|---|---|---|
| `src/routes/exhibit/Exhibit.jsx` | 4166-4168 | delete the `{act.what && (<span className="vp-bill-what">{act.what}</span>)}` block from `.vp-bill-lineup` |
| `src/routes/exhibit/Exhibit.css` | 2947 | `.vp-bill-lineup .vp-bill-what{padding:0 12px}` becomes dead — struck |

**Nothing else moves.** `.vp-bill-lineup` is `display:flex;flex-direction:column;
gap:5px` (`:2936-2941`) with `padding:0 0 11px`, so removing the second child
leaves the name and the bottom padding; the `gap` simply stops applying. The
card's own `what` is a different element under a different parent selector
(`.vp-bill-act .vp-bill-what`, `:2981`) and is untouched.

**No provenance work.** The four strings still render — on the cards — so their
register rows stay valid. Removing a *duplicate* render site does not change any
string.

**Scope: 1 file for the render, 1 for the CSS, ~5 lines.** This is the small one.

---

## RULING 2 — THE LOCATION LINE BECOMES TWO AUTHORED LINES, ALWAYS

This is the larger one and it has a trap in it.

### What it touches

| file | what |
|---|---|
| `worth-a-listen.js:1687, 1698, 1705, 1779` | the four `what` strings, re-authored as two lines each |
| `Exhibit.jsx:4185-4188` | the card's `what` render — one span becomes two |
| `Exhibit.jsx:4166-4168` | the lineup's — **unless ruling 1 has already deleted it**; do ruling 1 first and this site disappears |
| `Exhibit.css:3033-3035` | `.vp-bill-what` — needs a `line-height` and per-line display once it is two lines rather than one |
| `Exhibit.css:2981` | `.vp-bill-act .vp-bill-what` padding — unchanged, but verify with two lines |
| `provenance/register.json` | **four rows**, see below |

### THE TRAP: `scrubFace` will silently drop an array

`Exhibit.jsx:265` runs every act's `what` through the ops-note scrubber:

```js
const what = visitorProse(a.what);
…
return { ...a, what: kept(what) ? what : null, … };
```

`visitorProse` / `kept` operate on a **string**. If `what` becomes
`["Songwriter", "Lancaster, Pennsylvania"]`, this path is the first thing it
meets, and it runs in **both stages** — so the failure would not be caught by a
development lap. Whatever shape is chosen, `scrubFace` has to learn it in the
same edit.

**The lower-risk shape is two sibling string fields, not an array** — e.g.
`what` and `where` — because each stays a string, each keeps its own register row
and its own class (three of the four are RESTATED and one is VERIFIED against
Hunter's Bandcamp bio; they do **not** all have the same provenance and should not
be merged into one value), and `scrubFace` gains one more line of the same shape
it already has rather than a new type.

### The register rows

The four strings all carry rows. Editing any string **stales its row** and needs
a new one in the same commit:

| row | line recorded | class | source |
|---|---|---|---|
| `e90fc03a0e36599d` | 1486 | RESTATED | resolves to `5f289439733cec5a` |
| `900319dddf18cb60` | 1496 | RESTATED | resolves to `5f10630b36f9385c` |
| `b84248967edc0f2d` | 1502 | RESTATED | resolves to `44dfcac442f23961` |
| `a0ac04a4d6d6234b` | 1765 | **VERIFIED** | `hunterrootmusic.bandcamp.com` — his own artist bio, read 2026-08-06 (R7): *"Solo artist/musician from Lancaster, PA"* |

**The three RESTATED rows carry `r:` chains and cannot be pruned bare** — the
standing law. Splitting one string into two means deciding which of the two
inherits the chain (the place half, in every case) and what the other is classed
as (`HOUSE` — "Songwriter" is the house's own word for the role, not a quotation).

Note the recorded `l:` values are stale already (the strings are at 1687/1698/
1705/1779). The sweep matches on file+text, so the gate passes regardless; worth
knowing so nobody "fixes" a line number and thinks they have done something.

### Why the wrap is worth fixing, and what I did not measure

`.vp-bill-what` is `--fs-micro`, `letter-spacing:.16em`, `text-transform:
uppercase`, Courier (`Exhibit.css:3033-3035`). `.vp-bill-row` is four columns
above 820px and **two columns below** (`:2931-2935`), so on a phone each lineup
cell is about half the screen. `SONGWRITER · LANCASTER, PENNSYLVANIA` is 36
characters of tracked uppercase mono in that cell — it cannot fit on one line,
and the only break opportunities are the spaces, one of which is inside
*"Lancaster, Pennsylvania"*.

**I did not measure it.** The dev server was stopped before this job began and
the packet says build nothing. The mechanism above makes the wrap certain and the
mid-place-name break likely; **the exact break point is unmeasured** and one lap
at 390px would settle it.

**Scope: 2 source files + CSS + 4 data strings + 4 register rows, plus one
`scrubFace` change. Call it a medium packet, and it needs a lap at 390px and 1280
to close.**

---

## RULING 3 — "QUESTIONS" ON /wal: **CONFIRMED STRUCK**

Nothing to do. Verified two ways:

1. `/wal`'s FAQ is built by the shared helper — `worth-a-listen.js:1878`,
   `face: faqFace("WORTH A LISTEN", [ … ])`, imported at `:73` from
   `src/data/faq-face.js`. That file's own note at `:33` reads *"the 'Questions'
   heading is STRUCK from all five faces"*, and `:60` records the ruling as
   applying to every FAQ face, "not robots only".
2. The renderer that would draw it, `FaqEntries` (`Exhibit.jsx:2160+`), carries
   the `[D 2026-08-11]` strike and states that `faqHead` was **deleted rather
   than pinned false** — "a switch nobody can throw is furniture". There is no
   code path left that could emit the word on any face.

`grep` for `Questions` across `src/` returns three hits and **all three are
comments** (`Exhibit.jsx:2148`, `Exhibit.jsx:2163`, `InfoBooth.jsx:405`) plus two
in `faq-face.js` / `house-copy.js`, also comments. No visitor-facing string
anywhere carries it.

One thing that is *not* the heading and was left alone: `worth-a-listen.js:1876`
carries `"questions"` as a **tag** in the face's tag list. It is search metadata,
not glass.

---

## WHAT I COULD NOT DETERMINE

- **Whether ruling 1 and ruling 2 really address the two different render sites**
  of the same field. The markup makes it the only reading on which both rulings
  can be true at once, and "the cards below are untouched" fits the split
  exactly — but I am inferring it, and if it is wrong the two packets collide.
- **Where the location line actually breaks at 390px**, and therefore whether it
  breaks mid-place-name today. Derived above, not measured; the dev server was
  down and the packet forbids building.
- **What the second authored line should say.** Splitting
  `Songwriter and producer · Los Angeles` is not obviously the same split as
  `Songwriter · Lancaster, Pennsylvania` — the first has a two-part role. The
  four are not symmetric and the authoring is Mike's, not a mechanical split on
  the `·`.
- **Whether the lineup should keep any second line at all** once ruling 2 exists.
  If the card gains two clean lines, the lineup's single line is the one that was
  wrapping — and ruling 1 removes it. That is consistent, but it means ruling 1
  is the *fix* for the wrap and ruling 2 is a separate improvement, rather than
  two halves of one job.

## WHAT NEEDS MIKE

1. **Confirm the split** — ruling 1 = the four names across the top (the lineup),
   ruling 2 = the bigger cards underneath. One sentence settles it and it decides
   whether these are one packet or two.
2. **The four second lines, in his words.** Ops can split on the `·` mechanically,
   but three of these four strings are RESTATED and one is VERIFIED against
   Hunter's own Bandcamp bio — the place halves are sourced and must not be
   re-worded, while the role halves are the house's. If he wants
   `Songwriter and producer` to break differently from the other three, that is
   an authoring call, not a rule.

Nothing else here needs him. Ruling 3 is already done and needs no action.
