# Discovery Metadata Spec — The Model-A Data Model

**Status:** v0.2.1 — data model for the Discovery filter instrument. All v0.1 `[PROPOSAL — Mike to confirm]` items resolved to decisions; v0.2.1 adds the `release`/"Music" Kind value for catalog/landing pages and clarifies that Era is leaves-only (containers exempt). Pairs with `discovery-filter-ux-spec.md` (the UX side); this is the metadata side.
**Owner:** Mike (curation/confirmation) · Claude (drafting/build support)
**Companion doc:** `discovery-filter-ux-spec.md` — values and rules here are pulled from its §2 (facet model), §3 (total/partial engine), and §9 (metadata hand-off).
**Decision of record:** Mike chose **Model A** (Kind / Topic / Era / Project / Format facets + total/partial scoping). This document is the authoritative expression of Model A.
**First retag scope:** the **33 artifacts in `src/data/exhibits/hunter_root.json`**. The 185-row MediaVault retag is a backlogged follow-on, out of scope here.

> **v0.2 change note.** v0.1 carried eleven `[PROPOSAL — Mike to confirm]` markers. All are now resolved (Mike, this session) and written as locked values below. The only items still marked provisional are two Era *label strings* (display wording, repaintable later); their structure is locked. No `[PROPOSAL]` markers remain.

---

## 1. Facet schema

Every facet carries two engine-facing properties, both required by the filter engine (UX spec §3):

- **`facet_type: total | partial`** — *total* means every artifact has exactly one value; selecting a value **filters** (results must match). *partial* means only some artifacts have a value; selecting a value **scopes** (it narrows the population that has a value and leaves artifacts with no value **untouched**).
- **`open | closed`** — *closed* = the value list is a fixed curator-controlled vocabulary; *open* = new values may appear from the data without a spec change.

**The two required tags.** Per UX spec §9.2, **Kind and Format are both required on every artifact.** They are deliberately separate facets (§2): Kind is the *role* (the discovery axis), Format is the *medium* (a refinement). Keeping them orthogonal is what makes "all interviews regardless of medium" and "all video regardless of role" both work, at the cost of two mandatory tags per artifact.

**Partial-facet null semantics.** For a partial facet, an artifact with **no value is exempt** from any selection in that facet — never rejected by it (§3 rule). Null is **meaningful**, not a curation gap: a studio photo legitimately has no Source/Platform; an interview legitimately has no Venue. Only artifacts that *have* a value are narrowed by a selection. (This is the bug-prevention engine from §3 — naive AND on a partial facet silently amputated the collection from 33 to 3 in the prototype.)

### Schema table

| Facet | Tier (UX) | `facet_type` | `open/closed` | Required? | Single/multi | Value source |
|---|---|---|---|---|---|---|
| **Kind** | Basic (hero) | total | **closed** | **Yes** (§9) | single | curation |
| **Topic** | Basic | total | **closed** | **Yes** | **single** | curation |
| **Era** | Basic | total | closed | **Yes** (all 33) | single | curation (post_date as hint) |
| **Project / Band** | Basic | total | **open** | **Yes** | **single** | derivable from `bands` + `lineup` |
| **Format** | Basic (demoted) | total | closed | **Yes** (§9) | single | derivable from `media_type` |
| **Album** | Detail | partial | open | no (null ok) | multi | `tags.album` |
| **Song** | Detail | partial | open | no (null ok) | multi | `tags.song` |
| **Venue** | Detail | partial | open | no (null ok) | multi | curation / description |
| **Source / Platform** | Detail | partial | closed | no (null ok) | multi | `source_platform` / `tags.source` |
| **People** | Detail | partial | open | no (null ok) | multi | `tags.people` |
| **Importance** | Detail (hidden) | partial | closed | no (curator field) | single | curation |

Notes on the table:

- **Total facets** are the five Basic-surface facets (Kind, Topic, Era, Project, Format) — exactly as §3 enumerates ("every artifact has exactly one value (Kind, Format, Era, Project, Topic)").
- **Partial facets** are the Detail-tier facets (Source, Venue, People, Album, Song) — exactly as §3 enumerates.
- **Importance** (Primary / Secondary / Minor) stays the hidden curator field from the original spec; optionally surfaced in Detail Filtering (§9.4). Treated as partial because it is optional.
- **Single-value totals are a deliberate rule.** Kind, Topic, Era, Project, and Format each carry exactly one value per artifact. This was an open question for Topic and Project in v0.1; both are now confirmed single-value (Mike, this session). Single-value keeps every total facet on the calm Basic surface scannable and keeps the chip math clean (OR within facet, AND across facets).

### Resolved — single-value Topic

§3 lists Topic as a *total* facet, which by §3's own definition means exactly one Topic value per artifact. A single post can plausibly touch two themes (e.g. MV-HR-20260405-013, the tribute to Nick Root, touches Family and arguably Influences). **Decision: Topic is single-value for v1.** The curator picks the single dominant topic during curation. Multi-value Topic is revisited only if the single-value rule forces too many bad calls in practice — it is not a v1 toggle.

---

## 2. Kind values (the hero facet)

**Written in UX spec §2** (the *role* of the artifact), plus `Music` added in v0.2.1 (see below):

`Performance` · `Interview` · `Review` · `Cover` · `Studio` · `Candid` · `Press` · `Fan Submission` · `Music`

`facet_type: total`, **`closed`** — every artifact gets exactly one Kind. Kind is the "what else is here" axis, the primary reason a visitor wanders.

**`Music` (slug `release`) — added v0.2.1, for catalog/landing pages.** The eight UX-spec Kind values describe *posts and events* (a performance, an interview, a candid moment). They do not fit an artifact whose nature is "a release's home on a platform" — an archived ReverbNation artist/song page, and, prospectively, a Spotify or Bandcamp release. These are catalog entries, not events. **`Music` is the Kind for catalog/landing pages across all platforms** (ReverbNation today; Spotify/Bandcamp when added). The slug `release` and display label "Music" deliberately mirror the shipped MediaVault Kind field (`kind-governance-spec.md`, where `release` displays as "Music"), so the Discovery and storage vocabularies share this value rather than diverging on it. Decided this session (Mike) when the five ReverbNation pages had no honest fit among the eight original values.

**Resolved — Kind is closed.** Kind is the hero discovery axis and must stay short and scannable (§2 "short, scannable lists"); an open Kind list would let the spine of the instrument drift. Adding a new Kind is a deliberate curator decision (a spec edit), not a side-effect of new data. If a future artifact genuinely fits no existing Kind, that is a signal to consciously extend the closed list, not to auto-grow it.

> **Note — relation to the shipped MediaVault Kind field.** A `kind` governance field already shipped in MediaVault (single-select, CHECK-constrained, 146 leaves backfilled; see `kind-governance-spec.md`). That field's slug set (`performance, release, announcement, studio, candid, interview, fan`) is the *MediaVault storage* vocabulary. The Discovery **Kind facet** here is the *visitor-facing* role axis and uses the UX-spec value set above. The two overlap but are not identical (e.g. MV `release` ≈ discovery material around a Music release; MV has no `Review`/`Cover`/`Press`). Mapping MV `kind` → Discovery Kind is a retag-time concern (§7), not a schema conflict. Flagged so a later session does not assume the two vocabularies are one.

---

## 3. Topic values

**Written in UX spec §2** (what the artifact is *about*):

`Songwriting` · `Recording` · `Touring` · `Family` · `Gear` · `Influences`

`facet_type: total`, **`closed`**, single-value (§1).

**Resolved — Topic is closed.** Same reasoning as Kind — Topic sits on the calm Basic surface and a short fixed list keeps it scannable. Topic is somewhat likelier than Kind to grow a genuinely new recurring theme over time; if that happens it is added deliberately as a spec edit, not auto-grown from data.

---

## 4. Format values + old `type` → Format mapping

**Written in UX spec §2** (the *medium*): `Photo` · `Video` · `Audio` · `Text` · `Web`.

`facet_type: total`, `closed`. Format is required on every artifact (§9) but visually demoted in the UI (it's a refinement, not a discovery axis).

### Old `type` namespace → new Format

The legacy vocabulary (`CANONICAL_VOCABULARY.md`, and the `type` namespace in `vocabulary.json`) used a `type` field with values like *video, photo, mp3, social media, PDF, website*. In the data, `type` appears as e.g. `["audio","mp3"]` on album tracks, and the real per-artifact signal is the top-level `media_type` field (`video` / `photo` / `audio` / `link` / `other`). Mapping (all rows now resolved):

| Old `type` / `media_type` | → Format | Status |
|---|---|---|
| `video` | **Video** | clear |
| `photo` | **Photo** | clear |
| `audio`, `mp3` | **Audio** | clear |
| `website`, `link` (hosted page) | **Web** | clear |
| `text`, text-only post | **Text** | clear |
| `PDF` | **Text** (Photo by judgment if text-less scan) | **resolved** |
| `social media` (as a `type`/source value) | — (not a Format; it is a Source) | **resolved** |
| `link` (media_type, generic) | **Web** default; **Text** when the post is the substance | **resolved** |
| `other` (container cards) | — (exempt; not a leaf artifact) | **resolved** |

**Resolved — PDF → Text.** A PDF's discovery value is its readable content (a press sheet, lyric sheet, liner notes), which behaves like **Text**. Reserve **Web** for things whose nature is "a live page you open" (an artist page, a ticketing page). Edge case: a PDF that is purely a scanned poster/flyer with no readable text behaves more like **Photo** — handled by curator judgment per artifact, not by the blanket rule.

**Resolved — "social media" is not a Format.** The legacy `type` value *social media* conflates medium with origin and is **dropped from Format entirely.** "Social media" is a **Source/Platform** (Facebook, Instagram, TikTok), a separate partial facet. The Format of a social post is whatever its medium actually is: a Facebook *reel* → **Video**, an Instagram *image* → **Photo**, a text-only status → **Text**, a shared link card → **Web**. Resolve per artifact from `media_type`, never from the fact that it came off a platform.

**Resolved — generic `link` media_type.** Ten top-level artifacts are `media_type: link`. Of these, 5 are ReverbNation artist/song pages and 1 is a ticketing page → clearly **Web**. The remaining 4 are Facebook posts that are really text announcements/quotes carrying a URL (e.g. MV-HR-20260405-012, a lyric-quote post) → **Text**. **Rule:** `link` → **Web** by default, override to **Text** when the artifact's substance is the written post and the link is incidental. Curator judgment per artifact, not a blind mapping.

**Resolved — container cards have no Format.** Ten of the 33 records are container cards (`media_type: "other"`, `card_kind` of `album` ×9 or `gallery` ×1) — e.g. the "Run With The Hunt" album card and the "Central PA, Oct 2025" gallery card. These are structural groupings, not media artifacts. **Container cards are exempt** from the Kind+Format requirement (they are not leaf artifacts); Format applies to the children inside them (tracks → Audio, gallery photos → Photo). This mirrors the shipped Kind work, where 69 containers were exempted at every layer and leaves carried the value — same principle, same precedent.

---

## 5. Era

**Written:** UX spec §2 — *"human-readable eras, never raw years."* The §4/§5 prototype text uses `Early`, `Breakthrough` ("Break"), and `Recent` as example era chips. The buckets below are the resolved set.

`facet_type: total`, `closed`, **hard-required on all 33** (§ below). The data already contains exactly one era slug, `rwth` (15 hits, on the Run With The Hunt album tracks), confirming an album/phase-named era model rather than calendar years. The post_date span in the data is **2016–2025** (years present: 2016, 2018–2025; 2017 has no posts).

### Resolved — Era buckets + ranges

Structure **locked** (Mike, this session): five contiguous buckets spanning 2016–2025, post_date seeds each artifact's Era, per-artifact override by curatorial intent, `rwth` slug maps into the earliest bucket. **Label provenance is marked** — two labels are sourced from terms already in the repo; two are author-interpretive default text (display strings, repaintable in the live mock session with zero retag impact); one is a neutral time-word.

| Era label (visitor-facing) | Year range | Provenance | Anchor / rationale |
|---|---|---|---|
| **Early Days** | 2016–2018 | sourced | Run With The Hunt era (`rwth`), pre-solo; earliest ReverbNation pages |
| **Finding the Sound** | 2019–2020 | sourced | Medusa's Disco era (name present in data); solo project forming |
| **Breakthrough** | 2021–2022 | author-interpretive | solo project takes off; viral growth; first guest musicians (no repo term for these years — provisional label) |
| **On the Road** | 2023–2024 | author-interpretive | heavy touring; recording *Town Rat Heathen* / *Arkansas* (album names real; bucket label interpretive — provisional) |
| **Recent** | 2025 | neutral | *Crooked Home*, current activity, Lyme-disease posts |

**Defaults applied:** these five labels with these ranges; each artifact's Era seeded from its `post_date` year as a *starting hint* only — Era is curation (§7), so a 2025-dated retrospective about the early days may belong in *Early Days* by intent. The `rwth` slug maps into **Early Days**. The two *author-interpretive* labels ("Breakthrough," "On the Road") are carried as v0.2 default text and remain repaintable; their structure (range, anchor) is locked.

### Resolved — Era is hard-required (on leaves)

Era is *total* (one value per artifact) per §3, but most leaf artifacts currently carry no era tag. **Era is hard-required for the retag on every leaf:** a total facet with gaps breaks the "every artifact has exactly one value" contract and leaves chips that silently drop artifacts. **Clarified v0.2.1 — Era is leaves-only.** Container cards are exempt from Era exactly as they are exempt from Kind+Format (§4): containers are structural groupings, not era-filterable artifacts, and have no `post_date` to seed from. So "all artifacts get an Era" means **all leaves** — in the first retag scope, the 23 leaves of `hunter_root.json` (22 after dropping one malformed duplicate, see §7). The 10 album/gallery containers carry no Era. This matches the shipped Kind precedent (containers exempt at every layer).

---

## 6. Project / Band

**Written:** UX spec §2 — *"Project / Band — Solo, side projects, collaborations."* No value list is written.

`facet_type: total`, **`open`**, **single-value**, **hard-required**. **Only one project exists in the data today:** every artifact carries `tags.bands: ["hunter_root"]`. The `lineup` tag (`solo` / `band`) is a *sub-distinction within* a project, not the Project value itself.

### Resolved — Project facet shape (no invented bands)

Per the brief, project bands are **not** invented. The shape, locked:

- **Value source:** the `bands` tag is the Project value (today: `Hunter Root`). The facet is **open** so additional projects surface from the data as the museum grows beyond the Hunter Root exhibit, without a spec edit.
- **`lineup` (solo/band) is *not* Project.** It is a finer attribute, kept out of the Project facet for v1 (it is closer to a Kind/context nuance). If a "Solo vs. Full Band" filter is wanted later, model it as its own small facet rather than overloading Project.
- **Prior projects.** *Medusa's Disco* and *Run With The Hunt* currently live as `album` values, but historically they are prior bands/projects of the same artist. They **stay as Albums** for the Hunter Root retag (changing them touches live data and is out of scope). Flagged for the eventual multi-exhibit model: whether they should be promoted to Projects is a later call. The Hunter Root exhibit is **not** band-split now.

### Resolved — Project is single-value and hard-required

Total ⇒ one value. Single-value per artifact is confirmed (Mike, this session). Hard-required is trivially satisfied today (all 33 are `Hunter Root`), so it costs zero retag effort and guards against a future artifact slipping in with a blank Project and silently dropping out of the facet.

---

## 7. Retag mapping rules (rules only — no retagging performed here)

How a `hunter_root.json` artifact *would* receive each facet value. **No artifact is retagged in this document.** Per facet, flagged as **pure curation** (a human reads the artifact and decides) vs. **derivable** (a value can be computed/seeded from existing fields).

| Facet | Derivability | Rule |
|---|---|---|
| **Kind** | **Pure curation** | Curator reads title/description and assigns one role from the closed Kind list. No field in the data encodes role today. (`tags.event`, `tags.attributes` may *hint* — e.g. `live_show` → likely *Performance* — but they are hints, not authority.) The shipped MV `kind` field may seed a suggestion where present, but the Discovery value set differs (§2 note) — curator confirms. |
| **Topic** | **Pure curation** | Curator assigns the single dominant topic. `tags.attributes` may hint (e.g. `gear` → *Gear*, `songwriting` → *Songwriting*), but the choice is curatorial. |
| **Era** | **Pure curation** (post_date as hint) | Seed from `post_date` year → bucket (§5), then curator confirms/overrides. Era is an editorial grouping, so the seeded value is a starting point only. Hard-required: all 33 filled. |
| **Format** | **Partially derivable** | Derive from `media_type`: `video`→Video, `photo`→Photo, `audio`→Audio (tracks), `link`→Web (curator may override to Text for text-posts, §4), `other`→container card, exempt (§4). Clear rows auto-fill; `link` and PDF rows need curator judgment. |
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

**Container-card handling (10 of 33).** Album cards (×9) and the gallery card (×1) are `media_type: "other"`. They are structural and exempt from Kind+Format (§4). Their *children* (album tracks → Format Audio; gallery photos → Format Photo) are the real artifacts and tag normally. Container cards carry **no** synthetic facet values — consistent with the shipped Kind work (containers exempt at every layer).

---

## 8. Supersession note

This spec and `docs/CANONICAL_VOCABULARY.md` **conflict and cannot both be authoritative.**

- `CANONICAL_VOCABULARY.md` describes **Model B**: a three-tier pill system — Tier 1 ARTIST (year, album, song, venue, people), Tier 2 MEDIA (source, type), Tier 3 DEEP DIVE (dynamic catch-all). Its organizing primitives are *tiers of namespaces* and a `type` field that merges role and medium.
- This document describes **Model A** (Mike's decision): orthogonal **Kind** and **Format** facets, a **total/partial** scoping engine, and the facet set Kind/Topic/Era/Project/Format. Model A explicitly *splits* what Model B's `type` merged.

**Action (NOT performed here):** `docs/CANONICAL_VOCABULARY.md` is superseded and should be marked so. Note for the session-close housekeeping pass: **three** documents now gesture at superseding `CANONICAL_VOCABULARY.md` with different authorities — this spec (Model A), `kind-governance-spec.md` (the shipped Kind field, commit `e9605c7`), and `SPEC_DRAFT_v5_2.md` (vocabulary). The demotion pointer in `CANONICAL_VOCABULARY.md` should name **one** authority to avoid orienting a future session to the wrong head. That reconciliation, and any commit, are **deliberately deferred** — Mike commits host-side. This document does **not** edit `CANONICAL_VOCABULARY.md` and does **not** commit anything.

---

## 9. Out of scope (recorded so it isn't lost)

- The **185-row MediaVault** retag is a backlogged follow-on, not part of this first pass.
- **Explicit include/exclude** ("Facebook only" vs. "everything except Facebook") is the deferred power-user layer on top of scoping (UX spec §3) — not v1.
- **Threads** (named saved filter-sets, curator- or user-owned) are stored as per-facet selection state (UX spec §6/§9.5) — a UI/storage concern, not a facet, noted here for completeness.
- **Presentation** of the instrument (overlay vs. pop-over — i.e. the TABS-OUT → P&F POPOVERS direction) is deferred per UX spec §10 and is Mike's launch-timing call.

---

## 10. Decision log (v0.1 → v0.2)

All eleven v0.1 `[PROPOSAL — Mike to confirm]` items, resolved this session:

1. **Topic single vs multi** → single-value (v1).
2. **Kind open vs closed** → closed.
3. **Topic open vs closed** → closed.
4. **Project single-value** → single-value.
5. **Era hard-required** → yes, all 33 filled.
6. **Project hard-required** → yes (trivially met today).
7. **PDF → Text vs Web** → Text (Photo by judgment for text-less scans).
8. **"social media" as Format** → dropped; it is a Source, not a Format.
9. **Generic `link` → Web vs Text** → Web default, Text override when the post is the substance.
10. **Container cards Kind/Format** → exempt; children tag normally; no synthetic values.
11. **Era buckets + ranges** → five contiguous buckets 2016–2025, structure locked; two labels (Breakthrough, On the Road) provisional display text, repaintable.

**v0.2.1 additions (this session):**

12. **`Music` (slug `release`) added to the Kind list** → catalog/landing pages (ReverbNation now, Spotify/Bandcamp later) take Kind = Music; mirrors the shipped MediaVault `release`→"Music" field. Kind list grows from 8 to 9 values, still closed.
13. **Era is leaves-only** → containers exempt from Era (as they are from Kind+Format); "all artifacts" = all leaves. First-scope retag: 22 leaves (one malformed duplicate, `MV-20260419-002`, dropped as a data-hygiene item).
