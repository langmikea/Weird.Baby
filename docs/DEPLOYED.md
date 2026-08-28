# DEPLOYED — what is live at weird.baby

Written by `tools/deploy-record.mjs`, which is the last link of both deploy
chains and runs only when `wrangler deploy` exits 0. **Do not edit by hand.**

**THE WIRE IS THE AUTHORITY, NOT THIS FILE.** This is written after the upload
and has to be committed by a person, so it can lag. The commit sha is also
compiled into the worker and `/api/held` reports it to a key-holder — when the
two disagree, production is right and this file was not committed.

**A MISSING ROW DOES NOT PROVE NOTHING SHIPPED.** Anything reaching `wrangler
deploy` directly writes no row, exactly as it passes no guard (§0 forbids that
form). Ask the wire.

## Live now

| field | value |
|---|---|
| commit | `ad0d73d` **— DIRTY TREE** |
| full sha | `ad0d73d024211b09a7c4e039f7b3cf3e8b6bb613` |
| subject | epoch: RECORD_EPOCH moves to 2026-09-07 on Mike's ruling D |
| stage | **launch** |
| deployed at | 2026-08-28T14:03:16.142Z |
| worker sha256 | `ddd735e8d99d0f0b` (first 16) |
| tree clean | **NO** — 1 path(s): `docs/DEPLOYED.md` |

## History

| commit | stage | deployed at | worker sha256 | subject |
|---|---|---|---|---|
| `ad0d73d` (dirty) | launch | 2026-08-28T14:03:16.142Z | `ddd735e8d99d0f0b` | epoch: RECORD_EPOCH moves to 2026-09-07 on Mike's ruling D |
| `ad0d73d` | launch | 2026-08-28T13:41:14.048Z | `0ee2aba3bf91fbb3` | epoch: RECORD_EPOCH moves to 2026-09-07 on Mike's ruling D |
