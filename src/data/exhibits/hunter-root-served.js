// src/data/exhibits/hunter-root-served.js — THE ONE DOOR THE HUNTER ROOT
// EXPORT REACHES THE BROWSER THROUGH.
//
// ═══ [R5 2026-08-06] WHY THIS FILE EXISTS ═══════════════════════════════════
// MIKE: "WE DO NOT HAVE HIS PERMISSION. He was never reached, the ask was never
// answered, therefore it is not granted — and that is precisely why WAL is a
// sample platter instead of a single-artist wing… The vault keeps the material;
// the site stops serving it. Verify nothing else on the public site serves vault
// audio."
//
// HIS PREMISE WAS THAT TWO SONGS WERE AFFECTED. THE VERIFICATION HE ASKED FOR
// FOUND THE OPPOSITE SHAPE OF THE PROBLEM, IN BOTH DIRECTIONS:
//
//   · THE TWO SONGS ON /wal WERE NEVER SERVED FROM THE VAULT. They are and
//     always were YouTube embeds of his own channel — checked this round, not
//     assumed: oEmbed on vPW49GU38Ng and Wv0_mujJUQU both return author_name
//     "Hunter Root", author_url youtube.com/@hunterrootmusic. Nothing to switch.
//   · /hr WAS SERVING NINETY-THREE. Every track in the exhibit export carries a
//     rendition whose `audioUrl` is an mp3 on the museum's own CDN, and sixty of
//     them ALSO sit on the album containers as `primary_url`, which the deck's
//     album overlay plays. That is his entire vaulted catalogue, streaming from
//     our host, on an address anybody can type.
//
// SO THE RULE IS WRITTEN ONCE, AT THE BOUNDARY, RATHER THAN AT EACH PLAYER.
// Two modules import the export — `hunter-root-catalogue.js` (which builds the
// spine for /hr and /hr/archive) and `HrExhibitFlow.jsx` (the deck). A rule
// enforced in two players is a rule that comes back the day somebody writes a
// third; this module is the only thing either of them imports now, and the raw
// JSON has no other reader in `src/`.
//
// ═══ WHAT IT REMOVES, AND WHAT IT DELIBERATELY DOES NOT ═════════════════════
// REMOVED: any URL under the vault's own audio path. Renditions are dropped
// whole (a video row with no source is worse than no row); a track's
// `primary_url` and an artifact's `primary_url` are nulled, which is a state
// both consumers already draw — the tracklist has `.tl-novid` and the album
// overlay has "unavailable", and neither was written for this round.
//
// NOT REMOVED, and each is a stated decision rather than an oversight:
//   · THE TRACK ROWS. Ninety-three tracks stay on /hr and on /hr/archive. The
//     museum still HOLDS them; a catalogue is a holdings listing, and deleting
//     the listing would be the museum pretending it does not have what it has.
//     What changed is that it stopped handing them out.
//   · THE YOUTUBE RENDITIONS. Thirty-three of the ninety-three tracks carry one,
//     and those are embeds of his own uploads — the posture Mike asked for, and
//     the posture the other three artists in this museum already stand in.
//   · IMAGES. Three photographs and the album covers are also on the vault's
//     host. His instruction says audio and this file does audio; the images are
//     the same class of question and are a row in docs/OPEN_ACTIONS.md rather
//     than a silent extension of a ruling he did not give.
//
// ═══ THE COST, MEASURED, BECAUSE IT IS NOT SMALL ════════════════════════════
// Thirty-three tracks keep a playable rendition. SIXTY DO NOT — every track on
// Run With The Hunt and the Phone Recordings EP, eleven of twelve on Life Inside
// A Wheel, ten of eleven on They Finally Cracked Me. They are the tracks with no
// official upload anywhere, which is exactly why the vault copy existed. What
// /hr should LOOK like without them is a UX call and it is Mike's; this file
// makes no such call, it only stops the serving.

// ═══ IT IS ENFORCED TWICE AND THAT IS NOT A DUPLICATION ═════════════════════
// The BUILD strips the export before it is bundled (`vite.config.js`, the
// `hr-vault-audio` plugin), because a runtime filter still SHIPS the addresses:
// the first pass at this left 153 vault mp3 URLs sitting in the JavaScript
// bundle, unrequested and perfectly readable. "The site stops serving it" has
// to mean the site stops publishing where it is.
// This module is the RUNTIME pass, for the dev server and for any future
// consumer that reaches the JSON another way.
// NEITHER RESTATES THE RULE. Both call `stripVaultAudio` out of
// `./vault-audio.js`, which is a pure function with no imports precisely so
// that node and the browser can share it, and it is idempotent — running it on
// its own output changes nothing, which is what lets both passes stand.

import RAW from "./hunter_root.json";
import { stripVaultAudio } from "./vault-audio.js";

export const HR_EXHIBIT = stripVaultAudio(RAW);

export default HR_EXHIBIT;
