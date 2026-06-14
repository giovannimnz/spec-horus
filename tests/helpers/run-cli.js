const { spawnSync } = require('node:child_process');
const path = require('node:path');

function repoRoot() {
  return path.resolve(__dirname, '..', '..');
}

function runNode(args, options = {}) {
  const result = spawnSync(process.execPath, args, {
    cwd: options.cwd || repoRoot(),
    encoding: 'utf8',
    env: { ...process.env, ...(options.env || {}) },
    timeout: options.timeout || 30000,
  });

  return {
    code: result.status,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
  };
}

function runSdk(args, options = {}) {
  return runNode([
    path.join(repoRoot(), 'bin', 'lib', 'horus-sdk-hermes', 'index.cjs'),
    ...args,
  ], options);
}

function runBuilder(args = [], options = {}) {
  return runNode([
    path.join(repoRoot(), 'bin', 'builder.js'),
    ...args,
  ], options);
}

function runCodexSdk(args, options = {}) {
  return runNode([
    path.join(repoRoot(), 'bin', 'lib', 'horus-sdk-codex', 'index.cjs'),
    ...args,
  ], options);
}

module.exports = {
  repoRoot,
  runNode,
  runSdk,
  runCodexSdk,
  runBuilder,
};
