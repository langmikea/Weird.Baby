# THE WORKSHEET — round log

**Date:** 2026-08-07 · **Instructions:** W1–W8, all eight built · **Packet:** single
agent, drafting lane, standing gates.

**Mike's ruling that produced the round:** *"If it is reference, write it as such. If
it is the firehose I have to drink from to do anything, thanks, pass."*

---

## 0. THE ONE-PARAGRAPH VERSION

`week1.html` was a good document and a bad instrument. It explained the rail scheme,
the provenance model, the transfer classes, the bouncy ball law and five collisions
**before it showed a single headline**, and then it had nowhere for Mike to write. It
spent his attention describing the machine and gave him nothing to do with what was
left. It is replaced by two files — **`worksheet.html`**, which he writes in, and
**`reference.html`**, which holds everything that explains the machine — and the split
is the whole design. **The round's largest finding is not in either page: it is that
week two's material arrived IN WRITING, which makes it quotable, and the old rail
scheme had no way to say so.**

---

## 1. WHAT SHIPPED

| # | Instruction | What landed |
|---|---|---|
| **W1** | Weekly summary headline for each of the next two weeks, Ops left / Mike right. | Two blocks at the top of `worksheet.html`, each an Ops headline beside a textarea. Week 2's Ops headline is marked **your words** — it is his. |
| **W2** | Complete list of daily headlines, both weeks, same two columns, read-only map. | Two ten-row maps. The right column is a **live mirror** of the day blocks below — it fills itself in as he types and cannot be edited, exactly as instructed. Each row carries a ↓ that jumps to its block. |
| **W3** | One block per Record day, ten blocks, three two-column rows each. | Ten `<section class="day">` blocks; headline, executive summary, detailed sections/notes; Ops left, textarea right. **32 slots in total** and the count is printed in the bar. |
| **W4** | The collector — one button, plain text, transportable, survives a reload. | `localStorage` autosave (debounced 400 ms, plus on blur), a **restore on load**, a sticky bar with a live *n of 32 filled · saved HH:MM*, and one **COPY EVERYTHING** button in two places that assembles the export, puts it on the clipboard and leaves it on screen selected. |
| **W5** | Move the boilerplate out of the way, to a linked reference page. | `reference.html`: the three marks, where each week came from, the prelude, the transfer classes, the Friday formula, the standing Record rules, the bouncy ball law and both runways, the ten collision checks, the three trackers, the two rulings of 07-08, and how the worksheet keeps what he types. **None of it is on the worksheet.** |
| **W6** | Reading order is his: headline of headlines, then narrow. | Masthead (three lines) → the two weekly headlines → the ten-row map → the ten day blocks → the collector. **Every level is complete on its own**; a reader who stops after the map has the shape of two weeks in about forty words. |
| **W7** | Ops' left-hand content from what exists; week two from the arc; mark quietly. | Week one from `reveal/week-one.mjs`, unchanged. Week two is **new**: `reveal/week-two.mjs`. Marks are 9.5 px tags and 2 px column rules — no red slots, no banners, no explanation. |
| **W8** | Keep the artifact, egg and spec trackers off this page. | They are off it. They are three cards on the reference page and three cards on the index. |

**Paths, explicit:**

```
reveal/week-two.mjs                     NEW — week two's outline and its 5 checks
tools/dictation/worksheet.mjs           NEW — buildWorksheet() + buildReference()
tools/dictation/shell.mjs               NEW — the shared shell, MOVED not copied
tools/dictation/prep.mjs                header, imports, index rewritten; buildWeek1 deleted
docs/dictation-20260807/worksheet.html  NEW  (41 KB)
docs/dictation-20260807/reference.html  NEW  (35 KB)
docs/dictation-20260807/index.html      rewritten as a door (9.6 KB)
docs/dictation-20260807/week1.html      DELETED, by name, by the generator
```

Regenerate: `npm run dictation`.

---

## 2. THE FINDING — WEEK TWO IS QUOTABLE AND THE RAIL SCHEME COULD NOT SAY SO

W1 (the previous round) established the rule the pages run on: **the shape is Mike's,
the sentences are Ops', the gold rail stays empty until he dictates into it.** It was
built for week one, which he **spoke aloud** on 2026-08-02 and Ops wrote down from the
framing. Nothing in `week-one.mjs` is his wording, so gold-empty is not a policy there,
it is a fact.

**Week two did not arrive that way. It arrived in writing** — a headline and six beats,
in his own characters, in the round instruction, still sitting there to be checked
against. Carrying those on the blue rail would have been the *inverse* of the error the
rail scheme was built to prevent:

> A paraphrase rendered in gold is indistinguishable, a week later, from something he
> actually said. **His own sentence rendered in blue gets quietly "improved" by the next
> round**, and nothing can tell that it was ever his.

So the scheme gained a third mark and it is the honest half of the old rule:

| mark | means | promise |
|---|---|---|
| `Ops` (blue) | Ops wrote the sentence | the shape is his, the words are not |
| **`your words` (gold)** | **verbatim, character for character** | **never reworded, ever** |
| `your rule · Ops wording` (amber) | he named the rule | rule his, sentence Ops' |

`reveal/week-two.mjs` carries a **`beat`** field holding his exact strings, with a rule
in the file header that is the point of the whole thing: **a `beat` may be DELETED but
never REWORDED.** If it needs different words it stops being his and moves into
`headline`, `shape` or `topics`, where Ops' wording belongs. Week one's file is
untouched and its gold rail is still empty, which is now a statement about week one
rather than about the scheme.

---

## 3. THE ONE STRUCTURING DECISION, NAMED RATHER THAN SMOOTHED

Six beats, five days, and Friday is fixed by the sixth — so five beats had to fit four
days and **exactly one merge was required.** Ops merged *"the unlabeled table holding
more codes"* and *"the codes that fail when typed directly"* into day 4, because they
are one object and the property that object has. Any other pairing puts two different
objects in one day.

Days 1–3 and 5 are **his own sequence in his own order**, and the merge is printed on
the reference page rather than left for him to notice. It is the only division Ops made
and it is the only one worth arguing with.

**No weighting was invented.** There is still no `weight` field on anything
story-shaped in either repository (K-b), so the topic lists are LISTS and not rankings,
exactly as week one's are — for the same reason Ops does not derive a bouncy ball
bucket (B-a): a made-up order makes a page read as answered while nothing has been
answered.

---

## 4. THE COLLISION THE OUTLINE PRODUCED — X-1, AND IT IS THE ROUND'S ONE OPEN ITEM

Week two's Friday is **a box on the porch with no shipping label**. That is a physical
arrival, and the transfer model puts every physical arrival in class `PACKAGE`:

```
TRANSFERS.PACKAGE = { opens: 3, closes: 7, "weeks 3–7, physical, on four Fridays" }
```

**Week 2 day 5 sits one week outside that window, and it is the only beat in either
week that does.** Everything else in week two is `UNLOCK`, which by the model's own
definition needs no arrival at all.

Three ways out, all his, none taken by Ops:

1. Move the box to week 3 and let week 2 end on the codes.
2. Open the PACKAGE window at week 2 — five Fridays instead of four.
3. **Rule that this box is not a package.** An unlabelled box on a porch has no carrier
   and no manifest, and the model's classes are about how material *reached* the museum,
   not about cardboard.

The third is the cheapest and probably the truest to what he wrote — *"no shipping
label"* is the sentence that makes it not a delivery — **but it is a change to the
transfer model's own boundary, and Ops does not make one of those on an inference.**

**Where it is surfaced is as much of the answer as what it says:** the day-5 block on
the worksheet carries one amber line pointing at it, and the argument is on the
reference page. *Tell him what he needs to know, when he needs to know it.*

Four more checks were run and all four agree, two of them unarranged: X-2 (week two's
spine is `UNLOCK`, which costs the story no arrivals), **X-3 (the week's headline and
the `UNLOCK` class's definition are the same claim in two registers, written five days
apart by two people from nothing in common)**, X-4 (two Fridays is the first evidence
the Friday formula is a form and not a one-off) and X-5 (week two is where a genuine
reveal would be spent and no asset carries a bucket — B-a, restated where it bites).

---

## 5. THE SHELL MOVE, AND THE PROOF THAT IT WAS A MOVE

The worksheet needed the same escaper, page frame, stylesheet and runway block the
tracker pages use. Copying them would have produced a second stylesheet that starts
drifting the day somebody fixes a rule in the first. So seven declarations were
**lifted** out of `prep.mjs` into `tools/dictation/shell.mjs` — unchanged, character for
character — and the move was proved rather than asserted:

```
copies of specsheet.html / artifacts.html / eggs.html taken BEFORE the split
        ↓  split, regenerate
cmp against the copies  →  IDENTICAL, all three, byte for byte
```

Three pages this round did not intend to change did not change. That comparison is the
reason the shell is a file and not a duplicated block.

---

## 6. THE BUG THE LAP FOUND, ON THE ONE PAGE WHOSE JOB IS WRITING

The textareas came up in the browser's default **monospace at the browser's default
size**. The cause:

```css
textarea { font: 14px/1.5 inherit }     /* INVALID — dropped entirely */
```

The `font` shorthand takes a family; `inherit` is only legal as the *whole* value. So
Chrome discards the declaration, and every writing field on the instrument rendered in
a font nobody chose. **It is only visible on the glass** — the CSS parses, nothing
errors, and no gate in this repository can see it.

Fixed with an explicit stack. **The same construction appears three times in the shared
`OPS_CSS`** on the tracker pages' filter controls; those are not this round's to change
and the defect is written down beside the fix, so the next reader knows the pattern is a
bug and not a house style.

---

## 7. GATES

| gate | result |
|---|---|
| `npm run lint` | **11 errors / 9 warnings = baseline**, zero new |
| `npm run build` | green, 419 ms |
| `npm run provenance:gate` | **PASS** (exit 0) |
| `npm run reveal:check` | **PASS** (exit 0) |
| `npm run parity:gate` | **PASS** — 4 shared · 0 divergences |
| `npm run instory:gate` | **PASS** — 22 strings read, 0 findings |
| `npm run assets:orphans` | **0** |
| `npm run lap:clean` | `public/_lap.html` already absent |
| **the lap** | **RAN — all six pages, at 390 px and at 1228 px** |

**Nothing in `src/` changed this round**, so the museum's own glass is byte-identical
to yesterday's. The provenance and in-story gates therefore had nothing new to judge and
their PASS means only that nothing regressed.

### The lap, in detail, because it needed a rig

The Chrome extension **refuses `file://`**, which is how these pages are actually
opened. A throwaway static server in the session scratchpad served
`docs/dictation-20260807/` over `127.0.0.1`, with N5's own recipe on top: a **403 px
same-origin iframe**, which gives a document `innerWidth: 390` exactly.

| page | innerWidth | scrollWidth | page scrolls sideways | tables outside a `.tw` scroller | overflow outside a scroller |
|---|---|---|---|---|---|
| worksheet.html | 403 | 390 | **no** | 0 | **0** |
| reference.html | 403 | 390 | **no** | 0 | **0** |
| index.html | 403 | 390 | **no** | 0 | **0** |
| artifacts.html | 403 | 390 | **no** | 0 | **0** |
| eggs.html | 403 | 390 | **no** | 0 | **0** |
| specsheet.html | 403 | 390 | **no** | 0 | **0** |

Desktop, at the operator's real 1228 px: `scrollWidth 1216 = clientWidth 1216`, zero
overflowing elements, **zero console errors**. The reference page's five tables overflow
*inside their own `.tw` boxes*, which is the documented arrangement and is why the
measurement above discounts anything inside a scroller.

### What was proved about the collector, and the one thing that was not

Driven programmatically on the served page:

- 32 textareas, 10 mirrors — the model matches the instruction.
- Typing into three slots (one of them multi-line) wrote all three to `localStorage`.
- **A fresh page load in a NEW TAB restored all three into the right slots**, redrew the
  map's mirror, left untouched slots empty, and re-grew the multi-line field to 128 px.
- The export is byte-correct: header, `n of 32 slots filled`, one keyed block per filled
  slot, Ops' one-line headline where there is one, multi-line values on their own lines,
  and a closing `LEFT EMPTY (29): …` roll-call.

**NOT PROVED: that `navigator.clipboard.writeText` succeeds under a genuine user click.**
Real mouse input stopped reaching the page part-way through the session — a click on a
textarea did not focus it — so every click in the test was synthetic, and a synthetic
click carries no user activation, which is exactly what the clipboard API requires. Under
that condition the page **correctly fell back**: it selected the assembled text and said
*"The browser refused the clipboard. The text is selected below — press Ctrl+C."* That
is the designed degradation and it was observed working; whether the fast path also
works on a real click is unmeasured and is **said plainly rather than left as a
silence**. The button is useful either way, because the worst case is a Ctrl+C.

**Also untested: `file://`.** The pages were lapped over `http://127.0.0.1`, because the
extension will not open a local file. Mike opens them from disk. Both failure modes
degrade honestly by construction — a refused `localStorage` raises a **red banner at the
top of the worksheet** rather than letting an hour of typing evaporate on a reload, and a
refused clipboard leaves the text selected.

**An operator error worth recording:** calling `navigator.clipboard.readText()` from the
driver raised Chrome's clipboard-permission prompt, which is tab-modal and **froze the
renderer** — CDP timed out on both `Runtime.evaluate` and `Page.captureScreenshot`.
Recovered by closing the tab. Never call `readText` from the driver; verify a copy some
other way, or not at all.

Test responses were cleared from the `127.0.0.1` origin's storage at the end. They were
never on `file://`, which is where Mike's own worksheet will live.

---

## 8. SURFACING — UNMOVED, AND THIS IS THE FOURTH PACKET RUNNING

```
TODAY: 20 spendable · 13 promised and unbuilt · 0 idle files
```

Unchanged from THE TWO BUCKETS, which was itself the third packet without a surfacing.
The cadence says the shelf must not grow two packets running; **it has now not shrunk
for four.** This packet is an instrument rather than a wing, which is the exemption the
rule already allows for — and recording the number anyway is the entire point of the
rule, because the exemption is what makes it easy to never spend one.

---

## 9. WHAT THIS ROUND LEAVES OPEN

| id | what | who |
|---|---|---|
| **X-1** | The porch box arrives a week before the PACKAGE window opens. Three ways out, all his; the third (rule that an unlabelled box is not a package) is the cheapest and Ops will not take it on an inference. | Mike |
| **K-b** | Still `IN PROGRESS`. **There is still nothing in either repository authored by Mike** — but for the first time there is somewhere for it to go, and it survives a reload. The instrument is built; the content is his. | Mike |
| **B-a** | Unmoved. No asset carries a bucket, so week two's reveal day cannot be planned against a number. Restated as X-5, at the point where it bites. | Mike |
