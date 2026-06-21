#!/usr/bin/env swift

import AppKit
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
    fputs("usage: ocr_check.swift <image-path> <needle>\n", stderr)
    exit(2)
}

let imagePath = args[1]
let needle = args[2].lowercased()

guard let image = NSImage(contentsOfFile: imagePath) else {
    fputs("failed to load screenshot: \(imagePath)\n", stderr)
    exit(3)
}

var proposedRect = NSRect(origin: .zero, size: image.size)
let cgImage: CGImage
if let decodedImage = image.cgImage(forProposedRect: &proposedRect, context: nil, hints: nil) {
    cgImage = decodedImage
} else {
    fputs("failed to decode screenshot into cgImage\n", stderr)
    exit(4)
}

let request = VNRecognizeTextRequest()
request.recognitionLevel = .accurate
request.usesLanguageCorrection = true

let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

do {
    try handler.perform([request])
} catch {
    fputs("vision OCR failed: \(error)\n", stderr)
    exit(5)
}

let recognizedText = (request.results ?? [])
    .compactMap { $0.topCandidates(1).first?.string }
    .joined(separator: "\n")
    .lowercased()

print(recognizedText)
