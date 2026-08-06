/* ===========================================================================
   THE LEDGER'S PUBLIC PROJECTION — four fields, and the rest never leaves.
   [H1 2026-08-06 — found while proving the Portal hold]
   ---------------------------------------------------------------------------
   `src/lib/reveal.js` imports `reveal/ledger.json` so `/foundation` can draw a
   LIVE / NOT BUILT column off it. That import puts THE WHOLE TABLE in a public
   chunk, and the whole table is 162 rows of `name`, `where`, `deps` and `note`
   — which is the file whose own header calls it "where this house keeps things
   it holds and does not show."

   MEASURED ON THE BUILT BUNDLE, BEFORE THIS EXISTED: the public chunk carried
   the Portal's engravings (STANDBY · COLD START · TEST BENCH · AUTO MAINT ·
   FEED ARMED) on the day the Portal was held, the twin's address 67 times, and
   both of the eggs whose ONLY WRITTEN FORM IS THIS TABLE — `egg.channels`, the
   whole reason the drum starts at 3, and `egg.niac.operator`, an inventory of
   ten unpublished photographs of a figure nothing in the museum shows. Every
   one of them was readable in a browser by anybody who opened the file.

   IT IS `src/lib/reveal.js`'s OWN DOCTRINE, BROKEN BY ITS OWN IMPORT. That file
   says, in capitals, that the ledger returns STATE and never WORDS — the reason
   given is provenance, that a printed letter arriving from an unswept file
   leaves the boundary. The reasoning was right and the enforcement was the
   FUNCTION SIGNATURE: `stateOf()` returns a state, so no page prints a note.
   But a bundle does not ship signatures. It ships the file.

   SO THE STRIP HAPPENS AT THE BOUNDARY, AND THE ALLOWLIST IS THE WHOLE OF IT.
   Four fields, because four is what `src/` reads: `id` (the key), `build` and
   `state` (the two things every exported function answers with) and `shown`
   (which nothing reads today and is one bit, kept because it is the difference
   between a gap and a debt and a surface asking for it should not need a build
   change). NOT an exclusion list — a deny-list grows a hole the day somebody
   adds a field, and the field they add will be the interesting one.

   ONE RULE, TWO CALLERS, per Doctrine 17 and exactly the shape `stripVaultAudio`
   takes: this function is pure and importless, the BUILD caller is the
   `reveal-ledger-public` plugin in `vite.config.js` at `enforce: "pre"` (so it
   sees the raw JSON before vite turns it into a module), and `reveal:check`
   calls it to prove it still drops what it claims to.
   =========================================================================== */

/** the only fields any module under `src/` may see */
export const PUBLIC_FIELDS = ["id", "build", "state", "shown"];

export function publicLedger(json) {
  const rows = Array.isArray(json && json.rows) ? json.rows : [];
  return {
    /* the meta block goes too. It carries a generated-at stamp and a row count,
       neither of which any surface asks for. */
    rows: rows.map(r => {
      const out = {};
      for (const k of PUBLIC_FIELDS) out[k] = r[k] ?? null;
      return out;
    }),
  };
}
