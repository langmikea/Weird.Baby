import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function WbAdmin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = useCallback(() => {
    setLoading(true);
    fetch("/api/admin")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
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
        html, body { background: #050505; color: #d0cbc3; font-family: 'Courier Prime', monospace; min-height: 100vh; }
        .adm { max-width: 1100px; margin: 0 auto; padding: 40px 32px; }
        .adm-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; border-bottom: 1px solid #1a1a1a; padding-bottom: 20px; }
        .adm-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem; letter-spacing: 0.15em; text-transform: uppercase; color: #b8974a; }
        .adm-sub { font-size: 0.65rem; letter-spacing: 0.12em; color: #333; text-transform: uppercase; margin-top: 4px; }
        .adm-refresh { background: transparent; border: 1px solid #222; color: #555; font-family: 'Courier Prime', monospace; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 6px 14px; cursor: pointer; transition: border-color 0.2s, color 0.2s; }
        .adm-refresh:hover { border-color: #b8974a; color: #b8974a; }
        .adm-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 40px; }
        .adm-stat { background: #0c0c0c; border: 1px solid #161616; padding: 20px 24px; }
        .adm-stat-val { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2.2rem; color: #b8974a; line-height: 1; }
        .adm-stat-label { font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: #444; margin-top: 6px; }
        .adm-section { margin-bottom: 36px; }
        .adm-section-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.62rem; letter-spacing: 0.25em; text-transform: uppercase; color: #b8974a; margin-bottom: 14px; display: flex; align-items: center; gap: 10px; }
        .adm-badge-new { background: #b8974a; color: #050505; font-size: 0.55rem; padding: 2px 6px; letter-spacing: 0.1em; }
        .adm-table { width: 100%; border-collapse: collapse; font-size: 0.78rem; }
        .adm-table th { text-align: left; font-size: 0.58rem; letter-spacing: 0.15em; text-transform: uppercase; color: #333; padding: 6px 12px 10px; border-bottom: 1px solid #141414; font-weight: 400; }
        .adm-table td { padding: 9px 12px; border-bottom: 1px solid #0f0f0f; color: #aaa; vertical-align: top; }
        .adm-table tr:hover td { background: #0d0d0d; }
        .adm-name { color: #e8e4dc; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.82rem; }
        .adm-note { font-style: italic; color: #555; font-size: 0.72rem; }
        .adm-founding { font-size: 0.58rem; color: #b8974a; border: 1px solid #2a2218; padding: 1px 5px; letter-spacing: 0.08em; }
        .adm-empty { color: #2a2a2a; font-style: italic; font-size: 0.8rem; padding: 16px 0; }
        .adm-back { background: transparent; border: none; color: #2a2a2a; font-family: 'Courier Prime', monospace; font-size: 0.62rem; letter-spacing: 0.1em; cursor: pointer; text-transform: uppercase; transition: color 0.2s; }
        .adm-back:hover { color: #b8974a; }
        .adm-loading { color: #333; font-style: italic; padding: 60px; text-align: center; }
      `}</style>

      <div className="adm">
        <div className="adm-header">
          <div>
            <div className="adm-title">Weird.Baby — Admin</div>
            <div className="adm-sub">Not for public consumption</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
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
              {data.guestbook?.length === 0
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
              {data.recentVisits?.length === 0
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
                  <span style={{ color: "#b8974a", fontFamily: "Syne, sans-serif", fontWeight: 600 }}>{p.count}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
