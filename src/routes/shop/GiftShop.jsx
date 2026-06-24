// src/routes/shop/GiftShop.jsx
// The Weird.Baby Museum Gift Shop.
//
// Circulation: exhibits exit here. Direct URL arrivals land here too.
// Exits: the artist's external store (leaves weird.baby), or back to the lobby.
//
// Room anatomy, top to bottom:
//   1. Walked-in bell (plays once on mount, no-op if sound file missing)
//   2. "GIFT SHOP" signage
//   3. FEATURED banner (top)
//   4. FRIENDS — Weird.Baby first, then the roster
//   5. FEATURED banner again (bottom, identical)
//   6. LOBBY exit (right-aligned)

import React, { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { wbRoster, getArtistById, pickRandomArtist } from "../../data/wb_roster";
import { wbMerch } from "../../data/wb_merch";
import "./GiftShop.css";

// Weird.Baby shown as the first banner in Friends — same shape as an artist.
const wbAsBanner = {
  id: "weird-baby",
  name: wbMerch.storeName,
  storeUrl: wbMerch.storeUrl,
  image: wbMerch.featured[0]?.img || null,
  blurb:
    "Stickers, shirts, and hats from the museum itself. Buy a little weirdness — and help us keep the lights on for the artists we love.",
};

function Banner({ entry }) {
  return (
    <a
      className="featured-artist"
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

  // Friends list: Weird.Baby first, then everyone once,
  // with the featured artist moved to the very end.
  const others = wbRoster.filter((a) => a.id !== featured?.id);
  const featuredInRoster = wbRoster.find((a) => a.id === featured?.id);
  const friends = [
    wbAsBanner,
    ...others,
    ...(featuredInRoster ? [featuredInRoster] : []),
  ];

  return (
    <div className="gift-shop">
      <audio
        ref={bellRef}
        src="/sounds/shop-bell.mp3"
        preload="auto"
        aria-hidden="true"
      />

      <header className="gift-shop__signage">
        <h1 className="gift-shop__title">GIFT SHOP</h1>
      </header>

      {/* FEATURED (top) */}
      {featured && (
        <section className="gift-shop__section gift-shop__featured">
          <div className="gift-shop__eyebrow gift-shop__eyebrow--featured">
            Featured
          </div>
          <Banner entry={featured} />
        </section>
      )}

      {/* FRIENDS — Weird.Baby first, then the roster */}
      <section className="gift-shop__section gift-shop__friends">
        <div className="gift-shop__eyebrow gift-shop__eyebrow--friends">
          Friends
        </div>
        <div className="friends__grid">
          {friends.map((entry) => (
            <Banner key={entry.id} entry={entry} />
          ))}
        </div>
      </section>

      {/* LOBBY EXIT — right-aligned */}
      <nav className="gift-shop__exit" aria-label="Gift shop exit">
        <Link to="/" className="gift-shop__exit-link">
          LOBBY →
        </Link>
      </nav>
    </div>
  );
}