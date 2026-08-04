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
        {/* ==== [E2 2026-08-03] THE CATCH-ALL. MIKE'S RULING ================
            "Any unmatched path renders THE LOBBY — no dead end, no blank
            shell, no apology."
            THIS GAP HAS BEEN CARRIED IN THREE ROUND LOGS AND IT FAILED IN THE
            WORST AVAILABLE WAY: with no `path="*"` in this table, React Router
            matched nothing and rendered the shell with nothing in it. Not a
            404 — a BLANK PAGE. `wrangler.jsonc` sets
            `not_found_handling: "single-page-application"`, so Cloudflare
            hands every unknown path to index.html and the router was the last
            thing standing between a typo and an empty screen.
            IT RENDERS RATHER THAN REDIRECTS, and that is the ruling read
            literally. `<Navigate to="/">` would have been the reflex, and it
            does two things Mike did not ask for: it rewrites the address bar,
            so a visitor who mistyped is quietly told they were wrong, and it
            puts a redirect in the history of a URL that was never real. The
            Lobby is location-independent (it reads no params and keys
            `useRoom`/`useArrival` on the literal string "lobby"), so it can be
            served AT the wrong address and every door on it still works.
            NO APOLOGY IS PART OF THE SPEC. There is deliberately no "page not
            found" banner, no 404 register, no "did you mean" — a visitor who
            lands here sees the front door of the museum and nothing telling
            them they made a mistake.
            IT MUST STAY LAST. React Router v6 ranks by specificity rather than
            by order, so this is belt-and-braces — but the two redirects above
            (`/money`) depend on being matched by their own routes, and a
            reader scanning this table should see the fallback at the bottom
            where a fallback belongs. */}
        <Route path="*" element={<WbHome />} />
      </Routes>
    </BrowserRouter>
  );
}

