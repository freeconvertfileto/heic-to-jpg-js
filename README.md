# HEIC to JPG Converter

Convert iPhone HEIC photos to JPEG format using the heic2any library, entirely in the browser.

**Live Demo:** https://file-converter-free.com/en/image-tools/heic-to-jpg-online

## How It Works

HEIC files are passed to `heic2any({ blob, toType: 'image/jpeg', quality })` where `quality` is a 0–1 value derived from a 1–100 slider. The heic2any library handles the HEIC/HEIF container decoding internally and returns a JPEG Blob. The quality slider lets users trade off file size against image quality. Multiple files are processed sequentially and can be downloaded individually or as a ZIP bundle.

## Features

- Converts HEIC/HEIF images to JPEG without server upload
- Quality slider (1–100) to control output JPEG compression
- Multi-file batch processing
- Individual download or ZIP bundle

## Browser APIs Used

- heic2any library for HEIC decoding
- Blob / URL.createObjectURL
- JSZip for batch downloads

## Code Structure

| File | Description |
|------|-------------|
| `heic-to-jpg.js` | IIFE — heic2any conversion, quality slider, multi-file batch download |

## Usage

| Element ID | Purpose |
|------------|---------|
| `dropZone` | Drag-and-drop target for HEIC files |
| `fileInput` | File picker input |
| `qualitySlider` | JPEG output quality (1–100) |
| `convertBtn` | Start conversion |
| `downloadBtn` | Download converted JPEG |

## License

MIT
