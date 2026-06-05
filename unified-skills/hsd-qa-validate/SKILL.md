---
name: hsd-qa-validate
description: "✅ QA: validate — Verify everything — validate, audit, review"
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
    tags: ["hsd", "qa", "unified", "en"]
    category: "qa"
    subcommands: ["validate-phase", "verify-work", "health", "add-tests", "plan-checker"]
---

# ✅ hsd-qa-validate 

**Role:** QA  
**Verb:** validate  
**Maps from:** 5 upstream commands  
**Description:** Verify everything — validate, audit, review



---

## Quick Example

```
/hsd-qa-validate phase 1
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `validate-phase` | Retroactively audit and fill Nyquist validation gaps for a completed phase |
| `verify-work` | Validate built features through conversational UAT |
| `health` | Diagnose planning directory health and optionally repair issues |
| `add-tests` | Generate tests for a completed phase based on UAT criteria and implementation |
| `plan-checker` | plan-checker |

---

## Usage
```
/hsd-qa-validate <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
