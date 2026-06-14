#!/usr/bin/env bash
# Horus Spec Driven — Gemini CLI Installer v5.0
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CD=${GEMINI_CONFIG_DIR:-$HOME/.gemini}/commands/hsd
AD=${GEMINI_CONFIG_DIR:-$HOME/.gemini}/agents
echo "Installing HSD v5.0 for Gemini CLI..."
mkdir -p "$CD" "$AD"
cp "$SCRIPT_DIR"/commands/hsd/*.toml "$CD/"
cp "$SCRIPT_DIR"/agents/*.toml "$AD/" 2>/dev/null || true
echo "✓ $(ls "$SCRIPT_DIR"/commands/hsd/ | wc -l) commands installed"
