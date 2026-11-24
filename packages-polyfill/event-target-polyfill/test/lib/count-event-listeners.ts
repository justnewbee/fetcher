import {
  eventTargetInternalDataGet
} from '../../src/util';
import EventTargetShim from '../../src/shim/event-target-shim';

/**
 * Get registered event listeners from an `EventTarget` object.
 */
export function countEventListeners(
    target: EventTargetShim,
    type?: string
): number {
  const listenerMap = eventTargetInternalDataGet(target, 'target');
  const keys = type ? [type] : Object.keys(listenerMap);
  
  return keys.reduce((count, key) => count + (listenerMap[key]?.listeners.length ?? 0), 0);
}
