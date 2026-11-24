import {
  TEventListenerListMap
} from '../types';

/**
 * Create a new `TListenerListMap` object.
 */
export default function createEventListenerListMap(): TEventListenerListMap {
  return Object.create(null) as TEventListenerListMap;
}
