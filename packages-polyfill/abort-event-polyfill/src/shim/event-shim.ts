import {
  IEventClassType,
  IEventTargetClassType,
  IEventInit,
  IEventInternal
} from '../types';
import {
  CanceledInPassiveListener,
  FalsyWasAssignedToCancelBubble,
  InitEventWasCalledWhileDispatching,
  NonCancelableEventWasCanceled,
  TruthyWasAssignedToReturnValue,
  mapOfEventInternalGet,
  mapOfEventInternalSet
} from '../util';

// https://developer.mozilla.org/en-US/docs/Web/API/Event/eventPhase
const NONE = 0;
const CAPTURING_PHASE = 1;
const AT_TARGET = 2;
const BUBBLING_PHASE = 3;

const EVENT_CONSTANTS = {
  NONE,
  CAPTURING_PHASE,
  AT_TARGET,
  BUBBLING_PHASE
} as const;

const IS_TRUSTED = false;

/**
 * https://dom.spec.whatwg.org/#set-the-canceled-flag
 */
function setCancelFlag(data: IEventInternal): void {
  if (data.inPassiveListenerFlag) {
    CanceledInPassiveListener.warn();
    
    return;
  }
  
  if (!data.cancelable) {
    NonCancelableEventWasCanceled.warn();
    
    return;
  }
  
  data.canceledFlag = true;
}

/**
 * An implementation of `Event` interface, that wraps a given event object.
 * `EventTarget` shim can control the internal state of this `Event` objects.
 *
 * @see https://dom.spec.whatwg.org/#event
 */
export default class EventShim<EventType extends string = string> implements IEventClassType<EventType> {
  static readonly NONE = NONE;
  static readonly CAPTURING_PHASE = CAPTURING_PHASE;
  static readonly AT_TARGET = AT_TARGET;
  static readonly BUBBLING_PHASE = BUBBLING_PHASE;
  
  readonly NONE = NONE;
  readonly CAPTURING_PHASE = CAPTURING_PHASE;
  readonly AT_TARGET = AT_TARGET;
  readonly BUBBLING_PHASE = BUBBLING_PHASE;
  
  /**
   * Initialize this event instance.
   *
   * @see https://dom.spec.whatwg.org/#dom-event-event
   */
  constructor(type: EventType, eventInitDict?: IEventInit) {
    Object.defineProperty(this, 'isTrusted', {
      value: false,
      enumerable: true
    });
    
    const opts = eventInitDict ?? {};
    
    mapOfEventInternalSet(this, {
      type,
      bubbles: opts.bubbles ?? false,
      cancelable: opts.cancelable ?? false,
      composed: opts.composed ?? false,
      target: null,
      currentTarget: null,
      stopPropagationFlag: false,
      stopImmediatePropagationFlag: false,
      canceledFlag: false,
      inPassiveListenerFlag: false,
      dispatchFlag: false,
      timeStamp: Date.now()
    });
    
    // Class fields are writable at runtime, but the DOM's constants are read-only.
    for (const [key, value] of Object.entries(EVENT_CONSTANTS)) {
      Object.defineProperty(this, key, {
        value,
        writable: false,
        enumerable: true,
        configurable: true
      });
    }
  }
  
  /**
   * The type of this event.
   * @see https://dom.spec.whatwg.org/#dom-event-type
   */
  get type(): EventType {
    return mapOfEventInternalGet(this).type as EventType;
  }
  
  /**
   * The event target of the current dispatching.
   * @see https://dom.spec.whatwg.org/#dom-event-target
   */
  get target(): IEventTargetClassType | null {
    return mapOfEventInternalGet(this).target;
  }
  
  /**
   * The event target of the current dispatching.
   * @deprecated Use the `target` property instead.
   * @see https://dom.spec.whatwg.org/#dom-event-srcelement
   */
  get srcElement(): IEventTargetClassType | null {
    return mapOfEventInternalGet(this).target;
  }
  
  /**
   * The event target of the current dispatching.
   * @see https://dom.spec.whatwg.org/#dom-event-currenttarget
   */
  get currentTarget(): IEventTargetClassType | null {
    return mapOfEventInternalGet(this).currentTarget;
  }
  
  /**
   * The event target of the current dispatching.
   * This doesn't support node tree.
   * @see https://dom.spec.whatwg.org/#dom-event-composedpath
   */
  composedPath(): IEventTargetClassType[] {
    const currentTarget = mapOfEventInternalGet(this).currentTarget;
    
    if (currentTarget) {
      return [currentTarget];
    }
    
    return [];
  }
  
  /**
   * The current event phase.
   * @see https://dom.spec.whatwg.org/#dom-event-eventphase
   */
  get eventPhase(): number {
    return mapOfEventInternalGet(this).dispatchFlag ? 2 : 0;
  }
  
  /**
   * Stop event bubbling.
   * Because this shim doesn't support node tree, this merely changes the `cancelBubble` property value.
   * @see https://dom.spec.whatwg.org/#dom-event-stoppropagation
   */
  stopPropagation(): void {
    mapOfEventInternalGet(this).stopPropagationFlag = true;
  }
  
  /**
   * `true` if event bubbling was stopped.
   * @deprecated
   * @see https://dom.spec.whatwg.org/#dom-event-cancelbubble
   */
  get cancelBubble(): boolean {
    return mapOfEventInternalGet(this).stopPropagationFlag;
  }
  
  /**
   * Stop event bubbling if `true` is set.
   * @deprecated Use the `stopPropagation()` method instead.
   * @see https://dom.spec.whatwg.org/#dom-event-cancelbubble
   */
  set cancelBubble(value: boolean) {
    if (value) {
      mapOfEventInternalGet(this).stopPropagationFlag = true;
    } else {
      FalsyWasAssignedToCancelBubble.warn();
    }
  }
  
  /**
   * Stop event bubbling and subsequent event listener callings.
   * @see https://dom.spec.whatwg.org/#dom-event-stopimmediatepropagation
   */
  stopImmediatePropagation(): void {
    const data = mapOfEventInternalGet(this);
    
    data.stopPropagationFlag = data.stopImmediatePropagationFlag = true;
  }
  
  /**
   * `true` if this event will bubble.
   * @see https://dom.spec.whatwg.org/#dom-event-bubbles
   */
  get bubbles(): boolean {
    return mapOfEventInternalGet(this).bubbles;
  }
  
  /**
   * `true` if this event can be canceled by the `preventDefault()` method.
   * @see https://dom.spec.whatwg.org/#dom-event-cancelable
   */
  get cancelable(): boolean {
    return mapOfEventInternalGet(this).cancelable;
  }
  
  /**
   * `true` if the default behavior will act.
   * @deprecated Use the `defaultPrevented` proeprty instead.
   * @see https://dom.spec.whatwg.org/#dom-event-returnvalue
   */
  get returnValue(): boolean {
    return !mapOfEventInternalGet(this).canceledFlag;
  }
  
  /**
   * Cancel the default behavior if `false` is set.
   * @deprecated Use the `preventDefault()` method instead.
   * @see https://dom.spec.whatwg.org/#dom-event-returnvalue
   */
  set returnValue(value: boolean) {
    if (!value) {
      setCancelFlag(mapOfEventInternalGet(this));
    } else {
      TruthyWasAssignedToReturnValue.warn();
    }
  }
  
  /**
   * Cancel the default behavior.
   * @see https://dom.spec.whatwg.org/#dom-event-preventdefault
   */
  preventDefault(): void {
    setCancelFlag(mapOfEventInternalGet(this));
  }
  
  /**
   * `true` if the default behavior was canceled.
   * @see https://dom.spec.whatwg.org/#dom-event-defaultprevented
   */
  get defaultPrevented(): boolean {
    return mapOfEventInternalGet(this).canceledFlag;
  }
  
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-composed
   */
  get composed(): boolean {
    return mapOfEventInternalGet(this).composed;
  }
  
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-istrusted
   */
  get isTrusted(): boolean {
    return IS_TRUSTED;
  }
  
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-timestamp
   */
  get timeStamp(): number {
    return mapOfEventInternalGet(this).timeStamp;
  }
  
  /**
   * @deprecated Don't use this method. The constructor did initialization.
   */
  initEvent(type: string, bubbles = false, cancelable = false): void {
    const data = mapOfEventInternalGet(this);
    
    if (data.dispatchFlag) {
      InitEventWasCalledWhileDispatching.warn();
      
      return;
    }
    
    mapOfEventInternalSet(this, {
      ...data,
      type,
      bubbles,
      cancelable,
      target: null,
      currentTarget: null,
      stopPropagationFlag: false,
      stopImmediatePropagationFlag: false,
      canceledFlag: false
    });
  }
}

// Class fields are writable at runtime, but the DOM's constants are read-only.
for (const [key, value] of Object.entries(EVENT_CONSTANTS)) {
  Object.defineProperty(EventShim, key, {
    value,
    writable: false,
    enumerable: true,
    configurable: true
  });
}

// Class members are non-enumerable by default, but the DOM's Event exposes
// both the constants and the prototype members to for-in.
for (const key of Object.getOwnPropertyNames(EventShim.prototype)) {
  if (key === 'constructor') {
    continue;
  }
  
  Object.defineProperty(EventShim.prototype, key, {
    enumerable: true
  });
}
