import {
  IListenerList,
  TEventListenerLike
} from '../types';

import findEventListenerIndex from './find-event-listener-index';
import removeEventListenerAt from './remove-event-listener-at';

/**
 * Remove a listener.
 */
export default function removeEventListener(list: IListenerList, callback: TEventListenerLike, capture: boolean): boolean {
  const index = findEventListenerIndex(list, callback, capture);
  
  if (index !== -1) {
    return removeEventListenerAt(list, index);
  }
  
  return false;
}
