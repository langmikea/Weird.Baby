import Exhibit from "../exhibit/Exhibit.jsx";
import { worthAListenExhibit } from "../../data/artists/worth-a-listen.js";
import WalExhibitFlow from "./WalExhibitFlow.jsx";

/* /wal — WORTH A LISTEN. The same Exhibit.jsx as /hr, /wb and /robots, driven
   by a different artist config; the route is three lines because the engine
   is the engine and this wing is data. The only wing-specific surface is the
   link handoff, and that rides the documented exhibitFlow seam exactly the
   way the twin does — so the shared engine never learns what an outbound
   artist link is. */
export default function Wal() {
  return <Exhibit artist={{ ...worthAListenExhibit, exhibitFlow: WalExhibitFlow }} />;
}
