---
name: hsd-pm-plan
description: "📋 Project Manager: plan — Manage HOW it gets built — plan, execute, track, ship"
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
    tags: ["hsd", "pm", "unified", "en"]
    category: "pm"
    subcommands: ["plan-phase", "ultraplan-phase", "ai-integration-phase", "planner"]
---

# 📋 hsd-pm-plan 

**Role:** Project Manager  
**Verb:** plan  
**Maps from:** 4 upstream commands  
**Description:** Manage HOW it gets built — plan, execute, track, ship



---

## Quick Example

```
/hsd-pm-plan phase 1
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `plan-phase` | Create detailed phase plan (PLAN.md) with verification loop |
| `ultraplan-phase` | [BETA] Offload plan phase to Claude Code's ultraplan cloud; review in browser and import back. |
| `ai-integration-phase` | Generate an AI-SPEC.md design contract for phases that involve building AI systems. |
| `planner` | planner |

---

## Usage
```
/hsd-pm-plan <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
