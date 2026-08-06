import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import WbHome     from "./routes/WbHome.jsx";
import WbAdmin    from "./routes/WbAdmin.jsx";
import HrSpine    from "./routes/hr/HrSpine.jsx";
import HrArchive  from "./routes/hr/HrArchive.jsx";
import WbSpine    from "./routes/wb/WbSpine.jsx";
import InfoBooth  from "./routes/InfoBooth.jsx";
/* [D7 2026-08-06] M62: the Foundation is a WING now, not a sheet page. */
import FoundationSpine from "./routes/foundation/FoundationSpine.jsx";
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
        {/* [CS 2026-08-04] `/hr/media` AND `/hr/fan-wall` ARE REMOVED, with
            their components deleted. Each was a one-line file rendering
            "Media — coming soon." and "Fan Wall — coming soon." on a live
            address. The house's own NO-COMING-SOON credo (robots.js, Mike
            2026-07-29) killed exactly this pattern on the robots carousel;
            these two survived it because nothing on the lobby board points at
            /hr and nobody walked past them.
            THEY DO NOT NEED A REPLACEMENT PAGE. E2's catch-all renders the
            Lobby at any unmatched address — "no dead end, no blank shell, no
            apology" — so both URLs now land a visitor somewhere real.

            AND `/hr/home` GOES WITH THEM, which was not on the list until the
            glass showed why. The room was a stock interior photograph
            (`public/museum.jpg`, 1024×680) with its labels PAINTED INTO THE
            IMAGE in marker — MUSEUM MENU, SPECIAL ON ROTATION, POSTERS / FAN
            ART, MEDIA ROOM, ARCHIVES (downstairs), EXIT, BULLITEN (sic), HR.
            The page's own DOM text was three words, "HUNTER ROOT · HOMESTEAD";
            everything else a visitor read there was annotation baked into a
            design mockup. It advertised five rooms of which four have never
            existed in this application, and misspelled one of them. That is
            not a room with placeholder content in it — it is a WIREFRAME, live
            at a public address.
            The component and the asset are both deleted. Nothing in the tree
            linked here (checked): /hr is the real exhibit and is untouched,
            and /hr/archive's own way back already points at /hr. */}
        <Route path="/hr/archive" element={<HrArchive />} />
        <Route path="/wb" element={<WbSpine />} />
        <Route path="/booth" element={<InfoBooth />} />
        {/* [F3 2026-08-03] Mike's new directory section. [C2] renamed it to
            `/money`; [R1 2026-08-03] MIKE REVERTED THAT — C2 read "keep me out
            of the space where I need legal today" as an instruction to rename
            the room, and it was an instruction not to take on legal WORK. The
            room is the Foundation again, at the address it was built at. */}
        {/* [D7 2026-08-06] AND M62 IS BUILT: the room is an exhibit wing with
            three albums (Ledger, FAQ, Contribute) and a tracklist. THE
            ADDRESS DOES NOT MOVE — it is the same URL, the same room and the
            same words; what changed is the container, so nothing that has
            ever been shared or linked breaks. The `/money` redirect below is
            untouched and still correct for the same reason. */}
        <Route path="/foundation" element={<FoundationSpine />} />
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
        {/* [R1 2026-08-05] THE RECORD GETS AN ADDRESS, because it got a line on
            the lobby directory. MIKE: the Record applies to ALL things robots,
            not just the VIIIp — so it moved off the MGK-VIIIp album onto the
            wing's own front desk, and a directory entry indented under
            Weird.Baby Robots points here.
            IT IS THE SAME COMPONENT AND THE SAME WING. `open` names a TRACK
            (Exhibit.jsx), so this is the robots exhibit landing with the Record
            selected rather than a second page holding a copy of it. A directory
            line that dropped a visitor on /robots and left them to find the
            Record would be a control that does not do what its label says. */}
        <Route path="/robots/record" element={<Robots open="record" />} />
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

