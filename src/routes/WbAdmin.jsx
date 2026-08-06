import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./WbAdmin.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";

export default function WbAdmin() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("admin");
  /* [P5 2026-08-05] the second of the two routes that never called it. Mike's
     ruling says ALL pages and does not carve out the ones only he sees. */
  useArrival("admin");
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

      <div className="adm">
        <div className="adm-header">
          <div>
            <div className="adm-title">Weird.Baby — Admin</div>
            <div className="adm-sub">Not for public consumption</div>
            <div className="adm-build">built {new Date(__BUILD_TIME__).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
          </div>
          {/* [P5/C35 2026-08-05] the inline flex is a class now, and the class
              wraps. At 390px this row laid out to x=633 inside a document that
              does not scroll sideways, so /shop, Refresh and Back were CLIPPED
              OFF THE EDGE AND UNREACHABLE — two of the five controls were the
              whole dashboard on a phone. */}
          <div className="adm-controls">
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
