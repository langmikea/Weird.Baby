# Keystone fix — render checklist for Mike

**Status: built + pre-tested. NOTHING committed/deployed. Awaiting your render + approval.**

Session 2026-06-16 · Repo HEAD `c0f4955` · file: `src/routes/hr/HrExhibitFlow.jsx`
Backup: `src/routes/hr/HrExhibitFlow.jsx.pre-keystone-nullexempt` (restore point)

## What shipped (the surgical diff — 14 insertions, 1 deletion)

In `matchFilter`, the null-handling branch changed from strict-everything to null-exempt for partial facets:

```js
// before
if (!Array.isArray(arr)) return false;
// after
if (!Array.isArray(arr) || arr.length === 0) {
  if (PARTIAL_FACETS.has(key)) continue;   // partial: exempt
  return false;                            // total: reject
}
```

Plus one module const: `const PARTIAL_FACETS = new Set(DETAIL_PARTIAL_KEYS);`

**Decision worth your eye:** I did **not** hardcode the brief's literal set `{source, venue, people, album, song}`. I reused the codebase's existing partial list `DETAIL_PARTIAL_KEYS = ["album","source","people"]` — the same set the Detail zone renders. This is the name-confirmed, single-source-of-truth set. Confirmed against live data: `people` (not the reference's `person`) is correct, and `venue`/`song` are not live namespaces at all, so they're functionally irrelevant. Reusing the constant means the matcher and the UI can never drift apart.

## Two things I changed course on vs. the brief

1. **Facebook tourniquet (§4): KEPT, not removed.** The brief's preferred option was to remove the L94–102 append. I verified in the data that `source==facebook` exists **only** because of that hack — raw data has zero. Removing it would delete the Facebook source pill entirely (a visible membership change), so per the brief's fallback I kept it as a pure engine fix. Flagged safe-to-remove-later, but it needs a real `facebook` source tag in MV first.
2. **Data-count nit:** the brief says "13 FB clips with no source + 3 cross-posted." Live data is actually **14 with no source + 2 cross-posted** (tiktok, instagram). Doesn't change the logic; flagging for accuracy.

## ⚠️ FUSE-truncation phantom — it happened, and I caught it

The documented grown-file truncation fired on the first write: the edit added 13 lines, but the file was capped at its original byte length (183416) and the tail sheared off mid-token at L4012 → parse error. I rebuilt the full file from the backup through the sandbox mount; it now writes at the correct size (184240 bytes, 4031 lines, tail intact). **Verify the tail on host** before you trust it (see check 0 below).

## Pre-test results (all green, against live `hunter_root.json`, 33 artifacts)

- Album (partial): OLD kept **3** → NEW keeps **22** (19 album-less artifacts now exempt, not amputated). The 33→3 collapse is fixed.
- Era / content_kind (total): strict, **identical OLD vs NEW** — totals did not become exempt.
- Source=facebook: 16 pill members intact **+** 10 source-less exempt = 26.
- People (1/33 partial): people-less artifacts exempt.
- Cross-facet (total AND partial): total strict + partial exempt combine correctly.
- Clear → all 33 return.
- Full regression sweep over every single-pill selection: **no total facet changed**; partials only ever keep ≥ before.
- eslint: back to committed baseline (parse error gone; only the 2 pre-existing react-hooks errors + 2 pre-existing warnings remain).

## Your host checks

0. **Tail intact:** `tail -3 src/routes/hr/HrExhibitFlow.jsx` ends with `</section>` `);` `}` — not mid-token.
1. `npm run dev`, open `/hr`.
2. Open the filter pop-over → toggle a **partial** (Album or Source). The wall should **scope, not collapse** — artifacts lacking that facet stay on the wall.
3. Toggle a **total** (Kind / Era / Format). It should stay **strict** — items without that value drop out.
4. Total + partial together: total filters strictly, partial only narrows its own population.
5. Clear → all artifacts return; pill counts reflect the new logic.
6. Facebook source pill still shows its 16 embeds.

## If approved

`git add src/routes/hr/HrExhibitFlow.jsx` and commit. Then the backup `.pre-keystone-nullexempt` can be deleted. This is live-site-affecting (Detail zone is public) — nothing goes out until you say so.
