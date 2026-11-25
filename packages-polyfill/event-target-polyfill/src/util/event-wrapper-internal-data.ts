import {
  IEventWrapperInternalData
} from '../types';

import assertType from './assert-type';

/**
 * Private data for event wrappers.
 */
const internalDataMap = new WeakMap<object, IEventWrapperInternalData>();

/**
 * Get private data.
 */
export function eventWrapperInternalDataGet(event: unknown): IEventWrapperInternalData {
  const retv = internalDataMap.get(event as object);
  
  assertType(retv !== undefined, '\'this\' is expected an Event object, but got %o', event);
  
  return retv;
}

export function eventWrapperInternalDataSet(target: object, data: IEventWrapperInternalData): void {
  internalDataMap.set(target, data);
}
