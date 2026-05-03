# Weird.Baby Museum — Component Philosophy

> This document defines how the museum looks, moves, and behaves at every level.
> It is the bridge between the vision and the build.
> Every component, every interaction, every surface is designed to this spec.
> Read alongside VISION.md at the start of any museum build session.

---

## The Foundational Rule

**Every surface is satisfying in itself.**
Nothing is a door to the real thing. Every card, every tile, every thumbnail delivers enough — enough image, enough story, enough taste — that stopping there feels complete, not frustrated. The click is an invitation, not a requirement.

---

## The Spine — Always Present, Never Boxed

The discography spine is the persistent orientation layer of the entire museum. You never leave it. You never lose it. At every depth, at every moment, the spine is visible in some form — full and present at the top, quiet and minimal at the bottom.

**The spine is not a crate. It is not a menu. It is the world.**

### The Three Depths

**Level 1 — On the Spine.**
Full album view. All albums present simultaneously — not hidden, not paginated, not behind a scroll. Browsable, tactile, swipeable. The focused album has the most presence. Others wrap around it, slightly receded, to the sides. The collection wraps — there is a clear start and end, but it loops. You can always hold the whole catalog in your head.

**Level 2 — One Branch Below.**
You've selected an album. The spine remains visible — smaller, drawn across the top — your position on it marked. You can see the branch you're on: the album, its songs, its content laid out before you. Sliding partway back up toward the spine reveals more of it. Clicking the spine marker returns you fully to Level 1.

**Level 3 — Deep in the Branch.**
You're inside a song, a video, a story. The spine shrinks to a minimal indicator — a dot on a line at the top of the screen. Content fills the space because that's what you came for. One tap on the indicator and you begin climbing back up.

### The Rule
The spine never disappears. It breathes — full at the top, minimal at the bottom. It is always the way home.

---

## The Album Shelf (Level 1)

- All albums visible simultaneously
- Horizontal arrangement, swipeable/draggable
- The focused album is largest and most detailed — cover art prominent, title and year readable
- Flanking albums are present but receded — visible, not dominant
- Clear positional indicators so the user always knows where they are in the collection
- Wraps around — but never secretly. The wrap is visible and expected.
- Warm, confident, unhurried. Not a grid. Not a list. A shelf you are standing in front of.

---

## The Album View (Level 2)

When an album is selected:
- The shelf recedes — pulls up to the top as a smaller spine indicator
- The album opens: cover art prominent, tracklist present
- Something begins playing — not because the user asked, but because that is what happens when you open a record
- The persistent player locks in: **what is playing keeps playing** regardless of what the user explores next
- Content branches become visible below: videos, live performances, stories, analysis — surfaced tastefully, not dumped
- Each content item is a rich card (see below), not a link

---

## The Rich Card

The atomic unit of the museum. Every piece of content — every video, every photo, every live cut, every story — is presented as a rich card.

**A rich card contains:**
- A full, high-quality visual (not a thumbnail — a frame)
- Enough text to deliver real value without clicking: what this is, why it matters, what you will find inside
- A clear but unpressured invitation to go deeper

**The principle:** A user who reads the card and moves on has still been satisfied. They got a taste. That taste is the point.

**What a rich card is never:**
- A link with a label
- A thumbnail with a title
- A door with nothing on it

---

## Contextual Expansion

When a user demonstrates interest — clicks into videos, engages with a live performance — the screen reorganizes around that interest.

- The engaged item rises, takes more space, takes focus
- Related content reshapes itself in the space below
- The reorganization is smooth, not jarring — the screen breathes, not jumps
- The way back is always visible — the spine indicator, the album marker, always present
- **The museum follows the user's lead. It never takes over.**

---

## The Persistent Player

Once something is playing, it keeps playing.
Full stop.

Navigation, expansion, exploration — none of it interrupts playback.
The player is a persistent layer, always accessible, never in the way.
The user chose to play something. The museum respects that choice until the user changes it.

---

## Fan Contributions — Branches, Not Rooms

There is no contribution portal. No separate destination.

The invitation to contribute appears exactly where the relevant content lives — contextually, naturally, as part of the experience. It is native to the moment. It does not interrupt. It does not redirect.

**The logic:** You are here, at this depth, looking at this content. That means you care enough. That is exactly who we want contributing.

Examples:
- Watching a live video: *"Have a recording from this show? We want it."*
- Looking at fan art on a song: *"Made something for this one? Add it to the collection."*
- Deep in a setlist from a specific show: *"Were you there? Tell us what you remember."*

Fan contributions don't expand the map. They deepen it.

---

## The Guest Book — Were You There?

Every event, every show, every moment on the spine has a guest book.

Fans who were there can sign it — leave their memory, their experience, their words. Not in a thread somewhere that gets buried. Right here, attached to this moment, permanently.

**The experience:**
- Inline. You don't go to the guest book. The guest book is right there where you are.
- Signing earns recognition — a badge, a marker, something that says: I was part of this.
- Badges extend to all contributions: recordings, photos, fan art, memories. Participation is visible and honored.
- Users can opt in to being remembered — sign in, be recognized — or contribute anonymously.
- The best entries surface editorially, not algorithmically. The ones that make you feel something.

**The tone:** Not a comment section. Not a review. A guest book. You are not reacting. You are signing in. You are saying: I was here. This mattered to me.

---

## Motion and Feel

- **Framer Motion** for all transitions — expansion, recession, spine breathing
- Transitions are unhurried but not slow — confident, like turning a page in a book you are enjoying
- Nothing snaps. Nothing jumps. Everything moves with intention.
- The overall feeling: a well-lit room with good bones. Warm but modern. Clean and classy.
- Hunter's visual identity will eventually inform the palette more specifically. Until then: let the music and the content lead.

---

## What This Is Not

- Not a streaming service
- Not a social feed
- Not a ticket portal
- Not another place to find links to other places
- Not a grid of thumbnails
- Not a lobby with doors

It is a place to fall deeper into artists who deserve that depth.

---

*Version 1 — April 2026*
*Read alongside VISION.md at the start of any museum build session.*
*File location: C:\AI\Projects\weird-baby-update\docs\COMPONENT_PHILOSOPHY.md*
