---
name: hsd-po-inbox
description: "🎯 Product Owner: inbox — Define WHAT gets built — discovery, scope, requirements"
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
    subcommands: ["inbox"]
---

# 🎯 hsd-po-inbox 

**Role:** Product Owner  
**Verb:** inbox  
**Maps from:** 1 upstream commands  
**Description:** Define WHAT gets built — discovery, scope, requirements



---

## Quick Example

```
/hsd-po-inbox
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `inbox` | Triage and review open GitHub issues and PRs against project templates and contribution guidelines. |

---

## Usage
```
/hsd-po-inbox <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
