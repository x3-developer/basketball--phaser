import { Kernel } from '@src/app/config/core';

/**
 * Абстрактный класс для создания статических префабов
 *
 * @class AbstractPrefab
 */
export default abstract class AbstractStaticPrefab extends Phaser.GameObjects.Sprite {
  protected readonly _kernel: Kernel;

  protected constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);

    this._kernel = Kernel.Instance;
    this.scene = scene;

    this.scene.add.existing(this);
  }
}
