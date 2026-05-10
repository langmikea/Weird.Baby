# Priority 4C — Card identity verification

**Date:** 2026-05-10
**Scope:** Read-only verification of how HR_CARDS entries are uniquely identified.

## How each adapter constructs `id`

All three adapters live in `src/routes/hr/hr_cards.js`. Each builds `id` from a fixed string prefix, the array index passed in from the caller, and the source entry's `date` field. None of them consult any explicit identifier on the source entry — there isn't one to consult (see next section).

### hrArtifactToCardShape

```js
export function hrArtifactToCardShape(artifact, idx = 0) {
  const id = `art-${idx}-${artifact.date}`;
```
(`hr_cards.js`, lines 90–91)

Derivation: `art-` prefix + zero-based position of the artifact in `HR_ARTIFACTS` + ISO date string from `artifact.date`. Example: the entry dated `2012-10-12` that sits first in the array becomes `art-0-2012-10-12`.

### hrArchiveItemToCardShape

```js
export function hrArchiveItemToCardShape(item, idx = 0) {
  const id = `arc-${idx}-${item.date}`;
```
(`hr_cards.js`, lines 152–153)

Derivation: same pattern, `arc-` prefix + position in `HR_ARCHIVE` + the entry's `date`. Example: the first archive entry (`date: "2012-06-01"`) becomes `arc-0-2012-06-01`.

### hrExitFlowItemToCardShape

```js
export function hrExitFlowItemToCardShape(item, idx = 0) {
  const id = `exit-${idx}-${item.date}`;
```
(`hr_cards.js`, lines 204–205)

Derivation: same pattern, `exit-` prefix + position in `HR_EXIT_FLOW` + the entry's `date`. Example: the first exit-flow entry (`date: "2026-04-01"`) becomes `exit-0-2026-04-01`.

The index argument is supplied by the `HR_CARDS.map((a, i) => …)` calls at the bottom of the file:

```js
export const HR_CARDS = [
  ...HR_ARTIFACTS.map((a, i) => hrArtifactToCardShape(a, i)),
  ...HR_ARCHIVE.map((a, i) => hrArchiveItemToCardShape(a, i)),
  ...HR_EXIT_FLOW.map((a, i) => hrExitFlowItemToCardShape(a, i)),
];
```
(`hr_cards.js`, lines 240–244)

So the `idx` portion of every card id is literally the entry's position in its source array at module-load time.

## Whether source entries carry their own `id`

No. `grep '^\s*id:'` against each of the three source files returns zero matches — none of the entries declare an `id` field.

The schemas (from the header comments in each file) are:

- **HR_ARTIFACTS** (`src/data/hr_artifacts.js`): `date`, `era`, `type`, `src`, `fact1`, `fact2`, `credit`, `color`, `icon`. Sample entry:
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

- **HR_ARCHIVE** (`src/data/hr_archive.js`): `date`, `era`, `src`, `type`, `fact1`, `fact2`, `color`, `icon`. Sample entry:
  ```js
  {
    date: "2012-06-01",
    era: "medusas",
    src: "archive",
    type: "historical",
    fact1: "Medusa's Disco formed — Lancaster, Pennsylvania. June 2012.",
    fact2: "Hunter Root and Wynton Huddle started playing together in Wynton's dad's living room. …",
    color: "#12101a",
    icon: "🎸",
  },
  ```

- **HR_EXIT_FLOW** (`src/data/hr_exit_flow.js`): `date`, `era`, `type`, `src`, `color`, `icon`, `fact1`, optional `fact2`. Sample entry:
  ```js
  {
    date: "2026-04-01", era: "solo", type: "quick", src: "archive",
    color: "#13110d", icon: "⚡",
    fact1: "Playing music since he was twelve. Founding member of Medusa's Disco before going solo.",
  },
  ```

In every case, `id` is **derived at build time by the adapter**. It is not authored on the source entry.

Side note worth recording for Deep Dive: `HR_EXIT_FLOW` already contains intentionally duplicated `date` values disambiguated only with a trailing letter — `"2026-04-08"`, `"2026-04-08b"`, `"2026-04-08c"`, `"2026-04-08d"`, `"2026-04-08e"`. This is the existing pattern Mike uses when more than one card needs to share a calendar day. `date` alone is therefore not a unique key on the source side; `date` is only made unique by these manual suffixes, which the operator must maintain by hand.

## Stability analysis

The id is **not stable** across either of the changes an editor is most likely to make.

- **Across rebuilds, with source unchanged:** stable. The map order is deterministic, `idx` is fixed, `date` is fixed, so the same source entry produces the same id on every build. Good.
- **Across source-data reordering:** unstable. The `idx` component is the array position. Inserting a new artifact at the top of `HR_ARTIFACTS`, or rearranging entries chronologically, shifts every later entry's index and therefore changes every later card's id. The exact same content gets a new id.
- **Across content edits to `date`:** unstable. Because `date` is concatenated into the id, fixing a typo'd date (e.g. `2026-04-09` → `2026-04-19`) changes the id even if nothing else moved. Edits to `fact1`, `fact2`, `era`, `type`, `src`, `credit`, `color`, `icon` leave the id untouched.
- **Across content edits other than `date`:** stable. The id ignores everything except prefix + position + date.

In the three-way model from the task brief, this is the **"derived from array index"** model — with `date` mixed in. The date component does not rescue stability; it just makes the id slightly more readable. The index is the load-bearing part, and the index is fragile.

There is also no uniqueness guarantee enforced anywhere. Nothing checks that two source entries don't produce the same id. In practice the prefix segregates the three sources, and the operator-maintained date suffixes in `HR_EXIT_FLOW` keep dates unique within that file — but this is convention, not code.

## What the deck actually uses to identify cards

Two places in `src/routes/hr/HrExhibitFlow.jsx` reference `card.id`:

1. **The "Surprise me" preset** (lines 117–122):
   ```js
   apply: () => {
     const ids = HR_CARDS.map(c => c.id).sort(() => Math.random() - 0.5).slice(0, 3);
     return { __randomIds: new Set(ids) };
   },
   ```
   `matchFilter` then re-checks selection via `selected.__randomIds.has(item.id)` (line 387). This is a same-session in-memory lookup — the ids only need to be stable for the lifetime of the loaded module, which they are.

2. **The grid render** (line 937):
   ```jsx
   {matched.map(card => <ArtifactCard key={`${filterKey}-${card.id}`} card={card} />)}
   ```
   The React `key` is *deliberately* not just `card.id`. It is composed of `filterKey` (a joined string of all currently-matched card ids, computed at line 906) prefixed onto `card.id`. The intent is the opposite of what React keys are usually for: every filter change recomputes `filterKey`, which forces every card to remount and re-trigger its `card-fade-in` animation. So the codebase is not relying on `card.id` as a stable React identity; it is treating remounts as a feature.

Nothing in the deck looks cards up by `date + era`, `title`, or any other combination of source fields. There is no card-lookup-by-natural-key surface anywhere. There is also no persisted store of card ids (no `localStorage`, no URL state, no scheduled-task payload that pins a card by id) — every reference to `card.id` is reconstructed from `HR_CARDS` at runtime, in the same process that just built `HR_CARDS`.

Search confirmed `HR_CARDS` / the three adapter exports are referenced only in `hr_cards.js` itself, `HrExhibitFlow.jsx`, and a single comment in `hr_dimensions.js`. There is no second consumer to disagree with the deck's view.

## Honest answer

There is no stable identifier today that an external system could safely use to attach Deep Dive tags to a specific card. The `id` field on `HR_CARDS` entries is the string `${prefix}-${idx}-${date}`, where `idx` is the entry's position in its source array at module-load time. That id is reproducible for a given source-file state, but it changes the instant anyone reorders, inserts, or removes an entry in `hr_artifacts.js`, `hr_archive.js`, or `hr_exit_flow.js` — and it also changes if anyone edits the entry's `date`. The source entries themselves carry no explicit identifier, and the deck never looks cards up by any natural-key combination of fields. The closest thing to a stable handle today is the tuple `(source-file, fact1)` — `fact1` is required on every entry and is content-bearing enough to be unlikely to collide — but this is not enforced as unique and would still break on a `fact1` rewrite. For Deep Dive's MediaVault export to attach tags durably, a stable identifier needs to be **added** at the source: either an authored `id` on every entry in the three data files, or a content-hash assigned by the build that gets persisted back. Until that exists, any export keyed on today's `HR_CARDS.id` will silently re-bind to the wrong card the next time Mike reorders or edits a source file.
