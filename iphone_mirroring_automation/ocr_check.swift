#!/usr/bin/env swift

import AppKit
import Foundation
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
    fputs("usage: ocr_check.swift <image-path> <needle> [--center]\n", stderr)
    exit(2)
}

let imagePath = args[1]
let needle = args[2].lowercased()
let shouldPrintCenter = args.count >= 4 && args[3] == "--center"

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
request.recognitionLanguages = ["ko-KR", "en-US"]

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

if shouldPrintCenter {
    func screenCenterY(for observation: VNRecognizedTextObservation) -> CGFloat {
        (1 - observation.boundingBox.midY) * CGFloat(cgImage.height)
    }

    var exactMatches: [VNRecognizedTextObservation] = []
    var partialMatch: VNRecognizedTextObservation?
    var partialMatchLength = Int.max

    for observation in request.results ?? [] {
        guard let candidate = observation.topCandidates(1).first else {
            continue
        }

        let text = candidate.string.lowercased()

        if text == needle {
            exactMatches.append(observation)
            continue
        }

        if !text.contains(needle) {
            continue
        }

        if text.count < partialMatchLength {
            partialMatch = observation
            partialMatchLength = text.count
        }
    }

    let selectedExactMatch = exactMatches.max { lhs, rhs in
        screenCenterY(for: lhs) < screenCenterY(for: rhs)
    }

    if let observation = selectedExactMatch ?? partialMatch {
        let boundingBox = observation.boundingBox
        let centerX = Int((boundingBox.midX * CGFloat(cgImage.width)).rounded())
        let centerY = Int(((1 - boundingBox.midY) * CGFloat(cgImage.height)).rounded())
        print("\(centerX),\(centerY)")
        exit(0)
    }

    exit(1)
}

print(recognizedText)
