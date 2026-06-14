---
status: complete
phase: 5
completed: 2026-06-06
---

# Phase 5: Vault 21.06 — formalize D-20 SDK naming

## What was done

Adicionado parágrafo "Convenção no projeto sucessor" em D-20 (21.06-Decisoes-v5)
documentando que:
- Este repo: `horus-sdk-<runtime>` (canônico, mantido)
- Repo sucessor `omni-spec-driven`: `omni-sdk-<runtime>` (convenção própria)
- Não migrar — são projetos separados (D-1.1, D-1.2)

## Key Decisions

| # | Decisão | Razão |
|---|---------|-------|
| D-5.1 | NÃO renomear `horus-sdk-hermes` para `omni-sdk-hermes` | Decisão D-1.2: este repo é legacy estável; outro repo é sucessor |
| D-5.2 | Cross-link `[[omni-spec-driven-rebrand-v5.1]]` no D-20 | Knowledge graph: link explícito entre decisão e log de rebrand |
| D-5.3 | NÃO expandir escopo (mudar tabela de status, etc.) | Scope-faithful: phase é "adicionar nota", não "rewrite D-20" |

## Files Created/Modified

- `~/GitHub/obsidian-vault/ideaverse/20-PROJETOS/21-PROJETOS-ATIVOS/horus-spec-driven/21.06-Decisoes-v5.md` (D-20 extended)
- `.planning/phases/05-vault-21-06-formalize-d-20-sdk-naming/PLAN.md` (new)
- `.planning/phases/05-vault-21-06-formalize-d-20-sdk-naming/SUMMARY.md` (this file)
- `.planning/ROADMAP.md` — Phase 5 checkbox

## Verification

- [x] `21.06-Decisoes-v5.md` D-20 tem parágrafo "Convenção de naming neste repo"
- [x] D-20 tem parágrafo "Convenção no projeto sucessor" com cross-link
- [x] Phase 5 marcada como complete
