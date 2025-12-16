import { calculateGridWidth, generateGridBackground } from '@/utils/css-generator';
import { useEffect, useState } from 'react';

import { GridSettings } from '@/types/grid';

interface GridOverlayProps {
  settings: GridSettings;
  containerElement: HTMLElement;
}

export function GridOverlay({ settings, containerElement }: GridOverlayProps) {
  const [viewportSize, setViewportSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!containerElement || !settings.visible) return;

    const backgroundImage = generateGridBackground(settings);

    // Calculate viewport dimensions - use clientWidth to exclude scrollbar
    // This is critical: clientWidth doesn't include scrollbar, innerWidth does
    const availableWidth = document.documentElement.clientWidth || window.innerWidth;
    const availableHeight = document.documentElement.clientHeight || window.innerHeight;

    const gridWidth = calculateGridWidth(
      availableWidth,
      settings.baseLine,
      settings.innerColumnWidth
    );

    // SIMPLE APPROACH: Just position the grid element
    const gridWidthNum = parseFloat(gridWidth);
    
    // Use offsets directly - allow them to be any value
    const clampedOffsetX = settings.offsetX;
    const clampedOffsetY = settings.offsetY;

    // Calculate visible width: how much of the grid is actually visible in viewport
    // If offsetX is negative, grid starts off-screen to the left
    // If offsetX + gridWidth > viewportWidth, grid extends off-screen to the right
    const gridRightEdge = clampedOffsetX + gridWidthNum;
    const visibleLeft = Math.max(0, clampedOffsetX);
    const visibleRight = Math.min(availableWidth, gridRightEdge);
    const visibleWidth = Math.max(0, visibleRight - visibleLeft);
    
    // Position and size the element to show only the visible portion
    const finalLeft = visibleLeft;
    const finalGridWidth = visibleWidth > 0 ? visibleWidth : gridWidthNum; // Fallback to full width if calculation fails

    // Apply styles directly to the container element (like Angular Elements does)
    containerElement.style.backgroundImage = backgroundImage;
    containerElement.style.width = `${finalGridWidth}px`;
    containerElement.style.height = `${availableHeight}px`;
    containerElement.style.position = 'fixed'; // Fixed to viewport
    containerElement.style.left = `${finalLeft}px`;
    containerElement.style.top = `${clampedOffsetY}px`;
    containerElement.style.zIndex = settings.zIndex.toString();
    containerElement.style.transform = 'translate3d(0px, 0px, 0px)';
    containerElement.style.display = 'block';
    // Use background-position to shift the background to match the offset
    // This way the element stays within bounds but the grid pattern shifts
    const bgOffsetX = clampedOffsetX - finalLeft;
    containerElement.style.backgroundPosition = `${bgOffsetX}px 0`;
    containerElement.style.backgroundRepeat = 'no-repeat';
    containerElement.style.backgroundSize = `${gridWidthNum}px ${availableHeight}px`;
    // Ensure grid doesn't exceed viewport
    containerElement.style.maxWidth = `${availableWidth}px`;
    containerElement.style.maxHeight = `${availableHeight}px`;
    containerElement.style.overflow = 'hidden';
    containerElement.style.boxSizing = 'border-box';
  }, [settings, viewportSize, containerElement]);

  // Inject global styles for nx-grid-overlay element
  useEffect(() => {
    if (!document.getElementById('nx-grid-overlay-styles')) {
      const style = document.createElement('style');
      style.id = 'nx-grid-overlay-styles';
      style.textContent = `
        nx-grid-overlay {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          margin: 0;
          padding: 0;
          content: '';
          background-size: 100% 100%;
          z-index: 1000;
          pointer-events: none;
          box-sizing: border-box;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  // No body/html manipulation - keep it simple

  return null; // No JSX needed, we're styling the container element directly
}
