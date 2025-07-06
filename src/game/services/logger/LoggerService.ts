import { MESSAGE_COLORS } from './types/logger.types';

/**
 * Сервис логирования
 *
 * @class LoggerService
 */
export default class LoggerService {
  public log(message: string): void {
    console.log(`%c [Log] ${message}`, `color: ${MESSAGE_COLORS.LOG}`);
  }

  public warning(message: string): void {
    console.log(`%c [Warning] ${message}`, `color: ${MESSAGE_COLORS.WARNING}`);
  }

  public error(message: string): void {
    console.log(`%c [Error] ${message}`, `color: ${MESSAGE_COLORS.ERROR}`);
  }
}
