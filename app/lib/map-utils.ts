import { TerrainType, MapTile } from '../types/game';
import { GRID_SIZE } from '../config/game-config';

const TERRAIN_WEIGHTS = {
  forest: 0.3,    // 30% chance
  mountain: 0.25, // 25% chance
  grass: 0.35,    // 35% chance
  mine: 0.1       // 10% chance
};

function getRandomTerrain(): TerrainType {
  const rand = Math.random();
  let cumulativeWeight = 0;
  
  for (const [terrain, weight] of Object.entries(TERRAIN_WEIGHTS)) {
    cumulativeWeight += weight;
    if (rand < cumulativeWeight) {
      return terrain as TerrainType;
    }
  }
  
  return 'grass'; // fallback
}

type Side = 'top' | 'right' | 'bottom' | 'left';
type SideSegment = { side: Side; segment: number }; // segment is 0-3

function generateRiver(map: MapTile[][]): void {
  const size = map.length;
  const quarterSize = Math.floor(size / 4);

  // Get all possible side segments
  function getSideSegments(): SideSegment[] {
    const segments: SideSegment[] = [];
    ['top', 'right', 'bottom', 'left'].forEach(side => {
      for (let i = 0; i < 4; i++) {
        segments.push({ side: side as Side, segment: i });
      }
    });
    return segments;
  }

  // Get coordinates for a side segment
  function getSegmentCoordinates(segment: SideSegment): { x: number; y: number } {
    const segmentSize = Math.floor(size / 4);
    const offset = segment.segment * segmentSize + Math.floor(segmentSize / 2);
    
    switch (segment.side) {
      case 'top': return { x: offset, y: 0 };
      case 'right': return { x: size - 1, y: offset };
      case 'bottom': return { x: offset, y: size - 1 };
      case 'left': return { x: 0, y: offset };
    }
  }

  // Calculate segment distance (0-11, going around the perimeter)
  function getSegmentDistance(start: SideSegment, end: SideSegment): number {
    const sides: Side[] = ['top', 'right', 'bottom', 'left'];
    const startSideIndex = sides.indexOf(start.side);
    const endSideIndex = sides.indexOf(end.side);
    
    let distance = 0;
    if (start.side === end.side) {
      distance = Math.abs(end.segment - start.segment);
    } else {
      const sideDistance = (endSideIndex - startSideIndex + 4) % 4;
      distance = sideDistance * 4 - start.segment + end.segment;
    }
    return distance;
  }

  // Select start and end segments
  const allSegments = getSideSegments();
  const startSegment = allSegments[Math.floor(Math.random() * allSegments.length)];
  
  // Filter valid end segments (2-11 segments away)
  const validEndSegments = allSegments.filter(endSegment => {
    const distance = getSegmentDistance(startSegment, endSegment);
    return distance >= 3 && distance <= 10;
  });
  
  const endSegment = validEndSegments[Math.floor(Math.random() * validEndSegments.length)];
  
  // Get start and end coordinates
  const start = getSegmentCoordinates(startSegment);
  const end = getSegmentCoordinates(endSegment);
  
  // Generate river path
  let current = { x: start.x, y: start.y };
  map[current.y][current.x].terrain = 'water';
  
  while (current.x !== end.x || current.y !== end.y) {
    const dx = Math.sign(end.x - current.x);
    const dy = Math.sign(end.y - current.y);
    
    // Decide movement direction
    let nextX = current.x;
    let nextY = current.y;
    
    if (dx !== 0 && dy !== 0) {
      // Move diagonally with 50% chance, otherwise move in single direction
      if (Math.random() < 0.5) {
        nextX += dx;
      } else {
        nextY += dy;
      }
    } else {
      // Move towards target with some randomness
      if (dx !== 0) {
        nextX += dx;
        if (Math.random() < 0.3) nextY += Math.random() < 0.5 ? 1 : -1;
      } else {
        nextY += dy;
        if (Math.random() < 0.3) nextX += Math.random() < 0.5 ? 1 : -1;
      }
    }
    
    // Ensure we stay within bounds
    nextX = Math.max(0, Math.min(size - 1, nextX));
    nextY = Math.max(0, Math.min(size - 1, nextY));
    
    // Update current position and set terrain
    current = { x: nextX, y: nextY };
    map[current.y][current.x].terrain = 'water';
  }
}

// Generate initial map with all tiles locked
export function generateInitialMap(size: number): MapTile[][] {
  const map: MapTile[][] = [];
  
  // First, generate base terrain
  for (let y = 0; y < size; y++) {
    const row: MapTile[] = [];
    for (let x = 0; x < size; x++) {
      row.push({
        x,
        y,
        terrain: getRandomTerrain(),
        unlocked: false
      });
    }
    map.push(row);
  }

  // Then, generate the river
  generateRiver(map);
  
  return map;
}

// Function to handle the first tile selection
export function handleFirstTileSelection(
  map: MapTile[][],
  x: number,
  y: number
): MapTile[][] {
  // Create a deep copy of the map
  const newMap = JSON.parse(JSON.stringify(map));
  
  // Check if selected tile is water
  if (newMap[y][x].terrain === 'water') {
    return map; // Return original map if water tile selected
  }
  
  // Set the selected tile as forest and unlock it
  newMap[y][x] = {
    ...newMap[y][x],
    terrain: 'forest',
    unlocked: true
  };
  
  // Set adjacent tiles with specific terrains
  const adjacentTiles = [
    [x-1, y], [x+1, y], [x, y-1], [x, y+1]
  ];
  
  // Ensure at least one mountain is adjacent (if not blocked by water)
  let mountainPlaced = false;
  for (const [adjX, adjY] of adjacentTiles) {
    if (adjX >= 0 && adjX < GRID_SIZE && adjY >= 0 && adjY < GRID_SIZE) {
      // Skip if it's a water tile
      if (newMap[adjY][adjX].terrain === 'water') continue;
      
      if (!mountainPlaced) {
        newMap[adjY][adjX] = {
          ...newMap[adjY][adjX],
          terrain: 'mountain'
        };
        mountainPlaced = true;
      } else {
        // Randomize other adjacent tiles (except water)
        newMap[adjY][adjX] = {
          ...newMap[adjY][adjX],
          terrain: getRandomTerrain()
        };
      }
    }
  }
  
  return newMap;
}