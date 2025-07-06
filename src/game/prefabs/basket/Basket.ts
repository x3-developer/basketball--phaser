import Phaser from 'phaser';
import Sprite = Phaser.Physics.Arcade.Sprite;
import StaticGroup = Phaser.Physics.Arcade.StaticGroup;
import AbstractStaticPrefab from '../AbstractStaticPrefab';
import { GameStateManager, SPRITE_KEYS } from '@src/game/manager';

/**
 * Корзина
 *
 * @class Basket
 */
export default class Basket extends AbstractStaticPrefab {
  private readonly _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');
  private _colliders: StaticGroup;
  private _goalSensor: Sprite;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, SPRITE_KEYS.BASKET);

    this.initialize();
  }

  /**
   * Инициализация корзины
   *
   * @returns {void}
   * @private
   */
  private initialize(): void {
    const basketX = this._gameStateManager.currentPeriod === 1 ? 243 : 205;
    const basketY = this._gameStateManager.currentPeriod === 1 ? 324 : 314;
    const basketWidth = 136;
    const basketHeight = 119;
    const basketOrigin = 0;
    const basketDepth = 6;

    this.x = basketX;
    this.y = basketY;
    this.setOrigin(basketOrigin);
    this.setDepth(basketDepth);
    this.setDisplaySize(basketWidth, basketHeight);

    this._colliders = this.scene.physics.add.staticGroup();
    this.colliders
      .create(basketX + 15, basketY + 15)
      .setSize(10, 30)
      .setBounce(0.8)
      .setAlpha(0).checkCollision = { up: true, down: true, left: true, right: true, none: false };

    this.colliders
      .create(basketX + 130, basketY + 15)
      .setSize(10, 30)
      .setBounce(0.8)
      .setAlpha(0).checkCollision = { up: true, down: true, left: true, right: true, none: false };

    this._goalSensor = this.scene.physics.add
      .sprite(basketX + 40, basketY + 25, SPRITE_KEYS.BASKET)
      .setScale(0.5, 0.01)
      .setOrigin(0, 0)
      .setGravity(0)
      .setVelocity(0, 0)
      .setAcceleration(0, 0)
      .setAlpha(0);
  }

  /**
   * Получение коллайдеров
   *
   * @returns {StaticGroup}
   */
  get colliders(): StaticGroup {
    return this._colliders;
  }

  /**
   * Получение сенсора гола
   *
   * @returns {Sprite}
   */
  get sensor(): Sprite {
    return this._goalSensor;
  }
}
