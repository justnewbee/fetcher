import {
  IListenerList
} from '../types';

import setEventListenerRemoved from './set-event-listener-removed';

/**
 * Remove a listener.
 */
export default function removeEventListenerAt(list: IListenerList, index: number, disableCow = false): boolean {
  const listener = list.listeners[index];
  
  if (listener === undefined) {
    return false;
  }
  
  setEventListenerRemoved(listener);
  
  // Dispose the abort signal listener if exists.
  if (listener.signal !== undefined && listener.signalListener !== undefined) {
    listener.signal.removeEventListener('abort', listener.signalListener);
  }
  
  if (list.cow && !disableCow) { // Remove it from the array
    list.cow = false;
    list.listeners = list.listeners.filter((_, i) => i !== index);
    
    return false;
  }
  
  list.listeners.splice(index, 1);
  
  return true;
}
