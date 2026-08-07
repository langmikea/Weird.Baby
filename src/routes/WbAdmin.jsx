import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./WbAdmin.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";
import { markHeldOpen } from "../lib/held.js";

/* ═══ [H1 2026-08-06] THE HELD WING'S DOOR ══════════════════════════════════
   MIKE'S RULING: `/hr` is not public. It stays online and reachable by him and
   by Ops, behind a password entered HERE — "the admin page, where there is room
   to explain what /hr is without revealing anything to ordinary visitors."

   THE EXPLANATION IS THE HALF THAT IS EASY TO SKIP. A password box with no
   words beside it is a lock nobody can account for six months from now, and
   this room is the only surface in the museum where the account can be written
   at all: every other page is read by visitors.

   THE FORM IS NOT THE LOCK. `src/worker.js` is. This posts the key, the worker
   mints an HttpOnly cookie, and only that cookie gets the wing's chunks out of
   the asset store. Failure states are reported as the worker words them —
   including "no key is set on this deployment", which is a different fact from
   a wrong password and must never be collapsed into one. */
function HeldDoor() {
  const navigate = useNavigate();
  const [state, setState] = useState({ open: false, configured: true, note: null, checked: false, stage: null });
  const [key, setKey] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let gone = false;
    fetch("/api/held")
      .then(r => r.json())
      .then(d => {
        if (gone) return;
        setState({ open: !!d.open, configured: !!d.configured, note: d.note || null, checked: true, stage: d.stage || null });
        markHeldOpen(!!d.open);
      })
      .catch(() => { if (!gone) setState(s => ({ ...s, checked: true })); });
    return () => { gone = true; };
  }, []);

  function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    fetch("/api/held", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    })
      .then(r => r.json().then(d => ({ ok: r.ok, d })))
      .then(({ ok, d }) => {
        setBusy(false);
        /* the worker words every refusal, including the difference between a
           wrong key and no key set on the deployment; this only covers a
           response that carried no error at all. */
        if (!ok) { markHeldOpen(false); setMsg(d?.error || "Could not open"); return; }
        markHeldOpen(true);
        setKey("");
        setState(s => ({ ...s, open: true }));
      })
      .catch(err => { setBusy(false); setMsg(err.message); });
  }

  function close() {
    markHeldOpen(false);
    setState(s => ({ ...s, open: false }));
  }

  return (
    <div className="adm-section adm-held">
      <div className="adm-section-title">The held rooms</div>
      {/* NO COUNT IS TYPED HERE, DELIBERATELY. "nine containers, ninety-three
          track rows" was in the first draft of this paragraph and came out: a
          figure typed onto a page is the defect W1 and D3c both paid for, and
          this page has no reason to carry one. */}
      <p className="adm-held-note">
        The wing at <code>/hr</code> is the museum&rsquo;s Hunter Root exhibit &mdash; his
        catalogue, the artifact deck and the filter columns. It is complete, and it is kept
        online because it is the reference copy Ops works from.
      </p>
      <p className="adm-held-note">
        It is not open to the public. The museum does not have his permission to show his material,
        and until it does the wing is held rather than published — the same rule that stopped the
        site serving his audio. The address renders the Lobby to anybody who has not opened this
        door, and the exhibit&rsquo;s files are refused at the server, not merely hidden in the page.
      </p>
      {/* ═══ [H1 2026-08-06] THE DOOR OPENS TWO ROOMS NOW, AND THE SECOND ONE HAS
          NO ADDRESS OF ITS OWN — which is why it needs a sentence here rather
          than a button. Mike held the Portal from launch on the same posture as
          the wing: online for him and for Ops, reached through this page. But
          the Portal is an ALBUM inside a public wing, so opening this door does
          not take you anywhere; it makes `/robots` a deck of four instead of
          three. Without this paragraph the only way to know that is to notice
          an album appear.

          ═══ [V1 2026-08-06] AND THE DOORS ARE TWO DOORS NOW, WHICH IS WHY THIS
          PARAGRAPH IS CONDITIONAL AND THE ONE ABOVE IT IS NOT. `/hr` is held
          for a PERMISSION reason and the password is the only key to it in
          every stage. The Portal and the machines' photographs are held until
          LAUNCH, and during development they are simply on the glass. Printing
          the launch sentence in the development state would be this page
          telling the operator his own building is doing something it is not —
          which is the class of defect the reveal ledger exists to end. */}
      {state.stage === "launch" ? (
        <p className="adm-held-note">
          The Portal is held on the same terms and has no address of its own: it is the second
          album on <code>/robots</code>, and it is simply not in the deck until this door is open.
          Its cover, its poster and the twin itself are refused at the server like the wing&rsquo;s.
        </p>
      ) : (
        <p className="adm-held-note">
          The Portal and the machines&rsquo; photographs are held until the museum opens, not held
          from you: while the building is being made they are on the glass for everybody, and the
          record of what has been delivered is kept and enforced all the same. This door is not
          what is showing them.
        </p>
      )}
      {/* THE STAGE, REPORTED BY THE THING THAT ENFORCES IT — `/api/held` reads
          the same literal the worker's own refusal reads, so this cannot say one
          thing while the server does another. It is here and on no public
          surface: what stage a museum is at is a fact about the WORK
          (Doctrine 11), and this is the one room in the building written for
          the person doing it. */}
      {state.checked && state.stage && (
        <p className="adm-held-stage">
          <span className="adm-held-stage-k">Showing</span>
          <span className="adm-held-stage-v">
            {state.stage === "launch" ? "The launch state" : "Everything placed"}
          </span>
        </p>
      )}
      {state.open ? (
        <div className="adm-held-row">
          <button className="adm-jump" onClick={() => navigate("/hr")}>/hr</button>
          <button className="adm-jump" onClick={() => navigate("/hr/archive")}>/hr/archive</button>
          <button className="adm-jump" onClick={() => navigate("/robots")}>/robots</button>
          <button className="adm-held-close" onClick={close}>Close for this tab</button>
        </div>
      ) : (
        <form className="adm-held-row" onSubmit={submit}>
          <input
            className="adm-held-key"
            type="password"
            value={key}
            autoComplete="off"
            placeholder="Key"
            onChange={e => setKey(e.target.value)}
          />
          <button className="adm-jump" type="submit" disabled={busy || !key}>Open</button>
        </form>
      )}
      {msg && <div className="adm-held-msg">{msg}</div>}
      {state.checked && state.note && <div className="adm-held-msg">{state.note}</div>}
    </div>
  );
}

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
          {/* [H1 2026-08-06] TWO BUTTONS LEFT THIS ROW AND FOR TWO DIFFERENT
              REASONS. `/hr` moved down into the held section, because a jump
              button that lands on the Lobby is a control that does not do what
              its label says. `/cb` is DELETED: there has never been a `/cb`
              route in App.jsx, so it fell through the catch-all onto the Lobby
              — a dead control on the one page whose job is to report the true
              state of things. A Carsie Blanton wing is ledgered, unbuilt, and
              is register row M77; the day it exists, this row gets a button
              that goes somewhere. */}
          <div className="adm-controls">
            <button className="adm-jump" onClick={() => navigate("/shop")}>/shop</button>
            <button className="adm-refresh" onClick={load}>↺ Refresh</button>
            <button className="adm-back" onClick={() => navigate("/")}>← Back</button>
          </div>
        </div>

        <HeldDoor />

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
