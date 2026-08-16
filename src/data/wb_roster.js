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
   is the first… Friend tiles always show, and sit last in whatever content is
   already defined."
   [2026-08-16] "LAST", NOT "AT THE BOTTOM" — his wording, and the behaviour is
   unchanged. Recorded because the rule is quoted in three places and a rule
   quoted in his words in two of them and Ops' in the third is the drift
   Doctrine 17 exists to stop.

   THEY ARE NOT ROSTER ENTRIES AND MUST NOT JOIN `wbRoster`. The roster is the
   set the BILLING LAW ranks — who leads, who is shown, in what order. A friend
   is none of those things: it is never billed, never ordered against an artist,
   and never absent. Putting one in the roster would hand it to three clauses
   that have no answer for it, and the first symptom would be a charity taking
   top billing in a shop on somebody's exit.

   ═══ [2026-08-16] THE ADDRESS IS NOW THEIR FRONT DOOR, NOT THEIR TILL ═══════
   MIKE: "Coalition links to https://www.coalitionforthehomeless.org/."
   It was `/donate`, and the change is a change of INTENT rather than of host: a
   shop tile that lands a visitor on a payment form is asking for money in a
   room whose whole doctrine is that this house does not. Their front page lets
   the visitor read who they are and find the giving page themselves, which is
   one click further and the right click.
   AND THE FOUNDATION'S COPY OF THIS URL IS GONE, so the note below about the
   two copies is now history rather than a live arrangement — he struck the
   FAQ's outbound door in the same instruction. This is the only place in the
   building that carries an address for them.
   THE PARAGRAPH THIS REPLACED, KEPT BECAUSE ITS REASONING STILL BINDS: the
   address was repeated here rather than imported from `foundation.js`, and that
   was a considered call — Doctrine 17 hoists a PASSAGE the house says in two
   rooms, and this is not a passage, it is a destination. Filing an ANSWER about
   where donations go and a DOOR IN A SHOP under one key would make an edit to
   either silently move the other. That is exactly why this round could change
   one and delete the other without them fighting.

   NOTHING IS SAID ABOUT THEM THAT WE HAVE NOT BEEN TOLD. No tagline, no
   mission line, no "our chosen charity" — the tile is a name and a door.
   Doctrine 12: a sentence describing a real organisation, written here, would
   read true and be invented, and this one belongs to somebody else.

   `image` IS DECLARED AND EMPTY, WHICH IS NOT THE SAME AS ABSENT. Mike asked
   for a preview image on this tile; the tile can carry one now (`friend-tile`
   draws the well only when there is a picture in it) and there is no picture to
   put there. A charity's own logo is THEIR asset, needs a row in
   `provenance/assets.json` that Ops cannot honestly write, and fetching it off
   their site and shipping it under this house's name is not a call Ops makes.
   The field is here so that supplying one is a file and a path.

   ═══ [2026-08-16b] AND UNTIL THERE IS ONE, THE TILE IS HIDDEN ═══════════════
   MIKE: **"looks like shit."** A name and a door in a box, with no picture,
   beside four artist tiles that are all picture — it read as an unfinished
   row rather than as a friend.

   IT IS HIDDEN BY EMPTYING THE LIST, NOT BY DELETING THE ENTRY OR THE
   MECHANISM. `wbFriends` is the only thing `GiftShop.jsx` guards on
   (`wbFriends.length > 0`), so an empty array removes the whole section — the
   grid, the heading rule and the tile — with no branch anywhere and nothing
   half-drawn. **THE ENTRY ITSELF IS KEPT, WHOLE AND ADDRESSED, one line below
   the hold**, so bringing it back is moving one object and adding a path: the
   friend-tile TYPE, its quarter-size grid, the preview well, the ordering rule
   (`last in whatever content is already defined`) and this entry's verified URL
   are all untouched and all still true of the day it returns.

   A HIDING RULING IS NOT DONE UNTIL A LEDGER ROW MOVES. `shop.friends` in
   `reveal/ledger-declare.mjs` — NOT_BUILT / HELD, dependency stated as the one
   thing it waits on. It had NO ROW AT ALL before today, which is its own
   finding: the tile shipped on 2026-08-15 and the ledger never knew it existed,
   so nothing could have reported it as either live or held. */
const FRIENDS_HELD = [
  {
    id: "coalition-for-the-homeless",
    name: "Coalition for the Homeless",
    url: "https://www.coalitionforthehomeless.org/",
    image: null,
  },
];

export const wbFriends = [];
/* the hold, said in code as well as in prose: exported so a reader can see the
   held entry exists rather than take this file's word for it, and referenced
   here so the constant is never "unused" and never quietly deleted. */
export const wbFriendsHeld = FRIENDS_HELD;

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
