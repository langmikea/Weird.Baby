// src/routes/WbHome.jsx — the LOBBY (/).
//
// [L3 2026-08-02] THE TOKEN CONFORMANCE ROUND. B7/R1 counted 43 hard-coded
// colours on this surface and ZERO reads of the design tokens; 33 of the 43
// were byte-for-byte a `--wb-*` that already existed. Those 33 now read the
// token. The other ten have no token and are listed in the round log with what
// they are and what they should probably become — Ops does not invent palette.
//
// WHY THE INLINE `<style>` BLOCK STILL WORKS: custom properties live on :root
// and Vite bundles every stylesheet into one document, so `var(--wb-*)`
// resolves here even though this file cannot `@import` anything. That is
// verified, not assumed — but it is also bundling luck rather than a declared
// dependency, which is R5's point and R5's job (see the round log).
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WbHome.css";
import { useRoom } from "../lib/use-room.js";
import { useArrival } from "../lib/use-arrival.js";

/* [M-ID 2026-08-03] MIKE HAS ANSWERED, AND THE ANSWER RETIRES THE QUESTION.
   F7c rendered four candidates behind `/?subtitle=2..4` and said "MIKE PICKS —
   nothing here is final until he does". He picked, and he picked none of them:
   "it is THE MUSEUM. No singer-songwriter qualifier, nothing narrowing —
   all-encompassing."
   Every candidate named a CLASS OF ARTIST, and every one of them was a fence.
   The building already holds a machine wing and a wing of other people's
   records; "a singer-songwriter museum" was untrue the day the robots opened
   and would have to be re-argued at every new wing. A name that has to shrink
   to stay accurate is the wrong name.
   The candidate list and the `?subtitle=` preview go with it. A shown-then-
   asked device that outlives the asking becomes four dead strings and a query
   parameter nobody will ever type again — and, worse, a live URL that still
   renders a retired identity. */
const SUBTITLE = "The Museum";

export default function WbHome() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("lobby");
  /* [M2 2026-08-03] MIKE: "THE HOMEPAGE ALWAYS starts clean at the top, every
     time — that's our space and we keep it neat." `always`, where every other
     room in the museum resets only on the first visit of a session. */
  useArrival("lobby", { always: true });
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

      <div className={`wb-root ${visible ? "visible" : ""}`}>
        <div className="wb-left">
          <img src="/WeirdBaby_PhotoID.png" alt="Weird.Baby" className="wb-logo" />
          <div className="wb-subtitle">{SUBTITLE}</div>
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
            {/* [M8 2026-08-03] THE DIRECTORY NAMES THE EXHIBITS PROPERLY.
                Mike's list, verbatim: Weird.Baby Robots · Weird.Baby Music ·
                Other Music Worth a Listen · Information Booth.
                WHAT THE OLD NAMES WERE DOING WRONG. "Robots" and "Weird.Baby"
                were ROUTE names wearing a directory's clothes: a stranger
                reading the board could not tell that the first two are the
                house's OWN work and the third is other people's, which is the
                single most useful fact a museum directory can carry. "Worth A
                Listen" named the standard and not the contents. And a lobby
                board with an entry called "Weird.Baby" directly under a
                Weird.Baby wordmark reads as "the site", not "a room in it".
                The order is Mike's order and it says the same thing the names
                do — ours, ours, theirs, then the desk. The shop keeps the end
                of the board: it is not an exhibit and was not in his list.
                A directory entry is still one line and one route (WAL's own
                note below); only the words changed. */}
            {/* Robots live link — §D2 ruling 2026-07-23 (coming-soon retires).
                STAGED: reaches the public site only when Mike deploys (D7). */}
            <button className="wb-dir-entry" onClick={() => navigate("/robots")}>
              <span>Weird.Baby Robots</span><span className="wb-dir-arrow">→</span>
            </button>
            <button className="wb-dir-entry" onClick={() => navigate("/wb")}>
              <span>Weird.Baby Music</span><span className="wb-dir-arrow">→</span>
            </button>
            {/* [WAL 2026-08-02] listed exactly like the others: same button,
                same arrow, same navigate call. A new exhibit is one entry here
                and one route, which is the whole point of the machinery being
                shared. */}
            <button className="wb-dir-entry" onClick={() => navigate("/wal")}>
              <span>Other Music Worth a Listen</span><span className="wb-dir-arrow">&rarr;</span>
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
              {/* [B2 2026-08-02] THE BOOK ASKS TWO QUESTIONS THE SAME WAY.
                  Mike's composition: the note at full width, then the name and
                  the button beneath it on ONE line, each half. P13's caption
                  above the name field is superseded — the reasoning is on
                  `.wb-field` in the sheet above.
                  "SIGN", not "Sign the Guest Book". At half width the long
                  label wrapped to two lines and the row lost its balance, and
                  the short one is not a loss: it sits beside the field it acts
                  on, under a heading that already says Guest Book. Tight,
                  intuitive, low-demand — which is the whole brief. */}
              <div className="wb-form">
                {/* [P13] "(optional)" IS GONE. Mike's call, and it was doing
                    harm: the only two fields on the page were labelled "answer
                    this" and "you don't have to", which is an invitation to
                    skip the half that makes the book worth reading. Nothing
                    enforces it either way — a blank note has always been
                    accepted. */}
                <textarea className="wb-field wb-field-note"
                  placeholder="what brought you here?" value={note}
                  onChange={e => setNote(e.target.value)} maxLength={280} />
                <div className="wb-form-row">
                  <input className="wb-field" placeholder="what should we call you?"
                    value={name} onChange={e => setName(e.target.value)}
                    maxLength={60} />
                  <button className="wb-submit" onClick={handleSubmit}>Sign</button>
                </div>
              </div>
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
