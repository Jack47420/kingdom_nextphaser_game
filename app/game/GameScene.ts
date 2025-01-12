import { Scene, GameObjects } from 'phaser';
import { TerrainType, MapTile, GameState, Settlement } from '../types/game';
import { GRID_SIZE, TILE_SIZE } from '../config/game-config';
import { calculateUnlockCost } from '../config/unlock-costs';
import { getIconPositions } from '../lib/icon-positions';

// Interface for our game tiles, extending Phaser's Rectangle with custom properties
interface TileSprite extends GameObjects.Rectangle {
  tileData: MapTile;
  terrainIcon?: GameObjects.Text;  // Terrain icon
  icons: GameObjects.Text[];  // Array of all icons (terrain, settlement, etc.)
  defaultStrokeColor: number;  // Store the default stroke color
}

export class GameScene extends Scene {
  // Core game state properties
  private map: MapTile[][] = [];        // 2D array representing game map data
  private tileSize = TILE_SIZE;                // Size of each tile in pixels
  private tiles: TileSprite[][] = [];   // 2D array of visual tile objects
  private onTileClick: (x: number, y: number) => void;  // Click handler passed from parent
  private isDarkTheme: boolean;
  private settlementPreview?: GameObjects.Text; // Preview of settlement when dragging
  private currentGameState?: GameState; // Store current game state
  private hoveredTile?: { x: number; y: number }; // Track currently hovered tile
  
  constructor(onTileClick: (x: number, y: number) => void, isDarkTheme: boolean) {
    super({ key: 'GameScene' });  // Initialize Phaser Scene with unique key
    this.onTileClick = onTileClick;
    this.isDarkTheme = isDarkTheme;
    
    // Initialize empty map with all tiles locked
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

  private getSettlementIcon(type: 'village' | 'town' | 'city'): string {
    const icons = {
      village: '🏠',
      town: '🏘️',
      city: '🏰'
    };
    return icons[type];
  }
  
// Determines tile color based on locked/unlocked state
  private getTileColor(unlocked: boolean): number {
    if (this.isDarkTheme) {
      return unlocked ? 0x444444 : 0x333333;  // Darker greys for dark theme
    }
    return unlocked ? 0xdddddd : 0xcccccc;  // Lighter greys for light theme
  }

  // Phaser lifecycle method - called when scene starts
  create() {
    this.createTiles();
    
    // Setup settlement preview that follows the pointer
    this.settlementPreview = this.add.text(0, 0, '', {
      fontSize: '32px'
    }).setOrigin(0.5);
    this.settlementPreview.setVisible(false);

    // Update settlement preview position on pointer move
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (this.settlementPreview) {
        this.settlementPreview.setPosition(pointer.x, pointer.y);
      }
    });

    // Clear hover state when pointer leaves game
    this.input.on('pointerout', () => {
      if (this.hoveredTile) {
        const tile = this.tiles[this.hoveredTile.y]?.[this.hoveredTile.x];
        if (tile) {
          this.clearHoverEffect(tile);
        }
        this.hoveredTile = undefined;
      }
    });
  }

  // Phaser's update loop - called every frame
  update() {
    const pointer = this.input.activePointer;
    if (pointer && pointer.isDown === false) { // Only check when not clicking
      const tileX = Math.floor(pointer.x / this.tileSize);
      const tileY = Math.floor(pointer.y / this.tileSize);
      
      // If pointer is within game bounds
      if (tileX >= 0 && tileX < GRID_SIZE && tileY >= 0 && tileY < GRID_SIZE) {
        // If we're not already hovering this tile
        if (this.hoveredTile?.x !== tileX || this.hoveredTile?.y !== tileY) {
          // Clear previous hover if exists
          if (this.hoveredTile) {
            const prevTile = this.tiles[this.hoveredTile.y]?.[this.hoveredTile.x];
            if (prevTile) {
              this.clearHoverEffect(prevTile);
            }
          }
          
          // Set new hover
          this.hoveredTile = { x: tileX, y: tileY };
          const tile = this.tiles[tileY][tileX];
          if (tile) {
            this.updateHoverEffect(tile, tileX, tileY);
          }
        } else if (this.hoveredTile) {
          // Refresh hover effect on current tile
          const tile = this.tiles[tileY][tileX];
          if (tile) {
            this.updateHoverEffect(tile, tileX, tileY);
          }
        }
      } else if (this.hoveredTile) {
        // Pointer outside game bounds, clear hover
        const tile = this.tiles[this.hoveredTile.y]?.[this.hoveredTile.x];
        if (tile) {
          this.clearHoverEffect(tile);
        }
        this.hoveredTile = undefined;
      }
    }
  }

  private clearHoverEffect(tile: TileSprite) {
    if (this.currentGameState) {
      const isSelected = this.currentGameState.selectedTile?.x === tile.tileData.x && 
                        this.currentGameState.selectedTile?.y === tile.tileData.y;
      const isValidForSettlement = this.currentGameState.phase === 'placing-settlement' && 
                                  tile.tileData.unlocked && !tile.tileData.settlement;
      
      if (isSelected) {
        tile.setStrokeStyle(2, 0xffff00);
      } else if (isValidForSettlement) {
        tile.setStrokeStyle(2, 0x00ff00);
      } else {
        tile.setStrokeStyle(1, tile.defaultStrokeColor);
      }
    }
  }

  showSettlementPreview(show: boolean, type?: 'village' | 'town' | 'city') {
    if (this.settlementPreview) {
      if (show && type) {
        this.settlementPreview.setText(this.getSettlementIcon(type));
        this.settlementPreview.setVisible(true);
      } else {
        this.settlementPreview.setVisible(false);
      }
    }
  }
  
// Creates the visual representation of the game board
  private createTiles() {
    for (let y = 0; y < GRID_SIZE; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        // Create the tile rectangle
        const tile = this.add.rectangle(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize / 2,
          this.tileSize - 2,
          this.tileSize - 2,
          this.getTileColor(false)
        ) as TileSprite;
        
        tile.tileData = this.map[y][x];
        tile.icons = [];
        tile.defaultStrokeColor = this.isDarkTheme ? 0x222222 : 0xeeeeee;

        // Add visual and interactive properties
        tile.setStrokeStyle(1, tile.defaultStrokeColor);
        tile.setInteractive();

        // Create and position icons
        tile.icons = this.createTileIcons(tile, x, y);
        
        tile.on('pointerdown', () => {
          this.onTileClick(x, y);  // Handle clicks
        });

        this.tiles[y][x] = tile;
      }
    }
  }

  private createTileIcons(tile: TileSprite, x: number, y: number) {
    const icons: GameObjects.Text[] = [];
    const tileData = this.map[y][x];
    const centerX = x * this.tileSize + this.tileSize / 2;
    const centerY = y * this.tileSize + this.tileSize / 2;

    // Create terrain icon
    const terrainIcon = this.add.text(
      centerX,
      centerY,
      this.getTerrainIcon(tileData.unlocked ? tileData.terrain : 'locked'),
      {
        fontSize: '24px',
        align: 'center',
      }
    ).setOrigin(0.5);
    icons.push(terrainIcon);

    // Create settlement icon if exists
    if (tileData.settlement) {
      const settlementIcon = this.add.text(
        centerX,
        centerY,
        this.getSettlementIcon(tileData.settlement.type),
        {
          fontSize: '24px',
          align: 'center',
        }
      ).setOrigin(0.5);
      icons.push(settlementIcon);
    }

    // Position icons based on count and stored layout
    const { positions, layoutIndex } = getIconPositions(icons.length, tileData.iconLayout);
    
    // Store the layout if not already stored
    if (tileData.iconLayout === undefined) {
      tileData.iconLayout = layoutIndex;
    }
    
    icons.forEach((icon, index) => {
      const pos = positions[index];
      icon.setPosition(centerX + pos.x, centerY + pos.y);
    });

    return icons;
  }

  private updateTileIcons(tile: TileSprite) {
    // Remove existing icons
    tile.icons.forEach(icon => icon.destroy());
    
    // Create new icons with updated positions
    tile.icons = this.createTileIcons(tile, tile.tileData.x, tile.tileData.y);
  }

  private hasAdjacentUnlockedTile(x: number, y: number): boolean {
    const adjacentPositions = [
      [x-1, y], [x+1, y], [x, y-1], [x, y+1]
    ];
    
    return adjacentPositions.some(([adjX, adjY]) => 
      adjX >= 0 && adjX < GRID_SIZE && adjY >= 0 && adjY < GRID_SIZE && 
      this.map[adjY][adjX].unlocked
    );
  }

  private updateHoverEffect(tile: TileSprite, x: number, y: number) {
    if (!tile.tileData.unlocked && this.currentGameState) {
      const hasAdjacentUnlocked = this.hasAdjacentUnlockedTile(x, y);
      if (hasAdjacentUnlocked) {
        const unlockedTilesCount = this.currentGameState.map.flat().filter(t => t.unlocked).length;
        const unlockCost = calculateUnlockCost(unlockedTilesCount);
        
        const woodResource = this.currentGameState.resources.find(r => r.id === 'wood');
        const stoneResource = this.currentGameState.resources.find(r => r.id === 'stone');
        
        const canAfford = unlockedTilesCount === 0 || 
          (unlockedTilesCount === 1 && woodResource && woodResource.amount >= unlockCost.wood) ||
          (woodResource && stoneResource && 
           woodResource.amount >= unlockCost.wood && 
           stoneResource.amount >= unlockCost.stone);
        
        tile.setStrokeStyle(2, canAfford ? 0x00ff00 : 0xff0000);
        return; // Exit early if we applied hover effect
      }
    }
    // If we get here, no hover effect was applied, so we should use default stroke
    tile.setStrokeStyle(1, tile.defaultStrokeColor);
  }

  // Updates the visual state when game state changes
  updateGameState(gameState: GameState) {
    if (!gameState.map) return;
    
    this.map = gameState.map;
    this.currentGameState = gameState;
    
    // Show/hide settlement preview based on game phase and selected type
    this.showSettlementPreview(
      gameState.phase === 'placing-settlement',
      gameState.selectedSettlementType
    );
    
    // Update each tile's appearance
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileData = this.map[y][x];
        const tile = this.tiles[y]?.[x];
        
        if (tile && tileData) {
          tile.tileData = tileData;
          tile.setFillStyle(this.getTileColor(tileData.unlocked));
          tile.setAlpha(tileData.unlocked ? 1 : 0.7);
          
          // Update icons
          this.updateTileIcons(tile);
          
          // Update selection highlight or hover effect
          if (this.hoveredTile?.x === x && this.hoveredTile?.y === y) {
            this.updateHoverEffect(tile, x, y);
          } else if (gameState.selectedTile?.x === x && gameState.selectedTile?.y === y) {
            tile.setStrokeStyle(2, 0xffff00);
          } else if (gameState.phase === 'placing-settlement' && tileData.unlocked && !tileData.settlement) {
            tile.setStrokeStyle(2, 0x00ff00);
          } else {
            tile.setStrokeStyle(1, tile.defaultStrokeColor);
          }
        }
      }
    }
  }

  // Updates the theme-related colors
  updateTheme(isDarkTheme: boolean) {
    this.isDarkTheme = isDarkTheme;
    
    for (let y = 0; y < this.tiles.length; y++) {
      for (let x = 0; x < this.tiles[y].length; x++) {
        const tile = this.tiles[y][x];
        const tileData = this.map[y][x];
        
        if (tile) {
          // Update tile colors and default stroke
          tile.defaultStrokeColor = this.isDarkTheme ? 0x222222 : 0xeeeeee;
          tile.setFillStyle(this.getTileColor(tileData.unlocked));
          
        }
      }
    }
  }
}