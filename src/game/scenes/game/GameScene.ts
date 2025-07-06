import { Ball, Basket, Field, Rack, Shield } from '@src/game/prefabs';
import AbstractScene from '@src/game/scenes/AbstractScene';
import {
  GameStateManager,
  BackgroundManager,
  SoundManager,
  UIManager,
  BACKGROUND_KEYS,
  UI_ELEMENT_KEYS,
  ATLASES_KEYS,
  ANIMATION_KEYS,
  AnimationManager,
  SpriteManager,
  SPRITE_KEYS,
  SOUND_KEYS,
  THROW_STATUS,
} from '@src/game/manager';
import { SCENE_KEYS } from '@src/game/scenes';

/**
 * Сцена игры
 *
 * @class GameScene
 */
export default class GameScene extends AbstractScene {
  private _backgroundManager = this._kernel.resolve<BackgroundManager>('BackgroundManager');
  private _uiManager = this._kernel.resolve<UIManager>('UIManager');
  private _spriteManager = this._kernel.resolve<SpriteManager>('SpriteManager');
  private _gameStateManager = this._kernel.resolve<GameStateManager>('GameStateManager');
  private _soundManager = this._kernel.resolve<SoundManager>('SoundManager');
  private _animationManager = this._kernel.resolve<AnimationManager>('AnimationManager');

  private _ball: Ball;
  private _rack: Rack;
  private _shield: Shield;
  private _basket: Basket;
  private _field: Field;
  private _isGoal: boolean = false;
  private _movingDirection: 'UP' | 'DOWN' = 'DOWN';

  constructor() {
    super(SCENE_KEYS.GAME);
  }

  /**
   * @override
   * @return {void}
   */
  public preload(): void {
    if (this._gameStateManager.currentPeriod === 1) {
      this.cleanPreviousScene(SCENE_KEYS.TUTORIAL);
    } else {
      this.cleanPreviousScene(SCENE_KEYS.SWITCH);
    }
  }

  public update(): void {
    if (this._ball.isReady) {
      // мяч за пределами поля
      if (this._ball.x < 0 || this._ball.x > this.scale.width) {
        this.checkThrowStatus();
      }
    }

    if (this._gameStateManager.currentPeriod === 2) {
      this.moveBasket();
    }

    if (!this._gameStateManager.isPlayerTurn) {
      this._ball.throwToTarget(this._basket.sensor.x, this._basket.sensor.y, 0.5);
    }
  }

  /**
   * @override
   * @returns {void}
   */
  public create(): void {
    this._backgroundManager.createBackground(this);
    this._uiManager.createElements(this);
    this._uiManager.createText(this);

    this._animationManager.createCrowdAnimation(this);

    this.createBall();
    this.createRack();
    this.createShield();
    this.createBasket();
    this.createField();
    this.createSounds();
  }

  /**
   * Создание мяча
   *
   * @returns {void}
   * @private
   */
  private createBall(): void {
    this._ball = new Ball(this);
  }

  /**
   * Создание стойки
   *
   * @returns {void}
   * @private
   */
  private createRack(): void {
    const rackTexture = this._gameStateManager.currentPeriod == 1 ? SPRITE_KEYS.STATIC_RACK : SPRITE_KEYS.DYNAMIC_RACK;

    this._rack = new Rack(this, rackTexture);
    this.physics.add.collider(this._ball, this._rack.colliders);
  }

  /**
   * Создание щита
   *
   * @returns {void}
   * @private
   */
  private createShield(): void {
    this._shield = new Shield(this);
    this.physics.add.collider(this._ball, this._shield.colliders, null, () => {
      this._soundManager.playSound(this, SOUND_KEYS.HIT, true);
    });
  }

  private createBasket(): void {
    this._basket = new Basket(this);

    this.physics.add.collider(this._ball, this._basket.colliders, () => {
      this._soundManager.playSound(this, SOUND_KEYS.HIT, true);
    });
    this.physics.add.overlap(
      this._ball,
      this._basket.sensor,
      () => {
        if (!this._gameStateManager.isTurnFinished) {
          this._isGoal = true;

          this.checkThrowStatus();
        }
      },
      null,
      this,
    );
  }

  /**
   * Создание поля
   *
   * @returns {void}
   * @private
   */
  private createField(): void {
    this._field = new Field(this);

    this.physics.add.collider(this._ball, this._field.collider, this.checkThrowStatus, null, this);
  }

  private checkThrowStatus(): void {
    if (!this._gameStateManager.isTurnFinished) {
      this._gameStateManager.isTurnFinished = true;

      if (this._gameStateManager.isPlayerTurn) {
        this._gameStateManager.playerThrows = this._isGoal ? THROW_STATUS.SUCCESS : THROW_STATUS.FAIL;
      } else {
        this._gameStateManager.computerThrows = this._isGoal ? THROW_STATUS.SUCCESS : THROW_STATUS.FAIL;
      }

      if (this._isGoal && this._gameStateManager.isPlayerTurn) {
        this._soundManager.playSound(this, SOUND_KEYS.APPLAUSE);
      }

      if (this._isGoal) {
        this._animationManager.playCrowdHappyAnimation();
      } else {
        this._animationManager.playCrowdSadAnimation();
      }

      this._gameStateManager.isPlayerTurn = !this._gameStateManager.isPlayerTurn;
      this._uiManager.updateScoreboard();
    }

    if (this._gameStateManager.playerThrows.length + this._gameStateManager.computerThrows.length < 10) {
      this.reset();
    } else {
      const fadeDuration = 300;
      const fadeDelay = 400;

      this.cameras.main.fade(fadeDuration);

      this.time.delayedCall(fadeDelay, () => {
        this.scene.start(this._gameStateManager.currentPeriod === 1 ? SCENE_KEYS.SWITCH : SCENE_KEYS.END);
      });
    }
  }

  private reset(): void {
    if (!this._ball.isReady) return;

    this._ball.isReady = false;

    this.time.delayedCall(1000, () => {
      this._ball.resetBall();
      this._gameStateManager.isTurnFinished = false;
      this._isGoal = false;
    });
  }

  private moveBasket(): void {
    const speed = 0.5;
    const currentShieldY = this._shield.y;
    const minShieldY = 153;
    const maxShieldY = 153 + 160 / 1.2;
    const direction = this._movingDirection === 'UP' ? -speed : speed;

    this._shield.y += direction;
    this._basket.y += direction;
    this._basket.sensor.y += direction;

    this._shield.colliders.children.iterate((collider: Phaser.GameObjects.GameObject) => {
      const gameObject = collider as Phaser.GameObjects.Sprite;
      gameObject.y += direction;

      const body = gameObject.body as Phaser.Physics.Arcade.StaticBody;
      const colliderX = Math.round(gameObject.x);
      const colliderY = Math.round(gameObject.y);
      const colliderWidth = Math.round(body.width);
      const colliderHeight = Math.round(body.height);
      body.updateFromGameObject();

      if (colliderWidth !== 1) {
        body.x = colliderX - 7;
        body.y = colliderY - 80;
      } else {
        body.x = colliderX;
        body.y = colliderY - 5;
      }

      body.setSize(colliderWidth, colliderHeight);

      return true;
    });

    this._basket.colliders.children.iterate((collider: Phaser.GameObjects.GameObject) => {
      const gameObject = collider as Phaser.GameObjects.Sprite;
      gameObject.y += direction;

      const body = gameObject.body as Phaser.Physics.Arcade.StaticBody;
      const colliderX = Math.round(gameObject.x);
      const colliderWidth = Math.round(body.width);
      const colliderHeight = Math.round(body.height);
      body.updateFromGameObject();

      body.x = colliderX - 10;
      body.setSize(colliderWidth, colliderHeight);

      return true;
    });

    if (this._movingDirection === 'UP' && currentShieldY <= minShieldY) {
      this._movingDirection = 'DOWN';
    } else if (this._movingDirection === 'DOWN' && currentShieldY >= maxShieldY) {
      this._movingDirection = 'UP';
    }
  }

  private createSounds(): void {
    this._soundManager.playSound(this, SOUND_KEYS.BACKGROUND, false, {
      loop: true,
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
    this._backgroundManager.clearTextures(this, [
      BACKGROUND_KEYS.WITH_CHAIRS_BACKGROUND,
      BACKGROUND_KEYS.SHADOW_BACKGROUND,
    ]);

    this._uiManager.clearTextures(this, [
      UI_ELEMENT_KEYS.BURGER_BUTTON,
      UI_ELEMENT_KEYS.SOUND_ON_BUTTON,
      UI_ELEMENT_KEYS.SOUND_OFF_BUTTON,
      UI_ELEMENT_KEYS.EXIT_BUTTON,
      UI_ELEMENT_KEYS.SUCCESS_TURN,
      UI_ELEMENT_KEYS.FAIL_TURN,
    ]);

    this._spriteManager.clearTextures(this, [
      SPRITE_KEYS.GREEN_CIRCLE_TRAJECTORY,
      SPRITE_KEYS.YELLOW_CIRCLE_TRAJECTORY,
      SPRITE_KEYS.RED_CIRCLE_TRAJECTORY,
      SPRITE_KEYS.GREEN_TRIANGLE_TRAJECTORY,
      SPRITE_KEYS.YELLOW_TRIANGLE_TRAJECTORY,
      SPRITE_KEYS.RED_TRIANGLE_TRAJECTORY,
      SPRITE_KEYS.STATIC_RACK,
      SPRITE_KEYS.DYNAMIC_RACK,
      SPRITE_KEYS.SHIELD,
      SPRITE_KEYS.BASKET,
      SPRITE_KEYS.FIELD,
    ]);

    this._animationManager.clearAtlases(this, [ATLASES_KEYS.CROWD]);
    this._animationManager.clearAnimation(this, ANIMATION_KEYS.CHILL_CROWD);
    this._animationManager.clearAnimation(this, ANIMATION_KEYS.SAD_CROWD);
    this._animationManager.clearAnimation(this, ANIMATION_KEYS.HAPPY_CROWD);

    this._backgroundManager = null;
    this._uiManager = null;
    this._spriteManager = null;
    this._gameStateManager = null;
    this._soundManager = null;
    this._animationManager = null;
    this._ball = null;
    this._rack = null;
    this._shield = null;
    this._basket = null;
    this._field = null;

    this.killScene(SCENE_KEYS.TUTORIAL);
  }
}
