---
name: hsd-po-discover
description: "🎯 Product Owner: discover — Define WHAT gets built — discovery, scope, requirements"
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
    subcommands: ["explore", "spike", "sketch", "capture", "ns-ideate", "map-codebase", "researcher", "phase-researcher", "pattern-mapper"]
---

# 🎯 hsd-po-discover 

**Role:** Product Owner  
**Verb:** discover  
**Maps from:** 9 upstream commands  
**Description:** Define WHAT gets built — discovery, scope, requirements



---

## Quick Example

```
/hsd-po-discover explore "auth system"
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `explore` | Socratic ideation and idea routing — think through ideas before committing to plans |
| `spike` | Spike an idea through experiential exploration, or propose what to spike next (frontier mode) |
| `sketch` | Sketch UI/design ideas with throwaway HTML mockups, or propose what to sketch next (frontier mode) |
| `capture` | Capture ideas, tasks, notes, and seeds to their destination |
| `ns-ideate` | exploration capture | explore sketch spike spec capture |
| `map-codebase` | Analyze codebase with parallel mapper agents to produce .planning/codebase/ documents |
| `researcher` | researcher |
| `phase-researcher` | phase-researcher |
| `pattern-mapper` | pattern-mapper |

---

## Usage
```
/hsd-po-discover <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
