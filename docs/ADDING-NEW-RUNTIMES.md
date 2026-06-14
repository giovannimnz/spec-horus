# Adding New CLI Runtimes to horus-spec-driven

## Purpose

This document explains how to study, validate and add a new CLI runtime to the
`horus-spec-driven` wrapper without regressing the 5 runtimes already supported.

Current supported runtimes:
- Hermes Agent
- Claude Code
- OpenAI Codex CLI
- Google Gemini CLI
- GitHub Copilot

## Decision rule: when a runtime is worth supporting

Only add a new runtime if it passes all 5 gates:

1. **Prompt surface exists**
   - Can the CLI load reusable prompts/commands/skills from files?
2. **Install target is stable**
   - Is there a predictable path like `~/.tool/...` or repo-local `.github/...`?
3. **Format is mappable**
   - Can we convert our canonical prompt into the runtime-native format?
4. **Smoke test is automatable**
   - Can we prove install/layout/detection end-to-end locally?
5. **Maintenance cost is acceptable**
   - New runtime should not break or overcomplicate current 5 runtimes.

If any gate fails → do not add yet. Document as research candidate only.

## Architecture checklist for a new runtime

### 1. Runtime profile

Add a runtime entry covering:
- runtime id
- install target path
- file format (`SKILL.md`, `.md`, `.toml`, etc.)
- nested vs flat layout
- local vs global mode behavior

Touchpoints:
- `runtimes/`
- `bin/lib/runtime-paths.js`
- `bin/lib/layout.js`

### 2. Content converter

Add a converter in:
- `bin/lib/content-converters/<runtime>.js`

Responsibilities:
- adapt body wording
- adapt runtime-specific command examples
- inject adapter notes if needed
- strip unsupported constructs

### 3. Frontmatter converter

Add/update in:
- `bin/lib/frontmatter-converters/<runtime>.js`

Responsibilities:
- map metadata to runtime-native format
- remove fields the target runtime cannot parse

### 4. Builder integration

Update `bin/builder.js`:
- runtime package generation
- runtime README metadata
- install script template
- count/format summary

### 5. Install path logic

Update installer flow in:
- `bin/install.js`
- `dist/<runtime>/install.sh` generation in `bin/builder.js`

Questions to answer:
- HOME-based or repo-local install?
- nested or flat copy?
- agents supported or not?
- adapter copied or not?

### 6. Smoke validation

Must add tests for:
- builder output exists
- install target path correct
- file count correct
- naming pattern correct
- install script works in temp HOME / temp repo

Touchpoints:
- `tests/builder-install.test.js`
- `tests/runtime-install.test.js`
- new runtime-specific assertions

### 7. Docs alignment

Must update all of these together:
- `README.md`
- `SETUP.md`
- `CHANGELOG.md`
- `horus-spec-driven.json`
- `docs/UNIFIED-COMMANDS.yaml`
- `docs/RUNTIME-VALIDATION-MATRIX.md`
- runtime `dist/<runtime>/README.md`

Rule: runtime count changes require documentation changes in the same commit.

## Validation workflow for a new runtime

1. Implement runtime profile + converter
2. Run `node bin/install.js wordlist`
3. Run `npm run build`
4. Inspect `dist/<runtime>/`
5. Add/adjust tests
6. Run `npm test`
7. Run install smoke in temp HOME / temp repo
8. Update matrix + docs
9. Commit only after all green

## Known pitfalls

### Pitfall 1 — generated `dist/` can hide source bugs

Patch `dist/<runtime>/install.sh` directly only for diagnosis. The real fix must go
in `bin/builder.js` or it will regress on next build.

### Pitfall 2 — command counts drift from reality

Do not trust old docs. Count actual generated artifacts and reconcile docs to code.
Phase 10 proved current flat runtimes are **15**, not 16.

### Pitfall 3 — parallel tests race on `dist/`

If one test regenerates `dist/` and another consumes it, force
`--test-concurrency=1`.

### Pitfall 4 — nested vs flat mismatch

Installer assumptions must match actual builder output. Claude showed this bug:
output was nested, installer assumed flat.

## Candidate future runtimes (research only)

### 1. Continue.dev
Pros:
- prompt-centric workflow
- editor-native
Cons:
- install/distribution surface may vary by editor host

### 2. Aider
Pros:
- CLI-native
- markdown/prompt friendly
Cons:
- workflow model is chat/file centric, may not map cleanly to skill surfaces

### 3. Cursor rules / commands
Pros:
- popular environment
Cons:
- weak standardized install surface; may be config-fragment based, not package based

### 4. OpenCode / custom ACP CLIs
Pros:
- closer to current agentic workflow
Cons:
- fragmentation; each CLI may need its own adapter and smoke path

## Minimal acceptance checklist

A runtime is considered supported only when all are true:
- [ ] `npm run build` emits `dist/<runtime>/`
- [ ] runtime README exists
- [ ] install script exists and works (or repo-local target path is validated)
- [ ] file counts are documented and tested
- [ ] matrix updated
- [ ] main README and setup docs updated
- [ ] no existing runtime regressed

## Current conclusion

The wrapper can expand safely, but only with:
- canonical source in builder/converters
- runtime-specific install smoke tests
- docs reconciled to generated artifacts
- no assumptions copied from another runtime
