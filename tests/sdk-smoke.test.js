const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { repoRoot, runSdk, runCodexSdk } = require('./helpers/run-cli');

const fixtureRoot = path.join(repoRoot(), 'tests', 'fixtures', 'minimal-gsd-project');

test('sdk config-get reads workflow flag from fixture', () => {
  const result = runSdk(['config-get', 'workflow.ui_phase', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), 'true');
});

test('sdk roadmap analyze returns one fixture phase', () => {
  const result = runSdk(['roadmap', 'analyze', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.phase_count, 1);
  assert.equal(parsed.phases[0].phase_name, 'fixture bootstrap');
});

test('sdk roadmap get-phase returns goal and success criteria', () => {
  const result = runSdk(['roadmap', 'get-phase', '1', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.found, true);
  assert.match(parsed.goal, /stable fake GSD project/i);
  assert.equal(parsed.success_criteria.length, 3);
});

test('sdk validate consistency passes on fixture', () => {
  const result = runSdk(['validate', 'consistency', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.consistent, true);
  assert.equal(parsed.disk_phases, 1);
  assert.equal(parsed.roadmap_phases, 1);
});

test('sdk frontmatter.get returns field value', () => {
  const result = runSdk([
    'frontmatter.get',
    '.planning/phases/01-fixture-bootstrap/fixture-note.md',
    '--field',
    'title',
    '--cwd',
    fixtureRoot,
  ]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), '"fixture-note"');
});

test('sdk frontmatter.validate passes with explicit schema', () => {
  const result = runSdk([
    'frontmatter.validate',
    '.planning/phases/01-fixture-bootstrap/fixture-note.md',
    '--schema',
    'title,status',
    '--cwd',
    fixtureRoot,
  ]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.valid, true);
  assert.equal(parsed.total, 2);
});

test('sdk phase.mvp-mode returns false for standard phase', () => {
  const result = runSdk(['phase.mvp-mode', '1', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), 'false');
});

test('sdk unknown verb exits non-zero with useful error', () => {
  const result = runSdk(['nope', '--cwd', fixtureRoot]);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Unknown verb: nope/);
});


test('codex sdk config-get reads workflow flag from fixture', () => {
  const result = runCodexSdk(['config-get', 'workflow.ui_phase', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  assert.equal(result.stdout.trim(), 'true');
});

test('codex sdk roadmap analyze returns fixture phase', () => {
  const result = runCodexSdk(['roadmap', 'analyze', '--cwd', fixtureRoot]);
  assert.equal(result.code, 0, result.stderr || result.stdout);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.phase_count, 1);
  assert.equal(parsed.phases[0].phase_name, 'fixture bootstrap');
});

test('codex sdk unknown verb exits non-zero with useful error', () => {
  const result = runCodexSdk(['nope', '--cwd', fixtureRoot]);
  assert.notEqual(result.code, 0);
  assert.match(result.stderr, /Unknown verb: nope/);
});
