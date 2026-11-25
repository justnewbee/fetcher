import {
  EEventListenerFlags
} from '../enum';

import {
  TIsValidEventMap,
  TExplicitEventType
} from './common';

/**
 * An implementation of the `Event` interface.
 * @see https://dom.spec.whatwg.org/#interface-event
 */
export interface IEventClassType<EventType extends string = string> {
  /**
   * The type of this event.
   * @see https://dom.spec.whatwg.org/#dom-event-type
   */
  readonly type: EventType;
  /**
   * The event target of the current dispatching.
   * @see https://dom.spec.whatwg.org/#dom-event-target
   */
  readonly target: IEventTargetClassType | null;
  /**
   * The event target of the current dispatching.
   * @deprecated Use the `target` property instead.
   * @see https://dom.spec.whatwg.org/#dom-event-srcelement
   */
  readonly srcElement: IEventTargetClassType | null;
  /**
   * The event target of the current dispatching.
   * @see https://dom.spec.whatwg.org/#dom-event-currenttarget
   */
  readonly currentTarget: IEventTargetClassType | null;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-none
   */
  readonly NONE: 0;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-capturing_phase
   */
  readonly CAPTURING_PHASE: 1;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-at_target
   */
  readonly AT_TARGET: 2;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-bubbling_phase
   */
  readonly BUBBLING_PHASE: 3;
  /**
   * The current event phase.
   * @see https://dom.spec.whatwg.org/#dom-event-eventphase
   */
  readonly eventPhase: number;
  /**
   * `true` if this event will bubble.
   * @see https://dom.spec.whatwg.org/#dom-event-bubbles
   */
  readonly bubbles: boolean;
  /**
   * `true` if this event can be canceled by the `preventDefault()` method.
   * @see https://dom.spec.whatwg.org/#dom-event-cancelable
   */
  readonly cancelable: boolean;
  /**
   * `true` if the default behavior was canceled.
   * @see https://dom.spec.whatwg.org/#dom-event-defaultprevented
   */
  readonly defaultPrevented: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-composed
   */
  readonly composed: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-istrusted
   */
  readonly isTrusted: boolean;
  /**
   * @see https://dom.spec.whatwg.org/#dom-event-timestamp
   */
  readonly timeStamp: number;
  /**
   * `true` if event bubbling was stopped.
   * @deprecated
   * @see https://dom.spec.whatwg.org/#dom-event-cancelbubble
   */
  cancelBubble: boolean;
  /**
   * `true` if the default behavior will act.
   * @deprecated Use the `defaultPrevented` property instead.
   * @see https://dom.spec.whatwg.org/#dom-event-returnvalue
   */
  returnValue: boolean;
  /**
   * @deprecated Don't use this method. The constructor did initialization.
   */
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void;
  /**
   * Get the event path.
   * @see https://dom.spec.whatwg.org/#dom-event-composedpath
   */
  composedPath(): IEventTargetClassType[];
  /**
   * Stop event bubbling.
   * @see https://dom.spec.whatwg.org/#dom-event-stoppropagation
   */
  stopPropagation(): void;
  /**
   * Stop event bubbling and subsequent event listener callings.
   * @see https://dom.spec.whatwg.org/#dom-event-stopimmediatepropagation
   */
  stopImmediatePropagation(): void;
  /**
   * Cancel the default behavior.
   * @see https://dom.spec.whatwg.org/#dom-event-preventdefault
   */
  preventDefault(): void;
}

/**
 * An implementation of the `EventTarget` interface.
 *
 * @see https://dom.spec.whatwg.org/#eventtarget
 */
export interface IEventTargetClassType<EventMap extends Record<string, IEventClassType> = Record<string, IEventClassType>, Mode extends 'standard' | 'strict' = 'standard'> {
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
   *
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  addEventListener<Type extends string & keyof EventMap>(type: Type, callback: TEventListener<this, EventMap[Type]> | null | undefined, capture: boolean): void;
  /**
   * Add an event listener.
   *
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  addEventListener(type: string, callback: TEventListenerFallback<this, Mode>, capture: boolean): void;
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
   *
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  removeEventListener<Type extends string & keyof EventMap>(type: Type, callback: TEventListener<this, EventMap[Type]> | null | undefined, capture: boolean): void;
  /**
   * Remove an added event listener.
   *
   * @deprecated Use `{capture: boolean}` object instead of a boolean value.
   */
  removeEventListener(type: string, callback: TEventListenerFallback<this, Mode>, capture: boolean): void;
  /**
   * Dispatch an event.
   */
  dispatchEvent<Type extends string & keyof EventMap>(event: TEventData<EventMap, Mode, Type>): boolean;
  /**
   * Dispatch an event.
   */
  dispatchEvent(event: TFallbackEvent<Mode>): boolean;
}

/**
 * An implementation of the `AbortSignal` interface.
 *
 * @see https://dom.spec.whatwg.org/#interface-abortsignal
 */
export interface IAbortSignalClassType extends IEventTargetClassType<{
  abort: IEventClassType;
}> {
  /**
   * `true` if this signal has been aborted.
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-aborted
   */
  readonly aborted: boolean;
  /**
   * The abort reason.
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-reason
   */
  readonly reason: unknown;
  /**
   * The event handler for the `abort` event.
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-onabort
   */
  onabort: TEventListenerCallbackFunction<this, IEventClassType> | null;
  /**
   * Throw the abort reason if this signal has been aborted.
   * @see https://dom.spec.whatwg.org/#dom-abortsignal-throwifaborted
   */
  throwIfAborted(): void;
}

/**
 * An implementation of the `AbortController` interface.
 *
 * @see https://dom.spec.whatwg.org/#interface-abortcontroller
 */
export interface IAbortControllerClassType {
  /**
   * The `AbortSignal` object associated with this controller.
   * @see https://dom.spec.whatwg.org/#dom-abortcontroller-signal
   */
  readonly signal: IAbortSignalClassType;
  /**
   * Abort the associated signal with the given reason.
   * @see https://dom.spec.whatwg.org/#dom-abortcontroller-abort
   */
  abort(reason?: unknown): void;
}

/**
 * The callback type used when invoking listeners.
 */
export type TListenerCallback = (this: object, event: IEventClassType) => void;

/**
 * The event listener object.
 * @see https://dom.spec.whatwg.org/#callbackdef-eventlistener
 */
export interface IEventListenerObject<EventType extends IEventClassType = IEventClassType> {
  handleEvent(event: EventType): void;
}

/**
 * The event listener accepted by the internal listener list.
 */
export type TEventListenerLike = TListenerCallback | IEventListenerObject;

/**
 * The event listener concept.
 *
 * @see https://dom.spec.whatwg.org/#concept-event-listener
 */
export interface IEventListener {
  /**
   * The callback function.
   */
  readonly callback: TEventListenerLike;
  /**
   * The flags of this listener.
   * This is writable to add the removed flag.
   */
  flags: EEventListenerFlags;
  /**
   * The `AbortSignal` to remove this listener.
   */
  readonly signal: IAbortSignalClassType | undefined;
  /**
   * The `abort` event listener for the `signal`.
   * To remove it from the `signal`.
   */
  readonly signalListener: (() => void) | undefined;
}

/**
 * Information of a listener list.
 */
export interface IListenerList {
  /**
   * The callback function of the event attribute handler.
   */
  attrCallback: TEventListenerLike | undefined;
  /**
   * The listener of the event attribute handler.
   */
  attrListener: IEventListener | undefined;
  /**
   * `true` if the `dispatchEvent` method is traversing the current `listeners` array.
   */
  cow: boolean;
  /**
   * The listeners.
   * This is writable for copy-on-write.
   */
  listeners: IEventListener[];
}

/**
 * The map from event types to each listener list.
 */
export type TEventListenerListMap = Record<string, IListenerList | undefined>;

/**
 * Any `EventTarget` instance.
 */
export type TAnyEventTarget = IEventTargetClassType<Record<string, IEventClassType>, 'standard' | 'strict'>;

/**
 * The event listener function.
 */
export type TEventListenerCallbackFunction<Target extends TAnyEventTarget, EventType extends IEventClassType> = (this: Target, event: EventType) => void;

/**
 * The event listener.
 */
export type TEventListener<Target extends TAnyEventTarget, EventType extends IEventClassType> = TEventListenerCallbackFunction<Target, EventType> | IEventListenerObject<EventType>;

/**
 * The event data to dispatch in strict mode.
 */
export type TEventData<EventMap extends Record<string, IEventClassType>, Mode extends 'standard' | 'strict', EventType extends string> = Mode extends 'strict'
  ? TIsValidEventMap<EventMap> extends true
    ? TExplicitEventType<EventType> & Omit<EventMap[EventType], keyof IEventClassType> & Partial<Omit<IEventClassType, 'type'>>
    : never
  : never;

/**
 * The event listener type in standard mode.
 * Otherwise, never.
 */
export type TEventListenerFallback<Target extends TAnyEventTarget, Mode extends 'standard' | 'strict'> = Mode extends 'standard'
  ? TEventListener<Target, IEventClassType> | null | undefined
  : never;

/**
 * The event type in standard mode.
 * Otherwise, never.
 */
export type TFallbackEvent<Mode extends 'standard' | 'strict'> = Mode extends 'standard' ? IEventClassType : never;

/**
 * The common options for both `addEventListener` and `removeEventListener` methods.
 *
 * @see https://dom.spec.whatwg.org/#dictdef-eventlisteneroptions
 */
export interface IEventListenerOptions {
  capture?: boolean;
}

/**
 * The options for the `addEventListener` methods.
 *
 * @see https://dom.spec.whatwg.org/#dictdef-addeventlisteneroptions
 */
export interface IEventListenerAddOptions extends IEventListenerOptions {
  passive?: boolean;
  once?: boolean;
  signal?: IAbortSignalClassType | undefined;
}

/**
 * Normalized options of the `removeEventListener` method.
 */
export interface IEventListenerOptionsNormalized<Target extends TAnyEventTarget, EventType extends IEventClassType> {
  type: string;
  callback: TEventListener<Target, EventType> | undefined;
  capture: boolean;
}

/**
 * Normalized options of the `addEventListener` method.
 */
export interface IEventListenerAddOptionsNormalized<Target extends TAnyEventTarget, EventType extends IEventClassType> extends IEventListenerOptionsNormalized<Target, EventType> {
  passive: boolean;
  once: boolean;
  signal: IAbortSignalClassType | undefined;
}
