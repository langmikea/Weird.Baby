# 2b — THE STALE `viiip.png` FIELDS

**Read-only. Nothing was written.** Ops owns this; Mike ruled "leave me out of it".

Row **`A-d1ce909419`** in `provenance/asset-table.json`
→ `public/held/robots/art/viiip.png` (1536×1536, 8-bit grey, 1,399,633 bytes,
sha256 `30765f28…80ba9`).

---

## 1. THE EXACT CURRENT VALUES

```json
"what": "The MGK-VIIIp album cover — the unit, front, with the BIOS beat composited into its glass. Also the ninth tile of the VIIIp morgue.",
"revealArc": "online",
"role": "unreferenced",
"usedBy": [],
"quality": "usable",
"verdict": null,
"bucket": null
```

## 2. WHAT IS FALSE, AND HOW IT WAS ESTABLISHED

`what` makes **three** claims. All three are false, and the row's own derived
fields already contradict two of them.

| claim in `what` | true? | evidence |
|---|---|---|
| "The MGK-VIIIp album cover" | **false** | `robots.js:1769` sets `art: placed("/robots/art/mgk-viiip-cover.png")`. `mgk-viiip-cover.png` is its own row (`A-ae718e7ac8`, `role: shipped`, `usedBy: [robots.js]`). |
| "the ninth tile of the VIIIp morgue" | **false twice over** | The album carries **two** archive sets of nine tiles each. `viiip.png` is in **neither** — both use `viiip-v2.png` (set one at position 6, set two at position 9). And "morgue" is a word `robots.js:111` records as having left the building with register row **M6**. |
| "with the BIOS beat composited into its glass" | **true** | Unchallenged; this is the only part of the sentence describing the picture rather than its placement. |

`revealArc: "online"` is false: **nothing in `src/` references this file.** Every
occurrence of the string `viiip.png` in `src/` is inside a code comment
(`portal.js:58`, `portal.js:62`, `robots.js:1761`); there is no `img:`, `href:`
or any other value that resolves to it. The table's own scanner agrees — this row
is `role: "unreferenced"` with `usedBy: []`, and it is **the only unreferenced
row in a table of 251**.

Per the table's own `_revealArc` legend, `null` is not a gap to be filled:

> "`null` means UNSET and is not a stage: it is the honest state of an asset
> whose arc nobody has established."

Only 6 of 251 rows carry a non-null arc (2 `online`, 4 `arrived`), so `null` is
the overwhelming norm and carries no implication.

## 3. WHAT THEY SHOULD READ

```json
"what": "The MGK-VIIIp unit, front, square on, with the machine's own opening BIOS beat composited into its glass. Cropped to the unit's measured bounding box, 1536 square, 8-bit grey.",
"revealArc": null
```

Two principles behind that wording, both drawn from the table's own conventions:

1. **`what` should describe the PICTURE, not its placement.** Every false claim
   in the current string is a claim about *where the file is used* — and
   placement is exactly what `role` and `usedBy` already carry, derived, and
   therefore cannot go stale. A `what` that repeats them is a second copy kept in
   step by nothing, which is how this row got here. The replacement above says
   only what is in the frame.
2. **`revealArc` goes to `null`, not to a different stage.** The row is not
   "arrived" or "partial" — nobody has established an arc for it since it stopped
   being the cover. `null` is the field's own word for that.

`quality` / `qualityNote` were checked and are **still true** — they describe the
crop, which is untouched. `verdict` and `bucket` are Mike's and stay `null`.

## 4. A SECOND COPY OF THE SAME FALSEHOOD, IN THE SOURCE

Not part of the ask, but it is the same sentence in a second place and a future
round will find one and trust the other:

`src/data/artists/robots.js:1761-1764`

> "`viiip.png` STAYS IN THE BUILD — it is the tenth tile of this album's own
> Image Archive (below), which is where the composited BIOS beat is shown and
> captioned. It stopped being the cover; it did not stop being a plate."

It is not the tenth tile, or any tile. Both archive sets were read line by line
(18 `img:` entries across the two) and neither contains it. The comment appears
to record an *intention* at the time the four hand-authored covers landed, which
was never carried out — the tile that was added used `viiip-v2.png`.

This is a code comment, not a visitor-facing string, so no doctrine is breached
by it and no gate can see it. It matters only because it is the corroborating
source a future session would reach for.

---

## WHAT I COULD NOT DETERMINE

- **Whether `viiip.png` was ever intended to become a tile, or whether the
  decision was reversed.** The comment at `robots.js:1761` asserts it will be one
  and the data never made it so. I cannot tell from the tree whether the tile was
  dropped deliberately or simply never added. The round log for the covers packet
  (commit `dd367c7`) would say; I did not open it.
- **Whether `revealArc: "online"` was ever true.** If the field was set while the
  file was still the album cover, it was accurate then and simply outlived the
  cover. Nothing in the row records when it was set.
- **Whether the file should exist at all.** It is the only unreferenced row in
  the table. Deleting it is a different question from correcting its description
  and I have not evaluated it — the crop is `A8`'s work and `quality: usable`.

## WHAT NEEDS MIKE

**Nothing.** He ruled himself out of this one and both fields are Ops'.
`verdict` and `bucket` on this row stay `null` and are not touched by any of the
above.

The one thing that would reach him is the question in the first bullet above —
whether `viiip.png` was meant to be a tenth archive tile. If the answer is yes,
the fix is a tile rather than a re-worded `what`, and that is a content change
he would see. **Ops should settle it from the covers round log before editing
the row**, not ask him.
