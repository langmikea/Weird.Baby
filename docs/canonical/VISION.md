# Weird.Baby Museum — Vision

**Filed:** 2026-04-14 (per VISION_LOCK_v0.3 r3 reference; hedged at v43)
**Status:** locked
**Status set:** 2026-04-27

> *The Weird.Baby Museum exists to give serious fans a place that doesn't exist anywhere else — not a directory, not a storefront, not another social feed. A place to fall deeper into artists who deserve that depth.*

> *Weird.Baby is the museum. Hunter Root is the first exhibit.*

---

## What This Is

The Weird.Baby Museum is an independent curatorial entity. We are not a fan page. We are not a promotional arm for any artist. We are not a ticket portal or a streaming service or another place that links you somewhere else.

We are a museum. We choose what to exhibit, how to exhibit it, and who we build it for. Our current featured artist is Hunter Root. That may expand. The museum is the thing. The exhibits serve the museum.

---

## The Three Layers

Weird.baby has three distinct identity layers. Every voice decision, every design decision, every piece of copy the museum produces flows from keeping these layers separate.

**Weebie (W.B.) — the silent mascot.** The face, the icon, the star of the show. Never speaks. The baby is the face because Papa doesn't look good on camera. W.B. appears on the logo, the favicon, the front door. Wherever you see the museum, you see Weebie. Weebie has no voice and no words — only presence.

**Papa Weird.Baby — the faceless narrator.** The voice of the museum. Every curatorial statement, every guest book prompt, every blurb attributed to the museum speaks in Papa's voice. Papa is discoverable as Mike Lang — the first guest book entry is the receipt — but never pushed. The museum doesn't introduce itself by its operator's name. You find that out by paying attention.

**Mike Lang the artist.** Will eventually release his own solo work under the weird.baby name. The museum and the artist share a name by design. This is not a conflict — it is a long game. The museum builds the name, the audience, and the trust. The artist arrives later into a space that already means something.

---

## Who We Are Building For

**The person who goes deeper.**
Not the casual listener. The one who already loves the music and wants more — more context, more story, more connection to the work and the moment it came from. They don't need to be introduced to the artist. They need a place worthy of how they already feel.

**The contributor.**
Violet Lemke covered a Hunter Root song on YouTube. That is exactly who we are building this for. Not just to display her work — to elevate her. She already has an audience who trusts her. When she brings her contribution to the museum she gets real visibility, real recognition, and a permanent home for what she made. Her followers discover the museum through her. The museum's audience discovers her through her contribution. Everyone grows.

The regular journaler. The person who was at the show and has a story to tell. The one who uploaded their own recording from the back of the room. The one going to the show next week. These people are not content sources. They are collaborators. They are the living tissue of what a museum becomes over time.

**The Abundance Principle.**
We will never fight over the last piece of pie. We are always working to make more pie. That means working *for* the people who are working for the artists we feature — not managing them, not extracting from them, not treating amplifiers as competition.

This is a high mentality operation. Act accordingly at every decision point.

---

## The Spine

Each featured artist has a spine. The spine is the discography — the artist's body of work in chronological order. It is not a section of the museum. It is the organizing principle of the entire exhibit.

Everything hangs off the spine. Every video, every photo, every live recording, every piece of fan art, every guest book entry, every story — it lives at its place on the timeline, attached to the song or album or show it belongs to. There are no separate rooms. No video room. No photo room. No poster room. One spine. Everything as branches.

- **Pre-discography:** Origin. Where the artist came from. What existed before the first record.
- **The albums:** The trunk, in order. Each one a world.
- **Singles and one-offs:** They find their place on the line.
- **Post-discography:** What's live, what's coming, what's now.

The branches — video, audio, visual art, story, analysis, live performances, fan contributions — are lenses you apply at any point on the spine. You're not navigating to a video room. You're standing at a specific album and choosing how deep you want to go.

**The spine is always visible.** At every depth, at every moment, you know where you are. It breathes — full and present at the top level, a quiet indicator at the deepest level. It is always the way home.

---

## How It Feels to Be There

You enter and the full shelf is in front of you. Every album, present and browsable. The one in focus has the most presence. You can move through them — swipe, slide, whatever feels right. There is a clear beginning and end to the collection. You can hold the whole thing in your head.

You select an album. The shelf recedes but doesn't disappear — it stays at the top, smaller, marking where you are. Something begins playing. Not because you asked. Because that's what happens when you open a record. The persistent player locks in: **what is playing keeps playing** regardless of where you go next.

Every surface delivers something. Not a link. Not a door. A rich card — a real image, enough story to satisfy, an unhurried invitation to go further. You can stop at the card and feel complete. The click is never required.

When you demonstrate interest — engaging with live videos, lingering on a particular era — the screen reorganizes quietly around that interest. More of what you care about surfaces. The way back is always visible. The museum follows your lead. It never takes over.

You are not navigating pages. You are pulling on threads. Each pull reveals more of that thread without losing the fabric.

---

## The Guest Book

Every show, every song, every moment on the spine has a guest book.

The contribution opportunity is always present — never intrusive, always contextual. You're watching a live video: *"Have a recording from this show? We want it."* You're deep in a setlist from a specific night: *"Were you there? Tell us what you remember."*

Signing earns recognition. Contributing earns visibility. The best entries surface — not algorithmically, editorially. The ones that make you feel something.

Fan contributions don't expand the map. They deepen it.

### The Contribution Shell

Everything a fan creates in the museum is the same object underneath. A guest book entry, a fan playlist, a future review or annotation — they are all *contributions*. One content type in the system. One card format. One reaction system. The shell is universal; what fills it determines how it surfaces.

The system tags contributions automatically by context. Where the entry was made — which exhibit, which point on the spine, what was playing — determines whether it surfaces as a guest book entry, a playlist, or something else. The contributor doesn't choose a category. They contribute. The museum knows what it is.

This is the governing architectural principle for all fan-created content. New contribution types drop into the same architecture. No bolted-on systems that don't talk to each other. Consistent browsing and discovery across everything fans create.

### Context Capture

When a fan writes a guest book entry, the system silently snapshots the current player state as metadata attached to the entry. The fan sees nothing extra, fills out nothing extra. The snapshot records what song was playing, which version, the timestamp within the song, and the playlist context if one was active.

The adjacent music is the most likely referent for anything emotional a fan writes. Capture it now, curate it later.

---

## Tech Foundation

weird.baby is React Router on Cloudflare Workers. The lyric map is live. The discography data is structured. Phase 1 built the infrastructure. Phase 2 builds the museum deliberately on top of it.

**Stack:** React + Framer Motion for contextual expansion and motion + a single JSON data spine per artist.

**The governing document for how everything looks and behaves:** COMPONENT_PHILOSOPHY.md — read alongside this file at the start of any build session.

---

## Design Principles

- **The museum is the entity.** Artists are exhibits. Infrastructure is backstage. The front door says Weird.Baby.
- **Every surface is satisfying in itself.** Nothing is just a door.
- **The spine is always present.** Never boxed. Never hidden. Always the way home.
- **Build for weird.baby.** The museum lives here until there is a compelling reason to move it. That day is not today.
- **Correct over fast.** Always.

---

## 12-Month Picture

- The museum has its killer app — the one thing that makes it the only place to go for this kind of depth.
- The first exhibit is built to the spine architecture and feels complete enough to invite contributors.
- Violet Lemke and fans like her have found the museum and feel genuinely seen by it.
- The content pipeline is deep enough that the well doesn't run dry.
- The infrastructure runs. You are not feeding it daily.

---

*Version 3 — April 14, 2026*
*Read alongside COMPONENT_PHILOSOPHY.md at the start of any museum build session.*
*File location: C:\AI\VISION.md*

---

## The Founding Visitor

The museum is indexed but unannounced. No links point here. No post announces it. But it can be found — and the right kind of person will find it.

Anyone who walks in before the doors officially open gets something no one else can ever get: the Founding Visitor badge. Timestamped. Permanent. Theirs because they were curious enough and early enough to be here first.

There is no announcement. There is no campaign. There is a guest book, some cookies, and a quiet note that says: you found this early. that means something. leave your name.

This is the earliest easter egg. It cannot be recreated. It will only exist once.
