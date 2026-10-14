---
title: "Tracking AI Leaders' Statements Over Time: A Video-Based Claim-Diffing Tool"
description: "A new open-source tool ingests podcast and interview transcripts from AI leaders (Altman, Hassabis, Amodei, LeCun), extracts discrete claims via LLM, and diffs them chronologically to surface position changes—built on yt-dlp, Whisper, and embedding-based similarity search."
pubDatetime: 2026-10-14T04:42:06.235Z
draft: true
tags:
  - workflows-and-agents
---
A new tool automatically tracks what AI leaders say in video interviews and podcasts, then diffs their statements over time to flag when stated positions shift—turning scattered public commentary into a structured, searchable timeline.

![A four-stage pipeline diagram showing how the tool ingests, transcribes, extracts, and diffs claims from AI leaders, feeding into three possible diff outcomes.](/assets/posts/i-built-a-tool-to-track-what-ai-leaders-.svg)

## The Problem It Solves

AI leaders (Sam Altman, Demis Hassabis, Dario Amodei, Yann LeCun, and others) make dozens of public statements per month across podcasts, conference keynotes, and interviews. Tracking how their stated positions on timelines, risk, or capabilities evolve has historically required manual note-taking or ad-hoc Twitter threads. This tool automates that process end-to-end.

## How It Works

The pipeline has four stages: ingestion, transcription, claim extraction, and diffing.

```bash
# 1. Ingest new video sources (channels, playlists, RSS feeds)
yt-dlp --dateafter now-7days -o "%(id)s.%(ext)s" "<channel_url>"

# 2. Transcribe with speaker diarization
whisper audio.wav --model large-v3 --diarize --output_format json

# 3. Extract atomic claims via LLM (structured output)
python extract_claims.py \
  --speaker "Sam Altman" \
  --input transcript.json \
  --schema claim_schema.json

# 4. Embed and diff against historical claim store
python diff_claims.py \
  --new claims_2026_10.json \
  --baseline claims_store.db \
  --threshold 0.82
```

Claims are stored as structured objects (`speaker`, `topic`, `statement`, `date`, `source_url`, `confidence`) rather than raw transcript snippets. A vector similarity threshold (cosine similarity ~0.82) flags semantically related statements on the same topic made at different times, which a secondary LLM pass then labels as "consistent," "refined," or "contradicted."

## Comparison: Manual Tracking vs. This Tool vs. Generic Search

| Capability | Manual Notes / Twitter Threads | Generic Transcript Search | This Tool |
|---|---|---|---|
| Source coverage | Whatever you happen to watch | Keyword search only | Automated multi-channel ingestion |
| Historical comparison | Relies on memory | None | Vector-diffed claim history |
| Attribution granularity | Loose, paraphrased | Full transcript dump | Atomic, structured claims |
| Change detection | Manual, inconsistent | Not supported | Automated contradiction flags |
| Output format | Blog posts, threads | Raw text | Queryable timeline + API |

## What This Enables

- **Topic timelines**: Query "AGI timeline predictions" across speakers and get a chronological list of dated claims with direct video timestamps.
- **Contradiction surfacing**: The diff step highlights when a leader's current statement conflicts with a prior one on the same topic, reducing reliance on memory or cherry-picked quotes.
- **Source-grounded citations**: Every extracted claim links back to the exact video and timestamp, avoiding paraphrase drift common in secondhand summaries.

## Limitations

Claim extraction quality depends on transcript accuracy and LLM judgment calls on what counts as a "claim" versus rhetorical framing. Diarization errors in multi-speaker podcasts can misattribute statements. The 0.82 similarity threshold is tunable but still produces false positives on topics discussed with varying vocabulary across years.

## Bottom Line

This tool converts unstructured public commentary from AI leaders into a structured, diffable dataset—making it possible to query stance changes programmatically instead of relying on manual recall or scattered social media threads.
