'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { GameState } from '@/app/types/game';
import dynamic from 'next/dynamic';

interface GameMapProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
  scale?: number;
}

// Dynamically import Phaser components with no SSR
// @ts-ignore - Dynamic import type mismatch is expected
const PhaserGame = dynamic(() => import('@/app/game/PhaserGame').then(mod => mod.PhaserGame), {
  ssr: false,
}) as any;

export function GameMap({ gameState, onTileClick, scale = 1 }: GameMapProps) {
  return (
    <div className="w-full mx-auto">
      <PhaserGame gameState={gameState} onTileClick={onTileClick} scale={scale} />
    </div>
  );
}