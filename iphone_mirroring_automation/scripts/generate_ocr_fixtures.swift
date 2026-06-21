#!/usr/bin/env swift

import AppKit
import Foundation

let args = CommandLine.arguments
let outputDirectory = args.count > 1 ? args[1] : FileManager.default.currentDirectoryPath
let outputURL = URL(fileURLWithPath: outputDirectory, isDirectory: true)

try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)

let canvasSize = NSSize(width: 900, height: 700)

func makeAttributes(size: CGFloat, weight: NSFont.Weight) -> [NSAttributedString.Key: Any] {
    [
        .font: NSFont.systemFont(ofSize: size, weight: weight),
        .foregroundColor: NSColor(calibratedWhite: 0.08, alpha: 1.0)
    ]
}

func drawCentered(_ text: String, y: CGFloat, attributes: [NSAttributedString.Key: Any], in image: NSImage) {
    let attributed = NSAttributedString(string: text, attributes: attributes)
    let textSize = attributed.size()
    let point = NSPoint(x: (image.size.width - textSize.width) / 2, y: y)
    attributed.draw(at: point)
}

func writeFixture(named fileName: String, primaryText: String, secondaryText: String) throws {
    let image = NSImage(size: canvasSize)
    image.lockFocus()

    NSColor.white.setFill()
    NSRect(origin: .zero, size: canvasSize).fill()

    let cardRect = NSRect(x: 90, y: 120, width: 720, height: 460)
    let cardPath = NSBezierPath(roundedRect: cardRect, xRadius: 36, yRadius: 36)
    NSColor(calibratedRed: 0.93, green: 0.95, blue: 0.98, alpha: 1.0).setFill()
    cardPath.fill()

    drawCentered("Search Results", y: 500, attributes: makeAttributes(size: 42, weight: .semibold), in: image)
    drawCentered(primaryText, y: 350, attributes: makeAttributes(size: 96, weight: .bold), in: image)
    drawCentered(secondaryText, y: 250, attributes: makeAttributes(size: 42, weight: .regular), in: image)

    image.unlockFocus()

    guard let tiffData = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: tiffData),
          let pngData = bitmap.representation(using: .png, properties: [:]) else {
        throw NSError(domain: "FixtureGeneration", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to encode PNG for \(fileName)"])
    }

    try pngData.write(to: outputURL.appendingPathComponent(fileName))
}

try writeFixture(named: "okta_present.png", primaryText: "Okta", secondaryText: "Verify")
try writeFixture(named: "okta_absent.png", primaryText: "Calendar", secondaryText: "Open")
