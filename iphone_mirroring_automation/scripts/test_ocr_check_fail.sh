#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
FIXTURE_PATH="$REPO_DIR/iphone_mirroring_automation/ocr-fixtures/okta_absent.png"
OCR_SCRIPT="$REPO_DIR/iphone_mirroring_automation/ocr_check.swift"

swift "$OCR_SCRIPT" "$FIXTURE_PATH" Okta
