import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function WbAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* [L3 lap 2026-08-02] FOUND WHILE VERIFYING THE PALETTE: THE ERROR STATE WAS
     UNREACHABLE AND THE PAGE WHITE-SCREENED INSTEAD.
     `fetch(...).then(r => r.json())` resolves happily on a 500 — the worker
     answers `{"error":"D1_ERROR: no such table: guestbook"}` with a JSON body,
     so `r.json()` succeeds, `.catch` never fires, and `data` becomes an object
     with no `guestbook`. Downstream, `data.guestbook?.length === 0` is FALSE for
     `undefined` (the optional chain returns undefined, and undefined !== 0), so
     the render took the TABLE branch and called `.map` on nothing. React
     unmounted the tree: a blank page, no message, on the one route whose whole
     job is to tell the operator what is going on.
     Reproduced exactly that way on the dev server, where the D1 table does not
     exist. The same 500 in production produces the same blank page.
     Two fixes, both one line: honour the status, and let the error the server
     already sent be the error the operator reads. */
  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/admin")
      .then(r => r.json().then(d => {
        if (!r.ok || d?.error) throw new Error(d?.error || `HTTP ${r.status}`);
        return d;
      }))
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setData(null); setError(e.message); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

  function formatDate(iso) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;800&family=Courier+Prime:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        /* [L3 / J1 2026-08-02] THE OPERATOR'S ROOM, AND EXACTLY HOW FAR THIS
           ROUND GOES IN IT.
           B7/R1 measured 38 hard-coded colours here and ZERO matches against any
           token — the only surface in the museum still fully on the pre-2026
           dark scheme (#050505 ground, #b8974a accent, #2a2218 rules). J4 asked
           whether the operator's room joins the museum; that is Mike's call and
           it is NOT taken here. Ops does not invent palette, so the 27 greys
           below stay exactly as they are and are LISTED in the round log with
           what each one is and what it should probably become.
           WHAT IS TAKEN IS J1, WHICH MIKE RULED: the retired 2025 gold goes,
           and it went in eleven places on this page. It becomes the accent of
           THE MUSEUM'S OWN DARK SCOPE — the projection booth, --wb-booth-*,
           which this round moved out of the player bar's one selector and into
           the token file precisely so a second dark room could join it instead
           of copying it. Nothing here is invented: the room adopts a scope that
           already existed and now has a name.
           (NO BACKTICKS IN THIS COMMENT. The whole stylesheet is a template
           literal, so one backtick in prose ends it and the build fails at
           parse. It just did, writing this. That is R5's argument in one line:
           a stylesheet that can be broken by punctuation belongs in a .css
           file.) */
        .adm { --wb-gold: var(--wb-booth-gold); --wb-gold-hi: var(--wb-booth-gold-hi); --wb-gold-lo: var(--wb-booth-gold-lo); }
        html, body { background: #050505; color: #d0cbc3; font-family: 'Courier Prime', monospace; min-height: 100vh; }
        .adm { max-width: 1100px; margin: 0 auto; padding: 40px 32px; }
        .adm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; }
        .adm-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--wb-gold); }
        .adm-sub { font-size: 0.65rem; letter-spacing: 0.12em; color: #333; text-transform: uppercase; margin-top: 4px; } .adm-build { font-size: 0.6rem; letter-spacing: 0.1em; color: #555; font-family: 'Courier Prime', monospace; margin-top: 6px; }
        .adm-refresh { background: transparent; border: 1px solid #222; color: #555; font-family: 'Courier Prime', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .adm-refresh:hover { border-color: var(--wb-gold); color: var(--wb-gold); }
        .adm-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 40px; }
        .adm-stat { background: #0c0c0c; border: 1px solid #161616; padding: 20px 24px; }
        .adm-stat-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2.2rem; color: var(--wb-gold); line-height: 1; }
        .adm-stat-label { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: #444; margin-top: 6px; }
        .adm-section { margin-bottom: 36px; }
        .adm-section-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: var(--wb-gold); margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .adm-badge-new { background: var(--wb-gold); color: #050505; font-size: 0.55rem; padding: 2px 6px; letter-spacing: 0.1em; }
        .adm-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
        .adm-table th { text-align: left; font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase; color: #333; padding: 6px 12px 10px; border-bottom: 1px solid #141414; font-weight: 400; }
        .adm-table td { padding: 9px 12px; border-bottom: 1px solid #0f0f0f; color: #aaa; vertical-align: top; }
        .adm-table tr:hover td { background: #0d0d0d; }
        .adm-name { color: #e8e4dc; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.82rem; }
        .adm-note { font-style: italic; color: #555; font-size: 0.72rem; }
        .adm-founding { font-size: 0.58rem; color: var(--wb-gold); border: 1px solid #2a2218; padding: 1px 5px; letter-spacing: 0.08em; }
        .adm-empty { color: #2a2a2a; font-style: italic; font-size: 0.8rem; padding: 16px 0; }
        .adm-back { background: transparent; border: none; color: #2a2a2a; font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.1em; cursor: pointer; text-transform: uppercase; transition: color 0.2s; } .adm-jump { background: transparent; border: 1px solid #222; color: #555; font-family: 'Courier Prime', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; cursor: pointer; transition: border-color 0.2s, color 0.2s; text-decoration: none; display: inline-block; } .adm-jump:hover { border-color: var(--wb-gold); color: var(--wb-gold); }
        .adm-back:hover { color: var(--wb-gold); }
        .adm-loading { color: #333; font-style: italic; padding: 60px; text-align: center; }
      `}</style>

      <div className="adm">
        <div className="adm-header">
          <div>
            <div className="adm-title">Weird.Baby — Admin</div>
            <div className="adm-sub">Not for public consumption</div>
            <div className="adm-build">built {new Date(__BUILD_TIME__).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button className="adm-jump" onClick={() => navigate("/hr")}>/hr</button>
            <button className="adm-jump" onClick={() => navigate("/cb")}>/cb</button>
            <button className="adm-jump" onClick={() => navigate("/shop")}>/shop</button>
            <button className="adm-refresh" onClick={load}>↺ Refresh</button>
            <button className="adm-back" onClick={() => navigate("/")}>← Back</button>
          </div>
        </div>

        {loading && <div className="adm-loading">Loading...</div>}
        {error && <div className="adm-loading">Error: {error}</div>}

        {data && (
          <>
            <div className="adm-grid">
              <div className="adm-stat">
                <div className="adm-stat-val">{data.totalVisits ?? 0}</div>
                <div className="adm-stat-label">Total Visits</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-val">{data.guestbook?.length ?? 0}</div>
                <div className="adm-stat-label">Guest Book Entries</div>
              </div>
              <div className="adm-stat">
                <div className="adm-stat-val">{data.pageBreakdown?.length ?? 0}</div>
                <div className="adm-stat-label">Pages Tracked</div>
              </div>
            </div>

            <div className="adm-section">
              <div className="adm-section-title">
                Guest Book
                {data.guestbook?.length > 0 && <span className="adm-badge-new">{data.guestbook.length} entries</span>}
              </div>
              {/* [L3 lap] `?.length === 0` is FALSE for a missing array, so a
                  payload without `guestbook` fell through to `.map` and crashed
                  the route. `!length` covers absent, empty and zero alike — the
                  sibling sections already read this way. */}
              {!data.guestbook?.length
                ? <div className="adm-empty">No entries yet.</div>
                : (
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Note</th>
                        <th>Badge</th>
                        <th>Signed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.guestbook.map((e, i) => (
                        <tr key={i}>
                          <td className="adm-name">{e.name}</td>
                          <td className="adm-note">{e.note || "—"}</td>
                          <td><span className="adm-founding">{e.badge}</span></td>
                          <td>{formatDate(e.signed_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>

            <div className="adm-section">
              <div className="adm-section-title">Recent Visits</div>
              {!data.recentVisits?.length
                ? <div className="adm-empty">No visits recorded yet.</div>
                : (
                  <table className="adm-table">
                    <thead>
                      <tr><th>Page</th><th>Referrer</th><th>Time</th></tr>
                    </thead>
                    <tbody>
                      {data.recentVisits?.map((v, i) => (
                        <tr key={i}>
                          <td style={{ color: "#d0cbc3" }}>{v.page}</td>
                          <td className="adm-note">{v.referrer || "—"}</td>
                          <td>{formatDate(v.visited_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>

            <div className="adm-section">
              <div className="adm-section-title">Page Breakdown</div>
              {data.pageBreakdown?.map((p, i) => (
                <div key={i} style={{ display: "flex", gap: 16, padding: "6px 0", borderBottom: "1px solid #0f0f0f", fontSize: "0.78rem" }}>
                  <span style={{ color: "#d0cbc3", minWidth: 160 }}>{p.page}</span>
                  <span style={{ color: "var(--wb-gold)", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>{p.count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
