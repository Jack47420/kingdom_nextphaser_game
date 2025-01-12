import { UNLOCK_COST_GROWTH } from "./game-config";

interface UnlockCost {
  wood: number;
  stone: number;
}

// Base costs for unlocking tiles (after the second tile)
const BASE_UNLOCK_COST: UnlockCost = {
  wood: 40,
  stone: 25
};

// Cost for the second tile (only wood)
const SECOND_TILE_COST: UnlockCost = {
  wood: 10,
  stone: 2
};


/**
 * Calculates the unlock cost for a tile based on the number of already unlocked tiles
 * @param unlockedTilesCount The number of tiles already unlocked
 * @returns The cost to unlock the next tile
 */
export function calculateUnlockCost(unlockedTilesCount: number): UnlockCost {
  if (unlockedTilesCount === 0) {
    return { wood: 0, stone: 0 }; // First tile is free
  }
  
  if (unlockedTilesCount === 1) {
    return SECOND_TILE_COST; // Second tile only costs wood
  }
  
  // Calculate growth factor based on number of unlocked tiles beyond the second tile
  const additionalTiles = unlockedTilesCount - 2;
  const growthFactorWood = Math.pow(1 + (UNLOCK_COST_GROWTH.wood / 100), additionalTiles);
  const growthFactorStone = Math.pow(1 + (UNLOCK_COST_GROWTH.stone / 100), additionalTiles);
  
  return {
    wood: Math.round(BASE_UNLOCK_COST.wood * growthFactorWood),
    stone: Math.round(BASE_UNLOCK_COST.stone * growthFactorStone)
  };
} 