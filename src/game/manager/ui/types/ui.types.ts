import { ASSETS_PATH } from '@src/shared/constants/env';

export const UI_ASSETS_PATH = `${ASSETS_PATH}/sprites` as const;

export const FONT_FAMILY = 'DrukTextWideCyTTBold';

export const UI_ELEMENT_KEYS = {
  START_BUTTON: 'startButton',
  NEXT_BUTTON: 'nextButton',
  SKIP_BUTTON: 'skipButton',
  BURGER_BUTTON: 'burgerButton',
  SOUND_ON_BUTTON: 'soundOnButton',
  SOUND_OFF_BUTTON: 'soundOffButton',
  EXIT_BUTTON: 'exitButton',
  SCOREBOARD: 'scoreboard',
  PLAYER_FLAG: 'playerFlag',
  OPPONENT_FLAG: 'computerFlag',
  EMPTY_TURN: 'emptyTurn',
  CURRENT_TURN: 'currentTurn',
  SUCCESS_TURN: 'successTurn',
  FAIL_TURN: 'failTurn',
  BLUR_LINE: 'blurLine',
  ROUND_LINE: 'roundeLine',
  VERSUS: 'versus',
  CONFETTI: 'confetti',
  SCORE_LINE: 'scoreLine',
} as const;

export const TEXT_ELEMENT_KEYS = {
  LOADING: 'loading',
  BASKETBALL: 'basketball',
  WINNER: 'winner',
  PLAYER_VERSUS: 'playerVersus',
  OPPONENT_VERSUS: 'opponentVersus',
  PLAYER_SCORE: 'playerScore',
  OPPONENT_SCORE: 'opponentScore',
  SCORE_SEPARATOR: 'scoreSeparator',
  ROUND_TEXT: 'roundText',
};

export type UIElementKeyType = (typeof UI_ELEMENT_KEYS)[keyof typeof UI_ELEMENT_KEYS];
export type TextElementKeyType = (typeof TEXT_ELEMENT_KEYS)[keyof typeof TEXT_ELEMENT_KEYS];

export interface IUIElementOptions {
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
  isInteractive?: boolean;
  cursorOnHover?: string;
  alpha?: number;
  depth?: number;
}

export interface ITextOptions {
  alpha?: number;
  depth?: number;
}

export const INTERFACE_BUTTON_OPTIONS = {
  displaySizes: {
    displayWidth: 52,
    displayHeight: 43,
  },
  isInteractive: true,
  cursorOnHover: 'pointer',
  depth: 6,
} as const;
