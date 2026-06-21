#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
FIXTURE_DIR="$REPO_DIR/iphone_mirroring_automation/ocr-fixtures"
OCR_SCRIPT="$REPO_DIR/iphone_mirroring_automation/ocr_image_json.swift"

fail() {
    local message="$1"
    printf 'FAIL: %s\n' "$message" >&2
    exit 1
}

assert_valid_json_shape() {
    local fixture_path="$1"
    local output

    output="$(swift "$OCR_SCRIPT" "$fixture_path")"

    jq -er '
        .imagePath != null
        and (.imageWidth | type == "number")
        and (.imageHeight | type == "number")
        and (.imageWidth > 0)
        and (.imageHeight > 0)
        and (.items | type == "array")
        and (.items | length > 0)
        and ([.items[] | (.text | type == "string") and (.rect.x >= 0) and (.rect.y >= 0) and (.rect.width > 0) and (.rect.height > 0)] | all)
    ' <<<"$output" >/dev/null || fail "invalid OCR JSON shape for $fixture_path"

    printf '"%s" produced valid OCR JSON.\n' "$fixture_path" >&2
}

assert_contains_text() {
    local fixture_path="$1"
    local expected_text="$2"
    local output

    output="$(swift "$OCR_SCRIPT" "$fixture_path")"

    jq -er --arg expected_text "$expected_text" '
        [.items[].text | ascii_downcase] | any(. == ($expected_text | ascii_downcase))
    ' <<<"$output" >/dev/null || fail "expected OCR text \"$expected_text\" in $fixture_path"

    printf '"%s" contains OCR text "%s".\n' "$fixture_path" "$expected_text" >&2
}

assert_not_contains_text() {
    local fixture_path="$1"
    local unexpected_text="$2"
    local output

    output="$(swift "$OCR_SCRIPT" "$fixture_path")"

    jq -er --arg unexpected_text "$unexpected_text" '
        [.items[].text | ascii_downcase] | any(. == ($unexpected_text | ascii_downcase)) | not
    ' <<<"$output" >/dev/null || fail "unexpected OCR text \"$unexpected_text\" found in $fixture_path"

    printf '"%s" does not contain OCR text "%s".\n' "$fixture_path" "$unexpected_text" >&2
}

assert_valid_json_shape "$FIXTURE_DIR/okta_present.png"
assert_valid_json_shape "$FIXTURE_DIR/okta_absent.png"
assert_contains_text "$FIXTURE_DIR/okta_present.png" "Okta1"
assert_not_contains_text "$FIXTURE_DIR/okta_absent.png" "Okta"
