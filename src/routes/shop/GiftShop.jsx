// src/routes/shop/GiftShop.jsx
// The Weird.Baby Museum Gift Shop.
//
// Circulation: exhibits exit here. Direct URL arrivals land here too.
// Exits: the artist's external store (leaves weird.baby), or back to the lobby.
//
// Room anatomy, top to bottom (2026-07-06 rework — Mike: top billing only, no
// section labels, lobby exit in the top-right corner, and Weird.Baby rides the
// roster like any other artist — no standalone WB banner):
//   1. Walked-in bell (plays once on mount, no-op if sound file missing)
//   2. LOBBY exit (top-right corner)
//   3. "GIFT SHOP" signage
//   4. Top billing — one banner (?from=<id> match, else random from roster)
//   5. The rest of the roster, once each, unlabeled — no repeat of top billing

/* ===========================================================================
   [P11 2026-08-02] THE GIFT SHOP BILLING LAW — Mike, standing.
   Reported as "WAL is putting W.B on the gift shop page." The law, verbatim:

     · the exhibit's OWNER gets top billing on exit;
     · everyone else lists beneath by DATE STARTED WITH US, earliest first;
     · WEIRD.BABY IS LISTED ONLY WHEN THE EXHIBIT WAS WEIRD.BABY'S OWN —
       otherwise W.B does not appear at all.

   WHY THE OLD PAGE BROKE IT ON EVERY CLAUSE. Top billing was `?from=<wing>`
   matched against the roster, and the roster contains exactly one entry
   (Weird.Baby) — so leaving ANY wing that was not /wb either matched nothing
   and fell through to a random pick of a one-item list (Weird.Baby again) or
   matched nothing and still rendered the house tail. The order beneath was the
   order the artists happen to sit in the data file. And W.B rode the tail
   unconditionally. Three clauses, three failures, one page.

   THE THREE QUESTIONS, ANSWERED IN ONE PLACE. `billing()` below decides who is
   top, who follows and whether the house appears, and the JSX only draws the
   answer. That is deliberate: a law expressed as three scattered conditionals
   is a law that will be broken again by the next change to the markup.

   THE ONE CASE THE LAW DID NOT NAME was a visitor who arrives at /shop
   directly, having exited no exhibit at all. P11 stated a reading rather than
   deciding silently — nobody takes top billing, and the house is listed — and
   invited Mike to overrule.

   [B1 2026-08-02] HE RULED, AND HE RULED THE OTHER HALF OF IT: "house gets
   top billing and ALL get shown — that's the default for the no-exhibit-exit
   cases." So a direct arrival is not an absence of an owner, it is the HOUSE'S
   OWN ROOM: Weird.Baby takes the top slot the way any wing's owner does on
   exit, and the roster beneath is everybody. The clause reads better as his
   version than as ours — a shop with no one billed at the top opened on a grid
   and looked like a directory; a shop that bills its own house looks like a
   shop that belongs to somebody.

   [B1] AND THE VIEW RESETS BEFORE EVERY ENTRY. Mike: "no stale billing from a
   prior visit." Billing itself has always been derived from the URL and so was
   never stale — but the SIGHT of it could be, and that is the same complaint:
   the browser restores the scroll offset of the previous visit, so a visitor
   who had scrolled to the bottom of the roster and came back through a
   different exhibit's exit was returned to the middle of the page with the new
   top billing above their head, unseen. Whoever is billed at the top is the
   one thing this room has to say, and it is said at the top.
   =========================================================================== */

import React, { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import MuseumBar from "../../components/MuseumBar.jsx";
import { wbRoster } from "../../data/wb_roster";
import { worthAListenArtists } from "../../data/artists/worth-a-listen.js";
import "./GiftShop.css";

/* Which wings are WEIRD.BABY'S OWN. The house exhibit obviously, and the
   robots — they are the museum's own machines, not a guest's. WAL is not:
   nothing in that room is ours, which is the wing's own founding statement
   and is precisely why Mike caught W.B on the page. */
const HOUSE_WINGS = ["wb", "robots"];

/* ===========================================================================
   [S2 2026-08-05] THE TILE GOES TO THE ARTIST'S OWN FRONT DOOR.

   MIKE supplied four addresses and the instruction: "wire each artist's shop
   tile to their own place." `shopExit` on the artist entry is that address, and
   it is read FIRST — ahead of the three-step fallback below, which stays for
   anyone who has no declared exit.

   WHAT THE FALLBACK WAS DOING, artist by artist, and why a declaration beats a
   better-ordered guess:
     · Hunter Root — `shop: null`, so it fell to Bandcamp. His own site opens on
       "Official Merch Store". The shop was routing past the shop.
     · Jesse Welles — went straight to jessewelles.redstarmerch.com, the merch
       VENDOR. Same stock, but the visitor never sees whose it is.
     · Carsie Blanton — went to her /shop/ subpage rather than her home page.
     · Mikey Mike — `shop: null` and no Bandcamp, so it fell to his YouTube
       channel: a gift shop tile that opened a video feed.
   Reordering the fallback to prefer `site` fixes none of it — Mikey Mike's
   `site` IS the video channel, and the day an artist's `site` field changes for
   an unrelated reason the shop's exits change with it silently. Four addresses
   Mike gave get four fields he can read.

   EVERY ONE WAS OPENED AND READ, 2026-08-05, before it was wired. That is not
   ceremony: this wing already refused findmikeymike.com for a compromised page
   body, and the museum's own standing on outbound links is that a door is
   checked before it is hung. Notes sit on each artist's `shopExit`.

   THE TILE NO LONGER CLAIMS A STORE. It used to be labelled "Visit X's store"
   because it always resolved to something selling something; three of these
   four front doors carry a shop one click in and weekendatmikeys.com does not.
   The label states the destination it actually has.
   =========================================================================== */
function billing(fromWing, ownerId) {
  /* the shop speaks ONE shape, whoever the entry came from */
  const walEntries = worthAListenArtists.map((a) => ({
    id: a.id,
    name: a.name,
    since: a.since || "9999-12-31",   /* undated sorts last, visibly */
    image: a.art || null,
    storeUrl: a.shopExit ||
              (a.shop && a.shop.url) ||
              (a.listen && a.listen.url) ||
              (a.site && a.site.startsWith("http") ? a.site : null),
  }));
  const houseEntries = wbRoster.map((h) => ({ ...h, since: h.since || "9999-12-31" }));

  const direct = !fromWing;
  const houseOwns = HOUSE_WINGS.includes(fromWing);
  /* CLAUSE THREE. The house is on the page only when the exhibit was its own —
     or when there was no exhibit, which is its own front door. */
  const pool = (houseOwns || direct)
    ? [...walEntries, ...houseEntries]
    : walEntries;

  /* CLAUSE ONE. The owner is the album's artist where the wing said so
     (`&owner=`), the wing itself where the wing IS an artist (`?from=hr`), the
     house where the house owns the wing — and [B1] the house again where no
     exhibit was exited at all, because an unowned front door is still the
     house's front door. */
  const ownerKey = ownerId || (fromWing === "hr" ? "hunter-root"
                             : houseOwns ? "wb"
                             : direct ? "wb"
                             : null);
  /* [J3 2026-08-02] MIKE'S RULING — THE SET IS THE FALLBACK.
     B7 listed the one case the law leaves unbilled: a WAL exit that resolves no
     individual owner (`?from=wal` with no `&owner=`, or an `&owner=` that names
     nobody — a stale link in the wild). It cannot bill the house without
     breaking Clause 3, and B1's "house takes top billing" is scoped to the
     no-exhibit-exit case, which this is not: an exhibit WAS exited.
     MIKE: "the WAL shop presence is THE SET OF FOUR, always — they are a set,
     sized as a set. A WAL exit with no resolvable individual owner shows the
     WAL four with no W.B. The set IS the fallback."
     So the empty top slot is not an omission here, it is the answer: nobody is
     promoted out of the set, the four render at one size in the grid below, and
     the house stays off the page exactly as Clause 3 requires. It is written as
     a NAMED branch rather than left to fall out of `ownerKey === null`, because
     a behaviour nobody declared is a behaviour the next change will delete —
     and deleting this one would put W.B on a WAL page, which is the original
     defect Mike reported. */
  const resolved = ownerKey ? pool.find((e) => e.id === ownerKey) || null : null;
  const walSetFallback = !resolved && fromWing === "wal";
  const top = walSetFallback ? null : resolved;

  /* CLAUSE TWO, AS AMENDED [M7 2026-08-03]. MIKE: "WAL artists ALPHABETICAL
     always."
     The original clause was "earliest first, ties alphabetical", and for the
     WAL four it was producing an order nobody could read: Hunter Root above
     Carsie Blanton because his first accession into our vault is 2026-04-05
     and the wing was built 2026-07-30. That date is a fact about US — when we
     started keeping his files — and putting it in charge of the running order
     bills one guest above another on a ledger the guest never saw. J3 already
     ruled what these four are: "they are a set and are sized as a set." A set
     has one honest order and it is the alphabet.
     THE DATE RULE SURVIVES WHERE IT MEANS SOMETHING — for house entries, whose
     dates are the museum's own history and are ours to order by. That branch
     is UNREACHABLE TODAY and the arithmetic says why: the house is in the pool
     only when `houseOwns || direct`, and in exactly those cases `ownerKey`
     resolves to "wb", so the house is `top` and is filtered out of `rest`. So
     `rest` is the WAL set, always, on every entry the law allows. It is
     written as two branches anyway, because the day a second house entry
     exists it will land here and silently take the alphabet's order otherwise. */
  const walIds = new Set(walEntries.map((e) => e.id));
  const rest = pool
    .filter((e) => !top || e.id !== top.id)
    .sort((a, b) => {
      const aw = walIds.has(a.id), bw = walIds.has(b.id);
      if (aw !== bw) return aw ? -1 : 1;              /* the set leads */
      if (aw) return a.name.localeCompare(b.name);    /* the set is alphabetical */
      return a.since < b.since ? -1 : a.since > b.since ? 1
           : a.name.localeCompare(b.name);            /* the house keeps its dates */
    });

  return { top, rest, walSetFallback };
}

/* [S1 2026-08-05] ONE TILE, ONE SIZE. The `half` prop is gone — see the block
   over the grid below. [S2] and the label names the destination the tile has
   rather than the one it used to be able to assume. */
function Banner({ entry }) {
  return (
    <a
      className="featured-artist"
      href={entry.storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${entry.name} — opens in a new tab`}
    >
      <div className="featured-artist__image-wrap">
        {entry.image ? (
          <img src={entry.image} alt="" className="featured-artist__image" />
        ) : (
          <div className="featured-artist__image-fallback" aria-hidden="true">
            <div className="featured-artist__image-fallback-name">
              {entry.name}
            </div>
          </div>
        )}
      </div>
      <div className="featured-artist__meta">
        <div className="featured-artist__name">{entry.name}</div>
        {entry.blurb && (
          <div className="featured-artist__blurb">{entry.blurb}</div>
        )}
      </div>
    </a>
  );
}

export default function GiftShop() {
  const [searchParams] = useSearchParams();
  const fromId = searchParams.get("from");
  /* `owner` is the wing telling us whose album the visitor left from (WAL).
     `top` is C3's older promotion param, kept working as an alias so any link
     already in the wild still lands where it used to. */
  const ownerId = searchParams.get("owner") || searchParams.get("top");

  const { top, rest, walSetFallback } = useMemo(() => billing(fromId, ownerId), [fromId, ownerId]);

  /* [S1] The billed entry leads the grid; everyone else follows in the order
     `billing()` sorted them. The law decides the SEQUENCE, the stylesheet
     decides the size, and neither is allowed to do the other's job. */
  const all = useMemo(() => (top ? [top, ...rest] : rest), [top, rest]);

  /* [B1] THE VIEW RESETS BEFORE EVERY ENTRY — on arrival and on any change of
     who is billed. `scrollRestoration:"manual"` is the half that browsers do
     behind your back: without it Chrome re-applies the previous offset AFTER
     this effect runs, and the scrollTo is silently undone. It is restored on
     the way out so the rest of the museum keeps the browser's own behaviour,
     which is the right behaviour everywhere the top of the page is not the
     whole message. */
  useEffect(() => {
    const prev = typeof history !== "undefined" && history.scrollRestoration;
    try { if (prev) history.scrollRestoration = "manual"; } catch { /* unsupported */ }
    window.scrollTo(0, 0);
    return () => { try { if (prev) history.scrollRestoration = prev; } catch { /* unsupported */ } };
  }, [fromId, ownerId]);

  const bellRef = useRef(null);
  useEffect(() => {
    const bell = bellRef.current;
    if (!bell) return;
    const playPromise = bell.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, []);

  return (
    /* [J3] the branch the law took, said out loud in the DOM. Three answers are
       possible — an owner is billed, the WAL SET is the answer, or nobody is —
       and the third has never been reachable since B1 gave the direct arrival
       to the house. Stating it here is what makes "the set is the fallback"
       verifiable on glass instead of inferable from an absence. */
    <div className="gift-shop"
      data-billing={walSetFallback ? "wal-set" : top ? "owner" : "none"}>
      <audio
        ref={bellRef}
        src="/sounds/shop-bell.mp3"
        preload="auto"
        aria-hidden="true"
      />

      {/* TITLE BAR — museum-standard format (Mike 2026-07-06): brand left →
          lobby · room name centre · exit right → lobby.
          [R2 2026-08-02] It no longer MIRRORS the exhibit's bar, which is what
          the retired comment here said it did — it IS the exhibit's bar. */}
      <MuseumBar room="Gift Shop" />

      {/* ═══ [S1 2026-08-05] ONE GRID, AND NO TILE IS LARGER THAN ANOTHER ════
          MIKE, reading the room: "ALL GIFT SHOP TILES THE SAME SIZE, including
          Weird.Baby's own. No tile is larger than another."

          WHAT HE WAS LOOKING AT. Top billing rendered a FULL-WIDTH banner with
          a 2rem name in its own section, and everybody else rendered half-tiles
          two-up beneath it. On a direct arrival the house takes top billing
          (B1), so the shop's own front door opened on a Weird.Baby plate at
          roughly four times the area of Carsie Blanton's and Hunter Root's —
          the house, in the room whose entire job is other people's stores,
          shouting over its guests. J3 had already ruled the guests "a set,
          sized as a set"; this extends the same reading to everyone in it.

          THE BILLING LAW IS NOT REPEALED — IT IS RE-EXPRESSED AS ORDER. All
          three clauses still run in `billing()` above, `data-billing` still
          reports which branch answered, and whoever is billed is still the
          FIRST tile a visitor reads. What top billing loses is SIZE, which was
          never the thing the law asked for: it says who leads, not who is big.
          The J3 no-owner case is unchanged and still visible — nobody leads,
          the set simply starts the grid.

          SO THERE IS ONE SECTION AND ONE GRID. Two sections holding tiles of
          one size would draw a line across the room that means nothing, and a
          lone tile above a grid at the same size reads as an accident rather
          than as billing. The grid is `auto-fit` at a 420px floor, so five
          tiles run 2 · 2 · 1 and the fifth sits in a column, not across the
          row. A sixth artist is still a data entry and nothing else (F7b). */}
      {all.length > 0 && (
        <section className="gift-shop__section gift-shop__tiles">
          <div className="gift-shop__grid">
            {all.map((entry) => (
              entry.storeUrl
                ? <Banner key={entry.id} entry={entry} />
                : (
                  /* A tile with no confirmed destination renders DEAD rather
                     than pretending to be a link — same shape, no hover, no
                     pointer. Unreachable today: all four guests carry an
                     address Mike verified (S2) and the house carries its own
                     store. Kept because the day a fifth artist arrives without
                     one, this is the honest way to show them. */
                  <div key={entry.id} className="featured-artist featured-artist--dead">
                    <div className="featured-artist__image-wrap">
                      <div className="featured-artist__image-fallback" aria-hidden="true">
                        <div className="featured-artist__image-fallback-name">{entry.name}</div>
                      </div>
                    </div>
                    <div className="featured-artist__meta">
                      <div className="featured-artist__name">{entry.name}</div>
                      <div className="featured-artist__note">no address on file</div>
                    </div>
                  </div>
                )
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
