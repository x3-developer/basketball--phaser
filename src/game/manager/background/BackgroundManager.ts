import AbstractManager from '@src/game/manager/AbstractManager';
import { BACKGROUND_ASSETS_PATH, BACKGROUND_KEYS, BackgroundKeyType, IBackgroundOptions } from '@src/game/manager';
import Phaser from 'phaser';
import { SCENE_KEYS, SceneKeyType } from '@src/game/scenes';

/**
 * Менеджер для работы с фонами
 *
 * @class BackgroundManager
 */
export default class BackgroundManager extends AbstractManager<BackgroundKeyType> {
  constructor() {
    super();

    this._textures = new Map([
      [BACKGROUND_KEYS.BLUR_BACKGROUND, `${BACKGROUND_ASSETS_PATH}/intro-blur.jpg`],
      [BACKGROUND_KEYS.WITH_CHAIRS_BACKGROUND, `${BACKGROUND_ASSETS_PATH}/with-chairs.jpg`],
      [BACKGROUND_KEYS.TUTORIAL_BACKGROUND, `${BACKGROUND_ASSETS_PATH}/tutorial.jpg`],
      [BACKGROUND_KEYS.SHADOW_BACKGROUND, `${BACKGROUND_ASSETS_PATH}/shadow.png`],
    ]);
  }

  /**
   * Загрузка ресурсов
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public loadResources(scene: Phaser.Scene): void {
    let textures: BackgroundKeyType[] = [];
    const sceneKey = scene.scene.key as SceneKeyType;

    switch (sceneKey) {
      case SCENE_KEYS.BOOT:
        textures = [
          BACKGROUND_KEYS.BLUR_BACKGROUND,
          BACKGROUND_KEYS.WITH_CHAIRS_BACKGROUND,
          BACKGROUND_KEYS.TUTORIAL_BACKGROUND,
          BACKGROUND_KEYS.SHADOW_BACKGROUND,
        ];
        break;
    }

    textures.forEach((texture) => this.loadTexture(scene, texture));
  }

  /**
   * Создание фона
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public createBackground(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;

    switch (sceneKey) {
      case SCENE_KEYS.PRELOAD:
      case SCENE_KEYS.START:
      case SCENE_KEYS.END:
        this.createBackgroundElement(scene, BACKGROUND_KEYS.BLUR_BACKGROUND);
        break;
      case SCENE_KEYS.TUTORIAL:
      case SCENE_KEYS.SWITCH:
        this.createBackgroundElement(scene, BACKGROUND_KEYS.TUTORIAL_BACKGROUND);
        break;
      case SCENE_KEYS.GAME:
        this.createBackgroundElement(scene, BACKGROUND_KEYS.WITH_CHAIRS_BACKGROUND);
        this.createBackgroundElement(scene, BACKGROUND_KEYS.SHADOW_BACKGROUND, { depth: 3 });
        break;
      default:
        this._loggerService.warning(`Неизвестный background для сцены ${sceneKey}`);
    }
  }

  /**
   * Создание фона
   *
   * @param scene {Phaser.Scene}
   * @param backgroundTexture {BackgroundKeyType}
   * @param options {IBackgroundOptions}
   * @returns {Phaser.GameObjects.Image}
   */
  private createBackgroundElement(
    scene: Phaser.Scene,
    backgroundTexture: BackgroundKeyType,
    options?: IBackgroundOptions,
  ): Phaser.GameObjects.Image {
    const { depth } = options || {};
    const background = scene.add.image(0, 0, backgroundTexture);

    background.setOrigin(0, 0);
    background.setDisplaySize(scene.scale.width, scene.scale.height);

    if (depth !== undefined) {
      background.setDepth(depth);
    }

    return background;
  }
}
