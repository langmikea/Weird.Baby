# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (commit + push of 4 named files only).
# Stages EXPLICIT paths, never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md tools/mv_vocab_stage1a_registry.ps1 tools/mv_vocab_stage1b_endpoint.ps1 tools/mv_vocab_commit_stage1.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration Stage 1 PASS: exhibit un-retired; event/lineup/attributes registered (tier 3); presentation:link folded to attributes:link (F8); endpoint verified'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- COMMIT GATE VERIFY ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE1_COMMIT_DONE'
