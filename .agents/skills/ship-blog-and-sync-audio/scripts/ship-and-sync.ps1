<#
.SYNOPSIS
    Ships new or updated blog posts to GitHub, waits for GitHub Actions to generate Fish Audio narration,
    pulls the generated MP3s and frontmatter locally, and monitors Vercel deployment to doctorswhocode.blog.
#>

param (
    [string]$CommitMessage = "Publish new content and updates"
)

$scriptPath = Join-Path $PSScriptRoot "..\..\..\scripts\ship-and-sync-audio.ps1"
if (Test-Path $scriptPath) {
    & $scriptPath -CommitMessage $CommitMessage
} else {
    Write-Error "Could not find root script at $scriptPath"
}
