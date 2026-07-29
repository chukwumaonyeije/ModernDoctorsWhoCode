# Redesign Stage 2: Orientation and Navigation

Date: 2026-07-29
Status: Complete

## Outcome

Doctors Who Code now presents the publication as a physician-developer learning platform without moving or rewriting the article archive.

The site has one shared, accessible header; a Start Here decision page; a learning-path directory; three public learning-path pages; and a homepage organized around the learner's current work. The three pilot paths, courses, and lessons are now published.

## Public routes

Stage 2 adds five protected pages:

- `/start/`
- `/paths/`
- `/paths/learn-to-code/`
- `/paths/use-ai-in-medicine/`
- `/paths/build-medical-software/`

The protected route baseline now contains 608 HTML pages and eight critical endpoints. All existing `/blog/[slug]/` article routes remain intact.

## Shared navigation

`src/components/Header.astro` is now the only primary site header. It provides:

- Home, Start Here, Learning Paths, Articles, and About destinations
- Search and Subscribe actions
- Current-page indication with `aria-current`
- A labeled mobile menu button with synchronized `aria-expanded` state
- Escape-key closing with focus returned to the menu button
- A usable expanded navigation fallback when JavaScript is unavailable

`src/layouts/BaseLayout.astro` now supplies a skip link and a stable `main` landmark. Global focus styles remain visible for keyboard users, and reduced-motion preferences are respected.

## Orientation model

The homepage and Start Here page use the same three questions:

1. I have not shipped code yet.
2. I use AI, but I still coordinate every step.
3. I am ready to build a clinical tool.

Each answer leads to a bounded path with a defined audience, outcome, course sequence, lesson count, time estimate, and applied project. Publication dates do not control learning order. The typed curriculum graph does.

## Homepage hierarchy

The redesigned homepage now leads with the platform proposition: medicine needs more physicians who can build.

The page then provides:

- A current-work orientation panel
- The three learning paths
- A concise Start Here guide
- Real physician-built project examples
- Recent articles
- The existing newsletter signup

This preserves the publication's role while making the educational entry points visible before the archive.

## Verification

The completion review passed:

- Astro production build with 606 generated pages
- Learning graph validation for 3 paths, 3 courses, 13 lessons, 3 projects, and 7 channels
- Canonical identity and sitemap validation
- Protected-route validation across 608 HTML files
- Internal-link regression validation with no new failures
- Desktop visual review of the homepage and learning-path detail page
- Narrow responsive review of the homepage and Start Here page
- Mobile navigation initialization and responsive hierarchy review

The 25 known internal-link issues remain recorded as baseline debt. Stage 2 introduced none.

## Stage 3 boundary

The next stage can deepen the learning experience without changing article URLs. The likely scope is public course and project pages, followed by lesson context on article pages: course position, objectives, prerequisites, previous and next lessons, and the related applied project.
