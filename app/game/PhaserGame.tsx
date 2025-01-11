'use client';

import React, { useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { Game, AUTO, Scale } from 'phaser';
import { GameScene } from './GameScene';

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
    if (typeof window === 'undefined' || !containerRef.current || isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    const scene = new GameScene(onTileClick);
    sceneRef.current = scene;

    const config = {
      type: AUTO,
      parent: containerRef.current,
      width: 512,
      height: 512,
      backgroundColor: '#2d2d2d',
      scene: scene,
      scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH
      }
    };

    gameRef.current = new Game(config);

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        isInitialized.current = false;
      }
    };
  }, []); // Empty dependency array

  // Update game state separately
  useEffect(() => {
    if (sceneRef.current && gameState) {
      sceneRef.current.updateGameState(gameState);
    }
  }, [gameState]);

  return <div ref={containerRef} id="phaser-game" />;
}