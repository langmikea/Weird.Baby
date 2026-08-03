import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

/* [F7c 2026-08-02] THE SUBTITLE — so a stranger knows what Weird.Baby IS
   before they are asked to explore it. Mike named the class ("Solo Artist" /
   "Singer Songwriter"); these are the rendered candidates, SHOWN-THEN-ASKED:
   `/?subtitle=2..4` previews each on the live page, the first is the working
   default, and MIKE PICKS — nothing here is final until he does. [PAPA] */
const SUBTITLE_CANDIDATES = [
  "A Singer-Songwriter Museum",
  "A Solo Artist Museum",
  "The Singer-Songwriter Museum",
  "Museum of the Solo Artist",
];

export default function WbHome() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const subtitle = SUBTITLE_CANDIDATES[
    (parseInt(searchParams.get("subtitle"), 10) || 1) - 1
  ] || SUBTITLE_CANDIDATES[0];
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
        /* [walk-five] the float, slightly bigger per Mike */
        @keyframes float { 0%, 100% { transform: translateY(0px) rotate(-0.7deg); } 50% { transform: translateY(-14px) rotate(0.7deg); } }
        /* [F7c] the subtitle: what this place IS, in museum signage — steady
           (no blink; it is a fact, not an ellipsis), one step up from the
           tagline in weight and presence. */
        .wb-subtitle { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.78rem; letter-spacing: 0.3em; text-transform: uppercase; color: #2b2924; margin-top: 22px; position: relative; z-index: 1; }
        .wb-tagline { font-family: 'Courier Prime', monospace; font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase; color: #57544d; margin-top: 12px; position: relative; z-index: 1; animation: blink 3s step-end infinite; }
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

        /* [P13 2026-08-02] THE BOOK GETS A HEADING, NOT A LABEL.
           Mike: "the whole guestbook layout needs a tweak — the lobby to its
           left is very classy, match that quality." What makes the left side
           classy is one device used consistently: a small mono caption over a
           ruled list, every row a hairline apart, nothing shouting. The book
           had a stretched 0.62rem word floating over an unrelated form. So it
           now wears the SAME furniture as the directory — caption, rule, ruled
           rows — and the count rides the heading, because a guest book that
           says how many people have signed is doing the one piece of
           persuasion this page actually wants to do. */
        .wb-book-head { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; border-bottom: 1px solid #211f1c; padding-bottom: 7px; margin-bottom: 14px; }
        .wb-book-label { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.28em; text-transform: uppercase; color: #211f1c; display: block; }
        .wb-book-count { font-family: 'Courier Prime', monospace; font-size: 0.58rem; letter-spacing: 0.16em; text-transform: uppercase; color: #9b978d; white-space: nowrap; }

        /* ENTRY BOX — name field looks like a physical form entry */
        .wb-entry-box { border: 1px solid #c6c2b7; border-radius: 1px; padding: 10px 14px 12px; margin-bottom: 10px; background: #faf8f3; transition: border-color 0.25s; }
        .wb-entry-box:focus-within { border-color: #211f1c; }
        .wb-entry-box-label { font-family: 'Courier Prime', monospace; font-size: 0.6rem; letter-spacing: 0.2em; text-transform: uppercase; color: #7d7869; margin-bottom: 8px; display: block; }

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
        /* [walk-five] the book, EASIER AND MORE INVITING to scroll — taller,
           boxed as the physical book (not tucked away), thumb always visible. */
        /* [P12 2026-08-02] NO MESSAGE IS EVER CUT IN HALF AT THE BOTTOM.
           MIKE, with a screenshot: "the guestbook list leaves messages CLIPPED
           mid-line at the bottom — never leave clipped messages; fix the
           composition."
           THE CAUSE IS ARITHMETIC, NOT STYLING. The box was capped at 44vh —
           a fraction of the WINDOW — while its contents are rows of a fixed
           type size. 44% of a viewport is never a whole number of rows except
           by accident, so the last row was sliced at whatever fraction the
           window happened to produce, and it changed every time anyone resized.
           THE FIX IS TO MEASURE IN ROWS, WHICH IS THE UNIT THE CONTENT IS
           ACTUALLY MADE OF. The --gb-row custom property is the row's exact box
           (line + padding + rule); the cap is a whole multiple of it; and
           scroll-snap makes every SCROLLED position land on a row boundary too
           — because a cap that is right only at the top of the list fixes the
           screenshot and not the defect.
           Rows are uniform BY CONSTRUCTION for the same reason: one line each,
           so "a whole number of rows" is a number the CSS can know. */
        /* THE BOX'S OWN BORDER IS PART OF THE BUDGET. box-sizing:border-box is
           set globally at the top of this sheet, so a max-height of 7 rows
           gave the CONTENT 7 rows minus the 2px frame — and the seventh row
           came up 28px short, which is a clipped message by a different route.
           Measured, then counted properly. */
        /* THE 16px IS NOT DECORATION. The submit button carries transform:
           scaleY(1.15) — the sheet's typewriter squash — so the button PAINTS
           about 7px taller than the box it occupies. A 4px gap put the first
           signature under the button's own bottom edge. The gap has to clear
           the paint, not the layout. */
        .wb-entries { --gb-row: 30px; margin-top: 16px; max-height: calc(var(--gb-row) * 7 + 2px); overflow-y: auto; scroll-snap-type: y proximity; overscroll-behavior: contain; border: 1px solid #c6c2b7; border-radius: 1px; background: #faf8f3; scrollbar-width: thin; scrollbar-color: #a9a59a transparent; }
        .wb-entries::-webkit-scrollbar { width: 6px; }
        .wb-entries::-webkit-scrollbar-thumb { background: #a9a59a; border-radius: 3px; }
        .wb-entries::-webkit-scrollbar-track { background: transparent; }
        .wb-entry { display: flex; align-items: baseline; gap: 12px; height: var(--gb-row); padding: 0 12px; border-bottom: 1px solid #e2ded3; scroll-snap-align: start; animation: rise 0.4s ease; }
        .wb-entry:last-child { border-bottom: 0; }
        .wb-entry:hover { background: #f2efe6; }
        .wb-entry-name { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 0.78rem; letter-spacing: 0.02em; color: #211f1c; white-space: nowrap; }
        .wb-entry-note { font-family: 'Courier Prime', monospace; font-style: italic; font-size: 0.72rem; color: #6f6b62; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
        .wb-entry-date { font-family: 'Courier Prime', monospace; font-size: 0.62rem; color: #9b978d; white-space: nowrap; }

        .wb-footer { position: absolute; bottom: 18px; right: 24px; font-family: 'Courier Prime', monospace; font-size: 0.56rem; letter-spacing: 0.1em; color: #b0aca1; display: flex; align-items: center; gap: 7px; }
        .wb-mark { display: inline-flex; align-items: center; justify-content: center; width: 20px; height: 20px; border: 1px solid #a9a59a; border-radius: 50%; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.42rem; letter-spacing: 0.04em; color: #a9a59a; animation: float-mark 9s ease-in-out infinite; flex-shrink: 0; }
        @keyframes float-mark { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }

        /* THE LOBBY IS A FIXED 100vh AND THE RIGHT PANE CLIPS WHAT DOES NOT
           FIT, so on a short window the book has to give ground — and it gives
           it in WHOLE ROWS, because a shorter list of complete signatures is
           the point of P12 and a taller list of sliced ones is what it
           replaced. */
        @media (max-height: 880px) {
          .wb-entries { max-height: calc(var(--gb-row) * 5 + 2px); }
        }
        @media (max-height: 760px) {
          .wb-entries { max-height: calc(var(--gb-row) * 3 + 2px); }
        }

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
          <div className="wb-subtitle">{subtitle}</div>
          <div className="wb-tagline">something is being built here</div>
          <nav className="wb-directory" aria-label="Museum directory">
            <div className="wb-dir-label">Directory</div>
            {/* Hunter Root delisted 2026-07-07 (Mike's direction); /hr live
                but unlinked.
                [W9 2026-08-02 amendment] The route stays live and unlisted,
                but NOTHING points at it any more: the WAL wing's pointers to
                /hr were removed per Mike (the HR museum concept was never
                approved and is history). Hunter Root is a WORTH A LISTEN
                artist served from our own vault; his door out is his own
                site. /hr remains reachable only by URL, as an archive. */}
            {/* Robots live link — §D2 ruling 2026-07-23 (coming-soon retires).
                STAGED: reaches the public site only when Mike deploys (D7). */}
            <button className="wb-dir-entry" onClick={() => navigate("/robots")}>
              <span>Robots</span><span className="wb-dir-arrow">→</span>
            </button>
            {/* [WAL 2026-08-02] WORTH A LISTEN - listed exactly like the
                others: same button, same arrow, same navigate call. A new
                exhibit is one entry here and one route, which is the whole
                point of the machinery being shared. */}
            <button className="wb-dir-entry" onClick={() => navigate("/wal")}>
              <span>Worth A Listen</span><span className="wb-dir-arrow">&rarr;</span>
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
          {/* [walk-five] "You are early. That is noted." killed — redundant
              with the note above (the book already says what early means). */}
          <div className="wb-rule" />
          <div className="wb-book-head">
            <span className="wb-book-label">Guest Book</span>
            {!loading && entries.length > 0 && (
              <span className="wb-book-count">
                {entries.length} {entries.length === 1 ? "signature" : "signatures"}
              </span>
            )}
          </div>

          {!submitted ? (
            <>
              {/* [P13 2026-08-02] ONE PROMPT, NOT TWO.
                  MIKE: "'What should we call you?' and 'sign here' collapse to
                  just 'What should we call you?'"
                  The field asked the same question twice in two registers — a
                  mono caption above and an italic placeholder inside — and the
                  placeholder's answer ("sign here…") was an instruction, not an
                  answer to the question above it. The caption is the better of
                  the two: it is a question, it stays visible while you type,
                  and it does not disappear the moment you need it. */}
              <div className="wb-entry-box">
                <span className="wb-entry-box-label">What should we call you?</span>
                <input className="wb-input" value={name}
                  onChange={e => setName(e.target.value)} maxLength={60} />
              </div>
              {/* [P13] "(optional)" IS GONE. Mike's call, and it was doing
                  harm: the only two fields on the page were labelled "answer
                  this" and "you don't have to", which is an invitation to skip
                  the half that makes the book worth reading. Nothing enforces
                  it either way — a blank note has always been accepted. */}
              <textarea className="wb-input wb-textarea" placeholder="what brought you here?" value={note} onChange={e => setNote(e.target.value)} maxLength={280} />
              <button className="wb-submit" onClick={handleSubmit}>Sign the Guest Book</button>
            </>
          ) : (
            <div className="wb-confirmed">You're in the book. Welcome, Founding Visitor.</div>
          )}

          {!loading && entries.length > 0 && (
            <div className="wb-entries">
              {entries.map((e, i) => (
                /* the full note rides `title` — the row is one ledger line by
                   composition, and a long message is still readable on hover
                   rather than being lost with the ellipsis. */
                <div className="wb-entry" key={i} title={e.note || undefined}>
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
