---
title: "From Evidence to Software"
description: "Turn one clinical protocol into explicit, testable application logic while preserving evidence limits, provenance, and the physician checkpoint."
path: "build-medical-software"
difficulty: "intermediate"
outcomes:
  - "Create an evidence card that preserves population, effect size, limitations, and review dates."
  - "Decompose a clinical protocol into inputs, outputs, exceptions, sources, and judgment points."
  - "Translate protocol prose into an inspectable logic sheet with explicit failure states."
  - "Build and test a clinical engine separately from its interface."
  - "Apply the physician checkpoint and three-patient test before clinical use."
prerequisites:
  - "Basic familiarity with version control, structured data, and software testing."
  - "A bounded clinical protocol or guideline section suitable for translation."
estimatedMinutes: 38
project: "tested-clinical-calculator"
order: 2
status: "published"
---

Evidence does not become software in one step. It passes through interpretation, protocol design, logic extraction, implementation, testing, and clinical review.

This course makes that translation visible. The capstone is one working clinical application with its sources, boundaries, tests, and physician checkpoint preserved beside the code.
