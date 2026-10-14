---
title: "VEDJE Shrinks Video Search Caches to 12 KiB Without Losing Accuracy"
description: "Researchers from Ben-Gurion University and Texas A&M introduce VEDJE, a 33M-parameter cross-encoder for video-text retrieval that lifts MSR-VTT text-to-video R@1 from 56.2 to 59.8 and cuts per-video cache size fourfold to 12 KiB with under 0.2 points of recall loss."
pubDatetime: 2026-10-14T14:41:19.462Z
draft: true
tags:
  - workflows-and-agents
---
A new paper called VEDJE shows that video search can get more accurate while using a smaller, reusable cache instead of re-processing rich video features for every query. The work, published on Hugging Face Papers and gathering 33 upvotes, tackles a core bottleneck in large-scale video retrieval: verifying candidate videos cheaply without sacrificing the fine-grained matching that joint encoders provide.

![Bar charts comparing VEDJE's accuracy gain and cache size reduction, plus a flow diagram of its offline encode-once, reusable-cache pipeline.](/assets/posts/vedje-video-efficient-discriminative-joi.svg)

## What problem is VEDJE trying to solve?

Video search at scale typically runs in two stages: a first stage retrieves plausible candidates from the full index, and a second stage verifies whether each candidate actually matches the query. The hard part is verification — distinguishing videos that share similar scenes but differ in the actions, state changes, or specific moments a query describes, without making every search re-encode video from scratch.

Existing options each have a downside. CLIP-style dual encoders (citing work like Luo et al., 2022 and Wang et al., 2024a/b) index videos and queries independently for fast retrieval, but they compute similarity via inner product with no cross-modal token interaction. Joint rerankers restore that cross-attention and are mature for images, but for video both the stored features and the scoring sequences scale with sampled frames, and re-encoding candidates online is slow. Multimodal LLM rerankers offer expressive joint matching but put multi-billion-parameter decoders directly in the query path.

## How does VEDJE's compressed cache work?

VEDJE's core idea is to encode each video once offline and reuse a small, cached set of tokens for every future query, inspired by the image-based cached reranker Edje. A frozen visual encoder processes each video a single time, and a shared compressor extracts a few learned tokens per sampled frame — compressing within frames while keeping separate representations across sampled times, so the cache retains evidence spread across the whole video.

At query time, a lightweight 33M-parameter cross-encoder scores these cached tokens alongside the query text and the first-stage score, adding no extra visual encoding work. A training technique called feature-change supervision (future-delta feature prediction) is used during training to make the compressed cache more informative, without requiring an extra predictor at inference time. The token budget per frame directly controls both the storage footprint per video and the sequence length the online scorer has to process.

## What results did the researchers report?

Across four benchmarks — MSR-VTT, MSVD, DiDeMo, and ActivityNet — VEDJE consistently improves R@1 in both text-to-video and video-to-text directions compared to matched first-stage retrievers alone. The standout number: with a fine-tuned VideoCLIP-XL first stage on MSR-VTT, VEDJE raises text-to-video R@1 from 56.2 to 59.8, using roughly 157M total online parameters.

In the VideoPrism configuration, allocating just one cached token per sampled frame shrinks the per-video cache fourfold to 12 KiB while keeping text-to-video R@1 within 0.2 points of the larger-cache version. That result is the paper's headline claim: accurate video search can run on compact, pre-encoded evidence that's reused as new queries arrive, rather than demanding fresh visual processing per query.

## How does VEDJE compare to other retrieval approaches?

VEDJE sits between cheap dual-encoder retrieval and expensive joint/MLLM reranking, aiming to get joint-encoder accuracy at near dual-encoder cost. Late-interaction methods (such as ColBERT-style approaches from Khattab and Zaharia, 2020) store richer unimodal token banks and aggregate similarity at query time, but the query and cached tokens never pass through a shared joint encoder — a gap VEDJE's cross-encoder is designed to close.

The paper also directly compares against EERCF, which pairs a trained temporal encoder with parameter-free text-gated feature aggregation. VEDJE is evaluated against EERCF on a shared CLIP ViT-B/16 architecture, and separately tested on candidates from EERCF's released ViT-B/32 retriever.

| Approach | Cross-modal joint scoring? | Query-time visual re-encoding? | Query-path model size |
|---|---|---|---|
| CLIP-style dual encoder | No | No | N/A (embedding lookup) |
| Late interaction (e.g., ColBERT-style) | No (separate unimodal caches) | No | Aggregation only |
| MLLM reranker | Yes | Yes (implicitly, via decoder) | Multi-billion parameters |
| VEDJE | Yes | No (cache reused) | 33M-parameter cross-encoder, ~157M total online |

## Why does this matter for developers building search systems?

VEDJE's main pitch is practical: it decouples expensive video understanding from the query path entirely, letting teams build a video cache before they know what queries it will serve, then scale verification cheaply at query time. For anyone running video search at scale — think video platforms, media archives, or retrieval pipelines feeding downstream apps — the 12 KiB-per-video cache figure with negligible recall loss suggests meaningful storage and latency savings are possible without ripping out existing first-stage retrievers like VideoCLIP-XL or VideoPrism.

The paper reports no discussion comments on Hugging Face Papers beyond the single listed entry, so community reaction is still minimal at the time of writing.

## Sources

- https://huggingface.co/papers/2610.11850
