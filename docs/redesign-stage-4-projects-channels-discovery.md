# Redesign Stage 4: Projects, Channels, and Discovery

Date: 2026-07-29
Status: Complete

## Outcome

Doctors Who Code now exposes applied projects and durable editorial channels as first-class destinations. The article archive also has accessible, URL-persisted search and controlled filters backed by a build-time index.

The implementation preserves every existing article, tag route, and canonical `/blog/[slug]/` URL. With JavaScript unavailable, the archive continues to show the complete article collection.

## Public routes

Stage 4 adds twelve protected pages:

- `/projects/`
- Three project detail pages
- `/channels/`
- Seven channel detail pages

The protected route baseline now contains 623 HTML pages and eight critical endpoints. `/search-index.json` is a static data endpoint rather than an HTML page.

## Project experience

The project index presents all three applied projects. Each project page provides:

- A concise clinical or technical brief
- Project state, difficulty, and expected time
- The related learning path
- Skills practiced
- Related course and lesson links
- `HowTo` structured data

The records remain in the `idea` state. The public interface presents that state honestly instead of implying that a completed starter repository or downloadable artifact already exists.

## Channel experience

All seven editorial channels are published and have durable landing pages. Each page combines the controlled topic definition with relevant articles, courses, and projects.

Channels create stable subject destinations without replacing legacy tags. Existing tag URLs remain intact as archive taxonomy and compatibility routes.

## Article discovery

The article archive now provides a labeled keyword search and five controlled facets:

1. Learning path
2. Article format
3. Difficulty
4. Topic
5. Publication recency

Search state is stored in the URL with `q`, `path`, `format`, `difficulty`, `topic`, and `recency` parameters. A copied or bookmarked URL restores the same result set.

The result count uses a polite live region. The empty state explains that no combination matched and provides a clear reset action. Without JavaScript, every server-rendered article remains visible.

## Search index and taxonomy

`search-index.json` is generated at build time from the article collection. It contains 172 records and is approximately 127 KB uncompressed. The browser loads it only after search interaction or when the page opens with query parameters.

Each record includes normalized category, controlled topics, inferred format, learning-path and course context when available, difficulty, date, year, and search keywords.

Short taxonomy terms such as `AI`, `API`, and `MFM` use whole-word matching. This avoids accidental classifications from unrelated words that merely contain the same letters.

## Navigation

Projects now appear in the primary navigation. Channels remain directly available from the article archive and the expanded learning footer.

The desktop navigation breakpoint moved to 1150 pixels so the additional destination retains comfortable spacing. The compact menu remains the accessible narrow-screen interface.

## Verification

The completion review passed:

- Astro production build with 621 generated pages
- Learning graph validation for 3 paths, 3 courses, 13 lessons, 3 projects, and 7 channels
- Canonical identity and sitemap validation
- Protected-route validation across 623 HTML files
- Internal-link regression validation with no new failures
- Search-index validation for 172 article records
- Desktop visual review of project, channel, filtered archive, and empty-state pages
- Narrow responsive review of a channel and filtered archive
- URL restoration checks for learning-path, topic, and keyword states
- Doctors Who Code voice check across all new public copy

The 26 known internal-link issues remain recorded as baseline debt. Stage 4 introduced none.

## Stage 5 boundary

The next stage can focus on the reading surface: compact article chrome, an in-flow mobile table of contents, full keyboard and contrast review, and font-loading performance. The learning, project, channel, and discovery architecture is now in place.
