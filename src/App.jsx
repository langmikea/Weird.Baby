import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import WbHome     from "./routes/WbHome.jsx";
import WbAdmin    from "./routes/WbAdmin.jsx";
import HrSpine    from "./routes/hr/HrSpine.jsx";
import HrHome     from "./routes/hr/HrHome.jsx";
import HrMedia    from "./routes/hr/HrMedia.jsx";
import HrArchive  from "./routes/hr/HrArchive.jsx";
import HrFanWall  from "./routes/hr/HrFanWall.jsx";
import WbSpine    from "./routes/wb/WbSpine.jsx";
import GiftShop   from "./routes/shop/GiftShop.jsx";

function KeyWatcher() {
  const navigate = useNavigate();
  const buf = useRef("");
  useEffect(() => {
    function onKey(e) {
      buf.current = (buf.current + e.key).slice(-3);
      if (buf.current === "mmm") navigate("/admin");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);
  return null;
}

// §0 preset sharing, §5 #5 landing (Mike 2026-06-07: Lobby-first, canon
// §L.1). A shared link weird.baby/p/<id> resolves the preset, parks the
// snapshot for the exhibit to pick up on arrival, and lands the visitor at
// the front door. Unknown/broken ids degrade to a plain Lobby visit.
function PresetLanding() {
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    let gone = false;
    (async () => {
      try {
        const r = await fetch(`/api/presets/${id}`);
        if (r.ok) {
          const { payload } = await r.json();
          sessionStorage.setItem("wb_pending_preset", JSON.stringify(payload));
        }
      } catch { /* degrade to plain Lobby */ }
      if (!gone) navigate("/", { replace: true });
    })();
    return () => { gone = true; };
  }, [id, navigate]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <KeyWatcher />
      <Routes>
        <Route path="/" element={<WbHome />} />
        <Route path="/admin" element={<WbAdmin />} />
        <Route path="/hr" element={<HrSpine />} />
        <Route path="/hr/home" element={<HrHome />} />
        <Route path="/hr/media" element={<HrMedia />} />
        <Route path="/hr/archive" element={<HrArchive />} />
        <Route path="/hr/fan-wall" element={<HrFanWall />} />
        <Route path="/wb" element={<WbSpine />} />
        <Route path="/shop" element={<GiftShop />} />
        <Route path="/p/:id" element={<PresetLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

