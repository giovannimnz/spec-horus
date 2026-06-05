# Rebrand Engine

Como Spec-Horus transforma `/gsd-*` em `/shd-*`, `/shq-*`, `/shp-*`.

## Filosofia

**Wordlist-based, não regex cego.**

Lemos `modules/gsd-core/commands/gsd/*.md` no momento do install, e
construímos um mapa exato `oldName → newName`. Não usamos regex como
`gsd-.*` que poderia casar conteúdo legítimo.

Vantagens:
- **Zero falsos positivos**: cada match é uma string exata do upstream.
- **Auto-extensível**: quando upstream adiciona `gsd-new-cmd.md`, ele
  entra automaticamente no wordlist.
- **Categorização por substring** (3 categorias mutuamente exclusivas).

## Categorização

Cada `gsd-<cmd>` vira um de três prefixos baseado em heurística de
substring:

| Categoria | Prefixo | Substrings gatilho |
|---|---|---|
| **Spec-Horus Development** | `shd` | (default — tudo que não casa os outros) |
| **Spec-Horus QA** | `shq` | `validate`, `verify`, `audit`, `review`, `eval`, `secure`, `check` |
| **Spec-Horus Params** | `shp` | `config`, `settings`, `params`, `profile-user` |

Prioridade: **qa > params > dev**. Se um nome tem `validate` E `config`
(ex: `gsd-config-validate`), `validate` ganha → `shq-config-validate`.

## Mapeamento completo (gsd-core v1.3.1-dev)

86+ comandos catalogados. Ver
`modules/rebrand-wordlist.json` após primeiro `horus-spec-driven install` (ou
rodar `node bin/install.js wordlist`).

Exemplos:

```
dev:
  gsd-new-project            -> shd-new-project
  gsd-discuss-phase          -> shd-discuss-phase
  gsd-plan-phase             -> shd-plan-phase
  gsd-execute-phase          -> shd-execute-phase
  gsd-debug                  -> shd-debug
  gsd-spike                  -> shd-spike
  gsd-sketch                 -> shd-sketch
  gsd-quick                  -> shd-quick
  gsd-ship                   -> shd-ship
  gsd-help                   -> shd-help
  gsd-progress               -> shd-progress

qa:
  gsd-validate-phase         -> shq-validate-phase
  gsd-verify-work            -> shq-verify-work
  gsd-verify-phase           -> shq-verify-phase
  gsd-audit-uat              -> shq-audit-uat
  gsd-audit-milestone        -> shq-audit-milestone
  gsd-audit-fix              -> shq-audit-fix
  gsd-code-review            -> shq-code-review
  gsd-eval-review            -> shq-eval-review
  gsd-secure-phase           -> shq-secure-phase
  gsd-ui-review              -> shq-ui-review

params:
  gsd-config                 -> shp-config
  gsd-settings               -> shp-settings
  gsd-params                 -> shp-params
  gsd-profile-user           -> shp-profile-user
```

## Implementação

`bin/rebrand.js` expõe 4 funções:

```js
buildWordlist(commandsDir)        // Map<oldName, newName>
buildReplaceRegex(wordlist)       // /\b(gsd-foo|gsd-bar|...)\b/g
rebrandText(text, regex, wl)      // aplica regex + wordlist
rebrandDirectoryTree(dir, wl)     // rename files + edit bodies
```

### `rebrandDirectoryTree`

Walk recursivo. Para cada arquivo:

1. **Filename rebadging** (se começa com `gsd-`):
   - `gsd-validate-phase.md` → `shq-validate-phase.md`
   - `gsd-config.md` → `shp-config.md`
   - `gsd-foo.md` → `shd-foo.md`
2. **Body rebadging** (se `.md` ou `.toml`):
   - Regex `\b(gsd-validate-phase|gsd-config|...)\b` substitui
     ocorrências pela versão rebadged
   - `\b` word boundary previne matches parciais (ex: `gsd-debugger`
     dentro de texto não é confundido com `gsd-debug`)

### Edge cases

- **Filenames com `gsd-` no meio** (não começo): ignorados. Só
  renomeamos arquivos `^gsd-.*\.md$`.
- **Body references a `/gsd:foo`** (colon form): o gsd-core upstream
  converte `/gsd:foo` → `/gsd-foo` em alguns runtimes. O rebrand
  funciona em qualquer das duas formas (regex `\b` casa ambas).
- **Frontmatter `name: gsd-foo`**: o regex pega porque `\b` boundaries
  estão antes do `gsd-` (que vem após `:` ou `\n`).
- **Caminhos `.claude/skills/`** no body: o rebrand os preserva — eles
  referenciam paths do filesystem, não comandos. (O rebrand não toca
  em paths.)

## Customização de prefixos

Quer usar `shx` ao invés de `shq`? Edite `horus-spec-driven.json`:

```json
{
  "prefixes": {
    "dev": "shd",
    "qa": "shx",
    "params": "shp"
  }
}
```

Próximo `horus-spec-driven install` aplica. (Nota: feature em roadmap —
atualmente os prefixos são fixos em `bin/rebrand.js`.)

## Por que 3 categorias?

Spec-Horus = **Development** (default), **QA**, **Params**. Mapeamento
mental:

- **Dev** = fazer o trabalho (plan, execute, debug, spike, sketch)
- **QA** = verificar qualidade (validate, verify, audit, review, eval,
  secure, check)
- **Params** = configurar a ferramenta (config, settings, params,
  profile-user)

Quem usa 2 categorias? Spec-Horus dev e QA, ignora params. Quem usa
todas? Quem quer separação total.

## Adicionando uma nova categoria

1. Adicione a categoria em `bin/rebrand.js`:
   ```js
   const SECURITY_SUBSTRINGS = ['security', 'threat', 'vuln'];
   function categorize(name) {
     const base = name.replace(/^gsd-/, '');
     for (const sub of SECURITY_SUBSTRINGS) {
       if (base.includes(sub)) return 'shs'; // Spec-Horus Security
     }
     // ... resto da lógica
   }
   ```
2. Adicione em `horus-spec-driven.json`:
   ```json
   {
     "prefixes": { "dev": "shd", "qa": "shq", "params": "shp", "security": "shs" }
   }
   ```
3. Documente em `REBRAND.md`.
