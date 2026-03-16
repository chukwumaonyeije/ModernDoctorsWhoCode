---
title: "The Protocol-to-Website Industrial Complex:"
pubDate: 2026-03-15
category: "Blogging"
tags: 
- "acog-guidelines"
- "clinical-knowledge-management"
- "clinical-microsites"
- "clinical-tools"
- "counter-infrastructure"
- "data-pipeline"
- "doctors-who-code"
- "doctorswhocode"
- "evidence-based-medicine"
- "github-pages"
- "guideline-to-app"
- "health-communication"
- "health-misinformation"
- "health-tech"
- "healthcare-technology"
- "high-risk-pregnancy"
- "json"
- "logs-before-intelligence"
- "maternal-fetal-medicine"
- "medical-misinformation"
- "medtech"
- "mfm-2"
- "next-js"
- "open-source"
- "openmfm"
- "patient-education"
- "physician-leadership"
- "physician-developer-2"
- "physician-developers"
- "preeclampsia"
- "protocol-to-website"
- "pwic"
- "python"
- "static-site"
- "vercel"
- "web-development"
author: "Chukwuma Onyeije, MD, FACOG"
draft: false

description: "By Dr. Chukwuma Onyeije, MD, FACOG | Maternal-Fetal Medicine Specialist & Medical Director, Atlanta Perinatal Associates"
---

**How Physician-Developers Can Win the Medical Misinformation War**

By **Dr. Chukwuma Onyeije, MD, FACOG**  |  Maternal-Fetal Medicine Specialist & Medical Director, Atlanta Perinatal Associates

Founder, Doctors Who Code, **OpenMFM.org, CodeCraftMD**  |  March 15, 2026  |  8-minute read

**KEY TAKEAWAYS**

| ✦  Medical misinformation thrives because it is dynamic, visual, and algorithmically amplified — evidence-based medicine is not. ✦  The Protocol-to-Website Industrial Complex (PWIC) is a framework for converting clinical guidelines into interactive, patient-facing tools. ✦  OpenMFM.org demonstrates this model with a dual-deployment architecture (Vercel + GitHub Pages) that is free, open-source, and resilient. ✦  Physician-developers — not vendors — are best positioned to build these tools because they live inside the clinical workflow. ✦  Data discipline ('Logs before intelligence') must precede AI-powered features. Start with clean, structured data first. |
| --- |

## **We Are Bringing Paper to a Software Fight**

I was in the middle of reviewing evidence-based counseling guidelines for low-dose aspirin in preeclampsia prevention — solid, peer-reviewed, ACOG-backed science — when I felt that familiar friction. The final delivery mechanism for all of this evidence was a static PDF handout. Twelve pages. Printed on paper. Handed to a patient who would be lucky to read past page two.

That same afternoon, I pulled up TikTok out of professional curiosity. A wellness influencer with zero medical credentials was explaining — with great confidence and a ring light — why aspirin is "toxic." The video had 2.3 million views. The comments were full of pregnant women thanking her for "finally telling the truth."

In that moment, I wasn't angry at the influencer. I was angry at us — the medical establishment — for still thinking that a PDF could compete with a video algorithm.

Let me be direct: medicine isn't losing the health misinformation war because we lack evidence. We are losing because we are bringing paper to a software fight.

_Evidence-based medicine is losing not because it lacks evidence — but because it refuses to become software._

In a previous post, I introduced the concept of the **Misinformation** **Industrial Complex** \[1\] — the ecosystem that makes health misinformation so devastatingly effective. It is dynamic, algorithmically amplified, visually compelling, and available on every phone, at any hour, in any language. The patients I counsel on gestational diabetes or preeclampsia will forget half of what I say within 24 hours. But they will see that TikTok video six more times before their next appointment.

Fighting this does not just require debunking bad information. It requires building better **infrastructure** for the truth. That is the mission behind what I now call the **Protocol-to-Website Industrial Complex (PWIC)** — and why I built [OpenMFM.org](https://openmfm.org).

![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/03/image2-1024x673.png)

## **Why I'm Qualified to Say This (And Why That Matters)**

I am a Maternal-Fetal Medicine specialist and Medical Director at Atlanta Perinatal Associates. Every week, I manage pregnancies complicated by preeclampsia, fetal cardiac anomalies, placenta previa, gestational diabetes, and a dozen other conditions where the gap between clinical guideline and patient understanding can be measured in outcomes — sometimes fatal ones.

I am also a physician-developer. I built [CodeCraftMD](https://codecraftmd.com), an AI-powered medical billing and documentation platform. I write for this blog — **DoctorsWhoCode** — because I believe physicians who understand both clinical medicine and software development sit at one of the most consequential intersections in modern healthcare.

I am not writing this as a technology enthusiast. I am writing this as a clinician who has watched health misinformation change the conversations I have with patients in the exam room. I am writing this because the problem is real, the solution is technical, and doctors need to be the ones building it.

## **The Anatomy of the Problem: Why Static Documents Cannot Win**

The Misinformation Industrial Complex has five structural advantages over traditional evidence-based health communication:

- Speed: Misinformation is published instantly. Clinical guidelines take years.

- Format: Misinformation is visual, short-form, and emotionally resonant. Clinical guidelines are text-dense PDFs.

- Distribution: Misinformation is algorithmically amplified to precisely the patients most likely to believe it.

- Accessibility: Misinformation is free, mobile-first, and available 24/7.

- Adaptability: When one claim is debunked, the ecosystem generates another. Clinical guidelines are updated every 3–5 years.

The structural response to this cannot be "publish more PDFs." It cannot even be "post more on social media." Those are tactics. What medicine needs is a **counter-infrastructure** — a systematic process for converting what we already know (clinical guidelines, protocols, evidence-based recommendations) into the formats that actually reach and engage patients.

I have argued elsewhere that most clinical guidelines are _already software_ — we just haven't compiled them yet. They contain decision trees, risk stratification thresholds, conditional logic branches. The ACOG low-dose aspirin recommendation is effectively an algorithm: screen for risk factors, apply a threshold, recommend or don't. That's a flowchart. That's an app waiting to be built.

_Most clinical guidelines are already software. We just haven't compiled them yet._

## **Introducing the Protocol-to-Website Industrial Complex (PWIC)**

**The Protocol-to-Website Industrial Complex** is a framework — and increasingly a movement — for systematically converting clinical knowledge into interactive, publicly accessible digital tools. It is the machinery we need to build to close the gap between what medicine knows and what patients can access.

The PWIC rests on four principles:

1. Clinical guidelines should be interactive tools, not static documents.

3. Physician-developers — not vendors — should build the patient-facing layer.

5. The infrastructure should be open-source, free, and resilient.

7. Data discipline precedes AI: clean, structured data must come before intelligent features.

This is not a theoretical framework. I built it. OpenMFM.org is the proof of concept.

## **OpenMFM.org: A Real-World Case Study in the PWIC**

For years, I maintained a GitHub repository of my MFM presentations — over 80 evidence-based slide decks, a half-dozen interactive clinical microsites. The content was there. It was open-source. But it was just a repository: knowledge trapped in a folder, discoverable only if you already knew where to look.

Transforming it into [OpenMFM.org](https://openmfm.org) required a fundamental architectural shift, not just a domain name. Here is what I built and why each decision matters.

### **The Dual-Deployment Strategy: Modern UX + Bulletproof Resilience**

Every git push to the main branch triggers two simultaneous build processes:

- Vercel Deployment: Builds the Next.js 16 application in the landing-page/ directory and deploys to openmfm.org. This is the modern, interactive front door — fast, SEO-optimized, with full metadata.

- GitHub Actions Deployment: In parallel, a GitHub Actions workflow deploys the entire repository as a static site to the GitHub Pages mirror. This is the redundant backup — bulletproof, permanent, and free.

This architecture gives us the best of both worlds: a premium user experience through Vercel and the quiet, dependable permanence of a static GitHub Pages site. If Vercel goes down, the knowledge stays accessible. Medical information should not have a single point of failure.

### **The Data Pipeline: Logs Before Intelligence**

One of my core principles at **DoctorsWhoCode** is **"Logs before intelligence."** Data discipline precedes AI insight. Before we build sophisticated search, recommendation engines, or AI-powered features, we need clean, structured, reliable data.

Our source of truth is the collection of raw HTML presentation files. A Python script — _generate\_data.py_ — parses these files and generates a master _presentations.json_ manifest. Every presentation has a structured record: title, URL, tags, and a description scraped from its content. The Next.js application on Vercel consumes this JSON to build the library, the sitemap, and all metadata. Clean separation of concerns: content lives in HTML; intelligence lives in the application layer.

### **Architecture at a Glance**

| **Component** | **Technology** | **Purpose** |
| --- | --- | --- |
| Primary Domain | Vercel + Next.js 16 | Modern UX; SEO-optimized; fast load times |
| Mirror Domain | GitHub Pages | Resilient static backup; permanent uptime |
| Data Source | presentations.json | Master manifest of all presentations |
| Build Script | generate\_data.py | Parses HTML → generates structured JSON |
| Sitemap | generate\_sitemap.py | Auto-generated sitemap.xml on every build |
| Content Layer | Raw HTML files | 80+ evidence-based MFM presentations |

## **The Bigger Picture: Why Physician-Developers Must Lead This**

The gap between clinical protocols and usable patient tools is not, primarily, a technology gap. The technology is straightforward. Next.js, GitHub Pages, and Python are not exotic tools. What is rare — what vendors cannot easily replicate — is the combination of deep clinical knowledge and software skill that a physician-developer brings.

When I built the preeclampsia risk calculator on OpenMFM.org, I didn't just implement an algorithm. I knew which edge cases would matter clinically. I knew which risk factors patients consistently misreport. I knew exactly where the friction lives in the real-world counseling encounter, because I live inside that workflow every day.

_The physicians who understand the workflow — who know exactly where the friction lives — are the people best positioned to build the tools that fix it._

That is the structural advantage of physician-developers over technology vendors. Vendors optimize for sales cycles and enterprise contracts. Physician-developers optimize for clinical reality.

This is why I founded [Doctor Who Code](https://www.doctorswhocode.blog/). Not to teach every physician to become a software engineer, but to create a community and a framework for the physicians who already exist at that intersection — and to demonstrate, with working software, that we can build the counter-infrastructure medicine needs.

## **What You Can Do Right Now**

If you are a physician — with or without coding skills — here is how to engage with the PWIC:

- Explore [OpenMFM.org](http://OpenMFM.org). Browse the presentations, use the microsites, and see what open-source clinical knowledge infrastructure can look like.

- Identify the PDF in your practice that should be an app. What static document do you hand patients that contains decision logic? That is your starting point.

- Join the DoctorsWhoCode community. Whether you write code or manage clinical workflows, your domain knowledge is the most valuable asset in this project.

- Share this framework with your residency program, department chair, or CME committee. The PWIC is not a solo project — it scales with institutional adoption.

If you are a physician-developer specifically, I want to hear from you. The next phase of OpenMFM.org involves **AI-powered clinical microsites** built on top of the structured data we have already created — exactly the "Logs before intelligence" principle in action. There is meaningful collaborative work to be done here.

## **Frequently Asked Questions**

### **What exactly is the Protocol-to-Website Industrial Complex?**

The PWIC is a framework for systematically converting clinical guidelines and protocols into interactive, patient-facing digital tools. It is the physician-led counter-infrastructure to health misinformation — built on open-source principles and deployed at the intersection of clinical knowledge and software development.

### **Do I need to know how to code to contribute?**

No. The PWIC needs clinicians who can identify which guidelines should be converted into tools, who can validate clinical accuracy, who can test usability with real patients. Software skills are helpful but the domain expertise is the rarest resource.

### **Is OpenMFM.org really free and open-source?**

Yes. The entire codebase is publicly available on GitHub. Every presentation, every microsite, every data pipeline is open-source. You can fork it, adapt it to your specialty, and build on it. That is the point.

### **How does this relate to AI in medicine?**

The PWIC is the prerequisite for effective AI in clinical communication. AI tools are only as good as the structured data they are trained on or query. Building clean, structured clinical knowledge databases — exactly what the data pipeline in OpenMFM.org does — creates the foundation that makes AI-powered clinical tools trustworthy rather than hallucinatory.

## **The Work Continues**

Building OpenMFM.org was more than a technical exercise. It was a demonstration — proof that the physicians who understand the workflow are the people best positioned to build the tools that fix it.

The Misinformation Industrial Complex is not going to slow down. The influencer with the ring light is not going to stop posting. But every evidence-based clinical microsite we build, every guideline we compile into an interactive tool, every patient who finds accurate information because a physician-developer chose to build rather than just publish — that is how we win.

The Protocol-to-Website Industrial Complex is a future where physicians are not just consumers of technology, but its architects. Where our collective knowledge is a shared, dynamic, accessible resource — not a proprietary product trapped in a PDF.

**The work continues. And I would love for you to be part of it.**

**References & Resources**

\[1\] Onyeije, C. (2026, February). _From Misinformation to Implementation: Why Modern Medicine Needs a Guideline-to-App Industrial Complex._ lightslategray-turtle-256743.hostingersite.com.

OpenMFM.org — [https://openmfm.org](https://openmfm.org)

CodeCraftMD — [https://codecraftmd.com](https://codecraftmd.com)

**About the Author**

**Dr. Chukwuma Onyeije, MD, FACOG** is a board-certified Maternal-Fetal Medicine specialist, Medical Director at Atlanta Perinatal Associates, and founder of Doctors Who Code. He is also the founder of CodeCraftMD, an AI-powered medical documentation and billing platform. He writes at the intersection of clinical medicine, software development, and physician leadership. His clinical research and open-source tools are available at [OpenMFM.org](https://openmfm.org).
