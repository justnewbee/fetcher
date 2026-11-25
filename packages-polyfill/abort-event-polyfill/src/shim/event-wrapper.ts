/* eslint-disable @typescript-eslint/no-deprecated */
import {
  IEventClassType,
  IEventWrapperClassType,
  TEventLike,
  TEventWrapperOf,
  TEventWrapperConstructor
} from '../types';
import {
  defineEventWrapperRedirectDescriptor,
  mapOfEventWrapperInternalGet,
  mapOfEventWrapperInternalSet,
  mapOfEventWrapperConstructorGet,
  mapOfEventWrapperConstructorSet
} from '../util';

import EventShim from './event-shim';

/**
 * An implementation of `Event` interface, that wraps a given event object.
 * This class controls the internal state of `Event`.
 *
 * @see https://dom.spec.whatwg.org/#interface-event
 */
export default class EventWrapper<EventType extends string> extends EventShim<EventType> implements IEventWrapperClassType<EventType> {
  /**
   * Wrap a given event object to control states.
   */
  static wrap<T extends TEventLike>(event: T): TEventWrapperOf<T> {
    return new (mapOfEventWrapperConstructorGet(event, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>))(event);
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
    
    mapOfEventWrapperInternalSet(this, {
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
    } = mapOfEventWrapperInternalGet(this);
    
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
    } = mapOfEventWrapperInternalGet(this);
    
    if ('cancelBubble' in original) {
      original.cancelBubble = value;
    }
  }
  
  stopImmediatePropagation(): void {
    super.stopImmediatePropagation();
    
    const {
      original
    } = mapOfEventWrapperInternalGet(this);
    
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
    } = mapOfEventWrapperInternalGet(this);
    
    if ('returnValue' in original) {
      original.returnValue = value;
    }
  }
  
  preventDefault(): void {
    super.preventDefault();
    
    const {
      original
    } = mapOfEventWrapperInternalGet(this);
    
    if ('preventDefault' in original) {
      original.preventDefault?.();
    }
  }
  
  get timeStamp(): number {
    const {
      original
    } = mapOfEventWrapperInternalGet(this);
    
    if ('timeStamp' in original) {
      return original.timeStamp ?? super.timeStamp;
    }
    
    return super.timeStamp;
  }
}

// Make association for wrappers
mapOfEventWrapperConstructorSet(Object.prototype, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>);

const nativeEvent = (globalThis as unknown as {
  Event?: {
    prototype: object;
  };
}).Event;

if (nativeEvent !== undefined) {
  mapOfEventWrapperConstructorSet(nativeEvent.prototype, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>);
}
