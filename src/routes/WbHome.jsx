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

/* ═══ [M23b 2026-08-04] THE GUEST BOOK MOVES, AND IT MOVES IN STEPS ═════════
   MIKE, ruling on the pair N6 built for him to choose between: "the SCROLLING
   version wins — delete the static list and the ?book= param. Then change its
   behaviour: THREE ENTRIES VISIBLE, and it BOUNCES to the next stop, PAUSES,
   bounces to the next stop, pauses — a stepped advance with rests, not a
   continuous drift. Tune the pause long enough to read three entries."

   SO THE VARIABLE THAT WAS BEING COMPARED IS GONE and a different one is set.
   N6's version drifted: a linear translate running forever, which means every
   row is in motion at every moment and a reader is always chasing. A STEPPED
   advance inverts that — the book is STILL almost all of the time, and the
   motion is a transition between two states of rest rather than the state
   itself. What a visitor reads is a held page, not a moving list.

   THE STOP IS A PAGE, NOT A ROW, and that is what makes the pause tunable to
   Mike's instruction. If it advanced one signature at a time, "long enough to
   read three entries" would be the wrong unit — two of the three would already
   have been read at the previous stop. Advancing by the whole window means each
   rest presents three signatures nobody has seen, and the rest is sized for
   exactly that: 5.0s of stillness against a 0.52s move, so the book is at rest
   90% of the time.

   THE BOUNCE IS THE EASING. `cubic-bezier(.34,1.3,.64,1)` overshoots its target
   and settles back, which is what "bounces to the next stop" describes and what
   a physical board of hinged rows does. It is one property, in the stylesheet,
   named where the transition is declared.

   THE LOOP IS STILL TWO COPIES, and the wrap is now arithmetic rather than a
   keyframe: the track advances past the end of the first copy, and the moment
   the transition finishes the offset drops by one copy's worth WITH TRANSITIONS
   OFF. The pixels are identical across that swap because the second copy is the
   first, so nothing is visible. Two copies are sufficient and the proof is a
   count: the furthest the track ever reaches is `n+2` and the lowest row on
   screen is `n+4`, against `2n-1` available, which holds for every n >= 5 —
   which is `SCROLL_MIN`, which is already the floor for running at all.

   IT STOPS WHEN A READER ARRIVES. Hover and focus-within suspend the timer, so
   a name that catches somebody's eye stays put. A moving list nobody can stop
   is the failure mode of every ticker ever built, and a stepped one is not
   exempt.

   AND IT DOES NOT MOVE FOR EVERYONE. `prefers-reduced-motion: reduce` renders
   the plain list — the platform's own signal (Doctrine 8), answered with
   "don't" rather than "slower". THE PLAIN LIST IS NOT THE DELETED VERSION
   COMING BACK: what Mike struck was the static book as a SHIPPED ALTERNATIVE
   and the `?book=` switch that offered it. A fallback for a reader who has
   asked their operating system for no animation, and for a book too short to
   have a second page, is the winner degrading — not the loser surviving. There
   is no address that serves it by choice. */
const SCROLL_MIN = 5;
const VISIBLE = 3;          /* rows in the window; `--gb-visible` mirrors it */
const REST_MS = 5000;       /* long enough to read three signatures */

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function GuestRow({ e }) {
  /* the full note rides `title` — the row is one ledger line by composition,
     and a long message is still readable on hover rather than being lost with
     the ellipsis. */
  return (
    <div className="wb-entry" title={e.note || undefined}>
      <span className="wb-entry-name">{e.name}</span>
      {e.note && <span className="wb-entry-note">{e.note}</span>}
      <span className="wb-entry-date">{formatDate(e.signed_at)}</span>
    </div>
  );
}

/* The plain window — the fallback described above, and nothing selects it. */
function GuestBookPlain({ entries }) {
  return (
    <div className="wb-entries">
      {entries.map((e, i) => <GuestRow e={e} key={i} />)}
    </div>
  );
}

/* the platform's own signal, read live rather than once: a reader can change
   the setting without reloading the lobby, and the book should notice. */
function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const read = () => setReduced(mq.matches);
    read();
    mq.addEventListener("change", read);
    return () => mq.removeEventListener("change", read);
  }, []);
  return reduced;
}

function GuestBook({ entries }) {
  const n = entries.length;
  const reduced = useReducedMotion();
  /* `pos` is in ROWS and may run one page past the first copy; `snap` turns the
     transition off for the single frame that carries the wrap. */
  const [pos, setPos] = useState(0);
  const [snap, setSnap] = useState(false);
  const [held, setHeld] = useState(false);
  const running = n >= SCROLL_MIN && !reduced;

  useEffect(() => {
    if (!running || held) return;
    const t = setTimeout(() => { setSnap(false); setPos(p => p + VISIBLE); },
      REST_MS);
    return () => clearTimeout(t);
  }, [running, held, pos]);

  /* the wrap. Once the move has finished, an offset that has run past the end
     of the first copy drops back by one copy — same pixels, no transition, so
     the swap cannot be seen. */
  function onSettled(e) {
    /* only the track's own transform — `transitionend` bubbles, and a row that
       ever grows a transition would otherwise fire the wrap mid-page. */
    if (e.target !== e.currentTarget || e.propertyName !== "transform") return;
    if (pos >= n) { setSnap(true); setPos(p => p - n); }
  }

  if (!running) return <GuestBookPlain entries={entries} />;

  return (
    <div className="wb-entries wb-entries-scroll"
      onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}>
      <div className="wb-scroll-track"
        style={{ transform: `translateY(calc(var(--gb-row) * -${pos}))`,
                 transition: snap ? "none" : undefined }}
        onTransitionEnd={onSettled}>
        <div className="wb-scroll-half">
          {entries.map((e, i) => <GuestRow e={e} key={i} />)}
        </div>
        {/* the same signatures — announcing the museum's guest book twice would
            be a defect dressed as an animation. */}
        <div className="wb-scroll-half" aria-hidden="true">
          {entries.map((e, i) => <GuestRow e={e} key={i} />)}
        </div>
      </div>
    </div>
  );
}

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
            {/* [N1 2026-08-04] THE BOOTH LEAVES THIS POSITION — see the note at
                the foot of the board, where it now stands. */}
            {/* [F3 2026-08-03] THE WEIRD.BABY FOUNDATION — Mike's new section.
                WHY IT SITS HERE AND NOT WITH THE EXHIBITS. M8 fixed this board
                by making the names say what kind of thing each entry is, and
                the ORDER carry the same information: ours, ours, theirs, then
                the desk, then the shop. The Foundation is not an exhibit —
                there is nothing in it to look at that was collected — so it
                cannot join the first three without breaking the reading M8
                built. It belongs beside the Information Booth, because they are
                the two rooms where the house explains itself: the booth answers
                what this place IS, the Foundation answers what it is FOR and
                where the money goes. Booth first, since a stranger asks what
                before they ask why.
                The shop keeps the end of the board, as M8 left it.
                [R1 2026-08-03] THIS LINE READ "Where the Money Goes" FOR ONE
                COMMIT and is restored. C2 rewrote it on a reading of Mike's
                words that he has since ruled an over-read — he asked not to
                incur legal work, not to be given a different room. The name he
                wrote is the name on the board.
                [N1 2026-08-04] AND IT LOSES ITS ARTICLE. Mike: "Directory loses
                'The': Weird.Baby Robots, Weird.Baby Music, Weird.Baby
                Foundation." Two of the three already read that way — this was
                the only line on the board carrying an article, and it read as
                the odd one out precisely because M8's other names do not.
                THE ROOM'S OWN NAME IS UNTOUCHED. The instruction was about the
                DIRECTORY, and the Foundation's page, its title bar and its
                heading still say what they said. A board is a list of where
                things are; the door still carries the full name. */}
            <button className="wb-dir-entry" onClick={() => navigate("/foundation")}>
              <span>Weird.Baby Foundation</span><span className="wb-dir-arrow">→</span>
            </button>
            <button className="wb-dir-entry" onClick={() => navigate("/shop")}>
              <span>Gift Shop</span><span className="wb-dir-arrow">→</span>
            </button>
            {/* [N1 2026-08-04] THE INFORMATION BOOTH TAKES THE BOTTOM OF THE
                BOARD. MIKE: "INFO BOOTH MOVES TO THE BOTTOM of the directory so
                it stands out."
                IT WAS FOURTH OF SIX — the position M8 gave it, reading "ours,
                ours, theirs, then the desk", with the Foundation and the shop
                after it. That reading was sound and it had a cost: the one
                entry on the board that answers "what IS this place?" sat in the
                middle of a list, wearing the same weight as the rooms either
                side of it, where a stranger scanning a directory reads the ends.
                LAST IS THE OTHER END, and on a board this short the last line is
                as exposed as the first — with the difference that the first
                belongs to the house's own work, which is what a visitor came
                for. The desk is where they go when the rooms did not answer it.
                THE EXHIBIT ORDER IS UNCHANGED under it: ours, ours, theirs,
                then the Foundation, then the shop. Only the desk moved. */}
            <button className="wb-dir-entry" onClick={() => navigate("/booth")}>
              <span>Information Booth</span><span className="wb-dir-arrow">→</span>
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

          {/* [M23b] one book — see the note above `SCROLL_MIN`. */}
          {!loading && entries.length > 0 && <GuestBook entries={entries} />}
        </div>

        <div className="wb-footer">
          <span className="wb-mark">WB</span>
          <span>weird.baby</span>
        </div>
      </div>
    </>
  );
}
