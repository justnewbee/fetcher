import {
  IEventClassType,
  IEventTargetClassType,
  TAnyEventTarget,
  TEventListener,
  IAbortSignal,
  IAddEventListenerOptions,
  IEventListenerOptions,
  IEventListener,
  TEventListenerLike,
  TEventData,
  TFallbackEvent,
  TEventListenerListMap
} from '../types';
import {
  assertType,
  formatMessage,
  createEventListenerListMap,
  ensureEventListenerList,
  isEventListenerObject,
  isEventListenerCapture,
  isEventListenerOnce,
  isEventListenerPassive,
  isEventListenerRemoved,
  invokeEventListenerCallback,
  addEventListener,
  findEventListenerIndex,
  removeEventListener,
  removeEventListenerAt
} from '../util';

import EventShim, {
  getEventInternalData
} from './event-shim';
import {
  EventWrapper
} from './event-wrapper';
import {
  EventListenerWasDuplicated,
  InvalidEventListener,
  OptionWasIgnored
} from './warnings';
import {
  DOMExceptionShim
} from './dom-exception-shim';

/**
 * Normalized options of the `removeEventListener` method.
 */
interface INormalizedOptions<Target extends TAnyEventTarget, EventType extends IEventClassType> {
  type: string;
  callback: TEventListener<Target, EventType> | undefined;
  capture: boolean;
}

/**
 * Normalized options of the `addEventListener` method.
 */
interface INormalizedAddOptions<Target extends TAnyEventTarget, EventType extends IEventClassType> extends INormalizedOptions<Target, EventType> {
  passive: boolean;
  once: boolean;
  signal: IAbortSignal | undefined;
}

/**
 * Internal data.
 */
const internalDataMap = new WeakMap<object, TEventListenerListMap>();

/**
 * Get private data.
 */
export function getEventTargetInternalData(target: object, name = 'this'): TEventListenerListMap {
  const retv = internalDataMap.get(target);
  
  assertType(retv !== undefined, '\'%s\' must be an object that EventTarget constructor created, but got another one: %o', name, target);
  
  return retv;
}

/**
 * Check if the given value is an options object.
 * @param value The value to check.
 */
function isOptionsObject(value: unknown): value is IEventListenerOptions {
  return typeof value === 'object' && value !== null;
}

/**
 * Assert the type of 'callback' argument.
 * @param callback The callback to check.
 */
function assertCallback(callback: unknown): void {
  if (typeof callback === 'function' || isEventListenerObject(callback)) {
    return;
  }
  
  if (callback === null || callback === undefined || typeof callback === 'object') {
    InvalidEventListener.warn(callback);
    
    return;
  }
  
  throw new TypeError(formatMessage(InvalidEventListener.message, [callback]));
}

/**
 * Normalize the options of the `addEventListener` method.
 * @param type The event type.
 * @param callback The event listener.
 * @param options The options to normalize.
 */
function normalizeAddOptions<Target extends TAnyEventTarget, EventType extends IEventClassType>(type: string, callback: TEventListener<Target, EventType> | null | undefined, options: boolean | IAddEventListenerOptions | undefined): INormalizedAddOptions<Target, EventType> {
  assertCallback(callback);
  
  if (isOptionsObject(options)) {
    return {
      type,
      callback: callback ?? undefined,
      capture: options.capture ?? false,
      passive: options.passive ?? false,
      once: options.once ?? false,
      signal: options.signal ?? undefined
    };
  }
  
  return {
    type,
    callback: callback ?? undefined,
    capture: options ?? false,
    passive: false,
    once: false,
    signal: undefined
  };
}

/**
 * Normalize the options of the `removeEventListener` method.
 *
 * @param type The event type.
 * @param callback The event listener.
 * @param options The options to normalize.
 */
function normalizeOptions<Target extends TAnyEventTarget, EventType extends IEventClassType>(type: string, callback: TEventListener<Target, EventType> | null | undefined, options: boolean | IEventListenerOptions | undefined): INormalizedOptions<Target, EventType> {
  assertCallback(callback);
  
  if (isOptionsObject(options)) {
    return {
      type,
      callback: callback ?? undefined,
      capture: options.capture ?? false
    };
  }
  
  return {
    type,
    callback: callback ?? undefined,
    capture: options ?? false
  };
}

/**
 * Print warning for duplicated.
 * @param listener The current listener that is duplicated.
 * @param passive The passive flag of the new duplicated listener.
 * @param once The once flag of the new duplicated listener.
 * @param signal The signal object of the new duplicated listener.
 */
function warnDuplicate(listener: IEventListener, passive: boolean, once: boolean, signal: IAbortSignal | undefined): void {
  EventListenerWasDuplicated.warn(isEventListenerCapture(listener) ? 'capture' : 'bubble', listener.callback);
  
  if (isEventListenerPassive(listener) !== passive) {
    OptionWasIgnored.warn('passive');
  }
  
  if (isEventListenerOnce(listener) !== once) {
    OptionWasIgnored.warn('once');
  }
  
  if (listener.signal !== signal) {
    OptionWasIgnored.warn('signal');
  }
}

/**
 * An implementation of the `EventTarget` interface.
 * @see https://dom.spec.whatwg.org/#eventtarget
 */
export default class EventTargetShim<EventMap extends Record<string, IEventClassType> = Record<string, IEventClassType>, Mode extends 'standard' | 'strict' = 'standard'> implements IEventTargetClassType<EventMap, Mode> {
  /**
   * Initialize this instance.
   */
  constructor() {
    internalDataMap.set(this, createEventListenerListMap());
  }
  
  // /**
  //  * Add an event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param options Options.
  //  */
  // addEventListener<Type extends string & keyof EventMap>(type: Type, callback?: TEventListener<this, EventMap[Type]> | null, options?: IAddEventListenerOptions): void;
  //
  // /**
  //  * Add an event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param options Options.
  //  */
  // addEventListener(type: string, callback?: TFallbackEventListener<this, Mode>, options?: IAddEventListenerOptions): void;
  //
  // /**
  //  * Add an event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param capture The capture flag.
  //  * @deprecated Use `{capture: boolean}` object instead of a boolean value.
  //  */
  // addEventListener<Type extends string & keyof EventMap>(type: Type, callback: TEventListener<this, EventMap[Type]> | null | undefined, capture: boolean): void;
  //
  // /**
  //  * Add an event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param capture The capture flag.
  //  * @deprecated Use `{capture: boolean}` object instead of a boolean value.
  //  */
  // addEventListener(type: string, callback: TFallbackEventListener<this, Mode>, capture: boolean): void;
  
  // Implementation
  addEventListener<Type extends string & keyof EventMap>(type0: Type, callback0?: TEventListener<this, EventMap[Type]> | null, options0?: boolean | IAddEventListenerOptions): void {
    const listenerMap = getEventTargetInternalData(this);
    const {
      callback,
      capture,
      once,
      passive,
      signal,
      type
    } = normalizeAddOptions(type0, callback0, options0);
    
    if (callback === undefined || signal?.aborted) {
      return;
    }
    
    const list = ensureEventListenerList(listenerMap, type);
    
    // Find existing listener.
    const index = findEventListenerIndex(list, callback as unknown as TEventListenerLike, capture);
    
    if (index !== -1) {
      const listener = list.listeners[index];
      
      if (listener !== undefined) {
        warnDuplicate(listener, passive, once, signal);
      }
      
      return;
    }
    
    // Add the new listener.
    addEventListener(list, callback as unknown as TEventListenerLike, capture, passive, once, signal);
  }
  
  // /**
  //  * Remove an added event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param options Options.
  //  */
  // removeEventListener<Type extends string & keyof EventMap>(type: Type, callback?: TEventListener<this, EventMap[Type]> | null, options?: IEventListenerOptions): void;
  //
  // /**
  //  * Remove an added event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param options Options.
  //  */
  // removeEventListener(type: string, callback?: TFallbackEventListener<this, Mode>, options?: IEventListenerOptions): void;
  //
  // /**
  //  * Remove an added event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param capture The capture flag.
  //  * @deprecated Use `{capture: boolean}` object instead of a boolean value.
  //  */
  // removeEventListener<Type extends string & keyof EventMap>(type: Type, callback: TEventListener<this, EventMap[Type]> | null | undefined, capture: boolean): void;
  //
  // /**
  //  * Remove an added event listener.
  //  * @param type The event type.
  //  * @param callback The event listener.
  //  * @param capture The capture flag.
  //  * @deprecated Use `{capture: boolean}` object instead of a boolean value.
  //  */
  // removeEventListener(type: string, callback: TFallbackEventListener<this, Mode>, capture: boolean): void;
  
  // Implementation
  removeEventListener<Type extends string & keyof EventMap>(type0: Type, callback0?: TEventListener<this, EventMap[Type]> | null, options0?: boolean | IEventListenerOptions): void {
    const listenerMap = getEventTargetInternalData(this);
    const {
      callback,
      capture,
      type
    } = normalizeOptions(type0, callback0, options0);
    const list = listenerMap[type];
    
    if (callback !== undefined && list !== undefined) {
      removeEventListener(list, callback as unknown as TEventListenerLike, capture);
    }
  }
  
  // /**
  //  * Dispatch an event.
  //  * @param event The `Event` object to dispatch.
  //  */
  // dispatchEvent<Type extends string & keyof EventMap>(event: TEventData<EventMap, Mode, Type>): boolean;
  //
  // /**
  //  * Dispatch an event.
  //  * @param event The `Event` object to dispatch.
  //  */
  // dispatchEvent(event: TFallbackEvent<Mode>): boolean;
  
  // Implementation
  dispatchEvent(e: TEventData<EventMap, Mode, string> | TFallbackEvent<Mode>): boolean {
    const list = getEventTargetInternalData(this)[e.type];
    
    if (list === undefined) {
      return true;
    }
    
    const event = e instanceof EventShim ? e : EventWrapper.wrap(e);
    const eventData = getEventInternalData(event, 'event');
    
    if (eventData.dispatchFlag) {
      if (typeof DOMException !== 'undefined') {
        throw new DOMException('This event has been in dispatching.', 'InvalidStateError');
      }
      
      throw new DOMExceptionShim('This event has been in dispatching.', 'InvalidStateError');
    }
    
    eventData.dispatchFlag = true;
    eventData.target = eventData.currentTarget = this;
    
    if (!eventData.stopPropagationFlag) {
      const {
        cow,
        listeners
      } = list;
      
      // Set copy-on-write flag.
      list.cow = true;
      
      // Call listeners.
      for (let i = 0; i < listeners.length; ++i) {
        const listener = listeners[i];
        
        if (listener === undefined) {
          continue;
        }
        
        // Skip if removed.
        if (isEventListenerRemoved(listener)) {
          continue;
        }
        
        // Remove this listener if has the `once` flag.
        if (isEventListenerOnce(listener) && removeEventListenerAt(list, i, !cow)) {
          // Because this listener was removed, the next index is the
          // same as the current value.
          i -= 1;
        }
        
        // Call this listener with the `passive` flag.
        eventData.inPassiveListenerFlag = isEventListenerPassive(listener);
        invokeEventListenerCallback(listener, this, event);
        eventData.inPassiveListenerFlag = false;
        
        // Stop if the `event.stopImmediatePropagation()` method was called.
        if (eventData.stopImmediatePropagationFlag) {
          break;
        }
      }
      
      // Restore copy-on-write flag.
      if (!cow) {
        list.cow = false;
      }
    }
    
    eventData.target = null;
    eventData.currentTarget = null;
    eventData.stopImmediatePropagationFlag = false;
    eventData.stopPropagationFlag = false;
    eventData.dispatchFlag = false;
    
    return !eventData.canceledFlag;
  }
}

// Class members are non-enumerable by default, but the DOM's EventTarget
// exposes its prototype members to for-in.
for (const key of Object.getOwnPropertyNames(EventTargetShim.prototype)) {
  if (key === 'constructor') {
    continue;
  }
  
  Object.defineProperty(EventTargetShim.prototype, key, {
    enumerable: true
  });
}

globalThis.EventTarget = EventTargetShim;
