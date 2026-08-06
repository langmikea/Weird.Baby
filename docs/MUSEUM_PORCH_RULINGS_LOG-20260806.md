# THE PORCH RULINGS — R1–R8, 2026-08-06

**Six rulings, one research map, one register pass. Every ruling landed. The one
he called CRITICAL AND LIVE was aimed at the wrong page, and correcting his
premise made the problem forty-six times bigger.**

Gates: lint **11 errors / 9 warnings = baseline, zero new** · build **green** ·
`provenance:gate` **PASS — 0 undeclared · 0 stale · 0 invention** ·
`reveal:check` **PASS** · `parity:gate` **PASS, 4 shared · 0 divergences** ·
browser lap **on the built bundle**, eleven routes, no horizontal overflow
anywhere, no console messages. Surfacing **13 · 13 · 15, unmoved** — this round
subtracted; it surfaced nothing, and that is stated rather than dressed up.

---

## R5 — THE ONE THAT MATTERED, AND HIS PREMISE WAS INVERTED

> *"WE DO NOT HAVE HIS PERMISSION. He was never reached, the ask was never
> answered, therefore it is not granted… His two songs currently serve from our
> own vault on the public site. Switch them to embeds of his own official
> uploads… The vault keeps the material; the site stops serving it. Verify
> nothing else on the public site serves vault audio."*

**THE TWO SONGS HE NAMED WERE NEVER SERVED FROM THE VAULT.** `/wal`'s two Hunter
Root tracks are — and always were — YouTube embeds of his own channel. Checked
rather than assumed, because the whole ruling turns on it: oEmbed on
`vPW49GU38Ng` and `Wv0_mujJUQU` both return `author_name` **"Hunter Root"**,
`author_url` **youtube.com/@hunterrootmusic**. There was nothing there to switch.

**THE VERIFICATION HE ASKED FOR FOUND `/hr` SERVING NINETY-THREE.** Every track
in the exhibit export carries a rendition whose `audioUrl` is an mp3 on
`assets.weird.baby`, and **sixty of them also sit on the album containers as
`primary_url`**, which the deck's album overlay plays through its own `<audio>`
element. **153 vault URLs, his entire vaulted catalogue, streaming from the
museum's host on an address anybody can type.**

**THE RULE IS WRITTEN ONCE AND ENFORCED TWICE, AND THE SECOND TIME IS THE POINT.**
`src/data/exhibits/vault-audio.js` holds `stripVaultAudio` — a pure function, no
imports, idempotent by construction, matching on the vault's audio PATH rather
than a file extension so a future export in a different container is caught by
the same rule. Two callers:

- **RUNTIME** — `src/data/exhibits/hunter-root-served.js`, the only thing either
  consumer imports now. The raw JSON has no other reader in `src/`.
- **BUILD** — the `hr-vault-audio` plugin in `vite.config.js`, `enforce: "pre"`,
  which sees the raw JSON before Vite's own json plugin turns it into a module.

**The build pass exists because the first attempt at this was not good enough and
the bundle said so.** A runtime filter stops the REQUESTS and still ships the
ADDRESSES: the first build after the filter went in carried **153 vault mp3 URLs
in plain readable text**, which is the site publishing exactly what it had just
stopped handing out. After the plugin: **zero**, and the bundle is 22 KB smaller.
Measured on the built bundle — `assets.weird.baby/audio` **0**, thumbnails 88,
assets 19.

**THE COST IS NOT SMALL AND IT IS NOT OPS' TO ABSORB.** 33 of 93 tracks carry an
official YouTube upload. **60 do not.** Run With The Hunt (15/15) and the Phone
Recordings EP (5/5) have nothing playable at all; They Finally Cracked Me is 10 of
11 dark, Life Inside A Wheel 11 of 12. On the glass those rows render `.tl-novid`
— dead, 32% opacity, no cursor — and the deck's album overlay marks them
*unavailable*. **No render path was invented for this**: both states already
existed and both were built for exactly this case. What `/hr` should LOOK like
without its audio is a design call, Ops did not make it, and it is
[M71](OPEN_ACTIONS.md#m71).

**WHAT ELSE ON THE PUBLIC SITE SERVES VAULT AUDIO: nothing.** `/wb`'s six mp3s
are in `public/audio/wb/` and are the house's own artist. `/wal`, `/robots`,
`/foundation` and `/hr/archive` request no audio at all. **What the site still
serves off the vault's host is his PICTURES** — 18 requests on a full `/hr` pass,
covers, thumbnails and three photographs. His instruction said audio and this
round did audio; the images are the same permission question and are
[M73](OPEN_ACTIONS.md#m73) rather than a silent extension of a ruling he did not
give.

---

## R4 — THE HOLDINGS SENTENCE, SEVEN SITES, AND THE LINE OPS DREW

> *"Nobody asked for a holdings announcement; it exists only because it was typed
> for Hunter… The fact stays in the vault; the bragging leaves the page. All four
> artists become identical — name, songs, cards, doors. Same only the data."*

Struck or trimmed: the artist card's **whole two-paragraph label** · the
tombstone's *Catalogue — 93 tracks on file in the museum's own vault* and
*Surfaced here — Two*, the only two rows no other artist has · the *Nothin'
Wrong* card's first paragraph · the metrics note's second half · the records
note's second clause · the aboutNote's *"he is our artist and this is our record
of him"* · the poster's `what` and `why`.

**HIS CARD NOW HAS NO BIOGRAPHY, AND IT IS THE SECOND TIME THAT SLOT HAS FAILED
THE SAME WAY.** Both paragraphs WERE the announcement, so striking it left
nothing. Before CS struck the pair in front of them, the same two slots described
this WEBSITE. Ops did not write a replacement — Doctrine 12, and nothing in this
repository holds his life except vault quotes already printed on the same card's
own decks. `face.label` is conditional at `Exhibit.jsx:3379`, verified on the
built bundle: the card runs plate, marker, register, records, decks, doors and
draws no empty block. [M72](OPEN_ACTIONS.md#m72).

**WHAT DELIBERATELY STAYED, stated so the boundary is on the record rather than in
Ops' head.** The *Records* tombstone row — *"Seven, plus an EP and a set of
singles and rarities"* — is a count of what he MADE, exactly the claim Carsie's
*"Twelve, every one of them independent"* makes, and it names neither the museum
nor the vault. The two song accessions, the plate caption and the deck
attributions are **provenance, which Doctrine 11 explicitly ships**.

**AND ONE DELETION WAS DRAFTED, THEN REVERSED, AND THE REVERSAL IS THE MORE USEFUL
FINDING.** The `Accession` row on each song card was struck to make the tombstone
match the other three artists' — and the provenance register caught it: two
passages on that same card, the vault quote and the *"’94"* label, point at the
accession row and at nothing else. **Deleting a citation to make a card
symmetrical would have cost the page the only thing saying where its quotes came
from.** The row went back. What was ADDED instead is what the other three carry —
*Published by · His own channel, @hunterrootmusic* and *Verified · oEmbed
author_url — the upload itself* — which is R5's posture said out loud on the one
surface a visitor reads.

**THE POSTER'S BILL LINE INTRODUCES NO FACT TO THIS WING.** *"Seven records, an EP
and a set of singles and rarities. Half of Crooked Home is about his brother Nick,
who was gone at twenty-seven, and he says “’94” is the heart of it all."* Both
halves are already on the glass of the card the poster bills — the register's own
Records row, his `marker`, and the *"’94"* card's own sentence. It is built the
way Carsie's is: output count, then the one line that says what the work is.

**AND THE PLACE UNDER HIS NAME CAME OUT OF R7.** `what` read *"Songwriter · the
house artist"* against three roles-and-places. It was drafted as bare
*"Songwriter"*, because the only location fact in the repository is his own words
to Whiskey Riff — *"I am Pennsylvania raised but I was born in Fayetteville,
Arkansas"* — and raised is not based, while printing *Arkansas* would put the
same word under two of four acts. Reading his Bandcamp for R7 settled it in one
line: **"Solo artist/musician from Lancaster, PA"**, his own page. It reads
*Songwriter · Lancaster, Pennsylvania*.

[M52](OPEN_ACTIONS.md#m52) closes with this: the blurb's *"none of them is ours"*
no longer sits above a panel claiming the museum holds his records, because the
panel no longer says it.

---

## R2 — HE DID NOT PICK A WORDING, HE STRUCK BOTH

> *"A line introducing a list of questions is the page explaining what the page
> is."*

Both machine FAQ blurbs deleted. The divergence M67 reported resolves by there
being no sentence left to diverge — **the stronger form, because two matching
blurbs would still have been two copies to keep in step, invisible to
`npm run parity`, which polices menu ITEMS and cannot see the words inside them.**
Verified on the built bundle: both faces run title, plate, questions, and neither
draws an empty blurb element.

**HIS INSTRUCTION NAMED "the booth's and the Foundation's" AND OPS CHECKED BOTH
ROOMS RATHER THAN ASSUMING HE MEANT THE MACHINES.** Neither has an FAQ intro
blurb: `/booth` has an `<h2>Questions</h2>` heading above nine `<details>`, and
`/foundation`'s face has a title and a subtitle. **A heading is not a blurb** —
strike it and a list of questions has nothing naming it. Nothing was deleted in
either room, and the two blurbs that exist in this museum are the two that were
struck.

The second half of M67 — *"Does it still work?"*, where the portable's answer
carries a Portal sentence the mainframe has no equivalent for — is untouched. He
ruled on the blurb and said nothing about it.

---

## R1 — ONE IMPORT, EXACTLY AS M66 SAID IT WOULD BE

`robots.js` imports `CONTACT` from `src/data/house-copy.js`. The front desk's
bare `papa@weird.baby` is gone; verified on the built bundle, the last answer
reads *"Write to the guy running the place: papa@weird.baby."* **`house-copy.js`'s
header no longer carries an exception** — the paragraph naming the one deliberately
unwired copy is rewritten, because there is no longer a known unlinked copy of a
house passage in the museum.

---

## R6 — DISCLOSE, AND THE DISCLOSURE WAS WRONG AGAIN

> *"the FAQ states plainly that YouTube (and any other embed host) is contacted
> when those pages load. Disclosed, not deferred, not click-to-load."*

Option A means **the booth's answer becomes the whole of the remedy**, which
makes its accuracy the whole of the remedy — so it was re-measured on the built
bundle, and **the Facebook half was wrong for the third time, in the museum's own
favour.**

`/hr` on arrival, nine-second settle, nothing clicked and nothing scrolled:
Google Fonts, `www.youtube.com` ×3, **and Facebook ZERO.** The sixteen plugin
frames carry `loading="lazy"` (`HrExhibitFlow.jsx:2240`) and sit below the fold.
Scrolled to the bottom: `www.facebook.com` ×16, 17 iframes — exactly the numbers
v53 recorded, which it took with the deck already open, which is why it read as
arrival. **The clause now says WHEN:** *"which arrive as they scroll into view —
later than the player, and still nothing you pressed."*

[C34](OPEN_ACTIONS.md#c34) — click-to-load — **closes ruled-against.** It was
Ops' recommendation and it was wrong to keep it standing once he had chosen; it
is closed rather than parked so no future round reads a stale recommendation as
an unbuilt task. [C12](OPEN_ACTIONS.md#c12) is narrowed and stays open: the
embeds are not going away now, so the blank-block defect is somebody's to look at
on `weird.baby` rather than a question that might dissolve.

---

## R3 — PRINTED, NOT MERGED, AND ONE OF THEM IS PLAINLY STALE

All three are in [M68](OPEN_ACTIONS.md#m68) verbatim so he can read them without
a laptop. Ops' answer to his second question — *is one plainly stale or wrong
rather than merely different* — is **yes, and it is the third one**, the search
description: *"Weird.Baby Museum. Exhibiting the MGK robots and Worth A Listen."*
It names two exhibits; the lobby board lists three, and the missing one is the
house's own — **Weird.Baby Music**. It has been the line every search result shows
since 2026-08-02, when R1 wrote it to fix a *different* staleness.

**The shortening between the two social cards is not a length decision:**
Twitter's limit is 200, the og line is 154, so it would have fitted. Nothing in
the file says why the wings clause was cut. Not merged — a share card is the
museum introducing itself.

---

## R7 — THE KNOB IS THIRTEEN TRACKS, NOT NINETY-THREE

Full map: `docs/AD_FREE_PLAYBACK_RESEARCH-20260806.md`. Headline: **embedding
needs no permission on either platform** — Bandcamp's Share/Embed control is on
every public release page, generates plain iframe HTML for any site, and the
players are ad-free and unbranded. **It is a source question, as he said, and the
sources are lopsided.**

Carsie Blanton: **16 releases** on her own Bandcamp against two songs shown.
Jesse Welles: **7 albums** against two songs shown. Mikey Mike: **no Bandcamp, no
hosted audio anywhere** — his own `/music` page carries no player and no
streaming link, and the two candidate SoundCloud accounts could not be tied to
him from his own pages, so they were **not adopted** (the standing rule from
R-a's refusal of findmikeymike.com).

**Hunter Root: 38 of 93 tracks, and only 13 the site cannot already reach through
YouTube.** It restores neither record that went dark. **47 of his tracks are
reachable through no public channel this research could find** — which is the true
shape of the R5 problem, and the reason the vault is not a convenience the site
can replace.

**One test decides everything and it was not run:** the default streaming limit is
3 full plays before a purchase prompt, an artist may raise or disable it, and
Bandcamp's own documentation does not say whether the limit applies inside a
third-party embed. Play one embedded track four times from a clean browser and
watch the fourth. [M76](OPEN_ACTIONS.md#m76).

---

## THE PROVENANCE PASS

Seven strings entered the boundary and every one was declared before the gate ran;
**16 stale rows were pruned against a copy, per §9, and the gate named zero broken
chains — because five were repointed BEFORE the prune rather than after.** That is
the first time the procedure has been run forwards instead of recovered from.

The five that would have broken, and where they went: *"In his own store"* pointed
at the vault count and at *"Two"*, both deleted — repointed onto the store
inventory rows it actually restates. *"Four of them. Two songs each…"* pointed at
the poster line R4 rewrote — repointed onto the four artist-name rows, which is
what *"four of them"* is a count of. And the three pointing at the two song
accessions **did not need repointing, because that is the deletion R4 reversed.**

Final: **0 undeclared · 0 stale · 0 invention**, 2465 strings on the boundary.

---

## WHAT THIS ROUND EXPOSED — all of it in `docs/OPEN_ACTIONS.md`

- **[M71]** 47 tracks reachable through nothing; 60 dead rows on `/hr`; the
  design call is his.
- **[M72]** Hunter Root's card has no biography.
- **[M73]** the site stopped serving his audio and still serves his pictures.
- **[M75]** `/hr/archive` still announces the holding — the one place R4 did not
  strike, and Ops says so rather than quietly applying or quietly exempting it.
- **[M76]** the knob is thirteen tracks; whether to build it is his.
- **[M68]** amended with all three descriptions verbatim and the stale one named.
- **[C12]** narrowed; **[C34]** closed ruled-against.
