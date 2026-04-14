import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import WbHome     from "./routes/WbHome.jsx";
import WbAdmin    from "./routes/WbAdmin.jsx";
import HrSpine    from "./routes/hr/HrSpine.jsx";
import HrHome     from "./routes/hr/HrHome.jsx";
import HrMedia    from "./routes/hr/HrMedia.jsx";
import HrArchive  from "./routes/hr/HrArchive.jsx";
import HrFanWall  from "./routes/hr/HrFanWall.jsx";
import HrWorkshop from "./routes/hr/HrWorkshop.jsx";
import HrMerch    from "./routes/hr/HrMerch.jsx";
import LyricMap   from "./routes/hr/workshop/LyricMap.jsx";
import CbSpine    from "./routes/cb/CbSpine.jsx";
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
        <Route path="/hr/workshop" element={<HrWorkshop />} />
        <Route path="/hr/workshop/lyric-map" element={<LyricMap />} />
        <Route path="/hr/merch" element={<HrMerch />} />
        <Route path="/cb" element={<CbSpine />} />
        <Route path="/shop" element={<GiftShop />} />
      </Routes>
    </BrowserRouter>
  );
}

