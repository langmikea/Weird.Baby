<!-- ) SHELL-STOP. Do not remove: the unbalanced parenthesis makes bash abort if this file is ever executed, which is how a deploy published on 2026-08-29. §8. -->
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

The monthly scheduled run is automated via Windows Task Scheduler — see
**Automated backups** below.

## Automated backups (Windows Task Scheduler)

A monthly Task Scheduler job runs the export without anyone remembering to.
This is the chosen automation (2026-06-01). It was picked over a Cloudflare-side
Worker-cron → R2 approach deliberately: the whole reason these in-repo exports
exist is an **off-platform, version-controlled** copy that survives loss of the
D1 instance or the Cloudflare account. A Worker → R2 backup stays on Cloudflare
(same failure domain as Time Travel) and needs a deployed worker + Workflow +
R2 + API-token secret. The scheduled local export is read-only, needs no deploy,
and produces exactly the durable git artifact we want. A missed run (laptop off)
is backstopped by Time Travel's 30-day window and by `StartWhenAvailable` (the
job fires as soon as the machine is next on).

### Pieces

- `tools/backup-guestbook-scheduled.ps1` — unattended wrapper. Runs the
  read-only `backup-guestbook.ps1`, then `git add backups/` + `git commit`
  **locally** (no push — operator pushes). Every run is appended to
  `backups/scheduled-run.log` (gitignored). Read-only on D1; never writes to it.
  `-NoCommit` switch produces files without committing.
- `tools/weird-baby-d1-backup.task.xml` — the Task Scheduler definition.
  Monthly on the 1st at 09:00 local, `StartWhenAvailable`, `InteractiveToken`
  logon (runs under your account when logged on, **no stored password**).

### One-time setup (operator)

**1. Create a scoped Cloudflare API token (unattended auth).**
`wrangler login`'s stored OAuth works unattended *but* can expire or be revoked
and then fails **silently** on a scheduled run. A scoped token is the robust
choice. In the Cloudflare dashboard → My Profile → API Tokens → Create Token →
Custom token:

- Permissions: **Account → D1 → Read** (export is read-only; `Read` is enough).
- Account Resources: include the account that owns `weird-baby-db`.
- Create, copy the token value (shown once).

**2. Store it as a *user* environment variable** (so the logged-on scheduled
task inherits it):

```powershell
[Environment]::SetEnvironmentVariable("CLOUDFLARE_API_TOKEN", "<paste-token>", "User")
```

Open a **new** PowerShell afterward (env vars don't update live), then verify:

```powershell
npx wrangler d1 info weird-baby-db   # should succeed without prompting to log in
```

**3. Unblock the scripts once** (SmartScreen zone tag on downloaded files):

```powershell
Unblock-File .\tools\backup-guestbook.ps1
Unblock-File .\tools\backup-guestbook-scheduled.ps1
```

**4. Register the scheduled task.** Edit the `<UserId>` placeholder in
`tools/weird-baby-d1-backup.task.xml` to your account first (e.g. `LAPTOP\Mike`),
or pass `/ru` at import. From an elevated PowerShell at the repo root:

```powershell
schtasks /create /tn "WeirdBaby D1 Guestbook Backup" `
  /xml "C:\AI\Projects\weird-baby-museum\tools\weird-baby-d1-backup.task.xml" `
  /ru "<YOURDOMAIN-or-PC>\<you>"
```

(GUI alternative: Task Scheduler → Action → Import Task… → pick the XML →
on the General tab confirm your user and "Run only when user is logged on".)

### Verify it actually fires

Run the task on demand and confirm the artifacts + commit, without waiting a
month:

```powershell
schtasks /run /tn "WeirdBaby D1 Guestbook Backup"

# a few seconds later:
Get-Content .\backups\scheduled-run.log -Tail 20     # should show "END (ok, committed)" or "nothing to commit"
git -C . log --oneline -1                             # newest commit = the scheduled snapshot (if rows changed)
Get-ChildItem .\backups\ | Sort-Object LastWriteTime | Select-Object -Last 3
schtasks /query /tn "WeirdBaby D1 Guestbook Backup" /v /fo LIST | Select-String "Last Run","Last Result"
```

`Last Result` of `0` (0x0) means success. Then push the local commit when ready:

```powershell
git push
```

### Change the cadence

Edit the `<ScheduleByMonth>` block in the XML (or the trigger in the Task
Scheduler GUI) and re-import. For weekly, swap the `CalendarTrigger` for a
`ScheduleByWeek` block; for daily, `ScheduleByDay`.

### Notes / limits

- **Machine must be on at fire time** (or come on later — `StartWhenAvailable`
  catches the missed run). This is the one tradeoff vs a Cloudflare-side job.
- **No push from the task** — it commits locally only; you push. This honors the
  repo's "operator pushes" workflow and keeps git credentials out of the task.
- If a scheduled run can't reach Cloudflare auth, it logs `EXPORT FAILED` and
  exits non-zero — check `backups/scheduled-run.log`.

## Restore (reference)

```powershell
# from a full or table SQL export, into the remote DB (DESTRUCTIVE — operator only):
npx wrangler d1 execute weird-baby-db --remote --file backups/guestbook-<ts>.sql
```
