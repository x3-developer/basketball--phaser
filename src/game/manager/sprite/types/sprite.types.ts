import { ASSETS_PATH } from '@src/shared/constants/env';

export const SPRITE_ASSETS_PATH = `${ASSETS_PATH}/sprites` as const;

export const SPRITE_KEYS = {
  FIELD: 'field',
  BALL: 'ball',
  BASKET: 'basket',
  STATIC_RACK: 'staticRack',
  DYNAMIC_RACK: 'dynamicRack',
  SHIELD: 'shield',
  GREEN_CIRCLE_TRAJECTORY: 'greenCircleTrajectory',
  YELLOW_CIRCLE_TRAJECTORY: 'yellowCircleTrajectory',
  RED_CIRCLE_TRAJECTORY: 'redCircleTrajectory',
  GREEN_TRIANGLE_TRAJECTORY: 'greenTriangleTrajectory',
  YELLOW_TRIANGLE_TRAJECTORY: 'yellowTriangleTrajectory',
  RED_TRIANGLE_TRAJECTORY: 'redTriangleTrajectory',
} as const;

export type SpriteKeyType = (typeof SPRITE_KEYS)[keyof typeof SPRITE_KEYS];

export interface IGameObjectOptions {
  x?: number;
  y?: number;
  displaySizes?: {
    displayWidth: number;
    displayHeight: number;
  };
  origins?: {
    originX: number;
    originY: number;
  };
  depth?: number;
}
