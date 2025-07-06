import { forwardRef, ReactElement, useEffect, useLayoutEffect, useRef } from 'react';
import { IPhaserGameRef, IPhaserGameProps } from './types/phaserGame.types';
import InitGame from '@src/app/config/phaser';
import { Kernel } from '@src/app/config/core';

/**
 * Компонент игры
 */
const PhaserGame = forwardRef<IPhaserGameRef, IPhaserGameProps>(({ currentActiveScene }, ref): ReactElement => {
  const game = useRef<Phaser.Game | null>(null);
  const eventBus = Kernel.Instance.resolve<Phaser.Events.EventEmitter>('EventBus');

  useLayoutEffect(() => {
    if (game.current === null) {
      game.current = InitGame('game-container');

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        game.current = null;
      }
    };
  }, [ref]);

  useEffect(() => {
    eventBus.on('current-scene-ready', (scene_instance: Phaser.Scene) => {
      if (currentActiveScene && typeof currentActiveScene === 'function') {
        currentActiveScene(scene_instance);
      }

      if (typeof ref === 'function') {
        ref({ game: game.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }
    });

    return () => {
      eventBus.removeListener('current-scene-ready');
    };
  }, [currentActiveScene, ref]);

  return <div id="game-container" />;
});

export default PhaserGame;
