# Pixel Grid

A pixel-perfect grid overlay Chrome Extension for web development.

## Features

- Customizable grid dimensions (baseline, column widths)
- Adjustable colors and opacity
- Offset controls for positioning
- iOS-style interface
- Works on any website

## Installation

### Development

```bash
npm install
npm run build
```

Load `dist/` directory in Chrome (`chrome://extensions/` → Developer mode → Load unpacked).

## Development

```bash
npm run build          # Build extension
npm run build:popup    # Build popup only
npm run build:content  # Build content script only
npm run dev            # Development server
```

## Project Structure

```
src/
├── popup/          # Popup UI (React)
├── content/        # Content script (React)
├── components/     # Shared components
├── hooks/          # React hooks
├── types/          # TypeScript types
└── utils/          # Utilities
```

## Publishing

See `PUBLISH.md` for Chrome Web Store publishing instructions.

## FAQ

**Does Pixel Grid collect data?**  
No. Settings are stored locally only (`chrome.storage.local`).

**What permissions are needed?**  
`activeTab` (inject overlay) and `storage` (save settings).

**Why scrollbars appear?**  
Known limitation. Grid element stays within viewport bounds.

**Can I use it on local files?**  
Yes, works on `http://`, `https://`, and `file://` URLs.

## Tech Stack

- React 18, TypeScript, Vite
- Tailwind CSS, shadcn/ui
- Chrome Extension Manifest V3

## License

[Add license]

## Credits

by Benjamin Damm
