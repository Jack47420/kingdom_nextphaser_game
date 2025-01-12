// Game board configuration
export const GRID_SIZE = 8;
export const TILE_SIZE = 80;

// Resource generation rates (per second)
export const RESOURCE_RATES = {
  common: 2,
  uncommon: 1,
  rare: 0.5,
  epic: 0.2,
  legendary: 0.1
};

// Game timing configuration (in milliseconds)
export const REFRESH_RATE = 1000 / 60; // 60 FPS for smooth UI updates
export const UPDATE_RATE = 1000; // Resource updates every second

export const UNLOCK_COST_GROWTH = {
    wood: 4,
    stone: 1
};
