# TIGHTEN THE RECORD — round log, 2026-08-08

**Five instructions (T1–T5). All answered.** The largest finding is that **the
leading was the smallest of the four costs he named** — and he named that
possibility himself.

Gates: lint **11/9 = baseline** · build **green** · `provenance:gate` **PASS** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
`instory:gate` **PASS** · `assets:orphans` **0** · `reveal:day` **nothing to
move** · **the lap RAN at 390px and 1228px** on five routes, page overflow 0,
uncontained past the edge 0, console errors 0.

---

## §1 — T1: THE TYPEWRITER STAYS

*"KEEP THE TYPEWRITER (Courier Prime) on the dateline, the stamp and the mark
rail. Those are the machine's own marks, not the writer's words."* No code
changed — that was already the state. `A-a`'s first half closes with his
reasoning recorded beside the rules, which is the part worth keeping: **the
Record's register governs the WRITER'S WORDS; the machine's own marks are a
different voice and keep the 1960s face.**

---

## §2 — T3: WHERE THE WIN ACTUALLY WAS

He asked for tighter leading and gave the escape hatch: *if leading is already at
its floor and the remaining win is in the margins, say so and take it out of the
margins instead.* **Both, and the margins were most of it.**

**Leading: 1.45 → 1.40.** Measured at 1228px, 22.32px → 21.55px, **−3.4%**.

**The readable floor for this face at this size on this measure is 1.35, and the
reason is the measure rather than the face.** The body is 68 characters — R4's
own number, chosen because 65–75 is the band a reader is comfortable in. A long
line is returned to by the eye travelling back along the leading, and the longer
the line the more leading it needs to find the next one; the same 1.30 that is
comfortable at 45 characters loses the return at 68. **1.40 leaves a margin above
the floor rather than sitting on it.** The remaining 0.05 is real and available —
it is worth about 3.5% of the body's height — and it is one number if he wants
it after living with this.

**And it is the smallest of the four costs.** −3.4% of leading against −56% of
the two section gaps. If the leading had been the whole answer this round would
have delivered a twentieth of what it did.

---

## §3 — T2: THE WASTED WHITE SPACE, ALL FOUR, IN HIS ORDER

The Record now has **its own rhythm ladder** rather than the house's. R1's
`--rh-tight/-block/-sect/-end` are declared on `.vp-face` and pace **every** flat
face — /wal, /foundation and the rest — so tightening them would retune four
wings to answer a complaint about one. Four new steps, Record-only, inert
everywhere else:

```
--rec-hug   0.30 x face-fs   a heading and the thing it labels
--rec-para  0.40 x face-fs   one paragraph to the next
--rec-block 0.55 x face-fs   between kin — the lead, an attachment row
--rec-sect  1.15 x face-fs   A NEW SECTION BEGINS      (was 2.60)
```

**The ratios are the point, exactly as R1 said of the house ladder.** A heading
hugs its own text nearly four times closer than it sits from the section above
it — which is what lets a tight document still scan by its headings. **Air goes
above a heading, never below.**

| his order | what it was | what it is | change |
|---|---|---|---|
| 1. dateline rule → headline | 26.07px | **18.22px** | **−30%** (head padding 10 → 6, margin `--rh-tight` → `--rec-hug`) |
| 2. headline → EXECUTIVE SUMMARY | 40.03px | **17.70px** | **−56%** (`--rh-sect` 2.6 → `--rec-sect` 1.15) |
| 3. paragraph to paragraph | 8.46px | **6.16px** | **−27%** (`--rh-tight` → `--rec-para`) |
| 4a. above every section heading | 40.02px | **17.70px** | **−56%** |
| 4b. below every section heading | 10.70px | **6.54px** | **−39%** (`--rh-tight` → `--rec-hug`) |

Also taken, unnamed but the same money: the endmark and the walk (14px → 10px),
the attachment block's own spacing, and the lead's margin.

---

## §4 — T4: THE TABLE

**Measured as a paired A/B in ONE page load** — the old values injected as a
stylesheet, snapshot, removed, snapshot — because run-to-run wrap noise had made
one earlier before-figure wrong by a whole line (126.73px against 110.68px for
the same build). Same document, same fonts, same width; only the rules differ.

### At 1228px

| | before | after | change |
|---|---|---|---|
| line-height | 22.323px | **21.553px** | −3.4% |
| **characters per line** | **70.8** | **70.8** | unchanged |
| lines of body per screen | 40 | **41** | +2.5% |
| whole opened entry | 681.23px | **578.85px** | **−15.0%** |
| index row | 88.60px | **87.06px** | −1.7% |
| **dateline top → first line of the executive summary** | **126.62px** | **92.27px** | **−27.1%** |

### At 390px

| | before | after | change |
|---|---|---|---|
| line-height | 22.244px | **21.477px** | −3.4% |
| **characters per line** | **40.4** | **40.4** | unchanged |
| lines of body per screen | 40 | **41** | +2.5% |
| whole opened entry | 879.13px | **770.25px** | **−12.4%** |
| index rows (013 / 001) | 147.96 / 110.68 | **144.90 / 108.38** | −2.1% / −2.1% |
| **dateline top → first line** | **126.02px** | **91.79px** | **−27.2%** |

**The number he can feel is the last one: a third of the distance between the
dateline and the first word of the report is gone**, at both widths. Cumulative
against the start of yesterday: that distance was 126.6px before this round and
the entry was 720px at the top of the previous one; it is 92.3px and 578.9px now
— **the opened entry is 20% shorter than it was two rounds ago and the head is
27% tighter.**

**Characters per line did not move, at either width, in either round.** 68ch is
68 characters whatever the leading; the measure R4 argued for is untouched.

---

## §5 — T5: THE PREVIEW STILL MATCHES EXACTLY

Same browser window (1228), museum as a top-level document on the built bundle,
preview as the worksheet's full-window frame:

| | live `/robots` | preview |
|---|---|---|
| `100vw` / `100cqh` | 1213.8 / 583.36 | 1213.8 / 583.36 |
| `.vp-flat` width | 838.66px | 838.66px |
| body size / leading / measure | 15.4031 / 21.5644 / 582.463px | identical |
| section label size / margin-bottom | 13.0927 / 4.62094px | identical |
| headline size / margin-top | 18.3297 / 4.62094px | identical |
| `.vp-rec-sects` margin-top | 17.7136px | identical |
| section → section | 17.7136px | identical |
| paragraph → paragraph | 6.16125px | identical |
| **dateline → first line** | **92.27px** | **92.30px** |

The 0.03px is sub-pixel rounding of the same layout, not a difference in it.

---

## §6 — THE NEIGHBOURS, PROVED AGAIN

The Record's ladder is four new variables and eleven Record-scoped rules; **R1's
own ladder is untouched and still paces every other flat block.** Verified in the
live document by injecting two bare paragraphs into a `.vp-flat` container:

```
house flat gap  .vp-flat > * + *   15.3408px   ( = --rh-block, 1.0 x face-fs )
.vp-fe-line outside a Record index  Fraunces, 25.28px leading
```

Neither moved.

---

## §7 — WHAT WAS NOT DONE

- **Nothing was deployed.**
- **Leading did not go to 1.35.** The floor is stated rather than reached; 0.05
  is left in hand and is one number (`A-b`).
- **The 68ch measure was not narrowed.** Shorter lines would tolerate tighter
  leading, but R4 argued that number from the reading band and Mike has not
  asked for it. Changing it to buy leading would be trading a measured decision
  for an unmeasured one.
- **The index row barely moved (−1.7% / −2.1%)** and that is honest: the row is
  a title, a summary and the button's own padding, and the summary's leading was
  the only thing this round could reach. It is not where the airiness was.
- **Surfacing unmoved at 20 spendable — the tenth packet running.**
