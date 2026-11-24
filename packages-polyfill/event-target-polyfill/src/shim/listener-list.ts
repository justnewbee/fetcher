import {
  IListenerList,
  TEventListenerLike,
  IEventListener,
  IAbortSignal
} from '../types';
import {
  createEventListener
} from '../util';

import {
  isEventListenerCapture,
  setEventListenerRemoved
} from './listener';

/**
 * Find the index of given listener. This returns `-1` if not found.
 * @param list The listener list.
 * @param callback The callback function to find.
 * @param capture The capture flag to find.
 */
export function findIndexOfListener({
  listeners
}: IListenerList, callback: TEventListenerLike, capture: boolean): number {
  return listeners.findIndex(listener => {
    return listener.callback === callback && isEventListenerCapture(listener) === capture;
  });
}

/**
 * Remove a listener.
 */
export function removeListenerAt(list: IListenerList, index: number, disableCow = false): boolean {
  const listener = list.listeners[index];

  if (listener === undefined) {
    return false;
  }

  // Set the removed flag.
  setEventListenerRemoved(listener);

  // Dispose the abort signal listener if exists.
  if (listener.signal !== undefined && listener.signalListener !== undefined) {
    listener.signal.removeEventListener('abort', listener.signalListener);
  }

  // Remove it from the array.
  if (list.cow && !disableCow) {
    list.cow = false;
    list.listeners = list.listeners.filter((_, i) => i !== index);

    return false;
  }

  list.listeners.splice(index, 1);

  return true;
}

/**
 * Remove a listener.
 * @param list The listener list.
 * @param callback The callback function to find.
 * @param capture The capture flag to find.
 * @returns `true` if it mutated the list directly.
 */
export function removeListener(
    list: IListenerList,
    callback: TEventListenerLike,
    capture: boolean
): boolean {
  const index = findIndexOfListener(list, callback, capture);

  if (index !== -1) {
    return removeListenerAt(list, index);
  }

  return false;
}

/**
 * Add the given listener, does copy-on-write if needed.
 */
export function addListener(
    list: IListenerList,
    callback: TEventListenerLike,
    capture: boolean,
    passive: boolean,
    once: boolean,
    signal: IAbortSignal | undefined
): IEventListener {
  let signalListener: (() => void) | undefined;

  if (signal !== undefined) {
    signalListener = removeListener.bind(null, list, callback, capture);
    signal.addEventListener('abort', signalListener);
  }

  const listener = createEventListener(
      callback,
      capture,
      passive,
      once,
      signal,
      signalListener
  );

  if (list.cow) {
    list.cow = false;
    list.listeners = [...list.listeners, listener];
  } else {
    list.listeners.push(listener);
  }

  return listener;
}
