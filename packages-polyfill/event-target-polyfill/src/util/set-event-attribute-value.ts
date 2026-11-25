import {
  IEventClassType,
  TAnyEventTarget,
  TEventListener,
  TEventListenerLike
} from '../types';

import {
  InvalidAttributeHandler
} from './warning';
import removeEventAttributeListener from './remove-event-attribute-listener';
import upsertEventAttributeListener from './upsert-event-attribute-listener';

/**
 * Set an event listener to a given event attribute.
 *
 * The `this` type of the callback is bound to the given target, because the internal listener
 * list is target-agnostic and types callbacks with the widened `this: object`.
 */
export default function setEventAttributeValue<Target extends TAnyEventTarget>(target: Target, type: string, callback: TEventListener<Target, IEventClassType> | null | undefined): void {
  if (callback !== null && callback !== undefined && typeof callback !== 'function') {
    InvalidAttributeHandler.warn(callback);
  }
  
  if (typeof callback === 'function' || (typeof callback === 'object' && callback !== null)) {
    upsertEventAttributeListener(target, type, callback as unknown as TEventListenerLike);
  } else {
    removeEventAttributeListener(target, type);
  }
}
