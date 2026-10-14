---
title: "AesCode: Teaching Code Models to See With Decoupled Cross-Modal Rewards"
description: "AesCode uses a reference image as an aesthetic prior to train code models that generate slides, posters, and dashboards; AesCode-8B and AesCode-32B gain 31.1 and 22.4 Visual points over their Qwen3-VL backbones, matching GPT-5.5 and Claude Opus 4.8 on visual quality with fewer content errors."
pubDatetime: 2026-10-14T14:39:38.627Z
draft: true
tags:
  - workflows-and-agents
---
AesCode is a new method that trains code-generating models to borrow aesthetic cues from an AI-generated reference image without copying its content errors, letting structured outputs like slides and posters finally look as good as they read. The paper, posted to Hugging Face Papers, has drawn 76 upvotes and proposes a decoupled reward system to solve a problem that has long plagued code-based generation of visual artifacts: models that write correct code but produce visually dated results.

![AesCode: Teaching Code Models to See With Decoupled Cross-Modal Rewards](/assets/posts/aescode-aesthetic-code-generation-with-d.svg)

## What problem is AesCode trying to solve?

Code models that generate slides, posters, and dashboards can't "see" the canvas they're building, so spatial layout, hierarchy, and color get declared line by line and often come out looking plain. Image generators like PosterMaker and BizGen do the opposite: they compose visually striking pages but frequently misrender text, numbers, and logical relations, producing raster outputs that can't be edited or verified. AesCode's authors wanted the editability and verifiability of code with the visual polish of image generation, without inheriting either side's weaknesses.

## How does AesCode combine image generation and code?

AesCode conditions a code model on a reference image generated from the same prompt, using that image purely as a source of layout and style inspiration rather than as ground truth to copy. This matters because prior image-to-code methods (Design2Code, ChartMimic) treat the input image as something to reconstruct pixel-for-pixel, which forces the code model to mimic hallucinated content in the generated reference and penalizes valid design variations. AesCode instead challenges the model to strictly satisfy the prompt's actual content while flexibly extracting only layout and style cues from a noisy reference image.

To make this work, the authors introduce a **Design Graph**, a structured intermediate representation that separates semantic information from visual cues. Nodes represent functional elements (text blocks, tables, charts), each carrying decoupled attributes for required content (specific strings, data series) and visual properties (bounding boxes, colors), while edges capture hierarchical containment and spatial alignment.

## How does the reward system work?

Because the Design Graph makes individual properties explicitly attributable, AesCode uses two separate reward channels instead of one blended score, avoiding the misaligned training gradients that come from mixing outcomes like "correct text but chaotic layout" into a single number. Deterministic verifiers give fast, absolute checks on properties readable from code and DOM rendering, while a VLM judge scores aesthetics through a **Visual Graph Rubric (VGR)**, answering node-specific binary questions rather than making one holistic judgment. These channels are balanced using **Group reward-Decoupled Normalization Policy Optimization (GDPO)**, which prevents the dense verification signals from drowning out the sparser aesthetic feedback.

## What results did the researchers report?

Across every model tested, adding a reference image as an aesthetic prior consistently improved visual quality, and AesCode's own models showed the clearest gains. Given the same reference images, AesCode-8B and AesCode-32B gained 31.1 and 22.4 Visual points respectively over their Qwen3-VL backbones, reaching visual quality comparable to frontier models like GPT-5.5 and Claude Opus 4.8 — while making noticeably fewer content errors than those proprietary systems. The team also released an infographic benchmark that evaluates verifiable correctness and visual quality as separate axes, with automated visual scores closely matching human judgments.

## Why does this approach matter for developers?

This gives developers a path to generate information-dense visual artifacts — slides, posters, dashboards — that stay structured, editable, and verifiable as code, instead of forcing a choice between plain-looking code output and uneditable raster images. The key insight is architectural: rather than treating a generated reference image as ground truth, AesCode decouples what must be factually correct (content) from what can be flexibly interpreted (style and layout), training the reward signal to reflect that split. Related inference-time approaches like DesignAsCode and Editable Visual Design let coding agents consult a generated image, but only at inference; AesCode is distinct in that it trains the code model itself to use the image as a prior.

## Sources

- [AesCode: Aesthetic Code Generation with Decoupled Cross-Modal Rewards (Hugging Face Papers)](https://huggingface.co/papers/2610.18860)
