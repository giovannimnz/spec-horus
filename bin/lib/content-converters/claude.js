'use strict';

/**
 * Claude Code content converter
 *
 * Adapts gsd-core upstream markdown for Anthropic Claude Code.
 *
 * This is mostly a passthrough — gsd-core IS Claude-Code-native — but we
 * still apply:
 *   - `subagent_type: gsd-X` → `@agents/gsd-X.md#gsd-X` (neutralize for horus-spec-driven
 *     multi-runtime compatibility; Claude Code's Task tool still understands the
 *     original form, but the neutralized form works as a stable link)
 *   - `Claude Code` branding → keep
 *   - `CLAUDE.md` → keep
 *   - `~/.claude/` → keep
 *   - `gsd:foo` → `gsd-foo` (Claude registers under hyphen)
 *
 * The upstream gsd-core does NOT touch Claude content beyond this. We
 * follow the same minimal-rewrite approach.
 */

const { transformContentToHyphen, neutralizeAgentReferences } = require('./shared.js');

function convertClaudeMarkdown(content, cmdNames) {
  if (!content) return content;
  let c = content;

  // Path rewrites: upstream gsd-core references its own install location
  // (`~/.claude/gsd-core/...` or `$HOME/.claude/gsd-core/...`). These
  // are PATHS to the upstream vendor dir, not the user's runtime config.
  // In horus-spec-driven, the vendor is at `modules/gsd-core/` in the horus-spec-driven
  // repo, not at `~/.claude/gsd-core/`. Rewrite to point at the rebadged
  // skill that ships with horus-spec-driven.
  c = c.replace(/@?~\/\.claude\/gsd-core\/workflows\//g, '~/.claude/skills/');
  c = c.replace(/@?\$HOME\/\.claude\/gsd-core\/workflows\//g, '$HOME/.claude/skills/');
  c = c.replace(/@?~\/\.claude\/gsd-core\/references\//g, '~/.claude/skills/');
  c = c.replace(/@?\$HOME\/\.claude\/gsd-core\/references\//g, '$HOME/.claude/skills/');
  c = c.replace(/@?~\/\.claude\/gsd-core\/templates\//g, '~/.claude/skills/');
  c = c.replace(/@?\$HOME\/\.claude\/gsd-core\/templates\//g, '$HOME/.claude/skills/');
  // Bare `~/.claude/gsd-core/...` (the gsd-tools binary path) — keep as a
  // vendor reference. Users who installed gsd-core upstream have this;
  // horus-spec-driven users will need to adjust if they want the gsd-tools CLI.

  // Colon→hyphen
  c = transformContentToHyphen(c, cmdNames);

  // Subagent neutralization
  c = neutralizeAgentReferences(c, 'agents/gsd-$1.md');

  return c;
}

module.exports = { convertClaudeMarkdown };
