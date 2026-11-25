import {
  IAbortSignalClassType,
  IAbortControllerClassType
} from '../types';

const theMap = new WeakMap<IAbortControllerClassType, IAbortSignalClassType>();

/**
 * Get the associated signal of a given controller.
 */
export function mapOfAbortControllerSignalGet(controller: IAbortControllerClassType): IAbortSignalClassType {
  const signal = theMap.get(controller);
  
  if (signal === undefined) {
    const value: unknown = controller;
    
    throw new TypeError(`Expected 'this' to be an 'AbortController' object, but got ${value === null ? 'null' : typeof value}`);
  }
  
  return signal;
}

export function mapOfAbortControllerSignalSet(target: IAbortControllerClassType, signal: IAbortSignalClassType): void {
  theMap.set(target, signal);
}
