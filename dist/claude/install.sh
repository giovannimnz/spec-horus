#!/usr/bin/env bash
# Horus Spec Driven — Claude Code Installer v5.0
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SD=${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills
AD=${CLAUDE_CONFIG_DIR:-$HOME/.claude}/agents
echo "Installing HSD v5.0 for Claude Code..."
mkdir -p "$SD" "$AD"
cp -r "$SCRIPT_DIR"/skills/hsd/* "$SD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
echo "✓ $(find "$SCRIPT_DIR"/skills/hsd -mindepth 1 -maxdepth 1 -type d | wc -l) skills installed"
