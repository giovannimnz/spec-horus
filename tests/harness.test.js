const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { repoRoot, runSdk } = require('./helpers/run-cli');

const fixtureRoot = path.join(repoRoot(), 'tests', 'fixtures', 'minimal-gsd-project');

test('fixture has minimal gsd substrate', () => {
  assert.equal(fs.existsSync(path.join(fixtureRoot, '.planning', 'PROJECT.md')), true);
  assert.equal(fs.existsSync(path.join(fixtureRoot, '.planning', 'STATE.md')), true);
  assert.equal(fs.existsSync(path.join(fixtureRoot, '.planning', 'ROADMAP.md')), true);
  assert.equal(fs.existsSync(path.join(fixtureRoot, '.planning', 'config.json')), true);
});

test('sdk state works against fixture', () => {
  const result = runSdk(['state', 'load', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.planning_exists, true);
  assert.equal(parsed.roadmap_exists, true);
});

test('sdk graphify build works against fixture copy', () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hsd-graph-fixture-'));
  fs.cpSync(fixtureRoot, tempRoot, { recursive: true });
  const result = runSdk(['graphify', 'build', '--cwd', tempRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.build, 'complete');
  assert.equal(fs.existsSync(path.join(tempRoot, '.planning', 'graphs', 'graph.json')), true);
});
