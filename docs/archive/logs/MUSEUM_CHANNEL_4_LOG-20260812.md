<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# CHANNEL 4, THE DELETES, AND THE LOADED COMMAND
2026-08-12 · write packet · **not committed, not pushed, not deployed**
HEAD at start: `1e45ae2`.

---

## THE ONE PRECONDITION THAT DIFFERED, AND THE RULING

The packet said *"install channel 4"*. **Channel 4 was already occupied** —
`idling-updated` / **STANDBY**, one of M33's five engraved reveal levers,
`arms: false`. Mike ruled: **repurpose in place.** The `id` is unchanged, so
`preset=idling-updated` still resolves in any twin URL, and P5's rule that no id
moved when the legends were recut is kept. STANDBY is off the drum.

The second question — whether the eight deletions should take the robots-repo
copies too — he handed back to Ops. **They did**, on A2's own reasoning: a
photograph deleted in one repo and kept in the other leaves the asset table
holding a row for a live file nobody references.

---

## A — RECORD 013

**Deleted whole**: entry `no: 13` plus its two comment blocks
(`robots-record.js` 298–394, 97 lines). `RECORD_ENTRY[13]`'s extras block in
`ledger-declare.mjs` went with it; `record.013` left `ledger.json` **by
derivation**, not by hand, because the rows are built from `recordEntries()`.

**`rear_power_switch.png` deleted at both addresses** — museum
`public/robots/reference/photos/` and `weird-baby-robots/reference/photos/`,
3,913,203 B each.

### THE CONSEQUENCE, AND IT IS NOT REPAIRED

`delivered()` is **the empty set**. 013 was the only entry that ever named a
picture, so **the pull-back rule has no positive case anywhere in the museum.**
`reveal:day` reads `public 1` — and that 1 is the wing's wordmark sleeve, which
is SIGNAGE, not a delivered picture.

**What is now untested, stated plainly:**

- the PLACE branch of `reveal:day` (delivered + still held → move out)
- the `isDelivered && isHeld` fault in `deliveryFaults()`
- `publicPlacements()`'s non-signage half — it returns signage only
- `placed()` resolving a *delivered* path in the launch stage

Everything else B2 worried about **is still exercised**, because Records 001–005
landed since it was written: `RecordEntry.jsx` mounts, the index budgets police
five headlines and five summaries, and the per-entry derivation loops over five
rows. B2's arithmetic was right and only half of it came due.

**It is not repaired here** because repairing it means an entry that delivers a
picture, and that is Mike's to write.

### The `placed` import, and a guard so it returns by itself

`placed` became unused (`no-unused-vars`) and was removed. `record:land --write`
splices only between `RECORD_ENTRIES = [` and `];`, so it could have emitted
`placed(...)` into a file with no import — **which parses**, passes every guard,
and throws `placed is not defined` on first render. **GUARD 7** in
`emit-record-entries.mjs` restores the import whenever the body it is about to
write contains a `placed(` call.

### A5 — the provenance cluster, verified before pruning

**13 rows exactly**, as the packet said: 8 RESTATED (every one with
`r: ["6e22f302cba44ce9"]`, the VERIFIED still-caption), 4 HOUSE, 1 VERIFIED.
**Zero inbound references from outside the cluster.** Pruned together.

---

## B — THE EIGHT DELETES

Nine photographs, thirteen file copies, 22.9 MB.

| file | copies |
|---|---|
| cabinet_whole · column_lit · core_helical · core_meltdown | museum only |
| front_full · monitor_base · unit_new_base | museum **and** robots repo |
| hunter-root-plate.jpg | museum only |
| rear_power_switch.png (A2) | museum **and** robots repo |

### The mainframe wall lost four of five, and the shape had to change

`placedPresets()` drops an emptied grouping by itself, so the deletions would
have left **two buttons over the same single tile**. Cutting to one preset is
worse and silently: `ArchiveWall` only takes the preset path at `length > 1`, and
a lone preset falls through to `archiveSpreads()`, **which reads
`spreads`/`collage` and has never read `presets`** — the wall would have found
nothing and printed *"No photograph of the mainframe is on the wall"* while
holding one. It is a `collage` of one now: draws, no strip, and `archiveEmpty`
becomes true rather than false if the last plate ever goes.

`viewerPoster` was `core_meltdown.jpg` → repointed to `output_row.jpg`, the only
survivor. Caption **RESTATED from the tile's own label**, not written fresh.

### The VIIIp wall kept its groupings

Nine photographs → five. `1 / 3 / 1 / 5`, self-consistent. Two groupings are down
to one tile and are kept — a grouping of one is still a true statement, and
`placedTiles` drops it the day its last picture goes.

### B3 — /wal

`plate` and `plateCaption` removed. `still: a.plate || undefined` draws nothing,
so **nothing hangs**. His card opens on the heading and prose — which is exactly
the condition **F1's VISUAL HOOK LAW** was written to fix. He is now the only one
of the four artists with no plate. The open row about the shirt reading another
band's name closes by subtraction.

---

## C — CHANNEL 4

Both files 3000×2400, 32-bit ARGB.

| file | placed at | role |
|---|---|---|
| `MGK-TWIN_MONITOR_CLOSE_UP.png` (2,369,280 B) | museum `public/held/robots/reference/photos/` | shipped, HELD |
| `MGK-TWIN_MONITOR_CLOSE_UP_MARKERS.png` (556,169 B) | robots repo `reference/photos/` | **spec**, `ref: null`, `role: source`, not in `assets.json` |

The markers placement follows `monitor_base_markers.png`, which is the house's
existing precedent for a layout file and is treated exactly this way.

### The drum today

```
1 MGK-NIAC   2 MGK-NIAC   3 STANDARD*   4 DETAIL*
5 COLD START   6 FIRST RUN   7 LAST STATE   8 TEST BENCH      (* arms)
```

A position may now carry its own `src`/`frameTitle`; the latch falls back to its
own. One `||` per field, and no position outside channel 4 changes — **verified**:
channel 3 still dispatches `/held/robots/twin.html`.

### WHAT LOOKING AT IT FOUND, AND IT NEEDS MIKE

The close-up is **not a single exposure**. It is the machine's monitor bezel cut
out on alpha with three panels composited into the glass. The markers file is a
**layout template**: two red slots top, a white slot centre, an anchor dot. In the
composite, **the lower-right panel is blank grey** — a slot the markers declare
and the composite does not fill.

There is also **lettering**: `MADE IN` / `U.S.A. BY` embossed round a badge in the
lower-left panel, and further reversed embossing upper-right that is not resolved.

The asset table already carries a `wrong` verdict on
`MGK-TWIN_MONITOR_SCREEN_BEZEL.png` — *"a CRT/monitor FRAME GRAPHIC with a plain
white rectangle where a picture is meant to be dropped"*. **Channel 4 is the same
family.** Declared `MIKE`, `textInImage: true`, `inspected: NOT INSPECTED`.

---

## D — THE LOADED COMMAND

`npm run export-artifacts` **refuses**, exits 1, and does not contact MV. It names
`MV-HR-20260707-056`, `MV-HR-20260405-012`, `MV-HR-20260405-013`, says the fix is
in MediaVault, and requires `-- --restores-deleted-lyrics`. `--dry-run` is not an
escape.

`CLAUDE.md`'s release flow is **one step** now (`npm run deploy`); the
cross-reference at the cowork-hygiene section is rewritten to match.

**MediaVault untouched** — prune the habit, keep the box.

**48 dead MV scripts under `tools/`** wired to no npm script: 22 `.ps1`,
14 `.py`, 8 `.mjs`, 3 backup copies, 1 `.md`. Listed for a later ruling, deleted
nothing.

---

## GATES

| gate | result |
|---|---|
| lint | **11 errors / 9 warnings — baseline** |
| build | green |
| launch build | green |
| provenance:gate | **PASS** — 0 undeclared · 27 stale pruned · **0 chains broken** · 3 new rows |
| reveal:check | **PASS** (incl. the repointed vessel at all four stages) |
| parity:gate | PASS — 4 shared, 0 divergences |
| instory:gate | PASS |
| assets rescan | 240 files · **0 judged fields written** · +2 rows |
| assets:orphans | **13** rows for deleted files (8 judged, 5 unjudged) — left |
| reveal:day | nothing to move |
| **lap @ 1280px** | 5 routes · overflow 0 · broken images 0 · console errors 0 |

### THE LAP, AND WHAT WAS SEEN

Record index: **001–005, no 013, no gap.** Mainframe archive: one plate, correct
caption, **no filter strip, no false empty line**. VIIIp archive: five tiles,
counts right, nothing hanging. Hunter Root's card: no plate, no empty frame, no
broken image. **Nothing is left hanging anywhere a deleted image used to be.**

One measurement caveat: the harness's `brokenImages` check requires
`complete && naturalWidth === 0`, so an image still loading reads as neither
broken nor loaded. Images were forced eager and re-checked rather than trusted.

---

## OPEN, FOR THE REGISTER

- **`CH-a`** — `DETAIL` is Ops' engraving. The legends are Mike's to write.
- **`CH-b`** — Hunter Root's card opens on prose; F1 unsatisfied, one string.
- **`CH-c`** — the mainframe poster caption, RESTATED from the tile label.
- **`CH-d`** — channel 4's composite has an **unfilled slot** and unread lettering.
- **`CH-e`** — the pull-back rule has no positive case until an entry delivers.
- **`CH-f`** — 13 orphan asset rows (8 judged); `--cull` is a person's decision.
- **`CH-g`** — `monitor_base_markers.png` is now a spec for a deleted photograph.
