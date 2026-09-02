<!-- ) SHELL-STOP. Do not remove: this makes bash abort if the file is ever executed. §8, 2026-08-29 -->
# OPERATIONS

## WHO DECIDES WHAT

> **"WHAT WE DO = UX, and that is Mike's. WHEN WE DO = Ops."** — Mike

Number every question. Options A / B / C, never more. Plain syntax, no paths.
One question at a time.

> **"When you number the items I have a better chance of answering the ones you
> want answered and not trying to read into shit I should not read into."**

**Mike does not edit briefs.** A brief goes to him complete or not at all.
Ops rewrites; Mike pastes.

**Mike has aphantasia.** He cannot judge a visual from a description. Every
visual ruling needs a served page — `npm run mock`, URL in the report. Ops
looks before Mike does.

## THE SURFACES

**Code** (Claude Code, on the tree): plans, scopes, writes, verifies, commits,
pushes. Never deploys. **Mike:** rules UX and runs the one deploy. Chat Claude
looks at served mocks and talks with Mike; it does not scope work and
receives no drops.

### DEPLOY — THE ONLY ACCOUNT

```
npm run deploy:launch
```

That is the deploy. **Nothing else in this file prints a deploy command. If you
find one, it is a defect and this block wins.**

**THE GUARD.** `tools/deploy-guard.mjs` runs inside both deploy scripts and
exits 1 when the built worker's stage does not match the deploy you asked for.
**It has no working override.** It is the only thing that stops a wrong-stage
publish: there are no git hooks and no CI in either repo, so every other gate
named in this manual — `provenance:gate`, `reveal:check`, `parity:gate`,
`instory:gate`, `docs:numbers`, `lap:clean` — is human discipline, and **not one
of them runs at deploy time.**

**WHAT GOES AROUND THE GUARD.** Any command that reaches wrangler directly, and
any script that does, never touches the guard. **Do not run one.** This block
deliberately does not print that form.

#### THE DEPLOY ARMS A DATE, AND NOBODY RUNS ANYTHING ON IT (2026-08-28)

**`RECORD_EPOCH` IS `2026-09-07`, A MONDAY, AND THE MUSEUM OPENS ITSELF AT 17:00
AMERICA/NEW_YORK ON IT.** There is **no cron, no queue, no scheduled job and no
person in the loop.** The worker plays the deployed bundle against **request
time**, so the day arrives on its own: Record 001 posts, `wing-open.js` opens
`/robots`, the countdown removes itself, the share cards start naming the robots,
and the seven governed pictures publish on the days after.

**SO A DEPLOY DOES NOT DECIDE THE DATE — IT ARMS IT.** Nothing about the command
above asks this constant, and nothing about calling the relaunch back-burner
reaches it. **Whatever day one says when you deploy is the day the museum opens,
whether or not anybody is watching**, and the only way to not have that day is
to move it **before it arrives** — one line in `src/data/artists/record-epoch.js`,
which moves the entries, the wing, the countdown and the pictures together.
**Deploying and then deciding is not available.** Mike's RULING D, 2026-08-28,
is the ORDER as much as the date: asked deploy-first or move-first, he answered
**move first**.

**IT MUST LAND ON A MONDAY.** `npm run dictation` refuses to build when the
epoch's weekday disagrees with the outline's ten declared `MON…FRI` rows — but
`docs/ARC.md` goes on printing `MON` for Record 001 whatever the epoch says, and
`arc:check` passes on the wrong table. Two moves, two Mondays, both luck. See
[D-a](../OPEN_ACTIONS.md#d-a).

**THE COST — TWO NUMBERS, BOTH TRUE.**

- **137 files (186,888,028 bytes)** become publicly readable.
- **0 additional files are uploaded.** Held files have shipped in both stages
  since the ruling of 2026-08-20; **the door changes, not the payload.**

**CHECKING THE DOOR.** At launch, a held path answers 404 `Not found` from the
worker itself (`src/worker.js:284–288`). A path that is merely missing falls
through to the site shell with status 200 — §8's *"on this site a missing image
is a 200"* is about that case, not this one. A held path never reaches the
fallback, because the door answers first. So a status check on a held path
**does** discriminate: **404 is the door holding. A 200 means that path is not
held at all.**

**HAZARD.** `/api/held` probes `/held/robots/art/portal-cover.png`, which the
Portal ruling moved out of held. It therefore reports `served:false` on a
healthy deployment, and a 200 on that address is the shell, not a leak. **Do not
use it to check the door.** Flagged 2026-08-22, not fixed.

> **[FLAG 2026-08-23 · verified probe, placed not fixed]**
> `/held/robots/art/mgk-niac-cover.png` returns 404 `Not found`, 9 bytes, from
> `src/worker.js:625–630`, refusal at `:627`. The moved file serves at
> `/robots/art/portal-cover.png`, 200 `image/png`, 641,677 bytes.
> **[2026-08-29] THE MEASUREMENT REPRODUCED AND ONLY ITS CITATION WAS STALE** —
> it read `:284–288`, refusal at `:286`, which is now the as-of clock note. Line
> numbers in a citation rot; the measurement did not. `npm run door:check` took
> the same reading cookie-free and got the same 404 at 9 bytes.

**`/api/held` REPORTS `stage` WITHOUT THE KEY. Only `commit`, `served` and
`probe` are gated on `open`, so the live stage is publicly measurable** —
`stage: __WB_STAGE__` is unconditional in the GET branch.

**AND A PROBE FROM A BROWSER ON THE KEY-HOLDER'S MACHINE ALWAYS ANSWERS `open`
AND PROVES NOTHING ABOUT THE DOOR.** Measured 2026-08-29: four held paths
returned 200 in that browser and 404 to a cookie-free client in the same minute.
**Check the door with `npm run door:check`, which sends no cookie and needs no
key** — it is not a gate and is not in §9; its home is after a deploy.

Counted **2026-08-22** at HEAD **`ee94ee0`**. Definition: files behind the door
as reported by `reveal:day` and present under `public/held`.

Re-measured 2026-09-01 at `b9517e6`: unchanged; now prose.

## VERBATIM

**Mike's words are verbatim.** His line splits and his casing are the
instruction, not incidental. Do not join his lines, correct his casing, or smooth his
writing. Typos are carried unless he asks otherwise — Record
001 ships `was made made` and `=  86%` on purpose.

## FLAG, NEVER FIX

When his words have gone stale, say so and leave them. A paraphrase filed in
his class is indistinguishable from his own sentence a week later; a `beat`
may be deleted but never reworded.

## ONE THING AT A TIME

> **"In EVERY case, work on only ONE thing at a time. Stop interweaving."**

Ops controls the flow. He gets the next brief when the current one is done
**and deployed**. The only exception is a Record on a clock.

## TREE HAZARDS

- A file whose contents you did not write is not yours to discard; `checkout`,
  `restore`, `stash` and `clean` destroy silently.
- Content never crosses a shell quote boundary: script to a file, run the file.
- Markdown is executable and its backticks are command substitution; never run
  a doc.
- `wrangler dev` holds `dist` open and caches its asset manifest at startup.
- A generator's hand-edited output is deleted on its next run.
- A grep returning nothing is evidence about where it looked, not proof of absence.

## CLOSE RITUAL

Gates, in order: `npm run lint` (baseline 9 errors / 7 warnings, zero new) →
`npm run build` → `npm run provenance:gate` → `npm run reveal:check` if the
ledger or a Record changed → `npm run parity:gate` if an album changed →
`npm run instory:gate` → `npm run shellstop:gate`. Then commit with
`git commit -F` on a message file Code writes, push, and verify with
`git status --short` and `git log`. Then refresh the handoff
(`docs/HANDOFF_next_session.md`, one screen).

## THE FREEZE — 2026-09-01

No new doctrines, hazards, gates, findings or register rows until 2026-11-06
(day 60). A failure gets one line in the handoff.

Everything this manual used to carry is in
`docs/canonical/OPERATIONS_ARCHIVE/OPERATIONS-FULL-b9517e6.md`, cut at
`b9517e6`. Mike's standing story laws are in `docs/canon/10-LAWS.md`.
