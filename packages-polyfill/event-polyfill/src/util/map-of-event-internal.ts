import {
  IEventInternalData
} from '../types';

import assertType from './assert-type';

const theMap = new WeakMap<object, IEventInternalData>();

export function mapOfEventInternalGet(event: unknown, name = 'this'): IEventInternalData {
  const retv = theMap.get(event as object);
  
  assertType(retv !== undefined, '\'%s\' must be an object that Event constructor created, but got another one: %o', name, event);
  
  return retv;
}

export function mapOfEventInternalSet(target: object, data: Omit<IEventInternalData, 'type'> & {
  type: number | string;
}): void {
  theMap.set(target, {
    ...data,
    type: String(data.type)
  });
}
