#!/bin/bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OCR_SCRIPT_PATH="$SCRIPT_DIR/ocr_check.swift"

CONFIRM_TEXT="${CONFIRM_TEXT:-본인입니다}"
CONFIRM_ALT_TEXT="${CONFIRM_ALT_TEXT:-본입입니다}"
DOMAIN_TEXT="${DOMAIN_TEXT:-kakao.okta.com}"
SEARCH_TEXT="${SEARCH_TEXT:-검색}"
OKTA_TEXT="${OKTA_TEXT:-okta}"
CONNECT_TEXT="${CONNECT_TEXT:-연결}"
RETRY_TEXT="${RETRY_TEXT:-다시 시도}"
STATE_ATTEMPTS="${STATE_ATTEMPTS:-2}"
STATE_INTERVAL_SECONDS="${STATE_INTERVAL_SECONDS:-1}"
FOLLOW_UP_DELAY_SECONDS="${FOLLOW_UP_DELAY_SECONDS:-2}"
PROMPT_CLICK_DELAY_SECONDS="${PROMPT_CLICK_DELAY_SECONDS:-5}"
SEARCH_RESULT_Y_OFFSET="${SEARCH_RESULT_Y_OFFSET:--50}"

DATE_SUFFIX="$(date +%Y%m%d-%H%M%S)"
SCREENSHOT_PATH="$(mktemp "/tmp/iphone-mirroring-ocr-${DATE_SUFFIX}.png")"
trap 'rm -f "$SCREENSHOT_PATH"' EXIT

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

    window_info="$(get_mirroring_window_info)"
    IFS=',' read -r window_id _ _ _ _ <<<"$window_info"

    if [[ -z "${window_id:-}" ]]; then
        printf 'Failed to resolve iPhone Mirroring window ID.\n' >&2
        return 1
    fi

    screencapture -x -o -l"$window_id" "$SCREENSHOT_PATH"
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

capture_and_log_ocr() {
    local label="$1"
    local output

    capture_mirroring_window
    output="$(ocr_dump_text)"
    printf 'OCR output on %s:\n%s\n' "$label" "$output" >&2
    printf '%s\n' "$output"
}

ocr_output_contains() {
    local output="$1"
    local needle="$2"

    [[ "$output" == *"$needle"* ]]
}

click_text_in_current_capture() {
    local needle="$1"
    local x_offset="${2:-0}"
    local y_offset="${3:-0}"
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

    if ! text_center="$(find_text_center "$needle")"; then
        return 1
    fi

    rect="$(get_mirroring_window_rect)"
    IFS=',' read -r window_x window_y win_width win_height <<<"$rect"
    IFS=',' read -r text_x text_y <<<"$text_center"

    click_x="$((window_x + text_x + x_offset))"
    click_y="$((window_y + text_y + y_offset))"

    printf 'Clicking "%s" at %s,%s.\n' "$needle" "$click_x" "$click_y"
    click_at "$click_x" "$click_y"
    return 0
}

click_confirm_in_current_capture() {
    if click_text_in_current_capture "$CONFIRM_TEXT"; then
        return 0
    fi

    if [[ "$CONFIRM_ALT_TEXT" != "$CONFIRM_TEXT" ]] && click_text_in_current_capture "$CONFIRM_ALT_TEXT"; then
        return 0
    fi

    return 1
}

ocr_output_has_confirm() {
    local output="$1"

    if ocr_output_contains "$output" "$CONFIRM_TEXT"; then
        return 0
    fi

    if [[ "$CONFIRM_ALT_TEXT" != "$CONFIRM_TEXT" ]] && ocr_output_contains "$output" "$CONFIRM_ALT_TEXT"; then
        return 0
    fi

    return 1
}

run_state_flow() {
    local attempt
    local output

    for ((attempt = 1; attempt <= STATE_ATTEMPTS; attempt++)); do
        output="$(capture_and_log_ocr "state attempt ${attempt}")"

        if ocr_output_has_confirm "$output" && click_confirm_in_current_capture; then
            return 0
        fi

        if ocr_output_contains "$output" "$DOMAIN_TEXT"; then
            sleep "$FOLLOW_UP_DELAY_SECONDS"
            output="$(capture_and_log_ocr "\"$DOMAIN_TEXT\" follow-up attempt ${attempt}")"

            if ocr_output_has_confirm "$output" && click_confirm_in_current_capture; then
                return 0
            fi

            if ocr_output_contains "$output" "$SEARCH_TEXT"; then
                if click_text_in_current_capture "$OKTA_TEXT" 0 "$SEARCH_RESULT_Y_OFFSET"; then
                    sleep "$FOLLOW_UP_DELAY_SECONDS"
                    output="$(capture_and_log_ocr "\"$OKTA_TEXT\" follow-up attempt ${attempt}")"

                    if ocr_output_has_confirm "$output" && click_confirm_in_current_capture; then
                        return 0
                    fi
                fi

                continue
            fi

            if ocr_output_contains "$output" "$CONNECT_TEXT"; then
                if click_text_in_current_capture "$CONNECT_TEXT"; then
                    sleep "$PROMPT_CLICK_DELAY_SECONDS"
                fi

                continue
            fi

            if ocr_output_contains "$output" "$RETRY_TEXT"; then
                if click_text_in_current_capture "$RETRY_TEXT"; then
                    sleep "$PROMPT_CLICK_DELAY_SECONDS"
                fi

                continue
            fi

            sleep "$STATE_INTERVAL_SECONDS"
            continue
        fi

        if ocr_output_contains "$output" "$SEARCH_TEXT"; then
            if click_text_in_current_capture "$OKTA_TEXT" 0 "$SEARCH_RESULT_Y_OFFSET"; then
                sleep "$FOLLOW_UP_DELAY_SECONDS"
                output="$(capture_and_log_ocr "\"$OKTA_TEXT\" follow-up attempt ${attempt}")"

                if ocr_output_has_confirm "$output" && click_confirm_in_current_capture; then
                    return 0
                fi
            fi

            continue
        fi

        if ocr_output_contains "$output" "$CONNECT_TEXT"; then
            if click_text_in_current_capture "$CONNECT_TEXT"; then
                sleep "$PROMPT_CLICK_DELAY_SECONDS"
            fi

            continue
        fi

        if ocr_output_contains "$output" "$RETRY_TEXT"; then
            if click_text_in_current_capture "$RETRY_TEXT"; then
                sleep "$PROMPT_CLICK_DELAY_SECONDS"
            fi

            continue
        fi

        sleep "$STATE_INTERVAL_SECONDS"
    done

    printf 'Failed to complete iPhone Mirroring OCR flow after %d attempts.\n' "$STATE_ATTEMPTS" >&2
    return 1
}

osascript <<'APPLESCRIPT'
tell application "iPhone Mirroring"
    activate
end tell

delay 1.5
APPLESCRIPT

run_state_flow
