# THE POLISH ROUND — run log (v34, P1–P23)

**Session:** autonomous single-agent, Code lane, host-side (Windows, no Cowork
mount — every edit and every gate ran natively).
**Date:** 2026-08-02. **Base:** `59e3580` (v33, THE FIT ROUND).
**Brief:** Mike's glass session on v33. Quality bar named by Mike: *"the collage
wall is the quality bar — everything should feel like it belongs beside it."*

---

## 1. Verdict per item

| # | Item | State | Evidence |
|---|---|---|---|
| P1 | Internal scrolling / nothing resizes | **FIXED** | two causes, both measured — §2 |
| P2 | PUV scroller too tall | **FIXED** | 105px → 48px |
| P3 | Artist-name title bar too tall | **FIXED** | 50px → 40px |
| P4 | Scroller off About the Artist | **FIXED** | scoped to the stowed state |
| P5 | Hide all [PAPA], site-wide | **FIXED** | 0 occurrences, all routes |
| P6 | Link-out arrow | **REMOVED** | `content:"↗"` gone |
| P7 | Typography ramp | **REBUILT** | 17 ratios → 5 steps with floors |
| P8 | Curly display font on the pull-quote | **KILLED** | Syne, sized as a lead |
| P9 | Black too black | **WARMED** | warm charcoal + lit ellipse |
| P10 | Bottom buttons 2×2 | **DONE** | explicit 2 cols, stack < 820px |
| P11 | Gift Shop Billing Law | **IMPLEMENTED** | 7 exit cases verified — §4 |
| P12 | Guestbook clipped messages | **FIXED** | 0 partial rows at every scroll |
| P13 | Guestbook copy + layout | **DONE** | one prompt, no "optional", ruled ledger |
| P14 | Two house questions off artist cards | **REMOVED** | entries: 0 |
| P15 | Doors: Name + function, real descriptors | **DONE** | `fn` + written scents |
| P16 | Records need album links as icons | **DONE (scoped)** | §3 — verified links only |
| P17 | "Said about her": link + rebuild | **DONE** | card decks |
| P18 | "What <artist> said" | **BUILT** | card decks, incl. video posters |
| P19 | Other endeavours / passions | **BUILT** | card decks |
| P20 | Born-honours block: add links | **DONE** | tombstone rows carry `url` |
| P21 | Bandcamp descriptor too brash | **REWRITTEN** | §5 |
| P22 | Discography off the artist page | **DONE** | plain lists deleted |
| P23 | Robots beautification + better text | **FIRST PASS** | §6 |

Untouched on Mike's order: the lobby subtitle; the FAQ / Mission / Info Booth.

---

## 2. P1 — "nothing resizes", diagnosed

Mike reported it as one thing. It was two, and fixing either alone would have
reported success and changed nothing a visitor could see.

**(a) The handle was buried.** `.cf-dh` is the 14px carousel drag strip and it
sits directly above `.ex-album-banner`. v33's F2 gave the sticky console an
opaque 16px apron at `bottom:100%` inside a `z-index:80` element — i.e. exactly
over the handle, with no `pointer-events` opt-out.

```
elementsFromPoint(845, cf-dh.top + 2)  → ex-album-banner | cf-dh | ex-root
elementsFromPoint(845, cf-dh.top + 7)  → ex-album-banner | cf-dh-dot | cf-dh
elementsFromPoint(845, cf-dh.top + 12) → ex-album-banner | cf-dh | ex-root
```

The banner is first at every point of the handle. `pointer-events:none` on the
apron — it was always paint; nothing under it was ever meant to be hit-tested.
After: `cf-dh-dot | cf-dh`.

**(b) The fit's cap never yielded.** F3 writes `--fit-area-max` on entry and
nothing revises it, so the viewer's height was frozen for the session. The
carousel drag now trades height with the viewer, preserving the total — which
is what the fit ruling is *for*.

```
before  cf 160  area 470  cap 470px      sum 630
after   cf 270  area 360  cap 360px      sum 630     (drag +110px)
sessionStorage: wb-wal-cfh=270, wb-wal-cfh-cap=360
```

**Tooling note:** the browser tool's synthetic `left_click_drag` does not reach
this app's pointer handlers — the split handle, which was never occluded, fails
identically under it. The drag above was therefore exercised by dispatching real
`PointerEvent`s with `setPointerCapture` stubbed (a synthetic event cannot carry
a live pointerId). The OCCLUSION half is proven independently by
`elementsFromPoint`, which is the actual defect.

---

## 3. P16 / P22 — the one place two instructions pulled against each other

P16: *"every record needs LINKS TO THE ALBUM as ICONS … verified."*
P22: *"DISCOGRAPHY: remove from the artist page — doesn't deserve the space."*

Read as one instruction they are consistent, and that is how they were built:
**the plain chronological list dies; the records that remain become doors.**
Twelve ruled lines of year-and-title that nobody could click were what did not
deserve the space. What is on the page now is only the records this exhibit
actually names — the songs' own albums, and the latest — each an icon link to
the platform that carries it.

**Every link was read off that platform's own catalogue page this round:**

| Artist | Source read | Result |
|---|---|---|
| Carsie Blanton | `carsieblanton.bandcamp.com/music` | 16 releases, exact slugs; 4 surfaced |
| Jesse Welles | `jessewelles.bandcamp.com/music` | 7 albums — **the wing had never named his Bandcamp**; 5 surfaced |
| Hunter Root | `hunterrootmusic.bandcamp.com/music` | 16 releases via his site's own "Tunes" tab; 4 surfaced |
| Mikey Mike | `mikeymike.bandcamp.com` → **404** | no Bandcamp; his own domain is spam-injected (ledger) — **no doors given** |

Mikey Mike gets a records block carrying a NOTE and no links, saying exactly
that. An empty shelf with a label is the honest object; an absent shelf reads as
an oversight, and a fabricated streaming link would be neither.

**The marks are two letters, not logos.** A platform wordmark is its trademark
and this museum does not own it. `BC` / `ST` in a circle, with the full platform
name on the control's `aria-label` and `title`.

---

## 4. P11 — the billing law, verified

All seven cases driven live and read back off the DOM:

| Exit | Top billing | Beneath, in order |
|---|---|---|
| `/wal` → Carsie | Carsie Blanton | Hunter Root · Jesse Welles · Mikey Mike |
| `/wal` → Hunter | Hunter Root | Carsie Blanton · Jesse Welles · Mikey Mike |
| `/wal` → house album | *(none)* | Hunter Root · Carsie · Jesse · Mikey |
| `/hr` | Hunter Root | Carsie · Jesse · Mikey |
| `/wb` | **Weird.Baby** | Hunter Root · Carsie · Jesse · Mikey |
| `/robots` | **Weird.Baby** | Hunter Root · Carsie · Jesse · Mikey |
| direct `/shop` | *(none)* | Hunter Root · **Weird.Baby** · Carsie · Jesse · Mikey |

W.B appears on exactly the three rows where the exhibit was the house's own (or
where there was no exhibit). Mike's reported symptom — W.B on the page when
leaving WAL — is gone. Order is earliest-first with alphabetical ties.

**One clause the law does not name** and I decided rather than stalled: a direct
arrival at `/shop` exited no exhibit, so nobody takes top billing, and the house
IS listed because this is the shop's own front door rather than someone's exit.
Overrule freely — it is one line.

---

## 5. Copy changed (so it can be argued with)

- **Bandcamp door (P21).** was: *"Where to hear it without paying an advertiser
  for the privilege."* now: *"Sixteen releases, free to play, pay what you want —
  and the money goes straight to her."* Same fact; the argument with the
  streaming industry is not staged on the artist's card.
- **Doors (P15)** now read Name + FUNCTION + scent, e.g.
  `carsieblanton.com` · HOMEPAGE · *"Her own place — the shows list, the shop and
  the blog she has been writing since long before the records got political."*
- **Robots**, two rows whose TITLE was the literal marker `[PAPA]` — which after
  P5 would have rendered headless — now carry real headings, with the marker
  demoted to the note so Mike's list survives.

**Lyrics are not quoted anywhere.** P18 asks for "her quotes, lyrics, real life";
song lyrics are reproduced nowhere on this site and were not added. The decks
carry her spoken and written words with sources, and point at the songs.

---

## 6. P23 — robots, first pass

The wing's problem was never its writing. It is a wing about a **physical
object** made entirely of words, with nine real photographs of the machine
sitting unused in `public/robots/reference/photos`. THE PLATES puts them on the
wall using the WAL collage renderer unchanged — same paper, tilt, shadow and
tap-to-open. Our own images on our own origin, so WAL's rights question does not
arise.

This required generalising the link seam: every door in the viewer dispatched
the literal `"wb-wal-open-link"`, which /robots does not listen for. A collage
there would have rendered beautifully and done nothing — W4a's dead-button
defect, pre-built into the next wing. `artist.linkEvent` now names the verb;
WAL's default is unchanged to the character.

**Honest scope:** this is structure and visuals plus two heading repairs. The
deeper text rewrite is not done — the `[PAPA]` rows are the ones where writing
would put words in Mike's mouth, and they stay his.

---

## 7. Gates

- `npx eslint .` → **11 errors / 10 warnings** = HEAD baseline exactly. Zero new.
- `npx vite build` → green (657.69 kB js / 96.69 kB css).
- Desktop lap: all five WAL albums × every face; `/hr` `/wb` `/robots` `/shop`
  `/booth`. Per face: no `[PAPA]`, no `↗`, no horizontal overflow.
- Collage protected: 11 tiles, all posters load, tilt intact.
- Guestbook: 0 partial rows at scrollTop 0 / 15 / 47 / 90 / 120 / 181 / end.

**Phone: verified by MEASUREMENT, not by a narrow viewport.** `resize_window`
reported success but the page stayed at 1690px (`outerWidth` read 0), so a visual
narrow-width walk was not possible this session. Instead every block was probed
for min-content width; the worst is `.vp-tomb-row` at **184px**, comfortably
inside a 391px phone. That probe caught a real defect the desktop lap could not:
the door name `carsieblanton.com` is one unbreakable **367px** token, demanding
404px inside a 391px screen. Fixed with `overflow-wrap:anywhere`.

**A visual phone walk is still owed.** It is the one gate this round could not
close.

---

## 8. Carried forward

- Phone: visual narrow-viewport walk (above).
- P16 depth: only the records this room names carry doors. Deeper per-record
  coverage (YouTube album playlists, Apple/Spotify) needs per-record
  verification that was out of budget — and every unverified link stays out.
- Mikey Mike has no verifiable store or catalogue page. If Mike has a contact
  for him, one email closes it.
- Two of Mikey Mike's quote cards and one of Hunter Root's are sourced but
  **unlinked** (print interviews / the museum's own vault). They render as flat
  cards, not buttons, on purpose.
- P23 is a first pass; the robots text rewrite is Mike's.
