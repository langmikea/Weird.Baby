# JOB 3 — THE VIIIp CHANNEL 3/4 BREADCRUMBS
2026-08-11/12 · **READ-ONLY** · both repos searched, plus `ADD TO REPOS`.

---

## WHAT YOU HAVE TO DECIDE

1. **You did not imagine the channel discussion. It is your ruling, it is
   written down, and it is BUILT.** 5 August 2026. It is on the Portal now, held
   behind the album door. §3a/3b.
2. **The templates: I found ONE strong candidate and I could not open it.**
   `MGK-TWIN MONITOR SCREENS_2.psd` — 360MB, 61 layers, 3000×2400, **saved
   5 August 2026, the same day as the channel ruling.** It is in OneDrive and in
   neither repo. **§3c.** I cannot tell you what is on those 61 layers.
3. **The drum is not six positions with five dead. It is EIGHT with SEVEN dead.**
   The renumbering added two. §3d.

---

## 3a + 3b — WHAT WAS PROPOSED, WHAT WAS RULED, WHAT WAS BUILT

**It was all three, in one day.**

### Your ruling, verbatim

From `docs/MUSEUM_ROBOTS_SIMPLIFICATION_LOG-20260805.md` §R6:

> **MIKE:** *the Portal's feed positions renumber — NIAC takes CHANNELS 1 AND 2,
> VIIIp moves to CHANNELS 3 AND 4. The reason is the egg and it must not be
> explained on the glass.*

### The egg itself, verbatim

It is written down **once**, in `reveal/ledger.json` under `egg.channels`, and —
by design — nowhere else in either repository:

> *a 1970s home device fed a television through an RF modulator and you tuned the
> SET to channel 3 or 4. The MGK-VIIIp is the portable, the consumer object, the
> one you take home — so it starts at 3, exactly where a machine like that has
> always started. And the numbering carries a second thing for free: NIAC holds
> 1 and 2 because NIAC came first, which is the true development order.*

**Your reasoning came through intact — RF modulator, tune the set, channel 3 or
4, the portable is the one you take home.** That is your memory, and it is the
file's words.

### What was built

`src/data/artists/portal.js`, `panel.drum` — eight engraved positions with a `ch`
number each. `NIAC` on 1 and 2, `STANDARD` (the only one that arms) on 3, and
the VIIIp's five held feeds on 4 through 8.

**Nothing on any face explains it.** Not the drum's legend, not its sub-line, not
a caption. The code comment says why: *"Writing the reason down here would spend
it in the same commit that planted it."*

### One thing the round caught that is worth knowing

The renumbering put two dead NIAC channels at the top of the drum, and
`useState(0)` landed every visitor on a position that will not arm — **the
Portal opened saying NOT ARMED, "This feed is not available."** It was found by a
screenshot, not by the data. The drum now opens on the first arming position.

### The egg's current state — it is UN-SPENT

`egg.channels` is `build: LIVE`, `state: HELD`. The ledger's note:

> *"THE EGG WENT BACK IN THE DRAWER WITH THE DRUM IT IS CUT INTO… holding the
> Portal un-spends it, which is a thing worth noticing about eggs: one planted on
> a held surface is not planted at all."*

**Nobody has seen it yet.** The day the Portal opens, it is planted.

---

## 3c — THE TEMPLATES

### The strong candidate

**`MGK-TWIN MONITOR SCREENS_2.psd`**

| | |
|---|---|
| **path** | `C:\Users\macun\OneDrive\Desktop - Laptop\ADD TO REPOS\Weird.Baby Files\MGKVIIIp\` |
| **saved** | **5 August 2026, 15:06** |
| **size** | 360,810,318 bytes (344 MB) |
| **canvas** | **3000 × 2400, RGBA, 8-bit** |
| **layers** | **61** |
| **in either repo?** | **No.** Not in the museum, not in robots. |
| **in the asset table?** | **No.** |

**Three things make it the candidate:**

1. **The date is the ruling's date.** It was saved on 5 August 2026, the day the
   channel round happened. Not a coincidence I would bet against.
2. **The canvas matches the twin's screen assets exactly.**
   `MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` and
   `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` in the robots repo are both **3000 × 2400
   RGBA**. This PSD is the layered master at the same canvas.
3. **61 layers and a `_2` suffix.** A flattened photograph does not need 61
   layers. A file where you swap what is on the screens does.

**I could not open it and I am not going to guess what is on it.** I read its
header — dimensions, channel count, layer count — and stopped. **A 61-layer
Photoshop file whose layers I cannot see is not evidence of a second channel;
it is a file that is very likely to contain one.** You can open it in about
thirty seconds and know.

### Supporting material already in the robots repo

| file | date | what it is |
|---|---|---|
| `reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | 29 Jul 2026 | 542 KB. **A CRT frame graphic with a plain white rectangle punched out of the middle** — a hole you drop a screen picture into. This is a template in the literal sense, and it is already catalogued (`M7` in `OPEN_ACTIONS.md` flags it as mis-captioned on the wall). |
| `reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` | 29 Jul 2026 | 4.9 MB, the pair front and top |
| `reference/photos/monitor_base_markers.png` | 28 Jul 2026 | 57 KB — registration markers |
| `reference/photos/front_screen.png` · `top_monitor.png` | 23 Jul 2026 | the two screens |

### Other candidates in OneDrive, weaker

| file | date | why it is weaker |
|---|---|---|
| `EDITED IMAGES - VIIIp/PANEL.png` | 9 Aug 2026 | 817 KB, single flat PNG. Named for a panel, not a screen. |
| `RAW IMAGES - VIIIp/MONITOR.png` | 24 Jul 2026 | 2 MB, predates the ruling by twelve days |
| `RAW IMAGES - VIIIp/Front Screen.png` | 23 Jul 2026 | already in the robots repo as `front_screen.png` |

### A trap worth naming, because it will waste an hour

**There is a "MENU TEMPLATE" in `weird-baby-robots/tools/viiip_twin.html`, and it
is NOT this.** It is a firmware screen-layout grammar for the machine's own
128×64 OLED front screen — three zones, brand header, instruction row, bracketed
line — built to judge a typography fit. **It is also labelled `[R6]`**, dated
26 July 2026, and it is a *different R6* from the museum's channel R6 of 5
August. Two rounds, same code, unrelated work.

### The honest summary of 3c

**Nothing in either repository is a screen design for a second Portal channel.**
I searched both repos and all of `ADD TO REPOS` for `channel`, `template`,
`screen`, `RF`, `VHF`, `tuner`. The only files whose names contain "screen",
"channel" or "template" across the entire `Desktop - Laptop` tree are the two
listed at the top of §3c.

**One file outside both repos is very likely it, and you can settle it by
opening it.** If it is not, then the templates were never saved anywhere I can
reach, and the honest answer is that they are gone.

---

## 3d — THE PORTAL'S DRUM TODAY

**Your packet says six positions and five that do not arm. It is eight and
seven** — the R6 renumbering added the two NIAC channels above the VIIIp's six.

| ch | engraving | arms? | what it holds |
|---|---|---|---|
| **1** | `MGK-NIAC` | no | **nothing.** No state, no mode, no feed title — deliberately, because nobody supplied one and inventing one is Doctrine 12's failure |
| **2** | `MGK-NIAC` | no | nothing, same |
| **3** | `STANDARD` | **YES** | the unit as it stands, at the opening prompt. **The only live feed in the building.** |
| **4** | `STANDBY` | no | *(id `idling-updated`)* — a machine idling after its updates. **This is the "second VIIIp channel". It has no feed on file.** |
| **5** | `COLD START` | no | *(id `boot-playback`)* — a boot from cold |
| **6** | `FIRST RUN` | no | *(id `off-first-boot`)* — the unit's first ever run |
| **7** | `LAST STATE` | no | *(id `last-state`)* — resume across visits. Blocked on **a privacy ruling from you** (`egg.laststate`) |
| **8** | `TEST BENCH` | no | *(id `test-bench`)* |

**All seven dead positions say the same thing: "This feed is not available."**
That is deliberate — they used to print internal decision codes (*"held — one
entry state (C3)"*, *"held — awaiting a privacy ruling"*, *"held — workshop
entry, by URL"*) at a visitor, and that was struck.

**Channels 4–8 are five reveal levers** (`M33`). The `id` is the key the twin
reads as `preset` in the URL, and no id changed in the renumbering — so all five
levers survived it.

**What a channel actually is:** the Portal's latch opens
`/held/robots/twin.html` with a `preset`. So arming channel 4 means **the twin
booting into the STANDBY state** — which is exactly the thing a set of screen
templates would supply.

---

## WHAT I COULD NOT DETERMINE

- **What is inside `MGK-TWIN MONITOR SCREENS_2.psd`.** 61 layers, 344 MB. I read
  the file header only. I did not open it, could not render it, and will not
  describe layers I have not seen.
- **Whether you ever made screen designs for channel 4 specifically.** No file in
  either repo, and no document, names a channel-4 screen. The PSD's date is
  suggestive and is not proof.
- **Whether `PANEL.png` (9 Aug) is related.** It postdates the ruling by four
  days and I did not open it either.
- **Whether the twin can already boot a STANDBY preset.** `viiip_twin.html` is
  10,802 lines and I read the parts about screens and templates. I did not trace
  the preset handler.

## WHAT NEEDS MIKE

1. **Open `MGK-TWIN MONITOR SCREENS_2.psd`.** Thirty seconds settles the whole
   job. If the layers are the second channel, drop it in
   `C:\AI\_manual-samples-20260811\_FOR_CLAUDE\` as a flattened PNG or tell me
   and I will wire it.
2. **If it is not there, it is not anywhere.** I searched everything I can reach.
   You said you would rather know than be told maybe — it is not in either repo
   and it is not on the Desktop tree.
3. **`LAST STATE` (channel 7) is waiting on a privacy ruling from you** — it has
   been since it was written. Nothing else on the drum is blocked on a decision.
4. **The egg is un-spent because the Portal is held.** Nothing to do; worth
   knowing that the day the Portal opens is the day it counts.
