# Current State Architecture and UX Audit

Audit date: September 15, 2026. Scope: the existing repository, assessed against `PRD-DWC-2027.md`.

## Executive assessment

Doctors Who Code already has a static learning platform beneath its journal. The next implementation should extend that platform. Recreating collections, routes, cards, lesson navigation, or the homepage from scratch would discard working functionality.

The repository runs Astro **6.0.5**, not the Astro 4 described in AGENTS.md and not the Astro 7 target in the PRD. It contains **208 published collection articles, 3 paths, 8 courses, 38 lesson records, 4 projects, and 7 channels**. Articles remain at `/blog/...`; lesson records reference them rather than duplicate their bodies.

The largest product gaps are system/light/dark themes, persistent local learning progress, persistent course context, full-text search, and responsive optimized images. Existing strengths include schema validation, ordered curricula, accessible mobile navigation foundations, mobile and desktop TOCs, local primary fonts, generated social images, and executable route protection.

All proposals below carry a priority:

- **Required:** needed to meet an explicit PRD requirement, preserve content/URLs, or correct a concrete functional or exposure defect.
- **Recommended:** useful maintainability or UX improvement, but not a release requirement by itself.
- **Optional:** an elective enhancement or implementation choice that can be deferred.

## Scope, method, and limitations

Repository inventory covered tracked files, application source, content, public assets, scripts, configuration, existing architecture/stage documents, baseline manifests, and local supporting directories. All source text was included in structural scans; frontmatter was parsed across all six active collections. Runtime architecture, layouts, routes, components, utilities, and validation code were inspected in detail. Article bodies were scanned for embedded components, scripts, assets, and navigation patterns, not editorially rewritten or medically reassessed.

The repository has 760 tracked files, 354 files under `src`, and 373 under `public` at this snapshot. The source text scan covered approximately 2.6 MB. Binary audio, images, PDFs, and videos were inventoried, not transcribed or visually reviewed in full. `node_modules`, generated `dist`/`.astro`, `.git` internals, and temporary deployment copies are not alternative sources of application architecture. Environment secret values were not read or reproduced.

Pre-existing untracked material included AGENTS.md, the PRD, `DOCTORS WHO CODE 2027/`, a PDF, drafts, `tmp/`, and video briefs. These were left intact. The additional 2027 manuscript and historical stage documents are planning context; the requested PRD is the implementation target. No source, article, dependency, redirect, baseline, or production configuration was changed. The local build regenerated ignored output only.

This is a source and generated-output audit. It is **not** a browser accessibility certification, screen-reader test, Lighthouse run, field Core Web Vitals measurement, external-link crawl, or dependency vulnerability assessment. Prior Stage 5 documentation also leaves visual browser sign-off pending. Risks inferred from code are identified as such.

## Verified build baseline

| Check | Result |
| --- | --- |
| Node | 22.19.0; package requires >=22.12.0 |
| `npm run check` | Passed with `ASTRO_TELEMETRY_DISABLED=1` in the process environment |
| Astro build | Static output; 723 generated pages; approximately 50 seconds locally |
| Final HTML | 725 files, including two copied public slide documents |
| Protected routes | All 623 baseline pages and 8 critical endpoints remain |
| Added since baseline | 102 HTML pages |
| Internal-link validation | 26 known baseline failures, no new failures |
| Learning graph | 3 paths, 8 courses, 38 lessons, 4 projects, 7 channels passed |
| Article markup validation | 209 shared-layout articles, 192 with TOCs, 206 with audio |
| Identity validation | Passed |

The first build attempt stopped because Astro telemetry tried to create a configuration directory outside the writable workspace. Disabling telemetry for the build resolved that environment issue. It was not an application failure.

The 209 shared-layout count includes the internal special article alongside 208 collection articles. The separate Docling page uses BaseLayout directly and is outside this validator's article selection. A green check therefore does not mean all public article experiences have equivalent coverage.

`npm run build` only builds. `npm run check` additionally runs identity, learning, article-markup, and route validators. There are no `test` or `lint` scripts and no configured `astro check` type-check command. The inspected GitHub workflow generates audio; it does not enforce the complete site check on pull requests. Vercel's actual dashboard settings were not inspected.

## Framework, configuration, and dependencies

Evidence: `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json`, `vercel.json`.

- Astro range `^6.0.5`, locked version 6.0.5. MDX 5.0.1, React integration 5.0.0, RSS 4.0.17, sitemap 3.7.1.
- Static generation is the default and is confirmed by the build. No adapter, server routes requiring a database, or authentication infrastructure is configured.
- Tailwind 4.2.1 is installed through `@tailwindcss/vite` 4.2.1 and CSS `@import "tailwindcss"`. There is no `tailwind.config.mjs`; this is not evidence of missing configuration.
- React and React DOM 19.2.4 support one active screenshot-carousel island. Type packages are 19.2.14 and 19.2.3 respectively.
- Fontsource DM Sans 5.2.8 and Syne 5.2.7 supply local fonts.
- Satori 0.25.0 and Sharp 0.34.5 generate PNG social images at build time. They have active uses and are not redundant React UI dependencies.
- `js-yaml` is a development dependency used by content validators and maintenance scripts.
- TypeScript extends Astro strict configuration, but compilation is not a complete type check. Its broad include also warrants review when introducing a checker because local temporary copies exist.
- `site` is `https://www.doctorswhocode.blog`. No explicit trailing-slash, image, font API, CSP, or client-router configuration is present.

**Required:** upgrade Astro and compatible integrations in an isolated phase to meet the PRD's 7.x target, after preserving rendered-output and route baselines. The official [Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/) documents compiler, Markdown processor, and whitespace changes. Those make MDX examples, headings, and mixed HTML important regression fixtures. The PRD's specific “7.3 is current” statement is not a substitute for selecting and verifying an exact compatible release at implementation time.

**Recommended:** establish a dependency/security baseline and repeat it on the upgrade branch; do not describe packages as vulnerable or obsolete without evidence. Move React type packages to development dependencies if deployment installation and type checking still work.

**Optional:** replace the simple carousel with native HTML and a small script, then remove React, React DOM, their integration, JSX configuration, and types only after confirming no remaining consumers. React is currently used, so immediate removal would break an article.

## Content collections and frontmatter

Evidence: `src/content.config.ts`. All loaders use shallow `*.{md,mdx}` patterns and filename-derived collection IDs, subject to Astro's ID generation behavior. Nested `_drafts` and `src/content/blog/pages` are outside the active blog loader. Three historical articles also have explicit `slug` frontmatter; preserve actual generated routes rather than inferring URLs from filenames alone.

| Collection | Count | Structure |
| --- | ---: | --- |
| `blog` | 208 | Required title, description, pubDate. Defaults for author, authorUrl, tags, category, draft, featured, featuredRank. Optional updatedDate, image `{url, alt}`, readingTime, canonical, audioUrl. |
| `paths` | 3 | Title, description, audience, outcome, order, icon, newsletterTrack, featured, publication status. |
| `courses` | 8 | Path reference, difficulty, outcomes, prerequisites, estimatedMinutes, optional project reference, order, publication status. |
| `lessons` | 38 | Article/course/path references, lessonNumber, difficulty, estimatedMinutes, prerequisites, learningObjectives, optional relatedProject, publication status, title/description. |
| `projects` | 4 | Paths references, difficulty, skills, optional estimatedHours, repositoryUrl, liveUrl, image, featured; status is idea/build/published. |
| `channels` | 7 | Topics, curated article/course/project references, order, publication status, title/description. |

All 208 top-level articles and all path/course/lesson/channel records are published at this snapshot. All four curriculum projects currently have status `idea`. Project lifecycle status is not a publication flag: the queries expose these project briefs publicly. The homepage's working external examples are a separate curated list. This distinction matters when the learning UI promises a finished build or a working demonstration.

The raw articles additionally contain `series`, `seriesPart`, `seriesTotal`, and explicit `slug` fields not declared in the blog schema. These should not be assumed to be validated curriculum data. Of the articles, 128 declare an image, 116 declare readingTime, and 206 declare audioUrl.

Two collection posts lack audioUrl: `pgis-performance-glycemic-intelligence-system` and `the-bot-manager-fallacy-in-healthcare`. The separate Docling route also bypasses the ordinary audio workflow. **Required:** reconcile these against the standing narration rule without regenerating existing audio indiscriminately. This audit did not invoke Fish Audio or change frontmatter.

**Required:** retain current `blog`, `pubDate`, `image`, IDs, audio fields, and URLs through compatibility adapters. The PRD's proposed `articles`/`publishedDate`/`heroImage` names are a suggested shape, not a reason to migrate historical articles. The existing lesson-reference model already meets the no-duplicate-body requirement.

## Curriculum graph and duplication

Evidence: `src/utils/learning.ts`, collection files, `scripts/validate-learning-graph.mjs`.

```text
path <- course.path
course <- lesson.course
article <- lesson.article   -> existing /blog/article-id/
project <- course.project and lesson.relatedProject
paths <- project.paths
channels -> curated articles, courses, projects
```

| Path | Course | Lessons | Authored minutes |
| --- | --- | ---: | ---: |
| Learn to Code | Physician-Developer Foundations | 4 | 27 |
| Use AI in Medicine | Clinical AI Workflows | 5 | 46 |
| Use AI in Medicine | Ambient Clinical Documentation | 10 | 67 |
| Use AI in Medicine | Clinical AI Literacy | 5 | 65 |
| Use AI in Medicine | Agents 101 for Physician Developers | 3 | 35 |
| Use AI in Medicine | The Middle Path | 1 | 25 |
| Build Medical Software | From Clinical Need to Tested Tool | 5 | 51 |
| Build Medical Software | From Evidence to Software | 5 | 38 |

The validator checks missing references, duplicate article assignments, course/path agreement, contiguous lesson numbers, unique ordering, nonempty courses/paths, and equality of course minutes with summed lesson minutes. This is substantial existing infrastructure.

Remaining duplication and semantics:

| Finding | Impact | Proposal |
| --- | --- | --- |
| Course minutes manually repeat lesson totals | Validation detects drift but authors still maintain both | **Required:** derive totals from visible lessons. |
| Lesson path repeats course path | Two authorities for one relationship | **Required:** derive effective path from the course; retain a compatibility assertion while old records still contain path. |
| Repeated aggregation in home, start, paths index/detail, course/project/channel cards | Changes must be repeated across consumers | **Required:** provide shared curriculum summary queries. |
| Article readingTime, runtime 200-wpm fallback, and lesson estimates differ | Cards can omit time while article pages calculate it; reading and exercise time are conflated | **Required:** central reading-time policy; distinguish lesson effort estimates from reading time. |
| Lesson title, description, difficulty, project and prerequisites can differ from article/course | Some differences are intentional instructional metadata | **Recommended:** document override/inheritance rules rather than delete all repeated fields. |
| Ten physician-developer-stack MDX posts author SeriesNav arrays and series metadata | A second sequencing system sits outside the learning graph | **Recommended:** add an adapter/validation for existing series without editing narrative bodies or changing links. |
| Homepage uses a separate three-item external project array | Working examples and curriculum projects have different owners | **Recommended:** model featured external examples explicitly; do not force them into fictional course outcomes. |
| Newsletter track labels/resources repeat the path concept | `newsletterTrack` is not passed into the form | **Required:** use one track mapping and pass path context. |

Visibility checks do not fully enforce that a published lesson's course, path, and article are also public. Project-related lessons sort by lessonNumber across courses, which is not a meaningful cross-course sequence. **Required:** validate public relationship closure; **Recommended:** group project preparation by path/course order.

`getLearningContextForArticle` selects the first matching lesson; search uses a map that would keep the last. The duplicate-assignment validator currently prevents this ambiguity. **Required:** retain that invariant unless a separately designed multi-course model replaces it.

## Routes and URL preservation

| Public pattern | Source / behavior |
| --- | --- |
| `/` | Academy-oriented homepage with two hero actions, paths, examples, journal cards, newsletter |
| `/start/` | Orientation and path comparison |
| `/paths/`, `/paths/[id]/` | Published paths and course sequences |
| `/courses/`, `/courses/[id]/` | Published courses and syllabi |
| `/projects/`, `/projects/[id]/` | All project lifecycle states |
| `/channels/`, `/channels/[id]/` | Published curated topics |
| `/blog/` | Article archive and client filtering |
| `/blog/[...slug]/` | Published collection articles rendered through PostLayout |
| `/blog/docling-rag-tutorial/` | Hand-authored public article outside the collection |
| `/blog/internal-mfm-scoring-optimization-engine/` | Special encrypted article, noindex |
| `/tags/[tag]/` | 480 generated tag pages; normalized by `src/utils/tags.ts` |
| `/about/`, `/contact/`, `/chukwuma-onyeije/`, `/verified/` | Identity and newsletter surfaces |
| `/rss.xml`, `/search-index.json`, `/og/[...slug].png` | Static generated endpoints |
| `/slides/fhir-playbook.html`, `/slides/limits-of-viability.html` | Standalone public HTML documents |
| `/audio/*`, `/images/*`, `/downloads/*`, `/fonts/*`, discovery/verification files | Public assets copied as-is |

There are no separate `/lessons/` routes. Learn/Build/Journal can be navigation labels without renaming destinations. `/channels/` can remain the URL for a “Topics” label.

`vercel.json` preserves legacy feed/sitemap, category/tag/author, About/contact, pagination, and one infographic redirect. Existing canonicals mix slash and non-slash forms. **Required:** preserve each existing canonical during migration and test actual generated/hosted behavior before any normalization. Preserve assets and redirects, not only HTML routes. Do not reset `baseline/protected-routes.json` to conceal regressions.

The baseline does not yet protect the 102 newer pages explicitly, inspect canonical values or content hashes, validate fragments, verify media sources, or test redirects as deployed. **Required:** extend protection with a reviewable additive manifest and article/body/canonical/media checks. Existing known broken links remain debt, not successful destinations.

## CSS, themes, and reusable components

Evidence: `src/styles/global.css`, scoped component/page styles, PostLayout, BaseLayout.

The active palette is dark-only: navy `#0a0d1a`, card `#0f1219`, border `#1a1f2e`, white `#f8fafc`, muted `#94a3b8`, cyan `#38bdf8`, blue `#1a6fc4`, purple `#a855f7`. These differ from AGENTS.md. Semantic typography/spacing beginnings already exist: fluid body/control sizes, page and section spacing, 70ch prose measure, shared page shells/buttons/inputs, focus rings, and reduced-motion handling.

Syne and DM Sans are locally bundled in six weight/style imports. Mono uses system fonts, not a loaded JetBrains Mono. Literal dark colors, gradients, and RGBA values remain in Header, NewsletterForm, carousel, special pages, and content HTML. `SeriesNav` references an undefined `--dwc-text` token. The active footer is implemented inside BaseLayout.

There is no theme control, persisted theme choice, `prefers-color-scheme` handling, pre-paint theme script, or client router. `theme-color` is fixed. **Required:** semantic color/spacing/radius tokens, system-default light/dark choice, storage-safe persistence, pre-paint application, system-change handling, themed controls and code blocks. Keep legacy token aliases while migrating consumers. Only implement `astro:after-swap` restoration if client navigation is actually introduced.

The current 70ch measure already meets the PRD's approximate target. **Recommended:** verify typography at mobile widths before changing fonts. **Required for the PRD implementation:** evaluate the built-in Fonts API on the selected Astro version; existing Fontsource delivery already meets the self-hosting objective, so replace it only with verified parity. A change to Inter/Geist specifically is **optional**. See [Astro fonts documentation](https://docs.astro.build/en/guides/fonts/).

Reusable components already present:

- Shell/provenance: Header, AuthorBio, Breadcrumbs, FormattedDate, NewsletterForm.
- Cards: LearningPathCard, CourseCard, ProjectCard, ChannelCard, PostCard.
- Learning: LessonContext, LessonNavigator, LearningOutcomeList, ProjectCallout, SeriesNav.
- Reading: ArticleToc, Callout, FAQ, AudioPlayer, ScreenshotCarousel, ProtectedContent.

**Recommended:** extend these by responsibility rather than rename every component to match the PRD list. `BlogPost.astro`, BaseHead, Footer, and HeaderLink appear to be unused starter remnants based on production import searches. The old layout expects `heroImage`, uses obsolete CSS variables, and BaseHead preloads Atkinson fonts. Remove this chain only after import/type verification. **Required:** add focused theme and progress controls; **recommended:** extract the active footer when shell work begins. A large universal component abstraction is unnecessary.

## Client JavaScript and search

| Surface | Current behavior |
| --- | --- |
| Header | Inline enhancement; aria-expanded, Escape and breakpoint handling; navigation remains exposed without JS |
| Archive | On-interaction JSON fetch, substring matching, facets, query-string restoration, announced counts, failure fallback |
| Audio | Custom play/pause/seek controls; metadata preload; no autoplay |
| Sharing | Clipboard copy with status/error handling |
| Newsletter | Direct Beehiiv POST, track resources, hosted fallback redirect |
| Protected article | Web Crypto decryption, sessionStorage password, blob slideshow and fullscreen controls |
| Carousel | One React `client:load` island in inbox-detox article |
| Analytics | Deferred `/_vercel/insights/script.js` in BaseLayout |

No local curriculum progress exists. “Course Progress” currently means position in an ordered list. The final lesson is labeled “Course complete” regardless of completion history. Three courses have no project reference, but LessonNavigator still links to their missing `#course-project` section. **Required:** make the final destination conditional and distinguish position from earned completion before adding progress.

Search is more developed than the PRD's “simple retrieval” description suggests. `src/utils/search.ts` generates curriculum-aware records with category, topics, format, path, course, difficulty, publication date, keywords, and URL. The UI filters path, format, difficulty, topic, and recency. It does not expose course/tag filters, index article bodies, rank relevance, or distinguish lesson/journal/guide as a separate content-type facet. Topic and format classification use keyword heuristics. Special Astro articles are omitted from the collection index.

All 208 article cards are rendered upfront. The archive HTML is 334,258 bytes and the JSON index 155,678 bytes uncompressed in this build. These are file sizes, not network transfer or CWV measurements. The fetch promise remains rejected after an initial failure, so subsequent searches cannot retry without reload. There is no explicit submit interception; submit behavior merits browser testing.

**Required:** full-text, curriculum-aware accessible discovery, course/tag/content-type metadata, robust keyboard/loading/error states, and preserved `/blog/?q=...` entry points. **Recommended implementation:** Pagefind with article-body boundaries and filter attributes, indexed after static generation. Exclude protected content and navigation boilerplate; include the public Docling article. [Pagefind filter documentation](https://pagefind.app/docs/filtering/) supports the proposed static indexing approach. The PRD recommends Pagefind; the underlying search outcome is required. No React search app is needed.

## Images and performance

The active article/card components render string URLs in raw img tags. PostLayout sets eager/async/high-priority hints on the hero, but no intrinsic dimensions or responsive sources. PostCard images have neither loading hints nor intrinsic dimensions; CSS sizing does not reduce downloaded bytes. AuthorBio has a lazy portrait. The sole `astro:assets` Image import is in the unused legacy layout.

Large public source examples: `hero_icu_to_marathon.jpg` 7,968,234 bytes; `pgis-breathe-blog-hero.jpg` 7,442,725 bytes; several other heroes exceed 3 MB. **Required:** introduce Astro-native responsive derivatives for controlled images, reserve dimensions, and lazy-load below-fold media while retaining original public asset URLs. Do not rewrite all article image links or delete originals. Hero loading priority should remain conditional on placement.

Other performance risks:

- All archive cards and eager card images increase initial work. **Recommended:** limit interactive results and lazy media while retaining a crawlable, no-JS archive; any pagination must preserve `/blog/` and article URLs.
- React's emitted client file is 185,761 bytes, with supporting files of 7,614 and 2,580 bytes. These are build assets for the existing island, not evidence that every page downloads React. **Optional:** native carousel replacement after measuring that article.
- OG generation reads fonts and rasterizes every article on each build. **Recommended:** cache font reads or optimize only if build profiling shows a need; preserve generated OG URLs.
- The Docling special route still requests Google Fonts. Public slide HTML has its own presentation environment. **Required:** include special pages in font/performance review; **recommended:** phase any slide-specific work separately.
- Vercel analytics availability depends on hosting configuration. **Recommended:** check actual requests before changing or removing it.

No LCP, INP, CLS, compressed transfer, or mobile CPU result is claimed here. **Required:** measure representative mobile pages against the PRD targets of LCP <=2.5s, INP <=200ms, CLS <=0.1, and retain evidence distinguishing lab results from field percentiles.

## SEO, RSS, sitemap, and identity

BaseLayout provides titles, descriptions, canonical, author, robots, Open Graph, Twitter cards, RSS discovery, and WebSite/Organization/Person/WebPage JSON-LD. PostLayout adds BlogPosting and learning metadata. Course pages provide Course and ItemList; breadcrumb markup and educational context already exist. Identity pages have dedicated schema and validators. Per-article social images use Satori and Sharp. `robots.txt`, `llms.txt`, and `ai.txt` exist.

Concrete gaps:

- RSS calls `getCollection('blog')` without filtering drafts, and uses featuredRank-first sorting. No top-level drafts currently leak, but a future draft would. **Required:** public-only feed; **recommended:** chronological RSS/latest journal sorting separate from editorial ranking.
- Sitemap has no filter and the generated sitemap includes the noindex internal MFM route. **Required:** exclude intentionally non-indexable pages while retaining their protected URLs.
- Collection-driven search/RSS omit the separate public Docling article. **Required:** an explicit public-document policy and discovery adapter without moving its URL or rewriting its body.
- Docling's publisher logo points to `/og-default.jpg`, unlike the normal `/images/og-default.jpg`. **Required:** verify and repair generated metadata asset references.
- AI discovery copy is still blog-focused and omits the new learning entry points. **Recommended:** update discovery summaries after graph normalization. `ai.txt` says training is restricted while named crawler rules permit access; **recommended:** document the intended policy without claiming that a text file enforces licensing.
- About and official-profile JSON-LD repeat identity data with different Person IDs. **Recommended:** converge shared identity generation while preserving canonical page identities.

**Required:** maintain canonical, OG, RSS and sitemap snapshots during the upgrade; validate metadata on special pages as well as PostLayout articles. Preserve current author identity and audio links.

## Accessibility and interaction risks

Existing positives: semantic main and skip link, global focus treatment, mobile navigation with no-JS fallback, native details for mobile TOC/FAQ, descriptive search labels, live result counts, keyboard audio seeking, reduced-motion CSS, and substantial 44px controls.

| Risk from source | Assessment and proposed response |
| --- | --- |
| Carousel dots are 8px high with small spacing; inactive images are merely opacity-hidden | **Required:** target-size/spacing validation, larger hit areas, active-slide semantics, and remove hidden slides from the accessibility tree. |
| Audio play promise is not handled; state changes before playback succeeds | **Required:** handle failure and synchronize UI with real media events; offer a usable fallback when scripting fails. |
| Global focus selector omits summary | Native focus may remain, so failure is not proven. **Required:** test and provide consistent visible focus for disclosures. |
| Sticky header, TOC and proposed learning bar | **Required:** keyboard/zoom checks for obscured focus; restrict tall rails to a usable viewport. |
| PostCard always emits h3, including archive contexts | **Required:** audit heading outlines and support a contextual heading level. |
| Gradient text, blue hover, literal content colors | **Required:** numeric contrast checks in both themes, including focus/hover/code and disabled states. Prior dark-palette checks are not full-page certification. |
| Newsletter uses novalidate and only presence checks; no form action fallback | **Required:** accessible email validation and a no-JS hosted signup path; test error announcement and focus. Do not submit real subscriptions during QA. |
| Protected-content status is not a live region; storage access can throw | **Recommended:** status/focus and storage-failure handling without broadening access. |
| Code lacks copy actions and headings lack visible permalink controls | **Required:** add progressive enhancements without changing article prose or existing heading IDs. |

The article body's external links do not have a consistent distinct visual treatment. **Required:** accessible external-link presentation that does not rely on color alone. References, exercises, and clinical cautions can reuse existing structures; do not invent instructional conclusions for historical articles.

## Security and operational boundary

The internal MFM route encrypts content at build time using an environment password, but falls back to a known literal when that variable is absent. The plaintext source is also in the repository. **Required:** fail closed for missing configuration and keep protected payloads out of search/discovery; do not represent client-side encryption or noindex as authorization for patient data. This is a concrete code finding, not a claim that production lacks the environment variable. No password or production access was tested.

**Recommended:** assess Astro CSP with the actual inline scripts, JSON-LD, Beehiiv requests, analytics, and blob slideshow before enabling enforcement. Keep secrets out of generated pages and logging. No accounts, database, CMS replacement, hosting move, or new global client framework is justified by this audit.

Maintenance scripts include frontmatter/tag migration, audio generation, IndexNow submission, and validators. Mutation/publication scripts were inspected as workflow context but not executed. Existing audio generation commits MP3s and frontmatter together through GitHub Actions; preserve that contract.

## Priority handoff

The implementation plan maps these findings into reviewable changes. Start by strengthening preservation and validation, then perform the isolated Astro upgrade, then normalize curriculum calculations. Theme, shell, learning UX, article refinements, and search follow stable shared contracts. The current site remains the baseline throughout.
