'use client';

import { useState, useEffect } from 'react';
import { GameHeader } from './components/game/GameHeader';
import { GameMap } from './components/game/GameMap';
import { ResourceGrid } from './components/game/ResourceGrid';
import { initialResources } from './data/initial-resources';
import { GameState, MapTile } from './types/game';
import { generateInitialMap, handleFirstTileSelection } from './lib/map-utils';
import { toast } from 'sonner';
import { GRID_SIZE, RESOURCE_RATES, UPDATE_RATE, getUnlockCost } from './config/game-config';
import { SettingsDialog } from './components/game/SettingsDialog';
import { PauseButton } from './components/game/PauseButton';

export default function Home() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    resources: initialResources,
    lastUpdate: Date.now(),
    map: generateInitialMap(GRID_SIZE),
    phase: 'selecting-start' as const
  }));
  const [isPaused, setIsPaused] = useState(false);

  // Add system theme detection
  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const logThemePreference = (e: MediaQueryListEvent | MediaQueryList) => {
      console.log('System theme preference:', e.matches ? 'Dark' : 'Light');
    };

    // Log initial theme
    logThemePreference(darkModeMediaQuery);

    // Listen for theme changes
    darkModeMediaQuery.addEventListener('change', logThemePreference);

    return () => {
      darkModeMediaQuery.removeEventListener('change', logThemePreference);
    };
  }, []);

  // Add cheat function to window object
  useEffect(() => {
    (window as any).addResources = (resourceId: string, amount: number) => {
      setGameState(prev => ({
        ...prev,
        resources: prev.resources.map(r => 
          r.id === resourceId 
            ? { ...r, amount: Math.min(r.maxAmount, r.amount + amount) }
            : r
        )
      }));
      toast.success(`Added ${amount} ${resourceId}!`);
    };

    // Add help function to show available resources
    (window as any).showResources = () => {
      console.log('Available resources:');
      gameState.resources.forEach(r => {
        console.log(`- ${r.id} (current: ${r.amount}/${r.maxAmount})`);
      });
    };

    // Cleanup
    return () => {
      delete (window as any).addResources;
      delete (window as any).showResources;
    };
  }, []);

  const handleTileClick = (x: number, y: number) => {
    if (isPaused) {
      toast.error('Game is paused! Unpause to continue playing.');
      return;
    }

    // Handle initial tile selection
    if (gameState.phase === 'selecting-start') {
      const newMap = handleFirstTileSelection(gameState.map, x, y);
      setGameState(prev => ({
        ...prev,
        map: newMap,
        phase: 'playing' as const,
        selectedTile: { x, y }
      }));
      toast.success('Starting position selected! Begin expanding your territory.');
      return;
    }

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

      // Count currently unlocked tiles
      const unlockedTilesCount = gameState.map.flat().filter(t => t.unlocked).length;
      const unlockCost = getUnlockCost(unlockedTilesCount);

      // Check resources
      const wood = gameState.resources.find(r => r.id === 'wood');
      const stone = gameState.resources.find(r => r.id === 'stone');
      
      if (wood?.amount! < unlockCost.wood || (unlockCost.stone > 0 && stone?.amount! < unlockCost.stone)) {
        if (unlockedTilesCount === 1) {
          toast.error(`Need ${unlockCost.wood} wood to unlock your second tile!`);
        } else {
          toast.error(`Need ${unlockCost.wood} wood and ${unlockCost.stone} stone to unlock!`);
        }
        return;
      }

      // Unlock the tile and deduct resources
      setGameState(prev => ({
        ...prev,
        resources: prev.resources.map(r => ({
          ...r,
          amount: r.id === 'wood' 
            ? r.amount - unlockCost.wood
            : r.id === 'stone'
              ? r.amount - unlockCost.stone
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
      
      if (unlockedTilesCount === 0) {
        toast.success('First tile unlocked for free!');
      } else if (unlockedTilesCount === 1) {
        toast.success(`Second tile unlocked for ${unlockCost.wood} wood!`);
      } else {
        toast.success('New territory unlocked!');
      }
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

  const handlePauseToggle = () => {
    if (gameState.phase === 'selecting-start') {
      toast.error('Cannot pause during starting position selection!');
      return;
    }
    setIsPaused(prev => {
      const newState = !prev;
      if (newState) {
        toast.info('Game Paused');
      } else {
        toast.info('Game Resumed');
      }
      return newState;
    });
  };

  const handleRestart = () => {
    setGameState({
      resources: initialResources,
      lastUpdate: Date.now(),
      map: generateInitialMap(GRID_SIZE),
      phase: 'selecting-start'
    });
    setIsPaused(false);
    toast.success('Choose your starting position!');
  };

  useEffect(() => {
    if (isPaused || gameState.phase === 'selecting-start') return;

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
          const timeFactor = UPDATE_RATE / 1000; // Convert rate to per-update interval

          return {
            ...resource,
            amount: Math.min(
              resource.maxAmount,
              resource.amount + (baseRate * producingTiles * timeFactor)
            )
          };
        });

        return {
          ...prev,
          resources: newResources,
          lastUpdate: Date.now()
        };
      });
    }, UPDATE_RATE);

    return () => clearInterval(timer);
  }, [isPaused, gameState.phase]);

  // Show initial toast when the game loads
  useEffect(() => {
    toast.success('Choose your starting position!');
  }, []);

  return (
    <main className="container max-w-[75vw] mx-auto p-4 space-y-4 bg-gray-300 text-gray-900 dark:bg-black dark:text-gray-100 min-h-screen">
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        <PauseButton isPaused={isPaused} onPause={handlePauseToggle} />
        <SettingsDialog onRestart={handleRestart} />
      </div>
      <GameHeader />
      <GameMap gameState={gameState} onTileClick={handleTileClick} />
      <ResourceGrid resources={gameState.resources} map={gameState.map} />
    </main>
  );
}