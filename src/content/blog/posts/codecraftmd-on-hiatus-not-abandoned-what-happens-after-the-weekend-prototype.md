---
title: "CodeCraftMD on Hiatus, Not Abandoned: What Happens After the Weekend Prototype"
pubDate: 2026-01-18
category: "Healthcare Technology"
tags: 
- "doctors-who-code"
- "healthcare-automation"
- "medical-technology"
author: "Chukwuma Onyeije, MD, FACOG"
draft: false

description: "It was 11:47 PM on a Saturday night, and I was staring at my EMR screen trying to remember whether 'threatened abortion' was O20.0 or O03.4. I had just ..."
---

![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-18-2026-12_03_00-PM-1024x683.png)

**January 18, 2026**


## The Weekend That Sparked Everything

It was 11:47 PM on a Saturday night, and I was staring at my EMR screen trying to remember whether "threatened abortion" was O20.0 or O03.4. I had just finished a lengthy inpatient maternal-fetal medicine consultation—complicated monochorionic twin pregnancy, discordant growth, possible twin-to-twin transfusion—and now I was stuck in the administrative purgatory of medical billing.

The clinical work was done. The patient had a plan. But I still needed to document ICD-10 codes, match them to CPT codes, ensure proper modifiers, and cross-reference everything against payor requirements. This wasn't medicine. This was data entry with a medical license.

So I did what any frustrated physician-developer does at midnight: I opened VS Code and started building.

By Sunday evening, I had a working prototype of **CodeCraftMD**—an AI-powered application that could read my clinical notes and extract accurate ICD-10 and CPT codes automatically. It wasn't elegant. The UI was barely functional. But it _worked_.

More importantly, **I still use it today**. Every week in the hospital, CodeCraftMD processes my consultation notes and generates billing documentation that I review and submit. It saves me 15-20 minutes per complex consult. Over a month, that's hours of recovered time.

That weekend hack solved my personal pain point. But here's the thing about solving your own problem: eventually, you realize other people have the same problem too.


## The Reality Check — From Prototype to Production

The moment I started thinking about sharing CodeCraftMD with colleagues, everything changed.

"Works for me" is not the same as "works for everyone."

A tool I run on my local machine, processing my own clinical notes, with no audit trail and minimal security, is fundamentally different from software that other physicians would trust with their documentation and liability.

To make CodeCraftMD available to other clinicians, I needed to address:

- **HIPAA compliance**: Encrypted data storage, secure transmission, proper access controls

- **Authentication and authorization**: Who can access what, and how do we prove it?

- **Audit trails**: Every interaction logged, every change tracked

- **Reliability**: Can't have the system go down during a busy call night

- **Liability**: If the AI misses a code or generates an error, who's responsible?

These aren't optional features. They're the foundation of clinical-grade software.

So I made a decision: **CodeCraftMD is on intentional hiatus while I harden the infrastructure.**

Not abandoned. Not canceled. _Incubating._

### What I Got Wrong

In my initial excitement, I underestimated three things:

**1\. The complexity of healthcare authentication and audit trails**  
I thought "add login" would be a weekend task. Turns out, proper healthcare auth involves multi-factor authentication, session management, role-based access control, and compliance with authentication standards. I was thinking in terms of a personal tool. I needed to think in terms of hospital IT infrastructure.

**2\. The difference between "works on my machine" and "works in a hospital IT environment"**  
My laptop has Python 3.11, the right libraries, and no firewall restrictions. A hospital workstation has locked-down permissions, proxy servers, outdated browsers, and IT policies that block half the internet. What runs smoothly in my home office might not even install in a clinical environment.

**3\. How much I still had to learn about secure architecture**  
I know maternal-fetal medicine. I can code functional prototypes. But building secure, production-grade healthcare software requires a deeper understanding of encryption, threat modeling, penetration testing, and compliance frameworks. I'm learning, but I'm not there yet.

These aren't failures. They're the reality of moving from "weekend hack" to "real software." And recognizing the gap is the first step toward closing it.


## What I've Been Learning in the Hiatus

Rather than announce the hiatus and go silent, I've been reading, building, and learning.

I've gone deep on:

- **Secure architecture patterns**: How do you design systems that are secure by default, not secure by afterthought?

- **OAuth 2.0 and OpenID Connect**: The standard way to handle authentication in modern web apps

- **HIPAA Technical Safeguards**: The actual regulatory requirements, not just the marketing claims

- **Database encryption**: At rest, in transit, and in use

- **Zero-trust security models**: Assume breach, verify everything

I've also been exploring collaboration. CodeCraftMD is too complex for me to harden alone while maintaining a full-time MFM practice. I'm talking with experienced developers who have built healthcare software before. The goal isn't to hand off the project—it's to learn from people who've already navigated these challenges.

This hiatus isn't downtime. It's deliberate skill-building.


## The Parallel Builds — Why I Keep Shipping Small Projects

Here's the thing about learning: you can read about secure architecture all day, but you don't truly understand it until you build something.

So while CodeCraftMD incubates, I've been maintaining my "builder flywheel" with smaller, lower-stakes projects. These serve dual purposes: they keep my coding skills sharp, and they let me experiment with new techniques in environments where HIPAA compliance isn't a factor.

### Project A: PGIS — [Performance Glycemic Intelligence System](https://imgur.com/a/AXU8Z7P)

I have Type 2 diabetes, and I'm training for a half marathon. That combination creates an interesting data problem: how do I optimize glucose control while maintaining endurance performance?

Enter **PGIS** (Performance Glycemic Intelligence System)—a personal dashboard that integrates:

- Continuous glucose monitor data (Dexcom)

- Running metrics (Garmin watch)

- Nutrition logs

- AI-generated summaries and recommendations (via NotebookLM + Gemini API)

This project has taught me:

- **API integration**: Pulling data from multiple sources and normalizing it

- **Data visualization**: Building dashboards that make patterns obvious

- **Prompt engineering**: Crafting effective prompts for AI analysis

Most importantly, it's taught me **"vibe coding"** in practice. I'm using AI tools (Claude, Cursor, GitHub Copilot) to write boilerplate code while I focus on the logic and flow. Instead of Googling syntax, I describe what I want in natural language and let the AI generate the implementation.

This is how I'm accelerating my learning curve.

### Project B: Open Source [Maternal-Fetal Medicine Protocol Slides](https://chukwumaonyeije.github.io/mfm-presentations/)

As Medical Director at Atlanta Perinatal Associates, I've developed dozens of clinical protocols, teaching slides, and educational materials. Most of them live in PowerPoint files on my computer.

I've started converting these into **[HTML-based slide decks](https://chukwumaonyeije.github.io/mfm-presentations/)** hosted on GitHub:

- Breech presentation management

- External cephalic version protocols

- Ultrasound dating criteria

- Growth restriction workup algorithms

These aren't just static PDFs. They're interactive, version-controlled, and freely available to any MFM fellow or resident who wants to use them.

Why does this matter for CodeCraftMD? Because I'm learning:

- **Content management workflows**: How do you version, update, and distribute medical content?

- **Markdown and static site generation**: Building documentation that's maintainable

- **Open-source collaboration patterns**: How do you invite contributions without losing quality control?

These are the same skills I'll need when I eventually open-source parts of CodeCraftMD.


## The Philosophy — Vibe Coding vs Clinical Coding

Let me introduce a distinction that's become central to how I think about physician-developer work:

**Vibe Coding**: Rapid, intuition-driven prototyping. You focus on the logic and flow while AI handles syntax. Speed matters more than polish. The goal is to test ideas and solve immediate problems.

**Clinical Coding**: Production-grade software engineering. You focus on security, reliability, maintainability, and compliance. Rigorous testing. Proper documentation. The goal is to build systems that other people can trust with high-stakes work.

Most physician-developers start with vibe coding—because that's how you validate whether an idea is worth pursuing. You build a weekend prototype, test it with real clinical workflows, and decide if it's solving a real problem.

But if you want to ship software that other clinicians will use, you have to transition to clinical coding. That transition is where CodeCraftMD is right now.

Here's what I've learned: **Physician-developers need to be fluent in both modes.**

Vibe coding lets us move fast and experiment. Clinical coding lets us deliver reliable tools that meet the safety and regulatory standards of healthcare.

The mistake would be to vibe-code something into existence and then immediately try to sell it. That's how you end up with healthcare software that's beautiful on demo day and catastrophic in production.


## What's Next for CodeCraftMD

CodeCraftMD is coming back. But when it does, it will have:

✓ **Secure authentication** (OAuth 2.0, MFA support)  
✓ **Encrypted data handling** (at rest and in transit)  
✓ **Comprehensive audit logs** (every action tracked)  
✓ **HIPAA-ready deployment** (compliant infrastructure from day one)  
✓ **Proper error handling** (graceful failures, not silent mistakes)

I'm also considering **open collaboration**. Not open-sourcing the entire codebase (healthcare AI has IP considerations), but potentially open-sourcing the compliance framework, the testing harness, and the deployment patterns.

Why? Because every physician-developer faces these same challenges. If I document my journey from vibe-coded prototype to clinical-grade software, maybe the next doctor-builder can skip some of the mistakes I made.


## Closing Reflection — The Physician Who Builds

I became a physician because I wanted to reduce suffering. I became a developer because I realized that bad software _creates_ suffering—wasted time, cognitive burden, administrative exhaustion.

CodeCraftMD started as a personal solution to a personal frustration. But the deeper I go into this work, the more I realize that **building tools for physicians is clinical work in a different form.**

Every hour a doctor spends wrestling with billing software is an hour not spent with patients. Every cognitive cycle wasted on EHR navigation is a cycle that could have caught a critical detail. Software that respects physician cognition is software that improves patient care.

So yes, CodeCraftMD is on hiatus. But it's not paused because I lost interest. It's paused because I care enough to do it right.

To my fellow physician-developers: **Prototype your frustrations.** Build the weekend hack. Solve your own problem first. But when you're ready to share it with colleagues, pause and ask: "Is this software I would trust if someone else built it?"

If the answer is no, that's not failure. That's wisdom.

CodeCraftMD will return. Stronger. Safer. Built to last.


**Want to follow the journey?**

- Check out the [MFM Protocol Slides on GitHub](https://chukwumaonyeije.github.io/mfm-presentations/)

- Read about [PGIS development updates](https://imgur.com/a/AXU8Z7P) : Coming Soon.

- Connect with me on [LinkedIn](https://www.linkedin.com/in/chukwumaonyeije/) where I share real-time builder lessons

_The best medical software is built by physicians who understand both the clinical problem and the engineering discipline to solve it properly. We're learning both. In public._


**Tags:** #PhysicianDeveloper #HealthTech #CodeCraftMD #VibeCoding #MedicalBilling #HIPAA #BuildingInPublic
