import {
  EListenerFlags
} from '../enum';
import {
  IEventListener
} from '../types';

/**
 * Check if the given listener has the `capture` flag or not.
 */
export default function isEventListenerCapture(listener: IEventListener): boolean {
  return Boolean(listener.flags & EListenerFlags.Capture);
}
