// src/lib/held.js — THE BROWSER-SIDE FLAG ON A HELD WING.
//
// [H1 2026-08-06] Two functions, in their own module because a file that
// exports both a component and a helper breaks fast refresh — the same reason
// `src/lib/foundation-state.js` exists beside FoundationObjects.jsx.
//
// THIS IS NOT THE LOCK AND MUST NEVER BE MISTAKEN FOR ONE. The lock is
// `src/worker.js`, which refuses the shut directories without a cookie the
// password mints. This flag only decides whether the router bothers to ASK for
// a wing's chunks. Forging it in a console buys a request the server refuses
// and a render of the Lobby.
//
// [V1 2026-08-06] IT IS STILL THE ONLY KEY TO THE PERMISSION HOLD. The stage
// switch opens the STAGE door (the Portal, the machines' photographs) during
// development and does not touch `/hr`, which is held for a permission reason
// that no build flag may answer. See the [V1] header in src/worker.js.
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
