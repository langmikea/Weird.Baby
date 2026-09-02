# THE STACKS — Discovery Filter UX Specification

**Status:** v1.0 — UX nailed in prototype, ready to design into the system
**Owner:** Mike (UX) · Claude (build/ops support)
**Companion docs:** Museum Artifact Discovery & Filtering (metadata model + UX), this supersedes the filter-UX portion
**Reference prototype:** `filter-instrument-v7.html`
**Guiding principle:** Visitors are *perusing to find what they haven't seen*, not retrieving one known artifact. The instrument rewards wandering.

---

## 1. What this is

The filter instrument is the control surface a visitor uses to narrow the collection before browsing it in the deck/carousel. It is **not** where artifacts are played or read — that happens in the carousel. This surface answers one question: *what slice of the collection do I want to wander through right now?*

The deck is held **static** until the visitor commits (OK). The instrument is a moment you step into, play in, and leave — not a live-updating sidebar.

---

## 2. The two-tier facet model (the core decision)

Facets split into two tiers by a single test: **is the visitor scanning to peruse, or hunting one specific value?**

### Basic surface — the perusal facets (always visible, full-width)
Short, scannable lists. This is where wandering happens.
- **Kind** — the *role* of the artifact: Performance, Interview, Review, Cover, Studio, Candid, Press, Fan Submission. This is the hero facet; it's the "what else is here" axis.
- **Topic** — Songwriting, Recording, Touring, Family, Gear, Influences.
- **Era** — human-readable eras, never raw years.
- **Project / Band** — Solo, side projects, collaborations.
- **Format** — the *medium*: Photo, Video, Audio, Text, Web. Present but visually demoted (it's a refinement, not a discovery axis).

### Detail Filtering — the hunt facets (behind a banner, collapsed by default)
Long lists, or values you'd seek deliberately. Most visitors never open this.
- **Album**, **Song** — moved here because selecting one is "play this," which belongs to the carousel. Here they're a way to find *material around* a release/song.
- **Venue** — many values, few hunting a specific one. Gets its own filter+scroll box.
- **Source / Platform** — Facebook, Instagram, YouTube, TikTok, Reddit, Official Site, Archive.org, Fan Submission.
- **People** — producer, bandmates, engineer, manager, etc.
- **Importance** (curator field, optional in UI) — Primary / Secondary / Minor.

The Detail banner reads: **DETAIL FILTERING — *for finding one specific thing.*** It owns its own density so the basic surface stays calm.

### Kind vs. Format are deliberately separate
They answer different questions and are orthogonal: an interview can be Video *or* Text; a cover can be Audio *or* Video. Merging them into one "Type" facet forces false choices and buries the interesting axis (role) under the boring one (medium). **Cost to accept:** every artifact needs both tags in the metadata. That cost is what makes "all interviews regardless of medium" and "all video regardless of role" both work. Worth it.

---

## 3. Total vs. Partial facets (the critical engine decision)

Every facet is marked **total** or **partial**. This is a real field in the metadata model, not a UI detail — the filter engine reads it.

- **Total facet** — every artifact has exactly one value (Kind, Format, Era, Project, Topic). Selecting a value **filters**: results must match. Standard faceted-search behavior (AND across facets, OR within a facet).

- **Partial facet** — only *some* artifacts have a value (Source, Venue, People, Album, Song). A studio photo has no platform; an interview has no venue. Selecting a value **scopes**: it narrows the population the facet *governs* and leaves artifacts the facet doesn't apply to **untouched**.

### Why this matters (the bug it prevents)
The standard convention — values across different facets combine with AND — is correct for total facets and quietly catastrophic for partial ones. Selecting "Facebook" under a naive AND means *every result must have source = Facebook*, which silently amputates every studio photo, audio demo, and candid that was never on any platform. In the prototype's dummy data, selecting Facebook the naive way dropped the collection from a sensible 33 to **3**. Scoping keeps it at 33 (the 3 Facebook items + 30 off-platform artifacts the facet has no business judging).

### Rule
> For a partial facet, an artifact with **no value** in that facet is **exempt** from the filter — never rejected by it. Only artifacts that *have* a value in the facet are narrowed by a selection.

### Make the safe behavior visible
Silent correctness is as dangerous as silent failure — the visitor must understand why their artifacts didn't vanish. Three legibility cues, all in the prototype:
1. Partial facets wear a small `scopes` tag in their header.
2. When a partial facet is active, a one-line note: *"narrows items that have a source; keeps the rest."*
3. The footer tally shows what's being held safe: `33 / 54 · +30 off-facet kept`.

**No layout shift:** the scoping note's space is reserved whether or not it's showing, so selecting never moves the chips. (This was a real defect caught in review — partial facets must not jump when selected.)

### Deferred but designed-for: explicit include/exclude
Scoping is the safe *default*. The power-user layer — "Facebook only" vs. "everything except Facebook" — rides on top later. The selection model already holds a set per facet; an exclude-set drops in beside it without a rebuild. Not in v1.

---

## 4. Interaction model

- **All facets open at once.** No chain, no progressive reveal, no locked layers. Enter wherever curiosity points.
- **Multi-select, additive.** Within a facet, multiple values are OR (Breakthrough OR Recent). Across facets, AND (Recent AND Interview) — except partial facets, which scope.
- **Empty facet = all of it.** Selecting nothing in a facet doesn't filter; every value passes. Stated plainly in each facet header (`all` vs `2 · clear`). No hidden modes.
- **Counts are the map.** Every chip shows a live count reflecting all *other* current selections. Counts are how a wanderer spots rich seams and dead ends.
- **Zero-count values dim** (dotted, inert) by default. A **hide empty** toggle collapses them entirely for a cleaner board. Visitor's choice — seeing options disappear is itself powerful feedback, so dim-by-default keeps it.
- **Clicking, not dropdowns.** Chips toggle. Uniform height, left-justified, content-width, wrapping into rows. Lists read **vertically** (one value per row), columns of facets tile **horizontally** across the full width.
- **Long lists self-contain.** Any facet over ~8 values gets its own filter input and a fixed-height scroll box, so no single facet runs away down the page.

---

## 5. Layout

PC-optimized, full-width. Use the whole screen to show as much of the filter surface at once as fits.

```
┌────────────────────────────────────────────────────────┐
│  THE STACKS · FILTER                    all 54 artifacts │  header
├────────────────────────────────────────────────────────┤
│  IN VIEW   [Interview ✕] [Recent ✕]          ↺ clear all │  active-set bar (TOP)
├────────────────────────────────────────────────────────┤
│  THREADS  [The Hollow Season] [In Their Own Words] [...] │  saved filter-sets
│           [more… ▾]                                      │
│  ⊙ hide empty                                            │  global toggle
├────────────────────────────────────────────────────────┤
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ │  BASIC surface
│  │ KIND   │ │ TOPIC  │ │ ERA    │ │PROJECT │ │ FORMAT │ │  facets tile
│  │ ▢ Perf │ │ ▢ Song │ │ ▢ Early│ │ ▢ Solo │ │ ▢ Photo│ │  horizontally,
│  │ ▢ Intv │ │ ▢ Rec  │ │ ▢ Break│ │ ▢ Tin  │ │ ▢ Video│ │  lists read
│  │ ...    │ │ ...    │ │ ...    │ │ ...    │ │ ...    │ │  vertically
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘ │
├────────────────────────────────────────────────────────┤
│  ▼ DETAIL FILTERING — for finding one specific thing     │  banner (collapsed)
│    [album · song · venue · platform · people]            │
├────────────────────────────────────────────────────────┤
│  47 artifacts / 54 · +12 off-facet kept                  │  tally + held-safe
│                        [save thread] [cancel] [ OK ]     │  footer
└────────────────────────────────────────────────────────┘
```

- **Active-set bar lives at the top**, above Threads and facets — it's the header that answers "what am I looking at," basic tags in ink, partial/detail tags in oxblood, each removable, `↺ clear all` at the right.
- **Footer:** result tally with held-safe readout, then `save thread` / `cancel` / `OK`.

---

## 6. Threads (= saved filter-sets, formerly also "presets")

Threads and Presets were the same idea; they're now one concept: **a named, saved filter-set — a way back into the collection.**

- **Curator Threads** (oxblood border) — Mike-defined entry points: "The Hollow Season," "In Their Own Words," "Covers & Fan Work," "On the Road."
- **User Threads** (dashed border) — a visitor builds a combination and names it via `save thread`.
- A **curated few** sit on the bar; the rest live in a `more…` dropdown.
- **Toggle behavior:** clicking an active Thread turns it off, back to unfiltered. Same control both directions.
- Loading a Thread that uses Detail facets auto-opens the Detail zone, so the visitor sees why results narrowed.
- The curator/user distinction is carried by border style alone — no legend. If a visitor needs the legend explained, the design has failed; clicking any Thread just works.

(Note: Threads as a *living, growing collection* — new content automatically flowing into matching Threads — is a natural consequence of the saved-filter-set model: a Thread is a query, so new artifacts that match appear in it automatically. No extra mechanism needed.)

---

## 7. Commit model (standard, Windows-familiar)

- **OK** — commit the current selection to the deck, close the instrument.
- **Cancel** — revert to the selection as it was when the instrument opened, close.
- **save thread** — name the current combination and add it to the Thread rail.
- **↺ clear all** (top bar) — drop all selections, return to unfiltered, stay open.

No live deck updates; the deck is static until OK. This is a settings dialog, not a search-as-you-type.

---

## 8. Things deliberately rejected (so they don't get reintroduced)

- **The progressive-narrowing "spine"** (v1 prototype) — led the user through a forced chain. Killed: visitors want all facets at once.
- **The "untagged" catch-all chip** (v6 experiment) — framed a meaningful population ("this has no platform") as a data error ("untagged"). Confusing. Replaced entirely by partial-facet scoping, which handles the same population correctly and invisibly.
- **Album cover-color tick** — decoration that earned a "what's that for?" instead of doing a job. Removed. Real cover-art thumbnails may return later as a genuine affordance.
- **Single narrow column** — wastes a PC screen. Full-width multi-column instead.

---

## 9. Metadata implications (hand-off to the data model)

The Discovery metadata spec must add/confirm:
1. **`facet_type: total | partial`** on every facet — the engine depends on it (§3).
2. **Kind and Format as separate facets**, both required on every artifact (§2).
3. **Partial facets may legitimately have null** for many artifacts — null is *meaningful* (off-platform, not-a-performance), not a curation gap.
4. **Importance** (Primary/Secondary/Minor) remains the hidden curator field from the original spec; optionally surfaced in Detail Filtering.
5. Threads stored as named saved filter-sets (the selection state per facet), curator- or user-owned.

---

## 10. Presentation (deferred, per Mike)

How this instrument is *presented* — full-surface overlay, centered pop-over, command-palette — is a separate decision to be made when the instrument is fitted into the museum. The prototype is presentation-neutral on purpose. What's locked here is the **WHAT**: the facets, their tiers, the scoping engine, the interactions, the Threads model.
