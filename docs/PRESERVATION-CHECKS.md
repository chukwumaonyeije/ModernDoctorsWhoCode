# Preservation checks

Implemented September 15, 2026 for step 1 of the 2027 implementation plan. This change adds build tooling, tests, CI and documentation. It does not redesign the site, update Astro, repair historical article links or change article content.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install exactly the committed lockfile. |
| `npm test` | Run isolated Node fixture tests for preservation and graph failures. |
| `npm run build` | Validate learning relationships through `prebuild`, then build Astro. |
| `npm run validate:site` | Validate identity, graph, article markup, legacy routes and preservation against an existing build. |
| `npm run validate:preservation` | Read-only source/output/manifest comparison. Run after a fresh build. |
| `npm run check` | Tests, graph precheck, fresh production build, then every site validator. |
| `npm run baseline:preservation` | Generate ignored review candidates; never update approved manifests. |

For constrained local environments, set `ASTRO_TELEMETRY_DISABLED=1` in the process environment before building. CI sets it automatically. No secret, Fish Audio request, IndexNow submission or newsletter subscription is needed for these checks.

There is no general application lint or TypeScript check added in this bounded step. `npm test` exercises the guardrail behavior; Astro build validates content and compiles the application but is not a full type check. Introducing a scoped application lint/type-check baseline remains an open tooling task. Do not describe the current checks as WCAG certification or browser testing.

## Protected facts

`baseline/protected-routes.json` is the original, unchanged protection for 623 pages, eight endpoints and 26 known link issues. Its existing writer now refuses to overwrite it. `baseline/preservation.json` is an additive snapshot protecting the full current site:

- 725 HTML routes and their canonical link values, including the two standalone slide documents.
- 208 published collection article IDs, routes, source-body hashes, parsed frontmatter, rendered titles/descriptions/publication metadata, OG images, narration references, heading IDs and article-body text hashes.
- The two special Astro article source files and the internal slideshow source.
- All 373 original public assets, with SHA-256 content hashes and a source-to-build comparison.
- Non-hashed public endpoints, including narration, downloads, generated OG images, RSS, sitemap and search JSON. Hashed `/_astro/` output names may legitimately change between builds and are not frozen.
- Existing ordered redirect rules, RSS item metadata and sitemap URL membership.

New public pages, articles, RSS entries and sitemap entries may be added without breaking the old snapshot. Existing protected entries cannot disappear or change silently. Newly published records should be added to the manifest in the same reviewed publishing change so they receive protection too.

Text hashes normalize CRLF to LF for Windows/Linux checkout compatibility. They do not normalize punctuation or substantive article text. Parsed frontmatter comparison ignores key order but retains values and array order. Rendered prose comparison normalizes HTML whitespace, ignores script/style payloads and preserves text. Random newsletter instance heading IDs are excluded; durable article heading IDs are retained. Public binaries are hashed as bytes. Encryption randomness is not snapshotted: protected source is hashed instead of the encrypted output payload.

Step 2 correction: preformatted code is hashed with exact text and whitespace after concatenating highlighting spans. Span boundaries must not introduce invented spaces into code. All 208 old rendered hashes were first verified against a reproduced Astro 6 build; only the 44 article hashes containing preformatted code were then recalculated from that original output. Every other manifest field is unchanged. The new fixture proves span-only changes pass while code text and indentation changes fail. See [Astro 7 upgrade](ASTRO-7-UPGRADE.md).

The article ID calculation matches the current shallow glob loader's explicit `slug` override or github-slugger filename behavior. A future loader change must preserve the actual route manifest; it must not infer a new route from a renamed source file without review.

## Local reference checks and known debt

The scanner uses parsed HTML, so literal examples in code blocks and strings inside scripts do not become fake links. It checks local anchor destinations, same-page and cross-page fragments, images and srcset, audio/video/source/track, video posters, iframe/object sources, script sources, selected asset link tags, and OG/Twitter images. Encoded Unicode paths and HTML entities are decoded. It never crawls external hosts.

`/_vercel/insights/script.js` is the sole explicit hosting-provided asset exception. It is served by Vercel rather than generated into `dist`. No broad `/_vercel/*` or arbitrary missing-file exemption is used.

`baseline/reference-debt.json` records each exception with an exact issue string, owner role and reason. Initial findings:

Step 3 update: the three projectless-course terminal destinations now resolve to their course syllabuses. Their exact exceptions were removed after the fresh build reported them resolved. Current debt is 49 entries: 26 page links, 19 historical fragments and four encrypted-body scan exceptions. No article/asset preservation hashes or original route-baseline entries changed in step 3. The expanded suite has 17 passing tests, including graph publication closure, stable slug resolution and pure curriculum/reading queries.

| Category | Count | Ownership / follow-up |
| --- | ---: | --- |
| Existing missing page links | 26 | Article maintenance or protected-article maintenance; same debt as the old baseline. |
| Historical missing article fragments | 19 | Article maintenance; repair anchors/link adapters in a reviewed content-preserving change. |
| Projectless-course terminal links | 3 | Learning experience; choose a valid last-lesson destination. |
| Decrypted internal-body anchors | 4 | Protected-article maintenance; static HTML cannot verify anchors created after unlock. These are static-scan exceptions, not proof that unlocked navigation fails. |

Any unlisted issue fails validation. Resolved exceptions are reported so their entries can be removed during review. Do not enlarge the debt list merely to make a failing feature pass.

Limits: the scanner does not execute JavaScript, decrypt protected text, inspect CSS `url()` references, verify remote media, validate anchors inside PDFs/iframes, or emulate deployed Vercel redirect matching. Existing redirects retain their exact positions; additional rules may be appended. Inserting a rule ahead of an existing one requires explicit manifest review because it could shadow that route. Generated HTML and source preservation complement, rather than replace, runtime, accessibility and external-link testing.

## Reviewing an intentional change

1. Run `npm run check` before editing and keep its baseline result.
2. Make the authorized change. A content, metadata or original-media change should fail preservation until explicitly reviewed.
3. Build and run `npm run baseline:preservation`. It writes `baseline/preservation.candidate.json` and `baseline/reference-issues.candidate.json`, both ignored by Git.
4. Review the candidate diff against `baseline/preservation.json`. Carry forward protected entries; accept only the intended fields or new entries. Never use a whole-file snapshot replacement to hide an unrelated removal, content edit or broken link.
5. Include the narrow approved manifest change and its reason in the PR. Review any exact debt removal/addition separately. The original 623-route baseline remains intact.
6. Run `npm run check` again. No normal build, test, validator or CI job writes a baseline.

Adding audio intentionally changes frontmatter/rendered narration and adds a public binary. Commit the new MP3, frontmatter and narrowly reviewed manifest entries together. This preserves the standing narration workflow without allowing accidental audio removal.

## CI and evidence

`.github/workflows/site-check.yml` runs on pull requests, pushes to main and manual dispatch. It uses Node 22.19.0, `npm ci`, and `npm run check`, with read-only repository permissions. It has no deploy, commit, baseline-writing or external publishing step. The audio-generation workflow is unchanged.

The workflow defines a check; requiring it through GitHub branch protection is a repository-host setting and has not been changed by this local implementation. Production Vercel settings are also unchanged. Invoking `astro build` directly bypasses npm's prebuild hook; use the documented `npm run build`/`npm run check` entry points.

Fixture tests deliberately mutate article bodies, canonical URLs, routes, media, endpoint/redirect records, feed membership, sitemap membership and curriculum references. They also verify safe additions, exact debt matching, encoded anchors, escaped code examples, checkout line endings, source/build media parity and read-only capture. Fixtures live in individually allocated temporary directories; production source is not modified by the tests.

Local verification for this implementation:

- 11 fixture tests passed, including refusal to overwrite the legacy baseline and handling of random newsletter IDs.
- Fresh Astro production build passed: 723 generated pages, 725 HTML files after copying public slides.
- All identity, graph, article, legacy-route and preservation validators passed against that fresh build.
- Preservation confirmed 725 pages, 208 articles, 373 original public assets and 14 redirect rules, plus 208 RSS items and 723 sitemap URLs.
- Reference scanning found exactly the 52 documented issues and no new failures.
- `npm ci --dry-run --offline --ignore-scripts` accepted the manifest/lockfile pairing. The two direct development dependencies were already in the lockfile transitively; their versions were not upgraded.
- Workflow YAML and command wiring were checked locally. GitHub-hosted CI has not yet run because this change has not been pushed.
- Git comparison confirmed no changes to `src/`, `public/`, Astro/Vercel configuration, the original route baseline or the narration workflow.

The first fresh build encountered a Windows sandbox ancestor-directory read restriction while Vite reoptimized dependencies after the lockfile change. The same build passed with the required local filesystem access. No application workaround or production configuration change was introduced.
