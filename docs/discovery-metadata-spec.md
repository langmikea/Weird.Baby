# Discovery Metadata Spec — The Model-A Data Model

**Status:** v0.1 draft — data model for the Discovery filter instrument. Pairs with `discovery-filter-ux-spec.md` (the UX side); this is the metadata side.
**Owner:** Mike (curation/confirmation) · Claude (drafting/build support)
**Companion doc:** `discovery-filter-ux-spec.md` — values and rules here are pulled from its §2 (facet model), §3 (total/partial engine), and §9 (metadata hand-off).
**Decision of record:** Mike chose **Model A** (Kind / Topic / Era / Project / Format facets + total/partial scoping). This document is the authoritative expression of Model A.
**First retag scope:** the **33 artifacts in `src/data/exhibits/hunter_root.json`**. The 185-row MediaVault retag is a backlogged follow-on, out of scope here.

> **How to read the `[PROPOSAL — Mike to confirm]` markers.** Where a value is *written* in the UX spec or present in the data, this doc states it as fact. Where a value is **not** written anywhere, this doc fills a clearly-labeled proposal with reasoning. Every proposal is also collected as a numbered punch-list in the hand-off so Mike can confirm or adjust each one. Nothing in a `[PROPOSAL]` block is locked.

---

## 1. Facet schema

Every facet carries two engine-facing properties, both required by the filter engine (UX spec §3):

- **`facet_type: total | partial`** — *total* means every artifact has exactly one value; selecting a value **filters** (results must match). *partial* means only some artifacts have a value; selecting a value **scopes** (it narrows the population that has a value and leaves artifacts with no value **untouched**).
- **`open | closed`** — *closed* = the value list is a fixed curator-controlled vocabulary; *open* = new values may appear from the data without a spec change.

**The two required tags.** Per UX spec §9.2, **Kind and Format are both required on every artifact.** They are deliberately separate facets (§2): Kind is the *role* (the discovery axis), Format is the *medium* (a refinement). Keeping them orthogonal is what makes "all interviews regardless of medium" and "all video regardless of role" both work, at the cost of two mandatory tags per artifact.

**Partial-facet null semantics.** For a partial facet, an artifact with **no value is exempt** from any selection in that facet — never rejected by it (§3 rule). Null is **meaningful**, not a curation gap: a studio photo legitimately has no Source/Platform; an interview legitimately has no Venue. Only artifacts that *have* a value are narrowed by a selection. (This is the bug-prevention engine from §3 — naive AND on a partial facet silently amputated the collection from 33 to 3 in the prototype.)

### Schema table

| Facet | Tier (UX) | `facet_type` | `open/closed` | Required? | Value source |
|---|---|---|---|---|---|
| **Kind** | Basic (hero) | total | **[PROPOSAL]** | **Yes** (§9) | curation |
| **Topic** | Basic | total | **[PROPOSAL]** | total ⇒ one value **[PROPOSAL: hard-required?]** | curation |
| **Era** | Basic | total | closed | total ⇒ one value **[PROPOSAL: hard-required?]** | curation (post_date as hint) |
| **Project / Band** | Basic | total | **[PROPOSAL]** | total ⇒ one value **[PROPOSAL: hard-required?]** | derivable from `bands` + `lineup` |
| **Format** | Basic (demoted) | total | closed | **Yes** (§9) | derivable from `media_type` |
| **Album** | Detail | partial | open | no (null ok) | `tags.album` |
| **Song** | Detail | partial | open | no (null ok) | `tags.song` |
| **Venue** | Detail | partial | open | no (null ok) | curation / description |
| **Source / Platform** | Detail | partial | closed | no (null ok) | `source_platform` / `tags.source` |
| **People** | Detail | partial | open | no (null ok) | `tags.people` |
| **Importance** | Detail (hidden) | partial | closed | no (curator field) | curation |

Notes on the table:

- **Total facets** are the five Basic-surface facets (Kind, Topic, Era, Project, Format) — exactly as §3 enumerates ("every artifact has exactly one value (Kind, Format, Era, Project, Topic)").
- **Partial facets** are the Detail-tier facets (Source, Venue, People, Album, Song) — exactly as §3 enumerates.
- **Importance** (Primary / Secondary / Minor) stays the hidden curator field from the original spec; optionally surfaced in Detail Filtering (§9.4). Treated as partial because it is optional.

> **[PROPOSAL — Mike to confirm] — single-value Topic.** §3 lists Topic as a *total* facet, which by §3's own definition means exactly one Topic value per artifact. That is potentially restrictive: a single post can plausibly be about both *Songwriting* and *Family* (e.g. MV-HR-20260405-013, the tribute to Nick Root, touches Family and arguably Influences). **Recommendation:** keep Topic *total/single-value* for v1 as written, and pick the single dominant topic during curation; revisit multi-value Topic only if the single-value rule forces too many bad calls. Flagging because "one Topic per artifact" is implied by §3 but never stated as a deliberate restriction.

---

## 2. Kind values (the hero facet)

**Written in UX spec §2** (the *role* of the artifact):

`Performance` · `Interview` · `Review` · `Cover` · `Studio` · `Candid` · `Press` · `Fan Submission`

`facet_type: total` — every artifact gets exactly one Kind. Kind is the "what else is here" axis, the primary reason a visitor wanders.

> **[PROPOSAL — Mike to confirm] — Kind open vs. closed.** Not written. **Recommendation: closed.** Kind is the hero discovery axis and must stay short and scannable (§2 "short, scannable lists"); an open Kind list would let the spine of the instrument drift. Adding a new Kind should be a deliberate curator decision (a spec edit), not a side-effect of new data. If a future artifact genuinely fits no existing Kind, that is a signal to consciously extend the closed list, not to auto-grow it.

---

## 3. Topic values

**Written in UX spec §2** (what the artifact is *about*):

`Songwriting` · `Recording` · `Touring` · `Family` · `Gear` · `Influences`

`facet_type: total`.

> **[PROPOSAL — Mike to confirm] — Topic open vs. closed.** Not written. **Recommendation: closed.** Same reasoning as Kind — Topic sits on the calm Basic surface and a short fixed list keeps it scannable. Topic is more likely than Kind to want occasional new entries over time (a new recurring theme in the posts), so the close-vs-open call is softer here; if Mike expects the theme set to grow organically, *open* is defensible. Defaulting to closed and extending deliberately.

---

## 4. Format values + old `type` → Format mapping

**Written in UX spec §2** (the *medium*): `Photo` · `Video` · `Audio` · `Text` · `Web`.

`facet_type: total`, `closed`. Format is required on every artifact (§9) but visually demoted in the UI (it's a refinement, not a discovery axis).

### Old `type` namespace → new Format

The legacy vocabulary (`CANONICAL_VOCABULARY.md`, and the `type` namespace in `vocabulary.json`) used a `type` field with values like *video, photo, mp3, social media, PDF, website*. In the data, `type` appears as e.g. `["audio","mp3"]` on album tracks, and the real per-artifact signal is the top-level `media_type` field (`video` / `photo` / `audio` / `link` / `other`). Mapping:

| Old `type` / `media_type` | → Format | Status |
|---|---|---|
| `video` | **Video** | clear |
| `photo` | **Photo** | clear |
| `audio`, `mp3` | **Audio** | clear |
| `website`, `link` (hosted page) | **Web** | clear |
| `text`, text-only post | **Text** | clear |
| `PDF` | **Text** *or* **Web** | **[PROPOSAL]** |
| `social media` (as a `type`/source value) | — | **[PROPOSAL]** |
| `link` (media_type, generic) | **Web** *or* **Text** | **[PROPOSAL]** |
| `other` (container cards) | — (N/A) | **[PROPOSAL]** |

> **[PROPOSAL — Mike to confirm] — PDF → Text vs Web.** **Recommendation: PDF → Text.** A PDF is a readable document; its discovery value is its text content (a press sheet, lyric sheet, liner notes). Reserve **Web** for things whose nature is "a live page you open" (an artist page, a ticketing page). Edge case: a PDF that is purely a scanned poster/flyer with no readable text behaves more like **Photo** — handle those by curator judgment, not by rule.

> **[PROPOSAL — Mike to confirm] — "social media" is not a Format.** The legacy `type` value *social media* conflates medium with origin. **Recommendation: drop it as a Format entirely.** "Social media" is a **Source/Platform** (Facebook, Instagram, TikTok), which is a separate partial facet. The Format of a social post is whatever its medium actually is: a Facebook *reel* → **Video**, an Instagram *image* → **Photo**, a text-only status → **Text**, a shared link card → **Web**. Resolve per artifact from `media_type`, never from the fact that it came off a platform.

> **[PROPOSAL — Mike to confirm] — generic `link` media_type.** Ten top-level artifacts are `media_type: link`. Of these, 5 are ReverbNation artist/song pages and 1 is a ticketing page → clearly **Web**. The remaining 4 are Facebook posts that are really text announcements/quotes carrying a URL (e.g. MV-HR-20260405-012, a lyric-quote post). **Recommendation:** `link` → **Web** as the default, but override to **Text** when the artifact's substance is the written post and the link is incidental. This is a curator judgment call per artifact, not a blind mapping.

> **[PROPOSAL — Mike to confirm] — container cards have no Format.** Ten of the 33 records are container cards (`media_type: "other"`, `card_kind` of `album` ×9 or `gallery` ×1) — e.g. the "Run With The Hunt" album card and the "Central PA, Oct 2025" gallery card. These are structural groupings, not media artifacts. **Recommendation:** container cards are **exempt** from the Kind+Format requirement (they are not leaf artifacts); Format applies to the children inside them (tracks → Audio, gallery photos → Photo). Confirm whether container cards should instead carry a synthetic Kind/Format for filter consistency. See §7.

---

## 5. Era

**Written:** UX spec §2 — *"human-readable eras, never raw years."* The §4/§5 prototype text uses `Early`, `Breakthrough` ("Break"), and `Recent` as example era chips. No full label set or year ranges are written, so the buckets below are a proposal.

`facet_type: total`, `closed`. The data already contains exactly one era slug, `rwth` (15 hits, on the Run With The Hunt album tracks), confirming an album/phase-named era model rather than calendar years.

> **[PROPOSAL — Mike to confirm] — Era buckets + ranges.** Visitor-facing labels — Mike confirms the wording. The brief asks for coverage of 2019–2025; the data actually spans **2016–2025** (`post_date`), so the proposal covers the full span and folds the pre-2019 material into the earliest bucket. Anchored on the spec's own `Early` / `Breakthrough` / `Recent` hints:
>
> | Era label (visitor-facing) | Year range | Anchor / rationale |
> |---|---|---|
> | **Early Days** | 2016–2018 | Run With The Hunt era (`rwth`), pre-solo; earliest ReverbNation pages |
> | **Finding the Sound** | 2019–2020 | Medusa's Disco era; solo project forming |
> | **Breakthrough** | 2021–2022 | solo project takes off; viral growth; first guest musicians |
> | **On the Road** | 2023–2024 | heavy touring; recording *Town Rat Heathen* / *Arkansas* |
> | **Recent** | 2025 | *Crooked Home*, current activity, Lyme-disease posts |
>
> **Defaults to apply if Mike confirms nothing else:** use these five labels with these ranges; assign each artifact's Era from its `post_date` year as a *starting hint* only — Era is curation (see §7), so a 2025-dated retrospective post about the early days may belong in *Early Days* by intent. The existing `rwth` slug maps into **Early Days**.

> **[PROPOSAL — Mike to confirm] — is Era hard-required?** Era is *total* (one value per artifact) per §3, but most top-level artifacts currently carry no era tag. **Recommendation:** treat Era as hard-required for the retag (fill all 33), since a total facet with gaps breaks the "every artifact has exactly one value" contract and leaves chips that silently drop artifacts. Confirm before the retag commits.

---

## 6. Project / Band

**Written:** UX spec §2 — *"Project / Band — Solo, side projects, collaborations."* No value list is written.

`facet_type: total`. **Only one project exists in the data today:** every artifact carries `tags.bands: ["hunter_root"]`. The `lineup` tag (`solo` / `band`) is a *sub-distinction within* a project, not the Project value itself.

> **[PROPOSAL — Mike to confirm] — Project facet shape (no invented bands).** Per the brief, do **not** invent project bands. Define the shape so it scales:
>
> - **Value source:** the `bands` tag is the Project value (today: `Hunter Root`). The facet is **open** so additional projects surface from the data as the museum grows beyond the Hunter Root exhibit, without a spec edit.
> - **`lineup` (solo/band) is *not* Project.** It is a finer attribute. **Recommendation:** keep `lineup` out of the Project facet for v1 (it is closer to a Kind/context nuance). If a "Solo vs. Full Band" filter is wanted later, model it as its own small facet rather than overloading Project.
> - **Open question — prior projects.** *Medusa's Disco* and *Run With The Hunt* currently live as `album` values, but historically they are prior bands/projects of the same artist. **Recommendation:** leave them as Albums for the Hunter Root retag (changing them touches live data and is out of scope), and flag for Mike whether, in the eventual multi-exhibit model, they should be promoted to Projects. Do not band-split the Hunter Root exhibit now.

> **[PROPOSAL — Mike to confirm] — is Project hard-required?** Total ⇒ one value. Trivially satisfied today (all 33 are `Hunter Root`), so effectively yes for this retag. Confirm the facet stays single-value per artifact.

---

## 7. Retag mapping rules (rules only — no retagging performed here)

How a `hunter_root.json` artifact *would* receive each facet value. **No artifact is retagged in this document.** Per facet, flagged as **pure curation** (a human reads the artifact and decides) vs. **derivable** (a value can be computed/seeded from existing fields).

| Facet | Derivability | Rule |
|---|---|---|
| **Kind** | **Pure curation** | Curator reads title/description and assigns one role from the closed Kind list. No field in the data encodes role today. (`tags.event`, `tags.attributes` may *hint* — e.g. `live_show` → likely *Performance* — but they are hints, not authority.) |
| **Topic** | **Pure curation** | Curator assigns the single dominant topic. `tags.attributes` may hint (e.g. `gear` → *Gear*, `songwriting` → *Songwriting*), but the choice is curatorial. |
| **Era** | **Pure curation** (post_date as hint) | Seed from `post_date` year → bucket (§5), then curator confirms/overrides. Era is an editorial grouping, so the seeded value is a starting point only. |
| **Format** | **Partially derivable** | Derive from `media_type`: `video`→Video, `photo`→Photo, `audio`→Audio (tracks), `link`→Web (curator may override to Text for text-posts, §4), `other`→container card, exempt (§4 proposal). Clear rows auto-fill; `link` and PDF rows need curator judgment. |
| **Project / Band** | **Partially derivable** | Derive from `tags.bands` (→ `Hunter Root` for all 33). `lineup` (`solo`/`band`) is captured but is *not* the Project value (§6). No curation needed today beyond confirming the single project. |
| **Source / Platform** *(partial)* | **Derivable** | From `source_platform` / `tags.source`: `facebook`, `instagram`, `tiktok`, `reverbnation`, `other`. Leave **null** for off-platform artifacts (container cards, local-capture photos) — null is meaningful and exempt (§1). |
| **Album** *(partial)* | **Derivable** | From `tags.album` where present (e.g. `medusas_disco`, `run_with_the_hunt`). Null where absent — exempt. |
| **Song** *(partial)* | **Derivable** | From `tags.song` / track `song` where present (largely null today). Null exempt. |
| **People** *(partial)* | **Derivable** | From `tags.people` (e.g. `nick_root`). Null exempt. |
| **Venue** *(partial)* | **Pure curation** | Not a clean field today; derive from description text by hand where a venue is named (e.g. "The Abbey Bar"). Null exempt. |
| **Importance** *(partial, hidden)* | **Pure curation** | Curator-only Primary/Secondary/Minor. Optional. |

**Summary of the curation/derivation split (brief §7 ask):**

- **Pure curation:** Kind, Topic, Era (post_date is only a seed), Venue, Importance.
- **Partially derivable:** Format (from `media_type`), Project (from `bands`/`lineup`), Source, Album, Song, People (from their respective `tags`).

**Container-card handling (10 of 33).** Album cards (×9) and the gallery card (×1) are `media_type: "other"`. They are structural and, per the §4 proposal, exempt from Kind+Format. Their *children* (album tracks → Format Audio; gallery photos → Format Photo) are the real artifacts and tag normally. Confirm with Mike (see §4 proposal) whether container cards need synthetic facet values for filter coherence.

---

## 8. Supersession note

This spec and `docs/CANONICAL_VOCABULARY.md` **conflict and cannot both be authoritative.**

- `CANONICAL_VOCABULARY.md` describes **Model B**: a three-tier pill system — Tier 1 ARTIST (year, album, song, venue, people), Tier 2 MEDIA (source, type), Tier 3 DEEP DIVE (dynamic catch-all). Its organizing primitives are *tiers of namespaces* and a `type` field that merges role and medium.
- This document describes **Model A** (Mike's decision): orthogonal **Kind** and **Format** facets, a **total/partial** scoping engine, and the facet set Kind/Topic/Era/Project/Format. Model A explicitly *splits* what Model B's `type` merged.

**Action (NOT performed here):** `docs/CANONICAL_VOCABULARY.md` must be marked **superseded-by `docs/discovery-metadata-spec.md`**. That edit, and any commit, are **deliberately deferred** — Mike commits host-side in a later change. This document does **not** edit `CANONICAL_VOCABULARY.md` and does **not** commit anything.

---

## 9. Out of scope (recorded so it isn't lost)

- The **185-row MediaVault** retag is a backlogged follow-on, not part of this first pass.
- **Explicit include/exclude** ("Facebook only" vs. "everything except Facebook") is the deferred power-user layer on top of scoping (UX spec §3) — not v1.
- **Threads** (named saved filter-sets, curator- or user-owned) are stored as per-facet selection state (UX spec §6/§9.5) — a UI/storage concern, not a facet, noted here for completeness.
- **Presentation** of the instrument (overlay vs. pop-over) is deferred per UX spec §10.
