import {
  EEventListenerFlags
} from '../enum';
import {
  IEventListener
} from '../types';

/**
 * Check if the given listener has the `once` flag or not.
 */
export default function isEventListenerOnce(listener: IEventListener): boolean {
  return Boolean(listener.flags & EEventListenerFlags.Once);
}
