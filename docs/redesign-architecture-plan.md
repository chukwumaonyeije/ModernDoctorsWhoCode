# Doctors Who Code Educational Platform Redesign

Status: Architecture proposal
Date: 2026-07-29
Implementation status: No application code changed

## Decision

Doctors Who Code should become a guided learning platform without ceasing to be a publication.

The current article corpus, `/blog/[slug]` URLs, Markdown and MDX files, visual identity, author provenance, audio, newsletter, and SEO system should remain intact. A new educational layer should sit above that foundation. Learning paths orient the visitor. Courses sequence the material. Existing articles serve as lessons when appropriate. Projects give the learning a concrete destination. The chronological archive remains available for readers who want the publication as published.

This is an additive information architecture. It does not require a bulk content rewrite or a route migration.

## I. Architectural review

### What the current site already does well

1. **The identity is specific.** The homepage, article author panel, profile pages, structured data, and footer establish that the site belongs to a practicing maternal-fetal medicine specialist who builds software.
2. **The reading system is mature.** `PostLayout.astro` supports long-form prose, generated reading time, audio, featured images, a desktop table of contents, tags, sharing, related posts, newsletter conversion, and author context.
3. **The SEO foundation is useful.** `BaseLayout.astro` centralizes canonical metadata, Open Graph fields, RSS discovery, sitemap discovery, and organization, person, website, and page schemas. The article route adds `BlogPosting` data and generated social images.
4. **The visual language is coherent.** The dark navy surface, cyan and purple accents, Syne display face, DM Sans reading face, and JetBrains Mono metadata face already create the medical-technical register the redesign needs.
5. **Astro is being used appropriately.** Content is statically generated. Client JavaScript is limited to search, filtering, clipboard behavior, and newsletter submission.
6. **Several reusable components already exist.** `PostCard`, `NewsletterForm`, `AudioPlayer`, `AuthorBio`, and `SeriesNav` can support the next architecture with controlled extensions.

### Where the current structure fails the new goal

1. **The homepage answers “who” before it answers “where do I begin.”** Its current three entry cards route to the official profile, a core argument, and one build. They do not map a visitor to the three specified journeys.
2. **The header exposes only Blog, About, and Subscribe.** The educational model has no primary navigation presence.
3. **The corpus is flat.** The content collection defines one `blog` collection. None of the 174 published post files currently declares `difficulty`, `prerequisites`, `learningObjectives`, `course`, `lessonNumber`, `learningPath`, or `relatedProject`.
4. **Discovery depends on chronology and tags.** The blog page renders every article, uses client-side title and description search, and places the frequent tags in one horizontal strip. It has no sorting, pagination, controlled facets, or learning context.
5. **Taxonomy is historical rather than instructional.** Category values include overlapping forms such as `AI in Medicine`, `Artificial Intelligence`, `Clinical AI`, `Healthcare Technology`, and `Technology`. Tags contain similar drift. Those values are useful as legacy descriptors but should not determine the learning architecture.
6. **Related content is inferred only from exact tag matches.** That can surface thematically similar work, but it cannot reliably answer what a learner should read next.
7. **Article chrome is fixed.** The same author, audio, image, sharing, newsletter, related-post, and bio sequence surrounds both short essays and long tutorials. The template cannot yet distinguish an essay from a lesson.
8. **There are two layout generations.** The active site uses `BaseLayout.astro` and `PostLayout.astro`, while `BlogPost.astro`, `Header.astro`, and `Footer.astro` retain an older parallel shell. The redesign should consolidate ownership before adding more variants.
9. **Accessibility has a solid semantic base but identifiable gaps.** The blog and hero search inputs need explicit labels. There is no skip link in the active layout. Focus-visible and reduced-motion rules are not evident in the global stylesheet. The desktop table of contents disappears on smaller screens without an equivalent in-flow lesson outline.
10. **Font delivery is duplicated.** Local font assets and Fontsource packages exist, while `BaseLayout.astro` also requests Google Fonts. A later performance pass should choose one delivery method.

### Supplemental strategy interpretation

The website remains the authoritative educational source. GitHub should hold buildable work. A future Discord community can hold live interaction. GitHub Discussions can later preserve technical questions and answers.

The first release should not add comments or make community infrastructure a dependency. In this plan, **Channels** are curated editorial topic hubs inside the website. They are not chat rooms. A community call to action can be added when the external community is ready.

## II. Target information architecture

```text
Home
├── Start Here
├── Learning Paths
│   ├── Learn to Code
│   ├── Use AI in Medicine
│   └── Build Medical Software
├── Courses
│   └── Course
│       ├── Overview
│       └── Ordered lessons
├── Projects
│   └── Project detail
├── Channels
│   └── Curated topic hub
├── Articles
│   ├── Search and controlled filters
│   └── Existing article at /blog/[slug]
└── About
```

### Content relationships

```text
Learning path
  contains ordered courses

Course
  contains ordered lessons
  may culminate in one or more projects

Lesson
  points to an existing article or contains new lesson content
  declares objectives, prerequisites, difficulty, and next step

Project
  applies skills from one or more courses
  may point to GitHub, OpenMFM, CodeCraftMD, or a local case study

Channel
  curates articles, lessons, courses, and projects around a durable subject
```

The learning graph should be explicit. Tags can continue to support broad discovery, but they should not define course order.

## III. Route plan

| Purpose | Canonical route | Compatibility decision |
| --- | --- | --- |
| Homepage | `/` | Redesign in place |
| Orientation | `/start/` | New |
| Path index | `/paths/` | New |
| Path detail | `/paths/[slug]/` | New |
| Course index | `/courses/` | New |
| Course detail | `/courses/[slug]/` | New |
| Project index | `/projects/` | New |
| Project detail | `/projects/[slug]/` | New |
| Channel index | `/channels/` | New |
| Channel detail | `/channels/[slug]/` | New |
| Article archive | `/articles/` | New presentation route or alias for the archive |
| Existing archive | `/blog/` | Preserve. It may become the canonical article archive initially. |
| Existing articles | `/blog/[slug]/` | Preserve every published URL |
| Existing tags | `/tags/[tag]/` | Preserve for backlinks and search traffic |
| About and identity | Existing routes | Preserve |
| Newsletter | `/subscribe/` preferred | Add a focused route, then redirect `/contact/` only after parity and analytics review |

The initial implementation should keep `/blog/` and `/blog/[slug]/` canonical. The navigation label can change from “Blog” to “Articles” without changing the URL. A physical move to `/articles/[slug]/` would create risk without improving the learning experience.

## IV. Content architecture

### Recommended folders

```text
src/content/
├── articles/              # Long-term destination, not required in phase one
├── courses/
├── lessons/               # Only for net-new lesson-native content
├── paths/
├── projects/
└── channels/

src/data/
├── article-learning-map.ts
└── taxonomy.ts
```

The current `src/content/blog/posts/` folder should remain in place during the first releases. Renaming 174 files provides little learner value and creates avoidable migration risk. The exported collection can be renamed from `blog` to `articles` only after consumers are isolated behind shared query utilities.

### Modeling decision

Existing articles should not be duplicated into a `lessons` collection. A lesson record should reference an article by collection entry ID. New lesson-native material can live in `lessons/` when it is genuinely instructional and has no article equivalent.

During migration, `article-learning-map.ts` should hold educational annotations for existing articles. This avoids editing 174 source files at once and permits review of the curriculum as a separate, typed layer. Stable annotations can later move into article frontmatter.

### Proposed Astro schemas

```ts
const difficulty = z.enum(['beginner', 'intermediate', 'advanced']);

const learningMeta = z.object({
  difficulty: difficulty,
  prerequisites: z.array(z.string()).default([]),
  learningObjectives: z.array(z.string()).min(1),
  path: reference('paths'),
  course: reference('courses'),
  lessonNumber: z.number().int().positive(),
  relatedProject: reference('projects').optional(),
});

const paths = defineCollection({
  loader: glob({ base: './src/content/paths', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    audience: z.string(),
    outcome: z.string(),
    order: z.number().int(),
    icon: z.enum(['code', 'ai', 'software']),
    featured: z.boolean().default(true),
    courseIds: z.array(reference('courses')),
  }),
});

const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    path: reference('paths'),
    difficulty: difficulty,
    outcomes: z.array(z.string()).min(1),
    prerequisites: z.array(z.string()).default([]),
    estimatedMinutes: z.number().int().positive(),
    lessonIds: z.array(z.string()).min(1),
    projectIds: z.array(reference('projects')).default([]),
    status: z.enum(['draft', 'published']).default('draft'),
    order: z.number().int(),
  }),
});

const lessons = defineCollection({
  loader: glob({ base: './src/content/lessons', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    articleId: z.string().optional(),
    course: reference('courses'),
    path: reference('paths'),
    lessonNumber: z.number().int().positive(),
    difficulty: difficulty,
    estimatedMinutes: z.number().int().positive(),
    prerequisites: z.array(z.string()).default([]),
    learningObjectives: z.array(z.string()).min(1),
    relatedProject: reference('projects').optional(),
    status: z.enum(['draft', 'published']).default('draft'),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    difficulty: difficulty,
    skills: z.array(z.string()).min(1),
    estimatedHours: z.number().positive().optional(),
    repositoryUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    image: z.object({ url: z.string(), alt: z.string() }).optional(),
    relatedCourses: z.array(reference('courses')).default([]),
    featured: z.boolean().default(false),
    status: z.enum(['idea', 'build', 'published']).default('published'),
  }),
});

const channels = defineCollection({
  loader: glob({ base: './src/content/channels', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    topics: z.array(z.string()).min(1),
    featuredArticleIds: z.array(z.string()).default([]),
    featuredCourseIds: z.array(reference('courses')).default([]),
    featuredProjectIds: z.array(reference('projects')).default([]),
    order: z.number().int(),
  }),
});
```

Astro content references must be validated against the installed Astro 6 API during implementation. Circular authoring dependencies should be avoided. Prefer a single ownership direction for ordering, such as `course.lessonIds`, rather than requiring both course and lesson files to repeat the complete relationship.

## V. Page hierarchy and reusable components

### Navigation

Desktop primary navigation:

```text
Doctors Who Code | Start Here | Learning Paths | Courses | Projects | Articles | About | Search | Subscribe
```

At tablet and mobile widths, use a real menu button with `aria-expanded`, an associated menu ID, Escape-to-close behavior, visible focus, and a no-JavaScript fallback that still exposes primary destinations.

The header should be owned by one component and consumed by `BaseLayout.astro`. Remove or archive the unused parallel header and footer only after import verification.

### Required component set

| Component | Responsibility | Reuse strategy |
| --- | --- | --- |
| `SiteHeader` | Global navigation, mobile menu, search entry | Consolidate current active and legacy header implementations |
| `Breadcrumbs` | Hierarchy and orientation | New |
| `PathCard` | Audience, starting point, outcome, course count | Derive visual language from `PostCard` |
| `CourseCard` | Difficulty, time, lesson count, outcome | New shared card primitive |
| `ProjectCard` | Build outcome, skills, links, status | Extend shared card primitive |
| `LessonContext` | Path, course, lesson number, difficulty, prerequisites, objectives | New |
| `LessonNavigator` | Previous and next lesson with course progress | Adapt `SeriesNav` |
| `LearningOutcomeList` | Compact objective list | New |
| `ProgressIndicator` | Static progress initially, local persistence later | New, server-rendered in phase one |
| `ArticleCard` | Publication discovery | Rename or extend `PostCard` without breaking callers |
| `SearchForm` | Labeled search UI shared by home and archive | Extract current duplicated behavior |
| `NewsletterForm` | Track-aware subscription | Reuse |
| `AudioPlayer` | Narration | Reuse |
| `AuthorBio` | Provenance | Reuse, but make compact mode available for lesson pages |

### Homepage wireframe

```text
[Global navigation]

[Hero]
Doctors Who Code
Build the technical judgment to shape the tools you use in medicine.
Where are you in your physician-developer journey?
[Find my path] [Browse all articles]

[Three learning paths]
[Learn to Code] [Use AI in Medicine] [Build Medical Software]
Audience + outcome + first course on each card

[Start Here]
One short orientation guide with expected time and next destination

[Featured courses]
Three to four sequenced course cards

[Build what you learn]
Two or three physician-built projects with concrete clinical context

[Latest from the journal]
Recent articles remain chronological here

[Newsletter]
Reuse the three track choices and align them with the three paths

[Author provenance strip]
Compact clinical identity and official properties
```

The hero should lead with learner orientation. Author credibility remains visible, but it should support the choice rather than compete with it.

### Learning path page

```text
Breadcrumbs
Path title + explicit audience
Outcome statement
Prerequisite check
Course sequence with estimated time and difficulty
Recommended starter project
Related channel
Newsletter track
```

Every path page must answer who it serves, where to begin, what competence it develops, and what the learner can build afterward.

### Course page

```text
Breadcrumbs
Course title + path + difficulty + total time
What you will learn
Prerequisites
Ordered lesson syllabus
Course project
Next course in path
```

Course order should come from curated data, never publication date. Lessons that point to existing articles should link to their preserved `/blog/[slug]/` URLs.

### Article and lesson experience

`PostLayout.astro` should accept optional learning metadata. When that metadata is present, render a lesson variant:

1. Breadcrumbs
2. Path, course, lesson number, difficulty, and reading time
3. Title and description
4. Compact author provenance
5. Learning objectives and prerequisites
6. Audio and featured image when present
7. Article body, unchanged
8. Related project
9. Previous and next lesson
10. Related articles
11. Newsletter and compact author bio

When learning metadata is absent, preserve the current essay experience. This conditional model allows gradual migration and prevents weak or invented curriculum labels from appearing across the archive.

On short articles, reduce secondary chrome. The full author card and large newsletter can become compact variants. On mobile, place a collapsible “In this lesson” outline in the document flow instead of removing the table of contents completely.

## VI. Search and taxonomy

The first search release should remain static and dependency-light.

1. Generate a compact search index at build time containing title, description, normalized category, controlled topics, path, course, difficulty, and URL.
2. Use a small client module only after the visitor interacts with search.
3. Provide a dedicated `/search/` or enhanced `/blog/` results experience with a labeled input, result count announced through `aria-live`, URL-persisted query and facets, and a useful empty state.
4. Keep tag routes intact, but replace the horizontal wall of tags with controlled facets: Path, Format, Difficulty, Topic, and recency.
5. Create a taxonomy alias map that normalizes historical labels without rewriting the original articles in the first pass.

Suggested channel taxonomy:

- Clinical AI
- Physician-Developer Foundations
- Healthcare Data and FHIR
- Clinical Workflow Automation
- Building and Shipping
- Maternal-Fetal Medicine Systems
- Physician Entrepreneurship

Channels should be few, curated, and durable. Tags can remain granular.

## VII. Accessibility and performance gates

### Accessibility

- Add a skip-to-content link and stable `main` target.
- Add explicit labels to every search field.
- Establish global `:focus-visible` treatment.
- Respect `prefers-reduced-motion` for lifts, transitions, and scrolling.
- Test header, filters, lesson navigation, newsletter, audio, tables, and code with keyboard only.
- Maintain one H1 and a valid heading outline on every generated page.
- Announce dynamic search result counts.
- Preserve horizontal overflow for tables and code, but provide clear focus and scroll affordances.
- Verify color contrast numerically before release.
- Keep touch targets at least 44 by 44 CSS pixels where practical.

### Performance

- Keep pages statically generated.
- Avoid a global client framework for navigation or progress.
- Replace repeated inline styles with scoped components and shared tokens as pages are touched.
- Use Astro image handling for local images when migration risk is low.
- Choose local or Fontsource font delivery and remove the duplicate Google Fonts request.
- Defer the search index until interaction if its compressed size becomes material.
- Set performance budgets before the first visual implementation: no regression in current Lighthouse performance, no avoidable layout shift, and minimal JavaScript on reading pages.

## VIII. Migration strategy

### Content classification

Do not assign all 174 articles to courses.

Classify each article into one of four roles:

1. **Core lesson:** belongs in an ordered course.
2. **Supporting reading:** linked from a lesson or course, but not required.
3. **Journal article:** remains in the chronological publication and one or more channels.
4. **Archive only:** preserved for URL and historical value but not actively promoted.

The first curriculum should use a small, defensible subset. A course with four strong lessons is better than a course padded with loosely related posts.

### Initial curriculum slice

Start with one course in each path. Use existing articles wherever they fit without rewriting them.

| Path | First course | Intended outcome |
| --- | --- | --- |
| Learn to Code | Physician-Developer Foundations | Understand GitHub, Markdown, JSON, and the shape of a small code project |
| Use AI in Medicine | Clinical AI Workflows | Distinguish prompts from workflows and identify safe human checkpoints |
| Build Medical Software | From Clinical Need to Tested Tool | Translate a bounded clinical problem into an API-backed, tested, deployable application |

The exact lesson selections require a curriculum audit of article bodies, not titles alone.

### URL and SEO protection

- Preserve published article paths and canonical URLs.
- Do not duplicate full article bodies at course or lesson routes.
- Course pages should link to canonical article URLs.
- Add breadcrumbs and educational structured data without removing `BlogPosting` markup.
- Consider `Course`, `ItemList`, `LearningResource`, and `BreadcrumbList` schema where the page content supports those types.
- Generate a route manifest before and after every release and fail the build when a protected route disappears.
- Add redirects only when a destination has full functional parity.

## IX. Phased implementation plan

### Phase 0: Baseline and guardrails

- Record the current generated route manifest, build output, Lighthouse scores, core accessibility checks, and representative screenshots.
- Identify which legacy layout and header components are unused.
- Add automated checks for broken internal links, duplicate lesson order, missing referenced content, and protected route loss.
- Define the controlled taxonomy and curriculum ownership rules.

Exit gate: the current site can be rebuilt and compared reliably before redesign work begins.

### Phase 1: Typed educational foundation

- Add path, course, project, and channel collections.
- Add the migration map for existing articles.
- Create shared content-query utilities.
- Author the three path records and one pilot course per path.
- Keep all new records in draft until references validate.

Exit gate: `astro build` validates every educational relationship with no public navigation change.

### Phase 2: Orientation and navigation

- Consolidate the active header.
- Add Start Here, Learning Paths, Courses, Projects, Articles, and About navigation.
- Implement accessible mobile navigation and shared search entry.
- Build `/start/`, path index, and path detail pages.
- Redesign the homepage around the three journeys while reusing the current visual system and newsletter.

Exit gate: a first-time visitor can select a path and reach the first lesson in two intentional choices.

### Phase 3: Course and lesson layer

- Build course index and detail pages.
- Add `LessonContext`, learning objectives, prerequisites, breadcrumbs, and adapted `SeriesNav` behavior to `PostLayout.astro`.
- Render the lesson variant only for mapped articles.
- Add related projects and deterministic previous and next lesson links.

Exit gate: each pilot course answers who it is for, what it teaches, what comes next, and what can be built afterward.

### Phase 4: Projects, channels, and discovery

- Build project and channel indexes and detail pages.
- Replace uncontrolled archive filters with controlled facets while preserving tag routes.
- Add a build-time search index and accessible results experience.
- Normalize historical taxonomy through aliases.

Exit gate: visitors can browse by journey, curriculum, project, durable topic, or search without relying on chronology.

### Phase 5: Template refinement and quality

- Add compact article chrome for short pieces.
- Add the mobile in-flow table of contents.
- Complete keyboard, contrast, reduced-motion, and screen-reader checks.
- Consolidate font delivery and optimize repeated image handling.
- Validate structured data, canonical URLs, RSS, sitemap, and social images.

Exit gate: representative homepage, path, course, lesson, project, channel, archive, article, About, and newsletter pages meet the release checklist on mobile and desktop.

### Phase 6: Community integration

- Add a community call to action only when a real destination exists.
- Launch Discord as the live collaboration layer if the community strategy is approved.
- Add GitHub Discussions to durable technical material when moderation and ownership are defined.
- Keep the website authoritative for curriculum and published knowledge.

Exit gate: community links lead to staffed, documented spaces rather than empty channels.

## X. First implementation slice

The safest first code change is not a homepage rewrite. It is the typed educational foundation plus one vertical slice:

1. Define the collections and reference utilities.
2. Create the three path records.
3. Create one pilot course for Learn to Code.
4. Map four to six existing articles as lessons.
5. Build the path page, course page, and conditional lesson context.
6. Preserve every current article URL and the existing essay fallback.
7. Verify build, routes, keyboard behavior, and representative mobile and desktop renders.

Once that slice works, the homepage can point to a real learning system rather than a set of placeholder destinations.

## XI. Definition of success

The redesign succeeds when a physician can arrive without technical context, identify the appropriate path, understand the expected outcome, begin a sequenced lesson, and see the project that the learning enables.

The archive should still work. The articles should still rank. The author should still be unmistakable. The difference is that the corpus now has an educational spine.
