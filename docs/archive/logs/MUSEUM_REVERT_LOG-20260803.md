# MUSEUM v42 — THE REVERT

**2026-08-03 · autonomous single-agent Code-lane round on Mike's remote-control
brief.** Items R1–R3. Frames: `docs/revert-round-20260803/`.
Undoes three items of v41 (`ecf33c5`, THE CLEANUP ROUND); keeps the other four.

**PUSH AND DEPLOY ARE MIKE'S.**

---

## THE RULING THAT OPENED THE ROUND

Mike, verbatim: C2/C3's rename and rewrites were an **OVER-READ** of his words.

> He said "keep me out of the space where I need legal today" — meaning don't
> incur legal WORK, **NOT rename the room**. He LIKED the Foundation version and
> did not want the "charity" version.

That is the whole finding, and it is not a defect in the sweep. **The v41 sweep
was clean, complete and verified**: it caught a live-URL break that would have
shipped, it measured its own title-truncation regression on glass, and it left no
orphan identifiers anywhere in the tree. It was thorough execution of a scope
that had never been granted.

**A constraint about what the house should SPEND ITS TIME ON was promoted into a
constraint about what the house should CALL ITSELF**, and then twelve careful
paragraphs were written defending the promotion. Thoroughness downstream of a
wrong premise is not a safeguard — it is what makes the wrong premise expensive
to undo. This round is the invoice.

**The banked rule:** when an operator's sentence can be read as a *scope* ruling
or as a *naming* ruling, that is worth one question. One. Not three names
considered in a file header, not a rewritten Q1 defending the choice. The
sentence "keep me out of the space where I need legal today" constrains the
WORKLOAD; nothing in it names a room. Written into `Foundation.jsx`'s header
where the next session will read it before touching the file.

---

## R1 — THE NAME COMES BACK, WHOLE

`THE WEIRD.BABY FOUNDATION` at `/foundation`. Swept back through every surface
v41/C2 swept forward, in the same order, so nothing is left half-renamed.

| Surface | v41 (`ecf33c5`) | v42 (this round) |
|---|---|---|
| route | `/money` | **`/foundation`** |
| component file | `src/routes/Money.jsx` | **`src/routes/Foundation.jsx`** |
| stylesheet | `src/routes/Money.css` | **`src/routes/Foundation.css`** |
| component | `function Money()` | **`function Foundation()`** |
| room attribute | `data-room="money"` | **`data-room="foundation"`** |
| CSS prefix | `.mny-` (7 classes) | **`.fnd-`** (7 classes) |
| `useRoom` / `useArrival` key | `"money"` | **`"foundation"`** |
| title bar (`MuseumBar room=`) | "Where the Money Goes" | **"The Foundation"** |
| directory board (`WbHome.jsx`) | "Where the Money Goes" | **"The Weird.Baby Foundation"** |
| redirect | `/foundation` → `/money` | **`/money` → `/foundation`** |

Both files moved with `git mv`, so the history follows the file rather than
reading as a delete plus an add.

### The board's position did not move, and that is deliberate

M8's ordering law is unchanged: ours, ours, theirs, then the desk, then the shop.
The entry sits between **Information Booth** and **Gift Shop**, exactly where F3
placed it and exactly where C2 left it. Only the words on the line changed back.
The F3 rationale — the booth answers what this place IS, the Foundation answers
what it is FOR — is restored with the name it was written for.

### THE REDIRECT SURVIVED THE REVERT AND RUNS THE OTHER WAY

Mike's own instruction: *"now point /money -> /foundation so the briefly-live URL
doesn't break — same courtesy in reverse."*

C2 nearly did not write this mechanism at all. Its argument against was that the
retired path had lived in exactly one unpushed commit, so no link in the world
could point at it — and the only reason that argument did not ship as a defect is
that C2 **probed the live site instead of trusting it**, and found Mike had pushed
AND deployed mid-round.

**The same check was run this round rather than inherited.** `git fetch origin` +
`git rev-parse origin/main` → **`ecf33c5`**. v41 is pushed. `/money` is a real
address on `weird.baby` and is not allowed to become a dead link.

`<Route path="/money" element={<Navigate to="/foundation" replace />} />` —
`replace`, so the retired name does not sit in the visitor's back button.

**It still breaks in the worst available way if that line goes.** `App.jsx` has
no catch-all route, so an unmatched path renders the shell and nothing in it — a
blank page, not even a 404. Carried forward again below, unchanged and still
unfixed, because it is a UX call and not a revert.

### ONE RULE DID NOT COME BACK, AND ITS ABSENCE IS THE POINT

v41/C2 added a scoped title-bar step-down:

```css
@media (max-width: 430px) { html[data-room="money"] .wb-bar-room { font-size: 0.7rem; letter-spacing: 0.04em; } }
```

It existed because "WHERE THE MONEY GOES" needed 220px in a 196px bar and was the
only truncated title in the building. **That defect was caused by the long name
and dies with it.** Re-adding the rule would leave a scoped override fixing a
problem no room has.

Measured after the revert, not predicted — `Range.getBoundingClientRect()` on the
bar's text node inside a genuine 390px frame:

| | |
|---|---|
| text | "The Foundation" |
| text width | **144.7px** |
| bar width | **195.8px** |
| headroom | **51.1px** |
| font | 12.8px (the standard size — no scoped step) |

Every other named room measured in the same lap at the same 12.8px, unchanged.

---

## R2 — Q1 REVERTS TO THE VERSION MIKE LIKED

`"Is this a foundation?"` and its v40 answer, restored word for word.

**What came out:** v41/C3's `"Is this a charity?"`, and the answer built to deny
a registration, a charity number and a tax treatment in one breath — plus the
header block arguing that shipping "raises the bar" and required the denial.

**Why it was written and why it goes:** C3's argument was that an unanswered "is
this a charity?" gets answered by the visitor's assumptions. Reasonable in
isolation — but it was answering a question the ROOM'S OWN NAME had stopped
asking, since C2 had just removed the word "foundation" from the door. With the
name back, the question a stranger arrives with is the one on the door, and the
room answers it first. **The denials were also legal-register work in a room Mike
had asked to keep out of that space** — the exact thing the original ruling was
about.

The [PAPA] tail is unchanged and still scrubs at the render seam: whether
Weird.Baby is ever formally incorporated, and as what, remains Papa's and remains
unsaid to visitors.

**The tension the name carries is not papered over — it is answered out loud, in
answer one, which is the version Mike picked.** A room called the Foundation that
opens by saying there is no fund is the strongest statement of clause 4 this
house has.

---

## R3 — "THE LEGAL WORK" RETURNS TO THE GIFTED-SERVICES LIST

Q10 ("Who pays you?") reads again: *"…the design, the code, the shelf, the legal
work all arrive as gifts of service."*

C3 subtracted it on the argument that a page denying an entity in Q1 cannot
describe its ongoing legal work in Q10. **That argument only existed because C3
had just written the denial into Q1.** R2 removes the denial; the argument goes
with it, and the charter's clause 3 is quoted whole again — four gifts of
service, not three. The charter was never edited and is unchanged either way.

Worth stating plainly, since it is the crux of the original ruling: **gifted legal
service is not the thing Mike ruled out.** What he wants to stay out of is legal
work the house must pay for and chase. A lawyer who donates an hour costs the
house exactly what the designer and the coder cost it — nothing — which is the
entire point of the clause the answer is quoting.

---

## KEPT — the four things this round did not touch

Explicitly named so nobody reads "the revert" as reverting v41.

1. **C1 — the record cards stay off About the Songs.** The `sideboxes:` key
   deletion in `aboutSongsTrack` stands, as does the finding underneath it
   (`Exhibit.jsx` draws sideboxes BEFORE entries, so two grey registers took the
   whole first screen). Every `card.tombstone` still in the file.
2. **C4 — Hunter Root's vault portrait stays**, and so does the letterboxing fix
   it exposed (both axes become maxima + `align-self:flex-start`), which also
   cured Jesse Welles's plate — a defect that had been live since F1.
3. **C3's ship ruling stands.** The room is published. Only its Q1 and Q10
   rewrites are undone. `THE_CHARTER.md` is still DRAFT v0.3 and that is still
   not a blocker.
4. **The redirect machinery**, reversed per R1 rather than removed.

---

## GATES

| Gate | Result |
|---|---|
| `npm run lint` | **11 err / 9 warn** — identical to the HEAD baseline, zero new |
| `npm run build` | green (71 modules, 668.06 kB / 184.78 kB gzip) |
| Built-bundle sweep | `mny-` in built CSS: **0**. `data-room="money"` in built CSS: **0**. "Where the Money Goes" in built JS: **0**. `path:"/money"` present exactly once, as the `Navigate` redirect |
| Desktop lap | 1706×900, nine routes — `/foundation`, `/money`, `/`, `/booth`, `/shop`, `/wal`, `/robots`, `/hr`, `/wb`. Zero horizontal scroll, zero title truncation |
| 390px lap | genuine 390×740 same-origin iframe, same nine routes. `scrollWidth` 373 ≤ 390 on all but `/` and `/wb` (390 = exact). Zero horizontal scroll, zero title truncation |
| Redirect | `/money` → lands `/foundation`, `data-room="foundation"`, ledger present, **0** elements matching `[class*="mny-"]` |
| FAQ integrity | **12** questions, **zero `[PAPA]` leaks**, Q1 = "Is this a foundation?" with the v40 answer, Q10 contains "the legal work" |
| Legal-vocabulary scan | `501(c)\|non-profit\|registration\|charity number\|deduct\|incorporat` over the whole rendered page: **zero matches** (C3's denials are gone with C3's Q1) |
| Console | zero errors, zero warnings on `/foundation` (vite HMR + React DevTools notices only) |
| Class cross-check | 7 `fnd-` classes in the JSX, the same 7 selectors in the CSS, no strays either way |
| Repo hygiene | 390px harness was an injected same-origin iframe — nothing written to the repo, nothing to remove before seal |

---

## CARRY-FORWARD, NAMED NOT FIXED

Carried from v41 unchanged except where the revert touched them.

1. **`App.jsx` HAS NO CATCH-ALL ROUTE.** Surfaced by C2's redirect work, still
   true, still untouched: any path the table does not match renders the shell and
   nothing in it — a blank page rather than a 404. It is a UX call (what a lost
   visitor should see), not a cleanup and not a revert. Worth a `path="*"` next
   time somebody is in this file. **Two redirects now depend on this gap staying
   harmless**, which raises the value of closing it.
2. **`InfoBooth.css` is furniture for two rooms while named for one.**
   `Foundation.jsx` imports it, as `Money.jsx` did. Renaming it means touching
   the room Mike calls AWESOME to change nothing a visitor can see. Still a want.
3. **Five text-only faces in the robots wing**, all ART-pending. Unchanged.
4. **`MV-HR-20260405-035`** (the chip sandwich) — a good picture of Hunter Root
   trapped in a Facebook screenshot. A second plate if it is ever re-captured
   clean.
5. **`THE_CHARTER.md` is still DRAFT v0.3, "not published."** The room ships
   anyway; the document's status is Papa's.
6. **The Billionaire's Credo stays unwritten** — Q8 carries `[PAPA]` and the
   scrubber drops it.
7. **`--wb-gold-mute` and `--wb-gold-lo` are still half a stop apart.** F0's
   finding, unchanged.
8. **NEW — the museum now has two retired room names in its history and one
   live redirect for each direction it has travelled.** If the room is ever
   renamed a third time, the redirect table is the thing to read first: `/money`
   currently points at `/foundation`, and a future rename must re-point BOTH, not
   just the live one.

**PUSH AND DEPLOY ARE MIKE'S.**
