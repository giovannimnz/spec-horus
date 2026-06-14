#!/usr/bin/env bash
# Horus Spec Driven — Hermes Agent Installer v5.0
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HD=${HERMES_HOME:-$HOME/.hermes}/skills/hsd
AD=${HERMES_HOME:-$HOME/.hermes}/agents
echo "Installing HSD v5.0 for Hermes Agent..."
mkdir -p "$HD" "$AD" "$HD/horus-sdk-hermes"
cp -r "$SCRIPT_DIR"/skills/hsd/* "$HD/"
cp "$SCRIPT_DIR"/agents/*.md "$AD/" 2>/dev/null || true
cp -r "$SCRIPT_DIR"/adapter/* "$HD/horus-sdk-hermes/" 2>/dev/null || true
echo "✓ $(find "$HD" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l) skills + agents installed"
echo "  Restart Hermes or run /reload_skills"
