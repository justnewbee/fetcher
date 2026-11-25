import {
  TEventListenerListMap
} from '../types';

import assertType from './assert-type';
import createEventListenerListMap from './create-event-listener-list-map';

/**
 * Internal data.
 */
const internalDataMap = new WeakMap<object, TEventListenerListMap>();

/**
 * Get private data.
 */
export function eventTargetInternalDataGet(target: object, name = 'this'): TEventListenerListMap {
  const retv = internalDataMap.get(target);
  
  assertType(retv !== undefined, '\'%s\' must be an object that EventTarget constructor created, but got another one: %o', name, target);
  
  return retv;
}

export function eventTargetInternalDataSet(target: object, map = createEventListenerListMap()): void {
  internalDataMap.set(target, map);
}
