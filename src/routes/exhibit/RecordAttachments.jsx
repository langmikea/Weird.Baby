import { attachmentsOf } from "../../lib/record-model.js";

/* ===========================================================================
   [A1/A2 2026-08-08] THE ATTACHMENTS — payloads at the foot of an entry.
   ---------------------------------------------------------------------------
   MIKE'S BOUNDARY FIRST, BECAUSE IT GOVERNS EVERYTHING BELOW IT:

     **"THE RECORD IS EMAIL-LIKE. IT IS NOT AN EMAIL PROGRAM. Do NOT build mail
     chrome — no From, no To, no Subject line, no reply affordances, no inbox,
     no message headers, no envelope furniture of any kind. What is borrowed is
     the REGISTER ONLY: the plainness and the attachments-at-the-bottom
     convention."**

   So this file draws ONE thing: a hairline, the word ATTACHMENTS, and a list.
   There is no sender, no recipient, no subject, no forward, no download-all,
   no count badge, no envelope. If a future round finds itself adding a field
   that a mail client would have, that is the line being crossed.

   ═══ WHAT IT FIXES ═════════════════════════════════════════════════════════
   S-c, raised 2026-08-07 and ruled 2026-08-08 (D-b): an entry that declares
   `sections` went to the long-form renderer, **which drew no `wire`, no
   `plates` and no `docs` and reported nothing.** An author attaching a
   transmission, a photograph set or a document to a long-form entry got
   silence. Sections and payloads coexist now, and the payloads sit at the
   bottom, after the writing — which is Mike's ruling and is also the only
   place they can go without interrupting a document whose sections are
   deliberately unequal (`RecordEntry.jsx`'s own no-grid rule).

   ═══ ONE SHAPE, THREE KINDS ════════════════════════════════════════════════
   *"Photographs, documents and transmissions all use the same shape — same
   only the data."* The flattening is `attachmentsOf()` in `record-model.js`,
   which is pure and framework-free like everything else in that file; this
   component knows nothing about `wire` or `docs` and only draws rows.

   ═══ THE PREVIEW ICON IS THE ONE MODERN CONVENIENCE, AND IT IS SMALL ═══════
   *"Not fancy, not sleek, not a modern gallery: a plain list with small preview
   thumbnails, the way attachments appear at the foot of a message."* So: a
   fixed square, the image if there is one, a stroke glyph if there is not.
   No grid, no lightbox strip, no hover reveal, no captions under pictures — a
   photograph that can be opened opens in the wing's own reader, which is the
   same instrument a plate off the wall opens in.

   A GLYPH IS NOT A FAILURE STATE. A document whose page has not been
   photographed has no thumbnail because there is no photograph, and the row
   says "not here yet" beside its provenance. That is `docState`'s
   empty-and-honest discipline drawn rather than described.

   ═══ NOTHING IS HIDDEN BEHIND A ROW ════════════════════════════════════════
   R4's no-hidden-information law binds this surface. A transmission's lines
   and a document's extract are TEXT and print inside their row. A row that
   swallowed its own words to look tidy would be the half-sentence teaser Mike
   struck from the index, one level down.
   =========================================================================== */

/* 24×24, stroke-only, `currentColor`, the same idiom as the door icons one file
   over — which is what keeps them inside the wing's black-and-white law without
   being touched by it (the law is `img { grayscale }`, and these are not
   images). Drawn as silhouettes: at this size the outline is the whole signal. */
const GLYPHS = {
  /* a print: frame, horizon, sun */
  photograph: (
    <>
      <rect x="2.6" y="4.4" width="18.8" height="15.2" rx="1.2" />
      <circle cx="8.4" cy="9.6" r="1.9" />
      <path d="M2.6 16.6 8.9 11.4l4.3 3.6 3.3-2.5 4.9 4.1" />
    </>
  ),
  /* a page with a folded corner and three lines of type */
  document: (
    <>
      <path d="M5.4 2.8h8.2l5 5v13.4a1 1 0 0 1-1 1H5.4a1 1 0 0 1-1-1V3.8a1 1 0 0 1 1-1Z" />
      <path d="M13.6 2.8v5h5" />
      <path d="M7.6 12.4h8.8M7.6 15.6h8.8M7.6 18.8h5.6" />
    </>
  ),
  /* a printout: a torn strip with sprockets and two lines */
  transmission: (
    <>
      <path d="M4 3.6h16v14.2l-2.7 2.6-2.6-2.6-2.7 2.6-2.6-2.6-2.7 2.6L4 17.8Z" />
      <path d="M7.2 8h9.6M7.2 12h6.4" />
    </>
  ),
};

function Glyph({ kind }) {
  return (
    <svg className="vp-rec-att-glyph" viewBox="0 0 24 24" aria-hidden="true"
         fill="none" stroke="currentColor" strokeWidth="1.4"
         strokeLinecap="round" strokeLinejoin="round">
      {GLYPHS[kind] || GLYPHS.document}
    </svg>
  );
}

export default function RecordAttachments({ entry, openLink }) {
  const items = attachmentsOf(entry);
  if (!items.length) return null;

  /* THE THUMBNAIL IS A BUTTON ONLY WHEN THERE IS SOMETHING BEHIND IT. A control
     that responds to nothing teaches a reader that this list does not respond,
     and then the ones that do open go unclicked. */
  function open(a) {
    if (!a.openable || !openLink) return;
    openLink((a.set && a.set[a.index] ? a.set[a.index].img : a.img), {
      set: a.set || [{ img: a.img, label: a.name }],
      index: a.index || 0,
      setTitle: entry.title,
    });
  }

  return (
    <section className="vp-rec-att" aria-label="Attachments">
      <h4 className="vp-rec-att-head">Attachments</h4>
      <ul className="vp-rec-att-list">
        {items.map((a, i) => (
          <li key={i} className={"vp-rec-att-item vp-rec-att-item--" + a.kind}>
            {a.openable ? (
              <button type="button" className="vp-rec-att-thumb"
                      title={"open " + a.name + " in the reader"}
                      onClick={() => open(a)}>
                <img src={a.img} alt="" loading="lazy" />
              </button>
            ) : (
              <span className="vp-rec-att-thumb vp-rec-att-thumb--none" aria-hidden="true">
                {a.img ? <img src={a.img} alt="" loading="lazy" /> : <Glyph kind={a.kind} />}
              </span>
            )}
            <div className="vp-rec-att-body">
              <span className="vp-rec-att-name">{a.name}</span>
              <span className="vp-rec-att-meta">
                {a.kind}{a.meta ? " · " + a.meta : ""}
              </span>
              {/* the payload's own words, in the row, never behind it */}
              {a.lines && (
                <ul className="vp-rec-att-lines">
                  {a.lines.map((l, li) => <li key={li}>{l}</li>)}
                </ul>
              )}
              {a.extract && <p className="vp-rec-att-extract">{a.extract}</p>}
              {a.note && <p className="vp-rec-att-note">{a.note}</p>}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
