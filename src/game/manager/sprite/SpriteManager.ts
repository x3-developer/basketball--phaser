import Phaser from 'phaser';
import {
  GameStateManager,
  IGameObjectOptions,
  SPRITE_ASSETS_PATH,
  SPRITE_KEYS,
  SpriteKeyType,
} from '@src/game/manager';
import AbstractManager from '../AbstractManager';
import { SCENE_KEYS, SceneKeyType } from '@src/game/scenes';

/**
 * Менеджер для загрузки спрайтов
 *
 * @class SpriteManager
 */
export default class SpriteManager extends AbstractManager<SpriteKeyType> {
  private readonly _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');
  private readonly _createdSprites: Map<SpriteKeyType, Phaser.GameObjects.Image> = new Map();

  constructor() {
    super();

    this._textures = new Map([
      [SPRITE_KEYS.FIELD, `${SPRITE_ASSETS_PATH}/field/field.png`],
      [SPRITE_KEYS.BALL, `${SPRITE_ASSETS_PATH}/ball/ball.png`],
      [SPRITE_KEYS.BASKET, `${SPRITE_ASSETS_PATH}/basket/basket.png`],
      [SPRITE_KEYS.STATIC_RACK, `${SPRITE_ASSETS_PATH}/basket/static_rack.png`],
      [SPRITE_KEYS.DYNAMIC_RACK, `${SPRITE_ASSETS_PATH}/basket/dynamic_rack.png`],
      [SPRITE_KEYS.SHIELD, `${SPRITE_ASSETS_PATH}/basket/shield.png`],
      [SPRITE_KEYS.GREEN_CIRCLE_TRAJECTORY, `${SPRITE_ASSETS_PATH}/trajectory/circle_green.png`],
      [SPRITE_KEYS.YELLOW_CIRCLE_TRAJECTORY, `${SPRITE_ASSETS_PATH}/trajectory/circle_yellow.png`],
      [SPRITE_KEYS.RED_CIRCLE_TRAJECTORY, `${SPRITE_ASSETS_PATH}/trajectory/circle_red.png`],
      [SPRITE_KEYS.GREEN_TRIANGLE_TRAJECTORY, `${SPRITE_ASSETS_PATH}/trajectory/triangle_green.png`],
      [SPRITE_KEYS.YELLOW_TRIANGLE_TRAJECTORY, `${SPRITE_ASSETS_PATH}/trajectory/triangle_yellow.png`],
      [SPRITE_KEYS.RED_TRIANGLE_TRAJECTORY, `${SPRITE_ASSETS_PATH}/trajectory/triangle_red.png`],
    ]);
  }

  /**
   * Загрузка ресурсов
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public loadResources(scene: Phaser.Scene): void {
    let textures: SpriteKeyType[] = [];
    const sceneKey = scene.scene.key as SceneKeyType;

    switch (sceneKey) {
      case SCENE_KEYS.PRELOAD:
        textures = [
          SPRITE_KEYS.FIELD,
          SPRITE_KEYS.BALL,
          SPRITE_KEYS.BASKET,
          SPRITE_KEYS.STATIC_RACK,
          SPRITE_KEYS.DYNAMIC_RACK,
          SPRITE_KEYS.SHIELD,
          SPRITE_KEYS.GREEN_CIRCLE_TRAJECTORY,
          SPRITE_KEYS.YELLOW_CIRCLE_TRAJECTORY,
          SPRITE_KEYS.RED_CIRCLE_TRAJECTORY,
          SPRITE_KEYS.GREEN_TRIANGLE_TRAJECTORY,
          SPRITE_KEYS.YELLOW_TRIANGLE_TRAJECTORY,
          SPRITE_KEYS.RED_TRIANGLE_TRAJECTORY,
        ];
        break;
    }

    textures.forEach((texture) => this.loadTexture(scene, texture));
  }

  /**
   * Создание спрайтов
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public creteSprite(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;

    if (sceneKey === SCENE_KEYS.START || sceneKey === SCENE_KEYS.END) {
      this.createBall(scene);
    }
  }

  /**
   * Создание спрайта изображения
   *
   * @param scene {Phaser.Scene}
   * @param textureKey {SpriteKeyType}
   * @param options {IGameObjectOptions}
   * @returns {Phaser.GameObjects.Image}
   */
  public createImageSprite(
    scene: Phaser.Scene,
    textureKey: SpriteKeyType,
    options?: IGameObjectOptions,
  ): Phaser.GameObjects.Image {
    const { x = 0, y = 0, displaySizes, origins, depth } = options || {};
    const object = scene.add.image(x, y, textureKey);

    // ширина и высота объекта
    if (displaySizes) {
      object.setDisplaySize(displaySizes.displayWidth, displaySizes.displayHeight);
    }

    // точка отсчета объекта
    if (origins) {
      object.setOrigin(origins.originX, origins.originY);
    }

    // глубина объекта
    if (depth !== undefined) {
      object.setDepth(depth);
    }

    this._createdSprites.set(textureKey, object);

    return object;
  }

  /**
   * Создание спрайта мяча
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createBall(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;
    if (sceneKey === SCENE_KEYS.END && this._gameStateManager.playerScore <= this._gameStateManager.computerScore)
      return;

    let ballX = 970; // позиция для сцены START
    let ballY = 280; // позиция для сцены START

    if (sceneKey === SCENE_KEYS.END) {
      ballX = 613;
      ballY = 280;
    }

    this.createImageSprite(scene, SPRITE_KEYS.BALL, {
      x: ballX,
      y: ballY,
      displaySizes: {
        displayWidth: 96,
        displayHeight: 90,
      },
      origins: {
        originX: 0,
        originY: 0,
      },
    });
  }
}
