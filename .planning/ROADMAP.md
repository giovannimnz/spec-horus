# Roadmap

## Milestone v5.2.0 — Test Coverage & Runtime Validation

**Goal:** Provar que o `horus-spec-driven` gera artefatos corretos, instaláveis e verificáveis para os 5 CLIs suportados, e formalizar o caminho para estudar/expandir para novos runtimes.

### ⚡ EXECUTION ORDER (2026-06-06)

🔴 7. **Phase 7 — Test harness + fixtures** ← FIRST (reason: todas as outras fases dependem de fixtures e comandos reproduzíveis)
🟡 8. **Phase 8 — Hermes SDK smoke tests** ← DEPENDS on #7 (mesma base de fixtures e `.planning/` fake)
🟡 9. **Phase 9 — Builder + install smoke tests** ← DEPENDS on #7 (mesma fixture de repo e paths)
🟡 10. **Phase 10 — Runtime validation matrix (Hermes/Claude/Codex/Gemini/Copilot)** ← DEPENDS on #9 (precisa dos artefatos gerados e install scripts validados)
🟢 11. **Phase 11 — Expansion guide for new CLI runtimes** ← LAST (precisa dos aprendizados reais das fases 8-10)

**Porquê esta ordem:** Phase 7 cria a base de teste. Phases 8 e 9 usam a mesma infraestrutura e geram evidência real. Phase 10 consolida os resultados por runtime. Phase 11 só faz sentido depois que o comportamento atual estiver observado e documentado.

## Phase Details

### [x] **Phase 7: Test harness + fixtures** — ✅ COMPLETE (2026-06-06)

**Goal:** Criar fixtures mínimas e scripts base para testar builder/install/SDK sem depender do repo real.

Requirements: TEST-01
Success criteria:
1. Existe fixture repo mínima em `.planning/fixtures/` ou `tests/fixtures/`
2. Build e SDK conseguem rodar contra fixture sem quebrar paths
3. Docs explicam como executar a fixture localmente

### [x] **Phase 8: Hermes SDK smoke tests** — ✅ COMPLETE (2026-06-06)

**Goal:** Cobrir os verbos críticos do `horus-sdk-hermes` e seus modos de erro.

Requirements: SDK-01, SDK-02
Success criteria:
1. `state`, `config-get`, `roadmap`, `validate`, `graphify` têm smoke tests automatizados
2. `frontmatter.get` e `frontmatter.validate` têm smoke tests explícitos
3. Saídas erradas têm mensagens úteis e previsíveis

### [x] **Phase 9: Builder + install smoke tests** — ✅ COMPLETE (2026-06-06)

**Goal:** Validar `bin/builder.js` e `bin/install.js` com smoke tests automatizados.

Requirements: TEST-02, TEST-03
Success criteria:
1. `npm run build` valida geração de `dist/` para 5 runtimes
2. `install.js detect` retorna runtimes suportados corretamente
3. Tests cobrem runtime path resolution e install target shape

### [x] **Phase 10: Runtime validation matrix** — ✅ COMPLETE (2026-06-06)

**Goal:** Validar os 5 pacotes gerados por runtime e consolidar uma matrix de status.

Requirements: RT-01, RT-02, RT-03, RT-04
Success criteria:
1. Hermes e Claude têm install smoke end-to-end documentado
2. Codex/Gemini/Copilot têm filenames/layout smoke documentado
3. Existe matrix markdown com install / detect / smoke / caveats por runtime

### [x] **Phase 11: Expansion guide for new CLI runtimes** — ✅ COMPLETE (2026-06-06)

**Goal:** Formalizar como estudar e adicionar novos CLIs ao wrapper.

Requirements: EXP-01, EXP-02
Success criteria:
1. Existe doc com checklist para novo runtime
2. Critérios de suporte estão explícitos (converter, frontmatter, install, smoke)
3. Próximos candidatos de runtime estão listados com trade-offs

### Phase 7: Test harness + fixtures

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 6
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 7 to break down)

### Phase 8: Hermes SDK smoke tests

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 7
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 8 to break down)

### Phase 9: Builder + install smoke tests

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 8
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 9 to break down)

### Phase 10: Runtime validation matrix

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 9
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 10 to break down)

### Phase 11: Expansion guide for new CLI runtimes

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 10
**Plans:** 0 plans

Plans:

- [ ] TBD (run /gsd-plan-phase 11 to break down)


### [x] **Phase 12: horus-sdk-codex** — ✅ COMPLETE (2026-06-13)

**Goal:** Criar SDK HSD específico para Codex, emitido no `dist/codex/adapter/` e instalado em `~/.codex/skills/horus-sdk-codex/`.

Requirements: SDK-CODEX-01, SDK-CODEX-02, SDK-CODEX-03
Success criteria:
1. `bin/lib/horus-sdk-codex/` existe e roda verbos críticos contra fixture.
2. `node bin/builder.js --runtime=codex` emite `dist/codex/adapter/index.cjs`.
3. `dist/codex/install.sh` é self-contained e instala prompts, agents e SDK em `CODEX_HOME` temporário.
4. `npm test` e `npm run build` passam.
