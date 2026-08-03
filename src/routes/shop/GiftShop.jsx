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

  /* CLAUSE TWO. Earliest first, ties alphabetical — the wing's own standing
     order, and the only tiebreak that cannot be read as a favour. */
  const rest = pool
    .filter((e) => !top || e.id !== top.id)
    .sort((a, b) => (a.since < b.since ? -1 : a.since > b.since ? 1 :
                     a.name.localeCompare(b.name)));

  return { top, rest, walSetFallback };
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

  const { top, rest, walSetFallback } = useMemo(() => billing(fromId, ownerId), [fromId, ownerId]);

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

      {/* CLAUSE ONE — TOP BILLING. The owner of the exhibit that was exited;
          [B1] the HOUSE on a direct arrival, because an unowned front door is
          still the house's own room; and [J3] NOBODY on a WAL exit that
          resolves no individual owner, where the set of four below IS the
          answer and promoting one of them would invent a billing the exit did
          not name. */}
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
