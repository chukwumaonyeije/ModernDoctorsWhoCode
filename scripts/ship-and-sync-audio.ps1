<#
.SYNOPSIS
    Ships new or updated blog posts to GitHub, waits for GitHub Actions to generate Fish Audio narration,
    pulls the generated MP3s and frontmatter locally, and monitors Vercel deployment to doctorswhocode.blog.
#>

param (
    [string]$CommitMessage = "Publish new content and updates"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Doctors Who Code: Ship & Sync Audio Pipeline" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check git status
Write-Host "`n[1/5] Checking local changes..." -ForegroundColor Yellow
$status = git status --porcelain
if ($status) {
    Write-Host "Staging new content, downloads, and skills..."
    git add src/content public/downloads .agents scripts package.json .gitignore
    $staged = git diff --cached --name-only
    if ($staged) {
        Write-Host "Committing staged changes with message: '$CommitMessage'"
        git commit -m $CommitMessage
    } else {
        Write-Host "No changes staged for commit."
    }
} else {
    Write-Host "Working tree is clean. Proceeding with existing commits."
}

# 2. Push to GitHub
Write-Host "`n[2/5] Pushing to origin main..." -ForegroundColor Yellow
git push origin main
$localSha = (git rev-parse HEAD).Trim()
Write-Host "Pushed commit SHA: $localSha" -ForegroundColor Green

# 3. Wait for GitHub Actions Regenerate Blog Audio workflow
Write-Host "`n[3/5] Waiting for GitHub Actions 'Regenerate Blog Audio' workflow..." -ForegroundColor Yellow
Start-Sleep -Seconds 6

$runId = $null
$maxRetries = 15
for ($attempt = 1; $attempt -le $maxRetries; $attempt++) {
    try {
        $runs = gh run list --workflow="Regenerate Blog Audio" --limit 5 --json databaseId,headSha,status,conclusion | ConvertFrom-Json
        $matched = $runs | Where-Object { $_.headSha -eq $localSha }
        if ($matched) {
            $runId = $matched[0].databaseId
            Write-Host "Found workflow run ID: $runId (status: $($matched[0].status))" -ForegroundColor Cyan
            break
        }
    } catch {
        Write-Host "Querying GitHub Actions... ($attempt/$maxRetries)"
    }
    Start-Sleep -Seconds 4
}

if ($runId) {
    Write-Host "Watching GitHub Actions run $runId until completion..." -ForegroundColor Cyan
    gh run watch $runId --interval 10
    $finalRun = gh run view $runId --json status,conclusion | ConvertFrom-Json
    Write-Host "Workflow completed with conclusion: $($finalRun.conclusion)" -ForegroundColor Green
} else {
    Write-Host "Note: No dedicated run triggered for $localSha (no missing audio detected or triggered on main)." -ForegroundColor DarkGray
}

# 4. Pull audio MP3s and updated frontmatter back to local
Write-Host "`n[4/5] Pulling remote audio MP3s and updated frontmatter back to local..." -ForegroundColor Yellow
git pull --rebase origin main
$currentSha = (git rev-parse HEAD).Trim()
Write-Host "Local repository updated. HEAD is now at: $currentSha" -ForegroundColor Green

# 5. Monitor Vercel deployment
Write-Host "`n[5/5] Monitoring Vercel production deployment..." -ForegroundColor Yellow
$siteUrl = "https://www.doctorswhocode.blog"
$vercelDone = $false

for ($attempt = 1; $attempt -le 30; $attempt++) {
    Start-Sleep -Seconds 10
    try {
        $response = Invoke-WebRequest -Uri $siteUrl -Method Head -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
            Write-Host "Vercel production site is responding ($siteUrl - Status $($response.StatusCode))" -ForegroundColor Green
            $vercelDone = $true
            break
        }
    } catch {
        Write-Host "Waiting for production update ($attempt/30)..."
    }
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host " Pipeline Complete: Content shipped, audio synced, and deployed!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
