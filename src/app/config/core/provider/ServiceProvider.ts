import { Kernel } from '@src/app/config/core';
import { Events } from 'phaser';
import { LoggerService } from '@src/game/services';
import {
  AnimationManager,
  GameStateManager,
  SpriteManager,
  UIManager,
  BackgroundManager,
  SoundManager,
} from '@src/game/manager';

/**
 * Сервис-провайдер для регистрации сервисов в контейнере зависимостей
 *
 * @class ServiceProvider
 */
export default class ServiceProvider {
  public static register(kernel: Kernel): void {
    kernel.register('EventBus', () => new Events.EventEmitter());
    kernel.register('LoggerService', () => new LoggerService());
    kernel.register('BackgroundManager', () => new BackgroundManager());
    kernel.register('SpriteManager', () => new SpriteManager());
    kernel.register('UIManager', () => new UIManager());
    kernel.register('AnimationManager', () => new AnimationManager());
    kernel.register('GameStateManager', () => new GameStateManager());
    kernel.register('SoundManager', () => new SoundManager());
  }
}
