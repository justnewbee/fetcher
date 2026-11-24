import {
  IEventClassType,
  TErrorHandler
} from '../types';

import anyToString from './any-to-string';
import assertType from './assert-type';

declare const dispatchEvent: ((event: IEventClassType) => boolean) | undefined;
declare const ErrorEvent: (new (type: string, init: { error?: unknown; message?: string; }) => IEventClassType) | undefined;
declare const process: {
  emit?(event: string, error: Error): boolean;
} | undefined;

let currentErrorHandler: TErrorHandler | undefined;

/**
 * Print an error message.
 */
export function reportError(maybeError: unknown): void {
  try {
    const error = maybeError instanceof Error ? maybeError : new Error(anyToString(maybeError));
    
    if (currentErrorHandler) { // Call the user-defined error handler if exists
      currentErrorHandler(error);
      
      return;
    }
    
    // Dispatch an `error` event if this is on a browser.
    if (typeof dispatchEvent === 'function' && typeof ErrorEvent === 'function') {
      dispatchEvent(new ErrorEvent('error', {
        error,
        message: error.message
      }));
    } else if (typeof process !== 'undefined' && typeof process.emit === 'function') { // Emit an `uncaughtException` event if this is on Node.js
      process.emit('uncaughtException', error);
      
      return;
    }
    
    // Otherwise, print the error.
    // eslint-disable-next-line no-console -- the fallback error handler prints to the console
    console.error(error);
  } catch {
    // ignore
  }
}

/**
 * Set the error handler.
 */
export function setErrorHandler(value: TErrorHandler | undefined): void {
  assertType(value === undefined || typeof value === 'function', 'The error handler must be a function or undefined, but got %o.', value);
  
  currentErrorHandler = value;
}
