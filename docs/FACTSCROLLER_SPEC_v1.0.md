# FACTSCROLLER SPEC v1.0 — Living Cards + Player Scroller
**Ruled:** Mike, 2026-07-07 (design session). **Supersedes:** the display-UX gap left open by PUV_FACT_MODEL_SPEC.md (data model unchanged).

## The Look & Feel (Papa's ruling — verbatim intent)
Visitor filters the wall. Among the resulting cards, some cards are ALIVE:
scrolling text. Each living card cycles facts pulled by ITS OWN RECIPE from
a vault of thousands. A "Nick Root" card scrolls Nick facts. An "Arkansas
reviews" card scrolls reviewer quotes. Dozens of recipe cards, thousands of
shared facts. Living cards obey the global filter EXACTLY like every other
card. The scroller under the video player is the same creature — one more
recipe, keyed to the current track.

## Rulings (locked)
1. Current scroller (bounce, placement, motion) is GOOD — keep untouched.
   Volume before polish: no font/motion tweaks until thousands of facts load.
2. First-meet: on the track (player scroller). Fallback: climb the tags —
   track → album → era → artist. Fountain never dries, climb unsignaled.
3. Scroller stacks = MV artifacts ("recipe cards"): precurated, vaulted,
   rendered on the wall as cards, filter-obedient.
4. Facts are SHARED: thousands in the vault, many recipes draw from the
   same pool. Recipe = tag-based selection, per card.
5. Weight = selection frequency (deferred from PUV pilot; lands here).
6. EXTRA CREDIT (not urgent): breadcrumb icon per fact, source-on-demand.

## Architecture direction (Ops-owned, derived from rulings)
- Recipe card = artifact with card_kind marking it living + a recipe
  (tag query) in payload. Vault-native; zero new display pipelines.
- Player scroller re-plumbs from static hr_facts.js to vaulted facts via
  recipe keyed to now-playing track (with the climb).
- Facts remain `fact` Kind artifacts per PUV model. Quotes = facts whose
  text is a quotation; attribution rides the sourcing breadcrumb.
- Fact volume engine: press batch (16 URLs) is the first fact factory —
  press/interview ingestion emits quotes/facts alongside artifacts.

## Sequencing
A. Re-plumb player scroller (existing UX, vault data, climb, weight).
B. Recipe-card artifact shape + first 2-3 recipe cards (Nick Root;
   Arkansas reviews — needs press facts).
C. Press batch ingestion feeds the vault (separate brief, UNBLOCKED).
D. Volume loading; only then font/polish pass (Mike-gated).
