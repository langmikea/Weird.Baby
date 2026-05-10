# Priority 4B — Card-to-YouTube rendering verification

**Date:** 2026-05-10
**Scope:** Read-only verification of how HR_CARDS entries connect to YouTube videos today.

## How HR_CARDS gets rendered

`HR_CARDS` is exported from `src/routes/hr/hr_cards.js:240-244` and is consumed by exactly one component: `HrExhibitFlow.jsx` (the deck). A repo-wide grep for `HR_CARDS` finds no other importers — `Exhibit.jsx`, `HrHome.jsx`, `HrSpine.jsx`, `HrFanWall.jsx`, `HrMedia.jsx`, and `HrArchive.jsx` do not consume it.

Inside `HrExhibitFlow.jsx`, `HR_CARDS` is used at:

- `:47` — import.
- `:119` — random ID sample for journal placeholder seed.
- `:526`, `:910`, `:1416–1433`, `:1419`, `:1523`, `:1687` — counts and filter math (no per-card rendering; just `.length`, `.filter`, and `.map(c => c.id)` aggregation).
- `:961`, `:1035`, `:1015`, `:1675` — passed as `items` into `PillGroupColumn` / `countForPill` for filter-pill counts (no rendering of card visuals).
- `:1523` — the actual filter that produces `tagFiltered` (then `finalMatched`), which is rendered by `P3Panel` at `:1687`.

`P3Panel` (`:905–941`) iterates the filtered array and renders each entry through a single dispatcher:

```jsx
{matched.map(card => <ArtifactCard key={`${filterKey}-${card.id}`} card={card} />)}
```

`ArtifactCard` (`:845–902`) is the only component that materializes a card. It dispatches by `card.render` (not `card.type`):

```jsx
switch (card.render) {
  case "photo":   inner = <PhotoCard card={card} />;   break;
  case "art":     inner = <ArtCard card={card} />;     break;
  case "video":   inner = <VideoCard card={card} />;   break;
  case "press":   inner = <PressCard card={card} />;   break;
  case "essay":   inner = <EssayCard card={card} />;   break;
  case "session": inner = <SessionCard card={card} />; break;
  default: inner = null;
}
```

The fields each per-render component reads (verbatim from `:756–842`):

- `PhotoCard` — `card.title`, `card.meta`, `card.credit`.
- `ArtCard` — `card.title`, `card.credit`, `card.meta`.
- `VideoCard` — `card.isLive`, `card.duration`, `card.title`, `card.meta`, `card.isCover`, `card.credit`.
- `PressCard` — `card.source`, `card.pull`, `card.sub`.
- `EssayCard` — `card.kind`, `card.title`, `card.lede`, `card.credit`.
- `SessionCard` — `card.title`, `card.meta`.

The `card.type` field (the raw `"video" | "photo" | "poster" | …` from the source data) is **only** read by the filter math (`matchFilter` and `countForPill`); no render component reads it directly. Render selection happens via `card.render`, which the adapter assigns from `ARTIFACT_TYPE_TO_RENDER[artifact.type]` (`hr_cards.js:80–88`).

## How `type: "video"` cards get handled specifically

For an HR_ARTIFACTS entry with `type: "video"`, the adapter sets `render: "video"` (`hr_cards.js:81`). `ArtifactCard` dispatches to `VideoCard` (`HrExhibitFlow.jsx:787–804`):

```jsx
function VideoCard({ card }) {
  return (
    <>
      <div className="hr-card-video-vis">
        {card.isLive && <div className="hr-card-video-live">live</div>}
        <div className="hr-card-video-play">
          <div className="hr-card-video-play-tri" />
        </div>
        {card.duration && <div className="hr-card-video-dur">{card.duration}</div>}
      </div>
      <div className="hr-card-foot">
        <div className="hr-card-title">{card.title}</div>
        {card.meta && <div className="hr-card-meta">{card.meta}</div>}
        {card.isCover && card.credit && <div className="hr-card-credit">— {card.credit}</div>}
      </div>
    </>
  );
}
```

What this renders to the visitor: a static decorative tile — a solid placeholder block (`.hr-card-video-vis`), a CSS triangle (`.hr-card-video-play-tri`) drawn to look like a play button, an optional "live" badge if `card.isLive` is set, an optional duration string if `card.duration` is set, then the title, meta (date), and an optional credit line (only if `card.isCover` is also true).

It does **not** embed a YouTube iframe. It does **not** read any YouTube ID. It does **not** open a player. The `card.isLive`, `card.duration`, and `card.isCover` props are read but the HR adapters never set them — they are residue from the prototype's card shape, so the live badge / duration / cover credit branches are dead code on real HR data.

The clickability layer is entirely separate from `VideoCard` and lives in `ArtifactCard` (`:881–894`): if `card.externalUrl` is truthy, the inner `VideoCard` JSX gets wrapped in `<a href={card.externalUrl} target="_blank" rel="noopener noreferrer">` plus a `↗` chevron. So a video-type card connects to YouTube only through that wrapper, only when `externalUrl` is non-null.

The YouTube ID, when one is computed, comes from the adapter at `hr_cards.js:101–103` reading `artifact.ytId` at the **top level** of the artifact entry — not from `videos[].ytId` (that nested shape is the SPINE's, and the artifact adapter does not look there).

## What `externalUrl` is used for

A repo-wide grep for `externalUrl` finds it referenced in three source files: `hr_cards.js` (where it is set), `HrExhibitFlow.jsx` (the only consumer), and `HrExhibitFlow.css` (styles for the resulting `<a>` element). No other component or route reads it.

The single consumer is `ArtifactCard` in `HrExhibitFlow.jsx`:

- `:851` — `const isLink = !!card.externalUrl;` — a card is clickable iff `externalUrl` is truthy.
- `:863` — `isLink ? "hr-card-link" : null` — applies the `.hr-card-link` class (cursor + hover styles in `HrExhibitFlow.css:147–171`).
- `:878–880` — when `isLink`, renders a `↗` chevron inside `<span className="hr-card-link-arrow">`.
- `:881–894` — when `isLink`, returns the card as `<a className={...} style={...} href={card.externalUrl} target="_blank" rel="noopener noreferrer">{inner}{badge}{chevron}</a>` instead of the default `<div>{inner}{badge}</div>`.

That's the full extent of `externalUrl`'s use: it controls whether `ArtifactCard` renders an anchor, and the anchor opens the URL in a new tab. Nothing else reads it. There is no in-app player, no preview, no thumbnail fetched from the URL — just an outbound link.

## A representative `type: "video"` entry in real data

From `src/data/hr_artifacts.js:24–34`, the first entry with `type: "video"`:

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

A second representative entry, `:93–103`:

```js
{
  date: "2023-02-03",
  era: "solo",
  type: "video",
  src: "archive",
  fact1: "Town Rat Heathen — official music video. The one that changed everything.",
  fact2: "Published February 3, 2023. It spread person to person before the algorithm caught up. 4.5 million views.",
  credit: null,
  color: "#1c1610",
  icon: "🔥",
},
```

Fields these entries carry that could identify a specific YouTube video: **none.** No `ytId`, no `postUrl`, no `url`, no `link`, no `href`. The `fact1` / `fact2` strings *describe* the video in prose (e.g. "Wishful Thinking — first show footage", "Town Rat Heathen — official music video") but do not contain any machine-readable YouTube reference. Every `type: "video"` entry in `HR_ARTIFACTS` (and indeed every entry across `HR_ARTIFACTS`, `HR_ARCHIVE`, and `HR_EXIT_FLOW` — verified by grep on the data files) lacks all five URL-shaped fields. The adapters' `externalUrl` resolution chain therefore short-circuits to `null` on every entry today.

There is one anomaly worth flagging: `hr_artifacts.js:170` contains a stray entry shaped like a SPINE track, not an artifact:

```js
{ title: "My Brother's Bones", videos: [{ ytId: "wi5G_Zn74gc", label: "Official Music Video", type: "official" }] }
```

This entry has no `date`, no `type` (so the adapter falls through to `render: "session"`), and the `ytId` lives at `videos[0].ytId` — the artifact adapter only checks top-level `artifact.ytId`, so even this stray entry's `externalUrl` resolves to `null`. It renders as a `SessionCard` with title "My Brother's Bones" and no link.

The 1.5d phase report (`PHASE_1_5D_REPORT.md`) describes a final distribution of "6 with URL, 50 null" across 56 cards — it counts 2 HR_ARTIFACTS and 3 HR_ARCHIVE cards getting a constructed YouTube URL via the `ytId` fallback, plus 1 HR_ARCHIVE `postUrl`. That report does not match the current state of the data files: a fresh grep finds zero `postUrl` and zero top-level `ytId` fields anywhere under `src/data/`. Either the data was reverted after 1.5d ran, or the report described an in-flight state that didn't land. Today's runtime distribution is **0 with URL, 56 null** (or whatever the current `HR_CARDS` length is — the point is uniformly null).

## Relationship between deck cards and Exhibit.jsx's SPINE-driven video rendering

The two surfaces are fully separate at the data layer. `Exhibit.jsx` does not import `HR_CARDS`, `HR_ARTIFACTS`, `HR_ARCHIVE`, or `HR_EXIT_FLOW` (grep confirms). It consumes `artist.spine` (`Exhibit.jsx:490`) and reads `SPINE[albumIdx].tracks[ti].videos[vi].ytId` to drive its YouTube IFrame player via `yt.loadVideo(v.ytId)` (`:589`) and to render thumbnails as `https://img.youtube.com/vi/${thumbVid.ytId}/hqdefault.jpg` (`:772`).

The deck (`HrExhibitFlow`) is rendered as a sibling inside Exhibit's layout at `Exhibit.jsx:803–804`:

```jsx
{/* EXHIBIT FLOW — optional, only rendered if artist provides one */}
{ExhibitFlow && <ExhibitFlow activeAlbumId={album.id} />}
```

It receives exactly one prop, `activeAlbumId`, and `HrExhibitFlow.jsx:1483` explicitly discards it (`void activeAlbumId;` — comment notes it's accepted for prop-shape compatibility but unused in v1). The deck does not call back into Exhibit, does not have access to `yt.loadVideo`, and there is no shared event bus. Clicking a card never triggers Exhibit's player. A clickable card (when one exists) opens YouTube in a new tab via the browser, completely outside Exhibit's player state.

There is no shared rendering code: `Exhibit.jsx`'s YT player div (`<div ref={ytDivRef} className="yt-player" />`) and the deck's `VideoCard` placeholder tile share no component, no CSS class, and no helper function.

## Honest answer to the question

A card today does **not** connect to a specific YouTube video in any meaningful way. The connection is at best **indirect by design** — `ArtifactCard` will wrap a card in an outbound `<a target="_blank">` if `card.externalUrl` is non-null, and the adapter will compute that URL from a top-level `ytId` field on the source entry (or from `postUrl` / `url` / `link` / `href`) — but in the current data **none** of those fields are populated on any HR_ARTIFACTS, HR_ARCHIVE, or HR_EXIT_FLOW entry, so every card resolves to `externalUrl: null` and renders as a non-clickable `<div>`. A `type: "video"` card specifically renders through `VideoCard`, which is a static decorative tile with a CSS-drawn play triangle and the artifact's title and date — no embed, no YouTube ID, no link. The deck and `Exhibit.jsx`'s SPINE-driven YouTube player are fully separate surfaces that share no code path; a card click cannot reach the player. The infrastructure for a card → YouTube link exists (the `externalUrl` plumbing and the `ytId`-fallback adapter logic), but the data side of the contract is not held up: `HR_ARTIFACTS` entries describe their videos in prose but carry no field that identifies which YouTube video they are about.
