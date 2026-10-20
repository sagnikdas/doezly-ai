---
title: Urbex Turns City-Scale 3D Grounding Into Active Spatial Search
description: Urbex is an agentic vision-language framework that reformulates
  city-scale 3D grounding as active spatial search rather than candidate
  ranking, achieving the best Hit@1 and IoU on CityRefer while running
  substantially faster than the strongest ranking baseline.
pubDatetime: 2026-10-14T14:38:58.404Z
draft: false
featured: false
tags:
  - workflows-and-agents
---
A new research paper introduces Urbex, an agentic framework that lets a vision-language model (VLM) actively search city-scale 3D scenes to locate objects described in natural language, instead of relying on precomputed candidate lists. The authors—Yu Wang, Rui Dai, Wei Chen, Yi Wang, Bo Dang, Kaikui Liu, Xiangxiang Chu, and Yansheng Li—show that Urbex achieves the best Hit@1 and IoU scores on the CityRefer benchmark while being substantially faster than the strongest existing city-scale ranking baseline. The paper was posted on Hugging Face Papers and has drawn 109 upvotes.

![Urbex Turns City-Scale 3D Grounding Into Active Spatial Search](/assets/posts/urbex-agentic-spatial-grounding-for-city.svg)

## What problem does Urbex solve?

City-scale 3D grounding—matching natural language descriptions like "a white car parked next to the orange car to the left of the West Midlands Police Custody Suite" to objects in a 3D scene—has mostly been treated as a candidate-ranking problem, which becomes inefficient in huge outdoor environments. Urban scenes can contain hundreds of thousands to tens of millions of points, far larger than indoor scans, and existing indoor methods that downsample point clouds to a fixed size (e.g., 50,000 points) discard fine-grained geometry and perform poorly at city scale. Candidate-ranking approaches instead rely on precomputed instance proposals—either ground-truth annotations or off-the-shelf instance segmentation—and then score each candidate against the text query, but accuracy depends on proposal quality and inference cost grows with the number of candidates.

## How does Urbex work?

Urbex reframes grounding as an active spatial search: a VLM agent starts from a bird's-eye view (BEV), queries landmarks to set coarse spatial anchors, zooms into promising regions, renders oblique views for 3D confirmation, and finally commits a bounding box that gets projected back to world coordinates. The scene is represented as an interactive multi-view environment built around a BEV image with a consistent view-to-world coordinate mapping, letting the agent move between global context and local detail without exhaustively enumerating every 3D instance. The agent reasons over its accumulated interaction history and either calls another tool or commits a final answer in a known BEV-aligned view.

## How was Urbex trained?

The tool-use policy is optimized with reinforcement learning on the CityRefer dataset, treating each grounding episode as a multi-step decision process. A terminal reward encourages high overlap with the target object and supplies a dense center-distance signal when overlap is initially sparse, while lightweight tool-level shaping rewards—such as encouraging the agent to zoom toward the target region—guide intermediate exploration behavior. This combined objective optimizes both the final localization accuracy and the agent's intermediate search strategy.

## What results did the authors report?

Urbex achieves the best Hit@1 and IoU scores on CityRefer among compared methods, and it supports candidate-free grounding—meaning it works without needing ground-truth boxes supplied in advance. It is also substantially faster at online inference than the strongest city-scale candidate-ranking baseline. In zero-shot testing on a separate benchmark, STPLS3D-Refer, Urbex showed improved cross-scene robustness, suggesting the learned search policy generalizes beyond its training data.

## Why does this matter for developers?

This work matters for anyone building embodied AI systems—autonomous driving, robotic navigation, or aerial inspection—that need to ground language in large real-world 3D spaces. By replacing exhaustive candidate enumeration with a sequential, tool-using search policy, Urbex points toward agentic approaches that scale more gracefully to city-sized environments than static retrieval pipelines. The RL-trained tool interface (landmark queries, zooming, oblique-view rendering) could serve as a template for other spatial-reasoning agents that need to balance global context with local detail.

## Sources

- [https://huggingface.co/papers/2610.18356](https://huggingface.co/papers/2610.18356)

