import {
  IEventClassType,
  TAnyEventTarget,
  TEventListener,
  IEventListenerOptions,
  IEventListenerOptionsNormalized
} from '../types';

import assertEventListenerCallback from './assert-event-listener-callback';
import isEventListenerOptionsObject from './is-event-listener-options-object';

/**
 * Normalize the options of the `removeEventListener` method.
 */
export default function normalizeEventListenerOptions<Target extends TAnyEventTarget, EventType extends IEventClassType>(type: string, callback: TEventListener<Target, EventType> | null | undefined, options: boolean | IEventListenerOptions | undefined): IEventListenerOptionsNormalized<Target, EventType> {
  assertEventListenerCallback(callback);
  
  if (isEventListenerOptionsObject(options)) {
    return {
      type,
      callback: callback ?? undefined,
      capture: options.capture ?? false
    };
  }
  
  return {
    type,
    callback: callback ?? undefined,
    capture: options ?? false
  };
}
