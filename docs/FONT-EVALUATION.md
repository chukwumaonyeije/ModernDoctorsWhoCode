# Astro Fonts evaluation

September 16, 2026. Local Astro 7.3.2 production builds, installed Microsoft Edge through Playwright, cold browser contexts. No deployment.

## Decision

Retain the current Fontsource CSS delivery. The local Astro Fonts candidate builds and passes preservation, but its default optimized fallbacks regress font-swap stability in five of six sampled views. This is a measured compatibility issue with the current typography, not a conclusion that the API cannot be used. Phase 1D typography acceptance remains open until fallback tuning and wider checks establish parity.

The candidate uses `fontProviders.local()` with the existing installed WOFF2 files, identical weights/styles and the packages' Unicode ranges. DM Sans retains 400 normal/italic, 500 and 600 normal; Syne retains 700/800 normal. No font packages or lockfile versions changed. Both `Font` components use their default `preload=false` to isolate fallback behavior. Broad preloading would request unnecessary subsets; any future preload experiment should select only the critical Latin faces.

## Results

Values are the sum of layout-shift entries without recent input during a controlled font release, not session-window CLS or field performance. Fonts are held until 250 ms after DOMContentLoaded, then released; measurements occur after fonts are ready and another 250 ms. Reduced motion is enabled, remote requests are blocked, and each view uses a fresh context. This deliberately exposes fallback differences under delayed font delivery. It is one sample per view, so small differences should not be treated as statistically established improvements.

| Route | Width | Fontsource shift | Astro Fonts shift |
| --- | ---: | ---: | ---: |
| Home | 375 | 0.0689 | 0.0566 |
| Clinical AI course | 375 | 0.0323 | 0.1669 |
| Physician-developer stack article | 375 | 0.0335 | 0.1327 |
| Home | 1440 | 0.0774 | 0.1208 |
| Clinical AI course | 1440 | 0.0197 | 0.0458 |
| Physician-developer stack article | 1440 | 0.0321 | 0.0800 |

All six final H1 bounding boxes match exactly between builds. Neither candidate nor baseline has document overflow in these views. Font response bytes are unchanged: 41,956 bytes for home/course and 56,100 for the article. These numbers cover fonts requested by those pages, not the entire emitted font directory. The larger fallback shifts provide sufficient reason not to adopt this candidate; final loaded geometry alone would have missed the regression.

Raw evidence: [Fontsource](evidence/font-evaluation/fontsource.json), [Astro Fonts](evidence/font-evaluation/astro-fonts.json), and [candidate configuration](evidence/font-evaluation/candidate-fonts.mjs). Candidate preservation passed for 725 pages, 208 articles, 373 original assets and 14 redirects, with the same 49 recorded reference issues.

## Reproduce and next experiment

1. Build the current source using `npm run build`, then run `node tests/browser/typography-review.mjs fontsource`. It owns preview port 4322 and closes its browser/server on completion.
2. In an isolated working copy, import the saved candidate `fonts` array into `astro.config.mjs` and set `fonts` in `defineConfig`. The candidate resolves files from the installed Fontsource packages.
3. In BaseLayout, import `Font` from `astro:assets` and place `<Font cssVariable="--font-body" />` and `<Font cssVariable="--font-display" />` in the head. Remove the six Fontsource CSS imports and the two corresponding root variable declarations from global.css, leaving every other declaration intact.
4. Build, run `node tests/browser/typography-review.mjs astro-fonts`, and run `npm run validate:site`. Do not update preservation manifests.
5. Compare custom fallback metrics or disabled optimization plus narrowly selected preloads. Repeat the delayed-font experiment and add normal-load timing, font failure, text/heading wrapping, image shifts and wider template coverage before adoption. Check historical authored family-name references before using Astro's generated family names globally.

The standalone Docling stylesheet still references remote Google fonts. The local checks block them and exercise its fallback face. That historical exception was not modified, and this experiment does not establish its production font stability. System monospace and original public assets remain unchanged.

API references: [Astro local font provider](https://docs.astro.build/en/reference/font-provider-reference/#local), [Astro Fonts guide](https://docs.astro.build/en/guides/fonts/). The installed 7.3.2 provider, component and fallback implementation were also inspected. The Agent Reach reader could not retrieve the page in this environment; the official documentation was read through the web tool.
