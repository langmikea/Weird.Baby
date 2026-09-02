# THE HIDDEN LINKS — what the site would need, and where the honest limits are

**R3, 2026-08-07. SCOPING ONLY — nothing in this document was built.**

Mike's instruction: *"the story runs on passwords, zips inside zips, codes that
fail when typed directly, and owner-unlocks-that-become-community-property.
Report what the site would need to serve that — what can be done client-side,
what needs the worker, what is genuinely secret versus theatrically secret (a
password in a bundle is not a secret), and where the honest limits are. NO BUILD
this round; the scoping is the deliverable."*

His parenthesis is the whole document's spine and it is already this
repository's most expensive lesson, paid three times in three currencies:

| round | the filter that was not enough | what shipped anyway |
|---|---|---|
| R5, 2026-08-06 | a runtime strip of Hunter Root's vault audio | **153 mp3 URLs in plain text** in the built bundle |
| H1, 2026-08-06 | a function signature that returned only four ledger fields | **the whole 162-row reveal ledger**, 64 KB, in a chunk every visitor downloads |
| V1, 2026-08-06 | a resolver that returned `null` for a held picture | **all 26 withheld public addresses**, in plain text, in the first launch build |

Each time the rule was correct and the enforcement was in the wrong layer. A
bundle does not ship intentions; it ships the file.

---

## 1. THREE GRADES OF SECRET, AND EVERY DECISION BELOW IS A CHOICE AMONG THEM

Not two. The middle one is the one this story is actually built for and it is
the one people forget exists.

### GRADE A — GENUINELY SECRET (server-held)
The material is **not on the visitor's machine** and cannot be fetched without
something the server checks. The only thing in this project that can supply
this is `src/worker.js`, holding a wrangler secret in `env`.
*Today:* `/hr`, behind `env.HR_KEY` and the `wb_held` cookie.

### GRADE B — SEALED IN THE OPEN (client-held, key-held)
The material **is** on the visitor's machine and is useless without a key that
was never published. An AES-encrypted archive is this. So is a WebCrypto blob.
**This is as secret as its passphrase and nothing else** — no server, no
session, no worker.
*Today:* nothing in the museum uses it. It is the right answer for most of what
Mike described.

### GRADE C — THEATRICALLY SECRET (ceremony)
The material is present and the lock is a check in the bundle. Anyone who opens
devtools has it in under a minute. **Legitimate** for ceremony over material
that is already public, or over material in the DUMP bucket where being early
costs nothing. **Never** for a reveal.

> **THE ONE-LINE TEST.** If the browser can decide whether to show it, the
> visitor can decide too. Grade A moves the decision to the server; grade B
> moves it to a key; grade C leaves it with the browser and calls it a lock.

---

## 2. THE FOUR MECHANICS

### 2a. PASSWORDS — *a code that opens a thing*

**What it needs.** One question decides everything: **is the material behind
the password already public?**

| the material | grade available | where the check lives |
|---|---|---|
| shipped in the bundle / at a typeable address | **C only** | anywhere — it is ceremony |
| a static file you can encrypt in advance | **B** | in the browser, with the key the visitor types |
| must not exist on the visitor's machine until opened | **A** | the worker, and only the worker |

**What exists today.** Exactly the grade-A shape, for one key:
`POST /api/held {key}` → the worker compares `sha256(supplied)` with
`sha256(env.HR_KEY)`, and on a match mints `wb_held = sha256("wb-held-v1:" + key)`
as an `HttpOnly; Secure; SameSite=Lax` cookie for 30 days. The refusal branch at
the top of `fetch()` then serves the shut directories.

**What the story needs that this does not do.** *Many* keys — one per zip, per
room, per day — where today there is one. Three ways, cheapest first:

1. **One secret, many codes derived from it.** `env.STORY_KEYS` is a single
   secret holding a JSON map of `lock → code`. One wrangler secret, no schema,
   no migration; adding a lock is `wrangler secret put` again. **Cheapest, and
   it is what a 90-day performance wants.**
2. **A D1 table of locks.** More machinery, an admin surface to manage it, and a
   database read on the hot path. Buys nothing the performance needs.
3. **A secret per lock.** `env.LOCK_ZIP_1`, `env.LOCK_ZIP_2`… Clean, but every
   new lock is a deploy-time environment change and there will be dozens.

**Honest limits.**
- **A short code checked by the worker is fine; a short code checked anywhere
  else is not.** The worker can rate-limit; a shipped hash cannot — every
  human-typeable password falls to an offline dictionary attack in minutes.
- **The endpoint is a brute-force surface.** Nothing in this project rate-limits
  today. A 6-character code against an unthrottled endpoint is gone. Either the
  codes are long, or a Cloudflare Rate Limiting rule goes on `/api/*` before the
  first lock ships. **This is a build item, not a caveat.**
- **The refusal must not leak.** The existing worker returns a plain `404` for a
  shut directory *"because a 403 confirms there is something there to be
  forbidden"* — the same discipline has to hold for every new answer: *wrong
  code*, *right code but already used* and *no such lock* must be one response.
- **Comparison is on digests, and that is deliberate** — equal-length hex, so
  the comparison leaks nothing about the secret's length or prefix. Keep it.

---

### 2b. ZIPS INSIDE ZIPS — **and this is the mechanic that needs the site least**

**The finding: a sealed archive is grade B with no server at all.** An encrypted
zip served as an ordinary static file from `public/` is exactly as secret as its
passphrase. Cloudflare serves it, the worker never sees it, and it can sit at a
public address on day one and be worthless until the day the story says the
word. **Nothing else in this list has that property.**

**And the story's own device is also the correct engineering.** A standard zip
**encrypts the contents and not the file list** — an AES zip still tells you the
names and sizes of everything in it. Putting the inner archive inside an outer
one hides the inner's manifest. *Zips inside zips* is not decoration; it is the
only way a zip hides what it holds.

**Two ways to build it, and the second is the recommendation.**

| | **A real encrypted zip** | **WebCrypto in the browser** |
|---|---|---|
| what is served | `.zip`, AES-256 (WinZip method 99) | `.bin` of AES-GCM ciphertext + one page |
| the visitor needs | **7-Zip, Keka, or a terminal** | nothing but the browser |
| Windows Explorer opens it | **no** | n/a |
| macOS Archive Utility opens it | **no** | n/a |
| build cost | a `7z` command | ~80 lines of client JS + a build step |
| feels like | a file somebody sent you | a page that opens |

**Do not use legacy ZipCrypto.** It is broken by a known-plaintext attack — one
known file in the archive recovers the whole thing in seconds — and it is what
most tools produce by default. AES-256 is a flag you have to pass.

**Honest limits.**
- **The ciphertext is public, so the passphrase must survive an offline attack.**
  This is the single most important rule in this document. A server-checked code
  may be four characters; a client-decrypted one may not. Story phrases are
  usually long enough; story *codes* usually are not.
- **The KDF matters.** PBKDF2 with a low iteration count turns a good passphrase
  into a bad one. If this is built, the iteration count is a decision to write
  down, not a default to accept.
- **Once fetched, it is theirs forever.** A sealed archive cannot be pulled back
  — only the key can be withheld, and a key cannot be un-said.

---

### 2c. CODES THAT FAIL WHEN TYPED DIRECTLY — *week 2, day 4*

Mike's beat: *"the unlabeled table holding more codes"* + *"the codes that fail
when typed directly"*. Mechanically this says **the code is not the input** —
something transforms it, and the reader has not found the transform.

**Where the transform may live is decided by one question: is the transform
itself the puzzle?**

- **If the transform IS the puzzle** (find the step, then the codes work), it
  cannot be in the bundle. A transform in the bundle is the answer in the
  bundle. → **the transform lives in the worker**, and *"fails when typed
  directly"* is simply the worker's answer to a raw code. **Grade A. Zero
  client-side secret. This is also the cheapest build in the whole document:
  one endpoint that answers `no` to the raw form and `yes` to the transformed
  one.**
- **If the transform is discoverable by design** (it is written on an object,
  in a photograph, in the manual) it may live anywhere, because knowing it is
  supposed to be possible. → grade C is honest here, and the reveal is the
  OBJECT that carries the transform, not the code.

**A shape that already exists and is worth reusing.** `POST /api/presets` +
`GET /api/presets/<id>` is already a code → payload store: an 8-character
base36 short id, a shape check, a size cap, `404` on unknown, and a strict
`/^[a-z0-9]{4,16}$/` guard on the id. A story-code resolver is that endpoint
with a different table and a stricter answer. **Nothing new needs inventing;
one route needs copying.**

**Honest limits.**
- **Enumeration.** A code space small enough to be typed is small enough to be
  swept. Rate limiting again, and it is the same build item as 2a.
- **A `404` is an answer.** If *no such code* and *code not yet valid* differ by
  a status, the difference is the map.
- **The museum cannot make a code fail "for now" and work later without holding
  state** — either the worker's answer is a build-time constant (so a deploy
  changes it, which is fine: one deploy a day is the model) or it is a D1 read.
  **The deploy is cheaper and it is already the daily step.**

---

### 2d. OWNER-UNLOCKS-THAT-BECOME-COMMUNITY-PROPERTY

**This is the only one of the four that cannot be static.** *Someone opens it,
and then it is open for everybody* is a fact about the world that has to be
written down somewhere the next visitor can read. That is a database.

**What it needs.**
1. A D1 table — `unlocks(lock_id TEXT PRIMARY KEY, opened_at TEXT, note TEXT)`.
   D1 is already bound as `env.weird_baby_db` with three tables (`guestbook`,
   `visits`, `presets`); this is a fourth.
2. `POST /api/unlock {lock, code}` — checks the code (2a), inserts idempotently,
   answers `{open:true}`.
3. `GET /api/unlocks` — the open set, so a page can draw what is open.
4. **The refusal branch consults it.** For material that must be genuinely shut
   until it is opened, `src/worker.js`'s shut-directory test has to ask the table
   as well as the cookie.

**And step 4 is where the real cost is.** A worker that reads D1 before serving
a file in a shut prefix adds a database round-trip to a static asset fetch.
Two honest ways and no third:

- **Read D1 per request in the shut prefix.** Correct, and slow — but the shut
  prefix is by definition low-traffic. **Recommended.**
- **Cache the open set in module scope.** Fast, and **stale by up to the
  lifetime of a Worker isolate** — which is per-PoP, unbounded, and not
  something the museum controls. A visitor in one city sees it open and a
  visitor in another does not, for an interval nobody can state. **A mechanism
  whose failure interval cannot be named should not guard a reveal.**

**Honest limits.**
- **It is one-way, and that suits the story.** *Community property* cannot be
  taken back honestly, and Mike's own rule is that we never go backwards. Build
  it one-way; do not build an un-open.
- **The museum cannot verify WHO opened it.** It can say *"it was opened, at
  this time"*. Naming a person means the person typed a name, unverified — the
  guest book's shape, with the guest book's honesty problem. **And it is a new
  claim on the privacy answer in `/booth`, which is Mike's own wording and has
  already been wrong twice.** That answer changes in the same commit or the
  disclosure is false.
- **An anonymous write endpoint is an abuse surface.** Rate limiting, a length
  cap on `note`, and the worker-side `slice()` discipline the guest book already
  uses (`L1` — *an attribute is a courtesy to the browser*).
- **A pull-back after a public open is not available.** Once the material has
  been served at a public address it may sit in an edge cache, a crawler's
  index, an archive or a visitor's disk. The site stops serving it; the internet
  does not forget it.

---

## 3. WHAT THE MUSEUM ALREADY HAS, AND WHAT IT WOULD HAVE TO ADD

**Already built and directly reusable:**

| piece | where | reusable for |
|---|---|---|
| a worker that refuses a directory without a cookie | `src/worker.js`, `LOCKED_DIRS` / `STAGE_DIRS` | 2a, 2d |
| a secret with **no default**, failing closed and loudly | `env.HR_KEY`, `NO_KEY_NOTE` | 2a |
| digest comparison, `HttpOnly; Secure; SameSite=Lax` cookies | `heldToken`, `heldOpen` | 2a |
| a code → payload resolver with id validation and a size cap | `/api/presets` | 2c |
| D1, bound, with three live tables | `env.weird_baby_db` | 2d |
| a build that fails if held code lands in a public chunk | `heldChunkGuard`, `HELD_PATHS` | all |
| a gate that fails if a held thing becomes reachable | `reveal/reachability.mjs`, 9 checks | all |

**Would have to be added:**

1. **A THIRD DOOR PAIR, AND IT MUST NOT BE EITHER EXISTING ONE.** The two pairs
   are named for their **reasons** — `/assets/locked/` + `/locked/` is
   PERMISSION (Hunter Root, every stage) and `/assets/held/` + `/held/` is STAGE
   (launch). **A story lock is a third reason and needs a third pair**
   (`/assets/sealed/` + `/sealed/`, say). Collapsing it into either would put a
   story puzzle on the same switch as ninety-three of Hunter Root's tracks —
   which is the exact hazard V1 split the doors to prevent.
2. **Four edits per new pair, and `reveal:check` reads all of them back:**
   `src/worker.js` (`SEALED_DIRS` + its branch) · `wrangler.jsonc`
   (`run_worker_first`) · `vite.config.js` (`HELD_PATHS`, if any code goes
   behind it) · `reveal/reachability.mjs` check 3. **Missing the
   `run_worker_first` entry makes the door silently absent** — §8's standing
   hazard.
3. **Rate limiting on `/api/*`.** Not optional once codes are typed at the site.
4. **One instrument that answers *is this actually shut?*** — the same service
   `reveal/reachability.mjs` performs for the two existing holds, extended.

---

## 4. THE HONEST LIMITS, GATHERED

1. **Anything the browser can decide, the visitor can decide.** Grade C is
   ceremony and must never guard a reveal.
2. **A shipped hash is not a lock.** Human-typeable passwords fall offline.
3. **Client-side decryption needs a passphrase strong enough for offline attack;
   server-side checking does not.** This is the boundary that decides most of
   the design.
4. **A standard zip hides contents, not the file list.** Only nesting (or
   `.7z -mhe=on`) hides the manifest.
5. **ZipCrypto is broken.** AES-256 or WebCrypto; nothing else.
6. **An AES zip does not open in Windows Explorer or macOS Archive Utility.**
   That is an audience cost and it is Mike's call, not Ops'.
7. **Unthrottled endpoints are brute-force surfaces**, and nothing is throttled
   today.
8. **Differing error responses are a map.** One answer for every failure.
9. **Cached open-state has an unnameable staleness window.** Do not guard a
   reveal with it.
10. **The museum cannot verify who opened anything** without identity it does
    not have and should not want.
11. **Once served, forever served.** Caches, crawlers, archives and disks are
    outside this repository's reach; a pull-back stops the site and nothing
    else.
12. **There is deliberately no `robots.txt` `Disallow`**, and that ruling holds
    for every new door: *a Disallow line is a public list of what you are
    hiding.*
13. **This document cannot prove secrecy either.** It says where a lock would
    have to live. Whether the thing behind it is actually shut is
    `reveal/reachability.mjs`'s job, and that file's own note applies here
    unchanged: it checks that the lock is still wired to the door.

---

## 5. WHAT OPS WOULD RECOMMEND, IF ASKED

Not asked, and recorded so the next round does not re-derive it.

- **Sealed static files (grade B) for as much as will fit.** No server, no
  state, no daily step, and it survives every failure mode the other grades
  have. The passphrase is the whole mechanism, which is also what the story
  says.
- **The worker for anything that must not be on the visitor's machine at all**,
  with one secret holding many codes.
- **D1 for exactly one thing: the community-property flip.** It is the only
  mechanic that genuinely needs state.
- **Rate limiting before the first typed code ships.**
- **Grade C used deliberately and named as ceremony where it is used**, so no
  future round mistakes a flourish for a lock.

**Nothing above is built. The three grades, the boundary in limit 3, and the
third-door rule are the parts worth carrying forward whatever gets built.**
