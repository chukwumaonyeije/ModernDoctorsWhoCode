# Doctors Who Code 2027 Implementation Plan

Date: September 15, 2026. Basis: `PRD-DWC-2027.md` and `CURRENT-STATE-AUDIT.md`.

## Delivery rules

Build on the existing Astro platform. Preserve article bodies, `/blog/` article URLs, current canonical values, tag routes, learning routes, public downloads/audio/images/slides, special article routes, and redirects. Do not duplicate articles into lesson pages. Keep all existing audioUrl values unless regeneration is explicitly part of a separate task.

Priority labels apply to every proposed change:

- **Required:** explicit PRD outcome, preservation guarantee, or concrete functional/exposure correction.
- **Recommended:** preferred implementation or maintainability improvement.
- **Optional:** elective work, excluded from the minimum release.

Use one small pull request per numbered task below. Each PR describes the trigger, changed behavior, evidence, and rollback. Do not bundle the framework upgrade, schema changes, and visual redesign. Ordinary checks must never regenerate the protected-route baseline automatically.

Current verified baseline: Astro 6.0.5; 208 collection articles; 3 paths; 8 courses; 38 lessons; 4 projects; 7 channels; 725 built HTML files; 623 protected pages; 26 known link failures. Existing `npm run check` passes. No implementation is authorized by the creation of this plan alone; this audit changed documentation only.

## Current browser follow-up

Checkpoint update, September 16: the site owner subsequently reported the representative manual accessibility checklist passed and authorized review, commit and production push. See [Checkpoint review](CHECKPOINT-2026-09-16.md). Retain Fontsource and proceed to navigation regrouping as the next separate change after deployment verification. Earlier dated notes below preserve their historical gate status; they do not override this user acceptance.

September 16 continuation: current-source preservation passes; the Astro Fonts evaluation is complete with a decision to retain Fontsource because generated fallbacks regress delayed-font stability in five of six sampled views. See [Font evaluation](FONT-EVALUATION.md). A short-viewport keyboard test reproduced offscreen menu focus; the bounded header scrolling/focus correction and additional text-reflow checks are documented in [Browser verification](BROWSER-VERIFICATION.md). Actual screen-reader/browser-zoom acceptance remains open because the native browser launch timed out waiting for app approval. Phase 2 navigation regrouping has not started: its Phase 1D acceptance gate remains open. Everything remains local and uncommitted.

The authorized browser pass adds repeatable Playwright and axe checks plus bounded fixes for narrow layouts, code contrast, prose-link recognition, carousel target size and Docling keyboard scrolling. See [Browser verification](BROWSER-VERIFICATION.md). Required manual screen-reader/zoom acceptance, Astro Fonts evaluation, publication/security corrections and performance evidence remain separate tasks. No deployment or commit was performed.

## Architectural decisions to retain

Step 1 delivery update (September 15, 2026): preservation manifests, reference checks, guardrail fixture tests, the graph prebuild gate, PR/main CI, and current architecture/content/design documentation are implemented. See [Preservation checks](PRESERVATION-CHECKS.md) for commands and limitations. General application lint/type checking remains a separate tooling task; the publication/security/navigation corrections in 0.2 and the Astro upgrade have not been performed.

Step 2 delivery update (September 15, 2026): the local installation is upgraded to Astro 7.3.2 with compatible integrations and Tailwind 4.3.3. A clean lockfile installation and the complete `npm run check` pass. Exact text and whitespace match for 252 code blocks across 45 pages. See [Astro 7 upgrade](ASTRO-7-UPGRADE.md) for the narrowly corrected code-hashing baseline and evidence. Browser automation timed out, so live carousel/visual checks remain a required review gate before merge. No deployment, content rewrite, graph refactor or redesign occurred. General lint/type checking and task 0.2 remain open.

| Decision | Priority | Reason |
| --- | --- | --- |
| Retain the `blog` collection and current field names behind adapters | Required | Avoid content and URL migration; PRD sections 17-18 suggest names rather than require a rename. |
| Keep lesson records as article references | Required | Existing design already separates curriculum from the knowledge base. |
| Use course ownership for path and lesson ordering for sequence | Required | One effective relationship authority; transitional fields can be validated. |
| Derive course/path totals from visible lessons | Required | Remove authored total duplication and align all surfaces. |
| Keep full page navigation by default | Recommended | No current ClientRouter; ordinary Astro pages need no lifecycle framework. |
| Use native details, buttons, forms and small TypeScript modules | Required | Static-first behavior; no new React/client framework without a demonstrated need. |
| Preserve `/channels/` while optionally labeling it Topics | Recommended | Improve IA without route churn. |
| Preserve working Fontsource delivery during upgrade | Required | Avoid coupling a framework change to font/layout regressions. |
| Rename components/collections merely to match PRD examples | Optional, defer | No product benefit by itself. |

## Phase 0 completion and Phase 1A: preservation gates

PRD mapping: 7, 25, 30-35. Depends on this audit. Single owner; no parallel implementation yet.

**0.1 Required: strengthen the existing checks before changing the product.** Add an additive manifest for currently unprotected public routes, preserve all 623 existing baseline entries, and record article IDs, body hashes, canonical values, publication dates, audio/image references, redirects, and special/public HTML endpoints. Protect `/search-index.json` while it has consumers. Add internal fragment and media-target checks. Keep the 26 known failures visible with explicit ownership; do not silently accept new debt.

Acceptance: the current site builds; the new checks report existing debt accurately; fixture changes to an article body, canonical, protected URL, or referenced asset fail the relevant check. A deliberately broken curriculum reference fails the required build pipeline. Regenerating a baseline requires an explicit reviewed change, not a routine command.

**0.2 Required: close publication and navigation defects in a separate corrective PR.** Apply one public-content predicate to RSS/search/article enumeration; exclude the noindex internal route from sitemap; make final-lesson destinations conditional on a real project; fail closed when the internal password configuration is missing. Preserve route availability with a safe locked state if necessary. Add the public Docling article to the public-document policy without relocating it. Validate its metadata asset paths.

Acceptance: a draft fixture never appears in feeds/search/public curriculum; no projectless course links to a nonexistent project fragment; protected material is never indexed; missing secret cannot select a known fallback password. These tests must not publish content or call external signup/audio services.

**0.3 Required: make checks repeatable in CI.** Run `npm ci`, production build and validators on PRs. Add an appropriate type-check/lint configuration and focused unit/browser tests where they protect behavior. Define `test`/`lint` commands or document their explicit equivalents; do not add empty scripts to satisfy the PRD. Scope type checking to application files, not temporary deployment copies. Retain the existing narration workflow.

**0.4 Recommended: reconcile repository guidance.** Update AGENTS.md and create `docs/ARCHITECTURE.md`, `docs/CONTENT-MODEL.md`, and `docs/DESIGN-SYSTEM.md` as required by PRD 31; the document creation is **required**, while reorganizing historical stage notes is **recommended**. Record the actual stack, protected interfaces, command meanings and token policy. Resolve the old dark-only instruction in favor of the PRD's system-default theme target before theme implementation.

Exit gate: a reproducible baseline, explicit existing debt, preservation fixtures, and a production pipeline that cannot skip relationship validation.

## Phase 1B: isolated Astro upgrade

PRD mapping: 14, 16, 21, 30, 34. Depends on Phase 1A. Single owner of package manifests, lockfile, Astro configuration and CI.

**1.1 Required: upgrade Astro 6 to a verified compatible Astro 7.x release and integrations.** Use the [official migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/), record exact versions and Node requirements, and review the actual lockfile diff. Do not rely on the PRD's dated latest-version claim. Keep output static and hosting unchanged.

Acceptance: routes, canonicals, IDs, RSS items, headings, article text, MDX imports and code examples remain equivalent. Compare generated output on mixed Markdown/HTML, Unicode slug, FAQ, SeriesNav, carousel, protected content and special article fixtures. The compiler/Markdown/whitespace changes require more than a successful build. Run the full preservation pipeline.

**1.2 Recommended: dependency and dead-code review.** Establish advisory evidence; remove the unused legacy BlogPost/BaseHead/Footer/HeaderLink chain only after import and type validation. Keep Satori/Sharp and the React carousel dependencies while they have consumers. **Optional:** native carousel replacement and React removal belong in a later independent PR.

Rollback: revert package/configuration changes together. Do not use content rewrites or URL redirects to make the upgrade pass.

## Phase 1C: curriculum data contract

Step 3 delivery update (September 15, 2026): tasks 2.1 and 2.2 are implemented locally, along with the bounded final-lesson navigation correction. Shared queries now serve all curriculum consumers and search; authored course totals are removed; article reading estimates are shared; stable ID rules are documented. Seventeen tests and the full build/preservation pipeline pass. All eight course and three path totals were checked against rendered output. Three nonexistent project-fragment destinations are resolved, leaving 49 recorded reference issues. Article/public-asset manifests and the original route baseline were not changed. Recommended secondary metadata normalization in 2.3 remains deferred, as do the broader publication/security corrections and the upgrade's browser review gate.

PRD mapping: 10, 17-18, 20, 29, 34. This brings the existing content-model work forward from PRD Phase 3 so later UI is built on reliable data. Depends on the upgrade gate.

**2.1 Required: centralize summaries and duration semantics.** Add typed queries for course/path summaries, article learning context and reading time. Compute total minutes and lesson counts from published visible lesson records. Preserve manual lesson effort estimates as intentional overrides, and keep reading time distinct. Replace duplicated aggregations in home/start/path/course/project/channel consumers without visual redesign.

Acceptance: all eight course summaries and three path totals match one source; cards and articles agree on reading time; hidden lessons do not inflate public counts. Existing article frontmatter and bodies are byte-preserved.

**2.2 Required: tighten graph validation and identity rules.** Validate published relationships, course/path agreement, contiguous public ordering, project references and unique article membership. Derive lesson path from course; transitional path fields can remain with assertions. Document stable lesson IDs for progress storage and a policy for retired records.

Acceptance: fixtures for invalid IDs, duplicate order, unpublished parents, empty published sequences and mismatched paths fail. Current valid graph remains valid. Do not invent new course outcomes or require every journal article to become a lesson.

**2.3 Recommended: normalize secondary metadata.** Adapt existing SeriesNav arrays/series metadata to validation without rewriting prose; centralize newsletter track mapping; model homepage external examples separately from curriculum project briefs; group project prerequisite lessons by course. **Optional:** explicit editorial contentType overrides where heuristics are ambiguous. The search view still needs a derived lesson/journal distinction even without those overrides.

Exit gate: a documented graph/query API and stable IDs. No consumer maintains authored aggregate totals. Shared schema and query changes are complete before parallel feature work begins.

## Phase 1D: tokens, theme and typography

Theme foundation delivery update (September 15, 2026): semantic light/dark palettes, compatibility aliases, the system/light/dark select, head initialization, storage/OS synchronization, shared-surface conversions and summary focus styling are implemented locally. Five theme fixtures cover preference behavior and base-palette contrast. Article bodies and original assets remain unchanged. See [Design system](DESIGN-SYSTEM.md). Browser attachment timed out; visual/keyboard/first-paint acceptance and the Astro Fonts evaluation remain required. This is progress on 3.1-3.3, not completion of the full phase or authorization to deploy.

PRD mapping: 12-15, 22-24, 27-29. Depends on stable framework and preservation checks. One owner for global CSS, BaseLayout, and theme module.

**3.1 Required: add semantic tokens with compatibility aliases.** Define background/surface/text/muted/border/accent/code/success/warning, spacing and radius values for light/dark. Map existing `--dwc-*` uses to them while converting hardcoded component colors incrementally. Fix undefined token references. Keep the established prose measure.

**3.2 Required: implement system/light/dark mode.** Add a small pre-paint script and accessible three-state control. Default to system; handle invalid or inaccessible storage, operating-system changes and explicit preferences. Update color-scheme and theme-color. No global React state. Add after-swap restoration only if an optional router is later introduced.

Acceptance: no wrong-theme flash in normal navigation; system changes apply only in system mode; storage failure does not break the page; keyboard and screen-reader names/states are clear. Check every shared control, Shiki code palette, carousel, newsletter, hero, callout and special article in both themes. Preserve unmodified article prose even when it contains embedded HTML.

**3.3 Required: validate local typography delivery and focus/contrast foundations.** Evaluate and implement the PRD's Astro Fonts API on the verified target version with equivalent local delivery, fallback metrics and limited weights. If a compatibility issue prevents parity, document it explicitly and retain working local fonts until resolved. **Optional:** adopt Inter/Geist or load JetBrains Mono rather than retain the current brand fonts/system mono.

Acceptance: font/image layout stability, numeric contrast, visible focus including summary, reduced motion, text zoom and narrow viewport checks pass. No runtime third-party font dependency is introduced. The Docling font exception is covered explicitly.

## Phase 2: navigation and shell

PRD mapping: 8, 23, 26-29. Depends on Phase 1D. Single shell owner.

**4.1 Required: group navigation into Learn, Build, Journal and About, with Search/Subscribe/Theme utilities.** Reuse Header's current progressive enhancement and no-JS links. Existing route destinations remain unchanged. Avoid placeholder Tools/Resources links: **recommended** reuse valid project/download destinations; a new resource index is **optional**.

Prepared September 16 for the next bounded shell change: Learn should expose the existing Start Here (`/start/`), Learning Paths (`/paths/`) and Courses (`/courses/`) links through a native disclosure. Build targets `/projects/`, Journal targets `/blog/`, and About targets `/about/`. The brand remains the home link; Search keeps `/blog/#post-search`, Subscribe keeps `/contact/`, and Theme keeps its current native select. Preserve keyboard disclosure behavior and no-JS access; distinguish an active section from `aria-current="page"` on an exact destination. This is a route mapping proposal, not an implemented navigation change. Complete the open Phase 1D acceptance work before applying it.

**4.2 Required: verify compact mobile navigation and responsive containers.** Menus expose state, close with Escape, preserve sensible focus and remain usable with scripting disabled. Test at 320/375/768/1280px, zoom, touch and keyboard. Extend existing Breadcrumbs; **recommended** extract the active footer from BaseLayout to give it one owner.

Exit gate: global token, theme, navigation, footer and component interfaces are settled. Only after this gate may independent feature work run in parallel, consistent with PRD 33.

## Phase 3: learning experience

PRD mapping: 9-12, 20, 27-29. Depends on graph, theme and shell contracts.

**5.1 Required: extend path/course views using existing cards and queries.** Present course purpose, prerequisites, difficulty, counts, duration, outcome and project destination. Make existing “Build Afterward” destinations actual project links. Preserve partial courses such as The Middle Path honestly; future planned parts are not completed lessons.

**5.2 Required: persistent lesson context.** Extend LessonContext/LessonNavigator with desktop course context and a native mobile curriculum disclosure. Keep previous/next links as real anchors to current article URLs. Coordinate course sidebar and TOC widths; maintain 65-75ch reading measure. Final actions must handle courses without projects.

**5.3 Required: optional-to-use local progress.** Implement a small versioned `dwc-progress` store containing stable completed lesson IDs, current lesson and lastVisited. Validate reads, tolerate malformed JSON/storage errors, ignore stale IDs, allow undo/reset and separate visiting from completing. No account, server persistence or clinical data. Add Mark Complete and Continue plus course/path indicators.

Acceptance: refresh and navigation preserve voluntary completion; failures fall back to normal links; completing the last lesson offers the real next destination; counts are derived from valid current lessons. Test corrupt storage, denied storage, retired lessons, partial courses, reset, no-JS and keyboard states. Never label a course complete merely because its last lesson is open.

**5.4 Recommended:** define a small storage-change event contract for other UI and cross-tab updates. **Optional:** a mobile bottom lesson bar, only if it adds value and passes obscured-focus/zoom checks.

## Phase 4: article experience and media

PRD mapping: 11-12, 14, 21-24, 27-29. Can run alongside Phase 3 after the shared shell gate, with explicit PostLayout ownership.

**6.1 Required: enhance existing reading components.** Keep ArticleToc and native mobile details; add heading permalink controls and accessible code copy/error feedback while preserving existing heading IDs. Distinguish external links; validate callout and reference rendering. Reuse learning objectives for lesson summaries where appropriate, without generating new claims in old articles.

**6.2 Required: introduce a controlled-image adapter.** Use Astro Image/Picture or build-time transformations for local controlled images with dimensions, responsive sources, useful existing alt text, conditional hero priority and lazy secondary media. Keep original public files and their URLs. Separate template conversion from any later body-embedded media cleanup.

**6.3 Required: repair interaction edge states.** Handle rejected audio playback, truthful play state and fallback controls; fix carousel target/accessibility behavior; provide newsletter email validation and hosted no-JS fallback. Pass contextual path/track copy into the newsletter without increasing interruptions. Reconcile missing narration through the existing approved workflow, keeping MP3/frontmatter changes together in a separate PR.

Acceptance: special Docling/internal pages, code-heavy articles, tables, long titles, FAQ, inline components and audio all retain content and canonical parity. No real newsletter submission occurs during testing. **Recommended:** reduce repeated article chrome where user testing supports it. **Optional:** native carousel replacement to remove the React runtime.

## Phase 5: search

PRD mapping: 18-19, 23-25, 27, 29. Can run alongside Phases 3-4 after graph/theme/shell gates.

**7.1 Required outcome; recommended implementation: Pagefind.** Add post-build static indexing with explicit body, metadata and filter attributes for path/course/topic/difficulty/content type/tag. Exclude protected, noindex and draft material; suppress duplicate navigation/TOC/sidebar text. Index the special public article explicitly. Use the [Pagefind documented filter model](https://pagefind.app/docs/filtering/).

**7.2 Required: accessible discovery UI at the existing entry points.** Preserve `/blog/`, `?q=` and existing facet links or map them compatibly. Keep no-JS browsing. Load search code/index on demand, show curriculum labels and useful snippets, and handle loading, empty, retry/error and keyboard states. No client framework is required.

Acceptance: body-only term queries find the intended article; course/tag filters work; old bookmarked searches still resolve; private/draft content cannot appear; source-only drafts are not indexed. Use representative clinical/software queries with expected matches rather than only checking an index file exists.

**Recommended:** reduce initial archive media/DOM cost while keeping crawlable access to the full archive. **Optional:** a dedicated `/search/` route or dialog; neither justifies breaking `/blog/?q=`. Do not remove `/search-index.json` until all consumers and compatibility expectations are checked.

## Phase 6: homepage and newsletter integration

PRD mapping: 1-6, 9-10, 26, 35, 37-39. Depends on learning progress and stable discovery.

**8.1 Required: refine the existing academy homepage.** Retain its central hero concept, one dominant path action and a journal action. Show Continue Learning only when valid local state exists; otherwise show the three paths. Derive the next lesson and duration from shared graph/progress contracts. Reserve layout space and avoid empty personalized placeholders.

**8.2 Required: connect projects and contextual subscription to real learning outcomes.** Use the shared track mapping and existing downloadable resources. No aggressive popups. **Recommended:** use chronological sorting for the “Latest” journal section and reserve featuredRank for intentionally curated sections.

Acceptance: a first-time visitor can choose a path and reach a first lesson; a returning reader resumes a valid next lesson; clearing/denying storage restores the normal homepage. Every displayed metric and project link is derived or explicitly curated. No homepage promise points at an unfinished feature.

## Phase 7: release quality and operations

PRD mapping: 22-25, 30-36. Integration gate after all required feature phases.

**9.1 Required: integrated preservation and functional validation.** Build, graph/identity/article/route checks, type checks, lint and meaningful tests must pass. Compare article-body hashes, counts, Unicode paths, canonicals, feeds, redirects, audio/images/downloads and the two standalone slides. No new known-link exclusions. Correct existing link debt through reviewed presentation/link fixes or compatible aliases, without rewriting historical arguments.

**9.2 Required: accessibility and mobile acceptance.** Run automated accessibility checks plus manual keyboard, screen reader, focus visibility, target spacing, contrast, zoom, no-JS and reduced-motion reviews across home/start/path/course/lesson/journal/search/project/channel/contact and special articles. Automated markup checks alone do not establish WCAG 2.2 AA.

**9.3 Required: mobile performance evidence.** Record Lighthouse/lab waterfall, HTML/JS/font/image sizes and layout shifts on representative templates. Use field data for the PRD's 75th-percentile LCP/INP/CLS claims when available; lab tests cannot prove field INP. Set per-template budgets from the measured baseline, investigate regressions, and retain results with release notes.

**9.4 Recommended: CSP and dependency review.** Test a policy against inline scripts, JSON-LD, newsletter endpoints, analytics, media and blob slides before enforcing it. Review advisories and remove dependencies only with verified unused status. Update AI discovery and architecture documentation to reflect the final platform.

**9.5 Recommended: define success-event semantics** for path starts, next-lesson navigation, project clicks, successful searches and track conversion. **Optional:** deploy additional analytics after a privacy/consent decision. Local completion remains local by default; do not transmit browser progress simply to satisfy reporting. Compare behavior with the pre-release baseline when measurement exists.

Rollback: each feature PR can be reverted independently. Storage readers must tolerate unknown versions. Restore search assets and consumers together; preserve public routes and originals through media rollbacks. Deployment/merge is a later explicit action, outside this audit.

## Safe parallel work

No parallel agents were used for this audit. PRD 33 permits parallel agents only after the architectural foundation and shell are established. Parallelism is safe only when ownership and contracts are frozen.

| Workstream after Phase 2 | Owns | Can run beside | Must not edit independently |
| --- | --- | --- | --- |
| Learning | Path/course views, lesson context/navigation, progress module | Search and article/media work | Global tokens, schema/query contracts, Header, package files |
| Search | Search module/UI, index integration, search tests | Learning and media | Article prose, route identities, shared graph schema |
| Article/media | Reading controls, image adapter, audio/carousel fixes | Search and learning | Progress API, global theme or curriculum data |
| Accessibility verification | Read-only cross-feature audits and assigned test fixtures | All three | Shared implementation files without coordination |

One integrator owns PostLayout and BaseLayout wiring, package/lockfile changes, Astro configuration, Header, global CSS, and CI. Search/body annotations, course/sidebar slots and image changes all touch PostLayout; agree on named insertion points and merge those changes serially. Workers can build modules/tests independently, but their integration is not conflict-free by default.

Dependency order:

```text
Audit -> preservation gates -> Astro upgrade -> graph contract
      -> tokens/theme -> shell
      -> [learning | article/media | search | accessibility verification]
      -> homepage integration -> release quality
```

Do not assign four independent redesigns of the shell. Use isolated branches/worktrees for later parallel implementation and require the full integrated checks after merging, not just per-branch success.

## Deferred scope

Accounts, databases for progress, payments, gamification, CMS/hosting migrations, content rewrites and article URL moves are outside the PRD's initial scope. View transitions, a mobile bottom bar, alternate font families, native carousel replacement, a dedicated search route and extra analytics remain **optional**. The site must satisfy required outcomes without them.

## First three implementation tasks

1. **Required: extend preservation and CI gates.** Protect all current routes, article bodies/canonicals/media and fragment targets; preserve the existing baseline and expose its known debt. Document the current architecture and commands.
2. **Required: perform the isolated Astro 7 upgrade.** Select exact compatible versions, preserve static output, and validate rendered MDX, routes and metadata before touching design.
3. **Required: centralize the curriculum graph and computed metadata.** Derive public course/path totals and consistent reading times, enforce public-reference validity, and define stable lesson IDs for progress. Fix final-lesson destinations for projectless courses as a bounded companion correction.

The publication/security corrections in task 0.2 are an early corrective lane and should not wait for a visual redesign. Theme and shell implementation follow these first architectural tasks.
