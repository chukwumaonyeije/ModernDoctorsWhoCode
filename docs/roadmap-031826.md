# DoctorsWhoCode.blog — Roadmap & Status
**Updated: March 18, 2026**

---

## Site Status: LIVE
- **URL:** https://www.doctorswhocode.blog
- **Stack:** Astro 4.x + MDX + Tailwind CSS + Vercel
- **Repo:** https://github.com/chukwumaonyeije/ModernDoctorsWhoCode
- **Posts:** 96 migrated from WordPress

---

## Completed This Session (03/18/26)

- [x] Fixed frontmatter on `fhir-practical-interoperability.mdx` (pubDate, image object, readingTime as number)
- [x] Published FHIR Playbook post with cover image and slide deck iframe
- [x] Added 4 targeted links in FHIR post (FGRManager x2, fhirclient npm, SMART on FHIR spec)
- [x] Updated `skill-loss-wrong-fear.mdx`: 88% stat bold, underlined, linked to AMA source
- [x] Homepage: featured = most recent post; recent = next 5; "Read the Blog" as 6th grid cell
- [x] Replaced Beehiiv iframe with DWC-styled native newsletter form (navy/blue/mono)
- [x] Added newsletter form to About page
- [x] Added Bluesky social link to About page
- [x] **Tag pages** (`/tags/[tag]`): built dynamic tag page -- all tag pill links now resolve

---

## Completed Previously

- [x] Full Astro site shell: BaseLayout, PostLayout, all pages, all components
- [x] Design system: dark navy, purple-to-cyan gradients, Syne/DM Sans/JetBrains Mono
- [x] Homepage: hero, search bar, 4-stat strip, magazine featured post layout
- [x] Blog index: inline search, horizontally scrollable tag row, client-side tag filtering
- [x] Post pages: gradient h1, enhanced author block, tag pills, JSON-LD schema, OG tags
- [x] About page: headshot with gradient ring, social links (LinkedIn, X, Bluesky, CodeCraftMD)
- [x] AI discovery files: llms.txt, ai.txt, robots.txt
- [x] Auto-generated sitemap + RSS feed
- [x] vercel.json 301 redirects preserving WordPress SEO equity
- [x] DNS cutover: doctorswhocode.blog + www both on Vercel
- [x] 96 posts migrated; 8 posts with hero images

---

## Active Roadmap

### Priority 1 — Post Experience
- [ ] **Newsletter form in PostLayout** -- add signup after every post body (high conversion point)
- [ ] **Related posts section** -- 3 posts matched by shared tags, shown before author bio
- [ ] **Auto reading time** -- compute from word count (200 wpm) for all 96 posts; remove manual frontmatter dependency

### Priority 2 — Content & SEO
- [ ] **Hero images for remaining posts** -- 88 posts still missing cover images; batch-generate with AI
- [ ] **Google Search Console submission** -- submit sitemap, monitor indexing (Track C)
- [ ] **Featured post curation** -- mark 5-8 cornerstone posts as `featured: true` for future homepage variants

### Priority 3 — Audio (ElevenLabs)
Requires: ElevenLabs API key + voice selection
- [ ] Write Python batch script: reads each MDX, strips markdown, calls ElevenLabs API
- [ ] Save MP3s to `/public/audio/{slug}.mp3`, update frontmatter with `audioUrl`
- [ ] Add audio player component to PostLayout (renders only when `audioUrl` is set)
- Estimated cost: ~$99-198 (Pro/2 months) or $330 (Scale/1 month for all 96)

### Priority 4 — Growth & Distribution
- [ ] Beehiiv subscriber data audit -- confirm form submissions are landing in dashboard
- [ ] Social share buttons on post pages (X, LinkedIn, Bluesky, copy link)
- [ ] Track D: ongoing brand authority -- guest posts, backlinks, ACOG/SMFM mentions

### Priority 5 — Infrastructure
- [ ] WordPress decommission -- cancel Hostinger once traffic fully on Vercel (confirm in Search Console first)
- [ ] Vercel Analytics -- enable for traffic visibility
- [ ] OG image generation -- auto-generate `/og/{slug}.png` for posts without hero images

---

## Notes
- Hero search on homepage already works (redirects to `/blog?q=...`)
- Tag filtering on blog index is client-side and functional
- Beehiiv newsletter form uses client-side fetch with fallback redirect to hosted subscribe page
- All 96 posts are published (no drafts in build)
