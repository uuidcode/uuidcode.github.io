#!/usr/bin/env swift

import CoreGraphics
import Foundation

let args = CommandLine.arguments
guard args.count >= 3,
      let x = Double(args[1]),
      let y = Double(args[2]) else {
    fputs("usage: window_rect_at_point.swift <x> <y> [exclude-owner-pid]\n", stderr)
    exit(2)
}

let point = CGPoint(x: x, y: y)
let excludedOwnerPid = args.count >= 4 ? Int32(args[3]) : nil

guard let windows = CGWindowListCopyWindowInfo([.optionOnScreenOnly], kCGNullWindowID) as? [[String: Any]] else {
    fputs("failed to read window list\n", stderr)
    exit(3)
}

struct WindowCandidate {
    let window: [String: Any]
    let rect: CGRect
    let ownerPid: Int32
    let ownerName: String
    let layer: Int
}

func buildCandidates(excludingOwnerPid: Int32?) -> [WindowCandidate] {
    windows.compactMap { window -> WindowCandidate? in
        guard let boundsDict = window[kCGWindowBounds as String] as? [String: Any],
              let rect = CGRect(dictionaryRepresentation: boundsDict as CFDictionary),
              rect.width > 1,
              rect.height > 1,
              rect.contains(point) else {
            return nil
        }

        let ownerPid = (window[kCGWindowOwnerPID as String] as? NSNumber)?.int32Value ?? 0
        if let excludedOwnerPid = excludingOwnerPid, ownerPid == excludedOwnerPid {
            return nil
        }

        let alpha = (window[kCGWindowAlpha as String] as? NSNumber)?.doubleValue ?? 1.0
        if alpha <= 0.01 {
            return nil
        }

        let isOnscreen = (window[kCGWindowIsOnscreen as String] as? NSNumber)?.boolValue ?? true
        if !isOnscreen {
            return nil
        }

        let ownerName = window[kCGWindowOwnerName as String] as? String ?? ""
        if ownerName == "Window Server" {
            return nil
        }

        let layer = (window[kCGWindowLayer as String] as? NSNumber)?.intValue ?? 0

        return WindowCandidate(
            window: window,
            rect: rect,
            ownerPid: ownerPid,
            ownerName: ownerName,
            layer: layer
        )
    }
}

var candidates = buildCandidates(excludingOwnerPid: excludedOwnerPid)
if candidates.isEmpty, excludedOwnerPid != nil {
    candidates = buildCandidates(excludingOwnerPid: nil)
}

let selectedCandidate = candidates.first(where: { $0.layer == 0 }) ?? candidates.first

if let candidate = selectedCandidate {
    let window = candidate.window
    let rect = candidate.rect
    let ownerName = candidate.ownerName
    let windowName = window[kCGWindowName as String] as? String ?? ""
    let windowID = window[kCGWindowNumber as String] as? Int ?? 0

    print("windowID=\(windowID)")
    print("ownerName=\(ownerName)")
    print("windowName=\(windowName)")
    print("ownerPid=\(candidate.ownerPid)")
    print("layer=\(candidate.layer)")
    print("x=\(Int(rect.origin.x.rounded()))")
    print("y=\(Int(rect.origin.y.rounded()))")
    print("width=\(Int(rect.width.rounded()))")
    print("height=\(Int(rect.height.rounded()))")
    exit(0)
}

fputs("no window contains point (\(Int(x.rounded())), \(Int(y.rounded())))\n", stderr)
exit(1)
