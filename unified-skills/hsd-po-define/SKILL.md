---
name: hsd-po-define
description: "🎯 Product Owner: define — Define WHAT gets built — discovery, scope, requirements"
version: "3.0.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "en"
platforms:
  - hermes
  - claude-code
  - codex
  - gemini
  - copilot
metadata:
  hermes:
    tags: ["hsd", "po", "unified", "en"]
    category: "po"
    subcommands: ["discuss-phase", "spec-phase", "mvp-phase"]
---

# 🎯 hsd-po-define 

**Role:** Product Owner  
**Verb:** define  
**Maps from:** 3 upstream commands  
**Description:** Define WHAT gets built — discovery, scope, requirements



---

## Quick Example

```
/hsd-po-define discuss --phase 1
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `discuss-phase` | Gather phase context through adaptive questioning before planning. |
| `spec-phase` | Clarify WHAT a phase delivers with ambiguity scoring; produces a SPEC.md before discuss-phase. |
| `mvp-phase` | Plan a phase as a vertical MVP slice — user story, SPIDR splitting, then plan-phase |

---

## Usage
```
/hsd-po-define <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
