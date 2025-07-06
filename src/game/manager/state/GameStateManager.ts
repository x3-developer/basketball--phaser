import { THROW_STATUS } from '@src/game/manager';

/**
 * Менеджер состояния игры
 *
 * @class GameStateManager
 */
export default class GameStateManager {
  private _currentPeriod: number = 1;
  private _playerThrows: THROW_STATUS[] = [];
  private _computerThrows: THROW_STATUS[] = [];
  private _playerScore: number = 0;
  private _computerScore: number = 0;
  private _isPlayerTurn: boolean = true;
  private _isTurnFinished: boolean = false;

  public changePeriod(): void {
    this._currentPeriod++;
    this._playerThrows = [];
    this._computerThrows = [];
    this._isPlayerTurn = true;
    this._isTurnFinished = false;
  }

  get currentPeriod(): number {
    return this._currentPeriod;
  }

  get playerThrows(): THROW_STATUS[] {
    return this._playerThrows;
  }

  set playerThrows(value: THROW_STATUS) {
    if (this._playerThrows.length < 5) {
      this._playerThrows.push(value);

      if (value === THROW_STATUS.SUCCESS) {
        this._playerScore++;
      }
    }
  }

  get computerThrows(): THROW_STATUS[] {
    return this._computerThrows;
  }

  set computerThrows(value: THROW_STATUS) {
    if (this._computerThrows.length < 5) {
      this._computerThrows.push(value);

      if (value === THROW_STATUS.SUCCESS) {
        this._computerScore++;
      }
    }
  }

  get isPlayerTurn(): boolean {
    return this._isPlayerTurn;
  }

  set isPlayerTurn(value: boolean) {
    this._isPlayerTurn = value;
  }

  get isTurnFinished(): boolean {
    return this._isTurnFinished;
  }

  set isTurnFinished(value: boolean) {
    this._isTurnFinished = value;
  }

  get playerScore(): number {
    return this._playerScore;
  }

  get computerScore(): number {
    return this._computerScore;
  }
}
