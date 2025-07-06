import { ReactElement, useEffect, useState } from 'react';
import Condition from '@src/shared/ui/condition';
import { Kernel } from '@src/app/config/core';
import styles from './styles.module.scss';
import clsx from 'clsx';

/**
 * Модальное окно паузы
 *
 * @constructor
 * @returns {ReactElement}
 */
export default function PauseModal(): ReactElement {
  const [isShow, setIsShow] = useState<boolean>(false);
  const eventBus = Kernel.Instance.resolve<Phaser.Events.EventEmitter>('EventBus');

  const handleResumeClick = (): void => {
    setIsShow((prevValue) => !prevValue);
    eventBus.emit('resumeGame');
  };

  const handleExitClick = (): void => {
    setIsShow((prevValue) => !prevValue);
    eventBus.emit('onEnd');
  };

  useEffect(() => {
    eventBus.on('onPause', () => {
      setIsShow(true);
    });

    return () => {
      eventBus.removeListener('onPause');
    };
  }, [eventBus]);

  return (
    <Condition
      _if={isShow}
      _then={
        <div className={styles.modal}>
          <div className={styles.container}>
            <button className={styles.button} onClick={handleResumeClick}>
              Возобновить
            </button>
            <button className={clsx(styles.button, styles.red)} onClick={handleExitClick}>
              Выйти
            </button>
          </div>
        </div>
      }
      _else={<></>}
    />
  );
}
