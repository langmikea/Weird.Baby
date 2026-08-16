// src/data/wb_roster.js
// Single source of truth for the Weird.Baby Museum artist roster.
// Every featured artist in the museum appears here, once.
//
// The gift shop reads this file for:
//   - the top-billing slot (random pick when no exhibit context, or matched by
//     `id` when arriving from an exhibit via ?from=<id>)
//   - the rest-of-roster banners below it
//
// To add an artist: append an entry. That's it. No other files need to change.
// To remove an artist: delete the entry. Any ?from=<id> pointing at them will
// gracefully fall back to random.

export const wbRoster = [
  /* [F7b 2026-08-02] Hunter Root's FULL-WIDTH banner is REMOVED per Mike.
     His shop presence now rides the WAL artist tiles like everyone else's —
     one artist, one tile, one template. His entry is gone rather than
     flagged off; `?from=hr` degrades gracefully to the house pick. */
  {
    id: "wb",
    name: "Weird.Baby",
    /* [P11 2026-08-02] DATE STARTED WITH US, for the billing law's ordering.
       The day the house exhibit opened (STATE: SHIPPED 2026-07-06 —
       WB_ARTIST_LOBBY_BOOTH). Note that under the law W.B is usually not on
       the page at all; this date only matters on the exits where it is. */
    since: "2026-07-06",
    exhibitRoute: "/wb",
    storeUrl: "https://weird-baby.printful.me",
    storePlatform: "Printful",
    image: "/images/wb-merch/sticker.png", // Mike 2026-07-06: sticker art heads the WB banner
    /* [M7 2026-08-03] "Six little blues from Papa." IS GONE. MIKE: "remove the
       six blue notes from W.B's own shop; conform it to the standard template."
       TWO THINGS WRONG WITH IT AND THEY ARE THE SAME THING. It advertised SIX
       SONGS in a room that sells a STICKER — the blues are at /wb, the shop
       has never carried them, and a shop line that names stock it does not
       hold is the one thing a shop must not do. And it was off-template: every
       other entry on this page is a picture and a name, so the house was the
       only party on the board talking about itself.
       THE GIFT SHOP'S REGISTER (personality map, 2026-08-03) is "a trustworthy
       place to do business; the return to normalcy of the real world." That
       register is quiet by construction. Removing the line is not a loss of
       voice, it is the voice.
       No replacement blurb is written here. `Banner` renders the field only
       when it exists, so the house tile is now the standard template exactly —
       and what the shop should say about itself, if anything, is Mike's
       sentence to write, not Ops'. */
  },
];

/* ═══ [2026-08-15] THE FRIENDS ═══════════════════════════════════════════════
   MIKE: a "new quarter-size tile type for friends. Coalition for the Homeless
   is the first… Friend tiles always show, and sit at the bottom of whatever
   content is already defined."

   THEY ARE NOT ROSTER ENTRIES AND MUST NOT JOIN `wbRoster`. The roster is the
   set the BILLING LAW ranks — who leads, who is shown, in what order. A friend
   is none of those things: it is never billed, never ordered against an artist,
   and never absent. Putting one in the roster would hand it to three clauses
   that have no answer for it, and the first symptom would be a charity taking
   top billing in a shop on somebody's exit.

   THE ADDRESS IS THE ONE ALREADY IN THE BUILDING. `foundation.js` carries this
   exact URL, typed as Mike typed it and checked 2026-08-14 (it redirects to
   their giving page; the vanity address is the durable one and the hop is
   theirs to change). It is REPEATED here rather than imported, and that is a
   considered call rather than an oversight: Doctrine 17 hoists a PASSAGE the
   house says in two rooms, and this is not a passage — it is a destination.
   The Foundation's row is an ANSWER about where donations go; this is a door in
   a shop. Hoisting them together would file two different statements under one
   key and make an edit to either silently move the other.

   NOTHING IS SAID ABOUT THEM THAT WE HAVE NOT BEEN TOLD. No tagline, no
   mission line, no "our chosen charity" — the tile is a name and a door.
   Doctrine 12: a sentence describing a real organisation, written here, would
   read true and be invented, and this one belongs to somebody else. */
export const wbFriends = [
  {
    id: "coalition-for-the-homeless",
    name: "Coalition for the Homeless",
    url: "https://coalitionforthehomeless.org/donate",
  },
];

// Helper: find an artist by id, or return null.
export function getArtistById(id) {
  if (!id) return null;
  return wbRoster.find((a) => a.id === id) || null;
}

// Helper: pick a random artist from the roster. Used by the gift shop when
// there's no exhibit context (direct arrival, or unknown ?from).
export function pickRandomArtist() {
  if (wbRoster.length === 0) return null;
  const idx = Math.floor(Math.random() * wbRoster.length);
  return wbRoster[idx];
}
