const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { repoRoot, runNode, runBuilder } = require('./helpers/run-cli');

const root = repoRoot();

test('wordlist bootstrap creates modules/unified-wordlist.json', () => {
  const result = runNode([path.join(root, 'bin', 'install.js'), 'wordlist']);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(root, 'modules', 'unified-wordlist.json')), true);
  assert.equal(fs.existsSync(path.join(root, 'modules', 'rebrand-wordlist.json')), true);
});

test('builder all generates dist for 5 runtimes after wordlist bootstrap', () => {
  const result = runBuilder(['--all']);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'hermes', 'install.sh')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'claude', 'install.sh')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'codex', 'install.sh')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'gemini', 'install.sh')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'copilot', 'install.sh')), true);
});

test('builder hermes generates expected files', () => {
  const result = runBuilder(['--runtime=hermes']);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'hermes', 'README.md')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'hermes', 'install.sh')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'hermes', 'adapter', 'index.cjs')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'hermes', 'agents', 'hsd-dev-agent.md')), true);
});

test('install detect lists supported runtimes on this host', () => {
  const result = runNode([path.join(root, 'bin', 'install.js'), 'detect']);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /hermes/);
  assert.match(result.stdout, /claude/);
  assert.match(result.stdout, /codex/);
  assert.match(result.stdout, /gemini/);
  assert.match(result.stdout, /copilot/);
});



test('builder codex generates SDK adapter and self-contained installer', () => {
  const result = runBuilder(['--runtime=codex']);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'codex', 'README.md')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'codex', 'install.sh')), true);
  assert.equal(fs.existsSync(path.join(root, 'dist', 'codex', 'adapter', 'index.cjs')), true);
  const installSh = fs.readFileSync(path.join(root, 'dist', 'codex', 'install.sh'), 'utf8');
  assert.match(installSh, /BASH_SOURCE\[0\]/);
  assert.match(installSh, /horus-sdk-codex/);
});

test('dist codex install.sh installs prompts, agents and horus-sdk-codex into temp CODEX_HOME', () => {
  const build = runBuilder(['--runtime=codex']);
  assert.equal(build.code, 0, build.stderr || build.stdout);
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-codex-home-'));
  const result = spawnSync('bash', [path.join(root, 'dist', 'codex', 'install.sh')], {
    cwd: root,
    encoding: 'utf8',
    env: { ...process.env, CODEX_HOME: temp },
    timeout: 30000,
  });
  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.equal(fs.existsSync(path.join(temp, 'prompts', 'hsd-dev-build.md')), true);
  assert.equal(fs.existsSync(path.join(temp, 'agents', 'hsd-dev-agent.md')), true);
  assert.equal(fs.existsSync(path.join(temp, 'skills', 'horus-sdk-codex', 'index.cjs')), true);
});
