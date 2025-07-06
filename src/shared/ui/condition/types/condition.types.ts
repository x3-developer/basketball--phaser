import { ReactElement } from 'react';

export interface IConditionProps {
  _if: boolean;
  _then: ReactElement | string;
  _else: ReactElement | string;
}
