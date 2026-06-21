#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OCR_SCRIPT_PATH="$SCRIPT_DIR/ocr_check.swift"

APP_NAME="${APP_NAME:-okta verify}"
CONNECT_TEXT="${CONNECT_TEXT:-연결}"
RETRY_TEXT="${RETRY_TEXT:-다시 시도}"
CONFIRM_TEXT="${CONFIRM_TEXT:-본인입니다}"
OCR_ATTEMPTS="${OCR_ATTEMPTS:-2}"
OCR_INTERVAL_SECONDS="${OCR_INTERVAL_SECONDS:-1}"
HOME_ATTEMPTS="${HOME_ATTEMPTS:-3}"
PROMPT_ATTEMPTS="${PROMPT_ATTEMPTS:-2}"
CONNECT_BUTTON_X_RATIO="${CONNECT_BUTTON_X_RATIO:-0.500}"
CONNECT_BUTTON_Y_RATIO="${CONNECT_BUTTON_Y_RATIO:-0.626}"
HOME_APP_X_RATIO="${HOME_APP_X_RATIO:-0.164}"
HOME_APP_Y_RATIO="${HOME_APP_Y_RATIO:-0.148}"

DATE_SUFFIX="$(date +%Y%m%d-%H%M%S)"
SCREENSHOT_PATH="$(mktemp "/tmp/iphone-mirroring-ocr-${DATE_SUFFIX}.png")"

get_mirroring_window_info() {
    swift - <<'SWIFT'
import CoreGraphics
import Foundation

guard let windows = CGWindowListCopyWindowInfo([.optionOnScreenOnly], kCGNullWindowID) as? [[String: Any]] else {
    exit(1)
}

for window in windows {
    guard let ownerName = window[kCGWindowOwnerName as String] as? String,
          let windowName = window[kCGWindowName as String] as? String,
          (ownerName.contains("iPhone") || windowName.contains("iPhone")),
          let windowID = window[kCGWindowNumber as String] as? Int,
          let bounds = window[kCGWindowBounds as String] as? [String: Any],
          let x = bounds["X"] as? Double,
          let y = bounds["Y"] as? Double,
          let width = bounds["Width"] as? Double,
          let height = bounds["Height"] as? Double else {
        continue
    }

    print("\(windowID),\(Int(x.rounded())),\(Int(y.rounded())),\(Int(width.rounded())),\(Int(height.rounded()))")
    exit(0)
}

exit(1)
SWIFT
}

get_mirroring_window_rect() {
    local window_info
    window_info="$(get_mirroring_window_info)"
    IFS=',' read -r _ x_pos y_pos win_width win_height <<<"$window_info"
    printf '%s,%s,%s,%s\n' "$x_pos" "$y_pos" "$win_width" "$win_height"
}

capture_mirroring_window() {
    local window_info
    local window_id
    local rect
    window_info="$(get_mirroring_window_info)"
    IFS=',' read -r window_id x_pos y_pos win_width win_height <<<"$window_info"
    rect="${x_pos},${y_pos},${win_width},${win_height}"

    if [[ -z "${window_id:-}" ]]; then
        printf 'Failed to resolve iPhone Mirroring window ID.\n' >&2
        return 1
    fi

    echo "${rect}"

    screencapture -x -o -l"$window_id" "$SCREENSHOT_PATH"
}

ocr_contains_app_name() {
    local output="$(swift "$OCR_SCRIPT_PATH" "$SCREENSHOT_PATH" "$APP_NAME")"
    echo "$output"
}

ocr_dump_text() {
    swift "$OCR_SCRIPT_PATH" "$SCREENSHOT_PATH" "__dump__"
}

find_text_center() {
    local needle="$1"
    local output

    if output="$(swift "$OCR_SCRIPT_PATH" "$SCREENSHOT_PATH" "$needle" --center 2>/dev/null)"; then
        echo "$output"
        return 0
    fi

    return 1
}

click_at() {
    local x="$1"
    local y="$2"

    cliclick "m:${x},${y}" "c:${x},${y}"
}

click_top_left_home_app() {
    local rect
    local x_pos
    local y_pos
    local win_width
    local win_height
    local click_x
    local click_y

    rect="$(get_mirroring_window_rect)"
    IFS=',' read -r x_pos y_pos win_width win_height <<<"$rect"

    click_x="$(awk -v x="$x_pos" -v width="$win_width" -v ratio="$HOME_APP_X_RATIO" 'BEGIN { printf "%.0f", x + (width * ratio) }')"
    click_y="$(awk -v y="$y_pos" -v height="$win_height" -v ratio="$HOME_APP_Y_RATIO" 'BEGIN { printf "%.0f", y + (height * ratio) }')"

    click_at "$click_x" "$click_y"
}

click_connect_button() {
    local rect
    local x_pos
    local y_pos
    local win_width
    local win_height
    local click_x
    local click_y

    rect="$(get_mirroring_window_rect)"
    IFS=',' read -r x_pos y_pos win_width win_height <<<"$rect"

    click_x="$(awk -v x="$x_pos" -v width="$win_width" -v ratio="$CONNECT_BUTTON_X_RATIO" 'BEGIN { printf "%.0f", x + (width * ratio) }')"
    click_y="$(awk -v y="$y_pos" -v height="$win_height" -v ratio="$CONNECT_BUTTON_Y_RATIO" 'BEGIN { printf "%.0f", y + (height * ratio) }')"

    printf 'Clicking connect button at %s,%s.\n' "$click_x" "$click_y"
    click_at "$click_x" "$click_y"
}

click_mirroring_window_center() {
    local rect
    local x_pos
    local y_pos
    local win_width
    local win_height
    local click_x
    local click_y

    rect="$(get_mirroring_window_rect)"
    IFS=',' read -r x_pos y_pos win_width win_height <<<"$rect"

    click_x="$((x_pos + (win_width / 2)))"
    click_y="$((y_pos + (win_height / 2)))"

    click_at "$click_x" "$click_y"
}

click_text_if_present() {
    local needle="$1"
    local rect
    local window_x
    local window_y
    local win_width
    local win_height
    local text_center
    local text_x
    local text_y
    local click_x
    local click_y

    capture_mirroring_window >/dev/null

    if ! text_center="$(find_text_center "$needle")"; then
        return 1
    fi

    rect="$(get_mirroring_window_rect)"
    IFS=',' read -r window_x window_y win_width win_height <<<"$rect"
    IFS=',' read -r text_x text_y <<<"$text_center"

    click_x="$((window_x + text_x))"
    click_y="$((window_y + text_y))"

    printf 'Clicking "%s" at %s,%s.\n' "$needle" "$click_x" "$click_y"
    click_at "$click_x" "$click_y"
    return 0
}

handle_connection_prompts() {
    local attempt
    local clicked=1
    local output

    for ((attempt = 1; attempt <= PROMPT_ATTEMPTS; attempt++)); do
        capture_mirroring_window >/dev/null
        output="$(ocr_dump_text)"
        printf 'OCR output on prompt attempt %d:\n%s\n' "$attempt" "$output"

        if click_text_if_present "$CONNECT_TEXT"; then
            clicked=0
            sleep 1
            continue
        fi

        if click_text_if_present "$RETRY_TEXT"; then
            clicked=0
            sleep 1
        fi
    done

    return "$clicked"
}

go_to_home_screen() {
    local attempt

    for ((attempt = 1; attempt <= HOME_ATTEMPTS; attempt++)); do
        click_mirroring_window_center

        osascript <<'APPLESCRIPT'
tell application "System Events"
    tell process "iPhone Mirroring"
        set frontmost to true
    end tell

    keystroke "1" using command down
    delay 0.8
    keystroke "1" using command down
    delay 0.8
end tell
APPLESCRIPT
    done
}

wait_for_app_name_in_window() {
    local attempt
    local output
    local expected_text="${APP_NAME}"

    for ((attempt = 1; attempt <= OCR_ATTEMPTS; attempt++)); do
        capture_mirroring_window

        output="$(ocr_contains_app_name)"

        echo "${output}"

        if [[ "$output" == *"$expected_text"* ]]; then
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
tell application "iPhone Mirroring"
    activate
end tell

delay 1.5
end run
APPLESCRIPT

if handle_connection_prompts; then
    go_to_home_screen
    click_top_left_home_app
fi

wait_for_app_name_in_window
sleep 1

if ! click_text_if_present "$CONFIRM_TEXT"; then
    printf 'Failed to find "%s" in iPhone Mirroring.\n' "$CONFIRM_TEXT" >&2
    exit 1
fi
