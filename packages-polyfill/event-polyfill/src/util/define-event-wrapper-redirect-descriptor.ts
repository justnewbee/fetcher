import assertType from './assert-type';
import {
  eventWrapperInternalDataGet
} from './event-wrapper-internal-data';

/**
 * Get the property descriptor to redirect a given property.
 */
export default function defineEventWrapperRedirectDescriptor(obj: object, key: string): PropertyDescriptor {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  
  assertType(descriptor !== undefined, 'The property must be an own property of the given object: %o', key);
  
  return {
    get() {
      const original = eventWrapperInternalDataGet(this).original as Record<string, unknown>;
      const value = original[key];
      
      if (typeof value === 'function') {
        return value.bind(original) as unknown;
      }
      
      return value;
    },
    set(value: unknown) {
      const original = eventWrapperInternalDataGet(this).original as Record<string, unknown>;
      
      original[key] = value;
    },
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable
  };
}
