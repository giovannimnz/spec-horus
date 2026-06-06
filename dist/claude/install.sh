#!/usr/bin/env bash
# Horus Spec Driven — Claude Code Installer v5.0
set -euo pipefail
SD=${HOME}/.claude/skills
echo "Installing HSD v5.0 for Claude Code..."
mkdir -p "$SD"
cp -r dist/claude/skills/hsd/* "$SD/"
echo "✓ $(find dist/claude/skills/hsd -mindepth 1 -maxdepth 1 -type d | wc -l) skills installed"
