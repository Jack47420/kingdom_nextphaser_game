// Game board configuration
export const GRID_SIZE = 9;
export const TILE_SIZE = 64;

// Resource costs
export const UNLOCK_COST = {
  wood: 50,
  stone: 30
};

// Resource generation rates
export const RESOURCE_RATES = {
  basic: 1,
  rare: 0.1,
  crafted: 0.2
};

// Game update frequency (in milliseconds)
export const UPDATE_INTERVAL = Math.floor(1000 / 3);

// Initial unlocked position (center tile)
export const INITIAL_UNLOCKED_POSITION = {
  x: Math.floor(GRID_SIZE / 2),
  y: Math.floor(GRID_SIZE / 2)
}; 