# DoctorsWhoCode.blog — Roadmap & Status
**Updated: March 18, 2026 — 7:00 PM**

---

## Site Status: LIVE
- **URL:** https://www.doctorswhocode.blog
- **Stack:** Astro 4.x + MDX + Tailwind CSS + Vercel
- **Repo:** https://github.com/chukwumaonyeije/ModernDoctorsWhoCode
- **Posts:** 96 migrated from WordPress

---

## Completed This Session (03/18/26)

### Content & Posts
- [x] Fixed frontmatter on `fhir-practical-interoperability.mdx` — now live on site
- [x] Published FHIR Playbook post with cover image and FHIR slideshow iframe
- [x] Added 4 targeted links in FHIR post (FGRManager x2, fhirclient npm, SMART on FHIR spec)
- [x] Updated `skill-loss-wrong-fear.mdx`: 88% stat bold, underlined, linked to AMA source
- [x] Added hero images to 6 posts: ai-tools-fail, ai-scribes-failing, doctors-learn-code-2026, fix-prior-auth, vibe-coding-clinicians, clinicalscratchpad
- [x] Marked 3 new cornerstone posts as featured: ICU/Marathon, FGRManager, Why AI Tools Fail
- [x] Fixed category on FGRManager post (Blogging → Physician Development)
- [x] Fixed category on Clinical Scratchpad post (Blogging → Physician Development)

### Homepage
- [x] Featured = most recent post; recent = next 5 posts
- [x] "Read the Blog" button as 6th grid cell on desktop
- [x] Second "Read the Blog" in hero (both remain)

### Components & Layout
- [x] Replaced Beehiiv iframe with DWC-styled native newsletter form (navy/blue/mono)
- [x] Newsletter form added to About page and every post page (PostLayout)
- [x] Related posts section on every post (3 posts by shared tag match)
- [x] Auto reading time computed from word count (200 wpm) — all 96 posts
- [x] Share bar upgraded: styled pills, added Bluesky, added Copy Link (flashes cyan)
- [x] Tag pages built (`/tags/[tag]`) — all tag pills now resolve, no more 404s
- [x] AudioPlayer.astro component built (play/pause, scrubable progress bar)
- [x] audioUrl field added to content schema

### About Page
- [x] Newsletter form at bottom
- [x] Bluesky social link added

### Infrastructure
- [x] Vercel Analytics enabled (zero-config script in BaseLayout)
- [x] OG image fallback fixed — all 88 posts without hero images now use branded og-default.jpg
- [x] Branded og-default.jpg created and deployed
- [x] Google Search Console submitted (done by user)
- [x] WordPress decommission reminder set for April 8, 2026

---

## Completed Previously
- [x] Full Astro site shell: BaseLayout, PostLayout, all pages, all components
- [x] Design system: dark navy, purple-to-cyan gradients, Syne/DM Sans/JetBrains Mono
- [x] Blog index: inline search, tag filtering, horizontally scrollable tag row
- [x] Post pages: gradient h1, enhanced author block, tag pills, JSON-LD schema, OG tags
- [x] AI discovery files: llms.txt, ai.txt, robots.txt
- [x] Auto-generated sitemap + RSS feed
- [x] vercel.json 301 redirects preserving WordPress SEO equity
- [x] DNS cutover complete
- [x] 96 posts migrated from WordPress

---

## NEXT SESSION — Start Here

### IMMEDIATE: ElevenLabs Audio Batch (half done)
- [x] OpenAI TTS script built and tested (`scripts/generate_audio.py`)
- [x] Test MP3 generated and confirmed — sounds great (onyx voice)
- [x] 1 post already has audio: `a-look-into-the-future...`
- [ ] **Run full batch:** `python scripts/generate_audio.py` (95 posts remaining)
- [ ] Commit all MP3s + updated frontmatter → push to GitHub
- [ ] Confirm audio player appears on live site

### Priority 2 — Content & SEO
- [ ] Hero images for remaining 78 posts (18 done, 78 to go)
- [ ] Featured post curation — 9 featured posts currently, review if more needed

### Priority 3 — Infrastructure
- [ ] WordPress decommission — CHECK AFTER April 8, 2026
  - Confirm GSC shows Vercel pages indexed
  - Verify 301 redirects working
  - Cancel Hostinger hosting (keep domain registration)
- [ ] OG image — generate a proper branded 1200x630 card to replace the placeholder

### Priority 4 — Growth
- [ ] Beehiiv subscriber audit — confirm form submissions landing in dashboard
- [ ] Track D: guest posts, backlinks, ACOG/SMFM mentions

---

## Notes
- OpenAI TTS: `onyx` voice, `tts-1` model, ~$0.015/1K chars (~$16 total for all 96 posts)
- Audio player renders automatically on any post with `audioUrl` in frontmatter
- `.env` has both ELEVENLABS (unused) and OPENAI_API_KEY — only OpenAI is active
- 9 posts currently marked `featured: true`
- 18 posts have hero images; 78 still using og-default.jpg fallback
