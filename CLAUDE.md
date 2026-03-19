# CLAUDE.md — ModernDoctorsWhoCode

This file configures Claude Code's behavior for this project. Last updated: March 2026

---

## WHO I AM

I am Chukwuma Onyeije, MD, FACOG — a Maternal-Fetal Medicine specialist, physician-developer, theologian, and endurance athlete.

Do not repeat my background back to me. Treat every session as a continuation of long-term collaboration. Skip re-introductions.

---

## THIS PROJECT

**What it is:** A ground-up rebuild of DoctorsWhoCode.blog as a modern static site, replacing a headless WordPress + Next.js setup.

**Live domain:** https://www.doctorswhocode.blog
**Old stack:** Headless WordPress (Hostinger) + Next.js — being decommissioned
**New stack:** Astro 4.x + MDX + Tailwind CSS + Vercel
**Repo:** ModernDoctorsWhoCode

**Why the rebuild:** Eliminate CMS/plugin complexity, improve performance, SEO, LLM discoverability, and developer experience. Physician-built, physician-controlled.

---

## TECH STACK

| Layer | Technology |
|---|---|
| Framework | Astro 4.x |
| Content | MDX (Markdown + JSX) |
| Styling | Tailwind CSS |
| Components | Astro components + React where needed |
| Deployment | Vercel |
| Version control | GitHub |
| Fonts | Syne (display) + DM Sans (body) + JetBrains Mono (code/labels) |

**My broader stack (other projects):**
- Python (primary), TypeScript/JavaScript
- FastAPI, n8n (workflow automation)
- Anthropic Claude API (primary AI), OpenAI (secondary)
- PostgreSQL (production), Notion (personal data)
- Hostinger VPS, Azure Static Web Apps, GitHub Actions

---

## DESIGN SYSTEM

### Color Tokens
```css
--dwc-navy:   #0d1b2a   /* primary background */
--dwc-blue:   #1a6fc4   /* primary action/link */
--dwc-cyan:   #38bdf8   /* accent, labels, highlights */
--dwc-white:  #f8fafc   /* primary text */
--dwc-muted:  #94a3b8   /* secondary text */
--dwc-border: #1e293b   /* card/section borders */
--dwc-card:   #111827   /* card backgrounds */
```

### Typography
```css
--font-display: 'Syne', sans-serif        /* headings, hero */
--font-body:    'DM Sans', sans-serif     /* body, UI */
--font-mono:    'JetBrains Mono', mono    /* code, labels, tags */
```

### Design Aesthetic
- Dark navy theme throughout
- Cyan accent on interactive elements and labels
- Cards with subtle borders that glow blue on hover
- Monospace font for all metadata (dates, tags, labels, category)
- Generous whitespace, clean grid layouts
- Animated pulsing dot for "live" indicators
- Hover: `translateY(-2px)` + border color shift on all cards

---

## PROJECT STRUCTURE

```
ModernDoctorsWhoCode/
├── src/
│   ├── content/
│   │   ├── config.ts              ← Content collection schema
│   │   └── posts/                 ← All blog posts as .mdx files
│   │       └── _template.mdx      ← Post template
│   ├── pages/
│   │   ├── index.astro            ← Homepage
│   │   ├── about.astro            ← About Dr. Onyeije
│   │   ├── contact.astro          ← Contact / newsletter
│   │   ├── blog/
│   │   │   ├── index.astro        ← Blog index with tag filtering
│   │   │   └── [slug].astro       ← Individual post page
│   │   └── tags/
│   │       └── [tag].astro        ← Posts by tag
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── AuthorBio.astro
│   │   ├── Callout.astro
│   │   ├── TableOfContents.astro
│   │   └── NewsletterForm.astro   ← Beehiiv embed
│   └── layouts/
│       ├── BaseLayout.astro       ← HTML shell, head, nav, footer
│       └── PostLayout.astro       ← Blog post layout with TOC sidebar
├── public/
│   ├── llms.txt                   ← AI discovery file
│   ├── ai.txt                     ← AI permissions file
│   ├── robots.txt
│   └── images/
│       ├── og-default.jpg
│       └── posts/
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## CONTENT SCHEMA

Every post frontmatter must include:

```typescript
title: z.string()
description: z.string()
pubDate: z.coerce.date()
updatedDate: z.coerce.date().optional()
author: z.string().default('Chukwuma Onyeije, MD, FACOG')
authorUrl: z.string().default('https://www.linkedin.com/in/chukwumaonyeije')
tags: z.array(z.string()).default([])
category: z.string().default('Technology')
image: z.object({ url, alt }).optional()
draft: z.boolean().default(false)
featured: z.boolean().default(false)
readingTime: z.number().optional()
canonical: z.string().optional()
```

---

## SEO REQUIREMENTS

Every page must include:
- `<title>{title} | Doctors Who Code</title>`
- `<meta name="description">`, `<meta name="author">`
- `<link rel="canonical">`
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card: `summary_large_image`, `@chukwumaonyeije`
- JSON-LD Article schema on every post (author: Chukwuma Onyeije, MD, FACOG)

**LLM/AI optimization:**
- `/public/llms.txt` — brand identity and content summary for AI crawlers
- `/public/ai.txt` — AI crawler permissions
- `/public/robots.txt` — standard + AI bot rules
- FAQ sections in posts target LLM retrieval
- Link to ACOG, SMFM, PubMed in every clinical post

---

## AUTHOR IDENTITY (use in all schema)

```json
{
  "@type": "Person",
  "name": "Chukwuma Onyeije, MD, FACOG",
  "jobTitle": "Maternal-Fetal Medicine Specialist",
  "honorificPrefix": "Dr.",
  "honorificSuffix": "MD, FACOG",
  "worksFor": "Atlanta Perinatal Associates",
  "knowsAbout": ["Maternal-Fetal Medicine", "AI in Healthcare", "Physician-Developer Tools"],
  "url": "https://www.linkedin.com/in/chukwumaonyeije"
}
```

---

## COMPONENT SPECS

- **Callout.astro** — `type`: 'clinical' | 'technical' | 'warning' | 'note'. Clinical = teal border, Technical = blue border.
- **AuthorBio.astro** — No props. Always renders Dr. Onyeije bio with photo, credentials, LinkedIn link.
- **TableOfContents.astro** — Props: `headings` from Astro's `getHeadings()`. Sticky sidebar on desktop, collapsible on mobile.
- **NewsletterForm.astro** — Beehiiv embed. Replace `BEEHIIV_EMBED_URL` with actual embed URL.

---

## CODE STYLE

- Modular, readable over clever
- Always include error handling
- Add docstrings/JSDoc to functions
- Environment variables for all secrets — never hardcode
- Prefer explicit typing in TypeScript
- Comment the "why," not just the "what"
- HIPAA considerations must be called out explicitly in any patient-data code (not relevant to this project but applies across all my work)

---

## WRITING VOICE (enforce in all content files)

- No em-dashes (—) anywhere
- No AI filler phrases: "delve," "certainly," "absolutely," "it's worth noting," "in the realm of," "leverage," "utilize," "great question"
- No excessive hedging — I am a physician and researcher; direct claims are fine
- First-person active voice
- Short paragraphs (2-4 sentences max)
- Direct declarative statements
- Authentic human-sounding tone
- Flag any draft that sounds AI-generated
- SEO-optimized with E-E-A-T signals: Experience, Expertise, Authoritativeness, Trustworthiness

---

## WORDPRESS MIGRATION (when ready)

- Export via: WordPress → Tools → Export → All Content → XML
- Convert with: `npx wordpress-export-to-markdown`
- After conversion: rename `.md` to `.mdx`, add missing frontmatter, clean WordPress shortcodes
- Do NOT migrate content until the site shell is fully working locally

---

## DEPLOYMENT

- GitHub → Vercel (Astro framework preset)
- Build command: `npm run build` / Output: `dist`
- Custom domain: doctorswhocode.blog → Vercel nameservers
- `vercel.json` redirects to preserve SEO equity from old WordPress URLs

---

## AUDIO NARRATION

Every published post must have an audio version. This is a standing rule.

**Script:** `python -X utf8 scripts/generate_audio.py`
- Skips posts that already have `audioUrl` in frontmatter
- Safe to run after any new post — only processes new ones
- MP3s saved to `public/audio/{slug}.mp3`
- `audioUrl` frontmatter added automatically

**Provider (set in `.env`):**
```
AUDIO_PROVIDER=openai      # default — OpenAI tts-1, onyx voice, ~$0.06/post
AUDIO_PROVIDER=elevenlabs  # Daniel voice (ZMK5OD2jmsdse3EKE4W5) — requires paid plan
AUDIO_PROVIDER=custom      # reserved for own voice clone
```

**Workflow for new posts:**
1. Write and publish the post
2. Run `python -X utf8 scripts/generate_audio.py`
3. Commit the new MP3 and updated frontmatter together

**To switch providers:** Change `AUDIO_PROVIDER` in `.env` — the script checks this before each run. Do NOT remove existing `audioUrl` fields unless regenerating intentionally.

---

## WHAT I DO NOT WANT

- Do not summarize my background at the start of sessions
- Do not over-explain clinical concepts I already know
- Do not use em-dashes
- Do not produce content that sounds AI-generated
- Do not add unnecessary caveats to health content — I am a physician
- Do not suggest vendor AI tools when physician-built alternatives exist
- Do not proceed to content migration until the site shell works locally

---

*This CLAUDE.md governs all Claude Code sessions in this project. Update it as the project evolves.*
