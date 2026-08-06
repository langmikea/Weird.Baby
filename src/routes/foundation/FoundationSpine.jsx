// src/routes/foundation/FoundationSpine.jsx — /foundation.
//
// [D7 2026-08-06] M62, OPTION A. The Foundation was a SHEET page
// (`src/routes/Foundation.jsx`, deleted this round); Mike ruled it into a wing
// with albums and a tracklist like every other one. This file is the mount, and
// it is deliberately the same three lines every other wing's mount is —
// `HrSpine.jsx`, `WbSpine.jsx`, `Robots.jsx` and `Wal.jsx` all read like this.
// A wing that needed its own mounting shape would not have been ported; it
// would have been re-implemented.
//
// The wing's data, its three bespoke objects and the whole account of the port
// are in `src/data/artists/foundation.js` and
// `src/routes/exhibit/FoundationObjects.jsx`.
import Exhibit from "../exhibit/Exhibit.jsx";
import { foundation } from "../../data/artists/foundation.js";

export default function FoundationSpine() {
  return <Exhibit artist={foundation} />;
}
