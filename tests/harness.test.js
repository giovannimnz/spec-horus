const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
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

test('sdk graphify build works against fixture', () => {
  const result = runSdk(['graphify', 'build', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.build, 'complete');
  assert.equal(fs.existsSync(path.join(fixtureRoot, '.planning', 'graphs', 'graph.json')), true);
});
