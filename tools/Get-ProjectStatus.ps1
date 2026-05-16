<#
.SYNOPSIS
    Reads the status of the weird-baby-museum project and suggests a next step.

.DESCRIPTION
    Inspects the project directory for common signals — git state, status/TODO
    documents, package manifests, build artifacts, and recently modified files —
    then prints a summary and a recommended next action.

.PARAMETER ProjectPath
    Path to the project root. Defaults to C:\AI\Projects\weird-baby-museum.

.EXAMPLE
    .\tools\Get-ProjectStatus.ps1
    .\tools\Get-ProjectStatus.ps1 -ProjectPath C:\AI\Projects\weird-baby-museum -Verbose
#>

[CmdletBinding()]
param(
    [string]$ProjectPath = (Get-Location).Path
)

$ErrorActionPreference = 'Stop'

# ---------- helpers ----------------------------------------------------------

function Write-Section([string]$Title) {
    Write-Host ''
    Write-Host ('═' * 60) -ForegroundColor DarkCyan
    Write-Host " $Title" -ForegroundColor Cyan
    Write-Host ('═' * 60) -ForegroundColor DarkCyan
}

function Write-Item([string]$Label, $Value, [ConsoleColor]$Color = 'Gray') {
    Write-Host ('  {0,-22}' -f "$Label`:") -NoNewline -ForegroundColor DarkGray
    Write-Host $Value -ForegroundColor $Color
}

function Test-CommandExists([string]$Name) {
    $null -ne (Get-Command $Name -ErrorAction SilentlyContinue)
}

# ---------- validate ---------------------------------------------------------

if (-not (Test-Path -LiteralPath $ProjectPath)) {
    Write-Error "Project path not found: $ProjectPath"
    return
}

$resolved = (Resolve-Path -LiteralPath $ProjectPath).Path
Push-Location $resolved
try {

    Write-Section "Project: $(Split-Path $resolved -Leaf)"
    Write-Item 'Path'        $resolved              White
    Write-Item 'Scanned at'  (Get-Date)             White

    $recommendations = [System.Collections.Generic.List[string]]::new()

    # ---------- git ----------------------------------------------------------

    Write-Section 'Git'
    $isGitRepo = Test-Path (Join-Path $resolved '.git')

    if (-not $isGitRepo) {
        Write-Item 'Repository' 'not initialized' Yellow
        $recommendations.Add("Initialize git: ``git init`` and make an initial commit.")
    }
    elseif (-not (Test-CommandExists 'git')) {
        Write-Item 'Repository' '.git found, but git CLI not on PATH' Yellow
    }
    else {
        $branch  = (& git rev-parse --abbrev-ref HEAD 2>$null).Trim()
        $porcelain = & git status --porcelain 2>$null
        $changed = if ($porcelain) { ($porcelain | Measure-Object).Count } else { 0 }
        $ahead = 0; $behind = 0
        $upstream = & git rev-parse --abbrev-ref --symbolic-full-name '@{u}' 2>$null
        if ($LASTEXITCODE -eq 0 -and $upstream) {
            $counts = (& git rev-list --left-right --count "HEAD...$upstream" 2>$null) -split '\s+'
            if ($counts.Count -ge 2) { $ahead = [int]$counts[0]; $behind = [int]$counts[1] }
        }
        $lastCommit = & git log -1 --pretty=format:'%h  %s  (%cr)' 2>$null

        Write-Item 'Branch'         $branch                                  Green
        Write-Item 'Uncommitted'    "$changed file(s)"                       ($(if ($changed) {'Yellow'} else {'Green'}))
        Write-Item 'Upstream'       ($(if ($upstream) { $upstream } else { '(none)' })) Gray
        Write-Item 'Ahead / behind' "$ahead / $behind"                       ($(if ($ahead -or $behind) {'Yellow'} else {'Green'}))
        Write-Item 'Last commit'    $lastCommit                              Gray

        if ($changed -gt 0) {
            $recommendations.Add("You have $changed uncommitted change(s). Review with ``git status`` and commit or stash.")
        }
        if ($ahead -gt 0)   { $recommendations.Add("Push $ahead local commit(s) with ``git push``.") }
        if ($behind -gt 0)  { $recommendations.Add("Pull $behind remote commit(s) with ``git pull``.") }
        if (-not $upstream) { $recommendations.Add("No upstream set for ``$branch``. Consider ``git push -u origin $branch``.") }
    }

    # ---------- project type detection --------------------------------------

    Write-Section 'Project type'
    $signals = [ordered]@{
        'Node / npm'      = 'package.json'
        'Python (pyproj)' = 'pyproject.toml'
        'Python (reqs)'   = 'requirements.txt'
        '.NET'            = '*.csproj'
        'Rust'            = 'Cargo.toml'
        'Go'              = 'go.mod'
        'Docker'          = 'Dockerfile'
        'Compose'         = 'docker-compose.yml'
    }
    $hits = @()
    foreach ($k in $signals.Keys) {
        $match = Get-ChildItem -LiteralPath $resolved -Filter $signals[$k] -File -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($match) {
            Write-Item $k $match.Name Green
            $hits += $k
        }
    }
    if (-not $hits) { Write-Item 'Detected' '(no manifest files at root)' DarkGray }

    # node-specific hints
    if ($hits -contains 'Node / npm') {
        $hasLock    = Test-Path (Join-Path $resolved 'package-lock.json')
        $hasModules = Test-Path (Join-Path $resolved 'node_modules')
        if (-not $hasModules) { $recommendations.Add('Run ``npm install`` — node_modules is missing.') }
        elseif (-not $hasLock) { $recommendations.Add('No package-lock.json — run ``npm install`` to generate one.') }

        try {
            $pkg = Get-Content (Join-Path $resolved 'package.json') -Raw | ConvertFrom-Json
            if ($pkg.scripts) {
                $scriptList = ($pkg.scripts.PSObject.Properties.Name) -join ', '
                Write-Item 'npm scripts' $scriptList Gray
                if ($pkg.scripts.dev)   { $recommendations.Add('Start the dev server: ``npm run dev``.') }
                elseif ($pkg.scripts.start) { $recommendations.Add('Start the app: ``npm start``.') }
            }
        } catch { Write-Verbose "package.json parse failed: $_" }
    }

    if ($hits -contains 'Python (reqs)' -or $hits -contains 'Python (pyproj)') {
        if (-not (Test-Path (Join-Path $resolved '.venv')) -and -not (Test-Path (Join-Path $resolved 'venv'))) {
            $recommendations.Add('Create a virtual env: ``python -m venv .venv`` then activate and ``pip install -r requirements.txt``.')
        }
    }

    # ---------- recent activity ---------------------------------------------

    Write-Section 'Recent activity (top 5)'
    $recent = Get-ChildItem -LiteralPath $resolved -File -Recurse -ErrorAction SilentlyContinue |
        Where-Object { $_.FullName -notmatch '\\(\.git|node_modules|\.venv|venv|dist|build|__pycache__)\\' } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 5
    foreach ($f in $recent) {
        $rel = $f.FullName.Substring($resolved.Length).TrimStart('\')
        Write-Item $rel $f.LastWriteTime.ToString('yyyy-MM-dd HH:mm') Gray
    }

    # ---------- README check -------------------------------------------------

    if (-not (Get-ChildItem -LiteralPath $resolved -Filter 'README*' -File -ErrorAction SilentlyContinue)) {
        $recommendations.Add('No README found. Add one describing what the weird-baby-museum is.')
    }

    # ---------- recommendation -----------------------------------------------

    Write-Section 'Recommended next step'
    if ($recommendations.Count -eq 0) {
        Write-Host '  Project looks tidy. Pick the next feature from your backlog!' -ForegroundColor Green
    }
    else {
        # primary recommendation = first one (ordering above is roughly priority)
        Write-Host ('  → ' + $recommendations[0]) -ForegroundColor Yellow
        if ($recommendations.Count -gt 1) {
            Write-Host ''
            Write-Host '  Other suggestions:' -ForegroundColor DarkGray
            for ($i = 1; $i -lt $recommendations.Count; $i++) {
                Write-Host ('    • ' + $recommendations[$i]) -ForegroundColor DarkGray
            }
        }
    }
    Write-Host ''
}
finally {
    Pop-Location
}
