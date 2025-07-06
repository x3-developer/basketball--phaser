import { FONT_FAMILY } from '@src/game/manager';

export const VERSUS_ANIMATION = {
  VERSUS_ELEMENT: {
    X: 730,
    Y: 629,
    DISPLAY_WIDTH: 242,
    DISPLAY_HEIGHT: 240,
  },
  PLAYER_FLAG: {
    X: 103,
    Y: 603,
    ORIGIN_X: 0,
    ORIGIN_Y: 0,
    DISPLAY_WIDTH: 76,
    DISPLAY_HEIGHT: 57,
  },
  OPPONENT_FLAG: {
    X: 1047,
    Y: 605,
    ORIGIN_X: 0,
    ORIGIN_Y: 0,
    DISPLAY_WIDTH: 76,
    DISPLAY_HEIGHT: 57,
  },
};

export const ROUND_ANIMATION = {
  ROUND_LINE: {
    X: 729,
    Y: 389,
    DISPLAY_WIDTH: 380,
    DISPLAY_HEIGHT: 130,
    ORIGIN_X: 0.5,
    ORIGIN_Y: 0.5,
  },
  ROUND_TEXT: {
    X: 730,
    Y: 384,
    STYLES: {
      fontFamily: FONT_FAMILY,
      fontSize: '40px',
      color: '#FFFFFF',
    },
  },
};

export const TRAJECTORY = {
  CIRCLE: {
    DISPLAY_WIDTH: 20,
    DISPLAY_HEIGHT: 20,
  },
  TRIANGLE: {
    DISPLAY_WIDTH: 32,
    DISPLAY_HEIGHT: 32,
  },
  DEPTH: 5,
};
