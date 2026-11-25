export { default as DOMException } from './shim/dom-exception-shim';
export { default as Event } from './shim/event-shim';
export { default as EventTarget } from './shim/event-target-shim';
export { default as AbortSignal } from './shim/abort-signal-shim';
export { default as AbortController } from './shim/abort-controller-shim';

export {
  getEventAttributeValue,
  setEventAttributeValue,
  setErrorHandler,
  setWarningHandler
} from './util';

export { default } from './polyfill';

export type {
  TEventListener as EventListener,
  TEventListenerCallbackFunction as CallbackFunction,
  IEventListenerObject as CallbackObject,
  IEventListenerOptions as Options,
  IEventListenerAddOptions as AddOptions,
  TEventData as EventData,
  TEventListenerFallback as FallbackEventListener,
  TFallbackEvent as FallbackEvent,
  IEventInit as EventInit
} from './types';
