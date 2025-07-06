import WebFont from 'webfontloader';
import {
  FONT_FAMILY,
  INTERFACE_BUTTON_OPTIONS,
  ITextOptions,
  IUIElementOptions,
  TEXT_ELEMENT_KEYS,
  TextElementKeyType,
  UI_ASSETS_PATH,
  UI_ELEMENT_KEYS,
  UIElementKeyType,
} from './types/ui.types';
import Phaser from 'phaser';
import { SCENE_KEYS, SceneKeyType } from '@src/game/scenes';
import { AbstractManager, GameStateManager, SoundManager, THROW_STATUS } from '@src/game/manager';

/**
 * Менеджер для работы с UI
 *
 * @class UIManager
 */
export default class UIManager extends AbstractManager<UIElementKeyType> {
  private readonly _eventBus = this._kernel.resolve<Phaser.Events.EventEmitter>('EventBus');
  private readonly _soundManager = this._kernel.resolve<SoundManager>('SoundManager');
  private readonly _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');

  private readonly _createdUIElements: Map<UIElementKeyType, Phaser.GameObjects.Image> = new Map();
  private readonly _createdTextElements: Map<TextElementKeyType, Phaser.GameObjects.Text> = new Map();
  private _isFontLoaded = false;
  private _playerTurns: Phaser.GameObjects.Image[] = [];
  private _opponentTurns: Phaser.GameObjects.Image[] = [];

  constructor() {
    super();

    this._textures = new Map([
      [UI_ELEMENT_KEYS.START_BUTTON, `${UI_ASSETS_PATH}/button/start.png`],
      [UI_ELEMENT_KEYS.NEXT_BUTTON, `${UI_ASSETS_PATH}/button/next.png`],
      [UI_ELEMENT_KEYS.SKIP_BUTTON, `${UI_ASSETS_PATH}/button/skip.png`],
      [UI_ELEMENT_KEYS.BURGER_BUTTON, `${UI_ASSETS_PATH}/button/burger.png`],
      [UI_ELEMENT_KEYS.SOUND_ON_BUTTON, `${UI_ASSETS_PATH}/button/sound_on.png`],
      [UI_ELEMENT_KEYS.SOUND_OFF_BUTTON, `${UI_ASSETS_PATH}/button/sound_off.png`],
      [UI_ELEMENT_KEYS.EXIT_BUTTON, `${UI_ASSETS_PATH}/button/exit.png`],
      [UI_ELEMENT_KEYS.SCOREBOARD, `${UI_ASSETS_PATH}/scoreboard/scoreboard.png`],
      [UI_ELEMENT_KEYS.PLAYER_FLAG, `${UI_ASSETS_PATH}/scoreboard/player-flag.png`],
      [UI_ELEMENT_KEYS.OPPONENT_FLAG, `${UI_ASSETS_PATH}/scoreboard/computer-flag.png`],
      [UI_ELEMENT_KEYS.EMPTY_TURN, `${UI_ASSETS_PATH}/scoreboard/turn-empty.png`],
      [UI_ELEMENT_KEYS.CURRENT_TURN, `${UI_ASSETS_PATH}/scoreboard/turn-current.png`],
      [UI_ELEMENT_KEYS.SUCCESS_TURN, `${UI_ASSETS_PATH}/scoreboard/turn-success.png`],
      [UI_ELEMENT_KEYS.FAIL_TURN, `${UI_ASSETS_PATH}/scoreboard/turn-fail.png`],
      [UI_ELEMENT_KEYS.BLUR_LINE, `${UI_ASSETS_PATH}/heap/blur-line.png`],
      [UI_ELEMENT_KEYS.ROUND_LINE, `${UI_ASSETS_PATH}/heap/round-line.png`],
      [UI_ELEMENT_KEYS.VERSUS, `${UI_ASSETS_PATH}/heap/versus.png`],
      [UI_ELEMENT_KEYS.VERSUS, `${UI_ASSETS_PATH}/heap/versus.png`],
      [UI_ELEMENT_KEYS.CONFETTI, `${UI_ASSETS_PATH}/heap/confetti.png`],
      [UI_ELEMENT_KEYS.SCORE_LINE, `${UI_ASSETS_PATH}/heap/score-line.png`],
    ]);
  }

  /**
   * Загрузка ресурсов
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public loadResources(scene: Phaser.Scene): void {
    let textures: UIElementKeyType[] = [];
    const sceneKey = scene.scene.key as SceneKeyType;

    switch (sceneKey) {
      case SCENE_KEYS.PRELOAD:
        textures = [
          UI_ELEMENT_KEYS.START_BUTTON,
          UI_ELEMENT_KEYS.NEXT_BUTTON,
          UI_ELEMENT_KEYS.SKIP_BUTTON,
          UI_ELEMENT_KEYS.BURGER_BUTTON,
          UI_ELEMENT_KEYS.SOUND_ON_BUTTON,
          UI_ELEMENT_KEYS.SOUND_OFF_BUTTON,
          UI_ELEMENT_KEYS.EXIT_BUTTON,
          UI_ELEMENT_KEYS.SCOREBOARD,
          UI_ELEMENT_KEYS.PLAYER_FLAG,
          UI_ELEMENT_KEYS.OPPONENT_FLAG,
          UI_ELEMENT_KEYS.EMPTY_TURN,
          UI_ELEMENT_KEYS.CURRENT_TURN,
          UI_ELEMENT_KEYS.SUCCESS_TURN,
          UI_ELEMENT_KEYS.FAIL_TURN,
          UI_ELEMENT_KEYS.BLUR_LINE,
          UI_ELEMENT_KEYS.ROUND_LINE,
          UI_ELEMENT_KEYS.VERSUS,
          UI_ELEMENT_KEYS.CONFETTI,
          UI_ELEMENT_KEYS.SCORE_LINE,
        ];
        break;
    }

    textures.forEach((texture) => this.loadTexture(scene, texture));
  }

  /**
   * Создание UI элемента
   *
   * @param scene {Phaser.Scene}
   * @param uiElementTexture {UIElementKeyType}
   * @param options {IUIElementOptions}
   * @return {Phaser.GameObjects.Image}
   */
  private createUIElement(
    scene: Phaser.Scene,
    uiElementTexture: UIElementKeyType,
    options?: IUIElementOptions,
  ): Phaser.GameObjects.Image {
    const { x = 0, y = 0, displaySizes, origins, isInteractive, cursorOnHover, alpha, depth } = options || {};

    const uiElement = scene.add.image(x, y, uiElementTexture);

    if (displaySizes) {
      uiElement.setDisplaySize(displaySizes.displayWidth, displaySizes.displayHeight);
    }

    if (origins) {
      uiElement.setOrigin(origins.originX, origins.originY);
    }

    if (isInteractive) {
      uiElement.setInteractive();

      if (cursorOnHover) {
        uiElement.on('pointerover', () => scene.input.setDefaultCursor(cursorOnHover));
        uiElement.on('pointerout', () => scene.input.setDefaultCursor('default'));
      }
    }

    if (alpha !== undefined) {
      uiElement.setAlpha(alpha);
    }

    if (depth !== undefined) {
      uiElement.setDepth(depth);
    }

    this._createdUIElements.set(uiElementTexture, uiElement);

    return uiElement;
  }

  /**
   * Создание текстового элемента
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   */
  public createText(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;

    if (sceneKey === SCENE_KEYS.PRELOAD || sceneKey === SCENE_KEYS.START || sceneKey === SCENE_KEYS.END) {
      this.createScreenTitleText(scene);
    }

    if (sceneKey === SCENE_KEYS.TUTORIAL || sceneKey === SCENE_KEYS.SWITCH) {
      this.createVersusText(scene);
    }

    if (sceneKey === SCENE_KEYS.GAME || sceneKey === SCENE_KEYS.END) {
      this.createScoreText(scene);
    }

    if (sceneKey === SCENE_KEYS.SWITCH) {
      this.createRoundText(scene);
    }

    if (sceneKey === SCENE_KEYS.END) {
      this.createConfetti(scene);
    }
  }

  /**
   * Создание UI элементов
   *
   * @param scene {Phaser.Scene}
   * @return {void}
   */
  public createElements(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;

    if (sceneKey === SCENE_KEYS.START) {
      this.createStartButton(scene);
    }

    if (sceneKey === SCENE_KEYS.TUTORIAL) {
      this.createSkipButton(scene);
      this.createVersusElements(scene);
    }

    if (sceneKey === SCENE_KEYS.GAME) {
      this.createBurgerButton(scene);
      this.createSoundButton(scene);
      this.createExitButton(scene);
      this.createScoreboard(scene);
    }

    if (sceneKey === SCENE_KEYS.SWITCH) {
      this.createVersusElements(scene);
      this.createRoundLine(scene);
    }

    if (sceneKey === SCENE_KEYS.END) {
      this.createConfetti(scene);
      this.createScoreboard(scene);
      this.createNextButton(scene);
    }
  }

  /**
   * Получение UI элементов по ключам
   *
   * @param elementKey {UIElementKeyType[]}
   * @return {Phaser.GameObjects.Image[]}
   */
  public getUIElementsByKeys(elementKey: UIElementKeyType[]): Phaser.GameObjects.Image[] {
    const elements: Phaser.GameObjects.Image[] = [];

    for (const key of elementKey) {
      const element = this._createdUIElements.get(key);
      if (element) {
        elements.push(element);
      }
    }

    return elements;
  }

  /**
   * Получение текстовых элементов по ключам
   *
   * @param elementKey {TextElementKeyType[]}
   * @return {Phaser.GameObjects.Text[]}
   */
  public getTextElementsByKeys(elementKey: TextElementKeyType[]): Phaser.GameObjects.Text[] {
    const elements: Phaser.GameObjects.Text[] = [];

    for (const key of elementKey) {
      const element = this._createdTextElements.get(key);
      if (element) {
        elements.push(element);
      }
    }

    return elements;
  }

  /**
   * Создание текстового элемента
   *
   * @param scene {Phaser.Scene}
   * @param x {number}
   * @param y {number}
   * @param textKey {TextElementKeyType}
   * @param content {string}
   * @param style {Phaser.Types.GameObjects.Text.TextStyle}
   * @param options {ITextOptions}
   * @return {Phaser.GameObjects.Text}
   */
  private createTextElement(
    scene: Phaser.Scene,
    x: number,
    y: number,
    textKey: TextElementKeyType,
    content: string,
    style: Phaser.Types.GameObjects.Text.TextStyle,
    options?: ITextOptions,
  ): Phaser.GameObjects.Text {
    let text: Phaser.GameObjects.Text;

    const create = (): Phaser.GameObjects.Text => {
      text = scene.add.text(x, y, content, style);
      text = this.setTextOptions(text, options);

      this._createdTextElements.set(textKey, text);

      return text;
    };

    if (this._isFontLoaded) {
      return create();
    }

    WebFont.load({
      custom: {
        families: [FONT_FAMILY],
      },
      active: () => {
        this._isFontLoaded = true;

        return create();
      },
    });
  }

  /**
   * Установка опций текста
   *
   * @param text {Phaser.GameObjects.Text}
   * @param options {ITextOptions}
   * @returns {Phaser.GameObjects.Text}
   * @private
   */
  private setTextOptions(text: Phaser.GameObjects.Text, options: ITextOptions): Phaser.GameObjects.Text {
    const { alpha, depth } = options || {};

    text.setOrigin(0.5, 0.5);

    if (alpha !== undefined) {
      text.setAlpha(alpha);
    }

    if (depth !== undefined) {
      text.setDepth(depth);
    }

    return text;
  }

  /**
   * Создание кнопки "Старт"
   *
   * @param scene
   */
  private createStartButton(scene: Phaser.Scene): void {
    const buttonX = scene.scale.width / 2;
    const buttonY = 473;

    const button = this.createUIElement(scene, UI_ELEMENT_KEYS.START_BUTTON, {
      x: buttonX,
      y: buttonY,
      isInteractive: true,
      cursorOnHover: 'pointer',
    });

    button.on('pointerup', () => {
      scene.scene.start(SCENE_KEYS.TUTORIAL);
    });
  }

  /**
   * Создание кнопки "Далее"
   *
   * @param scene
   */
  private createNextButton(scene: Phaser.Scene): void {
    const button = this.createUIElement(scene, UI_ELEMENT_KEYS.NEXT_BUTTON, {
      x: scene.scale.width / 2,
      y: 514,
      displaySizes: {
        displayWidth: 379,
        displayHeight: 115,
      },
      isInteractive: true,
      cursorOnHover: 'pointer',
    });

    button.on('pointerup', () => {
      this._eventBus.emit('onEnd');
    });
  }

  /**
   * Создание кнопки "Пропуск"
   *
   * @param scene {Phaser.Scene}
   */
  private createSkipButton(scene: Phaser.Scene): void {
    const buttonX = scene.scale.width - 180;
    const buttonY = 72;
    const buttonWidth = 300;
    const buttonHeight = 40;

    const button = this.createUIElement(scene, UI_ELEMENT_KEYS.SKIP_BUTTON, {
      x: buttonX,
      y: buttonY,
      displaySizes: {
        displayWidth: buttonWidth,
        displayHeight: buttonHeight,
      },
      isInteractive: true,
      cursorOnHover: 'pointer',
    });

    button.on('pointerup', () => {
      const fadeDuration = 300;
      const fadeDelay = 400;

      scene.cameras.main.fade(fadeDuration);

      scene.time.delayedCall(fadeDelay, () => {
        scene.scene.start(SCENE_KEYS.GAME);
      });
    });
  }

  /**
   * Создание кнопки бургер
   *
   * @param scene
   */
  private createBurgerButton(scene: Phaser.Scene): void {
    const buttonX = scene.scale.width - 75;
    const buttonY = 72;

    const button = this.createUIElement(scene, UI_ELEMENT_KEYS.BURGER_BUTTON, {
      x: buttonX,
      y: buttonY,
      ...INTERFACE_BUTTON_OPTIONS,
    });

    button.on('pointerup', () => {
      scene.scene.pause();
      this._eventBus.emit('onPause');
    });

    this._eventBus.on('resumeGame', () => {
      scene.scene.resume();
    });
  }

  /**
   * Создание кнопки звука
   *
   * @param scene
   */
  private createSoundButton(scene: Phaser.Scene): void {
    const buttonX = scene.scale.width - 150;
    const buttonY = 72;

    const button = this.createUIElement(scene, UI_ELEMENT_KEYS.SOUND_ON_BUTTON, {
      x: buttonX,
      y: buttonY,
      ...INTERFACE_BUTTON_OPTIONS,
    });

    button.on('pointerup', () => {
      if (this._soundManager.isSoundOn) {
        this._soundManager.stopSounds(scene);
        button.setTexture(UI_ELEMENT_KEYS.SOUND_OFF_BUTTON);
      } else {
        this._soundManager.resumeSounds(scene);
        button.setTexture(UI_ELEMENT_KEYS.SOUND_ON_BUTTON);
      }
    });
  }

  /**
   * Создание кнопки закрытия игры
   *
   * @param scene
   */
  private createExitButton(scene: Phaser.Scene): void {
    const buttonX = 75;
    const buttonY = 72;

    const button = this.createUIElement(scene, UI_ELEMENT_KEYS.EXIT_BUTTON, {
      x: buttonX,
      y: buttonY,
      ...INTERFACE_BUTTON_OPTIONS,
    });

    button.on('pointerup', () => {
      scene.scene.pause();
      this._eventBus.emit('onFastEnd');
    });
  }

  /**
   * Проверка нажатия на UI элемент
   *
   * @param pointer
   * @param uiElementTextures
   */
  public checkIfUIElementClicked(pointer: Phaser.Input.Pointer, uiElementTextures: UIElementKeyType[]): boolean {
    for (const texture of uiElementTextures) {
      const uiElement = this._createdUIElements.get(texture);
      if (uiElement && uiElement.getBounds().contains(pointer.x, pointer.y)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Удаление UI элементов
   *
   * @param scene {Phaser.Scene}
   * @param uiElementTextures {UIElementKeyType[]}
   * @return {void}
   */
  public clearElements(scene: Phaser.Scene, uiElementTextures: UIElementKeyType[]): void {
    for (const texture of uiElementTextures) {
      const uiElement = this._createdUIElements.get(texture);
      if (uiElement) {
        uiElement.destroy();
        this._createdUIElements.delete(texture);
      }
    }
  }

  /**
   * Создание большого текста на промежуточных экранах
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createScreenTitleText(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;
    const textX = scene.scale.width / 2;
    const textY = 311;
    const textStyles = {
      fontFamily: FONT_FAMILY,
      fontSize: '117px',
      color: '#00B956',
      stroke: '#FFFFFF',
      strokeThickness: 4,
      resolution: 2,
    };

    if (sceneKey === SCENE_KEYS.PRELOAD) {
      this.createTextElement(scene, textX, textY, TEXT_ELEMENT_KEYS.LOADING, 'Загрузка', textStyles);
    } else if (sceneKey === SCENE_KEYS.START) {
      this.createTextElement(scene, textX, textY, TEXT_ELEMENT_KEYS.BASKETBALL, 'Баскетбол', textStyles);
    } else if (
      sceneKey === SCENE_KEYS.END &&
      this._gameStateManager.playerScore > this._gameStateManager.computerScore
    ) {
      this.createTextElement(scene, textX, textY, TEXT_ELEMENT_KEYS.WINNER, 'Ты победил', textStyles);
    }
  }

  /**
   * Создание текстового элемента "Противостояние"
   *
   * @param scene {Phaser.Scene}
   * @private
   */
  private createVersusText(scene: Phaser.Scene): void {
    const alpha = 0;
    const textY = 631;
    const versusTextStyles = {
      fontFamily: FONT_FAMILY,
      fontSize: '40px',
      color: '#FFFFFF',
    };

    this.createTextElement(scene, 328, textY, TEXT_ELEMENT_KEYS.PLAYER_VERSUS, 'РОССИЯ', versusTextStyles).setAlpha(
      alpha,
    );
    this.createTextElement(scene, 1265, textY, TEXT_ELEMENT_KEYS.OPPONENT_VERSUS, 'АНГЛИЯ', versusTextStyles).setAlpha(
      alpha,
    );
  }

  /**
   * Создание текстового элемента "Счёт"
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createScoreText(scene: Phaser.Scene): void {
    const playerTextX = scene.scale.width / 2 - 63;
    const computerTextX = scene.scale.width / 2 + 63;
    const separatorX = scene.scale.width / 2;
    const separatorY = 157;
    const textY = 157;
    const playerGoals = this._gameStateManager.playerThrows.filter(
      (throwStatus) => throwStatus === THROW_STATUS.SUCCESS,
    );
    const computerGoals = this._gameStateManager.computerThrows.filter(
      (throwStatus) => throwStatus === THROW_STATUS.SUCCESS,
    );

    const scoreTextStyles = {
      fontSize: '56px',
      color: '#fff',
      align: 'center',
      fontFamily: FONT_FAMILY,
    };
    const scoreTextOptions = {
      depth: 3,
    };

    this.createTextElement(
      scene,
      playerTextX,
      textY,
      TEXT_ELEMENT_KEYS.PLAYER_SCORE,
      `${playerGoals.length}`,
      scoreTextStyles,
      scoreTextOptions,
    );
    this.createTextElement(
      scene,
      computerTextX,
      textY,
      TEXT_ELEMENT_KEYS.OPPONENT_SCORE,
      `${computerGoals.length}`,
      scoreTextStyles,
      scoreTextOptions,
    );
    this.createTextElement(
      scene,
      separatorX,
      separatorY,
      TEXT_ELEMENT_KEYS.SCORE_SEPARATOR,
      ':',
      scoreTextStyles,
      scoreTextOptions,
    );
  }

  /**
   * Создание текстового элемента "Раунд"
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createRoundText(scene: Phaser.Scene): void {
    this.createTextElement(scene, 730, 384, TEXT_ELEMENT_KEYS.ROUND_TEXT, '2 раунд', {
      fontFamily: FONT_FAMILY,
      fontSize: '40px',
      color: '#FFFFFF',
    }).setAlpha(0);
  }

  /**
   * Создание UI элемента "Противостояние"
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createVersusElements(scene: Phaser.Scene): void {
    const startAlpha = 0;
    const flagWidth = 76;
    const flagHeight = 57;
    const flagOriginX = 0;
    const flagOriginY = 0;
    const flagY = 603;

    this.createUIElement(scene, UI_ELEMENT_KEYS.BLUR_LINE, {
      x: 0,
      y: 630,
      origins: {
        originX: 0,
        originY: 0.5,
      },
    });
    this.createUIElement(scene, UI_ELEMENT_KEYS.VERSUS, {
      x: 730,
      y: 629,
      displaySizes: {
        displayWidth: 0,
        displayHeight: 0,
      },
    });
    this.createUIElement(scene, UI_ELEMENT_KEYS.PLAYER_FLAG, {
      x: 103,
      y: flagY,
      displaySizes: {
        displayWidth: flagWidth,
        displayHeight: flagHeight,
      },
      origins: {
        originX: flagOriginX,
        originY: flagOriginY,
      },
      alpha: startAlpha,
    });
    this.createUIElement(scene, UI_ELEMENT_KEYS.OPPONENT_FLAG, {
      x: 1047,
      y: flagY,
      displaySizes: {
        displayWidth: flagWidth,
        displayHeight: flagHeight,
      },
      origins: {
        originX: flagOriginX,
        originY: flagOriginY,
      },
      alpha: startAlpha,
    });
  }

  /**
   * Создание UI элемента "Линия счёта"
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createRoundLine(scene: Phaser.Scene): void {
    this.createUIElement(scene, UI_ELEMENT_KEYS.ROUND_LINE, {
      x: scene.scale.width / 2,
      y: 389,
      displaySizes: {
        displayWidth: 0,
        displayHeight: 130,
      },
    });
  }

  /**
   * Создание UI элемента "Конфетти"
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createConfetti(scene: Phaser.Scene): void {
    this.createUIElement(scene, UI_ELEMENT_KEYS.CONFETTI, {
      x: 0,
      y: -scene.scale.height,
      displaySizes: {
        displayWidth: scene.scale.width,
        displayHeight: scene.scale.height,
      },
      origins: {
        originX: 0,
        originY: 0,
      },
    });
  }

  /**
   * Создание таблицы счёта
   *
   * @param scene {Phaser.Scene}
   * @returns {void}
   * @private
   */
  private createScoreboard(scene: Phaser.Scene): void {
    const sceneKey = scene.scene.key as SceneKeyType;
    this._playerTurns = [];
    this._opponentTurns = [];

    const flagY = 102;
    const flagWidth = 53;
    const flagHeight = 40;
    const depth = 3;

    let playerTurnX = 614;
    let opponentTurnX = 747;
    const turnY = 196;
    const turnOrigin = 0;
    const turnWidth = 16;
    const turnHeight = 16;
    const step = 20;

    if (sceneKey === SCENE_KEYS.GAME) {
      this.createUIElement(scene, UI_ELEMENT_KEYS.SCOREBOARD, {
        x: scene.scale.width / 2,
        y: 0,
        displaySizes: {
          displayWidth: 367,
          displayHeight: 264,
        },
        origins: {
          originX: 0.5,
          originY: 0,
        },
        depth,
      });
    }

    this.createUIElement(scene, UI_ELEMENT_KEYS.PLAYER_FLAG, {
      x: scene.scale.width / 2 - 64,
      y: flagY,
      displaySizes: {
        displayWidth: flagWidth,
        displayHeight: flagHeight,
      },
      alpha: 1,
      depth,
    });
    this.createUIElement(scene, UI_ELEMENT_KEYS.OPPONENT_FLAG, {
      x: scene.scale.width / 2 + 64,
      y: flagY,
      displaySizes: {
        displayWidth: flagWidth,
        displayHeight: flagHeight,
      },
      alpha: 0.5,
      depth,
    });

    for (let i = 0; i < 5; i++) {
      let playerTurnTexture = i === 0 ? UI_ELEMENT_KEYS.CURRENT_TURN : UI_ELEMENT_KEYS.EMPTY_TURN;

      if (sceneKey !== SCENE_KEYS.GAME) {
        playerTurnTexture = UI_ELEMENT_KEYS.EMPTY_TURN;
      }

      const playerTurn = this.createUIElement(scene, playerTurnTexture, {
        x: playerTurnX,
        y: turnY,
        origins: {
          originX: turnOrigin,
          originY: turnOrigin,
        },
        displaySizes: {
          displayWidth: turnWidth,
          displayHeight: turnHeight,
        },
        depth,
      });

      const computerTurn = this.createUIElement(scene, UI_ELEMENT_KEYS.EMPTY_TURN, {
        x: opponentTurnX,
        y: turnY,
        origins: {
          originX: turnOrigin,
          originY: turnOrigin,
        },
        displaySizes: {
          displayWidth: turnWidth,
          displayHeight: turnHeight,
        },
        depth,
      });

      playerTurnX += step;
      opponentTurnX += step;

      this._playerTurns.push(playerTurn);
      this._opponentTurns.push(computerTurn);
    }
  }

  /**
   * Обновление таблицы счёта
   *
   * @returns {void}
   */
  public updateScoreboard(): void {
    let currentTurnNumber: number;
    const [playerFlag, opponentFlag] = this.getUIElementsByKeys([
      UI_ELEMENT_KEYS.PLAYER_FLAG,
      UI_ELEMENT_KEYS.OPPONENT_FLAG,
    ]);
    const [playerScore, opponentScore] = this.getTextElementsByKeys([
      TEXT_ELEMENT_KEYS.PLAYER_SCORE,
      TEXT_ELEMENT_KEYS.OPPONENT_SCORE,
    ]);

    const playerGoals = this._gameStateManager.playerThrows.filter(
      (throwStatus) => throwStatus === THROW_STATUS.SUCCESS,
    );
    const computerGoals = this._gameStateManager.computerThrows.filter(
      (throwStatus) => throwStatus === THROW_STATUS.SUCCESS,
    );

    playerScore.setText(`${playerGoals.length}`);
    opponentScore.setText(`${computerGoals.length}`);

    if (this._gameStateManager.isPlayerTurn) {
      playerFlag.setAlpha(1);
      opponentFlag.setAlpha(0.5);
    } else {
      playerFlag.setAlpha(0.5);
      opponentFlag.setAlpha(1);
    }

    const turnsCount = this._gameStateManager.isPlayerTurn
      ? this._gameStateManager.playerThrows.length
      : this._gameStateManager.computerThrows.length;

    if (turnsCount > 5) {
      currentTurnNumber = turnsCount - 5;
    } else {
      currentTurnNumber = turnsCount;
    }

    this._gameStateManager.playerThrows.forEach((turn, index) => {
      this._playerTurns[index].setTexture(
        turn === THROW_STATUS.SUCCESS ? UI_ELEMENT_KEYS.SUCCESS_TURN : UI_ELEMENT_KEYS.FAIL_TURN,
      );
    });

    this._gameStateManager.computerThrows.forEach((turn, index) => {
      this._opponentTurns[index].setTexture(
        turn === THROW_STATUS.SUCCESS ? UI_ELEMENT_KEYS.SUCCESS_TURN : UI_ELEMENT_KEYS.FAIL_TURN,
      );
    });

    const nextTurn = this._gameStateManager.isPlayerTurn
      ? this._playerTurns[currentTurnNumber]
      : this._opponentTurns[currentTurnNumber];
    if (nextTurn) {
      nextTurn.setTexture(UI_ELEMENT_KEYS.CURRENT_TURN);
    }
  }
}
