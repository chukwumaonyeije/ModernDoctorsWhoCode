PRD-DWC-2027.md
# Doctors Who Code 2027

## Product Requirements Document

**Product:** DoctorsWhoCode.blog
**Project:** 2027 Learning Platform Redesign
**Framework:** Astro 7.x
**Primary audience:** Physicians learning software development, clinical AI, and physician-led software engineering
**Status:** Implementation Draft
**Primary implementation agent:** OpenAI Codex

---

# 1. Executive Summary

Doctors Who Code should evolve from a content-rich physician technology blog into a modern **physician-developer learning platform**.

The existing written content should remain substantially unchanged. The redesign concerns the system around that content: navigation, learning-path visibility, course progression, article presentation, search, responsive behavior, visual hierarchy, accessibility, performance, and discoverability.

The central product transformation is:

> **Articles remain the knowledge base. Learning paths become the primary interface.**

A visitor should no longer need to determine which of dozens of articles to read next. Doctors Who Code should answer three questions immediately:

1. Where should I begin?
2. What should I learn next?
3. What can I build when I finish?

The redesign should preserve the existing physician-developer identity while adopting the usability, performance, accessibility, and design expectations of a high-quality 2027 technical learning platform.

---

# 2. Product Vision

Doctors Who Code should feel like a cross between:

* a thoughtful technical publication,
* a lightweight developer academy,
* a practical project laboratory,
* and a physician-developer field guide.

It should **not** become a traditional LMS.

There should be no unnecessary dashboards, accounts, gamification, badges, streaks, or enterprise-learning complexity.

The experience should remain quiet, scholarly, technically sophisticated, fast, and focused on building useful things.

The governing principle is:

> **Learn → Apply → Build**

Articles become lessons when placed in sequence.

Lessons become courses when they create defined competence.

Courses become learning paths when they lead toward a meaningful physician-developer capability.

Projects demonstrate that capability.

---

# 3. Current Product Strengths

The current site already has the essential educational architecture:

* Start Here
* Learning Paths
* Courses
* Projects
* Articles
* Physician-built examples
* Newsletter onboarding
* RSS
* sitemap

The three current learning paths also represent sensible entry points:

### Path 1 — Learn to Code

For physicians who have not yet shipped software.

### Path 2 — Use AI in Medicine

For physicians moving from isolated prompting toward structured AI workflows.

### Path 3 — Build Medical Software

For physicians ready to turn clinical knowledge into tested applications.

These concepts should be preserved.

The redesign should improve **how users experience the structure**, not repeatedly reinvent the structure.

---

# 4. Product Problem

The current site has sophisticated ideas presented through a relatively conventional blog interface.

As the content library grows, several problems become increasingly important.

### Navigation debt

A reader can understand that learning paths exist without always understanding where they currently are within one.

### Content discovery debt

Chronological publishing and educational sequencing serve different purposes. Recent articles are not necessarily the right next lessons.

### Progress ambiguity

A reader cannot readily answer:

> “What have I already completed, and what should I read next?”

### Visual hierarchy

Courses, lessons, journal articles, projects, and learning paths need stronger visual differentiation.

### Mobile learning

Mobile readers should be able to navigate lessons, return to a course, search, and continue learning with minimal friction.

### Metadata duplication

Course counts, lesson counts, reading times, relationships, and other educational metadata should be computed centrally rather than manually reproduced across pages.

### Theme limitations

The site requires first-class light and dark modes, including system preference detection.

---

# 5. Primary Users

## User A — The Curious Physician

Has little programming experience.

Arrives through Google, LinkedIn, YouTube, or an individual article.

Needs a clear answer to:

> “Where do I start?”

The system should guide this reader toward Physician-Developer Foundations rather than expose the entire archive immediately.

---

## User B — The AI-Using Clinician

Already uses ChatGPT, Claude, Codex, or similar systems.

Understands prompting but does not yet think in terms of workflows, harnesses, evaluation, structured data, observability, and software architecture.

The system should move this reader toward the AI learning path.

---

## User C — The Physician-Developer

Already uses GitHub, coding agents, Astro, Python, JavaScript, APIs, or clinical software tools.

This user wants advanced material, working projects, architecture discussions, medical software implementation, and agentic development workflows.

The platform should allow this user to move directly into advanced courses without unnecessary beginner material.

---

# 6. Product Goals

The redesign succeeds when Doctors Who Code becomes easier to **learn from**, not merely nicer to look at.

Primary goals are:

1. Make learning paths the dominant navigation model.
2. Introduce excellent system/light/dark theme support.
3. Preserve existing article URLs and search equity.
4. Create clear course and lesson progression.
5. Improve article readability.
6. Add lightweight local learning progress.
7. Improve technical search.
8. Provide excellent mobile navigation.
9. Establish a consistent design system.
10. Reduce metadata duplication.
11. Improve accessibility.
12. Maintain Astro's static-first performance advantages.
13. Make the repository particularly easy for coding agents such as Codex to understand and modify.

---

# 7. Non-Goals

The first redesign should **not** introduce:

* mandatory user accounts,
* paid course infrastructure,
* a database merely to track progress,
* social networking,
* comments,
* achievement badges,
* complex gamification,
* extensive client-side JavaScript,
* a full CMS migration,
* rewritten historical articles,
* URL changes without compelling justification,
* or a simultaneous hosting migration.

Do not turn a straightforward Astro publication into a JavaScript application unnecessarily.

---

# 8. Information Architecture

The primary navigation should become simpler.

## Recommended desktop navigation

**Learn**
Start Here
Learning Paths
Courses

**Build**
Projects
Tools / Resources

**Journal**
Articles
Topics

**About**

Then place three utility actions on the right:

**Search · Subscribe · Theme**

This reduces the current feeling of several equivalent top-level destinations.

The conceptual hierarchy becomes:

```text
Doctors Who Code
│
├── Learn
│   ├── Start Here
│   ├── Learning Paths
│   └── Courses
│
├── Build
│   ├── Projects
│   └── Resources
│
├── Journal
│   ├── Articles
│   ├── Topics
│   └── Archive
│
└── About
```

The three learning paths remain the primary educational branches.

---

# 9. Homepage Requirements

The homepage should behave like an academy entrance rather than an article feed.

## Section 1 — Hero

Retain the central concept:

**Medicine needs more physicians who can build.**

Immediately follow it with one dominant call to action:

**Find Your Learning Path**

Secondary action:

**Explore the Journal**

Do not present six competing calls to action above the fold.

---

## Section 2 — Continue Learning

When local progress exists:

> **Continue where you left off**

Display the current course, next lesson, estimated reading time, and progress.

When no progress exists:

> **Choose your starting point**

Display the three learning paths.

This turns the homepage into a useful returning-user interface without requiring an account.

---

# 10. Learning Path Interface

Each learning path should have a visual curriculum map.

Example:

```text
USE AI IN MEDICINE

Course 1
Clinical AI Workflows
████████████████ 4 lessons

        ↓

Course 2
Ambient Clinical Documentation
████████████████ 10 lessons

        ↓

Course 3
Clinical AI Literacy
████████████████ 5 lessons

        ↓

BUILD
Minimum Viable Clinical Harness
```

Each course should communicate:

* purpose,
* prerequisites,
* difficulty,
* lesson count,
* estimated duration,
* intended capability,
* project outcome,
* completion status.

The project at the end should visually appear as the destination rather than another content card.

---

# 11. Course Experience

A course page should include a persistent course context.

Desktop:

```text
┌──────────────────┬─────────────────────────────────────┐
│ COURSE            │ Lesson content                      │
│                   │                                     │
│ 01 ✓              │                                     │
│ 02 ✓              │                                     │
│ 03 ● Current      │                                     │
│ 04                │                                     │
│ 05                │                                     │
│                   │                                     │
│ Progress 40%      │                                     │
└──────────────────┴─────────────────────────────────────┘
```

Mobile should collapse this into a compact header:

**Course 1 · Lesson 3 of 5 · 40%**

with a control for opening the curriculum.

Every lesson must have prominent:

**Previous Lesson** and **Next Lesson**

navigation.

At the end:

**Mark Lesson Complete → Continue**

---

# 12. Article / Lesson Design

The article experience should become one of the strongest parts of the redesign.

Target reading width:

**approximately 65–75 characters per line**

Article hierarchy:

```text
Learning Path
Course
Lesson 03 of 05

ARTICLE TITLE

Description
Updated date · Reading time · Difficulty

Article body

──────────────────

What you should understand now

Next lesson →
```

Desktop should optionally include a sticky table of contents.

Use strong typographic differentiation for:

* normal prose,
* clinical cautions,
* developer notes,
* code,
* key concepts,
* references,
* exercises,
* project checkpoints.

Code blocks should provide a copy action.

Headings should expose anchor links.

External links should be visually distinguishable.

---

# 13. Light, Dark, and System Themes

Theme support is a first-class requirement.

Required modes:

* Light
* Dark
* System

Default:

**System**

Persist an explicit user choice locally.

Do not force dark mode simply because this is a developer-oriented site.

Suggested visual direction:

### Dark

Background:
`#0B1220`

Elevated surface:
`#111827`

Primary text:
`#F8FAFC`

Secondary text:
`#CBD5E1`

Primary accent:
`#38BDF8`

Secondary accent:
`#FBBF24`

### Light

Background:
`#F8FAFC`

Elevated surface:
`#FFFFFF`

Primary text:
`#0F172A`

Secondary text:
`#475569`

Primary accent:
darker cyan/blue chosen to maintain accessible contrast

Amber should be used sparingly for checkpoints, active learning states, or important emphasis.

The theme must load before visible rendering to prevent a flash of the wrong theme.

If Astro client-side navigation is enabled, theme restoration must also be handled after navigation. Astro's current transition documentation specifically discusses restoring theme state during `astro:after-swap`.

---

# 14. Typography

Use typography that communicates technical seriousness without looking like a developer IDE.

Recommended model:

**Interface/body:** Inter, Geist, or similar modern sans serif
**Code/technical metadata:** JetBrains Mono

Limit font weights.

Prefer variable fonts when practical.

Use Astro's built-in Fonts API rather than adding unnecessary third-party runtime font requests. Astro can download, cache, self-host, preload, and create optimized fallbacks for configured fonts.

Typography should be optimized primarily for long-form reading.

---

# 15. Design System

Create semantic design tokens rather than scattering colors through components.

Example:

```css
--color-bg
--color-surface
--color-surface-elevated
--color-text
--color-text-muted
--color-border
--color-accent
--color-accent-secondary
--color-code-bg
--color-success
--color-warning

--space-1
--space-2
--space-3
--space-4
--space-6
--space-8
--space-12

--radius-sm
--radius-md
--radius-lg
```

Components should consume semantic tokens.

Theme switching should primarily change token values.

This will make the design substantially easier for Codex to maintain consistently.

---

# 16. Astro Architecture

Use **Astro 7.x** as the target framework.

As of September 2026, Astro 7.3 is current. Astro 7 introduced a Rust-based compiler and Markdown/MDX pipeline, Vite 8, faster builds, advanced routing capabilities, and agent-oriented development improvements including structured output for coding agents.

The platform should remain:

> **static first, interactive only where necessary**

Avoid converting static educational pages into hydrated React components without a specific reason.

Potential JavaScript islands include only functionality such as:

* search,
* progress tracking,
* interactive curriculum controls,
* or other genuinely stateful elements.

Everything else should remain standard Astro-rendered HTML.

---

# 17. Content Architecture

Use Astro Content Collections as the single source of truth.

Astro explicitly recommends content collections for groups of structured content because they provide schema validation, querying, Intellisense, and TypeScript safety.

Recommended collections:

```text
articles
courses
paths
projects
```

Do not manually write:

> 5 courses · 24 lessons · 238 minutes

onto multiple pages.

Compute those values from collection relationships.

This prevents curriculum metadata from drifting.

---

# 18. Suggested Article Schema

```yaml
title:
description:
publishedDate:
updatedDate:
author:
tags:
featured:
draft:

contentType:
  # journal | lesson | guide

path:
course:
lessonOrder:

level:
  # beginner | intermediate | advanced

estimatedMinutes:

learningObjectives:
prerequisites:

projectConnection:

heroImage:
heroAlt:

canonical:
```

A single article may remain visible inside the Journal while simultaneously participating in a course.

**Do not duplicate the article.**

Educational organization should be metadata layered over the existing knowledge base.

---

# 19. Search

Upgrade search from simple text retrieval into curriculum-aware discovery.

Recommended implementation:

**Pagefind**

Useful search filters:

* learning path,
* course,
* topic,
* difficulty,
* content type,
* tag.

Pagefind supports indexed filters and custom result metadata through HTML attributes, making it well suited to a static Astro publication.

Example search:

> `RAG`

Results can indicate:

**Lesson · Use AI in Medicine · Intermediate**

rather than simply returning an article title.

---

# 20. Local Progress Tracking

Version 1 should not require authentication.

Store completion locally:

```text
dwc-progress
```

Suggested structure:

```json
{
  "completedLessons": [],
  "currentLesson": "",
  "lastVisited": ""
}
```

Use this to provide:

* completed lesson indicators,
* course progress,
* “Continue Learning,”
* and last-read lesson.

Progress tracking must remain entirely optional.

Later versions could synchronize progress if user accounts ever become strategically useful.

---

# 21. Images

Use Astro's built-in image pipeline.

Prefer:

`<Image />`

or

`<Picture />`

rather than raw `<img>` when images are controlled by the project.

Astro provides responsive image handling and image transformation, while raw HTML images do not receive Astro's optimization pipeline.

Hero images should have standardized:

* aspect ratios,
* sizes,
* alt text,
* responsive sources,
* and loading behavior.

Avoid enormous images merely scaled visually by CSS.

---

# 22. Motion

Motion should communicate navigation, not decorate it.

Appropriate:

* subtle card transitions,
* theme transitions,
* curriculum expansion,
* restrained page transitions.

Avoid:

* large parallax effects,
* excessive scroll animation,
* floating objects,
* animated gradients,
* constant motion.

Respect:

`prefers-reduced-motion`

Astro's View Transition functionality already incorporates reduced-motion support.

---

# 23. Accessibility

Target:

**WCAG 2.2 AA**

At minimum:

* fully keyboard navigable,
* semantic landmarks,
* visible focus states,
* adequate contrast,
* correct heading hierarchy,
* descriptive links,
* useful alt text,
* accessible menus,
* accessible theme control,
* sufficient pointer targets,
* reduced-motion support.

WCAG 2.2 AA adds requirements including preventing focused elements from being obscured and minimum target-size considerations.

Accessibility is an acceptance criterion, not a final polish task.

---

# 24. Performance Requirements

Doctors Who Code should remain exceptionally fast.

Core Web Vitals target at the 75th percentile:

**LCP ≤ 2.5 seconds**
**INP ≤ 200 ms**
**CLS ≤ 0.1**

These correspond to the current "good" Core Web Vitals thresholds.

Additional goals:

* minimal JavaScript,
* no unnecessary hydration,
* optimized responsive images,
* self-hosted fonts,
* no blocking third-party scripts when avoidable,
* reserve image dimensions,
* lazy-load below-the-fold media.

Performance should be evaluated on mobile first.

---

# 25. SEO and Existing URLs

Existing article URLs should remain unchanged.

This is a redesign, not a content migration.

Requirements:

* preserve canonical URLs,
* preserve existing article slugs,
* maintain sitemap,
* maintain RSS,
* retain article metadata,
* add/update OpenGraph metadata,
* maintain structured headings,
* provide canonical tags,
* generate useful descriptions.

Astro supports automated RSS generation and RSS autodiscovery, and its sitemap integration supports statically generated and dynamic routes.

If any URL must change, create a permanent redirect.

---

# 26. Newsletter Integration

Newsletter calls to action should become contextual.

Instead of repeatedly saying:

> Subscribe to Doctors Who Code

prefer:

> Continue the AI in Medicine learning path by email.

or:

> Get new physician-developer tutorials.

The learning path selected by the reader can inform the signup context.

Do not interrupt article reading with aggressive popups.

---

# 27. Mobile Experience

Mobile should be treated as a primary interface.

Required behavior:

* compact top navigation,
* accessible menu,
* large touch targets,
* comfortable typography,
* no horizontal scrolling,
* readable code blocks,
* course context preserved,
* easy previous/next lesson controls,
* responsive search,
* theme toggle,
* progress preserved.

On lesson pages, consider a small bottom learning control:

```text
← Previous       3 / 5       Next →
```

It must not obscure keyboard focus or article content.

---

# 28. Desktop Experience

Use additional desktop space for information rather than simply enlarging everything.

Desktop lesson pages can include:

* course sidebar,
* article content,
* optional table of contents.

Do not make article prose excessively wide.

The interface should resemble a high-quality technical publication rather than a marketing landing page.

---

# 29. Recommended Reusable Components

Create a small, explicit component system:

```text
SiteHeader
MobileNav
ThemeToggle
SearchTrigger

PathCard
CourseCard
LessonCard
ProjectCard
ArticleCard

CourseSidebar
CourseProgress
LessonNavigation
Breadcrumbs
TableOfContents

Callout
CodeBlock
LearningObjective
ProjectCheckpoint

NewsletterCTA
SiteFooter
```

Do not create abstraction merely for abstraction's sake.

A component should exist because it represents a repeated product concept.

---

# 30. Security

Keep dependencies modest.

Use Astro's built-in security capabilities where useful.

Astro introduced first-party Content Security Policy functionality beginning with Astro 6 and has continued expanding CSP controls.

Avoid unnecessary third-party JavaScript.

Do not place clinical data, credentials, tokens, or environment secrets in source-controlled content.

---

# 31. Codex-Friendly Repository Design

The repository should explicitly support agentic development.

Create:

```text
/AGENTS.md
/docs/PRD-DWC-2027.md
/docs/ARCHITECTURE.md
/docs/DESIGN-SYSTEM.md
/docs/CONTENT-MODEL.md
```

`AGENTS.md` should explain:

* what Doctors Who Code is,
* target audience,
* Astro conventions,
* project structure,
* protected URLs,
* design-token rules,
* accessibility expectations,
* testing commands,
* build commands,
* prohibited changes,
* content preservation rules.

OpenAI specifically recommends persistent repository instructions such as `AGENTS.md` to give Codex stable project context.

---

# 32. Implementation Strategy

Do **not** tell Codex:

> Redesign my website.

That instruction is too broad.

Use staged implementation.

## Phase 0 — Audit

Codex inspects the entire repository without modifying production code.

Deliver:

```text
docs/CURRENT-STATE-AUDIT.md
```

The audit should document:

* Astro version,
* package dependencies,
* content organization,
* routes,
* CSS architecture,
* existing components,
* duplicated metadata,
* JavaScript islands,
* image handling,
* SEO,
* accessibility,
* build process,
* deployment assumptions.

---

## Phase 1 — Foundation

Implement:

* Astro upgrade if necessary,
* theme tokens,
* light/dark/system mode,
* typography,
* spacing,
* global layout,
* responsive container,
* accessibility foundations.

Do not redesign individual content pages yet.

---

## Phase 2 — Navigation and Shell

Implement:

* new header,
* simplified IA,
* mobile navigation,
* utility actions,
* footer,
* breadcrumbs,
* theme controls.

---

## Phase 3 — Content Model

Normalize:

* paths,
* courses,
* lessons,
* projects,
* relationships,
* counts,
* reading time,
* prerequisites.

All curriculum statistics must derive from structured data.

---

## Phase 4 — Learning Experience

Implement:

* learning-path pages,
* course pages,
* lesson context,
* previous/next navigation,
* local progress,
* Continue Learning.

---

## Phase 5 — Article Experience

Implement:

* improved typography,
* table of contents,
* code presentation,
* callouts,
* learning metadata,
* references,
* responsive images.

---

## Phase 6 — Search

Implement Pagefind with:

* filters,
* keyboard-accessible search,
* curriculum metadata,
* article metadata.

---

## Phase 7 — Homepage

Build the new academy-style homepage only after the underlying learning system exists.

Do not design a homepage around features that have not yet been implemented.

---

## Phase 8 — Quality Pass

Run:

* build validation,
* link checking,
* accessibility testing,
* Lighthouse,
* mobile testing,
* dark/light testing,
* keyboard testing,
* content-count validation.

---

# 33. Codex Development Model

Codex now supports agent workflows across its app, IDE, CLI, and cloud environments, and the desktop experience supports isolated worktrees for parallel agents.

Use parallel agents only after the architectural foundation is established.

Good parallel tasks after Phase 2:

```text
Agent A — learning-path components
Agent B — search implementation
Agent C — accessibility audit
Agent D — article typography and code blocks
```

Do not let four agents independently redesign the global layout.

Shared architecture should be settled first.

---

# 34. Testing Requirements

Every implementation phase must successfully complete the repository's equivalent of:

```bash
npm run build
npm run test
npm run lint
```

Add tests where appropriate for:

* collection validation,
* curriculum relationships,
* broken references,
* duplicated lesson order,
* invalid course IDs,
* inaccessible component states.

A lesson pointing to a nonexistent course should cause a build failure.

Structured content should turn editorial inconsistencies into detectable errors.

---

# 35. Acceptance Criteria

The redesign is ready when a first-time physician can land on Doctors Who Code and identify an appropriate learning path within seconds.

A returning reader should be able to return to the next lesson without searching.

A lesson should clearly indicate:

* where the reader is,
* what preceded it,
* what comes next,
* what competency it contributes to,
* and what eventually gets built.

The site must work equally well in:

* light mode,
* dark mode,
* mobile,
* desktop,
* keyboard navigation,
* and reduced-motion environments.

Existing articles must remain accessible at their current URLs.

The production build must remain predominantly static and fast.

---

# 36. Success Metrics

Measure the redesign against behavior rather than visual novelty.

Useful metrics include:

**Learning-path starts**
Percentage of visitors entering a path.

**Lesson continuation rate**
Readers who proceed to the next lesson.

**Course completion**
Locally measurable for consenting browser sessions.

**Project clicks**
Readers who progress from learning to building.

**Search success**
Search sessions resulting in content selection.

**Newsletter conversion by path**

**Returning visitor rate**

**Core Web Vitals**

The central question is:

> Does the redesigned interface help physicians progress from curiosity to capability?

---

# 37. The 2027 Design Principle

Doctors Who Code should not imitate a futuristic website.

It should implement a mature future-facing information architecture.

Avoid decorative futurism.

Prefer:

**clarity over spectacle**
**hierarchy over density**
**progress over feeds**
**systems over pages**
**projects over passive consumption**
**accessible speed over animation**

The visual redesign succeeds when the interface largely disappears and the learning sequence becomes obvious.

---

# 38. Initial Codex Prompt

Use the following prompt for the first Codex session:

> You are working on the existing DoctorsWhoCode.blog repository.
>
> This is an Astro-based physician-developer learning platform. Do not treat this as a greenfield website and do not begin redesigning components yet.
>
> Read the complete repository first.
>
> Read `docs/PRD-DWC-2027.md` and `AGENTS.md` if they exist.
>
> Your first task is a non-destructive architecture and UX audit.
>
> Identify:
>
> * Astro version and configuration
> * content collections and frontmatter structure
> * routes and URL patterns
> * course/path/lesson relationships
> * duplicated curriculum metadata
> * global CSS and design tokens
> * reusable components
> * client-side JavaScript
> * theme handling
> * image optimization
> * search implementation
> * SEO and metadata
> * RSS and sitemap
> * accessibility risks
> * performance risks
> * dependencies that may be obsolete or unnecessary
>
> Preserve all article content and existing public URLs.
>
> Do not make production changes during this task.
>
> Produce `docs/CURRENT-STATE-AUDIT.md`.
>
> Then produce `docs/IMPLEMENTATION-PLAN.md` mapping the PRD into small, reviewable phases and identifying which tasks can safely run in parallel.
>
> For every proposed change, distinguish:
>
> 1. required,
> 2. recommended,
> 3. optional.
>
> Favor Astro-native, static-first solutions. Do not introduce React or another client framework unless a specific interaction requires it.
>
> Finish by listing the first three implementation tasks you recommend after the audit.

---

# 39. Final Product Definition

Doctors Who Code 2027 is not a redesigned blog.

It is a **physician-developer academy built on top of a durable technical journal**.

The journal captures ideas.

The learning paths impose sequence.

The courses develop competence.

The projects turn competence into systems.

And the interface exists to make that progression unmistakable.
