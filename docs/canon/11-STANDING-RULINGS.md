<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# 11 · STANDING RULINGS — Mike's laws that lived only in the ledger

**Carried whole, verbatim, from `STATE.md` on 2026-09-02** when that ledger was cut to a short standing state (the whole ledger is `docs/archive/STATE-FULL-b0525f0.md`). Every section below is Mike's ruling in the words the ledger held; blockquotes are his; headings are the ledger's. Seventeen of these existed nowhere else; six are the bodies of doctrines that `10-LAWS.md` Part Two carries only as lead lines (13, 14, 15, 17, 19, 27). Nothing was reworded. Sections the ledger held that already live whole in the canon (`10-LAWS.md`, `09-PUBLISHED.md`, `06-PORTAL.md`, `07-MANUAL.md`) were not copied a second time; they are in the archive.

`OPS` register where the heading says Ops; otherwise these are story and house laws. **None of them may reach a visitor.**

---

## Ops Rule 0 — THE GROUND CHECK (read before acting)

Before ANY state-changing action — writing a build brief, editing a file, declaring something "done", or any tool call that does more than read — STATE THIS:

> "Ground check: what fact am I acting on, and did I verify it THIS session?"

If the answer is "I remember" / "the log says" / "Cowork reported" / "the doc says" — **STOP. That is the off-ramp forming.** Verify against the live tree first.

Either party may say **"Follow the process"** at any time. It means: halt, verify against the live tree (live tree > git > docs > chat), THEN proceed.

Paid for by the 2026-06-17 derived-era incident: charging into the problem in front of us — building before verifying, trusting a build log over the live disk — produced a corrupted client build and a near-miss. This class of error has cost full weeks before. The trip-wire exists so the stop is an EVENT, not a hope.

Ops work takes top priority, based on the Ops need in the moment.


## THE VISUAL HOOK LAW (Mike, 2026-08-03 — STANDING, site-wide)

> **Land on words alone and the visitor probably walks out. EVERY surface needs
> something visually compelling besides written words — not necessarily a photo;
> even words presented in a different FORMAT can be the hook.**

**What counts as a hook:** a photograph, a plate, a collage, an instrument
panel, an artwork — or a typographic OBJECT (a ticket, a ledger, a poster, a
printed card). **What does not:** a heading, a rule, a pull-quote, or a register
block. Those are typography *of* the words, not something besides them.

**Where it binds hardest:** a LANDING — the first thing a visitor sees on
arriving at a room, or on selecting an album inside one. A face three presses
deep is still governed, but a face you arrive on is urgent.

**It sits beside the trail-marker law, not on top of it.** The marker law says
a visitor keeps one or two things; this one says they have to stay long enough
to be handed either.

**[v51 2026-08-04] THE EXCEPTION, RECORDED ON MIKE'S INSTRUCTION:**

> **A page whose own words are the hook needs no image.**

He gave it while striking BOTH candidate objects at `/booth` — *"THE TITLE IS
THE GRAB, and the copy already says it plainly. A picture arguing with text
that already works is clutter."* The failure it names is specific and both
`/booth` objects had it: **every word on them was already on the page**, so the
object was a picture OF the sentence, sitting on top of the sentence. Where a
surface's landing is a short declarative set large — `/booth`'s credo — the
typography IS the different FORMAT the law asks for.

It is not a licence to stop hooking. It applies where the page's own opening
words are the compelling thing and an object could only restate them; it does
not apply to a wall of running text, which is what the law was written against.

**TWO SURFACES NOW SHIP TEXT-ONLY UNDER IT**, and both are named rather than
quietly excused: `/booth` (register M23a) and the `/robots` FAQ face, whose
tally card went with the unit count (register M29).

Current compliance, every face and page, audited on the built page:
`docs/VISUAL_HOOK_AUDIT-20260803.md`. **As of v43 (E3) ZERO surfaces were
text-only; as of v51 two are, both under the exception above.** The audit named five; there were six — it missed the MGK-VIIIp
album's own FAQ, which is a different face from the front desk's. All six are
now hooked from assets already in the repos, and no new rights question was
opened. What remains ART-pending is the DEPTH of two of them: The Record still
wants its evidence photographed per entry, and The Manual's microfiche reel is
still empty by B8's ruling.


## THE EXPANDER RULE (Mike, 2026-08-06 — STANDING, site-wide)

> **Opening or closing a record MOVES WHAT IS BENEATH IT; THE PERSISTENT PART
> STAYS EXACTLY AS IT IS — no shift, no reflow, no scroll jump above the
> change.** Everywhere a surface expands, not just the Record.

Canonical text + reasoning: `docs/canonical/OPERATIONS.md` §7 Doctrine 19.
Instrument: `anchorTest` in `tools/lap/harness.html` — **zero above is the rule,
and movement below is the correct answer.**

**THE VERTICAL AXIS WAS ALREADY HONEST AND THE HORIZONTAL ONE WAS NOT.** Native
`<details>` moved 0 of 24 elements above it in the booth and 0 of 47 in the wing
FAQs. What moved was every element on the page, sideways: opening a Record entry
takes the document past the window's height, the scrollbar appears, and the
viewport goes 403 → 390. `html { scrollbar-gutter: stable }` in `src/index.css`
ends it for every expander at once, because the defect belongs to the viewport
and not to any expander. A stacked grid row sharing slack with the thing being
opened was the second half (`grid-template-rows: max-content 1fr`).

**The cost is stated:** a page short enough not to scroll is ~13px narrower. A
constant 13px nobody can see beats an intermittent 13px that moves the furniture.


## HE WRITES IN THE RECORD ITSELF (Mike, 2026-08-09 — STANDING)

> **"The two-column worksheet is retired as his writing surface. HE EDITS THE
> RECORD ITSELF, DIRECTLY — every part of it: headline, index line, executive
> summary, sections, notes. NOT side by side. He must feel he is IN THE REAL
> THING as much as feasible… it must be live, it must be the Record, and there
> must still be a COPY BUTTON that hands the whole thing back to Ops in one
> click."**

Canonical: `docs/canonical/OPERATIONS.md` §5, THE RECORD EDITOR row.
The page is `docs/dictation-20260807/record.html` (`npm run record`).

**THERE IS NO EDITOR WIDGET.** It draws the museum's own `RecordEntry` and
`RecordIndexRow` and makes the museum's own paragraphs `contenteditable`, so
**there is no second copy of his text anywhere on the page** — which is the only
thing that makes a copy button honest. **THE FIDELITY IS MEASURED, NOT ASSERTED:**
at 390px the museum and the editor both compute `.vp-flat` **344.56px** and a body
of **15.3408px**. **Nothing in the editor's own stylesheet may change the size or
position of anything the museum draws** — the type ramp reads both viewport axes,
so every control floats and the only box-model property applied to a museum
element is `outline`.


## AN ASSET CULL ASKS WHAT BUILDS FROM A FILE (Mike, 2026-08-20 — STANDING)

> **"An asset cull must ask what BUILDS from a file, not only what DISPLAYS
> it. Both files were judged on how they looked standing alone."**

Canonical: `docs/canonical/OPERATIONS.md` §7 Doctrine 27.

**IT WAS PAID FOR TWICE ON CONSECUTIVE DAYS.** `monitor_base.png` (2026-08-12)
and `MGK-TWIN_MONITOR_SCREEN_BEZEL.png` (2026-08-13) were culled as wall plates
— correctly, as standalone pictures. `twin.html` **probes the first to decide
whether the Portal exists at all** and **composites the second over the feed on
every draw**. The Portal was dead from 12 August and nobody met it until the
20th.

**`assets:orphans` HAD THE FACT AND COULD NOT SAY THE CONSEQUENCE** — it
reported the missing row the whole time, and a missing row reads as dead
bookkeeping until something is still loading it.

**SCOPED, NOT BUILT** (Mike's instruction): a reference check in `assets:cull`
that refuses a delete when any source tree names the basename — **about half a
round**, and it catches both files. A manifest of build inputs costs more and
keeps the same hole. **Until then it is a human step:** grep the basename
across both repos before a cull; if anything outside the asset table names the
file, **the cull is a code change and not a cull.**


## THE OPS DESK — ONE PAGE, EVERY INSTRUMENT (S1, 2026-08-07 — STANDING)

> **A launcher must not draw a link to a file that is not on disk.**

`npm run desk` → `docs/OPS_DESK.html` (eight instruments, one page) and
`docs/OPEN_ACTIONS.html` (the register, rendered from its markdown). The desktop
shortcut is `Weird.Baby Ops`, re-creatable with
`tools/ops-desk-shortcut.ps1`. **A dead link on a launcher is worse than an
absent one** — a 404 reads as *the tool is broken* when the truth is *a generator
has not been run* — so every card is stat'd and a missing file gets a red card
and no link. **"Current" is a property of the generator behind each page, never
of the launcher**, so each card prints its own mtime and its own rebuild command.
**It is phone-LEGIBLE and not phone-REACHABLE, and that is stated rather than
solved** (`S-d`): these pages' subject is the museum's own housekeeping, which
Doctrine 11 refuses at a live address. Full rules: `OPERATIONS.md` §5.


## REFERENCE AND WORK DO NOT SHARE A PAGE (Mike, 2026-08-07 — STANDING)

> **"If it is reference, write it as such. If it is the firehose I have to drink
> from to do anything, thanks, pass."**

`docs/dictation-20260807/worksheet.html` is the instrument — 32 slots across two
weeks and ten days, Ops on the left and an input on the right, saving to browser
storage as he types, with one button that gathers every response into plain text.
`reference.html` holds everything that explains the machine. **The page they
replace failed on neither accuracy nor tone: it spent his attention describing
the machine before he could use it, and then had nowhere for him to write.**

**An instrument must degrade honestly:** a refused `localStorage` raises a red
banner rather than losing an hour of typing on a reload, and a refused clipboard
leaves the assembled text selected with a line saying so.


## NOTES TO MIKE ARE NOT PART OF THE UX, EVER (Mike, 2026-08-06 — STANDING)

> **Notes to Mike render in red (or an equally unmistakable treatment) meaning
> NOT PART OF THE UX, EVER — so a note can never be mistaken for content. None
> of them can reach a visitor in the LAUNCH stage.**

**IT DOES NOT REVERSE P5; IT ENFORCES P5 TWICE.** P5's sentence — *they must
never be visible to visitors* — is untouched. What was wrong is what was wrong
with the pull-back rule before THE VISIBILITY RULE: the scrub had only ONE state,
so the only way to obey it was for Mike to be unable to see his own list either.

**THREE PARTS, AND THE THIRD IS THE ONE THIS HOUSE KEEPS PAYING FOR.**
1. `opsSentences` / `opsNotesOf` in `src/lib/visitor-prose.js` lift the marker
   sentences OUT of the prose. **`visitorProse` is unchanged to the character**,
   so the body copy is identical in both stages and the page Mike reads is
   exactly the page that ships.
2. The two render seams (`Exhibit.jsx`, `InfoBooth.jsx`) print them in
   `.wb-ops-notes` — red, dashed, monospace, `data-not-ux="1"`, and styled with
   **no `--wb-*` token**, so it can never come to look like the museum. Present
   in DEVELOPMENT only.
3. `wb-ops-notes` in `vite.config.js` deletes the sentences from the SOURCE at
   LAUNCH. **35 markers in the built bundle → 1, and the one is `PAPA_MARK`, the
   regex that removes them.** It is an AST pass, not a regex over literals,
   because marker sentences straddle concatenated literals and a per-literal rule
   would ship copy Mike never approved.

Part 3 exists because parts 1 and 2 are a runtime filter, and **a runtime filter
stops the RENDER while still shipping the MATERIAL** — R5's 153 mp3 URLs, H1's
whole reveal ledger, V1's twenty-six withheld addresses, and now this.

**What it cannot reach:** `public/held/robots/twin.html` prints 76 operator slots
on its own glass and is not a module. Unreachable at launch only because the
stage door refuses `/held/`. Register row N-k.


## ONE PASSAGE, ONE DECLARATION (Mike, 2026-08-06 — STANDING, site-wide)

> **If the same passage is in two rooms, one of them is the source and the other
> one references it.**

His reason is the doctrine: *"he edited the contact answer once and it survived
elsewhere; that is the defect, not his memory."* A duplicated passage does not
fail on the day it is written — both copies are true then. It fails on the day
somebody edits one, and it lands on that person as a doubt about whether they
remembered to do the other. **The defect is not the drift; it is that the tree
gives an editor no way to tell.**

An import, not a copy: `src/data/house-copy.js` for a passage more than one room
must say, a module constant for twins inside one file, and **derivation where the
second copy is a mirror of data** — the strongest form, because it deletes the
copy rather than linking it. The hoisted string stays a plain literal, or it
falls off the provenance boundary in silence. **Where two copies have DIVERGED
they are REPORTED and not merged**, because choosing between two live wordings is
a decision about what the museum says.

Canonical text + the four constraints: `docs/canonical/OPERATIONS.md` §7
Doctrine 17. Paid for by a hand-typed mirror of Hunter Root's whole catalogue at
`/hr/archive` that survived six museum-wide figure sweeps, because a sweep looks
for FIGURES and this was a second COPY.


## WE DO NOT SERVE WHAT WE WERE NOT GIVEN (Mike, 2026-08-06 — STANDING)

> **"WE DO NOT HAVE HIS PERMISSION. He was never reached, the ask was never
> answered, therefore it is not granted — and that is precisely why WAL is a
> sample platter instead of a single-artist wing. The vault keeps the material;
> the site stops serving it."**

**SILENCE IS NOT CONSENT, AND THAT IS THE WHOLE OF IT.** An ask that went
unanswered is an ask that was refused for every purpose the museum has. The vault
may hold anything the museum lawfully acquired; **the SITE may only serve what the
artist put out themselves.** Where the museum wants to surface an artist's music,
it EMBEDS the artist's own upload — a reference, not a copy — which is the posture
Carsie Blanton, Jesse Welles and Mikey Mike have always stood in and which Hunter
Root now stands in too.

**IT IS A POSTURE ABOUT SERVING, NOT ABOUT HOLDING.** Nothing leaves MediaVault.
The catalogue is still listed, the tracks are still named, the accessions are
still cited — a museum prints its provenance. What stops is the streaming.

**MECHANISM, so this is a rule with a gate rather than a rule with a memory:**
`src/data/exhibits/vault-audio.js` → `stripVaultAudio`, called at BUILD (the
`hr-vault-audio` plugin in `vite.config.js`) and at RUNTIME
(`hunter-root-served.js`). Both passes are required and neither is decorative —
**a runtime filter stops the requests and still ships the addresses**, and the
first build after the filter went in carried 153 vault mp3 URLs in plain readable
text.

**WHAT IT COST, because a rule whose price is hidden gets quietly reversed:** 60
of Hunter Root's 93 tracks have no official upload anywhere and are now unplayable
on `/hr`, including the whole of Run With The Hunt and the Phone Recordings EP.
`docs/OPEN_ACTIONS.md` **M71**. His images are still served off the museum's host
and are the same question, unruled — **M73**.

Canonical mechanism notes: `docs/canonical/OPERATIONS.md` §5, THE VAULT-AUDIO
BOUNDARY. Round log: `docs/MUSEUM_PORCH_RULINGS_LOG-20260806.md`.


## THE FOUNDATION'S TONE RULING (Mike, 2026-08-05 — STANDING, the whole wing)

> **This is NOT asking people to dig deep and give a little. It is looking for
> the LIKE-MINDED — people who would prefer not to hoard more wealth. All are
> welcome, but this is not Oprah asking her fans to donate while she is rich
> herself.**

Canonical text + the four tests: the header of `src/routes/Foundation.jsx`.

**It is a ruling about WHO IS BEING ADDRESSED**, which is why it cannot be
satisfied by softening an ask. An appeal — however gentle, however well-argued —
casts the reader as a giver and the house as a recipient, and the second half of
his sentence says why that is the wrong shape: the house is not standing on the
other side of the counter with its hand out. The room is a STATEMENT OF TERMS,
published so that people who already think this way can recognise it.

**The four tests.** Does it ask? · Does it flatter the giver, or thank them in
advance? · Does it argue the house's NEED — need is leverage? · **Would it read
differently if the reader were richer than the house?** If yes, it is the Oprah
sentence and it goes.

**Audited against the live copy on the day it was given: the wing already
passes, and nothing was rewritten under it.** That is recorded because a ruling
that changed nothing on its first day gets assumed decorative. What it does is
bind the next line.


## PARITY IS ABSOLUTE (Mike, 2026-08-05 — STANDING; REVERSES AN OPS RULING)

> **NIAC and VIIIp carry THE SAME MENU ITEMS, no more, no less.** The gaps are
> TEMPORARY HOLDINGS, not design — NIAC will run on the Portal on channels 1/2
> and it will have a manual. **So NIAC's rows exist and say plainly what is not
> there yet.**

**It overrules the Ops ruling of the previous round**, which held that a holdings
gap RESOLVES a menu divergence. That argument was THE STUB LAW's own and it was
airtight about the holdings AS THEY ARE — and blind to the one thing that
mattered: **the material is coming.** A row is a promise only when nothing is
behind it and nothing is on the way; a menu that hides a shelf until the day it
fills rearranges itself under a returning visitor.

**THE STUB LAW IS OVERRIDDEN FOR THE MAINFRAME'S MANUAL AND FAQ ROWS AND FOR
NOTHING ELSE.** Mike's reason is the exception's edge, and it is written where
the rows are: *a row is a promise only when nothing is coming, and these are
coming.* **Doctrine 12 is not suspended inside them** — a row says what is NOT
held and invents no section list, no date, no page count and no schedule.

Enforced by `npm run parity:gate`, which is **a packet gate now**: it used to
report a judgement and it now reports a fact with one right answer.


## THE CONTRIBUTIONS MODEL (Mike, 2026-08-03 — standing; built at v43/E1)

Recorded here before it was built, on Mike's instruction. The room that carries
it is `/foundation`; the honest state of each mechanism is printed ON that page,
per row, in a state column.

**MONEY IN** — merchandise sales · music royalties · QR-code donations (a fixed
amount or a custom one, given in Weird.Baby's name).

**GOODS AND SERVICES IN** — online gift registries so supporters can DROP-SHIP
supplies directly; the same mechanism for services. **WE LIST ONLY WHAT WE
NEED.**

**CONTRIBUTED BY MIKE, VIA ZERO-COST INVOICES**, itemised: AI ($100–200/month),
domain costs, robot design and development supplies, manufacturing, the extras.
**Not for tax purposes today** — the point is the ledger being honest and
public. *(Hook noted, nothing built: an eBay-purchase tally may be added to the
invoice someday.)*

**THE POSTURE, and it is the room's heart:** *"We still do a fair amount of the
donating ourselves, and will simply continue until we no longer can."*

**THE CONSTRAINT THAT GOVERNS ALL OF IT:** honest about what exists today vs
what is planned. **Nothing may claim a mechanism that isn't built** — if the
registry does not exist yet, the room says so plainly.

**BUILT STATE as of v43:** LIVE = the gift shop, the house's own music.
NOT BUILT = donations in Weird.Baby's name, the supply registry, the service
registry. The invoice is real and carries one published figure (the AI line);
the other four are Papa's to publish.

**[v54/F5 2026-08-05] TWO ADDITIONS FROM MIKE, AND A THIRD HELD.**

- **THE RULE FOR EARMARKED MONEY**, now the money section's second law, set the
  same way *"We list only what we need"* is set: **"Money given for a cost is
  spent promptly on that cost, or it goes back. Nothing is pooled and there is
  no slush fund."**
- **THE MECHANISM**, one sentence of invoice small print: **a cost carried by
  somebody other than the keeper takes its own line on the invoice, in the name
  of whoever carried it.** A standing rule of that document, true before it has
  an instance — the same way the register's NOT BUILT rows are true before they
  are built.
- **HELD: TWO REAL HOUSEHOLDS.** He supplied two zero-cost invoice lines naming
  real people against real costs (the domain; the stickers). **They are in no
  file in this repository** — not `src/`, not the round log — because consent to
  be named on a public page is not the museum's to assume on somebody else's
  behalf, and this house has already taken a name off the glass once for less
  (CS 2026-08-04, the operator's own). **The rule and the mechanism needed no
  name to be true, which is why they shipped and the lines did not.** One word
  per household unblocks it: `docs/OPEN_ACTIONS.md` M38.

**THE ONE RECONCILIATION IT FORCED,** flagged for Mike: `/foundation` Q7 (**since
v54/F6 titled "Can I donate?" — his own title; the answer below is unchanged**)
answered a flat *No*, written when the only money in this building
was money to RUN it. Three incoming channels make that answer wrong on its own
page. It was NARROWED, not reversed — every word about the museum's costs
survives, including "there is no account to fill"; what is added is the
distinction it always rested on, that giving is the other direction and a gift
made in Weird.Baby's name was never Weird.Baby's money. **If Mike wants the flat
No back, that is one string.**


## EVERY VISIBLE STRING CARRIES ITS ORIGIN (v48, 2026-08-04 — STANDING)

> **`npm run provenance:gate` runs on every packet, beside lint and build. A
> visitor-facing string that nobody has declared the origin of fails it.**

Canonical copy with its reasoning: `docs/canonical/OPERATIONS.md` §7, Doctrine
13. The model, the exclusion rules and the honest hole-list:
`provenance/README.md`.

- **Classes:** MIKE · VERIFIED · DERIVED · HOUSE · RESTATED, plus a **capped**
  INVENTION holding pen for what has no origin and awaits Mike's ruling.
  MIKE/VERIFIED/DERIVED need a source; RESTATED needs a reference that RESOLVES
  and **may not point at its own file**.
- **A row is keyed by a hash of the string.** Edit a declared line and its
  declaration stops covering it. Proven: appending *", since 2019"* to an
  already-sourced booth answer failed the gate.
- **WHAT IT CANNOT DO, and it must never be described without this:** it cannot
  verify a declaration is TRUE. Nothing can. It cannot read text inside an
  image (`assets.json` + a human looking is the compensating check), cannot
  detect a correctly-cited number going stale, and **does not replace Doctrine
  11** — a perfectly-sourced line whose subject is the making of the museum
  still passes it cleanly. Both doctrines are required.


## THE OPEN-ACTION REGISTER (Mike, 2026-08-04 — STANDING)

> **`docs/OPEN_ACTIONS.md` is the ONE place open items live, and every round
> updates it in the commit it seals.**

Canonical copy with its reasoning: `docs/canonical/OPERATIONS.md` §7, Doctrine
14. Rows carry: what it is in one line · where it came from · status (OPEN /
IN PROGRESS / RULED-AWAITING-BUILD / DONE) · owner (Mike / Ops / Code) · date
raised.

**Why it exists:** every round since v40 wrote an honest *"what this exposes"*
section into a round log nobody re-opens. Mike's own words: *"Mike has no way to
see what is already reported."* **Reporting is not recording.** The round log
stays the narrative; the register is the ledger. It is not a priority order —
everything in it is open and sequencing is Mike's.


## THE RECORD APPROVAL GATE (Mike, 2026-08-04 — STANDING)

> **Final sign-off on a Record is Mike personally inspecting EVERY thing
> presented in it. Ops ensures nothing escapes that inspection.**

Canonical copy: `OPERATIONS.md` §7, Doctrine 15. Wired to
`provenance/asset-table.json`'s `verdict` field — **unset by default, never
written by Ops**. `npm run assets:checklist -- --room <slug>` prints the
inspection; `npm run assets:gate -- --room <slug>` exits 1 while anything
presented lacks a `pass`.

**It is NOT a packet gate and must not become one.** lint, build and
`provenance:gate` check things Ops can fix; this one checks whether MIKE HAS
LOOKED, and wiring it into the packet would block every commit on an inspection
nobody has asked for — the opposite of Mike's own condition, that he must not
have to perfect assets in advance. **What it cannot do:** it records that a
verdict was given, not that the inspection was careful; and `assets.json` is
keyed on the PATH, so an approved picture can be swapped under its own verdict.


## THE IDENTITY (Mike, 2026-08-03 — standing, outranks every prior naming pass)

**It is THE MUSEUM.** No singer-songwriter qualifier, no solo-artist
qualifier, nothing narrowing — all-encompassing.

F7c had rendered four candidates behind `/?subtitle=2..4` and asked Mike to
pick; he picked none of them, because all four named a CLASS OF ARTIST and
every one of them was a fence. The building already holds a machine wing and a
wing of other people's records — "a singer-songwriter museum" was untrue the
day the robots opened and would have to be re-argued at every new wing. A name
that has to shrink to stay accurate is the wrong name.

BUILT (M-ID): the lobby subtitle reads **"The Museum"**. The candidate array
and the `?subtitle=` preview are retired with it — a shown-then-asked device
that outlives the asking is four dead strings plus a live URL that still
renders a retired identity.

**[L1 2026-08-05] AMENDED, NOT REVERSED — it reads "Weird.Baby Museum" now.**
Mike, reading the Lobby: *"'The Museum' becomes 'WEIRD.BABY MUSEUM' — it must
match the Robots / Music / Foundation branding."* **M-ID's ruling stands in
full**: it struck four candidates because each named a CLASS OF ARTIST and so
fenced the building in, and a name that has to shrink to stay accurate is the
wrong name. **A house name shrinks nothing** — it says whose museum this is,
which is the one fact the rest of the lobby board already carried and this line
did not. The string is stored in title case and `.wb-subtitle` uppercases it, so
the glass says WEIRD.BABY MUSEUM and the data matches every other house name.
The sweep found this was the **last** place in the building still saying
anything else; the share tags, the booth's credo and the Foundation's invoice
were already correct. **The corner watermark went with it** — `weird.baby` was
the DOMAIN and now reads `Weird.Baby`.


## THE PERSONALITY MAP (Mike, 2026-08-03 — standing, governs voice everywhere)

Each surface has its own register. Copy, imagery and tone answer to the room
they are standing in, not to a single house voice.

| Surface | Register |
|---|---|
| **FRONT PAGE** (`/`) | Short, concise. Don't scare anyone. Heavily philanthropic. |
| **ROBOTS** (`/robots`) | Liberal, artistic, creative, sci-fi. |
| **W.B MUSIC** (`/wb`) | Joyous celebration · complete silliness · political unrest. |
| **WAL** (`/wal`) | The ARTISTS shine. W.B does not overshadow. W.B is a listener in the room with everyone else — it just happens to be W.B's room. |
| **GIFT SHOPS** (`/shop`) | Trustworthy places to do business; the return to normalcy of the real world. |

Consistent with THE SPOTLIGHT DOCTRINE (below) for WAL, and it extends the same
logic to every other room: the frame takes the register of what it frames.


## THE NO-HIDDEN-INFORMATION LAW (Mike, 2026-08-03 — standing, site-wide)

**Everything visible at once, always.**

Card-advance and next-buttons are a sneaky way of adding pages. People will not
flick to discover whether something is interesting — a visitor who has to
operate a control before they can find out what is behind it mostly does not,
so paged content is hidden content wearing a button.

- **Links exist to take a visitor somewhere BIGGER, not to turn a page.**
- **The one exception is slideshows** (a reel is a reel; it declares itself).
- The original vision holds: **one page per exhibit, offsite links only,
  artifacts below the line.**

This SUPERSEDES the staged pager wherever the pager turns pages on the visitor
(`faceFlow` staged wings — robots; and any surviving card-advance on WAL). The
Stage's no-scroll law survives only in W7's reading: no inner scroll traps; the
DOCUMENT is the one thing that scrolls, which is ordinary reading.


## THE RELEASE DOCTRINES (Mike, 2026-08-02 — standing, govern what we build toward)

Three rulings about SHAPE OF RELEASE rather than shape of a page. They govern
what the museum is filled with and when, and they outrank a nice idea that does
not serve them.

**D-BINGE — launch with multiple weeks already in the Record. Design for the
binge-watcher.** A visitor who arrives on day one should find a body of work to
fall into, not a pilot and a promise. The consequence for BUILD is that every
container must read well at volume and must PAGE, not scroll and not truncate:
a Record of ten entries and a Record of four hundred are the same component, and
the one that breaks at four hundred is not finished. (This round's B5/B9 work is
directly downstream — the stage now pages a wall at any width, and the Record's
model takes evidence classes so there is more than paragraphs to binge.)

**D-EPISODE — the weekly rhythm.** Teasers, "on last week's episode", and shorts
during the week; then WHAM, a FULL EPISODE — not an "update". Across all
storyfronts at once: many plates spinning, most wobbling, are they adding more,
oh no — that was a close one. The register is serial television, not a changelog.
The consequence for BUILD: an episode needs a slot that can carry a WEEK
(something dated, something that accumulates, something a visitor can walk back
through) — which is what the Record is, and why it is the wing's spine rather
than one of its pages.

**D-WEEKLY-EVERYWHERE — new content surfaces WEEKLY across the entire W.B
domain, and information stays current. Handled by AUTOMATION, not humans.**
Recorded this round as doctrine; nothing is built for it yet. What automation
would need, noted while the ground is fresh so the next round is not scoping
from memory:

- **A source of truth per storyfront that is not a JSX file.** HR already has
  one (MediaVault → `npm run export-artifacts` → `hunter_root.json`). WAL and
  robots are hand-authored JS — an automation cannot write to them safely. Any
  weekly pipeline starts by giving those two wings a data file it can own.
- **A dated spine.** "What is new this week" is unanswerable without a date on
  every artifact. MV artifacts have one; WAL/robots faces mostly do not. The
  Record's `stamp` is a display string, not a date — it would need a real one.
- **An idempotent publish step.** The existing release flow is 4 manual steps
  and step 2 is the one always missed (see Release flow, below). Automation means
  that flow runs itself and PROVES it ran — the before/after artifact count rule
  already exists precisely because a silent shrink is invisible in a diff.
- **A currency check, not just a publish.** "Information stays current" is the
  harder half: something must notice a dead link, a delisted video, a stale
  "what they are up to". That is a crawler over the trail/door URLs the wings
  already declare, reporting rather than editing.
- **The blocker to name honestly:** MV runs on Mike's laptop and the sandbox
  cannot reach it (OPERATIONS §8 / CLAUDE.md quirk 11). Weekly automation that
  depends on MV needs MV reachable on a schedule, or an export that lives
  somewhere a scheduler can read. That is a hosting decision, not a code one, and
  it is the first real question of this workstream.


## THE PALETTE + SET RULINGS (Mike, 2026-08-02 — standing; answers B7's J1/J2/J3)

Three rulings closing the judgment calls the adversarial review listed rather
than guessed at (`docs/TEMPLATE_ADVERSARIAL_REVIEW.md` §3). J1 and J3 are BUILT
(THE LONG HAUL, v36); J2 is a ruling only, by Mike's own instruction.

**J1 — THE RETIRED 2025 GOLD IS RETIRED EVERYWHERE.** `#b8974a` is the pre-2026
gold-on-dark accent; the museum's `--wb-gold` has been photo black since the B&W
rework. It survived by inertia on thirty sites, **the player bar's play, volume
and CC buttons included** — the most-used control in the building. Mike's answer
to the review's "(a) leftover or (b) deliberate surviving accent" is (a):
**it goes, the player bar included, and every site conforms to the current
palette.** Built: all live sites now read the ramp (`var(--wb-gold*)`), which in
inline styles and in the bar's re-pinned dark scope resolves against whatever
ground the element stands on — no second palette is created. NOT touched and
listed for Mike: the other five variant-type colours (green/purple/blue/two
browns), which are a whole pre-2026 vocabulary already standing on his backlog.

**J2 — THE B&W LAW AND THE LIVE TWIN: no practical difference, and the twin is
already black and white.** No build, ruling recorded. The wing's law governs
PHOTOGRAPHS; the Portal's twin is the machine's own running screen (an iframe of
a separate application), and it is monochrome as it stands. Grayscaling it would
mean reaching into another application to change nothing a visitor can see.

**J3 — THE WAL SHOP PRESENCE IS THE SET OF FOUR, ALWAYS.** They are a set and
are sized as a set. **A WAL exit that resolves no individual owner shows the WAL
four with no W.B — THE SET IS THE FALLBACK.** This closes clause 6 of the billing
law below: the empty top slot on `?from=wal` with no (or an unresolvable)
`&owner=` is not an omission, it is the answer. Billing the house there would
break Clause 3, which is the original defect Mike reported. Built as a NAMED
branch (`walSetFallback` in `GiftShop.billing()`) and said out loud in the DOM
(`data-billing="wal-set"`), so it cannot be deleted by the next change to the
markup. All seven exit cases re-verified.


## THE SPOTLIGHT DOCTRINE (Mike, 2026-08-02 — standing, governs WAL and any celebration wing)

The museum is THE FRAME — it neither detracts nor distracts; done right it
enables the art to reach full potential. THE ARTISTS BRING THE COLOR — their
photos, videos and thumbnails ARE the color. WAL is NOT held to the robots
wing's technical voice; it is a colorful celebration. Set the stage, drop the
house lights, cue the music, spotlight — the only place to look. Cecil B.
energy. (The B&W site law does NOT apply to WAL — W8.)


## THE GIFT SHOP BILLING LAW (Mike, 2026-08-02 — standing, recorded on his order)

Governs who appears on `/shop` and in what order, on every exit and every
arrival. Implemented in `src/routes/shop/GiftShop.jsx` (`billing()`), driven by
`?from=<wing>` plus `&owner=<album-id>` where a wing's albums are artists.

1. **The exhibit's OWNER gets top billing on exit.** For a one-artist wing that
   is the wing (`/hr` → Hunter Root); for WAL it is the ARTIST whose album the
   visitor left, which is why the exit now carries `owner=`.
2. **Everyone else lists beneath by DATE STARTED WITH US, earliest first.**
   The dates live on the artist data (`since:`) and are read off this
   repository's own record — HR 2026-04-05 (first MV accession), W.B
   2026-07-06 (the house exhibit opened), the WAL trio 2026-07-30 (the wing's
   build). Ties break alphabetically.
3. **WEIRD.BABY IS LISTED ONLY WHEN THE EXHIBIT WAS WEIRD.BABY'S OWN**
   (`/wb`, `/robots`) — otherwise W.B does not appear at all. This is the
   clause Mike reported broken ("WAL is putting W.B on the gift shop page").
4. **Direct arrival at `/shop` — THE HOUSE TAKES TOP BILLING AND ALL ARE
   SHOWN.** [MIKE RULED 2026-08-02, B1.] P11 stated an Ops reading here —
   nobody billed, house merely listed — and invited an overrule; this is it.
   A direct arrival is not an absence of an owner, it is the HOUSE'S OWN ROOM,
   so Weird.Baby takes the top slot the way any wing's owner does on exit and
   the roster beneath is everybody. Applies to every no-exhibit-exit case.
5. **The view resets before every entry** [B1] — no stale billing, and no
   stale SIGHT of it: the browser's restored scroll offset could otherwise
   land a returning visitor below the top billing that is the room's whole
   message. `scrollRestoration:"manual"` + scroll-to-top on arrival and on any
   change of who is billed; the browser's own behaviour is restored on exit.
6. **The one case the law leaves unbilled** is a WAL exit that names no owner
   (`?from=wal` with no `&owner=`). It cannot bill the house without breaking
   Clause 3, so the slot stays empty. Unreachable in practice — the wing always
   sends `owner=` — but a stale link in the wild would land on it. Open for
   Mike (review J3).

