# Part 1 publication preparation

Status: editorial preparation only, 2026-10-25. PR #10 remains draft. Nothing in this document registers an article, course, lesson or project in the live content collections.

## Article metadata

The article draft now includes its title, description, author, author URL, category, tags, `draft: true` and `featured: false`. Existing series, part, source and last-tested fields remain editorial metadata. The site's blog schema uses `draft`, not `status`, to control article visibility.

Proposed stable article ID: `mcp-for-physicians-part-01`.
Future content file: `src/content/blog/posts/mcp-for-physicians-part-01.md`.
Future route: `/blog/mcp-for-physicians-part-01` (proposed, not live).
Keep the current article in `docs/drafts/` until release preparation is authorized. Move the article when ready; do not create two active copies.

The required `pubDate` is intentionally not assigned: no publication date has been approved. Set it to the actual planned release date before schema validation in the blog collection. `last_tested` is not a publication date. This preparatory draft is therefore not yet a complete blog-collection entry.

Let the shared reading metadata helper derive reading time. Do not confuse article reading time with the two-hour lesson budget. Omit `canonical` until a distinct canonical URL is needed; use the site's normal route-derived canonical handling. Preserve `featured: false` unless a featured placement is separately selected.

Hero direction: an original diagram showing Inspector, the notebook server and clearly synthetic notes. Prepare the real asset before adding `image.url`. Write alt text describing the finished image, not an unseen proposed illustration. Required narration must use the configured author voice and its verified file before adding `audioUrl`. No generation or publishing workflow has been invoked.

## Recommended placement

Create a dedicated beginner course, `mcp-for-physician-developers`, in the existing `learn-to-code` path. Place it after `physician-developer-foundations`; order 2 is the next available position in the inspected checkout. Recheck order and ID availability when registering the course.

This fits the stated audience of physicians with little programming experience and the path's outcome of creating, versioning and explaining a small project. It builds on Git and JSON foundations. Build Medical Software is a reasonable future cross-reference, but the course's first project uses synthetic teaching data and does not deliver a clinical application. Keep one course membership for the article.

Proposed course front matter (planning only):

```yaml
title: "MCP for Physician Developers: From First Principles to a Working Cloudflare Project"
description: "Build and explain a small research-notebook MCP server through local tools, testing, source metadata, and a later Cloudflare deployment."
path: learn-to-code
difficulty: beginner
outcomes:
  - "Trace tool discovery and a request from an MCP client to a server and back."
  - "Build and test bounded read-only search and retrieval tools."
  - "Explain provenance, missing data and the limits of successful retrieval."
  - "Adapt the shared retrieval core for a stateless Cloudflare server."
prerequisites:
  - "Basic terminal navigation and the ability to edit a text file."
  - "Git and JSON basics, covered in Physician-Developer Foundations."
order: 2
status: draft
```

Do not author a course duration total. The site derives it from visible lessons. Six planned two-hour sessions represent a 12-hour learning budget, not an assertion that six lessons are published. Add a project relationship only after an approved Physician Research Notebook project entry exists.

Proposed Part 1 lesson ID: `mcp-for-physicians-part-01-trace-one-request`. Keep that identity stable after registration.

```yaml
title: "Trace One MCP Request"
description: "Discover two notebook tools, search a synthetic note collection, and explain how the client and server exchange results."
article: mcp-for-physicians-part-01
course: mcp-for-physician-developers
lessonNumber: 1
difficulty: beginner
estimatedMinutes: 120
prerequisites:
  - "Node.js LTS, npm and Git installed for the linked exercise."
  - "Access to the exercise repository or its approved public replacement."
learningObjectives:
  - "Distinguish MCP, APIs, tool calling, retrieval and agents."
  - "Discover search_notes and get_note using an MCP client."
  - "Trace a search result ID into a full-note retrieval."
  - "Explain why successful retrieval does not establish scientific validity."
status: draft
```

The effective lesson path is inherited from the course; do not duplicate it. The 120-minute estimate includes explanation, building, testing, teach-back and editorial reflection. These templates are not active content entries: adding a lesson now would reference an article that is not yet in the blog collection.

## Before release

- Make the code and exercise accessible to intended readers through a separately approved public release or public exercise copy. The course repository remains private.
- Confirm the publication date and create the hero image and narration.
- Register the article, course and lesson together with valid references; keep their draft controls until publication is authorized.
- Validate metadata, curriculum relationships and the rendered article, including mobile diagram readability and working exercise links. Follow the current repository check and preservation requirements; do not update unrelated baselines.
- Preserve the original source and author verification history. No additional personal exercise is claimed by this preparation.
- Publishing, merging PR #10, changing visibility and running narration/deployment workflows remain separate actions.
