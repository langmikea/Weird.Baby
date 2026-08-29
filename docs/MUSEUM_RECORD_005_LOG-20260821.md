<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# RECORD 005 LANDED + THE QUEUE FILED — 2026-08-21

**Nothing is waiting on Mike. Deploy before 17:00: `npm run deploy:launch`.**

---

## RECORD 005 — his words, verified twice

**Headline `PORTAL CONNECTION ONLINE`**, replacing `GENERAL STATUS UPDATE`.
**002 and 004 still share the generic one and 005 does not** — his, deliberate,
and the reason is that a headline that differs is the cheapest signal a Record
has and this entry is the week's payoff. 24 characters against a 62 limit.

**DECK, EXECUTIVE SUMMARY and OTHER were already correct to the character** —
checked before touching anything. **Only the DETAILED REPORT changed**, from one
line to three.

**VERIFIED ON THE BUILT LAUNCH BUNDLE:** all five strings present exactly, each
as one literal. **And no earlier version survives** — the old single line, the
launch-controls line, `Error: Communications Parity Bias Setting Mismatch`, the
four-toggles line, the Manual-declines line, both `Currently, the system…` lines
and `{Mike to rewrite}` all return zero hits.

**VERIFIED ON THE PAGE:** `/robots/record`, entry 5 of 5, rendered line for line
as he wrote it.

**TWO THINGS FLAGGED AND NOT FIXED** (Doctrine 21): his first line says
*Portal* and his third says *The Portal*; `etc.` closes the second sentence with
the period doing double duty. Both are his, as typed. A round that tidies either
has broken the instruction that put them here.

**`{Mike to rewrite}` IS CLOSED.** The note in the source asked whether he would
rewrite the line before 17:00 on the 21st. He did. The comment records the
landing rather than being left standing as an open question about a section that
now has an answer.

---

## TWO FIRST APPEARANCES, FILED AS CANON RATHER THAN LOGGED

`docs/canon/06-PORTAL.md` **§10**, both marked **PUBLISHED**. Neither string
existed anywhere in either repo before this line — checked across both before
filing.

**§10.1 · THE UNIX-6x EMULATOR.** *"our UNIX-6x Emulator"* — and **the
possessive is the whole of what it establishes**: the 2026 side is running the
1965 software, rather than the 1965 machine having been repaired. **It agrees
with the FAQ and sharpens it** — *"the real firmware on shimmed hardware"* was
written before this line, and UNIX-6x is now the name of the shim. What UNIX-6x
*is*, who made it, whether it is period or modern: **not established, not to be
invented.**

**§10.2 · THE COMM PAYLOAD AND AUTOSYNC.** The first thing in the corpus that
says **the Portal talks outward by itself**. It lands beside two published
things — the manual's bi-directional CNC Vid-Link, and Record 004's *"Unsafe to
run in any sandbox; permanently quarantined."* **The museum put it in a sandbox;
it carried its own sync.** Recorded as an adjacency, not as a finding: 005 does
not draw that conclusion and neither does the canon. **`etc.` is his and is
load-bearing** — it says there was more in the payload without naming any of it.

---

## THE ANT / CAB CORRECTION — Ops inferred it backwards

**MIKE RULED IT: `ANT` IS TELEVISION — the aerial pulls it out of the air — and
`CAB` IS HARDWIRED AND CARRIES THE MGK UNITS.** Ops had filed the opposite.

**THE INFERENCE IS KEPT, NAMED, BECAUSE IT WAS REASONABLE AND WRONG.** It ran:
the panel's legend is ANTENNA; QC_101 is headed `ANTENNA FEED ASSIGNMENT` and
reads `BROADCASTS ON ......... FEED NO. 3`; therefore the unit is on the aerial.
**What it missed is the more ordinary reading of a 1965 set** — an aerial is how
television arrives, and a machine in the same room is wired to the back of the
thing. `ANTENNA FEED ASSIGNMENT` names the panel the form describes, not the
side the unit is on.

**THE LESSON WORTH THE LINE:** three plausible readings chained into a confident
answer with no measurement under any link. **It was filed as a reading rather
than as canon, and that is the only reason it cost one line to correct.**

Corrected in `06-PORTAL.md` §9.3, `07-MANUAL.md` §5b and `INDEX.md`.

---

## THE QUEUE — fifteen items, out of conversation and into `docs/BACKLOG.md`

Filed under **THE QUEUE — filed 2026-08-21**, each with what is known about it.
It is not ranked against Mike's 08-16 order; it is the carried queue, listed,
with his rulings on the rows that have them.

The clean-up is **one item** because it is one pass and every part of it is
visible to a visitor today. The cover in item 2 and the sequencing constraint in
item 6 are both his rulings and are marked as such.

**ONE ITEM CAME BACK DIAGNOSED AND FIXED.** *The FEED stepper does not step in
the mock* — **it steps.** Measured: PATCHED → COLD START → FIRST RUN → LAST
STATE, both handlers bound, the up arrow going back. **What did not change is
the only thing the eye was on:** every bank in the volume is `NIAC/VIIIp`, so
the big lit top line was identical in all five states and the only thing moving
was an 11px dim sub-line. A readout whose prominent half never changes reports
nothing. The state line is lit now.

**IT WAS THE UNPAID HALF OF AN EARLIER FIX.** Splitting
`NIAC/VIIIp · TEST BENCH` onto two lines is what stopped it clipping; leaving
the second line a whisper is what made the split look broken.

---

## GATES

lint **9/8 = baseline** · build green · **launch build green** · provenance
**PASS** (2 rows added, 1 stale row pruned in place) · `reveal:check` **PASS** ·
`parity:gate` **PASS** · `instory:gate` **PASS** · `docs:numbers` **PASS** ·
`reveal:day` **nothing to move** · `assets:orphans` **13, unchanged**.
