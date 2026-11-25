import {
  IEventListenerOptions
} from '../types';

/**
 * Check if the given value is an options object.
 */
export default function isEventListenerOptionsObject(value: unknown): value is IEventListenerOptions {
  return typeof value === 'object' && value !== null;
}
