import {
  TEventListenerListMap
} from '../types';

/**
 * Create a new `TEventListenerListMap` object.
 */
export default function createEventListenerListMap(): TEventListenerListMap {
  return Object.create(null) as TEventListenerListMap;
}
