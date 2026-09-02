# MUSEUM v43 — THE EVENING RUN

**2026-08-03 · autonomous single-agent Code-lane round on Mike's remote-control
brief.** Items E1–E5. Frames: `docs/evening-round-20260803/`.

**PUSH AND DEPLOY ARE MIKE'S.**

---

## E1 — THE FOUNDATION'S REAL CONTENT

Mike dictated the contributions model and called it the room's build-out.
Recorded in `STATE.md` under **THE CONTRIBUTIONS MODEL** first, per his
instruction, then built.

### THE CONSTRAINT DID THE DESIGN

> *"Honest about what exists today vs what is planned — nothing may claim a
> mechanism that isn't built: if the registry doesn't exist yet, the room says
> so plainly."*

The easy way to satisfy that is a "coming soon" sentence at the bottom of the
page, which is a promise wearing a disclaimer's clothes. **So the tense came out
of the prose and went into a column.** Every row of the new ledger carries its
own state, printed at the same weight as the row, in the museum's apparatus
register:

| | |
|---|---|
| **LIVE** | a visitor can do this today |
| **NOT BUILT** | it does not exist |

There is deliberately no third state. "In progress", "planned" and "soon" are
all promises, and a promise on a page about money is the thing this house has
spent four rounds refusing to make. The two states differ **in kind rather than
in degree** — a solid rule for what exists, a DASHED one for what does not —
because putting the entire honesty mechanism on a contrast ratio would have made
it a tone, and a reader scans line quality faster than they scan tone.

### WHAT IS ON THE PAGE NOW

**THE LEDGER — two registers, five rows.**

| Register | Row | State |
|---|---|---|
| What comes in *(money)* | The gift shop | **LIVE** |
| | The house's own music | **LIVE** |
| | Given in Weird.Baby's name | **NOT BUILT** |
| What arrives as the thing *(goods and services)* | A registry of supplies | **NOT BUILT** |
| | A registry of services | **NOT BUILT** |

The QR row says its own future out loud: *"This row will read LIVE on the day
that is real, and not one day before."* Mike's capitalised rule — **WE LIST ONLY
WHAT WE NEED** — is set as a rule under the second register rather than as a
sixth row, because it governs both registries and it is the sentence that stops
a list of needs from becoming a list of wants.

The music row makes no earnings claim, which was the one place the model could
have over-claimed by accident: it names the CHANNEL (the house's own recordings,
published under its own name) and says what happens to anything it earns. Whether
it has earned anything is not asserted either way.

**THE ZERO-COST INVOICE.** The charter's clause 3 has always said the museum's
needs arrive as gifts of service, and this page asserted it in a sentence. An
invoice is the document that assertion is made of — five real line items, a
column of five zeros, and a TOTAL DUE of $0.00, from Papa Weird.Baby to The
Weird.Baby Museum.

The figures are the hard part and are handled honestly. Mike's brief carries one
real number and it is printed (**AI tooling · $100–200 / month**). The other four
carry NO figure rather than a plausible one, and the small print says which, in
house voice: *"Figures are published as they settle; the lines without one are
not public yet. This is not a tax document and is not filed anywhere — it exists
so the ledger is honest and public."* The marker naming what is still Mike's to
publish rides an unrendered `papa` field, where the scrubber can see it and a
visitor cannot — a `[PAPA]` in the small print would have scrubbed the whole
sentence and left an invoice with four blank figures and no explanation of why.

*(Hook noted, nothing built: the eBay-purchase tally lives in one code comment on
the invoice and in no field, no placeholder and no UI.)*

**THE POSTURE, SIGNED.** Mike called it the room's heart, so it is the largest
reading type on the page and the only sentence outside the credo set in the brand
face. It sits INSIDE the invoice, under a hairline, above `PAPA WEIRD.BABY` —
because it is what the invoice MEANS. A bill for nothing is a gesture until
somebody says out loud who is carrying the cost and on what terms.

> We still do a fair amount of the donating ourselves, and will simply continue
> until we no longer can.

"Until we no longer can" is the honest limit and it is left in. A house that only
claims what it can guarantee would have cut exactly that clause.

### THE VISUAL HOOK LAW, AND WHY THE ACCOUNT CARD DID NOT MOVE

The room already landed on the `$0.00 / held, ever` card and it is untouched.
Worth stating because it looked like a conflict and is not: **$0.00 HELD is not a
claim that nothing arrives — it is a claim that nothing STAYS**, which is
precisely what the register underneath now demonstrates line by line. The invoice
is the page's second object and is deliberately NOT inverted; one inked block per
sheet, and the zero has it.

### THE ONE JUDGEMENT CALL ON COPY MIKE HAD ALREADY APPROVED

**Q7, "Can I send money?", answered a flat *No*.** That answer was written when
the only money in this building was money to RUN it, which the charter forbids
taking. Mike has now named three channels through which money arrives. Left
alone, the page would carry a register of incoming money six inches under a
sentence saying none comes in.

**It was NARROWED, not reversed.** Every word of its argument about the museum's
COSTS survives — help arrives as the thing, pay the registrar directly, *"there
is no account to fill and there never has been one."* What is added is the
distinction that argument always rested on and never said: giving is the other
direction, and a gift made in Weird.Baby's name was never Weird.Baby's money.
Clause 4 already describes money PASSING THROUGH its hands, so the doctrine did
not move; this page's account of it got complete.

**This is the round's one edit to approved copy and it is flagged rather than
buried. If Mike wants the flat No back, it is one string.**

Two questions were added — *"So who is actually paying for all this?"* (the
posture, as a question) and *"Can I send you something you need?"* (the registry,
answered NO for today with what the yes will look like) — and Q6 gained one
factual clause: today the sponsor on every line is Papa. 12 → **14 questions**.

---

## E2 — THE CATCH-ALL

Mike's ruling: *any unmatched path renders THE LOBBY — no dead end, no blank
shell, no apology.* Carried unfixed in three round logs.

```jsx
<Route path="*" element={<WbHome />} />
```

**IT FAILED IN THE WORST AVAILABLE WAY BEFORE THIS.** `wrangler.jsonc` sets
`not_found_handling: "single-page-application"`, so Cloudflare hands every
unknown path to `index.html` — the router was the last thing between a typo and
an empty screen, and with no `path="*"` it matched nothing and rendered the shell
with nothing in it. Not a 404. A blank page.

**IT RENDERS RATHER THAN REDIRECTS**, which is the ruling read literally.
`<Navigate to="/">` was the reflex and does two things Mike did not ask for: it
rewrites the address bar, so a visitor who mistyped is quietly told they were
wrong, and it puts a redirect in the history of a URL that was never real. The
Lobby reads no params and keys `useRoom`/`useArrival` on the literal string
`"lobby"`, so it can be served AT the wrong address and every door on it works.

**No apology is part of the spec** — no "page not found", no 404 register, no
"did you mean".

Verified on `/nonsense`, `/booth/does-not-exist`, `/hr/typo`, `/foundation-x`,
`/a/b/c/d`, `/this/is/not/a/room`, `/nope/nope` — all 200, all
`data-room="lobby"`, full directory rendered, desktop and 390px.

---

## E3 — THE LAST TEXT-ONLY FACES, AND THERE WERE SIX

`VISUAL_HOOK_AUDIT-20260803.md` named five and listed one "FAQ" under Robots.
**The wing has two FAQ faces** — the front desk's, about Weird.Baby, and the
MGK-VIIIp album's, about the unit. The second was text-only on identical terms
and was never counted. A face missing from an audit is invisible to every round
that trusts the audit, so the miscount is recorded in the audit rather than
quietly corrected.

| Face | Hook | Why it is the honest one |
|---|---|---|
| **The Record** | `front_full.png` | a log about a machine, opening on the machine as it arrived. Tile 2 of The Plates; head plate of nothing else |
| **The Manual** | the manual's own **WORKING COPY** title page | B8's ruling says the generated pages are *"the source Mike prints and photographs"*. That document's own type reads **PRELIMINARY — WORKING COPY / NOT FOR DISTRIBUTION**, so it argues against being mistaken for the artifact before the caption gets a word in |
| **The Firmware** | `front_screen.png` | there is nothing to photograph in a source tree. The lit glass is the firmware's OUTPUT on the real machine — the only plate showing the software running rather than the box it runs in |
| **FAQ** *(front desk)* | the **31½ TALLY** card | type. "Thirty-one and a half. The fraction is not a typo" is the wing's best line and it is a NUMBER |
| **Contact** | the **ONE ADDRESS** card | type. The whole card is the answer's own first sentence |
| **FAQ** *(MGK-VIIIp)* | `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | two of its four questions ask whether what you are looking at is the real machine; the bezel is the piece a visitor actually meets |

### THE TWO CARDS ARE TYPE, AND THAT IS A RULE NOT A SHORTCUT

The four MGK faces are about a physical object and the museum owns eight
photographs of it. The two front-desk faces are about the HOUSE — what we are
asked, and how to reach us — and **there is no photograph of a question.** A
machine on those faces would have been decoration borrowed from the room next
door, which is the thing the law is for rather than the thing it asks for.

Not one word on either card is new. The pattern is the building's own, twice
over: the booth's ADMIT ONE ticket and the Foundation's account card are both
objects made entirely of a sentence the page was already saying.

### NO RENDERER CHANGED, AND THAT WAS THE FIND

WAL's `HOUSE_COVER` proved an inline SVG data URI is a picture as far as the
exhibit is concerned. So a typographic object costs **zero** renderer changes,
goes through the existing `still` key, and inherits the plate's geometry, its
border and the wing's B&W law. Sized 520×420 on purpose: `.vp-face-still` gives a
plate `height:min(48cqh,210px)` and `max-width:260px`, and at that aspect the
card lands at **exactly 259.54 × 210** — measured — so neither cap crops it.
System faces only (Georgia, Courier New); an SVG in an `<img>` cannot fetch the
museum's webfonts.

**Not one new asset was sourced and no rights question was opened.** Four plates
already ship on The Plates; one is a 21KB copy of a document already in the
robots repo (`public/robots/manual/working-copy-p1.png`, because the museum's
build cannot reach a sibling repo); two are inline SVG.

### CONSIDERED AND REJECTED

`docs/assets_twin/twin_top_render` and `mgk65_reveal_treatments` in the robots
repo. The first is a synthetic frame of a comparison exercise; the second is a
working document about FONT CHOICE — interesting to us, inside baseball to a
visitor. A photograph of the real glass beats a render of a proposed one.

### WHAT REMAINS, AND IT IS A CAMERA NOT CODE

The Record's per-entry `evidence:` is still unphotographed and `.vp-fe-plate` is
still empty on it. The Manual's microfiche reel is still `plates: []`. **Both are
untouched on purpose** — loading generated pages into that reader is precisely
the "in the style of" B8 forbade.

---

## E4 — `InfoBooth.css` GENERALISED

Furniture for two rooms while named for one; carried as a want in three logs.

**THE DISHONESTY WAS NEVER IN THE SHARING.** F3 built `/foundation` on the booth
the strong way — import its actual rules rather than keep a copy that drifts by
Tuesday — and that decision stands untouched. What was wrong is that a file named
`InfoBooth.css` owned the typography of a room called the Foundation, so **the
next session asked to change something in the booth would have shipped a change
to a room it never opened.** The name was the only thing telling it otherwise,
and the name was wrong.

**The house already had the word.** `Exhibit.css` has described this composition
as *"L5's sheet-on-mat"* since June, in two separate comments. A SHEET is a
printed page on the mat: warm print stock, a hairline, a two-part shadow, and on
it a placard, a rule, a stack of questions and a way out.

| | |
|---|---|
| **`src/styles/sheet.css`** *(new)* | `.sheet-root` · `-card` · `-credo` · `-words` · `-rule` · `-faq` · `-faq-head` · `-q` · `-faq-a` · `-contact` · `-back`, plus the grain overlay and the ≤680px padding. The M3 typography history travelled with the rules it explains |
| **`InfoBooth.css`** | the booth's page ground + `.booth-ticket*`. 15.7KB → 5.4KB |
| **`Foundation.css`** | the room's page ground + `.fnd-*` (account card, register, invoice, posture) |

**The test applied to every rule: would BOTH rooms want this changed at once?**
If no, it stayed where it was. That is what kept each room's visual hook out of
the shared file — a sheet holding both the ticket and the account card would be
the same fork this round closed, wearing the other hat.

**Not a component**, and that is a scope decision rather than an oversight. A
`<Sheet>` wrapper would restructure both rooms' JSX to change nothing a visitor
can see, on the same reasoning that kept this rename waiting three rounds. The
class names are the contract; `MuseumBar.jsx` is the precedent for the day a real
component is worth it.

**Name collision found and NOT touched:** `--wb-booth-*` in `museum-tokens.css`
is the PROJECTION BOOTH — the dark scope used by the player bar and `/admin` —
and has nothing to do with `/booth`. Recorded in OPERATIONS.md so the next
grep-and-rename does not eat it.

**Both consumers verified unchanged on glass:** `/booth` renders the ticket, the
credo, the two lines, eleven questions and the contact line exactly as before;
`/foundation` reports **0** elements matching `[class*="booth-"]`.

---

## E5 — CARRY-FORWARD WORKED

Eight items were carried out of v40/v41/v42. **Three are closed by this round**
(the catch-all, the stylesheet, the text-only faces). One was already closed and
the documents had not noticed.

| Carried item | Disposition |
|---|---|
| `App.jsx` has no catch-all | **CLOSED — E2** |
| `InfoBooth.css` named for one room | **CLOSED — E4** |
| Five text-only robots faces | **CLOSED — E3** (there were six) |
| A portrait of Hunter Root | **ALREADY CLOSED** by v41/C4 — the vault plate shipped. `VISUAL_HOOK_AUDIT`'s "one named trade" paragraph was stale and is now marked so |
| `VISUAL_HOOK_AUDIT` compliance line in STATE.md | **RECONCILED** — "five remain" → zero remain |
| OPERATIONS.md file map | **RECONCILED** — the booth/foundation row rewritten for the shared sheet; a routing-table row added for the catch-all; `Last verified` re-dated |

### STILL OPEN — needs Mike, or a camera

1. **Q7's narrowing** (E1 above). The round's one edit to copy Mike had already
   approved. One string to revert.
2. **The four unpublished invoice figures** — domain, robot supplies,
   manufacturing, the extras. Papa's to publish; the invoice is built to take
   them.
3. **The Record's evidence photographs** — ten entries, `evidence:` on every one,
   `.vp-fe-plate` built and waiting.
4. **The Manual's microfiche plates** — `plates: []`, and B8's spec for the shoot
   is written into the face's own header (≥2400px long edge, whole page including
   margins, reel order = reading order, `label` + `date` per frame).
5. **`MV-HR-20260405-035`** (the chip sandwich) — a good picture of Hunter Root
   trapped in a Facebook screenshot. A second plate if re-captured clean.
6. **`THE_CHARTER.md` is still DRAFT v0.3, "not published."**
7. **The Billionaire's Credo stays unwritten** — Q10 carries `[PAPA]` and the
   scrubber drops it.
8. **`--wb-gold-mute` and `--wb-gold-lo` are still half a stop apart.** F0's
   finding. Left alone: it is a palette call and palette calls are Mike's.
9. **Two retired room names, one live redirect.** `/money` → `/foundation`. A
   third rename must re-point it, not add another.

---

## GATES

| Gate | Result |
|---|---|
| `npm run lint` | **11 err / 9 warn** — identical to the HEAD baseline, zero new |
| `npm run build` | green — **72 modules** (71 + `sheet.css`), 675.62 kB / 186.96 kB gzip |
| Desktop lap | built bundle via `wrangler dev`, 1440×900 and 1280×900. `/foundation` register + invoice + posture, `/booth`, `/robots` ×6 faces, the catch-all |
| 390px lap | genuine 390×740 frame, **11 routes** — `/`, `/booth`, `/foundation`, `/money`, `/shop`, `/wal`, `/robots`, `/hr`, `/wb`, `/this/is/not/a/room`, `/foundation-x`. `scrollWidth` **≤ 390 on every one** (378 in every room, 390 exact on the Lobby). **Zero title truncation** on all nine bars |
| Redirect | `/money` → renders `/foundation`, `data-room="foundation"` |
| Catch-all | 7 junk paths, all 200 from the worker, all `data-room="lobby"`, full directory |
| `[PAPA]` leaks | **zero** on `/foundation` (14 questions), zero on `/booth`, zero on the six robots faces |
| Class cross-check | `/foundation`: **0** elements matching `[class*="booth-"]`. `.sheet-*` selectors in `sheet.css` all used by both rooms; no strays either way |
| Plate geometry | the two SVG cards measured **259.54 × 210** against the `max-width:260px` / `height:min(48cqh,210px)` caps — no letterboxing, the F1 defect does not recur |
| Repo hygiene | the screenshot harness was written to `dist/client/_lap.html` — **gitignored build output**, deleted at seal. Nothing added to the repo but the 21KB manual plate |

---

## FILES

**Changed**
```
src/App.jsx                       catch-all route
src/routes/Foundation.jsx         the ledger, the invoice, the posture, 2 new Qs, Q6 clause, Q7 narrowed, sheet-* classes
src/routes/Foundation.css         register + invoice + posture rules; ground kept
src/routes/InfoBooth.jsx          imports sheet.css; sheet-* classes; ticket unchanged
src/routes/InfoBooth.css          reduced to the booth's ground + its ticket
src/data/artists/robots.js        6 face hooks + the two SVG desk cards
STATE.md                          THE CONTRIBUTIONS MODEL; v43 seal; hook-law compliance line
docs/canonical/OPERATIONS.md      file map: shared sheet, routing table, Last verified
docs/VISUAL_HOOK_AUDIT-20260803.md  closure banner + the miscount + the stale-trade note
```

**Added**
```
src/styles/sheet.css                          the shared sheet-on-mat
public/robots/manual/working-copy-p1.png      21KB, from the robots repo
docs/MUSEUM_EVENING_LOG-20260803.md           this file
docs/evening-round-20260803/                  12 frames
```

**PUSH AND DEPLOY ARE MIKE'S.**
