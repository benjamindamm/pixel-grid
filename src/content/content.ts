import { GridOverlay } from './GridOverlay';
import { GridSettings } from '@/types/grid';
import React from 'react';
import { createRoot } from 'react-dom/client';

const TAG_NAME = 'nx-grid-overlay';

// Store React roots for cleanup
const reactRoots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();

// Function to create and insert grid overlay
function createGridOverlay(settings: GridSettings) {
  console.log('createGridOverlay called with:', settings);
  
  // If grid should not be visible, remove it if it exists
  if (!settings.visible) {
    console.log('Grid not visible, removing if exists');
    const existing = document.getElementById(TAG_NAME);
    
    if (existing && existing.parentNode) {
      console.log('Removing existing overlay');
      const root = reactRoots.get(existing);
      if (root) {
        root.unmount();
        reactRoots.delete(existing);
      }
      existing.parentNode.removeChild(existing);
    }
    return;
  }

  // Remove existing overlay first (before creating new one)
  const existing = document.getElementById(TAG_NAME);
  
  if (existing && existing.parentNode) {
    console.log('Removing existing overlay before creating new one');
    const root = reactRoots.get(existing);
    if (root) {
      root.unmount();
      reactRoots.delete(existing);
    }
    existing.parentNode.removeChild(existing);
  }

  console.log('Creating new grid overlay element');
  
  // Create container element (like the old extension)
  const container = document.createElement(TAG_NAME);
  container.id = TAG_NAME;
  container.setAttribute('base-line', settings.baseLine);
  container.setAttribute('inner-column-width', settings.innerColumnWidth);
  container.setAttribute('outer-column-width', settings.outerColumnWidth);
  container.setAttribute('color', settings.color);
  container.setAttribute('alpha', (settings.alpha / 100).toString());
  container.setAttribute('offset-x', `${settings.offsetX}px`);
  container.setAttribute('offset-y', `${settings.offsetY}px`);
  container.setAttribute('z-index', settings.zIndex.toString());
  container.setAttribute('visible', settings.visible.toString());
  
  console.log('Container element created:', container);
  console.log('document.body exists:', !!document.body);
  
  // Append directly to body (like the old extension)
  // SIMPLE APPROACH: Just append the grid, don't manipulate body/html
  if (document.body) {
    document.body.appendChild(container);
    console.log('Container appended to body. Body children:', document.body.children.length);
    console.log('Container in DOM:', document.body.contains(container));
  } else {
    console.error('document.body is not available!');
    return;
  }
  
  // Render React component - it will apply styles to the container element itself
  try {
    const root = createRoot(container);
    reactRoots.set(container, root);
    root.render(React.createElement(GridOverlay, { settings, containerElement: container }));
    console.log('React component rendered successfully');
  } catch (error) {
    console.error('Error rendering React component:', error);
  }
}

// Ensure DOM is ready
function ensureBodyReady(callback: () => void) {
  if (document.body) {
    callback();
  } else {
    // Wait for body to be available
    const observer = new MutationObserver((_mutations, obs) => {
      if (document.body) {
        obs.disconnect();
        callback();
      }
    });
    observer.observe(document.documentElement, { childList: true });
    
    // Timeout fallback
    setTimeout(() => {
      if (document.body) {
        observer.disconnect();
        callback();
      }
    }, 1000);
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((settings: GridSettings, _sender, sendResponse) => {
  console.log('Content script received message:', settings);
  
  ensureBodyReady(() => {
    createGridOverlay(settings);
  });
  
  sendResponse({ success: true });
  return true; // Important for async response
});

// Log that content script is loaded (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('Pixel Grid content script loaded at', new Date().toISOString());
}
