import {
  TAnyEventTarget,
  TEventListenerLike
} from '../types';

import {
  mapOfEventTargetInternalGet
} from './map-of-event-target-internal';
import addEventListener from './add-event-listener';
import defineEventAttributeCallback from './define-event-attribute-callback';
import ensureEventListenerList from './ensure-event-listener-list';

/**
 * Update or insert the given event attribute handler.
 */
export default function upsertEventAttributeListener(target: TAnyEventTarget, type: string, callback: TEventListenerLike): void {
  const list = ensureEventListenerList(mapOfEventTargetInternalGet(target, 'target'), type);
  
  list.attrCallback = callback;
  
  if (list.attrListener === undefined) {
    list.attrListener = addEventListener(list, defineEventAttributeCallback(list), false, false, false, undefined);
  }
}
