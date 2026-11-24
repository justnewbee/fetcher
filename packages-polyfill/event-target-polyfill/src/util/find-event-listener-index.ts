import {
  IListenerList,
  TEventListenerLike
} from '../types';

import isEventListenerCapture from './is-event-listener-capture';

/**
 * Find the index of given listener. This returns `-1` if not found.
 */
export default function findEventListenerIndex(list: IListenerList, callback: TEventListenerLike, capture: boolean): number {
  return list.listeners.findIndex(v => v.callback === callback && isEventListenerCapture(v) === capture);
}
