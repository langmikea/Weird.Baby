# PRESS_BATCH_INGEST-20260707 — Stage 3 Fact Candidates (WORDING GATE — Mike's pen, batch-editable)
Ops: Claude (Cowork), 2026-07-07. Source texts: press_batch_url_dossier-20260707.md (Cowork outputs) + this session's fetches. Every candidate is defensible verbatim from its in-vault source; nothing asserted beyond the source.

## Conventions (state once, apply to all — edit here to change everywhere)
- Shape = pilot mold: line 1 = description_short, line 2 = description_long; kind=fact, status=VAULT, media=text, ingest=cowork; source_url = article URL; notes = breadcrumb ("<outlet>, in-vault MV-XXXX; corroboration: …").
- QUOTE entries: line 1 = the trimmed verbatim quote; line 2 = attribution, mechanical: "— <speaker>, <outlet>, <year>". Only line 1 is shown per entry below; [trim] marks quotes shortened from longer verbatim runs (never paraphrased).
- FACT entries: both lines given.
- source:press tag + source_platform='press' on all (invariant); exhibit:hunter_root on all; band tag as scoped. NO era tags (assumption: era comes via referenced_dates at FactScroller re-wire; pilots' hand era tags not imitated — override if wrong).
- speaker: one slug per fact (persons and outlets per Mike's V3 amendment).
- Weight: still no schema home (deferred to re-wire, unchanged).
- IDs assigned at insert in approved order, MV-HR-20260707-007 onward.

## New speaker slugs needed (rule the roster; persons were V4-approved, outlets are the V3 amendment's first use)
- Persons: harrison_giza, kevin_stairiker (no quotes used — reserve only if wanted), hill_douglas, brian_dambrosio (no own-voice quotes — reserve), michelle_osterhoudt, michele_kelly (reserve), sarah_kate_gittleman. hana_gustafson: no quotes — SKIP registering (F7 zero-usage) unless wanted.
- Outlets: blue_harvest_beat, chasing_destino, whiskey_riff, muzicnotez, shore_fire_media, isthmus, the_country_note, nepaudio. (lancaster_online, jambands, americana_highways, pa_musician: no outlet-voice candidates below — register only on use.)
- Existing slugs reused as speakers: hunter_root, wynton_huddle, alex_aument, tyler, justin_wohlfeil.

## Cross-cutting flags
- [F-DEATH-DATE] Nick's death date, UNVERIFIED at the pilot, is now source-backed: Root's own words (C32) date it to April 15, 2021, age 27; corroborated Isthmus ("died in 2021") + AH ("only eleven months older"). Pilot fact MV-HR-20260707-001 says "taken by cancer"; AH (C65) has Root saying heroin AND cancer both true. Your wording, your call whether 001 gets revisited — flagged only.
- [CONFLICT-PRODUCER] Shore Fire/Jambands/Isthmus: producer Anders Osborne, engineer David Kalmusky. D'Ambrosio: "producer David Kalmuskey." C48 words per the three-source majority; breadcrumb notes the conflict.
- [HEAVY] = grief/addiction content — your pen decides what a museum wall says. [PROF] = profanity. [LYRIC] = quoted song lyric; speaker ruling needed (lyric author vs. quoting reviewer).
- Tags in brackets are per-entry SCOPE tags (band:medusas_disco = MD, band:hunter_root = HR, plus album/song/topic/people/venue as listed).

---

## Blue Harvest Beat, 2014-08-14 — in-vault MV-20260617-001 (interviewer Harrison Giza)
- C01 · hunter_root · [MD, topic:influences] · "Inspired by other's talents, Emotions, Thoughts, Existence, Pain."
- C02 · hunter_root · [MD, topic:influences] · "We're musically Influenced by: Led Zeppelin, Nirvana, The Doors" [trim]
- C03 · hunter_root · [MD, topic:family] · Favorite midnight snack: "Cereal." (Alex: cold pizza. Wynton: "many forms of frozen food." Tyler: Nutella-banana sandwich.) — one fact or four, your call
- C04 · alex_aument · [MD, topic:roots] · "Wynton's Dad's living room was the first time we played together as a 4-piece band."
- C05 · tyler · [MD, topic:roots] · First song the band ever played together: "Strange Chemistry"
- C06 · tyler · [MD, topic:songwriting] · Album name origin: "We chose 'Questioned By A Ghost' because our super fan Nathan Reinsmith misheard a lyric on our hidden track 'Medicine'" [trim] (QBAG not a registered album slug — no album tag)
- C07 · hunter_root · [MD, topic:roots] · "Park Bench Pigeons — It's growth from my solo album version to the SEEDS creation" + FACT line 2: Hunter, Wynton and Tyler all had solo albums before SEEDS.
- C08 · wynton_huddle · [MD, topic:influences] · "Queens of the Stone Age, Butthole Surfers, Nirvana, Primus, Syd Barrett-era Pink Floyd, Incubus, Miles Davis, I could go on, surely." [trim]
- C09 · hunter_root · [MD, topic:influences] · A good album: "an album that we can listen to on repeat and find a new element to love… Queens Of The Stone Age – Like Clockwork and Incubus – A Crow Left Of The Murder" [trim]
- C10 · harrison_giza · [MD, topic:roots] · "Hunter's vocals channel a pre-needle Cobain with Morrison appreciation."
- C11 · harrison_giza · [MD, topic:roots] · "The solos are just the right amount of melting face you need in your morning coffee." [trim]
- C12 · FACT · blue_harvest_beat · [MD, topic:roots] · L1: In August 2014 the band had been together about a year and a half. L2: Conceived in Lancaster County — Hunter's words to Blue Harvest Beat.
- C13 · hunter_root · [MD, topic:songwriting] · "Box of Animals" origin: "Wynton came up with the main riff in our friend's garage… The band was not formed at this point in time." [trim]

## Chasing Destino, 2018-04-25 — in-vault MV-20260617-002 (Wynton answering)
- C14 · wynton_huddle · [MD, topic:roots, venue:chameleon_club] · "Medusa's first show was the main stage of the Chameleon Club in Lancaster… This was before we even had a bassist!" [trim]
- C15 · wynton_huddle · [MD, topic:touring] · SXSW 2018: "It was our second year in a row attending it and was even better than last year!" (= played SXSW 2017 and 2018)
- C16 · wynton_huddle · [MD, topic:roots] · "We don't suck. You won't hate us."
- C17 · wynton_huddle · [MD, topic:touring] · "Hunter had an infatuation with cacti, but after pulling some needles out of his butt he's been less than eager." (Austin, SXSW)
- C18 · wynton_huddle · [MD, topic:touring] · Day jobs: "We do indeed. It's not an easy balancing act, but we will all do whatever we must to keep the ball rolling!"

## LNP/LancasterOnline, 2019-10-10 — in-vault MV-20260617-004 (byline Kevin Stairiker)
- C19 · wynton_huddle · [MD, topic:recording, people:justin_wohlfeil] · "We went from engineer to engineer and bassist to bassist trying to find the right thing. The solution for both things was in the same person."
- C20 · wynton_huddle · [MD, topic:touring] · "I was not expecting to find [our market] in the PA festival scene… we break the monotony up a little bit." [trim]
- C21 · justin_wohlfeil · [MD, topic:touring] · After the Who tribute set: "some of the songs have a new, rawer energy from that experience" [trim]
- C22 · alex_aument · [MD, topic:family] · On the Discult meme page: "I'm a really big fan of memes, so I'm glad to follow the page and see what people come up with; it gets me going."
- C23 · wynton_huddle · [MD, topic:family] · "The fans already know every single word to songs because we've been playing them for so long, and they're not even out yet"
- C24 · wynton_huddle · [MD, topic:touring] · "When people leave a show, we just want them to feel liberated and refreshed."
- C25 · FACT · [MD, album:orphic_grimoire, topic:recording, venue:chameleon_club] · L1: Orphic Grimoire was recorded in Justin Wohlfeil's studio inside the Chameleon Club. L2: The band hunkered down there from October 2018, in frequent four-hour sessions.
- C26 · FACT · [MD, topic:touring] · L1: August 2019 — Medusa's Disco opened for Godsmack at Allentown's Musikfest. L2: Their biggest crowd yet. (Corroborated: PA Musician column, in-vault MV-HR-20260707-005.)
- C27 · FACT · [MD, topic:family] · L1: Fans ran a dedicated Facebook group: "Medusa's Discult." L2: ~550 members in 2019 — per LNP, the only Lancaster band with its own fan group.
- C28 · FACT · [MD, topic:touring] · L1: A Who tribute set at "Dam Stock" in Austin, PA went so well it became a live recording. L2: Plus a second Who-centric show at Tellus360, Nov 8, 2019.

## Whiskey Riff, 2023-04-25 — in-vault MV-20260617-005 (byline Hill Douglas; Root's own IG statement quoted)
- C29 · hunter_root · [HR, album:arkansas, topic:roots] · "I am Pennsylvania raised but I was born in Fayetteville, Arkansas. My brother and I both."
- C30 · hunter_root · [HR, album:arkansas, people:nick_root, topic:family] · "The main reason it's titled this is for my older brother, Nicholas Root… He would love this name and would completely get it, being born there means a lot to us both." [trim]
- C31 · hunter_root · [HR, people:nick_root, topic:family] [HEAVY] [F-DEATH-DATE] · "Nick passed away two years ago as of April 15th at the age of 27. I was 26 when he died. He played guitar before me and is the reason I picked it up to begin with."
- C32 · hunter_root · [HR, album:arkansas, people:nick_root, topic:family] [HEAVY][PROF] · "One of his worries on his deathbed was that he wouldn't be remembered when he was gone. Fuck that, this one is forever for you Nick, I wouldn't be here without you!"
- C33 · hill_douglas · [HR, topic:roots] · "If you haven't heard of Hunter Root yet, I suggest you change that."
- C34 · hill_douglas · [HR, album:arkansas] · "This guy is the real deal, so you're going to want to mark your calendars for this one."
- C35 · FACT · [HR, song:town_rat_heathen, album:arkansas, topic:release] · L1: "Town Rat Heathen" dropped in January 2023 and went viral. L2: Nearly a million Spotify streams inside four months.

## MuzicNotez, 2024-01-22 — in-vault MV-20260617-006
- C36 · hunter_root · [HR, people:nick_root, topic:roots] · "I started playing drums and guitar at the age of twelve because of my older brother, Nick. He was a guitar player and was my first true inspiration to pick up an instrument."
- C37 · hunter_root · [HR, topic:influences] · "My first influences were classic rock bands that my father listened to… The Rolling Stones, Led Zeppelin, The Doors, Lynyrd Skynyrd" [trim — full arc runs grunge → Black Keys/Cage the Elephant → Growlers/Ty Segall/Thee Oh Sees/King Gizzard → Childers/Strings/Crockett/Colter Wall; could be 2-3 facts]
- C38 · hunter_root · [HR, topic:songwriting] · "Since I was a boy I just wanted to be able to make honest music for a living. That has always been my dream."
- C39 · hunter_root · [HR, topic:songwriting] · "I don't think music in itself has goals. The true point of music is simply the music itself."
- C40 · hunter_root · [HR, topic:influences] · "My favorite concert was probably the time I saw 'Fuzz' at Underground Arts in Philly"
- C41 · hunter_root · [HR, album:arkansas, topic:songwriting] · "'Arkansas' has strong folky, country, southern rock roots that permeate the whole record." [trim]
- C42 · hunter_root · [HR, song:town_rat_heathen, topic:release] · "I released a twenty second clip on Tiktok of me singing and playing the first verse. It got 500k views which prompted me to finish the song and release it immediately."
- C43 · hunter_root · [HR, song:town_rat_heathen, topic:release] · "I went from 400 monthly listeners to 100k in a few months. It's over 3M plays on Spotify now." (as of Jan 2024) "It is completely surreal… I feel blessed." [trim]
- C44 · hunter_root · [HR, topic:recording] · Solo vs band: "you have way more time and freedom to do things at your own leisure. Art is sensitive so not being rushed affects the product tremendously." [trim]
- C45 · hunter_root · [HR, topic:family] · "I just want to thank all my friends and fans pre-viral for helping me get to this point… You know who you are. And thank you to the new fans, Much love." [trim]

## Shore Fire Media announce, 2025-08-01 — in-vault MV-20260617-007 (corroborated by Jambands MV-20260617-008)
- C46 · hunter_root · [HR, album:crooked_home, topic:songwriting] · "The songs weren't written to deliver a message. They're simply confessions set to music." (also in SF release-day fuller form — see C55; pick ONE home)
- C47 · FACT · [HR, album:crooked_home, topic:recording, people:anders_osborne, people:david_kalmusky] [CONFLICT-PRODUCER] · L1: Crooked Home was produced by Anders Osborne and engineered by David Kalmusky. L2: Cut at Addiction Studios, Nashville; released October 17, 2025 via Tolok.
- C48 · FACT · [HR, album:crooked_home, people:chad_cromwell, people:marc_rogers, people:lindsay_lou] · L1: Chad Cromwell — Neil Young's and Mark Knopfler's drummer — plays on Crooked Home. L2: With Marc Rogers on bass and keys, and Lindsay Lou's backing vocals on two tracks.
- C49 · FACT · [HR, song:94, people:nick_root, topic:family] · L1: The "'94" single art is a childhood photo of Hunter and Nick. L2: Taken outside their dad's truck.
- C50 · hunter_root · [HR, song:94] [LYRIC][HEAVY] · "Back in 1994 / Glad I woke up but I didn't wake up too sure / Back in 1993 / The devil made his way inside a kid and then he never broke free…"

## Isthmus, 2025 — in-vault MV-20260617-009 (unsigned editorial voice = the outlet)
- C51 · isthmus · [HR, album:crooked_home] · "If you had to make up a name for a rocking but acoustic artist who tells straightforward stories without pathos, 'Hunter Root' would fit the bill exactly."
- C52 · isthmus · [HR, album:crooked_home, people:nick_root] · "While the songs are in part a tribute to Root's brother, who died in 2021, the album isn't a downer."
- C53 · FACT · [HR, song:friendly_fire, album:crooked_home, topic:release] · L1: "Friendly Fire" was the third single off Crooked Home. L2: Born from a fallout with close friends.
- C54 · FACT · [HR, album:crooked_home, topic:touring] · L1: The Crooked Home tour opened October 10, 2025, at The Abbey Bar in Harrisburg. L2: Then New York, Philadelphia, Boston, Nashville, Chicago and more.

## Shore Fire Media release-day, 2025-10-17 — in-vault MV-20260617-010
- C55 · hunter_root · [HR, album:crooked_home, topic:family] [HEAVY] · "Crooked Home is a personal reckoning that tells the story of my life, a life shaped by loss, addiction, and illness."
- C56 · hunter_root · [HR, album:crooked_home] · "I think a lot of folks listen to my music because it helps them through tough times. If there is anything I hope this album has to offer, it's that — a little bit of light."
- C57 · FACT · [HR, album:crooked_home, topic:recording] · L1: Crooked Home was the first record Hunter cut live with a full band. L2: In his whole career. (Corroborated by his own words, The Country Note — C74.)
- C58 · FACT · [HR, album:crooked_home, topic:gear] · L1: The album ran through vintage mics once used by Bob Dylan and Marianne Faithfull. L2: And reverb plates from Johnny Cash sessions.
- C59 · FACT · [HR, song:string_up_a_necklace, topic:family] · L1: "String Up a Necklace" is about a necklace his girlfriend made him. L2: To remind him of home while touring.
- C60 · FACT · [HR, song:my_brothers_bones, people:nick_root, topic:family] [HEAVY] · L1: "My Brother's Bones" is a tribute to Nick. L2: Born of Hunter's wish to give his brother a proper resting place.
- C61 · FACT · [HR, song:flash_in_the_pan, topic:songwriting] · L1: "Flash in the Pan" is about working-class hardship. L2: The divide between wealth and the lower-middle-class world Hunter grew up in.

## Americana Highways 2025-10-21 + D'Ambrosio Substack 2025-10-16 — in-vault MV-20260617-011 + -012 (Substack is the ORIGINAL; quotes verbatim-identical; breadcrumb cites both)
- C62 · hunter_root · [HR, album:crooked_home, song:94, people:nick_root, topic:family] · "Half the songs ended up being about my brother… '94' was almost the album title. It's the heart of it all." [trim]
- C63 · hunter_root · [HR, people:nick_root, topic:family] [HEAVY] · "He was a heroin addict since he was about fifteen. He got sarcoma while he was living in Kensington, Philly… and he came home to die. I was there for the last six months of his life." [trim]
- C64 · hunter_root · [HR, people:nick_root, topic:family] [HEAVY] · "He was doing hospice in our living room. It woke me up. When he died—only eleven months older than me—it felt like a piece of me went with him." [trim]
- C65 · hunter_root · [HR, topic:roots] · "I'd just run to my room, grab the guitar, and hide in music. That was my formula for dealing with stuff. It's a healthy habit I built early, and it's what's kept me alive." [trim]
- C66 · hunter_root · [HR, people:nick_root, topic:family] · "My brother's biggest fear was not being remembered. So it was obvious what I had to do: remember him through music. I didn't plan it out, but it became everything."
- C67 · hunter_root · [HR, song:94, people:nick_root, topic:family] · "That Bronco was huge for us. When my dad sold it after we moved back to Pennsylvania, my brother cried. It's in the ''94' video."
- C68 · hunter_root · [HR, people:nick_root, topic:family] [HEAVY][LYRIC-within-quote] · "Two weeks before he died, he wanted to go back to Kensington one last time to get high… Watching him wheel himself away, looking like a skeleton—it's burned in my brain." [trim; the full run includes the lyric "Deathbed, wheelchair, off he goes…"]
- C69 · hunter_root · [HR, song:94] · "It made people cry. That's when I knew—it's my first truly sad song, intentionally sad… That's what they want from music, and that's what I want to give: honesty." [trim]
- C70 · hunter_root · [HR, people:nick_root, topic:roots] · "He started playing guitar first, when he was eight. He's the reason I play. I wanted to be in a band with him. I wouldn't be doing any of this if it wasn't for him."
- C71 · hunter_root · [HR, album:crooked_home, topic:recording] · "The label put money into the record, but it's still just me being me. The quality's higher, but the goal's the same: to turn pain into something that matters."
- C72 · hunter_root · [HR, people:nick_root, topic:family] · "My brother was always running from something dark. I'm just trying to face it head-on through music. That's how I keep him alive. That's how I keep myself alive."
- C73 · FACT · [HR, album:crooked_home, topic:roots] · L1: Crooked Home was Hunter's first label-backed release. L2: At 30, based in Columbia, outside Lancaster. (AH, Oct 2025)

## The Country Note, 2025-11-24 — in-vault MV-20260617-013 (interviewer Michelle Osterhoudt)
- C74 · hunter_root · [HR, album:crooked_home, topic:recording] · "For the first time ever, all I had to do was sing and play in real time. It was the best result I have ever had. More honest. More alive."
- C75 · hunter_root · [HR, topic:roots] · "I have been playing music since I was twelve. I am just a full blooded musician. That is all I know how to do."
- C76 · FACT · [HR, topic:roots] · L1: It's spelled Root — but pronounced "Rut." L2: The spelling stuck as the stage name; he says it suits the music's earthy tone.
- C77 · hunter_root · [HR, topic:influences] · "I have always struggled to fit in genre wise. Every time I hear something new, it ends up in my music. I do not want to land anywhere because I like so many styles."
- C78 · hunter_root · [HR, album:arkansas, topic:songwriting] · "Arkansas was the first time I wrote real lines about real places and the things I actually did. And that is when people connected." [trim]
- C79 · hunter_root · [HR, song:town_rat_heathen, topic:songwriting] [HEAVY] · "People were not just connecting with vague lines. They connected with the exact story. My dad in jail. My brother in rehab. The legal drug stuff."
- C80 · hunter_root · [HR, topic:songwriting] · "If I was on a deserted island, I would just need my guitar and the ability to play a song all the way through. That is home for me."
- C81 · hunter_root · [HR, topic:touring] [HEAVY-ish: illness] · On Lyme disease: "This is my heart and soul. Not being able to tour weighs on me mentally. But I still have room to get better. I am not worried."
- C82 · hunter_root · [HR, topic:influences] · "Everything I love about Hank, that is what people connect with in my music. That is wild to think about." (Hank Williams; his "title track of my life right now": "Men With Broken Hearts")
- C83 · michelle_osterhoudt · [HR, topic:songwriting] · "Struggle is struggle." (the interviewer's line that unlocked him — needs its framing, your pen)
- C84 · FACT · [HR, topic:influences] · L1: A song he wishes he could hear again for the first time. L2: Nirvana's unplugged "Where Did You Sleep Last Night."
- C85 · FACT · [HR, topic:songwriting] · L1: The lyric comes first now — it used to be the riff. L2: Notebook and pen; writing happens on the couch with the TV off, or on a long walk with coffee.
- C86 · FACT · [HR, topic:roots] · L1: He grew up in Lancaster's Amish country. L2: Rural life plus psychedelic rock, grunge, and bluegrass shaped the sound.

## PA Musician Magazine, 2019-09-05 — in-vault MV-HR-20260707-005 (columnist reportage; no band quotes exist)
- C87 · FACT · [MD, topic:touring] · L1: The night after opening for Godsmack, Medusa's Disco closed the Peace of Mind series at Rt. 61 Roadhouse in Sunbury. L2: "They showed no signs of disinterest" — PA Musician's columnist. (speaker: michele_kelly if registered, else outlet)
- C88 · FACT · [MD, song:book_upon_my_shelf, topic:release] · L1: "Book Upon My Shelf" landed August 14, 2019. L2: The band's first single in three years.

## NEPAudio, 2019-10-20 — in-vault MV-HR-20260707-006 (reviewer Sarah Kate Gittleman)
- C89 · sarah_kate_gittleman · [MD, album:orphic_grimoire] · "Medusa's Disco's songwriting is a quality that sets them apart from other bands."
- C90 · sarah_kate_gittleman · [MD, album:orphic_grimoire] · "the album is a perfect snapshot of the energy that Medusa's Disco brings to listeners" [trim]
- C91 · FACT · [MD, album:orphic_grimoire, topic:recording] · L1: Orphic Grimoire — the band's fourth studio release. L2: Recorded, mixed, and produced entirely by Medusa's Disco.
- C92 · FACT · [MD, album:orphic_grimoire, topic:recording] · L1: "Belly Ache" carries a saxophone break by YAM YAM's Jason Mescia. L2: Woven into the instrumental breakdown. (belly_ache not a registered song slug — no song tag)
- C93 · sarah_kate_gittleman · [MD, album:orphic_grimoire] · On "Sizzle Into Oblivion": "it is nothing short of the stuff goosebumps are risen from." + FACT: the album closer, and per the review the most popular song among fans. (sizzle_into_oblivion not registered — no song tag)

---
*93 candidates. Duplicate-quote policy applied: Jambands/Substack duplicates fold into their originals as corroborating breadcrumbs, not separate facts. Your gate: cut / keep / re-word each line (batch edits welcome), rule the speaker-slug roster, rule C46's single home, rule the [LYRIC] speaker convention, and rule the [HEAVY]/[PROF] items explicitly. Insert script follows your rulings.*
