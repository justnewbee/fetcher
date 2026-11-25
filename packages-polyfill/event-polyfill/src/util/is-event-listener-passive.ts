import {
  EEventListenerFlags
} from '../enum';
import {
  IEventListener
} from '../types';

/**
 * Check if the given listener has the `passive` flag or not.
 */
export default function isEventListenerPassive(listener: IEventListener): boolean {
  return Boolean(listener.flags & EEventListenerFlags.Passive);
}
