# Priority 4 verification — Deep Dive spec

**Date:** 2026-05-10
**Scope:** Read-only verification of two ungrounded assertions in SPEC_DRAFT_v2.md §3.4.

The spec asserts (i) that an artifact's YouTube URL lives in a `source_url` column on MV's `artifacts` table, and (ii) that the museum's `HR_CARDS` data structure carries a YouTube `ytId` field that joins cleanly to the export's keying. Both assertions were checked against the actual SPEC.md, source code, and live SQLite database. The first assertion holds. The second does not.

---

## Q1 — Where does the YouTube URL live in MV?

### What SPEC.md §6 declares

Verbatim from `MediaVault/SPEC.md` §6 (the "Catalog Record Schema" snippet, lines 258–292):

```
CREATE TABLE artifacts (
  id                       TEXT PRIMARY KEY,
  status                   TEXT NOT NULL DEFAULT 'inbox',   -- inbox|vault|released|deleted
  storage_mode             TEXT NOT NULL DEFAULT 'vaulted', -- vaulted|referenced|url_only

  source_url               TEXT,
  source_platform          TEXT,
  ingest_source            TEXT,
  ingest_date              DATE,
  capture_date             DATE,
  post_date                DATE,
  post_date_confidence     TEXT,

  description_short        TEXT,
  description_long         TEXT,
  extracted_text           TEXT,
  media_type               TEXT,                            -- photo|video|audio|link|text|mixed|other

  local_asset_path         TEXT,
  thumbnail_path           TEXT,
  parent_artifact_id       TEXT,

  tags                     TEXT NOT NULL DEFAULT '[]',      -- JSON array of slugs currently "on"

  link_status              TEXT,   -- advisory only

  notes                    TEXT,
  confidence_flags         TEXT,                            -- JSON
  released_at              TEXT,
  released_by              TEXT,
  archived_at              TEXT,
  created_at               TEXT NOT NULL,
  updated_at               TEXT NOT NULL,
  FOREIGN KEY (parent_artifact_id) REFERENCES artifacts(id)
);
```

The single column that holds an external URL is `source_url TEXT`. There is no separate `youtube_url`, `external_url`, or per-platform URL column. (The thumbnail-side URL field is `thumbnail_path`, which is a local path, not a URL.) `source_platform` stores the platform discriminator (e.g. `youtube`).

### What `handle_artifact_register` writes

`MediaVault/core/imgserver_extensions.py`. Body fields accepted by the function are documented at lines 196–230 and include `source_url` as a passthrough optional, alongside `source_platform`, `media_type`, `storage_mode`, `status`, `local_asset_path`, `parent_artifact_id`, `post_date`, `post_date_confidence`, `capture_date`, descriptions, `tags`, `thumbnail_path`, `confidence_flags`, and `notes`.

The actual INSERT is at lines 337–374:

```python
conn.execute(
    """INSERT INTO artifacts(
        id, source_url, source_platform, ingest_source, ingest_date,
        storage_mode, local_asset_path, thumbnail_path, link_status,
        parent_artifact_id, media_type,
        post_date, post_date_confidence, capture_date,
        status,
        description_short, description_long, extracted_text,
        tags,
        confidence_flags, notes,
        created_at, updated_at
    ) VALUES(?,?,?,?,?, ?,?,?,?, ?,?, ?,?,?, ?, ?,?,?, ?, ?,?, ?,?)""",
    [
        artifact_id,
        body.get("source_url"),
        source_platform,
        ...
```

The handler writes the body's `source_url` value verbatim into the `artifacts.source_url` column. It does not parse, normalize, or split the URL into a `ytId` or other component. It does not project the URL elsewhere on the row.

### What the live database shows

Output of `PRAGMA table_info(artifacts);` against `MediaVault/core/mediavault.sqlite`, verbatim:

```
(0, 'id', 'TEXT', 0, None, 1)
(1, 'source_url', 'TEXT', 0, None, 0)
(2, 'source_platform', 'TEXT', 0, None, 0)
(3, 'ingest_source', 'TEXT', 0, None, 0)
(4, 'ingest_date', 'DATE', 1, None, 0)
(5, 'storage_mode', 'TEXT', 1, "'vaulted'", 0)
(6, 'local_asset_path', 'TEXT', 0, None, 0)
(7, 'thumbnail_path', 'TEXT', 0, None, 0)
(8, 'link_status', 'TEXT', 0, None, 0)
(9, 'parent_artifact_id', 'TEXT', 0, None, 0)
(10, 'media_type', 'TEXT', 0, None, 0)
(11, 'post_date', 'DATE', 0, None, 0)
(12, 'post_date_confidence', 'TEXT', 0, None, 0)
(13, 'capture_date', 'DATE', 0, None, 0)
(14, 'status', 'TEXT', 1, "'vault'", 0)
(15, 'released_at', 'TEXT', 0, None, 0)
(16, 'released_by', 'TEXT', 0, None, 0)
(17, 'description_short', 'TEXT', 0, None, 0)
(18, 'description_long', 'TEXT', 0, None, 0)
(19, 'extracted_text', 'TEXT', 0, None, 0)
(20, 'tags', 'TEXT', 1, "'[]'", 0)
(21, 'confidence_flags', 'TEXT', 0, None, 0)
(22, 'notes', 'TEXT', 0, None, 0)
(23, 'created_at', 'TEXT', 1, None, 0)
(24, 'updated_at', 'TEXT', 1, None, 0)
```

`source_url` is column 1. No other URL-typed column exists.

`SELECT id, source_url, source_platform FROM artifacts WHERE id = 'MV-20260510-001';`:

```
{'id': 'MV-20260510-001', 'source_url': 'https://www.youtube.com/watch?v=7Lttb_59EYw', 'source_platform': 'youtube'}
```

For completeness, the full row (`SELECT * FROM artifacts WHERE id = 'MV-20260510-001';`):

```
'id': 'MV-20260510-001'
'source_url': 'https://www.youtube.com/watch?v=7Lttb_59EYw'
'source_platform': 'youtube'
'ingest_source': 'url-entry'
'ingest_date': '2026-05-10'
'storage_mode': 'url_only'
'local_asset_path': None
'thumbnail_path': None
'link_status': 'local-only'
'parent_artifact_id': None
'media_type': 'link'
'post_date': '2023-03-30'
'post_date_confidence': 'extracted'
'capture_date': '2026-05-10'
'status': 'vault'
'released_at': None
'released_by': None
'description_short': 'Hunter Root - Reverend (Official Music Video)'
'description_long': 'Hunter Root - Reverend (official). Album: arkansas.'
'extracted_text': 'Official music video for "Reverend" by Hunter Root\n\nVideo shot and edited by Acid Palms\n...'
'tags': '["author:hunter_root", "content_kind:official", "platform:youtube", "scope:hunter_root"]'
'confidence_flags': '[]'
'notes': '["suggest_pill: era:arkansas"]'
'created_at': '2026-05-10T10:07:10'
'updated_at': '2026-05-10T10:07:10'
```

For context (and to flush out a quirk noted below), the two child artifacts of `MV-20260510-001`:

```
{'id': 'MV-20260510-002', 'source_url': 'https://i.ytimg.com/vi/7Lttb_59EYw/maxresdefault.jpg', 'source_platform': 'youtube', 'media_type': 'photo', 'parent_artifact_id': 'MV-20260510-001', 'status': 'vault'}
{'id': 'MV-20260510-003', 'source_url': 'https://www.youtube.com/watch?v=7Lttb_59EYw',         'source_platform': 'youtube', 'media_type': 'text',  'parent_artifact_id': 'MV-20260510-001', 'status': 'vault'}
```

Note: there is no `media_type = 'youtube_video_page'`, nor any `artifact_kind` or similar discriminator beyond `media_type`. The parent (`media_type='link'`) carries the canonical `watch?v=…` URL. The thumbnail child (`media_type='photo'`) carries a different URL — the `i.ytimg.com/vi/<ytId>/…` URL, not a `watch?v=…` URL. The extracted-text child carries a duplicate `watch?v=…` URL.

(Aside: the sandbox-side `STATUS_ENUM` in `imgserver_extensions.py` line 81 is `{"vault", "released", "archived", "deleted"}` — drift from SPEC §4's `inbox|vault|released|deleted`. This is the same status-enum drift §4 of the spec already calls out and is independent of Q1.)

### Conclusion

The spec's assertion holds for the YouTube ingest's parent artifact: `MV-20260510-001` carries `https://www.youtube.com/watch?v=7Lttb_59EYw` in `artifacts.source_url`. The export's parsing step (SPEC_DRAFT_v2 §3.4 step 6, "Parse `source_url` to extract the YouTube `ytId`") works against this row.

Two caveats the spec should make explicit. First, the YT ingest produces three rows per video (parent + thumbnail child + text child), and only the parent's `source_url` is a `watch?v=…` URL — the thumbnail child's `source_url` is a `ytimg.com` thumbnail URL that would not parse to a `ytId` via a naïve "extract `v=` query param" step. The export filter therefore needs to either join on `parent_artifact_id IS NULL` or filter by `media_type='link'` (or by a `content_kind:` tag) to avoid double-counting and avoid the thumbnail-URL parse failure. Second, there is no separate `youtube_url`, `artifact_kind`, or `youtube_video_page` discriminator — the platform discriminator is a string in `source_platform`, and the artifact's role is encoded only in `media_type` + `parent_artifact_id` shape.

---

## Q2 — How does HR_CARDS join to ytId?

### HR_CARDS entry structure

`weird-baby-museum/src/routes/hr/hr_cards.js` is an adapter module. It does not declare its own data — it imports `HR_ARTIFACTS`, `HR_ARCHIVE`, and `HR_EXIT_FLOW` and maps each through one of three `…ToCardShape` adapters into a unified card object. The exported `HR_CARDS` array (lines 240–244) is the concatenation:

```js
export const HR_CARDS = [
  ...HR_ARTIFACTS.map((a, i) => hrArtifactToCardShape(a, i)),
  ...HR_ARCHIVE.map((a, i) => hrArchiveItemToCardShape(a, i)),
  ...HR_EXIT_FLOW.map((a, i) => hrExitFlowItemToCardShape(a, i)),
];
```

A representative output shape from `hrArtifactToCardShape` (lines 105–118):

```js
const base = {
  id, render,
  title: artifact.fact1 || "",
  meta: artifact.date,
  credit: artifact.credit || null,
  source: null, pull: null, sub: null, kind: null, lede: null,
  era: artifact.era,
  year,
  type: artifact.type,
  src: artifact.src,
  contentClass: "evidence",
  externalUrl,
  ...span,
};
```

There is no `ytId` field on the output. The closest related field is `externalUrl`, computed at lines 101–103:

```js
const externalUrl =
  artifact.postUrl || artifact.url || artifact.link || artifact.href ||
  (artifact.ytId ? `https://www.youtube.com/watch?v=${artifact.ytId}` : null);
```

This is *defensive* code — if a source entry has a `ytId`, it gets reconstructed into a watch URL. The `ytId` value is dropped from the output card; only the constructed URL string survives.

### Upstream data files

A representative `HR_ARTIFACTS` entry (`weird-baby-museum/src/data/hr_artifacts.js` lines 24–34):

```js
{
  date: "2012-10-12",
  era: "medusas",
  type: "video",
  src: "archive",
  fact1: "Wishful Thinking — first show footage. Chameleon Club, Lancaster PA.",
  fact2: "YouTube. Before they had a bassist. The '(1st show)' tag is right there in the title.",
  credit: null,
  color: "#14111c",
  icon: "🎬",
},
```

The schema header at the top of the file (lines 2–10) declares: `date / era / type / src / fact1 / fact2 / credit / color / icon`. No `ytId`. A grep across `hr_artifacts.js` finds exactly one `ytId` mention, at line 170, which is a misshapen track-style entry that was apparently merged into the file and does not match the documented `HR_ARTIFACTS` schema:

```js
      { title: "My Brother's Bones", videos: [{ ytId: "wi5G_Zn74gc", label: "Official Music Video", type: "official" }] }
,
```

Standard `HR_ARTIFACTS` entries do not carry `ytId`. (This stray entry is also worth noting as a small data-cleanliness issue, but it does not change the join story — even if read, it would fail to provide `fact1`, `era`, `date`, etc.)

A representative `HR_ARCHIVE` entry (`hr_archive.js` lines 24–33):

```js
{
  date: "2012-06-01",
  era: "medusas",
  src: "archive",
  type: "historical",
  fact1: "Medusa's Disco formed — Lancaster, Pennsylvania. June 2012.",
  fact2: "Hunter Root and Wynton Huddle started playing together in Wynton's dad's living room. Acoustic first, then a four-piece. First song they played together: Strange Chemistry.",
  color: "#12101a",
  icon: "🎸",
},
```

The schema header (lines 2–10) declares: `date / era / src / type / fact1 / fact2 / color / icon`. No `ytId`. A grep across `hr_archive.js` finds zero `ytId` mentions.

A representative `HR_EXIT_FLOW` entry (`hr_exit_flow.js` lines 12–16):

```js
{
  date: "2026-04-01", era: "solo", type: "quick", src: "archive",
  color: "#13110d", icon: "⚡",
  fact1: "Playing music since he was twelve. Founding member of Medusa's Disco before going solo.",
},
```

Schema (header lines 1–6): `quick / deep / highlight` cards with `date / era / type / src / color / icon / fact1` (and optional `fact2`). No `ytId`. A grep across `hr_exit_flow.js` finds zero `ytId` mentions. The adapter `hrExitFlowItemToCardShape` (lines 204–237) hard-codes `externalUrl: null` for these by design (line 224, comment: "exit-flow entries are curatorial commentary ('voice'), not artifacts pointing outside the museum").

### SPINE track → ytId structure

`weird-baby-museum/src/data/artists/hunter-root.js` is the canonical SPINE. The Reverend track (line 96) — i.e. the song corresponding to MV's `MV-20260510-001` test artifact — is:

```js
{ title: "Reverend", videos: [{ ytId: "7Lttb_59EYw", label: "Official Music Video", type: "official" }] },
```

A multi-video example (Town Rat Heathen, lines 91–95):

```js
{ title: "Town Rat Heathen", videos: [
  { ytId: "n2m8sP17E-c", label: "Official Music Video", type: "official" },
  { ytId: "omU0Xt3yB-o", label: "Live @Rok10productions", type: "live" },
  { ytId: "T0cdoRZ5LXg", label: "Early Version", type: "live" },
]},
```

The full SPINE shape (per the playbook in `weird-baby-museum/CLAUDE.md`): `{ id, title, year, art, accent, tracks: [{ title, videos: [{ ytId, label, type, credit? }] }] }`. SPINE is consumed by `Exhibit.jsx` (the coverflow + tracklist + video player surface), not by `HR_CARDS` or by the deck. `hr_cards.js` does not import `hunter-root.js`.

### Conclusion

`HR_CARDS` does not carry a `ytId` field, directly or by aliasing. The card object produced by every adapter has no key matching the export's `ytId` keying. The defensive `artifact.ytId ? watch-URL : null` line in `hrArtifactToCardShape` and `hrArchiveItemToCardShape` finds no `ytId` to act on in any standard `HR_ARTIFACTS` / `HR_ARCHIVE` / `HR_EXIT_FLOW` entry as the data exists today.

Joining MV's `deep-tags.json` (keyed by `ytId`) into `HR_CARDS` is therefore a multi-hop operation, not a direct field match. The available paths are: (a) join `ytId` against `SPINE.tracks[].videos[].ytId` to find a `(albumId, trackTitle)` pair, then surface tags on the *track*, not on a card — but `HR_CARDS` is not track-keyed, so this doesn't reach the deck's filter input; or (b) extend the source data files (`HR_ARTIFACTS`, `HR_ARCHIVE`) to actually carry `ytId` on the entries that correspond to YouTube videos, then propagate that `ytId` through the adapters into the card shape so a direct join becomes possible. Today neither path is wired. The spec needs to choose one explicitly.

---

## Implications for the spec

§3.4 step 6 ("Parse `source_url` to extract the YouTube `ytId` (the museum's primary key)") is correct in its first half — `source_url` is the right column — but it should add the filter detail noted in Q1's conclusion: the YT ingest produces a parent + two children, and only the parent (`media_type='link'` with `source_platform='youtube'` and `parent_artifact_id IS NULL`) carries a parseable `watch?v=…` URL. The thumbnail child's `source_url` is an `i.ytimg.com` URL that won't parse as a `watch?v=…` query string.

§3.5 step 6 ("`HR_CARDS` … needs a `deep` field per card carrying the array of tags for that video") understates the problem. As the data exists today, `HR_CARDS` cannot be joined to MV's `ytId`-keyed export at all without first getting `ytId` onto the card shape. The spec should call out either (i) Phase 1 must add `ytId` to relevant entries in `HR_ARTIFACTS` / `HR_ARCHIVE` and propagate it through the adapters to `HR_CARDS`, or (ii) the museum-side join target is the SPINE (`tracks[].videos[].ytId`), not `HR_CARDS`, in which case the deck's filter input shape needs to change as well — which is a larger architectural shift than §3.5 currently acknowledges. Until that choice is made, "the museum's existing data files meet the export" is not a true statement.
