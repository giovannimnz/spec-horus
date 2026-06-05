# gsd-caveman-hermes

**Spec-driven development + Compressed communication.**

Inspirado e combinado de dois projetos excepcionais:

- **[gsd-core)](https://github.com/open-gsd/gsd-core)** by open-gsd — Meta-prompting e spec-driven development
- **[caveman](https://github.com/JuliusBrussee/caveman)** by JuliusBrussee — Compressão de comunicação (~75% tokens)

## O que é?

Este projeto **combina** o melhor dos dois mundos:

| Aspecto | get-shit-done | caveman | gsd-caveman-hermes |
|---------|---------------|---------|-------------------|
| **Foco** | Process | Communication | Both |
| **Método** | Fases + Specs | Terseness | Fases + Specs + Terseness |
| **Tokens** | Normal | ~75% less | ~75% less |
| **Skills** | 83+ commands | 5 modes | 25+ commands |
| **Agentes** | Claude Code | Multi-agent | Hermes-native |

## Como funciona?

### GSD Hermes — Spec-Driven Development

GSD organiza o trabalho em **fases** comspecs detalhadas:

```
Projeto
 └── Phase 1: Foundation
      ├── Plan 1: Setup
      ├── Plan 2: Core feature
      └── Plan 3: Tests
 └── Phase 2: Features
      └── ...
```

Cada fase: **Plan → Build → Verify → Document**

### Caveman — Compressed Communication

Caveman corta o "fluff" da comunicação mantendo 100% da precisão técnica:

> "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle."

 ↓ Caveman ↓

> "New obj ref each render. Inline obj prop = new ref = re-render. `useMemo`."

**Mesmo resultado. 75% menos tokens. Precisão mantida.**

## Quick Start

```bash
# Install
npm install gsd-caveman-hermes
```

```bash
# GSD - Spec-driven development
/gsd-new-project           # Iniciar projeto
/gsd-plan-phase 1          # Planejar fase 1
/gsd-execute-phase 1      # Executar fase 1
/gsd-debug <bug>          # Debug sistemático

# Caveman - Comunicação compressa
/caveman                   # Ativar modo full (~75% tokens)
/caveman ultra            # Modo ultra (máxima compressão)
/caveman lite             # Modo lite (mínima compressão)
/caveman-commit           # Commit messages terse
/caveman-review           # Code review em 1 linha
```

## Installation Automática

```bash
npm install gsd-caveman-hermes
```

O script `postinstall` executa automaticamente e configura tudo.

**Ou manual:**

```bash
git clone https://github.com/giovannimnz/gsd-caveman-hermes.git ~/gsd-caveman-hermes
cd ~/gsd-caveman-hermes
npm install
```

## Estrutura

```
gsd-caveman-hermes/
├── skills/
│   ├── gsd/                    # Entry point GSD
│   ├── gsd-do/                # Dispatcher inteligente
│   ├── gsd-new-project/       # Inicialização
│   ├── gsd-plan-phase/        # Planejamento
│   ├── gsd-execute-phase/     # Execução
│   ├── gsd-debug/             # Debug
│   ├── gsd-spike/             # Experimentos
│   ├── gsd-sketch/            # Mockups
│   └── ... (mais 17)
│   ├── caveman/               # Modo caveman principal
│   ├── caveman-commit/        # Commit messages
│   ├── caveman-review/        # Code review
│   ├── caveman-help/          # Help card
│   └── compress/              # Ferramenta de compressão
├── agents/                     # 5 agentes especializados
├── workflows/                  # Workflows GSD
├── templates/                  # Templates de projeto
└── bin/install.js             # Instalador automático
```

## Níveis de Caveman

| Modo | Compressão | Exemplo |
|------|------------|---------|
| **lite** | ~40% | "Your component re-renders because you create a new object reference each render." |
| **full** | ~65% | "New object ref each render. Inline object prop = new ref = re-render." |
| **ultra** | ~75% | "Inline obj prop → new ref → re-render. `useMemo`." |
| **wenyan-lite** | ~50% | "組件頻重繪，以每繪新生對象參照故。" |
| **wenyan-full** | ~70% | "物出新參照，致重繪。useMemo Wrap之。" |
| **wenyan-ultra** | ~80% | "新參照→重繪。useMemo Wrap。" |

## Créditos e Licenças

Este projeto **não é** afiliado oficialmente com get-shit-done ou caveman.

- **[get-shit-done](https://github.com/gsd-build/get-shit-done)** por [TÂCHES](https://github.com/gsd-build) — License: MIT
- **[caveman](https://github.com/JuliusBrussee/caveman)** por [JuliusBrussee](https://github.com/JuliusBrussee) — License: MIT

Este projeto combina e adapta ambos para o Hermes Agent, mantendo a compatibilidade com seus respectivos formatos e filosofias.

## License

MIT — Same as source projects.
