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

import React, { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { wbRoster, getArtistById, pickRandomArtist } from "../../data/wb_roster";
import { worthAListenArtists } from "../../data/artists/worth-a-listen.js";
import "./GiftShop.css";

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

  const featured = useMemo(() => {
    const fromExhibit = getArtistById(fromId);
    return fromExhibit || pickRandomArtist();
  }, [fromId]);

  const bellRef = useRef(null);
  useEffect(() => {
    const bell = bellRef.current;
    if (!bell) return;
    const playPromise = bell.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {});
    }
  }, []);

  // Everyone except top billing, once each. No tail repeat (Mike 2026-07-06).
  const others = wbRoster.filter((a) => a.id !== featured?.id);

  /* WAL artists, mapped into the banner shape the shop already speaks. The
     destination is the artist's own store where one was confirmed, their own
     site where it was not, and nothing at all where neither is known. */
  /* [C3 2026-08-02] TOP BILLING BY QUERY PARAM. `/shop?top=<artist-id>`
     promotes that artist to the featured slot at full size. They ALSO stay in
     the WAL section below - Mike's ruling - so the page still reads as the
     whole shop rather than as one artist's landing page with a tail. An
     unknown or absent id simply falls through to the normal featured pick,
     which is the same degrade-quietly contract the portal presets use. */
  const topId = searchParams.get("top");
  const walEntries = worthAListenArtists.map((a) => ({
    id: "wal-" + a.id,
    name: a.name,
    image: null,                       /* FLAGGED FOR ART */
    storeUrl: (a.shop && a.shop.url) ||
              (a.listen && a.listen.url) ||
              (a.site && a.site.startsWith("http") ? a.site : null),
  }));
  const walTop = topId ? walEntries.find((w) => w.id === "wal-" + topId) : null;

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

      {/* TOP BILLING — unlabeled */}
      {walTop ? (
        <section className="gift-shop__section gift-shop__featured">
          <Banner entry={walTop} />
        </section>
      ) : featured && (
        <section className="gift-shop__section gift-shop__featured">
          <Banner entry={featured} />
        </section>
      )}

      {/* [WAL 2026-08-02] WORTH A LISTEN — HALF-SIZE BANNERS.
          Mike: every WAL artist gets a banner in the shop, at half size. The
          slots are built here and the ART IS A PLACEHOLDER — the same
          typographic fallback the roster already uses when an entry has no
          image, so nothing new was invented to hold a picture that does not
          exist yet. FLAGGED: Mike's art replaces `image` and nothing else
          moves.
          A banner with no destination is NOT a link. Mikey Mike has no
          confirmed official store or site, and a banner that goes nowhere is
          worse than a banner that says so — so those render as plain cards
          with the reason on them rather than as dead anchors. */}
      {walEntries.length > 0 && (
        <section className="gift-shop__section gift-shop__wal">
          <div className="wal-banners__grid">
            {walEntries.map((entry) => (
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

      {/* THE REST OF THE ROSTER — unlabeled */}
      {others.length > 0 && (
        <section className="gift-shop__section gift-shop__friends">
          <div className="friends__grid">
            {others.map((entry) => (
              <Banner key={entry.id} entry={entry} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
