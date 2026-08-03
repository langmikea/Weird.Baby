// src/lib/use-overlay.js — THE OVERLAY'S SHARED BEHAVIOUR, ONCE.
//
// [R3 2026-08-02] B7 counted EIGHT full-screen overlays in this museum —
// GalleryOverlay, AlbumOverlay, YouTubeOverlay, FacebookOverlay, PhotoOverlay
// and FilterInstrumentOverlay (all HrExhibitFlow), plus the robots wing's live
// twin and its plate reader — and no primitive under any of them. The six in HR
// carried six copies of
//
//     const onKey = (e) => { if (e.key === "Escape") onClose(); };
//     window.addEventListener("keydown", onKey);
//
// and five copies of the body-scroll lock. The review's point was not the
// duplication itself but what duplication does: each new overlay re-derives the
// behaviour, and the EIGHTH had to reason from scratch about which overlay
// Escape should close, because nothing owned that question.
//
// WHY A HOOK AND NOT A <WRAPPER> COMPONENT. R3 sketched an `<Overlay>` owning
// "ground, z-order, Escape and focus". Three of those four are already
// per-overlay by design: the gallery, the video, the post and the filter panel
// have genuinely different grounds and different internal layouts, and their
// class families carry real, separately-tuned CSS. Wrapping them in a shared
// element would either flatten that or turn the wrapper into a pass-through for
// six class names, which is a component in name only. What they actually SHARE
// is behaviour, so behaviour is what is extracted. Markup is untouched by this
// change — which is also why it cannot move a pixel.
//
// WHAT THE EXTRACTION FIXED ON THE WAY. Measured across the six:
//   · SIX copies of the Escape handler → one.
//   · FIVE of the six locked body scroll; FilterInstrumentOverlay did not, so
//     the page scrolled behind the one overlay a visitor is most likely to
//     scroll at. That is the drift R3 predicted, found by lining the six up
//     next to each other. It locks now, like its five siblings.
//   · NONE of them restored focus. Open an overlay, press Escape, and the
//     keyboard was back at the top of the document with the visitor's place
//     lost. The hook remembers what was focused and puts it back — the "focus"
//     R3 named, and it is one place now rather than eight.

import { useEffect, useRef } from "react";

/**
 * Escape-to-close, body-scroll lock, and focus restoration for a full-screen
 * overlay.
 *
 * @param onClose   called on Escape. Required — an overlay you cannot leave by
 *                  keyboard is not an overlay, it is a trap.
 * @param onKey     optional extra key handler, called for every keydown that
 *                  Escape did not already consume. The gallery steps photos on
 *                  the arrow keys; most overlays pass nothing.
 * @param lockScroll  default true — the behaviour five of the six already had.
 */
export function useOverlay(onClose, onKey, lockScroll = true) {
  /* Handlers are held in refs so the listener is installed ONCE per overlay
     rather than re-installed on every render that happens to make a new
     closure. The old copies listed `onClose` as a dependency and so tore the
     listener down and rebuilt it whenever the parent re-rendered — harmless,
     and needless. */
  const closeRef = useRef(onClose);
  const keyRef = useRef(onKey);
  useEffect(() => { closeRef.current = onClose; keyRef.current = onKey; });

  useEffect(() => {
    function handler(e) {
      if (e.key === "Escape") { closeRef.current && closeRef.current(e); return; }
      if (keyRef.current) keyRef.current(e);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (!lockScroll) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [lockScroll]);

  /* Focus goes back where it came from. Captured on mount rather than read at
     unmount, because by then the element that opened the overlay may itself be
     gone — the guard is `isConnected`, not a try/catch. */
  useEffect(() => {
    const opener = document.activeElement;
    return () => {
      if (opener && opener.isConnected && typeof opener.focus === "function") {
        opener.focus({ preventScroll: true });
      }
    };
  }, []);
}

export default useOverlay;
