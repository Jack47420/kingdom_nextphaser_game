import Phaser from 'phaser';
import { TerrainType, MapTile, GameState } from '../types/game';

interface TileSprite extends Phaser.GameObjects.Sprite {
  tileData: MapTile;
}

export class GameScene extends Phaser.Scene {
  private map: MapTile[][] = [];
  private tileSize = 64;
  private tiles: TileSprite[][] = [];
  private onTileClick: (x: number, y: number) => void;
  
  constructor(onTileClick: (x: number, y: number) => void) {
    super({ key: 'GameScene' });
    this.onTileClick = onTileClick;
  }

  preload() {
    this.load.spritesheet('tiles', '/tiles.png', { 
      frameWidth: 64, 
      frameHeight: 64 
    });
  }

  create() {
    this.createTiles();
  }

  private getTerrainFrame(terrain: TerrainType): number {
    const frames: Record<TerrainType, number> = {
      locked: 0,
      grass: 1,
      forest: 2,
      mountain: 3,
      water: 4,
      mine: 5
    };
    return frames[terrain];
  }

  private createTiles() {
    for (let y = 0; y < this.map.length; y++) {
      this.tiles[y] = [];
      for (let x = 0; x < this.map[y].length; x++) {
        const tileData = this.map[y][x];
        const tile = this.add.sprite(
          x * this.tileSize,
          y * this.tileSize,
          'tiles',
          this.getTerrainFrame(tileData.terrain)
        ) as TileSprite;
        
        tile.setOrigin(0);
        tile.setInteractive();
        tile.tileData = tileData;
        
        tile.on('pointerdown', () => {
          this.onTileClick(x, y);
        });
        
        this.tiles[y][x] = tile;
      }
    }
  }

  updateGameState(gameState: GameState) {
    this.map = gameState.map;
    
    for (let y = 0; y < this.map.length; y++) {
      for (let x = 0; x < this.map[y].length; x++) {
        const tileData = this.map[y][x];
        const tile = this.tiles[y][x];
        
        if (tile) {
          tile.setFrame(this.getTerrainFrame(tileData.terrain));
          tile.setAlpha(tileData.unlocked ? 1 : 0.5);
          
          if (gameState.selectedTile?.x === x && gameState.selectedTile?.y === y) {
            tile.setTint(0xffff00);
          } else {
            tile.clearTint();
          }
        }
      }
    }
  }
}