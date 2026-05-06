# Weird Baby Museum — Status

_Last updated: 2026-05-06_

## Current focus
HR exhibit flow + museum design tokens (v28_3 deck adoption).

## In progress
- [ ] HrExhibitFlow.jsx — finish exhibit transition states
- [ ] museum-tokens.css — reconcile with v28_3 deck
- [ ] WbHome.jsx — verify entry point still routes correctly post-token changes

## Next up
- [ ] Document the deck-adoption lineage decision in MUSEUM_UX.md
- [ ] Lint pass before next deploy
- [ ] `npm run build` smoke test before pushing deploy

## Recently done
- Walked back a9ade8f; recorded actual v28_3 deck-adoption lineage (6809f85)
- Pushed 7 commits to origin/main

## Open questions
- (none right now)

---

_How this file works:_ the `Get-ProjectStatus.ps1` script reads the first
unchecked `- [ ]` item under any heading and surfaces it as the next step.
Keep the most-active item at the top of "In progress". Move items to
"Recently done" when complete (don't just check them — the script ignores
checked items, but a clean log is useful for you)._
