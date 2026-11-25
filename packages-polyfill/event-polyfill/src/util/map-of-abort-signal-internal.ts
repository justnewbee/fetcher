import {
  IAbortSignalInternalData,
  IAbortSignalClassType
} from '../types';

/**
 * Internal data for each instance.
 */
const theMap = new WeakMap<IAbortSignalClassType, IAbortSignalInternalData>();

/**
 * Get the internal data of a given signal.
 */
export function mapOfAbortSignalInternalGet(signal: IAbortSignalClassType): IAbortSignalInternalData {
  const data = theMap.get(signal);
  
  if (data === undefined) {
    const value: unknown = signal;
    
    throw new TypeError(`Expected 'this' to be an 'AbortSignal' object, but got ${value === null ? 'null' : typeof value}`);
  }
  
  return data;
}

export function mapOfAbortSignalInternalSet(target: IAbortSignalClassType, data: IAbortSignalInternalData): void {
  theMap.set(target, data);
}
