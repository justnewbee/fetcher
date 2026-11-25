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
  const proto = Object.getPrototypeOf(originalEvent) as object | null;
  
  if (proto === null) {
    return baseEventWrapper as unknown as TEventWrapperConstructor<T>;
  }
  
  let wrapper = theMap.get(proto) as TEventWrapperConstructor<T> | undefined;
  
  if (wrapper === undefined) {
    wrapper = defineEventWrapper(mapOfEventWrapperConstructorGet(proto as unknown as TEventLike, baseEventWrapper), proto) as unknown as TEventWrapperConstructor<T>;
    theMap.set(proto, wrapper as unknown as TEventWrapperConstructor<TEventLike>);
  }
  
  return wrapper;
}

export function mapOfEventWrapperConstructorSet<T extends TEventLike>(proto: object, wrapper: TEventWrapperConstructor<T>): void {
  theMap.set(proto, wrapper as unknown as TEventWrapperConstructor<TEventLike>);
}
