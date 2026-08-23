# Redesign 2.0: Modern Web and Mobile Plan

Status: Planning
Date: 2026-08-23
Implementation status: No application code changed

## Decision

The 2026+ modernization brief ("Doctors Who Code 2026+ Modern Web and Mobile Redesign") describes a comprehensive responsive, accessibility, and design-system pass on top of the learning-platform architecture already shipped in Stages 0-5. It is written as though the site needs a ground-up rebuild. It does not. A code audit against the brief found the foundation already in place: fluid typography via `clamp()`, CSS custom-property design tokens, Tailwind v4, View Transitions, the full Path/Course/Lesson/Project/Channel card system, lesson sequencing, responsive tables of contents, and an accessible audio player.

Redesign 2.0 is therefore a gap-closing and quality-verification pass, not a rebuild. This plan scopes only the real gaps between the brief and the current implementation.

## Decisions made

1. **Theme: dark-only.** No light-mode toggle. This matches CLAUDE.md's fixed "dark navy theme throughout" brand identity and avoids doubling the token and contrast work for a feature the brief itself treats as optional.
2. **Navigation: keep the current flat 6-item header** (Start Here / Learning Paths / Courses / Projects / Articles / About). No Learn/AI/Build mega-navigation. The brief's own guidance is to add mega-nav only "if content volume genuinely requires it" — with 3 paths, 5 courses, and 3 projects today, it doesn't.
3. **Release strategy: hold-and-cutover.** All Redesign 2.0 work happens on the `claude/doctors-who-code-redesign-jizyy7` branch. Nothing merges to `main` mid-flight. `main` continues to deploy to the live `doctorswhocode.blog` domain unchanged throughout the project. Each push to the branch gets its own Vercel preview URL for review. A single merge to `main` at the end cuts the live site over to the finished redesign.

## Gap analysis

What the brief asks for that is already shipped:

- Learning-platform IA (paths/courses/lessons/projects/channels)
- Fluid, `clamp()`-based typography and spacing
- CSS custom-property design tokens
- Tailwind v4, View Transitions
- Path/Course/Project/Article/Channel card system
- Continue Learning / lesson sequencing (`LessonNavigator`, `SeriesNav`)
- Reading time, desktop and mobile table of contents
- Search data layer (`utils/search.ts`, `search-index.json.ts`) with topic, difficulty, and format classification
- Accessible audio player, skip link, focus-visible states
- No legacy duplicate layouts (prior cleanup already removed them)

What is genuinely missing or unverified:

1. **Search UI.** The index exists; there is no command-palette (desktop) or full-screen (mobile) search experience.
2. **Reading-progress indicator.** No scroll-based progress bar on articles.
3. **Homepage.** Close to the brief's wireframe but has no distinct "Featured Courses" section.
4. **Formal breakpoint/visual QA.** Stage 5's own notes record that visual sign-off was never completed. The brief's 9-width review (320-1920px) has not happened.
5. **Lighthouse/Core Web Vitals baseline.** No recorded scores anywhere in the repo. Targets (>=95 all categories, LCP<2.5s, CLS<0.1, INP<200ms) are unverified.
6. **WCAG 2.2 AA gap check.** Prior work targeted WCAG AA generally; a 2.2-specific pass (target-size minimum, focus-not-obscured, dragging alternatives) has not been done.
7. **Design-system documentation.** Tokens exist but are not documented as a named scale (surfaces, borders, states, spacing, radius) in the style of the Primer/Geist references in the brief.

## Phased plan

| Phase | Work | Est. hours |
| --- | --- | ---: |
| 1. Baseline audit | Record Lighthouse/CWV scores; run the 9-breakpoint visual review (320-1920px); document what is dated vs. solid | 4-6 |
| 2. Design-system docs | Formalize existing tokens into a documented scale (spacing, radius, surfaces); minimal new CSS | 3-5 |
| 3. Search UX | Build command-palette search (desktop) and full-screen search (mobile) on top of the existing search index | 8-12 |
| 4. Reading experience | Add scroll-based reading-progress bar; verify Continue Learning renders consistently on every lesson-mapped article | 3-5 |
| 5. Homepage refinement | Add a Featured Courses section; tighten copy and hierarchy to match the brief's wireframe | 3-5 |
| 6. Accessibility pass | WCAG 2.2-specific gaps (target size, focus-not-obscured); keyboard pass on palette, drawer, and audio controls | 5-8 |
| 7. Performance pass | Image dimensions and responsive `srcset`, JS audit, hit Lighthouse >=95 across the board | 4-7 |
| 8. Visual QA and fixes | Resolve findings from Phase 1's breakpoint review; separate mobile and desktop sign-off | 5-8 |
| 9. Cleanup and regression | Remove anything dead the audit finds; run existing `npm run check` validators; final sign-off | 2-4 |

Total: approximately 37-60 hours of focused work.

## Release strategy detail

- All commits land on `claude/doctors-who-code-redesign-jizyy7` (or a branch stacked on it).
- `main` and `doctorswhocode.blog` are not touched until the final cutover.
- Each push produces a Vercel preview deployment for review throughout the project; the review happens on the preview URL, not on production.
- Before the final merge, re-run the Phase 1 baseline checks against the finished branch and confirm no regression versus the recorded baseline.
- Cutover is a single merge of the redesign branch into `main`.

## Definition of done (cutover checklist)

- All nine phases complete.
- `npm run check` passes with no new protected-route or link regressions beyond the recorded baseline debt.
- Lighthouse Performance, Accessibility, Best Practices, and SEO each >=95 on representative homepage, path, course, lesson, project, channel, and article pages.
- Core Web Vitals within target (LCP<2.5s, CLS<0.1, INP<200ms) on the same representative set.
- WCAG 2.2 AA gap items resolved.
- Separate mobile and desktop visual sign-off recorded, matching the brief's requirement that neither be a scaled version of the other.
- Dark-only theme confirmed consistent across every new and touched component.
