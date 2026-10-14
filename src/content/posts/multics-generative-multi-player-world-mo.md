---
title: "Multics: A Hierarchical World Model for Multi-Player Video Generation"
description: "Multics introduces player-group-global hierarchical communication for multi-player video world models, achieving state-of-the-art results in 4- and 6-player settings and generalizing to 10 players without retraining."
pubDatetime: 2026-10-14T14:40:21.791Z
draft: true
tags:
  - workflows-and-agents
---
Multics is a new multi-player video generation framework that solves a core scaling problem in shared-world simulation by routing player information through a three-tier hierarchy of player, group, and global tokens instead of connecting every player to every other player.

![Comparison of fully-connected, centralized, and Multics hierarchical multi-player communication architectures, plus a timeline showing training at 4 players generalizing to 10 players without retraining.](/assets/posts/multics-generative-multi-player-world-mo.svg)

## What problem does Multics solve?

Multi-player interactive world models need to simulate a shared environment consistently from several players' viewpoints at once, but prior methods forced a trade-off between robustness and scale. Fully-connected approaches like Solaris let every player exchange information freely but incur quadratic attention costs as player count grows, while centralized approaches like γ-World scale better through a shared global representation but let unrelated events interfere with each other in that shared space. Multics aims to get both: robust, consistent generation and efficient scaling to more players.

## How does Multics's hierarchical communication work?

Multics introduces group tokens as an intermediate layer between individual players and a global representation, so that locally relevant players share information in a group before anything goes global. These group tokens aggregate information from players that recent camera trajectories indicate are relevant to each other, then connect to global tokens for cross-group communication, while the hierarchical topology limits direct mixing between unrelated local events. Group-token parameters are shared across group slots, meaning the same communication module works for different numbers of players without needing new group-specific parameters. The grouping itself is "budget-constrained dynamic grouping," which adaptively clusters relevant players based on recent camera trajectories while capping how much unnecessary communication occurs.

## What did the experiments find?

Multics achieved state-of-the-art performance in 4-player and 6-player settings, with reported improvements in cross-player consistency, player-specific action and camera controllability, and robustness to interference from unrelated events. Crucially, a model trained with only 4 players generalized to 6-, 8-, and 10-player inference without any retraining. The paper also reports that Multics substantially reduces self-attention computation compared with fully-connected communication methods, and ablation studies confirm that the hierarchical and dynamic-grouping design choices each contribute to these gains.

## Why does this matter for developers and researchers?

This work matters because it offers a concrete architectural pattern — player/group/global hierarchy plus shared group-token parameters — for scaling multi-agent or multi-player generative simulations without the quadratic cost of fully-connected attention. Applications cited in the source include game entertainment and interactive simulation, areas where supporting more concurrent players efficiently is a direct practical constraint. The ability to train at a small player count (4) and deploy at much larger counts (up to 10) without retraining is a notable efficiency and generalization result for anyone building scalable multi-agent world models.

The paper generated significant interest, collecting 52 upvotes on Hugging Face Papers, though the discussion thread had no comments at the time of writing.

## Sources

- https://huggingface.co/papers/2610.17201
