import {
  TEventLike,
  TEventWrapperConstructor
} from '../types';

import defineEventWrapperRedirectDescriptor from './define-event-wrapper-redirect-descriptor';

/**
 * Define new wrapper class.
 */
export default function defineEventWrapper(baseEventWrapper: TEventWrapperConstructor<TEventLike>, originalPrototype: object): TEventWrapperConstructor<TEventLike> {
  class CustomEventWrapper extends baseEventWrapper {}
  
  for (const key of Object.keys(originalPrototype)) {
    Object.defineProperty(CustomEventWrapper.prototype, key, defineEventWrapperRedirectDescriptor(originalPrototype, key));
  }
  
  return CustomEventWrapper;
}
