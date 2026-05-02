# Weird.Baby Museum — STATE

**As of:** 2026-05-02
**Committed to:** main (see `git log` for the latest commit hash)
**Deployed:** Not yet — see Phase 2b. (Update after deploy.)

## What this is

Weird.Baby Museum. A curatorial platform. Currently exhibiting Hunter Root.

## Live routes

- `/` — front door (lobby + guestbook)
- `/admin` — operator dashboard (`mmm` key sequence)
- `/hr` — Hunter Root exhibit
- `/hr/home`, `/hr/media`, `/hr/archive`, `/hr/fan-wall` — HR sub-routes
- `/shop` — gift shop

## Stack

React 19, Vite 8, Cloudflare Workers, D1 (`weird-baby-db`).
Build: `npx vite build`. Deploy: `npx wrangler deploy`.

## Canonical docs

See `docs/canonical/` — VISION, VISION_LOCK_v0.3, UX_SPEC_v0.3,
UX_CONTROLS_SPEC_v0.3.

## Recent work

- Phase 0 — project self-contained (commit dce3bb2)
- Phase 1 — museum HR-only (commit 12d50da)
- Phase 1.5 — v28 deck ported to HrExhibitFlow (commit 21c62a5)
- Cleanup — quarantine removed, STATE/BACKLOG rewritten (this commit)

## Open backlog

See `BACKLOG.md`.
