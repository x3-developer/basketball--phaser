import AbstractManager from '../AbstractManager';
import Phaser from 'phaser';
import { SOUND_KEYS, SOUND_PATH, SoundKeyType } from '@src/game/manager';
import { SCENE_KEYS, SceneKeyType } from '@src/game/scenes';

/**
 * Менеджер для работы со звуком
 *
 * @class SoundManager
 */
export default class SoundManager extends AbstractManager<SoundKeyType> {
  private readonly _sounds: Map<SoundKeyType, string> = new Map([
    [SOUND_KEYS.BACKGROUND, `${SOUND_PATH}/background.mp3`],
    [SOUND_KEYS.HIT, `${SOUND_PATH}/hit.wav`],
    [SOUND_KEYS.THROW, `${SOUND_PATH}/throw.wav`],
    [SOUND_KEYS.APPLAUSE, `${SOUND_PATH}/applause.mp3`],
  ]);
  private _isSoundOn: boolean = true;

  constructor() {
    super();
  }

  /**
   * Загрузка ресурсов
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public loadResources(scene: Phaser.Scene): void {
    let soundKeys: SoundKeyType[] = [];
    const sceneKey = scene.scene.key as SceneKeyType;

    switch (sceneKey) {
      case SCENE_KEYS.PRELOAD:
        soundKeys = [SOUND_KEYS.BACKGROUND, SOUND_KEYS.HIT, SOUND_KEYS.THROW, SOUND_KEYS.APPLAUSE];
        break;
      default:
        this._loggerService.warning(`Загрузка звуков не поддерживается для сцены ${sceneKey}`);
    }

    soundKeys.forEach((soundKey) => this.loadSound(scene, soundKey));
  }

  /**
   * Воспроизведение звука
   *
   * @param scene {Phaser.Scene}
   * @param soundKey {string}
   * @param isOverlay {boolean}
   * @param options {Phaser.Types.Sound.SoundConfig}
   * @returns {void}
   */
  public playSound(
    scene: Phaser.Scene,
    soundKey: string,
    isOverlay: boolean = false,
    options?: Phaser.Types.Sound.SoundConfig,
  ): void {
    if (!this._isSoundOn) return;

    if (this._sounds.has(soundKey)) {
      if (!isOverlay) {
        const isPlaying = scene.sound.get(soundKey)?.isPlaying;
        if (isPlaying) return;
      }

      scene.sound.play(soundKey, options);
    } else {
      this._loggerService.error(`Звук ${soundKey} не найден в SoundManager.`);
    }
  }

  /**
   * Остановка звука
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public stopSounds(scene: Phaser.Scene): void {
    scene.sound.pauseAll();

    this._isSoundOn = false;
  }

  /**
   * Возобновление звука
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public resumeSounds(scene: Phaser.Scene): void {
    scene.sound.resumeAll();

    this._isSoundOn = true;
  }

  /**
   * Загрузка звука
   *
   * @param scene {Phaser.Scene}
   * @param soundKey {string}
   * @returns {void}
   * @private
   */
  private loadSound(scene: Phaser.Scene, soundKey: string): void {
    if (this._sounds.has(soundKey)) {
      scene.load.audio(soundKey, this._sounds.get(soundKey));
    } else {
      this._loggerService.error(`Звук ${soundKey} не найден в SoundManager.`);
    }
  }

  /**
   * Поле для получения состояния звука
   *
   * @returns {boolean}
   */
  get isSoundOn(): boolean {
    return this._isSoundOn;
  }
}
