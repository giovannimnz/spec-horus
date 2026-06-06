# Phase 4: Test `osd-pi-bridge` with real gsd-pi install

## Goal

Tentar instalar `@opengsd/gsd-pi` e fazer smoke test do `osd-pi-bridge` que
detecta e delega para `gsd`. Se install completo falhar (rede/timeout/deps),
documentar o resultado e marcar status.

## Investigation

**Tentativa 1:** `npx -y @opengsd/gsd-pi --help` — timeout 30s, sem output.
Provavelmente dependências grandes baixando.

**Investigação npm registry:**
- Pacote: `@opengsd/gsd-pi@1.1.1` (MIT)
- Tamanho: 185.3 MB descompactado, 49 deps
- Binários: `gsd`, `gsd-pi`, `gsd-cli`
- Repo: https://github.com/open-gsd/gsd-pi
- Deps notáveis: `playwright`, `discord.js`, `openai` (são pesados)

**Decisão:** Install completo não é viável inline (timeout, 185MB download,
playwright baixa browsers adicionais ~200MB). Documentar status e seguir.

## Tasks

### T4.1 — Documentar tentativa de install

- Criar `60-LOGS/2026-06-06-osd-pi-bridge-test.md` com:
  - Comando tentado
  - Resultado (timeout)
  - Por que não completou
  - Workaround: install em worktree dedicado com mais tempo
  - Status: NOT VERIFIED (bridge funciona em teoria, não testado em runtime)

**Files:** `~/GitHub/obsidian-vault/ideaverse/60-LOGS/2026-06-06-osd-pi-bridge-test.md`

### T4.2 — Marcar Phase 4 como completed (com caveat)

- Status: COMPLETE (do scope: testar ou documentar limitação)
- Caveat no SUMMARY: bridge NÃO foi executado em runtime real

## Out of scope

- Install completo de `@opengsd/gsd-pi` (185MB + 200MB playwright browsers)
- Testar todos os subcomandos do bridge
- Validar fallback chain runtime

## Verification

- [x] Log de teste criado em `60-LOGS/`
- [x] Status documentado: NOT VERIFIED runtime
- [x] Workaround proposto pra próxima sessão
- [x] Phase 4 marcada como complete (scope-faithful)

## Decision rationale

Phase 4 spec: "Tentar `npm install -g @opengsd/gsd-pi` (ou `npx gsd-pi`).
Documentar resultado do teste (sucesso, fallback, erro). Se funcionar: smoke
test do bridge."

Tentativa foi feita (npx timeout). Erro documentado. Smoke test não é viável
inline. Marcar como complete com caveat é mais útil do que ficar preso em retry
loop infinito.
