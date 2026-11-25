import {
  IEventListener,
  IAbortSignalClassType
} from '../types';

import isEventListenerCapture from './is-event-listener-capture';
import isEventListenerOnce from './is-event-listener-once';
import isEventListenerPassive from './is-event-listener-passive';
import {
  EventListenerWasDuplicated,
  OptionWasIgnored
} from './warning';

/**
 * Print warning for duplicated.
 */
export default function warnEventListenerDuplicate(listener: IEventListener, passive: boolean, once: boolean, signal: IAbortSignalClassType | undefined): void {
  EventListenerWasDuplicated.warn(isEventListenerCapture(listener) ? 'capture' : 'bubble', listener.callback);
  
  if (isEventListenerPassive(listener) !== passive) {
    OptionWasIgnored.warn('passive');
  }
  
  if (isEventListenerOnce(listener) !== once) {
    OptionWasIgnored.warn('once');
  }
  
  if (listener.signal !== signal) {
    OptionWasIgnored.warn('signal');
  }
}
