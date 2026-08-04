# PROVENANCE — WHAT NEEDS A RULING

**2026-08-04. Companion to `docs/MUSEUM_PROVENANCE_LOG-20260804.md`.**

Five items. Each is on the glass today. **Nothing here was changed** — Doctrine 12
says Ops asks; it does not say Ops fixes and mentions it afterwards. Answer them
one at a time, in any order. None of them blocks anything.

Format is the one-question format: WHAT IS KNOWN · WHAT IS MISSING · WHY IT MATTERS.

---

## R1 — The unit count says a different number than its own source

**WHAT IS KNOWN.** `/robots` prints **thirty-one and a half** in two places: the
front desk's tally card (`31½` set at 132pt, under it *"UNITS ON THE RECORD"* and
*"The fraction is not a typo."*) and the FAQ answer *"Thirty-one and a half. The
fraction is not a typo and we are not going to explain it."*

The robots repo's own words draft says **thirty-one point four**:

> *"There are thirty-one point four of them somewhere. We do not have all of
> them."* — `weird-baby-robots/docs/WBR_WORDS_DRAFT.md:185`

and beside it, a marker reserving the fraction deliberately:

> **Q. What's the .4?** — *[PAPA] — the Pi thread is RESERVED: "no breadcrumbs
> until a story worthy of it."*

`robots.js`'s own header lists the claim it inherited as **"the 31.4"**
(line 107), in a paragraph whose stated rule for that round was *"not one new
fact."*

**WHAT IS MISSING.** Which number is the museum's. Nobody supplied a half.

**WHY IT MATTERS.** `.4` is 31.4 ≈ π×10 and the robots repo is holding it back
for a story. `½` is a different joke and it forecloses that one. Two houses
currently print two different counts of the same machines, and the museum's is
the one a visitor reads.

*Either answer is one edit. `31.4` restores the source and the reserved thread;
`31½` is fine too, and then the robots repo gets corrected to match.*

---

## R2 — The machine's own glass is printed backwards

**WHAT IS KNOWN.** `public/robots/reference/photos/front_screen.png` is one of
the nine plates on the MGK-VIIIp plate wall, captioned *"The front glass, lit"*.
The screen in it is **mirror-reversed** — it reads right-to-left:

```
-(A)BEAL MGK-VIIIp )-
Please Select:
MGK-VIIIp
```

Confirmed at full resolution, not an artefact of how it was inspected.

**WHAT IS MISSING.** Whether to flip the file or replace the plate.

**WHY IT MATTERS.** This wing's argument is that the machine still runs and
still says things. The one plate that shows it *saying something* shows it
saying it backwards. No sweep in the museum's history could see this, because
the words are pixels.

---

## R3 — The artist portrait carries another band's name

**WHAT IS KNOWN.** `/images/wal/hunter-root-plate.jpg` is the portrait `/wal`
uses to introduce Hunter Root — cropped from `MV-HR-20260405-037`, the museum's
own vault, per STATE.md v41/C4. The subject's shirt reads **CHET VINCENT AND THE
MUSIC INDUSTRY** across the chest, prominent and legible. Nothing on the page
mentions it.

**WHAT IS MISSING.** Keep it, crop tighter, or use a different frame.

**WHY IT MATTERS.** The wing's whole posture is that every door goes to the
artist whose room it is. The introduction picture currently advertises somebody
else, silently.

---

## R4 — The manual's plate is a render, not a photograph

**WHAT IS KNOWN.** `/robots/manual/working-copy-p1.png` is the still on The
Manual's face, captioned *"The working copy, printed with PRELIMINARY — NOT FOR
DISTRIBUTION across it."* It is clean digital type on white. B8's ruling for
that face is that **the printed page is the SOURCE and the photograph of the
print is the plate**, and the face's own reel note says *"A plate here is a
photograph of the printed sheet, edges and margins included."*

**WHAT IS MISSING.** Whether the still is meant to be the render (the source,
shown as the source) or is standing in for a photograph that has not been taken.

**WHY IT MATTERS.** If it is standing in, it is a placeholder in the one place
the face says a placeholder cannot be — and the corollary is *empty and honest
beats populated and false.*

---

## R5 — Two dead rooms are still carrying words

Not a question about truth; a question about whether they stay.

**WHAT IS KNOWN.** The provenance sweep reports which modules `src/main.jsx`
does not reach. Two carry content:

- **`src/routes/hr/hr_facts.js` — 124 strings.** Retired from the live path (the
  facts now come from `hunter_root.facts.json`). Its own header carries three
  BACKLOG lines: *"Verify 'Covert Concert Series' references"*, *"Verify Town Rat
  Heathen 'three versions' claim"*, *"Verify 'crossed a million views in the weeks
  after' velocity"* — three claims the file itself says were never verified.
- **`src/data/hr_journal_prompts.js` — 30 strings.** The `/hr` journal tab is
  filtered out and `submitEntry` writes to component state only (v46/C4).

**WHAT IS MISSING.** Delete, or keep and declare why.

**WHY IT MATTERS.** They are one `import` line from the glass, and three of the
124 are flagged-unverified claims about a real musician. They are in the register
today with that flag recorded, so nothing is hidden — but the corollary says a
thing that cannot stand is removed rather than left standing, and this is Mike's
call, not Ops'.
