import {
  TAnyEventTarget
} from '../types';

import {
  mapOfEventTargetInternalGet
} from './map-of-event-target-internal';
import removeEventListener from './remove-event-listener';

/**
 * Remove the given event attribute handler.
 */
export default function removeEventAttributeListener(target: TAnyEventTarget, type: string): void {
  const listMap = mapOfEventTargetInternalGet(target, 'target');
  const list = listMap[type];
  
  if (list?.attrListener) {
    removeEventListener(list, list.attrListener.callback, false);
    list.attrCallback = list.attrListener = undefined;
  }
}
