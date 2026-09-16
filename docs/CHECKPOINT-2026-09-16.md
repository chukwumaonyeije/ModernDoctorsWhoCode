# Verified foundation checkpoint

Scope: publish the existing local framework, preservation, curriculum, theme and accessibility work before navigation regrouping. The site owner authorized review, commit and production push on September 16, 2026.

## Review

- Correctness: shared curriculum queries derive visible lesson counts and duration; projectless courses end at a valid syllabus destination. Theme selection handles OS changes and unavailable storage. Preservation protects article identity, text, code, assets and routes.
- Security: no new secret handling, server endpoint, authentication mechanism or external form behavior is introduced. The theme script stores only a preference. Existing protected-content/publication issues remain separately documented in implementation task 0.2.
- Performance: the site remains static, with existing font files and the existing React carousel. Astro Fonts was evaluated and reverted because its fallback shifts regressed. Broader performance targets are not asserted by this checkpoint.
- Maintainability: shared curriculum/reading helpers replace duplicate calculations; regression fixtures, browser tests and read-only CI checks are included. General application type/lint tooling remains a separate task.

No new deployment-blocking defect was identified in the reviewed changes. The original article collection, public assets, redirects, protected-route baseline and narration workflow have no Git diff. The special Docling source contains only the previously reviewed 12 keyboard-focus additions. The new preservation manifest includes the documented code-hash correction based on original Astro 6 output.

## Dependency audit

A clean locked installation reports eight affected packages: two low, two moderate and four high. The affected versions match the previous commit: @babel/core 7.29.0, baseline-browser-mapping 2.10.8, browserslist 4.28.1, esbuild 0.27.4, fflate 0.7.4, js-yaml 4.3.0, sharp 0.34.5 and the nested Vite 7.3.1. Their development-server/build-input advisory surfaces are not a production application server in this static deployment. They still require a separate dependency remediation pass; a successful build does not dismiss them. No automatic or forced audit fix was applied during this checkpoint.

## Acceptance and boundaries

The existing acceptance evidence is 22 passing Node tests, 28 passing desktop/mobile browser tests, and preservation of 725 HTML routes, 208 articles, 373 original public assets and 14 redirects. The same 49 reference issues remain documented. The site owner reported the manual zoom, keyboard and screen-reader checklist passed; this is recorded as user acceptance in BROWSER-VERIFICATION.md.

The production gate is a fresh `npm ci`, `npm run check` and browser regression run. Vercel is connected to main and uses Node 24.x; local/CI validation uses Node 22.19.0. Verify the actual Git-triggered deployment and CI against the pushed commit before calling the release complete.

Pre-push gate passed: fresh locked install, all 22 Node tests, 723-page production build, every preservation validator and all 28 desktop/mobile browser tests. Windows preview cleanup delayed the default browser runner; the final passing run used the same projects/tests with separately managed preview, which was stopped afterward. Staged whitespace validation passed. Independent comparison also matched all 208 manifest article bodies/frontmatter to the pre-checkpoint Git commit and confirmed the Docling changes contain only the 12 focus additions.

Excluded from this checkpoint: temporary work, unrelated article drafts, video briefs, the source PRD PDF/folder, generated browser reports and environment files. Included planning Markdown documents describe future work and do not implement it. Navigation regrouping, progress storage, search replacement and further redesign remain separate work.

Rollback: revert the checkpoint commit as a unit and let the existing Git/Vercel integration deploy the restored tree. Preserve the article collection and original routes throughout. Do not regenerate baselines or narration as a rollback shortcut.
