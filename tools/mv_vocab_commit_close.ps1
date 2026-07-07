# WRITE SCRIPT — writes to: C:\AI\Projects\weird-baby-museum\.git (session-close commit + push, explicit paths).
# Never add -A. PowerShell 7.

Remove-Item -LiteralPath 'C:\AI\Projects\weird-baby-museum\.git\index.lock' -Force -ErrorAction SilentlyContinue
git -C 'C:\AI\Projects\weird-baby-museum' reset --mixed HEAD
git -C 'C:\AI\Projects\weird-baby-museum' add BACKLOG.md tools/mv_vocab_commit_close.ps1
git -C 'C:\AI\Projects\weird-baby-museum' commit -m 'Backlog: instrument:harmonica HELD (operator-list required, zero text evidence); F5 artifact_kind/format routing logged as deferred item'
git -C 'C:\AI\Projects\weird-baby-museum' push
Write-Host '--- SESSION-CLOSE CHECK (both repos; expect empty) ---'
git -C 'C:\AI\Projects\weird-baby-museum' status --short
git -C 'C:\AI\Projects\weird-baby-museum' log -1 --oneline
git -C 'C:\AI\Platform\MediaVault' status --short
git -C 'C:\AI\Platform\MediaVault' log -1 --oneline
Write-Host 'CLOSE_COMMIT_DONE'
