# Redesign Stage 5: Article Reading Experience

Date: 2026-07-29
Status: Implemented. Visual browser sign-off pending.

## Outcome

The shared article template now provides a quieter reading surface, an in-flow mobile table of contents, keyboard-operable audio, stronger semantic landmarks, and locally hosted primary fonts.

No article body, canonical URL, publication date, or learning-graph relationship changed.

## Reading surface

The article column now has a deliberate maximum width beside a narrower table-of-contents rail. The title has a clearer hierarchy, while the author area is a compact byline instead of a large card before the article begins.

The author biography, related articles, project context, lesson navigation, newsletter, tags, and sharing controls remain available below the article.

## Responsive table of contents

Articles with level-two or level-three headings now render the same server-generated heading list in two forms:

- A sticky desktop rail above 900 pixels
- A native `details` disclosure inside the article flow at 900 pixels and below

Both forms use named navigation landmarks and direct heading anchors. Article headings use a scroll offset so the fixed header does not obscure the destination.

The mobile interface does not require JavaScript.

## Article semantics

The shared layout now includes:

- An article landmark named by the page title
- A single identifiable article heading
- Named topic, sharing, related-article, and table-of-contents regions
- A polite status announcement for the copy-link control
- High-priority decoding hints for the primary article image
- Lazy loading for the lower-page author portrait

The existing site-wide skip link, focus ring, focusable main landmark, reduced-motion behavior, and structured data remain intact.

## Audio controls

The custom audio player now exposes play and pause state through `aria-pressed` and an updated accessible label.

The former pointer-only progress track is now a native range input. Readers can seek with a keyboard, pointer, or assistive input device. The elapsed and total duration remain visible.

## Font loading

Syne and DM Sans now ship from the application bundle through the existing Fontsource dependencies. The shared layout no longer opens connections to Google Fonts or waits for its remote stylesheet.

The monospace stack uses local system fonts. The production bundle contains 14 local font files totaling approximately 138 KB.

## Contrast review

The primary shared combinations exceed WCAG AA requirements:

- White on navy: 18.49:1
- Muted text on navy: 7.55:1
- Muted text on card: 7.31:1
- Cyan on navy: 9.03:1
- Navy on cyan controls: 9.03:1

## Regression guardrail

Stage 5 adds `validate-article-experience.mjs` to the standard site validation command.

The validator currently protects:

- 173 shared-layout article pages
- 156 articles with responsive tables of contents
- 170 articles with accessible audio controls
- Article and main landmarks
- Skip links
- Named sharing controls
- Copy-link announcements
- Duplicate element IDs
- Local shared-font delivery

## Verification

The implementation passed:

- Astro production build with 621 generated pages
- Article-experience validation across all 173 shared-layout articles
- Identity, sitemap, learning-graph, route, and internal-link validation
- Protected-route validation across 623 HTML files
- Keyboard semantics checks for every narrated article
- Responsive table-of-contents markup checks
- WCAG contrast calculations for the shared palette
- Doctors Who Code voice review across new interface copy

The 26 known internal-link issues remain recorded as baseline debt. Stage 5 introduced none.

The in-app browser could not attach to the local preview during this session. Desktop and narrow visual sign-off remain pending. No browser result is represented as passed in this handoff.

## Next boundary

The next stage can complete visual sign-off, then address advanced quality work: image-dimension metadata, automated page-level accessibility testing, and performance budgets for representative learning and article routes.
