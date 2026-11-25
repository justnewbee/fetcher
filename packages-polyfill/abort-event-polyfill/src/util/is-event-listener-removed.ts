import {
  EEventListenerFlags
} from '../enum';
import {
  IEventListener
} from '../types';

/**
 * Check if the given listener has the `removed` flag or not.
 */
export default function isEventListenerRemoved(listener: IEventListener): boolean {
  return Boolean(listener.flags & EEventListenerFlags.Removed);
}
