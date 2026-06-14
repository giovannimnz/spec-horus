'use strict';
const fs = require('fs');
const path = require('path');

function safeRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } }

function listTodos(area, cwd) {
  const searchDir = area ? path.join(cwd, area) : path.join(cwd, '.planning');
  const todos = [];
  if (fs.existsSync(searchDir)) {
    for (const entry of fs.readdirSync(searchDir, { recursive: true, withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      const content = safeRead(path.join(entry.parentPath || searchDir, entry.name));
      if (content) {
        const matches = content.match(/^- \[ \] (.+)$/gm);
        if (matches) todos.push(...matches.map(m => m.replace(/^- \[ \] /, '')));
      }
    }
  }
  return { todos, count: todos.length, area };
}

function pathExists(p, cwd) {
  const fp = path.resolve(cwd, p);
  return { exists: fs.existsSync(fp), path: fp, is_dir: fs.existsSync(fp) && fs.statSync(fp).isDirectory() };
}

function verifySummary(filePath, cwd) {
  const p = path.resolve(cwd, filePath || '.planning/latest-SUMMARY.md');
  const content = safeRead(p);
  if (!content) return { exists: false };
  const hasFrontmatter = /^---/.test(content);
  return { exists: true, has_frontmatter: hasFrontmatter, path: p };
}

function generateSlug(text) {
  return String(text || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function currentTimestamp(format) {
  const now = new Date();
  if (format === 'date') return now.toISOString().split('T')[0];
  if (format === 'filename') return now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
  return now.toISOString();
}

function websearch(query) {
  // Hermes-native: use web_search tool (Exa, Firecrawl, Parallel, Tavily backends).
  // This function generates instructions for the agent to use its built-in
  // web_search tool, which is MORE capable than gsd-tools CLI websearch.
  //
  // Also available: skill_view(name="brave-search"), skill_view(name="minimax-search"),
  // skill_view(name="context7-research") for specific backends.
  return {
    query,
    hermes_instruction: `Use web_search(query="${query}") — Hermes built-in tool with Exa, Firecrawl, Parallel, or Tavily backend.
Alternatively: skill_view(name="brave-search") for Brave Search API, skill_view(name="minimax-search") for MiniMax Search, skill_view(name="context7-research") for Context7 semantic search.

The gsd-tools CLI websearch called Brave Search API and returned JSON.
Hermes web_search is more powerful: multiple backends, LLM-powered content extraction,
markdown summaries to reduce token usage.

Results format: { results: [{ title, url, snippet }] }`,
    results: [],
  };
}

function gapAnalysis(phaseDirArg, cwd) {
  const pd = phaseDirArg || path.join(cwd, '.planning', 'phases');
  const reqFile = path.join(cwd, '.planning', 'REQUIREMENTS.md');
  const reqContent = safeRead(reqFile);
  const reqIds = reqContent ? (reqContent.match(/REQ-\d+/g) || []) : [];
  const planDir = fs.existsSync(pd) ? pd : path.join(cwd, '.planning', 'phases');
  const plans = [];
  if (fs.existsSync(planDir)) {
    for (const d of fs.readdirSync(planDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const pfiles = fs.readdirSync(path.join(planDir, d.name)).filter(f => f.endsWith('-PLAN.md'));
      if (pfiles.length) {
        const content = safeRead(path.join(planDir, d.name, pfiles[0]));
        plans.push({ phase: d.name, reqs: content ? (content.match(/REQ-\d+/g) || []) : [] });
      }
    }
  }
  const rows = reqIds.map(id => {
    const covered = plans.some(p => p.reqs.includes(id));
    return { source: 'REQUIREMENTS.md', item: id, status: covered ? '✓ Covered' : '✗ Not covered' };
  });
  return { gap_analysis: rows, uncovered: rows.filter(r => r.status === '✗ Not covered').length };
}

function learnings(args, cwd) {
  const sub = args[0];
  const lf = path.join(cwd, '.planning', 'LEARNINGS.md');
  if (sub === 'add') {
    const text = args.slice(1).join(' ');
    if (!fs.existsSync(lf)) fs.writeFileSync(lf, '# Learnings\n\n');
    fs.appendFileSync(lf, `- ${new Date().toISOString().split('T')[0]}: ${text}\n`);
    return { added: true };
  }
  if (sub === 'query') return { results: [], note: 'query from LEARNINGS.md not implemented — use read_file directly' };
  if (sub === 'list') return { learnings: safeRead(lf)?.split('\n').filter(l => l.startsWith('- ')) || [] };
  return { error: `unknown learnings subcommand: ${sub}` };
}

function promptBudget(modelStr) {
  const budgets = { 'claude-sonnet-4': 200000, 'opus': 200000, 'haiku': 200000, 'gpt-4o': 128000, 'deepseek': 128000, 'gemini-2.5': 1000000 };
  return { model: modelStr, budget: budgets[modelStr] || 200000 };
}

function updateContext(phase, cwd) {
  const phasesDir = path.join(cwd, '.planning', 'phases');
  const dirs = fs.readdirSync(phasesDir, { withFileTypes: true }).filter(e => e.isDirectory() && e.name.startsWith(String(phase).padStart(2, '0')));
  if (!dirs.length) return { error: 'phase dir not found' };
  const contextFile = path.join(phasesDir, dirs[0].name, `${dirs[0].name}-CONTEXT.md`);
  if (!fs.existsSync(contextFile)) return { error: 'CONTEXT.md not found' };
  const content = safeRead(contextFile);
  const updated = content.replace(/gathered:.*$/, `gathered: ${new Date().toISOString().split('T')[0]}`);
  fs.writeFileSync(contextFile, updated);
  return { updated: true, phase };
}

module.exports = { listTodos, pathExists, verifySummary, generateSlug, currentTimestamp, websearch, gapAnalysis, learnings, promptBudget, updateContext };
