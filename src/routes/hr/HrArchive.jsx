import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArrival } from "../../lib/use-arrival.js";
/* ═══ [D3c 2026-08-06] THE HAND-TYPED CATALOGUE IS DELETED ═══════════════════
   MIKE: "Hunter Root's text is still incorrect — find every surface carrying his
   figures, verify each against the vault, and fix them all in one pass rather
   than the one that was reported."

   THIS WAS THE SURFACE NOBODY HAD LOOKED AT. Where the six sites W1 corrected
   were carrying stale FIGURES, this page was carrying a stale CATALOGUE: a
   hand-typed ALBUMS array of six records where the vault holds nine, missing Run
   With The Hunt and the Phone Recordings EP entirely, filing four SINGLES &
   RARITIES tracks under three other records, naming two They Finally Cracked Me
   tracks that are not on it, and heading the page "6 albums · 71 songs · 2018 –
   2025". Every figure on the page was a count of the mirror.

   IT IS NOT CORRECTED. A corrected mirror is a mirror that will drift again —
   this one drifted through six museum-wide figure sweeps without anybody
   noticing, because nothing links a copy to its source. The array is gone and
   the page reads the spine: MediaVault -> the export -> buildSpineFromArtifacts
   -> here. Full account of what the mirror printed: the header of
   src/data/artists/hunter-root-catalogue.js. */
import { HR_SPINE, HR_KIND, HR_RECORDS, HR_EXTRAS, HR_TRACKS }
  from "../../data/artists/hunter-root-catalogue.js";

/* THE CARD ACCENTS ARE DECORATION AND ARE DECLARED AS SUCH, keyed on the
   album's stable id rather than on its title — a title is content and can be
   re-read off the vault; an id is ours. Six of these are the colours this page
   has always used, carried across unchanged. THREE ARE NEW, for the three
   containers the page never showed: they are spaced into the gaps in the six
   existing hues (yellow-olive, teal, violet) and they are a design choice about
   a border, not a claim about a record — the same footing the WAL poster's
   `hue` is declared on. An album with no entry gets the neutral rule. */
const ACCENT = {
  rwth:       "#8a8a3a",
  phone:      "#3a8a7a",
  cracked:    "#9a6a3a",
  wheel:      "#4a8a4a",
  dandelions: "#3a7a9a",
  skipping:   "#8a3a8a",
  arkansas:   "#ba5a2a",
  crooked:    "#3a5aaa",
  rarities:   "#6a4aaa",
};
const NEUTRAL = "#5a4820";

const s = {
  page: {
    minHeight: "100vh",
    background: "#0e0b06",
    padding: "2rem 1.5rem 3rem",
    fontFamily: "Georgia, serif",
  },
  header: {
    borderBottom: "1px solid #2a2010",
    paddingBottom: "1rem",
    marginBottom: "2rem",
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  backBtn: {
    background: "transparent",
    border: "none",
    color: "#4a3818",
    fontFamily: "Georgia, serif",
    fontSize: "11px",
    letterSpacing: "0.15em",
    cursor: "pointer",
    padding: 0,
  },
  eyebrow: {
    fontSize: "10px",
    letterSpacing: "0.2em",
    color: "#5a4820",
    textTransform: "uppercase",
    marginBottom: "4px",
  },
  title: {
    fontSize: "22px",
    color: "#c8a050",
    fontWeight: "normal",
    margin: "0 0 2px",
  },
  subtitle: {
    fontSize: "11px",
    color: "#3a2e10",
    letterSpacing: "0.12em",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1.25rem",
    marginBottom: "2rem",
  },
  card: (color, expanded) => ({
    background: "#131008",
    border: `1px solid ${expanded ? color : "#2a2010"}`,
    cursor: "pointer",
    transition: "border-color 0.15s",
  }),
  cardHeader: (color) => ({
    borderLeft: `3px solid ${color}`,
    padding: "0.85rem 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "0.5rem",
  }),
  cardTitle: {
    fontSize: "13px",
    color: "#c8a050",
    fontWeight: "normal",
    margin: "0 0 3px",
    lineHeight: 1.3,
  },
  cardYear: {
    fontSize: "10px",
    letterSpacing: "0.15em",
    color: "#5a4820",
  },
  cardCount: {
    fontSize: "10px",
    color: "#3a2e10",
    letterSpacing: "0.08em",
    whiteSpace: "nowrap",
    flexShrink: 0,
  },
  tracklist: {
    borderTop: "1px solid #1e1808",
    padding: "0.75rem 1rem",
  },
  track: (hov) => ({
    fontSize: "12px",
    color: hov ? "#c8a050" : "#6a5428",
    padding: "3px 0",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "color 0.1s",
  }),
  /* [D3c 2026-08-06] `singlesSection`, `singlesLabel`, `singlesRow` and
     `singleChip` are DELETED with the strip they styled — see the note where
     the strip used to render. `lyricMapLink` went at CS 2026-08-04 with the
     link it styled. */
};

export default function HrArchive() {
  /* [P5 2026-08-05] "This applies to ALL pages." It did not apply to this one:
     the archive was one of two routes in the building that never called
     `useArrival`, so a visitor returning to it landed wherever the browser had
     remembered. Its own room key, not the exhibit's — /hr and /hr/archive are
     two rooms a visitor arrives at separately. */
  useArrival("hr-archive");
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [hovTrack, setHovTrack] = useState(null);

  const toggle = (id) => setExpanded((v) => v === id ? null : id);

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}>Hunter Root · Archive</div>
          <h1 style={s.title}>Discography</h1>
          {/* [D3c] EVERY FIGURE ON THIS LINE IS COUNTED OFF THE SPINE. It used
              to read "6 albums · 71 songs · 2018 – 2025" and all three were
              counts of the hand-typed mirror.
              "ALBUMS" IS GONE AS THE NOUN, because nine containers are not nine
              albums — seven are records, one is an EP and one is a set, which is
              the correction M50 made everywhere else and which this page had
              never had applied to it.
              "SONGS" IS GONE TOO, and for the reason W1's own fix missed:
              ninety-three is a count of TRACK ROWS. Two songs sit on two records
              each, so the vault holds 93 tracks and 91 distinct titles, and a
              line that says "songs" and prints 93 is the unit swap this museum
              has now made twice.
              AND THE YEAR RANGE IS STRUCK RATHER THAN CORRECTED. It was wrong at
              both ends — the EP is 2017 — but the reason it goes is that TWO of
              the nine containers carry no year at all, so any flat span is a
              claim about holdings the museum cannot date. Each card prints its
              own year, and the two undated ones print an em dash, which is what
              the WAL records board already does for Chase The Dragon. */}
          <div style={s.subtitle}>
            {HR_RECORDS} records, plus {HR_EXTRAS.join(" and ")} · {HR_TRACKS} tracks on file
          </div>
        </div>
        <button style={s.backBtn} onClick={() => navigate("/hr")}>
          ← homestead
        </button>
      </div>

      <div style={s.grid}>
        {HR_SPINE.map((album) => {
          const open = expanded === album.id;
          const color = ACCENT[album.id] || NEUTRAL;
          return (
            <div
              key={album.id}
              style={s.card(color, open)}
              onClick={() => toggle(album.id)}
              onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = "#3a2e14"; }}
              onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = "#2a2010"; }}
            >
              <div style={s.cardHeader(color)}>
                <div>
                  <div style={s.cardTitle}>{album.title}</div>
                  {/* [D3c] two of the nine containers carry no year in the
                      vault, and the mirror simply did not list them. An em dash
                      says the museum does not hold the date; a year invented to
                      fill the slot would say it does. */}
                  <div style={s.cardYear}>{album.year ?? "—"}</div>
                </div>
                <div style={s.cardCount}>
                  {album.tracks.length} tracks {open ? "▴" : "▾"}
                </div>
              </div>

              {open && (
                <div style={s.tracklist} onClick={(e) => e.stopPropagation()}>
                  {album.tracks.map((track, i) => (
                    <div
                      key={track.id}
                      style={s.track(hovTrack === `${album.id}-${i}`)}
                      onMouseEnter={() => setHovTrack(`${album.id}-${i}`)}
                      onMouseLeave={() => setHovTrack(null)}
                    >
                      <span style={{ color: "#2a2010", marginRight: "8px", fontSize: "10px" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {track.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ═══ [D3c 2026-08-06] THE "SINGLES" STRIP IS DELETED ═══════════════
          It was a hand-typed list of ONE title — Chase The Dragon — standing in
          for the vault's SINGLES & RARITIES container, which holds seven:
          Shapeshifter, Sleight of Hand, Chase The Dragon, Cookin' in the
          Bathroom, Wildfire, A Pot Song, Weathervane. Four of those seven were
          also being printed on the wrong records above it.
          That container is now a card in the grid like every other, so the strip
          was a second, worse copy of a thing already on the page — struck under
          THE LAW OF SUBTRACTION, and nothing is lost: every title it held is
          above, under the record the vault files it on.
          `s.singlesSection`, `s.singlesLabel`, `s.singlesRow` and
          `s.singleChip` went with it; they had no other caller.
          [CS 2026-08-04, kept] "→ explore lyrics in the lyric map" was removed
          before this — it navigated to /hr/workshop/lyric-map, which has never
          been a route in this application. */}
    </div>
  );
}
