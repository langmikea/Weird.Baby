# HOMESTEAD INSTAGRAM VIDEO — REQUIREMENTS SPEC
**Version:** 0.2 (Divergent / Design Decisions Locked)
**Status:** Brainstorm complete — ready for scene description pass
**Project:** Hunter Roots Homestead Fan Page — Instagram Extension

---

## 1. PURPOSE

Extend the Hunter Roots Homestead Facebook fan page presence to Instagram via a weekly video Reel. The video translates the week's Facebook terminal-persona content into a cinematic short-form format consistent with the Homestead brand identity. Primary goal: drive traffic to the Facebook fan page. Secondary goal: establish the Homestead as a canonical visual and aesthetic identity for the Hunter Root digital archive and museum.

---

## 2. CONCEPT OVERVIEW

### 2.1 The Homestead System
The Facebook fan page operates under a deterministic terminal persona — a system that runs autonomously, finds things, and reports them flatly, with just enough warmth to be human without pretending to be. The Instagram video is not a translation of that persona. It is the *room that persona lives in.*

The viewer is not interacting with the terminal. They are observing it. They found it. Nobody told them about it. It has been running for a very long time.

### 2.2 The Room
A stone farmhouse room. Central Pennsylvania aesthetic — worn, real, not styled. Dark except for the glow of the terminal screen and ambient light leaking from a window or door. A bare bulb may be present. Nothing is curated. Everything has been here for years.

The room is the canonical environment of the Homestead. It does not need to represent Hunter Root's actual space. It is the *spirit* of that world — acoustic rock, folk, grunge, 60s psychedelic undertow, Lancaster PA roots, the kind of place where someone makes something real and doesn't make a fuss about it.

**Emotional truth of the room:** Crooked Home. It has been loved. The person who loved it doesn't come here anymore. But the machine keeps running.

### 2.3 The Terminal
A period-appropriate computer terminal — not modern, not retro-cosplay. Practical. It was installed for a reason and has been doing its job since. The screen is the only dynamic element in the scene.

### 2.4 The Camera — LOCKED
The Ken Burns move is a **slow parallax rotation**. The scene is 3D-rendered specifically to allow parallax depth between room layers — foreground objects, the terminal, the back wall, the shelf. The rotation is imperceptibly slow. It never feels like a camera move. It feels like the room is breathing.

Push-in toward the CTA area is possible but deferred — to be evaluated when the first render is available. If present, it is slight.

The **directional bias** of the move is subliminal toward the CTA cluster (bottom right of frame, desk area). The viewer should never feel directed. They should simply find themselves looking there.

The move is identical every week. It is ritual. It is the opening credits.

---

## 3. AUDIO

### 3.1 Character
The audio is not a soundtrack. It is ambience. The goal is immersive presence, not production value. The listener should feel they are in a quiet room where a machine is working and something is playing softly in another corner.

### 3.2 Layers
- **Layer 1 — Music:** An instrumental portion of a Hunter Root song, or an appropriate analog (acoustic, low-key, worn). Played at reduced volume. The source is a small AM transistor radio or a record player in the room — not a PA system. The music is incidental to the machine. It just happens to be there.
- **Layer 2 — Vinyl texture:** Record pops, crackle, and hiss. Light. Suggests something playing on a turntable in the corner. Reinforces the worn, analog, unhurried atmosphere.
- **Layer 3 — System audio:** Soft, period-appropriate computer sounds — beeps, drive hum, the kind of sounds that 1970s–80s film and TV associated with computers doing serious work. Low in the mix. Underneath everything.

### 3.3 Intent
The audio carries the immersion. It is not trying to be Hi-Fi. It is the soothing background noise of a server doing its job, with Hunter playing on the little AM transistor radio on his desk. Or the record player.

### 3.4 Licensing — DEPENDENCY
Using an actual Hunter Root track requires his awareness and approval, even for a fan page. This is a hard dependency before the audio layer is finalized. Three paths available:
1. Hunter approves a specific track — preferred
2. A licensed instrumental is sourced that matches the vibe
3. Audio bed is constructed entirely from vinyl texture + system sounds, no identifiable music

Path 1 is the goal. Do not build around a specific track until this is resolved.

---

## 4. VISUAL CONTENT — SCREEN OVERLAY

### 4.1 Structure
The video is a two-layer composite:

- **Layer A — Scene video:** Generated once. The 3D farmhouse room with terminal, Ken Burns move, all environmental detail. Fixed. Never changes week to week. This is the shell.
- **Layer B — Content overlay:** A composited window mapped to the terminal screen surface. This is the only element that changes weekly. It contains the week's Homestead terminal output.

### 4.2 Content Window
The terminal screen is large enough to read but is not the flat, full-frame focus of the shot. The camera sees the room first; the screen is the point of interest within it.

Content displayed on screen is a tease — not a full reproduction of the week's Facebook posts. Enough to communicate that the system found things. Enough to make the viewer want to go find out more. Images are permissible as small previews embedded in the terminal output (in the Facebook posts, images are excluded for visual simplicity; on video, the system would plausibly have retrieved thumbnails during its search cycle).

**Content window visual spec — to be defined in scene description pass:**
- Font, color, phosphor treatment
- Text render behavior (instant vs. typewriter)
- Cursor presence and behavior
- Image thumbnail framing within terminal output
- How much content fits at readable scale

### 4.3 Content Source and Assembly
The video generator is a dumb assembler. It receives pre-built assets and composites them. All content decisions happen upstream during the Facebook build cycle.

Individual post elements will be available as discrete assets. Sub-compiled groupings and a full-week compilation will also be available. The Instagram posting pipeline will apply rules — determined separately — about which elements appear in the video (all in order, flagged only, always-include set, etc.). The assembler does not make these decisions.

---

## 5. CALL TO ACTION — LOCKED

The terminal does not acknowledge the audience. The terminal does not know it is being watched. The room communicates with the audience.

Two CTAs. Two timelines.

### 5.1 CTA 1 — The Pad (Present from launch)
**Object:** A pink "While You Were Out" telephone message slip. Already on the desk when the room was built. Has bleed-through ink from the sheet above it — someone pressed hard when they wrote. The message is functional, not designed. It is the most accidental-looking intentional thing in the room.

**Position:** Bottom right of the scene, on the desk. This is the natural terminus of the subliminal Ken Burns directional bias.

**Message:** Points to Hunter Roots Homestead on Facebook. Makes clear that tour info, tickets, links, and content all flow through there. One destination. No fragmentation. If there are tickets, they're on the fan page. Everything is on the fan page.

**Philosophy:** It was left there. It was always there. Nobody placed it for the audience.

### 5.2 CTA 2 — The Sticky Note (Future, when archive launches)
**Object:** A sticky note placed near the cassette tape stack on the shelf behind the monitor.

**Trigger:** Added to the scene when the digital archive and museum has something to point to.

**Message:** Directs viewers to the archive/museum.

**Philosophy:** The cassette tapes already predicted this. The sticky note just confirms it. The room knew before the audience did.

---

## 6. EASTER EGGS

### 6.1 Philosophy
The room knows more than it shows. It rewards return visits. Nothing is explained. Nothing is announced. The standard is the Playboy magazine hidden bunny — present on every cover, findable by anyone looking, never called out.

### 6.2 The Number 94
94 is the primary recurring Easter egg across the entire Homestead system — not just the scene.

**In the scene (baked permanently):** At least one instance of 94 is visible in the template — likely on a cassette tape label, always in frame. Additional instances may appear in plausible locations where a number could naturally exist (equipment labels, handwritten notes, etc.). Not overwhelming. The type of thing that gets looked for once you know.

**In the weekly Facebook content:** Each week, the operator includes at least one 94 Easter egg somewhere in that week's posts. This is a production requirement, not a suggestion.

**In the post builder (requirement):** The Facebook post builder should include a validation check confirming a 94 Easter egg has been placed for the week, and should maintain a running catalog of where each week's egg appeared.

### 6.3 Scene Easter Eggs (baked at creation, never changed)
- **94** — On a cassette tape label. Always visible. May appear elsewhere in plausible locations.
- **Nick** — Hunter's brother's name. Present somewhere in the environment — a cassette label, a handwritten note, a name on something.
- **Seeds** — Hunter's early band. Cassette label, hand-lettered poster remnant, or similar.
- **Medusa's Disco** — Band before Hunter went solo. Same treatment as Seeds. Both live near/on the cassette stack.
- **Crooked Home** — May appear as a tape label or written somewhere. Ambient. Never explained.

### 6.4 The Cassette Stack
The shelf behind the monitor holds a sloppy stack of hand-labeled cassettes. Labels reference: live recordings, rarities, interviews, Seeds, Medusa's Disco. This stack is the physical embodiment of the digital archive mission. It is what the archive *is*, in analog form. The room predicted the archive before the archive existed.

---

## 7. PLATFORM SPECIFICATIONS (Instagram Reels)

- **Format:** MP4, H.264 video codec, AAC audio
- **Resolution:** 1080 × 1920 px
- **Aspect ratio:** 9:16 (vertical, full-screen mobile)
- **Frame rate:** 30fps
- **Target duration:** 45–60 seconds (platform supports up to 3 minutes; this content performs best short)
- **File size target:** Under 100MB
- **Safe zone:** Key visual content (terminal screen, CTA pad) within center 4:5 area to survive profile grid crop
- **Thumbnail / cover frame:** The terminal glowing in the dark room — intentional, not default export. To be defined during scene build.
- **Caption:** Up to 2,200 characters; use for context, keywords, Facebook page link

---

## 8. PRODUCTION MODEL

### 8.1 One-Time Assets (build once)
- 3D scene render with Ken Burns parallax rotation locked
- Audio bed (vinyl + system sounds, looped/trimmed to target duration)
- Music track selection and treatment (pending licensing — see Section 3.4)
- Easter egg placement and bake-in
- CTA 1: "While You Were Out" slip on desk

### 8.2 Future One-Time Assets (when archive launches)
- CTA 2: Sticky note near cassette stack

### 8.3 Weekly Assets (generated per cycle)
- Content overlay for terminal screen (from Facebook build cycle output)
- Final composite render
- Caption text with Facebook page reference
- 94 Easter egg placed somewhere in that week's Facebook content (validated by post builder)

### 8.4 Toolchain Constraints
Must run on Windows within the existing `C:\AI\Projects\` workspace. Python is the preferred automation layer consistent with existing pipeline. Compositor TBD — recommendation is to prototype visually first (DaVinci Resolve or CapCut), nail the aesthetic, then port the repeatable elements to Python automation.

---

## 9. OPEN QUESTIONS (deferred, not blocking)

1. Hunter Root music licensing — which track, and is he in the loop?
2. Ken Burns push-in — evaluate on first render
3. Content window visual spec — font, color, text behavior (deferred to scene description pass)
4. Number of initial scene variants — one confirmed; more possible later
5. Posting automation — manual upload vs. scheduled via third-party tool
6. Asset handoff — how does the Instagram assembler receive its weekly package from the `fb_poster` pipeline?

---

## 10. WHAT THIS IS NOT

- Not a highlight reel
- Not a music video
- Not a slideshow of Facebook screenshots
- Not a personality-forward, energetic, algorithm-chasing Reel
- Not interactive
- Not high fidelity
- Not loud

It is a quiet machine in a dark room that has been running for a very long time. And somehow that is enough.

---

*v0.2 — Design decisions locked. Next step: scene description pass. Describe every visible element in the room in enough detail that a 3D artist or generative tool could build it without this conversation.*
