# Facet Model — Content vs. Spec Comparison

**Exhibit:** `hunter_root` · **Source:** `src/data/exhibits/hunter_root.json` · **Commit:** `955fc99`
**Read-only analysis.** Nothing retagged, edited, or committed. Counts confirmed host-direct against the full 189 KB file (no FUSE truncation).
**Frame:** Model A (facet architecture) is settled. This report does **not** reopen facets-vs-tiers. The open question is whether the spec's *specific facets and values* fit this content. Method: build the content model bottom-up with the spec set aside (View 1), lay out the spec's proposed model (View 2), then compare.

---

## Corpus shape (the thing both models have to describe)

33 records = **23 dated content artifacts** + **10 container cards** (1 gallery card + 9 album cards). The cards carry `card_kind` and `content_kind:other`; the 9 album cards are undated shells (no `post_date`, no platform). All facet counts below are over the **23 content artifacts** unless noted, because the cards are navigation containers, not things a visitor filters *for*.

| Slice | Count |
|---|---|
| Content artifacts (dated, 2016-06-30 → 2025-11-02) | 23 |
| Container cards (gallery ×1 + album ×9) | 10 |
| Platforms on content | Facebook 16 · ReverbNation 5 · Instagram 1 · other 1 |
| Media types on content | video 10 · link 10 · photo 3 |

The single most important fact about this corpus: **it is an artist's own social-media + archived-release-page feed.** It is not a press archive. That one fact drives almost every disagreement with the spec below.

---

## View 1 — Content-derived model (spec set aside)

Reading all 23 artifacts cold and asking "what would a visitor naturally slice this by," five axes fall out of the material. For each I list only values the data actually supports, with IDs and counts.

### V1-A · Identity / Era (the strongest axis)
The content clusters hard around musical identity, and identity *is* the timeline here. Every album-tagged artifact and every archived page announces which project it belongs to.

| Value | Count | Artifact IDs |
|---|---|---|
| Run With The Hunt (RWTH) | 2 | `MV-HR-20260416-009`, `MV-HR-20260416-011` (both 2016, ReverbNation) |
| Medusa's Disco | 2 | `MV-HR-20260416-003`, `MV-HR-20260416-005` (both 2020, ReverbNation) |
| Solo (Hunter Root) | 19 | everything 2018–2025 |
| Seeds | **0** | — (no artifact in this exhibit) |

Note: a 3rd `medusas_disco` tag sits on `MV-HR-20260405-010` (the 2024 Abbey Bar ticketing page) — but that is a 2024 solo-era live show; the MD tag there is a stray, not an MD-identity artifact. The two genuine MD captures are the 2020 ReverbNation pages.

### V1-B · Role / Kind (what *is* this post)
The 23 artifacts sort cleanly into self-published roles. These are the natural role buckets the content actually contains:

| Content role | Count | Representative IDs |
|---|---|---|
| Archived release / catalog page | 5 | `…416-009`, `…416-011`, `…416-001`, `…416-003`, `…416-005` |
| Personal / artist message (health, loss, mental health, gratitude) | 7 | `…405-013` (tribute), `…405-006`, `…405-015`, `…405-012`, `…405-014`, `…405-009`, `…405-003` |
| Tour / show — announcement, ticketing, update | 6 | `…405-035`, `…405-010`, `…405-037`, `…405-009`, `…405-004`, (tour-prep) |
| New-music teaser / promo | 4 | `…405-034`, `…405-008`, `…405-005`, `…405-006` |
| Studio / behind-the-scenes | 2 | `…405-007` (recording space), `…405-015` (songwriting) |
| Cover performance (live) | 1 | `…405-011` (Little Red Riding Hood) |
| Merch / novelty | 2 | `…405-038`, `MV-20260419-002` (ElmThree puppet, dup) |
| Lyric / quote card | 1 | `…405-012` |

(Buckets overlap by one or two where a post does two jobs, e.g. a teaser that is also a personal message.)

### V1-C · Topic / Theme
| Theme | Count | IDs |
|---|---|---|
| Touring | 6 | `035`, `010`, `037`, `009`, `004`, (tour-prep) |
| Recording | 3–4 | `007`, `037`, `008`, `005` |
| Songwriting | 2–3 | `015`, `012` |
| **Health / illness** (Lyme ×2, mental health, hacked account) | 4 | `…405-003`, `…405-009`, `…405-015`, `…405-014` |
| Fan engagement / community | 3 | `006`, `014`, `034` |
| Family / loss | 1 | `…405-013` |
| Gear | 1 | `…405-007` |
| Influences | 1 | `…405-038` (Cheech & Chong) |

### V1-D · Format (medium)
Photo 3 · Video 10 · Web/link 10. No audio and no standalone text at the artifact level (audio lives inside album tracks, not as artifacts; the one lyric card is `media_type:link`).

### V1-E · Source / Platform (partial — most artifacts off-platform or pre-platform)
Facebook 16 · ReverbNation 5 · Instagram 1 · other 1. ReverbNation is a first-class platform here (the entire pre-solo archive), not an afterthought.

**Axes the content does NOT support as facets:** People (one value, `nick_root`, and he is a tribute *subject*, not a collaborator) and Lineup (`solo` ×10 vs. nothing — no contrast to filter on).

---

## View 2 — The spec's proposed model

As stated in `docs/discovery-filter-ux-spec.md` (§2), with Era labels per Mike's draft.

**Basic surface (perusal, total facets):**

- **Kind ×8** — Performance, Interview, Review, Cover, Studio, Candid, Press, Fan Submission. (Spec's "hero facet.")
- **Topic ×6** — Songwriting, Recording, Touring, Family, Gear, Influences.
- **Era** — human-readable, never raw years. Mike's draft labels: **SEEDS / Medusa's Disco / Solo Launch / Most Recently**.
- **Project / Band** — Solo, side projects, collaborations.
- **Format ×5** — Photo, Video, Audio, Text, Web.

**Detail filtering (hunt, partial facets):** Album, Song, Venue, Source/Platform (Facebook, Instagram, YouTube, TikTok, Reddit, Official Site, Archive.org, Fan Submission), People (producer, bandmates, engineer, manager), Importance (Primary/Secondary/Minor).

Per spec §3, total facets *filter* (AND across, OR within) and partial facets *scope* (null = exempt). That engine logic is sound and is **not** in question here — only whether the value lists match the content.

> Reference point worth flagging: the canonical data layer (`docs/canonical/UX_SPEC_v0.3.md` §D.2/D.3, vision lock T-08) already uses a **four-value era vocabulary: `seeds / medusas / rwth / solo`**. Mike's draft labels (SEEDS / Medusa's Disco / Solo Launch / Most Recently) are a *different* four — they drop `rwth` and split `solo` in two. The comparison below uses the content; the divergence from canon is called out under Era.

---

## Comparison — facet by facet

Legend: **AGREE** = spec value backed by real content · **DEAD** = spec value with ~0 artifacts · **MISSING** = real content cluster the spec has no value for · **WRONG-AXIS** = the content wants a different cut than the spec assumed.

### Kind ×8 — *the spec is modeling the wrong kind of archive*

| Spec value | Verdict | Evidence |
|---|---|---|
| Performance | AGREE (thin) | 1 — `…405-011` live cover; arguably the only true performance artifact |
| Cover | AGREE (thin) | 1 — `…405-011` (`fan_cover_song`) |
| Studio | AGREE (thin) | 1–2 — `…405-007`, `…405-015` |
| Candid | AGREE | 2–3 — `…405-035` (chip sandwich), puppet posts |
| Interview | **DEAD** | 0 |
| Review | **DEAD** | 0 |
| Press | **DEAD** | 0 (the ReverbNation pages are catalog, not press) |
| Fan Submission | **DEAD / near-0** | 0 clear; ElmThree puppet is a collaborator post, not a submission |

- **MISSING — Announcement / Promo:** tour announcements, single pre-saves, ticketing (`004`, `008`, `034`, `010`, `037`, `009`) — ~6 artifacts, the largest role cluster, has no Kind value.
- **MISSING — Personal / Artist message:** health updates, tribute, gratitude (`003`, `009`, `013`, `006`, `015`) — ~7 artifacts, no Kind value.
- **MISSING — Release / catalog page:** the 5 archived ReverbNation pages — no Kind value.

**WRONG-AXIS (headline finding):** the spec's Kind vocabulary is built for a **journalist's archive of an artist** (Performance / Interview / Review / Press / Fan Submission). This collection is the **artist's own outbound feed** — announcements, personal messages, and archived release pages. Half the spec's eight values are dead, and the three dominant real roles have no home. Kind needs to be re-derived from this content, not patched value-by-value.

### Topic ×6

| Spec value | Verdict | Evidence |
|---|---|---|
| Touring | AGREE (strong) | 6 — `035`, `010`, `037`, `009`, `004`, tour-prep |
| Recording | AGREE | 3–4 — `007`, `037`, `008`, `005` |
| Songwriting | AGREE | 2–3 — `015`, `012` |
| Family | AGREE (thin) | 1 — `…405-013` |
| Gear | AGREE (thin) | 1 — `…405-007` |
| Influences | AGREE (thin) | 1 — `…405-038` |

- **MISSING — Health / illness:** Lyme ×2 + mental health + hacked-account distress (`003`, `009`, `015`, `014`) — ~4 artifacts, a genuine recurring thread with no Topic value. This is arguably the most emotionally central theme of the recent era and the spec omits it.
- **MISSING — Fan engagement / community:** `006`, `014`, `034` — ~3 artifacts.

Topic is the **healthiest** spec facet: all six values are real (if four of them are thin). It needs additions (Health, Fan/community), not surgery.

### Era — *see dedicated section below.* Verdict in brief: SEEDS **DEAD**, "Solo Launch" **WRONG-AXIS** (no cluster), RWTH **MISSING** from Mike's labels.

### Project / Band

| Spec value | Verdict | Evidence |
|---|---|---|
| Solo | AGREE | 19 (all Hunter Root content) + `lineup:solo` ×10 |
| Side projects | partial | RWTH, Medusa's Disco, Seeds are prior band/identities (4 + 0 artifacts) |
| Collaborations | thin | ElmThree Productions puppet (`038`, `002`) — 2 |

**WRONG-AXIS:** Project/Band and Era are the **same cut** in this content. "RWTH / Medusa's Disco / Seeds / Solo" are simultaneously the bands *and* the eras — there is no artifact where Project and Era disagree. Running both as independent facets gives the visitor two chips that always move together. Either fold Project into Era, or reserve Project strictly for the genuinely orthogonal case (a collaboration that crosses eras, e.g. the ElmThree puppet) — which currently has 2 artifacts.

### Format ×5

| Spec value | Verdict | Evidence |
|---|---|---|
| Video | AGREE | 10 |
| Web | AGREE | 10 (`media_type:link`) |
| Photo | AGREE | 3 |
| Audio | **DEAD** | 0 at artifact level (audio is inside album tracks, not artifacts) |
| Text | **DEAD / near-0** | 0 distinct; the one lyric card is `media_type:link` |

Format works as a refinement axis (as the spec intends — demoted). Audio/Text are empty *in this exhibit* but defensible to keep if audio artifacts arrive with the R2 pipeline.

### Detail facets (Source, Album, People)

| Spec value | Verdict | Evidence |
|---|---|---|
| Source: Facebook | AGREE | 16 |
| Source: Instagram | AGREE (thin) | 1 (+ `source:instagram`, `source:tiktok` once each) |
| Source: **ReverbNation** | **MISSING** | 5 — the spec's platform list omits it entirely, yet it's the 2nd-biggest platform and the whole pre-solo archive |
| Source: YouTube / Reddit / Archive.org / Official Site | **DEAD** | 0 each |
| Album (partial) | partial | only `medusas_disco` (2 genuine) + `run_with_the_hunt` (2) carry content; the other 7 albums exist only as empty container cards |
| People | **DEAD** | 1 value (`nick_root`), a tribute subject — none of producer/bandmate/engineer/manager exist |

---

## Era mapping — do the content seams support Mike's four draft labels?

Content seams, in time order:

| Seam in the data | Artifacts | Mike's label maps to… |
|---|---|---|
| 2016 — RWTH ReverbNation archive | 2 (`416-009`, `416-011`) | **no label** — Mike's draft has no RWTH |
| 2018–2019 — solo identity appears | 2 (`416-001` RN page, `405-035` chip sandwich) | "Solo Launch"? — only 2 thin artifacts |
| 2020 — Medusa's Disco archival capture | 2 (`416-003`, `416-005`) | "Medusa's Disco" ✓ (but these are 2020 captures of a *pre-solo* band — out of time order) |
| 2021–2024 — solo prolific middle | ~9 | **no label** — falls between "Launch" and "Recently" |
| 2025 — recent solo (Crooked Home, Lyme, merch) | 5 | "Most Recently" ✓ |

Verdict on each label:

- **SEEDS — DEAD.** Zero artifacts in the exhibit. It exists in the canonical spine (`UX_SPEC_v0.3` D.2, position 0) as a *pre-discography placeholder with content authoring pending* — so as an era *tile* it's intentional, but as a *filter value over current content* it filters to nothing. Keep it as a spine tile if you like; don't surface it as a live Era chip until it has artifacts.
- **Medusa's Disco — LIVE but thin (2).** Real, but note these are 2020 archival pages of a band that predates the solo work — chronology and identity disagree, so an Era sort by date will misplace them. Tie MD to identity, not post date.
- **"Solo Launch" — WRONG-AXIS / no cluster.** The content has no distinct "launch" moment to anchor this. 2018–2019 is two thin artifacts; the real solo mass is 2021–2025 and reads as one continuous run, not a launch-then-gap. This label invents a seam the data doesn't have.
- **"Most Recently" — LIVE (5).** The 2025 cluster is real and coherent.
- **RWTH — MISSING from Mike's labels.** Two genuine 2016 artifacts and a whole canonical era (`rwth`) have no draft label. This is the clearest gap.

**What the content supports instead:** the canonical **`seeds / medusas / rwth / solo`** vocabulary fits better than Mike's draft — it keeps RWTH and doesn't invent "Solo Launch." The only adjustments the *content* demands: (a) Seeds is currently empty (tile-only, not a live filter value), and (b) if you want to subdivide the dominant `solo` block, the real seam is **recent (2025) vs. catalog (2018–2024)** — not "launch vs. recently." So a content-true Era set is closer to: **Medusa's Disco · Run With The Hunt · Solo (catalog) · Solo (recent)**, with Seeds held as a future/empty tile.

---

## Consolidated punch-list for Mike

### Bucket 1 — Value tweaks (the spec's *model* is fine here; just fix the value list)

1. **Topic: add "Health / illness"** — 4 artifacts (Lyme ×2, mental health, hacked-account), currently homeless and thematically central to the recent era.
2. **Topic: add "Fan engagement / community"** — ~3 artifacts.
3. **Source: add "ReverbNation"** — 5 artifacts; spec's platform list omits the 2nd-biggest platform.
4. **Source: drop or hide YouTube / Reddit / Archive.org / Official Site** — 0 artifacts each in this exhibit.
5. **Format: Audio & Text are empty (0)** — keep only if the audio pipeline will populate them; otherwise demote/hide.
6. **People: effectively dead (1 subject, not a collaborator)** — don't surface as a Detail facet until real collaborator data exists.
7. **Album: only 2 of 9 albums carry content artifacts** — the 7 card-only albums will read as empty Album filter values. Expected (cards are containers), but flag so the Album facet doesn't look broken.
8. **Era: SEEDS has 0 artifacts** — keep as a spine tile, don't surface as a live Era filter chip yet.
9. **Data nit:** `MV-HR-20260405-010` (2024 Abbey Bar) is tagged `album:medusas_disco` but is a solo-era live show — likely a stray tag worth a look (flag only; nothing changed).

### Bucket 2 — The spec's model may be wrong here (re-think the facet, not the values)

10. **Kind ×8 is built for the wrong archive type.** Four of eight values (Interview, Review, Press, Fan Submission) are dead, and the three biggest real roles (Announcement/Promo, Personal/Artist-message, Release/Catalog-page) have no value. Kind should be **re-derived from this artist-feed content**, not patched. This is the single biggest finding.
11. **Era vs. Mike's draft labels.** "Solo Launch" anchors a seam the data lacks; RWTH (a real era with artifacts) has no label. Prefer the canonical `seeds / medusas / rwth / solo`, adjusted to **MD · RWTH · Solo-catalog · Solo-recent** with Seeds as an empty tile. (Also: Mike's draft diverges from the already-canonical era vocab in `UX_SPEC_v0.3` — reconcile the two before either ships.)
12. **Project/Band and Era are the same cut.** The band identities *are* the eras; the two facets always move together. Fold Project into Era, or restrict Project to genuinely cross-era collaborations (currently just the 2 ElmThree puppet artifacts).

### Net read
The **engine** (total/partial, scoping) and the **Topic** and **Format** facets are sound — they need value-list edits. **Kind**, **Era labels**, and the **Project/Era overlap** are where the spec's *model* — not just its values — is likely wrong for this content, because the spec was written against a press-archive hypothesis and the content is an artist's own feed.

---

## Appendix — shared artifact table (23 content artifacts, chronological)

| # | post_date | ID | media | platform | identity/era | album | event | role (V1) | gist |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 2016-06-30 | MV-HR-20260416-009 | link | reverbnation | RWTH | run_with_the_hunt | — | release page | RWTH archived artist page (Jam/Grunge/Acoustic) |
| 2 | 2016-06-30 | MV-HR-20260416-011 | link | reverbnation | RWTH | run_with_the_hunt | — | release page | Park Bench Pigeons song page (RWTH, Manheim PA) |
| 3 | 2018-05-19 | MV-HR-20260416-001 | link | reverbnation | Solo | — | — | release page | Hunter Root archived artist page (solo launch) |
| 4 | 2019-05-21 | MV-HR-20260405-035 | photo | facebook | Solo | — | tour | candid | tour prep "chip sandwich" |
| 5 | 2020-02-02 | MV-HR-20260416-003 | link | reverbnation | Medusa's Disco | medusas_disco | — | release page | MD archived artist page (Psych/Alt) |
| 6 | 2020-02-02 | MV-HR-20260416-005 | link | reverbnation | Medusa's Disco | medusas_disco | — | release page | Park Bench Pigeons song page (MD, Lancaster PA) |
| 7 | 2021-04-22 | MV-HR-20260405-013 | link | facebook | Solo | — | — | personal/tribute | tribute to brother Nick Root (d. 27) |
| 8 | 2022-02-08 | MV-HR-20260405-034 | link | facebook | Solo | — | — | promo/personal | guitar lessons + upcoming single |
| 9 | 2022-03-29 | MV-HR-20260405-008 | video | facebook | Solo | — | — | new-music teaser | TikTok song idea, pre-save "Quicksand Sinking" |
| 10 | 2023-02-16 | MV-HR-20260405-006 | video | facebook | Solo | — | — | personal/fan | gratitude post, "Town Rat Heathen", album coming |
| 11 | 2023-02-16 | MV-HR-20260405-015 | video | facebook | Solo | — | — | songwriting/personal | early-stages song; IG hacked; mental health |
| 12 | 2023-05-25 | MV-HR-20260405-012 | link | facebook | Solo | — | — | lyric/quote | "Dreaming up ways of gettin' outta this hellhole" |
| 13 | 2023-06-12 | MV-HR-20260405-011 | video | facebook | Solo | — | live_show | cover/performance | impromptu live "Little Red Riding Hood" |
| 14 | 2023-11-25 | MV-HR-20260405-007 | video | facebook | Solo | — | rehearsal | studio/BTS | recording space for "Arkansas" + gear |
| 15 | 2023-12-04 | MV-HR-20260405-005 | video | facebook | Solo | — | — | new-music teaser | hashtag americana early version |
| 16 | 2024-03-16 | MV-HR-20260405-010 | link | other | Solo | medusas_disco ⚠ | live_show/ticketing | show listing | Abbey Bar ticketing, Harrisburg PA (MD tag stray) |
| 17 | 2024-07-01 | MV-HR-20260405-014 | video | facebook | Solo | — | fall_tour | personal/fan | rebuild IG after hack; fall tour on sale |
| 18 | 2024-09-19 | MV-HR-20260405-037 | photo | instagram | Solo | — | tour | tour update | on the road; recording new material |
| 19 | 2025-06-19 | MV-HR-20260405-009 | link | facebook | Solo | — | tour_announcement | personal/tour | apology to Movement on the Mountain; Lyme |
| 20 | 2025-09-03 | MV-HR-20260405-038 | video | facebook | Solo | — | — | merch/novelty | ElmThree puppet; Cheech & Chong tribute |
| 21 | 2025-09-03 | MV-20260419-002 | photo | facebook | Solo | — | — | merch/novelty | same puppet reel (photo dup of #20) |
| 22 | 2025-10-15 | MV-HR-20260405-004 | video | facebook | Solo | — | tour/tour_announcement | tour announcement | "Crooked Home" tour + release Friday |
| 23 | 2025-11-02 | MV-HR-20260405-003 | video | facebook | Solo | — | — | personal/health | "Lyme disease is kicking my ass" |

**Container cards (10, not filtered-for):** `MV-20260529-001` (gallery, Central PA Oct 2025) · 9 album cards — `run_with_the_hunt`, `arkansas`, `crooked_home`, `life_inside_a_wheel`, `mimicking_the_sun_like_dandelions`, `skipping_stones…`, `they_finally_cracked_me`, `phone_recordings_ep`, `rarities`. All undated, no platform. Note Medusa's Disco has **no** album card despite having content artifacts.

---
*Generated read-only at commit 955fc99. No repo content was retagged, edited, or committed.*
