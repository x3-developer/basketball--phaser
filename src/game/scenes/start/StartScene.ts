import AbstractScene from '@src/game/scenes/AbstractScene';
import { BackgroundManager, SpriteManager, UI_ELEMENT_KEYS, UIManager } from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена старта игры
 *
 * @class StartScene
 */
export default class StartScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');
  private _spriteManager = this._kernel.resolve<SpriteManager>('SpriteManager');
  private _uiManager = this._kernel.resolve<UIManager>('UIManager');

  constructor() {
    super(SCENE_KEYS.START);
  }

  /**
   * @override
   * @return {void}
   */
  public preload(): void {
    this.cleanPreviousScene(SCENE_KEYS.PRELOAD);
  }

  /**
   * @override
   * @returns {void}
   */
  public create(): void {
    this._backgroundManager.createBackground(this);
    this._uiManager.createText(this);
    this._uiManager.createElements(this);
    this._spriteManager.creteSprite(this);
  }

  /**
   * Очистка сцены
   *
   * @returns {void}
   * @override
   */
  public cleanUpScene(): void {
    this.cleanScene();
    this._uiManager.clearTextures(this, [UI_ELEMENT_KEYS.START_BUTTON]);
    this._uiManager.clearElements(this, [UI_ELEMENT_KEYS.START_BUTTON]);
    this._backgroundManager = null;
    this._spriteManager = null;
    this._uiManager = null;
    this.killScene(SCENE_KEYS.START);
  }
}
