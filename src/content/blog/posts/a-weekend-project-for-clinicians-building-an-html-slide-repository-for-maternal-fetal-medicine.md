---
audioUrl: /audio/a-weekend-project-for-clinicians-building-an-html-slide-repository-for-maternal-fetal-medicine.mp3
author: Chukwuma Onyeije, MD, FACOG
category: Technology
description: Most MaternalFetal Medicine (MFM) physicians accumulate years of teaching
  materialPowerPoint decks, PDFs, screenshots, and handouts scattered across l...
draft: false
pubDate: 2026-01-04
title: 'A Weekend Project for Clinicians: Building an HTML Slide Repository for Maternal–Fetal
  Medicine'
---

# Why I Built an HTML Slide Repository

![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/01/chukwumaonyeije_A_Weekend_Project_for_Clinicians_Building_an__78629026-64e6-4e64-843c-4dc8b2200d2f_2.png)

Most Maternal–Fetal Medicine (MFM) physicians accumulate years of teaching material—PowerPoint decks, PDFs, screenshots, and handouts scattered across laptops, cloud drives, and email threads. The problem is not lack of content; it is **lack of structure**.

I wanted a system that was:

- Stable and future-proof

- Easy to update without breaking links

- Shareable with residents and fellows

- Independent of PowerPoint or institutional LMS software

- Compatible with modern AI-assisted slide generation

This weekend, I built exactly that: a **version-controlled HTML slide repository** designed specifically for MFM education.


## The Core Idea

Instead of thinking in terms of “slides,” think in terms of **teaching units**.

Each clinical concept—PPROM, fetal growth restriction with abnormal Dopplers, preeclampsia with severe features—becomes a **self-contained HTML module** with a permanent URL.

This mirrors how modern documentation, guidelines, and knowledge bases are built.


## The Architecture (Simple but Powerful)

The repository uses a clean, predictable structure:

```
mfm-presentations/
  README.md
  index.html
  decks/
    fgr-ua-aedv-35w/
      index.html
      assets/
    pprom-late-preterm/
      index.html
      assets/
    preeclampsia-severe-features/
      index.html
      assets/
  shared/
    css/
    js/
    images/
```

### Why this matters

- **One deck = one folder**

- Each deck is named `index.html`, giving it a clean URL

- Assets (images, diagrams) live alongside the deck

- Links never break when files are updated

- The repository scales cleanly to dozens or hundreds of topics

A deck published this way becomes accessible at:

```
/decks/preeclampsia-severe-features/
```

No filenames. No version chaos. No “final\_v7\_revised.pptx”.


## Why HTML Instead of PowerPoint?

HTML slides offer several advantages for clinician-educators:

- Platform-independent (any browser)

- Compatible with AI-generated slide systems

- Easily versioned with Git

- Can be published instantly via GitHub Pages

- Ideal for QR codes, syllabi, and asynchronous learning

Importantly, **HTML does not replace PowerPoint**—it complements it. This repository acts as a **canonical source of truth** from which slides can be taught, reviewed, or even converted later.


## Version Control Without the Pain

Using GitHub provides:

- A full edit history (who changed what and when)

- Safe experimentation without breaking live content

- Easy rollback if a change goes wrong

- A single authoritative location for teaching materials

For clinicians new to Git: most of the work happens locally, and updates are pushed when ready. No complex branching or software engineering overhead is required.


## Publishing the Library

With GitHub Pages enabled, the repository becomes a **live teaching site**:

- A central index page listing all topics

- Individual decks accessible via clean URLs

- Shareable with residents, fellows, and colleagues

- Suitable for private or public use

This turns your teaching materials into a **living digital textbook** rather than a folder of files.


## Who This Is For

This approach is ideal for:

- MFM physicians teaching residents and fellows

- Subspecialists with recurring lecture content

- Clinicians experimenting with AI-assisted slide creation

- Educators who want long-term organization and reuse

- Anyone tired of losing track of “the latest version” of a deck


## The Repository

I’ve made the repository publicly available so others can learn from or adapt the structure:

**GitHub repository:**  
👉 [https://github.com/chukwumaonyeije/mfm-presentations](https://github.com/chukwumaonyeije/mfm-presentations)

The Github Website is [HERE](https://chukwumaonyeije.github.io/mfm-presentations/):

[https://chukwumaonyeije.github.io/mfm-presentations](https://chukwumaonyeije.github.io/mfm-presentations)

You can:

- Fork it

- Clone it

- Use it as a template for your own specialty

- Adapt it for OB, anesthesia, cardiology, or internal medicine


## Final Thought

Clinicians already think in systems: workflows, algorithms, decision trees. Our teaching materials deserve the same level of rigor.

A structured HTML slide repository is not about being “technical.”  
It is about **respecting your time, your learners, and your accumulated expertise**.

If you can build this in a weekend, you can maintain it for a career.

Best Wishes,

C. Onyeije