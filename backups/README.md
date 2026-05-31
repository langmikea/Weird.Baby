# weird.baby guestbook / D1 backups

Durable, in-repo copies of the weird-baby D1 database (the server-side store
behind the guestbook at `weird.baby/admin` and the public lobby).

## What's stored in D1

D1 binding `weird_baby_db` → database `weird-baby-db`
(id `4db60094-122a-4618-b3c5-8664f74af222`, declared in `wrangler.jsonc`).
Two tables, both written by `src/worker.js`:

- **`guestbook`** — columns `name`, `note`, `badge` (`'Founding Visitor'`),
  `signed_at` (UTC, `datetime('now')`). Written on `POST /api/guestbook`.
- **`visits`** — page-view log (`page`, `referrer`, `visited_at`).

## Backup files in this directory

The `tools/backup-guestbook.ps1` script writes timestamped (`<ts>` = UTC
`yyyyMMdd-HHmmssZ`) artifacts here:

| File | Contents | Use |
|---|---|---|
| `weird-baby-db-<ts>.sql` | Full DB export (schema + all rows, all tables) | Canonical, re-importable backup |
| `guestbook-<ts>.sql` | `guestbook` table only (schema + INSERTs) | Focused restore of just the guestbook |
| `guestbook-<ts>.json` | `guestbook` rows as a clean JSON array | Human-readable / easy to diff & verify |

All three are produced read-only via `wrangler d1 export` /
`wrangler d1 execute`. The script never writes to, deletes from, or alters
the database.

## How to run a backup

From the repo root, with Cloudflare auth available (`wrangler login` or a
`CLOUDFLARE_API_TOKEN` env var):

```powershell
# one-time, if SmartScreen flags the script as downloaded-from-web:
Unblock-File .\tools\backup-guestbook.ps1

.\tools\backup-guestbook.ps1
```

The script prints the exported entry count and each signer, then commit:

```powershell
git add backups/
git commit -m "backup: weird-baby D1 guestbook snapshot <ts>"
git push
```

### Manual equivalent (no script)

```powershell
npx wrangler d1 export weird-baby-db --remote --output backups/weird-baby-db-<ts>.sql
npx wrangler d1 export weird-baby-db --remote --table guestbook --output backups/guestbook-<ts>.sql
npx wrangler d1 execute weird-baby-db --remote --command "SELECT * FROM guestbook ORDER BY signed_at" --json
```

## Cloudflare's built-in protection (Time Travel)

D1 has **Time Travel** — always-on point-in-time recovery, no setup required.
It can restore the database to any minute within the retention window:
**30 days** on Workers Paid, **7 days** on Workers Free. Database history and
restores cost nothing extra.

```powershell
npx wrangler d1 time-travel info weird-baby-db                 # current bookmark / window
npx wrangler d1 time-travel restore weird-baby-db --timestamp <RFC3339>
```

**Caveat — why we still keep in-repo exports.** Time Travel only protects a
database that still exists. It does **not** survive the database being deleted,
the Cloudflare account lapsing, or accidental destructive migrations beyond the
retention window. It is also not an off-platform copy. The committed `.sql` /
`.json` exports here are the durable, portable, version-controlled record and
the only copy that survives loss of the D1 instance itself.

## Recommended cadence

The guestbook is low-volume (single-digit entries). Recommended:

- **Manual run after any notable batch of new signings**, and
- **A monthly scheduled run** so a fresh export always sits inside Time
  Travel's 30-day window (i.e. you can always reconstruct from either the last
  export or Time Travel, whichever is closer).

If automation is wanted later, the same `wrangler d1 export` step can run from
a scheduled task or a Cloudflare Workflow writing to R2 (see Cloudflare's
"Export and save D1 database" example).

## Restore (reference)

```powershell
# from a full or table SQL export, into the remote DB (DESTRUCTIVE — operator only):
npx wrangler d1 execute weird-baby-db --remote --file backups/guestbook-<ts>.sql
```
