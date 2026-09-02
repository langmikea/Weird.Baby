# ═══════════════════════════════════════════════════════════════════════════
# derived_era_stage3.ps1 — DERIVED_ERA_REWIRE-20260707 · Stage 3 (HOST-SIDE)
# WRITE SCRIPT. Run from the repo root: pwsh docs/derived-era-WIP/derived_era_stage3.ps1
#
# Every path this script touches:
#   READS : docs/derived-era-WIP/{era-derivation.mjs, era-pretest.mjs,
#           migrate-referenced-dates.mjs, hr_era.js, era-buckets.json, era-config.json}
#           tools/export-artifacts.mjs, tools/era-export-verify.mjs (verify only)
#   WRITES: tools/era-derivation.mjs, tools/era-pretest.mjs,
#           tools/migrate-referenced-dates.mjs (reference copy; NOT run — column already applied),
#           src/routes/hr/hr_era.js, src/data/era-buckets.json, era-config.json (repo root)
#   WRITES (by running the export): src/data/exhibits/*.json, src/data/vocabulary.json
#   WRITES (by pretest --write-preview): docs/derived-era-pretest-preview.json
#
# NO DB WRITE anywhere in this script (Stage 1 verdict: referenced_dates column
# already applied, all NULL — Stage 0 backup not required). NO commit — commit
# is yours, after the gate. Requires: MV running, Node 22+, PowerShell 7.
# ═══════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
function Abort($msg) { Write-Host "ABORT: $msg" -ForegroundColor Red; exit 1 }

Write-Host "── Stage 3 preflight ──────────────────────────────────────────"
if (-not (Test-Path "package.json") -or -not (Test-Path "docs/derived-era-WIP")) { Abort "run me from the repo root (weird-baby-museum)" }
$nodeV = (node --version) 2>&1
Write-Host "node: $nodeV   pwsh: $($PSVersionTable.PSVersion)"
if ([int]($nodeV -replace '^v(\d+).*','$1') -lt 22) { Abort "Node 22+ required (node:sqlite for the pretest); found $nodeV" }

if (Test-Path ".git/index.lock") { Remove-Item ".git/index.lock"; Write-Host "removed stale .git/index.lock" }
Write-Host "git status --short (eyeball this — sandbox git status was showing phantom noise; THIS host-side view is truth):"
git --no-optional-locks status --short
Write-Host ""

# ── 1. Verify the committed WIP sources are byte-identical to the hashes
#      ground-truthed in the Stage 1 session (anti-truncation gate) ──────────
$pins = @{
  "docs/derived-era-WIP/era-derivation.mjs"          = "ef39b1dec3ac600dad1024e1029337f21ff89a9d"
  "docs/derived-era-WIP/era-pretest.mjs"             = "af2856352758749dd02d112b8a9b77fb6fa3a599"
  "docs/derived-era-WIP/hr_era.js"                   = "8be0c4e333c65748769ee9664d420b89f613bfca"
  "docs/derived-era-WIP/era-config.json"             = "780b5cd765ef68e2ece61e5b82b2cd7025a1eb5f"
  "docs/derived-era-WIP/era-buckets.json"            = "5be2b470b7d8548dc7c81b930cb77e484e0cd680"
  "docs/derived-era-WIP/migrate-referenced-dates.mjs" = "2def6cea3c3f4e775d3a8736b0ca1e44860c7753"
}
foreach ($p in $pins.Keys) {
  $h = (git hash-object $p).Trim()
  if ($h -ne $pins[$p]) { Abort "$p hash $h != pinned $($pins[$p]) — file drifted/truncated; stop and investigate" }
  Write-Host "pin OK  $p  $h"
}

# ── 2. Verify the Ops-patched files landed complete (truncation guard) ──────
$export = Get-Content "tools/export-artifacts.mjs" -Raw
$markers = @(
  "ERA_CONFIG_PATH", "isEraExemptContainer", "era_override",
  "WARNING underivable leaf ships era-less", "eraCtx: ERA_CTX",
  "isChildAlbum: albumSlugForEra", "head.dates", "derived_era"
)
foreach ($m in $markers) {
  if ($export.IndexOf($m) -lt 0) { Abort "tools/export-artifacts.mjs missing patch marker '$m' — patched file incomplete" }
}
$sqlCols = ([regex]::Matches($export, [regex]::Escape("a.extracted_text, a.referenced_dates"))).Count
if ($sqlCols -ne 2) { Abort "expected the 2 SQL column additions in export-artifacts.mjs, found $sqlCols" }
$tail = Get-Content "tools/era-export-verify.mjs" -Tail 1
if ($tail -notmatch "EOF-SENTINEL") { Abort "tools/era-export-verify.mjs is truncated (EOF sentinel missing)" }
Write-Host "patched export-artifacts.mjs: all 8 markers + 2 SQL additions present"
Write-Host "era-export-verify.mjs: EOF sentinel present"
Write-Host ""

# ── 3. Place the parked files at their live locations (WIP resume step 1) ───
Copy-Item "docs/derived-era-WIP/era-derivation.mjs"           "tools/era-derivation.mjs" -Force
Copy-Item "docs/derived-era-WIP/era-pretest.mjs"              "tools/era-pretest.mjs" -Force
Copy-Item "docs/derived-era-WIP/migrate-referenced-dates.mjs" "tools/migrate-referenced-dates.mjs" -Force
Copy-Item "docs/derived-era-WIP/hr_era.js"                    "src/routes/hr/hr_era.js" -Force
Copy-Item "docs/derived-era-WIP/era-buckets.json"             "src/data/era-buckets.json" -Force
Copy-Item "docs/derived-era-WIP/era-config.json"              "era-config.json" -Force
$placed = @{
  "tools/era-derivation.mjs"           = $pins["docs/derived-era-WIP/era-derivation.mjs"]
  "tools/era-pretest.mjs"              = $pins["docs/derived-era-WIP/era-pretest.mjs"]
  "tools/migrate-referenced-dates.mjs" = $pins["docs/derived-era-WIP/migrate-referenced-dates.mjs"]
  "src/routes/hr/hr_era.js"            = $pins["docs/derived-era-WIP/hr_era.js"]
  "src/data/era-buckets.json"          = $pins["docs/derived-era-WIP/era-buckets.json"]
  "era-config.json"                    = $pins["docs/derived-era-WIP/era-config.json"]
}
foreach ($p in $placed.Keys) {
  $h = (git hash-object $p).Trim()
  if ($h -ne $placed[$p]) { Abort "post-copy hash mismatch at $p" }
  Write-Host "placed  $p  $h"
}
Write-Host ""

# ── 4. MV reachability (export needs the live endpoint) ─────────────────────
try { $null = Invoke-WebRequest "http://127.0.0.1:51822/db" -Method Get -TimeoutSec 15 }
catch { Abort "MediaVault not reachable at 127.0.0.1:51822 — start it via C:\AI\Platform\MediaVault\launch_mediavault.bat and re-run" }
Write-Host "MV endpoint reachable."
Write-Host ""

# ── 5. Export with derived era ───────────────────────────────────────────────
Write-Host "── running export ─────────────────────────────────────────────"
node tools/export-artifacts.mjs
if ($LASTEXITCODE -ne 0) { Abort "export failed (exit $LASTEXITCODE)" }
Write-Host ""

# ── 6. Pretest proofs against live MV + regenerate the oracle preview ────────
Write-Host "── running pretest gate (proofs + fresh oracle) ───────────────"
node --experimental-sqlite tools/era-pretest.mjs --mv-file "C:\AI\Platform\MediaVault\core\mediavault.sqlite" --write-preview
if ($LASTEXITCODE -ne 0) { Abort "PRETEST PROOFS FAILED — correctness/rwth mismatch. STOP. Paste the output back." }
Write-Host ""

# ── 7. Export vs oracle, per-artifact (divergence = STOP per brief) ─────────
Write-Host "── running export-vs-oracle verification ──────────────────────"
node tools/era-export-verify.mjs
if ($LASTEXITCODE -ne 0) { Abort "EXPORT DIVERGES FROM ORACLE. STOP. Paste the output back." }
Write-Host ""

# ── 8. Verification summary (paste ALL of this back) ────────────────────────
Write-Host "── Stage 3 verification summary ───────────────────────────────"
node -e "const d=require('./src/data/exhibits/hunter_root.json');const a=d.artifacts;let e=0,dd=0;const walk=x=>{if(x.tags&&x.tags.era)e++;if(Array.isArray(x.dates))dd++;};for(const x of a){walk(x);for(const g of x.gallery||[])walk(g);for(const t of x.tracks||[])walk(t);}console.log('hunter_root.json parses OK · records:',a.length,'· with tags.era (must be 0):',e,'· with dates:',dd)"
if ($LASTEXITCODE -ne 0) { Abort "hunter_root.json failed to parse post-export" }
git --no-optional-locks status --short
git --no-optional-locks diff --stat -- tools/export-artifacts.mjs
Get-Item src/data/exhibits/hunter_root.json, src/data/vocabulary.json, docs/derived-era-pretest-preview.json | Format-Table Name, Length, LastWriteTime -AutoSize
Write-Host ""
Write-Host "STAGE 3 SCRIPT COMPLETE — GATE: paste the full output back to Claude."
Write-Host "After the gate passes, commit (explicit paths, no -A):"
Write-Host '  git add tools/export-artifacts.mjs tools/era-derivation.mjs tools/era-pretest.mjs tools/migrate-referenced-dates.mjs tools/era-export-verify.mjs era-config.json src/routes/hr/hr_era.js src/data/era-buckets.json src/data/exhibits/hunter_root.json src/data/vocabulary.json docs/derived-era-pretest-preview.json docs/derived-era-WIP/derived_era_stage3.ps1 docs/derived-era-WIP/derived_era_stage4.ps1 docs/DERIVED_ERA_REWIRE_LOG-20260707.md'
Write-Host '  git commit -m "derived-era Stage 3 PASS: dates baked, era label un-baked, export==oracle per-artifact (DERIVED_ERA_REWIRE-20260707)"'
Write-Host '  git log --oneline -2; git status --short   # COMMIT GATE: confirm hash + clean'
# EOF-SENTINEL: derived_era_stage3.ps1 v1 — if "STAGE 3 SCRIPT COMPLETE" never printed, the run aborted or this file is truncated.
