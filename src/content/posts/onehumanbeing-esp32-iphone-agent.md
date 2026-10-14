---
title: ESP32 iPhone Agent Lets AI Models Control a Real iPhone for $7
description: An open-source project called esp32-iphone-agent uses a $7 ESP32-S3
  board and AirPlay mirroring to let any OpenAI-compatible vision model operate
  a real iPhone — no Mac, no developer account, no jailbreak required. It has
  1,862 GitHub stars.
pubDatetime: 2026-10-14T10:06:00.687Z
draft: false
featured: true
tags:
  - workflows-and-agents
---
A new open-source project called ESP32 iPhone Agent lets an AI vision model physically control a real iPhone using a $7 ESP32-S3 board, with no Mac, no Apple developer account, and no jailbreak needed. The project, from GitHub user onehumanbeing, has drawn 1,862 stars on GitHub.

![ESP32 iPhone Agent Lets AI Models Control a Real iPhone for $7](/assets/posts/onehumanbeing-esp32-iphone-agent.svg)

## What does the ESP32 iPhone Agent do?

The project gives an AI model "eyes and hands" on a real iPhone: it sees the screen via AirPlay mirroring and acts on it through a USB HID bridge built from a cheap ESP32-S3 board. In the README's examples, the agent opens the Whiteboard app and draws a smiley face with continuous strokes, and sets a 7:00 AM daily alarm in the Clock app by typing into the time wheel and tapping repeat days. Any OpenAI-compatible vision model can serve as the "brain," including a cloud API or a self-hosted model.

## How does it work technically?

The system is built from three parts: eyes, hands, and a brain. The phone mirrors its screen to UxPlay running on a computer, which a GStreamer pipeline converts into JPEG frames; an ESP32-S3 plugged into the phone's USB port acts as a standard USB mouse and keyboard, moving an on-screen pointer via iOS AssistiveTouch so clicks become taps and drags become swipes. A planner model drafts a short plan from the goal and current screen, then an actor model examines each new screenshot to choose the next action — tap, swipe, draw a path, type, press a key, go home, or finish — and both roles can be the same model.

## Why not just use XCTest or WebDriverAgent?

Most existing iPhone automation tools rely on XCTest/WebDriverAgent, which require a Mac, Xcode, a signed helper app, and an Apple developer account — and a free account's signature expires every 7 days. ESP32 iPhone Agent avoids all of that by using the same screen-and-pointer interface a human uses, so nothing needs to be installed on the phone. The README's comparison table lays out the difference clearly:


|  | ESP32 iPhone Agent | XCTest / WebDriverAgent tools |
| ----------------------------- | ---------------------- | -------------------------------------- |
| Apple developer account | Not needed | Needed (to sign the runner) |
| Xcode | Not needed | Needed |
| Computer | Mac or Linux | Mac |
| App installed on phone | None | Test runner app |
| Jailbreak | Not needed | Not needed |
| Extra hardware | ESP32-S3 board (~$7) | USB cable |
| Works in any app, incl. games | Yes (only sees pixels) | Mostly (depends on accessibility tree) |


## How does the agent stay accurate and recover from mistakes?

Because the ESP32's pointer is relative rather than absolute, the server tracks its position and wiggles it before each tap to locate it on the mirrored screen, correcting any miss and refining calibration continuously. After every action the system checks whether the screen actually changed and reports that back to the model, so a missed tap is retried rather than built upon. Repeated or stuck actions trigger a re-plan, and the system is designed to recover from a dropped connection or a bad model reply.

## What hardware is needed to set it up?

The core hardware is a Seeed Studio XIAO ESP32S3 board (plain version, not the Sense camera or Plus variants), costing about $7 from Seeed or roughly ¥40-50 on Taobao. USB-C iPhones plug in directly, while Lightning models need a Lightning to USB Camera Adapter; the phone itself powers the board. A Mac or Linux computer on the same network runs UxPlay and the server, and a USB-C hub with power pass-through is recommended if the phone needs to keep charging during use.

## Sources

- [onehumanbeing/esp32-iphone-agent on GitHub](https://github.com/onehumanbeing/esp32-iphone-agent)

