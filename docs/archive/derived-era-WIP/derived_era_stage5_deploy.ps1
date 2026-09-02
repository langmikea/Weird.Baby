# ═══════════════════════════════════════════════════════════════════════════
# derived_era_stage5_deploy.ps1 — DERIVED_ERA_REWIRE-20260707 · Stage 5 (HOST)
# dist clean-remove -> build -> preview (YOUR gate) -> deploy -> verify live ->
# ledger/log updates (applied ONLY after live verify) -> printed commit+push.
#
# Run from the repo root: pwsh docs/derived-era-WIP/derived_era_stage5_deploy.ps1
#
# Every path this script touches:
#   DELETES: dist/ (clean-remove, rebuilt)
#   WRITES (by build): dist/
#   WRITES (after live verify only): STATE.md,
#           docs/DERIVED_ERA_REWIRE_LOG-20260707.md,
#           docs/derived-era-WIP/DERIVED_ERA_WIP_STATE.md
#   DEPLOYS: NOTHING. Disarmed 2026-08-22 — see §0 DEPLOY — THE ONLY ACCOUNT
#            in docs/canonical/OPERATIONS.md.
# NO DB WRITE. Commits/push printed at the end — yours, after the gate.
# ═══════════════════════════════════════════════════════════════════════════
# ═══ DISARMED 2026-08-22 ═══════════════════════════════════════════════════
# This script reached the Cloudflare deploy CLI directly, which is a publish
# tools/deploy-guard.mjs never sees. The invocation is gone; section 3 now
# prints and stops. The file is kept for its documentary value only.
# ═══════════════════════════════════════════════════════════════════════════
$ErrorActionPreference = "Stop"
function Abort($msg) { Write-Host "ABORT: $msg" -ForegroundColor Red; exit 1 }

# ── 0. Preflight ─────────────────────────────────────────────────────────────
if (-not (Test-Path "package.json") -or -not (Test-Path "STATE.md")) { Abort "run me from the repo root (weird-baby-museum)" }
$head = (git rev-parse --short HEAD).Trim()
if ($head -ne "420c6ba") { Abort "HEAD is $head, expected 420c6ba (Stage 4 commit). Tree drifted — stop and paste back." }
$st = (git --no-optional-locks status --short) -join "`n"
if ($st.Trim().Length -gt 0) {
  Write-Host "working tree not clean:" ; Write-Host $st
  $go = Read-Host "type CONTINUE to proceed anyway (untracked-only is usually fine)"
  if ($go -ne "CONTINUE") { Abort "stopped at your call" }
}
# era wiring must be in the tree we are about to build
node -e "const b=require('./src/data/era-buckets.json');if(b.buckets.length!==7)throw new Error('buckets != 7');const d=require('./src/data/exhibits/hunter_root.json');let era=0,dates=0;const w=x=>{if(x.tags&&x.tags.era)era++;if(Array.isArray(x.dates))dates++};for(const a of d.artifacts){w(a);for(const g of a.gallery||[])w(g);for(const t of a.tracks||[])w(t)}if(era)throw new Error('baked tags.era present: '+era);if(!dates)throw new Error('no dates baked');console.log('preflight OK: 7 buckets · 0 baked era · '+dates+' dated leaves')"
if ($LASTEXITCODE -ne 0) { Abort "preflight content check failed" }
$flow = [System.IO.File]::ReadAllText("src/routes/hr/HrExhibitFlow.jsx")
foreach ($m in @("FIXED_ERA_DEPTH", "ERA_DISPLAY", "ERA_SLUGS")) {
  if ($flow.IndexOf($m) -lt 0) { Abort "HrExhibitFlow.jsx missing '$m' — Stage 4 wiring incomplete" }
}
Write-Host "preflight OK: HEAD 420c6ba · client wiring present"

# ── 1. dist clean-remove + build ─────────────────────────────────────────────
if (Test-Path "dist") { Remove-Item "dist" -Recurse -Force; Write-Host "dist/ removed" }
npm run build
if ($LASTEXITCODE -ne 0) { Abort "build failed" }
if (-not (Test-Path "dist")) { Abort "build produced no dist/" }
# Bundle check v2 (first run aborted on a WRONG check): era SLUGS like
# "the_band_years" are COMPUTED at runtime (eraSlug(label)) and by design never
# exist as literals in src/ or the bundle — verified: 0 occurrences in src/.
# What Vite DOES inline is era-buckets.json (static import via hr_era.js), whose
# LABEL string values survive minification. Check the three ASCII, era-only
# labels that collide with no album title; the "·" display strings are avoided
# because the minifier may unicode-escape non-ASCII.
foreach ($marker in @("The Band Years", "Going Solo", "The Arkansas Era")) {
  $hit = (Get-ChildItem dist -Recurse -File -Include *.js,*.json | Select-String -SimpleMatch -Pattern $marker -List | Measure-Object).Count
  if ($hit -lt 1) { Abort "built bundle missing era bucket label '$marker' — era-buckets.json not inlined; era wiring genuinely absent from build" }
}
Write-Host "build OK: bundle carries the 7-bucket era labels (slug literals correctly absent - computed at runtime)"

# ── 2. Preview — YOUR gate ───────────────────────────────────────────────────
$job = Start-Job -ScriptBlock { Set-Location $using:PWD; npx vite preview --port 4173 2>&1 }
Write-Host ""
Write-Host "PREVIEW GATE (yours): open http://localhost:4173/hr — Filters:"
Write-Host "  7 date-led era pills, chronological 2013 -> 2024–now, counts 2/1/1/3/1/8/10,"
Write-Host "  multi-era artifacts under each era touched, nothing else regressed."
$go = Read-Host "type DEPLOY to ship, anything else aborts"
Stop-Job $job -ErrorAction SilentlyContinue; Remove-Job $job -Force -ErrorAction SilentlyContinue
if ($go -ne "DEPLOY") { Abort "stopped at preview gate — nothing deployed; docs untouched" }

# ── 3. Deploy — DISARMED ─────────────────────────────────────────────────────
# Everything below (live verify, the STATE.md ledger rewrite, the run-log
# close-out) consumed a real deploy and its version id. With no deploy there is
# no version id, so the run STOPS here rather than stamping the ledger for a
# publish that did not happen.
Write-Host "Deploy is not run from this script. Run: npm run deploy:launch"
exit 1

# ── 4. Verify live ───────────────────────────────────────────────────────────
Start-Sleep -Seconds 5
$resp = Invoke-WebRequest "https://weird.baby" -TimeoutSec 30
if ($resp.StatusCode -ne 200) { Abort "https://weird.baby returned $($resp.StatusCode) — investigate before touching docs" }
Write-Host "live: weird.baby HTTP 200. Do your incognito walk of /hr now (script continues; ledger notes the walk is yours)."

# ── 5. Ledger + log updates (post-deploy only) ───────────────────────────────
$stamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-dd HH:mm'Z'")
$state = [System.IO.File]::ReadAllText("STATE.md")
$aLive = '- Site: https://weird.baby — LIVE and CURRENT. Last deploy version `ffcf7fbd` (wrangler 4.81.1), 2026-07-07 ~02:00Z (verified via deploy output + Mike''s incognito walk).'
$aHead = '- Repo HEAD at deploy: `a7b8d62` + final migration docs commit follows same session.'
$aShip = '## SHIPPED 2026-07-07 — FACT KIND + PUV PILOT (FACT_KIND_PUV_PILOT-20260707; DB-only, NO deploy)'
$SNL = "`n"; if ($state.Contains("`r`n")) { $SNL = "`r`n" }
$aNext = ('5. Derived-era client re-wire — HOST-SIDE ONLY, fixed depth, no slider. Parked in docs/derived-era-WIP/. NOT a launch gate.' + $SNL + '6. Press batch (16 URLs) — gated behind derived-era re-wire.')
foreach ($a in @($aLive, $aHead, $aShip)) {
  if (([regex]::Matches($state, [regex]::Escape($a))).Count -ne 1) { Abort "STATE.md anchor missing/moved: $($a.Substring(0,[Math]::Min(60,$a.Length))) — DEPLOY SUCCEEDED ($ver) but ledger NOT updated; fix by hand + paste back" }
}
if (([regex]::Matches($state, [regex]::Escape($aNext))).Count -ne 1) { Abort "STATE.md NEXT items 5/6 anchor missing — DEPLOY SUCCEEDED ($ver); update NEXT by hand + paste back" }
$state = $state.Replace($aLive, "- Site: https://weird.baby — LIVE and CURRENT. Last deploy version ``__VER__`` (wrangler 4.81.1), __STAMP__ (verified via deploy output + HTTP 200; incognito walk = Mike, this session).")
$state = $state.Replace($aHead, '- Repo HEAD at deploy: `420c6ba` + ledger/log close commit follows same session.')
$shipBlock = @'
## SHIPPED 2026-07-07 — DERIVED-ERA RE-WIRE (DERIVED_ERA_REWIRE-20260707; deploy __VER__)

Executed per `docs/DERIVED_ERA_REWIRE_BRIEF-20260707.md`, WIP-state-authoritative, every stage gated (run log: `docs/DERIVED_ERA_REWIRE_LOG-20260707.md`). NO DB write (referenced_dates already applied 6/17, all NULL — Stage 0 backup waived by Stage 1 verdict). The 6/17 parked implementation is LIVE, corrected per the incident: all client edits host-side via Mike-run scripts, everything re-verified against the live tree first.

- Export bakes weighted date-sets per leaf (`tools/era-derivation.mjs` + root `era-config.json` registry); era label NO LONGER baked; legacy hand `era:` tags stay in MV as curation inputs. Curator channel: `referenced_dates.era_override` bakes through, wins outright.
- Client derives era at module load at FIXED depth 0.5 — NO slider (locked; proximity filter = separate future workstream). `src/routes/hr/hr_era.js` + `src/data/era-buckets.json`; `hr_dimensions.js`/`matchFilter` untouched.
- Era pills: **7 album-anchored buckets** (re-ruled 2026-07-07, replacing the 5): 2013 Band Years / 2017 Going Solo / 2019 Wheel / 2020 Dandelions / 2021 Skipping Stones / 2022 Arkansas / 2024–now Crooked Home (open-ended, catches future-dated releases). Date-led display labels; CHRONOLOGICAL pill order (era only, other facets alphabetical). rwth folds to Band Years 15/15.
- Proofs: correctness v2 — 37 hand tags remap clean, 0 flags; export==oracle per-artifact; 0 underivable; pre-2013 check clear (DB min 2014). Deck pills at 0.5: 2/1/1/3/1/8/10, 3 multi-era cards, containers era-less by design.
- Bucket revisions = edit `src/data/era-buckets.json` alone (proven: the 5→7 redraw touched no artifact, export content-idempotent). Stage scripts: `docs/derived-era-WIP/derived_era_stage3/4/4b/4c/4d/5*.ps1`. Commits `30beff0` (Stage 3) + `420c6ba` (Stage 4).

'@
$shipBlock = ($shipBlock -replace "`r`n", "`n").Replace("`n", $SNL)
$state = $state.Replace($aShip, ($shipBlock + $aShip))
$state = $state.Replace($aNext, '5. Press batch (16 URLs) — UNBLOCKED 2026-07-07 (derived-era re-wire SHIPPED). Next brief follows.')
$state = $state.Replace("__VER__", $ver).Replace("__STAMP__", $stamp)
[System.IO.File]::WriteAllText("STATE.md", $state, [System.Text.UTF8Encoding]::new($false))
Write-Host "STATE.md updated (LIVE line, SHIPPED block, NEXT queue)"

$closure = "`n---`n## CLOSED 2026-07-07 — RESUMED AND SHIPPED (deploy $ver)`nThis workstream shipped per docs/DERIVED_ERA_REWIRE_BRIEF-20260707.md (run log: docs/DERIVED_ERA_REWIRE_LOG-20260707.md). The parked files were placed live at Stage 3; buckets re-ruled to 7 album-anchored (era-buckets.json v0.3); labels date-led; pill order chronological. This note SUPERSEDES the resume plan above — do not re-execute it.`n"
Add-Content "docs/derived-era-WIP/DERIVED_ERA_WIP_STATE.md" $closure -Encoding utf8
$logClose = "`n## Stage 5 — SHIPPED (deploy $ver, $stamp)`ndist clean-rebuilt; preview gated by Mike; deployed; weird.baby HTTP 200 + Mike's incognito walk. STATE.md ledger updated (SHIPPED block, NEXT #5 removed, press batch UNBLOCKED). Run log closed. Standing item reminder: OneDrive mirror is point-in-time at 753b17e — re-mirror when convenient.`n"
Add-Content "docs/DERIVED_ERA_REWIRE_LOG-20260707.md" $logClose -Encoding utf8
Write-Host "run log + WIP state closed"

# ── 6. Close-out (yours) ─────────────────────────────────────────────────────
git --no-optional-locks status --short
Write-Host ""
Write-Host "STAGE 5 SCRIPT COMPLETE — commit + push (explicit paths, no -A):"
Write-Host '  git add STATE.md docs/DERIVED_ERA_REWIRE_LOG-20260707.md docs/derived-era-WIP/DERIVED_ERA_WIP_STATE.md docs/derived-era-WIP/derived_era_stage5_deploy.ps1'
Write-Host "  git commit -m `"derived-era re-wire SHIPPED (deploy $ver): ledger updated, press batch UNBLOCKED, run log closed (DERIVED_ERA_REWIRE-20260707)`""
Write-Host '  git push'
Write-Host '  git log --oneline -3; git status --short   # COMMIT GATE + SESSION-CLOSE CHECK (empty or explained)'
Write-Host "Then paste the full output back to close the workstream."
# EOF-SENTINEL: derived_era_stage5_deploy.ps1 v1 — if "STAGE 5 SCRIPT COMPLETE" never printed, the run aborted or this file is truncated.
