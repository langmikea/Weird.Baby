# Content Reconcile — weird-baby-museum @ 955fc99

**Mode:** read-only analysis. Nothing pushed, deployed, committed, or retagged. This report is the only file written.
**Question:** A prior pass read only `src/data/exhibits/hunter_root.json` (33 records) and concluded the corpus is an artist-outbound feed with **no interviews and no fan submissions**. Mike says he knows there are interviews, fan photos, and videos. Resolve from the data.

---

## Verdict (read this first)

The "outbound feed" half is **correct**; the "I know there are interviews / fan photos" half is **mostly not in the data** — with one nuance.

- **Interviews: do not exist in the data.** Zero artifacts across the full 280-record corpus are tagged, titled, described, or transcribed as an interview. "Interview" exists only as an *unused vocabulary value* and a *mothballed UI type* — a planned facet, never populated.
- **Videos: real and present.** 11 video artifacts exist in the full corpus (10 of them surface in the 33-record exhibit). The prior pass *did* have these — it just described the corpus as outbound, which they are.
- **Fan content: a handful of fan-*themed* posts, but no genuine fan *submissions*.** 5 artifacts carry a `fan` attribute and 1 photo shows Hunter Root with friends at a venue — but every one was authored/posted by the artist. There are no fan-uploaded photos or fan-submitted media.
- **The 33-record read under-counted the corpus by ~88%** (33 of 280) and mis-parsed the tag structure — but on the specific claim "no interviews," it reached the right answer for the wrong-ish reason. The full corpus confirms: no interviews anywhere.

So: the prior conclusion is **substantially an artifact of reading only 33 records** (it missed the 280-row reality and the real platform/role mix), **but it is not wrong about interviews** — those genuinely aren't in the data, in either the 33 or the 280.

---

## 1. Full data inventory — every content source

### Primary content store (the real corpus)

**`C:\AI\Platform\MediaVault\core\mediavault.sqlite`** — *outside the repo*, in the Platform tree. This is the ~185-row DB referenced earlier, now grown to **280 artifacts**. Tables:

| Table | Rows | Holds |
|---|---:|---|
| `artifacts` | **280** | The actual content records (the corpus) |
| `tags` | 221 | Tag vocabulary slugs + usage counts |
| `ingest_queue` | 85 | Pending/processed ingest items (no interview/fan/video hits) |
| `vocabulary` | 18 | Controlled vocabulary rows |
| `id_sequence` | 8 | ID counters |
| `sqlite_sequence` | 0 | SQLite bookkeeping |

The repo's own tool confirms this is the source of record: `tools/backup_mediavault.py` hard-codes `DB = r"C:\AI\Platform\MediaVault\core\mediavault.sqlite"`. Dozens of `mediavault.sqlite.bak_*` backups sit beside it.

### Exhibit export (the file the prior pass read)

**`src/data/exhibits/hunter_root.json`** — **33 artifacts**. Its own metadata says it is a filtered export: `"filter": "released, not archived, badged for this exhibit"`, `exported_at: 2026-06-12`. It is a **derived subset** of the 280, not an independent source. Tags here are stored as a **nested dict** (`{attributes:[…], content_kind:…, presentation:…}`), not the flat `prefix:value` list used in the DB — this matters (see §3).

### Other files under `src/data/` (config / roster, not artifact content)

- `exhibits.config.json` (509 B) — exhibit registry config
- `vocabulary.json` (2.8 KB) — facet vocabulary
- `artists/hunter-root.js`, `artists/hunter-root-spine.js` — artist spine/metadata
- `hr_journal_prompts.js`, `wb_merch.js`, `wb_roster.js` — journal prompts, merch, roster

None of these hold artifact/content records.

### Working / manifest files (not content stores)

- `tools/sync-assets-to-r2-manifest.json` (73 KB) — asset-upload manifest (file paths/hashes, not records)
- `Platform/MediaVault/core/` JSON: `enrich_results.json`, `enrich_queue.json`, `fb_candidates.json`, `tag_vocabulary.json` — enrichment scratch + vocabulary
- `.wrangler/state/.../*.sqlite` — Cloudflare miniflare local cache/D1 emulator, **no content tables**; ignore.

**Bottom line:** there is exactly **one** content corpus — `mediavault.sqlite` (280 artifacts). `hunter_root.json` is a 33-record badged slice of it.

---

## 2. Where interviews / fan photos / videos actually live

Searched by tag, by `media_type`, and by title/description/extracted-text/notes keyword across all 280.

### Interviews — **0**
- `media_type`: there is no interview media type; the enum is `photo/video/audio/link/text/mixed/other`.
- Tags: `select … where slug like '%interview%'` → **none**; artifacts with "interview" in tags → **0**.
- Keywords across all 280 (`interview`, `podcast`, `radio`, `sat down with`, `talked to`, `q&a`, `press`, `spoke with`) → **0 genuine hits**. (5 "press" matches are false positives: "de**press**ed", "ex**press**ed", and ReverbNation genre tags.)
- "Interview" appears only as: (a) a value in the `content_type` vocabulary in `tag_vocabulary.json` (`"song","interview","press","live-show",…`), and (b) a string in a **mothballed** function in `src/routes/hr/HrExhibitFlow.jsx` (`DEEP_TYPES = ["analysis","interview","art","cover","update"]`, inside `runKaleidoscopeRecipe`, commented `// MOTHBALLED for v1 … do not render`). Both are *planned scaffolding*, not data.

**Interviews are a planned facet with zero content behind it.**

### Videos — **11** (all in MediaVault; 10 also in the 33-record exhibit)
All 11 are Hunter Root's own Facebook posts/reels. IDs:
`MV-HR-20260405-003, -004, -005, -006, -007, -008, -011, -014, -015, -029, -038`.
Content: tour announcements, song ideas/early versions, a recording-space tour, a Lyme-disease artist message, an ElmThree puppet reel. **Source file:** `mediavault.sqlite` → `artifacts`. The exhibit export carries 10 of these as `media_type: video`.

### Fan content — **5 fan-themed, 0 fan submissions**
Artifacts carrying any `fan*` attribute (source: `mediavault.sqlite`; all also present in the 33 except the photo):

| ID | media | platform | what it is |
|---|---|---|---|
| `MV-HR-20260405-006` | video | facebook | Artist thanking followers ("share my appreciation for everyone that has followed") |
| `MV-HR-20260405-009` | link | facebook | Artist post ("Apologies to Movement on the Mountain") |
| `MV-HR-20260405-011` | video | facebook | Artist's own impromptu cover (`attributes:fan_cover_song`) of "Little Red Riding Hood" |
| `MV-HR-20260405-014` | video | facebook | Artist asking fans to help rebuild his Instagram |
| `MV-HR-20260405-033` | **photo** | local | "Hunter Root with two friends at a venue in Lancaster, PA" — the closest thing to a fan photo |

Every one is **authored/posted by the artist**. The `attributes:fan` tag means "fan-engagement topic," not "submitted by a fan." There are **no fan-uploaded photos or fan-submitted media** in the corpus. The single venue photo (`-033`) is the only genuinely fan-*adjacent* image, and even that is the artist with friends, ingested via `local-drop`.

---

## 3. Did the 33-record read under-count, and why?

**Yes — two compounding reasons.**

**(a) It read a 33-of-280 slice (≈12%).** The export filter is `released, not archived, badged for this exhibit`. The 33 are the outbound social posts, archived ReverbNation pages, and 8 album-cards. The other 247 — including all **94 audio** and **70 photo** records — never appear in `hunter_root.json`. Any "what's in the corpus" conclusion drawn from the 33 is structurally blind to ~88% of it. That's why the platform/role picture looked thinner and more "outbound" than the full set.

**(b) The export nests tags differently, which can defeat a flat Kind-mapping.** In `mediavault.sqlite`, tags are a **flat list**: `["attributes:fan", "content_kind:studio", "presentation:link", …]`. In `hunter_root.json` the same tags are a **nested dict**:
```json
"tags": { "attributes": ["fan","milestone","personal"], "bands": ["hunter_root"], "exhibit": ["hunter_root"] }
```
A Kind-mapper that scans for flat strings like `content_kind:*` or `attributes:fan` (or that iterates `tags` as a list) sees only the **dict keys** (`attributes`, `bands`, `exhibit`…) and matches nothing — so fan/kind signal silently vanishes. This is exactly the trap: on first parse the 33 *looked* like they had no `content_kind` and no `fan` tags. Parsed correctly (flattening the dict), the 33 do contain:
`attributes:fan` ×3, `attributes:fan_cover_song` ×1, `content_kind:other` ×10, `presentation:link` ×1.

So the misclassification is real for **fan content** — it was there in the 33 and got missed. **But there is no interview artifact hiding under a bad mapping.** No record in the 33 (or the 280) is an interview that a Kind-map mislabeled; the category is simply empty. The tags that misled were the **nested `attributes`/`content_kind` keys**, which masked the fan signal — not any interview signal.

---

## 4. True full-corpus content profile (280 artifacts)

Use these as the real inputs for the facet prototype, not the 33-record subset.

**Media type**

| type | count |
|---|---:|
| audio | 94 |
| link | 79 |
| photo | 70 |
| text | 16 |
| video | 11 |
| other | 10 |

(The 33-record export, by contrast: video 10, link 10, photo 3, other 10, audio **0** — i.e. it omits the entire audio body.)

**Source platform**

| platform | count |
|---|---:|
| youtube | 104 |
| bandcamp | 79 |
| reverbnation | 42 |
| (none) | 19 |
| facebook | 16 |
| local | 12 |
| other | 7 |
| instagram | 1 |

**Status:** released 197, vault 81, inbox 1, archived 1.
**Ingest source:** url-entry 99, bandcamp-purchase 79, requeue 54, local-drop 24, extension-capture 14, cowork 9, cowork_phase1 1.
**Storage mode:** vaulted 160, url_only 64, referenced 56.

**Content-kind mix** (where tagged): studio 78, official 28, live 20, other 10, lyrics 3, cover 1.
**Role mix:** overwhelmingly **single-artist outbound** — `bands:hunter_root` on 275/280, `author:hunter_root` on 178. The corpus is Hunter Root's own catalog and social output (music on Bandcamp/YouTube/ReverbNation + Facebook posts/reels), plus archival captures. There is no third-party/press/fan-authored tier of content.

---

## Plain answer for Mike

The original "outbound feed, no interviews/fan-content" call was made off a 33-record export that is only ~12% of the corpus and that hides tag signal in a nested structure — so as a *characterization of the whole corpus* it was under-informed. The full corpus is **280 artifacts** in `C:\AI\Platform\MediaVault\core\mediavault.sqlite`, and it does contain **videos (11)** and a few **fan-themed posts (5)** — those parts of your memory are right.

But on the specific contested claim: **there are no interviews in the data** — not in the 33, not in the 280, not under any mislabel. "Interview" is a planned facet (vocabulary + a mothballed UI type) with nothing behind it yet. And the "fan photos" are really **artist-posted, fan-themed** items — one venue photo of you with friends is the closest match; there are **no genuine fan submissions**. If interviews and fan uploads should exist, they need to be **ingested** — they aren't mis-tagged, they're absent.

---

### Method note
Read host-direct from `C:\AI`. Counts confirmed against `mediavault.sqlite` (280 artifacts) and `hunter_root.json` (33). Keyword scans run over `description_short`, `description_long`, `extracted_text`, `notes`, `source_url`, and tags. No files in the repo or DB were modified.
