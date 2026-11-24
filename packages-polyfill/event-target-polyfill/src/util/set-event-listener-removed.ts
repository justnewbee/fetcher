import {
  EListenerFlags
} from '../enum';
import {
  IEventListener
} from '../types';

/**
 * Set the `removed` flag to the given listener.
 */
export default function setEventListenerRemoved(listener: IEventListener): void {
  listener.flags |= EListenerFlags.Removed;
}
