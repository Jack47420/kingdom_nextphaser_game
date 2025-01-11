'use client';

import { useState, useEffect } from 'react';
import { GameHeader } from './components/game/GameHeader';
import { GameMap } from './components/game/GameMap';
import { ResourceGrid } from './components/game/ResourceGrid';
import { initialResources } from './data/initial-resources';
import { GameState, MapTile } from './types/game';
import { generateInitialMap } from './lib/map-utils';
import { toast } from 'sonner';

const UNLOCK_COST = {
  wood: 50,
  stone: 30
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    resources: initialResources,
    lastUpdate: Date.now(),
    map: generateInitialMap(8),
  }));

  const handleTileClick = (x: number, y: number) => {
    const tile = gameState.map[y][x];
    
    if (!tile.unlocked) {
      // Check if adjacent to an unlocked tile
      const hasAdjacentUnlocked = [
        [x-1, y], [x+1, y], [x, y-1], [x, y+1]
      ].some(([adjX, adjY]) => 
        adjX >= 0 && adjX < 8 && adjY >= 0 && adjY < 8 && 
        gameState.map[adjY][adjX].unlocked
      );

      if (!hasAdjacentUnlocked) {
        toast.error('You can only unlock tiles adjacent to your territory!');
        return;
      }

      // Check resources
      const wood = gameState.resources.find(r => r.id === 'wood');
      const stone = gameState.resources.find(r => r.id === 'stone');
      
      if (wood?.amount! < UNLOCK_COST.wood || stone?.amount! < UNLOCK_COST.stone) {
        toast.error(`Need ${UNLOCK_COST.wood} wood and ${UNLOCK_COST.stone} stone to unlock!`);
        return;
      }

      // Unlock the tile
      setGameState(prev => ({
        ...prev,
        resources: prev.resources.map(r => ({
          ...r,
          amount: r.id === 'wood' 
            ? r.amount - UNLOCK_COST.wood
            : r.id === 'stone'
              ? r.amount - UNLOCK_COST.stone
              : r.amount
        })),
        map: prev.map.map((row, y2) =>
          row.map((tile, x2) =>
            x === x2 && y === y2
              ? { ...tile, unlocked: true }
              : tile
          )
        )
      }));
      
      toast.success('New territory unlocked!');
    }

    // Select/deselect tile
    setGameState(prev => ({
      ...prev,
      selectedTile: prev.selectedTile?.x === x && prev.selectedTile?.y === y
        ? undefined
        : { x, y }
    }));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev) => {
        const newResources = prev.resources.map(resource => {
          // Count producing tiles for this resource
          const producingTiles = prev.map.flat().filter(
            tile => tile.unlocked && (
              (tile.terrain === 'forest' && resource.id === 'wood') ||
              (tile.terrain === 'mountain' && resource.id === 'stone') ||
              (tile.terrain === 'mine' && (resource.id === 'iron' || resource.id === 'copper')) ||
              (tile.terrain === 'water' && resource.id === 'water')
            )
          ).length;

          const baseRate = resource.category === 'basic' ? 1 :
                          resource.category === 'rare' ? 0.1 :
                          0.2;

          return {
            ...resource,
            amount: Math.min(
              resource.maxAmount,
              resource.amount + (baseRate * (producingTiles + 1))
            )
          };
        });

        return {
          ...prev,
          resources: newResources,
          lastUpdate: Date.now()
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <main className="container mx-auto p-4 space-y-4">
      <GameHeader />
      <GameMap gameState={gameState} onTileClick={handleTileClick} />
      <ResourceGrid resources={gameState.resources} />
    </main>
  );
}