# 2a — THE REGISTER, RECONCILED

**Read-only. `docs/OPEN_ACTIONS.md` was not edited.** This is the input to a
reconciliation packet, not the packet.

**Scope warning, up front:** the register is 340 lines / 172 rows and ~62,000
tokens. I did not read all of it. What follows is a **targeted** pass over the
rows today's commits could plausibly touch, plus every finding this session
produced. It is not an exhaustive audit and must not be filed as one. See
WHAT I COULD NOT DETERMINE.

---

## 0. TWO CORRECTIONS TO THE PACKET'S OWN PREMISE

**(a) There are FOUR commits dated 2026-08-11, and two of the five the packet
names are from 2026-08-10.**

| commit | date | subject |
|---|---|---|
| `dd367c7` | **2026-08-10** 19:38 | covers: hand-authored art for PORTAL, MGK-NIAC, MGK-VIIIp |
| `098d604` | **2026-08-10** 21:30 | record 001: Mike's dictation; date out of index rail |
| `28047ca` | 2026-08-11 12:38 | oldest-first, five transport marks, the deck restored |
| `0de3bf3` | 2026-08-11 14:35 | still on open then glide, deck under the headline, weekday back |
| `7a7bf42` | 2026-08-11 15:21 | deck holds its column; tighter body rhythm; Questions struck from all five FAQs |
| `7094713` | 2026-08-11 17:23 | **Job 1** — the index block carries whole; dateline struck; one control group |

**(b) `7094713` was committed during this session.** Mike ran the Job 1 commit
commands while Job 2 was being written; the working tree is clean and HEAD is
`7094713`. The reconciliation packet therefore has **four** commits to answer
for today, not three, and Job 1's own findings (§3 below) belong in it.

`OPEN_ACTIONS.md` was last written **2026-08-09 14:38** (commit `7528e6e`, the
Record-editor round). **Doctrine 14 has not been honoured for any of the six
commits above.**

---

## 1. ROWS CLOSED BY TODAY'S WORK

**None found.** Stated as a finding rather than as an absence.

The rows nearest to today's subject — `C10` (the Record's closed face has no
visual hook), `L-c` (004/005 have no headline), `E-a`, `E-b`, `A-b`, `S-e` — all
turn on something Mike has to supply, and none of today's four commits supplied
any of it. Today's work was furniture: order, controls, rhythm, the head block.
Furniture does not close a row that is waiting on a word.

`M22` (44 shipped assets with no verdict) is the one that moves mechanically, and
it moves the wrong way if at all — the covers round added two shipped assets. Not
today's commits.

## 2. ROWS NOW STALE

### C10 — two thirds of its own amendment describe deleted controls

The `[S2 2026-08-07]` amendment reads:

> "What DID change is that three controls started drawing for the first time —
> `RecordJump`'s NEWEST / OLDEST / UNREAD bar, the ‹ NEWER / OLDER › walk and the
> `2 of 2` count, all gated on `list.length > 1` and dead since M5."

Of those three:

- the **NEWEST / OLDEST / UNREAD bar** is deleted — `7094713`, on Mike's C1;
- the **‹ NEWER / OLDER › walk** is deleted — `28047ca`, replaced by the five
  transport marks;
- the **`2 of 2` count** survives (it now reads `1 of 6` and sits left of the
  foot transport group).

**The row's core claim is still TRUE** — the closed face still has no picture —
so this is an amendment to rewrite, not a row to close.

### C17 — the lint count is wrong and the register is the last place still saying so

> "**Four pre-existing lint errors** (`WbAdmin.jsx:18`, `Exhibit.jsx:88/191/517`)"

The measured baseline is **11 errors / 9 warnings**, verified twice this session.
`CLAUDE.md` already carries the correction and says the 4/6 figure "had been
wrong since at least v40". C17 is the surviving copy of the number CLAUDE.md
retired. The three `Exhibit.jsx` line numbers are also stale — that file has moved
by hundreds of lines across today's four commits.

Not caused by today's work; surfaced by it, because a session that trusts C17
reads eleven pre-existing errors as seven new ones.

### L-c — it quotes glass that no longer exists

> "On the glass their index rows read `004 20 AUG 26` and `005 21 AUG 26` and
> stop."

The date came out of the index rail in `098d604` and the weekday came back in
`0de3bf3`. Measured on the running page this session, those two rows now read
**`004` / `THU`** and **`005` / `FRI`**. The row's substance is untouched — they
still have no headline, and that is still Mike's to supply — but its quoted
evidence is a description of a rail that was changed the day before the row was
last edited.

### A-b — possibly stale, and one measurement settles it

The row states the body is at **1.40** against a 1.35 floor. `7a7bf42` is titled
*"tighter body rhythm"*. **I did not verify whether 1.40 still holds.** If that
commit moved the body's line-height, the row is asking Mike for a word about a
number that has already moved — which is the worst state for a row that asks him
to live with something before deciding.

## 3. FINDINGS WITH NO ROW

Eight. The first two are Job 1's own and are the ones a future session will trip
on.

| # | Finding | Owner |
|---|---|---|
| **1** | **`entryDateline()` in `src/lib/record-model.js` is dead code** — no caller anywhere in the repo after `7094713`. Kept deliberately on Mike's instruction ("do not delete the function without reporting it"). Without a row it sits forever and the next reader cannot tell kept-on-purpose from missed. | Code |
| **2** | **The payload-count badges do not carry into the opened record.** `.vp-fe-load` renders on the index row and not in `.vp-rec-openhead`. Mike's A says *everything* in the index row carries; this is the one thing that does not. **Invisible today** — `evidenceOf()` returns empty for every entry written — so it costs nothing now and diverges silently at the first entry with a payload. | Mike |
| **3** | **17 stale rows in `provenance/register.json`** (`npm run provenance`). Does not fail the gate. Pruning needs the inbound-`r:` check done properly; four were pruned correctly in `7094713` and 17 remain. | Ops |
| **4** | **The robots repo holds 243.6 MB of uncommitted manual rebuild** and the "heavy media never in git" rule is unruled. This has **no row anywhere** and it is blocking the pages 58/59 fix. Full detail in `2d_manual-pages-58-59.md`. | **Mike** |
| **5** | **`robots.js:1761-1764` says `viiip.png` is "the tenth tile of this album's own Image Archive".** It is in neither of the two archive sets — both use `viiip-v2.png`. Detail in `2b_stale-viiip-fields.md`. | Ops |
| **6** | **Asset-table row `A-d1ce909419` carries a false `what` and `revealArc: "online"`** on a file nothing renders. Ops-owned by Mike's ruling; detail in `2b`. | Ops |
| **7** | **`RecordJump` renders nothing and is kept for the keyboard alone** (Escape, ← →, Home, End). Documented in the component, but its name now describes a bar that does not exist. Deliberate; worth a row so it is not "cleaned up" by someone reading only the name. | Code |
| **8** | **`.vp-rec-head` / `.vp-rec-title` now serve only the short (non-`sections`) entry path**, and the Record currently contains no short entry. Live CSS and a live JSX branch exercised by nothing — the same shape as `C7` and `C29`. | Code |

Findings 1, 2, 7 and 8 are all from `7094713` and all four are stated in that
commit's own code comments; they need rows so they are not only in the code.

---

## WHAT I COULD NOT DETERMINE

- **Whether any row outside the ~15 I examined is closed or stale.** I read the
  short list (rows 1–66), the `C`-series controls block and nine named rows. The
  other ~150 rows I have only as an inventory of IDs. **A complete
  reconciliation still has to be run**, and it needs a session that can hold the
  whole file — this pass was bounded by context, not by judgement.
- **Whether `A-b`'s 1.40 still holds** after `7a7bf42`. One measurement of the
  Record body's computed `line-height` settles it and I did not take it.
- **Whether `M58` and `M65` moved.** Both are about the robots FAQ and the wing's
  opening face; `0de3bf3` says "FAQ ruled" and `7a7bf42` struck "Questions" from
  all five FAQs. I confirmed the "Questions" strike reaches every face (see `2c`)
  but did **not** establish whether either commit touched the START row or the
  landing order those two rows are about.
- **What `dd367c7` and `098d604` closed or staled.** They are yesterday's and the
  packet named them as today's; I scoped them out once the dates were established
  rather than half-doing them. `L-d` (the descender) was raised by `dd367c7` and
  is open and correct.
- **Whether the four Job 1 findings should be rows or CLAUDE.md paragraphs.**
  Doctrine 24 says a closed row leaves; these are open notes about deliberate
  states, which is the shape `M84` was moved out of the register for.

## WHAT NEEDS MIKE

**One thing, and it is not in this register yet: the heavy-media ruling** (finding
4). 243.6 MB is sitting uncommitted in the robots repo and the pages 58/59 fix
cannot land until he rules. It is the only item in this report that blocks work.

**One thing that is his but is not urgent:** finding 2 — whether the payload-count
badges should carry into the opened record. Invisible today; the first entry with
an attachment makes it visible.

Everything else here is Ops' or Code's, and the reconciliation packet itself
needs no ruling — only a session with room to read the whole file.
