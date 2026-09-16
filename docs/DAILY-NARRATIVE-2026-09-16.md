---
title: "From a verified foundation to a clearer learning experience"
date: 2026-09-16
author: "Chukwuma Onyeije, MD, FACOG"
project: "Doctors Who Code"
type: "development-journal"
status: "release-approved"
site: "https://www.doctorswhocode.blog"
repository: "https://github.com/chukwumaonyeije/ModernDoctorsWhoCode"
foundation_commit: "12f76946e6411fb11bde40877e69a1df8f49e901"
next_session: 2026-09-17
tags:
  - astro
  - learning-platform
  - accessibility
  - navigation
  - preservation
---

# What we accomplished today

Today we moved Doctors Who Code from a verified technical foundation toward a more coherent learning experience. We worked in small steps, reviewed each change locally, and kept the existing publication intact. The articles remained the source material for the curriculum, with their original URLs, narration and assets.

We began by closing the earlier foundation checkpoint. That work established Astro 7, shared curriculum calculations, preservation checks and system, light and dark themes. The representative manual accessibility checklist was reported as passed, and the foundation was pushed and verified in production. We also completed the font comparison: the Astro Fonts experiment produced worse fallback layout stability in five of six sampled views, so we retained the existing Fontsource delivery.

We then simplified the navigation around four reader intentions: Learn, Build, Journal and About. Learn opens the existing Start Here, Learning Paths and Courses destinations. Search, Subscribe and the native theme selector remain accessible. The disclosure works without JavaScript, and its enhanced behavior supports Escape, focus return and closing when the reader moves away. We separated section highlighting from the current-page announcement so an article no longer identifies the Journal archive as the page being read.

The footer became a dedicated SiteFooter component. Its Build and Journal labels now agree with the header, while every existing destination remains available. This gives the active footer one clear owner without disturbing the legacy layout. We also extended shared breadcrumbs to Journal, tag archives and ordinary articles. Course articles retain their more specific path and course trail.

The next changes addressed the transition from browsing to learning. Course pages now offer Begin lesson one near the summary, and the summary shows an authored course outcome rather than repeating the broader path outcome. Build Afterward titles link to real project pages. Final course actions lead to the next course, an actual project, or the parent learning path. A course without a project no longer tells the reader to finish a nonexistent build.

The Middle Path remained an important check on accuracy. It still shows one available lesson and explains that later parts are planned. Its duration reflects the available material. We did not turn a planned sequence into a claim of completed content.

Finally, we brought course context into the reading experience. Lesson articles now have an ordered course list beside the article contents on desktop and a native collapsible course list on mobile. Both identify the current lesson and link to the original articles. The existing previous and next controls remain at the end. We changed their heading from Course Progress to Course Lessons because a reader's location does not establish completion.

# How we checked the work

The preservation checks cover 725 HTML routes, 208 collection articles, 373 original public assets and 14 redirects. The 22 Node tests passed, as did the expanded suite of 38 desktop and mobile browser tests. The build generates 723 Astro pages; the preserved HTML total also includes standalone public documents.

Focused checks exercised all eight course entry and next-step destinations without JavaScript. We checked breadcrumbs across four widths in both themes, footer layouts across five widths, and lesson disclosure behavior, current-page semantics and keyboard reachability. Enlarged desktop text exposed a header overflow during the lesson work. Allowing the existing flex groups to wrap corrected it.

The same 49 recorded reference issues remain visible. We did not regenerate preservation baselines to hide failures, modify article bodies, introduce a new client framework, or add dependencies. Browser automation and doubled CSS text are useful evidence, but they are not a new Narrator session or actual browser zoom acceptance. Those checks remain open for the new disclosures.

The site owner visually reviewed each local increment and authorized this GitHub push for Vercel publication. This document records that release authorization; successful publication must be confirmed against the pushed commit and the production domain. The release includes site changes, tests and project documentation. Unrelated drafts, video briefs, source planning files and temporary diagnostics remain local.

# What we will do tomorrow

Tomorrow, September 17, we will start with the published site and the saved verification report. We will confirm the production course journey and finish the new Learn and Course lessons disclosures' Narrator and actual browser zoom checks. Any defects found there take priority over new features.

The next implementation step is voluntary local learning progress. We will use stable lesson IDs and a versioned browser-storage format. Opening an article will record a visit, not completion. Mark Complete will be an explicit reader action, with undo and reset. Continue will point to a real lesson, and course/path indicators will derive their counts from the current published curriculum.

We will test missing or denied storage, malformed saved data, stale lesson IDs, cross-tab changes and partial courses. Readers who disable JavaScript will still have normal course and article links. There will be no account requirement, server-side progress database or patient data in this feature.

We will keep that progress work as a separate local change for review. Dependency advisories, known reference debt, broader publication/security corrections and performance measurement remain tracked follow-ups. Tomorrow's goal is a trustworthy way to resume learning, with completion claims that reflect a deliberate reader action.

# Release review

The reviewed change introduces no new credentials, external service calls or storage. Native elements and static links carry the new navigation. Shared components reuse the existing public curriculum queries and preserve article identity. No new release-blocking defect was identified; manual disclosure acceptance and the previously documented technical debt remain explicit limitations.

If rollback becomes necessary, revert this release's code commit and let the existing GitHub-to-Vercel integration publish the prior state. Do not rewrite article content or regenerate preservation baselines as a rollback shortcut.
