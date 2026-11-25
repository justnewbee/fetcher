export { default as DOMException } from './shim/dom-exception-shim';
export { default as Event } from './shim/event-shim';
export { default as EventTarget } from './shim/event-target-shim';

export {
  getEventAttributeValue,
  setEventAttributeValue,
  setErrorHandler,
  setWarningHandler
} from './util';

export { default } from './polyfill';

export type {
  TEventListener as EventListener,
  TEventListenerCallback as CallbackFunction,
  IEventListenerObject as CallbackObject,
  IEventListenerOptions as Options,
  IEventListenerAddOptions as AddOptions,
  IAbortSignal as AbortSignal,
  TEventData as EventData,
  TEventListenerFallback as FallbackEventListener,
  TFallbackEvent as FallbackEvent,
  IEventInit as EventInit
} from './types';
