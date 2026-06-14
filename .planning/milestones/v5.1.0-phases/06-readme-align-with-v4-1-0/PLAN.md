# Phase 6: README — align with v4.1.0 (badge, build script)

## Goal

Alinhar seção "Instalação" do README com v4.1.0:
- Adicionar `npm run build` (alternativa amigável a `node bin/builder.js --all`)
- Adicionar `npm run install` (alternativa ao install manual)
- Remover comando `node bin/install.js language en` (não existe — `install.js` não tem subcommand `language`)
- Remover "# Sync diário" duplicado

## Investigation

**Estado anterior do README:**
- Linha 220-221: `node bin/builder.js --all` (correto, mas sem alternativa npm)
- Linha 230: `node bin/install.js language en` ❌ — binário não tem subcommand `language` direto
- Linhas 228 + 232-233: "# Sync diário" duplicado

**Estado desejado:**
- `npm run build` (scripts já adicionados em Phase anterior, no package.json 4.1.0)
- `npm run install` (já existia)
- Sync único e claro

## Tasks

### T6.1 — Reescrever seção "Instalação" do README.md

- Adicionar `npm run build` como quick start (com fallback `node bin/builder.js --all`)
- Adicionar `npm run build:<runtime>` (5 runtimes)
- Adicionar `npm run install` como alternativa ao install manual
- Remover `node bin/install.js language en`
- Remover "# Sync diário" duplicado

**Files:** `README.md`
**Verify:** `grep -c "npm run build" README.md` >= 1, `grep -c "language en" README.md` = 0

### T6.2 — Marcar Phase 6 como completed

- ROADMAP.md: `[ ]` → `[x]`
- STATE.md: Phase 6 na tabela como complete

## Out of scope

- Reescrever outras seções do README
- Adicionar mais comandos npm (já temos o necessário)
- Mudar badge de versão (já diz 4.1.0)

## Verification

- [x] `npm run build` mencionado no quick start
- [x] `node bin/install.js language en` removido
- [x] "# Sync diário" aparece exatamente 1 vez
- [x] Phase 6 marcada como complete
