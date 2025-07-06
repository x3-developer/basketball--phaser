import { ReactElement, useCallback, useEffect, useState } from 'react';
import Condition from '@src/shared/ui/condition';
import { Kernel } from '@src/app/config/core';
import styles from './styles.module.scss';
import { GameStateManager } from '@src/game/manager';
import { getDeclensionByNumber } from '@src/shared/utils/declension';

const iframeUrl = import.meta.env.VITE_IFRAME_URL;

const getTitleText = (playerScore: number): string => {
  if (playerScore <= 3) return 'Тренируйтесь усерднее!';

  return playerScore >= 8 ? 'Отличный результат!' : 'Хороший результат!';
};

const getScoreText = (playerScore: number): string => {
  return `Вы заработали ${playerScore} ` + getDeclensionByNumber(playerScore, ['балл', 'балла', 'баллов']);
};

/**
 * Модальное окно с результатами игры
 *
 * @constructor
 * @returns {ReactElement}
 */
export default function ResultModal(): ReactElement {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [isFastClose, setIsFastClose] = useState<boolean>(false);
  const gameStateManager = Kernel.Instance.resolve<GameStateManager>('GameStateManager');
  const eventBus = Kernel.Instance.resolve<Phaser.Events.EventEmitter>('EventBus');

  const handleClick = useCallback((): void => {
    setIsShow(false);
    let type = 'GAME_OVER';

    if (isFastClose) {
      type = 'FORCE_QUIT';
    }

    window.parent.postMessage({ type, payload: { score: gameStateManager.playerScore } }, iframeUrl);
  }, [gameStateManager.playerScore]);

  useEffect(() => {
    eventBus.on('onEnd', () => {
      setIsShow(true);
    });
    eventBus.on('onFastEnd', () => {
      setIsShow(true);
      setIsFastClose(true);
    });

    return () => {
      eventBus.removeListener('onEnd');
    };
  }, [eventBus, gameStateManager.playerScore]);

  useEffect(() => {
    if (isFastClose) {
      const timer = setTimeout(() => {
        handleClick();
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [handleClick, isFastClose]);

  return (
    <Condition
      _if={isShow}
      _then={
        <div className={styles.modal}>
          <div className={styles.container}>
            <div className={styles.image}>
              <img
                src={`${import.meta.env.VITE_ASSETS_PATH}/images/finish_modal.jpg`}
                alt="Результат"
                className={styles.img}
              />
            </div>
            <div className={styles.result}>
              <h2>{getTitleText(gameStateManager.playerScore)}</h2>
              <h3>{getScoreText(gameStateManager.playerScore)}</h3>
              <p className={styles.text}>
                Получай дополнительные баллы
                <br /> в игре каждый день!
              </p>

              <div className={styles.info}>
                <div className={styles.icon}>
                  <img
                    src={`${import.meta.env.VITE_ASSETS_PATH}/images/ok_icon.png`}
                    alt="Результат"
                    className={styles.iconImg}
                  />
                </div>
                <p className={styles.infoText}>
                  <span>{gameStateManager.playerScore}</span> из 10
                </p>
              </div>
              {!isFastClose && (
                <button className={styles.button} onClick={handleClick}>
                  На главную
                </button>
              )}
            </div>
          </div>
        </div>
      }
      _else={<></>}
    />
  );
}
