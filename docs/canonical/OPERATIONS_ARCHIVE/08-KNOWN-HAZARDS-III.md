> Cut from `docs/canonical/OPERATIONS.md` §8 Known hazards (third cut), at HEAD `35f805b`.

# §8 KNOWN HAZARDS — THE THIRD CUT

**THIS IS A SIBLING OF `08-KNOWN-HAZARDS.md` AND `08-KNOWN-HAZARDS-II.md`, NOT A
REPLACEMENT FOR EITHER.** §0 rules an archive a snapshot cut at a named HEAD and
never edited to track the ground state. The first cut was taken at `b3812cc`, the
second at `2f94fd7`; both stay exactly as they were. **Three snapshots, each true
of its own moment, none edited to agree with the others.**

**WHAT SAID WHEN, AND IT IS THE MECHANISM WORKING RATHER THAN A TIDY-UP.** The
ceiling did. The epoch round of 2026-08-28 added a standing DEPLOY note to §0 and
one hazard to §8 and took the ground state from **39,690 to 43,186 bytes** — 108%
of the 40,000 ceiling, `npm run ops:size` FAIL, with the remedy this file is
printed in the failure. §8's own preamble had already said this would be the
shape: *bodies accumulate here and a cut moves them; the ceiling is what says
when.*

**WHY THESE THREE AND NOT OTHERS:** §8 publishes the arithmetic — about **848
bytes for a bodied entry against 102 for a lead-only one** — and these were the
only three bodied entries left in §8. Everything else there is already a lead
line. The lead line of each of these is still in §8, which is the index that
tells a session there is something here to open.

---

## The bodied entries cut out of §8

- **A PUBLISH SCOPE RESOLVED FROM CODE REACHABILITY IS NOT THE SAME QUESTION AS THE LAW THAT GOVERNS THE CONTENT, AND ON 2026-08-22 ONLY THE FIRST WAS ASKED (2026-08-25).** `efc379f` moved eight files out from behind the stage door, **six of them photographs of the physical unit.** It was scoped properly by every measure this repo owns: `docs/MUSEUM_PORTAL_PUBLISH_SCOPE-20260821.md` names each file with its byte count, resolves the set from `portal.js` and `twin.html`'s loader ladder, states *"the move is per-file, so nothing rides along unless it is named"*, and puts the hard half — *"said plainly: it publishes MGK-VIIIp"* — to Mike rather than inferring it. **AND THE OBFUSCATION LAW WAS NEVER OPENED:** grep both Portal documents for `obfuscation | article [1-5] | silhouette | law` and you get **zero hits**. That law is the robots repo's `docs/canonical/OBFUSCATION_LAW.md` and its authority clause is exactly this material — *"every image, clip, still, plate, thumbnail, poster, share card and preview the museum publishes of a physical MGK unit."* Its Articles 1–3 (silhouette · cut at a joint · reveal economy) are visual judgements and are **Mike's eye, which is the point**: nobody put the pictures in front of him under that law. **MIKE RULED IT 2026-08-25 — RULING A: a visitor sees the real machine; photographs of the hardware stay public; the six stand.** **THIS ENTRY EXISTS BECAUSE THE ANSWER WAS YES.** A scope that asks *what does the code reach for* and never *what is this material* returns the right file list and the wrong question, and the next time the answer will not be yes. The reachability walk is necessary and it is not sufficient; the law is a second pass and it has an owner who is not Ops.

- **`CF-Cache-Status` IS APPENDED BY THE ASSET WORKER, NOT BY THE ZONE CDN, AND READING IT AS THE EDGE'S VERDICT PUT A DISPROVED CLAIM IN A PUSHED COMMIT (2026-08-24).** The class this section already names, with the instrument being a HEADER: it returns `HIT` about the asset store's own lookup and cannot see the edge at all, so it answers a question nobody asked it and looks like an answer to the one they did. **THE MEASUREMENT THAT SETTLED IT:** two fetches of `https://weird.baby/` **3.2 seconds apart, both reading `CF-Cache-Status: HIT`, with `__WB_NOW__` differing by exactly 3.2 seconds** — the worker ran both times, so the HTML is NOT edge-cached and a deploy takes effect on the next request. A cache-busted URL reads `HIT` too, which is the tell. The header is appended at `asset-worker/index.js:5078`, inside the bundle this repo ships. **`e08e2b4`'s COMMIT MESSAGE STATES THE DISPROVED VERSION** — that it proved the edge caches worker responses — and a pushed message cannot be rewritten, so the correction lives here and this line is the one that is true. **`5acff0e`'s MARKS REMAIN CORRECT ON THEIR OWN REASONING, WHICH NEVER DEPENDED ON THIS:** a cookie-decided body was leaving with `Cache-Control: public`, which is wrong for any browser or shared proxy, and that was established from the code rather than from a probe. **AND THE PRACTICAL CONSEQUENCE IS A DEPLOY STEP THAT IS NOT NEEDED:** no cache purge for HTML. What this does NOT establish is the same for images — HTML carries a per-request `__WB_NOW__` to diff and an image carries no such marker, so that half is unmeasured rather than proven either way.

---

## MOVING THE EPOCH DOES NOT MAKE THE SAVED DRAFT STALE, AND `record:land` WOULD LAND IT AS NEGATIVE DAYS (2026-08-28)

- **With the saved draft on the old epoch, `npm run record:land` emits `recordDay(-6)`…`(-2)` — the five Records dated a week BEFORE day one, and `entryWeek()` silently drops `Week 1` from the dateline rather than erroring.** The `--write` staleness guard reads `robots-record.js` only and never consults `record-epoch.js`, **so an epoch move on its own does not trip it**; on 2026-08-28 it refused only because that round also touched the entries file. Until it is ruled: **after moving the epoch, open the day editor and save before anybody runs `record:land -- --write`.** Body: `OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS-III.md`, and in full at the site in `tools/dictation/emit-record-entries.mjs`.

**THE MEASUREMENT, IN FULL.** `tools/dictation/emit-record-entries.mjs` measures
each drafted entry's own date against the TREE's epoch and emits
`recordDay(<that index>)`. `docs/dictation-20260807/record-draft.json` was saved
2026-08-26 against `RECORD_EPOCH = 2026-08-31`; Ruling D moved the tree to
2026-09-07 and left the draft alone. A dry `npm run record:land` then printed:

```
{ no: 1, date: recordDay(-6),   through   { no: 5, date: recordDay(-2),
```

— the five Records dated 31 Aug – 4 Sep, a week before day one, which is the
epoch move being undone by a file nobody thinks of as a date source.

**WHAT IT COSTS ON THE GLASS, MEASURED RATHER THAN GUESSED.** `entryWeek()` in
`src/lib/record-model.js` returns `null` for any date before the epoch — its own
line reads *"before day one is not week zero"* — so the dateline **drops `Week 1`
and prints `Monday · Record 001`**. Nothing throws. Nothing warns. No gate counts
it.

**THE GUARD THAT EXISTS DOES NOT COVER IT.** `--write` refuses a draft saved
before the Record last moved, and `treeMovedAt()` consults
`src/data/artists/robots-record.js` and its git log and **nothing else**.
`record-epoch.js` is not in it. On 2026-08-28 the refusal fired — but only
because that round also added a comment to `robots-record.js`. **Luck, and named
as luck.**

**NOT FIXED, AND THE REASON IS THAT IT MAY NOT BE A DEFECT.** The emitter's own
header rules that **the entry's own day is the authority** — on that reading,
preserving Mike's drafted days across an epoch move is this function working. On
the other reading, D1's whole rule is that one line moves and EVERYTHING follows.
**Those two rules genuinely disagree here, and which one wins is Mike's call
rather than a typo correction.**
