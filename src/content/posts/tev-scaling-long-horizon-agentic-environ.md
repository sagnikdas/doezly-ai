---
title: "Tev: UCLA's Dense-Reward Recipe for Training Long-Horizon AI Agents"
description: "UCLA researchers release Tev-Gym, a 1,170-task training dataset, and Tev-27B, a model trained with progress-potential reward shaping that matches GPT-6 Astra and Claude Opus 5 on long-horizon agent benchmarks."
pubDatetime: 2026-10-14T17:00:36.488Z
draft: true
tags:
  - workflows-and-agents
---
## What did the researchers introduce?

Researchers from the University of California, Los Angeles introduced Tev, a training recipe for long-horizon AI agents built around a new dataset called Tev-Gym and a reward-shaping method called PPRS. Tev-Gym contains 1,170 verified task environments spanning 7 domains, designed specifically to provide dense, verifiable rewards rather than the pass/fail signals typical of existing agentic datasets. The resulting model, Tev-27B, is the headline output of this recipe, trained to handle tasks that take agents hours to days to complete.

## Why does long-horizon agent training need a new approach?

Existing open-source training corpora like SWE-Smith, TMAX, Endless Terminals, CLI-Gym, SETA, and Terminal-Universe contain thousands to tens of thousands of environments, but each is only a pull-request-sized fix or short terminal session with terminal pass/fail evaluation. Genuinely long-horizon tasks, by contrast, have only existed in small human-authored benchmarks with tens to a few hundred instances, each requiring weeks of expert effort to build, and offering only hand-written checkpoint credit. The paper's authors note that no training corpus of long-horizon tasks previously existed: large corpora were short-horizon, while long-horizon tasks existed only as tiny evaluation sets.

## How does Tev-Gym generate verifiable long-horizon tasks?

Tev-Gym uses a "latent-world-first" synthesis approach: it first constructs a complete, correct hidden specification — a latent world — of the task domain, workflow, and expected state after every step. The underlying workflow is represented as a directed acyclic graph (DAG) within this latent world, and task environments are then progressively rendered from that specification into agent-facing form. Because every correct intermediate state is retained, this gives a natural, controllable progress metric and an exact answer key for verification — unlike pipelines where a language model generates tasks and checkers without a true answer.

## What is progress-potential reward shaping (PPRS)?

PPRS converts the progress metric from Tev-Gym into a dense, per-step reward, scoring the agent's workspace after every turn against known-correct intermediate states to produce a progress potential Φ(s_t) between 0 and 1. This matters because long-horizon tasks normally only pay out a reward at completion, which starves training signal: under Group-Relative Policy Optimization (GRPO), a group of rollouts that all fail produces zero advantage and no gradient — a problem that is rare on mid-horizon tasks but common at the start of long-horizon training, exactly when the policy needs signal most. By giving within-group variance from the first turn, PPRS makes previously intractable long-horizon tasks trainable and improves training efficiency.

## How well does Tev-27B perform against other models?

Tev-27B, trained with this recipe, achieves substantial gains on the Agents' Last Exam computing and math sciences domains (ALE-CM), matching GPT-6 Astra and Claude Opus 5 at Pass@5. Despite being trained only on ALE-related data, it generalizes to the Terminal-Bench (TB) 3.0 and 4.0 subsets, surpassing GLM 5.2 and Gemini 3.7 Flash, and reaches Claude Opus 4.8-level performance on middle-horizon tasks such as TB 2.1.

| Benchmark | Tev-27B Result |
|---|---|
| ALE-CM (Pass@5) | Matches GPT-6 Astra and Claude Opus 5 |
| Terminal-Bench 3.0/4.0 | Surpasses GLM 5.2 and Gemini 3.7 Flash |
| Terminal-Bench 2.1 (middle-horizon) | Reaches Claude Opus 4.8-level performance |

## Sources

- https://huggingface.co/papers/2610.18868

![Flow diagram showing how UCLA's Tev-Gym dataset and PPRS reward shaping train the Tev-27B agent, followed by its benchmark results against other models.](/assets/posts/tev-scaling-long-horizon-agentic-environ.svg)
