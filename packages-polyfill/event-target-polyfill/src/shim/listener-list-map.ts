import {
  IListenerList,
  TListenerListMap
} from '../types';

/**
 * Create a new `TListenerListMap` object.
 */
export function createListenerListMap(): TListenerListMap {
  return Object.create(null) as TListenerListMap;
}

/**
 * Get the listener list of the given type.
 * If the listener list has not been initialized, initialize and return it.
 * @param listenerMap The listener list map.
 * @param type The event type to get.
 */
export function ensureListenerList(listenerMap: TListenerListMap, type: string): IListenerList {
  let list = listenerMap[type];
  
  if (list === undefined) {
    list = {
      attrCallback: undefined,
      attrListener: undefined,
      cow: false,
      listeners: []
    };
    listenerMap[type] = list;
  }
  
  return list;
}
