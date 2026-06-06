const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { repoRoot } = require('./helpers/run-cli');

function runBash(scriptPath, options = {}) {
  return spawnSync('bash', [scriptPath], {
    cwd: options.cwd || repoRoot(),
    encoding: 'utf8',
    env: { ...process.env, ...(options.env || {}) },
    timeout: options.timeout || 30000,
  });
}

function countFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return 0;
  return fs.readdirSync(dir).filter(predicate).length;
}

test('hermes install.sh installs skills, agents and adapter to temp HERMES_HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-hermes-'));
  const result = runBash(path.join(repoRoot(), 'dist', 'hermes', 'install.sh'), {
    env: { HERMES_HOME: home },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(home, 'skills', 'hsd', 'hsd-pm', 'SKILL.md')), true);
  assert.equal(fs.existsSync(path.join(home, 'skills', 'hsd', 'horus-sdk-hermes', 'index.cjs')), true);
  assert.equal(countFiles(path.join(home, 'agents'), f => f.endsWith('.md')), 3);
});

test('claude install.sh installs nested skills to temp HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-claude-'));
  const result = runBash(path.join(repoRoot(), 'dist', 'claude', 'install.sh'), {
    env: { HOME: home },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(home, '.claude', 'skills', 'hsd-pm', 'SKILL.md')), true);
  assert.equal(countFiles(path.join(home, '.claude', 'skills'), () => true), 4);
});

test('codex install.sh installs 15 prompts to temp HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-codex-'));
  const result = runBash(path.join(repoRoot(), 'dist', 'codex', 'install.sh'), {
    env: { HOME: home },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(countFiles(path.join(home, '.codex', 'prompts'), f => f.endsWith('.md')), 15);
});

test('gemini install.sh installs 15 toml commands to temp HOME', () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-gemini-'));
  const result = runBash(path.join(repoRoot(), 'dist', 'gemini', 'install.sh'), {
    env: { HOME: home },
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(countFiles(path.join(home, '.gemini', 'commands', 'hsd'), f => f.endsWith('.toml')), 15);
});

test('copilot install.sh installs 15 prompts to repo-local .github/prompts', () => {
  const tempRepo = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-copilot-'));
  fs.mkdirSync(path.join(tempRepo, 'dist'), { recursive: true });
  fs.cpSync(path.join(repoRoot(), 'dist', 'copilot'), path.join(tempRepo, 'dist', 'copilot'), { recursive: true });
  const result = runBash(path.join(tempRepo, 'dist', 'copilot', 'install.sh'), {
    cwd: tempRepo,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(countFiles(path.join(tempRepo, '.github', 'prompts'), f => f.endsWith('.md')), 15);
});
