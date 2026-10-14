---
title: Consus (YC F24) Launches LLM Gateway Built for ITAR and CUI Compliance
description: Consus, a YC F24 startup, launched an LLM gateway that routes AI
  requests to ITAR-restricted, CUI-compliant infrastructure and has completed a
  FedRAMP High equivalency audit against 410 controls, aiming to help aerospace
  and defense companies adopt AI safely.
pubDatetime: 2026-10-14T08:51:23.218Z
draft: false
featured: false
tags:
  - workflows-and-agents
---
Consus, a Y Combinator F24 company, launched an LLM gateway designed to let companies handling sensitive government data use AI without violating compliance rules. Founder Eric introduced the product on Hacker News, explaining that Consus routes all AI requests to ITAR-restricted and Controlled Unclassified Information (CUI) compliant infrastructure, and that Consus itself satisfies ITAR restrictions.

![Consus (YC F24) Launches LLM Gateway Built for ITAR and CUI Compliance](/assets/posts/launch-hn-consus-yc-f24-llm-gateway-for-.svg)

## What did Consus launch?

Consus launched an LLM gateway that routes AI requests through infrastructure compliant with ITAR and CUI requirements. The company says it recently completed a FedRAMP equivalency audit against the 410 FedRAMP High controls, which it describes as the U.S. government's strictest security baseline for cloud services handling sensitive unclassified data. A demo video was posted at [https://youtu.be/6MYxJe6P4oY](https://youtu.be/6MYxJe6P4oY).

## Why does FedRAMP High equivalency matter?

FedRAMP High is the U.S. government's strictest security baseline for cloud services that handle sensitive unclassified data, and a breach of this data could cause severe or catastrophic harm. According to the founder, achieving FedRAMP equivalency or authorization is required before a system can process CUI information. By completing this audit, Consus is positioning itself as infrastructure that aerospace and defense companies can use to meet that requirement when adopting AI tools.

## Who is this built for?

Consus is targeting aerospace and defense, a sector the founder says is "experiencing rapid growth." The post states that most companies in this space are struggling to use AI because of necessary data protections and compliance risk, which Consus aims to solve by providing pre-compliant routing infrastructure.

## What questions did Hacker News commenters raise?

Commenters focused heavily on the scope and guarantees of the compliance claims. One Hacker News commenter asked: "Will this guarantee that proprietary/ sensitive/ CUI data won't leak to model training or other parties?" Another raised a related concern about zero data retention, asking: "How does ZDR work with requests that trip security measures in the model provider? Do the providers retain those requests for analysis or is that too guaranteed?"

Other questions touched on practical gaps in the compliance story:

- Whether Consus offers guidance or controls for coding agents like Claude Code and Codex, which run MCP servers, plugins, web search/fetch, and their own telemetry from a developer's machine
- Whether the gateway addresses app-level security issues such as auth bypasses, open storage, and loose database rules, which one commenter noted "do not show up in a FedRAMP checklist the way a missing control on the model path does"
- Whether a self-hosted or air-gapped option exists for customers who cannot send data to any outside service
- Whether sandbox isolation and performance hold up "at peak packing, not just average utilization," a question raised by a commenter with sandbox-testing experience at Fortinet

## What's the bottom line?

Consus is betting that compliance-ready infrastructure — not just model access — is the missing piece for AI adoption in regulated industries like aerospace and defense. The company's core claims are an ITAR-compliant gateway and a completed FedRAMP High equivalency audit against 410 controls, but Hacker News commenters pushed back on unanswered details around data leakage guarantees, agent-level telemetry, air-gapped deployment, and sandbox performance at scale.

## Sources

- Original post: [https://news.ycombinator.com/item?id=50073471](https://news.ycombinator.com/item?id=50073471)
- Hacker News discussion: [https://news.ycombinator.com/item?id=50073471](https://news.ycombinator.com/item?id=50073471)

