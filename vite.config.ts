import { copyFileSync, existsSync } from 'fs';

import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const isContentScript = process.env.BUILD_TARGET === 'content';
  
  return {
    base: './', // Use relative paths for Chrome Extension
    plugins: [
      react(),
      {
        name: 'copy-manifest',
        closeBundle() {
          copyFileSync('manifest.json', 'dist/manifest.json');
          // Only copy icon if it exists (check root first, then chrome-extension)
          if (existsSync('icon.png')) {
            copyFileSync('icon.png', 'dist/icon.png');
          } else if (existsSync('chrome-extension/icon.png')) {
            copyFileSync('chrome-extension/icon.png', 'dist/icon.png');
          } else if (existsSync('public/icon.png')) {
            copyFileSync('public/icon.png', 'dist/icon.png');
          }
        },
      },
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: !isContentScript, // Don't empty dist when building content script
      rollupOptions: {
        input: isContentScript
          ? path.resolve(__dirname, 'src/content/content.ts')
          : path.resolve(__dirname, 'popup.html'),
        output: isContentScript
          ? {
              // Content script: IIFE format, all inline
              entryFileNames: 'content.js',
              format: 'iife',
              name: 'PixelGridContent',
              inlineDynamicImports: true,
            }
          : {
              // Popup: ES modules
              entryFileNames: 'assets/[name].js',
              chunkFileNames: 'assets/[name].js',
              assetFileNames: (assetInfo) => {
                if (assetInfo.name === 'popup.html') {
                  return 'popup.html';
                }
                if (assetInfo.name?.endsWith('.css')) {
                  return 'assets/[name].[ext]';
                }
                return 'assets/[name]-[hash].[ext]';
              },
            },
      },
      copyPublicDir: false,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
