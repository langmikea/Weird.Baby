/* MUSEUM TOKENS, FOR JAVASCRIPT — the other half of museum-tokens.css.
 *
 * WHY THIS FILE EXISTS (R3, from docs/SITE_TEMPLATE_AUDIT-20260729.md in the
 * robots repo). The museum's palette lived in CSS custom properties, which
 * inline styles cannot read. So every surface that builds inline styles
 * re-declared the palette in JS and kept it in sync BY HAND:
 *
 *   HrExhibitFlow.jsx   12 consts, comments literally reading "synced to
 *                       --wb-gold-hi", "synced to --wb-dim"
 *   RobotsExhibitFlow.jsx  6 var(--wb-*, #hardcoded) fallbacks — and its
 *                       fallbacks were the PREVIOUS gold-on-dark palette, so
 *                       they were not just duplicated, they were stale
 *
 * That is two mirrors and counting, and the third would have arrived with the
 * container model's universal viewer. This file is the one JS source they all
 * read instead.
 *
 * THE CONTRACT: these values MUST equal the :root block in
 * museum-tokens.css. They are not derived from it at build time (that would
 * need a CSS parser in the build, which is not worth a dependency for 16
 * values) — they are its pair. Change one, change the other.
 * Verified equal at creation, 2026-07-29, value for value.
 *
 * The CSS file remains the source of truth for anything CSS can express.
 * Reach for this ONLY from inline styles.
 */

export const T = {
  /* surfaces — the photo-paper elevation ladder */
  bg:         "#d9d5ca",   /* --wb-bg          mat board, the room  */
  ink:        "#ece9e0",   /* --wb-ink         print stock          */
  inkSoft:    "#e2ded3",   /* --wb-ink-soft                        */
  inkCard:    "#faf8f3",   /* --wb-ink-card    a print             */
  inkCardHi:  "#ffffff",   /* --wb-ink-card-hi a lifted print      */

  /* edges */
  border:     "#c6c2b7",   /* --wb-border      */
  borderHi:   "#a9a59a",   /* --wb-border-hi   */

  /* the accent ramp: mute -> lo -> gold -> hi (photo-black, not gold, since
     the 2026-06-07 B&W rework; the token names are historical) */
  goldMute:   "#9b978d",   /* --wb-gold-mute   */
  goldLo:     "#57544d",   /* --wb-gold-lo     */
  gold:       "#211f1c",   /* --wb-gold        photo black         */
  goldHi:     "#000000",   /* --wb-gold-hi     deepest tier        */
  dim:        "#3b3933",   /* --wb-dim         body copy           */

  /* type */
  serif:      "'DM Serif Display', Georgia, serif",              /* --wb-serif */
  sans:       "'Syne', system-ui, -apple-system, sans-serif",     /* --wb-sans  */
  mono:       "'Courier Prime', 'Courier New', monospace",        /* --wb-mono  */
  brand:      "'Fredoka', 'Baloo 2', 'Quicksand', system-ui, sans-serif", /* --wb-brand */
};

export default T;
