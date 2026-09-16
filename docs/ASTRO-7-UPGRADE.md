# Astro 7 upgrade

Implemented locally September 15, 2026 as step 2 of the implementation plan. No commit, deployment, article rewrite, URL change or component redesign is included.

## Versions and compatibility

Versions were verified against the npm registry rather than inferred from the PRD. The [official Astro 7 migration guide](https://docs.astro.build/en/guides/upgrade-to/v7/) informed the processor and whitespace compatibility settings.

| Package | Before | After |
| --- | --- | --- |
| astro | 6.0.5 | 7.3.2 |
| @astrojs/mdx | 5.0.1 | 8.0.1 |
| @astrojs/react | 5.0.0 | 6.0.5 |
| @astrojs/rss | 4.0.17 | 4.0.19 |
| @astrojs/sitemap | 3.7.1 | 3.7.4 |
| @astrojs/markdown-remark | 7.0.0, transitive | 7.3.1, explicit |
| tailwindcss / @tailwindcss/vite | 4.2.1 | 4.3.3 |

Changed direct dependencies use exact versions. Node 22.19.0 remains the tested local/CI version; Astro and integrations require Node >=22.12.0. Astro resolves Vite 8.3.0. The existing Tailwind plugin declared Vite support only through 7, so the Tailwind pair was updated to the release declaring Vite 8 compatibility. Some peer dependency branches still resolve Vite 7.3.1; the Astro build uses Vite 8.3.0. No forced dependency overrides were added.

React/React DOM, Fontsource packages, direct Sharp/Satori and the guardrail dependencies retain their previous locked versions. The lockfile diff contains the compiler/bundler and platform-specific optional packages plus integration, Tailwind and their transitive updates. Existing React carousel support remains installed; removing it is optional later work.

## Compatibility decisions

- **Required:** preserve static output, site origin, content collections, authored article bodies, canonical values, routes, redirects, narration and original assets.
- **Recommended and implemented:** retain `unified()` from `@astrojs/markdown-remark` rather than change historical Markdown processing during the framework upgrade.
- **Recommended and implemented:** explicitly set `compressHTML: true` to retain the prior compression mode.
- **Optional and deferred:** adopt the new default Markdown processor, change fonts, remove React or delete legacy components. These need separate review.

No application source or public file was edited. Astro/Vercel hosting behavior and CI's Node version remain the same. The original route manifest and narration workflow are unchanged.

## Preservation-check correction

The first Astro 7 build passed all checks except one rendered-body hash in `physician-developer-stack-mdx.mdx`. Shiki split `<RiskCalculator />` across additional spans. The old checker joined text nodes with spaces, inventing a space after `<` even though the actual code text was identical.

To distinguish a checker defect from an article regression:

1. Saved the upgraded manifests/configuration and reproduced the original Astro 6 installation and build.
2. Verified all 208 original article rendered-body hashes matched the approved manifest.
3. Verified the six preformatted blocks in the affected article had exactly equal text and whitespace in both outputs.
4. Changed the checker to concatenate preformatted text directly and hash it without collapsing indentation. Added a test for span equivalence and failures on changed code or indentation.
5. Recalculated only 44 affected article rendered-body hashes from the verified Astro 6 output. Asserted that every other manifest field was identical. No Astro 7 output was used to establish these expected hashes, and no reference-debt exception was added.
6. Restored the upgraded manifests/configuration, ran a clean `npm ci`, then the complete check pipeline.

This makes code checks stricter about whitespace while independent of syntax-coloring span boundaries. Normal validation commands still never modify manifests.

## Verification

- Clean `npm ci` completed using the new lockfile.
- `npm run check` passed: 12 fixture tests, relationship precheck, static build, identity, graph, article, legacy-route and preservation validators.
- Built 723 Astro pages and retained 725 HTML files including the public slides.
- Preserved 208 collection articles, their rendered metadata/headings/body hashes, 373 original public assets, 14 redirects, 208 RSS items and 723 sitemap URLs.
- Exact preformatted text and whitespace matched the Astro 6 output for all 252 code blocks across 45 generated pages, including the special public article.
- All 52 recorded reference issues remain visible, with no new failures and no expanded exceptions.
- Existing MDX imports compiled, including Callout, FAQ, SeriesNav and the React carousel. The carousel's generated controls and hydration island are present.
- Source comparison confirmed no edits to `src/`, `public/`, Vercel configuration, the original route baseline or the narration workflow.

Full-site preservation covers the Unicode-slug and mixed Markdown/HTML articles. Protected source and the locked route remain preserved; decrypted content was not exercised.

## Subsequent browser follow-up

The explicitly authorized Playwright follow-up exercises representative desktop/mobile pages, carousel hydration/navigation, FAQ, both themes and the locked special route. It adds regression coverage and fixes observed layout and accessibility issues. See [Browser verification](BROWSER-VERIFICATION.md). This supersedes the connector attachment blocker below; manual screen-reader, zoom, broader navigation and performance acceptance remain open. Curriculum centralization has also since been completed, as recorded in IMPLEMENTATION-PLAN.md.

## Review gates recorded at upgrade completion

- **Required before merge:** browser smoke testing of carousel navigation/hydration, representative desktop/mobile pages, FAQ, SeriesNav and the special article routes. Both attempts to attach the available browser tool to the local preview timed out. Static output checks do not establish runtime interaction or visual parity.
- **Required in the broader plan:** general application type/lint checks, publication/security corrections and curriculum query centralization remain open. This task does not claim those are complete.
- **Recommended:** track Vite deprecation warnings emitted by the React integration's Babel plugin for `esbuild`/`optimizeDeps.esbuildOptions`. Builds succeed; no application workaround or suppression was added.
- **Recommended:** investigate npm's listing of several optional WASM support packages as extraneous even after clean installation. `npm ci` and the build pass; no manual node_modules cleanup or lockfile surgery was used to hide this output.

GitHub-hosted CI, deployment, Lighthouse and broad accessibility testing were not performed. Windows builds needed filesystem access beyond the restricted sandbox for dependency loading, as with the original build.

## Rollback

Revert the package manifest, lockfile and Astro configuration together, then run `npm ci` and `npm run check`. Keep the corrected code-aware preservation check and its Astro 6-derived hashes together; they are valid on both versions. Restore current-version documentation with the framework rollback. Never rewrite article content or redirect URLs to make a rollback pass.
