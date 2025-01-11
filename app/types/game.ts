export interface Resource {
  id: string;
  name: string;
  amount: number;
  icon: string;
  category: 'basic' | 'crafted' | 'gems';
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  origin: 'grass' | 'forest' | 'mountain' | 'water' | 'mine' | 'crafted';
  maxAmount: number;
}

export type TerrainType = 'locked' | 'grass' | 'forest' | 'mountain' | 'water' | 'mine';

export interface MapTile {
  x: number;
  y: number;
  terrain: TerrainType;
  unlocked: boolean;
  producing?: string; // resource id
}

export type GamePhase = 'selecting-start' | 'playing';

export interface GameState {
  resources: Resource[];
  lastUpdate: number;
  map: MapTile[][];
  selectedTile?: { x: number; y: number };
  phase: GamePhase;
}