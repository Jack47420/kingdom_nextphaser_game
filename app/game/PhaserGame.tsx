'use client';

import React, { useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { Game, AUTO, Scale } from 'phaser';
import { GameScene } from './GameScene';
import { GRID_SIZE, TILE_SIZE } from '../config/game-config';

interface PhaserGameProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
}

export function PhaserGame({ gameState, onTileClick }: PhaserGameProps) {
  const gameRef = useRef<Game | null>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  // Initialize Phaser
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) {
      return;
    }

    const scene = new GameScene(onTileClick);
    sceneRef.current = scene;

    if (!isInitialized.current) {
      isInitialized.current = true;
      const config = {
        type: AUTO,
        parent: containerRef.current,
        width: GRID_SIZE * TILE_SIZE,
        height: GRID_SIZE * TILE_SIZE,
        backgroundColor: '#2d2d2d',
        scene: scene,
        scale: {
          mode: Scale.FIT,
          autoCenter: Scale.CENTER_BOTH
        }
      };

      gameRef.current = new Game(config);
    } else if (gameRef.current) {
      gameRef.current.scene.remove('GameScene');
      gameRef.current.scene.add('GameScene', scene, true);
    }

    return () => {
      if (gameRef.current && !isInitialized.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onTileClick]); // Add onTileClick to dependencies

  // Update game state separately
  useEffect(() => {
    if (sceneRef.current && gameState) {
      sceneRef.current.updateGameState(gameState);
    }
  }, [gameState]);

  return <div ref={containerRef} id="phaser-game" />;
}