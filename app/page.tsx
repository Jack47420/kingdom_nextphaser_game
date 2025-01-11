'use client';

import { useState, useEffect } from 'react';
import { GameHeader } from './components/game/GameHeader';
import { GameMap } from './components/game/GameMap';
import { ResourceGrid } from './components/game/ResourceGrid';
import { initialResources } from './data/initial-resources';
import { GameState, MapTile } from './types/game';
import { generateInitialMap } from './lib/map-utils';
import { toast } from 'sonner';
import { GRID_SIZE, UNLOCK_COST, RESOURCE_RATES, UPDATE_INTERVAL } from './config/game-config';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    resources: initialResources,
    lastUpdate: Date.now(),
    map: generateInitialMap(GRID_SIZE),
  }));

  const handleTileClick = (x: number, y: number) => {
    const tile = gameState.map[y][x];
    
    if (!tile.unlocked) {
      // Check if adjacent to an unlocked tile
      const hasAdjacentUnlocked = [
        [x-1, y], [x+1, y], [x, y-1], [x, y+1]
      ].some(([adjX, adjY]) => 
        adjX >= 0 && adjX < GRID_SIZE && adjY >= 0 && adjY < GRID_SIZE && 
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

      // Unlock the tile and deduct resources
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
        ),
        selectedTile: { x, y }
      }));
      
      toast.success('New territory unlocked!');
      return;
    }
    
    // Only handle selection if the tile is already unlocked
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

          const baseRate = RESOURCE_RATES[resource.category];

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
    }, UPDATE_INTERVAL);

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