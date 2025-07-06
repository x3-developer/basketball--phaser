import Phaser from 'phaser';
import AbstractStaticPrefab from '../AbstractStaticPrefab';
import { SpriteKeyType } from '@src/game/manager/sprite/types/sprite.types.ts';
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;

/**
 * Стойка
 *
 * @class Rack
 */
export default class Rack extends AbstractStaticPrefab {
  private _colliders: StaticGroup;

  constructor(scene: Phaser.Scene, rackTexture: SpriteKeyType) {
    super(scene, 0, 0, rackTexture);

    this.initialize();
  }

  /**
   * Создание стойки
   *
   * @returns {void}
   * @private
   */
  private initialize(): void {
    const rackX = 54;
    const rackY = 295;
    const rackWidth = 187;
    const rackHeight = 487;
    const rackOrigin = 0;
    const rackDepth = 5;
    const rackColliderBodyX = 130;
    const rackColliderBodyY = 538;
    const rackColliderWidth = 10;
    const rackColliderHeight = 330;
    const rackColliderAlpha = 0;

    this.x = rackX;
    this.y = rackY;
    this.setDisplaySize(rackWidth, rackHeight);
    this.setOrigin(rackOrigin);
    this.setDepth(rackDepth);

    this._colliders = this.scene.physics.add.staticGroup();
    this._colliders
      .create(rackColliderBodyX, rackColliderBodyY)
      .setSize(rackColliderWidth, rackColliderHeight)
      .setAlpha(rackColliderAlpha);
  }

  /**
   * Получение коллайдеров
   *
   * @returns {StaticGroup}
   */
  get colliders(): StaticGroup {
    return this._colliders;
  }
}
