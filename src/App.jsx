import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import WbHome     from "./routes/WbHome.jsx";
import WbAdmin    from "./routes/WbAdmin.jsx";
import HrSpine    from "./routes/hr/HrSpine.jsx";
import HrHome     from "./routes/hr/HrHome.jsx";
import HrMedia    from "./routes/hr/HrMedia.jsx";
import HrArchive  from "./routes/hr/HrArchive.jsx";
import HrFanWall  from "./routes/hr/HrFanWall.jsx";
import WbSpine    from "./routes/wb/WbSpine.jsx";
import InfoBooth  from "./routes/InfoBooth.jsx";
import Foundation from "./routes/Foundation.jsx";
import GiftShop   from "./routes/shop/GiftShop.jsx";
import Robots     from "./routes/robots/Robots.jsx";
import Wal        from "./routes/wal/Wal.jsx";

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
        <Route path="/booth" element={<InfoBooth />} />
        {/* [F3 2026-08-03] Mike's new directory section. [C2] renamed it to
            `/money`; [R1 2026-08-03] MIKE REVERTED THAT — C2 read "keep me out
            of the space where I need legal today" as an instruction to rename
            the room, and it was an instruction not to take on legal WORK. The
            room is the Foundation again, at the address it was built at. */}
        <Route path="/foundation" element={<Foundation />} />
        {/* [C2 2026-08-03 → R1 2026-08-03] THE REDIRECT SURVIVES THE REVERT AND
            RUNS THE OTHER WAY. This line pointed `/foundation` at `/money` and
            now points `/money` at `/foundation`, because BOTH names have been
            real URLs on weird.baby and a live URL is owed the same courtesy in
            whichever direction the room happens to be moving.
            C2's own note is worth keeping in one sentence, since it is the only
            reason this mechanism exists at all: it was very nearly not written,
            on the reasoning that the retired path had lived in a single unpushed
            commit — and probing the live site instead of trusting that reasoning
            is what caught Mike having pushed AND deployed mid-round. The same
            check applies now and gives the same answer: v41 is pushed, so
            `/money` is real and is not allowed to become a dead link.
            IT BREAKS IN THE WORST AVAILABLE WAY IF THIS LINE GOES. There is no
            catch-all route in this table, so an unmatched path renders the shell
            and nothing in it — a blank page, not even a 404. `replace`, so the
            retired name does not sit in the visitor's back button.
            One retired word survives on purpose. It is just a different one. */}
        <Route path="/money" element={<Navigate to="/foundation" replace />} />
        <Route path="/shop" element={<GiftShop />} />
        <Route path="/robots" element={<Robots />} />
        <Route path="/wal" element={<Wal />} />
        <Route path="/p/:id" element={<PresetLanding />} />
      </Routes>
    </BrowserRouter>
  );
}

