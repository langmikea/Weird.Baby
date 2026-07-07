# WRITE SCRIPT — writes to TWO repos' .git (commit + push, explicit paths only):
#   C:\AI\Platform\MediaVault           (core/tag_vocabulary.json, docs/taxonomy/TAXONOMY_v1.md)
#   C:\AI\Projects\weird-baby-museum    (run log, stage6 verify script, this script)
# Never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Platform\MediaVault\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Platform\MediaVault' reset --mixed HEAD
git -C 'C:\AI\Platform\MediaVault' add core/tag_vocabulary.json docs/taxonomy/TAXONOMY_v1.md
git -C 'C:\AI\Platform\MediaVault' commit -m 'MV vocab migration Stage 6: tag_vocabulary.json regenerated from reconciled DB (v2.0, demoted per F3, underscores per F2, content_type dropped); TAXONOMY_v1 rewritten as-built (source set corrected, retired list truthful)'
git -C 'C:\AI\Platform\MediaVault' push
Write-Host '--- MV COMMIT GATE VERIFY ---'
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add docs/MV_VOCAB_MIGRATION_LOG-20260624.md tools/mv_vocab_stage6_verify.ps1 tools/mv_vocab_commit_stage6.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'MV vocab migration Stage 6 PASS: downstream surfaces regenerated; four-surface agreement verified (A==DB-live exact, D==22 rows, 0 hyphens, 7/7 TAXONOMY anchors)'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- WBM COMMIT GATE VERIFY ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
Write-Host 'STAGE6_COMMIT_DONE'
