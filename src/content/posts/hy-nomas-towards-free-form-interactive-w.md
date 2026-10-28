---
title: "Hy-Nomas: An 8B Model for Free-Form Interactive World Generation"
description: "Hy-Nomas is an 8B-parameter diffusion video world model that follows free-form text instructions and continuous camera control across multi-turn interactions, built on HunyuanVideo 1.5 and shown to outperform existing world models in human evaluation."
pubDatetime: 2026-10-28T07:04:32.491Z
draft: true
tags:
  - workflows-and-agents
---
Hy-Nomas is a new 8B-parameter video world model that lets users steer generated worlds with free-form text instructions and continuous camera control across multiple back-and-forth turns, and it reportedly beats existing world models in human evaluation. Released with model weights, code, and benchmarks, it's positioned as a reproducible research platform for interactive world generation.

![Hy-Nomas: An 8B Model for Free-Form Interactive World Generation](/assets/posts/hy-nomas-towards-free-form-interactive-w.svg)

## What is Hy-Nomas?

Hy-Nomas is a video world model built on an 8B diffusion backbone that generates visual observations of future states in response to user commands, functioning as an interactive virtual environment. It supports free-form text instructions and continuous camera control across multiple interaction turns, generating variable-length video segments conditioned on current inputs and cached history. The authors define a "video world model" as a system where users observe the current world, decide how to act, and the model generates new visual observations reflecting both their commands and the preceding interaction history — extending beyond conventional video generation, where a fixed prompt specifies a short clip in advance.

## How does Hy-Nomas handle multi-turn instructions without breaking context?

The core design aligns structured video captions with "action-aware causal attention," keeping descriptive context available across segments while restricting action instructions to their intended temporal windows. This means persistent scene information — subject identities, layouts, scene changes — stays accessible as the world unfolds, but a specific action command only takes effect during its annotated time interval rather than leaking into unrelated future segments. The team's video captioning pipeline records persistent subject identities, scene changes, timestamped actions, and estimated camera trajectories to support this separation. The goal is to retain descriptive context and the visual consequences of an action without needing to repeatedly reissue that action.

## What is the Prompt Enhancer and why does it matter?

The Prompt Enhancer (PE) is a vision-language model, based on Qwen Team's 2026 work, that converts a user's request and current multimodal interaction history into a structured prompt with an appropriate duration for the next video segment. This matters because it automates translating loose, free-form user commands and prior visual/semantic context into the structured conditions the diffusion backbone needs to generate the next segment coherently. Free-form text prompts and camera control commands can be interleaved within the same session, with historical visual and semantic context carried forward through an autoregressive key-value (KV) cache, enabling minute-scale rollouts with successive instructions for subject actions, object interactions, scene changes, and camera motion.

## How was Hy-Nomas trained?

Hy-Nomas was built starting from HunyuanVideo 1.5 (Wu et al., 2025) and uses a multi-stage curriculum that progressively introduces: causal generation, text interaction, camera control, and training on the model's own generated histories, followed by diffusion distillation. This staged approach addresses a known failure mode in autoregressive world models — because each generated segment becomes evidence for the next, small errors can compound into appearance drift, implausible motion, and scene breakdown, so training must prepare the model for its own imperfect predictions. Mixed text-only and camera-conditioned training further supports smooth transitions between the two interaction modes (semantic commands vs. geometric camera control).

## How does it compare to other world models?

Hy-Nomas is positioned against recent systems including Genie 3 (Google DeepMind, 2025), HappyOyster (Alibaba Cloud, 2026), and LingBot-World v2 (Gao et al., 2026b), which the authors credit with progress in navigation, semantic intervention, and long-horizon generation. In human evaluation, Hy-Nomas is reported to show superior performance over existing world models across a range of interactive tasks. The authors frame its distinguishing focus as executing free-form text instructions integrated with camera navigation across multi-turn interactions within one generative backbone, rather than treating semantic commands and camera control as separate systems.

## Sources

- https://huggingface.co/papers/2610.36729
