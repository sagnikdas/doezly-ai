---
title: "FlashVSR+ Delivers Untiled 4K Video Super-Resolution on a Single RTX 4090"
description: "FlashVSR+ is a one-step video super-resolution framework that uses hybrid attention and a new Ry-DMD training method to achieve up to 2x DiT speedup, 45% lower peak memory, and untiled 4K inference on a 24GB RTX 4090, while improving alignment with human preferences."
pubDatetime: 2026-10-14T14:41:45.218Z
draft: true
tags:
  - workflows-and-agents
---
FlashVSR+ is a new video super-resolution (VSR) framework that makes one-step, diffusion-based 4K upscaling run untiled on a single consumer 24GB RTX 4090 GPU, cutting DiT compute by up to 2x and peak memory by 45% compared to prior approaches. It comes from researchers affiliated with CPII under InnoHK and pairs a new "hybrid attention" architecture with a training technique called Ry-DMD to improve both speed and output quality aligned with human preferences.

![FlashVSR+ Delivers Untiled 4K Video Super-Resolution on a Single RTX 4090](/assets/posts/flashvsr-efficient-video-super-resolutio.svg)

## What problem is FlashVSR+ trying to solve?

Generative VSR models can produce sharp, realistic video detail, but two bottlenecks have limited their practicality: the compute/memory cost of attention at high resolutions, and the difficulty of aligning distilled one-step models with human preferences. Diffusion-based VSR traditionally needs costly multi-step denoising, and even recent one-step distillation methods still face prohibitive attention costs at 2K/4K resolution, forcing consumer GPUs like the RTX 4090 to use spatial tiling. Tiling limits global context and can introduce boundary artifacts, which is one of the core issues FlashVSR+ sets out to fix.

The second bottleneck is preference alignment: the standard one-step distillation method, DMD, matches a teacher's output distribution but can't explicitly favor outputs that better match human preferences, such as accurate text rendering. Existing reward-guided methods rely on multi-step stochastic trajectories or differentiable reward signals, which don't work well with deterministic one-step generators that use black-box rewards (rewards with no gradient information).

## How does FlashVSR+'s hybrid attention architecture work?

Hybrid attention is an architecture change that keeps most of the model's attention computation local while retaining a few sparse global attention blocks for long-range consistency. The authors found that pretrained VSR models like FlashVSR already show strong spatiotemporal attention locality — attention concentrates within compact neighborhoods in many blocks — but this locality varies across layers, so fully local attention alone would be too restrictive.

By replacing most original attention blocks with efficient local spatiotemporal attention and keeping a small number of sparse global blocks, FlashVSR+ achieves up to 2x DiT speedup and nearly 45% lower peak memory. This is what enables spatially untiled 4K VSR inference on a single 24GB RTX 4090, avoiding the artifacts that spatial tiling can introduce.

## What is Reward-Yield Distribution Matching Distillation (Ry-DMD)?

Ry-DMD is a new training method designed to align one-step VSR generators with human preferences even when the reward signal is a "black box" with no usable gradients. It works by generating multiple teacher rollouts to expose the stochasticity available to a one-step generator, then reweighting those rollouts using black-box rewards. The difference between the reward-weighted and original teacher predictions gives a "preference direction," which is added to standard DMD training to push the model toward higher-reward, teacher-supported outputs.

The authors validated Ry-DMD on OCR-guided VSR (where accurate text rendering is a reward signal) and also showed it generalizes to text-to-image (T2I) generation, suggesting the technique isn't limited to video super-resolution alone.

## What did the researchers find about scaling up training?

One might assume that simply increasing training budget and data size would keep improving one-step VSR distillation, but the authors found this isn't the case. Longer DMD training showed non-monotonic behavior, meaning more training steps didn't reliably yield better results. Instead, the paper notes that student initialization and teacher capacity play a more important role in final model quality than simply extending training time — though the source material is truncated before fully detailing this finding.

## Where can developers get the code and models?

The authors state they are releasing code, models, and training data at www.flashvsr.tech. The project description doesn't include licensing terms or release dates beyond this statement in the source material, so developers interested in trying FlashVSR+ should check that site directly for availability.

## Sources

- [FlashVSR+: Efficient Video Super-Resolution via Hybrid Attention and Reward-Yield Distribution Matching (Hugging Face Papers)](https://huggingface.co/papers/2610.17552)
