# Phase 9: Builder + install smoke tests

## Goal

Validar o pipeline operacional do wrapper:
`wordlist -> builder -> detect`

## Tasks

### T9.1 — Testar bootstrap da wordlist
- `node bin/install.js wordlist`
- gera `modules/unified-wordlist.json`
- gera `modules/rebrand-wordlist.json`

### T9.2 — Testar builder all
- `node bin/builder.js --all`
- valida `dist/{hermes,claude,codex,gemini,copilot}/install.sh`

### T9.3 — Testar builder runtime específico
- `node bin/builder.js --runtime=hermes`
- valida README/install/adapter/agents

### T9.4 — Testar detect
- `node bin/install.js detect`
- lista runtimes disponíveis e suportados

## Verification
- `npm test` green
- wordlist bootstrap covered
- builder all covered
- builder hermes covered
- detect covered
