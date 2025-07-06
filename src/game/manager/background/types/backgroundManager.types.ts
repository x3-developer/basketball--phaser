import { ASSETS_PATH } from '@src/shared/constants/env';

export const BACKGROUND_ASSETS_PATH = `${ASSETS_PATH}/sprites/backgrounds` as const;

export const BACKGROUND_KEYS = {
  BLUR_BACKGROUND: 'blurBackground',
  WITH_CHAIRS_BACKGROUND: 'withChairsBackground',
  TUTORIAL_BACKGROUND: 'tutorialBackground',
  SHADOW_BACKGROUND: 'shadowBackground',
} as const;

export type BackgroundKeyType = (typeof BACKGROUND_KEYS)[keyof typeof BACKGROUND_KEYS];

export interface IBackgroundOptions {
  depth?: number;
}
