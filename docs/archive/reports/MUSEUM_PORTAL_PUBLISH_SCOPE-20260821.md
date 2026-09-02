# PUBLISHING THE PORTAL — THE SCOPE, MEASURED
2026-08-21 · reported before building, as the packet asked · **nothing built**

## TWO THINGS MUST BE ANSWERED BEFORE THE DOOR OPENS

**Both were found by doing items 4 and 5, and both change what "publish" means.**

1. **THE FAQ CARRIES A LINE IN MIKE'S VOICE THAT IS NOW FALSE, AND I MADE IT
   FALSE THIS AFTERNOON.** His amended answer reads *"Two channels are engraved
   for it on the feed drum and neither of them carries it."* **The feed drum was
   struck three hours ago in the panel rebuild he ruled**, and `MGK-NIAC` is now
   engraved nowhere in the building — the channels are the ANTENNA's four
   numbered switches and they carry no names. Publishing ships a sentence in his
   voice describing an instrument that does not exist. **Ops does not rewrite his
   voice.** §5.
2. **PUBLISHING THE PORTAL PUTS MGK-VIIIp ON THE PUBLIC GLASS**, against his own
   standing ruling of 17 August — *"TAKE MGK-NIAC AND MGK-VIIIp DOWN. Urgent"*,
   whose stated root cause is **"a hold that depends on another thing's hold is
   not a hold."** The Portal album is literally titled *"MGK-VIIIp digital twin —
   the Portal"*. This is not incidental leakage that can be trimmed: the twin
   **is** the Portal. §4.

Everything else in the packet is measured below and is mechanical once these two
are answered.

---

## 1 · `portal.js` OUT OF `HELD_PATHS` — WHAT THE GUARD SAYS, AND WHY

`heldChunkGuard` **will not complain, and the reason matters more than the
answer.** The guard fails a build when a *shut* module lands outside its own
directory. Drop `portal.js` from `HELD_PATHS` and it stops being shut, so there
is nothing for the guard to assert about — it goes quiet by construction, not by
approval.

**What it would have said if the Portal still imported something shut:** it
imports exactly one module, `../faq-face.js`, which is public and is the factory
four other FAQs already use. So the chunk lands in the public graph cleanly and
`HELD_COMPANIONS` is unaffected.

**THE GUARD IS NOT THE GATE THAT MATTERS HERE — `reveal/reachability.mjs` IS.**
Its rule 5 is the one that refused the machines' first hiding cut, and it reads
the ledger: **16 rows whose `where` is `portal.js` are `state: "HELD"`, and every
one of them becomes a lie the moment the module is public.** That is item 3 and
it is not a formality — it is the check that will fail the packet.

**AND REMOVING IT FROM THE LIST IS NOT ENOUGH ON ITS OWN.** `Robots.jsx` splices
the album in only when the session flag is set:

```js
if (launched() && !heldOpen()) return undefined;
import("../../data/artists/portal.js")
```

A visitor has no flag, so the album would still not appear. **Two changes, not
one**, and the second is the one a visitor can actually see.

## 2 · THE ASSETS — THE FULL LIST AND THE BYTES

Everything the Portal reaches for, resolved from `portal.js` and from
`twin.html`'s own loader ladder:

| file | bytes |
|---|---:|
| `robots/twin.html` | 646,521 |
| `robots/art/portal-cover.png` | 641,677 |
| `robots/art/viiip-v2.png` | 1,262,731 |
| `robots/reference/photos/MGK-TWIN_MONITOR_SCREENS_FAMILY_SHOT.png` | 4,918,942 |
| `robots/reference/photos/MGK-TWIN_MONITOR_SCREEN_BEZEL.png` | 542,670 |
| `robots/reference/photos/MGK-TWIN_MONITOR_CLOSE_UP.png` | 2,369,280 |
| `robots/reference/photos/top_monitor.png` *(fallback tier)* | 2,040,499 |
| `robots/reference/photos/unit_crt_base.webp` *(fallback tier)* | 449,652 |
| **total** | **12,871,972 (12.3 MiB)** |

**Three files the twin still asks for are already gone** — `front_full.png`,
`monitor_base.png`, `unit_new_base.png`, deleted on 2026-08-12. The loader ladder
handles their absence and says so; they are three of the 13 standing orphan rows.

**THE PORTAL IS 6.4% OF WHAT IS BEHIND THAT DOOR.** `/held/` is **199,760,000
bytes**. What does **NOT** move: `robots/manual` (120.3 MB), `robots/audio`
(62.1 MB), the rest of `robots/reference` (12.3 MB total, of which only the four
photographs above are the Portal's), `robots/plates` (17,772) and `robots/twin/`
(25,683 — two 2026-07-15 treatment renders). **The move is per-file, so nothing
rides along unless it is named.**

**AND THE TWIN'S AUDIO IS ALREADY DEAD IN THIS TREE.** `AUDIO_BASE` resolves to
`/held/robots/mgk-viiip/content/build/SD/`, **which does not exist here** — the
audio lives at `/held/robots/audio/`. Voice messages fail silently today. That is
not created by publishing, but publishing is what puts it in front of a visitor.

## 3 · THE LEDGER — AND IT IS ALREADY WRONG, FROM THIS AFTERNOON

**39 rows mention the Portal; 16 have `where: portal.js`; all 16 are `HELD`.**
*"A hiding ruling is not done until a ledger row moves"* — and the converse is
the same rule, so all 16 move to a public state with the door.

**TWELVE OF THE SIXTEEN ARE STALE ALREADY, AND I STALED THEM.** The panel rebuild
replaced the drum, the channel engravings and both bat switches and **did not
move a single ledger row.** `reveal:check` passed anyway, which tells us what
that gate does and does not read:

| row | what it still says | what is true now |
|---|---|---|
| `face.viiip.portal` | "drum, two bat switches, a rotary dial, a latch" | readout + steppers, four DIP switches, dial, latch |
| `portal.feed.niac.1` / `.2` | "MGK-NIAC, engraved on the drum and inert" | no drum, no engraving, `unit:false` on an ANTENNA channel |
| `portal.feed.idling-updated` | "CHANNEL 4 · STANDBY" | not a bank at all; channel 4's photograph moved to the antenna |
| `portal.feed.boot-playback` | "CHANNEL 5 · COLD START" | COLD START is `clean-boot` now |
| `portal.feed.off-first-boot` | "CHANNEL 6 · FIRST RUN" | FIRST RUN is `first-run` now |
| `portal.feed.last-state` / `.test-bench` | "CHANNEL 7 / 8 … inert" | banks, both deliberately disarmed |
| `portal.switch.maint` / `.prompt` | AUTO MAINT / AT PROMPT | struck from the panel |
| `egg.channels` | "the mainframe on 1 and 2, the portable on 3" | the numbering survives; the *engraving* that carried it does not |

**And the rebuild created objects with no rows at all:** the four DIP switches,
the five bank states, `PortalScreen` and the channel strip.

**THE RULE THIS EARNS:** a ruling is not done until a ledger row moves — and
**neither is a rebuild.** I should have moved these in the same round that moved
the panel.

## 4 · WHAT PUBLISHING THE PORTAL EXPOSES THAT IS NOT THE PORTAL

**Said plainly: it publishes MGK-VIIIp.**

- The album's own title is **"MGK-VIIIp digital twin — the Portal"** and the
  face's subtitle is **"MGK-VIIIp"**.
- `twin.html` **is** the unit — its own `<title>` is *"MGK-VIIIp digital twin"* —
  and it is not a picture of a machine, it is an interactive one: menus, boot
  ceremonies, messages, the shutter, power.
- Three of the four photographs are **of MGK-VIIIp**.
- The FEED readout prints **`NIAC/VIIIp`** on every bank — **both** unit names,
  lit, on the panel.
- The FAQ answers two questions **about the held units**: *"Is the Portal the
  real machine?"* and *"Is the mainframe on the Portal?"*

**WHAT STAYS BEHIND THE DOOR:** `robots-units.js` — the two units' own albums,
whole: the manual, the plates, the specifications, the image archive. Those are
untouched by this and must stay untouched. Nothing imports that file and there is
no door to it, by Mike's instruction that they are *held from Mike too*.

**SO THE HONEST DISTINCTION IS:** publishing the Portal does **not** open the
units' exhibits, but it **does** put one unit's working twin, three photographs
of it, and both units' names on the public glass. **Mike's 17 August ruling was
made because exactly this happened once already** — the units came out through a
door that was opened for something else. This is that shape again, and the fact
that it is intended this time is the only difference. **It needs his word, not
Ops' inference.**

## 5 · THE TRACKLIST — `01 Portal / 02 FAQ`

**Track 01, Portal: ready**, with the caveat above about what it is. The panel is
this afternoon's rebuild, verified on the page: the puzzle resolves, television
plays, the test signal draws, the bezel and channel strip carry across all three,
X and Escape exit.

**Track 02, FAQ: NOT ready, on one line, and it is his.**

> *"Not yet. Two channels are engraved for it on the feed drum and neither of
> them carries it."*

He amended that clause **today** — `carries` replaced `arms`, filed MIKE, because
the antenna selector made the old wording false. **The rebuild has now made the
new wording false a second time, in a different place:** there is no feed drum,
and the two MGK-NIAC engravings that carried the egg went with it.

**Two ways out, and both are his:**

- **his sentence changes** — one clause, naming whatever now carries the
  numbering; or
- **the engravings come back** — the ANTENNA's channels regain their names, which
  restores `egg.channels` as well. *Ops' reading: this is the better one, because
  the egg was a deliberate foreshadow and the rebuild dropped it as a side
  effect nobody asked for.* Even then the word `drum` is still wrong.

**The other FAQ answer is fine as prose and is a claim about a held unit** — see
§4; it does not need editing, it needs the §4 ruling.

## 6 · RECORD 005 AGAINST WHAT A VISITOR CAN REACH

Every line 005 publishes, checked:

| line | can a visitor check it? | verdict |
|---|---|---|
| `> Portal Data Link - Connection Achieved` | no — in-story status | fine |
| `> ZIP Extraction - Outer Layers Complete / Stopped` | no | fine |
| `> Portal appears to function. Intended purpose unknown.` | no | fine |
| `> ZIP - We have reached the capability limit of brute force.` | no | fine |
| `> Portal is now up and running on our UNIX-6x Emulator.` | no — the emulator is a prop | fine |
| `> It carried its own COMM payload, autosync, etc.` | no | fine |
| **`> The Portal is accessible via the Robots Exhibit.`** | **YES** | **FALSE TODAY** |
| `> APPROVED - Req 0628 - Internal Transfer…` | no | fine |

**Exactly one line is falsifiable by a visitor and it is the one the packet
named.** The other seven are in-story status about a fictional object; none of
them promises a place to go. **Record 005 carries no attachments** (`docs: 0`), so
there is no plate or scan behind it that also fails to resolve.

**Nothing else in 005 over-claims.** The failure is one sentence, and it is a
sentence about *the museum*, not about the story — which is why it is the only
one that can be wrong in this way.

---

## WHAT I WILL DO THE MOMENT §4 AND §5 ARE ANSWERED

1. `portal.js` out of `HELD_PATHS`; drop the `heldOpen()` gate on the splice in
   `Robots.jsx` so a visitor gets the album.
2. Move the eight files (12.3 MiB) from `/held/robots/…` to their public
   addresses, and repoint the five literals in `portal.js` and the loader base in
   `twin.html`. **Both copies of `twin.html` stay byte-identical.**
3. Move all 16 ledger rows off `HELD` **and correct the twelve the rebuild
   staled**, plus declare the objects the rebuild created.
4. Re-run every gate, then lap `/robots` as a visitor with no cookie and no
   session flag — **which is the only reading that proves the claim in 005**.

**Nothing in `src/`, `public/` or the robots repo was changed by this report.**
