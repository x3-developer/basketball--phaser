import AbstractScene from '@src/game/scenes/AbstractScene';
import {
  ANIMATION_KEYS,
  AnimationManager,
  ATLASES_KEYS,
  BackgroundManager,
  UI_ELEMENT_KEYS,
  UIManager,
} from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена с обучением
 *
 * @class TutorialScene
 */
export default class TutorialScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');
  private _animationManager = this._kernel.resolve<AnimationManager>('AnimationManager');
  private _uiManager = this._kernel.resolve<UIManager>('UIManager');

  constructor() {
    super(SCENE_KEYS.TUTORIAL);
  }

  /**
   * @override
   * @return {void}
   */
  public preload(): void {
    this.cleanPreviousScene(SCENE_KEYS.START);
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
    this._uiManager.clearTextures(this, [UI_ELEMENT_KEYS.SKIP_BUTTON]);
    this._uiManager.clearElements(this, [UI_ELEMENT_KEYS.SKIP_BUTTON]);
    this._animationManager.clearAtlases(this, [ATLASES_KEYS.TUTORIAL]);
    this._animationManager.clearAnimation(this, ANIMATION_KEYS.TUTORIAL);
    this._backgroundManager = null;
    this._animationManager = null;
    this._uiManager = null;
    this.killScene(SCENE_KEYS.START);
  }
}
