// src/data/wb_roster.js
// Single source of truth for the Weird.Baby Museum artist roster.
// Every featured artist in the museum appears here, once.
//
// The gift shop reads this file for:
//   - the Featured slot (random pick when no exhibit context, or matched by `id`
//     when arriving from an exhibit via ?from=<id>)
//   - the Friends wall at the bottom (all of them, displayed out of love)
//
// To add an artist: append an entry. That's it. No other files need to change.
// To remove an artist: delete the entry. Any ?from=<id> pointing at them will
// gracefully fall back to random.

export const wbRoster = [
  {
    id: "hr",
    name: "Hunter Root",
    exhibitRoute: "/hr",
    storeUrl: "https://hunterroot.com/merch",
    storePlatform: "Squarespace",
    image: "/images/roster/hunter-root.jpg", // TODO: add actual image
    blurb: "Central PA songwriter. Six albums. Aphantasic lyric cinema.",
  },
  {
    id: "cb",
    name: "Carsie Blanton",
    exhibitRoute: "/cb",
    storeUrl: "https://store.carsieblanton.com/",
    storePlatform: "Shopify",
    image: "/images/roster/carsie-blanton.jpg", // TODO: add actual image
    blurb: "Songwriter with hooks, chutzpah, and revolutionary optimism.",
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
