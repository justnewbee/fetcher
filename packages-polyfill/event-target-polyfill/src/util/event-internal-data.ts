import {
  IEventInternalData
} from '../types';

import assertType from './assert-type';

/**
 * Private data for event wrappers.
 */
const internalDataMap = new WeakMap<object, IEventInternalData>();

export function eventInternalDataGet(event: unknown, name = 'this'): IEventInternalData {
  const retv = internalDataMap.get(event as object);
  
  assertType(retv !== undefined, '\'%s\' must be an object that Event constructor created, but got another one: %o', name, event);
  
  return retv;
}

export function eventInternalDataSet(target: object, data: Omit<IEventInternalData, 'type'> & {
  type: number | string;
}): void {
  internalDataMap.set(target, {
    ...data,
    type: String(data.type)
  });
}
