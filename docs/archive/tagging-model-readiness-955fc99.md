# Tagging-Model Readiness Assessment — @ 955fc99

**Mode:** READ-ONLY. Nothing edited, deployed, or pushed. This report is the only file written.
**Question:** Can the discovery metadata/tagging model be drafted into a spec *from what's already written*, or is real content missing that must come from Mike?
**Sources read host-direct (Read tool, not FUSE/sandbox):**
- `docs/discovery-filter-ux-spec.md` (168 lines, full)
- `docs/CANONICAL_VOCABULARY.md` (97 lines, full)
- `docs/deep-dive-review/SPEC_DRAFT_v5_2.md` (123 lines, full)

---

## VERDICT (one line)

**NEEDS-INPUT.** The model is *not* fully derivable from the written sources. Two incompatible tag models exist in the repo (the discovery-spec facet model vs. the authoritative canonical three-tier model), the repo itself logs them as un-reconciled, and several enumerations plus the entire old→new retag mapping are missing and require Mike's curation decisions.

---

## 1. discovery-filter-ux-spec.md §9 — exact content

§9 ("Metadata implications — hand-off to the data model") is **requirements-only, not a data-model definition.** It is a five-item checklist of what "the Discovery metadata spec must add/confirm," explicitly framed as a hand-off to a *different* document. Verbatim substance:

1. `facet_type: total | partial` on every facet — "the engine depends on it (§3)."
2. Kind and Format as **separate** facets, **both required** on every artifact (§2).
3. Partial facets may legitimately have **null** for many artifacts — null is *meaningful* (off-platform, not-a-performance), not a curation gap.
4. **Importance** (Primary/Secondary/Minor) remains the hidden curator field, optionally surfaced in Detail Filtering.
5. Threads stored as named saved filter-sets (selection state per facet), curator- or user-owned.

§9 itself enumerates no values. The actual facet *values* live in **§2** and the total/partial *assignments* in **§3**:

- **§3 facet_type assignments:** TOTAL = Kind, Format, Era, Project, Topic (every artifact has exactly one value; selecting filters, AND across / OR within). PARTIAL = Source, Venue, People, Album, Song (only some artifacts have a value; selecting *scopes* — null artifacts are exempt, never rejected).
- **§2 Kind/Format split:** deliberately orthogonal; "every artifact needs both tags."

So: §9 is a pointer to a metadata spec that **does not yet exist**. The model it gestures at is partly enumerated in §2/§3 and partly not (see gap analysis).

## 2. CANONICAL_VOCABULARY.md — the CURRENT model

This document is marked **"Authoritative / canon,"** locked in the 2026-05-11 recovery session, and explicitly states it **supersedes** any spec (incl. the deep-dive-review arc) where they disagree. The current artifact tagging scheme is a **three-tier, namespace-driven** model — *not* the discovery-spec facet model:

- **Tier 1 — ARTIST (locked):** `year`, `album`, `song`, `venue`, `people`
- **Tier 2 — MEDIA (locked):** `source`, `type` (type values exemplified as: video, photo, mp3, social media, PDF, website)
- **Tier 3 — DEEP DIVE (dynamic):** catch-all. Any tag namespace not in Tier 1/2 becomes a Tier-3 group automatically (e.g. `mood`, `motif`). Ordered by hit count, label "Deep Signals." Operator adds/renames via display-name lookup, no code change.
- **`exhibit`** is a routing tag, stripped before pill columns are computed; never a visitor pill.
- Pill columns derive from the **namespaces present in `artifacts.tags`**. MV's own `tags` categories (`bands`, `content_kind`, `topic`, `platform`, `scope`, `author`, `provenance`, …) are MV-internal and route to **dynamic Tier 3** under tag equality — they are *not* pre-assigned to Tier 1/2.
- Legacy `deep-dive-vocabulary.csv` (`mood`/`motif`/`theme`/`texture`) is explicitly **non-canonical**.

**Key consequence:** the current model has **no `Kind` facet, no `Topic` facet, no `Era` facet, no `Project` facet, and no `facet_type` field at all.** It has raw `year` (the discovery spec bans raw years in favor of human-readable Era). `type` (current) and `Format` (discovery) overlap but use different value sets. In other words, the discovery spec's *hero axes* do not exist in today's data.

## 3. SPEC_DRAFT_v5_2.md §7 deferred note — added detail

§7 adds one decisive fact: the divergence above is **known and explicitly logged as unresolved.** Verbatim (logged 2026-06-13, i.e. today):

> **Deferred — discovery data-model reconciliation (logged 2026-06-13)**
> Before any discovery data-model work, reconcile `discovery-filter-ux-spec.md` §9: `facet_type: total|partial` on every facet; split Kind from Format into two required tags.

No additional model detail is supplied — it is a deferral marker, not content. It confirms reconciliation is a prerequisite and has not happened.

---

## 4. Gap analysis — what a complete tagging spec needs

| # | Required for a complete spec | Status | Source / what's missing |
|---|---|---|---|
| A | `facet_type` field concept (total\|partial) | **ALREADY-WRITTEN** | discovery §3, §9.1 |
| B | total/partial assignment per facet | **ALREADY-WRITTEN** | discovery §3 (total: Kind, Format, Era, Project, Topic; partial: Source, Venue, People, Album, Song) — *but only for the discovery facet set, which canon does not use* |
| C | Kind = separate required facet | **ALREADY-WRITTEN** | discovery §2, §9.2 |
| D | Every **Kind** value | **PARTIAL / NEEDS-INPUT** | §2 lists 8 (Performance, Interview, Review, Cover, Studio, Candid, Press, Fan Submission) but does not state the list is *closed*; and Kind does not exist in current data |
| E | Every **Format** value | **PARTIAL / NEEDS-INPUT** | §2 lists 5 (Photo, Video, Audio, Text, Web); conflicts with current `type` values (video, photo, mp3, social media, PDF, website) — reconciliation undefined |
| F | Every **Topic** value | **PARTIAL / NEEDS-INPUT** | §2 lists 6 (Songwriting, Recording, Touring, Family, Gear, Influences); openness unstated; no Topic data exists today |
| G | Every **Era** value + year→era mapping | **MISSING** | §2 says "human-readable eras, never raw years" but enumerates none; current model stores raw `year`. Bucket definitions and the year→era map must be authored |
| H | Every **Project/Band** value | **MISSING** | §2 gives only categories ("Solo, side projects, collaborations"); actual project/band names not enumerated |
| I | **Source/Platform** values | **ALREADY-WRITTEN** | §2 (Facebook, Instagram, YouTube, TikTok, Reddit, Official Site, Archive.org, Fan Submission) |
| J | **Importance** values | **ALREADY-WRITTEN** | §2/§9.4 (Primary/Secondary/Minor) |
| K | Threads storage shape | **ALREADY-WRITTEN** | discovery §6, §9.5 (named saved filter-set = selection state per facet) |
| L | **Retag mapping old→new** (current canonical tags → discovery facets) | **MISSING (the big hole)** | No mapping anywhere. Current data has no Kind/Topic/Era/Project; populating them is per-artifact curation, not derivable from text. `type`→`Format` and `year`→`Era` mappings also unwritten |
| M | **Which model is authoritative** (canon three-tier vs. discovery facet) | **MISSING — blocking** | The two models are structurally incompatible; canon says it supersedes specs; §7 logs the reconciliation as *not done*. Cannot be resolved from text — it's Mike's call |

---

## 5. Why this is NEEDS-INPUT (the specific decisions only Mike can make)

1. **Model reconciliation (blocking).** Adopt the discovery facet model, keep the canonical three-tier model, or define a hybrid? They cannot both stand — canon explicitly outranks specs, yet the discovery UX is "locked." Everything below depends on this.
2. **Era buckets + year→era mapping.** The named eras and which years fall in each.
3. **Project/Band enumeration.** The actual list of projects/bands (only categories are written).
4. **Closed-vs-open + final membership for Kind and Topic.** Are the §2 lists exhaustive, and are these the final values?
5. **Format ↔ current `type` reconciliation.** Map Photo/Video/Audio/Text/Web against existing video/photo/mp3/social media/PDF/website.
6. **Old→new retag rules.** How every existing artifact acquires Kind/Topic/Era/Project values it does not currently carry — inherently a curation policy from Mike, not a derivation.

**What *is* spec-ready right now (could be drafted today):** the `facet_type` mechanism and scoping engine (§3), the Kind/Format-orthogonality requirement (§2), the partial-facet null semantics, Source/Platform values, Importance values, and the Threads storage model. These are fully written. They are necessary but not sufficient — without items 1–6 above, a complete, buildable tagging spec cannot be drafted from the written sources alone.

---

*Report generated read-only @ 955fc99. No repo files were modified, staged, or pushed.*
