'use client';

import React, { useEffect, useRef } from 'react';
import { GameState } from '../types/game';
import { Game, AUTO, Scale } from 'phaser';
import { GameScene } from './GameScene';
import { GRID_SIZE, TILE_SIZE } from '../config/game-config';
import { useTheme } from 'next-themes';

interface PhaserGameProps {
  gameState: GameState;
  onTileClick: (x: number, y: number) => void;
  scale?: number;
}

export function PhaserGame({ gameState, onTileClick, scale = 1 }: PhaserGameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Game>();
  const sceneRef = useRef<GameScene>();
  const isInitialized = useRef(false);
  const { theme, systemTheme } = useTheme();
  const isDarkTheme = (theme === 'system' ? systemTheme : theme) === 'dark';

  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) {
      return;
    }

    const scene = new GameScene(onTileClick, isDarkTheme);
    sceneRef.current = scene;

    if (!isInitialized.current) {
      isInitialized.current = true;
      const config = {
        type: AUTO,
        parent: containerRef.current,
        width: GRID_SIZE * TILE_SIZE,
        height: GRID_SIZE * TILE_SIZE,
        backgroundColor: isDarkTheme ? '#1a1a1a' : '#f1f5f9',
        scene: scene,
        antialias: true,
        pixelArt: true,
        roundPixels: true,
        scale: {
          mode: Scale.NONE,
          zoom: scale,
        },
      };

      gameRef.current = new Game(config);
    } else if (gameRef.current) {
      // Update scale when it changes
      if (gameRef.current.scale) {
        gameRef.current.scale.setZoom(scale);
      }
      
      // Update background color when theme changes
      if (gameRef.current.canvas) {
        const backgroundColor = isDarkTheme ? '#1a1a1a' : '#f1f5f9';
        gameRef.current.canvas.style.backgroundColor = backgroundColor;
      }
      gameRef.current.scene.remove('GameScene');
      gameRef.current.scene.add('GameScene', scene, true);
    }
  }, [onTileClick, theme, systemTheme, isDarkTheme, scale]);

  // Update theme separately
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateTheme(isDarkTheme);
    }
  }, [isDarkTheme]);

  // Update game state separately
  useEffect(() => {
    if (sceneRef.current && gameState) {
      sceneRef.current.updateGameState(gameState);
    }
  }, [gameState]);

  return <div ref={containerRef} id="phaser-game" />;
}