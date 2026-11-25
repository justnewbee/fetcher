import {
  TEventListenerListMap,
  IEventTargetClassType
} from '../types';

import assertType from './assert-type';
import createEventListenerListMap from './create-event-listener-list-map';

const theMap = new WeakMap<IEventTargetClassType, TEventListenerListMap>();

export function mapOfEventTargetListenerListMapGet(target: IEventTargetClassType, name = 'this'): TEventListenerListMap {
  const listenerListMap = theMap.get(target);
  
  assertType(listenerListMap !== undefined, '\'%s\' must be an object that EventTarget constructor created, but got another one: %o', name, target);
  
  return listenerListMap;
}

export function mapOfEventTargetListenerListMapSet(target: IEventTargetClassType, map = createEventListenerListMap()): void {
  theMap.set(target, map);
}
