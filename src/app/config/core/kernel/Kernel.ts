import { IServiceDescriptor, ServiceLifecycleEnum } from '../types/core.types';

/**
 * Ядро DI-контейнера
 *
 * @class Kernel
 */
export default class Kernel {
  private static _instance: Kernel;
  private readonly _services: Map<string, IServiceDescriptor> = new Map();
  private readonly _instances: Map<string, unknown> = new Map();

  /**
   * Получение экземпляра ядра
   *
   * @private
   */
  public static get Instance(): Kernel {
    return this._instance || (this._instance = new this());
  }

  /**
   * Создание экземпляра сервиса
   *
   * @param key {string}
   * @param factory {() => T}
   * @param lifecycle {ServiceLifecycleEnum}
   */
  public register<T>(
    key: string,
    factory: () => T,
    lifecycle: ServiceLifecycleEnum = ServiceLifecycleEnum.SINGLETON,
  ): void {
    if (this._services.has(key)) {
      console.log(`Сервис с ключом ${key} уже зарегистрирован в контейнере`);
      return;
    }

    this._services.set(key, { key, factory, lifecycle });
  }

  /**
   * Получение экземпляра сервиса
   *
   * @param key {string}
   * @return {T}
   */
  public resolve<T>(key: string): T {
    const descriptor = this._services.get(key);

    if (!descriptor) {
      throw new Error(`Сервис с ключом ${key} не найден в контейнере`);
    }

    if (descriptor.lifecycle === ServiceLifecycleEnum.TRANSIENT) {
      return descriptor.factory() as T;
    }

    if (!this._instances.has(key)) {
      this._instances.set(key, descriptor.factory());
    }

    return this._instances.get(key) as T;
  }

  /**
   * Удаление сервисов с ограниченным временем жизни
   *
   * @return {void}
   */
  public clearScope(): void {
    for (const [key, descriptor] of this._services) {
      if (descriptor.lifecycle === ServiceLifecycleEnum.SCOPED) {
        if (descriptor.lifecycle === ServiceLifecycleEnum.SCOPED) {
          this._instances.delete(key);
        }
      }
    }
  }
}
