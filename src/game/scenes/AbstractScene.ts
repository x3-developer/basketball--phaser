import { Kernel } from '@src/app/config/core';
import { SceneKeyType } from '@src/game/scenes';

/**
 * Абстрактный класс сцены
 *
 * @class AbstractScene
 * @extends {Phaser.Scene}
 */
export default abstract class AbstractScene extends Phaser.Scene {
  protected readonly _kernel: Kernel;

  protected constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);

    this._kernel = Kernel.Instance;
  }

  /**
   * Очистка сцены
   *
   * @return {void}
   * @abstract
   */
  abstract cleanUpScene(): void;

  /**
   * Очистка предыдущей сцены
   *
   * @param sceneKey {SceneKeyType}
   * @return {void}
   */
  public cleanPreviousScene(sceneKey: SceneKeyType): void {
    let scene = this.scene.get(sceneKey) as AbstractScene;
    if (scene && scene.cleanScene) {
      scene.cleanUpScene();
      scene = null;
    }
  }

  /**
   * Очистка сцены
   *
   * @return {void}
   * @protected
   */
  protected cleanScene(): void {
    this._kernel.clearScope();

    // Удаление всех таймеров
    this.time.removeAllEvents();

    // Удаление всех твинов
    this.tweens.killAll();

    // Удаление всех событий
    this.events.removeAllListeners();
    this.input.removeAllListeners();

    // Удаление всех объектов
    this.children.removeAll(true);
  }

  /**
   * Удаление сцены
   *
   * @param sceneKey {SceneKeyType}
   * @return {void}
   * @protected
   */
  protected killScene(sceneKey: SceneKeyType): void {
    this.scene.stop(sceneKey);
    this.scene.remove(sceneKey);
  }
}
