#!/usr/bin/env swift

import AppKit
import ApplicationServices
import Foundation

let args = CommandLine.arguments
guard args.count >= 2, let ownerPid = Int32(args[1]) else {
    fputs("usage: bring_window_to_front.swift <owner-pid> [window-name]\n", stderr)
    exit(2)
}

let windowName = args.count >= 3 ? args[2] : nil

guard let application = NSRunningApplication(processIdentifier: pid_t(ownerPid)) else {
    fputs("failed to resolve running application for pid \(ownerPid)\n", stderr)
    exit(3)
}

application.unhide()
let activated = application.activate(options: [.activateAllWindows])
usleep(80_000)

var raised = false

if let windowName, !windowName.isEmpty {
    let appElement = AXUIElementCreateApplication(ownerPid)
    var windowsValue: CFTypeRef?
    let windowsResult = AXUIElementCopyAttributeValue(appElement, kAXWindowsAttribute as CFString, &windowsValue)

    if windowsResult == .success, let windows = windowsValue as? [AXUIElement] {
        for window in windows {
            var titleValue: CFTypeRef?
            let titleResult = AXUIElementCopyAttributeValue(window, kAXTitleAttribute as CFString, &titleValue)
            let title = titleValue as? String ?? ""

            if titleResult == .success && title == windowName {
                AXUIElementSetAttributeValue(window, kAXMainAttribute as CFString, kCFBooleanTrue)
                AXUIElementSetAttributeValue(window, kAXFocusedAttribute as CFString, kCFBooleanTrue)
                raised = AXUIElementPerformAction(window, kAXRaiseAction as CFString) == .success
                break
            }
        }
    }
}

if !activated && !raised {
    fputs("failed to activate application or raise window\n", stderr)
    exit(4)
}
