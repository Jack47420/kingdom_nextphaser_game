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
  settlement?: Settlement; // Add settlement information
  iconLayout?: number; // Store the chosen layout index
}

export interface Settlement {
  type: 'village' | 'town' | 'city';
  level: number;
}

export type GamePhase = 'selecting-start' | 'playing' | 'placing-settlement';

export interface GameState {
  resources: Resource[];
  lastUpdate: number;
  map: MapTile[][];
  selectedTile?: { x: number; y: number };
  phase: GamePhase;
  draggingSettlement?: boolean;
  selectedSettlementType?: Settlement['type'];
}