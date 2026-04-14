# Panel 3 — The Artifacts
### Weird.Baby Museum / Hunter Root Exhibit
### Spec v0.1 — April 2026

---

## What This Is

The Artifacts is the memories box. Where Panel 2 shows the story as it was told
in real time, The Artifacts holds the physical and ephemeral record — the things
people made, carried, held, and kept. Posters. Setlists. Fan photos. Fan art.
Handwritten lyrics. Ticket stubs. Fan video. The proof that people were there.

This is not a repository to pick through. It is curated, exquisitely organized,
and always anchored to where you are on the spine.

---

## Relationship to the Spine

The active album provides a soft anchor — a starting point, not a boundary. The
Artifacts rail begins at the anchor and auto-advances chronologically from there.
The fan is never confined to that position. They may drift in either direction
without restriction.

The anchor updates passively as the queue advances. It does not interrupt a fan
who is actively browsing. If a fan disengages and returns, the display reorients
to the current anchor point.

---

## The Rail

All artifact types live on a single unified rail, ordered chronologically. There
are no separate rails per type. Filters narrow the rail — they do not switch it.

**Default state:** Full rail, all types, soft-anchored to the active album era.

**Filtered state:** Fan selects one or more type filters. Rail narrows to matching
artifacts. The same chronological order and anchor behavior applies.

**Display:** One artifact at a time, centered, filling the available frame.
Neighboring artifacts bleed in at the edges — enough to signal there is more,
not enough to compete. The museum hands you one object at a time: look at this.

**Auto-advance:** 7-8 second interval, consistent with Panel 2. Pauses on hover.
Resumes on leave.

**Navigation:** Left/right controls always visible, always wrapping. Counter shows
position. Progress bar reflects position on the filtered rail.

**Click:** Opens lightbox. Full artifact display with metadata — type, date,
provenance, caption, secondary detail where available.

---

## Artifact Types and Tags

### Type tags (filter the rail):
- poster       — show posters, flyers, promotional art
- setlist      — setlists from the stage
- photo        — fan photos, live shots, candid
- fan-art      — original work created by fans in response to the music
- handwritten  — lyrics, notes, anything in the artist's hand
- video        — fan-shot video, live recordings not in the player above
- ticket       — ticket stubs, passes, physical ephemera

### Era tags (shared with Panel 2 tag system):
- seeds / medusas / solo

### Provenance tags (new to Panel 3):
- donated      — submitted by a fan through the museum
- archive      — sourced and verified by the museum
- stage        — pulled directly from the show environment

---

## Absent Rails

If no artifacts exist for a given type within the current filter set, that type
tag is visually dimmed and non-interactive. No empty states, no placeholder cards.
The museum is always honest about what it has.

---

## Data Schema

Extends the existing HR_ARCHIVE schema with one addition (credit field):

  date        ISO date string — chronological sort key
  era         "seeds" | "medusas" | "solo"
  type        "poster" | "setlist" | "photo" | "fan-art" | "handwritten" | "video" | "ticket"
  src         "donated" | "archive" | "stage"
  fact1       Primary caption — always present
  fact2       Secondary detail — optional, lightbox only
  credit      Contributor handle or name — optional
  color       Placeholder bg until real image
  icon        Placeholder emoji until real image

---

## Relationship to Panel 2

Panel 2 and Panel 3 share tag infrastructure and rail chassis. They are separate
components with separate data files. Content does not cross between them.

Panel 2 is the record as it happened — social posts, announcements, the story
told in real time.

Panel 3 is the memories box — the physical, the ephemeral, the things people
held in their hands or shot on their phones.

**Tag cleanup required in Panel 2:** poster and photo are currently listed as
Panel 2 type tags. These belong exclusively to Panel 3 and should be removed
from HrPanel2.jsx TYPE_TAGS. Any existing hr_archive.js entries of those types
migrate to hr_artifacts.js.

---

## Component Identity

  Component:  src/routes/hr/HrPanel3.jsx
  Data:       src/data/hr_artifacts.js
  CSS prefix: p3-
  Inherits:   tag system, rail behavior, lightbox, auto-advance, hover-pause,
              wrapping nav from Panel 2 patterns

---

## Layout

Full width below Panel 2. Column structure (full-width rail vs retained 60/40
split) deferred pending donation block placement decision.

---

## Deferred

- Donation flow — acquisition UI, submission form, provenance workflow.
  Held for separate dedicated discussion.
- Contributor recognition — how donors are credited, visibility of provenance.
- Fan art permissions — requires conversation with Hunter before build.
- Column layout — pending donation block placement decision.

---

## Open Questions for Main Thread

1. Does Panel 3 retain the 60/40 split from Panel 2, or does The Artifacts run
   full width with the donation block handled differently?
2. Confirm: poster and photo removed from Panel 2 type tags. Existing entries
   of those types migrate from hr_archive.js to hr_artifacts.js.
3. Fan art — flag for Hunter conversation before this goes into build.

---

Spec v0.1 — brainstorm thread — April 12 2026
Companion docs: VISION.md, COMPONENT_PHILOSOPHY.md, SESSION_CAPTURE_PANEL2_INTEGRATION.md
