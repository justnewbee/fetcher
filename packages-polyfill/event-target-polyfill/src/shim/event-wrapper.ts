/* eslint-disable @typescript-eslint/no-deprecated -- this wrapper intentionally proxies the deprecated members of the wrapped event. */

import {
  IEventClassType,
  TEventLike,
  TEventWrapperOf
} from '../types';
import {
  assertType
} from '../util';

import EventShim from './event-shim';

/**
 * Private data for event wrappers.
 */
interface IEventWrapperInternalData {
  readonly original: TEventLike;
}

/**
 * The constructor of an event wrapper.
 */
type TEventWrapperConstructor<T extends TEventLike> = new (event: T) => TEventWrapperOf<T>;

/**
 * Private data for event wrappers.
 */
const internalDataMap = new WeakMap<object, IEventWrapperInternalData>();

/**
 * Get private data.
 * @param event The event object to get private data.
 * @returns The private data of the event.
 */
function $(event: unknown): IEventWrapperInternalData {
  const retv = internalDataMap.get(event as object);

  assertType(
      retv !== undefined,
      '\'this\' is expected an Event object, but got %o',
      event
  );

  return retv;
}

/**
 * Cache for wrapper classes.
 */
const wrapperClassCache = new WeakMap<object, TEventWrapperConstructor<TEventLike>>();

/**
 * Get the property descriptor to redirect a given property.
 * @param obj The object that has the property.
 * @param key The name of the property.
 */
function defineRedirectDescriptor(obj: object, key: string): PropertyDescriptor {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);

  assertType(descriptor !== undefined, 'The property must be an own property of the given object: %o', key);

  return {
    get() {
      const original = $(this).original as Record<string, unknown>;
      const value = original[key];

      if (typeof value === 'function') {
        return value.bind(original) as unknown;
      }

      return value;
    },
    set(value: unknown) {
      const original = $(this).original as Record<string, unknown>;

      original[key] = value;
    },
    configurable: descriptor.configurable,
    enumerable: descriptor.enumerable
  };
}

/**
 * Define new wrapper class.
 * @param baseEventWrapper The base wrapper class.
 * @param originalPrototype The prototype of the original event.
 */
function defineWrapper(baseEventWrapper: TEventWrapperConstructor<TEventLike>, originalPrototype: object): TEventWrapperConstructor<TEventLike> {
  class CustomEventWrapper extends baseEventWrapper {}

  for (const key of Object.keys(originalPrototype)) {
    Object.defineProperty(
        CustomEventWrapper.prototype,
        key,
        defineRedirectDescriptor(originalPrototype, key)
    );
  }

  return CustomEventWrapper;
}

/**
 * Get the wrapper class of a given prototype.
 * @param originalEvent The event object to wrap.
 * @param baseEventWrapper The base wrapper class.
 */
function getWrapperClassOf<T extends TEventLike>(originalEvent: T, baseEventWrapper: TEventWrapperConstructor<TEventLike>): TEventWrapperConstructor<T> {
  const prototype = Object.getPrototypeOf(originalEvent) as object | null;

  if (prototype === null) {
    return baseEventWrapper as unknown as TEventWrapperConstructor<T>;
  }

  let wrapper = wrapperClassCache.get(prototype) as TEventWrapperConstructor<T> | undefined;

  if (wrapper === undefined) {
    wrapper = defineWrapper(
        getWrapperClassOf(prototype as unknown as TEventLike, baseEventWrapper),
        prototype
    ) as unknown as TEventWrapperConstructor<T>;
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
export class EventWrapper<EventType extends string> extends EventShim<EventType> {
  /**
   * Wrap a given event object to control states.
   * @param event The event-like object to wrap.
   */
  static wrap<T extends TEventLike>(event: T): TEventWrapperOf<T> {
    return new (getWrapperClassOf(event, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>))(event);
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

    internalDataMap.set(this, {
      original: event
    });

    // Define accessors
    const keys = Object.keys(event);

    for (const key of keys) {
      if (!(key in this)) {
        Object.defineProperty(
            this,
            key,
            defineRedirectDescriptor(event, key)
        );
      }
    }
  }

  stopPropagation(): void {
    super.stopPropagation();

    const {
      original
    } = $(this);

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
    } = $(this);

    if ('cancelBubble' in original) {
      original.cancelBubble = value;
    }
  }

  stopImmediatePropagation(): void {
    super.stopImmediatePropagation();

    const {
      original
    } = $(this);

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
    } = $(this);

    if ('returnValue' in original) {
      original.returnValue = value;
    }
  }

  preventDefault(): void {
    super.preventDefault();

    const {
      original
    } = $(this);

    if ('preventDefault' in original) {
      original.preventDefault?.();
    }
  }

  get timeStamp(): number {
    const {
      original
    } = $(this);

    if ('timeStamp' in original) {
      return original.timeStamp ?? super.timeStamp;
    }

    return super.timeStamp;
  }
}

// Make association for wrappers.
wrapperClassCache.set(Object.prototype, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>);

const nativeEvent = (globalThis as unknown as { Event?: { prototype: object; }; }).Event;

if (nativeEvent !== undefined) {
  wrapperClassCache.set(nativeEvent.prototype, EventWrapper as unknown as TEventWrapperConstructor<TEventLike>);
}
