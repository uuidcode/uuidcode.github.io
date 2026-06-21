#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OCR_SCRIPT_PATH="$SCRIPT_DIR/ocr_check.swift"

APP_NAME="${APP_NAME:-Okta}"
OCR_ATTEMPTS="${OCR_ATTEMPTS:-8}"
OCR_INTERVAL_SECONDS="${OCR_INTERVAL_SECONDS:-1}"

SCREENSHOT_PATH="$(mktemp /tmp/iphone-mirroring-ocr-XXXXXX.png)"
trap 'rm -f "$SCREENSHOT_PATH"' EXIT

get_mirroring_window_rect() {
    osascript <<'APPLESCRIPT'
tell application "System Events"
    tell process "iPhone Mirroring"
        set {xPos, yPos} to position of window 1
        set {winWidth, winHeight} to size of window 1
        return (xPos as text) & "," & (yPos as text) & "," & (winWidth as text) & "," & (winHeight as text)
    end tell
end tell
APPLESCRIPT
}

capture_mirroring_window() {
    local rect
    rect="$(get_mirroring_window_rect)"
    screencapture -x -R"$rect" "$SCREENSHOT_PATH"
}

ocr_contains_app_name() {
    swift "$OCR_SCRIPT_PATH" "$SCREENSHOT_PATH" "$APP_NAME"
}

wait_for_app_name_in_window() {
    local attempt

    for ((attempt = 1; attempt <= OCR_ATTEMPTS; attempt++)); do
        capture_mirroring_window

        if ocr_contains_app_name >/dev/null; then
            printf 'Detected "%s" in iPhone Mirroring on attempt %d.\n' "$APP_NAME" "$attempt"
            return 0
        fi

        sleep "$OCR_INTERVAL_SECONDS"
    done

    printf 'Failed to detect "%s" in iPhone Mirroring after %d attempts.\n' "$APP_NAME" "$OCR_ATTEMPTS" >&2
    return 1
}

osascript - "$APP_NAME" <<'APPLESCRIPT'
on run argv
    set appName to item 1 of argv

tell application "iPhone Mirroring"
    activate
end tell

delay 1.5

tell application "System Events"
    tell process "iPhone Mirroring"
        set frontmost to true
    end tell

    -- Apple documents Command-1 as Home Screen and Command-3 as Spotlight in iPhone Mirroring.
    keystroke "1" using command down
    delay 1
    keystroke "3" using command down
    delay 1
    keystroke appName
    delay 1.2
    key code 125
    delay 0.3
    key code 36
end tell
end run
APPLESCRIPT

wait_for_app_name_in_window
