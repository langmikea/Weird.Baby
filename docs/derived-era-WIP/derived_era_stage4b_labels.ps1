# ═══════════════════════════════════════════════════════════════════════════
# derived_era_stage4b_labels.ps1 — DERIVED_ERA_REWIRE-20260707 · Stage 4b
# Gate ruling 2026-07-07 (Mike): era pill labels go DATE-LED —
#   "<year range from bucket config> · <soft descriptor>", era-of-period voice.
# Wording set approved at the UX gate: Hybrid.
# DISPLAY ONLY — no derivation, weight, slug, or override changes.
#
# Run from the repo root, on the Stage-4-applied tree:
#   pwsh docs/derived-era-WIP/derived_era_stage4b_labels.ps1
#
# Every path this script touches (all writes):
#   WRITES: src/data/era-buckets.json        (adds optional `display` per bucket; full rewrite)
#   WRITES: src/routes/hr/hr_era.js          (adds ERA_DISPLAY export; anchored insert)
#   WRITES: src/routes/hr/HrExhibitFlow.jsx  (import + displayFor wrap; 2 anchored edits)
# ═══════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
function Abort($msg) { Write-Host "ABORT: $msg" -ForegroundColor Red; exit 1 }

if (-not (Test-Path "package.json") -or -not (Test-Path "src/routes/hr/HrExhibitFlow.jsx")) { Abort "run me from the repo root (weird-baby-museum)" }

# ── guards: Stage 4 applied, Stage 4b not yet ────────────────────────────────
$flow = [System.IO.File]::ReadAllText("src/routes/hr/HrExhibitFlow.jsx")
if (-not $flow.Contains("eraForRecord")) { Abort "Stage 4 era wiring not present — run derived_era_stage4.ps1 first" }
if ($flow.Contains("ERA_DISPLAY")) { Abort "HrExhibitFlow.jsx already carries ERA_DISPLAY — refusing to double-apply" }
$hrEra = [System.IO.File]::ReadAllText("src/routes/hr/hr_era.js")
if ($hrEra.Contains("ERA_DISPLAY")) { Abort "hr_era.js already carries ERA_DISPLAY — refusing to double-apply" }

# ── 1. era-buckets.json — approved Hybrid display labels (full rewrite) ─────
$buckets = @'
{
  "schema": "era-buckets v0.2 — committed client config (imported by hr_era.js next to vocabulary.json)",
  "authority": "docs/derived-era-spec_v0.2.md §3.2",
  "note": [
    "The ONLY file Mike edits on each bucket revision (≥3 expected near-term).",
    "Maps a year range -> era label. The client maps each record's weighted",
    "date-set through these ranges at read time, so editing this file changes",
    "nothing about the baked artifacts — no re-export, no MV write.",
    "rwth is DROPPED as a value: it folds into Early Days by date (2016).",
    "The era SLUG used for tag membership is derived from the label by",
    "lowercasing and replacing runs of non-alphanumerics with underscores",
    "('Early Days' -> 'early_days'), which matches the existing MV era: slugs.",
    "display: OPTIONAL date-led pill label (gate ruling 2026-07-07, Hybrid set).",
    "DISPLAY ONLY — the slug still derives from `label`; omit `display` and the",
    "client falls back to '<years> · <label>'. On a bucket revision, update the",
    "years inside `display` along with start/end."
  ],
  "buckets": [
    { "label": "Early Days",        "start": 2016, "end": 2018, "display": "2016–2018 · The Early Days" },
    { "label": "Finding the Sound", "start": 2019, "end": 2020, "display": "2019–2020 · Finding the Sound" },
    { "label": "Breakthrough",      "start": 2021, "end": 2022, "display": "2021–2022 · The Breakthrough Years" },
    { "label": "On the Road",       "start": 2023, "end": 2024, "display": "2023–2024 · On the Road" },
    { "label": "Recent",            "start": 2025, "end": 2025, "display": "2025 · The Recent Era" }
  ]
}
'@
[System.IO.File]::WriteAllText("src/data/era-buckets.json", $buckets + "`n", [System.Text.UTF8Encoding]::new($false))
node -e "const b=require('./src/data/era-buckets.json');if(!Array.isArray(b.buckets)||b.buckets.length!==5)throw new Error('bucket count');if(b.buckets.some(x=>!x.display))throw new Error('display missing');console.log('era-buckets.json OK: 5 buckets, 5 display labels');b.buckets.forEach(x=>console.log('  '+x.display))"
if ($LASTEXITCODE -ne 0) { Abort "era-buckets.json rewrite failed validation — restore: git checkout -- src/data/era-buckets.json" }

# ── 2. hr_era.js — ERA_DISPLAY export (anchored insert) ─────────────────────
$NL = "`n"; if ($hrEra.Contains("`r`n")) { $NL = "`r`n" }
$aSlugs = 'export const ERA_SLUGS = ERA_BUCKETS.map(b => eraSlug(b.label));'
if (([regex]::Matches($hrEra, [regex]::Escape($aSlugs))).Count -ne 1) { Abort "hr_era.js anchor not unique: ERA_SLUGS line" }
$insert = @(
  $aSlugs,
  '',
  '// Date-led display labels for era pills (gate ruling 2026-07-07): slug ->',
  '// "<year range> · <soft descriptor>", sourced from the bucket config''s',
  '// optional `display` (fallback: "<years> · <label>"). DISPLAY ONLY — slugs,',
  '// derivation, weights and overrides untouched. A bucket revision that moves',
  '// the bounds updates the visible years in era-buckets.json alone.',
  'export const ERA_DISPLAY = Object.fromEntries(ERA_BUCKETS.map(b => [',
  '  eraSlug(b.label),',
  '  b.display || `${b.start === b.end ? b.start : `${b.start}–${b.end}`} · ${b.label}`,',
  ']));'
) -join $NL
$hrEra2 = $hrEra.Replace($aSlugs, $insert)
[System.IO.File]::WriteAllText("src/routes/hr/hr_era.js", $hrEra2, [System.Text.UTF8Encoding]::new($false))
Write-Host "hr_era.js: ERA_DISPLAY export inserted (+10 lines)"

# ── 3. HrExhibitFlow.jsx — import + displayFor wrap (2 anchored edits) ──────
$aImp = 'import { eraForRecord } from "./hr_era.js";'
$aDes = 'const { HR_DIMENSIONS, HR_GROUP_LABELS, displayFor } = buildDimensions(ARTIFACTS);'
$FNL = "`n"; if ($flow.Contains("`r`n")) { $FNL = "`r`n" }
foreach ($a in @($aImp, $aDes)) {
  $n = ([regex]::Matches($flow, [regex]::Escape($a))).Count
  if ($n -ne 1) { Abort "HrExhibitFlow.jsx anchor occurs $n times (need 1): $a" }
}
$linesBefore = ([regex]::Matches($flow, "`n")).Count + 1
$flow = $flow.Replace($aImp, 'import { eraForRecord, ERA_DISPLAY } from "./hr_era.js";')
$wrap = @(
  'const { HR_DIMENSIONS, HR_GROUP_LABELS, displayFor: displayForBase } = buildDimensions(ARTIFACTS);',
  '// Era pill labels go date-led (gate ruling 2026-07-07): "<years> · <descriptor>"',
  '// from src/data/era-buckets.json via ERA_DISPLAY (hr_era.js). DISPLAY ONLY —',
  '// slugs and derivation untouched. Every era value render routes through',
  '// displayFor (pills, chips, board columns, filter search — verified), so this',
  '// wrap covers them all; option labels are remapped for any direct consumer.',
  'const displayFor = (group, slug) =>',
  '  (group === "era" && ERA_DISPLAY[slug]) ? ERA_DISPLAY[slug] : displayForBase(group, slug);',
  'for (const d of HR_DIMENSIONS) {',
  '  if (d.key === "era") { for (const o of d.options) o.label = ERA_DISPLAY[o.slug] ?? o.label; }',
  '}'
) -join $FNL
$flow = $flow.Replace($aDes, $wrap)

$checks = @{ "ERA_DISPLAY" = 5; "displayForBase" = 2 }   # import+comment+wrap(2)+loop · destructure+wrap
foreach ($k in $checks.Keys) {
  $n = ([regex]::Matches($flow, [regex]::Escape($k))).Count
  if ($n -ne $checks[$k]) { Abort "post-edit '$k' count $n != $($checks[$k]) — NOT writing HrExhibitFlow.jsx" }
}
[System.IO.File]::WriteAllText("src/routes/hr/HrExhibitFlow.jsx", $flow, [System.Text.UTF8Encoding]::new($false))
$post = [System.IO.File]::ReadAllText("src/routes/hr/HrExhibitFlow.jsx")
$linesAfter = ([regex]::Matches($post, "`n")).Count + 1
Write-Host "HrExhibitFlow.jsx written: delta +$($linesAfter - $linesBefore) lines (expected +10)"
if (($linesAfter - $linesBefore) -ne 10) { Abort "line delta wrong — restore: git checkout -- src/routes/hr/HrExhibitFlow.jsx" }

# ── verification (paste ALL of this back) ────────────────────────────────────
Write-Host "── edited regions ──"
Select-String -Path "src/routes/hr/hr_era.js" -Pattern "ERA_DISPLAY" | ForEach-Object { "hr_era.js {0,4}: {1}" -f $_.LineNumber, $_.Line.Trim() }
Select-String -Path "src/routes/hr/HrExhibitFlow.jsx" -Pattern "ERA_DISPLAY|displayForBase" | ForEach-Object { "flow {0,6}: {1}" -f $_.LineNumber, $_.Line.Trim() }
git --no-optional-locks diff --stat -- src/data/era-buckets.json src/routes/hr/hr_era.js src/routes/hr/HrExhibitFlow.jsx
Write-Host ""
Write-Host "STAGE 4b SCRIPT COMPLETE — return to YOUR eyeball gate:"
Write-Host "  npm run build (or dev) -> /hr -> Filters. Era pills should read:"
Write-Host "    2016–2018 · The Early Days | 2019–2020 · Finding the Sound | 2021–2022 · The Breakthrough Years"
Write-Host "    2023–2024 · On the Road | 2025 · The Recent Era"
Write-Host "  Counts/behavior identical to your mechanics-PASS run (display only)."
Write-Host "After YOUR pass, commit Stage 4 + 4b together:"
Write-Host '  git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/hr_era.js src/data/era-buckets.json docs/derived-era-WIP/derived_era_stage4b_labels.ps1 docs/DERIVED_ERA_REWIRE_LOG-20260707.md'
Write-Host '  git commit -m "derived-era Stage 4 PASS: fixed-depth client era + date-led pill labels per gate ruling (DERIVED_ERA_REWIRE-20260707)"'
Write-Host '  git log --oneline -2; git status --short   # COMMIT GATE'
# EOF-SENTINEL: derived_era_stage4b_labels.ps1 v1 — if "STAGE 4b SCRIPT COMPLETE" never printed, the run aborted or this file is truncated.
