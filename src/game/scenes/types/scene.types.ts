export const SCENE_KEYS = {
  BOOT: 'BootScene',
  PRELOAD: 'PreloadScene',
  TUTORIAL: 'TutorialScene',
  START: 'StartScene',
  GAME: 'GameScene',
  SWITCH: 'SwitchScene',
  END: 'EndScene',
} as const;

export type SceneKeyType = (typeof SCENE_KEYS)[keyof typeof SCENE_KEYS];
