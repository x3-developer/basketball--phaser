import { Kernel } from '@src/app/config/core';
import Phaser from 'phaser';

/**
 * Абстрактный класс для создания префабов с физикой Arcade
 *
 * @class AbstractArcadePrefab
 */
export default abstract class AbstractArcadePrefab extends Phaser.Physics.Arcade.Sprite {
  protected readonly _kernel: Kernel;

  protected constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this._kernel = Kernel.Instance;
    this.scene = scene;

    scene.physics.add.existing(this);
    scene.add.existing(this);
  }

  /**
   * Определяет, является ли устройство мобильным
   *
   * @returns {boolean}
   * @protected
   */
  protected isMobile(): boolean {
    return this.scene.sys.game.device.os.android || this.scene.sys.game.device.os.iOS;
  }
}
