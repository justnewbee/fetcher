import {
  TEventListenerListMap
} from '../types';

import assertType from './assert-type';
import createEventListenerListMap from './create-event-listener-list-map';

const theMap = new WeakMap<object, TEventListenerListMap>();

export function mapOfEventTargetInternalGet(target: object, name = 'this'): TEventListenerListMap {
  const retv = theMap.get(target);
  
  assertType(retv !== undefined, '\'%s\' must be an object that EventTarget constructor created, but got another one: %o', name, target);
  
  return retv;
}

export function mapOfEventTargetInternalSet(target: object, map = createEventListenerListMap()): void {
  theMap.set(target, map);
}
