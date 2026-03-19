---
audioUrl: /audio/pgis-when-medicine-endurance-and-code-collide-looking-for-collaborators.mp3
author: Chukwuma Onyeije, MD, FACOG
category: Healthcare Technology
description: I'm a maternalfetal medicine physician managing complex, high-risk pregnancies.
  I have long-standing type 2 diabetes. And right now, I'm training for m...
draft: false
pubDate: 2026-01-22
tags:
- continuous-glucose-monitoring
- diabetes-management-technology
- endurance-training-with-diabetes
- healthcare-technology-development
- medical-ai-systems
- physician-developer
title: 'PGIS: When Medicine, Endurance, and Code Collide — Looking for Collaborators'
---

## When Clinical Insight Meets Personal Stakes

I live at an unusual intersection.

I'm a maternal–fetal medicine physician managing complex, high-risk pregnancies. I have long-standing type 2 diabetes. And right now, I'm training for my second half-marathon in two years.

That combination creates a real, clinically relevant systems problem—one I face every morning when I lace up my running shoes:

> **How do we optimize glycemic control while building endurance capacity — without sacrificing either?**

Most people approach this with intuition. Some follow generic guidelines from their endocrinologist. A few track their data sporadically in spreadsheets.

I decided to approach it differently: **with instrumentation, data pipelines, and AI-driven decision loops**.

That's how **PGIS — the Performance Glycemic Intelligence System** was born.


## What PGIS Actually Does

PGIS isn't theoretical. It's a working system I use daily to navigate the complex interplay between glucose metabolism and athletic performance.

The system ingests and synchronizes:

- **Continuous glucose monitor data** (Dexcom G6)

- **Running and training metrics** (Garmin watch integration)

- **Strength and mobility session logs**

- **Nutrition inputs and timing**

- **Subjective readiness scores** (sleep quality, stress, recovery perception)

- **Stream on Consiousness notes.**

It then generates clinically structured outputs (see below)

- Daily performance artifacts with visual analytics

- Glycemic response narratives tied to specific training stimuli

- Training-readiness decisions based on metabolic stability

- Forward programming recommendations for the next 24-48 hours

If you've seen my recent PGIS reports, you know the system produces structured, clinically interpretable performance summaries. Each report includes:

- Session architecture breakdowns (warm-up, work blocks, cool-down)

- Heart-rate zone modeling with time-in-zone analysis

- Glucose stability curves correlated with exercise intensity

- Decision matrices for next-day programming adjustments

This is **medicine-grade reasoning applied to human performance optimization**, with code as the substrate and AI as the interpretive layer.


## Why This Extends Beyond Personal Experimentation

Here's what I've learned from building PGIS: this isn't just a quantified-self project.

It's a prototype for several critical use cases:

**For endurance athletes with diabetes**: Most training programs ignore metabolic disease entirely. PGIS models how to build aerobic capacity while maintaining glycemic stability—a problem affecting millions of runners, cyclists, and triathletes.

**For patients navigating metabolic disease**: The gap between "check your glucose" and "here's what to do about it" is enormous. PGIS demonstrates how continuous monitoring becomes actionable intelligence.

**For clinicians seeking physiologic dashboards**: We prescribe exercise constantly. We rarely see objective data on how our patients respond to it. PGIS creates a template for clinically relevant performance dashboards.

**For researchers exploring glycemic–exercise coupling**: Real-world data at individual resolution, captured continuously, analyzed systematically. That's rare in metabolic research.

The same pipeline interpreting my morning fasting glucose and threshold run today could help a patient understand how their evening walk affects nocturnal glycemic variability tomorrow.


## The Technical Architecture (Current State)

Building PGIS has been a crash course in systems engineering at the intersection of clinical medicine and software development.

The tech stack spans:

- **API integration and data normalization** (Dexcom API, Garmin Connect, manual logging interfaces)

- **Time-series data visualization** (matplotlib, plotly for clinical-grade charts)

- **Decision-rule encoding** (translating clinical heuristics into computable logic)

- **Prompt-driven clinical reasoning loops** (Claude API for narrative generation and interpretation)

- **AI-assisted rapid prototyping** (what I call "vibe coding"—using Warp.dev to accelerate development)

Claude handles the clinical narrative synthesis. Warp.dev manage boilerplate and data wrangling. I handle the domain modeling, clinical semantics, and decision architecture.

The learning curve has been steep. I'm not formally trained as a software engineer. But the intersection of clinical need and builder mentality creates powerful motivation.


## The Roadmap: Where PGIS Goes Next

The immediate development priorities:

**Phase 1: Formalized Scoring System**

- Create a composite PGIS score (Glucose stability × HR variability × Training load)

- Establish baseline ranges and alert thresholds

- Build trend analysis over weekly and monthly windows

**Phase 2: Full Automation**

- Direct API ingestion from Dexcom and Garmin (eliminating manual data entry)

- Automated daily report generation

- Rule-based training recommendations (rest, easy, threshold, long run)

**Phase 3: User Interface**

- Web dashboard front-end (React/Next.js)

- Mobile-responsive design for on-the-go access

- Interactive data visualization with drill-down capability

**Phase 4: Data Architecture**

- Secure personal health data vault (HIPAA-aware design principles)

- Exportable data formats for clinical sharing

- Privacy-first architecture (local-first, encrypted sync)

At that point, PGIS stops being a collection of artifacts and becomes a **continuous intelligence loop**—a system that learns, adapts, and recommends based on accumulating evidence.

[PGIS\_Performance\_Durability\_Report](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/01/PGIS_Performance_Durability_Report.pdf)[Download](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/01/PGIS_Performance_Durability_Report.pdf)


## Why I'm Opening This to Collaboration

I've reached an inflection point with PGIS.

The clinical concept is validated. The technical foundation is laid. The daily use case is proven.

But scaling this beyond my personal use requires expertise I'm still building. That's why I'm opening this project to **collaboration**.

### Who I'm Looking For

**Front-end engineers** (React / Next.js / data visualization libraries)  
If you've built health dashboards or data-dense interfaces, you understand the challenge: medical data is complex, but the UI needs to feel intuitive.

**Backend developers** (FastAPI / Node / data pipeline architecture)  
The challenge isn't just moving data—it's normalizing, validating, and securing health information at scale.

**Data scientists** (time-series modeling, machine learning)  
The patterns in glucose-exercise coupling are complex. Better models mean better recommendations.

**UX designers** (health and fitness dashboard experience)  
How do you communicate clinical intelligence without overwhelming the user? That's the design challenge.

**Clinicians or exercise physiologists**  
Domain expertise shapes every decision in this system. If you work in endocrinology, sports medicine, or exercise physiology, your input is invaluable.

### What Collaboration Looks Like

This is a **side project with serious purpose**. I'm not expecting 40-hour work weeks. I am expecting:

- Shared commitment to building something translational

- Respect for health data privacy and security

- Willingness to work in the open (open-source aspirations once stable)

- Excitement about the intersection of medicine, physiology, AI, and code

If you're someone who sees the potential in physician-led technology development, let's talk.


## How to Get Involved

If this resonates, here's how to reach me:

- **[LinkedIn](https://www.linkedin.com/in/chukwumaonyeije/)**: Connect with me directly (Chukwuma Onyeije, MD)

- **[Email](chukwuma@doctorswhocode.blog)**: Through the Doctors Who Code contact form

- **[This blog](https://www.doctorswhocode.blog/contact)**: Comment directly on this post

I'm happy to share:

- Current repo preview (private GitHub, access granted to collaborators)

- Data schemas and architecture documentation

- Technical roadmap with prioritization

- Example PGIS reports to understand the output format


## A Closing Reflection on Physician-Builders

Here's a line that came from one of my PGIS artifacts, generated by AI summarizing my training approach:

> _You are training like someone optimizing for decade-scale durability._

That struck me because it's true—not just for my running, but for my career in medicine.

I'm building PGIS because I believe the physicians of the next decade won't just _prescribe_ technology. We'll _create_ it.

We'll understand code as a clinical tool. We'll design systems that close the gap between data and decisions. We'll prototype solutions to problems we encounter every day in clinical practice.

That's the future I'm training for. **If that resonates, come build with me.**


**About the Author:**

**Chukwuma Onyeije, MD** is a maternal-fetal medicine specialist and Medical Director at Atlanta Perinatal Associates, where he manages high-risk pregnancies and complex obstetric cases. He is the founder of CodeCraftMD (AI-powered medical billing) and Doctors Who Code, a platform exploring the intersection of clinical medicine and software development. He lives in Atlanta with his wife and serves as an elder at Atlanta North Seventh-day Adventist Church.

_Credentials: Board-certified in Maternal-Fetal Medicine | 20+ years clinical experience | Active medical license, State of Georgia_


**Related Articles:**

- [GitHub AI Projects for Physicians:](https://www.doctorswhocode.blog/blog/github-ai-projects-for-physicians-a-comprehensive-guide-to-getting-started-with-medical-ai-development) A Comprehensive Guide to Getting Started with Medical AI Development

- [How Doctors Learn to Code in 2026:](https://www.doctorswhocode.blog/blog/how-doctors-learn-to-code-2026-ai-guide) Why the New Path Beats Tutorials, Bootcamps, and YouTube Overload

- [The Scalpel and the Algorithm](https://www.doctorswhocode.blog/blog/the-scalpel-and-the-algorithm-a-new-era-for-physicians) – A New Era for Physicians

**Share This Post:** If you know someone interested in health technology, physician-led innovation, or diabetes management, share this post with them.


**Disclaimer:** PGIS is a personal performance optimization system and is not intended to replace medical advice, diagnosis, or treatment. Always consult with qualified healthcare providers regarding medical decisions. The system architecture and methods described are for educational and collaborative purposes.


**Keywords:** physician developer, diabetes management technology, continuous glucose monitoring, endurance training with diabetes, medical AI systems, healthcare technology development, quantified self medicine