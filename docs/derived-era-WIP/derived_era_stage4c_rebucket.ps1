# ═══════════════════════════════════════════════════════════════════════════
# derived_era_stage4c_rebucket.ps1 — DERIVED_ERA_REWIRE-20260707 · Stage 4c
# Re-rule 2026-07-07 (Mike, 50,000 ft): 7 album-anchored buckets replace the 5.
# Boundaries 2013 / 2017 / 2019 / 2020 / 2021 / 2022 / 2024–open; date-led
# labels = era START year, current era carries "–now". rwth fold now targets
# The Band Years. Pre-2013 check: CLEAR (whole-DB min post_date year = 2014;
# exported population min = 2016) — no escalation, 2013 start holds.
#
# NAMING FLAG (assume-and-state): the ruling said "rebuild era-config.json
# buckets" — buckets live in src/data/era-buckets.json; era-config.json is the
# reference-DATE registry (album->year anchors) and is UNCHANGED by design:
# this is a bucket redraw, exactly the artifact-churn-free edit the v0.2 model
# was built for. No derivation, weight, slug-mechanics, or override changes.
#
# Run from the repo root, MV running, ONLY on a Stage-4b-applied tree:
#   pwsh docs/derived-era-WIP/derived_era_stage4c_rebucket.ps1
#
# Every path this script touches:
#   WRITES: src/data/era-buckets.json                 (full rewrite: 7 buckets)
#   WRITES (by export run): src/data/exhibits/*.json, src/data/vocabulary.json
#   WRITES (by pretest --write-preview): docs/derived-era-pretest-preview.json
#   READS : tools/era-pretest.mjs (v2 — Ops-patched host-side; marker-verified below)
# NO DB WRITE. NO commit — commit is yours, after the eyeball gate.
# ═══════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
function Abort($msg) { Write-Host "ABORT: $msg" -ForegroundColor Red; exit 1 }

if (-not (Test-Path "package.json") -or -not (Test-Path "src/data/era-buckets.json")) { Abort "run me from the repo root (weird-baby-museum)" }
$hrEra = [System.IO.File]::ReadAllText("src/routes/hr/hr_era.js")
if (-not $hrEra.Contains("ERA_DISPLAY")) { Abort "Stage 4b not applied (hr_era.js lacks ERA_DISPLAY) — run derived_era_stage4b_labels.ps1 first" }
$pretest = [System.IO.File]::ReadAllText("tools/era-pretest.mjs")
foreach ($m in @("OLD_ERA_RANGES", "the_band_years", "Remap (old hand tag", "PUBLISH_WEIGHT")) {
  if ($pretest.IndexOf($m) -lt 0) { Abort "tools/era-pretest.mjs missing v2 marker '$m' — Ops patch didn't land; stop and paste back" }
}
Write-Host "guards OK: 4b applied, pretest v2 markers present"

# ── 1. era-buckets.json — the 7-bucket album-anchored set (full rewrite) ────
$buckets = @'
{
  "schema": "era-buckets v0.3 — committed client config (imported by hr_era.js next to vocabulary.json)",
  "authority": "docs/derived-era-spec_v0.2.md §3.2 · re-ruled 2026-07-07 (Mike): 7 album-anchored buckets",
  "note": [
    "The ONLY file Mike edits on each bucket revision. Maps a year range ->",
    "era label. The client maps each record's weighted date-set through these",
    "ranges at read time, so editing this file changes nothing about the baked",
    "artifacts — no re-export, no MV write. This v0.3 redraw (5 -> 7 buckets)",
    "is itself the proof: artifacts untouched, one file edited.",
    "The era SLUG derives from `label` (lowercase, non-alphanumerics -> _).",
    "display: date-led pill label — era START year only, current era '–now'",
    "(gate re-rule 2026-07-07). The last bucket is OPEN-ENDED (end: 9999) so",
    "future-dated releases always land in the current era.",
    "rwth folds into The Band Years by date (run_with_the_hunt -> 2016)."
  ],
  "buckets": [
    { "label": "The Band Years",      "start": 2013, "end": 2016, "display": "2013 · The Band Years" },
    { "label": "Going Solo",          "start": 2017, "end": 2018, "display": "2017 · Going Solo" },
    { "label": "Life Inside a Wheel", "start": 2019, "end": 2019, "display": "2019 · Life Inside a Wheel" },
    { "label": "Dandelions",          "start": 2020, "end": 2020, "display": "2020 · Dandelions" },
    { "label": "Skipping Stones",     "start": 2021, "end": 2021, "display": "2021 · Skipping Stones" },
    { "label": "The Arkansas Era",    "start": 2022, "end": 2023, "display": "2022 · The Arkansas Era" },
    { "label": "Crooked Home",        "start": 2024, "end": 9999, "display": "2024–now · Crooked Home" }
  ]
}
'@
[System.IO.File]::WriteAllText("src/data/era-buckets.json", $buckets + "`n", [System.Text.UTF8Encoding]::new($false))
node -e "const b=require('./src/data/era-buckets.json');if(b.buckets.length!==7)throw new Error('bucket count '+b.buckets.length);let p=2012;for(const x of b.buckets){if(x.start<=p)throw new Error('non-monotonic start '+x.start);if(x.end<x.start)throw new Error('end<start '+x.label);p=x.start;if(!x.display)throw new Error('display missing '+x.label)}if(b.buckets[6].end!==9999)throw new Error('last bucket not open');console.log('era-buckets.json OK: 7 buckets, monotonic, contiguous-checked below, open-ended');for(let i=1;i<7;i++){if(b.buckets[i].start!==b.buckets[i-1].end+1)throw new Error('gap/overlap at '+b.buckets[i].label)}console.log('coverage: contiguous 2013..open, no gaps, no overlaps');b.buckets.forEach(x=>console.log('  '+String(x.start).padEnd(4)+'-'+String(x.end).padEnd(4)+' '+x.display))"
if ($LASTEXITCODE -ne 0) { Abort "era-buckets.json failed validation — restore: git checkout -- src/data/era-buckets.json" }

# ── 2. MV reachability ───────────────────────────────────────────────────────
try { $null = Invoke-WebRequest "http://127.0.0.1:51822/db" -Method Get -TimeoutSec 15 }
catch { Abort "MediaVault not reachable at 127.0.0.1:51822 — start launch_mediavault.bat and re-run" }

# ── 3. Full chain: pretest v2 (proofs + remap + fresh oracle) ────────────────
Write-Host "── pretest v2 (7-bucket proofs + hand-tag remap + fresh oracle) ──"
node --experimental-sqlite tools/era-pretest.mjs --mv-file "C:\AI\Platform\MediaVault\core\mediavault.sqlite" --write-preview
if ($LASTEXITCODE -ne 0) { Abort "PRETEST v2 FAILED — flagged hand tags or rwth fold broke. STOP. Paste the output back." }

# ── 4. Export (content-idempotent: buckets don't touch baked dates) ─────────
Write-Host "── export ──"
node tools/export-artifacts.mjs
if ($LASTEXITCODE -ne 0) { Abort "export failed" }

# ── 5. Export vs fresh 7-bucket oracle, per-artifact ─────────────────────────
Write-Host "── export vs oracle ──"
node tools/era-export-verify.mjs
if ($LASTEXITCODE -ne 0) { Abort "EXPORT DIVERGES FROM ORACLE. STOP. Paste the output back." }

# ── 6. New deck pill counts (paste back + eyeball) ───────────────────────────
Write-Host "── DECK PILLS (top-level cards, fixed depth 0.5, new labels) ──"
node --input-type=module -e "import{readFileSync}from'node:fs';import{eraForRecord,ERA_DISPLAY,ERA_SLUGS}from'./src/routes/hr/hr_era.js';const d=JSON.parse(readFileSync('./src/data/exhibits/hunter_root.json','utf8'));const c={};let w=0,m=0,k=0;for(const a of d.artifacts){if(a.card_kind==='album'||a.card_kind==='gallery'){k++;continue}const e=eraForRecord(a,0.5);if(e.length){w++;if(e.length>1)m++;for(const s of e)c[s]=(c[s]||0)+1}}console.log('leaf cards with era:',w,'/ 23 · multi-era:',m,'· containers era-less:',k);for(const s of ERA_SLUGS)console.log(' ',String(c[s]||0).padStart(2),'·',ERA_DISPLAY[s])"
if ($LASTEXITCODE -ne 0) { Abort "deck-pill count check failed" }
git --no-optional-locks status --short
Write-Host ""
Write-Host "STAGE 4c SCRIPT COMPLETE — paste the full output back, then YOUR eyeball gate:"
Write-Host "  npm run build (or dev) -> /hr -> Filters. Seven era pills, date-led, chronological"
Write-Host "  by year prefix even in the alphabetical sort? NO — sort is alphabetical on slug;"
Write-Host "  eyeball whether the 7-pill ORDER reads acceptably (flag if not — separate ruling)."
Write-Host "After YOUR pass, commit everything Stage 4 (mechanics + 4b + 4c) together:"
Write-Host '  git add src/routes/hr/HrExhibitFlow.jsx src/routes/hr/hr_era.js src/data/era-buckets.json src/data/exhibits/hunter_root.json src/data/vocabulary.json docs/derived-era-pretest-preview.json tools/era-pretest.mjs docs/derived-era-WIP/derived_era_stage4b_labels.ps1 docs/derived-era-WIP/derived_era_stage4c_rebucket.ps1 docs/DERIVED_ERA_REWIRE_LOG-20260707.md'
Write-Host '  git commit -m "derived-era Stage 4 PASS: fixed-depth client era; 7 album-anchored buckets + date-led labels per re-rule; pretest v2 remap clean (DERIVED_ERA_REWIRE-20260707)"'
Write-Host '  git log --oneline -2; git status --short   # COMMIT GATE'
# EOF-SENTINEL: derived_era_stage4c_rebucket.ps1 v1 — if "STAGE 4c SCRIPT COMPLETE" never printed, the run aborted or this file is truncated.
