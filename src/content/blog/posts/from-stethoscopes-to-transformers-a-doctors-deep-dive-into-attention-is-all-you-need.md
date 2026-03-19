---
audioUrl: /audio/from-stethoscopes-to-transformers-a-doctors-deep-dive-into-attention-is-all-you-need.mp3
author: Chukwuma Onyeije, MD, FACOG
category: Technology
description: '''The contents of this file is everything algorithmically needed to
  train a GPT. Everything else is just efficiency.'''
draft: false
pubDate: 2026-02-22
title: 'From Stethoscopes to Transformers: A Doctor''s Deep Dive into "Attention is
  All You Need"'
---

Published on DoctorsWhoCode.blog

By Dr. Chukwuma Onyeije, MFM

![](https://lightslategray-turtle-256743.hostingersite.com/wp-content/uploads/2026/02/Gemini_Generated_Image_ulwxjzulwxjzulwx-1024x559.png)

"The contents of this file is everything algorithmically needed to train a GPT. Everything else is just efficiency."  
— Andrej Karpathy, on his micro-GPT release, February 2026

As physicians, we are trained to meticulously gather and synthesize vast amounts of information before making a critical decision. We review patient histories, lab trends, imaging studies, and physical exam findings, constantly asking ourselves: What here is most important? What detail, even from a visit years ago, is relevant to this current presentation? That process of directed focus, of paying attention to the most salient data points in a sea of information, is the cornerstone of clinical excellence.

A parallel revolution has been unfolding in artificial intelligence, and it is one that every physician learning to code must understand at a mechanistic level. That revolution was ignited by a single, nine-page research paper published in 2017 by a team of Google researchers: "Attention is All You Need" \[1\]. This paper introduced the Transformer architecture, the foundational design that powers virtually every modern large language model (LLM), from ChatGPT to Claude to Gemini.

And then, on February 12, 2026, Andrej Karpathy, formerly the Director of AI at Tesla and one of the most gifted AI educators alive, published something remarkable: micro-GPT \[2\]. A single Python file. 200 lines. Zero external dependencies. A complete, working implementation of the same algorithm that underlies the most powerful AI systems in the world. His stated purpose was elegant in its simplicity: to reduce the LLM to its bare essentials, to make the algorithm visible, learnable, and human-scaled.

For us, the physicians who code, this is a pivotal moment. It peels back the curtain on the so-called "black box" of AI, revealing not inscrutable magic, but elegant, understandable, and ultimately learnable mathematics. This article is your guide: a deep dive into the core concepts of the Transformer and the attention mechanism, framed for the clinical mind, grounded in Karpathy's implementation, and oriented toward the practical question that drives everything we do here: How do I build with this?

**The Problem That Transformers Solved**

To appreciate the breakthrough, you must first understand the problem. Before the Transformer, the dominant models for processing sequential data, such as text, were Recurrent Neural Networks (RNNs). An RNN processes a sentence word by word, maintaining a hidden "memory state" that carries information from previous words to the current one. It is a fundamentally sequential process.

Consider the clinical analogy. Imagine trying to diagnose a complex patient with a long, multi-year history using only the last few notes in the chart. The details from the beginning of the record, the original diagnosis, the first abnormal lab, the early warning signs, have faded from working memory. You are making decisions based on an incomplete and increasingly distorted summary of the past. This is precisely the "long-range dependency" problem that plagued RNNs. As sequences grew longer, the model's ability to connect distant but causally related information degraded significantly.

There was also a structural problem: RNNs are inherently sequential. You cannot process word three until you have processed words one and two. This made them slow to train and difficult to parallelize across modern GPU hardware. The Transformer solved both problems simultaneously, and it did so with a single, powerful idea.

**The Transformer's Core Insight: Attention**

The Transformer architecture, as described by Vaswani et al. in "Attention is All You Need," abandons recurrence entirely. Instead, it processes the entire input sequence at once and uses a mechanism called self-attention to allow every word to directly communicate with every other word in the sequence, regardless of distance.

The key innovation is this: for each word in the sequence, the model calculates an attention score with respect to every other word. This score determines how much influence each word should have on the representation of the current word. The result is that the model can, in a single computational step, connect a pronoun at the end of a paragraph to the noun it refers to at the beginning, or connect a medication listed in the history to a side effect documented three visits later.

**Karpathy's description in the micro-GPT documentation is precise and worth quoting directly:**

"It's worth emphasizing that the Attention block is the exact and only place where a token at position t gets to 'look' at tokens in the past 0..t-1. Attention is a token communication mechanism." \[3\]

This is the architectural heart of the entire system. Everything else, the embeddings, the feed-forward layers, the normalization, serves to support and refine this central act of communication.

**Queries, Keys, and Values: The Mechanics of Attention**

To make attention computational, the Transformer uses three learned vector projections for each token in the sequence. These are the Query (Q), the Key (K), and the Value (V) vectors. Understanding these three concepts is the single most important step in understanding how a Transformer works.

| Vector | Role | Clinical Analogy |
| --- | --- | --- |
| Query (Q) | What the current token is looking for | The physician's diagnostic question: "Is there evidence of renal dysfunction?" |
| Key (K) | What each token offers as a label | The label on a lab report: "Creatinine, 1.5 mg/dL, 2026-02-20" |
| Value (V) | The actual information content of each token | The clinical significance: "Creatinine elevated above baseline, trending upward" |

The attention calculation proceeds in several steps, which Jay Alammar's canonical "Illustrated Transformer" \[4\] describes with exceptional clarity:

Step 1: Score. For the current token, compute the dot product of its Query vector with the Key vector of every other token in the sequence. A high dot product indicates a strong match, meaning the current token should pay close attention to that other token.

Step 2: Scale. Divide the scores by the square root of the dimension of the key vectors. This scaling prevents the dot products from becoming so large that the subsequent softmax operation produces near-zero gradients, a numerical stability issue that would impede training.

Step 3: Softmax. Apply the softmax function to the scaled scores. This converts the raw scores into a probability distribution: all values fall between 0 and 1, and they sum to 1.0. These are the attention weights.

Step 4: Weighted Sum. Multiply each token's Value vector by its corresponding attention weight, then sum all of these weighted vectors together. The result is a new, context-enriched representation of the current token.

In Karpathy's micro-GPT, this entire process is implemented in just a few lines of pure Python, with no libraries:

> attn\_logits = \[sum(q\_h\[j\] \* k\_h\[t\]\[j\] for j in range(head\_dim)) / head\_dim\*\*0.5 for t in range(len(k\_h))\]
> 
> attn\_weights = softmax(attn\_logits)

head\_out = \[sum(attn\_weights\[t\] \* v\_h\[t\]\[j\] for t in range(len(v\_h))) for j in range(head\_dim)\]

This is not abstracted away behind a library call. It is the raw algorithm, visible and readable. The first line computes the scaled dot product scores. The second applies softmax. The third computes the weighted sum of values. That is the attention mechanism, in its entirety.

Multi-Head Attention: The Multidisciplinary Team

The Transformer architecture refines the attention mechanism with a powerful extension: multi-head attention. Rather than performing the attention calculation once, the model performs it multiple times in parallel, each with independently learned Query, Key, and Value weight matrices. Each of these parallel computations is called an "attention head."

The clinical analogy here is the multidisciplinary case conference. When you present a complex obstetric patient, the nephrologist, the cardiologist, the maternal-fetal medicine specialist, and the pharmacist all review the same data, but each attends to different relationships and patterns based on their unique domain expertise. The nephrologist focuses on the creatinine trend and urine protein. The cardiologist attends to the blood pressure trajectory and echocardiographic findings. The pharmacist maps the medication list against known interactions. By synthesizing these multiple, specialized perspectives, the team arrives at a far richer and more robust understanding of the patient's condition than any single specialist could achieve alone.

Multi-head attention does precisely this for language. One head might learn to track grammatical agreement between subjects and verbs. Another might learn to resolve pronoun references. A third might learn to connect cause-and-effect relationships across long distances. The outputs of all heads are concatenated and projected through a final linear layer, producing a single, richly contextualized representation.

In Karpathy's implementation, the number of heads is a hyperparameter (n\_head = 4), and the code iterates over each head explicitly, making the parallel nature of the computation transparent.

The Full Transformer Block: Communication and Computation

A single Transformer block, the repeating unit that is stacked multiple times to create a deep model, consists of two components:

1\. The Attention Block (Communication). As described above, this is where tokens communicate with each other. Every token queries every other token, gathers relevant context, and updates its own representation. This is the only place in the architecture where information flows between positions in the sequence.

2\. The MLP Block (Computation). After the attention block, each token's representation is passed through a small, independent feed-forward neural network, a two-layer "multilayer perceptron" (MLP). Unlike the attention block, this computation is entirely local: each token's MLP processes only its own representation, with no communication to other positions. This is where the model does its per-token "thinking," integrating the contextual information gathered during attention into a refined, updated representation.

Karpathy's comment in the micro-GPT documentation captures this beautifully: "The Transformer intersperses communication (Attention) with computation (MLP)." \[3\]

Both blocks use residual connections, meaning the output of each block is added back to its input. This architectural choice, borrowed from ResNets in computer vision, allows gradients to flow directly through the network during training, making it possible to train very deep models without the gradients vanishing.

The Complete Picture: From Characters to Language

To fully appreciate the elegance of the Transformer, it helps to trace the entire pipeline as Karpathy implements it in micro-GPT. The process of training a GPT-style model involves five distinct stages:

| Stage | What Happens | Analogy |
| --- | --- | --- |
| Dataset | A collection of text documents is assembled | Gathering patient records for a study |
| Tokenizer | Text is converted into sequences of integer token IDs | Assigning ICD codes to diagnoses |
| Embeddings | Each token ID is mapped to a learned vector in high-dimensional space | Converting a diagnosis code into a rich clinical profile |
| Transformer Blocks | Stacked attention and MLP layers process and refine the token representations | The iterative reasoning of a clinical team |
| Training Loop | The model is repeatedly shown data, asked to predict the next token, and its parameters are adjusted to reduce prediction error | Supervised learning from a labeled dataset |

The training objective is deceptively simple: given a sequence of tokens, predict the next one. This is called next-token prediction, and it is the task on which every GPT-style model is trained. The loss function used is cross-entropy loss, which measures how surprised the model is by the correct next token. If the model assigns a high probability to the correct token, the loss is low. If it assigns a low probability, the loss is high. Over thousands of training steps, the model's parameters are iteratively adjusted using the Adam optimizer to minimize this loss.

The key insight, as Karpathy notes, is that this simple training objective, when applied at scale to vast amounts of text, forces the model to develop a rich, internal understanding of language, grammar, facts, and reasoning. The model that can accurately predict the next word in any text has, by necessity, learned a great deal about the world.

**Why Karpathy's micro-GPT Is a Gift to Physician-Developers**

The significance of micro-GPT extends beyond its technical elegance. It is a pedagogical statement. By reducing the GPT algorithm to 200 lines of dependency-free Python, Karpathy has made the following argument: this is not magic. This is not the exclusive domain of PhD researchers at large technology companies. This is an algorithm, and algorithms can be understood, learned, and built upon by anyone willing to invest the time.

For physicians learning to code, this matters enormously. The AI tools that are reshaping medicine, the ambient scribes, the diagnostic decision support systems, the prior authorization bots, are all built on some variant of this architecture. When you understand the Transformer, you understand the engine under the hood of modern AI. You can evaluate these tools with informed skepticism. You can identify their failure modes. You can envision new applications that no one else has thought of, because you are the one who understands both the clinical problem and the technical solution.

Technical literacy is professional self-defense. And micro-GPT is one of the most efficient tools for building that literacy that has ever been made available.

**Getting Started: Your Next Steps**

If you are a physician who wants to move from understanding to building, here is a practical roadmap:

1\. Read the **micro-GPT** source code. It is available at [karpathy.ai/microgpt.html](https://karpathy.ai/microgpt.html) and as a [Google Colab notebook](https://colab.research.google.com). Read Karpathy's accompanying blog post \[2\] as a guided walkthrough. Do not skip the math; the explanations are accessible and the rewards are significant.

2\. Run it. Open the Colab notebook and run the code. Watch the loss decrease over training steps. See the model generate plausible-sounding names. This is not a trivial exercise; it is the moment the algorithm becomes real.

3\. Modify it. Change the dataset. Instead of names, use a small collection of clinical notes or medical terminology. Observe how the model's outputs change. This hands-on experimentation is the fastest path to deep understanding.

4\. Study the original paper. "Attention is All You Need" \[1\] is available freely on arXiv. It is dense, but having worked through micro-GPT, you will find the paper far more accessible than you might expect.

5\. Explore Jay Alammar's "Illustrated Transformer." \[4\] This is one of the finest visual explanations of the Transformer architecture available. Read it after micro-GPT and the original paper, and the pieces will fall into place.

**Conclusion**

The Transformer architecture, introduced in "Attention is All You Need," represents one of the most consequential algorithmic breakthroughs of the past decade. Its core innovation, the attention mechanism, is a computational formalization of something physicians do intuitively every day: directing focused, weighted attention to the most relevant information in a complex, high-dimensional data environment.

Andrej Karpathy's micro-GPT has given us an extraordinary gift: the algorithm in its purest form, stripped of all complexity, ready to be studied, understood, and built upon. For those of us who believe that physicians must be builders and not merely consumers of technology, this is a call to action.

The AI revolution in medicine is not something that is happening to us. It is something we can shape, guide, and lead, but only if we do the work of understanding the tools. The Transformer is not a black box. It is an algorithm. And algorithms are learnable.

**References**

\[1\] Vaswani, A., Shazeer, N., Parmar, N., Uszkoreit, J., Jones, L., Gomez, A. N., Kaiser, Ł., & Polosukhin, I. (2017). Attention is All You Need. Advances in Neural Information Processing Systems, 30. [https://arxiv.org/abs/1706.03762](https://arxiv.org/abs/1706.03762)

\[2\] Karpathy, A. (2026, February 12). microgpt. Andrej Karpathy Blog. [http://karpathy.github.io/2026/02/12/microgpt/](http://karpathy.github.io/2026/02/12/microgpt/)

\[3\] Karpathy, A. (2026). microgpt source code and documentation. karpathy.ai. [https://karpathy.ai/microgpt.html](https://karpathy.ai/microgpt.html)

\[4\] Alammar, J. (2018, June 27). The Illustrated Transformer. Jay Alammar's Blog. [https://jalammar.github.io/illustrated-transformer/](https://jalammar.github.io/illustrated-transformer/)