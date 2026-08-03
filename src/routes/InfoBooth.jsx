// src/routes/InfoBooth.jsx — the INFORMATION BOOTH (/booth).
// A quiet room in Lobby chrome (B&W photo-paper shell, WbHome's stock).
// Content = who-we-are words in Papa's voice. WORDS ARE DRAFT v0 from
// WB_ARTIST_LOBBY_BOOTH-20260706 Stage 4 — Mike edits or approves.
// Title bar follows the museum-standard format (brand / room / Lobby),
// per Mike 2026-07-06 (established on the Gift Shop the same day).
// The full charter is a separate workstream; these words are only the
// visitor-facing tip of it.
//
// [L3 2026-08-02] THE TOKEN CONFORMANCE ROUND. B7/R1 counted 25 hard-coded
// colours here and one token read; 22 were byte-for-byte an existing `--wb-*`
// and now say so. Three have no token and are listed in the round log. Same
// note as the Lobby about the inline `<style>` block: `var(--wb-*)` resolves
// because the tokens are in the bundled document, which is verified but is
// R5's dependency to make explicit.

import { useState } from "react";
import { Link } from "react-router-dom";
import "./InfoBooth.css";
import { useRoom } from "../lib/use-room.js";
import MuseumBar from "../components/MuseumBar.jsx";

// FAQ seed items — DRAFT, pending Mike's ruling. Q1's answer is the money
// paragraph Mike cut from the placard for brevity (content was accepted);
// Q2 is drafted from his 2026-07-06 governance note (see BACKLOG intake).
const FAQ = [
  {
    q: "Where does the money go?",
    a: "The museum owns nothing and takes nothing. Money that passes through here goes to making the world better — all of it, always.",
  },
  {
    q: "Who keeps this place?",
    a: "One person — Papa Weird.Baby. The job pays nothing, the museum never pays to be managed, and only zero-invoice services are accepted. That's the deal, and it never changes.",
  },
];

export default function InfoBooth() {
  /* [R5] this room owns the page ground while it is mounted — see
     src/lib/use-room.js and the header of this route's stylesheet. */
  useRoom("booth");
  const [faqOpen, setFaqOpen] = useState(false);
  return (
    <>

      <div className="booth-root">
        {/* TITLE BAR — museum-standard: brand / room / Lobby */}
        {/* [R2 2026-08-02] the shared <MuseumBar>; `.booth-nav-*` retired. */}
        <MuseumBar room="Information Booth" />

        {/* THE WORDS — DRAFT v0, Papa's voice. Mike edits or approves. */}
        <div className="booth-card">
          <div className="booth-credo">
            The Weird.Baby Museum is free.<br />
            Equally free. <em>Always.</em>
          </div>
          <div className="booth-words">
            <p>No tickets, no tiers, no ads.</p>
            <p>The museum owns nothing and takes nothing.</p>
          </div>
          <div className="booth-rule" />
          <div className="booth-contact">
            Thank you. <a href="mailto:papa@weird.baby">papa@weird.baby</a>
          </div>

          {/* FAQ left, Lobby right (Mike 2026-07-06). FAQ expands the card
              in place — low-friction, contiguous; visitor stays in the room. */}
          <div className="booth-actions">
            <button
              className="booth-btn"
              onClick={() => setFaqOpen(o => !o)}
              aria-expanded={faqOpen}
            >
              FAQ
            </button>
            <Link to="/" className="booth-btn">Lobby</Link>
          </div>

          {faqOpen && (
            <div className="booth-faq">
              {FAQ.map(({ q, a }) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <div className="booth-faq-a">{a}</div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
