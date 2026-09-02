# THE MARKED PAGE — built. And the Portal section proposed. (2026-08-19, round 4)

**Status: BUILT AND VERIFIED ON THE GLASS. Not pushed, not deployed.**
Gates at the foot.

---

## WAITING ON MIKE

1. **THE PAGE, AS BUILT** — §2 is the layout description. Four strikes, three of
   his phrases, his monogram, a PRELIMINARY stamp. Everything readable is a
   phrase he actually wrote; only the strikes and the stamp are drawn.
2. **THE ONE DELIBERATE RULE-BREAK, NAMED RATHER THAN TAKEN QUIETLY.** The
   page is the CAREFUL hand throughout — except the monogram, which exists only
   in the loose column. Ops' reasoning: *a signature is the one mark a person
   does not vary by mood.* If that is wrong the page needs a careful-hand
   initial, which is two minutes with the same pen.
3. **THE PORTAL SECTION** — §5, twelve positions, one line each. Not written.
4. **`CLAUDE.md` IS 1108 LINES AGAINST ITS OWN ~600 CAP** and this round did not
   add to it. Archiving is a round of its own.

---

## 1. WHAT WAS RULED, AND WHERE IT LANDED

| Ruling | Where it is in the tree |
|---|---|
| The four values are EVEN / FULL / 7 BIT / 1 | `MARKED_PAGES` in `manual_structure_build.py`, as four `("strike", …)` rows |
| The pen strikes the WRONG option, leaving the right one standing | same — and **PZ-a closes**, §4 |
| Grey ink, no `[data-colour]` exception | nothing declared anywhere; verified on the glass at `grayscale(1) contrast(1.03)` |
| Mark the page, not the derivative; two real files | `--marked-only` writes `pages/marked/page-47.png`; `pages/page-47.png` **byte-identical to HEAD** |
| Insert after the copier and the dirt, before the noise and the skew | `render_page`, in the block commented *SOMEBODY WRITES ON THE COPY* |
| The attachment: "Marked copy 01 - Bias settings", fourth and last, not a scan | `robots-record.js`; verified on the glass, §3 |
| Mike is PEN WRITER | logged in `assets.json`, in `robots-record.js`, and here |
| 3-14 reserved, not spent | `reserved-date-3-14-65.png` cut, indexed, **not placed** |

---

## 2. THE PAGE — layout description

**Appendix B, page B-1 (physical page 47). One hand: CAREFUL.**

```
   ┌──────────────────────────────────────────────────────────────────┐
   │  Appendix B                              MODEL MGK-VIIIp         │
   │ ──────────────────────────────────────────────────────────────── │
   │                                                                  │
   │             P R E L I M I N A R Y   ← rubber stamp, -7°,         │
   │                  APPENDIX B           struck across the head.     │
   │                 BIAS SETTINGS         BIAS SETTINGS survives.     │
   │                                                                  │
   │  B-1.   GENERAL.                                                 │
   │         …four paragraphs, untouched…                             │
   │                                                                  │
   │         The settings are:                                        │
   │                                                                  │
   │           1  PARITY    O̶D̶D̶ / EVEN     ╭ CHECK W/ FAR SIDE FIRST  │
   │           2  DUPLEX    H̶A̶L̶F̶ / FULL    ╯  (his hand, right margin)│
   │           3  WORD      7 BIT / 8̶ ̶B̶I̶T̶                             │
   │           4  STOP      1 / 2̶                                      │
   │                                                                  │
   │         The values are not given in this manual…                 │
   │         …to another far end is to be set                         │
   │         again.              SEE 7-14   ← his hand                │
   │                                                                  │
   │         A disagreement in any one of the four…                   │
   │                                                                  │
   │  B-3.   ENABLE, SET, ADJUST.                                     │
   │                                                                  │
   │         [ TEXT REQUIRED ]   ASK ENGINEERING   ← his hand         │
   │                                                                  │
   │                                            ⟨monogram⟩            │
   │ ──────────────────────────────────────────────────────────────── │
   │  ABEAL 8P-OMI-1                                          B-1     │
   └──────────────────────────────────────────────────────────────────┘
```

### The four strikes

| Line | Struck | Left standing |
|---|---|---|
| 1 PARITY | **ODD** | EVEN |
| 2 DUPLEX | **HALF** | FULL |
| 3 WORD | **8 BIT** | 7 BIT |
| 4 STOP | **2** | 1 |

**First, first, second, second** — not one column, which is what stops four
strikes reading as a pattern rather than as a hand.

Columns computed off the layout, not guessed: every settings line sits at col
12 and its value column at col 25, read out of the generator's own `page["ops"]`.

### The three phrases, and why each is where it is

| Mark | Where | Why there |
|---|---|---|
| **CHECK W/ FAR SIDE FIRST** | right margin, beside the four-setting block | It is what B-1 already says (*"set to agree with the far end"*), in his own words, at the block it governs. **And it carries his own slip** — he wrote FAR SIDE here and FAR END on the other half of the sheet; the manual says FAR END. Not corrected. |
| **SEE 7-14** | end of the paragraph beginning *"The values are not given…"* | 7-14 is THE VIDEO LINK — the paragraph that says the link opens only where these four agree. A real cross-reference inside the document, and a hook: follow it and you land on the Portal's own theory. |
| **ASK ENGINEERING** | beside B-3's `[ TEXT REQUIRED ]` | A pen holder meeting an unwritten paragraph writes exactly that. **This is the channel** — a note in the open saying what is still needed. |

### Considered and not used — so you can overrule

| Phrase | Why not |
|---|---|
| SAME AS B-3? | B-3 is a procedure, not a settings table. It would assert a relationship that is not there. |
| NOT FOR FIELD UNITS | Invents a distribution fact. |
| SUPERSEDED! / SEE REV B | Asserts a revision B. The manual's own line reads `REV. - / PRELIMINARY`. |
| DOES NOT APPLY | Beside a block that plainly does apply. |
| everything in the LOOSE hand | Escalation is a resource; page one is not where to spend the angry hand. |
| **3/14/65** | **Reserved. It is pi, and 3-14 is the reserved paragraph.** |

### The stamp

`PRELIMINARY`, red-stamp geometry rendered grey: 5.8 mm caps, letter-spaced,
rotated −7°, struck across the appendix head so it crosses **APPENDIX B** and
leaves **BIAS SETTINGS** legible. It agrees with the document rather than
asserting anything new — the revision line already reads `REV. - / PRELIMINARY`.

**Its inking failed at two scales on purpose.** One smooth field is a *gradient*,
which reads as a lighting problem — the first cut did exactly that and had to be
measured to be seen. Real stamping has broad soft unevenness **and** small hard
voids where the rubber did not touch. Two noises: coarse and smooth for the
shading, fine and hard-edged for the holes.

### The initials

`loose-monogram` — scribbled over itself, illegible by design. **The one
deliberate exception to one-hand-per-page** (see WAITING ON MIKE 2).

---

## 3. VERIFIED ON THE GLASS, NOT REASONED

Loaded `/robots` in Chrome, opened Record 003:

- **The fourth attachment is there, last:** *Marked copy 01 - Bias settings ·
  DOCUMENT · ABEAL 8P-OMI-1 · 1 PAGE.*
- **The greyscale law is applied to it**, measured:
  `filter: grayscale(1) contrast(1.03)` — the same as the other three. No
  `[data-colour]` anywhere.
- **The index row reads `attachments 4` and the report names three SCANS, and
  that does not contradict.** The badge counts attachments; the report names
  scans; the fourth is not called a scan. This was the exposure flagged in round
  3 and it is the reason the row is not called "Scan 32".
- **The thumbnail is distinguishable at 43 px.** The stamp reads as a dark band
  across the head where scan-31 has clean white — the pair reads as *same page,
  one marked* at contact-sheet size.
- Doc rows do not open a reader on click. **Pre-existing and identical for all
  four**, so it is not this round's; noted, not touched.

---

## 4. PZ-a CLOSES

Mike's ruling, recorded in his words because the reasoning is the content:

> *"People have no idea what is even going on yet; the puzzle is knowing you saw
> it, and even if not, you can guess in 16. I think the pen is the better
> puzzle; the other is confirmed guessing."*

Both previously rejected mechanisms are superseded rather than fixed: the pen
**shows** the four settings, so nothing gates on outside knowledge and nothing
has to scale a switch bank per channel. **Attention is rewarded; nobody is
locked out.** Row PZ-a should be marked CLOSED with that reasoning — Ops has not
edited the register, because closing a row Mike owns is his mark to make.

---

## 5. THE PORTAL SECTION — proposed, not written

Twelve positions. The hardware ruling restored Section IV; the software ruling
keeps the Feed Control in Section VI. **The box is the face and the Feed Control
is the function** — exactly the split the manual already makes between 4-3 THE
DIVISION OF CONTROL and 6-3 THE MENU SYSTEM for the dial and the shutter.

**SECTION IV — what the controls ARE.** *(4-11 is the next free principal;
Figure 4-2 and Table 4-3 are both free.)*

| Position | One line |
|---|---|
| **4-11 THE INTERFACE BOX.** | What it is, what it is wired to, and that the answers come from the Feed Control at 6-33. |
| **Figure 4-2 · INTERFACE BOX, CONTROLS AND INDICATORS** | The call-out plate — the screenshot, with numbered leader lines. |
| **Table 4-3 · INTERFACE BOX CONTROLS AND INDICATORS** | `INDEX NO. / CONTROL OR INDICATOR / FUNCTION`, one row per control. |
| **SP 4-12 The setting switches.** | The four numbered switches: what they are for, that all four must agree with the far end, values in Appendix B. **Names them; supplies nothing.** |
| **SP 4-13 The power control.** | What it does and does not do — and it gives 5-17 SHUTTING DOWN something to point at. |
| **SP 4-14 The shake control.** | Requests a determination; cross-references 4-5 MOTION INPUT. |

**SECTION VI — what the controls DO.**

| Position | One line |
|---|---|
| **6-31 THE VIDEO LINK.** | What the link is, and where the rest of it lives. |
| **6-33 THE FEED CONTROL.** | The program the box drives: one feed at a time; a position that is not available does not arm. |
| **Table 6-3 · FEED POSITIONS** | `POSITION / CHANNEL / AVAILABILITY`, in the manner of Table C-2. **Prints the numbers, never the reason** — that is the egg. |
| **6-35 OPENING THE LINK.** | The procedure, numbered. **Stops exactly where B-1 stops.** |
| **SP 6-36 Where the far end does not answer.** | 7-14 already supplies the sentence. |
| **6-37 WHILE THE LINK IS UP.** | Upper display unavailable to a program; signal in the graph window; the record holds that a link was opened, not what passed over it. |
| **6-39 CLOSING THE LINK.** | How you get out. Still a genuine hole. |

**Existing tables gain rows, no new positions:** Table 9-1 (*no picture · picture
but no signal · the link closes by itself · the box answers nothing*), Table 9-2
(the parity bias mismatch report), and one row in Table 1-1 or 12-2 saying the
box exists as an item.

**AND ONE COLLISION STILL UNRESOLVED, from round 3:** do **1, 2, 3, 4** mean the
four setting switches or the first four feed channels? Both are numbered 1–4
today. It decides Table 4-3's rows.

**THE B-1 DISCIPLINE IS HELD** in every position: name the four, say they must
agree, say the values are established at the far end. No worked example — that
is the one thing that would have spent the puzzle, and now that the pen carries
the answer it would spend it twice.

---

## 6. THE TREE

### weird-baby-robots

| Path | What |
|---|---|
| `tools/handwriting_segment.py` | **new.** Cuts the sheet into marks: background estimated and divided out (the sheet is photographed, lit unevenly, with a fold), boxes **declared** and then tightened onto their own ink, saved RGBA with alpha = coverage. |
| `robots/mgk-viiip/manual/marks/source/handwriting-20260819.jpg` | **new.** His sheet, landed in the tree — the OneDrive path is transit, never storage. |
| `robots/mgk-viiip/manual/marks/*.png` + `index.json` | **new. 52 marks, 578 KB.** Inventory below. |
| `tools/manual_structure_build.py` | the pen layer, the stamp, `MARKED_PAGES`, `build_marked()`, `--marked-only`. |
| `robots/mgk-viiip/manual/structure/pages/marked/page-47.png` | **new.** 2550×3300 at 300 dpi, through the same one-page-PDF → fitz step the clean pages take, so the twins are comparable. |
| `.gitignore` | the segmenter's `--probe` output — a measuring aid, never an asset. |
| `docs/MANUAL_VOCABULARY-20260819.md` | from round 2. |
| **`pages/page-*.png` and the 120 MB PDF** | **UNTOUCHED — `git diff` on that directory is empty.** `--marked-only` exists precisely so one new page does not rewrite 64 tracked files, one of which is already published. |

### weird-baby-museum

| Path | What |
|---|---|
| `public/robots/manual/marked-01-a.webp` | **new.** 1700×2200 q82, 109 KB. |
| `tools/manual-derivative.mjs` | **new.** The one derivation step, scripted rather than remembered — Article 5 makes traceability a shipping condition. Refuses a master that is not 2550×3300. |
| `src/data/artists/robots-record.js` | the fourth attachment. |
| `reveal/ledger-declare.mjs` + `ledger.json` | the asset joins `MANUAL_PAGE(47)` — a page may reach the museum under more than one address, as page 33 already does. |
| `provenance/assets.json` | the asset row, filed **MIKE**, with both halves of its origin named and the full text transcribed. |
| `provenance/register.json` | the two new strings, HOUSE. |
| `provenance/asset-table.json` | 404 → **459** rows. |
| `tools/asset-table.mjs` | `SKIP_PATH` for the probe directory — a row for a gitignored file is born an orphan, the M9 class manufactured on purpose. |
| `CLAUDE.md`, `docs/canonical/OPERATIONS.md` | the published asset-table count, 404 → 459. |
| `src/data/artists/portal.js` | round 2's drum-legend note only. |

### The 52 marks

**CAREFUL (8 phrases):** SEE 7-14 · ASK ENGINEERING · NOT FOR FIELD UNITS ·
SAME AS B-3? · CHECK W/ FAR SIDE FIRST · DOES NOT APPLY · SUPERSEDED! ·
SEE REV B
**CAREFUL punctuation and figures (12):** `!` `?` `.` `/` `*` `(` `)` `[` `-` `]`
· 1–8 · 9 0
**LOOSE (28):** SEE 7-14 · ASK ENG · NOT FOR 'FIELD UNITS'! · (SAME AS B-3?) ·
★CHECK W/ FAR END FIRST · DOES NOT APPLY · ✗SUPERSEDED - SEE REV B ·
`?` `??` `???` `?!?!` · four stars · three faces (two smiling, one not) ·
a monogram · a strike-X · a scribbling-out · a squiggle · two ruled lines ·
a wave · a zigzag · two rows of X's · a fast 1234567890
**RESERVED (1):** `3/14/65` — **cut, indexed, not placed.**
**Stock (1):** seven tick and slash strokes.

**His two spellings are both cut and neither corrected** — FAR SIDE in the
careful column, FAR END in the loose. A person who wrote it twice and got it
different is more real than a person who did not.

---

## 7. GATES

| Gate | Result |
|---|---|
| `npm run lint` | **9 errors / 8 warnings = baseline** |
| `npm run build` | green |
| `npm run build:launch` | green — 144 files, 190.0 MB held out |
| `npm run provenance:gate` | **PASS** (2 strings + 1 asset declared this round) |
| `npm run reveal:check` | **PASS** |
| `npm run parity:gate` | **PASS** — 4 shared, 0 divergences |
| `npm run instory:gate` | **PASS** — 0 findings |
| `npm run docs:numbers` | **PASS** — after correcting 404 → 459 in two governing documents |
| `npm run reveal:day` | nothing to move |
| `npm run assets:orphans` | **13, unchanged** (M9) |
| `ast.parse` on the generator | clean |
| clean page-47 vs HEAD | **byte-identical** |
| the page, loaded in Chrome | §3 |

**Not pushed. Not deployed.**
