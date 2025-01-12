import { Scene, GameObjects } from 'phaser';
import { TerrainType, MapTile, GameState, Settlement } from '../types/game';
import { GRID_SIZE, TILE_SIZE } from '../config/game-config';
import { calculateUnlockCost } from '../config/unlock-costs';

// Interface for our game tiles, extending Phaser's Rectangle with custom properties
interface TileSprite extends GameObjects.Rectangle {
  tileData: MapTile;
  icon?: GameObjects.Text;  // Optional text object for displaying terrain icons
  costText?: GameObjects.Text;  // Add this for hover cost display
  settlementIcon?: GameObjects.Text; // Add settlement icon
  updateCost: (unlocked: boolean, unlockedTilesCount: number) => void;
}

export class GameScene extends Scene {
  // Core game state properties
  private map: MapTile[][] = [];        // 2D array representing game map data
  private tileSize = TILE_SIZE;                // Size of each tile in pixels
  private tiles: TileSprite[][] = [];   // 2D array of visual tile objects
  private onTileClick: (x: number, y: number) => void;  // Click handler passed from parent
  private isDarkTheme: boolean;
  private settlementPreview?: GameObjects.Text; // Preview of settlement when dragging
  
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
  }

  showSettlementPreview(show: boolean, type?: Settlement['type']) {
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
        
        // Add visual and interactive properties
        tile.setStrokeStyle(1, this.isDarkTheme ? 0x222222 : 0xeeeeee);
        tile.setInteractive();

        // Create cost text (hidden by default)
        tile.costText = this.add.text(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize * 0.8,
          '',
          {
            fontSize: '12px',
            align: 'center',
            color: this.isDarkTheme ? '#ffffff' : '#000000'
          }
        ).setOrigin(0.5);
        tile.costText.setVisible(false);

        // Add settlement icon (hidden by default)
        tile.settlementIcon = this.add.text(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize / 2,
          '',
          {
            fontSize: '32px',
            align: 'center'
          }
        ).setOrigin(0.5);
        tile.settlementIcon.setVisible(false);

        // Track hover state
        let isHovered = false;

        // Add hover events
        tile.on('pointerover', () => {
          if (!this.map[y][x].unlocked) {
            isHovered = true;
            
            // Check if adjacent to an unlocked tile
            const hasAdjacentUnlocked = [
              [x-1, y], [x+1, y], [x, y-1], [x, y+1]
            ].some(([adjX, adjY]) => 
              adjX >= 0 && adjX < GRID_SIZE && adjY >= 0 && adjY < GRID_SIZE && 
              this.map[adjY][adjX].unlocked
            );
            
            if (!hasAdjacentUnlocked && this.map.flat().some(t => t.unlocked)) {
              tile.costText?.setText('Not connected to owned tiles');
            } else {
              const unlockedTilesCount = this.map.flat().filter(t => t.unlocked).length;
              const unlockCost = calculateUnlockCost(unlockedTilesCount);
              
              if (unlockedTilesCount === 0) {
                tile.costText?.setText('Free!');
              } else if (unlockedTilesCount === 1) {
                tile.costText?.setText(`🪵${unlockCost.wood}`);
              } else {
                tile.costText?.setText(`🪵${unlockCost.wood} 🪨${unlockCost.stone}`);
              }
            }
            tile.costText?.setVisible(true);
          }
        });

        tile.on('pointerout', () => {
          isHovered = false;
          tile.costText?.setVisible(false);
        });

        // Update the updateCost method
        tile.updateCost = (unlocked: boolean, unlockedTilesCount: number) => {
          if (tile.costText) {
            if (isHovered && !unlocked) {
              // Check if adjacent to an unlocked tile
              const hasAdjacentUnlocked = [
                [x-1, y], [x+1, y], [x, y-1], [x, y+1]
              ].some(([adjX, adjY]) => 
                adjX >= 0 && adjX < GRID_SIZE && adjY >= 0 && adjY < GRID_SIZE && 
                this.map[adjY][adjX].unlocked
              );

              if (!hasAdjacentUnlocked) {
                tile.costText.setText('Not connected to owned tiles');
              } else {
                const unlockCost = calculateUnlockCost(unlockedTilesCount);
                if (unlockedTilesCount === 0) {
                  tile.costText.setText('Free!');
                } else if (unlockedTilesCount === 1) {
                  tile.costText.setText(`🪵${unlockCost.wood}`);
                } else {
                  tile.costText.setText(`🪵${unlockCost.wood} 🪨${unlockCost.stone}`);
                }
              }
              tile.costText.setVisible(true);
            } else {
              tile.costText.setVisible(false);
            }
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
            fontSize: '24px',
            align: 'center',
            padding: { x: 2, y: 2 }
          }
        ).setOrigin(0.5);
        
        this.tiles[y][x] = tile;
      }
    }
  }

  // Updates the visual state when game state changes
  updateGameState(gameState: GameState) {
    if (!gameState.map) return;
    
    this.map = gameState.map;
    const unlockedTilesCount = gameState.map.flat().filter(t => t.unlocked).length;
    
    // Show/hide settlement preview based on game phase and selected type
    this.showSettlementPreview(
      gameState.phase === 'placing-settlement',
      gameState.selectedSettlementType
    );
    
    // Update each tile's appearance based on new state
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileData = this.map[y][x];
        const tile = this.tiles[y]?.[x];
        
        if (tile && tileData) {
          // Update tile color based on locked/unlocked state
          tile.setFillStyle(this.getTileColor(tileData.unlocked));
          tile.setAlpha(tileData.unlocked ? 1 : 0.7);
          
          // Update terrain icon - show lock if not unlocked
          if (tile.icon) {
            const iconToShow = tileData.unlocked ? tileData.terrain : 'locked';
            tile.icon.setText(this.getTerrainIcon(iconToShow));
          }
          
          // Update settlement icon if there's a settlement
          if (tile.settlementIcon) {
            if (tileData.settlement) {
              tile.settlementIcon.setText(this.getSettlementIcon(tileData.settlement.type));
              tile.settlementIcon.setVisible(true);
            } else {
              tile.settlementIcon.setVisible(false);
            }
          }
          
          // Use the new update method with unlocked tiles count
          tile.updateCost(tileData.unlocked, unlockedTilesCount);
          
          // Highlight selected tile
          if (gameState.selectedTile?.x === x && gameState.selectedTile?.y === y) {
            tile.setStrokeStyle(2, 0xffff00);
          } else {
            tile.setStrokeStyle(1, 0x000000);
          }

          // Highlight valid settlement locations
          if (gameState.phase === 'placing-settlement' && tileData.unlocked && !tileData.settlement) {
            tile.setStrokeStyle(2, 0x00ff00);
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
          // Update tile colors
          tile.setFillStyle(this.getTileColor(tileData.unlocked));
          tile.setStrokeStyle(1, this.isDarkTheme ? 0x222222 : 0xeeeeee);
          
          // Update text colors
          if (tile.costText) {
            tile.costText.setColor(this.isDarkTheme ? '#ffffff' : '#000000');
          }
        }
      }
    }
  }
}