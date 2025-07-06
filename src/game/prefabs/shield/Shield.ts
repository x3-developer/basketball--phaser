import Phaser from 'phaser';
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import AbstractStaticPrefab from '../AbstractStaticPrefab';
import { GameStateManager, SPRITE_KEYS } from '@src/game/manager';

/**
 * Щит
 *
 * @class Shield
 */
export default class Shield extends AbstractStaticPrefab {
  private readonly _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');
  private _colliders: StaticGroup;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, SPRITE_KEYS.SHIELD);

    this.initialize();
  }

  /**
   * Создание стойки
   *
   * @returns {void}
   * @private
   */
  private initialize(): void {
    const shieldX = this._gameStateManager.currentPeriod === 1 ? 146 : 105;
    const shieldY = this._gameStateManager.currentPeriod === 1 ? 163 : 153;
    const shieldDisplayWidth = 168;
    const shieldDisplayHeight = 204;
    const shieldOrigin = 0;
    const shieldDepth = 5;
    const shieldColliderX = this._gameStateManager.currentPeriod === 1 ? 240 : 200;
    const shieldColliderY = this._gameStateManager.currentPeriod === 1 ? 265 : 260;
    const shieldColliderDisplayWidth = 10;
    const shieldColliderDisplayHeight = 160;
    const shieldColliderAlpha = 0;
    const shieldColliderBounce = 1;

    this.x = shieldX;
    this.y = shieldY;
    this.setDisplaySize(shieldDisplayWidth, shieldDisplayHeight);
    this.setOrigin(shieldOrigin);
    this.setDepth(shieldDepth);

    this._colliders = this.scene.physics.add.staticGroup();
    this._colliders
      .create(shieldColliderX, shieldColliderY)
      .setSize(shieldColliderDisplayWidth, shieldColliderDisplayHeight)
      .setAlpha(shieldColliderAlpha)
      .setBounce(shieldColliderBounce)
      .setDepth(5);

    for (let i = 0; i < 68; i++) {
      const angle = 15 * (Math.PI / 180);
      const distance = i * 1.5;
      const offsetX = distance * Math.cos(angle);
      const offsetY = distance * Math.sin(angle);

      this._colliders
        .create(shieldX + offsetX, shieldY + offsetY)
        .setSize(1, 10)
        .setAlpha(shieldColliderAlpha)
        .setBounce(shieldColliderBounce)
        .setDepth(4);
    }
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
