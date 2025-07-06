import AbstractScene from '@src/game/scenes/AbstractScene';
import { AnimationManager, BackgroundManager, SpriteManager, UIManager } from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена конца игры
 *
 * @class EndScene
 */
export default class EndScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');
  private _spriteManager = this._kernel.resolve<SpriteManager>('SpriteManager');
  private _uiManager = this._kernel.resolve<UIManager>('UIManager');
  private _animationManager = this._kernel.resolve<AnimationManager>('AnimationManager');

  constructor() {
    super(SCENE_KEYS.END);
  }

  public preload(): void {
    this.cleanPreviousScene(SCENE_KEYS.GAME);
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

    this._animationManager.playConfettiAnimation(this);
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
    this._spriteManager = null;
    this._uiManager = null;
    this._animationManager = null;
    this.killScene(SCENE_KEYS.GAME);
  }
}
