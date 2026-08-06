// src/routes/exhibit/FoundationObjects.jsx — THE FOUNDATION'S THREE OBJECTS,
// as face objects.
//
// ═══ [D7 2026-08-06] WHY THIS FILE EXISTS ═══════════════════════════════════
// M62 was handed back for one reason: /foundation was a SHEET carrying three
// objects the face model had no equivalent for, and a straight port to
// `blurb` / `lines` / `entries` would have deleted all three — two of them
// mechanisms Mike specified himself. Option A was his ruling: teach the album
// shape to carry them.
//
// SO THIS IS THE SHEET'S OWN MARKUP, MOVED AND NOT REWRITTEN. Every element,
// every class name and every `data-` attribute below is what `Foundation.jsx`
// rendered; the stylesheet it reads is the same `Foundation.css`. That is
// deliberate and it is the cheapest possible guarantee that nothing of the
// machinery was lost in the move: if a rule still matches, the object still
// looks like itself. The notes on WHY each object is shaped the way it is stay
// with the DATA, in `src/data/artists/foundation.js`, because that is where the
// declarations live now.
//
// THE ONE THING THAT IS NOT A MOVE: the objects take their content from a face
// instead of from module scope. `AccountCard` was hard-coded JSX and is now
// `face.account`; `RegisterTable` and `LedgerSheet` were reading `LEDGER` and
// `INVOICE` off the same file they were declared in and now take them as props.
// A face declares its objects — that is the whole contract this port had to
// join.
//
// WHY IT IS NOT INSIDE Exhibit.jsx. Exhibit.jsx is the generic viewer and does
// not know about wings; these three objects are one wing's. It mounts them the
// way it mounts `InstrumentPanel` — on the presence of a field.

/* [E4 2026-08-03] this room's own objects. The sheet furniture (`sheet.css`)
   does NOT come with them: the wing has the exhibit's furniture now. */
import "../Foundation.css";
import { BY_LABEL, BY_KIND, stateOfRow } from "../../lib/foundation-state.js";

/* THE ACCOUNT CARD.
   `aria-hidden`, carried across unchanged: the answers on the FAQ album say all
   four facts in sentences, and a screen reader hearing "$0.00" as a fragment
   ahead of them is served worse, not better. */
export function AccountCard({ decl }) {
  if (!decl) return null;
  return (
    <div className="fnd-ledger" aria-hidden="true" data-stage-split="row">
      <div className="fnd-ledger-head">{decl.head}</div>
      <div className="fnd-ledger-figure">{decl.figure}</div>
      <dl className="fnd-ledger-rows">
        {decl.rows.map(({ k, v }) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
    </div>
  );
}

/* THE REGISTER — the two-sided table of what comes in.
   IT IS A TABLE AND IT IS BUILT AS ONE, not as a styled list. The state of each
   row is DATA about that row, so it sits in a cell beside it: a visitor can read
   the state column down the page without reading a word of the prose.
   THE STATE COLUMN IS THE HONESTY MECHANISM AND IT READS THE REVEAL LEDGER —
   `stateOfRow` calls `isLive(row.reveal)`, so building `channel.qr` flips this
   stamp with no edit here or in the data. That is R5's proof-of-wiring and it
   crossed the port intact. */
export function RegisterTable({ decl }) {
  if (!Array.isArray(decl) || decl.length === 0) return null;
  return (
    <section className="fnd-reg-wrap" data-stage-split="row">
      {decl.map(({ head, sub, rows, law }) => (
        <div className="fnd-reg" key={head}>
          <div className="fnd-reg-head">
            <span className="fnd-reg-head-what">{head}</span>
            <span className="fnd-reg-head-sub">{sub}</span>
          </div>
          <ul className="fnd-reg-rows">
            {rows.map(({ what, reveal, line, by }) => (
              <li className="fnd-reg-row" key={what}>
                <div className="fnd-reg-top">
                  <span className="fnd-reg-what">{what}</span>
                  <span className="fnd-reg-meta">
                    {/* [N7] the donor column, LABELLED in every row rather than
                        headed once, because the register stacks on a phone and a
                        column heading that has scrolled away is a column nobody
                        can read. */}
                    <span className="fnd-reg-by" data-by={BY_KIND[by] || "NAME"}>
                      <span className="fnd-reg-by-k">Donated by</span>
                      <span className="fnd-reg-by-v">{BY_LABEL[by] ?? by}</span>
                    </span>
                    <span className="fnd-reg-state" data-state={stateOfRow({ reveal })}>
                      {stateOfRow({ reveal })}
                    </span>
                  </span>
                </div>
                <p className="fnd-reg-line">{line}</p>
              </li>
            ))}
          </ul>
          {law && <p className="fnd-reg-law">{law}</p>}
        </div>
      ))}
    </section>
  );
}

/* THE LEDGER — the zero-cost itemised account, and the posture signed under it.
   [P10 2026-08-05] THE CLASS NAMES AND THE `inv` KEYS STAY, deliberately, on
   exactly the reasoning that kept `id: "mgk-viii"` after that album was renamed:
   they are keys, nothing outside this wing reads them, and nothing prints them.
   The strings a visitor meets are the mark and the accessible name. */
export function LedgerSheet({ decl, posture }) {
  if (!decl) return null;
  return (
    <section className="fnd-inv" data-stage-split="row"
      aria-label="A zero-cost ledger kept by the keeper for the museum">
      <div className="fnd-inv-top">
        <span className="fnd-inv-mark">Ledger</span>
        <span className="fnd-inv-no">{decl.no}</span>
      </div>
      <dl className="fnd-inv-parties">
        <div><dt>From</dt><dd>{decl.from}</dd></div>
        <div><dt>Bill to</dt><dd>{decl.billTo}</dd></div>
      </dl>
      <ul className="fnd-inv-lines">
        {decl.lines.map(({ what, rate }) => (
          <li key={what}>
            <span className="fnd-inv-what">
              {what}
              {rate && <span className="fnd-inv-rate">{rate}</span>}
            </span>
            <span className="fnd-inv-amt">$0.00</span>
          </li>
        ))}
      </ul>
      <div className="fnd-inv-total">
        <span>Total due</span>
        <span className="fnd-inv-total-amt">{decl.total}</span>
      </div>
      <p className="fnd-inv-note">{decl.note}</p>
      {posture && <p className="fnd-posture">{posture}</p>}
      {posture && <p className="fnd-posture-sig">Papa Weird.Baby</p>}
    </section>
  );
}
