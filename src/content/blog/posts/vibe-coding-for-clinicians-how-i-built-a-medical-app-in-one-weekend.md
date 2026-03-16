---
title: "Vibe Coding for Clinicians: How I Built a Medical App in One Weekend"
pubDate: 2026-01-15
category: "Technology"
author: "Chukwuma Onyeije, MD, FACOG"
draft: false

description: "At 3:47 AM on a Tuesday, I was manually transcribing my seventh high-risk OB consultation of the day into our EMR. The patient had a complex fetal cardi..."
---

**By Dr. Chukwuma Onyeije, MD** | Maternal-Fetal Medicine Specialist & Founder, CodeCraftMD  
_January 2026 • 12 min read_


**The 3 AM Problem That Changed How I Build Software**

At 3:47 AM on a Tuesday, I was manually transcribing my seventh high-risk OB consultation of the day into our EMR. The patient had a complex fetal cardiac anomaly, and I needed to document ultrasound findings, coordinate with pediatric cardiology, order genetic testing, and counsel the family—all while fighting with dropdown menus that didn't understand the nuance of a hypoplastic left heart with intact atrial septum.

I wasn't tired because of the clinical complexity. I thrive on that.

I was exhausted because the _software friction_ was stealing time I should have spent thinking about patient care.

That night, I didn't write a requirements document. I didn't email IT. I didn't wait for a vendor solution.

I opened my laptop and started building.

**Not because I'm a great programmer. Because I couldn't _not_ build it.**

That obsessive pull—that "I have to fix this" energy—is what developers now call **vibe coding**. And it's the secret weapon that lets physicians build better medical software than most professional engineering teams ever will.

Here's why—and how you can do it too.


**Why Your Medical Training Already Makes You a Better Builder**

**Here's the truth most coding bootcamps won't tell you:** Modern software development isn't about memorizing syntax or grinding LeetCode problems at 2 AM.

It's about three skills you already mastered in medical school:

**1\. Pattern Recognition Under Uncertainty**

Remember your first month on the wards? You learned to recognize sepsis before labs confirmed it. You developed clinical gestalt—the ability to integrate incomplete data and make decisions anyway.

Software development is identical. You're constantly recognizing patterns, assembling incomplete information, and making judgment calls with imperfect data.

The only difference? In coding, you can test your hypothesis in 30 seconds instead of waiting for morning labs.

**2\. Systems Thinking**

Every differential diagnosis is systems thinking in action. You don't just treat the presenting symptom—you map how cardiovascular, renal, endocrine, and neurologic systems interact.

Modern software is the same layered architecture:

- **Presentation layer** (like the patient's chief complaint)

- **Business logic** (your clinical reasoning)

- **Data layer** (your diagnostic workup)

- **External services** (consultants and specialists)

You're already fluent in this language. You just don't call it "full-stack architecture."

**3\. Adaptive Expertise Through Iteration**

Clinical medicine is continuous iteration. You start empiric antibiotics, check response, adjust based on cultures, monitor side effects, pivot if needed.

That's exactly how modern development works—especially with AI coding assistants that let you iterate at the speed of thought rather than the speed of typing.

![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/01/unnamed-2-572x1024.png)


**What Is "Vibe Coding" (And Why It's Perfect for Clinicians)**

**Vibe coding** isn't a technical framework. It's a philosophical approach that mirrors clinical practice:

| **Traditional Development** | **Vibe Coding** | **Clinical Medicine** |
| --- | --- | --- |
| Comprehensive specs first | Start with intuition | Clinical hunch |
| Waterfall planning | Rapid experimentation | Test and adjust |
| Perfect architecture | Ship and iterate | Empiric treatment |
| Avoid technical debt | Solve the real problem | Treat the patient, not the test |

It's building software the way you practice medicine: starting with genuine curiosity, testing rapidly, adjusting based on real-world feedback.

**The Four Principles of Clinical Vibe Coding**

1. **Build solutions you would personally use**  
    (Not what administrators _think_ you need)

3. **Start from Layer N, not zero**  
    (Reuse existing tools—no one builds a stethoscope from scratch)

5. **Let obsession replace discipline**  
    (Motivation is automatic when you're solving your own pain)

7. **Trust AI to handle syntax friction**  
    (You describe outcomes; AI writes boilerplate)


**The Abstraction Epiphany: You're Not Writing Code, You're Prescribing Solutions**

Here's the mental model shift that changed everything for me:

**Writing code is like compounding medications from raw chemicals.**  
**Modern development is like prescribing from a formulary.**

When you treat heart failure, you don't synthesize ACE inhibitors in your office. You prescribe lisinopril—a pre-built abstraction that thousands of researchers perfected over decades.

Software is identical. You don't build authentication systems from scratch. You prescribe Firebase or Supabase. You don't hand-code payment processing. You prescribe Stripe.

**Real Example: How I Built a Consultation Generator in One Weekend**

**The Problem:** Creating comprehensive MFM consultation notes took 20-30 minutes of manual documentation per patient.

**The Traditional Approach:** Would require:

- 6 months of requirements gathering

- $200K+ development budget

- Iterative meetings with IT stakeholders

- 18-month deployment timeline

**The Vibe Coding Approach:** I used:

- **OpenAI API** (for medical language processing)

- **Supabase** (managed PostgreSQL database)

- **Vercel** (one-click deployment)

- **Tailwind UI** (pre-built component library)

- **Claude/ChatGPT** (to scaffold code I described in plain English)

**Total cost:** $47/month in API fees  
**Development time:** One weekend  
**Result:** Now generates 90% of my consultation notes in 45 seconds

I didn't write a database from scratch. I didn't design UI components pixel by pixel. I didn't memorize React documentation.

**I prescribed the right abstractions and assembled them toward my clinical problem.**


**Why AI Coding Assistants Are Your Attending Physician**

Remember your first procedure? You didn't learn by reading a textbook. You watched your attending, then they talked you through it step-by-step while you performed it.

**AI coding assistants work exactly the same way.**

Instead of:

1. Read documentation for 3 hours

3. Try to remember syntax

5. Debug cryptic error messages

7. Give up and wait for Stack Overflow responses

You now:

1. Describe what you want in natural language

3. AI generates working code

5. You review and adjust (like co-signing a resident's note)

7. Iterate until it feels right

This is how senior clinicians teach—by demonstrating, then letting you practice with guidance. AI just compresses the feedback loop from days to seconds.


**The Physician Advantage: Why Doctors Build Better Medical Software**

Professional engineers are brilliant at technical architecture. But they can't replicate three advantages you already have:

**1\. Lived Experience of Clinical Pain Points**

You _feel_ the friction. You know which workarounds are dangerous. You understand the difference between "technically correct" and "actually usable at 2 AM in a critical situation."

**2\. Domain Expertise That Can't Be Documented**

No requirements document can capture the tacit knowledge of how physicians actually work. You can't spec "what it feels like to review 30 fetal echos in a single afternoon."

**3\. Intrinsic Motivation That Outlasts Any Sprint Cycle**

External product teams lose interest when features ship. You're still living the problem every single day. That obsession ensures you'll keep refining until it actually works.


**Concrete Examples: What Should You Build?**

Start with problems that create daily friction in _your_ practice:

**Primary Care**

- Smart prior authorization generator (pulls evidence from UpToDate)

- Patient education handout customizer (adapts reading level, language)

- Chronic disease dashboard (aggregates scattered lab trends)

**Specialists**

- Procedure consent form builder with visual aids

- Referral triage system that actually matches urgency

- Teaching slide generator from clinical cases

**Hospitalists**

- Discharge summary generator from EMR data

- Sign-out tool that highlights critical labs/pending studies

- Readmission risk calculator using your hospital's specific data

**Researchers**

- Literature search aggregator with citation manager

- Data collection forms that export clean CSVs

- Grant budget calculator with institutional overhead

**The pattern:** Small, focused tools that solve _your_ specific pain point—not enterprise solutions trying to be everything to everyone.


**Your First Vibe Coding Project: A 4-Week Roadmap**

**Week 1: Problem Selection**

- Identify something that irritates you 3+ times per week

- Can you describe the ideal solution in 2-3 sentences?

- Would you personally use it daily?

**Week 2: Abstraction Selection**

- Search GitHub for "medical \[your problem\]"

- Find 3-5 existing tools that solve _part_ of your problem

- Pick the abstraction layers you'll reuse

**Week 3: AI-Assisted Building**

- Describe your desired behavior to Claude/ChatGPT

- Let AI scaffold the basic structure

- Iterate section by section (not all at once)

**Week 4: Real-World Testing**

- Use it yourself for 5 days

- Note every friction point

- Refine based on _your actual usage_, not theoretical users

**Key principle:** Ship something imperfect that solves 80% of your problem in Week 4. Don't spend 6 months perfecting something that solves 100% of a problem you _thought_ you had.


**Common Objections (And Why They're Wrong)**

**"I don't have time to learn programming."**  
You're not learning programming. You're learning to assemble abstractions. That's a 10-hour investment, not a 1,000-hour investment.

**"What if my code breaks?"**  
Your workaround Excel sheet already breaks. At least now you can fix it yourself instead of waiting for IT.

**"Isn't this unprofessional?"**  
Building tools that improve patient care is the definition of professional. Waiting for perfect vendor solutions that never arrive isn't.

**"I'm not technical enough."**  
You decode fetal heart tracings. You interpret metabolic panels. You synthesize contradictory studies into clinical judgment. You're plenty technical.


**Why This Matters for the Future of Healthcare**

Healthcare technology is currently built by two groups:

1. Billion-dollar EMR vendors (who've never taken night call)

3. Silicon Valley startups (who've never touched a patient)

**The missing voice: Clinicians who understand both worlds.**

The next generation of transformative medical software won't come from Palo Alto product managers. It will come from:

- A pediatrician in Memphis who got tired of manual vaccine scheduling

- An emergency physician in Denver who needed better triage prediction

- A rural family doc who built a telemedicine system that actually works

**These won't be polished enterprise platforms. They'll be focused tools built by people who felt the pain.**

And because they start with genuine clinical need instead of investor pitch decks, they'll actually get used.


**Your Action Step This Week**

1. **Identify one repetitive task** that steals 15+ minutes from your day

3. **Open ChatGPT or Claude** and describe your ideal solution

5. **Ask:** "What existing tools could I combine to build this?"

7. **Spend 30 minutes** exploring the suggested abstractions

You don't need to build anything yet. Just start seeing software as **composable abstractions** rather than **incomprehensible code**.

That mental shift alone will change how you think about healthcare technology.


**The Bottom Line**

You don't need to become a software engineer.

You need:

- ✅ A problem you personally experience

- ✅ Curiosity to explore existing solutions

- ✅ Willingness to iterate based on real use

- ✅ Comfort letting AI handle technical details

**Modern software development is closer to clinical medicine than most doctors realize.**

Both are about:

- Recognizing patterns

- Assembling existing knowledge

- Iterating based on outcomes

- Making judgment calls with incomplete information

**You already have the skills. You just need permission to use them.**

The future of healthcare software will be built by clinicians who followed a vibe—assembled the right abstractions—and solved problems they lived every single day.

**That's exactly what Doctors Who Code is about.**


**Dr. Chukwuma Onyeije, MD** is a Maternal-Fetal Medicine specialist, Medical Director at Atlanta Perinatal Associates, and founder of [CodeCraftMD](https://codecraftmd.com/)—an AI-powered medical billing application built by a physician, for physicians.

_Want to start your first vibe coding project? Join the [Doctors Who Code community](https://www.doctorswhocode.blog/contact) where 500+ physician-developers share code, solve problems together, and build the future of medical software._

Chuck
