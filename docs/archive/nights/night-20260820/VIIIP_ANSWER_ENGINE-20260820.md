# Q1 AND Q2 — VIIIp's answer engine

**Read-only. Nothing built.** 2026-08-20. Source: `robots:tools/viiip_twin.html`.

---

## Q1 · WHAT IS VIIIp's ANSWER ENGINE?

### The plain answer

**There is no MGK-VIIIp answer engine. There never was one, and there is no
row, no table slot and no content for it. Making one is a build.**

**But the question has a second answer that costs nothing, and it is the one
that matters:** in canon, **MGK-VIIIp is the MACHINE, and the engine list is the
list of what runs ON it.** All three compiled engines are the VIIIp's engines.
The machine is not missing its engine — the list is showing the wrong one first.

### Does it exist in the engine list at all? — No.

Every row of the ANSWERS table, read from `MENU_TABLE_SRC`, in order:

```
 0  MGK-NIAC          3  MGK-Einstein      7  The Everyman      22  MGK-VIIIp-16
 1  MGK-v2.0          4  MGK-Yogi          8  The Informer      23  MGK-VIIIp-17
 2  MGK-65            5  MGK-DYK           9  The CEO             …  …
                      6  MGK-HR           10-21 The Assistant   38  MGK-VIIIp-32
                                                … The Reactor   39  < Back
```

**The `MGK-VIIIp-16` … `MGK-VIIIp-32` rows are UNIT SERIAL SLOTS, not engines** —
the unnamed part of the 31.4 fleet, sitting after the twenty-two named personas.
**No row is called `MGK-VIIIp`.**

**And only three rows have anything behind them:**

```
M8B_MENUROW_TO_SLOT = [0, 1, 2, -1, -1, … -1]   /* 39 personas, 3 compiled */
```

Rows 3–38 return `-1` and draw **`PERSONA NOT INSTALLED`**.

### What the three draw from, and what they say

| row | engine | source | what it says |
|---|---|---|---|
| **0** | **MGK-NIAC** — compile date 1945 | `CSV_CORE` only | **The classic twenty, one text each.** No engine overlay, no clarity variants — the resolver falls straight through to core at every clarity level, so **all five clarity settings give identical text.** *Ask again later.* … *Without a doubt.* |
| **1** | **MGK-v2.0** — 1946 | `CSV_ENGOV`, **8 rows**, over core | Re-skins 8 of the 20 (*"Cannot predict_now."*, *"Concentrate,_and ask again."*, *"Definitely no."*, *"As I see it, yes."*…). The other 12 fall back to core. **No clarity variation.** |
| **2** | **MGK-65** — 1965 | `CSV_CLOV`, **full 20 × 5 grid** | The only engine where Clarity does anything. The Windows-95 register: *"VVindows has_encountered an error."* · *"Negative, ghost rider._System says NOPE!"* · *"[Triumphant Windows Startup Sound]"* · *"Error 404:_Question not found"*. |

Resolver order, verbatim: `unit ?? clarity ?? engine ?? core`.

### The collision behind your ruling, reported and not resolved

**Your ruling says the engine list's one entry is "NIAC, the machine that is not
here." The corpus names MGK-NIAC as two different things, both canon, both in
`STORY_BIBLE.html`:**

> **CANON · NIAC-first, 2026-07-18** — *"The mainframe is, and was only ever,
> MGK-NIAC; 'VIII/VIIIp' is ABEAL's 1965 rebrand."*
>
> **CANON · engines** — *"Named engines stand: MGK-NIAC (the pure twenty),
> MGK-v2.0, MGK-65."*

And `SPEC_INVENTORY` §D.4: *"Preloaded answer engines with compile dates:
**MGK-NIAC (1945, original M8B responses only)**, MGK-v2.0 (1946…), MGK-65
(1965…)."*

**So the row can be read two ways** — as the mainframe (which is not on channel
3) or as the 1945 answer set preloaded on the VIIIp (which is). **You have ruled
the first reading. Recorded; the second is not argued back.** It goes in the
catalogue as a new conflict beside [K-03](../../Projects/weird-baby-museum/docs/canon/CONFLICTS.md),
because a glossary and a menu both have to print one of them.

**Note the drum and the FAQ already say what you ruled**, and are published:
channels 1 and 2 are engraved MGK-NIAC and neither arms, and the Portal's FAQ
answers *"Is the mainframe on the Portal?" — "Not yet."*

### The four ways to make channel 3 answer as MGK-VIIIp

**Costed, not chosen.**

| | what | build cost |
|---|---|---|
| **A** | **Rename row 0** to something that is not the mainframe's name | **Zero.** One string. But it renames a thing canon calls MGK-NIAC, and the 1945 compile date goes with the name. |
| **B** | **Ship MGK-v2.0 or MGK-65 as the day-one engine** and hide row 0 | **Zero build — one line in `Parcel_Sync_Menu`.** The parcel law already hides rows 1 and 2 by stage; the same mechanism can hide row 0 instead. **And this is the option that answers Q2.** |
| **C** | **Build a fourth engine, `MGK-VIIIp`** | **A build.** A fourth table slot, a fourth `M8B_AnswerTable` entry, a compile date, a voice, and 20 answers of content — content the DRAFTING LAW reserves to you. |
| **D** | **Remove the engine list entirely** — one engine means no chooser; `ASK MGK` goes straight to the ask | Small build in `Run_EXE` / the doors table. **Removes a screen a visitor currently walks through to choose between one thing.** |

**Option A and option B are both configuration. Only C is a build.**

---

## Q2 · DOES THE SHAKE-ONLY FAULT APPLY? — **NO, IF THE ENGINE IS NOT NIAC.**

**Confirmed. The gate is one line, and it names MGK-NIAC specifically:**

```js
else if(Pull_From_Buffer(SHUTTER)){
  /* NIAC is SHAKE-ONLY per the D.8 MGK-Options matrix (VSI x, PPI blank).
     Click is CONSUMED (no ghost-click into the menu later) but ignored.
     v2.0 + 65 carry PPI in the matrix and keep the click path. */
  if(M8B_ID!==MGK_NIAC){M8B_currentState=REVEAL_THE_ANSWER;}
}
```

| engine | shake | click |
|---|---|---|
| **MGK-NIAC** (row 0) | **yes** | **consumed and ignored** |
| **MGK-v2.0** (row 1) | **yes** | **yes** |
| **MGK-65** (row 2) | **yes** | **yes** |
| a new engine at row ≥ 3 | yes | **yes** — the gate excludes only `MGK_NIAC` |

**So the fault Ops flagged is not a property of the machine. It is a property of
that one engine.** Under your ruling that NIAC is not on channel 3, **the fault
leaves with it** — no fix, no ticket, nothing to build.

**And it was never a defect.** It is the D.8 options matrix enforced: NIAC
carries VibroSense and a blank PressPulse. The twin is right; the museum was
about to ship the one engine whose input the museum's visitor does not have a
good route to.

**One thing survives the ruling and is worth keeping:** with a click-capable
engine, a visitor has **two** ways to ask, and `≋SHAKE` is the one that is
in character. Your ruling 3 stands untouched by this — *"It's a magic eight
ball. They're gonna put it together."* Both inputs work; neither is explained.

---

## RULING 2 · WHERE STICKY SETTINGS WOULD PERSIST

**`Save_To_Flash(variableID)` already knows which of four values to write** —
`FLASH_POLARITY_SETTING`, `FLASH_CLARITY_SETTING`, `FLASH_POLARITY_BIAS`,
`FLASH_CLARITY_BIAS`. Today its whole body is
`Serial.println("Save to flash not implemented")`.

**There is an established pattern to join, not invent.** The twin already
persists **seven** keys to `localStorage`, all `wbr_*`:

```
wbr_boot_level   the install level        wbr_user     name + birthdate
wbr_parcel       what has been earned     wbr_santa
wbr_health       condition, sessions      wbr_son_best
wbr_bs           the BS level store
```

So sticky bias is **one more key in a namespace that already exists** — and the
museum's own code uses a different prefix, so there is no collision.

### What happens across a stage change — **nothing. It survives.**

`localStorage` is keyed to the **ORIGIN**, and the stage is a build-time literal
that never touches storage.

| | |
|---|---|
| development → launch, same domain | **survives.** Same origin; `__WB_STAGE__` changes what the worker serves, not what the browser stored. |
| a deploy | **survives.** |
| closing the Portal overlay | **survives** — this is the point. The iframe is destroyed and its RAM with it; localStorage is not RAM. |
| `localhost` ↔ `weird.baby` | **separate stores.** Your local testing can never contaminate the live one, and vice versa. |
| a private window, or a visitor clearing site data | **gone.** |

**Two things worth knowing before it is built:**

1. **The recipe rewrites the boot level on every latch** (`setBootLevel` inside
   `Portal_Preset_Apply`), but it touches **only** level, power, weather and
   replay. **Bias would not be overwritten by opening the Portal.**
2. **Sticky and inert is exactly what the numbers already do.** At
   `polarityBiasNOW = 0` the weight is 100 for every answer regardless of the
   setting — so a visitor can move Polarity from Negative to Optimistic and the
   draw does not shift. **The setting is remembered and does nothing**, which is
   the ruling, and it needs no extra guard to stay true. The day a Record makes
   it matter is the day the *bias* moves off 0, not the day the setting starts
   being stored.

---

## WHAT Q1's ANSWER DOES TO THE PROPOSAL

**One line of it, and it is the first line.**

`Answers > ASK MGK > MGK-VIIIp` **is not a row that exists.** Under option **A**
or **B** it is a rename or a one-line visibility change and the proposal stands
as written. Under **C** it is the only build in the whole list — everything else
you proposed is a refusal, and a refusal is cheaper than a feature.

**The rest of the proposal is unaffected**, and one part of it is already done
for you: `Programs > Games`, `Answers > Advice`, `Predictions` and
`Probabilities` are hidden or reachable today by the **parcel law**, which is
the same mechanism your seven refusals need — thresholds in one line
(`P_GAMEPACK_ASKS`, `P_APPS_ASKS`, `P_DET_ASKS`…). **Whether the refusals ride
that mechanism or a new one is the thing Ops will bring you, after you rule
Q1.**
