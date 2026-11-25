import {
  TEventLike,
  TEventWrapperConstructor
} from '../types';

import defineEventWrapper from './define-event-wrapper';

const theMap = new WeakMap<object, TEventWrapperConstructor<TEventLike>>();

/**
 * Get the wrapper class of a given prototype.
 */
export function mapOfEventWrapperConstructorGet<T extends TEventLike>(originalEvent: T, baseEventWrapper: TEventWrapperConstructor<TEventLike>): TEventWrapperConstructor<T> {
  const prototype = Object.getPrototypeOf(originalEvent) as object | null;
  
  if (prototype === null) {
    return baseEventWrapper as unknown as TEventWrapperConstructor<T>;
  }
  
  let wrapper = theMap.get(prototype) as TEventWrapperConstructor<T> | undefined;
  
  if (wrapper === undefined) {
    wrapper = defineEventWrapper(mapOfEventWrapperConstructorGet(prototype as unknown as TEventLike, baseEventWrapper), prototype) as unknown as TEventWrapperConstructor<T>;
    theMap.set(prototype, wrapper as unknown as TEventWrapperConstructor<TEventLike>);
  }
  
  return wrapper;
}

export function mapOfEventWrapperConstructorSet<T extends TEventLike>(prototype: object, wrapper: TEventWrapperConstructor<T>): void {
  theMap.set(prototype, wrapper as unknown as TEventWrapperConstructor<TEventLike>);
}
