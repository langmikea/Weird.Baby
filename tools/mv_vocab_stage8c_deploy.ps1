# WRITE SCRIPT — deploys to Cloudflare (wrangler). Writes nothing local except wrangler cache.
# PREREQ: Stage 8a build is the current dist (do NOT rebuild here — deploy exactly what was smoke-tested).
# PowerShell 7.

Set-Location 'C:\AI\Projects\weird-baby-museum'
Write-Host '--- wrangler version (standing rule: 4.81.1) ---'
npx wrangler --version
npx wrangler deploy
Write-Host '--- DEPLOYMENT VERIFY ---'
npx wrangler deployments list | Select-Object -First 8
Write-Host 'STAGE8C_DEPLOY_DONE'
