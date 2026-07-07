# COWORK BRIEF — Derived-Era Re-Wire (EXECUTES — MV data + client + deploy)
**ID:** DERIVED_ERA_REWIRE-20260707 · **Status:** READY · **Authority order:** docs/derived-era-WIP/DERIVED_ERA_WIP_STATE.md (PRIMARY — it knows where the 6/17 incident left things) > derived-era-spec_v0.2.md > DERIVED_ERA_PRETEST_REPORT > this brief. Brief yields to WIP state on any conflict — flag, don't improvise.

## The scar (read first)
2026-06-17: this workstream produced a corrupted client build by trusting a build log over the live disk. It's the incident that created Ops Rule 0. Consequences baked in here: client re-wire is HOST-SIDE ONLY (Mike edits/builds via scripts you write — no sandbox writes to client source); every "already done" claim from the WIP docs gets re-verified against the live tree THIS session before being acted on; fixed depth, NO slider (locked decision, do not revisit).

## Hard rules
- Stage 0 backup of mediavault.sqlite IF any DB write is in scope (Stage 1 determines this from WIP state — referenced-dates migration may already have run, or not). If yes: backup mandatory + verified before it.
- All DB writes host-side PowerShell (virtiofs/SQLite hazard). All client-source edits host-side. Commits host-side. Commit gate every stage.
- One stage at a time; explicit "pass" per gate. Delegation split per standing arrangement (2026-07-07): verification gates delegated to Ops-Claude (clean = pass, anomaly escalates); destructive/DB-swap go-aheads and all UX-visible judgments stay with Mike.

## Stage 1 — Ground-truth the WIP (read-only)
Read WIP_STATE + pretest report + spec. Then VERIFY every claimed completion against live DB and live tree (Ops Rule 0 — this workstream is why). Produce a delta: (a) what is actually done, (b) what remains, with exact steps, (c) whether referenced-dates data migration is pending (determines Stage 0 backup), (d) what "fixed depth" resolves to concretely in era-config.json, (e) which client files the re-wire touches. GATE: delta review (delegated if clean; anomalies escalate).

## Stage 2 — Data completion (host-side, only if Stage 1 says pending)
Referenced-dates migration and/or era derivation run per WIP tooling (era-derivation.mjs / migrate-referenced-dates). Backup-gated. Verification battery defined by the pretest report's expected outputs. GATE: paste-back verified.

## Stage 3 — Export with derived era
Re-run export; verify era facets in hunter_root.json + vocabulary reflect DERIVED eras, and the per-artifact era assignments match the pretest's expected distribution (pretest report is the oracle — divergence = STOP, not shrug). GATE: verified.

## Stage 4 — Client re-wire (HOST-SIDE ONLY)
Scripts/edit-instructions Mike executes: filter board + any era consumers read derived era, fixed depth, no slider. Local preview gate: MIKE eyeballs the filter board — era pills correct, counts sane, nothing regressed. THIS GATE IS MIKE'S, undelegated (UX-visible).

## Stage 5 — Deploy + close
dist clean-remove → build → preview → deploy → verify live. STATE.md: SHIPPED block + remove "derived-era re-wire" from NEXT + flip the press-batch gate to UNBLOCKED. Run log committed. Session-close clean.

## Unblocks on completion
Press batch (16 URLs) — ingestion was explicitly gated behind this. Next brief follows.

## Out of scope
Press ingestion itself · any era-slider or variable-depth UI (locked: no) · fact display · vocabulary changes beyond what era derivation itself requires (any such need = flag and stop).
