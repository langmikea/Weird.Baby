# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (commit + push of 6 named files only).
# Stages EXPLICIT paths, never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md src/data/exhibits/hunter_root.json src/data/vocabulary.json tools/mv_vocab_stage3a_source.ps1 tools/mv_vocab_stage3b_export_verify.ps1 tools/mv_vocab_commit_stage3.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration Stage 3 PASS: source collapsed (F6) - fresh disagreement=14, tag==column 293/293, 19 NULLs->local, youtube surface unchanged (ytId 47, thumbs md5-identical); re-export committed'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- COMMIT GATE VERIFY ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE3_COMMIT_DONE'
