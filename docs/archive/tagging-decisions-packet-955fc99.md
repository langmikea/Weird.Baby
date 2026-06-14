# Tagging Decisions Packet — Model A (facet model)

**Repo:** weird-baby-museum @ `955fc99` · **Prepared:** 2026-06-13 · **Mode:** read-only (nothing drafted, edited, or committed in the codebase)
**Decision context:** Mike has chosen **Model A** — the facet model (Kind / Topic / Era / Project / Format + total/partial scoping) from `docs/discovery-filter-ux-spec.md`. **Model B** (`docs/CANONICAL_VOCABULARY.md`, the three-tier ARTIST/MEDIA/DEEP-DIVE pill model) is treated as superseded.

This packet pulls the **exact text already in the repo** for each of the 5 open gaps, then states the open question. Where a list isn't written, it says **not written** rather than inventing values.

---

## Gap 1 — ERA: are buckets or a year→era map defined?

**What's written**

- `docs/discovery-filter-ux-spec.md` §2 defines the facet only conceptually:
  > "**Era** — human-readable eras, never raw years."
- The same spec uses *illustrative* era-like chips in mockups and examples, never as a defined set: the §5 layout shows `▢ Early` and `▢ Break`; §4 uses "(Breakthrough OR Recent)" and "(Recent AND Interview)" as interaction examples.
- `src/data/vocabulary.json` registers the namespace but with **no values**: `{"namespace":"era","display_name":"Era","tier":1,"sort_order":7,"retired_at":null}`.
- `docs/taxonomy/TAXONOMY_v1.md` explicitly leaves Era alone: "`era`/`exhibit`/`scope`/`author`/`release_type` **retained as-is or out of scope** for this targeted promotion pass."
- The only adjacent raw data is the `year` namespace in `TAXONOMY_v1.md`: "**Allowed values (live):** `2019`, `2020`, `2021`, `2022`, `2023`, `2024`, `2025`."
- `docs/DEEP_DIVE_PHASE0_AUDIT.md` notes that era-style words are **not** in the vocabulary today: words like "breakthrough," "mature" are "not in HR's locked vocab."

**No bucket list and no year→era mapping exist anywhere in the repo.** → **not written.**

**The open question**
What are the Era buckets, and what year range maps to each? The raw material is the seven years **2019–2025**. Mike needs to decide (a) the bucket names (human-readable, e.g. an "Early / Breakthrough / Recent" style set — names are unwritten), and (b) the exact year→bucket boundaries across 2019–2025. Because Era is a **total** facet (§3 — every artifact has exactly one value), every artifact must resolve to exactly one bucket, so the ranges must be exhaustive and non-overlapping.

---

## Gap 2 — PROJECT / BAND: is there an actual Project list?

**What's written (enumerated literally)**

- `docs/discovery-filter-ux-spec.md` §2 gives only category *kinds*, not a value list:
  > "**Project / Band** — Solo, side projects, collaborations."
- `src/data/wb_roster.js` is an **artist roster, not a project list** — it currently holds exactly **one** entry:
  > `id: "hr"`, `name: "Hunter Root"`, blurb "Central PA songwriter. Six albums. Aphantasic lyric cinema." (The file's own comment: "Single source of truth for the Weird.Baby Museum artist roster. Every featured artist in the museum appears here, once.")
- `docs/taxonomy/TAXONOMY_v1.md` `band` namespace: "**Allowed values (live):** `hunter_root`." (singular rename of legacy `bands`; cardinality multi).
- A *separate, different* axis exists — `lineup` — with values "`solo`, `band`" (TAXONOMY_v1 explicitly warns: the `lineup` value `band` "is a *different* axis" from the `band` identity namespace).
- In the live exhibit data (`src/data/exhibits/hunter_root.json`), the `bands` tag appears on 32 of 33 artifacts, value `hunter_root` throughout.

**A real Project/Band value list (solo project name + side-project names + collaboration names) does not exist.** → **not written.** What exists is one band slug (`hunter_root`), one artist roster entry (Hunter Root), and a solo/band `lineup` axis.

**The open question**
What are the actual Project/Band values? Mike needs to enumerate the projects — e.g. the Hunter Root solo project plus any named side projects and collaborations — and decide how this facet relates to the existing `lineup` (solo/band) axis and the `band` identity namespace, since today only `hunter_root` exists and the three concepts overlap. As a **total** facet, every artifact must map to exactly one Project value.

---

## Gap 3 — KIND + TOPIC values (spec §2/§3), and closed vs. open

**Kind — as written** (`discovery-filter-ux-spec.md` §2):
> "**Kind** — the *role* of the artifact: **Performance, Interview, Review, Cover, Studio, Candid, Press, Fan Submission.** This is the hero facet; it's the 'what else is here' axis."

**Topic — as written** (§2):
> "**Topic** — **Songwriting, Recording, Touring, Family, Gear, Influences.**"

**Closed (fixed) or open (extensible)?**
The spec **does not state** closed-vs-open for either list. §3 says only that both are **total** facets — "every artifact has exactly one value (Kind, Format, Era, Project, Topic)" — and §9 requires "Kind and Format as separate facets, both required on every artifact." Neither §2, §3, nor §9 says the value sets are frozen or extensible. (The "locked membership" vs "dynamic membership" language exists only in the superseded Model B / `CANONICAL_VOCABULARY.md`, not in the Model A spec.) → **closed/open status: not written.**

**The open question**
For each of Kind and Topic: is the list as written **closed** (curator picks only from these fixed values) or **open/extensible** (new values can be added as content arrives)? This is undecided in the spec. Note Topic in particular looks like a candidate for extension — the existing free-text `attributes` bag already carries Topic-adjacent values (`songwriting`, `gear`, `family`) that would need to map into the six written Topic values or motivate new ones.

---

## Gap 4 — FORMAT (new) vs. current MEDIA-tier `type` / `source` (old)

**New Format values — as written** (`discovery-filter-ux-spec.md` §2):
> "**Format** — the *medium*: **Photo, Video, Audio, Text, Web.** Present but visually demoted (it's a refinement, not a discovery axis)."

**Current MEDIA-tier values — as written** (`docs/CANONICAL_VOCABULARY.md`, Tier 2 — MEDIA, "locked membership"):
> "**source** — typically the URL owner or contributor (FB, YT, website owner, etc.)"
> "**type** — video, photo, mp3, social media, PDF, website, etc."

Note both old lists are given with "etc." — they are **examples, not a closed enumeration**. (For reference, the live-data refinements in `TAXONOMY_v1.md` narrow `type` to `mp3, video, music_video, poster` and `source` to `youtube, reverbnation, facebook, instagram, distrokid, tiktok, local, other`. In the exhibit JSON the `media_type` field carries `video, link, photo, other`.)

**Candidate old `type` → new `Format` mapping**

| Old `type` value (CANONICAL_VOCABULARY) | → New `Format` | Status |
|---|---|---|
| `video` | Video | **CLEAR** |
| `photo` | Photo | **CLEAR** |
| `mp3` | Audio | **CLEAR** |
| `website` | Web | **CLEAR** |
| `PDF` | Text *(or Web?)* | **NEEDS-MIKE** — PDF is a document; Text is the likely medium, but it could be argued as Web. |
| `social media` | *(ambiguous)* | **NEEDS-MIKE** — "social media" describes a *platform/source*, not a *medium*. In Model A that axis belongs to **Source/Platform** (a partial facet), and the artifact's Format would be the underlying Photo/Video/Text/Web. Needs an explicit re-route, not a row-to-row map. |

**`source` mapping:** in Model A, the old MEDIA-tier `source` does **not** map to Format at all — it corresponds to the **Source / Platform** *partial* facet (§2 Detail Filtering: "Facebook, Instagram, YouTube, TikTok, Reddit, Official Site, Archive.org, Fan Submission"). Flagging so the supersession doesn't accidentally fold `source` into Format. → **NEEDS-MIKE** to confirm `source` migrates to the partial Source/Platform facet rather than Format.

**The open question**
Confirm the four CLEAR rows, and decide the two NEEDS-MIKE cases: (1) does `PDF` become **Text** or **Web**; (2) how is the old `social media` `type` value decomposed into Model A's separate **Format** (medium) + **Source/Platform** (partial facet)? Also confirm `source` → Source/Platform (partial), not Format.

---

## Gap 5 — RETAG SCOPE: how many artifacts, and what do they carry vs. Model A?

**Where the artifacts live (two populations):**

1. **Repo exhibit data file:** `src/data/exhibits/hunter_root.json` — **33 artifacts** (metadata: filter "released, not archived, badged for this exhibit"; exported 2026-06-12).
2. **Live MediaVault DB** (read-only, not in repo): **185 artifacts** total per `docs/taxonomy/RETAG_PLAN.md` ("For each of the **185** artifacts…"; status breakdown "97 released, 81 vault, 6 inbox, 1 archived"). The 33-artifact JSON is the released/badged subset exported for the Hunter Root exhibit.

**What the 33 exhibit artifacts currently carry** (tag namespaces present, count out of 33):
`exhibit` 33 · `bands` 32 (all `hunter_root`) · `attributes` 22 (free-text bag: `new_music`, `notable`, `gear`, `family`, …) · `album` 14 · `lineup` 10 (solo/band) · `card_kind` 10 (`album`/`gallery`) · `content_kind` 10 (all `other`) · `event` 8 · `source` 7 · `presentation` 1 · `people` 1. Plus non-tag fields: `media_type` on all 33 (`video`/`link`/`photo`/`other`), `source_platform` on 23.

**The curation gap, quantified — against Model A's five required total facets:**

| Model A total facet (required, one per artifact) | Artifacts (of 33) that carry it today |
|---|---|
| **Kind** | **0** |
| **Topic** | **0** |
| **Era** | **0** |
| **Project / Band** | **0** as a `project` tag (note: 32 carry a legacy `bands:hunter_root`) |
| **Format** | **0** as a `format` tag (note: `media_type` field on all 33 is mappable — see Gap 4) |

So: **33 artifacts in the repo exhibit file (185 in the live DB); 0 carry Kind, Topic, or Era; 0 carry a Model-A `project` or `format` tag.** Every artifact needs all five total facets assigned. The nearest reusable signal is the `media_type` field (→ Format, per Gap 4 mapping) and `bands`/`lineup` (→ Project, pending Gap 2). Kind, Topic, and Era have **no source data at all** and must be curated from scratch.

**The open question**
This is a from-scratch curation of Kind, Topic, and Era across the full population (33 in-exhibit, 185 total), plus a decision on whether to derive Format from `media_type` and Project from `bands`/`lineup` automatically or curate them by hand. Scope and sequencing (33-artifact exhibit first vs. all 185) is Mike's call.

---

## Supersession status of `CANONICAL_VOCABULARY.md` (to handle correctly)

The document still asserts top authority over tag vocabulary — these are its exact status/authority lines:

- Header (line 3):
  > "**Status:** Authoritative. Read this before any work that touches museum tag vocabulary, pill columns, or artifact categorization."
- "Authority" section (lines 66–67):
  > "This document is canon. All other vocabulary descriptions in the repo are either implementation detail or historical record, not authority."
  > "The `docs/deep-dive-review/` spec arc describes architecture, not vocabulary. Where any spec mentions specific tag categories, **this document supersedes.**"

**Conflict to resolve:** Mike's decision makes Model A authoritative, but `CANONICAL_VOCABULARY.md` still self-declares as canon and claims to **supersede** any spec that mentions tag categories — which would include `discovery-filter-ux-spec.md`. Until its status line is changed, the repo asserts the *opposite* of the chosen direction. The supersession should be handled explicitly (e.g. updating this status block / adding a superseded-by pointer) so the two documents don't contradict each other. *(Flagged only — nothing edited.)*

---

### Sources (repo files read, read-only)
- `docs/discovery-filter-ux-spec.md` §2, §3, §4, §5, §9
- `docs/CANONICAL_VOCABULARY.md` (Status line 3; Tier 2 MEDIA; Authority lines 66–67)
- `src/data/wb_roster.js`
- `src/data/vocabulary.json`
- `docs/taxonomy/TAXONOMY_v1.md`, `docs/taxonomy/RETAG_PLAN.md`
- `src/data/exhibits/hunter_root.json` (33 artifacts; tag/field census)
- `docs/DEEP_DIVE_PHASE0_AUDIT.md` (era-word note)
