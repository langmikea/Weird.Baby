# RELEASE — reels that exist and are not part of the museum's story

**Read this before touching `releases.json`.** It is written for the **next
Ops**, not for Mike. Ops does not persist between sessions; without this file
the next sit-down starts from nothing.

```
npm run release          the report — what is in the system
npm run release:check    the same, and exit 1 on any fault
```

| file | what it is |
|---|---|
| `release/releases.json` | the data — runs, releases, postings, outcomes |
| `release/release-shape.mjs` | the declared shape, the states, and the rules with their `enforcedBy` |
| `release/specs/` | what Ops hands Mike, one file per spec |
| `tools/release-gate.mjs` | the gate |

---

## THE THREE THINGS THIS HOLDS, AND NOTHING ELSE

**A RELEASE** — one video. The four surfaces are not four releases; the reels
are 9:16, which is what TikTok, Instagram Reels, YouTube Shorts and Facebook
Reels all want, so **one video goes to all four uncut** and `postings[]` is a
list inside it. **The surfaces are ordered and the order is ruled** — see THE
FOUR SURFACES below.

**AN OUTCOME** — views, and what was concluded. Lives inside a posting, because
the numbers are per-surface.

**A SPEC** — what Ops hands Mike. He makes and posts manually.

**There is no fourth object and the loop's memory is not one.** A sit-down
produces three things and each already has a home: what we concluded →
`outcome.concluded`; what we decided to do → the next spec; what we are waiting
to see → that spec's *watching* section.

**And it is deliberately not a handoff.** This project already built *notes for
the next session* — `docs/HANDOFF_next_session.md` — ruled that facts may not go
in it, and watched it rot: last touched 2026-08-23, ten rounds ago. Truth
ranking puts it below git log. Do not turn this into one.

---

## THE FOUR SURFACES, AND WHY THE ORDER IS THE ORDER

**Read this before planning a release.** The order is declared in
`release-shape.mjs` because a machine needs it; **the reason is here because a
data file is the wrong place to argue a position.** The two must not drift — if
you reorder the array, this section is what you are contradicting.

**THE FAILURE THIS EXISTS TO PREVENT: treating four surfaces as
interchangeable.** They are not four copies of one act. Each is doing a
different job, and a release planned as *post it everywhere* has no strategy in
it at all.

| | | why |
|---|---|---|
| **1** | **TikTok — THE DOOR** | **The only one built to show work to strangers.** Its algorithm surfaces content from small accounts to new audiences; an account with 200 followers can reach 100,000 people. Nothing else on this list does that. |
| **2** | **Instagram — THE BRAND** | Where the house looks like itself. |
| **3** | **YouTube — THE ARCHIVE** | **Content compounds.** A video from two years ago still drives streams. It is the only surface where an old post keeps working. |
| **4** | **Facebook — LAST** | It is there because he has an account. |

**THE DOOR AND THE ARCHIVE ARE THE TWO THAT EARN THEIR PLACE**, and they earn it
for opposite reasons — one reaches people who have never heard of the house, the
other keeps working long after it was posted. Instagram is the face; Facebook is
inventory. **A reel that only ever goes to YouTube is filed and not shown.**

**One video, 9:16, fits all four UNCUT.** So the cost of a fourth surface is a
posting event, not a re-edit — which is why four is affordable at all.

### The accounts — and one precondition

**THE TIKTOK ACCOUNT DOES NOT EXIST YET. Mike sets it up.** It is recorded as a
**precondition, not a task**: nothing here creates it, nothing should list it as
work, and no round should "action" it. **The gate refuses a TikTok posting that
claims to be `out`** while the account does not exist — a precondition nothing
checks is a wish. Planning or staging one is fine and is the honest state.

**Instagram is UNSTATED.** Mike has said YouTube and Facebook exist, as
Weird.Baby. He has said nothing either way about Instagram, and **Ops does not
infer it** — the gate refuses an `out` posting there too, for that reason and
with that wording.

### The handle, and where the dot goes

**Mike's preference order, his order:** `Weird.Baby` · `WeirdBaby` · `weirdbaby`.

**TikTok does not permit a dot in a handle** — so his first preference is
unavailable on the surface he ruled first. **The resolution is not to drop the
dot but to move it:**

> **THE DOT LIVES IN THE NAME, NOT IN THE HANDLE.**
> Handle `WeirdBaby` or `weirdbaby`, **display name `Weird.Baby`.**

**No handle has been supplied for any platform** — register
[`M60`](../docs/OPEN_ACTIONS.md#m60), open since 2026-08-05 — and **a handle is
not something Ops may invent.** What is recorded here is what he PREFERS and
what is POSSIBLE, which are not the same thing on one of the four.

---

## THE CANON LINE

**The Record is canon — the story. A reel is promotion ABOUT the story.** The
line is one-directional:

- **STORY → RELEASE is ALLOWED.** A caption may quote the museum. The run's
  `promotes` pointer names a museum video by the museum's own id. **The museum
  learns nothing from either** — it gains no field, no import, and does not know
  this directory exists.
- **RELEASE → STORY is FORBIDDEN.** No release string, id or platform ref may
  appear under `src/` or in the built bundle.

**It is a gate, not a convention** (Mike's ruling, 2026-08-28), and it does not
trust this directory's opinion of itself. `reveal/reachability.mjs`'s doctrine,
which this follows: *nothing here reads a row's opinion of itself except to
contradict it.*

### Why a separate directory proves nothing on its own

`reveal/` is also a root directory — and `src/` imports from it **five times,
JSON included**:

```
src/lib/placement.js:26 · src/lib/record-clock.js:31 · src/lib/reveal.js:44
src/routes/WbHome.jsx:27 · src/worker.js:73
```

**So placement buys legibility and nothing else.** The gate is the whole of the
enforcement.

### `RESTATED` is what makes the gate possible

A caption that quotes the museum has its string under `src/` **on purpose**, and
a gate matching raw strings would fail the build on correct work. So the gate
matches only what a release declares as **its own**, and a quotation is exempt
**by carrying a pointer at the museum row it came from, which the gate
resolves.** Exempt by evidence, never by permission.

**The first run of this gate proved the point by failing.** The run id
`coconuts` is the *museum's* track id in `weird-baby.js`, written there long
before this directory existed, and the gate reported the museum for carrying its
own word. It is exempt now — and the exemption is checked: the run id must equal
`promotes.track`, and that track must really be in the museum's source.

---

## DOC CONTROL — THE MUSEUM'S, NOT A SECOND DISCIPLINE

Mike's ruling: *use Doc Control as the Museum has it.* So:

- **Every authored string carries its class** — `MIKE` · `VERIFIED` · `DERIVED`
  · `HOUSE` · `RESTATED`, the same five `provenance/register.json` uses, meaning
  the same things. **A number read off a platform is `VERIFIED`.** Mike's
  conclusion is `MIKE`. Ops' conclusion is `HOUSE`.
- **Selecting an option Ops wrote is `HOUSE`, not `MIKE`.** Approval is not
  authorship — the museum has already ruled this twice, on Record 001's index
  line and on the QC_101 title.
- **His words are verbatim.** Typos carried. Do not join his lines, do not
  correct his casing.
- **FLAG, NEVER FIX.** When his words go stale, say so and leave them.
- **A fact is filed where the fact belongs**, not only in a round log.

---

## THE RULES A READER WILL BE TEMPTED TO BREAK

**1. ABSENCE IS THE MECHANISM. THERE IS NO ZERO.**
Mike: *a post without numbers reads as "not yet checked", never as zero; a field
nobody fills is worse than no field.* So `outcome` is **absent** until there is
something in it — no empty object, no empty array, no `null`, no `views: 0`
placeholder. **`views: 0` therefore means a real zero that somebody read**,
which is a different and useful fact. Anything that prints a release prints
*not yet checked* and must never print `0`.

**2. A READING'S `on` IS THE DAY THE NUMBER WAS READ.**
Never the day it was typed in. No gate can tell one date from another, which is
why this is written here — it is one of two rules in `release-shape.mjs` marked
`silent: true`. OPERATIONS §8: *any tool that stamps `saved` at the moment of
saving is answering a question nobody asked it.*

**3. THERE IS NO DUE DATE. ANYWHERE.**
Mike, 2026-08-28: *We are not going to work backwards.* `posted` is the day it
**went**. The gate refuses a `due` key on a release or a posting. **A calendar
is the thing this design most wants to grow back into**, and the museum has a
working, admired, date-driven pipeline (`RECORD_EPOCH`, `recordDay()`,
`reveal:day`) sitting one import away. Reusing it here would reintroduce exactly
what he ruled out.

**4. NOTHING COMPUTES A NUMBER FROM TWO READINGS.**
No rate, no total, no average, no best-performing, no comparison between
surfaces, no chart. Mike: *not as a rigid set of specific metrics.* **A reading
is evidence for a conversation, never a score.** The other `silent: true` rule.

**5. THE SEQUENCE IS REAL.**
The four quarters go in order — 1, 2, 3, 4 — and **2 cannot precede 1**. The
gate refuses a release going public while a lower `seq` in the same run has not.
A number nothing enforces is a label.

**6. `coconuts-full` IS UNDECIDED AND MUST STAY THAT WAY UNTIL MIKE SAYS.**
Asked where the full reel goes, he said: *"I don't know. I had it, so I included
it."* Ops ruled it stays **UNDECIDED** — a release the system holds with no slot
rather than forcing a position. **DO NOT GUESS WHERE IT GOES.** It is the
sit-down's own first question once the quarters have run, and a later round that
gives it a number to tidy the list has answered a question he deliberately left
open.

**7. THIS DOES NOT BECOME A MUSEUM SURFACE.**
Mike: *this is not "a museum tool", at least not by my decree.* No page, no
wing, no place in the site. **The pull arrives at about fifteen rows**, when
reading JSON stops being pleasant and the day editor is sitting right there.

**8. IT DOES NOT GROW A SECOND CATALOGUE.**
A release names a museum asset by **uid** when one exists and never re-describes
it. No bytes, no dimensions, no sha256, no `usedBy`. The day this file carries a
field the asset table owns, it has become the thing `tools/dictation/shelf.mjs`
warns about in its own header.

**9. IT DOES NOT REACH FOR AN API.**
Every number is typed. When that becomes tedious, the YouTube Data API is the
obvious fix and it drags OAuth, tokens, a secret store and a scheduled job
behind it. **The tedium is the cost of Mike's ruling, not a defect in it.**

---

## WHAT IS IN THE SYSTEM TODAY, AND WHAT IT IS WAITING FOR

**Five Coconuts videos, uploaded and PRIVATE — nothing has gone out.** So the
first thing in this system is a **plan**, not a record of history. Four are
sequenced; `coconuts-full` is UNDECIDED.

**All five carry `ref: null`.** The videos are on YouTube and their addresses
have not been supplied. `release:check` counts them under **WITHHELD** rather
than leaving a silent blank — *a silent filter is indistinguishable from a bug.*
**Ops does not invent a platform id.**

**TikTok, Instagram and Facebook carry no posting at all yet** — not `planned`,
absent. Nothing exists on any of the three and nothing has been decided about
when it will. **Every one of the five releases is YouTube-only today**, which by
the order above means the whole run currently reaches nobody who has not already
found the house: **the door is not open.**

**And no handle is known for any of the four accounts.** Register row
[`M60`](../docs/OPEN_ACTIONS.md#m60), open since 2026-08-05, and the site still
carries Mike's own *"Follow us on social media"* with nothing behind it.

## THE RUN AFTER THIS ONE

**Coconuts is a single. E.D. Yahdah is the next single.** How Coconuts does
informs how E.D. Yahdah is released — that is the forward-moving loop, and it is
the reason `outcome` exists at all.

**E.D. Yahdah already exists in the museum before it exists as a single**: its
video landed 2026-08-26 at `6c80c1c`. **The system should know that, and the
mechanism is already here and needs nothing new** — a run's `promotes` block
points INTO the museum by the museum's own id, in the allowed direction. Coconuts
carries one today and E.D. Yahdah's will be identical in shape.
