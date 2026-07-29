# Redesign Stage 3: Course and Lesson Layer

Date: 2026-07-29
Status: Complete

## Outcome

Doctors Who Code now has a public course layer and a conditional lesson experience on the existing article archive.

Three pilot courses have dedicated overview pages. Thirteen mapped articles now display their learning path, course, lesson number, difficulty, objectives, prerequisites, related project, and deterministic previous and next lessons. Every article body and canonical `/blog/[slug]/` URL remains unchanged.

Articles outside the learning graph continue to render with the original essay experience.

## Public routes

Stage 3 adds four protected pages:

- `/courses/`
- `/courses/physician-developer-foundations/`
- `/courses/clinical-ai-workflows/`
- `/courses/from-clinical-need-to-tested-tool/`

The protected route baseline now contains 612 HTML pages and eight critical endpoints.

## Course experience

Every course page answers four questions:

1. Who is this for?
2. What will I learn?
3. What should I read next?
4. What can I build afterward?

The course page includes path context, difficulty, total time, lesson count, course outcomes, prerequisites, an ordered syllabus, and the related applied project. Lesson order comes from the typed curriculum graph. Publication dates do not affect the sequence.

The course index uses the shared `CourseCard` component to present the three pilot courses consistently.

## Lesson experience

`PostLayout.astro` now resolves optional learning context from the article ID.

When a published lesson record maps to the article, the page adds:

- Learning-path and course breadcrumbs
- Course, lesson number, difficulty, and reading-time metadata
- A compact author panel
- Learning objectives and prerequisites
- Related applied project context
- Complete course progress
- Deterministic previous and next lesson links
- `LearningResource` and `BreadcrumbList` structured data alongside the existing `BlogPosting` schema

When no lesson record maps to the article, none of this additional interface renders. The existing article template remains the fallback.

## Shared components

Stage 3 adds:

- `CourseCard.astro`
- `LearningOutcomeList.astro`
- `LessonContext.astro`
- `LessonNavigator.astro`
- `ProjectCallout.astro`

The shared learning query layer now also provides all published courses and complete course context, including path, lessons, project, and adjacent courses.

## Navigation

Courses now appear in the shared primary navigation. The responsive menu breakpoint moved to 1050 pixels so the additional destination does not compress the desktop header.

Learning-path course headings now link to the dedicated course pages. Direct lesson links remain available on the path page.

## Verification

The completion review passed:

- Astro production build with 610 generated pages
- Learning graph validation for 3 paths, 3 courses, 13 lessons, 3 projects, and 7 channels
- Canonical identity and sitemap validation
- Protected-route validation across 612 HTML files
- Internal-link regression validation with no new failures
- Explicit mapped-lesson rendering check
- Explicit unmapped-essay fallback check
- Desktop visual review of a course and mapped lesson
- Narrow responsive review of a course and mapped lesson
- Doctors Who Code voice check across all new public copy

The 25 known internal-link issues remain recorded as baseline debt. Stage 3 introduced none.

## Stage 4 boundary

The next stage can expose projects and channels as first-class destinations, then improve article discovery with controlled facets and a build-time search index. Project records currently appear as course and lesson context but do not yet own public routes.
