#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BIN_DIR="$SCRIPT_DIR/bin"

mkdir -p "$BIN_DIR"

swiftc -O "$SCRIPT_DIR/window_rect_at_point.swift" -o "$BIN_DIR/window_rect_at_point"
swiftc -O "$SCRIPT_DIR/bring_window_to_front.swift" -o "$BIN_DIR/bring_window_to_front"
swiftc -O "$SCRIPT_DIR/get_frontmost_window.swift" -o "$BIN_DIR/get_frontmost_window"

chmod +x \
  "$BIN_DIR/window_rect_at_point" \
  "$BIN_DIR/bring_window_to_front" \
  "$BIN_DIR/get_frontmost_window"

echo "Built native helpers in $BIN_DIR"
