#!/usr/bin/env swift

import AppKit
import ApplicationServices
import Foundation

guard let application = NSWorkspace.shared.frontmostApplication else {
    fputs("failed to resolve frontmost application\n", stderr)
    exit(2)
}

let ownerPid = Int32(application.processIdentifier)
let ownerName = application.localizedName ?? ""

var focusedWindowName = ""
let appElement = AXUIElementCreateApplication(ownerPid)

func readWindowTitle(_ window: AXUIElement) -> String {
    var titleValue: CFTypeRef?
    if AXUIElementCopyAttributeValue(window, kAXTitleAttribute as CFString, &titleValue) == .success {
        return titleValue as? String ?? ""
    }
    return ""
}

var focusedValue: CFTypeRef?
if AXUIElementCopyAttributeValue(appElement, kAXFocusedWindowAttribute as CFString, &focusedValue) == .success,
   let focusedWindow = focusedValue {
    focusedWindowName = readWindowTitle(unsafeBitCast(focusedWindow, to: AXUIElement.self))
} else {
    var mainValue: CFTypeRef?
    if AXUIElementCopyAttributeValue(appElement, kAXMainWindowAttribute as CFString, &mainValue) == .success,
       let mainWindow = mainValue {
        focusedWindowName = readWindowTitle(unsafeBitCast(mainWindow, to: AXUIElement.self))
    }
}

print("ownerPid=\(ownerPid)")
print("ownerName=\(ownerName)")
print("windowName=\(focusedWindowName)")
