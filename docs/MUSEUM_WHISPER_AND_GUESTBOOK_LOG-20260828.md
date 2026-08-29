# THE LOST WHISPER, FOUND · THE GUESTBOOK SURVEYED · THE VIDEOS STILL NOT ADOPTED

**2026-08-28.** HEAD at start `06191e5`. **Nothing was deleted. Nothing in the
database was touched.** Report round.

---

## 1. THE LOBBY WORDING — FOUND, AND MIKE WAS RIGHT AGAIN

**HE REMEMBERED A SEVENTH LINE. IT EXISTED, IT SHIPPED, AND IT IS GONE FROM
HEAD.** The six-line note is live today; what is missing is the line that sat
beneath it.

### What it was, verbatim, at `abf628a` (2026-04-13)

```jsx
<p className="wb-note">
  We're not open yet.<br />
  But you found us —<br />
  which means <em>something.</em><br /><br />
  The people who sign the guest book now<br />
  will be remembered differently<br />
  than the ones who come later.
</p>
<p className="wb-whisper">You are early. That is noted.</p>
```

> ### **"You are early. That is noted."**

### The chain, complete

| when | commit | what happened |
|---|---|---|
| 2026-04-13 | `abf628a` | shipped, seven lines, the whisper in `.wb-whisper` |
| **2026-07-25** | **`30d9162`** | **killed.** Its own commit message ends: *"You-are-early killed."* A comment was left at the site: *`[walk-five] "You are early. That is noted." killed — redundant with the note above (the book already says what early means).`* |
| 2026-08-12 | `1e45ae2` | the six-line note swapped for *"The museum is open."* — **and the kill-comment was deleted with it** |
| 2026-08-12 | `d966f8b` | the six-line note came back. **The seventh line did not.** |

### What found it, in the order §8 already prescribes

**Step 2 answered it — the pickaxe over ALL refs on CONTENT, not on a filename.**
`git log --all -S"not open yet"` returned six commits; the oldest, `abf628a`, held
a version one line longer than HEAD. One command.

### THE PATTERN, AND IT IS SHARPER THAN THE §8 ROW ALREADY SAYS

Three misses this week — CH4's working version, the monitor drag-resize, and
this. §8 already names the common cause (*searching what the tree IS rather than
what it HAS BEEN*). **What this third one adds is worse and is not yet written
down:**

> **THE TREE HELD ITS OWN RECORD OF THE DELETION, AND A LATER ROUND DELETED THE
> RECORD.**

`30d9162` did the right thing — it killed the line **and left a comment saying
what was killed and why**. That comment was the breadcrumb. Four months later
`1e45ae2`, doing unrelated work on the same paragraph, removed the comment as
part of rewriting the block. **After that, nothing in the tree said the line had
ever existed**, and a grep of HEAD could not have found it by any wording.

**All three misses share this second shape too:** the marker filed `ref: null`,
the resize disabled-not-deleted, and now a kill-comment swept away by a rewrite.
**In every case the tree contained the answer and then stopped containing it.**

**THE RULE THIS ASKS FOR: a comment that records a deletion is not a dead
comment.** It is the only thing standing between a removed line and *it never
existed*. A round that rewrites a block containing one carries it, or moves it
to the round log — it does not drop it as tidy-up.

### And it left an orphan

**`.wb-whisper` is still in `src/routes/WbHome.css:113`** — full rule, font,
letter-spacing, colour, margin — **and no JSX in the tree uses it.** Measured:
zero hits across `src/**/*.jsx` and `*.js`. It has been dead since 2026-07-25.

**FLAGGED, NOT FIXED.** It is a live CSS rule for a line Mike has just said he
misses, and deleting it this round would remove the last trace of the styling
the moment he asked about the words. **If he wants the line back, the style is
already there.**

---

## 2. THE GUESTBOOK — SURVEYED, NOTHING TOUCHED

**Ops ruled nothing is deleted this round. Nothing was.** No `wrangler d1`
command was run, read or write.

### Is there a tool?

**Yes — two, and they are read-only by construction.**

```
tools/backup-guestbook.ps1             manual
tools/backup-guestbook-scheduled.ps1   monthly, 1st at 13:00Z
```

Its own header: *"Read-only. Never writes to, deletes from, or alters the D1
database or schema."* It produces three artifacts per run — full DB `.sql`,
guestbook-only `.sql`, guestbook `.json`.

**There is NO tool that writes or deletes.** The worker has `GET` and `POST` and
nothing else — **no DELETE route anywhere in `src/worker.js`.**

### Is there a backup? — YES, AND IT IS STALE, AND THAT IS THE FINDING

| | |
|---|---|
| newest **guestbook-only** dump | **2026-06-03** — 86 days old |
| newest **full-DB** dump (contains the table) | **2026-07-01** — 58 days old |
| guestbook rows in that newest backup | **3** (ids 1, 2, 5) |
| signatures on the live site today | **7** |

**FOUR LIVE SIGNATURES EXIST IN NO BACKUP AT ALL:**

```
Sammy B      Jul 5  2026   "Hi dad!!!"
Mo           Jul 16 2026   "Love"
Tommy        Aug 3  2026   "History."
Weird.Baby   Aug 17 2026   "My birthday, I guess! Weird.Baby is open for business!"
```

**The row Mike wants removed is one of the four.** Deleting it today deletes
something no backup holds.

### Why the backups stopped — the scheduled job has failed twice and told nobody

```
[2026-06-03 13:24:24Z] === scheduled guestbook backup END (ok, committed + pushed) ===
[2026-07-01 13:00:02Z] EXPORT FAILED: npm notice
[2026-07-01 13:00:02Z] === scheduled guestbook backup END (failure) ===
[2026-08-01 13:00:01Z] EXPORT FAILED: … A request to the Cloudflare API
                        (/accounts/…/d1/database/4db60094-…/export) failed.
[2026-08-01 13:00:01Z] === scheduled guestbook backup END (failure) ===
```

**Two consecutive failures, two different causes, and the only record is a log
nobody reads.** The 07-01 run still produced its full-DB export — which is why a
2026-07-01 backup exists at all — and failed on the guestbook-only step, where
**an `npm notice` on stdout was captured as an error**. The 08-01 run failed at
the Cloudflare API and produced nothing.

**So the answer to *does the tree have a backup* is: it has a mechanism that
worked, stopped working on 2026-07-01, and has been silently failing since.**

### What would deleting one row take?

```
npx wrangler d1 execute weird-baby-db --remote --command "SELECT id, name, note, signed_at FROM guestbook ORDER BY signed_at DESC"
npx wrangler d1 execute weird-baby-db --remote --command "DELETE FROM guestbook WHERE id = <id>"
```

**MATCH ON `id`, NEVER ON THE NUMBER ON THE GLASS.** The site prints `01`–`07`
as positions; the real ids are `1, 2, 5, …` with gaps. **The `07` a visitor sees
is not `id = 7`.** Nothing in the display is a key.

### What records that it happened?

**Nothing.** The schema is:

```sql
CREATE TABLE guestbook (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL,
                        note TEXT, badge TEXT DEFAULT 'Founding Visitor', signed_at TEXT)
```

**No audit table. No `deleted_at`. No `hidden`. No `visible`.** The backup log
records backups, not mutations. A deleted row would leave **no trace in the
database, no trace in the tree, and no document saying why** — and the next
backup, if one ever runs again, would simply not contain it.

### Is deletion even the right act?

**Ops' reading: no, not as the first move — and the choice is Mike's.**

| | cost | reversible? |
|---|---|---|
| **DELETE** | one statement | **NO.** No backup holds the row. |
| **HIDE** | schema change (`ALTER TABLE … ADD COLUMN`), a worker change to filter `SELECT *`, and a deploy | yes |
| **EDIT the note** | one `UPDATE` | no, but it keeps the signature |
| **BACK UP FIRST, then decide** | run the manual tool once | — |

**The one that should happen regardless of the ruling is the last.**
`tools/backup-guestbook.ps1` is read-only, exists, and has not run since June.
**Running it captures the four unbacked signatures — including three from real
visitors that have nothing to do with this question.** After that, any of the
other three options is recoverable.

**And what he objects to is arguably the note, not the signature.** The entry
says *"Weird.Baby is open for business!"* — false as of Ruling D, and it sits
three lines under a countdown reading nine days. **The signature is his own and
dated; the sentence inside it is the thing that went stale.**

---

## 3. THE TWO \MUSIC VIDEOS — STILL NOT ADOPTED BY OPS

```
E.D. Yahdah - Weird.Baby - Early Instrumental   WOWS-RWywgA
Coconuts    - Weird.Baby - Early Front Porch    YibpBtf9IU8
```

**They were carried into this round as "both proved playing". Ops did not prove
that and has no reading that says so.** What Ops measured, last round and again
this round, is that **it cannot see any video play at all**:

```
document.hidden  true    visibilityState  "hidden"    innerWidth 0    innerHeight 0
```

and the control — **`c1vODrVXOg0`, the Coconuts official video, already adopted
and live on the museum** — reads `unstarted` with `currentTime` flat at 0 for
fourteen seconds in the same harness.

**Re-checked at the top of this round: still hidden, still 0×0.**

**SO THE VIDEOS ARE NOT BUILT.** The adoption rule is that a source is not
adopted until it has been SEEN PLAYING, and Ops has not seen it. Landing them on
an assertion would be substituting a claim for the observation the rule exists to
require — **which is exactly the failure this same session already made once
today**, on the TikTok dot, and for the same reason: a fact asserted without
being checked.

**WHAT WOULD CLOSE IT — one person, one foreground browser:**

```
npm run mock
```
```
http://127.0.0.1:8899/shorts/out/adopt.html?v=WOWS-RWywgA
http://127.0.0.1:8899/shorts/out/adopt.html?v=YibpBtf9IU8
http://127.0.0.1:8899/shorts/out/adopt.html?v=c1vODrVXOg0     ← the control, third
```

**`ADVANCING: YES` on the first two, AND on the control, is the adoption.** If
the control does not advance, the browser is the problem and the other two
readings mean nothing. **Paste the three readings back and the renditions land
in one round** — the shape is settled (Coconuts' ruled shape, video first, audio
second) and only the evidence is missing.

**E.D. Yahdah's spelling stands as `Yahdah`** — Mike confirmed the copyright.
YouTube's title reads *Yadah*; **the channel is wrong, not the museum**, so the
title is not taken from the platform when these land.

---

## 4. GATES

```
lint                  9 errors / 7 warnings — BASELINE, zero new
build                 green
provenance:gate       PASS
reveal:check          PASS
release:check         PASS
instory:gate          PASS
docs:numbers:gate     PASS
```

**Nothing in `src/` changed. Nothing in `release/` changed. No database command
was run.** This round writes one document.

---

## 5. WHAT IS OWED, AND TO WHOM

| | whose |
|---|---|
| **Run `tools/backup-guestbook.ps1` once** — four live signatures are unbacked | **Mike** (host-side, read-only) |
| **Fix or retire the scheduled backup** — failing silently since 2026-07-01 | Ops can scope; Mike runs |
| Rule on the guestbook entry: delete · hide · edit the note · leave it | **Mike** |
| Rule on `"You are early. That is noted."` — back, or stays gone | **Mike**. The CSS is still there either way. |
| Adopt the two videos — three readings from a foreground browser | anyone with a real browser |
| Instagram + Facebook handles, Instagram's account | **Mike** · `M60` |
