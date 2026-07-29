# Redesign Stage 1: Typed Educational Foundation

Date: 2026-07-29
Status: Complete

## Outcome

Doctors Who Code now has a typed educational graph beneath the existing publication.

The graph contains three learning paths, three pilot courses, thirteen lessons, three applied projects, and seven editorial channels. Every lesson points to an existing article. The article stays at its current `/blog/[slug]/` URL. No article body was duplicated or rewritten.

All educational records remain in draft status. Stage 1 adds no public route and changes no navigation.

## Collection inventory

| Collection | Records | Role |
| --- | ---: | --- |
| Paths | 3 | Orient learners by current need and intended outcome |
| Courses | 3 | Sequence lessons toward one defined competence |
| Lessons | 13 | Add objectives, prerequisites, difficulty, order, and project context to existing articles |
| Projects | 3 | Turn each pilot course into a bounded build |
| Channels | 7 | Curate durable subjects without relying on historical tags |

The existing `blog` collection remains unchanged and continues to own all article content.

## Pilot curriculum

### Learn to Code

Course: **Physician-Developer Foundations**

1. Your First Build
2. Protect the Work with Version Control
3. Your First Week on GitHub
4. Structure the Data with JSON

Applied project: **Build One Small Physician Utility**

### Use AI in Medicine

Course: **Clinical AI Workflows**

1. From Tasks to Workflows
2. Protect Clinical Sequence
3. Logs Before Intelligence
4. Choose the Infrastructure Boundary

Applied project: **Map a Clinical AI Workflow**

### Build Medical Software

Course: **From Clinical Need to Tested Tool**

1. When the Workaround Becomes Infrastructure
2. Move Clinical Logic Out of the Spreadsheet
3. Make Expected Behavior Executable
4. Retrieve Clinical Data with FHIR
5. Deploy and Verify the Tool

Applied project: **Build a Tested Clinical Calculator**

## Curriculum audit decision

The build path does not use the older broad article on web frameworks and APIs. That article contains useful material, but its framing and instructional precision do not meet the standard required for a core lesson.

The pilot course uses newer articles with explicit arguments about infrastructure, spreadsheet failure modes, testing, FHIR, and deployment. The path is narrower. The sequence is defensible.

## Content model

`src/content.config.ts` now defines:

- Controlled difficulty values: beginner, intermediate, and advanced
- Draft and published states for paths, courses, lessons, and channels
- Typed references from courses to paths and projects
- Typed references from lessons to articles, courses, paths, and projects
- Typed references from channels to articles, courses, and projects
- Required audience, outcome, prerequisite, objective, order, and estimated-time fields

Ordering has one owner. Courses own their position inside a path. Lessons own their position inside a course. Paths do not repeat complete course arrays, and courses do not repeat complete lesson arrays.

## Shared query layer

`src/utils/learning.ts` provides shared server-side queries for:

- Ordered learning paths
- Ordered courses within a path
- Ordered lessons within a course
- The learning context associated with an existing article
- Previous and next lessons
- Related project resolution
- Published channel retrieval

Drafts are excluded by default. Stage 2 can build pages against the same functions and opt into drafts only during controlled preview work.

## Graph validation

`npm run validate:learning` checks:

- Missing article, path, course, project, and channel references
- Duplicate path, course, and channel order values
- Duplicate article assignment across lessons
- Path mismatches between lessons and courses
- Missing courses within a path
- Missing lessons within a course
- Duplicate or noncontiguous lesson numbers
- Course-duration totals that disagree with lesson durations

The validation runs inside `npm run validate:site` and `npm run check`.

## Verification

The Stage 1 completion run passed:

- Astro 6 content synchronization and schema validation
- Production static build
- Learning graph validation
- Canonical identity validation
- Protected-route validation
- Internal-link regression validation

The public build remains at 601 Astro-generated pages and 603 total HTML files. No protected route disappeared. No new broken internal link was introduced.

## Stage 2 boundary

Stage 2 can now expose the foundation safely.

The next work is orientation and navigation: consolidate the active header, add accessible primary navigation, build Start Here and learning-path pages, and redesign the homepage around the three journeys. The collections should move from draft to published only when those destinations are complete and verified.
