import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ALBUMS = [
  {
    title: "They Finally Cracked Me",
    year: 2018,
    color: "#9a6a3a",
    tracks: ["Cheap Wine","Straitlaced","So Sick","Identity","Hook Or The Worm","Television Head","Let The Rhythm","Silly Situation","Moving With The Storm","Soul Sucker","The Shade"],
  },
  {
    title: "Life Inside a Wheel",
    year: 2019,
    color: "#4a8a4a",
    tracks: ["Same Page","Talker With A Broken Jaw","People Are Programs","Killer To Killer","Brain Cell","Fix My Head","Free To Roam The Cage","With Great Pleasure","The Water","Music On My Mind","What I Felt","Greek Fire","Shapeshifter"],
  },
  {
    title: "Mimicking the Sun Like Dandelions",
    year: 2020,
    color: "#3a7a9a",
    tracks: ["Lampshade","Favorite Friend","Little Red Riding Hood","Homestead","Undertow","Family Tree","Tongue In Cheek","Norma Jean","Impossible Itch","Upper Hand","Wildfire"],
  },
  {
    title: "Skipping Stones That Sink Before They're Thrown",
    year: 2021,
    color: "#8a3a8a",
    tracks: ["Don't Blame The Breeze","Nothin' Wrong","Cusp Of The Mend","Cocoon","Patience In The Dark","Just For Kicks","Echo Calls Her Name","The Shade","Shake It Off Of Me","Run From The Devil"],
  },
  {
    title: "Arkansas",
    year: 2023,
    color: "#ba5a2a",
    tracks: ["Silver Lining","Quicksand Sinking","Town Rat Heathen","Reverend","Grain Of Rice","Can't Outshine The Truth","California Sober","Good On Paper","Few Steps Back","Run From The Devil","Silver Lining (Reprise)"],
  },
  {
    title: "Crooked Home",
    year: 2025,
    color: "#3a5aaa",
    tracks: ["'94","Low","String Up a Necklace","Hand in the Fire","Flash in the Pan","Friendly Fire","The Devil is the Culprit","If the Body is a Temple","The Keeper","Out of my Hands","Bad Sign","My Brother's Bones"],
  },
];

const SINGLES = ["Cookin' In The Bathroom", "Chase The Dragon", "A Pot Song"];

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
  singlesSection: {
    borderTop: "1px solid #1e1808",
    paddingTop: "1.5rem",
  },
  singlesLabel: {
    fontSize: "9px",
    letterSpacing: "0.2em",
    color: "#3a2e10",
    textTransform: "uppercase",
    marginBottom: "0.75rem",
  },
  singlesRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },
  singleChip: (hov) => ({
    fontSize: "11px",
    color: hov ? "#c8a050" : "#5a4820",
    border: `1px solid ${hov ? "#4a3818" : "#2a2010"}`,
    padding: "4px 10px",
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    background: "transparent",
    letterSpacing: "0.05em",
    transition: "color 0.1s, border-color 0.1s",
  }),
  lyricMapLink: {
    display: "inline-block",
    marginTop: "1.5rem",
    fontSize: "11px",
    color: "#5a4820",
    letterSpacing: "0.12em",
    cursor: "pointer",
    borderBottom: "1px solid #2a2010",
    paddingBottom: "1px",
    fontFamily: "Georgia, serif",
    background: "none",
    border: "none",
    borderBottom: "1px solid #2a2010",
    padding: "0 0 1px 0",
  },
};

export default function HrArchive() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);
  const [hovTrack, setHovTrack] = useState(null);
  const [hovSingle, setHovSingle] = useState(null);

  const toggle = (title) => setExpanded((v) => v === title ? null : title);

  const totalSongs = ALBUMS.reduce((a, b) => a + b.tracks.length, 0) + SINGLES.length;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <div style={s.eyebrow}>Hunter Root · Archive</div>
          <h1 style={s.title}>Discography</h1>
          <div style={s.subtitle}>
            {ALBUMS.length} albums · {totalSongs} songs · 2018 – 2025
          </div>
        </div>
        <button style={s.backBtn} onClick={() => navigate("/hr")}>
          ← homestead
        </button>
      </div>

      <div style={s.grid}>
        {ALBUMS.map((album) => {
          const open = expanded === album.title;
          return (
            <div
              key={album.title}
              style={s.card(album.color, open)}
              onClick={() => toggle(album.title)}
              onMouseEnter={(e) => { if (!open) e.currentTarget.style.borderColor = "#3a2e14"; }}
              onMouseLeave={(e) => { if (!open) e.currentTarget.style.borderColor = "#2a2010"; }}
            >
              <div style={s.cardHeader(album.color)}>
                <div>
                  <div style={s.cardTitle}>{album.title}</div>
                  <div style={s.cardYear}>{album.year}</div>
                </div>
                <div style={s.cardCount}>
                  {album.tracks.length} tracks {open ? "▴" : "▾"}
                </div>
              </div>

              {open && (
                <div style={s.tracklist} onClick={(e) => e.stopPropagation()}>
                  {album.tracks.map((track, i) => (
                    <div
                      key={track}
                      style={s.track(hovTrack === `${album.title}-${i}`)}
                      onMouseEnter={() => setHovTrack(`${album.title}-${i}`)}
                      onMouseLeave={() => setHovTrack(null)}
                    >
                      <span style={{ color: "#2a2010", marginRight: "8px", fontSize: "10px" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {track}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={s.singlesSection}>
        <div style={s.singlesLabel}>Singles</div>
        <div style={s.singlesRow}>
          {SINGLES.map((s2) => (
            <button
              key={s2}
              style={s.singleChip(hovSingle === s2)}
              onMouseEnter={() => setHovSingle(s2)}
              onMouseLeave={() => setHovSingle(null)}
              onClick={() => {}}
            >
              {s2}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <button
          style={s.lyricMapLink}
          onClick={() => navigate("/hr/workshop/lyric-map")}
        >
          → explore lyrics in the lyric map
        </button>
      </div>
    </div>
  );
}
