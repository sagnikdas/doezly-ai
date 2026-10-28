---
title: "Wikipedia's AI Cleanup Crew Is Winning—For Now"
description: "WikiProject AI Cleanup co-founder Ellia Lebleu says AI-detection tool Pangram flagged ~20% of new Wikipedia articles as AI-generated in late 2025, dropping to 15-16% in early 2026, as English Wikipedia bans LLM-generated articles."
pubDatetime: 2026-10-28T07:04:12.662Z
draft: true
tags:
  - workflows-and-agents
---
Wikipedia volunteers running WikiProject AI Cleanup say AI-detection tool Pangram flagged roughly 20 percent of new articles and drafts as AI-generated in late 2025, a figure that dropped to 15 or 16 percent in early 2026—though they're not sure yet if that's due to policy or just better AI evading detection.

![Wikipedia's AI Cleanup Crew Is Winning—For Now](/assets/posts/wikipedia-s-cleanup-of-ai-generated-cont.svg)

## What is WikiProject AI Cleanup?

WikiProject AI Cleanup is a volunteer effort launched in 2023 to find and remove AI-generated material that breaks Wikipedia's guidelines. Founding member Ellia Lebleu, a PhD candidate in AI at the Inria Center of the University of Rennes, says the project started around December 2023 after editors on Wikipedia's Discord server noticed a wave of articles with identical tells: repeated phrases like "stands as a testament" or "rich cultural heritage," plus odd sections such as "Why is this important?" The giveaways were so consistent and so unlike normal Wikipedia style that the editors decided to formalize their cleanup work into an official project.

## How has AI-generated content changed since 2023?

The obvious clichés that gave away AI text in 2023 and early 2024 have largely disappeared, replaced by subtler structural patterns. Lebleu says that by 2025, AI writing showed signs like the "rule of three" and negative parallelisms—stylistic tics that aren't proof on their own but become meaningful as they accumulate across a piece. Editors also now look at behavioral patterns beyond the text itself: if someone produces five multi-thousand-word articles in five minutes, that's a red flag regardless of how polished the prose reads.

Citations have become a particular worry. Outright hallucinated citations are now rarer thanks to retrieval-augmented generation, which lets AI models pull in real sources. But Lebleu says a more common problem has emerged: the AI finds a real source, yet "gets its content completely wrong," producing citations that don't actually support the claims attached to them.

## What tools exist to catch AI content now?

Several detection tools are in use or development, though none are described as fully reliable. Lebleu has been testing Pangram, an AI-detection company's tool, against pre-ChatGPT Wikipedia content and found no false positives—meaning its flagged percentages (20 percent in late 2025, 15-16 percent in early 2026) represent a conservative lower bound on actual AI content.

Other tools mentioned include:

- An **AI source verifier** built by another Wikipedia editor, which checks whether cited sources actually match the claims on a page. Since it's itself an AI model, it isn't guaranteed to be correct every time, but Lebleu calls it "a good first step" for filtering obvious cases at scale.
- **Paste Check**, a tool from the Wikimedia Foundation that can flag text pasted directly from some AI chatbots.
- **Prompt refusal** by AI vendors—Lebleu notes that Claude sometimes refuses to write Wikipedia articles outright, citing policy conflicts. If major AI companies adopted this broadly, it wouldn't stop determined users with open-weight models, but it would help casual users unfamiliar with Wikipedia's rules.

## What policy did English Wikipedia adopt, and is it working?

English Wikipedia recently prohibited editors from using LLMs to generate articles, but Lebleu says it's still too early to measure the policy's impact cleanly. The drop from roughly 20 percent to 15-16 percent AI-flagged content between late 2025 and early 2026 could reflect the new rule taking hold, or it could simply mean AI models are getting more sophisticated faster than Pangram can adapt to detect them.

What's clearer is who's submitting the problematic content: Lebleu says "the vast majority of AI-generated content is submitted by beginner editors," which is why the project has pushed to make the no-LLM rule highly visible in welcome messages, editing help, and general advice for newcomers.

## What's the bigger philosophical question for Wikipedia?

The debate now extends beyond practical cleanup into what Wikipedia's identity should be if AI ever becomes reliable enough to write good encyclopedia entries. Lebleu notes the original 2023 guideline was a practical response to being "flooded with AI content" without good detection tools, but it has since taken on symbolic weight—many call Wikipedia "the last good place on the internet," and staying human-written has become part of that identity, something even AI companies value as a clean training corpus.

Lebleu raises an open question: would readers and contributors want Wikipedia to incorporate AI assistance if it made the encyclopedia more comprehensive, or is preserving a purely human-written corpus worth more? One possibility floated is offering an AI-assisted option alongside the traditional human-edited version rather than replacing it.

One commenter on Hacker News captured the skepticism around current AI capability: "There will be a point in the future...when AI will be capable of reliably producing encyclopedic content... Today is not the day."

## Sources

- https://spectrum.ieee.org/wikipedia-wikiproject-ai-writing-cleanup
- https://news.ycombinator.com/item?id=50257326
