// src/lib/held.js — THE BROWSER-SIDE FLAG ON A HELD WING.
//
// [H1 2026-08-06] Two functions, in their own module because a file that
// exports both a component and a helper breaks fast refresh — the same reason
// `src/lib/foundation-state.js` exists beside FoundationObjects.jsx.
//
// THIS IS NOT THE LOCK AND MUST NEVER BE MISTAKEN FOR ONE. The lock is
// `src/worker.js`, which refuses `/assets/held/*` without a cookie the password
// mints. This flag only decides whether the router bothers to ASK for the
// wing's chunks. Forging it in a console buys a request the server refuses and
// a render of the Lobby.
//
// SESSION-SCOPED (P5): a view setting expires with the visit. The cookie behind
// it is thirty days, so a new tab costs one click on /admin, not the key again.

const FLAG = "wb-held-open";

export function heldOpen() {
  try { return sessionStorage.getItem(FLAG) === "1"; } catch { return false; }
}

export function markHeldOpen(open) {
  try {
    if (open) sessionStorage.setItem(FLAG, "1");
    else sessionStorage.removeItem(FLAG);
  } catch { /* private mode; the worker is still the lock */ }
}
