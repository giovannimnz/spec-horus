#!/usr/bin/env node
'use strict';

/**
 * horus-spec-driven installer — kind-driven, converter-aware
 *
 * v2.1 design:
 *   1. Pull gsd-core vendor (git clone shallow)
 *   2. Build wordlist (gsd → shd/shq/shp) from vendor commands/ + agents/
 *   3. For each target runtime+mode:
 *      a. Resolve layout (kinds) from bin/lib/layout.js
 *      b. For each kind in the layout:
 *         - Read source files from vendor
 *         - Apply rebrand to body (groom to shd/shq/shp)
 *         - Apply content converter (runtime-specific body rewrites)
 *         - Apply subagent adapter (gsd-X → neutral <subagent> form)
 *         - Apply frontmatter converter (rebuild header for runtime format)
 *         - Apply layout prefix to filename
 *         - Write to runtime's destSubpath
 *   4. Save install state to horus-spec-driven.json
 *
 * Output is runtime-specific. Each runtime gets format-correct files
 * that the runtime's loader can parse without further adaptation.
 *
 * The user's experience:
 *   horus-spec-driven install --all --global
 *     → pull gsd-core (1-3s)
 *     → rebrand (instant)
 *     → install hermes (skills/hsd/<stem>/SKILL.md with version field)
 *     → install claude (skills/hsd-<stem>/SKILL.md flat, or commands/hsd/ for local)
 *     → install codex (skills/hsd-<stem>/SKILL.md with adapter)
 *     → install gemini (commands/hsd/<file>.toml)
 *     → install copilot (skills/hsd-<stem>/SKILL.md with comma tools)
 *     → done.
 */

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execSync } = require('child_process');

const { RUNTIMES, detectAvailable, resolveBaseDir } = require('./lib/runtime-paths.js');
const { buildWordlist } = require('./rebrand.js');
const { getRuntimeLayout, listRuntimes, makeCmdNames } = require('./lib/layout.js');

const ROOT = path.resolve(__dirname, '..');
const MODULES_DIR = path.join(ROOT, 'modules');
const SPEC_HORUS_JSON = path.join(ROOT, 'horus-spec-driven.json');
const PKG = require(path.join(ROOT, 'package.json'));
const PKG_VERSION = PKG.version;

// ─── logger ───────────────────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m', bold: '\x1b[1m', dim: '\x1b[2m',
  red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m',
  blue: '\x1b[34m', magenta: '\x1b[35m', cyan: '\x1b[36m',
};
const log = (color, label, msg) => console.log(`${C[color]}${label}${C.reset} ${msg}`);
const info = (m) => log('cyan', '●', m);
const ok = (m) => log('green', '✓', m);
const warn = (m) => log('yellow', '!', m);
const err = (m) => log('red', '✗', m);
const header = (m) => console.log(`\n${C.bold}${C.magenta}━━━ ${m} ━━━${C.reset}`);

// ─── body rebrand helper ──────────────────────────────────────────────────

function applyBodyRebrand(content, wordlist) {
  if (!content || !wordlist) return content;
  let c = content;
  for (const [oldStr, newStr] of wordlist) {
    if (oldStr === newStr) continue;
    // Only replace word-boundary matches
    const re = new RegExp('\\b' + oldStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'g');
    c = c.replace(re, newStr);
  }
  return c;
}

// ─── config ───────────────────────────────────────────────────────────────

function loadConfig() {
  if (!fs.existsSync(SPEC_HORUS_JSON)) {
    return {
      gsd_core_version: 'latest',
      runtimes: {
        hermes: { enabled: true, mode: 'global' },
        claude: { enabled: true, mode: 'global' },
        codex:  { enabled: true, mode: 'global' },
        gemini: { enabled: true, mode: 'global' },
        copilot:{ enabled: false, mode: 'local' },
      },
      prefixes: { dev: 'shd', qa: 'shq', params: 'shp' },
    };
  }
  return JSON.parse(fs.readFileSync(SPEC_HORUS_JSON, 'utf8'));
}

function saveConfig(cfg) {
  fs.writeFileSync(SPEC_HORUS_JSON, JSON.stringify(cfg, null, 2) + '\n', 'utf8');
}

// ─── modules pull (submodule update) ─────────────────────────────────────

function pullModules(version) {
  header('Updating submodules');
  info('updating gsd-core submodule');
  execSync('git submodule update --init --depth 1 --remote modules/gsd-core', {
    cwd: ROOT,
    stdio: 'inherit',
  });
  info('updating caveman submodule');
  execSync('git submodule update --init --depth 1 --remote modules/caveman 2>&1 || true', {
    cwd: ROOT, stdio: 'pipe',
  });
  info('updating impeccable submodule');
  execSync('git submodule update --init --depth 1 --remote modules/impeccable 2>&1 || true', {
    cwd: ROOT, stdio: 'pipe',
  });
  ok('submodules updated');
}

// ─── install one kind for one runtime ─────────────────────────────────────

function installKind(runtimeId, mode, kindSpec, wordlist, dryRun) {
  const baseDir = resolveBaseDir(runtimeId, mode);
  const destDir = path.join(baseDir, kindSpec.destSubpath);
  const srcCommandsDir = path.join(MODULES_DIR, 'gsd-core', 'commands', 'gsd');
  const srcAgentsDir = path.join(MODULES_DIR, 'gsd-core', 'agents');
  const srcSkillsDir = path.join(MODULES_DIR, 'gsd-core', 'skills');
  const unifiedSkillsDir = path.join(ROOT, 'unified-skills');
  const cmdNames = makeCmdNames(wordlist);

  // Use unified skills if built, otherwise fall back to vendor commands
  const useUnified = fs.existsSync(unifiedSkillsDir) && fs.readdirSync(unifiedSkillsDir).length > 0;

  // Determine source based on kind
  let srcDir, srcPattern;
  if (kindSpec.kind === 'commands') {
    srcDir = srcCommandsDir;
    srcPattern = (f) => f.endsWith('.md');
  } else if (kindSpec.kind === 'agents') {
    srcDir = srcAgentsDir;
    srcPattern = (f) => f.endsWith('.md');
  } else if (kindSpec.kind === 'skills') {
    if (useUnified) {
      srcDir = unifiedSkillsDir;
      srcPattern = (f) => f === 'SKILL.md';  // unified: each dir has one SKILL.md
    } else {
      srcDir = srcSkillsDir;
      if (!fs.existsSync(srcDir)) {
        srcDir = srcCommandsDir;
      }
      srcPattern = (f) => f.endsWith('.md');
    }
  } else {
    return { installed: 0, skipped: 0 };
  }

  if (!fs.existsSync(srcDir)) {
    warn(`source dir missing: ${srcDir}`);
    return { installed: 0, skipped: 0 };
  }

  if (!dryRun) fs.mkdirSync(destDir, { recursive: true });

  let installed = 0;
  const contentConv = kindSpec.contentConverter ? kindSpec.contentConverter(cmdNames) : (c) => c;
  const frontmatterConv = kindSpec.frontmatterConverter ? kindSpec.frontmatterConverter(cmdNames, PKG_VERSION) : null;

  // Unified mode: iterate directories (hsd-po-discover/SKILL.md, etc.)
  // Vendor mode: iterate flat files (new-project.md, etc.)
  if (useUnified && kindSpec.kind === 'skills') {
    for (const dirName of fs.readdirSync(srcDir)) {
      const skillDir = path.join(srcDir, dirName);
      const skillFile = path.join(skillDir, 'SKILL.md');
      if (!fs.statSync(skillDir).isDirectory() || !fs.existsSync(skillFile)) continue;

      const newFullName = dirName;  // already rebranded: hsd-po-discover
      const destSkillDir = path.join(destDir, newFullName);
      if (!dryRun) fs.mkdirSync(destSkillDir, { recursive: true });

      let content = fs.readFileSync(skillFile, 'utf8');
      // Apply content converter (Hermes-specific rewrites)
      content = contentConv(content);
      // Apply frontmatter converter to full content (handles --- delimiters internally)
      if (frontmatterConv) {
        content = frontmatterConv(content, newFullName);
      }

      const destFile = path.join(destSkillDir, 'SKILL.md');
      if (!dryRun) fs.writeFileSync(destFile, content, 'utf8');
      installed++;
      info(`  ${newFullName}/`);
    }
    return { installed, skipped: 0 };
  }

  for (const file of fs.readdirSync(srcDir)) {
    if (!srcPattern(file)) continue;

    // Source filename: 'new-project.md' (commands/) or 'gsd-executor.md' (agents/)
    const fileStemRaw = file.replace(/\\.md$/, '');
    const oldFullName = fileStemRaw.startsWith('gsd-')
      ? fileStemRaw                    // agents/gsd-foo.md
      : `gsd-${fileStemRaw}`;           // commands/new-project.md → gsd-new-project

    // Rebrand: gsd-foo → shd-foo / shq-foo / shp-foo
    const newFullName = wordlist.get(oldFullName) || oldFullName;
    const bareStem = newFullName.replace(/^hsd-[a-z]+-/, '').replace(/^sh[dpq]-/, '');

    // The OUTER prefix (from layout config) is prepended to the bare stem.
    // For all current layouts prefix='' so outerPrefix+stem === bareStem.
    // The full rebadged name (with shd/shq/shp) becomes the FILENAME in
    // the destDir, so the user sees `~/.hermes/skills/hsd/shd-new-project/`
    // not just `add-tests/`.
    const outerPrefix = kindSpec.prefix;
    const filename = `${outerPrefix}${bareStem}`;

    // The skill name registered in the runtime (frontmatter `name:`) is the
    // full rebadged form, with or without outer prefix depending on layout.
    let skillName;
    if (kindSpec.kind === 'agents') {
      skillName = newFullName; // agents use full rebadged name in frontmatter
    } else if (kindSpec.prefix === '') {
      // Hermes + all current layouts: outer prefix is empty, so skill name
      // is the full rebadged form (e.g. 'shd-new-project')
      skillName = newFullName;
    } else {
      // Hypothetical: outer prefix non-empty → concat
      skillName = `${outerPrefix}${bareStem}`;
    }

    let content = fs.readFileSync(path.join(srcDir, file), 'utf8');

    // 1. Body rebrand: apply wordlist replacements
    content = applyBodyRebrand(content, wordlist);

    // 2. Apply runtime content converter
    content = contentConv(content);

    // 3. Apply frontmatter converter (rebuild header for this runtime's format)
    if (frontmatterConv && kindSpec.kind !== 'agents') {
      content = frontmatterConv(content, skillName);
    }

    // Write file
    const ext = kindSpec.format === 'toml' ? '.toml' : '.md';

    if (kindSpec.kind === 'skills' && kindSpec.prefix === '') {
      // Hermes nested: <destDir>/<bareStem>/SKILL.md  (filename is rebadged form)
      // We use the FULL rebadged form for the directory so the user sees
      //   ~/.hermes/skills/hsd/shd-new-project/SKILL.md
      // not
      //   ~/.hermes/skills/hsd/new-project/SKILL.md
      const skillDir = path.join(destDir, newFullName);
      if (!dryRun) {
        fs.mkdirSync(skillDir, { recursive: true });
        fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf8');
      }
    } else if (kindSpec.kind === 'skills') {
      // Flat: <destDir>/<prefix><bareStem>/SKILL.md
      const skillDir = path.join(destDir, filename);
      if (!dryRun) {
        fs.mkdirSync(skillDir, { recursive: true });
        fs.writeFileSync(path.join(skillDir, 'SKILL.md'), content, 'utf8');
      }
    } else if (kindSpec.kind === 'commands') {
      // Gemini commands: <destDir>/<filename>.toml with full rebadged stem
      const destFile = path.join(destDir, `${newFullName}${ext}`);
      if (!dryRun) fs.writeFileSync(destFile, content, 'utf8');
    } else if (kindSpec.kind === 'agents') {
      // Agent: <destDir>/<newFullName>.md
      const destFile = path.join(destDir, `${newFullName}.md`);
      if (!dryRun) fs.writeFileSync(destFile, content, 'utf8');
    }
    installed++;
  }

  return { installed, skipped: 0 };
}

// ─── install one runtime+mode ─────────────────────────────────────────────

function installRuntime(runtimeId, mode, wordlist, dryRun) {
  const r = RUNTIMES[runtimeId];
  if (!r) return { installed: 0, skipped: 1, error: `unknown runtime ${runtimeId}` };
  if (!r.modes.includes(mode)) {
    warn(`  ${runtimeId} does not support mode '${mode}' — skipped`);
    return { installed: 0, skipped: 1 };
  }

  info(`installing to ${r.label} (${mode})`);
  const layout = getRuntimeLayout(runtimeId, mode);
  let total = 0;
  for (const kind of layout.kinds) {
    const result = installKind(runtimeId, mode, kind, wordlist, dryRun);
    total += result.installed;
    info(`  ${kind.kind}/: ${result.installed} files`);
  }

  // Also install horus-sdk-hermes as a skill for Hermes
  if (runtimeId === 'hermes' && mode === 'global') {
    const adapterDir = path.join(resolveBaseDir(runtimeId, mode), 'skills', 'hsd', 'horus-sdk-hermes');
    if (!dryRun) {
      const srcAdapter = path.join(ROOT, 'bin', 'lib', 'horus-sdk-hermes');
      if (fs.existsSync(srcAdapter)) {
        fs.cpSync(srcAdapter, adapterDir, { recursive: true });
        // Create SKILL.md
        const skillMd = `---
name: horus-sdk-hermes
description: Hermes-native reimplementation of gsd-tools.cjs — supports state, init, config, commit, frontmatter, roadmap, phase, validate, workstream, scaffold, milestone, misc, and resolve commands
version: ${PKG_VERSION}
metadata:
  hermes:
    tags: [gsd, sdk, adapter, horus-spec-driven, hermes-native, gsd-tools]
    related_skills: [shd-health, shd-config, shd-execute-phase, shd-plan-phase, shd-graphify]
---

# horus-sdk-hermes — Hermes-native gsd-tools.cjs replacement

Reimplements 90+ subcommands from gsd-tools.cjs using Hermes-native
tools (read_file, write_file, terminal). No gsd-core dependency.

## Usage
\`\`\`bash
node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs <verb> [args] --cwd <project-path>
\`\`\`

## Supported verbs (28 unique)
- state, init, state-snapshot, summary-extract, history-digest
- config-get, config-set, config-set-model-profile, config-new-project
- commit, commit-to-subrepo, check-commit
- frontmatter.get, frontmatter.set, frontmatter.merge, frontmatter.validate
- roadmap (get-phase, analyze), phase (add, insert, remove, complete)
- validate (consistency, health), audit-uat, audit-open
- workstream (create, list, set, complete, progress, status)
- scaffold (context, uat, verification, phase-dir)
- milestone complete, requirements mark-complete
- progress, resolve-model, resolve-granularity, resolve-execution
- list-todos, verify-path-exists, gap-analysis, learnings
- generate-slug, current-timestamp, prompt-budget

Graphify uses postgres_fact_store + filesystem scanning for knowledge graph queries.
Agent-skills uses skill_view(name=...) -- the Hermes-native skill loader.
Websearch uses web_search() -- Hermes built-in with Exa, Firecrawl, Parallel, Tavily backends.

## Example
\`\`\`bash
# Same as gsd-tools state load --cwd /path
node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs state load --cwd /path/to/project

# Same as gsd-tools roadmap get-phase 1
node ~/.hermes/skills/hsd/horus-sdk-hermes/index.cjs roadmap get-phase 1 --cwd /path/to/project
\`\`\`
`;
        fs.writeFileSync(path.join(adapterDir, 'SKILL.md'), skillMd);
      }
    }
    total += 1;
    info(`  adapter/: horus-sdk-hermes skill installed (${dryRun ? 'dry-run' : 'real'})`);
  }

  // Also install horus-sdk-codex for Codex (global or local)
  if (runtimeId === 'codex') {
    const adapterDir = path.join(resolveBaseDir(runtimeId, mode), 'skills', 'horus-sdk-codex');
    if (!dryRun) {
      const srcAdapter = path.join(ROOT, 'bin', 'lib', 'horus-sdk-codex');
      if (fs.existsSync(srcAdapter)) {
        fs.mkdirSync(adapterDir, { recursive: true });
        fs.cpSync(srcAdapter, adapterDir, { recursive: true });
        const skillMd = `---
name: horus-sdk-codex
description: Codex-native SDK for Horus Spec Driven — state, config, roadmap, phase, validation, workstream, scaffold and milestone operations over .planning/
version: ${PKG_VERSION}
metadata:
  codex:
    tags: [gsd, hsd, sdk, adapter, horus-spec-driven, codex-native]
---

# horus-sdk-codex — Codex-native GSD/HSD SDK

Use this from Codex prompts before falling back to gsd-tools.cjs, Hermes or Claude-specific primitives.

\`\`\`bash
node ~/.codex/skills/horus-sdk-codex/index.cjs <verb> [args] --cwd <project-path>
\`\`\`

Global install target: \`~/.codex/skills/horus-sdk-codex/\`.
Local install target: \`./.codex/skills/horus-sdk-codex/\`.
`;
        fs.writeFileSync(path.join(adapterDir, 'SKILL.md'), skillMd);
      }
    }
    total += 1;
    info(`  adapter/: horus-sdk-codex skill installed (${dryRun ? 'dry-run' : 'real'})`);
  }


  return { installed: total, skipped: 0 };
}

// ─── commands ─────────────────────────────────────────────────────────────

function cmdHelp() {
  console.log(`
horus-spec-driven v${PKG_VERSION} — install Spec-Horus (rebadged gsd-core) into multiple AI coding CLIs.

Usage:
  horus-spec-driven install [options]              Install rebadged gsd-core into runtimes
  horus-spec-driven sync   [options]              Pull latest gsd-core and re-install
  horus-spec-driven detect                          List detected runtimes on this host
  horus-spec-driven language <code>                 Switch language (en, pt)
  horus-spec-driven wordlist                        Show rebrand map
  horus-spec-driven help                            Show this help

install/sync options:
  --all                       Install into every detected runtime
  --runtime=<id>              One of: ${listRuntimes().join(', ')}
  --global                    Install into the runtime's global home (default)
  --local                     Install into the project dir (./.claude, ./.codex, etc.)
  --dry-run                   Print what would happen; make no changes
  --no-pull            Skip pulling gsd-core (assume modules/ is fresh)
  --version=<tag|branch>      Pin gsd-core version (default: latest)
  --hermes-config=<path>      Override HERMES_HOME
  --claude-config=<path>      Override CLAUDE_CONFIG_DIR
  --codex-config=<path>       Override CODEX_HOME
  --gemini-config=<path>      Override GEMINI_CONFIG_DIR
`);
}

function cmdDetect() {
  const detected = detectAvailable();
  header('Detected runtimes on this host');
  if (detected.length === 0) {
    warn('no runtimes detected — install at least one of: hermes, claude, codex, gemini, copilot');
  } else {
    for (const id of detected) {
      const r = RUNTIMES[id];
      console.log(`  ${C.green}●${C.reset} ${id.padEnd(8)} ${r.label}`);
    }
  }
  console.log(`\n  ${C.cyan}all supported runtimes${C.reset}: ${listRuntimes().join(', ')}`);
}

function cmdWordlist() {
  if (!fs.existsSync(path.join(MODULES_DIR, 'gsd-core'))) {
    err('modules/gsd-core/ missing — run `horus-spec-driven install` first');
    process.exit(1);
  }
  const commandsDir = path.join(MODULES_DIR, 'gsd-core', 'commands', 'gsd');
  const agentsDir = path.join(MODULES_DIR, 'gsd-core', 'agents');
  const wl = buildWordlist(commandsDir, agentsDir);
  const rows = Array.from(wl.entries()).sort();

  const obj = Object.fromEntries(rows);
  const unifiedPath = path.join(MODULES_DIR, 'unified-wordlist.json');
  const rebrandPath = path.join(MODULES_DIR, 'rebrand-wordlist.json');
  fs.writeFileSync(unifiedPath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
  fs.writeFileSync(rebrandPath, JSON.stringify(obj, null, 2) + '\n', 'utf8');

  console.log(`\n  ${rows.length} entries (commands + agents)\n`);
  for (const [oldN, newN] of rows) {
    const cat = newN.startsWith('shq-') ? 'qa' : newN.startsWith('shp-') ? 'params' : 'dev';
    const c = cat === 'qa' ? C.yellow : cat === 'params' ? C.magenta : C.green;
    console.log(`  ${c}${cat.padEnd(6)}${C.reset}  ${oldN.padEnd(36)} -> ${newN}`);
  }
  console.log(`\n  Rebrand wordlist: ${path.relative(ROOT, rebrandPath)}`);
  console.log(`  Unified wordlist: ${path.relative(ROOT, unifiedPath)}`);
}

function parseArgs(argv) {
  const opts = {
    command: null,
    runtimes: [],
    mode: 'global',
    dryRun: false,
    pullModules: true,
    version: 'latest',
    configOverrides: {},
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (['install','sync','detect','wordlist','help'].includes(a)) {
      opts.command = a;
    } else if (a === '--all') {
      opts.runtimes = listRuntimes();
    } else if (a.startsWith('--runtime=')) {
      opts.runtimes.push(a.split('=')[1]);
    } else if (a === '--global') {
      opts.mode = 'global';
    } else if (a === '--local') {
      opts.mode = 'local';
    } else if (a === '--dry-run') {
      opts.dryRun = true;
    } else if (a === '--no-pull') {
      opts.pullModules = false;
    } else if (a.startsWith('--version=')) {
      opts.version = a.split('=')[1];
    } else if (a.startsWith('--hermes-config=')) {
      opts.configOverrides.HERMES_HOME = a.split('=')[1];
    } else if (a.startsWith('--claude-config=')) {
      opts.configOverrides.CLAUDE_CONFIG_DIR = a.split('=')[1];
    } else if (a.startsWith('--codex-config=')) {
      opts.configOverrides.CODEX_HOME = a.split('=')[1];
    } else if (a.startsWith('--gemini-config=')) {
      opts.configOverrides.GEMINI_CONFIG_DIR = a.split('=')[1];
    } else if (a === 'language') {
      // language command — next arg is locale code
      opts.command = 'language';
    }
  }
  // Also support: language <code> without explicit flag
  if (opts.command === 'language' && argv.indexOf('language') < argv.length - 1) {
    opts.localeTarget = argv[argv.indexOf('language') + 1];
  }
  if (opts.command === 'language' && !opts.localeTarget) {
    opts.localeTarget = 'list'; // no code given → list available
  }
  return opts;
}

function applyConfigOverrides(o) {
  for (const [k, v] of Object.entries(o)) process.env[k] = v;
}

function pickRuntimes(opts) {
  if (opts.runtimes.length > 0) return opts.runtimes;
  return detectAvailable().filter((id) => id !== 'copilot' || opts.mode === 'local');
}

async function cmdInstall(opts) {
  applyConfigOverrides(opts.configOverrides);
  const config = loadConfig();
  const runtimes = pickRuntimes(opts);

  if (opts.pullModules) pullModules(opts.version);
  else info('skipping modules pull (using existing modules/gsd-core)');

  header('Building rebrand wordlist');
  const commandsDir = path.join(MODULES_DIR, 'gsd-core', 'commands', 'gsd');
  const agentsDir = path.join(MODULES_DIR, 'gsd-core', 'agents');
  const wordlist = buildWordlist(commandsDir, agentsDir);
  info(`wordlist: ${wordlist.size} entries (commands + agents)`);
  fs.writeFileSync(
    path.join(MODULES_DIR, 'rebrand-wordlist.json'),
    JSON.stringify(Array.from(wordlist.entries()).sort(), null, 2) + '\n'
  );

  header(`Installing to ${runtimes.length} runtime(s)`);
  let totalFiles = 0;
  for (const id of runtimes) {
    const r = installRuntime(id, opts.mode, wordlist, opts.dryRun);
    totalFiles += r.installed;
    if (r.skipped) warn(`  ${id}: ${r.skipped} skipped`);
  }

  if (!opts.dryRun) {
    config.last_install = {
      runtimes,
      mode: opts.mode,
      gsd_core_version: opts.version,
      date: new Date().toISOString(),
    };
    saveConfig(config);
  }

  header('Done');
  ok(`horus-spec-driven v${PKG_VERSION} installed ${totalFiles} files across ${runtimes.length} runtime(s)`);
  console.log(`\n  Rebrand wordlist: modules/rebrand-wordlist.json`);
  console.log(`  Config: horus-spec-driven.json\n`);
}

async function cmdSync(opts) {
  info('sync: pulling latest gsd-core and re-installing');
  opts.pullModules = true;
  opts.version = 'latest';
  return cmdInstall(opts);
}

// ─── language command ─────────────────────────────────────────────────────

function cmdLanguage(localeTarget) {
  const configPath = SPEC_HORUS_JSON;
  const cfg = loadConfig();

  const localesDir = path.join(ROOT, 'locales');
  const available = fs.readdirSync(localesDir)
    .filter(f => f.endsWith('.json'))
    .map(f => f.replace(/\.json$/, ''))
    .sort();

  if (localeTarget === 'list' || !localeTarget) {
    const current = cfg.locale?.code || 'en';
    console.log(`\n  ${C.bold}Language / Idioma${C.reset}`);
    console.log(`  ${C.dim}Current / Atual:${C.reset} ${current}`);
    console.log(`  ${C.dim}Available / Disponível:${C.reset}`);
    for (const loc of available) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(localesDir, `${loc}.json`), 'utf8'));
        const marker = loc === current ? ' ◄' : '';
        console.log(`    ${C.green}${loc}${C.reset}  ${data.locale.name}${marker}`);
      } catch (_) {
        console.log(`    ${C.yellow}${loc}${C.reset}`);
      }
    }
    console.log(`\n  ${C.dim}Switch: horus-spec-driven language <code>${C.reset}`);
    console.log(`  ${C.dim}Example: horus-spec-driven language pt${C.reset}\n`);
    return Promise.resolve();
  }

  if (!available.includes(localeTarget)) {
    console.error(`  ${C.red}✗${C.reset} Invalid locale: ${localeTarget}`);
    console.log(`  ${C.dim}Available: ${available.join(', ')}${C.reset}`);
    process.exit(1);
  }

  // Update config
  cfg.locale = cfg.locale || {};
  cfg.locale.code = localeTarget;
  fs.writeFileSync(configPath, JSON.stringify(cfg, null, 2) + '\n', 'utf8');

  try {
    const localeData = JSON.parse(fs.readFileSync(path.join(localesDir, `${localeTarget}.json`), 'utf8'));
    console.log(`\n  ${C.green}✓${C.reset} Language set to: ${localeData.locale.name} (${localeTarget})\n`);

    // Rebuild unified skills with new locale
    header('Rebuilding skills with new language');
    const buildScript = path.join(ROOT, 'bin', 'build-unified-skills.cjs');
    const buildResult = execSync(`node "${buildScript}" --locale ${localeTarget}`, {
      timeout: 30000, cwd: ROOT,
    });
    console.log(buildResult.toString());

    // Reinstall
    header('Reinstalling skills');
    const opts = parseArgs(['install', '--runtime=hermes', '--global', '--no-pull']);
    return cmdInstall(opts);
  } catch (e) {
    console.error(`  ${C.red}✗${C.reset} Language switch failed: ${e.message}`);
    process.exit(1);
  }
}

function main() {
  const args = process.argv.slice(2);
  const opts = parseArgs(args);
  if (!opts.command || opts.command === 'help') {
    cmdHelp();
    return Promise.resolve();
  }
  if (opts.command === 'language') {
    return cmdLanguage(opts.localeTarget);
  }
  switch (opts.command) {
    case 'detect': cmdDetect(); return Promise.resolve();
    case 'wordlist': cmdWordlist(); return Promise.resolve();
    case 'install': return cmdInstall(opts);
    case 'sync': return cmdSync(opts);
    default:
      err(`unknown command: ${opts.command}`);
      cmdHelp();
      process.exit(1);
  }
}

main().catch((e) => {
  err(e.message);
  if (process.env.SPEC_HORUS_DEBUG) console.error(e.stack);
  process.exit(1);
});
