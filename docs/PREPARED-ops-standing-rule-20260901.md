<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# PREPARED — the standing rule of 2026-09-01, and why it is not in the manual

> **NOT APPLIED. `docs/canonical/OPERATIONS.md` IS UNCHANGED BY THIS FILE.**
> The rule below was written to land in §0 and **it does not fit.** This is the
> text, complete, so the next round lands it rather than rewrites it.

**Written:** 2026-09-01. **Author:** Ops. **The rule is Ops' own**, from this
session, and it governs Ops.

---

## THE ARITHMETIC, MEASURED

| | bytes |
|---|---|
| `docs/canonical/OPERATIONS.md` on disk, 2026-09-01 | **39,357** |
| the ceiling `tools/ops-size-gate.mjs` enforces | **40,000** |
| headroom | **643** |
| the rule below, as written | **714** |
| the file it would make | **40,071 — over by 71** |

**IT IS NOT A ROUNDING AND IT IS NOT FIXED BY TIGHTER PROSE.** 643 bytes is
about eight lines. A version that fits would have to drop either the cost
sentence or the paired rule, and **the cost sentence is the whole reason the
rule exists** — the rule without it reads as a preference.

**AND SQUEEZING TO 39,999 WOULD BE WORSE THAN NOT LANDING IT.** It leaves the
manual one byte of headroom, so the next round that adds a sentence fails a
gate it did not touch. **The remedy the gate itself prints is the real one:**
cut the oldest complete section to `docs/canonical/OPERATIONS_ARCHIVE/`, leave
its heading and a pointer behind, then run `npm run ops:archive`. **That is a
section-sized decision and it was not in this packet's scope**, so it was not
taken.

**The instruction was explicit: watch the ceiling, and if it would breach, say
so and stop.** It breaches. This is the saying-so, and the stop.

---

## THE TEXT, TO GO IN §0 — verbatim, ready to land

```
### OPS DOES NOT BRING MIKE A DECISION WHOSE ANSWER IS DETERMINED

**If the facts settle it, Ops settles it and reports what it did.**

**A question with one answer is not a question.** It is Ops making Mike do Ops'
work, and **it costs more than the time** — because he will answer it as if it
were open, and start making new decisions where none were needed.

**The cost, measured: twice in one session** — the site description and the
lobby note. **Both were already ruled. Both were asked anyway.**

**AND ITS PAIR.** When Ops HAS ruled something that touches what Mike sees, it
goes **at the top of the message, on its own line, flagged as Ops' decision.**
Not buried where he has to find it by reading.
```

**WHERE IT GOES:** §0, and it belongs beside **HOW TO ASK MIKE A QUESTION** —
that heading already carries *&ldquo;do not ask about something already
ruled&rdquo;*, and this is the generalisation of it: **not merely already
ruled, but determined by facts Ops can read.**

---

## THE RULE IS IN FORCE REGARDLESS OF WHERE IT IS FILED

**It governed this session before it was written down.** The packet that
produced this file asked for a fifth register row saying *nothing checks a
plate against the source it was derived from*. **That row already existed** —
[R14](OPEN_ACTIONS.md#r14), raised 2026-08-31, in those words. The facts
settled it, so **Ops settled it**: R14 was amended with what is new today
rather than duplicated, and the decision was reported at the top of the
message. **That is the rule being kept, not described.**
