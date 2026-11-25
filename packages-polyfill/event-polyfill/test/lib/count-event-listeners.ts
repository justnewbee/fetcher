import {
  EventTarget
} from '../../src';
import {
  mapOfEventTargetListenerListMapGet
} from '../../src/util';

/**
 * Get registered event listeners from an `EventTarget` object.
 */
export default function countEventListeners(target: EventTarget, type?: string): number {
  const listenerMap = mapOfEventTargetListenerListMapGet(target, 'target');
  const keys = type ? [type] : Object.keys(listenerMap);
  
  return keys.reduce((count, key) => count + (listenerMap[key]?.listeners.length ?? 0), 0);
}
