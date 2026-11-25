import {
  IEventClassType,
  IEventListener
} from '../types';

import {
  reportError
} from './error';

/**
 * Call an event listener.
 */
export default function invokeEventListenerCallback({
  callback
}: IEventListener, target: object, event: IEventClassType): void {
  try {
    if (typeof callback === 'function') {
      callback.call(target, event);
    } else if (typeof callback.handleEvent === 'function') {
      callback.handleEvent(event);
    }
  } catch (err) {
    reportError(err);
  }
}
