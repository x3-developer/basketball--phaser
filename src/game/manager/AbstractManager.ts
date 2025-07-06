import { Kernel } from '@src/app/config/core';
import { AtlasKeyType, BackgroundKeyType, SoundKeyType, SpriteKeyType, UIElementKeyType } from '@src/game/manager';
import Phaser from 'phaser';
import { LoggerService } from '@src/game/services';

/**
 * Абстрактный класс менеджера
 *
 * @class AbstractManager
 */
export default abstract class AbstractManager<
  T extends BackgroundKeyType | SpriteKeyType | UIElementKeyType | AtlasKeyType | SoundKeyType,
> {
  protected readonly _kernel: Kernel;
  protected readonly _loggerService: LoggerService;

  protected _textures: Map<T, string> = new Map();
  protected _loadedTextures: T[] = [];

  protected constructor() {
    this._kernel = Kernel.Instance;
    this._loggerService = this._kernel.resolve<LoggerService>('LoggerService');
  }

  /**
   * Загрузка ресурсов
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  abstract loadResources(scene: Phaser.Scene): void;

  /**
   * Удаление текстур
   *
   * @param scene {Phaser.Scene}
   * @param textures {T[]}
   * @return {void}
   */
  public clearTextures(scene: Phaser.Scene, textures: T[]): void {
    textures.forEach((texture) => this.clearTexture(scene, texture));
  }

  /**
   * Создание текстуры
   *
   * @param scene {Phaser.Scene}
   * @param texture {T}
   * @return {void}
   * @protected
   */
  protected loadTexture(scene: Phaser.Scene, texture: T): void {
    if (scene.textures.exists(texture)) {
      this._loggerService.warning(`"${texture}" уже существует в текстурах сцены, пропускаем загрузку`);
      return;
    }

    if (this._loadedTextures.includes(texture)) {
      this._loggerService.warning(`"${texture}" уже загружен в ${this.constructor.name}`);
      return;
    }

    const texturePath = this._textures.get(texture);

    if (!texturePath) {
      this._loggerService.warning(`"${texture}" не найден в ${this.constructor.name}`);
      return;
    }

    scene.load.image(texture, texturePath);
    this._loadedTextures.push(texture);
  }

  /**
   * Удаление текстуры
   *
   * @param scene {Phaser.Scene}
   * @param texture {T}
   * @return {void}
   * @protected
   */
  protected clearTexture(scene: Phaser.Scene, texture: T): void {
    if (!this._loadedTextures.includes(texture)) {
      this._loggerService.warning(`"${texture}" не загружен в ${this.constructor.name}`);
      return;
    }
    if (!scene.textures.exists(texture)) {
      this._loggerService.warning(`"${texture}" не существует в сцене`);
      return;
    }

    scene.textures.remove(texture);
    this._loadedTextures = this._loadedTextures.filter((loadedTexture) => loadedTexture !== texture);
  }

  /**
   * Очистка всех текстур
   *
   * @param scene {Phaser.Scene}
   * @return {void}
   */
  public clearAllTextures(scene: Phaser.Scene): void {
    this.clearTextures(scene, this._loadedTextures);
  }
}
