# Design system

Updated September 16, 2026. Theme foundation and bounded reflow corrections are ready for the authorized checkpoint. The site owner reported the representative manual accessibility checklist passed; broader release acceptance remains separate.

## Semantic tokens

`src/styles/theme.css` owns the palettes. `src/styles/global.css` maps existing `--dwc-*` names to them so existing components retain their interfaces. New shared UI should use semantic tokens. `--dwc-text`, previously undefined in SeriesNav, now aliases the text token.

| Token | Light | Dark |
| --- | --- | --- |
| --color-background | #f8fafc | #0a0d1a |
| --color-surface | #ffffff | #0f1219 |
| --color-text | #142033 | #f8fafc |
| --color-muted | #475569 | #94a3b8 |
| --color-border | #64748b | #64748b |
| --color-accent | #03638c | #38bdf8 |
| --color-link-hover | #174ea6 | #80c7ff |
| --color-purple | #7540b4 | #c084fc |
| --color-success | #087765 | #2dd4bf |
| --color-warning | #925200 | #fbbf24 |

RGB variants support existing translucent accents and surfaces. Control/card radius and control spacing tokens complement the established fluid page/section spacing. Borders are intentionally stronger than the old dark-only decorative border to support control boundaries.

Base-palette tests verify text, muted, accent, hover, purple, success and warning against both background and surface at >=4.5:1, and borders at >=3:1. This does not establish contrast over every translucent gradient, historical inline style or image.

## Theme behavior

`src/scripts/theme.js` is inserted inline in BaseLayout's head before page content. It resolves `dwc-theme` as system/light/dark, applies the resolved root data attribute and color-scheme, and updates browser theme-color metadata. It uses no framework or client router. The native select in ThemePicker is added to the existing header. The responsive menu breakpoint and link gap accommodate the additional control without changing navigation destinations.

- System is the default. Operating-system changes apply while system is selected.
- Explicit light/dark choices persist in localStorage and take precedence over the system.
- Invalid values become system. Denied storage still permits an in-memory selection.
- Storage changes, including clearing storage in another tab, synchronize the choice.
- Without JavaScript, CSS follows the operating system, matching media-qualified theme-color metadata. The nonfunctional preference picker stays hidden and existing no-JS navigation remains available.
- Native select labeling and keyboard semantics are retained. Focus-visible styling now includes summary elements. Existing reduced-motion rules remain in place.

The script is tested by executing the actual source in a controlled DOM/storage/media fixture. Playwright now exercises first-frame theme application and representative layouts. Manual screen-reader and zoom acceptance remain open; see BROWSER-VERIFICATION.md.

## Component compatibility

Header, newsletter, curriculum cards, callouts and the existing React carousel now use semantic surfaces/accents rather than fixed shared dark surfaces. Scoped adapters map the Docling article palette and protected embed chrome without changing original public CSS. The subsequent browser pass added only keyboard-focus markup to the Docling source, documented in BROWSER-VERIFICATION.md.

Code remains on a dark code surface in either theme, using the bundled github-dark-high-contrast Shiki palette. Historical manually colored examples retain their text. Original images, standalone public slides and embedded presentations are not recolored. Historical article inline styles are preserved and require representative visual review; this foundation is not a claim that every authored fragment has been remediated.

Syne remains the display face, DM Sans the body face, and the mono stack uses local system fonts. Fontsource delivery, the 70ch prose measure and existing layout structure remain unchanged. The planned Astro Fonts evaluation is a separate required task with layout-stability verification; no font dependency was added here.

## Verification and remaining work

The suite now includes five theme tests for initialization, explicit/system preferences, storage failures, cross-tab updates and numeric base-palette contrast. Full build/preservation validation protects article bodies, rendered text/headings, canonical values, public routes, audio, originals and redirects. No general preservation manifest regeneration is used. The browser follow-up updates only the Docling source hash for verified tabindex additions.

**Browser follow-up:** explicitly authorized Playwright checks now cover representative desktop/mobile layouts, keyboard/focus behavior, both themes, no-JS rendering, reduced motion and first-frame theme application. See [Browser verification](BROWSER-VERIFICATION.md) for scope, results, fixes and limitations. Manual screen-reader, zoom and broader template acceptance remain required before release. Do not claim WCAG conformance from automated checks alone.

**September 16 follow-up:** the local Astro Fonts candidate passed build/preservation and matched final heading geometry, but its optimized fallbacks increased controlled font-swap shifts in five of six views. Current Fontsource delivery is retained. See [Font evaluation](FONT-EVALUATION.md) for measurements, configuration and reproduction steps. Typography acceptance remains open pending fallback tuning and wider checks.

**Required next foundation work:** complete manual screen-reader/browser-zoom acceptance and resolve the measured fallback regression before font adoption. Navigation regrouping belongs to the subsequent shell phase. The bounded header reachability correction is accessibility maintenance: short viewports can scroll the menu, Tab leaving the header closes it, and no-JS navigation remains in normal flow. **Optional:** alternate fonts or a native carousel replacement remain separate changes.
