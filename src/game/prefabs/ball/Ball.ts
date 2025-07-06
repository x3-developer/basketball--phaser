import Phaser from 'phaser';
import AbstractArcadePrefab from '../AbstractArcadePrefab';
import {
  GameStateManager,
  SOUND_KEYS,
  SoundManager,
  SPRITE_KEYS,
  SpriteKeyType,
  SpriteManager,
  UI_ELEMENT_KEYS,
  UIManager,
} from '@src/game/manager';
import { TRAJECTORY } from '@src/shared/constants/game/elements';
import { IBallPosition, IParabolaData, IThrowVelocity } from './types/ball.types';

/**
 * Мяч
 *
 * @class Ball
 */
export default class Ball extends AbstractArcadePrefab {
  private readonly _spriteManager = this._kernel.resolve<SpriteManager>('SpriteManager');
  private readonly _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');
  private readonly _soundManager = this._kernel.resolve<SoundManager>('SoundManager');
  private readonly _uiManager = this._kernel.resolve<UIManager>('UIManager');

  private static MOBILE_POINTER_Y_PADDING = -200; // Смещение по оси Y для мобильных устройств (чтобы не закрывать траекторию пальцем)
  private static GRAVITY = 1200;
  private static SIDES_MARGIN = 200;

  private _isReady = false;
  private _trajectorySprites: Phaser.GameObjects.Sprite[] = [];
  private _minThrowHeight = 0;
  private _minThrowWidth = 0;
  private _isThrown = false;
  private _previousX = 0;
  private _previousY = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, SPRITE_KEYS.BALL);

    this.initialize();
  }

  /**
   * Инициализация мяча и обработчиков событий
   *
   * @returns {void}
   * @private
   */
  private initialize(): void {
    this.initBall();
    this.initThrowLimits();
    this.setupInputHandlers();
    this.drawTrajectory();
  }

  /**
   * Инициализация мяча
   *
   * @returns {void}
   * @private
   */
  private initBall(): void {
    const { ballX, ballY } = this.getBallPosition();
    const ballDisplayWidth = 52;
    const ballDisplayHeight = 52;
    const ballDepth = 6;
    const ballColliderRadius = 22;
    const ballBounce = 0.7;
    const ballColliderOffset = 5.5;
    // const ballMaxVelocity = 1000;
    const ballMass = 1.5;

    this.x = ballX;
    this.y = ballY;
    this.setDisplaySize(ballDisplayWidth, ballDisplayHeight);
    this.setDepth(ballDepth);
    this.setCircle(ballColliderRadius);
    this.setBounce(ballBounce);
    this.body.offset.set(ballColliderOffset);
    this.body.checkCollision = { up: true, down: true, left: true, right: true, none: false };
    // (this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(ballMaxVelocity);
    this.body.setMass(ballMass);

    this._isReady = true;
  }

  /**
   * Получение данных параболы
   *
   * @returns {IParabolaData}
   * @param pointerX {number}
   * @param pointerY {number}
   * @private
   */
  private getParabolaData(pointerX: number, pointerY: number): IParabolaData {
    const parabolaTopX = Math.min(this._minThrowWidth, pointerX);
    const parabolaTopY = Math.min(this._minThrowHeight, pointerY);
    const parabolaCoefficient = (this.y - parabolaTopY) / Math.pow(this.x - parabolaTopX, 2);

    return {
      parabolaTopX,
      parabolaTopY,
      parabolaCoefficient,
    };
  }

  /**
   * Получение позиции мяча
   *
   * @returns {IBallPosition}
   * @private
   */
  private getBallPosition(): IBallPosition {
    if (!this._gameStateManager.isPlayerTurn) {
      return {
        ballX: this._previousX,
        ballY: this._previousY,
      };
    }

    const leftMargin = 100;
    const maxTop = this.scene.scale.height / 2 - Ball.SIDES_MARGIN;
    const maxLeft = this.scene.scale.width / 2 - leftMargin;
    const maxRight = this.scene.scale.width - Ball.SIDES_MARGIN;
    const maxBottom = this.scene.scale.height / 2 + Ball.SIDES_MARGIN;
    const ballX = Phaser.Math.Between(maxLeft, maxRight);
    const ballY = Phaser.Math.Between(maxTop, maxBottom);
    this._previousX = ballX;
    this._previousY = ballY;

    return { ballX, ballY };
  }

  /**
   * Установка пределов броска
   *
   * @returns {void}
   * @private
   */
  private initThrowLimits(): void {
    this._minThrowHeight = this.y - 0.1 * this.scene.scale.height;
    this._minThrowWidth = this.x - 0.1 * this.scene.scale.width;
  }

  /**
   * Установка обработчиков ввода
   *
   * @returns {void}
   * @private
   */
  private setupInputHandlers(): void {
    if (this.isMobile()) {
      if (this._isThrown) return;

      this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.y += Ball.MOBILE_POINTER_Y_PADDING;
        this.drawTrajectory(pointer);
      });

      this.scene.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        if (pointer.isDown) {
          pointer.y += Ball.MOBILE_POINTER_Y_PADDING;
          this.drawTrajectory(pointer);
        }
      });

      this.scene.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
        const isUIElementClicked = this._uiManager.checkIfUIElementClicked(pointer, [
          UI_ELEMENT_KEYS.BURGER_BUTTON,
          UI_ELEMENT_KEYS.SOUND_ON_BUTTON,
          UI_ELEMENT_KEYS.EXIT_BUTTON,
        ]);

        if (isUIElementClicked) return;

        pointer.y += Ball.MOBILE_POINTER_Y_PADDING;
        this.clearTrajectorySprites();
        this.throwBall(pointer.x, pointer.y);
      });
    } else {
      this.scene.input.on('pointermove', this.drawTrajectory, this);
      this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const isUIElementClicked = this._uiManager.checkIfUIElementClicked(pointer, [
          UI_ELEMENT_KEYS.BURGER_BUTTON,
          UI_ELEMENT_KEYS.SOUND_ON_BUTTON,
          UI_ELEMENT_KEYS.EXIT_BUTTON,
        ]);

        if (isUIElementClicked) return;

        this.clearTrajectorySprites();
        this.throwBall(pointer.x, pointer.y);
      });
    }
  }

  /**
   * Бросок мяча
   *
   * @param pointerX {number}
   * @param pointerY {number}
   * @returns {void}
   */
  public throwBall(pointerX: number, pointerY: number): void {
    if (this._isThrown) return;

    const { velocityX, velocityY } = this.calculateThrowVelocity(pointerX, pointerY);

    this.setVelocity(velocityX, velocityY);
    this.setGravityY(Ball.GRAVITY);

    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      this.body.allowRotation = true;
    }

    const rotationSpeed = -velocityX * 0.9;
    this.setAngularVelocity(rotationSpeed);

    this._soundManager.playSound(this.scene, SOUND_KEYS.THROW);
    this._isThrown = true;
  }

  /**
   * Расчет скорости броска
   *
   * @param pointerX {number}
   * @param pointerY {number}
   * @returns {IThrowVelocity}
   * @private
   */
  private calculateThrowVelocity(pointerX: number, pointerY: number): IThrowVelocity {
    const { parabolaTopX, parabolaTopY } = this.getParabolaData(pointerX, pointerY);
    const timeToTop = Math.sqrt((2 * (this.y - parabolaTopY)) / Ball.GRAVITY);
    const velocityY = -Ball.GRAVITY * timeToTop;
    const velocityX = -(this.x - parabolaTopX) / timeToTop;

    return { velocityX, velocityY };
  }

  /**
   * Отрисовка траектории
   *
   * @param pointer {Phaser.Input.Pointer}
   * @returns {void}
   * @private
   */
  private drawTrajectory(pointer?: Phaser.Input.Pointer): void {
    if (this._isThrown || !this._gameStateManager.isPlayerTurn) return;

    const pointerX = pointer?.x ?? this.scene.input.activePointer.x;
    const pointerY = pointer?.y ?? this.scene.input.activePointer.y;

    this.clearTrajectorySprites();

    const trajectorySprites = [];
    const { parabolaTopX, parabolaTopY, parabolaCoefficient } = this.getParabolaData(pointerX, pointerY);
    const numberOfPoints = 26;
    const step = (this.x - parabolaTopX) / numberOfPoints;
    const { velocityX, velocityY } = this.calculateThrowVelocity(pointerX, pointerY);
    const throwPower = Math.sqrt(velocityX ** 2 + velocityY ** 2); // модуль вектора
    let circleKey: SpriteKeyType = SPRITE_KEYS.GREEN_CIRCLE_TRAJECTORY;
    let triangleKey: SpriteKeyType = SPRITE_KEYS.GREEN_TRIANGLE_TRAJECTORY;

    if (throwPower > 1000 && throwPower <= 1200) {
      circleKey = SPRITE_KEYS.YELLOW_CIRCLE_TRAJECTORY;
      triangleKey = SPRITE_KEYS.YELLOW_TRIANGLE_TRAJECTORY;
    } else if (throwPower > 1200) {
      circleKey = SPRITE_KEYS.RED_CIRCLE_TRAJECTORY;
      triangleKey = SPRITE_KEYS.RED_TRIANGLE_TRAJECTORY;
    }

    for (let i = 0; i <= numberOfPoints; i++) {
      const x = parabolaTopX + i * step;
      const y = parabolaCoefficient * Math.pow(x - parabolaTopX, 2) + parabolaTopY;

      if (i > 0 && i < 25) {
        const circle = this._spriteManager.createImageSprite(this.scene, circleKey, {
          x,
          y,
          displaySizes: {
            displayWidth: TRAJECTORY.CIRCLE.DISPLAY_WIDTH,
            displayHeight: TRAJECTORY.CIRCLE.DISPLAY_HEIGHT,
          },
          depth: TRAJECTORY.DEPTH,
        });
        trajectorySprites.push(circle);
      }
    }

    const triangle = this._spriteManager.createImageSprite(this.scene, triangleKey, {
      x: parabolaTopX,
      y: parabolaTopY,
      displaySizes: {
        displayWidth: TRAJECTORY.TRIANGLE.DISPLAY_WIDTH,
        displayHeight: TRAJECTORY.TRIANGLE.DISPLAY_HEIGHT,
      },
      depth: TRAJECTORY.DEPTH,
    });
    trajectorySprites.push(triangle);

    this._trajectorySprites = trajectorySprites;
  }

  /**
   * Сброс мяча
   *
   * @returns {void}
   */
  public resetBall(): void {
    const { ballX, ballY } = this.getBallPosition();

    this.setPosition(ballX, ballY);
    this.setVelocity(0, 0);
    this.setGravityY(0);
    this.setAngularVelocity(0);

    this.initThrowLimits();
    this._isThrown = false;
    this._isReady = true;
    this.drawTrajectory();
  }

  /**
   * Очистка спрайтов траектории
   *
   * @private
   * @returns {void}
   */
  private clearTrajectorySprites(): void {
    this._trajectorySprites.forEach((sprite) => sprite.destroy());
    this._trajectorySprites = [];
  }

  /**
   * Бросок мяча к заданной точке
   *
   * @param targetX {number} - координата X цели
   * @param targetY {number} - координата Y цели
   * @param accuracy {number} - точность броска (0-1), где 1 — максимально точно
   */
  public throwToTarget(targetX: number, targetY: number, accuracy: number = 1): void {
    if (this._isThrown) return;

    const startX = this.x;
    const startY = this.y;

    const yv = (this.scene.scale.height / 2 - Ball.SIDES_MARGIN) / 2;
    const t = Math.sqrt((startY - yv) / (targetY - yv));
    let xv = (startX + t * targetX) / (t + 1);
    const inaccuracyX = Phaser.Math.Between(-10, 10) * 10 * (1 - accuracy);

    xv += inaccuracyX;

    this.scene.time.delayedCall(500, () => {
      this.throwBall(xv, yv);
    });
  }

  /**
   * Получение состояния готовности мяча
   *
   * @returns {boolean}
   */
  get isReady(): boolean {
    return this._isReady;
  }

  /**
   * Установка состояния готовности мяча
   *
   * @param value {boolean}
   */
  set isReady(value: boolean) {
    this._isReady = value;
  }
}
