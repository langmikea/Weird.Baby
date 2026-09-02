# RESET_PROTOCOL — Weird.Baby Museum

**Filed:** 2026-05-02 (Phase 0)
**Status:** active

---

## Self-containment statement

This project is self-contained. It does not depend on `C:\AI\` root or
any sibling project for orientation, build, deployment, or continued
work. A fresh AI session opening only this project folder
(`C:\AI\Projects\weird-baby-museum\`) can read `CLAUDE.md` and
`NAVIGATION.md`, follow their pointers, and proceed without reading
anything outside this folder. If
a doc inside this project ever points at `C:\AI\` root or any sibling
project, that's a bug — fix the pointer or pull the dependency in.

---

## Canonical docs (authoritative copies live in this project)

The four north-star architecture docs that the museum treats as
canonical now live in-project at `docs/canonical/`:

| Doc | In-project path |
|---|---|
| VISION | `docs/canonical/VISION.md` |
| VISION_LOCK_v0.3 | `docs/canonical/VISION_LOCK_v0.3.md` |
| UX_SPEC_v0.3 | `docs/canonical/UX_SPEC_v0.3.md` |
| UX_CONTROLS_SPEC_v0.4 | `docs/canonical/UX_CONTROLS_SPEC_v0.4.md` |

Phase 0 copied these in from `C:\AI\` root (the first three) and from
`docs/UX_CONTROLS_SPEC_v0.4.md` (the fourth, which already lived
in-project; the canonical/ copy is a duplicate at this point and a
later phase can resolve the duplication). The `C:\AI\` root copies
were left in place by Phase 0 — they are no longer load-bearing for
this project, but a later phase will reconcile them.

When a doc in this project references one of the four, it points at
the `docs/canonical/` path, not at `C:\AI\` root.

---

## Rules

**1. Session artifacts do not live in this repo.**
Session-close briefs, probe bundles, agent-instruction bundles, build
locks, and similar session-orchestration artifacts go in
`C:\AI\_sessions\` (which may not exist yet — fine; that's session
storage, not the project's concern). The project's own `docs/` tree
holds design decisions and process notes, not session-by-session
ephemera. The historical `docs/SESSION_CLOSE_v*.md` files are
grandfathered as frozen artifacts and are not the pattern going
forward.

**2. `STATE.md` is durable reference; `NAVIGATION.md` is current state.**
`STATE.md` carries the stack, routes, mothballed-for-v1 decisions,
and canonical-doc pointers — stuff that doesn't decay. `NAVIGATION.md`
tracks what's shipped vs. what's in the working tree, and what's next.
Aspirational work goes in `BACKLOG.md`. Working-tree vs.
production-deploy disagreements are `NAVIGATION.md`'s concern, not
`STATE.md`'s.

**3. Nothing at `C:\AI\` root is allowed to be load-bearing.**
A doc, file, or path at `C:\AI\` root may be referenced from this
project only as informational context (e.g. "MediaVault lives at
`C:\AI\Platform\MediaVault\`" in a design doc that crosses project
boundaries). It must never be required for orienting, building,
deploying, or continuing the museum. If a future agent or session
adds a `C:\AI\`-rooted dependency to this project, that addition must
either pull the dependency in (per the canonical-docs pattern in
`docs/canonical/`) or be reverted.

---

## Verification

To verify self-containment at any time, from this project's root:

```
grep -rn "C:\\AI\\" STATE.md BACKLOG.md README.md docs/*.md
```

Hits inside `docs/archive/`, `docs/superseded/`, or any `*.bak_*`
backup file are frozen historical artifacts and acceptable. Hits in
`docs/SESSION_CLOSE_v*.md` are also frozen historical artifacts.
Hits anywhere else need to be resolved — either the reference is
load-bearing (pull the dep in) or it's informational (acceptable, but
prefer to phrase such that the project doesn't read as dependent).
