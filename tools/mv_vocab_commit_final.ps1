# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (final migration commit + push, explicit paths).
# Never add -A. PowerShell 7. Includes the exported_at-refreshed data files from the final export.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md STATE.md src/data/exhibits/hunter_root.json src/data/vocabulary.json tools/mv_vocab_stage8a_final_export_build.ps1 tools/mv_vocab_stage8c_deploy.ps1 tools/mv_vocab_commit_final.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration COMPLETE (Stages 0-4,6,8 all PASS): deployed ffcf7fbd, live-verified; run log closed; STATE ledger updated; final export timestamps'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- SESSION-CLOSE CHECK (both repos; expect empty or explained) ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host 'FINAL_COMMIT_DONE'
