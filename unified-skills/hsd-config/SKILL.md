---
name: hsd-config
description: "⚙️ Configuração do HSD — idioma, compressão e subagentes"
version: "4.1.0"
author: "Horus Spec Driven"
license: "MIT"
locale: "pt"
platforms:
  - hermes
metadata:
  hermes:
    tags: ["hsd", "config", "pt"]
    category: "config"
---

# ⚙️ hsd-config

---

## Idioma

```
/hsd-config language pt     → Português
/hsd-config language en     → English
```

**Idioma:** Português (Brasil) (pt)

---

## Compressão de Fala

Define o estilo de compressão da fala do agente (caveman mode)

| Nível | Nome | Descrição |
|---|---|---|
| `lite` | Lite | Lite — redução leve, mantém fluidez |
| `full` | Full | Full — compressão padrão, ~75% de redução |
| `ultra` | Ultra | Ultra — compressão máxima, estilo telegráfico |


```
/hsd-config compression lite
/hsd-config compression full
/hsd-config compression ultra
```

**Compressão atual:** `full` (padrão)

---

## Subagentes (Cavecrew)

Ativa/desativa subagentes comprimidos para delegar tarefas

| Atalho | Agente | Descrição |
|---|---|---|
| `investigator` | cavecrew-investigator | cavecrew-investigator — localiza código (output comprimido) |
| `builder` | cavecrew-builder | cavecrew-builder — edita 1-2 arquivos (output comprimido) |
| `reviewer` | cavecrew-reviewer | cavecrew-reviewer — revisa diffs (output comprimido) |


```
/hsd-config agents investigator   → Ativar investigator
/hsd-config agents builder        → Ativar builder
/hsd-config agents reviewer       → Ativar reviewer
/hsd-config agents off            → Desativar todos
```

---

*Horus Spec Driven v4.1 — Português (Brasil)*
