import AbstractManager from '../AbstractManager';
import {
  ANIMATION_ASSETS_PATH,
  ANIMATION_KEYS,
  AnimationKeyType,
  ATLASES_KEYS,
  AtlasKeyType,
  GameStateManager,
  IAnimationOptions,
  IAtlasOptions,
  TEXT_ELEMENT_KEYS,
  UI_ELEMENT_KEYS,
} from '@src/game/manager';
import Phaser from 'phaser';
import { ROUND_ANIMATION, VERSUS_ANIMATION } from '@src/shared/constants/game/elements';
import { UIManager } from '@src/game/manager';
import { SCENE_KEYS, SceneKeyType } from '@src/game/scenes';

/**
 * Менеджер анимаций
 *
 * @class AnimationManager
 */
export default class AnimationManager extends AbstractManager<AtlasKeyType> {
  private readonly _uiManager = this._kernel.resolve<UIManager>('UIManager');
  private readonly _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');

  private readonly _atlases: Map<AtlasKeyType, { path: string; atlas: string }> = new Map([
    [
      ATLASES_KEYS.CROWD,
      { path: `${ANIMATION_ASSETS_PATH}/crowd/crowd.json`, atlas: `${ANIMATION_ASSETS_PATH}/crowd` },
    ],
    [
      ATLASES_KEYS.TUTORIAL,
      { path: `${ANIMATION_ASSETS_PATH}/tutorial/tutorial.json`, atlas: `${ANIMATION_ASSETS_PATH}/tutorial` },
    ],
  ]);
  private readonly _loadedAtlases: Set<AtlasKeyType> = new Set();
  private _crowds: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super();
  }

  /**
   * Загрузка ресурсов
   *
   * @param scene {Phaser.Scene}
   * @return {void}
   */
  public loadResources(scene: Phaser.Scene): void {
    let textures: AtlasKeyType[] = [];
    const sceneKey = scene.scene.key as SceneKeyType;

    switch (sceneKey) {
      case SCENE_KEYS.PRELOAD:
        textures = [ATLASES_KEYS.CROWD, ATLASES_KEYS.TUTORIAL];
        break;
    }

    textures.forEach((atlasTexture) => this.loadAtlas(scene, atlasTexture));
  }

  /**
   * Удаление атласов
   *
   * @param scene {Phaser.Scene}
   * @param atlasTextures {AtlasKeyType[]}
   * @return {void}
   */
  public clearAtlases(scene: Phaser.Scene, atlasTextures: AtlasKeyType[]): void {
    atlasTextures.forEach((atlasTexture) => {
      this.clearAtlas(scene, atlasTexture);
    });
  }

  /**
   * Удаление текстуры
   *
   * @param scene {Phaser.Scene}
   * @param atlasTexture
   * @return {void}
   * @protected
   */
  protected clearAtlas(scene: Phaser.Scene, atlasTexture: AtlasKeyType): void {
    if (!this._loadedAtlases.has(atlasTexture)) {
      this._loggerService.warning(`"${atlasTexture}" не загружен в ${this.constructor.name}`);
      return;
    }
    if (!scene.textures.exists(atlasTexture)) {
      this._loggerService.warning(`"${atlasTexture}" не существует в сцене`);
      return;
    }

    scene.textures.remove(atlasTexture);
    this._loadedAtlases.delete(atlasTexture);
  }

  /**
   * Создание атласа
   *
   * @param scene {Phaser.Scene}
   * @param atlasTexture {AtlasKeyType}
   * @param frame {string}
   * @param options {IAtlasOptions}
   * @returns {Phaser.GameObjects.Sprite}
   */
  public createAtlas(
    scene: Phaser.Scene,
    atlasTexture: AtlasKeyType,
    frame: string,
    options?: IAtlasOptions,
  ): Phaser.GameObjects.Sprite {
    const { x = 0, y = 0, origins, scales, depth } = options || {};
    const atlas = scene.add.sprite(x, y, atlasTexture, frame);

    if (origins) {
      atlas.setOrigin(origins.originX, origins.originY);
    }

    if (scales) {
      atlas.setScale(scales.scaleX, scales.scaleY);
    }

    if (depth !== undefined) {
      atlas.setDepth(depth);
    }

    return atlas;
  }

  /**
   * Создание анимации
   *
   * @param scene {Phaser.Scene}
   * @param config {IAnimationOptions}
   * @returns {void}
   */
  public createAnimation(scene: Phaser.Scene, config: IAnimationOptions): void {
    const { key, textureKey, framesConfig, frameRate, repeat } = config;
    if (scene.anims.exists(key)) return;

    const frames = scene.anims.generateFrameNames(textureKey, {
      prefix: framesConfig.prefix || '',
      suffix: framesConfig.suffix || '',
      start: framesConfig.start,
      end: framesConfig.end,
      zeroPad: framesConfig.zeroPad,
      frames: framesConfig.frames,
    });

    scene.anims.create({
      key,
      frames,
      frameRate: frameRate || 24,
      repeat: repeat || 0,
    });
  }

  /**
   * Очистка анимации
   *
   * @param scene {Phaser.Scene}
   * @param animationKey {AnimationKeyType}
   */
  public clearAnimation(scene: Phaser.Scene, animationKey: AnimationKeyType): void {
    if (scene.anims.exists(animationKey)) {
      scene.anims.remove(animationKey);
    }
  }

  /**
   * Воспроизведение анимации спрайта
   *
   * @param sprite {Phaser.GameObjects.Sprite}
   * @param animationKey {AnimationKeyType}
   * @returns {Phaser.GameObjects.Sprite}
   */
  private playSpriteAnimation(
    sprite: Phaser.GameObjects.Sprite,
    animationKey: AnimationKeyType,
  ): Phaser.GameObjects.Sprite {
    if (!sprite.scene.anims.exists(animationKey)) {
      this._loggerService.error(`Анимация ${animationKey} не найдена`);
      return;
    }

    return sprite.play(animationKey);
  }

  /**
   * Анимация показа противников
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public playVersusAnimation(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;

    const animationDuration = 500;
    const animationEase = 'Quad.out';
    const [blurLine, versusElement, playerFlag, opponentFlag] = this._uiManager.getUIElementsByKeys([
      UI_ELEMENT_KEYS.BLUR_LINE,
      UI_ELEMENT_KEYS.VERSUS,
      UI_ELEMENT_KEYS.PLAYER_FLAG,
      UI_ELEMENT_KEYS.OPPONENT_FLAG,
    ]);
    const [playerText, opponentText] = this._uiManager.getTextElementsByKeys([
      TEXT_ELEMENT_KEYS.PLAYER_VERSUS,
      TEXT_ELEMENT_KEYS.OPPONENT_VERSUS,
    ]);

    scene.tweens.add({
      targets: { height: 0 },
      height: 117,
      duration: animationDuration,
      ease: animationEase,
      onUpdate: (tween) => {
        const currentHeight = tween.getValue();

        blurLine.setDisplaySize(scene.scale.width, currentHeight);
      },
      onComplete: () => {
        scene.tweens.add({
          targets: versusElement,
          displayWidth: VERSUS_ANIMATION.VERSUS_ELEMENT.DISPLAY_WIDTH,
          displayHeight: VERSUS_ANIMATION.VERSUS_ELEMENT.DISPLAY_HEIGHT,
          duration: animationDuration,
          ease: animationEase,
          onComplete: () => {
            if (sceneKey === SCENE_KEYS.TUTORIAL) {
              this.playTutorialAnimation(scene);
            }

            if (sceneKey === SCENE_KEYS.SWITCH) {
              this.playPeriodAnimation(scene);
            }
          },
        });
        scene.tweens.add({
          targets: [playerFlag, opponentFlag, playerText, opponentText],
          alpha: 1,
          duration: animationDuration,
          ease: animationEase,
        });
      },
    });
  }

  /**
   * Анимация смены периода
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public playPeriodAnimation(scene: Phaser.Scene): void {
    const animationDuration = 500;
    const animationEase = 'Quad.out';
    const [roundLine] = this._uiManager.getUIElementsByKeys([UI_ELEMENT_KEYS.ROUND_LINE]);
    const [roundText] = this._uiManager.getTextElementsByKeys([TEXT_ELEMENT_KEYS.ROUND_TEXT]);

    scene.tweens.add({
      targets: { width: 0 },
      width: ROUND_ANIMATION.ROUND_LINE.DISPLAY_WIDTH,
      duration: animationDuration,
      ease: animationEase,
      onUpdate: (tween) => {
        const currentWidth = tween.getValue();

        roundLine.setDisplaySize(currentWidth, ROUND_ANIMATION.ROUND_LINE.DISPLAY_HEIGHT);
      },
      onComplete: () => {
        scene.tweens.add({
          targets: [roundText],
          alpha: 1,
          duration: animationDuration,
          ease: animationEase,
          onComplete: () => {
            const fadeDuration = 300;
            const fadeDelay = 1000;

            scene.time.delayedCall(1000, () => {
              scene.cameras.main.fade(fadeDuration);
              scene.time.delayedCall(fadeDelay, () => {
                this._gameStateManager.changePeriod();

                scene.scene.start(SCENE_KEYS.GAME);
              });
            });
          },
        });
      },
    });
  }

  /**
   * Анимация конфетти
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public playConfettiAnimation(scene: Phaser.Scene): void {
    const [confetti] = this._uiManager.getUIElementsByKeys([UI_ELEMENT_KEYS.CONFETTI]);

    scene.tweens.add({
      targets: confetti,
      y: scene.scale.height,
      duration: 2000,
      ease: 'Linear',
    });
  }

  /**
   * Загрузка атласа
   *
   * @param scene {Phaser.Scene}
   * @param atlasTexture {AtlasKeyType}
   * @returns {void}
   * @private
   */
  private loadAtlas(scene: Phaser.Scene, atlasTexture: AtlasKeyType): void {
    if (this._loadedAtlases.has(atlasTexture)) {
      this._loggerService.warning(`Атлас "${atlasTexture}" уже загружен в AnimationManager`);
      return;
    }

    const atlas = this._atlases.get(atlasTexture);

    if (!atlas) {
      this._loggerService.warning(`Атлас "${atlasTexture}" не найден в AnimationManager`);
      return;
    }

    scene.load.multiatlas(atlasTexture, atlas.path, atlas.atlas);
    this._loadedAtlases.add(atlasTexture);
  }

  /**
   * Воспроизведение анимации туториала
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public playTutorialAnimation(scene: Phaser.Scene): void {
    this.createAnimation(scene, {
      key: ANIMATION_KEYS.TUTORIAL,
      textureKey: ATLASES_KEYS.TUTORIAL,
      framesConfig: {
        prefix: 'fps_',
        suffix: '.png',
        start: 0,
        end: 296,
        zeroPad: 5,
      },
      frameRate: 30,
    });

    const tutorialAnimation = this.createAtlas(scene, ATLASES_KEYS.TUTORIAL, '', {
      x: scene.scale.width / 2,
      y: scene.scale.height / 2,
      scales: {
        scaleX: 2,
        scaleY: 2,
      },
    });

    this.playSpriteAnimation(tutorialAnimation, ANIMATION_KEYS.TUTORIAL);

    tutorialAnimation.on('animationcomplete', () => {
      const fadeDuration = 300;
      const fadeDelay = 400;

      scene.cameras.main.fade(fadeDuration);

      scene.time.delayedCall(fadeDelay, () => {
        scene.scene.start(SCENE_KEYS.GAME);
      });
    });
  }

  /**
   * Создание анимации толпы
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public createCrowdAnimation(scene: Phaser.Scene): void {
    this._crowds = [];

    const animations = [
      { key: ANIMATION_KEYS.CHILL_CROWD, start: 48, end: 96, repeat: -1 },
      { key: ANIMATION_KEYS.SAD_CROWD, start: 96, end: 144, repeat: 0 },
      { key: ANIMATION_KEYS.HAPPY_CROWD, start: 0, end: 48, repeat: 0 },
    ];
    const crowdY = 250;
    const crowdScale = 1.3;
    const crowdOrigin = 0;
    animations.forEach(({ key, start, end, repeat }) => {
      this.createAnimation(scene, {
        key,
        textureKey: ATLASES_KEYS.CROWD,
        framesConfig: {
          start,
          end,
          prefix: key.replace('CrowdAnimation', '_'),
          zeroPad: 5,
          suffix: '.png',
        },
        frameRate: 30,
        repeat,
      });
    });

    const crowdLeftAnimation = this.createAtlas(scene, ATLASES_KEYS.CROWD, '', {
      x: 264,
      y: crowdY,
      scales: {
        scaleX: crowdScale,
        scaleY: crowdScale,
      },
      origins: {
        originX: crowdOrigin,
        originY: crowdOrigin,
      },
    });
    const crowdRightAnimation = this.createAtlas(scene, ATLASES_KEYS.CROWD, '', {
      x: 910,
      y: crowdY,
      scales: {
        scaleX: crowdScale,
        scaleY: crowdScale,
      },
      origins: {
        originX: crowdOrigin,
        originY: crowdOrigin,
      },
    });

    this._crowds.push(crowdLeftAnimation);
    this._crowds.push(crowdRightAnimation);

    this.playCrowdChillAnimation();
  }

  /**
   * Воспроизведение анимации спокойной толпы
   *
   * @returns {void}
   */
  public playCrowdChillAnimation(): void {
    this._crowds.forEach((crowd) => {
      this.playSpriteAnimation(crowd, ANIMATION_KEYS.CHILL_CROWD);
    });
  }

  /**
   * Воспроизведение анимации счастливой толпы
   *
   * @returns {void}
   */
  public playCrowdHappyAnimation(): void {
    this._crowds.forEach((crowd) => {
      this.playSpriteAnimation(crowd, ANIMATION_KEYS.HAPPY_CROWD);

      crowd.on('animationcomplete', () => this.playSpriteAnimation(crowd, ANIMATION_KEYS.CHILL_CROWD));
    });
  }

  /**
   * Воспроизведение анимации грустной толпы
   *
   * @returns {void}
   */
  public playCrowdSadAnimation(): void {
    this._crowds.forEach((crowd) => {
      this.playSpriteAnimation(crowd, ANIMATION_KEYS.SAD_CROWD);

      crowd.on('animationcomplete', () => this.playSpriteAnimation(crowd, ANIMATION_KEYS.CHILL_CROWD));
    });
  }
}
