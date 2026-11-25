import {
  TAnyEventTarget
} from '../types';

import {
  mapOfEventTargetListenerListMapGet
} from './map-of-event-target-listener-list-map';
import removeEventListener from './remove-event-listener';

/**
 * Remove the given event attribute handler.
 */
export default function removeEventAttributeListener(target: TAnyEventTarget, type: string): void {
  const listMap = mapOfEventTargetListenerListMapGet(target, 'target');
  const list = listMap[type];
  
  if (list?.attrListener) {
    removeEventListener(list, list.attrListener.callback, false);
    list.attrCallback = list.attrListener = undefined;
  }
}
