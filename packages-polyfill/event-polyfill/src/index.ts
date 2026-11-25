export { default as DOMException } from './shim/dom-exception-shim';
export { default as Event } from './shim/event-shim';
export { default as EventTarget } from './shim/event-target-shim';
export { default as AbortSignal } from './shim/abort-signal-shim';
export { default as AbortController } from './shim/abort-controller-shim';

export { default } from './polyfill';

export {
  Warning,
  setErrorHandler,
  setWarningHandler
} from './util';

export type {
  IWarningInfo as WarningInfo,
  TEventListenerCallbackFunction as CallbackFunction,
  TEventListener as EventListener,
  IEventListenerOptions as EventListenerOptions,
  IEventListenerAddOptions as EventListenerAddOptions,
  TEventData as EventData,
  IEventInit as EventInit
} from './types';
