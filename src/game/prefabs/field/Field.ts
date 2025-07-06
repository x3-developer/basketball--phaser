import Phaser from 'phaser';
import StaticBody = Phaser.Physics.Arcade.StaticBody;
import AbstractStaticPrefab from '@src/game/prefabs/AbstractStaticPrefab';
import { SPRITE_KEYS } from '@src/game/manager';

/**
 * Пол
 *
 * @class Field
 */
export default class Field extends AbstractStaticPrefab {
  private _collider: StaticBody;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, SPRITE_KEYS.FIELD);

    this.initialize();
  }

  /**
   * Создание поля
   *
   * @returns {void}
   * @private
   */
  private initialize(): void {
    const fieldX = -220;
    const fieldY = 567;
    const fieldWidth = 2555;
    const fieldHeight = 329;
    const fieldOrigin = 0;
    const fieldDepth = 4;
    const colliderBodyX = 0;
    const colliderBodyY = 700;
    const colliderBodyWidth = 1460;
    const colliderBodyHeight = 164;

    this.x = fieldX;
    this.y = fieldY;
    this.setDisplaySize(fieldWidth, fieldHeight);
    this.setOrigin(fieldOrigin);
    this.setDepth(fieldDepth);

    this._collider = this.scene.physics.add.staticBody(
      colliderBodyX,
      colliderBodyY,
      colliderBodyWidth,
      colliderBodyHeight,
    );
  }

  /**
   * Получение коллайдера
   *
   * @returns {StaticBody}
   */
  get collider(): StaticBody {
    return this._collider;
  }
}
