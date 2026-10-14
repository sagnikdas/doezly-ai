---
title: "APEX: A New Technique Makes Extreme Image Compression Actually Work for AI Generation"
description: "APEX, a diffusion method detailed on Hugging Face Papers, achieves 8.98 guided gFID on ImageNet-512 using just 16 tokens at 128x spatial compression, outperforming all compared methods and matching a 1024-token baseline with 15% of its training FLOPs."
pubDatetime: 2026-10-14T14:41:03.996Z
draft: true
tags:
  - workflows-and-agents
---
APEX is a new latent diffusion technique that solves a long-standing tradeoff between image compression and generation quality, letting models compress images far more aggressively without the usual drop in output quality. Short for "Asynchronous Prefix denoising for EXtreme compression," APEX was published as a research paper and discussed on Hugging Face Papers, where it gathered 36 upvotes.

![APEX: A New Technique Makes Extreme Image Compression Actually Work for AI Generation](/assets/posts/apex-asynchronous-prefix-denoising-for-e.svg)

## What problem does APEX solve?

Diffusion models that generate images from compressed "latent" representations face a built-in dilemma: compressing an image into fewer spatial tokens is cheaper to run, but preserving reconstruction quality at that compression level usually requires adding more channels, and more channels make the latent harder for the model to generate. This is called the "reconstruction-generation dilemma," and it gets especially severe at extreme compression, where the source paper notes that a 512x512 image can be represented by a grid of just 16 tokens at 128x spatial compression. Standard approaches were stuck choosing between fewer channels (worse reconstruction) or more channels (worse generation).

## How does APEX work?

APEX pairs a hierarchical latent space with asynchronous denoising over channel groups, generating coarse structure first and fine detail second without adding any extra tokens. The autoencoder orders "channel prefixes" from structure to detail by supervising them at progressively higher resolutions, while one shared Transformer denoiser generates these channel groups at staggered local times rather than all at once. The key insight: coarse structure must be generated from scratch, but exact texture and local detail become easier to predict once the scene is already established, so refining detail from cleaner preceding context works better than denoising everything on a shared timestep. The authors note that simply combining a channel hierarchy with asynchronous denoising isn't automatic — naive combinations actually made generation worse, and APEX only succeeds by carefully matching what each level represents, when it denoises, and how training compute is allocated across the trajectory.

## What results did APEX achieve?

On ImageNet-512, APEX outperformed every compared method at both 64x and 128x spatial compression, across every evaluated channel count. At f128c512 (128x compression, 512 channels), APEX reached 8.98 guided gFID using only 16 tokens with the SiT-XL model, while every compared method stayed in double digits. Its 64-token f64c128 model matched the gFID of the widely-used 1024-token SD-VAE (f8c4) while using only 15% of its denoiser-training FLOPs.

## How does APEX compare to less-compressed models?

With training compute matched, APEX's 64-token hierarchical model outperformed a less-compressed 256-token model across every evaluated guided inference budget — and the gains got larger as sampling compute decreased. This suggests APEX isn't just a per-step speedup trick; once the reconstruction-generation dilemma is addressed, extreme spatial compression becomes a genuine quality-compute advantage.

| Model | Tokens | Spatial compression | Result |
|---|---|---|---|
| APEX (f128c512) | 16 | 128x | 8.98 guided gFID (best of all compared methods) |
| APEX (f64c128) | 64 | 64x | Matches 1024-token SD-VAE gFID at 15% of its denoiser-training FLOPs |
| Compared methods (f128) | 16 | 128x | Double-digit gFID |

## Why does this matter for developers building diffusion models?

Because Transformer attention cost grows quadratically with the number of input tokens, compressing images into fewer tokens before diffusion is a well-known way to cut compute costs in latent diffusion (following Rombach et al., 2022's original latent diffusion approach). APEX shows that extreme spatial compression — previously held back by the reconstruction-generation dilemma — can now be made practical, meaning compute-efficient latent diffusion models can get both cheaper and better rather than trading one for the other.

## Sources

- [APEX: Asynchronous Prefix Denoising for Extreme Compression — Hugging Face Papers](https://huggingface.co/papers/2610.12843)
