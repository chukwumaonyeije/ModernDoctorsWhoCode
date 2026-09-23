---
name: ship-blog-and-sync-audio
description: Ship new or updated blog posts to GitHub, monitor and wait for the GitHub Actions Fish Audio generation to complete, pull the generated MP3s and updated frontmatter back to the local repository, and wait for Vercel to deploy to doctorswhocode.blog.
---

# Ship Blog and Sync Audio

Use this skill when publishing new articles, series, or updates to Doctors Who Code that need automated Fish Audio narration and Vercel production deployment.

## Workflow Pipeline

1. **Stage, Commit, and Push**:
   - Verify local checks pass (`npm test` and `npm run validate:learning`).
   - Stage content files (`src/content/`, `public/downloads/`, etc.).
   - Commit with an explicit descriptive message and push to `origin main`.

2. **Wait for GitHub Actions Fish Audio Generation**:
   - The push to `main` triggers `.github/workflows/regenerate-blog-audio.yml`.
   - The action runs `scripts/generate_audio.py --missing` using Dr. Onyeije's cloned Fish Audio voice.
   - The action commits the new MP3 files in `public/audio/` and updates the `audioUrl` frontmatter in `src/content/blog/posts/`, then pushes back to `main`.
   - Monitor the run with `gh run list --workflow="Regenerate Blog Audio"` and `gh run watch <run-id>`.

3. **Pull Audio & Frontmatter Locally**:
   - Run `git pull --rebase origin main` to pull the generated `.mp3` files and updated frontmatter into the local working directory.

4. **Verify Vercel Production Deployment**:
   - Pushes to `main` trigger automatic deployment on Vercel.
   - Monitor deployment status via `vercel ls --prod` and test live URL availability at `https://www.doctorswhocode.blog`.

5. **Notify User**:
   - Summarize the commit, generated audio files, and verified live URL.

## CLI Usage ($)

Run directly from the terminal using PowerShell:

```powershell
npm run ship:audio
```

Or pass a custom commit message:

```powershell
pwsh -File scripts/ship-and-sync-audio.ps1 -CommitMessage "Publish 'From Search to Action' series"
```
