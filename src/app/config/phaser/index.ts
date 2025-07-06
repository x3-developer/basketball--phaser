import { Game } from 'phaser';
import { scenes } from '@src/game/scenes';
import { Kernel, ServiceProvider } from '@src/app/config/core';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1460,
  height: 785,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },

      debug: false,
      fixedStep: false,
    },
  },
  scene: scenes,
};

let game: Phaser.Game | null = null;
const kernel = Kernel.Instance;
ServiceProvider.register(kernel);

export default function InitGame(parent: string): Game {
  if (game) {
    game.destroy(true);
  }

  game = new Game({ ...config, parent });
  return game;
}
