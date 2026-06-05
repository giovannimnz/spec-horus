---
name: hsd-qa-review
description: "✅ QA: review — Verify everything — validate, audit, review"
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
    subcommands: ["code-review", "eval-review", "review", "review-backlog", "plan-review-convergence", "ns-review", "secure-phase"]
---

# ✅ hsd-qa-review 

**Role:** QA  
**Verb:** review  
**Maps from:** 7 upstream commands  
**Description:** Verify everything — validate, audit, review



---

## Quick Example

```
/hsd-qa-review code --phase 1
```

---

## Subcommands

| Subcommand | Description |
|---|--|
| `code-review` | Review source files changed during a phase for bugs, security issues, and code quality problems |
| `eval-review` | Audit an executed AI phase's evaluation coverage and produce an EVAL-REVIEW.md remediation plan. |
| `review` | Request cross-AI peer review of phase plans from external AI CLIs |
| `review-backlog` | Review and promote backlog items to active milestone |
| `plan-review-convergence` | Cross-AI plan convergence loop — replan with review feedback until no HIGH concerns remain. |
| `ns-review` | quality gates | code review debug audit security eval ui |
| `secure-phase` | Retroactively verify threat mitigations for a completed phase |

---

## Usage
```
/hsd-qa-review <subcommand> [args]
```

---

## Runtime Notes

<horus_sdk_adapter runtime="hermes">

**horus-sdk-adapter** handles all internal operations.

`node ~/.hermes/skills/hsd/horus-sdk-adapter/index.cjs <verb> [args] --cwd .`

---

*Horus Spec Driven v3.0.0 — English*
