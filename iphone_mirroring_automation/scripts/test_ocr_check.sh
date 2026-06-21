#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
FIXTURE_DIR="$REPO_DIR/iphone_mirroring_automation/ocr-fixtures"
OCR_SCRIPT="$REPO_DIR/iphone_mirroring_automation/ocr_check.swift"

assert() {
    local output
    local fixture_path="$1"
    local expected_text="$2"

    output="$(swift "$OCR_SCRIPT" "$fixture_path" Okta)"

    if [[ "$output" == *"$expected_text"* ]]; then
      printf '"%s" include "%s".\n' "${fixture_path}" "$expected_text" >&2
    else
      printf '"%s" not include "%s".\n' "${fixture_path}" "$expected_text" >&2
    fi
}

assert "$FIXTURE_DIR/okta_present.png" "okta"
assert "$FIXTURE_DIR/okta_absent.png" "okta"
