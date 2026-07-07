# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (commit + push of 3 named files only).
# Stages EXPLICIT paths, never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md tools/mv_vocab_stage0_backup.ps1 tools/mv_vocab_commit_stage0.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration Stage 0: backup taken + verified (integrity ok, 293 artifacts, baseline exact); run log opened'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- COMMIT GATE VERIFY ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE0_COMMIT_DONE'
