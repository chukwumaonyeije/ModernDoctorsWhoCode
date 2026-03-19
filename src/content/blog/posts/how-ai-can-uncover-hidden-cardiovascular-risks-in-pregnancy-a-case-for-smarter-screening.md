---
audioUrl: /audio/how-ai-can-uncover-hidden-cardiovascular-risks-in-pregnancy-a-case-for-smarter-screening.mp3
author: Chukwuma Onyeije, MD, FACOG
category: Technology
description: 'An analysis of: Gestational Blood Pressure Trajectories and 5-Year Postpartum
  Hypertension Risk in the MADRES Study'
draft: false
pubDate: 2025-03-24
title: 'How AI Can Uncover Hidden Cardiovascular Risks in Pregnancy: A Case for Smarter
  Screening'
---

An analysis of: _[Gestational Blood Pressure Trajectories and 5-Year Postpartum Hypertension Risk in the MADRES Study](https://www.jacc.org/doi/10.1016/j.jacadv.2025.101660)_

# Deep Dive Podcast:

![](https://doctorswhocode.blog/wp-content/uploads/2025/03/chukwumaonyeije_Hidden_Cardiovascular_Risks_in_Pregnancy_.png)

## Why It Matters

Cardiovascular disease remains the leading cause of maternal morbidity in the United States. As clinicians, we rely on blood pressure thresholds and diagnostic criteria to identify at-risk patients — but what if your patient appears normal during pregnancy while their blood pressure patterns tell another story?

A groundbreaking 2025 study published in JACC: Advances reveals that subclinical blood pressure patterns during pregnancy may be silent signals for future cardiovascular disease. More importantly, these patterns are ones our current screening protocols completely miss.

## The Science Behind the Study

The MADRES Study, led by Niu and colleagues, followed 854 low-income, predominantly Hispanic women from pregnancy through 5 years postpartum. Using sophisticated statistical methods, the researchers identified three distinct systolic blood pressure (SBP) trajectories:

1. **Consistently Low (80.2%)** – SBP remained low throughout pregnancy with the expected mid-pregnancy dip

3. **High-Drop-High (7.4%)** – Elevated SBP early in pregnancy followed by a mid-pregnancy dip, then elevation again—a pattern associated with hypertensive disorders of pregnancy (HDP)

5. **Consistently Elevated (12.4%)** – Slightly elevated SBP that remained in the clinically "normal" range but notably lacked the usual mid-pregnancy dip

The most striking finding? Women in the "Consistently Elevated" group were nearly 5 times more likely to develop hypertension within 5 years postpartum—even though they didn't meet any current diagnostic criteria for hypertension during pregnancy.

Let that sink in. These women appeared clinically normal throughout their pregnancies. Their blood pressure readings never crossed the threshold into hypertension. Yet, the absence of the physiological second-trimester BP dip proved to be a powerful predictor of future cardiovascular risk.

## Where AI Comes In

This is precisely where artificial intelligence and machine learning offer tremendous value to clinical practice. Our human eyes might not catch subtle patterns across dozens of prenatal visits, but AI can:

- Analyze blood pressure data longitudinally through trajectory modeling

- Identify non-obvious risk patterns like absent mid-pregnancy dips

- Alert clinicians to subclinical cardiovascular maladaptations before they progress to disease

In practical terms, latent class growth modeling (as used in the MADRES study) could be embedded directly into electronic health record systems. AI-driven dashboards could flag patients who appear "normal" but display abnormal trends over time. Predictive models could incorporate variables like SBP trajectories, BMI, gestational age, and environmental exposures to generate personalized risk scores.

## Practical Tools for Clinicians Who Code

If you're a physician who codes (or works closely with data scientists), you can implement these approaches with open-source tools:

### R Implementation

```
# Using lcmm package for latent class trajectory modeling
library(lcmm)
library(dplyr)

# Prepare longitudinal BP data
bp_data <- patient_data %>%
  group_by(patient_id, gestational_week) %>%
  summarize(sbp = mean(systolic_bp))

# Fit latent class model with 3 classes
bp_model <- lcmm::hlme(
  fixed = sbp ~ gestational_week + I(gestational_week^2),
  mixture = ~ gestational_week + I(gestational_week^2),
  random = ~ gestational_week,
  subject = "patient_id",
  ng = 3,
  data = bp_data
)

# Extract class membership
patient_classes <- as.data.frame(bp_model$pprob)

# Flag patients in the "Consistently Elevated" group (class 2 in this example)
at_risk_patients <- patient_classes %>%
  filter(class == 2) %>%
  select(patient_id)
```

### Python Implementation

```
import pandas as pd
import numpy as np
from sklearn.mixture import GaussianMixture
from scipy import stats

# Prepare data
bp_by_patient = df.groupby(['patient_id', 'gestational_week'])['systolic_bp'].mean().reset_index()

# Convert to wide format for modeling
bp_wide = bp_by_patient.pivot(index='patient_id', columns='gestational_week', values='systolic_bp')

# Fill missing values (optional)
bp_wide = bp_wide.interpolate(axis=1)

# Fit Gaussian Mixture Model
gmm = GaussianMixture(n_components=3, random_state=42)
clusters = gmm.fit_predict(bp_wide)

# Identify cluster with consistently elevated BP (no mid-pregnancy dip)
# This requires clinical interpretation of cluster characteristics
means = gmm.means_
consistently_elevated_cluster = 1  # Substitute with actual cluster index

# Flag at-risk patients
bp_wide['cluster'] = clusters
at_risk_patients = bp_wide[bp_wide['cluster'] == consistently_elevated_cluster].index.tolist()
```

The workflow is straightforward:

1. Collect BP at each prenatal visit

3. Use Python or R to model SBP trends

5. Flag patients with missing mid-pregnancy dips or consistent elevation

7. Output risk score or summary to clinician

## What This Means for Perinatal Care

This research demands a significant shift from threshold-based to pattern-based risk detection in prenatal care. By integrating AI tools into both active prenatal monitoring and "Fourth Trimester" follow-up care, we can identify at-risk women who would otherwise fall through the cracks of our current screening protocols.

For physicians who code, this represents an opportunity to develop custom tools that improve patient-specific outcomes. A simple algorithm that flags women with absent mid-pregnancy BP dips could potentially save lives by enabling early intervention for cardiovascular disease.

## AI Use Cases Beyond This Study

The applications extend well beyond identifying postpartum hypertension risk:

1. AI models could analyze pregnancy data to identify long-term cardiac risk profiles

3. Integration of wearable BP monitors with EHR data could enable continuous risk assessment

5. Predictive modeling could optimize postpartum care scheduling and medication interventions

7. Machine learning could identify novel biomarkers by correlating BP patterns with other physiological measures

## The Path Forward

As physicians, we have the data. As coders, we have the tools. It's time to bridge the gap between what we see and what we miss in prenatal care.

By implementing AI algorithms to detect subtle blood pressure patterns, we can identify that critical 12.4% of women who appear normal by conventional standards but carry a significantly elevated risk of future cardiovascular disease.

The question isn't whether we can afford to implement these AI approaches—it's whether we can afford not to.

Interested in these issues? Join us at [https://preeclampsiawatch.com/](https://preeclampsiawatch.com/)


_This blog post is based on research by Niu Z. et al. published in JACC: Advances (2025): "Gestational Blood Pressure Trajectories and 5-Year Postpartum Hypertension Risk in the MADRES Study"_

[niu-et-al-2025-gestational-blood-pressure-trajectories-and-5-year-postpartum-hypertension-risk-in-the-madres-study](https://doctorswhocode.blog/wp-content/uploads/2025/03/niu-et-al-2025-gestational-blood-pressure-trajectories-and-5-year-postpartum-hypertension-risk-in-the-madres-study.pdf)[Download](https://doctorswhocode.blog/wp-content/uploads/2025/03/niu-et-al-2025-gestational-blood-pressure-trajectories-and-5-year-postpartum-hypertension-risk-in-the-madres-study.pdf)