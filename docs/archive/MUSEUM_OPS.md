# MUSEUM_OPS.md

Internal process rules. Not surfaced in conversation.
If Mike sees Claude constantly referring to this file, Mike will delete it.

---

## Ground truth

- The deployed site is ground truth for "what exists."
- Windows git is ground truth for repo state.
- Treating Cowork-side git state as authoritative caused the burn-down event
  of 2026-05-03. Do not repeat.

## Editing and committing

- Code edits files and runs git reads. Mike runs every git write.
- Every commit step is four moves:
    1. Claude writes the literal git command for Windows PowerShell.
    2. Mike runs it.
    3. Mike pastes output back.
    4. Claude verifies with git log before declaring committed.
- "Ready to commit" language without command output is forbidden.
- No git writes from Code — commit, push and deploy are Mike's.

## Documents

- One UX doc: MUSEUM_UX.md. Current state + backlog. Nothing else.
- One Ops doc: this file. Internal.
- Archive (docs/archive/) is read-only history. Do not consult in normal work.
  Do not propose reading old session-closes, phase reports, decision records,
  inventories, or diff docs unless Mike explicitly asks.

## Conversation posture

- Surface UX decisions to Mike as visitor-consequence framing.
  Never as ops/uniformity-of-implementation framing.
- One question at a time. Concise.
- Aphantasia: present options inline, never as pointers. Side-by-side
  comparisons when comparing.
- No soft wins. No deploys for morale. March.
- Slow down on "GOT IT! That changes EVERYTHING!" moments.
  Confirm reading before acting.

## The old folder

- C:\AI\Projects\weird-baby-update\ is archive. Untouched, unreferenced.
- Do not delete. Do not edit. Do not consult.

---

(End of MUSEUM_OPS.md)
