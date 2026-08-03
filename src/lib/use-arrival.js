// src/lib/use-arrival.js — HOW A ROOM OPENS.
//
// [M2 2026-08-03] MIKE'S RULING: "first visit to any page in a session presents
// default state (scrolled top, optimal sizes); thereafter sticky and
// user-controllable for the session. PRESETS carry their own state and are
// never overridden. THE HOMEPAGE ALWAYS starts clean at the top, every time —
// that's our space and we keep it neat."
//
// THREE BEHAVIOURS, AND THE RULING NAMES ALL THREE:
//
//   ONCE   — the museum's ordinary rooms. The first time a visitor opens this
//            room in this session they get the room as the museum arranged it:
//            the top of the page. Every visit after that in the same session
//            leaves the browser's own restoration alone, so the room is where
//            they left it. That is the "thereafter sticky" half, and it is the
//            half that a naive scroll-to-top-on-every-mount would destroy.
//   ALWAYS — the lobby. Mike's words, and they are about ownership rather than
//            about scrolling: it is the house's own room and the house keeps it
//            neat. (The gift shop is also always-reset, by the billing law's
//            Clause 5 — it owns that behaviour itself, for its own reason: the
//            top billing is the room's whole message and a restored offset can
//            land a returning visitor underneath it.)
//
// WHY sessionStorage AND NOT localStorage: a session is a visit. Coming back
// tomorrow should feel like arriving, not like resuming — and it is the same
// store the F3 fit already uses for its sizes, so "first visit in a session"
// means the same thing to the scroll and to the geometry.
//
// PRESETS ARE UNTOUCHED BY CONSTRUCTION, not by a special case. This hook moves
// the SCROLL and nothing else; sizes, selections and player state are carried by
// the preset machinery in its own keys. There is no code path here that can
// overwrite a preset's state, which is a stronger guarantee than a flag would
// be.
//
// ─── THE PART THAT IS NOT OBVIOUS ───────────────────────────────────────────
//
// `window.scrollTo(0, 0)` IS NOT ENOUGH, AND ON THE LOBBY IT DOES NOTHING AT
// ALL. Measured at 390x844: the lobby sets `height:100%` plus `overflow:auto` on
// BOTH `html` and `body`, which makes BODY the scroll port — `documentElement`
// reports a scrollHeight of 844 while `body` reports 1063. So the window has
// nothing to scroll and the call is a no-op on exactly the page whose rule is
// "ALWAYS starts clean at the top". All three are scrolled here rather than
// guessing which one is live in a given room.
//
// `history.scrollRestoration = "manual"` IS THE OTHER HALF. Chrome re-applies a
// remembered offset AFTER effects run, so a scrollTo in an effect is silently
// undone on a back-navigation. This is the same mechanism the gift shop's B1
// reset needed and for the same reason. It is restored on the way out, because
// remembering the offset is the RIGHT behaviour everywhere the top of the page
// is not the whole message.

import { useEffect } from "react";

const SEEN_PREFIX = "wb-arrived:";

function toTop() {
  /* every candidate scroll port — see the note above */
  try { window.scrollTo(0, 0); } catch { /* jsdom / very old */ }
  const el = document.scrollingElement;
  if (el) el.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  if (document.documentElement) document.documentElement.scrollTop = 0;
}

/**
 * @param {string} key   stable id for the room ("lobby", "booth", "wal", …).
 *                       Not the URL: two albums of one wing are one room.
 * @param {object} [opts]
 * @param {boolean} [opts.always]  reset on EVERY entry, not only the first of
 *                                 the session. The lobby, and nothing else.
 */
export function useArrival(key, { always = false } = {}) {
  useEffect(() => {
    if (!key) return undefined;

    let seen = false;
    if (!always) {
      try { seen = sessionStorage.getItem(SEEN_PREFIX + key) === "1"; }
      catch { /* private mode: treat every entry as a first visit */ }
    }

    /* A room already visited this session keeps the browser's restoration and
       the visitor's own position. Nothing to do, and nothing to undo. */
    if (seen) return undefined;

    const prev = typeof history !== "undefined" && history.scrollRestoration;
    try { if (prev) history.scrollRestoration = "manual"; } catch { /* unsupported */ }
    toTop();
    /* Twice, one frame apart. The first call lands before the room's own
       layout effects have run (the F3 fit resizes the carousel and the viewer,
       which can change the document's height under a scroll that has already
       happened); the second lands after. Cheap, and it is the difference
       between "top" and "nearly top" on the wings that fit themselves. */
    const raf = requestAnimationFrame(toTop);

    if (!always) {
      try { sessionStorage.setItem(SEEN_PREFIX + key, "1"); } catch { /* private mode */ }
    }

    return () => {
      cancelAnimationFrame(raf);
      try { if (prev) history.scrollRestoration = prev; } catch { /* unsupported */ }
    };
  }, [key, always]);
}

export default useArrival;
