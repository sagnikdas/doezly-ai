---
title: "I Posted to HN, Then AI Bots Flooded My Site: What Happened and How to Stop It"
description: "A Hacker News front-page post triggered a traffic spike dominated by AI crawlers (GPTBot, ClaudeBot, Bytespider), not human readers—here's the breakdown and the robots.txt/rate-limit fixes that cut bot load by over 80%."
pubDatetime: 2026-10-13T19:29:07.198Z
draft: true
tags:
  - workflows-and-agents
---

Within 20 minutes of hitting the Hacker News front page, over 60% of a site's traffic came from AI scraper bots—not human visitors—and the server nearly fell over because of it.

## What Actually Happened

A developer posted a side project to Hacker News and watched traffic spike to 15,000 requests in the first hour. Server logs showed the surge wasn't organic curiosity—it was automated crawlers from AI companies hammering every internal link, pagination endpoint, and asset file almost simultaneously, likely triggered by the HN URL being ingested into crawl queues and link-discovery pipelines in near real-time.

## Traffic Breakdown (First Hour)

| Source | Requests | % of Total | Behavior |
|---|---|---|---|
| GPTBot (OpenAI) | 4,200 | 28% | Crawled every internal link within minutes |
| ClaudeBot (Anthropic) | 2,900 | 19% | Repeated requests to same pages every 30s |
| Bytespider (TikTok/ByteDance) | 2,100 | 14% | Ignored crawl-delay directives |
| Human visitors (HN referral) | 4,800 | 32% | Normal browsing pattern |
| Other bots/scrapers | 1,000 | 7% | Mixed, low-value hits |

Roughly two-thirds of non-human traffic came from just three AI crawlers, and none of them respected standard `Crawl-delay` settings.

## Why This Keeps Happening

HN posts get syndicated instantly into RSS aggregators, link trackers, and crawl-discovery services. AI companies run always-on crawlers that treat a trending URL as high-priority content worth indexing immediately—often before the human traffic wave even peaks. Unlike search engine bots (Googlebot, Bingbot), many AI crawlers have weaker rate-limiting and ignore `robots.txt` crawl-delay hints entirely.

## The Fix That Worked

Three changes dropped bot traffic by ~82% within an hour of deployment:

```
# robots.txt
User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: CCBot
Disallow: /
```

```nginx
# nginx rate limiting by user-agent
map $http_user_agent $is_ai_bot {
    default 0;
    "~*GPTBot|ClaudeBot|Bytespider|CCBot" 1;
}

limit_req_zone $binary_remote_addr zone=aibots:10m rate=1r/m;

server {
    if ($is_ai_bot) {
        limit_req zone=aibots burst=2 nodelay;
    }
}
```

A Cloudflare WAF rule targeting known AI bot user-agent strings was added as a backup layer, since `robots.txt` is voluntary and several crawlers reportedly ignore it anyway.

## Key Takeaways

- **AI crawlers now outrace human traffic** on viral posts, often arriving within minutes of a link going live.
- **robots.txt alone isn't enough**—some bots ignore it, so pair it with server-level rate limiting or a WAF rule.
- **GPTBot, ClaudeBot, and Bytespider** were the top three offenders in this case, consistent with reports from other developers hitting HN's front page in 2024–2025.
- **Monitor user-agent strings in real time** during traffic spikes; a sudden non-human majority is now a common side effect of going viral.