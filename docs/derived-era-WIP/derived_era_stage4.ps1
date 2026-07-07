# ═══════════════════════════════════════════════════════════════════════════
# derived_era_stage4.ps1 — DERIVED_ERA_REWIRE-20260707 · Stage 4 (HOST-SIDE)
# WRITE SCRIPT. Run from the repo root, ONLY after the Stage 3 gate passed:
#   pwsh docs/derived-era-WIP/derived_era_stage4.ps1
#
# Every path this script touches:
#   READS : src/routes/hr/hr_era.js, src/data/era-buckets.json (presence/hash guards)
#   WRITES: src/routes/hr/HrExhibitFlow.jsx  (the ONLY file this edits)
#
# The edit (anchored, verify-or-abort, all client-source work host-side):
#   E1  add   import { eraForRecord } from "./hr_era.js";
#   E2  rename the module-load map    const ARTIFACTS = RAW_ARTIFACTS.map…
#                                  -> const FB_ARTIFACTS = RAW_ARTIFACTS.map…
#   E3  insert a second module-load map deriving tags.era from baked dates at
#       FIXED depth 0.5 (spec "medium") — NO slider, NO persistence (locked).
# hr_dimensions.js / matchFilter / BOARD_TOTAL_KEYS are untouched.
# ═══════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
function Abort($msg) { Write-Host "ABORT: $msg" -ForegroundColor Red; exit 1 }

if (-not (Test-Path "package.json") -or -not (Test-Path "src/routes/hr/HrExhibitFlow.jsx")) { Abort "run me from the repo root (weird-baby-museum)" }
$h1 = (git hash-object "src/routes/hr/hr_era.js").Trim()
if ($h1 -ne "8be0c4e333c65748769ee9664d420b89f613bfca") { Abort "src/routes/hr/hr_era.js missing/drifted (run Stage 3 first)" }
$h2 = (git hash-object "src/data/era-buckets.json").Trim()
if ($h2 -ne "5be2b470b7d8548dc7c81b930cb77e484e0cd680") { Abort "src/data/era-buckets.json missing/drifted (run Stage 3 first)" }
Write-Host "guards OK: hr_era.js + era-buckets.json in place at pinned hashes"

$path = "src/routes/hr/HrExhibitFlow.jsx"
$raw  = [System.IO.File]::ReadAllText($path)
$NL   = "`n"; if ($raw.Contains("`r`n")) { $NL = "`r`n" }
$linesBefore = ([regex]::Matches($raw, "`n")).Count + 1
Write-Host "HrExhibitFlow.jsx read: $($raw.Length) chars, $linesBefore lines, EOL=$(if($NL -eq "`r`n"){"CRLF"}else{"LF"})"

# ── anchors (each must occur EXACTLY once before editing) ────────────────────
$aImport = 'import { buildDimensions } from "./hr_dimensions.js";'
$aMap    = 'const ARTIFACTS = RAW_ARTIFACTS.map(a => {'
$aBuild  = 'const { HR_DIMENSIONS, HR_GROUP_LABELS, displayFor } = buildDimensions(ARTIFACTS);'
foreach ($a in @($aImport, $aMap, $aBuild)) {
  $n = ([regex]::Matches($raw, [regex]::Escape($a))).Count
  if ($n -ne 1) { Abort "anchor occurs $n times (need exactly 1): $a" }
}
if ($raw.Contains("eraForRecord") -or $raw.Contains("FIXED_ERA_DEPTH")) { Abort "file already carries era wiring — refusing to double-apply" }
Write-Host "anchors verified: 3/3 unique, no prior era wiring"

# ── E1: import ───────────────────────────────────────────────────────────────
$raw = $raw.Replace($aImport, ($aImport + $NL + 'import { eraForRecord } from "./hr_era.js";'))

# ── E2: rename the existing map ─────────────────────────────────────────────
$raw = $raw.Replace($aMap, 'const FB_ARTIFACTS = RAW_ARTIFACTS.map(a => {')

# ── E3: insert the derived-era map above buildDimensions ────────────────────
$block = @(
  '// ─── Derived-Era v0.2 — FIXED depth, NO slider (DERIVED_ERA_REWIRE-20260707) ─',
  '// The export bakes a weighted date-set per leaf and no longer bakes an era',
  '// label (tools/export-artifacts.mjs + tools/era-derivation.mjs). Era derives',
  '// HERE, once, at module load, at a FIXED depth — the spec''s "medium"',
  '// (cutoff 0.5; threshold = cutoff × publish anchor 2.0). The depth slider is',
  '// a LOCKED NO per the 6/17-incident rewire brief; the proximity/applicability',
  '// filter Mike actually wants is a separate, freshly-specced workstream.',
  '// eraForRecord (src/routes/hr/hr_era.js): curator era_override wins outright;',
  '// else derive from dates through src/data/era-buckets.json; else fall back to',
  '// any legacy baked tags.era (none after the Stage 3 export). Containers carry',
  '// no dates and derive no era — same visible behavior as before. Downstream is',
  '// untouched: buildDimensions discovers the derived era values and matchFilter',
  '// consumes tags.era exactly as it consumes every other facet.',
  'const FIXED_ERA_DEPTH = 0.5;',
  'const ARTIFACTS = FB_ARTIFACTS.map(a => {',
  '  if (!a) return a;',
  '  const era = eraForRecord(a, FIXED_ERA_DEPTH);',
  '  const tags = { ...(a.tags || {}) };',
  '  if (era.length) { tags.era = era; } else { delete tags.era; }',
  '  return { ...a, tags };',
  '});',
  ''
) -join $NL
$raw = $raw.Replace($aBuild, ($block + $NL + $aBuild))

# ── verify BEFORE writing ────────────────────────────────────────────────────
$checks = @{
  "FB_ARTIFACTS"    = 2   # definition + consumption by the era map
  "eraForRecord"    = 3   # import + inserted comment + call
  "FIXED_ERA_DEPTH" = 2   # const + use
}
foreach ($k in $checks.Keys) {
  $n = ([regex]::Matches($raw, [regex]::Escape($k))).Count
  if ($n -ne $checks[$k]) { Abort "post-edit '$k' count $n != $($checks[$k]) — NOT writing" }
}
$nArt = ([regex]::Matches($raw, [regex]::Escape("= RAW_ARTIFACTS.map"))).Count
if ($nArt -ne 1) { Abort "RAW_ARTIFACTS.map count $nArt — NOT writing" }

[System.IO.File]::WriteAllText($path, $raw, [System.Text.UTF8Encoding]::new($false))

# ── post-write verification (paste ALL of this back) ────────────────────────
$post = [System.IO.File]::ReadAllText($path)
$linesAfter = ([regex]::Matches($post, "`n")).Count + 1
Write-Host "written: $($post.Length) chars, $linesAfter lines (delta +$($linesAfter - $linesBefore); expected +23)"
if (($linesAfter - $linesBefore) -ne 23) { Abort "line delta wrong — restore with: git checkout -- $path" }
Write-Host "── edited region ──"
Select-String -Path $path -Pattern "FIXED_ERA_DEPTH|FB_ARTIFACTS|eraForRecord" | ForEach-Object { "{0,6}: {1}" -f $_.LineNumber, $_.Line }
Write-Host "── tail check (last 3 lines intact) ──"
Get-Content $path -Tail 3
git --no-optional-locks diff --stat -- $path
Write-Host ""
Write-Host "STAGE 4 SCRIPT COMPLETE."
Write-Host "NOW THE GATE THAT IS YOURS, UNDELEGATED: npm run build && npx vite preview (or npm run dev)"
Write-Host "  -> open /hr, open Filters: Era pills populated with real counts (5 eras, no rwth),"
Write-Host "     multi-era artifacts surface under each era they touch, nothing else regressed."
Write-Host "  Depth is fixed at 0.5 (medium): counts should read early_days 40 / finding_the_sound 40 /"
Write-Host "  breakthrough 20 / on_the_road 66 / recent 50 across all 187 DB leaves; the deck shows the"
Write-Host "  top-level subset of that. If the board reads wrong: git checkout -- $path and paste back."
Write-Host "After YOUR pass: git add src/routes/hr/HrExhibitFlow.jsx && git commit -m `"derived-era Stage 4 PASS: client derives era at fixed depth 0.5, no slider (DERIVED_ERA_REWIRE-20260707)`""
Write-Host "  then git log --oneline -2; git status --short   # COMMIT GATE"
# EOF-SENTINEL: derived_era_stage4.ps1 v1 — if "STAGE 4 SCRIPT COMPLETE" never printed, the run aborted or this file is truncated.
