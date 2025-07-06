import AbstractScene from '@src/game/scenes/AbstractScene';
import { AnimationManager, BackgroundManager, SpriteManager, UIManager, SoundManager } from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена предзагрузки ресурсов
 *
 * @class PreloadScene
 */
export default class PreloadScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');
  private _spriteManager = this._kernel.resolve<SpriteManager>('SpriteManager');
  private _uiManager = this._kernel.resolve<UIManager>('UIManager');
  private _animationManager = this._kernel.resolve<AnimationManager>('AnimationManager');
  private _soundManager = this._kernel.resolve<SoundManager>('SoundManager');

  constructor() {
    super(SCENE_KEYS.PRELOAD);
  }

  /**
   * @override
   * @returns {void}
   */
  public preload(): void {
    this.cleanPreviousScene(SCENE_KEYS.BOOT);

    this._backgroundManager.createBackground(this);
    this._uiManager.createText(this);

    this._uiManager.loadResources(this);
    this._spriteManager.loadResources(this);
    this._animationManager.loadResources(this);
    this._soundManager.loadResources(this);

    this.load.once('complete', () => {
      this.scene.start(SCENE_KEYS.START);
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
    this._spriteManager = null;
    this._uiManager = null;
    this._animationManager = null;
    this._soundManager = null;
    this.killScene(SCENE_KEYS.PRELOAD);
  }
}
