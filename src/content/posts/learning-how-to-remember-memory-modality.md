---
title: "SwitchMem: Teaching GUI Agents When to Remember in Text vs. Images"
description: "A new paper, 'Learning How to Remember,' finds that GUI agents perform better when they switch memory format per step. The proposed router, SwitchMem, outperforms static text-only or image-only memory baselines across three GUI benchmarks."
pubDatetime: 2026-10-14T14:40:46.322Z
draft: true
tags:
  - workflows-and-agents
---
A new research paper argues that GUI agents should stop treating memory as a one-size-fits-all format, and instead switch between text and images depending on the step. The paper, "Learning How to Remember: Memory Modality Selection for GUI Agents," introduces SwitchMem, a routing framework that dynamically picks between textual and visual memory representations at each interaction step, and shows it beats memory-augmented baselines that rely on a single fixed modality across three GUI benchmarks.

![Diagram comparing fixed-format GUI agent memory with SwitchMem's per-step dynamic text/image routing, showing SwitchMem outperforms static baselines on three benchmarks.](/assets/posts/learning-how-to-remember-memory-modality.svg)

## What problem is this paper solving?

GUI agents built on vision-language models (VLMs) increasingly use memory of past interactions to avoid repeating mistakes, but that memory is usually stored in just one format — all text, all images, or a fixed mix of both — forever. The authors point out that this "fixed representation strategy" never changes once chosen, even though a GUI task might need fine-grained visual detail at one step and compact semantic summary at another. Their core question: is a single memory modality ever truly optimal, or does the best choice shift step by step?

## What did the researchers find?

The researchers found that the preferred memory modality is "strongly step dependent" — meaning the best format for recalling past experience changes as a GUI agent moves through a task. They discovered this preference is detectable inside the model itself, through what they call a Directional Chain-of-Embedding (D-CoE) analysis, which reveals a "reproducible Text/Image preference signal" in the model's internal hidden states. Notably, this signal generalized to GUI trajectories the model hadn't seen before, suggesting it's a real, learnable pattern rather than noise.

Why does this matter? Prior work on VLMs already suggested that text and images carry fundamentally different information — text gives compact semantic abstraction but can discard fine-grained visual detail, while images preserve spatial and appearance detail but aren't always needed. This paper is the first to show that tension plays out dynamically, step-by-step, inside memory-augmented GUI agents specifically, rather than treating modality as a one-time design decision.

## What is SwitchMem and how does it work?

SwitchMem is a lightweight router that sits inside a VLM-based GUI agent and chooses, at every single interaction step, whether to retrieve memory as text or as an image. Unlike existing systems that lock in a memory format at the start and never revisit it, SwitchMem adapts per step based on the internal preference signal the authors identified via D-CoE analysis. The agent itself still operates in the standard loop — reading a screenshot, considering the task instruction and interaction history, then predicting an action like tapping, swiping, or entering text — but now the memory it leans on can flex between modalities as needed.

## How does SwitchMem perform compared to existing approaches?

SwitchMem "consistently outperforms all static memory baselines across evaluation tasks," according to the authors, tested across three GUI benchmarks. The comparison is specifically against memory-augmented agents that use a fixed modality — text-only, image-only, or a static combination — throughout a task. The paper frames this as direct validation of its central claim: memory modality is a step-dependent decision, not something you can set once and forget.

| Approach | Memory modality | Adapts per step? |
|---|---|---|
| Existing GUI memory systems | Fixed (text, image, or static combo) | No |
| SwitchMem | Dynamically routed (text or image) | Yes |

## Why does this matter for developers building GUI agents?

For anyone building VLM-powered GUI agents — mobile automation, desktop assistants, RPA tools — this suggests that bolting on a static memory module may be leaving performance on the table. Mobile GUI agents already face compounding risk because "each action changes the interface state, and errors in perception or action selection can propagate through subsequent decisions," so better memory retrieval at each step has outsized value in long-horizon tasks. The authors note their code and project resources are available, making SwitchMem's routing approach something developers can study or build on directly rather than just a theoretical finding.

## Sources

- https://huggingface.co/papers/2610.17928
