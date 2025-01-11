'use client';

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { GameState } from '@/app/types/game';
import dynamic from 'next/dynamic';

interface GameMapProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
}

// Dynamically import Phaser components with no SSR
// @ts-ignore - Dynamic import type mismatch is expected
const PhaserGame = dynamic(() => import('@/app/game/PhaserGame').then(mod => mod.PhaserGame), {
  ssr: false,
}) as any;

export function GameMap({ gameState, onTileClick }: GameMapProps) {
  return (
    <Card className="p-4 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="w-full aspect-square max-w-[512px] mx-auto">
        <PhaserGame gameState={gameState} onTileClick={onTileClick} />
      </div>
    </Card>
  );
}