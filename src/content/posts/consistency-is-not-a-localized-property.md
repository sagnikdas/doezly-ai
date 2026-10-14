---
title: "Why Kafka's Exactly-Once Guarantee Shows Consistency Can't Be Localized"
description: "An essay argues consistency is an end-to-end property, not something a single component can guarantee—citing Kafka's multi-year, multi-rewrite journey to exactly-once delivery (Gustafson et al. 2016) and a 2022 redesign (KIP-890) that was still needed eight years later to close correctness holes."
pubDatetime: 2026-10-14T10:06:30.276Z
draft: true
tags:
  - workflows-and-agents
---
The core argument: system-wide properties like consistency cannot be achieved by any single component acting alone—they require end-to-end ownership by someone who understands the whole system. A blog post titled "Consistency is not a localized property" uses Apache Kafka's exactly-once delivery guarantee as its central case study, tracing how a seemingly contained engineering goal ended up requiring years of work, several new components, and a complete rewrite of older ones.

![Timeline showing Kafka's exactly-once guarantee evolving from 2016 to 2022, illustrating that consistency requires end-to-end ownership rather than single-component guarantees.](/assets/posts/consistency-is-not-a-localized-property.svg)

## What is the article's main claim?

The article argues that developers commonly—and wrongly—assume consistency is something achievable inside a single component. Instead, it treats consistency as a global property that emerges only when the entire system is understood and owned end to end, not something that can be delegated piecemeal to individual parts.

The piece frames this as a lesson about accountability: "Component owners will each correctly say their part works," but a global property needs a person who is liable for the whole, not just the pieces.

## How does Kafka illustrate this problem?

Kafka serves as the article's "cautionary tale" for why localized consistency guarantees fail. Making writes exactly-once took a team of distributed systems engineers years, required several new components, and demanded a complete rewrite of older components, according to the KIP-98 proposal by Gustafson, Junqueira, Mehta, Subramanian, and Wang (2016).

Even after that extensive effort, the engineers who built the system were blunt about its limits: exactly-once processing is described as an end-to-end guarantee, with the application itself bearing responsibility alongside the infrastructure. The article also cites Narkhede and Wang's 2017 Confluent post, "Exactly-Once Semantics Are Possible: Here's How Kafka Does It," as part of the historical record of how this guarantee was built and explained.

## Did the exactly-once guarantee stay fixed once it shipped?

No—the guarantee required further correction years after its initial release. Eight years after shipping, the protocol still had to be redesigned to close correctness holes that could violate exactly-once semantics (EOS), per Olshan and Liu's 2022 proposal, KIP-890: Transactions Server-Side Defense.

This detail reinforces the article's thesis: even a heavily engineered, well-documented guarantee wasn't permanently "solved" by its components. New gaps surfaced over time, requiring renewed end-to-end scrutiny.

## What does the article say should happen instead?

The article's prescription is explicit: "do not hand global, valuable properties to machines and assume they are held." Such guarantees, it argues, are grounded in understanding, not in any single component's internal promise.

Concretely, this means if a component cannot promise a given property, the promise has to live somewhere else—with a person or team that understands the system end to end, since no individual component can confirm the property on its own. Someone has to own it.

## What did readers on Lobsters add to the discussion?

The Lobster discussion (10 votes, 6 comments) generalized and complicated the article's claim. One commenter on Lobsters noted, "You can generalize this to all properties. When you combine two components, the properties of each aren't guaranteed to hold in the combination."

Another commenter added a technical nuance about which consistency definitions actually survive composition: "one of the most common meanings of 'consistency' ... is linearizability, which is preserved under composition (but sequential consistency is not)." This points to a distinction the original article doesn't make—that some formal consistency models do compose safely, while others, like sequential consistency, do not.

## Sources

- https://n-the-loop.com/blog/consistency-is-not-a-localized-property/
- https://lobste.rs/s/rhy5zp/consistency_is_not_localized_property
