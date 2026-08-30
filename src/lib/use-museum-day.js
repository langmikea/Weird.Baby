// src/lib/use-museum-day.js — THE MUSEUM'S DAY, LIVE, IN A COMPONENT.
// [L-e 2026-08-30]
//
// WHY IT EXISTS. `TODAY` (src/lib/record-clock.js) is a module-load const: it
// reads the day the worker injected into THIS document and never reads it
// again. That is correct for a page that is loaded and correct for one that is
// reloaded, and it is wrong for exactly one visitor — the one whose tab was
// already open when the museum's day turned at 17:00.
//
// MEASURED, NOT PREDICTED (docs/FINDING-robots-open-consumers.md): at 17:00 on
// day one that visitor's countdown removed itself on the museum's clock while
// every other signal on the page still said the museum was shut, because all of
// them resolved against the frozen const. The countdown was the only element
// that knew the time. This hook is what the other four read instead.
//
// ═══ IT INTRODUCES NO SECOND CLOCK, AND THAT IS THE WHOLE CONSTRAINT ════════
// `museumNow()` is the server's instant, injected on this response, advanced by
// `performance.now()` — a MONOTONIC counter. The visitor's device clock cannot
// move it, forward or back. `todayInRecordTz` is the museum's own day
// derivation, 17:00 boundary included, and it already takes a `Date`. So this
// file computes nothing: it asks the two declarations the museum already has,
// once a second, and hands back a string.
//
// THERE IS NO DATE LITERAL HERE AND THERE MUST NEVER BE ONE. `RECORD_EPOCH` is
// the one declaration (Doctrine 17); a comparison written here would be the
// second, and it would agree with the first by hand until somebody moved one.
//
// ═══ THE POLL IS THE COUNTDOWN'S, AND IT IS DELIBERATE ═════════════════════
// `src/routes/WbHome.jsx` has ticked this way since 2026-08-16 and the pattern
// was measured there rather than assumed: a hidden tab's interval is throttled
// to roughly once a minute, so `visibilitychange` recomputes the moment the tab
// is shown and the visitor never reads a stale value on the first paint.
// **The value is RECOMPUTED every tick, never decremented**, so a throttled
// tick skips readings instead of drifting and the crossing still lands on time.
//
// A HOOK RATHER THAN A STORE OR A CONTEXT, on purpose. Four call sites in three
// components; a provider would put a wrapper around the whole application to
// share a string that each of them can derive for itself in one line. Same
// reasoning `use-room.js` and `use-arrival.js` already live under.
//
// SEEDED WITH `TODAY`, WHICH IS WHY THERE IS NO FLASH. The first render returns
// the value the worker injected — byte for byte what this page rendered before
// this file existed. The interval only ever moves it FORWARD, and only when the
// museum's own day has actually turned.

import { useEffect, useState } from "react";
import { TODAY, museumNow } from "./record-clock.js";
import { todayInRecordTz } from "../../reveal/record-clock.mjs";

/** the museum's day, recomputed while the page is open */
export function useMuseumDay() {
  const [day, setDay] = useState(TODAY);

  useEffect(() => {
    const tick = () => {
      const now = todayInRecordTz(new Date(museumNow()));
      /* setState with an unchanged string is a no-op React bails out of, so
         this is a comparison React makes rather than one written here. */
      setDay(now);
    };
    /* once on mount: a tab restored by the browser can run this effect long
       after the document was fetched, and the seed above is that fetch's day. */
    tick();
    const id = setInterval(tick, 1000);
    const onShow = () => { if (!document.hidden) tick(); };
    document.addEventListener("visibilitychange", onShow);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onShow);
    };
  }, []);

  return day;
}
