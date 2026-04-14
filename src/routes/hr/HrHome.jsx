import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HITBOXES = [
  {
    id: "museum-menu",
    label: "Museum Menu",
    action: "menu",
    path: null,
    top: "14%", left: "0%", width: "12%", height: "18%",
  },
  {
    id: "archives",
    label: "Archives",
    sub: "downstairs",
    path: "/hr/archive",
    top: "52%", left: "0%", width: "16%", height: "22%",
  },
  {
    id: "special-rotation",
    label: "Special on Rotation",
    path: "/hr/archive",
    top: "22%", left: "14%", width: "22%", height: "52%",
  },
  {
    id: "bulletin-board",
    label: "Bulletin Board",
    action: "bulletin",
    path: null,
    top: "52%", left: "37%", width: "22%", height: "32%",
  },
  {
    id: "posters-fan-art",
    label: "Posters / Fan Art",
    path: "/hr/fan-wall",
    top: "14%", left: "36%", width: "22%", height: "28%",
  },
  {
    id: "media-room",
    label: "Media Room",
    path: "/hr/media",
    top: "14%", left: "60%", width: "18%", height: "44%",
  },
  {
    id: "barn-door-lower",
    label: "Workshop",
    path: "/hr/workshop",
    top: "52%", left: "60%", width: "14%", height: "32%",
  },
  {
    id: "jukebox",
    label: "Jukebox",
    path: "/hr/media",
    top: "62%", left: "78%", width: "14%", height: "24%",
  },
];

const tt = {
  position: "absolute",
  bottom: "calc(100% + 6px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: "rgba(10,8,4,0.95)",
  border: "1px solid #4a3a18",
  color: "#c8a050",
  fontFamily: "Georgia, serif",
  fontSize: "11px",
  letterSpacing: "0.1em",
  padding: "4px 10px",
  whiteSpace: "nowrap",
  pointerEvents: "none",
  zIndex: 10,
};

function Hitbox({ box, hovered, onEnter, onLeave, onClick }) {
  return (
    <div
      onClick={() => onClick(box)}
      onMouseEnter={() => onEnter(box.id)}
      onMouseLeave={onLeave}
      style={{
        position: "absolute",
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        cursor: "pointer",
        background: hovered ? "rgba(200,160,80,0.07)" : "transparent",
        border: hovered ? "1px solid rgba(200,160,80,0.22)" : "1px solid transparent",
        transition: "background 0.12s, border-color 0.12s",
        boxSizing: "border-box",
      }}
    >
      {hovered && (
        <div style={tt}>
          {box.label}
          {box.sub && <span style={{ color: "#7a6030", marginLeft: 5 }}>({box.sub})</span>}
        </div>
      )}
    </div>
  );
}

export default function HrHome() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  React.useEffect(() => {
    const prev = {
      htmlOverflow: document.documentElement.style.overflow,
      bodyMargin: document.body.style.margin,
      bodyOverflow: document.body.style.overflow,
      bodyBg: document.body.style.background,
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.margin = "0";
    document.body.style.overflow = "hidden";
    document.body.style.background = "#0a0704";
    return () => {
      document.documentElement.style.overflow = prev.htmlOverflow;
      document.body.style.margin = prev.bodyMargin;
      document.body.style.overflow = prev.bodyOverflow;
      document.body.style.background = prev.bodyBg;
    };
  }, []);

  const handleClick = (box) => {
    if (box.action === "menu") { setMenuOpen((v) => !v); return; }
    if (box.action === "bulletin") return;
    if (box.path) navigate(box.path);
  };

  return (
    <div style={{
      position: "relative",
      width: "100vw",
      height: "100vh",
      background: "#0a0704",
      overflow: "hidden",
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
      }}>
        <img
          src="/museum.jpg"
          alt="Hunter Root Homestead great room"
          draggable={false}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center center",
            display: "block",
            userSelect: "none",
          }}
        />

        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
        {HITBOXES.map((box) => (
          <Hitbox
            key={box.id}
            box={box}
            hovered={hovered === box.id}
            onEnter={setHovered}
            onLeave={() => setHovered(null)}
            onClick={handleClick}
          />
        ))}

        </div>

        {menuOpen && (
          <div style={{
            position: "absolute",
            top: "14%",
            left: "13%",
            background: "rgba(10,8,4,0.97)",
            border: "1px solid #4a3a18",
            padding: "1rem 1.5rem",
            zIndex: 20,
            minWidth: "160px",
          }}>
            <div style={{ color: "#7a6028", fontFamily: "Georgia,serif", fontSize: "9px", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>MUSEUM MENU</div>
            {[
              { label: "Workshop", path: "/hr/workshop" },
              { label: "Archive", path: "/hr/archive" },
              { label: "Fan Wall", path: "/hr/fan-wall" },
              { label: "Media Room", path: "/hr/media" },
              { label: "Gift Shop", path: "/hr/merch" },
            ].map((item) => (
              <div
                key={item.path}
                onClick={() => { setMenuOpen(false); navigate(item.path); }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#e8c070"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#c8a050"}
                style={{ color: "#c8a050", fontFamily: "Georgia,serif", fontSize: "13px", padding: "5px 0", cursor: "pointer", borderBottom: "1px solid #1e1608" }}
              >
                {item.label}
              </div>
            ))}
            <div
              onClick={() => setMenuOpen(false)}
              style={{ color: "#3a2e10", fontFamily: "Georgia,serif", fontSize: "10px", marginTop: "0.5rem", cursor: "pointer" }}
            >
              close
            </div>
          </div>
        )}

        <div style={{
          position: "absolute",
          bottom: "1.5%",
          right: "1.5%",
          color: "#2a2010",
          fontFamily: "Georgia,serif",
          fontSize: "9px",
          letterSpacing: "0.15em",
          pointerEvents: "none",
        }}>
          HUNTER ROOT · HOMESTEAD
        </div>
      </div>
    </div>
  );
}

