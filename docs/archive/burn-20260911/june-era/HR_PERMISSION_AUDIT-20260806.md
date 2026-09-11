# THE PERMISSION AUDIT — HUNTER ROOT

**H2, 2026-08-06. Research and reporting only. Nothing was fixed, removed or
softened to produce this document, and no item below was argued from goodwill.**

Mike's instruction: *"how much of what /hr displays are we actually within our
permission to show? Audit it honestly, item by item… For each: what it is, where
it came from, and what the basis for showing it would be. Where the honest answer
is 'no basis,' say so plainly."*

---

## 0. TWO THINGS BEFORE THE TABLE

**FIRST, THE ONE FACT EVERYTHING ELSE HANGS OFF, AND IT IS NOT A JUDGEMENT.**
Nothing in this repository records any permission, licence, agreement,
correspondence, release or approval from Hunter Root or anyone representing him.
Grepped across `docs/`, `src/`, `provenance/` and `reveal/` for *permission ·
licence · license · agreement · consent · cleared by · rights holder · release*.
**Every hit is the museum saying it does NOT have one**, plus one archived line
in a retired spec (*"Fan art permissions — requires conversation with Hunter
before build"*) which is a note that the conversation had not happened.

Mike's own statement of it, R5, verbatim: *"WE DO NOT HAVE HIS PERMISSION. He was
never reached, the ask was never answered, therefore it is not granted."*

So the audit below is not asking *is the permission adequate.* It is asking, for
each item: **is there ANY basis other than permission** — a platform's embed
terms, ordinary quotation, or the fact that facts are not owned by anybody.

**SECOND, WHAT THIS DOCUMENT IS NOT.** It is not legal advice and Ops is not a
lawyer. Every verdict below is a statement about **what basis exists on the
record**, checkable by reading the same files. It is not a prediction of what a
court, a label or a distributor would say, and *"defensible in principle"* is not
*"safe"*.

---

## 1. THE TABLE

| # | Item | Where it came from | Basis for showing it | Verdict |
|---|---|---|---|---|
| A | **Full-length audio, 93 tracks** (153 mp3 URLs) | Copies of his recordings re-hosted on `assets.weird.baby`, the museum's own CDN, out of MediaVault | none on the record | **NO BASIS.** Stopped R5. |
| B | **Album covers, artifact thumbnails and 3 photographs** (107 image URLs; 18 requests on a full pass) | Same CDN, same vault, same export | none on the record | **NO BASIS.** Held as of H1 — by the wing going private, not by a ruling. |
| C | **33 YouTube renditions** | `youtube.com/embed/…`, his own channel `@hunterrootmusic`, oEmbed-verified R7 | YouTube's embed terms; the uploader controls whether embedding is allowed and has left it on. The museum serves no copy — YouTube does. | **REAL AND CHECKABLE.** The strongest item in the audit. |
| D | **16 Facebook post embeds** | `facebook.com/plugins/…` behind `hr-card-fbembed` cards | Facebook's embed plugin, on posts that are public. Facebook serves the post. | **WEAKER THAN C**, and for a reason that is not about Facebook — see §2. |
| E | **49 artifact titles and descriptions** | His own Facebook, Instagram and ReverbNation post text, **copied verbatim into `hunter_root.json`** and printed on the deck cards | none on the record | **NO BASIS, AND NOBODY HAD NAMED IT.** See §2. |
| F | **97 vault facts** (95 tagged `press`) | Extracted from published articles and interviews; 43 carry `speaker: hunter_root` — his words as printed by someone else | quotation with attribution, which the museum already pays in full | **DEFENSIBLE IN PRINCIPLE.** Its weakness is volume per source, not the practice. See §3. |
| G | **Lyrics** | — | — | **NOT HELD. The museum has no Hunter Root lyrics anywhere.** See §4. |
| H | **Biography** | Nothing. R4 struck both paragraphs of his artist card; two sourced life facts exist and neither is on a biography slot | quotation with attribution | **NOT SHOWN.** M72 is the open row. |
| I | **Two images on `/wal`** — `hunter-root-cover.jpg`, `hunter-root-plate.jpg` | The museum's own `public/images/wal/`, served from its own origin | none on the record | **NO BASIS — AND STILL PUBLIC.** Same class as B and NOT behind any door. |
| J | **The catalogue** — 9 containers, 93 track rows, titles, years | The vault, derived from MediaVault's export | facts about what exists; a holdings listing | **FINE.** A catalogue is not a copy. |
| K | **The gift-shop tile** | `hunterroot.com`, his own front door, opened and read 2026-08-05 | it is a link | **FINE.** |
| L | **`hr_facts.js` (124 strings) and `hr_journal_prompts.js` (30)** | Ops research, three lines self-flagged UNVERIFIED about a real musician | not served — the files are unreachable from any route | **NOT SHOWN.** M5 is the open row; it is a repository question, not a permission one. |

---

## 2. THE ITEM NOBODY HAD NAMED — E, AND WHY D IS WEAKER THAN C

**THE EMBED AND THE TEXT ARE TWO DIFFERENT THINGS, AND THE MUSEUM HAS BEEN
TREATING THEM AS ONE.**

Sixteen Facebook cards on `/hr` are plugin iframes: Facebook serves the post,
Facebook knows it was asked, and whatever basis the plugin gives is the basis.
That is item D, and it is ordinary.

But `hunter_root.json` **also carries his post text as museum data**. Every one of
the 49 artifacts has a `title` and a `description`, and for the 22 social
artifacts those fields are his own writing, copied. `HrExhibitFlow.jsx` prints
`card.title` on the card face and `card.description` as the overlay caption. That
copy is served by the museum, from the museum's own bundle, and it exists whether
or not the iframe ever loads.

Sample, from the first artifact in the export (`MV-HR-20260405-004`), reproduced
here because the point cannot be made without it:

> *"I'm going on tour this month supporting the upcoming album Crooked Home out
> this Friday. Please don't wait to buy tickets at HunterRoot.com! Tour dates
> below…"* — followed by fifteen dated tour listings.

**Where it sits on the scale.** A tour-date post is thin: the dates are facts and
the sentence around them is short. Others in the set are not thin. The class as a
whole is *reproduction of an author's text*, and an embed licence does not cover
a separate copy of the same words held in a different system — that is the whole
reason embedding exists as a mechanism.

**This item survives every remedy applied so far.** R5 stripped the audio. H1 has
put the images and the deck behind a password. The TEXT went behind the same door
with the deck — but only because it lives in the same file. **It would have
survived a fix aimed at the media, and no round before this one had named it.**

---

## 3. THE FACTS — F, AND THE ONE THING ABOUT THEM THAT IS ACTUALLY EXPOSED

Ninety-seven facts, 95 tagged `press`. The named sources include Lancaster
Online, Whiskey Riff, Isthmus, Americana Highways, The Country Note, PA Musician,
NEPAudio, Blue Harvest Beat, Shore Fire Media and nine named writers. Forty-three
carry `speaker: hunter_root` — his words, as printed in someone else's article.

**Two components, two different answers.**

* **The facts themselves** — who produced *Crooked Home*, where it was cut, when
  the tour opened — are facts. Nobody owns a fact. The museum attributes them
  anyway, which is more than the basis requires.
* **The quotations** are quotation with attribution, which is ordinary and which
  the museum does properly: every fact carries its source and, where it is a
  number, its date.

**THE EXPOSURE IS VOLUME PER SOURCE, NOT THE PRACTICE.** Ten of the ninety-seven
carry `speaker: wynton_huddle`; eight carry `shore_fire_media`; four apiece for
Lancaster Online, Isthmus and The Country Note. Quoting one line from an article
is quotation. Extracting eight or ten of its best lines is closer to a substitute
for reading it, and the party with a grievance there is **the publication, not
Hunter Root.** That is a different counterparty from the rest of this document
and it is stated separately for that reason.

**AND ALL 97 ARE PUBLIC RIGHT NOW.** `worth-a-listen-facts.js` imports the whole
of `hunter_root.facts.json` and re-tags every fact into the `/wal` pool
(*"one record, two rooms"*, its own header). Measured on this round's built
bundle: the fact set is in `assets/tokens-*.js`, a **public** chunk, because
`/wal` needs it. **Making `/hr` private did not take one word of it off the
public site**, and a reader who assumes otherwise will be wrong.

---

## 4. THE THREE ANSWERS THAT ARE BETTER THAN EXPECTED

**LYRICS: THE MUSEUM HOLDS NONE.** Searched the whole tree. The only hits are the
variant taxonomy (`official / live / lyrics / cover`, a label on a video type),
four occurrences inside `hunter_root.json` that are the same, and a retired
comment in `HrArchive.jsx` recording that a *"explore lyrics in the lyric map"*
link was removed because `/hr/workshop/lyric-map` never existed. **There is no
lyric text for Hunter Root anywhere in this repository.** Lyrics are among the
most aggressively licensed text there is; the museum has never touched them.

**THE 33 YOUTUBE RENDITIONS ARE THE ONE ITEM WITH A BASIS THAT CAN BE CHECKED
RATHER THAN ASSERTED.** They are on his own channel, the channel was verified by
oEmbed rather than by inference, embedding is a setting he controls, and the
museum stores no copy. If every other item on this list went, these would still
stand.

**THE CATALOGUE IS NOT A COPY.** Nine containers, ninety-three track rows, titles
and years is a holdings listing — the same claim any discography makes. R5 left
the rows deliberately and was right to.

---

## 5. WHAT H1 CHANGED, MEASURED — AND THE THREE THINGS IT DID NOT REACH

Measured on this round's built bundle, not inferred.

| | before H1 | after H1 |
|---|---|---|
| vault mp3 URLs in the public bundle | 0 (R5) | 0 |
| vault image URLs in the public bundle | **107** | **0** — all inside `assets/held/hunter-root-catalogue-*.js` |
| his post text (49 titles + descriptions) | public | held |
| the deck, the catalogue, the artifacts | public | held |
| **the 97 vault facts** | public | **public — unchanged** |
| **`/wal`'s two HR images** | public | **public — unchanged** |
| **`/wal`'s artist card, records board, two songs** | public | **public — unchanged** |

**THE THREE THINGS H1 DID NOT REACH ARE THE THREE THINGS `/wal` NEEDS**, and that
is not an oversight — `/wal` is a public wing that deliberately shows two of his
songs, and taking its material behind the door would empty a room Mike has not
asked to close. They are listed here so that *"/hr is private"* is never read as
*"his material is off the site"*. **It is not.**

---

## 6. WHAT WOULD ACTUALLY SETTLE IT

Not recommendations — the shape of the remaining decisions, so the list is
Mike's to sequence.

1. **The ask.** The one thing that converts every NO BASIS row at once is him
   answering. R5 records that he was never reached and the ask was never
   answered; nothing since has changed that.
2. **A rule for images** (M73) — the same question the audio failed, still
   unruled. H1 has made it non-urgent for `/hr` and left it live for `/wal`.
3. **A rule for his text** (new, §2) — the artifact titles and descriptions. This
   one has never been put to him.
4. **A volume rule for press quotation** (§3) — how many lines the museum takes
   from one article. A different counterparty, and the only item here where the
   museum is arguably in the wrong against somebody who is not Hunter Root.

---

*Every figure in this document was re-derived on 2026-08-06 from the live tree
and the built bundle. Nothing was carried forward from a previous round's count.*
