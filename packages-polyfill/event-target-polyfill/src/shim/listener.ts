import {
  EListenerFlags
} from '../enum';
import {
  IEventClassType,
  IEventListener
} from '../types';

import {
  reportError
} from './error-handler';

/**
 * Set the `removed` flag to the given listener.
 */
export function setEventListenerRemoved(listener: IEventListener): void {
  listener.flags |= EListenerFlags.Removed;
}

/**
 * Check if the given listener has the `capture` flag or not.
 */
export function isEventListenerCapture(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Capture);
}

/**
 * Check if the given listener has the `passive` flag or not.
 */
export function isEventListenerPassive(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Passive);
}

/**
 * Check if the given listener has the `once` flag or not.
 */
export function isEventListenerOnce(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Once);
}

/**
 * Check if the given listener has the `removed` flag or not.
 */
export function isEventListenerRemoved(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Removed);
}

/**
 * Call an event listener.
 */
export function invokeEventListenerCallback({
  callback
}: IEventListener, target: object, event: IEventClassType): void {
  try {
    if (typeof callback === 'function') {
      callback.call(target, event);
    } else if (typeof callback.handleEvent === 'function') {
      callback.handleEvent(event);
    }
  } catch (thrownError) {
    reportError(thrownError);
  }
}
