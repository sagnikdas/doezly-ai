---
title: "Deslop: Oxlint Rules That Catch AI-Generated TypeScript Slop"
description: Deslop is a new Oxlint plugin that adds opinionated rules to reject
  low-evidence, AI-slop code patterns in TypeScript, vendoring rules from
  dmmulroy/anti-slop plus new deslop-specific checks; it surfaced on Hacker News
  with 31 points and 7 comments.
pubDatetime: 2026-10-14T14:39:12.480Z
draft: false
featured: false
tags:
  - workflows-and-agents
---
Deslop is a set of opinionated Oxlint rules designed to catch and reject low-evidence, low-signal code patterns commonly produced by AI coding assistants. The project, shared on Hacker News as "Show HN: Deslop – Oxlint rules for AI-generated TypeScript," gathered 31 points and 7 comments. It builds on an existing project, dmmulroy/anti-slop, by vendoring its generic rules and adding new ones under a unified `deslop/*` namespace.

![Flow diagram showing Deslop vendoring rules from anti-slop, adding new checks, and running on Oxlint, with example rule catches and Hacker News reception stats.](/assets/posts/show-hn-deslop-oxlint-rules-for-ai-gener.svg)

## What does Deslop actually do?

Deslop is a collection of linting rules that target specific patterns AI models tend to generate, such as fabricated type assertions and unnecessary complexity. Rather than being a general-purpose linter, it's a focused ruleset meant to run on top of Oxlint, catching the kinds of code smells that creep in when LLMs write TypeScript. Key rules include rejecting nested `as` / angle-bracket assertions that "fabricate evidence," flagging object spreads that use a conditional `{}` branch to omit fields, and rejecting known expressions that flow into explicit `unknown`, `object`, or open dictionaries. It also requires boundary parsing instead of ad hoc `typeof` narrowing, demands an invariant justification for non-const assertions, and disallows using code marked `@deprecated` (this check requires type-aware linting).

## Where do the rules come from?

The generic rules in Deslop are vendored verbatim, including `src/shared/*`, from dmmulroy/anti-slop, which is MIT licensed under copyright Dillon Mulroy. Deslop adds its own additional rules on top of this base and renames everything under the `deslop/*` namespace for consistency. This means Deslop isn't a from-scratch reinvention but rather an extension layered onto an existing, community-recognized foundation — a point several Hacker News commenters raised directly.

## How is Deslop meant to be installed and used?

Deslop ships as compiled JavaScript, meaning it works with any Oxlint JS-plugin runtime — Bun, Deno, or Node.js. It requires `@oxlint/plugins` as a runtime dependency, and the README notes this dependency should be kept in sync with whatever version of Oxlint you're running. Beyond import and type rules, Deslop also includes practical conveniences: it rejects adjacent eager array filter/map passes while allowing lazy iterator pipelines, rejects non-spread accumulator copies inside reducers (recommending you also enable the native `oxc/no-accumulating-spread` rule alongside it), flags adjacent assertions that repeat the same call in test files (with no auto-fixer), and reports all-caps constants that share the same static value across different files. It can also auto-fix unnecessary named-import aliases when the original name has no module-level conflict, and it disallows always truthy/falsy/nullish conditions — another rule that requires type-aware linting.

## What did the Hacker News community think?

The discussion reflected a broader trend of developers building defensive tooling around AI-assisted coding. One commenter on Hacker News described having "an extremely defensive/aggressive lint config and test coverage near ~80%" as essential for AI-assisted feature development on their project, specifically calling out `no-reflect-get` as a rule worth adopting because "claude LOVES `Reflect.get` for some reason." Another commenter directly asked the key comparative question: "I agree [https://github.com/dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop) is very cool... But what does this add beyond that?" — highlighting that Deslop's main value-add, per the source material, is its additional rules and consolidated namespace layered on anti-slop's base. Other commenters mentioned pairing tools like this with ast-grep rules and referenced CodeRabbit's ast-grep-essentials repo as inspiration for similar defensive linting setups, while another drew a comparison to the long-standing eslint-plugin-unicorn project.

## Sources

- [https://github.com/maharshi365/deslop](https://github.com/maharshi365/deslop)
- [https://news.ycombinator.com/item?id=50075809](https://news.ycombinator.com/item?id=50075809)

