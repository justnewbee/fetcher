import {
  EEventListenerFlags
} from '../enum';
import {
  TEventListenerLike,
  IAbortSignalClassType,
  IEventListener
} from '../types';

/**
 * Create a new listener.
 */
export default function createEventListener(callback: TEventListenerLike, capture: boolean, passive: boolean, once: boolean, signal: IAbortSignalClassType | undefined, signalListener: (() => void) | undefined): IEventListener {
  return {
    callback,
    flags: (capture ? EEventListenerFlags.Capture : EEventListenerFlags.None) | (passive ? EEventListenerFlags.Passive : EEventListenerFlags.None) | (once ? EEventListenerFlags.Once : EEventListenerFlags.None),
    signal,
    signalListener
  };
}
