import { ReactElement, useRef } from 'react';
import { IPhaserGameRef } from '@src/widgets/phaser-game/types/phaserGame.types';
import PhaserGame from '@src/widgets/phaser-game';
import styles from './styles.module.scss';
import PauseModal from '@src/features/pause-modal/PauseModal';
import ResultModal from '@src/features/result-modal/ResultModal';

/**
 * Корневой компонент
 *
 * @constructor
 * @returns {ReactElement}
 */
export default function App(): ReactElement {
  const phaserRef = useRef<IPhaserGameRef | null>(null);

  return (
    <div id="app" className={styles.app}>
      <PhaserGame ref={phaserRef} initialScene="BootScene" />
      <PauseModal />
      <ResultModal />
    </div>
  );
}
