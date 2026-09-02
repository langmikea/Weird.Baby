# Press/Interview Ingestion — Scoping Findings (read-only)

**Session:** 2026-06-16 · **Ops:** Claude · **Mode:** discovery only — no MV writes, no code edits, no build.
**Sources inspected:** live MV at `Platform/MediaVault/core/mediavault.sqlite` (snapshot dated 2026-06-14); `docs/kind-governance-spec.md`, `docs/discovery-metadata-spec.md`, `docs/CANONICAL_VOCABULARY.md`; `src/data/exhibits/hunter_root.json` (exported 2026-06-15); `docs/ingest-log.md`; Batch-2 docs.

**One-line takeaway:** the tagging rules already exist and are locked — use them, don't invent. But there is a real blocker: the kind a press/interview artifact needs (`interview`, `press`, `review`) does **not** cleanly exist as an emittable value in the live MV storage schema today. Details in §3 and the flag at the end.

---

## 1. Tagging rules (quoted from the authoritative docs)

Two specs are authoritative and *not* in conflict for our purposes; `CANONICAL_VOCABULARY.md` is **retired**:

- `discovery-metadata-spec.md` (Model A) — the visitor-facing **Discovery facet** vocabulary and the retag/derivation rules.
- `kind-governance-spec.md` (v1) — the **shipped MV storage** `kind` field (governed scalar column).
- `CANONICAL_VOCABULARY.md` — header now reads: *"SUPERSEDED (2026-06-14)… describes the retired tier model and is no longer authoritative… Do NOT orient to the three-tier model."* Ignore it.

### The facet model (discovery-metadata-spec §1)

Five **total** facets (every leaf gets exactly one value): **Kind, Topic, Era, Project/Band, Format**.
Five **partial** facets (only some artifacts have a value; null is meaningful and exempt, never rejected): **Album, Song, Venue, Source/Platform, People**.

> "**Kind and Format are both required on every artifact.**" (§1)
> "For a partial facet, an artifact with **no value is exempt** from any selection in that facet — never rejected by it… Null is **meaningful**, not a curation gap: a studio photo legitimately has no Source; **an interview legitimately has no Venue.**" (§1)

### When each tag should be applied (the retag mapping rules, §7 — quoted/condensed)

| Facet | Required? | Rule (quoted/condensed) |
|---|---|---|
| **Kind** | total, required | "Curator reads title/description and assigns one role from the closed Kind list." Pure curation. |
| **Topic** | total, required, **single** | "Curator assigns the single dominant topic." Closed list. Pure curation. |
| **Era** | total, required on **leaves** | "Seed from `post_date` year → bucket (§5), then curator confirms/overrides." Pure curation w/ post_date as hint. |
| **Project/Band** | total, required, single | Derived from `tags.bands` (→ `Hunter Root` for all current artifacts). Open list. |
| **Format** | total, required | Derived from `media_type`: `video→Video, photo→Photo, audio→Audio, link→Web (override to Text when the post's substance is the writing), text→Text`. |
| **Album** | partial, multi, null-ok | "From `tags.album` where present. Null where absent — exempt." Derivable. |
| **Song** | partial, multi, null-ok | "From `tags.song` where present. Null exempt." Derivable. |
| **Source/Platform** | partial, closed, null-ok | "From `source_platform` / `tags.source`… Leave **null** for off-platform artifacts." Derivable. |
| **People** | partial, multi, null-ok | "From `tags.people`. Null exempt." Derivable. |
| **Venue** | partial, null-ok | Pure curation from description; null exempt. |

**Implication for press items:** Album / Song / People / Venue are **legitimately null** on most press/interview artifacts and must be left null (the engine treats null as exempt — do **not** force-fill them). The required fields you must supply for every press leaf are **Kind, Topic, Era, Project, Format**.

---

## 2. Live vocabulary (current values per namespace, from `artifacts.tags` in live MV)

The `tags`/`vocabulary` registry tables are stale; the authoritative live values are the slugs actually present in `artifacts.tags`. Counts = number of artifacts using the value.

- **content_kind** (11) — `studio` 79, `official` 28, `live` 20, `other` 10, `announcement` 6, `performance` 5, `music` 5, `candid` 3, `lyrics` 3, `cover` 2, **`press` 1**. *(Note: `content_kind` is a **retired** tag namespace — see §3. There is no `interview` value.)*
- **topic** (6) — `songwriting` 7, `touring` 5, `influences` 5, `recording` 2, `family` 2, `gear` 1. **Closed list per spec:** Songwriting · Recording · Touring · Family · Gear · Influences.
- **era** (6 in data; 5 canonical buckets) — `rwth` 15, `on_the_road` 9, `recent` 4, `breakthrough` 3, `finding_the_sound` 3, `early_days` 3. (`rwth` is a legacy slug that maps into **Early Days** — see §5.)
- **source** (6) — `youtube` 101, `bandcamp` 79, `reverbnation` 42, `instagram` 2, `tiktok` 1, `other` 1. **MISSING for press:** no `spotify`, no `web`, no per-publication source, no `genius`, etc. (`youtube` exists; `bandcamp` exists.)
- **format** (5) — `video` 10, `web` 6, `text` 4, `photo` 2, `short` 2. **Closed list per spec:** Photo · Video · Audio · Text · Web. (A web article = **Web**, or **Text** if the writing is the substance.)
- **album** (10 distinct) and **song** (78 distinct) — large existing lists; press items will mostly be null here.
- **people** (1) — `nick_root`. **bands** (1) — `hunter_root`.
- **type** (5, legacy) — `audio` 108, `video` 47, `mp3` 30, `poster` 1, `music_video` 1. (Legacy `type` namespace; superseded by Format/`media_type` per metadata-spec §4.)

### What's MISSING that a press/interview artifact needs
- **No `interview` content_kind**, and no `press`/`review` Discovery Kind in MV storage (see §3 — this is the blocker).
- **No `source:spotify`, `source:web`, or publication-name sources.** Only `youtube` and `bandcamp` exist among "web" platforms.
- **Topic list may be too narrow** for press: an interview about, say, the band's *Lyme-disease* story or *mental health* has no clean Topic — current closed set is Songwriting/Recording/Touring/Family/Gear/Influences. Mike may need to consciously extend the closed Topic list (spec edit), per metadata-spec §3 ("added deliberately as a spec edit, not auto-grown").

---

## 3. MV schema CHECK constraints (the column-vs-tag question)

Two governed **scalar columns** on `artifacts` (these are columns, not tags):

```sql
media_type  TEXT NOT NULL
    CHECK(media_type IN ('photo','video','audio','link','text','mixed','other')),

kind        TEXT
    CHECK(kind IN ('performance','release','announcement','studio','candid','interview','fan')),
```
Other CHECKs: `storage_mode IN ('vaulted','referenced','url_only')`, `link_status IN ('live','dead','local-only')`, `status IN ('inbox','vault','released','archived')`, `post_date_confidence IN ('extracted','manual','estimated','unknown')`.

**The critical finding — Kind is a column, and the value you want is blocked or absent:**

1. **Kind is a governed scalar field, NOT a tag** (`kind-governance-spec.md` §3): "Kind is a field, never a tag — it does not go through `write_artifact_tags` and gets no `content_kind:`-style pill." So a press/interview artifact's role must be set on the `kind` **column**, not as a `content_kind:` tag. (`content_kind` is **retired**, §5 of that spec.)

2. **`interview` is in the CHECK set but RESERVED — not yet emittable.** Spec §1/§3: `interview` and `fan` are "**Reserved for inflow — defined, not yet populated**… Until activated, ingest must **not** emit `interview` or `fan`." §3.4: "**Reject reserved values** at ingest until activated." So under the shipped rules you **cannot** currently write `kind='interview'` — that requires Mike to flip reserved-Kind activation first (open question Q8 in that spec: a vocab-version bump, an operator toggle, or first inflow).

3. **`press` and `review` do not exist as MV storage `kind` values at all.** They exist only in the **Discovery facet** vocabulary (metadata-spec §2: `Performance · Interview · Review · Cover · Studio · Candid · Press · Fan Submission · Music`). The metadata-spec explicitly flags this gap (§2 note): "MV has no `Review`/`Cover`/`Press`… Mapping MV `kind` → Discovery Kind is a retag-time concern, not a schema conflict." So an artifact that is a **press article or review** has **no honest MV `kind` column value** today — only `interview` (reserved) maps, and only for actual interviews.

**Net:** the 16 URLs split into at least two role-types (interviews vs. press/reviews), and *neither* can be written to the live `kind` column right now without a governance action by Mike:
- interviews → need **reserved-Kind activation** of `interview`;
- press/reviews → need a **new value added to the `kind` CHECK** (DDL) **or** a decision to carry them as Discovery-only Kind without an MV column value.

---

## 4. Already done? (duplicate check — clear)

**None of the press/interview URLs appear to be ingested yet.**

- **`kind='interview'` artifacts in MV: 0.**
- **Keyword scan of every artifact's url/description/notes/extracted_text:** `interview` 0, `article`/`magazine`/`podcast`/`genius`/`blog` 0. The hits that exist are incidental: `press` 5 (e.g. "press play," archived ReverbNation pages), `review` 34 (ReverbNation "reviews"), `spotify` 32 (the word in descriptions — **0** artifacts have a Spotify `source_url`), `feature` 6.
- **The single `content_kind:press` artifact is NOT one of the 16.** It is `MV-HR-20260405-012`, a 2023 **Facebook** lyric-quote post ("Dreaming up ways of gettin' outta this hellhole"), tagged `content_kind:press, era:on_the_road, format:text, topic:songwriting`. A legacy tag, not a press article.
- **Source hosts in MV** are only `youtube.com`, `reverbnation.com`, `ytimg.com`, `facebook.com`, `instagram.com`, one ticketing page — **no magazine/blog/press domains, no Spotify.**
- **`docs/ingest-log.md` is YouTube-only** (yt-ingest CLI runs); no press batch. **Batch-2 docs** concern discography reconciliation, not press. No list of the 16 URLs exists anywhere in the repo.
- **Exhibit (`hunter_root.json`):** 139 artifact records; the only press-adjacent item is the same FB `content_kind:press` post. No interviews/articles.

So: safe to ingest all 16 as new — no de-dup needed against existing records.

---

## 5. Era — how it's defined & assigned

`discovery-metadata-spec.md` §5. Era is **total, closed, hard-required on leaves** (containers exempt). **Five contiguous buckets, seeded from `post_date` year, curator may override** ("a 2025-dated retrospective about the early days may belong in *Early Days* by intent"):

| Era (visitor label) | Year range | Notes |
|---|---|---|
| **Early Days** | 2016–2018 | Run With The Hunt era; `rwth` legacy slug maps here |
| **Finding the Sound** | 2019–2020 | Medusa's Disco era |
| **Breakthrough** | 2021–2022 | label is provisional/repaintable; range locked |
| **On the Road** | 2023–2024 | label provisional/repaintable; range locked |
| **Recent** | 2025 | Crooked Home, current activity |

Assignment rule (§7): "**Seed from `post_date` year → bucket, then curator confirms/overrides.** Era is an editorial grouping, so the seeded value is a starting point only."

**Implication for press:** each press/interview item needs a `post_date` (publication date) → seed to a bucket → Mike confirms. A piece *published* in 2025 but *about* the early days is an Era judgment call, not automatic. **Note the range ceiling: the buckets stop at 2025.** Any 2026-dated press would currently fall outside all five buckets — Mike may need to extend "Recent" or add a bucket.

---

## 6. What Mike needs to decide before ingestion can be designed

1. **Role/Kind for press vs. interview vs. review.** Activate reserved Kind `interview`? Add `press`/`review` to the MV `kind` CHECK (DDL), or carry them as Discovery-only Kind with a null MV column? (This gates everything — see §3.)
2. **New Source values:** add `source:spotify`, `source:web`, and/or per-publication sources? (None exist today.)
3. **Topic coverage:** is the closed 6-value Topic list sufficient for press subject matter, or extend it (spec edit)?
4. **Era ceiling:** extend buckets past 2025 if any press is 2026-dated.
5. **Format default:** confirm web articles → **Web** (vs **Text** when the writing is the substance), per §4.
6. **Required-vs-null discipline:** for each of the 16, the required tags are Kind/Topic/Era/Project/Format; Album/Song/People/Venue stay **null** unless genuinely present (do not force-fill).

---

*End of findings. Read-only pass — nothing in MV, the exhibit, or code was written or changed. The DB was copied to a scratch file for inspection only.*
