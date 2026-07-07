# COWORK BRIEF — FactScroller Re-Plumb + First Recipe Cards (EXECUTES — export, client, MV, deploy)
**ID:** FACTSCROLLER_REPLUMB-20260707 · **Status:** READY · **Authority:** FACTSCROLLER_SPEC_v1.0.md (Mike's locked rulings) > PUV_FACT_MODEL_SPEC.md > this brief. Spec sequencing A+B only.

## What ships
1. Player scroller reads the 97-fact vault instead of static hr_facts.js — SAME look, bounce, placement, timing. Recipe = now-playing track, climbing track → album → era → artist (unsignaled). Weight = selection frequency.
2. Recipe cards: MV artifact shape for living cards + TWO pilots — "Nick Root" and "Arkansas reviews" (both buildable from the speaker axis + scopes). Wall cards, filter-obedient.
3. Facts reach visitors ONLY through scrollers/recipe cards — NEVER as standalone wall tiles (Mike's standing ruling). Enforce structurally, not by convention.

## Hard rules (standing)
Stage 0 MV backup if any MV write (recipe-card inserts = yes). Host-side MV writes + commits. Commit gate per stage. Explicit pass per gate; delegation split standing (verification delegated; UX-visible + wording gates are MIKE'S). Volume-before-polish: NO font/motion/style changes — any temptation gets flagged, not applied.

## Stage 1 — Ground-truth + design delta (read-only)
Read current scroller implementation (hr_facts.js consumer in the player region), exporter fact handling, Exhibit contract. Delta: (a) exact export path for facts (separate facts payload vs embedded — must keep facts off the wall structurally), (b) release-status call: do facts flip to released with exporter routing, or export-from-vault via explicit facts channel — recommend one, flag tradeoffs, (c) recipe-card artifact shape (card_kind + recipe query in payload) with the two pilot definitions, (d) climb + weight selection algorithm at the scroller, (e) fate of hr_facts.js static set (recommend: retire after parity check — its facts should already be superseded or get vaulted as facts if any are unique — flag which). GATE: delta review.

## Stage 2 — Export + data (host-side where MV writes)
Implement facts export per delta. Insert the two recipe-card artifacts (Papa-voice titles/blurbs → MIKE'S WORDING GATE before insert). Verify: facts payload present, wall payload contains zero fact tiles, recipe cards present as wall artifacts. Commit gate.

## Stage 3 — Client re-plumb (HOST-SIDE client edits)
Scroller reads facts payload via track recipe + climb + weight. Recipe cards render as living cards (existing card shell, scrolling text region) obeying global filter. Breadcrumb icon = OUT (extra credit, later). Local preview → MIKE'S EYEBALL GATE: play a track, watch the scroller cycle real facts; filter the wall, find both recipe cards alive; confirm look unchanged from the version he likes.

## Stage 4 — Deploy + close
dist clean → build → preview gate → deploy → live walk (Mike) → STATE.md SHIPPED → run log → session-close clean.

## Out of scope
Font/motion/style polish (Mike-gated, later, after volume proves itself) · breadcrumb icon · additional recipe cards beyond the two pilots · FB harvest · Lobby scroller (April sketch — separate ruling someday).
