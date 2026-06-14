---
status: complete
phase: 9
completed: 2026-06-06
---

# Phase 9: Builder + install smoke tests — Summary

## What was built

Adicionei smoke tests para o pipeline operacional do wrapper e corrigi um bug
real: `install.js wordlist` não persistia `modules/unified-wordlist.json` nem
`modules/rebrand-wordlist.json`, o que quebrava `builder.js` em execução isolada.

Com o fix, a sequência `wordlist -> builder -> detect` agora é testada e verde.

## Key Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| D-9.1 | Corrigir `install.js wordlist` no mesmo milestone | Não fazia sentido testar um fluxo sabidamente quebrado sem corrigir o contrato |
| D-9.2 | Testar `builder --all` e `builder --runtime=hermes` | Cobre o caminho completo e o caminho específico por runtime |
| D-9.3 | `detect` como smoke textual, não parser rígido | Output é UX de CLI; o importante é listar runtimes suportados |
| D-9.4 | Reusar suite completa (`npm test`) | Garante que o fix da wordlist não regressa a Phase 7/8 |

## Files Created/Modified

- `bin/install.js`
- `tests/builder-install.test.js`
- `modules/unified-wordlist.json`
- `modules/rebrand-wordlist.json`
- `.planning/phases/09-builder-install-smoke-tests/09-PLAN.md`
- `.planning/phases/09-builder-install-smoke-tests/09-SUMMARY.md`

## Verification

- [x] `npm test` green
- [x] 15 tests passed
- [x] `install.js wordlist` now writes both wordlist files
- [x] `builder.js --all` succeeds after wordlist bootstrap
- [x] `builder.js --runtime=hermes` succeeds
- [x] `install.js detect` lists runtimes on this host
