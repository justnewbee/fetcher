import formatMessage from './format-message';
import isEventListenerObject from './is-event-listener-object';
import {
  InvalidEventListener
} from './warning';

/**
 * Assert the type of 'callback' argument.
 */
export default function assertEventListenerCallback(callback: unknown): void {
  if (typeof callback === 'function' || isEventListenerObject(callback)) {
    return;
  }
  
  if (callback === null || callback === undefined || typeof callback === 'object') {
    InvalidEventListener.warn(callback);
    
    return;
  }
  
  throw new TypeError(formatMessage(InvalidEventListener.message, [callback]));
}
