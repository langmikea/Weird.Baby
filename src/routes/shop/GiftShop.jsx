// src/routes/shop/GiftShop.jsx
// The Weird.Baby Museum Gift Shop.
//
// Circulation: exhibits exit here. Direct URL arrivals land here too.
// Exits: the artist's external store (leaves weird.baby), or back to the lobby.
//
// Room anatomy, top to bottom:
//   1. Walked-in bell (plays once on mount, no-op if sound file missing)
//   2. "GIFT SHOP" signage
//   3. FEATURED — one artist, prominent, links out to their external store
//   4. WEIRD.BABY — the museum's own merch (coming soon until pipeline is live)
//   5. FRIENDS — the full roster, displayed out of love
//   6. LOBBY exit
//
// Featured artist selection:
//   - /shop?from=<id>  -> that artist (arrived via exhibit exit)
//   - /shop            -> random pick from roster
//   - /shop?from=junk  -> random pick (unknown id falls back gracefully)

import React, { useEffect, useMemo, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { wbRoster, getArtistById, pickRandomArtist } from "../../data/wb_roster";
import { wbMerch } from "../../data/wb_merch";
import "./GiftShop.css";

export default function GiftShop() {
  const [searchParams] = useSearchParams();
  const fromId = searchParams.get("from");

  // Deterministic when arriving from an exhibit. Random otherwise.
  // useMemo so the random pick is stable for the lifetime of this mount
  // (refreshing the page is what reshuffles — that's intentional).
  const featured = useMemo(() => {
    const fromExhibit = getArtistById(fromId);
    return fromExhibit || pickRandomArtist();
  }, [fromId]);

  // Walked-in bell. Plays once on mount. If the audio file is missing,
  // the play() promise rejects silently and the page still works.
  const bellRef = useRef(null);
  useEffect(() => {
    const bell = bellRef.current;
    if (!bell) return;
    const playPromise = bell.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // No bell file, autoplay blocked, etc. — room still works, stay silent.
      });
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

      <header className="gift-shop__signage">
        <h1 className="gift-shop__title">GIFT SHOP</h1>
      </header>

      {/* FEATURED ARTIST */}
      {featured && (
        <section className="gift-shop__section gift-shop__featured">
          <div className="gift-shop__eyebrow">Featured</div>
          <a
            className="featured-artist"
            href={featured.storeUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${featured.name}'s store — opens in a new tab`}
          >
            <div className="featured-artist__image-wrap">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt=""
                  className="featured-artist__image"
                />
              ) : (
                <div
                  className="featured-artist__image-placeholder"
                  aria-hidden="true"
                />
              )}
            </div>
            <div className="featured-artist__meta">
              <div className="featured-artist__name">{featured.name}</div>
              {featured.blurb && (
                <div className="featured-artist__blurb">{featured.blurb}</div>
              )}
              <div className="featured-artist__cta">
                Visit {featured.name}'s store →
              </div>
            </div>
          </a>
        </section>
      )}

      {/* WEIRD.BABY'S OWN MERCH */}
      <section className="gift-shop__section gift-shop__wb">
        <div className="gift-shop__eyebrow">Weird.Baby</div>
        {wbMerch.live && wbMerch.featured.length > 0 ? (
          <>
            <div className="wb-merch__grid">
              {wbMerch.featured.map((item, i) => (
                <a
                  key={i}
                  className="wb-merch__item"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="wb-merch__image-wrap">
                    {item.img ? (
                      <img
                        src={item.img}
                        alt=""
                        className="wb-merch__image"
                      />
                    ) : (
                      <div className="wb-merch__image-placeholder" />
                    )}
                  </div>
                  <div className="wb-merch__title">{item.title}</div>
                  <div className="wb-merch__price">{item.price}</div>
                </a>
              ))}
            </div>
            <div className="gift-shop__cta-wrap">
              <a
                className="gift-shop__cta"
                href={wbMerch.storeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit the Weird.Baby store →
              </a>
            </div>
          </>
        ) : (
          <div className="wb-merch__placeholder">
            <p>Museum merch coming soon.</p>
          </div>
        )}
      </section>

      {/* FRIENDS — the wall of love */}
      <section className="gift-shop__section gift-shop__friends">
        <div className="gift-shop__eyebrow">Friends</div>
        <div className="friends__grid">
          {wbRoster.map((artist) => (
            <a
              key={artist.id}
              className="friends__card"
              href={artist.storeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${artist.name}'s store — opens in a new tab`}
            >
              <div className="friends__image-wrap">
                {artist.image ? (
                  <img
                    src={artist.image}
                    alt=""
                    className="friends__image"
                  />
                ) : (
                  <div className="friends__image-placeholder" />
                )}
              </div>
              <div className="friends__name">{artist.name}</div>
              {artist.blurb && (
                <div className="friends__blurb">{artist.blurb}</div>
              )}
            </a>
          ))}
        </div>
      </section>

      {/* LOBBY EXIT */}
      <nav className="gift-shop__exit" aria-label="Gift shop exits">
        <Link to="/" className="gift-shop__exit-link">
          ← LOBBY
        </Link>
      </nav>
    </div>
  );
}
