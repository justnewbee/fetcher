import {
  TAnyEventTarget
} from '../types';

import {
  eventTargetInternalDataGet
} from './event-target-internal-data';
import removeEventListener from './remove-event-listener';

/**
 * Remove the given event attribute handler.
 */
export default function removeEventAttributeListener(target: TAnyEventTarget, type: string): void {
  const listMap = eventTargetInternalDataGet(target, 'target');
  const list = listMap[type];
  
  if (list?.attrListener) {
    removeEventListener(list, list.attrListener.callback, false);
    list.attrCallback = list.attrListener = undefined;
  }
}
