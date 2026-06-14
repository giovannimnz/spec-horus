---
status: complete
phase: 11
completed: 2026-06-06
---

# Phase 11: Expansion guide for new CLI runtimes — Summary

## What was built

Criei `docs/ADDING-NEW-RUNTIMES.md`, que formaliza o processo de estudar,
validar e adicionar um novo runtime ao `horus-spec-driven`.

O guide captura os aprendizados reais das phases 8-10, não teoria genérica.

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| D-11.1 | Guide separado, não só bloco em README | Conteúdo é técnico demais e evolui por milestone |
| D-11.2 | Incluir gates objetivos antes do checklist | Evita suportar runtime ruim só por hype |
| D-11.3 | Listar candidatos sem prometer suporte | Pesquisa ≠ commitment |
| D-11.4 | Registrar pitfalls reais das phases 8-10 | Conhecimento novo tem que virar regra reutilizável |

## Files Created/Modified

- `docs/ADDING-NEW-RUNTIMES.md`
- `.planning/phases/11-expansion-guide-for-new-cli-runtimes/11-PLAN.md`
- `.planning/phases/11-expansion-guide-for-new-cli-runtimes/11-SUMMARY.md`

## Verification

- [x] Guide existe
- [x] Gates de suporte explícitos
- [x] Checklist técnico de implementação explícito
- [x] Checklist de validação explícito
- [x] Pitfalls reais registrados
- [x] Candidatos futuros listados com trade-offs
