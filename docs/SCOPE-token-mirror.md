# SCOPE — token-mirror fix (read-only diagnosis)

**Written:** 2026-06-09 · **Repo HEAD:** `e4db90c` · **Mode:** read-only, no source touched
**Triggered by:** handoff `77e18b0` ("token-mirror fix next") — chat can't reach the repo, so this records real state before any edit is scoped.

> **STATUS: fix landed (uncommitted) — 2026-06-09.** Mike chose **Path (A)** ("match the shaded look"). The three drifted JS constants in `HrExhibitFlow.jsx` (`GOLD_HI`, `GOLD_LO`, `DIM`) were synced to the canonical `--hr-*` ramp read live from `museum-tokens.css`: `GOLD_HI #211f1c→#000000`, `GOLD_LO #211f1c→#57544d`, `DIM #211f1c→#3b3933`. `museum-tokens.css` untouched (canonical, off-limits). `npx vite build` passes clean; `/hr` deck verified — JS-painted tabs/pills/counts now read on the same differentiated ramp as the CSS-painted half. CLAUDE.md token table (§5.1 trap) re-pointed at `museum-tokens.css` instead of duplicating stale values. **Not committed, not deployed** — left for Mike.

---

## 1. What the handoff and NAVIGATION say

**`docs/HANDOFF_next_session.md`** (refreshed in `77e18b0`) names the fix verbatim:

> Key finding: JS token mirrors at `HrExhibitFlow.jsx:109-122` flatten the photo-black ramp to one tone (#211f1c) and inline `S.*` styles do not track CSS token edits.

> Scope + build the **token-mirror fix** (foundation before aesthetics). BLOCKED ON one open UX question to Mike, asked but not yet answered:
> - Deck chrome: (A) join the page's tonal ramp (more hierarchy), or (B) stay deliberately flat black (fix propagation only, pixel-identical). Get the answer FIRST; A and B are different edits.

**`NAVIGATION.md`** does not mention the token-mirror fix at all. Its "Current state and what's next" section (Updated 2026-05-18) is about the data-architecture BUILD phase (§12 criteria, 8/8 complete) — a *different and older arc* than the UX-overhaul arc the handoff tracks. No conflict; the two docs cover different workstreams. NAVIGATION is stale relative to the June UX work and does not need to be reconciled for this fix. (Flagging the staleness, not actioning it.)

---

## 2. Canonical vs. mirror — which file is the source of truth

| Role | File | Authority |
|---|---|---|
| **Canonical** | `src/styles/museum-tokens.css` — the `--hr-*` custom properties | Header says "Source of truth for the museum's visual language." `CLAUDE.md` lists it as **off-limits** ("only touch with explicit UX direction"). |
| **Mirror (CSS-consumed)** | `src/routes/hr/HrExhibitFlow.css` | Consumes the tokens via `var(--hr-*)`. Uses the **full differentiated ramp** (`--hr-gold-hi`, `--hr-gold-lo`, `--hr-dim`, `--hr-gold` all appear). In sync with canonical by construction. |
| **Mirror (JS — the suspect)** | `src/routes/hr/HrExhibitFlow.jsx:109-122` | Hand-copied JS constants (`INK`, `BORDER`, `GOLD*`, `DIM`…) that the `S.*` inline-style builders read. Comment at line 106-108 states they "mirror the `--hr-*` CSS variables." **This is where the drift lives.** |

So: **museum-tokens.css is canonical; the JS constant block in HrExhibitFlow.jsx is the mirror that has drifted.**

### The drift is visible on screen *today*
The HR deck paints from **two systems at once**: elements styled by CSS class (`HrExhibitFlow.css`) get the real photo-black ramp (black titles, gray meta, dim eyebrows), while elements styled by JS inline `S.*` (tabs, pills, counts, dividers) get everything collapsed to a single `#211f1c`. The two halves of the same deck disagree. This is not a latent/theoretical mirror — it is a live inconsistency.

---

## 3. Mismatch table — JS constant vs. canonical token

Actual current values (read from source, **not** from the CLAUDE.md table, which is itself stale — see §5).

| JS constant (`HrExhibitFlow.jsx`) | line | JS value | Canonical token (`museum-tokens.css`) | token value | Match? |
|---|---|---|---|---|---|
| `INK` | 109 | `#ece9e0` | `--hr-ink` | `#ece9e0` | ✅ |
| `INK_SOFT` | 110 | `#e2ded3` | `--hr-ink-soft` | `#e2deD3` | ✅ (case-only) |
| `INK_CARD` | 111 | `#faf8f3` | `--hr-ink-card` | `#faf8f3` | ✅ |
| `INK_CARD_HI` | 112 | `#ffffff` | `--hr-ink-card-hi` | `#ffffff` | ✅ |
| `BORDER` | 113 | `#c6c2b7` | `--hr-border` | `#c6c2b7` | ✅ |
| `BORDER_HI` | 114 | `#a9a59a` | `--hr-border-hi` | `#a9a59a` | ✅ |
| `GOLD` | 118 | `#211f1c` | `--hr-gold` | `#211f1c` | ✅ |
| **`GOLD_HI`** | 119 | `#211f1c` | `--hr-gold-hi` | `#000000` | ❌ **DRIFT** |
| **`GOLD_LO`** | 120 | `#211f1c` | `--hr-gold-lo` | `#57544d` | ❌ **DRIFT** |
| `GOLD_MUTE` | 121 | `#9b978d` | `--hr-gold-mute` | `#9b978d` | ✅ |
| **`DIM`** | 122 | `#211f1c` | `--hr-dim` | `#3b3933` | ❌ **DRIFT** |

**Three constants have drifted: `GOLD_HI`, `GOLD_LO`, `DIM`** — all three collapsed to the single primary-accent tone `#211f1c`, while the canonical ramp differentiates them (deepest `#000000` → primary `#211f1c` → dim `#57544d`; body `#3b3933`). The inline JS comments (lines 119-122) confirm this is a deliberate "single-accent-tone call carried over from the gold era," not an accidental typo.

Notes:
- `--hr-ink-soft` is written `#e2deD3` in the CSS (mid-string capital D); JS has `#e2ded3`. Hex is case-insensitive — renders identically. Cosmetic only, not a real mismatch.
- `--hr-bg` (`#d9d5ca`, the mat-board page ground) has **no** JS mirror. Expected: the deck JS never paints the page ground (the room does, via `Exhibit.css`). Not a drift.

### Where the three drifted constants actually paint (UX surface area)
`GOLD_HI` / `GOLD_LO` / `DIM` are used across the deck's inline styles — they are not dead:

| line | element | uses |
|---|---|---|
| 317-318 | tab strip | border + text: `active ? GOLD_HI : GOLD_LO` / `: DIM` |
| 347 | divider gradient | `GOLD_LO` |
| 367, 383 | pill text | `active ? GOLD_HI : …` |
| 397 | (toggle) | `on ? GOLD_HI : DIM` |
| 406 | count text | `on ? GOLD : GOLD_LO` |
| 418, 425 | controls/labels | `empty ? GOLD_MUTE : DIM`, `primary ? GOLD : DIM` |
| 440 | small label | `active ? GOLD_HI : GOLD_LO` |
| 2696-2697, 3569 | dashed-box / misc | `GOLD_HI` |

(`GOLD` itself is unchanged at `#211f1c`, so lines using `GOLD` — 406, 425, 1169 — are not affected; only the three drifted constants change.)

---

## 4. Fix classification — **NOT mechanical; UX-visible; blocked on Mike**

This is the crux. Syncing the three drifted JS constants to the canonical ramp **changes pixels on screen** — the deck's JS-painted tabs/pills/counts would go from flat `#211f1c` to the differentiated ramp (`GOLD_HI → #000000`, `GOLD_LO → #57544d`, `DIM → #3b3933`), gaining the same hierarchy the CSS-painted half already shows.

That is precisely the A/B decision the handoff flagged as **asked-but-unanswered**:

- **Path (A) — join the ramp.** Sync JS `GOLD_HI/GOLD_LO/DIM` to the canonical CSS values. Result: the whole deck reads on one differentiated ramp; JS half stops disagreeing with the CSS half. **Visible change.** Mechanical to *execute* (three string edits), but it is a real visual edit, not a no-op.
- **Path (B) — stay flat black.** Keep the deck's accent visually flat `#211f1c`. This is *not* a no-op either: today the **CSS half already renders the differentiated ramp**, so achieving a truly flat deck would mean changing the canonical/CSS side (the off-limits file) to flatten `--hr-gold-hi/-lo`/`--hr-dim` — or rewiring the JS to reference vars while the vars stay flat. Pixel-identical-to-today on the JS half means leaving the divergence in place.

Either path is a deliberate design call with on-screen consequences. **Do not proceed until Mike answers A vs. B.** A and B are different edits and touch different files (B may require touching the off-limits canonical file).

---

## 5. Blockers / things that complicate a clean fix

1. **The `CLAUDE.md` "Design tokens" table is a third, fully-stale mirror.** It documents `INK #080808`, `INK_SOFT #0d0d0d`, `BORDER #1a1a1a`, `GOLD… #b8974a` — the *pre-graphite, pre-photo-album dark+gold* palette. None of those values exist in the live JS anymore. Anyone scoping from CLAUDE.md alone (as chat would) would target the wrong values entirely. The table needs a doc-only refresh, but that is out of scope here (read-only; and CLAUDE.md is not source).

2. **The flat-tone collapse may be intentional, not drift.** The JS comments (lines 115-122) attribute the single-tone accent to a deliberate 2026-06-07 "PASS 2" call by Mike ("Single-tone pattern preserved"). So we cannot tell from code alone whether the canonical ramp or the flat JS represents Mike's *current* intent — exactly why this is a question, not a mechanical sync. **This is the core open question.**

3. **`museum-tokens.css` is off-limits.** Path (B) likely requires editing it. That needs explicit UX direction from Mike per CLAUDE.md.

---

## 6. Out of scope for the token-mirror fix (but found during the hex sweep)

The `src/` hex sweep surfaced other hardcoded color literals. **None are part of the HrExhibitFlow ↔ museum-tokens mirror** and none should be touched under this fix — listing so Mike can decide whether scope widens later:

- **`WbHome.jsx`** — paints the photo-album palette as **raw hex literals** (`#d9d5ca`, `#ece9e0`, `#c6c2b7`, `#211f1c`, `#57544d`, `#9b978d`, `#a9a59a`, `#faf8f3`). Currently matches the tokens, but it is a *fourth* un-wired mirror — a latent drift source if the tokens ever change.
- **`WbAdmin.jsx`** — still on the **old dark+gold** palette (`#050505`, `#b8974a`, `#1a1a1a`…). Admin route; never reworked to paper. Plausibly intentional (a dark operator tool), but it is no longer aligned with any current token.
- **`HrArchive.jsx`, `HrHome.jsx`** — still on the **old warm-amber/dark** palette (`#0e0b06`, `#c8a050`, `#4a3a18`…). The June photo-album rework reached the deck + WbHome but not these HR sub-routes.
- **`Exhibit.jsx`** — per-variant `TYPE_META` colors (`official #b8974a`, `live #4a8a6a`…), album-accent fallback `#b8974a`, and dark coverflow gradients (`#0c0c0c`/`#050505`). The variant colors are a semantic system, not a token mirror; the dark gradients are old-palette and may or may not be intended behind album art.

These represent a broader "palette not fully migrated / multiple un-wired color copies" pattern consistent with the repo's recurring "single source of truth, retire the copies" theme — but they are **separate work items**, not the token-mirror fix.

---

## 7. Open questions for Mike

1. **A or B?** Deck accent chrome: (A) sync JS `GOLD_HI/GOLD_LO/DIM` to the canonical ramp (`#000000 / #57544d / #3b3933`) so the JS-painted half matches the CSS-painted half — a visible hierarchy change; or (B) keep the deck flat `#211f1c` — which requires flattening the canonical/CSS ramp (off-limits file) to actually be consistent. **This gates everything.**
2. If **(A)**: confirm the canonical ramp values are the intended targets (`--hr-gold-hi #000000`, `--hr-gold-lo #57544d`, `--hr-dim #3b3933`) and that the visible change to tabs/pills/counts is wanted.
3. If **(B)**: you'll be authorizing an edit to the off-limits `museum-tokens.css`. Confirm.
4. **CLAUDE.md token table** (§5.1) is stale — want it refreshed to current values as part of this, or tracked separately?
5. **Scope width:** token-mirror fix limited strictly to the HrExhibitFlow ↔ museum-tokens pair (recommended), or widen to the un-wired literals in §6 (WbHome / WbAdmin / HrArchive / HrHome / Exhibit)?

---

## Constraints honored
Read-only: no source files were modified. No vocabulary invented; no new color names or shades introduced (CANONICAL_VOCABULARY + the "single canonical gold/accent" note respected). `museum-tokens.css` not touched. No commit made.
