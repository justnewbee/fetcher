/* eslint-disable @typescript-eslint/no-deprecated */
import {
  IEventClassType,
  TEventLike,
  TEventWrapperOf,
  TEventWrapperConstructor
} from '../types';
import {
  eventWrapperInternalDataGet,
  eventWrapperInternalDataSet,
  defineEventWrapperRedirectDescriptor,
  defineEventWrapper
} from '../util';

import EventShim from './event-shim';

/**
 * Cache for wrapper classes.
 */
const wrapperClassCache = new WeakMap<object, TEventWrapperConstructor<TEventLike>>();

/**
 * Get the wrapper class of a given prototype.
 */
function getEventWrapperClassOf<T extends TEventLike>(originalEvent: T, baseEventWrapper: TEventWrapperConstructor<TEventLike>): TEventWrapperConstructor<T> {
  const prototype = Object.getPrototypeOf(originalEvent) as object | null;
  
  if (prototype === null) {
    return baseEventWrapper as unknown as TEventWrapperConstructor<T>;
  }
  
  let wrapper = wrapperClassCache.get(prototype) as TEventWrapperConstructor<T> | undefined;
  
  if (wrapper === undefined) {
    wrapper = defineEventWrapper(getEventWrapperClassOf(prototype as unknown as TEventLike, baseEventWrapper), prototype) as unknown as TEventWrapperConstructor<T>;
    wrapperClassCache.set(prototype, wrapper as unknown as TEventWrapperConstructor<TEventLike>);
  }
  
  return wrapper;
}

/**
 * An implementation of `Event` interface, that wraps a given event object.
 * This class controls the internal state of `Event`.
 *
 * @see https://dom.spec.whatwg.org/#interface-event
 */
export default class EventWrapper<EventType extends string> extends EventShim<EventType> {
  /**
   * Wrap a given event object to control states.
   */
  static wrap<T extends TEventLike>(event: T): TEventWrapperOf<T> {
    return new (getEventWrapperClassOf(event, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>))(event);
  }
  
  protected constructor(event: IEventClassType<EventType>) {
    super(event.type, {
      bubbles: event.bubbles,
      cancelable: event.cancelable,
      composed: event.composed
    });
    
    if (event.cancelBubble) {
      super.stopPropagation();
    }
    
    if (event.defaultPrevented) {
      super.preventDefault();
    }
    
    eventWrapperInternalDataSet(this, {
      original: event
    });
    
    const keys = Object.keys(event);
    
    for (const key of keys) { // Define accessors
      if (!(key in this)) {
        Object.defineProperty(this, key, defineEventWrapperRedirectDescriptor(event, key));
      }
    }
  }
  
  stopPropagation(): void {
    super.stopPropagation();
    
    const {
      original
    } = eventWrapperInternalDataGet(this);
    
    if ('stopPropagation' in original) {
      original.stopPropagation?.();
    }
  }
  
  get cancelBubble(): boolean {
    return super.cancelBubble;
  }
  
  set cancelBubble(value: boolean) {
    super.cancelBubble = value;
    
    const {
      original
    } = eventWrapperInternalDataGet(this);
    
    if ('cancelBubble' in original) {
      original.cancelBubble = value;
    }
  }
  
  stopImmediatePropagation(): void {
    super.stopImmediatePropagation();
    
    const {
      original
    } = eventWrapperInternalDataGet(this);
    
    if ('stopImmediatePropagation' in original) {
      original.stopImmediatePropagation?.();
    }
  }
  
  get returnValue(): boolean {
    return super.returnValue;
  }
  
  set returnValue(value: boolean) {
    super.returnValue = value;
    
    const {
      original
    } = eventWrapperInternalDataGet(this);
    
    if ('returnValue' in original) {
      original.returnValue = value;
    }
  }
  
  preventDefault(): void {
    super.preventDefault();
    
    const {
      original
    } = eventWrapperInternalDataGet(this);
    
    if ('preventDefault' in original) {
      original.preventDefault?.();
    }
  }
  
  get timeStamp(): number {
    const {
      original
    } = eventWrapperInternalDataGet(this);
    
    if ('timeStamp' in original) {
      return original.timeStamp ?? super.timeStamp;
    }
    
    return super.timeStamp;
  }
}

// Make association for wrappers.
wrapperClassCache.set(Object.prototype, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>);

const nativeEvent = (globalThis as unknown as {
  Event?: {
    prototype: object;
  };
}).Event;

if (nativeEvent !== undefined) {
  wrapperClassCache.set(nativeEvent.prototype, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>);
}
