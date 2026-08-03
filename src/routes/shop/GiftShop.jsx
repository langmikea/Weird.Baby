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

   THE ONE CASE THE LAW DOES NOT NAME is a visitor who arrives at /shop
   directly, having exited no exhibit at all. There is no owner, so nobody
   takes top billing; and since no exhibit was left, the "otherwise" clause has
   nothing to bite on — this is the shop's own front door rather than someone's
   exit, so the house is listed. Stated here rather than decided silently.
   =========================================================================== */

import React, { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { wbRoster } from "../../data/wb_roster";
import { worthAListenArtists } from "../../data/artists/worth-a-listen.js";
import "./GiftShop.css";

/* Which wings are WEIRD.BABY'S OWN. The house exhibit obviously, and the
   robots — they are the museum's own machines, not a guest's. WAL is not:
   nothing in that room is ours, which is the wing's own founding statement
   and is precisely why Mike caught W.B on the page. */
const HOUSE_WINGS = ["wb", "robots"];

function billing(fromWing, ownerId) {
  /* the shop speaks ONE shape, whoever the entry came from */
  const walEntries = worthAListenArtists.map((a) => ({
    id: a.id,
    name: a.name,
    since: a.since || "9999-12-31",   /* undated sorts last, visibly */
    image: a.art || null,
    storeUrl: (a.shop && a.shop.url) ||
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
     (`&owner=`), the wing itself where the wing IS an artist (`?from=hr`), and
     the house where the house owns the wing. */
  const ownerKey = ownerId || (fromWing === "hr" ? "hunter-root"
                             : houseOwns ? "wb"
                             : null);
  const top = ownerKey ? pool.find((e) => e.id === ownerKey) || null : null;

  /* CLAUSE TWO. Earliest first, ties alphabetical — the wing's own standing
     order, and the only tiebreak that cannot be read as a favour. */
  const rest = pool
    .filter((e) => !top || e.id !== top.id)
    .sort((a, b) => (a.since < b.since ? -1 : a.since > b.since ? 1 :
                     a.name.localeCompare(b.name)));

  return { top, rest };
}

function Banner({ entry, half }) {
  return (
    <a
      className={"featured-artist" + (half ? " featured-artist--half" : "")}
      href={entry.storeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Visit ${entry.name}'s store — opens in a new tab`}
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

  const { top, rest } = useMemo(() => billing(fromId, ownerId), [fromId, ownerId]);

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
    <div className="gift-shop">
      <audio
        ref={bellRef}
        src="/sounds/shop-bell.mp3"
        preload="auto"
        aria-hidden="true"
      />

      {/* TITLE BAR — museum-standard exhibit format (Mike 2026-07-06):
          brand left → lobby · room name center · exit right → lobby.
          Mirrors Exhibit.jsx's ex-nav (brand / artist / Gift Shop). */}
      <div className="gift-shop__nav">
        <Link to="/" className="gift-shop__nav-logo">Weird.Baby</Link>
        <h1 className="gift-shop__nav-sub">Gift Shop</h1>
        <Link to="/" className="gift-shop__nav-return">Lobby</Link>
      </div>

      {/* CLAUSE ONE — TOP BILLING, and only where the exit named an owner.
          A direct arrival names none, so the slot is simply absent rather
          than filled with a random face: the page opens on the whole shop,
          which is what it is when nobody sent you. */}
      {top && (
        <section className="gift-shop__section gift-shop__featured">
          <Banner entry={top} />
        </section>
      )}

      {/* CLAUSE TWO — EVERYONE ELSE, EARLIEST FIRST.
          [F7b] One template, data only: every tile is one row of the pool,
          and a fifth artist is a data entry and nothing else. Tiles are
          DOUBLE HEIGHT per Mike — the grid runs two-up so each plate doubles
          its edge, and the artist's own face (W8) fills it. A tile with no
          confirmed destination still renders DEAD rather than pretending to
          be a link. */}
      {rest.length > 0 && (
        <section className="gift-shop__section gift-shop__wal">
          <div className="wal-banners__grid">
            {rest.map((entry) => (
              entry.storeUrl
                ? <Banner key={entry.id} entry={entry} half />
                : (
                  <div key={entry.id} className="featured-artist featured-artist--half featured-artist--dead">
                    <div className="featured-artist__image-wrap">
                      <div className="featured-artist__image-fallback" aria-hidden="true">
                        <div className="featured-artist__image-fallback-name">{entry.name}</div>
                      </div>
                    </div>
                    <div className="featured-artist__meta">
                      <div className="featured-artist__name">{entry.name}</div>
                      <div className="featured-artist__note">no store on file</div>
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
