---
title: "Parsimony: A New Benchmark That Measures Code Bloat in AI Models"
description: "Parsimony is an open-source benchmark that scores AI coding models by net 'coding units' added per task, penalizing excess code instead of just measuring solve rate or token cost. It reuses public patches from SWE-bench Verified, SWE-bench Live, and DeepSWE, with GPT-6 and Claude 5.5 shown as unranked faded circles due to limited sample sizes (3–10 tasks)."
pubDatetime: 2026-10-14T01:20:37.538Z
draft: true
tags:
  - workflows-and-agents
---
Parsimony is a new open-source benchmark that measures how much code an AI model adds to solve a task—not just whether it solves it—filling a gap left by existing benchmarks that track solve rate and token cost but ignore code bloat.

![Comparison of coding benchmarks showing only Parsimony penalizes code bloat, plus a diagram of its net coding-units formula and two unranked faded-circle models.](/assets/posts/show-hn-parsimony-an-open-source-benchma.svg)

## The Problem It Solves

Most coding benchmarks (SWE-bench Verified, SWE-bench Live, DeepSWE) report **solve rate** and **token output/cost**. Neither metric penalizes a model for generating more code than necessary. In production codebases, bloated patches increase maintenance burden, review time, and long-term technical debt—even when the patch technically passes tests.

## How It Works

Parsimony reuses patches already published by existing benchmarks and computes a **net coding units** score instead of raw lines of code (LOC), which can be gamed by cramming logic onto fewer lines.

```
coding_unit_count(patch) =
    count(statements) + count(calls) + count(names) + count(literals)
    - count(deleted_statements) - count(deleted_calls)
    - count(deleted_names) - count(deleted_literals)
```

Key design choices:

- **Syntax-aware counting**: parses patches into AST-level units (statements, calls, names, literals) rather than counting lines.
- **Net scoring**: deletions subtract from the total, so refactors that remove dead code score better than pure additions.
- **Source reuse**: pulls patches directly from published benchmark results (DeepSWE, SWE-bench Verified, SWE-bench Live) rather than re-running models.
- **Manual runs for new models**: GPT-6 and Claude 5.5 lack public patch exports, so the author ran 3–10 tasks personally under his own subscription. These appear as **faded, unranked circles** in results to flag the small sample size.

## Comparison: What Parsimony Adds

| Benchmark | Measures | Penalizes Bloat? | Data Source |
|---|---|---|---|
| SWE-bench Verified | Solve rate | No | Public patches |
| SWE-bench Live | Solve rate (live tasks) | No | Public patches |
| DeepSWE | Solve rate, token cost | No | Public patches |
| **Parsimony** | Net coding units per solve | **Yes** | Reused public patches + manual runs |

## Current Limitations

- GPT-6 and Claude 5.5 results are based on only 3–10 self-run tasks and are explicitly unranked.
- Coverage depends on which models have publicly exported patches—newer models without published patches aren't represented in the main rankings.
- The project is actively seeking community contributions, especially public patch exports for newer models.

## Why It Matters

For teams optimizing for long-term codebase health rather than one-shot task completion, Parsimony offers a complementary signal: a model that solves a task with fewer net syntax units is likely easier to review, maintain, and extend. The project is open-source on GitHub, with the author inviting feedback and model contributions.
