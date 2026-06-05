---
name: hsd-qa-audit
description: "✅ QA: audit — Verify everything — validate, audit, review"
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
    subcommands: ["audit-fix", "audit-milestone", "audit-uat", "auditor"]
---

# ✅ hsd-qa-audit 

**Role:** QA  
**Verb:** audit  
**Maps from:** 4 upstream commands  
**Description:** Verify everything — validate, audit, review



---

## Quick Example

```
/hsd-qa-audit milestone M001
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `audit-fix` | Autonomous audit-to-fix pipeline — find issues, classify, fix, test, commit |
| `audit-milestone` | Audit milestone completion against original intent before archiving |
| `audit-uat` | Cross-phase audit of all outstanding UAT and verification items |
| `auditor` | auditor |

---

## Usage
```
/hsd-qa-audit <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
