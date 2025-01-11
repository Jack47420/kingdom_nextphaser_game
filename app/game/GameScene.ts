import { Scene, GameObjects } from 'phaser';
import { TerrainType, MapTile, GameState } from '../types/game';

interface TileSprite extends GameObjects.Rectangle {
  tileData: MapTile;
  icon?: GameObjects.Text;
}

export class GameScene extends Scene {
  private map: MapTile[][] = [];
  private tileSize = 64;
  private tiles: TileSprite[][] = [];
  private onTileClick: (x: number, y: number) => void;
  
  constructor(onTileClick: (x: number, y: number) => void) {
    super({ key: 'GameScene' });
    this.onTileClick = onTileClick;
    
    this.map = Array(8).fill(null).map((_, y) => 
      Array(8).fill(null).map((_, x) => ({
        terrain: 'locked' as TerrainType,
        unlocked: false,
        x,
        y
      }))
    );
  }

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

  private getTerrainColor(terrain: TerrainType): number {
    const colors: Record<TerrainType, number> = {
      locked: 0x666666,
      grass: 0x90EE90,
      forest: 0x228B22,
      mountain: 0x8B4513,
      water: 0x1E90FF,
      mine: 0xDAA520
    };
    return colors[terrain];
  }

  create() {
    this.createTiles();
  }

  private createTiles() {
    for (let y = 0; y < 8; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < 8; x++) {
        const tile = this.add.rectangle(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize / 2,
          this.tileSize - 2,
          this.tileSize - 2,
          this.getTerrainColor('locked')
        ) as TileSprite;
        
        tile.setStrokeStyle(1, 0x000000);
        tile.setInteractive();
        tile.on('pointerdown', () => {
          this.onTileClick(x, y);
        });

        // Add icon
        tile.icon = this.add.text(
          x * this.tileSize + this.tileSize / 2,
          y * this.tileSize + this.tileSize / 2,
          this.getTerrainIcon('locked'),
          {
            fontSize: '32px',
            align: 'center'
          }
        ).setOrigin(0.5);
        
        this.tiles[y][x] = tile;
      }
    }
  }

  updateGameState(gameState: GameState) {
    if (!gameState.map) return;
    
    this.map = gameState.map;
    
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileData = this.map[y][x];
        const tile = this.tiles[y]?.[x];
        
        if (tile && tileData) {
          const terrain = tileData.unlocked ? tileData.terrain : 'locked';
          tile.setFillStyle(this.getTerrainColor(terrain));
          tile.setAlpha(tileData.unlocked ? 1 : 0.7);
          
          // Update icon
          if (tile.icon) {
            tile.icon.setText(this.getTerrainIcon(terrain));
          }
          
          if (gameState.selectedTile?.x === x && gameState.selectedTile?.y === y) {
            tile.setStrokeStyle(2, 0xffff00);
          } else {
            tile.setStrokeStyle(1, 0x000000);
          }
        }
      }
    }
  }
}