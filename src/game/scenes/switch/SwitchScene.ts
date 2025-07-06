import AbstractScene from '@src/game/scenes/AbstractScene';
import { AnimationManager, BACKGROUND_KEYS, BackgroundManager, UIManager } from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена перехода между раундами
 *
 * @class SwitchScene
 */
export default class SwitchScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');
  private _animationManager = this._kernel.resolve<AnimationManager>('AnimationManager');
  private _uiManager = this._kernel.resolve<UIManager>('UIManager');

  constructor() {
    super(SCENE_KEYS.SWITCH);
  }

  /**
   * @override
   * @returns {void}
   */
  public create(): void {
    this._backgroundManager.createBackground(this);
    this._uiManager.createElements(this);
    this._uiManager.createText(this);

    this._animationManager.playVersusAnimation(this);
  }

  /**
   * Очистка сцены
   *
   * @returns {void}
   * @override
   */
  public cleanUpScene(): void {
    this.cleanScene();
    this._backgroundManager.clearTextures(this, [BACKGROUND_KEYS.TUTORIAL_BACKGROUND]);
    this._backgroundManager = null;
    this._animationManager = null;
    this._uiManager = null;
    this.killScene(SCENE_KEYS.TUTORIAL);
  }
}
