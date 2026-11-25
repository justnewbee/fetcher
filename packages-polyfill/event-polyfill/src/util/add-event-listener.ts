import {
  IListenerList,
  TEventListenerLike,
  IEventListener,
  IAbortSignalClassType
} from '../types';

import createEventListener from './create-event-listener';
import removeEventListener from './remove-event-listener';

/**
 * Add the given listener, does copy-on-write if needed.
 */
export default function addEventListener(list: IListenerList, callback: TEventListenerLike, capture: boolean, passive: boolean, once: boolean, signal: IAbortSignalClassType | undefined): IEventListener {
  let signalListener: (() => void) | undefined;
  
  if (signal !== undefined) {
    signalListener = removeEventListener.bind(null, list, callback, capture);
    signal.addEventListener('abort', signalListener);
  }
  
  const listener = createEventListener(callback, capture, passive, once, signal, signalListener);
  
  if (list.cow) {
    list.cow = false;
    list.listeners = [...list.listeners, listener];
  } else {
    list.listeners.push(listener);
  }
  
  return listener;
}
