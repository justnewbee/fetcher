import {
  EListenerFlags
} from '../enum';
import {
  IEventClassType,
  IEventListenerObject,
  TEventListenerLike,
  IAbortSignal,
  IEventListener
} from '../types';

import {
  reportError
} from './error-handler';

/**
 * Check if the given value is an object that has the `handleEvent` method.
 * @param value The value to check.
 */
export function isEventListenerObject(value: unknown): value is IEventListenerObject {
  return typeof value === 'object' && value !== null && typeof (value as Partial<IEventListenerObject>).handleEvent === 'function';
}

/**
 * Create a new listener.
 * @param callback The callback function.
 * @param capture The capture flag.
 * @param passive The passive flag.
 * @param once The once flag.
 * @param signal The abort signal.
 * @param signalListener The abort event listener for the abort signal.
 */
export function createListener(callback: TEventListenerLike, capture: boolean, passive: boolean, once: boolean, signal: IAbortSignal | undefined, signalListener: (() => void) | undefined): IEventListener {
  return {
    callback,
    flags: (capture ? EListenerFlags.Capture : EListenerFlags.None) | (passive ? EListenerFlags.Passive : EListenerFlags.None) | (once ? EListenerFlags.Once : EListenerFlags.None),
    signal,
    signalListener
  };
}

/**
 * Set the `removed` flag to the given listener.
 * @param listener The listener to check.
 */
export function setRemoved(listener: IEventListener): void {
  listener.flags |= EListenerFlags.Removed;
}

/**
 * Check if the given listener has the `capture` flag or not.
 * @param listener The listener to check.
 */
export function isCapture(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Capture);
}

/**
 * Check if the given listener has the `passive` flag or not.
 * @param listener The listener to check.
 */
export function isPassive(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Passive);
}

/**
 * Check if the given listener has the `once` flag or not.
 * @param listener The listener to check.
 */
export function isOnce(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Once);
}

/**
 * Check if the given listener has the `removed` flag or not.
 * @param listener The listener to check.
 */
export function isRemoved(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Removed);
}

/**
 * Call an event listener.
 * @param listener The listener to call.
 * @param target The event target object for `thisArg`.
 * @param event The event object for the first argument.
 */
export function invokeCallback(
    {
      callback
    }: IEventListener,
    target: object,
    event: IEventClassType
): void {
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
