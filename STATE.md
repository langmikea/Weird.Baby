<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
# STATE — weird-baby-museum

**What this file is now.** The registry material that had no better home: what is mothballed (source comments point here), known issues, the storefront decision, the backup standing items, a verification flag, and the durable backlog direction. It replaced a 196 KB ledger on 2026-09-02. **The ledger is kept whole, byte for byte, at `docs/archive/STATE-FULL-b0525f0.md`.** Mike's standing laws that lived only in it are now in `docs/canon/11-STANDING-RULINGS.md`, verbatim; the sealed rounds v32 to v50 and the July shipping notes are in the archive; the stale sections (a July deploy stamp, soft-launch gates, a route table naming rooms that no longer exist, a canonical-docs list naming files that moved) were not carried. **No stamp.** The tree wins; `git log` is the ledger; what is live is `docs/DEPLOYED.md`.

## Mothballed for v1

The following code paths exist in source but are deliberately not
rendered in the v1 launch. They revive post-launch. Source comments
saying "MOTHBALLED for v1 per STATE.md" point at this section.

- **Kaleidoscope** — the audio-meter control surface (knobs, switches,
  VU meters). Code preserved in `src/routes/hr/HrExhibitFlow.jsx`
  (lines 84, 167–214, 617–754, 1474) and `HrExhibitFlow.css:853`
  (the `.hr-kal-*`, `.knob-wrap`, `.hr-vu-*` rules) but never mounted.
  Decision dates to the v28 controls-dock simplification pass; revives
  when the operator chooses to re-expose audio meters post-launch.


## KNOWN ISSUES (accepted, not yet fixed)

- DECK-SCROLL-OCCLUSION — player bar hides deck bottom. Confirmed reproducing 2026-06-17. Category: minor / infrequent / consistent annoyance. PIGGYBACK when deck-area work opens the file; not pulled standalone.
- DECKBUG-FBBLOCKS — FB embed renders as black/white block. Reproduction unconfirmed.
- Inbox photo MV-HR-20260405-036 — 1 of 6 unreleased (5 released).
- Video-panel YT-thumb fallback — unclassed full-bleed img; mostly moot since albums carry art.


## STOREFRONT DECISION (settled 2026-06-23)

- **Long-term: custom domain `shop.weird.baby` wanted.** Today: URL not a factor.
- **Path:** use the existing free Quick Store now (pre-launch, near-zero traffic — no fee justified yet). Stand up **Big Cartel Platinum + attach `shop.weird.baby` at launch**, when traffic justifies the $15/mo.
- **Key fact:** Quick Store CANNOT take a custom domain ever (Printful confirmed). Big Cartel free also can't — needs Platinum ($15/mo). So custom URL = Big Cartel Platinum, full stop.
- **Durable asset insight:** the reusable work is the Printful PRODUCTS (designs/print files), portable to any storefront. The storefront is a thin wrapper, cheaply rebuilt. Quick-Store-now wastes nothing but a 10-min wrapper.
- **NEXT merch products (durable work, storefront-agnostic):** shirts, hats. Not yet built.


## BACKUP STATUS

- Off-GitHub (repo): OneDrive mirror at `~\OneDrive\_backups\weird-baby-museum\`, `753b17e`, 2026-06-17. POINT-IN-TIME (does not auto-update).
- **DB backups (MediaVault): NOW MIRRORED — 2026-07-07.** Discovery found the OneDrive DB-backup home was EMPTY (the "durable home for DB backups" was aspirational — 34 local snapshots existed only on disk). All 34 `.sqlite` backups copied + sha256-verified to `~\OneDrive\_backups\MediaVault\core\backups\` (mirrors the source tree). Critical `mediavault_pre-factscroller-20260707T020813...T202907Z.sqlite` verified (`72BF738A…`). Re-run `C:\AI\mirror_db_backups.ps1` after any new backup — it is idempotent (copies only missing/changed, verifies each).
- STANDING OPS ITEMS (not yet automated): (a) periodic re-mirror so backups stay current — now a one-command step (`mirror_db_backups.ps1`); (b) quarterly restore-drill per charter 3.4 — a backup nobody restored is a rumor.


## CANNOT-VERIFY-FROM-MUSEUM-SESSION (flag, separate pass)

- All MediaVault-repo items (C:\AI\Platform\MediaVault) — not reachable in a Museum session. Needs MV-side pass.
- Mobile UX, banner-match-nav, cover-pill render — need live narrow-width inspection.

<!-- ============================================================= -->
<!-- END LIVE LEDGER. Durable reference (pre-2026-06-17) follows.   -->
<!-- ============================================================= -->


## Decisions / closed

- COL3 FB post clip: CLOSED — ACCEPTED (2026-06-02). Logged-out-only cosmetic clip of the longest post's like/comment/share row. NOT a column bug (column is random per load); NOT an open defect. Cause = fixed-height box that never self-sizes because raw post.php sends no height. Dead-end theories + fix options recorded in docs/FINDING-fb-post-clip.md. Do NOT re-investigate as a mystery — read that doc first.


## Backlog (durable design direction)

Standing items not yet started. Day-to-day sequencing lives in
`NAVIGATION.md` / `BACKLOG.md`; these are recorded here because they are
durable direction, not session-scoped tasks.

- **Brand-aligned museum aesthetic.** All Weird.Baby infrastructure (the
  museum shell: chrome, dock, controls, frames) should mirror the W.B
  logo — 1960s black-and-white-photo appeal, typeface akin to the
  logo's font. Content shown inside (album art, video, imagery) retains
  full vibrancy and palette. Principle: **brand frames the vessel;
  content stays vivid.** (Owner: Mike, UX. Status: PASS 2 BUILT
  2026-06-07. Pass 1 [dark silver] read flat — Mike: "try light, think
  outside the box." Pass 2 concept: THE PHOTO ALBUM PAGE — shell goes
  1960s photo-paper (mat-board ground, print-stock surfaces, photo-black
  accent ramp in museum-tokens + JS mirrors), cards read as prints with
  real shadows, card meta goes typewriter, film grain washes the room
  (Exhibit.css ::after, under the lightboxes), lightboxes stay a dark
  projection booth (scoped token re-pin), video placeholders stay dark
  screens ("photos are paper; video is television"), badges pinned light
  over imagery. Fredoka wordmark trial carries over. Pass 2 accepted by
  Mike ("close enough for this pass"); PASS 2b extends the album page to
  the LOBBY (WbHome inline styles — the B&W logo now sits on its native
  paper; grain wash added) and the GIFT SHOP (GiftShop.css remap + grain)
  so the whole building reads as one stock. Deliberately untouched,
  awaiting Mike's read: variant-pill type colors, journal semantic
  green/red, per-album accents, mothballed palettes.)


## Stack

React 19, Vite 8, Cloudflare Workers, D1 (`weird-baby-db`).
Build: `npx vite build`. See OPERATIONS.md §0 DEPLOY — THE ONLY ACCOUNT.


