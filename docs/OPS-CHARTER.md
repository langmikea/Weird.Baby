# OPS CHARTER — Weird.Baby

**Owner of this document:** Claude (Ops)
**Authority boundary:** Mike owns UX and all product/voice/scope decisions. Claude owns everything else — repository accuracy, completeness, maintenance, backups, documentation, and not letting the project rot or lose data.
**Execution surface:** Written in chat for review; executed by Code, on Mike's host, which has the filesystem and git access a chat session does not. Chat defines the standard; Code enforces it. Mike alone commits, pushes and deploys.
**Status:** v1.0 — draft for Mike's review.

---

## 0. The one job

Prevent the "oh shit, that's REALLY bad" moment. Everything below is in service of that. The three things that actually cause it:

1. **Data loss** — a backup that wasn't running, a ledger that lived in one place, a force-push that ate history.
2. **Silent drift** — the docs say one thing, the deployed site does another, and nobody knows which is true until it breaks.
3. **Clutter-induced failure** — real information buried in debris until someone edits the wrong file, ships a scratch file, or trusts a stale note.

Each section maps to one of these.

---

## 1. Source of truth & drift control

**Problem addressed:** silent drift.

- **`STATE.md` is the single source of truth** for project state. If it disagrees with reality, that is a bug to fix immediately, not a note to leave.
- **One canonical `STATE.md`**, at a known path: `STATE.md` at the museum repo root. (The `weird_baby` vs `-update` two-tree question this line once posed is long settled — one tree.)
- **STATE.md required sections:**
  - `LIVE` — what is deployed and working right now, per route.
  - `IN PROGRESS` — what is actively being built, with enough detail to resume cold.
  - `BLOCKED` — anything waiting on Mike or an external thing (e.g., the watermarked `museum.jpg` placeholder).
  - `NEXT` — the ordered queue.
  - `KNOWN ISSUES` — accepted-but-not-yet-fixed problems.
  - `LAST UPDATED` — date + what changed.
- **Update cadence:** STATE.md is updated at the *end of every working session that changes anything*, before the session closes. A session that touched code and didn't touch STATE.md is an incomplete session.
- **Route table** lives in STATE.md and lists every route, its status (LIVE / STUB / REDIRECT), and its component. Currently: `/` → `/hr`; `/hr` LIVE; `/hr/media` stub; `/hr/archive` LIVE; `/hr/fan-wall` stub; `/hr/workshop` stub; `/hr/workshop/lyric-map` LIVE; `/hr/merch` redirect. **The Drawing adds `/drawing` — add it as a planned route now so it's tracked before it's built.**

---

## 2. Repository hygiene — real vs. debris

**Problem addressed:** clutter-induced failure.

The failure mode is real information sitting next to junk until someone trusts or ships the junk. Rules:

- **`.gitignore` is authoritative and complete.** Build output (`dist/`), `node_modules/`, local env files, OS cruft (`.DS_Store`, `Thumbs.db`), editor folders, and **anything containing a plaintext secret** never enter the repo. Code audits the tree against this.
- **Scratch ≠ committed.** Experimental files, dead code, "old" copies, and one-off scripts do not live beside production source. A `scratch/` or `_archive/` directory that is gitignored is fine; littering `App.old.jsx` next to `App.jsx` is not.
- **The multi-artist lyric data** (`bd_data.js`, `tp_data.js` — Bob Dylan, Tom Petty) is the live example of this tension: deployed site shows Hunter Root only, but the full set is kept for Mike. Decision to record in STATE.md: is the full set kept *in the repo* (and just hidden in the UI), or kept *local-only*? Whichever — it must be **documented as a deliberate choice**, not left as ambiguous debris.
- **No secret ever in the repo or in client code.** The Drawing's plaintext codes exist only in the HTTP response at issuance (per the raffle spec); the repo and the Worker store hashes only. Code verifies no code, ledger, or `.env` with secrets is tracked.
- **One project, one tree.** If there are two project directories (`weird_baby` and `weird-baby-update`), one is canonical and the other is archived or deleted with a tombstone note. Two live trees is how you edit the wrong one at 1 a.m.

---

## 3. Backups — the thing that saves you

**Problem addressed:** data loss. This is the section that matters most.

Three distinct things need backing up, and they are not the same:

### 3.1 Code / repo
- **Primary:** GitHub (`langmikea/Weird.Baby`). Git history *is* the backup, provided history isn't rewritten.
- **Rule:** no force-push to the main branch, ever. Mistakes are fixed with new commits, not by rewriting history.
- **Off-GitHub copy:** at least one full clone exists somewhere that isn't GitHub and isn't the working machine's primary disk (external drive or second cloud). GitHub is a service, not a guarantee.

### 3.2 The Drawing — hash table (the irreplaceable thing)
- The hash table **is the ledger**. It contains no secrets (hashes only), so backing it up is safe and there is no excuse not to.
- **Exported on every series open and every series close**, minimum. Export = D1 dump or KV export to a dated file: `drawing-S1-open-2026-07-01.json`, `drawing-S1-close-…`.
- Stored in **two places**, at least one off the Cloudflare account.
- **If this table is lost, every outstanding ticket becomes unverifiable and the drawing is void.** That is the literal "REALLY bad" scenario for this feature. Treat the backup as non-optional.

### 3.3 Content / artifacts (forward-looking, for the Discovery system)
- The artifact collection (2,000+ objects per that spec) and its metadata will be the museum's actual *content* — the irreplaceable human-curated layer. When that system is built, its data store gets the same two-location backup discipline. Flagged now so it isn't an afterthought later.

### 3.4 Verification
- A backup nobody has restored is a rumor. **Once per quarter, do a restore drill:** pull the off-site repo clone and confirm it builds; load a hash-table export into a scratch D1 and confirm a known code verifies. Record the drill date in STATE.md.

---

## 4. Documentation

**Problem addressed:** drift + onboarding-cold-start.

- **`START_HERE.txt` / session-bootstrap** stays accurate: it should tell a fresh session exactly what to read and in what order to reach full context. If the read-order changes, this file changes.
- **Specs live in the repo**, in a known `docs/` location, versioned. The Drawing spec (v1.1) and the Discovery spec belong there, not loose in a chat history. This charter goes there too.
- **Decisions get recorded where they'll be found.** A choice made in chat that isn't written into STATE.md or a doc effectively didn't happen — the next cold session won't know it.
- **Each spec carries its status** (draft / ready / building / shipped) so nobody builds from a superseded version.

---

## 5. Deploy & change safety

**Problem addressed:** shipping the wrong thing.

- **Known blockers ship as blockers, not surprises.** The watermarked `museum.jpg` is the current example — it's in STATE.md `BLOCKED`, and the site does not go to real visitors with it. Anything similar gets the same treatment.
- **The Mike-only unlock convention** (the key-combo that reveals the full artist switcher) is *documented*, low-security-by-design, and explicitly noted as such — so a future session doesn't "discover" it and treat it as a vulnerability or rip it out.
- **Before a deploy that touches visitors:** STATE.md `LIVE` section is updated to match what's about to be true, not what was true.

---

## 6. What Claude (Ops) does, concretely

- Maintains STATE.md accuracy and enforces the update cadence.
- Audits the tree for debris and secrets; keeps `.gitignore` complete.
- Owns the backup routine: defines it, scripts it, verifies it runs, runs the quarterly restore drill.
- Keeps docs and specs versioned and findable.
- Raises the flag *early* when something is drifting toward "REALLY bad" — before it gets there, not after.
- Does the above **against the real files in the working tree**, never against memory or a Drive copy.

## 7. What Claude (Ops) does NOT do

- UX, voice, scope, product decisions — Mike's, untouched.
- Anything destructive without surfacing it first: no history rewrites, no hard deletes of ambiguous files, no killing a second project tree until Mike confirms which is canonical.

---

## 8. First run — ordered checklist (done; kept as the record)

1. Resolve canonical project tree (`weird_baby` vs `weird-baby-update`); tombstone the other.
2. Locate and confirm the one true `STATE.md`; reconcile it to the actual deployed state and the route table.
3. Audit `.gitignore`; confirm no secrets, build output, or debris are tracked; fix.
4. Decide + document the multi-artist data's home (in-repo-hidden vs local-only).
5. Stand up the off-GitHub repo clone (backup location 1).
6. Create `docs/`; move The Drawing spec, the Discovery spec, and this charter into it, versioned.
7. Add `/drawing` to the route table as a planned route.
8. Write the hash-table export/backup routine (even though The Drawing isn't built yet — the routine exists before the data does).
9. Record a `LAST UPDATED` in STATE.md and a first restore-drill due date.

---

*Review this, change what's wrong, and it becomes the standing instruction set for Ops. Enforcement happens in the tree.*
