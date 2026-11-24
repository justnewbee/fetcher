import {
  EListenerFlags
} from '../enum';
import {
  TEventListenerLike,
  IAbortSignal,
  IEventListener
} from '../types';

/**
 * Create a new listener.
 */
export default function createEventListener(callback: TEventListenerLike, capture: boolean, passive: boolean, once: boolean, signal: IAbortSignal | undefined, signalListener: (() => void) | undefined): IEventListener {
  return {
    callback,
    flags: (capture ? EListenerFlags.Capture : EListenerFlags.None) | (passive ? EListenerFlags.Passive : EListenerFlags.None) | (once ? EListenerFlags.Once : EListenerFlags.None),
    signal,
    signalListener
  };
}
