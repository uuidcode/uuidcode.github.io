#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
FIXTURE_DIR="$REPO_DIR/iphone_mirroring_automation/ocr-fixtures"
GENERATOR_SCRIPT="$REPO_DIR/iphone_mirroring_automation/scripts/generate_ocr_fixtures.swift"

swift "$GENERATOR_SCRIPT" "$FIXTURE_DIR"

printf 'OCR fixtures generated in %s\n' "$FIXTURE_DIR"
