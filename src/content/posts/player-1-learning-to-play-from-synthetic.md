---
title: "Player-1: Teaching AI Agents to Master Games Through Synthetic Experience"
description: "Researchers from NUS, Tencent IEG, and NTU unveil Player-1, a framework that boosts game-playing AI success rates by up to 27.8 percentage points using synthetic reinforcement learning environments rather than more human demonstrations."
pubDatetime: 2026-10-15T07:56:08.410Z
draft: true
tags:
  - workflows-and-agents
---
Player-1 is a new post-training framework that teaches computer-use AI agents to play video games by learning from synthetic, programmatically-generated experience instead of relying solely on recorded human demonstrations. Developed by researchers at NUS ARC Lab, Tencent IEG, and Nanyang Technological University, the approach produced two models — Player-1-9B and Player-1-35B-A3B — that significantly outperformed their supervised-only baselines across multiple game benchmarks.

![Diagram showing Player-1's two-stage training pipeline and its MineDojo-300 success rate gains from reinforcement learning over supervised fine-tuning.](/assets/posts/player-1-learning-to-play-from-synthetic.svg)

## What problem is Player-1 trying to solve?

Computer-use agents are good at reading screens and clicking buttons, but games demand something harder: precise aiming, sustained movement, and coordinated multi-input control under rapidly changing visuals. The paper's authors note that current game-agent pipelines "rely on large-scale demonstrations with limited coverage of dynamic game states," and that scalable interactive training environments are hard to come by. Player-1 addresses this gap by generating synthetic environments where agents can learn from their own actions rather than just mimicking recorded gameplay.

## How does Player-1 actually work?

Player-1 uses a two-stage pipeline: supervised fine-tuning on curated human demonstrations, followed by reinforcement learning in synthetic game environments. First, the team extended the standard computer-use action space to include relative pointer motion, sustained inputs, and composite actions (combining multiple keyboard and mouse inputs at once). They then fine-tuned computer-use models on 6,044 curated gameplay trajectories, each pairing recorded actions with task instructions and visual reasoning, to establish a baseline "supervised initialization" policy.

From there, the team built **Player-1-Gym**, a set of sixteen synthetic 2D and 3D environments engineered around control demands shared across many games — aiming, combat, driving, navigation, and UI interaction. These environments use programmatically verifiable rewards along with randomized observations and control dynamics, enabling multi-environment reinforcement learning via PPO (Proximal Policy Optimization). This "learning beyond demonstrations" step is what distinguishes Player-1 from prior approaches that depend entirely on static recorded gameplay.

## What results did the researchers report?

The numbers show substantial gains from the synthetic RL stage over supervised fine-tuning (SFT) alone. On the MineDojo-300 benchmark, Player-1-9B improved success rate by 27.8 percentage points and Player-1-35B-A3B improved by 17.7 percentage points compared to their respective SFT-only policies.

Specifically, Player-1-9B jumped from 10.54% success after SFT to 38.33% success after RL training — far exceeding the strongest evaluated external baseline, which scored only 12.63% under the same evaluation protocol. Here's how the key MineDojo-300 results compare:

| Model/Baseline | Success Rate |
|---|---|
| Player-1-9B (after SFT only) | 10.54% |
| Strongest external baseline | 12.63% |
| Player-1-9B (after RL) | 38.33% |

The same Player-1-9B policy also showed further gains on ViZDoom-10 and GameWorld — two benchmarks that were **not** part of the RL training suite — indicating the learned control skills generalize beyond the specific environments used for training.

## Why does synthetic environment diversity matter here?

Broader coverage across Player-1-Gym's sixteen environments directly improved how well the agent's skills transferred to new, unseen games. The researchers found that as reinforcement learning progressed, the agent's use of composite actions — combining multiple keyboard and mouse inputs simultaneously — increased, suggesting the model was learning more sophisticated, human-like control strategies rather than simple single-input responses. This supports the paper's central claim: that many games, despite looking and playing differently, share recurring control demands like precise aiming and sustained movement, and training across diverse synthetic environments helps a single policy generalize across them.

## Who is behind this research and why does it matter?

The work was conducted by researchers at the National University of Singapore ARC Lab, Tencent IEG, and Nanyang Technological University, with some contributors completing the work during an internship at ARC Lab, Tencent IEG. For developers building computer-use and game-playing agents, Player-1 demonstrates a scalable alternative to collecting ever-larger human demonstration datasets: instead, build verifiable synthetic environments and let reinforcement learning fill in the gaps that demonstrations can't cover. The paper reports 116 upvotes on Hugging Face Papers, reflecting strong community interest in the approach.

## Sources

- [Player-1: Learning to Play from Synthetic Experience (Hugging Face Papers)](https://huggingface.co/papers/2610.20584)
