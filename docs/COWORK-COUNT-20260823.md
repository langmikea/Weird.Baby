# COWORK COUNT — what the operating manual assumes about the working surface

**Date:** 2026-08-23
**Measured at HEAD:** `4a0ef11` · origin/main `4a0ef11` · working tree clean at read time
**Scope:** read-only census of every `cowork` reference in the repo, plus a
ruling on which of them become wrong if Cowork stops being the default surface
for repo work.
**Method:** case-insensitive `cowork` across the whole tree, excluding `.git`,
`node_modules`, `dist`, `dist.pre_*`. `docs/canonical/OPERATIONS.md` read whole
(32,578 bytes). Line numbers are as of `4a0ef11`.

---

## 0. THE RULING

**Mike ruled A on 2026-08-23: Cowork is retired as a surface Mike carries work
to.** Not the git flow, not where Code runs — the app itself, as one of the
three surfaces in `OPERATIONS.md` §2.

**The ruling was needed because no file in the tree could answer the question.**
It was put to him as one numbered question after a check of `CLAUDE.md` failed
to produce the answer Ops had claimed was already there. Before this ruling the
tree contained no statement, in any file, about whether Cowork was still a
surface Mike carries work to. It does now, and this file is where it is written
down.

---

## 1. THE PREMISE, CORRECTED — AND A CONTRADICTION OPS ASSERTED AND WITHDREW

**Ops reported that `CLAUDE.md` already retires Cowork, and that `CLAUDE.md`
and `OPERATIONS.md` therefore contradicted each other. That was wrong, and Ops
withdrew it.** It is recorded here rather than deleted, because the ruling in §0
was made in its place and a ruling reads differently when you know what it
replaced.

**`CLAUDE.md` does NOT retire Cowork as a surface.** It does two narrower
things, and the difference is the whole finding:

1. **It retires the branch-and-PR git flow — and says it is fenced because
   nobody has ruled on that half.** `CLAUDE.md:130-137`, dated 2026-08-13,
   opens: *"EVERYTHING IN THIS SECTION DESCRIBES A WAY OF WORKING THAT WAS
   RETIRED, AND IT IS FENCED RATHER THAN DELETED BECAUSE NOBODY HAS RULED ON
   THE BRANCH-AND-PR HALF."* What it names as retired is
   *"the cowork/PR/squash-merge flow"* — branches, PRs, squash-merge, commits
   made from the sandbox. A retirement notice that names an open ruling on its
   own face is not a retirement of the surface.

2. **Separately, it corrects where Code runs.** `CLAUDE.md:221-227`, under the
   heading *"THE ENVIRONMENT — WINDOWS HOST, AND THIS SECTION USED TO SAY
   OTHERWISE"*, states that Code runs on Mike's Windows host in Claude Code,
   with *"no FUSE mount, no virtiofs, no Linux sandbox, and no `mcp__cowork__*`
   tool."* That is a fact about this agent's own runtime. The heading frames it
   as correcting a wrong description of that runtime.

**`OPERATIONS.md:236` and `CLAUDE.md:227` state the same fact from two sides
and do not conflict.** The manual already says:

> `- Chat Claude NEVER has a "Cowork tool." Cowork is a separate app Mike runs.`
> `  Chat Claude writes Cowork **briefs**; Mike carries them.`

`CLAUDE.md:227` says the agent has no `mcp__cowork__*` tool. That is the same
statement from the agent's side. It confirms §2's model rather than
contradicting it. There was no contradiction in the tree to resolve, and Ops
reported one.

**The class of error:** the claim was built from grep hits and section headings
rather than from the blocks read whole. Reading the two blocks end to end is
what dissolved it. `OPERATIONS.md` §0 EVIDENCE already covers this —
*"reading code is not evidence"* — and it applies to reading prose in fragments
just as well.

---

## 2. THREE FACTS FROM THE TREE — WHY THE PREMISE FAILED

These are recorded because they are the measurements that broke the claim, and
because each one independently shows the manual's Cowork rows being handled by
live rounds rather than left behind.

**F1 — This morning's commit edited both Cowork hazards and kept them.**
`4a0ef11`, committed 2026-08-23 09:11:55 -0400, is the OPERATIONS split. Its
only Cowork-touching diff:

```
-- **Cowork FUSE/sync truncation.** The sandbox has truncated files on
-  Cowork session do read-modify-write on large files; big-file edits are
-- **Cowork mount READ-LAG (2026-07-06).** Files edited via Cowork's
+- **Cowork FUSE/sync truncation.**
+- **Cowork mount READ-LAG (2026-07-06).**
```

A round that ran the same morning read both hazards, shortened them to lead
lines, moved the bodies to `OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS.md`, and left
both standing in the ground state.

**F2 — An edit dated 2026-08-22 sits between two Cowork bullets, and left
both.** `git blame` on §2's "Facts every session must hold" list:

```
347b1e8c  2026-06-09  238) - Cowork folder mounts and delete permissions are **per-session**.
9378d56d  2026-08-22  239) - There is no CI. Deploy is manual and host-side only.
9378d56d  2026-08-22  240)   See §0 DEPLOY — THE ONLY ACCOUNT.
347b1e8c  2026-06-09  241) - Cowork outputs land in
```

The 2026-08-22 edit landed nine days after `CLAUDE.md`'s retirement banner,
inside the same bulleted list, and carried neither neighbour with it.

**F3 — `.git/config` matches `CLAUDE.md:156` exactly, and all 60 recent commits
carry it.**

```
git config --local  user.name   ->  cowork agent
git config --local  user.email  ->  cowork@local
git config --global user.name   ->  langmikea
git config --global user.email  ->  98126530+langmikea@users.noreply.github.com
```

Local overrides global, so **every commit made in this repo is authored
`cowork agent <cowork@local>` regardless of who or what made it.** The last 60
commits — all of them, author and committer alike, including `4a0ef11` — carry
that byline. Mike committing from PowerShell produces it.

**F3 is why the commit log is not evidence about the surface.** The byline is a
config value, not a witness. It is consistent with Cowork being live and with
Cowork being gone, and it settles neither. It is also why `CLAUDE.md:156` moves
to group B in §6.

---

## 3. `docs/canonical/OPERATIONS.md` — 12 lines, 14 occurrences

### §2 — The three surfaces — capabilities matrix

| Line | Text | Weight |
|---|---|---|
| 232 | The `**Cowork** (desktop app)` matrix row — "Full, via per-session folder mount Mike approves \| Yes (sandbox) \| **No** \| Repo reads, big-file edits, multi-file scoping, reports" | **DEPENDS.** One of the three rows the whole surface model is built on. |
| 236-237 | `Chat Claude NEVER has a "Cowork tool." Cowork is a separate app Mike runs. Chat Claude writes Cowork **briefs**; Mike carries them.` | **DEPENDS.** Filed under "Facts every session must hold without rediscovering them." |
| 238 | `Cowork folder mounts and delete permissions are **per-session**.` | **DEPENDS.** Operational rule. |
| 241-243 | `Cowork outputs land in %APPDATA%\Claude\local-agent-mode-sessions\<session>\...\outputs — Mike carries them out` | **DEPENDS.** The only concrete filesystem path Cowork owns anywhere in the manual. |

### §3 — Conduit protocols (how material moves)

| Line | Text | Weight |
|---|---|---|
| 247-249 | `**Chat -> Cowork:** Chat Claude writes a self-contained brief... Mike pastes it into Cowork.` | **DEPENDS.** A whole named protocol, one of three. |
| 251 | `**Cowork -> Chat:** Cowork writes its output file; Mike either uploads it...` | **DEPENDS.** A whole named protocol, one of three. |
| 258 | `big or multi-file goes through Cowork instead (Doctrine #3)` | **DEPENDS.** Active routing rule inside the Host -> Chat protocol. |

### §7 — Working Doctrine

| Line | Text | Weight |
|---|---|---|
| 339 | `3. **Default to Cowork for repo work** — repo reads, big-file edits` | **DEPENDS.** A numbered standing doctrine. Body at `OPERATIONS_ARCHIVE/07-WORKING-DOCTRINE.md:12-14`. |

### §8 — Known hazards

| Line | Text | Weight |
|---|---|---|
| 382 | `- **Cowork FUSE/sync truncation.**` | Conditional. Fires only while someone is on the mount. |
| 383 | `- **Cowork mount READ-LAG (2026-07-06).**` | Conditional. Same. |

### Three more that depend on Cowork and do NOT contain the word

**A keyword count under-reports the manual.** None of these appear in any grep
for `cowork`:

- **L219-221 (§1)** — *"carries material between the three surfaces below.
  Nothing moves between surfaces unless Mike moves it."* The carry model is
  defined by the §2 table; remove a row and this sentence loses a third of its
  referent.
- **L229 (§2 heading)** — *"The three surfaces — capabilities matrix."* The
  number is in the heading.
- **L384-385 (§8)** — `**Virtiofs:** phantom deletions in git status from the
  sandbox` and `**~16KB post-edit boundary** silently tail-truncates patched
  files`. Both are Cowork-sandbox hazards named by mechanism instead of by
  surface.

---

## 4. COUNTS BY FILE

**Repo-wide: 110 files, 314 matching lines**, excluding `.git`, `node_modules`,
`dist*`. Under `docs/`: 89 files, 254 lines.

### `docs/canonical/OPERATIONS_ARCHIVE/` — 2 files, 4 lines

| File | Lines | What |
|---|---|---|
| `08-KNOWN-HAZARDS.md` | 3 (`33`, `35`, `38`) | Bodies of the two §8 hazard lead-lines. |
| `07-WORKING-DOCTRINE.md` | 1 (`12`) | Body of Doctrine 3. |

### `CLAUDE.md` — 8 lines

| Line | What | Note |
|---|---|---|
| 136 | "The cowork/PR/squash-merge flow below has not been used since at least 11 August." | Inside the [2026-08-13] RETIRED banner at :130. |
| 142, 144 | "you usually run inside a Cowork Linux sandbox"; "You make edits + commits in the cowork sandbox" | Inside the `<details>` fence (:139-149). |
| 155 | Branch naming — "Slashed names like `ux/foo` fail in the cowork sandbox" | **Outside the fence**, under `### Conventions`. |
| 156 | "Commit author from cowork: `cowork agent <cowork@local>`" | **Outside the fence.** See F3 and §6 group B. |
| 164 | `eslint.config.js` ignores `_cowork/` — inside the lint-baseline paragraph | Describes the ignore, not the surface. |
| 219 | "This paragraph used to explain that the cowork sandbox built for Linux..." | Already past tense. |
| 227 | "There is no FUSE mount, no virtiofs, no Linux sandbox, and no `mcp__cowork__*` tool." | Standing negative about Code's runtime, 2026-08-13. |

### `STATE.md` — 6 lines

| Line | What |
|---|---|
| 14 | `"Cowork reported"` listed as an off-ramp phrase. Negative usage. |
| 2592 | "Brief executed via Cowork, stages 1-5" — dated record. |
| 2701 | Doctrine 2 — "Use pwsh (read-only) or Cowork to read real code/data." |
| 2704, 2706, 2707 | Doctrine 3 — "**Default to Cowork for repo work.** ... prefer a Cowork task over chat-driven pwsh paste-back: Cowork has full repo reach, is faster..." |

### Elsewhere under `docs/` — 89 files, 254 lines

Live canonical / operating docs, as distinct from run reports:

| File | Lines | Load-bearing? |
|---|---|---|
| `docs/OPS-CHARTER.md` | 9 (`5,6,27,46,49,104,107,116,130`) | **Yes.** "Enforcement happens in Cowork"; "§8. First Cowork run — ordered checklist"; the backup routine "scripts it in Cowork". |
| `docs/canonical/START_HERE.md` | 4 (`18,30,32,58`) | **Yes.** The cross-project bootstrap. Tells a fresh agent its surface is "Cowork / Claude Code" and names the Cowork brief as the standard carry. |
| `docs/MUSEUM_OPS.md` | 4 (`12,13,18,25`) | **Yes.** "Cowork edits files. Mike runs all git commands on Windows." |
| `docs/canonical/B1_IMPLEMENTATION_PLAN.md` | 5 (`3,950,1148,1172,1304`) | Drafting provenance and a risk row. Status: "Cowork-drafted, awaiting operator review. Not committed." |
| `docs/canonical/UX_LIFECYCLE_SPEC_v0.5.md` | 1 (`229`) | Stamped next-step suggestion ("a separate Cowork session"). |
| `docs/canonical/VISION_LOCK_v0.3.md` | 1 (`7`) | Byline: "Author: Cowork Claude". |
| `docs/canonical/UX_SPEC_v0.3.md` | 1 (`5`) | Byline. |
| `docs/START_HERE-20260612.md` | 3 | Superseded dated copy. |

**Highest-volume files, all dated run reports / audits / logs:**
`DEPLOY_RUN_REPORT-20260523-144857.md` (16),
`TAGGING_SYSTEM_AUDIT-20260524T155635Z.md` (13),
`CRITERION3_RUN_REPORT-20260518-235002.md` (12),
`STATUS_TAXONOMY_RESEARCH.md` (9),
`OPERATIONAL_HYGIENE_RUN_REPORT-20260525T192539Z.md` (9),
`UX_PRESETS_SPEC.md` (7),
`INGEST_BEHAVIOR_AUDIT-20260522-182616.md` (7),
`PHASEB_RUN_REPORT-20260522-010001.md` (6),
`PHASE2A_RUN_REPORT-20260520-162150.md` (6),
then a tail of roughly 70 files at 1-5 lines each.

**Clean — zero matches:** `docs/HANDOFF_next_session.md`, `docs/OPEN_ACTIONS.md`,
`docs/THREADS.md`.

### Outside `docs/`, beyond the four named files — 12 files

`DECISION_BRIEF_target_data_architecture.md` (8),
`DATA_ARCHITECTURE_SPEC_v1.1.md` (6), `NAVIGATION.md` (4),
`PHASE_1_REPORT.md` (3), `PHASE_2A_REPORT.md` (2),
`DATA_ARCHITECTURE_SPEC_v0.1_critique.md` (2), `BACKLOG.md` (2), plus the
config and tooling files in §5. Also 6 files under untracked `_cowork/`
(14 lines).

---

## 5. TOOLING, SCRIPTS, NPM TASKS

**No npm script mentions Cowork.** All 74 entries in `package.json` scripts are
clean — 0 matches.

**No tool reads or writes a Cowork mount or output path.** The only reference
to `%APPDATA%\Claude\local-agent-mode-sessions\...\outputs` in the entire repo
is the prose at `OPERATIONS.md:242`. Nothing executes against it.

`npm run conduit` (`tools/conduit-drop.mjs:104`) targets `G:\My Drive\_conduit`,
overridable by `WB_CONDUIT`. That is the **Drive** conduit, not Cowork.

What does exist is about the `_cowork/` **scratch directory**, not about a mount:

| File | Line | What it does |
|---|---|---|
| `.gitignore` | 35 | `_cowork/` — untracked. Confirmed: `git ls-files` filtered for `cowork` returns nothing; 30 files sit on disk. |
| `eslint.config.js` | 11, 17 | `globalIgnores([... '_cowork' ...])`. Part of what holds the 9 errors / 8 warnings lint baseline. |
| `tools/asset-table.mjs` | 98 | `SKIP_DIR` includes `"_cowork"` — the asset scanner walks disk and skips it. |
| `.gitattributes` | 2 | Comment only: "Cowork (Linux) and Mike (Windows) co-author this repo." Justifies `* text=auto eol=lf`. The rule is not conditional on the comment. |
| `tools/rwth_album_mvwrite.py` | 205, 213 | Writes literals into MediaVault rows: `"created_by": "cowork_rwth_album"`, source `"cowork"`. Already-written provenance, not a path. |
| `tools/youtube-ingest-schema.md` | 167 | Prose suggestion to document deviations in `Hunter Root\_cowork\` — a different repo. |

`NAVIGATION.md:54, 81, 193, 307` point at MediaVault's
`_cowork/YT_INGEST_FROM_MUSEUM.md` — cross-repo pointers, not this repo's mount.

**One adjacent fact for whoever cuts the edit:** `tools/ops-size-gate.mjs` caps
`OPERATIONS.md` at 40,000 bytes. It is at 32,578 — **7,422 bytes of headroom.**
The gate has no Cowork dependence. `npm run docs:numbers` measures none of the
values in this file.

---

## 6. WRONG vs. MERELY UNUSED

Under the ruling in §0.

### GROUP A — BECOMES WRONG (asserts something false, or routes work to a door that is not there)

1. **`OPERATIONS.md:232`** — the §2 matrix row. Publishes Cowork as one of three
   current surfaces with repo write access.
2. **`OPERATIONS.md:236-243`** — the four "facts every session must hold without
   rediscovering them." The `%APPDATA%` output path at :241-243 is the one a
   session would actually go looking in.
3. **`OPERATIONS.md:247-249` and `:251`** — Chat -> Cowork and Cowork -> Chat.
   Two of the three named conduits in §3.
4. **`OPERATIONS.md:258`** — "anything big or multi-file goes through Cowork
   instead." An active routing instruction.
5. **`OPERATIONS.md:339` + `OPERATIONS_ARCHIVE/07-WORKING-DOCTRINE.md:12-14`** —
   Doctrine 3, "Default to Cowork for repo work." A numbered standing doctrine
   naming the default.
6. **`STATE.md:2701` and `:2704-2707`** — Doctrines 2 and 3 in STATE's mirror.
   Same instruction, second location. Note §7's own [FLAG 2026-08-23]: STATE
   carries 6 doctrines against §7's 27, but Doctrine 3 is one of the 6 that IS
   mirrored, so this lands in both files.
7. **`docs/canonical/START_HERE.md:18, 30-32, 58`** — the cross-project
   bootstrap, canonical here and real at `C:\AI\START_HERE.md`. :18 tells an
   agent to identify itself as "Cowork / Claude Code"; :30-32 makes the Cowork
   brief the standard carry; :58 tells a chat session its cheapest orientation
   channel is a Cowork brief. **This is the first file a fresh session outside
   this repo reads.**
8. **`docs/MUSEUM_OPS.md:18, 25`** — "Cowork edits files. Mike runs all git
   commands on Windows." / "No Cowork-side git operations." Stated as the
   current division of labour.
9. **`docs/OPS-CHARTER.md:5, 6, 27, 104, 107, 116, 130`** — "This chat defines
   the standard; **Cowork enforces it**"; "§8. First Cowork run — ordered
   checklist"; the backup routine "scripts it in Cowork... because that's where
   the access is"; and the closing "Enforcement happens in Cowork." Assigns
   standing ownership of enforcement and backups to the surface.
10. **`CLAUDE.md:155`** — branch naming. "Slashed names like `ux/foo` fail in
    the cowork sandbox — the FUSE mount can't create subdirectories under
    `.git/refs/heads/`." Sandbox-specific, and published **outside** the
    retired-flow `<details>` fence while `:136` says the surviving conventions
    are only "the commit-message and out-of-scope habits."
11. **`OPERATIONS.md:219-221` and `:229`** — the §1 carry model and the §2
    heading, both of which count to **three**. Neither contains the word
    `cowork`; neither shows in any grep for it.

> **[SETTLED 2026-08-23 · the count]** **Group A is ELEVEN entries.** Ops
> published ten. Code counted eleven against the list and reported the
> discrepancy rather than trimming to match. Ops accepted the correction the
> same day, and eleven is the settled figure.
>
> **The arithmetic, kept because it is the reason:** the step-1 list carried
> eleven entries, and entry 10 held two line references — `CLAUDE.md:155` and
> `:156`. The ruling moves `:156` to group B but keeps `:155` in group A, so
> entry 10 survives with one reference instead of two and **no entry is
> removed**. 11 − 0 = 11. "Ten" came from 11 − 1, which subtracts a
> *reference* from a count of *entries*.
>
> **The list was never trimmed to match the number.** Per §9's reason for the
> numbers gate: publishing a wrong count does not weaken the tripwire, it
> inverts it. The number moved to the list, not the list to the number.

### GROUP B — MERELY BECOMES UNUSED (true, harmless, instructs nothing)

1. **`OPERATIONS.md:382-383` + `OPERATIONS_ARCHIVE/08-KNOWN-HAZARDS.md:33-45`** —
   the FUSE/sync truncation and mount READ-LAG hazards. Accurate warnings that
   stop firing. Same for §8's unlabeled `:384` virtiofs and `:385` 16KB-boundary
   rows.
2. **`.gitignore:35`, `eslint.config.js:11, 17`, `tools/asset-table.mjs:98`** —
   all three ignore the `_cowork/` directory, which exists on disk with 30
   files. They stay correct as long as it exists, independent of whether anyone
   works in Cowork. Removing any of them would move the lint baseline or add
   asset-table rows.
3. **`.gitattributes:2`** — the comment's rationale goes stale; `* text=auto
   eol=lf` stays right on its own merits.
4. **`CLAUDE.md:156`** — "Commit author from cowork: `cowork agent
   <cowork@local>`." **Moved here from group A by the ruling of 2026-08-23.**
   It documents a git config, not a surface, and **it is true today**:
   `.git/config` sets `user.name = cowork agent` and `user.email = cowork@local`
   locally, overriding Mike's global identity, and the last 60 commits all carry
   it (F3). Changing this line would mean changing Mike's git config, **which is
   a separate decision and has not been made.**
5. **`tools/rwth_album_mvwrite.py:205, 213`** — provenance literals already
   written into MediaVault rows. Changing the strings would falsify existing
   records.
6. **`tools/youtube-ingest-schema.md:167`, `NAVIGATION.md:54, 81, 193, 307`** —
   pointers into other repos' `_cowork/` directories. Resolve or don't,
   regardless of this ruling.
7. **`CLAUDE.md:136, 142, 144, 219, 227`** — already fenced, already past tense,
   or already negative. `:227` becomes more correct, not less.
8. **`STATE.md:14`** — "Cowork reported" as an example off-ramp phrase. Negative
   usage; still a valid illustration.
9. **`STATE.md:2592`** — "Brief executed via Cowork, stages 1-5." Dated record
   of shipped work.
10. **`docs/canonical/VISION_LOCK_v0.3.md:7`, `UX_SPEC_v0.3.md:5`** — bylines.
    "Author: Cowork Claude."
11. **`docs/canonical/B1_IMPLEMENTATION_PLAN.md:3, 950, 1148, 1172, 1304`** —
    drafting provenance and a risk row about a session that already happened.
12. **`docs/canonical/UX_LIFECYCLE_SPEC_v0.5.md:229`** — a proposed next step.
    §6 already rules that a stamped recommended-next-step is a suggestion, not a
    standing order.
13. **`docs/START_HERE-20260612.md:13`** — dated, superseded by the canonical
    copy.
14. **The bulk — roughly 85 files, ~230 lines** of dated run reports, audits,
    ingest logs, handoffs and phase reports under `docs/`, plus 6 untracked
    files under `_cowork/`. §0 BREADCRUMBS and §9's numbers-gate note say the
    same thing about this class: a recorded measurement is history, and
    rewriting it falsifies the record that makes the tripwire legible.

---

## 7. SHAPE OF THE EDIT THAT FOLLOWS

Not a proposal — an observation for whoever cuts it.

**Group A is concentrated in six files:** `docs/canonical/OPERATIONS.md`
(§1, §2, §3, §7), `STATE.md` (Doctrines 2-3),
`docs/canonical/START_HERE.md`, `docs/OPS-CHARTER.md`, `docs/MUSEUM_OPS.md`,
`CLAUDE.md` (`:155`), plus one archive body
(`OPERATIONS_ARCHIVE/07-WORKING-DOCTRINE.md:12-14`).

**Everything else — 14 categories, roughly 100 files — is history, bylines, or
scratch-directory ignores.**

**No tooling breaks.** Nothing executes against a Cowork mount or output path.

**Two things a keyword-driven edit would miss**, both recorded above: the
§1/§2 "three surfaces" count, which never says `cowork` (§3, group A item 11);
and §8's virtiofs and 16KB rows, which are Cowork hazards named by mechanism
(§3, group B item 1).

---

*Counted read-only at HEAD `4a0ef11`. This file is the record; the chat was the
delivery. Nothing else was written and no existing file was edited in the round
that produced it.*
