// src/routes/HeldWing.jsx — THE DOOR ON A HELD WING, BROWSER SIDE.
//
// ═══ [H1 2026-08-06] WHAT THIS IS AND WHAT IT DELIBERATELY IS NOT ═══════════
// Mike ruled that `/hr` is not public: online for him and for Ops, reached
// through the admin page behind a password.
//
// THIS COMPONENT IS NOT THE LOCK. The lock is `src/worker.js`, which refuses to
// serve `/assets/held/*` without a cookie the password mints. This is only the
// part of the arrangement a browser can do, and it does exactly two things:
//
//   1. It renders THE LOBBY when the wing is not open, which is what every
//      unmatched address in this museum renders (App.jsx's catch-all, E2). A
//      visitor who types /hr sees the front door of the museum and is told
//      nothing — no password box, no "restricted", no 403, nothing that says
//      there is a room here. That is the "unguessable" half of the ruling, and
//      a login form at a public URL would have failed it.
//
//   2. It renders the Lobby AGAIN if the wing's chunk fails to load. That is
//      the case where somebody has set the session flag by hand and the worker
//      has refused them the file. The forger and the typo land in the same
//      place, which is the point: the failure is not a signal.
//
// SO A FORGED FLAG BUYS NOTHING, and that is the only reason it is safe for the
// flag to be plain `sessionStorage` (`src/lib/held.js`). Do not "harden" this
// file. Anything that looks like security here would be theatre — the material
// is behind the worker, and the worker is where a change belongs.

import { Component, Suspense } from "react";
import WbHome from "./WbHome.jsx";
import { heldOpen } from "../lib/held.js";

/* A class component because an error boundary is the one thing hooks still
   cannot do. It catches the chunk-load rejection React re-throws through
   Suspense. */
class HeldBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return <WbHome />;
    return this.props.children;
  }
}

export default function HeldWing({ children }) {
  if (!heldOpen()) return <WbHome />;
  return (
    <HeldBoundary>
      <Suspense fallback={null}>{children}</Suspense>
    </HeldBoundary>
  );
}
