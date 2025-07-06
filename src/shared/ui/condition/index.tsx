import React, { PropsWithChildren, ReactElement, ReactNode } from 'react';

import { IConditionProps } from './types/condition.types';

/**
 * Компонент условия
 *
 * @param props
 * @constructor
 * @return {ReactElement}
 */
export default function Condition(props: IConditionProps): ReactElement {
  const { _if, _then, _else } = props;

  return _if ? <ConditionItem>{_then}</ConditionItem> : <ConditionItem>{_else}</ConditionItem>;
}

function ConditionItem({ children }: PropsWithChildren): ReactNode {
  return typeof children === 'string' ? <>{children}</> : children;
}
