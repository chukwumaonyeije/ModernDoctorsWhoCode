# Architecture

Current implementation: Astro 7.3.2, MDX 8.0.1, Tailwind 4.3.3 through its Vite plugin, static output on Vercel. Node 22.19.0 is the CI baseline and satisfies Astro's >=22.12.0 requirement. See [Astro 7 upgrade](ASTRO-7-UPGRADE.md) for exact versions and validation.

`astro.config.mjs` owns the production site origin and MDX/sitemap/React integrations. `src/content.config.ts` defines loader-backed collections. `src/utils/learning.ts` queries curriculum relationships; `src/utils/search.ts` emits the archive's static search data; `src/data/taxonomy.ts` classifies topics and formats.

Curriculum relationships and summaries are centralized in the pure typed `src/utils/curriculum.ts`, loaded through `learning.ts`. Search uses the same publication-closed graph. Reading metadata is shared through `getReadingMetadata()` in `src/utils/blog.ts`. See [Content model](CONTENT-MODEL.md) for ownership, duration semantics and stable lesson IDs.

The upgrade explicitly retains `compressHTML: true` and the `unified()` processor from `@astrojs/markdown-remark` to preserve historical Markdown/MDX behavior. Moving to Astro 7's default Markdown processor is a separate optional change requiring the same preservation checks.

`BaseLayout.astro` owns the HTML shell, metadata, Header and active footer. `PostLayout.astro` owns shared article presentation, optional curriculum context, TOC, audio and sharing. `BlogPost.astro` is a legacy layout, not the active article renderer.

`src/pages/blog/[...slug].astro` renders collection articles at their existing URLs. Learning pages link to those articles rather than publish copies. `/paths/`, `/courses/`, `/projects/`, `/channels/`, `/tags/`, `/start/` and identity/contact pages are static. The Docling and protected internal MFM articles have dedicated Astro routes. Public slide HTML is copied without Astro rendering.

The current browser code is small native scripts for theme preferences, navigation, archive filtering, audio, sharing, newsletter and protected-content decryption. The theme initializer runs inline in BaseLayout's head and uses localStorage only for a system/light/dark preference. CSS provides the no-JS system fallback. One existing screenshot carousel uses a React island. Do not add a global client framework for progress/search features. Client navigation is not enabled.

Build and regression commands are defined in [Preservation checks](PRESERVATION-CHECKS.md). `npm run check` is the complete local/CI gate; `npm run build` runs relationship validation before generating `dist`. Never publish or regenerate narration as a side effect of a validation task.

Protected interfaces include article bodies and URLs, canonicals, original media/downloads, RSS and sitemap, search entry points, special articles and Vercel redirects. Approved manifests live under `baseline/`. Check candidates are review artifacts, not automatic baseline updates.

See [Current-state audit](CURRENT-STATE-AUDIT.md) for measured counts and known risks and [Implementation plan](IMPLEMENTATION-PLAN.md) for staged changes. This architecture remains static-first; accounts, databases, CMS changes and hosting migration are outside the initial redesign scope.
