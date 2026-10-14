---
title: "VideoJev: Faster Video AI Decisions Without Losing Accuracy"
description: "Researchers introduce VideoJev, a video 'System One' model family that scores answers directly instead of generating text, cutting inference time by up to 100x while matching or beating backbone accuracy on grounding and QA benchmarks."
pubDatetime: 2026-10-14T14:37:24.503Z
draft: true
tags:
  - workflows-and-agents
---
VideoJev is a new family of video understanding models that skips token-by-token text generation in favor of directly scoring possible answers, making video agents dramatically faster without sacrificing accuracy. The research, published on Hugging Face Papers, introduces two model sizes—VideoJev-4B and VideoJev-35B-A3B—built on top of Qwen backbones, and reports speedups of up to 100x on video question answering tasks.

![Diagram comparing traditional video AI text generation with VideoJev's direct scoring approach, plus a bar chart of accuracy gains over backbone models.](/assets/posts/videojev-system-one-model-for-video-unde.svg)

## What is VideoJev and what problem does it solve?

VideoJev reframes video understanding as a scoring problem instead of a text-generation problem, so agents can make faster decisions from video. Traditional video multimodal large language models (MLLMs) answer questions or locate events by generating timestamps or text autoregressively, even when the actual output needed is a simple, structured decision. VideoJev replaces that answer-decoding step with a shared head that scores temporal intervals and textual options directly against video evidence, producing event spans or multiple-choice answers without generating language one token at a time.

This matters for visual agents that need to track progress and decide what to do next in real time—like an assistant following a cooking procedure that needs to quickly check whether an ingredient has already been added before recommending the next step.

## How does VideoJev actually work?

VideoJev is built on two core ideas: direct candidate scoring and reusable visual computation. For temporal grounding, it scores intervals for membership in a queried event and assembles them into a contiguous span; for multiple-choice video QA, it scores textual options and picks the best-supported answer. Both tasks share the same scoring architecture while keeping task-specific supervision.

To handle multiple queries about the same video efficiently, VideoJev introduces two inference modes:

- **Cached inference** — the video is encoded and "prefilled" once, and new queries reuse that cached context as they arrive.
- **Joint inference** — multiple queries share the same prefix and get separate scores in a single forward pass.

Training uses this same shared-prefix layout, so computation is reused across questions during both training and inference. This design builds on the "System One" paradigm, which produces typed probabilistic judgments that software can use directly rather than generating answers token by token.

## How much faster and more accurate is VideoJev than its backbones?

VideoJev is both more accurate and dramatically faster than its Qwen backbones. On three temporal grounding benchmarks, VideoJev-4B and VideoJev-35B-A3B improved mean mIoU over their backbones (Qwen3.5-4B and Qwen3.6-35B-A3B, respectively, in Instruct mode) by 6.7 and 10.8 points, with measured inference speedups of 2.8–3.1x. On four video QA benchmarks, both models matched their backbones' Thinking-mode performance while delivering speedups exceeding 100x. Mean QA scores improved by 8.0 and 5.7 points over the Instruct-mode backbones.

| Model | Grounding mIoU gain | QA score gain (vs. Instruct) | Grounding speedup | QA speedup |
|---|---|---|---|---|
| VideoJev-4B | +6.7 pts | +8.0 pts | 2.8–3.1x | >100x |
| VideoJev-35B-A3B | +10.8 pts | +5.7 pts | 2.8–3.1x | >100x |

The authors note that the generative baselines used for timing comparisons also reused the video prefix, meaning the speedups reflect VideoJev's scoring approach itself, not just caching tricks.

## Does direct decision learning actually beat standard fine-tuning?

Yes—under identical training data and settings, VideoJev-4B outperformed a standard autoregressive fine-tuning approach by 1.3 points in mean grounding mIoU and 1.9 points in mean QA score. This controlled comparison isolates the benefit of VideoJev's direct-scoring design from any advantage that might come from better or different training data. The authors use this result to argue that learning structured judgments—rather than generating free-form text answers—provides a genuine architectural benefit for video agents, not just a byproduct of how the models were trained.

## Why does this matter for AI agents working with video?

VideoJev offers a unified, reusable decision interface that lets developers compose structured visual judgments into more complex, open-ended agent workflows. Because it unifies temporal grounding and multiple-choice video QA under one scoring architecture, and reuses visual computation across repeated queries, it's positioned as infrastructure for agents that need to repeatedly check progress, verify conditions, or evaluate options against the same video history—without the latency cost of generating full text answers each time. The paper evaluated these claims across seven benchmarks total (three temporal grounding, four video QA), using both a dense 4B model and a mixture-of-experts 35B-A3B model, giving evidence that the approach scales across different model architectures.

## Sources

- https://huggingface.co/papers/2610.18615
