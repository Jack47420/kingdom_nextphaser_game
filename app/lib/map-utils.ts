import { TerrainType, MapTile } from '../types/game';
import { GRID_SIZE, INITIAL_UNLOCKED_POSITION } from '../config/game-config';

// Use a deterministic pattern for initial map generation
export function generateInitialMap(size: number): MapTile[][] {
  const map: MapTile[][] = [];
  
  const pattern: TerrainType[] = [
    'forest', 'mountain', 'grass', 'water',
    'grass', 'mine', 'forest', 'mountain'
  ];
  
  for (let y = 0; y < size; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < size; x++) {
      const terrainIndex = (x + y) % pattern.length;
      row.push({
        x,
        y,
        terrain: pattern[terrainIndex],
        // Only unlock the center tile
        unlocked: x === INITIAL_UNLOCKED_POSITION.x && y === INITIAL_UNLOCKED_POSITION.y
      });
    }
    map.push(row);
  }
  
  return map;
}