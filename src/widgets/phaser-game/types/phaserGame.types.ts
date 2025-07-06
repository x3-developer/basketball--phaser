export interface IPhaserGameRef {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

export interface IPhaserGameProps {
  initialScene: string;
  currentActiveScene?: (scene_instance: Phaser.Scene) => void;
}
