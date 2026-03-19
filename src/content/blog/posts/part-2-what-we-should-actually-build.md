---
audioUrl: /audio/part-2-what-we-should-actually-build.mp3
author: Chukwuma Onyeije, MD, FACOG
category: Healthcare Technology
description: Maternal-Fetal Medicine Specialist & Founder, CodeCraftMD
draft: false
pubDate: 2026-02-08
tags:
- aiinmedicine
- clinicalai
- clinicaldecisionsupport-2
- codecraftmd-2
- digitalhealth-2
- healthcareai-2
- healthcareautomation-2
- healthcarepolicy
- healthequity
- healthit-2
- maternalfetalmedicine-2
- medicalinnovation
- opensourcehealthcare
- physiciandevelopers-2
- pointofcareultrasound
- priorauthorization
- remotepatientmonitoring
- ruralhealthcare
- ruralmedicine
title: 'Part 2: What We Should Actually Build'
---

# The Physician-Developer's Blueprint for Rural AI That Works

**By Chukwuma Onyeije, MD, FACOG**  
_Maternal-Fetal Medicine Specialist & Founder, CodeCraftMD_


![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/02/blurprint2-1024x511.png)

In [Part 1](https://claude.ai/chat/link), I showed you the math: **$50 billion for AI "transformation" while cutting $137 billion from rural Medicaid.** A textbook bait-and-switch where vendor-built "avatars" replace actual clinical capacity.

But physician-developers don't just identify broken systems. **We build the alternatives.**

So here's the technical counter-narrative. If we genuinely have $10 billion annually to transform rural healthcare, here's what we should actually code—and why it matters more than a talking head on a screen.

## The Core Principle: Amplify, Don't Replace

The avatar model starts from a fundamentally broken premise: that the limiting factor in rural healthcare is _access to medical conversation_.

That's not the problem. **The problem is clinical capacity, diagnostic capability, and administrative overhead crushing small practices into closure.**

Every line of code we write should answer one question: **Does this extend what a rural provider can do, or does it justify their absence?**

Let's build tools that pass that test.


## Solution 1: Intelligent Remote Patient Monitoring (Not Passive Data Collection)

### The Problem with Current RPM

Right now, most remote patient monitoring is glorified data hoarding. A patient with gestational diabetes uploads 120 glucose readings per month. A nurse manually reviews them during a 15-minute phone call. High-risk patterns get missed. Low-risk patients get over-contacted.

**This scales terribly in rural settings where one nurse might cover 200 patients across three counties.**

### What We Should Build Instead

**AI-powered trend analysis that acts as a clinical early warning system.**

Here's the architecture:

```
Patient Data Layer (CGM, BP monitors, weight scales)
         ↓
Local Edge Processing (privacy-preserving inference)
         ↓
Trend Analysis Engine (time-series ML models)
         ↓
Risk Stratification API
         ↓
Provider Dashboard (flagged patients only)
```

### The Clinical Implementation

Imagine a rural family medicine physician managing 50 patients with Type 2 diabetes. Instead of reviewing 1,500 glucose readings weekly, an ML model:

- **Identifies the 3 patients** whose fasting glucose is trending upward despite stable carb intake

- **Flags the 1 patient** showing postprandial spikes suggesting medication non-adherence

- **Generates differential prompts**: "Consider dose adjustment vs. dietary recall vs. intercurrent illness"

The physician reviews **4 actionable alerts** instead of **1,500 data points.**

**This is force multiplication, not replacement.**

### The Maternal-Fetal Medicine Use Case

In my practice, we monitor high-risk pregnancies with conditions like gestational diabetes, chronic hypertension, and preeclampsia. A pregnant patient in rural Georgia might be 90 miles from the nearest MFM specialist.

**Current model:** Patient checks BP twice daily. Calls if >140/90. Often calls too late.

**AI-enhanced model:**

- Continuous home BP monitoring with edge device

- ML model trained on preeclampsia progression patterns

- Alerts trigger at **trend changes** (rising baseline, loss of nocturnal dip, increasing variability)

- Provider gets: "Patient X showing early preeclampsia hemodynamic signature. Current BP 138/88. Recommend urgent lab work and specialist consultation."

**This catches the disease at stage 0, not stage 3.**

### Why This Beats an Avatar

**Avatar approach:** Patient asks, "Is my blood pressure too high?" AI responds, "Let me connect you to a provider."

**Intelligence approach:** System detects hypertensive pattern three days before patient notices symptoms. Provider intervenes before end-organ damage.

**Cost comparison:**

- Enterprise avatar licensing: $500-800 per patient annually

- Edge ML inference on consumer devices: $50-120 per patient annually

- **Outcome difference:** One prevents ER visits. The other documents them.


## Solution 2: AI-Assisted Point-of-Care Diagnostics

### The Specialist Access Problem

Rural patients don't need more conversations with generalists. **They need specialist-level diagnostic capability delivered locally.**

In maternal-fetal medicine, I routinely see patients who drove 3+ hours for a level II ultrasound that revealed normal anatomy. The referring provider simply lacked the imaging interpretation expertise to rule out abnormalities locally.

### What We Should Build

**AI-augmented point-of-care ultrasound (POCUS) that gives rural providers "specialist vision."**

Technical stack:

```
Handheld Ultrasound Device
         ↓
Real-time Image Acquisition
         ↓
Computer Vision Model (trained on labeled pathology)
         ↓
Probability Heat Maps + Differential Guidance
         ↓
Local Provider Decision Support
```

### The Clinical Workflow

A rural family medicine physician sees a 28-week pregnant patient with mild abdominal pain. Standard care: refer to MFM 100 miles away for placental location assessment.

**AI-enhanced workflow:**

1. Provider performs bedside ultrasound (10 minutes)

3. CV model analyzes in real-time:
    - Placental location: **Fundal, 4.2cm from internal os**
    
    - Amniotic fluid index: **Normal**
    
    - Fetal presentation: **Cephalic**
    
    - Confidence scores provided for each measurement

5. AI suggests: **"Low clinical suspicion for placental abruption or previa. Consider GI workup before MFM referral."**

7. Provider orders appropriate labs, avoids unnecessary 200-mile round trip

**Result:** Appropriate care delivered locally. Specialist referrals reserved for actual pathology.

### The Counter-Argument (And Why It's Wrong)

_"But AI can miss things! You need a specialist!"_

True. And specialists will still exist for complex cases. But here's the current reality:

**Status quo:** Patient can't access specialist at all due to distance/cost/wait times. Goes untreated or presents emergently.

**AI-augmented model:** Local provider catches 85-90% of pathology locally. Refers true positives appropriately. Prevents unnecessary specialist burden on low-risk cases.

**Perfect is the enemy of good. And "good" is infinitely better than "nothing."**


## Solution 3: Administrative Automation That Prevents Clinic Closure

### The Hidden Rural Healthcare Crisis

Here's what most AI enthusiasts miss: **Rural clinics don't close because they lack patients. They close because administrative overhead makes them financially unviable.**

The average rural family medicine practice spends:

- **16 hours/week** on prior authorizations

- **12 hours/week** on billing/coding reconciliation

- **8 hours/week** on insurance claim denials/appeals

- **10 hours/week** on clinical documentation

**That's 46 hours of administrative work per week for a 2-physician practice.** At locum rates, that's $400K+ in lost clinical productivity annually.

### What We Should Build

**Not an avatar. An administrative AI agent that eliminates pajama time.**

Here's what CodeCraftMD does (and what rural-focused versions should do):

#### 1\. Ambient Documentation That Works Offline

**The problem with current AI scribes:** They require high-bandwidth internet. Rural clinics often have 5-10 Mbps connections that drop during storms.

**The solution:**

```
Local Speech-to-Text Model (Whisper or equivalent)
         ↓
Edge Processing for Clinical Note Generation
         ↓
Batch Upload to EMR when connectivity available
         ↓
Local LLM for ICD-10/CPT extraction
```

**Technical implementation:**

- Deploy on-premise server with GPU (one-time $5-8K)

- Local models (Whisper + LLaMA fine-tuned on clinical notes)

- Zero cloud dependency for core functionality

- Sync to EMR when bandwidth available

**Financial impact:** Saves 8-10 hours/week of documentation time. ROI in 6-8 months.

#### 2\. Intelligent Prior Authorization Automation

**Current process:** Physician or staff manually:

1. Checks payer requirements (15-30 min)

3. Gathers clinical documentation

5. Fills out authorization forms

7. Faxes/portals to insurance

9. Follows up on status

11. Appeals denials

**Total time per PA:** 45-90 minutes  
**Rural practice volume:** 30-50 PAs weekly  
**Physician time lost:** 22-75 hours weekly

**AI-automated workflow:**

```
# Pseudo-code for PA automation agent

def process_prior_auth(patient_id, medication, diagnosis):
    # Extract patient clinical context
    clinical_data = emr.get_patient_summary(patient_id)
    
    # Identify payer requirements
    payer_rules = insurance_db.get_criteria(
        payer=patient.insurance,
        drug=medication,
        diagnosis=diagnosis
    )
    
    # Generate justification using clinical AI
    justification = llm.generate_medical_necessity(
        clinical_data=clinical_data,
        payer_criteria=payer_rules,
        evidence_base=uptodate_api.get_guidelines(diagnosis)
    )
    
    # Auto-populate and submit PA form
    pa_form = payer_api.fill_form(justification)
    submission = payer_api.submit(pa_form)
    
    # Track and escalate if denied
    if submission.status == "denied":
        appeal_agent.initiate_appeal(submission)
    
    return submission.tracking_number
```

**Financial impact:** Reduces PA time from 60 min to 5 min. Saves 15-20 hours weekly. **This is the difference between a viable rural practice and closure.**

#### 3\. Smart Billing Code Optimization

**The revenue cycle problem:** Small practices leave 15-25% of revenue on the table due to:

- Undercoding (using 99213 when 99214 justified)

- Missing secondary diagnoses

- Incomplete documentation for complexity levels

**AI solution:**

- Real-time clinical note analysis

- Suggest appropriate E/M levels based on documented elements

- Flag missing documentation for higher complexity codes

- Identify billable diagnoses mentioned but not coded

**Example output:**

```
Current coding: 99213 (Level 3 office visit)
AI recommendation: 99214 (Level 4 office visit)

Rationale:
✓ Detailed history documented
✓ Detailed exam documented  
✓ Moderate complexity MDM (3 diagnoses addressed)
✓ >25 minutes documented

Missing element for 99215: None required

Potential revenue recovery: +$75 per visit
Annual impact (2000 visits): +$150,000
```

**This isn't about gaming the system. It's about getting paid appropriately for the work actually performed.**


## Solution 4: Asynchronous Specialty Consultation Platforms

### The "Waiting for the Specialist" Problem

A rural patient with a complex obstetric finding doesn't need a real-time video call with a maternal-fetal medicine specialist. **They need expert interpretation of their diagnostic studies and evidence-based management recommendations.**

### The Platform Architecture

```
Rural Provider Workflow:
1. Upload clinical summary + imaging
2. Standardized intake form (AI-assisted)
3. Encrypted transmission to specialist pool

Specialist Workflow:
1. AI pre-screens and risk-stratifies cases
2. Presents cases in priority order
3. Specialist reviews and responds (24-48 hours)
4. AI formats response for EMR integration

Rural Provider Follow-up:
1. Receives structured consultation note
2. Implements recommendations locally
3. Escalates to synchronous consult if needed
```

### Why This Works Better Than Synchronous Telemedicine

**Traditional telemedicine:** Both parties must be available simultaneously. Scheduling nightmare. Specialist time inefficiently used.

**Asynchronous + AI workflow:**

- Specialist reviews 12-15 cases in 2 hours vs. 4-5 synchronous consults

- Rural provider doesn't wait on hold or deal with scheduling

- AI handles intake, formatting, EMR integration

- **3x efficiency gain without sacrificing quality**

### The MFM Use Case

**Scenario:** 32-week pregnant patient in rural Alabama. Routine ultrasound shows possible fetal anomaly.

**Current pathway:**

1. OB refers to MFM (nearest: 180 miles away)

3. Patient schedules (2-3 week wait)

5. Drives 6+ hours round trip

7. Level II ultrasound performed

9. Results: Normal variant, no intervention needed

**Total cost:** $800 (ultrasound) + $200 (gas/time) + anxiety + lost work  
**Total time:** 3 weeks + 8 hours travel

**AI-enhanced asynchronous pathway:**

1. Rural OB uploads images to consultation platform

3. AI pre-analysis flags relevant anatomy, measurements

5. MFM specialist reviews within 24 hours

7. Response: "Normal variant. Recommend routine follow-up."

**Total cost:** $150 (specialist review)  
**Total time:** 24-48 hours  
**Patient travel:** Zero

**Outcome:** Same clinical endpoint. 80% cost reduction. 90% time reduction. Zero patient burden.


## The Real Cost Comparison

Let's put actual numbers on this.

### The "Avatar" Allocation (Current RHTP Model)

For a rural clinic serving 5,000 patients:

| Line Item | Annual Cost |
| --- | --- |
| Enterprise AI Avatar Platform | $500/patient × 5000 = **$2.5M** |
| Implementation Services | **$300K** |
| Training & Change Management | **$150K** |
| Ongoing Licensing | **$200K** |
| **Total** | **$3.15M** |

**Clinical capacity added:** Zero physicians, zero nurses  
**Hospital beds added:** Zero  
**ER closures prevented:** Zero

### The Physician-Built Alternative

Same $3.15M budget, different priorities:

| Solution | Annual Cost | Clinical Impact |
| --- | --- | --- |
| AI-Enhanced RPM (5000 patients) | $600K | Prevents 200+ ER visits annually |
| Administrative Automation Suite | $400K | Saves 40 hrs/week physician time |
| AI-Assisted POCUS Platform | $250K | Reduces unnecessary specialist referrals 30% |
| Asynchronous Consult Network | $300K | Provides specialist access for 800+ cases/year |
| Part-time Rural Physician Subsidy | $1.2M | Actual human clinical capacity |
| Rural Nurse Practitioner Team (2 FTE) | $400K | Extended primary care hours |
| **Total** | **$3.15M** | **Actual healthcare delivery** |

**Notice the difference?** The second model keeps clinicians employed, extends diagnostic capability, reduces administrative burden, AND provides direct patient care.

**That's transformation. The first model is just expensive performance art.**


## A Call to Action for MD-Coders

The Rural Healthcare Transformation Program applications are being drafted **right now**. State health departments are soliciting technical proposals. Vendors are positioning their avatar platforms.

**We have a narrow window to influence this.**

### What You Can Do This Week

**1\. Build technical counter-proposals**

- Download your state's RHTP application requirements

- Submit white papers showing cost-effectiveness of physician-built alternatives

- Provide concrete ROI analyses comparing avatars vs. augmentation tools

**2\. Connect with rural providers**

- Identify struggling rural clinics in your region

- Offer to pilot administrative automation tools

- Document outcomes: time saved, revenue recovered, satisfaction scores

**3\. Publish the alternatives**

- Write technical blog posts showing what could be built

- Share cost breakdowns on LinkedIn, Twitter/X, physician forums

- Make the invisible visible: force the comparison

**4\. Pressure your representatives**

- Contact state legislators reviewing RHTP applications

- Provide physician-developer perspective on policy

- Ask specific question: "Why are we funding avatars instead of augmentation?"

### The Development Community's Role

If you're a physician-developer, **this is your moment.**

Not to build chatbots that simulate care. Not to create avatar interfaces that look impressive in demos. Not to enable the managed retreat from rural America.

**Your job is to build tools that make it sustainable for physicians to practice in underserved communities.**

That means:

- AI that reduces documentation burden

- ML that extends diagnostic capability

- Automation that eliminates administrative waste

- Platforms that facilitate specialist access

**Code with purpose. Code for the humans who can't be replaced.**


## What I'm Building

I'm putting my code where my convictions are.

**CodeCraftMD** is being rebuilt specifically for small practices and rural clinics:

1. **Offline-first architecture** - Works without high-speed internet

3. **Privacy-preserving edge ML** - Patient data never leaves the local network

5. **Transparent cost structure** - No per-patient enterprise licensing nonsense

7. **Open-source core** - Because rural providers deserve to own their tools

The MFM-specific modules I'm developing:

- **PreeclampsiaWatch**: ML-powered early warning system for hypertensive disorders of pregnancy

- **GDM Intelligence Engine**: Automated gestational diabetes trend analysis and intervention recommendations

- **Ultrasound Interpretation Assistant**: Computer vision for fetal anatomy screening

**None of these replace clinical judgment. All of them amplify clinical capability.**

That's the difference.


## The Bottom Line

We're at a fork in the road.

One path: $50 billion for vendor-built avatars that provide simulated healthcare while actual clinical infrastructure collapses.

The other path: Physician-built AI that extends what rural providers can do, keeps clinics financially viable, and maintains human-centered care.

**The code you write in the next 12 months will determine which path we take.**

Don't build the avatar.  
Build the bridge.  
Build the tool that keeps a rural physician in practice.  
Build the logic that catches disease early instead of documenting it late.

**And build it now, because rural America doesn't have time for another policy cycle.**

_Dr. Chukwuma Onyeije is a board-certified Maternal-Fetal Medicine specialist and the founder of CodeCraftMD. He builds AI tools that augment clinical capability rather than replace it. Connect with him at [DoctorsWhoCode.blog](https://claude.ai/chat/link) or follow the development of physician-built healthcare AI tools on GitHub._


## Tags

`#RuralHealthcare` `#AIinMedicine` `#HealthcareAI` `#PhysicianDevelopers` `#ClinicalAI` `#HealthIT` `#MedicalInnovation` `#RemotePatientMonitoring` `#PointOfCareUltrasound` `#HealthcareAutomation` `#MaternalFetalMedicine` `#CodeCraftMD` `#HealthEquity` `#DigitalHealth` `#OpenSourceHealthcare` `#HealthcarePolicy` `#RuralMedicine` `#PriorAuthorization` `#ClinicalDecisionSupport` `#HealthcareTransformation`

## SEO Keywords

- Rural healthcare AI solutions

- Physician-built medical AI

- Remote patient monitoring rural areas

- AI-assisted point-of-care ultrasound

- Medical practice administrative automation

- Rural clinic financial sustainability

- Asynchronous telemedicine platforms

- Maternal-fetal medicine AI tools

- Healthcare AI for underserved communities

- Open-source clinical AI

- Rural hospital closure prevention

- Medical billing automation

- Prior authorization AI

- Clinical documentation automation

- Physician developer healthcare solutions


"A maternal-fetal medicine specialist's technical blueprint for rural healthcare AI that amplifies providers instead of replacing them. Real solutions."

**Title Tag (60 characters):**  
"What Rural Healthcare AI Should Actually Look Like"