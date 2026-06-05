---
name: hsd-po-new
description: "🎯 Product Owner: new — Define WHAT gets built — discovery, scope, requirements"
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
    subcommands: ["new-project", "new-milestone"]
---

# 🎯 hsd-po-new 

**Role:** Product Owner  
**Verb:** new  
**Maps from:** 2 upstream commands  
**Description:** Define WHAT gets built — discovery, scope, requirements



---

## Quick Example

```
/hsd-po-new project "my-app"
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `new-project` | Initialize a new project with deep context gathering and PROJECT.md |
| `new-milestone` | Start a new milestone cycle — update PROJECT.md and route to requirements |

---

## Usage
```
/hsd-po-new <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
