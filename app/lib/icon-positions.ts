interface IconPosition {
  x: number;  // Offset from tile center, in pixels
  y: number;  // Offset from tile center, in pixels
}

type IconLayout = IconPosition[];

// Predefined layouts for different numbers of icons
const ICON_LAYOUTS = {
  1: [
    // Single icon in center
    [{ x: 0, y: 0 }],
  ],
  2: [
    // Layout 1: Top right and bottom left - adjusted to prevent cutoff
    [
      { x: 12, y: -10 },
      { x: -12, y: 12 },
    ],
    // Layout 2: Top left and bottom right - adjusted to prevent cutoff
    [
      { x: -12, y: -10 },
      { x: 12, y: 12 },
    ],
  ],
  3: [
    // Layout 1: Top middle, bottom corners - adjusted to prevent cutoff
    [
      { x: 0, y: -10 },
      { x: -12, y: 12 },
      { x: 12, y: 12 },
    ],
    // Layout 2: Right middle, left corners - adjusted to prevent cutoff
    [
      { x: 12, y: 0 },
      { x: -12, y: -10 },
      { x: -12, y: 12 },
    ],
    // Layout 3: Bottom middle, top corners - adjusted to prevent cutoff
    [
      { x: 0, y: 12 },
      { x: -12, y: -10 },
      { x: 12, y: -10 },
    ],
    // Layout 4: Left middle, right corners - adjusted to prevent cutoff
    [
      { x: -12, y: 0 },
      { x: 12, y: -10 },
      { x: 12, y: 12 },
    ],
  ],
  4: [
    // Four corners - adjusted to prevent cutoff
    [
      { x: -12, y: -10 },
      { x: 12, y: -10 },
      { x: -12, y: 12 },
      { x: 12, y: 12 },
    ],
  ],
};

/**
 * Get positions for icons in a tile based on the number of icons and stored layout
 * @param numIcons Number of icons to position (1-4)
 * @param storedLayout Optional stored layout index to use
 * @returns Array of positions for each icon and the chosen layout index
 */
export function getIconPositions(numIcons: number, storedLayout?: number): { positions: IconPosition[], layoutIndex: number } {
  // Validate input
  if (numIcons < 1 || numIcons > 4) {
    throw new Error('Number of icons must be between 1 and 4');
  }

  // Get layouts for this number of icons
  const layouts = ICON_LAYOUTS[numIcons as keyof typeof ICON_LAYOUTS];
  
  // Use stored layout if provided and valid, otherwise randomly select one
  const layoutIndex = (storedLayout !== undefined && storedLayout < layouts.length) 
    ? storedLayout 
    : Math.floor(Math.random() * layouts.length);
  
  return {
    positions: layouts[layoutIndex],
    layoutIndex
  };
} 