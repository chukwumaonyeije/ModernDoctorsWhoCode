# Doctors Who Code Design System

Status: Complete
Date: 2026-08-23
Implementation status: Additive tokens only. No visual change to any shipped page.

## Outcome

This is Redesign 2.0 Phase 2. It documents the design system that already exists in `src/styles/global.css` and component-scoped styles, names the tokens that were implicit, and records where actual usage has drifted from a clean scale. It follows the structural model the Redesign 2.0 brief cites (GitHub Primer Foundations, Vercel Geist): name the system, then let components converge onto it over time rather than rewriting everything at once.

The only code changes in this phase are additive CSS custom properties in `:root` and the removal of one dead file (`src/layouts/BlogPost.astro`, an unused legacy layout with zero imports that referenced an undefined `--box-shadow` variable). No component was rewritten to consume the new tokens; that convergence happens naturally as later phases touch each component.

## Color

Defined in `src/styles/global.css`. Dark-only by decision (see `docs/redesign-2.0-plan.md`).

| Token | Value | Role |
| --- | --- | --- |
| `--dwc-navy` | `#0a0d1a` | Page background |
| `--dwc-card` | `#0f1219` | Card and input surface |
| `--dwc-border` | `#1a1f2e` | Card, input, and rule borders |
| `--dwc-white` | `#f8fafc` | Primary text |
| `--dwc-muted` | `#94a3b8` | Secondary text |
| `--dwc-blue` | `#1a6fc4` | Hover state on links and card borders |
| `--dwc-cyan` | `#38bdf8` | Primary interactive color, labels, accents |
| `--dwc-purple` | `#a855f7` | Gradient accent only (`--gradient`) |

Measured contrast (from the Stage 5 audit, still valid — no color values changed since):

| Pair | Ratio | WCAG AA (4.5:1 text / 3:1 UI) |
| --- | ---: | --- |
| White on navy | 18.49:1 | Pass |
| Muted on navy | 7.55:1 | Pass |
| Muted on card | 7.31:1 | Pass |
| Cyan on navy | 9.03:1 | Pass |
| Navy on cyan (buttons) | 9.03:1 | Pass |

Any new component that introduces a *new* color pairing (not in this table) needs its own contrast check before shipping.

## Typography

| Token | Value | Use |
| --- | --- | --- |
| `--font-display` | Syne | Headings, hero |
| `--font-body` | DM Sans | Body copy, UI |
| `--font-mono` | ui-monospace stack | Labels, metadata, code, buttons |

Sizes are fluid (`clamp()`), not a fixed step scale, and already meet the brief's targets (mobile body 17px, desktop up to 19px, matching `--font-size-body`):

| Token | Range |
| --- | --- |
| `--font-size-label` | 0.72rem &rarr; 0.78rem |
| `--font-size-meta` | 0.8125rem &rarr; 0.9375rem |
| `--font-size-control` / `--font-size-button` | ~0.875rem &rarr; 1rem |
| `--font-size-body` | 1rem &rarr; 1.0625rem |
| `--font-size-body-lg` | 1.0625rem &rarr; 1.1875rem |
| h6 &rarr; h1 | 1rem &rarr; 2.75rem, each its own `clamp()` |

Line-height: body 1.72 (1.68 under 720px), prose 1.82 (1.76 under 720px), headings 1.12. Reading measure: `--measure-content: 70ch` (66ch under 900px).

## Spacing

Two scales, by design, doing two different jobs:

**Layout rhythm (fluid, already existed):**

| Token | Range | Use |
| --- | --- | --- |
| `--space-page-x` | 1rem &rarr; 1.5rem | Page horizontal padding |
| `--space-page-y` | 2rem &rarr; 3rem | Page vertical padding |
| `--space-section` | 2.5rem &rarr; 4rem | Gap between major sections |

**Component spacing (discrete, added this phase):** an audit of every `gap`/`padding` declaration in the codebase found values clustering almost exactly on a 0.25rem step, with a handful of off-grid outliers (0.35rem, 0.45rem, 0.55rem, 0.65rem, 0.85rem — 8 uses total). The scale below names the on-grid values already in majority use; it doesn't require touching the outliers, but new work should use these tokens instead of another one-off value.

| Token | Value | px |
| --- | --- | --- |
| `--space-1` | 0.25rem | 4 |
| `--space-2` | 0.5rem | 8 |
| `--space-3` | 0.75rem | 12 |
| `--space-4` | 1rem | 16 |
| `--space-5` | 1.25rem | 20 |
| `--space-6` | 1.5rem | 24 |
| `--space-8` | 2rem | 32 |
| `--space-10` | 2.5rem | 40 |
| `--space-12` | 3rem | 48 |

## Radius

An audit of every `border-radius` declaration found 21 distinct values in active use, from `0.35rem` to `18px`, most of it accidental drift rather than a deliberate scale. Two values dominate by a wide margin and are treated as the real system; the rest is named as debt.

| Token | Value | Actual current usage | Role |
| --- | --- | --- | --- |
| `--radius-sm` | 0.375rem (6px) | 1 use | Small chips, tight controls |
| `--radius-md` | 0.625rem (10px) | 13 uses at the equivalent `12px` | Code blocks, inputs, tighter surfaces |
| `--radius-lg` | 1rem (16px) | 26 uses | Cards — this is the de facto card radius already |
| `--radius-full` | 999px | 19 uses | Pills, tags |
| (circular) | `50%` | 7 uses | Avatars, dots — stays a literal, no token needed |

Debt not folded into a token this phase (no component was touched to avoid scope creep): one-off values at `4px, 6px, 8px, 10px, 14px, 16px, 18px`, and `0.35rem` through `0.8rem` in various components. As these components are touched in later phases (5 through 8), replace the local value with the nearest token above rather than re-deriving a new one-off.

## Surfaces and shadows

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-sm` | `0 4px 16px rgba(0,0,0,0.18)` | Named for consistency; not yet used anywhere — available for small floating elements (dropdowns, tooltips) added in later phases |
| `--shadow-md` | `0 18px 54px rgba(0,0,0,0.24)` | Matches the existing homepage panel shadow |
| `--shadow-lg` | `0 24px 70px rgba(0,0,0,0.24)` | Matches the existing hero-art shadow (a near-duplicate `0 24px 60px rgba(0,0,0,0.28)` also exists — treat as the same role, converge to `--shadow-lg` when that component is next touched) |
| `--shadow-glow-cyan` | `0 0 18px rgba(56,189,248,0.4)` | The cyan focus/accent glow used on one interactive element |

Card surface pattern (`.card` in `global.css`, already consistent): `background: var(--dwc-card); border: 1px solid var(--dwc-border); border-radius: 12px;` with a `translateY(-2px)` + border-color-to-blue hover shift. This is the pattern every `*Card.astro` component should match.

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--duration-base` | 0.2s | The value used in the overwhelming majority of transitions already (colors, transforms, hovers) |
| `--duration-fast` | 140ms | One deliberate exception (a card's combined transform/border/background transition) — kept as its own token rather than folded into base, since it reads as an intentional choice, not drift |
| `--ease-standard` | `ease` | Every transition in the codebase already uses this |

All motion already respects `prefers-reduced-motion` globally (`global.css`, `@media (prefers-reduced-motion: reduce)`), which forces all animation/transition durations to near-zero. Nothing new needed here.

## Component patterns

These are the shared primitives already in `global.css`, unchanged this phase, documented here so new components reuse them instead of reinventing:

- **`.site-button`** — `--site-button--primary` (cyan fill) / `--site-button--secondary` (transparent, cyan text). Min height 2.75rem (44px touch target, matches the brief's target).
- **`.site-input`** — card background, bordered, same 2.75rem min height.
- **`.label`** — mono, uppercase, cyan, letter-spacing 0.08em. Used for all metadata/eyebrow text.
- **`.tag-pill`** — mono, cyan-on-cyan-tint, pill radius, hover state.
- **`.card`** — see Surfaces above.

## What this phase deliberately did not do

- Did not rewrite any component to consume the new tokens. The tokens exist and are documented; convergence happens as Phases 3-8 touch each component, per the phased plan.
- Did not resolve the 21-value radius or spacing-outlier debt beyond naming it. Fixing it everywhere at once would be a large, risky diff with no user-visible benefit on its own.
- Did not add a light theme. Dark-only remains the decision from Phase 0 planning.

## Verification

- `npm run build` — production build succeeds with the new tokens present and `BlogPost.astro` removed.
- Confirmed `BlogPost.astro` had zero references anywhere in `src` before deletion (`grep -rl` for the layout name and all plausible import paths).
- No existing component's rendered output changes: the new tokens are additive-only in `:root` and nothing in the codebase referenced the new token names before this change.
