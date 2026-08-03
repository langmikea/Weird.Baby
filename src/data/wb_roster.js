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
    blurb: "Six little blues from Papa.", // Mike-approved 2026-07-06
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
