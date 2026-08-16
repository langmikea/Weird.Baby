# SITE CHANGES — 2026-08-15

The round's record, and **the source cited by every `MIKE` row this round adds
to `provenance/register.json`** — the standing rule is that a string declared as
his is declared against a log that quotes his instruction in full. §0 is that
quote.

---

## §0 — THE INSTRUCTION, VERBATIM

> **2. WAL TRACKLIST** — becomes a wing directory, not one artist's
> tracks. New left column, in this order:
>
> ```
>   Worth A Listen
>   Meet the Artists          (shows the four big tiles)
>   Carsie Blanton            (jumps to her album)
>   Jesse Welles
>   Mikey Mike
>   Hunter Root
>   FAQ
> ```
>
> Also: Hunter Root moves to the END of the carousel, matching
> the order used elsewhere.
>
> **3. GIFT SHOP** — friend tiles.
> New quarter-size tile type for friends. Coalition for the
> Homeless is the first, linking to
> coalitionforthehomeless.org/donate. Friend tiles always show,
> and sit at the bottom of whatever content is already defined.
> Weird.Baby's own tile is separate and always displays, always
> full size: LAST on any non-Weird.Baby page, TOP on Weird.Baby
> pages.
> Derive both orderings from ONE rule, not two — two rules will
> drift. Say what rule you used.
>
> **4. MUSEUM FAQ** — Mike's rewrite replaces what is there. Use his
> text verbatim; it is in this session. Note the contact ruling:
> Papa@Weird.Baby appears in the FAQ, purpose-placed. NOT in
> footers, NOT on page endings, NOT scattered. This supersedes
> the 11 Aug ruling that struck the address sitewide.
> The FAQ title stays but comes down a step — less bold, less
> large, sitting with the rest of the museum rather than
> shouting.
>
> **5. FOUNDATION** — the top-left Weird.Baby wordmark currently exits
> to the gift shop. It must exit to the LOBBY. Top-right is
> already correct.
>
> **6. ACROSS THE SITE** — increase the font size of the top-left and
> top-right header links (Weird.Baby, GIFT SHOP, LOBBY).

---

## §0b — THE FAQ REWRITE, VERBATIM (supplied 2026-08-15, after the first pass)

> TITLE (already dressed down this round):
> The Weird.Baby Museum is free.
> Equally free. Always.
>
> Q: What is this place?
> A: A museum, of sorts.
>    A place to freely share my favorite stuff with others.
>
> Q: Is it really free?
> A: Yes — no accounts or logins. Nothing behind a wall.
>    That's not an introductory offer. It's the arrangement.
>
> Q: Are you tracking me?
> A: No — Weird.Baby uses no logins, no cookies.
>    NOTE: We do not speak for the artists' sites, nor other
>    social media sites.
>
> Q: So, how does the site always know it is me?
> A: Your computer / phone saves your information for you.
>    We never touch it.
>
> Q: How do I contact Weird.Baby?
> A: Papa@Weird.Baby
>
> Q: Who keeps this place?
> A: One person — The current Papa Weird.Baby.
>    The job pays nothing.
>    That's the deal, and it never changes.
>
> Q: How does something get in The Museum?
> A: It strikes the Papa Weird.Baby's fancy.
>    Nothing is exhibited because it is popular or because it
>    paid to be.
>
> Q: Are you affiliated with the artists you show?
> A: No — Those exhibited on Weird.Baby are not partners, clients,
>    or signings.
>    They are people we feel are Worth a Listen.
>
> Q: Does Weird.Baby 'take a cut' of the Artists' proceeds?
> A: No — never.
>    Every door in the gift shop leads to the Artists' own sites
>    and stores.
>
> Q: Is The Museum finished?
> A: No — a museum that stops accessioning is a storage unit.
>    If you come back, there will be more than there was.
>
> Back to the lobby
>
> NOTES:
> - "no cookies" is deliberately NOT "no cookies, no nothing".
>   Mike struck the absolute on 15 Aug: risk abatement begins with
>   risk elimination. Do not restore it.
> - Papa@Weird.Baby appears HERE and nowhere else. Not footers,
>   not page endings. Purpose-placed.
> - Before this ships, MEASURE what a visit actually sets in the
>   browser — the guest book has to remember something. If anything
>   at all is stored, tell Mike before "no cookies" goes live.

---

## §1 — WHAT NEEDS MIKE

**1. THE STORAGE MEASUREMENT HE ASKED FOR, AND IT HAS FOUR PARTS.** See §6. The
short version: **"no cookies" is TRUE and measured — zero cookies, first party,
across every room.** Three other things are true as well and he should hear them
before it goes live: the site stores in `sessionStorage`/`localStorage` (which
his own next answer covers exactly), **Google Fonts loads from two Google
domains on every page view**, and **playing a video loads a `www.youtube.com`
iframe rather than `youtube-nocookie.com`.**

**2. WAL's FIRST ROW, `Worth A Listen`, IS NOT BUILT.** Every other row in his
directory is either an existing page or a door to an existing album. This one
names no destination and no content exists for it: the wing's own house prose
was struck at V1 (*"the blurb is struck… 'Four of them.'"*) and its successor,
"The Deal", was burned at F2. **One word settles it** — is it a page he will
write, or the directory's own title standing over the six rows beneath it?
Built either way in one edit; guessed, it is either an empty container (which
the NO-COMING-SOON credo kills) or invented prose.

---

## §2 — WAL: THE WING DIRECTORY

The house album's tracklist is the wing's directory now.

| row | what it is |
|---|---|
| Meet the Artists | the existing bill, renamed — four tiles, unchanged |
| Carsie Blanton | door → her album |
| Jesse Welles | door → his album |
| Mikey Mike | door → his album |
| Hunter Root | door → his album |
| FAQ | unchanged |

**THE FOUR DOORS ARE BUILT FROM `RACK`, NOT TYPED.** `CAROUSEL_LAST =
["hunter-root"]` already put him last in the carousel (his 14 Aug ruling,
shipped in `c1d5058`); the directory reads the same array, so **both orders come
from one declaration** and Hunter Root is last in both by construction. Typing
the four here would have been a second copy of an order that already exists.

**`RACK` MOVED UP THE FILE AND THAT IS THE ONLY STRUCTURAL CHANGE.** It was
declared below `HOUSE_ALBUM`; the album now lists the rack, so the rack has to
exist first. The rule itself is untouched — only its position.

**A ROW MAY NOW BE A DOOR: `track.jumpTo`, AN ALBUM ID.** It is DATA, like
`header`, `sub`, `unnumbered` and `kind` before it, so a wing that declares none
renders byte-identically — /hr, /wb, /robots and /foundation are unaffected.
**It resolves by ID and never by index**, because an index would be a third copy
of the carousel's order and would go silently wrong the next time that order
moved. An id naming nothing is inert and warns once.

**A DOOR GOES ON THE FIRST CLICK.** V3's arm-then-fire exists so a click never
starts a SOUND nobody asked for; a jump starts nothing, so requiring two clicks
would be that rule applied to the one case its reason does not cover.

## §3 — GIFT SHOP: THE ONE RULE, SAID PLAINLY

> **The house takes the position its own ownership gives it — the top of its own
> room, the close of somebody else's.**

That is the rule, and in the code it is **one boolean**:

```js
const houseFirst = houseOwns || direct;
...
return houseFirst ? [house, ...guests] : [...guests, house];
```

**There is deliberately no second condition anywhere for the "last" case.** Last
is what not-first means. The two orderings he named cannot drift apart because
there is only one of them, and it is the same test the pool already ran, reused
rather than re-asked.

**CLAUSE THREE IS SUPERSEDED AND IS NAMED, NOT QUIETLY EDITED.** It said *"the
house is on the page only when the exhibit was its own."* His ruling is that the
house always shows. So **the house leaves the billing pool entirely**: it is no
longer a candidate for top billing, no longer sorted against the guests, and no
longer absent. Leaving it in the pool and special-casing it after would give two
mechanisms an opinion about one tile, and the day they disagreed the page would
draw Weird.Baby twice or not at all.

**TWO DEAD BRANCHES WENT WITH IT.** `ownerKey` had `houseOwns ? "wb" : direct ?
"wb"`, which now resolve against a pool that cannot contain them — right answer,
wrong reason, and a branch like that gets "repaired" by the next reader straight
back into the billing it was taken out of. B1's reasoning is not lost, it MOVED:
*an unowned front door is still the house's front door* is `houseFirst`.

**THE FRIENDS.** `wbFriends` in `wb_roster.js`, Coalition for the Homeless
first, at the address already in the building (`foundation.js`, typed as he typed
it and checked 2026-08-14). **They are not roster entries and must not become
them** — the roster is what the billing law ranks, and a friend is never billed,
never ordered against an artist and never absent; the first symptom of getting
that wrong is a charity taking top billing on somebody's exit.

**NOTHING IS SAID ABOUT THEM THAT WE WERE NOT TOLD** — a name and a door, no
tagline, no mission line. A sentence describing a real organisation, written
here, would read true and be invented, and it belongs to somebody else.

**THE QUARTER SIZE DERIVES FROM `--gs-cols`.** Twice the columns is half the
width. Hard-coding 4 would restate the shop's breakpoint and disagree with it the
day `--gs-cols` moves. A second section does not break S1: that rule was an
argument about tiles OF THE SAME SIZE, and the line here means something — it is
where the shop stops selling and starts pointing.

## §4 — THE MUSEUM FAQ'S TITLE

Down a step, and **scoped to `html[data-room="booth"]`**: weight 500 → 400, the
clamp 1.15/2vw/1.5rem → 1.02/1.6vw/1.24rem, colour `--wb-gold` → `--wb-gold-lo`.

**IT IS NOT EDITED IN `sheet.css`, WHICH IS THE CARE.** `.sheet-credo` is shared
furniture — /booth and /foundation both draw a credo through it — so retuning the
base rule to answer a complaint about the museum FAQ would silently restyle the
Foundation too. A4 paid for that lesson on the Record.

**The face is untouched.** He asked for a step down, not a different voice; that
the credo is the last brand-face object on the page is a separate open question
with his name on it, and nothing here answers it.

## §5 — 5 AND 6 WERE ALREADY DONE

Both landed on 2026-08-13 in `c1d5058`, from the same instructions, and were
verified rather than re-done:

- **The Foundation's wordmark** — `foundation.js:1158` declares `brandTo: "/"`,
  and `Exhibit.jsx` reads `artist.brandTo || shopHref`. No other wing moves.
- **The header links** — `MuseumBar.css`, `.wb-bar-brand` 0.85rem → **1rem** and
  `.wb-bar-exit` 0.7rem → **0.82rem**, each with his instruction quoted at the
  rule.

They are unpushed, which is why they can read as outstanding: the work is on
this machine and not on the site.

## §6 — THE STORAGE MEASUREMENT, TAKEN BEFORE THIS SHIPS

His note: *"Before this ships, MEASURE what a visit actually sets in the browser
— the guest book has to remember something. If anything at all is stored, tell
Mike before 'no cookies' goes live."*

**METHOD.** Storage cleared to zero first (cookies, `localStorage`,
`sessionStorage`, IndexedDB), then a real visit walked on the BUILT bundle
through `wrangler dev`: lobby → /wal → /robots → /wb (track played) → /wal
(video played) → /shop → /foundation, measuring after each. So this is what a
visit SETS, not what was lying around.

### 6.1 — "no cookies" IS TRUE, AND IT IS MEASURED

**Zero first-party cookies at every step.** The cookie jar was empty on the
lobby, on all four wings, in the shop and on the Foundation, before and after
playing audio and video. Nothing in `src/` writes `document.cookie` — the only
cookie the building can set is the `/hr` password cookie in `src/worker.js`,
which a visitor never reaches. **The absolute he struck was struck for a
different reason than this line being wrong.**

### 6.2 — WHAT IS STORED, AND HIS OWN NEXT ANSWER ALREADY COVERS IT

`sessionStorage` (dies with the tab):

```
wb-arrived:<room>   one per room visited — where you were on the page
wb-<wing>-split     the tracklist/viewer divider you dragged
wb-<wing>-cfh       the carousel height fit
```

`localStorage` (persists): **one key**, the Record's read/unread marker
(`src/lib/record-read.js`), written only if he ships Records and a visitor opens
one. Nothing is transmitted; that file contains no `fetch` and says so.

**THIS IS EXACTLY WHAT HIS FOURTH ANSWER SAYS.** *"Your computer / phone saves
your information for you. We never touch it."* The measurement agrees with the
copy, which is the outcome worth having.

**THE GUEST BOOK STORES NOTHING IN THE BROWSER** — the premise in his note does
not hold for this build. `WbHome.jsx` contains no `localStorage`, no
`sessionStorage` and no cookie. Signatures are read from and posted to
`/api/guestbook`; the book "remembers" **server-side**, in the museum's own
database, and the visitor's browser keeps nothing about it.

### 6.3 — TWO OUTBOUND REQUESTS HIS ANSWER DOES NOT COVER

**GOOGLE FONTS, ON EVERY PAGE VIEW, BEFORE ANY CLICK.** Measured on a plain load
of `/wb`: `fonts.googleapis.com` for the stylesheet and four `fonts.gstatic.com`
woff2 files. Google does not set cookies for these, but it is a request to
Google carrying the visitor's IP and user-agent on every page of the museum.
**The old booth answer had an outbound clause for exactly this and the new one
does not** — and `CLAUDE.md` records that this clause "has been wrong twice" and
that *"change any embed anywhere in the museum and this answer changes first."*

**YOUTUBE ON PLAY, AND IT IS THE `www.youtube.com` EMBED.** Measured: playing a
song on /wal creates one iframe, host **`www.youtube.com`** — not
`youtube-nocookie.com`. That frame sets third-party cookies on youtube.com, and
`Exhibit.jsx`'s own CH8 note records that YouTube's script inside it calls
`googleads.g.doubleclick.net/pagead/id`. **`HrExhibitFlow.jsx` already uses the
`youtube-nocookie.com` embed** (line 2032), so the museum is inconsistent with
itself and the stricter host is a one-word change in the main player.
**His NOTE may well be meant to cover this** — *"nor other social media sites"* —
but the embed sits on OUR page rather than a link away, so it is his call and
not Ops'.

### 6.4 — THE SITE LOGS THE VISIT, SERVER-SIDE

Every exhibit page POSTs `/api/visits`. Read in `src/worker.js`, it inserts
**page, referrer and a timestamp** and nothing else — no IP, no identifier, no
fingerprint, nothing that could recognise the same person twice. So *"Are you
tracking me? No"* survives it: the museum counts page views, it cannot follow a
person. Named here because it is a thing the museum records about a visit and he
asked to be told what a visit does.

## §7 — THE FAQ ITSELF

Ten questions, his text, **verbatim** — no edit, no smoothing, no reorder.
Measured on the built page: **10 questions, every answer's lines in his order**,
`Back to the lobby` present (it was already there), and **`Papa@Weird.Baby`
appears exactly once in the document**, inside "How do I contact Weird.Baby?",
and nowhere in the footer or the way-back line.

**HIS LINE BREAKS DRAW.** `.sheet-faq-a` takes `white-space: pre-line`, scoped to
`html[data-room="booth"]`. It is the same mechanism as the Record's deck and
`.vp-rec-sect-body`; the house now has one answer to what a typed newline means.

**THREE HOUSE PASSAGES LEFT THIS ROOM AND ARE NOT EDITED.** `KEEPER`,
`AFFILIATION` and `USE_RIGHTS` were imported here so the booth and the wing FAQs
could not drift. His rewrite gives two of those questions new wording and drops
the third question entirely ("Can I use what is here?"). The passages still
stand and are still printed — `AFFILIATION` and `USE_RIGHTS` on /wal, `KEEPER` on
/wb — because changing them to match would rewrite two rooms he did not mention.
**So the booth and /wal now answer the affiliation question in different words.**
That is Doctrine 17's exact failure mode, reached legitimately: his instruction
is authoritative for this page and only this page. **His word decides whether
/wal follows.**

**ONE STALE COMMENT IS LEFT AND NAMED RATHER THAN QUIETLY FIXED.**
`src/lib/record-read.js` says its key "is named in the booth's privacy answer
with the rest of what this site keeps in the visitor's own browser." His new
answers do not name it — they say the browser saves it and we never touch it,
which is true and is arguably better. The comment is now describing an answer
that no longer exists. Flagged for his ruling with the /wal question above,
because both are the same decision: how far his rewrite reaches.

---

# THE FOUR RULINGS — 2026-08-15, second pass

## §8 — YOUTUBE: THE EMBED IS `youtube-nocookie.com`

`host: "https://www.youtube-nocookie.com"` on the player in `Exhibit.jsx`.
Measured after: playing a song on /wal creates **one iframe, host
`www.youtube-nocookie.com`**, and the wing's transport still works (the row
marks `.tl-playing`, `.ex-banner-console` draws Stop/Play — /wal keeps its
transport in the banner, so `.pb` being absent is correct here and not a
regression).

**THE FIRST CUT BROKE EVERY VIDEO IN THE MUSEUM AND NOTHING SAID SO.** It moved
the API script to the nocookie host as well. **`https://www.youtube-nocookie.com/
iframe_api` returns 503** — that host serves embeds, not the API. `window.YT`
never arrived, no player was ever built, and there was **no console error**,
because a `<script>` that 503s is not an exception, it is a script that never
runs. Caught on the wire with the network panel; lint and both builds were green
throughout.

**SO THE HONEST SPLIT, AND THE RESIDUAL IS NAMED RATHER THAN GLOSSED:** the API
comes from `www.youtube.com` — the only origin that serves it — and the player it
builds is pointed at the nocookie host. **The embed a visitor loads is nocookie;
loading the API costs one request to `www.youtube.com` on the first play of a
visit.** That request is not removable from this code: the API is Google's and
has no other origin. What moved is the thing the ruling was about — the frame
that hosts the video, and its cookies.

**THE ELEVEN OTHER `www.youtube.com` STRINGS IN THE BUNDLE ARE LINKS, NOT
EMBEDS** — `watch?v=` and `@channel` doors a visitor clicks to leave. Checked
before assuming; his NOTE covers them.

## §9 — GOOGLE FONTS: SELF-HOSTED, VERIFIED AT ZERO

`src/styles/fonts.css` + 18 new `.woff2` under `src/assets/fonts/`, imported once
at the head of `src/index.css`. The `<link>` and both `preconnect` hints are out
of `index.html`.

**GENERATED FROM GOOGLE'S OWN CSS, NOT HAND-WRITTEN** — every `font-family`,
`font-style`, `font-weight` and `unicode-range` is Google's declaration with only
the `src` changed to a local path. Nothing about face selection moved.

**SUBSETS: latin AND latin-ext ONLY**, of the seven served (cyrillic,
cyrillic-ext, greek, hebrew, vietnamese dropped). The museum's copy is English
with accented Latin names and typographic dashes and reaches none of the five.
**The `unicode-range` declarations are kept exactly**, so a character outside the
range falls to the system stack rather than drawing from the wrong face — which
is what makes the drop safe rather than merely smaller.

**22 REDUNDANT FILES WERE DELETED BEFORE THEY COULD BE COMMITTED.** Fraunces,
Fredoka, Geist and Syne are VARIABLE fonts: Google serves one file per subset
covering every weight and declares a separate `@font-face` per weight pointing at
the same URL. The download named each by weight, so the repo briefly held up to
three byte-identical copies of one file. Deduped by sha256 and `fonts.css`
repointed: **41 files → 19, 1.4 MB → 612 KB**, with **40 faces still declared**.
Vite had already deduped them in the bundle by content hash, so nothing ever
shipped twice — this is repo hygiene, not a shipping fix.

**VERIFIED HIS WAY, WITH THE NETWORK PANEL, ON THE BUILT BUNDLE: 92 requests
across six rooms — lobby, /wal, /booth, /robots, /wb, /shop, /foundation — and
every single one is `127.0.0.1` or a `data:` URI. ZERO to any Google host.**
The launch bundle carries no `fonts.googleapis` or `fonts.gstatic` string in any
JS or CSS asset.

## §10 — `/api/visits`: NO COPY CHANGE

Ruled to survive the "No". Nothing was written, no clause was added, and the
booth's answers are untouched. Recorded here only so a future round does not
"discover" it and reach for a caveat.

## §11 — WAL's FIRST ROW IS THE DIRECTORY'S TITLE

`{ id: "wal-dir-title", header: true, title: "Worth A Listen", videos: [] }` —
the `header` row W10 built in 2026-08-02. Inert by construction: no click, no
number, no hover, no face. Measured on the page: it draws `tl-header` and the
six rows stand under it.

**PROVISIONAL IS LITERAL: a `face` makes it a page, a `jumpTo` makes it a door,
and nothing else in the wing changes.** No prose was invented and there is no
empty container behind it.

**AND IT CRASHED THE WHOLE WING ON ITS FIRST BUILD, WHICH IS THE FINDING OF THIS
PASS.** This is the **first header row the museum has ever declared** — W10 built
the mechanism and nothing used it for two weeks. `TrackList` guards it and
returns early; **four other places in `Exhibit.jsx` iterate `album.tracks` and
read `.videos` with no header check**, the nearest being
`album.tracks.find(t => t.videos.length > 0)`, which runs on every render. The
row without `videos: []` took /wal down with `Cannot read properties of undefined
(reading 'length')` — a white page and one console exception.
**Lint was green. Both builds were green. Every gate passed.** Only loading the
page found it. A track with no videos is `videos: []` everywhere in this
codebase; a track with `undefined` videos is malformed, so the fix is the
contract rather than five defensive loops.

## §12 — THE DIVERGENCE IS RECORDED, NOT FIXED

`AFFILIATION`, `USE_RIGHTS` and `KEEPER` are **untouched** on his instruction.
`docs/OPEN_ACTIONS.md` gains short-list row **15ae** and detail row **F-a** for
Sunday's walk: the booth's new wording is canonical from today, `/wal` and `/wb`
still carry the passages it replaced, and reconciling them is his writing.
`src/lib/record-read.js`'s comment about being "named in the booth's privacy
answer" is named in that row and goes with whichever way he rules.

## §13 — GATES

lint **9 / 8 = baseline** · build green · **launch build green** · provenance
**PASS** (0 undeclared, 0 stale) · `reveal:check` **PASS** · `parity` **PASS** ·
`instory` **PASS** · `docs:numbers` **PASS**.

**Nothing deployed. Nothing pushed.**

---

# §14 — THE LOBBY COUNTDOWN: THE CLOCK REPORT (NOT BUILT)

**NOTHING WAS BUILT.** His own first bullet blocks it — *"TIMEZONE RULING
PENDING from Mike — do not build until Ops confirms"* — and the target instant
is exactly what the ruling decides. Building against a guessed zone is the
"second opinion about time" the same bullet forbids. What follows is the report
it asks for.

## 14.1 — WHAT THE RECORD CLOCK ACTUALLY DOES

**IT IS REQUEST-TIME, SERVER-SIDE, AND `America/New_York`.**

| | |
|---|---|
| computed | `todayInRecordTz()` — `reveal/record-clock.mjs` |
| zone | **`RECORD_TZ = "America/New_York"`** |
| injected by | `injectClock()` in `src/worker.js`, into `<head>` of **every** HTML response |
| read by | `SERVER_TODAY` in `src/lib/record-clock.js` |
| fallback | the BROWSER's clock formatted in `RECORD_TZ`, only when nothing was injected |

Measured on the wire rather than read from source — the lobby's own response
carries:

```
<script>window.__WB_TODAY__="2026-08-15";window.__WB_RECORD_ALL__=false;</script>
```

**THE ZONE IS A RECORDED DECISION, NOT A DEFAULT.** `reveal/record-clock.mjs`
carries its reasoning: it is Mike's clock because it is his Record and his day —
his commits are stamped -0400 and his own launch report says the site went live
*"at 12:00 am Monday morning"*, which is a claim about a wall clock in a room.
The cost is stated there too: a visitor in Sydney reads Monday's entry about
fourteen hours after their own Monday starts.

**SO THE MUSEUM ALREADY HAS AN OPINION ABOUT THE TARGET INSTANT**, and a
countdown that matches the Record rather than inventing a second opinion counts
to:

```
2026-08-17 00:00 America/New_York  =  2026-08-17T04:00:00Z
```

computed from the museum's own two constants (`RECORD_EPOCH` + `RECORD_TZ`), not
typed. **The ruling he owes is whether that is the midnight he means** — his
clock, versus UTC, versus each visitor's own local midnight.

## 14.2 — THE ONE THING THE EXISTING MECHANISM CANNOT DO

**THE CLOCK IS DAY-GRANULAR. THERE IS NO SERVER TIME-OF-DAY ANYWHERE IN THE
BUILDING.** `__WB_TODAY__` is `"2026-08-15"` and nothing else; `todayInRecordTz`
formats a date and discards the time. A ticking days/hours/minutes/**seconds**
counter needs an instant, and the mechanism he told Ops to reuse does not carry
one.

**THAT IS NOT A REASON TO REACH FOR `new Date()` IN THE BROWSER** — that is the
second clock `record-clock.js` exists to refuse, in its own words: *"a browser
clock belongs to the visitor: it can be wrong by accident or on purpose."* A
countdown driven by the visitor's clock would disagree with the Record on the
same page.

**THE HONEST EXTENSION IS ONE FIELD IN THE SAME INJECTION** — `injectClock()`
already writes a payload into every HTML response; adding the server's instant
beside the date is the same mechanism carrying one more value, not a second one.
The browser then ticks a *known offset* from the server's moment rather than
trusting its own. **It is one line in the worker and one constant in
`record-clock.js`, and it is not built, because it is only worth building once
the zone is ruled.**

## 14.3 — WHAT HAPPENS AT ZERO, AND WHY THE COPY QUESTION IS ALREADY HALF-ANSWERED

**THE "NO DEPLOY" REQUIREMENT IS ALREADY SATISFIED BY THE EXISTING SWITCH** and
the countdown should ride it rather than add a rule. `ROBOTS_OPEN`
(`src/lib/wing-open.js`) already decides which of the two lobby paragraphs draws
— *"We're not open yet…"* against *"Welcome. The first 100 people…"* — and it
derives from the Record via the injected date. **No deploy turns it; a page load
after midnight does.**

**ONE CONSEQUENCE THAT MUST BE DESIGNED FOR RATHER THAN DISCOVERED:**
`ROBOTS_OPEN` is a `const` evaluated **once at module load**. A tab left open
across midnight holds the pre-launch value until it is reloaded. So a live
counter that reaches 00:00 in an open tab arrives at zero while the page around
it still believes the museum is shut. Whatever it shows at zero has to be true
in that tab, without a reload.

**THE OPTIONS AT ZERO, FOR OPS TO RULE — NO COPY IS INVENTED HERE:**

1. **The counter is replaced by the open-state copy it was counting toward.**
   Reads as the moment arriving; needs the countdown to trigger the same swap
   `ROBOTS_OPEN` performs, in-tab, so the two cannot disagree.
2. **The counter holds at all-zeros** and the page is otherwise unchanged until
   a reload. Honest and cheap; a row of zeros is a dead object on the glass for
   as long as the tab stays open.
3. **The counter removes itself** and leaves the copy beneath it standing.
   Nothing is claimed that the tab cannot back up.
4. **It counts UP** — time since opening. A different object with a different
   job, and a decision about what the lobby is for after launch rather than a
   fallback.

**Ops' note, not a ruling:** 1 and 3 are the only two that leave nothing stale on
the glass, and 3 is the one that needs no new copy from Mike at all.

## 14.4 — WHERE IT WOULD GO

`src/routes/WbHome.jsx`, the `ROBOTS_OPEN ? … : …` branch at the `.wb-note`
paragraph. The pre-launch copy is the second arm. "Big and obvious, desktop
leads, phone may wrap" is a new object above that paragraph; nothing existing
moves.

**WAITING ON: the zone.** Everything else in this section is measured and ready.

---

# §15 — THE LOBBY COUNTDOWN (BUILT, 2026-08-16)

**HIS RULING:** *"Monday 17 August 2026, 00:00 America/New_York. The museum's own
clock, matching the doors."* He reversed an earlier local-to-the-visitor reading
once §14's clock report showed the Records are NY-locked server-side: a Tokyo
visitor would have watched the counter reach zero thirteen hours before the doors
opened and found the museum shut.

## 15.1 — THE THREE PIECES

| | |
|---|---|
| `reveal/record-clock.mjs` | `dayStartInRecordTz(day)` — a day string to the instant it begins in `RECORD_TZ`. Two-pass offset so a DST-day launch is right. |
| `src/worker.js` | **one field**: `window.__WB_NOW__=${Date.now()}` beside the date it already injected. |
| `src/lib/record-clock.js` | `SERVER_NOW` + `museumNow()` — the server's instant advanced by `performance.now()`. |

**NO NEW DATE LITERAL.** The target is `dayStartInRecordTz(RECORD_EPOCH)` =
**2026-08-17T04:00:00Z**, read back as *Monday, August 17, 2026 at 12:00:00 a.m.
EDT*. A launch slip still moves one field and the countdown follows.

**THE BROWSER MEASURES ELAPSED TIME, NOT TIME.** The origin is the server's;
`performance.now()` is monotonic, so changing the device clock cannot move the
counter. `Date.now()` is the fallback only when nothing was injected, and
`SERVER_NOW === null` is exposed so a caller can tell.

## 15.2 — AT ZERO, PROVED RATHER THAN ASSERTED

**It removes itself, live, in a tab left open, with no reload.** Proved by moving
the target to seconds away in a throwaway build and watching one page cross it:
the counter ticked down to the crossing and then
**`countdownStillInDom: false`, `noteStanding: true`** — gone, copy standing,
zero reloads. The real target was restored immediately (`WbHome.jsx` was copied
aside first and copied back).

**`ROBOTS_OPEN` DID NOT NEED SOLVING, AND THAT IS WHY THIS WORKS.** The countdown
renders **outside** the `ROBOTS_OPEN` branch and decides for itself from the
museum's clock, so the module-load const never enters into it. What remains
stale in such a tab is the *copy* — but that is exactly his ruling: the counter
goes, the copy beneath stands, nothing new is written.
**The one thing that still needs a reload is the `/robots` ROUTE** (`App.jsx`
reads the same const). Stated rather than hidden: it is unreachable from a
pre-launch lobby, which publishes no door to that wing.

## 15.3 — ONE DEFECT FOUND BY LOOKING, NOT BY GATES

**A BACKGROUND TAB THROTTLES THE TICK.** Measured, not assumed: with the tab
hidden, a 2000ms probe fired at 95, 97, 99, 101, 103, 105 and then jumped to
**121** — Chrome had cut it to roughly once a minute. The countdown froze at
`00:00:00:47` on screen for the same reason.

**THE COUNTER WAS NEVER WRONG — IT RECOMPUTES, IT DOES NOT DECREMENT**, so a
throttled tick skips values instead of drifting, and the crossing to zero still
happened on time in that hidden tab. What was wrong was the WINDOW between a
visitor looking and the next throttled tick. A `visibilitychange` listener now
recomputes the moment the tab is shown, before the first paint they see.

**Every gate was green while it was frozen.** Only loading the page and leaving
it alone found it.

## 15.4 — MEASURED ON THE GLASS

Desktop 1568px: **67.2px** Syne numerals, four cells in one row, above the note.
390-class width: **38.4px**, still one row, page overflow **0**.
**320px and 280px: wraps to two rows, no horizontal overflow** — "desktop leads,
phone may wrap", by `flex-wrap` and a `min-width` rather than a breakpoint.
`tabular-nums` is load-bearing: without it the seconds column resizes every tick
and the row jitters.

**PAIRED WITH THE RIGHT COPY, CHECKED IN BOTH STAGES.** In DEVELOPMENT the lobby
shows the open wording (`ROBOTS_OPEN` is unconditionally true there), so the real
pairing was verified on a **launch build**: the countdown sits above *"We're not
open yet. But you found us — which means something."*

`aria-live="off"` deliberately — a screen reader announcing a number once a
second is unusable, and the sentence beneath carries the same fact in words.

## §16 — THE PORTAL SWITCH PUZZLE: RECORDED, NOT SOLVED

`docs/OPEN_ACTIONS.md` gains short-list row **15af** and detail row **PZ-a**.
Record 1.5's *Communications Parity Bias Setting Mismatch*, four unlabelled
toggles, both proposed answers rejected — one does not scale past a single
channel, the other gates on outside knowledge (*"going to scare away
anybodies"*). Owner **Mike + Ops, together**. Not designed, not needed before the
doors open, and deliberately not solved here.

## §17 — GATES

lint **9 / 8 = baseline** · build green · **launch build green** · provenance
**PASS** (6 rows added: four unit labels MIKE, the aria-label and the injected
payload HOUSE) · `reveal:check` **PASS** · `parity` **PASS** · `instory` **PASS**
· `docs:numbers` **PASS**. Dev build restored as the working state.

**Nothing deployed. Nothing pushed.**

---

# §18 — MIKE'S WEEK-1 WRITING LANDED (2026-08-16)

Source: `C:\AI\_week01\WEEK01_records-001-to-005.xlsx`. Backup of the file
replaced: `C:\AI\_week01\_backup_robots-record_before-land-20260816.js`
(sha256 `c95f6e34…`). Register backed up beside it.

**RESULT: 001, 002, 004, 005 regenerated · 003 carried through untouched · 5
records · every string round-tripped.** Verified independently field by field
against his workbook: **32 fields across 5 records, 0 mismatches.**

## 18.1 — TWO GUARDS REFUSED FIRST, AND BOTH REFUSALS WERE RIGHT

**GUARD: COMMENTS INSIDE A CHANGED ENTRY.** Record 001 carried **three comment
blocks, 9,751 characters**, and `record:land --write` refuses to regenerate an
entry that does — *"a generated entry has nowhere to put them."*

Its own remedy was taken: **move the reasoning above the entry.** `--write`
splices only between `RECORD_ENTRIES = [` and its closing bracket and preserves
the preamble, so the preamble is where reasoning survives a landing. All three
blocks were moved **verbatim, in order, not one character edited**, under one
dated header that says what they document and — plainly — that the entry's TEXT
was replaced on 2026-08-16, so any sentence quoting a specific old line is
describing text that is no longer there. **The rulings in them all still stand**
(the date rule, the verbatim rule, Doctrine 21, no invented tomb), which is why
they are kept rather than pruned. Measured: comment characters **12,042 →
13,375**, so nothing was lost.

**GUARD: THE DRAFT IS OLDER THAN THE RECORD.** Second refusal — the draft was
stamped 13:36:38 and the file 13:38:04, because **moving the comments had just
touched the file**. A false positive created by my own edit, not a stale draft:
the content comes from the workbook, not the editor. Fixed by regenerating the
draft (same bytes, new stamp) rather than by bypassing anything.

## 18.2 — WHAT IS ON THE PAGE NOW

```
001  INITIAL LAUNCH REPORT - Weird.Baby   deck yes   5 sections
002  GENERAL STATUS UPDATE                deck yes   2 sections
003  DATA EXTRACTED - Weekend Robots…     deck yes   2 sections  (untouched)
004  (no headline)                        no deck    1 section
005  (no headline)                        no deck    1 section
```

**BALD HEADINGS: ZERO.** Every section carries a body. Records 002 and 003 each
have a second section with **no label** — his own deletion of those headings —
and `RecordEntry.jsx:618` renders `{s.label && …}`, so nothing draws. Not a
defect.

**ADDENDUM 01 IS NOW THE REAL TEST OF `white-space: pre-line`.** It landed as
**2 paragraphs carrying 10 lines** (8 timestamps + 2 prose), where the old tree
held the same content as **24 separate `<p>` elements**. Without `pre-line`
those ten lines would collapse into two run-ons. The declaration is present in
the CSS being served:
`.vp-rec-sect-body{…white-space:pre-line;…}`.

## 18.3 — THE INSPECTION: SEEN, ON THE GLASS

The Chrome extension dropped immediately after the rebuild and this section
first recorded that the visual pass had NOT been done. Mike restarted Chrome and
it was done. Recorded this way round rather than rewritten silently, because a
log that quietly upgrades "not seen" to "seen" is the one thing that would make
the Inspection Law's answers untrustworthy.

**ALL FIVE OPENED, MEASURED:**

| | headline | deck in open entry | sections | empty bodies |
|---|---|---|---:|---:|
| 001 | INITIAL LAUNCH REPORT | 1 | 5 | 0 |
| 002 | GENERAL STATUS UPDATE | 1 | 1 drawn (+1 unlabelled) | 0 |
| 003 | DATA EXTRACTED… | 1 | 1 drawn (+1 unlabelled) | 0 |
| 004 | (none, his) | 0 | 1 | 0 |
| 005 | (none, his) | 0 | 1 | 0 |

**ADDENDUM 01 DRAWS AS TEN LINES.** Measured per LOGICAL line, not by counting
line boxes: each newline-delimited segment begins a fresh line box at the
block's left edge, tops **790 · 817 · 844 · 871 · 898 · 925 · 952 · 979 · 1006 ·
1060**, all distinct, `white-space: pre-line` computed on the element. The two
prose sentences wrap, which is `pre-line` honouring the newline and still
wrapping a long line — correct, not a fault.

**NO BALD HEADINGS ON THE PAGE.** Zero empty bodies across all five. 002's and
003's second sections carry no label and draw no heading, which is his deletion
working.

**THE DECK DRAWS TWICE, IN THE TWO VIEWS.** Three of the five index rows carry a
deck (001–003; 004 and 005 have none, his), and the opened entry draws it once
more at the top. 004 and 005 open with no deck, as they should.

**NOTHING READS WRONG.** The one thing worth his eye is not a defect: 004 and
005 are a single EXECUTIVE SUMMARY each with no headline and no deck, so their
index rows are two short marks — `004 THU`, `005 FRI` — against three full rows
above them. That is his writing as it stands, not a rendering fault.

Gates: lint **9 / 8 = baseline** · build green · provenance **PASS** (11 MIKE
rows added, 29 stale pruned) · `reveal:check` **PASS** · `parity` **PASS** ·
`instory` **PASS** · `docs:numbers` **PASS**.

**Nothing pushed. Nothing deployed.**

---

# §19 — THE READER LEARNS MIKE'S HAND-BUILT SHEET SHAPE (2026-08-16)

Source of truth: `NEW_RECORD_MAKER_V3.xlsx`, **23,681 bytes, 2026-08-16
00:33:01, sha256 `2D59586B…`** — both stamps verified against his before a byte
was read. It was NOT at the agreed hand-off path (`C:\AI\_week01\`); Ops stopped
and asked, and he ruled the Desktop copy in. Backup of the reader:
`C:\AI\_week01\_backup_workbook_to_draft_before-v3.py`. **Nothing was landed.**

## 19.1 — THREE THINGS THE BRIEF SAID THAT THE FILE DOES NOT

Every rule was verified against the workbook rather than taken from the
description, and three did not survive that:

1. **"a blank gap ends a section" — FALSE, AND IT WAS THE DANGEROUS ONE.** REC
   1.1's ADDENDUM 01 runs rows 19–26, blanks at 27, then continues 28–29 before
   the next label at 31. Reading a blank as a section end would have ORPHANED
   every one of those tails — four of them across the five sheets. **A blank is
   a PARAGRAPH break; only a bold label ends a section.** That rule reproduces
   the structure already in the tree exactly (001's ADDENDUM 01 = 8 lines + 2
   lines = 2 paragraphs).
2. **Row 2's label is not one literal.** REC 1.1 says `HEADLINE - Do not include
   in Record`; the other four say `HEADLINE`. The guard matches the SUBSTRING —
   matching the whole string would have refused four correct sheets.
3. **The `=` marker does not appear.** Measured across all five: **50 `>`, 5
   `?`, 3 `!`, 2 `<`, zero `=`.** All five are supported anyway — "not used
   today" is not "not his".

## 19.2 — WHAT IT DOES

`REC W.D` → `(W-1)*5 + D`, weekdays only. Header fixed at rows 1–6 (title,
HEADLINE label, **week-plan beat — never ships**, headline, deck 1, deck 2);
body walked from row 7, bold column-B cell opens a section, blanks break
paragraphs. The `{NOT PART OF THE REPORT…}` block and everything below it is cut
**positionally, not by braces** — REC 1.5 has an unbraced line inside that block
(*"Release the Portal Album."*) that a brace-based cut would have carried into
the entry.

**BOTH SHAPES LIVE, AND NEITHER IS A FALLBACK FOR THE OTHER.** `Record\s+\d+`
and `REC W.D` cannot both match a tab, so a sheet is read by exactly one reader
or by none. **Regression proved: the old workbook's output is byte-identical to
yesterday's draft.**

## 19.3 — COLUMN C NEVER SHIPS, AND HERE IS HOW THAT WAS CONFIRMED

**In the code:** the REC path has exactly one cell accessor, `_col_b`, which
hard-codes `column=2`; the only other reader is `_bold_b`, also column 2. There
is no expression in `read_rec_sheet` that can name column 3. Column A is not
read either.

**On the data:** the workbook holds **13 non-empty column-C strings** (including
*"I was hired in 1998, fired in…"*). **Zero of them appear in the emitted
draft.** The dropped block was checked the same way — `EGGPLANT`, `NOTES TO
CLAUDE`, `Ops wrote`, `Ops proposes`, `Release the Portal Album`: **all absent.**
So are all five week-plan beats.

## 19.4 — THE GUARDS, PROVED BY BREAKING THEM

The old `EXPECT` guard covered three rows. This one covers four independent
faults, each tested on a scratch copy — **his file was never modified**:

| break | result |
|---|---|
| header shifted down one row | **REFUSED** — *row 2 … expected the HEADLINE label* |
| tab renamed `REC 1.1` → `REC 2.3` | **REFUSED** — *the tab is Record 008, the sheet says RECORD 1.1* |
| row 1 re-dated to 2026-09-14 | **REFUSED** — *Record 001 falls on 2026-08-17; this reader will not choose* |
| headline row emptied, beat left | **REFUSED** — *refusing rather than landing the beat* |
| **control — his file untouched** | **accepted** |

Each fired for its own reason, not all on the first. The date check is the one
the old guard had no equivalent of.

## 19.5 — WHAT THE FIVE RECORDS READ AS

```
001  INITIAL LAUNCH - Weird.Baby Website   deck ✓   6 sections,  7 paragraphs
002  GENERAL STATUS UPDATE                 deck ✓   4 sections,  5 paragraphs
003  GENERAL STATUS UPDATE                 deck ✓   5 sections,  6 paragraphs
004  GENERAL STATUS UPDATE                 deck ✓   4 sections,  5 paragraphs
005  GENERAL STATUS UPDATE                 deck ✓   4 sections,  5 paragraphs
```

**REFUSALS AND WARNINGS, BOTH REAL AND BOTH HIS TO RULE ON:**

- **Record 002's deck is 132 characters against a 130 limit.** The reader warns;
  it does not truncate.
- **Record 003 will not land: two braces in its ATTACHMENTS** — *{manual pages
  referencing The CEO and The Informer}* and *{raw data examples. Mix in eggs}*.
  The brace guard names both and refuses, exactly as before. That is the
  mechanism working, not a fault in the sheet.

**NOTHING WAS LANDED.** The tree still holds the writing landed this morning
from the old workbook. Lint **9 / 8 = baseline**.

**Nothing pushed. Nothing deployed.**

---

# §20 — TWO EDITS TO HIS WORKBOOK (2026-08-16)

`NEW_RECORD_MAKER_V3.xlsx`, edited in place. Backup:
`C:\AI\_week01\_backup_NEW_RECORD_MAKER_V3_before-edit-20260816.xlsx`
(sha256 `2D59586B…`, the identity verified before the edit).

**(a) REC 1.3 ATTACHMENTS** — both braced lines moved from column B to column C
on their own rows, **verbatim including their leading spaces**; column B body
set to `  > n/a`, matching REC 1.2 and 1.5.
**(b) REC 1.2 deck line 2** — *"no net impact."* → *"no impact."*, taking the
deck from **132 to 128** against the 130 limit.

**970 CELLS COMPARED AGAINST THE BACKUP; 5 CHANGED; ALL FIVE INTENDED.** The
workbook's five formulas survive (they pull each sheet's `B4` headline into the
plan, and `B4` was not touched). openpyxl drops cached formula values, so those
five recalculate when Excel next opens the file — the same known cost as the 314
removal, and it is invisible to the reader, which reads column B.

**AFTER: ALL FIVE READ CLEAN, NO WARNINGS, NO REFUSALS.**

```
001  INITIAL LAUNCH - Weird.Baby Website   6 sections,  7 paragraphs
002  GENERAL STATUS UPDATE                 4 sections,  5 paragraphs
003  GENERAL STATUS UPDATE                 5 sections,  6 paragraphs
004  GENERAL STATUS UPDATE                 4 sections,  5 paragraphs
005  GENERAL STATUS UPDATE                 4 sections,  5 paragraphs
```

003's ATTACHMENTS body is now `['  > n/a']`; the emitter runs to **exit 0, 5
records, zero braces in the entry text**. The two notes are in column C, which
the reader cannot read. **Nothing was landed.**

# §21 — THE ATTACHMENT MECHANISM, SCOPED (NOT BUILT)

## 21.1 — THE CORRECTION IS BIGGER THAN THE BRIEF THOUGHT

The earlier Ops call was *"nothing in the site declares attachments today."*
That is true of the DATA and **false of the CODE**. The mechanism is built,
mounted and rendering:

- `src/routes/exhibit/RecordAttachments.jsx` — the renderer, A1/A2 2026-08-08.
- `attachmentsOf()` in `src/lib/record-model.js` — flattens three field kinds
  into one list.
- `RecordEntry.jsx:633` — **already mounts it** at the foot of every opened
  entry, after the writing, per Mike's own ruling.

**SO THE ANSWER TO "WHAT DOES IT TAKE FOR A RECORD TO CARRY ATTACHMENTS" IS: A
FIELD ON THE ENTRY, AND NO CODE AT ALL.** Three kinds already exist —
`wire` (a transmission: lines of text, no image), `plates` (photographs:
`{img, label, date}`), `docs` (documents: `{title, source, date, pages, scan,
plates, extract, note}`).

## 21.2 — A LINK IS NOT CHEAPER. IT IS NOT SUPPORTED AT ALL.

Mike's *"even if it is a link"* assumes a link is the lesser build. **It is the
larger one.** `RecordAttachments.jsx` contains no `<a>`, no `href` and no `url`
— a row either opens a picture in the wing's own reader or is inert. Adding an
external link means a new affordance on a surface whose governing ruling is
*"no envelope furniture of any kind"*, and it would be the first outbound door
in the Record.

**The cheap path is a `docs` entry with no image.** That is already a supported
and DESIGNED state: no `scan` and no `plates` gives a glyph, the row prints
`not here yet`, and `docState`'s empty-and-honest discipline covers it. A plate
that has not been photographed yet can be listed on Wednesday and gain its image
later **with no change to the entry's shape**.

## 21.3 — MEDIAVAULT IDS: NOTHING CONNECTS THEM TODAY

`MV-YYYYMMDD-NNN` appears nowhere in `record-model.js`, `RecordAttachments.jsx`
or `robots-record.js`. The Record's chain speaks **paths, not ids**:
`ASSET_LIKE = /^\/[\w\-./]+\.\w{2,5}$/` in `reveal/record-entries.mjs` treats any
rooted file-path string anywhere in an entry as one of that entry's assets —
deliberately generic, *"so an entry that carries a second photograph joins the
asset table without this file being edited."*

**So an MV id would need a resolver: id → path, run at export or at land.** That
is the one genuinely new part, and it is not needed for Wednesday: the export
already writes files to paths, and a path is what every downstream instrument
already understands. **Recommend paths on Wednesday and an id resolver only if
he wants the Record to name artifacts the way MV names them.**

## 21.4 — held/ AND THE LAUNCH BUNDLE ALREADY HANDLE THIS

This is the part that needs no design, and the stage build says so in its own
output: *"reveal:day --place renames a delivered file out of held/ before the
build, so nothing a Record delivers is affected."*

The chain, all of it existing: an entry names `/robots/…/plate-07.png` →
`record-entries.mjs` picks it up as that entry's asset → `reveal:day --place`
moves the file out of `public/held/` on that entry's day → `delivery.mjs` fails
the build **in both directions** (an undelivered file at a public address, and a
delivered file still behind the door). The 144 held files are held **because no
entry delivers them**; the moment one does, that file is placed.

## 21.5 — THE SMALLEST THING THAT WORKS BY WEDNESDAY

**Zero code. One field, three lines of data, two existing commands.**

1. Add `docs: [...]` to Record 003's entry, one object per plate — `title`,
   `source`, `date`, and `scan` where a photograph exists.
2. Put any image under `public/held/robots/…`; add its `provenance/assets.json`
   row and run `npm run assets:scan` (the standing rule for any new media file).
3. `npm run reveal:day -- --place` on the 19th; standing gates; deploy.

**Plates with no photograph yet need step 2 at all** — they list, they say *not
here yet*, and they gain an image whenever one exists. That is the version that
cannot slip: it depends on nothing that does not already work.

**What Ops should NOT do without his word:** add an external-link affordance
(21.2), or build an MV id resolver (21.3). Neither is needed for Wednesday and
the first is a boundary question, not a build.

**Nothing built. Nothing pushed. Nothing deployed.**

---

# §21 — WEEK 1 LANDED FROM V3, AND THE HANDOFF (2026-08-16)

**TWO RULINGS RECORDED, NEITHER BUILT:** no external link affordance on the
Record (it would be the first outbound door, against the no-envelope-furniture
ruling — use a `docs` entry with no image), and no MediaVault id resolver
(paths for now).

**LANDED.** Source `NEW_RECORD_MAKER_V3.xlsx`. All five regenerated, none
carried through. **Round-trip: 56 fields across 5 records, 0 mismatches.**
Backup `C:\AI\_week01\_backup_robots-record_before-v3-land.js`.

**THE COMMENT GUARD FIRED AGAIN, ON RECORD 003 THIS TIME.** 003 was the entry
carried through untouched this morning, so its `[E2 2026-08-09]` block survived
— and the moment its text changed, the guard stopped the landing exactly as
designed. Same remedy as 001's three blocks: moved into the preamble verbatim,
under a dated header saying the entry's text was replaced and the block
describes the section that used to be there. **The guard has now caught two
different entries on two different days; it is doing real work, not ceremony.**

**THE INDEX HAS NO BARE ROWS.** Measured on the built page: five rows, **all
five carrying a headline AND a deck**, zero bare, and **every row exactly
94px**. R3's rule that all index rows are the same height is satisfied — the
84px/157px pair that `S-b` tracked for three rounds is gone, because 004 and 005
now have headlines and decks of their own.

004 and 005 open with four sections each, one deck each, and **no empty bodies**.

**ONE THING RAISED FOR HIM RATHER THAN DECIDED.** His workbook carries an
**ATTACHMENTS section** — a bold label in column B — which lands as an ordinary
text section reading `> n/a`. That is not the attachment MECHANISM. When
Wednesday's `docs` field is added to 003, the entry will draw **both** his text
section headed ATTACHMENTS and the real Attachments block beneath the writing.
The likely answer is that his section becomes the `docs` field rather than
sitting beside it — **his call, and it is in the handoff.**

**HANDOFF WRITTEN:** `docs/HANDOFF_next_session.md` — HEAD, what is unpushed,
the attachment findings, the two rulings, and Wednesday's `docs` requirement.

Gates: lint **9 / 8 = baseline** · build green · provenance **PASS** (37 MIKE
rows added, 25 stale pruned) · `reveal:check` **PASS** · `parity` **PASS** ·
`instory` **PASS** · `docs:numbers` **PASS**.

**Nothing pushed. Nothing deployed.**
