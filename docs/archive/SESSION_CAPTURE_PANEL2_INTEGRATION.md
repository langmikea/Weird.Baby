# Weird.Baby Museum — Session Capture
## Panel 2 Integration + Polish
### April 12, 2026 — Cowork Session

---

## What Was Built This Session

Panel 2 (Archive + Journal) was integrated into the HR exhibit codebase,
polished through two review cycles, and deployed live to weird.baby/hr.

Additionally: WbHome spacing fix, Panel 1 ghost tag brightness bump,
and scroll snap detents added to the exhibit page.

---

## Files Created

```
src/routes/hr/HrPanel2.jsx          — Panel 2 component (tags, archive, journal)
src/data/hr_archive.js              — 8 curated archive artifacts (placeholder images)
src/data/hr_journal_prompts.js      — 4 rotating prompts (line1/line2 schema)
```

## Files Modified

```
src/routes/hr/HrSpine.jsx           — imports HrPanel2, renders below player,
                                       passes activeAlbumId prop, brighter ghost
                                       tags (#363636 → #4a4a4a), scroll snap
src/routes/WbHome.jsx               — explore button: absolute positioning replaced
                                       with flex flow (margin-top: 48px), fixes
                                       gap on PC and overlap on iPhone
STATE.md                             — Panel 2 status added, NEXT updated
_system/BACKLOG.md                   — Panel 2 deferred items added (earlier session)
```

---

## Panel 2 — Current State

### Architecture
- Single component: `HrPanel2.jsx`
- Renders below the main two-column area in HrSpine, above the PlayerBar
- Music keeps playing when Panel 2 is in view
- Receives `activeAlbumId` prop from HrSpine for era context

### Unified Tag Bar
- Three groups: Era (purple), Type (teal), Source (coral)
- **Multi-select toggles** — each tag is independent, multiple per group allowed
- Filter logic: OR within each group, AND across groups
- Styled to match Panel 1 tracklist tags (tl-tag visual language)
- Era auto-sets when user changes album on coverflow (all spine albums = solo)

### Archive Scroller (Left Column, 60%)
- 8 placeholder artifacts (4 medusas, 1 seeds, 3 solo)
- Dark placeholder backgrounds (near-black, never bright)
- Emoji icons at 50% opacity until real images
- Auto-advances every 7.5s, pauses on hover
- **Wrapping navigation** — prev/next always visible, loops at ends
- Click opens inline lightbox with metadata
- Deterministic ordering: date, oldest first

### Journal (Right Column, 40%)
- **Prompt scroller**: 4 prompts, line1/line2 schema, explicit `<br>` rendering
  Always exactly two lines, sentence per line. Cycles every 9.5s.
- **Compose area**: handle input + fixed-height textarea (140px, resize: vertical)
  "Leave it" button always visible, never clipped by feed
- **13 seed entries** across solo (9), medusas (3), seeds (1)
  Real-sounding fan voices referencing specific songs, shows, eras
- **Feed**: weighted random selection, auto-advances every 8.5s
  Wrapping navigation, pauses on hover
- **10-second undo** on new entries with visible countdown
- **Voting**: up/down, either/or, per-session
- **Delete**: own entries (handle-matched, honor system)

### Data Schema
Archive artifacts: `{ date, era, src, type, fact1, fact2, color, icon }`
Journal prompts: `{ era, type, src, line1, line2 }`
Journal entries: `{ id, date, handle, ctx, era, type, src, fact1, fact2, weight, up, dn, voted, mine, undoTimer }`

---

## Other Changes This Session

### WbHome Spacing Fix
- Explore button changed from `position: absolute; bottom: 52px` to
  flex flow with `margin-top: 48px` (32px on mobile)
- Fixes: gap too large on desktop, overlapping on iPhone

### Panel 1 Ghost Tags
- `.tl-tag-dim` color raised from #363636 to #4a4a4a (brighter ghost letters)

### Scroll Snap
- `scroll-snap-type: y proximity` on html/body
- `.hr-snap` class (`scroll-snap-align: start`) on main two-column area
- Gentle detent when scrolling between sections

---

## Design Decisions Captured

1. **Each exhibit gets a single room (page).** No separate landing page.
   HrHome is NOT the front door — /hr (HrSpine) is the exhibit.
   HrHome route preserved but not on the build path.

2. **Tags are independent toggles, not radio buttons.** Multiple selections
   per group allowed. This is how visitors will explore.

3. **Archive nav always wraps.** Never disabled, never hidden.
   End of list loops to start and vice versa.

4. **Prompts are always exactly two lines.** Sentence per line.
   Data schema enforces this with line1/line2 fields.

5. **Textarea is fixed size with manual resize.** Not flex-growing.
   Feed entries below don't push the compose area around.

6. **No bright screens on placeholder content.** All placeholder
   backgrounds are near-black. Emoji icons at 50% opacity.

---

## Deferred / Backlog Items

Carried from SESSION_CAPTURE_PANEL2.md (design session) — all still open:

1. SM video audio handoff (fade/pause/resume song on SM video play)
2. Hard copies of all linked archive assets (format + storage TBD)
3. Persistent journal entries via Cloudflare KV
4. Persistent vote counts (KV or D1)
5. Real auth for entry ownership/delete
6. Weighted journal selection tied to live vote data
7. Unpicked bin concept (intake layer, brainstorm only)

New from this session:

8. **Real archive images** — replace emoji placeholders with actual artifacts.
   Mike curates content. Need image URLs or local files for each artifact.
9. **Per-album archive tagging** — current era map is coarse (all spine = solo).
   When archive grows, tag by specific album for tighter context flow.

---

## NEXT (for next session)

- Device review of current deploy on mobile
- Real archive content — swap placeholder artifacts for actual images
- Domain transfer: GoDaddy → Cloudflare (carry forward)

---

## Prompt for Next Session

```
We are continuing work on the Weird.Baby Museum.
Read STATE.md, VISION.md, and COMPONENT_PHILOSOPHY.md before proceeding.
Build lock must be checked and set before touching any files.

Panel 2 (Archive + Journal) is LIVE at weird.baby/hr.
Full spec: docs/SESSION_CAPTURE_PANEL2_INTEGRATION.md

The scaffold is complete. Current priority: real archive content.
Replace placeholder emoji artifacts with actual images and captions
from the Medusa's Disco FB feed and Hunter Root social media.

Mike will provide image URLs or files. Agent wires them into
src/data/hr_archive.js and updates the archive card rendering
in HrPanel2.jsx to use <img> tags instead of emoji placeholders.

Do not deploy. Build only. Mike will review before deploy.
```

---

*Produced: April 12, 2026*
*Session: Cowork — Panel 2 codebase integration and polish*
*Deployed: Yes — live at weird.baby/hr*
*Next session: Real archive content*
