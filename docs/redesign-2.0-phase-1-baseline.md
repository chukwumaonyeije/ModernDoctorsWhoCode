# Redesign 2.0 Phase 1: Baseline Audit

Status: Complete
Date: 2026-08-23
Implementation status: No application code changed

## Outcome

This audit establishes the measured starting point for Redesign 2.0 against a production build (`npm run build`, 667 pages) served locally via `astro preview`. It covers Lighthouse/Core Web Vitals on seven representative page types and a Playwright sweep of all nine required breakpoints (320-1920px) across eight representative pages, checking for horizontal overflow and console errors.

The single largest finding is not a responsive bug. It is unoptimized images across the article corpus, which is by far the biggest lever on the Phase 7 performance target.

## Finding 1 (major): Unoptimized images across the corpus

`public/images/posts/` holds 113 image files totaling 230 MB. 102 of those files (90%) exceed 500 KB. The largest are 7.6 MB (`hero_icu_to_marathon.jpg`) and 7.1 MB (`pgis-breathe-blog-hero.jpg`). These are served from `public/`, meaning they bypass Astro's image pipeline entirely: no resizing, no format conversion, no responsive `srcset`, no lazy-loading below the fold.

Measured impact on the channel-detail page (`/channels/clinical-ai/`), which surfaces three article cards with hero images:

- Total page weight: 4,791 KiB
- Two images alone account for 4,658 KiB of that (`you-are-still-prompting-agents.jpeg` at 2,494 KB and `clinical-documentation-automation-hero.jpeg` at 2,201 KB)
- LCP: 4.3s (target: <2.5s) — directly caused by these images
- Performance score: 79 (target: >=95)

Every article, path, course, and channel page that surfaces a hero image is very likely paying a similar or worse cost. This is a sitewide migration, not a spot fix: moving `public/images/posts/` into Astro's image pipeline (`astro:assets` with the `<Image />` component, or an equivalent responsive-image helper) so images are resized, compressed, and served with `srcset` at build time.

## Finding 2: Mobile horizontal overflow on 3 of 8 representative pages

The 9-breakpoint sweep found horizontal overflow (page wider than viewport) on 11 of 72 page/width combinations, isolated to three pages at phone widths. Root cause identified for each:

| Page | Widths affected | Root cause | Location |
| --- | --- | --- | --- |
| `/blog/` | 320, 360, 390, 430 | `.article-filters` is a CSS grid containing native `<select>` elements. `.site-input` sets `width: 100%` only under `max-width: 480px`, but grid/flex items default to `min-width: auto`, so a `<select>`'s intrinsic content width (its longest `<option>` label, e.g. a long topic or format name) still forces the grid track wider than the viewport regardless of the `width: 100%` rule. | `src/styles/global.css:389-398` (`.site-input` rule), `src/pages/blog/index.astro` (`.article-filters` grid) |
| `/courses/[slug]/` | 320, 360, 390 | `.syllabus-link { white-space: nowrap; }` keeps syllabus lesson links on one line regardless of viewport width. | `src/pages/courses/[slug].astro:350-351` |
| `/about/` | 320, 360, 390, 430 | `.about-inline-link { white-space: nowrap; }` does the same to inline links inside body paragraphs (e.g. the external Substack link). | `src/pages/about.astro:362-367` |

Fix for all three is the same pattern: stop forcing single-line text and let it wrap, and for the grid case, add `min-width: 0` to the grid items that contain `.site-input` so the `width: 100%` rule can actually win. No overflow was found on home, path-detail, course-index, project-detail, channel-detail, or start at any of the nine widths.

## Finding 3: Two WCAG issues, one sitewide

1. **Sitewide — label/name mismatch on the header logo link.** `Header.astro`'s brand link renders visible text "DWC / Doctors Who Code" but its `aria-label` is "Doctors Who Code home," which does not contain the visible text. This fails WCAG 2.5.3 (Label in Name) on every one of the 667 generated pages, though it only shows up in Lighthouse's rounded category score on `/about/` because that page has a second issue compounding it. Fix: drop the custom `aria-label` (the visible text already says enough) or make the label a superset of the visible text.
2. **`/about/` only — link relies on color alone.** The inline Substack link has 2.04:1 contrast against surrounding body text (needs 3:1) and no non-color distinguishing style (underline, weight). `src/pages/about.astro`, `.about-inline-link`.

## Lighthouse and Core Web Vitals baseline

Desktop preset, production build, local preview server.

| Page | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home (`/`) | 87 | 100 | 96 | 100 | 2.4s | 0.005 | 0ms |
| Blog index (`/blog/`) | 92 | 99 | 96 | 100 | 0.5s | 0.003 | 240ms |
| Path detail (`/paths/learn-to-code/`) | 100 | 100 | 96 | 100 | 0.3s | 0.036 | 0ms |
| Course detail (`/courses/physician-developer-foundations/`) | 100 | 100 | 96 | 100 | 0.3s | 0.002 | 0ms |
| Project detail (`/projects/first-physician-utility/`) | 100 | 100 | 96 | 100 | 0.3s | 0.005 | 0ms |
| Channel detail (`/channels/clinical-ai/`) | 79 | 100 | 96 | 100 | 4.3s | 0 | 0ms |
| About (`/about/`) | 91 | 96 | 96 | 100 | 0.7s | 0.011 | 240ms |

Targets from the Redesign 2.0 plan: Performance/Accessibility/Best Practices/SEO >=95; LCP<2.5s; CLS<0.1; INP<200ms (not separately measured here; TBT is used as a lab proxy).

Observations:

- **Best Practices is capped at 96 on every page** for the same reason: a console 404 for `/_vercel/insights/script.js`. This script only resolves on actual Vercel infrastructure, so this is very likely a local-preview artifact rather than a real production defect. It should be re-verified against an actual Vercel preview deployment before being treated as fixed.
- **Performance misses target on 4 of 7 pages** (home 87, blog-index 92, channel-detail 79, about 91). Channel-detail's failure is fully explained by Finding 1. Home's 2.4s LCP is close to target but worth re-checking once image work lands. Blog-index and about show elevated TBT (240ms), driven mostly by main-thread rendering work rather than a single blocking script; not currently a hard failure against any target but worth re-measuring after other phases.
- **Accessibility and SEO are already excellent** (99-100 across the board except the two issues in Finding 3).
- **CLS is well within target everywhere** (max 0.036).

## Verification

This baseline was produced from:

- `npm run build` (667 pages, 0 errors)
- `astro preview` serving the production build locally
- Lighthouse (desktop preset) against 7 representative URLs
- A Playwright sweep of 72 page/width combinations (8 pages x 9 widths: 320, 360, 390, 430, 768, 1024, 1280, 1440, 1920) checking `document.documentElement.scrollWidth` vs `clientWidth` and console/page errors
- Targeted DOM inspection at 320px on the three pages with overflow, to identify the specific offending elements
- Source review of the CSS/markup responsible for each confirmed overflow and accessibility finding

## Next boundary

Phase 2 (design-system documentation) can proceed independently. The image migration from Finding 1 is not currently scoped as its own phase in the Redesign 2.0 plan; given its size (230 MB, sitewide, and the direct cause of the worst Performance score measured here), it should be pulled into Phase 7 as the primary item rather than a minor cleanup task, or split out as its own phase before Phase 7. The three overflow fixes and the two accessibility fixes are small and can be picked up in Phase 8 (visual QA and fixes) as originally scoped, or done opportunistically now since root cause and fix location are already identified.
