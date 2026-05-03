# Weird.Baby Museum — Session Capture
## Panel 2: Archive + Journal
### April 12, 2026

---

## What Was Built This Session

A fully interactive prototype of Panel 2 — the second horizontal panel on the HR exhibit
page, sitting below the music player. Five design iterations were completed in chat.
The prototype is ready for codebase integration.

**Live prototype exists as a widget artifact in the April 12 chat session.**

---

## Panel 2 Architecture

### Layout
- Single page, same room as the music player (Panel 1)
- Scrolls into view below the player — music keeps playing
- Two columns in a shared frame:
  - **Left (60%):** Archive scroller
  - **Right (40%):** Journal
- One unified tag bar spanning both columns at the top of the panel

### Relationship to Panel 1
- Era/album context flows down from the player — archive defaults to content
  matching whatever era is currently playing
- Music never stops when Panel 2 is in view
- SM video audio handoff (fade/pause/resume) deferred — see Backlog

---

## The Unified Tag Bar

Spans the full width of Panel 2. No group labels. Tags speak for themselves.
Three groups separated by thin dividers:

| Group | Color when active | Tags |
|-------|-------------------|------|
| Era | Purple (#534AB7 / #EEEDFE) | Seeds, Medusa's Disco, Solo |
| Type | Teal (#0F6E56 / #E1F5EE) | Historical, Poster, Photo, Interview, Rarity |
| Source | Coral (#993C1D / #FAECE7) | FB, Insta, Press, Archive |

**Behavior:**
- One active per group maximum
- Click active tag to deactivate (returns to "all" for that group)
- No "All" tags — unfiltered is the default state
- Tags filter BOTH the archive feed and the journal feed simultaneously
- Same visual language and schema as tracklist tags in Panel 1

---

## Archive Scroller (Left Column)

### Display
- Auto-advances every ~7.5 seconds
- Pauses on hover (entire column), resumes on mouse leave
- Manual prev/next controls + progress bar
- Counter shows position (e.g. "2 / 5")
- Click any slide → opens inline lightbox (stays in museum, no external redirect)

### Lightbox
- Expands artifact inline over a dark overlay
- Shows: type, date, source badge, fact1, fact2 (if present)
- Close by button or clicking outside

### Content ordering
- Deterministic: date order, oldest to newest
- Filters apply in real time — counter and sequence update

### Data schema (per artifact)
```js
{
  date: "2014-03-15",        // ISO, used for ordering
  era: "medusas",            // seeds | medusas | solo
  src: "fb",                 // fb | insta | press | archive
  type: "poster",            // historical | poster | photo | interview | rarity
  fact1: "Primary caption",  // always present
  fact2: "Secondary detail", // optional — shown in lightbox
  color: "#e8e0f4",          // placeholder bg color until real image
  icon: "🎭"                 // placeholder until real image
}
```

### Data file to create
`src/data/hr_archive.js` — seeded with curated Medusa's Disco FB feed artifacts.
Mike curates all content. Nothing enters without expressed purpose.

---

## Journal (Right Column)

### Prompt scroller
- Rotating prompts cycle every ~9.5 seconds
- Each prompt is tagged with era/type for schema consistency
- Prompts follow same fact1/fact2 schema (fact2 unused currently)

### Entry composition
- Fixed-height textarea (no resize)
- Handle input (persists via localStorage in production)
- "Leave it" button — always visible, never clipped

### On submit
- Entry immediately appears in journal feed with teal highlight border
- **10-second undo window** — countdown visible on the entry
- Undo removes the entry cleanly with no trace
- After 10 seconds: entry commits, undo disappears, voting activates
- Feed pauses during undo window, resumes after

### Journal feed
- Weighted random selection — higher weight = surfaces more often
- Upvotes increase weight; downvotes decrease it
- Weight formula: `max(1, up * 2 - dn + 1)`
- Feed recycles when it reaches the end
- Auto-advances every ~8.5 seconds
- Pauses on hover (entire column), resumes on mouse leave
- Manual prev/next + progress bar

### Voting
- Either/or — cannot upvote AND downvote simultaneously
- Clicking active vote toggles it off
- Vote state is per-session (persistent voting requires backend)

### Delete
- Own entries (handle-matched, honor system for now) show a quiet "delete" link
- Confirms once, then removes from feed
- Real auth/ownership deferred to backend phase

### Journal entry schema
```js
{
  id: 1,
  date: "2024-01-15",
  handle: "velvetcassette",
  ctx: "'Sleepwalking'",         // song or show context
  era: "medusas",
  type: "historical",
  src: "archive",
  fact1: "The entry text.",       // always present
  fact2: null,                    // optional extended content
  weight: 7,                      // drives weighted selection
  up: 7,
  dn: 0,
  voted: null,                    // "up" | "dn" | null
  mine: false,                    // true = show delete option
  undoTimer: null                 // countdown seconds, null when committed
}
```

### Data file to create
`src/data/hr_journal_prompts.js` — curated prompts seeded for day one.
`hr_journal_entries.js` is NOT a static file — entries live in Cloudflare KV.

---

## Schema Principle (Applies Everywhere)

Every content object across the entire museum carries:

| Field | Purpose |
|-------|---------|
| `fact1` | Primary display text — always present |
| `fact2` | Secondary/extended — optional, shown on expand |
| `weight` | Weighted selection for facts and journal |
| `era` | Unified tag taxonomy |
| `type` | Unified tag taxonomy |
| `src` | Unified tag taxonomy |
| `date` | For deterministic ordering where applicable |

This schema is consistent across: artifacts, journal entries, facts, songs, prompts.
It drives consistent, predictable UI everywhere.

---

## Deferred / Backlog Items (from this session)

1. **SM video audio handoff** — when an SM video plays, song fades down, pauses,
   video completes, song unpauses and resumes volume. Requires player audio context
   to be exposed. High priority once player is real.

2. **Hard copies of all linked assets** — every artifact linked in the archive
   should have a local hard copy. Discuss: format, storage location, what "hard
   copy" means per media type (image, video, post text, poster PDF). Add to
   `_system\BACKLOG.md`.

3. **Persistent journal entries** — Cloudflare KV hookup. Entries currently
   in-session only. Schema is ready.

4. **Persistent vote counts** — votes currently local. Requires KV or D1.

5. **Real auth for delete/ownership** — currently honor-system handle match.

6. **Weighted journal surfacing tied to real vote data** — once votes persist,
   weight should update server-side and influence selection globally.

7. **"Unpicked bin" concept** — a raw intake layer where uncurated captures land
   before Mike reviews them. Brainstorm only, not designed.

---

## Integration Notes for Next Session

### Where Panel 2 lives in the codebase
- New component: `src/components/HrPanel2.jsx` (or similar)
- Imported into the HR exhibit page alongside Panel 1
- Sits below the player, same scroll container
- Data imports: `hr_archive.js`, `hr_journal_prompts.js`

### Files to create
```
src/components/HrPanel2.jsx         — the panel component
src/data/hr_archive.js              — curated artifact data
src/data/hr_journal_prompts.js      — rotating prompts
```

### Files to update
```
STATE.md                            — add Panel 2 status
_system/BACKLOG.md                  — add deferred items from this session
```

### STATE.md update needed
Under NEXT, replace current items with:
- Device review of r16 (carry forward)
- HrHome landing page (carry forward)
- **Panel 2 integration — HrPanel2.jsx scaffold + placeholder data**
- Domain transfer GoDaddy → Cloudflare (carry forward)

---

## Prompt for Next Session (Chat or Cowork)

```
We are continuing work on the Weird.Baby Museum.
Read STATE.md, VISION.md, and COMPONENT_PHILOSOPHY.md before proceeding.
Build lock must be checked and set before touching any files.

Today's task: Integrate Panel 2 into the HR exhibit.

Reference document: SESSION_CAPTURE_PANEL2.md (produced April 12 2026,
should be in docs\ or provided by Mike).

Panel 2 is a fully designed and prototyped second horizontal panel sitting
below the music player on the HR exhibit page. It contains:
- Left column (60%): Archive scroller (curated social media artifacts)
- Right column (40%): Journal (visitor entries with undo, voting, delete)
- Unified tag bar spanning both columns

The prototype HTML/JS exists in the April 12 chat session. The schema,
behavior spec, and data structure are fully documented in SESSION_CAPTURE_PANEL2.md.

Step 1: Scaffold HrPanel2.jsx as a new component with placeholder data.
Step 2: Create src/data/hr_archive.js with 5 placeholder artifacts.
Step 3: Create src/data/hr_journal_prompts.js with 4 placeholder prompts.
Step 4: Import and render HrPanel2 below the player in the HR exhibit.
Step 5: Update STATE.md to reflect Panel 2 status.
Step 6: Update _system/BACKLOG.md with deferred items from SESSION_CAPTURE_PANEL2.md.
Do not deploy. Build only. Mike will review before deploy.
```

---

*Produced: April 12, 2026*
*Session: Chat — Panel 2 design and prototyping*
*Next session: Cowork or Chat for codebase integration*
