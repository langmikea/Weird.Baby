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
        /* B&W PASS 2 (2026-06-07): the photo album page — the Lobby joins
           the exhibit's light paper shell. The logo is literally a 1960s
           B&W print; it finally sits on its native stock. Photo-black
           accents replace museum gold; structure and motion untouched. */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; overflow: hidden; background: #d9d5ca; color: #211f1c; }
        .wb-root { height: 100vh; width: 100vw; display: grid; grid-template-columns: 1fr 1fr; opacity: 0; transition: opacity 0.9s ease; overflow: hidden; }
        .wb-root.visible { opacity: 1; }
        .wb-root::after { content: ''; position: fixed; inset: 0; z-index: 950; pointer-events: none; opacity: 0.07; mix-blend-mode: multiply; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E"); background-size: 240px 240px; }
        .wb-left { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px; border-right: 1px solid #c6c2b7; position: relative; background: #ece9e0; }
        .wb-left::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, #f7f5ee 0%, transparent 70%); pointer-events: none; }
        .wb-logo { width: min(340px, 85%); height: auto; filter: none; position: relative; animation: float 7s ease-in-out infinite; z-index: 1; }
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-0.5deg); } 50% { transform: translateY(-10px) rotate(0.5deg); } }
        .wb-tagline { font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #57544d; margin-top: 24px; position: relative; z-index: 1; animation: blink 3s step-end infinite; }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }

        /* DIRECTORY (Stage 3, WB_ARTIST_LOBBY_BOOTH-20260706): four listings
           replace the single explore button. Museum signage — type only,
           no images. Booth-behind-glass was inspiration, not literal. */
        .wb-directory { margin-top: 44px; z-index: 1; position: relative; width: min(300px, 80%); }
        .wb-dir-label { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.28em; text-transform: uppercase; color: #9b978d; margin-bottom: 10px; text-align: center; }
        .wb-dir-entry { display: flex; justify-content: space-between; align-items: baseline; width: 100%; padding: 9px 2px; background: none; border: none; border-top: 1px solid #c6c2b7; cursor: pointer; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.6rem; letter-spacing: 0.22em; text-transform: uppercase; color: #6f6b62; transition: color 0.3s; white-space: nowrap; }
        .wb-dir-entry:last-child { border-bottom: 1px solid #c6c2b7; }
        .wb-dir-entry:hover { color: #211f1c; }
        .wb-dir-arrow { font-family: 'Courier Prime', monospace; font-size: 0.6rem; color: inherit; }

        .wb-right { display: flex; flex-direction: column; justify-content: center; padding: 48px 52px; overflow: hidden; position: relative; }
        .wb-note { font-family: 'DM Serif Display', Georgia, serif; font-size: clamp(1rem, 1.35vw, 1.25rem); line-height: 1.75; color: #2b2924; margin-bottom: 10px; }
        .wb-note em { color: #2b2924; font-style: italic; }
        .wb-whisper { font-family: 'Courier Prime', monospace; font-size: 0.63rem; letter-spacing: 0.16em; text-transform: uppercase; color: #837f75; margin-bottom: 26px; }
        .wb-rule { width: 36px; height: 1px; background: #211f1c; margin-bottom: 22px; opacity: 0.5; }

        .wb-book-label { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.62rem; letter-spacing: 0.28em; text-transform: uppercase; color: #211f1c; margin-bottom: 18px; display: block; transform: scaleY(1.4); transform-origin: left center; }

        /* ENTRY BOX — name field looks like a physical form entry */
        .wb-entry-box { border: 1px solid #c6c2b7; border-radius: 1px; padding: 10px 14px 12px; margin-bottom: 12px; background: #faf8f3; transition: border-color 0.25s; }
        .wb-entry-box:focus-within { border-color: #211f1c; }
        .wb-entry-box-label { font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.2em; text-transform: uppercase; color: #9b978d; margin-bottom: 8px; display: block; }

        .wb-input { width: 100%; background: transparent; border: none; color: #211f1c; font-family: 'DM Serif Display', serif; font-size: 0.95rem; padding: 0; outline: none; caret-color: #211f1c; display: block; transform: scaleY(1.15); transform-origin: left top; }
        .wb-input::placeholder { color: #a9a59a; font-style: italic; }
        .wb-textarea { resize: none; height: 60px; border: 1px solid #c6c2b7; padding: 10px 10px; border-radius: 1px; background: #faf8f3; font-size: 0.84rem; transition: border-color 0.25s; margin-bottom: 12px; }
        .wb-textarea:focus { border-color: #211f1c; }
        .wb-submit { width: 100%; margin-top: 0; padding: 13px; background: transparent; border: 1px solid #211f1c; color: #211f1c; font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.68rem; letter-spacing: 0.22em; text-transform: uppercase; cursor: pointer; transition: background 0.2s, color 0.2s; display: block; transform: scaleY(1.15); transform-origin: center top; }
        .wb-submit:hover { background: #211f1c; color: #f5f3ec; }
        .wb-confirmed { font-family: 'DM Serif Display', serif; font-style: italic; font-size: 1rem; color: #211f1c; padding: 14px 0 6px; display: block; transform: scaleY(1.15); }
        @keyframes rise { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        /* 2026-06-07 Mike: guest book wasn't scrollable-in-practice — taller
           viewport and a visible thin scrollbar so all entries are reachable. */
        .wb-entries { margin-top: 14px; max-height: 34vh; overflow-y: auto; scrollbar-width: thin; scrollbar-color: #a9a59a transparent; }
        .wb-entries::-webkit-scrollbar { width: 6px; }
        .wb-entries::-webkit-scrollbar-thumb { background: #a9a59a; border-radius: 3px; }
        .wb-entries::-webkit-scrollbar-track { background: transparent; }
        .wb-entry { display: flex; align-items: baseline; gap: 10px; padding: 5px 0; border-bottom: 1px solid #d8d4c9; animation: rise 0.4s ease; }
        .wb-entry-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.8rem; color: #211f1c; white-space: nowrap; }
        .wb-entry-note { font-family: 'Courier Prime', monospace; font-style: italic; font-size: 0.7rem; color: #6f6b62; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; }
        .wb-entry-date { font-family: 'Courier Prime', monospace; font-size: 0.6rem; color: #9b978d; white-space: nowrap; }

        .wb-footer { position: absolute; bottom: 18px; right: 24px; font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.1em; color: #b0aca1; display: flex; align-items: center; gap: 7px; }
        .wb-mark { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: 1px solid #a9a59a; border-radius: 50%; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.42rem; letter-spacing: 0.04em; color: #a9a59a; animation: float-mark 9s ease-in-out infinite; flex-shrink: 0; }
        @keyframes float-mark { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }

        @media (max-width: 680px) {
          html, body { overflow: auto; }
          .wb-root { height: auto; min-height: 100vh; grid-template-columns: 1fr; overflow: auto; }
          .wb-left { padding: 48px 24px 32px; border-right: none; border-bottom: 1px solid #c6c2b7; }
          .wb-logo { width: min(240px, 70vw); }
          .wb-right { padding: 36px 28px 60px; }
          .wb-directory { margin-top: 32px; }
        }
      `}</style>

      <div className={`wb-root ${visible ? "visible" : ""}`}>
        <div className="wb-left">
          <img src="/WeirdBaby_PhotoID.png" alt="Weird.Baby" className="wb-logo" />
          <div className="wb-tagline">something is being built here</div>
          <nav className="wb-directory" aria-label="Museum directory">
            <div className="wb-dir-label">Directory</div>
            <button className="wb-dir-entry" onClick={() => navigate("/hr")}>
              <span>Hunter Root</span><span className="wb-dir-arrow">→</span>
            </button>
            <button className="wb-dir-entry" onClick={() => navigate("/wb")}>
              <span>Weird.Baby</span><span className="wb-dir-arrow">→</span>
            </button>
            <button className="wb-dir-entry" onClick={() => navigate("/booth")}>
              <span>Information Booth</span><span className="wb-dir-arrow">→</span>
            </button>
            <button className="wb-dir-entry" onClick={() => navigate("/shop")}>
              <span>Gift Shop</span><span className="wb-dir-arrow">→</span>
            </button>
          </nav>
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
