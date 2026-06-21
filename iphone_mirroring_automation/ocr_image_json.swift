#!/usr/bin/env swift

import AppKit
import Foundation
import Vision

struct OcrRect: Encodable {
    let x: Int
    let y: Int
    let width: Int
    let height: Int
}

struct OcrItem: Encodable {
    let text: String
    let rect: OcrRect
}

struct OcrResult: Encodable {
    let imagePath: String
    let imageWidth: Int
    let imageHeight: Int
    let originalText: String
    let items: [OcrItem]
}

let args = CommandLine.arguments
guard args.count >= 2 else {
    fputs("usage: ocr_image_json.swift <image-path>\n", stderr)
    exit(2)
}

let imagePath = args[1]

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

let items = (request.results ?? []).compactMap { observation -> OcrItem? in
    guard let candidate = observation.topCandidates(1).first else {
        return nil
    }

    let boundingBox = observation.boundingBox
    let x = Int((boundingBox.minX * CGFloat(cgImage.width)).rounded())
    let y = Int(((1 - boundingBox.maxY) * CGFloat(cgImage.height)).rounded())
    let width = Int((boundingBox.width * CGFloat(cgImage.width)).rounded())
    let height = Int((boundingBox.height * CGFloat(cgImage.height)).rounded())

    return OcrItem(
        text: candidate.string,
        rect: OcrRect(x: x, y: y, width: width, height: height)
    )
}

let originalText = items.map { $0.text }.joined(separator: "\n")

let result = OcrResult(
    imagePath: imagePath,
    imageWidth: cgImage.width,
    imageHeight: cgImage.height,
    originalText: originalText,
    items: items
)

let encoder = JSONEncoder()
encoder.outputFormatting = [.sortedKeys]

do {
    let data = try encoder.encode(result)
    FileHandle.standardOutput.write(data)
} catch {
    fputs("failed to encode OCR JSON: \(error)\n", stderr)
    exit(6)
}
