# CHANNEL 3 — THE PORTAL WAS NEVER BUILT
2026-08-20 · **not committed, not pushed, not deployed**
HEAD at start: `4323477`.

---

## WHAT WAS WAITING ON MIKE AT THE TOP

1. **The bezel.** The Portal's frame graphic was deleted from the museum on
   2026-08-13 on his own ruling, and the live Portal composites it at runtime.
   It ships unframed unless he restores it. One line either way.
2. **`SELECT · ONE ARMED`** — Ops recommends striking the line, not correcting
   the count. Reasoning in §5.

---

## 1 — THE DIAGNOSIS, AND THE PREVIOUS READING WAS WRONG

The handoff said the `standard` recipe *"applied two of three steps and
stopped"*, with `resume` falling through to `power` and power never reporting.
**It applied none of them, because `Portal_Preset_Apply` was never called.**
Nothing in `PORTAL_RECIPES` was wrong and nothing there is changed.

The chain, measured on a loaded page:

- `tryMonBase()` probes `base + "monitor_base.png"`.
- **That photograph was deleted on 2026-08-12** in `8e67b5b` (*"Channel 4
  arrives, 013 and nine photographs go"*), at both candidate paths.
- The probe therefore `onerror`s twice. With `?user=1` — the only way the
  museum's overlay opens this page — O2's public branch runs
  `Portal_Base_Missing()` and stops: **NO SIGNAL**.
- `Portal_In()` is called from **that onload and nowhere else**. So
  `Portal_Build()` never ran, and `Portal_Preset_Apply()` — its last line —
  never ran either.
- The visitor got the machine as `setup()` left it: menu drawn,
  `Power_Standby()`, dark. Exactly the reported symptom.

**A `curl` said the file was there and it was lying.** The dev server answers a
missing path with the SPA index — `200 text/html`, 8,483 bytes. The check that
settles it is the content type, not the status.

**WHY IT SURVIVED EIGHT DAYS.** Without `?user=1` the ladder descends to
`unit_crt_base.webp`, which is still on disk, so a developer opening `twin.html`
plainly gets a working machine. **Only the museum's own entry was dead** — and
that is the entry nobody opens while working on the twin.

**THE SECOND FILE.** `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` went the next day in
`000a03c`. `Portal_In` required BOTH layers, so even with the base restored the
portal would have refused — and its refusal named a fallback that no longer
exists (*"staying on the baked monitor_base.png"*).

**THE CLASS OF DEFECT:** both files were culled as **wall plates** under M7
(*three of the nine plates do not show what their captions say*). Neither round
knew they were also **live build dependencies**. An asset with two jobs was
judged on one of them.

---

## 2 — THE FIX, AND WHY NOTHING WAS RESTORED

**The probe now asks for the picture it is about to draw.** Tier 0 probes
`MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png`. That is not a substitution of
convenience: `monitor_base.png` had the bezel and a white top-window rectangle
baked into it, and `Portal_Build` has re-pointed the picture at the **clean
family art** since [T7]. **Tier 0 was probing a file it then threw away.**
A deleted photograph cannot gate a live surface again.

**The frame is optional; the picture is not.** One missing compositing asset
used to kill the feed select, the weather, the size dial and the preset with it.
A portal without its frame is a smaller loss than no portal, and it is
**announced** — the machine's own register says `NO BEZEL ON FILE`.

**The already-built guard moved to `#feedgroup`.** It keyed on the bezel node,
and an optional node cannot be the thing that proves a build happened.

**NOTHING MIKE RULED GONE CAME BACK** (Doctrine 24). The bezel is his to
restore; §5 puts it to him.

---

## 3 — VERIFIED WITH A REAL LATCH

`/robots` → Portal album → **Portal Feed Controller** → drum at `3 | STANDARD`,
FEED ARMED → **LATCH**.

- The overlay opened, the twin built its portal, and the recipe reported all
  three steps: `[RECIPE] standard - install level 2 · no mark this visit - the
  returning machine · power on`.
- **The boot ran** — DATA BUS / GRANTED, AUX BIOS, LOAD BIOS SEG 4/6, POST —
  and landed at `Please Select: > Answers <`.
- rAF was not an obstacle: the tab was foregrounded and painting, so no
  MessageChannel pump was needed.

---

## 4 — THE MENU RULING SURVIVED, AND IS COMPLETE

Read out of the **live** machine, not the source:

| destination | word |
|---|---|
| MESSAGES (2) | NO RECORD |
| PREDICTIONS (6) | NOT FITTED |
| PROBABILITIES (7) | NOT FITTED |
| ADVICE (8) | NOT FITTED |
| GAMES (13) | NOT FITTED |
| USER (15) | NO RECORD |
| MAINTP (38) | NOT FITTED |

Seven destinations, exactly the ruled set. **PREFERENCES (4) is not among them**
and ASK MGK is reachable — the two that stay live.

**On the glass**, driven through the machine's own controls:

- `Advice` → `-(A)BEAL MGK-VIIIp >- / Advice / NOT FITTED`
- `Messages` → `-(A)BEAL MGK-VIIIp >- / Messages / NO RECORD`
- Any input returns **to the row that refused**, no ghost press.

**One consequence worth naming:** Preferences' own first row also points at
`USER`, so it refuses there too. That is the destination-keyed design doing what
its comment says, not a leak — Preferences itself opens.

**The sticky bias works end to end.** Clarity Setting driven from `Uncouth` (3)
to `Offensive` (1) through the menu wrote `{"cs":1}`; the twin was reloaded and
came back at `cs:1`. Store cleared afterwards.

---

## 5 — `SELECT · ONE ARMED` — OPS RECOMMENDS STRIKING IT

Two channels arm, so the line is false. **Ops does not recommend correcting the
count to TWO.**

- **The lamp beneath the latch already reports arm state** for the channel
  displayed — `FEED ARMED` / `NOT ARMED` — and the drum's readout already says
  which channel that is. A count adds nothing a visitor can use.
- **It has already gone stale once**, silently, and a hand-kept tally under a
  stepper will go stale again the next time a channel changes.
- Doctrine 16: what is lost if it goes? Nothing a reader would miss.

`{D.drum.sub && …}` is conditional, so deleting the field draws nothing and
leaves no gap.

**If he wants a legend there**, second choice is `SELECT` alone — the label for
what the drum is, with no claim attached.

---

## GATES

lint **9/8 = baseline** · build green · **launch build green** · provenance
**PASS** · `reveal:check` **PASS** · `parity:gate` **PASS** · `instory:gate`
**PASS** · `docs:numbers` **PASS** · `reveal:day` **nothing to move** ·
`assets:orphans` **13 (8 judged / 5 unjudged), unchanged**.

`tools/viiip_twin.html` in the robots repo re-mirrored; the two copies are
byte-identical.
