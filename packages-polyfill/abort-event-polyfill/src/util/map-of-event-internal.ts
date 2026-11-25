import {
  IEventClassType,
  IEventInternal
} from '../types';

import assertType from './assert-type';

const theMap = new WeakMap<IEventClassType, IEventInternal>();

export function mapOfEventInternalGet(event: IEventClassType, name = 'this'): IEventInternal {
  const internal = theMap.get(event);
  
  assertType(internal !== undefined, '\'%s\' must be an object that Event constructor created, but got another one: %o', name, event);
  
  return internal;
}

export function mapOfEventInternalSet(target: IEventClassType, data: Omit<IEventInternal, 'type'> & {
  type: number | string;
}): void {
  theMap.set(target, {
    ...data,
    type: String(data.type)
  });
}
