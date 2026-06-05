# Architecture — Spec-Horus

Design do wrapper, do rebrand, e do pipeline de install/sync.

## Visão geral

```
┌──────────────────────────────────────────────────────────────────────┐
│  horus-spec-driven  (este repo, MIT)                                        │
│                                                                      │
│  bin/install.js ──┐                                                  │
│  bin/sync.js ─────┤                                                  │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 1: Pull                                             │      │
│  │    git clone --depth 1 open-gsd/gsd-core -> modules/gsd-core │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 2: Stage                                            │      │
│  │    copy modules/gsd-core/{commands,agents,skills,workflows,  │      │
│  │          templates,references} -> modules/staging/          │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 3: Rebrand                                          │      │
│  │    scan modules/gsd-core/commands/gsd/*.md -> wordlist      │      │
│  │    categorize (qa/params/dev) by substring                 │      │
│  │    rename files gsd-X.md -> shd-X.md | shq-X.md | shp-X.md │      │
│  │    rewrite body /gsd-X/ -> /sh{X}-X/                       │      │
│  └────────────────────────────────────────────────────────────┘      │
│                   ▼                                                  │
│  ┌────────────────────────────────────────────────────────────┐      │
│  │  Stage 4: Install per runtime                              │      │
│  │    for each enabled runtime in horus-spec-driven.json:            │      │
│  │      resolve paths via runtimes/<id>.json                  │      │
│  │      copy rebadged files to:                               │      │
│  │        hermes:  ~/.hermes/skills/, ~/.hermes/agents/       │      │
│  │        claude:  ~/.claude/{skills,agents,commands}/        │      │
│  │        codex:   ~/.codex/{agents,prompts}/                 │      │
│  │        gemini:  ~/.gemini/{skills,commands}/               │      │
│  │        copilot: ./.github/{agents,prompts}/                │      │
│  └────────────────────────────────────────────────────────────┘      │
│                                                                      │
│  bin/rebrand.js ─ engine de rebrand (puro)                          │
│  bin/lib/runtime-paths.js — registry de paths por CLI               │
│  bin/lib/cli-detect.js — detecção automática                        │
│  horus-spec-driven.json — config do usuário (runtimes, prefixos, version)  │
└──────────────────────────────────────────────────────────────────────┘
```

## Wrapper, não fork

Decisão consciente. Razões:

1. **Compatibilidade automática** com upstream. Quando `open-gsd/gsd-core`
   lança v1.4, `horus-spec-driven sync` pega na hora. Sem PR, sem merge, sem
   resolver conflitos de versionamento.
2. **Zero duplicação de código**. Todos os 86+ comandos vivem no
   upstream; só mantemos o wrapper.
3. **Vendor local = offline-capable**. Após primeiro `sync`,
   `modules/gsd-core/` é cache local; sync subsequente só precisa de
   `git fetch` + `git reset --hard origin/main`.
4. **Auditoria trivial**. `diff -ru modules/gsd-core modules/staging`
   mostra exatamente o que o rebrand mudou.

Tradeoff: dependemos do upstream não quebrar o layout
(`commands/gsd/*.md`, `agents/gsd-*.md`, `skills/gsd-*/SKILL.md`). Se
mudarem, o wrapper quebra e precisa de patch. Mitigação: `version` pin
em `horus-spec-driven.json`.

## Rebrand engine

Ver [`REBRAND.md`](REBRAND.md) para detalhes completos.

Resumo:

- **Wordlist-based**, não regex cego. Lê os 86+ arquivos em
  `modules/gsd-core/commands/gsd/` e constrói mapa `gsd-X → shd|shq|shp-X`.
- **Categorização por substring** (em ordem de prioridade):
  1. `qa` (validate, verify, audit, review, eval, secure, check)
  2. `params` (config, settings, params, profile-user)
  3. `dev` (resto)
- **Determinístico**: rodar 2x produz mesmo output. Idempotente.
- **Body-aware**: reescreve tanto filenames quanto conteúdo (frontmatter
  + body markdown) com `\b` word boundaries pra evitar matches parciais.

## Runtime detection

`bin/lib/cli-detect.js` decide qual runtime está ativo. Três sinais:

1. **Flag explícita**: `--runtime=<id>` ou env `SPEC_HORUS_RUNTIME`
2. **Env probe**: `HERMES_HOME`, `CODEX_HOME`, `GEMINI_CONFIG_DIR`,
   `CLAUDE_CONFIG_DIR` setados
3. **Filesystem probe**: `~/.hermes/`, `~/.claude/`, `~/.codex/`,
   `~/.gemini/`, `./.github/` existem
4. **Process probe**: argv ou parent comm contém nome do CLI

Cada sinal tem confidence score. Maior score vence. Empate: primeira
detectada na ordem de RUNTIMES.

## Per-runtime install

`bin/lib/runtime-paths.js` resolve paths absolutos baseado em:

- `home` (global): `~/.hermes/`, `~/.claude/`, etc. Honra env vars.
- `local` (per-project): `./.claude/`, `./.codex/`, `./.gemini/`,
  `./.github/` (Copilot é sempre local).

Runtimes que não suportam um modo (ex: Copilot não tem global)
retornam erro claro. Runtimes com formato especial (Gemini `.toml`,
Copilot `.prompt.md`) têm format adapter aplicado.

## Configuração do usuário

`horus-spec-driven.json` é a fonte de verdade. Defaults:

```json
{
  "gsd_core_version": "latest",
  "runtimes": {
    "hermes": { "enabled": true, "mode": "global" },
    "claude": { "enabled": true, "mode": "global" },
    "codex":  { "enabled": true, "mode": "global" },
    "gemini": { "enabled": true, "mode": "global" },
    "copilot":{ "enabled": false, "mode": "local" }
  },
  "prefixes": { "dev": "shd", "qa": "shq", "params": "shp" }
}
```

`last_install` é atualizado após cada install bem-sucedido (audit
trail).

## Vendor lifecycle

```
primeira vez:
  horus-spec-driven install
    → rm -rf modules/
    → git clone --depth 1 open-gsd/gsd-core modules/gsd-core
    → stage + rebrand + install

sync subsequente:
  horus-spec-driven sync
    → rm -rf modules/
    → git clone --depth 1 open-gsd/gsd-core modules/gsd-core
    → stage + rebrand + install

upgrade específico:
  horus-spec-driven install --version=v1.3.0
    → git clone --depth 1 --branch v1.3.0 open-gsd/gsd-core modules/gsd-core
    → stage + rebrand + install
```

`modules/` é totalmente gitignored. Não commita, não versiona, não
distribui. Cada install recria do zero (shallow clone é leve).

## Performance

| Stage | Tempo típico |
|---|---|
| Pull (shallow clone) | 5-15s |
| Stage (copy) | < 1s |
| Rebrand (86+ files) | < 1s |
| Install per runtime | 1-3s |
| Total | ~30s cold, ~5s cached |

## Tradeoffs e limitações

- **Wrapper não pode patchar lógica do gsd-core upstream.** Se um
  comando tem bug, o fix tem que ir pro upstream primeiro.
- **Rebrand é one-way.** Se você rodar `horus-spec-driven install` duas vezes,
  o segundo install é no-op (nada renomeia, mas copia é safe).
- **Gemini `.toml` conversion é manual.** O gsd-core upstream gera
  markdown; converter pra TOML é não-trivial (precisa parsear frontmatter,
  extrair descrição, formatar). Workaround: o `horus-spec-driven install` copia
  como `.md` e warns sobre conversão manual. Roadmap: `bin/toml-convert.js`.
- **Codex agent `.toml` conversion é manual.** Mesma situação. Roadmap:
  `bin/codex-agent-convert.js`.
- **WSL tem quirks de path.** `os.homedir()` em WSL resolve pro path
  Windows (`/mnt/c/Users/...`), mas o Windows Node resolve pra
  `C:\Users\...`. Mitigation: o installer usa `os.homedir()` direto e
  deixa o runtime resolver. Se quebrar, override via `--<runtime>-config=`.

## Roadmap

- [ ] `horus-spec-driven uninstall`
- [ ] TOML converter pra Gemini
- [ ] `.toml` converter pra Codex agents
- [ ] Suporte a Kilo, Cursor, Windsurf, OpenCode, Cline, Augment
- [ ] Systemd user timer pra sync diário
- [ ] CI pra validar rebrand (lint test)
- [ ] Lockfile (`horus-spec-driven.lock`) com sha256 do vendor
- [ ] Webhook do GitHub pra notificar novos releases do upstream
