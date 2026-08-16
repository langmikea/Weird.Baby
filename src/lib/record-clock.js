// src/lib/record-clock.js — THE RECORD'S CLOCK, AT THE GLASS. [CH5 2026-08-12]
//
// MIKE: Record n goes out on Day n. The site reads the clock at REQUEST time.
//
// ═══ THE DATE COMES FROM THE WORKER, NOT FROM THE BROWSER ═══════════════════
// `src/worker.js` injects `window.__WB_TODAY__` into the document head on every
// HTML response, so it is set before this bundle's first line runs and the page
// needs no round trip and no loading state.
//
// IT IS NOT `new Date()` HERE, AND THAT IS THE POINT. A browser clock belongs to
// the visitor: it can be wrong by accident (a laptop back from a trip) or on
// purpose (set the clock forward, read Friday on Monday). The clock that decides
// what the museum has published is the museum's, and it lives on the server.
//
// ═══ WHAT THIS DOES *NOT* DO, WRITTEN DOWN RATHER THAN IMPLIED ══════════════
// **THE FUTURE ENTRIES ARE STILL IN THIS BUNDLE.** `robots.js` imports
// `RECORD_ENTRIES` statically, so every entry — including days that have not
// happened — is compiled into the chunk this file ships in, and a visitor who
// opens devtools can read all of them. This filter governs what the page DRAWS;
// it is not concealment.
//
// THAT IS A KNOWN AND ACCEPTED LIMIT, NOT AN OVERSIGHT. Mike's ruling of
// 2026-08-12: the page must be right for Monday now, and the entries move out of
// the bundle to a worker-served endpoint as their own packet. Until that lands,
// the honest description of this mechanism is *"the Record does not show you the
// future"*, never *"the future is not there"*. Open row `CH5-a`.
//
// The asset half (A3) has no such hole: `src/worker.js` refuses the FILE a future
// entry names, and a file the worker refuses is not in the page at all.

import { RECORD_TZ, visibleEntries } from "../../reveal/record-clock.mjs";
import { STAGE } from "./placement.js";

/* Read once, at module load, from what the worker injected. `globalThis` rather
   than `window` so this module is importable by a non-DOM reader (the gates and
   the dictation preview both parse it). */
const G = typeof globalThis === "undefined" ? {} : globalThis;

/** the day the SERVER says it is, or null when nothing injected one */
export const SERVER_TODAY =
  typeof G.__WB_TODAY__ === "string" && /^\d{4}-\d{2}-\d{2}$/.test(G.__WB_TODAY__)
    ? G.__WB_TODAY__
    : null;

/** true when this visitor holds the admin preview cookie (A4) */
export const PREVIEWING_ALL = G.__WB_RECORD_ALL__ === true;

/* ── THE FALLBACK, AND WHY IT LEANS THE WAY IT DOES ─────────────────────────
   Three cases, and only the third is a judgement call:
     1. PREVIEWING     Mike's code is in play — everything, always.
     2. DEVELOPMENT    everything. This is the museum's own standing rule
                       (`reveal/stage.mjs`): during development, show everything
                       that is PLACED, because Mike cannot direct what he cannot
                       see. A date filter running against him on his own machine
                       is the same defect the stage rule was written to fix, and
                       `npm run dev` serves no worker to inject a date anyway.
     3. LAUNCH, no injected date — a worker that did not run, or ran and did not
                       inject. It falls back to the BROWSER's clock in the
                       Record's own timezone. That is spoofable, and it is still
                       the right fallback: the alternative is a live museum whose
                       Record is blank because one header went missing. Showing
                       up to today by a clock a visitor could lie about is a
                       smaller failure than showing nothing to everybody. */
const browserToday = () => {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: RECORD_TZ, year: "numeric", month: "2-digit", day: "2-digit",
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
};

/** the day this page is being read on, as the museum reckons it */
export const TODAY = SERVER_TODAY || browserToday();

/* ═══ [2026-08-16] THE MUSEUM'S CLOCK TO THE SECOND ═════════════════════════
   The lobby countdown needs an instant; `TODAY` above is a DAY. `__WB_NOW__` is
   the server's `Date.now()` at the moment it rendered this page, injected in
   the same `<script>` as the date.

   THE BROWSER MEASURES ONLY *ELAPSED* TIME, WHICH IS NOT THE SAME AS TRUSTING
   IT WITH THE TIME. The origin is the server's; `performance.now()` is a
   MONOTONIC counter of milliseconds since this document started, so it cannot
   be moved by the visitor changing their clock, by a timezone change, or by an
   NTP correction mid-visit. `Date.now()` would have all three problems and is
   deliberately not used for the tick.

   THE FALLBACK IS `Date.now()` AND IT IS THE HONEST ONE. If nothing injected an
   instant — a worker that did not run, or `npm run dev` with no worker at all —
   the alternative to the visitor's clock is no countdown, and a lobby whose
   headline object is missing is a worse failure than one that could be spoofed.
   `SERVER_NOW === null` is exposed so a caller can tell the two apart. */
const MONO_ORIGIN =
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now() : null;

/** the server's instant at render, or null when nothing injected one */
export const SERVER_NOW =
  typeof G.__WB_NOW__ === "number" && Number.isFinite(G.__WB_NOW__)
    ? G.__WB_NOW__
    : null;

/** epoch-ms as the museum reckons it, right now */
export function museumNow() {
  if (SERVER_NOW === null || MONO_ORIGIN === null) return Date.now();
  return SERVER_NOW + (performance.now() - MONO_ORIGIN);
}

/** true while every entry is shown regardless of its date */
export const showingAll = () => PREVIEWING_ALL || STAGE !== "launch";

/** the entries this page may draw */
export function recordEntriesForToday(entries) {
  return visibleEntries(entries, TODAY, showingAll());
}
