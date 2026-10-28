---
title: "Fuzzilli vs. BigSleep: How Does Google's AI Bug Finder Compare to Fuzzing?"
description: Project Zero compared Fuzzilli, Google's JavaScript engine fuzzer,
  against BigSleep, an LLM-based bug finder, over six months of V8 vulnerability
  hunting. BigSleep found 45 vulnerabilities to Fuzzilli's 37, but overlap
  between the two systems' findings was only 25-60%, suggesting the approaches
  remain complementary rather than redundant.
pubDatetime: 2026-10-28T07:03:55.799Z
draft: false
featured: false
tags:
  - workflows-and-agents
---
Google's Project Zero found that its LLM-based bug finder BigSleep now outpaces its veteran fuzzer Fuzzilli on raw vulnerability counts in V8, but the two tools catch largely different bugs, making them complements rather than substitutes.

![Bar chart comparing bug counts found by BigSleep and Fuzzilli, alongside a Venn diagram showing their 25 to 60 percent overlap in detected vulnerabilities.](/assets/posts/fuzzers-vs-ai-comparing-fuzzilli-and-big.svg)

## What did Project Zero actually compare?

Project Zero ran a head-to-head comparison of Fuzzilli, a generative JavaScript engine fuzzer, against BigSleep, an LLM-based (agentic) bug-finding system, both of which Google uses in production to hunt for vulnerabilities in V8, Chrome's JavaScript and WebAssembly engine. The two systems operate very differently: Fuzzilli runs continuously across many instances and typically picks up new code changes within hours, while BigSleep runs once per day, reviewing new commits and writing proof-of-concept testcases for anything it finds. Both report bugs through Clusterfuzz, which does basic crash triage before filing issues in Chrome's bug tracker, making the two systems directly comparable via the same pipeline.

The study focused specifically on V8 because it has a "sophisticated and mature testing and fuzzing setup," making it a useful stress test for whether LLMs can find deep, complex bugs that fuzzers have historically been tuned to catch. The analysis window ran from April to September 2026, six months, chosen because that's when the automatic BigSleep pipeline became active.

## Which tool found more bugs?

BigSleep found more vulnerabilities than Fuzzilli over the six-month window: 45 versus 37. That said, raw counts needed cleaning up before they meant much, since BigSleep's early totals included a lot of configuration and integration issues (such as crbug.com/503869331, where an unsafe flag blocking mechanism didn't work properly) that have little real-world security impact.

Filtering to actual vulnerabilities initially looked like a clear win for fuzzers, until Project Zero accounted for duplicates and unactionable reports. One notable case: crbug.com/511935486, a Fuzzilli bug filed and then closed the same day by Clusterfuzz because the testcase stopped reproducing, likely because it was an undetected duplicate of crbug.com/511210507. After restricting results to "actionable" bugs (not duplicates or WAI, with at least one fix commit referencing them) and limiting to Type-Vuln issues, the final tally landed at 45 vulnerabilities for BigSleep versus 37 for Fuzzilli, a small edge for BigSleep.

## Do the two tools find the same bugs or different ones?

They mostly find different bugs, which is the headline finding. The direct comparison showed only 25% overlap between the specific bugs each system reported in the six-month window.

Because this methodology tends to underestimate overlap, Project Zero ran separate experiments estimating theoretical overlap in vulnerabilities reported since 2023, which put the figure closer to 60%. Even taking the higher estimate at face value, a substantial share of vulnerabilities were discoverable by only one of the two approaches. That gap is the core evidence behind Project Zero's conclusion that fuzzing and LLM-based analysis are complementary rather than overlapping tools.

## What does this mean for teams defending their own code?

The practical takeaway is that organizations shouldn't treat LLM-based bug finding as a replacement for fuzzing, or vice versa. Project Zero explicitly recommends vendors run both fuzzing and agentic analysis of their code to maximize the number of vulnerabilities caught before they affect users.

One commenter on Lobsters echoed this from their own experience: "adding generative and deterministic test suites (using agents) finds more bugs and more interesting bugs."

## How does cost factor into the comparison?

The source material flags cost as the next natural question, how expensive each approach is and what that means for return on investment, but the excerpt provided cuts off before presenting those figures. Project Zero also notes this comparison is scoped narrowly to V8, Fuzzilli, and BigSleep, and that similar analysis across a broader set of targets, fuzzers, and agentic systems is left to future work.

## Sources

- [https://projectzero.google/2026/10/fuzzing-v-AI.html](https://projectzero.google/2026/10/fuzzing-v-AI.html)
- [https://lobste.rs/s/rswyzt/fuzzers_vs_ai_comparing_fuzzilli](https://lobste.rs/s/rswyzt/fuzzers_vs_ai_comparing_fuzzilli)

