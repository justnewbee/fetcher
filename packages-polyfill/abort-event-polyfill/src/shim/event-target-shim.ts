import {
  IEventClassType,
  IEventTargetClassType,
  TEventListener,
  IEventListenerAddOptions,
  IEventListenerOptions,
  TEventListenerLike,
  TEventListenerFallback,
  TEventData,
  TFallbackEvent
} from '../types';
import {
  isEventListenerOnce,
  isEventListenerPassive,
  isEventListenerRemoved,
  normalizeEventListenerAddOptions,
  normalizeEventListenerOptions,
  ensureEventListenerList,
  addEventListener,
  findEventListenerIndex,
  removeEventListener,
  removeEventListenerAt,
  warnEventListenerDuplicate,
  invokeEventListenerCallback,
  mapOfEventInternalGet,
  mapOfEventTargetListenerListMapGet,
  mapOfEventTargetListenerListMapSet
} from '../util';

import DOMExceptionShim from './dom-exception-shim';
import EventShim from './event-shim';
import EventWrapper from './event-wrapper';

/**
 * An implementation of the `EventTarget` interface.
 * @see https://dom.spec.whatwg.org/#eventtarget
 */
export default class EventTargetShim<EventMap extends Record<string, IEventClassType> = Record<string, IEventClassType>, Mode extends 'standard' | 'strict' = 'standard'> implements IEventTargetClassType<EventMap, Mode> {
  /**
   * Initialize this instance.
   */
  constructor() {
    mapOfEventTargetListenerListMapSet(this);
  }
  
  /**
   * Add an event listener.
   */
  addEventListener<Type extends string & keyof EventMap>(type: Type, callback?: TEventListener<this, EventMap[Type]> | null, options?: IEventListenerAddOptions): void;
  
  /**
   * Add an event listener.
   */
  addEventListener(type: string, callback?: TEventListenerFallback<this, Mode>, options?: IEventListenerAddOptions): void;
  
  /**
   * Add an event listener.
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  addEventListener<Type extends string & keyof EventMap>(type: Type, callback: TEventListener<this, EventMap[Type]> | null | undefined, capture: boolean): void;
  
  /**
   * Add an event listener.
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  addEventListener(type: string, callback: TEventListenerFallback<this, Mode>, capture: boolean): void;
  
  // Implementation
  addEventListener<Type extends string & keyof EventMap>(type0: Type, callback0?: TEventListener<this, EventMap[Type]> | null, options0?: boolean | IEventListenerAddOptions): void {
    const listenerMap = mapOfEventTargetListenerListMapGet(this);
    const {
      callback,
      capture,
      once,
      passive,
      signal,
      type
    } = normalizeEventListenerAddOptions(type0, callback0, options0);
    
    if (callback === undefined || signal?.aborted) {
      return;
    }
    
    const list = ensureEventListenerList(listenerMap, type);
    
    // Find existing listener.
    const index = findEventListenerIndex(list, callback as unknown as TEventListenerLike, capture);
    
    if (index !== -1) {
      const listener = list.listeners[index];
      
      if (listener !== undefined) {
        warnEventListenerDuplicate(listener, passive, once, signal);
      }
      
      return;
    }
    
    // Add the new listener.
    addEventListener(list, callback as unknown as TEventListenerLike, capture, passive, once, signal);
  }
  
  /**
   * Remove an added event listener.
   */
  removeEventListener<Type extends string & keyof EventMap>(type: Type, callback?: TEventListener<this, EventMap[Type]> | null, options?: IEventListenerOptions): void;
  
  /**
   * Remove an added event listener.
   */
  removeEventListener(type: string, callback?: TEventListenerFallback<this, Mode>, options?: IEventListenerOptions): void;
  
  /**
   * Remove an added event listener.
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  removeEventListener<Type extends string & keyof EventMap>(type: Type, callback: TEventListener<this, EventMap[Type]> | null | undefined, capture: boolean): void;
  
  /**
   * Remove an added event listener.
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  removeEventListener(type: string, callback: TEventListenerFallback<this, Mode>, capture: boolean): void;
  
  // Implementation
  removeEventListener<Type extends string & keyof EventMap>(type0: Type, callback0?: TEventListener<this, EventMap[Type]> | null, options0?: boolean | IEventListenerOptions): void {
    const listenerMap = mapOfEventTargetListenerListMapGet(this);
    const {
      callback,
      capture,
      type
    } = normalizeEventListenerOptions(type0, callback0, options0);
    const list = listenerMap[type];
    
    if (callback !== undefined && list !== undefined) {
      removeEventListener(list, callback as unknown as TEventListenerLike, capture);
    }
  }
  
  /**
   * Dispatch an event.
   */
  dispatchEvent<Type extends string & keyof EventMap>(event: TEventData<EventMap, Mode, Type>): boolean;
  
  /**
   * Dispatch an event.
   */
  dispatchEvent(event: TFallbackEvent<Mode>): boolean;
  
  // Implementation
  dispatchEvent(e: TEventData<EventMap, Mode, string> | TFallbackEvent<Mode>): boolean {
    const list = mapOfEventTargetListenerListMapGet(this)[e.type];
    
    if (list === undefined) {
      return true;
    }
    
    const event = e instanceof EventShim ? e : EventWrapper.wrap(e);
    const eventData = mapOfEventInternalGet(event, 'event');
    
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
