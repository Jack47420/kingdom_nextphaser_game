import { TerrainType, MapTile } from '../types/game';

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
        unlocked: x === 3 && y === 3 // Center tile starts unlocked
      });
    }
    map.push(row);
  }
  
  return map;
}