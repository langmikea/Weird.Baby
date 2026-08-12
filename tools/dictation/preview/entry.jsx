/* ===========================================================================
   THE LIVE PREVIEW'S ENTRY POINT — it renders the museum's own components.
   [D4 2026-08-08]
   ---------------------------------------------------------------------------
   MIKE: *"while he writes, he must see EXACTLY WHAT THE RECORD WILL LOOK LIKE
   ON THE PAGE, in real time. THE REQUIREMENT IS FIDELITY — the same type, the
   same scale, the same measure, the same wrapping, the same section rendering
   the live site uses. A preview that approximates is worse than none, because
   he will trust it. If true fidelity means rendering the actual component, do
   that rather than reimplementing its look."*

   SO THIS FILE IMPORTS THE SHIPPED COMPONENTS AND NOTHING ELSE. `RecordEntry`
   and `RecordIndexRow` are the same modules `src/routes/exhibit/Exhibit.jsx`
   renders; the stylesheets are the same files `src/main.jsx` and `Exhibit.jsx`
   import. There is no second implementation of the row, the sections, the door
   markers, the dateline or the type. If a future round changes how a Record
   entry draws, the preview changes with it because it IS that code — and if
   the import ever fails, the build fails, which is the point.

   ═══ WHAT IS DELIBERATELY NOT THE REAL THING, STATED SO IT IS NOT OVER-READ ══
   THE ANCESTOR CHAIN. `frame.html` hand-writes the six wrappers the wing puts
   above an entry (`.ex-root[data-flat=1]` … `.vp-flat`) rather than mounting
   the whole exhibit, because mounting the exhibit means a router, a spine, a
   YouTube API and a coverflow to draw one paragraph. **The chain is the one
   thing here that could drift, so it is the one thing the lap MEASURES** —
   `tools/dictation/preview/README-fidelity.md` records the comparison, computed
   value by computed value, against the built bundle.

   THE HANDLERS ARE INERT. `onOpen`, `onClose`, `openLink` and the twin event go
   nowhere: a door in a preview must not navigate the page he is writing on.
   They are passed rather than omitted so the component takes its normal path.
   =========================================================================== */
/* eslint-disable react-refresh/only-export-components --
   the rule guards Vite's hot-reload boundary in the APP. This module is a
   one-off library entry: the app never imports it, HMR never touches it, and
   it must export both a component and the `render` the frame calls. */
import { createRoot } from "react-dom/client";
import RecordEntry from "../../../src/routes/exhibit/RecordEntry.jsx";
import RecordIndexRow from "../../../src/routes/exhibit/RecordIndexRow.jsx";
import "../../../src/index.css";
import "../../../src/routes/exhibit/Exhibit.css";

const noop = () => {};

/* THE INDEX AND THE ENTRY ARE BOTH DRAWN, because he writes into both and the
   two answers have different jobs. The headline goes in both; the one-sentence
   summary appears ONLY in the index (D2), and the whole point of showing the
   index is that this is the one place it is ever seen.

   ═══ [2026-08-11] AND THE INDEX HALF IS OPTIONAL NOW ════════════════════════
   MIKE, of the editor: *"Index content repeated — Remove extra view."*

   THAT IS A FACT ABOUT THE PAGE RATHER THAN ABOUT THIS COMPONENT. On the live
   site the row and the opened head are two views a reader moves BETWEEN, and
   the paragraph above is still true of a PREVIEW, which is a thing you look at.
   On the EDITOR both are on screen at once, and since J1 the opened head prints
   *the index row's own six classes inside `.vp-rec-openhead`* — the same
   number, weekday, headline and deck, at the same position, size and weight, off
   one shared declaration in `Exhibit.css`. So the row is not a second view
   there; it is the same four things twice, and only one copy could be typed in.

   IT IS A FLAG HERE AND NOT A SECOND COMPONENT, WHICH IS THE WHOLE CARE OF IT.
   `RecordIndexRow` and `RecordEntry` are the museum's shipped modules and are
   untouched; this file is the preview HARNESS, and all the flag does is choose
   which of the two real components it mounts. Nothing third is drawn, and the
   surface Mike writes on is still the museum's own code drawing his entry.
   The default is ON, so `frame.html` — which calls `render` with three
   arguments — is byte-identical to what it drew yesterday. */
function Preview({ entry, epoch, index = true }) {
  return (
    <>
      {index && (
        <>
          <ol className="vp-face-entries vp-rec-index" data-stage-split="row">
            <RecordIndexRow entry={entry} unread={false} onOpen={noop} />
          </ol>
          <div className="wbp-rule" aria-hidden="true" />
        </>
      )}
      <RecordEntry
        entry={entry}
        list={[entry]}
        open={0}
        epoch={epoch}
        openLink={noop}
        onOpen={noop}
        onClose={noop}
        twinEvent="wbp-inert" />
    </>
  );
}

let root = null;

/* ONE ROOT, RE-RENDERED. Not a fresh `createRoot` per keystroke: React would
   remount the tree every time, `RecordEntry`'s mount effect would fire on every
   character, and its `scrollIntoView` would fight the reader for the scroll
   position while he types. Re-rendering the same root is also what the live
   site does between walks. */
/* `opts.index === false` drops the index row. Anything else — including no
   fourth argument at all — keeps it, so an existing caller cannot lose a view
   by not having been taught about the option. */
export function render(el, entry, epoch, opts) {
  if (!root) root = createRoot(el);
  root.render(<Preview entry={entry} epoch={epoch}
                       index={!opts || opts.index !== false} />);
}

window.WBPreview = { render };
