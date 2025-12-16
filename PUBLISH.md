# Publishing to Chrome Web Store

## Prerequisites

- Chrome Web Store Developer Account ($5 one-time fee)
- [Developer Dashboard](https://chrome.google.com/webstore/devconsole)

## Steps

1. Build extension:
   ```bash
   npm run build
   ```

2. Create ZIP:
   ```bash
   cd dist && zip -r ../pixel-grid-extension.zip .
   ```

3. Upload to Chrome Web Store:
   - Go to Developer Dashboard
   - Click "New Item"
   - Upload ZIP file
   - Fill store listing (see below)
   - Submit for review

## Store Listing

**Name:** Pixel Grid

**Short Description:**
```
A pixel-perfect grid overlay for web development and design.
```

**Detailed Description:**
```
Pixel Grid displays a customizable measurement overlay on any webpage. Perfect for aligning elements, checking spacing, and ensuring pixel-perfect designs.

Features:
- Customizable grid dimensions
- Adjustable colors and opacity
- Offset controls for positioning
- Clean, modern interface
```

**Category:** Developer Tools

**Screenshots:** At least 1 required (1280x800 or 640x400)

**Privacy Policy:** Extension only stores settings locally, no external data collection.

## Updates

1. Update version in `manifest.json` and `package.json`
2. Build: `npm run build`
3. Upload new ZIP in Developer Dashboard
4. Describe changes in "What's new?" field

## Checklist

- [ ] Build successful
- [ ] Extension tested locally
- [ ] Version number updated
- [ ] Icon present
- [ ] Screenshots prepared
- [ ] Privacy Policy (if needed)
