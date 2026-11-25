import {
  IListenerList,
  TEventListenerListMap
} from '../types';

/**
 * Get the listener list of the given type.
 * If the listener list has not been initialized, initialize and return it.
 */
export default function ensureEventListenerList(listenerMap: TEventListenerListMap, type: string): IListenerList {
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
