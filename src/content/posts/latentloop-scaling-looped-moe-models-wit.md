---
title: "LatentLoop: Asymmetric Compute Allocation Cuts Training Costs for Looped MoE Models"
description: "LatentLoop, a new looped Mixture-of-Experts architecture, cuts training compute by 19.0% versus vanilla MoE and 7.9% versus a looped MoE baseline, tested across 15 configurations from 1.3B to 7B parameters with over 10^21 FLOPs."
pubDatetime: 2026-10-15T07:56:42.432Z
draft: true
tags:
  - workflows-and-agents
---
LatentLoop is a new looped Mixture-of-Experts (MoE) architecture that lowers validation loss and cuts training compute by reallocating resources unevenly between two passes over the same shared layers. Introduced in a paper posted to Hugging Face Papers (49 upvotes), the work builds on prior looped-MoE research by identifying that the two passes through shared parameters don't need equal computation — and exploiting that asymmetry to save FLOPs while improving downstream benchmark scores.

![Diagram showing LatentLoop's asymmetric compute split between two loop visits, resulting training compute savings versus two baselines, and summary of validation results across 15 model configurations.](/assets/posts/latentloop-scaling-looped-moe-models-wit.svg)

## What problem is LatentLoop solving?

Looped Transformers reuse the same shared layers multiple times to increase effective depth without adding parameters, but each additional pass still costs compute, so gains at fixed parameter count don't guarantee gains at a fixed compute budget. Recent work combining looping with Mixture-of-Experts, including a method called SMELT, showed looping could help even under matched budgets. LatentLoop starts from SMELT's recipe — applying the middle half of the layers twice with shared parameters — and asks whether the two visits should actually be treated the same way computationally.

## What did the researchers discover about the two loop visits?

The authors found that the two passes through shared layers play meaningfully different roles, even though they use identical parameters. By learning a separate residual coefficient for each visit, they observed that the first visit consistently learns a substantially smaller coefficient than the second, which stays close to one. Fixed-coefficient experiments confirmed this wasn't a fluke: reducing the first visit's residual scale preserved or improved validation NLL (negative log-likelihood), while the same reduction applied to the second visit made performance worse. This asymmetry is what motivated the team to explore giving the two visits different amounts of compute rather than treating them symmetrically.

## How does LatentLoop allocate compute asymmetrically?

LatentLoop compresses the sequence processed in the first visit, keeps the second visit at full resolution, and reallocates the compute saved from compression into a larger hidden size. Among several approaches the team tried, sequence compression produced the lowest validation NLL, which is why it became the core mechanism. To handle the mismatch between a compressed first pass and a full-resolution second pass, the authors:

- Learn how strongly the first visit's updates get written back into the full-resolution sequence, using mean aggregation paired with learnable writeback coefficients and causal alignment.
- Untie only the attention blocks between visits (since different sequence resolutions call for different attention behavior), while keeping MoE weights shared across visits to preserve parameter reuse, since MoE blocks hold most of the model's parameters.
- Offset the added attention parameters by slightly reducing the stored expert count, while keeping the active expert count — and thus FLOPs per step — unchanged.

## What were the results, and how much compute does it actually save?

LatentLoop beat both a standard MoE baseline and a looped MoE baseline on validation NLL across every one of 15 matched-budget configurations tested, spanning 1.3B to 7B parameters with the largest run exceeding 10^21 FLOPs. At a fitted NLL of 1.988, the scaling curves predict LatentLoop needs 19.0% less training compute than vanilla MoE and 7.9% less than the looped MoE baseline to hit the same loss. On nine downstream benchmarks evaluated in both 0-shot and 5-shot settings at the largest token budget per size, LatentLoop achieved the highest average score in all six size-and-shot combinations tested, showing the loss improvements translate into actual task performance gains.

| Comparison | Compute savings at NLL 1.988 |
|---|---|
| LatentLoop vs. vanilla MoE | 19.0% less training compute |
| LatentLoop vs. looped MoE baseline (SMELT-style) | 7.9% less training compute |

## Why does this asymmetry matter for future model design?

The core insight — that shared-parameter loop visits can and should receive different compute budgets rather than identical treatment — is presented as a general direction rather than a one-off trick. Ablations at a 3B-parameter, 40B-token reference budget confirmed that both the writeback scale calibration and the selective (attention-only) parameter untying contribute to the gains. The authors also note that the learned writeback coefficients ended up well below one, echoing the same residual-scaling asymmetry that kicked off the investigation, which suggests this first-visit-is-cheaper pattern is a consistent property of looped MoE models rather than an artifact of one experiment.

## Sources

- [LatentLoop: Scaling Looped MoE Models with Asymmetric Compute Allocation — Hugging Face Papers](https://huggingface.co/papers/2610.19975)
