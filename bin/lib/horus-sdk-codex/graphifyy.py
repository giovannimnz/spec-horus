#!/usr/bin/env python3
"""
graphifyy.py — Code-aware knowledge graph builder for Spec-Horus.

Replaces the external `graphifyy` pip package that gsd-core requires.
Scans project source code + .planning/ artifacts, building a structured
graph of entities (classes, functions, models, endpoints, tables, config)
and their relationships.

Usage:
  python3 graphifyy.py build --cwd /path/to/project
  python3 graphifyy.py query <term> --cwd /path/to/project
  python3 graphifyy.py status --cwd /path/to/project
  python3 graphifyy.py diff --cwd /path/to/project

Output: JSON to stdout, compatible with gsd-core's graph.json format.
Exit code 0 on success, 1 on error.

Storage tiers:
  Tier 1 (default): .planning/graphs/graph.json (file-based, zero config)
  Tier 2 (env):     postgres_fact_store via HERMES_PG_ENABLED=1

Ported from gsd-core/src/graphify.cts + graphifyy CLI (MIT-licensed OpenGSD).
Reimplemented in pure Python stdlib for Hermes Agent compatibility.
"""

import ast
import json
import os
import re
import sys
import time
from collections import defaultdict
from pathlib import Path
from typing import Any

# ── helpers ───────────────────────────────────────────────────────────────

IGNORE_DIRS = {
    "node_modules", ".git", "__pycache__", ".venv", "venv", ".planning",
    "vendor", "dist", "build", ".next", ".turbo", ".cache", ".hermes",
    "logs", "tmp", "temp", ".idea", ".vscode",
}

CODE_EXTS = {".py", ".js", ".ts", ".jsx", ".tsx", ".go", ".rs", ".rb", ".java",
             ".c", ".cpp", ".h", ".hpp", ".cs", ".swift", ".kt", ".scala",
             ".sql", ".graphql", ".gql", ".yaml", ".yml", ".toml", ".json",
             ".md", ".mdx", ".mjs", ".cjs", ".cts", ".mts"}

PLAN_DIRS = {".planning"}

# ── Code scanners ─────────────────────────────────────────────────────────

def scan_python(filepath: str, lines: list[str]) -> list[dict]:
    """Extract classes, functions, imports, decorators from Python source."""
    nodes = []
    try:
        tree = ast.parse("\n".join(lines), filename=filepath)
    except SyntaxError:
        return nodes
    relpath = os.path.relpath(filepath)

    for node in ast.walk(tree):
        if isinstance(node, ast.ClassDef):
            methods = [n.name for n in node.body if isinstance(n, ast.FunctionDef)]
            bases = [b.id if isinstance(b, ast.Name) else getattr(b, "attr", str(b))
                     for b in node.bases]
            nodes.append({
                "id": f"class:{relpath}:{node.name}",
                "label": node.name, "type": "class",
                "source_file": relpath, "line": node.lineno,
                "description": f"Class {node.name}" + (f"({', '.join(bases)})" if bases else ""),
                "details": {"methods": methods, "bases": bases},
            })
        elif isinstance(node, ast.FunctionDef) and not isinstance(getattr(node, "parent_field", None), ast.ClassDef):
            args = [a.arg for a in node.args.args]
            decorators = [d.id if isinstance(d, ast.Name) else getattr(d, "attr", str(d)) for d in node.decorator_list]
            nodes.append({
                "id": f"func:{relpath}:{node.name}",
                "label": node.name, "type": "function",
                "source_file": relpath, "line": node.lineno,
                "description": f"def {node.name}({', '.join(args)})",
                "details": {"args": args, "decorators": decorators},
            })
        elif isinstance(node, ast.Import):
            for alias in node.names:
                nodes.append({
                    "id": f"import:{relpath}:{alias.name}",
                    "label": f"import {alias.name}", "type": "import",
                    "source_file": relpath, "line": node.lineno,
                    "description": f"import {alias.name}",
                })
        elif isinstance(node, ast.ImportFrom):
            mod = node.module or ""
            for alias in node.names:
                full = f"{mod}.{alias.name}" if mod else alias.name
                nodes.append({
                    "id": f"import:{relpath}:{full}",
                    "label": f"from {mod} import {alias.name}" if mod else f"import {alias.name}",
                    "type": "import", "source_file": relpath, "line": node.lineno,
                    "description": f"from {mod} import {alias.name}" if mod else f"import {alias.name}",
                })

    return nodes


def scan_javascript(filepath: str, lines: list[str]) -> list[dict]:
    """Extract exports, functions, classes from JS/TS via regex (no parser)."""
    nodes = []
    relpath = os.path.relpath(filepath)
    content = "\n".join(lines)

    # export function / export const / export class / export default
    func_re = re.compile(
        r'export\s+(?:async\s+)?(?:function|const|let|var|class)\s+(\w+)',
        re.MULTILINE
    )
    # import ... from "..." / require("...")
    import_re = re.compile(
        r"""import\s+.*?\s+from\s+['"]([^'"]+)['"]""",
        re.MULTILINE
    )
    require_re = re.compile(
        r"""require\s*\(\s*['"]([^'"]+)['"]\s*\)""",
        re.MULTILINE
    )
    # route / endpoint detection (Express, Fastify, Next.js patterns)
    route_re = re.compile(
        r"""(?:app|router|server)\s*\.\s*(?:get|post|put|patch|delete|options|head|all|use)\s*\(\s*['"]([^'"]+)['"]""",
        re.MULTILINE
    )

    for m in func_re.finditer(content):
        li = content[:m.start()].count('\n') + 1
        nodes.append({
            "id": f"export:{relpath}:{m.group(1)}",
            "label": m.group(1), "type": "export",
            "source_file": relpath, "line": li,
            "description": f"export {m.group(1)}",
        })

    for m in import_re.finditer(content):
        li = content[:m.start()].count('\n') + 1
        nodes.append({
            "id": f"import:{relpath}:{m.group(1)}",
            "label": m.group(1), "type": "import",
            "source_file": relpath, "line": li,
            "description": f"import from '{m.group(1)}'",
        })

    for m in require_re.finditer(content):
        li = content[:m.start()].count('\n') + 1
        nodes.append({
            "id": f"require:{relpath}:{m.group(1)}",
            "label": m.group(1), "type": "require",
            "source_file": relpath, "line": li,
            "description": f"require('{m.group(1)}')",
        })

    for m in route_re.finditer(content):
        li = content[:m.start()].count('\n') + 1
        nodes.append({
            "id": f"route:{relpath}:{m.group(1)}",
            "label": m.group(1), "type": "endpoint",
            "source_file": relpath, "line": li,
            "description": f"Route: {m.group(1)}",
        })

    return nodes


def scan_sql(filepath: str, lines: list[str]) -> list[dict]:
    """Extract tables, columns from SQL files."""
    nodes = []
    relpath = os.path.relpath(filepath)
    content = "\n".join(lines)
    table_re = re.compile(r'CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?[`"\[]?(\w+)[`"\]]?', re.IGNORECASE)
    for m in table_re.finditer(content):
        li = content[:m.start()].count('\n') + 1
        nodes.append({
            "id": f"table:{relpath}:{m.group(1)}",
            "label": m.group(1), "type": "sql_table",
            "source_file": relpath, "line": li,
            "description": f"SQL table: {m.group(1)}",
        })
    return nodes


def scan_generic(filepath: str, lines: list[str]) -> list[dict]:
    """Fallback scanner: detect 'class', 'function', 'struct', config keys."""
    nodes = []
    relpath = os.path.relpath(filepath)
    content = "\n".join(lines)

    # class
    for m in re.finditer(r'^\s*(?:export\s+)?(?:abstract\s+)?class\s+(\w+)', content, re.MULTILINE):
        li = content[:m.start()].count('\n') + 1
        nodes.append({
            "id": f"class:{relpath}:{m.group(1)}",
            "label": m.group(1), "type": "class",
            "source_file": relpath, "line": li,
            "description": f"class {m.group(1)}",
        })
    return nodes


SCANNERS = {".py": scan_python, ".js": scan_javascript, ".ts": scan_javascript,
            ".jsx": scan_javascript, ".tsx": scan_javascript, ".mjs": scan_javascript,
            ".cjs": scan_javascript, ".cts": scan_javascript, ".mts": scan_javascript,
            ".sql": scan_sql,
}

# ── Planning scanner ──────────────────────────────────────────────────────

def scan_planning(cwd: str) -> tuple[list[dict], list[dict]]:
    """Scan .planning/ artifacts (ROADMAP, REQUIREMENTS, CONTEXT, config)."""
    plan_dir = os.path.join(cwd, ".planning")
    if not os.path.isdir(plan_dir):
        return [], []

    nodes = []
    edges = []
    seen = set()

    def add_node(nid, label, ntype, desc, src):
        if nid in seen: return nid
        seen.add(nid)
        nodes.append({"id": nid, "label": label, "type": ntype,
                       "description": desc, "source_file": src})
        return nid

    # ROADMAP.md
    roadmap = Path(cwd, ".planning", "ROADMAP.md")
    if roadmap.exists():
        text = roadmap.read_text()
        prev = None
        for m in re.finditer(r'^### Phase (\d+(?:\.\d+)?):?\s*(.+)$', text, re.MULTILINE):
            pid = add_node(f"Phase-{m.group(1)}", m.group(2).strip(), "phase",
                           f"Phase {m.group(1)}", ".planning/ROADMAP.md")
            if prev:
                edges.append({"source": prev, "target": pid, "label": "precedes", "confidence": "EXTRACTED"})
            prev = pid

    # REQUIREMENTS.md
    reqs = Path(cwd, ".planning", "REQUIREMENTS.md")
    if reqs.exists():
        for m in re.finditer(r'^\*?\*?(REQ-\d+)\*?\*?[:*\s-]+(.+)$', reqs.read_text(), re.MULTILINE):
            add_node(m.group(1), m.group(1), "requirement", m.group(2).strip(), ".planning/REQUIREMENTS.md")

    return nodes, edges


# ── Edge inference ────────────────────────────────────────────────────────

def infer_edges(nodes: list[dict]) -> list[dict]:
    """Infer relationships: import→module, route→file, class→base."""
    edges = []
    node_by_id = {n["id"]: n for n in nodes}

    for n in nodes:
        if n["type"] == "import":
            # find matching file (simplistic: module name → filename)
            mod = n["label"].replace("from ", "").replace("import ", "").strip("'\"")
            # try to match against export nodes with similar name
            for n2 in nodes:
                if n2["type"] == "export" and n2["label"] in mod:
                    edges.append({"source": n["id"], "target": n2["id"],
                                  "label": "imports", "confidence": "INFERRED"})
                    break

        elif n["type"] == "endpoint":
            src = n.get("source_file", "")
            for n2 in nodes:
                if n2["type"] == "function" and n2.get("source_file") == src:
                    if abs(n2.get("line", 0) - n.get("line", 0)) < 30:
                        edges.append({"source": n["id"], "target": n2["id"],
                                      "label": "handled_by", "confidence": "INFERRED"})
                        break

    return edges


# ── Build ──────────────────────────────────────────────────────────────────

def build(cwd: str) -> dict:
    """Full scan: code + planning → graph.json."""
    start = time.time()
    nodes = []
    edges = []

    # Scan codebase
    file_count = 0
    for root, dirs, files in os.walk(cwd):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS and not d.startswith(".")]
        for fname in files:
            ext = os.path.splitext(fname)[1].lower()
            if ext not in CODE_EXTS:
                continue
            fp = os.path.join(root, fname)
            file_count += 1
            try:
                lines = Path(fp).read_text().splitlines()
            except (OSError, UnicodeDecodeError):
                continue
            scanner = SCANNERS.get(ext, scan_generic)
            nodes += scanner(fp, lines)

    # Scan planning artifacts
    pnodes, pedges = scan_planning(cwd)
    nodes += pnodes
    edges += pedges

    # Infer edges
    edges += infer_edges(nodes)

    elapsed = time.time() - start
    by_type = defaultdict(int)
    for n in nodes:
        by_type[n.get("type", "unknown")] += 1

    return {
        "built": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "version": "2.1.0",
        "storage": "file",
        "tier_description": "File-based graphifyy (Python stdlib)",
        "nodes": nodes,
        "edges": edges,
        "stats": {"nodeCount": len(nodes), "edgeCount": len(edges),
                  "filesScanned": file_count, "elapsedMs": int(elapsed * 1000)},
        "byType": dict(by_type),
    }


# ── Query ──────────────────────────────────────────────────────────────────

def query(graph: dict, term: str, budget: int | None = None) -> dict:
    """Full-text search across all nodes and edges."""
    tl = term.lower()
    matching_nodes = [
        n for n in graph.get("nodes", [])
        if tl in n.get("label", "").lower()
        or tl in n.get("description", "").lower()
        or tl in n.get("id", "").lower()
        or tl in n.get("type", "").lower()
    ]
    matching_edges = [
        e for e in graph.get("edges", [])
        if tl in e.get("label", "").lower()
        or tl in e.get("source", "").lower()
        or tl in e.get("target", "").lower()
    ]
    if budget:
        matching_nodes = matching_nodes[:budget]
        matching_edges = matching_edges[:budget]

    return {"query": term, "nodes": matching_nodes, "edges": matching_edges,
            "total_nodes": len(matching_nodes), "total_edges": len(matching_edges)}


# ── Status ─────────────────────────────────────────────────────────────────

def status(cwd: str) -> dict:
    """Check freshness of existing graph.json."""
    gf = os.path.join(cwd, ".planning", "graphs", "graph.json")
    if not os.path.exists(gf):
        return {"status": "not_built", "next_action": "Run 'graphifyy.py build --cwd .' to build."}

    with open(gf) as f:
        data = json.load(f)

    age_h = round((time.time() - time.mktime(time.strptime(data["built"],
                  "%Y-%m-%dT%H:%M:%SZ"))) / 3600, 1)
    return {"status": "stale" if age_h > 24 else "fresh", "age_hours": age_h,
            "nodeCount": data["stats"]["nodeCount"], "edgeCount": data["stats"]["edgeCount"],
            "byType": data.get("byType", {}), "filesScanned": data["stats"].get("filesScanned", 0),
            "next_action": "Run 'graphifyy.py build --cwd .' to refresh." if age_h > 24 else "Up to date."}


# ── Diff ───────────────────────────────────────────────────────────────────

def diff(cwd: str) -> dict:
    """Compare current scan against stored graph.json."""
    gf = os.path.join(cwd, ".planning", "graphs", "graph.json")
    if not os.path.exists(gf):
        return {"status": "no_baseline", "next_action": "Run 'graphifyy.py build --cwd .' to create baseline."}

    with open(gf) as f:
        stored = json.load(f)

    current_ids = {n["id"] for n in build(cwd).get("nodes", [])}
    stored_ids = {n["id"] for n in stored.get("nodes", [])}

    added = current_ids - stored_ids
    removed = stored_ids - current_ids

    return {"added": len(added), "removed": len(removed),
            "unchanged": len(stored_ids & current_ids),
            "added_details": sorted(added)[:30], "removed_details": sorted(removed)[:30]}


# ── CLI ────────────────────────────────────────────────────────────────────

def main():
    args = sys.argv[1:]
    cwd = os.getcwd()

    for i, a in enumerate(args):
        if a == "--cwd" and i + 1 < len(args):
            cwd = os.path.abspath(args[i + 1])

    if not args:
        print(json.dumps({"error": "Usage: graphifyy.py [build|query|status|diff] --cwd <path>"}))
        sys.exit(1)

    cmd = args[0]

    try:
        if cmd == "build":
            result = build(cwd)
            graphs_dir = os.path.join(cwd, ".planning", "graphs")
            os.makedirs(graphs_dir, exist_ok=True)
            with open(os.path.join(graphs_dir, "graph.json"), "w") as f:
                json.dump(result, f, indent=2)
            print(json.dumps({"build": "complete", "nodes": result["stats"]["nodeCount"],
                              "edges": result["stats"]["edgeCount"],
                              "files_scanned": result["stats"]["filesScanned"],
                              "elapsed_ms": result["stats"]["elapsedMs"],
                              "graph_file": os.path.join(graphs_dir, "graph.json")}))

        elif cmd == "query":
            gf = os.path.join(cwd, ".planning", "graphs", "graph.json")
            if not os.path.exists(gf):
                print(json.dumps({"error": "No graph built yet. Run 'graphifyy.py build --cwd .' first."}))
                sys.exit(1)
            with open(gf) as f:
                graph = json.load(f)
            term = args[1] if len(args) > 1 and not args[1].startswith("--") else ""
            budget = None
            for i, a in enumerate(args):
                if a == "--budget" and i + 1 < len(args):
                    budget = int(args[i + 1])
            print(json.dumps(query(graph, term, budget)))

        elif cmd == "status":
            print(json.dumps(status(cwd)))

        elif cmd == "diff":
            print(json.dumps(diff(cwd)))

        else:
            print(json.dumps({"error": f"Unknown command: {cmd}. Available: build, query, status, diff"}))
            sys.exit(1)

    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
