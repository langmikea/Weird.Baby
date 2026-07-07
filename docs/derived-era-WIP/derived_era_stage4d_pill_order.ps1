# ═══════════════════════════════════════════════════════════════════════════
# derived_era_stage4d_pill_order.ps1 — DERIVED_ERA_REWIRE-20260707 · Stage 4d
# Order ruling 2026-07-07 (Mike): era pills read CHRONOLOGICALLY (bucket order
# from era-buckets.json), replacing the alphabetical-by-slug default. Era only —
# every other facet keeps its existing order. DISPLAY/ORDER ONLY.
#
# Run from the repo root on a Stage-4b-applied tree (4c order-independent):
#   pwsh docs/derived-era-WIP/derived_era_stage4d_pill_order.ps1
#
# Every path this script touches:
#   WRITES: src/routes/hr/HrExhibitFlow.jsx  (2 anchored edits, the ONLY file)
#
# Grounding (verified host-side this session): pill columns, board totals and
# the filter overlay all consume dim.values / dim.options, and the column
# tables resolve from those arrays at module load AFTER the era label loop —
# so sorting options+values inside that loop propagates to every consumer.
# ═══════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
function Abort($msg) { Write-Host "ABORT: $msg" -ForegroundColor Red; exit 1 }

if (-not (Test-Path "package.json") -or -not (Test-Path "src/routes/hr/HrExhibitFlow.jsx")) { Abort "run me from the repo root (weird-baby-museum)" }
$path = "src/routes/hr/HrExhibitFlow.jsx"
$flow = [System.IO.File]::ReadAllText($path)
if (-not $flow.Contains("ERA_DISPLAY")) { Abort "Stage 4b not applied — run derived_era_stage4b_labels.ps1 first" }
if ($flow.Contains("ERA_SLUGS")) { Abort "file already carries ERA_SLUGS ordering — refusing to double-apply" }
$NL = "`n"; if ($flow.Contains("`r`n")) { $NL = "`r`n" }
$linesBefore = ([regex]::Matches($flow, "`n")).Count + 1

# ── anchors (each exactly once) ──────────────────────────────────────────────
$aImp = 'import { eraForRecord, ERA_DISPLAY } from "./hr_era.js";'
$aLoop = @(
  'for (const d of HR_DIMENSIONS) {',
  '  if (d.key === "era") { for (const o of d.options) o.label = ERA_DISPLAY[o.slug] ?? o.label; }',
  '}'
) -join $NL
foreach ($a in @($aImp, $aLoop)) {
  $n = ([regex]::Matches($flow, [regex]::Escape($a))).Count
  if ($n -ne 1) { Abort "anchor occurs $n times (need exactly 1): $($a.Substring(0, [Math]::Min(70, $a.Length)))" }
}

# ── E1: import ERA_SLUGS ─────────────────────────────────────────────────────
$flow = $flow.Replace($aImp, 'import { eraForRecord, ERA_DISPLAY, ERA_SLUGS } from "./hr_era.js";')

# ── E2: chronological sort inside the era loop ───────────────────────────────
$newLoop = @(
  'for (const d of HR_DIMENSIONS) {',
  '  if (d.key === "era") {',
  '    for (const o of d.options) o.label = ERA_DISPLAY[o.slug] ?? o.label;',
  '    // Order ruling 2026-07-07: era pills read CHRONOLOGICALLY — bucket order',
  '    // from era-buckets.json (ERA_SLUGS), not the alphabetical default other',
  '    // facets keep. Sorting options AND values here at module load propagates',
  '    // to every consumer (pill columns, board totals, filter overlay): the',
  '    // column tables are resolved from these arrays after this loop runs.',
  '    const eraRank = (s) => { const i = ERA_SLUGS.indexOf(s); return i === -1 ? 99 : i; };',
  '    d.options.sort((a, b) => eraRank(a.slug) - eraRank(b.slug));',
  '    d.values = d.options.map(o => o.slug);',
  '  }',
  '}'
) -join $NL
$flow = $flow.Replace($aLoop, $newLoop)

# ── verify BEFORE writing ────────────────────────────────────────────────────
$checks = @{ "ERA_SLUGS" = 3; "eraRank" = 3 }   # import+comment+def · def+2 comparator uses
foreach ($k in $checks.Keys) {
  $n = ([regex]::Matches($flow, [regex]::Escape($k))).Count
  if ($n -ne $checks[$k]) { Abort "post-edit '$k' count $n != $($checks[$k]) — NOT writing" }
}
[System.IO.File]::WriteAllText($path, $flow, [System.Text.UTF8Encoding]::new($false))
$post = [System.IO.File]::ReadAllText($path)
$linesAfter = ([regex]::Matches($post, "`n")).Count + 1
Write-Host "written: delta +$($linesAfter - $linesBefore) lines (expected +10)"
if (($linesAfter - $linesBefore) -ne 10) { Abort "line delta wrong — restore: git checkout -- $path" }

# ── verification (paste back) ────────────────────────────────────────────────
Select-String -Path $path -Pattern "ERA_SLUGS|eraRank" | ForEach-Object { "{0,6}: {1}" -f $_.LineNumber, $_.Line.Trim() }
git --no-optional-locks diff --stat -- $path
Write-Host ""
Write-Host "STAGE 4d SCRIPT COMPLETE — eyeball gate: /hr Filters, era pills in bucket order:"
Write-Host "  2013 · The Band Years | 2017 · Going Solo | 2019 · Life Inside a Wheel | 2020 · Dandelions"
Write-Host "  2021 · Skipping Stones | 2022 · The Arkansas Era | 2024–now · Crooked Home"
Write-Host "  (If 4c not yet run: order is chronological over the OLD 5 labels — run 4c for the 7-set.)"
Write-Host "Commit rides the combined Stage 4 commit printed by stage 4c (HrExhibitFlow.jsx is already in its git-add list; add docs/derived-era-WIP/derived_era_stage4d_pill_order.ps1 alongside)."
# EOF-SENTINEL: derived_era_stage4d_pill_order.ps1 v1 — if "STAGE 4d SCRIPT COMPLETE" never printed, the run aborted or this file is truncated.
