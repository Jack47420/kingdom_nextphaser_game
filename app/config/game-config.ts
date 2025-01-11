// Game board configuration
export const GRID_SIZE = 6;
export const TILE_SIZE = 90;

// Resource costs
export const UNLOCK_COST = {
  wood: 50,
  stone: 30
};

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

interface UnlockCost {
  wood: number;
  stone: number;
}

// Base costs for unlocking tiles (after the second tile)
export const BASE_UNLOCK_COST: UnlockCost = {
  wood: 50,
  stone: 30
};

// Cost for the second tile (only wood)
export const SECOND_TILE_COST: UnlockCost = {
  wood: 25,
  stone: 0
};

// Cost growth per unlocked tile (added to base cost)
export const COST_GROWTH_PER_TILE: UnlockCost = {
  wood: 3,
  stone: 2
};

// Function to calculate unlock costs based on number of unlocked tiles
export function getUnlockCost(unlockedTilesCount: number): UnlockCost {
  if (unlockedTilesCount === 0) {
    return { wood: 0, stone: 0 }; // First tile is free
  }
  
  if (unlockedTilesCount === 1) {
    return SECOND_TILE_COST; // Second tile only costs wood
  }
  
  // Calculate progressive costs for subsequent tiles
  const extraCost = (unlockedTilesCount - 2) * COST_GROWTH_PER_TILE.wood;
  const extraStoneCost = (unlockedTilesCount - 2) * COST_GROWTH_PER_TILE.stone;
  
  return {
    wood: BASE_UNLOCK_COST.wood + extraCost,
    stone: BASE_UNLOCK_COST.stone + extraStoneCost
  };
} 