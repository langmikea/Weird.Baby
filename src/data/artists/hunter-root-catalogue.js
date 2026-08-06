// src/data/artists/hunter-root-catalogue.js — HUNTER ROOT'S HOLDINGS, ONCE.
//
// ═══ [D1/D3c 2026-08-06] WHY THIS FILE EXISTS ═══════════════════════════════
// MIKE: "Hunter Root's text is still incorrect — find every surface carrying his
// figures, verify each against the vault, and fix them all in one pass rather
// than the one that was reported."
//
// THE SURFACE NOBODY HAD LOOKED AT WAS `/hr/archive`, and it was not carrying a
// stale figure — it was carrying a DIFFERENT CATALOGUE. `HrArchive.jsx` held a
// hand-typed ALBUMS array, described in CLAUDE.md as "a title-only mirror of the
// spine" and kept in step by nothing at all. Measured against the museum's own
// export on 2026-08-06, the mirror was wrong in every direction at once:
//
//   · TWO WHOLE RECORDS MISSING — Run With The Hunt (15 tracks) and the Phone
//     Recordings EP (5) were not on the page. The archive listed six containers
//     where the vault holds nine.
//   · SINGLES & RARITIES was not a card either. In its place sat a "Singles"
//     strip hand-typed as ONE title, Chase The Dragon, against a container of
//     seven.
//   · SONGS FILED UNDER THE WRONG RECORD — "Shapeshifter" was printed on Life
//     Inside A Wheel, "Wildfire" on Mimicking the Sun, and "Cookin' in the
//     Bathroom" and "A Pot Song" on Crooked Home. All four are SINGLES &
//     RARITIES tracks in the vault.
//   · THEY FINALLY CRACKED ME's last two rows read "Soul Sucker" and "The
//     Shade"; the vault's are "Depresto" and "Puzzles". Two more titles were
//     printed short of what the vault calls them ("Straitlaced" for "Straitlaced
//     (Live)", "Moving With The Storm" for "Moving With The Storm (She's Not My
//     Queen)").
//   · THE HEADER'S FIGURES followed the mirror rather than the vault: "6 albums
//     · 71 songs · 2018 – 2025" against nine containers, ninety-three tracks and
//     a span that starts in 2017.
//
// A HAND-TYPED MIRROR IS THE D1 DEFECT IN ITS PUREST FORM: the same content in
// two places with no link between the copies, so W1's six-site correction went
// past this page without touching it and nothing said a word. So the mirror is
// not corrected — IT IS DELETED. The archive reads the spine, the spine reads
// the export, and the export is MediaVault's. There is no longer a second copy
// to be wrong.
//
// ═══ WHAT MOVED HERE, AND WHY IT MOVED ══════════════════════════════════════
// `HR_ALBUMS` is the presentation config that used to sit in `hunter-root.js`
// (coverflow order, short ids, display years). It has not been edited — it is
// the same nine rows — it has simply stopped being private to one consumer, so
// that a second consumer reads the config instead of retyping its contents.
// `hunter-root.js` imports `HR_SPINE` from here and is otherwise unchanged.
//
// It lives in its own module rather than being imported out of `hunter-root.js`
// because that file imports `HrExhibitFlow.jsx` — the 162 KB deck — and the
// archive route has no use for it.
//
// ═══ THE ONE THING THAT IS DECLARED HERE RATHER THAN DERIVED ════════════════
// `HR_KIND`. Seven of the nine containers are records; one is an EP and one is a
// set, BY THEIR OWN TITLES ("Phone Recordings EP", "SINGLES & RARITIES"). That
// reading is a judgement about two titles and it is written down once, here,
// instead of being re-made by every surface that wants to say "seven records, an
// EP and a set". Parsing it out of the title string would be a guess dressed as
// a derivation.

/* [R5 2026-08-06] THE EXPORT IS READ THROUGH THE SERVED BOUNDARY, NOT RAW.
   Mike ruled that this museum does not have Hunter Root's permission and must
   stop serving his material from its own vault. `hunter-root-served.js` strips
   every vault-hosted audio URL out of the export once, so neither this spine
   nor the deck can hand one to a browser. Read its header before changing
   anything here — it also records what it deliberately does NOT strip. */
import EXHIBIT from "../exhibits/hunter-root-served.js";
import { buildSpineFromArtifacts } from "./hunter-root-spine.js";

/* Presentation config — coverflow order, short album ids (hr_facts albumIds key
   off these), and display years. Years live here because the foundation's
   per-track year tags are video years, not album years. Art/accent are NOT
   configured here: albums without foundation art render the player's
   placeholder gradient (the retired bandcamp art stays retired).
   [W1 2026-08-05] arkansas 2022 -> 2023 and crooked 2024 -> 2025 were corrected
   on the records board in the same round; these years already agreed. */
export const HR_ALBUMS = [
  { id: "rwth",       tag: "run_with_the_hunt" },
  { id: "phone",      tag: "phone_recordings_ep",                      year: 2017 },
  { id: "cracked",    tag: "they_finally_cracked_me",                  year: 2018 },
  { id: "wheel",      tag: "life_inside_a_wheel",                      year: 2019 },
  { id: "dandelions", tag: "mimicking_the_sun_like_dandelions",        year: 2020 },
  { id: "skipping",   tag: "skipping_stones_that_sink_before_theyre_thrown", year: 2021 },
  { id: "arkansas",   tag: "arkansas",                                 year: 2023 },
  { id: "crooked",    tag: "crooked_home",                             year: 2025 },
  { id: "rarities",   tag: "rarities" },
];

export const HR_SPINE = buildSpineFromArtifacts(EXHIBIT, HR_ALBUMS);

/* WHAT EACH CONTAINER IS, where it is not a record — with its article, because
   the article is part of the phrase every surface builds out of this. */
export const HR_KIND = {
  phone: "an EP",
  rarities: "a set of singles and rarities",
};

/* Derived, never typed. Every figure the museum prints about this holding comes
   from here or from the same arithmetic done on the same array. */
export const HR_RECORDS = HR_SPINE.filter((a) => !HR_KIND[a.id]).length;
export const HR_EXTRAS = HR_SPINE.filter((a) => HR_KIND[a.id]).map((a) => HR_KIND[a.id]);
export const HR_TRACKS = HR_SPINE.reduce((n, a) => n + a.tracks.length, 0);
