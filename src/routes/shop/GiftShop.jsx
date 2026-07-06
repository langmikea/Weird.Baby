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
import "./GiftShop.css";

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

  // Everyone except top billing, once each. No tail repeat (Mike 2026-07-06).
  const others = wbRoster.filter((a) => a.id !== featured?.id);

  return (
    <div className="gift-shop">
      <audio
        ref={bellRef}
        src="/sounds/shop-bell.mp3"
        preload="auto"
        aria-hidden="true"
      />

      {/* LOBBY EXITS — both top corners, styled like the exhibit's nav
          buttons (Mike 2026-07-06) */}
      <nav className="gift-shop__exit gift-shop__exit--left" aria-label="Gift shop exit">
        <Link to="/" className="gift-shop__exit-link">
          ← LOBBY
        </Link>
      </nav>
      <nav className="gift-shop__exit gift-shop__exit--right" aria-label="Gift shop exit">
        <Link to="/" className="gift-shop__exit-link">
          LOBBY →
        </Link>
      </nav>

      <header className="gift-shop__signage">
        <h1 className="gift-shop__title">GIFT SHOP</h1>
      </header>

      {/* TOP BILLING — unlabeled */}
      {featured && (
        <section className="gift-shop__section gift-shop__featured">
          <Banner entry={featured} />
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
