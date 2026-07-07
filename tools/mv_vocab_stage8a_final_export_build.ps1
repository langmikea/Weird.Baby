# WRITE SCRIPT — writes exactly these paths, nothing else:
#   C:\AI\Projects\weird-baby-museum\src\data\exhibits\hunter_root.json  (final export — expected UNCHANGED)
#   C:\AI\Projects\weird-baby-museum\src\data\vocabulary.json            (final export — expected UNCHANGED)
#   C:\AI\Projects\weird-baby-museum\dist\                               (deleted then rebuilt)
# PREREQ: MV server RUNNING. PowerShell 7.
# Stage 8a: final export (idempotence check — no DB change since Stage 4's export)
# + clean production build per standing deploy rule (Remove-Item dist first).
# Ignore the exporter's trailing UV_HANDLE_CLOSING assertion (documented harmless).

Set-Location 'C:\AI\Projects\weird-baby-museum'
npm run export-artifacts

Write-Host '--- IDEMPOTENCE CHECK (expect NO diff on the two data files) ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short -- src/data/exhibits/hunter_root.json src/data/vocabulary.json
git -C 'C:\AI\Projects\weird-baby-museum' diff --stat -- src/data/exhibits/hunter_root.json src/data/vocabulary.json
Write-Host '(empty output above = idempotent, as expected)'

Write-Host '--- CLEAN BUILD (standing rule: fresh dist) ---'
Remove-Item -Recurse -Force 'C:\AI\Projects\weird-baby-museum\dist' -ErrorAction SilentlyContinue
npm run build
Write-Host '--- dist summary ---'
Get-ChildItem -Recurse 'C:\AI\Projects\weird-baby-museum\dist' | Measure-Object -Property Length -Sum | ForEach-Object { Write-Host ("dist files: " + $_.Count + " | bytes: " + $_.Sum) }
Write-Host 'STAGE8A_SCRIPT_DONE'
