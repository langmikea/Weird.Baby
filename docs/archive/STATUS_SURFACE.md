<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# STATUS_SURFACE.md (v0.1)

**Filed:** 2026-04-26 (Phase 2 build, system review bite 9)
**Status:** locked
**Status set:** 2026-04-30 (v46 reconciliation: controls-surface tab labels + watch-list pruning per v46 close brief)
**Type:** Curated state-of-things readout. Hand-maintained.
**Predecessor design:** `docs/PHASE2_STATUSSURFACE_DESIGN.md` v0.1.
**Companion files:** `STATE.md`, `docs/PROCESS_NOTES.md` (close-brief template), `docs/PHASE1_PREFLIGHT_DESIGN.md`.

---

## What this is

The status surface answers one question for each museum component: *where is live, where is prototype, where is spec, and is the drift between them legible.* It exists to close the v32 lane-confusion failure mode — Bit-Man treating one lane (usually live) as ground truth without naming the choice.

The surface makes lanes legible. Lane *selection* (which lane to anchor a given question to) stays human judgment.

Read order: scan the drift column. Empty drift → no surface attention needed. Non-empty drift → the row earns its read; expanded form lives below the table.

**Mode:** active. Lifecycle states: active / monitoring / mothballed. Same shape as pre-flight. Mode is recorded in `STATE.md`.

---

## The surface

```
[status-surface] 9 components | as of 2026-04-26 (v38 build)

# | Component                    Live      Prototype       Spec                          Drift
──┼──────────────────────────────────────────────────────────────────────────────────────────────────
 1| Lobby (/)                    deployed  —               VISION_LOCK §1                —
 2| Admin (/admin)               deployed  —               STATE.md (informal)           informal-spec
 3| Shared Exhibit               deployed  —               docs/COMPONENT_PHILOSOPHY.md  —
 4| HR exhibit config            deployed  —               STATE.md (informal)           informal-spec
 6| Controls surface             v28       prototype_a_v28.html  UX_CONTROLS_SPEC v0.3   ★ drywall
 8| Guest book + visits (D1)     deployed  —               STATE.md (informal)           informal-spec
 9| Filter logic                 deployed  prototype_a_v28.html  docs/FILTER_LOGIC_DECISION.md  aligned
11| HR archive (/hr/archive)     deployed  —               STATE.md (informal)           informal-spec
12| HrExhibitFlow                P2+ live  DOC (TBD path)  informal (DOC→P2+ pending)    ★ drywall
──┼──────────────────────────────────────────────────────────────────────────────────────────────────
                                              2 ★-drywall rows | 4 informal-spec rows | 1 aligned | 2 —
```

**Row numbers preserved** from the bite-2 enumeration (originally 12 candidates). Rows 5, 7, 10 mothballed (see "Mothballed rows" below). Renumbering would obscure which rows earned their place.

---

## The three lanes

### Live

What a visitor visits-the-URL-and-sees right now. *Not what's done. Not what's intended.* The current state of the building, drywall dust included. Live ≠ done.

**Canonical artifact:** the deployed Cloudflare Worker plus what it serves. Currency anchor: `/admin` page's git hash + build time + server clock.

**Blank rule:** Live cannot be blank. Every component the museum exposes has a live state.

### Prototype

A canonical reference artifact representing where the design is being worked, ahead of live. Usually a self-contained file that can be opened and observed without running the project.

**Canonical artifact:** a specific named file. For controls surface today: `prototype_a_v28.html`. For filter logic: same file. For HrExhibitFlow: TBD (see HrExhibitFlow expanded form).

**Blank rule:** Prototype is allowed to be blank. **A blank prototype lane is a real and stable state, not a gap.** It means "this component isn't currently in active design iteration; live is the only working representation."

**Currency:** new prototype ships → prior version retained for comparison only. Surface points at the current canonical.

### Spec

The document of record for the locked or in-progress decisions that govern the component.

**Canonical artifact:** a specific named doc. For controls surface: `UX_CONTROLS_SPEC_v0.3.md`. For filter logic: `docs/FILTER_LOGIC_DECISION.md`. For shared Exhibit component: `docs/COMPONENT_PHILOSOPHY.md`.

**Blank rule:** Spec is *allowed* to be blank, but blank ≠ acceptable long-term. **A blank spec lane is named "informal spec, anchored at <doc> §<section>"** — pointing at where the informal spec actually lives (usually `STATE.md`). The `informal-spec` count at the bottom of the table is a Phase 4 work backlog.

**Currency:** new version supersedes prior; surface tracks the current.

---

## Drift vocabulary (v0.1)

Five drift states. Each is a single label that means something specific:

- **`—`** (em-dash): no drift, no flag. Lanes are aligned, or the row only has lanes that exist (e.g., live + spec, no prototype because prototype is correctly blank).

- **`aligned`**: all three lanes present and in sync. Stronger statement than `—` because it asserts active alignment, not just absence of drift.

- **`informal-spec`**: spec lane is blank, anchored at an informal pointer. Not urgent, but flagged so it's countable. Phase 4 will eventually drive the count down.

- **`★ drywall`**: a row in active design iteration where lanes are deliberately out of sync. The star indicates "expected state, not a problem to fix." The drift is the work; the surface makes it visible without alarming. Required form: an expanded paragraph naming why the drift is expected. **If the paragraph can't be written, the row isn't drywall — it's `⚠ drift`.**

- **`⚠ drift`**: a row where lanes are out of sync in a way *not* expected. Spec changed but prototype hasn't caught up after multiple cycles. Live shipped without going through prototype. Prototype experimented but the experiment was abandoned and prototype now lags. The warning sign means "look at me, this needs a call."

The two judgment-tagged states (`★ drywall`, `⚠ drift`) stay human-tagged. The other three follow rules:

- All three lanes present + forward-flow shape → `aligned`
- Live + spec, no prototype expected → `—`
- Live + spec where spec is blank with informal anchor → `informal-spec`

---

## Update triggers

Each lane updates on a specific event that already happens. The event triggers the update; the update isn't an extra discipline.

**Live lane updates on deploy.** Every `npx wrangler deploy` is a live-state change by definition. The git hash + build time on `/admin` is the existing currency anchor. When a deploy happens during a session, the live column for affected rows gets touched as part of the deploy ritual.

**Prototype lane updates on prototype-ship.** Every new canonical prototype file (v27 → v28 → v29 eventually) is a prototype-state change by definition. When a prototype ships, the prototype column for affected rows gets touched, and the prior prototype reference moves to comparison-only.

**Spec lane updates on spec-bump or spec-extraction.** Two sub-cases:
- *Spec-bump*: when a locked spec versions (v0.2 → v0.3), the spec column updates to the new version reference.
- *Spec-extraction*: when an informal spec (anchored at "STATE.md (informal)") gets extracted into a formal doc, the spec column updates from the informal anchor to the formal doc.

**Carrier:** the session-close brief. See `docs/PROCESS_NOTES.md` "Session close — problem-state briefs" §5 (Status-surface reconciliation). When a session touches a row, the close brief lists the affected row(s) with old → new lane state. When no row is touched, no entry needed.

The close brief is the **structural carrier** for surface maintenance. Bit-Man doesn't have to remember to update the surface; the close brief template prompts it.

---

## Expanded forms (★ drywall rows)

### Controls surface [★ drywall]

  - **Live:** v28 controls surface deployed (label-shortening reconciliation at v46). Five-tab dock (Artist · Formats · Deep Tracks · Presets · ✕), with group labels inside Formats tab reading Setting · Media · Provenance · Type. Filter logic locked: within-group OR, across-group AND, empty-group-silent. LED gas-gauge semantics (1R/3Y/8G bottom-up). Active-tab-only highlighting. Deployed at the v28 build hash recorded in `STATE.md` "CONTROLS SURFACE" section.
  - **Prototype:** `C:\Users\macun\Downloads\prototype_a_v28.html`. v27 retained for comparison only.
  - **Spec:** `docs/canonical/UX_CONTROLS_SPEC_v0.3.md` (bumped from v0.2 during 2026-04-24 pruning pass; v0.2 superseded and archived).
  - **Drift state:** expected. The drywall is the open watch list (#6 group header sort cycling, #8 social-media tag architecture, #9 Setting → Venue rename) — known iteration surface, paused for the system review. Kaleidoscope mothballed for v1; spec preserved in `docs/KALEIDOSCOPE_v3_DECISIONS.md` and `UX_CONTROLS_SPEC_v0.3 §7`.
  - **Why drywall not aligned:** the three lanes *are* in sync at the locked-decisions level (filter logic, LEDs, dock structure), but the open watch list (#6 group header sort cycling, #8 social-media tag architecture) represents live design questions where prototype is the working surface and spec hasn't been amended yet. This is the standard "prototype iterates, spec amends after" forward-flow shape — healthy if visible. (#9 Setting → Venue rename retired-as-resolved at v46.)
  - **Pre-flight relevance:** Phase 1 v0.2's STATUS-SURFACE check will compare `STATE.md`'s canonical-prototype filename against this row's prototype lane. Misalignment → flag.

### HrExhibitFlow [★ drywall]

  - **Live:** `/hr` renders the P2+ shape (panels with auto-scroll, journal). Deployed.
  - **Prototype:** DOC (Deck of Cards). Path TBD — naming where the DOC prototype lives (or building it) is HrExhibitFlow design work, not status-surface work. Filed as backlog.
  - **Spec:** informal. The DOC-replaces-P2+ decision lives in chat history; no doc yet. Spec extraction is a Phase 4 candidate.
  - **Drift state:** expected. The transition from P2+ to DOC is in-flight and pre-launch. Live is the current shape; prototype is the directional shape; spec lags both because the decision hasn't been formalized.
  - **Why drywall not ⚠ drift:** the lane mismatch is deliberate — design iteration in flight, not technical debt. The TBD on prototype path is itself a flag for follow-up, not an indicator the row is unhealthy.
  - **Pre-flight relevance:** spec-lane anchor is non-existent (not just informal). Phase 4 priority. v0.2 STATUS-SURFACE check will flag if `STATE.md` deploy timestamp advances without this row's live lane being touched.

---

## Mothballed rows (logged for post-launch surfacing)

- **Row 5 — CB exhibit config.** Mothballed pending second-exhibit decision. No active work. Returns to surface when CB is activated as second featured exhibit.
- **Row 7 — Gift shop.** Mothballed for surface purposes. Featured-artist merch link is live-only concern, not three-lane drift. Returns post-launch when gift-shop work prioritizes.
- **Row 10 — Lyric Map.** Mothballed. Tool "pretends to analyze" (Mike's framing). Returns when revisited as Easter-eggs-or-UX-tools.

---

## Standing exclusions

- **CB exhibit content:** mothballed pending post-launch (potential second featured exhibit). Half set up on the old Museum format; not in MediaVault. Stashed away until the day we decide to begin surfacing the second featured artist.
- **No "coming soon" anywhere on the Museum page.** Standing rule. Affects gift-shop framing — featured-artist merch links are live-or-not-present, never "coming soon."

---

## Out of scope

- **Capabilities surface** (FB Embed pipeline, social-media post link ingestion, www URL ingestion, photo stack ingestion, YouTube ingestion, YouTube/web crawlers). Different shape, different rows, different update cadence. Filed as backlog candidate. Distinct from this surface.
- **Component-level history.** v0.1 = current state only. Session-close briefs already carry the historical record.
- **Auto-generation from code/deploy.** v0.1 is hand-curated. Whether automation earns its place is v0.2+.
- **Building missing prototypes or formal specs.** Surface points at gaps; closing them is downstream work.
- **Cross-project coverage.** This surface covers the Weird.Baby Museum project only. MediaVault, Hunter Root research scripts, Lancaster Property — not in scope.
- **Visitor-facing exposure.** Internal infrastructure. Drywall stays backstage.

---

## Pre-flight integration (Phase 1 v0.2 backstop)

A new pre-flight section — **STATUS-SURFACE** — ships in Phase 1 v0.2 (separate bite, sequenced after this build *and* after Phase 1 v1's third clean-run data point). Reads this file. Three sub-checks:

- **Sub-check A — Live lane vs. STATE.md.** If `STATE.md` has been updated more recently than this file, flag.
- **Sub-check B — Prototype lane vs. canonical references.** If the surface's prototype column for the controls row points at a different file than `STATE.md`'s canonical, flag.
- **Sub-check C — Spec lane file existence.** For every spec column entry pointing at a doc, confirm the doc exists.

This file's existence is a precondition for Phase 1 v0.2. Until v0.2 ships, surface drift is caught only by close-brief discipline.

---

*End of v0.1. Maintained per the update-triggers rules above. Next revision when a row's lane state changes; format revision when v0.2 work be