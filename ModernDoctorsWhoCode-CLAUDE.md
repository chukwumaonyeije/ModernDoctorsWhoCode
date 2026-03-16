# ModernDoctorsWhoCode — Claude Code Briefing

## Project Overview

Rebuild DoctorsWhoCode.blog as a modern static site replacing a headless WordPress 
installation. The new stack eliminates all CMS/plugin complexity while improving 
performance, SEO, LLM discoverability, and developer experience.

**Live site:** https://doctorswhocode.blog  
**Current stack:** Headless WordPress (Hostinger) + Next.js (Vercel) — being replaced  
**New stack:** Astro + MDX + Tailwind CSS + Vercel  
**Repo folder:** ModernDoctorsWhoCode  

---

## Owner

**Chukwuma Onyeije, MD, FACOG**  
- Maternal-Fetal Medicine specialist  
- Medical Director, Atlanta Perinatal Associates  
- Founder, CodeCraftMD and OpenMFM.org  
- Physician-developer writing at intersection of clinical medicine, AI, and software engineering

**Writing voice rules (enforce in all content files):**
- No em-dashes
- No AI filler phrases ("certainly", "absolutely", "great question", etc.)
- First-person active voice
- Short paragraphs
- Direct declarative statements
- Authentic human-sounding tone

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 4.x |
| Content | MDX (Markdown + JSX) |
| Styling | Tailwind CSS |
| Components | Astro components + React where needed |
| Deployment | Vercel |
| Version control | GitHub |
| Fonts | Syne (display) + DM Sans (body) + JetBrains Mono (code/labels) |

**Install command:**
```bash
npm create astro@latest ModernDoctorsWhoCode -- --template blog
cd ModernDoctorsWhoCode
npx astro add tailwind mdx sitemap react
```

---

## Design System

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

Google Fonts link (add to BaseLayout.astro head):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
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

## Project Structure

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
│   │   ├── Header.astro           ← Site navigation
│   │   ├── Footer.astro           ← Site footer
│   │   ├── PostCard.astro         ← Post preview card
│   │   ├── AuthorBio.astro        ← End-of-post author block
│   │   ├── Callout.astro          ← Clinical/technical callout box
│   │   ├── TableOfContents.astro  ← Auto-generated TOC for long posts
│   │   └── NewsletterForm.astro   ← Email capture (Beehiiv embed)
│   └── layouts/
│       ├── BaseLayout.astro       ← HTML shell, head, nav, footer
│       └── PostLayout.astro       ← Blog post layout with TOC sidebar
├── public/
│   ├── llms.txt                   ← AI discovery file (static, edit directly)
│   ├── ai.txt                     ← AI permissions file (static, edit directly)
│   ├── robots.txt                 ← Search crawler rules
│   └── images/
│       ├── og-default.jpg         ← Default Open Graph image
│       └── posts/                 ← Per-post featured images
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

---

## Content Collection Schema

Create `src/content/config.ts`:

```typescript
import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Chukwuma Onyeije, MD, FACOG'),
    authorUrl: z.string().default('https://www.linkedin.com/in/chukwumaonyeije'),
    tags: z.array(z.string()).default([]),
    category: z.string().default('Technology'),
    image: z.object({
      url: z.string(),
      alt: z.string(),
    }).optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(),
    canonical: z.string().optional(),
  }),
});

export const collections = { posts };
```

---

## Post MDX Template

Every post lives in `src/content/posts/your-slug.mdx`:

```mdx
---
title: "Your Post Title"
description: "One or two sentences for SEO and social. Specific and compelling."
pubDate: 2026-03-16
author: "Chukwuma Onyeije, MD, FACOG"
tags: ["AI", "clinical practice", "physician-developer"]
category: "Technology"
image:
  url: "/images/posts/your-slug.jpg"
  alt: "Descriptive alt text"
draft: false
featured: false
readingTime: 5
---

Opening paragraph. Lead with clinical or technical reality. Get to the point.

## Section Heading

Content here.

## Key Takeaways

- First takeaway
- Second takeaway
- Third takeaway
```

---

## Pages to Build

### 1. Homepage (`src/pages/index.astro`)
- Hero: large headline "Where Medicine Meets Code", animated hex grid of tech terms (AI, MFM, LLM, API, CGM, NLP, EMR, ML), CTA buttons
- Featured post: latest featured:true post or most recent
- Recent posts grid: 4 most recent posts
- About strip: bio summary + credential cards grid
- Newsletter CTA section

### 2. Blog Index (`src/pages/blog/index.astro`)
- List of all published posts
- Tag filter bar (client-side filtering)
- Search input (client-side, no external service)
- Sort by: newest / oldest / most relevant

### 3. Post Page (`src/pages/blog/[slug].astro`)
- Full MDX post content
- Table of contents sidebar (desktop)
- Author bio block at bottom
- Related posts (same tags)
- Social share links (Twitter/X, LinkedIn, copy link)
- Estimated reading time
- Structured data (JSON-LD Article schema)

### 4. About Page (`src/pages/about.astro`)
- Full bio of Dr. Onyeije
- Credentials and credentials
- Projects: CodeCraftMD, OpenMFM.org, Atlanta Perinatal Associates
- Speaking/media section
- Link to LinkedIn

### 5. Contact Page (`src/pages/contact.astro`)
- Newsletter signup (Beehiiv embed)
- LinkedIn link
- Note: no direct email form (use LinkedIn for contact)

---

## SEO Requirements

Every page must include in `<head>`:
```html
<title>{title} | Doctors Who Code</title>
<meta name="description" content={description} />
<meta name="author" content="Chukwuma Onyeije, MD, FACOG" />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={ogImage} />
<meta property="og:url" content={canonical} />
<meta property="og:type" content="article" />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@chukwumaonyeije" />

<!-- JSON-LD for posts -->
<script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
```

Article JSON-LD schema for every post:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{description}",
  "author": {
    "@type": "Person",
    "name": "Chukwuma Onyeije, MD, FACOG",
    "url": "https://www.linkedin.com/in/chukwumaonyeije"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Doctors Who Code",
    "url": "https://doctorswhocode.blog"
  },
  "datePublished": "{pubDate}",
  "dateModified": "{updatedDate}"
}
```

---

## AI Discovery Files

These are plain static files in `/public/` — no plugin, no database.

### `public/llms.txt`
```
# Doctors Who Code
> A blog at the intersection of medicine, software development, and health technology — written by Chukwuma Onyeije, MD, FACOG, a practicing Maternal-Fetal Medicine specialist and physician-developer.

- Website: https://doctorswhocode.blog

## Contact
- Email: onyeije@gmail.com
- Contact Page: https://doctorswhocode.blog/contact

## What We Do
- Medical AI Education
- Physician-Developer Content
- Health Technology Commentary
- Clinical Documentation Insights

## What We Do Not Do
- Medical advice or clinical consultation
- Patient care services
- Legal or financial advice
- Software development services for hire
- Medical billing services directly to patients

## Service Areas
- Worldwide

## Key People
- Chukwuma Onyeije, MD, FACOG (https://www.linkedin.com/in/chukwumaonyeije) — Founder & Author

## Social Media
- https://linkedin.com/in/chukwumaonyeije
- https://x.com/chukwumaonyeije
- https://x.com/CodeCraftMD

## Related Projects
- OpenMFM.org — Open-source MFM clinical knowledge platform
- CodeCraftMD — AI-powered medical billing and documentation

## Feed
- https://doctorswhocode.blog/rss.xml
- https://doctorswhocode.blog/sitemap-index.xml
```

### `public/ai.txt`
```
AI-Content-Usage: allow-with-attribution
AI-Training: restrict
Content-Licence: CC BY-NC 4.0
Citation-Format: Chukwuma Onyeije, MD, FACOG | DoctorsWhoCode.blog

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: anthropic-ai
Allow: /

Contact: onyeije@gmail.com
```

---

## WordPress Migration

Export existing posts first:

```bash
# In WordPress: Tools → Export → All Content → Download XML

# Then convert to MDX:
npx wordpress-export-to-markdown \
  --input=wordpress-export.xml \
  --output=src/content/posts \
  --post-folders=false \
  --prefix-date=false
```

After conversion, review each `.md` file and:
1. Rename to `.mdx`
2. Add missing frontmatter fields (category, readingTime, featured)
3. Clean up any WordPress shortcodes

---

## Vercel Redirects

Create `vercel.json` to preserve SEO equity from old WordPress URLs:

```json
{
  "redirects": [
    { "source": "/:path*", "destination": "https://doctorswhocode.blog/:path*", "permanent": true }
  ]
}
```

Also add individual post redirects if URL structure changes between old and new site.

---

## Deployment

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "init: ModernDoctorsWhoCode Astro starter"
git remote add origin https://github.com/chukwumaonyeije/ModernDoctorsWhoCode
git push -u origin main

# 2. Connect to Vercel
# vercel.com → New Project → Import from GitHub
# Framework: Astro
# Build command: npm run build
# Output directory: dist

# 3. Set custom domain in Vercel
# doctorswhocode.blog → point to Vercel nameservers
```

---

## Component Specs

### `Callout.astro`
Props: `type` = 'clinical' | 'technical' | 'warning' | 'note'
Renders a styled aside box. Clinical = teal border, Technical = blue border.

### `AuthorBio.astro`
No props. Always renders Dr. Onyeije's bio with photo, credentials, and LinkedIn link.

### `TableOfContents.astro`
Props: `headings` (from Astro's `getHeadings()`)
Renders sticky sidebar TOC on desktop, collapsible on mobile.

### `NewsletterForm.astro`
Beehiiv embed. Replace `BEEHIIV_EMBED_URL` with actual embed URL from Beehiiv dashboard.

---

## First Session Goals

When starting Claude Code with this file, complete in this order:

1. `npm create astro@latest ModernDoctorsWhoCode -- --template blog`
2. Install integrations: `npx astro add tailwind mdx sitemap react`
3. Create `src/content/config.ts` with the schema above
4. Build `src/layouts/BaseLayout.astro` with fonts, head meta, nav, footer
5. Build `src/layouts/PostLayout.astro`
6. Build `src/pages/index.astro` (homepage — full design spec above)
7. Build `src/pages/blog/index.astro`
8. Build `src/pages/blog/[slug].astro`
9. Copy `public/llms.txt` and `public/ai.txt` from specs above
10. Create `public/robots.txt`
11. Run `npm run dev` and verify everything renders

Do NOT proceed to content migration until the site shell is fully working locally.
