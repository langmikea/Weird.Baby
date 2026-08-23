# HANDOFF — for the next Code session

Rewritten **2026-08-23** at the close of the Cowork retirement round, at HEAD
`ea4c967`.

**Session-scoped context only.** Process and standing facts are NOT here — this
round put them in `docs/canonical/OPERATIONS.md`, `STATE.md` and
`docs/OPEN_ACTIONS.md`, and they are deliberately not restated below. If you
want to know how the work moves, read the manual. This file only says what was
in flight when the lights went off.

**This file expects to be outranked.** Per §6: `live tree > git log > STATE.md >
handoffs > any chat memory`. Everything below was true at `ea4c967` and some of
it will not be true when you read it. **Nothing here is a standing order** — a
"next step" in a handoff is a suggestion stamped at write time. Run
`git log --oneline -3` and `git status --short` and believe those instead.

**The previous handoff is superseded and is worth one look before you ignore
it.** It was written 2026-08-17, ran to 21,687 bytes, and named `1b92276` as
HEAD. It is at `ea4c967:docs/HANDOFF_next_session.md`. Its rulings were already
filed in `docs/MUSEUM_RULINGS-20260817.md`, **but its §3 — five mechanisms built
and exercised by nothing, listed so nobody deletes them as dead code — is the
part with no other home.** If you are about to remove something that looks
unused, read that section first.

---

## The day, in seven commits

| hash | what it did |
|---|---|
| `b3812cc` | *(2026-08-22)* The HEAD the archive was cut at. Everything below is after it. |
| `4a0ef11` | Split `OPERATIONS.md` into a ground state and `OPERATIONS_ARCHIVE/`. 291,569 → 32,578 bytes, under a 40,000 ceiling enforced by `tools/ops-size-gate.mjs`. |
| `b82f4c3` | The Cowork census — 110 files, 314 lines — filed as `docs/COWORK-COUNT-20260823.md`, with Mike's ruling that Cowork is retired as a surface. |
| `90cd99b` | The `[MIKE]` marker defined in §0; seven unowned git writes fenced in §9 and the delivery gates. §9 step 1 had been telling sessions to push. |
| `0fa8709` | Cowork retired across the operating docs — seventeen edits, six files. Added §0's rule that the archive is a snapshot and is never edited. |
| `f0da526` | Three register rows (`G-a`, `G-b`, `G-c`) and two §8 hazards, split by the M84 precedent: a note is not an action. |
| `ea4c967` | The desk run as its own step, plus hazard 5 corrected — it was disproved by running the thing it described. |

---

## 1 — Waiting on Mike: three rows, `OPEN_ACTIONS.md` §1

Raised 2026-08-23. **None is urgent and none is ranked on the backlog**, by Ops'
own choice: a queue already holding 132 open rows does not get Ops' own filings
put at the front of it.

- **[G-a](OPEN_ACTIONS.md#g-a)** — `docs/OPS-CHARTER.md` still reads *"v1.0 —
  draft for Mike's review"* and nothing records whether it was ever ratified. It
  assigns standing ownership of backups, secret audits and the quarterly restore
  drill, so it reads as doctrine. The word *draft* was left standing on purpose
  rather than silently promoted.
- **[G-b](OPEN_ACTIONS.md#g-b)** — nothing says which documents get reviewed,
  how often, or on what trigger. First instance: `OPERATIONS.md`. Owner is
  **Mike + Ops**, which the register's exact-match count does not read as Mike.
- **[G-c](OPEN_ACTIONS.md#g-c)** — `CLAUDE.md`'s *"PR bodies"* and *"Squash
  merge"* bullets sit outside the retired-flow fence, same class as the
  branch-naming bullet cut at `0fa8709`.

---

## 2 — Open, and not a defect: the ground state's headroom

`docs/canonical/OPERATIONS.md` is at **36,075 bytes, 90.2% of the 40,000
ceiling**. Headroom went **7,422 → 3,925 across the day's five content commits**.

`npm run ops:size` passes and the file reads whole. **The trend is the thing,
not the number.** The ceiling is an observation, not a taste: 291,683 bytes
could not be returned through the conduit at all, 43,956 came back intact, and
40,000 sits under a demonstrated pass. If a round needs to add a section, the
cut procedure is in §9 and `npm run ops:archive` regenerates the index.

**Do not cut anything pre-emptively on the strength of this paragraph.** Measure
first; it may have moved either way.

---

## 3 — Open, and defect-shaped: two gaps in §4

Both were found this round. Neither was fixed, because neither was in scope.

**§4's rule bodies still describe a paste that no longer always happens.** The
heading was corrected at `0fa8709` to *"anything run host-side"*, but 4.2 is
written about *"scripts pasted line-by-line"* and 4.4 specifies *"PowerShell 7;
single-line or `@'...'@` heredoc"*. Code also runs bash, directly, and did so
throughout this round. The rules are sound; their stated shape is narrower than
what they now govern.

**§4.4 names the heredoc as the sanctioned form and is silent on what it cannot
carry.** Two failures on 2026-08-23, both from quoting:

- one **agent-side, observed this session** — a `cat > file <<'EOF'` heredoc
  died with `unexpected EOF while looking for matching '` and wrote nothing at
  all; the file was produced with the Write tool instead;
- one **in PowerShell, reported rather than observed here.**

Nothing in §4 tells a session which content will break a heredoc, or what to
reach for instead. Worth a rule. Not written.

---

## 4 — Untouched by any ruling: the Cowork round's group B

Six classes were classified *merely unused* and deliberately left standing. The
full list is in `docs/COWORK-COUNT-20260823.md` §6. In short: the two `Cowork`
hazard lead lines in §8; the `_cowork/` scratch-directory ignores in
`.gitignore`, `eslint.config.js` and `tools/asset-table.mjs`; `.gitattributes`'
comment; `CLAUDE.md`'s commit-author line, which describes `.git/config` and is
true today; MediaVault provenance literals; and the dated run reports, logs and
bylines.

**None of this is pending work.** It is recorded so that a later round grepping
`cowork` does not mistake history for staleness and start cutting.

---

## 5 — Two things the next session will meet within an hour

- **`C:\AI\START_HERE.md` is a byte-for-byte copy of
  `docs/canonical/START_HERE.md`,** made after the `0fa8709` push. It is in no
  repository — no history, no diff, no undo. It is **copied, never
  hand-edited.** See the §8 hazard.
- **`docs:numbers:gate` takes about 134 seconds** because it shells out to
  `npx eslint .`. Give it 300s. It will time out under a default ceiling
  whichever way you invoke it. See the §8 hazard, and say which route you ran.

---

## 6 — Gates at close

`docs:numbers:gate` **PASS** — 11 claims across 8 documents.
`ops:size` **PASS** — 36,075 bytes, 90.2% of ceiling.
`npm run desk` clean — every register link on every side page resolves to a live
row. **That check is one-directional and now carries its own §8 hazard:** it
proves every link points at a live row and proves nothing about whether a row is
reachable. `G-a`, `G-b` and `G-c` passed it by not being referenced.

The full packet gate list is §9's, and this round did not run it — no source,
no ledger and no asset changed. **If your round touches any of those, run the
list; do not infer from this line.**
