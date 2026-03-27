# Doctors Who Code

Static Astro site for [doctorswhocode.blog](https://www.doctorswhocode.blog).

## Stack

- Astro 6
- MDX content collections
- Tailwind CSS 4
- React 19 for interactive components where needed
- Vercel deployment

## Content Structure

Blog posts live in `src/content/blog/posts`.

- Published posts stay in `src/content/blog/posts`
- Draft posts stay in `src/content/blog/posts/_drafts`
- Shared content template lives at `src/content/blog/_template.mdx`

Supporting page content lives in `src/content/blog/pages`.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Publishing Workflow

1. Add or edit an MDX post in `src/content/blog/posts`.
2. Keep `draft: true` while the post is in progress.
3. Set `pubDate` when the post is ready to publish.
4. Generate audio after publishing with `python -X utf8 scripts/generate_audio.py`.
5. Deploy through GitHub to Vercel.

## Notes

- The site uses static generation.
- Tag routes are normalized from frontmatter tags.
- Production metadata is configured for `https://www.doctorswhocode.blog`.
