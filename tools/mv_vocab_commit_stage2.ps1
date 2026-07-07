# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (commit + push of 3 named files only).
# Stages EXPLICIT paths, never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md tools/mv_vocab_stage2_registry_rebuild.ps1 tools/mv_vocab_commit_stage2.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration Stage 2 PASS: tags registry rebuilt from payloads (F7) - 53 drops, 16 adds, 14 count fixes; closes at 210 slugs, 0 mismatches'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- COMMIT GATE VERIFY ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE2_COMMIT_DONE'
