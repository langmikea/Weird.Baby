import Exhibit from "../exhibit/Exhibit.jsx";
import { robotsExhibit } from "../../data/artists/robots.js";

/* /robots — walk-six structural rebuild (2026-07-25, STAGED ONLY):
   Robots IS the museum's shared exhibit machinery now — an artist config
   driving the SAME Exhibit.jsx as /hr and /wb (the HrSpine.jsx pattern,
   verbatim). The prior page was a lookalike, violating same-only-different;
   it is dead, and the walk-six-killed entry text block died with it
   (kill order executed — not preserved anywhere). Robots-specific surface
   (the twin artifact, the findings log) rides the exhibitFlow seam. */

export default function Robots() {
  return <Exhibit artist={robotsExhibit} />;
}
