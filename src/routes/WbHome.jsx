import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WbHome() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setVisible(true), 80);
    fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: "/", referrer: document.referrer || "" }),
    }).catch(() => {});
    fetch("/api/guestbook")
      .then(r => r.json())
      .then(data => { setEntries(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSubmit() {
    if (!name.trim()) return;
    const res = await fetch("/api/guestbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), note: note.trim() }),
    });
    if (res.ok) {
      const updated = await fetch("/api/guestbook").then(r => r.json());
      setEntries(Array.isArray(updated) ? updated : []);
      setSubmitted(true);
    }
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Syne:wght@400;600;800&family=Courier+Prime:ital,wght@0,400;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #080808; color: #f0ece4; }
        .wb-root { height: 100vh; width: 100vw; display: grid; grid-template-columns: 1fr 1fr; opacity: 0; transition: opacity 0.9s ease; overflow: hidden; }
        .wb-root.visible { opacity: 1; }
        .wb-left { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-right: 1px solid #1e1e1e; position: relative; background: #060606; }
        .wb-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, #1a1408 0%, transparent 70%); pointer-events: none; }
        .wb-logo { width: min(340px, 85%); height: auto; filter: none; position: relative; animation: float 7s ease-in-out infinite; z-index: 1; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-0.5deg); } 50% { transform: translateY(-10px) rotate(0.5deg); } }
        .wb-tagline { font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #b8974a; margin-top: 24px; position: relative; z-index: 1; animation: blink 3s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

        .wb-explore { margin-top: 48px; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.58rem; letter-spacing: 0.22em; text-transform: uppercase; color: #787878; background: none; border: none; cursor: pointer; transition: color 0.3s; white-space: nowrap; z-index: 1; padding: 8px 0; position: relative; }
        .wb-explore:hover { color: #b8974a; }

        .wb-right { display: flex; flex-direction: column; justify-content: center; padding: 48px 52px; overflow: hidden; position: relative; }
        .wb-note { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1rem, 1.35vw, 1.25rem); line-height: 1.75; color: #d4cfc7; margin-bottom: 10px; }
        .wb-note em { color: #b8974a; font-style: italic; }
        .wb-whisper { font-family: 'Courier Prime', monospace; font-size: 0.63rem; letter-spacing: 0.16em; text-transform: uppercase; color: #888; margin-bottom: 26px; }
        .wb-rule { width: 36px; height: 1px; background: #b8974a; margin-bottom: 22px; opacity: 0.5; }

        .wb-book-label { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: #b8974a; margin-bottom: 18px; display: block; transform: scaleY(1.4); transform-origin: left center; }

        /* ENTRY BOX — name field looks like a physical form entry */
        .wb-entry-box { border: 1px solid #1e1e1e; border-radius: 1px; padding: 10px 14px 12px; margin-bottom: 12px; background: #0a0a0a; transition: border-color 0.25s; }
        .wb-entry-box:focus-within { border-color: #b8974a; }
        .wb-entry-box-label { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #3a3a3a; margin-bottom: 8px; display: block; }

        .wb-input { width: 100%; background: transparent; border: none; color: #f0ece4; font-family: 'DM Serif Display', serif; font-size: 0.95rem; padding: 0; outline: none; caret-color: #b8974a; display: block; transform: scaleY(1.15); transform-origin: left top; }
        .wb-input::placeholder { color: #444; font-style: italic; }
        .wb-textarea { resize: none; height: 60px; border: 1px solid #181818; padding: 10px 10px; border-radius: 1px; background: #0c0c0c; font-size: 0.84rem; transition: border-color 0.25s; margin-bottom: 12px; }
        .wb-textarea:focus { border-color: #b8974a; }
        .wb-submit { width: 100%; margin-top: 0; padding: 13px; background: transparent; border: 1px solid #b8974a; color: #b8974a; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, color 0.2s; display: block; transform: scaleY(1.15); transform-origin: center top; }
        .wb-submit:hover { background: #b8974a; color: #080808; }
        .wb-confirmed { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 1rem; color: #b8974a; padding: 14px 0 6px; display: block; transform: scaleY(1.15); }
        @keyframes rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .wb-entries { margin-top: 14px; max-height: 120px; overflow-y: auto; scrollbar-width: none; }
        .wb-entries::-webkit-scrollbar { display: none; }
        .wb-entry { display: flex; align-items: baseline; gap: 10px; padding: 5px 0; border-bottom: 1px solid #131313; animation: rise 0.4s ease; }
        .wb-entry-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.8rem; color: #e8e4dc; white-space: nowrap; }
        .wb-entry-note { font-family: 'Courier Prime', monospace; font-style: italic; font-size: 0.7rem; color: #555; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .wb-entry-date { font-family: 'Courier Prime', monospace; font-size: 0.6rem; color: #444; white-space: nowrap; }

        .wb-footer { position: absolute; bottom: 18px; right: 24px; font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.1em; color: #2a2a2a; display: flex; align-items: center; gap: 7px; }
        .wb-mark { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: 1px solid #2e2e2e; border-radius: 50%; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.42rem; letter-spacing: 0.04em; color: #2e2e2e; animation: float-mark 9s ease-in-out infinite; flex-shrink: 0; }
        @keyframes float-mark { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }

        @media (max-width: 680px) {
          html, body { overflow: auto; }
          .wb-root { height: auto; min-height: 100vh; grid-template-columns: 1fr; overflow: auto; }
          .wb-left { padding: 48px 24px 32px; border-right: none; border-bottom: 1px solid #1e1e1e; }
          .wb-logo { width: min(240px, 70vw); }
          .wb-right { padding: 36px 28px 60px; }
          .wb-explore { margin-top: 32px; }
        }
      `}</style>

      <div className={`wb-root ${visible ? "visible" : ""}`}>
        <div className="wb-left">
          <img src="/WeirdBaby_PhotoID.png" alt="Weird.Baby" className="wb-logo" />
          <div className="wb-tagline">something is being built here</div>
          <button className="wb-explore" onClick={() => navigate("/hr")}>
            explore what's here →
          </button>
        </div>

        <div className="wb-right">
          <p className="wb-note">
            We're not open yet.<br />
            But you found us —<br />
            which means <em>something.</em><br /><br />
            The people who sign the guest book now<br />
            will be remembered differently<br />
            than the ones who come later.
          </p>
          <p className="wb-whisper">You are early. That is noted.</p>
          <div className="wb-rule" />
          <div className="wb-book-label">Guest Book</div>

          {!submitted ? (
            <>
              <div className="wb-entry-box">
                <span className="wb-entry-box-label">Name</span>
                <input className="wb-input" placeholder="sign here..." value={name} onChange={e => setName(e.target.value)} maxLength={60} />
              </div>
              <textarea className="wb-input wb-textarea" placeholder="what brought you here? (optional)" value={note} onChange={e => setNote(e.target.value)} maxLength={280} />
              <button className="wb-submit" onClick={handleSubmit}>Sign the Guest Book</button>
            </>
          ) : (
            <div className="wb-confirmed">You're in the book. Welcome, Founding Visitor.</div>
          )}

          {!loading && entries.length > 0 && (
            <div className="wb-entries">
              {entries.map((e, i) => (
                <div className="wb-entry" key={i}>
                  <span className="wb-entry-name">{e.name}</span>
                  {e.note && <span className="wb-entry-note">{e.note}</span>}
                  <span className="wb-entry-date">{formatDate(e.signed_at)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="wb-footer">
          <span className="wb-mark">WB</span>
          <span>weird.baby</span>
        </div>
      </div>
    </>
  );
}
