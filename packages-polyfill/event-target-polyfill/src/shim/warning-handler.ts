import {
  TWarningHandler
} from '../types';
import {
  assertType
} from '../util';

let currentWarnHandler: TWarningHandler | undefined;

/**
 * Set the warning handler.
 * @param value The warning handler to set.
 */
export function setWarningHandler(value: TWarningHandler | undefined): void {
  assertType(value === undefined || typeof value === 'function', 'The warning handler must be a function or undefined, but got %o.', value);
  
  currentWarnHandler = value;
}

/**
 * The warning information.
 */
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
