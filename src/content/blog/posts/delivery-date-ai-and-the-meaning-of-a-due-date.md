---
title: "Delivery Date AI and the Meaning of a Due Date"
description: "What ultrasound-based delivery prediction means for clinical care, and how physician-developers can preserve its meaning in the medical record."
pubDate: "2026-09-10T11:00:00-04:00"
author: "Chukwuma Onyeije, MD, FACOG"
authorUrl: "https://www.linkedin.com/in/chukwumaonyeije"
category: "AI in Medicine"
tags:
  - "Clinical AI"
  - "Maternal-Fetal Medicine"
  - "Ultrasound"
  - "Physician Developer"
  - "Clinical Workflow"
image:
  url: "/images/posts/delivery-date-ai.png"
  alt: "Obstetric ultrasound monitor between separate calendars for Estimated Due Date and Predicted Delivery Date, with a shaded prediction range"
draft: false
featured: false
readingTime: 7
---

*What image-based prediction asks of the physicians who build clinical systems.*

An ultrasound report has a field for the estimated due date. A new AI system produces a predicted delivery date.

Both fit into the same calendar widget. Both can be stored as a date. They answer different clinical questions.

That is where my attention goes when I look at Delivery Date AI, the ultrasound software granted FDA De Novo authorization on February 11, 2026. The model is interesting. The moment its output enters the medical record deserves just as much scrutiny. [FDA device record](https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/denovo.cfm?id=DEN250007)

In maternal-fetal medicine, the meaning of a date travels. It moves into growth calculations, consultation notes, surveillance plans, and conversations with families. A field mapped incorrectly can carry a misunderstanding much farther than the original report.

Clinical software has to preserve the distinction that clinical reasoning depends on.

## Two dates answer two questions

The estimated due date, or EDD, anchors gestational age. It identifies the date on which a pregnancy is estimated to reach 40 weeks.

Consider an EDD of October 20. Delivery on October 8 does not, by itself, make the EDD wrong. The pregnancy ended before the date assigned to 40 weeks. Dating and delivery timing are separate observations.

Delivery Date AI produces a Predicted Delivery Date, or PDD: an estimate of the actual delivery event. The manufacturer's labeling explicitly distinguishes this output from a more accurate EDD. [Delivery Date AI](https://ultrasound.ai/)

That distinction needs to survive every transfer between systems. An export labeled `due_date` would be inadequate. A report that places the prediction beside the established EDD without explaining the difference would invite confusion.

I would preserve separate fields, separate labels, and a record of how each value was obtained. An image-derived prediction should never silently become the pregnancy's dating anchor.

This is a basic requirement of the data model. It is also a clinical responsibility.

## The image becomes an input in its own right

Conventional fetal biometry turns selected anatomy into measurements. We acquire a plane, place calipers, and interpret the resulting numbers in a clinical context.

Delivery Date AI applies machine learning to whole ultrasound images, including fetal and maternal characteristics. Its authorized use is limited to adults with singleton pregnancies from 14 weeks through 36 weeks and 6 days who lack a reliable EDD in the setting of unreliable menstrual dating and no first-trimester ultrasound. It is an adjunct to standard assessment and clinical judgment. [FDA classification order](https://www.accessdata.fda.gov/cdrh_docs/pdf25/DEN250007.pdf)

The architectural change is substantial. A model can learn associations across pixels without requiring us to specify every useful measurement in advance.

That opens a serious research question: how much clinically useful information remains in the images after we have extracted the measurements we routinely report?

The answer requires care. Whole-image analysis does not establish that a network has discovered the biological clock of parturition. It can learn anatomy, acquisition patterns, and correlations with the circumstances in which images were obtained. Predictive performance alone cannot tell us which explanation dominates.

For a physician who builds software, the interesting work begins with separating those possibilities.

## Read the error in days

The published PAIR study began with 5,714 patients, 19,940 ultrasound examinations, and 877,141 images from the University of Kentucky. Seventy-nine percent of patients supplied training data; the remainder were reserved for derivation and validation. Later versions incorporated additional images from the same institution. Version 4 achieved an all-birth R² of 0.92. [PAIR study](https://pubmed.ncbi.nlm.nih.gov/40717019/)

That number describes statistical fit. It does not mean that 92 percent of patients delivered on the predicted day.

A clinician needs to understand the size and distribution of the errors. An average can conceal a small group with large misses. A strong result across scans acquired over a broad span of pregnancy can conceal weaker performance within a particular clinical window.

The subgroup findings make that concern concrete. The initial model's sensitivity for preterm birth was 39 percent, with 93 percent specificity. In Version 4, the mean absolute error for spontaneous preterm birth remained 19.99 days. [PAIR study](https://pubmed.ncbi.nlm.nih.gov/40717019/)

Those results belong to particular research versions and populations. They should not be presented as interchangeable performance claims for the authorized commercial device.

The regulatory boundary is explicit: the output is not intended to predict or assess preterm-birth risk. A software team should therefore resist converting an early PDD into an automatic preterm-risk alert. [FDA classification order](https://www.accessdata.fda.gov/cdrh_docs/pdf25/DEN250007.pdf)

The label attached to an output determines what people believe they can do with it.

## Delivery is also a decision

Actual delivery date is an unusually complicated training target.

Some pregnancies end with spontaneous labor. Others end because a clinical team decides that continuing the pregnancy carries greater risk. Scheduled procedures, local protocols, referral patterns, and patient preferences also shape the recorded endpoint.

Consider a hypothetical fetus with growth restriction. An image may contain features associated with that diagnosis. If the training institution follows a consistent delivery pathway for those pregnancies, the model may learn an association between the image and that pathway's endpoint.

That prediction can be useful. Its usefulness may depend on how closely the receiving institution's care resembles the training institution's care.

This is why I would want external validation across hospitals with different patient populations and management practices. I would want scheduled, indicated, and spontaneous deliveries examined separately. I would also want comparisons against clinical baselines that account for available gestational-age information and relevant history.

The question is how much the image adds, and under which conditions that addition remains reliable.

There is a second problem once the prediction becomes visible. Clinicians may change management in response to it. The model then participates in producing the outcome against which its accuracy is measured.

An audit must therefore examine decisions as well as dates. Agreement with the eventual delivery date is insufficient if the prediction helped determine when delivery occurred.

## Put the human checkpoint into the workflow

The company describes a cloud-based product that generates a PDD from ultrasound imaging. That is the product's computational function. A practice still has to design the clinical workflow around it. [Delivery Date AI](https://ultrasound.ai/)

I would begin with the human checkpoint: the deliberate place where a clinician reviews the output, understands its limitations, and decides whether it contributes anything to the assessment.

That checkpoint needs more than a button marked “reviewed.”

The clinician should be able to identify the source examination, the time the prediction was generated, and the model version. The interface should make the distinction between PDD and EDD visible where the result appears. Available uncertainty information should accompany the estimate; when an individual prediction interval is unavailable, the interface should make that limitation clear. A population mean absolute error cannot be relabeled as the patient's prediction interval.

The system also needs a defined failure state. An incomplete upload, unsupported examination, or failed analysis should produce an explicit status. An old prediction left on screen can otherwise look like a new result.

Then comes the operational question: who owns the result?

If the answer requires a sonographer to export images, open a separate website, retrieve a date, and manually copy it into a report, the practice has acquired another coordination task. The low-value tax has simply moved to a different screen.

An integration should reduce that work while preserving review. Automated image routing and result retrieval are reasonable engineering goals. Automatic redating or treatment decisions are separate clinical actions that require their own justification.

The workflow should make those boundaries observable.

## Build around the meaning

Delivery Date AI brings a useful question into view: can routine ultrasound images support predictions beyond the measurements we already extract?

The research gives us a reason to investigate. The regulatory indication defines a specific clinical scope. Neither removes the work of deciding how a prediction should be displayed, interpreted, and monitored in a particular practice.

That is work for physicians who understand the clinical consequences and can express them in software. We should be able to specify the fields, identify the failure states, and insist that the audit captures what the output caused people to do.

The model produces a date. We are responsible for preserving its meaning all the way to the clinical decision.
## Companion podcast

Listen to **Delivery Date AI: The Due Date Is an Image Now**, an additional podcast accompanying this article.

<audio controls preload="metadata" aria-label="Companion podcast: Delivery Date AI, The Due Date Is an Image Now" style="width: 100%; margin: 1rem 0;">
  <source src="/audio/delivery-date-ai-companion-podcast.mp3" type="audio/mpeg" />
  Your browser does not support audio playback.
</audio>

[Download the companion podcast](/audio/delivery-date-ai-companion-podcast.mp3).
