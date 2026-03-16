---
title: "The Era of the Clinical Scratchpad: Why Every Doctor Should Build \"Disposable\" Software"
pubDate: 2026-02-01
category: "Blogging"
tags: 
- "healthcareinnovation-2"
- "aiinmedicine"
- "clinicalinformatics"
- "clinicalsoftware"
- "healthtech"
- "llmcoding"
- "medicalai"
- "medicalproductivity"
- "physiciandevelopers-2"
author: "Chukwuma Onyeije, MD, FACOG"
draft: false

description: "For the past two decades, medical software has been synonymous with monolithic platformsEpic, Cerner, and their ilkmassive systems designed to serve e..."
---

## _By Chukwuma Onyeije, MD, FACOG - Maternal-Fetal Medicine Specialist & Founder of CodeCraftMD_


![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/02/chukwumaonyeije_The_Era_of_the_Clinical_Scratchpad_Why_Every__735ac9f2-7d22-4a81-8cbf-90527ff28c61_3-1.png)

## The Death of the "One-Size-Fits-All" Solution

For the past two decades, medical software has been synonymous with monolithic platforms—Epic, Cerner, and their ilk—massive systems designed to serve every specialty, every workflow, and every conceivable use case. As physicians, we've learned to contort our clinical processes to fit these rigid frameworks, accepting that software is expensive, permanent, and unchangeable.

# But something fundamental has shifted.

We're witnessing a seismic transformation in how software is created, one that has profound implications for physician-developers. Code, once a rare and expensive commodity requiring months of engineering effort, has become prolific and cheap. Thanks to large language models (LLMs) and AI-assisted coding tools, we're entering what I call the "spreadsheet moment" for medicine—a democratization of software creation where physicians can build bespoke, niche tools for their own clinical workflows in minutes rather than months.

This has been on my mind for a while but this YouTube Video brought it to my attention:

https://youtu.be/28z6OjsNsUk?si=HFYGF6op2LU\_Ql0w

This isn't just a technical evolution. It's a fundamental reimagining of what medical software can be. Instead of permanent, universal platforms, we're moving toward personal software—ephemeral, highly specific tools that solve one problem brilliantly and then disappear when they're no longer needed.

As someone who built [CodeCraftMD](https://codecraftmd.com/) from a weekend prototype to a production system, I've lived this transformation firsthand. Today, I want to explore what this means for the future of physician-developers and why the ability to create "disposable" medical software might be the most valuable skill you can develop.

## The "Problem Threshold": Solving the Annoying Micro-Tasks

Let me paint you a familiar picture: You're in clinic, and there's a specific patient education script about fetal growth restriction that you give dozens of times per month. You wish you had an interactive tool that could walk patients through the nuances of their specific situation—factoring in their gestational age, prior history, and current ultrasound findings. You've thought about building something, but the mental calculus is always the same: 20 hours to code, test, and deploy vs. 2 minutes to just explain it again verbally. The math never works out.

That calculus just changed.

**What previously required 20 hours of development now takes 5 minutes of clear description to an LLM.** The "difficulty threshold"—the point where a problem becomes too small to justify engineering effort—has effectively collapsed to zero. We're now operating in what I call the "vibe coding" sweet spot, where the barrier between clinical idea and working tool has been obliterated.

Consider the tools I've built recently:

- A [gestational diabetes quiz chatbot](https://chukwumaonyeije.github.io/gdm-quiz-app/) that adapts its educational content based on patient responses and risk factors

- A pregnancy insulin dose [Calculator](https://insulin-calculator-4b8fc.web.app/) that gives an estimate of insulin dosage based on maternal age, gestational age, weight and trimester

- A custom CSV reformatter for our lab's unique data export format

None of these are meant to be multi-billion dollar SaaS companies. They're clinical scratchpads—small, focused tools that solve specific problems for specific workflows. And here's the radical part: **if they break next year, I won't maintain them. I'll simply regenerate them.**

This is the essence of disposable software, and it's liberating.

## From Coder to Architect: The New Physician-Developer

When I started coding fifteen years ago, success meant mastering syntax—knowing the precise incantations of Python or JavaScript, understanding memory management, debugging obscure compiler errors. Technical proficiency was the gatekeeper to building anything useful.

LLMs have fundamentally changed this equation.

In the age of AI-assisted coding, syntax matters far less than architecture and clinical logic. The "how" of coding has been largely automated; what remains critical is the "what" and "why." This shift massively favors domain experts—and in healthcare, physicians are the ultimate domain experts.

Senior developers succeed with AI tools not because they write better code, but because they excel at **orchestration**—knowing which components fit together, anticipating edge cases, and understanding system-level implications. In medicine, this translates perfectly. Your value as a physician-developer isn't in writing elegant Python scripts; it's in knowing exactly which clinical edge cases the script must handle.

Let me illustrate with a real example from my practice. When I built the initial version of CodeCraftMD's documentation assistant, the LLM could generate the basic code structure in minutes. But it took my maternal-fetal medicine expertise to specify:

- That "advanced maternal age" means different things for different ethnic populations

- That certain ultrasound findings require specific follow-up intervals based on the trimester

- That medication safety classifications in pregnancy have nuanced gradations that affect counseling

- That documentation must flow in a specific sequence to support proper CPT and ICD-10 coding

The LLM couldn't know these things. But once I articulated them clearly, it could implement them flawlessly. **This is the new physician-developer skill set: clinical architecture, not coding syntax.**

## The Concept of "Disposable" Medical Software

The traditional software development mindset centers on longevity—building systems that scale, maintain, and endure. But permanence has costs: extensive testing, robust infrastructure, ongoing maintenance, backward compatibility. These costs create a barrier that keeps small clinical inefficiencies unaddressed.

Disposable software flips this logic. Instead of optimizing for longevity, we optimize for immediacy. One problem, one solution, no pretense of immortality.

### Real Clinical Examples

**The Ultrasound Archive Project**: Last month, I needed to organize 500 old ultrasound images from a research database, transcoding them from an obsolete format and renaming them according to a specific convention. Traditionally, I'd either do this manually over several days or spec out a project for a developer. Instead, I described the task to Claude, it generated a Python script in 90 seconds, and the entire archive was processed in 15 minutes. Will I ever use that script again? Probably not. Did it matter? Not at all.

**The Lab Data Reformatter**: Our genetics lab sends results in a CSV format that doesn't align with our EHR's import specifications. Every week, our staff manually reformatted this data—40 minutes of tedious copy-paste work. I built a custom reformatter that takes their CSV and outputs it in our required format. Total development time: 8 minutes. If the lab changes their format next year, I'll spend another 8 minutes regenerating the tool.

**The Prior Authorization Letter Generator**: Insurance authorizations for high-risk obstetric care require specific medical justifications that vary by insurer and indication. Rather than maintaining a complex template system, I built a disposable tool that generates appropriately worded letters based on diagnosis codes and clinical scenarios. When insurance requirements change—and they always do—I'll simply rebuild it.

**Why temporary is a feature, not a bug**: In the era of cheap code, maintenance burden is often more expensive than regeneration cost. If my lab reformatter breaks because the input format changed, I don't debug it—I "re-vibe" it by describing the new requirements to an LLM. This approach eliminates technical debt entirely.

## The Distribution Illusion and Clinical Rigor

Now for the sobering reality check: while code is cheap to generate, **software that survives contact with the real world remains expensive**. The video I'm referencing makes this distinction brilliantly—there's a massive gap between a script that works on your laptop and a system that handles edge cases, scales reliably, and integrates with existing workflows.

In medicine, this gap is even more critical because the stakes are patient safety, not just user experience.

### Medical Accuracy vs. AI Speed

As physicians, we cannot trust LLM output blindly. The same tool that generates functional code in seconds will also confidently hallucinate drug interactions, misinterpret lab values, and create plausible-sounding clinical protocols that violate basic medical principles. **The critical eye remains essential.**

When I review LLM-generated medical code, I'm checking for:

- **Clinical accuracy**: Are medication dosages appropriate for the indication and patient population?

- **Edge case handling**: What happens with abnormal lab values, unexpected patient responses, or contraindications?

- **Data integrity**: Does the tool properly handle missing data, formatting variations, and input errors?

- **Safety boundaries**: Are there appropriate checks that prevent dangerous recommendations?

This is where the "rigor" mentioned in the video transcends coding standards and becomes a patient safety imperative. A bug in a productivity app is annoying; a bug in a clinical decision support tool can harm patients.

### The Dunning-Kruger Warning for Medical AI

Here's an uncomfortable truth: the ease of generating code with LLMs creates a dangerous illusion of competence. People who've never flown a plane might watch a video and think, "That looks manageable"—but they're entirely unaware of the complexity they can't see.

The same applies to medical software. Someone with no clinical background can now generate a "diabetes management app" or a "medication interaction checker" in minutes. The code will run. It might even look professional. But it will almost certainly contain dangerous oversimplifications, missing contraindications, and flawed clinical logic that only a domain expert would recognize.

**This is why the "doctor" in "Doctors Who Code" matters more than ever.** Domain expertise isn't just an advantage; it's the only thing preventing a proliferation of superficially impressive but clinically dangerous tools.

When I built CodeCraftMD's medical billing logic, the AI could structure the code beautifully. But it took my years of experience to know:

- That modifier 59 can't be used with certain procedure combinations

- That global periods affect subsequent visit coding

- That certain diagnosis codes require supporting documentation for medical necessity

- That Medicare's rules differ from commercial payers in subtle but critical ways

These nuances aren't in the training data. They're in the lived experience of practicing medicine.

## Motivation is the New Competitive Advantage

The video I'm drawing from concludes with a powerful insight: in a world where technical barriers have collapsed, **motivation becomes the key differentiator**. When anyone can generate code, what separates successful builders from perpetual dreamers isn't skill—it's the drive to actually ship something.

For physician-developers, this resonates deeply. I've lost count of the conversations that start with "I have this great idea for an app" and end with "but I don't have time to learn to code." The learning-to-code excuse is evaporating. What remains is the fundamental question: are you motivated enough to take your clinical frustration and transform it into a working tool?

This is simultaneously liberating and challenging. Liberating because the technical gatekeeping that once existed is gone—if you can clearly articulate a clinical problem, you can build a solution. Challenging because there are no more external barriers to hide behind. The only thing standing between your idea and a functional tool is your willingness to iterate through the messy process of building something real.

### Building Small, Building Now

My challenge to physician-developers is this: **stop waiting for the perfect platform and start building small, disposable tools that solve your immediate clinical headaches.**

That patient education workflow that frustrates you every Tuesday afternoon? Build a chatbot for it this weekend. It doesn't need to handle every conceivable scenario or be maintained forever. It just needs to solve your specific problem for your specific patients.

That data export that requires manual reformatting every week? Spend 10 minutes generating a script. If it breaks in six months, spend another 10 minutes fixing it.

That prior authorization letter you write variations of twenty times per month? Create a template generator. Version 1 doesn't need to be sophisticated; it just needs to save you time on Monday morning.

These tools won't make you rich. They might not even impress your colleagues. But they'll make your clinical life incrementally better, and that's the entire point. The cumulative effect of a dozen small, disposable tools can be transformative for your practice efficiency and clinical satisfaction.

## The Gap Has Closed: What's Stopping You?

In the era of LLMs, the gap between a clinical idea and a working tool is effectively zero. The technology barriers that once prevented physicians from building software have collapsed. What remains is:

1. **Domain expertise** - You already have this

3. **Clear problem articulation** - You live this daily

5. **Motivation to build** - This is the only missing piece

The future of medical software isn't another monolithic EHR platform or another venture-backed startup promising to "revolutionize healthcare." It's thousands of physicians building small, specific, disposable tools that solve their unique clinical problems. It's the democratization of medical software development, where the people who understand the problems are empowered to create the solutions.

This is the mission of Doctors Who Code—not to turn physicians into software engineers, but to illuminate the path from clinical frustration to functional tool. In 2025, that path is shorter than ever. The only question is whether you'll walk it.


## About the Author

**Chukwuma Onyeije, MD, FACOG** is a board-certified Maternal-Fetal Medicine specialist and the Medical Director at Atlanta Perinatal Associates. He is the founder of CodeCraftMD, an AI-powered medical billing and documentation platform, and writes about the intersection of medicine and technology at [Doctors Who Code](https://www.doctorswhocode.blog/). His work focuses on empowering physicians to leverage technology to solve clinical problems without becoming full-time software engineers.

When he's not managing high-risk pregnancies or building medical software, Dr. Onyeije serves as an elder at Atlanta North Seventh-day Adventist Church and writes about theology at [Chukwuma Theology](https://substack.com/@chukwumatheology).


## Key Takeaways for Physician-Developers

- **Code is now cheap to generate**, but clinical expertise remains irreplaceable—your medical knowledge is your competitive advantage

- **Focus on "disposable" tools** that solve immediate, specific problems rather than building permanent, universal platforms

- **Embrace the clinical scratchpad mindset**: build quickly, use immediately, regenerate when broken

- **Your role is architect, not coder**: concentrate on clinical logic and edge cases, not syntax

- **Patient safety requires vigilance**: never trust AI-generated medical code without thorough clinical review

- **Motivation is the new barrier**: the technical obstacles are gone; what remains is the willingness to build


_Have you built disposable clinical tools? What small problems in your practice could benefit from a custom, temporary solution? Share your experiences in the comments below, or reach out to me directly—I'd love to hear what you're building._

**Tags**: #PhysicianDevelopers #MedicalAI #LLMCoding #ClinicalSoftware #HealthTech #AIinMedicine #MedicalProductivity #PhysicianEntrepreneur #ClinicalInformatics #HealthcareInnovation
