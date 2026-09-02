# MODE B — WHAT IS THERE, AND WHAT IS NOT — 2026-08-26

**Read-only round at HEAD `8d32319`, clean tree. Nothing was changed, nothing
was built, nothing is proposed.** Every claim below is a grep, a read or an
arithmetic on the live tree.

---

## 0 · THE ONE-LINE ANSWERS

| asked | answer |
|---|---|
| What is the Feed screen? | **The phrase does not exist in either repo.** Five different things wear the word `feed`; none is called a screen. §1 |
| Is it reachable today? | **The Portal is public and reachable** at `/robots`, second album. Gate removed 2026-08-22. **Three surfaces still say it is held.** §1.3 |
| Is the `Launch the Portal` rename the same act as Mode B? | **No. Two different acts, six days apart.** The rename moved one string and explicitly moved nothing else. §2 |
| Is R005's attachment the door to Mode B? | **Cannot be answered from the tree** — it names a destination the tree does not have. What it IS is the same shape as an already-scoped backlog item on a different Record. §3 |
| Is the unbuilt half of the 2026-08-21 ruling Mode B? | **No. It was built on 2026-08-26** and is on the glass. §4 |
| Is a new bay a declaration? | **No. The carried-forward claim is wrong.** Four bays are hard-coded JSX with fixed CSS grid areas at two breakpoints. §5 |

---

## 1 · THE FEED SCREEN

### 1.1 · THE PHRASE IS NOT IN THE TREE

`feed screen`, case-insensitive, across `src`, `docs`, `reveal`, `provenance`,
`tools` in the museum and `docs`, `src` in the robots repo: **zero hits.**
`Mode A`, `Mode B`, `unconstrained`, `Feed Launch` as Mike uses them: **zero
hits** except one round-log line (§4.2).

**So the name is Mike's and is new.** Ops cannot resolve it by lookup, and the
honest report is the candidate list rather than a pick.

### 1.2 · FIVE THINGS WEAR THE WORD `feed`, AND THEY ARE NOT THE SAME THING

| # | what | where | what a visitor sees |
|---|---|---|---|
| 1 | **`panel.feed` — the FEED bay** | `portal.js:323`, drawn `Exhibit.jsx:1669` | A lit readout: a bank `NIAC/VIIIp` over a state — `PATCHED` · `COLD START` · `FIRST RUN` · `LAST STATE` · `TEST BENCH` — with ▲▼ steppers outside it. **It picks the recipe the LATCH will launch.** Three of five banks arm; `LAST STATE` and `TEST BENCH` are deliberately disarmed. |
| 2 | **`.ps-feed` — the feed RECT** | `PortalScreen.jsx:247`, `PortalScreen.css:78` | Nothing by itself. It is the box the picture is placed on behind the bezel — 2540×2036 canvas units at x 227, y 194, cropped to the centre 4:3. |
| 3 | **`Feed_Select(n)` — the machine's own views** | `twin.html:10309` | Inside the twin: feed 1 is *"the family shot"*; feeds 2–4 are *"NO SIGNAL: test pattern and hum"*. Per-feed weather, a quality number, a hum. **`monFeed` has been pinned at 1 inside the museum since 2026-08-21** — register **W-a**. |
| 4 | **`#feedlive` / `#feedtest` / `#feedsnow` / `#feedgroup`** | `twin.html:651–695` | The twin's picture layers — the live image, the no-signal monoscope, the snow overlay, and the group the glitch transforms. |
| 5 | **`portal.feed.*` — eleven ledger rows** | `ledger-declare.mjs:389–436` | Nothing. Ops' own record of each control. |

**THE ONE THAT LAUNCHES IS #1.** The FEED bay chooses a bank; the LATCH opens
it. `openChannel` dispatches `preset: bank.id`, and each `id` is a key in
`PORTAL_RECIPES` in `twin.html`.

**THE ONE A VISITOR WOULD CALL A SCREEN IS #3 OR THE BEZEL AS A WHOLE.** The
Portal screen — bezel, four channel buttons, the 2×2 — is `portal.screen` in the
ledger: *"THE PORTAL SCREEN — the CRT bezel and the channel buttons, drawn over
whatever the channel carries."*

### 1.3 · REACHABLE TODAY — YES, AND THREE SURFACES DISAGREE

**The gate is off.** `Robots.jsx:50–62` carries the 2026-08-22 note: *"THE GATE
IS OFF — MIKE RULED THE PORTAL PUBLIC."* Both halves were removed — the module
left `HELD_PATHS` (`vite.config.js:308–311`: *"The Portal was its founding member
and left on 2026-08-22 when Mike ruled it public; the two machines remain"*) and
the router's `if (launched() && !heldOpen())` condition went with it. It is the
second album at `/robots`, spliced at `PORTAL_AT` (1).

**FLAGGED, NOT FIXED — THREE PLACES STILL DESCRIBE IT AS HELD:**

| where | what it still says |
|---|---|
| `robots.js:795` | *"[H1 2026-08-06] THE PORTAL LEFT THIS FILE, AND IT IS HELD … which nothing public may import"* |
| `ledger-declare.mjs` `portal.album` note | *"Held from launch. The album is a dynamic import `Robots.jsx` asks for only behind the password on `/admin`"* |
| `ledger-declare.mjs` `FACE("viiip.portal")` note | *"[H1 2026-08-06] HELD — it left `robots.js` with the album."* |

**THE LEDGER'S STATUS FIELDS ARE CORRECT AND ONLY THE PROSE IS STALE** —
`portal.album` reads `LIVE` / *"/robots — the second album in the carousel"* /
`REVEALED`. So no gate fires. It is three notes, and it is the class §0 already
names: *a struck fact reading as a live one.*

---

## 2 · WHAT "LAUNCHING" MEANS, AND WHETHER THE RENAME IS MODE B

### 2.1 · THE WORD HAS TWO JOBS IN THIS MUSEUM AND THEY DO NOT TOUCH

**AS A MECHANISM, `launch` IS THE LATCH.** Canon 06-PORTAL §11's model table:

| control | what it sets |
|---|---|
| **THE DRUM** *(now the FEED bay)* | the device's configuration at launch — which bank is patched, in which state |
| **THE DIP** *(the ANTENNA)* | `ANT` or `CAB` per channel |
| **THE LATCH** | **launches it** |
| **THE SCREEN'S FOUR BUTTONS** | which channel you WATCH, inside the thing that launched |

**AS A STAGE, `launch` IS THE DEPLOY WORD** — `deploy:launch`, `HIDDEN_AT_LAUNCH`,
*"held from launch"*. A different sense entirely, and the one that has caused
the stale notes in §1.3.

### 2.2 · THE RENAME IS ONE STRING AND SAYS SO

`portal.js:131–154` carries the whole history, and it is explicit that **nothing
travelled with the title**:

> **NOTHING ELSE MOVES.** The `id` stays `portal` — OPERATIONS §0, *NO ID MOVES
> WHEN A LEGEND IS RECUT* … The album is still two tracks and the deleted
> `portal-door` row does not come back.

Canon 06-PORTAL numbers **six steps** so a later round can tell Ops' own
correction (step 4→5) from Mike's reversal (step 6): ruled 2026-08-13 →
re-confirmed 2026-08-20 → applied → **mis-recorded by Ops the same day** →
corrected in canon → **reversed by Mike 2026-08-26.**

### 2.3 · THEY ARE TWO DIFFERENT ACTS

**The rename is a LEGEND on a track that already exists and already works.**
Mode B is a thing that does not exist. The rename shipped in the same packet
that shipped the ONE SURFACE work; **Mode B was listed in that same packet's
"WHAT WAS NOT DONE"** (§4.2). The two are six days apart in Mike's own timeline
and are recorded on opposite sides of one round's ledger.

**WHAT THEY SHARE IS THE WORD AND NOTHING ELSE** — and that is worth stating,
because the shared word is exactly what would let a later round read the rename
as having already answered Mode B.

---

## 3 · R005'S ATTACHMENT

### 3.1 · WHAT THE RECORD ACTUALLY CARRIES — verbatim, and Ops did not guess

**Mike's note names three things. Two exist in the story and one does not.**

| name in his note | in the corpus? | where, exactly |
|---|---|---|
| **UNIX 6x** | **YES — `UNIX-6x Emulator`** | **Record 005**, DETAILED REPORT: *"> Portal is now up and running on our UNIX-6x Emulator."* Canon `06-PORTAL §10.1`, **PUBLISHED**. |
| **the .exe** | **YES — `TERMINAL.EXE`** | **Record 004**, DETAILED REPORT, inside the cracked ZIP's directory listing. |
| **a .bat** | **NO** | **Zero in-story hits in either repo.** Every `.bat` in the tree is real-world Ops tooling (`launch_mediavault.bat`). |

**RECORD 004's LISTING, VERBATIM** (`robots-record.js:585–594`):

```
    ROOT
     /(many pwd protected folders)
     /PORTAL
       TERMINAL.EXE
       PORTAL_2v16.CFG
       /ANTENNA (PWD)
       /CHANNEL_SELECT(PWD)
       /INSTALL
          QC_101.TIF (hand written notes on form)
```

**TWO OF THOSE FOLDERS ARE MODE A.** `/ANTENNA (PWD)` and
`/CHANNEL_SELECT(PWD)` are the two things the panel now does — the four
switches and the four channel buttons. The listing was written before either
shipped and named both.

**RECORD 005's DETAILED REPORT, VERBATIM** (`robots-record.js:620–625`):

```
  > Portal is now up and running on our UNIX-6x Emulator.
  > It carried its own COMM payload, autosync, etc.
  > The Portal is accessible via the Robots Exhibit.
```

**CANON GUARDS THE NAME:** 06-PORTAL §10.1 — *"WHAT IS NOT ESTABLISHED, AND MUST
NOT BE INVENTED: what UNIX-6x is, who made it, what it runs on, whether it is
period or modern. The line names it and stops."*

**RECORD 005 HAS NO ATTACHMENTS TODAY.** It declares no `docs:` array. Record
004 has one — QC_101. That is why his note says *ADD*.

### 3.2 · THE SAME SHAPE IS ALREADY SCOPED, ON A DIFFERENT RECORD

`docs/BACKLOG.md` item **5**, unbuilt:

> ### 5 · `TERMINAL.EXE` AND `PORTAL_2v16.CFG` AS RECORD 004 ATTACHMENTS
> Both open the Portal, as if arriving through the album. **Scoped and not
> built.** `RecordEntry` already has `section.doors[]` with `kind:"tv"`, which
> dispatches the Portal with a preset and refuses honestly via `door.held`. What
> is missing: a `door` field on a `docs` row (one branch), and a destination for
> the **album** rather than the twin. **Recommended: `/robots?panel=<bankId>`**…
>
> **Both must open the same thing.** Giving them different destinations would
> invent a difference the museum cannot produce.

**THE MECHANISM EXISTS AND IS MEASURED.** `RecordEntry.jsx:582–596`: `fire()`
tests `door.held` FIRST, then `kind:"tv"` dispatches `wb-robots-open-twin` with
`{preset, day}`. A door can be placed inside a sentence with `[[1]]`, and **a
declared-but-unplaced door still renders at the end of the section** rather than
being swallowed.

**`?panel=` DOES NOT EXIST.** No `URLSearchParams` anywhere reads a `panel` key;
the only query readers in `src/` are the Gift Shop's `from`/`owner`/`top` and the
worker's `as-of`. The backlog's recommendation is a recommendation, not a build.

### 3.3 · IS IT THE DOOR TO MODE B — THE HONEST ANSWER

**Not resolvable from the tree, and the reason is specific rather than a
shrug.** A door needs a destination. The tree offers exactly two:

- **the twin** — `wb-robots-open-twin` with a preset. Built, works today.
- **the album/panel** — `/robots?panel=<bankId>`. Recommended in the backlog,
  **not built**, and item 5's own words are that this is *"what is missing"*.

His note says *"Shortcut to the Feed screen"*. **If the Feed screen is the panel,
the attachment needs the destination item 5 says does not exist — and Mode B and
the attachment are the same job seen from two ends.** If the Feed screen is the
running machine, the attachment is item 5's twin destination on a second Record
and is independent of Mode B.

**BOTH READINGS ARE CONSISTENT WITH EVERY FACT IN THE TREE.** Which one is right
is a question about what he means by *the Feed screen*, and §1.1 is why Ops
cannot answer it by looking.

**ONE THING IS CERTAIN EITHER WAY:** item 5's closing rule — *"Both must open the
same thing. Giving them different destinations would invent a difference the
museum cannot produce"* — was written about two attachments on Record 004. **A
third attachment on Record 005 pointing somewhere else is exactly the difference
that rule forbids**, and nothing has ruled on whether the rule reaches across
Records.

---

## 4 · WHAT ALREADY EXISTS TOWARD MODE B

### 4.1 · THE UNBUILT HALF OF THE 2026-08-21 RULING IS NOT MODE B — IT SHIPPED

**MIKE, 2026-08-21:** *"Channels are selected on the portal screen, along with
shake, power, etc."*

Canon 06-PORTAL **§11.1**, heading verbatim: **THE OTHER HALF — *"along with
shake, power, etc."* — BUILT 2026-08-26.**

> **HIS 2026-08-21 RULING HAD TWO HALVES AND ONLY ONE SHIPPED.** The channels
> half did; *along with shake, power, etc.* did not, and the round wrote down
> why: *"there is no machine to control while television is playing."*
>
> **MIKE, 2026-08-26, ruling the other way:** **CH3's surface is the target for
> all four channels** — the same SCROLL, CLICK, POWER, SHAKE and channel strip
> on every one.

| | where it lives now |
|---|---|
| the bezel, the channel strip, **and the 2×2** | the museum — `PortalScreen.jsx`, drawn over all four kinds |
| the four handlers | `twin.html`, untouched |
| the press | `wb-portal-machine-control` → overlay → `postMessage {wb:"portal-control", id}` |
| the power lamp | `postMessage {wb:"portal-power", on}` |

**CONFIRMED ON THE GLASS**, not only in canon: the served Portal draws
`SCROLL` · `CLICK` · `POWER` · `SHAKE` over the picture with the `1 2 3 4 X`
strip beneath, on television, on the test signal and on channel 4's photograph.

**SO THE 2026-08-21 RULING IS FULLY DISCHARGED.** Both halves are built. Mode B
is something else, and reading the 08-21 leftover as Mode B would re-do finished
work.

### 4.2 · WHAT THE TREE SAYS ABOUT MODE B — ONE LINE, AND IT IS A LIST ITEM

`docs/MUSEUM_ONE_SURFACE_LOG-20260826.md` §8, whole:

> ## 8 · WHAT WAS NOT DONE, AND IT IS FOUR THINGS
> **Mode B**, **the bezel 4:3 crop**, **the ADM-3A style** and **CH3's visible
> resize** — Mike's ruling, each its own job and three of them looks.

**TWO OF THOSE FOUR HAVE SINCE SHIPPED** — the 4:3 crop (`b56cc0e`) and CH3's
resize (same). **Mode B and the ADM-3A style have not.** The line is the only
occurrence of the name in either repo, and **it carries no definition** — no
register row, no canon section, no backlog item.

### 4.3 · THE PANEL AS IT STANDS

`panel: { store, nameplate, feed, antenna, dial, latch }` — `portal.js:225`.

| bay | grid area | declares | arms? |
|---|---|---|---|
| **FEED** | `feed` | 5 banks, `NIAC/VIIIp` × 5 states | 3 of 5 |
| **ANTENNA** | `ant` | 4 channels, default `1111`, `unit`/`picture`/`src` per channel | n/a |
| **SOURCE** | `src` | 2 dial positions, `LIVE` / `SEEDED` | `LIVE` only |
| **LATCH** | `latch` | label, `FEED ARMED` / `NOT ARMED`, the twin's event + src + bezel | fires |

**TWO BANKS ARE DISARMED ON RECORD, FOR TWO DIFFERENT REASONS** (`portal.js:309–322`):
`TEST BENCH` because its recipe carries `dev:true` and the six-digit code is
backlogged; `LAST STATE` because *"the recipe it was to be pointed at does not do
what the legend says"* — `idling-updated` has no `resume`, and only `resume:true`
returns a visitor to their own machine.

### 4.4 · DECLARED AND UNBUILT, ELSEWHERE

- `docs/BACKLOG.md` **5** — the two Record 004 attachments (§3.2).
- `docs/BACKLOG.md` **6** — TEST BENCH, the six-digit base-4 code. **4⁶ = 4096.**
  Mike has ruled the sequencing: *"They are meant to require a code. I do not
  want to give them both at the same time."*
- `portal.switch.maint` and `portal.switch.prompt` — two ledger rows for controls
  **struck from the panel 2026-08-21** and kept as record.

---

## 5 · WHAT MODE B WOULD REACH — AND THE CARRIED-FORWARD CLAIM IS WRONG

### 5.1 · A NEW BAY IS NOT A DECLARATION. IT IS A COMPONENT AND TWO CSS GRIDS

**The claim Ops carried forward:** *"the instrument panel is ALREADY an
unconstrained control surface — four bays, data-driven, knowing nothing about
portals — so a new bay is a declaration rather than a component."*

**Measured, it is half true and the wrong half is load-bearing.**

**WHAT IS TRUE:** the panel knows nothing about portals. Bay CONTENT is entirely
data — labels, bank rows, channel numbers, dial positions, arming, the
nameplate. `ANT` renders only if declared. A wing that declares no antenna gets
no antenna bay.

**WHAT IS NOT:** the four bays are **four literal JSX blocks** in
`Exhibit.jsx` — `ip-bay-feed` (`:1669`), `ip-bay-ant` (`:1684`), `ip-bay-dial`
(`:1705`), `ip-bay-latch` (`:1730`) — each hard-wired to a hard-coded CSS grid
area. `Exhibit.css:2594`:

```css
.ip-deck{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);
  grid-template-areas:"feed ant" "src latch";  …}
.ip-bay-feed{grid-area:feed} .ip-bay-ant{grid-area:ant}
.ip-bay-dial{grid-area:src} .ip-bay-latch{grid-area:latch}
```

and again at the narrow breakpoint, `Exhibit.css:2750`:

```css
.ip-deck{grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  grid-template-areas:"feed feed" "src ant" "latch latch"}
```

**BOTH GRIDS NAME EXACTLY FOUR AREAS.** A fifth bay is: a new JSX block, a new
`.ip-bay-*{grid-area:*}` rule, and a re-cut `grid-template-areas` **at both
breakpoints** — because a bay with no area does not fall into place, it falls
out of the grid.

**THE DISTINCTION THAT MATTERS:** the panel is **an unconstrained control
surface for the four kinds of control it already has.** It is not a surface that
accepts a fifth kind by declaration. §0's *SAME EXCEPT DATA* asks whether a
second robot is a data drop; on this surface a second robot is, and **a new
KIND of control is not.**

### 5.2 · WHAT READS A BAY, AND WHAT A NEW ONE COSTS

| reader | what it needs | enforced by |
|---|---|---|
| `Exhibit.jsx` | a JSX block | nothing — it either renders or it does not |
| `Exhibit.css` | a grid area at **two** breakpoints | nothing; a missing area is a silent layout fault |
| `provenance/register.json` | a row for **every visible string** — legend, states, labels | **`provenance:gate`, hard fail.** Default-DENY |
| `reveal/ledger.json` via `ledger-declare.mjs` | a row per control | **`reveal:check`**; and `--write` refuses id drift (the M99 guard) |
| `reveal/delivery.mjs` | a SIGNAGE/publish declaration if it draws an asset | `reveal:check` |
| `panel.store` | `sessionStorage` under `wb-portal-panel` | nothing |

**THERE IS NO CHECK THAT A CONTROL HAS A LEDGER ROW.** Greps of
`reveal/reachability.mjs` for `panel` and `control` return nothing. §0's *A
RULING IS NOT DONE UNTIL A LEDGER ROW MOVES* is discipline, not a gate — and §0
records the case that paid for it: *"The panel was rebuilt and its twelve ledger
rows still described a drum and two bat switches, with every gate passing."*

### 5.3 · THE CHYRON — THE CARRIED-FORWARD CLAIM IS CORRECT, AND HERE IS WHY

**The claim:** *reuse the chyron NOT AT ALL, because every reason it looks that
way is a reason about being over a tube.* **Verified, three ways:**

1. **ITS UNITS ARE THE TUBE'S.** Every metric is `cqw` of the bezel frame —
   `--chy-w:14.8cqw`, `--chy-h:6.0cqw`, `--chy-text:3.10cqw` — and `.ps` opens
   the container they resolve against. `PortalScreen.css:4`: *"They are `cqw` of
   the FRAME … Retype nothing: if the twin's strip is ever re-measured, these
   come with it."*
2. **ITS POSITION IS THE TUBE'S.** `--grp-top:55.359%` is *"the panel's centre y
   less half the group's height"*, and the 2×2 and the strip **share one edge by
   arithmetic** — `2×14.8 + 1.5 = 31.1cqw` against `5×5.26 + 4×1.2 = 31.1cqw`.
   Both centre on the bezel's centre x.
3. **ITS INK IS THE PICTURE.** The glyph is a **knockout** — `--knock`, measured
   at 7.87% of the slug transparent — so *the feed's own texture carries through
   the letterform, and it MOVES, because the feed does.* A knockout over no
   picture is a hole over nothing.

**A CONTROL SURFACE THAT IS NOT OVER A TUBE INHERITS NONE OF THE THREE.** The
panel is the museum's other answer to the same question, and it already exists.

### 5.4 · THE MEASURED FACT ABOUT ROOM, SO IT IS NOT RE-DERIVED

Canon 06-PORTAL §11.1: **THE PANEL IS NOT FULL.** The blank lower-right quadrant
is **37.77 × 28.57cqw**; the whole control group is **31.10 × 20.46cqw** —
**59.0% of it by area**, with 3.33cqw of slack a side horizontally and 4.05cqw
vertically. **An Ops survey called it full** by quoting a `1.24cqw` note from
2026-07-29 that was superseded hours later the same day.

---

## 6 · WHAT IS NOT ESTABLISHED

Named so a later round does not read this survey as having settled them.

1. **What the Feed screen is.** §1.1. Only Mike can say.
2. **Whether Mode B's surface is the existing panel, a fifth bay on it, or
   something else.** Nothing in the tree says.
3. **Whether R005's attachment and Mode B are one job or two.** §3.3 — both
   readings survive every fact.
4. **What a `.bat` is in this story.** It has no referent. Under Doctrine 12 Ops
   may not invent one; it is his to name, as `UNIX-6x` was.
5. **Whether item 5's *"both must open the same thing"* reaches across Records.**

---

## 7 · STATE

| | |
|---|---|
| HEAD at start and end | `8d32319` |
| `git status --short` | empty, both times |
| files changed | **none** |
| commands run | reads only — `grep`, `sed`, `find`, `git log`, `git status` |
