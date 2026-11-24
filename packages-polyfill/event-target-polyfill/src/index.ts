export { default } from './shim/event-target-shim';
export { default as Event } from './shim/event-shim';
export {
  getEventAttributeValue,
  setEventAttributeValue
} from './shim/event-attribute-handler';
export {
  setErrorHandler
} from './shim/error-handler';
export {
  setWarningHandler
} from './shim/warning-handler';

export type {
  TEventListener as EventListener,
  TEventListenerCallback as CallbackFunction,
  IEventListenerObject as CallbackObject,
  IEventListenerOptions as Options,
  IAddEventListenerOptions as AddOptions,
  IAbortSignal as AbortSignal,
  TEventData as EventData,
  TFallbackEventListener as FallbackEventListener,
  TFallbackEvent as FallbackEvent,
  IEventInit as EventInit
} from './types';
