# THE MUSEUM FIT ROUND — RUN LOG (2026-08-02, v33)

Autonomous single-agent Code-lane round per Mike's F1–F7 order, following the
Spotlight round (v32, pushed and origin-verified). Drafting lane held; sealed
per OPERATIONS §8. Deploy/mirror are MIKE'S and were not run. Mike's verdict
on the collage wall ("grand slam") was treated as a protection order: it was
re-verified intact at desktop and phone at the end of the round.

## F1 — the tracklist, corrected

Last round's interpretation flag did its job: "Coconuts" and "E. D. Yadah"
were MIKE'S OWN SONG TITLES used as examples of tracklist rows, not category
names. Both rows are dead. **The resulting structure, stated:**

    01..n   the artist's own songs      numbered, playable
    About the Songs                     the songs' fact sheet (museum cards)
    About the Artist                    the card, the two honest questions,
                                        and the DOORS OUT (site / listen /
                                        store / channel — rehomed from the
                                        dead links row)
    What they are up to                 the collage wall (+ tour door)

The house album (F7a) sits before all of that in the coverflow. The doors
kept their verified URLs and scents; the tour door stays on "What they are
up to". Categories remain unnumbered; numbers mean "song".

## F2 — the bleed, diagnosed and closed

MEASURED: the fixed nav is 45px tall (content + padding — it moves with
fonts); the sticky banner console pinned at a HARD-CODED `top:52px`. The
7px strip between them was open glass — `elementsFromPoint` in the strip
returned `.vp-collage`, tiles painting raw between the bands, which is
Mike's screenshot exactly. Fix: an opaque apron (`::before`) extending 16px
above the console, so any nav-height variance shows house paper, never
content. Verified: the strip probe now returns the console first.

## F3 — optimal fit on entry, computed not tasted

On entering /wal the room now fits one screen: tracklist, viewer and
scroller all visible. The algorithm measures the live frame (whatever the
nav, carousel, strip and banner actually are), then turns two levers in
order: (1) the carousel yields height down to its 160px floor; (2) the
VIDEO FRAME's height caps (`--fit-area-max`) and the player letterboxes —
on the dark stage the bars are black on near-black. The column split is
deliberately NOT a lever: the first draft narrowed the viewer and the
arithmetic dutifully produced a 62%-wide mostly-empty tracklist — a fit
that fit and read as a mistake; it was rejected and rewritten.
Stickiness: the fit and any visitor drags persist in sessionStorage
(`usePersist` gained a scope; wings that declare nothing keep localStorage).
A fresh session re-fits for whatever window it finds. Presets can drive the
same sizes: they are ordinary state behind ordinary setters plus two session
keys — that seam is noted, not built.
Verified in the pane: docH == viewport exactly; frame 928×283 capped;
carousel 160; split untouched.

## F4 — the scroller, tightened

Measured dead black: 120px min-height against a 74px viewport holding a
29px one-line fact. Now: the viewport is exactly two fact-lines
(2 × 1.34rem × 1.35) and the wrap holds content + credit row only (~88px
total). Fixed rather than auto so the credit row does not jump as one- and
two-line facts cycle.

## F5 — the ?-button dies

The vault ?-button and the FactPopup component are RETIRED with their CSS
and state (the whole surface is one revert away at `7c3a231`). Factoids
belong in the PUV scroller during playback — ambient, uninvited, part of
the show — and the scroller already carries the same vault through the same
climb, keyed to what the visitor is looking at.

## F6 — phone first pass (identify, don't over-optimize)

Deliverable: `docs/PHONE_FINDINGS.md` — the classes named per route, with
measurements. Fixed here (mechanical cures only): `:active` tap feedback on
rows/doors/tiles/directory under coarse pointers; the selected row stops
being a whisper at stacked widths; and on the flat wing at ≤720px a card tap
scrolls the viewer to the finger (fires with the correct target — proven by
interception; the smooth animation itself cannot run in the non-composited
dev pane, a caveat banked in the findings doc after it cost real diagnosis
time). Everything else — small nav targets, /hr's 10,336px phone page, the
robots stage density, drag furniture on touch — is identified, not touched.

## F7 — the four banked notes

- **(a) The house album**: /wal now opens on "Worth A Listen" itself — two
  unnumbered pages, "What this room is" and "Its place in the museum", house
  voice, [PAPA] on every line, house typographic cover (the frame may
  introduce itself in the frame's voice; everywhere else the artists bring
  the color). The engine gained one honest fallback: a flat album with
  nothing to cue lands on its first face instead of a hole.
- **(b) The gift shop**: Hunter Root's full-width banner is REMOVED (entry
  deleted from `wb_roster`; `?from=hr` degrades to the house pick). The
  artist tiles are DOUBLE HEIGHT (two-up grid, square plates, W8 art). The
  page is template-driven: the tiles are a straight map of the WAL wing's
  artist data — a fifth artist is a data entry, nothing else changes. The
  house banner holds top billing; `?top=<id>` still promotes an artist.
- **(c) The lobby subtitle**: live under the logo. Default: "A
  Singer-Songwriter Museum". Candidates, per show-then-ask (MIKE PICKS —
  one string when he does): `/?subtitle=2` "A Solo Artist Museum",
  `/?subtitle=3` "The Singer-Songwriter Museum", `/?subtitle=4` "Museum of
  the Solo Artist".
- **(d) Remnant sweep**: repo-wide grep for /hr and reference-wing pointers.
  Remaining, all legitimate: the live route in App.jsx (reference-held per
  ruling), the HR wing's own visitPath, and the operator dashboard's admin
  jump. One stale lobby comment ("his WAL LINK track points back here") was
  corrected to the W9 reality. Nothing visitor-facing points at /hr.

## Gates

- Lint: 11 errors / 10 warnings — the exact HEAD baseline. (One regression
  was caught mid-round and fixed: the first usePersist draft put a
  per-render closure in a dep array and the React Compiler flagged it.)
- Build: vite green.
- Glass lap: desktop + 375×812; zero console errors across /, /wal, /wb,
  /booth, /shop, /robots, /hr; zero horizontal overflow at phone on all
  seven; W1 persistence re-verified (transport alive under laid-over cards);
  the collage wall intact and loading (protection order honored).
