# JOB 1 — THE FACT SCRUB
2026-08-11/12 · **READ-ONLY** · nothing deleted, nothing edited. This is the pile.

**The per-fact verdicts are a separate file: `1b_every-fact-judged.md` — 362 facts,
worst-first inside each artist.** This one is the argument.

---

## WHAT YOU HAVE TO DECIDE

1. **One fact reprints thirty words of your own artist's lyrics.** The vault's
   own written law says *"NO LYRICS, EVER."* It is on the live glass now. I did
   not delete it because the job said propose. **Say the word and it goes.**
2. **Your instinct is right and the number is 156 of 362.** 123 WEAK, 33
   SUSPECT, 9 WRONG. That is 43% of the corpus that I would not defend to a
   stranger.
3. **Three of the eight songs in the room have no song facts at all** — not
   thin, none. You named two; there is a third.
4. **Rebuild or scrub?** My recommendation is in §1g and it is: **scrub to 197,
   then rebuild song-tier only.** The artist-tier keepers are good.

---

## 1a — THE CORPUS

| where | facts | on the glass? |
|---|---|---|
| `src/data/artists/worth-a-listen-facts.js` | **311** | **YES** — the `/wal` wing, all four artists |
| ↳ of which imported from `src/data/exhibits/hunter_root.facts.json` | 97 | yes, re-pointed as `WAL-HR-*` |
| ↳ authored directly in that file | 214 | yes |
| `src/data/exhibits/hunter_root.facts.json` | 97 | also served to `/hr`, which is behind the password |
| `src/routes/hr/hr_facts.js` | **51** | **NO — retired, and nothing imports it** |
| `/robots`, `/foundation`, `/weird-baby` | **0** each | they declare `facts: []` |

**Total judged: 362.**

**The whole live fact corpus is one wing.** The Robots wing — the one opening
Monday — has no facts at all. That is by design (`facts: []` is deliberate), but
it is worth knowing before you decide how much of this to rebuild.

**A fact's shape** is the same everywhere:

```
{ id, lines: [line1, line2?], tags: { album:[], song:[], source:[], topic:[] } }
```

Line 1 is the fact. Line 2 either finishes it or is a breadcrumb starting with an
em-dash (`— Speaker, Outlet, Year`), which the renderer demotes to a small box.
`hr_facts.js` uses an older, different shape (`albumId` / `trackId` / `weight`).

---

## 1b — THE VERDICTS

| | count | share |
|---|---|---|
| **KEEP** | 197 | 54% |
| **WEAK** | 123 | 34% |
| **SUSPECT** | 33 | 9% |
| **WRONG** | 9 | 2% |

Per artist:

| artist | facts | KEEP | WEAK | SUSPECT | WRONG |
|---|---|---|---|---|---|
| Hunter Root (incl. the 51 retired) | 168 | 86 | 54 | 19 | 9 |
| Carsie Blanton | 68 | 42 | 26 | — | — |
| Jesse Welles | 63 | 27 | 34 | 2 | — |
| Mikey Mike | 59 | 38 | 9 | 12 | — |
| the wing itself | 4 | 4 | — | — | — |

**Jesse Welles is the worst wing on the floor: 34 of 63 WEAK.** Almost all of it
is one defect — see 1e.

### The one that is worse than WEAK

**`MV-HR-20260707-056`** — live on `/wal` right now:

> Back in 1994 / Glad I woke up but I didn't wake up too sure / Back in 1993 /
> The devil made his way inside a kid and then he never broke free…

That is **thirty words of verbatim lyric from "'94"**. Three reasons it is the
top line of this report:

1. **It breaks the vault's own written law.** `worth-a-listen-facts.js` states
   the phrasing law in its own header, rule 5: *"NO LYRICS, EVER. Song lyrics
   are not facts and are not ours to reprint."* The file that says it is the
   file that serves this.
2. **It is not a fact.** It makes no claim. It is the song, quoted.
3. It is our own artist, which makes it *survivable* — and makes it no less a
   rule the house wrote and then broke.

---

## 1c — FACTS SOURCED FROM PRESS, PROMO BIOS, OR OTHER FACTS

**95 of the 97 vault facts carry `source: press`.** The other two are
ReverbNation. **Not one of the 97 has a primary source** — no liner note, no
document, no direct correspondence. Every one is somebody else's write-up.

### Facts sourced to a promo bio or a label-supplied page — 11

Apple Music and Deezer artist pages are **supplied by the label or the
distributor**. Quoting them is quoting the artist's marketing.

- `WAL-126`, `WAL-137`, `WAL-138`, `WAL-141`, `WAL-144`, `WAL-157`, `WAL-175`,
  `WAL-176` — Mikey Mike, all "— Apple Music, read 2026".
- `WAL-173` — "— Deezer, read 2026".
- `WAL-180` — "Deezer counts 655 people following him." A follower count on one
  platform, plus **our own verdict on a living artist** in the second line: *"He
  is not a big artist by the numbers."*
- **`WAL-181` is the clean case:** *"One write-up calls him 'a music industry
  enigma' — Deezer artist biography."* That is a promo bio being quoted as
  though it were criticism.

### Facts that are a press release with the letterhead removed — 6

No attribution, and the content is exactly a one-sheet: producer, engineer,
studio, label, release date, session players, gear, tour routing.

`MV-HR-20260707-053` · `-054` · `-059` · `-060` · `-063` · `-064`

The gear one is the tell: *"vintage mics once used by Bob Dylan and Marianne
Faithfull, and reverb plates from Johnny Cash sessions."* Unverifiable, and
exactly what a studio's publicist writes.

### Facts sourced to "press coverage" — no outlet, no writer, no date — 2

`WAL-106` (*"described as 'a modern Woody Guthrie'"*) and `WAL-161`. The vault's
own rule 2 requires every quote to be attributed. These are not walkable back.

### Facts sourced from a self-serve profile field — 3

`MV-HR-20260707-007` and `-008` are a **ReverbNation "Influences" form field**
pasted whole, typo and stray capitals intact — *"Inspired by other's talents,
Emotions, Thoughts, Existence, Pain."* `-008` is worse: *"We're musically
Influenced by…"* is the **band** speaking, filed as Hunter's own words.
`artist-007` in the retired file then launders both into one museum fact.

### Facts sourced from another fact

`artist-007` (above) is the only true case — the retired file restating vault
facts as house prose. **But the 97-fact vault is imported wholesale into the WAL
pool**, so every Hunter Root fact in `/wal` is a second-hand copy of a
second-hand source by construction. That is not a defect; it is worth naming.

---

## 1d — INTERNAL CONTRADICTIONS

### The death year — the one you remembered, and it is already contained

- **The truth, sourced twice:** `MV-HR-20260707-037` is Hunter's own words to
  Whiskey Riff in 2023 — *"Nick passed away two years ago as of April 15th at
  the age of 27. I was 26 when he died."* → **15 April 2021**. `-058` has
  Isthmus independently saying *"who died in 2021."*
- **The error:** `hr_facts.js:176` — *"2020. The year Hunter's brother Nick
  died."* — and `hr_facts.js:423` — *"Nick is here again, as he has been since
  2020."*

**It is not on any glass.** `src/data/artists/hunter-root.js:3` records that
`hr_facts.js` was retired from the live path in July 2026 *specifically because*
of this, and nothing imports it. The note promises a *"salvage brief"* for the
seeds worth keeping. **That brief was never written**, so 51 facts — good and
bad — have sat unresolved in the tree since.

**And `MV-HR-20260707-001` is how it should be done:** *"He was gone at 27, taken
by cancer."* No year. The vault dropped a date it could not source rather than
hedge it. That precedent is written into the phrasing law and it worked.

### Town Rat Heathen — two different viral stories

| | claim |
|---|---|
| `MV-HR-20260707-041` (live) | *"went viral. Nearly a million **Spotify streams** inside **four months**."* |
| `ark-album-001` (retired) | *"crossed a million **views** in the **weeks** after it was posted."* |

Different platform, different clock, same song. The retired one carries its own
`BACKLOG: Verify` flag in the file header and was never verified.

And a third framing fights both: `ark-trt-001` says it *"spread person to person
before the algorithm caught up"* — while `MV-HR-20260707-048` has Hunter saying a
**twenty-second TikTok clip hit 500k views and that is why he finished the
song.** The TikTok clip *is* the algorithm.

### "Addict parents" — unsupported and serious

`crooked-intro-001` (retired) states flatly: *"Inherited damage. **Addict
parents.** A childhood behind a bathroom door."*

**No vault fact supports it.** The vault says his **father was in jail**
(`-085`) and his **brother** was the addict (`-069`, heroin from about fifteen).
This is a claim about real living people that the sourced record does not make.

### Where he lives

`artist-001` (retired) says *"based out of Lancaster"*; `MV-HR-20260707-079`
says *"based in **Columbia**, outside Lancaster."* Untidy rather than wrong.

### Three view counts with no date

`ark-quicksand-002` (2.5M), `ark-reverend-002` (1.6M), `crooked-cookin-001`
(500K) — all retired, all undated. The vault's own law: *"a count without a date
is a claim that rots."*

---

## 1e — THE VOLUME QUESTION

Your instinct — *"a publication may reasonably regard ten of its best lines as a
substitute for reading it"* — is the right worry, and the measurement is worse
than ten.

### The vault: 41 of 97 come from four interviews

| outlet | facts | what it is |
|---|---|---|
| **Blue Harvest Beat, 2014** | **11** | one band Q&A, twelve years old |
| **Americana Highways, 2025** | **11** | one interview |
| **MuzicNotez, 2024** | **10** | one interview |
| **The Country Note, 2025** | **9** | one interview |
| LancasterOnline / LNP, 2019 | 7 | |
| Whiskey Riff, 2023 | 6 | |
| Chasing Destino, 2018 | 5 | |
| Shore Fire Media (PR agency), 2025 | 3 named + ~6 unattributed | |
| Isthmus · NEPAudio · PA Musician | 5 | |

**Eleven consecutive facts from one 2014 Q&A is not sourcing, it is
transcription.** And Blue Harvest Beat is the weakest of the four by content:
it produced the midnight-snack question, the "influences" form field, and two
critic flourishes.

### Jesse Welles: 32 of 63 from Wikipedia, and 12 more from a scraper

- **32 facts are Wikipedia**, most of the form *"X came out in YYYY. — Wikipedia,
  read 2026."*
- **12 more are the YouTube upload log** — *"X went up on DATE. N views as of 2
  August 2026."*

That is **44 of 63 from two automated reads.** The wing has an artist's page and
a scraper, and almost nothing else.

### Carsie Blanton: 22 Wikipedia + 13 upload-log

### Mikey Mike: 7 from ONE 2017 blog post (Faded Glamour), 6 from ONE 2020 interview (Titusville), 11 from Apple Music and Deezer

**That is 24 of 59 from two write-ups and two shop pages.**

### The deeper defect: it reads as a filled-in form

54 pairs of facts share more than half their words. They are not duplicates —
they are **the same sentence with the nouns swapped**:

- *"Buoy came out in 2009. — Wikipedia, read 2026"* · *"Beau came out in 2010. —
  Wikipedia, read 2026"* · *"So Ferocious came out in 2016…"* — **about 20 of
  these**, one per album. That is a discography table cut into cards.
- *"'Rich People' went up on 20 February 2026. 47,968 views as of 2 August
  2026."* — **about 30 of these** across three artists.
- *"Fifteen uploads sit on **her** channel's current feed."* /
  *"Fifteen uploads sit on **his** channel's current feed."* — identical
  sentence, two artists, and neither is a fact about music.

**A reader who meets three of these in a row has learned our machine, not the
artist.** That, not the outlet concentration, is what the volume is costing.

---

## 1f — WHERE IT IS THIN

The room holds **eight songs, two per artist**. Song-tier facts are what fire
when a visitor plays a track, so this is the tier that matters most.

| song | artist | song facts | real ones |
|---|---|---|---|
| **"That Can't Be Right"** | Jesse Welles | 1 | **0** |
| **"There's A Hole"** | Jesse Welles | 2 | **0** |
| **"Nothin' Wrong"** | Hunter Root | 3 | **0** |
| "Be Good" | Carsie Blanton | 4 | 2 |
| "Shit List" | Carsie Blanton | 4 | 2 |
| "Cooler" | Mikey Mike | 4 | 2 |
| "Doin' Me" | Mikey Mike | 6 | 6 |
| "'94" | Hunter Root | 9 | 7 |

**You named two. There are three.**

- **"That Can't Be Right"** — its one fact is *"sits on his own channel.
  Confirmed from the upload itself."* That is a fact about our verification, not
  about the song. **Effectively zero.**
- **"There's A Hole"** — its two facts are **the same fact twice**: `WAL-208`
  *"one of his fastest-travelling recent uploads. Over two hundred thousand views
  in nine days"* and `WAL-112` *"went up on 24 July 2026. 205,991 views as of 2
  August 2026."* One view count, said twice. **Effectively zero.**
- **"Nothin' Wrong"** — the one you did not name. Its three facts are: *"one of
  two of his songs surfaced in this wing"*, *"came to this room from our own
  catalogue — Museum accession MV-20260523-040"*, and *"is from Skipping Stones…
  Museum catalogue MV-20260523-040."* **All three are about the museum's shelf,
  and two are the same accession number.** Zero about the music.

**"Doin' Me" is the model.** Six facts, all about the song: Rick Rubin produced
it, most people met it through a Canon advert, the advert was called
"Boundaries", Megaforce directed it, and the launch campaign was fake mug-shot
billboards around Los Angeles. **A stranger who reads those six knows something.**

---

## 1g — WHAT A GOOD FACT LIST LOOKS LIKE

### What worked, read off the ones that survived

The 197 keepers have four shapes, and every one of them can be said in a breath:

1. **A number attached to a thing that happened.** *"The London show sold out in
   about five days."* *"400 monthly listeners to 100k in a few months."*
2. **A thing somebody did that you would retell.** *"A fake mug shot of him went
   up on billboards around Los Angeles in 2017."* *"She spent a week in an
   Israeli prison for it."* *"As a teenager he recorded songs and sold them on
   burned CDs."*
3. **A first-person line with a real detail in it.** *"That Bronco was huge for
   us. When my dad sold it after we moved back to Pennsylvania, my brother
   cried. It's in the '94 video."*
4. **A fact that explains something the visitor can see.** *"jessewelles.org and
   jessewellestour.com are not his."* *"Her press page offers no downloadable
   photography and no usage terms at all"* — which is why we show none.

**Shape 4 is the one nobody else can write.** It is the museum's own knowledge,
and it is where the wing sounds like a museum instead of a wiki.

### What failed, and the four tests it failed

- **Anything whose subject is us.** *"Confirmed from the upload itself."* *"It is
  still the clearest account of that year."* *"the reason is in the ledger."*
  These are the visible-line law in fact clothing — the subject is the work.
- **Anything that rots.** Every view count, every follower count, every "current
  feed" reading.
- **Anything that is a row of a table.** The discography cards.
- **Anything that needs the question it answered.** *"We do indeed."* *"It was our
  second year in a row attending it."*

### The shape I recommend

**Per artist: 12–18 facts. Not 60.**

| tier | count | what it is |
|---|---|---|
| **song** | **4–6 per song shown** | the tier that fires when they press play. Non-negotiable — it is what a visitor is actually standing in front of. |
| **artist** | 6–8 | origin, the turn, the standing terms, one thing nobody knows |
| **house** | 1–2 | why this artist is in this room, in our voice |

**A mix I would defend, out of 15:**

- 3 that are a number and a date
- 3 that are a thing they did, retellable
- 3 first-person with a real detail
- 3 that explain something visible in the room
- 3 that are odd — the pronunciation, the fake domains, the neighbour who got a
  song and then a credit

**And four rules, three of which the vault already wrote and one it did not:**

1. **Two sources or it does not ship** — the death year survived because two
   sources agreed. One outlet is a rumour with a byline.
2. **No date, no number.** Any count carries the day it was read, or it is not a
   fact.
3. **Unverified means omitted, not hedged.** Already law. It worked.
4. **NEW: no more than three facts from any one interview.** This is the rule
   the vault is missing, and eleven-from-one-Q&A is what its absence costs.

### My recommendation, plainly

**Scrub first, rebuild second, and rebuild only the song tier.**

- **Delete the 156 WEAK/SUSPECT/WRONG.** That leaves **197**, which is still
  more than the 12–18 per artist above.
- **Then cut the 197 down by hand** to the best 15 per artist — I did not do
  that cut because it is a taste call, not a verdict call.
- **Then commission song facts for the three empty songs** — that is 12–18 new
  facts total, not 300.
- **Leave `hr_facts.js` alone or delete it whole.** Its 51 facts are unsourced
  house prose written as *"seeds to prove the machinery"*, and the machinery is
  long since proved. Nothing imports it. **My call: delete it, and write the
  salvage brief that July promised — I count 4 seeds worth vaulting.**

**On generating fresh lists from scratch:** the artist-tier keepers are genuinely
good and re-researching them would trade a checked fact for an unchecked one. The
song tier is where nothing exists and where a rebuild costs nothing to lose.

---

## WHAT I COULD NOT DETERMINE

- **Whether any fact is actually true.** I checked internal consistency,
  attribution and shape. I did not go to the sources. Every SUSPECT means *the
  sourcing will not hold up*, never *I found it to be false*.
- **Whether the '94 lyric is licensed.** Hunter Root is the house's own artist,
  so there may be a permission I cannot see. The rule it breaks is the museum's
  own, and that part is certain.
- **Whether "addict parents" is true.** It may be something you know. It is not
  in the sourced record, which is the only thing I can speak to.
- **Whether the 68th Grammys nominations (`WAL-088`) have happened.** It is
  Wikipedia-sourced and dated 2026; I did not verify against the Recording
  Academy.
- **The exact figures behind your "ten from one writer and eight from one
  agency."** I found MuzicNotez at 10 and Shore Fire Media at 3 named plus ~6
  unattributed press-release facts. Close, but not the same numbers — the real
  concentration is in §1e.

## WHAT NEEDS MIKE

1. **The lyric fact.** `MV-HR-20260707-056`, live now, thirty words of "'94".
   One word from you and it goes tonight.
2. **Delete the 156?** WEAK + SUSPECT + WRONG. Nothing is deleted until you say.
3. **`hr_facts.js` — delete the file?** 51 unsourced facts, unimported, holding
   the wrong death year and the "addict parents" claim. My recommendation is
   delete after a 4-seed salvage.
4. **"Addict parents"** — is it true? If it is, it needs a source. If it is not,
   it needs to be gone from the tree, not just from the live path.
5. **Song facts for three songs.** "That Can't Be Right", "There's A Hole",
   "Nothin' Wrong" have none. Do you want them researched, or do you want those
   songs swapped for ones we know something about?
