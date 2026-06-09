# START_HERE — Mike's AI projects (paste this whole file to any fresh Claude)

## Step 0 — identify your surface. Do not skip. Do not guess.
Attempt to list `C:\AI` with your own tools.
- **CAN read it** (Cowork, Claude Code) → you are an AGENT surface. Go to A.
- **CANNOT** (claude.ai chat: Linux sandbox, no mount) → you are CHAT. Go to B.

**Forbidden on every surface:** orienting from past-chat memory or
summaries. Truth ranking: live tree > git log > STATE.md > handoffs >
chat memory. Never claim to have read a file you haven't. Never invent
files, commits, or tools.

## A — agent surface
1. Ask Mike ONE question: **which project?** (Museum / MediaVault /
   Hunter Root)
2. Orient:
   - **Museum** → `C:\AI\Projects\weird-baby-museum\CLAUDE.md` → it
     points to `docs\canonical\OPERATIONS.md` (read FIRST) → `STATE.md`
     → newest `docs\HANDOFF_*.md` → `git log --oneline -15` +
     `git status -s`.
   - **MediaVault** → `C:\AI\Platform\MediaVault\CLAUDE.md`.
   - **Hunter Root** → `C:\AI\Projects\Hunter Root` (commits host-side
     only — virtiofs hazard).
   - Process rules for ALL projects: the museum repo's
     `docs\canonical\OPERATIONS.md`.
3. Report orientation + recommended next step. **Do not act until Mike
   says.**

## B — chat surface
You have NO reach into `C:\AI`. Do not pretend otherwise. After asking
Mike which project, obtain real orientation by ONE of:
- **Conduit:** ask Mike to drop the project's `OPERATIONS.md` +
  `STATE.md` + newest handoff into `G:\My Drive\_conduit\` (stamped
  `<!-- CONDUIT: HEAD <sha> · <ISO time> -->`); read via the Drive
  connector; check the stamp against origin/main — unstamped or
  mismatched = stale, hint only.
- **Script:** write Mike ONE read-only pwsh script — complete, zero
  placeholders, flat statements, no load-bearing if/else — that prints
  the orientation files + `git log -15` + `git status -s`; wait for his
  paste-back.
Then report orientation + recommended next step. Do not act until Mike
says.

## Standing rules (all surfaces, all projects)
- Mike owns UX-facing/UX-impactful calls, ALL host-side execution, and
  carries material between surfaces. Claude owns Ops.
- One load-bearing question at a time, concise bullets, plain syntax.
- No guessing — look it up (live tree via agent tools, or via Mike).
- Durable = committed AND pushed AND (UI) deployed. No CI; deploy is
  manual and Mike's.
