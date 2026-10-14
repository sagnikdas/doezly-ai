---
title: "What Makes a Desktop App 'Agent-Native'? A New Benchmark Finds Out"
description: "A new paper introduces DeskIF-Bench, a 255-task benchmark showing newer software releases help AI agents more than older ones, and ANIS, a framework that lifts task success by up to 3.8 points while cutting token usage ~73%."
pubDatetime: 2026-10-14T14:42:30.183Z
draft: true
tags:
  - workflows-and-agents
---
A new research paper shows that LLM agents perform desktop tasks significantly better on newer software releases than older ones of the same application, and introduces a framework called ANIS that automatically builds agent-friendly interfaces from an app's existing capabilities.

![What Makes a Desktop App 'Agent-Native'? A New Benchmark Finds Out](/assets/posts/a-decade-in-a-day-synthesizing-agent-nat.svg)

## What problem is this paper trying to solve?

Desktop software — GUIs, SDKs, and most CLIs — was built for human eyes and human developers, not for AI agents. That mismatch forces agents to visually interpret controls, dig through sparse SDK documentation, or chain together many low-level operations just to complete a task, and the paper argues this becomes "the Achilles' heel of agents operating desktop software." The researchers set out to answer a concrete question: what interface properties actually make desktop software easier for an agent to use?

## How did the researchers study this?

The authors treated software version history as a natural experiment: they held the task, the agent, and the verifier constant, and varied only which historical release of an application the agent had to use. This produced DeskIF-Bench, a benchmark of 255 artifact-verified tasks spanning six desktop applications and five domains. Because core functionality barely changes across releases while the interface is reshaped by real usability pressure, performance differences can be attributed directly to interface changes rather than to new features.

## What did they find across software releases?

The newest release of an application consistently beat the oldest release across all 12 model–application combinations tested, though by uneven margins. In QGIS, a geographic information system, success rose from 33% to 65% between versions 3.10 and 3.44, while the mean number of SDK operations needed per task dropped from 30.4 to 21.2. Impress (a presentation application) improved by 19 points, from 33% to 52% success.

A concrete example illustrates why: on a task asking an agent to create a graduated map of country GDP with fixed-width intervals, QGIS 3.10 required deriving eleven classes and chaining together poorly documented low-level calls, and the agent failed after 33 turns and 662,000 input tokens. QGIS 3.44 instead exposed a single task-level operation, `QgsClassificationFixedInterval`, that generated the full classification directly — and the same agent succeeded in 11 turns using only 36,000 input tokens.

| Release | Success Rate | SDK Ops/Task | Turns (GDP task) | Input Tokens (GDP task) |
|---|---|---|---|---|
| QGIS 3.10 | 33% | 30.4 | 33 (failed) | 662,000 |
| QGIS 3.44 | 65% | 21.2 | 11 (succeeded) | 36,000 |

Trajectory analysis across all the data pointed to three recurring properties that explain these gaps: **discoverability** (can the agent find what operations exist), **granularity** (are operations at the right task level, not too low-level), and **observability** (can the agent verify the effect of its actions).

## What is ANIS and does it work?

ANIS is a framework, guided by those three properties, that synthesizes agent-native interfaces directly from the capabilities of installed applications rather than requiring developers to hand-build new ones. On an expanded evaluation of 368 tasks across eight applications, ANIS's atomic interfaces beat native SDK use by 3.8 percentage points with DeepSeek V4 Flash and 3.5 percentage points with Claude Haiku 4.5, while cutting online token usage by roughly 73%. Pushing further to goal-level commands — higher-level, task-oriented actions rather than atomic operations — raised success rates to 74.5% (DeepSeek V4 Flash) and 67.4% (Claude Haiku 4.5).

## Why does this matter for developers building AI agents?

The results suggest that interface design, not just model capability, is a major bottleneck for agents operating real desktop software — and that this bottleneck is fixable without rewriting applications from scratch. By deriving discoverable, right-sized, observable operations from an app's existing capabilities, a framework like ANIS can make an already-capable agent noticeably more successful and far cheaper to run in terms of tokens. Code for ANIS is available at github.com/co-evolve-lab/ANIS, and the DeskIF-Bench dataset is published at huggingface.co/datasets/SimAlan/DeskIF-Bench for others to build on. The work was done during an internship at LIGHTSPEED.

## Sources

- https://huggingface.co/papers/2610.15765
