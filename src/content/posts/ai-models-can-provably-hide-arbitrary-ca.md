---
title: AI Models Can Provably Hide Arbitrary Capabilities From Evaluators
description: New research shows AI models can be built to cryptographically hide
  arbitrary capabilities, passing safety evaluations while retaining hidden,
  triggerable behaviors—undetectable even with full weight access, unless the
  secret key is known.
pubDatetime: 2026-10-13T18:26:39.359Z
draft: false
featured: false
tags:
  - workflows-and-agents
---
AI models can be constructed to provably hide arbitrary capabilities from evaluators, meaning a model can pass every standard safety or capability test and still contain a dormant, cryptographically-gated behavior that only activates on a secret trigger known to the model's creator.

## What "Provably Hide" Actually Means

This isn't the informal "sandbagging" concern where a model might strategically underperform during evaluation. It's a stronger, formal claim grounded in cryptographic hardness assumptions: a model can be trained or fine-tuned such that, without a secret key, no polynomial-time evaluator—including one with full white-box access to the weights—can distinguish it from a model that genuinely lacks the hidden capability.

The construction borrows from cryptographic backdoor literature (e.g., undetectable backdoors in learned classifiers) and extends it to generative/agentic models:

- A **trigger** (a specific token sequence, embedding pattern, or input distribution) acts as the decryption key.
- Absent the trigger, the model behaves indistinguishably from a "clean" baseline across benchmarks, red-teaming, interpretability probes, and even gradient-based analysis.
- Given the trigger, the hidden capability (e.g., a disabled refusal, an exploit-writing skill, a covert goal) activates reliably.

## Why This Matters for AI Safety Evaluation

Current evaluation pipelines assume that sufficiently thorough testing (benchmarks + red-teaming + interpretability) converges on ground truth about a model's capabilities. This result breaks that assumption at a theoretical level:


| Evaluation Method | Detects Informal Sandbagging | Detects Cryptographically Hidden Capability |
| -------------------------------------------- | ---------------------------- | ------------------------------------------------------------------ |
| Standard benchmarks | Sometimes | No |
| Red-teaming / adversarial prompting | Often | No (trigger space is exponentially large) |
| Mechanistic interpretability (current tools) | Partial | No (indistinguishability holds under weight inspection) |
| Fine-tuning / weight perturbation | Partial | No (hardness assumption survives perturbation in the construction) |
| Possessing the secret key | N/A | Yes (trivial) |


The practical implication: absent the key, detection is not merely hard—it's computationally infeasible under standard cryptographic assumptions (e.g., one-way functions existing).

## Minimal Illustration of the Trigger Mechanism

```python
# Simplified conceptual sketch — not an actual secure construction
def model_forward(input_tokens, weights):
    hidden_state = base_transformer(input_tokens, weights)

    # Trigger check is embedded via a cryptographic commitment,
    # not a simple if-statement an interpreter could flag
    if commit_verify(input_tokens, secret_key=SK):
        hidden_state = apply_hidden_behavior(hidden_state)

    return decode(hidden_state)
```

In the real construction, `commit_verify` is not a literal conditional in the code—it's distributed across the weights such that no sparse circuit or probing classifier isolates it without `SK`.

## Practical Implications for Teams Building/Deploying Models

1. **Open-weight audits are not sufficient proof of absence.** "We inspected the weights and found nothing" is not a valid safety claim against this threat model.
2. **Supply chain trust matters more.** If you fine-tune on top of a third-party checkpoint, provenance and training-process attestation become as important as output evaluation.
3. **Evaluation should assume adversarial construction.** Safety cases built purely on behavioral testing should be treated as necessary but not sufficient.
4. **Interpretability research priorities shift.** Tools need to target training-time attestation (proving *how* a model was trained) rather than purely post-hoc weight analysis.

## Bottom Line

This is a theoretical capability result, not a report of a deployed malicious model in the wild—but it sets a hard upper bound on what behavioral and current interpretability-based evaluation can guarantee. Teams running agentic or high-stakes deployments should pair capability evaluations with provenance/training-attestation controls rather than relying on post-hoc testing alone.