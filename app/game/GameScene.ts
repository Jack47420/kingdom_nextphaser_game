import { Scene, GameObjects } from 'phaser';
import { TerrainType, MapTile, GameState } from '../types/game';
import { GRID_SIZE, TILE_SIZE, UNLOCK_COST } from '../config/game-config';

// Interface for our game tiles, extending Phaser's Rectangle with custom properties
interface TileSprite extends GameObjects.Rectangle {
  tileData: MapTile;
  icon?: GameObjects.Text;  // Optional text object for displaying terrain icons
  costText?: GameObjects.Text;  // Add this for hover cost display
  updateCost: (unlocked: boolean) => void;
}

export class GameScene extends Scene {
  // Core game state properties
  private map: MapTile[][] = [];        // 2D array representing game map data
  private tileSize = TILE_SIZE;                // Size of each tile in pixels
  private tiles: TileSprite[][] = [];   // 2D array of visual tile objects
  private onTileClick: (x: number, y: number) => void;  // Click handler passed from parent
  
  constructor(onTileClick: (x: number, y: number) => void) {
    super({ key: 'GameScene' });  // Initialize Phaser Scene with unique key
    this.onTileClick = onTileClick;
    
    // Initialize empty 8x8 map with all tiles locked
    this.map = Array(GRID_SIZE).fill(null).map((_, y) => 
      Array(GRID_SIZE).fill(null).map((_, x) => ({
        terrain: 'locked' as TerrainType,
        unlocked: false,
        x,
        y
      }))
    );
  }

  // Maps terrain types to their corresponding emoji icons
  private getTerrainIcon(terrain: TerrainType): string {
    const icons: Record<TerrainType, string> = {
      locked: '🔒',
      grass: '🌿',
      forest: '🌲',
      mountain: '⛰️',
      water: '💧',
      mine: '⛏️'
    };
    return icons[terrain];
  }

  // Determines tile color based on locked/unlocked state
  private getTileColor(unlocked: boolean): number {
    return unlocked ? 0x888888 : 0x666666;  // Lighter grey for unlocked, darker for locked
  }

  // Phaser lifecycle method - called when scene starts
  create() {
    this.createTiles();
  }

  // Creates the visual representation of the game board
  private createTiles() {
    for (let y = 0; y < GRID_SIZE; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        // Create the tile rectangle
        const tile = this.add.rectangle(
          x * this.tileSize + this.tileSize / 2,  // Center X position
          y * this.tileSize + this.tileSize / 2,  // Center Y position
          this.tileSize - 2,  // Width (slight gap for visual separation)
          this.tileSize - 2,  // Height
          this.getTileColor(false)  // Initial color (locked)
        ) as TileSprite;
        
        // Add visual and interactive properties
        tile.setStrokeStyle(1, 0x000000);  // Black border
        tile.setInteractive();  // Enable click/touch

        // Create cost text (hidden by default)
        tile.costText = this.add.text(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize / 2 + 16, // Position below the icon
          `🪵${UNLOCK_COST.wood} 🪨${UNLOCK_COST.stone}`,
          {
            fontSize: '12px',
            align: 'center',
          }
        ).setOrigin(0.5);
        tile.costText.setVisible(false);

        // Track hover state
        let isHovered = false;

        // Add hover events
        tile.on('pointerover', () => {
          if (!this.map[y][x].unlocked) {
            isHovered = true;
            tile.costText?.setVisible(true);
          }
        });

        tile.on('pointerout', () => {
          isHovered = false;
          tile.costText?.setVisible(false);
        });

        // Update the updateGameState method to respect hover state
        tile.updateCost = (unlocked: boolean) => {
          if (tile.costText) {
            tile.costText.setVisible(isHovered && !unlocked);
          }
        };
        
        tile.on('pointerdown', () => {
          this.onTileClick(x, y);  // Handle clicks
        });

        // Add centered terrain icon
        tile.icon = this.add.text(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize / 2,
          this.getTerrainIcon('locked'),
          {
            fontSize: '32px',
            align: 'center'
          }
        ).setOrigin(0.5);  // Center the icon
        
        this.tiles[y][x] = tile;
      }
    }
  }

  // Updates the visual state when game state changes
  updateGameState(gameState: GameState) {
    if (!gameState.map) return;
    
    this.map = gameState.map;
    
    // Update each tile's appearance based on new state
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileData = this.map[y][x];
        const tile = this.tiles[y]?.[x];
        
        if (tile && tileData) {
          // Update tile color based on locked/unlocked state
          tile.setFillStyle(this.getTileColor(tileData.unlocked));
          tile.setAlpha(tileData.unlocked ? 1 : 0.7);  // Dim locked tiles
          
          // Update terrain icon - show lock if not unlocked
          if (tile.icon) {
            const iconToShow = tileData.unlocked ? tileData.terrain : 'locked';
            tile.icon.setText(this.getTerrainIcon(iconToShow));
          }
          
          // Use the new update method
          tile.updateCost(tileData.unlocked);
          
          // Highlight selected tile
          if (gameState.selectedTile?.x === x && gameState.selectedTile?.y === y) {
            tile.setStrokeStyle(2, 0xffff00);  // Yellow highlight
          } else {
            tile.setStrokeStyle(1, 0x000000);  // Normal border
          }
        }
      }
    }
  }
}