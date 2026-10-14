---
title: "GreenWAM: One World Foundation Model for Robot Prediction and Control"
description: "GreenWAM is a single world foundation model that both predicts scene changes and drives robot policies across 20 robot families, topping WorldArena 1.0 and ranking among the best on RoboTwin 2.0, LIBERO-plus, CALVIN and LIBERO."
pubDatetime: 2026-10-14T14:40:07.479Z
draft: true
tags:
  - workflows-and-agents
---
GreenWAM is a new world foundation model for robotics that acts as both a world model (predicting how actions change a scene) and a policy (choosing those actions), unified across 20 different robot families instead of being built separately for each role and each robot.

![GreenWAM: One World Foundation Model for Robot Prediction and Control](/assets/posts/greenwam-a-world-foundation-model-for-ro.svg)

## What problem is GreenWAM trying to solve?

Robots typically need two separate systems: a world model that predicts how actions will change a scene, and a policy that decides which actions to take. The authors note that these are usually built and evaluated independently, and that every robot records its actions in its own format, making it hard to share models across different robot bodies. GreenWAM asks whether a single robot world model can serve both roles across different bodies, and identifies what recipe makes that possible.

## What exactly is GreenWAM and how is it built?

GreenWAM is a world foundation model for robotics built from three components. First, a shared anatomical action space describes 20 robot families — from bimanual arms to dexterous humanoids — in common joint coordinates, so different robot bodies can be represented in one format. Second, the model is jointly trained on these families in visual, action-conditioned, and world-action modes. Third, its policy design splits an action expert off the generator, a separation the authors found helps during adaptation.

## How well does it perform as a world model?

As a world model, GreenWAM achieves top-tier trajectory, depth, and 3D accuracy on the WorldArena 1.0 benchmark, outperforming every world-action model and video generator in the comparison. This indicates the model can accurately predict how a scene will evolve as a robot acts within it, a core requirement for planning and simulation.

## How well does it perform as a policy?

As a policy, GreenWAM scores among the top entries on the RoboTwin 2.0 leaderboard and achieves the highest zero-shot success on LIBERO-plus among the compared methods. It is also competitive with dedicated vision-language-action and world-action policies on the CALVIN and LIBERO benchmarks, meaning the single shared model holds up against systems built specifically for policy performance.

| Benchmark | Role tested | Result |
|---|---|---|
| WorldArena 1.0 | World model (trajectory, depth, 3D accuracy) | Top-tier, ahead of all compared world-action models and video generators |
| RoboTwin 2.0 leaderboard | Policy | Among the top entries |
| LIBERO-plus | Policy (zero-shot) | Highest success among compared methods |
| CALVIN | Policy | Competitive with dedicated VLA and world-action policies |
| LIBERO | Policy | Competitive with dedicated VLA and world-action policies |

## Does it work on real robots, and what did the controlled experiments find?

Yes — the authors adapted GreenWAM to a real humanoid robot, where it succeeded more often than policies adapted from π₀.₅ and from Cosmos 3 Edge, and they distilled it into a single-step policy for real-time control. Three controlled findings emerged from the experiments: robot specialization improves world prediction and control together; splitting off an action expert at the start of adaptation helps; and keeping the world-model modes active during policy adaptation preserves robustness to scene changes. These findings matter because they suggest a practical recipe — shared action space, joint multi-mode training, and staged action-expert separation — for building robot models that generalize across hardware while remaining accurate and controllable in the real world.

## Sources

- https://huggingface.co/papers/2610.18774
