import AbstractScene from '@src/game/scenes/AbstractScene';
import { BackgroundManager } from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена загрузки
 *
 * @class BootScene
 */
export default class BootScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');

  constructor() {
    super(SCENE_KEYS.BOOT);
  }

  /**
   * @override
   * @returns {void}
   */
  public preload(): void {
    this._backgroundManager.loadResources(this);

    this.load.once('complete', () => {
      this.scene.start(SCENE_KEYS.PRELOAD);
    });
  }

  /**
   * Очистка сцены
   *
   * @returns {void}
   * @override
   */
  public cleanUpScene(): void {
    this.cleanScene();
    this._backgroundManager = null;
    this.killScene(SCENE_KEYS.BOOT);
  }
}
