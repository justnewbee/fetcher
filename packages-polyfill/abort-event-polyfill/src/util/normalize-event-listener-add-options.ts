import {
  IEventClassType,
  TAnyEventTarget,
  TEventListener,
  IEventListenerAddOptions,
  IEventListenerAddOptionsNormalized
} from '../types';

import assertEventListenerCallback from './assert-event-listener-callback';
import isEventListenerOptionsObject from './is-event-listener-options-object';

/**
 * Normalize the options of the `addEventListener` method.
 */
export default function normalizeEventListenerAddOptions<Target extends TAnyEventTarget, EventType extends IEventClassType>(type: string, callback: TEventListener<Target, EventType> | null | undefined, options: boolean | IEventListenerAddOptions | undefined): IEventListenerAddOptionsNormalized<Target, EventType> {
  assertEventListenerCallback(callback);
  
  if (isEventListenerOptionsObject(options)) {
    return {
      type,
      callback: callback ?? undefined,
      capture: options.capture ?? false,
      passive: options.passive ?? false,
      once: options.once ?? false,
      signal: options.signal ?? undefined
    };
  }
  
  return {
    type,
    callback: callback ?? undefined,
    capture: options ?? false,
    passive: false,
    once: false,
    signal: undefined
  };
}
