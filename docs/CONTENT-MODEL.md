# Content model

The authoritative schemas are in `src/content.config.ts`. Keep existing field names and loader paths until a separately reviewed change provides compatibility. No article migration is needed to implement the 2027 learning experience.

| Collection | Location | Role |
| --- | --- | --- |
| blog | `src/content/blog/posts/*.{md,mdx}` | Single source of published article prose; `draft` controls publication. Nested drafts are outside this loader. |
| paths | `src/content/paths/` | Audience, outcome, order, newsletter track and publication status. |
| courses | `src/content/courses/` | Path reference, ordered placement, difficulty, outcomes, prerequisites, duration and optional project. |
| lessons | `src/content/lessons/` | References an article/course/path; supplies order, instructional metadata and optional project. Does not duplicate article prose. |
| projects | `src/content/projects/` | Build briefs, skills, path references and optional destinations; idea/build/published is lifecycle status. |
| channels | `src/content/channels/` | Curated topic discovery through article/course/project references. |

Articles use `pubDate`, optional `updatedDate`, `image: {url, alt}`, optional `readingTime`, `canonical` and `audioUrl`, with title/description/author/tags/category/featured metadata. Do not rename these to the PRD's illustrative field names merely for consistency. Preserve explicit historical slugs and generated routes.

Current ownership: courses reference paths; lessons reference courses and articles. `src/utils/curriculum.ts` provides the typed, pure query model; `src/utils/learning.ts` loads Astro collections and exposes the public query API. Home, start, path, course, project, channel, article context and search consumers use that model.

Course and path duration is the sum of visible lesson `estimatedMinutes`. The eight authored course totals were removed. The optional legacy course field remains accepted by the schema for compatibility, but no consumer uses it. Lesson effort remains an intentional editorial estimate. `getReadingMetadata()` in `src/utils/blog.ts` separately preserves the existing article 200-word-per-minute algorithm and explicit readingTime overrides; article templates and their cards now share it.

Lesson `path` is optional transitional metadata. If supplied, the validator requires it to match the course's path. Queries always derive the effective path from the course. A visible lesson requires a published lesson, published course, published path and non-draft article. `includeDrafts` is an explicit authoring option, never used by public pages. Project idea/build/published values describe lifecycle, so existing idea briefs remain browsable.

The graph validator runs before build. It rejects missing or duplicate IDs (using Astro-compatible slug resolution), duplicate article assignments, invalid/duplicate lesson numbers, mismatched paths, unpublished public dependencies, empty published sequences, gaps in public course/lesson order, invalid effort estimates and project/path inconsistencies. Draft placeholders may have no lessons. Curated published channels cannot reference draft articles or courses.

## Stable lesson identity

The existing content entry ID is the lesson's durable identity for future progress storage. Keep filenames/explicit slugs stable when editing titles or moving a lesson between courses. Never use lessonNumber, title or array position as a storage key, and never recycle a retired lesson ID for different content. Unique article membership applies across draft and published records.

Retire a lesson by setting it to draft, adjusting the remaining public sequence, and checking that published courses still have lessons. Future progress readers must ignore retired/unknown IDs without marking another lesson complete. Any intentional ID replacement needs a separate reviewed migration; no progress storage or ID migration is implemented here.

## Query contracts

- `getPathSummaries()` and `getPathContext(id)` provide course/lesson counts, total minutes and ordered course sections.
- `getCourseSummaries()` and `getCourseContext(id)` provide syllabus, total minutes, path, project, neighboring courses and a valid terminal action.
- `getLearningContextForArticle(id)` provides the same course sequence, derived path and previous/next lessons.
- `getProjectContext(id)` and `getChannelContext(id)` return course cards from the same summaries and filter through the public graph.
- `getCurriculum()` provides a single fresh snapshot for consumers such as search. No module-level cache hides content edits during development.

The last lesson points to the real course project section when one exists, otherwise the syllabus. Its label is End of course, not a claim of recorded completion. No completion state is stored by this work.

Existing journal series also use MDX SeriesNav arrays. They are preserved article content and must not be silently rewritten or treated as validated course records. Special Astro articles are outside the blog collection and require explicit handling in discovery tools.

Every published post requires narration in the author's configured Fish Audio voice. Preserve existing audioUrl values. The audio script/workflow mutates MP3s and frontmatter; validation must not invoke it. Newly generated narration and its reviewed preservation entries belong in the same publishing change.

The preservation manifest protects all current published source bodies, authored metadata and generated article identity. New records are allowed, but add them to the approved manifest during publishing to extend protection. Intentional editorial changes require narrow manifest review, as documented in [Preservation checks](PRESERVATION-CHECKS.md).
