import {
  IEventClassType,
  TListenerCallback,
  TEventListenerLike,
  IListenerList,
  TAnyEventTarget,
  TEventListenerCallback
} from '../types';
import {
  ensureEventListenerList
} from '../util';

import {
  getEventTargetInternalData
} from './event-target-shim';
import {
  addListener,
  removeListener
} from './listener-list';
import {
  InvalidAttributeHandler
} from './warnings';

/**
 * Get the current value of a given event attribute.
 * @param target The `EventTarget` object to get.
 * @param type The event type.
 */
export function getEventAttributeValue<Target extends TAnyEventTarget, EventType extends IEventClassType>(target: Target, type: string): TEventListenerCallback<Target, EventType> | null {
  const listMap = getEventTargetInternalData(target, 'target');
  
  return (listMap[type]?.attrCallback ?? null) as unknown as TEventListenerCallback<Target, EventType> | null;
}

// ------------------------------------------------------------------------------
// Helpers
// ------------------------------------------------------------------------------

/**
 * Define the callback function for the given listener list object.
 * It calls `attrCallback` property if the property value is a function.
 * @param list The `IListenerList` object.
 */
function defineEventAttributeCallback(list: IListenerList): TListenerCallback {
  return function (this: object, event: IEventClassType): void {
    const callback = list.attrCallback;
    
    if (typeof callback === 'function') {
      callback.call(this, event);
    }
  };
}

/**
 * Remove the given event attribute handler.
 * @param target The `EventTarget` object to remove.
 * @param type The event type.
 */
function removeEventAttributeListener(target: TAnyEventTarget, type: string): void {
  const listMap = getEventTargetInternalData(target, 'target');
  const list = listMap[type];
  
  if (list?.attrListener) {
    removeListener(list, list.attrListener.callback, false);
    list.attrCallback = list.attrListener = undefined;
  }
}

/**
 * Update or insert the given event attribute handler.
 * @param target The `EventTarget` object to set.
 * @param type The event type.
 * @param callback The event listener.
 */
function upsertEventAttributeListener(target: TAnyEventTarget, type: string, callback: TEventListenerLike): void {
  const list = ensureEventListenerList(getEventTargetInternalData(target, 'target'), type);
  
  list.attrCallback = callback;
  
  if (list.attrListener === undefined) {
    list.attrListener = addListener(list, defineEventAttributeCallback(list), false, false, false, undefined);
  }
}

/**
 * Set an event listener to a given event attribute.
 * @param target The `EventTarget` object to set.
 * @param type The event type.
 * @param callback The event listener.
 */
export function setEventAttributeValue(target: TAnyEventTarget, type: string, callback: TEventListenerLike | null | undefined): void {
  if (callback !== null && callback !== undefined && typeof callback !== 'function') {
    InvalidAttributeHandler.warn(callback);
  }
  
  if (typeof callback === 'function' || (typeof callback === 'object' && callback !== null)) {
    upsertEventAttributeListener(target, type, callback);
  } else {
    removeEventAttributeListener(target, type);
  }
}
