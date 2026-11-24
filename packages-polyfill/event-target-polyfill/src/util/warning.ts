import {
  TWarningHandler,
  TEventListenerLike
} from '../types';

import assertType from './assert-type';

let currentWarnHandler: TWarningHandler | undefined;

export class Warning<Args extends unknown[]> {
  readonly code: string;
  readonly message: string;
  
  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
  
  /**
   * Report this warning.
   * @param args The arguments of the warning.
   */
  warn(...args: Args): void {
    try {
      // Call the user-defined warning handler if exists.
      if (currentWarnHandler) {
        currentWarnHandler({
          code: this.code,
          message: this.message,
          args
        });
        
        return;
      }
      
      // Otherwise, print the warning.
      const stack = (new Error().stack ?? '').replace(/^(?:.+?\n){2}/gu, '\n');
      
      // eslint-disable-next-line no-console -- the default warning handler prints to the console
      console.warn(this.message, ...args, stack);
    } catch {
      // Ignore.
    }
  }
}

export const InitEventWasCalledWhileDispatching = new Warning<[]>('W01', 'Unable to initialize event under dispatching.');

export const FalsyWasAssignedToCancelBubble = new Warning<[]>('W02', 'Assigning any falsy value to \'cancelBubble\' property has no effect.');

export const TruthyWasAssignedToReturnValue = new Warning<[]>('W03', 'Assigning any truthy value to \'returnValue\' property has no effect.');

export const NonCancelableEventWasCanceled = new Warning<[]>('W04', 'Unable to preventDefault on non-cancelable events.');

export const CanceledInPassiveListener = new Warning<[]>('W05', 'Unable to preventDefault inside passive event listener invocation.');

export const EventListenerWasDuplicated = new Warning<[type: 'bubble' | 'capture', callback: TEventListenerLike]>('W06', 'An event listener wasn\'t added because it has been added already: %o, %o');

export const OptionWasIgnored = new Warning<[name: 'passive' | 'once' | 'signal']>('W07', 'The %o option value was abandoned because the event listener wasn\'t added as duplicated.');

export const InvalidEventListener = new Warning<[callback: unknown]>('W08', 'The \'callback\' argument must be a function or an object that has \'handleEvent\' method: %o');

export const InvalidAttributeHandler = new Warning<[callback: unknown]>('W09', 'Event attribute handler must be a function: %o');

/**
 * Set the warning handler.
 */
export function setWarningHandler(value: TWarningHandler | undefined): void {
  assertType(value === undefined || typeof value === 'function', 'The warning handler must be a function or undefined, but got %o.', value);
  
  currentWarnHandler = value;
}
