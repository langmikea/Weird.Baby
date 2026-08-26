# THE MARKING INVERTS — a read record is dimmed, and the left rule is struck
2026-08-26 · third packet of the day · built and verified served · nothing committed, nothing deployed

## WHAT NEEDS MIKE

**Nothing blocks it.** One thing is offered rather than decided: **the dim is at
the palette's own AA floor, `.86`, and a stronger one is available but is his
call** — see §2.3.

Gates: lint **9 / 7 = baseline** · build green · launch build green ·
provenance **PASS** · `reveal:check` · `parity:gate` · `instory:gate` ·
`docs:numbers:gate` **PASS** · `reveal:day` nothing to move · `assets:orphans`
**13, unchanged** · `lap:clean` done.

---

## 1 · THE TV — CLOSED, AND IT WAS OPS'

Both Browser pane tabs closed (**sound first**, since the audio streamed direct
from `youtube-nocookie.com` and killing the server would not have touched it),
then the server tree stopped. Verified after:

```
PID 5068  npm run dev      gone
PID 2116  vite  :5173      gone
PID 11168 workerd          gone
```

**Left alone, as instructed and because they are not Ops':**

| PID | port | what |
|---|---|---|
| 1908 | 8899 | `tools/dictation/record-serve.mjs` — the Record day editor |
| 19972 | 8955 | `servedist.mjs … dist/client` — **stale, from an earlier Claude session** (`1511bcc1…`) |

**FOR MIKE:** the 8955 one is an orphan static server left by a previous
session. Nothing depends on it and it makes no sound; clear it whenever with
`taskkill /PID 19972 /F`.

---

## 2 · THE UNREAD RULE IS STRUCK AND THE MARKING INVERTS

### 2.1 · What it was, and that it was never this week's work

`.vp-rec-row--unread > .vp-rec-open::before` — a 2px bar down the left edge of
every UNREAD row. Added **2026-08-05 in `8fe959f`**, its only commit; nothing in
the unread path has been touched since 2026-08-19. **It was always there and
only became visible when the read state reset** — most likely because the dev
server Ops left running is a *different origin* from `weird.baby`, and the read
set lives in `localStorage` per origin.

### 2.2 · Why the flip is the better shape

**MIKE ruled B with a replacement: strike the rule, slightly dim the number and
day once read.**

**THE RULE MARKED THE WRONG STATE, AND THE COST LANDED ON THE VISITOR WHO
MATTERS MOST.** A first-time reader has read nothing, so every row is unread, so
every row grew a rule — a wall of them on the first thing they see. **The
marking was loudest exactly when it carried no information**, and it faded as it
started to mean something. Dimming READ rows inverts that: a clean register on
arrival, and marking that appears as they go.

**THE ORIGINAL COMMENT'S ARGUMENT SURVIVES THE FLIP AND IS KEPT WORD FOR WORD**
— *"a rule reads at a glance down a column of sixty without being counted"* was
about scanning sixty rows, and that is still the job. What changed is which
sixty are marked, and the answer is now *the ones behind you*.

### 2.3 · "Slightly", in real numbers — and the ground was nearly got wrong

**THE FIRST FIGURES WERE COMPUTED AGAINST A GROUND THAT IS NOT THERE, AND THE
PAGE CAUGHT IT.** `.vp-face` declares `background: var(--wb-ink)` #ece9e0, which
is the obvious answer. Walking up from a live row, the first non-transparent
ancestor is **`.vp-face-body`, `#faf8f3`** — the card ground, the lightest in
the museum; `.vp-flat` and `.vp-rec-index` between them are both transparent.

A ratio is a fact about two colours, and naming the wrong second one made every
figure wrong **in the safe direction**, which is the kind that does not announce
itself. Three grounds, same two inks:

```
                       on the mat   on --wb-ink   ON WHAT ACTUALLY PAINTS
  number  #57544d        5.15:1       6.22:1            7.12:1
  day     #5f5c53        4.56:1       5.50:1            6.30:1
```

**Measured in the browser, on the shipped row. `.86` is the floor:**

```
  opacity .86  ->  number 5.01:1  ·  day 4.53:1     both still AA
  opacity .85  ->  number 4.88:1  ·  day 4.46:1     the DAY drops under AA
  opacity .80  ->  number 4.33:1  ·  day 3.98:1     both AA-large only
```

**The day binds**, because it already sits on the museum's own quietest legible
text step. `--wb-gold-mute` was RAISED to `#5f5c53` specifically to clear 4.5:1
on this class of small mono — *"the type a visitor squints at hardest"* — and
`museum-tokens.css` records that at length. **Dimming past `.86` spends a
measured ruling from a round that is not this one**, which is the exact failure
that block warns about, so Ops did not spend it.

**FOR MIKE, IF `.86` IS TOO QUIET:** `.80` reads clearly and puts the day at
3.98:1. That is a real trade, not a tuning, and it is his.

### 2.4 · Why `read` is a second prop rather than `!unread`

`unread` is `list.length > 1 && isUnread(...)`, and **the first half is not about
the row at all** — it asks whether there is a register worth marking. The
dictation preview renders exactly one entry, so `unread` is false there for a
reason that has nothing to do with reading, and styling `:not(.vp-rec-row--unread)`
**would have dimmed the row Mike writes into.**

So the caller computes both against the same guard and the row prints what it is
told. **A row can be neither**, which is correct: one entry on its own is not
read and not unread, it is just the entry. `tools/dictation/preview/entry.jsx`
passes no `read`, so it stays undimmed by construction.

### 2.5 · Verified on the served page

Read state cleared, then record 002 opened, then back to the index:

```
  001   unread   left rule none   rail 1
  002   READ     left rule none   rail 0.86
  003   unread   left rule none   rail 1
  004   unread   left rule none   rail 1
  005   unread   left rule none   rail 1
```

**No left rule anywhere**, and the one row that was read is the one that dimmed.

---

## 3 · A STALE COMMENT CLEARED ON THE WAY PAST

`Exhibit.css` carried, directly **underneath the live rule it described**:

> *"[2026-08-10] `.vp-rec-mark-day` IS DELETED, not left dormant — …
> `RecordIndexRow.jsx` no longer emits the element."*

True when written (`098d604`, 2026-08-10) — and **C1 brought the weekday back the
next day** (`0de3bf3`, 2026-08-11), re-adding the rule *above* the comment
without touching it. `RecordIndexRow.jsx` has emitted `<i class="vp-rec-mark-day">`
ever since.

**The half that is still true is kept**: the DATE is out of the rail and stays
out — `17 AUG 26` needs 71.97px of Courier Prime against a 44px rail and wrapped
to three lines on every dated row. `MON` is three characters, which is why the
weekday could come back where the date could not.

**This is the third struck-fact-reading-as-live of the day** — after the
`1.24cqw` panel margin and the `no [X] on channel 4` note. Same class, three
sites: **a superseded statement left in place is indistinguishable from a
current one, and comments do not get gated.**
