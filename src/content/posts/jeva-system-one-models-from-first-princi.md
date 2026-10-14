---
title: "Jeva: A Decision-Native Architecture for Fast 'System One' AI Choices"
description: "Jeva is a new architecture for low-latency decision-making in language models, built on a Qwen3.5-4B backbone, that achieves near-perfect null detection, stays stable across candidate reorderings, and delivers over 20x median-latency speedups on reused candidate sets."
pubDatetime: 2026-10-14T14:38:14.856Z
draft: true
tags:
  - workflows-and-agents
---
A new paper introduces Jeva, a "decision-native" model architecture designed to make fast, structured choices—like picking a tool, document, or label—without the inconsistencies and inefficiencies common in current system one models. Published on Hugging Face Papers with 145 upvotes, the work argues that predicting answers from serialized text, the standard approach in many open-source system one models, fails to respect the actual structure of decision problems.

![Diagram showing Jeva's decision-native architecture flow and its key performance results versus baseline methods.](/assets/posts/jeva-system-one-models-from-first-princi.svg)

## What problem is Jeva trying to solve?

Jeva addresses a gap in how language models make quick, typed decisions, such as choosing a tool, identifying a document, testing a condition, or assigning a score. The authors argue that current designs—which jointly encode requests and candidates as text and read decisions from answer-token logits or task-specific prediction heads—couple semantic representation, candidate interaction, and answer availability into a single prediction process, creating four structural problems.

Specifically, the paper identifies that existing models underemphasize:

- **Null-awareness**: distinguishing when no answer applies from uncertainty among candidates
- **Permutation-invariance**: reordering alternatives shouldn't change the decision
- **Option-scalability**: growing candidate sets shouldn't require redefining the output space
- **Cacheability**: request-independent computation over recurring alternatives should be reusable

The paper notes that implementations based on a fixed inventory of answer symbols restrict candidate counts, while normalizing scores over supplied candidates doesn't establish whether any candidate is acceptable at all.

## How does Jeva's architecture work?

Jeva separates reusable semantic encoding from set-dependent judgment using a shared encoder and a lightweight decision module. A shared language encoder independently maps the request and each option into compact vectors, while a compact decision stack refines only the request state by reading against an immutable option memory—keeping option representations request-independent even as the state adapts to the candidate set.

Key mechanisms include symmetric aggregation in the decision mixer, which yields permutation-equivariant option probabilities, and shared candidate scoring in the readout, which accommodates variable-size candidate sets without expanding output parameters. A separate coverage gate allocates probability between null and the candidate set, explicitly distinguishing answer absence from in-set uncertainty, while a conditional distribution resolves competition among retained candidates. Because option vectors and their layer-specific projections can be cached across requests—including newly assembled candidate sets—Jeva reuses computation that would otherwise be redone every time.

## What results did the authors report?

Using a Qwen3.5-4B backbone with just one decision block, Jeva combined strong typed-decision performance with nearly perfect null detection and showed no decision flips under any tested candidate permutations. The paper also reports that even a single decision block can reverse the preference between two retained options when the surrounding candidate set changes—something independent candidate scoring cannot capture.

On scalability, Jeva's native full-set scoring handled up to 2,048 candidate options, achieving higher accuracy and a latency speedup of over 2x in median latency compared to a recursive-selection baseline. For cross-request reuse on newly assembled long-document candidate sets, the architecture delivered a median-latency speedup of over 20x without changing the decisions made.

| Metric | Result |
|---|---|
| Backbone | Qwen3.5-4B, 1 decision block |
| Null detection | Nearly perfect |
| Permutation stability | No decision flips under any tested permutation |
| Scale tested | Up to 2,048 candidates |
| Speedup vs. recursive-selection baseline (2,048 options) | Over 2x median latency |
| Speedup from cross-request reuse (long-document sets) | Over 20x median latency |

## Why does this matter for developers building AI systems?

For developers building agentic or tool-using systems, Jeva's design targets exactly the kind of recurring, structural decisions—tool selection, document retrieval, condition checks—that current text-based prediction methods handle inconsistently. By making candidate reuse, order symmetry, and variable-size choice explicit architectural properties rather than incidental behaviors, Jeva aims to let models preserve context-sensitive judgment while avoiding issues like candidate-order sensitivity or hard caps on how many options a model can consider.

The practical payoff highlighted in the paper is latency: because option-side computation (candidate representations) can be cached and reused across requests, including newly assembled sets, systems built this way could respond faster without re-deriving decisions from scratch each time—a meaningful consideration for any production system making repeated typed decisions at scale.

## Sources

- [Jeva: System One Models from First Principles — Hugging Face Papers](https://huggingface.co/papers/2610.18773)
