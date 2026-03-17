---
title: "From Patient Data to Open Source: Why I Built the Performance Glycemic Intelligence System (PGIS)"
pubDate: 2026-02-25
category: "Technology"
author: "Chukwuma Onyeije, MD, FACOG"
draft: false
image:
  url: "/images/posts/pgis-infographic.png"
  alt: "PGIS Performance Glycemic Intelligence System infographic"

description: "As a physician-developer and a 60-year-old endurance athlete living with Type 2 diabetes for over two decades, I have navigated a unique intersection of..."
---

As a physician-developer and a 60-year-old endurance athlete living with Type 2 diabetes for over two decades, I have navigated a unique intersection of medicine, technology, and personal health. My journey is a constant balancing act between the drive for athletic performance and the non-negotiable demands of glycemic control. This personal challenge is the crucible in which the Performance Glycemic Intelligence System (PGIS) was forged. Today, I am sharing not just the system itself, but the philosophy behind it, by releasing it as an open-source project on GitHub. This post is for my fellow physicians who code and for every individual with Type 2 diabetes striving for a life without limits.

At the heart of my work with this BLOG is a core belief: physicians must transition from being passive consumers of technology to active builders. We are the ones in the trenches of clinical care, and we possess an unmatched understanding of the intricate workflows and unmet needs within healthcare. PGIS is my personal embodiment of this principle. It is a direct response to the realization that existing commercial solutions, while excellent for general fitness, lacked the specific, nuanced integration of metabolic data required for an aging athlete managing a chronic condition like diabetes. I needed a system that prioritized not just speed, but durability; not just performance, but metabolic stability and long-term health.

## What is the Performance Glycemic Intelligence System (PGIS)?

PGIS is an integrated, data-driven decision-support framework designed to answer a critical question every morning: "What training is safe and effective for my body _today_?" It is not a commercial app, but a personal algorithm that synthesizes multiple, critical data streams to provide a clear, actionable recommendation.

| Data Category | Key Metrics | Source Example |
| --- | --- | --- |
| **Metabolic** | Fasting Glucose, CGM Trends | Dexcom CGM |
| **Cardiac** | Heart Rate Variability (HRV), Resting Heart Rate | Garmin Watch |
| **Recovery** | Sleep Duration & Quality, Subjective Soreness (DOMS) | Garmin Watch, Manual Input |
| **Training Load** | Recent Workout History, Strength Sessions | Manual Input |

This data is fed into a readiness algorithm that produces a simple, color-coded output: **GREEN** (proceed with planned training), **YELLOW** (modify training to reduce intensity/duration), or **RED** (rest and recover). This traffic-light model serves as a crucial gate, preventing overtraining, mitigating the risk of hypoglycemia, and optimizing the body’s metabolic and structural adaptations to exercise. It is a system built on the philosophy of #LBI or "Logs Before Intelligence"—a disciplined approach to data that precedes any meaningful insight.

![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/02/infographic-021726-572x1024.png)

## Why Open Source? A Call to Physician-Developers

The decision to place the PGIS framework on GitHub is a deliberate one, rooted in the mission to empower both clinicians and patients. For my fellow physician-developers, this project serves as both a practical tool and a call to action.

First, it champions **transparency over the "black box."** By open-sourcing the core logic, we invite scrutiny, collaboration, and trust. You can see the precise algorithms that translate raw data into a readiness score. This stands in stark contrast to proprietary systems where the decision-making process is opaque. As clinicians, we should demand to understand the logic behind the tools we use to guide patient care, and building our own is the ultimate expression of that demand.

Second, PGIS is a **foundation, not a fortress.** I have shared the complete templates—the Python scripts for readiness calculation and audio generation, the Markdown-based documentation, and the visual style guides. I encourage you to fork the repository, adapt the algorithms for different patient profiles, integrate new data sources, or build entirely new applications upon this framework. This is a starting point for physician-led innovation.

## Empowering Patients with Type 2 Diabetes

For individuals managing Type 2 diabetes, the open-sourcing of PGIS is a step toward reclaiming agency over your health. This project is built on a critical principle of **privacy by design.**

> ⚠️ **IMPORTANT: Privacy & Data Safety**  
> This repository contains TEMPLATE files only. It is intentionally designed so that you **never** commit your personal health data to a public repository. You create private, local copies of the profile and data files, which are explicitly ignored by Git. Your health information remains securely under your control.

This approach provides a powerful alternative to handing over sensitive health data to third-party applications. It equips you with a tool to have more informed conversations with your healthcare providers. By tracking your own data and understanding the patterns that PGIS helps reveal, you can move from being a passive recipient of medical advice to an active, informed partner in your own care. The system includes specific, hard-won safety protocols, such as criteria for safe fasted running and strategies to prevent post-strength training hypoglycemia—practical knowledge that can be life-changing.

## The Path Forward

Technology in medicine should not be about replacing the clinician's judgment, but augmenting it. It should restore our presence with the patient, automated by data-driven insights. PGIS is my contribution to this vision. It is a testament to the idea that the most powerful tools are often the ones we build ourselves, born from a deep understanding of the problem we aim to solve.

I invite you to explore the [PGIS GitHub repository](https://github.com/chukwumaonyeije/pgis-manus-skill), read the documentation, and consider how you might use or adapt it. Whether you are a physician looking to build, a developer interested in health tech, or a person with diabetes seeking to optimize your life, this project is for you. Let's build a healthier future, together.

Here are some samples created by my personal PGIS

[022326 Manus PGIS\_Daily\_Briefing\_&\_Microcycle\_Template](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/02/022326-Manus-PGIS_Daily_Briefing__Microcycle_Template.pdf)[Download](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/02/022326-Manus-PGIS_Daily_Briefing__Microcycle_Template.pdf)


Chukwuma I. Onyeije, MD, FACOG, Medical Director, Atlanta Perinatal Associates, Husband, Father, Elder, Marathoner, Vegan, Type 2 Diabetic

_Disclaimer: This system is for informational and educational purposes only. It is not medical advice and should not replace consultation with healthcare professionals. Always consult with your physician before making changes to your diabetes management or exercise routines._
