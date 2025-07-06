import { ASSETS_PATH } from '@src/shared/constants/env';

export const ANIMATION_ASSETS_PATH = `${ASSETS_PATH}/sprites` as const;

export const ATLASES_KEYS = {
  CROWD: 'crowdAtlas',
  TUTORIAL: 'tutorialAtlas',
} as const;

export const ANIMATION_KEYS = {
  TUTORIAL: 'tutorialAnimation',
  CHILL_CROWD: 'chillCrowdAnimation',
  SAD_CROWD: 'sadCrowdAnimation',
  HAPPY_CROWD: 'happyCrowdAnimation',
  CONFETTI: 'confettiAnimation',
} as const;

export type AtlasKeyType = (typeof ATLASES_KEYS)[keyof typeof ATLASES_KEYS];
export type AnimationKeyType = (typeof ANIMATION_KEYS)[keyof typeof ANIMATION_KEYS];

export interface IFramesConfig {
  prefix?: string;
  suffix?: string;
  start: number;
  end: number;
  zeroPad?: number;
  frames?: number[];
}
export interface IAnimationOptions extends Phaser.Types.Animations.Animation {
  key: AnimationKeyType;
  textureKey: string;
  framesConfig: IFramesConfig;
  frameRate?: number;
}

export interface IAtlasOptions {
  x?: number;
  y?: number;
  origins?: {
    originX: number;
    originY: number;
  };
  scales?: {
    scaleX?: number;
    scaleY?: number;
  };
  depth?: number;
}
