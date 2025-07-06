export enum ServiceLifecycleEnum {
  SINGLETON = 'SINGLETON',
  TRANSIENT = 'TRANSIENT',
  SCOPED = 'SCOPED',
}

export interface IServiceDescriptor {
  key: string;
  factory: (...args: unknown[]) => unknown;
  lifecycle: ServiceLifecycleEnum;
}
