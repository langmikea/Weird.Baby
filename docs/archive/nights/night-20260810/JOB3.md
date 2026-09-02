# JOB 3 — GRAPHICS reconnaissance (read-only)

Run: 2026-08-10, overnight packet. Read-only throughout. **Nothing was created, moved,
renamed or deleted in any source folder or either git repo. The zip was listed, never
extracted.** The only files written are in `C:\AI\_night-20260810\`:
`JOB3.md`, `JOB3-inventory.json`, and three `_work-*.json` intermediates.

Source: `…\PROJECT CLOSING - GOOGLE DRIVE COPY\Graphics` — 36 files, 1,891,838,610 bytes
(1.762 GiB). All 36 hydrated; **no Offline (0x1000) or RecallOnDataAccess (0x400000) bit on
any file.** (All carry `ReparsePoint`, which is normal OneDrive-on-demand plumbing for a
hydrated file; `PHVDC Label Test Sheet.psd` additionally carries `SparseFile`. All 36 read
and hashed without error.)

---

## LEAD — what needs Mike (short form)

1. **"The Everyman" vs "The Everyday" — which is the model name?** The 15-name model list
   on the bar-logo sheet begins *The Everyman*; every applied surface (faceplate, box, spec
   plate) says *The Everyday*, and *"Not for the Everyman!"* is used as a slogan against it.
   Ops cannot tell whether the list has a typo or whether Everyman is a retired name. **Q-1.**
2. **Is the 15-name model list a live taxonomy or a discarded brainstorm?** Only 3 of the 15
   (*The Everyday / The Informer / The CEO*) appear on any produced artwork. **Q-2.**
3. **`Logos - Weird.Baby.zip` (195 MiB) is 100 % redundant** — all 16 entries verified
   CRC32- and length-identical to the loose files sitting beside it. Deleting it costs
   nothing. Ops did not act; **that is Mike's call. Q-3.**
4. **The spec-plate numbers are the machine's in-story specification.** Doctrine 18 governs
   any use of them. Ops has printed them verbatim below and made no judgement. **Q-4.**

Full versions of all four are in **WHAT NEEDS MIKE** at the foot.

## LEAD — what I could not determine (short form)

- **Whether the six spec rows pair with the six value rows by index.** Geometry says yes
  (both text boxes share the identical vertical extent, y 311→479, six lines each). Ops did
  not rasterise the file to confirm visually.
- **What `PHVDC` stands for.** It is never spelled out anywhere in the 36 files.
- **What the four unnamed devices are.** No device-name field exists anywhere in GRAPHICS.
- **Whether zip entries are byte-identical** to the loose files — CRC32 + length match on
  all 16, which is strong but is not sha256. Confirming sha256 requires extraction, which
  was forbidden.

Full versions in **WHAT I COULD NOT DETERMINE** at the foot.

---

# 3b — THE ASSET TAG MATERIAL

`PHVDC Asset Tag.psd` — 398,085 bytes · 569 × 525 px · 8-bit RGB · 18 layers · 6 type layers
· sha256 `c6f0043d7127a038a5ff39ccce0e7eb4e4b2106980b7f2826c942b90abbc910b`
Created 2024-02-16T10:55:20-05:00, last modified 2024-02-16T14:26:45-05:00, by
**Adobe Photoshop Elements 19.0 (Windows)**.

Mike's note — *"Asset Tag alone is RICH with info!!!"* — is correct. The file is a **spec
plate**: a model number and a six-row min/nom/max electrical specification table. Everything
it carries is recovered below, complete.

## ASSET TAG VOCABULARY

*(This section is the lift-wholesale block for Job 5. Every string is verbatim from the
`TySh` type blocks — exact casing, exact punctuation, exact internal spacing. Where a string
contains runs of multiple spaces those runs are real and are reproduced. Line breaks inside
a layer are shown as separate lines.)*

### FIELD 1 — MODEL

Label layer (`MODEL NO.`), literal string:

```
MODEL NO.
```

Value layer (`Model Number`), literal string:

```
MGK-PHVDC-01
```

**Numbering scheme, as observed:**

| part | value on this tag | format |
|---|---|---|
| manufacturer/line prefix | `MGK` | three upper-case letters |
| product code | `PHVDC` | five upper-case letters |
| unit number | `01` | **two digits, zero-padded** |
| separator | `-` | ASCII hyphen-minus, no spaces |

Full format: **`MGK-<PRODUCT>-<NN>`** — observed instance: **`MGK-PHVDC-01`**.

Two related observed instances elsewhere in GRAPHICS (see §3b-other):

- **`MGK-PHVDC`** — the same scheme **without** the unit number, used as the product headline
  on `PHVDC Front Label.psd`.
- **`MGK-VIIIp`** — the sibling product. Note this one breaks the all-caps pattern: **Roman
  numerals `VIII` followed by a lower-case `p`**. Casing is `MGK-VIIIp` exactly, never
  `MGK-VIIIP` and never `MGK-8p`, in all 4 files that carry it and in all 156-layer box
  documents.
- **`No. 01`** — a separate unit-number rendering used on the box front. Note the period and
  the space: `No. 01`, not `No.01` and not `#01`.

### FIELD 2 — OUTPUT (the specification table)

Section heading layer (`OUTPUT`), literal string:

```
OUTPUT
```

Column-header layer (`min nom max`), literal string — **the internal spacing is 5 spaces then
4 spaces**:

```
min     nom    max
```

Row-label layer (`Spec Points`), six lines, verbatim:

```
VOLTS DC
VOLTS AC
AMPS DC
AMPS AC
DATA Hz.
POWER Hz.
```

*(Note the trailing periods on `DATA Hz.` and `POWER Hz.` and their absence on the four
electrical rows. Note `Hz.` is capital-H lower-case-z. Encoding detail: the first three
breaks are CR `0x0D`; the last two are `0x03`. Six lines either way.)*

Value layer (`VALUES`), six lines, verbatim, spacing preserved exactly:

```
200 V         300 V          400 V
100 V         150 V          200 V
 5.0 A           7.5 A        10.0 A
 2.5 A           3.7 A          5.0 A
 2 kHz           3 kHz          4 kHz
 50 Hz           55 Hz          60 Hz
```

*(Rows 3–6 begin with a single leading space — that is column alignment for the narrower
first figure, and it is in the data.)*

### THE TABLE, PAIRED

The two text boxes occupy the **identical vertical extent** (`Spec Points` at y 311→479,
`VALUES` at y 311→479) and each holds exactly six lines, so line *n* of one aligns with line
*n* of the other:

| spec point | min | nom | max |
|---|---|---|---|
| `VOLTS DC` | `200 V` | `300 V` | `400 V` |
| `VOLTS AC` | `100 V` | `150 V` | `200 V` |
| `AMPS DC` | `5.0 A` | `7.5 A` | `10.0 A` |
| `AMPS AC` | `2.5 A` | `3.7 A` | `5.0 A` |
| `DATA Hz.` | `2 kHz` | `3 kHz` | `4 kHz` |
| `POWER Hz.` | `50 Hz` | `55 Hz` | `60 Hz` |

**Unit vocabulary, complete and controlled:** `V` · `A` · `kHz` · `Hz`. Always a single space
between figure and unit. Amperages always carry one decimal place (`5.0`, `7.5`, `10.0`,
`2.5`, `3.7`) — including the whole numbers. Voltages and Hz values never carry a decimal.

**This pairing is geometric inference, not a rendered check** — see WHAT I COULD NOT DETERMINE.

### THE FOURTH ELEMENT — the maker's mark

The tag's fourth content block is a raster layer named `ABEAL LOGO` (x 58→518, y 35→171),
occupying the top third. It is the **(A)BEAL** mark — the manufacturer brand. It carries no
text of its own in this file; its wordmark is recovered from the ABEAL source files (§3b-other).

### LAYER TREE, COMPLETE, WITH NESTING

Recovered from the Layer and Mask Information section (`luni` unicode names, `lsct` group
dividers). PSD stores layers bottom-first; this is presented **top-down as Photoshop shows
it**:

```
ASSET TAG                     (group, expanded)
├─ ABEAL LOGO                 raster    x 58→518   y 35→171
├─ MODEL                      (group, COLLAPSED)
│  ├─ MODEL NO.               type      x 39→247   y 200→227   "MODEL NO."
│  ├─ Model Number            type      x 269→508  y 200→227   "MGK-PHVDC-01"
│  └─ Model Field             raster    x 261→536  y 193→235   (the value box)
├─ OUTPUT                     (group, expanded)
│  ├─ OUTPUT                  type      x 38→181   y 262→289   "OUTPUT"
│  ├─ min nom max             type      x 220→515  y 268→292   "min     nom    max"
│  ├─ Spec Points             type      x 39→177   y 311→479   (6 row labels)
│  ├─ VALUES                  type      x 219→520  y 311→479   (6 × 3 values)
│  └─ OUTPUT Field            raster    x 197→536  y 304→489   (the table box)
├─ BLACK                      raster    x 18→553   y 17→508    (the plate face)
└─ Layer 3                    raster    x 0→569    y 0→525     (full-canvas)
BACKGROUND                    raster    HIDDEN, outside the group
```

All layers `normal` blend, opacity 255. `BACKGROUND` is the only hidden layer.

**The layer names ARE the field list**: `MODEL NO.` / `Model Number` / `Model Field` —
`OUTPUT` / `min nom max` / `Spec Points` / `VALUES` / `OUTPUT Field`. The `… Field` suffix
consistently names the **box a value sits in**, and is the plate's own word for a form field.

### TYPOGRAPHY

Fonts declared in the document's `FontSet` (from EngineData):

- **`FranklinGothic-Heavy`** — the display face
- **`FranklinGothic-MediumCond`** — the condensed face
- `MyriadPro-Regular` — Photoshop's default style-sheet font, present in every PSD, **not a
  design choice**
- `AdobeInvisFont` — Photoshop internal, **not a design choice**

Point sizes observed in the style runs: **37.5** (`MODEL NO.`, `OUTPUT`, `MGK-PHVDC-01`),
**33.33333** (`min nom max`), **25.0** (`Spec Points`, `VALUES`). Tracking 50 on the display
runs. Fill colour `[1.0 1.0 .99999 1.0]` (white) on the plate text; `[1.0 0.0 0.0 0.0]`
(black) on the default sheet.

### EMBEDDED METADATA BLOCKS — what is present and what is empty

**XMP packet (8BIM resource 1060, 16,836 bytes)** — printed in full below. Namespaces
present: `x`, `rdf`, `xmp`, `photoshop`, `dc`, `xmpMM`, `stEvt`. **No custom namespace.**
**No `dc:title`, no `dc:description`, no `dc:subject` (no keywords), no
`photoshop:Headline`, no `photoshop:Instructions`, no `xmp:Label`** — those fields are absent
from this file and from all 28 PSDs in GRAPHICS. The XMP's value is its
`photoshop:TextLayers` bag, which independently corroborates all six layer names and their
text.

```xml
<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/" x:xmptk="Adobe XMP Core 6.0-c003 116.a360872, 2021/08/02-09:55:47        ">
   <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about=""
            xmlns:xmp="http://ns.adobe.com/xap/1.0/"
            xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:xmpMM="http://ns.adobe.com/xap/1.0/mm/"
            xmlns:stEvt="http://ns.adobe.com/xap/1.0/sType/ResourceEvent#">
         <xmp:CreatorTool>Adobe Photoshop Elements 19.0 (Windows)</xmp:CreatorTool>
         <xmp:CreateDate>2024-02-16T10:55:20-05:00</xmp:CreateDate>
         <xmp:MetadataDate>2024-02-16T14:26:45-05:00</xmp:MetadataDate>
         <xmp:ModifyDate>2024-02-16T14:26:45-05:00</xmp:ModifyDate>
         <photoshop:ColorMode>3</photoshop:ColorMode>
         <photoshop:ICCProfile>sRGB IEC61966-2.1</photoshop:ICCProfile>
         <photoshop:TextLayers>
            <rdf:Bag>
               <rdf:li rdf:parseType="Resource">
                  <photoshop:LayerName>VALUES</photoshop:LayerName>
                  <photoshop:LayerText>200 V         300 V          400 V 100 V         150 V          200 V  5.0 A           7.5 A        10.0 A  2.5 A           3.7 A          5.0 A  2 kHz           3 kHz          4 kHz  50 Hz           55 Hz          60 Hz</photoshop:LayerText>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <photoshop:LayerName>Spec Points</photoshop:LayerName>
                  <photoshop:LayerText>VOLTS DC VOLTS AC AMPS DC AMPS AC DATA Hz. POWER Hz.</photoshop:LayerText>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <photoshop:LayerName>min nom max</photoshop:LayerName>
                  <photoshop:LayerText>min     nom    max</photoshop:LayerText>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <photoshop:LayerName>OUTPUT</photoshop:LayerName>
                  <photoshop:LayerText>OUTPUT</photoshop:LayerText>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <photoshop:LayerName>Model Number</photoshop:LayerName>
                  <photoshop:LayerText>MGK-PHVDC-01</photoshop:LayerText>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <photoshop:LayerName>MODEL NO.</photoshop:LayerName>
                  <photoshop:LayerText>MODEL NO.</photoshop:LayerText>
               </rdf:li>
            </rdf:Bag>
         </photoshop:TextLayers>
         <photoshop:DocumentAncestors>
            <rdf:Bag>
               <rdf:li>adobe:docid:photoshop:51ae3bbc-ba11-11ee-b87a-8945c98b3e1f</rdf:li>
               <rdf:li>adobe:docid:photoshop:59f2aba7-827b-11ee-84f5-d507dfb1e78f</rdf:li>
            </rdf:Bag>
         </photoshop:DocumentAncestors>
         <dc:format>application/vnd.adobe.photoshop</dc:format>
         <xmpMM:InstanceID>xmp.iid:66fad4b7-2079-dd49-bb15-0a29799bbb1d</xmpMM:InstanceID>
         <xmpMM:DocumentID>xmp.did:98e762da-9a6e-8a41-aeea-b78a68e45802</xmpMM:DocumentID>
         <xmpMM:OriginalDocumentID>xmp.did:98e762da-9a6e-8a41-aeea-b78a68e45802</xmpMM:OriginalDocumentID>
         <xmpMM:History>
            <rdf:Seq>
               <rdf:li rdf:parseType="Resource">
                  <stEvt:action>created</stEvt:action>
                  <stEvt:instanceID>xmp.iid:98e762da-9a6e-8a41-aeea-b78a68e45802</stEvt:instanceID>
                  <stEvt:when>2024-02-16T10:55:20-05:00</stEvt:when>
                  <stEvt:softwareAgent>Adobe Photoshop Elements 19.0 (Windows)</stEvt:softwareAgent>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <stEvt:action>saved</stEvt:action>
                  <stEvt:instanceID>xmp.iid:49168968-4822-324d-8295-5c0bed2372d9</stEvt:instanceID>
                  <stEvt:when>2024-02-16T11:38:05-05:00</stEvt:when>
                  <stEvt:softwareAgent>Adobe Photoshop Elements 19.0 (Windows)</stEvt:softwareAgent>
                  <stEvt:changed>/</stEvt:changed>
               </rdf:li>
               <rdf:li rdf:parseType="Resource">
                  <stEvt:action>saved</stEvt:action>
                  <stEvt:instanceID>xmp.iid:66fad4b7-2079-dd49-bb15-0a29799bbb1d</stEvt:instanceID>
                  <stEvt:when>2024-02-16T14:26:45-05:00</stEvt:when>
                  <stEvt:softwareAgent>Adobe Photoshop Elements 19.0 (Windows)</stEvt:softwareAgent>
                  <stEvt:changed>/</stEvt:changed>
               </rdf:li>
            </rdf:Seq>
         </xmpMM:History>
      </rdf:Description>
   </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>
```

*(The packet is followed by ~2 KB of the standard XMP whitespace padding, elided here as it
carries no content.)*

**8BIM Image Resource blocks present** (26 blocks, all unnamed):

| ID | meaning | bytes | content |
|---|---|---|---|
| 1005 | Resolution info | 16 | — |
| 1011 | Print flags | 9 | — |
| 1013 | Colour halftoning | 72 | — |
| 1016 | Colour transfer | 112 | — |
| 1024 | Layer state | 2 | — |
| 1026 | Layer groups | 36 | — |
| 1032 | Grid & guides | 41 | — |
| 1036 | Thumbnail resource | 6,636 | JPEG thumbnail |
| 1037 | Global angle | 4 | — |
| 1039 | ICC profile | 3,144 | `sRGB IEC61966-2.1` |
| 1044 | Document-specific IDs seed | 4 | — |
| 1049 | Global altitude | 4 | — |
| **1050** | **Slices** | **851** | present; no user slice names |
| 1054 | URL list | 4 | empty |
| 1057 | Version info | 123 | — |
| 1058 | EXIF data 1 | 314 | — |
| **1060** | **XMP** | **16,836** | printed in full above |
| 1061 | Caption digest | 16 | — |
| 1062 | Print scale | 14 | — |
| 1064 | Pixel aspect ratio | 12 | — |
| 1069 | Layer selection IDs | 6 | — |
| 1072 | Layer group(s) enabled | 18 | — |
| 1082 | Print info (CS2) | 229 | — |
| 1083 | Print style | 564 | — |
| 1085 | Print flags | 1,824 | — |
| 10000 | Print flags info | 10 | — |

**NOT present in this file: ID 1028 (IPTC-NAA) and ID 1008 (caption).** There are no IPTC
captions, keywords or categories on the Asset Tag.

*(For completeness across the tree: 23 of the 28 PSDs DO carry an ID-1028 block. All 23 were
decoded. **Every one contains only repeated IIM dataset `1:90` — the coded-character-set
declaration — and an empty `2:0`.** No captions, no keywords, no categories anywhere in
GRAPHICS. This is Photoshop writing an empty envelope, not authored metadata.)*

**Fallback sweep (cross-check).** All ASCII runs ≥ 5 characters were extracted from the
metadata + layer region (offsets 0–246,004; the image-data section was excluded as it is
compressed pixels). 587 deduplicated runs, 500 containing a letter. **The sweep added no
content string the structured extraction had missed.** It confirmed the six layer names, the
six text strings, the XMP, the `8BIM` keys present (`clbl cust FMsk fxrp infx knko lclr lnsr
lsct lspf luni lyid lyvr norm pass Patt pths shmd Txt2 TySh`), the ICC profile identity
(`sRGB IEC61966-2.1`, `Copyright (c) 1998 Hewlett-Packard Company`), and the EngineData
type-engine parameters. A parallel UTF-16BE sweep was what recovered the font names above —
those are **invisible to an ASCII sweep** and are the one thing the fallback added.

---

## 3b-other — the rest of the tree, same treatment

Every one of the 28 PSDs was parsed for layer names, group structure and type-layer strings.
Complete text-string recovery follows.

### `PHVDC Front Label.psd` — 434,275 B · 722 × 613 · RGB · 24 layers · 8 type layers

Created same second as the Asset Tag (2024-02-16T10:55:20), modified 2024-02-16T15:05:03 —
**it is the Asset Tag document saved-as and extended.** It carries **the Asset Tag's entire
content unchanged**, plus a product headline and a tagline.

The six shared strings are byte-identical to the Asset Tag's (`MODEL NO.`, `MGK-PHVDC-01`,
`OUTPUT`, `min     nom    max`, the six spec points, the six value rows) — same spacing, same
line breaks. **Two additional strings, verbatim:**

```
MGK-PHVDC
```

```
Super-charging the most powerful
portable prediction system, ever!
```

*(The line break after `powerful` is in the data. Note lower-case `ever!` and the comma
before it.)*

Layer tree, top-down:

```
PHVDC Frontplate              (group, expanded)
├─ Group 1                    (group, collapsed)
│  ├─ MGK-PHVDC               type  x 40→685   y 119→198
│  └─ The most powerful...    type  x 78→640   y 219→278   (the tagline)
├─ Group 2                    (group, collapsed)
│  ├─ ABEAL LOGO              raster x 46→399  y 464→569
│  └─ Shape 1                 raster x 47→143  y 466→563
├─ MODEL                      (group, expanded)
│  ├─ MODEL NO.               type  x 509→659  y 510→530
│  ├─ Model Number            type  x 496→669  y 544→564
│  └─ Model Field             raster x 480→679 y 539→569
├─ OUTPUT                     (group, COLLAPSED and HIDDEN)
│  ├─ OUTPUT / min nom max / Spec Points / VALUES / OUTPUT Field
├─ BLACK                      raster x 18→702  y 17→593
```

**The whole OUTPUT specification group is hidden on the front label.** The spec table lives on
the asset tag; the front label shows brand, tagline and model number only. That is a
deliberate division of the two surfaces and it is in the file.

Fonts: `FranklinGothic-Book`, `FranklinGothic-Demi`, `FranklinGothic-Heavy`,
`FranklinGothic-MediumCond`.

### `PHVDC Label Test Sheet.psd` — 2,216,325 B · 2302 × 2898 · RGB · 19 layers · 0 type layers

A **print imposition sheet**, not a design. No type layers at all — every element is a placed
raster. Structure:

```
ASSET TAG          (group, collapsed, HIDDEN)
├─ PHVDC ASSET TAG (group, collapsed)   4 × "ABEAL LOGO" at y 525→1050, x 0/572/1141/1713
├─ PHVDC ASSET TAG (group, collapsed)   4 × "ABEAL LOGO" at y 0→525,    x 0/572/1141/1713
FRONT LABEL        (group, expanded)
├─ FRONT LABEL     raster x 0→722    y 1050→1663
└─ FRONT LABEL     raster x 722→1444 y 1050→1663
Layer 1
```

**8 asset tags (4 across × 2 down, each 569 × 525, 3 px gutter) and 2 front labels
(each 722 × 613), on one 2302 × 2898 sheet.** That is the production layout. Modified
2024-02-20 — four days after the tag and label, the last-touched PHVDC file.

### `MGK-VIIIp_Related\MGK-VIIIp Bar Logo.psd` — 2,852,690 B · 3000 × 2400 · 24 layers · 11 type

**This file is the second vocabulary source in GRAPHICS and it is the more surprising one.**
It is a designer's element sheet, and it carries a **15-entry model-name list in 5 groups of
3**, repeated at three type sizes (`Model Large`, `Model Medium`, `Model Small` — identical
strings).

**THE MODEL-NAME LIST, VERBATIM, COMPLETE** (blank lines are in the data and separate the
groups; there is a trailing blank line):

```
The Everyman
The Informer
The CEO

The Assistant
The Intelligencer
The Gambler

The Marksman
The Futurist
The Executive

The Machine
The Translator
The Astronaut

The Commander
The Mechanic
The Reactor

```

Every entry is `The ` + a capitalised noun. Fifteen entries, five groups, three per group.
**Only the first group's second and third entries (`The Informer`, `The CEO`) plus
`The Everyday` appear on any produced artwork** — see Q-1 and Q-2.

**THE TAGLINE, three sizes, verbatim.** Note the large and medium carry a line break, the
small does not:

```
THE MOST ADVANCED PORTABLE
PREDICTION SYSTEM, EVER!
```

```
THE MOST ADVANCED PORTABLE PREDICTION SYSTEM, EVER!
```

**THE DESIGNER'S NOTE, verbatim** — this is a message from the artist to Mike, dated, sitting
in a type layer:

```
MGK-VIIIp Bar Logo
Update: 1/25/2024

You can use any of these elements and mash them up in different configurations.

You can also mash up with (A)BEAL logo elements,

If you need someting more, just let me know.
```

*(`someting` is the author's typo and is reproduced. The comma after `elements` is theirs too.)*

Layer names include four `END OF …` marker layers — `END OF STANDARD LOGO`, `END OF TAGLINE`,
`END OF Model Name`, `END OF MGK-VIIIp` — which are the sheet's own section rules.
Groups: `Standard MGK-VIIIp Bar Logo` · `Tagline` · `Model Name` · `MGK-VIIIp`.
Font: `FranklinGothic-Demi`.

### `MGK-VIIIp - BOX COVER (rev 2023_12_20).psd` / `Logos - MGK-VIIIp\MGK-VIIIp BOX (rev 2023_12_20).psd` / `MGK-VIIIp_Related\MGK-VIIIp Box Graphics.psd`

**156 layers, 32 type layers.** The first two are byte-identical (sha256
`c5ebe790217884f1…`, 28,953,928 B). `Box Graphics.psd` is a **different, later file**
(28,970,274 B, modified 2024-01-23 vs 2023-11-29) with the same layer set — a divergent
working copy, not a duplicate.

**Complete marketing-copy vocabulary, verbatim:**

```
The Everyday Decision Making Computer - Equally capable of responding to complex science and busi-
ness questions as to questions about dinner or the New Hampshire Lottery!   Get yours today!
```

*(The hyphenation `busi-/ness` across the line break is manual and is in the data. There are
**three** spaces before `Get yours today!`)*

```
> Designed with Space Age Technology
> Outperforms other methods by up to 100%, & more!
> Battery powered - Works on the go, like you.
```

*(Bullet character is a literal `>` followed by one space.)*

Slogans, each on its own layer, verbatim:

```
Not for the Everyman!
Stand and manage alone!
Be the guy to know!
You’re the guy to know!
```

*(`You’re` uses U+2019 RIGHT SINGLE QUOTATION MARK, not an ASCII apostrophe.)*

Unit number on the box front:

```
No. 01
```

Model/tier strings used: `MGK-VIIIp` · `The Everyday` · `The CEO` · `The Informer`.

**The layer-group names are themselves an instruction set** — the box document is built as a
configurator, and the group names say so:

```
ARTWORK FOR MGK BOX
├─ L1 - ABEAL/MGK/xxx (rect)          [The CEO | The Informer | The Everyday]
├─ L2 - ABEAL/MGK/xxx (square)        [The CEO | The Informer | The Everyday]
├─ L3 - SLOGAN (choose circle)        [CLOSED CIRCLE | ARROW CIRCLE | OPEN CIRCLE]
├─ L4 - SLOGAN (choose circle)
├─ L5 - SLOGAN (choose circle)
├─ L6 - SLOGAN (choose circle)
├─ L7 - CIRCLED CAMERA
├─ L8 - CAMERA FRONT
├─ L9 - MGK-VIIIp/xxx                 [The CEO | The Informer | The Everyday]
├─ L10 - MGK-VIIIp
├─ L11 - STRIPE
├─ LABELS (on/off)
└─ BACKGROUNDS (select one)           [4 backgrounds]
MGK-VIIIp FULL BOX
├─ NEW Top / NEW Front / NEW Right / NEW Left / NEW Back
└─ OLD BOX
```

**The controlled option vocabulary is in the parentheses**: `(select one)`, `(choose circle)`,
`(on/off)`, `(rect)`, `(square)`. Circle variants: `CLOSED CIRCLE` / `ARROW CIRCLE` /
`OPEN CIRCLE`. Box faces: `NEW Top` / `NEW Front` / `NEW Right` / `NEW Left` / `NEW Back`,
against a retired `OLD BOX`.

Fonts: `FranklinGothic-Book`, `FreestyleScript-Regular`, `Gadugi`.

### `MGK-VIIIp Faceplate.psd` (two versions) and `MGK-VIIIp Faceplate Final Push.psd`

`_mal\MGK-VIIIp Faceplate.psd` — 25,468,041 B, 2400 × 2702, 60 layers, 20 type.
`MGK-VIIIp_Related\MGK-VIIIp Faceplate.psd` — 15,059,813 B, same 2400 × 2702, 36 layers,
12 type. **Different files, same canvas** — the `_mal` one is the fuller version.
`MGK-VIIIp Faceplate Final Push.psd` — 50,421,119 B, 2071 × 2721, 41 layers, 12 type.

Strings, verbatim:

```
MADE IN
U.S.A. BY
```

*(Two separate layers, stacked. `U.S.A.` with periods, then a space, then `BY`.)*

Plus `MGK-VIIIp`, `The Everyday`, `The Informer ` (**note the trailing space — it is in the
data on six separate layers**) and `The CEO`.

The layer vocabulary here is a **revision scheme**: every element exists as `v01` / `v02` /
`v03` variants, and each has a paired `… Glint` layer:

```
Group 1
├─ MGK-VIIIp v01 / v02        [MGK-VIIIp + MGK-VIIIp Glint]
├─ The CEO v01 / v02          [+ Glint]
├─ The Informer v01 / v02     [+ Glint]
├─ The Everyday v01 / v02     [+ Glint]
├─ Rings v01 / v02 / v03      [RINGS + RINGS Glint]
├─ MADE IN v01                [MADE IN, U.S.A. BY, + Glints]
├─ (A)BEAL Logo copy          [(A), (A) - Glint, BEAL, BEAL -Glint]
├─ Overlay
├─ Fiducials                  ← registration marks for machining/printing
└─ 1.75 x 3.25                ← THE PHYSICAL FACEPLATE SIZE IN INCHES
```

**`1.75 x 3.25` is a layer name and it is the faceplate's physical dimension in inches.** The
`Final Push` variant adds `Brushed Aluminum`, `SCREEN`, `SCREEN / SWITCH` and `ABEAL` layers
— it is the materials/finish study.

Fonts: `FranklinGothic-Book`, `FranklinGothic-Demi`, `FranklinGothic-Medium`.

### The ABEAL files — the manufacturer brand

`ABEAL_Related\ABEAL Bar Logo.psd` (508,115 B, 1656 × 520), `_mal\ABEAL Bar Logo.psd`
(620,605 B, same size), `_mal\ABEAL - BAR LOGO (rev 2023_12_20).psd` and its `MASTER FILES`
twin (both 448,693 B, byte-identical).

Strings, verbatim:

```
BEAL
```

```
a division of ScrapCo
```

*(all lower-case except `ScrapCo`; `ScrapCo` is one word, capital S, capital C.)*

The `(A)` is a **shape layer, not type** — the wordmark is constructed as a layer named `(A)`
inside a `DOT BACKGROUND` / `DOT BORDER` pair, followed by the type layer `BEAL`. **The brand
renders as `(A)BEAL`** and is written that way in every layer name that references it
(`(A)BEAL`, `ABEAL / MGK`, `ABEAL/MGK`). Layer set: `BACKGROUND` · `BIG BORDER` ·
`'a division of ScrapCo'` · `DOT BACKGROUND` · `DOT BORDER` · `BEAL` · `(A)`, in a group
named `ABEAL`.

`ABEAL_Related\ABEAL Key Fob.psd` (401,045 B, 1335 × 507, 16 layers) adds one string:

```
Scraping the world for scrap.
```

*(sentence case, with a full stop.)* It has a two-sided structure — groups
`ABEAL Keyfob Front` (hidden) and `ABEAL Keyfob Rear` / `ABEAL rear`.
Fonts: `Arial-Black`, `SitkaSmall-Bold` (Key Fob); `BellMTItalic`, `SitkaSmall-Bold` (Bar Logo).

### The Weird.Baby logo files

`Weird.Baby Round Logo.psd` and `_mal\…\Weird.Baby - ROUND LOGO (rev 2023 12 20).psd` are
**byte-identical** (221,197,500 B, 6000 × 6000, 140 layers, 21 type). Only two distinct
strings: `Weird.Baby` (×18) and `get` (×3). Font: `Righteous-Regular`.

`Weird.Baby Bar Logo.psd` and `_mal\…\Weird.Baby - BAR LOGO (2023 12 20).psd` are
**byte-identical** (354,127,797 B, 6000 × 3796, 62 layers, **0 type layers** — all lettering
is rasterised).

Both are configurators, and their group names are a **controlled border vocabulary**:

```
BORDER = 96 | 72 | 48 | 36 | 24 | 00      (bar logo)
BORDER = 96 | 72 | 48 | 36 | 24 | none    (round logo)
```

*(Note the bar logo uses `00` and the round logo uses `none` for the same state — an
inconsistency in the source, reported as found.)*

Round-logo group vocabulary: `BACKGROUNDS (select one)` · `SLOGAN (on/off/edit)` ·
`COLOR TEXT (edit color & text)` · `BLACK TEXT (edit text)` · `WHITE TEXT (edit text)` ·
`CIRCLE (select one)` · `IMAGE (select one)` · `DRAWING 01 (on/off)` · `PHOTO 01 (on/off)` ·
`LOGO (select one)` · `COLOR TEXT (select border)` · `BLACK TEXT  (select border)` (two
spaces, in the data) · `WHITE TEXT (select border)`. Element layers: `INK`, `INK (modify)`,
`BORDER MASK`, `Slogans`, `BABY`, `BABY NEW ARM`.

Bar-logo group vocabulary: `BACKGROUND (select one)` · `FACE` · `TILTED TEXT` · `FLAT TEXT` ·
`WHITE TEXT / (choose border)` · `BLACK TEXT / (choose border)` · `BOX OUTLINE` ·
`Left side borders` / `Right side borders`, whose options are **`Bowtie` · `70s` ·
`SUPER THIN` · `THIN`**.

`Weird.Baby BABY MASTER.psd` (75,802,746 B, 1927 × 2887, 13 layers, 0 type) is the
**derivation record for the baby mark**, and its layer names are the process, in order:

```
BACKGROUND · RAW IMAGE · MASKED · PHOTOCOPY 10/45 · PHOTOCOPY 9/31 ·
PHOTOCOPY 9/31 DESPECK · 9/31 HEAD/EARS · PHOTOCOPY 9/31 DESPECK copy ·
[GRP: EVOLUTION] · PHOTOCOPY 9/31 DESPECK copy 2 · SKETCH · Layer 1
```

`PHOTOCOPY 10/45` and `9/31` are threshold/despeckle settings kept as named states. Its
`xmpMM:OriginalDocumentID` is `uuid:8434374849B1DE11A2209103EB67B9F3` — **the same original
document ID as `Weird.Baby Baby 01.psd`**, so BABY MASTER descends from Baby 01.

### The seven baby photographs

`Weird.Baby Baby 01–07.psd` — 4–5 layers each, **0 type layers**, all named
`[GRP: PHOTO]` / `[GRP: Photo]` containing an image layer (`Isolated`, `ORIGINAL copy`,
`Baby Mike`, `Background copy`) plus `Levels 1`, some with `Hue/Saturation 1`.
Baby 03 is **Grayscale** (2 channels); the rest are RGB. Their XMP carries
`xmpRights:Marked=False` and `stRef` original-document IDs going back to camera originals
dated 2009-10-04, 2009-10-27 and 2013-04-06.

**A vocabulary lives in the sibling `_MAL` tree's folder names**, and it is worth having: the
seven originals are filed there under **named expressions**.

```
Baby Weird.Baby BORED
Baby Weird.Baby HOLY CRAP
Baby Weird.Baby IN LOVE
Baby Weird.Baby INFATUATION
Baby Weird.Baby SHOCK AND AWE
Baby Weird.Baby SKEPTICAL
Baby Weird.Baby YEAH YEAH
Baby Weird.Baby_PHOTOS NOT YET USED
```

The sha256 matches in §3c give the exact mapping:

| GRAPHICS baby file | expression (from `_MAL` folder) | `_MAL` original filename |
|---|---|---|
| `Michael Baby 01.jpg` → `Weird.Baby Baby 01.psd` | **HOLY CRAP** | `Copy of Michael baby 002.jpg` |
| `Michael Baby 02.jpg` → `Weird.Baby Baby 02.psd` | **IN LOVE** | `Michael baby 001.jpg` |
| `Michael Baby 03.jpg` → `Weird.Baby Baby 03.psd` | **INFATUATION** | `Copy of Michael baby 011.jpg` |
| `Michael Baby 04.jpg` → `Weird.Baby Baby 04.psd` | **SHOCK AND AWE** | `Copy of Michael baby 012.jpg` |
| `Michael Baby 05.jpg` → `Weird.Baby Baby 05.psd` | **SKEPTICAL** | `Copy of Michael baby 013.jpg` |
| `Michael Baby 06.jpg` → `Weird.Baby Baby 06.psd` | **BORED** | `Copy of Michael baby 015.jpg` |
| `Michael Baby 07.jpg` → `Weird.Baby Baby 07.psd` | **YEAH YEAH** | `Copy of Michael baby 014.jpg` |

*(The `Michael Baby NN` numbering in GRAPHICS is a renumbering — the `_MAL` originals run
001, 002, 011, 012, 013, 014, 015, and 014/015 are swapped relative to the new sequence.)*

### `MGK-VIIIp Faceplate TEST SHEET.psd` — 162,662,124 B · 4792 × 6056 · 25 layers · 0 type

A print imposition like the PHVDC test sheet: `Group 2` and `Group 2 copy`, each holding
`Group 1` and `Group 1 copy`, each holding `Layer 1/2/3`. **Four faceplates on a sheet.** No
authored names at all, and it is the **only PSD in GRAPHICS with no ID-1028 block and no
`photoshop:TextLayers`.** Created and modified 2024-01-25 within 19 minutes.

---

## 3b — CONSOLIDATED VOCABULARY INDEX (for Job 5)

Everything the tree encodes as a controlled value, in one place.

**Brands / entities** (4): `Weird.Baby` · `(A)BEAL` (rendered `(A)` + `BEAL`) · `ScrapCo`
(as `a division of ScrapCo`) · `MGK` (the model prefix).

**Products** (2): `MGK-VIIIp` · `MGK-PHVDC`.

**Model-number format**: `MGK-<PRODUCT>-<NN>`, NN zero-padded to 2. Observed: `MGK-PHVDC-01`.
Unit number alone renders as `No. 01`.

**Model / tier names** (15 declared, 3 in use):
declared — `The Everyman` `The Informer` `The CEO` `The Assistant` `The Intelligencer`
`The Gambler` `The Marksman` `The Futurist` `The Executive` `The Machine` `The Translator`
`The Astronaut` `The Commander` `The Mechanic` `The Reactor`;
in use on artwork — `The Everyday` `The Informer` `The CEO`.

**Spec-point names** (6, ordered): `VOLTS DC` `VOLTS AC` `AMPS DC` `AMPS AC` `DATA Hz.`
`POWER Hz.`

**Spec columns** (3, ordered): `min` `nom` `max`

**Units** (4): `V` `A` `kHz` `Hz`

**Taglines / slogans** (7): `THE MOST ADVANCED PORTABLE PREDICTION SYSTEM, EVER!` ·
`Super-charging the most powerful portable prediction system, ever!` ·
`Not for the Everyman!` · `Stand and manage alone!` · `Be the guy to know!` ·
`You’re the guy to know!` · `Scraping the world for scrap.`

**Origin mark** (2 lines): `MADE IN` / `U.S.A. BY`

**Border weights** (6): `96` `72` `48` `36` `24` `00`/`none`

**Border styles** (4): `Bowtie` `70s` `SUPER THIN` `THIN`

**Circle variants** (3): `CLOSED CIRCLE` `ARROW CIRCLE` `OPEN CIRCLE`

**Box faces** (5 + 1): `NEW Top` `NEW Front` `NEW Right` `NEW Left` `NEW Back` · `OLD BOX`

**Baby expressions** (7): `HOLY CRAP` `IN LOVE` `INFATUATION` `SHOCK AND AWE` `SKEPTICAL`
`BORED` `YEAH YEAH`

**Physical dimension found**: faceplate `1.75 x 3.25` (inches).

**Typefaces** (design faces only; `MyriadPro-Regular` and `AdobeInvisFont` excluded as
Photoshop defaults): `FranklinGothic-Heavy` · `FranklinGothic-Demi` ·
`FranklinGothic-Medium` · `FranklinGothic-MediumCond` · `FranklinGothic-Book` ·
`FreestyleScript-Regular` · `Gadugi` · `Righteous-Regular` · `BellMTItalic` ·
`SitkaSmall-Bold` · `Arial-Black`.

---

# 3a — FULL INVENTORY, HASHED

36 rows. Machine-readable version with every field: **`C:\AI\_night-20260810\JOB3-inventory.json`**.
All PSDs: signature `8BPS`, version `1`, depth `8`. Colour-mode codes: 3 = RGB, 1 = Grayscale.

| # | relative path | bytes | fmt | W × H | ch | depth | mode | layers | type |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `_mal\ABEAL - BAR LOGO (rev 2023_12_20).psd` | 448,693 | PSD | 1656 × 520 | 3 | 8 | RGB(3) | 9 | 2 |
| 2 | `_mal\ABEAL Bar Logo.psd` | 620,605 | PSD | 1656 × 520 | 3 | 8 | RGB(3) | 10 | 2 |
| 3 | `_mal\MASTER FILES\Logos - ABEAL\ABEAL - BAR LOGO (rev 2023_12_20).psd` | 448,693 | PSD | 1656 × 520 | 3 | 8 | RGB(3) | 9 | 2 |
| 4 | `_mal\MASTER FILES\Logos - MGK-VIIIp\MGK-VIIIp BOX (rev 2023_12_20).psd` | 28,953,928 | PSD | 3750 × 4050 | 3 | 8 | RGB(3) | 156 | 32 |
| 5 | `_mal\MASTER FILES\Logos - Weird.Baby.zip` | 204,791,031 | ZIP | — | — | — | — | 19 entries | — |
| 6 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 01.jpg` | 387,473 | JPEG | 1927 × 2887 | 3 | 8 | YCbCr | — | — |
| 7 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 02.jpg` | 306,911 | JPEG | 955 × 1427 | 3 | 8 | YCbCr | — | — |
| 8 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 03.jpg` | 596,476 | JPEG | 2019 × 2942 | 1 | 8 | Grayscale | — | — |
| 9 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 04.jpg` | 606,443 | JPEG | 2035 × 2898 | 3 | 8 | YCbCr | — | — |
| 10 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 05.jpg` | 667,344 | JPEG | 2035 × 2898 | 3 | 8 | YCbCr | — | — |
| 11 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 06.jpg` | 656,437 | JPEG | 2035 × 2898 | 3 | 8 | YCbCr | — | — |
| 12 | `_mal\…\Baby Photos\ORIGINALS\Michael Baby 07.jpg` | 573,043 | JPEG | 2035 × 2898 | 3 | 8 | YCbCr | — | — |
| 13 | `_mal\…\Baby Photos\Weird.Baby Baby 01.psd` | 17,131,545 | PSD | 1927 × 2887 | 4 | 8 | RGB(3) | 5 | 0 |
| 14 | `_mal\…\Baby Photos\Weird.Baby Baby 02.psd` | 4,755,790 | PSD | 955 × 1427 | 4 | 8 | RGB(3) | 5 | 0 |
| 15 | `_mal\…\Baby Photos\Weird.Baby Baby 03.psd` | 6,336,489 | PSD | 2019 × 2942 | 2 | 8 | **Grayscale(1)** | 4 | 0 |
| 16 | `_mal\…\Baby Photos\Weird.Baby Baby 04.psd` | 18,981,494 | PSD | 2035 × 2898 | 4 | 8 | RGB(3) | 4 | 0 |
| 17 | `_mal\…\Baby Photos\Weird.Baby Baby 05.psd` | 19,175,198 | PSD | 2035 × 2898 | 4 | 8 | RGB(3) | 4 | 0 |
| 18 | `_mal\…\Baby Photos\Weird.Baby Baby 06.psd` | 19,166,319 | PSD | 2035 × 2898 | 4 | 8 | RGB(3) | 4 | 0 |
| 19 | `_mal\…\Baby Photos\Weird.Baby Baby 07.psd` | 18,221,535 | PSD | 2035 × 2898 | 4 | 8 | RGB(3) | 4 | 0 |
| 20 | `_mal\MASTER FILES\Logos - Weird.Baby\Weird.Baby - BAR LOGO (2023 12 20).psd` | 354,127,797 | PSD | 6000 × 3796 | 3 | 8 | RGB(3) | 62 | 0 |
| 21 | `_mal\MASTER FILES\Logos - Weird.Baby\Weird.Baby - ROUND LOGO (rev 2023 12 20).psd` | 221,197,500 | PSD | 6000 × 6000 | 3 | 8 | RGB(3) | 140 | 21 |
| 22 | `_mal\MGK-VIIIp - BOX COVER (rev 2023_12_20).psd` | 28,953,928 | PSD | 3750 × 4050 | 3 | 8 | RGB(3) | 156 | 32 |
| 23 | `_mal\MGK-VIIIp Faceplate Final Push.psd` | 50,421,119 | PSD | 2071 × 2721 | 4 | 8 | RGB(3) | 41 | 12 |
| 24 | `_mal\MGK-VIIIp Faceplate TEST SHEET.psd` | 162,662,124 | PSD | 4792 × 6056 | 3 | 8 | RGB(3) | 25 | 0 |
| 25 | `_mal\MGK-VIIIp Faceplate.psd` | 25,468,041 | PSD | 2400 × 2702 | 4 | 8 | RGB(3) | 60 | 20 |
| 26 | `ABEAL_Related\ABEAL Bar Logo.psd` | 508,115 | PSD | 1656 × 520 | 3 | 8 | RGB(3) | 12 | 2 |
| 27 | `ABEAL_Related\ABEAL Key Fob.psd` | 401,045 | PSD | 1335 × 507 | 4 | 8 | RGB(3) | 16 | 3 |
| 28 | `MGK-VIIIp_Related\MGK-VIIIp Bar Logo.psd` | 2,852,690 | PSD | 3000 × 2400 | 3 | 8 | RGB(3) | 24 | 11 |
| 29 | `MGK-VIIIp_Related\MGK-VIIIp Box Graphics.psd` | 28,970,274 | PSD | 3750 × 4050 | 3 | 8 | RGB(3) | 156 | 32 |
| 30 | `MGK-VIIIp_Related\MGK-VIIIp Faceplate.psd` | 15,059,813 | PSD | 2400 × 2702 | 4 | 8 | RGB(3) | 36 | 12 |
| 31 | **`PHVDC Asset Tag.psd`** | 398,085 | PSD | 569 × 525 | 3 | 8 | RGB(3) | 18 | 6 |
| 32 | **`PHVDC Front Label.psd`** | 434,275 | PSD | 722 × 613 | 4 | 8 | RGB(3) | 24 | 8 |
| 33 | **`PHVDC Label Test Sheet.psd`** | 2,216,325 | PSD | 2302 × 2898 | 4 | 8 | RGB(3) | 19 | 0 |
| 34 | `Weird.Baby_Related\Weird.Baby BABY MASTER.psd` | 75,802,746 | PSD | 1927 × 2887 | 3 | 8 | RGB(3) | 13 | 0 |
| 35 | `Weird.Baby_Related\Weird.Baby Bar Logo.psd` | 354,127,797 | PSD | 6000 × 3796 | 3 | 8 | RGB(3) | 62 | 0 |
| 36 | `Weird.Baby_Related\Weird.Baby Round Logo.psd` | 221,197,500 | PSD | 6000 × 6000 | 3 | 8 | RGB(3) | 140 | 21 |

### SHA256, all 36

```
cb8c795d2d6b0e16035db3ed17b686f04d6de54de4d244625615b0231c7ffb08  _mal\ABEAL - BAR LOGO (rev 2023_12_20).psd
19e0f6a6286f582a6d17bc3f2ce23bea529ec899b3f73764411bb7d165a2c799  _mal\ABEAL Bar Logo.psd
cb8c795d2d6b0e16035db3ed17b686f04d6de54de4d244625615b0231c7ffb08  _mal\MASTER FILES\Logos - ABEAL\ABEAL - BAR LOGO (rev 2023_12_20).psd
c5ebe790217884f164ba906202066b42a52338b172a448642016fb6df7bd2a8b  _mal\MASTER FILES\Logos - MGK-VIIIp\MGK-VIIIp BOX (rev 2023_12_20).psd
c755981566baf4561c17f05cb371c8ffd6bd4c23ef6739a0879a7ea93a3182a5  _mal\MASTER FILES\Logos - Weird.Baby.zip
59e434f914228b9750ec205585def091ada375ea722e0bba4c3f6ea03db03f7f  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 01.jpg
89d4c0332cf1d3674df10f1ebbb5f44f5f8d99b120e730e290522c1b7b9f956e  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 02.jpg
768c691680f8b3c60bfb61b173f59b7a9125579573c78494c6833872b694a94a  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 03.jpg
13c6332979b7ac4947225a4ca3e277cbf162c4fb5147df8a0912919d5b37b40a  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 04.jpg
fb3d58f7a27050473d0feffa438b644c61e70f517199b738e9fd5f22277b2f6f  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 05.jpg
769f9a20550fbb1d946c48b8af72c1f8b550de211bcfebc98d4b43d943b8b652  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 06.jpg
d4e188969891cfbc89c23507d608d97db6765365c0077ecbd05de9aa7e3292c2  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 07.jpg
fc3d53753740b2fd1cec5cd66161e6b6ca986aa2941218362e295470c4114f2f  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 01.psd
7541c3b28513bea33ea28a47dc80b4b5d7bd1257aed8a3125db901a2bce110ca  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 02.psd
6a02e70211039ed8c11214666e6f1197ea175a6be1637056238e7a34340c674c  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 03.psd
51cb2a3b6c01e33ede885e2926b5152691fa7718fc404688d462c42d103cfbde  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 04.psd
2019fc1d8edc40a8c1e56f73cfef8b75bc2adc4ca38b4c8c2df4c222d3a56ed6  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 05.psd
6b5c5d4e3f1a550942567c461aeb02f619482143a91ecb8f03df63f58a63ad50  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 06.psd
f305c1e83fbb3bf7895c526b35893cdff87cb0a592c9a61cb6f3eae4802e8a06  _mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\Weird.Baby Baby 07.psd
af45cb92fa52e6be77b3f29c12f609dc14f8149dd1d5f1d18c657d4b0abc9a80  _mal\MASTER FILES\Logos - Weird.Baby\Weird.Baby - BAR LOGO (2023 12 20).psd
ea92569ac91e07e6f13738a664b302dcaa1625143de82ca9d6d02767fcf34144  _mal\MASTER FILES\Logos - Weird.Baby\Weird.Baby - ROUND LOGO (rev 2023 12 20).psd
c5ebe790217884f164ba906202066b42a52338b172a448642016fb6df7bd2a8b  _mal\MGK-VIIIp - BOX COVER (rev 2023_12_20).psd
7bc9206f2a146b5f9d1bdd094e52574a0c6d9c2a967270fc1805d634c86d7a94  _mal\MGK-VIIIp Faceplate Final Push.psd
c008626201eb825df71dd241b944088d8596ca2d798f783496d37fd2a8283ac0  _mal\MGK-VIIIp Faceplate TEST SHEET.psd
35288dc93393ebc080e6cf9663a6b8db8fb18f70f9728f07c1aa4d35c25ead89  _mal\MGK-VIIIp Faceplate.psd
d9bc6537e91a084755e399283fe07e9b3e6ca2f2adcae6469646b77f502e8d39  ABEAL_Related\ABEAL Bar Logo.psd
01b16257992304a5ea7f629519ec47ae742cad620d807cfea4ca98a92e7407f0  ABEAL_Related\ABEAL Key Fob.psd
822f0394291d2d333b0d5d35d19acb75c77eeff1ea8d9847406154a4900d9e65  MGK-VIIIp_Related\MGK-VIIIp Bar Logo.psd
11dd628eccdd9959423d0fdea26aea1020aa419f938db36dffc70c2f93254ad3  MGK-VIIIp_Related\MGK-VIIIp Box Graphics.psd
107f47a4a2c27e351c26b274338d29d3ebc6280a6ed83732457d8811ee43fd16  MGK-VIIIp_Related\MGK-VIIIp Faceplate.psd
c6f0043d7127a038a5ff39ccce0e7eb4e4b2106980b7f2826c942b90abbc910b  PHVDC Asset Tag.psd
96fec19bcb94f30806576d608d2655db7ab387958aa97c321795f2d254847ea4  PHVDC Front Label.psd
8917e9e2d155b202fff677a99eecb2e840f2c71b059b46f8be2d2cbabc5d8e64  PHVDC Label Test Sheet.psd
890304a68684f912d136230cb41dee25c7e42e7f5df26440aed47cb0432a2491  Weird.Baby_Related\Weird.Baby BABY MASTER.psd
af45cb92fa52e6be77b3f29c12f609dc14f8149dd1d5f1d18c657d4b0abc9a80  Weird.Baby_Related\Weird.Baby Bar Logo.psd
ea92569ac91e07e6f13738a664b302dcaa1625143de82ca9d6d02767fcf34144  Weird.Baby_Related\Weird.Baby Round Logo.psd
```

**Note on method:** hashes were computed with `Get-FileHash -Algorithm SHA256` over the whole
file. PSD *headers* were read as 30-byte reads at offset 0 — no large file was read in full
except where the hash or a CRC32 comparison required it.

### PSD header fields, as asked, for the three PHVDC files

| field | offset | `Asset Tag` | `Front Label` | `Label Test Sheet` |
|---|---|---|---|---|
| signature | 0 | `8BPS` | `8BPS` | `8BPS` |
| version (u16BE) | 4 | 1 | 1 | 1 |
| channels (u16BE) | 12 | 3 | 4 | 4 |
| **height** (u32BE) | 14 | **525** | **613** | **2898** |
| **width** (u32BE) | 18 | **569** | **722** | **2302** |
| depth (u16BE) | 22 | 8 | 8 | 8 |
| colour mode (u16BE) | 24 | 3 (RGB) | 3 (RGB) | 3 (RGB) |

### Duplicates inside GRAPHICS — the flagged same-size pairs, resolved

All four pairs named in the brief were hashed. **All four are byte-identical**; the
duplication is real, not a size coincidence.

| sha256 (16) | bytes | copies |
|---|---|---|
| `cb8c795d2d6b0e16` | 448,693 | `_mal\ABEAL - BAR LOGO (rev 2023_12_20).psd` **and** `_mal\MASTER FILES\Logos - ABEAL\ABEAL - BAR LOGO (rev 2023_12_20).psd` |
| `c5ebe790217884f1` | 28,953,928 | `_mal\MGK-VIIIp - BOX COVER (rev 2023_12_20).psd` **and** `_mal\MASTER FILES\Logos - MGK-VIIIp\MGK-VIIIp BOX (rev 2023_12_20).psd` |
| `af45cb92fa52e6be` | 354,127,797 | `_mal\MASTER FILES\Logos - Weird.Baby\Weird.Baby - BAR LOGO (2023 12 20).psd` **and** `Weird.Baby_Related\Weird.Baby Bar Logo.psd` |
| `ea92569ac91e07e6` | 221,197,500 | `_mal\MASTER FILES\Logos - Weird.Baby\Weird.Baby - ROUND LOGO (rev 2023 12 20).psd` **and** `Weird.Baby_Related\Weird.Baby Round Logo.psd` |

**No other duplicate pairs exist in GRAPHICS.** 36 files → **32 distinct sha256 values.**

**Relevant to Job 5's master/derivative question:** the two 6000-px Weird.Baby logos and the
box cover exist in exactly two places each, byte-for-byte. `Weird.Baby_Related\` and
`_mal\MASTER FILES\Logos - Weird.Baby\` are **the same file at two addresses**, not a master
and a derivative. **The one pair that is NOT identical is the box:**
`MGK-VIIIp_Related\MGK-VIIIp Box Graphics.psd` (28,970,274 B, modified 2024-01-23) vs
`MGK-VIIIp - BOX COVER (rev 2023_12_20).psd` (28,953,928 B, modified 2023-11-29). Same
canvas, same 156-layer structure, **16,346 bytes and two months apart.** That is a genuine
master/derivative (or two-working-copies) case and is the only one in the tree.

Redundant bytes from duplication inside GRAPHICS: **604,727,918 B (0.563 GiB)**, plus the zip
at 204,791,031 B — **809,518,949 B (0.754 GiB), 42.8 % of the folder, is redundant.**

---

# 3c — THE TWO `_mal` TREES

**Scoping note: I did NOT scope this.** `_MAL` was hashed **in full — all 18,008 files,
827,515,470 bytes, including the Audio folder — with zero read errors.** `Graphics\_mal` was
hashed in full (25 files, 1,185,655,956 bytes). Both sides are complete; no size or name
pre-filter was applied, so the comparison below is exhaustive in both directions.

`_MAL` top-level folders: `3D Modeling` · `Arduino` · `Audio` · `INSTRUCTION MANUAL_IDEAS` ·
`Photos` · `Weird.Baby Logos` · `Weird.Baby Photos`.

## ANSWER: they are NOT the same material, and neither is a subset of the other.

**`Graphics\_mal` is a graphics-production tree. `_MAL` is a whole-project tree** (audio,
Arduino firmware, 3D models, manual ideas, photos). They **overlap in exactly seven files —
the seven baby photograph originals — and in nothing else.**

The numbers:

| direction | count |
|---|---|
| `Graphics\_mal` files present in `_MAL` by sha256 | **7 of 25 (28 %)** |
| `Graphics\_mal` files **not** in `_MAL` | **18 of 25 (72 %)** |
| `_MAL` files present in `Graphics\_mal` by sha256 | **7 of 18,008 (0.04 %)** |
| `_MAL` files **not** in `Graphics\_mal` | **18,001 of 18,008** |
| **same name, different hash** | **0 — there is no divergence** |
| **different name, same hash (renames)** | **7 — all seven overlaps** |

**Every single overlapping file is a rename.** Not one of the seven kept its filename.

### The 7 matches, both paths

| sha256 | `Graphics\_mal` path | `_MAL` path |
|---|---|---|
| — | `_mal\MASTER FILES\Logos - Weird.Baby\LOGOS - Weird.Baby - Baby Photos\ORIGINALS\Michael Baby 01.jpg` | `Weird.Baby Photos\Baby Weird.Baby HOLY CRAP\ORIGINAL PHOTOS\Copy of Michael baby 002.jpg` |
| — | `…\ORIGINALS\Michael Baby 02.jpg` | `Weird.Baby Photos\Baby Weird.Baby IN LOVE\ORIGINAL PHOTOS\Michael baby 001.jpg` |
| — | `…\ORIGINALS\Michael Baby 03.jpg` | `Weird.Baby Photos\Baby Weird.Baby INFATUATION\ORIGINAL PHOTOS\Copy of Michael baby 011.jpg` |
| — | `…\ORIGINALS\Michael Baby 04.jpg` | `Weird.Baby Photos\Baby Weird.Baby SHOCK AND AWE\ORIGINAL PHOTOS\Copy of Michael baby 012.jpg` |
| — | `…\ORIGINALS\Michael Baby 05.jpg` | `Weird.Baby Photos\Baby Weird.Baby SKEPTICAL\ORIGINAL PHOTOS\Copy of Michael baby 013.jpg` |
| — | `…\ORIGINALS\Michael Baby 06.jpg` | `Weird.Baby Photos\Baby Weird.Baby BORED\ORIGINAL PHOTOS\Copy of Michael baby 015.jpg` |
| — | `…\ORIGINALS\Michael Baby 07.jpg` | `Weird.Baby Photos\Baby Weird.Baby YEAH YEAH\ORIGINAL PHOTOS\Copy of Michael baby 014.jpg` |

*(sha256 per row is in `JOB3-inventory.json` and `_work-MAL-hashes.json`.)*

**The renames carry information and it is the find of this section.** `_MAL` files the same
seven bytes under **named expressions**; `Graphics\_mal` files them under a flat
`Michael Baby 01–07` sequence. **The expression names exist only on the `_MAL` side and only
as folder names — they are in no file's metadata anywhere.** Without this hash comparison
that vocabulary would not have been recoverable at all. The mapping table is in §3b-other.

### The 18 files unique to `Graphics\_mal`

Every PSD, plus the zip. None of this graphics material exists anywhere in `_MAL`.

```
_mal\ABEAL - BAR LOGO (rev 2023_12_20).psd                                    448,693
_mal\ABEAL Bar Logo.psd                                                       620,605
_mal\MASTER FILES\Logos - ABEAL\ABEAL - BAR LOGO (rev 2023_12_20).psd         448,693
_mal\MASTER FILES\Logos - MGK-VIIIp\MGK-VIIIp BOX (rev 2023_12_20).psd     28,953,928
_mal\MASTER FILES\Logos - Weird.Baby.zip                                  204,791,031
_mal\MASTER FILES\…\Weird.Baby Baby 01.psd                                 17,131,545
_mal\MASTER FILES\…\Weird.Baby Baby 02.psd                                  4,755,790
_mal\MASTER FILES\…\Weird.Baby Baby 03.psd                                  6,336,489
_mal\MASTER FILES\…\Weird.Baby Baby 04.psd                                 18,981,494
_mal\MASTER FILES\…\Weird.Baby Baby 05.psd                                 19,175,198
_mal\MASTER FILES\…\Weird.Baby Baby 06.psd                                 19,166,319
_mal\MASTER FILES\…\Weird.Baby Baby 07.psd                                 18,221,535
_mal\MASTER FILES\…\Weird.Baby - BAR LOGO (2023 12 20).psd                354,127,797
_mal\MASTER FILES\…\Weird.Baby - ROUND LOGO (rev 2023 12 20).psd          221,197,500
_mal\MGK-VIIIp - BOX COVER (rev 2023_12_20).psd                            28,953,928
_mal\MGK-VIIIp Faceplate Final Push.psd                                    50,421,119
_mal\MGK-VIIIp Faceplate TEST SHEET.psd                                   162,662,124
_mal\MGK-VIIIp Faceplate.psd                                               25,468,041
```

**Zero same-name-different-hash pairs across the two trees.** There is no divergence to
reconcile — the trees simply hold different things, and the seven photographs they share are
byte-identical.

---

# 3d — THE ZIP (listed, not extracted)

`_mal\MASTER FILES\Logos - Weird.Baby.zip` — 204,791,031 B on disk.

Listed via `[System.IO.Compression.ZipFile]::OpenRead()` and enumeration of `.Entries`, which
reads the central directory only. **Nothing was extracted, to disk or to temp.**

- **19 entries** — 3 directory entries + **16 files**
- uncompressed total: **682,887,794 B (651.3 MiB)**
- compressed total: **204,786,205 B** (ratio 30.0 %)
- all entries under a single root `Logos - Weird.Baby/`

| entry | uncompressed | compressed | CRC32 | modified |
|---|---|---|---|---|
| `Logos - Weird.Baby/` | 0 | 0 | `00000000` | 2026-02-24 12:40:46 |
| `Logos - Weird.Baby/LOGOS - Weird.Baby - Baby Photos/` | 0 | 0 | `00000000` | 2026-02-24 12:40:54 |
| `Logos - Weird.Baby/LOGOS - Weird.Baby - Baby Photos/ORIGINALS/` | 0 | 0 | `00000000` | 2026-02-24 12:40:54 |
| `…/ORIGINALS/Michael Baby 01.jpg` | 387,473 | 294,723 | `55ee4424` | 2026-02-23 16:37:10 |
| `…/ORIGINALS/Michael Baby 02.jpg` | 306,911 | 239,278 | `064bf9ea` | 2026-02-23 16:37:10 |
| `…/ORIGINALS/Michael Baby 03.jpg` | 596,476 | 573,967 | `790cf6d1` | 2026-02-23 16:37:10 |
| `…/ORIGINALS/Michael Baby 04.jpg` | 606,443 | 526,656 | `f65b2d3a` | 2026-02-23 16:37:10 |
| `…/ORIGINALS/Michael Baby 05.jpg` | 667,344 | 586,997 | `5cb29048` | 2026-02-23 16:37:10 |
| `…/ORIGINALS/Michael Baby 06.jpg` | 656,437 | 575,244 | `b5e0b602` | 2026-02-23 16:37:10 |
| `…/ORIGINALS/Michael Baby 07.jpg` | 573,043 | 491,239 | `16028c08` | 2026-02-23 16:37:10 |
| `…/Weird.Baby Baby 01.psd` | 17,131,545 | 8,667,099 | `f52a16ca` | 2026-02-23 16:33:12 |
| `…/Weird.Baby Baby 02.psd` | 4,755,790 | 2,773,193 | `27ffef49` | 2026-02-23 16:37:10 |
| `…/Weird.Baby Baby 03.psd` | 6,336,489 | 4,008,545 | `fb1442a3` | 2026-02-23 16:37:10 |
| `…/Weird.Baby Baby 04.psd` | 18,981,494 | 11,850,307 | `7a285919` | 2026-02-23 16:37:10 |
| `…/Weird.Baby Baby 05.psd` | 19,175,198 | 13,136,720 | `2bd0cf2d` | 2026-02-23 16:37:10 |
| `…/Weird.Baby Baby 06.psd` | 19,166,319 | 13,035,946 | `1cc61d74` | 2026-02-23 16:37:10 |
| `…/Weird.Baby Baby 07.psd` | 18,221,535 | 11,151,758 | `a31c33eb` | 2026-02-23 16:37:10 |
| `…/Weird.Baby - BAR LOGO (2023 12 20).psd` | 354,127,797 | 78,204,872 | `efec7a5d` | 2026-02-23 16:33:48 |
| `…/Weird.Baby - ROUND LOGO (rev 2023 12 20).psd` | 221,197,500 | 58,669,661 | `8b3704e1` | 2026-02-23 16:37:10 |

## What is in it: an exact archive of the folder sitting next to it.

The zip's 16 files are **the complete contents of `_mal\MASTER FILES\Logos - Weird.Baby\`** —
same tree shape, same names, same sizes, same file count. It is a snapshot taken 2026-02-24,
one day after the loose files' timestamps.

**I verified this rather than guessing it.** As the brief allows, I computed the **CRC32 of
each loose file on disk** (a read-only operation that writes nothing) and compared against the
zip's stored CRC32 and uncompressed length.

**Result: 16 of 16 entries match on BOTH CRC32 and byte-length. Zero mismatches. Zero missing
loose counterparts.**

That is not sha256 — a CRC32 collision is theoretically possible — but **16 independent
simultaneous matches of CRC32 *and* length is conclusive for practical purposes.** Confirming
by sha256 would require extraction, which was forbidden, so I state it as evidence rather
than certainty.

**Conclusion: the zip is 100 % redundant with material already loose on disk in GRAPHICS.**
It contributes **zero unique files** and costs **204,791,031 B (195.3 MiB, 10.8 % of the
folder)**. See **Q-3** — deleting it is Mike's call, not Ops'.

---

# 3e — COLLISION CHECK AGAINST BOTH REPOS

**Result: ZERO collisions. Not one GRAPHICS file exists in either repository.**

Method, stated so it can be checked: every GRAPHICS file's sha256 was computed (36 hashes,
32 distinct). Both repos' **entire working trees** were enumerated with `.git` internals
excluded — `weird-baby-museum` **11,059 files**, `weird-baby-robots` **476 files**, including
`public/`, `dist/`, `docs/`, `node_modules/` and all assets. Repo files were then filtered to
those whose **byte-length equals some GRAPHICS file's byte-length**, and every survivor was
hashed. **This is exact for the byte-identity question** — identical content implies identical
length, so a file that fails the length filter cannot be a sha256 match. Nothing was skipped
for cost.

| repo | files scanned | length-candidates | sha256 matches | same-basename hits |
|---|---|---|---|---|
| `C:\AI\Projects\weird-baby-museum` | 11,059 | **0** | **0** | **0** |
| `C:\AI\Projects\weird-baby-robots` | 476 | **0** | **0** | **0** |

**The length filter returned zero candidates in both repos** — no file in either repository
even shares a byte-count with any GRAPHICS file. There is nothing to hash, nothing similar,
nothing near.

### Similarly-named files (reported for completeness — none are GRAPHICS material)

A filename keyword scan for `PHVDC|MGK-VIIIp|ABEAL|Asset Tag|Bar Logo|Round Logo|Faceplate|Key Fob|Box Cover`:

**`weird-baby-museum`** — 2 hits, the same file twice (source + build output):

```
public\held\robots\art\mgk-viiip-cover.png              455,860 B
dist\client\held\robots\art\mgk-viiip-cover.png         455,860 B
```

This is the hand-authored MGK-VIIIp album cover from the 2026-08-09 round (`dd367c7`). It is
a PNG, 455,860 B, and matches **no** GRAPHICS file by size or hash. It shares only the product
name. **It is not derived from anything in GRAPHICS as far as byte evidence goes** — whether
it was drawn *by eye* from this artwork is not something a hash can answer.

**`weird-baby-robots`** — 3 hits, none graphical:

```
robots\mgk-viiip\firmware\MGK_VIIIp_01__20240721_WORKS\1_MGK-VIIIp.ino        508 B
robots\mgk-viiip\firmware\MGK_VIIIp_02__20260724_AUDIT\1_MGK-VIIIp.ino      1,336 B
robots\mgk-viiip\manual\structure\MGK-VIIIp_OMI_STRUCTURE_v1.pdf         5,787,778 B
```

Firmware source and a manual-structure PDF. Not GRAPHICS material.

**Significance:** the GRAPHICS folder is **entirely unrepresented in both repos.** Everything
in it — the spec plate, the model taxonomy, the box copy, the faceplate revisions, the logo
configurators — is material that has **never been brought into the project.** That is the
finding Job 5 should start from.

### The hard fence

Nothing in this job touched, referenced, proposed, or built any logic reaching
`CUT VIDEO - NIAC` or `RAW VIDEO - NIAC`. **Those folders are not under GRAPHICS and were
never in scope; no branch of my work approached them.** No file was proposed for `public/` or
for either repo by this job — this job proposes nothing at all, it reports.

---

# WHAT I COULD NOT DETERMINE

1. **Whether the six spec rows pair with the six value rows by index.** The pairing in the
   table above is inferred from geometry: `Spec Points` and `VALUES` are two separate text
   boxes occupying the **identical vertical extent** (y 311→479), each with exactly six lines
   and the same 30-px line advance recovered from the EngineData. That is strong, and the
   values are internally coherent under it (DC volts above AC volts, DC amps above AC amps,
   kHz for data and Hz for power). **But I did not rasterise the PSD to look at it.** Doing so
   would need Photoshop or a rendering library; neither was in scope for a read-only recon
   pass. **If Job 5 is going to reprint this table, the pairing should be eyeballed once.**

2. **What `PHVDC` stands for.** It is never expanded anywhere in the 36 files — not in a layer
   name, not in a text layer, not in any metadata block. `MGK-VIIIp`'s function is stated
   plainly (*"The Everyday Decision Making Computer"*, *"portable prediction system"*), but
   the PHVDC's is not. The front-label tagline says it is *"Super-charging"* the MGK-VIIIp,
   and the spec table is a DC/AC power specification, so it reads as a power unit — but the
   expansion of the acronym is **not in this material.** I did not guess it.

3. **What the four unnamed devices are.** No device-name field, no device roster, and no
   fourth or fifth product code exists anywhere in GRAPHICS. The only product codes present
   are `MGK-VIIIp` and `MGK-PHVDC`. If the four devices are expected to be named from this
   folder, **they are not in it.**

4. **Whether the zip's entries are byte-identical to the loose files.** CRC32 + uncompressed
   length match on all 16 of 16, which I computed rather than assumed. sha256 confirmation
   requires extraction, which was forbidden. I report the CRC32 evidence and stop there.

5. **Whether `MGK-VIIIp Box Graphics.psd` is an improvement on `MGK-VIIIp - BOX COVER (rev
   2023_12_20).psd` or a divergence.** Same canvas, same 156-layer structure, same 32 text
   layers with identical strings, **16,346 bytes apart and two months apart** (2023-11-29 vs
   2024-01-23). The difference is in pixel data, not in text or structure, so a metadata pass
   cannot say which is authoritative. `Box Graphics` is the later file. It also carries a
   `crs` (Camera Raw Settings) namespace the other lacks. **A visual diff is the only way to
   settle it, and I did not do one.**

6. **Whether `Weird.Baby Baby 03.psd` being Grayscale is intentional.** It is the only
   grayscale file among the seven, and its source `Michael Baby 03.jpg` is also single-
   component. So it is consistent, not a conversion error in the PSD — but whether the
   *photograph* was meant to be grayscale, I can't say.

7. **The `00` vs `none` border-weight inconsistency.** The bar logo's zero-border option is
   named `BORDER = 00`; the round logo's is `BORDER = none`. Same concept, two names, in two
   files by the same hand. I report it as found and did not normalise it.

8. **Whether `mgk-viiip-cover.png` in the museum repo was drawn from this GRAPHICS artwork.**
   Byte-wise it is unrelated to everything in GRAPHICS. Visually it may well have been drawn
   by eye from the box or faceplate. **A hash cannot answer that** and I did not open either
   image to compare.

---

# WHAT NEEDS MIKE

**Q-1 — "The Everyman" or "The Everyday"? A ruling is needed before anything reprints either.**
The 15-name model list on `MGK-VIIIp Bar Logo.psd` opens with **`The Everyman`**. Every
produced surface — the box (×8 layers), both faceplates, the bar logo — says **`The
Everyday`**. And `Not for the Everyman!` is used as a **slogan set against** the product on
four separate box layers. So the two words are both live, in opposite roles, and the model
list uses the slogan's word for the model's name. Three readings are possible and Ops cannot
choose between them: (a) the list has a typo and should read `The Everyday`; (b) `The
Everyman` is an earlier name that `The Everyday` replaced and the list was never updated;
(c) they are deliberately different and the list is the *tier* while `The Everyday` is the
*product*. **This is the single most load-bearing ambiguity in the folder** — it is the
flagship model's name.

**Q-2 — Is the 15-name model list a live taxonomy, or a discarded brainstorm?**
Fifteen names, in five deliberate groups of three, set at three sizes on a designer's element
sheet dated 1/25/2024 — that is a *lot* of structure for a scratch list. But **only three
names ever reached artwork** (`The Everyday`, `The Informer`, `The CEO` — and those three are
group one). The groups may be tiers, may be product lines, may be nothing. **Job 5 needs to
know whether it is holding a taxonomy or a page of rejected names**, because the two get
opposite treatment. The full list is printed verbatim in the ASSET TAG VOCABULARY section.

**Q-3 — `Logos - Weird.Baby.zip` is 195 MiB of proven-redundant bytes. Delete it?**
All 16 entries verified CRC32- and length-identical to the loose files beside them. It
contributes nothing. **Ops took no action and will take none without a word from you** — this
job is read-only and the file is yours. (Related, same call, larger number: another
0.563 GiB inside GRAPHICS is exact byte-duplication across four file pairs — see §3a. Total
redundancy in the folder is **0.754 GiB, 42.8 %**.)

**Q-4 — The spec-plate figures are the machine's in-story specification. How are they to be
used?** `Doctrine 18` says *"Technical Specifications" means THE IN-STORY SPECS, NEVER THE
REAL ONES* — and this plate is exactly that: a fictional device's electrical specification,
authored 2024-02-16, printed on a physical tag. It is the best in-story spec material found so
far, and it is complete (6 spec points × 3 columns, with units and a model number). **Ops has
printed it verbatim and made no judgement about where or whether it appears.** Before Job 5
puts any of it on a face, the Doctrine 18 question needs your answer.

**Q-5 — Nothing in GRAPHICS has ever been in either repo, and that may be deliberate.**
Zero of 36 files appear in `weird-baby-museum` or `weird-baby-robots`, by hash or by name or
even by byte-length. If that is because the material was never surfaced, Job 5 has a large
untouched seam. **If it is because it was ruled out, Ops does not know that** — nothing in the
repos records a decision about this folder. Worth one sentence from you either way.

---

*Report complete. Files written by this job, all under `C:\AI\_night-20260810\`:
`JOB3.md`, `JOB3-inventory.json`, and intermediates `_work-graphics-hashes.json`,
`_work-MAL-hashes.json`, `_work-psd-extract.json`, `_work-assettag-layers.json`.
Nothing else on this machine was created, modified, moved, renamed or deleted.*
