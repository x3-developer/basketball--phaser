import { ASSETS_PATH } from '@src/shared/constants/env';

export const SOUND_PATH = `${ASSETS_PATH}/sounds` as const;

export const SOUND_KEYS = {
  BACKGROUND: 'backgroundSound',
  HIT: 'hitSound',
  THROW: 'throwSound',
  APPLAUSE: 'applauseSound',
};

export type SoundKeyType = (typeof SOUND_KEYS)[keyof typeof SOUND_KEYS];
