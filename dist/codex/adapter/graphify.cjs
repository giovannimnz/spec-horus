#!/usr/bin/env node
'use strict';

/**
 * graphify.cjs — Hermes-native knowledge graph adapter (storage-agnostic)
 *
 * Replaces gsd-tools.cjs graphify. Detects the Hermes storage backend
 * automatically and adapts:
 *
 *   Tier 1 (default, zero-config): JSON file at .planning/graphs/graph.json
 *     Uses filesystem scanning to build nodes/edges from .planning/*.md files.
 *     Queries are plain-text substring search. No database required.
 *     Agent instructions: memory(), search_files(), session_search().
 *
 *   Tier 2 (Hermes with PostgreSQL extension): postgres_fact_store
 *     Facts are stored as structured entities with trust scoring.
 *     Queries use PostgreSQL tsvector full-text search.
 *     Entity resolution: probe(), reason(), related().
 *     Detected by `postgres_fact_store` tool availability.
 *
 *   Tier 3 (enhanced SQLite FTS5): session_search()
 *     Stores graph entities as memory entries, queried via FTS5
 *     on the session database. Built into every Hermes install.
 *
 * Tier selection is automatic and documented in output. The agent
 * receives concrete instructions for the detected tier.
 *
 * Mapping (gsd-core → horus-spec-driven):
 *   graphify build          → scan .planning/, store in Tier 1/2/3
 *   graphify query <term>   → search by detected tier capabilities
 *   graphify status         → metadata about stored graph
 *   graphify diff           → change detection via git log
 *   graphify build snapshot → build + write snapshot metadata
 *
 * v2.1 — Storage-agnostic. Works on every Hermes install, zero config.
 */

const fs = require('fs');
const path = require('path');

// ─── helpers ──────────────────────────────────────────────────────────────

function safeRead(p) { try { return fs.readFileSync(p, 'utf8'); } catch (_) { return null; } }
function safeJson(p) { try { return JSON.parse(safeRead(p)); } catch (_) { return null; } }
function safeWriteJson(p, data) {
  const dir = path.dirname(p);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ─── tier detection ──────────────────────────────────────────────────────

function detectPython(cwd) {
  try {
    const { execSync } = require('child_process');
    const v = execSync('python3 --version 2>&1', { timeout: 3000 }).toString();
    return v.includes('Python');
  } catch (_) { return false; }
}

function installPython(cwd) {
  // Try multiple methods to install Python3. Graceful fallback.
  const { execSync } = require('child_process');
  const methods = [
    { name: 'apt', cmd: 'apt-get update -qq && apt-get install -y -qq python3 2>&1', sudo: true },
    { name: 'brew', cmd: 'brew install python3 2>&1', sudo: false },
    { name: 'dnf', cmd: 'dnf install -y python3 2>&1', sudo: true },
    { name: 'pacman', cmd: 'pacman -S --noconfirm python 2>&1', sudo: true },
    { name: 'apk', cmd: 'apk add --no-cache python3 2>&1', sudo: false },
    { name: 'pip-fallback', cmd: 'pip3 install --user 2>&1 || pip install --user 2>&1', sudo: false },
  ];
  for (const m of methods) {
    try {
      const cmd = m.sudo ? `sudo ${m.cmd}` : m.cmd;
      execSync(cmd, { timeout: 30000, stdio: 'pipe' });
      if (detectPython(cwd)) return { installed: true, method: m.name };
    } catch (_) {}
  }
  return { installed: false, methods_tried: methods.map(m => m.name) };
}

function ensurePython(cwd) {
  if (detectPython(cwd)) return { available: true, version: require('child_process').execSync('python3 --version 2>&1', { timeout: 3000 }).toString().trim() };
  const result = installPython(cwd);
  if (result.installed) return { available: true, installed_by: result.method };
  return {
    available: false,
    fallback: 'file',
    message: 'Python3 not available and auto-install failed. graphify will use file-based scanning (.planning/ artifacts only, no code analysis). To enable code-aware scanning, install Python3: apt install python3, brew install python3, or dnf install python3.',
    methods_tried: result.methods_tried,
  };
}

function graphifyyPath() {
  // graphifyy.py lives next to this .cjs file in the horus-sdk-hermes dir
  return path.join(__dirname, 'graphifyy.py');
}

function detectTier(cwd) {
  // Tier 0: Python graphifyy.py available (best — code + planning analysis)
  // Tier 2: PostgreSQL via postgres_fact_store
  // Tier 1: default — file-based (always available)
  if (process.env.HERMES_PG_ENABLED === '1') return 'pg';
  // Check for graphifyy.py script (belongs to horus-spec-driven, no pip install needed)
  const gyPath = graphifyyPath();
  if (fs.existsSync(gyPath)) {
    const py = ensurePython(cwd);
    if (py.available) return 'py';
    // Python not available. Return 'py' anyway but with install_attempted flag
    // so the caller can show the error message.
    return 'py';  // graphifyBuild will attempt install and fallback
  }
  return 'file';
}

/**
 * Return agent instructions for each graphify operation based on detected tier.
 */
function agentInstructions(tier, operation, extra) {
  const base = { tier, operation };
  if (tier === 'py') {
    return {
      ...base,
      store: 'graphifyy.py (Python code analysis)',
      build: 'python3 graphifyy.py build --cwd <project>',
      query: 'python3 graphifyy.py query <term> --cwd <project>',
      status: 'python3 graphifyy.py status --cwd <project>',
      diff: 'python3 graphifyy.py diff --cwd <project>',
      note: 'Code-aware scanning (classes, functions, imports, routes, tables) + .planning artifacts.',
    };
  }
  if (tier === 'pg') {
    return {
      ...base,
      store: 'postgres_fact_store',
      build: 'postgres_fact_store(action="add", content="<id>: <label> — <description>", category="project", tags="graphify,<type>")',
      query: 'postgres_fact_store(action="search", query="<term>")',
      probe: 'postgres_fact_store(action="probe", entity="<entity>")',
      reason: 'postgres_fact_store(action="reason", entities=["<e1>", "<e2>"])',
      list: 'postgres_fact_store(action="list", limit=100)',
    };
  }
  // Tier 1: file-based (default)
  return {
    ...base,
    store: 'memory tool + .planning/graphs/graph.json',
    build: [
      'memory(action="add", content="<id>: <label> — <description>", target="memory")',
      'Stored in ~/.hermes/memories/MEMORY.md between § delimiters.',
      'Also written to .planning/graphs/graph.json for project-level sharing.',
    ],
    query: [
      'search_files(pattern="<term>", target="content", path=".planning/")',
      'memory(action="read", target="memory") and filter for <term>',
      'session_search(query="graphify: <term>") for cross-session recall',
    ],
    probe: 'search_files(pattern="<entity>", target="content", path=".planning/")',
    list: 'memory(action="read", target="memory") — all graphify entries',
  };
}

// ─── scanning ─────────────────────────────────────────────────────────────

/**
 * Scan .planning/ for all entities (phases, REQ-IDs, decisions, milestones, config).
 * Builds graph { nodes: [...], edges: [...] } from the filesystem.
 * This is the core engine — it profiles the project into structured knowledge.
 */
function scanProject(cwd) {
  const planDir = path.join(cwd, '.planning');
  if (!fs.existsSync(planDir)) return { nodes: [], edges: [], error: 'no .planning/ directory' };

  const nodes = [];
  const edges = [];
  const seen = new Set();

  function addNode(id, label, type, desc, source) {
    if (seen.has(id)) return id;
    seen.add(id);
    nodes.push({ id, label, description: desc || '', type, source });
    return id;
  }

  // ── ROADMAP.md ──────────────────────────────────────────────────────
  const roadmap = safeRead(path.join(planDir, 'ROADMAP.md'));
  if (roadmap) {
    const milestoneRe = /^## (M\d+):\s*(.+)$/gm;
    let m;
    while ((m = milestoneRe.exec(roadmap)) !== null) {
      addNode(m[1], m[2].trim(), 'milestone', `Milestone ${m[1]}`, 'ROADMAP.md');
    }
    const phaseRe = /^### Phase (\d+(?:\.\d+)?):?\s*(.+)$/gm;
    let prevPhase = null;
    while ((m = phaseRe.exec(roadmap)) !== null) {
      const phaseNum = m[1];
      const phaseName = m[2].trim();
      const phaseId = addNode(`Phase-${phaseNum}`, phaseName, 'phase', `Phase ${phaseNum}`, 'ROADMAP.md');
      const sectionEnd = roadmap.indexOf('\n###', m.index + 1);
      const phaseSection = roadmap.slice(m.index, sectionEnd !== -1 ? sectionEnd : roadmap.length);
      const reqIds = phaseSection.match(/REQ-\d+/g) || [];
      for (const rid of [...new Set(reqIds)]) {
        const reqId = addNode(rid, rid, 'requirement', `Requirement from Phase ${phaseNum}`, 'ROADMAP.md');
        edges.push({ source: phaseId, target: reqId, label: 'contains', confidence: 'EXTRACTED' });
      }
      // Check for **Mode:** mvp
      if (/Mode:\*\*\s*mvp/i.test(phaseSection)) {
        const modeId = addNode(`Mode-${phaseNum}`, 'MVP', 'mode', 'MVP execution mode', 'ROADMAP.md');
        edges.push({ source: phaseId, target: modeId, label: 'mode', confidence: 'EXTRACTED' });
      }
      if (prevPhase) edges.push({ source: prevPhase, target: phaseId, label: 'precedes', confidence: 'EXTRACTED' });
      prevPhase = phaseId;
    }
  }

  // ── REQUIREMENTS.md ─────────────────────────────────────────────────
  const reqs = safeRead(path.join(planDir, 'REQUIREMENTS.md'));
  if (reqs) {
    const reqRe = /^\*?\*?(REQ-\d+)\*?\*?[:*\s-]+(.+)$/gm;
    let m;
    while ((m = reqRe.exec(reqs)) !== null) {
      if (!seen.has(m[1])) {
        addNode(m[1], m[1], 'requirement', m[2].trim(), 'REQUIREMENTS.md');
      }
    }
  }

  // ── Phase directories (CONTEXT.md, PLAN.md, SUMMARY.md) ─────────────
  const phasesDir = path.join(planDir, 'phases');
  if (fs.existsSync(phasesDir)) {
    for (const d of fs.readdirSync(phasesDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const dirName = d.name;
      const phaseNum = (dirName.match(/^(\d+)/) || [])[1];
      const ctxFile = path.join(phasesDir, dirName, dirName + '-CONTEXT.md');
      const context = safeRead(ctxFile);
      if (!context) continue;

      const phaseId = nodes.find(n => n.id === `Phase-${phaseNum}`);
      // Extract D-NN decisions
      const decisionRe = /^\s*-\s+\*?\*?(D-\d+)\*?\*?[:*\s-]+(.+)$/gm;
      let m;
      while ((m = decisionRe.exec(context)) !== null) {
        const didId = addNode(m[1], m[1], 'decision', m[2].trim(), dirName + '/CONTEXT.md');
        if (phaseId) edges.push({ source: phaseId, target: didId, label: 'decides', confidence: 'EXTRACTED' });
      }
    }
  }

  // ── config.json ─────────────────────────────────────────────────────
  const cfg = safeJson(path.join(planDir, 'config.json'));
  if (cfg) {
    if (cfg.model_profile) {
      const mpId = addNode('cfg-model-profile', cfg.model_profile, 'config', `Model profile: ${cfg.model_profile}`, 'config.json');
    }
    if (cfg.granularity) {
      addNode('cfg-granularity', cfg.granularity, 'config', `Granularity: ${cfg.granularity}`, 'config.json');
    }
    if (cfg.currentMilestone) {
      addNode('cfg-current-milestone', cfg.currentMilestone, 'config', `Active milestone: ${cfg.currentMilestone}`, 'config.json');
    }
  }

  // ── git ─────────────────────────────────────────────────────────────
  try {
    const { execSync } = require('child_process');
    const branch = execSync('git -C "' + cwd + '" branch --show-current', { stdio: 'pipe', timeout: 3000 }).toString().trim();
    if (branch) addNode('git-branch', branch, 'git', `Current branch: ${branch}`, 'git');
    const remotes = execSync('git -C "' + cwd + '" remote -v', { stdio: 'pipe', timeout: 3000 }).toString().trim().split('\n')[0];
    if (remotes) {
      const rm = remotes.match(/origin\s+(\S+)/);
      if (rm) addNode('git-origin', rm[1], 'git', 'Origin remote', 'git');
    }
  } catch (_) {}

  return { nodes, edges, nodeCount: nodes.length, edgeCount: edges.length };
}

// ─── build ────────────────────────────────────────────────────────────────

function graphifyBuild(cwd) {
  const tier = detectTier(cwd);

  // Tier 0 (py): delegate to graphifyy.py for code-aware scanning
  if (tier === 'py') {
    const py = ensurePython(cwd);
    if (!py.available) {
      // Python not available — show message and fall back
      console.error('graphify: Python3 not available. Code-aware scanning disabled.');
      console.error(py.message || 'Install Python3 for code analysis.');
      console.error('Using file-based mode (.planning/ artifacts only).');
      return graphifyBuildFallback(cwd);
    }
    try {
      const { execSync } = require('child_process');
      const gyPath = graphifyyPath();
      const raw = execSync(`python3 "${gyPath}" build --cwd "${cwd}"`, {
        timeout: 60000, maxBuffer: 10 * 1024 * 1024,
      }).toString();
      const result = JSON.parse(raw);
      if (result.error) throw new Error(result.error);

      const graphFile = path.join(cwd, '.planning', 'graphs', 'graph.json');
      const stored = safeJson(graphFile);
      return {
        build: 'complete',
        tier: 'py',
        engine: 'graphifyy.py',
        python: py.version || py.installed_by || 'available',
        nodes: stored ? (stored.stats || {}).nodeCount || 0 : 0,
        edges: stored ? (stored.stats || {}).edgeCount || 0 : 0,
        files_scanned: stored ? (stored.stats || {}).filesScanned || 0 : 0,
        graph_file: graphFile,
        agent_instructions: agentInstructions('py', 'build', {}),
        python_output: result,
      };
    } catch (e) {
      console.error('graphify: graphifyy.py failed:', e.message);
      console.error('Falling back to file-based mode.');
      return graphifyBuildFallback(cwd);
    }
  }

  // Tier 1 (file-based) or Tier 2 (PG)
  return graphifyBuildFallback(cwd);
}

function graphifyBuildFallback(cwd) {
  const graph = scanProject(cwd);
  if (graph.error) return graph;

  const tier = detectTier(cwd);
  const graphsDir = path.join(cwd, '.planning', 'graphs');
  const graphFile = path.join(graphsDir, 'graph.json');

  // Tier 1: write to .planning/graphs/graph.json (gsd-core compatible format)
  const fileGraph = {
    built: new Date().toISOString(),
    version: '2.1.0',
    storage: tier,
    tier_description: tier === 'pg'
      ? 'PostgreSQL (postgres_fact_store)'
      : 'File-based (JSON at .planning/graphs/graph.json)',
    nodes: graph.nodes,
    edges: graph.edges,
    stats: { nodeCount: graph.nodeCount, edgeCount: graph.edgeCount },
    byType: graph.nodes.reduce((acc, n) => { acc[n.type] = (acc[n.type] || 0) + 1; return acc; }, {}),
  };

  safeWriteJson(graphFile, fileGraph);

  // Generate agent instructions
  const instr = agentInstructions(tier, 'build', { nodeCount: graph.nodeCount, edgeCount: graph.edgeCount });

  // Generate memory entries for Tier 1 (the default)
  const memoryEntries = graph.nodes.map(n =>
    `[graphify] ${n.id} (${n.type}): ${n.label} — ${n.description} | source: ${n.source}`
  );

  return {
    build: 'complete',
    tier,
    nodes: graph.nodeCount,
    edges: graph.edgeCount,
    graph_file: graphFile,
    memory_entries: memoryEntries,
    agent_instructions: instr,
    // For Tier 1: the agent should call memory() for each entry
    // For Tier 2: the agent should call postgres_fact_store() for each fact
    facts: graph.nodes.map(n => ({
      content: `${n.id}: ${n.label} — ${n.description}`,
      category: n.type === 'requirement' || n.type === 'decision' || n.type === 'milestone'
        ? 'project' : n.type === 'config' ? 'tool' : 'general',
      tags: ['graphify', n.type, 'built-' + new Date().toISOString().split('T')[0]],
    })),
  };
}

function writeSnapshot(cwd) {
  const build = graphifyBuild(cwd);
  if (build.error) return build;
  build.snapshot = true;
  build.snapshot_time = new Date().toISOString();

  const snapshotFile = path.join(cwd, '.planning', 'graphs', '.last-build-snapshot.json');
  safeWriteJson(snapshotFile, {
    snapshot_time: build.snapshot_time,
    nodes: build.nodes,
    edges: build.edges,
    tier: build.tier,
  });

  build.snapshot_file = snapshotFile;
  return build;
}

// ─── query ─────────────────────────────────────────────────────────────────

function graphifyQuery(cwd, term, budget) {
  const tier = detectTier(cwd);

  // Tier 0 (py): delegate to graphifyy.py query
  if (tier === 'py') {
    try {
      const { execSync } = require('child_process');
      const gyPath = graphifyyPath();
      const cmd = budget
        ? `python3 "${gyPath}" query "${term}" --cwd "${cwd}" --budget ${budget}`
        : `python3 "${gyPath}" query "${term}" --cwd "${cwd}"`;
      const raw = execSync(cmd, { timeout: 30000 }).toString();
      const result = JSON.parse(raw);
      if (result.error) throw new Error(result.error);
      return { ...result, tier: 'py', engine: 'graphifyy.py' };
    } catch (e) {
      // Fall back to file-based
    }
  }

  const graph = scanProject(cwd);
  if (graph.error) return graph;

  const fallbackTier = detectTier(cwd);      // fallback tier for non-py path
  const termLower = (term || '').toLowerCase();

  const matchingNodes = graph.nodes.filter(n =>
    n.label.toLowerCase().includes(termLower) ||
    n.description.toLowerCase().includes(termLower) ||
    n.id.toLowerCase().includes(termLower) ||
    n.type.toLowerCase().includes(termLower)
  );

  const matchingEdges = graph.edges.filter(e =>
    e.label.toLowerCase().includes(termLower) ||
    e.source.toLowerCase().includes(termLower) ||
    e.target.toLowerCase().includes(termLower)
  );

  const resultNodes = budget ? matchingNodes.slice(0, budget) : matchingNodes;
  const resultEdges = budget ? matchingEdges.slice(0, budget) : matchingEdges;

  const instr = agentInstructions(tier, 'query', { term });
  // Add term-specific instructions
  if (tier === 'pg') {
    instr.query = instr.query.replace('<term>', term);
    instr.probe = instr.probe.replace('<entity>', term);
  }

  return {
    query: term,
    budget: budget || null,
    tier,
    nodes: resultNodes,
    edges: resultEdges,
    total_nodes: matchingNodes.length,
    total_edges: matchingEdges.length,
    agent_instructions: instr,
    // Cross-reference hints for the agent
    cross_references: matchingNodes.length > 0
      ? `Found ${matchingNodes.length} entities matching "${term}". Use memory() or search_files() to explore further.`
      : `No entities match "${term}". Try a broader term or run 'graphify build' to refresh the graph.`,
  };
}

// ─── status ────────────────────────────────────────────────────────────────

function graphifyStatus(cwd) {
  const graphFile = path.join(cwd, '.planning', 'graphs', 'graph.json');
  const stored = safeJson(graphFile);
  const tier = detectTier();

  if (!stored) {
    // Fast status: scan but don't persist
    const graph = scanProject(cwd);
    return {
      status: 'not_built',
      tier,
      graph_file: graphFile,
      current_scan: { nodeCount: graph.nodeCount || 0, edgeCount: graph.edgeCount || 0 },
      next_action: 'Run graphify build to persist the graph.',
      agent_instructions: agentInstructions(tier, 'status', {}),
    };
  }

  const age = Date.now() - new Date(stored.built).getTime();
  const ageHours = Math.round(age / 3600000);

  return {
    status: ageHours > 24 ? 'stale' : 'fresh',
    tier,
    built: stored.built,
    age_hours: ageHours,
    nodeCount: stored.stats?.nodeCount || stored.nodes?.length || 0,
    edgeCount: stored.stats?.edgeCount || stored.edges?.length || 0,
    graph_file: graphFile,
    byType: stored.byType || {},
    next_action: ageHours > 24 ? 'Run graphify build to refresh stale graph.' : 'Graph is up to date.',
    agent_instructions: agentInstructions(tier, 'status', { ageHours }),
  };
}

// ─── diff ──────────────────────────────────────────────────────────────────

function graphifyDiff(cwd) {
  const graphFile = path.join(cwd, '.planning', 'graphs', 'graph.json');
  const stored = safeJson(graphFile);
  const current = scanProject(cwd);
  const tier = detectTier();

  if (!stored) {
    return {
      status: 'no_baseline',
      tier,
      current_scan: { nodeCount: current.nodeCount, edgeCount: current.edgeCount },
      next_action: 'Run graphify build to create a baseline.',
    };
  }

  // Compare node IDs
  const storedIds = new Set((stored.nodes || []).map(n => n.id));
  const currentIds = new Set((current.nodes || []).map(n => n.id));
  const added = [...currentIds].filter(id => !storedIds.has(id));
  const removed = [...storedIds].filter(id => !currentIds.has(id));
  const unchanged = [...storedIds].filter(id => currentIds.has(id));

  return {
    tier,
    baseline_time: stored.built,
    added: added.length,
    removed: removed.length,
    unchanged: unchanged.length,
    added_details: added.map(id => current.nodes.find(n => n.id === id)).slice(0, 20),
    removed_details: removed.map(id => (stored.nodes || []).find(n => n.id === id)).slice(0, 20),
    agent_instructions: agentInstructions(tier, 'diff', { added: added.length, removed: removed.length }),
    // Use git log for file-level diff (Tier 1 compatible)
    git_hint: 'git -C <project> log --oneline -- .planning/ | head -10',
  };
}

module.exports = { graphifyQuery, graphifyStatus, graphifyDiff, graphifyBuild, writeSnapshot, scanProject, detectTier, agentInstructions, graphifyBuildFallback };
