# Browser verification

Latest checkpoint status, September 16: the site owner reported the representative manual checklist passed and authorized publishing the reviewed foundation. See the user-acceptance entry below and [Checkpoint review](CHECKPOINT-2026-09-16.md). Earlier remaining-work entries describe the evidence available at the time; broader release coverage and performance work remain open.

Date: September 15, 2026. Local production build, Microsoft Edge 153.0.4234.32 on Windows, headless Playwright. Playwright was explicitly authorized after the desktop browser connector could not attach. No deployment or external form submission was performed.

## Scope and evidence

The layout matrix covers 10 routes at widths 320, 375, 768 and 1440 in both system light and dark modes: 80 views. All passed document overflow and page-error checks. Axe scans at 375 and 1440 cover 40 views with WCAG 2 A/AA, 2.1 AA and 2.2 AA tags; no violations were detected after fonts and finite entrance animations settled. Automated checks do not establish WCAG conformance.

Routes: home, start, use-AI path, clinical-AI course, archive, physician-developer stack article, Inbox Detox carousel article, Docling article, locked MFM scoring article and contact. Screenshot review includes the corrected mobile Docling layout and mobile dark homepage.

All 22 Playwright tests passed across desktop and mobile projects. Interaction tests cover system changes, explicit preferences, reload/navigation persistence, cross-tab updates, invalid and denied storage, keyboard selection and menu focus return, the first animation frame, no-JavaScript navigation, carousel hydration and next/previous controls, FAQ disclosure and reduced motion. Regression tests also cover narrow layouts and automated accessibility across representative templates.

Every browser request outside the local preview origin is blocked. The Docling article therefore uses its fallback serif font rather than remote Google Fonts. Browser theme timing is lab evidence under these conditions, not a guarantee for every device or network.

## Corrections

- **Required:** remove intrinsic grid overflow in the archive, course and Docling article. Give shrinking grid columns and inputs explicit minimum sizing; keep long code locally scrollable.
- **Required:** underline prose links, include tabindex targets in visible-focus styling, and make the Docling code regions keyboard-focusable.
- **Required:** enlarge carousel pagination buttons to 24 by 24 pixels and expose the selected item with aria-current.
- **Required:** use Shiki's bundled github-dark-high-contrast palette to correct low-contrast comments without changing code text.
- **Required:** place Docling status badges on the semantic surface so their text meets contrast thresholds in both themes.
- **Recommended:** reduce the small-screen header wordmark size so the menu control fits beside it.

The Docling source has exactly 12 markup additions: tabindex="0" on 11 pre elements and the comparison table. Each edit was checked by reversing the exact markup addition and comparing with the prior source. Only that file's source hash in the preservation manifest was updated. Article prose, code text, original public CSS, media, narration and URLs were preserved. No general baseline regeneration was used.

## Reproduce

Run npm ci and npm run check first. On Windows, the browser configuration uses installed Microsoft Edge by default. Elsewhere, install the matching Chromium with npx playwright install chromium. PLAYWRIGHT_CHANNEL can override the browser channel.

Run npm run test:browser. Its webServer starts a local production preview through Astro's preview API and stops it after testing; it can reuse an existing local preview outside CI. Reports and failure traces go to ignored playwright-report and test-results/playwright directories.

For the wider screenshot/layout matrix, start npm run preview on 127.0.0.1:4321, then run npm run test:browser:review. Set BROWSER_BASE_URL to the local origin if the preview uses another port. Results and screenshots go to ignored test-results/theme-review. The diagnostic exits unsuccessfully on detected overflow, runtime errors or axe violations. Stop the preview afterward. These browser commands are separate from the existing CI check command.

The production check passed 22 Node tests, the 723-page build and preservation validation for 725 HTML routes, 208 articles, 373 original public assets and 14 redirects. The 49 recorded reference issues remain visible with no new issues.

## Remaining acceptance work

- **Required before release:** manual screen-reader and zoom review, wider template/control-state coverage, and font/layout-stability checks. Decrypted protected content was not exercised.
- **Required in the performance phase:** Lighthouse/waterfall and field performance evidence. This run does not establish LCP, INP or CLS targets.
- **Recommended:** Firefox and Safari coverage and browser-test CI integration after provisioning the matching browser.
- **Optional:** additional screenshot baselines once the shell design is settled.

No newsletter submission, audio generation, real audio playback, production networking or GitHub-hosted CI execution was part of this verification.

## September 16 continuation

Reviewed the saved report and existing uncommitted changes before editing. A fresh baseline `npm run check` passed. All work remains local; nothing was committed or deployed.

The new short-viewport keyboard test reproduced an offscreen control at 284.92 px in a 256 px-high viewport. The header now scrolls within the viewport, closes when keyboard focus leaves it, and retains Escape focus return. Below 481 px viewport height, the header is no longer sticky, allowing an enlarged header to scroll out of the reading area. No-JS navigation stays in normal document flow, so its expanded links cannot remain pinned over the page. The skip link was independently checked to move focus into `main-content`.

Additional text enlargement exposed intrinsic sizing problems. Shared text now allows emergency word wrapping that contributes to minimum sizing; the wordmark can shrink/wrap; newsletter inputs and interest items can shrink; and channel actions, newsletter eyebrow text and About links can wrap. Article bodies, URLs, narration, original assets and preservation manifests were not edited.

`tests/browser/shell.spec.mjs` adds short-height keyboard reachability, Tab exit/Escape state, skip-link focus, and 200% root-text enlargement at widths 320 and 640 across home/start/path index/course index/project index/channel index/about/contact. Enlarging the CSS root text and reducing the viewport are diagnostic checks, not actual browser zoom or screen-reader acceptance.

The Astro Fonts evaluation is saved in [Font evaluation](FONT-EVALUATION.md), with raw measurements and candidate configuration. The candidate preserved loaded H1 geometry and font bytes but regressed controlled fallback shifts in five of six views. The experiment was reverted to the exact pre-experiment font configuration, layout and imports. Current Fontsource delivery remains active.

Final validation: `npm run check` passed all 22 Node tests, the 723-page build, and preservation for 725 HTML routes, 208 articles, 373 original assets and 14 redirects. The same 49 reference issues remain, with no new failures. All 28 Playwright tests passed across desktop/mobile projects in 1.9 minutes, including the existing both-theme axe coverage and the six new project/test combinations. The final browser run used a separately managed local preview with the same Playwright projects/tests and a temporary configuration disabling only automatic webServer management. The preview was stopped afterward. `git diff --check` and syntax checks for both new scripts passed. Normal-size desktop and enlarged-text mobile screenshots were visually inspected. These checks do not close the manual acceptance items below.

### Manual acceptance history

**User acceptance, September 16:** after receiving the manual Edge zoom, keyboard and Narrator checklist below, the site owner reported "passed. very nice" and subsequently authorized publishing this checkpoint. This is user-reported acceptance, not an agent-observed screen-reader session or a claim of full-site WCAG conformance. It closes the representative manual checklist for this checkpoint. Wider release acceptance and performance work remain open.

The Computer Use browser launch returned `Computer Use app approval timed out`. No native browser zoom or screen-reader session was completed. The following remains open, and must not be inferred from axe or Playwright results:

| Check | Procedure | Accept when |
| --- | --- | --- |
| Browser zoom | In Edge at 200% and 400%, use home, course, article, archive, channel and contact pages; open the menu and tab through it. | Content reflows, controls remain readable/reachable, and focus is not hidden behind the header. Wide code/tables may scroll locally. |
| Keyboard review | Tab from the browser into the skip link; activate it; traverse menu/theme/search, forms, TOC, FAQ and code/table regions; use Escape. | Focus is visible and logical; no keyboard traps; closing navigation returns focus appropriately. |
| Screen reader | Use an installed NVDA or Narrator with Edge; traverse landmarks/headings and announce menu state, current navigation, theme options and form labels. | Names, roles, selected/expanded states and reading order are meaningful; closed menu links are not exposed. |
| Content controls | Read an article with TOC/FAQ/carousel and the Docling page. Check protected content only through an authorized unlock session. | Disclosure state, carousel selection, code/table access and article reading order remain understandable. |

Do not submit newsletter forms during acceptance. Repeat controls in light and dark themes. Wider image/layout stability, real Docling font delivery and release performance evidence remain open. Navigation regrouping is the next separate change after this checkpoint, retaining Fontsource while its alternative is investigated.
