# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (commit + push of 7 named files only).
# Stages EXPLICIT paths, never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md src/data/exhibits/hunter_root.json src/data/vocabulary.json src/routes/hr/HrExhibitFlow.jsx tools/mv_vocab_stage4a_band_rename.ps1 tools/mv_vocab_stage4b_export_verify.ps1 tools/mv_vocab_commit_stage4.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration Stage 4 PASS: bands->band rename (D-d) - 288 payloads, vocabulary+registry renamed, lineup:band intact (12); client BOARD_TOTAL_KEYS updated; re-export committed'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- COMMIT GATE VERIFY ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE4_COMMIT_DONE'
