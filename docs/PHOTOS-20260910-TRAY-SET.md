# THE TRAY SET — the artifact photographs, ruled 2026-09-10

Mike's rulings, in order, cleaned.

1. **What they are.** The quarantine record: the photographs that came out
   of the ZIP when the program was shut down and everything was catalogued.
   Presented as scans of 1960s 8 by 10 black and white prints with a small
   white border. Every original is open game for every use: the prologue,
   the artifact and character pages, the reels (including a fast fly-by),
   and uses not yet thought of.
2. **The treatment.** Strength 3, "the handled print", of the served sample (Mike from the PC, 2026-09-10: "I like the handled version"; supersedes the strength 2 he chose from the phone) (`C:\AI\PERSONA-20260903\sample-scans.html`):
   grey scale, faded and warm, visible grain, a soft vignette, corner wear,
   a hair of softness, a yellowed white print border with its edge line, on
   an off-white scanner bed. Ruled from the PC; nothing committed as an image yet.
3. **The crop.** Always inside the tray, never a sliver of table; extend the
   tray's radius in retouch if a tight crop needs it. Big and enclosed things
   keep the full tray; individual items are cropped close, centred, the rule
   kept or dropped deliberately, never half.
4. **The re-shoot.** Mike re-shoots the whole set rather than patch it. One
   rig, top-down, main lens, tripod, one height for the tray and the camera
   brought down for a single small thing until it and the rule fill about
   half the frame (no marked heights, no pre-cropping; Mike, later the same
   day), the tray taped in place, even soft light, exposure locked
   per item, 24 MP JPEG. The rule bottom centre and fully in on every frame.
   Every enclosed thing closed, open, and contents laid out; every unit's
   back and underside; a group frame per character; singles for chips,
   dice, booklets, decks. Three frames first, processed the same day, then
   the full shoot.
5. **The slate.** A small card with the item's name in the first frame of
   each item; the following frames without it. The manifest is written from
   the cards.
6. **Same except data.** Originals are never edited and are kept twice (the
   OneDrive photos folder and the museum's asset bucket). A manifest in the
   repo holds one row per original: id, file, item, character, page, state
   (closed / open / laid out / back / underside / group / single), crop,
   annotation, notes. A script reads the manifest and writes every processed
   set; a changed crop or filter is a re-run.
7. **The annotation layer.** Mike will supply handwriting samples later. The
   renderer keeps a separate, last layer for white handwriting on the print,
   the way old black and white postcards carried it; the text lives in the
   manifest's `annotation` field, empty until then. Nothing about the
   treatment below it changes when the layer arrives.

Layers, in order, per print: original → crop (from the manifest) → tone and
grain (strength 2) → border and bed → annotation (handwriting, later).

Built when the first three frames land: `tools/photos-build.py` in this
repo, the manifest at `photos/manifest.json`, originals under
`OneDrive › WeirdBaby › photos › originals › ‹shoot-date›` and in the bucket
under `photos/originals/`.
