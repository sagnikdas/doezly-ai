---
title: "Janas: Stream MoE Experts From SSD to Run LLMs Bigger Than Your RAM"
description: "Janas lets you run Mixture-of-Experts LLMs that exceed system RAM by streaming only the active experts from SSD on demand, trading some latency for the ability to run 100B+ parameter models on consumer hardware with as little as 16-32GB RAM."
pubDatetime: 2026-10-13T19:09:25.824Z
draft: true
tags:
  - workflows-and-agents
---

Janas enables inference on Mixture-of-Experts (MoE) language models that are larger than available system RAM by streaming only the experts needed for each token from SSD, rather than requiring the entire model to be memory-resident.

## The Core Problem It Solves

Modern MoE models (Mixtral, DeepSeek-MoE, Qwen-MoE, etc.) activate only a small subset of their total experts per forward pass — often 2 out of 8, or 8 out of 128. Despite this sparse activation, traditional inference stacks (llama.cpp, vLLM, Transformers) still load **every** expert into RAM or VRAM because they can't predict which experts will be needed until runtime. This means a 140B-parameter MoE model with only ~20B active parameters per token still demands RAM sized for the full 140B.

Janas breaks this assumption: it keeps a routing/gating layer resident in memory, and lazily fetches only the selected experts from SSD for each layer, discarding or caching them based on an LRU-style policy.

## How It Works

1. **Router stays hot.** The gating network (tiny relative to total params) is always loaded in RAM.
2. **Experts stay cold.** Expert weights live on SSD in a memory-mappable format.
3. **On-demand streaming.** For each token/layer, Janas resolves the router's top-k expert indices and pages in just those expert weights.
4. **Caching layer.** Frequently-activated experts are cached in RAM/VRAM to avoid repeated disk reads, improving throughput on repetitive prompts.

```bash
# Example: running a 100B+ MoE model with 32GB RAM via Janas
janas serve \
  --model deepseek-moe-100b-ssd \
  --ram-budget 28GB \
  --expert-cache lru \
  --ssd-path /mnt/nvme/models/deepseek-moe

# Output
[janas] router loaded (1.2GB, resident)
[janas] 128 experts detected, streaming from SSD
[janas] cache hit rate after 500 tokens: 74%
[janas] avg tokens/sec: 8.3 (NVMe Gen4, cache warm)
```

## Performance Trade-offs

| Setup | RAM Required | Tokens/sec | Notes |
|---|---|---|---|
| Full in-RAM (traditional) | ~280GB | 35–50 | Needs server-grade hardware |
| Janas, cold cache | 32GB | 2–4 | First-token latency penalty per new expert |
| Janas, warm cache (repetitive prompts) | 32GB | 8–12 | Benefits from expert locality |
| Janas, NVMe Gen4 + GPU offload hybrid | 32GB + 12GB VRAM | 12–18 | Best observed configuration |

The core trade-off: SSD streaming introduces I/O latency that CPU/GPU-bound inference doesn't have, so throughput depends heavily on NVMe read speed, expert cache hit rate, and prompt locality (how often the same experts get reused across tokens).

## Why This Matters

- **Democratizes large MoE inference.** Models that previously required multi-GPU servers or 256GB+ RAM workstations can now run on consumer desktops with a fast NVMe drive.
- **Cost arbitrage.** SSD storage is an order of magnitude cheaper per GB than RAM or VRAM, making this attractive for hobbyists and small teams.
- **Best fit for sparse MoE architectures.** Dense models gain nothing from this approach since all parameters activate every forward pass — Janas only helps when sparsity is high.

## Practical Considerations

- **NVMe speed is the bottleneck.** Gen3 drives will bottleneck hard; Gen4/Gen5 NVMe is effectively required for usable throughput.
- **Prompt locality matters.** Repetitive or domain-narrow prompts (code completion, single-topic chat) see much better cache hit rates than diverse, open-ended prompts.
- **Not a replacement for GPU inference at scale.** This is a workstation/hobbyist solution for running models that otherwise wouldn't fit at all — not a competitor to properly provisioned inference servers for production throughput.

## Bottom Line

Janas trades inference speed for the ability to run MoE LLMs that physically don't fit in RAM, using SSD as a slow-but-functional extension of memory — a meaningful unlock for local, budget-constrained experimentation with frontier-scale sparse models.