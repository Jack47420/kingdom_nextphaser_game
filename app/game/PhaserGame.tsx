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
}

export function PhaserGame({ gameState, onTileClick }: PhaserGameProps) {
  const gameRef = useRef<Game | null>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);
  const { theme, systemTheme } = useTheme();

  const isDarkTheme = theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  // Initialize Phaser
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
        scale: {
          mode: Scale.FIT,
          autoCenter: Scale.CENTER_BOTH
        },
        audio: {
          disableWebAudio: false,
          noAudio: false
        }
      };

      gameRef.current = new Game(config);
      
      // Resume audio context after first user interaction
      document.addEventListener('click', function resumeAudio() {
        const soundManager = gameRef.current?.sound;
        if (soundManager && 'context' in soundManager) {
          (soundManager as any).context.resume();
        }
        document.removeEventListener('click', resumeAudio);
      }, false);
    } else if (gameRef.current) {
      // Update background color when theme changes
      if (gameRef.current.canvas) {
        const backgroundColor = isDarkTheme ? '#1a1a1a' : '#f1f5f9';
        gameRef.current.canvas.style.backgroundColor = backgroundColor;
      }
      gameRef.current.scene.remove('GameScene');
      gameRef.current.scene.add('GameScene', scene, true);
    }

    return () => {
      if (gameRef.current && !isInitialized.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onTileClick, theme, systemTheme, isDarkTheme]);

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