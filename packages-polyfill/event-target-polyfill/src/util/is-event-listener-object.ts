import {
  IEventListenerObject
} from '../types';

/**
 * Check if the given value is an object that has the `handleEvent` method.
 */
export default function isEventListenerObject(value: unknown): value is IEventListenerObject {
  return typeof value === 'object' && value !== null && typeof (value as Partial<IEventListenerObject>).handleEvent === 'function';
}
