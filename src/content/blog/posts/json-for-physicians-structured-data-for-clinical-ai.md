---
audioUrl: /audio/json-for-physicians-structured-data-for-clinical-ai.mp3
title: "JSON for Physicians: The Structured Data Your Clinical AI Actually Needs"
description: "A physician's guide to JSON, FHIR JSON, and structured clinical data for APIs, interoperability, and medical AI."
pubDate: "2026-03-31T09:40:00-04:00"
author: "Chukwuma Onyeije, MD, FACOG"
authorUrl: "https://www.linkedin.com/in/chukwumaonyeije"
category: "AI in Medicine"
tags: ["json", "fhir", "interoperability", "clinical-data", "physician-developer", "medical-ai"]
draft: false
featured: false
readingTime: 8
---

Most physicians can tell when a note is technically complete but structurally
useless.

The information is there somewhere. A medication buried in a paragraph. A
critical lab trend hidden between copied text blocks. A follow-up plan mixed
into a wall of narrative. You can recover it, but only by spending attention
that should have gone to judgment.

Computers have the same problem, except worse.

If you want to build clinical tools, work with APIs, or use AI in a way that
produces something reliable, you need data in a format machines can read
cleanly. Not a paragraph. Not a note. Not a hand-wavy summary. A structure.

That is what JSON is.

Think of JSON as the structured lab report of software. Label on the left.
Value on the right. No storytelling, no ambiguity, no guessing what belongs
where. It is the format underneath modern APIs, FHIR data exchange, and a
large share of the tools physicians will need if we are serious about building
our own software instead of waiting for vendors to misread our workflows again.

If GitHub is where physician-builders learn to ship, JSON is where they learn
how clinical data actually moves.

And once you see that clearly, a lot of modern health tech stops looking
mysterious.

## What JSON Actually Is

JSON stands for JavaScript Object Notation. Forget the JavaScript part. You do not need to know how to write JavaScript to read or use JSON. It is a universal text format that any software system can understand, completely language-independent.

Think of JSON as the packaging format for data in transit. When an Epic server needs to send a patient's medication list to a mobile app, it does not send a PDF. It sends a JSON file.

At its core, JSON is a collection of **key-value pairs**. The "key" is the label, and the "value" is the data. In JSON, a label appears in quotes, followed by a colon, followed by the data. It strips away conversational language and leaves only raw, actionable information.

I recently watched a tutorial about using JSON to prompt AI image generators. The creator demonstrated how he uses AI to extract the metadata of an image (the lighting, the composition, the objects in the room) and output that data as a JSON file. He then modified specific values in the JSON and fed it back into the AI to generate a completely new image with identical styling. His core insight applies perfectly to clinical medicine: if a block of text is difficult for a human to scan for specific details, it is also going to confuse an AI model. JSON solves this by providing a clear, organized structure that acts like a precise instruction manual.

When you ask an AI model to extract clinical data from a patient transcript, you do not want it to write you a new essay. You want it to return a JSON object containing the exact diagnoses, medications, and follow-up plans in a format your database can ingest immediately. Structured data beats unstructured text every single time.

## Why Physicians Building Health Tech Must Understand JSON

My argument has always been direct: physicians with domain expertise should
build their own tools. We understand the clinical workflows. We know where the
friction points are. We know what data actually matters when a patient is
sitting in front of us.

But clinical intuition is not enough. If you want to build tools using Python, GitHub, Supabase, or Firebase, you have to understand how data moves between these systems.

When you make an API call to a large language model to summarize a clinical encounter, the response comes back as JSON. When you query your Supabase database for a list of high-risk obstetric patients, the database returns that list as JSON. If you cannot read and manipulate this format, you are entirely dependent on third-party developers. You become a consultant on your own project rather than the builder.

After thirty years in medicine, I have watched the transition from paper charts to early electronic records to API-driven platforms. The physicians who understand the underlying data structures are the ones who will shape the next generation of health technology.

## How JSON Shows Up in Clinical Systems

If you practice medicine today, you are generating and consuming JSON constantly, even if you never see the code.

The biggest push in health data interoperability right now is **HL7 FHIR** (Fast Healthcare Interoperability Resources). Previous versions of HL7 used a pipe-delimited format that was notoriously difficult to read. If you ever had to troubleshoot an old HL7v2 interface feed, you know the headache of counting pipes to figure out which field contained the patient's date of birth.

FHIR changed the standard by adopting JSON as its primary format. Every time a modern EHR uses a FHIR API to transmit a patient's demographic information, an allergy list, or a diagnostic report, that information is packaged as a JSON object.

When I build physician-facing tools for documentation and workflow automation,
I rely heavily on JSON. The system takes the transcript of a patient encounter,
processes it through an AI model, and forces the model to output a strict JSON
structure. This ensures the subjective complaints go to the right database
column, the physical exam findings go to their designated spot, and the ICD-10
billing codes are isolated for export. Without JSON, parsing that transcript
into a usable medical record would be far more brittle.

## A Simple Clinical JSON Example

Imagine you are pulling a patient's lab result via an EHR API. The server sends back a JSON object. Here is what a simplified FHIR R4 Observation resource looks like:

```json
{
  "resourceType": "Observation",
  "status": "final",
  "code": {
    "coding": [
      {
        "system": "http://loinc.org",
        "code": "17856-6",
        "display": "Hemoglobin A1c/Hemoglobin.total in Blood"
      }
    ]
  },
  "subject": {
    "reference": "Patient/12345",
    "display": "Jane Doe"
  },
  "effectiveDateTime": "2023-10-27T08:30:00Z",
  "valueQuantity": {
    "value": 7.2,
    "unit": "%",
    "system": "http://unitsofmeasure.org"
  }
}
```

Read it exactly like a structured lab report. The outer curly braces `{ }` represent the entire object. Inside, you see the key-value pairs.

| JSON Key | What It Tells You |
|---|---|
| `"resourceType": "Observation"` | This is a lab result, not a demographic record or a medication |
| `"code"` with LOINC `"17856-6"` | The specific test run: Hemoglobin A1c |
| `"subject"` | The patient is Jane Doe, internal ID 12345 |
| `"effectiveDateTime"` | When the lab was drawn |
| `"valueQuantity"` | The actual result: 7.2 percent |

A Python script can read this file, look for the `"valueQuantity"` key, and instantly extract the number 7.2 to plot it on a custom clinical dashboard. No guessing, no natural language processing required. The data is clean, structured, and ready to use.

## Common Mistakes Physicians Make When First Encountering JSON

When I first started working with APIs, JSON tripped me up constantly. It requires a level of syntax precision that clinical documentation does not demand. Here are the most common errors I see:

**Missing commas.** In JSON, every key-value pair must be separated by a comma, except for the last one in a block. Leaving out a comma breaks your code entirely. It is the digital equivalent of forgetting to sign a prescription. The system will not process it, and the resulting error message can take hours to track down if you do not know what to look for.

**Confusing square brackets with curly braces.** Curly braces `{ }` define an object, which is a collection of key-value pairs. Square brackets `[ ]` define an array, which is a list of items. A patient might have multiple diagnoses, so the `"diagnoses"` key would contain an array of individual diagnosis objects. Mixing these up will crash your application when it tries to parse the data.

**Assuming the AI will format it correctly every time.** If you are building an AI tool and you ask a large language model to return JSON, you must be explicit in your system prompt. AI models are prone to adding conversational filler like "Here is the JSON you requested:" before the actual code block. That extra text invalidates the JSON file. You have to enforce strict output formatting and use code to strip away any conversational text before parsing.

## How to Start Working with JSON Today

You do not need to build a full web application to start understanding JSON. Open your browser and search for a public API. The National Library of Medicine has several open APIs you can query for drug information or clinical trial data. When you click an API endpoint URL in your browser, the raw text that fills your screen is JSON.

Copy that text. Find a free online JSON formatter and paste it in. The formatter will indent the code, color-coordinate the keys and values, and make the nested structure obvious. Start reading it like a clinical chart. Identify the main categories. Look for the arrays. Trace how the data is nested.

If you are using Python, look up the built-in `json` library. It takes two lines of code to load a JSON string and convert it into a Python dictionary. Once it is a dictionary, you can filter it, manipulate it, and extract the exact clinical data points you need.

## The Future of Clinical Competency

We are entering an era where understanding clinical data formats is becoming just as critical as understanding pathophysiology.

When you depend entirely on software vendors to handle your data, you accept their limitations. You accept their clunky user interfaces, their slow update cycles, and their refusal to integrate with other tools. You accept that your clinical workflow will be dictated by a product manager who has never seen a patient.

When you learn how data is structured, you take back control. You realize that the EHR is not a magical black box. It is a database sending and receiving JSON files. Once you can read those files, you can intercept them, analyze them, and build tools that actually improve your daily workflow.

Stop letting vendors dictate how you interact with clinical data. Learn the
syntax, build your own tools, and write the code that medicine actually needs.

---

## Keep Going

If you want to build clinical AI, work with FHIR, or connect your tools to
modern APIs, JSON stops being optional. It is the structure that makes reliable
software possible.

Next, read
[Navigating Medical AI on GitHub: What Is Worth Your Time](/blog/navigating-medical-ai-on-github/).

If you are still earlier in the journey, go back to
[Three GitHub Projects Physicians Can Actually Finish](/blog/three-github-projects-physicians-can-actually-finish/).

## Doctors Who Code Series

This post is part of the **Doctors Who Code** series, a practical roadmap for
physicians who want to build software, understand clinical data, and move into
medical AI without hype.
